import { useEffect, useCallback } from "react";
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
 * Shared singleton socket state across hook instances.
 * This guarantees:
 *   1. Exactly ONE Socket.IO connection exists for the authenticated user session.
 *   2. Multiple components (DashboardLayout, CandidateMessagesPage, RecruiterMessagesPage)
 *      share the same underlying connection without opening duplicate connections.
 *   3. Polling-first transport order eliminates React StrictMode premature WebSocket closure warnings.
 *   4. Room management (join/leave) is handled per-active conversation without reconnecting the socket.
 */
let sharedSocket: Socket | null = null;
let sharedSocketToken: string | null = null;
let consumerCount = 0;
let disconnectTimer: ReturnType<typeof setTimeout> | null = null;
const typingTimeouts: Record<string, ReturnType<typeof setTimeout>> = {};

// Active conversation tracker accessible to socket listener closures
let currentActiveConversationId: string | null = null;

export const useChatSocket = (activeConversationId?: string | null) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { user, token } = useAuth();

  const currentUserId = user?.id || (user as any)?._id || "";
  const currentUserName = user?.name || (user as any)?.firstName || "User";

  // Keep global active conversation tracker up to date
  useEffect(() => {
    if (activeConversationId !== undefined) {
      currentActiveConversationId = activeConversationId;
    }
    return () => {
      if (activeConversationId !== undefined && currentActiveConversationId === activeConversationId) {
        currentActiveConversationId = null;
      }
    };
  }, [activeConversationId]);

  // â”€â”€â”€ Effect 1: Singleton Socket Lifecycle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!token || !user) {
      if (sharedSocket) {
        sharedSocket.disconnect();
        sharedSocket = null;
        sharedSocketToken = null;
      }
      return;
    }

    // Cancel any pending disconnect from a previous unmount
    if (disconnectTimer) {
      clearTimeout(disconnectTimer);
      disconnectTimer = null;
    }

    consumerCount++;

    const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const backendUrl = rawApiUrl.replace(/\/api\/?$/, "");

    // Create socket if not created or if token has changed
    if (!sharedSocket || sharedSocketToken !== token) {
      if (sharedSocket) {
        sharedSocket.disconnect();
      }

      const socket = io(backendUrl, {
        auth: { token: `Bearer ${token}` },
        transports: ["polling", "websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
      });

      sharedSocket = socket;
      sharedSocketToken = token;

      socket.on("connect", () => {
        console.log("âœ… Chat Socket connected:", socket.id);
      });

      socket.on("connect_error", (err) => {
        console.error("âŒ Chat Socket connection error:", err.message);
      });

      // â”€â”€ Online presence â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      socket.on("online_users", (users: string[]) => {
        dispatch(setOnlineUsers(users));
      });

      // â”€â”€ Incoming message â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      socket.on(
        "message_received",
        (data: { message: ChatMessage; conversationId: string }) => {
          const { message, conversationId } = data;
          const senderIdStr = getUserIdString(message.senderId);

          // Optimistically append to the cached page-1 messages list
          queryClient.setQueryData(
            ["messages", conversationId, 1, 50],
            (old: { messages: ChatMessage[]; pagination?: unknown } | undefined) => {
              if (!old) return { messages: [message] };
              const exists = old.messages.some(
                (m) => (m._id || m.id) === (message._id || message.id)
              );
              if (exists) return old;
              return { ...old, messages: [...old.messages, message] };
            }
          );

          // Refresh sidebar last-message preview
          queryClient.invalidateQueries({ queryKey: ["conversations"] });

          // Auto-mark as read if the recipient is currently viewing this conversation
          if (
            currentActiveConversationId === conversationId &&
            senderIdStr !== currentUserId
          ) {
            socket.emit("mark_read", { conversationId });

            // Optimistically clear the unread count in the sidebar and Redux
            const prevData: any = queryClient.getQueryData(["conversations"]);
            if (prevData?.conversations) {
              const conv = prevData.conversations.find(
                (c: any) => (c._id || c.id) === conversationId
              );
              if (conv && conv.unreadCount > 0) {
                dispatch(decrementUnreadCount(conv.unreadCount));
              }
            }

            queryClient.setQueryData(["conversations"], (old: any) => {
              if (!old?.conversations) return old;
              return {
                ...old,
                conversations: old.conversations.map((c: any) =>
                  (c._id || c.id) === conversationId
                    ? { ...c, unreadCount: 0 }
                    : c
                ),
              };
            });
          }
        }
      );

      // â”€â”€ Conversation list update â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      socket.on(
        "conversation_updated",
        (data: {
          conversationId: string;
          lastMessage: ChatMessage;
          unreadTotal: number;
        }) => {
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

      // â”€â”€ Typing indicators â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      socket.on(
        "user_typing",
        (data: {
          conversationId: string;
          userId: string;
          userName?: string;
        }) => {
          dispatch(setUserTyping(data));
          const key = `${data.conversationId}_${data.userId}`;
          if (typingTimeouts[key]) clearTimeout(typingTimeouts[key]);
          typingTimeouts[key] = setTimeout(() => {
            dispatch(
              setUserStopTyping({
                conversationId: data.conversationId,
                userId: data.userId,
              })
            );
            delete typingTimeouts[key];
          }, 3500);
        }
      );

      socket.on(
        "user_stop_typing",
        (data: { conversationId: string; userId: string }) => {
          dispatch(setUserStopTyping(data));
          const key = `${data.conversationId}_${data.userId}`;
          if (typingTimeouts[key]) {
            clearTimeout(typingTimeouts[key]);
            delete typingTimeouts[key];
          }
        }
      );

      // â”€â”€ Read receipts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      socket.on(
        "messages_read",
        (data: {
          conversationId: string;
          readByUserId: string;
          readAt: string;
        }) => {
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

          // Optimistically update conversation unread count in sidebar and Redux
          const prevData: any = queryClient.getQueryData(["conversations"]);
          if (prevData?.conversations && data.readByUserId === currentUserId) {
            const conv = prevData.conversations.find(
              (c: any) => (c._id || c.id) === data.conversationId
            );
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
                  ? {
                      ...c,
                      unreadCount:
                        data.readByUserId === currentUserId ? 0 : c.unreadCount,
                      lastMessageId: c.lastMessageId
                        ? { ...c.lastMessageId, isRead: true }
                        : c.lastMessageId,
                    }
                  : c
              ),
            };
          });
        }
      );

      // â”€â”€ Edit Message Sync â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      socket.on(
        "message_edited",
        (data: { message: ChatMessage; conversationId: string }) => {
          const { message, conversationId } = data;
          queryClient.setQueryData(
            ["messages", conversationId, 1, 50],
            (
              old: { messages: ChatMessage[]; pagination?: unknown } | undefined
            ) => {
              if (!old) return old;
              return {
                ...old,
                messages: old.messages.map((m) =>
                  (m._id || m.id) === (message._id || message.id) ? message : m
                ),
              };
            }
          );
        }
      );

      // â”€â”€ Delete Message Sync â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      socket.on(
        "message_deleted",
        (data: {
          message: ChatMessage;
          conversationId: string;
          deleteForEveryone: boolean;
          deletedByUserId: string;
        }) => {
          const {
            message,
            conversationId,
            deleteForEveryone,
            deletedByUserId,
          } = data;

          queryClient.setQueryData(
            ["messages", conversationId, 1, 50],
            (
              old: { messages: ChatMessage[]; pagination?: unknown } | undefined
            ) => {
              if (!old) return old;

              if (deleteForEveryone) {
                return {
                  ...old,
                  messages: old.messages.map((m) =>
                    (m._id || m.id) === (message._id || message.id)
                      ? message
                      : m
                  ),
                };
              } else {
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
        console.log("ðŸ”Œ Chat Socket disconnected:", reason);
      });
    }

    return () => {
      consumerCount--;
      if (consumerCount <= 0) {
        consumerCount = 0;
        // Grace period before disconnecting to handle React StrictMode double-mount or route transitions smoothly
        disconnectTimer = setTimeout(() => {
          if (consumerCount === 0 && sharedSocket) {
            Object.values(typingTimeouts).forEach(clearTimeout);
            sharedSocket.disconnect();
            sharedSocket = null;
            sharedSocketToken = null;
          }
        }, 1000);
      }
    };
  }, [token, user, currentUserId, queryClient, dispatch]);

  // â”€â”€â”€ Effect 2: Room join/leave â€” runs when active conversation changes â”€â”€
  useEffect(() => {
    const socket = sharedSocket;
    if (!socket || !activeConversationId) return;

    socket.emit("join_conversation", { conversationId: activeConversationId });
    socket.emit("mark_read", { conversationId: activeConversationId });

    return () => {
      socket.emit("leave_conversation", {
        conversationId: activeConversationId,
      });
    };
  }, [activeConversationId]);

  // â”€â”€â”€ Actions exposed to components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const sendMessage = useCallback(
    (
      conversationId: string,
      messageText: string,
      messageType = "text",
      attachments: Array<{
        url: string;
        name?: string;
        size?: number;
        mimeType?: string;
      }> = []
    ) => {
      const socket = sharedSocket;
      if (socket?.connected) {
        socket.emit("send_message", {
          conversationId,
          message: messageText,
          messageType,
          attachments,
        });
      } else {
        console.warn("Chat socket not connected â€” message not sent");
      }
    },
    []
  );

  const startTyping = useCallback(
    (conversationId: string) => {
      sharedSocket?.emit("typing_start", {
        conversationId,
        userName: currentUserName,
      });
    },
    [currentUserName]
  );

  const stopTyping = useCallback((conversationId: string) => {
    sharedSocket?.emit("typing_stop", { conversationId });
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    sharedSocket?.emit("mark_read", { conversationId });
  }, []);

  const editMessage = useCallback(
    (conversationId: string, messageId: string, newText: string) => {
      sharedSocket?.emit("edit_message", {
        conversationId,
        messageId,
        newText,
      });
    },
    []
  );

  const deleteMessage = useCallback(
    (
      conversationId: string,
      messageId: string,
      deleteForEveryone: boolean
    ) => {
      sharedSocket?.emit("delete_message", {
        conversationId,
        messageId,
        deleteForEveryone,
      });
    },
    []
  );

  return {
    socket: sharedSocket,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    editMessage,
    deleteMessage,
  };
};

