import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';

const ScrollReactor = ({ onActivate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mouseDistance, setMouseDistance] = useState(100);
  const [particles, setParticles] = useState([]);
  const controls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const orbElement = document.getElementById('scroll-reactor-orb');
      if (orbElement) {
        const rect = orbElement.getBoundingClientRect();
        const orbCenterX = rect.left + rect.width / 2;
        const orbCenterY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - orbCenterX, 2) + 
          Math.pow(e.clientY - orbCenterY, 2)
        );
        
        setMouseDistance(distance);
        
        // Activate hover state when cursor is within 150px
        if (distance < 150) {
          setIsHovered(true);
        } else {
          setIsHovered(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate floating particles
  useEffect(() => {
    if (isHovered) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Math.random(),
        angle: (i / 8) * Math.PI * 2,
        distance: 60 + Math.random() * 20,
        delay: i * 0.05,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isHovered]);

  const handleClick = async () => {
    // Trigger activation animation
    await controls.start({
      scale: [1, 1.3, 0.9, 1],
      rotate: [0, 180, 360],
      transition: { duration: 0.6, ease: 'easeInOut' }
    });

    // Trigger grid pulse animation
    if (onActivate) {
      onActivate();
    }

    // Smooth scroll to next section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const proximityScale = Math.max(0, Math.min(1, (150 - mouseDistance) / 150));

  return (
    <div className="relative flex items-center justify-center">
      {/* Background glow */}
      <motion.div
        className="absolute w-48 h-48 bg-purple-600/20 rounded-full blur-[60px]"
        animate={{
          scale: isHovered ? [1, 1.4, 1] : [1, 1.1, 1],
          opacity: isHovered ? [0.4, 0.7, 0.4] : [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: isHovered ? 1.5 : 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <motion.div
        className="absolute w-48 h-48 bg-cyan-500/20 rounded-full blur-[60px]"
        animate={{
          scale: isHovered ? [1.4, 1, 1.4] : [1.1, 1, 1.1],
          opacity: isHovered ? [0.7, 0.4, 0.7] : [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: isHovered ? 1.5 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5
        }}
      />

      {/* Expanding pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full border-2"
          style={{
            borderColor: i % 2 === 0 
              ? 'rgba(168, 85, 247, 0.3)' 
              : 'rgba(6, 182, 212, 0.3)',
          }}
          initial={{ width: 80, height: 80, opacity: 0 }}
          animate={{
            width: isHovered ? [80, 200, 80] : [80, 160, 80],
            height: isHovered ? [80, 200, 80] : [80, 160, 80],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: isHovered ? 2 : 3,
            repeat: Infinity,
            ease: 'easeOut',
            delay: i * 0.6,
          }}
        />
      ))}

      {/* Hover particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: Math.random() > 0.5
              ? 'radial-gradient(circle, #a855f7 0%, transparent 70%)'
              : 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
            boxShadow: '0 0 10px currentColor',
          }}
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 0,
            scale: 0 
          }}
          animate={{
            x: Math.cos(particle.angle) * particle.distance,
            y: Math.sin(particle.angle) * particle.distance,
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
            delay: particle.delay,
          }}
        />
      ))}

      {/* Main orb container */}
      <motion.div
        id="scroll-reactor-orb"
        className="relative cursor-pointer group"
        animate={controls}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        style={{
          scale: 1 + proximityScale * 0.15,
        }}
      >
        {/* Glassmorphism orb */}
        <motion.div
          className="relative w-20 h-20 rounded-full overflow-hidden"
          style={{
            background: 'rgba(15, 15, 20, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: isHovered
              ? '0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(168, 85, 247, 0.3)'
              : '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)',
          }}
          animate={{
            boxShadow: isHovered
              ? [
                  '0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(6, 182, 212, 0.4)',
                  '0 0 60px rgba(168, 85, 247, 0.8), 0 0 100px rgba(6, 182, 212, 0.6)',
                  '0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(6, 182, 212, 0.4)',
                ]
              : [
                  '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)',
                  '0 0 30px rgba(168, 85, 247, 0.5), 0 0 50px rgba(6, 182, 212, 0.3)',
                  '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)',
                ]
          }}
          transition={{
            duration: isHovered ? 1 : 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/40 via-transparent to-cyan-500/40"
            animate={{
              opacity: isHovered ? [0.6, 1, 0.6] : [0.3, 0.5, 0.3],
              rotate: [0, 360],
            }}
            transition={{
              opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            }}
          />

          {/* Inner sparks */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={`spark-${i}`}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                top: `${25 + Math.sin(i) * 30}%`,
                left: `${25 + Math.cos(i) * 30}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeInOut'
              }}
            />
          ))}

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-sm font-bold tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: isHovered ? '0 0 20px rgba(168, 85, 247, 0.8)' : 'none',
              }}
              animate={{
                scale: isHovered ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              EXPLORE
            </motion.span>
          </div>
        </motion.div>

        {/* Orbital rings */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px solid rgba(168, 85, 247, 0.3)',
          }}
          animate={{
            rotate: [0, 360],
            scale: isHovered ? [1, 1.1, 1] : 1,
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px solid rgba(6, 182, 212, 0.3)',
          }}
          animate={{
            rotate: [360, 0],
            scale: isHovered ? [1.1, 1, 1.1] : 1,
          }}
          transition={{
            rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          }}
        />
      </motion.div>

      {/* Hint text */}
      <motion.div
        className="absolute -bottom-12 text-xs text-gray-500 font-medium tracking-wider"
        animate={{
          opacity: isHovered ? 0 : [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        SCROLL TO DISCOVER
      </motion.div>
    </div>
  );
};

export default ScrollReactor;
