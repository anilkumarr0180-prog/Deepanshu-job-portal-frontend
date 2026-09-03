import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Search,
  Globe,
  Bookmark,
  BriefcaseBusiness,
  MessageSquare,
  UserRound,
  FileText,
  CreditCard,
  Settings,
  Users,
  Building2,
  BellRing,
  CalendarDays,
  ShieldCheck,
  FolderTree,
  DollarSign,
  Crown,
  BookOpen,
} from "lucide-react";

export interface DashboardMenuItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export interface DashboardRoleConfig {
  title: string;
  logo: string;
  welcomeBadge: string;
  menu: readonly DashboardMenuItem[];
}

export const dashboardConfig: Record<"recruiter" | "candidate" | "admin", DashboardRoleConfig> = {
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
      { label: "My Blogs", to: "/recruiter/blogs", icon: BookOpen },
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
      { label: "My Blogs", to: "/candidate/blogs", icon: BookOpen },
      { label: "Profile", to: "/candidate/profile", icon: UserRound },
      { label: "Resume", to: "/candidate/resume", icon: FileText },
      { label: "Notifications", to: "/candidate/notifications", icon: BellRing },
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
      { label: "Jobs", to: "/admin/jobs", icon: BriefcaseBusiness },
      { label: "Categories", to: "/admin/categories", icon: FolderTree },
      { label: "Blogs", to: "/admin/blogs", icon: BookOpen },
      { label: "Finance", to: "/admin/finance", icon: DollarSign },
      { label: "Memberships", to: "/admin/memberships", icon: Crown },
      { label: "Security", to: "/admin/security", icon: ShieldCheck },
      { label: "Profile", to: "/admin/profile", icon: UserRound },
      { label: "Settings", to: "/admin/settings", icon: Settings },
    ],
  },
};

export type DashboardRole = keyof typeof dashboardConfig;

export const getDashboardConfig = (role?: string | null): DashboardRoleConfig => {
  if (role === "admin") return dashboardConfig.admin;
  if (role === "recruiter") return dashboardConfig.recruiter;
  return dashboardConfig.candidate;
};
