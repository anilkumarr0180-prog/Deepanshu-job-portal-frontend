import { useState, useEffect, useRef } from "react";
import {
  UserRound,
  Mail,
  Shield,
  UploadCloud,
  CheckCircle2,
  Camera,
  Trash2,
  Save,
  Lock,
  Server,
  Activity,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "@/features/auth/hooks/useAuth";
import { axiosInstance } from "@/lib/axios";
import { useCloudinaryUpload } from "@/shared/hooks/useCloudinaryUpload";
import { UserAvatar } from "@/shared/components/UserAvatar";

export default function AdminProfilePage() {
  const { user, refreshUser } = useAuth();
  const { uploadFile, isUploading, progress } = useCloudinaryUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>(user?.name || "");
  const [phone, setPhone] = useState<string>((user?.phone as string) || "");
  const [profilePicture, setProfilePicture] = useState<string>(user?.profilePicture || "");
  const [isSaving, setIsSaving] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Sync state with user context
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone((user.phone as string) || "");
      setProfilePicture(user.profilePicture || "");
    }
  }, [user]);

  // Handle avatar file selection & live Cloudinary upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadFile(file, "profile");
      if (res && res.secure_url) {
        setProfilePicture(res.secure_url);
        // Automatically save avatar change
        await axiosInstance.patch("/profile", { profilePicture: res.secure_url });
        await refreshUser();
        toast.success("Profile photo updated successfully!");
      }
    } catch (err: any) {
      toast.error("Failed to upload profile picture.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Remove photo
  const handleRemovePhoto = async () => {
    try {
      setProfilePicture("");
      await axiosInstance.patch("/profile", { profilePicture: "" });
      await refreshUser();
      toast.success("Profile photo removed.");
    } catch (err: any) {
      toast.error("Failed to remove profile photo.");
    }
  };

  // Save profile information
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      await axiosInstance.patch("/profile", {
        name: name.trim(),
        phone: phone.trim(),
        profilePicture,
      });
      await refreshUser();
      toast.success("Admin profile details saved successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Update password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await axiosInstance.patch("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success("Admin password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update password. Verify current password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <UserAvatar
                src={profilePicture || user?.profilePicture}
                name={name || user?.name}
                size="lg"
                className="h-20 w-20 text-2xl ring-4 ring-indigo-50 shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-[#3C65F5] text-white shadow-lg hover:bg-blue-700 transition"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900">{name || "Administrator"}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-black text-indigo-700">
                  <Shield className="w-3 h-3" />
                  SUPER ADMIN
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user?.email}</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-3 h-3" /> Verified Root Account
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isUploading ? `Uploading (${progress}%)...` : "Upload New Avatar"}</span>
            </button>
            {profilePicture && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Remove Avatar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Personal Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <UserRound className="w-4 h-4 text-indigo-600" />
              <span>Administrative Identity</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Update your public admin moniker, contact number, and internal details.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / Display Moniker</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Root Email (System Managed)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Direct Contact / Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Administrative Scope</label>
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Root Platform Access & Governance</span>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-100">
                    ROLE_ADMIN_SUPER
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] hover:bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving Changes..." : "Save Profile Details"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Password & Security */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              <span>Rotate Admin Password</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Ensure high entropy passwords to protect platform administration accounts.
            </p>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-sm font-bold text-white shadow-md transition disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isUpdatingPassword ? "Updating Password..." : "Update Security Credentials"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Authority Badges & System Health */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Account Credentials</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Security Clearance</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Level 4 (Super)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Auth Method</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {typeof user?.authProvider === "string" ? user.authProvider : "Local JWT"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Account ID</span>
                <span className="font-mono text-[11px] text-slate-500">{user?._id ? String(user._id) : ""}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500">Member Since</span>
                <span className="font-semibold text-slate-800">
                  {user?.createdAt ? new Date(String(user.createdAt)).toLocaleDateString() : "March 2026"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Cloud Integrations</h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-slate-800">Cloudinary CDN</span>
                </div>
                <span className="font-bold text-emerald-600">Active</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-slate-800">Razorpay Gateway</span>
                </div>
                <span className="font-bold text-emerald-600">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
