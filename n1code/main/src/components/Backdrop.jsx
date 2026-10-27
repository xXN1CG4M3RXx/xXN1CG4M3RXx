import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/animate";

const PARTICLE_COLORS = ["#00ccff", "#0ac2ff", "#8b5cf6", "#29b4ff", "#47d1ff"];
const LINK_DISTANCE = 118;

/**
 * Fixed ambient layer behind every page: drifting grid, glow orbs and a
 * canvas particle field that reacts to the cursor.
 *
 * Under `prefers-reduced-motion` the canvas is skipped entirely and only the
 * static gradient/grid remains, so nothing moves without consent.
 */
export default function Backdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let raf = 0;
    let particles = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const dpr = Math.min(window.devicePixelRatio || 1, 1);
    const MAX_PARTICLES = 32;

    const seed = () => {
      const count = Math.round(Math.min(MAX_PARTICLES, Math.max(16, (width * height) / 40000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.7 + 0.5,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        alpha: Math.random() * 0.5 + 0.15,
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const onPointerMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const onPointerLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150 && dist > 0.5) {
            p.vx += (dx / dist) * 0.012;
            p.vy += (dy / dist) * 0.012;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += 0.02;

        // keep drift gentle
        p.vx = Math.max(-0.35, Math.min(0.35, p.vx));
        p.vy = Math.max(-0.35, Math.min(0.35, p.vy));

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        const glow = p.alpha * (0.7 + 0.3 * Math.sin(p.twinkle));
        ctx.globalAlpha = glow;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Constellation lines. Strokes are the expensive part, so we coalesce
      // every pair into a single `Path2D` and issue one native stroke() rather
      // than one per pair. This keeps the lines on screen every frame with a
      // fraction of the draw calls.
      ctx.globalAlpha = 1;
      const linePath = new Path2D();
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DISTANCE) {
            linePath.moveTo(a.x, a.y);
            linePath.lineTo(b.x, b.y);
          }
        }
      }
      ctx.strokeStyle = "rgba(0, 204, 255, 0.16)";
      ctx.lineWidth = 1;
      ctx.stroke(linePath);

      ctx.globalAlpha = 1;
      raf = window.requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(raf);
      } else {
        raf = window.requestAnimationFrame(draw);
      }
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div className="hud-grid animate-grid-drift absolute inset-0" />

      <div className="animate-float-slow absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-sky-aqua-600/12 blur-[120px]" />
      <div
        className="animate-float absolute -right-24 top-2/3 h-80 w-80 rounded-full bg-[#8b5cf6]/12 blur-[110px]"
        style={{ animationDelay: "-3.5s" }}
      />
      <div
        className="animate-float-slow absolute left-1/2 top-[85%] h-72 w-72 rounded-full bg-[#f43f5e]/8 blur-[100px]"
        style={{ animationDelay: "-7s" }}
      />

      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="scanlines absolute inset-0 opacity-[0.035]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0b0f19] to-transparent" />
    </div>
  );
}
