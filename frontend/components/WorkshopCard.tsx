import { formatDate } from "@/lib/utils";

export default function WorkshopCard({
  title,
  description,
  date,
  level
}: {
  title: string;
  description: string;
  date: string;
  level: string;
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <span className="badge bg-white/5 text-slate-300">{level}</span>
        <span className="text-xs text-slate-400">{formatDate(date)}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
      <button className="mt-6 rounded-full bg-neon-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink-900">
        Register
      </button>
    </div>
  );
}
