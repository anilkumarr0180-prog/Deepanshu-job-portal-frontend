import { axiosInstance } from "@/lib/axios";
import type { CreateReportPayload, ReportResponse } from "../types/post.types";

export const reportApi = {
  submitReport: async (payload: CreateReportPayload) => {
    const response = await axiosInstance.post<ReportResponse>("/reports", payload);
    return response.data;
  },
};
