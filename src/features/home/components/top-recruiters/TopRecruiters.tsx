import { useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

import { useJobs } from "@/features/jobs/hooks/useJobs";
import RecruiterCard, { type DerivedCompany } from "@/features/recruiter/components/public/RecruiterCard";
import RecruiterCardSkeleton from "@/features/recruiter/components/public/RecruiterCardSkeleton";

export default function TopRecruiters() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const { data, isLoading } = useJobs({ limit: "100" });

  const companies: DerivedCompany[] = useMemo(() => {
    const map = new Map<string, DerivedCompany>();
    if (!data?.jobs) return [];

    data.jobs.forEach((job) => {
      const companyName = job.company?.trim() || "Hiring Company";
      const key = companyName.toLowerCase();
      const logo = job.companyLogo || job.companyId?.logo;

      if (!map.has(key)) {
        map.set(key, {
          id: job.companyId?._id || companyName,
          name: companyName,
          logo: logo,
          location: job.location || "New York, US",
          description: job.description
            ? job.description.split("\n\n")[0]
            : "",
          activeJobsCount: 1,
          rating: 5,
          reviewCount: 25 + (companyName.length * 7) % 65,
          recruiterName: job.recruiterId?.name,
          recruiterEmail: job.recruiterId?.email,
          createdAt: job.createdAt,
          jobs: [job],
        });
      } else {
        const existing = map.get(key)!;
        existing.activeJobsCount += 1;
        if (job.location && (!existing.location || existing.location === "New York, US")) {
          existing.location = job.location;
        }
        if (!existing.logo && logo) {
          existing.logo = logo;
        }
        existing.jobs?.push(job);
        if (!existing.recruiterName && job.recruiterId?.name) {
          existing.recruiterName = job.recruiterId.name;
        }
      }
    });

    return Array.from(map.values());
  }, [data]);

  return (
    <section className="bg-white dark:bg-[#0B1220] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#05264E] dark:text-[#F1F5F9] sm:text-4xl lg:text-[40px]">
            Top Recruiters
          </h2>
          <p className="mt-2.5 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Discover your next career move, freelance gig, or internship
          </p>
        </div>

        {/* Carousel / Slider */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <RecruiterCardSkeleton key={i} />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No recruiters available at the moment.
          </div>
        ) : (
          <div className="relative flex items-center gap-3">
            {/* Custom Navigation - Left Arrow */}
            <button
              type="button"
              aria-label="Previous recruiters"
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF3FF] text-[#3C65F5] transition-all duration-200 hover:bg-[#3C65F5] hover:text-white hover:shadow-md hover:shadow-blue-500/20 active:scale-95 disabled:opacity-40 dark:bg-[#1B2639] dark:text-[#5E81FF] dark:hover:bg-[#3C65F5] dark:hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Swiper Container */}
            <div className="min-w-0 flex-1 overflow-hidden py-2">
              <Swiper
                modules={[Navigation]}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                spaceBetween={20}
                slidesPerView={5}
                breakpoints={{
                  320: {
                    slidesPerView: 1.15,
                    spaceBetween: 14,
                  },
                  480: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 18,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                  },
                  1280: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                  },
                }}
              >
                {companies.map((comp) => (
                  <SwiperSlide key={comp.id} className="!h-auto pb-1">
                    <RecruiterCard company={comp} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Custom Navigation - Right Arrow */}
            <button
              type="button"
              aria-label="Next recruiters"
              onClick={() => swiperRef.current?.slideNext()}
              className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF3FF] text-[#3C65F5] transition-all duration-200 hover:bg-[#3C65F5] hover:text-white hover:shadow-md hover:shadow-blue-500/20 active:scale-95 disabled:opacity-40 dark:bg-[#1B2639] dark:text-[#5E81FF] dark:hover:bg-[#3C65F5] dark:hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

