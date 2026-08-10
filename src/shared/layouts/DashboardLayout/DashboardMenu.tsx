import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import { getDashboardConfig } from "./dashboardConfig.ts";
import type { RootState } from "@/app/store/store";

interface DashboardMenuProps {
  role?: string | null;
}

export default function DashboardMenu({ role }: DashboardMenuProps) {
  const config = getDashboardConfig(role);
  const menuItems = config.menu;
  
  const unreadTotalCount = useSelector((state: RootState) => state.chat.unreadTotalCount);

  return (
    <nav className="space-y-1" aria-label="Dashboard navigation">
      {menuItems.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3C65F5] ${
              isActive
                ? "bg-[#3C65F5] text-white shadow-md shadow-blue-500/20 font-bold"
                : "text-slate-600 hover:bg-slate-50 hover:text-[#05264E]"
            }`
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1">{label}</span>
          
          {label === "Messages" && unreadTotalCount > 0 && (
            <span className="ml-auto inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {unreadTotalCount}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
