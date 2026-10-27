"use client";

import { useEffect, useState } from "react";
import styles from "./Hero.module.css";

const START_DELAY = 800;
const PER_LETTER = 160;

/**
 * Types the name out letter by letter. The cursor sits after the last typed
 * letter, takes up no width so nothing shifts, and becomes a full stop when
 * the last letter lands. The real name is read from the sr-only text in the h1.
 */
export default function TypedName({ words }: { words: string[] }) {
  const letters = words.map((w) => [...w]);
  const total = letters.reduce((sum, w) => sum + w.length, 0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(total);
      return;
    }
    let id: number;
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        setTyped((n) => {
          if (n + 1 >= total) window.clearInterval(id);
          return n + 1;
        });
      }, PER_LETTER);
    }, START_DELAY);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, [total]);

  const done = typed >= total;
  let index = 0;

  return (
    <>
      {letters.map((word, w) => (
        <span key={w} className={styles.word} aria-hidden="true">
          {word.map((ch, i) => {
            const at = index++;
            // The cursor lives inside the letter it follows (or precedes, for the first one),
            // absolutely positioned, so no element ever sits between two letters and breaks kerning.
            const cursorAfter = !done && typed > 0 && at === typed - 1;
            const cursorBefore = typed === 0 && at === 0;
            return (
              <span key={i} className={styles.ch} data-on={at < typed || undefined}>
                {ch}
                {(cursorAfter || cursorBefore) && (
                  <span
                    className={styles.cursor}
                    data-side={cursorBefore ? "before" : "after"}
                  />
                )}
              </span>
            );
          })}
          {w === letters.length - 1 && (
            <span className={styles.stop} data-on={done || undefined}>
              .
            </span>
          )}
        </span>
      ))}
    </>
  );
}
