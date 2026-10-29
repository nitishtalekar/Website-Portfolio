/**
 * Field-level description of ResumeData (content/types.ts). The /admin editor
 * renders its form from this, and the save action uses the same description to
 * validate and tidy whatever the browser sends, so the two can't drift apart.
 * Only resume facts appear here; site copy lives in content/site.ts.
 */
export type Field =
  | { kind: "text"; key: string; label: string; optional?: boolean; required?: boolean; hint?: string; long?: boolean }
  | { kind: "icon"; key: string; label: string; options: readonly string[]; optional?: boolean; hint?: string }
  | { kind: "strings"; key: string; label: string; optional?: boolean; hint?: string; long?: boolean }
  | { kind: "object"; key: string; label: string; fields: Field[]; optional?: boolean }
  | { kind: "list"; key: string; label: string; fields: Field[]; optional?: boolean; itemTitle: string; itemNoun: string };

/** Card art a project can wear, by name from components/Icon.tsx. Order here is the order shown in the editor and the automatic rotation. */
export const PROJECT_ICONS = ["togo", "joystick", "closedbook", "graph"] as const;

const title: Field = { kind: "text", key: "title", label: "Title" };
const subtitle: Field = { kind: "text", key: "subtitle", label: "Subtitle", optional: true, hint: "Role, degree, venue, category…" };
const when: Field = { kind: "text", key: "when", label: "When", optional: true, hint: "Shown as written, e.g. Jan 2024 – Present" };
const summary: Field = { kind: "text", key: "summary", label: "Summary", optional: true, long: true };
const points: Field = { kind: "strings", key: "points", label: "Points", optional: true, long: true };
const tags: Field = { kind: "strings", key: "tags", label: "Tags", optional: true };
const highlights: Field = {
  kind: "list",
  key: "highlights",
  label: "Highlights",
  optional: true,
  itemNoun: "highlight",
  itemTitle: "label",
  fields: [
    { kind: "text", key: "value", label: "Value", hint: "e.g. 200+" },
    { kind: "text", key: "label", label: "Label", hint: "e.g. students" },
  ],
};
const details: Field = {
  kind: "list",
  key: "details",
  label: "Details",
  optional: true,
  itemNoun: "detail",
  itemTitle: "label",
  fields: [
    { kind: "text", key: "label", label: "Label", hint: "e.g. GPA" },
    { kind: "text", key: "value", label: "Value" },
  ],
};

const entries = (key: string, label: string, itemNoun: string, fields: Field[]): Field => ({
  kind: "list",
  key,
  label,
  itemNoun,
  itemTitle: "title",
  fields,
});

/** Projects can point at their repository and a live deployment; each icon only shows when its link is set. */
const projectLinks: Field[] = [
  { kind: "icon", key: "icon", label: "Card icon", options: PROJECT_ICONS, optional: true, hint: "Leave on Automatic to rotate through them." },
  { kind: "text", key: "github", label: "GitHub link", optional: true, hint: "Repository URL. Leave empty to hide the icon." },
  { kind: "text", key: "website", label: "Website link", optional: true, hint: "Where it is live. Leave empty to hide the icon." },
];

/** One field per top-level key of ResumeData, in the order the editor shows them. */
export const sections: Field[] = [
  {
    kind: "object",
    key: "profile",
    label: "Profile",
    fields: [
      { kind: "text", key: "firstName", label: "First name" },
      { kind: "text", key: "lastName", label: "Last name" },
      { kind: "text", key: "role", label: "Role" },
      { kind: "text", key: "org", label: "Organisation" },
      { kind: "text", key: "tagline", label: "Tagline" },
      { kind: "text", key: "email", label: "Email" },
      {
        kind: "list",
        key: "links",
        label: "Profile links",
        itemNoun: "link",
        itemTitle: "label",
        fields: [
          { kind: "text", key: "label", label: "Label", hint: "e.g. GitHub, LinkedIn, Google Scholar" },
          { kind: "text", key: "url", label: "URL", hint: "The site picks the icon from the address" },
        ],
      },
    ],
  },
  entries("work", "Work", "job", [title, subtitle, when, summary, points, highlights, tags]),
  entries("projects", "Projects", "project", [title, subtitle, when, summary, highlights, details, tags, ...projectLinks]),
  entries("research", "Research", "paper", [
    title,
    subtitle,
    when,
    { kind: "text", key: "url", label: "Paper link", optional: true, hint: "One link to the paper itself. Leave empty if it is not out yet." },
  ]),
  entries("education", "Education", "degree", [title, subtitle, when, details]),
  {
    kind: "list",
    key: "stack",
    label: "Stack",
    itemNoun: "group",
    itemTitle: "label",
    fields: [
      { kind: "text", key: "label", label: "Group name" },
      { kind: "strings", key: "items", label: "Skills" },
    ],
  },
  entries("community", "Community", "entry", [title, subtitle, when, summary, details]),
  {
    kind: "object",
    key: "artwork",
    label: "Artwork",
    optional: true,
    fields: [
      {
        kind: "text",
        key: "folder",
        label: "Google Drive folder",
        optional: true,
        hint: "Paste the folder link. It must be shared as Anyone with the link → Viewer. Every PNG in it appears on the site.",
      },
    ],
  },
  {
    kind: "list",
    key: "now",
    label: "Contact",
    itemNoun: "line",
    itemTitle: "label",
    fields: [
      { kind: "text", key: "label", label: "Label", hint: "e.g. Playing, Reading, Drinking" },
      { kind: "text", key: "text", label: "Answer" },
    ],
  },
];

/** A blank value for a list item, used when adding one. */
export function blank(fields: Field[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.optional) continue;
    out[f.key] = f.kind === "strings" || f.kind === "list" ? [] : f.kind === "object" ? blank(f.fields) : "";
  }
  return out;
}

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function cleanFields(input: unknown, fields: Field[], path: string): Result<Record<string, unknown>> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return { ok: false, error: `${path} must be an object` };
  const src = input as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  for (const f of fields) {
    const where = `${path}.${f.key}`;
    const v = src[f.key];
    const empty = v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

    if (empty) {
      if (f.optional) continue;
      if (f.kind === "strings" || f.kind === "list") out[f.key] = [];
      else if (f.kind === "text" && f.required) return { ok: false, error: `${where} is required` };
      else if (f.kind === "text") out[f.key] = "";
      else return { ok: false, error: `${where} is required` };
      continue;
    }

    switch (f.kind) {
      case "text":
        if (typeof v !== "string") return { ok: false, error: `${where} must be text` };
        out[f.key] = v.trim();
        break;
      case "icon":
        if (typeof v !== "string" || !f.options.includes(v)) return { ok: false, error: `${where} must be one of ${f.options.join(", ")}` };
        out[f.key] = v;
        break;
      case "strings":
        if (!Array.isArray(v) || v.some((s) => typeof s !== "string")) return { ok: false, error: `${where} must be a list of text` };
        out[f.key] = (v as string[]).map((s) => s.trim()).filter(Boolean);
        break;
      case "object": {
        const r = cleanFields(v, f.fields, where);
        if (!r.ok) return r;
        out[f.key] = r.value;
        break;
      }
      case "list": {
        if (!Array.isArray(v)) return { ok: false, error: `${where} must be a list` };
        const items: Record<string, unknown>[] = [];
        for (let i = 0; i < v.length; i++) {
          const r = cleanFields(v[i], f.fields, `${where}[${i}]`);
          if (!r.ok) return r;
          if (!r.value[f.itemTitle]) return { ok: false, error: `${f.label}: every ${f.itemNoun} needs a ${f.itemTitle} (#${i + 1})` };
          items.push(r.value);
        }
        out[f.key] = items;
        break;
      }
    }
  }
  return { ok: true, value: out };
}

/**
 * Validate and tidy a resume submitted by the editor: unknown keys are dropped,
 * text is trimmed, empty optional fields are omitted, and every list entry needs
 * its title. Returns the first problem it finds, with a path so the admin can locate it.
 */
export function cleanResume(input: unknown): Result<Record<string, unknown>> {
  return cleanFields(input, sections, "resume");
}
