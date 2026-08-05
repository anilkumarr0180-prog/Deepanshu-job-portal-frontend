import { Link } from "react-router-dom";
import { Briefcase, ChevronRight, Edit3, Plus } from "lucide-react";
import type { RecruiterJob } from "../types";

interface RecentJobsTableProps {
  jobs: RecruiterJob[];
  isLoading?: boolean;
}

const statusColorMap: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  closed: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  draft: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  published: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
};

export default function RecentJobsTable({ jobs, isLoading }: RecentJobsTableProps) {
  return (
    <section className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h3 className="text-lg font-bold text-[#05264E]">Recent Jobs</h3>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Your latest active &amp; draft job postings
            </p>
          </div>
          <Link
            to="/recruiter/jobs"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#3C65F5] hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex animate-pulse items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-36 rounded bg-slate-200" />
                  <div className="h-3 w-20 rounded bg-slate-100" />
                </div>
                <div className="h-6 w-16 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5]">
              <Briefcase className="h-7 w-7" />
            </div>
            <h4 className="mt-3 font-bold text-[#05264E]">No job postings yet</h4>
            <p className="mt-1 max-w-xs text-xs font-medium text-slate-400">
              Start hiring by creating your first job opening.
            </p>
            <Link
              to="/recruiter/jobs/create"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#2956F2]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Post New Job</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3">Job Title</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Applicants</th>
                  <th className="px-6 py-3">Posted</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => {
                  const statusInfo =
                    statusColorMap[job.status.toLowerCase()] ?? statusColorMap.draft;

                  return (
                    <tr
                      key={job.id}
                      className="group transition-colors duration-150 hover:bg-[#F8FAFC]"
                    >
                      <td className="px-6 py-4 font-bold text-[#05264E]">
                        <Link
                          to={`/recruiter/jobs/${job.id}`}
                          className="hover:text-[#3C65F5] hover:underline"
                        >
                          {job.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-600">
                        {job.applicants}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-400">
                        {job.postedDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/recruiter/jobs/${job.id}/edit`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-[#3C65F5] hover:bg-[#3C65F5] hover:text-white"
                          title="Edit Job"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
