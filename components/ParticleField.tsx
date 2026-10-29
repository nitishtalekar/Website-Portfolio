"use client";

import { useEffect, useRef } from "react";
import { ICON_PATHS } from "./Icon";
import styles from "./ParticleField.module.css";

interface Chapter {
  id: string;
  icon: string;
}

/** Event Tabs fires when the visible tab in the Background chapter changes. */
export const TAB_MOTIF_EVENT = "motif-tab";

const SAMPLE = 160; // icon is rasterised on a 160px grid, then read back as points
const BUCKETS = 4; // alpha steps, so the draw loop sets globalAlpha 4 times, not 900
const FACTOR = BUCKETS - 1;

/** Normalised (-0.5..0.5) points that trace an icon's strokes. */
function samplePoints(name: string): Float32Array | null {
  const d = ICON_PATHS[name];
  if (!d) return null;
  const c = document.createElement("canvas");
  c.width = c.height = SAMPLE;
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g) return null;
  const k = SAMPLE / 24;
  g.scale(k, k);
  g.lineWidth = 1.5;
  g.lineCap = g.lineJoin = "round";
  g.strokeStyle = "#fff";
  g.stroke(new Path2D(d));
  const { data } = g.getImageData(0, 0, SAMPLE, SAMPLE);
  const out: number[] = [];
  for (let y = 0; y < SAMPLE; y += 2) {
    for (let x = 0; x < SAMPLE; x += 2) {
      if (data[(y * SAMPLE + x) * 4 + 3] > 120) out.push(x / SAMPLE - 0.5, y / SAMPLE - 0.5);
    }
  }
  return new Float32Array(out);
}

/** Icons that are drawn larger than the default size. */
const SCALE: Record<string, number> = { togocode: 1.35 };

/** Icons that get more particles than the default count. */
const DENSITY: Record<string, number> = { togocode: 1.8 };

/** Nothing is drawn this close to the screen edge, so no dot ever sits against it. */
const EDGE = 16;

/** How much flatter the loose swirl is vertically than horizontally. */
const FLAT = 2.6;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * A faded particle field behind the whole page. The dots gather into the
 * icon of the chapter you are on (inside Background, the icon of the open tab),
 * swirl apart and re-form when that changes, are stirred by scrolling, and are
 * pushed aside by the pointer. Drawn at low alpha with no motion of its own beyond a
 * slow shimmer, so it reads as atmosphere, not content.
 */
export default function ParticleField({ chapters }: { chapters: readonly Chapter[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const cache = new Map<string, Float32Array | null>();
    const pointsFor = (name: string) => {
      if (!cache.has(name)) cache.set(name, samplePoints(name));
      return cache.get(name) ?? null;
    };

    // ---- layout -----------------------------------------------------------
    let W = 0;
    let H = 0;
    let dpr = 1;
    let N = 0;
    let wide = true;

    // ---- particles (struct of arrays) ------------------------------------
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let nu = new Float32Array(0); // target in icon space
    let nv = new Float32Array(0);
    let delay = new Float32Array(0); // 0..0.5, staggers the re-gather
    let phase = new Float32Array(0);
    let bucket = new Uint8Array(0);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      // clientWidth excludes the scrollbar, so the bitmap matches what is on screen.
      W = root.clientWidth;
      H = window.innerHeight;
      wide = W >= 900;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const want = Math.round((W < 700 ? 1000 : 1700) * (DENSITY[motif] ?? 1));
      if (want === N) return;
      const keep = Math.min(N, want);
      const grow = <T extends Float32Array | Uint8Array>(a: T, Ctor: new (n: number) => T): T => {
        const b = new Ctor(want);
        b.set(a.subarray(0, keep));
        return b;
      };
      px = grow(px, Float32Array);
      py = grow(py, Float32Array);
      vx = grow(vx, Float32Array);
      vy = grow(vy, Float32Array);
      nu = grow(nu, Float32Array);
      nv = grow(nv, Float32Array);
      delay = grow(delay, Float32Array);
      phase = grow(phase, Float32Array);
      bucket = grow(bucket, Uint8Array);
      for (let i = keep; i < want; i++) {
        px[i] = Math.random() * W;
        py[i] = Math.random() * H;
        phase[i] = Math.random() * Math.PI * 2;
        bucket[i] = Math.floor(Math.random() * BUCKETS);
      }
      N = want;
      assign(motif);
    };

    // ---- motif: which icon the particles are forming ----------------------
    let motif = "";
    let color = "#a6c7a6";
    let ramp = 1; // 0 = just changed (swirling), 1 = settled into shape
    const readColor = () => {
      color = getComputedStyle(root).getPropertyValue("--accent-hi").trim() || color;
    };

    const assign = (name: string) => {
      const pts = pointsFor(name);
      if (!pts || pts.length === 0 || N === 0) return;
      const count = pts.length / 2;
      // Shuffled order so neighbours in the old shape fly to unrelated places in the new one.
      for (let i = 0; i < N; i++) {
        const j = (Math.random() * count) | 0;
        nu[i] = pts[j * 2] + (Math.random() - 0.5) * 0.012;
        nv[i] = pts[j * 2 + 1] + (Math.random() - 0.5) * 0.012;
        delay[i] = Math.random() * 0.8;
      }
    };

    const setMotif = (name: string) => {
      if (!name || name === motif) return;
      motif = name;
      resize(); // some icons use more particles
      readColor();
      assign(name);
      ramp = 0;
      if (reduced) snap();
    };

    let chapterIcon = chapters[0]?.icon ?? "";
    let chapterId = chapters[0]?.id ?? "";
    let tabIcon = root.dataset.tabMotif ?? "";
    const resolve = () => setMotif(chapterId === "background" && tabIcon ? tabIcon : chapterIcon);

    // ---- inputs -----------------------------------------------------------
    let scrollY = window.scrollY;
    let stir = 0; // 0..1, smoothed scroll speed
    let lastScrollT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(now - lastScrollT, 8);
      const v = Math.abs(window.scrollY - scrollY) / dt; // px per ms
      stir = Math.max(stir, Math.min(1, v / 2.2));
      scrollY = window.scrollY;
      lastScrollT = now;
    };

    let mx = -9999;
    let my = -9999;
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // Near the edge (the scrollbar side especially) the push would shove dots off-screen.
      if (e.clientX < EDGE * 3 || e.clientX > W - EDGE * 3 || e.clientY < EDGE * 3 || e.clientY > H - EDGE * 3) {
        mx = my = -9999;
        return;
      }
      mx = e.clientX;
      my = e.clientY;
    };
    // Forget the pointer when it leaves the page (or the window loses focus), or its last
    // spot, often at the right edge on the way to the scrollbar, keeps pushing dots away.
    const onLeave = () => {
      mx = my = -9999;
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) onLeave();
    };

    const onTab = (e: Event) => {
      tabIcon = (e as CustomEvent<string>).detail;
      resolve();
    };

    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).id;
          chapterIcon = chapters.find((c) => c.id === id)?.icon ?? chapterIcon;
          chapterId = id;
          resolve();
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const s of sections) io.observe(s);

    // The Konami mood swaps --accent; follow it.
    const mood = new MutationObserver(readColor);
    mood.observe(root, { attributes: true, attributeFilter: ["data-mood"] });

    // ---- per-frame geometry ----------------------------------------------
    // Icon centre, size, and the scroll-driven leftward drift shared by all particles.
    const frame = { cx: 0, cy: 0, size: 0 };
    let zoom = SCALE[motif] ?? 1; // eases between icons' scales
    const place = () => {
      zoom += ((SCALE[motif] ?? 1) - zoom) * 0.08;
      frame.size = Math.min(H * 0.64, W * (wide ? 0.4 : 0.82)) * zoom;
      // Phase is 0 at the middle of a chapter and +-0.5 as the next one takes over.
      const p = ((((scrollY / H + 0.5) % 1) + 1) % 1) - 0.5;
      // The icon slides left as you scroll on, so a new one arrives from the right.
      frame.cx = W * (wide ? 0.72 : 0.5) - p * W * 0.18;
      frame.cy = H * 0.5;
    };
    const targetX = (i: number) => frame.cx + nu[i] * frame.size;
    const targetY = (i: number) => frame.cy + nv[i] * frame.size;

    function snap() {
      place();
      for (let i = 0; i < N; i++) {
        px[i] = targetX(i);
        py[i] = targetY(i);
        vx[i] = vy[i] = 0;
      }
      draw(0);
    }

    // ---- draw -------------------------------------------------------------
    const BASE_ALPHA = () => (wide ? 0.68 : 0.46);
    function draw(t: number) {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = color;
      const s = wide ? 2 : 1.7;
      const base = BASE_ALPHA();
      for (let b = 0; b < BUCKETS; b++) {
        ctx!.globalAlpha = base * (0.35 + 0.65 * (b / FACTOR));
        for (let i = b; i < N; i += BUCKETS) {
          // Slow per-particle twinkle, in steps so the batching still holds.
          if (!reduced && Math.sin(t * 0.0012 + phase[i] * 3) > 0.92) continue;
          const x = px[i];
          const y = py[i];
          if (x < EDGE || x > W - EDGE || y < EDGE || y > H - EDGE) continue;
          ctx!.fillRect(x - s / 2, y - s / 2, s, s);
        }
      }
      ctx!.globalAlpha = 1;
    }

    // ---- physics ----------------------------------------------------------
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      if (dt <= 0) return;

      place();
      ramp = Math.min(ramp + dt / 2.1, 2);
      stir *= Math.exp(-dt * 3);
      const pushR = 120;

      for (let i = 0; i < N; i++) {
        // Per-particle readiness: each lets go of the swirl at its own moment.
        const kf = clamp01((ramp - delay[i]) / 0.7);
        const spring = (0.5 + 15.5 * kf * kf) * (1 - 0.55 * stir);
        const damp = 2.2 + 4.3 * kf;

        const tx = targetX(i);
        const ty = targetY(i);
        let ax = (tx - px[i]) * spring;
        // Vertical pull stays moderate so dots keep roughly to their rows.
        let ay = (ty - py[i]) * Math.max(spring, 1.4);

        // While loose, swirl round the middle of the screen along a wide, flat ellipse:
        // long sideways sweeps, a shorter arc up and down. The centre slides to the icon
        // as each particle settles. A mild leftward lean matches the icon's slide.
        const ox = W / 2 + (frame.cx - W / 2) * kf;
        const oy = H / 2 + (frame.cy - H / 2) * kf;
        const rx = px[i] - ox;
        const ry = (py[i] - oy) * FLAT; // stretch y so distances are measured on the ellipse
        const r = Math.max(Math.hypot(rx, ry), 60);
        const loose = 1 - kf;
        const swirl = loose * 950 + stir * 420;
        ax += (-ry / r) * swirl - (loose * 260 + stir * 200);
        ay += (rx / r) * swirl * 0.4;

        // Pointer pushes dots aside, with a little spin so they curl round it.
        if (mx > -9000) {
          const dx = px[i] - mx;
          const dy = py[i] - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < pushR * pushR) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / pushR) ** 2 * 2400;
            ax += (dx / d) * f + (-dy / d) * f * 0.35;
            ay += (dy / d) * f + (dx / d) * f * 0.35;
          }
        }

        // Shimmer: the shape breathes a few pixels, never loses its outline.
        const w = now * 0.0009 + phase[i];
        ax += Math.cos(w * 1.7) * 14;
        ay += Math.sin(w * 1.3) * 14;

        const k = Math.exp(-damp * dt);
        vx[i] = (vx[i] + ax * dt) * k;
        vy[i] = (vy[i] + ay * dt) * k;
        px[i] += vx[i] * dt;
        py[i] += vy[i] * dt;
      }
      draw(now);
    };

    // ---- start ------------------------------------------------------------
    let resizeQueued = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeQueued);
      resizeQueued = requestAnimationFrame(() => {
        resize();
        if (reduced) snap();
      });
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };

    resize();
    resolve();
    if (reduced) {
      snap();
    } else {
      place();
      raf = requestAnimationFrame(step);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("mouseout", onOut);
    window.addEventListener("blur", onLeave);
    window.addEventListener(TAB_MOTIF_EVENT, onTab);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeQueued);
      io.disconnect();
      mood.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener(TAB_MOTIF_EVENT, onTab);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [chapters]);

  return <canvas ref={canvasRef} className={styles.field} aria-hidden="true" />;
}
