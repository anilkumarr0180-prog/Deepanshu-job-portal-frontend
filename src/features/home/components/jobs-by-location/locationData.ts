// Static location data for the "Jobs by Location" section.
// This is presentation-only configuration — no API or backend is modified.

import location1 from "@/assets/images/locations/location1.png";
import location2 from "@/assets/images/locations/location2.png";
import location3 from "@/assets/images/locations/location3.png";
import location4 from "@/assets/images/locations/location4.png";
import location5 from "@/assets/images/locations/location5.png";
import location6 from "@/assets/images/locations/location6.png";

export type BadgeType = "Hot" | "Trending" | null;

export interface LocationData {
  id: number;
  city: string;
  country: string;
  image: string;
  badge: BadgeType;
  vacancies: number;
  companies: number;
}

export const LOCATIONS: LocationData[] = [
  {
    id: 1,
    city: "Paris",
    country: "France",
    image: location1,
    badge: "Hot",
    vacancies: 5,
    companies: 120,
  },
  {
    id: 2,
    city: "London",
    country: "England",
    image: location2,
    badge: "Trending",
    vacancies: 7,
    companies: 68,
  },
  {
    id: 3,
    city: "New York",
    country: "USA",
    image: location3,
    badge: "Hot",
    vacancies: 9,
    companies: 80,
  },
  {
    id: 4,
    city: "Amsterdam",
    country: "Holland",
    image: location4,
    badge: null,
    vacancies: 16,
    companies: 86,
  },
  {
    id: 5,
    city: "Copenhagen",
    country: "Denmark",
    image: location5,
    badge: null,
    vacancies: 39,
    companies: 186,
  },
  {
    id: 6,
    city: "Berlin",
    country: "Germany",
    image: location6,
    badge: null,
    vacancies: 15,
    companies: 632,
  },
];
