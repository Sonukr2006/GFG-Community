"use client";

import { useState } from "react";
import Section from "@/components/Section";
import { submitContactMessage } from "@/lib/publicApi";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    setStatus("idle");
    setError("");
    try {
      await submitContactMessage(form);
      setForm({ name: "", email: "", message: "" });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unable to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <main>
      <Section
        title="Contact Us"
        subtitle="Send a message to the leadership team or connect on social channels."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <form className="card space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">Name</label>
              <input
                className="input mt-2"
                placeholder="Your name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">Email</label>
              <input
                type="email"
                className="input mt-2"
                placeholder="you@example.com"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">Message</label>
              <textarea
                className="input mt-2 min-h-[140px]"
                placeholder="Tell us what you need"
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                required
              />
            </div>
            <button
              disabled={sending}
              className="rounded-full bg-neon-500 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-ink-900 disabled:opacity-70"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
            {status === "success" ? (
              <p className="text-sm text-emerald-300">Message sent successfully.</p>
            ) : null}
            {status === "error" ? <p className="text-sm text-rose-300">{error}</p> : null}
          </form>
          <div className="card">
            <h3 className="text-lg font-semibold">Connect with us</h3>
            <p className="mt-3 text-sm text-slate-400">
              Follow updates, workshop recaps, and upcoming sessions on our socials.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-300">
              <p>LinkedIn: https://www.linkedin.com/in/geeksforgeeks-cgc-university-mohali-0630a63a8/</p>
              <p>Instagram: https://www.instagram.com/gfg_campus_body/</p>
              <p>Email:  gfg.cgcu.campusbody@gmail.com</p>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
