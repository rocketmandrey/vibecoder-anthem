// src/itgirl/ch/i04_chorus2.js: Chorus 2 (84.25–109.4) · neon concert, pink + lilac lasers.
// Arena with a heart-lightstick crowd and an LED wall that spells I-T-G-I-R-L, a rainbow transformation reprise,
// then the magical attack: heart beams on every "hit it", lips burst into sparkles and butterflies, bounce, selfie,
// IT GIRL freeze, and the masked gentleman's rose caught in her teeth.
(() => {
  const bT = n => OFF + n * BEAT;
  const BG = '#1B1038', BG2 = '#3A1F6E', CYAN = '#7FE3F0', FLOOR = '#2A1A52';
  const RAINBOW = ['#FF6B8B', '#FFA96B', '#FFE36B', '#8FE0A0', '#7FC8F5', '#B79CE8'];
  const LCOL = [MG.hot, MG.gold, MG.sky, MG.pink, MG.mint, MG.lilac];
  const SPELLS = [84.24, 86.24, 88.24, 90.24], LOFF = [0, .26, .62, 1.04, 1.32, 1.78];
  const HITS1 = [93.96, 94.66, 95.08, 95.50], HITS2 = [98.08, 98.60, 99.00, 99.52];

  // ---------------------------------------------------------------- arena kit
  function ledLetters(t, cx, cy, size, gap) {
    let s0 = null; for (const s of SPELLS) if (t >= s - .02) s0 = s; if (s0 == null) return;
    [...'ITGIRL'].forEach((c, i) => {
      const age = t - s0 - LOFF[i]; if (age < 0) return;
      const x = cx + (i - 2.5) * gap, hit = Math.exp(-age * 5);
      paint(ellPts(x, cy, size * (.5 + .25 * hit), size * (.55 + .25 * hit), 16), { fill: LCOL[i], fillOp: 70 + 90 * hit, bleed: .3, tex: .2, ink: null });
      letter(c, x, cy + Math.sin(t * 6 + i) * size * .03, size, LCOL[i], { pop: age * 4, rot: (hash(i + 9) - .5) * .2, stroke: MG.navy });
      if (age < .45) sparkle(x + size * .35, cy - size * .45, size * .3, age / .45, MG.cream);
    });
  }
  function laser(x0, y0, a, col, len = 2300) {
    const ex = x0 + Math.cos(a) * len, ey = y0 + Math.sin(a) * len, nx = -Math.sin(a), ny = Math.cos(a);
    paint([[x0 + nx * 4, y0 + ny * 4], [ex + nx * 46, ey + ny * 46], [ex - nx * 46, ey - ny * 46], [x0 - nx * 4, y0 - ny * 4]], { fill: col, fillOp: 60, bleed: .04, tex: .2, border: .1, ink: null });
    inkLine([[x0, y0], [ex, ey]], 1.6, mixCol(col, MG.cream, .55), 'marker', 0);
  }
  function lasers(t, k = 1) {
    const src = [[380, 110, .55], [1540, 110, Math.PI - .55], [700, 800, -1.2], [1220, 800, -1.94]];
    src.forEach(([x, y, base], i) => {
      for (let j = 0; j < (i < 2 ? 2 : 1); j++) {
        const a = base + Math.sin(t * (1.3 + .3 * j) + i * 1.7 + j) * .55 * k;
        laser(x, y, a, [MG.hot, MG.lilac, CYAN, MG.pink][(i + j) % 4]);
      }
    });
  }
  // o: { wall (bool), dim 0..1, floorDy, lk (laser amount) }
  function arena(t, o = {}) {
    paint(rectPts(-500, -500, W + 1000, H + 1000), { wash: BG, fill: BG2, fillOp: 90, bleed: .1, tex: .6, border: .3, ink: null });
    paint(ellPts(960, 260, 900, 420, 26), { fill: MG.lilacDk, fillOp: 90, bleed: .35, tex: .3, ink: null });
    paint(ellPts(960, 760, 1100, 260, 26), { fill: MG.hot, fillOp: 60 + 40 * pulse(t, 4), bleed: .35, tex: .3, ink: null });
    for (let i = 0; i < 26; i++) { const k = .5 + .5 * Math.sin(t * (1 + hash(i) * 2) + i); paint(starPts(-300 + hash(i + 3) * 2500, hash(i + 4) * 700 - 100, 3 + k * 5, .3, 4), { wash: MG.cream, washOp: 120 + 110 * k, ink: null }); }
    // trusses
    for (const x of [380, 1540]) {
      paint(rectPts(x - 26, 90, 52, 720), { wash: '#2E2458', ink: PAL.ink, sw: 1 });
      for (let y = 110; y < 800; y += 60) inkLine([[x - 24, y], [x + 24, y + 60]], .6, MG.lilac, 'inkfine', 0);
    }
    if (o.wall !== false) {
      const bump = pulse(t, 4);
      paint(rectPts(430, 50, 1060, 350, 3), { fill: MG.pink, fillOp: 40 + 60 * bump, bleed: .3, tex: .2, ink: null });
      paint(rectPts(470, 70, 980, 310, 2), { wash: '#140A2C', hatch: { d: 16, a: 0, c: '#3B2A78', w: .6 }, ink: MG.gold, sw: 2.2 });
      for (let i = 0; i < 22; i++) {
        const on = (i + Math.floor(t * 8)) % 3 === 0, x = i < 11 ? 480 + i * 96 : 480 + (i - 11) * 96, y = i < 11 ? 64 : 386;
        paint(ellPts(x, y, 7, 7, 8), { wash: on ? MG.goldLt : MG.hot, washOp: on ? 255 : 140, ink: null });
      }
    }
    if ((o.lk ?? 1) > 0) lasers(t, o.lk ?? 1);
    // floor
    const fy = 800 + (o.floorDy || 0);
    paint([[-500, fy], [W + 500, fy], [W + 500, 1600], [-500, 1600]], { wash: FLOOR, fill: MG.lilacDk, fillOp: 70, bleed: .05, tex: .6, border: .4, ink: null });
    for (let i = -8; i <= 8; i++) inkLine([[960 + i * 130, fy + 2], [960 + i * 260, 1500]], .7, '#5A3F9A', 'inkfine', 0);
    inkLine([[-500, fy], [W + 500, fy]], 3, MG.hot, 'marker', 0);
    paint(ellPts(960, fy + 90, 700, 90, 22), { fill: MG.pink, fillOp: 50 + 50 * pulse(t, 4), bleed: .3, tex: .2, ink: null });
    if (o.dim) paint(rectPts(-500, -500, W + 1000, H + 1000), { wash: MG.navy, washOp: 255 * o.dim, ink: null });
  }
  // screen-space audience with heart lightsticks. sc scales everybody (bigger = closer).
  function crowd(t, y0 = 1000, sc = 1, n = 18, seed = 0, jump = 1) {
    const pts = [[-60, 1200]], sticks = [];
    for (let i = 0; i < n; i++) {
      const x = (i + .5) * (W / n) + (hash(i + seed) - .5) * 40 * sc, bob = pulse(t - hash(i + 3 + seed) * .08, 5) * 16 * sc * jump;
      const hy = y0 + hash(i + 7 + seed) * 30 * sc - bob, r = (30 + hash(i + 11 + seed) * 10) * sc;
      pts.push([x - r * 1.7, hy + r * 2.4]);
      if (i % 2 === 0) {
        const sw = Math.sin(bpOf(t) * Math.PI + i) * 16 * sc, ax = x - r * 1.1 + sw, ay = hy - r * 2.3;
        pts.push([x - r * 1.35, hy + r * .9], [ax - 8 * sc, ay], [ax + 8 * sc, ay - 3 * sc], [x - r * .9, hy + r * .7]);
        sticks.push([ax, ay, i, Math.sin(bpOf(t) * Math.PI + i) * .35]);
      }
      for (let k = 0; k <= 6; k++) { const a = Math.PI + k / 6 * Math.PI; pts.push([x + Math.cos(a) * r, hy + Math.sin(a) * r * 1.1]); }
      pts.push([x + r * 1.7, hy + r * 2.4]);
    }
    pts.push([W + 60, 1200]);
    paint(pts, { wash: '#120A26', washOp: 255, ink: null });
    for (const [ax, ay, i, a] of sticks) {
      const L = 44 * sc, hx = ax + Math.sin(a) * L, hy = ay - Math.cos(a) * L, c = [MG.hot, MG.pink, MG.lilac, CYAN][i % 4];
      inkLine([[ax, ay], [hx, hy]], 2.2 * sc, MG.cream, 'ink', 0);
      paint(ellPts(hx, hy - 6 * sc, 34 * sc, 30 * sc, 12), { fill: c, fillOp: 80 + 80 * pulse(t, 4), bleed: .3, tex: .2, ink: null });
      paint(heartPts(hx, hy - 6 * sc, 17 * sc, 16), { wash: c, ink: PAL.ink, sw: .5 * sc });
      paint(heartPts(hx - 4 * sc, hy - 10 * sc, 5 * sc, 10), { wash: MG.cream, washOp: 200, ink: null });
    }
  }
  function speedLines(cx, cy, n, cols, r0 = 260, seed = 0, rot = 0) {
    for (let i = 0; i < n; i++) {
      const a = rot + (i + hash(i + seed) * .5) / n * TAU, w = .012 + hash(i + 7 + seed) * .02, r = r0 + hash(i + 3 + seed) * 180;
      paint([[cx + Math.cos(a) * r, cy + Math.sin(a) * r], [cx + Math.cos(a - w) * 2600, cy + Math.sin(a - w) * 2600], [cx + Math.cos(a + w) * 2600, cy + Math.sin(a + w) * 2600]], { wash: cols[i % cols.length], washOp: 220, ink: null });
    }
  }
  function hSpeed(t, y0, y1, n, col, seed = 0) {
    for (let i = 0; i < n; i++) {
      const y = lerp(y0, y1, hash(i + seed)), len = 200 + hash(i + 5 + seed) * 500, x = ((hash(i + 9 + seed) * 3000 - t * 2600) % 3000 + 3000) % 3000 - 500;
      paint([[x, y - 3], [x + len, y], [x, y + 3]], { wash: col, washOp: 150, ink: null });
    }
  }
  function bassRings(cx, cy, t, col = MG.hot) {
    for (let k = 0; k < 3; k++) {
      const f = frac(bpOf(t) + k / 3), r = 80 + f * 1200;
      paint(ellPts(cx, cy, r, r * .22, 30), { ink: col, sw: 3 * (1 - f) + .3 });
    }
  }
  function butterfly(x, y, s, flap, col, rot = 0) {
    push(); translate(x, y); rotate(rot);
    const f = .25 + .75 * flap;
    for (const e of [-1, 1]) {
      paint(ellPts(e * s * .55 * f, -s * .25, s * .6 * f, s * .5, 10, 0, e * .5), { wash: col, ink: PAL.ink, sw: .6 });
      paint(ellPts(e * s * .4 * f, s * .3, s * .38 * f, s * .32, 8, 0, -e * .4), { wash: mixCol(col, MG.cream, .4), ink: PAL.ink, sw: .5 });
    }
    paint(ellPts(0, 0, s * .1, s * .5, 8), { wash: MG.navy, ink: null });
    pop();
  }
  // a hater: flapping lips until h, then a burst into sparkles and pink butterflies
  function hater(x, y, s, t, h, seed = 0, col = MG.hot) {
    if (t < h) {
      const scared = seg(t, h - .35, h), jx = Math.sin(t * 70 + seed) * 6 * scared;
      lips(x + jx, y + Math.sin(t * 2.2 + seed) * 12, s * (1 - .15 * scared), t, { talk: .7 + .3 * scared, seed, col, flip: seed % 2 });
      if (scared > .2) emote('sweat', x + s * 1.6, y - s * .9, s * .35, scared);
      return;
    }
    const a = t - h;
    if (a < .2) {
      paint(starPts(x, y, s * (1.2 + a * 14), .32, 8, a * 3), { wash: MG.cream, washOp: 255 * (1 - a / .2), ink: null });
      paint(heartPts(x, y, s * (1 + a * 8)), { fill: MG.hot, fillOp: 160 * (1 - a / .2), bleed: .2, ink: null });
    }
    if (a < .5) paint(ellPts(x, y, s * (1 + a * 7), s * (1 + a * 7), 24), { ink: MG.pink, sw: 3 * (1 - a / .5) + .3 });
    for (let i = 0; i < 7; i++) {
      const an = i / 7 * TAU + seed, d = s * (.6 + easeOut(a / .7) * 2.6);
      sparkle(x + Math.cos(an) * d, y + Math.sin(an) * d, s * .32, clamp(a / .8), [MG.cream, MG.goldLt, MG.pink][i % 3]);
    }
    for (let i = 0; i < 4; i++) {
      const bx = x + (hash(i + seed * 5) - .5) * s * 5 * Math.min(a, 1.5) + Math.sin(a * 3 + i) * s * .4;
      const by = y - a * s * (2 + 2 * hash(i + seed)) - s * .2;
      butterfly(bx, by, s * .42 * clamp(a / .15), Math.abs(Math.sin(a * 20 + i * 2)), [MG.pink, MG.hot, MG.lilac, MG.cream][i], Math.sin(a * 4 + i) * .3);
    }
  }
  // right-arm wand tip in world space for a sailorClawd at (x, y, u) with pose o (ignores rot/squash)
  function wandTip(x, y, u, o) {
    const f = o.flip ? -1 : 1, a = o.aR ?? .2, c1 = -a, c2 = c1 - 1.1;
    const tx = 4.9 * u + Math.cos(c1) * 2.2 * u + Math.cos(c2) * 4.9 * u, ty = -4.5 * u + Math.sin(c1) * 2.2 * u + Math.sin(c2) * 4.9 * u;
    return [x + f * tx * (o.sx ?? 1), y + (o.dy || 0) * u + ty];
  }
  // arm angle aR that points the wand at (px, py)
  function aimAt(x, y, u, px, py, flip) {
    const sx = x + (flip ? -1 : 1) * 4.9 * u, sy = y - 4.5 * u, th = Math.atan2(py - sy, px - sx);
    let a = -(flip ? Math.PI - th : th) - 1.1 + .35;
    while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU;
    return a;
  }
  function beamOf(t, h, x0, y0, x1, y1, w) {
    const k = clamp((t - (h - .12)) / .12), fade = 1 - seg(t, h + .05, h + .32);
    if (t > h - .12 && fade > .02) heartBeam(x0, y0, x1, y1, w * fade, k, MG.pink);
    if (t > h - .14 && t < h + .2) paint(ellPts(x0, y0, w * 1.2, w * 1.2, 14), { fill: MG.goldLt, fillOp: 200, bleed: .3, ink: null });
  }
  function dancers(t, gy, u, xs, pop0 = null) {
    const cols = [[MG.pink, MG.lilac], [MG.mint, MG.gold], [MG.lilac, MG.hot], [MG.gold, MG.sky]];
    xs.forEach((x, i) => {
      const k = pop0 == null ? 1 : backOut(seg(t, pop0 + i * BEAT, pop0 + i * BEAT + .25)); if (k < .02) return;
      sailorClawd(x, gy, u * k, { ...move(i % 2 ? 'hop' : 'bounce', t, i), skirt: cols[i % 4][0], bow: cols[i % 4][1], eyes: 'happy', mouth: 'smile', noShadow: false });
    });
  }
  const rose = (x, y, s, rot) => {
    push(); translate(x, y); rotate(rot);
    inkLine([[-2.4 * s, 0], [0, 0]], s * .25, '#3E7A3A', 'ink', 0);
    paint(ellPts(-1.3 * s, -.28 * s, .32 * s, .14 * s, 8, 0, -.4), { wash: '#4E9A48', ink: PAL.ink, sw: .5 });
    paint(ellPts(.4 * s, 0, .75 * s, .62 * s, 12), { wash: MG.red, fill: '#8E1F33', fillOp: 60, ink: PAL.ink, sw: .8 });
    inkLine([[.1 * s, -.2 * s], [.5 * s, .1 * s], [.7 * s, -.25 * s]], .6, '#8E1F33', 'inkfine', .5);
    pop();
  };

  // ---------------------------------------------------------------- shots
  // 84.25–86.23 · wide arena, LED wall spells I-T-G-I-R-L, she bounces centre stage
  function shotArena(t, lt) {
    const hit = pulse(t, 5), [sx, sy] = shakeXY(t, 5 * hit);
    camBegin(960 + sx, 520 + sy - lt * 20, .94 + lt * .05 + hit * .015, Math.sin(t * .8) * .015);
    arena(t);
    ledLetters(t, 960, 225, 190, 150);
    dancers(t, 850, 15, [250, 470, 1450, 1670]);
    const m = move('bounce', t);
    sailorClawd(960, 880, 38, { ...m, wand: true, aR: 1 + .5 * hit, eyes: 'happy', mouth: 'grin', blush: true });
    camEnd();
    crowd(t);
    flash(.8 * (1 - lt / .12), '#FFD6E8');
  }
  // 86.23–88.23 · from behind the audience: big heart lightsticks wave, lasers cross over the crowd
  function shotCrowd(t, lt) {
    const hit = pulse(t, 5);
    camBegin(1060 - lt * 110, 560, .86 + lt * .03, -.02);
    arena(t);
    ledLetters(t, 960, 225, 190, 150);
    dancers(t, 850, 15, [520, 1400]);
    sailorClawd(960, 870, 36, { ...move('roof', t), wand: true, eyes: 'happy', mouth: 'grin', blush: true });
    camEnd();
    for (let i = 0; i < 4; i++) laser(-100 + i * 700, 1100, -1.2 - i * .25 + Math.sin(t * 2 + i) * .3, [MG.hot, MG.lilac, CYAN, MG.pink][i], 1600);
    crowd(t, 930, 2, 9, 5, 1.2);
    sparkleField(t, 12, { seed: 11, area: [0, 0, W, 700] });
    flash(.25 * hit, MG.pink);
  }
  // 88.23–90.23 · transformation reprise: spinning glowing silhouette inside a full rainbow ribbon
  function shotTransform(t, lt) {
    const k = seg(t, 88.23, 90.1), spin = Math.cos(lt * TAU * 1.25);
    camBegin(960, 560 - lt * 40, 1 + lt * .08, Math.sin(lt * 1.3) * .05);
    arena(t, { wall: false, lk: .3, dim: .45 });
    paint([[820, -300], [1100, -300], [1260, 900], [660, 900]], { fill: MG.goldLt, fillOp: 80, bleed: .2, tex: .2, ink: null });
    sunburst(960, 520, RAINBOW[0], RAINBOW[4], lt * .6, 18, 1600, 40 + 40 * k);
    ribbonSwirl(960, 560, t, { n: 6, r: 520 - 120 * k, k: .2 + .8 * k, cols: RAINBOW });
    const suited = t > 89.73, pp = pulse(t, 5);
    sailorClawd(960, 860, 38, {
      dy: -1.5 - Math.sin(lt * 2) * .5, sx: suited ? 1 : spin, outfit: suited, wand: suited, eyes: 'closed', mouth: 'smile', blush: true,
      col: suited ? undefined : '#FFE3F0', dk: suited ? undefined : MG.pink, lt: suited ? undefined : MG.cream, aL: .9 + .3 * pp, aR: 1.1 + .3 * pp
    });
    ribbonSwirl(960, 760, t + .7, { n: 3, r: 380 - 90 * k, k: .15 + .8 * k, cols: RAINBOW.slice(3) });
    for (let i = 0; i < 16; i++) { const ph = frac(t * .7 + hash(i)); sparkle(960 + (hash(i + 2) - .5) * 900, 1000 - ph * 900, 12 + hash(i) * 16, ph, [MG.cream, MG.goldLt, MG.pink][i % 3]); }
    ledLetters(t, 960, 170, 150, 140);
    camEnd();
    flash(.8 * Math.max(0, 1 - Math.abs(t - 89.73) / .12), MG.cream);
  }
  // 90.23–91.95 · she lands the pose: flash, rainbow burst, backup dancers pop in on the beats
  function shotPose(t, lt) {
    const land = seg(lt, 0, .16), z = 1.18 - .16 * elasticOut(seg(lt, 0, .7)), [sx, sy] = shakeXY(t, 10 * Math.exp(-lt * 6));
    camBegin(960 + sx, 540 + sy, z, -.04 + lt * .02);
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: MG.hot, ink: null });
    sunburst(960, 560, RAINBOW[(beatN(t) % 6 + 6) % 6], MG.cream, t * .25, 20, 2200, 150);
    speedLines(960, 560, 26, [MG.cream, MG.goldLt], 420, 3, t * .1);
    paint(rectPts(-400, 860, W + 800, 600), { wash: FLOOR, ink: MG.hot, sw: 2 });
    dancers(t, 890, 16, [300, 520, 1400, 1620], 90.733);
    const sq = lt < .16 ? -.15 : .15 * Math.exp(-(lt - .16) * 8) * Math.cos((lt - .16) * 30);
    sailorClawd(960, 900, 40, { dy: -6 * (1 - easeIn(land)), sq, wand: true, aR: 1.35, aL: .5 + .2 * pulse(t, 5), eyes: 'wink', mouth: 'grin', blush: true, emote: 'heart', emoteK: seg(lt, .3, .6) });
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, d = 200 + lt * 700; sparkle(960 + Math.cos(a) * d, 560 + Math.sin(a) * d * .7, 26, clamp(lt / 1.2), [MG.cream, MG.goldLt][i % 2]); }
    ledLetters(t, 960, 160, 150, 140);
    camEnd();
    flash(1 - lt / .15, MG.cream);
  }
  // 91.95–93.98 · wind-up: she twirls the wand, a heart charge grows, the lips close in; "hit 'em" zoom punch
  const LIPS1 = [[1300, 380, 70], [1650, 560, 75], [1420, 720, 65], [1720, 250, 62]];
  function shotWindup(t, lt) {
    const hitEm = t - 93.6, punch = hitEm > 0 ? Math.exp(-hitEm * 6) : 0, [sx, sy] = shakeXY(t, 16 * punch);
    camBegin(900 + sx + lt * 40, 540 + sy, 1 + lt * .04 + .12 * punch + (hitEm > 0 ? .08 : 0), .03);
    arena(t, { wall: false, lk: .6 });
    hSpeed(t, 120, 780, 20, MG.lilac, 4);
    const ap = hitEm < 0 ? { aR: 1.2 + Math.sin(lt * 18) * 1.1 } : { aR: aimAt(480, 880, 38, 1300, 380) };
    const o = { ...ap, wand: true, dy: -move('bounce', t).dy * -.4, eyes: hitEm > 0 ? 'narrow' : 'look', lookX: 1, mouth: hitEm > 0 ? 'grin' : 'smile', blush: true };
    for (let j = 6; j > 0; j--) { // twirl trail
      if (hitEm > 0) break;
      const tip = wandTip(480, 880, 38, { ...o, aR: 1.2 + Math.sin((lt - j * .025) * 18) * 1.1 });
      sparkle(tip[0], tip[1], 26 - j * 3, .5, j % 2 ? MG.pink : MG.goldLt);
    }
    sailorClawd(480, 880, 38, o);
    const tip = wandTip(480, 880, 38, o), ch = seg(t, 91.95, 93.6);
    paint(ellPts(tip[0], tip[1], 30 + 60 * ch, 30 + 60 * ch, 16), { fill: MG.pink, fillOp: 150, bleed: .3, ink: null });
    paint(heartPts(tip[0], tip[1], 14 + 34 * ch), { wash: MG.hot, ink: PAL.ink, sw: .8 });
    LIPS1.forEach(([x, y, s], i) => { const e = backOut(seg(t, 92.0 + i * .35, 92.4 + i * .35)); if (e > .02) lips(x + (1 - e) * 700, y, s, t, { talk: 1, seed: i, flip: i % 2 }); });
    camEnd();
    if (hitEm > 0) sfx('HIT!', 1100, 180, 150, MG.goldLt, hitEm, { life: .4 });
  }
  // 93.98–95.6 and 98.0–99.9 · four "hit it" beams, a micro-cut (new camera) per hit
  function hitShot(t, hits, targets, cams, o) {
    let i = 0; while (i + 1 < hits.length && t >= hits[i + 1] - .2) i++;
    const c = cams[i], lh = t - hits[i], [sx, sy] = shakeXY(t, lh > 0 ? 14 * Math.exp(-lh * 7) : 0);
    camBegin(c[0] + sx + (t - hits[i]) * 30, c[1] + sy, c[2] + (lh > 0 ? .05 * Math.exp(-lh * 8) : 0), c[3]);
    arena(t, { wall: o.wall, lk: .8 });
    const [tx, ty] = targets[i], CX = o.x, u = 38;
    const pose = { aR: aimAt(CX, 880, u, tx, ty, o.flip), flip: o.flip, wand: true, eyes: 'narrow', mouth: 'grin', blush: true, sq: lh > 0 ? .1 * Math.exp(-lh * 10) : 0, aL: .3 };
    sailorClawd(CX, 880, u, pose);
    const tip = wandTip(CX, 880, u, pose);
    targets.forEach(([x, y, s], j) => hater(x, y, s, t, hits[j], j + o.seed, o.col));
    beamOf(t, hits[i], tip[0], tip[1], tx, ty, 34);
    camEnd();
    if (i === 3) sfx('POP!', 960, 170, 160, MG.goldLt, t - hits[3], { life: .6 });
  }
  const shotHits1 = t => hitShot(t, HITS1, LIPS1, [[900, 540, 1, 0], [1100, 520, 1.1, -.03], [1000, 600, 1.05, .04], [1150, 460, 1.12, -.02]], { x: 480, flip: false, seed: 0, col: MG.hot, wall: false });
  const LIPS2 = [[620, 360, 70], [300, 520, 72], [520, 720, 64], [240, 250, 60]];
  const shotHits2 = t => hitShot(t, HITS2, LIPS2, [[960, 560, 1.05, .12], [820, 520, 1.12, .1], [900, 620, 1.08, .14], [780, 480, 1.14, .09]], { x: 1440, flip: true, seed: 7, col: MG.lilacDk, wall: false });
  // 95.6–98.0 · "can't stop, won't stop": one long beam sweeps a row of lips, popping each one
  const ROW = [0, 1, 2, 3, 4, 5].map(i => [230 + i * 290, 250 + Math.abs(i - 2.5) * 70 + (i % 2) * 40, 58]);
  const SW0 = 95.94, SW1 = 97.54, rowHit = i => lerp(SW0, SW1, i / 5);
  function shotSweep(t, lt) {
    const f = clamp((t - SW0) / (SW1 - SW0)) * 5, i0 = Math.min(4, Math.floor(f)), p = ROW[i0], q = ROW[i0 + 1], ff = f - i0;
    const tx = t < SW0 ? ROW[0][0] : lerp(p[0], q[0], ff), ty = t < SW0 ? ROW[0][1] : lerp(p[1], q[1], ff);
    const [sx, sy] = shakeXY(t, 4 + 4 * pulse(t, 6));
    camBegin(lerp(760, 1160, ease(seg(t, 95.6, 97.8))) + sx, 520 + sy, 1.04, (tx - 960) * -.00004);
    arena(t, { lk: .5 });
    const pose = { aR: aimAt(960, 900, 36, tx, ty), wand: true, eyes: 'narrow', mouth: 'grin', blush: true, dy: -.3 + Math.sin(t * 20) * .08, aL: .4 };
    ROW.forEach(([x, y, s], j) => hater(x, y, s, t, rowHit(j), j + 3, j % 2 ? MG.hot : MG.pinkDk));
    sailorClawd(960, 900, 36, pose);
    const tip = wandTip(960, 900, 36, pose), k = clamp((t - 95.6) / .3), fade = 1 - seg(t, SW1 + .05, SW1 + .35);
    if (fade > .02) heartBeam(tip[0], tip[1], tx, ty, (26 + 8 * pulse2(t, 6)) * fade, k, MG.pink);
    paint(ellPts(tip[0], tip[1], 40 * fade + 10, 40 * fade + 10, 14), { fill: MG.goldLt, fillOp: 180, bleed: .3, ink: null });
    camEnd();
    crowd(t, 1020, 1, 18, 2);
    sfx('POP!', 1300, 190, 170, MG.goldLt, t - SW1, { life: .5, rot: .1 });
  }
  // 99.9–101.95 and 103.8–105.95 · bounce to the bass: the whole floor bounces, bass rings, "hit it right back" heart fireworks
  function shotBounce(t, lt, o) {
    const bp = pulse(t, 5), fd = 22 * bp, [sx, sy] = shakeXY(t, 9 * bp);
    camBegin(o.cx + sx, o.cy + sy + fd * .5, o.z + .03 * bp + lt * .02, o.rot);
    arena(t, { floorDy: fd, lk: 1 });
    bassRings(960, 830 + fd, t);
    push(); translate(0, fd);
    dancers(t, 840, 15, [240, 470, 1450, 1680]);
    const hr = t - o.hitT, fire = hr > -.12 && hr < .6;
    const pose = { ...move('hop', t), wand: true, eyes: fire ? 'narrow' : 'happy', mouth: 'grin', blush: true };
    if (fire) pose.aR = 1.2;
    sailorClawd(960, 870, 38, pose);
    pop();
    if (o.boss) hater(1500, 250, 110, t, o.hitT, 21, MG.hot);
    const tip = wandTip(960, 870 + fd, 38, pose), tgt = o.boss ? [1500, 250] : [960, 150];
    beamOf(t, o.hitT, tip[0], tip[1], tgt[0], tgt[1], 36);
    if (!o.boss && hr > 0) for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU, d = easeOut(hr / .8) * 360, k = clamp(1 - (hr - .6) / .8);
      if (k > .02) paint(heartPts(960 + Math.cos(a) * d, 150 + Math.sin(a) * d + hr * hr * 120, 20 * k), { wash: RAINBOW[i % 6], ink: PAL.ink, sw: .6 });
    }
    camEnd();
    crowd(t, 1000 - fd * .3, 1, 18, 9, 2);
  }
  const shotBounce1 = (t, lt) => shotBounce(t, lt, { cx: 960, cy: 520, z: .98, rot: 0, hitT: 100.88 });
  const shotBounce2 = (t, lt) => shotBounce(t, lt, { cx: 1040, cy: 560, z: 1.02, rot: -.06, hitT: 104.90, boss: true });
  // 101.95–103.8 · look at it, want it, get it, SNAP: selfie with the defeated haters, freezes into a polaroid
  const SNAP = 103.42;
  function selfieScene(t) {
    arena(t, { lk: .7 });
    const lookK = t < 102.58 ? 'look' : t < 103.0 ? 'heart' : t < SNAP - .05 ? 'happy' : 'wink';
    const phone = (u, sw) => { // selfie stick, phone kept upright
      inkLine([[0, 0], [6 * u, 0]], sw * 2, '#C9C3D8', 'ink', 0);
      push(); translate(6.6 * u, 0); rotate(1.3); rotate(-.25);
      paint(rrPts(-1.1 * u, -1.8 * u, 2.2 * u, 3.6 * u, .35 * u), { wash: '#2E2C38', ink: PAL.ink, sw: sw * .7 });
      paint(rrPts(-.85 * u, -1.5 * u, 1.7 * u, 2.9 * u, .2 * u), { wash: MG.pink, fill: MG.lilac, fillOp: 80, ink: null });
      paint(heartPts(0, -.1 * u, .45 * u), { wash: MG.cream, ink: null });
      pop();
      paint(ellPts(.3 * u, 0, .75 * u, .75 * u, 12), { wash: MG.glove, ink: PAL.ink, sw: sw * .5 }); };
    const pull = backOut(seg(t, 103.0, 103.25));
    [[600, 380, 80], [450, 600, 72], [700, 650, 64]].forEach(([x, y, s], i) => {
      const lx = x - (1 - pull) * (700 + i * 120), ly = y + Math.sin(t * 3 + i) * 8;
      lips(lx, ly, s, t, { talk: .15, seed: i + 30, col: MG.pinkDk, flip: i % 2 });
      inkLine([[lx - s * .5, ly - s * .7], [lx + s * .3, ly - s * .3]], 5, MG.cream, 'marker', 0);
      inkLine([[lx - s * .5, ly - s * .3], [lx + s * .3, ly - s * .7]], 5, MG.cream, 'marker', 0);
      for (let k = 0; k < 3; k++) { const a = t * 5 + k * TAU / 3 + i; sparkle(lx + Math.cos(a) * s * 1.1, ly - s * .9 + Math.sin(a) * s * .25, s * .2, .5, MG.goldLt); }
    });
    sailorClawd(1180, 900, 44, {
      ...move('idle', t), aR: 1.3, armR: phone, aL: t >= SNAP - .05 ? 1.5 : .3, eyes: lookK, lookX: 1, lookY: -1, mouth: t < 103.0 ? 'smile' : 'grin', blush: true,
      ...(lookK === 'heart' ? { emote: 'heart', emoteK: seg(t, 102.58, 102.8) } : {})
    });
  }
  function shotSelfie(t, lt) {
    if (t < SNAP) {
      const beat = pulse(t, 6);
      camBegin(1000 + lt * 40, 560, 1.12 + lt * .05 + .03 * beat, .02);
      selfieScene(t);
      camEnd();
      return;
    }
    const a = t - SNAP, z = lerp(1.18, .74, backOut(seg(a, 0, .3))), rot = -.07 * ease(seg(a, 0, .3));
    camBegin(1000 + 1.5 * 40, 560, z, rot);
    selfieScene(SNAP);
    camEnd();
    const box = (hw, top, bot) => { const c = Math.cos(rot), s = Math.sin(rot), sc = z / 1.18; return [[-hw, -top], [0, -top], [hw, -top], [hw, 0], [hw, bot], [0, bot], [-hw, bot], [-hw, 0]].map(([x, y]) => [960 + (x * c - y * s) * sc, 520 + (x * s + y * c) * sc]); };
    irisShape(box(1000, 560, 560), MG.cream);
    irisShape(box(1060, 620, 720), '#5A2F7A');
    for (let i = 0; i < 20; i++) sparkle(hash(i) * W, hash(i + 1) * H * .9, 20, frac(t * .8 + hash(i + 2)), MG.goldLt);
    flash(1 - a / .18);
    sfx('SNAP!', 1540, 170, 170, MG.hot, a, { life: .8, rot: .12 });
  }
  // 105.95–107.2 · IT GIRL!: full-frame freeze with a speed-line burst
  function shotFreeze(t, lt) {
    const z = 1.35 - .35 * backOut(seg(lt, 0, .22)) + lt * .02;
    camBegin(960, 560, z, -.03);
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: MG.hot, fill: MG.lilac, fillOp: 80, bleed: .2, tex: .4, ink: null });
    speedLines(960, 520, 40, [MG.cream, MG.goldLt, MG.pink], 300, 17);
    paint(ellPts(960, 560, 480, 480, 28), { fill: MG.goldLt, fillOp: 140, bleed: .35, tex: .3, ink: null });
    sailorClawd(960, 920, 50, { wand: true, aR: 1.45, aL: .7, dy: -.4, eyes: 'wink', mouth: 'grin', blush: true, rot: -.04 });
    for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + .2, d = 320 + 520 * easeOut(lt / .8); sparkle(960 + Math.cos(a) * d, 520 + Math.sin(a) * d * .75, 34, clamp(lt / 1), [MG.cream, MG.goldLt][i % 2]); }
    spell('ITGIRL', 960, 170, 170, t, 105.92, { step: .06, gap: 150 });
    camEnd();
    // freeze-frame border
    for (const [x, y, w, h] of [[-60, -60, W + 120, 80], [-60, 1000, W + 120, 140], [-60, -60, 80, H + 120], [W - 20, -60, 80, H + 120]]) paint(rectPts(x, y, w, h), { wash: MG.navy, ink: null });
    flash(.9 * (1 - lt / .12), MG.cream);
  }
  // 107.2–109.4 · break: the masked gentleman throws a rose; she catches it in her teeth
  const THROW = 107.73, CATCH = 108.23;
  function shotRose(t, lt) {
    const caught = t >= CATCH, ca = t - CATCH, push_ = ease(seg(t, CATCH + .05, CATCH + .7));
    const cx = lerp(lerp(760, 1250, ease(seg(t, THROW, CATCH))), 1430, push_), cy = lerp(600, 690, push_);
    const [sx, sy] = shakeXY(t, caught ? 6 * Math.exp(-ca * 8) : 0);
    camBegin(cx + sx, cy + sy, 1 + .55 * push_, 0);
    arena(t, { lk: .25, dim: .35 });
    paint([[1360, -300], [1560, -300], [1760, 900], [1160, 900]], { fill: MG.goldLt, fillOp: 60, bleed: .2, tex: .2, ink: null });
    const wind = seg(t, 107.3, THROW), rel = seg(t, THROW, THROW + .15);
    tuxResearcher(330, 880, 24, { rose: t < THROW, aR: lerp(lerp(.2, -.6, wind), 1.4, easeOut(rel)), aL: .3, mouth: 'smile', eyes: t > CATCH + .1 ? 'heart' : 'dot', blush: true });
    const mouthY = 880 - 4.3 * 34, MX = 1450;
    const md = mood(t, [[107.2, 'look'], [CATCH, 'wink', 'heart']]);
    sailorClawd(MX, 880, 34, {
      ...move('idle', t), ...md, lookX: -1, flip: false, mouth: caught ? 'cat' : 'o', blush: true, wand: true, aR: .3, aL: caught ? 1.2 : .3, sq: caught ? .12 * Math.exp(-ca * 8) * Math.cos(ca * 30) : 0,
      draw: caught ? (u, sw) => rose(-2.2 * u, -4.4 * u, u * .9, Math.PI +  .15 + Math.sin(ca * 8) * .1 * Math.exp(-ca * 3)) : null
    });
    blackCat(1790, 880, 14, t, { flip: true, eyes: caught ? 'happy' : 'normal' });
    if (ca > .3) emote('sweat', 1720, 780, 14, seg(ca, .3, .5));
    if (!caught && t > THROW) {
      const f = seg(t, THROW, CATCH), x = lerp(390, MX - 14, f), y = lerp(640, mouthY, f) - 320 * 4 * f * (1 - f);
      for (let j = 1; j <= 5; j++) { const g = Math.max(0, f - j * .05), gx = lerp(390, MX - 14, g), gy = lerp(640, mouthY, g) - 320 * 4 * g * (1 - g); sparkle(gx, gy, 16 - j * 2, .5, MG.pink); }
      rose(x, y, 46, f * 14);
    }
    if (caught && ca < .4) { paint(starPts(MX, mouthY, 60 + ca * 400, .3, 8), { wash: MG.cream, washOp: 255 * (1 - ca / .4), ink: null }); }
    if (caught) for (let i = 0; i < 6; i++) { const ph = frac(ca * .8 + i / 6); paint(heartPts(MX + 180 + Math.sin(i * 2 + ca * 3) * 50, mouthY - 40 - ph * 260, 14 * (1 - ph)), { wash: MG.hot, ink: PAL.ink, sw: .5 }); }
    camEnd();
  }

  chapter('chorus2', 84.25, 109.4, [
    [84.25, shotArena], [86.233, shotCrowd], [88.233, shotTransform], [90.233, shotPose], [91.95, shotWindup],
    [93.8, shotHits1], [95.6, shotSweep], [97.9, shotHits2], [99.9, shotBounce1], [101.95, shotSelfie],
    [103.8, shotBounce2], [105.9, shotFreeze], [107.2, shotRose]
  ]);
})();
