import { ReactNode } from "react";
import Sidebar, { SidebarItem } from "@/components/Sidebar";
import UserSummary from "@/components/UserSummary";

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
      <div className="flex">
        <Sidebar title={title} items={items} />
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <UserSummary />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
