import SocialLinks from "./SocialLinks";
import PortraitCard from "./PortraitCard";
import Section from "./Section";
import TypedName from "./TypedName";
import type { Resume } from "@/content/types";
import styles from "./Hero.module.css";

/** Portrait on the left in a floating hairline frame, text on the right; the name types itself out. */
export default function Hero({ resume }: { resume: Resume }) {
  const p = resume.profile;
  return (
    <Section id="intro" wide>
      <div className={styles.poster}>
        <PortraitCard name={`${p.firstName} ${p.lastName}`} />
        <div className={styles.posterText}>
          <p className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            {p.role}, {p.org}
          </p>
          <h1 id="intro-title" className={styles.name}>
            <span className={styles.sr}>
              {p.firstName} {p.lastName}
            </span>
            <TypedName words={[p.firstName, p.lastName]} />
          </h1>
          <div>
            <p className={styles.lede}>{p.tagline}</p>
            <p className={styles.aside}>{p.aside}</p>
          </div>
          <div className={styles.links}>
            <SocialLinks
              links={p.links}
              email={p.email}
              scholar={resume.research.scholar}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
