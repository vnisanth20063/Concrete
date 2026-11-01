// Loads the two frame sequences listed in public/frames/manifest.json.
import { useEffect, useRef, useState } from 'react';

export default function useFrames() {
  const frames = useRef({ build: [], entry: [] });
  const [state, setState] = useState({ ready: false, pct: 0 });
  useEffect(() => {
    let dead = false;
    (async () => {
      let m;
      try { m = await (await fetch('frames/manifest.json')).json(); }
      catch { setState({ ready: true, pct: 1 }); return; }
      const mk = (cfg) => Array.from({ length: cfg.count }, (_, i) => {
        const im = new Image(); im.decoding = 'async';
        im.src = cfg.pattern.replace('%04d', String(i + 1).padStart(4, '0')); return im;
      });
      const build = mk(m.build), entry = mk(m.entry);
      frames.current = { build, entry };
      const total = build.length + entry.length; let done = 0;
      const track = (im) => im.decode().catch(() => {}).then(() => { done++; if (!dead) setState((s) => ({ ...s, pct: done / total })); });
      await Promise.all(build.map(track));
      if (!dead) setState((s) => ({ ...s, ready: true }));
      await Promise.all(entry.map(track));
    })();
    return () => { dead = true; };
  }, []);
  return { frames, ...state };
}
