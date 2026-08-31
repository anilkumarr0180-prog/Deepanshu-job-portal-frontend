export type CallState =
  | "IDLE"
  | "CALLING" // Outgoing: waiting for callee to receive & answer
  | "RINGING" // Incoming: received incoming call invitation
  | "ACCEPTED" // Accepted by callee, negotiating / preparing
  | "CONNECTING" // WebRTC negotiation in progress
  | "CONNECTED" // Call active
  | "DECLINED" // Rejected by callee
  | "CANCELLED" // Cancelled by caller before answer
  | "MISSED" // Ringing timed out
  | "BUSY" // Target user is already in another call
  | "FAILED" // Error or failure
  | "ENDED"; // Call finished

export interface CallUser {
  id: string;
  _id?: string;
  name?: string;
  profilePicture?: string;
  role?: string;
}

export interface ActiveCallData {
  callId: string;
  conversationId: string;
  remoteUser: CallUser;
  isOutgoing: boolean;
  startedAt?: Date;
  acceptedAt?: Date;
}

export interface CallHistoryItem {
  _id: string;
  id?: string;
  callId: string;
  conversationId: string | { _id: string; id?: string };
  callerId: CallUser | string;
  receiverId: CallUser | string;
  status:
    | "ringing"
    | "accepted"
    | "ended"
    | "cancelled"
    | "declined"
    | "busy"
    | "missed"
    | "failed";
  startedAt: string;
  answeredAt?: string | null;
  endedAt?: string | null;
  durationSeconds: number;
  endReason?: string;
  isMissedCallRead?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CallHistoryPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CallHistoryResponse {
  items: CallHistoryItem[];
  pagination: CallHistoryPagination;
}

export interface CallMissedCountPayload {
  unreadMissedCallCount: number;
}
