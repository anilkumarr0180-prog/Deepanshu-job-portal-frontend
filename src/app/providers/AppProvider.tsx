import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/features/auth/context/AuthProvider";
import ReduxProvider from "./ReduxProvider";
import QueryProvider from "./QueryProvider";

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}