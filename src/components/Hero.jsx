import { useEffect, useRef, useState } from 'react';
import Rooms from './Rooms';
import SplitText from '../reactbits/SplitText';
import { BUILD, ZOOM, DOOR, STOPS, STAGES, HERO_VH, clamp, smooth, easeInOut, scrollToP, scrollToId } from '../config';

// --- canvas helpers ---------------------------------------------------------
function cover(cw, ch, iw, ih, fx = 0.5) {
  const s = Math.max(cw / iw, ch / ih), dw = iw * s, dh = ih * s;
  return { dx: (cw - dw) * fx, dy: (ch - dh) * 0.5, dw, dh };
}
const ok = (im) => im && im.complete && im.naturalWidth > 0;
function pick(arr, i) { for (let k = i; k >= 0; k--) if (ok(arr[k])) return arr[k]; return null; }
// Draw frame sequence at normalised time t (0…1), cross-fading between neighbouring frames.
function drawSeq(ctx, arr, t, cw, ch, fx, alpha = 1, xf) {
  if (!arr.length) return null;
  const pos = clamp(t) * (arr.length - 1), i = Math.floor(pos), f = pos - i;
  const a = pick(arr, i); if (!a) return null;
  const R = cover(cw, ch, a.naturalWidth, a.naturalHeight, fx);
  ctx.save(); if (xf) xf(R);
  ctx.globalAlpha = alpha; ctx.drawImage(a, R.dx, R.dy, R.dw, R.dh);
  const b = f > 0.02 && i + 1 < arr.length && ok(arr[i + 1]) ? arr[i + 1] : null;
  if (b) { ctx.globalAlpha = alpha * f; ctx.drawImage(b, R.dx, R.dy, R.dw, R.dh); }
  ctx.restore(); return R;
}

const DOOR_PIVOT = [0.47, 0.77]; // where the front door sits in the final build frame

export default function Hero({ t, lang, frames, ready, pct }) {
  const heroRef = useRef(null), canvasRef = useRef(null);
  const introRef = useRef(null), hudRef = useRef(null), barRef = useRef(null), enterRef = useRef(null), flashRef = useRef(null), hintRef = useRef(null), skipRef = useRef(null), railRef = useRef(null);
  const layers = useRef({});
  const state = useRef({ stage: 0, active: -1, rail: 0 });
  const [stage, setStage] = useState(0);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [railIdx, setRailIdx] = useState(0);
  const framesRef = useRef(frames);
  framesRef.current = frames;

  useEffect(() => {
    const canvas = canvasRef.current, ctx = canvas.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, last = performance.now(), pe = -1, W = 0, H = 0, dpr = 1;

    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      W = canvas.width = Math.round(innerWidth * dpr); H = canvas.height = Math.round(innerHeight * dpr);
      pe = -2; // force a redraw
    };
    fit(); addEventListener('resize', fit);

    const draw = (p) => {
      const { build, entry } = framesRef.current.current;
      const portrait = innerHeight > innerWidth, fx = portrait ? 0.4 : 0.5;
      ctx.clearRect(0, 0, W, H);
      const z = clamp((p - ZOOM[0]) / (ZOOM[1] - ZOOM[0]));
      const bt = clamp((p - BUILD[0]) / (BUILD[1] - BUILD[0]));
      let blur = 0;
      if (z < 1) {
        // Building rises (and, during the zoom, the camera pushes into the front door).
        const e = easeInOut(z), s = 1 + 3.4 * e;
        drawSeq(ctx, build, bt, W, H, fx, 1, (R) => {
          if (z <= 0) return;
          const px = R.dx + DOOR_PIVOT[0] * R.dw, py = R.dy + DOOR_PIVOT[1] * R.dh;
          const tx = px + (W * 0.5 - px) * e, ty = py + (H * 0.5 - py) * e;
          ctx.translate(tx, ty); ctx.scale(s, s); ctx.translate(-px, -py);
        });
        blur = 7 * smooth((z - 0.55) / 0.45);
      }
      // Door clip: cross-fades in at the end of the zoom, then plays as the door opens.
      const da = smooth((z - 0.7) / 0.3);
      if (da > 0 && entry.length) {
        const et = clamp((p - DOOR[0]) / (DOOR[1] - DOOR[0]));
        drawSeq(ctx, entry, et, W, H, 0.5, da);
      }
      canvas.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : '';
    };

    const render = (p) => {
      draw(p);
      const bt = clamp((p - BUILD[0]) / (BUILD[1] - BUILD[0]));

      // intro headline
      const io = 1 - smooth((p - 0.03) / 0.05);
      if (introRef.current) { introRef.current.style.opacity = io; introRef.current.style.transform = `translateY(${(1 - io) * -40}px)`; introRef.current.style.visibility = io < 0.01 ? 'hidden' : 'visible'; }
      if (hintRef.current) hintRef.current.style.opacity = 1 - smooth(p / 0.02);
      // stage HUD
      const ho = smooth((p - 0.045) / 0.02) * (1 - smooth((p - 0.265) / 0.02));
      if (hudRef.current) hudRef.current.style.opacity = ho;
      if (barRef.current) barRef.current.style.transform = `scaleX(${bt})`;
      // "step inside" line
      const eo = smooth((p - 0.268) / 0.02) * (1 - smooth((p - 0.345) / 0.03));
      if (enterRef.current) { enterRef.current.style.opacity = eo; enterRef.current.style.transform = `translateY(${(1 - eo) * 20}px)`; }
      // warm light-bloom that hides the cut from villa → door
      if (flashRef.current) flashRef.current.style.opacity = Math.max(0, 1 - Math.abs(p - 0.388) / 0.03) * 0.85;
      // canvas pushes forward as we leave the foyer
      const walk = smooth((p - (STOPS[0].b - 0.03)) / 0.04);
      canvas.style.transform = walk > 0 ? `scale(${1 + 0.14 * walk})` : '';
      canvas.style.opacity = p > STOPS[1].a + 0.02 ? 0 : 1;
      // skip button
      if (skipRef.current) skipRef.current.style.opacity = p > 0.02 && p < 0.97 ? 1 : 0;
      if (skipRef.current) skipRef.current.style.pointerEvents = p > 0.02 && p < 0.97 ? 'auto' : 'none';

      // room layers
      const f = 0.014;
      let act = -1;
      STOPS.forEach((s, i) => {
        const el = layers.current[s.id]; if (!el) return;
        const fi = i === 0 ? smooth((p - (s.a - f)) / (2 * f)) : smooth((p - (s.a - f)) / (2 * f));
        const fo = i === STOPS.length - 1 ? 1 : smooth((s.b + f - p) / (2 * f));
        const op = fi * fo;
        el.style.opacity = op;
        el.style.visibility = op < 0.003 ? 'hidden' : 'visible';
        el.style.pointerEvents = op > 0.6 ? 'auto' : 'none';
        const sc = (i === 0 ? 1 : 0.95 + 0.05 * fi) * (1 + 0.1 * (1 - fo));
        el.style.transform = `scale(${sc.toFixed(4)})`;
        el.style.setProperty('--kb', (1.02 + 0.06 * clamp((p - s.a) / (s.b - s.a))).toFixed(4));
        if (p >= s.a && (p < s.b || i === STOPS.length - 1)) act = i;
      });

      // discrete state for React (text animations, HUD label, mini-map)
      const st = bt < STAGES[0] ? 0 : bt < STAGES[1] ? 1 : bt < STAGES[2] ? 2 : bt < STAGES[3] ? 3 : 4;
      if (st !== state.current.stage) { state.current.stage = st; setStage(st); }
      if (act !== state.current.active) { state.current.active = act; setActiveIdx(act); }
      const rail = act >= 0 ? 2 + act : p >= ZOOM[0] ? 1 : 0;
      if (rail !== state.current.rail) { state.current.rail = rail; setRailIdx(rail); }
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const el = heroRef.current; if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return; // off-screen
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const target = clamp(-r.top / (el.offsetHeight - innerHeight));
      if (pe < -1) { pe = target; render(pe); return; }
      if (pe < 0) pe = target;
      const next = pe + (target - pe) * (1 - Math.exp(-dt * (reduce ? 80 : 9)));
      if (Math.abs(target - next) < 0.00004) pe = target; else pe = next;
      render(pe);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', fit); };
  }, []);

  const activeId = activeIdx >= 0 ? STOPS[activeIdx].id : null;
  const rail = [
    { k: 'build', p: 0.02 }, { k: 'enter', p: 0.33 },
    ...STOPS.map((s) => ({ k: s.id, p: (s.a + s.b) / 2 + (s.id === 'foyer' ? 0.0 : 0) })),
  ];

  return (
    <section id="hero" ref={heroRef} className="hero" style={{ height: `${HERO_VH}vh` }}>
      <div className="hero-stick">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-scrim" />
        <div ref={flashRef} className="hero-flash" />

        <div ref={introRef} className="intro">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 className="h1" key={lang}><SplitText text={t.hero.title} active={ready} by="word" delay={250} step={110} /></h1>
          <p className="intro-sub">{t.hero.sub}</p>
        </div>

        <div ref={hintRef} className="scroll-hint"><span className="scroll-line" />{t.hero.scroll}</div>

        <div ref={hudRef} className="hud" style={{ opacity: 0 }}>
          <div className="hud-stage"><span className="hud-n">{String(stage + 1).padStart(2, '0')}</span><span className="hud-l" key={stage + lang}>{t.stages[stage]}</span></div>
          <div className="hud-bar"><i ref={barRef} /></div>
        </div>

        <div ref={enterRef} className="enter" style={{ opacity: 0 }}>{t.hero.enter}</div>

        <Rooms t={t} activeId={activeId} setLayer={(id, el) => { layers.current[id] = el; }} />

        <nav ref={railRef} className="rail" aria-label="Tour progress">
          {rail.map((r, i) => (
            <button key={r.k} className={`rail-dot ${i === railIdx ? 'on' : ''} ${i < railIdx ? 'past' : ''}`} onClick={() => scrollToP(r.p)} aria-label={t.rail[r.k]}>
              <span className="rail-l">{t.rail[r.k]}</span><i />
            </button>
          ))}
        </nav>

        <button ref={skipRef} className="skip" onClick={() => scrollToId('projects')} style={{ opacity: 0 }}>{t.hero.skip} <span>↓</span></button>

        {!ready && (
          <div className="loader"><div className="loader-mark">CONCRETE</div><div className="loader-bar"><i style={{ transform: `scaleX(${pct})` }} /></div><div className="loader-l">{t.hero.loading} · {Math.round(pct * 100)}%</div></div>
        )}
      </div>
    </section>
  );
}
