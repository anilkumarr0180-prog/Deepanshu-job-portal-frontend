import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import type { BackendCandidateApplication } from "../api/applications.api";
import { formatRelativeDate } from "../utils/jobMapper";

interface ApplicationRowProps {
  application: BackendCandidateApplication;
  onWithdraw: (applicationId: string) => void;
  isWithdrawing: boolean;
  onOpenDetails?: (application: BackendCandidateApplication) => void;
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  Applied: { bg: "bg-amber-50", text: "text-amber-700" },
  "Under Review": { bg: "bg-blue-50", text: "text-blue-700" },
  Shortlisted: { bg: "bg-emerald-50", text: "text-emerald-700" },
  Interview: { bg: "bg-purple-50 border border-purple-200", text: "text-purple-700" },
  Rejected: { bg: "bg-rose-50", text: "text-rose-700" },
  Hired: { bg: "bg-emerald-50", text: "text-emerald-700" },
};

export default function ApplicationRow({
  application,
  onWithdraw,
  isWithdrawing,
  onOpenDetails,
}: ApplicationRowProps) {
  const job = application.jobId || {
    _id: "",
    title: "Position Unavailable",
    company: "N/A",
    employmentType: "N/A",
    salaryMin: 0,
    salaryMax: 0,
  };
  const statusStyle =
    statusStyles[application.status] ?? {
      bg: "bg-slate-100",
      text: "text-slate-700",
    };

  return (
    <tr className="border-b border-slate-200 transition hover:bg-slate-50">
      <td className="px-4 py-4">
        <div>
          <div className="font-medium text-slate-900">
            {job.title}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            {job.company}
          </div>
        </div>
      </td>

      <td className="px-4 py-4 text-sm text-slate-600 hidden sm:table-cell">
        {job.employmentType}
      </td>

      <td className="px-4 py-4 text-sm text-slate-600 hidden sm:table-cell">
        ${(job.salaryMin ?? 0).toLocaleString()} - ${(job.salaryMax ?? 0).toLocaleString()}
      </td>

      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
        >
          {application.status}
        </span>
      </td>

      <td className="px-4 py-4 text-sm text-slate-600">
        {formatRelativeDate(application.createdAt)}
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          {application.status === "Interview" && (
            <button
              type="button"
              onClick={() => onOpenDetails?.(application)}
              className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 hover:bg-purple-100 border border-purple-200 transition shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              Interview Details
            </button>
          )}

          <Link
            to={`/candidate/messages?jobId=${job._id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#3C65F5] hover:bg-blue-100 transition"
          >
            Chat
          </Link>
          <button
            type="button"
            onClick={() => onOpenDetails?.(application)}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onWithdraw(application._id)}
            disabled={isWithdrawing}
            className="text-xs font-medium text-rose-600 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isWithdrawing ? "Withdrawing..." : "Withdraw"}
          </button>
        </div>
      </td>
    </tr>
  );
}
