import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Briefcase,
  FileText,
  MessageSquare,
  AlertCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import type { NotificationType } from "../types/notification";
import useAuth from "@/features/auth/hooks/useAuth";
import { normalizeNotificationLink } from "../utils/normalizeRoute";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "JOB_ALERT":
      return <Briefcase className="w-4 h-4 text-blue-600" />;
    case "APPLICATION_UPDATE":
      return <FileText className="w-4 h-4 text-emerald-600" />;
    case "NEW_MESSAGE":
      return <MessageSquare className="w-4 h-4 text-indigo-600" />;
    case "SYSTEM_ALERT":
    default:
      return <AlertCircle className="w-4 h-4 text-amber-600" />;
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

export const NotificationDropdown: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } =
    useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredNotifications = notifications.filter((item) => {
    const isRead = item.is_read || item.isRead;
    if (filter === "unread") return !isRead;
    return true;
  });

  const handleNotificationClick = async (
    id: string,
    link?: string,
    isRead?: boolean
  ) => {
    if (!isRead) {
      await markAsRead(id);
    }
    setIsOpen(false);
    const targetLink = normalizeNotificationLink(link, user?.role);
    if (targetLink) {
      navigate(targetLink);
    }
  };

  const notificationPageLink =
    String(user?.role).toLowerCase() === "recruiter"
      ? "/recruiter/notifications"
      : "/candidate/notifications";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-extrabold text-white items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-slate-100 px-4 pt-2 gap-4 text-xs font-semibold">
            <button
              onClick={() => setFilter("all")}
              className={`pb-2 border-b-2 transition-colors ${
                filter === "all"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`pb-2 border-b-2 transition-colors ${
                filter === "unread"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notification Items List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="py-10 text-center text-slate-400">
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent mb-2" />
                <p className="text-xs font-medium text-slate-500">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-medium">No notifications right now</p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const itemId = item.id || item._id || "";
                const isRead = item.is_read || item.isRead;
                const createdAt = item.created_at || item.createdAt;

                return (
                  <div
                    key={itemId}
                    onClick={() =>
                      handleNotificationClick(itemId, item.link, isRead)
                    }
                    className={`flex items-start gap-3 p-3.5 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                      !isRead ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      {getNotificationIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`text-xs font-semibold truncate ${
                            !isRead ? "text-slate-900" : "text-slate-700"
                          }`}
                        >
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatTimeAgo(createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                        {item.body}
                      </p>
                    </div>
                    {!isRead && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Link */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              to={notificationPageLink}
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View Notification Center
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
