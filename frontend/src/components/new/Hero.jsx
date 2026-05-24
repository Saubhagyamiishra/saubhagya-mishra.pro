import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ArrowRight } from '@phosphor-icons/react';

export const Hero = () => {
  const sectionRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    // Skip on touch / coarse-pointer devices
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(hover: none)').matches) return undefined;

    const section = sectionRef.current;
    const spotlight = spotlightRef.current;
    if (!section || !spotlight) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initial: centered glow
    let curX = 50;
    let curY = 40;
    let tgtX = 50;
    let tgtY = 40;
    spotlight.style.setProperty('--sx', '50%');
    spotlight.style.setProperty('--sy', '40%');

    let rafId = null;
    let lastMoveT = 0;

    const tick = () => {
      const dx = tgtX - curX;
      const dy = tgtY - curY;
      curX += dx * 0.12;
      curY += dy * 0.12;
      spotlight.style.setProperty('--sx', `${curX}%`);
      spotlight.style.setProperty('--sy', `${curY}%`);
      // settle threshold + idle stop
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05 || performance.now() - lastMoveT < 120) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const onMove = (e) => {
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (reducedMotion) {
        // No easing — snap once
        curX = x; curY = y;
        spotlight.style.setProperty('--sx', `${x}%`);
        spotlight.style.setProperty('--sy', `${y}%`);
        return;
      }
      tgtX = x;
      tgtY = y;
      lastMoveT = performance.now();
      if (rafId == null) rafId = requestAnimationFrame(tick);
    };

    const onEnter = () => spotlight.classList.add('lit');
    const onLeave = () => spotlight.classList.remove('lit');

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseenter', onEnter);
    section.addEventListener('mouseleave', onLeave);

    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseenter', onEnter);
      section.removeEventListener('mouseleave', onLeave);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Cursor-following spotlight (ambient layer, no pointer interception) */}
      <div ref={spotlightRef} className="hero-spotlight" aria-hidden="true" />

      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/30 blur-[100px]"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-2/30 blur-[100px]"
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 30, -20, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--ink) 1px, transparent 1px),
            linear-gradient(to bottom, var(--ink) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="space-y-8">
          {/* Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 border border-green/20"
          >
            <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
            <span className="label-mono text-green text-[10px]">
              Director of Digital Marketing · Mirsonics
            </span>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-fraunces font-light text-5xl sm:text-6xl lg:text-7xl leading-[0.96] tracking-[-0.045em] text-ink"
            >
              I build{' '}
              <span className="font-instrument italic">high-performance</span>{' '}
              <span className="relative inline-block">
                <span className="relative z-10">digital</span>
                <span className="absolute -bottom-1 left-0 right-0 h-[6px] bg-accent/30 -skew-x-6 rounded-sm" />
              </span>{' '}
              experiences that compound.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-ink-2 max-w-xl leading-relaxed"
            >
              Websites, web apps, dashboards, automation systems, and growth engines -
              designed at the intersection of creativity, strategy, and relentless execution.
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="btn-pill bg-ink text-paper hover:bg-gradient-to-r hover:from-accent hover:to-accent-2 group flex items-center gap-2 shadow-soft"
            >
              <span>View My Work</span>
              <ArrowRight
                weight="bold"
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="btn-pill bg-paper text-ink border border-line-strong hover:border-accent transition-all"
            >
              Work With Me
            </button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 border-l-2 border-accent pl-4 sm:pl-6"
          >
            <div>
              <div className="font-fraunces text-xl sm:text-2xl font-medium text-ink">12+</div>
              <div className="text-[10px] sm:text-xs text-muted">Digital Systems Built</div>
            </div>
            <div>
              <div className="font-fraunces text-xl sm:text-2xl font-medium text-ink">240%</div>
              <div className="text-[10px] sm:text-xs text-muted">Avg Engagement Lift</div>
            </div>
            <div>
              <div className="font-fraunces text-xl sm:text-2xl font-medium text-ink">6 yrs</div>
              <div className="text-[10px] sm:text-xs text-muted">Building & Operating</div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Floating Cards */}
        <div className="relative h-[500px] hidden lg:block">
          {/* Conversions Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute top-0 right-0 w-72 glass rounded-3xl p-6 shadow-soft"
            style={{
              animation: 'bob 5.5s ease-in-out infinite',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="label-mono text-muted mb-2">Conversions / 30d</div>
                <div className="font-fraunces text-4xl font-medium text-ink">38.4K</div>
              </div>
              <div className="px-3 py-1 rounded-full bg-green/10 border border-green/20">
                <span className="text-xs font-medium text-green">+182%</span>
              </div>
            </div>
            <svg className="w-full h-12" viewBox="0 0 200 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparkline" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0,30 L40,28 L80,20 L120,15 L160,10 L200,8"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1.2 }}
              />
              <motion.path
                d="M0,30 L40,28 L80,20 L120,15 L160,10 L200,8 L200,40 L0,40 Z"
                fill="url(#sparkline)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
              />
            </svg>
          </motion.div>

          {/* Funnel Health Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute top-40 left-0 w-64 glass rounded-3xl p-6 shadow-soft"
            style={{
              animation: 'bob 6.5s ease-in-out infinite',
            }}
          >
            <div className="label-mono text-muted mb-2">Funnel Health</div>
            <div className="font-fraunces text-4xl font-medium text-ink mb-4">92%</div>
            <div className="flex items-end gap-1 h-16">
              {[65, 78, 85, 92, 88, 95, 92].map((height, i) => (
                <motion.div
                  key={`funnel-bar-${i}`}
                  className={`flex-1 rounded-t ${i >= 5 ? 'bg-accent' : 'bg-ink/20'}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.6, delay: 1.4 + i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Active Stack Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute bottom-0 right-12 w-72 glass rounded-3xl p-6 shadow-soft"
            style={{
              animation: 'bob 7s ease-in-out infinite',
            }}
          >
            <div className="label-mono text-muted mb-3">Active Stack</div>
            <div className="text-sm text-ink-2 mb-4 leading-relaxed">
              Strategy → Design → Build → Optimize
            </div>
            <div className="flex flex-wrap gap-2">
              {['React', 'GA4', 'Webflow', 'Make', 'SEO', 'Figma'].map((tech) => (
                <span
                  key={tech}
                  className="label-mono text-[10px] px-2 py-1 rounded bg-ink/5 text-ink"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="label-mono text-muted text-[10px]">Scroll to explore</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-transparent via-accent to-transparent"
          animate={{ scaleY: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
};
