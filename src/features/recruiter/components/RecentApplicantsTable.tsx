import type { RecruiterApplicant } from "../types";

interface RecentApplicantsTableProps {
  applicants: RecruiterApplicant[];
}

const statusColorMap: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-600" },
  reviewed: { bg: "bg-blue-50", text: "text-blue-600" },
  accepted: { bg: "bg-emerald-50", text: "text-emerald-600" },
  rejected: { bg: "bg-red-50", text: "text-red-600" },
  interviewed: { bg: "bg-purple-50", text: "text-purple-600" },
};

export default function RecentApplicantsTable({ applicants }: RecentApplicantsTableProps) {
  return (
    <section className="rounded-xl border border-[#E0E6F7] bg-white shadow-sm overflow-hidden">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold text-[#05264E]">Recent applicants</h3>
        <p className="mt-1 text-sm text-slate-500">Latest candidates engaging with your roles</p>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E0E6F7] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 pb-3 font-semibold">Candidate</th>
              <th className="px-6 pb-3 font-semibold">Job</th>
              <th className="px-6 pb-3 font-semibold">Status</th>
              <th className="px-6 pb-3 font-semibold">Applied Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E6F7]">
            {applicants.map((applicant) => {
              const statusColors = statusColorMap[applicant.status.toLowerCase()] ?? statusColorMap.pending;

              return (
                <tr key={applicant.id} className="text-slate-700 transition-colors duration-200 hover:bg-[#F8FAFC]">
                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-[#05264E]">{applicant.candidate}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">{applicant.job}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors.bg} ${statusColors.text}`}>
                      {applicant.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">{applicant.appliedDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
