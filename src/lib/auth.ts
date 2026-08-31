const TOKEN_KEY = "accessToken";
const USER_KEY = "user";
const LEGACY_THEME_KEY = "jobbox_theme_preference";

export function clearAuth(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LEGACY_THEME_KEY);

  // Safety cleanup for DOM attributes to guarantee instant light mode on logout
  try {
    const root = document.documentElement;
    root.classList.remove("dark");
    document.body?.classList.remove("dark");
    root.setAttribute("data-theme", "light");
    document.body?.setAttribute("data-theme", "light");
    root.style.colorScheme = "light";
  } catch {
    // Ignore in non-browser environments
  }
}
