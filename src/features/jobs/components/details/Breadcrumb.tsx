import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbProps {
  jobTitle: string;
}

export default function Breadcrumb({ jobTitle }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-slate-500"
    >
      <Link
        to="/"
        className="flex items-center gap-1.5 transition-colors hover:text-[#3C65F5]"
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>

      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />

      <Link
        to="/jobs"
        className="transition-colors hover:text-[#3C65F5]"
      >
        Jobs
      </Link>

      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />

      <span className="line-clamp-1 font-medium text-slate-900" aria-current="page">
        {jobTitle}
      </span>
    </nav>
  );
}
