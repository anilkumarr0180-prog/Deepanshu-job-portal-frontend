import { axiosInstance } from "@/lib/axios";
import type { NotificationFeedResponse, NotificationItem } from "../types/notification";

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  type?: string;
  isRead?: boolean | string;
}

export const notificationService = {
  getNotifications: async (
    params?: GetNotificationsParams
  ): Promise<NotificationFeedResponse> => {
    const response = await axiosInstance.get<{
      success: boolean;
      data: NotificationFeedResponse;
    }>("/notifications", { params });
    return response.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await axiosInstance.get<{
      success: boolean;
      data: { unreadCount: number };
    }>("/notifications/unread-count");
    return response.data.data.unreadCount;
  },

  markAsRead: async (id: string): Promise<NotificationItem> => {
    const response = await axiosInstance.patch<{
      success: boolean;
      data: NotificationItem;
    }>(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllAsRead: async (): Promise<{ modifiedCount: number }> => {
    const response = await axiosInstance.patch<{
      success: boolean;
      data: { modifiedCount: number };
    }>("/notifications/read-all");
    return response.data.data;
  },

  deleteNotification: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/notifications/${id}`);
  },

  clearAllRead: async (): Promise<{ deletedCount: number }> => {
    const response = await axiosInstance.delete<{
      success: boolean;
      data: { deletedCount: number };
    }>("/notifications/clear-all");
    return response.data.data;
  },
};
