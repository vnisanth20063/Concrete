// React Bits–style CountUp: eases from 0 to `to` when `start` becomes true; resets when it turns false.
import { useEffect, useRef, useState } from 'react';
export default function CountUp({ to, start = true, duration = 1800, decimals = 0, suffix = '' }) {
  const [v, setV] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    if (!start) { setV(0); return; }
    const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / duration);
      setV(to * (1 - Math.pow(1 - k, 4)));
      if (k < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [start, to, duration]);
  return <span className="countup">{v.toFixed(decimals)}{suffix}</span>;
}
