// kit.js: shared helpers + scene registry for the 1:1 reconstruction of the reference (ref/ — not in git).
// Every scene file is an IIFE that calls SC.add(t0, t1, { draw(c, t), twos }) and keeps its own names private.
// c is a 2D context of a full 1920x1080 canvas, cleared to transparent; the scene paints EVERY pixel (its own background).
// twos: true → the scene is sampled at 12 fps (held for 2 frames), like the reference's character / Earth-rise shots.
const K = (() => {
  const rng = s => () => (s = (s * 16807) % 2147483647) / 2147483647;
  const hash = x => { const s = Math.sin(x * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const sstep = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
  const mix = (a, b, k) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const ease = { inOut: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, out: x => 1 - Math.pow(1 - x, 3), in: x => x * x * x, expoIn: x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10) };
  // monotone cubic through [[t, v], …] (no overshoot) — the camera-curve workhorse of v4
  const mono = keys => { const n = keys.length, xs = keys.map(k => k[0]), ys = keys.map(k => k[1]), d = [], m = [];
    for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
    m[0] = d[0]; m[n - 1] = d[n - 2]; for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (let i = 0; i < n - 1; i++) { if (!d[i]) { m[i] = m[i + 1] = 0; continue; } const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b; if (s > 9) { const k = 3 / Math.sqrt(s); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; } }
    return t => { if (t <= xs[0]) return ys[0]; if (t >= xs[n - 1]) return ys[n - 1]; let i = 0; while (t > xs[i + 1]) i++;
      const h = xs[i + 1] - xs[i], u = (t - xs[i]) / h, u2 = u * u, u3 = u2 * u;
      return (2 * u3 - 3 * u2 + 1) * ys[i] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * ys[i + 1] + (u3 - u2) * h * m[i + 1]; }; };
  const SPR = {};
  const sprite = col => SPR[col] || (SPR[col] = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, col); gr.addColorStop(.25, col + 'AA'); gr.addColorStop(1, col + '00'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return cv; })());
  const canvas = (w = W, h = H) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv; };
  return { rng, hash, sstep, mix, ease, mono, sprite, canvas, soup: null };
})();
const SC = { list: [], add(t0, t1, s) { this.list.push(Object.assign({ t0, t1 }, s)); } };
