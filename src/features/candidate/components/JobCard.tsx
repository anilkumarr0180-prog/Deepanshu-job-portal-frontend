import { Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";
import { formatSalary, formatRelativeDate } from "../utils/jobMapper";

interface JobCardProps {
  job: BackendJobDetails;
  onApply: (jobId: string) => void;
  isApplying: boolean;
}

const SKILLS_LIMIT = 5;

export default function JobCard({ job, onApply, isApplying }: JobCardProps) {
  const fullSkills = job.skills ?? [];
  const displayedSkills = fullSkills.slice(0, SKILLS_LIMIT);
  const remainingSkills = fullSkills.length - SKILLS_LIMIT;

  const descriptionPreview = job.description
    ? job.description.split("\n\n")[0].slice(0, 120)
    : "";

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex-1">
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
              {job.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600 line-clamp-1">
              {job.company}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
              Active
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {job.employmentType}
            </span>
          </div>
        </header>

        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {formatRelativeDate(job.createdAt)}
          </span>
        </div>

        <div className="mb-2 text-sm">
          <span className="font-medium text-slate-700">Salary:</span>
          <span className="text-slate-600">
            {" "}
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
        </div>

        <div className="mb-2 text-sm">
          <span className="font-medium text-slate-700">Experience:</span>
          <span className="text-slate-600">{job.experienceLevel}</span>
        </div>

        {displayedSkills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {displayedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {skill}
              </span>
            ))}
            {remainingSkills > 0 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                +{remainingSkills} more
              </span>
            )}
          </div>
        )}

        {descriptionPreview && (
          <p className="line-clamp-2 text-sm text-slate-500">
            {descriptionPreview}
            {job.description && job.description.length > 120 && "..."}
          </p>
        )}
      </div>

      <footer className="mt-5 flex gap-3 border-t border-slate-200 pt-4">
        <Link
          to={`/candidate/jobs/${job._id}`}
          className="flex-1 justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          View Details
        </Link>
        <button
          type="button"
          onClick={() => onApply(job._id)}
          disabled={isApplying}
          className="flex-1 rounded-xl bg-[#3C65F5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isApplying ? "Applying..." : "Apply Now"}
        </button>
      </footer>
    </article>
  );
}
