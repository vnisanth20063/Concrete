// Scroll timeline for the hero (p = 0 … 1 across the pinned section).
export const HERO_VH = 1500; // total height of the pinned hero, in viewport heights

export const BUILD = [0.02, 0.27];   // scrub the construction frames
export const ZOOM = [0.30, 0.40];    // camera pushes into the front door
export const DOOR = [0.40, 0.455];   // door opens (entry clip)

// Room tour. Each stop owns a window of the scroll; neighbours cross-dissolve at the shared edge.
export const STOPS = [
  { id: 'foyer',   a: 0.455, b: 0.56 },
  { id: 'atrium',  a: 0.56,  b: 0.648 },
  { id: 'living',  a: 0.648, b: 0.736 },
  { id: 'kitchen', a: 0.736, b: 0.824 },
  { id: 'bedroom', a: 0.824, b: 0.912 },
  { id: 'terrace', a: 0.912, b: 1.0 },
];

export const STAGES = [0.2, 0.45, 0.7, 0.9]; // build progress thresholds → foundation/structure/walls/finishing/handover

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
export const easeInOut = (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

// Convert a hero progress value to an absolute page scroll position.
export function pToScroll(p) {
  const el = document.getElementById('hero');
  if (!el) return 0;
  const top = el.getBoundingClientRect().top + window.scrollY;
  return top + p * (el.offsetHeight - window.innerHeight);
}
export function scrollToP(p) { window.scrollTo({ top: pToScroll(p), behavior: 'smooth' }); }
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
}

// Content details that don't need translating.
export const CONTACT = {
  phone: '+919876543210',
  phoneLabel: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'hello@concrete.example',
  mapQuery: 'Anna Salai, Chennai, Tamil Nadu',
};
