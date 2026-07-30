import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";

import { NAV_MENU } from "./nav-menu";

export default function NavMenu() {
  return (
    <nav>
      <ul className="flex items-center gap-9">
        {NAV_MENU.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-[15px] font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-[#3C65F5]"
                    : "text-slate-700 hover:text-[#3C65F5]"
                }`
              }
            >
              <span>{item.label}</span>

              {item.hasDropdown && (
                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  className="mt-[1px]"
                />
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}