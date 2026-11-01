// React Bits–style LogoLoop: endless marquee that slows on hover.
export default function LogoLoop({ items, speed = 38 }) {
  const row = (k) => (
    <ul className="loop-row" aria-hidden={k > 0} key={k}>
      {items.map((n) => <li key={n + k}><span className="loop-mark" />{n}</li>)}
    </ul>
  );
  return <div className="loop" style={{ '--speed': `${speed}s` }}><div className="loop-track">{row(0)}{row(1)}</div></div>;
}
