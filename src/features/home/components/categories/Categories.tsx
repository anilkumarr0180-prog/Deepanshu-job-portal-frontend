import { useMemo } from "react";
import {
  BriefcaseBusiness,
  Headset,
  Landmark,
  Lightbulb,
  Megaphone,
  MonitorSmartphone,
  Palette,
  UserRound,
} from "lucide-react";

import { useJobs } from "@/features/jobs/hooks/useJobs";
import CategorySlider from "./CategorySlider";
import HiringBanner from "./HiringBanner";
import type { Category } from "./types";

const CATEGORY_DEFINITIONS = [
  {
    id: "marketing",
    title: "Marketing & Sale",
    searchKey: "Marketing",
    icon: Megaphone,
    variant: "vertical" as const,
    keywords: ["marketing", "sale", "sales", "seo", "media", "growth"],
  },
  {
    id: "customer-help",
    title: "Customer Help",
    searchKey: "Customer",
    icon: Headset,
    variant: "vertical" as const,
    keywords: ["customer", "support", "help", "service", "client"],
  },
  {
    id: "finance",
    title: "Finance",
    searchKey: "Finance",
    icon: Landmark,
    variant: "horizontal" as const,
    keywords: ["finance", "bank", "accountant", "accounting", "audit"],
  },
  {
    id: "software",
    title: "Software",
    searchKey: "Software",
    icon: Lightbulb,
    variant: "horizontal" as const,
    keywords: ["software", "developer", "engineer", "react", "frontend", "backend", "fullstack", "node"],
  },
  {
    id: "hr",
    title: "Human Resource",
    searchKey: "Human Resource",
    icon: UserRound,
    variant: "vertical" as const,
    keywords: ["human resource", "hr", "recruiter", "talent", "people"],
  },
  {
    id: "management",
    title: "Management",
    searchKey: "Management",
    icon: BriefcaseBusiness,
    variant: "vertical" as const,
    keywords: ["management", "manager", "lead", "director", "head"],
  },
  {
    id: "design",
    title: "Design",
    searchKey: "Design",
    icon: Palette,
    variant: "horizontal" as const,
    keywords: ["design", "ui", "ux", "graphic", "figma", "designer"],
  },
  {
    id: "technology",
    title: "Technology",
    searchKey: "Technology",
    icon: MonitorSmartphone,
    variant: "horizontal" as const,
    keywords: ["technology", "tech", "data", "cloud", "devops", "security"],
  },
];

export default function Categories() {
  const { data } = useJobs({ limit: "100" });

  const jobs = data?.jobs;

  const dynamicCategories: Category[] = useMemo(() => {
    const activeJobs = jobs ?? [];

    return CATEGORY_DEFINITIONS.map((def) => {
      // Calculate exact dynamic job count per category from database
      const count = activeJobs.filter((job) => {
        const text = `${job.title} ${job.description} ${job.skills.join(" ")}`.toLowerCase();
        return def.keywords.some((kw) => text.includes(kw));
      }).length;

      return {
        id: def.id,
        title: def.title,
        searchKey: def.searchKey,
        jobs: count,
        icon: def.icon,
        variant: def.variant,
      };
    });
  }, [jobs]);

  const totalJobsCount = data?.pagination?.totalJobs ?? jobs?.length ?? 0;
  const subtitleCount = totalJobsCount > 0 ? `${totalJobsCount}+` : "800+";

  return (
    <section className="bg-white dark:bg-[#0B1220] pt-14 pb-8 sm:pt-20 sm:pb-12">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Top Heading */}
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#05264E] dark:text-[#F1F5F9] sm:text-4xl lg:text-[42px]">
            Browse by category
          </h2>

          <p className="mt-3 text-base text-[#66789C] dark:text-slate-400 sm:text-lg">
            Find the job that's perfect for you. about {subtitleCount} new jobs everyday
          </p>
        </div>

        {/* Category Carousel Slider */}
        <CategorySlider categories={dynamicCategories} />

        {/* Bottom Hiring Banner */}
        <HiringBanner />
      </div>
    </section>
  );
}