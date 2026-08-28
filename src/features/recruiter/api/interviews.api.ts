import { axiosInstance } from "@/lib/axios";
import type {
  CreateInterviewPayload,
  Interview,
} from "../types/interview.types";

/**
 * Creates / schedules a new interview for an application.
 * POST /api/interviews
 */
export async function createInterview(
  payload: CreateInterviewPayload
): Promise<Interview> {
  const response = await axiosInstance.post("/interviews", payload);
  return response.data?.data;
}

/**
 * Retrieves all interview rounds for a specific application.
 * GET /api/interviews/application/:applicationId
 */
export async function getApplicationInterviews(
  applicationId: string
): Promise<Interview[]> {
  const response = await axiosInstance.get(
    `/interviews/application/${applicationId}`
  );
  const data = response.data?.data;
  return Array.isArray(data) ? data : [];
}

/**
 * Retrieves a paginated list of interviews for the authenticated user.
 * GET /api/interviews
 */
export async function getInterviews(params?: {
  page?: number;
  limit?: number;
  status?: string;
  jobId?: string;
  candidateId?: string;
  applicationId?: string;
  from?: string;
  to?: string;
}): Promise<{ items: Interview[]; pagination?: any }> {
  const response = await axiosInstance.get("/interviews", { params });
  const data = response.data?.data;
  return {
    items: Array.isArray(data) ? data : [],
    pagination: response.data?.pagination,
  };
}

/**
 * Retrieves a single interview by ID.
 * GET /api/interviews/:interviewId
 */
export async function getInterviewById(
  interviewId: string
): Promise<Interview> {
  const response = await axiosInstance.get(`/interviews/${interviewId}`);
  return response.data?.data;
}

/**
 * Candidate accepts an interview invitation.
 * PATCH /api/interviews/:interviewId/accept
 */
export async function acceptInterview(
  interviewId: string,
  payload?: { note?: string }
): Promise<Interview> {
  const response = await axiosInstance.patch(
    `/interviews/${interviewId}/accept`,
    payload ?? {}
  );
  return response.data?.data;
}

/**
 * Candidate declines an interview invitation.
 * PATCH /api/interviews/:interviewId/decline
 */
export async function declineInterview(
  interviewId: string,
  payload?: { note?: string }
): Promise<Interview> {
  const response = await axiosInstance.patch(
    `/interviews/${interviewId}/decline`,
    payload ?? {}
  );
  return response.data?.data;
}

