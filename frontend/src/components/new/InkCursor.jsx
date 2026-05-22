import { useEffect, useRef } from 'react';

export const InkCursor = () => {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Only enable on devices with fine pointer (desktop/mouse)
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const dpr = window.devicePixelRatio || 1;

    // Set up canvas size
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    // Get accent color from CSS variable
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent')
      .trim() || '#ff5a1f';

    const accentColor2 = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-2')
      .trim() || '#ffb547';

    // Track mouse position
    const handleMouseMove = (e) => {
      const now = Date.now();
      
      // Add tiny jitter for hand-drawn feel
      const jitterX = (Math.random() - 0.5) * 0.5;
      const jitterY = (Math.random() - 0.5) * 0.5;

      pointsRef.current.push({
        x: e.clientX + jitterX,
        y: e.clientY + jitterY,
        time: now,
      });

      // Keep only recent points (18-22 based on speed)
      const maxPoints = 22;
      if (pointsRef.current.length > maxPoints) {
        pointsRef.current.shift();
      }
    };

    // Calculate velocity between two points
    const calculateVelocity = (p1, p2) => {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dt = (p2.time - p1.time) / 1000; // seconds
      if (dt === 0) return 0;
      return Math.sqrt(dx * dx + dy * dy) / dt;
    };

    // Check if hovering interactive element
    const isHoveringInteractive = (x, y) => {
      const elem = document.elementFromPoint(x, y);
      if (!elem) return false;
      return (
        elem.tagName === 'A' ||
        elem.tagName === 'BUTTON' ||
        elem.classList.contains('proj-card') ||
        elem.hasAttribute('data-modal') ||
        elem.closest('a') ||
        elem.closest('button')
      );
    };

    // Animation loop
    const animate = () => {
      const now = Date.now();
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Age and remove old points even without movement
      const ageThreshold = 800; // ms
      pointsRef.current = pointsRef.current.filter((point) => now - point.time < ageThreshold);

      const points = pointsRef.current;
      if (points.length < 2) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Calculate average velocity for speed responsiveness
      let totalVelocity = 0;
      for (let i = 1; i < points.length; i++) {
        totalVelocity += calculateVelocity(points[i - 1], points[i]);
      }
      const avgVelocity = totalVelocity / (points.length - 1);
      
      // Scale trail properties based on velocity
      const velocityFactor = Math.min(avgVelocity / 1000, 2); // Normalize velocity
      const maxWidth = 6 + velocityFactor * 2; // 6-8px based on speed
      const trailLength = Math.max(0.5, velocityFactor); // Shorter when slow

      // Check if hovering interactive element
      const lastPoint = points[points.length - 1];
      const isHovering = lastPoint ? isHoveringInteractive(lastPoint.x, lastPoint.y) : false;
      const strokeColor = isHovering ? accentColor2 : accentColor;

      // Draw the trail with two passes for ink bleed effect
      const drawTrail = (blur, opacity, widthScale) => {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (blur > 0) {
          ctx.shadowBlur = blur;
          ctx.shadowColor = strokeColor;
        }

        // Draw smooth curve through points
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const progress = (i / (points.length - 1)) * trailLength;

          // Taper width and opacity
          const width = progress * maxWidth * widthScale;
          const alpha = progress * 0.85 * opacity;

          ctx.strokeStyle = strokeColor.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
          ctx.lineWidth = width;

          if (i === 0) {
            ctx.moveTo(p1.x, p1.y);
          }

          // Use quadratic curve for smoothness
          if (i < points.length - 2) {
            const p3 = points[i + 2];
            const midX = (p2.x + p3.x) / 2;
            const midY = (p2.y + p3.y) / 2;
            ctx.quadraticCurveTo(p2.x, p2.y, midX, midY);
          } else {
            ctx.lineTo(p2.x, p2.y);
          }

          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(p2.x, p2.y);
        }

        ctx.shadowBlur = 0;
      };

      // First pass: soft bleed/glow
      drawTrail(6, 0.3, 1.4);

      // Second pass: crisp top layer
      drawTrail(0, 1, 1);

      lastTimeRef.current = now;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none hidden lg:block"
      style={{ zIndex: 9998 }}
    />
  );
};
