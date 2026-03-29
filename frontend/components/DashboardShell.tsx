import { ReactNode } from "react";
import Sidebar, { SidebarItem } from "@/components/Sidebar";
import UserSummary from "@/components/UserSummary";
import ProfileSidebar from "@/components/ProfileSidebar";

export default function DashboardShell({
  title,
  items,
  children
}: {
  title: string;
  items: SidebarItem[];
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink-900">
      <div className="lg:flex">
        <Sidebar title={title} items={items} />
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-stretch">
              <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4">
                <UserSummary />
              </div>
              <div className="lg:w-72">
                <ProfileSidebar />
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
