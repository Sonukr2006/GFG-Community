export default function StatsGrid({
  stats
}: {
  stats: { label: string; value: string }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="card">
          <p className="text-3xl font-semibold text-white">{stat.value}</p>
          <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
