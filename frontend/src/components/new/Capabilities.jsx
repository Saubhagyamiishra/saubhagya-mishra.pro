import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { VisualMap } from './CapabilityVisuals';

const capabilities = [
  { id: '01', code: 'WEB',    title: 'Website Development',    description: 'Conversion-engineered marketing sites with measurable outcomes — from architecture to deploy.' },
  { id: '02', code: 'APP',    title: 'Web App Development',    description: 'Interactive product experiences with React, Next.js, and clean API contracts.' },
  { id: '03', code: 'UX',     title: 'UX / UI Design',         description: 'Interface systems built for clarity, conversion, and craft. Wireframe to ship.' },
  { id: '04', code: 'STRAT',  title: 'Product Strategy',       description: 'Positioning, narrative, and roadmap thinking — turning ambition into a sequenced plan.' },
  { id: '05', code: 'MKT',    title: 'Digital Marketing',      description: 'SEO, paid, content, lifecycle — orchestrated as one engine, not siloed channels.' },
  { id: '06', code: 'DATA',   title: 'Analytics & Dashboards', description: 'GA4, Looker, custom dashboards that drive decisions instead of decorating slides.' },
  { id: '07', code: 'AUTO',   title: 'Automation Systems',     description: 'Make, Zapier, custom scripts — wiring your tools into one fast, observable stack.' },
  { id: '08', code: 'FUNNEL', title: 'Funnel Building',        description: 'From cold traffic to repeat customer — the whole flow mapped, instrumented, optimized.' },
  { id: '09', code: 'AI',     title: 'AI Prompt Engineering',  description: 'LLM workflows that ship real outcomes: structured prompts, evals, guardrails.' },
  { id: '10', code: 'PERF',   title: 'Performance Optimization', description: 'Core Web Vitals, conversion rate, ROAS — measurably and demonstrably better.' },
  { id: '11', code: 'VIZ',    title: 'Data Visualization',     description: 'Turning complex metrics into interfaces people actually use and remember.' },
  { id: '12', code: 'BRAND',  title: 'Brand Experience',       description: 'Identity, voice, and motion — designed to feel inevitable across every touchpoint.' },
];

const AUTO_INTERVAL_MS = 2600;

export const Capabilities = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [userTookOver, setUserTookOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  // Detect mobile/touch (≤1024px OR coarse pointer) — disables auto-advance,
  // hover handoff, keyboard nav, and switches the list into a true accordion.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(max-width: 1023px), (hover: none)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // IntersectionObserver — only auto-advance when section is visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => setInView(e.isIntersecting)),
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Auto-advance loop — desktop only; disabled if user took over, paused, or out of view
  useEffect(() => {
    if (isMobile || userTookOver || isPaused || !inView) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % capabilities.length);
    }, AUTO_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [isMobile, userTookOver, isPaused, inView]);

  const handoff = useCallback((idx) => {
    setActiveIndex(idx);
    setUserTookOver(true);
  }, []);

  // Keyboard navigation — desktop only, when section is in view and focus is outside inputs
  useEffect(() => {
    if (!inView || isMobile) return undefined;
    const onKey = (e) => {
      const tag = (e.target?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setUserTookOver(true);
        setActiveIndex((i) => (i + 1) % capabilities.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setUserTookOver(true);
        setActiveIndex((i) => (i - 1 + capabilities.length) % capabilities.length);
      } else if (e.key === ' ' && document.activeElement === document.body) {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inView, isMobile]);

  const togglePlayback = () => {
    if (userTookOver) {
      // Resume auto-cycle
      setUserTookOver(false);
      setIsPaused(false);
    } else {
      setIsPaused((p) => !p);
    }
  };

  const active = capabilities[activeIndex];
  const ActiveVisual = VisualMap[active.id];
  const isAutoPlaying = !userTookOver && !isPaused && inView;

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="relative py-32 bg-bg"
      data-testid="capabilities-section"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="label-mono text-muted mb-6"
        >
          Capabilities · 12 disciplines
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-ink max-w-4xl mb-16"
        >
          What I build, ship,<br />and optimize.
        </motion.h2>

        {/* Split panel */}
        <div className="lg:grid lg:gap-16" style={{ gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)' }}>
          {/* LEFT — list (accordion on mobile, side-by-side on desktop) */}
          <ul
            className="relative border-t border-line-strong"
            data-testid="capabilities-list"
          >
            {capabilities.map((cap, idx) => {
              const isActive = idx === activeIndex;
              const RowVisual = VisualMap[cap.id];
              return (
                <li
                  key={cap.id}
                  data-testid={`capability-row-${cap.id}`}
                  data-active={isActive}
                  onMouseEnter={isMobile ? undefined : () => handoff(idx)}
                  onClick={() => handoff(idx)}
                  className={[
                    'group relative border-b border-line-strong cursor-pointer',
                    'lg:overflow-hidden lg:transition-[height,background-color,padding] lg:duration-500 lg:ease-[cubic-bezier(0.22,1,0.36,1)]',
                    isActive ? 'bg-paper' : 'lg:hover:pl-3',
                  ].join(' ')}
                  style={isMobile ? undefined : { height: isActive ? 124 : 70 }}
                >
                  {/* Orange sidebar */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent origin-top transition-transform duration-500"
                    style={{ transform: isActive ? 'scaleY(1)' : 'scaleY(0)' }}
                  />
                  {/* Accent glow wipe */}
                  <span
                    aria-hidden
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                      opacity: isActive ? 1 : 0,
                      background:
                        'linear-gradient(90deg, var(--accent-glow) 0%, rgba(255,90,31,0) 60%)',
                    }}
                  />
                  {/* Title bar */}
                  <div className="relative h-[70px] lg:h-full px-5 sm:px-7 flex items-center gap-6">
                    {/* Index */}
                    <span
                      className={[
                        'label-mono text-[10px] w-7 shrink-0 transition-colors duration-300',
                        isActive ? 'text-accent' : 'text-muted group-hover:text-ink-2',
                      ].join(' ')}
                    >
                      {cap.id}
                    </span>
                    {/* Glowing dot */}
                    <span className="relative w-2 h-2 shrink-0">
                      <span
                        className={[
                          'absolute inset-0 rounded-full transition-colors duration-300',
                          isActive ? 'bg-accent' : 'bg-line-strong group-hover:bg-ink-2',
                        ].join(' ')}
                      />
                      {isActive && (
                        <span className="absolute -inset-1.5 rounded-full bg-accent/30 animate-ping" />
                      )}
                    </span>
                    {/* Title + (desktop-only inline description) */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={[
                          'font-fraunces font-medium leading-tight tracking-tight transition-all duration-500',
                          isActive
                            ? 'text-xl sm:text-2xl lg:text-3xl text-ink'
                            : 'text-lg sm:text-xl text-ink/55 group-hover:text-ink/85',
                        ].join(' ')}
                      >
                        {cap.title}
                      </h3>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className="text-sm text-muted mt-1.5 hidden sm:block lg:block"
                        >
                          {cap.description}
                        </motion.p>
                      )}
                    </div>
                    {/* Right side: desktop code label */}
                    <span
                      className={[
                        'label-mono text-[10px] hidden sm:block lg:block transition-colors duration-300',
                        isActive ? 'text-ink' : 'text-muted',
                      ].join(' ')}
                    >
                      {cap.code}
                    </span>
                    {/* Mobile-only chevron — signals accordion */}
                    <span className="lg:hidden shrink-0" aria-hidden>
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.4"
                        strokeLinecap="round" strokeLinejoin="round"
                        className={[
                          'transition-transform duration-300',
                          isActive ? 'rotate-180 text-accent' : 'text-muted',
                        ].join(' ')}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </div>

                  {/* Mobile-only inline expansion: description + framed visual */}
                  <div className="lg:hidden">
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          key={`${cap.id}-expand`}
                          initial={{ opacity: 0, y: 10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -6, height: 0 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: 'hidden' }}
                          data-testid={`capability-row-expansion-${cap.id}`}
                        >
                          <div className="px-5 sm:px-7 pb-6 pt-1">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-accent/40 bg-accent/5 label-mono text-[9px] text-accent">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                {cap.code} · ACTIVE
                              </span>
                            </div>
                            <p className="text-sm text-ink-2 leading-relaxed mb-4">
                              {cap.description}
                            </p>
                            <div className="rounded-2xl bg-paper border border-line-strong p-4 shadow-soft">
                              <div className="mx-auto" style={{ maxWidth: '240px' }}>
                                {RowVisual ? <RowVisual /> : null}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* RIGHT — sticky stage */}
          <div className="relative hidden lg:block">
            <div
              className="sticky top-28"
              data-testid="capabilities-stage"
              onMouseEnter={() => setUserTookOver(true)}
            >
              {/* Tag + playback controls */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/40 bg-accent/5 label-mono text-[10px] text-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {active.code} · ACTIVE
                </span>

                {/* Play / Pause button */}
                <button
                  type="button"
                  data-testid="capability-play-toggle"
                  onClick={togglePlayback}
                  aria-label={isAutoPlaying ? 'Pause autoplay' : 'Resume autoplay'}
                  className="group inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-line-strong hover:border-ink/40 bg-paper hover:bg-bg-2 transition-all"
                >
                  {isAutoPlaying ? (
                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" aria-hidden>
                      <rect x="0" y="0" width="3" height="10" rx="0.5" fill="currentColor" />
                      <rect x="6" y="0" width="3" height="10" rx="0.5" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" aria-hidden>
                      <path d="M0 0 L9 5 L0 10 Z" fill="currentColor" />
                    </svg>
                  )}
                  <span className="label-mono text-[9px] text-ink-2 group-hover:text-ink">
                    {isAutoPlaying ? 'PAUSE' : userTookOver ? 'RESUME AUTO' : 'PLAY'}
                  </span>
                </button>

                {/* Position counter */}
                <span className="label-mono text-[9px] text-muted ml-auto">
                  {String(activeIndex + 1).padStart(2, '0')} / {capabilities.length}
                </span>
              </div>

              {/* Large faded index */}
              <div className="relative -mb-6 pointer-events-none select-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 0.07, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5 }}
                    className="font-fraunces text-[180px] leading-none tracking-tighter text-ink"
                  >
                    {active.id}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Visual */}
              <div className="relative mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.99 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ActiveVisual ? <ActiveVisual /> : null}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Title + description */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                >
                  <h3 className="font-fraunces text-3xl font-medium text-ink mb-3 leading-tight tracking-tight">
                    {active.title}
                  </h3>
                  <p className="text-base text-muted leading-relaxed max-w-md">
                    {active.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="mt-8 flex flex-wrap gap-1.5" data-testid="capabilities-progress">
                {capabilities.map((c, i) => (
                  <button
                    key={c.id}
                    aria-label={`Go to capability ${c.id}`}
                    data-testid={`progress-dot-${c.id}`}
                    onClick={() => handoff(i)}
                    className={[
                      'h-1 rounded-full transition-all duration-500',
                      i === activeIndex ? 'w-8 bg-accent' : 'w-3 bg-line-strong hover:bg-ink/40',
                    ].join(' ')}
                  />
                ))}
              </div>

              {/* Keyboard hint */}
              <div className="mt-5 flex items-center gap-2 text-muted">
                <kbd className="px-1.5 py-0.5 rounded border border-line-strong bg-paper label-mono text-[9px] text-ink-2">←</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-line-strong bg-paper label-mono text-[9px] text-ink-2">→</kbd>
                <span className="label-mono text-[9px]">to navigate ·</span>
                <kbd className="px-1.5 py-0.5 rounded border border-line-strong bg-paper label-mono text-[9px] text-ink-2">SPACE</kbd>
                <span className="label-mono text-[9px]">to pause</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
