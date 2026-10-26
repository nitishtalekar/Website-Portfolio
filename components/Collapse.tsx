import styles from "./Collapse.module.css";

interface Props {
  id: string;
  open: boolean;
  children: React.ReactNode;
}

/** Height-animating disclosure body. Closed content is `inert` so it can't be tabbed to. */
export default function Collapse({ id, open, children }: Props) {
  return (
    <div id={id} className={styles.collapse} data-open={open} inert={!open}>
      <div className={styles.clip}>{children}</div>
    </div>
  );
}
