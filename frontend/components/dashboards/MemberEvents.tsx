"use client";

import { useEffect, useMemo, useState } from "react";
import { EventItem, getEvents } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { getApiBase } from "@/lib/auth";
import Modal from "@/components/Modal";

const getImageSrc = (value?: string | null) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const base = getApiBase();
  return `${base}${value.startsWith("/") ? "" : "/"}${value}`;
};

export default function MemberEvents() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<EventItem | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEvents({ page, limit, search, status });
      setItems(result.data);
      setTotal(result.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [page, search, status]);

  return (
    <div className="grid gap-8">
      <div className="card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold">Events</h2>
          <div className="flex flex-wrap gap-3">
            <input
              className="input md:w-64"
              placeholder="Search events"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
            <div className="flex gap-2 text-xs font-semibold uppercase tracking-widest">
              {(["all", "upcoming", "past"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setStatus(value);
                    setPage(1);
                  }}
                  className={`rounded-full px-4 py-2 ${
                    status === value
                      ? "bg-neon-500 text-ink-900"
                      : "border border-white/10 text-slate-300"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? <p className="mt-6 text-sm text-slate-400">Loading events...</p> : null}
        {!loading && items.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">No events found.</p>
        ) : null}

        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                  <div className="mt-2 text-xs text-slate-500">
                    {formatDate(item.start_date)}
                    {item.location ? ` • ${item.location}` : ""}
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
                src={getImageSrc(selected.image_url)}
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
                  {formatDate(selected.start_date)}
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">Location</label>
                <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                  {selected.location || "-"}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-slate-400">Registration Link</label>
                <div className="mt-2 break-all rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                  {selected.registration_link || "-"}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
