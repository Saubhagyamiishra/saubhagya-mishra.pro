import { motion } from 'framer-motion';
import { useState } from 'react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const ResultCard = ({ title, value, delta, type, delay = 0, span = 1 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay }}
      className={`${span === 2 ? 'lg:col-span-2' : ''} p-8 bg-paper rounded-3xl border border-line shadow-soft`}
    >
      {type === 'chart' ? (
        <div className="space-y-6">
          <div>
            <div className="label-mono text-muted text-[10px] mb-3">{title}</div>
            <div className="flex items-baseline gap-4">
              <div className="font-fraunces text-5xl font-medium text-ink tabular-nums">
                {value}
              </div>
              {delta && (
                <div className="px-3 py-1 rounded-full bg-green/10 border border-green/20">
                  <span className="text-sm font-medium text-green">{delta}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted mt-2">
              Avg. time-on-page vs. pre-launch baseline.
            </p>
          </div>

          {/* SVG Area Chart */}
          <svg className="w-full h-32" viewBox="0 0 600 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`grid-${i}`}
                x1="0"
                y1={i * 30}
                x2="600"
                y2={i * 30}
                stroke="var(--line)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Area fill */}
            <motion.path
              d="M0,90 L60,85 L120,75 L180,70 L240,60 L300,55 L360,45 L420,40 L480,30 L540,25 L600,20 L600,120 L0,120 Z"
              fill="url(#chartGradient)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: delay + 1 }}
            />

            {/* Line */}
            <motion.path
              d="M0,90 L60,85 L120,75 L180,70 L240,60 L300,55 L360,45 L420,40 L480,30 L540,25 L600,20"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 2.5, delay, ease: 'easeInOut' }}
            />

            {/* End dot */}
            <motion.circle
              cx="600"
              cy="20"
              r="5"
              fill="var(--accent)"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, delay: delay + 2.5 }}
            />
          </svg>
        </div>
      ) : type === 'ring' ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="label-mono text-muted text-[10px] mb-6">{title}</div>
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90">
              {/* Background ring */}
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="var(--line)"
                strokeWidth="8"
              />
              {/* Progress ring */}
              <motion.circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="377"
                initial={{ strokeDashoffset: 377 }}
                animate={isInView ? { strokeDashoffset: 30 } : { strokeDashoffset: 377 }}
                transition={{ duration: 2, delay: delay + 0.3, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-fraunces text-4xl font-medium text-ink tabular-nums">
                  {value}
                </div>
              </div>
            </div>
          </div>
          {delta && (
            <div className="mt-4 px-3 py-1 rounded-full bg-green/10 border border-green/20">
              <span className="text-xs font-medium text-green">{delta}</span>
            </div>
          )}
        </div>
      ) : type === 'bar' ? (
        <div className="space-y-4">
          <div>
            <div className="label-mono text-muted text-[10px] mb-2">{title}</div>
            <div className="font-fraunces text-4xl font-medium text-ink tabular-nums">
              {value}
            </div>
          </div>
          <div className="relative h-3 bg-line rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent-2 rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: parseFloat(value) / 100 } : { scaleX: 0 }}
              transition={{ duration: 1.5, delay, ease: 'easeOut' }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="label-mono text-muted text-[10px]">{title}</div>
          <div className="font-fraunces text-4xl font-medium text-ink tabular-nums">{value}</div>
          {delta && (
            <div className="inline-block px-3 py-1 rounded-full bg-paper border border-line">
              <span className="text-xs font-medium text-ink">{delta}</span>
            </div>
          )}
          <div className="relative h-2 bg-line-strong rounded-full overflow-hidden mt-4">
            <motion.div
              className="absolute inset-y-0 left-0 bg-accent rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.5, delay, ease: 'easeOut' }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const ResultsDashboard = () => {
  return (
    <section className="relative py-32 bg-paper">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="label-mono text-muted mb-6"
        >
          Results · Live KPI Layer
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-ink max-w-4xl mb-16"
        >
          The work, in numbers.
        </motion.h2>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ResultCard
            title="Website Engagement (Trailing 12 mo)"
            value="3.8×"
            delta="↑ +240%"
            type="chart"
            span={2}
            delay={0}
          />

          <ResultCard
            title="UX Satisfaction"
            value="92%"
            delta="↑ +18 pts"
            type="ring"
            delay={0.2}
          />

          <ResultCard
            title="Lead Flow Improvement"
            value="+180%"
            type="bar"
            delay={0.3}
          />

          <ResultCard
            title="Workflow Execution Speed"
            value="-65%"
            type="bar"
            delay={0.4}
          />

          <ResultCard
            title="Digital Systems Built"
            value="12+"
            delta="In Production"
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
};
