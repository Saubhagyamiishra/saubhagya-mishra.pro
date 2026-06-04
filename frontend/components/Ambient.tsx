"use client";

import { useEffect, useRef, useState } from "react";
import { scrollState } from "@/lib/scroll";

// Evolving ambient "space" piece + interaction SFX, all synthesized in-browser.
// Drone bed + slow diatonic chord changes + sparse pentatonic notes through
// reverb and delay. SFX (transition swells, hover blips, clicks, scroll whoosh)
// only sound while the toggle is on.

const SECTION_THRESHOLDS = [0.2, 0.45, 0.7, 0.9];
// A-minor / C-major friendly harmony
const BED_ROOTS = [110.0, 130.81, 87.31, 146.83]; // A2, C3, F2, D3
const PAD_CHORDS = [
  [220.0, 261.63, 329.63], // Am
  [261.63, 329.63, 392.0], // C
  [174.61, 220.0, 261.63], // F
  [146.83, 174.61, 220.0], // Dm
];
const MELODY = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

export default function Ambient() {
  const [on, setOn] = useState(false);
  const onRef = useRef(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const dryRef = useRef<GainNode | null>(null);
  const revRef = useRef<ConvolverNode | null>(null);
  const delayRef = useRef<DelayNode | null>(null);
  const padFilterRef = useRef<BiquadFilterNode | null>(null);
  const scrollNoiseRef = useRef<GainNode | null>(null);
  const bedOsc = useRef<OscillatorNode[]>([]);
  const padOsc = useRef<OscillatorNode[]>([]);
  const prog = useRef(0);
  const timers = useRef<number[]>([]);
  const raf = useRef(0);
  const lastSection = useRef(0);
  const lastBlip = useRef(0);
  const lastEl = useRef<Element | null>(null);

  const impulse = (ctx: AudioContext, secs: number, decay: number) => {
    const len = Math.floor(ctx.sampleRate * secs);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  };
  const noiseBuf = (ctx: AudioContext, secs: number) => {
    const len = Math.floor(ctx.sampleRate * secs);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  };

  const build = () => {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;

    const dry = ctx.createGain();
    dry.gain.value = 0.85;
    dry.connect(master);
    dryRef.current = dry;

    const rev = ctx.createConvolver();
    rev.buffer = impulse(ctx, 3.6, 2.4);
    const revGain = ctx.createGain();
    revGain.gain.value = 0.6;
    rev.connect(revGain).connect(master);
    revRef.current = rev;

    const delay = ctx.createDelay(1.0);
    delay.delayTime.value = 0.5;
    const fb = ctx.createGain();
    fb.gain.value = 0.32;
    delay.connect(fb).connect(delay);
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.4;
    delay.connect(delayGain).connect(master);
    delay.connect(rev);
    delayRef.current = delay;

    // bed (low drone)
    const bedFilter = ctx.createBiquadFilter();
    bedFilter.type = "lowpass";
    bedFilter.frequency.value = 700;
    const bedBus = ctx.createGain();
    bedBus.gain.value = 0.16;
    bedBus.connect(bedFilter);
    bedFilter.connect(dry);
    bedFilter.connect(rev);
    [BED_ROOTS[0], BED_ROOTS[0] * 1.5].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.detune.value = i === 0 ? -4 : 5;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.6 : 0.4;
      o.connect(g).connect(bedBus);
      o.start();
      bedOsc.current.push(o);
    });

    // pad (chord)
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 900;
    padFilter.Q.value = 0.5;
    const padBus = ctx.createGain();
    padBus.gain.value = 0.07;
    padBus.connect(padFilter);
    padFilter.connect(dry);
    padFilter.connect(rev);
    padFilterRef.current = padFilter;
    PAD_CHORDS[0].forEach((f) => {
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = f;
      o.detune.value = (Math.random() - 0.5) * 8;
      const g = ctx.createGain();
      g.gain.value = 0.33;
      o.connect(g).connect(padBus);
      o.start();
      padOsc.current.push(o);
    });

    // airy scroll whoosh
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf(ctx, 2);
    noise.loop = true;
    const nbp = ctx.createBiquadFilter();
    nbp.type = "bandpass";
    nbp.frequency.value = 950;
    nbp.Q.value = 0.6;
    const ng = ctx.createGain();
    ng.gain.value = 0;
    noise.connect(nbp).connect(ng);
    ng.connect(rev);
    ng.connect(dry);
    noise.start();
    scrollNoiseRef.current = ng;

    // chord progression
    timers.current.push(
      window.setInterval(() => {
        prog.current = (prog.current + 1) % BED_ROOTS.length;
        const now = ctx.currentTime;
        const root = BED_ROOTS[prog.current];
        bedOsc.current.forEach((o, i) =>
          o.frequency.setTargetAtTime(i === 0 ? root : root * 1.5, now, 1.6)
        );
        const chord = PAD_CHORDS[prog.current];
        padOsc.current.forEach((o, i) => o.frequency.setTargetAtTime(chord[i], now, 1.8));
      }, 9000)
    );

    // sparse melody
    const note = () => {
      const ctx2 = ctxRef.current;
      if (ctx2 && onRef.current && Math.random() > 0.22) {
        const f = MELODY[(Math.pow(Math.random(), 1.3) * MELODY.length) | 0];
        const o = ctx2.createOscillator();
        o.type = Math.random() < 0.5 ? "sine" : "triangle";
        o.frequency.value = f;
        const g = ctx2.createGain();
        const t0 = ctx2.currentTime;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(0.16, t0 + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.2);
        o.connect(g);
        if (dryRef.current) g.connect(dryRef.current);
        if (revRef.current) g.connect(revRef.current);
        if (delayRef.current) g.connect(delayRef.current);
        o.start(t0);
        o.stop(t0 + 3.4);
        o.onended = () => g.disconnect();
      }
      timers.current.push(window.setTimeout(note, 2200 + Math.random() * 2400));
    };
    timers.current.push(window.setTimeout(note, 1500));

    // per-frame: scroll-reactive filter, whoosh, section swells
    const loop = () => {
      const p = scrollState.progress;
      if (padFilterRef.current) {
        const target = 650 + p * 850;
        const cur = padFilterRef.current.frequency.value;
        padFilterRef.current.frequency.value = cur + (target - cur) * 0.03;
      }
      if (scrollNoiseRef.current && ctxRef.current) {
        const v = Math.min(Math.abs(scrollState.velocity) * 0.0014, 0.05);
        const cur = scrollNoiseRef.current.gain.value;
        scrollNoiseRef.current.gain.value = cur + (v - cur) * 0.08;
      }
      let idx = SECTION_THRESHOLDS.findIndex((t) => p < t);
      if (idx === -1) idx = SECTION_THRESHOLDS.length;
      if (idx !== lastSection.current) {
        if (onRef.current) swell();
        lastSection.current = idx;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  };

  // --- SFX ---
  const swell = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf(ctx, 1);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(300, t0);
    bp.frequency.exponentialRampToValueAtTime(2200, t0 + 0.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.05, t0 + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.8);
    src.connect(bp).connect(g);
    if (revRef.current) g.connect(revRef.current);
    if (masterRef.current) g.connect(masterRef.current);
    src.start(t0);
    src.stop(t0 + 0.9);
    // low sine thump
    const o = ctx.createOscillator();
    o.frequency.value = 90;
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.0001, t0);
    og.gain.linearRampToValueAtTime(0.05, t0 + 0.05);
    og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
    o.connect(og);
    if (masterRef.current) og.connect(masterRef.current);
    o.start(t0);
    o.stop(t0 + 0.7);
  };

  const blip = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = 1400 + Math.random() * 500;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 800;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.03, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.13);
    o.connect(hp).connect(g);
    if (masterRef.current) g.connect(masterRef.current);
    if (revRef.current) g.connect(revRef.current);
    o.start(t0);
    o.stop(t0 + 0.15);
  };

  const clickSfx = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(900, t0);
    o.frequency.exponentialRampToValueAtTime(420, t0 + 0.1);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.04, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
    o.connect(g);
    if (masterRef.current) g.connect(masterRef.current);
    o.start(t0);
    o.stop(t0 + 0.18);
  };

  // hover / click listeners (gated on sound state)
  useEffect(() => {
    const SEL = "a, button, .tile-card, .skill-chip, .nav-link, [data-cursor]";
    const over = (e: PointerEvent) => {
      if (!onRef.current || !ctxRef.current) return;
      const el = (e.target as HTMLElement | null)?.closest(SEL);
      if (!el || el === lastEl.current) return;
      const now = performance.now();
      if (now - lastBlip.current < 60) return;
      lastBlip.current = now;
      lastEl.current = el;
      blip();
    };
    const out = () => (lastEl.current = null);
    const down = (e: PointerEvent) => {
      if (!onRef.current || !ctxRef.current) return;
      if ((e.target as HTMLElement | null)?.closest(SEL)) clickSfx();
    };
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerout", out);
    window.addEventListener("pointerdown", down);
    return () => {
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("pointerdown", down);
    };
  }, []);

  const fade = (target: number, t: number) => {
    const ctx = ctxRef.current;
    const m = masterRef.current;
    if (!ctx || !m) return;
    const now = ctx.currentTime;
    m.gain.cancelScheduledValues(now);
    m.gain.setValueAtTime(Math.max(m.gain.value, 0.0001), now);
    m.gain.linearRampToValueAtTime(target, now + t);
  };

  const toggle = async () => {
    if (!ctxRef.current) build();
    const ctx = ctxRef.current!;
    if (ctx.state === "suspended") await ctx.resume();
    if (onRef.current) {
      onRef.current = false;
      setOn(false);
      fade(0, 0.8);
    } else {
      onRef.current = true;
      setOn(true);
      lastSection.current = -1; // re-sync, avoids a stale swell
      fade(0.2, 1.8);
    }
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
      timers.current.forEach((id) => {
        clearTimeout(id);
        clearInterval(id);
      });
      ctxRef.current?.close();
    };
  }, []);

  return (
    <button
      className={`sound ${on ? "is-on" : ""}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Mute ambience" : "Play ambience"}
    >
      <span className="sound-bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="sound-label">{on ? "Sound on" : "Sound"}</span>
    </button>
  );
}
