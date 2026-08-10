import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "@/features/auth/hooks/useAuth";
import { notificationService } from "../services/notificationService";
import type { NotificationItem } from "../types/notification";

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllRead: () => Promise<void>;
  refetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [_socket, setSocket] = useState<Socket | null>(null);

  // Initial Fetch of Notifications & Unread Count
  const refetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications({ limit: 30 });
      setNotifications(data.items || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch notifications feed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  // Dynamic Document Title Sync for Enterprise UX
  useEffect(() => {
    const baseTitle = document.title.replace(/^\(\d+\)\s*/, "");
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }, [unreadCount]);

  // Enterprise Web Audio Sound Chime
  const playNotificationSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 chime
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5 chime

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Ignore autoplay restriction errors before user interaction
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      refetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, token, refetchNotifications]);

  // Real-Time Socket.io Connection Setup
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setSocket((prev) => {
        if (prev) prev.disconnect();
        return null;
      });
      return;
    }

    const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const backendUrl = rawApiUrl.replace(/\/api\/?$/, "");

    const socketInstance = io(backendUrl, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketInstance.on("connect", () => {
      console.log("⚡ Real-time Notification Socket Connected.");
    });

    socketInstance.on("notification:new", (data: any) => {
      // Multi-tab synchronization event handling
      if (data?.event === "read_all") {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: true, isRead: true }))
        );
        setUnreadCount(0);
        return;
      }

      if (data?.event === "delete" && data?.id) {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== data.id && n._id !== data.id)
        );
        return;
      }

      if (data?.event === "clear_read") {
        setNotifications((prev) =>
          prev.filter((n) => !n.is_read && !n.isRead)
        );
        return;
      }

      if (data?.event === "read_single" || data?.isRead || data?.is_read) {
        const targetId = data?.id || data?._id;
        if (targetId) {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === targetId || n._id === targetId
                ? { ...n, is_read: true, isRead: true }
                : n
            )
          );
        }
        return;
      }

      // New Notification Event
      const newNotif = data as NotificationItem;
      const newId = newNotif.id || newNotif._id;

      setNotifications((prev) => {
        if (prev.some((n) => (n.id || n._id) === newId)) {
          return prev; // Deduplicate
        }
        return [newNotif, ...prev];
      });

      setUnreadCount((prev) => prev + 1);
      playNotificationSound();

      // Automatically refresh live application caches in real-time
      void queryClient.invalidateQueries({ queryKey: ["applications"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });

      // Trigger modern toast notification
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } pointer-events-auto flex w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 border border-slate-100`}
          >
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold">
                  🔔
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {newNotif.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {newNotif.body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    });

    socketInstance.on(
      "notification:unread_count",
      (payload: { unreadCount: number }) => {
        if (typeof payload?.unreadCount === "number") {
          setUnreadCount(payload.unreadCount);
        }
      }
    );

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [isAuthenticated, token]);

  const markAsRead = async (id: string) => {
    try {
      let wasUnread = false;
      setNotifications((prev) =>
        prev.map((item) => {
          if (item.id === id || item._id === id) {
            if (!item.is_read && !item.isRead) {
              wasUnread = true;
            }
            return { ...item, is_read: true, isRead: true };
          }
          return item;
        })
      );
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error("Error marking notification as read:", err);
      refetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, is_read: true, isRead: true }))
      );
      setUnreadCount(0);
      await notificationService.markAllAsRead();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      refetchNotifications();
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      setNotifications((prev) =>
        prev.filter((item) => item.id !== id && item._id !== id)
      );
      await notificationService.deleteNotification(id);
    } catch (err) {
      console.error("Error deleting notification:", err);
      refetchNotifications();
    }
  };

  const clearAllRead = async () => {
    try {
      setNotifications((prev) =>
        prev.filter((item) => !item.is_read && !item.isRead)
      );
      await notificationService.clearAllRead();
    } catch (err) {
      console.error("Error clearing read notifications:", err);
      refetchNotifications();
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllRead,
        refetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
