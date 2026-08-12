import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";

import type { CandidateJob } from "../types";

export function formatSalary(min?: number, max?: number): string {
  const safeMin = typeof min === "number" && !isNaN(min) ? min : 0;
  const safeMax = typeof max === "number" && !isNaN(max) ? max : 0;

  if (safeMin === 0 && safeMax === 0) return "Competitive / Negotiable";
  if (safeMin > 0 && safeMax > 0) {
    if (safeMin === safeMax) return `$${safeMin.toLocaleString()}`;
    return `$${safeMin.toLocaleString()} - $${safeMax.toLocaleString()}`;
  }
  if (safeMin > 0 && safeMax === 0) return `From $${safeMin.toLocaleString()}`;
  if (safeMin === 0 && safeMax > 0) return `Up to $${safeMax.toLocaleString()}`;
  return "Competitive / Negotiable";
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week ago`;
  return date.toLocaleDateString();
}

export function mapCandidateJob(job: BackendJobDetails): CandidateJob {
  return {
    id: job._id,
    title: job.title,
    company: job.company,
    companyLogo: job.companyLogo || job.companyId?.logo || job.recruiterId?.profilePicture,
    location: job.location,
    type: job.employmentType,
    postedAt: new Date(job.createdAt).toLocaleDateString(),
  };
}
