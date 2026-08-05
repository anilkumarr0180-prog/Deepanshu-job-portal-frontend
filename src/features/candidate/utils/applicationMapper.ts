import type { BackendCandidateApplication } from "../api/applications.api";
import type { CandidateApplication } from "../types";

function formatApplicationDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

export function mapCandidateApplication(
  application: BackendCandidateApplication
): CandidateApplication {
  return {
    id: application._id,
    role: application.jobId.title,
    company: application.jobId.company,
    location: application.jobId.location,
    status: application.status,
    appliedAt: formatApplicationDate(application.createdAt),
  };
}
