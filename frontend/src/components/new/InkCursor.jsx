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

    // Convert hex / rgb(...) string to {r,g,b}
    const toRgb = (col) => {
      const c = col.trim();
      if (c.startsWith('#')) {
        const h = c.slice(1);
        const full = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
        return {
          r: parseInt(full.slice(0, 2), 16),
          g: parseInt(full.slice(2, 4), 16),
          b: parseInt(full.slice(4, 6), 16),
        };
      }
      const m = c.match(/\d+/g);
      return m ? { r: +m[0], g: +m[1], b: +m[2] } : { r: 255, g: 90, b: 31 };
    };
    const rgbPrimary = toRgb(accentColor);
    const rgbHover = toRgb(accentColor2);
    const rgba = (rgb, a) => `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;

    // Track mouse position
    const handleMouseMove = (e) => {
      const now = Date.now();

      // Very subtle jitter (±0.3px max) for hand-drawn feel
      const jitterX = (Math.random() - 0.5) * 0.6;
      const jitterY = (Math.random() - 0.5) * 0.6;

      pointsRef.current.push({
        x: e.clientX + jitterX,
        y: e.clientY + jitterY,
        time: now,
      });

      // Short trail — max 12 points
      const maxPoints = 12;
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

      // Aggressive decay — trail collapses within ~5–6 frames (≈100ms) when idle
      const ageThreshold = 110;
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
      const speed = avgVelocity / 1000; // normalized

      // Restrained width — caps at 2.5px max, tiny velocity bump
      const maxWidth = Math.min(2.5, 1.2 + speed * 0.06);
      // Length: short by default, slight extension at higher speed
      const trailLength = Math.min(1, 0.55 + speed * 0.18);

      // Check if hovering interactive element
      const lastPoint = points[points.length - 1];
      const isHovering = lastPoint ? isHoveringInteractive(lastPoint.x, lastPoint.y) : false;
      const strokeRgb = isHovering ? rgbHover : rgbPrimary;

      // Draw the trail (delicate wisp, tapered)
      const drawTrail = (blur, opacityScale, widthScale) => {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = blur;
        ctx.shadowColor = blur > 0 ? rgba(strokeRgb, 0.4) : 'transparent';

        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          // progress: 0 at tail (oldest) → 1 at head (newest)
          const progress = (i + 1) / points.length;
          const tapered = progress * trailLength;

          const w = tapered * maxWidth * widthScale;
          if (w < 0.1) continue;
          // Top-pass max alpha 0.45; bleed 0.1
          const alpha = tapered * 0.45 * opacityScale;

          ctx.beginPath();
          ctx.strokeStyle = rgba(strokeRgb, alpha);
          ctx.lineWidth = w;

          if (i < points.length - 2) {
            const p3 = points[i + 2];
            const midX = (p2.x + p3.x) / 2;
            const midY = (p2.y + p3.y) / 2;
            ctx.moveTo(p1.x, p1.y);
            ctx.quadraticCurveTo(p2.x, p2.y, midX, midY);
          } else {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
          ctx.stroke();
        }

        ctx.shadowBlur = 0;
      };

      // Soft bleed under-pass (very subtle): 1.3× width, 0.22× of top alpha (~0.10 effective)
      drawTrail(2, 0.22, 1.3);
      // Crisp top layer
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
