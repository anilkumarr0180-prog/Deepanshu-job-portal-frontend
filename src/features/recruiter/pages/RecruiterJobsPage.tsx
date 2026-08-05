import { useState } from "react";
import { Link } from "react-router-dom";

import { useMyJobs } from "@/features/jobs/hooks/useMyJobs";
import { useDeleteJob } from "@/features/jobs/hooks/useDeleteJob";
import { mapRecruiterJob } from "@/features/jobs/utils/jobMapper";

import DeleteJobModal from "../components/DeleteJobModal";
import EmptyJobs from "../components/EmptyJobs";
import JobsTable from "../components/JobsTable";
import JobsToolbar from "../components/JobsToolbar";

export default function RecruiterJobsPage() {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
  } = useMyJobs();

  const deleteMutation = useDeleteJob();

  const jobs = (data ?? []).map(mapRecruiterJob);

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget, {
        onSuccess: () => {
          setDeleteTarget(null);
        },
      });
    }
  };

  const handleDeleteOpen = (jobId: string) => {
    setDeleteTarget(jobId);
  };

  const handleDeleteClose = () => {
    setDeleteTarget(null);
  };

  const targetJob = jobs.find((job) => job.id === deleteTarget);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            My Jobs
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage all jobs you've posted.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          + Post New Job
        </Link>
      </div>

      <JobsToolbar />

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading jobs...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-600">
          Failed to load jobs.
        </div>
      ) : jobs.length > 0 ? (
        <JobsTable
          jobs={jobs}
          onDelete={handleDeleteOpen}
        />
      ) : (
        <EmptyJobs />
      )}

      <DeleteJobModal
        open={deleteTarget !== null}
        title={targetJob?.title ?? ""}
        onClose={handleDeleteClose}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}