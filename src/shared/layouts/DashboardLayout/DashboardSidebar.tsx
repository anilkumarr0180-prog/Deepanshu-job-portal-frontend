import { Link } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";
import DashboardMenu from "./DashboardMenu.tsx";
import { getDashboardConfig } from "./dashboardConfig.ts";
import { Crown, LogOut } from "lucide-react";

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const config = getDashboardConfig(user?.role);

  const homeRoute =
    user?.role === "candidate"
      ? "/candidate/dashboard"
      : user?.role === "admin"
      ? "/admin/dashboard"
      : "/recruiter/dashboard";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen w-[260px] flex-col border-r border-slate-200/80 bg-white lg:flex">

      {/* Brand Header */}
      <Link
        to={homeRoute}
        className="flex items-center gap-3.5 px-6 py-5 transition-opacity duration-200 hover:opacity-90 shrink-0"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 shadow-sm">
          <svg className="h-6 w-6" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 8.35L14.5 0V17.61L0 25.2V8.35Z" fill="#91A9FF" />
            <path d="M28.92 8.35L14.42 0V17.61L28.92 25.2V8.35Z" fill="#5E81FF" />
            <path d="M14.42 17.61L28.92 25.2L14.42 32.79L0 25.2L14.42 17.61Z" fill="#3C65F5" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tight text-[#05264E] leading-none">JobBox</span>
          <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#3C65F5] border border-blue-100 w-fit">
            {config.title}
          </span>
        </div>
      </Link>

      <div className="mx-6 border-b border-slate-100 shrink-0" />

      {/* Navigation Menu */}
      <div className="mt-3 flex-1 overflow-y-auto px-4 min-h-0">
        <DashboardMenu role={user?.role} />
      </div>

      {/* Bottom section */}
      <div className="px-4 pb-5 pt-2 shrink-0 space-y-3">
        <div className="mx-2 border-t border-slate-100" />

        {/* Upgrade CTA — candidates & recruiters only */}
        {user?.role !== "admin" && (
          <Link
            to="/pricing"
            className="group relative flex flex-col items-center justify-center gap-1 w-full rounded-2xl px-4 py-4 overflow-hidden text-white transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)",
              boxShadow: "0 8px 32px rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)" }} />
            <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full opacity-25"
              style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)" }} />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
            <div className="absolute top-2.5 right-4 w-1 h-1 rounded-full bg-amber-300 opacity-80 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="absolute bottom-3 left-5 w-1 h-1 rounded-full bg-white opacity-60 animate-ping" style={{ animationDuration: "3s" }} />
            <div className="absolute top-5 left-4 w-0.5 h-0.5 rounded-full bg-pink-300 opacity-70 animate-pulse" />
            <div className="relative z-10 flex items-center gap-2 mb-0.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 border border-white/30">
                <Crown className="w-3.5 h-3.5 text-amber-300 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.12em] text-white/95">Upgrade Your Plan</span>
            </div>
            <p className="relative z-10 text-[10px] text-indigo-200 font-medium text-center leading-tight">
              Unlock premium features &amp; stand out
            </p>
            <div className="relative z-10 mt-2 flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] font-extrabold uppercase tracking-widest text-white/90 group-hover:bg-white/25 transition-colors">
              <span>View Plans</span>
              <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 16 16">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        )}

        {/* Sign Out */}
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 border border-transparent hover:border-red-100 transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
