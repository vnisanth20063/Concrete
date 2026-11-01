import { useEffect, useState } from 'react';
import Magnet from '../reactbits/Magnet';
import { scrollToP, scrollToId, STOPS } from '../config';

const mid = (id) => { const s = STOPS.find((x) => x.id === id); return (s.a + s.b) / 2 + 0.004; };

export default function Nav({ t, lang, setLang, theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(scrollY > 40); on();
    addEventListener('scroll', on, { passive: true }); return () => removeEventListener('scroll', on);
  }, []);
  const go = (fn) => () => { setOpen(false); fn(); };
  const links = [
    ['about', go(() => scrollToP(mid('atrium')))],
    ['services', go(() => scrollToP(mid('living')))],
    ['process', go(() => scrollToP(mid('kitchen')))],
    ['projects', go(() => scrollToId('projects'))],
    ['team', go(() => scrollToId('team'))],
    ['contact', go(() => scrollToId('contact'))],
  ];
  return (
    <header className={`nav ${solid ? 'solid' : ''} ${open ? 'open' : ''}`}>
      <a className="brand" href="#hero" onClick={(e) => { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="CONCRETE home">
        <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true"><rect x="3" y="3" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M3 21h10v-8h8V3" fill="none" stroke="currentColor" strokeWidth="2" /><rect x="14" y="14" width="6" height="6" fill="var(--brass)" /></svg>
        <span>CONCRETE</span>
      </a>
      <nav className="nav-links" aria-label="Primary">
        {links.map(([k, fn]) => <button key={k} onClick={fn}>{t.nav[k]}</button>)}
      </nav>
      <div className="nav-tools">
        <div className="seg" role="group" aria-label="Language">
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'ta' ? 'on' : ''} onClick={() => setLang('ta')}>தமிழ்</button>
        </div>
        <button className="icon-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle light / dark">
          {theme === 'light'
            ? <svg viewBox="0 0 24 24" width="18" height="18"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor" /></svg>
            : <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" fill="currentColor" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></svg>}
        </button>
        <span className="nav-cta"><Magnet pad={0} strength={0.18}><button className="btn btn-solid btn-sm" onClick={() => scrollToId('contact')}>{t.nav.cta}</button></Magnet></span>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}><i /><i /></button>
      </div>
      <div className="drawer">{links.map(([k, fn]) => <button key={k} onClick={fn}>{t.nav[k]}</button>)}</div>
    </header>
  );
}
