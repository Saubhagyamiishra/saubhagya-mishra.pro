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
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

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

  // Auto-advance loop
  useEffect(() => {
    if (userTookOver || !inView) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % capabilities.length);
    }, AUTO_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [userTookOver, inView]);

  const handoff = useCallback((idx) => {
    setActiveIndex(idx);
    setUserTookOver(true);
  }, []);

  const active = capabilities[activeIndex];
  const ActiveVisual = VisualMap[active.id];

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

        {/* Mobile stage (≤1024px) — appears ABOVE the list */}
        <div className="lg:hidden mb-10">
          <div className="relative">
            <div className="font-fraunces text-[120px] leading-none tracking-tighter text-ink/10 absolute -top-6 -left-1 pointer-events-none select-none">
              {active.id}
            </div>
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id + '-m'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                >
                  {ActiveVisual ? <ActiveVisual /> : null}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/40 bg-accent/5 label-mono text-[10px] text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {active.code} · ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Split panel */}
        <div className="lg:grid lg:gap-16" style={{ gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)' }}>
          {/* LEFT — list */}
          <ul
            className="relative border-t border-line-strong"
            data-testid="capabilities-list"
            onMouseLeave={() => { /* no-op: handoff is permanent */ }}
          >
            {capabilities.map((cap, idx) => {
              const isActive = idx === activeIndex;
              return (
                <li
                  key={cap.id}
                  data-testid={`capability-row-${cap.id}`}
                  data-active={isActive}
                  onMouseEnter={() => handoff(idx)}
                  onClick={() => handoff(idx)}
                  className={[
                    'group relative border-b border-line-strong cursor-pointer overflow-hidden',
                    'transition-[height,background-color,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    isActive ? 'bg-paper' : 'hover:pl-3',
                  ].join(' ')}
                  style={{
                    height: isActive ? 124 : 70,
                  }}
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
                  <div className="relative h-full px-5 sm:px-7 flex items-center gap-6">
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
                    {/* Title + code */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={[
                          'font-fraunces font-medium leading-tight tracking-tight transition-all duration-500',
                          isActive ? 'text-2xl sm:text-3xl text-ink' : 'text-lg sm:text-xl text-ink/55 group-hover:text-ink/85',
                        ].join(' ')}
                      >
                        {cap.title}
                      </h3>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className="text-sm text-muted mt-1.5 hidden sm:block"
                        >
                          {cap.description}
                        </motion.p>
                      )}
                    </div>
                    <span
                      className={[
                        'label-mono text-[10px] hidden sm:block transition-colors duration-300',
                        isActive ? 'text-ink' : 'text-muted',
                      ].join(' ')}
                    >
                      {cap.code}
                    </span>
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
              {/* Tag */}
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/40 bg-accent/5 label-mono text-[10px] text-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {active.code} · ACTIVE
                </span>
                {!userTookOver && inView && (
                  <span className="label-mono text-[9px] text-muted">AUTO · CYCLING</span>
                )}
                {userTookOver && (
                  <span className="label-mono text-[9px] text-muted">MANUAL CONTROL</span>
                )}
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
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
