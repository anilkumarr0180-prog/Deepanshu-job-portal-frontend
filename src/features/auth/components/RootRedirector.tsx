import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import FullPageLoader from "@/shared/components/FullPageLoader";
import useAuth from "../hooks/useAuth";
import { getDashboardRoute } from "../utils/roleNavigation";

interface RootRedirectorProps {
  children: ReactNode;
}

/**
 * RootRedirector handles entry-point navigation for the "/" path.
 * If the user is authenticated, it smoothly redirects them to their role-specific dashboard.
 * If the user is unauthenticated, it renders the public HomePage.
 */
export default function RootRedirector({ children }: RootRedirectorProps) {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardRoute(user.role)} replace />;
  }

  return <>{children}</>;
}
