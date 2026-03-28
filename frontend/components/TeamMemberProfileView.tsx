"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTeamMemberById, TeamMemberItem } from "@/lib/api";
import { formatDate } from "@/lib/utils";

type Props = {
  memberId: number | string;
  backHref?: string;
  title?: string;
  showBack?: boolean;
};

export default function TeamMemberProfileView({
  memberId,
  backHref,
  title = "Team Member Profile",
  showBack = true
}: Props) {
  const [member, setMember] = useState<TeamMemberItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTeamMemberById(memberId);
        if (!mounted) return;
        setMember(data);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unable to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [memberId]);

  if (loading) {
    return <p className="text-sm text-slate-400">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-sm text-rose-400">{error}</p>;
  }

  if (!member) {
    return <p className="text-sm text-rose-400">Profile not available.</p>;
  }

  return (
    <div className="card">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-slate-400">Read-only view</p>
        </div>
        {showBack && backHref ? (
          <Link
            href={backHref}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Back
          </Link>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[200px_1fr]">
        <div className="flex items-center justify-center">
          {member.photo_url ? (
            <img
              src={member.photo_url}
              alt={member.name}
              className="h-40 w-40 rounded-3xl border border-white/10 object-cover"
            />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-xs text-slate-400">
              No Photo
            </div>
          )}
        </div>
        <div>
          <div>
            <h3 className="text-2xl font-semibold">{member.name}</h3>
            <p className="mt-2 text-sm text-slate-400">{member.role}</p>
            {member.created_at ? (
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">
                Joined {formatDate(member.created_at)}
              </p>
            ) : null}
          </div>
          <div className="mt-6">
            <label className="text-xs uppercase tracking-widest text-slate-400">About</label>
            <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              {member.description}
            </div>
          </div>
        </div>
      </div>

      {member.skills && member.skills.length > 0 ? (
        <div className="mt-6">
          <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-300">Skills</h4>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
            {member.skills.map((skill) => (
              <span key={skill} className="rounded-full border border-white/10 px-2 py-1">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
