export default function MetricCard({
  label,
  value
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
