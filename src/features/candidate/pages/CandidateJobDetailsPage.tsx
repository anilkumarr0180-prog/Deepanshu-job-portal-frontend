import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";

import { useJobDetails } from "@/features/jobs/hooks/useJobDetails";
import { useApplyJob } from "../hooks/useApplyJob";
import { formatSalary, formatRelativeDate } from "../utils/jobMapper";
import JobDetailsSkeleton from "../components/JobDetailsSkeleton";

export default function CandidateJobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState("");

  const {
    data: job,
    isLoading,
    isError,
    refetch,
  } = useJobDetails(id ?? "");

  const applyJob = useApplyJob();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
        </div>
        <JobDetailsSkeleton />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => {
            void navigate(-1);
          }}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse Jobs
        </button>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
          <p className="mb-4 text-sm text-rose-800">
            Failed to load job details. Please try again.
          </p>
          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    applyJob.mutate({ jobId: job._id, coverLetter });
  };

  const paragraphs = job.description
    ? job.description.split("\n\n").filter((p) => p.trim().length > 0)
    : [];

  return (
    <div className="space-y-6">
      <Link
        to="/candidate/jobs"
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Browse Jobs
      </Link>

      <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {job.title}
              </h1>
              <p className="mt-1 text-lg text-slate-600">{job.company}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Active
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {job.employmentType}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness className="h-4 w-4" />
              {job.experienceLevel}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
                Posted {formatRelativeDate(job.createdAt)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Salary: {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          </div>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-8 md:col-span-2">
            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                Job Description
              </h2>
              {paragraphs.length > 0 ? (
                <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                  {paragraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No description provided.
                </p>
              )}
            </section>

            {job.skills && job.skills.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div>
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Clock className="h-4 w-4" />
                <span>Apply now</span>
              </div>

              <p className="mb-3 text-xs text-slate-500">
                You can optionally include a cover letter. You must have a
                resume on file to apply.
              </p>

              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write a cover letter (optional)..."
                rows={5}
                className="mb-4 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                aria-label="Cover letter"
              />

              <button
                type="button"
                onClick={handleApply}
                disabled={applyJob.isPending}
                className="w-full rounded-xl bg-[#3C65F5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {applyJob.isPending
                  ? "Applying..."
                  : "Apply for this position"}
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
