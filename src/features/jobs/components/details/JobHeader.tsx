import { Building2, Calendar, Clock, MapPin } from "lucide-react";

import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";
import { formatRelativeDate, formatSalary } from "@/features/jobs/utils/jobMapper";

interface JobHeaderProps {
  job: BackendJobDetails;
}

export default function JobHeader({ job }: JobHeaderProps) {
  const companyInitials = job.company
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isStatusActive = job.status?.toUpperCase() === "ACTIVE";

  const salaryDisplay =
    job.salaryMin > 0 || job.salaryMax > 0
      ? formatSalary(job.salaryMin, job.salaryMax)
      : "Negotiable";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 sm:p-8">
      {/* Decorative subtle background gradient blur */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-50/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-indigo-50/60 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {/* Company Avatar / Logo */}
          {(() => {
            const logoUrl = job.companyLogo || job.companyId?.logo || job.recruiterId?.profilePicture;
            return (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-[#3C65F5] to-[#2545CB] text-xl font-extrabold text-white shadow-md shadow-blue-500/20 sm:h-20 sm:w-20 sm:text-2xl">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={job.company || job.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  companyInitials || <Building2 className="h-8 w-8 text-white" />
                )}
              </div>
            );
          })()}

          {/* Job Header Text Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-[#05264E] sm:text-3xl">
                {job.title}
              </h1>
              {job.status && (
                <span
                  className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${
                    isStatusActive
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                      : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                  }`}
                >
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1).toLowerCase()}
                </span>
              )}
            </div>

            <p className="flex items-center gap-2 text-base font-medium text-slate-700 sm:text-lg">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span>{job.company}</span>
            </p>

            {/* Sub-meta details */}
            <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-500 sm:text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                {job.location}
              </span>

              <span className="h-1 w-1 rounded-full bg-slate-300" />

              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                Posted {formatRelativeDate(job.createdAt)}
              </span>

              <span className="h-1 w-1 rounded-full bg-slate-300" />

              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                Updated {formatRelativeDate(job.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Bar */}
      <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-6">
        <span className="inline-flex items-center rounded-xl bg-[#EEF3FF] px-3.5 py-1.5 text-xs font-semibold text-[#3C65F5]">
          {job.employmentType}
        </span>
        <span className="inline-flex items-center rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700">
          {job.experienceLevel}
        </span>
        <span className="inline-flex items-center rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700">
          {salaryDisplay} / year
        </span>
      </div>
    </div>
  );
}
