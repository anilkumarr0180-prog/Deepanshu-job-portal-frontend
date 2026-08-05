import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateProfile } from "../api/profile.api";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully.");
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError?.response?.data?.message ||
        "Failed to update profile. Please try again.";

      toast.error(message);
    },
  });
}
