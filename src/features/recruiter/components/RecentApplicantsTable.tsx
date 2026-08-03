import type { RecruiterApplicant } from "../types";

interface RecentApplicantsTableProps {
  applicants: RecruiterApplicant[];
}

export default function RecentApplicantsTable({ applicants }: RecentApplicantsTableProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent applicants</h3>
          <p className="mt-1 text-sm text-slate-500">Latest candidates engaging with your roles</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="pb-3 font-medium">Candidate</th>
              <th className="pb-3 font-medium">Job</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Applied Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applicants.map((applicant) => (
              <tr key={applicant.id} className="text-slate-700">
                <td className="py-3 font-medium text-slate-900">{applicant.candidate}</td>
                <td className="py-3">{applicant.job}</td>
                <td className="py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {applicant.status}
                  </span>
                </td>
                <td className="py-3">{applicant.appliedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
