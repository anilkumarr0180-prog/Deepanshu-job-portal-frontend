import { useState } from "react";
import { ArrowRight, CheckCircle2, Lock, Send, UserCheck, Zap, FileText } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

import useAuth from "@/features/auth/hooks/useAuth";
import { useApplyJob } from "@/features/candidate/hooks/useApplyJob";
import { useQuickApplyJob } from "@/features/candidate/hooks/useQuickApplyJob";
import { useProfile } from "@/features/candidate/hooks/useProfile";
import { useMyApplications } from "@/features/candidate/hooks/useMyApplications";
import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";

interface ApplyCardProps {
  job: BackendJobDetails;
}

export default function ApplyCard({ job }: ApplyCardProps) {
  const { user, isAuthenticated } = useAuth();
  const applyJob = useApplyJob();
  const quickApplyJob = useQuickApplyJob();
  const { data: profile } = useProfile();
  const { data: myApplications } = useMyApplications();
  const [coverLetter, setCoverLetter] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);

  const isCandidate = user?.role === "candidate";
  const isJobClosed = job.status?.toUpperCase() === "CLOSED";

  // Check if candidate already applied
  const existingApplication = myApplications?.find((app) => {
    if (!job) return false;
    if (typeof app.jobId === "string") {
      return app.jobId === job._id;
    }
    return app.jobId?._id === job._id;
  });

  const isAlreadyApplied = Boolean(existingApplication);
  const hasProfileResume = Boolean(profile?.resumeUrl);

  const handleQuickApply = () => {
    if (!isCandidate || isJobClosed || isAlreadyApplied) return;

    quickApplyJob.mutate({
      jobId: job._id,
      coverLetter: coverLetter.trim() || undefined,
    });
  };

  const handleCustomApply = () => {
    if (!isCandidate || isJobClosed || isAlreadyApplied) return;

    applyJob.mutate(
      {
        jobId: job._id,
        coverLetter: coverLetter.trim() || undefined,
      }
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center gap-2.5 text-[#05264E]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#3C65F5]">
          <Zap className="h-4 w-4 fill-[#3C65F5]" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Quick Apply</h3>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            ⚡ 1-Click Submission
          </span>
        </div>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        Interested in joining {job.company}? Apply in seconds using your profile information.
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
      ) : isAlreadyApplied ? (
        /* Case 2: Already Applied */
        <div className="mt-5 space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-emerald-900">Application Submitted!</h4>
          <p className="text-xs text-emerald-700">
            Status: <span className="font-bold">{existingApplication?.status || "Applied"}</span>
          </p>
          <RouterLink
            to="/candidate/applied"
            className="inline-block mt-2 text-xs font-semibold text-[#3C65F5] hover:underline"
          >
            View in My Applications &rarr;
          </RouterLink>
        </div>
      ) : isAuthenticated && isCandidate ? (
        /* Case 3: Logged in Candidate */
        <div className="mt-5 space-y-4">
          {/* Profile Resume Badge */}
          {hasProfileResume ? (
            <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-slate-700">
              <div className="flex items-center gap-2 truncate">
                <FileText className="h-4 w-4 text-[#3C65F5] shrink-0" />
                <span className="truncate font-medium">
                  {profile?.resumeFileName || "Profile Resume Attached"}
                </span>
              </div>
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                Ready
              </span>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <p className="font-semibold">No resume on profile</p>
              <p className="mt-0.5 text-[11px] text-amber-700">
                Please upload a resume in your profile or customize this application.
              </p>
              <RouterLink
                to="/candidate/resume"
                className="inline-block mt-1.5 text-xs font-bold text-[#3C65F5] hover:underline"
              >
                Upload Resume &rarr;
              </RouterLink>
            </div>
          )}

          {/* Primary Quick Apply Button */}
          <button
            type="button"
            onClick={handleQuickApply}
            disabled={quickApplyJob.isPending || applyJob.isPending || !hasProfileResume}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3C65F5] py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-[#2956F2] hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
          >
            <Zap className="h-4 w-4 fill-white" />
            {quickApplyJob.isPending ? (
              <span>Submitting Quick Apply...</span>
            ) : (
              <>
                <span>Quick Apply Now</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          {/* Optional Cover Letter & Custom Apply toggle */}
          <div className="border-t border-slate-100 pt-3">
            {!showCustomForm ? (
              <button
                type="button"
                onClick={() => setShowCustomForm(true)}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-[#3C65F5] transition"
              >
                + Add Cover Letter or Custom Details
              </button>
            ) : (
              <div className="space-y-3">
                <label
                  htmlFor="coverLetter"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Cover Letter (Optional)
                </label>
                <textarea
                  id="coverLetter"
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself or add notes for the hiring team..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#3C65F5] focus:bg-white focus:ring-2 focus:ring-[#3C65F5]/20"
                />
                <button
                  type="button"
                  onClick={handleCustomApply}
                  disabled={applyJob.isPending || quickApplyJob.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  <Send className="h-3.5 w-3.5" />
                  {applyJob.isPending ? "Submitting..." : "Submit with Cover Letter"}
                </button>
              </div>
            )}
          </div>
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
            Quick Apply (Candidate Only)
          </button>
        </div>
      ) : (
        /* Case 5: Unauthenticated / Guest */
        <div className="mt-5 space-y-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs leading-relaxed text-slate-600">
            Sign in to use 1-click Quick Apply with your profile resume.
          </p>
          <RouterLink
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3C65F5] py-3 text-xs font-bold text-white transition hover:bg-[#2956F2]"
          >
            <Zap className="h-3.5 w-3.5 fill-white" />
            <span>Sign In to Quick Apply</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </RouterLink>
        </div>
      )}
    </div>
  );
}
