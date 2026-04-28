"use client";
import { useEffect, useRef } from "react";

export function ShapeGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const dots: { x: number; y: number; vx: number; vy: number; r: number; color: string }[] = [];
    const colors = ["rgba(63,184,255,0.15)", "rgba(255,63,168,0.12)", "rgba(255,122,63,0.1)", "rgba(255,216,63,0.08)"];

    function resize() {
      c!.width = window.innerWidth;
      c!.height = window.innerHeight;
    }

    function init() {
      resize();
      dots.length = 0;
      const count = Math.floor((c!.width * c!.height) / 18000);
      for (let i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * c!.width,
          y: Math.random() * c!.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, c!.width, c!.height);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > c!.width) d.vx *= -1;
        if (d.y < 0 || d.y > c!.height) d.vy *= -1;
        ctx!.fillStyle = d.color;
        ctx!.fillRect(Math.floor(d.x), Math.floor(d.y), d.r, d.r);
      }
      raf = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", init); };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={ref} className="w-full h-full" />
    </div>
  );
}
