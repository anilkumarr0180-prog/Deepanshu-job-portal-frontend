import type { BackendCandidateApplication } from "../api/applications.api";
import ApplicationRow from "../components/ApplicationRow";

interface AppliedJobsTableProps {
  applications: BackendCandidateApplication[];
  onWithdraw: (applicationId: string) => void;
  withdrawingId: string | null;
  onOpenDetails?: (application: BackendCandidateApplication) => void;
}

export default function AppliedJobsTable({
  applications,
  onWithdraw,
  withdrawingId,
  onOpenDetails,
}: AppliedJobsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
        <thead className="bg-slate-50 dark:bg-slate-900/80">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
              Job
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400 hidden sm:table-cell">
              Type
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400 hidden sm:table-cell">
              Salary
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
              Status
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
              Applied
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/40">
          {applications.map((application) => (
            <ApplicationRow
              key={application._id}
              application={application}
              onWithdraw={onWithdraw}
              isWithdrawing={withdrawingId === application._id}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
