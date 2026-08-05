import { axiosInstance } from "@/lib/axios";

export interface BackendProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  profilePicture?: string;
  resumeUrl?: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
  resumeUrl?: string;
  role?: string;
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<BackendProfile> {
  const response = await axiosInstance.patch<ProfileApiResponse>(
    "/profile",
    payload
  );

  return response.data.data;
}

interface ProfileApiResponse {
  success: boolean;
  data: BackendProfile;
}

export async function getProfile(): Promise<BackendProfile> {
  const response = await axiosInstance.get<ProfileApiResponse>("/profile");

  return response.data.data;
}
