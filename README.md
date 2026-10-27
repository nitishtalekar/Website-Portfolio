# Nitish Talekar: portfolio

A single-page, section-snapping portfolio. Next.js App Router, CSS Modules, no Tailwind.

```bash
npm run dev     # http://localhost:3000
npm run build   # fully static output
```

## Resume data vs. website

Two separate places, on purpose:

- **Resume data** (`content/resume.json`, stored in Backbone and edited at `/admin`) holds only facts: profile, work, projects, research, education, stack, community. Dates are display strings, lists are in display order (newest first). No headings, icons, nav labels or page sizes. Types: `ResumeData` in `content/types.ts`.
- **Website structure** lives in code. `content/site.ts` has the nav chapters, section titles and subtitles, page sizes, contact copy and other UI text. `content/compose.ts` merges the two (and picks profile-link icons from their URLs) into what the components render.

| To change...                         | Where                                              |
| ------------------------------------ | -------------------------------------------------- |
| A job, project, paper, degree, skill | `/admin` (or `content/resume.json` + `npm run push:resume`) |
| Nav order, labels, symbols           | `chapters` in `content/site.ts`                    |
| Section titles, one-liners, page size| `sections` in `content/site.ts`                    |
| Contact / hero copy                  | `contact`, `aside` in `content/site.ts`            |

`content/resume.json` is the seed and the fallback if Backbone is unreachable. `npm run push:resume` overwrites the Backbone copy with it.

Each entry has the same shape (`Entry`): `title`, optional `subtitle`, `when`, `summary`, `points`, `highlights`, `details`, `tags`, `links`. Only the title line shows by default; everything else opens on click. A research entry with no links shows the "paper pending" note from `site.ts`.

### Admin

`/admin` is restricted to the Backbone user `swatkat`. It shows every section at once as cards; click a card to edit it in a side panel, use the arrows to reorder, and Save to publish.

### Growing and older entries

Older entries just sit further down their list. Once a section has more entries than its `pageSize` (in `site.ts`), a pager appears at the right of its title. Put the newest first.

### One form per chapter

Each chapter presents the same entries differently: Work is a list, Projects are cards, Research is a stack of books, Stack is an inventory, Education is a path, Community is a statement. Swapping a section's component in `app/page.tsx` is all it takes to change its form.

## How the scrolling works

`html` uses `scroll-snap-type: y mandatory`; every chapter is a `min-height: 100dvh` section with `scroll-snap-align: start` and `scroll-snap-stop: always`. A chapter that outgrows the viewport (a row opened on a short screen, a long list) simply gets taller, and browsers let you scroll freely inside it before snapping onward, so there is no nested scroller.

Navigation: a top bar (monogram, current chapter symbol, opens a full-screen index), a strip of symbols along the bottom edge (coffee, games, books). `components/Chapters.tsx` owns all of it, plus the observers that trigger entrances.
