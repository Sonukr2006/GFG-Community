import { ReactNode } from "react";

export default function Section({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8">
          <p className="badge bg-neon-500/10 text-neon-400">GFG Community</p>
          <h2 className="section-title mt-4">{title}</h2>
          {subtitle ? <p className="mt-3 max-w-2xl text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
