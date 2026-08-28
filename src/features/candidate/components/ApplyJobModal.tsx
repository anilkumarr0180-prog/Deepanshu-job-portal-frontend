import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ShieldCheck,
  Clock,
  Loader2,
  Edit3,
  RotateCcw,
  Calendar,
  CalendarDays,
  Video,
  Copy,
  Building2,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";
import { formatSalary } from "../utils/jobMapper";
import { useProfile } from "../hooks/useProfile";
import { useMyApplications } from "../hooks/useMyApplications";
import { useApplyJob } from "../hooks/useApplyJob";
import { useCreateConversation } from "@/features/chat/hooks/useChat";
import { useCloudinaryUpload } from "@/shared/hooks/useCloudinaryUpload";
import { useApplicationInterviews } from "@/features/recruiter/hooks/useApplicationInterviews";
import { useCandidateInterviewRsvp } from "../hooks/useCandidateInterviewRsvp";
import type { Interview } from "@/features/recruiter/types/interview.types";

function formatCandidateInterviewDate(startTime?: string | Date): string {
  if (!startTime) return "Confirmed by Recruiter";
  const date = new Date(startTime);
  if (isNaN(date.getTime())) return String(startTime);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCandidateInterviewTime(
  startTime?: string | Date,
  durationMinutes?: number,
  timezone?: string
): string {
  if (!startTime) return "10:00 AM";
  const date = new Date(startTime);
  if (isNaN(date.getTime())) return String(startTime);
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${timeStr}${durationMinutes ? ` (${durationMinutes}m)` : ""}${
    timezone ? ` · ${timezone}` : ""
  }`;
}

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
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: myApplications } = useMyApplications();
  const applyJob = useApplyJob();
  const createConversation = useCreateConversation();
  const { uploadFile, isUploading, progress } = useCloudinaryUpload();

  // Check if candidate has already applied for this job
  const existingApplication = myApplications?.find((app) => {
    if (!job) return false;
    if (typeof app.jobId === "string") {
      return app.jobId === job._id;
    }
    return app.jobId?._id === job._id;
  });

  const { data: applicationInterviews } = useApplicationInterviews(
    existingApplication?._id || ""
  );

  const {
    acceptMutation,
    declineMutation,
    isPending: isRsvpPending,
  } = useCandidateInterviewRsvp();

  // RSVP state
  const [declineConfirmId, setDeclineConfirmId] = useState<string | null>(null);
  const [declineNote, setDeclineNote] = useState("");

  // Toggle for Edit Mode vs Default Clean View
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  // Application Snapshot form fields
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantDesignation, setApplicantDesignation] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [noticePeriod, setNoticePeriod] = useState("Immediate");
  const [resumeOption, setResumeOption] = useState<"profile" | "custom">("profile");
  const [customResume, setCustomResume] = useState<{
    url: string;
    publicId: string;
    fileName: string;
  } | null>(null);

  useEffect(() => {
    if (profile) {
      setApplicantName(profile.name || "");
      setApplicantPhone(profile.phone || "");
      setApplicantDesignation(profile.headline || "");
      setExperienceYears(profile.experience?.length || 0);
      if (!profile.resumeUrl) {
        setResumeOption("custom");
      }
    }
  }, [profile]);

  useEffect(() => {
    if (!isOpen) {
      setCoverLetter("");
      setApiError(null);
      setIsEditingDetails(false);
      setDeclineConfirmId(null);
      setDeclineNote("");
    }
  }, [isOpen]);

  if (!isOpen || !job) return null;

  const isAlreadyApplied = Boolean(existingApplication);


  const activeResumeUrl =
    resumeOption === "custom" ? customResume?.url : profile?.resumeUrl;
  const activeResumePublicId =
    resumeOption === "custom" ? customResume?.publicId : profile?.resumePublicId;
  const activeResumeFileName =
    resumeOption === "custom"
      ? customResume?.fileName
      : profile?.resumeFileName || "Profile_Resume.pdf";

  const canSubmit = Boolean(activeResumeUrl) && !applyJob.isPending && !isUploading;

  const handleResetToProfile = () => {
    if (profile) {
      setApplicantName(profile.name || "");
      setApplicantPhone(profile.phone || "");
      setApplicantDesignation(profile.headline || "");
      setExperienceYears(profile.experience?.length || 0);
      setNoticePeriod("Immediate");
    }
    setIsEditingDetails(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await uploadFile(file, "resume");
    if (res) {
      setCustomResume({
        url: res.secure_url,
        publicId: res.public_id,
        fileName: res.original_filename || file.name,
      });
      setResumeOption("custom");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAlreadyApplied || !canSubmit) return;
    setApiError(null);

    applyJob.mutate(
      {
        jobId: job._id,
        coverLetter,
        applicantName,
        applicantPhone,
        applicantDesignation,
        experienceYears,
        noticePeriod,
        resumeUrl: activeResumeUrl,
        resumePublicId: activeResumePublicId,
        resumeFileName: activeResumeFileName,
      },
      {
        onSuccess: () => {
          createConversation.mutate(
            { jobId: job._id },
            {
              onSuccess: (conv) => {
                const id = conv._id || conv.id || "";
                setConversationId(id);
              },
            }
          );
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
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0a0d1a] shadow-2xl transition-all border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden z-10 my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-5 bg-slate-50/50 dark:bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-[#3C65F5] dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                Job Application
              </span>
              {isAlreadyApplied && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                  <CheckCircle2 className="h-3 w-3" /> Application Submitted
                </span>
              )}
            </div>
            <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {job.title}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">{job.company}</span>
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
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isAlreadyApplied ? (
          /* Submitted Application View */
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            <div className="rounded-2xl border border-blue-100 dark:border-slate-800 bg-gradient-to-br from-blue-50/50 via-white to-slate-50 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-slate-950/80 p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Application Status
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold shadow-xs ${existingApplication?.status === "Shortlisted"
                      ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                      : existingApplication?.status === "Interview"
                        ? "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20"
                        : existingApplication?.status === "Under Review"
                          ? "bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                          : existingApplication?.status === "Hired"
                            ? "bg-purple-100 dark:bg-purple-500/10 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20"
                            : existingApplication?.status === "Rejected"
                              ? "bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                              : "bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
                    }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {existingApplication?.status || "Applied"}
                </span>
              </div>

              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  Application Submitted
                </p>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
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

            {/* Scheduled Interviews Section (Live Multi-Round Data + Accept / Decline RSVP Actions) */}
            {((applicationInterviews && applicationInterviews.length > 0) ||
              existingApplication?.interviewDetails ||
              existingApplication?.status === "Interview") && (
              <div className="space-y-4">
                {applicationInterviews && applicationInterviews.length > 0 ? (
                  applicationInterviews.map((interview: Interview) => {
                    const isVideo =
                      interview.mode === "video" ||
                      interview.locationOrLink?.startsWith("http");
                    const isPhone = interview.mode === "phone";
                    const isInPerson =
                      interview.mode === "in-person" || (!isVideo && !isPhone);
                    const locationOrLink = interview.locationOrLink || "";
                    const candidateRsvp =
                      interview.candidateRsvp ||
                      (interview as any).candidateResponse;

                    const isPendingRsvp =
                      interview.status === "scheduled" ||
                      (interview.status === "rescheduled" &&
                        (!candidateRsvp ||
                          candidateRsvp.status === "pending"));

                    const isAccepted =
                      interview.status === "accepted" ||
                      candidateRsvp?.status === "accepted";

                    const isDeclined =
                      interview.status === "declined" ||
                      candidateRsvp?.status === "declined";

                    const isCancelled = interview.status === "cancelled";
                    const isCompleted = interview.status === "completed";


                    return (
                      <div
                        key={interview._id}
                        className="rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 dark:from-indigo-950/50 dark:via-slate-900/80 dark:to-blue-950/40 p-5 space-y-4 shadow-sm"
                      >
                        {/* Top Bar: Icon + Type + Format + Status Badge */}
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold shadow-sm shrink-0">
                              <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                  {interview.title || `Round ${interview.roundNumber}: ${interview.type || "Interview"}`}
                                </h4>
                                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-100/80 dark:bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                                  {isInPerson
                                    ? "🏢 In-Person On-Site"
                                    : isPhone
                                    ? "📞 Phone Call"
                                    : "📹 Online Video Call"}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Round {interview.roundNumber} &bull; The hiring team has scheduled this session.
                              </p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          {isAccepted ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30 shadow-2xs">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              Accepted
                            </span>
                          ) : isDeclined ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-500/20 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-500/30 shadow-2xs">
                              <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                              Declined
                            </span>
                          ) : isCancelled ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
                              <AlertCircle className="h-3.5 w-3.5 text-slate-500" />
                              Cancelled
                            </span>
                          ) : isCompleted ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-500/30 shadow-2xs">
                              <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-800 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/15 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/30 shadow-2xs">
                              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                              {interview.status === "rescheduled" ? "Rescheduled" : "Action Required"}
                            </span>
                          )}
                        </div>

                        {/* Date, Time & Schedule Info Cards */}
                        <div className="rounded-xl border border-indigo-100 dark:border-indigo-500/20 bg-white/80 dark:bg-slate-950/50 p-3.5 grid gap-3 sm:grid-cols-2 text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                              <CalendarDays className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="block font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Interview Date</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                {formatCandidateInterviewDate(interview.scheduledStartTime)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#3C65F5] dark:text-blue-400 shrink-0">
                              <Clock className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="block font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Scheduled Time</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                {formatCandidateInterviewTime(interview.scheduledStartTime, interview.durationMinutes, interview.timezone)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Full Location / Meeting Access Section */}
                        <div className="rounded-xl border border-indigo-100 dark:border-indigo-500/20 bg-white/80 dark:bg-slate-950/50 p-4 space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                              {isInPerson ? (
                                <Building2 className="h-4 w-4 text-[#3C65F5] shrink-0" />
                              ) : isPhone ? (
                                <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              ) : (
                                <Video className="h-4 w-4 text-[#3C65F5] shrink-0" />
                              )}
                              <span>
                                {isInPerson ? "Interview Venue / Office Address" : isPhone ? "Contact Number / Dial-in" : "Meeting Link & Video Room"}
                              </span>
                            </div>

                            {locationOrLink && (
                              <button
                                type="button"
                                onClick={() => {
                                  void navigator.clipboard.writeText(locationOrLink);
                                  toast.success(isInPerson ? "Address copied to clipboard!" : "Link copied to clipboard!");
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline cursor-pointer"
                              >
                                <Copy className="h-3 w-3" /> Copy {isInPerson ? "Address" : "Link"}
                              </button>
                            )}
                          </div>

                          <div className="rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-3 text-xs text-slate-800 dark:text-slate-200 leading-relaxed break-words">
                            {locationOrLink ? (
                              locationOrLink.startsWith("http") ? (
                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                  <a
                                    href={locationOrLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#3C65F5] dark:text-blue-400 font-semibold underline hover:text-blue-600 break-all"
                                  >
                                    {locationOrLink}
                                  </a>
                                  <a
                                    href={locationOrLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#3C65F5] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-600 transition"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" /> Join Video Meeting
                                  </a>
                                </div>
                              ) : (
                                <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                                  <p className="font-medium whitespace-pre-wrap leading-relaxed flex-1">{locationOrLink}</p>
                                  {isInPerson && (
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationOrLink)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 shrink-0 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-[#3C65F5] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 transition"
                                    >
                                      <MapPin className="h-3 w-3" /> Open Maps &rarr;
                                    </a>
                                  )}
                                </div>
                              )
                            ) : (
                              <p className="text-slate-400 italic">No specific address or meeting link was provided by the recruiter.</p>
                            )}
                          </div>
                        </div>

                        {/* Recruiter Instructions / Preparation Notes */}
                        {interview.notes && (
                          <div className="rounded-xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-950/30 p-3.5 text-xs space-y-1">
                            <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                              📝 Recruiter Instructions:
                            </span>
                            <p className="text-indigo-950 dark:text-indigo-200 leading-relaxed break-words whitespace-pre-wrap pl-4">
                              {interview.notes}
                            </p>
                          </div>
                        )}

                        {/* Candidate RSVP Actions / Status States */}
                        {isPendingRsvp && (
                          <div className="pt-2 border-t border-indigo-100 dark:border-indigo-500/20">
                            {declineConfirmId === interview._id ? (
                              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/90 dark:bg-rose-950/40 p-4 space-y-3">
                                <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
                                  Are you sure you want to decline this interview invitation?
                                </p>
                                <input
                                  type="text"
                                  value={declineNote}
                                  onChange={(e) => setDeclineNote(e.target.value)}
                                  placeholder="Optional reason for declining..."
                                  maxLength={500}
                                  className="w-full rounded-lg border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                                <div className="flex items-center gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeclineConfirmId(null);
                                      setDeclineNote("");
                                    }}
                                    disabled={isRsvpPending}
                                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      declineMutation.mutate(
                                        { interviewId: interview._id, note: declineNote },
                                        {
                                          onSuccess: () => {
                                            setDeclineConfirmId(null);
                                            setDeclineNote("");
                                          },
                                        }
                                      );
                                    }}
                                    disabled={isRsvpPending}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition cursor-pointer disabled:opacity-50"
                                  >
                                    {declineMutation.isPending ? "Declining..." : "Confirm Decline"}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-wrap items-center gap-3">
                                <button
                                  type="button"
                                  aria-label="Accept interview"
                                  onClick={() => acceptMutation.mutate({ interviewId: interview._id })}
                                  disabled={isRsvpPending}
                                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span>{acceptMutation.isPending ? "Accepting..." : "Accept Interview"}</span>
                                </button>

                                <button
                                  type="button"
                                  aria-label="Decline interview"
                                  onClick={() => {
                                    setDeclineConfirmId(interview._id);
                                    setDeclineNote("");
                                  }}
                                  disabled={isRsvpPending}
                                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-4 py-2.5 text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  <X className="h-4 w-4" />
                                  <span>Decline Interview</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {isAccepted && (
                          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/80 dark:bg-emerald-950/30 p-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>Interview Accepted &bull; The recruiter has been notified.</span>
                          </div>
                        )}

                        {isDeclined && (
                          <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/80 dark:bg-rose-950/30 p-3 text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                            <span>Interview Declined</span>
                          </div>
                        )}

                        {isCancelled && (
                          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-3 text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>Interview Cancelled by Recruiter</span>
                          </div>
                        )}

                        {isCompleted && (
                          <div className="rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/80 dark:bg-purple-950/30 p-3 text-xs font-bold text-purple-800 dark:text-purple-300 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                            <span>Interview Completed</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  (() => {
                    const details = existingApplication?.interviewDetails;
                    const isVideo = details?.mode === "video" || details?.locationOrLink?.startsWith("http");
                    const isPhone = details?.mode === "phone";
                    const isInPerson = details?.mode === "in-person" || (!isVideo && !isPhone);
                    const locationOrLink = details?.locationOrLink || "";

                    return (
                      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 dark:from-indigo-950/50 dark:via-slate-900/80 dark:to-blue-950/40 p-5 space-y-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold shadow-sm shrink-0">
                              <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                  {details?.type || "Scheduled Interview"}
                                </h4>
                                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-100/80 dark:bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                                  {isInPerson ? "🏢 In-Person On-Site" : isPhone ? "📞 Phone Call" : "📹 Online Video Call"}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                The hiring team has confirmed your interview schedule.
                              </p>
                            </div>
                          </div>

                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-800 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/15 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/30 shadow-2xs">
                            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                            Interview Scheduled
                          </span>
                        </div>

                        <div className="rounded-xl border border-indigo-100 dark:border-indigo-500/20 bg-white/80 dark:bg-slate-950/50 p-3.5 grid gap-3 sm:grid-cols-2 text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                              <CalendarDays className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="block font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Interview Date</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                {details?.date || "Confirmed by Recruiter"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#3C65F5] dark:text-blue-400 shrink-0">
                              <Clock className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="block font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Scheduled Time</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                {details?.time || "10:00 AM"} {details?.timezone ? `(${details.timezone})` : ""}
                              </span>
                            </div>
                          </div>
                        </div>

                        {locationOrLink && (
                          <div className="rounded-xl border border-indigo-100 dark:border-indigo-500/20 bg-white/80 dark:bg-slate-950/50 p-4 space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                                {isInPerson ? (
                                  <Building2 className="h-4 w-4 text-[#3C65F5] shrink-0" />
                                ) : isPhone ? (
                                  <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                ) : (
                                  <Video className="h-4 w-4 text-[#3C65F5] shrink-0" />
                                )}
                                <span>
                                  {isInPerson ? "Interview Venue / Office Address" : isPhone ? "Contact Number / Dial-in" : "Meeting Link & Video Room"}
                                </span>
                              </div>
                            </div>

                            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-3 text-xs text-slate-800 dark:text-slate-200 leading-relaxed break-words">
                              {locationOrLink.startsWith("http") ? (
                                <a
                                  href={locationOrLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#3C65F5] dark:text-blue-400 font-semibold underline hover:text-blue-600 break-all"
                                >
                                  {locationOrLink}
                                </a>
                              ) : (
                                <p className="font-medium whitespace-pre-wrap leading-relaxed">{locationOrLink}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}
              </div>
            )}

            <div className="flex items-start gap-3 rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50/80 dark:bg-blue-950/30 p-3.5 text-xs text-blue-900 dark:text-blue-200 shadow-xs">
              <Mail className="h-4 w-4 text-[#3C65F5] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-950 dark:text-blue-100">Emails Dispatched via Nodemailer SMTP ✉️</p>
                <p className="mt-0.5 text-blue-700 dark:text-blue-300/80">
                  A confirmation receipt was sent to <span className="font-semibold text-blue-950 dark:text-white">{profile?.email || "your registered email"}</span> and a candidate alert was sent to the job recruiter.
                </p>
              </div>
            </div>

            {/* Submitted Application Snapshot View */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="h-4 w-4 text-[#3C65F5]" /> Submitted Application Details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <User className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-900 dark:text-white">
                    {existingApplication?.applicantName || profile?.name || "Candidate Name"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="truncate">{existingApplication?.applicantEmail || profile?.email || "No email"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{existingApplication?.applicantPhone || profile?.phone || "No phone added"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="truncate">{existingApplication?.applicantDesignation || profile?.headline || "Full Stack Developer"}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Submitted Resume:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
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
                    View Submitted Resume &rarr;
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200">
                Submitted Cover Letter
              </label>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed min-h-[90px]">
                {existingApplication?.coverLetter?.trim()
                  ? existingApplication.coverLetter
                  : "No cover letter was attached with this application."}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(
                      conversationId
                        ? `/candidate/messages?conversationId=${conversationId}`
                        : `/candidate/messages?jobId=${job._id}`
                    );
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#3C65F5] dark:border-[#3C65F5]/40 bg-blue-50 dark:bg-blue-950/40 px-4 py-2.5 text-sm font-semibold text-[#3C65F5] dark:text-blue-400 transition hover:bg-blue-100 dark:hover:bg-blue-900/40"
                >
                  💬 Message Recruiter
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
          </div>
        ) : (
          /* New Tailored Application Form View */
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

            {/* Applicant Profile Details Section: Default Clean Summary vs Edit Mode */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#3C65F5]" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Application Profile Details
                  </h3>
                </div>

                {!isEditingDetails ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingDetails(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#3C65F5] hover:text-blue-700 hover:underline bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 transition"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit for this application
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResetToProfile}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Done / Reset to default
                  </button>
                )}
              </div>

              {isProfileLoading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                </div>
              ) : !isEditingDetails ? (
                /* Default Sleek Read-Only Summary View */
                <div className="grid gap-3 sm:grid-cols-2 text-sm bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-900">{applicantName || "Candidate Name"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate text-slate-600">{profile?.email || "No email"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-slate-600">{applicantPhone || "No phone added"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate text-slate-600">{applicantDesignation || "Role not specified"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700 sm:col-span-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span>Exp: <strong>{experienceYears} Yrs</strong></span>
                    <span>•</span>
                    <span>Notice: <strong>{noticePeriod}</strong></span>
                  </div>
                </div>
              ) : (
                /* Expanded Edit Form for Application Snapshot */
                <div className="space-y-4">
                  <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 flex items-start gap-2 shadow-2xs">
                    <ShieldCheck className="h-4 w-4 text-[#3C65F5] shrink-0 mt-0.5" />
                    <span>
                      <strong>Application Isolated Edit:</strong> Changes made here apply <strong>only to this application</strong>. Your master candidate profile remains untouched.
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 text-sm">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-[#3C65F5] focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          placeholder="Phone Number"
                          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-[#3C65F5] focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Target Role / Headline for this Job
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={applicantDesignation}
                          onChange={(e) => setApplicantDesignation(e.target.value)}
                          placeholder="e.g. Senior React & Full Stack Engineer"
                          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-[#3C65F5] focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Total Experience (Years)
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(Number(e.target.value))}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-[#3C65F5] focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Notice Period / Availability
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <select
                          value={noticePeriod}
                          onChange={(e) => setNoticePeriod(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-[#3C65F5] focus:ring-2 focus:ring-blue-100 appearance-none"
                        >
                          <option value="Immediate">Immediate / Serving Notice</option>
                          <option value="15 Days">15 Days or less</option>
                          <option value="30 Days">1 Month (30 Days)</option>
                          <option value="60 Days">2 Months (60 Days)</option>
                          <option value="90 Days">3 Months (90 Days)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resume Selection & Upload Section */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
              <label className="block text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#3C65F5]" /> Application Resume
              </label>

              {/* Option A: Default Profile Resume */}
              {profile?.resumeUrl && (
                <label
                  className={`flex items-start gap-3 rounded-xl border p-3.5 transition cursor-pointer ${resumeOption === "profile"
                      ? "border-[#3C65F5] bg-blue-50/60 ring-1 ring-[#3C65F5]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="resumeOption"
                    checked={resumeOption === "profile"}
                    onChange={() => setResumeOption("profile")}
                    className="mt-1 text-[#3C65F5] focus:ring-[#3C65F5]"
                  />
                  <div className="min-w-0 flex-1 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900">Use Saved Profile Resume</span>
                      <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Default
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {profile.resumeFileName || "Profile_Resume.pdf"}
                    </p>
                  </div>
                </label>
              )}

              {/* Option B: Upload Custom Resume */}
              <label
                className={`flex items-start gap-3 rounded-xl border p-3.5 transition cursor-pointer ${resumeOption === "custom"
                    ? "border-[#3C65F5] bg-blue-50/60 ring-1 ring-[#3C65F5]"
                    : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
              >
                <input
                  type="radio"
                  name="resumeOption"
                  checked={resumeOption === "custom"}
                  onChange={() => setResumeOption("custom")}
                  className="mt-1 text-[#3C65F5] focus:ring-[#3C65F5]"
                />
                <div className="min-w-0 flex-1 text-sm">
                  <span className="font-semibold text-slate-900">
                    Upload Updated / Custom Resume for this Job
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tailor your resume specifically for this position (PDF, DOCX up to 10MB)
                  </p>

                  {customResume ? (
                    <div className="mt-3 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 text-xs text-emerald-900">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold truncate">{customResume.fileName}</span>
                      </div>
                      <a
                        href={customResume.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#3C65F5] font-semibold hover:underline shrink-0"
                      >
                        Preview
                      </a>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <label className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 transition hover:border-[#3C65F5] hover:bg-blue-50/30 cursor-pointer">
                        {isUploading ? (
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#3C65F5]">
                            <Loader2 className="h-4 w-4 animate-spin" /> Uploading resume... {progress}%
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-center text-xs text-slate-500">
                            <Upload className="h-5 w-5 text-[#3C65F5] mb-1" />
                            <span className="font-semibold text-slate-700">Click to select PDF or DOCX file</span>
                            <span>Tailored specifically for {job.company}</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          disabled={isUploading}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </label>
            </div>

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
                rows={3}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                disabled={!canSubmit || applyJob.isPending}
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
                disabled={!canSubmit}
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
