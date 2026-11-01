import { useEffect, useRef, useState } from 'react';
import SpotlightCard from '../reactbits/SpotlightCard';
import SplitText from '../reactbits/SplitText';
import Magnet from '../reactbits/Magnet';
import { CONTACT, scrollToId } from '../config';

// Reveal-on-scroll wrapper (React Bits "ScrollReveal" style).
function useInView(margin = '-12% 0px') {
  const ref = useRef(null); const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: margin });
    io.observe(ref.current); return () => io.disconnect();
  }, [margin]);
  return [ref, on];
}
function Reveal({ children, className = '', delay = 0, as: Tag = 'div', ...rest }) {
  const [ref, on] = useInView();
  return <Tag ref={ref} className={`reveal ${on ? 'in' : ''} ${className}`} style={{ '--d': delay }} {...rest}>{children}</Tag>;
}
function Head({ tag, title, body }) {
  const [ref, on] = useInView();
  return (
    <div className="sec-head" ref={ref}>
      <p className="tag">{tag}</p>
      <h2 className="h2 big"><SplitText text={title} active={on} /></h2>
      {body && <p className="lead">{body}</p>}
    </div>
  );
}

const PROJECT_IMG = ['projects/villa.jpg', 'rooms/atrium.jpg', 'rooms/terrace.jpg', 'rooms/living.jpg', 'rooms/bedroom.jpg', 'rooms/kitchen.jpg'];

export function Projects({ t }) {
  const c = t.projects;
  return (
    <section id="projects" className="sec">
      <Head tag={c.tag} title={c.title} body={c.body} />
      <div className="proj-grid">
        {c.items.map(([name, meta], i) => (
          <Reveal key={name} delay={i % 3} className={`proj p${i}`}>
            <SpotlightCard className="proj-card" tabIndex={0}>
              <div className="proj-img"><img src={PROJECT_IMG[i]} alt={name} loading="lazy" /></div>
              <div className="proj-meta"><h3>{name}</h3><p>{meta}</p></div>
              <span className="proj-arrow" aria-hidden="true">↗</span>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Team({ t }) {
  const c = t.team;
  return (
    <section id="team" className="sec sec-alt">
      <Head tag={c.tag} title={c.title} />
      <div className="team-grid">
        {c.people.map(([n, r], i) => (
          <Reveal key={n} delay={i}>
            <SpotlightCard className="person">
              <div className="avatar" aria-hidden="true">{n.trim().split(' ').map((w) => [...w][0]).slice(0, 2).join('')}</div>
              <h3>{n}</h3><p>{r}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Certs({ t }) {
  const c = t.certs;
  return (
    <section id="certs" className="sec">
      <Head tag={c.tag} title={c.title} />
      <div className="cert-grid">
        {c.items.map(([n, s], i) => (
          <Reveal key={n} delay={i}>
            <SpotlightCard className="cert">
              <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true"><circle cx="24" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M17 30l-4 14 11-6 11 6-4-14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M19 20l4 4 7-8" fill="none" stroke="var(--brass)" strokeWidth="2.2" /></svg>
              <h3>{n}</h3><p>{s}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Contact({ t }) {
  const c = t.contact;
  const [wa, setWa] = useState(null);
  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = `Hello CONCRETE, I'm ${f.get('name')} (${f.get('phone')}). Project: ${f.get('type')}. ${f.get('msg') || ''}`;
    const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
    setWa(url);
    try { window.open(url, '_blank', 'noopener'); } catch {}
  };
  return (
    <section id="contact" className="sec sec-alt">
      <Head tag={c.tag} title={c.title} body={c.body} />
      <div className="contact-grid">
        <Reveal>
          <form className="form" onSubmit={submit}>
            <label><span>{c.name}</span><input name="name" required autoComplete="name" /></label>
            <label><span>{c.phone}</span><input name="phone" type="tel" required autoComplete="tel" /></label>
            <label><span>{c.type}</span><select name="type">{c.types.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label><span>{c.msg}</span><textarea name="msg" rows="4" /></label>
            <Magnet pad={30} strength={0.2}><button className="btn btn-solid" type="submit">{c.send}</button></Magnet>
            {wa && <p className="form-ok" role="status">{c.sent} <a className="wa-link" href={wa} target="_blank" rel="noopener noreferrer">{c.open} ↗</a></p>}
          </form>
        </Reveal>
        <Reveal delay={1} className="map-wrap">
          <iframe title="CONCRETE office map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(CONTACT.mapQuery)}&output=embed`} />
          <div className="map-card"><strong>{c.office}</strong><span>{c.address}</span><a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneLabel}</a><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.mapQuery)}`} target="_blank" rel="noopener noreferrer">{c.openMap} ↗</a></div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="foot-big">CONCRETE</div>
      <div className="foot-row">
        <span>© {new Date().getFullYear()} CONCRETE. {t.footer.rights}</span>
        <span className="foot-tag">{t.footer.tagline}</span>
        <button onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}>{t.footer.top} ↑</button>
      </div>
    </footer>
  );
}

export function FloatingActions({ lang }) {
  return (
    <div className="fab" aria-label="Quick contact">
      <a className="fab-btn fab-call" href={`tel:${CONTACT.phone}`} title={CONTACT.phoneLabel} aria-label={(lang === 'ta' ? 'அழையுங்கள் ' : 'Call us ') + CONTACT.phoneLabel}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" /></svg>
      </a>
      <a className="fab-btn fab-wa" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M12 2.5c-5.2 0-9.5 3.8-9.5 8.600 0 2.200.9 4.200 2.300 5.700L4 21.500l4.700-1.700c1.100.3 2.200.5 3.300.5 5.200 0 9.500-3.800 9.500-8.600S17.200 2.500 12 2.500z" /><circle cx="8" cy="11.100" r="1.200" fill="var(--bg)" /><circle cx="12" cy="11.100" r="1.200" fill="var(--bg)" /><circle cx="16" cy="11.100" r="1.200" fill="var(--bg)" /></svg>
      </a>
    </div>
  );
}
