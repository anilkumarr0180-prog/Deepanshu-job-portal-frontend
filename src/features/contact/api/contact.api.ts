import { axiosInstance } from "@/lib/axios";
import type { ContactFormData, ContactResponse } from "../types/contact.types";

/**
 * Dispatches a contact inquiry to the backend POST /api/contact endpoint.
 */
export async function submitContactMessage(
  data: ContactFormData
): Promise<ContactResponse> {
  const response = await axiosInstance.post<ContactResponse>("/contact", data);
  return response.data;
}
