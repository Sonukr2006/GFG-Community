"use client";

import { useEffect, useMemo, useState } from "react";
import { AnnouncementItem, getAnnouncements } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Modal from "@/components/Modal";

export default function MemberAnnouncements() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AnnouncementItem | null>(null);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    );
  }, [items, query]);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnnouncements();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="grid gap-8">
      <div className="card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold">Announcements</h2>
          <input
            className="input md:w-64"
            placeholder="Search announcements"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {loading ? <p className="mt-6 text-sm text-slate-400">Loading announcements...</p> : null}
        {!loading && filtered.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">No announcements found.</p>
        ) : null}

        <div className="mt-6 grid gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                  {item.created_at ? (
                    <div className="mt-2 text-xs text-slate-500">{formatDate(item.created_at)}</div>
                  ) : null}
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
        {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected ? (
          <div className="grid gap-4">
            <h3 className="text-2xl font-semibold">{selected.title}</h3>
            {selected.created_at ? (
              <p className="text-xs uppercase tracking-widest text-slate-400">
                {formatDate(selected.created_at)}
              </p>
            ) : null}
            <p className="text-sm text-slate-300">{selected.description}</p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
