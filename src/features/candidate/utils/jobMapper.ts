import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";

import type { CandidateJob } from "../types";

export function formatSalary(min: number, max: number): string {
  return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week\u00a0ago`;
  return date.toLocaleDateString();
}

export function mapCandidateJob(job: BackendJobDetails): CandidateJob {
  return {
    id: job._id,
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.employmentType,
    postedAt: new Date(job.createdAt).toLocaleDateString(),
  };
}
