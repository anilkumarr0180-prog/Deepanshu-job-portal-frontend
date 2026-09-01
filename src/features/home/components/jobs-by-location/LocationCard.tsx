import type { LocationData } from "./locationData";

interface LocationCardProps {
  location: LocationData;
}

// Badge color map: Hot = orange-tinted pill, Trending = teal/purple-tinted pill
const BADGE_STYLES: Record<string, string> = {
  Hot: "bg-white/90 text-[#E05C1A] border border-[#E05C1A]/20",
  Trending: "bg-white/90 text-[#3C65F5] border border-[#3C65F5]/20",
};

export default function LocationCard({ location }: LocationCardProps) {
  const { city, country, image, badge, vacancies, companies } = location;

  return (
    <div className="group overflow-hidden rounded-xl border border-[#E0E6F7] bg-white transition-all duration-200 hover:border-[#B0C4F8] hover:shadow-[0_4px_16px_rgba(60,101,245,0.08)] dark:border-[#1E293B] dark:bg-[#131D2E] dark:hover:border-[#3C65F5]/50">
      {/* Image Container — fixed aspect ratio 16:9-ish matching reference */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: "56%" }}>
        <img
          src={image}
          alt={`${city}, ${country}`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* Badge — positioned top-left inside the image, only when badge exists */}
        {badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[12px] font-semibold leading-none shadow-sm ${BADGE_STYLES[badge]}`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="px-4 pb-4 pt-3">
        {/* City, Country — dark navy, semi-bold ~17px */}
        <h3 className="text-[17px] font-bold leading-snug text-[#05264E] transition-colors group-hover:text-[#3C65F5] dark:text-[#F1F5F9] dark:group-hover:text-[#5E81FF]">
          {city}, {country}
        </h3>

        {/* Vacancy + Companies row */}
        <div className="mt-2 flex items-end justify-between">
          {/* Vacancy — left, muted gray */}
          <span className="text-[13px] text-[#66789C] dark:text-slate-400">
            {vacancies} Vacancy
          </span>

          {/* Companies — right, muted gray, may wrap to 2 lines as in reference */}
          <span className="text-right text-[13px] leading-snug text-[#66789C] dark:text-slate-400">
            {companies}
            <br />
            companies
          </span>
        </div>
      </div>
    </div>
  );
}
