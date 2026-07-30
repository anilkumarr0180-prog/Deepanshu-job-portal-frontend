import NavActions from "./NavActions";
import NavLogo from "./NavLogo";
import NavMenu from "./NavMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-24 max-w-[1320px] items-center justify-between px-8">
        {/* Left Section */}
        <div className="flex items-center gap-14">
          <NavLogo />
          <NavMenu />
        </div>

        {/* Right Section */}
        <NavActions />
      </div>
    </header>
  );
}