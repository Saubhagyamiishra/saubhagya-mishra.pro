"use client";

/* eslint-disable react/no-unknown-property */
// 12 lightweight CSS/SVG visuals for the Capabilities stage.
// All visuals share a 520×360 viewBox and animate via CSS keyframes/SMIL.

const Frame = ({ children, label }) => (
  <div
    data-testid="capability-visual-frame"
    className="relative w-full aspect-[13/9] rounded-2xl bg-paper border border-line-strong overflow-hidden shadow-soft"
  >
    {/* Top bar */}
    <div className="absolute top-0 left-0 right-0 h-9 border-b border-line bg-bg-2/60 flex items-center px-4 gap-1.5 z-10">
      <span className="w-2.5 h-2.5 rounded-full bg-ink/15" />
      <span className="w-2.5 h-2.5 rounded-full bg-ink/15" />
      <span className="w-2.5 h-2.5 rounded-full bg-ink/15" />
      <span className="ml-auto label-mono text-[9px] text-muted">{label}</span>
    </div>
    <div className="absolute inset-0 pt-9">{children}</div>
  </div>
);

/* 01 — WEB: mock browser with loading bar + content blocks */
export const WebVisual = () => (
  <Frame label="LIGHTHOUSE 98">
    <div className="w-full h-full p-6 flex flex-col gap-3">
      <div className="h-2 w-2/3 rounded-full bg-line-strong overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 bg-accent rounded-full" style={{ width: '78%', animation: 'cap-loadbar 2.4s ease-out infinite' }} />
      </div>
      <div className="h-6 w-1/2 rounded bg-ink/85 mt-2" />
      <div className="h-2 w-3/4 rounded bg-line-strong" />
      <div className="h-2 w-2/3 rounded bg-line-strong" />
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="aspect-[4/3] rounded-lg border border-line-strong bg-bg-2/50 flex items-end p-2">
            <div className="h-1.5 w-2/3 rounded-full bg-ink/30" />
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-2">
        <div className="h-7 w-20 rounded-full bg-accent" />
        <div className="h-7 w-20 rounded-full border border-line-strong" />
      </div>
    </div>
    <style>{`@keyframes cap-loadbar { 0% { width: 8%; } 60% { width: 92%; } 100% { width: 8%; } }`}</style>
  </Frame>
);

/* 02 — APP: nested component tree with state ping */
export const AppVisual = () => (
  <Frame label="REACT · NEXT · API">
    <div className="w-full h-full p-6">
      <svg viewBox="0 0 460 280" className="w-full h-full">
        {/* outer */}
        <rect x="10" y="10" width="440" height="260" rx="14" fill="none" stroke="rgba(26,24,22,0.18)" strokeDasharray="4 4" />
        {/* nested */}
        <rect x="40" y="50" width="180" height="190" rx="10" fill="rgba(255,90,31,0.06)" stroke="rgba(255,90,31,0.4)" />
        <rect x="240" y="50" width="180" height="90" rx="10" fill="rgba(15,14,13,0.04)" stroke="rgba(26,24,22,0.2)" />
        <rect x="240" y="150" width="180" height="90" rx="10" fill="rgba(15,14,13,0.04)" stroke="rgba(26,24,22,0.2)" />
        {/* labels */}
        <text x="55" y="75" fontFamily="Geist Mono, monospace" fontSize="10" fill="#6a655d">{'<App/>'}</text>
        <text x="255" y="75" fontFamily="Geist Mono, monospace" fontSize="10" fill="#6a655d">{'<Header/>'}</text>
        <text x="255" y="175" fontFamily="Geist Mono, monospace" fontSize="10" fill="#6a655d">{'<Feed/>'}</text>
        {/* pinging dot */}
        <circle cx="130" cy="145" r="6" fill="#ff5a1f">
          <animate attributeName="r" values="4;10;4" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
        </circle>
        {/* connectors */}
        <path d="M220 145 L240 95" stroke="#ff5a1f" strokeWidth="1.5" fill="none" strokeDasharray="3 3">
          <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite" />
        </path>
        <path d="M220 145 L240 195" stroke="#ff5a1f" strokeWidth="1.5" fill="none" strokeDasharray="3 3">
          <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  </Frame>
);

/* 03 — UX: wireframe screens appearing */
export const UxVisual = () => (
  <Frame label="FIGMA · WIREFRAME">
    <div className="w-full h-full p-6 grid grid-cols-3 gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-line-strong bg-bg-2/40 p-2 flex flex-col gap-1.5"
          style={{ animation: `cap-fadeup 2.4s ${i * 0.25}s ease-out infinite` }}
        >
          <div className="h-1.5 w-2/3 rounded-full bg-ink/30" />
          <div className="h-1.5 w-1/2 rounded-full bg-line-strong" />
          <div className="mt-1 aspect-square rounded bg-line-strong/60" />
          <div className="h-1.5 w-3/4 rounded-full bg-line-strong" />
          <div className="h-3 w-1/2 rounded-full bg-accent mt-1" />
        </div>
      ))}
    </div>
    <style>{`@keyframes cap-fadeup { 0%, 80%, 100% { opacity: 0.3; transform: translateY(8px); } 30%, 60% { opacity: 1; transform: translateY(0); } }`}</style>
  </Frame>
);

/* 04 — STRAT: roadmap with milestones */
export const StratVisual = () => (
  <Frame label="ROADMAP Q1 → Q4">
    <div className="w-full h-full p-6">
      <svg viewBox="0 0 460 240" className="w-full h-full">
        <path d="M20 180 Q 140 80, 230 140 T 440 60" stroke="rgba(26,24,22,0.15)" strokeWidth="2" fill="none" strokeDasharray="500" strokeDashoffset="500">
          <animate attributeName="stroke-dashoffset" from="500" to="0" dur="3.2s" repeatCount="indefinite" />
        </path>
        {[
          { x: 20, y: 180, label: 'Q1' },
          { x: 160, y: 105, label: 'Q2' },
          { x: 300, y: 130, label: 'Q3' },
          { x: 440, y: 60, label: 'Q4' },
        ].map((m, i) => (
          <g key={i} style={{ animation: `cap-pop 3.2s ${i * 0.6}s ease-out infinite` }}>
            <circle cx={m.x} cy={m.y} r="8" fill="#ff5a1f" />
            <circle cx={m.x} cy={m.y} r="14" fill="none" stroke="#ff5a1f" strokeWidth="1" opacity="0.4" />
            <text x={m.x} y={m.y + 32} fontFamily="Geist Mono, monospace" fontSize="10" fill="#0f0e0d" textAnchor="middle">{m.label}</text>
          </g>
        ))}
      </svg>
    </div>
    <style>{`@keyframes cap-pop { 0%, 80%, 100% { opacity: 0; transform: scale(0.6); transform-box: fill-box; transform-origin: center; } 25%, 60% { opacity: 1; transform: scale(1); } }`}</style>
  </Frame>
);

/* 05 — MKT: multi-channel orbit */
export const MktVisual = () => (
  <Frame label="CHANNELS · ORCHESTRATED">
    <div className="w-full h-full p-6 flex items-center justify-center">
      <svg viewBox="0 0 300 240" className="w-full h-full max-w-[300px]">
        <g style={{ transformOrigin: '150px 120px', animation: 'cap-spin 18s linear infinite' }}>
          <circle cx="150" cy="120" r="80" fill="none" stroke="rgba(26,24,22,0.12)" strokeDasharray="3 4" />
          {['SEO', 'PAID', 'CRM', 'SOCIAL', 'CONTENT', 'EMAIL'].map((label, i) => {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const x = 150 + Math.cos(angle) * 80;
            const y = 120 + Math.sin(angle) * 80;
            return (
              <g key={label} style={{ transformOrigin: `${x}px ${y}px`, animation: 'cap-counterspin 18s linear infinite' }}>
                <circle cx={x} cy={y} r="20" fill="#fbf9f4" stroke="rgba(26,24,22,0.2)" />
                <text x={x} y={y + 3} fontFamily="Geist Mono, monospace" fontSize="8" fill="#0f0e0d" textAnchor="middle">{label}</text>
              </g>
            );
          })}
        </g>
        <circle cx="150" cy="120" r="22" fill="#ff5a1f" />
        <text x="150" y="124" fontFamily="Fraunces, serif" fontSize="14" fill="#fbf9f4" textAnchor="middle">YOU</text>
      </svg>
    </div>
    <style>{`@keyframes cap-spin { to { transform: rotate(360deg); } } @keyframes cap-counterspin { to { transform: rotate(-360deg); } }`}</style>
  </Frame>
);

/* 06 — DATA: bar chart growth */
export const DataVisual = () => (
  <Frame label="GA4 · LOOKER · BIGQUERY">
    <div className="w-full h-full p-6 flex flex-col">
      <div className="flex items-end gap-3 flex-1 pb-6">
        {[60, 38, 78, 55, 92, 70, 100].map((h, i) => (
          <div key={i} className="flex-1 relative">
            <div
              className="w-full rounded-t-sm bg-gradient-to-t from-accent to-accent-2"
              style={{
                height: `${h}%`,
                animation: `cap-grow 2.6s ${i * 0.12}s ease-out infinite`,
                transformOrigin: 'bottom',
              }}
            />
          </div>
        ))}
      </div>
      <div className="border-t border-line-strong pt-2 flex justify-between label-mono text-[9px] text-muted">
        <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span>
      </div>
    </div>
    <style>{`@keyframes cap-grow { 0%, 90%, 100% { transform: scaleY(0.2); opacity: 0.4; } 40%, 70% { transform: scaleY(1); opacity: 1; } }`}</style>
  </Frame>
);

/* 07 — AUTO: workflow nodes with flowing tokens */
export const AutoVisual = () => (
  <Frame label="MAKE · ZAPIER · WEBHOOK">
    <div className="w-full h-full p-6">
      <svg viewBox="0 0 460 240" className="w-full h-full">
        {[
          { x: 40, y: 60, label: 'Form' },
          { x: 200, y: 60, label: 'Filter' },
          { x: 360, y: 60, label: 'CRM' },
          { x: 200, y: 180, label: 'Email' },
        ].map((n, i) => (
          <g key={i}>
            <rect x={n.x - 36} y={n.y - 18} width="72" height="36" rx="8" fill="#fbf9f4" stroke="rgba(26,24,22,0.2)" />
            <text x={n.x} y={n.y + 4} fontFamily="Geist Mono, monospace" fontSize="10" fill="#0f0e0d" textAnchor="middle">{n.label}</text>
          </g>
        ))}
        {/* connectors */}
        <path d="M76 60 L164 60" stroke="rgba(26,24,22,0.3)" strokeWidth="1.5" fill="none" />
        <path d="M236 60 L324 60" stroke="rgba(26,24,22,0.3)" strokeWidth="1.5" fill="none" />
        <path d="M200 78 L200 162" stroke="rgba(26,24,22,0.3)" strokeWidth="1.5" fill="none" />
        {/* flowing tokens */}
        <circle r="4" fill="#ff5a1f">
          <animateMotion dur="3s" repeatCount="indefinite" path="M76 60 L164 60 L236 60 L324 60" />
        </circle>
        <circle r="4" fill="#ff5a1f" opacity="0.6">
          <animateMotion dur="3s" begin="0.8s" repeatCount="indefinite" path="M76 60 L164 60 L236 60 L324 60" />
        </circle>
        <circle r="3" fill="#ffb547">
          <animateMotion dur="2.4s" repeatCount="indefinite" path="M200 78 L200 162" />
        </circle>
      </svg>
    </div>
  </Frame>
);

/* 08 — FUNNEL: funnel with dots descending */
export const FunnelVisual = () => (
  <Frame label="VISIT → BUY → REPEAT">
    <div className="w-full h-full p-6 flex items-center justify-center">
      <svg viewBox="0 0 260 240" className="h-full">
        <defs>
          <linearGradient id="funnelGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,90,31,0.1)" />
            <stop offset="100%" stopColor="rgba(255,90,31,0.4)" />
          </linearGradient>
        </defs>
        <path d="M20 20 L240 20 L180 90 L180 140 L150 200 L110 200 L80 140 L80 90 Z" fill="url(#funnelGrad)" stroke="#ff5a1f" strokeWidth="1.5" />
        <text x="130" y="42" fontFamily="Geist Mono, monospace" fontSize="9" fill="#0f0e0d" textAnchor="middle">VISITORS · 10,000</text>
        <text x="130" y="115" fontFamily="Geist Mono, monospace" fontSize="9" fill="#0f0e0d" textAnchor="middle">LEADS · 1,200</text>
        <text x="130" y="180" fontFamily="Geist Mono, monospace" fontSize="9" fill="#0f0e0d" textAnchor="middle">BUYERS · 240</text>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} r="3" fill="#0f0e0d">
            <animateMotion dur="2.8s" begin={`${i * 0.5}s`} repeatCount="indefinite" path="M130 20 L130 200" />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="2.8s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  </Frame>
);

/* 09 — AI: prompt → tokens output stream */
export const AiVisual = () => (
  <Frame label="LLM · PROMPT · OUTPUT">
    <div className="w-full h-full p-6 flex flex-col gap-3 font-mono text-[11px]">
      <div className="rounded-lg border border-line-strong bg-bg-2/40 p-3">
        <div className="label-mono text-[9px] text-muted mb-1">PROMPT</div>
        <div className="text-ink-2">Generate a 6-step onboarding flow for a fintech SaaS targeting CFOs.</div>
      </div>
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 flex-1">
        <div className="label-mono text-[9px] text-accent mb-1">OUTPUT</div>
        <div className="text-ink overflow-hidden">
          <span style={{ animation: 'cap-typewriter 6s steps(60) infinite', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            1. Connect accounting tool 2. Verify identity 3. Set permissions...
          </span>
          <span className="inline-block w-1.5 h-3 bg-accent ml-0.5 align-middle" style={{ animation: 'cap-blink 0.8s steps(2) infinite' }} />
        </div>
      </div>
    </div>
    <style>{`@keyframes cap-typewriter { 0% { max-width: 0; } 60%, 100% { max-width: 100%; } } @keyframes cap-blink { 50% { opacity: 0; } }`}</style>
  </Frame>
);

/* 10 — PERF: circular progress ring */
export const PerfVisual = () => {
  const r = 70;
  const c = 2 * Math.PI * r;
  return (
    <Frame label="LCP · CLS · INP">
      <div className="w-full h-full p-6 flex items-center justify-around">
        <div className="relative">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(26,24,22,0.1)" strokeWidth="10" />
            <circle
              cx="90" cy="90" r={r}
              fill="none" stroke="#ff5a1f" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c}
              transform="rotate(-90 90 90)"
              style={{ animation: 'cap-ring 3.2s ease-out infinite' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-fraunces text-4xl text-ink">98</div>
            <div className="label-mono text-[9px] text-muted">PERF</div>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green" /> LCP 1.2s</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green" /> CLS 0.02</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-accent" /> INP 180ms</div>
        </div>
      </div>
      <style>{`@keyframes cap-ring { 0%, 90%, 100% { stroke-dashoffset: ${c}; } 40%, 70% { stroke-dashoffset: ${c * 0.02}; } }`}</style>
    </Frame>
  );
};

/* 11 — VIZ: line chart with stroke-dashoffset draw */
export const VizVisual = () => (
  <Frame label="REAL-TIME · TREND">
    <div className="w-full h-full p-6">
      <svg viewBox="0 0 460 240" className="w-full h-full">
        {[40, 80, 120, 160, 200].map((y) => (
          <line key={y} x1="20" y1={y} x2="440" y2={y} stroke="rgba(26,24,22,0.06)" />
        ))}
        <defs>
          <linearGradient id="vizFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,90,31,0.25)" />
            <stop offset="100%" stopColor="rgba(255,90,31,0)" />
          </linearGradient>
        </defs>
        <path d="M20 180 L80 160 L140 140 L200 100 L260 120 L320 70 L380 90 L440 50 L440 220 L20 220 Z" fill="url(#vizFill)" />
        <path
          d="M20 180 L80 160 L140 140 L200 100 L260 120 L320 70 L380 90 L440 50"
          fill="none" stroke="#ff5a1f" strokeWidth="2.5" strokeLinejoin="round"
          strokeDasharray="800" strokeDashoffset="800"
          style={{ animation: 'cap-draw 3s ease-out infinite' }}
        />
        {[[20, 180], [80, 160], [140, 140], [200, 100], [260, 120], [320, 70], [380, 90], [440, 50]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.5" fill="#0f0e0d" style={{ animation: `cap-fadein 3s ${i * 0.2}s infinite` }} />
        ))}
      </svg>
    </div>
    <style>{`@keyframes cap-draw { 0% { stroke-dashoffset: 800; } 60%, 100% { stroke-dashoffset: 0; } } @keyframes cap-fadein { 0%, 30% { opacity: 0; } 60%, 100% { opacity: 1; } }`}</style>
  </Frame>
);

/* 12 — BRAND: serif typography badge */
export const BrandVisual = () => (
  <Frame label="IDENTITY · VOICE · MOTION">
    <div className="relative w-full h-full p-6 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-64 h-64 rounded-full border border-accent/40"
          style={{ animation: 'cap-spin 22s linear infinite' }}
        >
          <svg viewBox="0 0 256 256" className="w-full h-full">
            <defs>
              <path id="brandCircle" d="M128,128 m-110,0 a110,110 0 1,1 220,0 a110,110 0 1,1 -220,0" />
            </defs>
            <text fontFamily="Geist Mono, monospace" fontSize="11" fill="#ff5a1f" letterSpacing="3">
              <textPath href="#brandCircle">EDITORIAL · TECH · LAB · DESIGN · MOTION · </textPath>
            </text>
          </svg>
        </div>
      </div>
      <div className="relative z-10 text-center">
        <div className="font-fraunces text-6xl text-ink leading-none">Aa</div>
        <div className="label-mono text-[10px] text-muted mt-2">FRAUNCES · GEIST</div>
        <div className="mt-3 flex justify-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-ink" />
          <span className="w-4 h-4 rounded-full bg-accent" />
          <span className="w-4 h-4 rounded-full bg-bg-2 border border-line-strong" />
        </div>
      </div>
    </div>
  </Frame>
);

export const VisualMap = {
  '01': WebVisual,
  '02': AppVisual,
  '03': UxVisual,
  '04': StratVisual,
  '05': MktVisual,
  '06': DataVisual,
  '07': AutoVisual,
  '08': FunnelVisual,
  '09': AiVisual,
  '10': PerfVisual,
  '11': VizVisual,
  '12': BrandVisual,
};