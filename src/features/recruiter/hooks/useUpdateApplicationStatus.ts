import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateApplicationStatus } from "../api/applications.api";

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      interviewDetails,
    }: {
      id: string;
      status: string;
      interviewDetails?: any;
    }) => updateApplicationStatus(id, status, interviewDetails),

    onMutate: async ({ id, status }) => {
      // 1. Cancel any outgoing refetches so they don't overwrite optimistic updates
      await queryClient.cancelQueries({ queryKey: ["applications"] });
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });

      // 2. Snapshot previous cache values for exact rollback
      const previousAllApplications = queryClient.getQueryData(["applications", "all"]);
      const allApplicationQueries = queryClient.getQueriesData({ queryKey: ["applications"] });

      // 3. Optimistically update all matching application queries in cache
      queryClient.setQueriesData(
        { queryKey: ["applications"] },
        (oldData: any) => {
          if (!Array.isArray(oldData)) return oldData;
          return oldData.map((app: any) => {
            const appId = app._id || app.id;
            if (appId === id) {
              return { ...app, status };
            }
            return app;
          });
        }
      );

      return { previousAllApplications, allApplicationQueries };
    },

    onError: (error: any, _variables, context) => {
      // 4. Exact rollback to snapshot on failure
      if (context?.previousAllApplications) {
        queryClient.setQueryData(["applications", "all"], context.previousAllApplications);
      }
      if (context?.allApplicationQueries) {
        context.allApplicationQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      const message =
        error?.response?.data?.message || "Failed to update application status.";
      toast.error(message);
    },

    onSettled: () => {
      // 5. Reconcile cache with backend truth after mutation finishes
      void queryClient.invalidateQueries({ queryKey: ["applications"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    onSuccess: () => {
      toast.success("Application status updated successfully.");
    },
  });
}
