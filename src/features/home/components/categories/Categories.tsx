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
    variant: "vertical" as const,
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
    <section className="section-box mt-[70px] lg:mt-[80px] bg-white dark:bg-[#0B1220]">
      <div className="container mx-auto max-w-[1140px] px-[12px]">
        {/* Top Heading */}
        <div className="text-center">
          <h2 className="section-title text-[36px] font-bold tracking-[-0.015em] text-[#05264E] dark:text-[#F1F5F9] leading-[45px] mb-[10px] font-['Plus_Jakarta_Sans',sans-serif]">
            Browse by category
          </h2>

          <p className="font-lg text-[18px] font-normal leading-[26px] text-[#66789C] dark:text-[#94A3B8] font-['Plus_Jakarta_Sans',sans-serif]">
            Find the job that's perfect for you. about {subtitleCount} new jobs everyday
          </p>
        </div>

        {/* Category Carousel Slider */}
        <div className="box-swiper mt-[40px] md:mt-[45px]">
          <CategorySlider categories={dynamicCategories} />
        </div>

        {/* Bottom Hiring Banner */}
        <HiringBanner />
      </div>
    </section>
  );
}