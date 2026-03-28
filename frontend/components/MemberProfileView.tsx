"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMemberById, MemberItem } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const emptyLinks = {
  linkedin: "",
  github: "",
  twitter: "",
  website: ""
};

type SocialLinks = typeof emptyLinks;

type Props = {
  memberId: number | string;
  backHref?: string;
  title?: string;
  showBack?: boolean;
};

export default function MemberProfileView({
  memberId,
  backHref,
  title = "Member Profile",
  showBack = true
}: Props) {
  const [member, setMember] = useState<MemberItem | null>(null);
  const [links, setLinks] = useState<SocialLinks>(emptyLinks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMemberById(memberId);
        if (!mounted) return;
        setMember(data);
        if (data.social_links) {
          try {
            const parsed = JSON.parse(data.social_links) as Partial<SocialLinks>;
            setLinks({ ...emptyLinks, ...parsed });
          } catch (err) {
            setLinks(emptyLinks);
          }
        } else {
          setLinks(emptyLinks);
        }
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

  const fields = [
    { label: "Login ID", value: member.login_id },
    { label: "Team Role", value: member.team_role ? member.team_role : "-" },
    { label: "Email", value: member.email || "-" },
    { label: "Phone", value: member.phone || "-" },
    { label: "Branch", value: member.branch || "-" },
    { label: "Year", value: member.year || "-" },
    { label: "College", value: member.college || "-" },
    { label: "Joined", value: member.created_at ? formatDate(member.created_at) : "-" }
  ];

  const hasLinks = Object.values(links).some(Boolean);

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
          {member.profile_photo_url ? (
            <img
              src={member.profile_photo_url}
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
            {member.description ? (
              <p className="mt-2 text-sm text-slate-400">{member.description}</p>
            ) : null}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label}>
                <label className="text-xs uppercase tracking-widest text-slate-400">{field.label}</label>
                <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                  {field.value || "-"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {member.bio ? (
        <div className="mt-6">
          <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-300">Bio</h4>
          <p className="mt-2 text-sm text-slate-300">{member.bio}</p>
        </div>
      ) : null}

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

      {hasLinks ? (
        <div className="mt-6">
          <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-300">Social Links</h4>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {links.linkedin ? (
              <a
                href={links.linkedin}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neon-200"
              >
                LinkedIn
              </a>
            ) : null}
            {links.github ? (
              <a
                href={links.github}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neon-200"
              >
                GitHub
              </a>
            ) : null}
            {links.twitter ? (
              <a
                href={links.twitter}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neon-200"
              >
                Twitter/X
              </a>
            ) : null}
            {links.website ? (
              <a
                href={links.website}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neon-200"
              >
                Website
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
