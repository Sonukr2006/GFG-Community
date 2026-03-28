"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createLeader, deleteLeader, getLeaders, MemberInput, MemberItem } from "@/lib/api";
import ConfirmDialog from "@/components/ConfirmDialog";
import Modal from "@/components/Modal";
import LeaderProfileView from "@/components/LeaderProfileView";

const emptyForm: MemberInput = {
  login_id: "",
  name: "",
  description: "",
  password: "",
  team_role: "Technical"
};

export default function LeadersManager() {
  const [items, setItems] = useState<MemberItem[]>([]);
  const [form, setForm] = useState<MemberInput>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);

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
      team_role: form.team_role || "General",
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
          <div className="relative">
            <label className="text-xs uppercase tracking-widest text-slate-400">Team Role</label>
            <button
              type="button"
              className="input mt-2 flex w-full items-center justify-between bg-ink-900 text-slate-200"
              onClick={() => setTeamDropdownOpen((prev) => !prev)}
            >
              <span>{form.team_role || "Select team"}</span>
              <span className="text-xs text-slate-400">▼</span>
            </button>
            {teamDropdownOpen ? (
              <div className="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-white/10 bg-ink-900/95 p-2 shadow-2xl backdrop-blur">
                {[
                  "Technical",
                  "Management",
                  "PR",
                  "Design",
                  "Social Media",
                  "General"
                ].map((role) => (
                  <button
                    key={role}
                    type="button"
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      setForm({ ...form, team_role: role });
                      setTeamDropdownOpen(false);
                    }}
                  >
                    {role === "PR" ? "PR Team" : role === "General" ? "General" : `${role} Team`}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
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
                  {item.team_role ? (
                    <p className="mt-1 text-xs uppercase tracking-widest text-neon-300/80">
                      {item.team_role}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/leaders/${item.id}`}
                    className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white"
                    onClick={(event) => {
                      event.preventDefault();
                      setProfileId(item.id);
                    }}
                  >
                    Profile
                  </Link>
                  <button
                    className="rounded-full border border-rose-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-rose-300"
                    onClick={() => setConfirmDelete({ id: item.id, name: item.name })}
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
      <Modal open={profileId !== null} onClose={() => setProfileId(null)}>
        {profileId !== null ? (
          <LeaderProfileView memberId={profileId} showBack={false} title="Leader Profile" />
        ) : null}
      </Modal>
    </div>
  );
}
