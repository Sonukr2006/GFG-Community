"use client";

import { useEffect, useState } from "react";
import { getProfiles, ProfileItem } from "@/lib/api";

const roleOptions = [
  { label: "Members", value: "members" },
  { label: "Leaders", value: "leaders" },
  { label: "Admins", value: "admins" }
] as const;

type RoleValue = (typeof roleOptions)[number]["value"];

export default function ProfilesManager() {
  const [role, setRole] = useState<RoleValue>("members");
  const [items, setItems] = useState<ProfileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfiles(role);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [role]);

  return (
    <div className="grid gap-8">
      <div className="card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Profiles</h2>
            <p className="text-sm text-slate-400">Admin can view all user profiles.</p>
          </div>
          <div className="flex gap-2">
            {roleOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest ${
                  role === opt.value
                    ? "bg-neon-500 text-ink-900"
                    : "border border-white/10 text-slate-300"
                }`}
                onClick={() => setRole(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? <p className="mt-6 text-sm text-slate-400">Loading profiles...</p> : null}
        {!loading && items.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">No profiles found.</p>
        ) : null}

        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  {item.profile_photo_url ? (
                    <img
                      src={item.profile_photo_url}
                      alt={item.name}
                      className="h-12 w-12 rounded-2xl border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs text-slate-400">
                      Photo
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-xs text-slate-400">{item.login_id}</p>
                    {item.team_role ? (
                      <span className="mt-1 inline-flex items-center rounded-full border border-neon-400/30 bg-neon-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-neon-200">
                        {item.team_role}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="text-xs text-slate-300">
                  {item.email ? <p>{item.email}</p> : null}
                  {item.phone ? <p>{item.phone}</p> : null}
                </div>
              </div>
              {item.bio ? <p className="mt-3 text-sm text-slate-300">{item.bio}</p> : null}
              {item.skills && item.skills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
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

        {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
