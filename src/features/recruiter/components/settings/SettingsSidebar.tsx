import {
  User,
  Building2,
  Briefcase,
  Bell,
  KeyRound,
  SunMoon,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

export type RecruiterSettingsCategory =
  | "account"
  | "profile"
  | "hiring"
  | "notifications"
  | "security"
  | "appearance"
  | "billing";

interface CategoryItem {
  id: RecruiterSettingsCategory;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const SETTINGS_CATEGORIES: CategoryItem[] = [
  {
    id: "account",
    label: "Account",
    description: "Name, email, avatar & phone",
    icon: User,
  },
  {
    id: "profile",
    label: "Profile & Company",
    description: "Recruiting role & company info",
    icon: Building2,
  },
  {
    id: "hiring",
    label: "Hiring Preferences",
    description: "Job defaults & posting presets",
    icon: Briefcase,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Real-time alerts & audio cues",
    icon: Bell,
  },
  {
    id: "security",
    label: "Security",
    description: "Password & authentication",
    icon: KeyRound,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Light, dark & system themes",
    icon: SunMoon,
  },
  {
    id: "billing",
    label: "Billing",
    description: "Active plan & feature quotas",
    icon: CreditCard,
  },
];

interface SettingsSidebarProps {
  activeCategory: RecruiterSettingsCategory;
  onSelectCategory: (category: RecruiterSettingsCategory) => void;
  unreadCount?: number;
}

export default function SettingsSidebar({
  activeCategory,
  onSelectCategory,
  unreadCount = 0,
}: SettingsSidebarProps) {
  return (
    <div>
      {/* Mobile Selector / Segmented Tabs */}
      <div className="lg:hidden mb-6">
        <label htmlFor="mobile-settings-nav" className="sr-only">
          Select Settings Category
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
          {SETTINGS_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#3C65F5] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/90"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{cat.label}</span>
                {cat.id === "notifications" && unreadCount > 0 && (
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                      isActive ? "bg-white text-blue-600" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Vertical Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xs space-y-1">
          <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Settings Menu
          </div>

          {SETTINGS_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all group cursor-pointer ${
                  isActive
                    ? "bg-blue-50/80 text-[#3C65F5] font-bold border border-blue-100"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#3C65F5] text-white shadow-xs"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm tracking-tight ${isActive ? "font-bold text-[#3C65F5]" : "font-semibold"}`}>
                      {cat.label}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {cat.id === "notifications" && unreadCount > 0 && (
                  <span className="shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
