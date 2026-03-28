import { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-sm font-semibold uppercase tracking-widest text-slate-300">
          ← Back to site
        </Link>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-16">
        {children}
      </div>
    </div>
  );
}
