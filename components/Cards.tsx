"use client";

import { useId, useState } from "react";
import type { Row } from "@/content/types";
import Collapse from "./Collapse";
import { PageStack, usePaged } from "./Paged";
import PlusMark from "./PlusMark";
import RowBody, { hasBody } from "./RowBody";
import styles from "./Cards.module.css";

/** A grid of cartridges: category up top, title below. Opening one grows only that card. */
export default function Cards({ items }: { items: Row[] }) {
  const { page } = usePaged();
  const [open, setOpen] = useState<{ page: number; id: string } | null>(null);
  const openId = open && open.page === page ? open.id : null;
  const uid = useId();

  return (
    <PageStack
      items={items}
      render={(slice) => (
        <ul className={styles.grid}>
          {slice.map((r) => {
            const isOpen = openId === r.id;
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
                    onClick={() => setOpen(isOpen ? null : { page, id: r.id })}
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
      )}
    />
  );
}
