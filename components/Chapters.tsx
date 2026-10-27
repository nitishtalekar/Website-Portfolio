"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import Logo from "./Logo";
import styles from "./Chapters.module.css";

interface Chapter {
  id: string;
  label: string;
  icon: string;
}

/**
 * Navigation and scroll awareness for the whole page, with no sidebar:
 * a quiet top bar (monogram + current chapter), a strip of ticks along the
 * bottom edge (one per chapter, like pages in a book or checkpoints in a
 * level), a full-screen index, and the observers that tell
 * sections when to play their entrance.
 */
export default function Chapters({ chapters }: { chapters: readonly Chapter[] }) {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const menuRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);

    // Current chapter = whichever one crosses the middle of the viewport.
    const current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = sections.indexOf(entry.target as HTMLElement);
          activeRef.current = i;
          setActive(i);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    // Entrance: play once, as a chapter's top edge approaches.
    const arriving = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.seen = "";
          arriving.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );

    for (const s of sections) {
      current.observe(s);
      arriving.observe(s);
    }
    return () => {
      current.disconnect();
      arriving.disconnect();
    };
  }, [chapters]);

  const closeMenu = () => menuRef.current?.close();

  return (
    <>
      <header className={styles.bar}>
        <a href="#intro" className={styles.monogram} aria-label="Back to the start">
          <Logo />
        </a>
        <button type="button" className={styles.menuButton} onClick={() => menuRef.current?.showModal()}>
          <span className={styles.here}>
            <Icon name={chapters[active].icon} size={18} />
          </span>
          <span>{chapters[active].label}</span>
          <span className={styles.burger} aria-hidden="true" />
        </button>
      </header>

      <nav className={styles.ticks} aria-label="Chapters">
        <ol>
          {chapters.map((c, i) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                className={styles.tick}
                data-label={c.label}
                data-state={i < active ? "past" : i === active ? "current" : "next"}
                aria-label={c.label}
                aria-current={i === active ? "location" : undefined}
              >
                <Icon name={c.icon} size={18} />
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <dialog
        ref={menuRef}
        className={styles.menu}
        aria-label="Chapter index"
        onClick={(e) => e.target === menuRef.current && closeMenu()}
      >
        <div className={styles.menuInner}>
          <button type="button" className={styles.close} onClick={closeMenu} aria-label="Close chapter index">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M5 5l14 14M19 5 5 19" />
            </svg>
          </button>
          <ol className={styles.menuList}>
            {chapters.map((c, i) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  onClick={closeMenu}
                  className={styles.menuLink}
                  aria-current={i === active ? "location" : undefined}
                >
                  <span className={styles.menuIcon}>
                    <Icon name={c.icon} size={28} />
                  </span>
                  {c.label}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </dialog>
    </>
  );
}
