import Image from "next/image";
import { PatternInside, PatternJut } from "./HeroPattern";
import styles from "./Hero.module.css";

/** The portrait card: a chevron pattern, with the cutout standing in front and a few shapes jutting past the edge. */
export default function PortraitCard({ name }: { name: string }) {
  return (
    <figure className={styles.posterFig}>
      <div className={styles.card}>
        <PatternInside />
      </div>
      <PatternJut />
      <div className={styles.cutout}>
        <Image
          src="/nitish-profile-nobg.png"
          alt={`Portrait of ${name}, smiling and looking off to the side`}
          width={1123}
          height={1123}
          sizes="(max-width: 720px) 70vw, 560px"
          preload
          className={styles.person}
        />
      </div>
    </figure>
  );
}
