import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

export default function ContactBanner() {
  return (
    <div
      className="breacrumb-cover bg-img-about relative w-full overflow-hidden bg-cover bg-center py-[40px] lg:py-[46px]"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      {/* Dark overlay for contrast matching original JobBox template (1425 x 181 ::before) */}
      <div className="absolute inset-0 bg-[#05264E]/60 dark:bg-[#0B1220]/75" />

      <div className="container relative mx-auto max-w-[1140px] px-[12px]">
        <div className="flex flex-wrap -mx-[12px] items-center justify-between">
          
          {/* Left Column (col-lg-6): Title & Subtitle */}
          <div className="w-full lg:w-6/12 px-[12px]">
            {/* Title (h2.mb-10 -> 36px, bold, white, mb: 10px) */}
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[36px] font-bold leading-[45px] text-white mb-[10px]">
              About Us
            </h2>

            {/* Subtitle (p.font-lg.color-text-paragraph-2 -> 18px, white) */}
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[18px] leading-[26px] text-white">
              Get the latest news, updates and tips
            </p>
          </div>

          {/* Right Column (col-lg-6 text-lg-end): Breadcrumbs */}
          <div className="w-full lg:w-6/12 px-[12px] text-left lg:text-right mt-[20px] lg:mt-0">
            <ul className="breadcrumbs inline-flex items-center gap-[6px] bg-white dark:bg-[#111A2B] rounded-[8px] py-[8px] px-[18px] shadow-xs">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="home-icon inline-flex items-center gap-[6px] font-['Plus_Jakarta_Sans',sans-serif] text-[14px] text-[#66789C] dark:text-slate-400 hover:text-[#3C65F5] transition-colors"
                >
                  <Home className="w-[14px] h-[14px] text-[#66789C] dark:text-slate-400 group-hover:text-[#3C65F5] transition-colors" />
                  <span>Home</span>
                </Link>
              </li>
              <li className="inline-flex items-center">
                <ChevronRight className="w-[14px] h-[14px] text-[#66789C] dark:text-slate-400" />
              </li>
              <li className="inline-flex items-center">
                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] text-[#66789C] dark:text-slate-400">
                  Contact
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
