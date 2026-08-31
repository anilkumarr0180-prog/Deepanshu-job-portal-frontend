import { axiosInstance } from "@/lib/axios";

export interface CandidateExperience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface CandidateEducation {
  _id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
  website?: string;
}

export interface JobPreferences {
  preferredRoles: string[];
  preferredSkills: string[];
  preferredSkillIds?: string[];
  preferredLocations: string[];
  workMode?: "onsite" | "remote" | "hybrid" | null;
  employmentType?:
    | "Full Time"
    | "Part Time"
    | "Contract"
    | "Internship"
    | "Remote"
    | null;
  experienceLevel?: "Fresher" | "1-2 Years" | "3-5 Years" | "5+ Years" | null;
  minSalary?: number | null;
  currency?: string | null;
  salaryPeriod?: "yearly" | "monthly" | "hourly" | null;
}

export interface BackendProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  profilePicture?: string;
  profilePicturePublicId?: string;
  resumeUrl?: string;
  resumePublicId?: string;
  resumeFileName?: string;
  resumeUploadedAt?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  experience?: CandidateExperience[];
  education?: CandidateEducation[];
  city?: string;
  state?: string;
  country?: string;
  socialLinks?: SocialLinks;
  jobPreferences?: JobPreferences;
  designation?: string;
  department?: string;
  companyId?: string | { _id: string; name?: string; logo?: string };
  subscription?: { planCode?: string; status?: string; planId?: any };
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  profilePicture?: string;
  profilePicturePublicId?: string;
  resumeUrl?: string;
  resumePublicId?: string;
  resumeFileName?: string;
  resumeUploadedAt?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  experience?: CandidateExperience[];
  education?: CandidateEducation[];
  city?: string;
  state?: string;
  country?: string;
  socialLinks?: SocialLinks;
  jobPreferences?: Partial<JobPreferences>;
  designation?: string;
  department?: string;
  companyId?: string;
}

interface ProfileApiResponse {
  success: boolean;
  message?: string;
  data: BackendProfile;
}

export async function getProfile(): Promise<BackendProfile> {
  const response = await axiosInstance.get<ProfileApiResponse>("/profile");
  return response.data.data;
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<BackendProfile> {
  const response = await axiosInstance.patch<ProfileApiResponse>(
    "/profile",
    payload
  );
  return response.data.data;
}

