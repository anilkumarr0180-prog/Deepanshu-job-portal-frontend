import { Link } from "react-router-dom";
import heroImg from "@/assets/images/hero/img1.png";

export default function MillionsOfJobs() {
  return (
    <section className="section-box overflow-visible mt-[50px] mb-[50px] py-12 lg:py-16 bg-white dark:bg-[#0B132B]">
      <div className="container mx-auto max-w-[1140px] px-[12px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-14 xl:gap-16">
          {/* Left Visual Column */}
          <div className="w-full flex items-center justify-center lg:justify-start pb-8 sm:pb-10 lg:pb-12">
            <div className="box-image-job relative w-[340px] sm:w-[410px] lg:w-[436px]">
              {/* Top-Left Static Card (Market Static / Course Overview) */}
              <div className="absolute -left-8 sm:-left-10 lg:-left-14 -top-6 sm:-top-8 lg:-top-10 z-[1] w-[215px] sm:w-[235px] lg:w-[255px] rounded-[24px] border border-[#E0E6F7] bg-white p-5 lg:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.08)] dark:border-[#2A3850] dark:bg-[#151F32] pointer-events-none select-none">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF0FD] dark:bg-[#1C2A44] px-3.5 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#3C65F5]" />
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-bold text-[#3C65F5] dark:text-[#5E81FF]">
                    Market Static
                  </span>
                </div>

                {/* Title */}
                <h4 className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-[16px] sm:text-[17px] font-bold text-[#2E3D4F] dark:text-[#F1F5F9] leading-[22px]">
                  Course<br />overview
                </h4>

                {/* Vector Curve Line & Months */}
                <div className="mt-4">
                  <svg viewBox="0 0 160 48" className="w-full h-[36px] overflow-visible">
                    <path
                      d="M 5 36 C 22 36, 26 30, 36 18 C 48 5, 80 4, 155 10"
                      fill="none"
                      stroke="#05264E"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="dark:stroke-[#5E81FF]"
                    />
                  </svg>
                  <div className="mt-2 flex items-center justify-between font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-medium text-[#8392A5] dark:text-slate-400 px-1">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                  </div>
                </div>
              </div>

              {/* Main Photo (Primary Anchor: 436px x 394px) */}
              <div className="relative z-10 w-full h-[295px] sm:h-[360px] lg:h-[394px] overflow-hidden rounded-[28px] lg:rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.10)] select-none">
                <img
                  src={heroImg}
                  alt="Job Seekers Celebrating"
                  className="w-full h-full object-cover block"
                />
              </div>

              {/* Bottom-Right Static Card (Security & Protection + Learn More) */}
              <div className="absolute -right-6 sm:-right-8 lg:-right-10 -bottom-6 sm:-bottom-8 lg:-bottom-10 z-[1] w-[205px] sm:w-[220px] lg:w-[235px] h-[185px] sm:h-[195px] lg:h-[205px] rounded-[24px] border border-[#E0E6F7] bg-white p-5 lg:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)] dark:border-[#2A3850] dark:bg-[#151F32] flex flex-col justify-between items-end">
                <div className="w-full text-right pr-1 pt-1">
                  <h5 className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] lg:text-[15px] font-bold text-[#05264E] dark:text-[#F1F5F9] leading-tight">
                    Security
                  </h5>
                </div>
                <Link
                  to="/jobs"
                  className="flex h-[40px] w-full items-center justify-center rounded-full bg-[#05264E] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-bold text-white transition-all duration-200 hover:bg-[#3C65F5] shadow-sm z-20"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Headline, Text & CTA Buttons (Aligned with Grid Column) */}
          <div className="w-full text-center lg:text-left">
            {/* Subtitle Label */}
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] sm:text-[16px] font-bold text-[#A0ABB8] dark:text-slate-400 tracking-normal">
              Millions Of Jobs.
            </span>

            {/* Main Headline */}
            <h2 className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-[38px] sm:text-[46px] lg:text-[50px] font-extrabold leading-[1.12] tracking-[-0.5px] text-[#05264E] dark:text-[#F1F5F9] max-w-[480px]">
              Find The One <br />
              {"That's"} <span className="text-[#3C65F5]">Right</span> For <br />
              You
            </h2>

            {/* Paragraph Description */}
            <p className="mt-5 max-w-[470px] font-['Plus_Jakarta_Sans',sans-serif] text-[14px] sm:text-[15px] font-normal leading-[26px] text-[#6B7A8D] dark:text-slate-300 mx-auto lg:mx-0">
              Search all the open positions on the web. Get your own personalized salary
              estimate. Read reviews on over 600,000 companies worldwide. The right
              job is out there.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-7">
              <Link
                to="/jobs"
                className="inline-flex h-[50px] items-center justify-center rounded-[8px] bg-[#3C65F5] px-8 text-[14px] font-bold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2956F2] hover:shadow-lg hover:shadow-blue-500/30"
              >
                Search Jobs
              </Link>

              <Link
                to="/jobs"
                className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-bold text-[#05264E] underline underline-offset-4 transition-colors duration-200 hover:text-[#3C65F5] dark:text-[#F1F5F9]"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}






