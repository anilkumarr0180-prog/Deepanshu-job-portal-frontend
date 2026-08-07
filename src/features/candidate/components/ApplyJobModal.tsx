import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  X,
  User,
  Mail,
  Phone,
  FileText,
  Briefcase,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Upload,
  Send,
} from "lucide-react";

import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";
import { formatSalary } from "../utils/jobMapper";
import { useProfile } from "../hooks/useProfile";
import { useMyApplications } from "../hooks/useMyApplications";
import { useApplyJob } from "../hooks/useApplyJob";

interface ApplyJobModalProps {
  job: BackendJobDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyJobModal({
  job,
  isOpen,
  onClose,
}: ApplyJobModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: myApplications } = useMyApplications();
  const applyJob = useApplyJob();

  useEffect(() => {
    if (!isOpen) {
      setCoverLetter("");
      setApiError(null);
    }
  }, [isOpen]);

  if (!isOpen || !job) return null;

  // Check if candidate has already applied for this job
  const existingApplication = myApplications?.find((app) => {
    if (typeof app.jobId === "string") {
      return app.jobId === job._id;
    }
    return app.jobId?._id === job._id;
  });

  const isAlreadyApplied = Boolean(existingApplication);
  const hasResume = Boolean(profile?.resumeUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAlreadyApplied || !hasResume || applyJob.isPending) return;
    setApiError(null);

    applyJob.mutate(
      { jobId: job._id, coverLetter },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: unknown) => {
          const axiosErr = err as {
            response?: { data?: { message?: string } };
          };
          const msg =
            axiosErr?.response?.data?.message ||
            "Failed to submit application. Please try again.";
          setApiError(msg);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl transition-all border border-slate-100 overflow-hidden z-10 my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#3C65F5]">
                Job Application
              </span>
              {isAlreadyApplied && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                  <CheckCircle2 className="h-3 w-3" /> Application Submitted
                </span>
              )}
            </div>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {job.title}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{job.company}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {job.location}
              </span>
              <span>•</span>
              <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isAlreadyApplied ? (
          /* Clean Submitted Application Summary View */
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Status Card */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-slate-50 p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Application Status
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold shadow-xs ${
                    existingApplication?.status === "Shortlisted"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : existingApplication?.status === "Interview"
                      ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                      : existingApplication?.status === "Under Review"
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : existingApplication?.status === "Hired"
                      ? "bg-purple-100 text-purple-800 border border-purple-200"
                      : existingApplication?.status === "Rejected"
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {existingApplication?.status || "Applied"}
                </span>
              </div>

              <div>
                <p className="text-base font-bold text-slate-900">
                  Application Submitted
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  Submitted on{" "}
                  {existingApplication?.createdAt
                    ? new Date(existingApplication.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )
                    : "Aug 7, 2026"}
                </p>
              </div>
            </div>

            {/* SMTP Email Dispatch Notice */}
            <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/80 p-3.5 text-xs text-blue-900 shadow-xs">
              <Mail className="h-4 w-4 text-[#3C65F5] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-950">Emails Dispatched via Nodemailer SMTP ✉️</p>
                <p className="mt-0.5 text-blue-700">
                  A confirmation receipt was sent to <span className="font-semibold">{profile?.email || "your registered email"}</span> and a candidate alert was sent to the job recruiter.
                </p>
              </div>
            </div>


            {/* Submitted Candidate Details */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <User className="h-4 w-4 text-[#3C65F5]" /> Submitted Profile Details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-900">
                    {profile?.name || "Candidate Name"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="truncate">{profile?.email || "No email"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{profile?.phone || "No phone added"}</span>
                </div>
                {profile?.headline && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">{profile.headline}</span>
                  </div>
                )}
              </div>

              {/* Resume Attached */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600 font-medium">Submitted Resume:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" /> Attached
                  </span>
                </div>
                {(existingApplication?.resume || profile?.resumeUrl) && (
                  <a
                    href={existingApplication?.resume || profile?.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#3C65F5] font-semibold hover:underline"
                  >
                    View Attached Resume &rarr;
                  </a>
                )}
              </div>
            </div>

            {/* Submitted Cover Letter View */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">
                Submitted Cover Letter
              </label>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed min-h-[90px]">
                {existingApplication?.coverLetter?.trim()
                  ? existingApplication.coverLetter
                  : "No cover letter was attached with this application."}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Close
              </button>

              <Link
                to="/candidate/applied"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 shadow-sm"
              >
                Track All Applied Jobs &rarr;
              </Link>
            </div>
          </div>
        ) : (
          /* New Application Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {apiError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Unable to submit application</p>
                  <p className="mt-0.5 text-rose-700">{apiError}</p>
                </div>
              </div>
            )}

            {/* User Profile Details Section */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <User className="h-4 w-4 text-[#3C65F5]" /> Your Application Profile Details
                </h3>
                <Link
                  to="/candidate/profile"
                  className="text-xs font-medium text-[#3C65F5] hover:underline"
                  onClick={onClose}
                >
                  Edit Profile
                </Link>
              </div>

              {isProfileLoading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-900">
                      {profile?.name || "Candidate Name"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">{profile?.email || "No email"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{profile?.phone || "No phone added"}</span>
                  </div>

                  {profile?.headline && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">{profile.headline}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Resume Status */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600 font-medium">Resume attached:</span>
                  {hasResume ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-600 font-medium text-xs bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      <AlertCircle className="h-3 w-3" /> Missing
                    </span>
                  )}
                </div>

                {!hasResume ? (
                  <Link
                    to="/candidate/resume"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
                    onClick={onClose}
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload Resume
                  </Link>
                ) : (
                  <a
                    href={profile?.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#3C65F5] font-medium hover:underline truncate max-w-[200px]"
                  >
                    View current resume &rarr;
                  </a>
                )}
              </div>
            </div>

            {!hasResume && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Resume required to apply</p>
                  <p className="mt-0.5 text-rose-700">
                    Please upload your resume in your candidate settings before submitting your job application.
                  </p>
                </div>
              </div>
            )}

            {/* Cover Letter Input */}
            <div className="space-y-2">
              <label
                htmlFor="coverLetter"
                className="block text-sm font-semibold text-slate-900"
              >
                Cover Letter <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="coverLetter"
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                disabled={!hasResume || applyJob.isPending}
                placeholder="Explain why you are a great fit for this position..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!hasResume || applyJob.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm"
              >
                <Send className="h-4 w-4" />
                {applyJob.isPending ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
