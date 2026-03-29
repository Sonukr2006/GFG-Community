"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { href: "/events", label: "Events" },
  { href: "/workshops", label: "Workshops" },
  { href: "/team", label: "Team" },
  { href: "/announcements", label: "Announcements" },
  { href: "/resources", label: "Resources" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
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
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-300 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle className="hidden md:inline-flex" />
          <Link
            href="/member-login"
            className="rounded-full bg-neon-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink-900"
          >
            Join Community
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`fixed right-0 top-0 z-50 flex h-screen w-[88vw] max-w-sm flex-col border-l border-white/10 bg-ink-900 p-5 shadow-2xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Menu</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-white/10 p-2 text-slate-300 transition hover:border-white/20 hover:text-white"
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-6 grid gap-2 text-sm font-semibold text-slate-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="text-sm text-slate-300">Theme</span>
          <ThemeToggle />
        </div>

        <Link
          href="/member-login"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-neon-500 px-5 py-3 text-sm font-semibold uppercase tracking-widest text-ink-900"
          onClick={() => setOpen(false)}
        >
          Join Community
        </Link>
      </div>
    </header>
  );
}
