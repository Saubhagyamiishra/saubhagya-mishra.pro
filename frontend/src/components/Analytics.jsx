import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import { Card } from './ui/card';
import PerformanceChart from './PerformanceChart';

const Analytics = () => {
  const metrics = [
    {
      icon: TrendingUp,
      label: 'Conversion Rate',
      value: '34.7',
      unit: '%',
      change: '+12.3%',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      label: 'User Engagement',
      value: '89.2',
      unit: '%',
      change: '+8.7%',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Target,
      label: 'Goal Completion',
      value: '92.5',
      unit: '%',
      change: '+15.2%',
      color: 'from-violet-500 to-purple-500',
    },
    {
      icon: DollarSign,
      label: 'Revenue Impact',
      value: '2.4',
      unit: 'x',
      change: '+140%',
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-[#0f0f14] to-[#0a0a0f] overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider mb-4 block">Analytics</span>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Data-Driven Results
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every decision backed by metrics. Every optimization measured and validated.
          </p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="relative p-6 bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-gray-800/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-emerald-400 text-sm font-semibold">{metric.change}</span>
                  </div>
                  
                  <div className="mb-2">
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="text-4xl font-bold text-white"
                    >
                      {metric.value}
                    </motion.span>
                    <span className="text-2xl text-gray-400 ml-1">{metric.unit}</span>
                  </div>
                  
                  <p className="text-gray-500 text-sm">{metric.label}</p>

                  {/* Glow effect */}
                  <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Graph Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-8 bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-gray-800/50 backdrop-blur-sm">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Performance Trends</h3>
              <p className="text-gray-400 text-sm">
                Interactive analytics dashboard showing growth trajectory over 6 months
              </p>
            </div>

            <PerformanceChart />
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Analytics;