// wonder.js: «Clawd Wonder» v3, 32 s, one unbroken camera (Powers of Ten). Clawd looks at a snowflake that lands on his head;
// we dive into it: dendrite → ice lattice → H2O → oxygen atom → nucleus → quarks (time stops), snap back to the atom, its nucleus
// ignites into a star and the electron rings become planets; pull out: galaxy → cluster → cosmic web → CMB, which folds six-fold
// into the snowflake on Clawd's head. Analysis of the reference: wonder/ANALYSIS.md.
// Clawd and the paper are p5.brush (core.js / clawd.js); everything else is Canvas 2D drawn into WG and composited on top.
let METER_SHOWN = false;          // core.js draw() resets it (props.js owns it in the songs)
function drawKaraokeText() {}

// ---------- 2D helpers (all respect the context's current globalAlpha as the layer's alpha) ----------
const rng = seed => { let s = seed % 2147483647 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const mix = (a, b, k) => mixCol(a, b, clamp(k));
const sstep = (a, b, x) => ease((x - a) / (b - a));
function cam2(c, cx, cy, z = 1, r = 0) { c.setTransform(1, 0, 0, 1, 0, 0); c.translate(W / 2, H / 2); c.scale(z, z); c.rotate(r); c.translate(-cx, -cy); }
function bg(c, top, bot) { c.setTransform(1, 0, 0, 1, 0, 0); const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(0, 0, W, H); }
function radial(c, x, y, r, col, a = 1) {
  const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
  const g0 = c.globalAlpha; c.globalAlpha = g0 * a; c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); c.globalAlpha = g0;
}
const SPR = {};
function sprite(col) {   // soft glow dot, 64 px
  if (SPR[col]) return SPR[col];
  const cv = document.createElement('canvas'); cv.width = cv.height = 64; const c = cv.getContext('2d'), g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, col); g.addColorStop(.25, col + '88'); g.addColorStop(1, col + '00'); c.fillStyle = g; c.fillRect(0, 0, 64, 64);
  return SPR[col] = cv;
}
function stars(c, seed, n, a = 1, tw = 0) {
  if (a <= 0) return; const r = rng(seed), g0 = c.globalAlpha; c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#FFF6E0';
  for (let i = 0; i < n; i++) { const x = r() * W, y = r() * H, s = r() < .1 ? 2.6 : 1.3, k = .4 + .6 * Math.abs(Math.sin(tw * (1 + r() * 2) + i)); c.globalAlpha = g0 * a * k; c.fillRect(x, y, s, s); }
  c.globalAlpha = g0;
}
// segments {x1,y1,x2,y2,w,p0,p1,d} revealed up to path length G, stroked in passes (outline, fill, core) batched per depth
function segs(c, S, G, passes, filt) {
  const by = new Map(), g0 = c.globalAlpha;
  for (const s of S) { if (s.p0 >= G || (filt && !filt(s))) continue; (by.get(s.d) || by.set(s.d, []).get(s.d)).push(s); }
  for (const P of passes) {
    c.globalCompositeOperation = P.op || 'source-over'; c.globalAlpha = g0 * (P.a ?? 1); c.strokeStyle = P.col; c.lineCap = 'round'; c.lineJoin = 'round';
    for (const [, L] of by) {
      c.lineWidth = Math.max(.6, L[0].w * (P.mul ?? 1) + (P.add || 0)); c.beginPath();
      for (const s of L) { const k = s.p1 <= G ? 1 : (G - s.p0) / (s.p1 - s.p0); c.moveTo(s.x1, s.y1); c.lineTo(s.x1 + (s.x2 - s.x1) * k, s.y1 + (s.y2 - s.y1) * k); }
      c.stroke();
    }
  }
  c.globalCompositeOperation = 'source-over'; c.globalAlpha = g0;
}
function inkPoly(c, pts, fill, ink = '#120D1A', lw = 3, close = true) {
  c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); if (close) c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); } if (ink) { c.strokeStyle = ink; c.lineWidth = lw; c.lineJoin = 'round'; c.stroke(); }
}
const FULL = Math.hypot(W / 2, H / 2);

// ---------- the reference's surface vocabulary: hatching, pencil construction lines, grain ----------
let HPX = 1;   // world units per screen px of the world being drawn, so strokes keep a pen size at any zoom
function hatchIn(c, clip, cx, cy, R, seed, dark, light, px = HPX) {
  const sr = R / px; if (sr < 12) return;
  const n = Math.min(340, Math.round(sr * sr / 380)), r = rng(seed);
  c.save(); clip(); c.clip(); c.lineCap = 'round'; c.lineWidth = 2 * px;
  c.strokeStyle = dark; c.beginPath();
  for (let i = 0; i < n; i++) { const a = r() * TAU, q = Math.sqrt(r()) * R, x = cx + Math.cos(a) * q, y = cy + Math.sin(a) * q, sd = ((x - cx) * .6 + (y - cy) * .8) / R, l = (9 + r() * 24) * px;
    if (sd < -.05 + r() * .25) continue; c.moveTo(x, y); c.lineTo(x + l * .5, y - l * .87); }
  c.stroke(); c.strokeStyle = light; c.beginPath();
  for (let i = 0; i < n * .7; i++) { const a = r() * TAU, q = Math.sqrt(r()) * R, x = cx + Math.cos(a) * q, y = cy + Math.sin(a) * q, sd = ((x - cx) * .6 + (y - cy) * .8) / R, l = (8 + r() * 20) * px;
    if (sd > -.15 - r() * .2) continue; c.moveTo(x, y); c.lineTo(x + l, y + l * .06); }
  c.stroke(); c.restore();
}
function pencilRing(c, x, y, rx, ry, px, dashed, a = .3, rot = 0) { if (a <= .01) return; c.save(); c.strokeStyle = `rgba(225,220,255,${a})`; c.lineWidth = 1.2 * px; if (dashed) c.setLineDash([9 * px, 8 * px]); c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, TAU); c.stroke(); c.restore(); }
function crosshair(c, x, y, l, px, a = .25) { if (a <= .01) return; c.save(); c.strokeStyle = `rgba(225,220,255,${a})`; c.lineWidth = px; c.beginPath(); c.moveTo(x - l, y); c.lineTo(x + l, y); c.moveTo(x, y - l); c.lineTo(x, y + l); c.stroke(); c.restore(); }
let TEX = null;
function textures() {   // static full-frame layers: rain-like hatch for dark grounds, signed grain (anti-banding), painted nebula
  const mk = f => { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; f(cv.getContext('2d')); return cv; }, r = rng(77);
  TEX = {
    rain: mk(c => { c.lineCap = 'round'; for (let i = 0; i < 5200; i++) { const x = r() * W, y = r() * H, l = 6 + r() * 22; c.strokeStyle = `rgba(200,190,255,${.03 + r() * .05})`; c.lineWidth = 1 + r(); c.beginPath(); c.moveTo(x, y); c.lineTo(x + l * .45, y - l * .9); c.stroke(); } }),
    grain: mk(c => { const id = c.createImageData(W, H), d = id.data; for (let i = 0; i < d.length; i += 4) { const v = 128 + (r() - .5) * 70; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } c.putImageData(id, 0, 0); }),
    neb: mk(c => { for (const [col, n] of [['#6A3FD0', 26], ['#C0408C', 16], ['#2E8FA8', 14], ['#3F55D8', 18]]) for (let i = 0; i < n; i++) { const x = r() * W, y = r() * H, R = 120 + r() * 420, g = c.createRadialGradient(x, y, 0, x, y, R);
      g.addColorStop(0, col + '2A'); g.addColorStop(1, col + '00'); c.fillStyle = g; c.fillRect(x - R, y - R, 2 * R, 2 * R); }
      c.lineCap = 'round'; for (let i = 0; i < 2600; i++) { const x = r() * W, y = r() * H, l = 10 + r() * 30; c.strokeStyle = `rgba(${r() < .5 ? '190,150,255' : '255,170,220'},${.03 + r() * .05})`; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + l, y + l * .1 * (r() - .5)); c.stroke(); }
      for (let i = 0; i < 700; i++) { const x = r() * W, y = r() * H, sz = r() < .08 ? 3 : 1.4; c.fillStyle = `rgba(255,246,224,${.25 + r() * .6})`; c.fillRect(x, y, sz, sz);
        if (sz > 2) { c.strokeStyle = 'rgba(255,240,210,.5)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x - 7, y + 1.5); c.lineTo(x + 10, y + 1.5); c.moveTo(x + 1.5, y - 7); c.lineTo(x + 1.5, y + 10); c.stroke(); } } }),
  };
}

// ---------- geometry ----------
// snowflake: one dendritic arm along +x, mirrored side branches at ±60°, six copies; p = path length from the centre
const SNOW = (() => {
  const r = rng(7), L = 430, out = [], add = (x1, y1, x2, y2, w, p0, d) => out.push({ x1, y1, x2, y2, w, p0, p1: p0 + Math.hypot(x2 - x1, y2 - y1), d });
  add(0, 0, L, 0, 15, 0, 0);
  for (const f of [.16, .27, .38, .49, .59, .68, .77, .85, .92]) {
    const s = L * f, l = (L - s) * (.42 + r() * .22), w = 10 - f * 6;
    for (const sg of [1, -1]) {
      const a = sg * Math.PI / 3, ex = s + Math.cos(a) * l, ey = Math.sin(a) * l; add(s, 0, ex, ey, w, s, 1);
      for (const g of [.3, .55, .78]) { const bx = s + Math.cos(a) * l * g, by = Math.sin(a) * l * g, bl = l * (1 - g) * .5;
        for (const sg2 of [1, -1]) add(bx, by, bx + Math.cos(a + sg2 * Math.PI / 3) * bl, by + Math.sin(a + sg2 * Math.PI / 3) * bl, w * .55, s + l * g, 2); }
    }
  }
  const all = [];
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3, ca = Math.cos(a), sa = Math.sin(a);
    for (const s of out) all.push({ ...s, x1: s.x1 * ca - s.y1 * sa, y1: s.x1 * sa + s.y1 * ca, x2: s.x2 * ca - s.y2 * sa, y2: s.x2 * sa + s.y2 * ca }); }
  return { segs: all, L };
})();

// ---------- the camera: one log-zoom for the whole film ----------
// LZ(t) = ln(atom-world scale, px per unit). Paper zoom = az / (SN·AU), snow-world scale = az / AU, the cosmic worlds hang off az.
const SN = 18 / 430, AU = .7 / 500, LP0 = Math.log(SN * AU), CEN = [W / 2, H / 2];
function mono(keys) {   // monotone cubic through [t, v] keys (Fritsch–Carlson): no overshoot, holds ease in and out
  const n = keys.length, X = keys.map(k => k[0]), Y = keys.map(k => k[1]), d = [], m = [];
  for (let i = 0; i < n - 1; i++) d[i] = (Y[i + 1] - Y[i]) / (X[i + 1] - X[i]);
  m[0] = d[0]; m[n - 1] = d[n - 2]; for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) { if (!d[i]) { m[i] = m[i + 1] = 0; continue; } const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b; if (h > 9) { const k = 3 / Math.sqrt(h); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; } }
  return t => { if (t <= X[0]) return Y[0]; if (t >= X[n - 1]) return Y[n - 1]; let i = 0; while (t > X[i + 1]) i++;
    const h = X[i + 1] - X[i], u = (t - X[i]) / h, u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * Y[i] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * Y[i + 1] + (u3 - u2) * h * m[i + 1]; };
}
const LZ = mono([[0, LP0], [4.9, LP0], [7.0, LP0 + Math.log(27)], [11.0, Math.log(.98)], [13.3, 3.75], [14.7, 4.38], [15.9, 4.38], [17.0, Math.log(.95)], [19.4, Math.log(.72)], [26.6, Math.log(2.6e-5)], [27.4, Math.log(2.2e-5)]]);
const PZO = mono([[27.7, Math.log(27)], [29.3, 0]]);                    // pull-out from the snowflake back to the paper
// motion time: runs normally, nearly stops at the bottom (quarks), restarts on the snap back
const TAUT = (() => { const dt = 1 / 96, a = [0]; for (let t = dt; t <= 32.02; t += dt) a.push(a.at(-1) + (1 - .97 * sstep(14.2, 14.9, t) + .97 * sstep(15.7, 16.2, t)) * dt); return t => a[Math.min(a.length - 1, Math.round(t / dt))]; })();
const spin = t => .9 * sstep(6.6, 11, t);

// ---------- ice: lattice inside the +x arm, the vertex the camera dives into ----------
const E = 2, AX = E * Math.sqrt(3), ARM_V = [Math.round(210 / AX) * AX, 0];
function lattice(c, cx, cy, R, la, ma, s) {
  const px = 1 / s, A = [];
  const j0 = Math.floor((cy - R) / (1.5 * E)) - 1, j1 = Math.ceil((cy + R) / (1.5 * E)) + 1;
  for (let j = j0; j <= j1; j++) { const xo = j * AX / 2, y = j * 1.5 * E; for (let i = Math.floor((cx - R - xo) / AX) - 1; i <= Math.ceil((cx + R - xo) / AX) + 1; i++) A.push([xo + i * AX, y]); }
  const nb = [[0, E], [-AX / 2, -E / 2], [AX / 2, -E / 2]];
  // honeycomb bonds
  c.globalAlpha *= la; c.strokeStyle = '#7FE3FF'; c.lineWidth = Math.max(1.6 * px, .09); c.beginPath();
  for (const [x, y] of A) for (const [dx, dy] of nb) { c.moveTo(x, y); c.lineTo(x + dx, y + dy); } c.stroke();
  if (ma > 0) {
    const g0 = c.globalAlpha; c.globalAlpha = g0 * ma;
    // every bond carries one hydrogen: A owns the two lower bonds, B (= A + (0, E)) the vertical one and one toward the viewer
    const Hs = [], OH = .7;
    for (const [x, y] of A) { Hs.push([x + nb[1][0] / E * OH, y + nb[1][1] / E * OH, x + nb[1][0], y + nb[1][1]], [x + nb[2][0] / E * OH, y + nb[2][1] / E * OH, x + nb[2][0], y + nb[2][1]], [x, y + E - OH, x, y]); }
    c.setLineDash([.18, .16]); c.strokeStyle = '#BFF4FF'; c.lineWidth = Math.max(2 * px, .07); c.beginPath();
    for (const [hx, hy, ox, oy] of Hs) { const dx = ox - hx, dy = oy - hy, l = Math.hypot(dx, dy); c.moveTo(hx, hy); c.lineTo(ox - dx / l * .7, oy - dy / l * .7); } c.stroke(); c.setLineDash([]);
    HPX = px; const bl = (x, y, r, c0, c1) => ball(c, x, y, r, c0, c1, Math.max(2.4 * px, .05));
    for (const [x, y] of A) { bl(x, y, .62, '#FF9A7A', '#C2302E'); bl(x, y + E, .62, '#FF9A7A', '#C2302E'); }
    for (const [hx, hy] of Hs) bl(hx, hy, .3, '#FFFFFF', '#C9C3B6');
    for (const [x, y] of A) bl(x + .28, y + E - .3, .26, '#FFFFFF', '#C9C3B6');
    c.globalAlpha = g0;
  }
  c.globalAlpha /= la || 1;
}
// snow world: origin (the flake's centre) at screen (ox, oy), scale s, spun by rot, camera slid toward ARM_V by k
function snowWorld(c, s, rot, k, t, ox, oy) {
  bg(c, '#141B52', '#05082A'); stars(c, 3, 220, .8, t * 2);
  c.setTransform(1, 0, 0, 1, 0, 0); c.translate(ox, oy); c.rotate(rot); c.scale(s, s); c.translate(-ARM_V[0] * k, -ARM_V[1] * k);
  radial(c, 0, 0, 700, '#3C5BC2', .5);
  const ls = Math.log(s), deep = sstep(Math.log(6), Math.log(40), ls), px = 1 / s; HPX = px;
  pencilRing(c, 0, 0, 505, 505, px, true, .4 * (1 - deep)); pencilRing(c, 0, 0, 580, 580, px, false, .25 * (1 - deep)); pencilRing(c, 0, 0, 120, 120, px, true, .3 * (1 - deep)); crosshair(c, 0, 0, 660, px, .22 * (1 - deep));
  segs(c, SNOW.segs, 1e9, [{ col: '#7FD8FF', add: 26, a: .12 * (1 - deep), op: 'lighter' }, { col: '#0A0F33', add: 7 + 2 * px }, { col: mix('#D9F6FF', '#123C66', deep), add: px }, { col: '#FFFFFF', mul: .3, a: 1 - deep }]);
  const hex = r => Array.from({ length: 6 }, (_, i) => [Math.cos(i * Math.PI / 3 + Math.PI / 6) * r, Math.sin(i * Math.PI / 3 + Math.PI / 6) * r]);
  inkPoly(c, hex(62), mix('#BFEFFF', '#123C66', deep), '#0A0F33', 5); inkPoly(c, hex(34), mix('#EFFFFF', '#1B4C7A', deep), '#0A0F33', 3);
  const la = sstep(Math.log(14), Math.log(40), ls), ma = sstep(Math.log(60), Math.log(150), ls);
  if (la > 0) { c.save(); c.beginPath(); c.rect(-5, -11, 445, 22); c.clip(); lattice(c, ARM_V[0] * k, ARM_V[1] * k, FULL / s, la, ma, s); c.restore(); }
  c.setTransform(1, 0, 0, 1, 0, 0);
}
// the same crystal, drawn tiny on paper (ink outline + ice), so the zoom in and out is one object
function flakeSnow(c, x, y, s, rot, a = 1) {
  c.save(); c.setTransform(1, 0, 0, 1, x, y); c.rotate(rot); c.scale(s, s); c.globalAlpha = a;
  segs(c, SNOW.segs, 1e9, [{ col: '#2B2233', add: 3.4 / s }, { col: '#CDEFFF', add: 1.3 / s }]); c.restore();
}

// ---------- atom → star ----------
const NUC = (() => {
  const r = rng(41), p = []; let R = 27, tries = 0;
  while (p.length < 16) { if (++tries % 4000 === 0) R += 1.5; const q = [(r() * 2 - 1) * R, (r() * 2 - 1) * R, (r() * 2 - 1) * R];
    if (Math.hypot(...q) > R || p.some(o => Math.hypot(o[0] - q[0], o[1] - q[1], o[2] - q[2]) < 15)) continue; p.push(q); }
  p.sort((a, b) => a[2] - b[2]);
  return p.map((q, i) => ({ x: q[0], y: q[1], pr: i === p.length - 1 || i % 2 === 1 }));
})();
const PS = NUC[NUC.length - 1];                    // the front proton the camera dives into
const CLOUD = (() => { const r = rng(12), d = []; for (let i = 0; i < 1500; i++) { const a = r() * TAU, rr = 40 + 440 * Math.pow(r(), .8); d.push([Math.cos(a) * rr, Math.sin(a) * rr * (.75 + .25 * Math.cos(a * 2))]); } return d; })();
const TILT = -.3, BA = .38;
const PLAN = [[170, '#B9A48E', 9], [235, '#E8C07A', 14], [310, '#3E8FD8', 15], [390, '#D9653B', 12], [530, '#E3B07A', 36], [660, '#E9D29A', 30], [780, '#8FD3E0', 21], [890, '#4E6FE0', 21]];
const EL = PLAN.map((p, i) => ({ ring: i < 2 ? 0 : 1, ph: i < 2 ? i * Math.PI + .4 : (i - 2) / 6 * TAU + .9, w: i < 2 ? 2.4 : 1.6, wp: .7 / Math.pow(p[0] / 170, 1.2) }));
const orbXY = (r, a) => { const x = Math.cos(a) * r, y = Math.sin(a) * r * BA; return [x * Math.cos(TILT) - y * Math.sin(TILT), x * Math.sin(TILT) + y * Math.cos(TILT)]; };
function ball(c, x, y, r, c0, c1, lw, ink = '#120D1A', seed = (x * 131 + y * 71) | 0) {
  const g = c.createRadialGradient(x - r * .35, y - r * .35, r * .08, x, y, r); g.addColorStop(0, c0); g.addColorStop(1, c1);
  c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = g; c.fill();
  hatchIn(c, () => { c.beginPath(); c.arc(x, y, r, 0, TAU); }, x, y, r, seed, 'rgba(40,12,44,.5)', 'rgba(255,252,244,.75)');
  if (ink) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.strokeStyle = ink; c.lineWidth = lw; c.stroke(); }
}
function atomWorld(c, az, ox, oy, t, A = 1) {
  const tau = TAUT(t), sunK = sstep(16.9, 17.7, t), fus = seg(t, 16.4, 17.5), px = 1 / az, la = Math.log(az), g0 = c.globalAlpha; HPX = px;
  c.setTransform(az, 0, 0, az, ox, oy); c.globalAlpha = g0 * A;
  // electron cloud (fades as we fall through it, and when the star lights)
  const cloud = (1 - sunK) * (1 - sstep(Math.log(1.6), Math.log(5), la));
  if (cloud > .01) {
    radial(c, 0, 0, 560, '#3D6BFF', .4 * cloud); radial(c, 0, 0, 260, '#9B7BFF', .35 * cloud);
    c.save(); c.rotate(TILT);
    for (const d of [0, Math.PI / 3, 2 * Math.PI / 3]) for (const sg of [1, -1]) { c.save(); c.rotate(d); c.translate(170 * sg, 0);
      c.beginPath(); c.ellipse(0, 0, 160, 78, 0, 0, TAU); c.fillStyle = `rgba(150,120,255,${.13 * cloud})`; c.fill(); c.strokeStyle = `rgba(190,170,255,${.5 * cloud})`; c.lineWidth = 2 * px; c.stroke(); c.restore(); }
    c.restore();
    c.fillStyle = '#CFE9FF'; c.globalAlpha = g0 * A * .55 * cloud; const ds = 2.4 * px; for (const [x, y] of CLOUD) c.fillRect(x - ds / 2, y - ds / 2, ds, ds); c.globalAlpha = g0 * A;
  }
  pencilRing(c, 0, 0, 120, 120, px, true, .4 * cloud); pencilRing(c, 0, 0, 300, 300, px, false, .25 * cloud); pencilRing(c, 0, 0, 470, 470, px, true, .3 * cloud); crosshair(c, 0, 0, 540, px, .2 * cloud);
  if (sunK > 0) { pencilRing(c, 0, 0, 165, 165, px, true, .35 * sunK); crosshair(c, 0, 0, 980, px, .14 * sunK); for (const [r] of PLAN) pencilRing(c, 0, 0, r * 1.035, r * BA * 1.035, px, true, .16 * sunK, TILT); }
  // rings → orbits, electrons → planets
  const rings = [200, 400], tauS = TAUT(17), ringA = 1 - sstep(Math.log(2.5), Math.log(7), la);
  const pos = EL.map((e, i) => { const r = lerp(rings[e.ring], PLAN[i][0], sunK), a = e.ph + e.w * Math.min(tau, tauS) + e.wp * Math.max(0, tau - tauS); return orbXY(r, a).concat([r, a]); });
  if (ringA > 0) {
    c.lineWidth = 2.2 * px; c.strokeStyle = mix('#7FE3FF', '#8E9BD0', sunK); c.globalAlpha = g0 * A * ringA * lerp(.9, .55, sunK);
    const rs = sunK > 0 ? PLAN.map((p, i) => lerp(rings[EL[i].ring], p[0], sunK)) : rings;
    for (const r of rs) { c.beginPath(); c.ellipse(0, 0, r, r * BA, TILT, 0, TAU); c.stroke(); }
    c.globalAlpha = g0 * A;
  }
  const body = (i, [x, y, , a]) => {
    if (ringA <= 0) return; c.globalAlpha = g0 * A * ringA;
    const r = lerp(7, PLAN[i][2], sunK);
    if (sunK < 1) { c.globalAlpha = g0 * A * ringA * (1 - sunK); c.drawImage(sprite('#7FE3FF'), x - r * 3, y - r * 3, r * 6, r * 6); ball(c, x, y, r * .7, '#FFFFFF', '#7FE3FF', 1.6 * px, '#120D1A', i); }
    if (sunK > 0) { c.globalAlpha = g0 * A * ringA * sunK;
      if (i === 5) { c.save(); c.translate(x, y); c.rotate(-.35); c.scale(1, .32); c.beginPath(); c.arc(0, 0, r * 2.1, Math.PI, TAU); c.strokeStyle = '#120D1A'; c.lineWidth = r * .9; c.stroke(); c.strokeStyle = '#F2DCA6'; c.lineWidth = r * .6; c.stroke(); c.restore(); }
      ball(c, x, y, r, mix(PLAN[i][1], '#FFFFFF', .35), PLAN[i][1], 2.6 * px, '#120D1A', 50 + i);
      c.save(); c.beginPath(); c.arc(x, y, r, 0, TAU); c.clip(); const l = Math.hypot(x, y) || 1; c.fillStyle = 'rgba(10,6,24,.55)'; c.beginPath(); c.arc(x + x / l * r * .9, y + y / l * r * .9, r * 1.1, 0, TAU); c.fill(); c.restore();
      c.beginPath(); c.arc(x, y, r, 0, TAU); c.strokeStyle = '#120D1A'; c.lineWidth = 2.6 * px; c.stroke();
      if (i === 5) { c.save(); c.translate(x, y); c.rotate(-.35); c.scale(1, .32); c.beginPath(); c.arc(0, 0, r * 2.1, 0, Math.PI); c.strokeStyle = '#120D1A'; c.lineWidth = r * .9; c.stroke(); c.strokeStyle = '#F2DCA6'; c.lineWidth = r * .6; c.stroke(); c.restore(); }
    }
    c.globalAlpha = g0 * A;
  };
  if (sunK > 0) { c.fillStyle = '#CDBFA9'; c.globalAlpha = g0 * A * sunK * .85; for (let i = 0; i < 1100; i++) { const belt = i < 700, rr = belt ? 445 + 60 * hash(i * 1.7) : 950 + 130 * hash(i * 2.9), a = hash(i * 5.3) * TAU + tau * (belt ? .12 : .04), [x, y] = orbXY(rr, a), sz = (1.3 + 1.8 * hash(i * 9.1)) * px; c.fillRect(x - sz / 2, y - sz / 2, sz, sz); } c.globalAlpha = g0 * A; }
  pos.forEach((p, i) => { if (Math.sin(p[3]) < 0) body(i, p); });
  // nucleus → star
  if (sunK < 1) {
    const nA = 1 - sunK; c.globalAlpha = g0 * A * nA;
    radial(c, 0, 0, 90, '#FF8A5C', .5 * (1 - cloud * .5));
    const inside = sstep(Math.log(150), Math.log(500), Math.log(13 * az));
    NUC.forEach((n, i) => { if (n === PS && inside > 0) return; const j = Math.sin(tau * 9 + i * 2.1) * .9, k = Math.cos(tau * 7 + i * 1.3) * .9;
      ball(c, n.x + j, n.y + k, 13, n.pr ? '#FFB08F' : '#C6D6FF', n.pr ? '#C8342C' : '#3E5BA8', Math.max(2.4 * px, .15), '#120D1A', 100 + i); });
    if (inside > 0) proton(c, tau, inside, px);
    if (fus > 0) { c.globalCompositeOperation = 'lighter'; radial(c, 0, 0, 60 + 400 * fus, '#FFF2B0', Math.sin(Math.PI * fus) * .9);
      for (let i = 0; i < 14; i++) { const a = i * 2.4 + tau, rr = 20 + 60 * frac(fus * 3 + i * .37); c.drawImage(sprite('#FFFFFF'), Math.cos(a) * rr - 14, Math.sin(a) * rr - 14, 28, 28); }
      c.globalCompositeOperation = 'source-over'; }
  }
  if (sunK > 0) {
    c.globalAlpha = g0 * A * sunK; const R = lerp(40, 110, sunK);
    c.globalCompositeOperation = 'lighter'; radial(c, 0, 0, R * 6, '#FFB347', .45); radial(c, 0, 0, R * 2.2, '#FFE9A0', .5); c.globalCompositeOperation = 'source-over';
    c.save(); c.rotate(tau * .08);
    for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, l = R * (i % 2 ? 1.32 : 1.58), w = .075;
      inkPoly(c, [[Math.cos(a - w) * R * 1.06, Math.sin(a - w) * R * 1.06], [Math.cos(a) * l, Math.sin(a) * l], [Math.cos(a + w) * R * 1.06, Math.sin(a + w) * R * 1.06]], i % 2 ? '#FFD45A' : '#FFB02E', '#3A1606', 2.4 * px); }
    c.restore();
    ball(c, 0, 0, R, '#FFF6C0', '#F07A1E', 4 * px, '#3A1606', 7);
    c.fillStyle = 'rgba(255,214,90,.55)'; for (let i = 0; i < 70; i++) { const a = hash(i) * TAU, rr = Math.sqrt(hash(i * 3.3)) * R * .9, s = R * (.05 + .05 * hash(i * 7)); c.beginPath(); c.arc(Math.cos(a) * rr, Math.sin(a) * rr, s, 0, TAU); c.fill(); }
  }
  c.globalAlpha = g0 * A;
  pos.forEach((p, i) => { if (Math.sin(p[3]) >= 0) body(i, p); });
  c.globalAlpha = g0; c.setTransform(1, 0, 0, 1, 0, 0);
}
// the proton we fall into: three valence quarks, gluon springs flickering, virtual pairs popping (all frozen when tau stops)
function proton(c, tau, k, px) {
  const { x, y } = PS, R = 13, g0 = c.globalAlpha;
  c.save(); c.translate(x, y);
  ball(c, 0, 0, R, '#FF9C80', '#7A1830', Math.max(2.4 * px, .05), '#120D1A', 300); c.beginPath(); c.arc(0, 0, R, 0, TAU); c.clip();
  c.globalAlpha = g0 * k; c.fillStyle = '#16061C'; c.fill(); radial(c, 0, 0, R, '#5A1648', .9);
  const q = [0, 1, 2].map(i => { const a = i / 3 * TAU - Math.PI / 2 + tau * .35; return [Math.cos(a) * 5.4 + Math.sin(tau * 5 + i) * .5, Math.sin(a) * 5.4 + Math.cos(tau * 4 + i * 2) * .5]; });
  // sea quarks
  const f = Math.floor(tau * 10);
  for (let i = 0; i < 26; i++) { const h = hash(i * 7.3 + f * 1.9), a = h * TAU, rr = 2 + hash(i * 3.1 + f) * 10, ag = frac(tau * 10); c.globalAlpha = g0 * k * .7 * Math.sin(Math.PI * ag);
    const sx = Math.cos(a) * rr, sy = Math.sin(a) * rr; c.drawImage(sprite(i % 2 ? '#7FE3FF' : '#FF7FD0'), sx - .9, sy - .9, 1.8, 1.8); c.drawImage(sprite(i % 2 ? '#FF7FD0' : '#7FE3FF'), sx + .5 - .9, sy + .4 - .9, 1.8, 1.8); }
  // gluons
  c.globalAlpha = g0 * k;
  for (let p = 0; p < 3; p++) { const [ax, ay] = q[p], [bx, by] = q[(p + 1) % 3], dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l, fl = .55 + .45 * Math.sin(tau * 31 + p * 2);
    const path = () => { c.beginPath(); for (let i = 0; i <= 80; i++) { const u = i / 80, o = Math.sin(u * 9 * TAU + tau * 22) * .75 * Math.sin(Math.PI * u); i ? c.lineTo(ax + dx * u + nx * o, ay + dy * u + ny * o) : c.moveTo(ax, ay); } };
    c.globalCompositeOperation = 'lighter'; path(); c.strokeStyle = `rgba(255,210,90,${.35 * fl})`; c.lineWidth = 1.4; c.stroke(); c.globalCompositeOperation = 'source-over';
    path(); c.strokeStyle = '#FFE9A0'; c.lineWidth = .28; c.stroke(); }
  const qc = [['#FF8A8A', '#D3203A'], ['#9BF0B0', '#1F9A4A'], ['#9CC2FF', '#2A55D0']];
  q.forEach(([qx, qy], i) => { c.globalCompositeOperation = 'lighter'; c.drawImage(sprite(qc[i][0]), qx - 6, qy - 6, 12, 12); c.globalCompositeOperation = 'source-over'; ball(c, qx, qy, 2.4, qc[i][0], qc[i][1], Math.max(2.4 * px, .04), '#120D1A', 200 + i); });
  c.restore(); c.globalAlpha = g0;
  c.beginPath(); c.arc(x, y, R, 0, TAU); c.strokeStyle = '#120D1A'; c.lineWidth = Math.max(3 * px, .06); c.stroke();
}

// ---------- the cosmic ladder ----------
const GAL = (() => {
  const r = rng(91), st = [], tilt = (x, y) => { y *= .62; const a = .45; return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]; };
  for (let i = 0; i < 6500; i++) { const arm = i % 2, th = r() * 3 * Math.PI, rr = 60 * Math.exp(.25 * th), sp = rr * .2 * (r() + r() - 1), a = th + arm * Math.PI;
    st.push([...tilt(Math.cos(a) * rr + Math.cos(a + 1.57) * sp, Math.sin(a) * rr + Math.sin(a + 1.57) * sp), r() < .06 ? 2 : r() < .5 ? 1 : 0, 1 + r() * 2.5]); }
  for (let i = 0; i < 1400; i++) { const a = r() * TAU, rr = 70 * Math.sqrt(-Math.log(1 - r() * .999)); st.push([...tilt(Math.cos(a) * rr, Math.sin(a) * rr), 3, 1.5 + r() * 2]); }
  const lane = arm => { const p = []; for (let th = .4; th < 3 * Math.PI; th += .05) { const rr = 60 * Math.exp(.25 * th) * .94, a = th + arm * Math.PI - .14; p.push(tilt(Math.cos(a) * rr, Math.sin(a) * rr)); } return p; };
  const th0 = 2.2 * Math.PI, r0 = 60 * Math.exp(.25 * th0);
  return { st, lanes: [lane(0), lane(1)], sun: tilt(Math.cos(th0) * r0, Math.sin(th0) * r0) };
})();
const GCOL = ['#CFE0FF', '#FFFFFF', '#FF7FB0', '#FFE2A8'];
function galaxy(c, gz, ox, oy, A, t) {
  if (A <= .01) return; const g0 = c.globalAlpha; c.globalAlpha = g0 * A;
  c.setTransform(gz, 0, 0, gz, ox, oy);
  radial(c, 0, 0, 760, '#4D5FC0', .45); radial(c, 0, 0, 420, '#8A7BD8', .35); radial(c, 0, 0, 260, '#FFD9A0', .8); radial(c, 0, 0, 90, '#FFF6E0', .9);
  c.strokeStyle = 'rgba(26,10,20,.35)'; c.lineCap = 'round'; c.lineJoin = 'round';
  for (const L of GAL.lanes) { c.lineWidth = 7; c.beginPath(); L.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.lineWidth = Math.max(2 / gz, 3); c.strokeStyle = 'rgba(18,13,26,.6)'; c.stroke(); c.strokeStyle = 'rgba(26,10,20,.35)'; }
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'lighter';
  for (const [x, y, k, s] of GAL.st) { const S = Math.max(3, Math.min(60, s * gz * 2.2)), X = ox + x * gz, Y = oy + y * gz; if (X < -S || X > W + S || Y < -S || Y > H + S) continue; c.drawImage(sprite(GCOL[k]), X - S / 2, Y - S / 2, S, S); }
  c.globalCompositeOperation = 'source-over';
  const [sx, sy] = [ox + GAL.sun[0] * gz, oy + GAL.sun[1] * gz]; star4(c, sx, sy, 26, '#FFE27A');
  c.globalAlpha = g0;
}
function star4(c, x, y, s, col) { c.globalCompositeOperation = 'lighter'; c.drawImage(sprite(col), x - s, y - s, 2 * s, 2 * s); c.globalCompositeOperation = 'source-over';
  inkPoly(c, [[x, y - s], [x + s * .18, y - s * .18], [x + s, y], [x + s * .18, y + s * .18], [x, y + s], [x - s * .18, y + s * .18], [x - s, y], [x - s * .18, y - s * .18]], '#FFF6D0', '#2B1A10', 2); }
const AC = [260, -150];
const CLU = (() => { const r = rng(55), g = []; while (g.length < 70) { const x = (r() * 2 - 1) * 1700, y = (r() * 2 - 1) * 1000; if (Math.hypot(x - AC[0], y - AC[1]) < 170) continue; g.push([x, y, 30 + r() * 80, r() < .55, r() * TAU, .35 + r() * .55]); } return g; })();
function miniGal(c, x, y, R, spiral, rot, sq, A) {
  const g0 = c.globalAlpha; c.globalAlpha = g0 * A;
  c.globalCompositeOperation = 'lighter'; c.drawImage(sprite(spiral ? '#BFD3FF' : '#FFD9B0'), x - R * 1.1, y - R * 1.1, R * 2.2, R * 2.2); c.drawImage(sprite('#FFF4DA'), x - R * .5, y - R * .5, R, R); c.globalCompositeOperation = 'source-over';
  if (spiral && R > 6) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(1, sq); c.strokeStyle = '#E3ECFF'; c.lineWidth = Math.max(1.2, R * .07) / Math.sqrt(sq); c.lineCap = 'round';
    for (const arm of [0, Math.PI]) { c.beginPath(); for (let th = 0; th < 2.6 * Math.PI; th += .15) { const rr = R * .12 * Math.exp(.3 * th); c.lineTo(Math.cos(th + arm) * rr, Math.sin(th + arm) * rr); } c.stroke(); }
    c.restore(); }
  c.globalAlpha = g0;
}
function cluster(c, cz, ox, oy, A, galA) {
  if (A <= .01) return; const g0 = c.globalAlpha; c.globalAlpha = g0 * A; c.setTransform(1, 0, 0, 1, 0, 0);
  radial(c, ox, oy, 1300 * cz, '#7B5CFF', .22);
  for (const [x, y, R, sp, rot, sq] of CLU) miniGal(c, ox + x * cz, oy + y * cz, R * cz, sp, rot, sq, 1);
  if (galA < 1) miniGal(c, ox + AC[0] * cz, oy + AC[1] * cz, 60 * cz, true, .45, .62, 1 - galA);
  c.globalAlpha = g0;
}
const WEB = (() => { const r = rng(66), n = [[90, 40]]; while (n.length < 260) n.push([(r() * 2 - 1) * 3600, (r() * 2 - 1) * 2200]);
  const seen = new Set(), E2 = [];
  n.forEach((p, i) => n.map((q, j) => [Math.hypot(q[0] - p[0], q[1] - p[1]), j]).sort((a, b) => a[0] - b[0]).slice(1, 4).forEach(([, j]) => { const k = Math.min(i, j) + ':' + Math.max(i, j); if (!seen.has(k)) { seen.add(k); E2.push([i, j]); } }));
  const deg = n.map(() => 0); E2.forEach(([i, j]) => { deg[i]++; deg[j]++; }); return { n, E: E2, deg }; })();
function web(c, wz, ox, oy, A, cluA) {
  if (A <= .01) return; const g0 = c.globalAlpha; c.globalAlpha = g0 * A; c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'lighter';
  const P = ([x, y]) => [ox + x * wz, oy + y * wz];
  for (const [i, j] of WEB.E) { const [ax, ay] = P(WEB.n[i]), [bx, by] = P(WEB.n[j]), mx = (ax + bx) / 2 + (hash(i * 3 + j) - .5) * .3 * (by - ay), my = (ay + by) / 2 - (hash(i + j * 5) - .5) * .3 * (bx - ax);
    if (Math.max(ax, bx, mx) < -50 || Math.min(ax, bx, mx) > W + 50 || Math.max(ay, by, my) < -50 || Math.min(ay, by, my) > H + 50) continue;
    c.beginPath(); c.moveTo(ax, ay); c.quadraticCurveTo(mx, my, bx, by); c.strokeStyle = 'rgba(150,100,255,.3)'; c.lineWidth = Math.max(4, 50 * wz); c.stroke(); c.strokeStyle = 'rgba(255,215,180,.6)'; c.lineWidth = Math.max(1.2, 6 * wz); c.stroke();
    const L2 = Math.hypot(bx - ax, by - ay), nx = -(by - ay) / (L2 || 1), ny = (bx - ax) / (L2 || 1), np = Math.min(70, 8 + L2 / 12);
    for (let k = 1; k < np; k++) { const u = k / np, h = hash(i * 9.3 + j * 3.1 + k * 1.7), o = (h - .5) * (h - .5) * 4 * Math.max(8, 70 * wz) * (hash(k * 5 + i) < .5 ? -1 : 1), x = (1 - u) * (1 - u) * ax + 2 * u * (1 - u) * mx + u * u * bx + nx * o, y = (1 - u) * (1 - u) * ay + 2 * u * (1 - u) * my + u * u * by + ny * o, sz = 3 + 6 * hash(i * 9 + k);
      c.drawImage(sprite(h < .3 ? '#FFD8A8' : '#C9A8FF'), x - sz / 2, y - sz / 2, sz, sz); } }
  WEB.n.forEach((p, i) => { const [x, y] = P(p), s = Math.max(8, 110 * wz) * (.6 + .25 * WEB.deg[i]); if (x < -s || x > W + s || y < -s || y > H + s) return; if (i === 0 && cluA > .5) return; c.drawImage(sprite('#FFC877'), x - s / 2, y - s / 2, s, s); });
  c.globalCompositeOperation = 'source-over'; c.globalAlpha = g0;
}
let CMB = null, CMBF = null;
const CMBP = ['#0B1E6B', '#1E5FC0', '#41B4E6', '#BFEFF0', '#FFE79A', '#FFB347', '#F0642E', '#B8202E'];
function cmbTex() {
  const w = 384, h = 192, v = new Float32Array(w * h), r = rng(19), bl = [];
  for (let i = 0; i < 420; i++) bl.push([r(), r(), .012 + .08 * Math.pow(r(), 2), (r() * 2 - 1)]);
  let lo = 1e9, hi = -1e9;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s = .25 * (hash(x * 1.3 + y * 71.7) - .5); const u = x / w, q = y / h;
    for (const [bx, by, sg, a] of bl) { const dx = (u - bx) * 2, dy = q - by, d2 = dx * dx + dy * dy; if (d2 < 9 * sg * sg) s += a * Math.exp(-d2 / (sg * sg)); }
    v[y * w + x] = s; lo = Math.min(lo, s); hi = Math.max(hi, s); }
  const col = x => { x = clamp(x) * (CMBP.length - 1); const i = Math.floor(x); return parseInt(mix(CMBP[i], CMBP[Math.min(i + 1, CMBP.length - 1)], x - i).slice(1), 16); };
  const mk = (W2, H2, f) => { const cv = document.createElement('canvas'); cv.width = W2; cv.height = H2; const cx = cv.getContext('2d'), id = cx.createImageData(W2, H2);
    for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) { const s = f(x, y); if (s == null) continue; const n = col((s - lo) / (hi - lo)), o = (y * W2 + x) * 4; id.data[o] = n >> 16; id.data[o + 1] = n >> 8 & 255; id.data[o + 2] = n & 255; id.data[o + 3] = 255; }
    cx.putImageData(id, 0, 0); return cv; };
  CMB = mk(w, h, (x, y) => v[y * w + x]);
  // six-fold kaleidoscope of the same sky: angle folded into a 30° wedge and mirrored
  CMBF = mk(384, 384, (x, y) => { const dx = x - 192, dy = y - 192, rr = Math.hypot(dx, dy) / 192; if (rr > 1) return null; let a = Math.atan2(dy, dx); a = ((a % (Math.PI / 3)) + Math.PI / 3) % (Math.PI / 3); if (a > Math.PI / 6) a = Math.PI / 3 - a;
    const u = .5 + rr * Math.cos(a) * .48, q = .5 + rr * Math.sin(a) * .95; return v[Math.min(h - 1, Math.floor(q * h)) * w + Math.min(w - 1, Math.floor(u * w))]; });
}
function cmb(c, mz, ox, oy, A, fK) {
  if (A <= .01) return; if (!CMB) cmbTex(); const g0 = c.globalAlpha; c.globalAlpha = g0 * A; c.setTransform(1, 0, 0, 1, 0, 0);
  const rx = lerp(900 * mz, 486, fK), ry = lerp(450 * mz, 486, fK), x = lerp(ox, W / 2, fK), y = lerp(oy, H / 2, fK), rot = fK * .7;
  c.save(); c.translate(x, y); c.rotate(rot); c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, TAU); c.save(); c.clip();
  if (fK < 1) { c.globalAlpha = g0 * A * (1 - fK); c.drawImage(CMB, -rx, -ry, 2 * rx, 2 * ry); }
  if (fK > 0) { c.globalAlpha = g0 * A * fK; const R = Math.max(rx, ry); c.drawImage(CMBF, -R, -R, 2 * R, 2 * R); }
  c.globalAlpha = g0 * A * (1 - fK); c.strokeStyle = 'rgba(30,20,40,.35)'; c.lineWidth = 1.3; c.beginPath(); for (const k of [.25, .5, .75]) c.ellipse(0, 0, rx * k, ry, 0, 0, TAU); for (const k of [-.66, -.33, 0, .33, .66]) { const hw = rx * Math.sqrt(1 - k * k); c.moveTo(-hw, ry * k); c.lineTo(hw, ry * k); } c.stroke();
  c.restore(); c.globalAlpha = g0 * A; c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, TAU); c.strokeStyle = '#120D1A'; c.lineWidth = 7; c.stroke(); c.strokeStyle = 'rgba(255,240,210,.35)'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 0, rx + 9, ry + 9, 0, 0, TAU); c.stroke();
  c.restore(); c.globalAlpha = g0;
}
// everything from the oxygen atom outward, one scale chain: atom → galaxy (×40) → cluster (×12) → web (×10) → CMB (×8)
function cosmos(c, t, az) {
  const L = Math.log, sunK = sstep(16.9, 17.7, t), k2 = sstep(11.5, 12.9, t) * (1 - sstep(15.9, 16.7, t));
  bg(c, '#070514', '#0C0820'); { const nb = sstep(16.8, 18, t); if (nb > 0) { const g = c.globalAlpha; c.globalAlpha = g * nb; c.drawImage(TEX.neb, 0, 0); c.globalAlpha = g; } } stars(c, 31, 320, sstep(16.8, 18, t), t * 2);
  const gz = az * 40, cz = gz * 12, wz = cz * 10, mz = wz * 8;
  let Oa = [CEN[0] - PS.x * az * k2, CEN[1] - PS.y * az * k2];
  const Og0 = [Oa[0] - GAL.sun[0] * gz, Oa[1] - GAL.sun[1] * gz], Oc0 = [Og0[0] - AC[0] * cz, Og0[1] - AC[1] * cz], Ow0 = [Oc0[0] - WEB.n[0][0] * wz, Oc0[1] - WEB.n[0][1] * wz];
  let sh = [0, 0];
  for (const [O, ck] of [[Og0, sstep(L(2600), L(800), L(700 * gz))], [Oc0, sstep(L(3000), L(1000), L(1700 * cz))], [Ow0, sstep(L(5000), L(1600), L(3600 * wz))]]) sh = [lerp(sh[0], CEN[0] - O[0], ck), lerp(sh[1], CEN[1] - O[1], ck)];
  const S = O => [O[0] + sh[0], O[1] + sh[1]];
  const [Og, Oc, Ow] = [S(Og0), S(Oc0), S(Ow0)]; Oa = S(Oa);
  const fK = sstep(26.9, 27.6, t);
  const solA = sstep(L(12), L(60), L(900 * az)), galA = sstep(L(500), L(150), L(900 * az)) * sstep(L(14), L(45), L(700 * gz));
  const cluA = sstep(L(260), L(90), L(700 * gz)) * sstep(L(30), L(90), L(1700 * cz)), cmbA = sstep(L(1500), L(600), L(3600 * wz)), webA = sstep(L(300), L(100), L(1700 * cz)) * (1 - .85 * cmbA) * (1 - fK);
  cmb(c, mz, Ow[0], Ow[1], cmbA, fK);
  web(c, wz, Ow[0], Ow[1], webA, cluA);
  cluster(c, cz, Oc[0], Oc[1], cluA * (1 - fK), galA);
  galaxy(c, gz, Og[0], Og[1], galA, t);
  if (solA > .01) atomWorld(c, az, Oa[0], Oa[1], t, solA);
}

// ---------- the whole wonder frame ----------
function wonder(c, t, fx = W / 2, fy = H / 2) {
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  if (t >= 27.45) { snowWorld(c, Math.exp(PZO(t)) * SN, .9 + .25 * seg(t, 27.4, 29), 0, t, fx, fy); if (t < 27.95) { c.globalAlpha = 1 - sstep(27.45, 27.9, t); cosmos(c, t, Math.exp(LZ(t))); c.globalAlpha = 1; } }
  else {
    const az = Math.exp(LZ(t));
    if (t < 11.3) { const s = az / AU, rot = spin(t), k = sstep(6.8, 8.6, t); snowWorld(c, s, rot, k, t, fx, fy);
      if (t > 10.45) { const d = (1 - k) * s, vx = (ARM_V[0] * Math.cos(rot) - ARM_V[1] * Math.sin(rot)) * d, vy = (ARM_V[0] * Math.sin(rot) + ARM_V[1] * Math.cos(rot)) * d;
        c.globalAlpha = sstep(10.45, 11.15, t); bg(c, '#070514', '#0C0820'); atomWorld(c, az, fx + vx, fy + vy, t, 1); c.globalAlpha = 1; } }
    else cosmos(c, t, az);
  }
  // rain-hatch on the dark ground and a signed grain (dithers the glows, no banding), then the paper fibre
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'screen'; c.drawImage(TEX.rain, 0, 0); c.globalCompositeOperation = 'overlay'; c.globalAlpha = .16; c.drawImage(TEX.grain, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = .35; c.globalCompositeOperation = 'soft-light'; c.drawImage(paperG.canvas || paperG.elt, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
}

// ---------- paper world: Clawd ----------
const GY = 800, U = 26, CX = 860, FL = [CX - .5 * U, GY - 8 * U - 4];   // ground, Clawd unit, where he stops, the flake on his head
let WG = null, OV = null, UL = null;
const clawdX = t => lerp(2150, CX, easeOut(seg(t, .3, 3.2) * 1.02));
function flakePos(t) {   // falling with a sway, lands on his head at 4.4
  if (t >= 4.4) return [FL[0], FL[1], 0];
  const k = seg(t, 0, 4.4), x = lerp(1240, FL[0], ease(k)) + Math.sin(t * 2.3) * 70 * (1 - k), y = lerp(-60, FL[1], k);
  return [x, y, t * 1.4 * (1 - k)];
}
function pencilBurst(u, x, y, k) {   // concentration lines + construction circles around what he's looking at (screen px)
  if (k <= .01) return; const r = rng(515); u.save(); u.lineCap = 'round'; u.globalAlpha = k; u.lineWidth = 1.1;
  u.strokeStyle = 'rgba(70,60,50,.42)'; u.beginPath();
  for (let i = 0; i < 180; i++) { const a = r() * TAU, r0 = 150 + r() * 260 + (1 - k) * 200, l = 60 + r() * 440; u.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); u.lineTo(x + Math.cos(a) * (r0 + l), y + Math.sin(a) * (r0 + l)); }
  u.stroke(); u.strokeStyle = 'rgba(70,60,50,.33)';
  for (const [R, d] of [[110, 0], [200, 1], [330, 0], [520, 1]]) { u.setLineDash(d ? [7, 6] : []); u.beginPath(); u.arc(x, y, R * (.7 + .3 * k), 0, TAU); u.stroke(); }
  u.restore();
}
const CLH = (() => { const r = rng(808), d = [], l = []; for (let i = 0; i < 150; i++) { const x = -4.8 + r() * 9.6, y = -7.8 + r() * 5.6, k = (x + 5) / 10 * .45 + (y + 8) / 6 * .55; if (k > .4 + r() * .3) d.push([x, y, .5 + r() * .9]); else if (k < .55) l.push([x, y, .5 + r() * 1.1]); } return { d, l }; })();
function clawdHatch(c, toS, z, x, y, flip) {   // the reference's pencil hatching on the body, in body units (fixed: no boil), eyes and mouth kept clean
  const [sx, sy] = toS(x, y), u = U * z; c.save(); c.setTransform(u * (flip ? -1 : 1), 0, 0, u, sx, sy);
  c.beginPath(); c.rect(-4.85, -7.85, 9.7, 5.7); c.rect(-3.6, -7.6, 2.2, 3); c.rect(1.4, -7.6, 2.2, 3); c.rect(-1.3, -5, 2.6, 1.2); c.clip('evenodd');
  c.lineCap = 'round'; c.lineWidth = 1.5 / u * Math.min(3, Math.sqrt(z));
  c.strokeStyle = 'rgba(140,52,30,.5)'; c.beginPath(); for (const [px, py, l] of CLH.d) { c.moveTo(px, py); c.lineTo(px + l * .45, py - l * .9); } c.stroke();
  c.strokeStyle = 'rgba(255,196,166,.6)'; c.beginPath(); for (const [px, py, l] of CLH.l) { c.moveTo(px, py); c.lineTo(px + l, py + l * .05); } c.stroke();
  c.restore();
}
function flushBrush() { brush.noStroke(); brush.noHatch(); brush.noWash(); brush.fill('#000000', 1); brush.fillBleed(0); brush.fillTexture(0, 0); brush.polygon([[-50, -50], [-40, -50], [-40, -40]]); brush.noFill(); }
function steadyClawd(x, y, u, o) { randomSeed(4242); clawd(x, y, u, o); }       // fixed seed: one model, no boil

function paperScene(t) {
  const out = t >= 27.7, z = out ? Math.exp(PZO(t)) : Math.exp(LZ(t) - LP0), fk = out ? 1 - sstep(28.5, 29.3, t) : sstep(4.9, 6.0, t);
  const hap = t > 29.45, hop = hap ? Math.max(0, Math.sin(seg(t, 29.9, 31.7) * Math.PI * 3)) : 0, F = [FL[0], FL[1] - hop * 1.6 * U];
  const cx = lerp(W / 2, F[0], fk), cy = lerp(H / 2, F[1], fk), toS = (px, py) => [(px - cx) * z + W / 2, (py - cy) * z + H / 2];
  { const u = UL.drawingContext; u.setTransform(1, 0, 0, 1, 0, 0); u.clearRect(0, 0, W, H); u.strokeStyle = '#8C8274'; u.lineWidth = Math.max(1.4, 1.4 * z); u.lineCap = 'round'; u.beginPath();
    for (let gx = -900; gx <= W + 900; gx += 40) { const [a, b2] = toS(gx, GY + Math.sin(gx * .013) * .9 + Math.sin(gx * .071) * .5); gx === -900 ? u.moveTo(a, b2) : u.lineTo(a, b2); } u.stroke();
    const [bx, by] = toS(...F); pencilBurst(u, bx, by, out ? sstep(27.8, 28.3, t) * (1 - sstep(28.9, 29.5, t)) : sstep(4.7, 5.4, t) * (1 - sstep(6.6, 7.0, t))); image(UL, 0, 0, W, H); }
  camBegin(cx, cy, z);
  const x = clawdX(t), walking = t > .3 && t < 3.1;
  const o = { flip: walking, walk: walking ? (2150 - x) / 95 : null, dy: walking ? -Math.abs(Math.sin((2150 - x) / 95 * Math.PI)) * .25 : -hop * 1.6,
    aL: hap ? .2 + .65 * ease(seg(t, 29.5, 29.8)) : .15, aR: hap ? .2 + .65 * ease(seg(t, 29.5, 29.8)) : .15 };
  if (t > 3.1 && !hap) { const fp = flakePos(t); o.eyes = 'look'; o.lookX = clamp((fp[0] - x) / 300, -1, 1); o.lookY = -1; }
  if (hap) { o.eyes = 'happy'; o.mouth = 'smile'; }
  if (t > 4.4 && t < 4.65) o.sq = .07 * Math.sin(seg(t, 4.4, 4.65) * Math.PI);
  steadyClawd(x, GY, U, o);
  camEnd(); flushBrush();
  // overlay (2D, screen space): hatching on Clawd, the flake (or the whole wonder frame fading in/out around it), snowfall at the end
  const c = OV.drawingContext; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
  clawdHatch(c, toS, z, x, GY + o.dy * U, o.flip);
  const fp = t < 4.4 ? flakePos(t) : [F[0], F[1], hap ? Math.sin(t * 3) * .15 : 0], [sx, sy] = toS(fp[0], fp[1]);
  const wa = out ? 1 - sstep(28.15, 28.65, t) : sstep(6.45, 6.95, t);
  flakeSnow(c, sx, sy, SN * z * (t < 4.4 ? 1 + 1.4 * (1 - seg(t, 0, 4.4)) : 1), fp[2]);
  if (wa > 0) { wonder(WG.drawingContext, t, sx, sy); c.globalAlpha = wa; c.drawImage(WG.canvas || WG.elt, 0, 0); c.globalAlpha = 1; }
  if (t > 28.4) { const r = rng(23); for (let i = 0; i < 22; i++) { const x0 = r() * W, sp = .5 + r() * .6, y = -40 + (t - 28.4 - r() * .8) * 150 * sp, s = SN * (.45 + r() * .5);
    if (y > -40 && y < H + 40) flakeSnow(c, x0 + Math.sin(t * 1.5 + i) * 40, y, s, t * (r() - .5) * 2, 1 - wa); } }
  image(OV, 0, 0, W, H);
}

function drawWorld(t) {
  if (!TEX) textures();
  if (!WG) { WG = createGraphics(W, H); WG.pixelDensity(1); OV = createGraphics(W, H); OV.pixelDensity(1); UL = createGraphics(W, H); UL.pixelDensity(1); }
  if (t >= 7.0 && t < 28.1) { wonder(WG.drawingContext, t); image(WG, 0, 0, W, H); }
  else paperScene(t);
}
