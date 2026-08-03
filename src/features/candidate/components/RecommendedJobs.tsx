import { ArrowRight, BriefcaseBusiness, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import type { CandidateJob } from "../types";

interface RecommendedJobsProps {
  jobs: CandidateJob[];
}

export default function RecommendedJobs({ jobs }: RecommendedJobsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recommended jobs</h3>
          <p className="mt-1 text-sm text-slate-500">Matches tailored to your profile and goals</p>
        </div>
        <Link to="/candidate/jobs" className="text-sm font-medium text-slate-700 transition hover:text-slate-900">
          View all
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {jobs.map((job) => (
          <article key={job.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{job.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{job.company}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span>{job.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                {job.matchScore}% match
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">{job.postedAt}</p>
              <Link to={`/candidate/jobs/${job.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 transition hover:text-slate-900">
                View details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
