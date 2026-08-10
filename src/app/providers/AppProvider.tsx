import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { NotificationProvider } from "@/shared/context/NotificationContext";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import ReduxProvider from "./ReduxProvider";
import QueryProvider from "./QueryProvider";

interface AppProviderProps {
  children: ReactNode;
}

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "missing-google-client-id.apps.googleusercontent.com";

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorBoundary>
      <ReduxProvider>
        <QueryProvider>
          <AuthProvider>
            <NotificationProvider>
              <GoogleOAuthProvider clientId={googleClientId}>
                {children}
                <Toaster position="top-right" />
              </GoogleOAuthProvider>
            </NotificationProvider>
          </AuthProvider>
        </QueryProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
}