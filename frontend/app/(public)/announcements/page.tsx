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
            <div key={announcement.id} className="card">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                {formatDate(announcement.created_at)}
              </p>
              <h3 className="mt-3 text-lg font-semibold">{announcement.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{announcement.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
