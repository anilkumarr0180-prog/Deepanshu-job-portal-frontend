import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import useAuth from "@/features/auth/hooks/useAuth";
import { type ChatMessage, getUserIdString } from "../types/chat.types";

import {
  setOnlineUsers,
  setUserTyping,
  setUserStopTyping,
  setUnreadTotalCount,
  decrementUnreadCount,
} from "../store/chatSlice";

/**
 * useChatSocket — singleton socket connection for the lifetime of the authenticated session.
 *
 * Key design decisions (senior dev rationale):
 *   1. Socket is created ONCE per user session — NOT per conversation.
 *      Reconnecting on every conversation switch caused message drops and unreliable delivery.
 *   2. Conversation room join/leave is handled in a SEPARATE, lightweight effect so the
 *      main socket connection stays stable while only room membership changes.
 *   3. Query cache keys match exactly what the useMessages hook uses: ["messages", convId, 1, 50].
 *      Mismatched keys caused socket updates to go into a different cache bucket, making
 *      real-time messages invisible until the next manual refetch.
 */
export const useChatSocket = (activeConversationId?: string | null) => {
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { user, token } = useAuth();

  const currentUserId = user?.id || (user as any)?._id || "";
  const currentUserName = user?.name || (user as any)?.firstName || "User";

  // Keep a ref to the active conversation ID so the socket listener closure always has the latest value
  const activeConversationIdRef = useRef(activeConversationId);
  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  // ─── Effect 1: Socket lifecycle — runs ONCE per auth session ─────────────
  useEffect(() => {
    if (!token || !user) return;

    const socketUrl = import.meta.env.VITE_API_URL
      ? new URL(import.meta.env.VITE_API_URL).origin
      : "http://localhost:5000";

    const socket = io(socketUrl, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      // Don't reconnect automatically if server closes — let reconnectionAttempts handle it
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Chat Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Chat Socket connection error:", err.message);
    });

    // ── Online presence ───────────────────────────────────────────────────
    socket.on("online_users", (users: string[]) => {
      dispatch(setOnlineUsers(users));
    });

    // ── Incoming message ─────────────────────────────────────────────────
    // NOTE: Cache key ["messages", conversationId, 1, 50] must match useMessages hook.
    // We append optimistically to page 1 only. Older pages are unaffected.
    socket.on("message_received", (data: { message: ChatMessage; conversationId: string }) => {
      const { message, conversationId } = data;
      const senderIdStr = getUserIdString(message.senderId);

      // Optimistically append to the cached page-1 messages list
      queryClient.setQueryData(
        ["messages", conversationId, 1, 50],
        (old: { messages: ChatMessage[]; pagination?: unknown } | undefined) => {
          if (!old) return { messages: [message] };
          const exists = old.messages.some((m) => (m._id || m.id) === (message._id || message.id));
          if (exists) return old;
          return { ...old, messages: [...old.messages, message] };
        }
      );

      // Refresh sidebar last-message preview
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      // Auto-mark as read if the recipient is currently viewing this conversation
      if (activeConversationIdRef.current === conversationId && senderIdStr !== currentUserId) {
        socket.emit("mark_read", { conversationId });
        
        // Optimistically clear the unread count in the sidebar and Redux
        const prevData: any = queryClient.getQueryData(["conversations"]);
        if (prevData?.conversations) {
          const conv = prevData.conversations.find((c: any) => (c._id || c.id) === conversationId);
          if (conv && conv.unreadCount > 0) {
            dispatch(decrementUnreadCount(conv.unreadCount));
          }
        }

        queryClient.setQueryData(["conversations"], (old: any) => {
          if (!old?.conversations) return old;
          return {
            ...old,
            conversations: old.conversations.map((c: any) => 
              (c._id || c.id) === conversationId ? { ...c, unreadCount: 0 } : c
            )
          };
        });
      }
    });

    // ── Conversation list update (from any device/tab) ────────────────────
    socket.on(
      "conversation_updated",
      (data: { conversationId: string; lastMessage: ChatMessage; unreadTotal: number }) => {
        if (typeof data.unreadTotal === "number") {
          dispatch(setUnreadTotalCount(data.unreadTotal));
        }
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    );

    socket.on("unread_count_updated", (data: { unreadTotal: number }) => {
      if (typeof data.unreadTotal === "number") {
        dispatch(setUnreadTotalCount(data.unreadTotal));
      }
    });

    // ── Typing indicators (auto-clear after 3.5 s as safety net) ─────────
    socket.on(
      "user_typing",
      (data: { conversationId: string; userId: string; userName?: string }) => {
        dispatch(setUserTyping(data));
        const key = `${data.conversationId}_${data.userId}`;
        if (typingTimeoutsRef.current[key]) clearTimeout(typingTimeoutsRef.current[key]);
        typingTimeoutsRef.current[key] = setTimeout(() => {
          dispatch(setUserStopTyping({ conversationId: data.conversationId, userId: data.userId }));
          delete typingTimeoutsRef.current[key];
        }, 3500);
      }
    );

    socket.on("user_stop_typing", (data: { conversationId: string; userId: string }) => {
      dispatch(setUserStopTyping(data));
      const key = `${data.conversationId}_${data.userId}`;
      if (typingTimeoutsRef.current[key]) {
        clearTimeout(typingTimeoutsRef.current[key]);
        delete typingTimeoutsRef.current[key];
      }
    });

    // ── Read receipts (double-tick sync) ─────────────────────────────────
    socket.on(
      "messages_read",
      (data: { conversationId: string; readByUserId: string; readAt: string }) => {
        queryClient.setQueryData(
          ["messages", data.conversationId, 1, 50],
          (old: { messages: ChatMessage[] } | undefined) => {
            if (!old) return old;
            return {
              ...old,
              messages: old.messages.map((msg) => {
                const senderIdStr = getUserIdString(msg.senderId);
                if (senderIdStr !== data.readByUserId) {
                  return { ...msg, isRead: true, readAt: data.readAt };
                }
                return msg;
              }),
            };
          }
        );
        
        // Optimistically update conversation unread count to 0 in sidebar and Redux
        const prevData: any = queryClient.getQueryData(["conversations"]);
        if (prevData?.conversations && data.readByUserId === currentUserId) {
          const conv = prevData.conversations.find((c: any) => (c._id || c.id) === data.conversationId);
          if (conv && conv.unreadCount > 0) {
            dispatch(decrementUnreadCount(conv.unreadCount));
          }
        }

        queryClient.setQueryData(["conversations"], (old: any) => {
          if (!old?.conversations) return old;
          return {
            ...old,
            conversations: old.conversations.map((c: any) => 
              (c._id || c.id) === data.conversationId 
                ? { ...c, unreadCount: data.readByUserId === currentUserId ? 0 : c.unreadCount, lastMessageId: c.lastMessageId ? { ...c.lastMessageId, isRead: true } : c.lastMessageId } 
                : c
            )
          };
        });
      }
    );

    // ── Edit Message Sync ─────────────────────────────────────────────────
    socket.on("message_edited", (data: { message: ChatMessage; conversationId: string }) => {
      const { message, conversationId } = data;
      queryClient.setQueryData(
        ["messages", conversationId, 1, 50],
        (old: { messages: ChatMessage[]; pagination?: unknown } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            messages: old.messages.map((m) =>
              (m._id || m.id) === (message._id || message.id) ? message : m
            ),
          };
        }
      );
    });

    // ── Delete Message Sync ───────────────────────────────────────────────
    socket.on(
      "message_deleted",
      (data: {
        message: ChatMessage;
        conversationId: string;
        deleteForEveryone: boolean;
        deletedByUserId: string;
      }) => {
        const { message, conversationId, deleteForEveryone, deletedByUserId } = data;
        
        queryClient.setQueryData(
          ["messages", conversationId, 1, 50],
          (old: { messages: ChatMessage[]; pagination?: unknown } | undefined) => {
            if (!old) return old;
            
            if (deleteForEveryone) {
              // Update to masked message
              return {
                ...old,
                messages: old.messages.map((m) =>
                  (m._id || m.id) === (message._id || message.id) ? message : m
                ),
              };
            } else {
              // Only filter it out if I am the one who deleted it
              if (deletedByUserId === currentUserId) {
                return {
                  ...old,
                  messages: old.messages.filter(
                    (m) => (m._id || m.id) !== (message._id || message.id)
                  ),
                };
              }
            }
            return old;
          }
        );
      }
    );

    socket.on("disconnect", (reason) => {
      console.log("🔌 Chat Socket disconnected:", reason);
    });

    return () => {
      // Only disconnect when the user logs out / component fully unmounts
      Object.values(typingTimeoutsRef.current).forEach(clearTimeout);
      typingTimeoutsRef.current = {};
      socket.disconnect();
      socketRef.current = null;
    };
    // ⚠️ Intentionally excludes activeConversationId — socket lifecycle is
    // independent of which conversation is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currentUserId]);

  // ─── Effect 2: Room join/leave — runs when active conversation changes ──
  // Keeps socket stable; only changes which Socket.IO room we're in.
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeConversationId) return;

    socket.emit("join_conversation", { conversationId: activeConversationId });
    socket.emit("mark_read", { conversationId: activeConversationId });

    return () => {
      socket.emit("leave_conversation", { conversationId: activeConversationId });
    };
  }, [activeConversationId]);

  // ─── Actions exposed to components ──────────────────────────────────────

  const sendMessage = useCallback(
    (
      conversationId: string,
      messageText: string,
      messageType = "text",
      attachments: Array<{ url: string; name?: string; size?: number; mimeType?: string }> = []
    ) => {
      const socket = socketRef.current;
      if (socket?.connected) {
        socket.emit("send_message", {
          conversationId,
          message: messageText,
          messageType,
          attachments,
        });
      } else {
        console.warn("Socket not connected — message not sent");
      }
    },
    []
  );

  const startTyping = useCallback(
    (conversationId: string) => {
      socketRef.current?.emit("typing_start", {
        conversationId,
        userName: currentUserName,
      });
    },
    [currentUserName]
  );

  const stopTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit("typing_stop", { conversationId });
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    socketRef.current?.emit("mark_read", { conversationId });
  }, []);

  const editMessage = useCallback((conversationId: string, messageId: string, newText: string) => {
    socketRef.current?.emit("edit_message", { conversationId, messageId, newText });
  }, []);

  const deleteMessage = useCallback(
    (conversationId: string, messageId: string, deleteForEveryone: boolean) => {
      socketRef.current?.emit("delete_message", { conversationId, messageId, deleteForEveryone });
    },
    []
  );

  return {
    socket: socketRef.current,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    editMessage,
    deleteMessage,
  };
};
