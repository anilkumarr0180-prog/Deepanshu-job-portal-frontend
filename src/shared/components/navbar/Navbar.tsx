import NavActions from "./NavActions";
import NavLogo from "./NavLogo";
import NavMenu from "./NavMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#F2F6FD] dark:bg-[#0B1220] transition-colors duration-200">
      <div className="mx-auto flex h-[80px] lg:h-[84px] max-w-[1240px] items-center justify-between px-6 sm:px-10 lg:px-12 xl:px-16">
        <div className="flex items-center gap-12 lg:gap-16 xl:gap-20">
          <NavLogo />
          <div className="hidden md:flex items-center">
            <NavMenu />
          </div>
        </div>

        <div className="flex items-center shrink-0">
          <NavActions />
        </div>
      </div>
    </header>
  );
}