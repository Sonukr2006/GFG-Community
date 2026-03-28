import Section from "@/components/Section";
import Image from "next/image";
import { getPublicGallery } from "@/lib/publicApi";

export default async function GalleryPage() {
  let gallery: string[] = [];
  try {
    const response = await getPublicGallery();
    gallery = response.map((item) => item.image_url);
  } catch (err) {
    gallery = [];
  }
  return (
    <main>
      <Section
        title="Gallery"
        subtitle="Moments from workshops, hackathons, and community milestones."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {gallery.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-white/10">
              <Image src={image} alt={`Gallery ${index + 1}`} width={600} height={400} />
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
