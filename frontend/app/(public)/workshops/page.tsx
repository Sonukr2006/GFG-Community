import Section from "@/components/Section";
import WorkshopCard from "@/components/WorkshopCard";
import { getPublicWorkshops } from "@/lib/publicApi";

export default async function WorkshopsPage() {
  let workshops: Array<{
    id: number;
    title: string;
    description: string;
    date: string;
    level: string;
    image_url?: string;
  }> = [];

  try {
    const response = await getPublicWorkshops(50, 1);
    workshops = response.data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      date: item.date,
      level: item.level || "Community",
      image_url: item.image_url || undefined
    }));
  } catch (err) {
    workshops = [];
  }
  return (
    <main>
      <Section
        title="Workshops"
        subtitle="Deep dive sessions to level up your technical skills and confidence."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {workshops.map((workshop) => (
            <WorkshopCard key={workshop.id} {...workshop} />
          ))}
        </div>
      </Section>
    </main>
  );
}
