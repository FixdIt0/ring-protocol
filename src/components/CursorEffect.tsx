"use client";
import { useEffect, useRef } from "react";

interface Particle { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string; }

const COLORS = ["#ff2d2d", "#ff8c00", "#ffd700"];

export function CursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    let raf: number;

    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; spawn(e.clientX, e.clientY); };
    window.addEventListener("mousemove", onMove);

    function spawn(x: number, y: number) {
      for (let i = 0; i < 2; i++) {
        particles.current.push({
          x, y,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3 - 1,
          life: 1,
          size: Math.random() * 4 + 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
        });
      }
      if (particles.current.length > 80) particles.current.splice(0, particles.current.length - 80);
    }

    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);

      // Particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i]!;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;
        if (p.life <= 0) { particles.current.splice(i, 1); continue; }
        ctx.globalAlpha = p.life * 0.6;
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      }

      // Boxing glove cursor
      const mx = mouse.current.x;
      const my = mouse.current.y;
      if (mx > 0 && my > 0) {
        ctx.globalAlpha = 1;
        // Glove body
        ctx.fillStyle = "#ff2d2d";
        ctx.beginPath();
        ctx.arc(mx, my, 10, 0, Math.PI * 2);
        ctx.fill();
        // Glove highlight
        ctx.fillStyle = "#ff8c00";
        ctx.beginPath();
        ctx.arc(mx - 2, my - 3, 4, 0, Math.PI * 2);
        ctx.fill();
        // Wrist
        ctx.fillStyle = "#ffd700";
        ctx.fillRect(mx - 4, my + 8, 8, 6);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-50 pointer-events-none" style={{ cursor: "none" }} />;
}
