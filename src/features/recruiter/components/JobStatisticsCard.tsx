interface StatisticItem {
  label: string;
  value: string;
  description: string;
}

interface JobStatisticsCardProps {
  stats: StatisticItem[];
}

export default function JobStatisticsCard({ stats }: JobStatisticsCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Performance</h3>
        <p className="mt-1 text-sm text-slate-500">Mock engagement metrics for this posting.</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
