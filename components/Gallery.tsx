"use client";

import { useEffect, useRef, useState } from "react";
import type { Artwork } from "@/lib/drive";
import Icon from "./Icon";
import { usePaged } from "./Paged";
import styles from "./Gallery.module.css";

/**
 * Google serves public Drive files from its image CDN, sized and re-encoded on request, so the
 * browser loads them straight from Google: nothing is downloaded by this server, and Drive's
 * download limits (which answer 403) don't apply. `rj` asks for JPEG, a fraction of the PNG's size.
 */
const src = (a: Artwork, width: number) => `https://lh3.googleusercontent.com/d/${a.id}=w${width}-rj`;

/**
 * One piece over a wiggling geometric placeholder with a spinner. The placeholder stays until the
 * image has really loaded, so a slow or broken image never leaves an empty box; the spinner stops
 * if the image fails, since nothing more is coming.
 */
function Art({ piece, widths, sizes, className }: { piece: Artwork; widths: number[]; sizes?: string; className: string }) {
  const [state, setState] = useState<"loading" | "loaded" | "failed">("loading");
  const loaded = state === "loaded";
  return (
    <>
      <span className={styles.placeholder} data-loaded={loaded} aria-hidden="true">
        {state === "loading" ? <span className={styles.spinner} /> : null}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src(piece, widths[widths.length - 1])}
        srcSet={widths.map((w) => `${src(piece, w)} ${w}w`).join(", ")}
        sizes={sizes}
        alt={piece.name}
        loading="lazy"
        decoding="async"
        className={className}
        data-loaded={loaded}
        onLoad={() => setState("loaded")}
        onError={() => setState("failed")}
        // Images that finished before hydration never fire onLoad, so check the element itself.
        ref={(el) => {
          if (el?.complete) setState(el.naturalWidth > 0 ? "loaded" : "failed");
        }}
      />
    </>
  );
}

/** A rail of portrait cards you scroll or swipe through; a click opens the piece uncropped, full screen with close and previous/next buttons. */
export default function Gallery({ items }: { items: Artwork[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  /** The piece shown full screen; null while closed, so its large image isn't fetched until asked for. */
  const [current, setCurrent] = useState<number | null>(null);

  const open = (i: number) => {
    setCurrent(i);
    dialogRef.current?.showModal();
  };
  const piece = current === null ? null : items[current];
  const step = (d: number) => setCurrent((i) => (i === null ? i : (i + d + items.length) % items.length));
  const { page, pages, size, setPage } = usePaged();
  // The page the rail itself last reported, so a pager click (a different page) can be told apart from scrolling.
  const reported = useRef(page);
  const lockUntil = useRef(0);

  /** Dots follow the rail: the page is the group the first fully visible card belongs to. */
  const onScroll = () => {
    const rail = railRef.current;
    if (!rail || Date.now() < lockUntil.current) return;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
    const first = Array.from(rail.children).findIndex((el) => (el as HTMLElement).offsetLeft >= rail.scrollLeft - 2);
    const p = atEnd ? pages - 1 : Math.floor(Math.max(first, 0) / size);
    reported.current = p;
    setPage(p);
  };

  // A pager click: glide the rail to the first card of that page, ignoring scroll events on the way.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || page === reported.current) return;
    reported.current = page;
    lockUntil.current = Date.now() + 700;
    const target = rail.children[page * size] as HTMLElement | undefined;
    rail.scrollTo({ left: target?.offsetLeft ?? 0, behavior: "smooth" });
  }, [page, size]);

  return (
    <>
      <ul ref={railRef} className={styles.rail} aria-label="Artwork" onScroll={onScroll}>
        {items.map((a, i) => (
          <li key={a.id} className={styles.item}>
            <button type="button" className={styles.card} onClick={() => open(i)} aria-label={`View ${a.name}`}>
              <Art piece={a} widths={[480, 800]} sizes="(max-width: 40em) 70vw, 20rem" className={styles.img} />
              <span className={styles.label}>{a.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={dialogRef} className={styles.dialog} aria-label={piece?.name}
        onClose={() => setCurrent(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {piece ? <Art key={piece.id} piece={piece} widths={[1600, 2400]} sizes="100vw" className={styles.full} /> : null}
        {items.length > 1 ? (
          <>
            <button type="button" className={`${styles.control} ${styles.prev}`} onClick={() => step(-1)} aria-label="Previous">
              <Icon name="arrowLeft" size={22} />
            </button>
            <button type="button" className={`${styles.control} ${styles.next}`} onClick={() => step(1)} aria-label="Next">
              <Icon name="arrowRight" size={22} />
            </button>
          </>
        ) : null}
        <button type="button" className={`${styles.control} ${styles.close}`} onClick={() => dialogRef.current?.close()} aria-label="Close">
          <Icon name="close" size={20} />
        </button>
      </dialog>
    </>
  );
}
