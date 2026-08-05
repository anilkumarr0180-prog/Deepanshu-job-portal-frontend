import { useState } from "react";
import { ArrowRight, CheckCircle2, Lock, Send, UserCheck } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

import useAuth from "@/features/auth/hooks/useAuth";
import { useApplyJob } from "@/features/candidate/hooks/useApplyJob";
import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";

interface ApplyCardProps {
  job: BackendJobDetails;
}

export default function ApplyCard({ job }: ApplyCardProps) {
  const { user, isAuthenticated } = useAuth();
  const applyJob = useApplyJob();
  const [coverLetter, setCoverLetter] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  const isCandidate = user?.role === "candidate";
  const isJobClosed = job.status?.toUpperCase() === "CLOSED";

  const handleApply = () => {
    if (!isCandidate || isJobClosed) return;

    applyJob.mutate(
      {
        jobId: job._id,
        coverLetter: coverLetter.trim() || undefined,
      },
      {
        onSuccess: () => {
          setHasApplied(true);
        },
      }
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center gap-2.5 text-[#05264E]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#3C65F5]">
          <Send className="h-4 w-4" />
        </div>
        <h3 className="text-lg font-bold">Apply for Position</h3>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        Interested in joining {job.company}? Submit your application directly to the recruiter.
      </p>

      {/* Case 1: Job is Closed */}
      {isJobClosed ? (
        <div className="mt-5 space-y-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
            <Lock className="h-4 w-4 shrink-0" />
            <span>Applications Closed</span>
          </div>
          <p className="text-xs text-amber-700">
            This job listing is no longer accepting new applications.
          </p>
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-slate-200 py-3 text-xs font-bold text-slate-500"
          >
            Position Closed
          </button>
        </div>
      ) : hasApplied ? (
        /* Case 2: Just applied successfully */
        <div className="mt-5 space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-emerald-900">Application Submitted!</h4>
          <p className="text-xs text-emerald-700">
            Your application for {job.title} has been received.
          </p>
        </div>
      ) : isAuthenticated && isCandidate ? (
        /* Case 3: Logged in Candidate */
        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="coverLetter"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              Cover Letter (Optional)
            </label>
            <textarea
              id="coverLetter"
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Introduce yourself and explain why you're a great fit for this role..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#3C65F5] focus:bg-white focus:ring-2 focus:ring-[#3C65F5]/20"
            />
          </div>

          <button
            type="button"
            onClick={handleApply}
            disabled={applyJob.isPending}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3C65F5] py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-[#2956F2] hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {applyJob.isPending ? (
              <span>Submitting Application...</span>
            ) : (
              <>
                <span>Apply Now</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      ) : isAuthenticated ? (
        /* Case 4: Logged in as Recruiter or Admin */
        <div className="mt-5 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <UserCheck className="h-4 w-4 text-slate-500 shrink-0" />
            <span>Role Restriction</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500">
            You are currently logged in as a <strong>{user?.role}</strong>. Only candidate accounts can apply for jobs.
          </p>
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-slate-200 py-3 text-xs font-bold text-slate-500"
          >
            Apply (Candidate Only)
          </button>
        </div>
      ) : (
        /* Case 5: Unauthenticated / Guest */
        <div className="mt-5 space-y-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs leading-relaxed text-slate-600">
            You must be logged in as a candidate to apply for this job.
          </p>
          <RouterLink
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3C65F5] py-3 text-xs font-bold text-white transition hover:bg-[#2956F2]"
          >
            <span>Sign In to Apply</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </RouterLink>
        </div>
      )}
    </div>
  );
}
