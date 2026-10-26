"use client";

import { useId, useState } from "react";
import type { Row } from "@/content/types";
import Collapse from "./Collapse";
import PlusMark from "./PlusMark";
import RowBody, { hasBody } from "./RowBody";
import styles from "./Timeline.module.css";

/** A path of checkpoints, like a level map: dates on the left, the route in the middle, the stop on the right. */
export default function Timeline({ items }: { items: Row[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();

  return (
    <ol className={styles.path}>
      {items.map((r) => {
        const isOpen = open === r.id;
        const panelId = `${uid}-${r.id}`;
        const body = hasBody(r);
        const head = (
          <>
            <span className={styles.title}>{r.title}</span>
            <span className={styles.subtitle}>{r.subtitle}</span>
          </>
        );
        return (
          <li key={r.id} className={styles.stop} data-open={isOpen}>
            <span className={styles.when}>{r.when}</span>
            <span className={styles.rail} aria-hidden="true">
              <span className={styles.node} />
            </span>
            <div className={styles.main}>
              {body ? (
                <button
                  type="button"
                  className={styles.head}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : r.id)}
                >
                  {head}
                  <PlusMark open={isOpen} />
                </button>
              ) : (
                <div className={styles.head}>{head}</div>
              )}
              {body ? (
                <Collapse id={panelId} open={isOpen}>
                  <RowBody row={r} />
                </Collapse>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
