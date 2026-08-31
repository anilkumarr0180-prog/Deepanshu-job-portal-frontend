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
    badgeBg: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/60",
    badgeText: "text-blue-700 dark:text-blue-300",
    dotColor: "bg-blue-500",
    icon: Inbox,
  },
  {
    id: "under-review",
    title: "Under Review",
    statusKey: "Under Review",
    badgeBg: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60",
    badgeText: "text-amber-700 dark:text-amber-300",
    dotColor: "bg-amber-500",
    icon: Eye,
  },
  {
    id: "shortlisted",
    title: "Shortlisted",
    statusKey: "Shortlisted",
    badgeBg: "bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800/60",
    badgeText: "text-purple-700 dark:text-purple-300",
    dotColor: "bg-purple-500",
    icon: Star,
  },
  {
    id: "interview",
    title: "Interview",
    statusKey: "Interview",
    badgeBg: "bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800/60",
    badgeText: "text-cyan-700 dark:text-cyan-300",
    dotColor: "bg-cyan-500",
    icon: Calendar,
  },
  {
    id: "hired",
    title: "Hired",
    statusKey: "Hired",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    dotColor: "bg-emerald-500",
    icon: CheckCircle2,
  },
  {
    id: "rejected",
    title: "Rejected",
    statusKey: "Rejected",
    badgeBg: "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/60",
    badgeText: "text-rose-700 dark:text-rose-300",
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
      className={`flex h-full min-w-[230px] sm:min-w-[245px] md:min-w-[255px] 2xl:flex-1 flex-col rounded-2xl border p-3 shadow-xs transition-all duration-200 ${
        isDragOver
          ? "border-[#3C65F5] dark:border-[#5E81FF] bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-[#3C65F5]/30 shadow-md"
          : "border-slate-200/80 dark:border-[#2A3850] bg-slate-50/70 dark:bg-[#151F32]/80"
      }`}
    >
      {/* Column Header */}
      <div className="mb-3 flex items-center justify-between border-b border-slate-200/70 dark:border-[#2A3850] pb-2.5">
        <div className="flex items-center gap-2">
          <span className={`flex h-7 w-7 items-center justify-center rounded-lg border ${column.badgeBg} ${column.badgeText} shrink-0`}>
            <Icon className="h-3.5 w-3.5" />
          </span>
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate">{column.title}</h3>
        </div>

        <span className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold border ${column.badgeBg} ${column.badgeText}`}>
          {applicants.length}
        </span>
      </div>

      {/* Cards Scrollable Container */}
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto pr-0.5">
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
          <div className={`flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed py-7 px-3 text-center transition-colors ${
            isDragOver
              ? "border-[#3C65F5] dark:border-[#5E81FF] bg-indigo-50/50 dark:bg-indigo-950/30"
              : "border-slate-200/90 dark:border-[#2A3850] bg-white/60 dark:bg-[#1B2639]/40"
          }`}>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100/90 dark:bg-[#151F32] text-slate-400 dark:text-slate-500 mb-1.5">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
              {isDragOver ? `Drop here` : `No candidates`}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
              {isDragOver ? `Release to move to ${column.title}` : `Drag to ${column.title}`}
            </p>
          </div>
        )}

        {/* Drop Zone Placeholder when dragging over an occupied column */}
        {isDragOver && applicants.length > 0 && (
          <div className="rounded-xl border-2 border-dashed border-[#3C65F5] dark:border-[#5E81FF] bg-indigo-50/50 dark:bg-indigo-950/40 p-3 text-center text-xs font-bold text-[#3C65F5] dark:text-[#5E81FF] animate-pulse">
            Drop candidate here
          </div>
        )}
      </div>
    </div>
  );
}
