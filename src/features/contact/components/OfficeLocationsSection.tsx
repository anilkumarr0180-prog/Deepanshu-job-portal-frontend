import { Link } from "react-router-dom";
import { HEADQUARTERS, OFFICE_COLUMNS } from "../data/officeLocations";

export default function OfficeLocationsSection() {
  return (
    <section className="section-box mt-[50px] lg:mt-[80px]">
      <div className="container mx-auto max-w-[1140px] px-[12px]">
        <div className="box-info-contact rounded-[16px] bg-[#F2F6FD] pt-[50px] px-[20px] sm:px-[30px] lg:px-[40px] pb-[20px] dark:bg-[#151F32]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[24px]">
            
            {/* Column 1: Headquarters & Primary Contact */}
            <div className="mb-[30px]">
              {/* JobBox Logo: Cube Icon + Brand Name inline */}
              <Link
                to="#"
                className="inline-flex items-center gap-[10px] mb-[18px] transition-opacity hover:opacity-90"
                aria-label="JobBox Corporation"
              >
                <svg
                  className="h-[28px] w-auto shrink-0"
                  viewBox="0 0 29 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 10.3508L14.5 2V19.6126L0 27.2042V10.3508Z" fill="#91A9FF" />
                  <path d="M28.9241 10.3508L14.4241 2V19.6126L28.9241 27.2042V10.3508Z" fill="#5E81FF" />
                  <path d="M14.4241 19.6126L28.9241 27.2042L14.4241 34.7958L-7.23942e-06 27.2042L14.4241 19.6126Z" fill="#3C65F5" />
                </svg>
                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-bold leading-[24px] text-[#05264E] dark:text-[#F1F5F9]">
                  {HEADQUARTERS.name}
                </span>
              </Link>

              {/* Address & Contact Details */}
              <div className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[22px] text-[#4F5E64] dark:text-slate-400 mb-[16px]">
                {HEADQUARTERS.addressLines.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
                <div>
                  Phone:{" "}
                  <a
                    href={`tel:${HEADQUARTERS.phone.replace(/[^0-9+]/g, "")}`}
                    className="text-[#4F5E64] dark:text-slate-400 hover:text-[#3C65F5] dark:hover:text-[#5E81FF] transition-colors"
                  >
                    {HEADQUARTERS.phone}
                  </a>
                </div>
                <div>
                  Email:{" "}
                  <a
                    href={`mailto:${HEADQUARTERS.email}`}
                    className="text-[#4F5E64] dark:text-slate-400 hover:text-[#3C65F5] dark:hover:text-[#5E81FF] transition-colors"
                  >
                    {HEADQUARTERS.email}
                  </a>
                </div>
              </div>

              {/* View Map Link */}
              <a
                href={HEADQUARTERS.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-bold uppercase tracking-[0.5px] text-[#3C65F5] hover:text-[#05264E] dark:text-[#5E81FF] dark:hover:text-white pt-[5px] transition-colors"
              >
                VIEW MAP
              </a>
            </div>

            {/* Columns 2, 3, 4: Office Branches */}
            {OFFICE_COLUMNS.map((colGroup) => (
              <div key={colGroup.id} className="mb-[30px]">
                {colGroup.offices.map((office, idx) => (
                  <div key={office.city} className={idx > 0 ? "mt-[28px]" : ""}>
                    <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-bold leading-[24px] text-[#05264E] dark:text-[#F1F5F9] mb-[8px]">
                      {office.city}
                    </h4>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[22px] text-[#4F5E64] dark:text-slate-400">
                      {office.address}
                    </p>
                  </div>
                ))}
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
