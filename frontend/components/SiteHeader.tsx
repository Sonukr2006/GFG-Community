import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { href: "/events", label: "Events" },
  { href: "/workshops", label: "Workshops" },
  { href: "/team", label: "Team" },
  { href: "/announcements", label: "Announcements" },
  { href: "/resources", label: "Resources" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" }
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neon-500/10 text-lg font-bold text-neon-400">
            GFG
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Community</p>
            <p className="text-xs text-slate-400">Campus Hub</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-300 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden md:inline-flex" />
          <Link
            href="/member-login"
            className="rounded-full bg-neon-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink-900"
          >
            Join Community
          </Link>
        </div>
      </div>
    </header>
  );
}
