import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateApplicationStatus } from "../api/applications.api";

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => updateApplicationStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["applications"] });
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });

      const previousApplications = queryClient.getQueryData(["applications", "all"]);

      queryClient.setQueriesData(
        { queryKey: ["applications"] },
        (oldData: any) => {
          if (!Array.isArray(oldData)) return oldData;
          return oldData.map((app: any) =>
            app.id === id || app._id === id ? { ...app, status } : app
          );
        }
      );

      return { previousApplications };
    },
    onError: (_error: unknown, _variables, context) => {
      if (context?.previousApplications) {
        queryClient.setQueryData(["applications", "all"], context.previousApplications);
      }
      toast.error("Failed to update application status.");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["applications"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onSuccess: () => {
      toast.success("Application status updated successfully.");
    },
  });
}
