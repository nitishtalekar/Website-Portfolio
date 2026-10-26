"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CheatCode.module.css";

const CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** The classic. Swaps the sage accent for crema and says so, briefly. */
export default function CheatCode() {
  const [message, setMessage] = useState("");
  const progress = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      progress.current = key === CODE[progress.current] ? progress.current + 1 : key === CODE[0] ? 1 : 0;
      if (progress.current < CODE.length) return;
      progress.current = 0;

      const root = document.documentElement;
      const on = root.dataset.mood !== "espresso";
      if (on) root.dataset.mood = "espresso";
      else delete root.dataset.mood;

      setMessage(on ? "Cheat code accepted. Extra shot of espresso." : "Back to green. Decaf restored.");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(""), 3600);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <p className={styles.toast} role="status" data-show={message !== ""}>
      {message}
    </p>
  );
}
