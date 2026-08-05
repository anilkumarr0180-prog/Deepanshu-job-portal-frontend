import type { ReactNode } from "react";

interface FullPageLoaderProps {
  children?: ReactNode;
}

export default function FullPageLoader({ children }: FullPageLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      {children ?? (
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      )}
    </div>
  );
}
