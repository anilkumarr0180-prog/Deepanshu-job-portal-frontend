import { Link } from "react-router-dom";
import logo from "@/assets/images/logo/logo.svg";

export default function NavLogo() {
  return (
    <Link
      to="/"
      className="flex items-center transition-opacity duration-200 hover:opacity-90"
    >
      <img
        src={logo}
        alt="JobBox"
        className="h-10 w-auto object-contain"
      />
    </Link>
  );
}