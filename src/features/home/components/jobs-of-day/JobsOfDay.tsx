import { useMemo, useState } from "react";
import { AlertCircle, Briefcase, RefreshCw } from "lucide-react";

import { useJobs } from "@/features/jobs/hooks/useJobs";
import CategoryTabs from "./CategoryTabs";
import JobDayCard from "./JobDayCard";
import JobsOfDaySkeleton from "./JobsOfDaySkeleton";

const TAB_KEYWORDS: Record<string, string[]> = {
  software: ["software", "developer", "engineer", "react", "frontend", "backend", "fullstack", "node"],
  management: ["management", "manager", "lead", "director", "head"],
  marketing: ["marketing", "sale", "sales", "seo", "media", "growth"],
  finance: ["finance", "bank", "accountant", "accounting", "audit"],
  hr: ["human resource", "hr", "recruiter", "talent", "people"],
  retail: ["retail", "product", "e-commerce", "store"],
  customer: ["customer", "support", "help", "service", "client"],
  content: ["content", "writer", "copywriter", "editor", "blog"],
};

export default function JobsOfDay() {
  const [activeTab, setActiveTab] = useState("all");

  const { data, isLoading, isError, refetch } = useJobs({ limit: "16" });

  const jobs = data?.jobs;

  /* Filter jobs dynamically based on selected active category tab */
  const filteredJobs = useMemo(() => {
    const activeJobs = jobs ?? [];

    if (activeTab === "all" || !TAB_KEYWORDS[activeTab]) {
      return activeJobs;
    }

    const keywords = TAB_KEYWORDS[activeTab];
    const matches = activeJobs.filter((job) => {
      const text = `${job.title} ${job.description} ${job.skills.join(" ")}`.toLowerCase();
      return keywords.some((kw) => text.includes(kw));
    });

    // If specific tab has direct matches, return them; otherwise fallback to active jobs
    return matches.length > 0 ? matches : activeJobs;
  }, [jobs, activeTab]);

  return (
    <section className="bg-white pt-8 pb-6 sm:pt-12 sm:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#05264E] sm:text-5xl">
            Jobs of the day
          </h2>

          <p className="mt-3 text-base text-slate-500 sm:text-lg">
            Search and connect with the right candidates faster.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Section Content States */}
        {isError ? (
          <div className="rounded-3xl border border-rose-200 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Failed to load jobs
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              There was an issue loading jobs for this section. Please try again.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : isLoading ? (
          <JobsOfDaySkeleton />
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/90 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5]">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#05264E]">
              No Jobs Available
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              No active positions found in this category at the moment.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#2956F2]"
            >
              View All Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredJobs.map((job) => (
              <JobDayCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
