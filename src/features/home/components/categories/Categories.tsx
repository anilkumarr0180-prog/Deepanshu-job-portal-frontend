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
    keywords: ["marketing", "sale", "sales", "seo", "media", "growth"],
  },
  {
    id: "customer-help",
    title: "Customer Help",
    searchKey: "Customer",
    icon: Headset,
    keywords: ["customer", "support", "help", "service", "client"],
  },
  {
    id: "finance",
    title: "Finance",
    searchKey: "Finance",
    icon: Landmark,
    keywords: ["finance", "bank", "accountant", "accounting", "audit"],
  },
  {
    id: "software",
    title: "Software",
    searchKey: "Software",
    icon: Lightbulb,
    keywords: ["software", "developer", "engineer", "react", "frontend", "backend", "fullstack", "node"],
  },
  {
    id: "hr",
    title: "Human Resource",
    searchKey: "Human Resource",
    icon: UserRound,
    keywords: ["human resource", "hr", "recruiter", "talent", "people"],
  },
  {
    id: "management",
    title: "Management",
    searchKey: "Management",
    icon: BriefcaseBusiness,
    keywords: ["management", "manager", "lead", "director", "head"],
  },
  {
    id: "design",
    title: "Design",
    searchKey: "Design",
    icon: Palette,
    keywords: ["design", "ui", "ux", "graphic", "figma", "designer"],
  },
  {
    id: "technology",
    title: "Technology",
    searchKey: "Technology",
    icon: MonitorSmartphone,
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
      };
    });
  }, [jobs]);

  const totalJobsCount = data?.pagination?.totalJobs ?? jobs?.length ?? 0;
  const subtitleCount = totalJobsCount > 0 ? `${totalJobsCount}+` : "800+";

  return (
    <section className="bg-white pt-14 pb-8 sm:pt-20 sm:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Heading */}
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#05264E] sm:text-5xl">
            Browse by category
          </h2>

          <p className="mt-3 text-base text-slate-500 sm:text-lg">
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