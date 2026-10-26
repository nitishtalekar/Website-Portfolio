"use client";

import { createContext, useContext, useState } from "react";
import Pager from "./Pager";
import styles from "./Paged.module.css";

interface PagedValue {
  page: number;
  pages: number;
  size: number;
  setPage: (page: number) => void;
}

const PagedContext = createContext<PagedValue>({ page: 0, pages: 1, size: Number.MAX_SAFE_INTEGER, setPage: () => {} });

export const usePaged = () => useContext(PagedContext);

/**
 * Shares one page number between a section's header (where the pager lives)
 * and its list (which shows that page). With no `pageSize`, everything is one page.
 */
export function Paged({ count, pageSize, children }: { count: number; pageSize?: number; children: React.ReactNode }) {
  const [page, setPage] = useState(0);
  const size = pageSize && pageSize > 0 ? pageSize : Math.max(count, 1);
  const pages = Math.max(1, Math.ceil(count / size));
  return <PagedContext.Provider value={{ page: Math.min(page, pages - 1), pages, size, setPage }}>{children}</PagedContext.Provider>;
}

/** The pager itself: placed in the section header so it never moves with the list. */
export function PagerSlot() {
  const { page, pages, setPage } = usePaged();
  return <Pager page={page} pages={pages} onChange={setPage} />;
}

/**
 * Renders every page in the same grid cell and shows one, so the list is always
 * as tall as its tallest page and switching pages never shifts anything.
 */
export function PageStack<T>({ items, render }: { items: T[]; render: (slice: T[]) => React.ReactNode }) {
  const { page, pages, size } = usePaged();
  return (
    <div className={styles.stack}>
      {Array.from({ length: pages }, (_, p) => (
        <div key={p} className={styles.page} data-active={p === page} inert={p !== page}>
          {render(items.slice(p * size, (p + 1) * size))}
        </div>
      ))}
    </div>
  );
}
