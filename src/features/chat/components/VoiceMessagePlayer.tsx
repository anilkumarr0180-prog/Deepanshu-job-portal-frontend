import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Loader2, AlertCircle, Volume2 } from "lucide-react";
import { audioPlaybackManager } from "../services/audioPlaybackManager";

export type VoicePlaybackState =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "ended"
  | "error";

export interface VoiceMessagePlayerProps {
  audioUrl?: string;
  duration?: number;
  isSelf?: boolean;
  id?: string;
  className?: string;
}

/**
 * Formats duration in seconds to m:ss
 */
export function formatAudioTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function VoiceMessagePlayer({
  audioUrl,
  duration: initialDuration = 0,
  isSelf = false,
  id,
  className = "",
}: VoiceMessagePlayerProps) {
  // Generate stable unique player ID if not provided
  const playerIdRef = useRef<string>(id || `player_${Math.random().toString(36).substring(2, 9)}`);
  const playerId = playerIdRef.current;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playbackState, setPlaybackState] = useState<VoicePlaybackState>("idle");
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(initialDuration || 0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);

  // Validate audio attachment URL before rendering
  const isValidUrl = Boolean(
    audioUrl &&
    typeof audioUrl === "string" &&
    audioUrl.trim().length > 0 &&
    (audioUrl.startsWith("http://") ||
     audioUrl.startsWith("https://") ||
     audioUrl.startsWith("blob:") ||
     audioUrl.startsWith("/"))
  );

  // Subscribe to shared AudioPlaybackManager for single-audio playback
  useEffect(() => {
    const unsubscribe = audioPlaybackManager.subscribe((activeId) => {
      if (activeId !== playerId && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setPlaybackState("paused");
      }
    });

    return () => {
      unsubscribe();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (audioPlaybackManager.getActiveId() === playerId) {
        audioPlaybackManager.pause(playerId);
      }
    };
  }, [playerId]);

  // Sync initial duration if provided or updated externally
  useEffect(() => {
    if (initialDuration && initialDuration > 0 && (!totalDuration || totalDuration === 0)) {
      setTotalDuration(initialDuration);
    }
  }, [initialDuration]);

  // Native audio event handlers
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      if (isFinite(dur) && dur > 0) {
        setTotalDuration(Math.round(dur * 10) / 10);
      }
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      if (isFinite(dur) && dur > 0) {
        setTotalDuration(Math.round(dur * 10) / 10);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isSeeking) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setPlaybackState("ended");
    setCurrentTime(0);
    audioPlaybackManager.pause(playerId);
  };

  const handleWaiting = () => {
    setPlaybackState("loading");
  };

  const handleCanPlay = () => {
    if (playbackState === "loading") {
      setPlaybackState(audioRef.current && !audioRef.current.paused ? "playing" : "paused");
    }
  };

  const handleError = () => {
    setPlaybackState("error");
    setErrorMessage("Unable to play audio");
    audioPlaybackManager.pause(playerId);
  };

  const playPromiseRef = useRef<Promise<void> | null>(null);

  // Toggle Play / Pause with safe Promise resolution
  const togglePlayPause = async () => {
    if (!isValidUrl || !audioRef.current) return;

    if (playbackState === "playing") {
      try {
        if (playPromiseRef.current) {
          await playPromiseRef.current.catch(() => {});
        }
        audioRef.current.pause();
        setPlaybackState("paused");
        audioPlaybackManager.pause(playerId);
      } catch {
        // Safe catch for rapid pause
      }
    } else {
      try {
        setPlaybackState("loading");
        audioPlaybackManager.play(playerId);
        const promise = audioRef.current.play();
        playPromiseRef.current = promise;
        await promise;
        setPlaybackState("playing");
      } catch (err: unknown) {
        const error = err as { name?: string };
        if (error.name !== "AbortError") {
          setPlaybackState("error");
          setErrorMessage("Unable to play audio");
          audioPlaybackManager.pause(playerId);
        }
      } finally {
        playPromiseRef.current = null;
      }
    }
  };

  // Seeking handlers with strict bounds validation
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (isFinite(newTime) && newTime >= 0) {
      setCurrentTime(newTime);
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setIsSeeking(false);
    const target = e.target as HTMLInputElement;
    const newTime = Number(target.value);
    if (audioRef.current && isFinite(newTime) && newTime >= 0) {
      const boundedTime = Math.max(0, Math.min(newTime, totalDuration > 0 ? totalDuration : newTime));
      audioRef.current.currentTime = boundedTime;
      setCurrentTime(boundedTime);
    }
  };

  // If audio attachment URL is missing or invalid
  if (!isValidUrl) {
    return (
      <div
        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs italic ${
          isSelf
            ? "bg-white/10 text-white/80 border border-white/20"
            : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
        } ${className}`}
      >
        <AlertCircle className="h-4 w-4 shrink-0 opacity-60" />
        <span>Audio unavailable</span>
      </div>
    );
  }

  // Calculate progress percentage for styled slider track
  const progressPercent =
    totalDuration > 0 ? Math.min(100, Math.max(0, (currentTime / totalDuration) * 100)) : 0;

  return (
    <div
      className={`flex flex-col gap-1 select-none min-w-[210px] max-w-[280px] sm:max-w-[320px] ${className}`}
    >
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleDurationChange}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onError={handleError}
        className="hidden"
      />

      {/* Main player controls row */}
      <div className="flex items-center gap-3">
        {/* Play/Pause/Loading Button */}
        <button
          type="button"
          onClick={togglePlayPause}
          disabled={playbackState === "error"}
          aria-label={
            playbackState === "playing"
              ? "Pause voice message"
              : "Play voice message"
          }
          className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-2 active:scale-95 shadow-xs ${
            isSelf
              ? "bg-white text-[#3C65F5] hover:bg-white/95 focus-visible:ring-white"
              : "bg-[#3C65F5] text-white hover:bg-[#2e55e8] focus-visible:ring-[#3C65F5]"
          } ${playbackState === "error" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {playbackState === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : playbackState === "playing" ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="h-4 w-4 fill-current translate-x-[1px]" />
          )}
        </button>

        {/* Progress & Time Container */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          {/* Custom Styled Seekable Range Slider */}
          <div className="relative flex items-center h-4 w-full group">
            {/* Background track */}
            <div
              className={`absolute inset-x-0 h-1.5 rounded-full pointer-events-none overflow-hidden ${
                isSelf
                  ? "bg-white/30"
                  : "bg-slate-200 dark:bg-slate-700/80"
              }`}
            >
              {/* Active fill */}
              <div
                className={`h-full transition-all duration-75 rounded-full ${
                  isSelf ? "bg-white" : "bg-[#3C65F5] dark:bg-blue-500"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Scrub Thumb Indicator */}
            <div
              className={`absolute h-3 w-3 rounded-full pointer-events-none shadow-xs transition-transform duration-75 -translate-x-1.5 group-hover:scale-110 ${
                isSelf
                  ? "bg-white ring-2 ring-[#3C65F5]/30"
                  : "bg-[#3C65F5] dark:bg-blue-400 ring-2 ring-blue-500/20"
              }`}
              style={{ left: `${progressPercent}%` }}
            />

            {/* Range Input for Accessible Dragging/Seeking */}
            <input
              type="range"
              min={0}
              max={totalDuration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeekChange}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              onKeyUp={handleSeekEnd}
              disabled={playbackState === "error" || totalDuration <= 0}
              aria-label="Seek voice message"
              aria-valuemin={0}
              aria-valuemax={totalDuration || 100}
              aria-valuenow={currentTime}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>

          {/* Timing labels & Label info */}
          <div className="flex items-center justify-between text-[11px] font-medium leading-none mt-1">
            <span
              className={`tabular-nums font-mono ${
                isSelf ? "text-white/95" : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {formatAudioTime(currentTime > 0 ? currentTime : totalDuration)}
            </span>
            <span
              className={`flex items-center gap-1 text-[10px] tracking-tight ${
                isSelf ? "text-white/75" : "text-slate-400 dark:text-slate-400"
              }`}
            >
              <Volume2 className="h-3 w-3 opacity-80" />
              <span>Voice message</span>
            </span>
          </div>
        </div>
      </div>

      {/* Playback Error Alert */}
      {playbackState === "error" && (
        <div
          className={`flex items-center gap-1.5 text-[11px] font-medium mt-1 ${
            isSelf ? "text-rose-100" : "text-red-500 dark:text-red-400"
          }`}
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMessage || "Unable to play audio."}</span>
        </div>
      )}
    </div>
  );
}
