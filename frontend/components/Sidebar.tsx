"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LogOut, Menu, X } from "lucide-react";
import { clearSession } from "@/lib/auth";
import Image from "next/image";

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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleLogout = () => {
    clearSession();
    window.location.href = "/";
  };

  const navContent = (
    <>
      <div className="mb-8 flex items-start justify-between gap-3">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/icon.svg"
            alt="CGC University Campus Body"
            width={45}
            height={45}
            unoptimized
            className="h-12 w-12"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              Community
            </p>
            <p className="text-xs text-slate-400">CGCU Campus Hub</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-xl border border-white/10 p-2 text-slate-300 transition hover:border-white/20 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 lg:hidden">
        <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Dashboard</p>
        <p className="mt-1 text-sm font-semibold text-white">{title}</p>
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
        onClick={handleLogout}
        type="button"
      >
        <LogOut size={16} /> Logout
      </button>
    </>
  );

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-white/10 bg-ink-900/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Dashboard</p>
            <p className="truncate text-sm font-semibold text-white">{title}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
            aria-label="Open menu"
          >
            <Menu size={18} />
            Menu
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-72 flex-col border-r border-white/10 bg-ink-800 p-5 shadow-2xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {navContent}
      </aside>

      <aside className="hidden min-h-screen w-64 flex-col border-r border-white/10 bg-ink-800 p-6 lg:flex">
        {navContent}
      </aside>
    </>
  );
}
