import type { MessageType } from "../types/chat.types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import useAuth from "@/features/auth/hooks/useAuth";
import { useRealtime } from "@/shared/context/RealtimeContext";
import {
  fetchConversationsApi,
  createOrGetConversationApi,
  fetchMessagesApi,
  sendMessageApi,
  markConversationReadApi,
  fetchUnreadChatCountApi,
  deleteConversationApi,
} from "../api/chat.api";
import { setUnreadTotalCount, decrementUnreadCount } from "../store/chatSlice";

export const useConversations = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["conversations", page, limit],
    queryFn: () => fetchConversationsApi(page, limit),
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useMessages = (conversationId: string | null, page = 1, limit = 50) => {
  return useQuery({
    queryKey: ["messages", conversationId, page, limit],
    queryFn: () => (conversationId ? fetchMessagesApi(conversationId, page, limit) : null),
    enabled: Boolean(conversationId),
    staleTime: 1000 * 10,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, targetUserId }: { jobId?: string; targetUserId?: string }) =>
      createOrGetConversationApi(jobId, targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      message,
      messageType = "text",
      attachments = [],
    }: {
      conversationId: string;
      message: string;
      messageType?: MessageType;
      attachments?: any[];
    }) => sendMessageApi(conversationId, message, messageType, attachments),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useMarkConversationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => markConversationReadApi(conversationId),
    onSuccess: (_data, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["unread-chat-count"] });
    },
  });
};

export const useUnreadChatCount = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["unread-chat-count"],
    queryFn: async () => {
      const count = await fetchUnreadChatCountApi();
      dispatch(setUnreadTotalCount(count));
      return count;
    },
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { socket } = useRealtime();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      // 1. Fetch current messages for this conversation to ensure all message IDs are known
      let msgList: any[] = [];
      const cached = queryClient.getQueryData<any>(["messages", conversationId]);
      if (cached?.messages && Array.isArray(cached.messages) && cached.messages.length > 0) {
        msgList = cached.messages;
      } else {
        try {
          const res = await fetchMessagesApi(conversationId, 1, 100);
          msgList = res.messages || [];
        } catch {
          // ignore
        }
      }

      // 2. Emit delete_message for each message (delete for me) to persist deletedFor in MongoDB
      if (socket && socket.connected) {
        msgList.forEach((m: any) => {
          const mId = m._id || m.id;
          if (mId) {
            socket.emit("delete_message", {
              conversationId,
              messageId: mId,
              deleteForEveryone: false,
            });
          }
        });
      }

      // 3. Mark in local storage to keep conversation hidden from sidebar until new message arrives
      try {
        const key = "jobbox_deleted_convs_" + (user?.id || (user as any)?._id || "");
        const existing = JSON.parse(localStorage.getItem(key) || "{}");
        existing[conversationId] = Date.now();
        localStorage.setItem(key, JSON.stringify(existing));
      } catch {
        // ignore
      }

      // Also call backend API if route is available
      void deleteConversationApi(conversationId);

      return { conversationId, success: true };
    },
    onMutate: async (conversationId: string) => {
      // Find unread count of the conversation being deleted to reconcile global unread
      let unreadToClear = 0;
      const allConvData: any = queryClient.getQueriesData({ queryKey: ["conversations"] });
      if (Array.isArray(allConvData)) {
        for (const [, cacheVal] of allConvData) {
          if (cacheVal?.conversations) {
            const target = cacheVal.conversations.find(
              (c: any) => (c._id || c.id) === conversationId
            );
            if (target && target.unreadCount > 0) {
              unreadToClear = Math.max(unreadToClear, target.unreadCount);
            }
          }
        }
      }

      if (unreadToClear > 0) {
        dispatch(decrementUnreadCount(unreadToClear));
        queryClient.setQueryData(["unread-chat-count"], (prev: number | undefined) =>
          typeof prev === "number" ? Math.max(0, prev - unreadToClear) : 0
        );
      }

      // Optimistically remove conversation from all conversation queries
      queryClient.setQueriesData(
        { queryKey: ["conversations"] },
        (old: any) => {
          if (!old?.conversations) return old;
          return {
            ...old,
            conversations: old.conversations.filter(
              (c: any) => (c._id || c.id) !== conversationId
            ),
          };
        }
      );

      // Set cached messages to empty array for this conversation so reopening it shows zero messages
      queryClient.setQueriesData(
        { queryKey: ["messages", conversationId] },
        { messages: [] }
      );
    },
  });
};

export const useClearChatMessages = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { socket } = useRealtime();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      let msgList: any[] = [];
      const cached = queryClient.getQueryData<any>(["messages", conversationId]);
      if (cached?.messages && Array.isArray(cached.messages) && cached.messages.length > 0) {
        msgList = cached.messages;
      } else {
        try {
          const res = await fetchMessagesApi(conversationId, 1, 100);
          msgList = res.messages || [];
        } catch {
          // ignore
        }
      }

      // Emit delete_message for each message to update deletedFor in MongoDB
      if (socket && socket.connected) {
        msgList.forEach((m: any) => {
          const mId = m._id || m.id;
          if (mId) {
            socket.emit("delete_message", {
              conversationId,
              messageId: mId,
              deleteForEveryone: false,
            });
          }
        });
      }

      return { conversationId, success: true };
    },
    onMutate: async (conversationId: string) => {
      // Clear messages in chat box immediately
      queryClient.setQueriesData(
        { queryKey: ["messages", conversationId] },
        { messages: [] }
      );

      // Reconcile unread count
      let unreadToClear = 0;
      const allConvData: any = queryClient.getQueriesData({ queryKey: ["conversations"] });
      if (Array.isArray(allConvData)) {
        for (const [, cacheVal] of allConvData) {
          if (cacheVal?.conversations) {
            const target = cacheVal.conversations.find(
              (c: any) => (c._id || c.id) === conversationId
            );
            if (target && target.unreadCount > 0) {
              unreadToClear = Math.max(unreadToClear, target.unreadCount);
            }
          }
        }
      }

      if (unreadToClear > 0) {
        dispatch(decrementUnreadCount(unreadToClear));
        queryClient.setQueryData(["unread-chat-count"], (prev: number | undefined) =>
          typeof prev === "number" ? Math.max(0, prev - unreadToClear) : 0
        );
      }

      // Update sidebar preview to reflect cleared chat
      queryClient.setQueriesData(
        { queryKey: ["conversations"] },
        (old: any) => {
          if (!old?.conversations) return old;
          return {
            ...old,
            conversations: old.conversations.map((c: any) => {
              if ((c._id || c.id) === conversationId) {
                return {
                  ...c,
                  lastMessageId: null,
                  unreadCount: 0,
                };
              }
              return c;
            }),
          };
        }
      );
    },
  });
};
