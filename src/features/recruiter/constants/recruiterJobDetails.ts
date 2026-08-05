import type { RecruiterJobDetails } from "../types";

export const recruiterJobDetails: RecruiterJobDetails = {
  id: "job-1",
  title: "Senior Frontend Engineer",
  company: "Northstar Labs",
  status: "Active",
  postedDate: "Posted on Jul 20, 2025",
  lastUpdated: "Updated 2 hours ago",
  employmentType: "Full Time",
  experienceLevel: "5+ Years",
  salary: "$140k - $180k USD",
  location: "Remote • US / Canada",
  description: [
    "Northstar Labs is looking for a Senior Frontend Engineer to help shape the next generation of our product experience.",
    "You will work closely with product, design, and backend teams to ship polished, performant, and accessible interfaces for our B2B platform.",
    "This role is ideal for someone who enjoys leading technical decisions, mentoring engineers, and translating product vision into excellent software.",
  ],
  skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Accessibility", "Performance"],
  stats: [
    { label: "Views", value: "1,284", description: "This week" },
    { label: "Applicants", value: "42", description: "Qualified leads" },
    { label: "Shortlisted", value: "11", description: "Ready for review" },
    { label: "Rejected", value: "18", description: "Not a fit" },
    { label: "Interview Scheduled", value: "6", description: "Next 7 days" },
  ],
  applicants: [
    {
      id: "cand-1",
      candidate: "Alicia Chen",
      experience: "7 years",
      appliedDate: "Jul 24",
      status: "Shortlisted",
    },
    {
      id: "cand-2",
      candidate: "Marcus Hill",
      experience: "5 years",
      appliedDate: "Jul 22",
      status: "Interview",
    },
    {
      id: "cand-3",
      candidate: "Priya Singh",
      experience: "8 years",
      appliedDate: "Jul 21",
      status: "Pending",
    },
  ],
};
