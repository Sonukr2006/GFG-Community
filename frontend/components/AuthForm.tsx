"use client";

import { useState } from "react";
import { getApiBase, setSession, UserRole } from "@/lib/auth";

export default function AuthForm({
  role,
  endpoint,
  title,
  hint
}: {
  role: UserRole;
  endpoint: string;
  title: string;
  hint: string;
}) {
  const [form, setForm] = useState({ id: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${getApiBase()}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Login failed");
      }
      const data = await res.json();
      setSession(data.token, role);
      window.location.href = `/${role}`;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-slate-400">{hint}</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">ID</label>
          <input
            className="input mt-2"
            value={form.id}
            onChange={(event) => setForm({ ...form, id: event.target.value })}
            placeholder="your_id"
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Password</label>
          <input
            type="password"
            className="input mt-2"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="••••••••"
            required
          />
        </div>
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-neon-500 py-3 text-sm font-semibold uppercase tracking-widest text-ink-900 transition hover:bg-neon-400"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
