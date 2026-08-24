export type MessageType = "text" | "image" | "file" | "system";

export interface MessageAttachment {
  url: string;
  name?: string;
  size?: number;
  mimeType?: string;
}

export interface ChatUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: "candidate" | "recruiter" | "admin" | "JOB_SEEKER" | "RECRUITER" | "ADMIN";
  profilePicture?: string;
}

export interface ChatJob {
  _id: string;
  id?: string;
  title: string;
  company?: string;
  location?: string;
  status?: string;
}

export interface ChatMessage {
  _id: string;
  id?: string;
  conversationId: string;
  senderId: ChatUser | string;
  message: string;
  messageType: MessageType;
  attachments?: MessageAttachment[];
  isRead: boolean;
  readAt?: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface TypingUserInfo {
  userId: string;
  userName?: string;
  timestamp?: number;
}

export interface ChatConversation {
  _id: string;
  id?: string;
  jobId?: ChatJob;
  candidateId: ChatUser;
  recruiterId: ChatUser;
  lastMessageId?: ChatMessage;
  lastMessageAt?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Safely extracts user ID string regardless of whether `user` is an object or string
 */
export const getUserIdString = (
  userVal?: string | { _id?: string; id?: string } | null
): string => {
  if (!userVal) return "";
  if (typeof userVal === "string") return userVal;
  return userVal._id || userVal.id || "";
};

