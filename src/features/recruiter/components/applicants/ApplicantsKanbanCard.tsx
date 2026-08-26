import type { DragEvent } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  CalendarDays,
  BadgeCheck,
  XCircle,
  Clock,
  Briefcase,
  User,
  Sparkles,
  ArrowRight,
  GripVertical,
} from "lucide-react";

import type { RecruiterApplicantRecord } from "../../types";

interface ApplicantsKanbanCardProps {
  applicant: RecruiterApplicantRecord;
  onView?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string, interviewDetails?: any) => void;
  onOpenScheduleModal?: (applicant: RecruiterApplicantRecord) => void;
  onDragStartCard?: (applicant: RecruiterApplicantRecord) => void;
  onDragEndCard?: () => void;
  isUpdating?: boolean;
  isDragging?: boolean;
}

export default function ApplicantsKanbanCard({
  applicant,
  onView,
  onUpdateStatus,
  onOpenScheduleModal,
  onDragStartCard,
  onDragEndCard,
  isUpdating = false,
  isDragging = false,
}: ApplicantsKanbanCardProps) {
  const initial = applicant.candidate?.charAt(0)?.toUpperCase() || "C";
  const normalizedStatus = applicant.status;

  const handleStatusChange = (newStatus: string) => {
    if (isUpdating || !onUpdateStatus) return;
    if (newStatus === "Interview") {
      if (onOpenScheduleModal) {
        onOpenScheduleModal(applicant);
      } else {
        onUpdateStatus(applicant.id, "Interview");
      }
      return;
    }
    onUpdateStatus(applicant.id, newStatus);
  };

  const handleViewDetails = () => {
    if (onView) {
      onView(applicant.id);
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    if (isUpdating) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", JSON.stringify({
      id: applicant.id,
      status: applicant.status,
      candidate: applicant.candidate,
    }));
    e.dataTransfer.effectAllowed = "move";
    if (onDragStartCard) {
      onDragStartCard(applicant);
    }
  };

  const handleDragEnd = () => {
    if (onDragEndCard) {
      onDragEndCard();
    }
  };

  return (
    <div
      draggable={!isUpdating}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group relative rounded-2xl border bg-white p-4 shadow-sm transition-all duration-200 ${
        isDragging
          ? "cursor-grabbing opacity-40 ring-2 ring-[#3C65F5] border-[#3C65F5] scale-95 shadow-lg"
          : isUpdating
          ? "cursor-wait opacity-60 border-slate-200"
          : "cursor-grab hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md border-slate-200/90"
      }`}
    >
      {/* Top row: Drag Grip, Avatar & Candidate Info */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className="text-slate-300 transition-colors group-hover:text-slate-400 cursor-grab active:cursor-grabbing"
            title="Drag to move status"
          >
            <GripVertical className="h-4 w-4" />
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3C65F5]/15 to-indigo-100 text-xs font-extrabold text-[#3C65F5]">
            {initial}
          </div>
          <div>
            <Link
              to={`/recruiter/applicants/${applicant.id}`}
              className="text-sm font-bold text-slate-900 transition-colors hover:text-[#3C65F5] hover:underline"
            >
              {applicant.candidate}
            </Link>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Briefcase className="h-3 w-3 text-slate-400" />
              <span className="truncate max-w-[130px]">{applicant.job}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleViewDetails}
          className="rounded-lg p-1 text-slate-400 opacity-80 transition hover:bg-slate-100 hover:text-slate-700"
          title="View Applicant Profile"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      {/* Experience & Applied Date */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 font-medium text-slate-600">
          <User className="h-3 w-3 text-slate-400" />
          {applicant.experience}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="h-3 w-3" />
          {applicant.appliedDate}
        </span>
      </div>

      {/* Skills chips */}
      {applicant.skills && applicant.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {applicant.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
            >
              {skill}
            </span>
          ))}
          {applicant.skills.length > 3 && (
            <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              +{applicant.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Quick Status Action Controls */}
      <div className="mt-3.5 border-t border-slate-100 pt-3">
        {normalizedStatus === "Applied" && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleStatusChange("Under Review")}
              disabled={isUpdating}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-600 disabled:opacity-50"
            >
              <span>Review</span>
              <ArrowRight className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("Rejected")}
              disabled={isUpdating}
              className="rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
              title="Reject Application"
            >
              <XCircle className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {normalizedStatus === "Under Review" && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleStatusChange("Shortlisted")}
              disabled={isUpdating}
              className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-indigo-600 px-2 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              <span>Shortlist</span>
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("Interview")}
              disabled={isUpdating}
              className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-cyan-600 px-2 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-cyan-700 disabled:opacity-50"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Interview</span>
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("Rejected")}
              disabled={isUpdating}
              className="rounded-xl border border-rose-200 bg-rose-50 p-1.5 text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
              title="Reject"
            >
              <XCircle className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {normalizedStatus === "Shortlisted" && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleStatusChange("Interview")}
              disabled={isUpdating}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cyan-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-cyan-700 disabled:opacity-50"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Schedule Interview</span>
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("Rejected")}
              disabled={isUpdating}
              className="rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
              title="Reject"
            >
              <XCircle className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {normalizedStatus === "Interview" && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleStatusChange("Hired")}
              disabled={isUpdating}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Hire Candidate</span>
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("Rejected")}
              disabled={isUpdating}
              className="rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
              title="Reject"
            >
              <XCircle className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {normalizedStatus === "Hired" && (
          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200/60">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Hired Candidate</span>
          </div>
        )}

        {normalizedStatus === "Rejected" && (
          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-1.5 text-xs font-medium text-slate-500 border border-slate-200/60">
            <XCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>Application Rejected</span>
          </div>
        )}
      </div>
    </div>
  );
}
