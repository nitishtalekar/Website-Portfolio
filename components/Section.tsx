import styles from "./Section.module.css";

interface Props {
  id: string;
  children: React.ReactNode;
}

/**
 * One chapter = one viewport-high "page". Everything a chapter shows lives
 * inside it; if content outgrows the viewport (small screens, long lists) the
 * section simply grows and native snap lets you scroll freely inside it.
 */
export default function Section({ id, children }: Props) {
  return (
    <section id={id} data-chapter aria-labelledby={`${id}-title`} className={styles.section}>
      <div className={styles.inner}>{children}</div>
    </section>
  );
}
