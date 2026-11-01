// Tiny esbuild pipeline: bundles src/main.jsx -> dist/app.js + dist/app.css and copies /public.
// `node build.mjs`          one-off production build
// `node build.mjs --serve`  dev server with rebuild on change (http://localhost:5173)
import { cpSync, mkdirSync, rmSync } from 'node:fs';

let esbuild;
try { esbuild = await import('esbuild'); }
catch { esbuild = await import('/opt/npm-tools/node_modules/esbuild/lib/main.js'); }

const serve = process.argv.includes('--serve');
const opts = {
  entryPoints: { app: 'src/main.jsx' },
  bundle: true,
  outdir: 'dist',
  jsx: 'automatic',
  minify: !serve,
  sourcemap: serve,
  target: ['es2020'],
  loader: { '.jpg': 'file', '.png': 'file', '.svg': 'file' },
  define: { 'process.env.NODE_ENV': serve ? '"development"' : '"production"' },
  logLevel: 'info',
};

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
cpSync('public', 'dist', { recursive: true });

if (serve) {
  const ctx = await esbuild.context(opts);
  await ctx.watch();
  const { port } = await ctx.serve({ servedir: 'dist', port: 5173 });
  console.log(`Dev server: http://localhost:${port}`);
} else {
  await esbuild.build(opts);
}
