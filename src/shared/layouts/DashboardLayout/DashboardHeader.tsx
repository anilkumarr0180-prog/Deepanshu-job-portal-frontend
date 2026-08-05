import { LogOut } from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const displayName = user?.name ?? "User";

  return (
    <header className="sticky top-0 z-30 h-[80px] bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      <div className="flex h-full items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-lg font-semibold text-[#05264E]">
            Good Morning, {displayName} 👋
          </p>
          <p className="text-sm text-slate-500">Manage your hiring workflow efficiently.</p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-xl border border-[#E0E6F7] bg-white px-4 py-2 text-sm font-medium text-[#05264E] transition-all duration-200 hover:border-[#3C65F5] hover:text-[#3C65F5] focus:outline-none focus:ring-2 focus:ring-[#3C65F5] focus:ring-offset-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
