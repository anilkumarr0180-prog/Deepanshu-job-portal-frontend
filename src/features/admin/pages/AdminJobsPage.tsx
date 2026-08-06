import { useState } from "react";

import EmptyState from "../components/EmptyState";
import FilterDropdown from "../components/FilterDropdown";
import JobsTable from "../components/JobsTable";
import Pagination from "../components/Pagination";
import SearchInput from "../components/SearchInput";
import Toolbar from "../components/Toolbar";
import DeleteModal from "../components/DeleteModal";

import { useAdminJobs, useDeleteAdminJob, type AdminJobFromBackend } from "../hooks/useAdminJobs";
import type { AdminJob } from "../types";

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
  const [jobToDelete, setJobToDelete] = useState<AdminJob | null>(null);

  const deleteMutation = useDeleteAdminJob();

  // Map UI filter selection to backend enum values
  const backendStatus =
    filter === "Published"
      ? "ACTIVE"
      : filter === "Draft"
        ? "DRAFT"
        : filter === "Archived"
          ? "CLOSED"
          : undefined;

  const { data, isLoading, isError, refetch } = useAdminJobs({
    page,
    limit: 10,
    search: search || undefined,
    status: backendStatus,
  });


  const handleConfirmDelete = () => {
    if (!jobToDelete) return;
    deleteMutation.mutate(jobToDelete.id, {
      onSettled: () => setJobToDelete(null),
    });
  };

  const jobsList = (data?.jobs ?? []).map(mapBackendJob);
  const totalPages = data?.pagination.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <Toolbar
        title="Jobs"
        description="Monitor posted roles, company listings, and platform job moderation."
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
      />

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />
        <FilterDropdown
          value={filter}
          onChange={(val) => {
            setFilter(val);
            setPage(1);
          }}
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
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      ) : jobsList.length > 0 ? (
        <>
          <JobsTable
            jobs={jobsList}
            onDelete={(job) => setJobToDelete(job)}
            canDelete={true}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try a different keyword or status filter."
        />
      )}

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <DeleteModal
          open={Boolean(jobToDelete)}
          title="Delete Job Post"
          description={`Are you sure you want to delete "${jobToDelete.title}" by ${jobToDelete.company}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setJobToDelete(null)}
        />
      )}
    </div>
  );
}
