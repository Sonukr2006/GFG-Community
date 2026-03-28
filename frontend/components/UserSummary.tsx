"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, CurrentUser } from "@/lib/api";

export default function UserSummary() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load profile");
      }
    };
    load();
  }, []);

  if (error) {
    return <p className="text-xs text-rose-400">{error}</p>;
  }

  if (!user) {
    return <p className="text-xs text-slate-500">Loading profile...</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
      <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-widest">
        {user.role}
      </span>
      <span className="font-semibold text-white">{user.name}</span>
      <span className="text-xs text-slate-400">{user.login_id}</span>
      {user.description ? <span className="text-xs text-slate-400">• {user.description}</span> : null}
    </div>
  );
}
