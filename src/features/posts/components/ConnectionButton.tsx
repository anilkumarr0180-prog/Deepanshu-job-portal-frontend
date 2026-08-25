import { useState, useRef, useEffect } from "react";
import { UserPlus, UserCheck, Clock, Loader2, MessageSquare, UserX, ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";
import { useConnectionStatus } from "../hooks/useConnectionStatus";
import { useConnectionMutations } from "../hooks/useConnectionMutations";
import type { ConnectionStatus } from "../types/connection.types";

interface ConnectionButtonProps {
  targetUserId: string;
  initialStatus?: ConnectionStatus;
  initialConnectionId?: string | null;
  size?: "sm" | "md" | "lg";
  showDirectMessage?: boolean;
  className?: string;
}

export default function ConnectionButton({
  targetUserId,
  initialStatus,
  initialConnectionId,
  size = "md",
  showDirectMessage = false,
  className = "",
}: ConnectionButtonProps) {
  const { user: currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUserId = currentUser?._id || currentUser?.id;
  const isSelf = Boolean(currentUserId && String(currentUserId) === String(targetUserId));

  const { data: statusData, isLoading: isLoadingStatus } = useConnectionStatus(
    targetUserId,
    !isSelf && !initialStatus
  );

  const { sendRequest, accept, reject, cancel, remove } = useConnectionMutations();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  if (isSelf) return null;

  const status: ConnectionStatus = statusData?.status || initialStatus || "none";
  const connectionId = statusData?.connectionId || initialConnectionId;

  const isPendingMutation =
    sendRequest.isPending ||
    accept.isPending ||
    reject.isPending ||
    cancel.isPending ||
    remove.isPending;

  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser?.role === "recruiter") {
      navigate(`/recruiter/messages?userId=${targetUserId}`);
    } else {
      navigate(`/candidate/messages?userId=${targetUserId}`);
    }
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1 rounded-lg",
    md: "px-3.5 py-1.5 text-xs sm:text-sm gap-1.5 rounded-xl",
    lg: "px-5 py-2.5 text-sm gap-2 rounded-xl",
  }[size];

  if (isLoadingStatus && !initialStatus) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center justify-center font-bold bg-slate-100 text-slate-400 ${sizeClasses} ${className}`}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>Loading...</span>
      </button>
    );
  }

  if (status === "none") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!isAuthenticated) return;
          sendRequest.mutate(targetUserId);
        }}
        disabled={isPendingMutation}
        className={`inline-flex items-center justify-center font-bold bg-[#3C65F5] text-white shadow-xs hover:bg-[#3457D5] transition active:scale-95 disabled:opacity-50 ${sizeClasses} ${className}`}
      >
        {sendRequest.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <UserPlus className="h-3.5 w-3.5" />
        )}
        <span>Connect</span>
      </button>
    );
  }

  if (status === "pending_sent") {
    return (
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen((prev) => !prev);
          }}
          disabled={isPendingMutation}
          className={`inline-flex items-center justify-center font-semibold border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition ${sizeClasses} ${className}`}
          title="Pending connection request - Click to manage"
        >
          {cancel.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Clock className="h-3.5 w-3.5 text-amber-600" />
          )}
          <span>Pending</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 z-30 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(false);
                if (connectionId) cancel.mutate(connectionId);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
            >
              <UserX className="h-3.5 w-3.5" />
              <span>Withdraw Request</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (status === "pending_received") {
    return (
      <div className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (connectionId) accept.mutate(connectionId);
          }}
          disabled={isPendingMutation}
          className={`inline-flex items-center justify-center font-bold bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 transition active:scale-95 disabled:opacity-50 ${sizeClasses}`}
        >
          {accept.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <UserCheck className="h-3.5 w-3.5" />
          )}
          <span>Accept</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (connectionId) reject.mutate(connectionId);
          }}
          disabled={isPendingMutation}
          className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition"
          title="Decline request"
        >
          {reject.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Ignore"}
        </button>
      </div>
    );
  }

  if (status === "connected") {
    return (
      <div className="inline-flex items-center gap-2">
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen((prev) => !prev);
            }}
            disabled={isPendingMutation}
            className={`inline-flex items-center justify-center font-bold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition ${sizeClasses}`}
          >
            {remove.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            )}
            <span>Connected</span>
            <ChevronDown className="h-3 w-3 text-emerald-600/70" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 z-30 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(false);
                  if (connectionId) remove.mutate(connectionId);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
              >
                <UserX className="h-3.5 w-3.5" />
                <span>Remove Connection</span>
              </button>
            </div>
          )}
        </div>

        {showDirectMessage && (
          <button
            type="button"
            onClick={handleMessageClick}
            className={`inline-flex items-center justify-center font-bold border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95 ${sizeClasses}`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-[#3C65F5]" />
            <span>Message</span>
          </button>
        )}
      </div>
    );
  }

  return null;
}
