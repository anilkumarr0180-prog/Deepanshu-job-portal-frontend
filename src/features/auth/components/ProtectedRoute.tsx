import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { normalizeRole } from "../utils/roleNavigation";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<"admin" | "recruiter" | "candidate">;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length) {
    const normalizedRole = normalizeRole(user?.role);

    if (!normalizedRole || !allowedRoles.includes(normalizedRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
