import Icon from "./Icon";
import styles from "./SectionHeader.module.css";

interface Props {
  id: string;
  title: string;
  sub: string;
  /** Name of a symbol from Icon.tsx, set beside the title. */
  icon?: string;
  /** Optional control pinned to the right of the title row (the pager). */
  aside?: React.ReactNode;
}

export default function SectionHeader({ id, title, sub, icon, aside }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <h2 id={`${id}-title`} className={styles.title}>
          <span className={styles.mask}>
            <span className={styles.rise}>
              {title}
              {icon ? (
                <span className={styles.icon}>
                  <Icon name={icon} size={28} />
                </span>
              ) : null}
            </span>
          </span>
        </h2>
        {aside ? <div className={styles.aside}>{aside}</div> : null}
      </div>
      <p className={styles.sub}>{sub}</p>
    </header>
  );
}
