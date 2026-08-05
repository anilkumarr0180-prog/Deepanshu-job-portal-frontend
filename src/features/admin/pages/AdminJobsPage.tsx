import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";

import EmptyState from "../components/EmptyState";
import FilterDropdown from "../components/FilterDropdown";
import JobsTable from "../components/JobsTable";
import Pagination from "../components/Pagination";
import SearchInput from "../components/SearchInput";
import Toolbar from "../components/Toolbar";

import { useAdminJobs, type AdminJobFromBackend } from "../hooks/useAdminJobs";
import type { AdminJob } from "../types";

const ITEMS_PER_PAGE = 5;

function mapBackendJob(job: AdminJobFromBackend): AdminJob {
  return {
    id: job._id,
    title: job.title,
    company: job.company,
    recruiter: job.recruiterId?.name ?? "--",
    applicants: "--",
    status: job.status,
    postedAt: new Date(job.createdAt).toLocaleDateString(),
  };
}

export default function AdminJobsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useAdminJobs({
    search: search || undefined,
    limit: "100",
  });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load jobs.");
    }
  }, [isError]);

  const filteredJobs = useMemo(() => {
    const source = data?.jobs ?? [];

    if (filter === "All") {
      return source;
    }

    return source.filter((job) => job.status === filter);
  }, [data?.jobs, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  const effectivePage = Math.min(page, totalPages);

  const pagedJobs = filteredJobs.slice((effectivePage - 1) * ITEMS_PER_PAGE, effectivePage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <Toolbar
        title="Jobs"
        description="Monitor posted roles, applicant volume, and platform moderation."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput value={search} onChange={setSearch} />
        <FilterDropdown
          value={filter}
          onChange={setFilter}
          options={["All", "Published", "Draft", "Archived"]}
        />
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          <p className="mb-3">Failed to load jobs.</p>
          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      ) : pagedJobs.length > 0 ? (
        <>
          <JobsTable
            jobs={pagedJobs.map(mapBackendJob)}
            onDelete={() => {}}
            canDelete={false}
          />
          <Pagination
            page={effectivePage}
            totalPages={Math.max(1, totalPages)}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try a different keyword or status filter."
        />
      )}
    </div>
  );
}
