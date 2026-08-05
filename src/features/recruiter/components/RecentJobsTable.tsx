import type { RecruiterJob } from "../types";

interface RecentJobsTableProps {
  jobs: RecruiterJob[];
}

const statusColorMap: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-600" },
  closed: { bg: "bg-slate-100", text: "text-slate-600" },
  draft: { bg: "bg-amber-50", text: "text-amber-600" },
  published: { bg: "bg-blue-50", text: "text-blue-600" },
};

export default function RecentJobsTable({ jobs }: RecentJobsTableProps) {
  return (
    <section className="rounded-xl border border-[#E0E6F7] bg-white shadow-sm overflow-hidden">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold text-[#05264E]">Recent jobs</h3>
        <p className="mt-1 text-sm text-slate-500">A quick look at your latest job postings</p>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E0E6F7] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 pb-3 font-semibold">Job Title</th>
              <th className="px-6 pb-3 font-semibold">Status</th>
              <th className="px-6 pb-3 font-semibold">Applicants</th>
              <th className="px-6 pb-3 font-semibold">Posted Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E6F7]">
            {jobs.map((job) => {
              const statusColors = statusColorMap[job.status.toLowerCase()] ?? statusColorMap.draft;

              return (
                <tr key={job.id} className="text-slate-700 transition-colors duration-200 hover:bg-[#F8FAFC]">
                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-[#05264E]">{job.title}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors.bg} ${statusColors.text}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">{job.applicants}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">{job.postedDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
