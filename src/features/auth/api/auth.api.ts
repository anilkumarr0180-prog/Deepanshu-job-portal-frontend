import { axiosInstance } from "@/lib/axios";

interface AuthApiResponse {
  data?: {
    accessToken?: string;
    token?: string;
    access_token?: string;
    user?: Record<string, unknown>;
  };
  accessToken?: string;
  token?: string;
  access_token?: string;
  user?: Record<string, unknown>;
}

export function normalizeAuthPayload(payload: unknown) {
  const response = payload as AuthApiResponse | null | undefined;
  const token =
    response?.data?.accessToken ??
    response?.data?.token ??
    response?.data?.access_token ??
    response?.accessToken ??
    response?.token ??
    response?.access_token ??
    null;

  const user = response?.data?.user ?? response?.user ?? null;

  return {
    token: typeof token === "string" && token.trim() ? token : null,
    user,
  };
}

export async function loginUser(payload: { email: string; password: string }) {
  return axiosInstance.post("/auth/login", payload);
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  return axiosInstance.post("/auth/register", payload);
}

export async function getCurrentUser(token: string) {
  return axiosInstance.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function googleAuthApi(payload: {
  credential?: string;
  token?: string;
  role?: string;
}) {
  return axiosInstance.post("/auth/google", payload);
}
