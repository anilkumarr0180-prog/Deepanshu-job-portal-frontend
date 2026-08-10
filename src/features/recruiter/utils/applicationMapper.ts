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
  const applicantObj =
    typeof application?.applicantId === "object" && application?.applicantId !== null
      ? application.applicantId
      : null;
  const candidateName = applicantObj?.name || "Candidate";
  const jobTitle =
    application?.jobTitle ||
    (typeof application?.jobId === "object" && application?.jobId !== null
      ? (application.jobId as any).title
      : "Job Application");

  return {
    id: application?._id || "",
    candidate: candidateName,
    job: jobTitle,
    experience: "N/A",
    skills: [],
    appliedDate: application?.createdAt ? formatDate(application.createdAt) : "Recently",
    status: normalizeApplicantStatus(application?.status || ""),
  };
}

export function mapRecruiterApplicant(
  application: BackendApplicationWithJob
): RecruiterApplicant {
  const applicantObj =
    typeof application?.applicantId === "object" && application?.applicantId !== null
      ? application.applicantId
      : null;
  const candidateName = applicantObj?.name || "Candidate";
  const jobTitle =
    application?.jobTitle ||
    (typeof application?.jobId === "object" && application?.jobId !== null
      ? (application.jobId as any).title
      : "Job Application");

  return {
    id: application?._id || "",
    candidate: candidateName,
    job: jobTitle,
    status: normalizeApplicantStatus(application?.status || ""),
    appliedDate: application?.createdAt ? formatDate(application.createdAt) : "Recently",
  };
}

export function mapApplicantDetails(
  application: BackendApplicationWithJob
): RecruiterApplicantDetails {
  const applicantObj =
    typeof application?.applicantId === "object" && application?.applicantId !== null
      ? application.applicantId
      : null;

  const candidateName = applicantObj?.name || "Candidate";
  const candidateEmail = applicantObj?.email || "N/A";
  const candidatePhone = applicantObj?.phone || "N/A";
  const jobTitle =
    application?.jobTitle ||
    (typeof application?.jobId === "object" && application?.jobId !== null
      ? (application.jobId as any).title
      : "Job Application");

  const resumeUrl =
    application?.resume || applicantObj?.resumeUrl || "";

  const resumeFileName = resumeUrl
    ? resumeUrl.split("/").pop()!.split("?")[0]
    : "";

  const resumeLabel = resumeFileName
    ? `${candidateName} — ${resumeFileName}`
    : "No resume uploaded";

  return {
    id: application?._id || "",
    candidate: candidateName,
    email: candidateEmail,
    phone: candidatePhone,
    location: "N/A",
    experience: "N/A",
    skills: [],
    education: [],
    portfolio: "N/A",
    coverLetter:
      application?.coverLetter || "No cover letter provided.",
    summary: "N/A",
    resumeLabel,
    notes: [],
    timeline: [
      {
        title: "Applied",
        detail: `Applied to ${jobTitle}`,
        date: application?.createdAt ? formatDate(application.createdAt) : "Recently",
      },
    ],
  };
}
