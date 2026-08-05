import { Link } from "react-router-dom";
import type { RecruiterStat } from "../types";

interface DashboardStatsProps {
  stats: RecruiterStat[];
  isLoading?: boolean;
}

const colorMap: Record<
  string,
  { bg: string; iconBg: string; text: string; link: string }
> = {
  "total-jobs": {
    bg: "bg-blue-50/50 hover:border-blue-200",
    iconBg: "bg-blue-500 text-white shadow-blue-500/30",
    text: "text-blue-600",
    link: "/recruiter/jobs",
  },
  "active-jobs": {
    bg: "bg-emerald-50/50 hover:border-emerald-200",
    iconBg: "bg-emerald-500 text-white shadow-emerald-500/30",
    text: "text-emerald-600",
    link: "/recruiter/jobs",
  },
  "total-applicants": {
    bg: "bg-purple-50/50 hover:border-purple-200",
    iconBg: "bg-purple-500 text-white shadow-purple-500/30",
    text: "text-purple-600",
    link: "/recruiter/applicants",
  },
  "jobs-closed": {
    bg: "bg-amber-50/50 hover:border-amber-200",
    iconBg: "bg-amber-500 text-white shadow-amber-500/30",
    text: "text-amber-600",
    link: "/recruiter/jobs",
  },
  "draft-jobs": {
    bg: "bg-slate-100/60 hover:border-slate-300",
    iconBg: "bg-slate-600 text-white shadow-slate-600/30",
    text: "text-slate-600",
    link: "/recruiter/jobs",
  },
};

export default function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-slate-200" />
              <div className="h-10 w-10 rounded-xl bg-slate-200" />
            </div>
            <div className="mt-4 h-8 w-16 rounded bg-slate-200" />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const style = colorMap[stat.id] ?? {
          bg: "bg-slate-50 hover:border-slate-200",
          iconBg: "bg-[#3C65F5] text-white shadow-blue-500/30",
          text: "text-[#3C65F5]",
          link: "/recruiter/jobs",
        };

        return (
          <Link
            key={stat.id}
            to={style.link}
            className={`group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${style.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {stat.title}
              </span>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110 ${style.iconBg}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-[#05264E]">
                {stat.value}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-[#3C65F5]">
              <span>View details</span>
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
