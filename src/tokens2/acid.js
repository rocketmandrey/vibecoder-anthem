// tokens2/acid.js: the v2 layer for «Жги токены» v2 (acid / industrial cut): ЗАВОД ТОКЕНОВ, the token factory.
// Loaded after tokens/kit.js (reuse token, fire, smoke, gpuCard, ceoClawd, agentBot, stamp, punkText, ruFont, TK ...).
// Re-themes the karaoke bar to hazard-yellow on gunmetal. No brush wipes in v2 (SONG.wipes = []): cuts are glitchCut().
// Every function is a pure function of its arguments and t. Rect-like props take a TOP-LEFT (x, y); round ones a centre.
// Russian text: RU_FONT via ruFont(size).
//
//   A2                                   palette: gunmetal, gunDk, steel, steelLt, hazard, rust, sodium, acid, magenta, uv,
//                                        matrix, matrixBg, cream (zine paper)
//   HITS                                 [[t, strength], ...] strong audio transients from assets/tokens2/hits.txt
//                                        (strength = x local median; > 10 is a big slam, the edits/impacts are 15–45).
//   hitsIn(a, b, minS)                   → hit times in [a, b) with strength >= minS (0), ready for press().
//   hitK(t, list, decay)                 → 0..1 envelope of the most recent hit <= t: exp(-age / decay). list = HITS or times,
//                                        decay .18 s.
//   press(x, y, w, h, t, hits, o)        hydraulic press, top-left (x, y), w x h. The ram slams on each time in `hits`
//                                        (falls in the last .1 s, holds, rises over .4 s), mints a hot token on the bed that
//                                        cools, sparks + a steam burst on impact. o.label (crossbeam text, e.g. 'ПРЕСС 3'),
//                                        o.token false (nothing minted) | fn(cx, bedY, r, age) custom minted item,
//                                        o.steam false, o.seed. Returns { k, age, ramY } (k = impact envelope, for shake).
//   conveyor(x, y, w, t, o)              belt whose TOP surface is at y, from x to x + w, rollers + legs below. o.items
//                                        ['token'] cycled: 'token' | 'agent' | 'gpu' | 'task' | fn(x, y, i); o.speed px/s (140,
//                                        < 0 runs left), o.gap item spacing (200), o.h belt (38), o.legs px (160, 0 = none),
//                                        o.seed, o.size item scale (1).
//   gear(x, y, r, t, o)                  toothed gear centred at (x, y). o.speed turns/s (.2, negative = ccw), o.rot extra
//                                        angle, o.n teeth (auto), o.col, o.hole (hub colour).
//   hazard(x, y, w, h)                   black / hazard-yellow diagonal stripes clipped to the rect.
//   siren(x, y, t, o)                    rotating beacon standing on (x, y): dome + two light beams sweeping side to side.
//                                        o.col (sodium), o.speed turns/s (1.2), o.len beam px (520), o.on 0..1, o.r dome (34).
//   steam(x, y, t, o)                    a steam jet from (x, y). o.dir angle (-PI/2 = up), o.len px (260), o.k 0..1 strength,
//                                        o.n puffs (6), o.per s (.9), o.seed, o.col.
//   acidField(t, o)                      full-frame acid rave: UV sky with wobbling squelch bands over a scrolling acid-green /
//                                        magenta perspective checkerboard. o.k intensity 0..1+ (wobble, strobe), o.hy horizon
//                                        (430), o.speed rows/s (1.6), o.cols [a, b] checker, o.sq extra bend (e.g. squelch()).
//   acidSmiley(x, y, r, t, o)            the token as an acid smiley (gold chip rim, yellow face, grin). o.melt 0..1 (drips,
//                                        eyes sag), o.col face, o.rot, o.glow 0..1, o.eyes 'x' (dead) | default.
//   squelch(t, t0, t1)                   → 0..1 filter-sweep wobble inside [t0, t1] (0 outside), LFO accelerates across it.
//   matrixRain(t, o)                     green ₮ / 0 / 1 / digit code rain as lettering (drawn on top of paint; flushLetters()
//                                        to layer). o.k density 0..1 (.5), o.area [x, y, w, h], o.size glyph px (34), o.bg
//                                        true = paint the matrixBg wash first, o.seed, o.speed (1).
//   glitchCut(t, tCut, o)                call last in a frame (screen space, no camera): RGB-split slices, flat colour bars and
//                                        scanlines for ±o.span (.1 s) around tCut; flushes letters first so text glitches too.
//                                        o.cols, o.n slices (9), o.k strength (1).
//   KHAT.shades                          black Matrix sunglasses: ceoClawd(x, y, u, { hat: 'shades' }).
//   zineCut(x, y, w, h, o)               torn xerox paper panel: drop shadow, torn edges, halftone corner, tape.
//                                        o.rot, o.col paper, o.seed, o.tape false, o.dots false, o.shadow false.
//                                        Returns the inner [x, y, w, h] (unrotated) to draw content in.

// ---------- theme ----------
const A2 = {
  gunmetal: '#2B2F36', gunDk: '#1C1F24', steel: '#59636E', steelLt: '#8A95A1', hazard: '#FFD21F', rust: '#B4502A',
  sodium: '#FF8A1F', acid: '#B6FF1A', magenta: '#FF2BD6', uv: '#6A2BFF', matrix: '#00FF6A', matrixBg: '#020A04', cream: '#F1E8D2'
};
Object.assign(KP, {
  night: A2.gunmetal, ruby: A2.rust, rubyDk: '#6E2E18', rubyLt: A2.sodium, gold: A2.hazard, goldLt: A2.hazard, goldDk: '#A88A10'
});
for (const k of Object.keys(HAT_SWAP)) delete HAT_SWAP[k];

// ---------- audio hits ----------
const HITS = [
  [0.2,39.6],[0.86,7.3],[1.66,4.5],[2.93,5.0],[4.86,9.5],[5.51,8.1],[6.15,6.2],[10.99,4.8],[16.92,4.7],[20.65,6.1],[21.29,6.2],[21.77,6.4],
  [22.27,5.1],[23.23,4.6],[24.18,5.6],[25.32,6.4],[25.8,4.8],[26.27,6.7],[31.58,7.3],[32.22,5.0],[33.49,4.9],[36.7,7.0],[38.32,5.7],[38.96,5.3],
  [41.82,22.8],[42.47,19.8],[42.95,9.4],[43.76,4.9],[44.56,5.4],[53.65,6.0],[62.25,4.8],[63.53,4.8],[64.8,4.9],[66.87,4.8],[67.35,5.0],[68.79,5.1],
  [69.43,5.1],[71.18,5.4],[72.78,4.9],[73.89,4.6],[74.36,7.5],[77.87,7.5],[78.83,4.6],[81.7,4.6],[83.93,4.5],[85.21,5.2],[85.84,5.3],[88.7,4.7],
  [89.33,5.0],[89.97,4.6],[92.09,6.1],[92.82,4.7],[95.7,7.9],[96.82,5.6],[99.36,5.3],[100.79,7.7],[104.92,4.8],[111.61,5.3],[114.15,5.2],[114.79,5.3],
  [115.26,5.1],[115.74,5.3],[116.22,5.9],[116.7,5.0],[117.69,5.4],[118.26,16.7],[119.08,11.3],[119.87,13.4],[121.02,12.6],[122.47,10.3],[123.14,8.0],[123.81,8.6],
  [125.48,8.2],[126.34,7.9],[127.8,4.5],[132.4,5.1],[133.06,4.6],[133.72,4.5],[134.36,7.3],[142.07,4.5],[143.03,4.9],[144.96,4.8],[146.09,10.2],[147.85,4.7],
  [148.82,8.9],[149.78,4.8],[150.89,8.2],[152.35,4.9],[153.62,6.1],[154.91,4.7],[155.55,5.5],[156.4,5.5],[157.47,11.5],[159.08,4.8],[160.68,4.7],[162.6,4.9],
  [167.73,4.7],[170.63,4.9],[171.58,4.8],[172.86,6.2],[174.15,4.7],[175.1,4.8],[175.75,6.2],[183.1,6.0],[183.76,7.4],[184.73,9.5],[185.3,5.3],[186.12,15.0],
  [186.78,11.4],[188.1,9.8],[191.52,5.4],[192.01,5.6],[192.55,15.2],[193.19,13.6],[193.77,39.8],[194.34,15.5],[194.97,20.6],[195.62,19.6],[196.28,19.5],[196.94,20.7],
  [197.6,21.2],[198.26,21.6],[199.27,9.5],[199.94,18.1],[200.6,11.6],[201.38,8.5],[201.94,8.4],[202.61,16.4],[203.28,17.8],[204.12,10.0],[204.93,31.1],[205.78,14.7],
  [206.27,7.5],[207.23,6.6],[215.86,4.5],[216.53,5.5],[217.35,4.9],[218.56,6.4],[219.18,28.1],[219.66,7.8],[220.24,6.6],[220.89,11.0],[221.62,5.9],[222.11,16.7],
  [223.18,45.2],[223.68,14.0],[224.18,13.4],[224.84,10.9],[225.37,6.7],[226.51,5.5],[227.17,9.6],[227.83,5.8],[228.5,7.1],[229.15,6.4],[229.81,5.4],[230.31,5.7],
  [230.81,5.6],[231.79,7.2],[232.45,5.4],[233.12,6.5],[233.78,5.4],[234.43,7.1],[235.09,5.5],[235.75,5.1],[236.41,6.7],[237.06,18.7],[237.73,9.6],[238.59,20.7]
];
const hitT = h => Array.isArray(h) ? h[0] : h;
const hitsIn = (a, b, minS = 0) => HITS.filter(h => h[0] >= a && h[0] < b && h[1] >= minS).map(h => h[0]);
// ponytail: linear scans over ~170 hits, a few µs per call
function hitK(t, list = HITS, decay = .18) {
  let last = -1e9; for (const h of list) { const ht = hitT(h); if (ht <= t && ht > last) last = ht; }
  return Math.exp(-(t - last) / decay);
}

// ---------- small helpers ----------
// Sutherland–Hodgman clip of a polygon to an axis-aligned rect
function clipRect(pts, x0, y0, x1, y1) {
  const edges = [[p => p[0] >= x0, (a, b) => [x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0])]],
                 [p => p[0] <= x1, (a, b) => [x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0])]],
                 [p => p[1] >= y0, (a, b) => [a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0]],
                 [p => p[1] <= y1, (a, b) => [a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1]]];
  for (const [inside, cut] of edges) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], ia = inside(a), ib = inside(b);
      if (ia) out.push(a); if (ia !== ib) out.push(cut(a, b));
    }
    pts = out; if (pts.length < 3) return [];
  }
  return pts;
}
const polyArea = pts => { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; };

// ---------- industrial ----------
function hazard(x, y, w, h) {
  if (w < 4 || h < 4) return;
  paint(rectPts(x, y, w, h), { wash: A2.hazard, ink: null });
  const s = Math.max(14, Math.min(w, h) * .9);                 // stripe pitch
  for (let sx = x - h - s; sx < x + w + s; sx += s) {
    const q = clipRect([[sx, y + h], [sx + s * .5, y + h], [sx + s * .5 + h, y], [sx + h, y]], x, y, x + w, y + h);
    if (q.length >= 3 && polyArea(q) > 20) paint(q, { wash: A2.gunDk, ink: null });
  }
  paint(rectPts(x, y, w, h), { ink: PAL.ink, sw: clamp(h / 60, .4, .9) });
}

function steam(x, y, t, o = {}) {
  const k = o.k ?? 1; if (k < .03) return;
  const n = o.n || 6, L = (o.len || 260) * k, per = o.per || .9, seed = o.seed || 0, dir = o.dir ?? -Math.PI / 2, col = o.col || '#E8ECEF';
  const ux = Math.cos(dir), uy = Math.sin(dir);
  for (let i = 0; i < n; i++) {
    const p = frac(t / per + i / n + hash(i + seed) * .2), d = L * p, side = (hash(i * 3 + seed) - .5) * L * .35 * p + Math.sin(t * 5 + i) * 10 * p;
    const r = (10 + L * .16 * p) * (.7 + hash(i + seed + 5) * .5), px = x + ux * d - uy * side, py = y + uy * d + ux * side;
    paint(ellPts(px, py, r, r * .8, 12, r * .07), { fill: col, fillOp: 200 * (1 - p) * Math.min(1, p * 5) * clamp(k), bleed: .25, tex: .3, border: .4, ink: null });
  }
}

function sparks(x, y, age, seed, n = 12, R = 160) {
  if (age < 0 || age > .35) return;
  const p = age / .35;
  for (let i = 0; i < n; i++) {
    const a = Math.PI + hash(i + seed) * Math.PI, sp = .5 + hash(i + seed + 7) * .7, d = R * sp * easeOut(p);
    const x1 = x + Math.cos(a) * d, y1 = y + Math.sin(a) * d * .8 + p * p * R * .6, len = 18 * (1 - p) + 4;
    inkLine([[x1, y1], [x1 - Math.cos(a) * len * 1.8, y1 - Math.sin(a) * len * 1.4]], 2 * (1 - p) + .5, i % 3 ? A2.hazard : A2.sodium, 'inkfine', 0);
  }
}

function press(x, y, w, h, t, hits = [], o = {}) {
  let last = -1e9, next = 1e9;
  for (const hh of hits) { const ht = hitT(hh); if (ht <= t && ht > last) last = ht; if (ht > t && ht < next) next = ht; }
  const age = t - last, fall = .1, down = next - t < fall ? easeIn(1 - (next - t) / fall) : 0, up = age < .06 ? 1 : 1 - ease((age - .06) / .4);
  const s = Math.max(down, up), k = Math.exp(-age / .12), sw = clamp(w / 320, .5, 1.3), seed = o.seed || 0;
  const colW = w * .13, beamH = h * .17, bedH = h * .12, bedY = y + h - bedH, strokeY = bedY - (y + beamH) - h * .26;
  const ramH = h * .2, ramY = y + beamH + h * .06 + s * strokeY, ramX = x + colW * 1.1, ramW = w - colW * 2.2;
  // columns + base
  for (const cx of [x, x + w - colW]) paint(rectPts(cx, y + beamH * .5, colW, h - beamH * .5, 1), { wash: A2.steel, fill: A2.gunmetal, fillOp: 90, tex: .5, border: .4, ink: PAL.ink, sw });
  hazard(x - w * .04, y + h - bedH * .45, w * 1.08, bedH * .45);
  paint(rectPts(ramX - w * .02, bedY, ramW + w * .04, bedH * .55, 1), { wash: A2.gunmetal, ink: PAL.ink, sw });
  // piston rod + ram
  paint(rectPts(x + w / 2 - w * .06, y + beamH - 4, w * .12, ramY - (y + beamH) + 8), { wash: A2.steelLt, fill: A2.steel, fillOp: 70, tex: .3, ink: PAL.ink, sw: sw * .6 });
  paint(rectPts(ramX, ramY, ramW, ramH, 1), { wash: A2.steel, fill: A2.gunDk, fillOp: 100, tex: .6, border: .5, ink: PAL.ink, sw });
  hazard(ramX, ramY + ramH * .72, ramW, ramH * .28);
  // crossbeam with the cylinder and a label plate
  paint(rectPts(x - w * .05, y, w * 1.1, beamH, 1.5), { wash: A2.gunmetal, fill: A2.steel, fillOp: 70, tex: .6, border: .4, ink: PAL.ink, sw });
  paint(rectPts(x + w / 2 - w * .16, y - h * .1, w * .32, h * .1 + 4), { wash: A2.rust, fill: '#6E2E18', fillOp: 80, tex: .6, ink: PAL.ink, sw: sw * .8 });
  for (const bx of [x + w * .04, x + w * .96]) paint(ellPts(bx, y + beamH / 2, beamH * .14, beamH * .14, 8), { wash: A2.steelLt, ink: null });
  if (o.label) letter(o.label, x + w / 2, y + beamH / 2, beamH * .42, A2.hazard, { font: ruFont(beamH * .42), ink: false });
  // the minted token (hot after the slam, cools to gold), squashed while the ram is down
  const r = Math.min(ramW * .3, bedH * 2.2), cx = x + w / 2, ty = bedY - r * .38;
  if (o.token !== false && last > -1e8) {
    if (typeof o.token === 'function') o.token(cx, bedY, r, age);
    else {
      const heat = Math.exp(-age / .5);
      if (heat > .05) paint(ellPts(cx, ty, r * 1.5, r * .7, 18), { fill: A2.sodium, fillOp: 150 * heat, bleed: .3, tex: .2, ink: null });
      push(); translate(cx, ty); scale(1, .38 * (1 - .25 * k));
      token(0, 0, r, { glow: heat * .8 });
      if (heat > .15) paint(ellPts(0, 0, r, r, 20), { wash: A2.sodium, washOp: 200 * heat, ink: null });
      pop();
    }
  }
  if (o.steam !== false && age < 1.4) for (const sd of [-1, 1]) steam(cx + sd * ramW * .55, ramY + ramH * .8, t, { dir: sd < 0 ? Math.PI + .5 : -.5, k: 1 - age / 1.4, len: w * .7, seed: seed + sd * 3, n: 4, per: .7 });
  sparks(cx - ramW * .4, bedY - 4, age, seed + Math.floor(last * 10), 8, w * .5);
  sparks(cx + ramW * .4, bedY - 4, age, seed + 17 + Math.floor(last * 10), 8, w * .5);
  if (k > .3) for (const sd of [-1, 1]) inkLine([[cx + sd * ramW * .55, bedY - h * .05], [cx + sd * ramW * .75, bedY - h * .12]], 1.4 * k, PAL.cream, 'ink', 0);
  return { k, age, ramY };
}

function gear(x, y, r, t, o = {}) {
  const n = o.n || Math.max(8, Math.round(r / 11)), a0 = (o.rot || 0) + t * (o.speed ?? .2) * TAU, col = o.col || A2.steel, sw = clamp(r / 110, .4, 1.2);
  const pts = [], td = r * .16;
  for (let i = 0; i < n; i++) {
    const a = a0 + i / n * TAU, st = TAU / n;
    for (const [f, rr] of [[0, r - td], [.18, r - td], [.26, r + td * .6], [.5, r + td * .6], [.58, r - td], [1, r - td]]) {
      if (f === 1) continue;
      pts.push([x + Math.cos(a + f * st) * rr, y + Math.sin(a + f * st) * rr]);
    }
  }
  paint(pts, { wash: col, fill: A2.gunDk, fillOp: 90, tex: .5, border: .4, ink: PAL.ink, sw });
  paint(ellPts(x, y, r * .7, r * .7, 24), { wash: mixCol(col, A2.gunDk, .35), ink: PAL.ink, sw: sw * .5 });
  if (r > 40) for (let i = 0; i < 5; i++) {                                        // spoke holes
    const a = a0 + (i + .5) / 5 * TAU, hx = x + Math.cos(a) * r * .45, hy = y + Math.sin(a) * r * .45;
    paint(ellPts(hx, hy, r * .13, r * .13, 10), { wash: o.hole || A2.gunDk, ink: null });
  }
  paint(ellPts(x, y, r * .2, r * .2, 12), { wash: o.hole || A2.gunDk, ink: PAL.ink, sw: sw * .5 });
}

function siren(x, y, t, o = {}) {
  const R = o.r || 44, on = o.on ?? 1, col = o.col || A2.sodium, a = t * (o.speed ?? 1.2) * TAU, L = (o.len || 520) * on, cy = y - R * 1.1;
  if (on > .03) for (const side of [0, Math.PI]) {
    const c = Math.cos(a + side), vis = Math.max(0, Math.sin(a + side)) * .6 + .4;           // beam swings through the frame
    const ex = x + c * L, spread = R * (1 + 3.5 * Math.abs(c)) * vis;
    if (Math.abs(c) > .08) {
      paint([[x, cy - R * .3], [ex, cy - spread], [ex, cy + spread], [x, cy + R * .3]], { wash: col, washOp: 70 * on * vis, fill: col, fillOp: 90 * on * vis, bleed: .25, tex: .2, border: .1, ink: null });
      paint([[x, cy - R * .12], [lerp(x, ex, .7), cy - spread * .3], [lerp(x, ex, .7), cy + spread * .3], [x, cy + R * .12]], { wash: '#FFF3C8', washOp: 60 * on * vis, ink: null });
    }
  }
  if (on > .03) paint(ellPts(x, cy, R * 2.4, R * 2.1, 18), { wash: col, washOp: 50 * on, fill: col, fillOp: 120 * on, bleed: .3, tex: .2, ink: null });
  paint(rectPts(x - R * 1.2, y - R * .35, R * 2.4, R * .5), { wash: A2.gunmetal, ink: PAL.ink, sw: .7 });
  const dome = []; for (let i = 0; i <= 14; i++) { const q = Math.PI + i / 14 * Math.PI; dome.push([x + Math.cos(q) * R, y - R * .35 + Math.sin(q) * R * 1.4]); }
  paint(dome, { wash: on > .1 ? mixCol(col, '#FFF3C8', .25 * on) : mixCol(col, A2.gunDk, .5), fill: A2.rust, fillOp: 70, tex: .4, ink: PAL.ink, sw: .8 });
  for (let i = -1; i <= 1; i++) inkLine([[x + i * R * .45, y - R * .35], [x + i * R * .3, y - R * 1.6]], .4, A2.rust, 'inkfine', 0);
  paint(ellPts(x + Math.sin(a) * R * .5, y - R * 1.05, R * .22, R * .4, 10), { wash: '#FFFFFF', washOp: 200 * on, ink: null });
}

function conveyor(x, y, w, t, o = {}) {
  const h = o.h || 38, sp = o.speed ?? 140, gap = o.gap || 200, items = o.items || ['token'], seed = o.seed || 0, sc = o.size || 1, legs = o.legs ?? 160;
  const sw = clamp(h / 45, .5, 1);
  if (legs > 0) for (let lx = x + 40; lx < x + w - 20; lx += 260) {
    paint(rectPts(lx, y + h * .5, 16, legs), { wash: A2.gunmetal, ink: PAL.ink, sw: sw * .6 });
    inkLine([[lx + 8, y + h + legs * .3], [lx + 130, y + h * .7 + legs]], sw * .5, A2.steel, 'inkfine', 0);
  }
  paint(rrPts(x, y, w, h, h / 2, 1), { wash: A2.gunDk, fill: A2.gunmetal, fillOp: 90, tex: .5, ink: PAL.ink, sw });
  const off = frac(t * sp / 60) * 60;                                                           // belt cleats moving
  for (let bx = x + h / 2 - 60 + off; bx < x + w - h / 2; bx += 60) if (bx > x + h / 2) inkLine([[bx, y + 3], [bx - 8, y + h * .4]], sw * .6, A2.steel, 'inkfine', 0);
  const rr = h * .38, ra = t * sp / rr;
  for (let rx = x + h / 2; rx <= x + w - h / 2 + 1; rx += Math.max(h * 1.4, (w - h) / Math.max(1, Math.round((w - h) / (h * 2.2))))) {
    paint(ellPts(rx, y + h / 2, rr, rr, 12), { wash: A2.steel, ink: PAL.ink, sw: sw * .5 });
    inkLine([[rx + Math.cos(ra) * rr * .8, y + h / 2 + Math.sin(ra) * rr * .8], [rx - Math.cos(ra) * rr * .8, y + h / 2 - Math.sin(ra) * rr * .8]], sw * .5, A2.gunDk, 'inkfine', 0);
  }
  // items: slot i sits at x + i * gap + scroll; pure function of t
  const scroll = t * sp, i0 = Math.floor((-scroll - gap) / gap), i1 = Math.ceil((w - scroll + gap) / gap);
  for (let i = i0; i <= i1; i++) {
    const ix = x + i * gap + scroll + gap * .5; if (ix < x + 10 || ix > x + w - 10) continue;
    const kind = items[((i % items.length) + items.length) % items.length], hs = hash(i * 3.7 + seed);
    if (typeof kind === 'function') kind(ix, y, i);
    else if (kind === 'token') token(ix, y - 34 * sc, 34 * sc, { spin: t * .3 + hs, rot: (hs - .5) * .3 });
    else if (kind === 'gpu') gpuCard(ix, y - 34 * sc, .5 * sc, t, { rot: (hs - .5) * .06 });
    else if (kind === 'agent') agentBot(ix, y, 9 * sc, t, { n: Math.abs(i) % 99 + 1, seed: i, noShadow: true });
    else if (kind === 'task') {
      const tw = 90 * sc, th = 110 * sc, tx = ix - tw / 2, ty = y - th;
      paint(rotPts(rectPts(tx, ty, tw, th, 1), ix, y - th / 2, (hs - .5) * .2), { wash: A2.cream, ink: PAL.ink, sw: sw * .6 });
      for (let q = 0; q < 3; q++) {
        paint(rectPts(tx + tw * .12, ty + th * (.3 + q * .22), tw * .14, tw * .14), { ink: PAL.ink, sw: sw * .4 });
        inkLine([[tx + tw * .36, ty + th * (.33 + q * .22)], [tx + tw * .86, ty + th * (.33 + q * .22)]], sw * .4, A2.steel, 'inkfine', 0);
      }
      letter('ЗАДАЧА', ix, ty + th * .14, 15 * sc, A2.rust, { font: ruFont(15 * sc), ink: false });
    }
  }
}

// ---------- acid ----------
function squelch(t, t0, t1) {
  if (t < t0 || t > t1 || t1 <= t0) return 0;
  const p = (t - t0) / (t1 - t0), d = t1 - t0, ph = (t - t0) * (3 + 9 * p * .5);                // LFO 3 Hz → ~7.5 Hz
  return Math.sin(p * Math.PI) * (.5 + .5 * Math.sin(ph * TAU)) * (d > 0 ? 1 : 0);
}

function acidField(t, o = {}) {
  const k = o.k ?? 1, hy = o.hy ?? 430, sq = o.sq || 0, [ca, cb] = o.cols || [A2.acid, A2.magenta], sp = o.speed ?? 1.6;
  const wob = (y, ph) => Math.sin(y * .012 + t * 5 + ph) * (26 * k + 60 * sq);
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: A2.uv, fill: '#2A0E6E', fillOp: 110, bleed: .1, tex: .5, border: .3, ink: null });
  // squelch bands in the sky: horizontal waves, frequency bent by sq
  const bands = [A2.magenta, A2.acid, '#9A5BFF', A2.magenta, A2.hazard];
  for (let b = 0; b < bands.length; b++) {
    const by = hy - 60 - b * 78 + Math.sin(t * 1.3 + b) * 8, th = 22 + b * 3, pts = [];
    for (let i = 0; i <= 24; i++) { const px = -40 + i * (W + 80) / 24; pts.push([px, by + Math.sin(i * (.55 + sq * .6) + t * (3 + b) + b) * (18 + 40 * k * (b % 2 ? 1 : .5))]); }
    for (let i = 24; i >= 0; i--) { const px = -40 + i * (W + 80) / 24; pts.push([px, by + th + Math.sin(i * (.55 + sq * .6) + t * (3 + b) + b + .4) * (18 + 40 * k * (b % 2 ? 1 : .5))]); }
    paint(pts, { wash: bands[b], washOp: 160 + 60 * (b % 2), ink: null });
  }
  // the acid sun: a hot disc sliced by the bands
  paint(ellPts(W / 2, hy - 10, 180, 180, 28), { wash: A2.hazard, fill: A2.sodium, fillOp: 90, tex: .3, ink: null });
  for (let i = 0; i < 4; i++) paint(rectPts(W / 2 - 200, hy - 140 + i * 36, 400, 8 + i * 3), { wash: A2.uv, ink: null });
  // perspective checkerboard floor, rows scroll toward camera
  paint(rectPts(-60, hy, W + 120, H - hy + 60), { wash: cb, ink: null });
  const f = 260, zs = frac(t * sp), rows = 11, cols = 9, cx = W / 2;
  const P = (X, z) => { const sy = hy + f / z * 1.0, sx = cx + X * f / z * 1.6; return [sx + wob(sy, 0), sy]; };
  for (let r = 0; r < rows; r++) {
    const z0 = .45 + (r - zs) * .45, z1 = z0 + .45; if (z1 <= .3) continue;
    const za = Math.max(.3, z0);
    for (let c = -cols; c < cols; c++) {
      if (((r + c) % 2 + 2) % 2) continue;
      const q = [P(c, za), P(c + 1, za), P(c + 1, z1), P(c, z1)].map(p => [p[0], Math.min(p[1], H + 60)]);
      if (q[0][0] > W + 400 || q[1][0] < -400 || polyArea(q) < 30) continue;
      paint(q, { wash: ca, ink: null });
    }
  }
  paint(rectPts(-60, hy, W + 120, 70), { wash: A2.uv, washOp: 150, ink: null });                               // horizon haze hides far-row aliasing
  paint(rectPts(-60, hy, W + 120, 28), { wash: A2.uv, washOp: 170, ink: null });
  paint(rectPts(-60, hy - 4, W + 120, 8), { wash: A2.hazard, washOp: 220, ink: null });
  if (k > .7 && frac(t * 8) < .5 * (k - .7)) paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#FFFFFF', washOp: 60, ink: null });   // strobe
}

function acidSmiley(x, y, r, t, o = {}) {
  const melt = clamp(o.melt || 0), face = o.col || A2.hazard, sw = clamp(r / 60, .4, 1.4), rot = o.rot || 0;
  if (o.glow) paint(ellPts(x, y, r * 1.7, r * 1.7, 18), { fill: A2.hazard, fillOp: 110 * o.glow, bleed: .3, tex: .2, ink: null });
  push(); translate(x, y); rotate(rot);
  const shape = (rr, drip) => {
    const pts = [], n = 40;
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU, s = Math.sin(a), lower = Math.max(0, s);
      const d = drip ? melt * rr * (.35 * lower * lower + (hash(i * 7 + 3) > .72 ? lower * (.6 + hash(i) * 1.1) : 0)) * (1 + .08 * Math.sin(t * 3 + i)) : 0;
      pts.push([Math.cos(a) * rr * (1 + melt * .12 * lower), s * rr + d]);
    }
    return pts;
  };
  paint(shape(r, true), { wash: mixCol(TK.goldDk, A2.acid, melt * .6), ink: PAL.ink, sw, curv: .3 });                   // chip rim
  if (r > 26) for (let i = 0; i < 6; i++) {
    const a = i / 6 * TAU + .26;
    if (Math.sin(a) > .3 && melt > .3) continue;
    paint([[Math.cos(a - .2) * r * .96, Math.sin(a - .2) * r * .96], [Math.cos(a + .2) * r * .96, Math.sin(a + .2) * r * .96],
           [Math.cos(a + .18) * r * .82, Math.sin(a + .18) * r * .82], [Math.cos(a - .18) * r * .82, Math.sin(a - .18) * r * .82]], { wash: A2.cream, washOp: 230, ink: null });
  }
  paint(shape(r * .8, true), { wash: face, fill: A2.acid, fillOp: 70, bleed: .15, tex: .5, border: .5, ink: null, curv: .3 });
  const sag = melt * r * .25, ey = -r * .22 + sag;
  if (o.eyes === 'x') for (const ex of [-.3, .3]) {
    const q = r * .12; inkLine([[ex * r - q, ey - q], [ex * r + q, ey + q]], sw * 1.1, PAL.ink, 'ink', 0); inkLine([[ex * r - q, ey + q], [ex * r + q, ey - q]], sw * 1.1, PAL.ink, 'ink', 0);
  } else for (const ex of [-.3, .3]) paint(ellPts(ex * r, ey, r * .09, r * .17 * (1 + melt * .6), 12), { wash: PAL.ink, ink: null });
  const m = []; for (let i = 0; i <= 10; i++) { const a = lerp(.35, Math.PI - .35, i / 10); m.push([Math.cos(a) * r * .5, r * .08 + Math.sin(a) * r * .38 + sag * (1 + Math.sin(i + t * 4) * .3)]); }
  inkLine(m, sw * 1.4, PAL.ink, 'ink', .5);
  for (const ex of [-.52, .52]) inkLine([[ex * r * .96, r * .14 + sag], [ex * r * 1.08, r * .06 + sag]], sw * .9, PAL.ink, 'ink', 0);
  paint(ellPts(-r * .38, -r * .5, r * .16, r * .07, 10, 0, -.6), { wash: '#FFFFFF', washOp: 170, ink: null });
  pop();
}

// ---------- matrix (accent only) ----------
const MX_GLYPHS = '₮₮₮0101010123456789';
function matrixRain(t, o = {}) {
  const k = clamp(o.k ?? .5), [ax, ay, aw, ah] = o.area || [0, 0, W, H], s = o.size || 34, seed = o.seed || 0, v = o.speed ?? 1;
  if (o.bg) paint(rectPts(ax - 20, ay - 20, aw + 40, ah + 40), { wash: A2.matrixBg, ink: null });
  if (k < .01) return;
  const font = `bold ${s}px "Courier New", monospace`, ncol = Math.floor(aw / (s * .9)), rows = Math.ceil(ah / s) + 1;
  for (let c = 0; c < ncol; c++) {
    if (hash(c * 1.37 + seed) > k) continue;                                       // density: keep a fraction of columns
    const sp = (6 + hash(c + seed * 3) * 10) * v, len = 6 + Math.floor(hash(c * 2.1 + seed) * 14), per = (rows + len) / sp;
    const head = frac(t / per + hash(c * 5.3 + seed)) * (rows + len), cx = ax + (c + .5) * aw / ncol;
    for (let j = 0; j < len; j++) {
      const row = Math.floor(head) - j; if (row < 0 || row >= rows) continue;
      const g = MX_GLYPHS[Math.floor(hash(c * 31 + row * 7 + Math.floor(t * (j ? 3 : 12)) * 13 + seed) * MX_GLYPHS.length)];
      const a = j === 0 ? 1 : (1 - j / len) * .85;
      letter(g, cx, ay + row * s, s, j === 0 ? '#E6FFE8' : j < 3 ? '#7DFFAE' : A2.matrix, { font, alpha: a, ink: false, screen: true });
    }
  }
}

// ---------- the cut ----------
function glitchCut(t, tCut, o = {}) {
  const span = o.span ?? .1, d = t - tCut; if (Math.abs(d) > span) return;
  flushLetters();
  const k = (1 - Math.abs(d) / span) * (o.k ?? 1), fr = Math.floor(t * 24), n = o.n || 9;
  const cols = o.cols || [A2.magenta, '#18E8FF', A2.acid, A2.gunDk, A2.hazard, '#FF2A2A'];
  for (let i = 0; i < n; i++) {
    if (hash(i * 3.1 + fr * .7) > .45 + .55 * k) continue;
    const y = hash(i + fr * 1.3) * H, h = 6 + hash(i * 5 + fr) * 90 * k, off = (hash(i * 7 + fr * 2) - .5) * 420 * k;
    const x0 = hash(i * 11 + fr) < .5 ? -40 : hash(i * 13 + fr) * W * .6, w = W * (.25 + hash(i * 17 + fr) * .9);
    const kind = Math.floor(hash(i * 19 + fr) * 3);
    if (kind === 0) paint(rectPts(x0 + off, y, w, h), { wash: cols[i % cols.length], washOp: 150 + 100 * k, ink: null });     // flat bar
    else {                                                                                                                 // RGB-split sliver pair
      paint(rectPts(x0 + off - 14 * k, y, w, h), { wash: '#FF1E3C', washOp: 110, ink: null });
      paint(rectPts(x0 + off + 14 * k, y + h * .15, w, h * .7), { wash: '#1EE8FF', washOp: 110, ink: null });
      paint(rectPts(x0 + off, y + h * .35, w, Math.max(2, h * .3)), { wash: A2.gunDk, washOp: 180, ink: null });
    }
  }
  if (Math.abs(d) < 1 / 24) {                                                             // the cut frame itself: tear the frame
    const sy = hash(fr * 3.3) * H * .6;
    paint(rectPts(-40, sy, W + 80, H * .18), { wash: A2.gunDk, washOp: 230, ink: null });
    paint(rectPts(-40 + 60, sy + H * .18, W + 80, 10), { wash: '#FFFFFF', washOp: 200, ink: null });
  }
  for (let y = hash(fr) * 12; y < H; y += 24) paint([[-40, y], [W + 40, y], [W + 40, y + 3], [-40, y + 3]], { wash: '#000000', washOp: 40 + 60 * k, ink: null });
}

// ---------- characters + zine ----------
KHAT.shades = (u, sw) => {
  const lens = (x0, x1) => [[x0 * u, -7.45 * u], [x1 * u, -7.45 * u], [(x1 - .25) * u, -5.35 * u], [(x0 + .6) * u, -5.2 * u], [x0 * u, -6.1 * u]];
  paint([[-5.3 * u, -7.7 * u], [5.3 * u, -7.7 * u], [5.3 * u, -7.2 * u], [-5.3 * u, -7.2 * u]], { wash: PAL.ink, ink: null });   // bar + arms
  for (const [a, b] of [[-4.6, -.5], [.5, 4.6]]) paint(lens(a, b), { wash: '#0A0D0B', ink: PAL.ink, sw: sw * .6 });
  paint([[-.6 * u, -7.2 * u], [.6 * u, -7.2 * u], [.4 * u, -6.7 * u], [-.4 * u, -6.7 * u]], { wash: PAL.ink, ink: null });
  for (const [a, b] of [[-4.6, -.5], [.5, 4.6]]) {                                                                       // green reflections
    inkLine([[(a + .7) * u, -6 * u], [(a + 1.6) * u, -7.1 * u]], sw * .5, A2.matrix, 'inkfine', 0);
    inkLine([[(a + 1.5) * u, -5.8 * u], [(a + 2.1) * u, -6.6 * u]], sw * .35, '#7DFFAE', 'inkfine', 0);
  }
};

function zineCut(x, y, w, h, o = {}) {
  const seed = o.seed || 0, rot = o.rot ?? (hash(seed + .5) - .5) * .08, col = o.col || A2.cream, cx = x + w / 2, cy = y + h / 2, sw = clamp(w / 600, .4, 1);
  const torn = [], tear = Math.min(w, h) * .025 + 3, edge = (x0, y0, x1, y1, n, e) => {
    for (let i = 0; i < n; i++) { const f = i / n, j = (hash(seed * 13 + e * 71 + i) - .5) * 2 * tear; torn.push([lerp(x0, x1, f) + (y0 === y1 ? 0 : j), lerp(y0, y1, f) + (y0 === y1 ? j : 0)]); }
  };
  const nx = Math.max(6, Math.round(w / 34)), ny = Math.max(5, Math.round(h / 34));
  edge(x, y, x + w, y, nx, 0); edge(x + w, y, x + w, y + h, ny, 1); edge(x + w, y + h, x, y + h, nx, 2); edge(x, y + h, x, y, ny, 3);
  const R = pts => rotPts(pts, cx, cy, rot);
  if (o.shadow !== false) paint(R(torn.map(([px, py]) => [px + 14, py + 18])), { wash: '#000000', washOp: 110, ink: null });
  paint(R(torn), { wash: col, fill: '#CFC4AA', fillOp: 70, bleed: .1, tex: .7, border: .5, ink: '#3A3530', sw: sw * .6 });
  if (o.dots !== false) {                                                                            // xerox halftone corner
    const step = Math.max(14, Math.min(w, h) / 9);
    for (let gx = 0; gx < 7; gx++) for (let gy = 0; gy < 5; gy++) {
      const f = 1 - (gx + gy) / 10, r = step * .38 * f; if (r < 1.5) continue;
      const [px, py] = R([[x + w - step * (gx + .7), y + h - step * (gy + .7) + (gx % 2) * step * .5]])[0];
      paint(ellPts(px, py, r, r, 7), { wash: '#3A3530', washOp: 170, ink: null });
    }
  }
  if (o.tape !== false) for (const [tx, ty, ta] of [[x + w * .08, y, -.5], [x + w * .92, y, .45]]) {
    const [px, py] = R([[tx, ty]])[0], tw = Math.max(50, w * .16), th = tw * .32;
    paint(rotPts(rectPts(px - tw / 2, py - th / 2, tw, th, 1.5), px, py, ta + rot), { wash: '#F4E9A8', washOp: 170, fill: '#D9C878', fillOp: 50, tex: .4, ink: null });
  }
  const m = Math.min(w, h) * .06;
  return [x + m, y + m, w - 2 * m, h - 2 * m];
}

// karaoke bar end caps: a token, not the Kremlin ruby star
window.KARAOKE_ICON = (x, y, r) => token(x, y, r * .9, { glow: .3 });
