import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import useAuth from "@/features/auth/hooks/useAuth";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  effectiveTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getStorageKey = (userId?: string | null) => {
  return userId ? `jobbox_theme_${userId}` : "jobbox_theme_preference";
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?._id || user?.id || null;

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    try {
      if (userId) {
        const stored = localStorage.getItem(getStorageKey(userId)) as Theme | null;
        if (stored === "light" || stored === "dark" || stored === "system") {
          return stored;
        }
      }
    } catch {
      // Fallback
    }
    return "light";
  });

  // Synchronize theme state when user authenticates or logs out
  useEffect(() => {
    if (!userId) {
      // Unauthenticated / Guest / Logged out: Default is always white / light mode
      setThemeState("light");
    } else {
      try {
        const userStored = localStorage.getItem(getStorageKey(userId)) as Theme | null;
        if (userStored === "light" || userStored === "dark" || userStored === "system") {
          setThemeState(userStored);
        } else {
          setThemeState("light");
        }
      } catch {
        setThemeState("light");
      }
    }
  }, [userId]);

  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      let isDark = false;
      if (theme === "dark") {
        isDark = true;
      } else if (theme === "light") {
        isDark = false;
      } else if (theme === "system") {
        isDark = mediaQuery.matches;
      }

      setEffectiveTheme(isDark ? "dark" : "light");

      if (isDark) {
        root.classList.add("dark");
        document.body.classList.add("dark");
        root.setAttribute("data-theme", "dark");
        document.body.setAttribute("data-theme", "dark");
        root.style.colorScheme = "dark";
      } else {
        root.classList.remove("dark");
        document.body.classList.remove("dark");
        root.setAttribute("data-theme", "light");
        document.body.setAttribute("data-theme", "light");
        root.style.colorScheme = "light";
      }
    };

    applyTheme();

    const handleChange = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      if (userId) {
        localStorage.setItem(getStorageKey(userId), newTheme);
      }
    } catch {
      // Ignored
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

