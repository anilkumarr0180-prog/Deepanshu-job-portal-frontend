import { Link, useNavigate } from "react-router-dom";

import CreateJobForm from "../components/CreateJobForm";
import type { CreateJobPayload } from "@/features/jobs/api/jobs.api";
import { useCreateJob } from "@/features/jobs/hooks/useCreateJob";

export default function RecruiterCreateJobPage() {
  const navigate = useNavigate();
  const createMutation = useCreateJob();

  const handleSubmit = (values: CreateJobPayload) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        navigate("/recruiter/jobs");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Create New Job</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Fill in the information below to publish a new job posting.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/recruiter/jobs"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <CreateJobForm
          onCancel={() => navigate("/recruiter/jobs")}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  );
}
