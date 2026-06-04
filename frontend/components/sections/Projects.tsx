"use client";

import { memo, useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS, Project } from "@/lib/data";
import { useDeviceTier, usePrefersReducedMotion } from "@/lib/hooks";
import Scramble from "@/components/Scramble";

const DEPTH = 640; // px translateZ travel
const LATERAL = 46; // vw lateral sweep
const TURN = 26; // deg rotateY

function Motif({ theme, name }: { theme: Project["theme"]; name: string }) {
  if (theme === "sonic") {
    return (
      <div className="motif motif-sonic">
        <span className="sonic-ring" />
        <span className="sonic-ring" />
        <span className="sonic-ring" />
        <div className="sonic-wavewrap">
          <span className="sonic-wave" />
        </div>
      </div>
    );
  }
  if (theme === "lux") {
    return (
      <div className="motif motif-lux">
        <span className="lux-glow" />
        <span className="lux-sweep" />
        <span className="lux-arch" />
      </div>
    );
  }
  if (theme === "glitch") {
    return (
      <div className="motif motif-glitch">
        <span className="glitch-word" data-text={name}>
          {name}
        </span>
        <span className="glitch-scan" />
      </div>
    );
  }
  return (
    <div className="motif motif-neural">
      <svg className="neural-net" viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice">
        <g className="nn-links">
          <line x1="30" y1="30" x2="95" y2="60" />
          <line x1="95" y1="60" x2="60" y2="105" />
          <line x1="95" y1="60" x2="160" y2="40" />
          <line x1="160" y1="40" x2="150" y2="100" />
          <line x1="95" y1="60" x2="150" y2="100" />
          <line x1="30" y1="30" x2="60" y2="105" />
        </g>
        <g className="nn-nodes">
          <circle cx="30" cy="30" r="3" />
          <circle cx="95" cy="60" r="4.5" />
          <circle cx="60" cy="105" r="3" />
          <circle cx="160" cy="40" r="3" />
          <circle cx="150" cy="100" r="3" />
        </g>
        <circle className="nn-pulse" r="2.6" cx="0" cy="0" />
      </svg>
      <span className="neural-cursor">› running_</span>
    </div>
  );
}

function CardInner({ p }: { p: Project }) {
  return (
    <>
      <Motif theme={p.theme} name={p.name} />
      <span className="tile-scrim" />
      <span className="tile-body">
        <span className="tile-top">
          <span className="tile-index">{p.index}</span>
          <span className="tile-year">{p.year}</span>
        </span>
        <span className="tile-foot">
          <h3 className="tile-name" data-text={p.name}>
            {p.name}
          </h3>
          <span className="tile-kind">{p.kind}</span>
          <span className="tile-blurb">{p.blurb}</span>
          <span className="tile-stack">
            {p.stack.map((s) => (
              <span key={s} className="tile-tag">
                {s}
              </span>
            ))}
          </span>
          {p.href && (
            <span className="tile-cta">
              Visit site <span aria-hidden="true">↗</span>
            </span>
          )}
        </span>
      </span>
    </>
  );
}

function Projects({
  onHover,
}: {
  onHover: (i: number | null) => void;
}) {
  const tier = useDeviceTier();
  const reduced = usePrefersReducedMotion();
  const simple = tier === "low" || reduced;

  const rail = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const lastCenter = useRef(-1);

  useEffect(() => {
    if (simple) return;
    gsap.registerPlugin(ScrollTrigger);
    const N = PROJECTS.length;

    const apply = (prog: number) => {
      const t = prog * (N - 1);
      cards.current.forEach((el, i) => {
        if (!el) return;
        const d = t - i; // <0 incoming (deep), 0 center, >0 leaving (toward camera)
        const ad = Math.abs(d);
        const z = d < 0 ? d * DEPTH : d * DEPTH * 0.72;
        const x = -d * LATERAL; // in from the right, out to the left
        const y = d * 2.2;
        const ry = -d * TURN;
        const rz = d * 2.0;
        el.style.transform =
          `translate(-50%, -50%) translate3d(${x}vw, ${y}vh, ${z}px) ` +
          `rotateY(${ry}deg) rotateZ(${rz}deg)`;
        el.style.opacity =
          ad < 0.001 ? "1" : String(Math.max(0, 1 - Math.pow(ad / 1.35, 1.6)));
        el.style.filter = `blur(${Math.min(ad * 3.4, 7)}px)`;
        el.style.zIndex = String(Math.round(500 + d * 200));
        el.style.pointerEvents = ad < 0.45 ? "auto" : "none";
      });
      const center = Math.max(0, Math.min(N - 1, Math.round(t)));
      if (center !== lastCenter.current) {
        lastCenter.current = center;
        onHover(center);
        dots.current.forEach((dd, i) => dd && dd.classList.toggle("is-on", i === center));
      }
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
    const tm = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      clearTimeout(tm);
      ctx.revert();
      onHover(null);
    };
  }, [simple, onHover]);

  // ---------- fallback grid (mobile / reduced motion) ----------
  if (simple) {
    const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
    const pop: Variants = {
      hidden: { opacity: 0, y: 48, scale: 0.94 },
      show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    };
    return (
      <section id="projects" className="projects">
        <div className="projects-head">
          <p className="kicker">
            02 <span className="kicker-dash" /> <Scramble text="Selected Work" />
          </p>
          <h2 className="projects-title">Four builds, four worlds.</h2>
        </div>
        <motion.div
          className="proj-grid"
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          onMouseLeave={() => onHover(null)}
        >
          {PROJECTS.map((p, i) => {
            const Tag = (p.href ? "a" : "div") as React.ElementType;
            return (
              <motion.article
                key={p.id}
                className={`tile theme-${p.theme}`}
                style={{ ["--accent" as string]: p.accent }}
                variants={pop}
                onMouseEnter={() => onHover(i)}
                onFocus={() => onHover(i)}
              >
                <Tag
                  className="tile-card"
                  {...(p.href
                    ? { href: p.href, target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <CardInner p={p} />
                </Tag>
              </motion.article>
            );
          })}
        </motion.div>
      </section>
    );
  }

  // ---------- 3D card river ----------
  return (
    <section id="projects" className="projects projects-3d">
      <div className="work-rail" ref={rail}>
        <div className="work-stage" ref={stage}>
          <div className="work-head sticky-head">
            <p className="kicker">
              02 <span className="kicker-dash" /> <Scramble text="Selected Work" />
            </p>
            <h2 className="projects-title">Four builds, four worlds.</h2>
          </div>

          <div className="work-space">
            <div className="work-track">
              {PROJECTS.map((p, i) => {
                const Tag = (p.href ? "a" : "div") as React.ElementType;
                return (
                  <div
                    key={p.id}
                    className={`work-card theme-${p.theme}`}
                    style={{ ["--accent" as string]: p.accent }}
                    ref={(el) => {
                      cards.current[i] = el;
                    }}
                  >
                    <Tag
                      className="tile-card"
                      {...(p.href
                        ? { href: p.href, target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <CardInner p={p} />
                    </Tag>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="work-dots">
            {PROJECTS.map((p, i) => (
              <span
                key={p.id}
                className="work-dot"
                style={{ ["--accent" as string]: p.accent }}
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

export default memo(Projects);
