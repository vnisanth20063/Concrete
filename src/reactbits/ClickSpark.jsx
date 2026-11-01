// React Bits–style ClickSpark: tiny brass sparks burst from every click.
import { useEffect, useRef } from 'react';
export default function ClickSpark({ color = '#b8914a', count = 9 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d'); let sparks = [], raf = 0;
    const fit = () => { c.width = innerWidth; c.height = innerHeight; };
    fit(); addEventListener('resize', fit);
    const loop = (t) => {
      ctx.clearRect(0, 0, c.width, c.height);
      sparks = sparks.filter((s) => t - s.t0 < 520);
      for (const s of sparks) {
        const k = (t - s.t0) / 520, e = 1 - Math.pow(1 - k, 3), r1 = 6 + e * 26, r2 = r1 + 10 * (1 - k);
        ctx.strokeStyle = color; ctx.globalAlpha = 1 - k; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(s.x + Math.cos(s.a) * r1, s.y + Math.sin(s.a) * r1);
        ctx.lineTo(s.x + Math.cos(s.a) * r2, s.y + Math.sin(s.a) * r2); ctx.stroke();
      }
      raf = sparks.length ? requestAnimationFrame(loop) : 0;
    };
    const click = (e) => {
      const t0 = performance.now();
      for (let i = 0; i < count; i++) sparks.push({ x: e.clientX, y: e.clientY, a: (Math.PI * 2 * i) / count, t0 });
      if (!raf) raf = requestAnimationFrame(loop);
    };
    addEventListener('click', click);
    return () => { removeEventListener('click', click); removeEventListener('resize', fit); cancelAnimationFrame(raf); };
  }, [color, count]);
  return <canvas ref={ref} className="click-spark" aria-hidden="true" />;
}
