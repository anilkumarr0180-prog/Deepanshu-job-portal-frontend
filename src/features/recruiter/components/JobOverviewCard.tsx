import type { RecruiterJobDetails } from "../types";

interface JobOverviewCardProps {
  job: RecruiterJobDetails;
}

const overviewItems = [
  { label: "Employment Type", value: "employmentType" },
  { label: "Experience Level", value: "experienceLevel" },
  { label: "Salary", value: "salary" },
  { label: "Location", value: "location" },
  { label: "Status", value: "status" },
] as const;

export default function JobOverviewCard({ job }: JobOverviewCardProps) {
  const values = {
    employmentType: job.employmentType,
    experienceLevel: job.experienceLevel,
    salary: job.salary,
    location: job.location,
    status: job.status,
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Job Overview</h3>
        <p className="mt-1 text-sm text-slate-500">At-a-glance details for this role.</p>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {overviewItems.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <dt className="text-sm font-medium text-slate-500">{item.label}</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900">{values[item.value as keyof typeof values]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
