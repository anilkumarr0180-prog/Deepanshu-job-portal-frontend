import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import { useMyApplications } from "../hooks/useMyApplications";
import { useWithdrawApplication } from "../hooks/useWithdrawApplication";
import { APPLIED_JOBS_PER_PAGE } from "../constants";
import type { JobsPagination as JobPaginationData } from "../api/jobs.api";

import AppliedJobsToolbar from "../components/AppliedJobsToolbar";
import AppliedJobsTable from "../components/AppliedJobsTable";
import AppliedJobsSkeleton from "../components/AppliedJobsSkeleton";
import EmptyApplications from "../components/EmptyApplications";
import JobsPagination from "../components/JobsPagination";

export default function CandidateAppliedJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const {
    data: applications,
    isLoading,
    isError,
    refetch,
  } = useMyApplications();

  const withdrawApp = useWithdrawApplication();

  const totalApplications = applications?.length ?? 0;

  const filtered = useMemo(() => {
    if (!applications) return [];

    const searchLower = searchTerm.toLowerCase();
    return applications.filter((app) => {
      const matchesSearch =
        app.jobId.title.toLowerCase().includes(searchLower) ||
        app.jobId.company.toLowerCase().includes(searchLower);
      const matchesStatus =
        statusFilter === "" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const { items, ...paginationRest } = useMemo<{
    items: typeof filtered;
    page: number;
    limit: number;
    totalJobs: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>(() => {
    const totalJobs = filtered.length;
    const totalPages =
      Math.ceil(totalJobs / APPLIED_JOBS_PER_PAGE) || 1;
    const page = currentPage;
    const startIndex = (page - 1) * APPLIED_JOBS_PER_PAGE;
    const endIndex = startIndex + APPLIED_JOBS_PER_PAGE;
    const items = filtered.slice(startIndex, endIndex);

    return {
      items,
      page,
      limit: APPLIED_JOBS_PER_PAGE,
      totalJobs,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }, [filtered, currentPage]);

  const pagination: JobPaginationData = {
    page: paginationRest.page,
    limit: paginationRest.limit,
    totalJobs: paginationRest.totalJobs,
    totalPages: paginationRest.totalPages,
    hasNextPage: paginationRest.hasNextPage,
    hasPrevPage: paginationRest.hasPrevPage,
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleWithdraw = (applicationId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to withdraw this application?"
      )
    ) {
      return;
    }
    setWithdrawingId(applicationId);
    withdrawApp.mutate(applicationId, {
      onSettled: () => setWithdrawingId(null),
    });
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Loading your applications...
          </p>
        </div>
        <AppliedJobsToolbar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
        />
        <AppliedJobsSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            We couldn&apos;t load your applications.
          </p>
        </div>
        <AppliedJobsToolbar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
        />
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
          <p className="text-sm text-rose-700">
            Something went wrong. Please try again.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-4 py-2 text-sm font-medium text-white hover:bg-[#2A52D4]"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Applications
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {totalApplications === 0
            ? "You haven't applied to any jobs yet."
            : `You have ${totalApplications} application${totalApplications !== 1 ? "s" : ""}`}
        </p>
      </div>

      <AppliedJobsToolbar
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      {items.length === 0 ? (
        <EmptyApplications
          searchTerm={searchTerm}
          hasActiveFilters={hasActiveFilters}
          onReset={() => {
            setSearchTerm("");
            setStatusFilter("");
            setCurrentPage(1);
          }}
        />
      ) : (
        <>
          <AppliedJobsTable
            applications={items}
            onWithdraw={handleWithdraw}
            withdrawingId={withdrawingId}
          />

          {pagination.totalPages > 1 && (
            <JobsPagination
              pagination={pagination}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}
