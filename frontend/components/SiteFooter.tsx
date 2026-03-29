import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink-900/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
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

          <p className="mt-3 text-sm text-slate-400">
            A unified campus hub for events, workshops, announcements, and student-led initiatives.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Quick Links</p>
          <div className="mt-4 grid gap-2 text-sm text-slate-300">
            <Link href="/events">Events</Link>
            <Link href="/workshops">Workshops</Link>
            <Link href="/resources">Resources</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Dashboards</p>
          <div className="mt-4 grid gap-2 text-sm text-slate-300">
            <Link href="/admin-login">Admin</Link>
            <Link href="/leader-login">Leader</Link>
            <Link href="/member-login">Member</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-slate-500">
        © 2026 CGC University Campus Body. Built with heart and clean code.
      </div>
    </footer>
  );
}
