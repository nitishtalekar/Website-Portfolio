import Section from "./Section";
import SocialLinks from "./SocialLinks";
import { resume } from "@/content/resume";
import styles from "./Hero.module.css";

export default function Hero() {
  const p = resume.profile;
  return (
    <Section id="intro">
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
        <div className={styles.links}>
          <SocialLinks links={p.links} email={p.email} scholar={resume.research.scholar} />
        </div>
      </div>
    </Section>
  );
}
