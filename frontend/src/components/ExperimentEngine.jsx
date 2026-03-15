import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Beaker, Sparkles, Zap, Activity, Layers, Box } from 'lucide-react';
import { Card } from './ui/card';

const ExperimentEngine = () => {
  const sectionRef = useRef(null);
  const [activeExperiment, setActiveExperiment] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [isActivated, setIsActivated] = useState(false);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Generate network nodes
  useEffect(() => {
    const generatedNodes = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
    }));
    setNodes(generatedNodes);
  }, []);

  // Activate system when in view
  useEffect(() => {
    if (isInView) {
      setTimeout(() => setIsActivated(true), 500);
    }
  }, [isInView]);

  const experiments = [
    {
      id: 'ai',
      icon: Sparkles,
      title: 'AI Prompt Engineering',
      description: 'Experiments with GPT-4 for creative content generation',
      color: 'from-purple-500 to-pink-500',
      animation: 'neural',
    },
    {
      id: 'performance',
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Testing strategies for sub-second load times',
      color: 'from-cyan-500 to-blue-500',
      animation: 'metrics',
    },
    {
      id: '3d',
      icon: Box,
      title: '3D Card Interactions',
      description: 'Exploring depth and perspective in web interfaces',
      color: 'from-violet-500 to-purple-500',
      animation: 'rotate3d',
    },
    {
      id: 'micro',
      icon: Activity,
      title: 'Micro-interaction Library',
      description: 'Collection of delightful hover effects and animations',
      color: 'from-amber-500 to-orange-500',
      animation: 'microui',
    },
    {
      id: 'dataviz',
      icon: Activity,
      title: 'Data Visualization Toolkit',
      description: 'Custom charts and graphs for complex datasets',
      color: 'from-emerald-500 to-teal-500',
      animation: 'charts',
    },
    {
      id: 'glass',
      icon: Layers,
      title: 'Glassmorphism Components',
      description: 'Modern UI components with frosted glass effects',
      color: 'from-rose-500 to-pink-500',
      animation: 'glass',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f14] overflow-hidden"
    >
      {/* Animated grid background */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"
        animate={isActivated ? { opacity: [0.3, 1, 0.3] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Network nodes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Connection lines */}
        {isActivated &&
          nodes.map((node, i) =>
            nodes.slice(i + 1).map((otherNode, j) => {
              const distance = Math.sqrt(
                Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
              );
              if (distance < 25) {
                const lineId = `line-${i}-${j}`;
                return (
                  <g key={lineId}>
                    <motion.line
                      id={lineId}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${otherNode.x}%`}
                      y2={`${otherNode.y}%`}
                      stroke="url(#lineGradient)"
                      strokeWidth="1"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.3 }}
                      transition={{ duration: 2, delay: i * 0.1 }}
                    />
                    
                    {/* Traveling data pulse */}
                    <motion.circle
                      r="2"
                      fill="#06b6d4"
                      style={{
                        filter: 'drop-shadow(0 0 6px #06b6d4)',
                      }}
                      initial={{
                        cx: `${node.x}%`,
                        cy: `${node.y}%`,
                        opacity: 0,
                      }}
                      animate={{
                        cx: [`${node.x}%`, `${otherNode.x}%`],
                        cy: [`${node.y}%`, `${otherNode.y}%`],
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 5 + 3,
                        ease: 'linear',
                        delay: Math.random() * 8,
                      }}
                    />
                  </g>
                );
              }
              return null;
            })
          )}

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
          </radialGradient>
        </defs>

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g key={`node-${i}`}>
            {/* Pulse ring */}
            <motion.circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.size * 2}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isActivated
                  ? {
                      scale: [1, 2, 1],
                      opacity: [0.5, 0, 0.5],
                    }
                  : {}
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
            {/* Main node */}
            <motion.circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.size}
              fill="url(#nodeGradient)"
              initial={{ scale: 0 }}
              animate={isActivated ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              style={{
                filter: 'drop-shadow(0 0 8px #06b6d4)',
              }}
            />
          </motion.g>
        ))}

        {/* Traveling pulses */}
        {activeExperiment &&
          nodes.slice(0, 5).map((node, i) => (
            <motion.circle
              key={`pulse-${i}`}
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="3"
              fill="#06b6d4"
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 3, 0],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        
        {/* Random data bursts - occasional pulses even when inactive */}
        {isActivated && nodes.slice(0, 8).map((node, i) => {
          const targetNode = nodes[(i + 3) % nodes.length];
          return (
            <motion.circle
              key={`burst-${i}`}
              r="2.5"
              fill="#a855f7"
              style={{
                filter: 'drop-shadow(0 0 8px #a855f7)',
              }}
              initial={{
                cx: `${node.x}%`,
                cy: `${node.y}%`,
                opacity: 0,
              }}
              animate={{
                cx: [`${node.x}%`, `${targetNode.x}%`],
                cy: [`${node.y}%`, `${targetNode.y}%`],
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 6 + 4,
                ease: 'easeInOut',
                delay: Math.random() * 10 + i * 0.5,
              }}
            />
          );
        })}
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header with activation status */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-6">
            <Beaker className="w-4 h-4 text-purple-400" />
            <motion.span
              className="text-sm text-purple-300"
              animate={isActivated ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isActivated ? 'Experiment Engine Activated' : 'Initializing...'}
            </motion.span>
            {isActivated && (
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ boxShadow: '0 0 10px #34d399' }}
              />
            )}
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            The Lab
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A living experimentation engine exploring cutting-edge web technologies and interactive experiences.
          </p>
        </motion.div>

        {/* Experiment cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((experiment, index) => {
            const Icon = experiment.icon;
            const isActive = activeExperiment === experiment.id;

            return (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  rotateX: 5,
                  rotateY: 5,
                  scale: 1.02,
                }}
                onHoverStart={() => setActiveExperiment(experiment.id)}
                onHoverEnd={() => setActiveExperiment(null)}
                className="hover-target perspective-1000"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Card className="relative h-full overflow-hidden bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-gray-800/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group">
                  {/* Animated background effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${experiment.color} opacity-0 group-hover:opacity-10`}
                    animate={
                      isActive
                        ? {
                            opacity: [0.1, 0.2, 0.1],
                          }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Experiment-specific animations */}
                  {isActive && (
                    <>
                      {/* Neural network for AI */}
                      {experiment.animation === 'neural' && (
                        <motion.div className="absolute inset-0 pointer-events-none">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 rounded-full bg-purple-400"
                              style={{
                                left: `${20 + i * 15}%`,
                                top: '50%',
                              }}
                              animate={{
                                y: [-10, 10, -10],
                                opacity: [0.3, 1, 0.3],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </motion.div>
                      )}

                      {/* Performance metrics */}
                      {experiment.animation === 'metrics' && (
                        <motion.div className="absolute top-4 right-4 text-cyan-400 text-xs font-mono">
                          <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            98% optimized
                          </motion.div>
                        </motion.div>
                      )}

                      {/* 3D rotation indicator */}
                      {experiment.animation === 'rotate3d' && (
                        <motion.div
                          className="absolute inset-0 border-2 border-violet-500/30 rounded-lg"
                          animate={{ rotateY: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                          style={{ transformStyle: 'preserve-3d' }}
                        />
                      )}

                      {/* Micro UI pulses */}
                      {experiment.animation === 'microui' && (
                        <motion.div className="absolute inset-0 pointer-events-none">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-2 h-2 rounded-full bg-amber-400"
                              style={{
                                left: `${25 + i * 20}%`,
                                top: `${30 + i * 15}%`,
                              }}
                              animate={{
                                scale: [0, 1.5, 0],
                                opacity: [1, 0],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.3,
                              }}
                            />
                          ))}
                        </motion.div>
                      )}

                      {/* Data pulses for visualization */}
                      {experiment.animation === 'charts' && (
                        <motion.div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-end gap-1 h-8">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <motion.div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t"
                                animate={{
                                  height: ['20%', '80%', '20%'],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Glass reflection effect */}
                      {experiment.animation === 'glass' && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg"
                          animate={{
                            x: [-100, 100],
                            opacity: [0, 0.3, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      )}
                    </>
                  )}

                  {/* Card content */}
                  <div className="relative z-10 p-6">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${experiment.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
                      {experiment.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{experiment.description}</p>

                    {/* Status indicator */}
                    <div className="mt-4 flex items-center gap-2">
                      <motion.div
                        className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-gray-600'}`}
                        animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={isActive ? { boxShadow: '0 0 10px #34d399' } : {}}
                      />
                      <span className={`text-xs ${isActive ? 'text-emerald-400' : 'text-gray-600'}`}>
                        {isActive ? 'Active' : 'Standby'}
                      </span>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${experiment.color} opacity-5 blur-2xl`} />
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* System status footer */}
        {isActivated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900/50 border border-purple-500/20 rounded-full backdrop-blur-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Activity className="w-4 h-4 text-cyan-400" />
              </motion.div>
              <span className="text-sm text-gray-400">
                {activeExperiment ? 'Experiment in progress...' : '6 experiments ready • System online'}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ExperimentEngine;
