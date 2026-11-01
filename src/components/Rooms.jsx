import SplitText from '../reactbits/SplitText';
import CountUp from '../reactbits/CountUp';
import LogoLoop from '../reactbits/LogoLoop';
import Magnet from '../reactbits/Magnet';
import { scrollToId, CONTACT } from '../config';

// Photos live in /public/rooms — swap the files (same names) to change them.
const PHOTO = {
  atrium:  { src: 'rooms/atrium.jpg',  orient: 'portrait',  alt: 'Double-height atrium with a sculpted tree over a reflecting pool' },
  living:  { src: 'rooms/living.jpg',  orient: 'portrait',  alt: 'Living room with a champagne sectional and brass pendant lights' },
  kitchen: { src: 'rooms/kitchen.jpg', orient: 'landscape', alt: 'Kitchen with a stone island and teak cabinets' },
  bedroom: { src: 'rooms/bedroom.jpg', orient: 'landscape', alt: 'Master bedroom with a timber feature wall' },
  terrace: { src: 'rooms/terrace.jpg', orient: 'landscape', alt: 'Rooftop terrace at dusk' },
};

const rv = (i) => ({ '--d': i });

function Body({ id, t, on }) {
  const c = t[id];
  switch (id) {
    case 'foyer':
      return (
        <>
          <p className="tag rv" style={rv(0)}>{c.tag}</p>
          <h2 className="h2"><SplitText text={c.title} active={on} delay={120} /></h2>
          <p className="lead rv" style={rv(2)}>{c.body}</p>
          <div className="stats">
            {c.stats.map((s, i) => (
              <div className="stat rv" style={rv(3 + i)} key={s.label}>
                <div className="stat-n"><CountUp to={s.n} start={on} decimals={s.dec || 0} suffix={s.suf} /></div>
                <div className="stat-l">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="hint rv" style={rv(8)}><span className="hint-line" />{c.hint}</p>
        </>
      );
    case 'atrium':
      return (
        <>
          <p className="tag rv" style={rv(0)}>{c.tag}</p>
          <h2 className="h2"><SplitText text={c.title} active={on} delay={120} /></h2>
          <p className="lead rv" style={rv(2)}>{c.body}</p>
          <ul className="points">
            {c.points.map((p, i) => <li className="rv" style={rv(3 + i)} key={p}>{p}</li>)}
          </ul>
        </>
      );
    case 'living':
      return (
        <>
          <p className="tag rv" style={rv(0)}>{c.tag}</p>
          <h2 className="h2"><SplitText text={c.title} active={on} delay={120} /></h2>
          <ol className="services">
            {c.items.map(([n, d], i) => (
              <li className="rv" style={rv(2 + i)} key={n}>
                <span className="svc-i">{String(i + 1).padStart(2, '0')}</span>
                <span><strong>{n}</strong><em>{d}</em></span>
              </li>
            ))}
          </ol>
        </>
      );
    case 'kitchen':
      return (
        <>
          <p className="tag rv" style={rv(0)}>{c.tag}</p>
          <h2 className="h2"><SplitText text={c.title} active={on} delay={120} /></h2>
          <ol className="steps">
            {c.steps.map(([n, d], i) => (
              <li className="rv" style={rv(2 + i)} key={n}>
                <span className="step-dot">{i + 1}</span>
                <span><strong>{n}</strong><em>{d}</em></span>
              </li>
            ))}
          </ol>
        </>
      );
    case 'bedroom':
      return (
        <>
          <p className="tag rv" style={rv(0)}>{c.tag}</p>
          <h2 className="h2"><SplitText text={c.title} active={on} delay={120} /></h2>
          {c.quotes.map(([q, who], i) => (
            <figure className="quote rv" style={rv(2 + i * 2)} key={who}>
              <blockquote>{q}</blockquote>
              <figcaption>{who}</figcaption>
            </figure>
          ))}
        </>
      );
    case 'terrace':
      return (
        <>
          <p className="tag rv" style={rv(0)}>{c.tag}</p>
          <h2 className="h2"><SplitText text={c.title} active={on} delay={120} /></h2>
          <p className="lead rv" style={rv(2)}>{c.body}</p>
          <div className="cta-row rv" style={rv(3)}>
            <Magnet><button className="btn btn-solid" onClick={() => scrollToId('contact')}>{c.cta}</button></Magnet>
            <a className="btn btn-ghost" href={`tel:${CONTACT.phone}`}>{c.call} · {CONTACT.phoneLabel}</a>
          </div>
          <p className="tag rv" style={{ ...rv(5), marginTop: 28 }}>{c.trusted}</p>
          <div className="rv" style={rv(5)}><LogoLoop items={t.clients} /></div>
        </>
      );
    default: return null;
  }
}

export default function Rooms({ t, activeId, setLayer }) {
  const ids = ['foyer', 'atrium', 'living', 'kitchen', 'bedroom', 'terrace'];
  return ids.map((id) => {
    const ph = PHOTO[id];
    const on = activeId === id;
    return (
      <div key={id} ref={(el) => setLayer(id, el)} className={`room room-${id} ${on ? 'in' : ''} ${ph ? ph.orient : 'nophoto'}`} style={{ opacity: 0 }} aria-hidden={!on}>
        {ph && <div className="room-bg" style={{ backgroundImage: `url(${ph.src})` }} />}
        <div className="room-wash" />
        <div className="room-inner">
          <div className="room-card"><Body id={id} t={t} on={on} /></div>
          {ph && (
            <figure className="room-photo rv-photo">
              <img src={ph.src} alt={ph.alt} draggable="false" />
              <span className="photo-corner" />
            </figure>
          )}
        </div>
      </div>
    );
  });
}
