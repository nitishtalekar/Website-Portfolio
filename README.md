# Nitish Talekar: portfolio

A single-page, section-snapping portfolio. Next.js App Router, CSS Modules, no Tailwind.

```bash
npm run dev     # http://localhost:3000
npm run build   # fully static output
```

## Everything lives in `content/resume.json`

The site renders that one file and nothing else. It holds the content exactly as it is displayed: dates are already formatted strings, lists are in display order, and nothing is sorted, counted or derived in code.

| To change...                    | Edit in `resume.json`                         |
| ------------------------------- | --------------------------------------------- |
| Name, tagline, links, email     | `profile`                                     |
| Nav order, labels, symbols      | `chapters` (`icon` is a name from `components/Icon.tsx`) |
| A job / project / paper / degree| the `items` array of `work`, `projects`, `research`, `education`, `community` |
| How many show per page          | `pageSize` on `work`, `projects`, `research`  |
| Skills                          | `stack.groups`                                |
| Scholar link                    | `research.scholar.url` (empty shows a placeholder) |
| The "right now" strip           | `contact.now`                                 |
| Section titles and one-liners   | each section's `title` and `sub`              |

Field reference: `content/types.ts`.

Each entry is the same shape (`Row`): `title`, optional `subtitle`, `when`, `summary`, `points`, `highlights`, `details`, `tags`, `links`. Only the title line shows by default; everything else opens on click.

### Growing and older entries

There is no separate archive: older entries just sit further down their list. Once a section has more entries than its `pageSize`, a pager (arrows and one dot per page) appears at the right of its title, so it never moves when pages have different numbers of entries. Put the newest first.

### One form per chapter

Each chapter presents the same entries differently, drawn from the same tokens: Work is a list, Projects are cards, Research is a stack of books, Stack is an inventory, Education is a path, Community is a statement. Swapping a section's component in `app/page.tsx` is all it takes to change its form.

## How the scrolling works

`html` uses `scroll-snap-type: y mandatory`; every chapter is a `min-height: 100dvh` section with `scroll-snap-align: start` and `scroll-snap-stop: always`. A chapter that outgrows the viewport (a row opened on a short screen, a long list) simply gets taller, and browsers let you scroll freely inside it before snapping onward, so there is no nested scroller.

Navigation: a top bar (monogram, current chapter symbol, opens a full-screen index), a strip of symbols along the bottom edge (coffee, games, books). `components/Chapters.tsx` owns all of it, plus the observers that trigger entrances.
