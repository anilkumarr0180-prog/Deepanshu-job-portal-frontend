import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  UserRound,
  BriefcaseBusiness,
  LogOut,
  CreditCard,
  ChevronDown,
  Settings,
} from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";
import DashboardMenu from "./DashboardMenu";
import { NotificationDropdown } from "@/shared/components/NotificationDropdown";
import { SwiggyLocationHeader } from "@/shared/components/SwiggyLocationHeader";

import { UserAvatar } from "@/shared/components/UserAvatar";

export default function DashboardHeader() {
  const { user, logout } = useAuth();

  const displayName = user?.name ?? "User";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const profileRoute =
    user?.role === "candidate"
      ? "/candidate/profile"
      : user?.role === "admin"
        ? "/admin/dashboard"
        : "/recruiter/profile";

  const applicationsRoute =
    user?.role === "candidate"
      ? "/candidate/applied"
      : "/recruiter/applicants";

  const billingRoute =
    user?.role === "candidate"
      ? "/candidate/billing"
      : "/recruiter/billing";

  const settingsRoute =
    user?.role === "candidate"
      ? "/candidate/settings"
      : user?.role === "admin"
        ? "/admin/settings"
        : "/recruiter/settings";

  const applicationsLabel =
    user?.role === "candidate"
      ? "My Applications"
      : "My Job Posts";

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-[72px] bg-white/95 backdrop-blur-md px-4 border-b border-slate-200/80 shadow-sm sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <div className="space-y-0.5">
              <p className="text-base font-semibold text-[#05264E] sm:text-lg">
                {(() => {
                  const hour = new Date().getHours();
                  const timeGreeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
                  const cleanName = (user?.name ?? "User").replace(/\s+(Recruiter|Candidate|Admin)$/i, "").trim();
                  return `${timeGreeting}, ${cleanName} 👋`;
                })()}
              </p>

              <p className="hidden text-xs text-slate-500 sm:block sm:text-sm">
                Manage your hiring workflow efficiently.
              </p>
            </div>

          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            <SwiggyLocationHeader />

            <NotificationDropdown />

            {/* User dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setDropdownOpen((prev) => !prev)
                }
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-all duration-200 ${dropdownOpen
                  ? "border-[#3C65F5] bg-blue-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-[#3C65F5] hover:bg-blue-50/50"
                  }`}
              >
                <UserAvatar src={user?.profilePicture} name={displayName} size="sm" />

                <div className="hidden text-left sm:block">
                  <p className="max-w-[90px] truncate text-[12px] font-bold leading-tight text-[#05264E]">
                    {displayName}
                  </p>

                  <p className="text-[10px] capitalize leading-tight text-slate-400">
                    {user?.role ?? "member"}
                  </p>
                </div>

                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/40"
                >

                  {/* User information */}
                  <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/60 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar src={user?.profilePicture} name={displayName} size="md" />

                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-black text-[#05264E]">
                          {displayName}
                        </p>

                        <p className="truncate text-[10px] text-slate-400">
                          {user?.email ?? ""}
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="py-1.5">

                    {/* Profile */}
                    <Link
                      to={profileRoute}
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                      className="group flex items-center gap-3 px-4 py-2.5 text-[12px] font-semibold text-slate-600 transition-colors hover:bg-blue-50/70 hover:text-[#3C65F5]"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-500 transition-colors group-hover:bg-blue-100">
                        <UserRound className="h-3.5 w-3.5" />
                      </div>

                      My Profile
                    </Link>

                    {/* Applications */}
                    <Link
                      to={applicationsRoute}
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                      className="group flex items-center gap-3 px-4 py-2.5 text-[12px] font-semibold text-slate-600 transition-colors hover:bg-blue-50/70 hover:text-[#3C65F5]"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-500 transition-colors group-hover:bg-indigo-100">
                        <BriefcaseBusiness className="h-3.5 w-3.5" />
                      </div>

                      {applicationsLabel}
                    </Link>

                    {/* Billing */}
                    {user?.role !== "admin" && (
                      <Link
                        to={billingRoute}
                        onClick={() => setDropdownOpen(false)}
                        role="menuitem"
                        className="group flex items-center gap-3 px-4 py-2.5 text-[12px] font-semibold text-slate-600 transition-colors hover:bg-blue-50/70 hover:text-[#3C65F5]"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-500 transition-colors group-hover:bg-emerald-100">
                          <CreditCard className="h-3.5 w-3.5" />
                        </div>

                        Billing &amp; Plans
                      </Link>
                    )}

                    {/* Settings */}
                    <Link
                      to={settingsRoute}
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                      className="group flex items-center gap-3 px-4 py-2.5 text-[12px] font-semibold text-slate-600 transition-colors hover:bg-blue-50/70 hover:text-[#3C65F5]"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-500 transition-colors group-hover:bg-slate-200">
                        <Settings className="h-3.5 w-3.5" />
                      </div>

                      Settings
                    </Link>

                    <div className="mx-4 my-1.5 border-t border-slate-100" />

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      role="menuitem"
                      className="group flex w-full items-center gap-3 px-4 py-2.5 text-[12px] font-bold text-red-500 transition-colors hover:bg-red-50"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition-colors group-hover:bg-red-100">
                        <LogOut className="h-3.5 w-3.5" />
                      </div>

                      Sign Out
                    </button>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">

          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="relative z-10 flex h-full w-72 max-w-full flex-col overflow-y-auto bg-white p-6 shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">

              <span className="text-lg font-black text-[#05264E]">
                JobBox Menu
              </span>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close Navigation Menu"
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