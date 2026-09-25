// tokens/kit.js: the shared kit for «Жги токены», a hardcore-punk satire about burning the weekly AI token limit.
// Loaded after core/kremlin/clawd/cast/props/timeline. Re-themes the shared palette tokens (karaoke bar, wipes) to
// soot + fire and adds the props below. Every function is a pure function of its arguments and T/t.
// Rect-like props take a TOP-LEFT (x, y); characters take the ground point between the feet (like clawd()).
// Russian text: always RU_FONT (via letter(..., { font }) or stamp / punkText); Permanent Marker has no Cyrillic.
//
//   TK                                  palette: soot, sootLt, orange, orangeDk, yellow, yellowLt, ember, emberDk, steel,
//                                       steelLt, steelDk, led, green, greenDk, blue, blueDk, gold, goldDk, pcb, copper, ash, cream
//   ruFont(size)                        → `${size}px ${RU_FONT}` (shorthand for letter options)
//   fmtNum(n)                           → "40 000 000" (floors, thin-space groups)
//   token(x, y, r, o)                   gold coin-chip with a "T". o.burn 0..1 (flames lick, it chars), o.rot, o.glow 0..1,
//                                       o.spin (phase, coin flips edge-on), o.ink (false = no outline). r < 22 draws a cheap version.
//   tokenRain(t, o)                     coins falling (default) or flying into o.to [x, y] from o.from [x, y] (or the top edge).
//                                       o.n 24, o.seed, o.r 18, o.per 1.4 s (flight time), o.burn, o.area [x0, x1] for falling.
//   fire(x, y, w, h, t, o)              boiling watercolour flames standing on (x, y) (bottom centre), w wide, h tall.
//                                       o.cols [outer, mid, core], o.seed, o.k intensity 0..1+ (height + glow), o.n tongues, o.glow false.
//   smoke(x, y, t, o)                   soot puffs rising from (x, y). o.n 7, o.h rise px 420, o.r puff radius 50, o.col, o.seed, o.per 2.4.
//   serverRack(x, y, w, h, t, o)        rack with blinking LED units. o.heat 0..1 (glows orange, fire on top at > .9),
//                                       o.units 9, o.seed, o.fire (force the top fire, 0..1).
//   cooler(x, y, r, t, o)               fan centred at (x, y): frame, spinning blades, howl lines. o.speed turns/s (4), o.howl 0..1.
//   dataCenter(t, o)                    full-frame hall of racks in perspective with cable trays. o.heat 0..1, o.fire 0..1,
//                                       o.vp [x, y] vanishing point, o.n racks per side (8), o.seed.
//   gpuCard(x, y, s, t, o)              green-PCB GPU centred at (x, y), s = 1 is 360 x 130 px. o.glow 0..1, o.rot, o.fans false.
//   ticker(t, o)                        full-width stock ticker strip, always green and up. o.y top (40), o.h 76,
//                                       o.items ['NVDA ▲', ...], o.speed px/s (260).
//   stockChart(x, y, w, h, t, o)        candlestick chart that only climbs. o.k 0..1 reveal, o.n candles 16, o.moon 0..1
//                                       (the last candles and an arrow break out through the frame top), o.title, o.seed.
//   ceoClawd(x, y, u, o)                Clawd in a black turtleneck, headset mic, clicker in the right hand. Takes clawd()
//                                       options (+ o.click 0..1 clicker LED flash, o.noClicker). Default mouth 'smile'.
//   agentBot(x, y, s, t, o)             little blue agent Clawd with a lanyard badge "AGENT #n". s = body unit.
//                                       o.n, o.hire (holds a smaller agent in the right hand), o.dance move style ('idle'),
//                                       o.seed, plus any clawd() option.
//   limitBar(x, y, w, v, o)             "НЕДЕЛЬНЫЙ ЛИМИТ" bar with a % label, v 0..1. o.h (w * .085), o.label, o.col (auto
//                                       green → orange → red), o.grey (dead, desaturated), o.burn 0..1 (flames on the fill edge), o.glow.
//   counter(x, y, size, value, o)       odometer digits centred on (x, y), grouped "300 000 000 000"; the units digit rolls.
//                                       o.col digits, o.box bg, o.suffix (drawn after), o.align 'center'|'left'.
//   uiCard(x, y, w, h, o)               flat chat-UI notification. o.title, o.body (string or lines), o.icon 'clawd'|'bell'|'token',
//                                       o.time '00:00', o.k 0..1 slide-in (from above), o.accent.
//   slide(x, y, w, h, o)                keynote slide. o.title, o.graph 'up'|'loop', o.k 0..1 graph reveal, o.bullets [..],
//                                       o.loop labels for 'loop' ['GPU', 'ТОКЕНЫ', ...], o.bg, o.t (for the loop spin).
//   stamp(txt, x, y, size, t, t0, o)    rubber stamp slammed at t0: overshoot, beat punch, ink spatter. o.col (ember), o.rot,
//                                       o.border true, o.punch .06.
//   punkText(txt, x, y, size, t, t0, o) ransom-note lettering: every letter on its own scrap, jittering on the half-beat.
//                                       o.step .035 s letter stagger, o.cols scrap colours, o.seed.
//   crowdMosh(t, o)                     bottom band of moshing Clawds + agents with raised fists. o.y ground (1110), o.k energy,
//                                       o.n front row (9), o.back false (no silhouette row).
//   window.WIPE_ICON                    a burning token spins through the wipes.

// ---------- theme ----------
const TK = {
  soot: '#1A1718', sootLt: '#3A3336', orange: '#FF6A1A', orangeDk: '#B8420E', yellow: '#FFC53D', yellowLt: '#FFE38A',
  ember: '#D8262A', emberDk: '#8A1418', steel: '#3A4450', steelLt: '#5E6B78', steelDk: '#232A33', led: '#48E08A',
  green: '#2FBF71', greenDk: '#1E7A48', blue: '#2E5BFF', blueDk: '#1B3AB0', gold: '#F2B632', goldDk: '#A8741A',
  pcb: '#2E7D4F', copper: '#C8773A', ash: '#8A8480', cream: PAL.cream
};
Object.assign(KP, {
  ruby: TK.ember, rubyDk: TK.emberDk, rubyLt: '#FF8A3D', gold: TK.yellow, goldLt: TK.yellowLt, goldDk: TK.goldDk, night: TK.soot
});
for (const k of Object.keys(HAT_SWAP)) delete HAT_SWAP[k];
WIPE_COLS.splice(0, WIPE_COLS.length, [TK.soot, TK.orange], [TK.emberDk, TK.yellow], [TK.soot, TK.ember], [TK.orangeDk, TK.sootLt]);   // soot/fire brush wipes

const ruFont = size => `${size}px ${RU_FONT}`;
const fmtNum = n => String(Math.floor(Math.max(0, n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const _mc = document.createElement('canvas').getContext('2d');
const textW = (txt, font) => { _mc.font = font; return _mc.measureText(txt).width; };
const rotPts = (pts, cx, cy, a) => { const c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]); };
const glowAt = (x, y, r, col, op = 80) => paint(ellPts(x, y, r, r, 16), { fill: col, fillOp: op, bleed: .3, tex: .2, border: .1, ink: null });

// ---------- fire + smoke ----------
function flamePts(x, y, w, h, t, seed, n) {
  // n tongues, each an S-curved lick with a sharp swaying tip; tallest in the middle
  const pts = [[x - w / 2, y]];
  for (let i = 0; i < n; i++) {
    const c = (i + .5) / n, env = .3 + .7 * Math.pow(Math.sin(c * Math.PI), .8), ph = hash(seed + i * 7) * TAU, sp = 7 + hash(seed + i) * 6;
    const fl = .7 + .3 * Math.sin(t * sp + ph) * Math.sin(t * sp * .41 + ph * 2), th = h * env * fl, tw = w / n;
    const x0 = x - w / 2 + i * tw, sway = Math.sin(t * 4.3 + ph) * tw * .55 + Math.sin(t * 11 + ph) * tw * .12;
    if (i > 0) pts.push([x0, y - h * env * (.22 + .08 * Math.sin(t * 9 + ph))]);
    pts.push([x0 + tw * .12 + sway * .2, y - th * .45], [x0 + tw * .3 + sway * .7, y - th * .8], [x0 + tw * .5 + sway, y - th],
             [x0 + tw * .62 + sway * .6, y - th * .72], [x0 + tw * .84 + sway * .15, y - th * .4]);
  }
  pts.push([x + w / 2, y], [x + w * .3, y + h * .05], [x - w * .3, y + h * .05]);
  return pts;
}
function fire(x, y, w, h, t, o = {}) {
  const k = o.k ?? 1; if (k < .02 || w < 4) return;
  const [c0, c1, c2] = o.cols || [TK.ember, TK.orange, TK.yellow], seed = o.seed || 0, n = o.n || Math.max(3, Math.min(9, Math.round(w / Math.max(24, h * .22))));
  const hh = h * k, sw = clamp(w / 300, .4, 1.2);
  if (o.glow !== false) glowAt(x, y - hh * .35, Math.max(w, hh) * .75, c1, 55 * clamp(k));
  paint(flamePts(x, y, w, hh, t, seed, n), { wash: c0, fill: TK.emberDk, fillOp: 80, bleed: .08, tex: .6, border: .5, ink: o.ink === false ? null : TK.emberDk, sw, curv: .35 });
  paint(flamePts(x, y, w * .76, hh * .74, t + 3.1, seed + 11, Math.max(2, n - 1)), { wash: c1, fill: TK.orangeDk, fillOp: 50, bleed: .08, tex: .5, border: .6, ink: null, curv: .35 });
  paint(flamePts(x, y, w * .46, hh * .44, t + 7.3, seed + 23, Math.max(2, n - 2)), { wash: c2, ink: null, curv: .35 });
  if (w > 120) for (let i = 0; i < 5; i++) {                                     // detached licks + sparks above
    const p = frac(t * (1.1 + hash(seed + i) * .8) + hash(seed + i + 5)), sx = x + (hash(seed + i + 9) - .5) * w * .7 + Math.sin(t * 3 + i) * w * .06, sy = y - hh * (.75 + p * .6), r = w * .025 * (1 - p) + 2;
    paint([[sx, sy - r * 3], [sx + r, sy], [sx, sy + r * .8], [sx - r, sy]], { wash: p < .5 ? c1 : c2, ink: null, curv: .4 });
  }
}
function smoke(x, y, t, o = {}) {
  const n = o.n || 7, H0 = o.h || 420, R = o.r || 50, per = o.per || 2.4, seed = o.seed || 0, col = o.col || TK.sootLt;
  for (let i = 0; i < n; i++) {
    const p = frac(t / per + i / n + hash(i + seed) * .3), r = R * (.5 + p * 1.3);
    const px = x + Math.sin(p * 4 + i * 2.1 + seed) * R * .8 * p + (hash(i + seed + 3) - .5) * R, py = y - p * H0;
    paint(ellPts(px, py, r, r * .85, 14, r * .08), { fill: col, fillOp: 150 * (1 - p) * Math.min(1, p * 6), bleed: .25, tex: .5, border: .5, ink: null });
  }
}

// ---------- tokens ----------
function tokenT(r, col) {                  // the "T" glyph, local coords around (0, 0)
  const a = r * .42, b = r * .13, s = r * .1, top = -r * .42, bar = r * .2, bot = r * .45;
  return { pts: [[-a, top], [a, top], [a, top + bar], [s, top + bar], [s * 1.1, bot], [-s * 1.1, bot], [-s, top + bar], [-a, top + bar]], col, b };
}
function token(x, y, r, o = {}) {
  if (r < 2) return;
  const burn = clamp(o.burn || 0), sx = o.spin != null ? Math.max(.16, Math.abs(Math.cos(o.spin * TAU))) : 1;
  const sw = clamp(r / 40, .35, 1.3), ink = o.ink === false ? null : PAL.ink;
  if (o.glow) glowAt(x, y, r * 1.9, TK.yellow, 90 * o.glow);
  if (burn > .05 && r >= 10) fire(x, y + r * .55, r * 2.1 * sx + r * .4, r * 3.4 * burn, T, { seed: Math.round(x * .13 + y * .07), glow: false, ink: false });
  push(); translate(x, y); rotate(o.rot || 0); scale(sx, 1);
  const face = mixCol(TK.gold, TK.soot, burn * .8), rim = mixCol(TK.goldDk, TK.soot, burn * .9);
  if (r < 22) {
    paint(ellPts(0, 0, r, r, 12), { wash: rim, ink, sw: sw * .8 });
    paint(ellPts(0, 0, r * .74, r * .74, 12), { wash: face, ink: null });
    const g = tokenT(r, burn > .6 ? TK.orange : TK.goldDk); paint(g.pts, { wash: g.col, ink: null });
  } else {
    paint(ellPts(0, 0, r, r, 24, r * .015), { wash: rim, fill: TK.goldDk, fillOp: 90, tex: .5, border: .4, ink: null });
    for (let i = 0; i < 6; i++) {                                                   // poker-chip edge inserts
      const a = i / 6 * TAU + .26, c = Math.cos(a), s = Math.sin(a), d = .04;
      paint([[Math.cos(a - .22) * r * .97, Math.sin(a - .22) * r * .97], [Math.cos(a + .22) * r * .97, Math.sin(a + .22) * r * .97],
             [Math.cos(a + .2) * r * .8, Math.sin(a + .2) * r * .8], [Math.cos(a - .2) * r * .8, Math.sin(a - .2) * r * .8]], { wash: mixCol(TK.cream, TK.soot, burn), washOp: 230, ink: null });
    }
    paint(ellPts(0, 0, r * .74, r * .74, 22, r * .01), { wash: face, fill: TK.yellowLt, fillOp: 90 * (1 - burn), bleed: .15, tex: .6, border: .6, ink: null });
    inkLine(ellPts(0, 0, r * .74, r * .74, 16).concat([[r * .74, 0]]), sw * .5, rim, 'inkfine', .5);
    const g = tokenT(r, burn > .6 ? TK.orange : '#7A4A0A');
    paint(g.pts, { wash: g.col, ink: null });
    paint(ellPts(-r * .35, -r * .38, r * .2, r * .09, 10, 0, -.6), { wash: '#FFFFFF', washOp: 150 * (1 - burn), ink: null });  // shine
    if (burn > .2) paint(ellPts(r * .15, r * .1, r * .8, r * .7, 16, r * .06), { fill: TK.soot, fillOp: 190 * burn, bleed: .2, tex: .8, border: .8, ink: null });
    paint(ellPts(0, 0, r, r, 24, r * .015), { ink, sw });
  }
  if (burn > .5) for (let i = 0; i < 3; i++) paint(ellPts((hash(i + x) - .5) * r, (hash(i + y) - .5) * r, r * .08, r * .08, 6), { wash: TK.orange, ink: null });  // embers
  pop();
}
function tokenRain(t, o = {}) {
  const n = o.n || 24, seed = o.seed || 0, R = o.r || 18;
  for (let i = 0; i < n; i++) {
    const h1 = hash(i + seed * 31), h2 = hash(i + seed * 31 + 7), h3 = hash(i + seed * 31 + 13);
    if (o.to) {
      const per = (o.per || 1.4) * (.8 + h2 * .4), p = frac(t / per + h1);
      const [fx, fy] = o.from ? [o.from[0] + (h2 - .5) * 260, o.from[1] + (h3 - .5) * 120] : [h2 * W, -80 - h3 * 120];
      const [tx, ty] = o.to, arc = -(200 + h3 * 220);
      const x = lerp(fx, tx, p) + Math.sin(p * Math.PI) * (h1 - .5) * 200, y = lerp(fy, ty, p) + Math.sin(p * Math.PI) * arc * (o.from ? 1 : .3);
      token(x, y, R * (1.1 - p * .55) * (.8 + h3 * .4), { spin: t * (1 + h1 * 2) + h2, rot: h3 * 2, burn: o.burn ?? p * p * .8 });
    } else {
      const [x0, x1] = o.area || [-60, W + 60], v = 260 + h2 * 280, span = H + 300, y = -150 + frac(h1 + t * v / span) * span;
      const x = lerp(x0, x1, h3) + Math.sin(t * (1 + h1) + i) * 40;
      token(x, y, R * (.7 + h1 * .7), { spin: t * (.6 + h2 * 1.5) + h1, rot: Math.sin(t + i) * .6, burn: o.burn || 0 });
    }
  }
}

// ---------- hardware ----------
function serverRack(x, y, w, h, t, o = {}) {
  const heat = clamp(o.heat || 0), units = o.units || 9, seed = o.seed || 0, sw = clamp(w / 200, .5, 1.2);
  if (heat > .1) glowAt(x + w / 2, y + h / 2, Math.max(w, h) * .6, TK.orange, 70 * heat);
  paint(rectPts(x, y, w, h, 1.5), { wash: mixCol(TK.steel, TK.orangeDk, heat * .45), fill: TK.steelDk, fillOp: 110, bleed: .05, tex: .6, border: .5, ink: PAL.ink, sw });
  const pad = w * .08, uh = (h - pad * 2) / units, tick = Math.floor(t * 7);
  for (let i = 0; i < units; i++) {
    const uy = y + pad + i * uh;
    paint(rectPts(x + pad, uy + uh * .12, w - pad * 2, uh * .76), { wash: mixCol(TK.steelDk, '#5A2410', heat), ink: null });
    for (let j = 0; j < 3; j++) {
      const on = hash(i * 13 + j * 7 + seed + tick * 3.1) > .35, c = heat > .7 && j === 2 ? TK.ember : (j ? TK.led : TK.yellow);
      paint(rectPts(x + w - pad - (j + 1) * w * .09, uy + uh * .38, w * .05, uh * .24), { wash: on ? c : TK.soot, ink: null });
    }
    inkLine([[x + pad * 1.6, uy + uh * .5], [x + w * .45, uy + uh * .5]], sw * .4, heat > .5 ? TK.orange : TK.steelLt, 'inkfine', 0);
  }
  const f = o.fire ?? seg(heat, .88, 1);
  if (f > .02) fire(x + w / 2, y + 4, w * 1.05, w * 1.3, t, { k: f, seed: seed * 5 + 1 });
}
function cooler(x, y, r, t, o = {}) {
  const speed = o.speed ?? 4, howl = o.howl || 0, sw = clamp(r / 90, .5, 1.3), a0 = t * speed * TAU;
  paint(rrPts(x - r * 1.18, y - r * 1.18, r * 2.36, r * 2.36, r * .22), { wash: TK.steel, fill: TK.steelDk, fillOp: 100, tex: .6, border: .5, ink: PAL.ink, sw });
  paint(ellPts(x, y, r, r, 24), { wash: TK.soot, ink: PAL.ink, sw: sw * .7 });
  for (const [cx, cy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) paint(ellPts(x + cx * r * .98, y + cy * r * .98, r * .08, r * .08, 8), { wash: TK.steelLt, ink: null });
  if (speed > 2.5) paint(ellPts(x, y, r * .9, r * .9, 20), { fill: TK.steelLt, fillOp: 80, bleed: .15, tex: .3, ink: null });   // motion blur disc
  for (let i = 0; i < 5; i++) {
    const a = a0 + i / 5 * TAU, b = a + .55, pt = (ang, rr) => [x + Math.cos(ang) * rr, y + Math.sin(ang) * rr];
    paint([pt(a - .25, r * .26), pt(a, r * .9), pt(b, r * .86), pt(b - .1, r * .3)], { wash: TK.steelLt, washOp: speed > 2.5 ? 150 : 255, ink: speed > 2.5 ? null : PAL.ink, sw: sw * .5, curv: .3 });
  }
  paint(ellPts(x, y, r * .26, r * .26, 14), { wash: TK.steel, ink: PAL.ink, sw: sw * .6 });
  paint(ellPts(x, y, r * .1, r * .1, 8), { wash: TK.orange, ink: null });
  if (howl > .02) for (let i = 0; i < 3; i++) {
    const p = frac(t * 2.2 + i / 3), rr = r * (1.35 + p * 1.1), op = howl * (1 - p);
    for (const s of [-1, 1]) {
      const arc = []; for (let q = 0; q <= 6; q++) { const a = (s < 0 ? Math.PI : 0) + (q / 6 - .5) * 1.2; arc.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
      if (op > .05) inkLine(arc, sw * (1.4 - p) * howl, mixCol(TK.cream, TK.ash, p), 'ink', .5);
    }
  }
}
function dataCenter(t, o = {}) {
  const heat = clamp(o.heat || 0), fireK = o.fire || 0, [vx, vy] = o.vp || [960, 520], n = o.n || 8, seed = o.seed || 0, f = 900;
  const P = (X, Y, Z) => [vx + X * f / Z, vy + Y * f / Z];
  const AX = 1.35, TOP = -.72, FL = 1.25, Z0 = 1.1, DZ = 1.2, ZF = Z0 + n * DZ, ROWS = 8, tick = Math.floor(t * 6);
  const rackCol = mixCol('#4A5868', TK.orangeDk, heat * .7), rackDk = mixCol('#1C2128', '#3A1508', heat * .6);
  paint(rectPts(-100, -100, W + 200, H + 200), { wash: TK.soot, fill: mixCol(TK.steelDk, TK.emberDk, heat), fillOp: 120, bleed: .1, tex: .6, border: .3, ink: null });
  // back wall (end of the hall) glowing, floor, ceiling lights
  const bw = [P(-AX, TOP - .3, ZF), P(AX, TOP - .3, ZF), P(AX, FL, ZF), P(-AX, FL, ZF)];
  paint(bw, { wash: mixCol('#2A3340', TK.orange, heat * .8), fill: heat > .3 ? TK.yellow : TK.steelLt, fillOp: 60 + 80 * heat, bleed: .2, tex: .4, ink: null });
  paint([P(-AX, FL, Z0 * .6), P(AX, FL, Z0 * .6), P(AX, FL, ZF), P(-AX, FL, ZF)], { wash: '#262A31', fill: heat > .3 ? TK.orangeDk : TK.steel, fillOp: 50 + 70 * heat, tex: .5, ink: null });
  for (let k = 0; k <= n; k += 2) { const z = Z0 + k * DZ; inkLine([P(-AX, FL, z), P(AX, FL, z)], .5, TK.steelLt, 'inkfine', 0); }
  for (const X of [-.45, .45]) inkLine([P(X, FL, Z0 * .6), P(X, FL, ZF)], .6, TK.steelLt, 'inkfine', 0);
  for (let k = 0; k < n; k += 2) { const z = Z0 + .3 + k * DZ; paint([P(-.4, TOP - .3, z), P(.4, TOP - .3, z), P(.4, TOP - .3, z + .5), P(-.4, TOP - .3, z + .5)], { wash: heat > .5 ? TK.yellowLt : '#DCE6F0', washOp: 220, ink: null }); }
  if (heat > .1) glowAt(vx, vy, 520, TK.orange, 80 * heat);
  for (const s of [-1, 1]) {
    const X = s * AX;
    // the whole wall of rack faces is one polygon; rack seams, unit rows and LEDs are lines/dots on it
    paint([P(X, TOP, Z0 * .6), P(X, TOP, ZF), P(X, FL, ZF), P(X, FL, Z0 * .6)], { wash: rackCol, fill: rackDk, fillOp: 110, bleed: .05, tex: .6, border: .5, ink: PAL.ink, sw: .8 });
        for (let i = 0; i < n; i++) {                                                // each rack: a dark door panel inset in the frame
      const z0 = Z0 + i * DZ + .07, z1 = Z0 + (i + 1) * DZ - .07;
      paint([P(X, TOP + .06, z0), P(X, TOP + .06, z1), P(X, FL - .04, z1), P(X, FL - .04, z0)], { wash: rackDk, washOp: 235, ink: TK.soot, sw: clamp(1.6 / z0, .3, 1) });
    }
    for (let i = 0; i < n; i++) for (let r = 0; r < ROWS; r++) {
      if (i > 5 && r % 2) continue;
      if (i < 5) { const Y = lerp(TOP, FL, (r + .5) / ROWS); inkLine([P(X, Y, Z0 + i * DZ + .15), P(X, Y, Z0 + i * DZ + DZ * .62)], clamp(3 / (Z0 + i * DZ), .3, 1.4), heat > .5 ? TK.orangeDk : TK.steelLt, 'inkfine', 0); }
      const hk = clamp(heat * 1.3 - i * .05), on = hash(i * 17 + r * 5 + s * 3 + seed + tick * 1.3) > .45;
      const [lx, ly] = P(X, lerp(TOP, FL, (r + .5) / ROWS), Z0 + i * DZ + DZ * .78), rr = clamp(11 / (Z0 + i * DZ), 1.5, 9);
      paint(ellPts(lx, ly, rr, rr, 6), { wash: hk > .55 ? (on ? TK.yellow : TK.ember) : (on ? TK.led : TK.steelDk), ink: null });
    }
    // cable tray along the ceiling edge, with a bundle of coloured cables
    const cx = s * (AX - .2), cy = TOP - .2;
    paint([P(cx - .16, cy, Z0 * .6), P(cx + .16, cy, Z0 * .6), P(cx + .16, cy, ZF), P(cx - .16, cy, ZF)], { wash: TK.goldDk, washOp: 220, ink: PAL.ink, sw: .5 });
    for (let k = 0; k < 3; k++) inkLine([P(cx - .08 + k * .08, cy + .03, Z0 * .6), P(cx - .08 + k * .08, cy + .03, ZF)], 1.2, [TK.blue, TK.ember, TK.green][k], 'inkfine', 0);
    for (let i = 1; i < n; i += 2) { const z = Z0 + i * DZ; inkLine([P(cx, cy, z), P(lerp(cx, X, .6), TOP - .02, z + .08), P(X, TOP + .03, z + .2)], clamp(2.6 / z, .3, 1.6), TK.sootLt, 'ink', .5); }
    // fire along the rack tops
    if (fireK > .02) for (let i = 1; i < Math.min(n, 6); i++) {
      const z = Z0 + i * DZ + DZ * .5, [fx, fy] = P(X, TOP, z), sc = f / z;
      fire(fx - s * sc * .05, fy + 4, sc * DZ * .95, sc * .9, t, { k: fireK * (1 - i * .06), seed: seed + i * 3 + (s > 0 ? 50 : 0) });
    }
  }
}
function gpuCard(x, y, s, t, o = {}) {
  const w = 360 * s, h = 130 * s, sw = clamp(s, .4, 1.2);
  push(); translate(x, y); rotate(o.rot || 0);
  if (o.glow) glowAt(0, 0, w * .6, TK.green, 90 * o.glow);
  paint(rectPts(-w / 2, -h / 2, w, h, 1), { wash: TK.pcb, fill: TK.greenDk, fillOp: 90, tex: .6, ink: PAL.ink, sw });
  paint(rectPts(-w * .3, h / 2 - 2, w * .5, h * .12), { wash: TK.gold, ink: PAL.ink, sw: sw * .5 });                           // PCIe fingers
  for (let i = 0; i < 9; i++) inkLine([[-w * .28 + i * w * .055, h / 2], [-w * .28 + i * w * .055, h / 2 + h * .1]], sw * .35, TK.goldDk, 'inkfine', 0);
  paint(rrPts(-w * .48, -h * .44, w * .92, h * .8, h * .12), { wash: TK.steelDk, fill: TK.soot, fillOp: 80, tex: .5, ink: PAL.ink, sw: sw * .8 });  // shroud
  paint([[-w * .48, -h * .06], [-w * .36, -h * .2], [w * .36, -h * .2], [w * .44, -h * .06]], { wash: TK.green, washOp: 200, ink: null });  // accent stripe
  if (o.fans !== false) for (const fx of [-w * .22, w * .2]) {
    const r = h * .33;
    paint(ellPts(fx, 0, r, r, 18), { wash: TK.soot, ink: PAL.ink, sw: sw * .5 });
    for (let i = 0; i < 5; i++) { const a = t * 9 + i / 5 * TAU; inkLine([[fx + Math.cos(a) * r * .2, Math.sin(a) * r * .2], [fx + Math.cos(a + .4) * r * .6, Math.sin(a + .4) * r * .6], [fx + Math.cos(a + .6) * r * .9, Math.sin(a + .6) * r * .9]], sw * .6, TK.steelLt, 'inkfine', .5); }
    paint(ellPts(fx, 0, r * .2, r * .2, 10), { wash: TK.green, ink: null });
  }
  paint(rectPts(w * .44, -h * .5, w * .06, h, 0), { wash: TK.steelLt, ink: PAL.ink, sw: sw * .5 });                          // IO bracket
  pop();
}

// ---------- markets ----------
function ticker(t, o = {}) {
  const y = o.y ?? 40, h = o.h || 76, items = o.items || ['NVDA ▲ +7.2%', 'TOKN ▲ +12%', 'GPU ▲ +9.1%', 'CAPEX ▲ +31%', 'AGI ▲ СКОРО', 'ВАТТЫ ▲ +18%'];
  const size = h * .5, sp = o.speed ?? 260, font = ruFont(size);
  paint(rectPts(-40, y, W + 80, h, 1.5), { wash: TK.soot, fill: TK.greenDk, fillOp: 50, tex: .5, border: .3, ink: TK.green, sw: .8 });
  const ws = items.map(s => textW(s, font) + size * 1.6), total = ws.reduce((a, b) => a + b, 0);
  let off = -frac(t * sp / total) * total;
  for (let rep = 0; off < W + 40; rep++) for (let i = 0; i < items.length && off < W + 40; i++) {
    const wx = off + ws[i] / 2;
    if (wx > -ws[i]) letter(items[i], wx, y + h / 2, size, i % 2 ? TK.led : TK.green, { font, ink: false });
    off += ws[i];
  }
}
function stockChart(x, y, w, h, t, o = {}) {
  const n = o.n || 16, k = o.k ?? 1, moon = o.moon || 0, seed = o.seed || 0, sw = clamp(w / 600, .5, 1.2);
  paint(rectPts(x, y, w, h, 2), { wash: TK.soot, fill: TK.steelDk, fillOp: 90, tex: .5, ink: PAL.ink, sw });
  for (let i = 1; i < 5; i++) inkLine([[x + 10, y + h * i / 5], [x + w - 10, y + h * i / 5]], .4, TK.steel, 'inkfine', 0);
  if (o.title) letter(o.title, x + 24, y + 34, Math.min(40, h * .09), TK.green, { font: ruFont(Math.min(40, h * .09)), align: 'left', ink: false });
  const cw = (w - 60) / n, shown = Math.ceil(n * k), val = i => {                 // 0..1 of the chart height, only climbs
    let v = .08 + .72 * Math.pow(i / (n - 1), 1.6) + (hash(i + seed) - .5) * .04;
    if (moon && i > n * .6) v += moon * Math.pow((i - n * .6) / (n * .4), 2) * 1.6;
    return v;
  };
  const top = [];
  for (let i = 0; i < shown; i++) {
    const a = val(i - 1 < 0 ? 0 : i - 1) - .03, b = val(i) + (i === shown - 1 ? .03 * Math.sin(t * 8) : 0);
    const cx = x + 30 + i * cw + cw / 2, y0 = y + h - 20 - a * (h - 60), y1 = y + h - 20 - b * (h - 60);
    inkLine([[cx, y0 + cw * .4], [cx, y1 - cw * .5]], sw * .6, TK.led, 'inkfine', 0);
    paint(rectPts(cx - cw * .32, y1, cw * .64, Math.max(6, y0 - y1)), { wash: TK.green, fill: TK.greenDk, fillOp: 60, tex: .4, ink: PAL.ink, sw: sw * .4 });
    top.push([cx, y1 - cw * .6]);
  }
  if (top.length > 1) {                                                         // the trend arrow
    const L = top[top.length - 1], P0 = top[top.length - 2], d = Math.hypot(L[0] - P0[0], L[1] - P0[1]) || 1, ux = (L[0] - P0[0]) / d, uy = (L[1] - P0[1]) / d, s = 26 * sw * (1 + moon);
    inkLine(top, 2 * sw * (1 + moon * .6), TK.yellow, 'ink', .4);
    paint([[L[0] + ux * s * 1.6, L[1] + uy * s * 1.6], [L[0] - uy * s, L[1] + ux * s], [L[0] + uy * s, L[1] - ux * s]], { wash: TK.yellow, ink: PAL.ink, sw: sw * .6 });
  }
}

// ---------- characters ----------
const sleeve = (u, sw, hand) => {                   // arm hook: black sleeve over the arm, clay hand at the tip
  paint(rectPts(-2.3 * u, -.58 * u, 1.85 * u, 1.16 * u, u * .04), { wash: TK.soot, fill: TK.sootLt, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .7 });
  inkLine([[-.5 * u, -.58 * u], [-.5 * u, .58 * u]], sw * .5, TK.sootLt, 'inkfine', 0);
  if (hand) hand(u, sw);
};
function ceoClawd(x, y, u, o = {}) {
  const user = o.draw, click = o.click || 0;
  const clicker = (u, sw) => {
    paint(rrPts(-.3 * u, -.9 * u, .8 * u, 1.8 * u, .3 * u), { wash: TK.sootLt, ink: PAL.ink, sw: sw * .5 });
    paint(ellPts(.1 * u, -.45 * u, .2 * u, .2 * u, 8), { wash: click > .1 ? '#FF3A3A' : TK.emberDk, ink: null });
    if (click > .1) glowAt(.1 * u, -.45 * u, u * .9 * click, '#FF3A3A', 120);
  };
  clawd(x, y, u, {
    mouth: 'smile', dk: '#3E5A8C', ...o,
    armL: (uu, sw) => sleeve(uu, sw, o.armL),
    armR: (uu, sw) => sleeve(uu, sw, o.armR || (o.noClicker ? null : clicker)),
    draw: (u, sw) => {
      // the turtleneck: lower body in black knit, a rolled collar with ribbing
      paint(rectPts(-5.08 * u, -3.55 * u, 10.16 * u, 1.62 * u, u * .03), { wash: TK.soot, fill: TK.sootLt, fillOp: 70, tex: .6, border: .5, ink: PAL.ink, sw: sw * .8 });
      paint(rrPts(-5.15 * u, -4.05 * u, 10.3 * u, .9 * u, .4 * u), { wash: '#2E2829', fill: TK.sootLt, fillOp: 90, tex: .6, ink: PAL.ink, sw: sw * .7 });
      for (let i = -9; i <= 9; i++) inkLine([[i * .52 * u, -3.85 * u], [i * .52 * u, -3.25 * u]], sw * .3, '#5A5255', 'inkfine', 0);
      for (let i = -4; i <= 4; i++) inkLine([[i * 1.1 * u, -3 * u], [i * 1.1 * u, -2.1 * u]], sw * .25, '#3A3336', 'inkfine', 0);
      // headset: band over the top, ear piece, boom mic to the mouth corner
      inkLine([[-5 * u, -6.3 * u], [-3.6 * u, -8.25 * u], [0, -8.45 * u], [3.6 * u, -8.25 * u], [5 * u, -6.3 * u]], sw * .6, TK.sootLt, 'ink', .5);
      paint(rrPts(-5.55 * u, -6.9 * u, .8 * u, 1.4 * u, .3 * u), { wash: TK.soot, ink: PAL.ink, sw: sw * .5 });
      inkLine([[-5.1 * u, -5.7 * u], [-4.2 * u, -4.6 * u], [-2.1 * u, -4.35 * u]], sw * .55, TK.sootLt, 'ink', .6);
      paint(ellPts(-1.85 * u, -4.35 * u, .32 * u, .26 * u, 10), { wash: TK.soot, ink: null });
      if (user) user(u, sw);
    }
  });
}
function agentBot(x, y, s, t, o = {}) {
  const m = move(o.dance || 'idle', t, o.seed || 0), n = o.n ?? 1, user = o.draw;
  const hire = o.hire ? (u, sw) => {
    push(); rotate(o.aR ?? 1); clawd(.4 * u, 3.4 * u, u * .38, { col: '#7A93D8', dk: '#4A62A8', lt: '#B5C6F0', noShadow: true, aL: 1.3, aR: 1.3, eyes: 'scared', mouth: 'o', seed: n + 3 }); pop();
  } : null;
  clawd(x + m.dx * s, y, s, {
    ...m, col: '#6F8BE0', dk: '#3D55A8', lt: '#B5C6F0', seed: n, ...(o.hire ? { aR: 1 } : {}), ...o,
    armR: o.armR || hire,
    draw: (u, sw) => {
      inkLine([[-2.6 * u, -2.2 * u], [-.4 * u, -3.4 * u]], sw * .5, TK.ember, 'inkfine', 0);
      inkLine([[2.6 * u, -2.2 * u], [.4 * u, -3.4 * u]], sw * .5, TK.ember, 'inkfine', 0);
      paint(rrPts(-1.35 * u, -3.55 * u, 2.7 * u, 1.6 * u, .2 * u), { wash: TK.cream, ink: PAL.ink, sw: sw * .45 });
      paint(rectPts(-1.35 * u, -3.55 * u, 2.7 * u, .45 * u), { wash: TK.blue, ink: null });
      if (user) user(u, sw);
    }
  });
  if (s >= 9 && !o.rot) {
    const bx = x + m.dx * s, sy = 1 - (o.sq ?? m.sq) - (o.take || 0), by = y + (o.dy ?? m.dy) * s;
    letter('AGENT', bx, by - 3.33 * s * sy, .34 * s, TK.cream, { font: ruFont(.34 * s), ink: false });
    letter('#' + n, bx, by - 2.55 * s * sy, .78 * s, TK.soot, { font: ruFont(.78 * s), ink: false });
  }
}

// ---------- UI ----------
function limitBar(x, y, w, v, o = {}) {
  v = clamp(v); const h = o.h || w * .085, sw = clamp(w / 600, .5, 1.3), grey = o.grey;
  const col = grey ? TK.ash : (o.col || (v > .5 ? mixCol(TK.orange, TK.green, (v - .5) * 2) : mixCol(TK.ember, TK.orange, v * 2)));
  if (o.glow) glowAt(x + w * v, y + h / 2, h * 2.5, col, 100 * o.glow);
  const ls = h * .55;
  letter(o.label ?? 'НЕДЕЛЬНЫЙ ЛИМИТ', x + 4, y - ls * .75, ls, grey ? TK.ash : TK.cream, { font: ruFont(ls), align: 'left' });
  letter(Math.round(v * 100) + '%', x + w, y - ls * .75, ls * 1.15, col, { font: ruFont(ls * 1.15), align: 'right' });
  paint(rrPts(x, y, w, h, h * .3, 1.5), { wash: TK.soot, ink: grey ? TK.ash : TK.cream, sw: sw * 1.2 });
  const fw = (w - h * .3) * v;
  if (fw > h * .3) {
    paint(rrPts(x + h * .15, y + h * .15, fw, h * .7, h * .2), { wash: col, fill: grey ? TK.sootLt : mixCol(col, TK.soot, .35), fillOp: 90, tex: .6, border: .4, ink: null });
    if (!grey) inkLine([[x + h * .35, y + h * .32], [x + h * .15 + fw - h * .2, y + h * .32]], sw * .7, '#FFFFFF', 'inkfine', 0);
  }
  for (let q = 1; q < 4; q++) inkLine([[x + w * q / 4, y + h * .78], [x + w * q / 4, y + h]], sw * .5, TK.ash, 'inkfine', 0);
  if (o.burn > .02 && fw > 4) fire(x + h * .15 + fw, y + h * .6, h * 2.2, h * 3, T, { k: o.burn, seed: 9 });
}
function counter(x, y, size, value, o = {}) {
  const s = o.pad ? fmtNum(value).replace(/ /g, '').padStart(o.pad, '0').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : fmtNum(value), bw = size * .72, gw = size * .3, col = o.col || TK.yellow, sw = clamp(size / 80, .5, 1.3);
  let tw = 0; for (const c of s) tw += c === ' ' ? gw : bw;
  let cx = (o.align === 'left' ? x : x - tw / 2);
  const units = ease(clamp((frac(value) - .55) / .45)), digits = s.replace(/ /g, '').length;
  let di = 0;
  for (const c of s) {
    if (c === ' ') { cx += gw; continue; }
    const p = digits - 1 - di++, pow = Math.pow(10, p), lower = value % pow;
    const roll = p === 0 ? units : (lower >= pow - 1 ? units : 0), d = +c;
    paint(rrPts(cx + bw * .05, y - size * .62, bw * .9, size * 1.24, size * .1), { wash: o.box || TK.soot, fill: TK.sootLt, fillOp: 80, tex: .5, border: .5, ink: PAL.ink, sw });
    inkLine([[cx + bw * .08, y], [cx + bw * .92, y]], sw * .4, TK.sootLt, 'inkfine', 0);
    const f = ruFont(size);
    letter(String(d), cx + bw / 2, y - roll * size * .38, size, col, { font: f, alpha: 1 - roll, ink: false });
    if (roll > .02) letter(String((d + 1) % 10), cx + bw / 2, y + (1 - roll) * size * .38, size, col, { font: f, alpha: roll, ink: false });
    cx += bw;
  }
  if (o.suffix) letter(o.suffix, cx + size * .25, y, size * .6, col, { font: ruFont(size * .6), align: 'left' });
}
function uiCard(x, y, w, h, o = {}) {
  const k = o.k ?? 1; if (k < .01) return;
  y -= (1 - easeOut(k)) * (h + 60);
  const acc = o.accent || TK.blue, pad = h * .14, ic = h * .5, sw = clamp(w / 700, .5, 1.1);
  paint(rrPts(x + 10, y + 14, w, h, h * .18), { fill: PAL.ink, fillOp: 90, bleed: .2, tex: .3, ink: null });            // soft shadow
  paint(rrPts(x, y, w, h, h * .18, 1), { wash: '#FBF8F2', ink: PAL.ink, sw });
  const icx = x + pad + ic / 2, icy = y + h / 2;
  if (o.icon === 'token') token(icx, icy, ic * .48, {});
  else {
    paint(rrPts(icx - ic / 2, icy - ic / 2, ic, ic, ic * .24), { wash: o.icon === 'bell' ? acc : PAL.clay, ink: PAL.ink, sw: sw * .7 });
    if (o.icon === 'bell') paint([[icx - ic * .22, icy + ic * .15], [icx - ic * .16, icy - ic * .2], [icx, icy - ic * .28], [icx + ic * .16, icy - ic * .2], [icx + ic * .22, icy + ic * .15]], { wash: TK.cream, ink: null, curv: .4 });
    else for (const ex of [-.18, .12]) paint(rectPts(icx + ex * ic, icy - ic * .16, ic * .08, ic * .2), { wash: PAL.ink, ink: null });
  }
  const tx = x + pad * 2 + ic, ts = h * .2, bs = h * .15;
  if (o.title) letter(o.title, tx, y + pad + ts * .5, ts, '#1E1E24', { font: ruFont(ts), align: 'left', ink: false });
  const body = o.body == null ? [] : Array.isArray(o.body) ? o.body : [o.body];
  body.forEach((line, i) => letter(line, tx, y + pad + ts * 1.4 + bs * (.6 + i * 1.3), bs, '#55555F', { font: `${bs}px "Helvetica Neue", Arial, sans-serif`, align: 'left', ink: false }));
  if (o.time) letter(o.time, x + w - pad, y + pad + ts * .4, bs, '#8A8A95', { font: `${bs}px "Helvetica Neue", Arial, sans-serif`, align: 'right', ink: false });
}
function slide(x, y, w, h, o = {}) {
  const sw = clamp(w / 800, .5, 1.4), k = o.k ?? 1, bg = o.bg || '#FBF8F2';
  paint(rectPts(x - w * .02, y - w * .02, w * 1.04, h + w * .04, 1), { wash: TK.soot, ink: null });
  paint(rectPts(x, y, w, h, 1), { wash: bg, fill: '#E9E2D6', fillOp: 60, tex: .4, ink: null });
  const ts = h * .1;
  if (o.title) letter(o.title, x + w * .06, y + h * .12, ts, '#1E1E24', { font: ruFont(ts), align: 'left', ink: false });
  const gx = x + w * (o.bullets ? .52 : .12), gy = y + h * .24, gw = w * (o.bullets ? .42 : .76), gh = h * .66;
  if (o.bullets) o.bullets.forEach((b, i) => {
    const by = y + h * .3 + i * h * .13, bs = h * .065;
    paint(ellPts(x + w * .07, by, bs * .22, bs * .22, 8), { wash: TK.orange, ink: null });
    letter(b, x + w * .1, by, bs, '#33333A', { font: ruFont(bs), align: 'left', ink: false });
  });
  if (o.graph === 'up') {
    inkLine([[gx, gy], [gx, gy + gh], [gx + gw, gy + gh]], sw * .9, '#33333A', 'ink', 0);
    const pts = []; for (let i = 0; i <= 10; i++) { const f = i / 10 * k; pts.push([gx + f * gw * .92, gy + gh - Math.pow(f, 2.2) * gh * .92 + (i % 2 ? 6 : -6) * sw]); }
    if (k > .05) {
      inkLine(pts, 3.4 * sw, TK.orange, 'ink', .4);
      const L = pts[pts.length - 1], a = Math.atan2(L[1] - pts[pts.length - 2][1], L[0] - pts[pts.length - 2][0]), s = 22 * sw;
      paint([[L[0] + Math.cos(a) * s * 1.4, L[1] + Math.sin(a) * s * 1.4], [L[0] + Math.cos(a + 2.2) * s, L[1] + Math.sin(a + 2.2) * s], [L[0] + Math.cos(a - 2.2) * s, L[1] + Math.sin(a - 2.2) * s]], { wash: TK.orange, ink: null });
    }
  } else if (o.graph === 'loop') {
    const cx = gx + gw / 2, cy = gy + gh / 2, r = Math.min(gw, gh) * .38, spin = (o.t ?? T) * .6, labs = o.loop || ['GPU', 'ТОКЕНЫ', 'АГЕНТЫ', 'ЗАДАЧИ'];
    for (let i = 0; i < 4; i++) {
      const a0 = spin + i / 4 * TAU + .25, a1 = a0 + TAU / 4 - .5, arc = [];
      for (let q = 0; q <= 8; q++) { const a = lerp(a0, a1, q / 8 * k); arc.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
      inkLine(arc, 3 * sw, TK.orange, 'ink', .5);
      const e = a0 + (a1 - a0) * k, hx = cx + Math.cos(e) * r, hy = cy + Math.sin(e) * r, s = 16 * sw;
      paint([[hx - Math.sin(e) * s * 1.4, hy + Math.cos(e) * s * 1.4], [hx + Math.cos(e) * s, hy + Math.sin(e) * s], [hx - Math.cos(e) * s, hy - Math.sin(e) * s]], { wash: TK.orange, ink: null });
      const la = spin + i / 4 * TAU, ls = r * .2;
      letter(labs[i % labs.length], cx + Math.cos(la) * r * 1.02, cy + Math.sin(la) * r * 1.02, ls, '#1E1E24', { font: ruFont(ls), stroke: bg, ink: false });
    }
  }
}

// ---------- punk lettering ----------
function stamp(txt, x, y, size, t, t0, o = {}) {
  const age = t - t0; if (age < 0) return;
  const k = age < .12 ? lerp(2.3, 1, easeOut(age / .12)) : 1 + (o.punch ?? .06) * pulse(t, 7) - .04 * Math.exp(-(age - .12) * 18);
  const sz = size * k, rot = o.rot ?? -.08, col = o.col || TK.ember, font = ruFont(sz);
  const tw = textW(txt, font), bw = tw + sz * .7, bh = sz * 1.45, sw = clamp(sz / 70, .6, 2.2);
  if (o.border !== false) {
    paint(rotPts(rrPts(x - bw / 2, y - bh / 2, bw, bh, sz * .18, sz * .02), x, y, rot), { ink: col, sw: sw * 1.6 });
    paint(rotPts(rrPts(x - bw / 2 + sz * .12, y - bh / 2 + sz * .12, bw - sz * .24, bh - sz * .24, sz * .12, sz * .02), x, y, rot), { ink: col, sw: sw * .7 });
  }
  if (age < .2) paint(rotPts(rectPts(x - bw * .55, y - bh * .6, bw * 1.1, bh * 1.2), x, y, rot), { fill: col, fillOp: 80 * (1 - age / .2), bleed: .3, tex: .3, ink: null });
  for (let i = 0; i < 9; i++) {                                                  // ink spatter from the slam
    const a = hash(i + t0 * 7) * TAU, d = (.55 + hash(i + 3 + t0) * .35) * bw * clamp(age / .1), r = sz * (.03 + hash(i + 5) * .06);
    paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .45, r, r, 7), { wash: col, washOp: 220, ink: null });
  }
  letter(txt, x, y + sz * .04, sz, col, { font, rot, ink: false, alpha: .93 });
}
const PUNK_FONTS = [RU_FONT, '"Arial Black", Impact, sans-serif', 'Georgia, "Times New Roman", serif', '"Courier New", monospace', 'Impact, "Arial Narrow", sans-serif'];
function punkText(txt, x, y, size, t, t0, o = {}) {
  const age = t - t0; if (age < 0) return;
  const cols = o.cols || [[TK.cream, TK.soot], [TK.yellow, TK.soot], [TK.soot, TK.cream], [TK.ember, TK.cream], [TK.orange, TK.soot], ['#FFFFFF', TK.ember]];
  const chars = [...txt], seed = o.seed || 0, hb = Math.floor(bpOf(t) * 2), step = o.step ?? .035;
  const spec = chars.map((c, i) => {
    const s = size * (.82 + hash(i * 3 + seed) * .36), font = `${s}px ${PUNK_FONTS[Math.floor(hash(i * 5 + seed + 1) * PUNK_FONTS.length)]}`;
    return { c, s, font, w: c === ' ' ? size * .4 : textW(c, font) + size * .2 };
  });
  const total = spec.reduce((a, b) => a + b.w, 0);
  let cx = x - total / 2;
  spec.forEach((L, i) => {
    const la = age - i * step, mid = cx + L.w / 2; cx += L.w; if (L.c === ' ' || la < 0) return;
    const pop = la < .1 ? lerp(1.6, 1, la / .1) : 1, j = hash(i * 11 + hb * 7 + seed), rot = (j - .5) * .32, dy = (hash(i * 5 + hb * 3) - .5) * size * .12;
    const [bg, fg] = cols[Math.floor(hash(i * 7 + seed + 2) * cols.length)], bw = L.w * .98 * pop, bh = L.s * 1.2 * pop;
    paint(rotPts([[mid - bw / 2 + jit(3), y + dy - bh / 2], [mid + bw / 2, y + dy - bh / 2 + jit(4)], [mid + bw / 2 + jit(3), y + dy + bh / 2], [mid - bw / 2, y + dy + bh / 2 + jit(4)]], mid, y + dy, rot * .7),
      { wash: bg, fill: mixCol(bg, TK.soot, .3), fillOp: 50, tex: .7, border: .4, ink: PAL.ink, sw: clamp(size / 90, .4, 1) });
    letter(L.c, mid, y + dy + L.s * .05, L.s * pop, fg, { font: L.font.replace(/^[\d.]+px/, (L.s * pop) + 'px'), rot, ink: false });
  });
}

// ---------- the pit ----------
const fist = col => (u, sw) => paint(rrPts(-.2 * u, -.65 * u, 1.2 * u, 1.3 * u, .4 * u), { wash: col, ink: PAL.ink, sw: sw * .6 });
function crowdMosh(t, o = {}) {
  const gy = o.y ?? 1070, k = o.k ?? 1, n = o.n || 11, bp2 = bpOf(t) * 2;
  if (o.back !== false) {                                                        // back row: one soot silhouette with raised fists
    const pts = [[-60, gy + 200]];
    for (let i = 0; i <= 24; i++) {
      const bx = -60 + i * (W + 120) / 24, hop = Math.abs(Math.sin((bp2 + hash(i) * 2) * Math.PI * .5)) * 26 * k, hy = gy - 250 - hop - hash(i + 40) * 40;
      pts.push([bx - 30, hy + 20], [bx - 26, hy - 20]);
      if (i % 2) { const fy = hy - 90 - hop; pts.push([bx - 8, hy - 24], [bx - 12, fy], [bx + 12, fy - 6], [bx + 8, hy - 24]); }
      pts.push([bx + 26, hy - 22], [bx + 30, hy + 18]);
    }
    pts.push([W + 60, gy + 200]);
    paint(pts, { wash: '#2E2224', fill: TK.emberDk, fillOp: 110, tex: .5, border: .3, ink: TK.emberDk, sw: .6 });
  }
  for (let i = 0; i < n; i++) {
    const ph = hash(i + 70), hop = Math.abs(Math.sin((bp2 + ph * 2) * Math.PI * .5)), u = 14 + hash(i + 71) * 4;
    const x = (i + .5) * W / n + (hash(i + 72) - .5) * 80, agent = i % 3 === 1;
    const up = 1.5 + .35 * Math.sin((bp2 + ph) * Math.PI), col = agent ? '#6F8BE0' : PAL.clay;
    clawd(x, gy - 10 + (i % 2) * 26, u, {
      dy: -hop * 3.2 * k, sq: (1 - hop) * .12 * k, rot: (hash(i + Math.floor(bp2)) - .5) * .2 * k,
      aL: up + (i % 2 ? .3 : 0), aR: up - (i % 2 ? 0 : .3), armL: fist(col), armR: fist(col), noShadow: true,
      eyes: ['angry', 'happy', 'x', 'normal'][i % 4], mouth: i % 2 ? 'O' : 'grin', seed: i,
      ...(agent ? { col, dk: '#3D55A8', lt: '#B5C6F0' } : {})
    });
  }
}

// ---------- wipe icon: a burning token spinning through the brush wipe ----------
window.WIPE_ICON = (x, y, r, o = {}) => {
  const g = o.glow ?? 1;
  fire(x, y + r * .75, r * 2.4, r * 3.4 * g, T, { seed: 5, n: 5 });
  token(x, y, r * .72, { rot: o.rot || 0, glow: g, burn: .15 });
};
