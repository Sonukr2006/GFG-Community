"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createEvent,
  deleteEvent,
  EventInput,
  EventItem,
  getEvents,
  updateEvent
} from "@/lib/api";
import { authHeaders, getApiBase } from "@/lib/auth";
import ConfirmDialog from "@/components/ConfirmDialog";

const emptyForm: EventInput = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  location: "",
  registration_link: "",
  image_url: ""
};

export default function EventsManager() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [form, setForm] = useState<EventInput>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; title: string } | null>(null);
  const getImageSrc = (value?: string | null) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return `${getApiBase()}${value.startsWith("/") ? "" : "/"}${value}`;
  };

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

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    let imageUrl = form.image_url;

    if (imageFile) {
      setUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);
        const res = await fetch(`${getApiBase()}/api/uploads`, {
          method: "POST",
          headers: {
            ...authHeaders()
          },
          body: uploadData
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Image upload failed");
        }
        const data = await res.json();
        imageUrl = data.url;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Image upload failed");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    const payload: EventInput = {
      ...form,
      end_date: form.end_date || undefined,
      location: form.location || undefined,
      registration_link: form.registration_link || undefined,
      image_url: imageUrl || undefined
    };

    if (editingId) {
      const previous = items.find((item) => item.id === editingId);
      if (!previous) return;
      const optimistic = { ...previous, ...payload } as EventItem;
      setItems((prev) => prev.map((item) => (item.id === editingId ? optimistic : item)));
      resetForm();
      try {
        const updated = await updateEvent(editingId, payload);
        setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      } catch (err) {
        setItems((prev) => prev.map((item) => (item.id === editingId ? previous : item)));
        setError(err instanceof Error ? err.message : "Update failed");
      }
      return;
    }

    const tempId = Date.now();
    const optimistic = { id: tempId, ...payload } as EventItem;
    setItems((prev) => [optimistic, ...prev].slice(0, limit));
    setTotal((prev) => prev + 1);
    resetForm();

    try {
      const created = await createEvent(payload);
      setItems((prev) => prev.map((item) => (item.id === tempId ? created : item)));
    } catch (err) {
      setItems((prev) => prev.filter((item) => item.id !== tempId));
      setTotal((prev) => Math.max(0, prev - 1));
      setError(err instanceof Error ? err.message : "Create failed");
    }
  };

  const handleEdit = (item: EventItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      start_date: item.start_date,
      end_date: item.end_date || "",
      location: item.location || "",
      registration_link: item.registration_link || "",
      image_url: item.image_url || ""
    });
  };

  const handleDelete = async (id: number) => {
    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    setTotal((prev) => Math.max(0, prev - 1));
    try {
      await deleteEvent(id);
    } catch (err) {
      setItems(previous);
      setTotal((prev) => prev + 1);
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="grid gap-8">
      <div className="card">
        <h2 className="text-xl font-semibold">{editingId ? "Edit Event" : "Create Event"}</h2>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="input"
            placeholder="Title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Location"
            value={form.location}
            onChange={(event) => setForm({ ...form, location: event.target.value })}
          />
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-widest text-slate-400">Start Date</label>
            <input
              type="date"
              className="input"
              value={form.start_date}
              onChange={(event) => setForm({ ...form, start_date: event.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-widest text-slate-400">End Date</label>
            <input
              type="date"
              className="input"
              value={form.end_date}
              onChange={(event) => setForm({ ...form, end_date: event.target.value })}
            />
          </div>
          <input
            className="input md:col-span-2"
            placeholder="Registration link"
            value={form.registration_link}
            onChange={(event) => setForm({ ...form, registration_link: event.target.value })}
          />
          <div className="md:col-span-2 grid gap-2">
            <label className="text-xs uppercase tracking-widest text-slate-400">Event Image</label>
            <input
              type="file"
              accept="image/*"
              className="input"
              onChange={(event) => setImageFile(event.target.files?.[0] || null)}
            />
            {form.image_url ? (
              <p className="text-xs text-slate-400">Existing image will be replaced if you upload a new one.</p>
            ) : null}
          </div>
          <textarea
            className="input md:col-span-2 min-h-[120px]"
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            required
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="rounded-full bg-neon-500 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-ink-900"
            >
              {uploading ? "Uploading..." : editingId ? "Save Changes" : "Create Event"}
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
            <select
              className="input md:w-40"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>

        {loading ? <p className="mt-6 text-sm text-slate-400">Loading events...</p> : null}
        {!loading && items.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">No events found.</p>
        ) : null}

        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-4">
                  {item.image_url ? (
                    <img
                      src={getImageSrc(item.image_url)}
                      alt={item.title}
                      className="h-20 w-28 rounded-xl object-cover"
                    />
                  ) : null}
                  <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
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
              <div className="mt-3 text-xs text-slate-400">
                {item.start_date} {item.location ? `• ${item.location}` : ""}
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
      </div>
      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title={confirmDelete ? `Delete event "${confirmDelete.title}"?` : "Delete event?"}
        description="This action cannot be undone."
        confirmText="Delete Event"
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
