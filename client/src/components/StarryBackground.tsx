import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

// Theme color configurations
const themeColors = {
  'cosmic': {
    gradient: 'linear-gradient(180deg, #0a0015 0%, #1a0b2e 50%, #2d1b4e 100%)',
    starOuter: [200, 180, 255],
    starMid: [160, 140, 255],
    starInner: [120, 100, 255],
    starCenter: [255, 245, 255],
  },
  'cosmic-green': {
    gradient: 'linear-gradient(180deg, #000a05 0%, #0b1e0f 50%, #1b4e2d 100%)',
    starOuter: [150, 255, 180],
    starMid: [120, 220, 150],
    starInner: [90, 180, 120],
    starCenter: [230, 255, 240],
  },
  'cosmic-yellow': {
    gradient: 'linear-gradient(180deg, #0a0800 0%, #1e180b 50%, #4e3e1b 100%)',
    starOuter: [255, 230, 150],
    starMid: [240, 200, 120],
    starInner: [220, 170, 90],
    starCenter: [255, 250, 230],
  },
  'cosmic-red': {
    gradient: 'linear-gradient(180deg, #0a0000 0%, #1e0b0b 50%, #4e1b1b 100%)',
    starOuter: [255, 150, 150],
    starMid: [240, 120, 120],
    starInner: [220, 90, 90],
    starCenter: [255, 240, 240],
  },
};

export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>();
  const { currentTheme } = useTheme();

  const colors = themeColors[currentTheme as keyof typeof themeColors] || themeColors['cosmic'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    // Initialize stars
    const initStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 3000);
      starsRef.current = [];

      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    // Animation loop
    const animate = () => {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      starsRef.current.forEach((star) => {
        // Update twinkle
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.3;
        const currentOpacity = Math.max(0.2, Math.min(1, star.opacity + twinkle));

        // Draw star with glow using theme colors
        const gradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.radius * 3
        );
        gradient.addColorStop(0, `rgba(${colors.starOuter.join(',')}, ${currentOpacity})`);
        gradient.addColorStop(0.4, `rgba(${colors.starMid.join(',')}, ${currentOpacity * 0.6})`);
        gradient.addColorStop(1, `rgba(${colors.starInner.join(',')}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw bright center
        ctx.fillStyle = `rgba(${colors.starCenter.join(',')}, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [colors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: colors.gradient,
      }}
    />
  );
}
