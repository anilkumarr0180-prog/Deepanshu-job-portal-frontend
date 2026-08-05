import { Link } from "react-router-dom";
import type { CandidateStat } from "../types";

interface DashboardStatsProps {
  stats: CandidateStat[];
}

const colorMap: Record<
  string,
  { bg: string; iconBg: string; link: string }
> = {
  applications: {
    bg: "bg-blue-50/50 hover:border-blue-200",
    iconBg: "bg-blue-500 text-white shadow-blue-500/30",
    link: "/candidate/applied",
  },
  shortlisted: {
    bg: "bg-amber-50/50 hover:border-amber-200",
    iconBg: "bg-amber-500 text-white shadow-amber-500/30",
    link: "/candidate/applied",
  },
  interviews: {
    bg: "bg-purple-50/50 hover:border-purple-200",
    iconBg: "bg-purple-500 text-white shadow-purple-500/30",
    link: "/candidate/applied",
  },
  hired: {
    bg: "bg-emerald-50/50 hover:border-emerald-200",
    iconBg: "bg-emerald-500 text-white shadow-emerald-500/30",
    link: "/candidate/applied",
  },
};

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const style = colorMap[stat.id] ?? {
          bg: "bg-slate-50 hover:border-slate-200",
          iconBg: "bg-[#3C65F5] text-white shadow-blue-500/30",
          link: "/candidate/applied",
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
              <span>View applications</span>
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
