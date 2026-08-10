import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

const handleGlobalError = (error: unknown) => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message || error.message || "An unexpected error occurred.";
    // 401s are already handled by the Axios interceptor (which clears auth and redirects)
    if (error.response?.status !== 401) {
      toast.error(message);
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("An unexpected error occurred.");
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
      retry: 1,
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});