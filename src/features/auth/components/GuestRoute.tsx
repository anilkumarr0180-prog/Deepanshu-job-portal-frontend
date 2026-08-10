import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import FullPageLoader from "@/shared/components/FullPageLoader";
import useAuth from "../hooks/useAuth";
import { getDashboardRoute } from "../utils/roleNavigation";

interface GuestRouteProps {
  children: ReactNode;
}

/**
 * GuestRoute prevents authenticated users from accessing authentication pages
 * like /login or /register. If an authenticated user attempts to access these pages,
 * they are automatically redirected to their role-specific dashboard.
 */
export default function GuestRoute({ children }: GuestRouteProps) {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardRoute(user.role)} replace />;
  }

  return <>{children}</>;
}
