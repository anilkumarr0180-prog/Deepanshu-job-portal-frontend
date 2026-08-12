import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import { Edit3, Check, X, Upload, Loader2, Trash2 } from "lucide-react";

import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import { useCloudinaryUpload } from "@/shared/hooks/useCloudinaryUpload";
import useAuth from "@/features/auth/hooks/useAuth";
import RecruiterProfileCard from "../components/profile/RecruiterProfileCard";
import RecruiterProfileDetails from "../components/profile/RecruiterProfileDetails";
import RecruiterProfileStats from "../components/profile/RecruiterProfileStats";

export default function RecruiterProfilePage() {
  const { data: profile, isLoading, isError } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const { uploadFile, isUploading, progress } = useCloudinaryUpload();
  const { refreshUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    profilePicture: "",
    profilePicturePublicId: "",
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
          profilePicturePublicId: profile.profilePicturePublicId || "",
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

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await uploadFile(file, "profile");
    if (res) {
      setForm((prev) => ({
        ...prev,
        profilePicture: res.secure_url,
        profilePicturePublicId: res.public_id,
      }));
    }
  };

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
        profilePicturePublicId: profile.profilePicturePublicId || "",
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
        profilePicturePublicId: form.profilePicturePublicId,
        designation: form.designation,
        department: form.department,
        bio: form.bio,
        socialLinks: form.socialLinks,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          void refreshUser();
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
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Personal & Identity */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Personal Identity & Contact
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Manage your primary identity details and avatar picture.
              </p>
            </div>

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
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#3C65F5] focus:outline-none"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Email Address
                  </label>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Read-only
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed pr-9"
                  />
                  <span className="absolute right-3 text-slate-400" title="Email cannot be changed directly">
                    🔒
                  </span>
                </div>
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#3C65F5] focus:outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {/* Avatar Section */}
              <div className="md:col-span-2 mt-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Profile Picture
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                <div className="flex flex-wrap items-center gap-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="relative group flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 text-slate-400 shadow-sm">
                    {form.profilePicture ? (
                      <img
                        src={form.profilePicture}
                        alt="Profile avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">No Image</span>
                    )}

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                    >
                      {isUploading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Upload className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors disabled:opacity-50"
                      >
                        {isUploading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3C65F5]" />
                        ) : (
                          <Upload className="h-3.5 w-3.5 text-[#3C65F5]" />
                        )}
                        Upload Photo
                      </button>

                      {form.profilePicture && (
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              profilePicture: "",
                              profilePicturePublicId: "",
                            }))
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove Photo
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      JPG, PNG, or WebP · Max file size 5MB
                    </p>
                  </div>
                </div>

                {isUploading && (
                  <div className="mt-3 max-w-xs space-y-1">
                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>Uploading to Cloudinary...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-[#3C65F5] transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Role & Department */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Professional Role & Department
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Specify your title and organizational department.
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#3C65F5] focus:outline-none"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#3C65F5] focus:outline-none"
                  placeholder="e.g. Talent Acquisition"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Summary & Social Links */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                About & Social Profiles
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Share a summary of your recruiting background and external links.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Bio / Summary
                </label>
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#3C65F5] focus:outline-none"
                  placeholder="Brief description of your role and hiring focus..."
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#3C65F5] focus:outline-none"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Twitter / X URL
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#3C65F5] focus:outline-none"
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Official Website
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#3C65F5] focus:outline-none"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <button
              type="button"
              onClick={handleCancel}
              disabled={updateProfileMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-6 py-2.5 text-xs font-medium text-white shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Profile Changes
                </>
              )}
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
