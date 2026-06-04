"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "sm.desktop-hint.dismissed";

// Subtle one-time pill nudging mobile visitors toward the desktop SIGNAL
// experience. Persists dismissal in localStorage so it doesn't nag repeat
// visitors. Auto-fades in ~3.5s after first paint to avoid stealing focus
// from the hero.
export const DesktopHint = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") return undefined;
    } catch {
      /* localStorage unavailable — fall through and show once */
    }
    const t = window.setTimeout(() => setVisible(true), 3500);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] pointer-events-auto"
          data-testid="desktop-hint"
        >
          <div
            className="flex items-center gap-3 pl-4 pr-2 py-2 rounded-full border border-line-strong shadow-soft"
            style={{
              background: "rgba(251, 249, 244, 0.92)",
              backdropFilter: "blur(14px) saturate(140%)",
              WebkitBackdropFilter: "blur(14px) saturate(140%)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "var(--accent)" }}
              aria-hidden
            />
            <span className="label-mono text-[10px] text-ink-2 whitespace-nowrap">
              Best viewed on desktop · cinematic version awaits
            </span>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss desktop hint"
              data-testid="desktop-hint-dismiss"
              className="w-6 h-6 inline-flex items-center justify-center rounded-full text-muted hover:text-ink hover:bg-ink/5 transition-colors"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M2 2 L10 10 M10 2 L2 10" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
