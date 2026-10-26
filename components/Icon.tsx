/**
 * The site's small symbol set: coffee, games, books. One stroke weight, one
 * grid, so they sit together. A chapter picks one by name in resume.json.
 */
const PATHS: Record<string, string> = {
  cup: "M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z M16 10h1.5a2.5 2.5 0 0 1 0 5H16 M8.5 3.5c-.8 1 .8 1.5 0 2.5 M12.5 3.5c-.8 1 .8 1.5 0 2.5",
  sword: "M14.5 17.5 3 6V3h3l11.5 11.5 M13 19l6-6 M16 16l4 4 M19 21l2-2",
  gamepad:
    "M7 8h10a4 4 0 0 1 4 4v1.5a3 3 0 0 1-5.2 2L14.5 14h-5l-1.3 1.5A3 3 0 0 1 3 13.5V12a4 4 0 0 1 4-4z M8 10.5v3 M6.5 12h3 M16 11.5h.01 M18 13h.01",
  book: "M4 5.5A1.5 1.5 0 0 1 5.5 4H12v15H5.5A1.5 1.5 0 0 0 4 20.5v-15z M20 5.5A1.5 1.5 0 0 0 18.5 4H12v15h6.5a1.5 1.5 0 0 1 1.5 1.5v-15z",
  dice: "M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M8.5 8.5h.01 M15.5 8.5h.01 M12 12h.01 M8.5 15.5h.01 M15.5 15.5h.01",
  glasses: "M3 13a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z M14 13a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z M10 13c.6-.8 3.4-.8 4 0 M3 13 4 8 M21 13 20 8",
  heart: "M6 5h4v2h4V5h4v2h2v4h-2v2h-2v2h-2v2h-4v-2H8v-2H6v-2H4V7h2V5z",
  bean: "M12 3.5c4.2 0 7 3.6 7 8.5s-3.2 8.5-7 8.5-7-3.6-7-8.5S7.8 3.5 12 3.5z M12 3.8c-2 3 2.5 5.5 0 8.2s2 5 0 8.4",
};

export default function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
