"use client";

import { useRef, useState } from "react";
import type { Resume } from "@/content/types";
import styles from "./Contact.module.css";

interface Props {
  email: string;
  links: Resume["profile"]["links"];
  scholar: Resume["research"]["scholar"];
  contact: Resume["contact"];
}

export default function Contact({ email, links, scholar, contact }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { hint, copied: copiedMsg, mail, now } = contact;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Clipboard can be blocked; fall back to the mail app.
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 3200);
  };

  return (
    <div className={styles.contact}>
      <button type="button" className={styles.email} onClick={copy} aria-describedby="copy-status">
        {email}
      </button>
      <p id="copy-status" className={styles.status} role="status">
        {copied ? copiedMsg : hint}{" "}
        <a className="link" href={`mailto:${email}`}>
          {mail}
        </a>
      </p>

      <ul className={styles.links}>
        {links.map((l) => (
          <li key={l.url}>
            <a className="link" href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          </li>
        ))}
        <li>
          {scholar.url ? (
            <a className="link" href={scholar.url} target="_blank" rel="noopener noreferrer">
              {scholar.label}
            </a>
          ) : (
            <span className="pending">{scholar.pending}</span>
          )}
        </li>
      </ul>

      <dl className={styles.now}>
        {now.map((n) => (
          <div key={n.label}>
            <dt>{n.label}</dt>
            <dd>{n.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
