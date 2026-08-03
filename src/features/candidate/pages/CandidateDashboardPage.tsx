import useAuth from "@/features/auth/hooks/useAuth";
import { formatDashboardDate, getGreetingByTime } from "@/shared/utils/dashboardUtils";

import DashboardStats from "../components/DashboardStats";
import DashboardWelcome from "../components/DashboardWelcome";
import ProfileCompletionCard from "../components/ProfileCompletionCard";
import QuickActions from "../components/QuickActions";
import RecentApplicationsTable from "../components/RecentApplicationsTable";
import RecommendedJobs from "../components/RecommendedJobs";
import { candidateStats, profileCompletion, quickActions, recentApplications, recommendedJobs } from "../constants";

export default function CandidateDashboardPage() {
  const { user } = useAuth();
  const displayName = user?.name ?? "User";

  return (
    <div className="space-y-6">
      <DashboardWelcome
        name={displayName}
        greeting={getGreetingByTime()}
        currentDate={formatDashboardDate()}
        description="Discover new roles, keep your applications moving, and finish your profile to unlock stronger opportunities."
      />

      <DashboardStats stats={candidateStats} />

      <QuickActions actions={quickActions} />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <RecommendedJobs jobs={recommendedJobs} />
        <ProfileCompletionCard profile={profileCompletion} />
      </div>

      <RecentApplicationsTable applications={recentApplications} />
    </div>
  );
}
