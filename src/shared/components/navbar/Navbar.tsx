import { useState, useEffect } from "react";
import NavActions from "./NavActions";
import NavLogo from "./NavLogo";
import NavMenu from "./NavMenu";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`header sticky-bar sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md dark:bg-[#0B1220]/95 border-b border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.05)] py-4"
          : "bg-transparent border-b border-transparent py-[30px]"
      }`}
    >
      <div className="container mx-auto max-w-[1140px] px-[12px]">
        <div className="main-header flex h-[48px] items-center justify-between">
          <div className="header-left flex items-center">
            <div className="header-logo shrink-0 mr-7 lg:mr-9 xl:mr-11">
              <NavLogo />
            </div>
            <div className="header-nav hidden lg:flex items-center">
              <NavMenu />
            </div>
          </div>

          <div className="header-right flex items-center shrink-0">
            <NavActions />
          </div>
        </div>
      </div>
    </header>
  );
}
