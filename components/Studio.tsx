import Icon from "./Icon";
import styles from "./Studio.module.css";

interface Props {
  name: string;
  tagline: string;
  about: string;
  url: string;
  /** Path under /public. The file may not exist yet; the mark is hidden until it does. */
  logo: string;
  people: string[];
  cta: string;
}

/** The joint studio: logo, a short pitch, who is in it, and the link out. */
export default function Studio({ name, tagline, about, url, logo, people, cta }: Props) {
  return (
    <div className={styles.studio}>
      <a className={styles.mark} href={url} target="_blank" rel="noopener noreferrer" aria-label={name}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" width={96} height={96} />
      </a>
      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.tagline}>{tagline}</p>
        <p className={styles.about}>{about}</p>
        <ul className={styles.people}>
          {people.map((p) => (
            <li key={p} className={styles.person}>
              {p}
            </li>
          ))}
        </ul>
        <a className="link" href={url} target="_blank" rel="noopener noreferrer">
          {cta} <Icon name="external" size={14} />
        </a>
      </div>
    </div>
  );
}
