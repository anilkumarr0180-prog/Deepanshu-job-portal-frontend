import { Link } from "react-router-dom";
import type { LocationData } from "./locationData";

interface LocationCardProps {
  location: LocationData;
}

export default function LocationCard({ location }: LocationCardProps) {
  const { city, country, image, badge, vacancies, companies } = location;

  return (
    <Link
      to={`/jobs?location=${encodeURIComponent(`${city}, ${country}`)}`}
      className="card-image-top hover-up group block overflow-hidden rounded-[16px] border border-[rgba(6,18,36,0.1)] bg-white transition-all duration-300 hover:border-[#3C65F5] hover:shadow-[0_10px_25px_rgba(6,18,36,0.06)] hover:-translate-y-1 dark:border-[#1E293B] dark:bg-[#131D2E] select-none"
    >
      {/* Image Container */}
      <div className="relative h-[215px] w-full overflow-hidden">
        <img
          src={image}
          alt={`${city}, ${country}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge — frosted glass style matching JobBox */}
        {badge && (
          <span className="absolute left-[20px] top-[20px] rounded-[4px] bg-[rgba(255,255,255,0.25)] backdrop-blur-[6px] border border-white/30 px-[12px] py-[3px] text-[12px] font-semibold text-white shadow-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-[20px_24px]">
        {/* City, Country */}
        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-bold leading-[24px] text-[#05264E] transition-colors group-hover:text-[#3C65F5] dark:text-[#F1F5F9] dark:group-hover:text-[#5E81FF]">
          {city}, {country}
        </h3>

        {/* Vacancy + Companies row */}
        <div className="mt-[10px] flex items-center justify-between font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#A0ABB8] dark:text-slate-400">
          <span>{vacancies} Vacancy</span>
          <span>{companies} companies</span>
        </div>
      </div>
    </Link>
  );
}
