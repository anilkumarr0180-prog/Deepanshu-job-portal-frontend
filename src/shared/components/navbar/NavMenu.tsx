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
    <nav className="flex items-center">
      <ul className="flex items-center gap-6 lg:gap-8">
        {visibleItems.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `text-[15px] font-medium leading-none transition-colors duration-200 ${
                  isActive
                    ? "text-[#3C65F5] font-semibold"
                    : "text-[#05264E] hover:text-[#3C65F5] dark:text-slate-200 dark:hover:text-[#5E81FF]"
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