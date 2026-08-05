import {
  FilePlus2,
  FolderKanban,
  Users,
  Building2,
  BellRing,
  CalendarDays,
} from "lucide-react";

import type { RecruiterJob } from "../types";

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
