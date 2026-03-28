"use client";

import { useEffect, useState } from "react";
import {
  createTeamMember,
  deleteTeamMember,
  getTeamMembers,
  TeamMemberInput,
  TeamMemberItem,
  updateTeamMember
} from "@/lib/api";
import { authHeaders, getApiBase } from "@/lib/auth";
import ConfirmDialog from "@/components/ConfirmDialog";

const emptyForm = {
  name: "",
  description: "",
  role: "",
  skills: [],
  photo_url: ""
} as TeamMemberInput;

export default function TeamMembersManager() {
  const [items, setItems] = useState<TeamMemberItem[]>([]);
  const [form, setForm] = useState<TeamMemberInput>(emptyForm);
  const [skillsText, setSkillsText] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTeamMembers();
      setItems(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setSkillsText("");
    setEditingId(null);
    setPhotoFile(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    let photoUrl = form.photo_url;
    if (photoFile) {
      setUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append("image", photoFile);
        const res = await fetch(`${getApiBase()}/api/uploads`, {
          method: "POST",
          headers: {
            ...authHeaders()
          },
          body: uploadData
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Photo upload failed");
        }
        const data = await res.json();
        photoUrl = data.url;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Photo upload failed");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    const payload = {
      ...form,
      photo_url: photoUrl || "",
      skills: skillsText
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    } as TeamMemberInput;

    if (editingId) {
      const previous = items.find((item) => item.id === editingId);
      if (!previous) return;
      const optimistic = { ...previous, ...payload } as TeamMemberItem;
      setItems((prev) => prev.map((item) => (item.id === editingId ? optimistic : item)));
      resetForm();
      try {
        const updated = await updateTeamMember(editingId, payload);
        setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      } catch (err) {
        setItems((prev) => prev.map((item) => (item.id === editingId ? previous : item)));
        setError(err instanceof Error ? err.message : "Update failed");
      }
      return;
    }

    const tempId = Date.now();
    const optimistic = { id: tempId, ...payload } as TeamMemberItem;
    setItems((prev) => [optimistic, ...prev]);
    resetForm();

    try {
      const created = await createTeamMember(payload);
      setItems((prev) => prev.map((item) => (item.id === tempId ? created : item)));
    } catch (err) {
      setItems((prev) => prev.filter((item) => item.id !== tempId));
      setError(err instanceof Error ? err.message : "Create failed");
    }
  };

  const handleEdit = (item: TeamMemberItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      role: item.role,
      skills: item.skills,
      photo_url: item.photo_url || ""
    });
    setPhotoFile(null);
    setSkillsText(item.skills?.join(", ") || "");
  };

  const handleDelete = async (id: number) => {
    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteTeamMember(id);
    } catch (err) {
      setItems(previous);
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="grid gap-8">
      <div className="card">
        <h2 className="text-xl font-semibold">{editingId ? "Edit Team Member" : "Add Team Member"}</h2>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Role"
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Skills (comma separated)"
            value={skillsText}
            onChange={(event) => setSkillsText(event.target.value)}
          />
          <div className="grid gap-2 md:col-span-2">
            <label className="text-xs uppercase tracking-widest text-slate-400">Photo</label>
            <input
              type="file"
              accept="image/*"
              className="input"
              onChange={(event) => setPhotoFile(event.target.files?.[0] || null)}
            />
            {form.photo_url ? (
              <p className="text-xs text-slate-400">Existing photo will be replaced if you upload a new one.</p>
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
              {uploading ? "Uploading..." : editingId ? "Save Changes" : "Add Member"}
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
        <h2 className="text-xl font-semibold">Team Members</h2>
        {loading ? <p className="mt-6 text-sm text-slate-400">Loading team members...</p> : null}
        {!loading && items.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">No members found.</p>
        ) : null}
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-slate-400">{item.role}</p>
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
                    onClick={() => setConfirmDelete({ id: item.id, name: item.name })}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-400">{item.description}</p>
              {item.skills?.length ? (
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                  {item.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-white/10 px-2 py-1">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title={confirmDelete ? `Delete member \"${confirmDelete.name}\"?` : "Delete member?"}
        description="This action cannot be undone."
        confirmText="Delete Member"
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
