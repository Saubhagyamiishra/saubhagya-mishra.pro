import { motion } from 'framer-motion';

const testimonials = [
  {
    quote:
      'Saubhagya turns ideas into polished digital systems with speed, clarity, and creativity. Rare combination.',
    author: 'R. Kapoor',
    role: 'Founder · HealthTech Startup',
    initials: 'RK',
  },
  {
    quote:
      'He thinks like a marketer, designs like an art director, and ships like an engineer. Pick any three.',
    author: 'A. Singh',
    role: 'Creative Director · Agency',
    initials: 'AS',
  },
  {
    quote:
      'Within a quarter our funnel was unrecognizable - clearer story, sharper UX, and a dashboard the team actually opens.',
    author: 'N. Patel',
    role: 'VP Marketing · D2C Brand',
    initials: 'NP',
  },
];

export const Testimonials = () => {
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
          Credibility · What People Say
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-ink max-w-4xl mb-16"
        >
          Quiet confidence, loud results.
        </motion.h2>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative p-8 bg-bg rounded-3xl border border-line shadow-soft group transition-all duration-300"
            >
              {/* Giant Quote Mark */}
              <div className="absolute top-6 left-6 font-instrument italic text-8xl text-accent opacity-10 pointer-events-none">
                "
              </div>

              {/* Quote */}
              <div className="relative z-10 mb-8">
                <p className="font-fraunces text-lg text-ink leading-relaxed">
                  {testimonial.quote.split('creativity').length > 1 ? (
                    <>
                      {testimonial.quote.split('creativity')[0]}
                      <span className="font-instrument italic">creativity</span>
                      {testimonial.quote.split('creativity')[1]}
                    </>
                  ) : testimonial.quote.split('engineer').length > 1 ? (
                    <>
                      {testimonial.quote.split('engineer')[0]}
                      <span className="font-instrument italic">engineer</span>
                      {testimonial.quote.split('engineer')[1]}
                    </>
                  ) : testimonial.quote.split('unrecognizable').length > 1 ? (
                    <>
                      {testimonial.quote.split('unrecognizable')[0]}
                      <span className="font-instrument italic">unrecognizable</span>
                      {testimonial.quote.split('unrecognizable')[1]}
                    </>
                  ) : (
                    testimonial.quote
                  )}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-line mb-6" />

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
                  <span className="font-fraunces font-medium text-paper text-sm">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-ink">{testimonial.author}</div>
                  <div className="text-sm text-muted">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
