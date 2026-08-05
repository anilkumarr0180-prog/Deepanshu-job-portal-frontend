import { createContext } from "react";

import type { UserRole } from "@/shared/types/role";

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  [key: string]: unknown;
}

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);