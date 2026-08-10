import { axiosInstance } from "@/lib/axios";
import type { BackendJob } from "@/features/jobs/utils/jobMapper";
import type {
  BackendApplication,
  BackendApplicationWithJob,
} from "../utils/applicationMapper";

export async function getJobApplications(
  jobId: string
): Promise<BackendApplication[]> {
  try {
    const response = await axiosInstance.get(`/jobs/${jobId}/applications`);
    const data = response.data?.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && Array.isArray(data.items)) return data.items;
    return [];
  } catch (err) {
    console.error(`Failed to fetch applications for job ${jobId}:`, err);
    return [];
  }
}

export async function getAllApplications(): Promise<BackendApplicationWithJob[]> {
  // 1. Primary dedicated endpoint for recruiter applications
  try {
    const recruiterAppsRes = await axiosInstance.get("/applications/recruiter");
    const rawData = recruiterAppsRes.data?.data;
    if (Array.isArray(rawData)) return rawData;
    if (rawData && typeof rawData === "object" && Array.isArray(rawData.items)) return rawData.items;
  } catch {
    // Suppress error and proceed to fallback mechanism
  }

  // 2. Fallback: Fetch my-jobs + per-job applications
  try {
    const jobsResponse = await axiosInstance.get("/jobs/my-jobs");
    const rawJobs = jobsResponse.data?.data;
    const jobs: BackendJob[] = Array.isArray(rawJobs)
      ? rawJobs
      : rawJobs && typeof rawJobs === "object" && Array.isArray(rawJobs.items)
      ? rawJobs.items
      : [];

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return [];
    }

    const applicationsByJob = await Promise.all(
      jobs.map(async (job: BackendJob) => {
        try {
          const apps = await getJobApplications(job._id);
          return apps.map(
            (app): BackendApplicationWithJob => ({
              ...app,
              jobTitle: job.title || (app as any).jobId?.title || "Job Application",
            })
          );
        } catch {
          return [];
        }
      })
    );

    return applicationsByJob.flat();
  } catch (error) {
    console.error("Failed to load recruiter applications:", error);
    return [];
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string
): Promise<BackendApplication> {
  const response = await axiosInstance.put(
    `/applications/${applicationId}/status`,
    { status }
  );
  return response.data.data;
}
