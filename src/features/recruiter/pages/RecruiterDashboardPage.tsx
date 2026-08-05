import useAuth from "@/features/auth/hooks/useAuth";
import { formatDashboardDate, getGreetingByTime } from "@/shared/utils/dashboardUtils";
import { useMyJobs } from "@/features/jobs/hooks/useMyJobs";
import { mapRecruiterJob } from "@/features/jobs/utils/jobMapper";
import { useRecruiterDashboard } from "@/features/recruiter/hooks/useRecruiterDashboard";
import { useAllApplications } from "@/features/recruiter/hooks/useAllApplications";
import { mapRecruiterApplicant } from "@/features/recruiter/utils/applicationMapper";
import type { RecruiterStat } from "@/features/recruiter/types";
import { Briefcase, BriefcaseBusiness, CircleCheckBig, FileText, Users } from "lucide-react";

import DashboardWelcome from "../components/DashboardWelcome";
import DashboardStats from "../components/DashboardStats";
import QuickActions from "../components/QuickActions";
import DashboardInsights from "../components/DashboardInsights";
import RecentJobsTable from "../components/RecentJobsTable";
import RecentApplicantsTable from "../components/RecentApplicantsTable";
import { quickActions } from "../constants";

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  const displayName = user?.name?.trim() || "Recruiter";

  const { data: dashboard, isLoading: dashboardLoading, isError: dashboardError } = useRecruiterDashboard();
  const { data: jobsData, isLoading: jobsLoading } = useMyJobs();
  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isError: applicationsError,
  } = useAllApplications();

  const stats: RecruiterStat[] = [
    {
      id: "total-jobs",
      title: "Total Jobs",
      value: String(dashboard?.totalJobs ?? 0),
      icon: Briefcase,
    },
    {
      id: "active-jobs",
      title: "Active Jobs",
      value: String(dashboard?.activeJobs ?? 0),
      icon: BriefcaseBusiness,
    },
    {
      id: "total-applicants",
      title: "Total Applicants",
      value: String(dashboard?.totalApplications ?? 0),
      icon: Users,
    },
    {
      id: "jobs-closed",
      title: "Jobs Closed",
      value: String(dashboard?.closedJobs ?? 0),
      icon: CircleCheckBig,
    },
    {
      id: "draft-jobs",
      title: "Draft Jobs",
      value: String(dashboard?.draftJobs ?? 0),
      icon: FileText,
    },
  ];

  const recentJobs = (jobsData ?? []).map(mapRecruiterJob).slice(0, 4);
  const recentApplicants = (applicationsData ?? []).map(mapRecruiterApplicant).slice(0, 4);

  return (
    <div className="space-y-7">
      {/* Welcome Banner */}
      <DashboardWelcome
        name={displayName}
        greeting={getGreetingByTime()}
        currentDate={formatDashboardDate()}
        description="Review your latest hiring activity, stay on top of applicants, and keep your team moving forward."
      />

      {/* Dynamic Statistics Cards */}
      {dashboardError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-semibold text-red-600">
          Failed to load dashboard metrics from backend. Please refresh or check connection.
        </div>
      ) : (
        <DashboardStats stats={stats} isLoading={dashboardLoading} />
      )}

      {/* Quick Priority Actions */}
      <QuickActions actions={quickActions} />

      {/* Hiring Analytics & Performance Insights */}
      <DashboardInsights
        totalJobs={dashboard?.totalJobs ?? 0}
        activeJobs={dashboard?.activeJobs ?? 0}
        closedJobs={dashboard?.closedJobs ?? 0}
        totalApplications={dashboard?.totalApplications ?? 0}
      />

      {/* Recent Activity Tables */}
      <div className="grid gap-7 xl:grid-cols-2">
        <RecentJobsTable jobs={recentJobs} isLoading={jobsLoading} />

        {applicationsError ? (
          <div className="flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm font-semibold text-red-600">
            Failed to load recent applicants.
          </div>
        ) : (
          <RecentApplicantsTable applicants={recentApplicants} isLoading={applicationsLoading} />
        )}
      </div>
    </div>
  );
}
