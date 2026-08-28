import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Download,
  MessageSquareMore,
  UserRoundCheck,
  XCircle,
  Calendar,
  Sparkles,
  CheckCircle2,
  Eye,
  Video,
  Building2,
  PhoneCall,
  Clock,
  MapPin,
  Link as LinkIcon,
  Plus,
  CalendarDays,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useAllApplications } from "../hooks/useAllApplications";
import { useUpdateApplicationStatus } from "../hooks/useUpdateApplicationStatus";
import { useApplicationInterviews } from "../hooks/useApplicationInterviews";
import { mapApplicantDetails } from "../utils/applicationMapper";
import { ScheduleInterviewModal } from "../components/applicants/ScheduleInterviewModal";
import { downloadFile } from "@/shared/utils/fileUtils";
import type { Interview, InterviewStatus } from "../types/interview.types";

export default function RecruiterApplicantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const attemptedAutoReviewRef = useRef<Set<string>>(new Set());

  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const {
    data: applications,
    isLoading,
    isError,
  } = useAllApplications();

  const {
    data: interviews = [],
    isLoading: isLoadingInterviews,
  } = useApplicationInterviews(id);

  const updateMutation = useUpdateApplicationStatus();

  const application = applications?.find((app) => app._id === id);

  // Automatically transition new "Applied" applications to "Under Review" when recruiter inspects them
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
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading applicant details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-600 shadow-sm">
        <p className="font-bold">Failed to load applicant details.</p>
        <p className="mt-1 text-xs text-red-500">Please check your network and try again.</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
        <p className="font-bold text-slate-800">Applicant not found.</p>
        <Link to="/recruiter/applicants" className="mt-3 inline-block text-xs font-bold text-[#3C65F5] hover:underline">
          &larr; Back to Applicants
        </Link>
      </div>
    );
  }

  const applicant = mapApplicantDetails(application);
  const currentStatus = application.status;
  const jobTitle =
    typeof application.jobId === "object" && application.jobId !== null
      ? (application.jobId as any).title
      : "Position";

  const handleStatusUpdate = (status: string) => {
    if (!id || updateMutation.isPending) return;
    updateMutation.mutate({ id, status });
  };

  const resumeUrl =
    application.resume || application.applicantId?.resumeUrl || "";

  return (
    <div className="space-y-6">
      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        applicationId={id}
        candidateName={applicant.candidate}
        jobTitle={jobTitle}
        defaultRoundNumber={interviews.length + 1}
      />

      {/* Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Link
              to="/recruiter/applicants"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
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
                Applied to <span className="font-semibold text-slate-700">{jobTitle}</span>
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
              className="rounded-xl bg-[#3C65F5] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#2956F2] shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <MessageSquareMore className="h-4 w-4" />
              <span>Message</span>
            </Link>

            {/* Schedule Interview Header Action */}
            {currentStatus !== "Rejected" && currentStatus !== "Hired" && (
              <button
                type="button"
                onClick={() => setIsInterviewModalOpen(true)}
                className="rounded-xl border border-purple-200 bg-purple-50/90 px-4 py-2.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition inline-flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Calendar className="h-4 w-4" />
                <span>{interviews.length > 0 ? "Schedule Another Round" : "Schedule Interview"}</span>
              </button>
            )}

            {/* Status Transition Actions */}
            {currentStatus === "Applied" && (
              <>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate("Under Review")}
                  disabled={updateMutation.isPending}
                  className="rounded-xl border border-amber-300 bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-600 disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  <span>Start Review</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate("Rejected")}
                  disabled={updateMutation.isPending}
                  className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject</span>
                </button>
              </>
            )}

            {currentStatus === "Under Review" && (
              <>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate("Shortlisted")}
                  disabled={updateMutation.isPending}
                  className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
                >
                  <UserRoundCheck className="h-4 w-4" />
                  <span>Shortlist</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate("Rejected")}
                  disabled={updateMutation.isPending}
                  className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject</span>
                </button>
              </>
            )}

            {currentStatus === "Shortlisted" && (
              <>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate("Interview")}
                  disabled={updateMutation.isPending}
                  className="rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-purple-700 disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
                >
                  <UserRoundCheck className="h-4 w-4" />
                  <span>Mark Interview Stage</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate("Rejected")}
                  disabled={updateMutation.isPending}
                  className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject</span>
                </button>
              </>
            )}

            {currentStatus === "Interview" && (
              <>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate("Hired")}
                  disabled={updateMutation.isPending}
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Hire Candidate</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate("Rejected")}
                  disabled={updateMutation.isPending}
                  className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject</span>
                </button>
              </>
            )}

            {currentStatus === "Hired" && (
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 shadow-xs">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>Hired Candidate ✓</span>
              </span>
            )}

            {currentStatus === "Rejected" && (
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-600 shadow-xs">
                <XCircle className="h-4 w-4 text-slate-500" />
                <span>Application Finalized (Rejected)</span>
              </span>
            )}

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
          {/* ── Scheduled Interviews & Multi-Round History Section ── */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[#3C65F5]" />
                  <span>Scheduled Interviews &amp; Rounds</span>
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Multi-round interview pipeline and scheduled sessions.
                </p>
              </div>

              {currentStatus !== "Rejected" && currentStatus !== "Hired" && (
                <button
                  type="button"
                  onClick={() => setIsInterviewModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] hover:bg-[#2e55e8] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>{interviews.length > 0 ? "Schedule Another Round" : "Schedule Interview"}</span>
                </button>
              )}
            </div>

            {isLoadingInterviews ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#3C65F5] border-t-transparent mx-auto mb-2" />
                Loading interviews...
              </div>
            ) : interviews.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center">
                <p className="text-xs font-semibold text-slate-700">No interviews scheduled yet</p>
                <p className="mt-1 text-xs text-slate-400">
                  Coordinate phone screens, technical interviews, or on-site discussions with this candidate.
                </p>
                {currentStatus !== "Rejected" && currentStatus !== "Hired" && (
                  <button
                    type="button"
                    onClick={() => setIsInterviewModalOpen(true)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#3C65F5] hover:underline cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Schedule Round 1</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {interviews.map((item: Interview) => {
                  const isVideo = item.mode === "video";
                  const isPhone = item.mode === "phone";
                  const isLink =
                    item.locationOrLink &&
                    (item.locationOrLink.startsWith("http://") ||
                      item.locationOrLink.startsWith("https://"));

                  return (
                    <div
                      key={item._id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition hover:border-slate-300 hover:shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-[#3C65F5] shadow-2xs">
                            {isVideo ? (
                              <Video className="h-5 w-5" />
                            ) : isPhone ? (
                              <PhoneCall className="h-5 w-5" />
                            ) : (
                              <Building2 className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              {item.title || `Round ${item.roundNumber}: ${item.type || "Interview"}`}
                            </h4>
                            <span className="text-[11px] font-medium text-slate-500 capitalize">
                              {item.mode} &bull; Round {item.roundNumber}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">{getInterviewStatusBadge(item.status)}</div>
                      </div>

                      <div className="mt-3.5 grid gap-3 sm:grid-cols-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="font-semibold">
                            {formatInterviewDateTime(
                              item.scheduledStartTime,
                              item.durationMinutes,
                              item.timezone
                            )}
                          </span>
                        </div>

                        {item.locationOrLink && (
                          <div className="flex items-center gap-2 text-slate-700 truncate">
                            {isVideo ? (
                              <LinkIcon className="h-4 w-4 text-slate-400 shrink-0" />
                            ) : isPhone ? (
                              <PhoneCall className="h-4 w-4 text-slate-400 shrink-0" />
                            ) : (
                              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                            )}
                            {isLink ? (
                              <a
                                href={item.locationOrLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#3C65F5] font-semibold hover:underline truncate"
                              >
                                {item.locationOrLink}
                              </a>
                            ) : (
                              <span className="truncate">{item.locationOrLink}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {item.notes && (
                        <div className="mt-3 rounded-xl bg-white border border-slate-100 p-3 text-xs text-slate-600">
                          <span className="font-semibold text-slate-800">Instructions: </span>
                          {item.notes}
                        </div>
                      )}

                      {item.candidateRsvp && item.candidateRsvp.status !== "pending" && (
                        <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span className="font-medium">Candidate RSVP:</span>
                          <span className="font-semibold text-slate-700 capitalize">
                            {item.candidateRsvp.status.replace("_", " ")}
                          </span>
                          {item.candidateRsvp.note && (
                            <span className="italic text-slate-400">({item.candidateRsvp.note})</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Candidate Profile */}
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
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3C65F5] hover:underline cursor-pointer"
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

function formatInterviewDateTime(isoString: string, durationMinutes?: number, timezone?: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  const dateStr = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateStr} · ${timeStr}${durationMinutes ? ` (${durationMinutes}m)` : ""}${timezone ? ` · ${timezone}` : ""}`;
}

function getInterviewStatusBadge(status: InterviewStatus) {
  switch (status) {
    case "scheduled":
      return (
        <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#3C65F5] border border-blue-100">
          Scheduled
        </span>
      );
    case "accepted":
      return (
        <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-100">
          Candidate Accepted
        </span>
      );
    case "declined":
      return (
        <span className="inline-flex items-center rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 border border-red-100">
          Declined
        </span>
      );
    case "reschedule_requested":
      return (
        <span className="inline-flex items-center rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-100">
          Reschedule Requested
        </span>
      );
    case "rescheduled":
      return (
        <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 border border-indigo-100">
          Rescheduled
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center rounded-lg bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700 border border-purple-100">
          Completed
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 border border-slate-200">
          Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
          {status}
        </span>
      );
  }
}

function normalizeStatusLabel(status: string): string {
  switch (status) {
    case "Applied":
      return "Applied (Pending Review)";
    case "Under Review":
      return "Under Review";
    case "Shortlisted":
      return "Shortlisted";
    case "Interview":
      return "Interview scheduled";
    case "Rejected":
      return "Rejected";
    case "Hired":
      return "Hired";
    default:
      return status;
  }
}

