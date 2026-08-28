/**
 * WebRTC 1-to-1 Audio Call Service
 * Handles RTCPeerConnection lifecycle, dynamic STUN/TURN fetching, local/remote MediaStream, audio element, and trickle ICE.
 */

import { fetchIceServersApi, type IceServerConfig } from "../api/call.api";

const DEFAULT_STUN_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
  iceCandidatePoolSize: 2,
};

// Global in-memory cache for ICE server credentials
let cachedIceServers: IceServerConfig[] | null = null;
let iceServersExpiresAt = 0;

export interface WebRTCCallbacks {
  onIceCandidate: (candidate: RTCIceCandidateInit) => void;
  onConnectionStateChange: (state: RTCPeerConnectionState) => void;
  onRemoteStreamReady?: (stream: MediaStream) => void;
  onError: (error: Error) => void;
}

export class WebRTCCallService {
  private static pendingIcePromise: Promise<RTCConfiguration> | null = null;

  private peerConnection: RTCPeerConnection | null = null;
  private initPromise: Promise<RTCPeerConnection> | null = null;
  private disconnectGraceTimer: ReturnType<typeof setTimeout> | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private pendingCandidates: RTCIceCandidateInit[] = [];
  private isRemoteDescriptionSet: boolean = false;
  private callbacks: WebRTCCallbacks;

  constructor(callbacks: WebRTCCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Fetch or return cached ICE server configuration (in-flight promise sharing)
   */
  static async getIceConfiguration(): Promise<RTCConfiguration> {
    const now = Date.now();
    if (cachedIceServers && now < iceServersExpiresAt) {
      return {
        iceServers: cachedIceServers,
        iceCandidatePoolSize: 2,
      };
    }

    if (WebRTCCallService.pendingIcePromise) {
      return WebRTCCallService.pendingIcePromise;
    }

    WebRTCCallService.pendingIcePromise = (async () => {
      try {
        const servers = await fetchIceServersApi();
        cachedIceServers = servers;
        iceServersExpiresAt = Date.now() + 3600 * 1000;
        return {
          iceServers: servers,
          iceCandidatePoolSize: 2,
        };
      } catch {
        return DEFAULT_STUN_CONFIG;
      } finally {
        WebRTCCallService.pendingIcePromise = null;
      }
    })();

    return WebRTCCallService.pendingIcePromise;
  }

  /**
   * Request microphone access after explicit user action
   */
  async acquireLocalMedia(): Promise<MediaStream> {
    if (this.localStream) {
      return this.localStream;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Your browser does not support WebRTC audio calling.");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      this.localStream = stream;
      return stream;
    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        throw new Error("Microphone permission was denied. Please allow microphone access in your browser.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        throw new Error("No microphone device was found on your system.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        throw new Error("Microphone is currently in use by another application.");
      } else {
        throw new Error(`Failed to access microphone: ${err.message || err.name}`);
      }
    }
  }

  /**
   * Initialize RTCPeerConnection with dynamic STUN/TURN ICE configuration (Idempotent & Concurrency Safe)
   */
  async initPeerConnection(): Promise<RTCPeerConnection> {
    if (this.peerConnection) {
      return this.peerConnection;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        const rtcConfig = await WebRTCCallService.getIceConfiguration();
        if (this.peerConnection) {
          return this.peerConnection;
        }

        const pc = new RTCPeerConnection(rtcConfig);
        this.peerConnection = pc;
        this.isRemoteDescriptionSet = false;
        this.pendingCandidates = [];

        // Add local tracks if stream is acquired
        if (this.localStream) {
          this.localStream.getAudioTracks().forEach((track) => {
            pc.addTrack(track, this.localStream!);
          });
        }

        // Trickle ICE handler
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            this.callbacks.onIceCandidate(event.candidate.toJSON());
          }
        };

        // Remote audio track handler
        pc.ontrack = (event) => {
          const [stream] = event.streams;
          if (stream) {
            this.remoteStream = stream;
            this.playRemoteAudio(stream);
            if (this.callbacks.onRemoteStreamReady) {
              this.callbacks.onRemoteStreamReady(stream);
            }
          }
        };

        // Connection state listeners with transient disconnection recovery guard
        pc.onconnectionstatechange = () => {
          if (!this.peerConnection) return;
          const state = this.peerConnection.connectionState;
          console.log(`📡 WebRTC ConnectionState: ${state}`);

          if (state === "connected") {
            if (this.disconnectGraceTimer) {
              clearTimeout(this.disconnectGraceTimer);
              this.disconnectGraceTimer = null;
            }
            this.callbacks.onConnectionStateChange("connected");
          } else if (state === "disconnected") {
            // Transient network interruption: give 8s for ICE recovery before failing
            if (!this.disconnectGraceTimer) {
              this.disconnectGraceTimer = setTimeout(() => {
                if (this.peerConnection?.connectionState === "disconnected") {
                  console.warn("WebRTC disconnected timeout exceeded. Marking as failed.");
                  this.callbacks.onConnectionStateChange("failed");
                }
              }, 8000);
            }
          } else if (state === "failed" || state === "closed") {
            if (this.disconnectGraceTimer) {
              clearTimeout(this.disconnectGraceTimer);
              this.disconnectGraceTimer = null;
            }
            this.callbacks.onConnectionStateChange("failed");
          }
        };

        pc.oniceconnectionstatechange = () => {
          if (!this.peerConnection) return;
          const iceState = this.peerConnection.iceConnectionState;
          console.log(`❄️ WebRTC ICE State: ${iceState}`);

          if (iceState === "connected" || iceState === "completed") {
            if (this.disconnectGraceTimer) {
              clearTimeout(this.disconnectGraceTimer);
              this.disconnectGraceTimer = null;
            }
          } else if (iceState === "failed") {
            if (this.disconnectGraceTimer) {
              clearTimeout(this.disconnectGraceTimer);
              this.disconnectGraceTimer = null;
            }
            this.callbacks.onError(new Error("WebRTC ICE negotiation failed."));
          }
        };

        return pc;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  /**
   * Create SDP Offer (Caller)
   */
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const pc = this.peerConnection || (await this.initPeerConnection());
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: false,
    });
    await pc.setLocalDescription(offer);
    return pc.localDescription!;
  }

  /**
   * Handle incoming SDP Offer and generate SDP Answer (Callee)
   */
  async handleOfferAndCreateAnswer(offerSdp: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    const pc = this.peerConnection || (await this.initPeerConnection());
    await pc.setRemoteDescription(new RTCSessionDescription(offerSdp));
    this.isRemoteDescriptionSet = true;
    await this.flushPendingCandidates();

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return pc.localDescription!;
  }

  /**
   * Handle incoming SDP Answer (Caller)
   */
  async handleAnswer(answerSdp: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) return;
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answerSdp));
    this.isRemoteDescriptionSet = true;
    await this.flushPendingCandidates();
  }

  /**
   * Add incoming ICE Candidate or buffer if remote description is pending
   */
  async addIceCandidate(candidateInit: RTCIceCandidateInit): Promise<void> {
    if (this.isRemoteDescriptionSet && this.peerConnection) {
      try {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidateInit));
      } catch (err) {
        console.warn("Failed to add ICE candidate immediately:", err);
      }
    } else {
      this.pendingCandidates.push(candidateInit);
    }
  }

  /**
   * Flush buffered candidates after remote description is applied
   */
  private async flushPendingCandidates(): Promise<void> {
    if (!this.peerConnection || !this.isRemoteDescriptionSet) return;
    while (this.pendingCandidates.length > 0) {
      const candidate = this.pendingCandidates.shift();
      if (candidate) {
        try {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.warn("Failed to flush buffered ICE candidate:", err);
        }
      }
    }
  }

  /**
   * Attach remote stream to HTMLAudioElement for live playback
   */
  private playRemoteAudio(stream: MediaStream): void {
    if (!this.audioElement) {
      const audio = new Audio();
      audio.autoplay = true;
      audio.srcObject = stream;
      this.audioElement = audio;
    } else {
      this.audioElement.srcObject = stream;
    }

    this.audioElement.play().catch((err) => {
      console.warn("Remote audio play blocked by browser autoplay policy:", err);
    });
  }

  /**
   * Toggle microphone mute (enables/disables live audio track without destroying stream)
   */
  setMuted(muted: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
  }

  /**
   * Strict teardown: releases hardware microphone, closes PeerConnection, cleans audio element
   */
  cleanup(): void {
    this.initPromise = null;
    if (this.disconnectGraceTimer) {
      clearTimeout(this.disconnectGraceTimer);
      this.disconnectGraceTimer = null;
    }

    // 1. Stop local media tracks (releases browser red mic indicator)
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.localStream = null;
    }

    // 2. Stop remote media tracks
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.remoteStream = null;
    }

    // 3. Cleanup audio element
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.srcObject = null;
      this.audioElement = null;
    }

    // 4. Close and nullify RTCPeerConnection
    if (this.peerConnection) {
      this.peerConnection.ontrack = null;
      this.peerConnection.onicecandidate = null;
      this.peerConnection.onconnectionstatechange = null;
      this.peerConnection.oniceconnectionstatechange = null;
      this.peerConnection.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.pendingCandidates = [];
    this.isRemoteDescriptionSet = false;
  }
}
