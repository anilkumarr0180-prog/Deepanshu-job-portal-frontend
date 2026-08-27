import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "@/features/auth/hooks/useAuth";
import { useRealtime } from "@/shared/context/RealtimeContext";

export interface AtsStatusChangedPayload {
  applicationId: string;
  jobId: string;
  companyId?: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  updatedAt: string;
  metadata?: any;
}

export function useAtsRealtimeSync(jobId?: string) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { socket, joinAtsRecruiter, joinAtsJob, leaveAtsJob } = useRealtime();
  const processedEventsRef = useRef<Set<string>>(new Set());
  const socketRef = useRef(socket);
  socketRef.current = socket;

  // 1. Join ATS Rooms via RealtimeContext
  useEffect(() => {
    if (!isAuthenticated) return;

    // Join recruiter room
    joinAtsRecruiter();

    // If specific job is selected, join that job room
    if (jobId) {
      joinAtsJob(jobId);
      return () => {
        leaveAtsJob(jobId);
      };
    }
  }, [isAuthenticated, jobId, joinAtsRecruiter, joinAtsJob, leaveAtsJob]);

  // 2. Listen to application:status_changed events on shared socket
  useEffect(() => {
    if (!socket || !isAuthenticated) return;

    const handleStatusChanged = (data: AtsStatusChangedPayload) => {
      if (!data || !data.applicationId || !data.toStatus) return;

      // Duplicate event deduplication
      const eventKey = `${data.applicationId}:${data.toStatus}:${data.updatedAt || ""}`;
      if (processedEventsRef.current.has(eventKey)) {
        return;
      }
      processedEventsRef.current.add(eventKey);

      // Clean up old events from memory
      if (processedEventsRef.current.size > 200) {
        processedEventsRef.current.clear();
      }

      // Reconcile React Query cache optimistically
      queryClient.setQueriesData(
        { queryKey: ["applications"] },
        (oldData: any) => {
          if (!Array.isArray(oldData)) return oldData;
          return oldData.map((app: any) => {
            const appId = app._id || app.id;
            if (appId === data.applicationId) {
              return {
                ...app,
                status: data.toStatus,
                ...(data.metadata?.interviewDetails
                  ? { interviewDetails: data.metadata.interviewDetails }
                  : {}),
              };
            }
            return app;
          });
        }
      );

      // Invalidate queries in background to guarantee absolute consistency with DB
      void queryClient.invalidateQueries({ queryKey: ["applications"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    };

    socket.on("application:status_changed", handleStatusChanged);

    return () => {
      socket.off("application:status_changed", handleStatusChanged);
    };
  }, [socket, isAuthenticated, queryClient]);

  return socketRef;
}

export default useAtsRealtimeSync;
