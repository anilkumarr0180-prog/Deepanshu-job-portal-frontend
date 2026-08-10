import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/app/store/store";
import type { ChatMessage } from "../types/chat.types";

import {
  setOnlineUsers,
  setUserTyping,
  setUserStopTyping,
  setUnreadTotalCount,
} from "../store/chatSlice";

export const useChatSocket = (activeConversationId?: string | null) => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token || !user) return;

    // Connect to Socket server
    const socketUrl = import.meta.env.VITE_API_URL
      ? new URL(import.meta.env.VITE_API_URL).origin
      : "http://localhost:5000";

    const socket = io(socketUrl, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Chat Socket connected:", socket.id);
      if (activeConversationId) {
        socket.emit("join_conversation", { conversationId: activeConversationId });
      }
    });

    // Handle online users list
    socket.on("online_users", (users: string[]) => {
      dispatch(setOnlineUsers(users));
    });

    // Handle incoming messages
    socket.on("message_received", (data: { message: ChatMessage; conversationId: string }) => {
      const { message, conversationId } = data;

      // Update message list in query cache
      queryClient.setQueryData(
        ["messages", conversationId],
        (old: { messages: ChatMessage[] } | undefined) => {
          if (!old) return { messages: [message] };
          const exists = old.messages.some((m) => m._id === message._id);
          if (exists) return old;
          return { ...old, messages: [...old.messages, message] };
        }
      );

      // Refresh conversation list
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      // If active conversation, auto mark as read
      if (activeConversationId === conversationId && message.senderId !== user.id) {
        socket.emit("mark_read", { conversationId });
      }
    });

    // Handle conversation list updates
    socket.on(
      "conversation_updated",
      (data: { conversationId: string; lastMessage: ChatMessage; unreadTotal: number }) => {
        dispatch(setUnreadTotalCount(data.unreadTotal));
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    );

    // Handle typing events
    socket.on("user_typing", (data: { conversationId: string; userId: string }) => {
      dispatch(setUserTyping(data));
    });

    socket.on("user_stop_typing", (data: { conversationId: string; userId: string }) => {
      dispatch(setUserStopTyping(data));
    });

    // Handle messages read confirmation
    socket.on(
      "messages_read",
      (data: { conversationId: string; readByUserId: string; readAt: string }) => {
        queryClient.setQueryData(
          ["messages", data.conversationId],
          (old: { messages: ChatMessage[] } | undefined) => {
            if (!old) return old;
            return {
              ...old,
              messages: old.messages.map((msg) =>
                msg.senderId !== data.readByUserId
                  ? { ...msg, isRead: true, readAt: data.readAt }
                  : msg
              ),
            };
          }
        );
      }
    );

    socket.on("disconnect", (reason) => {
      console.log("🔌 Chat Socket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, user?.id, dispatch, queryClient]);

  // Join room when activeConversationId changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeConversationId) return;

    socket.emit("join_conversation", { conversationId: activeConversationId });
    socket.emit("mark_read", { conversationId: activeConversationId });

    return () => {
      socket.emit("leave_conversation", { conversationId: activeConversationId });
    };
  }, [activeConversationId]);

  const sendMessage = useCallback(
    (
      conversationId: string,
      messageText: string,
      messageType = "text",
      attachments = []
    ) => {
      const socket = socketRef.current;
      if (socket && socket.connected) {
        socket.emit("send_message", {
          conversationId,
          message: messageText,
          messageType,
          attachments,
        });
      }
    },
    []
  );

  const startTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit("typing_start", { conversationId });
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit("typing_stop", { conversationId });
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    socketRef.current?.emit("mark_read", { conversationId });
  }, []);

  return {
    socket: socketRef.current,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
  };
};
