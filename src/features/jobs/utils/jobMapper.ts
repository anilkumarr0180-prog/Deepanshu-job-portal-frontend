import type {
  RecruiterJob,
  RecruiterJobDetails,
  RecruiterJobStatus,
} from "@/features/recruiter/types";

export interface BackendJob {
  _id: string;
  title: string;
  location: string;
  employmentType: string;
  status: string;
  createdAt: string;
}

export interface BackendJobDetails extends BackendJob {
  company: string;
  experienceLevel: string;
  isFeatured?: boolean;

  salaryMin: number;
  salaryMax: number;

  description: string;
  skills: string[];
  updatedAt: string;
  recruiterId?: {
    _id: string;
    name?: string;
    email?: string;
  };
}

function normalizeStatus(status?: string): RecruiterJobStatus {
  if (!status) return "Draft";
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "Active";
    case "DRAFT":
      return "Draft";
    case "CLOSED":
      return "Closed";
    default:
      return "Draft";
  }
}

export function mapRecruiterJob(job: BackendJob): RecruiterJob {
  return {
    id: job._id,
    title: job.title || "Untitled Job",
    location: job.location || "Remote",
    type: job.employmentType || "Full-time",
    applicants: 0,
    status: normalizeStatus(job.status),
    postedDate: formatRelativeDate(job.createdAt),
  };
}

export function mapRecruiterJobDetails(
  job: BackendJobDetails
): RecruiterJobDetails {
  const salary = formatSalary(job.salaryMin, job.salaryMax);

  return {
    id: job._id,
    title: job.title || "Untitled Job",
    company: job.company || "Company",
    status: normalizeStatus(job.status),
    postedDate: formatRelativeDate(job.createdAt),
    lastUpdated: formatRelativeDate(job.updatedAt),
    employmentType: job.employmentType || "Full-time",
    experienceLevel: job.experienceLevel || "Mid Level",
    salary,
    location: job.location || "Remote",
    description: job.description
      ? job.description.split("\n\n")
      : [],
    skills: job.skills ?? [],
    stats: [],
    applicants: [],
  };
}

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

export function formatRelativeDate(dateString?: string): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Recently";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}