import { useState, useEffect, type FormEvent } from "react";
import { Edit3, Check, X } from "lucide-react";

import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import RecruiterProfileCard from "../components/profile/RecruiterProfileCard";
import RecruiterProfileDetails from "../components/profile/RecruiterProfileDetails";
import RecruiterProfileStats from "../components/profile/RecruiterProfileStats";

export default function RecruiterProfilePage() {
  const { data: profile, isLoading, isError } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    profilePicture: "",
    designation: "",
    department: "",
    bio: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      website: "",
    },
  });

  useEffect(() => {
    if (profile) {
      queueMicrotask(() => {
        setForm({
          name: profile.name || "",
          phone: profile.phone || "",
          profilePicture: profile.profilePicture || "",
          designation: profile.designation || "",
          department: profile.department || "",
          bio: profile.bio || "",
          socialLinks: {
            linkedin: profile.socialLinks?.linkedin || "",
            twitter: profile.socialLinks?.twitter || "",
            website: profile.socialLinks?.website || "",
          },
        });
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        profilePicture: profile.profilePicture || "",
        designation: profile.designation || "",
        department: profile.department || "",
        bio: profile.bio || "",
        socialLinks: {
          linkedin: profile.socialLinks?.linkedin || "",
          twitter: profile.socialLinks?.twitter || "",
          website: profile.socialLinks?.website || "",
        },
      });
    }
  };

  const handleSave = (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (updateProfileMutation.isPending) {
      return;
    }

    updateProfileMutation.mutate(
      {
        name: form.name,
        phone: form.phone,
        profilePicture: form.profilePicture,
        designation: form.designation,
        department: form.department,
        bio: form.bio,
        socialLinks: form.socialLinks,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        <div className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        <div className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        Failed to load recruiter profile. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Recruiter Profile
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Keep your public profile and recruiting details up to date.
            </p>
          </div>
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={updateProfileMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-4">
            Edit Recruiter Information
          </h3>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Designation / Position
              </label>
              <input
                type="text"
                value={form.designation}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, designation: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                placeholder="e.g. Lead Technical Recruiter"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Department
              </label>
              <input
                type="text"
                value={form.department}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, department: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                placeholder="e.g. Talent Acquisition"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Profile Picture URL
              </label>
              <input
                type="url"
                value={form.profilePicture}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, profilePicture: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Bio / Summary
              </label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bio: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                placeholder="Brief description of your role and hiring focus..."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={form.socialLinks.linkedin}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Twitter URL
              </label>
              <input
                type="url"
                value={form.socialLinks.twitter}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                placeholder="https://twitter.com/username"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Website URL
              </label>
              <input
                type="url"
                value={form.socialLinks.website}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, website: e.target.value },
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={updateProfileMutation.isPending}
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="rounded-lg bg-[#3C65F5] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <RecruiterProfileCard profile={profile} />
          <RecruiterProfileStats profile={profile} />
          <RecruiterProfileDetails profile={profile} />
        </>
      )}
    </div>
  );
}
