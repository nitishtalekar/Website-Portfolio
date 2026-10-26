import styles from "./Section.module.css";

interface Props {
  id: string;
  children: React.ReactNode;
  /** Let the chapter use more than the 64rem text column. */
  wide?: boolean;
}

/**
 * One chapter = one viewport-high "page". Everything a chapter shows lives
 * inside it; if content outgrows the viewport (small screens, long lists) the
 * section simply grows and native snap lets you scroll freely inside it.
 */
export default function Section({ id, children, wide }: Props) {
  return (
    <section id={id} data-chapter aria-labelledby={`${id}-title`} className={styles.section}>
      <div className={styles.inner} style={wide ? { maxWidth: "80rem" } : undefined}>{children}</div>
    </section>
  );
}
