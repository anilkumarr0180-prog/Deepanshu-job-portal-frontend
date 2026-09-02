import { useState } from "react";

// ── Newsletter Collage Images (215×276 left, 200×221 right) ──
import newsletterLeft from "@/assets/images/newsletter/newsletter-left.png";
import newsletterRight from "@/assets/images/newsletter/newsletter-right.png";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <section className="section-box mt-[50px] mb-[20px] bg-white dark:bg-[#0B132B]">
      <div className="container mx-auto max-w-[1140px] px-[12px]">
        {/*
          ── Box Newsletter Container ──
          Exact dimensions: 1116px width inside 1140px container, min-h: 435px.
          Padding: 57px top, 96px bottom matching JobBox DevTools.
        */}
        <div className="box-newsletter relative overflow-hidden rounded-[16px] bg-[#3C65F5] pt-[57px] pb-[96px] px-4 sm:px-6">
          {/* Decorative background subtle curves */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[100px] left-1/2 -translate-x-1/2 h-[260px] w-[380px] rounded-full bg-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[80px] left-[56%] -translate-x-1/2 h-[200px] w-[290px] rounded-full bg-white/[0.07]"
          />

          <div className="relative z-10 grid grid-cols-1 items-center xl:grid-cols-12 gap-4">
            {/* Left Collage Column (xl:col-span-3) */}
            <div className="hidden xl:flex xl:col-span-3 justify-center items-center">
              <img
                src={newsletterLeft}
                alt="joxBox"
                className="w-[215px] h-[276px] object-contain select-none pointer-events-none drop-shadow-sm"
                loading="lazy"
              />
            </div>

            {/* Center Content Column (xl:col-span-6) */}
            <div className="col-span-1 xl:col-span-6 w-full max-w-[540px] mx-auto text-center px-2">
              {/* Heading: 36px font-bold leading-[45px] */}
              <h2 className="text-md-newsletter font-['Plus_Jakarta_Sans',sans-serif] text-[28px] sm:text-[36px] font-bold leading-[38px] sm:leading-[45px] text-white">
                New Things Will Always<br className="hidden sm:inline" /> Update Regularly
              </h2>

              {/* Form container: max-w-[510px] matching reference */}
              <div className="box-form-newsletter mt-[35px] sm:mt-[40px]">
                <form
                  onSubmit={handleSubscribe}
                  className="form-newsletter relative flex items-center rounded-[12px] bg-white p-[8px] shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                >
                  {/* Left Solid Envelope Icon matching JobBox template icon */}
                  <svg
                    className="absolute left-[20px] top-1/2 -translate-y-1/2 h-[18px] w-[24px] text-[#5F7696] pointer-events-none"
                    viewBox="0 0 24 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="0.5" y="0.5" width="23" height="17" rx="2" fill="#5F7696" stroke="#5F7696" />
                    <path d="M1 2L12 10.5L23 2" stroke="white" strokeWidth="1.5" />
                    <path d="M1 16L9.5 9" stroke="white" strokeWidth="1.5" />
                    <path d="M23 16L14.5 9" stroke="white" strokeWidth="1.5" />
                  </svg>

                  {/* Input with left padding for envelope icon */}
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email here"
                    autoComplete="email"
                    className="input-newsletter h-[52px] w-full rounded-[10px] bg-transparent pl-[58px] pr-[15px] font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-[#05264E] placeholder:text-[#94A3B8] outline-none"
                  />

                  {/* Subscribe Button with Checkmark icon matching Screenshot 2 */}
                  <button
                    type="submit"
                    className="btn btn-default font-heading icon-send-letter inline-flex h-[52px] shrink-0 items-center justify-center gap-2.5 rounded-[10px] bg-[#3C65F5] px-7 font-['Plus_Jakarta_Sans',sans-serif] text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#254CD9] hover:shadow-md"
                  >
                    <svg
                      className="h-[18px] w-[18px] text-white shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span>Subscribe</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right Collage Column (xl:col-span-3) */}
            <div className="hidden xl:flex xl:col-span-3 justify-center items-center">
              <img
                src={newsletterRight}
                alt="joxBox"
                className="w-[200px] h-[221px] object-contain select-none pointer-events-none drop-shadow-sm"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
