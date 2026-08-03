import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, []);

  const login = useCallback((nextToken: string, nextUser: AuthUser) => {
    if (!nextToken) return;

    setToken(nextToken);
    setUser(nextUser);

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_TOKEN_KEY, nextToken);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));
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

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }

        throw new Error("Failed to fetch user");
      }

      const result = await response.json();

      const nextUser =
        (result?.data?.user ?? result?.user ?? null) as AuthUser | null;

      if (nextUser) {
        setUser(nextUser);

        if (typeof window !== "undefined") {
          localStorage.setItem(
            STORAGE_USER_KEY,
            JSON.stringify(nextUser)
          );
        }
      } else {
        setUser(null);
      }

      setToken(currentToken);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

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
      {loading && token ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}