import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { useRealtime } from "@/shared/context/RealtimeContext";
import type { CallState, ActiveCallData, CallUser } from "../types/call.types";
import { WebRTCCallService } from "../services/webrtc.service";
import CallModal from "../components/CallModal";

interface CallContextValue {
  callState: CallState;
  activeCall: ActiveCallData | null;
  callDuration: number;
  isMuted: boolean;
  initiateCall: (conversationId: string, partner: CallUser) => void;
  acceptCall: () => void;
  declineCall: () => void;
  cancelCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
}

const CallContext = createContext<CallContextValue | undefined>(undefined);

// Web Audio synthesizer for pleasant ringing & ringback tone
class AudioToneGenerator {
  private ctx: AudioContext | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;

  private getAudioContext(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        void this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  playRingback() {
    this.stop();
    const playBeep = () => {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    };

    playBeep();
    this.timer = setInterval(playBeep, 3000);
  }

  playRingtone() {
    this.stop();
    const playChime = () => {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 0.4);
      });
    };

    playChime();
    this.timer = setInterval(playChime, 2500);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

const toneGenerator = new AudioToneGenerator();

export const CallProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { socket } = useRealtime();

  const [callState, setCallState] = useState<CallState>("IDLE");
  const [activeCall, setActiveCall] = useState<ActiveCallData | null>(null);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const activeCallRef = useRef<ActiveCallData | null>(null);
  activeCallRef.current = activeCall;

  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const connectingWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processedOfferCallIdRef = useRef<string | null>(null);
  const processedAnswerCallIdRef = useRef<string | null>(null);
  const webrtcServiceRef = useRef<WebRTCCallService | null>(null);

  // Clean teardown helper (Idempotent & Safe)
  const resetCallSession = useCallback((nextState: CallState = "IDLE", delayMs = 1500) => {
    toneGenerator.stop();
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
    if (connectingWatchdogRef.current) {
      clearTimeout(connectingWatchdogRef.current);
      connectingWatchdogRef.current = null;
    }
    processedOfferCallIdRef.current = null;
    processedAnswerCallIdRef.current = null;

    if (webrtcServiceRef.current) {
      webrtcServiceRef.current.cleanup();
      webrtcServiceRef.current = null;
    }

    if (nextState === "IDLE") {
      setCallState("IDLE");
      setActiveCall(null);
      setCallDuration(0);
      setIsMuted(false);
    } else {
      setCallState(nextState);
      setTimeout(() => {
        setCallState("IDLE");
        setActiveCall(null);
        setCallDuration(0);
        setIsMuted(false);
      }, delayMs);
    }
  }, []);

  // Helper to get or instantiate the WebRTC service
  const getOrCreateWebRTCService = useCallback(() => {
    if (!webrtcServiceRef.current) {
      webrtcServiceRef.current = new WebRTCCallService({
        onIceCandidate: (candidate) => {
          if (socket?.connected && activeCallRef.current?.callId) {
            socket.emit("call:ice_candidate", {
              callId: activeCallRef.current.callId,
              candidate,
            });
          }
        },
        onConnectionStateChange: (state) => {
          if (state === "connected") {
            toneGenerator.stop();
            if (connectingWatchdogRef.current) {
              clearTimeout(connectingWatchdogRef.current);
              connectingWatchdogRef.current = null;
            }
            setCallState("CONNECTED");
            if (!durationTimerRef.current) {
              setCallDuration(0);
              durationTimerRef.current = setInterval(() => {
                setCallDuration((prev) => prev + 1);
              }, 1000);
            }
          } else if (state === "failed") {
            toast.error("Audio connection failed.");
            if (socket?.connected && activeCallRef.current?.callId) {
              socket.emit("call:failed", {
                callId: activeCallRef.current.callId,
                reason: "webrtc_failed",
              });
            }
            resetCallSession("FAILED", 2000);
          }
        },
        onError: (err) => {
          console.error("WebRTC Error:", err);
          toast.error(err.message || "WebRTC connection error.");
          if (socket?.connected && activeCallRef.current?.callId) {
            socket.emit("call:failed", {
              callId: activeCallRef.current.callId,
              reason: "webrtc_error",
            });
          }
          resetCallSession("FAILED", 2000);
        },
      });
    }
    return webrtcServiceRef.current;
  }, [socket, resetCallSession]);

  // Outgoing Actions
  const initiateCall = useCallback(
    (conversationId: string, partner: CallUser) => {
      if (!socket?.connected) {
        toast.error("Realtime connection unavailable. Please wait.");
        return;
      }

      if (callState !== "IDLE") {
        toast.error("You are already in a call.");
        return;
      }

      const optimisticCallData: ActiveCallData = {
        callId: "",
        conversationId,
        remoteUser: partner,
        isOutgoing: true,
        startedAt: new Date(),
      };

      setActiveCall(optimisticCallData);
      setCallState("CALLING");
      toneGenerator.playRingback();

      socket.emit("call:initiate", { conversationId });
    },
    [socket, callState]
  );

  const acceptCall = useCallback(async () => {
    if (!socket?.connected || !activeCall?.callId) return;

    toneGenerator.stop();
    setCallState("ACCEPTED");

    try {
      // Callee acquires local microphone upon clicking Accept
      const rtcService = getOrCreateWebRTCService();
      await rtcService.acquireLocalMedia();
      await rtcService.initPeerConnection();

      socket.emit("call:accept", { callId: activeCall.callId });
    } catch (err: any) {
      toast.error(err.message || "Failed to acquire microphone.");
      socket.emit("call:reject", { callId: activeCall.callId, reason: "declined" });
      resetCallSession("FAILED", 2000);
    }
  }, [socket, activeCall, getOrCreateWebRTCService, resetCallSession]);

  const declineCall = useCallback(() => {
    if (!socket?.connected || !activeCall?.callId) return;

    socket.emit("call:reject", { callId: activeCall.callId, reason: "declined" });
    resetCallSession("DECLINED", 1000);
  }, [socket, activeCall, resetCallSession]);

  const cancelCall = useCallback(() => {
    if (!socket?.connected || !activeCall?.callId) return;

    socket.emit("call:cancel", { callId: activeCall.callId });
    resetCallSession("CANCELLED", 800);
  }, [socket, activeCall, resetCallSession]);

  const endCall = useCallback(() => {
    if (!socket?.connected || !activeCall?.callId) return;

    socket.emit("call:end", { callId: activeCall.callId });
    resetCallSession("ENDED", 1200);
  }, [socket, activeCall, resetCallSession]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (webrtcServiceRef.current) {
        webrtcServiceRef.current.setMuted(next);
      }
      return next;
    });
  }, []);

  // Socket Event Listeners for Call Signaling & WebRTC Offer/Answer/ICE
  useEffect(() => {
    if (!socket) return;

    // 1. Ringing acknowledged for Caller
    const handleCallRinging = (data: {
      callId: string;
      conversationId: string;
      callee: CallUser;
    }) => {
      setActiveCall((prev) => ({
        callId: data.callId,
        conversationId: data.conversationId,
        remoteUser: data.callee || prev?.remoteUser || { id: "" },
        isOutgoing: true,
        startedAt: new Date(),
      }));
      setCallState("CALLING");
      toneGenerator.playRingback();
    };

    // 2. Incoming call received by Callee
    const handleCallIncoming = (data: {
      callId: string;
      conversationId: string;
      caller: CallUser;
    }) => {
      // Auto-reject if already busy in an ongoing call
      if (activeCallRef.current?.callId && activeCallRef.current.callId !== data.callId) {
        socket.emit("call:reject", { callId: data.callId, reason: "busy" });
        return;
      }

      setActiveCall({
        callId: data.callId,
        conversationId: data.conversationId,
        remoteUser: data.caller,
        isOutgoing: false,
        startedAt: new Date(),
      });
      setCallState("RINGING");
      toneGenerator.playRingtone();
    };

    // 3. Call Accepted: Caller initiates WebRTC SDP Offer
    const handleCallAccepted = async (data: { callId: string; caller?: CallUser; callee?: CallUser }) => {
      const currentCall = activeCallRef.current;
      if (currentCall?.callId && data.callId && currentCall.callId !== data.callId) {
        return; // Ignore stale call acceptance
      }

      toneGenerator.stop();
      
      // Arm watchdog timer for connection timeout (15 seconds)
      if (connectingWatchdogRef.current) clearTimeout(connectingWatchdogRef.current);
      connectingWatchdogRef.current = setTimeout(() => {
        toast.error("Audio connection timed out.");
        if (socket?.connected && (data.callId || currentCall?.callId)) {
          socket.emit("call:failed", {
            callId: data.callId || currentCall?.callId,
            reason: "connection_timeout",
          });
        }
        resetCallSession("FAILED", 2000);
      }, 15000);

      // If this client is the Caller (outgoing call), generate and send SDP Offer
      if (currentCall && currentCall.isOutgoing) {
        setCallState("CONNECTING");
        try {
          const rtcService = getOrCreateWebRTCService();
          await rtcService.acquireLocalMedia();
          await rtcService.initPeerConnection();
          const offerSdp = await rtcService.createOffer();

          socket.emit("call:offer", {
            callId: data.callId || currentCall.callId,
            sdp: offerSdp,
          });
        } catch (err: any) {
          toast.error(err.message || "Failed to acquire microphone for call.");
          socket.emit("call:failed", {
            callId: data.callId || currentCall.callId,
            reason: "media_denied",
          });
          resetCallSession("FAILED", 2000);
        }
      } else {
        setCallState("CONNECTING");
      }
    };

    // 4. Callee receives SDP Offer from Caller -> generates SDP Answer
    const handleCallOffer = async (data: { callId: string; sdp: RTCSessionDescriptionInit }) => {
      if (!data.callId || !data.sdp) return;
      if (activeCallRef.current?.callId && activeCallRef.current.callId !== data.callId) {
        return; // Ignore stale offer
      }

      // Ignore duplicate SDP Offers for the same callId session
      if (processedOfferCallIdRef.current === data.callId) {
        return;
      }
      processedOfferCallIdRef.current = data.callId;

      try {
        setCallState("CONNECTING");
        const rtcService = getOrCreateWebRTCService();
        const answerSdp = await rtcService.handleOfferAndCreateAnswer(data.sdp);

        socket.emit("call:answer", {
          callId: data.callId,
          sdp: answerSdp,
        });
      } catch (err: any) {
        console.error("Error processing SDP Offer:", err);
        toast.error("Failed to establish audio connection.");
        socket.emit("call:failed", { callId: data.callId, reason: "offer_processing_error" });
        resetCallSession("FAILED", 2000);
      }
    };

    // 5. Caller receives SDP Answer from Callee
    const handleCallAnswer = async (data: { callId: string; sdp: RTCSessionDescriptionInit }) => {
      if (!data.callId || !data.sdp) return;
      if (activeCallRef.current?.callId && activeCallRef.current.callId !== data.callId) {
        return; // Ignore stale answer
      }

      // Ignore duplicate SDP Answers for the same callId session
      if (processedAnswerCallIdRef.current === data.callId) {
        return;
      }
      processedAnswerCallIdRef.current = data.callId;

      try {
        const rtcService = getOrCreateWebRTCService();
        await rtcService.handleAnswer(data.sdp);
      } catch (err: any) {
        console.error("Error processing SDP Answer:", err);
        toast.error("Failed to complete audio connection.");
        socket.emit("call:failed", { callId: data.callId, reason: "answer_processing_error" });
        resetCallSession("FAILED", 2000);
      }
    };

    // 6. Incoming ICE Candidate
    const handleIceCandidate = async (data: { callId: string; candidate: RTCIceCandidateInit }) => {
      if (!data.callId || !data.candidate) return;
      if (activeCallRef.current?.callId && activeCallRef.current.callId !== data.callId) {
        return; // Ignore candidate from previous call
      }
      if (webrtcServiceRef.current) {
        await webrtcServiceRef.current.addIceCandidate(data.candidate);
      }
    };

    // 7. Call Rejected / Busy / Missed
    const handleCallRejected = (data: {
      callId?: string;
      reason: string;
      message?: string;
    }) => {
      if (data.callId && activeCallRef.current?.callId && data.callId !== activeCallRef.current.callId) {
        return; // Ignore stale rejection
      }
      toneGenerator.stop();
      if (data.reason === "busy") {
        toast.error(data.message || "User is currently on another call.");
        resetCallSession("BUSY", 2000);
      } else if (data.reason === "missed") {
        toast.error("Call was not answered.");
        resetCallSession("MISSED", 2000);
      } else {
        toast.error(data.message || "Call was declined.");
        resetCallSession("DECLINED", 1500);
      }
    };

    // 8. Call Cancelled by Caller
    const handleCallCancelled = (data: { callId?: string; reason?: string }) => {
      if (data.callId && activeCallRef.current?.callId && data.callId !== activeCallRef.current.callId) {
        return; // Ignore stale cancellation
      }
      toneGenerator.stop();
      if (data.reason === "missed") {
        toast("Missed audio call", { icon: "📞" });
      }
      resetCallSession("CANCELLED", 1000);
    };

    // 9. Call Ended
    const handleCallEnded = (data: { callId?: string; durationSeconds?: number }) => {
      if (data.callId && activeCallRef.current?.callId && data.callId !== activeCallRef.current.callId) {
        return; // Ignore stale end
      }
      toneGenerator.stop();
      toast(`Call ended (${data.durationSeconds || 0}s)`, { icon: "📴" });
      resetCallSession("ENDED", 1200);
    };

    // 10. Call Failed (Synchronized failure notification from peer/server)
    const handleCallFailed = (data: { callId?: string; reason?: string; message?: string }) => {
      if (data.callId && activeCallRef.current?.callId && data.callId !== activeCallRef.current.callId) {
        return;
      }
      toneGenerator.stop();
      toast.error(data.message || "Call connection failed.");
      resetCallSession("FAILED", 1500);
    };

    // 11. Call Accepted elsewhere on another tab
    const handleAcceptedElsewhere = () => {
      resetCallSession("IDLE", 0);
    };

    // 12. General Call Error
    const handleCallError = (data: { message: string }) => {
      toneGenerator.stop();
      toast.error(data.message || "Call error occurred.");
      resetCallSession("FAILED", 1500);
    };

    socket.on("call:ringing", handleCallRinging);
    socket.on("call:incoming", handleCallIncoming);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("call:offer", handleCallOffer);
    socket.on("call:answer", handleCallAnswer);
    socket.on("call:ice_candidate", handleIceCandidate);
    socket.on("call:rejected", handleCallRejected);
    socket.on("call:cancelled", handleCallCancelled);
    socket.on("call:ended", handleCallEnded);
    socket.on("call:failed", handleCallFailed);
    socket.on("call:accepted_elsewhere", handleAcceptedElsewhere);
    socket.on("call:error", handleCallError);

    return () => {
      socket.off("call:ringing", handleCallRinging);
      socket.off("call:incoming", handleCallIncoming);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("call:offer", handleCallOffer);
      socket.off("call:answer", handleCallAnswer);
      socket.off("call:ice_candidate", handleIceCandidate);
      socket.off("call:rejected", handleCallRejected);
      socket.off("call:cancelled", handleCallCancelled);
      socket.off("call:ended", handleCallEnded);
      socket.off("call:failed", handleCallFailed);
      socket.off("call:accepted_elsewhere", handleAcceptedElsewhere);
      socket.off("call:error", handleCallError);
    };
  }, [socket, getOrCreateWebRTCService, resetCallSession]);

  return (
    <CallContext.Provider
      value={{
        callState,
        activeCall,
        callDuration,
        isMuted,
        initiateCall,
        acceptCall,
        declineCall,
        cancelCall,
        endCall,
        toggleMute,
      }}
    >
      {children}

      {/* Global Call UI Overlay */}
      <CallModal
        callState={callState}
        activeCall={activeCall}
        callDuration={callDuration}
        isMuted={isMuted}
        onAccept={acceptCall}
        onDecline={declineCall}
        onCancel={cancelCall}
        onEnd={endCall}
        onToggleMute={toggleMute}
      />
    </CallContext.Provider>
  );
};

export const useCall = (): CallContextValue => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};
