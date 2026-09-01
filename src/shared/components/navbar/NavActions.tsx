import { Link, useNavigate } from "react-router-dom";

import useAuth from "@/features/auth/hooks/useAuth";
import { getDashboardRoute } from "@/features/auth/utils/roleNavigation";
import { NotificationDropdown } from "@/shared/components/NotificationDropdown";

export default function NavActions() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
      void navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <NotificationDropdown />

        <Link
          to={getDashboardRoute(user.role)}
          className="inline-flex h-[38px] sm:h-[40px] items-center justify-center rounded-[5px] sm:rounded-[6px] bg-[#3C65F5] px-4 sm:px-5 text-[14px] font-medium text-white shadow-xs transition-colors duration-200 hover:bg-[#2956F2]"
        >
          Dashboard
        </Link>

        <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 dark:border-slate-700 dark:bg-slate-800/80 px-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3C65F5] text-xs font-semibold text-white">
            {user.name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>

          <span className="text-[14px] font-medium text-[#05264E] dark:text-slate-200">
            {user.name ?? user.email ?? "User"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex h-[38px] sm:h-[40px] items-center justify-center rounded-[5px] sm:rounded-[6px] border border-slate-200 dark:border-slate-700 px-4 text-[14px] font-medium text-[#05264E] dark:text-slate-200 transition hover:bg-slate-100/60 dark:hover:bg-slate-800"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="block-signin flex items-center h-[48px]">
      <Link to="/register">
        <span className="text-link-bd-btom hover-up inline-block text-[14px] font-semibold leading-[21px] text-[#05264E] dark:text-slate-200 underline underline-offset-4 decoration-[#05264E] dark:decoration-slate-200 hover:text-[#3C65F5] dark:hover:text-[#5E81FF] transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap">
          Register
        </span>
      </Link>

      <Link to="/login">
        <span className="btn btn-default btn-shadow ml-[40px] hover-up inline-flex h-[44px] items-center justify-center rounded-[6px] bg-[#3C65F5] px-[24px] py-[10px] text-[14px] font-semibold text-white shadow-[0_4px_10px_rgba(60,101,245,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2956F2] hover:shadow-[0_6px_15px_rgba(60,101,245,0.35)]">
          Sign in
        </span>
      </Link>
    </div>
  );
}