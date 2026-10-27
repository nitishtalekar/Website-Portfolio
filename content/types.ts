/**
 * Two shapes live here.
 *
 * `ResumeData` is what content/resume.json (and the Backbone copy edited at /admin) holds:
 * purely the facts of the resume, in display order, with dates as display strings. No
 * section titles, icons, nav labels, page sizes or other website copy.
 *
 * `Resume` is what the components render: the data above merged with content/site.ts by
 * content/compose.ts, which is where all website structure and logic lives.
 */

export interface Highlight {
  value: string;
  label: string;
}

export interface Link {
  label: string;
  url: string;
  /** Optional symbol name from components/Icon.tsx. */
  icon?: string;
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
  /** Projects: repository and live-deployment URLs, shown as icons when present. */
  github?: string;
  website?: string;
  /** Projects: card art, a name from components/Icon.tsx. */
  icon?: string;
  /** Shown instead of links while `links` is empty. */
  pending?: string;
}

interface Section {
  title: string;
  /** One or more wordings; the page picks one at random on each load. */
  sub: string | readonly string[];
}

export interface RowSection extends Section {
  items: Row[];
  /** Entries per page. Omit to show everything on one page. */
  pageSize?: number;
  /** Entries per page on phones. Defaults to `pageSize`. */
  mobilePageSize?: number;
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
    copied: string;
    now: { label: string; text: string }[];
  };
}

/** One entry in a resume list. Only `title` is required. */
export interface Entry {
  title: string;
  subtitle?: string;
  /** Date or range, as it should read. */
  when?: string;
  summary?: string;
  points?: string[];
  highlights?: Highlight[];
  details?: { label: string; value: string }[];
  tags?: string[];
  links?: { label: string; url: string }[];
  /** Research only: the paper itself. */
  url?: string;
  /** Projects only. */
  icon?: string;
  github?: string;
  website?: string;
}

/** The pure resume document. Every list is in display order (newest first by convention). */
export interface ResumeData {
  profile: {
    firstName: string;
    lastName: string;
    role: string;
    org: string;
    tagline: string;
    email: string;
    /** Profiles such as GitHub, LinkedIn or Google Scholar. The site picks the icon from the URL. */
    links: { label: string; url: string }[];
  };
  work: Entry[];
  education: Entry[];
  stack: { label: string; items: string[] }[];
  research: Entry[];
  community: Entry[];
  projects: Entry[];
  /** The "playing / reading / drinking" lines on the contact section. */
  now: { label: string; text: string }[];
}
