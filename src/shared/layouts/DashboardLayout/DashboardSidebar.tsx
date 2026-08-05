import useAuth from "@/features/auth/hooks/useAuth";
import logo from "@/assets/images/logo/logo.svg";

import DashboardMenu from "./DashboardMenu.tsx";
import { getDashboardConfig } from "./dashboardConfig.ts";

export default function DashboardSidebar() {
  const { user } = useAuth();
  const config = getDashboardConfig(user?.role);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen w-[260px] flex-col border-r border-white/10 bg-[#05264E] lg:flex">
      <div className="flex items-center gap-3 px-6 py-3">
        <img src={logo} alt="JobBox" className="h-9 w-auto object-contain" />
        <div className="leading-tight">
          <h2 className="text-lg font-bold text-white">JobBox</h2>
          <p className="text-xs text-blue-200 mt-[2px] whitespace-nowrap">{config.title}</p>
        </div>
      </div>

      <div className="border-b border-white/10 mx-6" />

      <div className="mt-2 flex-1 overflow-y-auto px-4">
        <DashboardMenu role={user?.role} />
      </div>
    </aside>
  );
}
