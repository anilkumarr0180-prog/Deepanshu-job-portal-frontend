import type { BackendProfile } from "@/features/candidate/api/profile.api";

interface RecruiterProfileStatsProps {
  profile: BackendProfile;
  stats?: Array<{ label: string; value: string }>;
}

export default function RecruiterProfileStats({ profile, stats }: RecruiterProfileStatsProps) {
  const displayStats = stats || [
    { label: "Account Role", value: profile.role || "Recruiter" },
    {
      label: "Account Status",
      value: profile.isBlocked ? "Blocked" : "Active",
    },
    {
      label: "Member Since",
      value: profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "N/A",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Recruiter Information</h3>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {displayStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
