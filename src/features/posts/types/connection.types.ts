import type { UserRole } from "@/shared/types/role";

export type ConnectionStatus =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "connected"
  | "self";

export interface ConnectionPeerUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  headline?: string;
  location?: string;
  skills?: string[];
  company?: {
    _id: string;
    name: string;
    logo?: string;
  };
}

export interface ConnectionItem {
  _id: string;
  status: "pending" | "accepted" | "rejected";
  isRequester: boolean;
  acceptedAt?: string;
  createdAt: string;
  peerUser: ConnectionPeerUser;
}

export interface ConnectionsPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ConnectionsResponse {
  items: ConnectionItem[];
  pagination: ConnectionsPagination;
}

export interface ConnectionStatusResponse {
  status: ConnectionStatus;
  connectionId?: string | null;
}

export interface PeopleSuggestion extends ConnectionPeerUser {
  connectionStatus: ConnectionStatus;
  connectionId?: string | null;
}

export interface GetConnectionsParams {
  page?: number;
  limit?: number;
  status?: "accepted" | "pending" | "sent" | "all";
  search?: string;
}

export interface SearchUsersParams {
  q: string;
  page?: number;
  limit?: number;
}