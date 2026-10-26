import type { Row } from "@/content/types";
import Highlights from "./Highlights";
import styles from "./RowBody.module.css";

/** True when a row has anything to reveal; rows without a body don't open. */
export const hasBody = (r: Row) =>
  Boolean(r.summary || r.points?.length || r.highlights?.length || r.details?.length || r.tags?.length || r.links?.length || r.pending);

/** The opened contents of an entry, shared by every presentation (list, cards, shelf, timeline). */
export default function RowBody({ row }: { row: Row }) {
  return (
    <div className={styles.body}>
      {row.summary ? <p className={styles.summary}>{row.summary}</p> : null}
      {row.points?.length ? (
        <ul className={styles.points}>
          {row.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      ) : null}
      <Highlights items={row.highlights} />
      {row.details?.length ? (
        <dl className={styles.details}>
          {row.details.map((d) => (
            <div key={d.label}>
              <dt>{d.label}</dt>
              <dd>{d.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {row.tags?.length ? <p className={styles.tags}>{row.tags.join("  /  ")}</p> : null}
      {row.links?.length ? (
        <p className={styles.links}>
          {row.links.map((l) => (
            <a key={l.url} className="link" href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </p>
      ) : row.pending ? (
        <p className="pending">{row.pending}</p>
      ) : null}
    </div>
  );
}
