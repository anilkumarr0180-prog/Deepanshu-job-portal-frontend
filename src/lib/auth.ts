const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export function clearAuth(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
