// React Bits–style Magnet: children are gently pulled toward the cursor.
import { useRef } from 'react';
export default function Magnet({ children, strength = 0.35, pad = 24, className = '' }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    el.firstChild.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };
  const reset = () => { if (ref.current) ref.current.firstChild.style.transform = ''; };
  return (
    <span ref={ref} className={`magnet ${className}`} style={{ padding: pad, margin: -pad }} onMouseMove={onMove} onMouseLeave={reset}>
      <span className="magnet-inner">{children}</span>
    </span>
  );
}
