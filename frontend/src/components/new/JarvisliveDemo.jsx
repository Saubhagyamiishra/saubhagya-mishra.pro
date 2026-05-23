import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ──────────────────────────────────────────────────────────────────────────────
// Pre-written canned outputs — this IS the whole "intelligence". Zero network.
// ──────────────────────────────────────────────────────────────────────────────
const PRESETS = [
  {
    id: 'cold-email',
    label: 'Draft a cold outreach email',
    prompt: 'Draft a cold email to a healthtech founder.',
    output:
      "Subject: A quieter way to convert your site traffic\n\nHi {Name},\n\nI noticed healthtech brands often lose visitors at the education stage. I help teams turn that drop-off into booked demos with conversion-engineered funnels.\n\nWorth a 15-min call this week?\n\n— Saubhagya",
  },
  {
    id: 'summary',
    label: 'Summarize an article into 3 points',
    prompt: 'Summarize this article into 3 sharp points.',
    output:
      '1. The core thesis in one line, stripped of filler.\n2. The single most important supporting fact.\n3. The actionable takeaway worth remembering.',
  },
  {
    id: 'report',
    label: 'Build a weekly marketing report',
    prompt: 'Build me this week’s marketing performance report.',
    output:
      'Weekly snapshot ready:\n• Traffic +18% WoW · 12.4K sessions\n• Conversion 3.9% (▲0.4pt)\n• Top channel: organic search\n• Flagged: paid CTR dipped 6% — recommend creative refresh.',
  },
  {
    id: 'lead',
    label: 'Qualify & route a new lead',
    prompt: 'Qualify this new inbound lead and route it.',
    output:
      "Lead scored 82/100 (hot). Budget + timeline match ICP.\nRouted to: Sales pipeline → 'Priority'.\nSlack alert sent · follow-up task created for tomorrow 9:00 AM.",
  },
];

const FALLBACK_OUTPUT =
  'Request processed. In the live system this routes through Claude, runs the matching n8n workflow, and returns a structured result — then logs it to your dashboard automatically.';

const STEPS = [
  { id: 'parse',   title: 'Parsing input',            code: 'intent.detect',  detail: 'tokenizing request',                       latency: 120 },
  { id: 'claude',  title: 'Routing to Claude',        code: 'claude.opus',    detail: 'building structured prompt + context',     latency: 540 },
  { id: 'n8n',     title: 'Running n8n workflow',     code: 'n8n.execute',    detail: 'node: transform → enrich → format',        latency: 760 },
  { id: 'db',      title: 'Writing to dashboard',     code: 'db.append',      detail: 'logging run + result',                     latency: 300 },
];

// Resolve the canned output for a free-text request: try preset match by keywords, else fallback.
const resolveOutput = (text) => {
  const t = (text || '').toLowerCase();
  if (/email|outreach|cold/.test(t)) return PRESETS[0].output;
  if (/summar|tl;dr|3 (points|bullets)/.test(t)) return PRESETS[1].output;
  if (/report|weekly|snapshot|performance/.test(t)) return PRESETS[2].output;
  if (/lead|qualif|route|inbound/.test(t)) return PRESETS[3].output;
  return FALLBACK_OUTPUT;
};

const LedDot = ({ state }) => (
  <span className="relative inline-flex w-2 h-2">
    <span
      className={[
        'absolute inset-0 rounded-full',
        state === 'executing' && 'bg-[#ffb547] animate-ping',
        state === 'done'      && 'bg-[#34d399]',
        state === 'idle'      && 'bg-white/20',
      ].filter(Boolean).join(' ')}
    />
    <span
      className={[
        'relative w-2 h-2 rounded-full',
        state === 'executing' && 'bg-[#ffb547] shadow-[0_0_8px_rgba(255,181,71,0.8)]',
        state === 'done'      && 'bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.7)]',
        state === 'idle'      && 'bg-white/30',
      ].filter(Boolean).join(' ')}
    />
  </span>
);

export const JarvisliveDemo = () => {
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState('idle'); // 'idle' | 'running' | 'done'
  const [stepStates, setStepStates] = useState(STEPS.map(() => ({ status: 'pending', ms: null })));
  // status: 'pending' | 'executing' | 'done'
  const [output, setOutput] = useState('');
  const [typed, setTyped] = useState('');
  const timersRef = useRef([]);
  const typeTimerRef = useRef(null);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    typeTimerRef.current = null;
  };

  useEffect(() => clearTimers, []);

  const runPipeline = useCallback((text) => {
    clearTimers();
    const finalOutput = resolveOutput(text);
    setOutput(finalOutput);
    setTyped('');

    // Reduced motion: skip steps + typewriter, show final state immediately.
    if (reducedMotion) {
      setStepStates(STEPS.map((s) => ({ status: 'done', ms: s.latency })));
      setTyped(finalOutput);
      setPhase('done');
      return;
    }

    setPhase('running');
    setStepStates(STEPS.map(() => ({ status: 'pending', ms: null })));

    let cursor = 0;
    const schedule = (i) => {
      // start step i
      const startT = setTimeout(() => {
        setStepStates((prev) => {
          const next = [...prev];
          next[i] = { status: 'executing', ms: null };
          return next;
        });
      }, cursor);
      timersRef.current.push(startT);

      cursor += STEPS[i].latency;

      // finish step i
      const finishT = setTimeout(() => {
        setStepStates((prev) => {
          const next = [...prev];
          next[i] = { status: 'done', ms: STEPS[i].latency };
          return next;
        });
      }, cursor);
      timersRef.current.push(finishT);

      cursor += 80; // small gap between steps
    };

    for (let i = 0; i < STEPS.length; i++) schedule(i);

    // After all steps, typewriter the output
    const beginType = setTimeout(() => {
      setPhase('done');
      let idx = 0;
      typeTimerRef.current = setInterval(() => {
        idx += 1;
        setTyped(finalOutput.slice(0, idx));
        if (idx >= finalOutput.length) {
          clearInterval(typeTimerRef.current);
          typeTimerRef.current = null;
        }
      }, 14);
    }, cursor + 120);
    timersRef.current.push(beginType);
  }, [reducedMotion]);

  const handleRun = () => {
    if (phase === 'running') return;
    const text = input.trim() || 'Run Jarvislive.';
    runPipeline(text);
  };

  const handlePreset = (p) => {
    if (phase === 'running') return;
    setInput(p.prompt);
    // small UX delay so the user sees the textarea fill, then run
    setTimeout(() => runPipeline(p.prompt), 120);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  const headerState =
    phase === 'idle' ? 'idle' : phase === 'running' ? 'executing' : 'done';

  return (
    <section
      id="jarvislive"
      data-testid="jarvislive-section"
      className="relative py-32 bg-ink text-paper overflow-hidden"
    >
      {/* subtle grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        aria-hidden
        className="absolute -top-32 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(closest-side, rgba(255,90,31,0.18), transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="label-mono text-paper/50 mb-5"
        >
          Jarvislive · Live Demo
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-paper max-w-4xl"
        >
          Don&apos;t take my word for it.{' '}
          <span className="italic text-accent">Run it.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 text-paper/65 max-w-2xl leading-relaxed"
        >
          Jarvislive is my personal AI automation system — n8n wired into Claude. Type a
          request or pick one and watch the pipeline execute, step by step. This is a
          sandboxed simulation of the real flow.
        </motion.p>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6 lg:gap-8">
          {/* LEFT — control panel */}
          <div
            data-testid="jarvislive-control-panel"
            className="rounded-3xl bg-[#1a1816] border border-white/8 p-6 lg:p-8 flex flex-col"
          >
            <label
              htmlFor="jarvis-input"
              className="label-mono text-[10px] text-paper/45 mb-3"
            >
              Your request
            </label>
            <textarea
              id="jarvis-input"
              data-testid="jarvislive-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={5}
              placeholder="e.g. Draft a cold email to a healthtech founder..."
              disabled={phase === 'running'}
              className="w-full px-4 py-3 bg-black/40 rounded-xl border border-white/10 focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none transition-all text-paper placeholder:text-paper/30 font-mono text-sm resize-none disabled:opacity-50"
            />

            <button
              type="button"
              data-testid="jarvislive-run"
              onClick={handleRun}
              disabled={phase === 'running'}
              className="mt-5 group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-accent text-paper font-medium shadow-soft hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {phase === 'running' ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeDasharray="40" strokeDashoffset="20" strokeLinecap="round" opacity="0.7" />
                  </svg>
                  <span>Running</span>
                </>
              ) : phase === 'done' ? (
                <>
                  <span>Run again</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
                    <path d="M21 3v5h-5" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Run Jarvislive</span>
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>

            <div className="mt-7">
              <div className="label-mono text-[10px] text-paper/40 mb-3">
                Or try one of these
              </div>
              <div className="grid gap-2">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    data-testid={`jarvislive-preset-${p.id}`}
                    onClick={() => handlePreset(p)}
                    disabled={phase === 'running'}
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 hover:border-accent/40 hover:bg-white/[0.05] transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="label-mono text-[10px] text-paper/40 w-5 shrink-0">
                      0{i + 1}
                    </span>
                    <span className="text-sm text-paper/85 group-hover:text-paper transition-colors flex-1">
                      {p.label}
                    </span>
                    <svg className="w-3.5 h-3.5 text-paper/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 label-mono text-[9px] text-paper/30">
              ⌘/Ctrl + Enter to run
            </div>
          </div>

          {/* RIGHT — terminal */}
          <div
            data-testid="jarvislive-terminal"
            className="rounded-3xl bg-[#0b0a09] border border-white/8 overflow-hidden flex flex-col min-h-[480px] lg:min-h-[560px]"
          >
            {/* terminal header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/8 bg-white/[0.02]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="font-mono text-[11px] text-paper/45 ml-2">
                jarvislive ~ pipeline
              </span>
              <div className="ml-auto flex items-center gap-2">
                <LedDot state={headerState} />
                <span
                  data-testid="jarvislive-status"
                  className={[
                    'label-mono text-[9px]',
                    headerState === 'idle' && 'text-paper/40',
                    headerState === 'executing' && 'text-[#ffb547]',
                    headerState === 'done' && 'text-[#34d399]',
                  ].filter(Boolean).join(' ')}
                >
                  {headerState === 'idle' && 'IDLE'}
                  {headerState === 'executing' && 'EXECUTING'}
                  {headerState === 'done' && 'DONE'}
                </span>
              </div>
            </div>

            {/* terminal body */}
            <div className="relative flex-1 px-6 py-6 font-mono text-[12.5px] leading-relaxed">
              {phase === 'idle' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-paper/40">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M13 2 L4 14 h7 l-2 8 9-12 h-7 z" />
                  </svg>
                  <div className="flex items-center label-mono text-[10px] tracking-[0.25em]">
                    Waiting for a request
                    <span className="ml-1 inline-block w-1.5 h-3 bg-paper/50" style={{ animation: 'jarvis-blink 0.9s steps(2) infinite' }} />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* vertical connector rail */}
                  <span aria-hidden className="absolute left-[7px] top-2 bottom-4 w-px bg-white/10" />
                  <ul className="space-y-3.5">
                    {STEPS.map((s, i) => {
                      const st = stepStates[i].status;
                      const ms = stepStates[i].ms;
                      return (
                        <li
                          key={s.id}
                          data-testid={`jarvislive-step-${s.id}`}
                          data-status={st}
                          className="relative pl-7"
                        >
                          <span className="absolute left-0 top-1.5">
                            <LedDot state={st === 'pending' ? 'idle' : st === 'executing' ? 'executing' : 'done'} />
                          </span>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className={[
                              'transition-colors',
                              st === 'pending'   && 'text-paper/35',
                              st === 'executing' && 'text-paper',
                              st === 'done'      && 'text-paper/80',
                            ].filter(Boolean).join(' ')}>
                              {s.title}
                            </span>
                            <span className="text-paper/30">·</span>
                            <span className="text-[#ffb547]/80">{s.code}</span>
                            {st === 'done' && (
                              <span className="text-[#34d399]/80 ml-1">
                                ✓ · <span className="text-paper/40">{ms}ms</span>
                              </span>
                            )}
                          </div>
                          <div className={[
                            'text-paper/40 text-[11.5px] mt-0.5',
                            st === 'pending' && 'opacity-40',
                          ].filter(Boolean).join(' ')}>
                            {s.detail}
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* output block */}
                  <AnimatePresence>
                    {phase === 'done' && (
                      <motion.div
                        data-testid="jarvislive-output"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="mt-6 rounded-xl border border-[#34d399]/40 bg-[#34d399]/[0.06] p-4"
                      >
                        <div className="flex items-center gap-2 mb-2 label-mono text-[10px] text-[#34d399]">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M5 12l5 5 9-11" />
                          </svg>
                          OUTPUT READY
                        </div>
                        <pre className="whitespace-pre-wrap text-paper/90 font-mono text-[12.5px] leading-relaxed">
                          {typed}
                          {typed.length < output.length && (
                            <span className="inline-block w-1.5 h-3 bg-paper/70 align-middle ml-0.5" style={{ animation: 'jarvis-blink 0.9s steps(2) infinite' }} />
                          )}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 label-mono text-[10px] text-paper/35 text-center lg:text-left">
          Simulated demo · the real Jarvislive runs on n8n + Claude.
        </div>
      </div>

      <style>{`@keyframes jarvis-blink { 50% { opacity: 0; } }`}</style>
    </section>
  );
};
