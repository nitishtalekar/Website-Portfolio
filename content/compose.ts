import { site } from "./site";
import type { Entry, Resume, ResumeData, Row } from "./types";

/** Symbol for a profile link, chosen from its URL. Unknown sites get a generic link symbol. */
function iconFor(url: string): string {
  const u = url.toLowerCase();
  if (u.includes("github.")) return "github";
  if (u.includes("linkedin.")) return "linkedin";
  if (u.includes("scholar.google")) return "scholar";
  return "link";
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Rows need a stable key for expand/collapse; derive it from position and title so the data doesn't carry ids. */
function rows(entries: Entry[], pending?: string): Row[] {
  return entries.map((e, i) => ({
    ...e,
    id: `${i}-${slug(e.title)}`,
    ...(pending && !e.links?.length ? { pending } : {}),
  }));
}

/** Projects show their links as icons on the card, never as text. Older entries kept them in a free-form list; fold those into the two fixed slots. */
function projectRows(entries: Entry[]): Row[] {
  return rows(entries).map(({ links, ...r }) => {
    const github = r.github || links?.find((l) => iconFor(l.url) === "github")?.url;
    const website = r.website || links?.find((l) => iconFor(l.url) !== "github")?.url;
    return { ...r, ...(github ? { github } : {}), ...(website ? { website } : {}) };
  });
}

/** Merge the pure resume document with the website's own structure (content/site.ts) into what the components render. */
export function compose(data: ResumeData): Resume {
  const { sections: s, contact } = site;
  const isScholar = (l: { label: string; url: string }) => /scholar/i.test(l.label) || iconFor(l.url) === "scholar";
  const scholarLink = data.profile.links.find(isScholar);

  return {
    profile: {
      ...data.profile,
      aside: site.aside,
      links: data.profile.links.filter((l) => !isScholar(l)).map((l) => ({ ...l, icon: iconFor(l.url) })),
    },
    chapters: [...site.chapters],
    work: { ...s.work, items: rows(data.work) },
    projects: { ...s.projects, items: projectRows(data.projects) },
    research: {
      ...s.research,
      items: rows(data.research, site.paperPending),
      scholar: { label: site.scholar.label, url: scholarLink?.url ?? "", pending: site.scholar.pending },
    },
    stack: { ...s.stack, groups: data.stack },
    education: { ...s.education, items: rows(data.education) },
    community: { ...s.community, items: rows(data.community) },
    contact: { ...contact, now: [...contact.now] },
  };
}
