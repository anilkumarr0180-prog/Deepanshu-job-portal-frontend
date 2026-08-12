import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";
import { FeaturedJobBadge } from "@/features/subscription/components/PremiumBadges";
import {
  formatSalary,
  formatRelativeDate,
} from "@/features/jobs/utils/jobMapper";

interface PublicJobCardProps {
  job: BackendJobDetails;
}

export default function PublicJobCard({ job }: PublicJobCardProps) {
  const companyName = job.company?.trim() || "Company";

  const initials = companyName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "JB";

  const descriptionPreview = job.description
    ? job.description.split("\n\n")[0]
    : "";

  const salaryText = formatSalary(job.salaryMin, job.salaryMax);

  const visibleSkills = (job.skills ?? []).slice(0, 3);
  const extraSkills = Math.max(0, (job.skills?.length ?? 0) - visibleSkills.length);

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#3C65F5]/30 hover:shadow-xl"
    >
      {/* Logo + Title + Company + Location */}
      <div className="flex items-start gap-4">
        {(() => {
          const logoUrl = job.companyLogo || job.companyId?.logo || job.recruiterId?.profilePicture;
          return (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-[#EEF3FF] text-sm font-bold text-[#3C65F5]">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
          );
        })()}

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 text-lg font-semibold text-[#05264E] transition-colors group-hover:text-[#3C65F5]">
            {job.title || "Untitled Position"}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm font-medium text-slate-600">
            {companyName}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{job.location || "Remote"}</span>
          </p>
        </div>

        {job.isFeatured && (
          <div className="shrink-0">
            <FeaturedJobBadge />
          </div>
        )}
      </div>

      {/* Badges + Posted time */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-[#EEF3FF] px-2.5 py-1 text-xs font-semibold text-[#3C65F5]">
          {job.employmentType || "Full-time"}
        </span>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {job.experienceLevel || "Mid Level"}
        </span>
        <span className="ml-auto flex items-center gap-1 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          {formatRelativeDate(job.createdAt)}
        </span>
      </div>

      {/* Salary */}
      <div className="mt-4">
        <p className="text-lg font-bold text-[#05264E]">{salaryText}</p>
      </div>

      {/* Description */}
      {descriptionPreview && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {descriptionPreview}
        </p>
      )}

      {/* Skill tags */}
      {visibleSkills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 transition-colors hover:border-[#3C65F5] hover:text-[#3C65F5]"
            >
              {skill}
            </span>
          ))}
          {extraSkills > 0 && (
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-400">
              +{extraSkills}
            </span>
          )}
        </div>
      )}

      {/* Footer CTA */}
      <footer className="mt-5 flex items-stretch gap-3 border-t border-slate-100 pt-4">
        <span className="flex flex-1 items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-colors group-hover:bg-slate-50">
          View Details
        </span>
        <span className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#3C65F5] px-4 py-2.5 text-sm font-medium text-white transition-colors group-hover:bg-[#2956F2]">
          Apply Now
          <ArrowRight className="h-4 w-4" />
        </span>
      </footer>
    </Link>
  );
}
