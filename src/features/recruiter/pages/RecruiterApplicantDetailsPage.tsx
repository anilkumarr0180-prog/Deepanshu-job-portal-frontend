import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Download, MessageSquareMore, UserRoundCheck, XCircle, Calendar, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useAllApplications } from "../hooks/useAllApplications";
import { useUpdateApplicationStatus } from "../hooks/useUpdateApplicationStatus";
import { mapApplicantDetails } from "../utils/applicationMapper";
import { ScheduleInterviewModal, type ScheduleInterviewDetails } from "../components/applicants/ScheduleInterviewModal";
import { downloadFile } from "@/shared/utils/fileUtils";

export default function RecruiterApplicantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const attemptedAutoReviewRef = useRef<Set<string>>(new Set());

  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const {
    data: applications,
    isLoading,
    isError,
  } = useAllApplications();

  const updateMutation = useUpdateApplicationStatus();

  const application = applications?.find((app) => app._id === id);

  useEffect(() => {
    if (
      id &&
      application &&
      (application.status === "Applied" || application.status === "Submitted") &&
      !attemptedAutoReviewRef.current.has(id) &&
      !updateMutation.isPending
    ) {
      attemptedAutoReviewRef.current.add(id);
      updateMutation.mutate({ id, status: "Under Review" });
    }
  }, [id, application?.status, updateMutation.isPending]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading applicant details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-600">
        Failed to load applicant details.
      </div>
    );
  }

  if (!application) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        Applicant not found.
      </div>
    );
  }

  const applicant = mapApplicantDetails(application);

  const handleStatusUpdate = (status: string) => {
    if (!id || updateMutation.isPending) return;
    updateMutation.mutate({ id, status });
  };

  const handleScheduleConfirm = (details: ScheduleInterviewDetails) => {
    if (!id || updateMutation.isPending) return;
    updateMutation.mutate(
      { id, status: "Interview", interviewDetails: details },
      {
        onSuccess: () => {
          setIsInterviewModalOpen(false);
        },
      }
    );
  };

  const resumeUrl =
    application.resume || application.applicantId?.resumeUrl || "";

  const isShortlisted = application.status === "Shortlisted";
  const isRejected = application.status === "Rejected";
  const isInterview = application.status === "Interview";

  return (
    <div className="space-y-6">
      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        candidateName={applicant.candidate}
        onSchedule={handleScheduleConfirm}
        isSubmitting={updateMutation.isPending}
      />

      {/* Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Link to="/recruiter/applicants" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              Back to applicants
            </Link>

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">{applicant.candidate}</h2>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#3C65F5] border border-blue-100">
                  {applicant.summary}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Applied to <span className="font-semibold text-slate-700">{typeof application.jobId === "object" && application.jobId !== null ? (application.jobId as any).title : "Position"}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to={`/recruiter/messages?jobId=${
                typeof application.jobId === "object" && application.jobId !== null
                  ? (application.jobId as any)._id
                  : String(application.jobId)
              }&applicantId=${
                typeof application.applicantId === "object" && application.applicantId !== null
                  ? (application.applicantId as any)._id
                  : String(application.applicantId)
              }`}
              className="rounded-xl bg-[#3C65F5] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#2956F2] shadow-xs inline-flex items-center gap-2"
            >
              <MessageSquareMore className="h-4 w-4" />
              <span>Message</span>
            </Link>

            <button
              type="button"
              onClick={() => handleStatusUpdate("Shortlisted")}
              disabled={updateMutation.isPending}
              className={`rounded-xl px-4 py-2.5 text-xs transition disabled:opacity-50 inline-flex items-center gap-2 ${
                isShortlisted
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "border border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100 font-semibold"
              }`}
            >
              <UserRoundCheck className="h-4 w-4" />
              <span>{isShortlisted ? "Shortlisted ✓" : "Shortlist"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleStatusUpdate("Rejected")}
              disabled={updateMutation.isPending}
              className={`rounded-xl px-4 py-2.5 text-xs transition disabled:opacity-50 inline-flex items-center gap-2 ${
                isRejected
                  ? "bg-red-600 text-white font-bold shadow-xs"
                  : "border border-red-200 bg-red-50/80 text-red-700 hover:bg-red-100 font-semibold"
              }`}
            >
              <XCircle className="h-4 w-4" />
              <span>{isRejected ? "Rejected ✓" : "Reject"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsInterviewModalOpen(true)}
              disabled={updateMutation.isPending}
              className={`rounded-xl px-4 py-2.5 text-xs transition disabled:opacity-50 inline-flex items-center gap-2 ${
                isInterview
                  ? "bg-purple-600 text-white font-bold shadow-xs"
                  : "border border-purple-200 bg-purple-50/80 text-purple-700 hover:bg-purple-100 font-semibold"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>{isInterview ? "Interview Scheduled" : "Schedule Interview"}</span>
            </button>

            {resumeUrl ? (
              <button
                type="button"
                onClick={() => downloadFile(resumeUrl, `${applicant.candidate}-Resume.pdf`)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 cursor-pointer shadow-xs"
              >
                <Download className="h-4 w-4" />
                <span>Download Resume</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">Candidate Profile</h3>
              <p className="mt-0.5 text-xs text-slate-500">Contact information &amp; career background.</p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <p className="text-xs font-medium text-slate-500">Email Address</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{applicant.email}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <p className="text-xs font-medium text-slate-500">Phone Number</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{applicant.phone}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <p className="text-xs font-medium text-slate-500">Location</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{applicant.location}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <p className="text-xs font-medium text-slate-500">Total Experience</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{applicant.experience}</p>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">Relevant Skills &amp; Qualifications</h3>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {applicant.skills.length > 0 ? (
                applicant.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-xl border border-blue-100 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-[#3C65F5]"
                  >
                    <Sparkles className="h-3 w-3 text-blue-400" />
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 font-medium">General Qualifications Attached</span>
              )}
            </div>
          </section>

          {/* Cover Letter */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">Cover Letter / Note</h3>
            </div>
            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-700 leading-relaxed">
              {applicant.coverLetter}
            </div>
          </section>

          {/* Resume Label */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">Resume Attachment</h3>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
              <span className="text-xs font-medium text-slate-700 truncate max-w-sm">
                📄 {applicant.resumeLabel}
              </span>
              {resumeUrl && (
                <button
                  type="button"
                  onClick={() => downloadFile(resumeUrl, `${applicant.candidate}-Resume.pdf`)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3C65F5] hover:underline"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </button>
              )}
            </div>
          </section>

          {/* Application Timeline */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">Application Timeline</h3>
            </div>
            <div className="mt-5 space-y-3">
              {applicant.timeline.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                  <p className="text-xs font-bold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-600">{item.detail}</p>
                  <p className="mt-2 text-[10px] uppercase font-semibold text-slate-400">{item.date}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Application Status</h3>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-bold uppercase tracking-wider text-slate-700">
              {normalizeStatusLabel(application.status)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function normalizeStatusLabel(status: string): string {
  switch (status) {
    case "Applied":
      return "Pending review";
    case "Shortlisted":
      return "Shortlisted";
    case "Interview":
      return "Interview scheduled";
    case "Rejected":
      return "Rejected";
    case "Hired":
      return "Hired";
    default:
      return "Pending review";
  }
}
