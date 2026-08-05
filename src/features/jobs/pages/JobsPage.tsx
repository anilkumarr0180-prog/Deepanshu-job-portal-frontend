import { useEffect, useMemo, useState } from "react";

import type { JobsFilterParams } from "../api/jobs.api";
import { JOBS_PER_PAGE } from "../constants";
import { useJobs } from "../hooks/useJobs";
import PublicJobCard from "../components/PublicJobCard";
import JobCardSkeleton from "../components/JobCardSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import JobsSidebar from "../components/JobsSidebar";
import JobsPagination from "../components/JobsPagination";
import leftJobHead from "@/assets/images/jobs/left-job-head.svg";
import rightJobHead from "@/assets/images/jobs/right-job-head.svg";
import { SlidersHorizontal } from "lucide-react";

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
  const [searchInput, setSearchInput] = useState("");
  const [heroLocation, setHeroLocation] = useState("");

  const { data, isLoading, isError, refetch } = useJobs(filters);

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
    setHeroLocation("");
  };

  const handleHeroSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchInput,
      location: heroLocation,
      page: "1",
    }));
  };

  const handleHeroKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleHeroSearch();
    }
  };

  const activeFilters = useMemo(
    () =>
      Boolean(
        filters.location ||
          filters.employmentType ||
          filters.experienceLevel ||
          filters.status ||
          searchInput
      ),
    [filters, searchInput]
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const jobs = useMemo(() => data?.jobs ?? [], [data?.jobs]);
  const pagination = data?.pagination;
  const totalResults = pagination?.totalJobs ?? 0;

  const startItem = isLoading ? 0 : (pagination?.page ?? 1) * (pagination?.limit ?? JOBS_PER_PAGE) - (pagination?.limit ?? JOBS_PER_PAGE) + 1;
  const endItem = isLoading ? 0 : Math.min((pagination?.page ?? 1) * (pagination?.limit ?? JOBS_PER_PAGE), pagination?.totalJobs ?? 0);
  const totalItems = pagination?.totalJobs ?? 0;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200">
        <img
          src={leftJobHead}
          alt=""
          className="pointer-events-none absolute bottom-0 left-0 hidden md:block md:w-40 lg:w-48"
        />
        <img
          src={rightJobHead}
          alt=""
          className="pointer-events-none absolute bottom-0 right-0 hidden md:block md:w-40 lg:w-48"
        />

        <div className="mx-auto max-w-[1320px] px-8 py-10">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              {isLoading ? (
                <span className="inline-block h-9 w-48 animate-pulse rounded bg-slate-200" />
              ) : (
                `${totalResults.toLocaleString()} Jobs Available Now`
              )}
            </h1>
            <p className="mt-2 text-slate-600">
              Find your next opportunity from our latest job listings.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl">
            <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:flex-row">
              <div className="flex-1 border-b border-slate-200 sm:border-b-0 sm:border-r border-slate-200">
                <select
                  disabled
                  className="h-11 w-full cursor-not-allowed bg-slate-50 px-4 text-sm text-slate-400 outline-none"
                >
                  <option>All Industries</option>
                </select>
              </div>

              <div className="flex-1 border-b border-slate-200 sm:border-b-0 sm:border-r border-slate-200">
                <input
                  type="text"
                  placeholder="Location"
                  value={heroLocation}
                  onChange={(e) => setHeroLocation(e.target.value)}
                  onKeyDown={handleHeroKeyDown}
                  className="h-11 w-full bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="flex-1 border-b border-slate-200 sm:border-b-0 sm:border-r border-slate-200">
                <input
                  type="text"
                  placeholder="Keyword Search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleHeroKeyDown}
                  className="h-11 w-full bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <button
                type="button"
                onClick={handleHeroSearch}
                className="h-11 whitespace-nowrap bg-[#3C65F5] px-5 text-sm font-medium text-white transition hover:bg-[#2956F2]"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-[1320px] px-8 py-10">
        {/* Mobile Filter Toggle */}
        <div className="mb-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilters && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-100 px-1.5 text-xs font-medium text-slate-600">
                {[
                  filters.location,
                  filters.employmentType,
                  filters.experienceLevel,
                  filters.status,
                  searchInput,
                ].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Top Toolbar */}
        {!isLoading && !isError && totalItems > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {startItem.toLocaleString()}–{endItem.toLocaleString()} of {totalItems.toLocaleString()} Jobs
            </p>
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-[280px] xl:w-[300px] shrink-0">
            <JobsSidebar
              filters={filters}
              searchInput={searchInput}
              onSearchChange={setSearchInput}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>

          {/* Mobile Sidebar Drawer */}
          {sidebarOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto bg-white p-5 shadow-xl lg:hidden">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                  >
                    ✕
                  </button>
                </div>
                <JobsSidebar
                  filters={filters}
                  searchInput={searchInput}
                  onSearchChange={setSearchInput}
                  onFilterChange={handleFilterChange}
                  onReset={handleReset}
                />
              </div>
            </>
          )}

          <div className="flex-1">
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
                searchTerm={searchInput}
                hasActiveFilters={activeFilters}
                onReset={handleReset}
              />
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
      </section>
    </div>
  );
}
