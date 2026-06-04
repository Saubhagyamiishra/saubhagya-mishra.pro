"use client";

import { useEffect, useRef } from "react";
import { STATUS, NAV } from "@/lib/data";
import { scrollState } from "@/lib/scroll";

const THRESHOLDS = [0.13, 0.26, 0.6, 0.95];

export default function StatusRail() {
  const pct = useRef<HTMLSpanElement>(null);
  const sec = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    let lastIdx = -1;
    const loop = () => {
      const p = scrollState.progress;
      if (pct.current) pct.current.textContent = `${Math.round(p * 100)}`.padStart(3, "0");
      if (bar.current) bar.current.style.transform = `scaleY(${0.15 + p * 0.85})`;
      let idx = THRESHOLDS.findIndex((t) => p < t);
      if (idx === -1) idx = NAV.length - 1;
      if (idx !== lastIdx && sec.current) {
        lastIdx = idx;
        sec.current.textContent = NAV[idx].label.toUpperCase();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <aside className="status">
      <span className="status-bar">
        <span ref={bar} className="status-bar-fill" />
      </span>
      <div className="status-body">
        {STATUS.map((s) => (
          <div key={s.k} className="status-row">
            <span className="status-k">{s.k}</span>
            <span className="status-v">{s.v}</span>
          </div>
        ))}
        <div className="status-row status-live">
          <span className="status-k">NOW</span>
          <span className="status-v">
            <span ref={sec}>SIGNAL</span> <span className="status-dim">/</span>{" "}
            <span ref={pct}>000</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
