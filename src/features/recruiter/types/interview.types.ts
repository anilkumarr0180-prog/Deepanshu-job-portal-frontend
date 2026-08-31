export type InterviewMode = "video" | "in-person" | "phone";

export type InterviewStatus =
  | "scheduled"
  | "accepted"
  | "declined"
  | "reschedule_requested"
  | "rescheduled"
  | "completed"
  | "cancelled";

export type InterviewCandidateRsvpStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "reschedule_requested";

export interface CreateInterviewPayload {
  applicationId: string;
  roundNumber?: number;
  title?: string;
  type?: string;
  mode: InterviewMode;
  scheduledStartTime: string; // ISO 8601 string in the future
  durationMinutes?: number;
  timezone?: string;
  locationOrLink?: string;
  notes?: string;
}

export interface InterviewCandidateRsvp {
  status: InterviewCandidateRsvpStatus;
  respondedAt?: string;
  note?: string;
  suggestedTime?: string;
}

export interface InterviewFeedback {
  rating: number;
  notes: string;
  submittedAt: string;
  submittedBy: string;
}

export interface Interview {
  _id: string;
  applicationId:
    | string
    | {
        _id: string;
        status?: string;
        applicantId?: any;
        jobId?: any;
      };
  jobId:
    | string
    | {
        _id: string;
        title: string;
        companyId?: any;
      };
  candidateId:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        profilePicture?: string;
      };
  recruiterId:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  companyId?: string | { _id: string; name: string };
  roundNumber: number;
  title?: string;
  type?: string;
  mode: InterviewMode;
  scheduledStartTime: string;
  scheduledEndTime: string;
  durationMinutes: number;
  timezone: string;
  locationOrLink?: string;
  notes?: string;
  status: InterviewStatus;
  candidateRsvp?: InterviewCandidateRsvp;
  feedback?: InterviewFeedback;
  cancellationReason?: string;
  rescheduleReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationInterviewsResponse {
  success: boolean;
  data: Interview[];
}
