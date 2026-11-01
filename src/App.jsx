import { useEffect, useState } from 'react';
import { T } from './i18n';
import useFrames from './useFrames';
import Nav from './components/Nav';
import Hero from './components/Hero';
import { Projects, Team, Certs, Contact, Footer, FloatingActions } from './components/Sections';
import ClickSpark from './reactbits/ClickSpark';

const read = (k, d) => { try { return localStorage.getItem(k) || d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

export default function App() {
  const [theme, setTheme] = useState(() => read('concrete-theme', 'light'));
  const [lang, setLang] = useState(() => read('concrete-lang', 'en'));
  const { frames, ready, pct } = useFrames();
  const t = T[lang];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f5f0e8' : '#11100e');
    write('concrete-theme', theme);
  }, [theme]);
  useEffect(() => { document.documentElement.setAttribute('lang', lang); write('concrete-lang', lang); }, [lang]);
  useEffect(() => { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; scrollTo(0, 0); }, []);

  return (
    <>
      <Nav t={t} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      <main>
        <Hero t={t} lang={lang} frames={frames} ready={ready} pct={pct} />
        <Projects t={t} />
        <Team t={t} />
        <Certs t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
      <FloatingActions lang={lang} />
      <ClickSpark />
    </>
  );
}
