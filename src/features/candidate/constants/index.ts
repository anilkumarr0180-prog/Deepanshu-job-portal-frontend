import {
  Bookmark,
  Clock3,
  FileText,
  Search,
  Send,
  TrendingUp,
  UserRound,
} from "lucide-react";

import type { CandidateApplication, CandidateJob, CandidateProfileCompletion, CandidateQuickAction, CandidateStat } from "../types";

export const candidateStats: CandidateStat[] = [
  {
    id: "applications",
    title: "Applications",
    value: "14",
    trend: "+3 this month",
    icon: Send,
  },
  {
    id: "saved-jobs",
    title: "Saved Jobs",
    value: "8",
    trend: "2 new matches",
    icon: Bookmark,
  },
  {
    id: "interviews",
    title: "Interviews",
    value: "2",
    trend: "Next week",
    icon: Clock3,
  },
  {
    id: "profile-score",
    title: "Profile Score",
    value: "87%",
    trend: "+5% this week",
    icon: TrendingUp,
  },
];

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

export const recommendedJobs: CandidateJob[] = [
  {
    id: "job-1",
    title: "Senior Product Designer",
    company: "Northstar Studio",
    location: "Remote · US",
    type: "Full-time",
    postedAt: "Posted 2h ago",
    matchScore: 94,
  },
  {
    id: "job-2",
    title: "Frontend Engineer",
    company: "Lumen Labs",
    location: "New York, NY",
    type: "Hybrid",
    postedAt: "Posted today",
    matchScore: 89,
  },
  {
    id: "job-3",
    title: "Customer Success Lead",
    company: "Brightlane",
    location: "Austin, TX",
    type: "Full-time",
    postedAt: "Posted 1d ago",
    matchScore: 85,
  },
];

export const recentApplications: CandidateApplication[] = [
  {
    id: "app-1",
    role: "Lead UX Engineer",
    company: "Northstar Studio",
    status: "Interviewing",
    appliedAt: "Aug 1",
    location: "Remote",
  },
  {
    id: "app-2",
    role: "Product Designer",
    company: "Lumen Labs",
    status: "Under Review",
    appliedAt: "Jul 28",
    location: "New York",
  },
  {
    id: "app-3",
    role: "Operations Analyst",
    company: "Brightlane",
    status: "Applied",
    appliedAt: "Jul 22",
    location: "Austin",
  },
];

export const profileCompletion: CandidateProfileCompletion = {
  percentage: 82,
  completed: ["Personal details", "Work experience", "Skills"],
  remaining: ["Add portfolio", "Upload resume", "Set availability"],
};
