import { Outlet } from "react-router-dom";

import DashboardHeader from "./DashboardHeader.tsx";
import DashboardSidebar from "./DashboardSidebar.tsx";
import { useUnreadChatCount } from "@/features/chat/hooks/useChat";
import { useChatSocket } from "@/features/chat/hooks/useChatSocket";

export default function DashboardLayout() {
  // Fetch unread chat count globally so the badge is active anywhere in the dashboard
  useUnreadChatCount();

  // Establish socket connection globally to listen for real-time unread count updates
  useChatSocket();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <DashboardSidebar />

      <div className="flex h-screen flex-1 flex-col overflow-hidden lg:ml-[260px]">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
