import { NavLink } from "react-router-dom";

import { NAV_MENU } from "./nav-menu";

export default function NavMenu() {
  return (
    <nav>
      <ul className="flex items-center gap-8">
        {NAV_MENU.map((item) => (
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