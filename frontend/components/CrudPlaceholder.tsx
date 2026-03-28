export default function CrudPlaceholder({
  title,
  description,
  readOnly = false
}: {
  title: string;
  description: string;
  readOnly?: boolean;
}) {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm text-slate-400">{description}</p>
      <div className="mt-6 grid gap-3 text-sm text-slate-300">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span>Sample Entry 01</span>
          {readOnly ? <span className="text-slate-500">View</span> : <span className="text-neon-400">Edit</span>}
        </div>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span>Sample Entry 02</span>
          {readOnly ? <span className="text-slate-500">View</span> : <span className="text-neon-400">Edit</span>}
        </div>
        <div className="flex items-center justify-between">
          <span>Sample Entry 03</span>
          {readOnly ? <span className="text-slate-500">View</span> : <span className="text-neon-400">Edit</span>}
        </div>
      </div>
      {readOnly ? null : (
        <button className="mt-6 rounded-full bg-neon-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink-900">
          Create New
        </button>
      )}
    </div>
  );
}
