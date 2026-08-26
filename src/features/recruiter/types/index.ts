import type { ComponentType } from "react";

export interface RecruiterStat {
  id: string;
  title: string;
  value: string;
  trend?: string;
  icon: ComponentType<{ className?: string }>;
}

export interface RecruiterDashboardResponse {
  totalJobs: number;
  activeJobs: number;
  draftJobs: number;
  closedJobs: number;
  totalApplications: number;
}

export type RecruiterJobStatus = "Active" | "Draft" | "Closed";

export interface RecruiterJob {
  id: string;
  title: string;
  location: string;
  type: string;
  applicants: number;
  status: RecruiterJobStatus;
  postedDate: string;
}

export interface RecruiterApplicant {
  id: string;
  candidate: string;
  job: string;
  status: RecruiterApplicantStatus;
  appliedDate: string;
}

export type RecruiterApplicantStatus = "Applied" | "Under Review" | "Pending" | "Shortlisted" | "Interview" | "Rejected" | "Hired";

export interface RecruiterApplicantRecord {
  id: string;
  candidate: string;
  job: string;
  experience: string;
  skills: string[];
  appliedDate: string;
  status: RecruiterApplicantStatus;
  interviewDetails?: {
    mode?: "video" | "in-person" | "phone";
    date?: string;
    time?: string;
    type?: string;
    locationOrLink?: string;
    notes?: string;
    timezone?: string;
  };
}

export interface RecruiterApplicantDetails {
  id: string;
  candidate: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string[];
  education: string[];
  portfolio: string;
  coverLetter: string;
  summary: string;
  resumeLabel: string;
  notes: string[];
  timeline: Array<{
    title: string;
    detail: string;
    date: string;
  }>;
}

export interface RecruiterCompanyProfile {
  id: string;
  name: string;
  logo?: string;
  tagline: string;
  overview: string;
  about: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  size: string;
  foundedYear: string;
  socialLinks: string[];
  stats: Array<{
    label: string;
    value: string;
  }>;
}

export interface RecruiterProfileData {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  bio: string;
  skills: string[];
  socialLinks: string[];
  stats: Array<{
    label: string;
    value: string;
  }>;
}

export interface RecruiterNotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "Job" | "Applicant" | "Interview" | "System";
  unread: boolean;
}

export interface RecruiterInterviewItem {
  id: string;
  candidate: string;
  job: string;
  time: string;
  status: "Scheduled" | "Confirmed" | "Pending";
  meetingLink: string;
}

export interface RecruiterJobDetailsStat {
  label: string;
  value: string;
  description: string;
}

export interface RecruiterApplicantPreview {
  id: string;
  candidate: string;
  experience: string;
  appliedDate: string;
  status: "Shortlisted" | "Interview" | "Pending";
}

export interface RecruiterJobDetails {
  id: string;
  title: string;
  company: string;
  status: RecruiterJobStatus;
  postedDate: string;
  lastUpdated: string;
  employmentType: string;
  experienceLevel: string;
  salary: string;
  location: string;
  description: string[];
  skills: string[];
  stats: RecruiterJobDetailsStat[];
  applicants: RecruiterApplicantPreview[];
}

export type RecruiterJobAction = "view" | "edit" | "delete";
