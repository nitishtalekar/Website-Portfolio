import type { Resume } from "@/content/types";
import styles from "./Inventory.module.css";

/** The loadout as an inventory: each group is a panel, each skill a slot. */
export default function Inventory({ groups }: { groups: Resume["stack"]["groups"] }) {
  return (
    <div className={styles.panels}>
      {groups.map((g) => (
        <section key={g.label} className={styles.panel} aria-label={g.label}>
          <h3 className={styles.label}>{g.label}</h3>
          <ul className={styles.slots}>
            {g.items.map((s) => (
              <li key={s} className={styles.slot}>
                {s}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
