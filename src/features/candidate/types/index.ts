import type { LucideIcon } from "lucide-react";

export interface CandidateStat {
  id: string;
  title: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
}

export interface CandidateQuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  to: string;
}

export interface CandidateJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
}

export interface CandidateApplication {
  id: string;
  role: string;
  company: string;
  status: string;
  appliedAt: string;
  location: string;
}

export interface CandidateProfileCompletion {
  percentage: number;
  completed: string[];
  remaining: string[];
}
