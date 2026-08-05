import { useMemo, useEffect } from "react";
import { Users, Building2, BriefcaseBusiness } from "lucide-react";
import toast from "react-hot-toast";

import useAuth from "@/features/auth/hooks/useAuth";
import { formatDashboardDate, getGreetingByTime } from "@/shared/utils/dashboardUtils";

import AdminQuickActions from "../components/AdminQuickActions";
import AdminStats from "../components/AdminStats";
import AdminWelcome from "../components/AdminWelcome";
import EmptyState from "../components/EmptyState";

import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { quickActions } from "../constants";
import type { AdminStat, AdminUser, AdminJob } from "../types";

function mapUser(u: {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}): AdminUser {
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: "Active",
    joinedAt: new Date(u.createdAt).toLocaleDateString(),
  };
}

function mapJob(j: {
  _id: string;
  title: string;
  company: string;
  status: string;
  createdAt: string;
  recruiterId: { name: string; email: string } | null;
}): AdminJob {
  const normalizedStatus =
    j.status.toUpperCase() === "ACTIVE"
      ? "Published"
      : j.status.toUpperCase() === "DRAFT"
        ? "Draft"
        : j.status.toUpperCase() === "CLOSED"
          ? "Archived"
          : "Draft";

  return {
    id: j._id,
    title: j.title,
    company: j.company,
    recruiter: j.recruiterId?.name ?? "--",
    applicants: "--",
    status: normalizedStatus,
    postedAt: new Date(j.createdAt).toLocaleDateString(),
  };
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const displayName = user?.name?.trim() || "Admin";

  const {
    data: dashboard,
    isLoading,
    isError,
    refetch,
  } = useAdminDashboard();

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load dashboard stats.");
    }
  }, [isError]);

  const stats = useMemo<AdminStat[]>(() => {
    const d = dashboard?.data;

    if (!d) {
      return [
        {
          id: "total-users",
          title: "Total Users",
          value: "0",
          trend: "—",
          icon: Users,
        },
        {
          id: "recruiters",
          title: "Recruiters",
          value: "0",
          trend: "—",
          icon: Building2,
        },
        {
          id: "candidates",
          title: "Candidates",
          value: "0",
          trend: "—",
          icon: Users,
        },
        {
          id: "jobs",
          title: "Live Jobs",
          value: "0",
          trend: "—",
          icon: BriefcaseBusiness,
        },
      ];
    }

    return [
      {
        id: "total-users",
        title: "Total Users",
        value: String(d.totalUsers),
        trend: `${d.totalRecruiters} recruiters, ${d.totalCandidates} candidates`,
        icon: Users,
      },
      {
        id: "recruiters",
        title: "Recruiters",
        value: String(d.totalRecruiters),
        trend: "Registered accounts",
        icon: Building2,
      },
      {
        id: "candidates",
        title: "Candidates",
        value: String(d.totalCandidates),
        trend: "Registered accounts",
        icon: Users,
      },
      {
        id: "jobs",
        title: "Live Jobs",
        value: String(d.totalJobs),
        trend: `${d.totalApplications} total applications`,
        icon: BriefcaseBusiness,
      },
    ];
  }, [dashboard]);

  const recentUsers = useMemo(
    () => (dashboard?.data?.recentUsers ?? []).map(mapUser),
    [dashboard]
  );

  const recentJobs = useMemo(
    () => (dashboard?.data?.recentJobs ?? []).map(mapJob),
    [dashboard]
  );

  return (
    <div className="space-y-6">
      <AdminWelcome
        name={displayName}
        greeting={getGreetingByTime()}
        currentDate={formatDashboardDate()}
        description="Monitor growth, review moderation tasks, and keep the platform healthy from a single view."
      />

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          <p className="mb-3">Failed to load dashboard stats.</p>
            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Retry
            </button>
        </div>
      ) : isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-8 w-1/3 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : (
        <AdminStats stats={stats} />
      )}

      <AdminQuickActions actions={quickActions} />

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Recent users</h3>
              <p className="mt-1 text-sm text-slate-500">Latest account activity and statuses</p>
            </div>
          </div>

          {isError ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
              <p className="mb-3">Failed to load recent users.</p>
              <button
                type="button"
                onClick={() => {
                  void refetch();
                }}
                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Retry
              </button>
            </div>
          ) : isLoading ? (
            <div className="mt-5 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : recentUsers.length > 0 ? (
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
                  {recentUsers.slice(0, 3).map((user) => (
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
          ) : (
            <div className="mt-5">
              <EmptyState
                title="No users yet"
                description="New user accounts will appear here once registered."
              />
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Recent jobs</h3>
          <p className="mt-1 text-sm text-slate-500">Latest job postings</p>

          {isError ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
              <p className="mb-3">Failed to load recent jobs.</p>
              <button
                type="button"
                onClick={() => {
                  void refetch();
                }}
                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Retry
              </button>
            </div>
          ) : isLoading ? (
            <div className="mt-5 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="mt-5 space-y-3">
              {recentJobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
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
          ) : (
            <div className="mt-5">
              <EmptyState
                title="No jobs yet"
                description="New job postings will appear here once created."
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
