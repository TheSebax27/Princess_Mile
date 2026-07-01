import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export function Secret() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      vy: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.vy;
        if (p.y < 0) p.y = height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(193, 18, 31, ${p.opacity})`;
        ctx.fill();
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="relative -mx-5 -my-8 flex h-[calc(100vh-73px)] items-center justify-center overflow-hidden bg-black sm:-mx-8">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-5 px-6 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red/30 bg-red/10">
          <Lock className="h-6 w-6 text-red-bright" />
        </div>
        <p className="font-display text-2xl text-white sm:text-3xl">Todavía no.</p>
        <p className="max-w-xs text-sm text-text-muted">
          Cuando llegue el momento... podrás entrar.
        </p>
      </motion.div>
    </div>
  );
}
