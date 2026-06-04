"use client";

import { useEffect, useState } from "react";

// Detects low-power / mobile so the WebGL scene can dial itself down.
// Resolves synchronously on the client (the page is loaded via `dynamic({ ssr: false })`
// so we can safely read window/navigator at module evaluation).
function detectTier(): "low" | "high" {
  if (typeof window === "undefined") return "high";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 820;
  const cores = (navigator as Navigator & { hardwareConcurrency?: number })
    .hardwareConcurrency;
  const fewCores = typeof cores === "number" && cores <= 4;
  return coarse || narrow || fewCores ? "low" : "high";
}

export function useDeviceTier() {
  const [tier] = useState<"low" | "high">(detectTier);
  return tier;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

// Returns true once the component has mounted on the client.
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
