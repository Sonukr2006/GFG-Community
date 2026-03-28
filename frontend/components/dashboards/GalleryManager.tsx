"use client";

import { useEffect, useState } from "react";
import { getGallery, GalleryItem } from "@/lib/api";
import { authHeaders, getApiBase } from "@/lib/auth";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; title: string } | null>(null);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getGallery();
      setItems(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setFile(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!file && !imageUrl) {
      setError("Provide an image file or URL.");
      return;
    }

    const tempId = Date.now();
    const previewUrl = file ? URL.createObjectURL(file) : imageUrl;
    const optimistic: GalleryItem = {
      id: tempId,
      title: title || "Gallery Image",
      description: description || "",
      image_url: previewUrl
    };

    setItems((prev) => [optimistic, ...prev]);
    resetForm();

    const formData = new FormData();
    formData.append("title", optimistic.title);
    formData.append("description", optimistic.description);
    if (file) {
      formData.append("image", file);
    } else if (imageUrl) {
      formData.append("image_url", imageUrl);
    }

    try {
      const res = await fetch(`${getApiBase()}/api/gallery`, {
        method: "POST",
        headers: {
          ...authHeaders()
        },
        body: formData
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Upload failed");
      }
      const created = await res.json();
      setItems((prev) => prev.map((item) => (item.id === tempId ? created : item)));
    } catch (err) {
      setItems((prev) => prev.filter((item) => item.id !== tempId));
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const handleDelete = async (id: number) => {
    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      const res = await fetch(`${getApiBase()}/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders()
        }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Delete failed");
      }
    } catch (err) {
      setItems(previous);
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="grid gap-8">
      <div className="card">
        <h2 className="text-xl font-semibold">Add Gallery Image</h2>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="input"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            className="input"
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="input md:col-span-2"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
          <textarea
            className="input md:col-span-2 min-h-[120px]"
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <button
            type="submit"
            className="rounded-full bg-neon-500 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-ink-900"
          >
            Upload
          </button>
        </form>
        {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold">Gallery</h2>
        {loading ? <p className="mt-6 text-sm text-slate-400">Loading gallery...</p> : null}
        {!loading && items.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">No images yet.</p>
        ) : null}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4">
              <img src={item.image_url} alt={item.title} className="h-40 w-full rounded-xl object-cover" />
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>
                <button
                  className="rounded-full border border-rose-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-rose-300"
                  onClick={() => setConfirmDelete({ id: item.id, title: item.title })}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title={confirmDelete ? `Delete image \"${confirmDelete.title}\"?` : "Delete image?"}
        description="This action cannot be undone."
        confirmText="Delete Image"
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
