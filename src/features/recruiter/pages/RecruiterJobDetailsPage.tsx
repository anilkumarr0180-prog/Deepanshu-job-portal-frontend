import { useState } from "react";
import { ArrowLeft, Edit3, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import JobApplicantsPreview from "../components/JobApplicantsPreview";
import JobDescriptionCard from "../components/JobDescriptionCard";
import JobOverviewCard from "../components/JobOverviewCard";
import JobRequirementsCard from "../components/JobRequirementsCard";
import JobSidebarCard from "../components/JobSidebarCard";
import JobSkillsCard from "../components/JobSkillsCard";
import JobStatisticsCard from "../components/JobStatisticsCard";
import DeleteJobModal from "../components/DeleteJobModal";
import { useJobDetails } from "@/features/jobs/hooks/useJobDetails";
import { useDeleteJob } from "@/features/jobs/hooks/useDeleteJob";
import { mapRecruiterJobDetails } from "@/features/jobs/utils/jobMapper";

export default function RecruiterJobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useJobDetails(id ?? "");
  const deleteMutation = useDeleteJob();

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const job = data ? mapRecruiterJobDetails(data) : null;

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

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget, {
        onSuccess: () => {
          setDeleteTarget(null);
          navigate("/recruiter/jobs");
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/recruiter/jobs"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to jobs
              </Link>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                {job.status}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{job.title}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span>{job.company}</span>
                <span>•</span>
                <span>{job.postedDate}</span>
                <span>•</span>
                <span>Last updated {job.lastUpdated}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={`/recruiter/jobs/${job.id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Edit3 className="h-4 w-4" />
              Edit Job
            </Link>
            <button
              type="button"
              onClick={() => setDeleteTarget(job.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
            >
              <Trash2 className="h-4 w-4" />
              Delete Job
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_0.8fr]">
        <div className="space-y-6">
          <JobOverviewCard job={job} />
          <JobDescriptionCard description={job.description} />
          <JobRequirementsCard requirements={[]} />
          <JobSkillsCard skills={job.skills} />
          <JobStatisticsCard stats={job.stats} />
          <JobApplicantsPreview applicants={job.applicants} />
        </div>

        <div className="space-y-6">
          <JobSidebarCard
            status={job.status}
            postedDate={job.postedDate}
            recruiter={job.company}
          />
        </div>
      </div>

      <DeleteJobModal
        open={deleteTarget !== null}
        title={job.title}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
