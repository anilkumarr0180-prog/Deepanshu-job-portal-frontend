import axios from "axios";
import { getUploadSignature } from "@/shared/api/upload.api";

export interface VoiceUploadResult {
  url: string;
  publicId: string;
  mimeType: string;
  size: number;
  duration: number;
  originalFilename: string;
}

export interface UploadVoiceOptions {
  blob: Blob;
  mimeType?: string;
  duration?: number;
  signal?: AbortSignal;
  onProgress?: (percent: number) => void;
}

const MAX_VOICE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_AUDIO_MIME_PREFIX = "audio/";

/**
 * Derives safe deterministic audio file extension from MIME type
 */
export const getAudioExtension = (mimeType: string): string => {
  const lower = (mimeType || "").toLowerCase();
  if (lower.includes("mp4") || lower.includes("m4a") || lower.includes("aac")) {
    return "mp4";
  }
  if (lower.includes("ogg")) {
    return "ogg";
  }
  if (lower.includes("mp3") || lower.includes("mpeg")) {
    return "mp3";
  }
  if (lower.includes("wav")) {
    return "wav";
  }
  return "webm";
};

/**
 * Direct authenticated client-to-Cloudinary upload for recorded voice audio blobs
 */
export async function uploadVoiceAudioToCloudinary(
  options: UploadVoiceOptions
): Promise<VoiceUploadResult> {
  const {
    blob,
    mimeType = blob.type || "audio/webm",
    duration = 0,
    signal,
    onProgress,
  } = options;

  // 1. Client-side size validation guard
  if (blob.size > MAX_VOICE_SIZE) {
    throw new Error("Voice recording exceeds maximum limit of 5MB.");
  }

  if (blob.size === 0) {
    throw new Error("Cannot upload an empty audio recording.");
  }

  // 2. MIME type security validation
  const lowerMime = (mimeType || "").toLowerCase().trim();
  if (!lowerMime.startsWith(ALLOWED_AUDIO_MIME_PREFIX)) {
    throw new Error(`Invalid audio MIME type: ${mimeType}. Only audio recordings are permitted.`);
  }

  // 2. Safe deterministic filename
  const extension = getAudioExtension(mimeType);
  const filename = `voice_${Date.now()}.${extension}`;
  const file = new File([blob], filename, { type: mimeType });

  // 3. Request short-lived upload signature from backend for "chat-media"
  const sig = await getUploadSignature("chat-media");

  // 4. Cloudinary video/audio upload endpoint (Cloudinary stores audio under the 'video' resource type)
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`;

  // 5. Build FormData payload
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", String(sig.timestamp));
  formData.append("signature", sig.signature);
  if (sig.folder) {
    formData.append("folder", sig.folder);
  }
  if (sig.uploadPreset) {
    formData.append("upload_preset", sig.uploadPreset);
  }

  // 6. Direct upload with progress tracking and cancellation support
  const response = await axios.post<{
    secure_url: string;
    public_id: string;
    bytes?: number;
    format?: string;
  }>(cloudinaryUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal,
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return {
    url: response.data.secure_url,
    publicId: response.data.public_id,
    mimeType,
    size: response.data.bytes || blob.size,
    duration,
    originalFilename: filename,
  };
}
