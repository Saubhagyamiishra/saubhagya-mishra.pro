import { motion } from 'framer-motion';
import { Search, Layout, Palette, Link2, Zap } from 'lucide-react';

const Process = () => {
  const steps = [
    {
      icon: Search,
      title: 'Understand',
      description: 'Deep dive into the problem space, user needs, and business goals.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Layout,
      title: 'Structure',
      description: 'Map out information architecture, user flows, and system design.',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Palette,
      title: 'Design',
      description: 'Craft beautiful interfaces that balance aesthetics with usability.',
      color: 'from-violet-500 to-purple-500',
    },
    {
      icon: Link2,
      title: 'Connect',
      description: 'Integrate systems, build features, and ensure everything works seamlessly.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Zap,
      title: 'Optimize',
      description: 'Measure, analyze, iterate. Continuous improvement through data.',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <section className="relative py-32 bg-[#0a0a0f] overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05),transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-4 block">Process</span>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            How I Work
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A systematic approach from concept to execution, optimized for speed and quality.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-500 to-purple-500 hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex items-center gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`inline-block p-6 md:p-8 bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-gray-800/50 backdrop-blur-sm rounded-lg hover:border-purple-500/30 transition-all duration-300 group ${isEven ? 'md:ml-auto' : 'md:mr-auto'} max-w-md`}
                    >
                      <div className={`flex items-center gap-4 mb-4 ${isEven ? 'md:flex-row-reverse md:justify-end' : 'md:justify-start'}`}>
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${step.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                      </div>
                      <p className="text-gray-400 leading-relaxed">{step.description}</p>
                      
                      {/* Step number */}
                      <div className={`mt-4 text-6xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent opacity-20 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                        0{index + 1}
                      </div>
                    </motion.div>
                  </div>

                  {/* Center node */}
                  <div className="hidden md:flex items-center justify-center w-16 h-16 relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                      className={`w-4 h-4 rounded-full bg-gradient-to-br ${step.color} shadow-[0_0_20px_rgba(168,85,247,0.6)]`}
                    >
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} animate-ping opacity-75`} />
                    </motion.div>
                  </div>

                  {/* Spacer for alignment */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;