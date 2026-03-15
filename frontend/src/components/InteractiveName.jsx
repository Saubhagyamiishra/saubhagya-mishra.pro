import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const Letter = ({ letter, index, mousePosition, isHovering, containerRect }) => {
  const letterRef = useRef(null);
  const [letterRect, setLetterRect] = useState(null);

  useEffect(() => {
    if (letterRef.current) {
      setLetterRect(letterRef.current.getBoundingClientRect());
    }
  }, []);

  if (!letterRect || !containerRect) {
    return (
      <span ref={letterRef} className="inline-block text-6xl md:text-8xl font-bold text-white">
        {letter}
      </span>
    );
  }

  // Calculate distance from cursor to letter
  const letterCenterX = letterRect.left - containerRect.left + letterRect.width / 2;
  const letterCenterY = letterRect.top - containerRect.top + letterRect.height / 2;
  
  const dx = isHovering ? mousePosition.x - letterCenterX : 0;
  const dy = isHovering ? mousePosition.y - letterCenterY : 0;
  const distance = isHovering ? Math.sqrt(dx * dx + dy * dy) : Infinity;
  
  // Calculate effects based on distance
  const maxDistance = 200;
  const proximity = Math.max(0, 1 - distance / maxDistance);
  
  // Scale effect - letters grow when cursor is near
  const scale = 1 + proximity * 0.5;
  
  // Magnetic pull toward cursor
  const magnetStrength = 0.35;
  const pullX = distance > 0 ? (dx / distance) * proximity * 35 * magnetStrength : 0;
  const pullY = distance > 0 ? (dy / distance) * proximity * 35 * magnetStrength : 0;
  
  // Rotation based on cursor angle
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const rotation = proximity * (angle / 15);
  
  // Color intensity
  const cyanIntensity = proximity;
  const glowIntensity = proximity * 60;
  
  // 3D depth
  const rotateX = -dy * proximity * 0.15;
  const rotateY = dx * proximity * 0.15;

  return (
    <motion.span
      ref={letterRef}
      className="inline-block relative"
      style={{
        display: 'inline-block',
        position: 'relative',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{
        scale,
        x: pullX,
        y: pullY,
        rotateZ: rotation,
        rotateX,
        rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 25,
      }}
    >
      {/* Base letter */}
      <span
        className="text-6xl md:text-8xl font-bold"
        style={{
          display: 'inline-block',
          color: letter === ' ' ? 'transparent' : 'white',
          textShadow: `
            0 0 ${glowIntensity}px rgba(6,182,212,${cyanIntensity}),
            0 0 ${glowIntensity * 0.6}px rgba(6,182,212,${cyanIntensity * 0.8}),
            0 0 ${glowIntensity * 1.8}px rgba(168,85,247,${cyanIntensity * 0.6})
          `,
          filter: `
            drop-shadow(0 0 ${glowIntensity}px rgba(6,182,212,${cyanIntensity}))
            drop-shadow(0 0 ${glowIntensity * 0.5}px rgba(168,85,247,${cyanIntensity * 0.7}))
          `,
        }}
      >
        {letter}
      </span>

      {/* Cyan overlay that appears on hover */}
      <motion.span
        className="absolute inset-0 text-6xl md:text-8xl font-bold pointer-events-none"
        style={{
          color: 'transparent',
          background: `linear-gradient(135deg, rgba(6,182,212,${cyanIntensity * 1.2}) 0%, rgba(168,85,247,${cyanIntensity}) 100%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          opacity: proximity,
        }}
      >
        {letter}
      </motion.span>

      {/* Shimmer effect */}
      {proximity > 0.4 && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: [-30, 30],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 0.3,
          }}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.9) 50%, transparent 100%)',
            filter: 'blur(10px)',
          }}
        />
      )}

      {/* Particle effect for high proximity */}
      {proximity > 0.6 && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{
                top: '50%',
                left: '50%',
                background: i % 2 === 0 ? 'rgba(6,182,212,1)' : 'rgba(168,85,247,1)',
                boxShadow: `0 0 10px ${i % 2 === 0 ? 'rgba(6,182,212,0.8)' : 'rgba(168,85,247,0.8)'}`,
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                x: [0, (Math.random() - 0.5) * 50],
                y: [0, (Math.random() - 0.5) * 50],
                opacity: [1, 0.5, 0],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}

      {/* Energy ring effect for very close proximity */}
      {proximity > 0.7 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            border: '2px solid rgba(6,182,212,0.6)',
            borderRadius: '8px',
            boxShadow: '0 0 20px rgba(6,182,212,0.6), inset 0 0 20px rgba(6,182,212,0.3)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 0.3, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.span>
  );
};

const InteractiveName = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [containerRect, setContainerRect] = useState(null);
  
  const name = "Saubhagya Mishra";
  const letters = name.split('');

  useEffect(() => {
    if (containerRef.current) {
      setContainerRect(containerRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current && isHovering) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovering]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative inline-block cursor-pointer select-none"
      style={{ fontFamily: '"Space Grotesk", sans-serif' }}
    >
      {letters.map((letter, index) => (
        <Letter
          key={`${letter}-${index}`}
          letter={letter}
          index={index}
          mousePosition={mousePosition}
          isHovering={isHovering}
          containerRect={containerRect}
        />
      ))}
      
      {/* Hover hint */}
      {!isHovering && (
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-cyan-400/60 whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          hover to interact
        </motion.div>
      )}
    </div>
  );
};

export default InteractiveName;
