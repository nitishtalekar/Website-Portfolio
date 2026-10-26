import type { Link } from "@/content/types";
import Icon from "./Icon";
import styles from "./SocialLinks.module.css";

interface Props {
  /** Social profiles (GitHub, LinkedIn...) from resume.json. */
  links: Link[];
  email: string;
  /** Scholar may have no URL yet: it then renders as a dimmed symbol with its `pending` note. */
  scholar: { label: string; url: string; pending: string };
}

/** Email and every profile as symbols. Each has a text label for screen readers and on hover. */
export default function SocialLinks({ links, email, scholar }: Props) {
  const items = [
    { label: "Email", url: `mailto:${email}`, icon: "mail", external: false },
    ...links.map((l) => ({ label: l.label, url: l.url, icon: l.icon ?? "", external: true })),
    { label: scholar.label, url: scholar.url, icon: "scholar", external: true },
  ];
  return (
    <ul className={styles.list}>
      {items.map((i) => (
        <li key={i.label}>
          {i.url ? (
            <a
              className={styles.social}
              href={i.url}
              data-label={i.label}
              aria-label={i.label}
              {...(i.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <Icon name={i.icon} size={20} />
            </a>
          ) : (
            <span className={styles.social} data-pending="true" data-label={scholar.pending} role="img" aria-label={scholar.pending}>
              <Icon name={i.icon} size={20} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
