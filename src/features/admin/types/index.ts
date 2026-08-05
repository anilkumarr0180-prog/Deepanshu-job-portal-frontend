import type { LucideIcon } from "lucide-react";

export interface AdminStat {
  id: string;
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
}

export interface AdminQuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  to: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending" | "Suspended";
  joinedAt: string;
}

export interface AdminRecruiter {
  id: string;
  company: string;
  contactName: string;
  email: string;
  status: "Active" | "Pending" | "Suspended";
  jobsPosted: number;
}

export interface AdminJob {
  id: string;
  title: string;
  company: string;
  recruiter: string;
  applicants: number | string;
  status: "Published" | "Draft" | "Archived";
  postedAt: string;
}
