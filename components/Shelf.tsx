"use client";

import { useId, useState } from "react";
import type { Row } from "@/content/types";
import Collapse from "./Collapse";
import { PageStack, usePaged } from "./Paged";
import PlusMark from "./PlusMark";
import RowBody, { hasBody } from "./RowBody";
import styles from "./Shelf.module.css";

/** A stack of books: each paper is a spine on the same shelf line. */
export default function Shelf({ items }: { items: Row[] }) {
  const { page } = usePaged();
  const [open, setOpen] = useState<{ page: number; id: string } | null>(null);
  const openId = open && open.page === page ? open.id : null;
  const uid = useId();

  return (
    <PageStack
      items={items}
      render={(slice) => (
        <ul className={styles.stack}>
          {slice.map((r) => {
            const isOpen = openId === r.id;
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
                  onClick={() => setOpen(isOpen ? null : { page, id: r.id })}
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
      )}
    />
  );
}
