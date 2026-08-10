import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";
import DashboardMenu from "./DashboardMenu";
import { NotificationDropdown } from "@/shared/components/NotificationDropdown";
import { SwiggyLocationHeader } from "@/shared/components/SwiggyLocationHeader";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const displayName = user?.name ?? "User";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-[80px] bg-white px-4 shadow-sm sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-[#05264E] sm:text-lg">
                  Good Morning, {displayName} 👋
                </p>
              </div>
              <p className="hidden text-xs text-slate-500 sm:block sm:text-sm">
                Manage your hiring workflow efficiently.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SwiggyLocationHeader />
            <NotificationDropdown />
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-[#E0E6F7] bg-white px-4 py-2 text-sm font-medium text-[#05264E] transition-all duration-200 hover:border-[#3C65F5] hover:text-[#3C65F5] focus:outline-none focus:ring-2 focus:ring-[#3C65F5] focus:ring-offset-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-full bg-white p-6 shadow-2xl flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-lg font-black text-[#05264E]">JobBox Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex-1">
              <DashboardMenu role={user?.role} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
