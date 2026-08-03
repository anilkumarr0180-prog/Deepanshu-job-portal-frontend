import { LogOut } from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const displayName = user?.name ?? "User";

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Welcome back</p>
          <h1 className="text-xl font-semibold text-slate-900">{displayName}</h1>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
