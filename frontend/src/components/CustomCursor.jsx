import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if device has fine pointer (mouse) and hover capability
    const checkDevice = () => {
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
      const hasHoverCapability = window.matchMedia('(hover: hover)').matches;
      const isDesktopDevice = hasFinePointer && hasHoverCapability;
      setIsDesktop(isDesktopDevice);
      return isDesktopDevice;
    };

    // Initial check
    const shouldShowCursor = checkDevice();

    // Only set up event listeners if on desktop
    if (!shouldShowCursor) {
      return;
    }

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, .hover-target')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    // Listen for device changes (rare, but good for responsive testing)
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const hoverQuery = window.matchMedia('(hover: hover)');
    
    const handleMediaChange = () => {
      checkDevice();
    };

    pointerQuery.addEventListener('change', handleMediaChange);
    hoverQuery.addEventListener('change', handleMediaChange);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      pointerQuery.removeEventListener('change', handleMediaChange);
      hoverQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // Don't render anything on mobile/tablet
  if (!isDesktop) {
    return null;
  }

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
      >
        <div className="w-full h-full rounded-full border-2 border-cyan-400 opacity-50" />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
      </motion.div>
    </>
  );
};

export default CustomCursor;