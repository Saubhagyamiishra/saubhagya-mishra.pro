"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

const LINE1 = "SAUBHAGYA";
const LINE2 = "MISHRA";

function Word({
  text,
  delayBase,
  reduced,
}: {
  text: string;
  delayBase: number;
  reduced: boolean;
}) {
  const letters = useMemo(
    () =>
      text.split("").map((ch) => ({
        ch,
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 90,
        r: (Math.random() - 0.5) * 40,
      })),
    [text]
  );

  return (
    <span className="pre-word">
      {letters.map((l, i) => (
        <motion.span
          key={i}
          className="pre-letter"
          initial={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, x: l.x, y: l.y, rotate: l.r, filter: "blur(14px)" }
          }
          animate={
            reduced
              ? { opacity: 1 }
              : { opacity: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)" }
          }
          transition={{
            duration: reduced ? 0.4 : 1,
            delay: reduced ? 0 : delayBase + i * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {l.ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(0);
  const [exit, setExit] = useState(false);

  const total = reduced ? 900 : 2600;

  const specks = useMemo(
    () =>
      Array.from({ length: 16 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        d: 2 + Math.random() * 3,
        delay: Math.random() * 2,
      })),
    []
  );

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / (total - 500));
      setCount(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const exitT = setTimeout(() => setExit(true), total);
    const doneT = setTimeout(onDone, total + 200);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitT);
      clearTimeout(doneT);
    };
  }, [onDone, total]);

  return (
    <motion.div
      className="preloader"
      initial={{ y: 0 }}
      animate={exit ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      style={{ pointerEvents: exit ? "none" : "auto" }}
      aria-hidden="true"
    >
      {!reduced &&
        specks.map((s, i) => (
          <span
            key={i}
            className="pre-speck"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              animationDuration: `${s.d}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}

      <div className="pre-center">
        <div className="pre-name">
          <Word text={LINE1} delayBase={0.1} reduced={reduced} />
          <Word text={LINE2} delayBase={0.5} reduced={reduced} />
        </div>
        <motion.div
          className="pre-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0.2 : 1 }}
        >
          <span>INITIALIZING SIGNAL</span>
          <span className="pre-count">{String(count).padStart(3, "0")}</span>
        </motion.div>
      </div>

      <div className="pre-bar">
        <div className="pre-bar-fill" style={{ width: `${count}%` }} />
      </div>
    </motion.div>
  );
}
