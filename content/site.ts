/**
 * Everything about the website that is not resume data: navigation, section
 * headings, icons, page sizes and UI copy. content/compose.ts merges this with
 * the resume document. Change the site here; change the resume at /admin.
 */
export const site = {
  /** Nav order. `id` must match a section id rendered in app/page.tsx. `icon` is a name from components/Icon.tsx. */
  chapters: [
    { id: "intro", label: "Hello", icon: "cup" },
    { id: "background", label: "Background", icon: "sword" },
    { id: "projects", label: "Projects", icon: "gamepad" },
    { id: "contact", label: "Contact", icon: "bean" },
  ],

  /** Shown under the hero tagline. */
  aside: "Plays games. Reads books. Runs on coffee.",

  /** Headings per section. `pageSize` paginates once a list has more entries than that. */
  sections: {
    work: { title: "Work", sub: "Newest first. Open a role for the details.", pageSize: 3 },
    projects: { title: "Projects", sub: "Side quests, cleared.", pageSize: 4 },
    research: { title: "Research", sub: "Papers, with links as they land.", pageSize: 4 },
    stack: { title: "Stack", sub: "My loadout." },
    education: { title: "Education", sub: "Two degrees, one long reading list." },
    community: { title: "Community", sub: "Multiplayer mode." },
  },

  /** Shown on a research entry that has no links yet. */
  paperPending: "Paper link on its way",

  scholar: { label: "Google Scholar", pending: "Google Scholar, soon" },

  contact: {
    title: "Say hello",
    sub: "Replies faster than coffee cools.",
    hint: "Click to copy.",
    copied: "Copied. Go refill your coffee.",
    mail: "Or open your mail app.",
    now: [
      { label: "Playing", text: "A backlog that never shrinks" },
      { label: "Reading", text: "Three books, none finished" },
      { label: "Drinking", text: "Coffee, obviously" },
    ],
  },
};
