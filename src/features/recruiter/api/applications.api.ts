import { axiosInstance } from "@/lib/axios";
import type { BackendJob } from "@/features/jobs/utils/jobMapper";
import type {
  BackendApplication,
  BackendApplicationWithJob,
} from "../utils/applicationMapper";

export async function getJobApplications(
  jobId: string
): Promise<BackendApplication[]> {
  const response = await axiosInstance.get(`/jobs/${jobId}/applications`);
  return response.data.data;
}

export async function getAllApplications(): Promise<BackendApplicationWithJob[]> {
  const jobsResponse = await axiosInstance.get("/jobs/my-jobs");
  const jobs: BackendJob[] = jobsResponse.data.data;

  const applicationsByJob = await Promise.all(
    jobs.map(async (job: BackendJob) => {
      try {
        const apps = await getJobApplications(job._id);
        return apps.map(
          (app): BackendApplicationWithJob => ({
            ...app,
            jobTitle: job.title,
          })
        );
      } catch {
        return [];
      }
    })
  );

  return applicationsByJob.flat();
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
