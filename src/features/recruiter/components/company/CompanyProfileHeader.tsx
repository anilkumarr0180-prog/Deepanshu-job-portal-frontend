import { Edit3, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

interface CompanyProfileHeaderProps {
  name: string;
  tagline: string;
  logo?: string;
}

export default function CompanyProfileHeader({ name, tagline, logo }: CompanyProfileHeaderProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-xs">
            {logo ? (
              <img
                src={logo}
                alt={name}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <Building2 className="h-8 w-8 text-slate-400" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{name}</h2>
            <p className="mt-1 text-sm text-slate-500">{tagline}</p>
          </div>
        </div>

        <Link
          to="/recruiter/company/edit"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Edit3 className="h-4 w-4" />
          Edit Company
        </Link>
      </div>
    </div>
  );
}
