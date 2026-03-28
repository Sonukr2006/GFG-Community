import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink-900/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">GFG Community</h3>
          <p className="mt-3 text-sm text-slate-400">
            A developer-first campus hub for mentorship, events, and real-world project building.
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
        © 2026 GFG Campus Community. Built with heart and clean code.
      </div>
    </footer>
  );
}
