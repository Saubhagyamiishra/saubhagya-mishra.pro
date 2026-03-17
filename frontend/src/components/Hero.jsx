import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import MagneticButton from './MagneticButton';
import InteractiveName from './InteractiveName';
import ScrollReactor from './ScrollReactor';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const gridControls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Normalize to -20 to 20 for very subtle movement (reduced from -50 to 50)
      const x = ((clientX / innerWidth) - 0.5) * 40;
      const y = ((clientY / innerHeight) - 0.5) * 40;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingWords = [
    { text: 'Web Design', delay: 0, depth: 0.15 },
    { text: 'Analytics', delay: 0.2, depth: 0.25 },
    { text: 'UX Strategy', delay: 0.4, depth: 0.35 },
    { text: 'Data Viz', delay: 0.6, depth: 0.15 },
    { text: 'Growth', delay: 0.8, depth: 0.25 },
    { text: 'Systems', delay: 1, depth: 0.35 },
  ];

  const particles = [
    ...Array(12).fill(0).map((_, i) => ({
      id: i,
      depth: ((i % 3) + 1) * 0.12,
      size: Math.random() * 6 + 2,
      color: i % 2 === 0 
        ? 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)',
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }))
  ];

  // Handle scroll reactor activation
  const handleReactorActivate = async () => {
    // Trigger grid pulse animation
    await gridControls.start({
      opacity: [0.03, 0.15, 0.03],
      scale: [1, 1.05, 1],
      transition: { duration: 1.2, ease: 'easeInOut' }
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0a0a0f] w-full max-w-[100vw] overflow-hidden">
      {/* Container for all background effects - clipped */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated grid background with parallax */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]"
          animate={{
            x: mousePosition.x * 0.05,
            y: mousePosition.y * 0.05,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
      
      {/* Gradient orbs with parallax */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"
        animate={{
          x: -mousePosition.x * 0.15,
          y: -mousePosition.y * 0.15,
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          x: { type: 'spring', stiffness: 50, damping: 20 },
          y: { type: 'spring', stiffness: 50, damping: 20 },
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]"
        animate={{
          x: mousePosition.x * 0.15,
          y: mousePosition.y * 0.15,
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          x: { type: 'spring', stiffness: 50, damping: 20 },
          y: { type: 'spring', stiffness: 50, damping: 20 },
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Floating keywords with parallax */}
      {floatingWords.map((word, index) => (
        <motion.div
          key={word.text}
          className="absolute text-sm font-medium text-purple-400/30 hidden md:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            y: [0, -20, 0],
            x: [0 + mousePosition.x * word.depth * 0.3, Math.random() * 40 - 20 + mousePosition.x * word.depth * 0.3, 0 + mousePosition.x * word.depth * 0.3],
          }}
          style={{
            transform: `translate(${-mousePosition.x * word.depth * 0.3}px, ${-mousePosition.y * word.depth * 0.3}px)`,
            top: `${20 + index * 12}%`,
            left: `${10 + (index % 2) * 70}%`,
          }}
          transition={{
            opacity: { duration: 5, delay: word.delay, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 5, delay: word.delay, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 5, delay: word.delay, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {word.text}
        </motion.div>
      ))}

      {/* Floating UI particles with parallax */}
      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute rounded-full hidden md:block"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            transform: `translate(${-mousePosition.x * particle.depth * 0.3}px, ${-mousePosition.y * particle.depth * 0.3}px)`,
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
      </div>

      {/* Main content with subtle parallax */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        animate={{
          x: -mousePosition.x * 0.02,
          y: -mousePosition.y * 0.02,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: -mousePosition.x * 0.01,
          }}
          transition={{ 
            opacity: { duration: 0.8 },
            y: { duration: 0.8 },
            x: { type: 'spring', stiffness: 50, damping: 20 },
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-8"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300">Digital Experience Builder</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: -mousePosition.x * 0.02,
          }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.2 },
            y: { duration: 0.8, delay: 0.2 },
            x: { type: 'spring', stiffness: 50, damping: 20 },
          }}
          className="mb-6"
        >
          <InteractiveName />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: -mousePosition.x * 0.015,
          }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.4 },
            y: { duration: 0.8, delay: 0.4 },
            x: { type: 'spring', stiffness: 50, damping: 20 },
          }}
          className="text-xl md:text-2xl text-gray-400 mb-4 max-w-3xl mx-auto"
        >
          I build high-performance digital experiences.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: -mousePosition.x * 0.01,
          }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.6 },
            y: { duration: 0.8, delay: 0.6 },
            x: { type: 'spring', stiffness: 50, damping: 20 },
          }}
          className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto"
        >
          Crafting beautiful websites, analyzing data patterns, designing user strategies, and building interactive systems that drive growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: -mousePosition.x * 0.015,
          }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.8 },
            y: { duration: 0.8, delay: 0.8 },
            x: { type: 'spring', stiffness: 50, damping: 20 },
          }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <MagneticButton
            variant="primary"
            className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg overflow-hidden transition-all hover:scale-105"
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="flex items-center gap-2">
              Explore My Work
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </MagneticButton>

          <MagneticButton
            variant="outline"
            className="px-8 py-6 text-lg border-2 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 rounded-lg transition-all hover:scale-105 bg-transparent"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Enter My World
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll Reactor Orb - Responsive positioning optimized for mobile */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-20 sm:bottom-16 md:bottom-24"
        style={{ 
          zIndex: 100
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
        }}
        transition={{ 
          opacity: { duration: 0.8, delay: 1.2 },
          scale: { duration: 0.8, delay: 1.2 },
        }}
      >
        <ScrollReactor onActivate={handleReactorActivate} />
      </motion.div>
    </section>
  );
};

export default Hero;
