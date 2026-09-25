// magical.js: the shared kit for "IT GIRL", a 90s magical-girl anime homage (sparkles, moon, transformations).
// Loaded after core/kremlin/clawd/cast/props. Re-themes the shared palette tokens and adds:
//
//   sailorClawd(x, y, u, o)   Clawd in the magical-girl outfit: odango buns + streaming pigtails, crescent tiara,
//                             pleated sailor skirt, big bow, white gloves. o = any clawd() option, plus
//                             o.wand (true = moon wand in the right hand), o.tails (pigtail swing phase override),
//                             o.skirt / o.bow colours, o.outfit:false (plain Clawd with just the hair, for "before").
//   moonWand(u, sw)           arm hook: pink wand with a gold crescent and a heart gem (use as armR/armL).
//   crescent(cx, cy, r, rot, col, o)   a crescent moon shape.
//   sparkle(x, y, r, k, col)  4-point twinkle, k 0..1 pop (it grows then shrinks).
//   sparkleField(t, n, o)     screen-wide drifting twinkles (o.seed, o.col, o.area [x, y, w, h]).
//   bigMoon(x, y, r, t, o)    the huge anime moon with craters and a glow.
//   nightCity(t, o)           full-frame night sky + city silhouette with lit windows + big moon (o.moon [x, y, r], o.sky, o.horizon).
//   dreamSky(t, o)            full-frame pastel pink→lilac gradient-ish wash with stars and soft clouds.
//   ribbonSwirl(cx, cy, t, o) transformation ribbons spiralling around a point (o.r, o.n, o.k 0..1 progress, o.cols).
//   spell(txt, x, y, size, t, t0, o)   glitter lettering that spells a word one letter per beat/half-beat
//                             (o.step seconds per letter, default BEAT; o.cols per-letter colours).
//   lips(x, y, s, t, o)       a gossiping pair of lips (a hater): o.talk 0..1 flap speed, o.col, o.flip.
//   blackCat(x, y, s, t, o)   black cat with a crescent on the forehead (the mascot). o.eyes 'normal'|'happy'|'wide', o.sit.
//   tuxResearcher(x, y, s, o) the Researcher as a masked caped gentleman in a top hat (researcher() options + o.rose).
//   heartBeam(x0, y0, x1, y1, w, k, col)   a magic beam of light with heart particles.

// ---------- theme ----------
Object.assign(KP, {
  ruby: '#E8508A', rubyDk: '#9C2F6B', rubyLt: '#FFB3D1', gold: '#F2C84B', goldLt: '#FFE9A8', goldDk: '#B98A1E', night: '#241A4A'
});
for (const k of Object.keys(HAT_SWAP)) delete HAT_SWAP[k];
WIPE_COLS.splice(0, WIPE_COLS.length, ['#C2527E', '#F48FB1'], ['#7C5CC4', '#9FD3F5'], ['#E8508A', '#FFE9A8'], ['#7C5CC4', '#F48FB1']);   // pastel brush wipes
const MG = {
  pink: '#F48FB1', pinkDk: '#C2527E', hot: '#E8508A', lilac: '#B79CE8', lilacDk: '#7C5CC4', sky: '#9FD3F5', navy: '#241A4A',
  blue: '#3A6FD8', blueDk: '#23489A', red: '#E8364F', gold: '#F2C84B', goldLt: '#FFE9A8', hair: '#F6C95B', hairDk: '#C9912F',
  cream: '#FFF7EE', mint: '#8FE0C8', glove: '#FFFDF8'
};

// ---------- small shapes ----------
function crescent(cx, cy, r, rot = 0, col = MG.gold, o = {}) {
  const pts = [], n = 16;
  for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + i / n * Math.PI; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }                 // outer arc (right half)
  for (let i = n; i >= 0; i--) { const a = -Math.PI / 2 + i / n * Math.PI; pts.push([Math.cos(a) * r * .45 + r * .05, Math.sin(a) * r * .92]); } // inner arc
  const c = Math.cos(rot), s = Math.sin(rot);
  paint(pts.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]), { wash: col, fill: o.fill || MG.hairDk, fillOp: o.fillOp ?? 60, tex: .5, ink: o.ink === undefined ? PAL.ink : o.ink, sw: o.sw ?? clamp(r / 40, .4, 1.2) });
}
function sparkle(x, y, r, k = 1, col = MG.cream) {
  const p = k <= 0 || k >= 1 ? (k >= 1 ? 1 : 0) : Math.sin(k * Math.PI); if (p < .03) return;
  paint(ellPts(x, y, r * 1.1 * p, r * 1.1 * p, 12), { fill: col, fillOp: 70, bleed: .3, tex: .2, ink: null });
  paint(starPts(x, y, r * p, .22, 4), { wash: col, ink: null });
}
function sparkleField(t, n = 30, o = {}) {
  const [ax, ay, aw, ah] = o.area || [-100, -100, W + 200, H + 200], seed = o.seed || 0;
  for (let i = 0; i < n; i++) {
    const per = 1.2 + hash(i + seed) * 1.6, ph = frac(t / per + hash(i + seed + 40));
    const x = ax + hash(i + seed + 1) * aw + Math.sin(t * .4 + i) * 12, y = ay + hash(i + seed + 2) * ah - ph * 30;
    sparkle(x, y, (8 + hash(i + seed + 3) * 16) * (o.scale || 1), ph, o.col || [MG.cream, MG.goldLt, MG.pink, MG.sky][i % 4]);
  }
}
function heartBeam(x0, y0, x1, y1, w, k = 1, col = MG.pink) {
  if (k < .02) return;
  const x2 = lerp(x0, x1, k), y2 = lerp(y0, y1, k), d = Math.hypot(x2 - x0, y2 - y0) || 1, nx = -(y2 - y0) / d * w, ny = (x2 - x0) / d * w;
  paint([[x0 + nx * .3, y0 + ny * .3], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x0 - nx * .3, y0 - ny * .3]], { fill: col, fillOp: 150, bleed: .2, tex: .3, ink: null });
  paint([[x0 + nx * .1, y0 + ny * .1], [x2 + nx * .35, y2 + ny * .35], [x2 - nx * .35, y2 - ny * .35], [x0 - nx * .1, y0 - ny * .1]], { wash: MG.cream, washOp: 220, ink: null });
  for (let i = 0; i < 6; i++) { const f = frac(i / 6 + T * 1.7) * k; paint(heartPts(lerp(x0, x1, f) + nx * Math.sin(i * 2.3) * 1.2, lerp(y0, y1, f) + ny * Math.sin(i * 2.3) * 1.2, w * .45), { wash: i % 2 ? MG.hot : MG.cream, ink: PAL.ink, sw: .5 }); }
}

// ---------- the outfit ----------
KHAT.odango = (u, sw) => {
  const sway = Math.sin(T * 3.1) * .35;
  for (const s of [-1, 1]) {
    // pigtail streamer from the bun, flowing out and down past the body, tip swinging
    const bx = s * 3.3 * u, by = -9.2 * u, tail = [];
    for (let i = 0; i <= 8; i++) { const f = i / 8; tail.push([bx + s * (1.2 + f * 4.2 + Math.sin(f * 3 + T * 3 + s) * .5 + sway * f * s) * u, by + (f * 9.8) * u]); }
    const hw = i => (.85 - i * .075) * u, L = tail.map(([x, y], i) => [x - s * hw(i), y]), R = tail.map(([x, y], i) => [x + s * hw(i), y]).reverse();
    paint([...L, ...R], { wash: MG.hair, fill: MG.hairDk, fillOp: 70, tex: .6, border: .5, ink: PAL.ink, sw: sw * .6, curv: .4 });
    paint(ellPts(bx, by, 1.55 * u, 1.45 * u, 14), { wash: MG.hair, fill: MG.hairDk, fillOp: 60, tex: .6, ink: PAL.ink, sw: sw * .7 });
    inkLine([[bx - .8 * u, by - .2 * u], [bx, by - .7 * u], [bx + .7 * u, by + .1 * u]], sw * .4, MG.hairDk, 'inkfine', .5);
  }
  // bangs + crescent tiara across the brow
  paint([[-5.1 * u, -7.7 * u], [-5 * u, -8.6 * u], [0, -9.2 * u], [5 * u, -8.6 * u], [5.1 * u, -7.7 * u], [3.4 * u, -7.4 * u], [2.4 * u, -7.9 * u], [1.2 * u, -7.3 * u], [0, -7.9 * u], [-1.2 * u, -7.3 * u], [-2.4 * u, -7.9 * u], [-3.4 * u, -7.4 * u]], { wash: MG.hair, fill: MG.hairDk, fillOp: 50, tex: .5, ink: PAL.ink, sw: sw * .6, curv: .2 });
  inkLine([[-4.6 * u, -8.35 * u], [0, -8.85 * u], [4.6 * u, -8.35 * u]], sw * 1.1, MG.gold, 'ink', .5);
  crescent(0, -8.9 * u, .75 * u, -Math.PI / 2, MG.gold, { sw: sw * .4 });
  paint(ellPts(0, -8.75 * u, .28 * u, .28 * u, 8), { wash: MG.red, ink: null });
};
function outfit(u, sw, o) {
  // pleated skirt flaring below the body
  const top = -2.9 * u, bot = -1.3 * u, sk = [[-5.1 * u, top], [5.1 * u, top], [6.2 * u, bot], [-6.2 * u, bot]];
  paint(sk, { wash: o.skirt || MG.blue, fill: MG.blueDk, fillOp: 70, tex: .6, ink: PAL.ink, sw: sw * .7 });
  for (let i = -4; i <= 4; i++) inkLine([[i * 1.05 * u, top + .1 * u], [i * 1.3 * u, bot - .1 * u]], sw * .35, MG.blueDk, 'inkfine', 0);
  inkLine([[-5.9 * u, bot - .35 * u], [5.9 * u, bot - .35 * u]], sw * .6, MG.cream, 'inkfine', 0);
  // sailor collar corners on the upper sides + big bow under the mouth
  for (const s of [-1, 1]) paint([[s * 5 * u, -6.2 * u], [s * 3.9 * u, -3.4 * u], [s * 5 * u, -3.1 * u]], { wash: o.skirt || MG.blue, ink: PAL.ink, sw: sw * .5 });
  const bc = o.bow || MG.red, by = -3.25 * u;
  paint([[0, by], [-1.9 * u, by - .9 * u], [-2.1 * u, by + .7 * u]], { wash: bc, fill: '#A31F3A', fillOp: 60, ink: PAL.ink, sw: sw * .6, curv: .2 });
  paint([[0, by], [1.9 * u, by - .9 * u], [2.1 * u, by + .7 * u]], { wash: bc, fill: '#A31F3A', fillOp: 60, ink: PAL.ink, sw: sw * .6, curv: .2 });
  for (const s of [-1, 1]) paint([[s * .2 * u, by], [s * .9 * u, by + 1.6 * u], [s * .3 * u, by + 1.4 * u]], { wash: bc, ink: PAL.ink, sw: sw * .4 });
  paint(ellPts(0, by, .5 * u, .45 * u, 10), { wash: MG.gold, ink: PAL.ink, sw: sw * .5 });
}
const glove = (u, sw) => paint(ellPts(.3 * u, 0, .75 * u, .75 * u, 12), { wash: MG.glove, ink: PAL.ink, sw: sw * .5 });
function moonWand(u, sw) {
  push(); rotate(-1.1);
  paint(rrPts(-.2 * u, -.25 * u, 4.6 * u, .5 * u, .25 * u), { wash: MG.pink, fill: MG.pinkDk, fillOp: 50, ink: PAL.ink, sw: sw * .5 });
  paint(ellPts(4.9 * u, 0, 1.3 * u, 1.3 * u, 14), { fill: MG.goldLt, fillOp: 90 + 60 * pulse(T, 4), bleed: .3, tex: .2, ink: null });
  crescent(5.2 * u, 0, 1.1 * u, 0, MG.gold, { sw: sw * .5 });
  paint(heartPts(4.7 * u, 0, .55 * u), { wash: MG.hot, ink: PAL.ink, sw: sw * .4 });
  pop();
  glove(u, sw);
}
function sailorClawd(x, y, u, o = {}) {
  const user = o.draw;
  clawd(x, y, u, {
    hat: 'odango', mouth: 'smile', ...o,
    armL: o.armL || glove, armR: o.armR || (o.wand ? moonWand : glove),
    draw: (uu, sw) => { if (o.outfit !== false) outfit(uu, sw, o); if (user) user(uu, sw); }
  });
}

// ---------- backgrounds ----------
function bigMoon(x, y, r, t, o = {}) {
  paint(ellPts(x, y, r * 1.5, r * 1.5, 30), { fill: o.glow || MG.goldLt, fillOp: 70, bleed: .35, tex: .2, border: .1, ink: null });
  paint(ellPts(x, y, r, r, 36, 2), { wash: '#FFF3C9', fill: '#F2D98A', fillOp: 80, tex: .6, border: .5, ink: PAL.ink, sw: clamp(r / 200, .6, 1.4) });
  for (const [dx, dy, rr] of [[-.35, -.2, .18], [.25, .3, .13], [.3, -.35, .09], [-.1, .45, .1]]) paint(ellPts(x + dx * r, y + dy * r, rr * r, rr * r * .85, 14), { fill: '#E3C470', fillOp: 110, bleed: .15, tex: .5, ink: null });
}
function nightCity(t, o = {}) {
  paint(rectPts(-400, -400, W + 800, H + 800), { wash: o.sky || MG.navy, fill: MG.lilacDk, fillOp: 90, bleed: .1, tex: .6, border: .3, ink: null });
  paint(ellPts(W / 2, H * .9, W, H * .55, 30), { fill: MG.hot, fillOp: 60, bleed: .35, tex: .3, ink: null });           // city glow
  for (let i = 0; i < 40; i++) { const k = .5 + .5 * Math.sin(t * (1 + hash(i) * 2) + i); paint(starPts(hash(i + 3) * W, hash(i + 4) * H * .6, 3 + k * 5, .3, 4), { wash: MG.cream, washOp: 150 + 100 * k, ink: null }); }
  const [mx, my, mr] = o.moon || [1450, 300, 230]; if (mr > 0) bigMoon(mx, my, mr, t);
  const hz = o.horizon ?? 760;
  for (let layer = 0; layer < 2; layer++) {
    const col = layer ? '#1A1238' : '#3B2A6E', base = hz + layer * 60, pts = [[-400, H + 400]];
    for (let i = 0; i < 26; i++) {
      const x = -400 + i * 110, h = 120 + hash(i * 7 + layer * 31) * (layer ? 220 : 320) + (i % 7 === 3 && !layer ? 180 : 0);
      pts.push([x, base - h], [x + 100, base - h]);
      if (i % 7 === 3 && !layer) pts.push([x + 50, base - h - 90]);                                                    // a spire
    }
    pts.push([W + 400, H + 400]);
    paint(pts, { wash: col, fill: MG.navy, fillOp: 50, tex: .5, ink: layer ? null : PAL.ink, sw: .8 });
    if (!layer) for (let i = 0; i < 60; i++) {
      const bx = -300 + hash(i + 70) * (W + 600), by = hz - 40 - hash(i + 71) * 300, on = Math.sin(t * .7 + i * 3.3) > -.6;
      if (on) paint(rectPts(bx, by, 12, 16), { wash: i % 5 ? MG.goldLt : MG.pink, washOp: 220, ink: null });
    }
  }
}
function dreamSky(t, o = {}) {
  paint(rectPts(-400, -400, W + 800, H + 800), { wash: o.a || '#F9D6E8', fill: o.b || MG.lilac, fillOp: 70, bleed: .2, tex: .5, border: .3, ink: null });
  paint(ellPts(W * .3, H * .2, 900, 400, 26), { fill: MG.sky, fillOp: 60, bleed: .35, tex: .3, ink: null });
  paint(ellPts(W * .8, H * .75, 800, 380, 26), { fill: MG.pink, fillOp: 70, bleed: .35, tex: .3, ink: null });
  for (let i = 0; i < 5; i++) { const x = ((hash(i) * (W + 800) + t * (18 + i * 6)) % (W + 800)) - 400, y = 140 + i * 170; for (let k = 0; k < 3; k++) paint(ellPts(x + k * 90, y - (k % 2) * 30, 110, 60, 14, 3), { wash: MG.cream, washOp: 200, ink: null }); }
  sparkleField(t, o.n ?? 26, { seed: o.seed || 3 });
}
function ribbonSwirl(cx, cy, t, o = {}) {
  const n = o.n || 5, r = o.r || 420, k = o.k ?? 1, cols = o.cols || [MG.pink, MG.sky, MG.goldLt, MG.lilac, MG.mint];
  for (let j = 0; j < n; j++) {
    const pts = [];
    for (let i = 0; i <= 18; i++) { const f = i / 18 * k, a = j * TAU / n + f * 5 + t * 2.4, rr = r * (1 - f * .75); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .55 - (f - .5) * 260]); }
    if (pts.length > 2 && k > .05) inkLine(pts, 7, cols[j % cols.length], 'marker', .6);
  }
}

// ---------- lettering ----------
function spell(txt, x, y, size, t, t0, o = {}) {
  const step = o.step ?? BEAT, cols = o.cols || [MG.hot, MG.gold, MG.sky, MG.pink, MG.mint, MG.lilac], chars = [...txt];
  const gap = o.gap ?? size * .78, x0 = x - (chars.length - 1) * gap / 2;
  chars.forEach((c, i) => {
    const age = t - (t0 + i * step); if (age < 0) return;
    const bob = Math.sin((t - t0) * 6 + i) * size * .04;
    letter(c, x0 + i * gap, y + bob, size, cols[i % cols.length], { pop: age * 4, rot: (hash(i + 9) - .5) * .25, stroke: o.stroke ?? MG.navy, font: o.font });
    if (age < .5 && o.sparks !== false) sparkle(x0 + i * gap + size * .35, y - size * .45, size * .25, age / .5, MG.cream);
  });
}

// ---------- supporting cast ----------
function lips(x, y, s, t, o = {}) {
  const open = .15 + .85 * Math.abs(Math.sin(t * (6 + 10 * (o.talk ?? .7)) + (o.seed || 0))), col = o.col || MG.hot, sw = clamp(s / 30, .5, 1.4);
  push(); translate(x, y); if (o.flip) scale(-1, 1); if (o.rot) rotate(o.rot);
  paint([[-1.6 * s, 0], [-.8 * s, -.55 * s], [-.2 * s, -.4 * s], [0, -.5 * s], [.2 * s, -.4 * s], [.8 * s, -.55 * s], [1.6 * s, 0], [.6 * s, -.08 * s], [-.6 * s, -.08 * s]], { wash: col, fill: '#8E1F4E', fillOp: 50, tex: .5, ink: PAL.ink, sw, curv: .3 });
  paint(ellPts(0, .18 * s * open, 1.1 * s, .3 * s * open + .05 * s, 14), { wash: '#3A1030', ink: null });
  paint([[-1.6 * s, .05 * s], [-.6 * s, (.12 + .7 * open) * s], [.6 * s, (.12 + .7 * open) * s], [1.6 * s, .05 * s], [.6 * s, (.3 + .45 * open) * s], [-.6 * s, (.3 + .45 * open) * s]], { wash: col, fill: '#8E1F4E', fillOp: 50, tex: .5, ink: PAL.ink, sw, curv: .3 });
  paint(ellPts(-.7 * s, -.25 * s, .3 * s, .1 * s, 8), { wash: '#FFFFFF', washOp: 160, ink: null });
  pop();
}
function blackCat(x, y, s, t, o = {}) {
  const sw = clamp(s / 14, .5, 1.6), C = '#2A2238', bob = o.sit ? 0 : Math.abs(Math.sin(bpOf(t) * Math.PI)) * .4 * s;
  if (!o.noShadow) paint(ellPts(x, y + s * .1, s * 3, s * .5, 14), { fill: PAL.ink, fillOp: 70, bleed: .2, ink: null });
  push(); translate(x, y - bob); if (o.flip) scale(-1, 1);
  const tail = []; for (let i = 0; i <= 6; i++) { const f = i / 6; tail.push([2.2 * s + f * 2.2 * s, -1 * s - f * 3 * s + Math.sin(t * 3 + f * 3) * .6 * s * f]); }
  inkLine(tail, 5 * sw, C, 'marker', .6);
  paint(ellPts(0, -1.6 * s, 2.6 * s, 1.7 * s, 18), { wash: C, fill: MG.lilacDk, fillOp: 40, tex: .5, ink: PAL.ink, sw });
  for (const lx of [-1.4, -.4, .6, 1.5]) paint(rrPts(lx * s - .35 * s, -1 * s, .7 * s, 1 * s, .3 * s), { wash: C, ink: PAL.ink, sw: sw * .6 });
  const hx = -1.9 * s, hy = -3.6 * s;
  for (const e of [-1, 1]) paint([[hx + e * 1.5 * s, hy - .6 * s], [hx + e * 1.3 * s, hy - 2.4 * s], [hx + e * .2 * s, hy - 1.3 * s]], { wash: C, ink: PAL.ink, sw: sw * .7 });
  paint(ellPts(hx, hy, 1.8 * s, 1.5 * s, 18), { wash: C, fill: MG.lilacDk, fillOp: 40, tex: .5, ink: PAL.ink, sw });
  crescent(hx, hy - .85 * s, .45 * s, -Math.PI / 2, MG.gold, { ink: null });
  for (const e of [-1, 1]) {
    const ex = hx + e * .65 * s, ey = hy + .05 * s;
    if (o.eyes === 'happy') inkLine([[ex - .35 * s, ey + .15 * s], [ex, ey - .2 * s], [ex + .35 * s, ey + .15 * s]], sw, MG.goldLt, 'ink', .3);
    else { paint(ellPts(ex, ey, (o.eyes === 'wide' ? .5 : .38) * s, (o.eyes === 'wide' ? .55 : .42) * s, 12), { wash: MG.goldLt, ink: null }); paint(ellPts(ex, ey, .1 * s, .32 * s, 8), { wash: PAL.ink, ink: null }); }
  }
  for (const e of [-1, 1]) inkLine([[hx + e * .9 * s, hy + .6 * s], [hx + e * 2.4 * s, hy + .4 * s]], sw * .4, MG.cream, 'inkfine', 0);
  pop();
}
function tuxResearcher(x, y, s, o = {}) {
  const user = o.draw;
  researcher(x, y, s, {
    coat: '#2C2440', pants: '#1E1830', shirt: MG.cream, bowtie: false, eyes: o.eyes || 'dot', ...o,
    handR: o.rose ? (ss, sw) => { push(); rotate(-.6); inkLine([[0, 0], [2.2 * ss, 0]], sw * .8, '#3E7A3A', 'ink', 0); paint(ellPts(2.6 * ss, 0, .6 * ss, .5 * ss, 12), { wash: MG.red, fill: '#8E1F33', fillOp: 60, ink: PAL.ink, sw: sw * .6 }); pop(); } : o.handR,
    draw: (ss, sw) => {
      // cape behind the shoulders, domino mask, top hat
      for (const e of [-1, 1]) paint([[e * 1.9 * ss, -8.2 * ss], [e * 3.6 * ss, -1.2 * ss], [e * 2.5 * ss, -2.1 * ss]], { wash: MG.red, fill: '#8E1F33', fillOp: 60, ink: PAL.ink, sw: sw * .5 });   // cape lining
      paint([[-2.4 * ss, -11.3 * ss], [0, -11 * ss], [2.4 * ss, -11.3 * ss], [2.1 * ss, -10.2 * ss], [.5 * ss, -10.3 * ss], [0, -10.6 * ss], [-.5 * ss, -10.3 * ss], [-2.1 * ss, -10.2 * ss]], { wash: MG.cream, ink: PAL.ink, sw: sw * .5 });
      paint(rectPts(-1.7 * ss, -16.4 * ss, 3.4 * ss, 3.2 * ss), { wash: '#1E1830', ink: PAL.ink, sw: sw * .6 });
      paint(rectPts(-1.7 * ss, -14 * ss, 3.4 * ss, .6 * ss), { wash: MG.red, ink: null });
      paint(ellPts(0, -13.2 * ss, 2.9 * ss, .45 * ss, 16), { wash: '#1E1830', ink: PAL.ink, sw: sw * .6 });
      if (user) user(ss, sw);
    }
  });
}
