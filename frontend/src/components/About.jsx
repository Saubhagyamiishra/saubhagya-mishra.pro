import { motion } from 'framer-motion';
import { Code, TrendingUp, Target, Lightbulb, Megaphone, Zap } from 'lucide-react';
import { Card } from './ui/card';

const About = () => {
  const identityCards = [
    {
      icon: Code,
      title: 'Creative Builder',
      description: 'Crafting pixel-perfect digital experiences that blend aesthetics with functionality.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      title: 'Analytics Thinker',
      description: 'Transforming raw data into actionable insights through visualization and analysis.',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Target,
      title: 'Strategy Operator',
      description: 'Designing user journeys and growth funnels that drive measurable results.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Lightbulb,
      title: 'Problem Solver',
      description: 'Breaking down complex challenges into elegant, executable solutions.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Megaphone,
      title: 'Modern Marketer',
      description: 'Optimizing conversion paths through data-driven experimentation.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Zap,
      title: 'Execution-Driven',
      description: 'Turning ambitious ideas into shipped products with speed and precision.',
      gradient: 'from-rose-500 to-red-500',
    },
  ];

  return (
    <section id="about" className="relative py-32 bg-[#0a0a0f] overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.05),transparent_50%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-4 block">Who I Am</span>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Identity. Multiplied.
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Based in Boston. I love skiing down mountains, editing videos, dominating in FIFA, cooking new recipes, and building full-stack websites powered by AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {identityCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="hover-target"
              >
                <Card className="relative h-full p-6 bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group overflow-hidden">
                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${card.gradient} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
                  </div>

                  {/* Corner accent */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.gradient} opacity-5 blur-2xl`} />
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;