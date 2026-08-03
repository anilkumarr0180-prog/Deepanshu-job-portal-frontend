import type { CandidateStat } from "../types";

interface DashboardStatsProps {
  stats: CandidateStat[];
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article key={stat.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
              </div>
              <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-emerald-600">{stat.trend}</p>
          </article>
        );
      })}
    </section>
  );
}
