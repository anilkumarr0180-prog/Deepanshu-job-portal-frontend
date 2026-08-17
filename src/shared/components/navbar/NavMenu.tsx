import { NavLink } from "react-router-dom";

import useAuth from "@/features/auth/hooks/useAuth";
import { NAV_MENU } from "./nav-menu";

export default function NavMenu() {
  const { isAuthenticated } = useAuth();

  // Authenticated users already have a "Dashboard" button in NavActions.
  // Showing "Home" for them is redundant — RootRedirector just bounces them
  // back to their dashboard anyway, which is confusing UX.
  const visibleItems = isAuthenticated
    ? NAV_MENU.filter((item) => item.label !== "Home")
    : NAV_MENU;

  return (
    <nav>
      <ul className="flex items-center gap-8">
        {visibleItems.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `text-[15px] font-medium tracking-wide transition-colors duration-200 ${
                  isActive
                    ? "text-[#3C65F5]"
                    : "text-slate-700 hover:text-[#3C65F5]"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}