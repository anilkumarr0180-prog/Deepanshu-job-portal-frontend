import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  getMyCompany,
  updateMyCompany,
  createCompany,
  type CompanyResponse,
} from "../api/company.api";

export function useCompany() {
  return useQuery<CompanyResponse | null>({
    queryKey: ["company", "me"],
    queryFn: getMyCompany,
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyCompany,
    onSuccess: (data) => {
      toast.success("Company profile updated successfully.");
      queryClient.setQueryData(["company", "me"], data);
      void queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError.response?.data?.message || "Failed to update company profile."
      );
    },
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCompany,
    onSuccess: (data) => {
      toast.success("Company profile created successfully.");
      queryClient.setQueryData(["company", "me"], data);
      void queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError.response?.data?.message || "Failed to create company profile."
      );
    },
  });
}
