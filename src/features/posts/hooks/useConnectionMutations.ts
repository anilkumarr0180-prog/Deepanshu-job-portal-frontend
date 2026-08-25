import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  sendConnectionRequest,
  acceptConnection,
  rejectConnection,
  cancelConnectionRequest,
  removeConnection,
} from "../api/connectionApi";

export function useConnectionMutations() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    void queryClient.invalidateQueries({ queryKey: ["connections"] });
    void queryClient.invalidateQueries({ queryKey: ["connection-status"] });
    void queryClient.invalidateQueries({ queryKey: ["people-suggestions"] });
    void queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const sendRequest = useMutation({
    mutationFn: (recipientId: string) => sendConnectionRequest(recipientId),
    onSuccess: () => {
      toast.success("Connection request sent!");
      invalidateAll();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to send request.";
      toast.error(msg);
    },
  });

  const accept = useMutation({
    mutationFn: (connectionId: string) => acceptConnection(connectionId),
    onSuccess: () => {
      toast.success("Connection accepted!");
      invalidateAll();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to accept connection.";
      toast.error(msg);
    },
  });

  const reject = useMutation({
    mutationFn: (connectionId: string) => rejectConnection(connectionId),
    onSuccess: () => {
      toast.success("Connection request declined.");
      invalidateAll();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to decline request.";
      toast.error(msg);
    },
  });

  const cancel = useMutation({
    mutationFn: (connectionId: string) => cancelConnectionRequest(connectionId),
    onSuccess: () => {
      toast.success("Connection request cancelled.");
      invalidateAll();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to cancel request.";
      toast.error(msg);
    },
  });

  const remove = useMutation({
    mutationFn: (connectionId: string) => removeConnection(connectionId),
    onSuccess: () => {
      toast.success("Connection removed.");
      invalidateAll();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to remove connection.";
      toast.error(msg);
    },
  });

  return {
    sendRequest,
    accept,
    reject,
    cancel,
    remove,
  };
}