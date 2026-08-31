import { Outlet } from "react-router-dom";
import { Navbar } from "@/shared/components/navbar";
import ScrollToTop from "@/shared/components/ScrollToTop";

export default function PublicLayout() {
  return (
    <div className="relative min-h-screen w-full bg-white">
      <Navbar />
      <main className="w-full">
        <Outlet />
      </main>
      <ScrollToTop />
    </div>
  );
}