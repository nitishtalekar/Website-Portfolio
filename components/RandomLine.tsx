"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shows one of several wordings and changes it each time the line scrolls into view
 * (or its tab is opened). The server render and first paint show the first option;
 * the first time the line is seen it picks at random, after that it always moves to a different one.
 */
export default function RandomLine({ options }: { options: string | readonly string[] }) {
  const list = typeof options === "string" ? [options] : options;
  const [text, setText] = useState(list[0]);
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useRef(false);
  const current = useRef(list[0]);
  const key = list.join("\u0000");

  useEffect(() => {
    const el = ref.current;
    if (!el || list.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry.isIntersecting) return;
        // First sighting: any option. After that: never the one already showing.
        const pool = seen.current ? list.filter((o) => o !== current.current) : list;
        const next = pool[Math.floor(Math.random() * pool.length)];
        seen.current = true;
        current.current = next;
        setText(next);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // `key` stands for the contents of `list`, which is a new array each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return <span ref={ref}>{text}</span>;
}
