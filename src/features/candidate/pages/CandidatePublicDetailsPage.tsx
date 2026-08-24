import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  UserRound,
} from "lucide-react";

import { useJobs } from "@/features/jobs/hooks/useJobs";
import { formatRelativeDate } from "@/features/jobs/utils/jobMapper";
import ConnectionButton from "@/features/posts/components/ConnectionButton";

export default function CandidatePublicDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useJobs({ limit: "50" });
  const candidateId = id ?? "";
  const jobs = data?.jobs;

  /* Locate target candidate record from backend response */
  const targetJob = jobs?.find(
    (job) => job.recruiterId && job.recruiterId._id === candidateId
  );

  const candidate = targetJob?.recruiterId
    ? {
        _id: targetJob.recruiterId._id,
        name: targetJob.recruiterId.name || "Candidate Professional",
        email: targetJob.recruiterId.email || "",
        phone: undefined,
        profilePicture: undefined,
        resumeUrl: undefined,
        role: "Candidate",
        createdAt: targetJob.createdAt,
      }
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 text-slate-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="h-48 animate-pulse rounded-3xl bg-slate-200" />
          <div className="mt-6 h-64 animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (isError || !candidate) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 text-slate-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <button
            type="button"
            onClick={() => {
              void navigate(-1);
            }}
            className="group mb-6 inline-flex items-center gap-2 text-xs font-bold text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Candidates</span>
          </button>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5]">
              <UserRound className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Candidate Profile Not Found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              The requested candidate profile does not exist or is no longer available.
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
                to="/candidates"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Browse Candidates
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = candidate.name?.trim() || "Candidate Professional";
  const initials = displayName
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-900">
      <div className="relative overflow-hidden bg-gradient-to-b from-[#EEF3FF]/80 via-white to-white py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            to="/candidates"
            className="group mb-6 inline-flex items-center gap-2 text-xs font-bold text-slate-600 transition hover:text-[#3C65F5]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Candidates</span>
          </Link>

          {/* Profile Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Photo / Avatar */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#3C65F5] to-[#2545CB] text-2xl font-extrabold text-white shadow-md shadow-blue-500/20">
                {candidate.profilePicture ? (
                  <img
                    src={candidate.profilePicture}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : initials ? (
                  <span>{initials}</span>
                ) : (
                  <UserRound className="h-12 w-12 text-white" />
                )}
              </div>

              {/* Info */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#05264E] sm:text-3xl">
                  {displayName}
                </h1>

                {candidate.email && (
                  <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{candidate.email}</span>
                  </p>
                )}

                {candidate.phone && (
                  <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{candidate.phone}</span>
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-[#EEF3FF] px-3.5 py-1 text-xs font-bold text-[#3C65F5]">
                    Candidate
                  </span>

                  {candidate.createdAt && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Joined {formatRelativeDate(candidate.createdAt)}
                    </span>
                  )}

                  <div className="ml-auto">
                    <ConnectionButton
                      targetUserId={candidate._id}
                      size="sm"
                      showDirectMessage={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Resume Status
              </h2>

              {candidate.resumeUrl ? (
                <div className="mt-4 rounded-2xl bg-emerald-50/70 p-4 ring-1 ring-inset ring-emerald-600/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Resume Verified & Uploaded</span>
                  </div>
                  <div className="mt-3">
                    <a
                      href={candidate.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-800"
                    >
                      <FileText className="h-4 w-4" />
                      <span>View Uploaded Resume</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    This candidate has not attached a public resume link yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
