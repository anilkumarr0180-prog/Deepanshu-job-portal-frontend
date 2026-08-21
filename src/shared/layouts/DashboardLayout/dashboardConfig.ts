import {
  BellRing,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  Globe,
  LayoutGrid,
  MessageSquare,
  Search,
  Settings,
  UserRound,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface DashboardMenuItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export interface DashboardConfig {
  title: string;
  logo: string;
  welcomeBadge: string;
  menu: readonly DashboardMenuItem[];
}

export const dashboardConfig = {
  recruiter: {
    title: "Recruiter Panel",
    logo: "JobBox",
    welcomeBadge: "Recruiter dashboard",
    menu: [
      { label: "Dashboard", to: "/recruiter/dashboard", icon: LayoutGrid },
      { label: "Jobs", to: "/recruiter/jobs", icon: BriefcaseBusiness },
      { label: "Applicants", to: "/recruiter/applicants", icon: Users },
      { label: "Networking", to: "/recruiter/networking", icon: Globe },
      { label: "Messages", to: "/recruiter/messages", icon: MessageSquare },
      { label: "Company", to: "/recruiter/company", icon: Building2 },
      { label: "Profile", to: "/recruiter/profile", icon: UserRound },
      { label: "Notifications", to: "/recruiter/notifications", icon: BellRing },
      { label: "Interviews", to: "/recruiter/interviews", icon: CalendarDays },
      { label: "Billing", to: "/recruiter/billing", icon: CreditCard },
      { label: "Settings", to: "/recruiter/settings", icon: Settings },
    ],
  },
  candidate: {
    title: "Candidate Panel",
    logo: "JobBox",
    welcomeBadge: "Candidate dashboard",
    menu: [
      { label: "Dashboard", to: "/candidate/dashboard", icon: LayoutGrid },
      { label: "Browse Jobs", to: "/candidate/jobs", icon: Search },
      { label: "Networking", to: "/candidate/networking", icon: Globe },
      { label: "Saved Jobs", to: "/candidate/saved", icon: Bookmark },
      { label: "Applied Jobs", to: "/candidate/applied", icon: BriefcaseBusiness },
      { label: "Messages", to: "/candidate/messages", icon: MessageSquare },
      { label: "Profile", to: "/candidate/profile", icon: UserRound },
      { label: "Resume", to: "/candidate/resume", icon: FileText },
      { label: "Billing", to: "/candidate/billing", icon: CreditCard },
      { label: "Settings", to: "/candidate/settings", icon: Settings },
    ],
  },

  admin: {
    title: "Admin Panel",
    logo: "JobBox",
    welcomeBadge: "Admin dashboard",
    menu: [
      { label: "Dashboard", to: "/admin/dashboard", icon: LayoutGrid },
      { label: "Users", to: "/admin/users", icon: Users },
      { label: "Recruiters", to: "/admin/recruiters", icon: Building2 },
      { label: "Jobs", to: "/admin/jobs", icon: BriefcaseBusiness },
      { label: "Membership Plans", to: "/admin/memberships", icon: Zap },
      { label: "Finance & Billing", to: "/admin/finance", icon: CreditCard },
      { label: "Profile", to: "/admin/profile", icon: UserRound },
      { label: "Settings", to: "/admin/settings", icon: Settings },
    ],
  },
} as const;

export type DashboardRole = keyof typeof dashboardConfig;

export function getDashboardConfig(role?: string | null): DashboardConfig {
  const normalizedRole =
    (role?.toLowerCase() as DashboardRole | undefined) ?? "recruiter";

  return dashboardConfig[normalizedRole] ?? dashboardConfig.recruiter;
}