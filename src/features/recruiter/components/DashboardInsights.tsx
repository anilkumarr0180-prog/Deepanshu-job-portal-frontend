import { TrendingUp, Award, BarChart3, CheckCircle2 } from "lucide-react";

interface DashboardInsightsProps {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  totalApplications: number;
}

export default function DashboardInsights({
  totalJobs,
  activeJobs,
  closedJobs,
  totalApplications,
}: DashboardInsightsProps) {
  // Calculate dynamic metrics safely from backend data
  const activeRate = totalJobs > 0 ? Math.round((activeJobs / totalJobs) * 100) : 0;
  const closedRate = totalJobs > 0 ? Math.round((closedJobs / totalJobs) * 100) : 0;
  const avgApplicationsPerJob = totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : "0";

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-lg font-bold text-[#05264E]">Hiring Insights &amp; Progress</h3>
          <p className="mt-0.5 text-sm font-medium text-slate-500">
            Real-time analytics calculated from your active listings &amp; applicants
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#3C65F5]">
          <TrendingUp className="h-3.5 w-3.5" />
          Live Metrics
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {/* Progress Bar 1: Active Recruitment Rate */}
        <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 transition-all duration-200 hover:border-blue-200 hover:bg-white hover:shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5 text-[#05264E]">
              <BarChart3 className="h-4 w-4 text-[#3C65F5]" />
              Active Recruitment
            </span>
            <span className="text-[#3C65F5]">{activeRate}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
            <div
              className="h-full rounded-full bg-[#3C65F5] transition-all duration-500"
              style={{ width: `${Math.min(100, activeRate)}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">
            {activeJobs} of {totalJobs} total jobs currently active
          </p>
        </div>

        {/* Metric 2: Average Applications Per Job */}
        <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 transition-all duration-200 hover:border-purple-200 hover:bg-white hover:shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5 text-[#05264E]">
              <Award className="h-4 w-4 text-purple-600" />
              Applicant Ratio
            </span>
            <span className="text-purple-600">{avgApplicationsPerJob} / job</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
            <div
              className="h-full rounded-full bg-purple-600 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round(Number(avgApplicationsPerJob) * 10))}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">
            {totalApplications} total candidate responses received
          </p>
        </div>

        {/* Progress Bar 3: Job Fulfillment Rate */}
        <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 transition-all duration-200 hover:border-emerald-200 hover:bg-white hover:shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5 text-[#05264E]">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Positions Fulfilled
            </span>
            <span className="text-emerald-600">{closedRate}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${Math.min(100, closedRate)}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">
            {closedJobs} roles successfully closed
          </p>
        </div>
      </div>
    </section>
  );
}
