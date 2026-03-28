import Section from "@/components/Section";
import StatsGrid from "@/components/StatsGrid";
import EventCard from "@/components/EventCard";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import { getPublicEvents, getPublicStats } from "@/lib/publicApi";

export default async function HomePage() {
  let stats = [
    { label: "Active Members", value: "0" },
    { label: "Workshops Hosted", value: "0" },
    { label: "Community Events", value: "0" },
    { label: "Announcements", value: "0" }
  ];
  let featuredEvents: Array<{
    id: number;
    title: string;
    description: string;
    date: string;
    tag?: string;
    link?: string;
    image_url?: string;
  }> = [];

  try {
    const response = await getPublicEvents(6, 1);
        featuredEvents = response.data
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.start_date,
        tag: item.location || undefined,
        link: item.registration_link || undefined,
        image_url: item.image_url || undefined
      }));
  } catch (err) {
    featuredEvents = [];
  }

  try {
    const statData = await getPublicStats();
    stats = [
      { label: "Active Members", value: String(statData.members) },
      { label: "Workshops Hosted", value: String(statData.workshops) },
      { label: "Community Events", value: String(statData.events) },
      { label: "Announcements", value: String(statData.announcements) }
    ];
  } catch (err) {
    stats = [
      { label: "Active Members", value: "0" },
      { label: "Workshops Hosted", value: "0" },
      { label: "Community Events", value: "0" },
      { label: "Announcements", value: "0" }
    ];
  }
  return (
    <main>
      <section className="relative overflow-hidden bg-[var(--surface)]">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-dark bg-[size:80px_80px] opacity-20" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-20 md:flex-row md:items-center">
          <div className="flex-1">
            <p className="badge bg-neon-500/10 text-neon-400">GeeksforGeeks Campus Chapter</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
              Build with peers, learn with mentors, and ship real-world tech.
            </h1>
            <p className="mt-6 max-w-xl text-base text-slate-300">
              The GFG Community Platform is your single hub for events, workshops, announcements, and
              curated resources. Stay in sync with your campus tech squad.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/member-login"
                className="rounded-full bg-neon-500 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-ink-900"
              >
                Join Community
              </Link>
              <Link
                href="/events"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white"
              >
                Explore Events
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="glass relative overflow-hidden rounded-3xl p-8">
              <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-neon-500/30 blur-3xl" />
              <div className="absolute -bottom-16 left-0 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl" />
              <p className="text-xs uppercase tracking-widest text-slate-400">This Week</p>
              <h3 className="mt-4 text-2xl font-semibold">DSA Power Hour</h3>
              <p className="mt-3 text-sm text-slate-300">
                Solve 5 high-impact interview questions live with mentors.
              </p>
              <div className="mt-8 grid gap-4 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Sessions</span>
                  <span className="text-neon-400">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mentors</span>
                  <span className="text-neon-400">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Seats Remaining</span>
                  <span className="text-neon-400">24</span>
                </div>
              </div>
              <Link
                href="/events"
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-white/10 py-3 text-xs font-semibold uppercase tracking-widest text-white"
              >
                View schedule
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section title="Community Stats" subtitle="Momentum built by students and mentors working together.">
        <FadeIn>
          <StatsGrid stats={stats} />
        </FadeIn>
      </Section>

      <Section
        title="About the Community"
        subtitle="We connect builders, problem solvers, and mentors through impactful learning experiences."
      >
        <FadeIn>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card">
              <h3 className="text-lg font-semibold">Developer-First Culture</h3>
              <p className="mt-3 text-sm text-slate-400">
                Learn DSA, system design, and full-stack skills in an environment built for shipping and growth.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold">Mentorship & Collaboration</h3>
              <p className="mt-3 text-sm text-slate-400">
                Peer circles, mock interviews, and project squads keep you moving from beginner to leader.
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section
        title="Featured Events"
        subtitle="Stay ahead with high-energy events focused on interviews, projects, and collaboration."
      >
        <FadeIn>
          {featuredEvents.length === 0 ? (
            <p className="text-sm text-slate-400">New events will appear here soon.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          )}
        </FadeIn>
      </Section>

      <Section
        title="Built for Campus Communities"
        subtitle="From hack nights to leadership updates, everything lives in one streamlined platform."
      >
        <FadeIn>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card">
              <h3 className="text-lg font-semibold">Announcements & Resources</h3>
              <p className="mt-3 text-sm text-slate-400">
                Publish updates, share curated study tracks, and keep every cohort aligned.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold">Events & Workshops</h3>
              <p className="mt-3 text-sm text-slate-400">
                Plan sessions, track registrations, and showcase community experiences.
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>
    </main>
  );
}
