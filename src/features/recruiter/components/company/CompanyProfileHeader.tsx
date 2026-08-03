import { Edit3 } from "lucide-react";
import { Link } from "react-router-dom";

interface CompanyProfileHeaderProps {
  name: string;
  tagline: string;
}

export default function CompanyProfileHeader({ name, tagline }: CompanyProfileHeaderProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{name}</h2>
          <p className="mt-2 text-sm text-slate-500">{tagline}</p>
        </div>

        <Link to="/recruiter/company/edit" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          <Edit3 className="h-4 w-4" />
          Edit Company
        </Link>
      </div>
    </div>
  );
}
