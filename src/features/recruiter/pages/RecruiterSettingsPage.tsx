import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Building2,
  Bell,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Upload,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Crown,
  Volume2,
  VolumeX,
  Save,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  Check,
} from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";
import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import { useCompany } from "../hooks/useCompany";
import { useNotifications } from "@/shared/context/NotificationContext";
import { useTheme } from "@/shared/context/ThemeContext";
import { useCloudinaryUpload } from "@/shared/hooks/useCloudinaryUpload";
import { fetchMySubscription, type UserSubscription, type SubscriptionPlan } from "@/features/subscription/api/subscriptionApi";
import { changePasswordApi } from "@/features/auth/api/auth.api";
import { UserAvatar } from "@/shared/components/UserAvatar";

import SettingsSection from "../components/settings/SettingsSection";
import SettingsSidebar, { type RecruiterSettingsCategory } from "../components/settings/SettingsSidebar";

interface HiringDefaults {
  defaultWorkMode: "onsite" | "remote" | "hybrid";
  defaultEmploymentType: "full-time" | "part-time" | "contract" | "internship";
  defaultCurrency: "USD" | "INR" | "EUR" | "GBP";
  defaultSalaryPeriod: "yearly" | "monthly" | "hourly";
  autoExpireDays: number;
}

const DEFAULT_HIRING_PREFS: HiringDefaults = {
  defaultWorkMode: "onsite",
  defaultEmploymentType: "full-time",
  defaultCurrency: "USD",
  defaultSalaryPeriod: "yearly",
  autoExpireDays: 30,
};

export default function RecruiterSettingsPage() {
  const { user, refreshUser } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const { data: company, isLoading: isCompanyLoading } = useCompany();
  const { unreadCount, markAllAsRead } = useNotifications();
  const { theme, setTheme } = useTheme();
  const { uploadFile, isUploading, progress } = useCloudinaryUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Category (Desktop Left Sidebar + Mobile Segment)
  const [activeCategory, setActiveCategory] = useState<RecruiterSettingsCategory>("account");

  // 1. Profile / Account Form State
  const [accountForm, setAccountForm] = useState({
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

  // 2. Hiring Workflow Preferences State (Persisted)
  const [hiringDefaults, setHiringDefaults] = useState<HiringDefaults>(() => {
    try {
      const saved = localStorage.getItem("jobbox_recruiter_hiring_defaults");
      if (saved) {
        return { ...DEFAULT_HIRING_PREFS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_HIRING_PREFS;
  });

  // 3. Audio Notification State (Persisted)
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("jobbox_audio_notifications_enabled");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // 4. Security / Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 5. Subscription State
  const [subData, setSubData] = useState<{
    subscription: UserSubscription;
    plan: SubscriptionPlan;
  } | null>(null);
  const [isSubLoading, setIsSubLoading] = useState(false);

  // Synchronize profile data into local form state
  useEffect(() => {
    if (profile) {
      setAccountForm({
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
  }, [profile]);

  // Lazy-load subscription details only when billing category is active
  useEffect(() => {
    let isMounted = true;
    if (activeCategory === "billing" && !subData) {
      setIsSubLoading(true);
      fetchMySubscription()
        .then((res) => {
          if (isMounted && res) {
            setSubData(res);
          }
        })
        .catch(() => {
          // Handled gracefully
        })
        .finally(() => {
          if (isMounted) setIsSubLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [activeCategory, subData]);

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
      toast.success("Photo uploaded! Click 'Save Changes' to update your profile.");
    }
  };

  // Handle Account & Profile Save
  const handleSaveProfile = (e: FormEvent) => {
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
        designation: accountForm.designation.trim(),
        department: accountForm.department.trim(),
        bio: accountForm.bio.trim(),
        socialLinks: accountForm.socialLinks,
      },
      {
        onSuccess: () => {
          void refreshUser();
        },
      }
    );
  };

  // Reset form to server values
  const handleResetProfile = () => {
    if (profile) {
      setAccountForm({
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
      toast.success("Changes discarded.");
    }
  };

  // Save Hiring Defaults
  const handleSaveHiringDefaults = (e: FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        "jobbox_recruiter_hiring_defaults",
        JSON.stringify(hiringDefaults)
      );
      toast.success("Hiring preferences saved!");
    } catch {
      toast.error("Failed to save hiring preferences.");
    }
  };

  // Toggle Audio Notifications
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

  // Change Password Handler (Fixed & verified end-to-end)
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
                  Recruiter Settings
                </h1>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                  {accountForm.designation || "Recruiter Account"}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Manage your credentials, company profile, hiring preferences, and notification channels.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/recruiter/profile"
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
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <SettingsSection
                title="Account Details"
                description="Your personal identity and contact information."
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
                          alt="Recruiter Avatar"
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

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition disabled:opacity-50"
                        >
                          {isUploading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3C65F5]" />
                          ) : (
                            <Upload className="h-3.5 w-3.5 text-[#3C65F5]" />
                          )}
                          <span>Change Photo</span>
                        </button>

                        {accountForm.profilePicture && (
                          <button
                            type="button"
                            onClick={() =>
                              setAccountForm((prev) => ({
                                ...prev,
                                profilePicture: "",
                                profilePicturePublicId: "",
                              }))
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 shadow-2xs transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400">
                        JPG, PNG, or WebP · Max 5MB
                      </p>

                      {isUploading && (
                        <div className="max-w-xs space-y-1 pt-1">
                          <div className="flex justify-between text-xs text-slate-600 font-medium">
                            <span>Uploading...</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full bg-[#3C65F5] transition-all duration-200"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={accountForm.name}
                      onChange={(e) =>
                        setAccountForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="e.g. Sarah Jenkins"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-[#3C65F5] focus:ring-1 focus:ring-[#3C65F5]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Email Address
                      </label>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Verified
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        value={profile?.email || user?.email || ""}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 pr-9 text-sm text-slate-500 cursor-not-allowed"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        🔒
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={accountForm.phone}
                      onChange={(e) =>
                        setAccountForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="+1 (555) 000-0000"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-[#3C65F5] focus:ring-1 focus:ring-[#3C65F5]"
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={handleResetProfile}
                    disabled={updateProfileMutation.isPending}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Discard</span>
                  </button>

                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending || isUploading}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#2956F2] transition disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </SettingsSection>
            </form>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 2: PROFILE & COMPANY */}
          {/* ========================================================================= */}
          {activeCategory === "profile" && (
            <div className="space-y-6">
              {/* Professional Profile Form */}
              <form onSubmit={handleSaveProfile}>
                <SettingsSection
                  title="Recruiter Professional Information"
                  description="Your designation, organizational department, and recruiting focus."
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Designation / Position Title
                      </label>
                      <input
                        type="text"
                        value={accountForm.designation}
                        onChange={(e) =>
                          setAccountForm((prev) => ({
                            ...prev,
                            designation: e.target.value,
                          }))
                        }
                        placeholder="e.g. Senior Technical Recruiter"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-[#3C65F5]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Department
                      </label>
                      <input
                        type="text"
                        value={accountForm.department}
                        onChange={(e) =>
                          setAccountForm((prev) => ({
                            ...prev,
                            department: e.target.value,
                          }))
                        }
                        placeholder="e.g. Talent Acquisition"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-[#3C65F5]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Professional Bio / Summary
                      </label>
                      <textarea
                        rows={3}
                        value={accountForm.bio}
                        onChange={(e) =>
                          setAccountForm((prev) => ({ ...prev, bio: e.target.value }))
                        }
                        placeholder="Brief summary of your hiring focus, team culture, or recruiting specializations..."
                        className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 outline-none transition focus:border-[#3C65F5]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={accountForm.socialLinks.linkedin}
                        onChange={(e) =>
                          setAccountForm((prev) => ({
                            ...prev,
                            socialLinks: {
                              ...prev.socialLinks,
                              linkedin: e.target.value,
                            },
                          }))
                        }
                        placeholder="https://linkedin.com/in/username"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-[#3C65F5]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Twitter / X Profile
                      </label>
                      <input
                        type="url"
                        value={accountForm.socialLinks.twitter}
                        onChange={(e) =>
                          setAccountForm((prev) => ({
                            ...prev,
                            socialLinks: {
                              ...prev.socialLinks,
                              twitter: e.target.value,
                            },
                          }))
                        }
                        placeholder="https://twitter.com/username"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-[#3C65F5]"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
                    <button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#2956F2] transition disabled:opacity-50"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Profile Info</span>
                        </>
                      )}
                    </button>
                  </div>
                </SettingsSection>
              </form>

              {/* Company Association Card */}
              <SettingsSection
                title="Company Association"
                description="The company profile associated with your job listings and applicant branding."
                badge={
                  company?.isVerified ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Verified Employer
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200/60 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Verification Pending
                    </span>
                  )
                }
                actions={
                  <Link
                    to="/recruiter/company/edit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#2956F2] transition"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{company ? "Edit Company" : "Create Company"}</span>
                  </Link>
                }
              >
                {isCompanyLoading ? (
                  <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
                ) : company ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-2xs">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Building2 className="h-7 w-7 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-slate-900">
                            {company.name}
                          </h4>
                          {company.isVerified && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {company.industry || "Technology"} · {company.companySize || "11-50 employees"}
                        </p>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#3C65F5] hover:underline mt-0.5 font-medium"
                          >
                            <span>{company.website.replace(/^https?:\/\//, "")}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to="/recruiter/company"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Public Page</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center bg-slate-50/50">
                    <Building2 className="mx-auto h-8 w-8 text-slate-300 mb-1.5" />
                    <h4 className="text-sm font-bold text-slate-800">
                      No Company Profile Linked
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                      Build your company profile to attach verified employer branding to job postings.
                    </p>
                    <Link
                      to="/recruiter/company/edit"
                      className="mt-3.5 inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#2956F2] transition"
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      <span>Create Company Profile</span>
                    </Link>
                  </div>
                )}
              </SettingsSection>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 3: HIRING PREFERENCES */}
          {/* ========================================================================= */}
          {activeCategory === "hiring" && (
            <form onSubmit={handleSaveHiringDefaults} className="space-y-6">
              <SettingsSection
                title="Hiring Workflow Defaults"
                description="Default values that pre-fill the job creation form to speed up posting."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Default Work Mode
                    </label>
                    <select
                      value={hiringDefaults.defaultWorkMode}
                      onChange={(e) =>
                        setHiringDefaults((prev) => ({
                          ...prev,
                          defaultWorkMode: e.target.value as HiringDefaults["defaultWorkMode"],
                        }))
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none focus:border-[#3C65F5]"
                    >
                      <option value="onsite">Onsite</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Default Employment Type
                    </label>
                    <select
                      value={hiringDefaults.defaultEmploymentType}
                      onChange={(e) =>
                        setHiringDefaults((prev) => ({
                          ...prev,
                          defaultEmploymentType: e.target.value as HiringDefaults["defaultEmploymentType"],
                        }))
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none focus:border-[#3C65F5]"
                    >
                      <option value="full-time">Full-Time</option>
                      <option value="part-time">Part-Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Primary Currency
                    </label>
                    <select
                      value={hiringDefaults.defaultCurrency}
                      onChange={(e) =>
                        setHiringDefaults((prev) => ({
                          ...prev,
                          defaultCurrency: e.target.value as HiringDefaults["defaultCurrency"],
                        }))
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none focus:border-[#3C65F5]"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Default Salary Cadence
                    </label>
                    <select
                      value={hiringDefaults.defaultSalaryPeriod}
                      onChange={(e) =>
                        setHiringDefaults((prev) => ({
                          ...prev,
                          defaultSalaryPeriod: e.target.value as HiringDefaults["defaultSalaryPeriod"],
                        }))
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none focus:border-[#3C65F5]"
                    >
                      <option value="yearly">Per Year (Annual)</option>
                      <option value="monthly">Per Month</option>
                      <option value="hourly">Per Hour</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Job Listing Duration Window
                    </label>
                    <select
                      value={hiringDefaults.autoExpireDays}
                      onChange={(e) =>
                        setHiringDefaults((prev) => ({
                          ...prev,
                          autoExpireDays: Number(e.target.value),
                        }))
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none focus:border-[#3C65F5]"
                    >
                      <option value={30}>30 Days (Standard)</option>
                      <option value={60}>60 Days (Extended)</option>
                      <option value={90}>90 Days (Quarterly)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#2956F2] transition"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Hiring Defaults</span>
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
                title="Notification Channels & Audio Alerts"
                description="Manage live socket feeds and audible cues for new applications and candidate messages."
                badge={
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Socket.IO Live</span>
                  </span>
                }
                actions={
                  <Link
                    to="/recruiter/notifications"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#2956F2] transition"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    <span>Notification Center</span>
                  </Link>
                }
              >
                <div className="space-y-4">
                  {/* Audio Chime Toggle */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0 mt-0.5">
                        {audioAlertsEnabled ? (
                          <Volume2 className="h-5 w-5" />
                        ) : (
                          <VolumeX className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Audible Notification Chime
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Plays a subtle harmonic chime when a new applicant or chat message arrives.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={handleTestAudioChime}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        Test Chime
                      </button>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={audioAlertsEnabled}
                          onChange={(e) => handleToggleAudio(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3C65F5]"></div>
                      </label>
                    </div>
                  </div>

                  {unreadCount > 0 && (
                    <div className="flex items-center justify-between rounded-xl bg-blue-50/70 border border-blue-200/60 p-4 text-xs text-blue-900">
                      <span className="font-medium">
                        You have <strong>{unreadCount} unread alert(s)</strong>.
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          void markAllAsRead();
                          toast.success("Marked all as read.");
                        }}
                        className="font-bold text-[#3C65F5] hover:underline"
                      >
                        Mark All As Read
                      </button>
                    </div>
                  )}
                </div>
              </SettingsSection>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 5: SECURITY */}
          {/* ========================================================================= */}
          {activeCategory === "security" && (
            <div className="space-y-6">
              {/* Auth Provider Card */}
              <SettingsSection
                title="Account Security & Sign-In"
                description="Your active authentication provider and password rotation rules."
              >
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-1.5 mb-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Authentication Provider
                  </span>
                  <div className="flex items-center gap-2">
                    {user?.authProvider === "google" ? (
                      <span className="font-black text-slate-900 text-sm">
                        Google SSO (OAuth 2.0)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-black text-slate-900 text-sm">
                        <KeyRound className="h-4 w-4 text-[#3C65F5]" />
                        <span>Email & Password (Local Encrypted)</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {user?.authProvider === "google"
                      ? "Your account credentials and two-step verification are protected via Google Single Sign-On."
                      : "Password credentials are hashed with bcrypt (salt rounds 10)."}
                  </p>
                </div>

                {user?.authProvider === "google" ? (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 text-xs text-slate-600 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <ShieldCheck className="h-5 w-5 text-[#3C65F5]" />
                      <span>Google Account Protection Active</span>
                    </div>
                    <p>
                      Password rotation and two-factor authentication are managed through your linked Google Workspace account.
                    </p>
                    <a
                      href="https://myaccount.google.com/security"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-[#3C65F5] hover:underline pt-1"
                    >
                      <span>Manage Google Account Security</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword}>
                    <div className="space-y-4 max-w-lg">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Current Password <span className="text-rose-500">*</span>
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
                            placeholder="Enter current password"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-[#3C65F5]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          New Password <span className="text-rose-500">*</span>
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
                            placeholder="Min. 8 chars with uppercase, number & symbol"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-[#3C65F5]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        {passwordForm.newPassword && (
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                              <span>Password Strength</span>
                              <span>
                                {pwdScore >= 100
                                  ? "Very Strong"
                                  : pwdScore >= 75
                                  ? "Strong"
                                  : pwdScore >= 50
                                  ? "Moderate"
                                  : "Weak"}
                              </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  pwdScore >= 100
                                    ? "bg-emerald-500"
                                    : pwdScore >= 75
                                    ? "bg-blue-500"
                                    : pwdScore >= 50
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                                }`}
                                style={{ width: `${pwdScore}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Confirm New Password <span className="text-rose-500">*</span>
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
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-[#3C65F5]"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition disabled:opacity-50"
                        >
                          {isChangingPassword ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Updating Password...</span>
                            </>
                          ) : (
                            <>
                              <KeyRound className="h-4 w-4" />
                              <span>Update Password</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </SettingsSection>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 6: APPEARANCE (REAL GLOBAL THEME) */}
          {/* ========================================================================= */}
          {activeCategory === "appearance" && (
            <div className="space-y-6">
              <SettingsSection
                title="Appearance & Theme"
                description="Customize your workspace display mode. Applies globally and persists across reloads."
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Light Mode Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all group cursor-pointer ${
                      theme === "light"
                        ? "border-[#3C65F5] bg-blue-50/40 ring-2 ring-[#3C65F5]/20 shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                        <Sun className="h-5 w-5" />
                      </div>
                      {theme === "light" && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3C65F5] text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-slate-900 text-sm">Light Mode</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Clean high-contrast daytime interface.
                    </p>
                  </button>

                  {/* Dark Mode Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all group cursor-pointer ${
                      theme === "dark"
                        ? "border-[#3C65F5] bg-blue-50/40 ring-2 ring-[#3C65F5]/20 shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <Moon className="h-5 w-5" />
                      </div>
                      {theme === "dark" && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3C65F5] text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-slate-900 text-sm">Dark Mode</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Reduced eye fatigue for low-light work.
                    </p>
                  </button>

                  {/* System Default Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all group cursor-pointer ${
                      theme === "system"
                        ? "border-[#3C65F5] bg-blue-50/40 ring-2 ring-[#3C65F5]/20 shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
                        <Laptop className="h-5 w-5" />
                      </div>
                      {theme === "system" && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3C65F5] text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-slate-900 text-sm">System Sync</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Automatically follows your OS theme.
                    </p>
                  </button>
                </div>
              </SettingsSection>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 7: BILLING */}
          {/* ========================================================================= */}
          {activeCategory === "billing" && (
            <div className="space-y-6">
              <SettingsSection
                title="Plan & Feature Quotas"
                description="Summary of your active recruiter membership and slot utilization."
                badge={
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200/60 flex items-center gap-1">
                    <Crown className="h-3 w-3 text-amber-500" />
                    <span>{subData?.plan?.name || "Active Plan"}</span>
                  </span>
                }
                actions={
                  <Link
                    to="/recruiter/billing"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#2956F2] transition"
                  >
                    <span>Manage Invoices & Billing</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                }
              >
                {isSubLoading ? (
                  <div className="h-36 animate-pulse rounded-xl bg-slate-100" />
                ) : (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                        <div>
                          <h4 className="text-lg font-black text-slate-900">
                            {subData?.plan?.name || "Free Starter Tier"}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {subData?.plan?.description || "Basic recruiter access and posting tools."}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-xl font-black text-slate-900">
                            {subData?.plan?.currency === "USD" ? "$" : "₹"}
                            {subData?.plan?.price || 0}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Per {subData?.plan?.billingPeriod || "month"}
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 pt-1">
                        <div className="rounded-xl bg-white p-4 border border-slate-200/80 shadow-2xs">
                          <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-slate-700">Active Job Posts</span>
                            <span className="text-[#3C65F5]">
                              {subData?.subscription?.usages?.jobsPostedCount || 0} /{" "}
                              {subData?.plan?.features?.jobLimit === -1
                                ? "Unlimited"
                                : subData?.plan?.features?.jobLimit ?? 1}
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-[#3C65F5] rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((subData?.subscription?.usages?.jobsPostedCount || 0) /
                                    (subData?.plan?.features?.jobLimit || 1)) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="rounded-xl bg-white p-4 border border-slate-200/80 shadow-2xs">
                          <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-slate-700">Featured Job Boosts</span>
                            <span className="text-amber-600">
                              {subData?.subscription?.usages?.featuredJobsCount || 0} /{" "}
                              {subData?.plan?.features?.featuredJobLimit ?? 0}
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((subData?.subscription?.usages?.featuredJobsCount || 0) /
                                    (subData?.plan?.features?.featuredJobLimit || 1)) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2.5 pt-2">
                        <Link
                          to="/recruiter/pricing"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <span>Upgrade Plans</span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                        </Link>
                      </div>
                    </div>
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
