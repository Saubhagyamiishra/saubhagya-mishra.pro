"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setProgress, setPointer, lenisRef } from "../lib/scroll";
import { usePrefersReducedMotion } from "../lib/hooks";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: reduced ? 0.1 : 1.15,
      smoothWheel: !reduced,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
    lenisRef.current = lenis;

    lenis.on("scroll", (e: { progress: number; velocity: number }) => {
      setProgress(e.progress, e.velocity);
      ScrollTrigger.update();
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // pointer parallax, eased toward target each frame
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const onMove = (ev: PointerEvent) => {
      tx = (ev.clientX / window.innerWidth) * 2 - 1;
      ty = (ev.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const pointerRaf = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      setPointer(cx, cy);
    };
    gsap.ticker.add(pointerRaf);

    // settle layout once everything has mounted
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      clearTimeout(refresh);
      gsap.ticker.remove(raf);
      gsap.ticker.remove(pointerRaf);
      window.removeEventListener("pointermove", onMove);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  return <>{children}</>;
}
