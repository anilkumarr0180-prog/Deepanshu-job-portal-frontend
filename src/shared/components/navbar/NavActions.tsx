import { Link, useNavigate } from "react-router-dom";

import useAuth from "@/features/auth/hooks/useAuth";

export default function NavActions() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3C65F5] text-sm font-semibold text-white">
            {user.name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <span className="text-sm font-medium text-slate-700">
            {user.name ?? user.email ?? "User"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-10">
      <Link
        to="/register"
        className="text-[15px] font-medium text-slate-800 transition hover:text-[#3C65F5]"
      >
        Register
      </Link>

      <Link
        to="/login"
        className="rounded-xl bg-[#3C65F5] px-[25px] py-[10px] text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2956F2]"
      >
        Sign In
      </Link>
    </div>
  );
}