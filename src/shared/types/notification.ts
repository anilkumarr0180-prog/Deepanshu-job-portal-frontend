export type NotificationType =
  | "JOB_ALERT"
  | "APPLICATION_UPDATE"
  | "NEW_MESSAGE"
  | "SYSTEM_ALERT"
  | "POST_LIKED"
  | "POST_COMMENTED"
  | "COMMENT_REPLIED"
  | "CONNECTION_REQUEST"
  | "CONNECTION_ACCEPTED"
  | "POST_REPOSTED"
  | "BLOG_PUBLISHED";

export interface NotificationItem {
  id: string;
  _id?: string;
  recipient_id?: string;
  recipientId?: string;
  sender_id?: {
    _id?: string;
    name?: string;
    email?: string;
    profilePicture?: string;
  } | string | null;
  senderId?: {
    _id?: string;
    name?: string;
    email?: string;
    profilePicture?: string;
  } | string | null;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  is_read: boolean;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  createdAt: string;
}

export interface NotificationFeedResponse {
  items: NotificationItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  unreadCount: number;
}
