import { motion } from 'framer-motion';
import { Palette, BarChart3, Rocket, Cpu } from 'lucide-react';
import { Card } from './ui/card';

const Capabilities = () => {
  const skillCategories = [
    {
      icon: Palette,
      title: 'Design + Experience',
      color: 'purple',
      skills: [
        { name: 'Web Design', level: 95 },
        { name: 'UX/UI', level: 90 },
        { name: 'Landing Pages', level: 92 },
        { name: 'Visual Storytelling', level: 88 },
      ],
    },
    {
      icon: BarChart3,
      title: 'Analytics + Data',
      color: 'cyan',
      skills: [
        { name: 'Data Visualization', level: 93 },
        { name: 'Marketing Analytics', level: 87 },
        { name: 'Dashboard Design', level: 90 },
        { name: 'Conversion Analysis', level: 85 },
      ],
    },
    {
      icon: Rocket,
      title: 'Growth + Strategy',
      color: 'violet',
      skills: [
        { name: 'SEO Strategy', level: 84 },
        { name: 'Funnel Optimization', level: 89 },
        { name: 'A/B Testing', level: 86 },
        { name: 'Customer Journey', level: 88 },
      ],
    },
    {
      icon: Cpu,
      title: 'Systems + Execution',
      color: 'emerald',
      skills: [
        { name: 'Automation', level: 91 },
        { name: 'Process Building', level: 87 },
        { name: 'Full-Stack Dev', level: 92 },
        { name: 'AI Integration', level: 89 },
      ],
    },
  ];

  const colorMap = {
    purple: { from: 'from-purple-500', to: 'to-pink-500', bg: 'bg-purple-500' },
    cyan: { from: 'from-cyan-500', to: 'to-blue-500', bg: 'bg-cyan-500' },
    violet: { from: 'from-violet-500', to: 'to-purple-500', bg: 'bg-violet-500' },
    emerald: { from: 'from-emerald-500', to: 'to-teal-500', bg: 'bg-emerald-500' },
  };

  return (
    <section className="relative py-32 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f14] overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider mb-4 block">Capabilities</span>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Dashboard of Skills
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A multidisciplinary approach combining design, data, strategy, and execution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            const colors = colorMap[category.color];
            
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.15 }}
              >
                <Card className="relative p-8 bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-gray-800/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 h-full group">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${colors.from} ${colors.to}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                  </div>

                  {/* Skills */}
                  <div className="space-y-6">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skill.name}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300 font-medium">{skill.name}</span>
                          <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: categoryIndex * 0.15 + skillIndex * 0.1 }}
                            className="text-cyan-400 text-sm font-semibold"
                          >
                            {skill.level}%
                          </motion.span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1,
                              delay: categoryIndex * 0.15 + skillIndex * 0.1,
                              ease: 'easeOut',
                            }}
                            className={`h-full bg-gradient-to-r ${colors.from} ${colors.to} rounded-full relative`}
                          >
                            <div className="absolute right-0 top-0 w-2 h-full bg-white/30 blur-sm" />
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Glow effect */}
                  <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${colors.from} ${colors.to} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Capabilities;