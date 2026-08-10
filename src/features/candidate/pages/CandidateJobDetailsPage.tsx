import { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Send,
  Bookmark,
} from "lucide-react";

import { useJobDetails } from "@/features/jobs/hooks/useJobDetails";
import { useMyApplications } from "../hooks/useMyApplications";
import { useCheckJobSavedStatus } from "../hooks/useSavedJobs";
import { useToggleSaveJob } from "../hooks/useToggleSaveJob";
import { formatSalary, formatRelativeDate } from "../utils/jobMapper";
import JobDetailsSkeleton from "../components/JobDetailsSkeleton";
import ApplyJobModal from "../components/ApplyJobModal";

export default function CandidateJobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const {
    data: job,
    isLoading,
    isError,
    refetch,
  } = useJobDetails(id ?? "");

  const { data: myApplications } = useMyApplications();

  const { data: isSaved = false } = useCheckJobSavedStatus(id ?? "");
  const toggleSaveMutation = useToggleSaveJob();

  const handleBookmarkToggle = () => {
    if (!id) return;
    toggleSaveMutation.mutate({ jobId: id, isCurrentlySaved: isSaved });
  };

  const isAlreadyApplied = useMemo(() => {
    if (!job || !myApplications) return false;
    return myApplications.some((app) => {
      if (typeof app.jobId === "string") {
        return app.jobId === job._id;
      }
      return app.jobId?._id === job._id;
    });
  }, [job, myApplications]);

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
              <button
                type="button"
                onClick={handleBookmarkToggle}
                disabled={toggleSaveMutation.isPending}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition border ${
                  isSaved
                    ? "bg-blue-50 text-[#3C65F5] border-blue-200"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-[#3C65F5] text-[#3C65F5]" : ""}`} />
                <span>{isSaved ? "Saved" : "Save Job"}</span>
              </button>
              {isAlreadyApplied && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Already Applied
                </span>
              )}
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
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Send className="h-4 w-4 text-[#3C65F5]" />
                  <span>{isAlreadyApplied ? "Application Submitted" : "Apply now"}</span>
                </div>
              </div>

              {isAlreadyApplied ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    You have already applied for this job. Click below to review your candidate application details.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 leading-relaxed">
                  Review your candidate profile details and optionally write a cover letter before submitting your application.
                </p>
              )}

              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                  isAlreadyApplied
                    ? "bg-[#3C65F5] hover:bg-blue-600"
                    : "bg-[#3C65F5] hover:bg-blue-600"
                } shadow-sm`}
              >
                {isAlreadyApplied ? "View Application Details" : "Apply for this position"}
              </button>

              {isAlreadyApplied && (
                <Link
                  to="/candidate/applied"
                  className="block text-center text-xs font-semibold text-[#3C65F5] hover:underline pt-1"
                >
                  Track in Applied Jobs &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Unified Apply Job Modal */}
      <ApplyJobModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
}
