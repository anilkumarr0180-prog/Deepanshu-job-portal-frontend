import { useMemo } from "react";

import { useJobs } from "@/features/jobs/hooks/useJobs";
import RecruiterCard, { type DerivedCompany } from "@/features/recruiter/components/public/RecruiterCard";
import RecruiterCardSkeleton from "@/features/recruiter/components/public/RecruiterCardSkeleton";

export default function TopRecruiters() {
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
    <section className="section-box pt-[25px] pb-0 lg:pt-[30px] lg:pb-0 bg-white dark:bg-[#0B132B]">
      <div className="mx-auto max-w-[1140px] px-[12px]">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[32px] sm:text-[36px] font-bold leading-[45px] text-[#05264E] dark:text-[#F1F5F9]">
            Top Recruiters
          </h2>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] mt-2 text-[15px] sm:text-[18px] text-[#66789C] leading-[26px] dark:text-slate-400">
            Discover your next career move, freelance gig, or internship
          </p>
        </div>

        {/* Responsive Recruiter Card Grid */}
        {isLoading ? (
          <div className="mt-[40px] lg:mt-[50px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[15px]">
            {Array.from({ length: 10 }).map((_, i) => (
              <RecruiterCardSkeleton key={i} />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="py-12 text-center text-[15px] text-[#66789C] dark:text-slate-400">
            No recruiters available at the moment.
          </div>
        ) : (
          <div className="mt-[40px] lg:mt-[50px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[15px]">
            {companies.map((comp) => (
              <RecruiterCard key={comp.id} company={comp} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

