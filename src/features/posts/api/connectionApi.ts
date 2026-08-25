import { axiosInstance } from "@/lib/axios";
import { removeEmptyFields } from "@/shared/utils/removeEmptyFields";
import type {
  ConnectionItem,
  ConnectionsResponse,
  ConnectionStatusResponse,
  PeopleSuggestion,
  GetConnectionsParams,
  SearchUsersParams,
} from "../types/connection.types";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiMessageResponse {
  success: boolean;
  message?: string;
}

export async function sendConnectionRequest(recipientId: string): Promise<ConnectionItem> {
  const response = await axiosInstance.post<ApiResponse<ConnectionItem>>(
    "/connections/request/" + recipientId
  );
  return response.data.data;
}

export async function acceptConnection(connectionId: string): Promise<ConnectionItem> {
  const response = await axiosInstance.put<ApiResponse<ConnectionItem>>(
    "/connections/" + connectionId + "/accept"
  );
  return response.data.data;
}

export async function rejectConnection(connectionId: string): Promise<ConnectionItem> {
  const response = await axiosInstance.put<ApiResponse<ConnectionItem>>(
    "/connections/" + connectionId + "/reject"
  );
  return response.data.data;
}

export async function cancelConnectionRequest(connectionId: string): Promise<ApiMessageResponse> {
  const response = await axiosInstance.delete<ApiMessageResponse>(
    "/connections/" + connectionId + "/cancel"
  );
  return response.data;
}

export async function removeConnection(connectionId: string): Promise<ApiMessageResponse> {
  const response = await axiosInstance.delete<ApiMessageResponse>(
    "/connections/" + connectionId
  );
  return response.data;
}

export async function getUserConnections(params?: GetConnectionsParams): Promise<ConnectionsResponse> {
  const cleaned = params ? removeEmptyFields(params) : undefined;
  const response = await axiosInstance.get<ApiResponse<ConnectionsResponse>>(
    "/connections",
    { params: cleaned }
  );
  return response.data.data;
}

export async function getConnectionStatus(targetUserId: string): Promise<ConnectionStatusResponse> {
  const response = await axiosInstance.get<ApiResponse<ConnectionStatusResponse>>(
    "/connections/status/" + targetUserId
  );
  return response.data.data;
}

export async function getConnectionCount(userId: string): Promise<number> {
  const response = await axiosInstance.get<ApiResponse<{ count: number }>>(
    "/connections/count/" + userId
  );
  return response.data.data.count;
}

export async function getPeopleSuggestions(limit: number = 6): Promise<PeopleSuggestion[]> {
  const response = await axiosInstance.get<ApiResponse<PeopleSuggestion[]>>(
    "/connections/suggestions",
    { params: { limit } }
  );
  return response.data.data;
}

export async function searchUsers(params: SearchUsersParams): Promise<ConnectionsResponse> {
  const response = await axiosInstance.get<ApiResponse<ConnectionsResponse>>(
    "/connections/search",
    { params }
  );
  return response.data.data;
}