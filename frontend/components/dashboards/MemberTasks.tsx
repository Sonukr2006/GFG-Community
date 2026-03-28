"use client";

import { useEffect, useMemo, useState } from "react";
import { getTasks, TaskItem } from "@/lib/api";

export default function MemberTasks() {
  const [items, setItems] = useState<TaskItem[]>([]);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTasks({ page, limit, status });
      setItems(result.data);
      setTotal(result.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [page, status]);

  return (
    <div className="grid gap-8">
      <div className="card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold">My Tasks</h2>
          <select
            className="input md:w-40"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {loading ? <p className="mt-6 text-sm text-slate-400">Loading tasks...</p> : null}
        {!loading && items.length === 0 ? <p className="mt-6 text-sm text-slate-400">No tasks yet.</p> : null}

        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                {item.status?.replace("_", " ") || "pending"}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.description}</p>
              {item.due_date ? (
                <p className="mt-3 text-xs text-slate-400">Due: {item.due_date.slice(0, 10)}</p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <button
              className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
