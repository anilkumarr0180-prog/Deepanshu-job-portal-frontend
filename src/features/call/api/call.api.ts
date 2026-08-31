import { axiosInstance } from "@/lib/axios";
import type {
  CallHistoryResponse,
} from "../types/call.types";

export interface IceServerConfig {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export interface IceServersResponse {
  iceServers: IceServerConfig[];
  ttlSeconds?: number;
}

export const fetchIceServersApi = async (): Promise<IceServerConfig[]> => {
  try {
    const response = await axiosInstance.get<{
      success: boolean;
      data: IceServersResponse;
    }>("/call/ice-servers");

    if (response.data?.data?.iceServers && Array.isArray(response.data.data.iceServers)) {
      return response.data.data.iceServers;
    }
  } catch (error) {
    console.warn("Failed to fetch dynamic STUN/TURN servers from backend, falling back to default STUN:", error);
  }

  // Graceful fallback to default Google STUN
  return [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ];
};

export const fetchCallHistoryApi = async (params?: {
  page?: number;
  limit?: number;
  conversationId?: string;
  status?: string;
}): Promise<CallHistoryResponse> => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: CallHistoryResponse;
  }>("/call/history", { params });
  return response.data.data;
};

export const fetchConversationCallHistoryApi = async (
  conversationId: string,
  params?: { page?: number; limit?: number; status?: string }
): Promise<CallHistoryResponse> => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: CallHistoryResponse;
  }>(`/call/conversation/${conversationId}`, { params });
  return response.data.data;
};

export const fetchUnreadMissedCallsCountApi = async (): Promise<number> => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: { unreadCount: number };
  }>("/call/missed/unread-count");
  return response.data?.data?.unreadCount || 0;
};

export const markMissedCallsAsReadApi = async (
  conversationId?: string
): Promise<{ updatedCount: number }> => {
  const response = await axiosInstance.patch<{
    success: boolean;
    data: { updatedCount: number };
  }>("/call/missed/read", { conversationId });
  return response.data.data;
};
