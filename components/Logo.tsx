import styles from "./Logo.module.css";

/**
 * { NT_ }: the N's right stem runs straight into the T's crossbar, so the two
 * letters share a joint. A blinking prompt underscore sits after the T.
 * Everything is cut square: flat caps, mitred corners, angular braces.
 * Braces and cursor take the accent colour, letters take the ink colour.
 */
export default function Logo({ height = 26 }: { height?: number }) {
  return (
    <svg
      className={styles.logo}
      viewBox="0 0 72 40"
      height={height}
      width={(height * 72) / 40}
      fill="none"
      strokeWidth="3.5"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path className={styles.brace} pathLength={1} d="M10 4L6.5 7.5V16.5L2.5 20L6.5 23.5V32.5L10 36" />
      <path className={styles.brace} pathLength={1} d="M62 4L65.5 7.5V16.5L69.5 20L65.5 23.5V32.5L62 36" />
      <g className={styles.letters}>
        <path d="M15.25 6H21.5L29.25 22.5V6H56V11.5H34.75V34H28.5L20.75 17.5V34H15.25Z" />
        <path d="M40.25 6H45.75V34H40.25Z" />
      </g>
      <path className={styles.cursor} d="M50 30.5H57V34H50Z" />
    </svg>
  );
}
