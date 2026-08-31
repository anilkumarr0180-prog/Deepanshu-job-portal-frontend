import { Outlet } from "react-router-dom";
import { Navbar } from "@/shared/components/navbar";
import ScrollToTop from "@/shared/components/ScrollToTop";

export default function PublicLayout() {
  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-[#0B1220]">
      <Navbar />
      <main className="w-full bg-white dark:bg-[#0B1220]">
        <Outlet />
      </main>
      <ScrollToTop />
    </div>
  );
}