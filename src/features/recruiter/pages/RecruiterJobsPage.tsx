import { useState } from "react";
import { Link } from "react-router-dom";

import DeleteJobModal from "../components/DeleteJobModal";
import EmptyJobs from "../components/EmptyJobs";
import JobsTable from "../components/JobsTable";
import JobsToolbar from "../components/JobsToolbar";
import { recruiterJobs } from "../constants/jobs";

export default function RecruiterJobsPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">My Jobs</h2>
          <p className="mt-2 text-sm text-slate-500">Manage all jobs you've posted.</p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          + Post New Job
        </Link>
      </div>

      <JobsToolbar />

      {recruiterJobs.length > 0 ? (
        <JobsTable jobs={recruiterJobs} />
      ) : (
        <EmptyJobs />
      )}

      <DeleteJobModal
        open={isDeleteModalOpen}
        title="Senior Frontend Engineer"
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
