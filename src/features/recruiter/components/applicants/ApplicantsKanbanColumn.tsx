import { useState, type DragEvent } from "react";
import { Inbox, Eye, Star, Calendar, CheckCircle2, XCircle } from "lucide-react";
import type { RecruiterApplicantRecord } from "../../types";
import ApplicantsKanbanCard from "./ApplicantsKanbanCard";

export interface KanbanColumnConfig {
  id: string;
  title: string;
  statusKey: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
  icon: typeof Inbox;
}

export const KANBAN_COLUMNS: KanbanColumnConfig[] = [
  {
    id: "applied",
    title: "Applied",
    statusKey: "Applied",
    badgeBg: "bg-blue-50 border-blue-200",
    badgeText: "text-blue-700",
    dotColor: "bg-blue-500",
    icon: Inbox,
  },
  {
    id: "under-review",
    title: "Under Review",
    statusKey: "Under Review",
    badgeBg: "bg-amber-50 border-amber-200",
    badgeText: "text-amber-700",
    dotColor: "bg-amber-500",
    icon: Eye,
  },
  {
    id: "shortlisted",
    title: "Shortlisted",
    statusKey: "Shortlisted",
    badgeBg: "bg-purple-50 border-purple-200",
    badgeText: "text-purple-700",
    dotColor: "bg-purple-500",
    icon: Star,
  },
  {
    id: "interview",
    title: "Interview",
    statusKey: "Interview",
    badgeBg: "bg-cyan-50 border-cyan-200",
    badgeText: "text-cyan-700",
    dotColor: "bg-cyan-500",
    icon: Calendar,
  },
  {
    id: "hired",
    title: "Hired",
    statusKey: "Hired",
    badgeBg: "bg-emerald-50 border-emerald-200",
    badgeText: "text-emerald-700",
    dotColor: "bg-emerald-500",
    icon: CheckCircle2,
  },
  {
    id: "rejected",
    title: "Rejected",
    statusKey: "Rejected",
    badgeBg: "bg-rose-50 border-rose-200",
    badgeText: "text-rose-700",
    dotColor: "bg-rose-500",
    icon: XCircle,
  },
];

interface ApplicantsKanbanColumnProps {
  column: KanbanColumnConfig;
  applicants: RecruiterApplicantRecord[];
  onView?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string, interviewDetails?: any) => void;
  onOpenScheduleModal?: (applicant: RecruiterApplicantRecord) => void;
  onDropOnColumn?: (targetStatus: string, rawData: string) => void;
  draggedApplicant: RecruiterApplicantRecord | null;
  setDraggedApplicant: (app: RecruiterApplicantRecord | null) => void;
  isUpdating?: boolean;
}

export default function ApplicantsKanbanColumn({
  column,
  applicants,
  onView,
  onUpdateStatus,
  onOpenScheduleModal,
  onDropOnColumn,
  draggedApplicant,
  setDraggedApplicant,
  isUpdating,
}: ApplicantsKanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const Icon = column.icon;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    // Only deactivate if leaving column container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const rawData = e.dataTransfer.getData("text/plain");
    if (onDropOnColumn) {
      onDropOnColumn(column.statusKey, rawData);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex h-full min-w-[280px] max-w-[320px] flex-1 flex-col rounded-2xl border p-3.5 shadow-sm transition-all duration-200 ${
        isDragOver
          ? "border-[#3C65F5] bg-indigo-50/60 ring-2 ring-[#3C65F5]/30 shadow-md"
          : "border-slate-200/80 bg-slate-50/60"
      }`}
    >
      {/* Column Header */}
      <div className="mb-3.5 flex items-center justify-between border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-2">
          <span className={`flex h-7 w-7 items-center justify-center rounded-lg border ${column.badgeBg} ${column.badgeText}`}>
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-bold text-slate-800">{column.title}</h3>
        </div>

        <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${column.badgeBg} ${column.badgeText}`}>
          {applicants.length}
        </span>
      </div>

      {/* Cards Scrollable Container */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {applicants.length > 0 ? (
          applicants.map((applicant) => (
            <ApplicantsKanbanCard
              key={applicant.id}
              applicant={applicant}
              onView={onView}
              onUpdateStatus={onUpdateStatus}
              onOpenScheduleModal={onOpenScheduleModal}
              onDragStartCard={setDraggedApplicant}
              onDragEndCard={() => setDraggedApplicant(null)}
              isDragging={draggedApplicant?.id === applicant.id}
              isUpdating={isUpdating}
            />
          ))
        ) : (
          <div className={`flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-colors ${
            isDragOver ? "border-[#3C65F5] bg-white/80" : "border-slate-200 bg-white/50"
          }`}>
            <p className="text-xs font-medium text-slate-400">
              {isDragOver ? `Drop candidate into ${column.title}` : `No applicants in ${column.title}`}
            </p>
          </div>
        )}

        {/* Drop Zone Placeholder when dragging over an occupied column */}
        {isDragOver && applicants.length > 0 && (
          <div className="rounded-xl border-2 border-dashed border-[#3C65F5] bg-indigo-50/50 p-4 text-center text-xs font-semibold text-[#3C65F5] animate-pulse">
            Drop candidate here
          </div>
        )}
      </div>
    </div>
  );
}
