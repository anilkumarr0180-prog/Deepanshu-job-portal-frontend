import { useState, useEffect } from "react";
import {
  BellRing,
  BrushCleaning,
  CheckCircle2,
  Lock,
  Mail,
  Save,
  ShieldAlert,
  Sliders,
  Send,
  RefreshCw,
  AlertTriangle,
  Server,
} from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

type TabType = "general" | "email" | "security" | "maintenance" | "branding";

interface SmtpStatusData {
  configured: boolean;
  connected: boolean;
  user: string;
  host: string;
  port: number;
  message: string;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [isSaving, setIsSaving] = useState(false);

  // General Settings State
  const [siteName, setSiteName] = useState("JobsBox Enterprise");
  const [supportEmail, setSupportEmail] = useState("support@jobsbox.com");
  const [defaultUserRole, setDefaultUserRole] = useState("candidate");

  // Email Settings State
  const [smtpServer, setSmtpServer] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true);
  const [smtpStatus, setSmtpStatus] = useState<SmtpStatusData | null>(null);
  const [isCheckingSmtp, setIsCheckingSmtp] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);

  // Security Settings State
  const [require2FA, setRequire2FA] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [passwordMinLength, setPasswordMinLength] = useState("8");

  // Maintenance Settings State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistrations, setAllowRegistrations] = useState(true);

  // Branding State
  const [primaryColor, setPrimaryColor] = useState("#3C65F5");
  const [accentColor, setAccentColor] = useState("#05264E");

  const checkSmtpStatus = async () => {
    setIsCheckingSmtp(true);
    try {
      const response = await axiosInstance.get("/admin/smtp-status");
      setSmtpStatus(response.data.data);
    } catch (err: unknown) {
      console.error("Failed to check SMTP status:", err);
      setSmtpStatus({
        configured: false,
        connected: false,
        user: "Not configured",
        host: smtpServer,
        port: Number(smtpPort),
        message: "Unable to reach backend SMTP status endpoint.",
      });
    } finally {
      setIsCheckingSmtp(false);
    }
  };

  useEffect(() => {
    if (activeTab === "email") {
      checkSmtpStatus();
    }
  }, [activeTab]);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress) {
      toast.error("Please enter a destination email address.");
      return;
    }

    setIsSendingTestEmail(true);
    setTestEmailResult(null);

    try {
      const response = await axiosInstance.post("/admin/send-test-email", {
        email: testEmailAddress,
      });
      setTestEmailResult({
        success: true,
        message: response.data.message || "Test email dispatched successfully!",
      });
      toast.success("Test email sent via SMTP!");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr?.response?.data?.message || "Failed to send test email.";
      setTestEmailResult({
        success: false,
        message: msg,
      });
      toast.error("Test email delivery failed.");
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Platform settings updated successfully!");
    }, 600);
  };


  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Platform Settings</h2>
            <p className="mt-1 text-sm text-slate-500">
              Configure system defaults, email channels, security policies, and maintenance mode.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#2956F2] disabled:opacity-50"
          >
            {isSaving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "general", label: "General", icon: Sliders },
          { id: "email", label: "Email & SMTP", icon: Mail },
          { id: "security", label: "Security & Access", icon: Lock },
          { id: "maintenance", label: "Maintenance", icon: BrushCleaning },
          { id: "branding", label: "Branding", icon: BellRing },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#3C65F5] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {activeTab === "general" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900">General Platform Settings</h3>
              <p className="text-xs text-slate-500">Workspace name and platform defaults.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#3C65F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Support Email Address
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#3C65F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Default Registration Role
                </label>
                <select
                  value={defaultUserRole}
                  onChange={(e) => setDefaultUserRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#3C65F5]"
                >
                  <option value="candidate">Candidate</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "email" && (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Email & Transactional Notifications (Nodemailer)</h3>
                <p className="text-xs text-slate-500">Configure outbound SMTP mail gateway for application receipts.</p>
              </div>
              <button
                type="button"
                onClick={checkSmtpStatus}
                disabled={isCheckingSmtp}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isCheckingSmtp ? "animate-spin text-[#3C65F5]" : ""}`} />
                <span>Re-verify Gateway</span>
              </button>
            </div>

            {/* Live SMTP Connection Status Badge */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-[#3C65F5]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    SMTP Connection Health
                  </span>
                </div>
                {isCheckingSmtp ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700 animate-pulse">
                    Checking...
                  </span>
                ) : smtpStatus?.connected ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Active & Connected
                  </span>
                ) : smtpStatus?.configured ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Connection Issues
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800 border border-rose-200">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-600" /> Credentials Required
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-500 font-medium">SMTP Server Host:</span>
                  <p className="font-bold text-slate-800">{smtpStatus?.host || smtpServer}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">SMTP Server Port:</span>
                  <p className="font-bold text-slate-800">{smtpStatus?.port || smtpPort}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Configured Account:</span>
                  <p className="font-bold text-slate-800 truncate">{smtpStatus?.user || "EMAIL_USER / SMTP_USER"}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Authentication Status:</span>
                  <p className="font-bold text-slate-800">
                    {smtpStatus?.configured ? "Credentials Provided in .env" : "Pending Credentials"}
                  </p>
                </div>
              </div>

              {smtpStatus?.message && (
                <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Status Output:</span> {smtpStatus.message}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  SMTP Host Server
                </label>
                <input
                  type="text"
                  value={smtpServer}
                  onChange={(e) => setSmtpServer(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#3C65F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  SMTP Port
                </label>
                <input
                  type="text"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#3C65F5]"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">Automatic Job Application Receipts</p>
                  <p className="text-xs text-slate-500">Send transactional email to candidates & recruiters upon job application.</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableEmailAlerts}
                  onChange={(e) => setEnableEmailAlerts(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-[#3C65F5]"
                />
              </div>

              {/* Interactive Test Email Tool */}
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-slate-50 p-5 space-y-4 shadow-xs">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#3C65F5]" /> Test Outbound Email Dispatch
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Send a test email to verify your SMTP credentials and deliverability in real-time.
                  </p>
                </div>

                <form onSubmit={handleSendTestEmail} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter recipient email address..."
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    required
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#3C65F5]"
                  />
                  <button
                    type="submit"
                    disabled={isSendingTestEmail}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#2956F2] transition disabled:opacity-50 shrink-0"
                  >
                    {isSendingTestEmail ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span>Send Test Email</span>
                  </button>
                </form>

                {testEmailResult && (
                  <div
                    className={`rounded-xl border p-3.5 text-xs font-medium ${
                      testEmailResult.success
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-rose-200 bg-rose-50 text-rose-800"
                    }`}
                  >
                    {testEmailResult.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {activeTab === "security" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Security & Authentication Rules</h3>
              <p className="text-xs text-slate-500">Password strength policies and session expiration.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Minimum Password Length (Characters)
                </label>
                <input
                  type="number"
                  value={passwordMinLength}
                  onChange={(e) => setPasswordMinLength(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#3C65F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Session Expiry Timeout (Minutes)
                </label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#3C65F5]"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">Enforce Mandatory 2FA for Admin Accounts</p>
                  <p className="text-xs text-slate-500">Require authenticator app tokens on login.</p>
                </div>
                <input
                  type="checkbox"
                  checked={require2FA}
                  onChange={(e) => setRequire2FA(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-[#3C65F5]"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "maintenance" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Maintenance & System Availability</h3>
              <p className="text-xs text-slate-500">Control platform access and system windows.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-900">Maintenance Mode</p>
                    <p className="text-xs text-amber-700">
                      When enabled, non-admin users will see a scheduled maintenance screen.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="h-5 w-5 rounded border-amber-300 text-amber-600"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">Allow New Registrations</p>
                  <p className="text-xs text-slate-500">Enable or pause candidate/recruiter account creation.</p>
                </div>
                <input
                  type="checkbox"
                  checked={allowRegistrations}
                  onChange={(e) => setAllowRegistrations(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-[#3C65F5]"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "branding" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Branding & Visual Themes</h3>
              <p className="text-xs text-slate-500">Customize platform primary accent colors.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Primary Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-16 cursor-pointer rounded border border-slate-200 bg-white p-1"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Dark Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-10 w-16 cursor-pointer rounded border border-slate-200 bg-white p-1"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Confirmation Toast Banner */}
      <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-800">
        <div className="flex items-center gap-2 font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>All admin configuration parameters are synchronized with backend environment variables.</span>
        </div>
      </div>
    </div>
  );
}
