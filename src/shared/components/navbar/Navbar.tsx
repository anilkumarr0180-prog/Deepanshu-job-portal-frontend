import NavActions from "./NavActions";
import NavLogo from "./NavLogo";
import NavMenu from "./NavMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-[84px] max-w-[1320px] items-center px-8">
        <div className="flex items-center">
          <NavLogo />
        </div>

        <div className="flex-1 flex justify-center">
          <NavMenu />
        </div>

        <div className="flex items-center">
          <NavActions />
        </div>
      </div>
    </header>
  );
}