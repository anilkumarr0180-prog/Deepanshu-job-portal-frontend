import { z } from "zod";

export interface HeadquartersInfo {
  name: string;
  addressLines: string[];
  phone: string;
  email: string;
  mapUrl: string;
}

export interface BranchOffice {
  city: string;
  address: string;
}

export interface OfficeColumnGroup {
  id: string;
  offices: BranchOffice[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  ratingCount: number;
  location: string;
  socials?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "Please agree to the terms and policy",
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}
