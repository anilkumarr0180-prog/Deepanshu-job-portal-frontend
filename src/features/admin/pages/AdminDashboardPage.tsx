import useAuth from "@/features/auth/hooks/useAuth";
import { formatDashboardDate, getGreetingByTime } from "@/shared/utils/dashboardUtils";

import AdminQuickActions from "../components/AdminQuickActions";
import AdminStats from "../components/AdminStats";
import AdminWelcome from "../components/AdminWelcome";
import { adminStats, jobs, quickActions, recruiters, users } from "../constants";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const displayName = user?.name ?? "User";

  return (
    <div className="space-y-6">
      <AdminWelcome
        name={displayName}
        greeting={getGreetingByTime()}
        currentDate={formatDashboardDate()}
        description="Monitor growth, review moderation tasks, and keep the platform healthy from a single view."
      />

      <AdminStats stats={adminStats} />

      <AdminQuickActions actions={quickActions} />

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Recent users</h3>
              <p className="mt-1 text-sm text-slate-500">Latest account activity and statuses</p>
            </div>
          </div>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {users.slice(0, 3).map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{user.role}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">System status</h3>
          <p className="mt-1 text-sm text-slate-500">Platform health overview</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Authentication</p>
              <p className="mt-1 text-sm text-emerald-600">Operational</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Email delivery</p>
              <p className="mt-1 text-sm text-emerald-600">Healthy</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Moderation queue</p>
              <p className="mt-1 text-sm text-amber-600">3 pending review</p>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Recent recruiters</h3>
          <div className="mt-5 space-y-3">
            {recruiters.slice(0, 3).map((recruiter) => (
              <div key={recruiter.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{recruiter.company}</p>
                    <p className="mt-1 text-sm text-slate-500">{recruiter.contactName}</p>
                  </div>
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {recruiter.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Recent jobs</h3>
          <div className="mt-5 space-y-3">
            {jobs.slice(0, 3).map((job) => (
              <div key={job.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{job.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{job.company}</p>
                  </div>
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
