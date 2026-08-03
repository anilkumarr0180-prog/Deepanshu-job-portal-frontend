import { BellRing, BrushCleaning, Lock, Mail, Settings2 } from "lucide-react";

const sections = [
  {
    title: "General",
    description: "Control the default platform behavior and workspace naming.",
    icon: Settings2,
  },
  {
    title: "Email",
    description: "Configure transactional emails and notification templates.",
    icon: Mail,
  },
  {
    title: "Security",
    description: "Review password rules, 2FA, and access controls.",
    icon: Lock,
  },
  {
    title: "Maintenance",
    description: "Set scheduled maintenance windows and background tasks.",
    icon: BrushCleaning,
  },
  {
    title: "Branding",
    description: "Update the visual identity and display language across the admin area.",
    icon: BellRing,
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
        <p className="mt-2 text-sm text-slate-500">Manage the platform experience with a polished, UI-only configuration center.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <article key={section.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{section.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{section.description}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
