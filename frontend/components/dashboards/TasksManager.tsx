"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createTask,
  deleteTask,
  getMembers,
  getTasks,
  updateTask,
  MemberItem,
  TaskInput,
  TaskItem
} from "@/lib/api";
import ConfirmDialog from "@/components/ConfirmDialog";

const emptyForm: TaskInput = {
  title: "",
  description: "",
  status: "pending",
  due_date: "",
  assigned_member_id: ""
};

export default function TasksManager() {
  const [items, setItems] = useState<TaskItem[]>([]);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [form, setForm] = useState<TaskInput>(emptyForm);
  const [memberQuery, setMemberQuery] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [assignAll, setAssignAll] = useState(false);
  const [teamRole, setTeamRole] = useState("all");
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [memberFilter, setMemberFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; title: string } | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const fetchMembers = async () => {
    try {
      const result = await getMembers();
      setMembers(result);
    } catch (err) {
      setMembers([]);
    }
  };

  const teamOptions = ["Technical", "Management", "PR", "Design", "Social Media", "General"];

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTasks({
        page,
        limit,
        search,
        status,
        member_id: memberFilter === "all" ? undefined : memberFilter
      });
      setItems(result.data);
      setTotal(result.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchList();
  }, [page, search, status, memberFilter]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setAssignAll(false);
    setMemberQuery("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const payload: TaskInput = {
      ...form,
      assigned_member_id: assignAll
        ? "all"
        : form.assigned_member_id
        ? Number(form.assigned_member_id)
        : undefined,
      due_date: form.due_date || undefined
    };

    if (editingId) {
      const previous = items.find((item) => item.id === editingId);
      if (!previous) return;
      const optimistic = { ...previous, ...payload } as TaskItem;
      setItems((prev) => prev.map((item) => (item.id === editingId ? optimistic : item)));
      resetForm();
      try {
        const updated = await updateTask(editingId, payload);
        setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      } catch (err) {
        setItems((prev) => prev.map((item) => (item.id === editingId ? previous : item)));
        setError(err instanceof Error ? err.message : "Update failed");
      }
      return;
    }

    const tempId = Date.now();
    const optimistic = { id: tempId, ...payload } as TaskItem;
    if (!assignAll) {
      setItems((prev) => [optimistic, ...prev].slice(0, limit));
      setTotal((prev) => prev + 1);
    }
    resetForm();

    try {
      const created = await createTask(payload);
      if (!assignAll) {
        setItems((prev) => prev.map((item) => (item.id === tempId ? (created as TaskItem) : item)));
      } else {
        await fetchList();
      }
    } catch (err) {
      if (!assignAll) {
        setItems((prev) => prev.filter((item) => item.id !== tempId));
        setTotal((prev) => Math.max(0, prev - 1));
      }
      setError(err instanceof Error ? err.message : "Create failed");
    }
  };

  const handleEdit = (item: TaskItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      status: item.status || "pending",
      due_date: item.due_date || "",
      assigned_member_id: item.assigned_member?.id ?? item.assigned_member_id ?? ""
    });
  };

  const handleDelete = async (id: number) => {
    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    setTotal((prev) => Math.max(0, prev - 1));
    try {
      await deleteTask(id);
    } catch (err) {
      setItems(previous);
      setTotal((prev) => prev + 1);
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="grid gap-8">
      <div className="card">
        <h2 className="text-xl font-semibold">{editingId ? "Edit Task" : "Assign Task"}</h2>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="input"
            placeholder="Task title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
          />
          <div className="grid gap-2 md:col-span-2">
            <label className="text-xs uppercase tracking-widest text-slate-400">Assign To</label>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={assignAll}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setAssignAll(checked);
                  if (checked) {
                    setForm({ ...form, assigned_member_id: "" });
                    setMemberQuery("All members");
                  } else {
                    setMemberQuery("");
                  }
                }}
              />
              Assign to all members
            </label>
            <div className="relative">
              <label className="text-xs uppercase tracking-widest text-slate-400">Team Role</label>
              <button
                type="button"
                className="input mt-2 flex w-full items-center justify-between bg-ink-900 text-slate-200"
                onClick={() => setTeamDropdownOpen((prev) => !prev)}
                disabled={assignAll}
              >
                <span>{teamRole === "all" ? "All Teams" : `${teamRole} Team`}</span>
                <span className="text-xs text-slate-400">▼</span>
              </button>
              {teamDropdownOpen && !assignAll ? (
                <div className="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-white/10 bg-ink-900/95 p-2 shadow-2xl backdrop-blur">
                  <button
                    type="button"
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      setTeamRole("all");
                      setTeamDropdownOpen(false);
                    }}
                  >
                    All Teams
                  </button>
                  {teamOptions.map((role) => (
                    <button
                      key={role}
                      type="button"
                      className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        setTeamRole(role);
                        setTeamDropdownOpen(false);
                      }}
                    >
                      {role === "PR" ? "PR Team" : role === "General" ? "General" : `${role} Team`}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="relative">
              <input
                className="input"
                placeholder="Search by member name"
                value={memberQuery}
                onChange={(event) => {
                  setMemberQuery(event.target.value);
                  setShowMemberDropdown(true);
                }}
                onFocus={() => setShowMemberDropdown(true)}
                onBlur={() => {
                  setTimeout(() => setShowMemberDropdown(false), 150);
                }}
                disabled={assignAll}
              />
              {showMemberDropdown && memberQuery && !assignAll ? (
                <div className="absolute left-0 right-0 z-20 mt-2 max-h-56 overflow-auto rounded-2xl border border-white/10 bg-ink-900/95 p-2 shadow-2xl backdrop-blur">
                  {members
                    .filter((member) => {
                      const q = memberQuery.toLowerCase();
                      return (
                        (teamRole === "all" || member.team_role === teamRole) &&
                        (member.name.toLowerCase().includes(q) ||
                          member.login_id.toLowerCase().includes(q))
                      );
                    })
                    .map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          setForm({ ...form, assigned_member_id: member.id });
                          setMemberQuery(`${member.name} (${member.login_id})`);
                          setShowMemberDropdown(false);
                        }}
                      >
                        {member.name} <span className="text-xs text-slate-400">({member.login_id})</span>
                        {member.team_role ? (
                          <span className="ml-2 text-[10px] uppercase tracking-widest text-neon-300/80">
                            {member.team_role}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  {members.filter((member) => {
                    const q = memberQuery.toLowerCase();
                    return (
                      (teamRole === "all" || member.team_role === teamRole) &&
                      (member.name.toLowerCase().includes(q) ||
                        member.login_id.toLowerCase().includes(q))
                    );
                  }).length === 0 ? (
                    <p className="px-3 py-2 text-xs text-slate-400">No members found.</p>
                  ) : null}
                </div>
              ) : null}
            </div>
            <input type="hidden" value={form.assigned_member_id} />
          </div>
          <textarea
            className="input md:col-span-2 min-h-[120px]"
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            required
          />
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-widest text-slate-400">Due Date</label>
            <input
              type="date"
              className="input"
              value={form.due_date}
              onChange={(event) => setForm({ ...form, due_date: event.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-widest text-slate-400">Status</label>
            <select
              className="input"
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-neon-500 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-ink-900"
            >
              {editingId ? "Save Changes" : "Assign Task"}
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
          <h2 className="text-xl font-semibold">Assigned Tasks</h2>
          <div className="flex flex-wrap gap-3">
            <input
              className="input md:w-64"
              placeholder="Search tasks"
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
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select
              className="input md:w-56"
              value={memberFilter}
              onChange={(event) => {
                setMemberFilter(event.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Members</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.login_id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? <p className="mt-6 text-sm text-slate-400">Loading tasks...</p> : null}
        {!loading && items.length === 0 ? <p className="mt-6 text-sm text-slate-400">No tasks yet.</p> : null}

        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    {item.status?.replace("_", " ") || "pending"}
                  </p>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                  {item.assigned_member ? (
                    <p className="mt-2 text-xs text-slate-400">
                      Assigned to {item.assigned_member.name} ({item.assigned_member.login_id})
                    </p>
                  ) : null}
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
              {item.due_date ? (
                <p className="mt-3 text-xs text-slate-400">Due: {item.due_date.slice(0, 10)}</p>
              ) : null}
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
        title={confirmDelete ? `Delete task \"${confirmDelete.title}\"?` : "Delete task?"}
        description="This action cannot be undone."
        confirmText="Delete Task"
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
