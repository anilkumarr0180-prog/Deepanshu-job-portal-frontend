import React from "react";
import type { CallState, ActiveCallData } from "../types/call.types";
import { IncomingCallModal } from "./IncomingCallModal";
import { ActiveCallWidget } from "./ActiveCallWidget";

export interface CallModalProps {
  callState: CallState;
  activeCall: ActiveCallData | null;
  callDuration: number;
  isMuted: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onCancel: () => void;
  onEnd: () => void;
  onToggleMute: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  callState,
  activeCall,
  callDuration,
  isMuted,
  onAccept,
  onDecline,
  onCancel,
  onEnd,
  onToggleMute,
}) => {
  if (callState === "IDLE" || !activeCall) return null;

  return (
    <>
      {/* MODE 1: Prominent modal for Ringing (Incoming) & Calling (Outgoing) */}
      <IncomingCallModal
        callState={callState}
        activeCall={activeCall}
        onAccept={onAccept}
        onDecline={onDecline}
        onCancel={onCancel}
      />

      {/* MODE 2: Compact, non-blocking floating widget for Active Calls */}
      <ActiveCallWidget
        callState={callState}
        activeCall={activeCall}
        callDuration={callDuration}
        isMuted={isMuted}
        onEnd={onEnd}
        onToggleMute={onToggleMute}
      />
    </>
  );
};

export { IncomingCallModal, ActiveCallWidget };
export default CallModal;
