import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import ReduxProvider from "./ReduxProvider";
import QueryProvider from "./QueryProvider";

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
        <Toaster position="top-right" />
      </QueryProvider>
    </ReduxProvider>
  );
}