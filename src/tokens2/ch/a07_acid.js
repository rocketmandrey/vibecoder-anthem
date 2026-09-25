// a07_acid.js: «Жги токены» v2 chapter 7 "ACID DROP" (132.55–157.35), the centrepiece.
// «БОЛЬШЕ GPU!» ×3, each one escalates on CEO-Clawd in black shades:
//   132.55 a GPU grows out of his head (then a tower of them) · 137.7 he turns into a PCIe slot · 143.9 the whole
//   factory plugs into him. Each hit flips the frame into acidField + acid-smiley tokens with a SHORT Matrix burst.
//   In the gaps (135.2–137.7, 140.2–143.9) the watercolour runs and Clawd holds his own slipping outline together.
// 145.55 the loop lines: GPU → ТОКЕНЫ → АГЕНТЫ → ЗАДАЧИ → ТОКЕНЫ, each line lights its pair, tasks multiply like wet prints.
// 155.0 «ЭКОНОМИКА РАБОТАЕТ!»: the factory's output chute («ВЫХОД») feeds its own mouth («ВХОД»). Hard cut at 157.35.
(() => {
  const INK = PAL.ink;
  const HIT1 = 132.55, HIT2 = 137.7, HIT3 = 143.9, LOOP0 = 145.55, ECO = 155.0, END = 157.35;
  const W1 = [132.64, 133.34], W2 = [137.78, 138.48], W3 = [143.94, 144.8];         // «Больше» / «GPU!» word onsets

  // ---------- helpers ----------
  // squelch-bent lettering: each glyph bobs on the 303 wobble, pops in on t0
  function sqText(txt, x, y, size, t, t0, sq, o = {}) {
    const age = t - t0; if (age < 0) return;
    const font = ruFont(size), chars = [...txt], ws = chars.map(c => textW(c, font) * 1.02), tot = ws.reduce((a, b) => a + b, 0);
    const cols = o.cols || [A2.acid, A2.magenta, A2.hazard];
    let cx = x - tot / 2;
    chars.forEach((c, i) => {
      const mid = cx + ws[i] / 2; cx += ws[i]; if (c === ' ') return;
      const la = age - i * .03; if (la < 0) return;
      const bend = Math.sin(i * .9 + t * 13) * (.15 + sq) * size * .35, s = size * (1 + .25 * sq * Math.sin(i * 1.7 + t * 9));
      letter(c, mid, y + bend, s, cols[i % cols.length], { font: ruFont(s), rot: Math.sin(i * 1.3 + t * 7) * .25 * (.2 + sq), stroke: INK, pop: la * 6, ink: false, alpha: o.alpha ?? 1 });
    });
  }
  // the short Matrix burst on a «БОЛЬШЕ GPU!» hit (the only Matrix in this chapter): ~1 s, then gone
  function mxBurst(t, t0, seed) {
    const k = seg(t, t0, t0 + .06) * (1 - seg(t, t0 + .55, t0 + 1.05)); if (k < .01) return 0;
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: A2.matrixBg, washOp: 190 * k * (1 - seg(t, t0 + .2, t0 + .9)), ink: null });
    matrixRain(t, { k: .8 * k, seed, size: 36, speed: 1.6 });
    return k;
  }
  // acid-smiley tokens bouncing on the checker floor, kicked by the hits
  function smileyCrowd(t, hits, o = {}) {
    const n = o.n || 6, y0 = o.y ?? 560, R = o.r || 62, hk = hitK(t, hits, .22);
    for (let i = 0; i < n; i++) {
      const side = i % 2 ? 1 : -1, x = W / 2 + side * (360 + Math.floor(i / 2) * 250 + hash(i) * 60), depth = 1 - Math.floor(i / 2) * .12;
      const b = Math.abs(Math.sin(t * 5.2 + i * 1.1)) * 50 + hk * 70;
      acidSmiley(x, y0 + Math.floor(i / 2) * 70 - b, R * depth * (1 + hk * .2), t, { rot: Math.sin(t * 3 + i) * .3, melt: o.melt ?? .15 + .1 * Math.sin(t * 2 + i), glow: hk * .7 });
    }
  }
  // the GPU tower on CEO-Clawd's head (body-local; `n` cards grown by times `gt`)
  const gpuTower = (t, gt) => (u, sw) => {
    gt.forEach((g0, i) => {
      const g = backOut(seg(t, g0, g0 + .22)); if (g < .02) return;
      const s = .78 * g, h = 130 * s, y = -8 * u - h / 2 - i * 118 * .78 + (1 - g) * 40;
      if (i === 0) for (const sx of [-1, 1]) inkLine([[sx * 1.6 * u, -8 * u], [sx * 2.2 * u, -8.8 * u], [sx * 1.4 * u, -9.5 * u]], sw * .8, TK.greenDk, 'ink', .6);   // sprouts
      gpuCard(Math.sin(t * 4 + i) * 6 * i, y, s, t, { rot: Math.sin(t * 3 + i * 2) * .05 * i, glow: .5 * hitK(t, [g0], .3) + .15 });
    });
  };
  // the PCIe-slot CEO: long slot body, four stubby Clawd legs, face plate with the shades on the left end
  function slotCEO(cx, cy, w, t, o = {}) {
    const h = o.h || 120, x0 = cx - w / 2, sq = o.sq || 0, lit = o.lit || 0;
    for (const lx of [.1, .3, .7, .9]) paint(rectPts(x0 + w * lx - 16, cy + h / 2 - 8, 32, 62 * (1 - sq * .4), 1), { wash: '#3E5A8C', ink: INK, sw: .8 });
    paint(ellPts(cx, cy + h / 2 + 58, w * .55, 22, 22), { fill: INK, fillOp: 90, bleed: .25, tex: .3, ink: null });
    if (lit > .02) paint(ellPts(cx, cy, w * .62, h * 1.8, 24), { fill: A2.acid, fillOp: 140 * lit, bleed: .3, tex: .2, ink: null });
    paint(rrPts(x0, cy - h / 2, w, h, h * .22, 1.5), { wash: '#16181C', fill: TK.sootLt, fillOp: 80, tex: .6, border: .4, ink: INK, sw: 1.2 });
    const sx = x0 + h * 1.35, sw2 = w - h * 1.35 - h * .55;                                    // the slot + gold pins
    paint(rectPts(sx, cy - h * .16, sw2, h * .32, .5), { wash: '#050607', ink: INK, sw: .6 });
    for (let px = sx + 10; px < sx + sw2 - 6; px += 11) if (Math.abs(px - (sx + sw2 * .22)) > 12) inkLine([[px, cy - h * .1], [px, cy + h * .1]], .7, lerp(0, 1, lit) > .5 ? A2.hazard : TK.gold, 'inkfine', 0);
    paint(rectPts(sx + sw2 * .22 - 7, cy - h * .2, 14, h * .4), { wash: '#16181C', ink: null });   // key notch
    paint(rrPts(x0 + w - h * .5, cy - h * .38, h * .38, h * .76, 6), { wash: A2.hazard, ink: INK, sw: .7 });   // retention latch
    // face plate: Clawd's clay end cap, the shades, a grin, the headset
    const fx = x0 + h * .12, fw = h * 1.1;
    paint(rrPts(fx, cy - h * .42, fw, h * .84, h * .12), { wash: PAL.clay, fill: PAL.clayDk, fillOp: 70, tex: .5, ink: INK, sw: .9 });
    paint(rrPts(fx + fw * .06, cy - h * .3, fw * .88, h * .24, 5), { wash: '#0A0D0B', ink: INK, sw: .6 });
    inkLine([[fx + fw * .15, cy - h * .2], [fx + fw * .32, cy - h * .26]], .6, A2.matrix, 'inkfine', 0);
    inkLine([[fx + fw * .58, cy - h * .2], [fx + fw * .75, cy - h * .26]], .6, A2.matrix, 'inkfine', 0);
    const gr = o.grin ?? .5;
    paint([[fx + fw * .22, cy + h * .08], [fx + fw * .78, cy + h * .08], [fx + fw * .66, cy + h * (.12 + .18 * gr)], [fx + fw * .34, cy + h * (.12 + .18 * gr)]], { wash: '#4A1F2A', ink: INK, sw: .6, curv: .3 });
    inkLine([[fx - 4, cy - h * .1], [fx + fw * .1, cy + h * .2], [fx + fw * .25, cy + h * .14]], .7, TK.sootLt, 'ink', .6);
    letter('PCIe ×16', sx + sw2 * .62, cy + h * .33, h * .15, TK.gold, { font: ruFont(h * .15), ink: false });
  }
  // a task sheet (cream, three checkboxes); wet = smeared ink copy
  function taskSheet(x, y, s, rot, o = {}) {
    const w = 92 * s, h = 116 * s, wet = o.wet || 0, pale = o.pale || 0;
    const paper = mixCol(A2.cream, '#D8D0FF', pale * .5), ink = mixCol(INK, '#8C83B8', pale);
    const R = pts => rotPts(pts, x, y, rot);
    paint(R(rectPts(x - w / 2, y - h / 2, w, h, 1)), { wash: paper, fill: wet > .1 ? '#9A92C8' : '#CFC4AA', fillOp: 40 + 60 * wet, bleed: .1 + .3 * wet, tex: .6, ink: ink, sw: .5 * s + .2 });
    if (s > .35) for (let q = 0; q < 3; q++) {
      const yy = y - h * .15 + q * h * .22;
      paint(R(rectPts(x - w * .36, yy - w * .07, w * .14, w * .14)), { ink, sw: .35 });
      inkLine(R([[x - w * .14, yy], [x + w * .36, yy + (wet ? 3 : 0)]]), .45, ink, 'inkfine', 0);
    }
    if (s > .4) letter('ЗАДАЧА', x, y - h * .36, 15 * s, mixCol(A2.rust, '#8C83B8', pale), { font: ruFont(15 * s), rot, ink: false, alpha: 1 - pale * .4 });
  }

  // ---------- 132.55 «БОЛЬШЕ GPU!» #1: shades on, a GPU grows out of the CEO's head (then a tower) ----------
  function drop1(t, lt) {
    const hits = [...W1, ...hitsIn(132.3, 135.2)], hk = hitK(t, hits, .2), sq = squelch(t, HIT1, 135.2);
    acidField(t, { k: .75 + hk * .5, sq });
    const [sx, sy] = shakeXY(t, 10 * hk);
    camBegin(960 + sx, 560 + sy - lt * 30, 1 + lt * .035 + .05 * hk);
    mxBurst(t, HIT1, 7);
    flushLetters();
    smileyCrowd(t, hits, { n: 6, y: 600 });
    const grows = [W1[1], 133.72, 134.36, 134.9];
    ceoClawd(960, 880, 40, {
      hat: 'shades', mouth: t > W1[1] ? 'grin' : 'smile', noClicker: false, click: hk,
      aL: .3 + 1.1 * backOut(seg(t, W1[0], W1[0] + .2)) + hk * .2, aR: .3 + 1.1 * backOut(seg(t, W1[1], W1[1] + .2)) + hk * .2,
      sq: .1 * hk, draw: gpuTower(t, grows)
    });
    camEnd();
    sqText('БОЛЬШЕ', 520, 200, 120, t, W1[0], sq);
    sqText('GPU!', 1420, 200, 150, t, W1[1], sq, { cols: [A2.acid, A2.hazard, A2.magenta] });
  }

  // ---------- the gaps: the watercolour runs, Clawd holds his own outline together ----------
  function runnyBg(t, lt, lvl, seed) {
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#EDE4D0', fill: '#D9CDB4', fillOp: 70, tex: .7, border: .3, ink: null });
    const bands = [A2.magenta, A2.acid, A2.uv, A2.hazard, A2.magenta], sq = squelch(t, t - lt, t - lt + 2.5);
    const run = (lt * 150 + 60) * lvl;
    for (let b = 0; b < bands.length; b++) {
      const by = 40 + b * 70 + lt * 18 * lvl, th = 30 + b * 4, pts = [];
      for (let i = 0; i <= 18; i++) pts.push([-40 + i * (W + 80) / 18, by + Math.sin(i * .7 + b + t * 2) * (14 + 20 * sq)]);
      for (let i = 18; i >= 0; i--) pts.push([-40 + i * (W + 80) / 18, by + th + Math.sin(i * .7 + b + t * 2 + .4) * (14 + 20 * sq)]);
      paint(pts, { wash: bands[b], washOp: 170 - lt * 25, fill: bands[b], fillOp: 70, bleed: .3, tex: .4, ink: null });
      for (let i = 0; i < 12; i++) {                                                              // drips run down the paper
        const h1 = hash(i * 7.3 + b * 3.1 + seed), dx = -20 + h1 * (W + 40), L = run * (.3 + hash(i + b * 11 + seed) * .9) * (1 + b * .12);
        const wd = 8 + hash(i * 3 + b) * 14, y0 = by + th * .6, wx = dx + Math.sin(t * 3 + i) * 6 * sq;
        if (L < 10) continue;
        paint(rrPts(wx - wd / 2, y0, wd, Math.min(L, H), wd / 2), { wash: bands[b], washOp: 150, ink: null });
        paint(ellPts(wx, y0 + Math.min(L, H), wd * .8, wd * 1.05, 10), { wash: bands[b], washOp: 190, ink: null });
      }
    }
  }
  // the slipping ink outline, held at the top corners by Clawd's hands (x, y = Clawd's ground point)
  function looseOutline(x, y, u, t, slip, aL, aR, tapes) {
    const hand = (side, a) => [x + side * (4.9 + 2.2 * Math.cos(a)) * u, y - (4.5 + 2.2 * Math.sin(a)) * u];
    const TL = hand(-1, aL), TR = hand(1, aR), BR = [x + 5 * u + slip * 20, y - 2 * u + slip * 3 * u], BL = [x - 5 * u + slip * 12, y - 2 * u + slip * 3.8 * u];
    const side = (a, b, n, droop) => { const out = []; for (let i = 0; i < n; i++) { const f = i / n; out.push([lerp(a[0], b[0], f) + Math.sin(f * 9 + t * 6) * 4 * slip, lerp(a[1], b[1], f) + Math.sin(f * Math.PI) * droop + Math.sin(f * 7 + t * 5) * 5 * slip]); } return out; };
    const pts = [...side(TL, TR, 6, -6 + slip * 30), ...side(TR, BR, 5, 0), ...side(BR, BL, 6, slip * .8 * u), ...side(BL, TL, 5, 0)];
    paint(pts, { ink: INK, sw: 1.9, curv: .4 });
    paint(pts.map(([px, py]) => [px + 6 + slip * 8, py + 10 + slip * 16]), { ink: '#6A5E7A', sw: .9, curv: .4 });   // a ghost copy sliding off
    for (let i = 0; i < 5; i++) {                                                                     // the ink itself dribbles
      const p = pts[11 + i * 2] || pts[pts.length - 1], L = slip * (40 + hash(i) * 80);
      if (L > 6) inkLine([[p[0], p[1]], [p[0] + 2, p[1] + L]], 1.4, INK, 'ink', 0);
    }
    for (const [tt, cx, cy, rot] of tapes) {                                                          // hazard tape slapped on the hits
      const k = backOut(seg(t, tt, tt + .12)); if (k < .02) continue;
      const P = cx < 0 ? BL : cx > 0 ? BR : TR;
      paint(rotPts(rectPts(P[0] - 75 * k, P[1] - 24 * k, 150 * k, 48 * k, 1), P[0], P[1], rot), { wash: A2.hazard, fill: '#C9A40E', fillOp: 60, tex: .5, ink: INK, sw: .6 });
      if (k > .8) letter('СКОТЧ', P[0], P[1], 26, INK, { font: ruFont(26), rot, ink: false });
    }
  }
  function gap(lvl, seed, tapes) {
    return (t, lt, dur) => {
      runnyBg(t, lt, lvl, seed);
      const hk = hitK(t, tapes.map(q => q[0]), .2);
      camBegin(960 + Math.sin(t * .8) * 20, 600 + lt * 8, 1.05 + lt * .03 + .03 * hk, (lvl - 1) * .03 * Math.sin(lt * 1.2));
      // the colour pools on the floor: Clawd's own clay runs into the puddle
      const pale = clamp((lvl - 1) * .55 + lt / dur * .35 * lvl);
      const col = mixCol(PAL.clay, '#EDE4D0', pale), dk = mixCol(PAL.clayDk, '#D9CDB4', pale);
      const pr = 260 + lt * 60 * lvl;
      paint(ellPts(960 + 20, 905, pr, 38 + lt * 6, 26, 6), { wash: mixCol(A2.magenta, PAL.clay, .5), washOp: 150, fill: A2.uv, fillOp: 60, bleed: .3, tex: .5, ink: null });
      paint(ellPts(960 - 40, 900, pr * .6, 26, 20, 5), { wash: PAL.clay, washOp: 170, ink: null });
      const u = 40, x = 960, y = 890;
      const slip = clamp(.25 + lt / dur * .6 * lvl * .8 + Math.sin(t * 7) * .04, 0, 1.1);
      const grip = (uu, sw) => paint(ellPts(.2 * uu, 0, .8 * uu, .75 * uu, 12), { wash: col, fill: dk, fillOp: 60, ink: INK, sw: 1.3 });
      const aL = 1.05 + Math.sin(t * 9) * .08, aR = 1.1 + Math.sin(t * 8 + 1) * .08;
      clawd(x, y, u, { col, dk, lt: mixCol('#F5B394', '#EDE4D0', pale), swMul: .4, aL, aR, noShadow: true, armL: grip, armR: grip,
        eyes: lvl > 1 ? 'scared' : 'narrow', mouth: 'wobble', sq: .04 * Math.sin(t * 11) + .08 * hk, emote: 'sweat', emoteK: 1 });
      for (let i = 0; i < 7; i++) {                                                                  // clay drips off his belly
        const dx = x + (-4.4 + i * 1.45) * u, L = (20 + hash(i + seed) * 90) * (.4 + lt / dur) * lvl;
        paint(rrPts(dx - 6, y - 2.3 * u, 12, L, 6), { wash: col, washOp: 230, ink: null });
        paint(ellPts(dx, y - 2.3 * u + L, 8, 10, 8), { wash: dk, washOp: 230, ink: null });
      }
      looseOutline(x, y, u, t, slip, aL, aR, tapes);
      const kap = Math.floor(lt * 1.6);
      for (let i = 0; i <= kap && i < 4; i++) sfx(i % 2 ? 'кап…' : 'кап', (i % 2 ? 1380 : 260) + hash(i + seed) * 280, 330 + hash(i * 3 + seed) * 380, 44, mixCol(A2.uv, INK, .3), lt - i / 1.6, { life: 1.1, font: ruFont(44), ink: false });
      camEnd();
    };
  }

  // ---------- 137.7 «БОЛЬШЕ GPU!» #2: the CEO turns into a PCIe slot, a giant GPU plugs in ----------
  function drop2(t, lt) {
    const hits = [...W2, ...hitsIn(137.6, 140.2)], hk = hitK(t, hits, .2), sq = squelch(t, HIT2, 140.2);
    acidField(t, { k: .8 + hk * .5, sq, cols: [A2.acid, A2.uv], speed: 2.2 });
    const [sx, sy] = shakeXY(t, 12 * hk);
    camBegin(960 + sx, 580 + sy, 1.04 + .06 * hk - lt * .02);
    mxBurst(t, HIT2, 21);
    flushLetters();
    smileyCrowd(t, hits, { n: 4, y: 610, r: 56, melt: .35 });
    const m = seg(t, W2[0], W2[0] + .45);
    if (m < .62) {                                                                                    // squashing flat and wide
      const e = ease(m / .62);
      ceoClawd(960, 900, 34, { hat: 'shades', mouth: 'O', sx: 1 + 1.6 * e, sy: 1 - .72 * e, aL: 1.4 - e, aR: 1.4 - e, draw: gpuTower(t, [HIT2 - 5, HIT2 - 4, HIT2 - 3].map((g, i) => e > .3 + i * .15 ? 1e9 : g)) });
    } else {
      const pk = backOut(seg(t, W2[0] + .28, W2[0] + .5));
      push(); translate(960, 780); scale(1, pk); translate(-960, -780);
      slotCEO(960, 780, 900, t, { grin: seg(t, W2[1], W2[1] + .2), lit: hitK(t, [W2[1]], .4), sq: .3 * hitK(t, [W2[1]], .15) });
      pop();
      const plug = easeIn(seg(t, W2[1] - .25, W2[1]));                                             // the big card drops in on «GPU!»
      const gy = lerp(-200, 780 - 60 - 95, plug), wob = t > W2[1] ? Math.sin((t - W2[1]) * 30) * 6 * Math.exp(-(t - W2[1]) * 5) : 0;
      gpuCard(960 + 80, gy + wob, 1.45, t, { glow: .3 + hitK(t, [W2[1]], .4) });
      if (t > W2[1]) {
        const a = t - W2[1];
        for (const sd of [-1, 1]) for (let i = 0; i < 8; i++) {
          const p = seg(a, 0, .35), ang = -Math.PI / 2 + sd * (.3 + i * .15), d = 60 + p * 220;
          if (p < 1) inkLine([[1040 + sd * 250 + Math.cos(ang) * d * .6, 720 + Math.sin(ang) * d * .6], [1040 + sd * 250 + Math.cos(ang) * d, 720 + Math.sin(ang) * d]], 2 * (1 - p) + .4, i % 2 ? A2.hazard : '#FFFFFF', 'inkfine', 0);
        }
        sfx('КЛАЦ!', 1500, 560, 90, A2.hazard, a, { life: 1.1, font: ruFont(90), stroke: INK, rot: .12 });
      }
    }
    camEnd();
    sqText('БОЛЬШЕ', 520, 180, 120, t, W2[0], sq, { cols: [A2.magenta, A2.acid, '#FFFFFF'] });
    sqText('GPU!', 1420, 180, 150, t, W2[1], sq, { cols: [A2.hazard, A2.acid, A2.magenta] });
  }

  // ---------- 143.9 «БОЛЬШЕ GPU!» #3: the whole factory plugs into him ----------
  function chimney(x, y, w, h, t, seed) {
    paint(rectPts(x - w / 2, y - h, w, h, 1), { wash: A2.rust, fill: '#6E2E18', fillOp: 90, tex: .6, ink: INK, sw: .7 });
    for (let i = 1; i < 4; i++) paint(rectPts(x - w / 2, y - h + i * h / 4, w, 8), { wash: '#F1E8D2', washOp: 170, ink: null });
    smoke(x, y - h, t, { n: 4, h: 200, r: 30, col: '#5A4A7A', seed });
  }
  function drop3(t, lt) {
    const hits = [...W3, ...hitsIn(143.8, 145.55)], hk = hitK(t, hits, .2), sq = squelch(t, HIT3, LOOP0);
    acidField(t, { k: .9 + hk * .6, sq, hy: 470, cols: [A2.magenta, A2.acid], speed: 2.6 });
    const [sx, sy] = shakeXY(t, 14 * hk);
    const zi = easeOut(seg(t, HIT3 + .05, W3[1] + .1));
    camBegin(960 + sx, lerp(740, 560, zi) + sy, lerp(1.45, .96, zi) - lt * .02);
    mxBurst(t, HIT3, 43);
    flushLetters();
    const lit = seg(t, W3[1], W3[1] + .1) * (.7 + .3 * Math.sin(t * 30));
    // the factory all around him (left → right), every machine gets a cable
    const ports = [], cy = 760;
    const P = (x, y) => ports.push([x, y]);
    P(-120, 300); P(-120, 620);                                                                       // cables from off-frame too
    press(60, 180, 300, 400, t, hitsIn(143.8, 145.6), { label: 'ПРЕСС', seed: 3 }); P(210, 580);
    chimney(450, 520, 80, 340, t, 5); P(450, 520);
    chimney(550, 520, 60, 250, t, 9);
    conveyor(620, 470, 700, t, { items: ['gpu', 'token', 'agent', 'task'], speed: 320, legs: 0, size: .9, gap: 175 }); P(800, 510); P(1140, 510);
    gear(1420, 330, 130, t, { speed: .6 + lit }); gear(1420, 520, 70, t, { speed: -1.1 - lit, rot: .2 }); P(1420, 470);
    for (let i = 0; i < 3; i++) serverRack(1560 + i * 110, 180, 100, 380, t, { heat: .45 + lit * .55, seed: i }); P(1720, 560);
    P(W + 120, 330); P(W + 120, 640);
    // the cables: each snakes from its machine to a port on top of the slot and clicks in, staggered on the words
    ports.forEach(([px, py], i) => {
      const p = ease(seg(t, W3[0] + .05 + (i % 5) * .1 + (i > 4 ? .05 : 0), W3[0] + .45 + (i % 5) * .1)), tx = 590 + i * 82, ty = cy - 70;
      const ex = lerp(px, tx, p), ey = lerp(py, ty, p), mx = lerp(px, ex, .5) + Math.sin(t * 6 + i) * 30, my = Math.max(py, ey) + 160 * p + (hash(i) - .5) * 80;
      if (p < .01) return;
      inkLine([[px, py], [mx, my], [ex, ey - 20]], 9, '#141619', 'marker', .6);
      inkLine([[px, py], [mx, my], [ex, ey - 20]], 2.5, [A2.hazard, A2.magenta, A2.acid][i % 3], 'ink', .6);
      paint(rectPts(ex - 20, ey - 50, 40, 44, 1), { wash: A2.gunmetal, fill: A2.steel, fillOp: 70, ink: INK, sw: .8 });
      for (const d of [-9, 9]) paint(rectPts(ex + d - 3, ey - 8, 6, 16), { wash: TK.gold, ink: null });
      if (p > .98 && lit < .1) sparks(ex, ey, t - (W3[0] + .45 + (i % 5) * .1), i * 7, 6, 90);
      if (lit > .1) paint(ellPts(ex, ey - 25, 44, 44, 12), { fill: A2.acid, fillOp: 160 * lit, bleed: .3, ink: null });
    });
    slotCEO(960, cy, 1000, t, { grin: .4 + lit * .6, lit, sq: .25 * hitK(t, [W3[1]], .15), h: 130 });
    gpuCard(1040, cy - 65 - 95, 1.45, t, { glow: .3 + lit });
    for (let i = 0; i < 6 && lit > .1; i++) {                                                        // it all lights at once
      const a = i / 6 * TAU + t * 3;
      inkLine([[960 + Math.cos(a) * 520, cy + Math.sin(a) * 110], [960 + Math.cos(a) * 640, cy + Math.sin(a) * 150]], 2.5 * lit, A2.acid, 'ink', 0);
    }
    camEnd();
    sqText('БОЛЬШЕ', 560, 120, 120, t, W3[0], sq, { cols: [A2.acid, A2.magenta, A2.hazard] });
    sqText('GPU!', 1400, 120, 160, t, W3[1], sq, { cols: ['#FFFFFF', A2.acid, A2.magenta] });
  }

  // ---------- 145.55 the loop lines: GPU → ТОКЕНЫ → АГЕНТЫ → ЗАДАЧИ → ТОКЕНЫ ----------
  const N = { gpu: [240, 330], tok: [960, 230], agt: [1440, 640], tsk: [480, 640] };
  const LINES = [[145.55, 'gpu', 'tok', 'token'], [147.75, 'tok', 'agt', 'agent'], [150.3, 'agt', 'tsk', 'task'], [152.8, 'tsk', 'tok', 'token']];
  const WORDS = { gpu: [145.78], tok: [145.96, 147.08, 147.8, 153.3], agt: [148.16, 149.46, 150.36], tsk: [150.72, 151.88, 152.86] };
  const LABEL = { gpu: 'GPU', tok: 'ТОКЕНЫ', agt: 'АГЕНТЫ', tsk: 'ЗАДАЧИ' };
  const CEN = [960, 500];
  const edgePts = (a, b, n = 16) => {
    const [ax, ay] = N[a], [bx, by] = N[b], mx = (ax + bx) / 2, my = (ay + by) / 2;
    let nx = -(by - ay), ny = bx - ax; const d = Math.hypot(nx, ny) || 1; nx /= d; ny /= d;
    if ((mx - CEN[0]) * nx + (my - CEN[1]) * ny < 0) { nx = -nx; ny = -ny; }
    const cx = mx + nx * 110, cy = my + ny * 110, out = [];
    for (let i = 0; i <= n; i++) { const f = i / n, g = 1 - f; out.push([g * g * ax + 2 * g * f * cx + f * f * bx, g * g * ay + 2 * g * f * cy + f * f * by]); }
    return out;
  };
  const along = (pts, f) => { const i = Math.min(pts.length - 2, Math.floor(f * (pts.length - 1))), q = f * (pts.length - 1) - i; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; };
  // wet prints: every «задач» the task sheets monoprint themselves, each copy paler, sliding off the last
  const PRINT_T = [150.72, 151.3, 151.88, 152.35, 152.86, 153.3, 153.9, 154.4];
  function wetPrints(t) {
    let n = 0; for (const pt of PRINT_T) if (t >= pt) n = n ? Math.min(n * 2, 72) : 2;
    if (!n) return 0;
    for (let i = n - 1; i >= 0; i--) {
      const gen = Math.floor(Math.log2(i + 1)), born = PRINT_T[Math.min(gen, PRINT_T.length - 1)], k = backOut(seg(t, born, born + .15));
      if (k < .02) continue;
      const a = i * 2.39996, r = 70 + 58 * Math.sqrt(i) * 1.25, x = N.tsk[0] + Math.cos(a) * r * 1.5, y = N.tsk[1] - 60 + Math.sin(a) * r * .8;
      if (y > 900 || y < -40) continue;
      taskSheet(x, y, (.9 - gen * .06) * k, (hash(i) - .5) * .5, { wet: clamp(1 - (t - born) * .8), pale: gen * .12 });
    }
    return n;
  }
  function loopShot(t, lt) {
    const li = LINES.reduce((j, L, i) => t >= L[0] ? i : j, 0), [l0, fa, fb, kind] = LINES[li], lend = li < 3 ? LINES[li + 1][0] : ECO;
    const hits = hitsIn(145.5, ECO, 6), hk = hitK(t, hits, .2), sq = squelch(t, l0, lend);
    acidField(t, { k: .45 + hk * .4, sq, hy: 520, speed: 1 + li * .5, cols: li % 2 ? [A2.magenta, A2.acid] : [A2.acid, A2.magenta] });
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#1A0B40', washOp: 120, ink: null });   // knock the rave back so the loop reads
    const [sx, sy] = shakeXY(t, 6 * hk);
    camBegin(960 + sx + Math.sin(lt * .5) * 30, 520 + sy, 1 + lt * .012 + .04 * hk, Math.sin(lt * .6) * .025);
    gear(CEN[0], CEN[1] + 30, 150, t, { speed: .15 + li * .35 + (t > 152.8 ? (t - 152.8) * .4 : 0), col: A2.steel });
    letter('₮', CEN[0], CEN[1] + 30, 90, A2.hazard, { font: ruFont(90) });
    const nPrints = wetPrints(t);
    // edges: drawn dim, the active one glows and carries items
    for (let i = 0; i < 4; i++) {
      const [e0, a, b, k2] = LINES[i], pts = edgePts(a, b), on = i === li, done = t >= e0;
      const rev = on ? seg(t, e0, e0 + .5) : done ? 1 : 0;
      inkLine(pts, on ? 6 : 3, done ? (on ? A2.hazard : A2.acid) : '#4A3C80', 'marker', .5);
      if (rev > .02) {
        const shown = pts.slice(0, Math.max(2, Math.ceil(pts.length * rev)));
        if (on) inkLine(shown, 2.2, '#FFFFFF', 'ink', .5);
      }
      const [hx, hy] = along(pts, .8), [px, py] = along(pts, .74), ang = Math.atan2(hy - py, hx - px);
      paint([[hx + Math.cos(ang) * 30, hy + Math.sin(ang) * 30], [hx + Math.cos(ang + 2.4) * 26, hy + Math.sin(ang + 2.4) * 26], [hx + Math.cos(ang - 2.4) * 26, hy + Math.sin(ang - 2.4) * 26]], { wash: done ? A2.hazard : '#4A3C80', ink: INK, sw: .7 });
      if (on) for (let j = 0; j < 4; j++) {
        const f = frac((t - e0) * (.9 + li * .25) + j / 4); if (f < .12 || f > .88) continue;
        const [ix, iy] = along(pts, f);
        if (k2 === 'token') token(ix, iy, 36, { spin: t + j });
        else if (k2 === 'agent') agentBot(ix, iy + 50, 7.5, t, { n: 7 + j, noShadow: true, dance: 'run' });
        else taskSheet(ix, iy, .65, Math.sin(t * 4 + j) * .3);
      }
    }
    // the nodes: four spinning acid smileys; each line lights its pair, each word kicks its node
    for (const key of ['gpu', 'tok', 'agt', 'tsk']) {
      const [nx, ny] = N[key], active = key === fa || key === fb, wk = hitK(t, WORDS[key].filter(w => w <= t + .001), .3);
      const r = 86 * (1 + .25 * wk) * (active ? 1.08 : .92);
      acidSmiley(nx, ny, r, t, { rot: Math.sin(t * (2 + li) + nx) * .25 + sq * .4, glow: active ? .5 + .5 * wk : 0, melt: key === 'tsk' ? .15 + nPrints / 150 : .1,
        col: active ? A2.hazard : mixCol(A2.hazard, '#6A5E7A', .55), eyes: key === 'tsk' && nPrints > 30 ? 'x' : undefined });
      const lw = textW(LABEL[key], ruFont(46)) + 40;
      paint(rotPts(rectPts(nx - lw / 2, ny + r + 12, lw, 62, 1.5), nx, ny + r + 43, -.04), { wash: active ? A2.hazard : A2.gunDk, ink: INK, sw: .8 });
      letter(LABEL[key], nx, ny + r + 45, 46, active ? INK : '#8A95A1', { font: ruFont(46), ink: false, rot: -.04 });
      if (key === 'gpu') gpuCard(nx, ny - r - 50, .42, t, { glow: active ? .6 : 0 });
    }
    if (nPrints) letter('×' + nPrints, N.tsk[0] + 150, N.tsk[1] - 120, 64, A2.acid, { font: ruFont(64), stroke: INK, rot: -.1, pop: (t - 150.72) * 5 });
    camEnd();
  }

  // ---------- 155.0 «ЭКОНОМИКА РАБОТАЕТ!»: the factory eats its own output ----------
  function economy(t, lt) {
    const hits = [155.06, 155.55, 155.92, 156.4, 157.0], hk = hitK(t, hits, .18), sq = squelch(t, ECO, END);
    acidField(t, { k: .85 + hk * .5, sq, hy: 470, speed: 2.4 });
    const [sx, sy] = shakeXY(t, 10 * hk), zin = seg(t, 156.7, END);
    camBegin(960 + sx, 560 + sy - zin * 40, 1 + lt * .02 + .05 * hk + easeIn(zin) * .5);
    // the machine
    const mx = 560, my = 380, mw = 800, mh = 480, chew = Math.min(1, ...hits.map(h => Math.abs(t - h) / .16));
    paint(rectPts(mx, my, mw, mh, 1.5), { wash: A2.gunmetal, fill: A2.steel, fillOp: 70, tex: .6, border: .4, ink: INK, sw: 1.2 });
    hazard(mx, my + mh - 50, mw, 50);
    for (let i = 0; i < 8; i++) paint(ellPts(mx + 30 + i * (mw - 60) / 7, my + 24, 7, 7, 8), { wash: A2.steelLt, ink: null });
    paint(rectPts(mx + mw / 2 - 170, my + 40, 340, 64, 1), { wash: A2.rust, fill: '#6E2E18', fillOp: 70, tex: .5, ink: INK, sw: .8 });
    letter('ЭКОНОМИКА', mx + mw / 2, my + 73, 46, A2.hazard, { font: ruFont(46), ink: false });
    for (const ex of [mx + 230, mx + mw - 230]) {                                                   // gauge eyes pinned in the red
      paint(ellPts(ex, my + 175, 62, 62, 20), { wash: A2.cream, ink: INK, sw: 1 });
      paint([[ex, my + 175], [ex + 50, my + 145], [ex + 40, my + 200]], { wash: '#FF3A3A', washOp: 150, ink: null });
      const na = -.4 + Math.sin(t * 40) * .06 * (1 + hk);
      inkLine([[ex, my + 175], [ex + Math.cos(na) * 52, my + 175 + Math.sin(na) * 52]], 2, INK, 'ink', 0);
    }
    const open = 20 + 110 * chew, mo = [mx + mw / 2 - 210, my + 290];                                // the chewing mouth: ВХОД
    paint(rectPts(mo[0], mo[1] - open / 2, 420, open, 1), { wash: '#1A0710', ink: INK, sw: 1 });
    for (let i = 0; i < 8; i++) {
      const tx = mo[0] + 8 + i * 51;
      paint([[tx, mo[1] - open / 2], [tx + 44, mo[1] - open / 2], [tx + 22, mo[1] - open / 2 + 30]], { wash: A2.steelLt, ink: INK, sw: .5 });
      paint([[tx, mo[1] + open / 2], [tx + 44, mo[1] + open / 2], [tx + 22, mo[1] + open / 2 - 30]], { wash: A2.steelLt, ink: INK, sw: .5 });
    }
    letter('ВХОД', mo[0] - 70, mo[1] - 60, 34, A2.acid, { font: ruFont(34), stroke: INK, rot: -.2 });
    // the output chute on the right: ВЫХОД, and everything it makes arcs straight back into the mouth
    paint([[mx + mw, my + 300], [mx + mw + 170, my + 360], [mx + mw + 170, my + 460], [mx + mw, my + 420]], { wash: A2.steel, fill: A2.gunDk, fillOp: 80, tex: .5, ink: INK, sw: 1 });
    letter('ВЫХОД', mx + mw + 110, my + 320, 34, A2.hazard, { font: ruFont(34), stroke: INK, rot: .1 });
    const kinds = ['token', 'task', 'agent', 'token', 'gpu', 'task'];
    for (let i = 0; i < 12; i++) {
      const f = frac(t * .85 + i / 12), ox = mx + mw + 150, oy = my + 410, tx = mo[0] + 210 + (hash(i) - .5) * 200, ty = mo[1];
      const x = lerp(ox, tx, f), y = lerp(oy, ty, f) - Math.sin(f * Math.PI) * (330 + hash(i + 3) * 110), k = kinds[i % kinds.length];
      if (k === 'token') token(x, y, 30, { spin: t + i, burn: f > .8 ? (f - .8) * 4 : 0 });
      else if (k === 'task') taskSheet(x, y, .5, t * 3 + i);
      else if (k === 'gpu') gpuCard(x, y, .3, t, { rot: t * 2 + i });
      else agentBot(x, y + 30, 5, t, { n: 40 + i, noShadow: true, rot: t * 3 + i, eyes: 'scared', mouth: 'o' });
    }
    steam(mx + 60, my, t, { k: .6 + hk, len: 220, seed: 5 }); steam(mx + mw - 60, my, t, { k: .6 + hk, len: 220, seed: 9 });
    // Clawd, pale, his outline taped back on, watching deadpan
    const cx = 250, cy = 900, u = 14;
    clawd(cx, cy, u, { col: mixCol(PAL.clay, '#EDE4D0', .55), dk: mixCol(PAL.clayDk, '#D9CDB4', .5), eyes: 'narrow', mouth: 'flat', aL: .2, aR: .2 });
    for (const [px, py, r] of [[cx - 5 * u, cy - 8 * u, -.6], [cx + 5 * u, cy - 2 * u, .5]]) paint(rotPts(rectPts(px - 22, py - 7, 44, 14), px, py, r), { wash: A2.hazard, ink: INK, sw: .5 });
    camEnd();
    sqText('ЭКОНОМИКА', 960, 130, 110, t, 155.06, sq, { cols: [A2.acid, A2.hazard, '#FFFFFF'] });
    stamp('РАБОТАЕТ!', 960, 280, 96, t, 155.92, { col: A2.acid, rot: -.07, punch: .1 });
  }

  // every shot change is a hard glitch cut (both sides of it, since frames render independently)
  const G = fn => (t, lt, dur) => { fn(t, lt, dur); glitchCut(t, t - lt, { k: 1.1 }); glitchCut(t, t - lt + dur, { k: 1.1 }); };
  chapter('acid', HIT1, END, [
    [HIT1, G(drop1)],
    [135.2, G(gap(1, 3, []))],
    [HIT2, G(drop2)],
    [140.2, G(gap(1.7, 11, [[142.07, -1, 0, -.4], [143.03, 1, 0, .35]]))],
    [HIT3, G(drop3)],
    [LOOP0, G(loopShot)],
    [ECO, G(economy)]
  ]);
})();
