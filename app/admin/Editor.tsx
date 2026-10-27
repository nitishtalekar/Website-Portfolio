"use client";

import { useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import type { ResumeData } from "@/content/types";
import Icon from "@/components/Icon";
import { blank, sections, type Field } from "@/lib/resume-schema";
import { logout, save } from "./actions";
import styles from "./admin.module.css";

type Data = Record<string, unknown>;
type ListField = Extract<Field, { kind: "list" }>;

/**
 * `_k` is a client-only identity for top-level entries, so an accordion stays open
 * while its entry is reordered or edited. The server's schema drops it on save.
 */
const KEY = "_k";

const text = (v: unknown) => (typeof v === "string" ? v : "");
const list = (v: unknown): Data[] => (Array.isArray(v) ? (v as Data[]) : []);
let added = 0;
/** Client-only, called from event handlers. Initial keys are positional (see withKeys) so server and client markup match. */
const newKey = () => `n${++added}`;

/** The stack has no dates, so new groups go last; entry lists are newest first, so new ones go on top. */
const addsToEnd = (key: string) => key === "stack";

/** Tag every top-level entry with a positional key, and open the first entry of each list so there is something to edit straight away. */
function load(initial: ResumeData) {
  const data: Data = { ...(initial as unknown as Data) };
  const open = new Set<string>();
  for (const s of sections) {
    if (s.kind !== "list") continue;
    data[s.key] = list(data[s.key]).map((item, i) => ({ ...item, [KEY]: `${s.key}-${i}` }));
    if (list(data[s.key]).length) open.add(`${s.key}-0`);
  }
  return { data, open, saved: JSON.stringify(data) };
}

export default function Editor({ initial, username }: { initial: ResumeData; username: string }) {
  const [start] = useState(() => load(initial));
  const [data, setData] = useState<Data>(start.data);
  const [saved, setSaved] = useState(start.saved);
  const [tab, setTab] = useState(sections[0].key);
  const [open, setOpen] = useState<Set<string>>(start.open);
  const focusKey = useRef<string | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startSave] = useTransition();

  const dirty = useMemo(() => JSON.stringify(data) !== saved, [data, saved]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // After adding an entry, put the cursor in its first field once it has rendered.
  useEffect(() => {
    if (!focusKey.current) return;
    const el = document.querySelector<HTMLElement>(`[data-k="${focusKey.current}"] input`);
    focusKey.current = null;
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [data]);

  const onSave = () =>
    startSave(async () => {
      const snapshot = JSON.stringify(data);
      const result = await save(data);
      setStatus(result);
      if (result.ok) setSaved(snapshot);
    });

  const setList = (key: string, next: Data[]) => setData((d) => ({ ...d, [key]: next }));

  const toggle = (k: string) =>
    setOpen((o) => {
      const next = new Set(o);
      if (!next.delete(k)) next.add(k);
      return next;
    });

  const move = (key: string, i: number, by: -1 | 1) => {
    const next = [...list(data[key])];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    setList(key, next);
  };

  const remove = (f: ListField, i: number) => {
    const name = text(list(data[f.key])[i]?.[f.itemTitle]) || `this ${f.itemNoun}`;
    if (window.confirm(`Remove "${name}"?`)) setList(f.key, list(data[f.key]).filter((_, j) => j !== i));
  };

  const add = (f: ListField) => {
    const items = list(data[f.key]);
    const fresh = { ...blank(f.fields), [KEY]: newKey() };
    setList(f.key, addsToEnd(f.key) ? [...items, fresh] : [fresh, ...items]);
    setOpen((o) => new Set(o).add(fresh[KEY]));
    focusKey.current = fresh[KEY];
  };

  const setAll = (f: ListField, expanded: boolean) =>
    setOpen((o) => {
      const next = new Set(o);
      for (const item of list(data[f.key])) expanded ? next.add(text(item[KEY])) : next.delete(text(item[KEY]));
      return next;
    });

  const active = sections.find((s) => s.key === tab)!;

  const onTabKey = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    const next = sections[(sections.findIndex((s) => s.key === tab) + step + sections.length) % sections.length].key;
    setTab(next);
    document.getElementById(`tab-${next}`)?.focus();
  };

  return (
    <div className={styles.editor}>
      <div className={styles.chrome}>
        <header className={styles.bar}>
          <div className={styles.heading}>
            <h1 className={styles.title}>Resume</h1>
            <p className={styles.meta}>Signed in as {username}</p>
          </div>
          <span className={styles.state} data-dirty={dirty || undefined} aria-live="polite">
            {dirty ? "Unsaved" : status?.ok ? "Saved" : ""}
          </span>
          <button type="button" className={styles.primary} onClick={onSave} disabled={pending || !dirty}>
            {pending ? "Saving…" : "Save"}
          </button>
          <form action={logout}>
            <button type="submit" className={styles.ghost}>
              Sign out
            </button>
          </form>
        </header>

        <div className={styles.tabs} role="tablist" aria-label="Resume sections" onKeyDown={onTabKey}>
          {sections.map((s) => (
            <button
              key={s.key}
              id={`tab-${s.key}`}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={s.key === tab}
              aria-controls="tab-panel"
              tabIndex={s.key === tab ? 0 : -1}
              onClick={() => setTab(s.key)}
            >
              {s.label}
              {s.kind === "list" && <span className={styles.tabCount}>{list(data[s.key]).length}</span>}
            </button>
          ))}
        </div>
      </div>

      {status && !status.ok && (
        <p role="alert" className={styles.error}>
          {status.message}
        </p>
      )}

      <div id="tab-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className={styles.board}>
        {active.kind === "object" ? (
          <section className={styles.pane}>
            <h2 className={styles.paneTitle}>{active.label}</h2>
            <div className={styles.formCard}>
              <Fields fields={active.fields} value={(data[active.key] as Data) ?? {}} onChange={(v) => setData((d) => ({ ...d, [active.key]: v }))} />
            </div>
          </section>
        ) : active.kind === "list" ? (
          <section className={styles.pane}>
            <header className={styles.paneHead}>
              <h2 className={styles.paneTitle}>{active.label}</h2>
              <div className={styles.paneTools}>
                {list(data[active.key]).length > 1 && (
                  <>
                    <button type="button" className={styles.link} onClick={() => setAll(active, true)}>
                      Expand all
                    </button>
                    <button type="button" className={styles.link} onClick={() => setAll(active, false)}>
                      Collapse all
                    </button>
                  </>
                )}
                <button type="button" className={styles.add} onClick={() => add(active)}>
                  + Add {active.itemNoun}
                </button>
              </div>
            </header>

            {list(data[active.key]).length === 0 ? (
              <div className={styles.empty}>
                <p>No {active.label.toLowerCase()} yet.</p>
              </div>
            ) : (
              <ul className={styles.accordion}>
                {list(data[active.key]).map((item, i, all) => {
                  const k = text(item[KEY]);
                  const isOpen = open.has(k);
                  const panel = `acc-${k}`;
                  const title = text(item[active.itemTitle]) || `New ${active.itemNoun}`;
                  const meta = [text(item.subtitle), text(item.when)].filter(Boolean).join(" · ") || (Array.isArray(item.items) ? `${item.items.filter(Boolean).length} skills` : "");
                  return (
                    <li key={k} className={styles.acc} data-k={k} data-open={isOpen || undefined}>
                      <h3>
                        <button type="button" className={styles.accHead} aria-expanded={isOpen} aria-controls={panel} onClick={() => toggle(k)}>
                          <span className={styles.accText}>
                            <span className={styles.accTitle}>{title}</span>
                            {meta && <span className={styles.accMeta}>{meta}</span>}
                          </span>
                          <span className={styles.chevron} aria-hidden="true" />
                        </button>
                      </h3>
                      {isOpen && (
                        <div id={panel} className={styles.accBody}>
                          <Fields
                            fields={active.fields}
                            value={item}
                            onChange={(v) => setList(active.key, list(data[active.key]).map((x, j) => (j === i ? v : x)))}
                          />
                          <div className={styles.accFoot}>
                            <button type="button" className={styles.ghost} disabled={i === 0} onClick={() => move(active.key, i, -1)}>
                              ↑ Move up
                            </button>
                            <button type="button" className={styles.ghost} disabled={i === all.length - 1} onClick={() => move(active.key, i, 1)}>
                              ↓ Move down
                            </button>
                            <button type="button" className={styles.danger} onClick={() => remove(active, i)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ) : null}
      </div>
    </div>
  );
}

/* ---------- Form ---------- */

function Fields({ fields, value, onChange }: { fields: Field[]; value: Data; onChange: (v: Data) => void }) {
  return (
    <>
      {fields.map((f) => (
        <FieldInput key={f.key} field={f} value={value?.[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
      ))}
    </>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const id = useId();
  const hint = "hint" in field && field.hint ? <small className={styles.hint}>{field.hint}</small> : null;
  const label = (
    <label htmlFor={id} className={styles.label}>
      {field.label}
      {field.optional && <em> optional</em>}
    </label>
  );

  switch (field.kind) {
    case "text":
      return (
        <div className={styles.field}>
          {label}
          {field.long ? (
            <textarea id={id} rows={3} value={text(value)} onChange={(e) => onChange(e.target.value)} />
          ) : (
            <input id={id} value={text(value)} onChange={(e) => onChange(e.target.value)} />
          )}
          {hint}
        </div>
      );

    case "icon":
      return (
        <div className={styles.field} role="radiogroup" aria-label={field.label}>
          <span className={styles.label}>
            {field.label}
            {field.optional && <em> optional</em>}
          </span>
          <div className={styles.iconPicks}>
            <button type="button" role="radio" aria-checked={!text(value)} className={styles.iconPick} data-on={!text(value) || undefined} onClick={() => onChange("")}>
              Automatic
            </button>
            {field.options.map((name) => (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={value === name}
                aria-label={name}
                title={name}
                className={styles.iconPick}
                data-on={value === name || undefined}
                onClick={() => onChange(name)}
              >
                <Icon name={name} size={22} />
              </button>
            ))}
          </div>
          {hint}
        </div>
      );

    case "strings": {
      const lines = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className={styles.field}>
          {label}
          <textarea id={id} rows={Math.min(Math.max(3, lines.length + 1), 12)} value={lines.join("\n")} onChange={(e) => onChange(e.target.value.split("\n"))} />
          <small className={styles.hint}>One per line.{field.hint ? ` ${field.hint}` : ""}</small>
        </div>
      );
    }

    case "object":
      return (
        <fieldset className={styles.group}>
          <legend>{field.label}</legend>
          <Fields fields={field.fields} value={(value as Data) ?? {}} onChange={onChange} />
        </fieldset>
      );

    case "list":
      return <Rows field={field} items={list(value)} onChange={onChange} />;
  }
}

/** A small list inside an entry (highlights, details, links): every row is editable in place, no expanding. */
function Rows({ field, items, onChange }: { field: ListField; items: Data[]; onChange: (v: Data[]) => void }) {
  return (
    <fieldset className={styles.group}>
      <legend>
        {field.label}
        {field.optional && <em> optional</em>}
      </legend>

      {items.map((item, i) => (
        // Index keys are deliberate: rows have no identity, and each input is controlled.
        <div key={i} className={styles.row}>
          <div className={styles.rowFields}>
            {field.fields.map((f) => (
              <label key={f.key} className={styles.mini}>
                <span>{f.label}</span>
                <input
                  value={text(item[f.key])}
                  onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, [f.key]: e.target.value } : x)))}
                />
              </label>
            ))}
          </div>
          <button type="button" className={styles.icon} aria-label={`Remove ${field.itemNoun} ${i + 1}`} onClick={() => onChange(items.filter((_, j) => j !== i))}>
            ✕
          </button>
        </div>
      ))}

      <button type="button" className={styles.add} onClick={() => onChange([...items, blank(field.fields)])}>
        + Add {field.itemNoun}
      </button>
    </fieldset>
  );
}
