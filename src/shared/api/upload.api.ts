import { axiosInstance } from "@/lib/axios";

export type CloudinaryUploadType =
  | "profile"
  | "company-logo"
  | "resume"
  | "post"
  | "chat-media";

export interface SignatureResponse {
  timestamp: number;
  signature: string;
  folder: string;
  cloudName: string;
  apiKey: string;
  uploadPreset?: string;
}

export interface AuthenticatedResumeUrlPayload {
  publicId?: string;
  applicationId?: string;
  candidateUserId?: string;
}

export interface AuthenticatedResumeUrlResponse {
  url: string;
  publicId: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function getUploadSignature(
  type: CloudinaryUploadType
): Promise<SignatureResponse> {
  const response = await axiosInstance.post<ApiResponse<SignatureResponse>>(
    "/uploads/signature",
    { type }
  );
  return response.data.data;
}

export async function getAuthenticatedResumeUrl(
  payload: AuthenticatedResumeUrlPayload
): Promise<AuthenticatedResumeUrlResponse> {
  const response = await axiosInstance.post<
    ApiResponse<AuthenticatedResumeUrlResponse>
  >("/uploads/resume-url", payload);
  return response.data.data;
}
