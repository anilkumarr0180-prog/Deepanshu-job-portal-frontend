import { useState, useEffect, type FormEvent } from "react";
import {
  Video,
  Building2,
  PhoneCall,
  X,
  MapPin,
  Link as LinkIcon,
  Phone,
  Globe,
  Clock,
  Calendar,
  Layers,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useCreateInterview } from "../../hooks/useCreateInterview";
import type { InterviewMode, Interview } from "../../types/interview.types";

export interface ScheduleInterviewDetails {
  mode: InterviewMode;
  date: string;
  time: string;
  type: string;
  title?: string;
  roundNumber?: number;
  durationMinutes?: number;
  locationOrLink: string;
  timezone?: string;
  notes?: string;
}

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  candidateName: string;
  jobTitle?: string;
  defaultRoundNumber?: number;
  onSchedule?: (details: ScheduleInterviewDetails) => void;
  onSuccess?: (interview: Interview) => void;
  isSubmitting?: boolean;
}

const INTERVIEW_TYPE_OPTIONS = [
  "Technical Interview",
  "HR Screening",
  "System Design Round",
  "On-Site Coding Pair",
  "Executive Final Round",
  "Culture & Fit Round",
  "Portfolio / Design Review",
  "Managerial Discussion",
];

const DURATION_OPTIONS = [
  { value: 15, label: "15 mins" },
  { value: 30, label: "30 mins" },
  { value: 45, label: "45 mins" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

export function ScheduleInterviewModal({
  isOpen,
  onClose,
  applicationId,
  candidateName,
  jobTitle,
  defaultRoundNumber = 1,
  onSchedule,
  onSuccess,
  isSubmitting: externalIsSubmitting = false,
}: ScheduleInterviewModalProps) {
  const defaultTz =
    typeof Intl !== "undefined" && Intl.DateTimeFormat
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC";

  // Compute tomorrow at 10:00 AM as a safe default initial slot
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];
  const todayStr = new Date().toISOString().split("T")[0];

  const [mode, setMode] = useState<InterviewMode>("video");
  const [roundNumber, setRoundNumber] = useState<number>(defaultRoundNumber);
  const [interviewType, setInterviewType] = useState("Technical Interview");
  const [customTitle, setCustomTitle] = useState("");
  const [date, setDate] = useState(defaultDateStr);
  const [time, setTime] = useState("10:00");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [timezone, setTimezone] = useState(defaultTz);
  const [locationOrLink, setLocationOrLink] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const createInterviewMutation = useCreateInterview();

  // Reset/sync defaults when opening
  useEffect(() => {
    if (isOpen) {
      setRoundNumber(defaultRoundNumber || 1);
      setCustomTitle(`Round ${defaultRoundNumber || 1}: ${interviewType}`);
      setFormError(null);
    }
  }, [isOpen, defaultRoundNumber, interviewType]);

  // Handle ESC keyboard key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSubmitting = externalIsSubmitting || createInterviewMutation.isPending;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Validation
    if (!date || !time) {
      setFormError("Please select both an interview date and time.");
      return;
    }

    const localDateTime = new Date(`${date}T${time}:00`);
    if (isNaN(localDateTime.getTime())) {
      setFormError("Invalid date/time value provided.");
      return;
    }

    if (localDateTime.getTime() <= Date.now()) {
      setFormError("Interview start time must be in the future.");
      return;
    }

    if (durationMinutes < 5 || durationMinutes > 480) {
      setFormError("Duration must be between 5 and 480 minutes.");
      return;
    }

    const resolvedLocationOrLink =
      locationOrLink.trim() ||
      (mode === "video"
        ? "https://meet.google.com/new"
        : mode === "in-person"
        ? "Main Office Headquarters"
        : "Recruiter will call candidate directly");

    const resolvedTitle =
      customTitle.trim() || `Round ${roundNumber}: ${interviewType}`;

    const scheduledStartTime = localDateTime.toISOString();

    // 2. Direct API submission if applicationId is available
    if (applicationId) {
      createInterviewMutation.mutate(
        {
          applicationId,
          roundNumber,
          title: resolvedTitle,
          type: interviewType,
          mode,
          scheduledStartTime,
          durationMinutes,
          timezone: timezone.trim() || defaultTz,
          locationOrLink: resolvedLocationOrLink,
          notes: notes.trim() || undefined,
        },
        {
          onSuccess: (newInterview) => {
            if (onSchedule) {
              onSchedule({
                mode,
                date,
                time,
                type: interviewType,
                title: resolvedTitle,
                roundNumber,
                durationMinutes,
                timezone,
                locationOrLink: resolvedLocationOrLink,
                notes,
              });
            }
            if (onSuccess) {
              onSuccess(newInterview);
            }
            onClose();
          },
        }
      );
    } else if (onSchedule) {
      // Legacy fallback if called without direct applicationId
      onSchedule({
        mode,
        date,
        time,
        type: interviewType,
        title: resolvedTitle,
        roundNumber,
        durationMinutes,
        timezone,
        locationOrLink: resolvedLocationOrLink,
        notes,
      });
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-interview-title"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close dialog"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-[#3C65F5] dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-2xs">
            {mode === "video" ? (
              <Video className="w-6 h-6" />
            ) : mode === "in-person" ? (
              <Building2 className="w-6 h-6" />
            ) : (
              <PhoneCall className="w-6 h-6" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3
              id="schedule-interview-title"
              className="text-xl font-bold text-slate-900 dark:text-white"
            >
              Schedule Interview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              For <span className="font-semibold text-slate-700 dark:text-slate-300">{candidateName}</span>
              {jobTitle && <span> &bull; {jobTitle}</span>}
            </p>
          </div>
        </div>

        {/* Form Validation Alert */}
        {formError && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-3 text-xs text-rose-700 dark:text-rose-300 font-medium animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Interview Mode / Location Type */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Interview Mode
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setMode("video")}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl p-3 border text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  mode === "video"
                    ? "border-[#3C65F5] bg-blue-50/80 dark:bg-blue-500/10 text-[#3C65F5] dark:text-blue-400 ring-2 ring-blue-500/20"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video Call</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("in-person")}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl p-3 border text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  mode === "in-person"
                    ? "border-[#3C65F5] bg-blue-50/80 dark:bg-blue-500/10 text-[#3C65F5] dark:text-blue-400 ring-2 ring-blue-500/20"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>In-Person</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("phone")}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl p-3 border text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  mode === "phone"
                    ? "border-[#3C65F5] bg-blue-50/80 dark:bg-blue-500/10 text-[#3C65F5] dark:text-blue-400 ring-2 ring-blue-500/20"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Phone Call</span>
              </button>
            </div>
          </div>

          {/* 2. Round Number & Format / Type */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Round #
              </label>
              <div className="relative flex items-center">
                <Layers className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={roundNumber}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10) || 1;
                    setRoundNumber(num);
                    setCustomTitle(`Round ${num}: ${interviewType}`);
                  }}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white focus:border-[#3C65F5] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Stage / Type
              </label>
              <select
                value={interviewType}
                onChange={(e) => {
                  setInterviewType(e.target.value);
                  setCustomTitle(`Round ${roundNumber}: ${e.target.value}`);
                }}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-[#3C65F5] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition cursor-pointer"
              >
                {INTERVIEW_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Custom Title / Stage Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Interview Title
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Round 1: Technical Screen"
              maxLength={150}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-[#3C65F5] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition"
            />
          </div>

          {/* 4. Date, Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Date
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 pl-9 pr-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-[#3C65F5] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Start Time
              </label>
              <div className="relative flex items-center">
                <Clock className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 pl-9 pr-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-[#3C65F5] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Duration
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-[#3C65F5] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition cursor-pointer"
              >
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Timezone */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Timezone
            </label>
            <div className="relative flex items-center">
              <Globe className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="e.g. Asia/Kolkata, America/New_York, UTC"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 dark:text-white focus:border-[#3C65F5] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition"
              />
            </div>
          </div>

          {/* 6. Dynamic Location / URL */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {mode === "video"
                ? "Meeting URL (Google Meet / Zoom / Microsoft Teams)"
                : mode === "in-person"
                ? "Office Location Address & Desk Instructions"
                : "Recruiter Phone Number / Calling Instructions"}
            </label>
            <div className="relative flex items-center">
              {mode === "video" ? (
                <LinkIcon className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              ) : mode === "in-person" ? (
                <MapPin className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              ) : (
                <Phone className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              )}
              <input
                type={mode === "video" ? "url" : "text"}
                value={locationOrLink}
                onChange={(e) => setLocationOrLink(e.target.value)}
                placeholder={
                  mode === "video"
                    ? "https://meet.google.com/abc-defg-hij"
                    : mode === "in-person"
                    ? "e.g. 4th Floor, Corporate Tower, Sector 62"
                    : "e.g. Recruiter will call candidate at +91 9876543210"
                }
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 dark:text-white focus:border-[#3C65F5] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition"
              />
            </div>
          </div>

          {/* 7. Instructions / Notes */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Instructions for Candidate (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                mode === "in-person"
                  ? "Please bring valid government ID and report to reception..."
                  : "Please join from a quiet workspace with working camera & microphone..."
              }
              maxLength={2000}
              className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-[#3C65F5] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition"
            />
          </div>

          {/* Modal Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3C65F5] hover:bg-[#2e55e8] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Scheduling...</span>
                </>
              ) : (
                <span>Confirm & Schedule</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
