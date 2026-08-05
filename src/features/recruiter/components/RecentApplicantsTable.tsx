import { Link } from "react-router-dom";
import { ChevronRight, Eye, UserCheck } from "lucide-react";
import type { RecruiterApplicant } from "../types";

interface RecentApplicantsTableProps {
  applicants: RecruiterApplicant[];
  isLoading?: boolean;
}

const statusColorMap: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  reviewed: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  accepted: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  interviewed: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
};

export default function RecentApplicantsTable({
  applicants,
  isLoading,
}: RecentApplicantsTableProps) {
  return (
    <section className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h3 className="text-lg font-bold text-[#05264E]">Recent Applicants</h3>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Latest candidate submissions for your open positions
            </p>
          </div>
          <Link
            to="/recruiter/applicants"
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
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 rounded bg-slate-200" />
                    <div className="h-3 w-20 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="h-6 w-16 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        ) : applicants.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <UserCheck className="h-7 w-7" />
            </div>
            <h4 className="mt-3 font-bold text-[#05264E]">No applications yet</h4>
            <p className="mt-1 max-w-xs text-xs font-medium text-slate-400">
              Applications submitted by job seekers will appear here automatically.
            </p>
            <Link
              to="/recruiter/applicants"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-purple-700"
            >
              <span>View All Applicants</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3">Candidate</th>
                  <th className="px-6 py-3">Applied Position</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Applied</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicants.map((applicant) => {
                  const statusInfo =
                    statusColorMap[applicant.status.toLowerCase()] ?? statusColorMap.pending;

                  const initial = applicant.candidate?.charAt(0)?.toUpperCase() ?? "C";

                  return (
                    <tr
                      key={applicant.id}
                      className="group transition-colors duration-150 hover:bg-[#F8FAFC]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3C65F5]/10 text-xs font-extrabold text-[#3C65F5]">
                            {initial}
                          </div>
                          <span className="font-bold text-[#05264E]">
                            {applicant.candidate}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-600">
                        {applicant.job}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                          {applicant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-400">
                        {applicant.appliedDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/recruiter/applicants/${applicant.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-[#3C65F5] hover:bg-[#3C65F5] hover:text-white"
                          title="View Profile"
                        >
                          <Eye className="h-3.5 w-3.5" />
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
