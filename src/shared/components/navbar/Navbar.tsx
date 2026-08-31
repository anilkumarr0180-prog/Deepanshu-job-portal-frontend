import NavActions from "./NavActions";
import NavLogo from "./NavLogo";
import NavMenu from "./NavMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/95 backdrop-blur-md shadow-xs transition-shadow">
      <div className="mx-auto flex h-[72px] sm:h-[84px] max-w-[1320px] items-center justify-between px-4 sm:px-8">
        <div className="flex items-center shrink-0">
          <NavLogo />
        </div>

        <div className="hidden md:flex flex-1 justify-center">
          <NavMenu />
        </div>

        <div className="flex items-center shrink-0">
          <NavActions />
        </div>
      </div>
    </header>
  );
}