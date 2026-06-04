"use client";

import { useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion, useDeviceTier } from "@/lib/hooks";
import { scrollState } from "@/lib/scroll";
import Scramble from "@/components/Scramble";

// Register at module load — idempotent and avoids mount-order races on slow tiers.
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};
const lineUp: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function Identity() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const glitch = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const tier = useDeviceTier();
  const simple = reduced || tier === "low";

  // leave transition: the whole stage recedes as you scroll into Work
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(stage.current, {
        scale: 1.16,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "center center",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  // scroll-reactive signal glitch on the portrait
  useEffect(() => {
    if (simple) return;
    const el = glitch.current;
    if (!el) return;
    let raf = 0;
    let g = 0;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const t = now * 0.001;
      const vel = Math.min(Math.abs(scrollState.velocity) / 38, 1);
      // smooth follow of scroll energy
      g += vel > g ? (vel - g) * 0.3 : (vel - g) * 0.06;
      if (now - last < 58) return; // stepped, digital cadence
      last = now;
      const j = g;

      // always-on ambient chromatic shimmer (never fully zero) + rare blip
      const ambient = 1.4 + Math.sin(t * 2.7) * 0.9; // ~0.5 .. 2.3px
      const blip = Math.random() < 0.045 ? 2 + Math.random() * 3 : 0;
      const split = ambient + blip + j * 6.5;
      const jx = (Math.random() - 0.5) * (0.6 + j * 4);
      el.style.setProperty("--gr", `${(-split + jx).toFixed(2)}px`);
      el.style.setProperty("--gb", `${(split - jx).toFixed(2)}px`);
      el.style.setProperty(
        "--gy",
        `${(Math.sin(t * 3.3) * 0.6 + (Math.random() - 0.5) * j * 2.4).toFixed(2)}px`
      );

      // a refined signal tear, only on faster scroll and only occasionally
      if (j > 0.38 && Math.random() < 0.25) {
        const top = Math.random() * 80;
        const h = 3 + Math.random() * 9;
        el.style.setProperty("--b-top", `${top.toFixed(1)}%`);
        el.style.setProperty("--b-bot", `${(100 - top - h).toFixed(1)}%`);
        el.style.setProperty("--bx", `${((Math.random() - 0.5) * (8 + j * 18)).toFixed(1)}px`);
        el.style.setProperty("--bo", `${Math.min(0.25 + j * 0.5, 0.5).toFixed(2)}`);
      } else {
        el.style.setProperty("--bo", "0");
      }

      // static that always churns, intensifying with scroll
      el.style.setProperty("--noise", `${(j * 0.14).toFixed(3)}`);
      el.style.setProperty("--nx", `${Math.floor(Math.random() * 120)}px`);
      el.style.setProperty("--ny", `${Math.floor(Math.random() * 120)}px`);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [simple]);

  return (
    <section id="identity" className="identity" ref={section}>
      {/* channel-split filters for the glitch */}
      <svg className="sig-defs" aria-hidden="true" width="0" height="0">
        <filter id="sig-r" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
          />
        </filter>
        <filter id="sig-gb" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
          />
        </filter>
      </svg>

      <div className="identity-stage" ref={stage}>
        <div className="id-photo" aria-hidden="true">
          <motion.div
            className="id-photo-inner"
            initial={{ opacity: 0, scale: 1.06, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="id-stack" ref={glitch}>
              <img className="id-sizer" src="/portrait.webp" alt="" />
              <img className="id-layer id-r" src="/portrait.webp" alt="" />
              <img className="id-layer id-gb" src="/portrait.webp" alt="" />
              <img className="id-layer id-band" src="/portrait.webp" alt="" />
              <span className="id-layer id-static" />
              <span className="id-sweep" />
              <span className="id-layer id-scan" />
            </div>
          </motion.div>
        </div>

        <div className="identity-copy">
          <motion.div
            className="identity-inner"
            variants={group}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-18%" }}
          >
            <motion.p className="kicker" variants={fadeUp}>
              <Scramble text="01" /> <span className="kicker-dash" />{" "}
              <Scramble text="About" />
            </motion.p>

            <h2 className="identity-head">
              <span className="line-mask">
                <motion.span className="line" variants={lineUp}>
                  I&apos;m Saubhagya, a
                </motion.span>
              </span>
              <span className="line-mask">
                <motion.span className="line" variants={lineUp}>
                  <em>marketer who builds</em>.
                </motion.span>
              </span>
            </h2>

            <motion.p className="identity-body" variants={fadeUp}>
              A marketing analytics grad in Boston with the engineering to turn a
              strategy into a working system, from the campaign down to the code and
              automation.
            </motion.p>
            <motion.p className="identity-body dim" variants={fadeUp}>
              Marketing first. Built end to end.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
