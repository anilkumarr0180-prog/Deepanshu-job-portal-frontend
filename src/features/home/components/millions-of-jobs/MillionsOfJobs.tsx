import { Link } from "react-router-dom";
import heroImg from "@/assets/images/hero/img1.png";
import imgChart from "@/assets/images/hero/img-chart.png";
import controlCard from "@/assets/images/hero/controlcard.png";

/**
 * Exact CSS from jobbox-nextjs-v4.vercel.app production build:
 *
 * .box-image-job              { position: relative; text-align: center; }   ← NO padding
 * .box-image-job figure       { display: block; }
 * .box-image-job figure img   { max-width: 80%; border-radius: 32px; }
 *
 * Desktop lg (≥992px):
 *   .img-job-1  { position: absolute; top: -70px;    left: -120px; }  ← no width = natural size
 *   .img-job-2  { position: absolute; bottom: -170px; right: -80px; } ← no width = natural size
 *
 * Tablet md (≥768px):
 *   .img-job-1  { top: -40px;    left:  -50px; width: 240px; }
 *   .img-job-2  { bottom: -120px; right: -50px; width: 240px; }
 *
 * Mobile: .img-job-1, .img-job-2 { display: none; }
 *
 * DOM stacking — img-job-1 → img-job-2 → figure (photo is LAST → paints on top, no z-index needed)
 */
export default function MillionsOfJobs() {
  return (
    /*
     * section: overflow-visible so absolute cards bleed outside the box
     * mb-[200px] so the control card (bottom:-170px) doesn't overlap next section
     */
    <section className="section-box overflow-visible mt-[50px] mb-[200px] bg-white dark:bg-[#0B132B]">
      <div className="container mx-auto max-w-[1140px] px-[12px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-14">

          {/* ── LEFT COLUMN ── */}
          {/*
           * pt-[80px] lg:pt-[70px] gives space above so chart card (top:-70px)
           * doesn't overlap the section/header above. No padding-bottom needed
           * because the control card overflows into mb-[200px] of the section.
           */}
          <div className="w-full pt-[50px] md:pt-[50px] lg:pt-[70px]">

            {/*
             * .box-image-job = position:relative; text-align:center
             * !! NO PADDING here — padding shifts the top/bottom reference !!
             *    top:-70px means 70px ABOVE the box's border, not the content edge.
             *    With no padding, box border = content edge = photo top.
             */}
            <div className="relative text-center">

              {/* ── img-job-1 (chart card) ──
               * Comes FIRST in DOM → paints behind figure.
               * md: top:-40px left:-50px width:240px
               * lg: top:-70px left:-120px  (natural image width)
               */}
              <img
                src={imgChart}
                alt="Market Static — Course overview"
                className="
                  hidden md:block
                  absolute
                  md:-top-[40px]  md:-left-[50px]  md:w-[240px]
                  lg:-top-[70px]  lg:-left-[120px] lg:w-auto
                  pointer-events-none select-none
                "
              />

              {/* ── img-job-2 (control card) ──
               * Comes SECOND in DOM → still behind figure (figure is LAST).
               * md: bottom:-120px right:-50px width:240px
               * lg: bottom:-170px right:-80px  (natural image width)
               */}
              <img
                src={controlCard}
                alt="Control card security in-app"
                className="
                  hidden md:block
                  absolute
                  md:-bottom-[120px] md:-right-[50px] md:w-[240px]
                  lg:-bottom-[170px] lg:-right-[80px] lg:w-auto
                  pointer-events-none select-none
                "
              />

              {/* ── figure (main photo) ──
               * LAST in DOM → naturally paints ON TOP of both cards.
               * .box-image-job figure      = display:block (takes full box width)
               * .box-image-job figure img  = max-width:80%; border-radius:32px
               *   → img is inline → centered by inherited text-align:center
               */}
              {/*
               * relative + z-[1] is critical:
               * Without position, <figure> renders at CSS paint step 3 (block flow)
               * while absolute cards render at step 6 (positioned, z-index:auto).
               * Step 3 < step 6 → cards were always on top of the photo.
               * With z-index:1 the figure moves to step 7 (positive z-index) → on top of cards. ✓
               */}
              <figure className="block relative z-[1]">
                <img
                  src={heroImg}
                  alt="Millions of jobs — find the one that's right for you"
                  className="max-w-[80%] rounded-[32px] h-auto"
                />
              </figure>

            </div>
          </div>

          {/* ── RIGHT COLUMN: Headline, Text & CTAs ── */}
          <div className="w-full text-center lg:text-left">

            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] sm:text-[16px] font-bold text-[#A0ABB8] dark:text-slate-400 tracking-normal">
              Millions Of Jobs.
            </span>

            <h2 className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-[38px] sm:text-[46px] lg:text-[50px] font-extrabold leading-[1.12] tracking-[-0.5px] text-[#05264E] dark:text-[#F1F5F9] max-w-[480px] mx-auto lg:mx-0">
              Find The One <br />
              {"That's"} <span className="text-[#3C65F5]">Right</span> For <br />
              You
            </h2>

            <p className="mt-5 max-w-[470px] font-['Plus_Jakarta_Sans',sans-serif] text-[14px] sm:text-[15px] font-normal leading-[26px] text-[#6B7A8D] dark:text-slate-300 mx-auto lg:mx-0">
              Search all the open positions on the web. Get your own personalized salary
              estimate. Read reviews on over 600,000 companies worldwide. The right
              job is out there.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-7">
              <Link
                to="/jobs"
                className="inline-flex h-[52px] items-center justify-center rounded-[8px] bg-[#3C65F5] px-[30px] text-[14px] font-bold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2956F2] hover:shadow-lg hover:shadow-blue-500/30"
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
