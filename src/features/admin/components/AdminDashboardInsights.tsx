import { BarChart3, CheckCircle2, TrendingUp, Users } from "lucide-react";

interface AdminDashboardInsightsProps {
  totalUsers: number;
  totalRecruiters: number;
  totalCandidates: number;
  totalJobs: number;
  totalApplications: number;
}

export default function AdminDashboardInsights({
  totalUsers,
  totalRecruiters,
  totalCandidates,
  totalJobs,
  totalApplications,
}: AdminDashboardInsightsProps) {
  const recruiterRate =
    totalUsers > 0 ? Math.round((totalRecruiters / totalUsers) * 100) : 0;
  const candidateRate =
    totalUsers > 0 ? Math.round((totalCandidates / totalUsers) * 100) : 0;
  const avgApplicationsPerJob =
    totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : "0";
  const jobsWithApplicants = Math.min(
    100,
    Math.round(Number(avgApplicationsPerJob) * 10)
  );

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-lg font-bold text-[#05264E]">
            Platform Insights &amp; Health
          </h3>
          <p className="mt-0.5 text-sm font-medium text-slate-500">
            Real-time metrics derived from live platform data
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#3C65F5]">
          <TrendingUp className="h-3.5 w-3.5" />
          Live Metrics
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {/* Metric 1: Recruiter vs Candidate split */}
        <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 transition-all duration-200 hover:border-blue-200 hover:bg-white hover:shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5 text-[#05264E]">
              <Users className="h-4 w-4 text-[#3C65F5]" />
              Recruiter Share
            </span>
            <span className="text-[#3C65F5]">{recruiterRate}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
            <div
              className="h-full rounded-full bg-[#3C65F5] transition-all duration-500"
              style={{ width: `${Math.min(100, recruiterRate)}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">
            {totalRecruiters} recruiters out of {totalUsers} total users
          </p>
        </div>

        {/* Metric 2: Candidate share */}
        <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 transition-all duration-200 hover:border-purple-200 hover:bg-white hover:shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5 text-[#05264E]">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              Candidate Share
            </span>
            <span className="text-purple-600">{candidateRate}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
            <div
              className="h-full rounded-full bg-purple-600 transition-all duration-500"
              style={{ width: `${Math.min(100, candidateRate)}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">
            {totalCandidates} candidates out of {totalUsers} total users
          </p>
        </div>

        {/* Metric 3: Avg applications per job */}
        <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 transition-all duration-200 hover:border-emerald-200 hover:bg-white hover:shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5 text-[#05264E]">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Applicant Ratio
            </span>
            <span className="text-emerald-600">
              {avgApplicationsPerJob} / job
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${jobsWithApplicants}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">
            {totalApplications} total applications across {totalJobs} jobs
          </p>
        </div>
      </div>
    </section>
  );
}
