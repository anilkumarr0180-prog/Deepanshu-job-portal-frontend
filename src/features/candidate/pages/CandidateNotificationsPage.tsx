import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BellRing,
  CheckCheck,
  Trash2,
  Briefcase,
  FileText,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { useNotifications } from "@/shared/context/NotificationContext";
import type { NotificationType } from "@/shared/types/notification";
import { normalizeNotificationLink } from "@/shared/utils/normalizeRoute";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "JOB_ALERT":
      return <Briefcase className="h-5 w-5 text-blue-600" />;
    case "APPLICATION_UPDATE":
      return <FileText className="h-5 w-5 text-emerald-600" />;
    case "NEW_MESSAGE":
      return <MessageSquare className="h-5 w-5 text-indigo-600" />;
    case "SYSTEM_ALERT":
    default:
      return <AlertCircle className="h-5 w-5 text-amber-600" />;
  }
};

const formatTimeAgo = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export default function CandidateNotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllRead,
    isLoading,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<string>("ALL");

  const filteredNotifications = notifications.filter((item) => {
    const isRead = item.is_read || item.isRead;
    if (activeTab === "UNREAD") return !isRead;
    if (activeTab !== "ALL") return item.type === activeTab;
    return true;
  });

  const handleItemClick = async (id: string, link?: string, isRead?: boolean) => {
    if (!isRead) {
      await markAsRead(id);
    }
    const targetLink = normalizeNotificationLink(link, "candidate");
    if (targetLink) {
      navigate(targetLink);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Bell className="w-7 h-7 text-blue-600" />
              Notifications
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Track your application updates, job alerts, and real-time activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
              >
                <CheckCheck className="w-4 h-4 text-blue-600" />
                Mark all read
              </button>
            )}
            {notifications.some((n) => n.is_read || n.isRead) && (
              <button
                type="button"
                onClick={clearAllRead}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 shadow-xs transition"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                Clear read items
              </button>
            )}
            <div className="rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700">
              {unreadCount} Unread
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4 text-xs font-semibold">
          {[
            { id: "ALL", label: `All (${notifications.length})` },
            { id: "UNREAD", label: `Unread (${unreadCount})` },
            { id: "APPLICATION_UPDATE", label: "Applications" },
            { id: "JOB_ALERT", label: "Job Alerts" },
            { id: "SYSTEM_ALERT", label: "System Alerts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-3.5 py-2 transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Feed */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-sm font-medium text-slate-500">Loading your notifications...</p>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const itemId = notification.id || notification._id || "";
            const isRead = notification.is_read || notification.isRead;
            const createdAt = notification.created_at || notification.createdAt;

            return (
              <div
                key={itemId}
                onClick={() =>
                  handleItemClick(itemId, notification.link, isRead)
                }
                className={`group flex items-start gap-4 rounded-2xl border p-5 shadow-xs transition-all cursor-pointer ${
                  !isRead
                    ? "border-blue-200 bg-blue-50/40 hover:bg-blue-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xs border border-slate-100">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-bold ${
                          !isRead ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!isRead && (
                        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-700 uppercase tracking-wide">
                          New
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {formatTimeAgo(createdAt)}
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    {notification.body}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>{notification.type.replace("_", " ")}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(itemId);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <BellRing className="mx-auto h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Notifications</h3>
          <p className="mt-1 text-sm text-slate-500">
            You have no notifications in this category right now.
          </p>
        </div>
      )}
    </div>
  );
}
