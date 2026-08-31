import React from "react";
import {
  Send,
  Eye,
  Star,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  AlertCircle,
  RefreshCw,
  User,
  ShieldCheck,
} from "lucide-react";
import { useApplicationTimeline } from "../hooks/useApplicationTimeline";
import type { BackendApplicationStatusHistoryItem } from "../api/applications.api";

interface ApplicationTimelineProps {
  applicationId?: string;
  currentStatus?: string;
  createdAt?: string;
  interviewDetails?: {
    mode?: string;
    date?: string;
    time?: string;
    type?: string;
    locationOrLink?: string;
    notes?: string;
  };
}

interface TimelineStageConfig {
  label: string;
  icon: typeof Send;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconBg: string;
  dotColor: string;
  ringColor: string;
}

const STAGE_CONFIGS: Record<string, TimelineStageConfig> = {
  Applied: {
    label: "Application Submitted",
    icon: Send,
    bgColor: "bg-blue-50 dark:bg-blue-950/40",
    borderColor: "border-blue-200 dark:border-blue-800/60",
    textColor: "text-blue-700 dark:text-blue-300",
    iconBg: "bg-blue-500 text-white",
    dotColor: "bg-blue-500",
    ringColor: "ring-blue-400/40",
  },
  "Under Review": {
    label: "Under Review",
    icon: Eye,
    bgColor: "bg-amber-50 dark:bg-amber-950/40",
    borderColor: "border-amber-200 dark:border-amber-800/60",
    textColor: "text-amber-700 dark:text-amber-300",
    iconBg: "bg-amber-500 text-white",
    dotColor: "bg-amber-500",
    ringColor: "ring-amber-400/40",
  },
  Shortlisted: {
    label: "Candidate Shortlisted",
    icon: Star,
    bgColor: "bg-purple-50 dark:bg-purple-950/40",
    borderColor: "border-purple-200 dark:border-purple-800/60",
    textColor: "text-purple-700 dark:text-purple-300",
    iconBg: "bg-purple-600 text-white",
    dotColor: "bg-purple-600",
    ringColor: "ring-purple-400/40",
  },
  Interview: {
    label: "Interview Scheduled",
    icon: Calendar,
    bgColor: "bg-cyan-50 dark:bg-cyan-950/40",
    borderColor: "border-cyan-200 dark:border-cyan-800/60",
    textColor: "text-cyan-700 dark:text-cyan-300",
    iconBg: "bg-cyan-600 text-white",
    dotColor: "bg-cyan-600",
    ringColor: "ring-cyan-400/40",
  },
  Hired: {
    label: "Hired / Offer Accepted",
    icon: CheckCircle2,
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    borderColor: "border-emerald-200 dark:border-emerald-800/60",
    textColor: "text-emerald-700 dark:text-emerald-300",
    iconBg: "bg-emerald-600 text-white",
    dotColor: "bg-emerald-600",
    ringColor: "ring-emerald-400/40",
  },
  Rejected: {
    label: "Application Not Selected",
    icon: XCircle,
    bgColor: "bg-rose-50 dark:bg-rose-950/40",
    borderColor: "border-rose-200 dark:border-rose-800/60",
    textColor: "text-rose-700 dark:text-rose-300",
    iconBg: "bg-rose-600 text-white",
    dotColor: "bg-rose-600",
    ringColor: "ring-rose-400/40",
  },
  Withdrawn: {
    label: "Application Withdrawn",
    icon: RotateCcw,
    bgColor: "bg-slate-100 dark:bg-[#1B2639]",
    borderColor: "border-slate-300 dark:border-slate-700",
    textColor: "text-slate-700 dark:text-slate-300",
    iconBg: "bg-slate-500 text-white",
    dotColor: "bg-slate-500",
    ringColor: "ring-slate-400/40",
  },
};

function formatTimelineDate(dateString?: string): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default function ApplicationTimeline({
  applicationId,
  currentStatus = "Applied",
  createdAt,
  interviewDetails,
}: ApplicationTimelineProps) {
  const { data: history = [], isLoading, isError, refetch } = useApplicationTimeline(applicationId);

  // Normalize and sort history chronologically (Oldest -> Newest)
  const timelineItems = React.useMemo(() => {
    // 1. Sort existing database history strictly by createdAt ascending
    const sorted = [...history].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // 2. Check if an explicit "Applied" milestone exists in MongoDB history
    const hasAppliedRecord = sorted.some((item) => item.toStatus === "Applied");

    // 3. LEGACY COMPATIBILITY FALLBACK:
    // If and ONLY if MongoDB history contains no "Applied" record (e.g. applications created before audit logging),
    // synthesize a single baseline Applied milestone from the application's creation timestamp.
    if (!hasAppliedRecord) {
      const legacyAppliedFallback: BackendApplicationStatusHistoryItem = {
        _id: `legacy-fallback-applied-${applicationId || "init"}`,
        applicationId: applicationId || "",
        jobId: "",
        fromStatus: "Applied",
        toStatus: "Applied",
        changedBy: "Candidate",
        reason: "Application submitted successfully",
        createdAt: createdAt || new Date().toISOString(),
        updatedAt: createdAt || new Date().toISOString(),
      };
      sorted.unshift(legacyAppliedFallback);
    }

    return sorted;
  }, [history, applicationId, createdAt]);

  // Authoritative current-status milestone resolution
  const activeMilestoneIndex = React.useMemo(() => {
    if (timelineItems.length === 0) return -1;
    // Find the latest milestone matching Application.status
    for (let i = timelineItems.length - 1; i >= 0; i--) {
      if (timelineItems[i].toStatus === currentStatus) {
        return i;
      }
    }
    // If no exact match found, highlight the latest chronological record
    return timelineItems.length - 1;
  }, [timelineItems, currentStatus]);

  if (isLoading) {
    return (
      <div
        role="region"
        aria-label="Loading application timeline"
        className="rounded-2xl border border-slate-200/80 dark:border-[#2A3850] bg-white dark:bg-[#151F32] p-5 sm:p-6 shadow-xs"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2A3850] pb-3 mb-5">
          <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700/60 rounded-md animate-pulse" />
          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700/60 rounded-md animate-pulse" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="flex gap-4 items-start animate-pulse">
              <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700/60 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700/60 rounded" />
                <div className="h-3 w-1/4 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20 p-5 text-center shadow-xs"
      >
        <AlertCircle className="mx-auto h-7 w-7 text-rose-500 mb-2" />
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Unable to load application timeline</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Please try again to view status history.</p>
        <button
          type="button"
          onClick={() => refetch()}
          aria-label="Retry loading application timeline"
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Application timeline"
      className="rounded-2xl border border-slate-200/80 dark:border-[#2A3850] bg-white dark:bg-[#151F32] p-4 sm:p-6 shadow-xs transition-colors"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2A3850] pb-3 mb-5 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3C65F5]/10 text-[#3C65F5] dark:text-[#5E81FF]">
            <Clock className="h-4 w-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Application Timeline
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {timelineItems.length} {timelineItems.length === 1 ? "event" : "events"} recorded
        </span>
      </div>

      {/* Timeline Steps */}
      {timelineItems.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Application history isn't available yet.
          </p>
        </div>
      ) : (
        <div className="relative pl-1 sm:pl-2">
          {/* Vertical Connecting Line */}
          <div
            aria-hidden="true"
            className="absolute left-[18px] sm:left-[21px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-[#2A3850]"
          />

          <div role="list" className="space-y-5 sm:space-y-6">
            {timelineItems.map((item, index) => {
              const config = STAGE_CONFIGS[item.toStatus] || STAGE_CONFIGS.Applied;
              const Icon = config.icon;
              const isCurrent = index === activeMilestoneIndex;

              const actorName =
                typeof item.changedBy === "object" && item.changedBy !== null
                  ? item.changedBy.name || (item.changedBy.role === "recruiter" ? "Hiring Team" : "Candidate")
                  : typeof item.changedBy === "string"
                  ? item.changedBy
                  : "System";

              const actorRole =
                typeof item.changedBy === "object" && item.changedBy !== null
                  ? item.changedBy.role
                  : item.toStatus === "Applied"
                  ? "candidate"
                  : "recruiter";

              return (
                <div
                  key={item._id || `${item.toStatus}-${index}`}
                  role="listitem"
                  className="relative flex items-start gap-3 sm:gap-4 group"
                >
                  {/* Milestone Icon Node */}
                  <div
                    aria-hidden="true"
                    className={`relative z-10 flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border shadow-xs transition-all ${
                      config.iconBg
                    } ${config.borderColor} ${
                      isCurrent ? `ring-4 ${config.ringColor} scale-105` : "opacity-95"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>

                  {/* Milestone Details Card */}
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {config.label}
                        </span>

                        {isCurrent && (
                          <span
                            aria-current="step"
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black border ${config.bgColor} ${config.borderColor} ${config.textColor}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor} animate-ping`} />
                            Current Status
                          </span>
                        )}
                      </div>

                      <time
                        dateTime={item.createdAt}
                        className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap"
                      >
                        {formatTimelineDate(item.createdAt)}
                      </time>
                    </div>

                    {/* Actor & Transition Context */}
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {actorRole === "recruiter" ? (
                          <ShieldCheck className="h-3 w-3 text-indigo-500 shrink-0" />
                        ) : (
                          <User className="h-3 w-3 text-slate-400 shrink-0" />
                        )}
                        <span className="truncate max-w-[140px] sm:max-w-none">{actorName}</span>
                      </span>

                      {item.fromStatus && item.fromStatus !== item.toStatus && (
                        <>
                          <span aria-hidden="true">•</span>
                          <span className="text-[11px] text-slate-400 truncate">
                            From <span className="font-semibold text-slate-600 dark:text-slate-300">{item.fromStatus}</span>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Optional Note / Reason Box */}
                    {item.reason && item.reason.trim() !== "" && (
                      <div className="mt-2 rounded-xl border border-slate-100 dark:border-[#2A3850] bg-slate-50/80 dark:bg-[#1B2639]/70 p-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed break-words">
                        <p>{item.reason}</p>
                      </div>
                    )}

                    {/* Interview specific context if milestone is Interview */}
                    {item.toStatus === "Interview" && interviewDetails?.date && (
                      <div className="mt-2 rounded-xl border border-cyan-200/70 dark:border-cyan-800/50 bg-cyan-50/60 dark:bg-cyan-950/30 p-2.5 text-xs text-cyan-900 dark:text-cyan-200 break-words">
                        <p className="font-semibold">Interview Schedule:</p>
                        <p className="text-[11px] text-cyan-800 dark:text-cyan-300 mt-0.5">
                          {interviewDetails.type || "Interview Round"} • {interviewDetails.date} at {interviewDetails.time || "Scheduled Time"} ({interviewDetails.mode || "Video"})
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
