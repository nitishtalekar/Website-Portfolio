import Cards from "@/components/Cards";
import Chapters from "@/components/Chapters";
import CheatCode from "@/components/CheatCode";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Inventory from "@/components/Inventory";
import Rows from "@/components/Rows";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import Shelf from "@/components/Shelf";
import Statement from "@/components/Statement";
import Timeline from "@/components/Timeline";
import { resume } from "@/content/resume";

/**
 * Everything rendered here comes straight from content/resume.json.
 * Each chapter has its own form (list, cards, book stack, inventory,
 * path, statement), all drawn from the same tokens.
 */
export default function Home() {
  const { work, projects, research, stack, education, community, contact, chapters } = resume;
  const icon = (id: string) => chapters.find((c) => c.id === id)?.icon;

  return (
    <>
      <Chapters chapters={chapters} />
      <CheatCode />
      <main>
        <Hero />

        <Section id="work">
          <SectionHeader id="work" title={work.title} sub={work.sub} icon={icon("work")} />
          <Rows items={work.items} pageSize={work.pageSize} />
        </Section>

        <Section id="projects">
          <SectionHeader id="projects" title={projects.title} sub={projects.sub} icon={icon("projects")} />
          <Cards items={projects.items} pageSize={projects.pageSize} />
        </Section>

        <Section id="research">
          <SectionHeader id="research" title={research.title} sub={research.sub} icon={icon("research")} />
          <Shelf items={research.items} pageSize={research.pageSize} />
          <p className="pending" style={{ marginTop: "1.25rem", fontSize: "0.9375rem" }}>
            {research.scholar.url ? (
              <a className="link" href={research.scholar.url} target="_blank" rel="noopener noreferrer">
                {research.scholar.label}
              </a>
            ) : (
              research.scholar.pending
            )}
          </p>
        </Section>

        <Section id="stack">
          <SectionHeader id="stack" title={stack.title} sub={stack.sub} icon={icon("stack")} />
          <Inventory groups={stack.groups} />
        </Section>

        <Section id="education">
          <SectionHeader id="education" title={education.title} sub={education.sub} icon={icon("education")} />
          <Timeline items={education.items} />
        </Section>

        <Section id="community">
          <SectionHeader id="community" title={community.title} sub={community.sub} icon={icon("community")} />
          <Statement items={community.items} />
        </Section>

        <Section id="contact">
          <SectionHeader id="contact" title={contact.title} sub={contact.sub} icon={icon("contact")} />
          <Contact email={resume.profile.email} links={resume.profile.links} scholar={research.scholar} contact={contact} />
        </Section>
      </main>
    </>
  );
}
