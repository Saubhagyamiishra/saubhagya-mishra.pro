"use client";

import { useEffect, useRef, useState } from "react";
import { NAV } from "../lib/data";
import { scrollState, lenisRef } from "../lib/scroll";

const THRESHOLDS = [0.13, 0.26, 0.6, 0.95]; // boundaries between the 5 sections

export default function Nav() {
  const fill = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    const loop = () => {
      const p = scrollState.progress;
      if (fill.current) fill.current.style.transform = `scaleX(${p})`;
      let idx = THRESHOLDS.findIndex((t) => p < t);
      if (idx === -1) idx = NAV.length - 1;
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (lenisRef.current && el) lenisRef.current.scrollTo(el, { offset: 0 });
    else el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="nav">
      <div className="nav-progress">
        <div ref={fill} className="nav-progress-fill" />
      </div>
      <button className="nav-brand" data-cursor onClick={() => go("hero")}>
        <span className="nav-mark">SM</span>
        <span className="nav-name">Saubhagya Mishra</span>
      </button>
      <nav className="nav-links">
        {NAV.map((item, i) => (
          <button
            key={item.id}
            data-cursor
            className={`nav-link ${i === active ? "is-active" : ""}`}
            onClick={() => go(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
