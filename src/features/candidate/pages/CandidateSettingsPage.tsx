import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Bell,
  KeyRound,
  FileText,
  Upload,
  Trash2,
  Loader2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Volume2,
  Save,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  Check,
  Plus,
  X,
  ShieldCheck,
} from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useNotifications } from "@/shared/context/NotificationContext";
import { useTheme } from "@/shared/context/ThemeContext";
import { useCloudinaryUpload } from "@/shared/hooks/useCloudinaryUpload";
import { changePasswordApi } from "@/features/auth/api/auth.api";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { getAuthenticatedResumeUrl } from "@/shared/api/upload.api";

import SettingsSection from "../components/settings/SettingsSection";
import SettingsSidebar, {
  type CandidateSettingsCategory,
} from "../components/settings/SettingsSidebar";

interface CandidateJobPrefs {
  preferredRoles: string[];
  preferredLocations: string[];
  workMode: "remote" | "hybrid" | "onsite" | "any";
  employmentType: "full-time" | "part-time" | "contract" | "internship" | "any";
  experienceLevel: "entry" | "mid" | "senior" | "lead" | "any";
  minSalary: string;
  currency: "USD" | "INR" | "EUR" | "GBP";
}

interface CandidatePrivacyState {
  profileVisibility: "public" | "recruiter_only" | "private";
  openToOpportunities: boolean;
  allowRecruiterMessages: boolean;
}

const DEFAULT_JOB_PREFS: CandidateJobPrefs = {
  preferredRoles: ["Frontend Developer", "Full Stack Engineer"],
  preferredLocations: ["Remote"],
  workMode: "remote",
  employmentType: "full-time",
  experienceLevel: "mid",
  minSalary: "",
  currency: "USD",
};

const DEFAULT_PRIVACY: CandidatePrivacyState = {
  profileVisibility: "public",
  openToOpportunities: true,
  allowRecruiterMessages: true,
};

export default function CandidateSettingsPage() {
  const { user, refreshUser } = useAuth();
  const { data: profile, isLoading: isProfileLoading, isError, refetch } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const { unreadCount } = useNotifications();
  const { theme, setTheme } = useTheme();
  const { uploadFile, isUploading } = useCloudinaryUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Category Navigation State
  const [activeCategory, setActiveCategory] = useState<CandidateSettingsCategory>("account");

  // 1. Account Form State
  const [accountForm, setAccountForm] = useState({
    name: "",
    phone: "",
    profilePicture: "",
    profilePicturePublicId: "",
  });

  // 2. Profile & Privacy Form State
  const [profileForm, setProfileForm] = useState({
    headline: "",
    bio: "",
    city: "",
    state: "",
    country: "",
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: "",
      twitter: "",
    },
  });

  const [privacySettings, setPrivacySettings] = useState<CandidatePrivacyState>(() => {
    try {
      const saved = localStorage.getItem("jobbox_candidate_privacy_settings");
      if (saved) {
        return { ...DEFAULT_PRIVACY, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PRIVACY;
  });

  // 3. Job Preferences Form State
  const [jobPrefs, setJobPrefs] = useState<CandidateJobPrefs>(() => {
    try {
      const saved = localStorage.getItem("jobbox_candidate_job_preferences");
      if (saved) {
        return { ...DEFAULT_JOB_PREFS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_JOB_PREFS;
  });

  const [roleInput, setRoleInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  // 4. Audio Notification Preference State
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("jobbox_audio_notifications_enabled");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // 5. Security / Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 6. Resume Opening State
  const [isOpeningResume, setIsOpeningResume] = useState(false);

  // Sync profile data from server into local forms
  useEffect(() => {
    if (profile) {
      setAccountForm({
        name: profile.name || "",
        phone: profile.phone || "",
        profilePicture: profile.profilePicture || "",
        profilePicturePublicId: profile.profilePicturePublicId || "",
      });

      setProfileForm({
        headline: profile.headline || "",
        bio: profile.bio || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        socialLinks: {
          linkedin: profile.socialLinks?.linkedin || "",
          github: profile.socialLinks?.github || "",
          portfolio: profile.socialLinks?.portfolio || "",
          twitter: profile.socialLinks?.twitter || "",
        },
      });
    }
  }, [profile]);

  // Handle Avatar Upload
  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await uploadFile(file, "profile");
    if (res) {
      setAccountForm((prev) => ({
        ...prev,
        profilePicture: res.secure_url,
        profilePicturePublicId: res.public_id,
      }));
      toast.success("Photo uploaded! Click 'Save Changes' to update your account.");
    }
  };

  // Handle Remove Avatar
  const handleRemoveAvatar = () => {
    setAccountForm((prev) => ({
      ...prev,
      profilePicture: "",
      profilePicturePublicId: "",
    }));
    toast.success("Avatar cleared. Click 'Save Changes' to apply.");
  };

  // Handle Account Form Save
  const handleSaveAccount = (e: FormEvent) => {
    e.preventDefault();
    if (!accountForm.name.trim()) {
      toast.error("Full Name is required.");
      return;
    }

    updateProfileMutation.mutate(
      {
        name: accountForm.name.trim(),
        phone: accountForm.phone.trim(),
        profilePicture: accountForm.profilePicture,
        profilePicturePublicId: accountForm.profilePicturePublicId,
      },
      {
        onSuccess: () => {
          void refreshUser();
          void refetch();
        },
      }
    );
  };

  // Handle Profile & Privacy Save
  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();

    // Persist privacy settings
    try {
      localStorage.setItem(
        "jobbox_candidate_privacy_settings",
        JSON.stringify(privacySettings)
      );
    } catch {
      // Ignored
    }

    updateProfileMutation.mutate(
      {
        headline: profileForm.headline.trim(),
        bio: profileForm.bio.trim(),
        city: profileForm.city.trim(),
        state: profileForm.state.trim(),
        country: profileForm.country.trim(),
        socialLinks: profileForm.socialLinks,
      },
      {
        onSuccess: () => {
          toast.success("Profile & privacy settings updated!");
          void refetch();
        },
      }
    );
  };

  // Handle Job Preferences Tag Addition
  const handleAddRole = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const trimmed = roleInput.trim();
    if (trimmed && !jobPrefs.preferredRoles.includes(trimmed)) {
      setJobPrefs((prev) => ({
        ...prev,
        preferredRoles: [...prev.preferredRoles, trimmed],
      }));
      setRoleInput("");
    }
  };

  const handleRemoveRole = (role: string) => {
    setJobPrefs((prev) => ({
      ...prev,
      preferredRoles: prev.preferredRoles.filter((r) => r !== role),
    }));
  };

  const handleAddLocation = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const trimmed = locationInput.trim();
    if (trimmed && !jobPrefs.preferredLocations.includes(trimmed)) {
      setJobPrefs((prev) => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, trimmed],
      }));
      setLocationInput("");
    }
  };

  const handleRemoveLocation = (loc: string) => {
    setJobPrefs((prev) => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter((l) => l !== loc),
    }));
  };

  // Handle Save Job Preferences
  const handleSaveJobPrefs = (e: FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        "jobbox_candidate_job_preferences",
        JSON.stringify(jobPrefs)
      );
      toast.success("Job preferences saved successfully!");
    } catch {
      toast.error("Failed to save job preferences.");
    }
  };

  // Handle Toggle Audio Chime
  const handleToggleAudio = (enabled: boolean) => {
    setAudioAlertsEnabled(enabled);
    localStorage.setItem(
      "jobbox_audio_notifications_enabled",
      JSON.stringify(enabled)
    );
    toast.success(
      enabled ? "Notification chime enabled." : "Notification chime muted."
    );
  };

  // Test Notification Audio Chime
  const handleTestAudioChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
      toast.success("Played test chime! 🔔");
    } catch {
      toast.error("Audio playback blocked by browser.");
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (!passwordForm.currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/;
    if (!regex.test(passwordForm.newPassword)) {
      toast.error(
        "Password must contain uppercase, lowercase, number, and a special character."
      );
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePasswordApi({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Password updated successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg =
        axiosErr.response?.data?.message ||
        "Failed to update password. Verify your current password.";
      toast.error(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Password strength meter score
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const pwdScore = getPasswordStrength(passwordForm.newPassword);

  // Handle Open Authenticated Resume
  const handleOpenResume = async () => {
    if (!profile?.resumeUrl && !profile?.resumePublicId) return;

    if (profile.resumePublicId) {
      try {
        setIsOpeningResume(true);
        const res = await getAuthenticatedResumeUrl({
          publicId: profile.resumePublicId,
        });
        if (res?.url) {
          window.open(res.url, "_blank", "noopener,noreferrer");
        } else {
          window.open(profile.resumeUrl, "_blank", "noopener,noreferrer");
        }
      } catch {
        window.open(profile.resumeUrl, "_blank", "noopener,noreferrer");
      } finally {
        setIsOpeningResume(false);
      }
    } else if (profile.resumeUrl) {
      window.open(profile.resumeUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (isProfileLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        <div className="grid gap-6 lg:grid-cols-[288px_1fr]">
          <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 hidden lg:block" />
          <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center max-w-2xl mx-auto my-12">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-red-900">Failed to load candidate settings</h3>
        <p className="mt-1 text-xs text-red-600">
          We encountered an issue retrieving your account details from the server.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar
              src={accountForm.profilePicture || profile?.profilePicture}
              name={accountForm.name || profile?.name || user?.name}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Candidate Settings
                </h1>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                  {profile.headline || "Job Candidate"}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Manage your candidate profile, job preferences, notification alerts, and security credentials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/candidate/profile"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              <span>View Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="lg:flex lg:items-start lg:gap-6">
        {/* Left Vertical Navigation */}
        <SettingsSidebar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          unreadCount={unreadCount}
        />

        {/* Right Content Panel */}
        <main className="flex-1 min-w-0">
          {/* ========================================================================= */}
          {/* CATEGORY 1: ACCOUNT */}
          {/* ========================================================================= */}
          {activeCategory === "account" && (
            <form onSubmit={handleSaveAccount} className="space-y-6">
              <SettingsSection
                title="Account Details"
                description="Your personal identity, avatar, and contact information."
              >
                {/* Avatar Upload */}
                <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                    <div className="relative group flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-slate-100 shadow-xs">
                      {accountForm.profilePicture ? (
                        <img
                          src={accountForm.profilePicture}
                          alt="Candidate Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserAvatar
                          name={accountForm.name || profile?.name}
                          size="lg"
                        />
                      )}

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                      >
                        <Upload className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <p className="text-xs font-bold text-slate-800">Profile Photo</p>
                      <p className="text-[11px] text-slate-500">
                        Upload a clean professional portrait. Max 5MB (.jpg, .png, .webp).
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition disabled:opacity-50"
                        >
                          {isUploading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                          ) : (
                            <Upload className="h-3.5 w-3.5 text-slate-500" />
                          )}
                          <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
                        </button>

                        {accountForm.profilePicture && (
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 shadow-2xs transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={accountForm.name}
                      onChange={(e) =>
                        setAccountForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="e.g. John Doe"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        value={profile.email}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-2.5 rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        Read-only
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={accountForm.phone}
                      onChange={(e) =>
                        setAccountForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="e.g. +1 555 123 4567"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Account Role
                    </label>
                    <div className="flex items-center h-[42px] px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700">
                      <span className="capitalize">{profile.role || "Candidate"}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#2f55e0] transition disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{updateProfileMutation.isPending ? "Saving..." : "Save Account"}</span>
                  </button>
                </div>
              </SettingsSection>
            </form>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 2: PROFILE & PRIVACY */}
          {/* ========================================================================= */}
          {activeCategory === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <SettingsSection
                title="Professional Profile & Privacy"
                description="Your professional headline, summary bio, location, and visibility permissions."
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      value={profileForm.headline}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, headline: e.target.value }))
                      }
                      placeholder="e.g. Senior Frontend Engineer | React & TypeScript Enthusiast"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, city: e.target.value }))
                        }
                        placeholder="e.g. San Francisco"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        State / Province
                      </label>
                      <input
                        type="text"
                        value={profileForm.state}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, state: e.target.value }))
                        }
                        placeholder="e.g. California"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        value={profileForm.country}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, country: e.target.value }))
                        }
                        placeholder="e.g. United States"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Bio / Summary
                    </label>
                    <textarea
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      placeholder="Briefly describe your career background, expertise, and what drives you..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Social Links */}
                  <div className="pt-2">
                    <p className="text-xs font-bold text-slate-800 mb-3">Online Presence & Links</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={profileForm.socialLinks.linkedin}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                            }))
                          }
                          placeholder="https://linkedin.com/in/username"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none transition focus:border-[#3C65F5]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          GitHub URL
                        </label>
                        <input
                          type="url"
                          value={profileForm.socialLinks.github}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              socialLinks: { ...prev.socialLinks, github: e.target.value },
                            }))
                          }
                          placeholder="https://github.com/username"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none transition focus:border-[#3C65F5]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Portfolio / Website
                        </label>
                        <input
                          type="url"
                          value={profileForm.socialLinks.portfolio}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              socialLinks: { ...prev.socialLinks, portfolio: e.target.value },
                            }))
                          }
                          placeholder="https://myportfolio.dev"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none transition focus:border-[#3C65F5]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Twitter / X
                        </label>
                        <input
                          type="url"
                          value={profileForm.socialLinks.twitter}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                            }))
                          }
                          placeholder="https://twitter.com/username"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none transition focus:border-[#3C65F5]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Privacy & Visibility Settings */}
                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                    <p className="text-xs font-bold text-slate-900">Visibility & Recruiter Permissions</p>

                    <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold text-slate-800">Profile Discoverability</p>
                          <p className="text-[11px] text-slate-500">
                            Control who can view your candidate profile in search and directory.
                          </p>
                        </div>
                        <select
                          value={privacySettings.profileVisibility}
                          onChange={(e) =>
                            setPrivacySettings((prev) => ({
                              ...prev,
                              profileVisibility: e.target.value as any,
                            }))
                          }
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#3C65F5]"
                        >
                          <option value="public">Public (Everyone)</option>
                          <option value="recruiter_only">Verified Recruiters Only</option>
                          <option value="private">Private (Only You)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-200/60">
                        <div>
                          <p className="text-xs font-bold text-slate-800">Open to Opportunities</p>
                          <p className="text-[11px] text-slate-500">
                            Show an active badge indicating you are receptive to new job offers.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setPrivacySettings((prev) => ({
                              ...prev,
                              openToOpportunities: !prev.openToOpportunities,
                            }))
                          }
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            privacySettings.openToOpportunities ? "bg-[#3C65F5]" : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              privacySettings.openToOpportunities ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-200/60">
                        <div>
                          <p className="text-xs font-bold text-slate-800">Direct Recruiter Inquiries</p>
                          <p className="text-[11px] text-slate-500">
                            Allow verified hiring managers to send direct messages to your inbox.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setPrivacySettings((prev) => ({
                              ...prev,
                              allowRecruiterMessages: !prev.allowRecruiterMessages,
                            }))
                          }
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            privacySettings.allowRecruiterMessages ? "bg-[#3C65F5]" : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              privacySettings.allowRecruiterMessages ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#2f55e0] transition disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{updateProfileMutation.isPending ? "Saving..." : "Save Profile & Privacy"}</span>
                  </button>
                </div>
              </SettingsSection>
            </form>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 3: JOB PREFERENCES */}
          {/* ========================================================================= */}
          {activeCategory === "preferences" && (
            <form onSubmit={handleSaveJobPrefs} className="space-y-6">
              <SettingsSection
                title="Career & Job Search Preferences"
                description="Define the roles, work arrangements, and salary expectations that best fit your goals."
              >
                <div className="space-y-6">
                  {/* Preferred Roles Tag Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Job Titles & Roles
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={roleInput}
                        onChange={(e) => setRoleInput(e.target.value)}
                        onKeyDown={handleAddRole}
                        placeholder="e.g. Full Stack Engineer, Tech Lead (press Enter)"
                        className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none transition focus:border-[#3C65F5]"
                      />
                      <button
                        type="button"
                        onClick={handleAddRole}
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                      {jobPrefs.preferredRoles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100"
                        >
                          {role}
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(role)}
                            className="text-blue-400 hover:text-blue-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      {jobPrefs.preferredRoles.length === 0 && (
                        <p className="text-[11px] text-slate-400 italic">No roles added yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Preferred Locations Tag Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Target Locations / Regions
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        onKeyDown={handleAddLocation}
                        placeholder="e.g. Remote, San Francisco, London (press Enter)"
                        className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none transition focus:border-[#3C65F5]"
                      />
                      <button
                        type="button"
                        onClick={handleAddLocation}
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                      {jobPrefs.preferredLocations.map((loc) => (
                        <span
                          key={loc}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200"
                        >
                          {loc}
                          <button
                            type="button"
                            onClick={() => handleRemoveLocation(loc)}
                            className="text-slate-400 hover:text-slate-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      {jobPrefs.preferredLocations.length === 0 && (
                        <p className="text-[11px] text-slate-400 italic">No locations added yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Work Mode & Employment Type */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Work Arrangement
                      </label>
                      <select
                        value={jobPrefs.workMode}
                        onChange={(e) =>
                          setJobPrefs((prev) => ({
                            ...prev,
                            workMode: e.target.value as any,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#3C65F5]"
                      >
                        <option value="remote">Remote Only</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="onsite">On-Site</option>
                        <option value="any">Any Arrangement</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Employment Type
                      </label>
                      <select
                        value={jobPrefs.employmentType}
                        onChange={(e) =>
                          setJobPrefs((prev) => ({
                            ...prev,
                            employmentType: e.target.value as any,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#3C65F5]"
                      >
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="contract">Contract / Freelance</option>
                        <option value="internship">Internship</option>
                        <option value="any">Any Type</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Experience Level
                      </label>
                      <select
                        value={jobPrefs.experienceLevel}
                        onChange={(e) =>
                          setJobPrefs((prev) => ({
                            ...prev,
                            experienceLevel: e.target.value as any,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#3C65F5]"
                      >
                        <option value="entry">Entry Level (0-2 yrs)</option>
                        <option value="mid">Mid Level (3-5 yrs)</option>
                        <option value="senior">Senior Level (5-8 yrs)</option>
                        <option value="lead">Lead / Principal (8+ yrs)</option>
                        <option value="any">Any Experience Level</option>
                      </select>
                    </div>
                  </div>

                  {/* Salary Expectations */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Minimum Annual Salary Expectation
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={jobPrefs.currency}
                          onChange={(e) =>
                            setJobPrefs((prev) => ({
                              ...prev,
                              currency: e.target.value as any,
                            }))
                          }
                          className="w-24 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#3C65F5]"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="INR">INR (₹)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          value={jobPrefs.minSalary}
                          onChange={(e) =>
                            setJobPrefs((prev) => ({ ...prev, minSalary: e.target.value }))
                          }
                          placeholder="e.g. 90000"
                          className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#3C65F5]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setJobPrefs(DEFAULT_JOB_PREFS);
                      toast.success("Preferences reset to defaults.");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                    <span>Reset</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#2f55e0] transition"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Preferences</span>
                  </button>
                </div>
              </SettingsSection>
            </form>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 4: NOTIFICATIONS */}
          {/* ========================================================================= */}
          {activeCategory === "notifications" && (
            <div className="space-y-6">
              <SettingsSection
                title="Notifications & Sound Alerts"
                description="Manage your real-time notifications, audio cues, and channel behaviors."
                actions={
                  <Link
                    to="/candidate/notifications"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    <span>Open Center</span>
                  </Link>
                }
              >
                <div className="space-y-6">
                  {/* Real-time Status Card */}
                  <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-blue-900">Real-Time Notification Feed</p>
                          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-xs text-blue-700 mt-0.5">
                          {unreadCount > 0
                            ? `You currently have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`
                            : "All caught up! No unread notifications."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Audio Chime Notification Setting */}
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">Audio Notification Chime</h4>
                          {audioAlertsEnabled ? (
                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                              Enabled
                            </span>
                          ) : (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              Muted
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          Plays a subtle harmonic chime whenever a recruiter views your application or sends an inquiry.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleTestAudioChime}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Volume2 className="h-3.5 w-3.5 text-blue-600" />
                          <span>Test Sound</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleAudio(!audioAlertsEnabled)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            audioAlertsEnabled ? "bg-[#3C65F5]" : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              audioAlertsEnabled ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Channel Summary */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                      <p className="text-xs font-bold text-slate-800">Application Updates</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Immediate alerts for interview invitations, shortlisting, and hiring outcomes.
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                      <p className="text-xs font-bold text-slate-800">Recruiter Messages</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Real-time notifications for direct messages and connection requests.
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                      <p className="text-xs font-bold text-slate-800">Job Matches</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Recommended job updates tailored to your skills and preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </SettingsSection>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 5: SECURITY */}
          {/* ========================================================================= */}
          {activeCategory === "security" && (
            <div className="space-y-6">
              <SettingsSection
                title="Security & Password"
                description="Manage your account password and security authentication credentials."
              >
                {user?.authProvider === "google" ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-amber-900">Google OAuth Account</h4>
                        <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                          Your account is securely authenticated using Google OAuth. Password changes are handled through your Google Account settings.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Current Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          required
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          placeholder="Enter your current password"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword((prev) => !prev)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            required
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                              }))
                            }
                            placeholder="Min. 8 characters"
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Confirm New Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          placeholder="Re-enter new password"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5]"
                        />
                      </div>
                    </div>

                    {/* Password Strength Meter */}
                    {passwordForm.newPassword && (
                      <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600">Password Strength</span>
                          <span
                            className={`font-bold ${
                              pwdScore <= 50
                                ? "text-amber-600"
                                : pwdScore < 100
                                ? "text-blue-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {pwdScore <= 50
                              ? "Weak"
                              : pwdScore < 100
                              ? "Good"
                              : "Strong"}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              pwdScore <= 50
                                ? "bg-amber-500"
                                : pwdScore < 100
                                ? "bg-blue-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${pwdScore}%` }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 pt-1">
                          <span className={passwordForm.newPassword.length >= 8 ? "text-emerald-600 font-semibold" : ""}>
                            • At least 8 characters
                          </span>
                          <span className={/[A-Z]/.test(passwordForm.newPassword) ? "text-emerald-600 font-semibold" : ""}>
                            • Uppercase letter
                          </span>
                          <span className={/[0-9]/.test(passwordForm.newPassword) ? "text-emerald-600 font-semibold" : ""}>
                            • Number digit
                          </span>
                          <span className={/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? "text-emerald-600 font-semibold" : ""}>
                            • Special symbol
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#2f55e0] transition disabled:opacity-50"
                      >
                        {isChangingPassword ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <KeyRound className="h-4 w-4" />
                        )}
                        <span>{isChangingPassword ? "Updating..." : "Update Password"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </SettingsSection>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 6: APPEARANCE */}
          {/* ========================================================================= */}
          {activeCategory === "appearance" && (
            <div className="space-y-6">
              <SettingsSection
                title="Appearance & Theme"
                description="Customize your JobBox interface aesthetic. Preference persists across sessions."
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Light Theme Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                      theme === "light"
                        ? "border-[#3C65F5] bg-blue-50/40 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-3">
                      <Sun className="h-5 w-5" />
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm font-bold text-slate-900">Light Mode</p>
                      {theme === "light" && (
                        <Check className="h-4 w-4 text-[#3C65F5]" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Crisp, clean white surfaces with high contrast text.
                    </p>
                  </button>

                  {/* Dark Theme Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                      theme === "dark"
                        ? "border-[#3C65F5] bg-blue-50/40 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-slate-100 mb-3">
                      <Moon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm font-bold text-slate-900">Dark Mode</p>
                      {theme === "dark" && (
                        <Check className="h-4 w-4 text-[#3C65F5]" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Sleek dark theme optimized for low-light environments.
                    </p>
                  </button>

                  {/* System Theme Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                      theme === "system"
                        ? "border-[#3C65F5] bg-blue-50/40 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 mb-3">
                      <Laptop className="h-5 w-5" />
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm font-bold text-slate-900">System Default</p>
                      {theme === "system" && (
                        <Check className="h-4 w-4 text-[#3C65F5]" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Automatically syncs with your operating system preferences.
                    </p>
                  </button>
                </div>
              </SettingsSection>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 7: RESUME */}
          {/* ========================================================================= */}
          {activeCategory === "resume" && (
            <div className="space-y-6">
              <SettingsSection
                title="Resume & Documents"
                description="View your active candidate resume or jump to the full Resume Management module."
                actions={
                  <Link
                    to="/candidate/resume"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#2f55e0] transition"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Manage Resume</span>
                  </Link>
                }
              >
                {profile.resumeUrl ? (
                  <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {profile.resumeFileName || "Candidate_Resume.pdf"}
                            </h4>
                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                              Active
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {profile.resumeUploadedAt
                              ? `Uploaded on ${new Date(profile.resumeUploadedAt).toLocaleDateString()}`
                              : "Attached to candidate profile"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleOpenResume}
                          disabled={isOpeningResume}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition disabled:opacity-50"
                        >
                          {isOpeningResume ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                          ) : (
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                          )}
                          <span>Open Resume</span>
                        </button>

                        <Link
                          to="/candidate/resume"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
                        >
                          <span>Replace</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-slate-50/40">
                    <FileText className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800">No Resume Uploaded</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      You have not uploaded a resume yet. Adding a resume significantly boosts your chances with recruiters.
                    </p>
                    <Link
                      to="/candidate/resume"
                      className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#2f55e0] transition"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Resume</span>
                    </Link>
                  </div>
                )}
              </SettingsSection>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
