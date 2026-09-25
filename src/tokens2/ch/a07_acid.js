// a07_acid.js: «Жги токены» v2 chapter 7 "ACID DROP" (132.55–157.35), the centrepiece.
// «БОЛЬШЕ GPU!» ×3, each one escalates on CEO-Clawd in black shades:
//   132.55 a GPU grows out of his head (then a tower of them) · 137.7 he turns into a PCIe slot · 143.9 the whole
//   factory plugs into him. Each hit flips the frame into acidField + acid-smiley tokens with a SHORT Matrix burst.
//   In the gaps (135.2–137.7, 140.2–143.9) the watercolour runs and Clawd holds his own slipping outline together.
// 145.55 the loop lines as a wheel of samsara: CEO-demon holds the wheel GPU → ТОКЕНЫ → АГЕНТЫ → ЗАДАЧИ → ТОКЕНЫ,
//   each sung half-line lights/whips to its realm, the wheel spins faster every lap; exit moon «ЛИМИТ 0» out of reach.
// 155.0 «ЭКОНОМИКА РАБОТАЕТ!»: the demon lets go of the rim and eats everything the wheel throws off. Hard cut at 157.35.
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

  // ---------- 145.55 the loop lines as a WHEEL OF SAMSARA (bhavachakra-style, deadpan corporate) ----------
  // CEO-Clawd in black shades is the demon holding the wheel from behind (teeth on the rim, claws on the sides).
  // Four realms GPU → ТОКЕНЫ → АГЕНТЫ → ЗАДАЧИ (clockwise; the last line jumps ЗАДАЧИ → ТОКЕНЫ straight across the hub),
  // hub = token, GPU and agent chasing each other's tails, rim = 12 tiny rebirth scenes, upper corner the unreachable
  // exit moon «ЛИМИТ 0». Each sung half-line whips the camera to its realm; the wheel spins faster every lap.
  const WC = [960, 640], WR = 400, RIM = 300, HUB = 100, DU = 80, DGY = WC[1] - WR + 4.4 * DU;   // DGY: demon's ground line (mouth on the rim)
  const RK = ['gpu', 'tok', 'agt', 'tsk'];
  const RB = { gpu: -Math.PI / 2, tok: 0, agt: Math.PI / 2, tsk: Math.PI };
  const RCOL = { gpu: A2.acid, tok: A2.hazard, agt: '#8E6BFF', tsk: A2.magenta };
  const LABEL = { gpu: 'GPU', tok: 'ТОКЕНЫ', agt: 'АГЕНТЫ', tsk: 'ЗАДАЧИ' };
  const GEN = { gpu: 'GPU!', tok: 'ТОКЕНОВ!', agt: 'АГЕНТОВ!', tsk: 'ЗАДАЧ!' };
  // sung lines (lyrics.js) light their pair of realms
  const LINES = [[145.55, 'gpu', 'tok'], [147.75, 'tok', 'agt'], [150.3, 'agt', 'tsk'], [152.8, 'tsk', 'tok']];
  // half-lines («Больше X»): whisper onsets; line starts repeat the realm (camera punch), second halves whip onwards
  const EV = [[145.6, 'gpu', '×2'], [146.56, 'tok', '×1000'], [147.8, 'tok', '×10⁶'], [149.1, 'agt', '+100'],
    [150.36, 'agt', '+10 000'], [151.58, 'tsk', '+1000'], [152.86, 'tsk', '+10⁶'], [154.0, 'tok', '∞']];
  const EVT = EV.map(e => e[0]);
  const wAng = t => { const d = Math.max(0, t - 145.0); return .5 * d + .14 * d * d; };          // speeds up every lap
  const wOmg = t => .5 + .28 * Math.max(0, t - 145.0);
  const polar = (a, r, c = WC) => [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r];
  const realmXY = (k, t, c = WC) => polar(RB[k] + wAng(t), (HUB + RIM) / 2 + 10, c);
  const nEv = (t, k) => EV.filter(e => e[1] === k && t >= e[0]).length;
  const gEv = (t, k) => { let g = 0; for (const e of EV) if (e[1] === k && t >= e[0]) g = Math.max(g, Math.exp(-(t - e[0]) * 2.6)); return g; };
  const arcPts = (a0, a1, r, c, n = 14) => { const p = []; for (let i = 0; i <= n; i++) p.push(polar(lerp(a0, a1, i / n), r, c)); return p; };

  // the upright scene inside a realm (n = hits so far, g = hit glow)
  function realmScene(k, x, y, n, g, lit, t) {
    if (k === 'gpu') {                                                   // a shrine of GPUs, stacked higher every hit
      const m = Math.min(4, 2 + n);
      for (let i = 0; i < m; i++) gpuCard(x + (i % 2 ? 14 : -14), y + 50 - i * 34, .3, t * (1 + n), { glow: (i === m - 1 ? g : 0) + lit * .25 });
      clawd(x - 95, y + 80, 4.2, { eyes: 'happy', mouth: 'smile', aL: 1.4, aR: 1.4, noShadow: true, dy: -Math.abs(Math.sin(t * 9)) * 1.5 });
    } else if (k === 'tok') {                                            // the token pile burns, the acid smiley on top melts
      const rows = [4, 3, 2]; let c = 0;
      rows.forEach((m, r) => { for (let j = 0; j < m; j++, c++) token(x + (j - (m - 1) / 2) * 40, y + 70 - r * 28, 19, { burn: r === 2 ? .4 + lit * .3 : 0 }); });
      acidSmiley(x, y - 25, 42 * (1 + .25 * g), t, { melt: .2 + .1 * n, glow: g * .8, rot: Math.sin(t * 5) * .2 });
    } else if (k === 'agt') {                                            // agents hiring agents hiring agents
      const m = Math.min(3, 1 + n);
      for (let i = 0; i < m; i++) agentBot(x + (i - (m - 1) / 2) * 52, y + 70 - (i % 2) * 22, 4.6, t, { n: 7 + i * 13, hire: i === m - 1, dance: g > .2 ? 'hop' : 'bounce', seed: i, noShadow: true, eyes: g > .2 ? 'happy' : 'normal', mouth: 'grin' });
    } else {                                                             // the tasks monoprint themselves
      const m = Math.min(8, 2 + n * 3);
      for (let i = m - 1; i >= 0; i--) taskSheet(x - 75 + (i % 4) * 50 + hash(i) * 10, y + 55 - Math.floor(i / 4) * 40 - i * 2, .6, (hash(i + 4) - .5) * .6, { wet: i >= m - 3 ? g : 0, pale: Math.floor(i / 4) * .15 });
    }
  }
  // one of the 12 rim scenes (upright), the little rebirth cycle of the AI economy
  function rimScene(i, x, y, t) {
    const kind = i % 6, s = i * 5 + 1;
    if (kind === 0) {                                                    // a little Clawd is reborn as an agent
      clawd(x - 34, y + 22, 4, { noShadow: true, eyes: 'scared', mouth: 'o', aL: .2, aR: .2 });
      inkLine([[x - 8, y], [x + 10, y]], 1.4, INK, 'ink', 0); paint([[x + 16, y], [x + 8, y - 6], [x + 8, y + 6]], { wash: INK, ink: null });
      agentBot(x + 38, y + 22, 4, t, { n: s, noShadow: true, eyes: 'happy', mouth: 'grin' });
    } else if (kind === 1) agentBot(x, y + 26, 5, t, { n: s, hire: true, noShadow: true, mouth: 'grin', aR: 1.2 });
    else if (kind === 2) token(x, y, 24, { burn: i < 6 ? .6 : 0, spin: t * 2 + i });   // ponytail: one burning rim token, fire() is the cost
    else if (kind === 3) gpuCard(x, y, .24, t, { glow: .3 });
    else if (kind === 4) for (let j = 2; j >= 0; j--) taskSheet(x - 20 + j * 20, y + 4 - j * 6, .42, (j - 1) * .25, { pale: j * .2 });
    else { agentBot(x - 22, y + 24, 4, t, { n: s, noShadow: true, aR: 1.4 }); taskSheet(x + 26, y - 6, .38, .3); }
  }
  // hub: token, GPU and agent chasing each other's tails, each biting the tail in front of it
  function hub(t, c, sp) {
    paint(ellPts(c[0], c[1], HUB, HUB, 30), { wash: A2.gunDk, fill: A2.uv, fillOp: 70, tex: .5, ink: INK, sw: 1.4 });
    const a0 = -t * (1.6 + sp * .6), r = 56;
    for (let i = 0; i < 3; i++) {
      const a = a0 + i * TAU / 3;                                        // tail trails clockwise behind (they run ccw)
      inkLine(arcPts(a + .25, a + TAU / 3 - .3, r, c, 8), 5, [A2.hazard, A2.acid, '#8E6BFF'][i], 'marker', .4);
    }
    for (let i = 0; i < 3; i++) {
      const a = a0 + i * TAU / 3, [x, y] = polar(a, r, c), rot = a - Math.PI / 2;
      if (i === 0) token(x, y, 22, { rot, glow: .3 });
      else if (i === 1) gpuCard(x, y, .17, t, { rot });
      else agentBot(x, y + 14, 3.4, t, { n: 1, noShadow: true, rot, mouth: 'grin', eyes: 'happy' });
    }
  }
  // the wheel itself. o.lit {k: 0..1}, o.sq squelch, o.c centre
  function wheel(t, o = {}) {
    const c = o.c || WC, A = wAng(t), w = wOmg(t), sq = o.sq || 0, lit = o.lit || {};
    // outer rim disc (squelch-wobbled) + the 12 rebirth cells
    const rimPts = []; for (let i = 0; i < 64; i++) { const a = i / 64 * TAU; rimPts.push(polar(a, WR * (1 + .018 * sq * Math.sin(a * 7 + t * 14)), c)); }
    paint(rimPts, { wash: '#E9DCC0', fill: A2.rust, fillOp: 60, tex: .6, border: .4, ink: INK, sw: 2 });
    for (let i = 0; i < 12; i++) {
      const a0 = A + i * TAU / 12, a1 = a0 + TAU / 12;
      paint([...arcPts(a0, a1, WR - 6, c, 6), ...arcPts(a1, a0, RIM + 4, c, 6)], { wash: i % 2 ? '#F1E4C6' : '#E4CFAA', washOp: 200, ink: INK, sw: .7 });
      const [x, y] = polar(a0 + TAU / 24, (RIM + WR) / 2, c);
      rimScene(i, x, y, t);
    }
    // the four realms
    for (const k of RK) {
      const a = RB[k] + A, L = lit[k] || 0, g = gEv(t, k), col = mixCol(RCOL[k], A2.gunDk, .55 * (1 - L));
      paint([...arcPts(a - Math.PI / 4, a + Math.PI / 4, RIM, c), ...arcPts(a + Math.PI / 4, a - Math.PI / 4, HUB, c, 6)],
        { wash: col, fill: mixCol(col, INK, .3), fillOp: 70, tex: .5, border: .5, ink: INK, sw: 1.6 });
      if (g > .02) paint(ellPts(...realmXY(k, t, c), 160 + 60 * g, 160 + 60 * g, 16), { fill: '#FFFFFF', fillOp: 90 * g, bleed: .3, ink: null });
    }
    for (const k of RK) {
      const [x, y] = realmXY(k, t, c), L = lit[k] || 0;
      realmScene(k, x, y - 10, nEv(t, k), gEv(t, k), L, t);
      const [px, py] = polar(RB[k] + A, RIM - 26, c), lw = textW(LABEL[k], ruFont(34)) + 26;   // upright plaque near the rim
      paint(rrPts(px - lw / 2, py - 22, lw, 44, 8), { wash: L > .5 ? RCOL[k] : A2.gunDk, ink: INK, sw: .8 });
      letter(LABEL[k], px, py, 34, L > .5 ? INK : '#A9B2BC', { font: ruFont(34), ink: false });
    }
    // spokes between the realms + the clockwise arrows of the loop
    for (let i = 0; i < 4; i++) {
      const a = A + Math.PI / 4 + i * Math.PI / 2;
      inkLine([polar(a, HUB, c), polar(a, WR, c)], 5, INK, 'marker', 0);
      const [ax, ay] = polar(a, HUB + 60, c), ta = a + Math.PI / 2, on = lit[RK[i]] > .5 && lit[RK[(i + 1) % 4]] > .5;
      paint([[ax + Math.cos(ta) * 26, ay + Math.sin(ta) * 26], [ax + Math.cos(ta + 2.4) * 20, ay + Math.sin(ta + 2.4) * 20], [ax + Math.cos(ta - 2.4) * 20, ay + Math.sin(ta - 2.4) * 20]], { wash: on ? A2.hazard : A2.steel, ink: INK, sw: .7 });
    }
    // motion-blur fans trailing the spokes once it's really going
    if (w > 1.6) for (let i = 0; i < 4; i++) {
      const a0 = A + Math.PI / 4 + i * Math.PI / 2, span = clamp((w - 1.4) * .12, 0, .6);
      paint([polar(a0, HUB, c), ...arcPts(a0, a0 - span, WR * .97, c, 6)], { wash: '#FFFFFF', washOp: 55, ink: null });
    }
    hub(t, c, w);
    if (lit.tsk > .5 && lit.tok > .5 && t > 152.8 && t < ECO) {                   // the last line: ЗАДАЧИ → ТОКЕНЫ straight through the hub
      const [x0, y0] = realmXY('tsk', t, c), [x1, y1] = realmXY('tok', t, c), f = Math.floor(t * 20), p = seg(t, 153.9, 154.1);
      if (p > 0) {
        const pts = [[x0, y0]]; for (let i = 1; i < 8; i++) { const q = i / 8; pts.push([lerp(x0, x1, q) + (hash(f + i) - .5) * 50, lerp(y0, y1, q) + (hash(f + i + 7) - .5) * 50]); }
        pts.push([x1, y1]);
        inkLine(pts.slice(0, Math.max(2, Math.ceil(pts.length * p))), 9, A2.acid, 'marker', 0);
        inkLine(pts.slice(0, Math.max(2, Math.ceil(pts.length * p))), 3, '#FFFFFF', 'ink', 0);
      }
    }
    // sparks thrown tangentially off the rim: more, longer, hotter as it speeds up
    const n = Math.min(26, Math.floor(4 + w * 5));
    for (let i = 0; i < n; i++) {
      const per = .45, cy = Math.floor(t / per + hash(i)), f = frac(t / per + hash(i)), q = hash(i * 3 + cy * 7) * TAU;
      const [px, py] = polar(q, WR * 1.02, c), v = 260 + w * 110 + hash(i + cy) * 200;
      const vx = -Math.sin(q) * v, vy = Math.cos(q) * v, x = px + vx * f * per, y = py + vy * f * per + 900 * (f * per) ** 2;
      inkLine([[x, y], [x - vx * .05, y - vy * .05]], 3 * (1 - f) + .6, [A2.acid, A2.magenta, A2.hazard][i % 3], 'ink', 0);
    }
    // each sung half-line: shock ring + its goods flung out of the realm
    for (const [te, k] of EV) {
      const age = t - te; if (age < 0 || age > 1) continue;
      const [x, y] = realmXY(k, t, c), rr = 120 + age * 520;
      if (age < .5) paint(ellPts(x, y, rr, rr * .8, 30), { ink: RCOL[k], sw: 4 * (1 - age * 2) + .3 });
      const ux = (x - c[0]) / 190, uy = (y - c[1]) / 190;
      for (let i = 0; i < 7; i++) {
        const sp = (hash(i + te) - .5) * 1.8, v = 500 + hash(i + te * 3) * 500, dx = ux * Math.cos(sp) - uy * Math.sin(sp), dy = ux * Math.sin(sp) + uy * Math.cos(sp);
        const bx = x + dx * v * age, by = y + dy * v * age + 700 * age * age, rot = age * (hash(i) - .5) * 14;
        if (k === 'gpu') gpuCard(bx, by, .22, t, { rot, fans: false });
        else if (k === 'tok') token(bx, by, 18, { spin: age * 3 + hash(i), rot });
        else if (k === 'agt') agentBot(bx, by, 3.6, t, { n: i + 50, rot, noShadow: true, eyes: 'happy', mouth: 'O' });
        else taskSheet(bx, by, .4, rot);
      }
    }
  }
  // the demon: CEO-Clawd behind the wheel, huge, shades on. Draw BEFORE the wheel; claws + fangs AFTER (demonFront).
  function demon(t, o = {}) {
    const gy = DGY, chew = o.chew || 0, maw = o.maw || 0;
    for (const s of [-1, 1]) fire(WC[0] + s * 560, WC[1] + 60, 360, 620 + 60 * Math.sin(t * 3 + s), t, { cols: [A2.magenta, A2.uv, A2.acid], seed: s + 4, k: .9 });
    ceoClawd(WC[0], gy, DU, { hat: 'shades', noClicker: true, noShadow: true, noLegs: true, mouth: maw > .05 ? null : 'grin', aL: -1.05, aR: -1.05, sq: .03 * Math.sin(t * 9),
      draw: maw > .05 ? (u, sw) => {                                      // the open maw (ECO): chews on the hits
        const open = (.5 + 1.1 * chew) * maw * u, my = -4.55 * u;
        paint(rrPts(-2.4 * u, my - open / 2, 4.8 * u, open, .5 * u), { wash: '#1A0710', ink: INK, sw: sw });
        for (let i = 0; i < 7; i++) {
          const tx = -2.3 * u + i * .66 * u;
          paint([[tx, my - open / 2], [tx + .6 * u, my - open / 2], [tx + .3 * u, my - open / 2 + .45 * u]], { wash: '#F4EEDC', ink: INK, sw: sw * .4 });
          paint([[tx, my + open / 2], [tx + .6 * u, my + open / 2], [tx + .3 * u, my + open / 2 - .45 * u]], { wash: '#F4EEDC', ink: INK, sw: sw * .4 });
        }
      } : null });
  }
  function demonFront(t, o = {}) {
    const c = o.c || WC;
    for (const s of [-1, 1]) {                                          // claws hooked over the rim
      const hx = WC[0] + s * (4.9 + 2.2 * Math.cos(-1.05)) * DU, hy = DGY - (4.5 + 2.2 * Math.sin(-1.05)) * DU;
      for (let j = 0; j < 3; j++) {
        const a = Math.PI / 2 - s * (Math.PI / 2 + .55 - j * .28), [rx, ry] = polar(a, WR - 40, c), bend = [(hx + rx) / 2 - s * 30, (hy + ry) / 2 - 50];
        paint([[hx, hy - 16], bend, [rx, ry], [bend[0] + s * 10, bend[1] + 24], [hx, hy + 16]], { wash: PAL.clayDk, fill: PAL.clay, fillOp: 60, tex: .4, ink: INK, sw: 1, curv: .5 });
        const ta = a + Math.PI; paint([[rx, ry], polar(ta + s * .5, 34, [rx, ry]), polar(ta - s * .4, 10, [rx, ry])], { wash: '#1A1418', ink: INK, sw: .6 });   // the black talon tip
      }
      paint(ellPts(hx, hy, 46, 40, 14), { wash: PAL.clay, fill: PAL.clayDk, fillOp: 70, tex: .5, ink: INK, sw: 1.2 });
    }
    if (!o.noFangs) for (const s of [-1, 1]) {                         // fangs biting the top of the rim
      const fx = c[0] + s * 70, fy = c[1] - WR - 18;
      paint([[fx - 22, fy], [fx + 22, fy], [fx + s * 4, fy + 78]], { wash: '#F4EEDC', fill: '#CFC4AA', fillOp: 60, ink: INK, sw: 1 });
    }
  }
  // the exit: a moon with a door, «ЛИМИТ 0»; a tiny Clawd on a ladder that is one rung too short
  function exitMoon(t) {
    const mx = 1600, my = 40, r = 105;
    paint(ellPts(mx, my, r * 2, r * 2, 20), { fill: '#FFF6C8', fillOp: 80 + 30 * Math.sin(t * 2), bleed: .3, ink: null });
    paint(ellPts(mx, my, r, r, 28), { wash: '#FFF6D8', fill: '#E8DDB0', fillOp: 70, tex: .5, ink: INK, sw: 1.2 });
    paint(rrPts(mx - 26, my - 36, 52, 76, 22), { wash: A2.gunDk, ink: INK, sw: .9 });
    paint(ellPts(mx + 14, my + 6, 4, 4, 6), { wash: A2.hazard, ink: null });
    letter('ВЫХОД', mx, my - 52, 20, INK, { font: ruFont(20), ink: false });
    paint(rrPts(mx - 88, my + r + 10, 176, 50, 8), { wash: A2.cream, ink: INK, sw: .8 });
    letter('ЛИМИТ 0', mx, my + r + 36, 34, '#D0202A', { font: ruFont(34), ink: false });
    const lb = [1390, 250], lt = [1455, 120];                            // ladder from the demon's shoulder, short by a mile
    for (const d of [-14, 14]) inkLine([[lb[0] + d, lb[1]], [lt[0] + d, lt[1]]], 3, A2.rust, 'marker', 0);
    for (let i = 1; i < 6; i++) { const q = i / 6; inkLine([[lerp(lb[0], lt[0], q) - 14, lerp(lb[1], lt[1], q)], [lerp(lb[0], lt[0], q) + 14, lerp(lb[1], lt[1], q)]], 2, A2.rust, 'ink', 0); }
    clawd(lt[0], lt[1] + 6, 5.5, { aL: .2, aR: 1.5 + .15 * Math.sin(t * 8), eyes: 'normal', mouth: 'o', noShadow: true, dy: -Math.abs(Math.sin(t * 6)) * .6 });
  }

  // camera: whips to the sung realm (tracking it as the wheel spins), punches in on repeated realms, wide at the ends
  const FOC = [[145.4, 'wide'], [145.7, 'gpu'], [146.56, 'tok'], [147.8, 'tok'], [149.1, 'agt'], [150.36, 'agt'], [151.58, 'tsk'], [152.86, 'tsk'], [154.0, 'tok'], [154.55, 'wide']];
  const focusOf = (k, t) => k === 'wide' ? [1000, 500, .86] : [...realmXY(k, t), 1.75];
  function t07_whip(x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function wheelCam(t) {
    let i = 0; for (let j = 1; j < FOC.length; j++) if (t >= FOC[j][0] - .1) i = j;
    const te = FOC[i][0], p = i ? t07_whip(seg(t, te - .1, te + .14)) : 1, a = focusOf(FOC[i][1], t), b = i ? focusOf(FOC[i - 1][1], t) : a;
    const same = i && FOC[i][1] === FOC[i - 1][1];
    const z = lerp(b[2], a[2], p) * (same ? 1 - .32 * Math.sin(Math.PI * p) : 1) * (1 + .03 * (t - te) * (a[2] > 1));
    return [lerp(b[0], a[0], p), lerp(b[1], a[1], p), z];
  }
  function loopShot(t, lt) {
    const li = LINES.reduce((j, L, i) => t >= L[0] ? i : j, 0), l0 = LINES[li][0], lend = li < 3 ? LINES[li + 1][0] : ECO;
    const hk = hitK(t, [...EVT, ...hitsIn(145.5, ECO, 6)], .2), sq = squelch(t, l0, lend);
    acidField(t, { k: .5 + hk * .4, sq, hy: 560, speed: 1 + li * .6, cols: li % 2 ? [A2.magenta, A2.acid] : [A2.acid, A2.magenta] });
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#1A0B40', washOp: 130, ink: null });      // knock the rave back so the wheel reads
    const [cx, cy, z] = wheelCam(t), [sx, sy] = shakeXY(t, 9 * hk + 2 * wOmg(t));
    camBegin(cx + sx, cy + sy, z * (1 + .05 * hk), Math.sin(t * 1.3) * .02 + sq * .02 * Math.sin(t * 11));
    const lit = { [LINES[li][1]]: 1, [LINES[li][2]]: 1 };
    exitMoon(t);
    demon(t);
    wheel(t, { sq, lit });
    demonFront(t);
    camEnd();
    const le = EV.reduce((r, e) => t >= e[0] ? e : r, null);
    if (le) {
      sqText('БОЛЬШЕ ' + GEN[le[1]], 960, 92, 92, t, le[0], sq * .6, { cols: [RCOL[le[1]], '#FFFFFF', A2.hazard] });
      const age = t - le[0];
      sfx(le[2], 1560, 300, 110, RCOL[le[1]], age, { life: 1, rot: .12, font: ruFont(110), stroke: INK });
    }
    letter('ОБОРОТ ' + (Math.floor(wAng(t) / TAU) + 1), 190, 200, 40, A2.acid, { font: ruFont(40), stroke: INK, rot: -.06 });
    counter(250, 255, 30, 1e6 * Math.pow(10, Math.max(0, t - 145.5) * .9), { suffix: ' ₮' });
    flash(Math.exp(-(t - (le ? le[0] : -9)) * 14) * .3, '#FFFFFF');
  }

  // ---------- 155.0 «ЭКОНОМИКА РАБОТАЕТ!»: the demon lets go of the rim and eats what the wheel throws off ----------
  function economy(t, lt) {
    const hits = [155.06, 155.55, 155.92, 156.4, 157.0], hk = hitK(t, hits, .18), sq = squelch(t, ECO, END);
    acidField(t, { k: .85 + hk * .5, sq, hy: 560, speed: 2.6 });
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#1A0B40', washOp: 100, ink: null });
    const drop = 70 * easeOut(seg(t, ECO, ECO + .3)), C = [WC[0], WC[1] + drop], chew = Math.min(1, ...hits.map(h => Math.abs(t - h) / .16));
    const maw = [WC[0], DGY - 4.55 * DU], zin = easeIn(seg(t, 156.7, END));
    const [sx, sy] = shakeXY(t, 10 * hk);
    camBegin(lerp(960, maw[0], zin) + sx, lerp(500, maw[1], zin) + sy, lerp(.74, 2.6, zin) * (1 + .04 * hk));
    exitMoon(t);
    demon(t, { maw: easeOut(seg(t, ECO, ECO + .25)), chew });
    wheel(t, { c: C, sq, lit: { gpu: 1, tok: 1, agt: 1, tsk: 1 } });
    demonFront(t, { c: C, noFangs: true });
    // everything the wheel throws off arcs straight back into the maw: ВЫХОД → ВХОД
    const kinds = ['token', 'task', 'agent', 'token', 'gpu', 'task'];
    for (let i = 0; i < 10; i++) {
      const f = frac(t * .9 + i / 10), side = i % 2 ? 1 : -1, [ox, oy] = polar(Math.PI / 2 - side * (Math.PI / 2 + .3), WR, C);
      const x = lerp(ox, maw[0] + (hash(i) - .5) * 260, f), y = lerp(oy, maw[1], f) - Math.sin(f * Math.PI) * (260 + hash(i + 3) * 120), k = kinds[i % 6];
      if (k === 'token') token(x, y, 28, { spin: t + i, burn: f > .8 ? (f - .8) * 4 : 0 });
      else if (k === 'task') taskSheet(x, y, .5, t * 3 + i);
      else if (k === 'gpu') gpuCard(x, y, .28, t, { rot: t * 2 + i });
      else agentBot(x, y + 30, 5, t, { n: 40 + i, noShadow: true, rot: t * 3 + i, eyes: 'scared', mouth: 'o' });
    }
    letter('ВЫХОД', C[0] - WR - 40, C[1] - 60, 40, A2.hazard, { font: ruFont(40), stroke: INK, rot: -.2 });
    letter('ВХОД', maw[0] + 330, maw[1] - 70, 44, A2.acid, { font: ruFont(44), stroke: INK, rot: .15 });
    camEnd();
    // Clawd, pale, his outline taped back on, watching deadpan from the corner
    const cx = 170, cy = 930, u = 13;
    clawd(cx, cy, u, { col: mixCol(PAL.clay, '#EDE4D0', .55), dk: mixCol(PAL.clayDk, '#D9CDB4', .5), eyes: 'narrow', mouth: 'flat', aL: .2, aR: .2 });
    for (const [px, py, r] of [[cx - 5 * u, cy - 8 * u, -.6], [cx + 5 * u, cy - 2 * u, .5]]) paint(rotPts(rectPts(px - 22, py - 7, 44, 14), px, py, r), { wash: A2.hazard, ink: INK, sw: .5 });
    sqText('ЭКОНОМИКА', 960, 90, 110, t, 155.06, sq, { cols: [A2.acid, A2.hazard, '#FFFFFF'] });
    stamp('РАБОТАЕТ!', 960, 700, 130, t, 155.92, { col: A2.acid, rot: -.07, punch: .1 });
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
