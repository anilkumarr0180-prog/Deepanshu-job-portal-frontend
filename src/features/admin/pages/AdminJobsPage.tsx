import { useMemo, useState } from "react";

import DeleteModal from "../components/DeleteModal";
import EmptyState from "../components/EmptyState";
import FilterDropdown from "../components/FilterDropdown";
import JobsTable from "../components/JobsTable";
import Pagination from "../components/Pagination";
import SearchInput from "../components/SearchInput";
import Toolbar from "../components/Toolbar";
import { jobs } from "../constants";
import type { AdminJob } from "../types";

export default function AdminJobsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null);

  const filteredJobs = useMemo(() => {
    const query = search.toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.recruiter.toLowerCase().includes(query);
      const matchesFilter = filter === "All" || job.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [filter, search]);

  const pagedJobs = filteredJobs.slice((page - 1) * 5, page * 5);

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

      {pagedJobs.length > 0 ? (
        <>
          <JobsTable jobs={pagedJobs} onDelete={(job) => setSelectedJob(job)} />
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(filteredJobs.length / 5))} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState title="No jobs found" description="Try a different keyword or status filter." />
      )}

      <DeleteModal
        open={Boolean(selectedJob)}
        title="Delete job"
        description={`Delete ${selectedJob?.title ?? "this job"}? This action cannot be undone.`}
        onCancel={() => setSelectedJob(null)}
        onConfirm={() => setSelectedJob(null)}
      />
    </div>
  );
}
