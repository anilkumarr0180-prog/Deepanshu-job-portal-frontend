import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  fetchConversationsApi,
  createOrGetConversationApi,
  fetchMessagesApi,
  sendMessageApi,
  markConversationReadApi,
  fetchUnreadChatCountApi,
} from "../api/chat.api";
import { setUnreadTotalCount } from "../store/chatSlice";


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
      messageType?: "text" | "image" | "file" | "system";
      attachments?: [];
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
