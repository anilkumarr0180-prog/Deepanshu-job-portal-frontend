import { ArrowLeft, Edit3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import JobApplicantsPreview from "../components/JobApplicantsPreview";
import JobDescriptionCard from "../components/JobDescriptionCard";
import JobOverviewCard from "../components/JobOverviewCard";
import JobRequirementsCard from "../components/JobRequirementsCard";
import JobSidebarCard from "../components/JobSidebarCard";
import JobSkillsCard from "../components/JobSkillsCard";
import JobStatisticsCard from "../components/JobStatisticsCard";
import { recruiterJobDetails } from "../constants/recruiterJobDetails";

export default function RecruiterJobDetailsPage() {
  const job = recruiterJobDetails;

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
          <JobRequirementsCard requirements={job.requirements} />
          <JobSkillsCard skills={job.skills} />
          <JobStatisticsCard stats={job.stats} />
          <JobApplicantsPreview applicants={job.applicants} />
        </div>

        <div className="space-y-6">
          <JobSidebarCard
            status={job.status}
            postedDate={job.postedDate}
            expiryDate={job.deadline}
            recruiter={job.company}
          />
        </div>
      </div>
    </div>
  );
}
