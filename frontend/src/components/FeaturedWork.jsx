import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

const FeaturedWork = () => {
  const projects = [
    {
      title: 'AI-Powered Analytics Dashboard',
      problem: 'Complex data visualization needed for enterprise clients',
      solution: 'Built an interactive dashboard with real-time insights, reducing analysis time by 70%',
      tags: ['React', 'D3.js', 'Python', 'AI'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'E-Commerce Platform Redesign',
      problem: 'High cart abandonment rate and poor mobile experience',
      solution: 'Redesigned UX flow and optimized checkout, increasing conversion by 45%',
      tags: ['UI/UX', 'Figma', 'A/B Testing', 'CRO'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Marketing Automation Suite',
      problem: 'Manual processes limiting growth team velocity',
      solution: 'Created automated workflows that scaled operations 10x with same team size',
      tags: ['Automation', 'APIs', 'Integration', 'Growth'],
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      title: 'SaaS Landing Page Engine',
      problem: 'Slow time-to-market for new product launches',
      solution: 'Developed modular system for rapid landing page creation with built-in analytics',
      tags: ['Next.js', 'SEO', 'Performance', 'Analytics'],
      image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80',
      gradient: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section id="work" className="relative py-32 bg-[#0a0a0f] overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.05),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-4 block">Portfolio</span>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Featured Work
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real projects. Real impact. Solutions that solve problems and drive results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="hover-target group"
            >
              <Card className="relative h-full overflow-hidden bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-gray-800/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Button
                      size="icon"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
                    >
                      <ExternalLink className="w-5 h-5 text-white" />
                    </Button>
                    <Button
                      size="icon"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
                    >
                      <Github className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
                    {project.title}
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <span className="text-gray-500 text-sm font-semibold">Problem:</span>
                      <p className="text-gray-400 text-sm mt-1">{project.problem}</p>
                    </div>
                    <div>
                      <span className="text-cyan-400 text-sm font-semibold">Solution:</span>
                      <p className="text-gray-300 text-sm mt-1">{project.solution}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-gray-800/50 text-gray-300 rounded-full border border-gray-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Glow effect */}
                <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`} />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWork;