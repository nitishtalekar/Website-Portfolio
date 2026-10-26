import styles from "./Hero.module.css";

/**
 * Flat chevron backdrop for the portrait card, drawn on a 400 x 500 grid.
 * `PatternInside` is clipped to the card. `PatternJut` is not: its shapes cross
 * the card edge, so a few pieces stick out. Gray steps do the work; the accent is a single hint.
 */

const TONES = [styles.g1, styles.g2, styles.g3, styles.g4];

/** A V-shaped band: runs from the left edge up to a peak at px and back down to the right edge. */
function band(y: number, px: number, rise: number, thick: number) {
  return `0,${y} ${px},${y - rise} 400,${y} 400,${y + thick} ${px},${y - rise + thick} 0,${y + thick}`;
}

export function PatternInside() {
  return (
    <svg
      className={styles.pattern}
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {Array.from({ length: 7 }, (_, i) => (
        <polygon
          key={i}
          className={TONES[i % 4]}
          points={band(120 + i * 80, 200, 80, 56)}
        />
      ))}
      <polygon className={styles.accent} points="350,40 372,40 372,62" />
    </svg>
  );
}

export function PatternJut() {
  return (
    <svg
      className={`${styles.pattern} ${styles.jut}`}
      viewBox="0 0 400 500"
      aria-hidden="true"
    >
      <polygon className={styles.g4} points="380,240 440,210 440,266 380,296" />
      <circle className={styles.ringMono} cx="-8" cy="400" r="34" />
      <rect className={styles.g3} x="-30" y="40" width="80" height="14" />
    </svg>
  );
}
