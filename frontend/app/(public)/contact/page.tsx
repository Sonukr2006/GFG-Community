import Section from "@/components/Section";

export default function ContactPage() {
  return (
    <main>
      <Section
        title="Contact Us"
        subtitle="Send a message to the leadership team or connect on social channels."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <form className="card space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">Name</label>
              <input className="input mt-2" placeholder="Your name" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">Email</label>
              <input className="input mt-2" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">Message</label>
              <textarea className="input mt-2 min-h-[140px]" placeholder="Tell us what you need" />
            </div>
            <button className="rounded-full bg-neon-500 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-ink-900">
              Send Message
            </button>
          </form>
          <div className="card">
            <h3 className="text-lg font-semibold">Connect with us</h3>
            <p className="mt-3 text-sm text-slate-400">
              Follow updates, workshop recaps, and upcoming sessions on our socials.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-300">
              <p>LinkedIn: linkedin.com/company/gfg-campus</p>
              <p>Instagram: @gfg_campus</p>
              <p>Email: gfg-community@campus.edu</p>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
