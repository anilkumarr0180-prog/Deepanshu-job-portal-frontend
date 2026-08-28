import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCallHistoryApi,
  fetchConversationCallHistoryApi,
  fetchUnreadMissedCallsCountApi,
  markMissedCallsAsReadApi,
} from "../api/call.api";

export const useCallHistory = (params?: {
  page?: number;
  limit?: number;
  conversationId?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["call-history", params],
    queryFn: () => fetchCallHistoryApi(params),
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useConversationCallHistory = (
  conversationId?: string | null,
  params?: { page?: number; limit?: number; status?: string }
) => {
  return useQuery({
    queryKey: ["call-history", conversationId, params],
    queryFn: () =>
      conversationId
        ? fetchConversationCallHistoryApi(conversationId, params)
        : { items: [], pagination: { page: 1, limit: 50, totalItems: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false } },
    enabled: Boolean(conversationId),
    staleTime: 1000 * 30,
  });
};

export const useUnreadMissedCallsCount = () => {
  return useQuery({
    queryKey: ["unread-missed-calls-count"],
    queryFn: fetchUnreadMissedCallsCountApi,
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useMarkMissedCallsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId?: string) => markMissedCallsAsReadApi(conversationId),
    onSuccess: () => {
      queryClient.setQueryData(["unread-missed-calls-count"], 0);
      queryClient.invalidateQueries({ queryKey: ["call-history"] });
    },
  });
};
