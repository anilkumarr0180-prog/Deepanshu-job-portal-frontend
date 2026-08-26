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

export interface BackendCandidateProfile {
  _id?: string;
  headline?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  skills?: string[];
  experienceYears?: number;
  noticePeriod?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface BackendApplication {
  _id: string;
  jobId: string;
  applicantId: BackendApplicant;
  candidateProfileId?: BackendCandidateProfile;
  applicantName?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  applicantDesignation?: string;
  experienceYears?: number;
  relevantSkills?: string[];
  noticePeriod?: string;
  resume: string;
  resumePublicId?: string;
  resumeFileName?: string;
  coverLetter?: string;
  interviewDetails?: {
    mode?: "video" | "in-person" | "phone";
    date?: string;
    time?: string;
    type?: string;
    locationOrLink?: string;
    notes?: string;
    timezone?: string;
  };
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
  const s = (status || "").trim().toLowerCase();
  switch (s) {
    case "applied":
    case "submitted":
      return "Applied";
    case "under review":
    case "under_review":
    case "reviewing":
      return "Under Review";
    case "shortlisted":
      return "Shortlisted";
    case "interview":
    case "interviewing":
      return "Interview";
    case "rejected":
      return "Rejected";
    case "hired":
      return "Hired";
    default:
      return "Applied";
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
  const candidateName = application?.applicantName || applicantObj?.name || "Candidate";
  const jobTitle =
    application?.jobTitle ||
    (typeof application?.jobId === "object" && application?.jobId !== null
      ? (application.jobId as any).title
      : "Job Application");

  const exp =
    typeof application?.experienceYears === "number" && application.experienceYears > 0
      ? `${application.experienceYears} Yrs`
      : "1-3 Yrs";

  return {
    id: application?._id || "",
    candidate: candidateName,
    job: jobTitle,
    experience: exp,
    skills: application?.relevantSkills || [],
    appliedDate: application?.createdAt ? formatDate(application.createdAt) : "Recently",
    status: normalizeApplicantStatus(application?.status || ""),
    interviewDetails: application?.interviewDetails,
  };
}

export function mapRecruiterApplicant(
  application: BackendApplicationWithJob
): RecruiterApplicant {
  const applicantObj =
    typeof application?.applicantId === "object" && application?.applicantId !== null
      ? application.applicantId
      : null;
  const candidateName = application?.applicantName || applicantObj?.name || "Candidate";
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

  const candidateProfile =
    typeof application?.candidateProfileId === "object" && application?.candidateProfileId !== null
      ? application.candidateProfileId
      : null;

  const candidateName = application?.applicantName || applicantObj?.name || "Candidate";
  const candidateEmail = application?.applicantEmail || applicantObj?.email || "Not Provided";
  const candidatePhone = application?.applicantPhone || applicantObj?.phone || "Not Provided";
  const candidateDesignation =
    application?.applicantDesignation || candidateProfile?.headline || "Job Applicant";

  const location =
    [candidateProfile?.city, candidateProfile?.state, candidateProfile?.country]
      .filter(Boolean)
      .join(", ") || "Remote / India";

  const expYears =
    typeof application?.experienceYears === "number" && application.experienceYears > 0
      ? application.experienceYears
      : candidateProfile?.experienceYears;

  const experience =
    typeof expYears === "number" && expYears > 0
      ? `${expYears} ${expYears === 1 ? "Year" : "Years"}`
      : "1-3 Years";

  const skills =
    application?.relevantSkills && application.relevantSkills.length > 0
      ? application.relevantSkills
      : candidateProfile?.skills || [];

  const jobTitle =
    application?.jobTitle ||
    (typeof application?.jobId === "object" && application?.jobId !== null
      ? (application.jobId as any).title
      : "Job Application");

  const resumeUrl =
    application?.resume || applicantObj?.resumeUrl || "";

  const resumeFileName = application?.resumeFileName || (resumeUrl
    ? resumeUrl.split("/").pop()!.split("?")[0]
    : "");

  const resumeLabel = resumeFileName
    ? `${candidateName} — ${resumeFileName}`
    : "No resume uploaded";

  return {
    id: application?._id || "",
    candidate: candidateName,
    email: candidateEmail,
    phone: candidatePhone,
    location,
    experience,
    skills,
    education: [],
    portfolio: candidateProfile?.portfolioUrl || "N/A",
    coverLetter:
      application?.coverLetter || "No cover letter provided.",
    summary: candidateDesignation,
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
