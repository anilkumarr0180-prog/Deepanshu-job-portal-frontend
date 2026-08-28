import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { acceptInterview, declineInterview } from "@/features/recruiter/api/interviews.api";
import type { Interview } from "@/features/recruiter/types/interview.types";

export function useCandidateInterviewRsvp() {
  const queryClient = useQueryClient();

  const acceptMutation = useMutation<Interview, any, { interviewId: string; note?: string }>({
    mutationFn: ({ interviewId, note }) => acceptInterview(interviewId, { note }),
    onSuccess: (updatedInterview) => {
      toast.success("Interview accepted! The recruiter has been notified.");
      const appId =
        typeof updatedInterview.applicationId === "object"
          ? (updatedInterview.applicationId as any)?._id || (updatedInterview.applicationId as any)?.id
          : updatedInterview.applicationId;

      if (appId) {
        void queryClient.invalidateQueries({ queryKey: ["interviews", "application", appId] });
      }
      void queryClient.invalidateQueries({ queryKey: ["interviews"] });
      void queryClient.invalidateQueries({ queryKey: ["applications"] });
      void queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      let message = error?.response?.data?.message;

      if (!message) {
        switch (status) {
          case 401:
            message = "Please sign in to respond to the interview.";
            break;
          case 403:
            message = "You are not authorized to respond to this interview.";
            break;
          case 404:
            message = "Interview is no longer available.";
            break;
          case 409:
            message = "Interview has already been updated or is in a finalized state.";
            break;
          case 422:
            message = "Invalid interview response request.";
            break;
          default:
            message = "Unable to respond to interview. Please try again.";
        }
      }
      toast.error(message);
    },
  });

  const declineMutation = useMutation<Interview, any, { interviewId: string; note?: string }>({
    mutationFn: ({ interviewId, note }) => declineInterview(interviewId, { note }),
    onSuccess: (updatedInterview) => {
      toast.success("Interview declined. The recruiter has been notified.");
      const appId =
        typeof updatedInterview.applicationId === "object"
          ? (updatedInterview.applicationId as any)?._id || (updatedInterview.applicationId as any)?.id
          : updatedInterview.applicationId;

      if (appId) {
        void queryClient.invalidateQueries({ queryKey: ["interviews", "application", appId] });
      }
      void queryClient.invalidateQueries({ queryKey: ["interviews"] });
      void queryClient.invalidateQueries({ queryKey: ["applications"] });
      void queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      let message = error?.response?.data?.message;

      if (!message) {
        switch (status) {
          case 401:
            message = "Please sign in to respond to the interview.";
            break;
          case 403:
            message = "You are not authorized to respond to this interview.";
            break;
          case 404:
            message = "Interview is no longer available.";
            break;
          case 409:
            message = "Interview has already been updated or is in a finalized state.";
            break;
          case 422:
            message = "Invalid interview response request.";
            break;
          default:
            message = "Unable to respond to interview. Please try again.";
        }
      }
      toast.error(message);
    },
  });

  return {
    acceptMutation,
    declineMutation,
    isPending: acceptMutation.isPending || declineMutation.isPending,
  };
}
