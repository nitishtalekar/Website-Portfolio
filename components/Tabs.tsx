"use client";

import { useRef, useState } from "react";
import Icon from "./Icon";
import styles from "./Tabs.module.css";

interface Tab {
  id: string;
  label: string;
  icon: string;
  panel: React.ReactNode;
}

/**
 * One chapter, several panels. Every panel is drawn in the same grid cell and
 * only one is shown, so the chapter is as tall as its tallest panel and
 * switching tabs never shifts the page.
 */
export default function Tabs({ tabs, label }: { tabs: Tab[]; label: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight") select(i + 1);
    else if (e.key === "ArrowLeft") select(i - 1);
    else if (e.key === "Home") select(0);
    else if (e.key === "End") select(tabs.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <>
      <div role="tablist" aria-label={label} className={styles.list}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <Icon name={t.icon} size={18} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      <div className={styles.stack}>
        {tabs.map((t, i) => (
          <div
            key={t.id}
            role="tabpanel"
            id={`panel-${t.id}`}
            aria-labelledby={`tab-${t.id}`}
            className={styles.panel}
            data-active={i === active}
            inert={i !== active}
          >
            {t.panel}
          </div>
        ))}
      </div>
    </>
  );
}
