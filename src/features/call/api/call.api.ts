import { axiosInstance } from "@/lib/axios";

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
