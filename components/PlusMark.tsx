import styles from "./PlusMark.module.css";

/** A plus that turns into a minus; the shared "this row opens" affordance. */
export default function PlusMark({ open }: { open: boolean }) {
  return <span className={styles.plus} data-open={open} aria-hidden="true" />;
}
