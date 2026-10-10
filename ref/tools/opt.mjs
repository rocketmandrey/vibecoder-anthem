// opt.mjs: fit helix camera params per ref frame.  node ref/tools/opt.mjs 303,304,... [iters]
// Needs s3_light.js to honour window.__OV[frame] = {F,psi,dc,p,sc,rot,cx,cy,ox}. Prints a JSON table of best params per frame.
import puppeteer from 'puppeteer-core';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
const frames = process.argv[2].split(',').map(Number), iters = +(process.argv[3] || 250), seed0 = process.argv[4] ? JSON.parse(readFileSync(process.argv[4], 'utf8')) : {};
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, protocolTimeout: 0,
  args: ['--allow-file-access-from-files', '--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1920,1080'] });
const page = await browser.newPage();
await page.goto(pathToFileURL(resolve('wonder.html')).href + '?render', { waitUntil: 'networkidle0' });
await page.waitForFunction('window.ready === true', { timeout: 60000 });
await page.evaluate(() => {
  const box = (a, w, h, k) => { const o = new Float32Array(w * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s = 0, n = 0; for (let j = Math.max(0, y - k); j <= Math.min(h - 1, y + k); j++) for (let i = Math.max(0, x - k); i <= Math.min(w - 1, x + k); i++) { s += a[j * w + i]; n++; } o[y * w + x] = s / n; } return o; };
  window.maskOf = (img) => { const cv = document.createElement('canvas'); cv.width = 480; cv.height = 270; const g = cv.getContext('2d'); g.drawImage(img, 0, 0, 480, 270); const d = g.getImageData(0, 0, 480, 270).data, m = new Float32Array(480 * 270), s = new Float32Array(480 * 270);
    for (let i = 0; i < 480 * 270; i++) { const r = d[i * 4], gg = d[i * 4 + 1], b = d[i * 4 + 2]; m[i] = ((r > 150 && gg < 110 && b < 110) || (b > 150 && r > 100 && r < 200 && gg < 110) || (r > 90 && gg < 50 && b < 70) || (b > 90 && b < 170 && r > 70 && gg < 70)) ? 1 : 0; s[i] = Math.max(r, gg, b) - Math.min(r, gg, b) > 90 ? 1 : 0; }
    return { m: box(m, 480, 270, 3), s: box(s, 480, 270, 3) }; };
  window.ncc = (a, b) => { let ma = 0, mb = 0; for (let i = 0; i < a.length; i++) { ma += a[i]; mb += b[i]; } ma /= a.length; mb /= a.length; let ab = 0, aa = 0, bb = 0; for (let i = 0; i < a.length; i++) { const x = a[i] - ma, y = b[i] - mb; ab += x * y; aa += x * x; bb += y * y; } return ab / Math.sqrt(aa * bb + 1e-9); };
  window.loadRef = n => new Promise(ok => { const im = new Image(); im.onload = () => ok(im); im.src = 'ref/f/' + String(n).padStart(4, '0') + '.jpg'; });
  window.scoreAt = async (f, ref) => { T = TMAP((f - 1) / 24 + 1e-4); await redraw(); composite(T); const o = maskOf(finalC()); return .7 * ncc(o.m, ref.m) + .3 * ncc(o.s, ref.s); };
});
const out = {};
const order = [...frames, ...frames.slice().reverse().slice(1)], bestScore = {};
for (const f of order) {
  const base = await page.evaluate(async f => { window.__OV = { [f]: null }; T = TMAP((f - 1) / 24 + 1e-4); await redraw(); composite(T); return window.helixParams ? window.helixParams() : null; }, f);
  let cur = (order.indexOf(f) < frames.length ? out[f - 1] : out[f + 1]) || out[f] || seed0[f] || base; const names = ['psi', 'dc', 'sc', 'p', 'cx', 'cy', 'rot', 'F', 'ox']; const sig = { psi: .05, dc: .08, sc: 60, p: .05, cx: 25, cy: 15, rot: .25, F: .08, ox: 30 }; // dc, p relative; psi, rot rad
  const evalP = async P => page.evaluate(async (f, P, n) => { window.__OV = { [f]: P }; const im = await loadRef(n); return scoreAt(f, window.__refCache[n]); }, f, P, f);
  await page.evaluate(async f => { window.__refCache = window.__refCache || {}; const im = await loadRef(f); window.__refCache[f] = maskOf(im); }, f);
  let best = await evalP(cur); let sc = 1;
  for (let it = 0; it < iters; it++) {
    const cand = { ...cur }; for (const k of names) if (Math.random() < .5) { const r = (Math.random() + Math.random() + Math.random() - 1.5) * 1.15 * sc; if (k === 'dc' || k === 'p' || k === 'F') cand[k] = cur[k] * (1 + sig[k] * r); else cand[k] = cur[k] + sig[k] * r; }
    const s = await evalP(cand);
    if (s > best) { best = s; cur = cand; } if (it % 200 === 199) sc *= .75;
  }
  if (!(bestScore[f] > best)) { out[f] = cur; bestScore[f] = best; } console.log(f, best.toFixed(3), JSON.stringify(cur, (k, v) => typeof v === 'number' ? +v.toFixed(3) : v));
}
import { writeFileSync } from 'node:fs'; writeFileSync('out/qa_C/fit.json', JSON.stringify(out));
console.log(JSON.stringify(out));
await browser.close();
