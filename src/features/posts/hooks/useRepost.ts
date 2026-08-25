import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { repostPost } from "../api/postApi";
import type { RepostPayload } from "../types/post.types";

export function useRepost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, payload }: { postId: string; payload?: RepostPayload }) =>
      repostPost(postId, payload),
    onSuccess: () => {
      toast.success("Post reposted to your network!");
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || "Failed to repost. Please try again.";
      toast.error(msg);
    },
  });
}