"use client";

import { memo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SKILLS } from "../../lib/data";
import { useDeviceTier, usePrefersReducedMotion } from "../../lib/hooks";
import Scramble from "../Scramble";

const R = 460; // carousel radius
const SWEEP = 300; // total degrees revolved across the scroll

function Skills() {
  const tier = useDeviceTier();
  const reduced = usePrefersReducedMotion();
  const simple = tier === "low" || reduced;

  const rail = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const carousel = useRef<HTMLDivElement>(null);
  const clusters = useRef<(HTMLDivElement | null)[]>([]);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (simple) return;
    gsap.registerPlugin(ScrollTrigger);
    const n = SKILLS.length;

    const apply = (p: number) => {
      const rot = -p * SWEEP;
      if (carousel.current) {
        carousel.current.style.transform = `translateZ(-${R}px) rotateY(${rot}deg)`;
      }
      clusters.current.forEach((el, i) => {
        if (!el) return;
        let a = (i * 60 + rot) % 360;
        if (a > 180) a -= 360;
        if (a < -180) a += 360;
        const facing = Math.cos((a * Math.PI) / 180); // 1 front, -1 back
        const f = Math.max(facing, 0); // hide the back hemisphere entirely
        el.style.opacity = String(Math.pow(f, 1.2));
        el.style.filter = `blur(${(1 - f) * 4}px)`;
        el.style.zIndex = String(Math.round((facing + 1) * 50));
      });
      const active = Math.round(p * (n - 1));
      dots.current.forEach((d, i) => d && d.classList.toggle("is-on", i === active));
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rail.current,
        start: "top top",
        end: "bottom bottom",
        pin: stage.current,
        pinSpacing: false,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
    }, rail);

    apply(0);
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [simple]);

  // -------- reduced-motion / mobile fallback --------
  if (simple) {
    return (
      <section id="skills" className="skills">
        <span className="skills-bg" aria-hidden="true" />
        <div className="skills-head">
          <p className="kicker">
            03 <span className="kicker-dash" /> <Scramble text="Skills & Tools" />
          </p>
          <h2 className="skills-title">Not just a marketer. I build the whole thing.</h2>
        </div>
        <div className="sf-grid">
          {SKILLS.map((c) => (
            <motion.div
              key={c.title}
              className="sf-cat"
              style={{ ["--accent" as string]: c.accent }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7 }}
            >
              <div className="sf-head">
                <span className="sf-num">{c.n}</span>
                <h3 className="sf-title">{c.title}</h3>
              </div>
              <div className="sf-tools">
                {c.tools.map((t) => (
                  <span key={t} className="sf-chip">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // -------- 3D revolving experience --------
  return (
    <section id="skills" className="skills skills-3d">
      <div className="skills-rail" ref={rail}>
        <div className="skills-stage" ref={stage}>
          <span className="skills-bg" aria-hidden="true" />
          <div className="skills-head sticky-head">
            <p className="kicker">
              03 <span className="kicker-dash" /> <Scramble text="Skills & Tools" />
            </p>
            <h2 className="skills-title">Not just a marketer. I build the whole thing.</h2>
          </div>

          <div className="skills-space" aria-hidden="false">
            <div
              className="skills-carousel"
              ref={carousel}
              style={{ transform: `translateZ(-${R}px) rotateY(0deg)` }}
            >
              {SKILLS.map((c, i) => (
                <div
                  key={c.title}
                  className="cluster"
                  ref={(el) => {
                    clusters.current[i] = el;
                  }}
                  style={{
                    ["--accent" as string]: c.accent,
                    transform: `translate(-50%, -50%) rotateY(${i * 60}deg) translateZ(${R}px)`,
                  }}
                >
                  <div className="cluster-inner">
                    <span className="cluster-num">{c.n}</span>
                    <h3 className="cluster-title">{c.title}</h3>
                    <ul className="cluster-tools">
                      {c.tools.map((t) => (
                        <li key={t} className="ctool">
                          <span className="ctool-dot" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="skills-dots">
            {SKILLS.map((c, i) => (
              <span
                key={c.title}
                className="skills-dot"
                style={{ ["--accent" as string]: c.accent }}
                ref={(el) => {
                  dots.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Skills);
