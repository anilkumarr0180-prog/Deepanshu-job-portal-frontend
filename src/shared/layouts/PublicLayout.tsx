import { Outlet } from "react-router-dom";
import { Navbar } from "@/shared/components/navbar";
import ScrollToTop from "@/shared/components/ScrollToTop";

export default function PublicLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white">
      <Navbar />
      <main className="w-full overflow-x-hidden">
        <Outlet />
      </main>
      <ScrollToTop />
    </div>
  );
}