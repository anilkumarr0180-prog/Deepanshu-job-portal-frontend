import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  Pencil,
  Trash2,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useCloudinaryUpload } from "@/shared/hooks/useCloudinaryUpload";
import { getAuthenticatedResumeUrl } from "@/shared/api/upload.api";

export default function CandidateResumePage() {
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const { uploadFile, isUploading, progress } = useCloudinaryUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isFetchingViewUrl, setIsFetchingViewUrl] = useState(false);

  const validateUrl = (value: string): boolean => {
    if (!value.trim()) {
      setUrlError("Resume URL is required.");
      return false;
    }
    try {
      new URL(value);
      setUrlError("");
      return true;
    } catch {
      setUrlError("Please enter a valid URL.");
      return false;
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await uploadFile(file, "resume");
    if (res) {
      updateProfileMutation.mutate(
        {
          resumeUrl: res.secure_url,
          resumePublicId: res.public_id,
          resumeFileName: file.name,
          resumeUploadedAt: new Date().toISOString(),
        },
        {
          onSuccess: () => {
            void refetch();
            if (fileInputRef.current) fileInputRef.current.value = "";
          },
        }
      );
    }
  };

  const handleRemoveResume = () => {
    if (window.confirm("Are you sure you want to remove your uploaded resume?")) {
      updateProfileMutation.mutate(
        {
          resumeUrl: "",
          resumePublicId: "",
          resumeFileName: "",
        },
        {
          onSuccess: () => {
            toast.success("Resume removed successfully.");
            void refetch();
          },
        }
      );
    }
  };

  const handleOpenAuthenticatedResume = async () => {
    if (!profile?.resumeUrl && !profile?.resumePublicId) return;

    // If there is a publicId, request a signed authenticated URL
    if (profile.resumePublicId) {
      try {
        setIsFetchingViewUrl(true);
        const res = await getAuthenticatedResumeUrl({
          publicId: profile.resumePublicId,
        });
        if (res?.url) {
          window.open(res.url, "_blank", "noopener,noreferrer");
        } else {
          window.open(profile.resumeUrl, "_blank", "noopener,noreferrer");
        }
      } catch (err) {
        // Fallback to direct resumeUrl if signed URL call fails
        window.open(profile.resumeUrl, "_blank", "noopener,noreferrer");
      } finally {
        setIsFetchingViewUrl(false);
      }
    } else if (profile.resumeUrl) {
      window.open(profile.resumeUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleManualUrlSave = (e: FormEvent) => {
    e.preventDefault();
    if (!validateUrl(manualUrl)) return;

    updateProfileMutation.mutate(
      {
        resumeUrl: manualUrl,
        resumePublicId: "",
        resumeFileName: "External Link",
      },
      {
        onSuccess: () => {
          setIsEditingUrl(false);
          void refetch();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        Failed to load resume details. Please try again.
      </div>
    );
  }

  const resumeUrl = profile.resumeUrl;
  const fileName = profile.resumeFileName || (resumeUrl ? "Resume Document" : "");
  const uploadedAtFormatted = profile.resumeUploadedAt
    ? new Date(profile.resumeUploadedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Resume Document
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your official resume for recruiters to view when you apply.
            </p>
          </div>
          {resumeUrl && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Active Resume
            </span>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Active Resume State */}
        {resumeUrl && !isEditingUrl ? (
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#3C65F5]">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 break-all">
                    {fileName}
                  </h4>
                  <p className="text-xs text-slate-500 break-all max-w-md">
                    {profile.resumePublicId ? `Private Cloud Storage (${profile.resumePublicId})` : resumeUrl}
                  </p>
                  {uploadedAtFormatted && (
                    <p className="text-[11px] text-slate-400">
                      Uploaded on {uploadedAtFormatted}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleOpenAuthenticatedResume}
                  disabled={isFetchingViewUrl}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#3C65F5] px-4 py-2 text-xs font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isFetchingViewUrl ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ExternalLink className="h-3.5 w-3.5" />
                  )}
                  View Resume
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || updateProfileMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                >
                  <Upload className="h-3.5 w-3.5 text-slate-500" />
                  Replace
                </button>

                <button
                  type="button"
                  onClick={handleRemoveResume}
                  disabled={updateProfileMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600 font-medium">
                  <span>Uploading document...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-[#3C65F5] transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setManualUrl(resumeUrl);
                  setIsEditingUrl(true);
                }}
                className="text-xs font-medium text-[#3C65F5] hover:underline inline-flex items-center gap-1"
              >
                <Pencil className="h-3 w-3" />
                Or edit URL manually
              </button>
            </div>
          </div>
        ) : isEditingUrl ? (
          <form onSubmit={handleManualUrlSave} className="mt-6">
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Direct Resume URL
            </label>
            <input
              type="url"
              required
              value={manualUrl}
              onChange={(e) => {
                setManualUrl(e.target.value);
                if (urlError) validateUrl(e.target.value);
              }}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm placeholder:text-slate-300 focus:outline-none ${
                urlError
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-[#3C65F5]"
              }`}
              placeholder="https://example.com/my-resume.pdf"
            />
            {urlError && (
              <p className="mt-1.5 text-sm text-red-600">{urlError}</p>
            )}
            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="rounded-lg bg-[#3C65F5] px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save URL"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingUrl(false);
                  setUrlError("");
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* Empty State - Upload Dropzone */
          <div className="mt-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-10 text-center hover:border-[#3C65F5] hover:bg-blue-50/20 transition-colors"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#3C65F5] shadow-sm">
                <Upload className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-base font-semibold text-slate-900">
                Upload your Resume (PDF or DOC)
              </h4>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Select a file from your computer (Max size 10MB). Your document will be securely stored.
              </p>

              <button
                type="button"
                disabled={isUploading}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading ({progress}%)...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Choose File to Upload
                  </>
                )}
              </button>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600 font-medium">
                  <span>Uploading to secure Cloudinary storage...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-[#3C65F5] transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setManualUrl("");
                  setIsEditingUrl(true);
                }}
                className="text-xs font-medium text-slate-500 hover:text-[#3C65F5] hover:underline"
              >
                Or enter an external resume URL manually
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
