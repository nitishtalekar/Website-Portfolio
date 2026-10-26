"use client";

import { useId, useState } from "react";
import type { Row } from "@/content/types";
import Collapse from "./Collapse";
import Pager, { usePager } from "./Pager";
import PlusMark from "./PlusMark";
import RowBody, { hasBody } from "./RowBody";
import styles from "./Shelf.module.css";

/** A stack of books: each paper is a spine, slightly out of line, like a pile on a desk. */
export default function Shelf({ items, pageSize }: { items: Row[]; pageSize?: number }) {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();
  const { page, setPage, pages, slice } = usePager(items, pageSize);

  return (
    <div>
      <ul className={styles.stack}>
        {slice.map((r) => {
          const isOpen = open === r.id;
          const panelId = `${uid}-${r.id}`;
          const body = hasBody(r);
          return (
            <li key={r.id} className={styles.book} data-open={isOpen}>
              <button
                type="button"
                className={styles.spine}
                aria-expanded={isOpen}
                aria-controls={panelId}
                disabled={!body}
                onClick={() => setOpen(isOpen ? null : r.id)}
              >
                <span className={styles.year}>{r.when}</span>
                <span className={styles.title}>{r.title}</span>
                {body ? <PlusMark open={isOpen} /> : null}
              </button>
              <p className={styles.venue}>{r.subtitle}</p>
              {body ? (
                <Collapse id={panelId} open={isOpen}>
                  <div className={styles.inside}>
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
