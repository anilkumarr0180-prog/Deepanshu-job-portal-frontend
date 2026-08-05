import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, FileText, UserRound } from "lucide-react";

import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

export default function CandidateProfilePage() {
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useProfile();

  const updateProfileMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    profilePicture: "",
  });

  const handleEdit = () => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        profilePicture: profile.profilePicture || "",
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        profilePicture: profile.profilePicture || "",
      });
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    updateProfileMutation.mutate(
      {
        name: form.name,
        phone: form.phone,
        profilePicture: form.profilePicture,
      },
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
        <div className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        <div className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        Failed to load profile. Please try again.
      </div>
    );
  }

  const displayName = profile.name?.trim() || "Candidate";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-500">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-10 w-10" />
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900">
              {displayName}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
            {profile.phone && (
              <p className="mt-1 text-sm text-slate-500">{profile.phone}</p>
            )}
            <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              {profile.role}
            </span>
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="rounded-lg bg-[#3C65F5] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={updateProfileMutation.isPending}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          Personal Information
        </h3>

        <form onSubmit={handleSave} className="mt-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder:text-slate-300 focus:border-[#3C65F5] focus:outline-none"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-sm text-slate-900">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Email
              </label>
              <p className="text-sm text-slate-900">{profile.email}</p>
              <p className="mt-1 text-xs text-slate-400">Read only</p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder:text-slate-300 focus:border-[#3C65F5] focus:outline-none"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-sm text-slate-900">
                  {profile.phone || "—"}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Role
              </label>
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                {profile.role}
              </span>
              <p className="mt-1 text-xs text-slate-400">Read only</p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Profile Picture URL
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={form.profilePicture}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      profilePicture: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder:text-slate-300 focus:border-[#3C65F5] focus:outline-none"
                  placeholder="https://example.com/avatar.jpg"
                />
              ) : (
                <p className="text-sm text-slate-900">
                  {profile.profilePicture || "—"}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="rounded-lg bg-[#3C65F5] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Resume</h3>

        {profile.resumeUrl ? (
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                Resume Available
              </span>
            </div>
            <p className="mt-2 break-all text-sm text-slate-500">
              {profile.resumeUrl}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Open Resume
              </a>
              <button
                type="button"
                onClick={() => handleCopy(profile.resumeUrl!)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Copy Resume Link
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <h4 className="mt-4 text-base font-semibold text-slate-900">
              No Resume Added
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              Add your resume to make it easier for recruiters to find you.
            </p>
            <Link
              to="/candidate/resume"
              className="mt-5 inline-flex rounded-lg bg-[#3C65F5] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              Go To Resume Page
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
