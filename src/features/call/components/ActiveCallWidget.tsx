import React, { useState } from "react";
import { PhoneOff, Mic, MicOff, User as UserIcon } from "lucide-react";
import type { CallState, ActiveCallData } from "../types/call.types";

interface ActiveCallWidgetProps {
  callState: CallState;
  activeCall: ActiveCallData | null;
  callDuration: number;
  isMuted: boolean;
  onEnd: () => void;
  onToggleMute: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export const ActiveCallWidget: React.FC<ActiveCallWidgetProps> = ({
  callState,
  activeCall,
  callDuration,
  isMuted,
  onEnd,
  onToggleMute,
}) => {
  const [isEnding, setIsEnding] = useState(false);

  // Render when call is negotiating/accepted/connected or briefly showing active terminal feedback
  const isActiveCallState =
    callState === "ACCEPTED" ||
    callState === "CONNECTING" ||
    callState === "CONNECTED" ||
    callState === "ENDED" ||
    callState === "FAILED";

  if (!isActiveCallState || !activeCall) return null;

  const { remoteUser } = activeCall;

  const handleEndCall = () => {
    if (isEnding) return;
    setIsEnding(true);
    onEnd();
    setTimeout(() => setIsEnding(false), 800);
  };

  return (
    <div
      role="region"
      aria-label="Active Call Controller"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-2rem)] sm:max-w-md w-auto animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="flex items-center gap-3.5 rounded-2xl sm:rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-3 sm:px-4 sm:py-3 text-white backdrop-blur-xl ring-1 ring-white/10">
        {/* User Avatar with pulsing status */}
        <div className="relative shrink-0 flex items-center justify-center">
          {(callState === "ACCEPTED" || callState === "CONNECTING") && (
            <span className="absolute -inset-1 rounded-full bg-indigo-500/30 animate-pulse" />
          )}

          {remoteUser.profilePicture ? (
            <img
              src={remoteUser.profilePicture}
              alt={remoteUser.name || "Participant"}
              className="relative h-11 w-11 rounded-full object-cover border border-slate-700 shadow"
            />
          ) : (
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base shadow">
              {remoteUser.name ? remoteUser.name.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />}
            </div>
          )}

          {/* Active status indicator dot */}
          {callState === "CONNECTED" && (
            <span
              className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 border-2 border-slate-900"
              title="Call Active"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </span>
          )}
        </div>

        {/* Participant Details & Status */}
        <div className="min-w-0 flex-1 pr-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white tracking-tight truncate max-w-[120px] sm:max-w-[160px]">
              {remoteUser.name || "JobBox User"}
            </h4>
            {remoteUser.role && (
              <span className="text-[10px] font-medium text-slate-400 capitalize truncate hidden sm:inline">
                • {remoteUser.role}
              </span>
            )}
          </div>

          <div className="mt-0.5 flex items-center gap-2" aria-live="polite">
            {(callState === "ACCEPTED" || callState === "CONNECTING") && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                Connecting Audio...
              </span>
            )}

            {callState === "CONNECTED" && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Call Connected
                </span>
                <span className="font-mono text-xs font-bold text-white bg-slate-800/90 px-2 py-0.5 rounded-md border border-slate-700/60 shadow-inner">
                  {formatDuration(callDuration)}
                </span>
              </div>
            )}

            {callState === "ENDED" && (
              <span className="text-xs font-semibold text-slate-400">Call Ended</span>
            )}

            {callState === "FAILED" && (
              <span className="text-xs font-semibold text-rose-400">Call Failed</span>
            )}
          </div>
        </div>

        {/* Controls: Mute Toggle & Hang Up */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mute/Unmute */}
          {(callState === "CONNECTED" || callState === "ACCEPTED" || callState === "CONNECTING") && (
            <button
              type="button"
              onClick={onToggleMute}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition transform hover:scale-105 active:scale-95 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                isMuted
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60"
              }`}
              title={isMuted ? "Unmute microphone" : "Mute microphone"}
              aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}

          {/* End Call */}
          <button
            type="button"
            onClick={handleEndCall}
            disabled={isEnding}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition transform hover:scale-105 shadow-lg shadow-rose-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50"
            title="End call"
            aria-label="End call"
          >
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveCallWidget;
