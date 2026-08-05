import { useMemo, useEffect } from "react";
import { Users, Building2, BriefcaseBusiness, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

import useAuth from "@/features/auth/hooks/useAuth";
import { formatDashboardDate, getGreetingByTime } from "@/shared/utils/dashboardUtils";

import AdminQuickActions from "../components/AdminQuickActions";
import AdminStats from "../components/AdminStats";
import AdminWelcome from "../components/AdminWelcome";
import AdminDashboardInsights from "../components/AdminDashboardInsights";
import AdminRecentUsersTable from "../components/AdminRecentUsersTable";
import AdminRecentJobsTable from "../components/AdminRecentJobsTable";

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
    recruiter: j.recruiterId?.name ?? "—",
    applicants: "—",
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
          trend: "Registered accounts",
          icon: Building2,
        },
        {
          id: "candidates",
          title: "Candidates",
          value: "0",
          trend: "Registered accounts",
          icon: UserCheck,
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
        icon: UserCheck,
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
    <div className="space-y-7">
      {/* Welcome Banner */}
      <AdminWelcome
        name={displayName}
        greeting={getGreetingByTime()}
        currentDate={formatDashboardDate()}
        description="Monitor platform growth, review moderation tasks, and keep Jobs Box healthy from a single command centre."
      />

      {/* Dynamic Stats Cards */}
      {isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-semibold text-red-600">
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
      ) : (
        <AdminStats stats={stats} isLoading={isLoading} />
      )}

      {/* Quick Priority Actions */}
      <AdminQuickActions actions={quickActions} />

      {/* Platform Insights */}
      {!isError && (
        <AdminDashboardInsights
          totalUsers={dashboard?.data?.totalUsers ?? 0}
          totalRecruiters={dashboard?.data?.totalRecruiters ?? 0}
          totalCandidates={dashboard?.data?.totalCandidates ?? 0}
          totalJobs={dashboard?.data?.totalJobs ?? 0}
          totalApplications={dashboard?.data?.totalApplications ?? 0}
        />
      )}

      {/* Recent Activity Tables */}
      <div className="grid gap-7 xl:grid-cols-2">
        <AdminRecentUsersTable users={recentUsers} isLoading={isLoading} />

        {isError ? (
          <div className="flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm font-semibold text-red-600">
            Failed to load recent jobs.
          </div>
        ) : (
          <AdminRecentJobsTable jobs={recentJobs} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
