import { Link } from "react-router-dom";
import heroImg from "@/assets/images/hero/img1.png";
import chartImg from "@/assets/images/hero/img-chart.png";

export default function MillionsOfJobs() {
  return (
    <section className="relative overflow-hidden bg-white pt-4 pb-12 sm:pt-8 sm:pb-20 lg:pt-10 lg:pb-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-4 sm:px-6 lg:flex-row lg:px-8">
        {/* Left Column: Image & Floating Cards Composition */}
        <div className="relative flex items-center justify-center min-h-[360px] sm:min-h-[460px] w-full max-w-[540px] px-2 sm:px-0">
          {/* Background soft blue glow */}
          <div className="pointer-events-none absolute -left-10 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl" />

          {/* Top-Left Floating Card (Course Overview Chart) */}
          <div className="absolute -left-1 top-0 z-0 w-[140px] xs:w-[170px] sm:w-[210px] rounded-2xl sm:rounded-3xl border border-slate-100/80 bg-white p-2.5 sm:p-4 shadow-xl shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 sm:-left-8 sm:top-0">
            <div className="inline-block rounded-full bg-blue-50 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[11px] font-bold text-[#3C65F5]">
              • Market Static
            </div>
            <h4 className="mt-1 sm:mt-2.5 text-[11px] sm:text-xs font-extrabold text-[#05264E]">
              Course overview
            </h4>
            <img
              src={chartImg}
              alt="Market Static Chart"
              className="mt-1.5 sm:mt-2.5 w-full rounded-lg object-contain"
            />
          </div>

          {/* Center Main Hero Photo */}
          <div className="relative z-10 w-[260px] xs:w-[290px] sm:w-[380px] overflow-hidden rounded-[28px] sm:rounded-[36px] border-4 border-white shadow-2xl shadow-blue-500/10">
            <img
              src={heroImg}
              alt="Job Seekers Celebrating"
              className="h-[320px] xs:h-[360px] sm:h-[430px] w-full object-cover"
            />
          </div>

          {/* Bottom-Right Floating Card */}
          <div className="absolute -bottom-2 -right-1 z-20 w-[140px] xs:w-[170px] sm:w-[200px] rounded-2xl sm:rounded-3xl border border-slate-100/80 bg-white p-2.5 sm:p-4 shadow-xl shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 sm:-bottom-6 sm:-right-6">
            <h5 className="text-[11px] sm:text-xs font-extrabold text-[#05264E] leading-snug">
              Security &amp; Protection
            </h5>
            <p className="mt-0.5 text-[9px] sm:text-[11px] text-slate-400">
              600,000+ companies
            </p>

            <Link
              to="/jobs"
              className="mt-2 sm:mt-3.5 block w-full rounded-lg sm:rounded-xl bg-[#05264E] py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-bold text-white transition-colors duration-200 hover:bg-[#3C65F5]"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Column: Headline, Text & CTA Buttons */}
        <div className="w-full max-w-[560px] text-center lg:text-left">
          {/* Subtitle Label */}
          <span className="text-base font-extrabold tracking-tight text-[#66789C] sm:text-xl">
            Millions Of Jobs.
          </span>

          {/* Main Headline */}
          <h2 className="mt-2 text-3xl font-extrabold leading-[1.15] tracking-tight text-[#05264E] sm:text-5xl lg:text-[56px]">
            Find The One That's <br className="hidden sm:inline" />
            <span className="text-[#3C65F5]">Right</span> For You
          </h2>

          {/* Paragraph Description */}
          <p className="mt-4 sm:mt-5 max-w-lg text-xs font-medium leading-relaxed text-[#66789C] sm:text-base mx-auto lg:mx-0">
            Search all the open positions on the web. Get your own personalized salary
            estimate. Read reviews on over 600,000 companies worldwide. The right
            job is out there.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center rounded-xl bg-[#3C65F5] px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2956F2] hover:shadow-xl hover:shadow-blue-500/35"
            >
              Search Jobs
            </Link>

            <Link
              to="/jobs"
              className="text-xs sm:text-sm font-bold text-[#05264E] underline underline-offset-4 transition-colors duration-200 hover:text-[#3C65F5]"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
