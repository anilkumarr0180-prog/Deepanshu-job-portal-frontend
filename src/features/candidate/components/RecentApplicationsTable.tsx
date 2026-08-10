import { Link } from "react-router-dom";
import type { CandidateApplication } from "../types";

interface RecentApplicationsTableProps {
  applications: CandidateApplication[];
}

const statusColorMap: Record<string, { bg: string; text: string; label: string }> = {
  Applied: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "Pending Review" },
  Pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "Pending Review" },
  Shortlisted: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", label: "Shortlisted" },
  Interview: { bg: "bg-purple-50 border-purple-200", text: "text-purple-700", label: "Interview Scheduled" },
  Rejected: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", label: "Not Selected" },
  Hired: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", label: "Hired 🎉" },
};

export default function RecentApplicationsTable({
  applications,
}: RecentApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Applications
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Track where your job applications stand in real time
            </p>
          </div>

          <Link
            to="/candidate/jobs"
            className="text-xs font-semibold text-[#3C65F5] hover:underline"
          >
            Browse Jobs
          </Link>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-500">
            You haven&apos;t applied to any jobs yet. Start exploring active job postings!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Recent Applications
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Track where your job applications stand in real time
          </p>
        </div>

        <Link
          to="/candidate/applied"
          className="text-xs font-bold text-[#3C65F5] hover:underline"
        >
          View All Applications &rarr;
        </Link>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Role & Location
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Company
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Application Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Applied Date
              </th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {applications.map((application) => {
              const statusColors =
                statusColorMap[application.status] ?? {
                  bg: "bg-slate-100 border-slate-200",
                  text: "text-slate-700",
                  label: application.status,
                };

              return (
                <tr
                  key={application.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">
                      {application.role}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {application.location}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {application.company}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusColors.bg} ${statusColors.text}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {statusColors.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {application.appliedAt}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={application.jobId ? `/candidate/jobs/${application.jobId}` : "/candidate/applied"}
                      className="inline-flex items-center text-xs font-bold text-[#3C65F5] hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
