import React, { useState } from "react";
import { Phone, PhoneOff, User as UserIcon } from "lucide-react";
import type { CallState, ActiveCallData } from "../types/call.types";

interface IncomingCallModalProps {
  callState: CallState;
  activeCall: ActiveCallData | null;
  onAccept: () => void;
  onDecline: () => void;
  onCancel: () => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  callState,
  activeCall,
  onAccept,
  onDecline,
  onCancel,
}) => {
  const [isActionPending, setIsActionPending] = useState(false);

  // Only render modal for pre-connection states (Ringing, Calling, or their terminal rejections/timeouts)
  const isPreConnectionModalState =
    callState === "RINGING" ||
    callState === "CALLING" ||
    callState === "DECLINED" ||
    callState === "CANCELLED" ||
    callState === "MISSED" ||
    callState === "BUSY";

  if (!isPreConnectionModalState || !activeCall) return null;

  const { remoteUser, isOutgoing } = activeCall;

  const handleAction = (actionFn: () => void) => {
    if (isActionPending) return;
    setIsActionPending(true);
    actionFn();
    setTimeout(() => setIsActionPending(false), 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="incoming-call-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-white text-center p-6 sm:p-8">
        {/* Ambient background glow */}
        <div
          className={`absolute -top-24 -left-24 h-48 w-48 rounded-full blur-3xl ${
            isOutgoing ? "bg-blue-600/20" : "bg-emerald-600/20"
          }`}
        />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-indigo-600/20 blur-3xl" />

        {/* User Avatar with pulsing animation */}
        <div className="relative mx-auto mb-6 flex items-center justify-center">
          {callState === "RINGING" && (
            <>
              <span className="absolute h-28 w-28 rounded-full bg-emerald-500/20 animate-ping" />
              <span className="absolute h-24 w-24 rounded-full bg-emerald-500/30 animate-pulse" />
            </>
          )}

          {callState === "CALLING" && (
            <>
              <span className="absolute h-28 w-28 rounded-full bg-blue-500/20 animate-ping" />
              <span className="absolute h-24 w-24 rounded-full bg-blue-500/30 animate-pulse" />
            </>
          )}

          {remoteUser.profilePicture ? (
            <img
              src={remoteUser.profilePicture}
              alt={remoteUser.name || "User profile"}
              className="relative h-20 w-20 rounded-full object-cover border-2 border-slate-700 shadow-xl"
            />
          ) : (
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-2xl shadow-xl">
              {remoteUser.name ? remoteUser.name.charAt(0).toUpperCase() : <UserIcon className="h-9 w-9" />}
            </div>
          )}
        </div>

        {/* User Name & Call Status Title */}
        <h3 id="incoming-call-title" className="text-xl font-bold text-white tracking-tight truncate">
          {remoteUser.name || "JobBox User"}
        </h3>

        <p className="mt-1 text-xs text-slate-400 font-medium capitalize">
          {remoteUser.role ? `${remoteUser.role} • JobBox Audio Call` : "JobBox Audio Call"}
        </p>

        {/* State Indicators */}
        <div className="my-5 flex flex-col items-center justify-center" aria-live="polite">
          {callState === "RINGING" && (
            <div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              Incoming Audio Call...
            </div>
          )}

          {callState === "CALLING" && (
            <div className="flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              Calling...
            </div>
          )}

          {callState === "DECLINED" && (
            <div className="rounded-full bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-400 border border-rose-500/20">
              Call Declined
            </div>
          )}

          {callState === "CANCELLED" && (
            <div className="rounded-full bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-400 border border-slate-700">
              Call Cancelled
            </div>
          )}

          {callState === "MISSED" && (
            <div className="rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
              Missed Call
            </div>
          )}

          {callState === "BUSY" && (
            <div className="rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
              User is Busy on another call
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex items-center justify-center gap-4">
          {/* INCOMING RINGING: Accept and Decline Buttons */}
          {callState === "RINGING" && !isOutgoing && (
            <>
              <button
                type="button"
                onClick={() => handleAction(onDecline)}
                disabled={isActionPending}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition transform hover:scale-105 shadow-lg shadow-rose-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50"
                title="Decline audio call"
                aria-label="Decline audio call"
              >
                <PhoneOff className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={() => handleAction(onAccept)}
                disabled={isActionPending}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition transform hover:scale-105 shadow-lg shadow-emerald-600/30 animate-bounce focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50"
                title="Accept audio call"
                aria-label="Accept audio call"
              >
                <Phone className="h-6 w-6" />
              </button>
            </>
          )}

          {/* OUTGOING CALLING: Cancel Button */}
          {callState === "CALLING" && isOutgoing && (
            <button
              type="button"
              onClick={() => handleAction(onCancel)}
              disabled={isActionPending}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition transform hover:scale-105 shadow-lg shadow-rose-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50"
              title="Cancel audio call"
              aria-label="Cancel audio call"
            >
              <PhoneOff className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
