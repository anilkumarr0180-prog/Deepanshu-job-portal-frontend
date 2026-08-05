import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Mail,
  MapPin,
  RefreshCw,
  User,
} from "lucide-react";

import { useJobs } from "@/features/jobs/hooks/useJobs";
import PublicJobCard from "@/features/jobs/components/PublicJobCard";
import JobCardSkeleton from "@/features/jobs/components/JobCardSkeleton";

export default function RecruiterDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const companyName = id ? decodeURIComponent(id) : "";

  /* Fetch jobs matching this company name */
  const { data, isLoading, isError, refetch } = useJobs({
    search: companyName,
    limit: "50",
  });

  /* Filter jobs specifically belonging to this company */
  const companyJobs = useMemo(() => {
    if (!data?.jobs) return [];

    return data.jobs.filter((job) =>
      job.company.toLowerCase().includes(companyName.toLowerCase())
    );
  }, [data, companyName]);

  const targetJob = companyJobs[0] ?? data?.jobs?.[0];

  const initials = companyName
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const recruiter = targetJob?.recruiterId;
  const companyLocation = targetJob?.location ?? "Various Locations";
  const companyAbout = targetJob?.description
    ? targetJob.description.split("\n\n")[0]
    : "Active hiring employer on JobBox.";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-8 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-40 animate-pulse rounded-3xl bg-slate-200" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || (!isLoading && companyJobs.length === 0)) {
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
            <span>Back to Recruiters</span>
          </button>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5]">
              <Building2 className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Company Not Found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              No active job listings found for <strong>{companyName}</strong>.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry</span>
              </button>
              <Link
                to="/recruiters"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Browse All Recruiters
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-900">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#EEF3FF]/80 via-white to-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            to="/recruiters"
            className="group mb-6 inline-flex items-center gap-2 text-xs font-bold text-slate-600 transition hover:text-[#3C65F5]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Recruiters</span>
          </Link>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                {/* Logo */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3C65F5] to-[#2545CB] text-2xl font-extrabold text-white shadow-md shadow-blue-500/20 sm:h-24 sm:w-24">
                  {initials || <Building2 className="h-10 w-10 text-white" />}
                </div>

                {/* Company Name & Location */}
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight text-[#05264E] sm:text-3xl">
                    {companyName}
                  </h1>

                  <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{companyLocation}</span>
                  </p>

                  {recruiter?.name && (
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>Recruiter: {recruiter.name}</span>
                      {recruiter.email && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{recruiter.email}</span>
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-[#EEF3FF] px-4 py-2 text-xs font-bold text-[#3C65F5]">
                  <Briefcase className="h-4 w-4" />
                  {companyJobs.length} {companyJobs.length === 1 ? "Open Position" : "Open Positions"}
                </span>
              </div>
            </div>

            {/* About Company */}
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                About {companyName}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {companyAbout}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions Section */}
      <main className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#05264E]">
            Open Positions at {companyName}
          </h2>
          <p className="text-xs text-slate-500">
            Explore current job openings and apply directly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companyJobs.map((job) => (
            <PublicJobCard key={job._id} job={job} />
          ))}
        </div>
      </main>
    </div>
  );
}
