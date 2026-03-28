"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { clearSession } from "@/lib/auth";

export type SidebarItem = {
  label: string;
  href: string;
};

export default function Sidebar({
  title,
  items
}: {
  title: string;
  items: SidebarItem[];
}) {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-white/10 bg-ink-800 p-6">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
        <h2 className="mt-2 text-lg font-semibold text-white">GFG Community</h2>
      </div>
      <nav className="flex-1 space-y-2 text-sm">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3 text-slate-300 transition",
                active
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/5 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:border-neon-400/60 hover:text-white"
        onClick={() => {
          clearSession();
          window.location.href = "/";
        }}
        type="button"
      >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
}
