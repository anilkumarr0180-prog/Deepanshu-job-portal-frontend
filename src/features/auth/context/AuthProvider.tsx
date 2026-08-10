import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import FullPageLoader from "@/shared/components/FullPageLoader";
import { clearAuth } from "@/lib/auth";
import { getCurrentUser } from "../api/auth.api";
import {
  AuthContext,
  type AuthContextValue,
  type AuthUser,
} from "./auth-context";

const STORAGE_TOKEN_KEY = "accessToken";
const STORAGE_USER_KEY = "user";

function readStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(STORAGE_TOKEN_KEY);
}

function readStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = window.localStorage.getItem(STORAGE_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);

    if (typeof window !== "undefined") {
      clearAuth();
    }
  }, []);

  const login = useCallback((nextToken: string, nextUser: AuthUser) => {
    if (!nextToken) return;

    setToken(nextToken);
    setUser(nextUser);

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_TOKEN_KEY, nextToken);
      localStorage.setItem(
        STORAGE_USER_KEY,
        JSON.stringify(nextUser)
      );
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = readStoredToken();

    if (!currentToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await getCurrentUser(currentToken);

      /**
       * Backend response:
       * {
       *   success: true,
       *   data: {
       *     _id,
       *     name,
       *     email,
       *     role
       *   }
       * }
       */

      const result = response.data;

      const nextUser = (result?.data ?? null) as AuthUser | null;

      if (!nextUser) {
        logout();
        return;
      }

      setUser(nextUser);
      setToken(currentToken);

      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_USER_KEY,
          JSON.stringify(nextUser)
        );
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_TOKEN_KEY || e.key === STORAGE_USER_KEY) {
        const nextToken = readStoredToken();
        const nextUser = readStoredUser();
        setToken(nextToken);
        setUser(nextUser);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
      refreshUser,
    }),
    [user, token, loading, login, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading && token ? <FullPageLoader /> : children}
    </AuthContext.Provider>
  );
}