"use client";

import { useId, useState } from "react";
import type { Row } from "@/content/types";
import Collapse from "./Collapse";
import Icon from "./Icon";
import { PROJECT_ICONS } from "@/lib/resume-schema";
import { PageStack, usePaged } from "./Paged";
import PlusMark from "./PlusMark";
import RowBody, { hasBody } from "./RowBody";
import styles from "./Cards.module.css";


/** A grid of cartridges: title up top, category below, repo/live icons bottom right. Opening one grows only that card. */
export default function Cards({ items }: { items: Row[] }) {
  const { page } = usePaged();
  const [open, setOpen] = useState<{ page: number; ids: string[] }>({ page, ids: [] });
  const openIds = open.page === page ? open.ids : []; // switching pages closes everything
  const uid = useId();

  /**
   * Cards in the same row open side by side; opening one in another row closes the rest.
   * Rows depend on how many columns fit, so "same row" is read from where the cards sit.
   */
  const toggle = (id: string, button: HTMLElement) => {
    if (openIds.includes(id)) {
      setOpen({ page, ids: openIds.filter((x) => x !== id) });
      return;
    }
    const grid = button.closest("ul");
    const top = button.closest("li")?.offsetTop;
    const sameRow = openIds.filter((x) => {
      const el = grid?.querySelector<HTMLElement>(`[data-card="${CSS.escape(x)}"]`);
      return el && el.offsetTop === top;
    });
    setOpen({ page, ids: [...sameRow, id] });
  };

  return (
    <PageStack
      items={items}
      render={(slice) => (
        <ul className={styles.grid}>
          {slice.map((r) => {
            // The icon picked in the admin, else one handed out in turn.
            const glyph = r.icon && (PROJECT_ICONS as readonly string[]).includes(r.icon) ? r.icon : PROJECT_ICONS[items.indexOf(r) % PROJECT_ICONS.length];
            const isOpen = openIds.includes(r.id);
            const panelId = `${uid}-${r.id}`;
            const body = hasBody(r);
            const head = (
              <>
                <span className={styles.top}>
                  <span className={styles.heading}>
                    <span className={styles.glyph}>
                      <Icon name={glyph} size={20} />
                    </span>
                    <span className={styles.title}>{r.title}</span>
                  </span>
                  {body ? <PlusMark open={isOpen} /> : null}
                </span>
                <span className={styles.category}>{r.subtitle}</span>
              </>
            );
            const hasLinks = Boolean(r.github || r.website);
            return (
              <li key={r.id} className={styles.card} data-card={r.id} data-open={isOpen}>
                <div className={styles.headWrap}>
                  {body ? (
                    <button
                      type="button"
                      className={styles.head}
                      data-links={hasLinks}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={(e) => toggle(r.id, e.currentTarget)}
                    >
                      {head}
                    </button>
                  ) : (
                    <div className={styles.head} data-links={hasLinks}>
                      {head}
                    </div>
                  )}
                  {hasLinks ? (
                    <span className={styles.actions}>
                      {r.github ? (
                        <a className={styles.action} href={r.github} target="_blank" rel="noopener noreferrer" aria-label={`${r.title} on GitHub`} title="GitHub">
                          <Icon name="github" size={18} />
                        </a>
                      ) : null}
                      {r.website ? (
                        <a className={styles.action} href={r.website} target="_blank" rel="noopener noreferrer" aria-label={`Open ${r.title}`} title="Live project">
                          <Icon name="external" size={18} />
                        </a>
                      ) : null}
                    </span>
                  ) : null}
                </div>
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
