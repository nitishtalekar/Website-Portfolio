import type { Highlight } from "@/content/types";
import styles from "./Highlights.module.css";

/** Key figures as an inline typographic row, not cards. */
export default function Highlights({ items }: { items?: Highlight[] }) {
  if (!items?.length) return null;
  return (
    <dl className={styles.row}>
      {items.map((h) => (
        <div key={h.label} className={styles.item}>
          <dt className={styles.value}>{h.value}</dt>
          <dd className={styles.label}>{h.label}</dd>
        </div>
      ))}
    </dl>
  );
}
