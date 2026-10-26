"use client";

import { useId, useState } from "react";
import type { Row } from "@/content/types";
import Collapse from "./Collapse";
import Pager, { usePager } from "./Pager";
import PlusMark from "./PlusMark";
import RowBody, { hasBody } from "./RowBody";
import styles from "./Cards.module.css";

/** A grid of cartridges: category up top, title below. Opening one grows only that card. */
export default function Cards({ items, pageSize }: { items: Row[]; pageSize?: number }) {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();
  const { page, setPage, pages, slice } = usePager(items, pageSize);

  return (
    <div>
      <ul className={styles.grid}>
        {slice.map((r) => {
          const isOpen = open === r.id;
          const panelId = `${uid}-${r.id}`;
          const body = hasBody(r);
          const head = (
            <>
              <span className={styles.top}>
                <span className={styles.category}>{r.subtitle}</span>
                {body ? <PlusMark open={isOpen} /> : null}
              </span>
              <span className={styles.title}>{r.title}</span>
            </>
          );
          return (
            <li key={r.id} className={styles.card} data-open={isOpen}>
              {body ? (
                <button
                  type="button"
                  className={styles.head}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : r.id)}
                >
                  {head}
                </button>
              ) : (
                <div className={styles.head}>{head}</div>
              )}
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
