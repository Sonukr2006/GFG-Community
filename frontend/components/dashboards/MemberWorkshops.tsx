"use client";

import { useEffect, useMemo, useState } from "react";
import { getWorkshops, WorkshopItem } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Modal from "@/components/Modal";

export default function MemberWorkshops() {
  const [items, setItems] = useState<WorkshopItem[]>([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<WorkshopItem | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getWorkshops({ page, limit, search, level });
      setItems(result.data);
      setTotal(result.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load workshops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [page, search, level]);

  return (
    <div className="grid gap-8">
      <div className="card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold">Workshops</h2>
          <div className="flex flex-wrap gap-3">
            <input
              className="input md:w-64"
              placeholder="Search workshops"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
            <select
              className="input md:w-40"
              value={level}
              onChange={(event) => {
                setLevel(event.target.value);
                setPage(1);
              }}
            >
              <option value="all">All</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {loading ? <p className="mt-6 text-sm text-slate-400">Loading workshops...</p> : null}
        {!loading && items.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">No workshops found.</p>
        ) : null}

        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                  <div className="mt-2 text-xs text-slate-500">
                    {formatDate(item.date)}
                    {item.level ? ` • ${item.level}` : ""}
                  </div>
                </div>
                <button
                  className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white"
                  onClick={() => setSelected(item)}
                >
                  View
                </button>
              </div>
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

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected ? (
          <div className="grid gap-6">
            {selected.image_url ? (
              <img
                src={selected.image_url}
                alt={selected.title}
                className="h-48 w-full rounded-2xl border border-white/10 object-cover"
              />
            ) : null}
            <div>
              <h3 className="text-2xl font-semibold">{selected.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{selected.description}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">Date</label>
                <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                  {formatDate(selected.date)}
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">Level</label>
                <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                  {selected.level || "-"}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-slate-400">Location</label>
                <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                  {selected.location || "-"}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
