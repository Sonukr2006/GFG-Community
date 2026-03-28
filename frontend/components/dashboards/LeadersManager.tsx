"use client";

import { useEffect, useState } from "react";
import { createLeader, deleteLeader, getLeaders, MemberInput, MemberItem } from "@/lib/api";
import ConfirmDialog from "@/components/ConfirmDialog";

const emptyForm: MemberInput = {
  login_id: "",
  name: "",
  description: "",
  password: ""
};

export default function LeadersManager() {
  const [items, setItems] = useState<MemberItem[]>([]);
  const [form, setForm] = useState<MemberInput>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLeaders();
      setItems(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load leaders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const tempId = Date.now();
    const optimistic: MemberItem = {
      id: tempId,
      login_id: form.login_id,
      name: form.name,
      description: form.description || "",
      created_at: new Date().toISOString()
    };

    setItems((prev) => [optimistic, ...prev]);
    setForm(emptyForm);

    try {
      const created = await createLeader(form);
      setItems((prev) => prev.map((item) => (item.id === tempId ? created : item)));
    } catch (err) {
      setItems((prev) => prev.filter((item) => item.id !== tempId));
      setError(err instanceof Error ? err.message : "Create failed");
    }
  };

  const handleDelete = async (id: number) => {
    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteLeader(id);
    } catch (err) {
      setItems(previous);
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="grid gap-8">
      <div className="card">
        <h2 className="text-xl font-semibold">Create Leader Account</h2>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="input"
            placeholder="Login ID"
            value={form.login_id}
            onChange={(event) => setForm({ ...form, login_id: event.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <button
            type="submit"
            className="rounded-full bg-neon-500 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-ink-900"
          >
            Create Leader
          </button>
        </form>
        {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold">Leaders</h2>
        {loading ? <p className="mt-6 text-sm text-slate-400">Loading leaders...</p> : null}
        {!loading && items.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">No leaders found.</p>
        ) : null}
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-slate-400">{item.login_id}</p>
                </div>
                <button
                  className="rounded-full border border-rose-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-rose-300"
                  onClick={() => setConfirmDelete({ id: item.id, name: item.name })}
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
        title={confirmDelete ? `Delete leader \"${confirmDelete.name}\"?` : "Delete leader?"}
        description="This action cannot be undone."
        confirmText="Delete Leader"
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
