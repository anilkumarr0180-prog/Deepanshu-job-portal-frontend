import type { LucideIcon } from "lucide-react";

export interface Category {
  id: number | string;
  title: string;
  searchKey?: string;
  jobs: number;
  icon: LucideIcon;
  variant?: "vertical" | "horizontal";
}