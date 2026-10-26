interface Props {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

import styles from "./Pager.module.css";

const Chevron = ({ d }: { d: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

/** Previous / next arrows with one dot per page. Renders nothing for a single page. */
export default function Pager({ page, pages, onChange }: Props) {
  if (pages < 2) return null;
  return (
    <nav className={styles.pager} aria-label="Pages">
      <button type="button" className={styles.step} disabled={page === 0} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <Chevron d="m14 6-6 6 6 6" />
      </button>
      <ol className={styles.dots}>
        {Array.from({ length: pages }, (_, p) => (
          <li key={p}>
            <button
              type="button"
              className={styles.dot}
              aria-label={`Page ${p + 1} of ${pages}`}
              aria-current={p === page ? "page" : undefined}
              onClick={() => onChange(p)}
            />
          </li>
        ))}
      </ol>
      <button type="button" className={styles.step} disabled={page === pages - 1} onClick={() => onChange(page + 1)} aria-label="Next page">
        <Chevron d="m10 6 6 6-6 6" />
      </button>
    </nav>
  );
}
