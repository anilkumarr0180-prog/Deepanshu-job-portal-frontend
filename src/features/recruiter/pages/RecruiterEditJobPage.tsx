import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CreateJobForm from "../components/CreateJobForm";
import type { CreateJobPayload } from "@/features/jobs/api/jobs.api";
import { useJobDetails } from "@/features/jobs/hooks/useJobDetails";
import { useUpdateJob } from "@/features/jobs/hooks/useUpdateJob";

export default function RecruiterEditJobPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useJobDetails(id ?? "");
  const updateMutation = useUpdateJob();

  const job = data;

  const initialValues = job
    ? {
        title: job.title ?? "",
        company: job.company ?? "",
        location: job.location ?? "",
        employmentType: job.employmentType ?? "",
        experienceLevel: job.experienceLevel ?? "",
        description: job.description ?? "",
        skills: job.skills ?? [],
        status: job.status ?? "",
        minSalary: job.salaryMin?.toString() ?? "",
        maxSalary: job.salaryMax?.toString() ?? "",
      }
    : undefined;

  const handleSubmit = (values: CreateJobPayload) => {
    if (!id) return;
    updateMutation.mutate(
      { id, data: values },
      {
        onSuccess: () => {
          navigate(`/recruiter/jobs/${id}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading job details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-600">
        Failed to load job details.
      </div>
    );
  }

  if (!job) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        Job not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Link
              to={`/recruiter/jobs/${job._id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to details
            </Link>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold text-slate-900">Edit Job</h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                  {job.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Last updated {new Date(job.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <CreateJobForm
          initialValues={initialValues}
          cancelLabel="Cancel"
          draftLabel="Save Draft"
          submitLabel="Save Changes"
          isSubmitting={updateMutation.isPending}
          onCancel={() => navigate(`/recruiter/jobs/${job._id}`)}
          onSaveDraft={() => undefined}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
