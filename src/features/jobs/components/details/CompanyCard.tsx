import { Building2, Mail, User } from "lucide-react";

import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";

interface CompanyCardProps {
  job: BackendJobDetails;
}

export default function CompanyCard({ job }: CompanyCardProps) {
  const companyInitials = job.company
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const recruiter = job.recruiterId;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
      <h3 className="border-b border-slate-100 pb-4 text-lg font-bold text-[#05264E]">
        Company Details
      </h3>

      <div className="mt-5 flex items-center gap-4">
        {(() => {
          const logoUrl = job.companyLogo || job.companyId?.logo || job.recruiterId?.profilePicture;
          return (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-[#3C65F5] to-[#2545CB] text-lg font-bold text-white shadow-sm">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={job.company}
                  className="h-full w-full object-cover"
                />
              ) : (
                companyInitials || <Building2 className="h-6 w-6 text-white" />
              )}
            </div>
          );
        })()}
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-base font-bold text-slate-900">
            {job.company}
          </h4>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            Verified Employer
          </p>
        </div>
      </div>

      {recruiter && (recruiter.name || recruiter.email) && (
        <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Hiring Manager / Recruiter
          </p>

          {recruiter.name && (
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">{recruiter.name}</span>
            </div>
          )}

          {recruiter.email && (
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">{recruiter.email}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
