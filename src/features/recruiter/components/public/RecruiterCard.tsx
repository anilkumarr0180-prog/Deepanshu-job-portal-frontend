import { ArrowRight, Briefcase, Building2, MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";

import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";

export interface DerivedCompany {
  id: string;
  name: string;
  location: string;
  description: string;
  activeJobsCount: number;
  recruiterName?: string;
  recruiterEmail?: string;
  createdAt: string;
  jobs: BackendJobDetails[];
}

interface RecruiterCardProps {
  company: DerivedCompany;
}

export default function RecruiterCard({ company }: RecruiterCardProps) {
  const initials = company.name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#3C65F5]/40 hover:shadow-xl hover:shadow-blue-500/5">
      <div>
        {/* Company Logo + Name + Location */}
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3C65F5] to-[#2545CB] text-xl font-extrabold text-white shadow-md shadow-blue-500/15 transition-transform duration-300 group-hover:scale-105">
            {initials || <Building2 className="h-7 w-7 text-white" />}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-lg font-bold text-[#05264E] transition-colors group-hover:text-[#3C65F5]">
              {company.name}
            </h3>

            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="line-clamp-1">{company.location}</span>
            </p>

            {company.recruiterName && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <User className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="line-clamp-1">{company.recruiterName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Truncated description */}
        <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
          {company.description || "Active hiring recruiter on JobBox platform."}
        </p>
      </div>

      {/* Card Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#EEF3FF] px-3 py-1.5 text-xs font-bold text-[#3C65F5]">
          <Briefcase className="h-3.5 w-3.5" />
          {company.activeJobsCount} {company.activeJobsCount === 1 ? "Job Open" : "Jobs Open"}
        </span>

        <Link
          to={`/recruiters/${encodeURIComponent(company.id)}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-[#3C65F5] hover:shadow-md hover:shadow-blue-500/20"
        >
          <span>View Company</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
