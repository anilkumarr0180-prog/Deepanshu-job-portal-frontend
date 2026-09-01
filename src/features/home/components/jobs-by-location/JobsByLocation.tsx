import { LOCATIONS } from "./locationData";
import LocationCard from "./LocationCard";

export default function JobsByLocation() {
  return (
    <section className="bg-white dark:bg-[#0B1220] py-10 sm:py-12">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        {/* Section Header — centered, matches reference */}
        <div className="mb-8 text-center">
          <h2 className="text-[32px] font-extrabold tracking-tight text-[#05264E] dark:text-[#F1F5F9]">
            Jobs by Location
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Find your favourite jobs and get the benefits of yourself
          </p>
        </div>

        {/* 3-column responsive grid — no carousel, no arrows */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </div>
    </section>
  );
}
