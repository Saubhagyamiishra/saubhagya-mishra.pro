import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from './ui/card';

// Animated counter component
const AnimatedCounter = ({ end, duration = 2, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef();
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    const startValue = 0;
    const endValue = parseFloat(end);

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(startValue + (endValue - startValue) * easeOutQuart);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={nodeRef}>
      {prefix}
      {count.toFixed(end % 1 !== 0 ? 1 : 0)}
      {suffix}
    </span>
  );
};

const AnalyticsDashboard = () => {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Main performance data
  const performanceData = [
    { month: 'Jan', value: 65, conversions: 320, cpl: 45, engagement: 72 },
    { month: 'Feb', value: 70, conversions: 385, cpl: 42, engagement: 75 },
    { month: 'Mar', value: 74, conversions: 445, cpl: 39, engagement: 78 },
    { month: 'Apr', value: 79, conversions: 520, cpl: 36, engagement: 82 },
    { month: 'May', value: 84, conversions: 615, cpl: 33, engagement: 86 },
    { month: 'Jun', value: 92, conversions: 730, cpl: 28, engagement: 91 },
  ];

  // Sparkline data
  const conversionSparkline = performanceData.map((d) => ({ value: d.conversions }));
  const cplSparkline = performanceData.map((d) => ({ value: d.cpl }));

  // KPI metrics
  const kpiMetrics = [
    {
      label: 'Ad Performance',
      value: 41.5,
      suffix: '%',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-400',
    },
    {
      label: 'Conversion Rate',
      value: 18,
      suffix: '%',
      icon: ArrowUp,
      color: 'from-cyan-500 to-blue-500',
      textColor: 'text-cyan-400',
    },
    {
      label: 'CTR Growth',
      value: 12,
      suffix: '%',
      icon: TrendingUp,
      color: 'from-violet-500 to-purple-500',
      textColor: 'text-violet-400',
    },
    {
      label: 'CPL Reduction',
      value: 22,
      suffix: '%',
      prefix: '-',
      icon: ArrowDown,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-400',
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 shadow-[0_0_40px_rgba(6,182,212,0.3)]"
        >
          <p className="text-cyan-400 font-bold mb-3 text-sm">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-6">
              <span className="text-gray-400 text-xs">Performance</span>
              <span className="text-white font-semibold">{payload[0].value}%</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-gray-400 text-xs">Conversions</span>
              <span className="text-purple-400 font-semibold">
                {payload[0].payload.conversions}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-gray-400 text-xs">CPL</span>
              <span className="text-emerald-400 font-semibold">${payload[0].payload.cpl}</span>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-8">
      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative p-5 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group overflow-hidden">
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                      {metric.label}
                    </span>
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${metric.color}`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="flex items-end gap-2">
                    <span className={`text-3xl font-bold ${metric.textColor}`}>
                      <AnimatedCounter
                        end={metric.value}
                        suffix={metric.suffix}
                        prefix={metric.prefix}
                      />
                    </span>
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="flex items-center gap-1 mb-1"
                    >
                      <ArrowUp className={`w-3 h-3 ${metric.textColor}`} />
                      <span className={`text-xs font-semibold ${metric.textColor}`}>
                        {metric.label === 'CPL Reduction' ? 'saving' : 'growth'}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 5,
              ease: 'linear',
            }}
          />

          <div className="relative z-10">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-1">Growth Trajectory</h3>
              <p className="text-gray-400 text-sm">6-month performance overview</p>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <AreaChart
                data={performanceData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                onMouseMove={(e) => {
                  if (e.activeLabel) {
                    setHoveredMonth(e.activeLabel);
                  }
                }}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  
                  {/* Traveling glow */}
                  <linearGradient id="glowGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.8}>
                      <animate
                        attributeName="offset"
                        values="0; 0.5; 1"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </stop>
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(168, 85, 247, 0.08)"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(168, 85, 247, 0.2)' }}
                />

                <YAxis
                  stroke="#6b7280"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(168, 85, 247, 0.2)' }}
                  domain={[60, 100]}
                />

                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '5 5' }} />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  fill="url(#colorGradient)"
                  animationDuration={2000}
                  animationBegin={0}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    const isHovered = hoveredMonth === payload.month;
                    return (
                      <g>
                        {/* Pulse ring */}
                        <motion.circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 12 : 8}
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          opacity={isHovered ? 0.6 : 0.3}
                          animate={{
                            r: [8, 12, 8],
                            opacity: [0.3, 0, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                        {/* Main dot */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 5 : 4}
                          fill="#06b6d4"
                          stroke="#0a0a0f"
                          strokeWidth={2}
                          style={{
                            filter: `drop-shadow(0 0 ${isHovered ? '12px' : '6px'} #06b6d4)`,
                          }}
                        />
                      </g>
                    );
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Supporting Micro Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Conversions Sparkline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-4 bg-gradient-to-br from-gray-900/70 to-gray-900/30 border border-gray-800/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-xs font-medium uppercase">Conversions</span>
              <span className="text-purple-400 text-sm font-semibold">+128%</span>
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={conversionSparkline}>
                <defs>
                  <linearGradient id="convGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fill="url(#convGradient)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* CPL Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-4 bg-gradient-to-br from-gray-900/70 to-gray-900/30 border border-gray-800/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-xs font-medium uppercase">Cost Per Lead</span>
              <span className="text-emerald-400 text-sm font-semibold">-38%</span>
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={cplSparkline}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* ROI Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-4 bg-gradient-to-br from-gray-900/70 to-gray-900/30 border border-gray-800/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-xs font-medium uppercase">ROI Growth</span>
              <span className="text-cyan-400 text-sm font-semibold">+72%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '72%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full relative"
                >
                  <div className="absolute right-0 top-0 w-2 h-full bg-white/30 blur-sm" />
                </motion.div>
              </div>
              <span className="text-2xl font-bold text-cyan-400">
                <AnimatedCounter end={72} suffix="%" duration={1.5} />
              </span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
