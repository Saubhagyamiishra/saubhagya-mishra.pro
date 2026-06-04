"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>-_*#%";

export default function Scramble({
  text,
  className,
  start = "inview",
  trigger = false,
  duration = 720,
  delay = 0,
}: {
  text: string;
  className?: string;
  start?: "inview" | "trigger";
  trigger?: boolean;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);
  const ran = useRef(false);
  const reduced = usePrefersReducedMotion();

  const run = () => {
    if (ran.current) return;
    ran.current = true;
    if (reduced) {
      setOut(text);
      return;
    }
    const chars = text.split("");
    const len = chars.length;
    const lock = chars.map(
      (_, i) => (i / Math.max(len, 1)) * duration * 0.6 + Math.random() * duration * 0.28
    );
    const startT = performance.now() + delay;
    let raf = 0;
    const tick = () => {
      const t = performance.now() - startT;
      if (t < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      let s = "";
      let done = true;
      for (let i = 0; i < len; i++) {
        const ch = chars[i];
        if (ch === " ") {
          s += " ";
          continue;
        }
        if (t >= lock[i]) s += ch;
        else {
          s += CHARS[(Math.random() * CHARS.length) | 0];
          done = false;
        }
      }
      setOut(s);
      if (!done) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    cleanup.current = () => cancelAnimationFrame(raf);
  };
  const cleanup = useRef<() => void>(() => {});

  useEffect(() => {
    if (start !== "inview") return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cleanup.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (start === "trigger" && trigger) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <span ref={ref} className={className}>
      {out}
    </span>
  );
}
