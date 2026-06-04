"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks";
import Scramble from "@/components/Scramble";

// Register at module load — idempotent and avoids mount-order races on slow tiers.
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const dive = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(dive.current, {
        scale: 2.6,
        opacity: 0,
        filter: "blur(8px)",
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      gsap.to(cue.current, {
        opacity: 0,
        y: 20,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section id="hero" ref={root} className="hero">
      <div className="hero-sticky">
        <div ref={dive} className="hero-dive">
          <motion.p className="hero-kicker" {...enter(0.1)}>
            Builder <span>/</span> Marketer <span>/</span> Automation
          </motion.p>

          <h1 className="hero-name">
            <motion.span className="hero-line" {...enter(0.2)}>
              <Scramble text="Saubhagya" start="trigger" trigger={ready} duration={950} />
            </motion.span>
            <motion.span className="hero-line hero-line-2" {...enter(0.32)}>
              <Scramble
                text="Mishra"
                start="trigger"
                trigger={ready}
                duration={950}
                delay={180}
              />
            </motion.span>
          </h1>

          <motion.p className="hero-sub" {...enter(0.5)}>
            Marketing, analytics and AI, wired into one signal.
          </motion.p>
        </div>

        <motion.div
          ref={cue}
          className="hero-cue"
          {...enter(0.9)}
          data-cursor
        >
          <span className="hero-cue-line" />
          <span>Scroll to enter</span>
        </motion.div>
      </div>
    </section>
  );
}
