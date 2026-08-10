import { useMemo, useState } from "react";

import type { JobsFilterParams } from "../api/jobs.api";
import { JOBS_PER_PAGE } from "../constants";
import { useJobs } from "../hooks/useJobs";
import PublicJobCard from "../components/PublicJobCard";
import JobCardSkeleton from "../components/JobCardSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import JobsSidebar from "../components/JobsSidebar";
import JobsPagination from "../components/JobsPagination";
import JobsHero from "../components/JobsHero";
import JobsToolbar from "../components/JobsToolbar";
import type { SearchFilterState } from "@/shared/components/UniversalSearchBar";

const initialFilters: JobsFilterParams = {
  page: "1",
  limit: String(JOBS_PER_PAGE),
  sort: "",
  location: "",
  employmentType: "",
  experienceLevel: "",
  status: "",
  search: "",
};

export default function JobsPage() {
  const [filters, setFilters] = useState<JobsFilterParams>(initialFilters);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading, isError, refetch } = useJobs(filters);

  const handleUniversalSearch = (searchState: SearchFilterState) => {
    const activeSearch = searchState.keyword || searchState.industry;
    setFilters((prev) => ({
      ...prev,
      search: activeSearch,
      location: searchState.location,
      page: "1",
    }));
  };

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
  };

  const activeFilters = useMemo(
    () =>
      Boolean(
        filters.location ||
          filters.employmentType ||
          filters.experienceLevel ||
          filters.status ||
          filters.search
      ),
    [filters]
  );

  const handleOpenFilters = () => {
    document.getElementById("jobs-sidebar")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleLimitChange = (value: number) => {
    handleFilterChange("limit", String(value));
  };

  const jobs = useMemo(() => data?.jobs ?? [], [data?.jobs]);
  const pagination = data?.pagination;
  const totalResults = pagination?.totalJobs ?? 0;

  const startItem = isLoading ? 0 : (pagination?.page ?? 1) * (pagination?.limit ?? JOBS_PER_PAGE) - (pagination?.limit ?? JOBS_PER_PAGE) + 1;
  const endItem = isLoading ? 0 : Math.min((pagination?.page ?? 1) * (pagination?.limit ?? JOBS_PER_PAGE), pagination?.totalJobs ?? 0);
  const totalItems = pagination?.totalJobs ?? 0;

  return (
    <div>
      <JobsHero
        isLoading={isLoading}
        totalResults={totalResults}
        initialFilters={{
          keyword: filters.search ?? "",
          location: filters.location ?? "",
          industry: "",
        }}
        onSearch={handleUniversalSearch}
        onClear={handleReset}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-[1320px] px-4 py-6 sm:px-8 lg:py-8">
        <JobsToolbar
          startItem={startItem}
          endItem={endItem}
          totalItems={totalItems}
          activeFilterCount={[
            filters.location,
            filters.employmentType,
            filters.experienceLevel,
            filters.status,
            filters.search,
          ].filter(Boolean).length}
          sort={filters.sort ?? ""}
          onSortChange={(value) => handleFilterChange("sort", value)}
          limit={Number(filters.limit ?? JOBS_PER_PAGE)}
          onLimitChange={handleLimitChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onReset={handleReset}
          onOpenFilters={handleOpenFilters}
        />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Sidebar */}
          <aside id="jobs-sidebar" className="w-full shrink-0 lg:w-[320px] lg:pr-1">
            <JobsSidebar
              filters={filters}
              searchInput={filters.search ?? ""}
              onSearchChange={(val) => handleFilterChange("search", val)}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </aside>

          {/* Jobs Grid */}
          <div className="min-w-0 flex-1">
            {isError ? (
              <ErrorState onRetry={() => void refetch()} />
            ) : isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: JOBS_PER_PAGE }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState
                searchTerm={filters.search ?? ""}
                hasActiveFilters={activeFilters}
                onReset={handleReset}
              />
            ) : (
              <>
                <div
                  className={
                    viewMode === "list"
                      ? "flex flex-col gap-6"
                      : "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  }
                >
                  {jobs.map((job) => (
                    <PublicJobCard key={job._id} job={job} />
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
        </div>
      </main>
    </div>
  );
}
