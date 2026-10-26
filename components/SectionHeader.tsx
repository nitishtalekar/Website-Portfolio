import Icon from "./Icon";
import styles from "./SectionHeader.module.css";

interface Props {
  id: string;
  title: string;
  sub: string;
  /** Name of a symbol from Icon.tsx, set beside the title. */
  icon?: string;
}

export default function SectionHeader({ id, title, sub, icon }: Props) {
  return (
    <header className={styles.header}>
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
      <p className={styles.sub}>{sub}</p>
    </header>
  );
}
