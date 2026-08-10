import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { saveJobApi, removeSavedJobApi } from "../api/savedJobs.api";

export function useToggleSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, isCurrentlySaved }: { jobId: string; isCurrentlySaved: boolean }) => {
      if (isCurrentlySaved) {
        return await removeSavedJobApi(jobId);
      } else {
        return await saveJobApi(jobId);
      }
    },
    onSuccess: (saved, { jobId, isCurrentlySaved }) => {
      queryClient.setQueryData(["jobSavedStatus", jobId], saved);
      void queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
      void queryClient.invalidateQueries({ queryKey: ["jobSavedStatus", jobId] });

      if (isCurrentlySaved) {
        toast.success("Job removed from saved jobs.");
      } else {
        toast.success("🔖 Job saved to your bookmarks!");
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || "Failed to update saved job.";
      toast.error(message);
    },
  });
}
