import Section from "./Section";
import { resume } from "@/content/resume";
import styles from "./Hero.module.css";

export default function Hero() {
  const p = resume.profile;
  return (
    <Section id="intro" center>
      <div className={styles.hero}>
        <p className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          {p.role}, {p.org}
        </p>
        <h1 id="intro-title" className={styles.name}>
          <span className={styles.line}>{p.firstName}</span>
          <span className={styles.line}>{p.lastName}</span>
        </h1>
        <p className={styles.lede}>{p.tagline}</p>
        <p className={styles.aside}>{p.aside}</p>
        <ul className={styles.links}>
          {p.links.map((l) => (
            <li key={l.url}>
              <a className="link" href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a className="link" href={`mailto:${p.email}`}>
              Email
            </a>
          </li>
        </ul>
      </div>
    </Section>
  );
}
