const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

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
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  return fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser(token: string) {
  return fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
