import type { Row } from "@/content/types";
import Highlights from "./Highlights";
import styles from "./Statement.module.css";

/** One entry told as a statement: the story set large, the figures beneath. */
export default function Statement({ items }: { items: Row[] }) {
  return (
    <ul className={styles.list}>
      {items.map((r) => (
        <li key={r.id} className={styles.item}>
          <p className={styles.who}>
            <span className={styles.title}>{r.title}</span>
            <span>{r.subtitle}</span>
            <span className={styles.when}>{r.when}</span>
          </p>
          <p className={styles.statement}>{r.summary}</p>
          <Highlights items={r.highlights} />
        </li>
      ))}
    </ul>
  );
}
