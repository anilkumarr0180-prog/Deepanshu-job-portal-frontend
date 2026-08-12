import { Clock, MapPin, CheckCircle2, Bookmark, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";
import { formatSalary, formatRelativeDate } from "../utils/jobMapper";
import { useCheckJobSavedStatus } from "../hooks/useSavedJobs";
import { useToggleSaveJob } from "../hooks/useToggleSaveJob";

interface JobCardProps {
  job: BackendJobDetails;
  onApply: (job: BackendJobDetails) => void;
  isApplying?: boolean;
  isApplied?: boolean;
}

const SKILLS_LIMIT = 5;

export default function JobCard({
  job,
  onApply,
  isApplying = false,
  isApplied = false,
}: JobCardProps) {
  const { data: isSaved = false } = useCheckJobSavedStatus(job._id);
  const toggleSaveMutation = useToggleSaveJob();

  const fullSkills = job.skills ?? [];
  const displayedSkills = fullSkills.slice(0, SKILLS_LIMIT);
  const remainingSkills = fullSkills.length - SKILLS_LIMIT;

  const descriptionPreview = job.description
    ? job.description.split("\n\n")[0].slice(0, 120)
    : "";

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveMutation.mutate({ jobId: job._id, isCurrentlySaved: isSaved });
  };

  const logoUrl = job.companyLogo || job.companyId?.logo || job.recruiterId?.profilePicture;

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#3C65F5]/40 hover:shadow-xl hover:shadow-blue-500/10">
      <div className="flex-1">
        {/* Header section with Company Initial Avatar & Bookmark Button */}
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-blue-50 to-indigo-100 font-bold text-[#3C65F5] shadow-xs group-hover:scale-105 transition-transform">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={job.company || job.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                job.company?.[0]?.toUpperCase() || <Building2 className="h-6 w-6" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-[#3C65F5] transition-colors">
                {job.title}
              </h3>
              <p className="mt-0.5 text-xs font-semibold text-slate-500 line-clamp-1 flex items-center gap-1">
                <span>{job.company}</span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleBookmarkToggle}
              disabled={toggleSaveMutation.isPending}
              title={isSaved ? "Remove from saved jobs" : "Save job"}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 border ${
                isSaved
                  ? "bg-blue-50 text-[#3C65F5] border-blue-200 shadow-xs"
                  : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-blue-50 hover:text-[#3C65F5] hover:border-blue-200 hover:scale-110 active:scale-95"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? "fill-[#3C65F5] text-[#3C65F5]" : ""}`} />
            </button>
          </div>
        </header>

        {/* Badges & Meta Info */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
          {isApplied && (
            <span className="inline-flex items-center gap-1 rounded-xl bg-amber-100/80 px-2.5 py-1 text-amber-900 border border-amber-300/60">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" /> Applied
            </span>
          )}
          <span className="inline-flex items-center rounded-xl bg-emerald-500/10 px-2.5 py-1 text-emerald-700 border border-emerald-500/20 font-bold">
            Active
          </span>
          <span className="inline-flex items-center rounded-xl bg-slate-100 px-2.5 py-1 text-slate-700">
            {job.employmentType}
          </span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {formatRelativeDate(job.createdAt)}
          </span>
        </div>

        {/* Salary & Experience highlight card */}
        <div className="mb-4 rounded-2xl bg-slate-50/80 p-3 text-xs flex items-center justify-between border border-slate-100">
          <div>
            <span className="font-medium text-slate-400 block text-[10px] uppercase tracking-wider">Salary</span>
            <span className="font-bold text-slate-800">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          </div>
          <div className="text-right">
            <span className="font-medium text-slate-400 block text-[10px] uppercase tracking-wider">Experience</span>
            <span className="font-bold text-slate-800">{job.experienceLevel}</span>
          </div>
        </div>

        {/* Skill Tags */}
        {displayedSkills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {displayedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-xl bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-[#3C65F5]"
              >
                {skill}
              </span>
            ))}
            {remainingSkills > 0 && (
              <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                +{remainingSkills} more
              </span>
            )}
          </div>
        )}

        {descriptionPreview && (
          <p className="line-clamp-2 text-xs text-slate-500 leading-relaxed">
            {descriptionPreview}
            {job.description && job.description.length > 120 && "..."}
          </p>
        )}
      </div>

      {/* Card Actions */}
      <footer className="mt-5 flex gap-2.5 border-t border-slate-100 pt-4">
        <Link
          to={`/candidate/jobs/${job._id}`}
          className="flex-1 justify-center text-center rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
        >
          View Details
        </Link>
        <button
          type="button"
          onClick={() => onApply(job)}
          disabled={isApplying}
          className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-sm ${
            isApplied
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-[#3C65F5] text-white hover:bg-blue-600 hover:shadow-blue-500/20 active:scale-95"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isApplying ? "Applying..." : isApplied ? "Applied" : "Apply Now"}
        </button>
      </footer>
    </article>
  );
}
