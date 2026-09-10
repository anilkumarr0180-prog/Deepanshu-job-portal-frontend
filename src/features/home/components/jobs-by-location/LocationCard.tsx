import { Link } from "react-router-dom";
import type { LocationData } from "./locationData";

interface LocationCardProps {
  location: LocationData;
}

export default function LocationCard({ location }: LocationCardProps) {
  const { city, country, image, badge, vacancies, companies } = location;

  return (
    <div className="card-image-top hover-up group h-full rounded-[16px] border border-[#E0E6F7] bg-white p-[12px_12px_20px] transition-all duration-300 hover:border-[#3C65F5] hover:shadow-[0_10px_25px_rgba(6,18,36,0.06)] hover:-translate-y-1 dark:border-[#1E293B] dark:bg-[#131D2E] select-none">
      {/* Image Container — 261px height, #B4C0E0 fallback bg, mb-15px */}
      <Link
        to={`/jobs?location=${encodeURIComponent(`${city}, ${country}`)}`}
        className="relative block h-[261px] w-full overflow-hidden rounded-[12px] bg-[#B4C0E0] mb-[15px]"
      >
        <img
          src={image}
          alt={`${city}, ${country}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge — 14px Plus Jakarta Sans, #3C65F5 color, #E0E6F7 bg, 24px height, 0 10px padding */}
        {badge && (
          <span className="lbl-hot absolute left-[12px] top-[12px] inline-flex h-[24px] items-center rounded-[4px] bg-[#E0E6F7] px-[10px] text-[14px] font-medium leading-[24px] text-[#3C65F5]">
            {badge}
          </span>
        )}
      </Link>

      {/* Card Body */}
      <div className="px-[4px]">
        {/* City, Country */}
        <Link
          to={`/jobs?location=${encodeURIComponent(`${city}, ${country}`)}`}
        >
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-bold leading-[24px] text-[#05264E] transition-colors hover:text-[#3C65F5] dark:text-[#F1F5F9] dark:hover:text-[#5E81FF]">
            {city}, {country}
          </h3>
        </Link>

        {/* Vacancy + Companies row */}
        <div className="mt-[6px] flex items-center justify-between font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-normal text-[#A0ABB8] dark:text-slate-400">
          <span>{vacancies} Vacancy</span>
          <span>{companies} companies</span>
        </div>
      </div>
    </div>
  );
}
