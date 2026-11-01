// React Bits–style SplitText: reveals text word by word (or letter by letter) when `active` is true.
import { Fragment } from 'react';
export default function SplitText({ text, active = true, by = 'word', delay = 0, step = 55, as: Tag = 'span', className = '' }) {
  const words = text.split(' ');
  let i = 0;
  return (
    <Tag className={`split ${active ? 'is-in' : ''} ${className}`} aria-label={text}>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className="split-word" aria-hidden="true">
            {(by === 'char' ? [...w] : [w]).map((c, ci) => {
              const d = delay + (i++) * step;
              return <span key={ci} className="split-part" style={{ transitionDelay: `${d}ms` }}>{c}</span>;
            })}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}
