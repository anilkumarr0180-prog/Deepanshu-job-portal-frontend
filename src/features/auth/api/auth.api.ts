const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

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
