import { Eye, CalendarDays, BadgeCheck, XCircle } from "lucide-react";

import type { RecruiterApplicantRecord } from "../../types";

interface ApplicantsTableProps {
  applicants: RecruiterApplicantRecord[];
}

export default function ApplicantsTable({ applicants }: ApplicantsTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Applied Job</th>
              <th className="px-4 py-3 font-medium">Experience</th>
              <th className="px-4 py-3 font-medium">Skills</th>
              <th className="px-4 py-3 font-medium">Applied Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {applicants.map((applicant) => (
              <tr key={applicant.id} className="bg-white">
                <td className="px-4 py-3 font-medium text-slate-900">{applicant.candidate}</td>
                <td className="px-4 py-3">{applicant.job}</td>
                <td className="px-4 py-3">{applicant.experience}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">{applicant.appliedDate}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {applicant.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">
                      <CalendarDays className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">
                      <BadgeCheck className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">
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
