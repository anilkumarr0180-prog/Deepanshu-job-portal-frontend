import type { BackendCandidateApplication } from "../api/applications.api";
import ApplicationRow from "../components/ApplicationRow";

interface AppliedJobsTableProps {
  applications: BackendCandidateApplication[];
  onWithdraw: (applicationId: string) => void;
  withdrawingId: string | null;
}

export default function AppliedJobsTable({
  applications,
  onWithdraw,
  withdrawingId,
}: AppliedJobsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Job
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 hidden sm:table-cell">
              Type
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 hidden sm:table-cell">
              Salary
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Status
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Applied
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {applications.map((application) => (
            <ApplicationRow
              key={application._id}
              application={application}
              onWithdraw={onWithdraw}
              isWithdrawing={withdrawingId === application._id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
