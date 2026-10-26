"use client";

import { useState } from "react";
import styles from "./Pager.module.css";

/** Slices a list into pages. With no `pageSize` everything stays on one page. */
export function usePager<T>(items: T[], pageSize?: number) {
  const [page, setPage] = useState(0);
  const size = pageSize && pageSize > 0 ? pageSize : Math.max(items.length, 1);
  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(page, pages - 1);
  return { page: current, setPage, pages, slice: items.slice(current * size, (current + 1) * size) };
}

interface Props {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

/** Previous / next with a small "2 / 3" between. Renders nothing for a single page. */
export default function Pager({ page, pages, onChange }: Props) {
  if (pages < 2) return null;
  return (
    <nav className={styles.pager} aria-label="Pages">
      <button type="button" className={styles.step} disabled={page === 0} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m14 6-6 6 6 6" />
        </svg>
      </button>
      <span className={styles.count} aria-live="polite">
        {page + 1} / {pages}
      </span>
      <button type="button" className={styles.step} disabled={page === pages - 1} onClick={() => onChange(page + 1)} aria-label="Next page">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m10 6 6 6-6 6" />
        </svg>
      </button>
    </nav>
  );
}
