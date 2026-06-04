"use client";

import { motion } from 'framer-motion';
import { Brain, ChartLine, Strategy, Palette, GitBranch, Lightning } from '@phosphor-icons/react';

const osCards = [
  {
    id: '01',
    title: 'Creative Building',
    icon: Palette,
    description: 'Websites, apps, and systems that look premium and perform measurably better.',
  },
  {
    id: '02',
    title: 'Analytics Thinking',
    icon: ChartLine,
    description: 'Every decision backed by data. Every funnel mapped. Every metric understood.',
  },
  {
    id: '03',
    title: 'Marketing Strategy',
    icon: Strategy,
    description: 'Positioning, messaging, and go-to-market plans that compound over time.',
  },
  {
    id: '04',
    title: 'Product Design',
    icon: Brain,
    description: 'UX that converts. UI that delights. Interfaces built for clarity and speed.',
  },
  {
    id: '05',
    title: 'Automation',
    icon: GitBranch,
    description: 'Systems that run themselves. Workflows that scale without breaking.',
  },
  {
    id: '06',
    title: 'Execution',
    icon: Lightning,
    description: 'From concept to production. Fast iteration. Real outcomes. No theory.',
  },
];

export const About = () => {
  return (
    <section id="about" className="relative py-32 bg-paper">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="label-mono text-muted mb-6"
        >
          About / Operating System
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-ink max-w-4xl mb-16"
        >
          Hey there, welcome.
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-ink-2 leading-relaxed">
              I'm <span className="font-medium text-ink">Saubhagya Mishra</span>, a builder who reads
              too much, thinks too deeply, and refuses to sit still. Books fuel the mind, football
              fuels the soul, and if you catch me mid-sentence about either, clear your schedule.
            </p>

            <p className="text-lg text-ink-2 leading-relaxed">
              Right now I'm building{' '}
              <span className="relative inline-block">
                <span className="relative z-10 font-medium text-ink">Jarvislive</span>
                <span className="absolute bottom-0 left-0 right-0 h-2 bg-accent/20" />
              </span>
              , a personal AI automation system powered by n8n + Claude Code. It's equal parts
              ambition and chaos, and honestly? That's the best kind of project.
            </p>

            <p className="text-lg text-ink-2 leading-relaxed">
              I love automations, love building new things from scratch, and I'm always chasing that
              next rabbit hole, whether it's a new tech stack, a framework, or just a genuinely{' '}
              <span className="font-instrument italic">weird idea</span> that might actually work.
            </p>

            <div className="pt-6 border-t border-line">
              <p className="font-instrument italic text-2xl text-ink mb-1">- Saubhagya</p>
              <p className="text-sm text-muted">
                Director of Digital Marketing · Mirsonics
              </p>
            </div>
          </motion.div>

          {/* Right - OS Grid */}
          <div className="grid grid-cols-2 gap-4">
            {osCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative p-6 bg-bg rounded-2xl border border-line hover:border-accent transition-all duration-300 cursor-pointer shadow-soft"
              >
                {/* Hover accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />

                {/* Number */}
                <div className="label-mono text-muted mb-4 text-[10px]">{card.id}</div>

                {/* Icon */}
                <card.icon
                  weight="duotone"
                  className="w-8 h-8 text-ink mb-4 group-hover:text-accent transition-colors"
                />

                {/* Title */}
                <h3 className="font-fraunces text-xl font-medium text-ink mb-2">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};