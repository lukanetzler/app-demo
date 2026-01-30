import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Ray {
  angle: number;
  length: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

// Theme color configurations for sunrays
const themeColors = {
  'cosmic-light': {
    gradient: 'linear-gradient(180deg, #f5f0ff 0%, #ede5ff 50%, #e5d9ff 100%)',
    rayColor: [180, 140, 255],
  },
  'cosmic-green-light': {
    gradient: 'linear-gradient(180deg, #f0fff5 0%, #e5ffe8 50%, #d9ffe0 100%)',
    rayColor: [120, 220, 150],
  },
  'cosmic-yellow-light': {
    gradient: 'linear-gradient(180deg, #fffcf0 0%, #fff8e5 50%, #fff4d9 100%)',
    rayColor: [240, 200, 120],
  },
  'cosmic-red-light': {
    gradient: 'linear-gradient(180deg, #fff0f0 0%, #ffe5e5 50%, #ffd9d9 100%)',
    rayColor: [240, 120, 120],
  },
};

export function SunraysBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raysRef = useRef<Ray[]>([]);
  const animationFrameRef = useRef<number>();
  const { currentTheme } = useTheme();

  const colors = themeColors[currentTheme as keyof typeof themeColors] || themeColors['cosmic-light'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initRays();
    };

    // Initialize sunrays
    const initRays = () => {
      const rayCount = 12;
      raysRef.current = [];

      for (let i = 0; i < rayCount; i++) {
        raysRef.current.push({
          angle: (i / rayCount) * Math.PI * 2,
          length: Math.max(canvas.width, canvas.height) * 1.5,
          opacity: 0.08 + Math.random() * 0.04,
          pulseSpeed: 0.001 + Math.random() * 0.001,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    // Animation loop
    const animate = () => {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Center point (sun position - slightly above center)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 3;

      // Draw rays
      raysRef.current.forEach((ray) => {
        // Update pulse
        ray.pulsePhase += ray.pulseSpeed;
        const pulse = Math.sin(ray.pulsePhase) * 0.02;
        const currentOpacity = ray.opacity + pulse;

        // Calculate ray endpoints
        const endX = centerX + Math.cos(ray.angle) * ray.length;
        const endY = centerY + Math.sin(ray.angle) * ray.length;

        // Create gradient for ray
        const gradient = ctx.createLinearGradient(centerX, centerY, endX, endY);
        gradient.addColorStop(0, `rgba(${colors.rayColor.join(',')}, ${currentOpacity * 0.8})`);
        gradient.addColorStop(0.3, `rgba(${colors.rayColor.join(',')}, ${currentOpacity * 0.4})`);
        gradient.addColorStop(1, `rgba(${colors.rayColor.join(',')}, 0)`);

        // Draw ray as a triangle
        const rayWidth = 80;
        const perpAngle1 = ray.angle + Math.PI / 2;
        const perpAngle2 = ray.angle - Math.PI / 2;

        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(perpAngle1) * rayWidth,
          centerY + Math.sin(perpAngle1) * rayWidth
        );
        ctx.lineTo(endX, endY);
        ctx.lineTo(
          centerX + Math.cos(perpAngle2) * rayWidth,
          centerY + Math.sin(perpAngle2) * rayWidth
        );
        ctx.closePath();

        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw sun glow
      const sunGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        200
      );
      sunGradient.addColorStop(0, `rgba(${colors.rayColor.join(',')}, 0.15)`);
      sunGradient.addColorStop(0.5, `rgba(${colors.rayColor.join(',')}, 0.05)`);
      sunGradient.addColorStop(1, `rgba(${colors.rayColor.join(',')}, 0)`);

      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 200, 0, Math.PI * 2);
      ctx.fill();

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
