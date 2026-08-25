import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { reportApi } from "../api/reportApi";
import type { CreateReportPayload, ReportResponse } from "../types/post.types";

export function useReport() {
  return useMutation<ReportResponse, unknown, CreateReportPayload>({
    mutationFn: (payload: CreateReportPayload) => reportApi.submitReport(payload),
    onSuccess: (response) => {
      toast.success(response.message || "Thank you. Your report has been submitted.");
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError.response?.data?.message || "Failed to submit report. Please try again."
      );
    },
  });
}
