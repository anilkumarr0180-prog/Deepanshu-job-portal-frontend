import {
  BadgeCheck,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Sparkles,
} from "lucide-react";

import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";
import { formatRelativeDate, formatSalary } from "@/features/jobs/utils/jobMapper";

interface JobOverviewCardProps {
  job: BackendJobDetails;
}

export default function JobOverviewCard({ job }: JobOverviewCardProps) {
  const salaryText =
    job.salaryMin > 0 || job.salaryMax > 0
      ? formatSalary(job.salaryMin, job.salaryMax)
      : "Negotiable";

  const overviewItems = [
    {
      icon: DollarSign,
      label: "Salary Range",
      value: salaryText,
      highlight: true,
    },
    {
      icon: Briefcase,
      label: "Employment Type",
      value: job.employmentType,
    },
    {
      icon: Sparkles,
      label: "Experience Level",
      value: job.experienceLevel,
    },
    {
      icon: MapPin,
      label: "Location",
      value: job.location,
    },
    {
      icon: Clock,
      label: "Date Posted",
      value: formatRelativeDate(job.createdAt),
    },
    {
      icon: Calendar,
      label: "Last Updated",
      value: formatRelativeDate(job.updatedAt),
    },
    {
      icon: BadgeCheck,
      label: "Job Status",
      value: job.status
        ? job.status.charAt(0).toUpperCase() + job.status.slice(1).toLowerCase()
        : "Active",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
      <h3 className="border-b border-slate-100 pb-4 text-lg font-bold text-[#05264E]">
        Job Overview
      </h3>

      <div className="mt-5 space-y-4">
        {overviewItems.map((item, idx) => {
          const Icon = item.icon;

          return (
            <div key={idx} className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500">{item.label}</p>
                <p
                  className={`mt-0.5 truncate text-sm font-semibold ${
                    item.highlight ? "text-[#3C65F5]" : "text-slate-900"
                  }`}
                >
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
