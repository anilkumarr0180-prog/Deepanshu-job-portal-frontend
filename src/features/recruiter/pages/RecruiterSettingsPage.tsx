import { useState } from "react";

import SettingsSection from "../components/settings/SettingsSection";

export default function RecruiterSettingsPage() {
  const [accountEmail, setAccountEmail] = useState("sarah.mitchell@northstarlabs.com");
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [password, setPassword] = useState("********");
  const [emailDigest, setEmailDigest] = useState("Daily");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
        <p className="mt-2 text-sm text-slate-500">Control your account preferences and recruiting workflow settings.</p>
      </div>

      <SettingsSection title="Account" description="Update the main account details for your recruiting workspace.">
        <label className="text-sm text-slate-600">
          <span className="mb-2 block font-medium text-slate-700">Email</span>
          <input value={accountEmail} onChange={(event) => setAccountEmail(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white" />
        </label>
      </SettingsSection>

      <SettingsSection title="Security" description="Manage the security controls available in the workspace.">
        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span>Two-factor authentication</span>
          <input checked={securityEnabled} onChange={() => setSecurityEnabled((value) => !value)} type="checkbox" className="h-4 w-4 rounded border-slate-300" />
        </label>
      </SettingsSection>

      <SettingsSection title="Notifications" description="Choose what recruiting updates you receive.">
        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span>Applicant updates</span>
          <input checked={notificationsEnabled} onChange={() => setNotificationsEnabled((value) => !value)} type="checkbox" className="h-4 w-4 rounded border-slate-300" />
        </label>
      </SettingsSection>

      <SettingsSection title="Appearance" description="Customize the visual experience across the dashboard.">
        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span>Dark mode</span>
          <input checked={darkMode} onChange={() => setDarkMode((value) => !value)} type="checkbox" className="h-4 w-4 rounded border-slate-300" />
        </label>
      </SettingsSection>

      <SettingsSection title="Password" description="Change the password used for your account.">
        <input value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white" />
      </SettingsSection>

      <SettingsSection title="Email Preferences" description="Set the cadence for recruiter email digests.">
        <select value={emailDigest} onChange={(event) => setEmailDigest(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white">
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </SettingsSection>

      <SettingsSection title="Danger Zone" description="Sensitive account actions appear here.">
        <button type="button" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100">
          Deactivate Account
        </button>
      </SettingsSection>
    </div>
  );
}
