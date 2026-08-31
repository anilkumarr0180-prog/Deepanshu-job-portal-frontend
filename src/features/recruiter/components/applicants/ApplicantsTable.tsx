import { Eye, CalendarDays, BadgeCheck, XCircle } from "lucide-react";

import type { RecruiterApplicantRecord } from "../../types";

interface ApplicantsTableProps {
  applicants: RecruiterApplicantRecord[];
  onView?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string) => void;
  isUpdating?: boolean;
}

export default function ApplicantsTable({
  applicants,
  onView,
  onUpdateStatus,
  isUpdating,
}: ApplicantsTableProps) {
  const handleStatusUpdate = (
    id: string,
    status: string
  ) => {
    if (isUpdating || !onUpdateStatus) return;
    onUpdateStatus(id, status);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-[#2A3850] bg-white dark:bg-[#151F32] shadow-xs">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-[#2A3850] text-sm">
          <thead className="bg-slate-50 dark:bg-[#1B2639] text-left text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Candidate</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Applied Job</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Experience</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Skills</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Applied Date</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#2A3850]/70 text-slate-700 dark:text-slate-200">
            {applicants.map((applicant) => (
              <tr key={applicant.id} className="bg-white dark:bg-[#151F32] hover:bg-slate-50/80 dark:hover:bg-[#1B2639]/60 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{applicant.candidate}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{applicant.job}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{applicant.experience}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {applicant.skills.map((skill) => (
                      <span key={skill} className="rounded-md bg-slate-100 dark:bg-[#1B2639] border border-slate-200/50 dark:border-[#2A3850] px-2 py-0.5 text-xs text-slate-700 dark:text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{applicant.appliedDate}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 dark:bg-[#1B2639] border border-slate-200/60 dark:border-[#2A3850] px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {applicant.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => onView?.(applicant.id)}
                      className="rounded-lg border border-slate-200 dark:border-[#2A3850] p-1.5 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-[#1B2639] cursor-pointer"
                      title="View Profile"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(applicant.id, "Interview")}
                      disabled={isUpdating}
                      className="rounded-lg border border-cyan-200 dark:border-cyan-900/50 p-1.5 text-cyan-600 dark:text-cyan-400 transition hover:bg-cyan-50 dark:hover:bg-cyan-950/40 disabled:opacity-50 cursor-pointer"
                      title="Interview"
                    >
                      <CalendarDays className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(applicant.id, "Shortlisted")}
                      disabled={isUpdating}
                      className="rounded-lg border border-purple-200 dark:border-purple-900/50 p-1.5 text-purple-600 dark:text-purple-400 transition hover:bg-purple-50 dark:hover:bg-purple-950/40 disabled:opacity-50 cursor-pointer"
                      title="Shortlist"
                    >
                      <BadgeCheck className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(applicant.id, "Rejected")}
                      disabled={isUpdating}
                      className="rounded-lg border border-rose-200 dark:border-rose-900/50 p-1.5 text-rose-600 dark:text-rose-400 transition hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-50 cursor-pointer"
                      title="Reject"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
