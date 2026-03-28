import Section from "@/components/Section";
import EventList, { EventItem } from "@/components/EventList";
import { getPublicEvents } from "@/lib/publicApi";

export default async function EventsPage() {
  let events: EventItem[] = [];
  try {
    const response = await getPublicEvents(50, 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    events = response.data.map((item) => {
      const start = new Date(item.start_date);
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.start_date,
        tag: item.location || undefined,
        link: item.registration_link || undefined,
        image_url: item.image_url || undefined,
        status: start >= today ? "upcoming" : "past"
      };
    });
  } catch (err) {
    events = [];
  }
  return (
    <main>
      <Section
        title="Community Events"
        subtitle="Discover upcoming sessions, register instantly, and revisit past highlights."
      >
        <EventList events={events} />
      </Section>
    </main>
  );
}
