import { LOCATIONS } from "./locationData";
import LocationCard from "./LocationCard";

// Staggered column widths matching JobBox template:
// Row 1: Paris (3 cols - small), London (4 cols - medium), New York (5 cols - large) => 3 + 4 + 5 = 12
// Row 2: Amsterdam (4 cols - medium), Copenhagen (5 cols - large), Berlin (3 cols - small) => 4 + 5 + 3 = 12
const colSpans = [
  "col-span-12 md:col-span-5 lg:col-span-3", // Paris (3 cols - small)
  "col-span-12 md:col-span-7 lg:col-span-4", // London (4 cols - medium)
  "col-span-12 md:col-span-12 lg:col-span-5", // New York (5 cols - large)
  "col-span-12 md:col-span-6 lg:col-span-4", // Amsterdam (4 cols - medium)
  "col-span-12 md:col-span-12 lg:col-span-5", // Copenhagen (5 cols - large)
  "col-span-12 md:col-span-6 lg:col-span-3", // Berlin (3 cols - small)
];

export default function JobsByLocation() {
  return (
    <section className="section-box mt-[50px] bg-white dark:bg-[#0B132B]">
      <div className="container mx-auto max-w-[1140px] px-[12px]">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="section-title mb-[10px] font-['Plus_Jakarta_Sans',sans-serif] text-[36px] font-bold leading-[45px] text-[#05264E] dark:text-[#F1F5F9]">
            Jobs by Location
          </h2>
          <p className="font-lg color-text-paragraph-2 font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-normal leading-[26px] text-[#66789C] dark:text-slate-400">
            Find your favourite jobs and get the benefits of yourself
          </p>
        </div>

        {/* Asymmetrical 12-column responsive grid matching JobBox DevTools */}
        <div className="mt-[40px] lg:mt-[50px] grid grid-cols-12 gap-[24px]">
          {LOCATIONS.map((location, index) => (
            <div
              key={location.id}
              className={colSpans[index % colSpans.length]}
            >
              <LocationCard location={location} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
