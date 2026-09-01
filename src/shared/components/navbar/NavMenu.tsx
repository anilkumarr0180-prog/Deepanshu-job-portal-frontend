import { NavLink } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";
import { NAV_MENU } from "./nav-menu";

export default function NavMenu() {
  const { isAuthenticated } = useAuth();

  const visibleItems = isAuthenticated
    ? NAV_MENU.filter((item) => item.label !== "Home")
    : NAV_MENU;

  return (
    <nav className="nav-main-menu h-[44px] flex items-center">
      <ul className="main-menu flex items-center">
        {visibleItems.map((item) => (
          <li
            key={item.label}
            className={`${
              item.hasDropdown ? "has-children" : ""
            } group relative shrink-0 px-[11px] lg:px-[13px] xl:px-[15px] py-[10px] h-[38px] flex items-center`}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `inline-flex items-center text-[14px] font-semibold leading-[18px] whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? "text-[#3C65F5]"
                    : "text-[#05264E] hover:text-[#3C65F5] dark:text-slate-200 dark:hover:text-[#5E81FF]"
                }`
              }
            >
              <span className="whitespace-nowrap">{item.label}</span>
              {item.hasDropdown && (
                <svg
                  className="ml-1.5 w-2 h-1.5 fill-[#A0ABB8] group-hover:fill-[#3C65F5] transition-transform duration-200 group-hover:rotate-180 dark:fill-slate-500 dark:group-hover:fill-[#5E81FF] shrink-0"
                  viewBox="0 0 10 6"
                >
                  <path d="M5 6L0 0H10L5 6Z" />
                </svg>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}