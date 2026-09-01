import { useState } from "react";
import { Hero } from "../components/hero";
import { Categories } from "../components/categories";
import { JobsOfDay } from "../components/jobs-of-day";
import { MillionsOfJobs } from "../components/millions-of-jobs";
import { Statistics } from "../components/statistics";
import { TopRecruiters } from "../components/top-recruiters";
import { JobsByLocation } from "../components/jobs-by-location";
import { NewsAndBlog } from "../components/news-and-blog";
import { NewsletterSection } from "../components/newsletter";
import type { SearchFilterState } from "@/shared/components/UniversalSearchBar";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import PublicJobCard from "@/features/jobs/components/PublicJobCard";
import JobCardSkeleton from "@/features/jobs/components/JobCardSkeleton";
import { SearchX, X } from "lucide-react";

const HomePage = () => {
  const [filters, setFilters] = useState<SearchFilterState>({
    keyword: "",
    location: "",
    industry: "",
  });

  const activeQuery = filters.keyword || filters.industry;
  const isSearching = Boolean(activeQuery || filters.location);

  const { data, isLoading, isError } = useJobs({
    search: activeQuery,
    location: filters.location,
    limit: "12",
  });

  const handleClear = () => {
    setFilters({ keyword: "", location: "", industry: "" });
  };

  return (
    <div className="w-full bg-white dark:bg-[#0B1220]">
      <Hero onSearchChange={setFilters} initialFilters={filters} />

      {/* Inline Search Results Section (Shown when user searches, hidden when cleared) */}
      {isSearching && (
        <section className="bg-slate-50/80 border-y border-slate-200/80 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#05264E]">Search Results</h2>
                <p className="text-xs text-slate-500">
                  Found {data?.jobs?.length ?? 0} matching jobs
                </p>
              </div>

              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <X className="h-3.5 w-3.5" />
                <span>Clear Search Results</span>
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : isError || !data?.jobs || data.jobs.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xs">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5]">
                  <SearchX className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">No jobs match your criteria</h3>
                <p className="mt-1 text-xs text-slate-500">Try broadening your keyword or clearing filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.jobs.map((job) => (
                  <PublicJobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <Categories />
      <JobsOfDay />
      <MillionsOfJobs />
      <Statistics />
      <TopRecruiters />
      <JobsByLocation />
      <NewsAndBlog />
      <NewsletterSection />
    </div>
  );
};

export default HomePage;