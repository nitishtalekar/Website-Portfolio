import styles from "./Section.module.css";

interface Props {
  id: string;
  /** Vertically center the content (the hero); chapters otherwise share one top line. */
  center?: boolean;
  children: React.ReactNode;
}

/**
 * One chapter = one viewport-high "page". Everything a chapter shows lives
 * inside it; if content outgrows the viewport (small screens, long lists) the
 * section simply grows and native snap lets you scroll freely inside it.
 */
export default function Section({ id, center = false, children }: Props) {
  return (
    <section id={id} data-chapter aria-labelledby={`${id}-title`} className={center ? `${styles.section} ${styles.center}` : styles.section}>
      <div className={styles.inner}>{children}</div>
    </section>
  );
}
