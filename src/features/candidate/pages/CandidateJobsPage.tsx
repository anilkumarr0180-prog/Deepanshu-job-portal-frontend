import { useEffect, useMemo, useState } from "react";

import type { JobsFilterParams } from "../api/jobs.api";
import { JOBS_PER_PAGE } from "../constants";
import { useJobs } from "../hooks/useJobs";
import { useApplyJob } from "../hooks/useApplyJob";
import JobCard from "../components/JobCard";
import JobCardSkeleton from "../components/JobCardSkeleton";
import EmptyJobs from "../components/EmptyJobs";
import JobFilters from "../components/JobFilters";
import JobsToolbar from "../components/JobsToolbar";
import JobsPagination from "../components/JobsPagination";

const initialFilters: JobsFilterParams = {
  page: "1",
  limit: String(JOBS_PER_PAGE),
  sort: "",
  location: "",
  employmentType: "",
  experienceLevel: "",
  minSalary: "",
  maxSalary: "",
  search: "",
};

function hasActiveFilters(filters: JobsFilterParams): boolean {
  return Boolean(
    filters.location ||
      filters.employmentType ||
      filters.experienceLevel ||
      filters.minSalary ||
      filters.maxSalary
  );
}

export default function CandidateJobsPage() {
  const [filters, setFilters] = useState<JobsFilterParams>(initialFilters);
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isError, refetch } = useJobs(filters);
  const applyJob = useApplyJob();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchInput,
        page: "1",
      }));
    }, 200);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleFilterChange = (
    key: keyof JobsFilterParams,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: "1" }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page: String(page) }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setSearchInput("");
  };

  const activeFilters = useMemo(() => hasActiveFilters(filters), [filters]);

  const jobs = useMemo(() => data?.jobs ?? [], [data?.jobs]);
  const pagination = data?.pagination;
  const totalResults = pagination?.totalJobs ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">Browse Jobs</h1>
        <p className="text-sm text-slate-500">
          Discover opportunities that match your skills and experience.
        </p>
        {isLoading ? (
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        ) : (
          <p className="text-sm text-slate-500">
            Showing {totalResults} {totalResults === 1 ? "job" : "jobs"}
          </p>
        )}
      </header>

      {/* Search */}
      <JobsToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />

      {/* Filters — skeleton while loading */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-11 animate-pulse rounded-xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      ) : (
        <JobFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
        />
      )}

      {/* Main Content */}
      {isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
          <p className="mb-4 text-sm text-rose-800">
            Failed to load jobs. Please try again.
          </p>
          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Retry
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: JOBS_PER_PAGE }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyJobs
          searchTerm={searchInput}
          hasActiveFilters={activeFilters}
          onReset={handleReset}
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onApply={(jobId) => applyJob.mutate({ jobId })}
                isApplying={applyJob.isPending}
              />
            ))}
          </div>

          {pagination && (
            <JobsPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
