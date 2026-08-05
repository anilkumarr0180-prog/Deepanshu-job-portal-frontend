import { useState, type FormEvent } from "react";
import { CheckCircle2, ExternalLink, FileText, Pencil, X } from "lucide-react";

import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

export default function CandidateResumePage() {
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useProfile();

  const updateProfileMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");

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

  const handleStartEdit = () => {
    if (profile?.resumeUrl) {
      setUrl(profile.resumeUrl);
    }
    setIsEditing(true);
    setUrlError("");
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    if (!validateUrl(url)) {
      return;
    }

    updateProfileMutation.mutate(
      { resumeUrl: url },
      {
        onSuccess: () => {
          setIsEditing(false);
          void refetch();
        },
      }
    );
  };

  const handleCopy = (text: string): void => {
    void navigator.clipboard.writeText(text).catch(() => {
      // silent
    });
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
        Failed to load resume. Please try again.
      </div>
    );
  }

  const resumeUrl = profile.resumeUrl;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Resume Status</h3>

        {resumeUrl && !isEditing ? (
          <div className="mt-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                Resume Available
              </span>
            </div>
            <p className="mt-3 break-all text-sm text-slate-500">
              {resumeUrl}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#3C65F5] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                <ExternalLink className="h-4 w-4" />
                Open Resume
              </a>
              <button
                type="button"
                onClick={() => handleCopy(resumeUrl)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Copy Link
              </button>
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Pencil className="h-4 w-4" />
                Edit Resume URL
              </button>
            </div>
          </div>
        ) : resumeUrl && isEditing ? (
          <form onSubmit={handleSave} className="mt-5">
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Resume URL
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (urlError) validateUrl(e.target.value);
              }}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm placeholder:text-slate-300 focus:outline-none ${
                urlError
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-[#3C65F5]"
              }`}
              placeholder="https://example.com/resume.pdf"
            />
            {urlError && (
              <p className="mt-1.5 text-sm text-red-600">{urlError}</p>
            )}
            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="rounded-lg bg-[#3C65F5] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setUrlError("");
                }}
                disabled={updateProfileMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <h4 className="mt-4 text-base font-semibold text-slate-900">
              No Resume Added
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              Add your resume URL to make it easier for recruiters to find you.
            </p>
            <form onSubmit={handleSave} className="mt-6 max-w-md mx-auto text-left">
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Resume URL
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) validateUrl(e.target.value);
                }}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm placeholder:text-slate-300 focus:outline-none ${
                  urlError
                    ? "border-red-300 focus:border-red-500"
                    : "border-slate-200 focus:border-[#3C65F5]"
                }`}
                placeholder="https://example.com/resume.pdf"
              />
              {urlError && (
                <p className="mt-1.5 text-sm text-red-600">{urlError}</p>
              )}
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="mt-3 w-full rounded-lg bg-[#3C65F5] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Resume URL"}
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
