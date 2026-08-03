import type { RecruiterCompanyProfile, RecruiterProfileData, RecruiterNotificationItem, RecruiterInterviewItem } from "../types";

export const recruiterCompanyProfile: RecruiterCompanyProfile = {
  id: "company-1",
  name: "Northstar Labs",
  tagline: "Building smarter hiring experiences for modern teams",
  overview: "Northstar Labs creates people-first hiring software for fast-growing companies.",
  about:
    "We help teams make better hiring decisions with elegant and efficient tools that support every stage of the talent journey.",
  industry: "Software & HR Tech",
  website: "https://northstarlabs.com",
  email: "careers@northstarlabs.com",
  phone: "+1 415 555 0111",
  location: "San Francisco, CA",
  size: "201-500 employees",
  foundedYear: "2018",
  socialLinks: ["LinkedIn", "X", "Instagram"],
  stats: [
    { label: "Total Jobs", value: "24" },
    { label: "Active Jobs", value: "12" },
    { label: "Total Applicants", value: "284" },
    { label: "Total Hires", value: "41" },
  ],
};

export const recruiterProfileData: RecruiterProfileData = {
  id: "recruiter-1",
  name: "Sarah Mitchell",
  position: "Senior Talent Partner",
  email: "sarah.mitchell@northstarlabs.com",
  phone: "+1 415 555 0133",
  bio: "Sarah focuses on building thoughtful hiring journeys and guiding teams through high-impact recruiting decisions.",
  skills: ["Talent Strategy", "Employer Branding", "Interview Design", "Candidate Experience"],
  socialLinks: ["LinkedIn", "Twitter"],
  stats: [
    { label: "Jobs Posted", value: "24" },
    { label: "Applicants Reviewed", value: "184" },
    { label: "Interviews Scheduled", value: "18" },
  ],
};

export const recruiterNotifications: RecruiterNotificationItem[] = [
  {
    id: "notif-1",
    title: "New applicant review",
    message: "Alicia Chen applied to Senior Frontend Engineer.",
    time: "10 min ago",
    type: "Applicant",
    unread: true,
  },
  {
    id: "notif-2",
    title: "Interview reminder",
    message: "Your interview with Marcus Hill is tomorrow at 10:00 AM.",
    time: "1 hour ago",
    type: "Interview",
    unread: true,
  },
  {
    id: "notif-3",
    title: "Job posting published",
    message: "Product Designer posting is now live.",
    time: "Yesterday",
    type: "Job",
    unread: false,
  },
];

export const recruiterInterviews: RecruiterInterviewItem[] = [
  {
    id: "interview-1",
    candidate: "Marcus Hill",
    job: "Product Designer",
    time: "Tomorrow, 10:00 AM",
    status: "Scheduled",
    meetingLink: "https://meet.example.com/abc123",
  },
  {
    id: "interview-2",
    candidate: "Priya Singh",
    job: "DevOps Engineer",
    time: "Thu, 2:30 PM",
    status: "Confirmed",
    meetingLink: "https://meet.example.com/xyz789",
  },
];
