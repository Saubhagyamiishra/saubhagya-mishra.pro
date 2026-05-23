import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';

// ──────────────────────────────────────────────────────────────────────────────
// Hidden Easter Egg — "Lab Mode"
//   Trigger A · Konami: ↑ ↑ ↓ ↓ ← → ← → B A
//   Trigger B · Typed:  "labmode" (ignored while focus is in input/textarea)
// Pure self-contained component. No deps. No traces in the rest of the UI.
// ──────────────────────────────────────────────────────────────────────────────

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

const TYPED_WORD = 'labmode';

const BOOT_LINES = [
  { text: '> initializing saubhagya.os ...',                           kind: 'cmd',    pauseAfter: 130 },
  { text: '> loading modules: [strategy] [design] [build] [automate]', kind: 'cmd',    pauseAfter: 130 },
  { text: '    build      ............... ok',                         kind: 'ok',     pauseAfter: 130 },
  { text: '    ship       ............... ok',                         kind: 'ok',     pauseAfter: 130 },
  { text: '    compound   ............... ok',                         kind: 'ok',     pauseAfter: 130 },
  { text: '> mounting jarvislive engine ... online',                   kind: 'accent', pauseAfter: 130 },
  { text: '> all lab experiments set to: LIVE',                        kind: 'accent', pauseAfter: 260 },
  { text: '',                                                          kind: 'blank',  pauseAfter: 120 },
  { text: 'you found the secret. nice.',                               kind: 'prose',  pauseAfter: 260 },
  { text: 'people who poke at things tend to build great ones.',       kind: 'prose',  pauseAfter: 260 },
  { text: 'so — what are we building?',                                kind: 'cta',    pauseAfter: 0   },
];

const COLOR_FOR_KIND = {
  cmd:    '#5ec98a',         // dim terminal green
  ok:     '#e6f4ea',         // near-white
  accent: '#ffb547',         // accent-2 amber
  prose:  '#9ae0b6',         // soft green
  cta:    '#ffb547',         // accent-2 amber
  blank:  'transparent',
};

const CHAR_DELAY_CMD   = 10;
const CHAR_DELAY_PROSE = 16;

// ──────────────────────────────────────────────────────────────────────────────
// Confetti (hand-rolled, ~36 pieces)
// ──────────────────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#ff5a1f', '#ffb547', '#5ec98a', '#f4f1ea'];

const Confetti = memo(function Confetti() {
  // Generate pieces ONCE per mount — never on parent re-render
  const pieces = useMemo(() => Array.from({ length: 36 }, (_, i) => {
    const left = Math.random() * 100;
    const dur = 1.6 + Math.random() * 1.6;
    const delay = Math.random() * 0.6;
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const size = 6 + Math.random() * 6;
    const rot = Math.random() * 360;
    const drift = (Math.random() - 0.5) * 80;
    return { i, left, dur, delay, color, size, rot, drift };
  }), []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.i}
          style={{
            position: 'absolute',
            top: '-5%',
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.4}px`,
            background: p.color,
            transform: `rotate(${p.rot}deg)`,
            animation: `labmode-fall ${p.dur}s ${p.delay}s linear forwards`,
            ['--drift']: `${p.drift}px`,
            opacity: 0.95,
            borderRadius: '1px',
          }}
        />
      ))}
    </div>
  );
});

export const LabModeEasterEgg = () => {
  const [open, setOpen] = useState(false);
  const [typedLines, setTypedLines] = useState([]); // committed lines [{text, kind}, ...]
  const [finished, setFinished] = useState(false);
  const keyBufferRef = useRef([]);   // last 10 keys for konami
  const letterBufferRef = useRef(''); // last N letters for "labmode"
  const animTimersRef = useRef([]);
  const currentTextRef = useRef(null);   // DOM node for in-progress text
  const currentCaretRef = useRef(null);  // DOM node for in-progress caret
  const currentKindRef = useRef('cmd');

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clearAnimTimers = () => {
    animTimersRef.current.forEach(clearTimeout);
    animTimersRef.current = [];
  };

  const close = useCallback(() => {
    setOpen(false);
    clearAnimTimers();
    setTypedLines([]);
    setFinished(false);
  }, []);

  const goToContact = () => {
    close();
    setTimeout(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  // ─── Listener: konami + typed fallback ────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      // Escape closes immediately if open
      if (open && e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (open) return; // no other tracking while open

      const k = e.key;

      // ── Konami buffer ──
      // Acceptable tokens are arrow names or single letter keys (lowercased)
      const token =
        k.startsWith('Arrow') ? k :
        (k.length === 1 ? k.toLowerCase() : null);
      if (token) {
        const buf = keyBufferRef.current;
        buf.push(token);
        if (buf.length > KONAMI.length) buf.shift();
        // preventDefault on consecutive arrow keys so iframe parents
        // don't steal the input for scrolling
        if (
          token.startsWith('Arrow') &&
          buf.length >= 2 &&
          buf[buf.length - 2].startsWith('Arrow')
        ) {
          e.preventDefault();
        }
        if (
          buf.length === KONAMI.length &&
          buf.every((v, i) => v === KONAMI[i])
        ) {
          keyBufferRef.current = [];
          letterBufferRef.current = '';
          setOpen(true);
          return;
        }
      }

      // ── Typed "labmode" buffer ──
      // Skip while user is typing in form fields
      const tgt = e.target;
      const tag = (tgt && tgt.tagName) ? tgt.tagName.toLowerCase() : '';
      const isEditable =
        tag === 'input' || tag === 'textarea' ||
        (tgt && tgt.isContentEditable);
      if (!isEditable && k.length === 1 && /^[a-zA-Z]$/.test(k)) {
        letterBufferRef.current = (letterBufferRef.current + k.toLowerCase()).slice(-TYPED_WORD.length);
        if (letterBufferRef.current === TYPED_WORD) {
          letterBufferRef.current = '';
          keyBufferRef.current = [];
          setOpen(true);
        }
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  // ─── Body scroll lock while open ──────────────────────────────────────────
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // ─── Boot sequence (typewriter, rAF-driven, DOM-direct for perf) ──────────
  useEffect(() => {
    if (!open) return;

    if (reducedMotion) {
      setTypedLines(BOOT_LINES.map((l) => ({ text: l.text, kind: l.kind })));
      setFinished(true);
      return;
    }

    let cancelled = false;
    let rafId = null;
    const local = [];

    const writeCurrent = (text, kind) => {
      const node = currentTextRef.current;
      const caret = currentCaretRef.current;
      if (node) {
        node.textContent = text;
        node.style.color = COLOR_FOR_KIND[kind] || '#5ec98a';
      }
      if (caret) {
        caret.style.background = COLOR_FOR_KIND[kind] || '#5ec98a';
        caret.style.display = text.length ? 'inline-block' : 'none';
      }
      currentKindRef.current = kind;
    };

    let lineIdx = 0;
    let charIdx = 0;
    let pauseUntil = 0;
    let lastTickT = performance.now();

    const tick = (t) => {
      if (cancelled) return;
      // Honor pause windows between lines
      if (t < pauseUntil) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const dt = t - lastTickT;
      lastTickT = t;

      if (lineIdx >= BOOT_LINES.length) {
        setFinished(true);
        return;
      }

      const line = BOOT_LINES[lineIdx];

      // Handle blank line
      if (line.kind === 'blank' || line.text === '') {
        local.push({ text: '', kind: 'blank' });
        setTypedLines([...local]);
        lineIdx += 1;
        pauseUntil = t + 120;
        rafId = requestAnimationFrame(tick);
        return;
      }

      const charDelay =
        line.kind === 'prose' || line.kind === 'cta'
          ? CHAR_DELAY_PROSE
          : CHAR_DELAY_CMD;
      // chars to advance this frame
      const advance = Math.max(1, Math.floor(dt / charDelay));
      charIdx = Math.min(line.text.length, charIdx + advance);

      writeCurrent(line.text.slice(0, charIdx), line.kind);

      if (charIdx >= line.text.length) {
        // commit and move on
        local.push({ text: line.text, kind: line.kind });
        setTypedLines([...local]);
        writeCurrent('', line.kind);
        lineIdx += 1;
        charIdx = 0;
        pauseUntil = t + (line.pauseAfter || 0);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      clearAnimTimers();
    };
  }, [open, reducedMotion]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Lab Mode"
      data-testid="labmode-overlay"
      className="fixed inset-0"
      style={{
        zIndex: 99999,
        background: '#070a07',
        color: '#5ec98a',
        fontFamily: '"Geist Mono", ui-monospace, monospace',
        textShadow: '0 0 6px rgba(94,201,138,0.45)',
      }}
    >
      {/* Scanlines */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 2px, transparent 4px)',
          animation: reducedMotion ? 'none' : 'labmode-scan 6s linear infinite',
          mixBlendMode: 'screen',
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 90%)',
        }}
      />
      {/* Confetti (auto-removed by CSS animation; component re-renders cleanly) */}
      {!reducedMotion && <Confetti />}

      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div
          className="px-6 sm:px-10 py-5 flex items-center gap-3 border-b"
          style={{ borderColor: 'rgba(94,201,138,0.18)' }}
        >
          <span className="relative inline-flex w-2.5 h-2.5">
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background: '#5ec98a',
                animation: reducedMotion ? 'none' : 'labmode-ping 1.6s ease-out infinite',
              }}
            />
            <span
              className="relative w-2.5 h-2.5 rounded-full"
              style={{
                background: '#5ec98a',
                boxShadow: '0 0 10px rgba(94,201,138,0.8)',
              }}
            />
          </span>
          <span
            className="uppercase tracking-[0.22em] text-[11px] sm:text-xs"
            style={{ color: '#9ae0b6' }}
          >
            saubhagya.os · lab mode unlocked
          </span>
        </div>

        {/* Body — boot sequence */}
        <div
          data-testid="labmode-body"
          className="flex-1 overflow-auto px-6 sm:px-10 py-8 text-[13px] sm:text-[14px] leading-relaxed"
        >
          {typedLines.map((l, idx) => (
            <div
              key={idx}
              style={{
                color: COLOR_FOR_KIND[l.kind] || '#5ec98a',
                minHeight: '1.6em',
              }}
            >
              {l.text || '\u00A0'}
            </div>
          ))}
          {!finished && (
            <div style={{ color: COLOR_FOR_KIND.cmd, minHeight: '1.6em' }}>
              <span ref={currentTextRef} />
              <span
                ref={currentCaretRef}
                aria-hidden
                style={{
                  display: 'none',
                  width: '0.55em',
                  height: '1em',
                  background: COLOR_FOR_KIND.cmd,
                  marginLeft: 2,
                  verticalAlign: '-2px',
                  animation: 'labmode-blink 0.9s steps(2) infinite',
                }}
              />
            </div>
          )}
          {finished && (
            <div style={{ color: COLOR_FOR_KIND.cta }}>
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: '0.6em',
                  height: '1em',
                  background: COLOR_FOR_KIND.cta,
                  verticalAlign: '-2px',
                  marginLeft: 6,
                  animation: 'labmode-blink 0.9s steps(2) infinite',
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 sm:px-10 py-4 flex flex-wrap items-center gap-3 sm:gap-4 border-t"
          style={{ borderColor: 'rgba(94,201,138,0.18)' }}
        >
          <button
            type="button"
            data-testid="labmode-exit"
            onClick={close}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-colors"
            style={{
              color: '#9ae0b6',
              border: '1px solid rgba(94,201,138,0.4)',
              background: 'rgba(94,201,138,0.06)',
            }}
          >
            <span aria-hidden>↩</span>
            <span className="text-xs uppercase tracking-[0.2em]">exit</span>
          </button>
          <button
            type="button"
            data-testid="labmode-cta"
            onClick={goToContact}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-colors hover:brightness-110"
            style={{
              color: '#0f0e0d',
              background: 'linear-gradient(90deg, #ff5a1f, #ffb547)',
              boxShadow: '0 0 18px rgba(255,90,31,0.35)',
              fontWeight: 500,
            }}
          >
            <span aria-hidden>→</span>
            <span className="text-xs uppercase tracking-[0.2em]">let&apos;s build something</span>
          </button>
          <span
            className="ml-auto text-[10px] uppercase tracking-[0.25em]"
            style={{ color: 'rgba(154,224,182,0.55)' }}
          >
            or press ESC
          </span>
        </div>
      </div>

      {/* Component-local keyframes */}
      <style>{`
        @keyframes labmode-blink { 50% { opacity: 0; } }
        @keyframes labmode-scan {
          0%   { background-position: 0 0; }
          100% { background-position: 0 200px; }
        }
        @keyframes labmode-ping {
          0%   { transform: scale(1);   opacity: 0.7; }
          80%  { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes labmode-fall {
          0%   { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--drift, 0px), 110vh) rotate(720deg); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
};
