import useAuth from "@/features/auth/hooks/useAuth";
import { formatDashboardDate, getGreetingByTime } from "@/shared/utils/dashboardUtils";

import DashboardStats from "../components/DashboardStats";
import DashboardWelcome from "../components/DashboardWelcome";
import QuickActions from "../components/QuickActions";
import RecentApplicantsTable from "../components/RecentApplicantsTable";
import RecentJobsTable from "../components/RecentJobsTable";
import { quickActions, recentApplicants, recentJobs, recruiterStats } from "../constants";

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  const displayName = user?.name ?? "User";

  return (
    <div className="space-y-6">
      <DashboardWelcome
        name={displayName}
        greeting={getGreetingByTime()}
        currentDate={formatDashboardDate()}
        description="Review your latest hiring activity, stay on top of applicants, and keep your team moving forward."
      />

      <DashboardStats stats={recruiterStats} />

      <QuickActions actions={quickActions} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentJobsTable jobs={recentJobs} />
        <RecentApplicantsTable applicants={recentApplicants} />
      </div>
    </div>
  );
}
