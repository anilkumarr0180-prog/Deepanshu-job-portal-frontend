import { axiosInstance } from "@/lib/axios";

export interface CompanySocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface CompanyPayload {
  name: string;
  description: string;
  logo?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  size?: string;
  foundedYear?: number;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  location?: string;
  tagline?: string;
  overview?: string;
  about?: string;
  socialLinks?: CompanySocialLinks;
}

export interface CompanyResponse extends CompanyPayload {
  _id: string;
  recruiterId?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getMyCompany(): Promise<CompanyResponse | null> {
  try {
    const response = await axiosInstance.get<{
      success: boolean;
      data: CompanyResponse;
    }>("/company/me");
    return response.data.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number } };
    if (axiosError.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function updateMyCompany(
  payload: Partial<CompanyPayload>
): Promise<CompanyResponse> {
  const response = await axiosInstance.put<{
    success: boolean;
    data: CompanyResponse;
  }>("/company/me", payload);
  return response.data.data;
}

export async function createCompany(
  payload: CompanyPayload
): Promise<CompanyResponse> {
  const response = await axiosInstance.post<{
    success: boolean;
    data: CompanyResponse;
  }>("/company", payload);
  return response.data.data;
}
