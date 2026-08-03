import type { RecruiterApplicantDetails, RecruiterApplicantRecord } from "../types";

export const recruiterApplicants: RecruiterApplicantRecord[] = [
  {
    id: "app-1",
    candidate: "Alicia Chen",
    job: "Senior Frontend Engineer",
    experience: "7 years",
    skills: ["React", "TypeScript", "Accessibility"],
    appliedDate: "Jul 24, 2025",
    status: "Shortlisted",
  },
  {
    id: "app-2",
    candidate: "Marcus Hill",
    job: "Product Designer",
    experience: "5 years",
    skills: ["UI Design", "Figma", "User Research"],
    appliedDate: "Jul 22, 2025",
    status: "Interview",
  },
  {
    id: "app-3",
    candidate: "Priya Singh",
    job: "DevOps Engineer",
    experience: "8 years",
    skills: ["AWS", "Kubernetes", "Terraform"],
    appliedDate: "Jul 21, 2025",
    status: "Pending",
  },
  {
    id: "app-4",
    candidate: "Daniel Brooks",
    job: "Backend Engineer",
    experience: "6 years",
    skills: ["Node.js", "PostgreSQL", "Microservices"],
    appliedDate: "Jul 19, 2025",
    status: "Rejected",
  },
];

export const recruiterApplicantDetails: RecruiterApplicantDetails = {
  id: "app-1",
  candidate: "Alicia Chen",
  email: "alicia.chen@email.com",
  phone: "+1 415 555 0147",
  location: "San Francisco, CA",
  experience: "7 years",
  skills: ["React", "TypeScript", "Accessibility", "Design Systems"],
  education: ["B.S. Computer Science, Stanford University", "M.S. Human-Computer Interaction, UC Berkeley"],
  portfolio: "https://alicia.design",
  coverLetter:
    "I am excited to contribute to a team that values thoughtful product design and engineering excellence. I bring a strong background in frontend systems and a collaborative mindset.",
  summary: "Senior frontend engineer with a focus on product experiences, accessibility, and performance.",
  resumeLabel: "Alicia Chen — Resume.pdf",
  notes: [
    "Strong communicator and fast learner.",
    "Great fit for customer-facing workflows.",
  ],
  timeline: [
    { title: "Applied", detail: "Applied to Senior Frontend Engineer", date: "Jul 24, 2025" },
    { title: "Screening", detail: "Recruiter review completed", date: "Jul 25, 2025" },
    { title: "Interview", detail: "Interview scheduled for next week", date: "Jul 27, 2025" },
  ],
};
