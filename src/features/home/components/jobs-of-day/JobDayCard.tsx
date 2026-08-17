import { Briefcase, Clock, MapPin, Zap } from "lucide-react";
import { Link } from "react-router-dom";

import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";
import { formatRelativeDate, formatSalary } from "@/features/jobs/utils/jobMapper";

interface JobDayCardProps {
  job: BackendJobDetails;
}

export default function JobDayCard({ job }: JobDayCardProps) {
  const initials = job.company
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const descriptionPreview = job.description
    ? job.description.split("\n\n")[0]
    : "";

  const salaryDisplay =
    job.salaryMin > 0 || job.salaryMax > 0
      ? formatSalary(job.salaryMin, job.salaryMax)
      : "Negotiable";

  const visibleSkills = job.skills?.slice(0, 3) ?? [];

  return (
    <div className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#3C65F5]/40 hover:shadow-xl hover:shadow-blue-500/5">
      <div>
        {/* Top Header: Logo + Company Name + Location + Lightning Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {(() => {
              const logoUrl = job.companyLogo || job.companyId?.logo || job.recruiterId?.profilePicture;
              return (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-[#3C65F5] to-[#2545CB] text-base font-extrabold text-white shadow-xs shadow-blue-500/10">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={job.company}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials || "JB"
                  )}
                </div>
              );
            })()}
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-bold text-[#05264E]">
                {job.company}
              </h4>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                <span className="truncate">{job.location}</span>
              </p>
            </div>
          </div>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Zap className="h-4 w-4" />
          </div>
        </div>

        {/* Job Title */}
        <Link to={`/jobs/${job._id}`} className="block">
          <h3 className="mt-3.5 line-clamp-1 text-base font-bold text-[#05264E] transition-colors group-hover:text-[#3C65F5]">
            {job.title}
          </h3>
        </Link>

        {/* Employment Type & Posted Date */}
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5 text-slate-400" />
            <span>{job.employmentType}</span>
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{formatRelativeDate(job.createdAt)}</span>
          </span>
        </div>

        {/* Description preview */}
        {descriptionPreview && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {descriptionPreview}
          </p>
        )}

        {/* Skill Pills */}
        {visibleSkills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {visibleSkills.map((skill, idx) => (
              <span
                key={`${skill}-${idx}`}
                className="rounded-md bg-slate-100 px-2.5 py-1 text-2xs font-medium text-slate-600 transition-colors group-hover:bg-[#EEF3FF] group-hover:text-[#3C65F5]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Salary + Apply Now Button */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <span className="text-base font-extrabold text-[#3C65F5]">
            {salaryDisplay}
          </span>
          <span className="text-2xs font-medium text-slate-400">/Year</span>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center justify-center rounded-xl bg-[#EEF3FF] px-4 py-2 text-xs font-bold text-[#3C65F5] transition-all duration-200 hover:bg-[#3C65F5] hover:text-white hover:shadow-md hover:shadow-blue-500/20"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}
