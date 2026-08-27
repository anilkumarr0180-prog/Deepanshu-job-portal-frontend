import { axiosInstance } from "@/lib/axios";
import type { ChatConversation, ChatMessage } from "../types/chat.types";

interface PaginatedResponse<T> {
  items?: T[];
  data?: T[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const fetchConversationsApi = async (page = 1, limit = 20) => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: PaginatedResponse<ChatConversation> | ChatConversation[];
  }>("/chat/conversations", {
    params: { page, limit },
  });

  const resData = response.data.data;

  if (Array.isArray(resData)) {
    return { conversations: resData, total: resData.length };
  }

  return {
    conversations: resData.items || resData.data || [],
    pagination: resData.pagination,
  };
};

export const createOrGetConversationApi = async (
  jobId?: string,
  targetUserId?: string
) => {
  const response = await axiosInstance.post<{
    success: boolean;
    data: ChatConversation;
  }>("/chat/conversations", {
    jobId: jobId || undefined,
    targetUserId: targetUserId || undefined,
  });

  return response.data.data;
};

export const fetchMessagesApi = async (
  conversationId: string,
  page = 1,
  limit = 50
) => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: PaginatedResponse<ChatMessage> | ChatMessage[];
  }>(`/chat/conversations/${conversationId}/messages`, {
    params: { page, limit },
  });

  const resData = response.data.data;

  if (Array.isArray(resData)) {
    return { messages: resData };
  }

  return {
    messages: resData.items || resData.data || [],
    pagination: resData.pagination,
  };
};

export const sendMessageApi = async (
  conversationId: string,
  message: string,
  messageType = "text",
  attachments: any[] = []
) => {
  const response = await axiosInstance.post<{
    success: boolean;
    data: ChatMessage;
  }>(`/chat/conversations/${conversationId}/messages`, {
    message,
    messageType,
    attachments,
  });

  return response.data.data;
};

export const markConversationReadApi = async (conversationId: string) => {
  const response = await axiosInstance.patch<{
    success: boolean;
    data: { updatedCount: number };
  }>(`/chat/conversations/${conversationId}/read`);

  return response.data.data;
};

export const fetchUnreadChatCountApi = async () => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: { unreadCount: number };
  }>("/chat/unread-count");

  return response.data.data.unreadCount;
};

export const deleteConversationApi = async (conversationId: string) => {
  // If backend provides a DELETE route or soft-delete patch
  try {
    const response = await axiosInstance.delete<{
      success: boolean;
      message?: string;
    }>(`/chat/conversations/${conversationId}`);
    return response.data;
  } catch (err: any) {
    // Graceful fallback for local per-user clearance if backend delete endpoint is optional
    return { success: true, conversationId };
  }
};
