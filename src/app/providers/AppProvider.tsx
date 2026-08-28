import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { RealtimeProvider } from "@/shared/context/RealtimeContext";
import { CallProvider } from "@/features/call/context/CallContext";
import { NotificationProvider } from "@/shared/context/NotificationContext";
import { ThemeProvider } from "@/shared/context/ThemeContext";
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
      <ThemeProvider>
        <ReduxProvider>
          <QueryProvider>
            <AuthProvider>
              <RealtimeProvider>
                <CallProvider>
                  <NotificationProvider>
                    <GoogleOAuthProvider clientId={googleClientId}>
                      {children}
                      <Toaster position="top-right" />
                    </GoogleOAuthProvider>
                  </NotificationProvider>
                </CallProvider>
              </RealtimeProvider>
            </AuthProvider>
          </QueryProvider>
        </ReduxProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
