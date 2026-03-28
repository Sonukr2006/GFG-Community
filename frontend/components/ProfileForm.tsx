"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, updateCurrentUser, updatePassword, CurrentUser } from "@/lib/api";
import { authHeaders, getApiBase } from "@/lib/auth";

const teamOptions = ["Technical", "Management", "PR", "Design", "Social Media", "General"];

export default function ProfileForm() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    team_role: "General",
    profile_photo_url: "",
    email: "",
    phone: "",
    branch: "",
    year: "",
    college: "",
    skills: [] as string[],
    bio: "",
    social_links: ""
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [skillsText, setSkillsText] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    twitter: "",
    website: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "" });
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "success" | "error">("idle");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentUser();
      setUser(data);
      let parsedLinks = { linkedin: "", github: "", twitter: "", website: "" };
      if (data.social_links) {
        try {
          parsedLinks = { ...parsedLinks, ...JSON.parse(data.social_links) };
        } catch (err) {
          parsedLinks = { linkedin: "", github: "", twitter: "", website: "" };
        }
      }
      setForm({
        name: data.name || "",
        description: data.description || "",
        team_role: data.team_role || "General",
        profile_photo_url: data.profile_photo_url || "",
        email: data.email || "",
        phone: data.phone || "",
        branch: data.branch || "",
        year: data.year || "",
        college: data.college || "",
        skills: data.skills || [],
        bio: data.bio || "",
        social_links: data.social_links || ""
      });
      setSkillsText((data.skills || []).join(", "));
      setSocialLinks(parsedLinks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      let photoUrl = form.profile_photo_url;
      if (photoFile) {
        const uploadData = new FormData();
        uploadData.append("image", photoFile);
        const res = await fetch(`${getApiBase()}/api/uploads`, {
          method: "POST",
          headers: { ...authHeaders() },
          body: uploadData
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Photo upload failed");
        }
        const data = await res.json();
        photoUrl = data.url;
      }

      const updated = await updateCurrentUser({
        ...form,
        profile_photo_url: photoUrl || "",
        skills: skillsText
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        bio: form.bio || "",
        social_links: JSON.stringify(socialLinks)
      });
      setForm((prev) => ({ ...prev, profile_photo_url: updated.profile_photo_url || "" }));
      setUser(updated);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordStatus("idle");
    setPasswordError(null);
    try {
      await updatePassword(passwordForm);
      setPasswordStatus("success");
      setPasswordForm({ current_password: "", new_password: "" });
    } catch (err) {
      setPasswordStatus("error");
      setPasswordError(err instanceof Error ? err.message : "Unable to update password");
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-400">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-sm text-rose-400">Profile not available.</p>;
  }

  return (
    <div className="card">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">My Profile</h2>
          {user.role !== "admin" && user.team_role ? (
            <span className="mt-2 inline-flex items-center rounded-full border border-neon-400/30 bg-neon-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-neon-200">
              {user.team_role}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-4">
          {form.profile_photo_url ? (
            <img
              src={form.profile_photo_url}
              alt={user.name}
              className="h-16 w-16 rounded-2xl border border-white/10 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs text-slate-400">
              No Photo
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Login ID</label>
          <input className="input mt-2" value={user.login_id} readOnly />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Email</label>
          <input
            className="input mt-2"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Role</label>
          <input className="input mt-2" value={user.role} readOnly />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Phone</label>
          <input
            className="input mt-2"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Name</label>
          <input
            className="input mt-2"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Joined</label>
          <input
            className="input mt-2"
            value={new Date(user.created_at).toLocaleDateString()}
            readOnly
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Branch</label>
          <input
            className="input mt-2"
            value={form.branch}
            onChange={(event) => setForm({ ...form, branch: event.target.value })}
            placeholder="CSE / IT / ECE"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Year</label>
          <input
            className="input mt-2"
            value={form.year}
            onChange={(event) => setForm({ ...form, year: event.target.value })}
            placeholder="2nd / 3rd / 4th"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-widest text-slate-400">College</label>
          <input
            className="input mt-2"
            value={form.college}
            onChange={(event) => setForm({ ...form, college: event.target.value })}
            placeholder="College name"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-widest text-slate-400">Skills</label>
          <input
            className="input mt-2"
            value={skillsText}
            onChange={(event) => setSkillsText(event.target.value)}
            placeholder="DSA, React, Node.js"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-widest text-slate-400">Bio</label>
          <textarea
            className="input mt-2 min-h-[120px]"
            value={form.bio}
            onChange={(event) => setForm({ ...form, bio: event.target.value })}
          />
        </div>
        <div className="md:col-span-2 grid gap-3">
          <label className="text-xs uppercase tracking-widest text-slate-400">Social Links</label>
          <input
            className="input"
            placeholder="LinkedIn URL"
            value={socialLinks.linkedin}
            onChange={(event) => setSocialLinks({ ...socialLinks, linkedin: event.target.value })}
          />
          <input
            className="input"
            placeholder="GitHub URL"
            value={socialLinks.github}
            onChange={(event) => setSocialLinks({ ...socialLinks, github: event.target.value })}
          />
          <input
            className="input"
            placeholder="Twitter/X URL"
            value={socialLinks.twitter}
            onChange={(event) => setSocialLinks({ ...socialLinks, twitter: event.target.value })}
          />
          <input
            className="input"
            placeholder="Website/Portfolio URL"
            value={socialLinks.website}
            onChange={(event) => setSocialLinks({ ...socialLinks, website: event.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-widest text-slate-400">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            className="input mt-2"
            onChange={(event) => setPhotoFile(event.target.files?.[0] || null)}
          />
        </div>
        {user.role !== "admin" ? (
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-widest text-slate-400">Team Role</label>
            <div className="relative mt-2">
              <button
                type="button"
                className="input flex w-full items-center justify-between bg-ink-900 text-slate-200"
                onClick={() => setTeamDropdownOpen((prev) => !prev)}
              >
                <span>
                  {form.team_role === "PR"
                    ? "PR Team"
                    : form.team_role === "General"
                    ? "General"
                    : `${form.team_role} Team`}
                </span>
                <span className="text-xs text-slate-400">▼</span>
              </button>
              {teamDropdownOpen ? (
                <div className="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-white/10 bg-ink-900/95 p-2 shadow-2xl backdrop-blur">
                  {teamOptions.map((role) => (
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
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-neon-500 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-ink-900 disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
        {error ? <p className="text-sm text-rose-300 md:col-span-2">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-300 md:col-span-2">{success}</p> : null}
      </form>
      <div className="mt-10 border-t border-white/10 pt-8">
        <h3 className="text-lg font-semibold">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            type="password"
            className="input"
            placeholder="Current password"
            value={passwordForm.current_password}
            onChange={(event) =>
              setPasswordForm({ ...passwordForm, current_password: event.target.value })
            }
            required
          />
          <input
            type="password"
            className="input"
            placeholder="New password"
            value={passwordForm.new_password}
            onChange={(event) => setPasswordForm({ ...passwordForm, new_password: event.target.value })}
            required
          />
          <button
            type="submit"
            className="rounded-full border border-white/15 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Update Password
          </button>
          {passwordStatus === "error" ? (
            <p className="text-sm text-rose-300 md:col-span-2">{passwordError}</p>
          ) : null}
          {passwordStatus === "success" ? (
            <p className="text-sm text-emerald-300 md:col-span-2">Password updated.</p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
