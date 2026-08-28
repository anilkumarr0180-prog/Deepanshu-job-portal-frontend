import { useState, useRef, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  uploadVoiceAudioToCloudinary,
  type VoiceUploadResult,
} from "../services/voiceUpload.service";

export interface UseVoiceUploadReturn {
  uploadVoice: (
    blob: Blob,
    duration: number,
    mimeType?: string
  ) => Promise<VoiceUploadResult | null>;
  cancelUpload: () => void;
  isUploading: boolean;
  progress: number;
  error: string | null;
  reset: () => void;
}

/**
 * useVoiceUpload - React hook for uploading voice messages to Cloudinary with progress & cancellation
 */
export function useVoiceUpload(): UseVoiceUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const uploadVoice = useCallback(
    async (
      blob: Blob,
      duration: number,
      mimeType?: string
    ): Promise<VoiceUploadResult | null> => {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      abortControllerRef.current = new AbortController();

      try {
        const result = await uploadVoiceAudioToCloudinary({
          blob,
          duration,
          mimeType,
          signal: abortControllerRef.current.signal,
          onProgress: (percent) => setProgress(percent),
        });

        setIsUploading(false);
        setProgress(100);
        return result;
      } catch (err: unknown) {
        setIsUploading(false);
        setProgress(0);

        if (axios.isCancel(err) || (err as any)?.name === "CanceledError" || (err as any)?.name === "AbortError") {
          setError("Upload was cancelled.");
          return null;
        }

        let errorMessage = "Voice message upload failed. Please try again.";
        const axiosErr = err as any;
        if (axiosErr?.response?.data?.error?.message) {
          errorMessage = axiosErr.response.data.error.message;
        } else if (axiosErr?.response?.data?.message) {
          errorMessage = axiosErr.response.data.message;
        } else if (axiosErr?.message) {
          errorMessage = axiosErr.message;
        }

        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        abortControllerRef.current = null;
      }
    },
    []
  );

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsUploading(false);
      setProgress(0);
    }
  }, []);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploadVoice,
    cancelUpload,
    isUploading,
    progress,
    error,
    reset,
  };
}
