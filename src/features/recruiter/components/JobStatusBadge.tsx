import type { RecruiterJobStatus } from "../types";

interface JobStatusBadgeProps {
  status: RecruiterJobStatus;
}

const statusStyles: Record<RecruiterJobStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Draft: "bg-amber-100 text-amber-700",
  Closed: "bg-slate-100 text-slate-700",
};

export default function JobStatusBadge({ status }: JobStatusBadgeProps) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
