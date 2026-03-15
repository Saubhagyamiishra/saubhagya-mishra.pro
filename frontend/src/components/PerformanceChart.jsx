import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';

const PerformanceChart = () => {
  const [activeMetric, setActiveMetric] = useState('all');
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Realistic performance data over 6 months
  const data = [
    {
      month: 'Jan',
      performance: 65,
      ctr: 2.3,
      conversion: 3.2,
      cpl: 45,
      roi: 180,
    },
    {
      month: 'Feb',
      performance: 68,
      ctr: 2.5,
      conversion: 3.5,
      cpl: 42,
      roi: 195,
    },
    {
      month: 'Mar',
      performance: 72,
      ctr: 2.7,
      conversion: 3.8,
      cpl: 39,
      roi: 215,
    },
    {
      month: 'Apr',
      performance: 76,
      ctr: 2.9,
      conversion: 4.2,
      cpl: 36,
      roi: 240,
    },
    {
      month: 'May',
      performance: 81,
      ctr: 3.2,
      conversion: 4.6,
      cpl: 32,
      roi: 270,
    },
    {
      month: 'Jun',
      performance: 87,
      ctr: 3.5,
      conversion: 5.1,
      cpl: 28,
      roi: 310,
    },
  ];

  const metrics = [
    { key: 'performance', name: 'Performance Growth', color: '#06b6d4', unit: '%' },
    { key: 'ctr', name: 'Click-Through Rate', color: '#a855f7', unit: '%' },
    { key: 'conversion', name: 'Conversion Rate', color: '#ec4899', unit: '%' },
    { key: 'cpl', name: 'Cost Per Lead', color: '#f59e0b', unit: '$', inverse: true },
    { key: 'roi', name: 'ROI', color: '#10b981', unit: '%' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/95 backdrop-blur-md border border-purple-500/30 rounded-lg p-4 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
        >
          <p className="text-cyan-400 font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 py-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: entry.color,
                    boxShadow: `0 0 10px ${entry.color}`,
                  }}
                />
                <span className="text-gray-300 text-sm">{entry.name}:</span>
              </div>
              <span className="text-white font-semibold">
                {entry.name === 'Cost Per Lead' ? '$' : ''}
                {entry.value}
                {entry.name !== 'Cost Per Lead' ? '%' : ''}
              </span>
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  const CustomDot = (props) => {
    const { cx, cy, stroke, payload, dataKey } = props;
    const isHovered = hoveredMonth === payload.month;

    return (
      <motion.g
        animate={{
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Pulse animation */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={8}
          fill={stroke}
          opacity={0.2}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0, 0.2],
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
          r={4}
          fill={stroke}
          stroke="#0a0a0f"
          strokeWidth={2}
          style={{
            filter: `drop-shadow(0 0 ${isHovered ? '10px' : '5px'} ${stroke})`,
          }}
        />
        {/* Glow effect on hover */}
        {isHovered && (
          <circle
            cx={cx}
            cy={cy}
            r={6}
            fill="none"
            stroke={stroke}
            strokeWidth={2}
            opacity={0.5}
          />
        )}
      </motion.g>
    );
  };

  const toggleMetric = (metricKey) => {
    setActiveMetric(activeMetric === metricKey ? 'all' : metricKey);
  };

  return (
    <div className="w-full">
      {/* Metric toggles */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {metrics.map((metric) => (
          <motion.button
            key={metric.key}
            onClick={() => toggleMetric(metric.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeMetric === 'all' || activeMetric === metric.key
                ? 'bg-gray-800/80 border-2 backdrop-blur-sm'
                : 'bg-gray-900/50 border-2 border-gray-800/50 opacity-50'
            }`}
            style={{
              borderColor:
                activeMetric === 'all' || activeMetric === metric.key
                  ? metric.color
                  : undefined,
              boxShadow:
                activeMetric === 'all' || activeMetric === metric.key
                  ? `0 0 20px ${metric.color}40`
                  : undefined,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: metric.color,
                  boxShadow: `0 0 8px ${metric.color}`,
                }}
              />
              <span style={{ color: metric.color }}>{metric.name}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            onMouseMove={(e) => {
              if (e.activeLabel) {
                setHoveredMonth(e.activeLabel);
              }
            }}
            onMouseLeave={() => setHoveredMonth(null)}
          >
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(168, 85, 247, 0.1)"
              vertical={false}
            />

            {/* Axes */}
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
            />

            {/* Tooltip */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: '#06b6d4',
                strokeWidth: 2,
                strokeDasharray: '5 5',
              }}
            />

            {/* Lines */}
            {metrics.map((metric) => {
              const isActive = activeMetric === 'all' || activeMetric === metric.key;
              return (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  name={metric.name}
                  stroke={metric.color}
                  strokeWidth={isActive ? 3 : 1}
                  dot={isActive ? <CustomDot /> : false}
                  activeDot={isActive ? { r: 6 } : false}
                  opacity={isActive ? 1 : 0.2}
                  animationDuration={2000}
                  animationBegin={0}
                  style={{
                    filter: isActive ? `drop-shadow(0 0 8px ${metric.color})` : 'none',
                  }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Growth indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
        className="mt-6 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <svg
            className="w-5 h-5 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span className="text-emerald-400 text-sm font-semibold">
            +33.8% overall growth from Jan to Jun
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceChart;
