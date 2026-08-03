import type { RecruiterJob } from "../types";

interface RecentJobsTableProps {
  jobs: RecruiterJob[];
}

export default function RecentJobsTable({ jobs }: RecentJobsTableProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent jobs</h3>
          <p className="mt-1 text-sm text-slate-500">A quick look at your latest job postings</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="pb-3 font-medium">Job Title</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Applicants</th>
              <th className="pb-3 font-medium">Posted Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job.id} className="text-slate-700">
                <td className="py-3 font-medium text-slate-900">{job.title}</td>
                <td className="py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {job.status}
                  </span>
                </td>
                <td className="py-3">{job.applicants}</td>
                <td className="py-3">{job.postedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
