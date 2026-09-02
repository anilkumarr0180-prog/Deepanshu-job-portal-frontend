import { LOCATIONS } from "./locationData";
import LocationCard from "./LocationCard";

export default function JobsByLocation() {
  return (
    <section className="section-box mt-[50px] bg-white dark:bg-[#0B132B]">
      <div className="container mx-auto max-w-[1140px] px-[12px]">
        {/* Section Header — matches JobBox DevTools inspection */}
        <div className="text-center">
          <h2 className="section-title mb-[10px] font-['Plus_Jakarta_Sans',sans-serif] text-[36px] font-bold leading-[45px] text-[#05264E] dark:text-[#F1F5F9]">
            Jobs by Location
          </h2>
          <p className="font-lg color-text-paragraph-2 font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-normal leading-[26px] text-[#66789C] dark:text-slate-400">
            Find your favourite jobs and get the benefits of yourself
          </p>
        </div>

        {/* 3-column responsive grid */}
        <div className="mt-[40px] lg:mt-[50px] grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </div>
    </section>
  );
}
