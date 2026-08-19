import { createContext } from "react";

import type { UserRole } from "@/shared/types/role";

export interface AuthUser {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  authProvider?: string;
  profilePicture?: string;
  profilePicturePublicId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isEmailVerified?: boolean;
  isBlocked?: boolean;
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