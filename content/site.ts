/**
 * Everything about the website that is not resume data: navigation, section
 * headings, icons, page sizes and UI copy. content/compose.ts merges this with
 * the resume document. Change the site here; change the resume at /admin.
 */
export const site = {
  /** Nav order. `id` must match a section id rendered in app/page.tsx. `icon` is a name from components/Icon.tsx. */
  chapters: [
    { id: "intro", label: "Hello", icon: "togocode" },
    { id: "background", label: "Background", icon: "sword" },
    { id: "projects", label: "Projects", icon: "console" },
    { id: "research", label: "Research", icon: "openbook" },
    { id: "artwork", label: "Artwork", icon: "pencil" },
    { id: "studio", label: "Studio", icon: "mug" },
    { id: "contact", label: "Contact", icon: "bean" },
  ],

  /** The joint studio with a friend. Logo lives at public/coffeecoders_logo.png. */
  studio: {
    title: "Studio",
    sub: ["Co-op mode, with a business card.", "A second pot, brewed with a friend."],
    name: "CoffeeCoders",
    tagline: "The place where Caffeine creates Code.",
    about:
      "Two friends, one pot of coffee, and a shared itch to build. We write code for fun, and to solve the problems we want solved.",
    url: "https://coffeecoders.cc/",
    logo: "/coffeecoders_logo.png",
    people: ["Nitish Talekar", "Sarvesh Wanode"],
    cta: "Visit coffeecoders.cc",
  },

  /** Shown under the hero tagline. */
  aside: "Fueled by coffee, good books, and one more level.",

  /** Headings per section. `sub` lists the wordings; the page shows one at random per load. `pageSize` paginates once a list has more entries than that. */
  sections: {
    work: { title: "Work", sub: ["The quest log.", "The order history."], pageSize: 3 },
    projects: { title: "Projects", sub: ["Built for fun, shipped anyway.", "Brewed for fun, served anyway."], pageSize: 4 },
    research: { title: "Research", sub: ["Questions I got to chase, in print.", "Questions I got to steep, in print."], pageSize: 4, mobilePageSize: 2 },
    stack: { title: "Stack", sub: ["My loadout.", "The house blend."] },
    education: { title: "Education", sub: ["Where I levelled up.", "Where I got my roast level up."] },
    artwork: { title: "Artwork", sub: ["Pixels, pencils and detours.", "The sketchbook, unlocked."], pageSize: 4, mobilePageSize: 2 },
    community: { title: "Community", sub: ["Co-op mode.", "Best shared over a pot."] },
  },

  /** Shown on a research entry that has no links yet. */
  paperPending: "Paper link on its way",
  paperLink: "Read the paper",

  scholar: { label: "Google Scholar", pending: "Google Scholar, soon" },

  contact: {
    title: "Say hello",
    sub: ["Press start.", "First round's on me."],
    copied: "Copied. Go refill your coffee.",
    now: [
      { label: "Playing", text: "A backlog that never shrinks" },
      { label: "Reading", text: "Three books, none finished" },
      { label: "Drinking", text: "Coffee, obviously" },
    ],
  },
};
