import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Discover',
    description:
      'Understand the business, audience, product, and the actual opportunity hiding in plain sight.',
  },
  {
    number: '02',
    title: 'Strategize',
    description:
      'Map the user journey, funnel, content, and product experience as one connected system.',
  },
  {
    number: '03',
    title: 'Design',
    description:
      'Build the UX/UI system, wireframes, and visual direction - refined, not just decorated.',
  },
  {
    number: '04',
    title: 'Build',
    description:
      'Ship the websites, apps, automations, and dashboards. Real code, real systems, in production.',
  },
  {
    number: '05',
    title: 'Optimize',
    description:
      'Track performance, test improvements, and refine based on what the data actually says.',
  },
  {
    number: '06',
    title: 'Scale',
    description:
      'Turn the working system into a repeatable, documented, compounding growth engine.',
  },
];

export const ProcessTimeline = () => {
  const lineRef = useRef(null);
  const isInView = useInView(lineRef, { once: true, amount: 0.3 });

  return (
    <section className="relative bg-ink text-paper pt-32 pb-20 rounded-t-[32px] -mt-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="label-mono text-paper/40 mb-6"
        >
          Process · How I Work
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-paper max-w-4xl mb-20"
        >
          From blank page to compounding system.
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Progress Line */}
          <div
            ref={lineRef}
            className="absolute top-6 left-0 right-0 h-0.5 bg-paper/10 hidden lg:block"
          >
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent-2"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 2, delay: 0.3, ease: 'easeOut' }}
              style={{ transformOrigin: 'left' }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Dot */}
                <motion.div
                  className="relative w-12 h-12 mb-6 rounded-full bg-ink border-2 border-paper/20 hover:border-accent hover:shadow-[0_0_16px_var(--accent-glow)] transition-all duration-300 flex items-center justify-center cursor-pointer group"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="label-mono text-paper/60 group-hover:text-accent text-[10px]">
                    {step.number}
                  </span>
                </motion.div>

                {/* Content */}
                <h3 className="font-fraunces text-2xl font-medium text-paper mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-paper/60 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
