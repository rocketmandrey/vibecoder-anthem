// wonder.js: «Clawd Wonder», 32 s. Clawd on paper notices a snowflake, thinks, and the thought bubble opens a chain of ten
// wonders (snowflake → Lichtenberg → mycelium → cymatics → nautilus → fern → aurora → Saturn → whale song → city lights),
// the Earth shrinks back into the bubble, it pops, Clawd is happy. Analysis of the reference: wonder/ANALYSIS.md.
// Clawd and the paper are p5.brush (core.js / clawd.js); every wonder is Canvas 2D drawn into WG and composited on top.
let METER_SHOWN = false;          // core.js draw() resets it (props.js owns it in the songs)
function drawKaraokeText() {}

// ---------- beats (s) ----------
const B = {
  walk0: .3, walk1: 3.2, land: 4.4, think: 4.9, bub: 5.2, zoom0: 5.6, open: 6.4,
  lich: 8.6, flash: 9.85, cut1: 10.0, pan: 11.1, drop: 11.95, cut2: 12.3,
  naut: 14.0, fern: 16.0, aur: 18.1, cut3: 20.5, cut4: 22.8, city: 24.6, back: 26.0, close: 27.2, pop: 28.4, end: 32
};

// ---------- 2D helpers ----------
const rng = seed => { let s = seed % 2147483647 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const mix = (a, b, k) => mixCol(a, b, clamp(k));
const sstep = (a, b, x) => ease((x - a) / (b - a));
function cam2(c, cx, cy, z = 1, r = 0) { c.setTransform(1, 0, 0, 1, 0, 0); c.translate(W / 2, H / 2); c.scale(z, z); c.rotate(r); c.translate(-cx, -cy); }
function bg(c, top, bot) { c.setTransform(1, 0, 0, 1, 0, 0); const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(0, 0, W, H); }
function radial(c, x, y, r, col, a = 1) {
  const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.globalAlpha = a; c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); c.globalAlpha = 1;
}
const SPR = {};
function sprite(col) {   // soft glow dot, 64 px
  if (SPR[col]) return SPR[col];
  const cv = document.createElement('canvas'); cv.width = cv.height = 64; const c = cv.getContext('2d'), g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, col); g.addColorStop(.25, col + '88'); g.addColorStop(1, col + '00'); c.fillStyle = g; c.fillRect(0, 0, 64, 64);
  return SPR[col] = cv;
}
function stars(c, seed, n, a = 1, tw = 0) {
  const r = rng(seed); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#FFF6E0';
  for (let i = 0; i < n; i++) { const x = r() * W, y = r() * H, s = r() < .1 ? 2.6 : 1.3, k = .4 + .6 * Math.abs(Math.sin(tw * (1 + r() * 2) + i)); c.globalAlpha = a * k; c.fillRect(x, y, s, s); }
  c.globalAlpha = 1;
}
// segments {x1,y1,x2,y2,w,p0,p1,d} revealed up to path length G, stroked in passes (outline, fill, core) batched per depth
function segs(c, S, G, passes, filt) {
  const by = new Map();
  for (const s of S) { if (s.p0 >= G || (filt && !filt(s))) continue; (by.get(s.d) || by.set(s.d, []).get(s.d)).push(s); }
  for (const P of passes) {
    c.globalCompositeOperation = P.op || 'source-over'; c.globalAlpha = P.a ?? 1; c.strokeStyle = P.col; c.lineCap = 'round'; c.lineJoin = 'round';
    for (const [, L] of by) {
      c.lineWidth = Math.max(.6, L[0].w * (P.mul ?? 1) + (P.add || 0)); c.beginPath();
      for (const s of L) { const k = s.p1 <= G ? 1 : (G - s.p0) / (s.p1 - s.p0); c.moveTo(s.x1, s.y1); c.lineTo(s.x1 + (s.x2 - s.x1) * k, s.y1 + (s.y2 - s.y1) * k); }
      c.stroke();
    }
  }
  c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
}
function inkPoly(c, pts, fill, ink = '#120D1A', lw = 3, close = true) {
  c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); if (close) c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); } if (ink) { c.strokeStyle = ink; c.lineWidth = lw; c.lineJoin = 'round'; c.stroke(); }
}

// ---------- geometry (built once) ----------
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
const TIPA = -Math.PI / 6 - Math.PI / 3;           // the arm the camera dives into (upper right after the spin)
const TIP = [Math.cos(TIPA) * SNOW.L, Math.sin(TIPA) * SNOW.L];
// Lichtenberg / mycelium: one jagged branching tree from the snowflake tip, all directions
const LICH = (() => {
  const r = rng(31), out = [];
  const grow = (x, y, a, len, w, d, p) => {
    const n = 3 + Math.floor(r() * 3), st = len / n;
    for (let i = 0; i < n; i++) { a += (r() - .5) * .95; const nx = x + Math.cos(a) * st, ny = y + Math.sin(a) * st; out.push({ x1: x, y1: y, x2: nx, y2: ny, w, p0: p, p1: p + st, d }); x = nx; y = ny; p += st; }
    if (d >= 8 || w < .25) return;
    const kids = r() < .28 ? 3 : 2;
    for (let k = 0; k < kids; k++) grow(x, y, a + (k - (kids - 1) / 2) * .75 + (r() - .5) * .7, len * (.66 + r() * .14), w * .7, d + 1, p);
  };
  for (let i = 0; i < 7; i++) grow(TIP[0], TIP[1], TIPA + i / 7 * TAU + r() * .4, 70 + r() * 30, 7, 0, 0);
  return out;
})();
// Chladni plate grains: random start in the disc → the nodal lines of cos(nπx)cos(mπy) − cos(mπx)cos(nπy)
const NG = 6500, PLATE = 500;
const GRAIN = (() => {
  const r = rng(5), n = 5, m = 2, P = Math.PI, g = [];
  const f = (x, y) => Math.cos(n * P * x) * Math.cos(m * P * y) - Math.cos(m * P * x) * Math.cos(n * P * y);
  while (g.length < NG) {
    let x = r() * 2 - 1, y = r() * 2 - 1; if (x * x + y * y > .96) continue; const sx = x, sy = y;
    for (let i = 0; i < 24; i++) { const e = 1e-4, v = f(x, y), gx = (f(x + e, y) - v) / e, gy = (f(x, y + e) - v) / e, gg = gx * gx + gy * gy + 1e-6; x -= .6 * v * gx / gg; y -= .6 * v * gy / gg; }
    if (x * x + y * y > .97) continue;
    g.push({ sx: sx * PLATE, sy: sy * PLATE, cx: x * PLATE, cy: y * PLATE, nx: 0, ny: 0, k: r() });
  }
  return g;
})();
// nautilus: r = a·e^(bθ), three turns, centre offset so the shell sits in frame
const NAU = (() => {
  const b = Math.log(3) / TAU, tm = 3 * TAU, a = 560 / Math.exp(b * tm), C = [1010, 560], ph = -1.2;
  const P = th => { const r = a * Math.exp(b * th); return [C[0] + r * Math.cos(th + ph), C[1] + r * Math.sin(th + ph)]; };
  const ch = [], N = 30;
  for (let k = 0; k < N; k++) {
    const t1 = tm - 1.05 - k * (TAU / 14) * Math.pow(.985, k), t0 = t1 - (TAU / 14) * Math.pow(.985, k + 1); if (t0 < TAU * .6) break;
    const pts = [];
    for (let i = 0; i <= 8; i++) pts.push(P(t0 + (t1 - t0) * i / 8));
    const sep = (th, s) => { const o = P(th), q = P(th - TAU), m = P(th + .35), out = []; for (let i = 0; i <= 8; i++) { const u = s ? i / 8 : 1 - i / 8, w = 4 * u * (1 - u) * .35;
      out.push([o[0] + (q[0] - o[0]) * u + (m[0] - o[0]) * w * .4, o[1] + (q[1] - o[1]) * u + (m[1] - o[1]) * w * .4]); } return out; };
    pts.push(...sep(t1, 1));
    for (let i = 8; i >= 0; i--) pts.push(P(t0 - TAU + (t1 - t0) * i / 8));
    pts.push(...sep(t0, 0));
    ch.push(pts);
  }
  const outer = [], inner = [], body = [];
  for (let i = 0; i <= 260; i++) { const th = TAU * .6 + (tm - TAU * .6) * i / 260; outer.push(P(th)); inner.push(P(th - TAU)); }
  for (let i = 0; i <= 30; i++) body.push(P(tm - 1.05 + 1.05 * i / 30)); for (let i = 30; i >= 0; i--) body.push(P(tm - 1.05 + 1.05 * i / 30 - TAU));
  // grain targets: walk every outline
  const lines = [...ch, outer], tot = lines.reduce((s, l) => s + l.length, 0), tg = [];
  for (let i = 0; i < NG; i++) { let j = Math.floor(hash(i * 3.1) * tot); for (const l of lines) { if (j < l.length) { const p = l[j], q = l[(j + 1) % l.length], u = hash(i * 7.7); tg.push([p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u]); break; } j -= l.length; } }
  GRAIN.forEach((g, i) => { g.nx = tg[i][0] - 960; g.ny = tg[i][1] - 540; });
  return { ch, outer, inner, body, C, P, b, tm, a, ph };
})();

// ---------- the wonders (each draws the full 1920×1080 into c at time t) ----------
function wSnowLich(c, t) {
  // camera: slow spin while the crystal grows, then a dive into the upper-right tip
  const dive = sstep(B.lich - .2, B.lich + .6, t), spin = .9 * sstep(B.bub, B.lich, t);
  const z = Math.exp(Math.log(3) * dive) * (1 + .25 * ease(seg(t, B.open, B.lich))), cx = TIP[0] * dive, cy = TIP[1] * dive;
  const flash = sstep(B.flash - .25, B.flash, t);
  bg(c, mix('#141B52', '#1C0838', dive), mix('#05082A', '#07021A', dive));
  stars(c, 3, 220, .8, t * 2);
  cam2(c, cx, cy, z, spin);
  radial(c, 0, 0, 700, '#3C5BC2', .5 * (1 - dive));
  // the crystal (fades as the discharge takes over)
  const G = 470 * Math.pow(seg(t, B.bub + .1, B.lich - .1), .8), sa = 1 - sstep(B.lich + .25, B.lich + .65, t);
  if (sa > 0) {
    c.save(); c.globalAlpha = sa;
    segs(c, SNOW.segs, G, [{ col: '#7FD8FF', add: 26, a: .12, op: 'lighter' }, { col: '#0A0F33', add: 7 }, { col: '#D9F6FF' }, { col: '#FFFFFF', mul: .3 }]);
    const hx = 62 * ease(seg(t, B.bub + .1, B.bub + .8)), hex = r => Array.from({ length: 6 }, (_, i) => [Math.cos(i * Math.PI / 3 + Math.PI / 6) * r, Math.sin(i * Math.PI / 3 + Math.PI / 6) * r]);
    if (hx > 1) { inkPoly(c, hex(hx), '#BFEFFF', '#0A0F33', 5); inkPoly(c, hex(hx * .55), '#EFFFFF', '#0A0F33', 3); }
    c.restore();
  }
  // the discharge from the tip
  if (t > B.lich + .15) {
    const L = 440 * Math.pow(seg(t, B.lich + .1, B.flash - .05), .75);
    const sw = 1 / z, d5 = s => s.d <= 5;
    segs(c, LICH, L, [{ col: '#9B6BFF', add: 22 * sw, a: .16, op: 'lighter' }, { col: '#20073F', add: 5 * sw }, { col: '#C9A8FF' }, { col: '#FFFFFF', mul: .35 }], d5);
    radial(c, TIP[0], TIP[1], 120, '#E6D2FF', .7);
  }
  c.setTransform(1, 0, 0, 1, 0, 0);
  if (flash > 0) { c.fillStyle = '#FBF7FF'; c.globalAlpha = flash; c.fillRect(0, 0, W, H); c.globalAlpha = 1; }
}
function wMycel(c, t) {
  // same tree, burnt in: the discharge scar glows amber in the soil and keeps branching as hyphae, the camera tilts up to the caps
  const pan = 760 * ease(seg(t, B.pan, B.pan + .85)) + 120 * easeIn(seg(t, B.drop + .05, B.cut2));
  bg(c, '#1A0F08', '#0D0704');
  const r = rng(12); c.setTransform(1, 0, 0, 1, 0, pan);
  for (let i = 0; i < 260; i++) { const x = r() * W, y = r() * H * 1.4 - 200, s = 3 + r() * 14; c.fillStyle = r() < .5 ? '#2A1A0F' : '#24140B'; c.beginPath(); c.ellipse(x, y, s, s * .7, r() * 3, 0, TAU); c.fill(); }
  cam2(c, TIP[0], TIP[1] - pan / 3, 3);
  const G = 420 + 330 * easeOut(seg(t, B.cut1, B.pan + .6)), sw = 1 / 3;
  segs(c, LICH, G, [{ col: '#FF9A2E', add: 20 * sw, a: .15, op: 'lighter' }, { col: '#2A1204', add: 4.5 * sw }, { col: '#FFB547' }, { col: '#FFF0C0', mul: .3 }]);
  // surface, night sky and caps
  c.setTransform(1, 0, 0, 1, 0, 0);
  const sy = pan - 140;
  if (sy > -200) {
    const g = c.createLinearGradient(0, sy - 900, 0, sy); g.addColorStop(0, '#05081C'); g.addColorStop(1, '#16203F'); c.fillStyle = g; c.fillRect(0, sy - 900, W, 900);
    c.save(); c.translate(0, sy - 760); stars(c, 9, 0); c.restore();
    const ground = []; for (let x = -20; x <= W + 20; x += 40) ground.push([x, sy + Math.sin(x * .007) * 14 + Math.sin(x * .031) * 5]);
    inkPoly(c, [...ground, [W + 20, sy + 60], [-20, sy + 60]], '#1A0F08', '#0B0604', 6);
    const caps = [[520, 1, 0], [830, 1.6, .12], [1240, 1.15, .2], [1500, .7, .3], [300, .6, .25]];
    for (const [x, s0, dl] of caps) {
      const k = backOut(seg(t, B.pan + .35 + dl, B.pan + .8 + dl)); if (k <= .01) continue;
      const s = s0 * k, h = 190 * s, y0 = sy + Math.sin(x * .007) * 14, cw = 150 * s0 * Math.min(1, k * 1.1);
      radial(c, x, y0 - h, cw * 2.2, '#FFB547', .35);
      inkPoly(c, [[x - 16 * s0, y0 + 4], [x - 11 * s0, y0 - h], [x + 11 * s0, y0 - h], [x + 18 * s0, y0 + 4]], '#F3E3C4', '#120D1A', 4);
      c.beginPath(); c.moveTo(x - cw, y0 - h); c.quadraticCurveTo(x - cw * .9, y0 - h - cw * .95, x, y0 - h - cw * .9); c.quadraticCurveTo(x + cw * .9, y0 - h - cw * .95, x + cw, y0 - h);
      c.quadraticCurveTo(x, y0 - h + cw * .18, x - cw, y0 - h); c.closePath(); c.fillStyle = '#E9573F'; c.fill(); c.strokeStyle = '#120D1A'; c.lineWidth = 5; c.stroke();
      c.strokeStyle = '#FFCB6B'; c.lineWidth = 2; for (let i = -6; i <= 6; i++) { c.beginPath(); c.moveTo(x, y0 - h + cw * .06); c.lineTo(x + i / 6 * cw * .9, y0 - h + cw * .02); c.stroke(); }
      const rd = rng(x); c.fillStyle = '#FFF3DC'; for (let i = 0; i < 7; i++) { const a = -Math.PI * (.15 + .7 * rd()), rr = cw * (.3 + .5 * rd()); c.beginPath(); c.ellipse(x + Math.cos(a) * rr, y0 - h - cw * .1 + Math.sin(a) * rr * .65, cw * .07, cw * .05, 0, 0, TAU); c.fill(); }
    }
    // the drop: forms under the big cap's rim and falls toward the lens
    const df = seg(t, B.drop - .25, B.drop + .05), fall = easeIn(seg(t, B.drop + .05, B.cut2));
    if (df > 0) {
      const x = 830 + 150 * 1.6 * .8, y = sy + 3 - 190 * 1.6 + 30 + fall * 900, rr = (6 + 10 * df) * (1 + fall * 5);
      inkPoly(c, [[x, y - rr * 2.1], [x + rr, y], [x, y + rr], [x - rr, y]].map(([px, py]) => [px, py]), '#BFF1FF', '#120D1A', 3);
      c.fillStyle = '#FFFFFF'; c.beginPath(); c.ellipse(x - rr * .35, y - rr * .1, rr * .18, rr * .28, 0, 0, TAU); c.fill();
    }
  }
  const fl = 1 - seg(t, B.cut1, B.cut1 + .3);
  if (fl > 0) { c.fillStyle = '#FBF7FF'; c.globalAlpha = fl; c.fillRect(0, 0, W, H); c.globalAlpha = 1; }
}
function wPlateNaut(c, t) {
  const toN = sstep(B.naut, B.naut + .7, t), fillN = sstep(B.naut + .45, B.naut + 1.1, t);
  bg(c, mix('#0B0B12', '#0C2C4E', toN), mix('#050508', '#03101F', toN));
  // ocean light shafts + plankton once it's the nautilus
  if (toN > 0) { c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const x = 200 + i * 330 + Math.sin(t * .6 + i) * 40;
    const g = c.createLinearGradient(x, 0, x + 260, H); g.addColorStop(0, `rgba(90,170,220,${.10 * toN})`); g.addColorStop(1, 'rgba(90,170,220,0)'); c.fillStyle = g;
    c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 120, 0); c.lineTo(x + 420, H); c.lineTo(x + 180, H); c.fill(); } c.globalCompositeOperation = 'source-over'; }
  // camera: still over the plate, then a slow turn and the self-similar dive into the spiral's eye
  const dz = seg(t, B.fern - .3, B.fern + .4), C = NAU.C, eye = NAU.P(TAU * .62);
  const z = Math.exp(easeIn(dz) * 3.4) * (1 + .2 * ease(seg(t, B.naut, B.fern))), cxx = lerp(960, eye[0], ease(dz * 1.6)), cyy = lerp(540, eye[1], ease(dz * 1.6));
  cam2(c, cxx, cyy, z, -.3 * ease(seg(t, B.naut, B.fern)) - easeIn(dz) * 1.2);
  // plate
  const pa = 1 - toN;
  if (pa > 0) {
    c.globalAlpha = pa; c.fillStyle = '#16181F'; c.beginPath(); c.arc(960, 540, PLATE + 20, 0, TAU); c.fill(); c.strokeStyle = '#3A3E4C'; c.lineWidth = 3;
    for (let i = 1; i < 4; i++) { c.beginPath(); c.arc(960, 540, PLATE + 20 - i * 3, 0, TAU); c.stroke(); }
    c.strokeStyle = '#000'; c.lineWidth = 8; c.beginPath(); c.arc(960, 540, PLATE + 24, 0, TAU); c.stroke();
    const rip = seg(t, B.cut2, B.cut2 + .8); if (rip < 1) for (let i = 0; i < 3; i++) { const rr = (rip * 1.4 - i * .12) * PLATE; if (rr > 0 && rr < PLATE) { c.strokeStyle = `rgba(190,240,255,${.5 * (1 - rip)})`; c.lineWidth = 4; c.beginPath(); c.arc(960, 540, rr, 0, TAU); c.stroke(); } }
    c.fillStyle = '#7A6A3A'; c.beginPath(); c.arc(960, 540, 18, 0, TAU); c.fill(); c.globalAlpha = 1;
  }
  // nautilus body
  if (fillN > 0) {
    c.globalAlpha = fillN;
    inkPoly(c, [...NAU.outer, ...[...NAU.inner].reverse()], '#E9D8C4', null);
    const pear = ['#F7E8D8', '#F1D5CB', '#E5DDF1', '#D6ECEF', '#F4E2C6'];
    NAU.ch.forEach((p, i) => {
      const cx = p.reduce((s, q) => s + q[0], 0) / p.length, cy = p.reduce((s, q) => s + q[1], 0) / p.length, g = c.createRadialGradient(cx, cy, 0, cx, cy, 160 * Math.pow(.95, i));
      g.addColorStop(0, '#FFFDF7'); g.addColorStop(.6, pear[i % 5]); g.addColorStop(1, mix(pear[(i + 2) % 5], '#B98E86', .35)); inkPoly(c, p, g, '#1A1420', Math.max(1.5, 4 * Math.pow(.96, i)));
    });
    { const g = c.createLinearGradient(...NAU.P(NAU.tm), ...NAU.P(NAU.tm - TAU)); g.addColorStop(0, '#F6CDB8'); g.addColorStop(1, '#7E3E4E'); inkPoly(c, NAU.body, g, '#1A1420', 4); }
    // the shell wall with tiger stripes
    c.lineCap = 'round'; c.beginPath(); NAU.outer.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
    c.strokeStyle = '#1A1420'; c.lineWidth = 34; c.stroke(); c.strokeStyle = '#F4E6D0'; c.lineWidth = 26; c.stroke();
    c.setLineDash([30, 46]); c.strokeStyle = '#C4582F'; c.lineWidth = 24; c.stroke(); c.setLineDash([]);
    // siphuncle
    c.fillStyle = '#B25A3C'; for (let k = 0; k < 120; k++) { const th = TAU * .75 + (NAU.tm - 1.05 - TAU * .75 - TAU) * k / 120 + TAU; const o = NAU.P(th), q = NAU.P(th - TAU), r = 3 + 6 * k / 120;
      c.beginPath(); c.arc(o[0] * .55 + q[0] * .45, o[1] * .55 + q[1] * .45, r, 0, TAU); c.fill(); }
    c.globalAlpha = 1;
  }
  // grains: jump on the plate, settle on the nodal lines, then fly onto the shell's outlines and fade to sparkle
  const st = ease(seg(t, B.cut2 + .2, B.cut2 + 1.2)), vib = (1 - st) * 7 + 1.2 * (1 - toN), fly = ease(seg(t, B.naut - .1, B.naut + .6)), f = Math.floor(t * 24), ga = 1 - .75 * fillN;
  c.fillStyle = '#FFCF6B'; c.globalAlpha = ga;
  for (let i = 0; i < NG; i++) { const g = GRAIN[i]; if (dz > .3) break;
    let x = lerp(g.sx, g.cx, st) + (hash(i + f * 13.1) - .5) * vib, y = lerp(g.sy, g.cy, st) + (hash(i * 1.3 + f * 7.7) - .5) * vib;
    x = lerp(x, g.nx, fly); y = lerp(y, g.ny, fly); const s = 2.6 + g.k * 1.6; c.fillRect(960 + x - s / 2, 540 + y - s / 2, s, s); }
  c.globalAlpha = 1;
}
// fern: a frond is a centreline whose curvature is a tight log curl beyond the unrolling front
function frond(base, h0, S, front, bend) {
  const N = 150, ds = S / N, pts = []; let [x, y] = base, h = h0;
  for (let i = 0; i <= N; i++) { const s = i * ds; pts.push([x, y, h, s]);
    const u = s - front, k = bend / S + (u > 0 ? Math.min(1 / (.006 * S), Math.exp(u / (.16 * S)) / (.11 * S)) : 0); h += k * ds; x += Math.cos(h) * ds; y += Math.sin(h) * ds; }
  return pts;
}
const FRONDS = [{ b: [960, 1250], h: -Math.PI / 2 - .25, S: 1350, bend: .9, dl: 0, sd: 1 }, { b: [260, 1300], h: -Math.PI / 2 + .2, S: 1200, bend: .7, dl: .25, sd: 2 }, { b: [1720, 1300], h: -Math.PI / 2 - .6, S: 1150, bend: 1.0, dl: .4, sd: 3 }];
function drawFrond(c, F, front, sil) {
  const P = frond(F.b, F.h, F.S, front, F.bend), S = F.S, leaf = mix('#46C25A', '#020604', sil), leaf2 = mix('#A6E35C', '#030805', sil), ink = '#04140A';
  // pinnae (only where unrolled), alternating sides
  for (let j = 0; j < 30; j++) {
    const s = S * (.1 + j * .029), i = Math.round(s / S * 150), un = clamp((front - s) / (.14 * S)); if (un <= .02 || i >= P.length) continue;
    const [px, py, ph] = P[i], sd = j % 2 ? 1 : -1, Lp = .3 * S * Math.pow(Math.sin(Math.PI * s / S), .7) * un;
    let a = ph + sd * (1.05 + (1 - un) * 1.4), x = px, y = py; const n = 9, st = Lp / n;
    c.strokeStyle = ink; c.lineWidth = 4; c.beginPath(); c.moveTo(x, y);
    const rib = [];
    for (let q = 0; q < n; q++) { a += sd * (.04 + (1 - un) * .5); x += Math.cos(a) * st; y += Math.sin(a) * st; rib.push([x, y, a, q]); c.lineTo(x, y); }
    c.stroke();
    for (const [rx, ry, ra, q] of rib) { const ls = st * 1.35 * (1 - q / n * .7);
      for (const ss of [1, -1]) { const la = ra + ss * .95; c.save(); c.translate(rx + Math.cos(la) * ls * .5, ry + Math.sin(la) * ls * .5); c.rotate(la);
        c.beginPath(); c.ellipse(0, 0, ls * .62, ls * .26, 0, 0, TAU); c.fillStyle = q % 2 ? leaf : leaf2; c.fill(); c.strokeStyle = ink; c.lineWidth = 2.4; c.stroke(); c.restore(); } }
  }
  // stem tube + fuzz on the curl
  c.lineCap = 'round'; c.lineJoin = 'round';
  for (const [col, w] of [[ink, 22], [mix('#7FA83A', '#020604', sil), 14]]) { c.strokeStyle = col; c.beginPath(); P.forEach(([x, y, , s], i) => { i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.lineWidth = w; c.stroke(); }
  c.fillStyle = mix('#B9873E', '#0A120A', sil); for (const [x, y, h, s] of P) if (s > front - 20) { const k = hash(s); c.fillRect(x + Math.cos(h + 1.6) * 10 * k - 2, y + Math.sin(h + 1.6) * 10 * k - 2, 4, 4); }
  return P;
}
function wFern(c, t) {
  const sil = sstep(B.aur, B.aur + .8, t), pan = 820 * ease(seg(t, B.aur - .1, B.aur + 1.1));
  bg(c, mix('#06180F', '#01030B', sil), mix('#0C2E1B', '#03140F', sil));
  // aurora above, revealed as the camera tilts up off the ferns
  if (sil > 0) aurora(c, t, sil);
  else radial(c, 960, 500, 900, '#2E7A3A', .35);
  const un = ease(seg(t, B.fern + .1, B.aur - .2));
  // camera: start on the main frond's curl (matches the nautilus eye), pull back to the whole clump
  const P0 = frond(FRONDS[0].b, FRONDS[0].h, FRONDS[0].S, lerp(.38, 1.08, un) * FRONDS[0].S, FRONDS[0].bend), tail = P0.slice(-40), cx0 = tail.reduce((s, p) => s + p[0], 0) / tail.length, cy0 = tail.reduce((s, p) => s + p[1], 0) / tail.length;
  const pb = ease(seg(t, B.fern, B.aur - .3)), z = lerp(3.2, .95, pb);
  cam2(c, lerp(cx0, 960, pb), lerp(cy0, 600, pb) - pan, z, .5 * (1 - pb));
  FRONDS.forEach((F, k) => drawFrond(c, F, lerp(.38, 1.08, ease(seg(t, B.fern + .1 + F.dl, B.aur - .2 + F.dl * .4))) * F.S, sil));
  c.setTransform(1, 0, 0, 1, 0, 0);
}
let AUR = null;
function aurora(c, t, a) {
  if (!AUR) { const cv = document.createElement('canvas'); cv.width = 4; cv.height = 512; const x = cv.getContext('2d'), g = x.createLinearGradient(0, 512, 0, 0);
    g.addColorStop(0, 'rgba(120,255,170,0)'); g.addColorStop(.03, 'rgba(170,255,190,1)'); g.addColorStop(.25, 'rgba(60,240,140,.7)'); g.addColorStop(.6, 'rgba(210,70,220,.45)'); g.addColorStop(1, 'rgba(120,40,200,0)');
    x.fillStyle = g; x.fillRect(0, 0, 4, 512); AUR = cv; }
  c.setTransform(1, 0, 0, 1, 0, 0); stars(c, 21, 300, a, t * 3);
  c.globalCompositeOperation = 'lighter';
  for (let b = 0; b < 4; b++) for (let i = 0; i < 600; i++) {
    const u = i / 600, x = -100 + u * 2120 + Math.sin(u * 7 + t * 1.1 + b * 2) * 90, base = 500 + b * 85 + Math.sin(u * 4.5 + t * 1.4 + b) * 150 + Math.sin(u * 17 + t * 2.3) * 22;
    const h = (320 + 430 * Math.pow(.5 + .5 * Math.sin(u * 23 + b * 4 + t * 1.9), 2)) * (1 - b * .15);
    c.globalAlpha = a * (.2 + .14 * Math.sin(u * 40 + t * 5 + b)); c.drawImage(AUR, x, base - h, 6, h + 24);
  }
  c.globalCompositeOperation = 'source-over'; c.globalAlpha = a;
  // ink ridge with snow, under the curtains' feet
  const rg = []; for (let x = -40; x <= W + 40; x += 30) rg.push([x, 800 - 120 * Math.pow(Math.abs(Math.sin(x * .0042 + 1)), 1.6) - 40 * Math.sin(x * .013) - 14 * Math.sin(x * .05)]);
  inkPoly(c, [...rg, [W + 40, H + 40], [-40, H + 40]], '#04070E', '#000000', 4);
  c.strokeStyle = '#BFE3EC'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); rg.forEach(([x, y], i) => { if (y < 735 && i % 2 === 0) { c.moveTo(x, y + 4); c.lineTo(x + 14, y + 22); } }); c.stroke();
  c.globalAlpha = 1;
}
function wSaturn(c, t) {
  bg(c, '#0A0618', '#1B0E30'); stars(c, 44, 260, .9, t * 2);
  const k = seg(t, B.cut3, B.cut4), z = 1 + .35 * ease(k), Pc = [1120, 600], R = 520, tilt = -.3 + .05 * k;
  cam2(c, 960 + 160 * k, 540 + 40 * k, z, .08 * k);
  const bands = [], r = rng(8); for (let a = 700; a < 1340; a += 9 + r() * 13) bands.push([a, Math.min(1340, a + 9 + r() * 13)]);
  const ringCol = (a, i) => { const u = (a - 700) / 640; if (u > .52 && u < .58) return null; return mix(u < .52 ? '#E9C98C' : '#C99C64', i % 3 ? '#F6E6C2' : '#9E7448', .25 + .5 * hash(i * 3.7)); };
  const ring = (back) => { c.save(); c.translate(Pc[0], Pc[1]); c.rotate(tilt); c.scale(1, .26);
    bands.forEach(([a0, a1], i) => { const col = ringCol(a0, i); if (!col) return; c.strokeStyle = col; c.lineWidth = a1 - a0 + .6; c.beginPath(); c.arc(0, 0, (a0 + a1) / 2, back ? Math.PI : 0, back ? TAU : Math.PI); c.stroke(); });
    c.strokeStyle = '#120D1A'; c.lineWidth = 5; for (const rr of [700, 1033, 1071, 1340]) { c.beginPath(); c.arc(0, 0, rr, back ? Math.PI : 0, back ? TAU : Math.PI); c.stroke(); }
    // orbiting ringlet sparks
    c.fillStyle = '#FFF4D8'; for (let i = 0; i < 260; i++) { const a = hash(i) * TAU + t * (.25 + .1 * hash(i * 2)), rr = 700 + hash(i * 5) * 640; if ((Math.sin(a) < 0) !== back) continue; c.fillRect(Math.cos(a) * rr, Math.sin(a) * rr, 4, 12); }
    c.restore(); };
  ring(true);
  // planet: tilted bands clipped to the disc, terminator, ring shadow, ink limb
  c.save(); c.beginPath(); c.arc(Pc[0], Pc[1], R, 0, TAU); c.clip(); c.translate(Pc[0], Pc[1]); c.rotate(tilt);
  const pb = ['#E8B65E', '#F3DDA6', '#C98A45', '#E9C98C', '#B9733C', '#F0D9A2', '#D9A35A', '#A8653A'];
  for (let y = -R, i = 0; y < R; i++) { const h = 26 + hash(i * 9.1) * 60; c.fillStyle = pb[i % pb.length]; c.fillRect(-R - 10, y, 2 * R + 20, h + 2);
    c.strokeStyle = 'rgba(18,13,26,.35)'; c.lineWidth = 2; c.beginPath(); for (let x = -R; x <= R; x += 30) c.lineTo(x, y + Math.sin(x * .01 + i + t * .3) * 6); c.stroke(); y += h; }
  c.fillStyle = 'rgba(30,14,30,.55)'; c.save(); c.scale(1, .26); c.beginPath(); c.arc(0, -170, 1340, 0, Math.PI); c.arc(0, -170, 700, Math.PI, 0, true); c.fill(); c.restore();
  c.restore();
  const sh = c.createRadialGradient(Pc[0] - 380, Pc[1] - 420, R * .2, Pc[0] - 200, Pc[1] - 200, R * 1.15); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(14,6,28,.85)');
  c.fillStyle = sh; c.beginPath(); c.arc(Pc[0], Pc[1], R, 0, TAU); c.fill(); c.strokeStyle = '#120D1A'; c.lineWidth = 7; c.stroke();
  ring(false);
  // a small moon crossing
  const mx = lerp(260, 620, k), my = 260 - 40 * k; inkPoly(c, ellPts(mx, my, 46, 46, 30), '#D8CFC2', '#120D1A', 4); c.fillStyle = 'rgba(20,10,30,.45)'; c.beginPath(); c.arc(mx + 14, my + 10, 42, 0, TAU); c.fill();
  c.setTransform(1, 0, 0, 1, 0, 0);
}
// whale song spectrogram: harmonics of a sweeping fundamental, scrolling, a humpback swims across in ink
const SPW = 160, SPH = 90; let SPC = null;
const MAGMA = ['#07061C', '#1B0C41', '#4A0C6B', '#781C6D', '#A52C60', '#CF4446', '#ED6925', '#FB9B06', '#F7D13D', '#FCFFA4'];
const magma = v => { v = clamp(v) * (MAGMA.length - 1); const i = Math.floor(v); return mix(MAGMA[i], MAGMA[Math.min(i + 1, MAGMA.length - 1)], v - i); };
function specVal(tau, y) {   // y 0 (low) .. 1 (high)
  const ph = Math.floor(tau / 2.2), u = tau / 2.2 - ph, on = Math.pow(Math.sin(Math.PI * clamp(u / .8)), .6) * (u < .8 ? 1 : 0);
  const f = .07 + .045 * hash(ph * 3.3) + .05 * Math.sin(u * Math.PI * (1 + hash(ph))) * (hash(ph * 7) > .5 ? 1 : -1) + .03 * u;
  let v = .06 * hash(Math.floor(tau * 30) * 7.1 + Math.floor(y * 90) * 3.3);
  for (let k = 1; k <= 7; k++) { const d = (y - k * f) / (.008 + .002 * k); v += on * Math.exp(-d * d) * (1.05 - k * .11); }
  return v;
}
function wWhale(c, t) {
  if (!SPC) { SPC = document.createElement('canvas'); SPC.width = SPW; SPC.height = SPH; }
  const sx = SPC.getContext('2d'), id = sx.createImageData(SPW, SPH), d = id.data, tf = seg(t, B.city, B.city + .6);
  for (let i = 0; i < SPW; i++) for (let j = 0; j < SPH; j++) {
    const v = specVal(i * .045 + (t - B.cut4) * 1.6, 1 - j / SPH), col = magma(v), n = parseInt(col.slice(1), 16), o = (j * SPW + i) * 4;
    d[o] = n >> 16; d[o + 1] = n >> 8 & 255; d[o + 2] = n & 255; d[o + 3] = 255;
  }
  sx.putImageData(id, 0, 0);
  c.setTransform(1, 0, 0, 1, 0, 0); c.imageSmoothingEnabled = false; c.drawImage(SPC, 0, 0, W, H); c.imageSmoothingEnabled = true;
  c.strokeStyle = '#07061C'; c.lineWidth = 3; c.beginPath(); for (let x = 0; x <= W; x += 12) { c.moveTo(x, 0); c.lineTo(x, H); } for (let y = 0; y <= H; y += 12) { c.moveTo(0, y); c.lineTo(W, y); } c.stroke();
  // the whale
  const k = seg(t, B.cut4 - .2, B.city + .4), wx = lerp(1700, 420, k), wy = 560 + Math.sin(t * 1.6) * 30, beat = Math.sin(t * 4.5) * .3, s = 1.45;
  c.save(); c.translate(wx, wy); c.scale(s, s); c.rotate(-.05 + Math.sin(t * 1.6 + 1) * .04);
  const body = [[-470, -10], [-430, -70], [-330, -105], [-160, -112], [20, -98], [170, -72], [300, -40], [380, -18]];
  const tail = (a) => [[380, -18], [420, -6 + a * 60], [470, -60 + a * 80], [455, 0 + a * 60], [480, 50 + a * 70], [420, 16 + a * 60], [380, 22]];
  const belly = [[380, 22], [300, 40], [150, 70], [-80, 92], [-300, 80], [-430, 50], [-475, 15]];
  inkPoly(c, [...body, ...tail(beat), ...belly], '#1C2034', '#05040C', 6);
  inkPoly(c, [[-430, 50], [-300, 78], [-80, 90], [100, 70], [-60, 60], [-260, 52]], '#E9E1D2', '#05040C', 3);
  c.strokeStyle = '#05040C'; c.lineWidth = 2.5; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(-430 + i * 12, 30 + i * 3); c.lineTo(-300 + i * 30, 50 + i * 4); c.stroke(); }
  const fa = Math.sin(t * 2.2) * .15; c.save(); c.translate(-250, 60); c.rotate(.55 + fa); inkPoly(c, [[0, -10], [120, 0], [300, 30], [330, 48], [290, 50], [110, 26], [-10, 18]], '#E9E1D2', '#05040C', 5); c.restore();
  c.fillStyle = '#05040C'; c.beginPath(); c.arc(-370, -20, 9, 0, TAU); c.fill();
  c.fillStyle = '#9AA0B8'; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(-430 + i * 9 + hash(i) * 8, -65 + hash(i * 3) * 20, 5, 0, TAU); c.fill(); }
  c.restore();
  if (tf > 0) { c.fillStyle = '#020511'; c.globalAlpha = ease(tf); c.fillRect(0, 0, W, H); c.globalAlpha = 1; }
}
// night Earth: circle of radius RE; cities = road trees with lights; the camera starts at the limb and pulls back to the disc
const RE = 4600, EC = [960, 540 + RE - 260];
const CITY = (() => {
  const r = rng(77), pts = [], roads = [];
  const city = (x, y, n, len, br) => { pts.push([x, y, 5, 1]);
    const go = (x, y, a, l, d) => { const n2 = Math.max(2, Math.floor(l / 14)); for (let i = 0; i < n2; i++) { a += (r() - .5) * .25; const nx = x + Math.cos(a) * 14, ny = y + Math.sin(a) * 14; roads.push([x, y, nx, ny, d]);
        if (r() < .9 / (1 + d * .6)) pts.push([nx, ny, 2.4 - d * .4 + r(), Math.max(.15, 1 - d * .25 - Math.hypot(nx - x, ny - y) / 400)]); x = nx; y = ny; }
      if (d < br) for (let k = 0; k < 2; k++) go(x, y, a + (k ? 1 : -1) * (.9 + r() * .7), l * .65, d + 1); };
    for (let i = 0; i < n; i++) go(x, y, i / n * TAU + r(), len, 0);
    for (let i = 0; i < len * n * .6; i++) { const a = r() * TAU, rr = Math.pow(r(), 1.6) * len * 1.2; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * .8, 1.6 + r(), .5 + r() * .5]); } };
  city(960, 520, 8, 260, 3); city(560, 470, 6, 150, 2); city(1430, 600, 6, 170, 2); city(1180, 380, 4, 90, 2); city(300, 640, 4, 110, 2); city(1720, 470, 4, 100, 2);
  for (let i = 0; i < 260; i++) { const a = r() * TAU, rr = Math.sqrt(r()) * RE * .97; city(EC[0] + Math.cos(a) * rr, EC[1] + Math.sin(a) * rr, 2 + Math.floor(r() * 3), 60 + r() * 220, 1); }
  return { pts, roads };
})();
function wCity(c, t) {
  const k = seg(t, B.back, B.close), zo = Math.exp(lerp(0, Math.log(540 / RE), ease(k))), cy = lerp(540, EC[1], ease(k)), drift = 60 * seg(t, B.city, B.close);
  c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#020511'; c.fillRect(0, 0, W, H); stars(c, 55, 240, .8, t);
  cam2(c, 960 + drift * (1 - k), cy, zo, .06 * (1 - k));
  const iz = 1 / zo;
  radial(c, EC[0], EC[1], RE * 1.06, '#3FA9FF', .55);
  c.beginPath(); c.arc(EC[0], EC[1], RE, 0, TAU); c.fillStyle = '#071430'; c.fill();
  // land masses
  c.save(); c.clip(); const r = rng(4); c.fillStyle = '#0E1F3E'; c.strokeStyle = '#1F4A78'; c.lineWidth = 3 * iz;
  for (let i = 0; i < 14; i++) { const a = r() * TAU, rr = Math.sqrt(r()) * RE, x = i === 0 ? 960 : EC[0] + Math.cos(a) * rr, y = i === 0 ? 560 : EC[1] + Math.sin(a) * rr, s = i === 0 ? 1300 : 500 + r() * 1300;
    const p = []; for (let q = 0; q < 40; q++) { const qa = q / 40 * TAU, qr = s * (.7 + .25 * Math.sin(qa * 3 + i) + .12 * Math.sin(qa * 7 + i * 2)); p.push([x + Math.cos(qa) * qr, y + Math.sin(qa) * qr * .7]); }
    inkPoly(c, p, '#0E1F3E', '#2A5A8A', 3 * iz); }
  // roads + lights
  c.strokeStyle = 'rgba(255,170,70,.35)'; c.lineWidth = Math.max(1.2, 2 * iz) * (1 - .5 * k); c.beginPath(); for (const [x1, y1, x2, y2] of CITY.roads) { c.moveTo(x1, y1); c.lineTo(x2, y2); } c.stroke();
  const sp = sprite('#FFC35A'), ap = seg(t, B.city + .2, B.city + .9);
  c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < CITY.pts.length; i++) { const [x, y, s, b] = CITY.pts[i]; const S = Math.max(s * 6, 3 * iz * (.4 + .6 * b)) * (.6 + .4 * ap); c.globalAlpha = b * ap * (.8 + .2 * Math.sin(t * 6 + i)); c.drawImage(sp, x - S / 2, y - S / 2, S, S); }
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  // moonlit cloud wisps
  c.fillStyle = 'rgba(150,170,210,.07)'; const rc = rng(9); for (let i = 0; i < 40; i++) { const a = rc() * TAU, rr = Math.sqrt(rc()) * RE; c.beginPath(); c.ellipse(EC[0] + Math.cos(a) * rr + t * 8, EC[1] + Math.sin(a) * rr, 300 + rc() * 500, 50 + rc() * 80, rc() - .5, 0, TAU); c.fill(); }
  c.restore();
  c.beginPath(); c.arc(EC[0], EC[1], RE, 0, TAU); c.strokeStyle = '#8FE0FF'; c.lineWidth = 10 * iz; c.stroke(); c.strokeStyle = '#05091A'; c.lineWidth = 4 * iz; c.beginPath(); c.arc(EC[0], EC[1], RE + 9 * iz, 0, TAU); c.stroke();
  // spectrogram embers drifting down into the cities (the morph from the whale song)
  const m = seg(t, B.city, B.city + 1);
  if (m < 1) { c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 900; i++) { const j = Math.floor(hash(i * 1.7) * CITY.pts.length * .25), [tx, ty] = CITY.pts[j], sx0 = hash(i * 3.1) * W, sy0 = (1 - (.07 + .05 * hash(i)) * (1 + (i % 7))) * H;
      const e = ease(m * (1 + hash(i * 5))), x = lerp(sx0, (tx - 960 - drift) * zo + 960, e), y = lerp(sy0, (ty - cy) * zo + 540, e); c.globalAlpha = 1 - m; c.drawImage(sp, x - 12, y - 12, 24, 24); }
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; }
  c.setTransform(1, 0, 0, 1, 0, 0);
}
function wonderAt(c, t) {
  c.save();
  if (t < B.cut1) wSnowLich(c, t);
  else if (t < B.cut2) wMycel(c, t);
  else if (t < B.fern + .25) wPlateNaut(c, t);
  else if (t < B.cut3) wFern(c, t);
  else if (t < B.cut4) wSaturn(c, t);
  else if (t < B.city + .55) wWhale(c, t);
  else wCity(c, Math.min(t, B.close));
  // cross-dissolves inside the morphs: nautilus eye → fern curl
  if (t >= B.fern && t < B.fern + .25) { const a = ease(seg(t, B.fern, B.fern + .22)); c.save(); c.globalAlpha = a; wFern(c, t); c.restore(); }
  if (t >= B.city && t < B.city + .55) { const a = ease(seg(t, B.city, B.city + .55)); c.save(); c.globalAlpha = a; wCity(c, t); c.restore(); }
  c.restore();
  // paper fibre over the night scenes, so pigment sits on the same sheet as Clawd
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = .35; c.drawImage(paperG.canvas || paperG.elt, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
}

// ---------- paper world: Clawd ----------
const GY = 800, U = 26, CX = 860;            // ground line, Clawd unit, where he stops
const BUB = [1215, 300], BR = 150, FULL = Math.hypot(W / 2, H / 2);
let WG = null, OV = null, UL = null;
function clawdX(t) { return lerp(2150, CX, easeOut(seg(t, B.walk0, B.walk1) * 1.02) ); }
// the snowflake that calls him (falls, lands on his head), drawn in 2D on the overlay
function flake(c, x, y, s, rot, a = 1) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.globalAlpha = a; c.lineCap = 'round';
  for (const [col, w] of [['#2B2233', 7], ['#CDEFFF', 3.5]]) { c.strokeStyle = col; c.lineWidth = w; c.beginPath();
    for (let k = 0; k < 6; k++) { const A = k * Math.PI / 3, ca = Math.cos(A), sa = Math.sin(A), L = (x2, y2) => [x2 * ca - y2 * sa, x2 * sa + y2 * ca];
      const p = (q, r2) => { const [a1, b1] = L(...q), [a2, b2] = L(...r2); c.moveTo(a1, b1); c.lineTo(a2, b2); };
      p([0, 0], [20, 0]); p([10, 0], [16, 6]); p([10, 0], [16, -6]); }
    c.stroke(); }
  c.restore();
}
function flakePos(t) {
  const hx = clawdX(t), land = [hx - .5 * U, GY - 8 * U - 6];
  if (t >= B.land) return [...land, .9, 0];
  const k = seg(t, 0, B.land), x = lerp(1240, land[0], ease(k)) + Math.sin(t * 2.3) * 70 * (1 - k), y = lerp(-40, land[1], k);
  return [x, y, .9 + 1.2 * (1 - k), t * 1.4];
}
function flushBrush() { brush.noStroke(); brush.noHatch(); brush.noWash(); brush.fill('#000000', 1); brush.fillBleed(0); brush.fillTexture(0, 0); brush.polygon([[-50, -50], [-40, -50], [-40, -40]]); brush.noFill(); }
// Clawd with a fixed seed: one model, no boil
function steadyClawd(x, y, u, o) { randomSeed(4242); clawd(x, y, u, o); }

function paperScene(t) {
  // camera: dive into the bubble (in) or back out of it (out)
  let z = 1, cx = W / 2, cy = H / 2;
  if (t > B.zoom0 && t < B.pop) {
    const kin = easeIn(seg(t, B.zoom0, B.open)), kout = 1 - easeOut(seg(t, B.close, B.pop)), k = t < B.close ? kin : kout, zf = (t < B.close ? FULL : H / 2) / BR;
    z = Math.exp(Math.log(zf) * k); cx = lerp(W / 2, BUB[0], Math.min(1, k * 1.6)); cy = lerp(H / 2, BUB[1], Math.min(1, k * 1.6));
  }
  const toS = (px, py) => [(px - cx) * z + W / 2, (py - cy) * z + H / 2];
  { const u = UL.drawingContext; u.setTransform(1, 0, 0, 1, 0, 0); u.clearRect(0, 0, W, H); u.strokeStyle = '#8C8274'; u.lineWidth = Math.max(1.4, 1.4 * z); u.lineCap = 'round'; u.beginPath();
    for (let gx = -900; gx <= W + 900; gx += 40) { const [a, b2] = toS(gx, GY + Math.sin(gx * .013) * .9 + Math.sin(gx * .071) * .5); gx === -900 ? u.moveTo(a, b2) : u.lineTo(a, b2); } u.stroke(); image(UL, 0, 0, W, H); }
  camBegin(cx, cy, z);
  const x = clawdX(t), walking = t > B.walk0 && t < B.walk1 - .1, hap = t > B.pop + .15;
  const hop = hap ? Math.max(0, Math.sin(seg(t, B.pop + .5, B.pop + 2.7) * Math.PI * 3)) : 0;
  const o = { flip: walking, walk: walking ? (2150 - x) / 95 : null, dy: walking ? -Math.abs(Math.sin((2150 - x) / 95 * Math.PI)) * .25 : -hop * 1.6,
    aL: hap ? .2 + .6 * ease(seg(t, B.pop + .1, B.pop + .4)) : .15, aR: hap ? .2 + .6 * ease(seg(t, B.pop + .1, B.pop + .4)) : .15 };
  if (t > B.walk1 - .1 && t < B.pop) { o.eyes = 'look'; o.lookX = t < B.land ? .6 : 1; o.lookY = -1; }
  if (hap) { o.eyes = 'happy'; o.mouth = 'smile'; }
  if (t > B.land && t < B.land + .25) o.sq = .08 * Math.sin(seg(t, B.land, B.land + .25) * Math.PI);
  steadyClawd(x, GY, U, o);
  // thought dots (brush ink, fixed seed)
  if (t > B.think && t < B.pop) { randomSeed(99);
    [[CX + 6.2 * U, GY - 9.4 * U, 12, B.think], [CX + 8.6 * U, GY - 11.6 * U, 22, B.think + .15]].forEach(([bx, by, r, t0]) => { const k = backOut(seg(t, t0, t0 + .3)); if (k > .02) paint(ellPts(bx, by, r * k, r * k, 16), { wash: '#FFF9EE', ink: PAL.ink, sw: .9 }); }); }
  camEnd(); flushBrush();
  // overlay (2D, screen space): bubble with the wonder inside, the snowflake, confetti
  const c = OV.drawingContext; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
  if (t > B.bub && t < B.pop + .3) {
    const grow = t < B.close ? backOut(seg(t, B.bub, B.bub + .45)) : 1, popk = seg(t, B.pop, B.pop + .25), [sx, sy] = toS(...BUB), sr = BR * z * grow * (1 + .25 * popk);
    if (popk < 1) {
      wonderAt(WG.drawingContext, t < B.close ? t : B.close);
      c.save(); c.beginPath(); c.arc(sx, sy, sr, 0, TAU); c.clip(); const s = Math.min(1, sr / (H / 2)); c.globalAlpha = 1 - popk;
      c.drawImage(WG.canvas || WG.elt, sx - W / 2 * s, sy - H / 2 * s, W * s, H * s); c.restore();
      c.strokeStyle = '#2B2233'; c.globalAlpha = 1 - popk; c.lineWidth = Math.max(3, 4.5 * z * .5);
      const rr = rng(3); c.beginPath(); for (let i = 0; i <= 64; i++) { const a = i / 64 * TAU, w = 1 + (i % 64 ? (rr() - .5) * .012 : 0); c.lineTo(sx + Math.cos(a) * sr * w, sy + Math.sin(a) * sr * w); } c.stroke(); c.globalAlpha = 1;
    }
    if (popk > 0) { c.strokeStyle = '#2B2233'; c.lineWidth = 4; c.lineCap = 'round'; const e = easeOut(seg(t, B.pop, B.pop + .35)), fa = 1 - seg(t, B.pop + .2, B.pop + .4);
      c.globalAlpha = fa; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + .2; c.beginPath(); c.moveTo(sx + Math.cos(a) * sr * (1 + e * .15), sy + Math.sin(a) * sr * (1 + e * .15)); c.lineTo(sx + Math.cos(a) * sr * (1.15 + e * .5), sy + Math.sin(a) * sr * (1.15 + e * .5)); c.stroke(); } c.globalAlpha = 1; }
  }
  // the snowflake: falling, then riding on his head (hidden while we're inside the bubble at full zoom)
  if (z < 6) { const fp = t < B.pop ? flakePos(Math.min(t, B.zoom0 + 1)) : [x - .5 * U, GY - 8 * U - 6 - hop * 1.6 * U, .9, 0];
    const [fx, fy] = toS(fp[0], fp[1]); flake(c, fx, fy, fp[2] * z, fp[3] + (t > B.pop ? Math.sin(t * 3) * .2 : 0)); }
  if (t > B.pop) confetti(c, t - B.pop);
  image(OV, 0, 0, W, H);
}
// wonders in miniature raining down after the pop
function confetti(c, a) {
  const kinds = ['flake', 'cap', 'shell', 'planet', 'tail', 'curl', 'bolt'], r = rng(17);
  for (let i = 0; i < 26; i++) {
    const kd = kinds[i % kinds.length], x0 = BUB[0] + (r() - .5) * 300, vx = (r() - .5) * 900, vy = -500 - r() * 500, g = 700, sp = (r() - .5) * 4, s = 1.4 + r() * .8;
    const x = x0 + vx * a * (1 - a * .12), y = BUB[1] + vy * a + g * a * a * .5; if (y > H + 80) continue;
    const k = backOut(clamp(a * 4)); c.save(); c.translate(x, y); c.rotate(sp * a); c.scale(s * k, s * k); icon(c, kd); c.restore();
  }
}
function icon(c, kd) {
  const ink = '#2B2233'; c.lineJoin = 'round'; c.lineCap = 'round';
  if (kd === 'flake') return flake(c, 0, 0, 1.1, 0);
  if (kd === 'cap') { inkPoly(c, [[-8, 0], [-6, 26], [6, 26], [8, 0]], '#F3E3C4', ink, 3); c.beginPath(); c.moveTo(-30, 2); c.quadraticCurveTo(0, -40, 30, 2); c.closePath(); c.fillStyle = '#E9573F'; c.fill(); c.strokeStyle = ink; c.lineWidth = 3.5; c.stroke(); return; }
  if (kd === 'shell') { c.beginPath(); for (let i = 0; i <= 60; i++) { const th = i / 60 * 3 * TAU, rr = 1.6 * Math.exp(.175 * th); c.lineTo(Math.cos(th) * rr * .9, Math.sin(th) * rr * .9); } c.strokeStyle = ink; c.lineWidth = 7; c.stroke(); c.strokeStyle = '#F4E2C6'; c.lineWidth = 3.5; c.stroke(); return; }
  if (kd === 'planet') { c.beginPath(); c.arc(0, 0, 18, 0, TAU); c.fillStyle = '#E8B65E'; c.fill(); c.strokeStyle = ink; c.lineWidth = 3.5; c.stroke(); c.save(); c.rotate(-.35); c.scale(1, .3); c.beginPath(); c.arc(0, 0, 36, 0, TAU); c.lineWidth = 7; c.stroke(); c.strokeStyle = '#F6E6C2'; c.lineWidth = 4; c.stroke(); c.restore(); return; }
  if (kd === 'tail') return inkPoly(c, [[0, 20], [-4, 0], [-30, -14], [-8, -8], [0, -14], [8, -8], [30, -14], [4, 0]], '#3B4466', ink, 3.5);
  if (kd === 'curl') { c.beginPath(); for (let i = 0; i <= 50; i++) { const th = i / 50 * 2.5 * TAU, rr = 26 * Math.exp(-.2 * th); c.lineTo(Math.cos(th) * rr, Math.sin(th) * rr); } c.strokeStyle = ink; c.lineWidth = 8; c.stroke(); c.strokeStyle = '#6FC24A'; c.lineWidth = 4.5; c.stroke(); return; }
  if (kd === 'bolt') return inkPoly(c, [[-6, -30], [12, -30], [2, -6], [14, -6], [-10, 30], [-2, 4], [-14, 4]], '#FFD84A', ink, 3.5);
}

function drawWorld(t) {
  if (!WG) { WG = createGraphics(W, H); WG.pixelDensity(1); OV = createGraphics(W, H); OV.pixelDensity(1); UL = createGraphics(W, H); UL.pixelDensity(1); }
  if (t >= B.open && t < B.close) { wonderAt(WG.drawingContext, t); image(WG, 0, 0, W, H); }
  else paperScene(t);
}
