import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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

  useEffect(() => {
    if (isHovered) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Math.random(),
        angle: (i / 12) * Math.PI * 2,
        distance: 70 + Math.random() * 30,
        delay: i * 0.04,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isHovered]);

  const handleClick = async () => {
    await controls.start({
      scale: [1, 1.2, 0.95, 1],
      rotate: [0, 90, 180, 360],
      transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }
    });

    if (onActivate) {
      onActivate();
    }

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
    <div className="relative flex items-center justify-center z-50" style={{ minHeight: '140px', minWidth: '140px' }}>
      {/* Massive ambient glow layers */}
      <motion.div
        className="absolute w-80 h-80 rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(6,182,212,0.2) 50%, transparent 70%)',
        }}
        animate={{
          scale: isHovered ? [1, 1.3, 1] : [1, 1.15, 1],
          opacity: isHovered ? [0.4, 0.7, 0.4] : [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: isHovered ? 2 : 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <motion.div
        className="absolute w-80 h-80 rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)',
        }}
        animate={{
          scale: isHovered ? [1.3, 1, 1.3] : [1.15, 1, 1.15],
          opacity: isHovered ? [0.7, 0.4, 0.7] : [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: isHovered ? 2 : 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
      />

      {/* Concentric glowing rings - 3 layers */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full"
          style={{
            border: '2px solid',
            borderColor: i % 2 === 0 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(6, 182, 212, 0.4)',
          }}
          initial={{ width: 100, height: 100, opacity: 0 }}
          animate={{
            width: isHovered ? [100, 240, 100] : [100, 200, 100],
            height: isHovered ? [100, 240, 100] : [100, 200, 100],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: isHovered ? 2.5 : 3.5,
            repeat: Infinity,
            ease: 'easeOut',
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Hover particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: Math.random() > 0.5
                ? 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)'
                : 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
              boxShadow: '0 0 12px currentColor',
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
              scale: [0, 1.8, 0],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeOut',
              delay: particle.delay,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main orb container */}
      <motion.div
        id="scroll-reactor-orb"
        className="relative cursor-pointer group"
        animate={controls}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          scale: 1 + proximityScale * 0.1,
        }}
      >
        {/* Premium glassmorphism orb with layers */}
        <motion.div
          className="relative w-28 h-28 rounded-full overflow-hidden"
          style={{
            background: 'rgba(10, 10, 15, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(139, 92, 246, 0.3)',
          }}
          animate={{
            borderColor: isHovered
              ? ['rgba(139, 92, 246, 0.3)', 'rgba(6, 182, 212, 0.6)', 'rgba(139, 92, 246, 0.3)']
              : ['rgba(139, 92, 246, 0.3)', 'rgba(6, 182, 212, 0.3)', 'rgba(139, 92, 246, 0.3)'],
            boxShadow: isHovered
              ? [
                  '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(6, 182, 212, 0.3), inset 0 0 30px rgba(139, 92, 246, 0.2)',
                  '0 0 50px rgba(139, 92, 246, 0.7), 0 0 100px rgba(6, 182, 212, 0.5), inset 0 0 40px rgba(6, 182, 212, 0.3)',
                  '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(6, 182, 212, 0.3), inset 0 0 30px rgba(139, 92, 246, 0.2)',
                ]
              : [
                  '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)',
                  '0 0 25px rgba(139, 92, 246, 0.4), 0 0 50px rgba(6, 182, 212, 0.25)',
                  '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)',
                ]
          }}
          transition={{
            duration: isHovered ? 2 : 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* INNER CORE - Liquid plasma energy effect - Layer 1 */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.6) 0%, rgba(6, 182, 212, 0.4) 40%, transparent 70%)',
              filter: 'blur(8px)',
            }}
            animate={{
              rotate: [0, 360],
              scale: isHovered ? [1, 1.2, 1] : [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: isHovered ? 8 : 12, repeat: Infinity, ease: 'linear' },
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
          />

          {/* INNER CORE - Plasma swirl - Layer 2 */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'conic-gradient(from 0deg, rgba(139, 92, 246, 0.5), rgba(6, 182, 212, 0.5), rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.5))',
              filter: 'blur(12px)',
            }}
            animate={{
              rotate: [360, 0],
              opacity: isHovered ? [0.4, 0.7, 0.4] : [0.3, 0.5, 0.3],
            }}
            transition={{
              rotate: { duration: isHovered ? 10 : 15, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          />

          {/* INNER CORE - Rotating light patterns - Layer 3 */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 70% 70%, rgba(6, 182, 212, 0.6) 0%, transparent 50%)',
              filter: 'blur(10px)',
            }}
            animate={{
              rotate: [0, 360],
              x: isHovered ? [0, 5, 0, -5, 0] : [0, 3, 0, -3, 0],
              y: isHovered ? [0, -5, 0, 5, 0] : [0, -3, 0, 3, 0],
            }}
            transition={{
              rotate: { duration: isHovered ? 6 : 10, repeat: Infinity, ease: 'linear' },
              x: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            }}
          />

          {/* INNER CORE - Flowing inner glow - Layer 4 */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.4) 0%, rgba(6, 182, 212, 0.3) 30%, transparent 60%)',
              filter: 'blur(6px)',
            }}
            animate={{
              scale: isHovered ? [1, 1.3, 1] : [1, 1.15, 1],
              opacity: isHovered ? [0.5, 0.8, 0.5] : [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: isHovered ? 2 : 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Energy sparkles inside */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={`spark-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: i % 2 === 0 ? '#8b5cf6' : '#06b6d4',
                boxShadow: `0 0 10px ${i % 2 === 0 ? '#8b5cf6' : '#06b6d4'}`,
                top: `${20 + Math.sin(i * 1.2) * 25}%`,
                left: `${20 + Math.cos(i * 1.2) * 25}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 2, 0],
              }}
              transition={{
                duration: isHovered ? 1.5 : 2.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut'
              }}
            />
          ))}

          {/* Center icon with rotation on hover */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div
              animate={{
                rotate: isHovered ? [0, 360] : 0,
                scale: isHovered ? [1, 1.15, 1] : 1,
              }}
              transition={{
                rotate: { duration: 2, ease: 'easeInOut' },
                scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <ChevronDown 
                className="w-8 h-8" 
                style={{
                  color: '#fff',
                  filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.8))',
                }}
              />
            </motion.div>
          </div>

          {/* Overlay gradient for depth */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(10, 10, 15, 0.3) 100%)',
            }}
          />
        </motion.div>

        {/* Outer orbital rings */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px solid rgba(139, 92, 246, 0.4)',
            width: '112px',
            height: '112px',
          }}
          animate={{
            rotate: [0, 360],
            scale: isHovered ? [1, 1.05, 1] : 1,
          }}
          transition={{
            rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px solid rgba(6, 182, 212, 0.4)',
            width: '112px',
            height: '112px',
          }}
          animate={{
            rotate: [360, 0],
            scale: isHovered ? [1.05, 1, 1.05] : 1,
          }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          }}
        />
      </motion.div>

      {/* Hint text */}
      <motion.div
        className="absolute -bottom-14 text-xs font-medium tracking-widest"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
        animate={{
          opacity: isHovered ? 0 : [0.4, 1, 0.4],
        }}
        transition={{
          duration: 2.5,
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
