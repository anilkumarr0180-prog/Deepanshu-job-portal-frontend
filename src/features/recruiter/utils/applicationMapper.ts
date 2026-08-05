import type {
  RecruiterApplicant,
  RecruiterApplicantDetails,
  RecruiterApplicantRecord,
  RecruiterApplicantStatus,
} from "../types";

export interface BackendApplicant {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
}

export interface BackendApplication {
  _id: string;
  jobId: string;
  applicantId: BackendApplicant;
  resume: string;
  coverLetter?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendApplicationWithJob extends BackendApplication {
  jobTitle: string;
}

export function normalizeApplicantStatus(
  status: string
): RecruiterApplicantStatus {
  switch (status) {
    case "Applied":
      return "Pending";

    case "Shortlisted":
      return "Shortlisted";

    case "Interview":
      return "Interview";

    case "Rejected":
      return "Rejected";

    case "Hired":
      return "Hired";

    default:
      return "Pending";
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

export function mapApplicantRecord(
  application: BackendApplicationWithJob
): RecruiterApplicantRecord {
  return {
    id: application._id,
    candidate: application.applicantId.name,
    job: application.jobTitle,
    experience: "N/A",
    skills: [],
    appliedDate: formatDate(application.createdAt),
    status: normalizeApplicantStatus(application.status),
  };
}

export function mapRecruiterApplicant(
  application: BackendApplicationWithJob
): RecruiterApplicant {
  return {
    id: application._id,
    candidate: application.applicantId.name,
    job: application.jobTitle,
    status: normalizeApplicantStatus(application.status),
    appliedDate: formatDate(application.createdAt),
  };
}

export function mapApplicantDetails(
  application: BackendApplicationWithJob
): RecruiterApplicantDetails {
  const resumeUrl =
    application.resume || application.applicantId.resumeUrl || "";

  const resumeFileName = resumeUrl
    ? resumeUrl.split("/").pop()!.split("?")[0]
    : "";

  const resumeLabel = resumeFileName
    ? `${application.applicantId.name} — ${resumeFileName}`
    : "No resume uploaded";

  return {
    id: application._id,
    candidate: application.applicantId.name,
    email: application.applicantId.email,
    phone: application.applicantId.phone ?? "N/A",
    location: "N/A",
    experience: "N/A",
    skills: [],
    education: [],
    portfolio: "N/A",
    coverLetter:
      application.coverLetter || "No cover letter provided.",
    summary: "N/A",
    resumeLabel,
    notes: [],
    timeline: [
      {
        title: "Applied",
        detail: `Applied to ${application.jobTitle}`,
        date: formatDate(application.createdAt),
      },
    ],
  };
}
