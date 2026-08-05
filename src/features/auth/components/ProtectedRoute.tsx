import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import type { AllowedRole } from "@/shared/types/role";
import FullPageLoader from "@/shared/components/FullPageLoader";
import useAuth from "../hooks/useAuth";
import { getDashboardRoute, isAllowedRole } from "../utils/roleNavigation";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: readonly AllowedRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !isAllowedRole(user?.role, allowedRoles)) {
    return <Navigate to={getDashboardRoute(user?.role)} replace />;
  }

  return <>{children}</>;
}