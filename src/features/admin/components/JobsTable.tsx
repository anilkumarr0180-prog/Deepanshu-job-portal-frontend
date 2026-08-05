import { Eye, Trash2 } from "lucide-react";

import StatusBadge from "./StatusBadge";
import type { AdminJob } from "../types";

interface JobsTableProps {
  jobs: AdminJob[];
  onDelete: (job: AdminJob) => void;
  canDelete?: boolean;
}

export default function JobsTable({ jobs, onDelete, canDelete = true }: JobsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Job</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Company</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Recruiter</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Applicants</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {jobs.map((job) => (
            <tr key={job.id} className="transition hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{job.title}</div>
                <div className="mt-1 text-xs text-slate-500">Posted {job.postedAt}</div>
              </td>
              <td className="px-4 py-3 text-slate-600">{job.company}</td>
              <td className="px-4 py-3 text-slate-600">{job.recruiter}</td>
              <td className="px-4 py-3 text-slate-600">{job.applicants}</td>
              <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50" aria-label={`View ${job.title}`}>
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => canDelete && onDelete(job)}
                    disabled={!canDelete}
                    className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Delete ${job.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
