import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

const labExperiments = [
  {
    number: '001',
    title: 'AI Prompt Engineering',
    description: 'Reusable prompt frameworks for content, ops, and product copy.',
    status: 'Live',
    statusColor: 'green',
    demo: 'code',
  },
  {
    number: '002',
    title: 'Performance Optimization',
    description: 'Sub-second LCP toolkit for production marketing sites.',
    status: 'Testing',
    statusColor: 'amber',
    demo: 'waveform',
  },
  {
    number: '003',
    title: '3D Card Interactions',
    description: 'Tilt, parallax, and gyroscope-aware component library.',
    status: 'Prototype',
    statusColor: 'orange',
    demo: 'dots',
  },
  {
    number: '004',
    title: 'Microinteraction Library',
    description: 'Tiny moments - hover, focus, success - engineered to feel inevitable.',
    status: 'Live',
    statusColor: 'green',
    demo: 'code',
  },
  {
    number: '005',
    title: 'Data Viz Toolkit',
    description: 'Composable charts and KPI tiles for analytics dashboards.',
    status: 'Testing',
    statusColor: 'amber',
    demo: 'waveform',
  },
  {
    number: '006',
    title: 'Minimal Component System',
    description: 'A 30-component design system tuned for marketing speed.',
    status: 'Prototype',
    statusColor: 'orange',
    demo: 'code',
  },
  {
    number: '007',
    title: 'Automation Experiments',
    description: 'Make, Zapier, and code-based ops flows running in production.',
    status: 'Live',
    statusColor: 'green',
    demo: 'dots',
  },
  {
    number: '008',
    title: 'Creative Interface Concepts',
    description: 'Speculative UI patterns for the post-app, AI-native era.',
    status: 'Coming Soon',
    statusColor: 'muted',
    demo: 'code',
  },
];

const MiniDemo = ({ type }) => {
  if (type === 'waveform') {
    return (
      <div className="h-8 flex items-end gap-1">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="flex-1 bg-accent/60 rounded-t"
            animate={{
              height: [`${30 + Math.random() * 70}%`, `${30 + Math.random() * 70}%`],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className="h-8 flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`dot-${i}`}
            className={`w-2 h-2 rounded-full ${i < 2 ? 'bg-accent' : 'bg-paper/20'}`}
            animate={i < 2 ? { scale: [1, 1.3, 1] } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    );
  }

  // code type
  return (
    <div className="h-8 flex items-center">
      <code className="label-mono text-[10px] text-paper/60">
        <span className="text-accent">prompt</span> &gt; <span className="text-paper/80">refine</span> &gt;{' '}
        <span className="text-accent">ship</span>
      </code>
    </div>
  );
};

const LabCard = ({ experiment }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const statusColors = {
    green: 'bg-green/20 border-green/30 text-green',
    amber: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
    orange: 'bg-accent/20 border-accent/30 text-accent',
    muted: 'bg-paper/10 border-paper/20 text-paper/40',
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4 }}
      className="group relative p-6 bg-ink/50 rounded-2xl border border-paper/10 hover:border-accent/30 transition-all duration-300 cursor-pointer overflow-hidden"
      style={{
        '--mx': `${mousePos.x}%`,
        '--my': `${mousePos.y}%`,
      }}
    >
      {/* Spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mx) var(--my), rgba(255,90,31,0.15), transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="label-mono text-paper/40 text-[10px]">/ {experiment.number}</span>
          <div className={`px-2 py-1 rounded-full border text-[9px] label-mono ${statusColors[experiment.statusColor]}`}>
            {experiment.status === 'Live' && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green mr-1.5 animate-pulse" />
            )}
            {experiment.status === 'Testing' && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse" />
            )}
            {experiment.status === 'Prototype' && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-1.5" />
            )}
            {experiment.status === 'Coming Soon' && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-paper/40 mr-1.5" />
            )}
            {experiment.status}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-fraunces text-xl font-medium text-paper leading-tight">
          {experiment.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-paper/60 leading-relaxed">{experiment.description}</p>

        {/* Mini Demo */}
        <MiniDemo type={experiment.demo} />
      </div>
    </motion.div>
  );
};

export const TheLab = () => {
  return (
    <section className="relative bg-ink text-paper pb-32 rounded-b-[32px]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="label-mono text-paper/40 mb-6"
        >
          The Lab · Active Experiments
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-paper max-w-4xl mb-16"
        >
          Where I play, prototype, and break things on purpose.
        </motion.h2>

        {/* Lab Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {labExperiments.map((experiment, index) => (
            <LabCard key={experiment.number} experiment={experiment} />
          ))}
        </div>
      </div>
    </section>
  );
};
