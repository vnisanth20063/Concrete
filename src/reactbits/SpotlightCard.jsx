// React Bits–style SpotlightCard: a soft light follows the cursor across the card.
export default function SpotlightCard({ children, className = '', as: Tag = 'div', ...rest }) {
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return <Tag className={`spot ${className}`} onMouseMove={move} {...rest}>{children}</Tag>;
}
