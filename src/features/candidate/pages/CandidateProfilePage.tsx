import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  FileText,
  UserRound,
  Plus,
  Trash2,
  Globe,
  Briefcase,
  GraduationCap,
  MapPin,
  Camera,
  Loader2,
} from "lucide-react";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useCloudinaryUpload } from "@/shared/hooks/useCloudinaryUpload";
import useAuth from "@/features/auth/hooks/useAuth";
import { PremiumBadge } from "@/shared/components/PremiumBadge";
import type {
  CandidateExperience,
  CandidateEducation,
  SocialLinks,
} from "../api/profile.api";

export default function CandidateProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const { uploadFile, isUploading: isUploadingAvatar } = useCloudinaryUpload();
  const { refreshUser } = useAuth();

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    profilePicture: "",
    profilePicturePublicId: "",
    headline: "",
    bio: "",
    city: "",
    state: "",
    country: "",
    skills: [] as string[],
    experience: [] as CandidateExperience[],
    education: [] as CandidateEducation[],
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: "",
      twitter: "",
      website: "",
    } as SocialLinks,
    resumeUrl: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        profilePicture: profile.profilePicture || "",
        profilePicturePublicId: profile.profilePicturePublicId || "",
        headline: profile.headline || "",
        bio: profile.bio || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        skills: profile.skills || [],
        experience: profile.experience || [],
        education: profile.education || [],
        socialLinks: {
          linkedin: profile.socialLinks?.linkedin || "",
          github: profile.socialLinks?.github || "",
          portfolio: profile.socialLinks?.portfolio || "",
          twitter: profile.socialLinks?.twitter || "",
          website: profile.socialLinks?.website || "",
        },
        resumeUrl: profile.resumeUrl || "",
      });
    }
  }, [profile]);

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await uploadFile(file, "profile");
    if (res) {
      setForm((prev) => ({
        ...prev,
        profilePicture: res.secure_url,
        profilePicturePublicId: res.public_id,
      }));
      // Auto save avatar update if not in edit mode
      if (!isEditing) {
        updateProfileMutation.mutate(
          {
            profilePicture: res.secure_url,
            profilePicturePublicId: res.public_id,
          },
          {
            onSuccess: () => {
              void refetch();
              void refreshUser();
            },
          }
        );
      }
    }
  };

  const handleRemoveAvatar = () => {
    setForm((prev) => ({
      ...prev,
      profilePicture: "",
      profilePicturePublicId: "",
    }));
    if (!isEditing) {
      updateProfileMutation.mutate(
        {
          profilePicture: "",
          profilePicturePublicId: "",
        },
        {
          onSuccess: () => {
            void refetch();
            void refreshUser();
          },
        }
      );
    }
  };

  const handleEdit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsEditing(true);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsEditing(false);
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        profilePicture: profile.profilePicture || "",
        profilePicturePublicId: profile.profilePicturePublicId || "",
        headline: profile.headline || "",
        bio: profile.bio || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        skills: profile.skills || [],
        experience: profile.experience || [],
        education: profile.education || [],
        socialLinks: {
          linkedin: profile.socialLinks?.linkedin || "",
          github: profile.socialLinks?.github || "",
          portfolio: profile.socialLinks?.portfolio || "",
          twitter: profile.socialLinks?.twitter || "",
          website: profile.socialLinks?.website || "",
        },
        resumeUrl: profile.resumeUrl || "",
      });
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    if (updateProfileMutation.isPending) {
      return;
    }

    updateProfileMutation.mutate(
      {
        name: form.name,
        phone: form.phone,
        profilePicture: form.profilePicture,
        profilePicturePublicId: form.profilePicturePublicId,
        headline: form.headline,
        bio: form.bio,
        city: form.city,
        state: form.state,
        country: form.country,
        skills: form.skills,
        experience: form.experience,
        education: form.education,
        socialLinks: form.socialLinks,
        resumeUrl: form.resumeUrl,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          void refreshUser();
        },
      }
    );
  };

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddExperience = () => {
    setForm((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: "", company: "", location: "", startDate: "", endDate: "", description: "" },
      ],
    }));
  };

  const handleUpdateExperience = (
    index: number,
    field: keyof CandidateExperience,
    value: string | boolean
  ) => {
    setForm((prev) => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const handleRemoveExperience = (index: number) => {
    setForm((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleAddEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" },
      ],
    }));
  };

  const handleUpdateEducation = (
    index: number,
    field: keyof CandidateEducation,
    value: string | boolean
  ) => {
    setForm((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const handleRemoveEducation = (index: number) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
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
      {/* Header Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Hidden File Input for Avatar */}
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarUpload}
          />

          <div className="flex items-center gap-3">
            <div className="relative group flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 text-slate-500 shadow-xs">
              {form.profilePicture ? (
                <img
                  src={form.profilePicture}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-10 w-10 text-slate-400" />
              )}

              {/* Hover Camera Overlay for Avatar Upload */}
              <div
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Camera className="h-5 w-5" />
                    <span className="text-[10px] font-medium mt-0.5">Upload</span>
                  </>
                )}
              </div>
            </div>

            {form.profilePicture && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                title="Remove photo"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-semibold text-slate-900">
                {displayName}
              </h2>
              {profile.subscription && profile.subscription.planCode && !profile.subscription.planCode.includes("free") && (
                <PremiumBadge planCode={profile.subscription.planCode} size="md" />
              )}
            </div>
            {profile.headline && (
              <p className="mt-0.5 text-sm font-medium text-slate-700">
                {profile.headline}
              </p>
            )}
            <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
            {profile.phone && (
              <p className="mt-0.5 text-sm text-slate-500">{profile.phone}</p>
            )}
            {(profile.city || profile.state || profile.country) && (
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {[profile.city, profile.state, profile.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
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
                  onClick={(e) => handleSave(e as unknown as FormEvent)}
                  disabled={updateProfileMutation.isPending}
                  className="rounded-lg bg-[#3C65F5] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
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

      {/* Profile Form (Edit Mode) vs Profile Info Cards (View Mode) */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Personal Information
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
                <p className="text-sm text-slate-900">{profile.email}</p>
                <p className="mt-1 text-xs text-slate-400">Read only</p>
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
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={form.headline}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, headline: e.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                  placeholder="e.g. Senior Full Stack Engineer"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Bio / About Me
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                  placeholder="Brief summary of your professional background..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  City
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  State / Country
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, state: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                    placeholder="State"
                  />
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, country: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  value={form.profilePicture}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      profilePicture: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-2 sm:max-w-md">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                  placeholder="e.g. React, TypeScript, Node.js"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#3C65F5] px-3.5 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  <Plus className="h-4 w-4" /> Add Skill
                </button>
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Experience</h3>
              <button
                type="button"
                onClick={handleAddExperience}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" /> Add Experience
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {form.experience.map((exp, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase text-slate-400">
                      Experience #{index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="text-xs font-medium text-red-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Job Title"
                      required
                      value={exp.title}
                      onChange={(e) =>
                        handleUpdateExperience(index, "title", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      required
                      value={exp.company}
                      onChange={(e) =>
                        handleUpdateExperience(index, "company", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={exp.location || ""}
                      onChange={(e) =>
                        handleUpdateExperience(index, "location", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={exp.startDate || ""}
                        onChange={(e) =>
                          handleUpdateExperience(index, "startDate", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="End Date"
                        value={exp.endDate || ""}
                        onChange={(e) =>
                          handleUpdateExperience(index, "endDate", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                      />
                    </div>
                  </div>
                  <textarea
                    placeholder="Role description..."
                    rows={2}
                    value={exp.description || ""}
                    onChange={(e) =>
                      handleUpdateExperience(index, "description", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Education</h3>
              <button
                type="button"
                onClick={handleAddEducation}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" /> Add Education
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {form.education.map((edu, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase text-slate-400">
                      Education #{index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="text-xs font-medium text-red-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Institution"
                      required
                      value={edu.institution}
                      onChange={(e) =>
                        handleUpdateEducation(index, "institution", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      required
                      value={edu.degree}
                      onChange={(e) =>
                        handleUpdateEducation(index, "degree", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Field of Study"
                      value={edu.fieldOfStudy || ""}
                      onChange={(e) =>
                        handleUpdateEducation(index, "fieldOfStudy", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={edu.startDate || ""}
                        onChange={(e) =>
                          handleUpdateEducation(index, "startDate", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="End Date"
                        value={edu.endDate || ""}
                        onChange={(e) =>
                          handleUpdateEducation(index, "endDate", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Social Links Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Social Links</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <LinkedinIcon className="h-4 w-4 text-blue-600" /> LinkedIn
                </label>
                <input
                  type="url"
                  value={form.socialLinks.linkedin || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <GithubIcon className="h-4 w-4 text-slate-900" /> GitHub
                </label>
                <input
                  type="url"
                  value={form.socialLinks.github || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, github: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <TwitterIcon className="h-4 w-4 text-sky-500" /> Twitter / X
                </label>
                <input
                  type="url"
                  value={form.socialLinks.twitter || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-emerald-600" /> Portfolio / Website
                </label>
                <input
                  type="url"
                  value={form.socialLinks.portfolio || form.socialLinks.website || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        portfolio: e.target.value,
                        website: e.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#3C65F5] focus:outline-none"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </section>

          {/* Resume Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Resume</h3>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Resume URL
              </label>
              <input
                type="url"
                value={form.resumeUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, resumeUrl: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#3C65F5] focus:outline-none"
                placeholder="https://example.com/my-resume.pdf"
              />
            </div>
          </section>

          {/* Bottom Action Bar */}
          <div className="flex justify-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
          {/* Read-Only View Cards */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Personal Information
            </h3>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Full Name
                </label>
                <p className="text-sm text-slate-900">{profile.name}</p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Email Address
                </label>
                <p className="text-sm text-slate-900">{profile.email}</p>
                <p className="mt-1 text-xs text-slate-400">Read only</p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Phone Number
                </label>
                <p className="text-sm text-slate-900">{profile.phone || "—"}</p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Professional Headline
                </label>
                <p className="text-sm text-slate-900">
                  {profile.headline || "—"}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Bio / About Me
                </label>
                <p className="whitespace-pre-line text-sm text-slate-900">
                  {profile.bio || "—"}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  City
                </label>
                <p className="text-sm text-slate-900">{profile.city || "—"}</p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  State / Country
                </label>
                <p className="text-sm text-slate-900">
                  {[profile.state, profile.country].filter(Boolean).join(", ") || "—"}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Profile Picture URL
                </label>
                <p className="break-all text-sm text-slate-900">
                  {profile.profilePicture || "—"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
            <div className="mt-4">
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No skills added yet.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Experience</h3>
            <div className="mt-4 space-y-4">
              {profile.experience && profile.experience.length > 0 ? (
                profile.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{exp.title}</h4>
                      <p className="text-sm font-medium text-slate-600">
                        {exp.company} {exp.location ? `• ${exp.location}` : ""}
                      </p>
                      {(exp.startDate || exp.endDate) && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          {exp.startDate || "N/A"} - {exp.endDate || "Present"}
                        </p>
                      )}
                      {exp.description && (
                        <p className="mt-2 text-sm text-slate-600">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No experience added yet.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Education</h3>
            <div className="mt-4 space-y-4">
              {profile.education && profile.education.length > 0 ? (
                profile.education.map((edu, index) => (
                  <div
                    key={index}
                    className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                      </h4>
                      <p className="text-sm font-medium text-slate-600">
                        {edu.institution}
                      </p>
                      {(edu.startDate || edu.endDate) && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          {edu.startDate || "N/A"} - {edu.endDate || "N/A"}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No education added yet.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Social Links</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <LinkedinIcon className="h-4 w-4 text-blue-600" /> LinkedIn
                </label>
                {profile.socialLinks?.linkedin ? (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline break-all"
                  >
                    {profile.socialLinks.linkedin}
                  </a>
                ) : (
                  <p className="text-sm text-slate-400">Not added</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <GithubIcon className="h-4 w-4 text-slate-900" /> GitHub
                </label>
                {profile.socialLinks?.github ? (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline break-all"
                  >
                    {profile.socialLinks.github}
                  </a>
                ) : (
                  <p className="text-sm text-slate-400">Not added</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <TwitterIcon className="h-4 w-4 text-sky-500" /> Twitter / X
                </label>
                {profile.socialLinks?.twitter ? (
                  <a
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline break-all"
                  >
                    {profile.socialLinks.twitter}
                  </a>
                ) : (
                  <p className="text-sm text-slate-400">Not added</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-emerald-600" /> Portfolio / Website
                </label>
                {profile.socialLinks?.portfolio || profile.socialLinks?.website ? (
                  <a
                    href={profile.socialLinks.portfolio || profile.socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline break-all"
                  >
                    {profile.socialLinks.portfolio || profile.socialLinks.website}
                  </a>
                ) : (
                  <p className="text-sm text-slate-400">Not added</p>
                )}
              </div>
            </div>
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
        </>
      )}
    </div>
  );
}
