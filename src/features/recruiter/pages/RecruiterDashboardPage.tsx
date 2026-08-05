import useAuth from "@/features/auth/hooks/useAuth";
import { formatDashboardDate, getGreetingByTime } from "@/shared/utils/dashboardUtils";
import { useMyJobs } from "@/features/jobs/hooks/useMyJobs";
import { mapRecruiterJob } from "@/features/jobs/utils/jobMapper";
import { useRecruiterDashboard } from "@/features/recruiter/hooks/useRecruiterDashboard";
import { useAllApplications } from "@/features/recruiter/hooks/useAllApplications";
import { mapRecruiterApplicant } from "@/features/recruiter/utils/applicationMapper";
import type { RecruiterStat } from "@/features/recruiter/types";
import { BriefcaseBusiness, CircleCheckBig, FileText, Users } from "lucide-react";

import DashboardStats from "../components/DashboardStats";
import DashboardWelcome from "../components/DashboardWelcome";
import QuickActions from "../components/QuickActions";
import RecentApplicantsTable from "../components/RecentApplicantsTable";
import RecentJobsTable from "../components/RecentJobsTable";
import { quickActions } from "../constants";

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  const displayName = user?.name?.trim() || "Recruiter";

  const { data: dashboard, isError: dashboardError } = useRecruiterDashboard();
  const { data: jobsData, isLoading: jobsLoading } = useMyJobs();
  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isError: applicationsError,
  } = useAllApplications();

  const stats: RecruiterStat[] = dashboard
    ? [
        {
          id: "active-jobs",
          title: "Active Jobs",
          value: String(dashboard.activeJobs),
          icon: BriefcaseBusiness,
        },
        {
          id: "total-applicants",
          title: "Total Applicants",
          value: String(dashboard.totalApplications),
          icon: Users,
        },
        {
          id: "jobs-closed",
          title: "Jobs Closed",
          value: String(dashboard.closedJobs),
          icon: CircleCheckBig,
        },
        {
          id: "draft-jobs",
          title: "Draft Jobs",
          value: String(dashboard.draftJobs),
          icon: FileText,
        },
      ]
    : [];

  const recentJobs = (jobsData ?? []).map(mapRecruiterJob).slice(0, 3);
  const recentApplicants = (applicationsData ?? []).map(mapRecruiterApplicant).slice(0, 3);

  return (
    <div className="space-y-6">
      <DashboardWelcome
        name={displayName}
        greeting={getGreetingByTime()}
        currentDate={formatDashboardDate()}
        description="Review your latest hiring activity, stay on top of applicants, and keep your team moving forward."
      />

      {dashboardError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          Failed to load dashboard stats.
        </div>
      ) : (
        <DashboardStats stats={stats} />
      )}

      <QuickActions actions={quickActions} />

      <div className="grid gap-6 xl:grid-cols-2">
        {jobsLoading ? (
          <div className="rounded-xl border border-[#E0E6F7] bg-white p-10 text-center text-sm text-slate-500">
            Loading recent jobs...
          </div>
        ) : (
          <RecentJobsTable jobs={recentJobs} />
        )}
        {applicationsLoading ? (
          <div className="rounded-xl border border-[#E0E6F7] bg-white p-10 text-center text-sm text-slate-500">
            Loading recent applicants...
          </div>
        ) : applicationsError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center text-red-600">
            Failed to load applicants.
          </div>
        ) : (
          <RecentApplicantsTable applicants={recentApplicants} />
        )}
      </div>
    </div>
  );
}
