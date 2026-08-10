import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";
import SettingsSection from "../components/settings/SettingsSection";

export default function RecruiterSettingsPage() {
  const { user } = useAuth();

  const [accountEmail, setAccountEmail] = useState(user?.email ?? "");
  const [recruiterName, setRecruiterName] = useState(user?.name ?? "");
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [password, setPassword] = useState("");
  const [emailDigest, setEmailDigest] = useState("Daily");
  const [isSaving, setIsSaving] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleSaveAccount = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Account settings updated successfully!");
    }, 500);
  };

  const handlePasswordChange = (e: FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    toast.success("Password updated successfully!");
    setPassword("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">Recruiter Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage your hiring profile, notifications, and security options.
        </p>
      </div>

      <form onSubmit={handleSaveAccount}>
        <SettingsSection
          title="Account Information"
          description="Update your primary workspace contact details."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-600">
              <span className="mb-1.5 block font-medium text-slate-700">Full Name</span>
              <input
                type="text"
                value={recruiterName}
                onChange={(event) => setRecruiterName(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-[#3C65F5]"
              />
            </label>

            <label className="text-sm text-slate-600">
              <span className="mb-1.5 block font-medium text-slate-700">Email Address</span>
              <input
                type="email"
                value={accountEmail}
                onChange={(event) => setAccountEmail(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-[#3C65F5]"
              />
            </label>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-[#3C65F5] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#2956F2] disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Account Info"}
            </button>
          </div>
        </SettingsSection>
      </form>

      <SettingsSection
        title="Security & 2FA"
        description="Manage security controls for your recruiter workspace."
      >
        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span>Enable Two-Factor Authentication (2FA)</span>
          <input
            checked={securityEnabled}
            onChange={() => setSecurityEnabled((value) => !value)}
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-[#3C65F5]"
          />
        </label>
      </SettingsSection>

      <SettingsSection
        title="Candidate Notifications"
        description="Choose what applicant updates you receive."
      >
        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span>Instant email notification on new job applications</span>
          <input
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled((value) => !value)}
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-[#3C65F5]"
          />
        </label>
      </SettingsSection>

      <SettingsSection
        title="Appearance"
        description="Customize display theme."
      >
        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span>Dark Mode (Beta)</span>
          <input
            checked={darkMode}
            onChange={() => setDarkMode((value) => !value)}
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-[#3C65F5]"
          />
        </label>
      </SettingsSection>

      <form onSubmit={handlePasswordChange}>
        <SettingsSection
          title="Change Password"
          description="Update your password."
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 text-sm text-slate-700 outline-none focus:border-[#3C65F5]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="h-11 rounded-xl bg-slate-900 px-5 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              Update Password
            </button>
          </div>
        </SettingsSection>
      </form>

      <SettingsSection
        title="Email Digest Cadence"
        description="Set how often you receive application digests."
      >
        <select
          value={emailDigest}
          onChange={(event) => setEmailDigest(event.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-[#3C65F5]"
        >
          <option value="Daily">Daily Summary</option>
          <option value="Weekly">Weekly Summary</option>
          <option value="Realtime">Instant Alert per Application</option>
        </select>
      </SettingsSection>
    </div>
  );
}
