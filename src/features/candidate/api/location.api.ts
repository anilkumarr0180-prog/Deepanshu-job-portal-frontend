import { axiosInstance } from "@/lib/axios";

export interface LocationDetail {
  formattedName: string;
  city: string;
  area: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export async function saveUserDetectedLocationApi(location: LocationDetail) {
  try {
    const response = await axiosInstance.post("/location/current", location);
    return response.data;
  } catch (err) {
    console.warn("Failed to sync detected location with server profile:", err);
    return null;
  }
}
