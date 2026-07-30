import { Link } from "react-router-dom";

export default function NavActions() {
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