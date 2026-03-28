import Section from "@/components/Section";
import Image from "next/image";
import { getPublicTeamMembers } from "@/lib/publicApi";

export default async function TeamPage() {
  let teamMembers: Array<{
    id: number;
    name: string;
    role: string;
    skills: string[];
    image?: string;
    description?: string;
  }> = [];

  try {
    const response = await getPublicTeamMembers();
    teamMembers = response.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      skills: member.skills || [],
      image: member.photo_url || undefined,
      description: member.description || ""
    }));
  } catch (err) {
    teamMembers = [];
  }
  return (
    <main>
      <Section
        title="Community Team"
        subtitle="Leaders and volunteers guiding the community forward."
      >
        <div className="grid gap-6 md:grid-cols-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="card text-center">
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full">
                {member.image ? (
                  <Image src={member.image} alt={member.name} width={120} height={120} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white/10 text-sm">
                    {member.name[0]}
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-slate-400">{member.role}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-slate-400">
                {member.skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-white/10 px-2 py-1">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
