import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "@/features/auth/hooks/useAuth";

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
  const { token, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const processedEventsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const backendUrl = rawApiUrl.replace(/\/api\/?$/, "");

    const socket = io(backendUrl, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1500,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      // 1. Join recruiter-scoped ATS room
      socket.emit("join_ats_recruiter");

      // 2. If a specific jobId is provided, join that job's ATS room
      if (jobId) {
        socket.emit("join_ats_job", { jobId });
      }

      // 3. Reconnect synchronization: invalidate queries to reconcile with server state
      void queryClient.invalidateQueries({ queryKey: ["applications"] });
    });

    socket.on("application:status_changed", (data: AtsStatusChangedPayload) => {
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
    });

    return () => {
      if (jobId) {
        socket.emit("leave_ats_job", { jobId });
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, token, jobId, queryClient]);

  return socketRef;
}
