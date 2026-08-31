import { useEffect, useCallback } from "react";
import useAuth from "@/features/auth/hooks/useAuth";
import { useRealtime } from "@/shared/context/RealtimeContext";

export const useChatSocket = (activeConversationId?: string | null) => {
  const { user } = useAuth();
  const { socket, joinConversation, leaveConversation } = useRealtime();

  const currentUserName = user?.name || (user as any)?.firstName || "User";

  // Effect: Room join/leave ONLY when activeConversationId actually changes
  useEffect(() => {
    if (!activeConversationId) return;

    joinConversation(activeConversationId);

    return () => {
      leaveConversation(activeConversationId);
    };
  }, [activeConversationId]);

  // Outgoing Action Handlers (Shared & Reusable across Components)
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
      if (socket?.connected) {
        socket.emit("send_message", {
          conversationId,
          message: messageText,
          messageType,
          attachments,
        });
      } else {
        console.warn("Chat socket not connected — message not sent over socket");
      }
    },
    [socket]
  );

  const startTyping = useCallback(
    (conversationId: string) => {
      if (socket?.connected) {
        socket.emit("typing_start", {
          conversationId,
          userName: currentUserName,
        });
      }
    },
    [socket, currentUserName]
  );

  const stopTyping = useCallback(
    (conversationId: string) => {
      if (socket?.connected) {
        socket.emit("typing_stop", { conversationId });
      }
    },
    [socket]
  );

  const markAsRead = useCallback(
    (conversationId: string) => {
      if (socket?.connected) {
        socket.emit("mark_read", { conversationId });
      }
    },
    [socket]
  );

  const editMessage = useCallback(
    (conversationId: string, messageId: string, newText: string) => {
      if (socket?.connected) {
        socket.emit("edit_message", {
          conversationId,
          messageId,
          newText,
        });
      }
    },
    [socket]
  );

  const deleteMessage = useCallback(
    (conversationId: string, messageId: string, deleteForEveryone: boolean) => {
      if (socket?.connected) {
        socket.emit("delete_message", {
          conversationId,
          messageId,
          deleteForEveryone,
        });
      }
    },
    [socket]
  );

  return {
    socket,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    editMessage,
    deleteMessage,
  };
};
