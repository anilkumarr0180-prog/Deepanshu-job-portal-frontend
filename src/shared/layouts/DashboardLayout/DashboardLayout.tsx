import { Outlet } from "react-router-dom";

import DashboardHeader from "./DashboardHeader.tsx";
import DashboardSidebar from "./DashboardSidebar.tsx";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <DashboardSidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <DashboardHeader />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
