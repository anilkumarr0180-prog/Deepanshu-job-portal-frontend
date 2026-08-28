import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createInterview } from "../api/interviews.api";
import type { CreateInterviewPayload, Interview } from "../types/interview.types";

/**
 * React Query mutation for creating and scheduling an interview.
 * Automatically manages cache invalidation and user feedback.
 */
export function useCreateInterview() {
  const queryClient = useQueryClient();

  return useMutation<Interview, any, CreateInterviewPayload>({
    mutationFn: (payload: CreateInterviewPayload) => createInterview(payload),

    onSuccess: (_newInterview, variables) => {
      // 1. Target invalidation for the application's multi-round interview list
      if (variables.applicationId) {
        void queryClient.invalidateQueries({
          queryKey: ["interviews", "application", variables.applicationId],
        });
      }

      // 2. Invalidate general interview schedule list
      void queryClient.invalidateQueries({
        queryKey: ["interviews"],
      });

      // 3. Invalidate applications list so applicant counts/statuses stay synchronized
      void queryClient.invalidateQueries({
        queryKey: ["applications"],
      });

      toast.success("Interview scheduled successfully.");
    },

    onError: (error: any) => {
      const status = error?.response?.status;
      const backendMessage = error?.response?.data?.message;

      let friendlyMessage = "Unable to schedule interview.";

      if (status === 401) {
        friendlyMessage = "Please sign in to schedule interviews.";
      } else if (status === 403) {
        friendlyMessage =
          backendMessage || "You're not authorized to schedule this interview.";
      } else if (status === 404) {
        friendlyMessage =
          backendMessage || "Application not found or no longer eligible.";
      } else if (status === 409) {
        friendlyMessage =
          backendMessage ||
          "Interview time conflict: Recruiter or candidate already has an interview scheduled in this window.";
      } else if (status === 422 || status === 400) {
        friendlyMessage = backendMessage || "Please check your interview details and try again.";
      } else if (backendMessage && typeof backendMessage === "string") {
        friendlyMessage = backendMessage;
      }

      toast.error(friendlyMessage);
    },
  });
}
