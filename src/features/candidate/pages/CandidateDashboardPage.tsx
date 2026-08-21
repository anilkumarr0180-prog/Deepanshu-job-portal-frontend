import { useMemo } from "react";
import {
  BriefcaseBusiness,
  CircleCheckBig,
  Clock3,
  Star,
} from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";
import {
  formatDashboardDate,
  getGreetingByTime,
} from "@/shared/utils/dashboardUtils";

import { useCandidateDashboard } from "../hooks/useCandidateDashboard";
import { useMyApplications } from "../hooks/useMyApplications";
import { useLatestJobs } from "../hooks/useLatestJobs";
import { useProfile } from "../hooks/useProfile";

import { mapCandidateJob } from "../utils/jobMapper";
import { mapCandidateApplication } from "../utils/applicationMapper";
import { calculateProfileCompletion } from "../utils/profileMapper";

import { quickActions } from "../constants";

import DashboardStats from "../components/DashboardStats";
import DashboardWelcome from "../components/DashboardWelcome";
import ProfileCompletionCard from "../components/ProfileCompletionCard";
import QuickActions from "../components/QuickActions";
import RecentApplicationsTable from "../components/RecentApplicationsTable";
import RecommendedJobs from "../components/RecommendedJobs";
import RecentPosts from "@/features/posts/components/RecentPosts";

import type { CandidateStat } from "../types";

export default function CandidateDashboardPage() {
  const { user } = useAuth();
  const displayName = user?.name?.trim() || "Candidate";

  const {
    data: dashboard,
    isLoading: dashboardLoading,
    isError: dashboardError,
  } = useCandidateDashboard();

  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isError: applicationsError,
  } = useMyApplications();

  const { data: jobsData, isLoading: jobsLoading, isError: jobsError } =
    useLatestJobs();

  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
  } = useProfile();

  const stats = useMemo<CandidateStat[]>(() => {
    if (!dashboard) {
      return [];
    }

    return [
      {
        id: "applications",
        title: "Applications",
        value: String(dashboard.totalApplications),
        icon: BriefcaseBusiness,
      },
      {
        id: "shortlisted",
        title: "Shortlisted",
        value: String(dashboard.shortlisted),
        icon: Star,
      },
      {
        id: "interviews",
        title: "Interviews",
        value: String(dashboard.interview),
        icon: Clock3,
      },
      {
        id: "hired",
        title: "Hired",
        value: String(dashboard.hired),
        icon: CircleCheckBig,
      },
    ];
  }, [dashboard]);

  const recentApplications = useMemo(
    () =>
      (applicationsData ?? []).map(mapCandidateApplication).slice(0, 3),
    [applicationsData]
  );

  const latestJobs = useMemo(
    () => (jobsData ?? []).map(mapCandidateJob),
    [jobsData]
  );

  const profileCompletion = useMemo(
    () =>
      profileData
        ? calculateProfileCompletion(profileData)
        : null,
    [profileData]
  );

  return (
    <div className="space-y-6">
      <DashboardWelcome
        name={displayName}
        greeting={getGreetingByTime()}
        currentDate={formatDashboardDate()}
        description="Discover new roles, keep your applications moving, and finish your profile to unlock stronger opportunities."
      />

      {dashboardError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          Failed to load dashboard stats.
        </div>
      ) : dashboardLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-8 w-1/3 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <DashboardStats stats={stats} />
      )}

      <QuickActions actions={quickActions} />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        {jobsError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
            Failed to load jobs.
          </div>
        ) : jobsLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Loading jobs...
          </div>
        ) : (
          <RecommendedJobs jobs={latestJobs} />
        )}

        {profileError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
            Failed to load profile.
          </div>
        ) : profileLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Loading profile...
          </div>
        ) : profileCompletion ? (
          <ProfileCompletionCard profile={profileCompletion} />
        ) : null}
      </div>

      {applicationsError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          Failed to load applications.
        </div>
      ) : applicationsLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading applications...
        </div>
      ) : (
        <RecentApplicationsTable applications={recentApplications} />
      )}

      {/* Community / Recent Posts Section */}
      <RecentPosts limit={3} />
    </div>
  );
}
