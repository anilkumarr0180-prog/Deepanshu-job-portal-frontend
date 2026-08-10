import { useMemo } from "react";
import { Users, Building2, BriefcaseBusiness, UserCheck } from "lucide-react";

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
  isBlocked?: boolean;
  createdAt: string;
}): AdminUser {
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    isBlocked: u.isBlocked ?? false,
    status: u.isBlocked ? "Blocked" : "Active",
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



  const stats = useMemo<AdminStat[]>(() => {
    const d = dashboard?.data as any;

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

    const totalUsers = d.users?.totalUsers ?? d.totalUsers ?? 0;
    const totalRecruiters = d.users?.totalRecruiters ?? d.totalRecruiters ?? 0;
    const totalCandidates = d.users?.totalCandidates ?? d.totalCandidates ?? 0;
    const activeJobs = d.jobs?.activeJobs ?? d.totalJobs ?? 0;
    const totalApplications = d.applications?.totalApplications ?? d.totalApplications ?? 0;
    const blockedUsers = d.users?.blockedUsers ?? 0;

    return [
      {
        id: "total-users",
        title: "Total Users",
        value: String(totalUsers),
        trend: `${totalRecruiters} recruiters, ${totalCandidates} candidates (${blockedUsers} blocked)`,
        icon: Users,
      },
      {
        id: "recruiters",
        title: "Recruiters",
        value: String(totalRecruiters),
        trend: `${d.users?.activeRecruiters ?? totalRecruiters} active`,
        icon: Building2,
      },
      {
        id: "candidates",
        title: "Candidates",
        value: String(totalCandidates),
        trend: `${d.users?.activeCandidates ?? totalCandidates} active`,
        icon: UserCheck,
      },
      {
        id: "jobs",
        title: "Live Jobs",
        value: String(activeJobs),
        trend: `${totalApplications} total applications`,
        icon: BriefcaseBusiness,
      },
    ];
  }, [dashboard]);

  const recentUsers = useMemo(
    () => ((dashboard?.data as any)?.recentUsers ?? []).map(mapUser),
    [dashboard]
  );

  const recentJobs = useMemo(
    () => ((dashboard?.data as any)?.recentJobs ?? []).map(mapJob),
    [dashboard]
  );

  const d = dashboard?.data as any;
  const totalUsersVal = d?.users?.totalUsers ?? d?.totalUsers ?? 0;
  const totalRecruitersVal = d?.users?.totalRecruiters ?? d?.totalRecruiters ?? 0;
  const totalCandidatesVal = d?.users?.totalCandidates ?? d?.totalCandidates ?? 0;
  const totalJobsVal = d?.jobs?.totalJobs ?? d?.totalJobs ?? 0;
  const totalAppsVal = d?.applications?.totalApplications ?? d?.totalApplications ?? 0;

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
          totalUsers={totalUsersVal}
          totalRecruiters={totalRecruitersVal}
          totalCandidates={totalCandidatesVal}
          totalJobs={totalJobsVal}
          totalApplications={totalAppsVal}
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
