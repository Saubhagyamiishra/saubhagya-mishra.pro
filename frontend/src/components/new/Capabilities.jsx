import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';

const capabilities = [
  {
    id: '01',
    code: 'WEB',
    title: 'Website Development',
    description: 'Conversion-engineered marketing sites with measurable outcomes',
  },
  {
    id: '02',
    code: 'APP',
    title: 'Web App Development',
    description: 'Interactive product experiences with React, Next.js, APIs',
  },
  {
    id: '03',
    code: 'UX',
    title: 'UX / UI Design',
    description: 'Interface systems built for clarity, conversion, and craft',
  },
  {
    id: '04',
    code: 'STRAT',
    title: 'Product Strategy',
    description: 'Positioning, narrative, and roadmap thinking',
  },
  {
    id: '05',
    code: 'MKT',
    title: 'Digital Marketing',
    description: 'SEO, paid, content, lifecycle - orchestrated, not siloed',
  },
  {
    id: '06',
    code: 'DATA',
    title: 'Analytics & Dashboards',
    description: 'GA4, Looker, custom dashboards that drive decisions',
  },
  {
    id: '07',
    code: 'AUTO',
    title: 'Automation Systems',
    description: 'Make, Zapier, custom scripts wiring tools into one stack',
  },
  {
    id: '08',
    code: 'FUNNEL',
    title: 'Funnel Building',
    description: 'From cold traffic to repeat customer - the whole flow, mapped',
  },
  {
    id: '09',
    code: 'AI',
    title: 'AI Prompt Engineering',
    description: 'LLM workflows that ship real outcomes',
  },
  {
    id: '10',
    code: 'PERF',
    title: 'Performance Optimization',
    description: 'Core Web Vitals, conversion rate, ROAS - measurably better',
  },
  {
    id: '11',
    code: 'VIZ',
    title: 'Data Visualization',
    description: 'Turning complex metrics into interfaces people actually use',
  },
  {
    id: '12',
    code: 'BRAND',
    title: 'Brand Experience',
    description: 'Identity, voice, and motion - designed to feel inevitable',
  },
];

const CapabilityCard = ({ capability }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="group relative p-6 bg-bg rounded-2xl border border-line hover:border-line-strong transition-all duration-300 cursor-pointer overflow-hidden"
      style={{
        '--mx': `${mousePos.x}%`,
        '--my': `${mousePos.y}%`,
      }}
    >
      {/* Spotlight effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mx) var(--my), var(--accent-glow), transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <span className="label-mono text-muted text-[10px]">
            {capability.id} / {capability.code}
          </span>
          <ArrowUpRight
            weight="bold"
            className="w-5 h-5 text-ink-2 group-hover:text-accent group-hover:rotate-45 transition-all duration-300"
          />
        </div>

        <h3 className="font-fraunces text-xl font-medium text-ink mb-3 leading-tight">
          {capability.title}
        </h3>

        <p className="text-sm text-muted leading-relaxed">{capability.description}</p>
      </div>
    </motion.div>
  );
};

export const Capabilities = () => {
  return (
    <section className="relative py-32 bg-bg">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="label-mono text-muted mb-6"
        >
          Capabilities
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-ink max-w-4xl mb-16"
        >
          What I build, ship, and optimize.
        </motion.h2>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line-strong rounded-2xl overflow-hidden">
          {capabilities.map((capability) => (
            <CapabilityCard key={capability.id} capability={capability} />
          ))}
        </div>
      </div>
    </section>
  );
};
