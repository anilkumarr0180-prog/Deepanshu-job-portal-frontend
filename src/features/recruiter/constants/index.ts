import {
  BriefcaseBusiness,
  CircleCheckBig,
  MessagesSquare,
  FilePlus2,
  FolderKanban,
  Users,
  Building2,
  BellRing,
  CalendarDays,
} from "lucide-react";

import type { RecruiterApplicant, RecruiterJob, RecruiterStat } from "../types";

export const recruiterStats: RecruiterStat[] = [
  {
    id: "active-jobs",
    title: "Active Jobs",
    value: "12",
    trend: "+3 this week",
    icon: BriefcaseBusiness,
  },
  {
    id: "total-applicants",
    title: "Total Applicants",
    value: "284",
    trend: "+24 new",
    icon: Users,
  },
  {
    id: "interviews",
    title: "Interviews Scheduled",
    value: "18",
    trend: "6 today",
    icon: MessagesSquare,
  },
  {
    id: "jobs-closed",
    title: "Jobs Closed",
    value: "7",
    trend: "2 this month",
    icon: CircleCheckBig,
  },
];

export const quickActions = [
  {
    id: "post-job",
    label: "Post New Job",
    description: "Create a fresh opening",
    icon: FilePlus2,
    to: "/recruiter/jobs/create",
  },
  {
    id: "manage-jobs",
    label: "Manage Jobs",
    description: "Review and edit listings",
    icon: FolderKanban,
    to: "/recruiter/jobs",
  },
  {
    id: "view-applicants",
    label: "View Applicants",
    description: "Screen incoming candidates",
    icon: Users,
    to: "/recruiter/applicants",
  },
  {
    id: "company-profile",
    label: "Company Profile",
    description: "Keep your business info updated",
    icon: Building2,
    to: "/recruiter/company",
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Track recruiter updates",
    icon: BellRing,
    to: "/recruiter/notifications",
  },
  {
    id: "interviews",
    label: "Interviews",
    description: "Review upcoming meetings",
    icon: CalendarDays,
    to: "/recruiter/interviews",
  },
];

export const recentJobs: RecruiterJob[] = [
  {
    id: "job-1",
    title: "Senior Frontend Engineer",
    location: "Remote - US",
    type: "Full-time",
    status: "Active",
    applicants: 42,
    postedDate: "Jul 20",
  },
  {
    id: "job-2",
    title: "Product Designer",
    location: "New York, NY",
    type: "Contract",
    status: "Draft",
    applicants: 8,
    postedDate: "Jul 18",
  },
  {
    id: "job-3",
    title: "DevOps Engineer",
    location: "Austin, TX",
    type: "Full-time",
    status: "Closed",
    applicants: 31,
    postedDate: "Jul 10",
  },
];

export const recentApplicants: RecruiterApplicant[] = [
  {
    id: "applicant-1",
    candidate: "Ava Thompson",
    job: "Senior Frontend Engineer",
    status: "Shortlisted",
    appliedDate: "2h ago",
  },
  {
    id: "applicant-2",
    candidate: "Noah Chen",
    job: "Product Designer",
    status: "Interview",
    appliedDate: "5h ago",
  },
  {
    id: "applicant-3",
    candidate: "Mia Patel",
    job: "DevOps Engineer",
    status: "Pending",
    appliedDate: "Yesterday",
  },
];
