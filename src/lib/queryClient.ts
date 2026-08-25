import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

const handleGlobalError = (error: unknown) => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";

    // 401s are already handled by the Axios interceptor (which clears auth and redirects)
    if (status === 401) return;

    if (status === 429) {
      // Deduplicate rate-limit toast across multiple parallel queries
      toast.error(
        message || "Too many requests from this IP, please try again after 15 minutes.",
        { id: "rate-limit-error", duration: 4000 }
      );
      return;
    }

    // Deduplicate by message key to prevent duplicate stacked toasts
    toast.error(message, { id: `query-error-${message}` });
  } else if (error instanceof Error) {
    toast.error(error.message, { id: `query-error-${error.message}` });
  } else {
    toast.error("An unexpected error occurred.", { id: "query-error-unknown" });
  }
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleGlobalError,
  }),
  mutationCache: new MutationCache({
    onError: handleGlobalError,
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Never retry client errors (4xx), especially 429 rate limit errors
        if (isAxiosError(error)) {
          const status = error.response?.status;
          if (status && status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 1;
      },
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
