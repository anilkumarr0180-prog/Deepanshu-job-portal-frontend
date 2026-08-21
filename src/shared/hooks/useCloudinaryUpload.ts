import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  getUploadSignature,
  type CloudinaryUploadType,
} from "../api/upload.api";

export interface UploadResult {
  secure_url: string;
  public_id: string;
  original_filename?: string;
  format?: string;
  bytes?: number;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_POST_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_RESUME_SIZE = 10 * 1024 * 1024; // 10 MB

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  const validateFile = useCallback(
    (file: File, type: CloudinaryUploadType): boolean => {
      setError(null);

      if (type === "post") {
        if (!ALLOWED_POST_IMAGE_TYPES.includes(file.type.toLowerCase())) {
          const msg =
            "Invalid file format. Only JPG, PNG, WebP, and GIF images are allowed.";
          setError(msg);
          toast.error(msg);
          return false;
        }
        if (file.size > MAX_IMAGE_SIZE) {
          const msg = "File size exceeds limit. Maximum allowed size is 5MB.";
          setError(msg);
          toast.error(msg);
          return false;
        }
      } else if (type === "profile" || type === "company-logo") {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
          const msg =
            "Invalid file format. Only JPG, PNG, and WebP images are allowed.";
          setError(msg);
          toast.error(msg);
          return false;
        }
        if (file.size > MAX_IMAGE_SIZE) {
          const msg = "File size exceeds limit. Maximum allowed size is 5MB.";
          setError(msg);
          toast.error(msg);
          return false;
        }
      } else if (type === "resume") {
        const isPdfOrDoc =
          ALLOWED_RESUME_TYPES.includes(file.type.toLowerCase()) ||
          file.name.toLowerCase().endsWith(".pdf") ||
          file.name.toLowerCase().endsWith(".doc") ||
          file.name.toLowerCase().endsWith(".docx");

        if (!isPdfOrDoc) {
          const msg =
            "Invalid document format. Please upload a PDF or DOC file.";
          setError(msg);
          toast.error(msg);
          return false;
        }
        if (file.size > MAX_RESUME_SIZE) {
          const msg =
            "Resume file size exceeds limit. Maximum allowed size is 10MB.";
          setError(msg);
          toast.error(msg);
          return false;
        }
      }

      return true;
    },
    []
  );

  const uploadFile = useCallback(
    async (
      file: File,
      type: CloudinaryUploadType
    ): Promise<UploadResult | null> => {
      if (!validateFile(file, type)) {
        return null;
      }

      setIsUploading(true);
      setProgress(0);
      setError(null);

      try {
        // Step 1: Get short-lived upload signature from backend
        const sig = await getUploadSignature(type);

        const resourceType = type === "resume" ? "raw" : "image";
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`;

        // Step 2: Build FormData payload
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

        // Step 3: Direct upload to Cloudinary with progress tracking
        const response = await axios.post<UploadResult>(cloudinaryUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percent);
            }
          },
        });

        setIsUploading(false);
        setProgress(100);

        return {
          secure_url: response.data.secure_url,
          public_id: response.data.public_id,
          original_filename: response.data.original_filename || file.name,
          format: response.data.format,
          bytes: response.data.bytes || file.size,
        };
      } catch (err: any) {
        setIsUploading(false);
        setProgress(0);

        let errorMessage = "File upload failed. Please try again.";
        if (axios.isAxiosError(err)) {
          if (err.response?.data?.error?.message) {
            errorMessage = err.response.data.error.message;
          } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          }
        }

        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      }
    },
    [validateFile]
  );

  return {
    uploadFile,
    isUploading,
    progress,
    error,
    reset,
  };
}
