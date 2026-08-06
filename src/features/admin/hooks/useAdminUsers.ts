import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAdminUsers,
  blockAdminUser,
  unblockAdminUser,
  type AdminUserItem,
} from "../api/admin.api";

export interface NormalizedAdminUser extends AdminUserItem {
  status: "Active" | "Blocked";
  joinedAt: string;
}

export function useAdminUsers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: async () => {
      const response = await getAdminUsers(params);
      const data = response.data;

      const items: NormalizedAdminUser[] = (data.items ?? []).map((user) => ({
        ...user,
        status: user.isBlocked ? "Blocked" : "Active",
        joinedAt: new Date(user.createdAt).toLocaleDateString(),
      }));

      return {
        items,
        pagination: data.pagination ?? {
          page: 1,
          limit: 10,
          totalItems: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    },
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => blockAdminUser(userId),
    onSuccess: (data) => {
      toast.success(data.message || "User blocked successfully.");
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to block user.";
      toast.error(message);
    },
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => unblockAdminUser(userId),
    onSuccess: (data) => {
      toast.success(data.message || "User unblocked successfully.");
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to unblock user.";
      toast.error(message);
    },
  });
}
