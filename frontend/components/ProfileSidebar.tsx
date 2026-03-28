"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, CurrentUser } from "@/lib/api";

const roleToProfilePath = (role: string) => {
  if (role === "admin") return "/admin/profile";
  if (role === "leader") return "/leader/profile";
  return "/member/profile";
};

export default function ProfileSidebar() {
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
    return (
      <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 text-xs text-rose-400">
        {error}
      </aside>
    );
  }

  if (!user) {
    return (
      <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 text-xs text-slate-500">
        Loading profile...
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {user.profile_photo_url ? (
            <img
              src={user.profile_photo_url}
              alt={user.name}
              className="h-12 w-12 rounded-2xl border border-white/10 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs text-slate-400">
              Photo
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">{user.role}</p>
            <p className="text-sm font-semibold text-white">{user.name}</p>
          </div>
        </div>
        <Link
          href={roleToProfilePath(user.role)}
          className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white"
        >
          Profile
        </Link>
      </div>
    </aside>
  );
}
