import type { RecruiterJob } from "../types";

export const recruiterJobs: RecruiterJob[] = [
  {
    id: "job-1",
    title: "Senior Frontend Engineer",
    location: "Remote - US",
    type: "Full-time",
    applicants: 42,
    status: "Active",
    postedDate: "Jul 20",
  },
  {
    id: "job-2",
    title: "Product Designer",
    location: "New York, NY",
    type: "Contract",
    applicants: 8,
    status: "Draft",
    postedDate: "Jul 18",
  },
  {
    id: "job-3",
    title: "DevOps Engineer",
    location: "Austin, TX",
    type: "Full-time",
    applicants: 31,
    status: "Closed",
    postedDate: "Jul 10",
  },
  {
    id: "job-4",
    title: "Backend Engineer",
    location: "London, UK",
    type: "Part-time",
    applicants: 15,
    status: "Paused",
    postedDate: "Jun 28",
  },
];
