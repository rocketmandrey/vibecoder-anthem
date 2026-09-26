// a03_chorus1.js: «Жги токены» v2, chapter 3 "pre-chorus + chorus 1" (39.8–67.1). ЗАВОД ТОКЕНОВ, the token shredder line.
// 39.8 the inference hall is on fire, coolers howl → 41.82 / 42.47 a press slams the hall flat, the ram lifts and the
// flattened racks spring up as candles: a stock chart → 42.72 the chart (БИРЖА) grows eyes, looks at us, drops its jaw
// and says «ЖГИ!» → 45.05 chorus: two gangs (hard-hat Clawds left, agents right) feed tokens into the ШРЕДЕР ТОКЕНОВ,
// call-and-response on every «Жги!» → 47.75 the limit bar burns down → 52.85 the odometer rolls to 1 000 000 →
// 55.25 agents step off the belt already holding job postings and hire; GPUs pile off the upper belt → 60.35 CEO-Clawd
// before the weekly-burn slide: «ЗАЧЕМ?» signs burn on «неважно» ×2, thumbs-up + «ПОЛЕЗНО» stamp → 66.4 the edit gap.
(() => {
  const INK = PAL.ink;
  const GREEN = '#2FBF71';
  const CUTS = [39.8, 45.05, 47.75, 49.7, 52.85, 55.25, 60.35, 66.4, 67.1];
  // call-and-response: A = the Clawd gang (left), B = the agents (right)
  const ZHGI = [[45.10, 'A'], [46.56, 'B'], [49.74, 'A'], [51.70, 'B']];
  const CHOMPS = ZHGI.map(z => z[0] + .05);

  function a03_end(t) { for (const c of CUTS) glitchCut(t, c, { span: .09 }); }

  // ---------- helpers ----------
  const a03_hardhat = (col = A2.hazard, txt) => (u, sw) => {
    const dome = []; for (let i = 0; i <= 14; i++) { const a = Math.PI + i / 14 * Math.PI; dome.push([Math.cos(a) * 4.3 * u, -8 * u + Math.sin(a) * 2.4 * u]); }
    paint(dome, { wash: col, fill: mixCol(col, A2.rust, .35), fillOp: 60, tex: .4, ink: INK, sw: sw * .7 });
    paint(rrPts(-5.6 * u, -8.4 * u, 11.2 * u, .75 * u, .3 * u), { wash: col, ink: INK, sw: sw * .6 });
    inkLine([[0, -10.3 * u], [0, -8.5 * u]], sw * .5, mixCol(col, INK, .4), 'inkfine', 0);
    paint(ellPts(-1.8 * u, -9.4 * u, .8 * u, .35 * u, 8, 0, -.4), { wash: '#FFFFFF', washOp: 150, ink: null });
  };
  // factory back wall + floor (world space)
  function a03_hall(t, o = {}) {
    const fy = o.floor ?? 900, dark = o.dark || 0;
    paint(rectPts(-400, -400, W + 800, fy + 400), { wash: mixCol(A2.gunmetal, '#0C0E11', dark), fill: A2.gunDk, fillOp: 120, bleed: .1, tex: .6, border: .3, ink: null });
    for (let x = -240; x < W + 400; x += 240) inkLine([[x, -400], [x, fy]], .5, A2.gunDk, 'inkfine', 0);
    paint(rectPts(-400, 90, W + 800, 34), { wash: A2.steel, fill: A2.gunDk, fillOp: 70, tex: .5, ink: INK, sw: .5 });       // pipe
    for (let x = -200; x < W + 400; x += 380) paint(rectPts(x, 82, 26, 50), { wash: A2.rust, ink: INK, sw: .4 });
    gear(-30, 330, 190, t, { speed: .12, col: mixCol(A2.steel, A2.gunDk, .45) });
    gear(W + 40, 300, 230, t, { speed: -.1, col: mixCol(A2.steel, A2.gunDk, .45) });
    gear(W - 170, 560, 90, t, { speed: .26, col: mixCol(A2.rust, A2.gunDk, .4) });
    for (const lx of o.lamps || [420, 1500]) {
      inkLine([[lx, -400], [lx, 20]], .6, INK, 'inkfine', 0);
      paint([[lx - 22, 20], [lx + 22, 20], [lx + 60, 70], [lx - 60, 70]], { wash: A2.gunDk, ink: INK, sw: .5 });
      paint(ellPts(lx, 150, 260, 180, 18), { fill: A2.sodium, fillOp: 60 * (1 - dark), bleed: .3, tex: .2, ink: null });
      paint(ellPts(lx, 72, 34, 10, 10), { wash: '#FFE2A8', washOp: 230 * (1 - dark), ink: null });
    }
    paint(rectPts(-400, fy, W + 800, 600), { wash: '#15171B', fill: A2.gunmetal, fillOp: 80, tex: .6, ink: null });
    hazard(-400, fy - 6, W + 800, 16);
  }
  function a03_caption(txt, x, y, size, t, t0, side, life = 1.35) {
    if (t < t0 || t > t0 + life) return;
    punkText(txt, x, y, size, t, t0, {
      seed: side === 'A' ? 3 : 8, step: .025,
      cols: side === 'A' ? [[A2.hazard, TK.soot], [A2.sodium, TK.soot], [TK.soot, A2.hazard], [A2.cream, A2.rust]]
                         : [['#6F8BE0', TK.cream], [TK.cream, '#3D55A8'], ['#3D55A8', TK.cream], [TK.soot, '#9FB4F0']]
    });
  }
  // a shower of shredded gold strips (screen or world)
  function a03_strip(x, y, len, rot, col) {
    const c = Math.cos(rot), s = Math.sin(rot), nx = -s * 3.5, ny = c * 3.5;
    paint([[x - c * len / 2 + nx, y - s * len / 2 + ny], [x + c * len / 2 + nx, y + s * len / 2 + ny], [x + c * len / 2 - nx, y + s * len / 2 - ny], [x - c * len / 2 - nx, y - s * len / 2 - ny]], { wash: col, ink: null });
  }
  function a03_spray(x, y, age, n, R, seed, life = .8) {
    if (age < 0 || age > life) return;
    const p = age / life;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (hash(i + seed) - .5) * 2.4, v = R * (.5 + hash(i * 3 + seed) * .7);
      const px = x + Math.cos(a) * v * p, py = y + Math.sin(a) * v * p + p * p * R * 1.1;
      a03_strip(px, py, 26 + hash(i + 9) * 22, age * 14 + i, i % 3 ? TK.gold : (i % 2 ? TK.goldDk : '#FFE38A'));
    }
  }
  function a03_confetti(t, n, area, seed = 0) {
    const [x0, y0, w, h] = area;
    for (let i = 0; i < n; i++) {
      const p = frac(t * (.35 + hash(i + seed) * .3) + hash(i * 3 + seed)), x = x0 + hash(i * 7 + seed) * w + Math.sin(t * 3 + i) * 30, y = y0 + p * h;
      a03_strip(x, y, 22 + hash(i) * 20, t * (2 + hash(i + 4) * 4) + i, i % 3 ? TK.gold : '#FFE38A');
    }
  }

  // ---------- 39.8–42.9: the burning hall, squashed flat into a chart ----------
  function a03_ramBottom(t) {
    if (t < 41.62) return -120;
    if (t < 41.82) return lerp(-120, 560, easeIn(seg(t, 41.62, 41.82)));
    if (t < 42.37) return 560 - 38 * Math.sin(seg(t, 41.82, 42.2) * Math.PI) * Math.exp(-seg(t, 41.82, 42.37) * 2);
    if (t < 42.47) return lerp(560, 880, easeIn(seg(t, 42.37, 42.47)));
    if (t < 42.52) return 880;
    return lerp(880, -260, ease(seg(t, 42.52, 42.72)));                                // ponytail: short hold, the grey slab mustn't linger
  }
  function a03_ram(rb, t) {
    if (rb < -100) return;
    paint(rectPts(-300, rb - 1400, W + 600, 1400), { wash: A2.steel, fill: A2.gunDk, fillOp: 110, tex: .6, border: .4, ink: INK, sw: 1.2 });
    for (let x = 60; x < W; x += 300) paint(rectPts(x, rb - 900, 60, 900), { wash: A2.gunmetal, washOp: 160, ink: null });
    hazard(-300, rb - 70, W + 600, 70);
    for (let x = 90; x < W; x += 260) paint(ellPts(x, rb - 110, 13, 13, 8), { wash: A2.steelLt, ink: INK, sw: .4 });
    paint(rectPts(W / 2 - 300, rb - 250, 600, 110, 1), { wash: A2.rust, fill: '#6E2E18', fillOp: 80, tex: .5, ink: INK, sw: .8 });
    letter('ПРЕСС РЫНКА', W / 2, rb - 195, 64, A2.hazard, { font: ruFont(64) });
  }
  // the stock exchange as a factory control panel: eyes on stalks, a jaw that drops
  const A03_ys = 540;
  function a03_candles(yLo, yHi, dy, rise, cap) {
    const n = 10, x0 = 400, x1 = 1520, base = 820;
    for (let i = 0; i < n; i++) {
      const hFull = 70 + 470 * Math.pow(i / (n - 1), 1.35) + (hash(i + 2) - .5) * 40, cx = x0 + (i + .5) * (x1 - x0) / n, cw = 62;
      let top = base - hFull * rise; if (cap != null) top = Math.max(top, Math.min(base - 4, cap));
      const bot = base - Math.max(0, (hFull * .35 - 60) * rise);                      // candle body sits on a wick
      const a = Math.max(top, yLo), b = Math.min(base, yHi);
      if (b - a < 3) continue;
      inkLine([[cx, Math.max(a, top - 26) + dy], [cx, Math.min(b, base) + dy]], 1, TK.led, 'inkfine', 0);
      const ba = Math.max(top, yLo), bb = Math.min(bot, yHi);
      if (bb - ba > 3) paint(rectPts(cx - cw / 2, ba + dy, cw, bb - ba), { wash: TK.green, fill: TK.greenDk, fillOp: 60, tex: .4, ink: INK, sw: .6 });
    }
    return { n, x0, x1, base };
  }
  function a03_panelPart(y0, y1, dy, t, o) {
    // bezel + screen between world rows y0..y1, shifted by dy
    const bx0 = 300, bx1 = 1620, by0 = 200, by1 = 900, sx0 = 350, sx1 = 1570, sy0 = 250, sy1 = 840;
    const a = Math.max(y0, by0), b = Math.min(y1, by1);
    if (b - a > 2) paint(rectPts(bx0, a + dy, bx1 - bx0, b - a), { wash: A2.gunmetal, fill: A2.steel, fillOp: 70, tex: .6, border: .4, ink: INK, sw: 1 });
    const c = Math.max(y0, sy0), d = Math.min(y1, sy1);
    if (d - c > 2) {
      paint(rectPts(sx0, c + dy, sx1 - sx0, d - c), { wash: '#0E1612', fill: '#16261D', fillOp: 90, tex: .5, ink: INK, sw: .7 });
      for (let gy = 320; gy < 840; gy += 100) if (gy > c && gy < d) inkLine([[sx0 + 10, gy + dy], [sx1 - 10, gy + dy]], .35, '#2C4A38', 'inkfine', 0);
      a03_candles(c, d, dy, o.rise, o.cap);
    }
    // rivets + gauges on the bezel
    for (const [rx, ry] of [[322, 222], [1598, 222], [322, 878], [1598, 878]]) if (ry > y0 && ry < y1) paint(ellPts(rx, ry + dy, 9, 9, 8), { wash: A2.steelLt, ink: INK, sw: .4 });
    if (870 > y0 && 870 < y1) for (let i = 0; i < 6; i++) paint(ellPts(560 + i * 160, 870 + dy, 12, 12, 10), { wash: [TK.ember, A2.hazard, GREEN][i % 3], washOp: hash(i + Math.floor(t * 6)) > .4 ? 255 : 120, ink: INK, sw: .4 });
  }
  function a03_eye(cx, cy, r, lx, ly, open, t) {
    inkLine([[cx, cy + r * .6], [cx + Math.sin(t * 3 + cx) * 12, cy + r * 1.6], [cx, 300]], 5, A2.steel, 'ink', .5);
    paint(ellPts(cx, cy, r, r * open, 24), { wash: '#FBF6EA', fill: '#D9D0C0', fillOp: 60, tex: .3, ink: INK, sw: 1.2 });
    if (open > .25) {
      paint(ellPts(cx + lx * r * .45, cy + ly * r * .35 * open, r * .38, r * .38 * Math.min(1, open * 1.1), 16), { wash: A2.gunDk, ink: null });
      paint(ellPts(cx + lx * r * .45 - r * .12, cy + ly * r * .35 * open - r * .14, r * .1, r * .1, 8), { wash: '#FFFFFF', ink: null });
    }
    for (let i = -2; i <= 2; i++) inkLine([[cx + i * r * .3, cy - r * open], [cx + i * r * .38, cy - r * open - r * .25]], .8, INK, 'inkfine', 0);   // lashes
  }
  function a03_bourse(t, o) {
    const jaw = o.jaw || 0, dU = -40 * jaw, dL = 170 * jaw;
    a03_hall(t, { lamps: [180, 1740] });
    if (o.eyes > 0) {
      const pop = backOut(o.eyes), open = o.open ?? 1;
      for (const [ex, ph] of [[640, 0], [1280, 1]]) a03_eye(ex, lerp(300, 105, pop) + dU, 88, o.lx ?? 0, o.ly ?? 0, open, t + ph);
    }
    paint(rectPts(810, 150 + dU, 300, 70, 1), { wash: A2.rust, fill: '#6E2E18', fillOp: 80, tex: .5, ink: INK, sw: .8 });
    if (!o.noLabel) letter('БИРЖА', 960, 186 + dU, 50, A2.hazard, { font: ruFont(50) });
    if (jaw < .02) a03_panelPart(-1e4, 1e4, 0, t, o);
    else {
      // throat between the two halves, then the halves
      paint(ellPts(960, A03_ys + (dU + dL) / 2, 620, (dL - dU) / 2 + 60, 30), { wash: '#3A0F18', fill: '#6E1A26', fillOp: 90, tex: .5, ink: INK, sw: 1 });
      paint(ellPts(960, A03_ys + dL - 20, 360, 60 * jaw + 10, 22), { wash: PAL.rose, fill: '#B0455E', fillOp: 60, tex: .4, ink: INK, sw: .8 });
      a03_panelPart(-1e4, A03_ys, dU, t, o);
      a03_panelPart(A03_ys, 1e4, dL, t, o);
    }
    if (jaw < .02 && o.rise > .6) {                                                    // yellow trend line over the tops
      const pts = []; for (let i = 0; i < 10; i++) { const h = 70 + 470 * Math.pow(i / 9, 1.35) + (hash(i + 2) - .5) * 40; pts.push([400 + (i + .5) * 112, 820 - h * o.rise - 40]); }
      inkLine(pts, 2.4, TK.yellow, 'ink', .4);
    }
  }
  function a03_crush(t, lt) {
    const rb = a03_ramBottom(t), k1 = hitK(t, [41.82, 42.47], .16);
    const [sx, sy] = shakeXY(t, 26 * k1 + 3);
    const pk = t < 41.62 ? seg(t, 39.8, 41.62) : 1;
    camBegin(960 + sx, 520 + sy, 1.02 + .06 * ease(pk));
    if (t < 42.47) {
      const sq = clamp((1000 - Math.max(0, rb)) / 1000, .05, 1), heat = kf(t, [[39.8, .72], [41.4, 1]]);
      {
        push(); translate(0, 1000); scale(1, sq); translate(0, -1000);
        dataCenter(t, { heat, fire: kf(t, [[39.8, .8], [41.5, 1.25]]), vp: [960, 470], seed: 3 });
        fire(960, 760, 560, 330, t, { k: kf(t, [[39.8, .8], [41.5, 1.2]]), seed: 7 });
        smoke(960, 470, t, { n: 6, h: 380, r: 70, col: '#2A2224', seed: 2 });
        cooler(160, 560, 200, t, { speed: 5, howl: 1 });
        cooler(1760, 560, 200, t, { speed: -5.5, howl: 1 });
        siren(960, 140, t, { col: '#FF3A2A', speed: 1.4, len: 700, r: 36 });
        pop();
      }
      if (rb > 0) paint(rectPts(-300, 1000, W + 600, 400), { wash: '#15171B', ink: null });
      if (t >= 41.82) {                                                                       // fire squirts out of the sides
        for (const s of [-1, 1]) fire(s < 0 ? 120 : W - 120, 1000, 420, 360 * sq + 120, t, { k: 1, seed: s + 20 });
      }
    } else {
      a03_bourse(t, { rise: 1, cap: rb, eyes: 0, noLabel: rb > 140 });
    }
    a03_ram(rb, t);
    for (const h of [41.82, 42.47]) {
      const age = t - h, y = h < 42 ? 560 : 880;
      for (let i = 0; i < 6; i++) sparks(160 + i * 320, y, age, 11 + i * 5, 10, 260);
      if (age >= 0 && age < 1) for (const s of [-1, 1]) steam(s < 0 ? 20 : W - 20, y - 40, t, { dir: s < 0 ? Math.PI : 0, k: 1 - age, len: 420, seed: s * 4 + h, n: 6, per: .6 });
    }
    camEnd();
    flash(hitK(t, [41.82, 42.47], .07) * .5, '#FFF3C8');
    a03_end(t);
  }

  // ---------- 42.9–45.05: БИРЖА looks at us and says «ЖГИ!» ----------
  function a03_talk(t, lt) {
    const eyes = seg(t, 42.8, 43.1), lookK = seg(t, 43.78, 43.9);
    const wander = Math.sin(t * 2.2) * .9, lx = lerp(wander, 0, lookK), ly = lerp(-.5 + Math.sin(t * 1.7) * .4, .35, lookK);
    const open = t < 43.78 ? .75 : lerp(1.25, 1.05, seg(t, 43.8, 44.2)), jaw = t < 44.72 ? backOut(seg(t, 44.3, 44.45)) * (.55 + .2 * Math.abs(Math.sin((t - 44.3) * 22))) : lerp(.7, 1, backOut(seg(t, 44.72, 44.86)));   // mouth opens on «говорит», gapes on the shout
    const [sx, sy] = shakeXY(t, 14 * hitK(t, [42.8, 44.72], .12));
    camBegin(960 + sx, kf(t, [[42.72, 500], [44.6, 470], [45.05, 500]]) + sy, kf(t, [[42.72, .95], [44.6, 1.0], [44.7, .92], [45.05, .98]]));
    a03_bourse(t, { rise: 1, eyes, lx, ly, open, jaw });
    camEnd();
    if (t > 44.8) {                                                                     // the shout leaves the mouth
      const p = seg(t, 44.8, 45.05), sz = lerp(60, 330, easeOut(p));
      letter('ЖГИ!', 960, 600 - 40 * p, sz, A2.hazard, { font: ruFont(sz), stroke: TK.soot, rot: -.06 + Math.sin(t * 40) * .02 });
    }
    a03_end(t);
  }

  // ---------- 45.05–52.85: the token shredder line ----------
  // the furnace in the back wall the shredder feeds: brick arch, roaring fire, flares on every chomp
  function a03_furnace(t, k) {
    paint([[600, 900], [600, 330], [700, 210], [1220, 210], [1320, 330], [1320, 900]], { wash: '#5A2A1C', fill: '#2A120C', fillOp: 110, tex: .7, border: .4, ink: INK, sw: 1.2 });
    for (let y = 250; y < 900; y += 44) inkLine([[606, y], [1314, y]], .4, '#2A120C', 'inkfine', 0);
    paint([[650, 900], [650, 360], [730, 270], [1190, 270], [1270, 360], [1270, 900]], { wash: '#FF7A1A', fill: TK.ember, fillOp: 120, bleed: .3, tex: .4, ink: INK, sw: .8 });
    fire(960, 900, 620, 560 * (.9 + .25 * k), t, { k: 1, seed: 31 });
    for (const s of [-1, 1]) fire(960 + s * 420, 900, 240, 260 + 120 * k, t + s, { k: 1, seed: 40 + s });
  }
  function a03_shredder(t) {
    const k = hitK(t, CHOMPS, .28), [jx, jy] = shakeXY(t + .3, 7 * k);
    push(); translate(jx, jy);
    // legs, body, hazard band, plate
    for (const lx of [790, 1100]) paint(rectPts(lx, 740, 30, 90), { wash: A2.gunmetal, ink: INK, sw: .6 });
    paint(rectPts(760, 600, 400, 160, 1.5), { wash: A2.steel, fill: A2.gunDk, fillOp: 100, tex: .6, border: .4, ink: INK, sw: 1 });
    hazard(760, 600, 400, 30);
    paint(rectPts(775, 636, 370, 50, 1), { wash: A2.rust, fill: '#6E2E18', fillOp: 70, tex: .5, ink: INK, sw: .7 });   // plate sits above the cart's heap
    const sfs = Math.min(34, 340 / (textW('ШРЕДЕР ТОКЕНОВ', ruFont(100)) / 100));                                      // label fits its plate
    letter('ШРЕДЕР ТОКЕНОВ', 960, 661, sfs, A2.hazard, { font: ruFont(sfs) });
    // roller housing with the open slot and interlocking teeth
    paint(rectPts(780, 460, 360, 145, 1.5), { wash: A2.gunmetal, fill: A2.steel, fillOp: 60, tex: .6, ink: INK, sw: 1 });
    paint(rectPts(810, 480, 300, 105), { wash: '#0A0B0D', ink: INK, sw: .6 });
    const sp = t * (180 + 900 * k);
    for (const [ry, dir] of [[500, 1], [562, -1]]) {
      paint(rectPts(812, ry - 14, 296, 30), { wash: A2.steelLt, fill: A2.steel, fillOp: 80, tex: .4, ink: null });
      for (let i = -1; i < 12; i++) {
        const tx = 812 + frac((i * 28 + dir * sp) / 336) * 336 - 14; if (tx < 810 || tx > 1090) continue;
        paint(dir > 0 ? [[tx, ry + 16], [tx + 20, ry + 16], [tx + 10, ry + 34]] : [[tx, ry - 14], [tx + 20, ry - 14], [tx + 10, ry - 32]], { wash: '#D8DEE4', ink: INK, sw: .3 });
      }
    }
    if (k > .2) paint(ellPts(960, 530, 170, 50, 16), { fill: A2.sodium, fillOp: 160 * k, bleed: .3, tex: .2, ink: null });
    // hopper
    paint([[680, 300], [1240, 300], [1130, 465], [790, 465]], { wash: A2.steel, fill: A2.gunDk, fillOp: 90, tex: .6, border: .4, ink: INK, sw: 1.1 });
    paint([[700, 300], [1220, 300], [1195, 322], [725, 322]], { wash: A2.gunDk, ink: null });
    hazard(700, 332, 520, 18);
    // chute + shreds pouring into the product cart
    paint([[905, 760], [1015, 760], [1030, 800], [890, 800]], { wash: A2.gunmetal, ink: INK, sw: .6 });
    for (let i = 0; i < 12; i++) {
      const p = frac(t * 2.4 + i / 12), x = 912 + hash(i) * 96 + Math.sin(t * 7 + i) * 6;
      a03_strip(x, 800 + p * 40, 20 + hash(i + 3) * 10, 1.4 + hash(i) * .5 + t * 3, i % 3 ? TK.gold : '#FFE38A');
    }
    pop();
    a03_cart(960, 900, 460, 105, t, 'ПРОДУКЦИЯ');
    for (const c of CHOMPS) a03_spray(960, 300, t - c, 26, 420, Math.floor(c * 10));
    const age = t - CHOMPS.filter(c => c <= t).slice(-1)[0];
    if (age >= 0) { sparks(820, 520, age, 3, 10, 200); sparks(1100, 520, age, 7, 10, 200); }
    return k;
  }
  function a03_cart(cx, gy, w, h, t, label) {
    const x = cx - w / 2, y = gy - h - 22;
    // the heap of shreds
    const heap = []; for (let i = 0; i <= 16; i++) { const f = i / 16; heap.push([x + 10 + f * (w - 20), y + 6 - Math.sin(f * Math.PI) * h * .8 - hash(i + 3) * 14]); }
    heap.push([x + w - 10, y + 10], [x + 10, y + 10]);
    paint(heap, { wash: TK.gold, fill: TK.goldDk, fillOp: 80, tex: .7, border: .5, ink: INK, sw: .6 });
    for (let i = 0; i < 16; i++) { const f = hash(i * 3), hx = x + 20 + f * (w - 40); a03_strip(hx, y - Math.sin(f * Math.PI) * h * .5 * hash(i + 1), 24, hash(i + 7) * 3, i % 2 ? '#FFE38A' : TK.goldDk); }
    paint([[x, y], [x + w, y], [x + w - 16, y + h], [x + 16, y + h]], { wash: A2.rust, fill: '#6E2E18', fillOp: 80, tex: .6, border: .4, ink: INK, sw: .9 });
    for (const wx of [x + 50, x + w - 50]) paint(ellPts(wx, gy - 18, 20, 20, 12), { wash: A2.gunDk, ink: INK, sw: .5 });
    if (label) {
      paint(rectPts(cx - w * .34, y + h * .25, w * .68, h * .48, 1), { wash: A2.cream, ink: INK, sw: .5 });
      letter(label, cx, y + h * .49, h * .3, TK.soot, { font: ruFont(h * .3), ink: false });
    }
  }
  function a03_gangThrow(t, side) {
    // the most recent shout of this gang: arms up, tokens fly into the hopper
    let t0 = -1e9; for (const [zt, s] of ZHGI) if (s === side && zt <= t + .4 && zt > t0) t0 = zt;
    return t0;
  }
  function a03_line(t, o = {}) {
    a03_hall(t, { lamps: [150, 1770] });
    // belts: tokens ride toward the shredder from both sides
    conveyor(60, 640, 680, t, { items: ['token'], speed: 170, gap: 130, legs: 230, seed: 1, size: .6 });
    conveyor(1180, 640, 680, t, { items: ['token'], speed: -170, gap: 130, legs: 230, seed: 5, size: .6 });
    const kLimit = kf(t, [[45.05, .64], [45.2, .56], [46.6, .48], [47.75, .4], [49.2, .12], [49.8, .06], [51.8, .03]]);
    a03_furnace(t, hitK(t, CHOMPS, .28));
    const k = a03_shredder(t);
    // gangs stand on a catwalk behind the belts (drawn after the belts so they read, feet hidden by the rail)
    for (const side of ['A', 'B']) {
      const t0 = a03_gangThrow(t, side), age = t - t0, shout = age > -.4 && age < 1.25;
      for (let i = 0; i < 3; i++) {
        const x = side === 'A' ? 300 + i * 150 : 1320 + i * 150, y = 628, u = 15.5, dl = i * .05;
        const arm = shout ? kf(age - dl, [[-.4, .2], [-.25, 1.55], [.1, 1.1], [.6, .9], [1.2, .3]]) : .3 + .15 * Math.sin(t * 6 + i);
        const bob = Math.abs(Math.sin((t + i * .1) * Math.PI * 3.1)) * (shout ? 1.2 : .4);
        if (side === 'A') clawd(x, y, u, { dy: -bob, aL: arm, aR: arm, mouth: shout && age > -.1 ? 'O' : 'grin', eyes: shout ? 'angry' : 'normal', seed: i, draw: a03_hardhat(), flip: false });
        else agentBot(x, y, u, t, { n: 7 + i * 11, dy: -bob, aL: arm, aR: arm, mouth: shout && age > -.1 ? 'O' : 'smile', eyes: shout ? 'angry' : 'normal', seed: i + 4, flip: true });
      }
      // tokens thrown in an arc into the hopper
      if (age > -.4 && age < .1) for (let j = 0; j < 5; j++) {
        const f = seg(age, -.4 + j * .04, .06), x0 = side === 'A' ? 300 + j * 80 : 1620 - j * 80, y0 = 470;
        if (f <= 0 || f >= 1) continue;
        const x1 = 900 + j * 30 - 60 * (side === 'A' ? 0 : -1), y1 = 320;
        token(lerp(x0, x1, f), lerp(y0, y1, f) - Math.sin(f * Math.PI) * 240, 26, { spin: f * 2 + j });
      }
    }
    // the rails in front of the gangs' feet
    for (const [x0, x1] of [[60, 720], [1200, 1860]]) { paint(rectPts(x0, 612, x1 - x0, 14), { wash: A2.steel, ink: INK, sw: .5 }); for (let x = x0 + 40; x < x1; x += 120) inkLine([[x, 612], [x, 640]], .6, A2.steelLt, 'inkfine', 0); }
    limitBar(600, 212, 720, kLimit, { burn: t > 47.6 ? 1 : .4 + .6 * k, glow: k * .6 });
    return k;
  }
  function a03_chorusA(t, lt) {
    const k = hitK(t, CHOMPS, .2), [sx, sy] = shakeXY(t, 12 * k);
    const z = t < 47.75 ? kf(t, [[45.05, 1.42], [45.7, 1.2], [47.75, 1.24]], easeOut) : kf(t, [[49.7, 1.34], [52.85, 1.2]]);
    const cx = t < 47.75 ? 960 : kf(t, [[49.7, 1080], [52.85, 840]]);
    camBegin(cx + sx, 545 + sy, z, t < 47.75 ? 0 : kf(t, [[49.7, -.035], [52.85, .03]]));
    a03_line(t);
    camEnd();
    const zi = ZHGI.filter(z => z[0] <= t).length - 1;                                    // only the latest shout, centred over the shredder
    if (zi >= 0) a03_caption('ЖГИ ТОКЕНЫ!', 960, 290, 130, t, ZHGI[zi][0], ZHGI[zi][1]);
    a03_end(t);
  }
  // 47.75 «Пока лимит не обнулён!»: close on the burning bar, then down to the teeth
  function a03_limit(t, lt) {
    const p = seg(t, 47.75, 49.7);
    camBegin(960, kf(t, [[47.75, 200], [48.9, 230], [49.7, 470]]), kf(t, [[47.75, 2.05], [48.9, 2.2], [49.7, 1.6]]), Math.sin(t * 3) * .015);
    a03_line(t);
    camEnd();
    if (t > 49.0) stamp('ПОЧТИ 0%', 1380, 420, 70, t, 49.04, { col: TK.ember, rot: .1 });
    a03_end(t);
  }

  // ---------- 52.85–55.25: «Ещё один миллион!» ----------
  function a03_million(t, lt) {
    const HIT = 53.65, k = hitK(t, [HIT], .25), [sx, sy] = shakeXY(t, 18 * k);
    camBegin(960 + sx, 500 + sy, kf(t, [[52.85, 1.0], [53.6, 1.06], [53.7, 1.14], [55.25, 1.08]], easeOut));
    a03_hall(t, { lamps: [180, 1740] });
    const on = t >= HIT ? 1 : 0;
    siren(300, 300, t, { col: A2.sodium, on, len: 600, r: 40 });
    siren(1620, 300, t, { col: A2.sodium, on, len: 600, r: 40, speed: -1.3 });
    paint(rectPts(400, 240, 1120, 470, 2), { wash: A2.gunmetal, fill: A2.steel, fillOp: 70, tex: .6, border: .4, ink: INK, sw: 1.2 });
    hazard(400, 240, 1120, 26);
    for (const [rx, ry] of [[425, 290], [1495, 290], [425, 685], [1495, 685]]) paint(ellPts(rx, ry, 10, 10, 8), { wash: A2.steelLt, ink: INK, sw: .4 });
    letter('СОЖЖЕНО ТОКЕНОВ', 960, 330, 54, A2.hazard, { font: ruFont(54) });
    const v = t < HIT ? lerp(999000, 999999.99, Math.pow(seg(t, 52.85, HIT), 2.2)) : 1000000;
    counter(960, 500, 140, v, { col: t >= HIT ? '#FFE38A' : A2.hazard });
    if (t >= HIT) letter('KPI ДОСТИГНУТ', 960, 640, 40, GREEN, { font: ruFont(40), pop: (t - HIT) * 4 });
    // two cheering hard-hat Clawds
    for (const [x, fl] of [[250, false], [1670, true]]) {
      const up = t >= HIT, a = up ? 1.6 + .2 * Math.sin(t * 14) : .3;
      clawd(x, 880, 17, { flip: fl, aL: a, aR: a, dy: up ? -Math.abs(Math.sin(t * 9)) * 2 : 0, mouth: up ? 'O' : 'flat', eyes: up ? 'happy' : 'look', lookX: fl ? -1 : 1, lookY: -1, draw: a03_hardhat() });
    }
    camEnd();
    if (t >= HIT) a03_confetti(t - HIT, 44, [0, -260, W, 1100], 3);
    flash(k * .5, '#FFF3C8');
    a03_end(t);
  }

  // ---------- 55.25–60.35: agents off the belt with job postings, GPUs off the upper belt ----------
  const A03_BELT = { x0: 700, x1: 2100, y: 720, sp: 170, walk: 120, gap: 1.5, T0: 45 };
  function a03_agents(t) {
    const B = A03_BELT, tEnd = (B.x1 - B.x0) / B.sp, iMax = Math.floor((t - B.T0) / B.gap), u = 15;
    for (let i = iMax; i >= 0; i--) {
      const ts = B.T0 + i * B.gap, age = t - ts; if (age < 0) continue;
      let x, y, off = age - tEnd;
      if (off < 0) { x = B.x1 - age * B.sp; y = B.y; }
      else { x = B.x0 - 40 - off * B.walk; y = B.y + (900 - B.y) * easeIn(seg(off, 0, .3)) - Math.sin(seg(off, 0, .3) * Math.PI) * 60; }
      if (x < -140) break;
      if (x > 1800) continue;
      const hired = off > .6, n = 40 + i;
      if (!hired) {
        agentBot(x, y, u, t, { n, aR: 1.35, aL: .3, flip: true, mouth: off > 0 ? 'O' : 'smile', seed: i, noShadow: off < 0 });
        // the job posting held up on a stick
        const px = x - 70, py = y - 215;
        inkLine([[x - 70, y - 75], [px, py + 48]], 1.4, A2.rust, 'ink', 0);
        paint(rotPts(rectPts(px - 95, py - 50, 190, 100, 1), px, py, -.06), { wash: A2.cream, ink: INK, sw: .7 });
        letter('ТРЕБУЕТСЯ', px, py - 20, 26, TK.ember, { font: ruFont(26), rot: -.06, ink: false });
        letter('АГЕНТ', px, py + 17, 34, TK.soot, { font: ruFont(34), rot: -.06, ink: false });
      } else {
        agentBot(x, y, u, t, { n, hire: true, walk: t * 2 + i, flip: true, mouth: 'grin', seed: i, eyes: 'happy' });
        if (off < 1.4) letter('НАНЯТ!', x, y - 200, 34, A2.acid, { font: ruFont(34), pop: (off - .6) * 5, rot: -.1 });
      }
    }
  }
  function a03_gpus(t) {
    const x0 = 560, y = 330, w = 1600, sp = -230, gap = 300, shelfY = 560;
    conveyor(x0, y, w, t, { items: ['gpu'], speed: sp, gap, legs: 0, seed: 9, size: 1.1 });
    paint(rectPts(140, shelfY, 420, 24), { wash: A2.steel, ink: INK, sw: .6 });
    for (const lx of [170, 520]) paint(rectPts(lx, shelfY + 24, 20, 160), { wash: A2.gunmetal, ink: INK, sw: .4 });
    const fallT = i => (10 - i * gap - gap * .5) / sp;                                   // time item i leaves the belt
    let nFell = 0; for (let i = 0; i < 400; i++) { const ft = fallT(i); if (ft > 55.25 && ft <= t) nFell++; }
    const shown = Math.min(3 + nFell, 7);
    for (let j = 0; j < shown; j++) gpuCard(350 + (hash(j) - .5) * 50, shelfY - 40 - j * 50, .62, t, { rot: (hash(j + 3) - .5) * .2, fans: j >= shown - 1 });
    for (let i = 0; i < 400; i++) {
      const age = t - fallT(i); if (age < 0 || age > .4) continue;
      const f = age / .4; gpuCard(lerp(x0 + 10, 360, f), lerp(y - 40, shelfY - 40 - shown * 50, f * f), .6, t, { rot: -f * 1.3 });
    }
  }
  function a03_hire(t, lt) {
    const up = seg(t, 57.95, 58.25), [sx, sy] = shakeXY(t, 6 * hitK(t, [55.30, 56.64, 58.0, 59.3], .15));
    camBegin(lerp(840, 820, ease(up)) + sx, lerp(640, 420, ease(up)) + sy, lerp(1.16, 1.24, ease(up)) + (t - 55.25) * .008);
    a03_hall(t, { lamps: [420, 1300] });
    for (let i = 0; i < 3; i++) fire(820 + i * 460, 900, 480, 300 + 60 * Math.sin(t * 5 + i), t + i, { k: 1, seed: 50 + i, n: 3, glow: false });   // the floor is still burning
    conveyor(A03_BELT.x0, A03_BELT.y, A03_BELT.x1 - A03_BELT.x0, t, { items: [() => {}], speed: -A03_BELT.sp, legs: 150, seed: 2 });
    paint(rectPts(1180, 170, 330, 56, 1), { wash: A2.rust, ink: INK, sw: .7 });
    letter('СКЛАД ЖЕЛЕЗА', 1345, 198, 32, A2.hazard, { font: ruFont(32) });
    a03_gpus(t);
    a03_agents(t);
    camEnd();
    const BIG = [[55.30, 'БОЛЬШЕ АГЕНТОВ!', 'A'], [56.64, 'БОЛЬШЕ АГЕНТОВ!', 'B'], [58.00, 'БОЛЬШЕ ЖЕЛЕЗА!', 'A'], [59.30, 'БОЛЬШЕ ЖЕЛЕЗА!', 'B']];
    const bi = BIG.filter(b => b[0] <= t).length - 1;
    if (bi >= 0) {
      paint(rectPts(-60, 60, W + 120, 170), { wash: TK.soot, washOp: 190, ink: null });
      a03_caption(BIG[bi][1], 960, 145, 120, t, BIG[bi][0], BIG[bi][2], 9);
    }
    a03_end(t);
  }

  // ---------- 60.35–66.4: «Зачем — неважно!» ×2, «Это полезно!» (ported from v1 t02 useful) ----------
  // CEO-Clawd before the «СОЖЖЕНО ЗА НЕДЕЛЮ» slide; a small Clawd asks «ЗАЧЕМ?», the sign burns on «неважно»;
  // he tries again with a bigger sign, it burns too; thumbs-up + «ПОЛЕЗНО» stamp on «полезно».
  const A03_N1 = 60.84, A03_N2 = 62.14, A03_P = 64.54;
  const a03_thumbUp = a => (u, sw) => {                     // CEO's left hand: fist + thumb pointing up in world space
    paint(rrPts(-.2 * u, -.7 * u, 1.4 * u, 1.4 * u, .45 * u), { wash: PAL.clay, ink: INK, sw: sw * .6 });
    const dx = Math.sin(a), dy = -Math.cos(a), bx = .6 * u + dx * .5 * u, by = dy * .5 * u, L = 1.5 * u, nx = -dy * .28 * u, ny = dx * .28 * u;
    paint([[bx + nx, by + ny], [bx + dx * L + nx, by + dy * L + ny], [bx + dx * L - nx, by + dy * L - ny], [bx - nx, by - ny]], { wash: PAL.clay, ink: INK, sw: sw * .6, curv: .3 });
  };
  // the sign on a stick in the hand hook; sc = sign size, burn 0..1 chars and shrinks it
  const a03_signHook = (burn, t, ang, sc) => (u, sw) => {
    push(); rotate(ang);                                  // undo the arm angle: the stick stands upright
    inkLine([[0, 0], [0, -7 * u]], sw * 1.6, '#8A5A2E', 'ink', 0);
    if (burn > .98 || sc < .02) { pop(); return; }
    const w = 9 * u * sc * (1 - burn * .3), h = 4.5 * u * sc * (1 - burn * .5), y0 = -7 * u - h + burn * h * .5;
    paint(rectPts(-w / 2, y0, w, h, 1), { wash: mixCol(A2.cream, TK.soot, burn), ink: INK, sw: sw * .7 });
    if (burn > .02) fire(0, y0 + h, w * 1.1, h * 2.2, t, { k: clamp(burn * 2) * (1 - seg(burn, .85, 1)), seed: 3, glow: false });
    pop();
  };
  function a03_useful(t, lt, o = {}) {
    const k = hitK(t, [A03_N1, A03_N2, A03_P, 64.8], .15), [sx, sy] = shakeXY(t, 12 * k + 2);
    camBegin(960 + sx, 520 + sy, 1.05 - (t - 60.35) * .01);
    a03_hall(t, { lamps: [180, 1740], dark: o.dark || 0 });
    fire(960, 1000, 2200, 330, t, { seed: 44, k: .75 });                               // the floor is still burning
    for (const cx of [620, 1300]) inkLine([[cx, -400], [cx, 90]], 1, INK, 'inkfine', 0);   // slide hangs on cables
    slide(520, 90, 880, 480, { title: 'СОЖЖЕНО ЗА НЕДЕЛЮ', graph: 'up', k: seg(t, 60.35, 61.4) });
    paint(rectPts(-100, 860, W + 200, 60, 1), { wash: A2.gunDk, fill: A2.steel, fillOp: 70, ink: INK, sw: 1 });   // stage lip
    hazard(-100, 860, W + 200, 14);
    // the one who asks: sign 1 burns on the first «неважно», a bigger sign 2 comes up for the second «зачем» and burns too
    const second = t >= 61.55, sc = second ? 1.4 * backOut(seg(t, 61.55, 61.74)) : 1;
    const burn = second ? seg(t, A03_N2 + .06, A03_N2 + .8) : seg(t, A03_N1 + .06, A03_N1 + .7);
    const sgX = 380, sgY = 880, su = 24, ang = second ? 1.3 + .08 * Math.sin(t * 16) * (1 - seg(t, 61.74, 62.1)) : 1.25;
    const scared = burn > .3;
    clawd(sgX, sgY, su, { aR: ang, armR: a03_signHook(burn, t, ang, sc), eyes: scared ? 'scared' : (second ? 'angry' : 'normal'), mouth: scared ? 'o' : (second ? 'O' : 'flat'), seed: 4,
      emote: t > 63.1 && t < A03_P ? 'sweat' : undefined, emoteK: 1 });
    if (burn < .55 && sc > .3) {                                                         // the sign text in world space, until it chars
      const hx = sgX + 4.9 * su + Math.cos(-ang) * 2.2 * su, hy = sgY - 4.5 * su + Math.sin(-ang) * 2.2 * su, sz = second ? 64 : 46;
      letter(second ? 'ЗАЧЕМ?!' : 'ЗАЧЕМ?', hx, hy - (7 + 2.25 * sc) * su, sz * Math.min(1, second ? sc / 1.4 : 1), INK, { font: ruFont(sz), ink: false, alpha: 1 - seg(burn, .2, .55) });
    }
    const up = kf(t, [[60.35, .2], [64.2, .2], [A03_P, 1.35]], backOut), happy = t >= A03_P;
    ceoClawd(1250, 880, 40, { aL: up, armL: t > 64.2 ? a03_thumbUp(up) : undefined, eyes: happy ? 'happy' : 'narrow', mouth: 'smile', click: pulse(t, 8), aR: .4 + .2 * pulse(t, 5), dy: -Math.abs(Math.sin(t * 4.9)) * .4 });
    // «неважно.» speech bubble, twice (second louder)
    for (const [t0, t1, big] of [[A03_N1, 61.6, 0], [A03_N2, 63.4, 1]]) {
      if (t < t0 || t >= t1) continue;
      const bw = big ? 380 : 300, bh = big ? 110 : 90, bx = 1480, by = 470 - big * 20;
      paint(rrPts(bx, by, bw, bh, 30), { wash: A2.cream, ink: INK, sw: 1 });
      paint([[bx + 20, by + bh - 20], [bx - 10, by + bh + 40], [bx + 60, by + bh - 5]], { wash: A2.cream, ink: null });
      letter(big ? 'НЕВАЖНО.' : 'неважно.', bx + bw / 2, by + bh / 2, big ? 58 : 48, INK, { font: ruFont(big ? 58 : 48), ink: false, pop: seg(t, t0, t0 + .25) });
    }
    camEnd();
    stamp('ПОЛЕЗНО', 965, 360, 115, t, A03_P, { col: GREEN, rot: -.12, punch: .08 });   // centred on the weekly-burn card and sized to stay on it
    if (t >= A03_P) flash(.35 * Math.exp(-(t - A03_P) * 10), GREEN);
    if (t >= 64.8 && !o.dark) a03_confetti(t - 64.8, 30, [200, -200, 1520, 1000], 11);
    if (!o.dark) a03_end(t);
  }
  // 66.4–67.1: the edit gap: power cut, the stamp afterimage, tape-stop tear
  function a03_gap(t, lt) {
    a03_useful(66.4, 6.05, { dark: .8 });
    const p = seg(t, 66.4, 66.6);
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#050607', washOp: 150 + 90 * p, ink: null });
    letter('ПОЛЕЗНО', 965, 360, 115, GREEN, { font: ruFont(115), alpha: .35 + .25 * Math.sin(t * 40), rot: -.12, ink: false });
    const tear = hitK(t, [66.87], .12);
    if (tear > .05) { paint(rectPts(-60, 380, W + 120, 60), { wash: A2.hazard, washOp: 220 * tear, ink: null }); hazard(-60, 440, W + 120, 40); }
    a03_end(t);
  }

  chapter('chorus1', 39.8, 67.1, [
    [39.8, a03_crush],
    [42.72, a03_talk],
    [45.05, a03_chorusA],
    [47.75, a03_limit],
    [49.7, a03_chorusA],
    [52.85, a03_million],
    [55.25, a03_hire],
    [60.35, a03_useful],
    [66.4, a03_gap]
  ]);
})();
