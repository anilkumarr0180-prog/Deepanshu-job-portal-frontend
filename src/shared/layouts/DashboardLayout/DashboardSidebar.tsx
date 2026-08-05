import { Link } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";
import DashboardMenu from "./DashboardMenu.tsx";
import { getDashboardConfig } from "./dashboardConfig.ts";

export default function DashboardSidebar() {
  const { user } = useAuth();
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
        className="flex items-center gap-3.5 px-6 py-5 transition-opacity duration-200 hover:opacity-90"
      >
        {/* 3D Cube Icon Container */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 shadow-sm">
          <svg
            className="h-6 w-6"
            viewBox="0 0 29 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 8.35L14.5 0V17.61L0 25.2V8.35Z" fill="#91A9FF" />
            <path d="M28.92 8.35L14.42 0V17.61L28.92 25.2V8.35Z" fill="#5E81FF" />
            <path
              d="M14.42 17.61L28.92 25.2L14.42 32.79L0 25.2L14.42 17.61Z"
              fill="#3C65F5"
            />
          </svg>
        </div>

        {/* Text & Badge */}
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tight text-[#05264E] leading-none">
            JobBox
          </span>
          <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#3C65F5] border border-blue-100 w-fit">
            {config.title}
          </span>
        </div>
      </Link>

      <div className="mx-6 border-b border-slate-100" />

      {/* Navigation Menu */}
      <div className="mt-3 flex-1 overflow-y-auto px-4">
        <DashboardMenu role={user?.role} />
      </div>
    </aside>
  );
}
