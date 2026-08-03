import {
  BellRing,
  BriefcaseBusiness,
  Building2,
  FileText,
  ShieldCheck,
  Users,
  UserRoundPlus,
} from "lucide-react";

import type { AdminJob, AdminQuickAction, AdminRecruiter, AdminStat, AdminUser } from "../types";

export const adminStats: AdminStat[] = [
  {
    id: "active-users",
    title: "Active Users",
    value: "2.4k",
    trend: "+12% this month",
    icon: Users,
  },
  {
    id: "recruiters",
    title: "Recruiters",
    value: "318",
    trend: "+8 new",
    icon: Building2,
  },
  {
    id: "jobs",
    title: "Live Jobs",
    value: "1,042",
    trend: "+24 today",
    icon: BriefcaseBusiness,
  },
  {
    id: "trust",
    title: "Security Health",
    value: "98%",
    trend: "Excellent",
    icon: ShieldCheck,
  },
];

export const quickActions: AdminQuickAction[] = [
  {
    id: "add-admin",
    label: "Add Admin",
    description: "Create a new admin account",
    icon: UserRoundPlus,
    to: "/admin/users",
  },
  {
    id: "review-recruiters",
    label: "Review Recruiters",
    description: "Inspect pending accounts",
    icon: Building2,
    to: "/admin/recruiters",
  },
  {
    id: "review-jobs",
    label: "Review Jobs",
    description: "Moderate listings and flags",
    icon: FileText,
    to: "/admin/jobs",
  },
  {
    id: "alerts",
    label: "System Alerts",
    description: "Monitor platform health",
    icon: BellRing,
    to: "/admin/settings",
  },
];

export const users: AdminUser[] = [
  {
    id: "u-1",
    name: "Amelia Stone",
    email: "amelia@example.com",
    role: "Candidate",
    status: "Active",
    joinedAt: "2024-08-01",
  },
  {
    id: "u-2",
    name: "Caleb Brooks",
    email: "caleb@example.com",
    role: "Recruiter",
    status: "Pending",
    joinedAt: "2024-07-28",
  },
  {
    id: "u-3",
    name: "Mina Patel",
    email: "mina@example.com",
    role: "Candidate",
    status: "Suspended",
    joinedAt: "2024-07-10",
  },
];

export const recruiters: AdminRecruiter[] = [
  {
    id: "r-1",
    company: "Northstar Studio",
    contactName: "Diana Flores",
    email: "diana@northstar.com",
    status: "Active",
    jobsPosted: 24,
  },
  {
    id: "r-2",
    company: "Lumen Labs",
    contactName: "Ethan Kim",
    email: "ethan@lumenlabs.com",
    status: "Pending",
    jobsPosted: 7,
  },
  {
    id: "r-3",
    company: "Brightlane",
    contactName: "Nia Carter",
    email: "nia@brightlane.io",
    status: "Suspended",
    jobsPosted: 3,
  },
];

export const jobs: AdminJob[] = [
  {
    id: "j-1",
    title: "Senior UI Engineer",
    company: "Northstar Studio",
    recruiter: "Diana Flores",
    applicants: 48,
    status: "Published",
    postedAt: "2024-08-02",
  },
  {
    id: "j-2",
    title: "Product Designer",
    company: "Lumen Labs",
    recruiter: "Ethan Kim",
    applicants: 19,
    status: "Draft",
    postedAt: "2024-07-29",
  },
  {
    id: "j-3",
    title: "Data Analyst",
    company: "Brightlane",
    recruiter: "Nia Carter",
    applicants: 9,
    status: "Archived",
    postedAt: "2024-07-15",
  },
];
