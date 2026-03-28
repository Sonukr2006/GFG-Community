import Section from "@/components/Section";
import { getPublicResources } from "@/lib/publicApi";

export default async function ResourcesPage() {
  let resources: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    link: string;
  }> = [];

  try {
    const response = await getPublicResources(50, 1);
    resources = response.data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      link: item.link
    }));
  } catch (err) {
    resources = [];
  }
  return (
    <main>
      <Section
        title="Learning Resources"
        subtitle="Curated paths for DSA, competitive programming, web, and interview prep."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {resources.map((resource) => (
            <div key={resource.id} className="card">
              <p className="badge bg-white/5 text-slate-300">{resource.category}</p>
              <h3 className="mt-4 text-lg font-semibold">{resource.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{resource.description}</p>
              <a
                href={resource.link}
                className="mt-4 inline-flex text-sm font-semibold text-neon-400"
                target="_blank"
                rel="noreferrer"
              >
                Open resource →
              </a>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
