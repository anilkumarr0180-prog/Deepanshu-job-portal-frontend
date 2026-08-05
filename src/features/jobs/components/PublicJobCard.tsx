import { MapPin, Clock, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";
import { formatSalary, formatRelativeDate } from "@/features/jobs/utils/jobMapper";

interface PublicJobCardProps {
  job: BackendJobDetails;
}

export default function PublicJobCard({ job }: PublicJobCardProps) {
  const initials = job.company
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const descriptionPreview = job.description
    ? job.description.split("\n\n")[0].slice(0, 120)
    : "";

  const recruiterName = job.recruiterId?.name ?? "Not specified";
  const salaryText =
    job.salaryMin > 0 || job.salaryMax > 0
      ? formatSalary(job.salaryMin, job.salaryMax)
      : "Not specified";

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
          {initials}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
            {job.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600 line-clamp-1">
            {job.company}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {formatRelativeDate(job.createdAt)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {job.employmentType}
        </span>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {job.experienceLevel}
        </span>
      </div>

      <div className="mt-3 text-sm">
        <span className="font-medium text-slate-700">Salary:</span>
        <span className="text-slate-600">
          {" "}
          {salaryText}
        </span>
      </div>

      {descriptionPreview && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
          {descriptionPreview}
          {job.description && job.description.length > 120 && "..."}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <UserRound className="h-4 w-4" />
        <span className="line-clamp-1">{recruiterName}</span>
      </div>

      <footer className="mt-5 flex gap-3 border-t border-slate-200 pt-4">
        <Link
          to={`/jobs/${job._id}`}
          className="flex-1 justify-center rounded-xl bg-white px-4 py-2.5 text-center text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          View Details
        </Link>
        <button
          type="button"
          disabled
          className="flex-1 rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500"
        >
          Coming Soon
        </button>
      </footer>
    </article>
  );
}
