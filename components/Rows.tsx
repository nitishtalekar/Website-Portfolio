"use client";

import { useId, useState } from "react";
import type { Row } from "@/content/types";
import Collapse from "./Collapse";
import Pager, { usePager } from "./Pager";
import PlusMark from "./PlusMark";
import RowBody, { hasBody } from "./RowBody";
import styles from "./Rows.module.css";

/**
 * The list: one quiet line per entry (date, title, role). A click opens the
 * rest, one at a time. Used for Work, and paginated once it grows.
 */
export default function Rows({ items, pageSize }: { items: Row[]; pageSize?: number }) {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();
  const { page, setPage, pages, slice } = usePager(items, pageSize);

  const toggle = (id: string, isOpen: boolean, button: HTMLElement) => {
    setOpen(isOpen ? null : id);
    if (isOpen) return;
    // Once the row has finished opening, make sure all of it is on screen.
    window.setTimeout(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      button.closest("li")?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
    }, 360);
  };

  return (
    <div>
      <ul className={styles.list}>
        {slice.map((r) => {
          const isOpen = open === r.id;
          const panelId = `${uid}-${r.id}`;
          const body = hasBody(r);
          const head = (
            <>
              <span className={styles.when}>{r.when}</span>
              <span className={styles.title}>{r.title}</span>
              <span className={styles.subtitle}>{r.subtitle}</span>
              {body ? <PlusMark open={isOpen} /> : <span />}
            </>
          );
          return (
            <li key={r.id} className={styles.row} data-open={isOpen}>
              {body ? (
                <button
                  type="button"
                  className={styles.head}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={(e) => toggle(r.id, isOpen, e.currentTarget)}
                >
                  {head}
                </button>
              ) : (
                <div className={styles.head}>{head}</div>
              )}
              {body ? (
                <Collapse id={panelId} open={isOpen}>
                  <div className={styles.indent}>
                    <RowBody row={r} />
                  </div>
                </Collapse>
              ) : null}
            </li>
          );
        })}
      </ul>
      <Pager
        page={page}
        pages={pages}
        onChange={(p) => {
          setOpen(null);
          setPage(p);
        }}
      />
    </div>
  );
}
