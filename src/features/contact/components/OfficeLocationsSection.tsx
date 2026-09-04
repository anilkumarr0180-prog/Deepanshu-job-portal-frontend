import { HEADQUARTERS, OFFICE_COLUMNS } from "../data/officeLocations";

export default function OfficeLocationsSection() {
  return (
    <section className="section-box mt-[40px] sm:mt-[60px] lg:mt-[80px]">
      <div className="container mx-auto max-w-[1140px] px-[12px]">
        <div className="box-info-contact rounded-[16px] bg-[#F2F6FD] pt-[50px] px-[24px] sm:px-[30px] lg:px-[40px] pb-[20px] dark:bg-[#151F32]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            
            {/* Column 1: Headquarters & Primary Contact */}
            <div className="mb-[30px]">
              {/* JobBox Cube Icon */}
              <div className="mb-[15px]">
                <svg
                  className="h-[28px] w-auto"
                  viewBox="0 0 29 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="JobBox Logo"
                >
                  <path d="M0 10.3508L14.5 2V19.6126L0 27.2042V10.3508Z" fill="#91A9FF" />
                  <path d="M28.9241 10.3508L14.4241 2V19.6126L28.9241 27.2042V10.3508Z" fill="#5E81FF" />
                  <path d="M14.4241 19.6126L28.9241 27.2042L14.4241 34.7958L-7.23942e-06 27.2042L14.4241 19.6126Z" fill="#3C65F5" />
                </svg>
              </div>

              <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-bold leading-[24px] text-[#05264E] dark:text-[#F1F5F9] mb-[12px]">
                {HEADQUARTERS.name}
              </h4>

              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[22px] text-[#4F5E64] dark:text-slate-400 mb-[6px]">
                {HEADQUARTERS.addressLines.map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                  </span>
                ))}
              </p>

              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[22px] text-[#4F5E64] dark:text-slate-400 mb-[4px]">
                Phone:{" "}
                <a
                  href={`tel:${HEADQUARTERS.phone.replace(/[^0-9+]/g, "")}`}
                  className="text-[#4F5E64] dark:text-slate-400 hover:text-[#3C65F5] dark:hover:text-[#5E81FF] transition-colors"
                >
                  {HEADQUARTERS.phone}
                </a>
              </p>

              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[22px] text-[#4F5E64] dark:text-slate-400 mb-[16px]">
                Email:{" "}
                <a
                  href={`mailto:${HEADQUARTERS.email}`}
                  className="text-[#4F5E64] dark:text-slate-400 hover:text-[#3C65F5] dark:hover:text-[#5E81FF] transition-colors"
                >
                  {HEADQUARTERS.email}
                </a>
              </p>

              <a
                href={HEADQUARTERS.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-bold uppercase tracking-[0.5px] text-[#3C65F5] hover:text-[#05264E] dark:text-[#5E81FF] dark:hover:text-white underline underline-offset-4 transition-colors"
              >
                VIEW MAP
              </a>
            </div>

            {/* Columns 2, 3, 4: Data-Driven Branch Offices */}
            {OFFICE_COLUMNS.map((colGroup) => (
              <div key={colGroup.id} className="mb-[30px]">
                {colGroup.offices.map((office, idx) => (
                  <div key={office.city} className={idx > 0 ? "mt-[25px]" : ""}>
                    <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-bold leading-[24px] text-[#05264E] dark:text-[#F1F5F9] mb-[8px]">
                      {office.city}
                    </h4>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[22px] text-[#4F5E64] dark:text-slate-400 max-w-[240px]">
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
