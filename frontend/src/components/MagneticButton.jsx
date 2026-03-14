import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

const MagneticButton = ({ children, className, onClick, variant = 'primary', type, ...rest }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    // Calculate distance from cursor to button center
    const distanceX = e.clientX - buttonCenterX;
    const distanceY = e.clientY - buttonCenterY;

    // Magnetic effect: move button toward cursor (scaled down for subtlety)
    const magneticStrength = 0.15; // Adjust for more/less magnetic pull
    const x = distanceX * magneticStrength;
    const y = distanceY * magneticStrength;

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      className={`group relative ${className}`}
      {...rest}
    >
      {/* Glow effect on hover */}
      <motion.div
        className={`absolute inset-0 rounded-lg blur-xl ${
          variant === 'primary'
            ? 'bg-gradient-to-r from-purple-500 to-purple-600'
            : 'bg-cyan-500'
        }`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 0.4 : 0,
          scale: isHovered ? 1.1 : 0.8,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
      />

      {/* Animated border */}
      <motion.div
        className={`absolute inset-0 rounded-lg ${
          variant === 'primary'
            ? 'bg-gradient-to-r from-purple-400 to-cyan-400'
            : 'bg-gradient-to-r from-cyan-400 to-blue-400'
        }`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 0.2 : 0,
        }}
        transition={{
          duration: 0.3,
        }}
      />

      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default MagneticButton;
