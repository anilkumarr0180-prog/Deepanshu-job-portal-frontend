import type { RecruiterProfileData } from "../../types";

interface RecruiterProfileStatsProps {
  profile: RecruiterProfileData;
}

export default function RecruiterProfileStats({ profile }: RecruiterProfileStatsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Recruiter Statistics</h3>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {profile.stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
