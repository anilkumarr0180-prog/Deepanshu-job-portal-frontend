import {
  Bookmark,
  BriefcaseBusiness,
  FileText,
  Search,
  UserRound,
} from "lucide-react";

import type { CandidateQuickAction } from "../types";

export const quickActions: CandidateQuickAction[] = [
  {
    id: "browse-jobs",
    label: "Browse Jobs",
    description: "Explore fresh opportunities",
    icon: Search,
    to: "/candidate/jobs",
  },
  {
    id: "saved-jobs",
    label: "Saved Jobs",
    description: "Review roles you bookmarked",
    icon: Bookmark,
    to: "/candidate/saved",
  },
  {
    id: "applied-jobs",
    label: "Applied Jobs",
    description: "Track your application status",
    icon: BriefcaseBusiness,
    to: "/candidate/applied",
  },
  {
    id: "resume",
    label: "Resume",
    description: "Update your experience and skills",
    icon: FileText,
    to: "/candidate/resume",
  },
  {
    id: "profile",
    label: "Profile",
    description: "Complete your public profile",
    icon: UserRound,
    to: "/candidate/profile",
  },
];

export interface FilterOption {
  value: string;
  label: string;
}

export const EMPLOYMENT_TYPE_OPTIONS: FilterOption[] = [
  { value: "", label: "All Types" },
  { value: "Full Time", label: "Full Time" },
  { value: "Part Time", label: "Part Time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Remote", label: "Remote" },
];

export const EXPERIENCE_LEVEL_OPTIONS: FilterOption[] = [
  { value: "", label: "All Levels" },
  { value: "Fresher", label: "Fresher" },
  { value: "1-2 Years", label: "1-2 Years" },
  { value: "3-5 Years", label: "3-5 Years" },
  { value: "5+ Years", label: "5+ Years" },
];

export const APPLICATION_STATUS_OPTIONS: FilterOption[] = [
  { value: "", label: "All Statuses" },
  { value: "Applied", label: "Applied" },
  { value: "Shortlisted", label: "Shortlisted" },
  { value: "Interview", label: "Interview" },
  { value: "Rejected", label: "Rejected" },
  { value: "Hired", label: "Hired" },
];

export const SORT_OPTIONS: FilterOption[] = [
  { value: "", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "salary-high", label: "Highest Salary" },
  { value: "salary-low", label: "Lowest Salary" },
];

export const JOBS_PER_PAGE = 12;
export const APPLIED_JOBS_PER_PAGE = 10;
