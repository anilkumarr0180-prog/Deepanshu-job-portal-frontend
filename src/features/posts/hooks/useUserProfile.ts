import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export interface ExperienceItem {
  title: string;
  company: string;
  location?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  current?: boolean;
  description?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  current?: boolean;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
  website?: string;
}

export interface FullUserProfile {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: "candidate" | "recruiter" | "admin";
  profilePicture?: string;
  phone?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  experience?: ExperienceItem[];
  education?: EducationItem[];
  city?: string;
  state?: string;
  country?: string;
  socialLinks?: SocialLinks;
  resumeUrl?: string;
  designation?: string;
  department?: string;
  companyId?: {
    _id?: string;
    name?: string;
    logo?: string;
    website?: string;
    description?: string;
  } | string;
  createdAt?: string;
}

export function useUserProfile(userId?: string, enabled = true) {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await axiosInstance.get<{ success: boolean; data: FullUserProfile }>(
        `/profile/${userId}`
      );
      return res.data.data;
    },
    enabled: Boolean(userId && enabled),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
