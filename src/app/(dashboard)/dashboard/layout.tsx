import { notFound } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <>
      <div className="container mt-2 grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardSidebar items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </>
  );
}
