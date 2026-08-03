import type { CandidateApplication } from "../types";

interface RecentApplicationsTableProps {
  applications: CandidateApplication[];
}

export default function RecentApplicationsTable({ applications }: RecentApplicationsTableProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent applications</h3>
          <p className="mt-1 text-sm text-slate-500">Track where your applications stand</p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Role</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Company</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {applications.map((application) => (
              <tr key={application.id} className="transition hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{application.role}</div>
                  <div className="mt-1 text-xs text-slate-500">{application.location}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">{application.company}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {application.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{application.appliedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
