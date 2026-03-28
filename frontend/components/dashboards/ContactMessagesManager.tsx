"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteContactMessage, getContactMessages, ContactMessageItem } from "@/lib/api";
import ConfirmDialog from "@/components/ConfirmDialog";
import { formatDate } from "@/lib/utils";

export default function ContactMessagesManager() {
  const [items, setItems] = useState<ContactMessageItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getContactMessages({ page, limit });
      setItems(result.data);
      setTotal(result.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [page]);

  const handleDelete = async (id: number) => {
    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    setTotal((prev) => Math.max(0, prev - 1));
    try {
      await deleteContactMessage(id);
    } catch (err) {
      setItems(previous);
      setTotal((prev) => prev + 1);
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="grid gap-8">
      <div className="card">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Contact Messages</h2>
            <p className="text-sm text-slate-400">Messages sent from the public contact form.</p>
          </div>
        </div>

        {loading ? <p className="mt-6 text-sm text-slate-400">Loading messages...</p> : null}
        {!loading && items.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">No messages yet.</p>
        ) : null}

        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-amber-500/10 to-rose-500/10 p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-emerald-200/80">
                    {formatDate(item.created_at)}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-slate-200/80">{item.email}</p>
                </div>
                <button
                  className="rounded-full border border-rose-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-rose-300"
                  onClick={() => setConfirmDelete({ id: item.id, name: item.name })}
                >
                  Delete
                </button>
              </div>
              <p className="mt-4 text-sm text-slate-200/80">{item.message}</p>
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

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title={confirmDelete ? `Delete message from \"${confirmDelete.name}\"?` : "Delete message?"}
        description="This action cannot be undone."
        confirmText="Delete Message"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete) {
            handleDelete(confirmDelete.id);
          }
          setConfirmDelete(null);
        }}
      />
    </div>
  );
}
