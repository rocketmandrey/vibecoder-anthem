// t02_chorus.js: «Жги токены» chapter 2 "Pre-chorus + Chorus 1" (32.35–58.8).
// Coolers howl in the data center, racks heat and catch fire → the stock-exchange board opens its eyes and its ticker
// mouth, the camera dives into the fire in its throat → the furnace: Clawd shovels tokens in on every beat, punk shouts,
// the weekly limit drains → a counter spins to 1 000 000 → agents pour out of a door, GPUs stack up → CEO-Clawd burns
// the «ЗАЧЕМ?» sign and stamps «ПОЛЕЗНО» → choir: wide pull-back of everything burning.
(() => {
  const INK = PAL.ink;
  const SHOUTS = [[39.46, 41.7], [40.72, 41.7], [44.3, 46.55], [45.6, 46.55]];

  // ---------- helpers ----------
  const bg = (col, fill, op = 120) => paint(rectPts(-100, -100, W + 200, H + 200), { wash: col, fill, fillOp: op, bleed: .1, tex: .6, border: .3, ink: null });
  function embers(t, n, seed = 0, area = [0, W], y0 = H, rise = 900) {
    for (let i = 0; i < n; i++) {
      const p = frac(t * (.25 + hash(i + seed) * .35) + hash(i + seed + 3)), x = lerp(area[0], area[1], hash(i + seed + 5)) + Math.sin(t * 2 + i) * 30;
      const r = 3 + hash(i + seed + 7) * 5;
      paint(ellPts(x, y0 - p * rise, r, r, 6), { wash: p < .5 ? TK.yellow : TK.orange, washOp: 255 * (1 - p), ink: null });
    }
  }

  // the furnace: brick body, arched mouth with fire, open iron door, chimney. (cx, gy) = bottom centre.
  function furnace(cx, gy, w, h, t, o = {}) {
    const k = o.k ?? 1, x0 = cx - w / 2, y0 = gy - h, sw = clamp(w / 500, .5, 1.4);
    glowAt(cx, gy - h * .4, w * .9, TK.orange, 70 * clamp(k));
    // chimney
    paint(rectPts(cx + w * .18, -60, w * .16, y0 + 70, 1), { wash: TK.steel, fill: TK.steelDk, fillOp: 100, tex: .5, ink: INK, sw });
    for (let i = 0; i < 3; i++) inkLine([[cx + w * .18, y0 - 40 - i * 160], [cx + w * .34, y0 - 40 - i * 160]], sw * .8, TK.steelLt, 'ink', 0);
    paint(rectPts(x0, y0, w, h, 1.5), { wash: '#7A2E1E', fill: TK.emberDk, fillOp: 120, bleed: .08, tex: .7, border: .5, ink: INK, sw: sw * 1.2 });
    const rows = 7, bh = h / rows;
    for (let r = 1; r < rows; r++) inkLine([[x0 + 6, y0 + r * bh], [x0 + w - 6, y0 + r * bh]], sw * .5, '#4A1812', 'inkfine', 0);
    for (let r = 0; r < rows; r++) for (let c = 1; c < 5; c++) { const bx = x0 + (c - (r % 2) * .5) * w / 5; if (bx > x0 + 10 && bx < x0 + w - 10) inkLine([[bx, y0 + r * bh + 3], [bx, y0 + (r + 1) * bh - 3]], sw * .45, '#4A1812', 'inkfine', 0); }
    // mouth
    const mw = w * .58, mh = h * .55, mx = cx - mw / 2, my = gy - h * .1 - mh, arch = [];
    for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; arch.push([cx + Math.cos(a) * mw / 2, my + mh * .3 + Math.sin(a) * mh * .3]); }
    const mouth = [[mx, gy - h * .1], ...arch, [mx + mw, gy - h * .1]];
    paint(mouth, { wash: '#3A0E08', fill: TK.orange, fillOp: 90 * clamp(k), bleed: .2, tex: .5, ink: null });
    fire(cx, gy - h * .1, mw * .95, mh * 1.05, t, { k: .6 + .5 * k, seed: 31, glow: false });
    paint(mouth, { ink: TK.soot, sw: sw * 2.2 });
    // open iron door, hinged on the left of the mouth
    paint([[mx - 6, my + mh * .1], [mx - w * .22, my + mh * .02], [mx - w * .22, gy - h * .02], [mx - 6, gy - h * .1]], { wash: TK.steel, fill: TK.steelDk, fillOp: 110, tex: .6, ink: INK, sw });
    for (const f of [.25, .75]) paint(ellPts(mx - w * .12, lerp(my + mh * .1, gy - h * .1, f), w * .012, w * .012, 6), { wash: TK.steelLt, ink: null });
    // brass plate
    paint(rrPts(cx - w * .16, y0 + h * .06, w * .32, h * .11, 6), { wash: TK.gold, fill: TK.goldDk, fillOp: 70, ink: INK, sw: sw * .7 });
    letter('ТОПКА', cx, y0 + h * .115, h * .075, '#5A3208', { font: ruFont(h * .075), ink: false });
  }
  // shovel held in the right arm hook: handle along the arm, blade at the end, optionally loaded with tokens
  const shovel = load => (u, sw) => {
    inkLine([[-.6 * u, 0], [4.2 * u, 0]], sw * 2.2, '#8A5A2E', 'ink', 0);
    paint([[4 * u, -1.1 * u], [6.4 * u, -1.3 * u], [6.8 * u, 0], [6.4 * u, 1.3 * u], [4 * u, 1.1 * u]], { wash: TK.steelLt, fill: TK.steel, fillOp: 90, ink: INK, sw: sw * .6, curv: .2 });
    if (load) for (let i = 0; i < 4; i++) token(5 * u + (i % 2) * u * .9, -1.4 * u - Math.floor(i / 2) * u * .8, u * .75, { rot: i, ink: false });
  };
  const shovelTip = (x, y, u, a) => [x + 4.9 * u + Math.cos(-a) * 7.6 * u, y - 4.5 * u + Math.sin(-a) * 7.6 * u];
  // the shovel cycle on the beat: throw peaks right on the beat, scoop in the second half
  const shovelA = p => p < .18 ? lerp(1.15, 1.3, p / .18) : p < .5 ? lerp(1.3, -.55, ease((p - .18) / .32)) : p < .8 ? -.55 : lerp(-.55, 1.15, easeIn((p - .8) / .2));
  function stoker(x, y, u, t, o = {}) {
    const p = frac(bpOf(t)), a = shovelA(p), load = p > .55 && p < .99;
    clawd(x, y, u, { aR: a, aL: a * .8 - .2, armR: shovel(load), rot: (a - .4) * .07, sq: p < .1 ? .08 : 0, eyes: o.eyes || 'angry', mouth: o.mouth || 'grin', seed: 2, ...o.c });
    return a;
  }
  // tokens of the current throw flying from the shovel tip into (tx, ty)
  function throwTokens(x, y, u, tx, ty, t, r = u * .8) {
    const bp = bpOf(t), p = frac(bp), q = p / .5; if (q >= 1) return 0;
    const [sx, sy] = shovelTip(x, y, u, 1.25);
    for (let i = 0; i < 5; i++) {
      const qq = clamp(q * (1 + hash(i + 3) * .25) - hash(i) * .12); if (qq <= 0 || qq >= 1) continue;
      const px = lerp(sx, tx + (hash(i + 7) - .5) * 60, qq), py = lerp(sy, ty, qq) - Math.sin(qq * Math.PI) * (140 + hash(i + 9) * 90);
      token(px, py, r * (1 - qq * .35), { spin: t * 3 + i * .3, burn: qq * .9, rot: i });
    }
    return q;
  }
  function tokenPile(cx, gy, R, n = 26) {
    for (let i = 0; i < n; i++) {
      const row = Math.floor(Math.sqrt(i * 1.3)), a = hash(i + 40), x = cx + (a - .5) * R * 2 * (1 - row * .16), y = gy - row * R * .22 - hash(i + 41) * 10;
      token(x, y, R * .16, { rot: hash(i) * 3, spin: hash(i + 2) * .4 });
    }
  }

  // ---------- the exchange board with eyes ----------
  function eye(cx, cy, rx, ry, o) {
    paint(ellPts(cx, cy, rx * 1.12, ry * 1.14, 24), { wash: TK.steelDk, ink: INK, sw: 1.4 });
    paint(ellPts(cx, cy, rx, ry, 24), { wash: o.white || '#E8F7E4', fill: '#BFE8C8', fillOp: 70, tex: .4, ink: null });
    const px = cx + o.lx * rx * .42, py = cy + o.ly * ry * .35, ir = ry * .62;
    paint(ellPts(px, py, ir, ir, 18), { wash: o.iris || TK.green, fill: TK.greenDk, fillOp: 90, tex: .5, ink: INK, sw: .8 });
    paint(ellPts(px, py, ir * .55, ir * .55, 14), { wash: TK.soot, ink: null });
    paint([[px, py - ir * .38], [px + ir * .34, py + ir * .24], [px - ir * .34, py + ir * .24]], { wash: o.glyph || TK.led, ink: null });   // the ▲ pupil
    paint(ellPts(px - ir * .4, py - ir * .45, ir * .16, ir * .1, 8, 0, -.6), { wash: '#FFFFFF', washOp: 200, ink: null });
    const lid = cy - ry + ry * 2 * clamp(o.close);                       // top lid comes down to lid
    if (o.close > .02) {
      const pts = ellPts(cx, cy, rx * 1.02, ry * 1.04, 24).map(([x, y]) => [x, Math.min(y, lid)]);
      paint(pts, { wash: TK.steel, fill: TK.steelDk, fillOp: 90, ink: null });
      inkLine(ellPts(cx, cy, rx * 1.02, ry * 1.04, 24).filter(([, y]) => y >= lid - 2).length ? [[cx - rx * Math.sqrt(Math.max(0, 1 - Math.pow((lid - cy) / ry, 2))), lid], [cx + rx * Math.sqrt(Math.max(0, 1 - Math.pow((lid - cy) / ry, 2))), lid]] : [[cx, lid], [cx, lid]], 2, INK, 'ink', 0);
    }
  }
  function board(t, o) {
    const cx = 960, top = 110, w = 1480, h = 760, x0 = cx - w / 2;
    paint(rectPts(cx - 18, -40, 12, top + 40), { wash: TK.steelDk, ink: INK, sw: .6 });
    paint(rectPts(cx + 260, -40, 12, top + 40), { wash: TK.steelDk, ink: INK, sw: .6 });
    paint(rectPts(cx - 290, -40, 12, top + 40), { wash: TK.steelDk, ink: INK, sw: .6 });
    paint(rrPts(x0, top, w, h, 40, 2), { wash: TK.steel, fill: TK.steelDk, fillOp: 120, tex: .6, border: .5, ink: INK, sw: 1.6 });
    paint(rrPts(x0 + 30, top + 30, w - 60, h - 60, 26, 1), { wash: '#0F1A14', fill: TK.greenDk, fillOp: 40 + 60 * o.heat, tex: .5, ink: null });
    if (o.heat > .05) glowAt(cx, top + h * .7, 520, TK.orange, 90 * o.heat);
    // cheek columns of quotes, scrolling up
    const q = ['NVDA 1204 ▲', 'TOKN 88.4 ▲', 'GPU 540 ▲', 'CAPEX 999 ▲', 'AGI  СКОРО ▲', 'ВАТТ 77.0 ▲', 'МЕДЬ 12.9 ▲', 'ВОДА 3.14 ▲'];
    for (const side of [-1, 1]) for (let i = 0; i < 7; i++) {
      const yy = top + 80 + frac(i / 7 - t * .12) * (h - 150);
      letter(q[(i * 3 + (side > 0 ? 2 : 0)) % q.length], cx + side * 610, yy, 26, i % 2 ? TK.led : TK.green, { font: ruFont(26), ink: false, alpha: .8 });
    }
    // brows
    for (const s of [-1, 1]) {
      const bx = cx + s * 300, by = 250 - o.brow * 20, tilt = o.browTilt * s;
      paint([[bx - 200, by + tilt * 40], [bx + 200, by - tilt * 40], [bx + 190, by - tilt * 40 + 30], [bx - 190, by + tilt * 40 + 30]], { wash: TK.green, fill: TK.greenDk, fillOp: 80, ink: INK, sw: .9 });
    }
    for (const s of [-1, 1]) eye(cx + s * 300, 420, 190, 140, { lx: o.lx, ly: o.ly, close: o.close, iris: o.heat > .4 ? TK.orange : TK.green, glyph: o.heat > .4 ? TK.yellow : TK.led });
    // ticker mouth
    const mw = 760, mh = 64 + o.open * 300, my = 700 - o.open * 60;
    paint(rrPts(cx - mw / 2, my - mh / 2, mw, mh, 26 + o.open * 60, 1.5), { wash: o.open > .1 ? '#3A0E08' : TK.soot, ink: INK, sw: 1.6 });
    if (o.open > .2) {
      fire(cx, my + mh / 2 - 6, mw * .8, mh * 1.1 * clamp(o.fire), t, { seed: 17, glow: false });
      if (o.open > .25) for (let i = 0; i < 7; i++) {                                  // teeth: little LED segments
        const tx = cx - mw * .42 + i * mw * .14;
        paint(rectPts(tx, my - mh / 2 + 6, mw * .09, 22), { wash: TK.led, ink: INK, sw: .5 });
        paint(rectPts(tx, my + mh / 2 - 28, mw * .09, 22), { wash: TK.led, ink: INK, sw: .5 });
      }
    }
    if (o.open > .3) letter('ЖГИ ▲ ТОКЕНЫ ▲', cx, my - mh / 2 + 62, 44, TK.yellow, { font: ruFont(44), ink: false });
    else letter(['TOKN ▲ +12%', 'NVDA ▲ +7.2%', 'GPU ▲ +9.1%'][Math.floor(t * 1.66) % 3], cx, my, 40, TK.green, { font: ruFont(40), ink: false });
    // plate
    paint(rrPts(cx - 170, top - 50, 340, 80, 12), { wash: TK.soot, ink: TK.green, sw: 1.2 });
    letter('БИРЖА', cx, top - 10, 52, TK.led, { font: ruFont(52), ink: false });
  }

  // ---------- 32.35 data center: coolers howl, racks heat, fire on the racks ----------
  function hall(t, lt) {
    const heat = kf(t, [[32.35, .1], [33.5, .55], [34.3, 1]]), fk = seg(t, 33.45, 34.1);
    const [sx, sy] = shakeXY(t, 4 + 8 * fk * pulse(t, 5));
    camBegin(960 + sx, 520 + sy, 1 + lt * .06);
    dataCenter(t, { heat, fire: fk, vp: [960, 500] });
    embers(t, 10 * fk, 3, [300, 1620], 900);
    const how = seg(t, 32.35, 32.6);
    for (const [x, s] of [[210, 1], [1710, -1]]) {
      cooler(x, 360, 170, t + s, { speed: 6, howl: how * (.7 + .3 * pulse(t, 4)) });
      cooler(x, 760, 150, t + s * 2, { speed: 7, howl: how * (.7 + .3 * pulse(t, 4)) });
    }
    camEnd();
    for (const [t0, x, y] of [[32.45, 420, 190], [32.95, 1490, 230], [33.5, 470, 600]]) sfx('ВУУУ!', x, y, 70, TK.cream, t - t0, { font: ruFont(70), life: 1 });
    if (fk > 0) flash(.35 * Math.exp(-(t - 33.45) * 7), TK.yellow);
  }

  // ---------- 34.7 the exchange board watches, then speaks ----------
  function exchange(t, lt) {
    bg(TK.soot, TK.steelDk);
    const open = kf(t, [[35.9, 0], [36.05, .35], [36.3, .12], [36.5, .4], [36.8, .1], [37.45, .15], [39.2, 1]], easeOut);
    const heat = seg(t, 37.4, 38.6), zoom = kf(t, [[34.7, 1.25], [35.3, 1], [37.6, 1.02], [39.4, 3.6]], x => easeIn(x) * .7 + ease(x) * .3);
    const look = kf(t, [[34.7, [-.8, .3]], [35.3, [-.8, .3]], [35.6, [.8, .2]], [35.9, [0, .1]]], backOut);
    const [sx, sy] = shakeXY(t, 10 * heat);
    camBegin(960 + sx, lerp(520, 680, seg(zoom, 1.02, 3.6)) + sy, zoom);
    ticker(t, { y: -30, h: 70 });
    board(t, {
      open, fire: .4 + heat, heat, lx: look[0], ly: look[1],
      close: kf(t, [[34.7, 1], [35.0, 1], [35.3, .2], [35.55, .2], [35.7, .45]]) * (1 - heat * .8),
      brow: open * 1.5, browTilt: kf(t, [[35.5, 0], [35.75, .35], [37.4, .35], [38, -.2]])
    });
    // the board's price chart as a floor display, still going up
    stockChart(760, 900, 400, 200, t, { k: seg(t, 34.7, 37), n: 12, seed: 4 });
    camEnd();
    if (t > 38.9) flash(ease(seg(t, 38.9, 39.4)) * .85, TK.orange);
  }

  // ---------- 39.4 the furnace: shovel on the beat, shouts, limit drains ----------
  function furnaceRoom(t, lt, o = {}) {
    bg('#2A1614', TK.emberDk, 110);
    // back wall: brick hint + racks silhouettes glowing
    for (let i = 0; i < 4; i++) serverRack(40 + i * 150, 190, 120, 560, t, { heat: 1, seed: i, units: 7, fire: .8 });
    paint(rectPts(-100, 880, W + 200, 400), { wash: '#241816', fill: TK.orangeDk, fillOp: 60, tex: .6, ink: null });
    furnace(1300, 900, 760, 700, t, { k: 1 + .6 * pulse(t, 4) });
    smoke(1300 + 760 * .26, 30, t, { n: 4, h: 260, r: 60 });
    tokenPile(380, 900, 300);
    stoker(640, 890, 32, t);
    throwTokens(640, 890, 32, 1300, 690, t, 26);
    embers(t, 12, 9, [900, 1700], 880, 800);
  }
  function chorus(t, lt) {
    const hit = pulse(t, 7), [sx, sy] = shakeXY(t, 7 * hit);
    camBegin(980 + sx + Math.sin(lt * .4) * 20, 540 + sy, 1.04 + lt * .008 + hit * .012);
    furnaceRoom(t, lt);
    camEnd();
    const inLine = t >= 41.7 && t < 44.25;
    // the weekly limit: small in the corner, big while it drains
    const v = kf(t, [[39.4, .62], [41.7, .55], [44.1, 0]], x => x), big = seg(t, 41.6, 41.85) * (1 - seg(t, 44.15, 44.4));
    const bw = lerp(520, 1100, big), bx = lerp(60, 410, big), by = lerp(100, 190, big);
    paint(rrPts(bx - 24, by - bw * .085 * .55 * 1.6 - 22, bw + 48, bw * .085 * 1.9 + 40 + big * 60, 18), { wash: TK.soot, washOp: 200, ink: null });
    limitBar(bx, by, bw, v, { burn: inLine ? 1 : .4, glow: inLine ? .8 * pulse(t, 4) : 0 });
    if (inLine) letter('СГОРАЕТ…', bx + bw / 2, by + bw * .085 + 50, 44, TK.yellow, { font: ruFont(44), ink: false, alpha: .6 + .4 * pulse(t, 3) });
    if (t >= 44.1 && t < 44.3) flash(.3, TK.ember);
    SHOUTS.forEach(([t0, t1], i) => { if (t >= t0 && t < t1) punkText('ЖГИ ТОКЕНЫ!', i % 2 ? 1180 : 760, i % 2 ? 480 : 330, i % 2 ? 110 : 125, t, t0, { seed: i * 13 }); });
    if (SHOUTS.some(([t0]) => t >= t0 && t - t0 < .12)) flash(.12, TK.yellow);
  }

  // ---------- 46.55 «ещё один миллион!» ----------
  function million(t, lt) {
    const land = 48.25, age = t - land, v = age >= 0 ? 1e6 : 1e6 * easeOut(seg(t, 46.6, land)) * .999;
    const [sx, sy] = shakeXY(t, age >= 0 && age < .3 ? 16 * (1 - age / .3) : 3);
    camBegin(960 + sx, 520 + sy, 1.25 - seg(t, 46.55, 49.5) * .12 + (age >= 0 ? .06 * Math.exp(-age * 8) : 0));
    furnaceRoom(t, lt);
    camEnd();
    paint(rectPts(-60, 200, W + 120, 330, 2), { wash: TK.soot, washOp: 215, ink: null });
    letter('СОЖЖЕНО ТОКЕНОВ', 960, 270, 58, TK.cream, { font: ruFont(58) });
    counter(960, 420, 150, v, { col: age >= 0 ? TK.yellowLt : TK.yellow });
    if (age >= 0) {
      glowAt(960, 420, 700, TK.yellow, 90 * Math.exp(-age * 3));
      for (let i = 0; i < 16; i++) {                                               // gold burst of coins from the counter
        const a = i / 16 * TAU + .2, d = easeOut(age * 1.4) * (420 + hash(i) * 380), g = age * age * 900;
        token(960 + Math.cos(a) * d * 1.3, 420 + Math.sin(a) * d * .7 + g, 26, { spin: t * 2 + i * .2, rot: i, burn: seg(age, .3, 1.1) });
      }
      stamp('+1 000 000', 1480, 580, 70, t, land, { col: TK.yellow, rot: .1 });
      flash(.5 * Math.exp(-age * 9), TK.yellowLt);
    }
  }

  // ---------- 49.5 more agents! more hardware! ----------
  function more(t, lt) {
    const heat = .7 + .3 * pulse(t, 4);
    dataCenter(t, { heat: .85, fire: .6, vp: [960, 470], n: 6 });
    paint(rectPts(-100, 830, W + 200, 400), { wash: '#241816', fill: TK.orangeDk, fillOp: 50, tex: .6, ink: null });
    const [sx, sy] = shakeXY(t, 5 * pulse(t, 6));
    camBegin(960 + sx, 540 + sy, 1.02);
    // the door: «АГЕНТЫ», flung open
    const dx = 150, dy = 320, dw = 230, dh = 480, op = easeOut(seg(t, 49.45, 49.65));
    paint(rectPts(dx - 20, dy - 20, dw + 40, dh + 20, 1), { wash: TK.steel, ink: INK, sw: 1.2 });
    paint(rectPts(dx, dy, dw, dh), { wash: '#FFF3C8', fill: TK.yellow, fillOp: 120, bleed: .2, ink: null });
    paint([[dx, dy], [dx - dw * .75 * op + dw * (1 - op), dy - 40 * op], [dx - dw * .75 * op + dw * (1 - op), dy + dh + 40 * op], [dx, dy + dh]], { wash: TK.blueDk, fill: TK.blue, fillOp: 80, ink: INK, sw: 1 });
    paint(rrPts(dx + 20, dy - 90, dw - 40, 56, 8), { wash: TK.blue, ink: INK, sw: .8 });
    letter('АГЕНТЫ', dx + dw / 2, dy - 62, 36, TK.cream, { font: ruFont(36), ink: false });
    const N = 16;
    for (let i = N - 1; i >= 0; i--) {                                              // pour out along a lane toward the camera
      const a = t - (49.55 + i * .11); if (a < 0) continue;
      const lane = i % 3, x = dx + dw / 2 + a * (420 + hash(i) * 160), y = dy + dh + lane * 26 + Math.min(1, a * 2) * 20;
      if (x > 2100) continue;
      agentBot(x, y, 12 + lane * 1.5, t, { n: i + 1, dance: 'run', seed: i, eyes: 'happy', mouth: 'grin', noShadow: true });
    }
    // GPUs stacking up on the right
    const G = 8;
    for (let i = 0; i < G; i++) {
      const tl = 50.6 + i * .14, a = t - tl; if (a < 0) break;
      const fy = 860 - i * 84, y = a < .16 ? lerp(-120, fy, easeIn(a / .16)) : fy + (a < .3 ? Math.sin((a - .16) / .14 * Math.PI) * 10 : 0);
      gpuCard(1480 + (hash(i) - .5) * 60, y, .72, t, { rot: (hash(i + 4) - .5) * .12, glow: i === G - 1 ? .5 : 0 });
    }
    camEnd();
    if (t >= 49.5) punkText('БОЛЬШЕ АГЕНТОВ!', 520, 150, 70, t, 49.5, { seed: 5 });
    if (t >= 50.7) punkText('БОЛЬШЕ ЖЕЛЕЗА!', 1440, 150, 70, t, 50.7, { seed: 8 });
  }

  // ---------- 51.75 «Зачем — неважно! Это полезно!» ----------
  const thumbUp = a => (u, sw) => {                     // CEO's left hand: fist + thumb pointing up in world space
    paint(rrPts(-.2 * u, -.7 * u, 1.4 * u, 1.4 * u, .45 * u), { wash: PAL.clay, ink: INK, sw: sw * .6 });
    const dx = Math.sin(a), dy = -Math.cos(a), bx = .6 * u + dx * .5 * u, by = dy * .5 * u, L = 1.5 * u, nx = -dy * .28 * u, ny = dx * .28 * u;
    paint([[bx + nx, by + ny], [bx + dx * L + nx, by + dy * L + ny], [bx + dx * L - nx, by + dy * L - ny], [bx - nx, by - ny]], { wash: PAL.clay, ink: INK, sw: sw * .6, curv: .3 });
  };
  const signHook = (burn, t, ang) => (u, sw) => {
    push(); rotate(ang);                                  // undo the arm angle: the stick stands upright
    inkLine([[0, 0], [0, -7 * u]], sw * 1.6, '#8A5A2E', 'ink', 0);
    if (burn > .98) { pop(); return; }
    const w = 9 * u * (1 - burn * .3), h = 4.5 * u * (1 - burn * .5), y0 = -7 * u - h + burn * h * .5;
    paint(rectPts(-w / 2, y0, w, h, 1), { wash: mixCol(TK.cream, TK.soot, burn), ink: INK, sw: sw * .7 });
    if (burn > .02) fire(0, y0 + h, w * 1.1, h * 2.2, t, { k: clamp(burn * 2) * (1 - seg(burn, .85, 1)), seed: 3, glow: false });
    pop();
  };
  function useful(t, lt) {
    bg('#2A1614', TK.emberDk, 110);
    const [sx, sy] = shakeXY(t, t > 53.9 && t < 54.3 ? 12 : 2);
    camBegin(960 + sx, 520 + sy, 1.05 - lt * .01);
    fire(960, 1000, 2200, 360, t, { seed: 44, k: .8 });
    slide(520, 90, 880, 480, { title: 'СОЖЖЕНО ЗА НЕДЕЛЮ', graph: 'up', k: seg(t, 51.75, 53) });
    paint(rectPts(-100, 860, W + 200, 60, 1), { wash: TK.soot, fill: TK.sootLt, fillOp: 80, ink: INK, sw: 1 });      // stage lip
    // the lone user with the sign; it catches fire on «неважно»
    const burn = seg(t, 52.45, 53.2), sgX = 400, sgY = 880, su = 24, ang = 1.25;
    clawd(sgX, sgY, su, { aR: ang, armR: signHook(burn, t, ang), eyes: burn > .3 ? 'scared' : 'normal', mouth: burn > .3 ? 'o' : 'flat', seed: 4 });
    // the sign text in world space (arm tip + up the stick), until it chars
    if (burn < .55) {
      const hx = sgX + 4.9 * su + Math.cos(-ang) * 2.2 * su, hy = sgY - 4.5 * su + Math.sin(-ang) * 2.2 * su;
      letter('ЗАЧЕМ?', hx, hy - 9.25 * su, 44, INK, { font: ruFont(44), ink: false, alpha: 1 - seg(burn, .2, .55) });
    }
    const up = kf(t, [[51.75, .2], [53.25, .2], [53.55, 1.35]], backOut), happy = t > 53.25;
    ceoClawd(1250, 880, 40, { aL: up, armL: thumbUp(up), eyes: happy ? 'happy' : 'narrow', mouth: 'smile', click: pulse(t, 8), aR: .4 + .2 * pulse(t, 5), dy: -Math.abs(Math.sin(bpOf(t) * Math.PI)) * .4 });
    if (t > 52.2 && t < 53.3) {
      paint(rrPts(1480, 470, 300, 90, 30), { wash: TK.cream, ink: INK, sw: 1 });
      paint([[1500, 540], [1470, 600], [1540, 555]], { wash: TK.cream, ink: null });
      letter('неважно.', 1630, 515, 48, INK, { font: ruFont(48), ink: false, pop: seg(t, 52.2, 52.45) });
    }
    camEnd();
    stamp('ПОЛЕЗНО', 1260, 330, 150, t, 53.85, { col: TK.green, rot: -.12, punch: .08 });
    if (t >= 53.85) flash(.35 * Math.exp(-(t - 53.85) * 10), TK.green);
  }

  // ---------- 55.2 choir: pull back over everything burning ----------
  function choir(t, lt) {
    const k = ease(seg(t, 55.2, 58.4)), zoom = lerp(2.3, 1, k), cy = lerp(660, 540, k);
    camBegin(960, cy, zoom);
    dataCenter(t, { heat: 1, fire: 1, vp: [960, 420], n: 7 });
    // the exchange board hangs above, eyes happy
    camEnd(); camBegin(960 - (960 - 960) / .36, 110 - (40 - cy) / .36, zoom * .36);   // the board in its own frame, so its letters follow
    board(t, { open: .35 + .15 * Math.abs(Math.sin(t * 2)), fire: 1, heat: 1, lx: 0, ly: .6, close: .35, brow: .5, browTilt: -.2 });
    camEnd(); camBegin(960, cy, zoom);
    paint(rectPts(-100, 870, W + 200, 400), { wash: '#241816', fill: TK.orangeDk, fillOp: 70, tex: .6, ink: null });
    furnace(960, 880, 520, 450, t, { k: 1.3 });
    // GPU tower on fire (right), agents with raised arms (left), Clawd still shovelling
    for (let i = 0; i < 6; i++) gpuCard(1560 + (hash(i) - .5) * 40, 850 - i * 62, .5, t, { rot: (hash(i + 4) - .5) * .12, fans: false });
    fire(1560, 500, 260, 300, t, { seed: 61 });
    for (let i = 0; i < 5; i++) agentBot(150 + i * 105, 890 - (i % 2) * 24, 9, t, { n: i + 3, dance: 'roof', seed: i, mouth: 'O', eyes: 'closed', noShadow: true });
    stoker(640, 880, 13, t, { eyes: 'closed', mouth: 'O' });
    throwTokens(640, 880, 13, 960, 740, t, 12);
    embers(t, 16, 21, [0, W], 1000, 1000);
    tokenRain(t, { n: 8, seed: 3, r: 16, burn: .5 });
    camEnd();
    limitBar(70, 90, 440, 0, { burn: 1 });
    letter('О-О-О-О-О!', 1500, 150, 70, TK.yellow, { font: ruFont(70), rot: -.06, alpha: seg(t, 55.3, 55.8), pop: seg(t, 55.3, 55.6) });
  }

  chapter('chorus1', 32.35, 58.8, [
    [32.35, hall], [34.7, exchange], [39.4, chorus], [46.55, million], [49.45, more], [51.75, useful], [55.2, choir]
  ]);
})();
