import { Eye, ShieldOff, Trash2 } from "lucide-react";

import StatusBadge from "./StatusBadge";
import type { AdminRecruiter } from "../types";

interface RecruitersTableProps {
  recruiters: AdminRecruiter[];
  onDelete: (recruiter: AdminRecruiter) => void;
  onSuspend: (recruiter: AdminRecruiter) => void;
}

export default function RecruitersTable({ recruiters, onDelete, onSuspend }: RecruitersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Company</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Contact</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Jobs</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {recruiters.map((recruiter) => (
            <tr key={recruiter.id} className="transition hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{recruiter.company}</div>
                <div className="mt-1 text-xs text-slate-500">{recruiter.email}</div>
              </td>
              <td className="px-4 py-3 text-slate-600">{recruiter.contactName}</td>
              <td className="px-4 py-3"><StatusBadge status={recruiter.status} /></td>
              <td className="px-4 py-3 text-slate-600">{recruiter.jobsPosted}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50" aria-label={`View ${recruiter.company}`}>
                    <Eye className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => onSuspend(recruiter)} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50" aria-label={`Suspend ${recruiter.company}`}>
                    <ShieldOff className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => onDelete(recruiter)} className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50" aria-label={`Delete ${recruiter.company}`}>
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
