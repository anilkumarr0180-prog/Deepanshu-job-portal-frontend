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

function normalizeStatus(status: string): RecruiterJobStatus {
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
    title: job.title,
    location: job.location,
    type: job.employmentType,
    applicants: 0,
    status: normalizeStatus(job.status),
    postedDate: new Date(job.createdAt).toLocaleDateString(),
  };
}

export function mapRecruiterJobDetails(
  job: BackendJobDetails
): RecruiterJobDetails {
  const salary = `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;

  return {
    id: job._id,
    title: job.title,
    company: job.company,
    status: normalizeStatus(job.status),
    postedDate: new Date(job.createdAt).toLocaleDateString(),
    lastUpdated: new Date(job.updatedAt).toLocaleDateString(),
    employmentType: job.employmentType,
    experienceLevel: job.experienceLevel,
    salary,
    location: job.location,
    description: job.description
      ? job.description.split("\n\n")
      : [],
    skills: job.skills ?? [],
    stats: [],
    applicants: [],
  };
}

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