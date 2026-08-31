import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import type { RecruiterApplicantRecord } from "../../types";
import {
  ScheduleInterviewModal,
  type ScheduleInterviewDetails,
} from "./ScheduleInterviewModal";
import ApplicantsKanbanColumn, {
  KANBAN_COLUMNS,
} from "./ApplicantsKanbanColumn";

interface ApplicantsKanbanBoardProps {
  applicants: RecruiterApplicantRecord[];
  statusFilter?: string;
  onView?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string, interviewDetails?: any) => void;
  isUpdating?: boolean;
}

export default function ApplicantsKanbanBoard({
  applicants,
  statusFilter = "All",
  onView,
  onUpdateStatus,
  isUpdating = false,
}: ApplicantsKanbanBoardProps) {
  const [activeInterviewApplicant, setActiveInterviewApplicant] =
    useState<RecruiterApplicantRecord | null>(null);

  const [draggedApplicant, setDraggedApplicant] =
    useState<RecruiterApplicantRecord | null>(null);

  const [pendingMoveIds, setPendingMoveIds] = useState<Set<string>>(new Set());

  const handleOpenScheduleModal = (applicant: RecruiterApplicantRecord) => {
    setActiveInterviewApplicant(applicant);
  };

  const handleCloseScheduleModal = () => {
    setActiveInterviewApplicant(null);
  };

  const handleScheduleSubmit = (details: ScheduleInterviewDetails) => {
    if (!activeInterviewApplicant || !onUpdateStatus) return;
    onUpdateStatus(activeInterviewApplicant.id, "Interview", details);
    setActiveInterviewApplicant(null);
  };

  const handleDropOnColumn = useCallback(
    (targetStatus: string, rawData: string) => {
      if (!onUpdateStatus) return;

      let droppedId = "";
      let sourceStatus = "";

      try {
        if (rawData) {
          const parsed = JSON.parse(rawData);
          droppedId = parsed.id;
          sourceStatus = parsed.status;
        }
      } catch {
        // Fallback to state if parsing failed
        droppedId = draggedApplicant?.id || "";
        sourceStatus = draggedApplicant?.status || "";
      }

      if (!droppedId) return;

      // 1. If dropping in the same column, ignore
      if (sourceStatus === targetStatus) {
        setDraggedApplicant(null);
        return;
      }

      // 2. Prevent duplicate rapid moves for the same candidate while an update is in-flight
      if (pendingMoveIds.has(droppedId) || isUpdating) {
        toast.error("An update is already in progress for this candidate.");
        setDraggedApplicant(null);
        return;
      }

      const matchingApplicant =
        applicants.find((a) => a.id === droppedId) || draggedApplicant;

      // 3. If dragging to "Interview", prompt the interview schedule modal to gather details
      if (targetStatus === "Interview") {
        if (matchingApplicant) {
          setActiveInterviewApplicant(matchingApplicant);
        } else {
          setActiveInterviewApplicant({
            id: droppedId,
            candidate: "Candidate",
            job: "Job Application",
            experience: "",
            skills: [],
            appliedDate: "",
            status: sourceStatus as any,
          });
        }
        setDraggedApplicant(null);
        return;
      }

      // 4. Track in-flight move id and execute optimistic status transition
      setPendingMoveIds((prev) => new Set(prev).add(droppedId));
      onUpdateStatus(droppedId, targetStatus);

      setTimeout(() => {
        setPendingMoveIds((prev) => {
          const next = new Set(prev);
          next.delete(droppedId);
          return next;
        });
      }, 600);

      setDraggedApplicant(null);
    },
    [applicants, draggedApplicant, isUpdating, onUpdateStatus, pendingMoveIds]
  );

  const columnsToRender =
    statusFilter && statusFilter !== "All"
      ? KANBAN_COLUMNS.filter((c) => c.statusKey === statusFilter)
      : KANBAN_COLUMNS;

  return (
    <>
      <div
        className={
          columnsToRender.length === 1
            ? "mx-auto w-full max-w-2xl py-1"
            : "flex w-full gap-3 overflow-x-auto pb-4 pt-1"
        }
      >
        {columnsToRender.map((column) => {
          const columnApplicants = applicants.filter(
            (app) => app.status === column.statusKey
          );

          return (
            <ApplicantsKanbanColumn
              key={column.id}
              column={column}
              applicants={columnApplicants}
              onView={onView}
              onUpdateStatus={onUpdateStatus}
              onOpenScheduleModal={handleOpenScheduleModal}
              onDropOnColumn={handleDropOnColumn}
              draggedApplicant={draggedApplicant}
              setDraggedApplicant={setDraggedApplicant}
              isUpdating={isUpdating}
            />
          );
        })}
      </div>

      {activeInterviewApplicant && (
        <ScheduleInterviewModal
          isOpen={Boolean(activeInterviewApplicant)}
          onClose={handleCloseScheduleModal}
          applicationId={activeInterviewApplicant.id}
          candidateName={activeInterviewApplicant.candidate}
          jobTitle={activeInterviewApplicant.job}
          onSchedule={handleScheduleSubmit}
          isSubmitting={isUpdating}
        />
      )}
    </>
  );
}
