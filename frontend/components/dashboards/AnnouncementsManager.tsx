"use client";

import { useEffect, useState } from "react";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  AnnouncementInput,
  AnnouncementItem,
  updateAnnouncement
} from "@/lib/api";
import ConfirmDialog from "@/components/ConfirmDialog";

const emptyForm: AnnouncementInput = {
  title: "",
  description: ""
};

export default function AnnouncementsManager() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [form, setForm] = useState<AnnouncementInput>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; title: string } | null>(null);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAnnouncements();
      setItems(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (editingId) {
      const previous = items.find((item) => item.id === editingId);
      if (!previous) return;
      const optimistic = { ...previous, ...form } as AnnouncementItem;
      setItems((prev) => prev.map((item) => (item.id === editingId ? optimistic : item)));
      resetForm();
      try {
        const updated = await updateAnnouncement(editingId, form);
        setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      } catch (err) {
        setItems((prev) => prev.map((item) => (item.id === editingId ? previous : item)));
        setError(err instanceof Error ? err.message : "Update failed");
      }
      return;
    }

    const tempId = Date.now();
    const optimistic = { id: tempId, ...form } as AnnouncementItem;
    setItems((prev) => [optimistic, ...prev]);
    resetForm();

    try {
      const created = await createAnnouncement(form);
      setItems((prev) => prev.map((item) => (item.id === tempId ? created : item)));
    } catch (err) {
      setItems((prev) => prev.filter((item) => item.id !== tempId));
      setError(err instanceof Error ? err.message : "Create failed");
    }
  };

  const handleEdit = (item: AnnouncementItem) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description });
  };

  const handleDelete = async (id: number) => {
    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteAnnouncement(id);
    } catch (err) {
      setItems(previous);
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="grid gap-8">
      <div className="card">
        <h2 className="text-xl font-semibold">{editingId ? "Edit Announcement" : "Create Announcement"}</h2>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <input
            className="input"
            placeholder="Title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
          />
          <textarea
            className="input min-h-[120px]"
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            required
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-full bg-neon-500 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-ink-900"
            >
              {editingId ? "Save Changes" : "Create Announcement"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-white/15 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
        {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold">Announcements</h2>
        {loading ? <p className="mt-6 text-sm text-slate-400">Loading announcements...</p> : null}
        {!loading && items.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">No announcements found.</p>
        ) : null}
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-rose-500/10 via-amber-400/10 to-emerald-500/10 p-4"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-rose-400/40 via-amber-300/40 to-emerald-400/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-amber-100">
                    Important
                  </span>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-slate-200/80">{item.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-full border border-rose-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-rose-300"
                    onClick={() => setConfirmDelete({ id: item.id, title: item.title })}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title={confirmDelete ? `Delete announcement \"${confirmDelete.title}\"?` : "Delete announcement?"}
        description="This action cannot be undone."
        confirmText="Delete Announcement"
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
