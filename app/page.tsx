import Cards from "@/components/Cards";
import Chapters from "@/components/Chapters";
import CheatCode from "@/components/CheatCode";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Inventory from "@/components/Inventory";
import ParticleField from "@/components/ParticleField";
import { Paged, PagerSlot } from "@/components/Paged";
import Rows from "@/components/Rows";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import Shelf from "@/components/Shelf";
import Statement from "@/components/Statement";
import Studio from "@/components/Studio";
import Tabs from "@/components/Tabs";
import { site } from "@/content/site";
import Timeline from "@/components/Timeline";
import { getPublicResume } from "@/lib/backbone";

/**
 * Everything rendered here comes from the resume stored in Backbone (edited at /admin),
 * falling back to content/resume.json if the backend is unreachable.
 * Each chapter has its own form (list, cards, book stack, inventory,
 * path, statement), all drawn from the same tokens.
 */
const tabIcons = { work: "sword", education: "scholar", stack: "server", research: "openbook" } as const;

export default async function Home() {
  const resume = await getPublicResume();
  const { work, projects, research, stack, education, community, contact, chapters } = resume;
  const icon = (id: string) => chapters.find((c) => c.id === id)?.icon;

  return (
    <>
      <ParticleField chapters={chapters} />
      <Chapters chapters={chapters} />
      <CheatCode />
      <main>
        <Hero resume={resume} />

        <Section id="background">
          <Tabs
            label="Background"
            tabs={[
              {
                id: "work",
                label: work.title,
                icon: tabIcons.work,
                panel: (
                  <Paged count={work.items.length} pageSize={work.pageSize}>
                    <SectionHeader id="work" title={work.title} sub={work.sub} icon={tabIcons.work} aside={<PagerSlot />} />
                    <Rows items={work.items} />
                  </Paged>
                ),
              },
              {
                id: "education",
                label: education.title,
                icon: tabIcons.education,
                panel: (
                  <>
                    <SectionHeader id="education" title={education.title} sub={education.sub} icon={tabIcons.education} />
                    <Timeline items={education.items} />
                  </>
                ),
              },
              {
                id: "stack",
                label: stack.title,
                icon: tabIcons.stack,
                panel: (
                  <>
                    <SectionHeader id="stack" title={stack.title} sub={stack.sub} icon={tabIcons.stack} />
                    <Inventory groups={stack.groups} />
                  </>
                ),
              },
              {
                id: "research",
                label: research.title,
                icon: tabIcons.research,
                panel: (
                  <>
                    <Paged count={research.items.length} pageSize={research.pageSize} mobilePageSize={research.mobilePageSize}>
                      <SectionHeader id="research" title={research.title} sub={research.sub} icon={tabIcons.research} aside={<PagerSlot />} />
                      <Shelf items={research.items} />
                    </Paged>
                    <p className="pending" style={{ marginTop: "1.25rem", fontSize: "0.9375rem" }}>
                      {research.scholar.url ? (
                        <a className="link" href={research.scholar.url} target="_blank" rel="noopener noreferrer">
                          {research.scholar.label}
                        </a>
                      ) : (
                        research.scholar.pending
                      )}
                    </p>
                  </>
                ),
              },
              {
                id: "community",
                label: community.title,
                icon: "heart",
                panel: (
                  <>
                    <SectionHeader id="community" title={community.title} sub={community.sub} icon="heart" />
                    <Statement items={community.items} />
                  </>
                ),
              },
            ]}
          />
        </Section>

        <Section id="projects">
          <Paged count={projects.items.length} pageSize={projects.pageSize}>
            <SectionHeader id="projects" title={projects.title} sub={projects.sub} icon={icon("projects")} aside={<PagerSlot />} />
            <Cards items={projects.items} />
          </Paged>
        </Section>

        <Section id="studio">
          <SectionHeader id="studio" title={site.studio.title} sub={site.studio.sub} icon={icon("studio")} />
          <Studio {...site.studio} />
        </Section>

        <Section id="contact">
          <SectionHeader id="contact" title={contact.title} sub={contact.sub} icon={icon("contact")} />
          <Contact email={resume.profile.email} links={resume.profile.links} scholar={research.scholar} contact={contact} />
        </Section>
      </main>
    </>
  );
}
