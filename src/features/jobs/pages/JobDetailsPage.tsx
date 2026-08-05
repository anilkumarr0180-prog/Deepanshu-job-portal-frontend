import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useJobDetails } from "@/features/jobs/hooks/useJobDetails";
import {
  ApplyCard,
  Breadcrumb,
  CompanyCard,
  JobDescriptionSection,
  JobHeader,
  JobOverviewCard,
  SkillsSection,
} from "../components/details";

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const jobId = id ?? "";

  const {
    data: job,
    isLoading,
    isError,
    refetch,
  } = useJobDetails(jobId);

  /* ---------------- Loading Skeleton State ---------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-8 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-5 w-48 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Content Skeleton */}
            <div className="space-y-6 lg:col-span-8">
              <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />
              <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />
              <div className="h-40 animate-pulse rounded-3xl bg-slate-200" />
            </div>

            {/* Right Sidebar Skeleton */}
            <div className="space-y-6 lg:col-span-4">
              <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />
              <div className="h-80 animate-pulse rounded-3xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Error State ---------------- */
  if (isError || !job) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 text-slate-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <button
            type="button"
            onClick={() => {
              void navigate(-1);
            }}
            className="group mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to jobs</span>
          </button>

          <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Job Position Not Found
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              The job position you are looking for does not exist or may have been removed.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  void refetch();
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </button>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Browse All Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Main Content Render ---------------- */
  return (
    <div className="min-h-screen bg-slate-50/50 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb jobTitle={job.title} />

        {/* 2-Column Responsive Layout */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Left Content Area */}
          <main className="space-y-6 lg:col-span-8">
            <JobHeader job={job} />
            <JobDescriptionSection description={job.description} />
            <SkillsSection skills={job.skills} />
          </main>

          {/* Right Sidebar (Sticky on Desktop, Stacked below on Tablet & Mobile) */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <ApplyCard job={job} />
              <JobOverviewCard job={job} />
              <CompanyCard job={job} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}