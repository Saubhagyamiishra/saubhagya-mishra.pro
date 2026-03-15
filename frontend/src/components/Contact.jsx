import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { Card } from './ui/card';
import AIContactForm from './AIContactForm';

const Contact = () => {
  const [nodes, setNodes] = useState([]);
  const [showSuccessPulses, setShowSuccessPulses] = useState(false);

  // Generate network nodes
  useEffect(() => {
    const generatedNodes = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
    }));
    setNodes(generatedNodes);
  }, []);

  const handleFormSuccess = () => {
    setShowSuccessPulses(true);
    setTimeout(() => setShowSuccessPulses(false), 5000);
  };

  return (
    <section id="contact" className="relative py-32 bg-gradient-to-b from-[#0f0f14] to-[#0a0a0f] overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

      {/* Network visualization */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <defs>
          <linearGradient id="successLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="successNodeGradient">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
          </radialGradient>
        </defs>

        {/* Connection lines */}
        {nodes.map((node, i) =>
          nodes.slice(i + 1).map((otherNode, j) => {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
            );
            if (distance < 30) {
              return (
                <motion.line
                  key={`line-${i}-${j}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${otherNode.x}%`}
                  y2={`${otherNode.y}%`}
                  stroke="url(#successLineGradient)"
                  strokeWidth="1"
                  initial={{ opacity: 0.2 }}
                  animate={showSuccessPulses ? { opacity: [0.2, 0.8, 0.2] } : {}}
                  transition={{ duration: 0.8, repeat: showSuccessPulses ? 3 : 0 }}
                />
              );
            }
            return null;
          })
        )}

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
              initial={{ scale: 1, opacity: 0.3 }}
              animate={
                showSuccessPulses
                  ? {
                      scale: [1, 2.5, 1],
                      opacity: [0.3, 0, 0.3],
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                repeat: showSuccessPulses ? 2 : 0,
                delay: i * 0.1,
              }}
            />
            {/* Main node */}
            <motion.circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.size}
              fill="url(#successNodeGradient)"
              initial={{ opacity: 0.4 }}
              animate={showSuccessPulses ? { opacity: [0.4, 1, 0.4] } : {}}
              transition={{ duration: 0.6, repeat: showSuccessPulses ? 3 : 0, delay: i * 0.05 }}
              style={{
                filter: 'drop-shadow(0 0 6px #06b6d4)',
              }}
            />
          </motion.g>
        ))}

        {/* Success data pulses traveling through network */}
        <AnimatePresence>
          {showSuccessPulses &&
            nodes.map((node, i) =>
              nodes.slice(i + 1, i + 3).map((targetNode, j) => {
                const distance = Math.sqrt(
                  Math.pow(node.x - targetNode.x, 2) + Math.pow(node.y - targetNode.y, 2)
                );
                if (distance < 30) {
                  return (
                    <motion.circle
                      key={`pulse-${i}-${j}`}
                      r="3"
                      fill="#06b6d4"
                      style={{
                        filter: 'drop-shadow(0 0 10px #06b6d4)',
                      }}
                      initial={{
                        cx: `${node.x}%`,
                        cy: `${node.y}%`,
                        opacity: 0,
                      }}
                      animate={{
                        cx: [`${node.x}%`, `${targetNode.x}%`],
                        cy: [`${node.y}%`, `${targetNode.y}%`],
                        opacity: [0, 1, 1, 0],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 1.2,
                        repeat: 2,
                        ease: 'easeInOut',
                        delay: i * 0.15,
                      }}
                    />
                  );
                }
                return null;
              })
            )}
        </AnimatePresence>

        {/* Additional burst particles on success */}
        <AnimatePresence>
          {showSuccessPulses &&
            [...Array(8)].map((_, i) => {
              const startNode = nodes[Math.floor(Math.random() * nodes.length)];
              const endNode = nodes[Math.floor(Math.random() * nodes.length)];
              return (
                <motion.circle
                  key={`burst-${i}`}
                  r="2.5"
                  fill="#a855f7"
                  style={{
                    filter: 'drop-shadow(0 0 12px #a855f7)',
                  }}
                  initial={{
                    cx: `${startNode.x}%`,
                    cy: `${startNode.y}%`,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [`${startNode.x}%`, `${endNode.x}%`],
                    cy: [`${startNode.y}%`, `${endNode.y}%`],
                    opacity: [0, 1, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.8,
                    repeat: 1,
                    ease: 'easeInOut',
                    delay: Math.random() * 0.5,
                  }}
                />
              );
            })}
        </AnimatePresence>
      </svg>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-4 block">AI-Powered Project Collaboration</span>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Let's Build Something Extraordinary
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Share your vision and let our AI assistant help structure your project for premium collaboration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="p-6 bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-gray-800/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <a
                    href="mailto:saubhagyamiishra@gmail.com"
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                  >
                    saubhagyamiishra@gmail.com
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-gray-800/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Location</h3>
                  <p className="text-gray-400 text-sm">Boston, MA</p>
                </div>
              </div>
            </Card>

            <div className="hidden lg:block">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1617957743089-7639c938a7e9?w=400&q=80"
                  alt="Boston"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* AI Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="p-8 bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-gray-800/50 backdrop-blur-sm">
              <AIContactForm onSuccess={handleFormSuccess} />
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
