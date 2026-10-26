/**
 * Shape of content/resume.json. Everything is stored exactly as it is shown:
 * dates are display strings and lists are in display order. Add an entry by writing it where you want it to appear; a
 * section with `pageSize` paginates once it has more entries than that.
 * Nothing is sorted, formatted or counted in code.
 */

export interface Highlight {
  value: string;
  label: string;
}

export interface Link {
  label: string;
  url: string;
}

/** One expandable row. Every field except `id` and `title` is optional. */
export interface Row {
  id: string;
  title: string;
  /** Short secondary line shown beside the title (role, venue, category...). */
  subtitle?: string;
  /** Date or range, shown in mono at the left. */
  when?: string;
  summary?: string;
  points?: string[];
  highlights?: Highlight[];
  details?: { label: string; value: string }[];
  tags?: string[];
  links?: Link[];
  /** Shown instead of links while `links` is empty. */
  pending?: string;
}

interface Section {
  title: string;
  sub: string;
}

export interface RowSection extends Section {
  items: Row[];
  /** Entries per page. Omit to show everything on one page. */
  pageSize?: number;
}

export interface Resume {
  profile: {
    firstName: string;
    lastName: string;
    role: string;
    org: string;
    tagline: string;
    aside: string;
    email: string;
    links: Link[];
  };
  /** `icon` is a name from components/Icon.tsx. */
  chapters: { id: string; label: string; icon: string }[];
  work: RowSection;
  projects: RowSection;
  research: RowSection & { scholar: { label: string; url: string; pending: string } };
  stack: Section & { groups: { label: string; items: string[] }[] };
  education: RowSection;
  community: RowSection;
  contact: Section & {
    hint: string;
    copied: string;
    mail: string;
    now: { label: string; text: string }[];
  };
}
