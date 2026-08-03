import { NavLink } from "react-router-dom";

import { getDashboardConfig } from "./dashboardConfig";

interface DashboardMenuProps {
  role?: string | null;
}

export default function DashboardMenu({ role }: DashboardMenuProps) {
  const config = getDashboardConfig(role);
  const menuItems = config.menu;

  return (
    <nav className="space-y-1" aria-label="Dashboard navigation">
      {menuItems.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 ${
              isActive
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`
          }
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
