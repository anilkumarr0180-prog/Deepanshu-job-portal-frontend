import type { RecruiterStat } from "../types";

interface DashboardStatsProps {
  stats: RecruiterStat[];
}

const iconColorMap: Record<string, { bg: string; text: string }> = {
  "active-jobs": { bg: "bg-blue-50", text: "text-[#3C65F5]" },
  "total-applicants": { bg: "bg-emerald-50", text: "text-emerald-500" },
  "jobs-closed": { bg: "bg-amber-50", text: "text-amber-500" },
  "draft-jobs": { bg: "bg-purple-50", text: "text-purple-500" },
};

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colors = iconColorMap[stat.id] ?? { bg: "bg-slate-50", text: "text-slate-600" };

        return (
          <article
            key={stat.id}
            className="rounded-xl border border-[#E0E6F7] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="mt-3 text-3xl font-semibold text-[#05264E]">{stat.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
            {stat.trend && (
              <p className="mt-4 text-sm text-emerald-600">{stat.trend}</p>
            )}
          </article>
        );
      })}
    </section>
  );
}
