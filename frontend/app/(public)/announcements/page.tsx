import Section from "@/components/Section";
import { formatDate } from "@/lib/utils";
import { getPublicAnnouncements } from "@/lib/publicApi";

export default async function AnnouncementsPage() {
  let announcements: Array<{ id: number; title: string; description: string; created_at: string }> = [];

  try {
    announcements = await getPublicAnnouncements();
  } catch (err) {
    announcements = [];
  }
  return (
    <main>
      <Section
        title="Announcements"
        subtitle="Stay on top of new initiatives, updates, and opportunities."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="card border border-amber-400/30 bg-gradient-to-br from-rose-500/10 via-amber-400/10 to-emerald-500/10"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-amber-200/80">
                  {formatDate(announcement.created_at)}
                </p>
                <span className="rounded-full bg-gradient-to-r from-rose-400/40 via-amber-300/40 to-emerald-400/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-amber-100">
                  Important
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{announcement.title}</h3>
              <p className="mt-2 text-sm text-slate-200/80">{announcement.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
