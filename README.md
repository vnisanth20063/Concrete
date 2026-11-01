# CONCRETE — construction company website

Single-page site. A luxury villa **builds itself as you scroll** (foundation → structure → walls → finishing → handover),
the camera **pushes into the front door**, the door opens, and the page **walks through six rooms**, each carrying one
section of company content. Below the hero: projects, team, certifications, contact (WhatsApp form + map), footer.
English / Tamil switch, light / dark toggle, call + WhatsApp buttons.

## Run it
```
npm install        # react, react-dom, esbuild
npm run dev        # http://localhost:5173
npm run build      # production build in dist/ (serve dist/ with any static host; it must be http, not file://)
```

## Swap in new footage
1. Put new clips in `source/` (`build.mp4`, `entry.mp4`).
2. `npm run frames` (needs ffmpeg) — rewrites `public/frames/*` and `manifest.json`.
   The script crops/blurs the AI-tool watermark; adjust the `crop=` / `delogo=` lines if yours sits elsewhere.
3. Room photos: replace `public/rooms/{atrium,living,kitchen,bedroom,terrace}.jpg` (same names).

## Where things live
- `src/config.js` — scroll timeline (`STOPS`, `BUILD`, `ZOOM`, `DOOR`, `HERO_VH`), phone / WhatsApp / map address.
- `src/i18n.js` — ALL copy in English + Tamil (all placeholder; Tamil needs native review).
- `src/components/Hero.jsx` — canvas frame-scrubber, zoom into the door, room layers, tour rail.
- `src/reactbits/` — SplitText, CountUp, SpotlightCard, Magnet, LogoLoop, ClickSpark (own implementations of the React Bits effects).

## Before launch
- Replace placeholder company details, stats, projects, team, clients and certifications (certifications are placeholders, not real claims).
- Replace the reference room photos with licensed / generated images of your own.
- Remove the AI-tool watermarks properly by re-exporting clips without them where your plan allows.
- Replace `CONTACT` in `src/config.js` (phone, WhatsApp number, email, map address).
