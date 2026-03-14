import { motion } from 'framer-motion';
import { Beaker, Sparkles } from 'lucide-react';
import { Card } from './ui/card';

const Lab = () => {
  const experiments = [
    {
      title: 'Micro-interaction Library',
      description: 'Collection of delightful hover effects and animations',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
      tags: ['UI', 'Animation'],
    },
    {
      title: 'Data Visualization Toolkit',
      description: 'Custom charts and graphs for complex datasets',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
      tags: ['D3.js', 'Charts'],
    },
    {
      title: 'Glassmorphism Components',
      description: 'Modern UI components with frosted glass effects',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
      tags: ['CSS', 'Design'],
    },
    {
      title: 'AI Prompt Engineering',
      description: 'Experiments with GPT-4 for creative content generation',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
      tags: ['AI', 'Automation'],
    },
    {
      title: 'Performance Optimization',
      description: 'Testing strategies for sub-second load times',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
      tags: ['Performance', 'Web'],
    },
    {
      title: '3D Card Interactions',
      description: 'Exploring depth and perspective in web interfaces',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
      tags: ['3D', 'WebGL'],
    },
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f14] overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-6">
            <Beaker className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Experimental Zone</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            The Lab
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A playground for exploring new ideas, testing concepts, and pushing the boundaries of what's possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((experiment, index) => (
            <motion.div
              key={experiment.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="hover-target"
            >
              <Card className="relative h-full overflow-hidden bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-gray-800/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={experiment.image}
                    alt={experiment.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                  
                  {/* Sparkles icon on hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-2 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30">
                      <Sparkles className="w-4 h-4 text-purple-300" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
                    {experiment.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{experiment.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {experiment.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium bg-purple-500/10 text-purple-300 rounded border border-purple-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Lab;