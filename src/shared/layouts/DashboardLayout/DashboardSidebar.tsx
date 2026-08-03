import { PanelLeftClose } from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";

import DashboardMenu from "./DashboardMenu";
import { getDashboardConfig } from "./dashboardConfig";

export default function DashboardSidebar() {
  const { user } = useAuth();
  const config = getDashboardConfig(user?.role);

  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between lg:justify-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            {config.logo}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{config.title}</h2>
        </div>

        <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 lg:hidden" type="button" aria-label="Toggle sidebar">
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-8">
        <DashboardMenu role={user?.role} />
      </div>
    </aside>
  );
}
