import {
  Megaphone,
  Headset,
  Landmark,
  Lightbulb,
  UserRound,
  MonitorSmartphone,
  BriefcaseBusiness,
  Palette,
} from "lucide-react";

import type { Category } from "./types";

export const categories: Category[] = [
  {
    id: 1,
    title: "Marketing & Sale",
    jobs: 1526,
    icon: Megaphone,
  },
  {
    id: 2,
    title: "Customer Help",
    jobs: 185,
    icon: Headset,
  },
  {
    id: 3,
    title: "Finance",
    jobs: 168,
    icon: Landmark,
  },
  {
    id: 4,
    title: "Software",
    jobs: 1856,
    icon: Lightbulb,
  },
  {
    id: 5,
    title: "Human Resource",
    jobs: 165,
    icon: UserRound,
  },
  {
    id: 6,
    title: "Management",
    jobs: 302,
    icon: BriefcaseBusiness,
  },
  {
    id: 7,
    title: "Design",
    jobs: 420,
    icon: Palette,
  },
  {
    id: 8,
    title: "Technology",
    jobs: 960,
    icon: MonitorSmartphone,
  },
];