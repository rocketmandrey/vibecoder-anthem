// a07_acid.js: «Жги токены» v2 chapter 7 "БОЛЬШЕ GPU" (132.55–157.35), the centrepiece. Dark factory, fire and sparks
// (no acid look). «БОЛЬШЕ GPU!» ×3 on CEO-Clawd in black shades, each hit gets a short green Matrix code burst:
//   132.55 a GPU grows out of his head (then a tower) · 137.7 he turns into a PCIe slot, a card clicks in, its fans spin
//   up with motion blur, heat shimmer, then it smokes and billows · 143.9 the whole factory plugs into him.
// The instrumental gaps (135.2–137.7, 140.2–143.9) are the GPU RUSH: a panic-joy stampede. Clawds and agents sprint
//   across the hall with GPUs overhead, others zoom through the air riding GPUs like hoverboards, GPUs rain down,
//   CEO-Clawd crowd-surfs across on a GPU (v1 t05 mosh, restaged); the second gap slams on the hits.
// 145.55–155.0 «МАХОВИК ЭКОНОМИКИ» (ported from v1 t05): four stations GPU / ТОКЕНЫ / АГЕНТЫ / ЗАДАЧИ, the camera whips
//   to each on its sung word, stations light up, fire shock rings and fling goods, multipliers, the wheel speeds up.
// 155.0 «ЭКОНОМИКА РАБОТАЕТ!» (v1 t05): stamps, the token index rockets off the top with a burning arrow. Hard cut 157.35.
(() => {
  const INK = PAL.ink;
  const HIT1 = 132.55, HIT2 = 137.7, HIT3 = 143.9, LOOP0 = 145.55, ECO = 155.0, END = 157.35;
  const W1 = [132.64, 133.34], W2 = [137.78, 138.48], W3 = [143.94, 144.8];         // «Больше» / «GPU!» word onsets

  // ---------- helpers ----------
  // factory hall: gunmetal wall, girders, pipe, sodium lamps, hazard-edged floor (world space). o.heat adds a fire glow.
  function a07_hall(t, o = {}) {
    const fy = o.floor ?? 905, heat = o.heat || 0, dark = o.dark || 0;
    paint(rectPts(-700, -600, W + 1400, fy + 600), { wash: mixCol(A2.gunmetal, '#0C0E11', dark), fill: A2.gunDk, fillOp: 120, bleed: .1, tex: .6, border: .3, ink: null });
    if (heat > .02) glowAt(960, fy - 200, 1000, TK.orange, 60 * heat);
    for (let x = -600; x < W + 700; x += 240) inkLine([[x, -600], [x, fy]], .5, A2.gunDk, 'inkfine', 0);
    for (const bx of [-160, 330, 1590, W + 160]) {                                  // riveted girders
      paint(rectPts(bx - 30, -600, 60, fy + 600, 1), { wash: A2.gunDk, fill: A2.steel, fillOp: 60, tex: .6, ink: INK, sw: .8 });
      for (let y = -500; y < fy; y += 90) paint(ellPts(bx, y, 5, 5, 6), { wash: A2.steelLt, ink: null });
    }
    paint(rectPts(-700, 70, W + 1400, 34), { wash: A2.steel, fill: A2.gunDk, fillOp: 70, tex: .5, ink: INK, sw: .5 });   // pipe
    for (let x = -600; x < W + 700; x += 380) paint(rectPts(x, 62, 26, 50), { wash: A2.rust, ink: INK, sw: .4 });
    for (const lx of [620, 1300]) {
      inkLine([[lx, -600], [lx, 110]], .6, INK, 'inkfine', 0);
      paint([[lx - 22, 110], [lx + 22, 110], [lx + 60, 160], [lx - 60, 160]], { wash: A2.gunDk, ink: INK, sw: .5 });
      paint(ellPts(lx, 250, 280, 190, 18), { fill: A2.sodium, fillOp: 55 * (1 - dark), bleed: .3, tex: .2, ink: null });
      paint(ellPts(lx, 162, 34, 10, 10), { wash: '#FFE2A8', washOp: 230 * (1 - dark), ink: null });
    }
    paint(rectPts(-700, fy, W + 1400, 700), { wash: '#15171B', fill: heat > .3 ? TK.orangeDk : A2.gunmetal, fillOp: 50 + 40 * heat, tex: .6, ink: null });
    for (let i = -8; i <= 8; i++) inkLine([[960 + i * 150, fy + 4], [960 + i * 280, fy + 400]], .5, A2.gunmetal, 'inkfine', 0);
    hazard(-700, fy - 6, W + 1400, 16);
  }
  // hazard/sodium lettering that bobs on the beat and pops in on t0 (the old acid squelch-text, repainted)
  function sqText(txt, x, y, size, t, t0, sq, o = {}) {
    const age = t - t0; if (age < 0) return;
    const font = ruFont(size), chars = [...txt], ws = chars.map(c => textW(c, font) * 1.02), tot = ws.reduce((a, b) => a + b, 0);
    const cols = o.cols || [A2.hazard, A2.sodium, A2.cream];
    let cx = x - tot / 2;
    chars.forEach((c, i) => {
      const mid = cx + ws[i] / 2; cx += ws[i]; if (c === ' ') return;
      const la = age - i * .03; if (la < 0) return;
      const bend = Math.sin(i * .9 + t * 13) * (.1 + sq) * size * .25, s = size * (1 + .15 * sq * Math.sin(i * 1.7 + t * 9));
      letter(c, mid, y + bend, s, cols[i % cols.length], { font: ruFont(s), rot: Math.sin(i * 1.3 + t * 7) * .15 * (.2 + sq), stroke: INK, pop: la * 6, ink: false, alpha: o.alpha ?? 1 });
    });
  }
  // the short Matrix burst on a «БОЛЬШЕ GPU!» hit (the only Matrix in this chapter): ~1 s, then gone
  function mxBurst(t, t0, seed) {
    const k = seg(t, t0, t0 + .06) * (1 - seg(t, t0 + .55, t0 + 1.05)); if (k < .01) return 0;
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: A2.matrixBg, washOp: 170 * k * (1 - seg(t, t0 + .2, t0 + .9)), ink: null });
    matrixRain(t, { k: .8 * k, seed, size: 36, speed: 1.6 });
    return k;
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
    if (lit > .02) paint(ellPts(cx, cy, w * .62, h * 1.8, 24), { fill: A2.sodium, fillOp: 140 * lit, bleed: .3, tex: .2, ink: null });
    paint(rrPts(x0, cy - h / 2, w, h, h * .22, 1.5), { wash: '#16181C', fill: TK.sootLt, fillOp: 80, tex: .6, border: .4, ink: INK, sw: 1.2 });
    const sx = x0 + h * 1.35, sw2 = w - h * 1.35 - h * .55;                                    // the slot + gold pins
    paint(rectPts(sx, cy - h * .16, sw2, h * .32, .5), { wash: '#050607', ink: INK, sw: .6 });
    for (let px = sx + 10; px < sx + sw2 - 6; px += 11) if (Math.abs(px - (sx + sw2 * .22)) > 12) inkLine([[px, cy - h * .1], [px, cy + h * .1]], .7, lit > .5 ? A2.hazard : TK.gold, 'inkfine', 0);
    paint(rectPts(sx + sw2 * .22 - 7, cy - h * .2, 14, h * .4), { wash: '#16181C', ink: null });   // key notch
    paint(rrPts(x0 + w - h * .5, cy - h * .38, h * .38, h * .76, 6), { wash: A2.hazard, ink: INK, sw: .7 });   // retention latch
    const fx = x0 + h * .12, fw = h * 1.1;                                                      // face plate: clay end cap, shades, grin
    paint(rrPts(fx, cy - h * .42, fw, h * .84, h * .12), { wash: PAL.clay, fill: PAL.clayDk, fillOp: 70, tex: .5, ink: INK, sw: .9 });
    paint(rrPts(fx + fw * .06, cy - h * .3, fw * .88, h * .24, 5), { wash: '#0A0D0B', ink: INK, sw: .6 });
    inkLine([[fx + fw * .15, cy - h * .2], [fx + fw * .32, cy - h * .26]], .6, A2.matrix, 'inkfine', 0);
    inkLine([[fx + fw * .58, cy - h * .2], [fx + fw * .75, cy - h * .26]], .6, A2.matrix, 'inkfine', 0);
    const gr = o.grin ?? .5;
    paint([[fx + fw * .22, cy + h * .08], [fx + fw * .78, cy + h * .08], [fx + fw * .66, cy + h * (.12 + .18 * gr)], [fx + fw * .34, cy + h * (.12 + .18 * gr)]], { wash: '#4A1F2A', ink: INK, sw: .6, curv: .3 });
    inkLine([[fx - 4, cy - h * .1], [fx + fw * .1, cy + h * .2], [fx + fw * .25, cy + h * .14]], .7, TK.sootLt, 'ink', .6);
    letter('PCIe ×16', sx + sw2 * .62, cy + h * .33, h * .15, TK.gold, { font: ruFont(h * .15), ink: false });
  }

  // ---------- 132.55 «БОЛЬШЕ GPU!» #1: shades on, a GPU grows out of the CEO's head (then a tower) ----------
  function drop1(t, lt) {
    const hits = [...W1, ...hitsIn(132.3, 135.2)], hk = hitK(t, hits, .2);
    const [sx, sy] = shakeXY(t, 10 * hk);
    camBegin(960 + sx, 560 + sy - lt * 30, 1 + lt * .035 + .05 * hk);
    a07_hall(t, { heat: .35 + .4 * hk });
    for (const s of [-1, 1]) fire(960 + s * 560, 905, 260, 200 + 160 * hk, t, { seed: 3 + s, k: .7 + .4 * hk });
    press(40, 470, 320, 435, t, hits, { label: 'ПРЕСС 1', seed: 3 });
    press(W - 360, 470, 320, 435, t, hits, { label: 'ПРЕСС 2', seed: 8 });
    mxBurst(t, HIT1, 7);
    flushLetters();
    const grows = [W1[1], 133.72, 134.36, 134.9];
    ceoClawd(960, 880, 40, {
      hat: 'shades', mouth: t > W1[1] ? 'grin' : 'smile', noClicker: false, click: hk,
      aL: .3 + 1.1 * backOut(seg(t, W1[0], W1[0] + .2)) + hk * .2, aR: .3 + 1.1 * backOut(seg(t, W1[1], W1[1] + .2)) + hk * .2,
      sq: .1 * hk, draw: gpuTower(t, grows)
    });
    grows.forEach((g0, i) => sparks(960 + (i % 2 ? 150 : -150), 880 - 8 * 40 - i * 92, t - g0, i * 11, 14, 220));
    camEnd();
    sqText('БОЛЬШЕ', 520, 200, 120, t, W1[0], .2 * hk);
    sqText('GPU!', 1420, 200, 150, t, W1[1], .2 * hk, { cols: [A2.hazard, A2.cream, A2.sodium] });
  }

  // ---------- the gaps: БОЛЬШЕ GPU madness, a panic-joy stampede ----------
  const EYES = ['scared', 'spark', 'swirl', 'happy', 'scared', 'spark'], MOUTHS = ['O', 'grin', 'O', 'grin', 'wobble', 'O'];
  const AGT = { col: '#6F8BE0', dk: '#3D55A8', lt: '#B5C6F0' };
  // a runner (Clawd or agent) sprinting with a GPU held overhead; (x, y) ground point, dir ±1
  function runner(x, y, u, t, i, dir) {
    const ph = t * 3.4 + hash(i * 3.1), bob = Math.abs(Math.sin(ph * Math.PI)) * .9, rot = dir * .15;
    const o = { walk: ph * 1.6, dy: -bob, rot, flip: dir < 0, aL: 1.25 + .1 * Math.sin(t * 20 + i), aR: 1.25 + .1 * Math.sin(t * 20 + i + 1),
      eyes: EYES[i % 6], mouth: MOUTHS[i % 6], seed: i, emote: i % 4 === 0 ? 'sweat' : null, emoteK: 1 };
    for (let k = 1; k < 4; k++) inkLine([[x - dir * (5.5 + k * 1.6) * u, y - (3 + k * 1.4) * u], [x - dir * (9 + k * 2.6) * u, y - (3 + k * 1.4) * u]], .9, A2.steelLt, 'inkfine', 0);   // speed lines
    if (i % 3 === 1) agentBot(x, y, u, t, { n: 100 + i * 37, ...o });
    else clawd(x, y, u, o);
    gpuCard(x + dir * 1.4 * u, y - (9.1 + bob) * u, u * 11.5 / 360, t * 3, { rot: rot + Math.sin(t * 13 + i) * .06 });
  }
  // a Clawd / agent riding a GPU like a hoverboard, exhaust sparks streaming behind
  function flyer(x, y, s, t, i, dir) {
    const tilt = dir * (.1 + Math.sin(t * 5 + i) * .08), u = 22 * s, bx = x, by = y - 65 * s;
    for (let k = 0; k < 7; k++) {
      const f = frac(t * 3 + k / 7), ex = x - dir * (170 * s + f * 420 * s), ey = y + 20 * s + Math.sin(k * 2 + t * 9) * 16 * s + f * f * 60 * s;
      inkLine([[ex, ey], [ex - dir * 70 * s * (1 - f), ey]], 3.4 * (1 - f) + .5, k % 2 ? A2.sodium : A2.hazard, 'ink', 0);
    }
    glowAt(x - dir * 170 * s, y + 20 * s, 70 * s, A2.sodium, 110);
    push(); translate(x, y); rotate(tilt); translate(-x, -y);
    gpuCard(x, y, s, t * 4, { glow: .35 });
    const o = { rot: 0, flip: dir < 0, noShadow: true, aL: i % 2 ? 1.7 : .5, aR: i % 2 ? 1.7 : 1.3, eyes: EYES[(i + 2) % 6], mouth: MOUTHS[(i + 1) % 6], seed: i + 20 };
    if (i % 2) agentBot(bx, by, u, t, { n: 7 + i * 11, ...o }); else clawd(bx, by, u, o);
    pop();
  }
  // CEO-Clawd crowd-surfing on a GPU, carried by the hands of the stampede (v1 t05_surfer)
  function surfer(x, y, t, s) {
    const bob = Math.abs(Math.sin(t * 6.2)) * 18, rot = Math.sin(t * 3) * .08;
    gpuCard(x, y - bob, .75 * s, t, { rot, glow: .3 });
    for (const i of [-1, 0, 1]) {
      const hx = x + i * 110 * s, hy = y + 70 * s - bob + Math.sin(t * 14 + i) * 6;
      paint(rotPts(rectPts(hx - 9 * s, hy - 10 * s, 18 * s, 55 * s), hx, hy, -i * .08), { wash: PAL.clay, fill: PAL.clayDk, fillOp: 60, ink: INK, sw: .6 });
      paint(rrPts(hx - 14 * s, hy - 38 * s, 28 * s, 34 * s, 10 * s), { wash: PAL.clay, ink: INK, sw: .6 });
    }
    ceoClawd(x - 10 * s, y - bob - 46 * s, 13 * s, { hat: 'shades', rot: rot - .15, aL: 1.9, aR: 1.6 + .3 * Math.sin(t * 12), mouth: 'grin', click: pulse2(t, 9), noShadow: true });
  }
  // a GPU falling out of the sky, spinning, with speed streaks
  function rainCard(i, t, seed, s0) {
    const per = 1 + hash(i + seed) * .5, c = Math.floor(t / per + hash(i * 3 + seed)), f = frac(t / per + hash(i * 3 + seed));
    const x = 80 + hash(i * 7 + c + seed) * (W - 160), y = -160 + f * 1150, s = s0 + hash(i + c) * .12, rot = (hash(i + c * 5) - .5) * 1.2 + t * (hash(i) - .5) * 5;
    for (const d of [-1, 1]) inkLine([[x + d * 60 * s, y - 90 * s], [x + d * 60 * s, y - 260 * s]], 1.2, A2.steelLt, 'inkfine', 0);
    gpuCard(x, y, s, t * 2, { rot, fans: false });
  }
  const wrapX = (t, v, i, seed, dir) => { const span = W + 900, p = frac((t * v) / span + hash(i * 5 + seed)); return dir > 0 ? -450 + p * span : W + 450 - p * span; };
  function rush(lvl, seed, slams) {
    return (t, lt, dur) => {
      const hk = hitK(t, slams, .22), p2 = pulse2(t, 7);
      const [sx, sy] = shakeXY(t, 5 + 5 * lvl * p2 + 16 * hk);
      camBegin(960 + Math.sin(t * 1.4) * 30 + sx, 540 + sy, 1.03 + .02 * p2 + .06 * hk, Math.sin(t * 1.7) * .02 * lvl);
      a07_hall(t, { heat: .5 + .3 * lvl + .4 * hk });
      for (const [x, s] of [[330, 1], [1590, -1]]) siren(x, 190, t, { col: s > 0 ? A2.sodium : TK.ember, speed: 1.6, len: 700 });
      for (const x of [110, 1810]) fire(x, 905, 300, (230 + 60 * lvl) * (.8 + .3 * p2 + .5 * hk), t, { seed: x + seed, k: .6 + .2 * lvl });
      // GPUs raining down behind everything
      for (let i = 0; i < 4 + lvl; i++) rainCard(i, t, seed, .3);
      // mid lane: the stampede, far, lots of them
      const nMid = 4 + lvl;
      for (let i = 0; i < nMid; i++) { const dir = i % 4 === 3 ? -1 : 1; runner(wrapX(t, 520 + hash(i + seed) * 380, i, seed, dir), 800, 10.5, t, i + seed, dir); }
      // CEO crowd-surfs over them
      surfer(lerp(-350, W + 350, seg(t, t - lt, t - lt + dur)), 560, t, 1.2);
      // flyers zooming through the air on GPUs
      const nFly = 3 + lvl;
      for (let i = 0; i < nFly; i++) {
        const dir = i % 3 === 2 ? -1 : 1, v = 900 + hash(i * 9 + seed) * 700, x = wrapX(t, v, i + 20, seed, dir);
        const pr = dir > 0 ? (x + 450) / (W + 900) : 1 - (x + 450) / (W + 900);
        flyer(x, 300 + (i % 3) * 150 + (pr - .5) * (i % 2 ? -220 : 160) + Math.sin(t * 4 + i) * 24, .42 + (i % 2) * .1, t, i + seed, dir);
      }
      // front lane: big, fast, right past the lens
      const nFr = 2 + lvl;
      for (let i = 0; i < nFr; i++) { const dir = i === 2 ? -1 : 1; runner(wrapX(t, 1000 + hash(i * 13 + seed) * 500, i + 40, seed, dir), 935, 19, t, i + seed + 3, dir); }
      // sparks everywhere
      for (let i = 0; i < 4; i++) {
        const per = .5, c = Math.floor(t / per + hash(i)), a = frac(t / per + hash(i)) * per;
        sparks(150 + hash(i * 3 + c) * (W - 300), 300 + hash(i * 7 + c) * 520, a, i + c * 7, 12, 200);
      }
      // the slams: a pallet of GPUs bursts out of the floor
      for (const s0 of slams) {
        const age = t - s0; if (age < 0 || age > 1.2) continue;
        for (let i = 0; i < 7; i++) {
          const a = -Math.PI / 2 + (hash(i + s0) - .5) * 2.2, v = 900 + hash(i * 3 + s0) * 700;
          gpuCard(960 + Math.cos(a) * v * age, 880 + Math.sin(a) * v * age + 1100 * age * age, .42, t, { rot: age * (hash(i) - .5) * 16 });
        }
        if (age < .4) paint(ellPts(960, 880, 120 + age * 1600, 40 + age * 400, 30), { ink: A2.hazard, sw: 4 * (1 - age / .4) + .4 });
      }
      // the wall sign goes last and is flushed now, so no falling GPU / flyer ever covers it
      paint(rrPts(960 - 330, 170, 660, 84, 10), { wash: A2.hazard, fill: '#C9A40E', fillOp: 60, tex: .5, ink: INK, sw: 1.2 });
      letter('ОТДЕЛ ЗАКУПОК GPU', 960, 213, 54, INK, { font: ruFont(54), ink: false });
      flushLetters();
      camEnd();
      for (const s0 of slams) sfx('ЕЩЁ GPU!', 960, 400, 120, A2.hazard, t - s0, { life: .9, font: ruFont(120), stroke: INK, rot: -.06 });
      const bought = 1200 * Math.pow(3, (t - 135.2) * .9);
      letter('КУПЛЕНО GPU:', 60, 330, 40, A2.hazard, { font: ruFont(40), align: 'left', stroke: INK });
      counter(210, 385, 36, bought);
      flash(hk * .25, A2.cream);
    };
  }

  // ---------- 137.7 «БОЛЬШЕ GPU!» #2: the CEO turns into a PCIe slot, a GPU clicks in, spins up, smokes ----------
  const GX = 1040, GY = 780 - 60 - 95, GS = 1.45;                                   // the plugged card's centre + scale
  function drop2(t, lt) {
    const hits = [...W2, ...hitsIn(137.6, 140.2)], hk = hitK(t, hits, .2), a = t - W2[1];
    const spin = seg(a, 0, 1.3), heat = seg(a, .5, 1.4), smk = seg(a, .8, 1.5);
    const [sx, sy] = shakeXY(t, 12 * hk + 6 * spin * spin);
    camBegin(960 + sx, 580 + sy - 40 * smk, 1.04 + .06 * hk - lt * .02 + .1 * ease(seg(a, 0, 1.2)) - .08 * smk);
    a07_hall(t, { heat: .25 + .6 * heat, dark: .2 });
    mxBurst(t, HIT2, 21);
    flushLetters();
    const m = seg(t, W2[0], W2[0] + .45);
    if (m < .62) {                                                                                    // squashing flat and wide
      const e = ease(m / .62);
      ceoClawd(960, 900, 34, { hat: 'shades', mouth: 'O', sx: 1 + 1.6 * e, sy: 1 - .72 * e, aL: 1.4 - e, aR: 1.4 - e, draw: gpuTower(t, [HIT2 - 5, HIT2 - 4, HIT2 - 3].map((g, i) => e > .3 + i * .15 ? 1e9 : g)) });
    } else {
      const pk = backOut(seg(t, W2[0] + .28, W2[0] + .5));
      push(); translate(960, 780); scale(1, pk); translate(-960, -780);
      slotCEO(960, 780, 900, t, { grin: seg(t, W2[1], W2[1] + .2) * (1 - smk * .7), lit: Math.max(hitK(t, [W2[1]], .4), heat * .7), sq: .3 * hitK(t, [W2[1]], .15) + .05 * spin * Math.sin(t * 60) });
      pop();
      const plug = easeIn(seg(t, W2[1] - .25, W2[1]));                                             // the card drops in on «GPU!»
      const vib = spin * spin * 3 * Math.sin(t * 90), wob = a > 0 ? Math.sin(a * 30) * 6 * Math.exp(-a * 5) : 0;
      const gy = lerp(-200, GY, plug) + wob + vib;
      if (heat > .02) glowAt(GX, gy, 330 * (.6 + heat), TK.ember, 120 * heat);
      // fans: phase accelerates (angle = 9 * phase inside gpuCard), then a motion-blur disc takes over
      const ph = a > 0 ? t + 3 * a + 9 * a * a : t;
      gpuCard(GX, gy, GS, ph, { glow: .3 + hitK(t, [W2[1]], .4) });
      const r = 130 * GS * .33, blur = seg(a, .25, .9);
      for (const fx of [-360 * GS * .22, 360 * GS * .2]) if (blur > .02) {
        paint(ellPts(GX + fx, gy, r * .95, r * .95, 20), { fill: A2.steelLt, fillOp: 150 * blur, bleed: .15, tex: .2, ink: null });
        for (let k = 0; k < 3; k++) {
          const a0 = ph * 9 * .37 + k * TAU / 3, arc = [];
          for (let j = 0; j <= 8; j++) { const q = a0 + j * .16; arc.push([GX + fx + Math.cos(q) * r * (.45 + k * .15), gy + Math.sin(q) * r * (.45 + k * .15)]); }
          inkLine(arc, 2, '#FFFFFF', 'inkfine', .3);
        }
        paint(ellPts(GX + fx, gy, r * .2, r * .2, 10), { wash: heat > .5 ? TK.orange : TK.green, ink: null });
      }
      if (a > 0) {
        for (const sd of [-1, 1]) for (let i = 0; i < 8; i++) {                                    // the click
          const p = seg(a, 0, .35), ang = -Math.PI / 2 + sd * (.3 + i * .15), d = 60 + p * 220;
          if (p < 1) inkLine([[GX + sd * 250 + Math.cos(ang) * d * .6, 720 + Math.sin(ang) * d * .6], [GX + sd * 250 + Math.cos(ang) * d, 720 + Math.sin(ang) * d]], 2 * (1 - p) + .4, i % 2 ? A2.hazard : '#FFFFFF', 'inkfine', 0);
        }
        // heat shimmer: wavy hot air rising off the card
        if (heat > .02) for (let i = 0; i < 12; i++) {
          const x0 = GX - 240 + i * 44, pts = [];
          for (let j = 0; j <= 10; j++) { const yy = gy - 100 - j * 36 * (.5 + heat); pts.push([x0 + Math.sin(yy * .05 + t * 16 + i) * 22 * heat, yy]); }
          inkLine(pts.slice(i % 3, 7 + i % 4), 1.3, i % 2 ? '#FFD9A0' : '#FFB070', 'inkfine', .6);
        }
        if (heat > .3) sparks(GX + (hash(Math.floor(t * 8)) - .5) * 400, gy - 60, frac(t * 8) / 8 * 2.5, Math.floor(t * 8), 10, 170);
        // smoke: it starts to smoke, then billows up and over everything
        if (smk > .01) {
          for (const [dx, sd] of [[-150, 1], [0, 2], [150, 3]]) smoke(GX + dx, gy - 50, t, { n: 6, h: 380 + 500 * smk, r: 40 + 70 * smk, col: '#6A6466', seed: sd, per: 1.4 });
          for (let i = 0; i < 12; i++) {                                                             // billowing puffs, bigger as they rise
            const f = frac(t * .9 + i / 12), bx = GX + (hash(i) - .5) * 420 + Math.sin(t * 2 + i) * 40 + (f * f) * (hash(i + 2) - .5) * 500;
            const by = gy - 70 - f * 620 * (.5 + smk), rr = (50 + f * 170) * (.5 + .5 * smk), op = smk * (1 - f * .45);
            paint(ellPts(bx, by, rr * 1.25, rr, 16, rr * .12), { wash: i % 2 ? '#9A9496' : '#77716F', washOp: 220 * op, fill: '#4A4447', fillOp: 120 * op, bleed: .3, tex: .5, border: .5, ink: null });
          }
        }
      }
    }
    camEnd();
    if (a > 0) {
      sfx('КЛАЦ!', 1500, 560, 90, A2.hazard, a, { life: .7, font: ruFont(90), stroke: INK, rot: .12 });
      if (a > .6 && a < 1.5) { const k = seg(a, .6, 1.3); letter('В' + 'Ж'.repeat(2 + Math.floor(k * 4)) + '!', 1400, 440, 70 + 60 * k, mixCol(A2.cream, A2.sodium, k), { font: ruFont(70 + 60 * k), stroke: INK, rot: -.08 + Math.sin(t * 40) * .03 * k }); }
      sfx('ПШШШ…', 420, 470, 100, A2.steelLt, a - 1.25, { life: 1.3, font: ruFont(100), stroke: INK, rot: -.1 });
    }
    sqText('БОЛЬШЕ', 520, 180, 120, t, W2[0], .2 * hk, { cols: [A2.cream, A2.hazard, A2.sodium] });
    sqText('GPU!', 1420, 180, 150, t, W2[1], .2 * hk, { cols: [A2.hazard, A2.sodium, A2.cream] });
  }

  // ---------- 143.9 «БОЛЬШЕ GPU!» #3: the whole factory plugs into him ----------
  function chimney(x, y, w, h, t, seed) {
    paint(rectPts(x - w / 2, y - h, w, h, 1), { wash: A2.rust, fill: '#6E2E18', fillOp: 90, tex: .6, ink: INK, sw: .7 });
    for (let i = 1; i < 4; i++) paint(rectPts(x - w / 2, y - h + i * h / 4, w, 8), { wash: '#F1E8D2', washOp: 170, ink: null });
    smoke(x, y - h, t, { n: 4, h: 200, r: 30, col: '#3A3336', seed });
  }
  function drop3(t, lt) {
    const hits = [...W3, ...hitsIn(143.8, 145.55)], hk = hitK(t, hits, .2);
    const [sx, sy] = shakeXY(t, 14 * hk);
    const zi = easeOut(seg(t, HIT3 + .05, W3[1] + .1));
    camBegin(960 + sx, lerp(740, 560, zi) + sy, lerp(1.45, .96, zi) - lt * .02);
    const lit = seg(t, W3[1], W3[1] + .1) * (.7 + .3 * Math.sin(t * 30));
    a07_hall(t, { heat: .3 + .6 * lit, dark: .15 });
    mxBurst(t, HIT3, 43);
    flushLetters();
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
      inkLine([[px, py], [mx, my], [ex, ey - 20]], 2.5, [A2.hazard, A2.sodium, TK.ember][i % 3], 'ink', .6);
      paint(rectPts(ex - 20, ey - 50, 40, 44, 1), { wash: A2.gunmetal, fill: A2.steel, fillOp: 70, ink: INK, sw: .8 });
      for (const d of [-9, 9]) paint(rectPts(ex + d - 3, ey - 8, 6, 16), { wash: TK.gold, ink: null });
      if (p > .98 && lit < .1) sparks(ex, ey, t - (W3[0] + .45 + (i % 5) * .1), i * 7, 6, 90);
      if (lit > .1) paint(ellPts(ex, ey - 25, 44, 44, 12), { fill: A2.sodium, fillOp: 160 * lit, bleed: .3, ink: null });
    });
    slotCEO(960, cy, 1000, t, { grin: .4 + lit * .6, lit, sq: .25 * hitK(t, [W3[1]], .15), h: 130 });
    gpuCard(1040, cy - 65 - 95, 1.45, t * (1 + 3 * lit), { glow: .3 + lit });
    if (lit > .1) for (const s of [-1, 1]) fire(960 + s * 420, cy - 60, 200, 240 * lit, t, { seed: 30 + s });
    for (let i = 0; i < 6 && lit > .1; i++) {                                                        // it all lights at once
      const q = i / 6 * TAU + t * 3;
      inkLine([[960 + Math.cos(q) * 520, cy + Math.sin(q) * 110], [960 + Math.cos(q) * 640, cy + Math.sin(q) * 150]], 2.5 * lit, A2.hazard, 'ink', 0);
    }
    camEnd();
    sqText('БОЛЬШЕ', 560, 175, 120, t, W3[0], .2 * hk);
    sqText('GPU!', 1400, 175, 160, t, W3[1], .2 * hk, { cols: [A2.cream, A2.hazard, A2.sodium] });
  }

  // ---------- 145.55 «МАХОВИК ЭКОНОМИКИ» (ported from v1 t05 97.3–114, retimed to v2's words) ----------
  const WC = [960, 465], ERX = 520, ERY = 315;                                       // wheel centre, station ellipse
  const ST = {
    gpu:  { x: 960, y: 150, label: 'GPU', a: -Math.PI / 2 },
    tok:  { x: 1480, y: 465, label: 'ТОКЕНЫ', a: 0 },
    agt:  { x: 960, y: 780, label: 'АГЕНТЫ', a: Math.PI / 2 },
    task: { x: 440, y: 465, label: 'ЗАДАЧИ', a: Math.PI }
  };
  const ORDER = ['gpu', 'tok', 'agt', 'task'];
  const FH = [
    [145.60, 'gpu', 'БОЛЬШЕ GPU!', 'x2'], [146.56, 'tok', 'БОЛЬШЕ ТОКЕНОВ!', 'x1000'], [147.80, 'agt', 'БОЛЬШЕ АГЕНТОВ!', '+100'],
    [149.10, 'agt', 'БОЛЬШЕ АГЕНТОВ!', '+10⁴'], [150.36, 'task', 'БОЛЬШЕ ЗАДАЧ!', '+1000'], [151.58, 'task', 'БОЛЬШЕ ЗАДАЧ!', '+10⁶'],
    [152.86, 'tok', 'БОЛЬШЕ ТОКЕНОВ!', 'x10⁹'], [154.0, 'tok', 'БОЛЬШЕ ТОКЕНОВ!', '∞']
  ];
  const F0 = 145.2;
  const fwOmega = t => 1.2 + Math.max(0, t - F0) * .6;                                   // rad/s, ramps every lap
  const fwAng = t => { const d = Math.max(0, t - F0); return 1.2 * d + .3 * d * d + .06 * easeOut(frac(t * 3.13)); };
  const fwN = (t, st) => FH.filter(h => h[1] === st && t >= h[0]).length;
  const fwGlow = (t, st) => { let g = 0; for (const h of FH) if (h[1] === st && t >= h[0]) g = Math.max(g, Math.exp(-(t - h[0]) * 2.6)); return g; };
  const fwLast = t => { let r = null; for (const h of FH) if (t >= h[0]) r = h; return r; };
  const ellAt = a => [WC[0] + Math.cos(a) * ERX, WC[1] + Math.sin(a) * ERY];

  function fwGearPts(cx, cy, R, n, a) {
    const p = [];
    for (let i = 0; i < n; i++) for (const [f, r] of [[0, R], [.18, R * 1.08], [.5, R * 1.08], [.68, R]]) {
      const q = a + (i + f) / n * TAU; p.push([cx + Math.cos(q) * r, cy + Math.sin(q) * r]);
    }
    return p;
  }
  function flywheel(cx, cy, R, t, heat) {
    const a = fwAng(t), w = fwOmega(t), sw = clamp(R / 200, .6, 1.6);
    for (const s of [-1, 1]) paint([[cx + s * R * .12, cy], [cx + s * R * .22, cy], [cx + s * R * .95, 905], [cx + s * R * .72, 905]], { wash: A2.gunDk, fill: A2.steel, fillOp: 80, tex: .6, ink: INK, sw });
    paint(rectPts(cx - R * 1.05, 880, R * 2.1, 28, 1), { wash: A2.steel, ink: INK, sw });
    paint(fwGearPts(cx, cy, R, 22, a), { wash: mixCol(A2.steel, TK.orangeDk, heat * .7), fill: A2.gunDk, fillOp: 100, tex: .6, border: .5, ink: INK, sw: sw * 1.2 });
    paint(ellPts(cx, cy, R * .8, R * .8, 30), { wash: TK.soot, fill: TK.emberDk, fillOp: 50 + 90 * heat, bleed: .2, tex: .5, ink: INK, sw: sw * .8 });
    if (w > 2.2) for (let k = 0; k < 5; k++) {                                   // motion-blur fans trailing the spokes
      const a0 = a + k * TAU / 5, span = clamp((w - 2) * .09, 0, .9), pts = [[cx, cy]];
      for (let j = 0; j <= 6; j++) { const q = a0 - span * j / 6; pts.push([cx + Math.cos(q) * R * .78, cy + Math.sin(q) * R * .78]); }
      paint(pts, { wash: heat > .5 ? TK.orange : A2.steelLt, washOp: 70, ink: null });
    }
    for (let k = 0; k < 5; k++) {
      const q = a + k * TAU / 5;
      paint(rotPts(rectPts(cx, cy - R * .075, R * .8, R * .15), cx, cy, q), { wash: A2.steelLt, fill: A2.steel, fillOp: 80, tex: .5, ink: INK, sw: sw * .7 });
    }
    token(cx, cy, R * .3, { rot: a, glow: .4 + .5 * pulse2(t, 7) });
    const n = Math.min(24, Math.floor(6 + w * 3));                              // sparks thrown tangentially off the rim
    for (let i = 0; i < n; i++) {
      const per = .45, c = Math.floor(t / per + hash(i)), f = frac(t / per + hash(i)), q = hash(i * 3 + c * 7) * TAU;
      const px = cx + Math.cos(q) * R * 1.06, py = cy + Math.sin(q) * R * 1.06, v = 260 + w * 90 + hash(i + c) * 200;
      const vx = -Math.sin(q) * v, vy = Math.cos(q) * v, x = px + vx * f * per, y = py + vy * f * per + 900 * (f * per) ** 2;
      const tail = .04 + w * .004;
      inkLine([[x, y], [x - vx * tail, y - (vy + 1800 * f * per) * tail]], 2.6 * (1 - f) + .6, f < .4 ? TK.yellowLt : A2.sodium, 'ink', 0);
    }
  }
  function fwRing(t, active, g) {
    const idx = Math.floor(fwAng(t) * 40 / TAU * 1.5);
    for (let i = 0; i < 40; i++) {
      const [x, y] = ellAt(i / 40 * TAU), on = ((i - idx) % 10 + 10) % 10 === 0;
      paint(ellPts(x, y, on ? 9 : 5, on ? 9 : 5, 8), { wash: on ? A2.hazard : A2.steel, ink: null });
    }
    ORDER.forEach(st => {
      const a0 = ST[st].a + .34, a1 = ST[st].a + TAU / 4 - .34, hot = st === active ? g : 0, pts = [];
      for (let j = 0; j <= 10; j++) pts.push(ellAt(lerp(a0, a1, j / 10)));
      inkLine(pts, 3 + hot * 5, mixCol(A2.steelLt, A2.hazard, hot), 'marker', .5);
      const [ex, ey] = pts[10], [px, py] = pts[8], d = Math.hypot(ex - px, ey - py), ux = (ex - px) / d, uy = (ey - py) / d, s = 22 + hot * 10;
      paint([[ex + ux * s, ey + uy * s], [ex - uy * s * .7, ey + ux * s * .7], [ex + uy * s * .7, ey - ux * s * .7]], { wash: hot > .3 ? A2.hazard : A2.steelLt, ink: INK, sw: .6 });
    });
  }
  function podContent(st, x, y, n, g, t) {
    if (st === 'gpu') {
      const k = Math.min(4, 1 + n);
      for (let i = 0; i < k; i++) gpuCard(x - 12 + i * 8, y + 38 - i * 26, .56, t * (1 + n), { glow: i === k - 1 ? g : 0 });
    } else if (st === 'tok') {
      const k = Math.min(15, 6 + n * 3), rows = [5, 4, 3, 2, 1];
      let c = 0;
      rows.forEach((m, r) => { for (let j = 0; j < m && c < k; j++, c++) token(x + (j - (m - 1) / 2) * 38, y + 60 - r * 28, 18, { burn: .25 + .15 * hash(c) }); });
      token(x + 80, y - 30, 30, { rot: t * 2, glow: g, burn: .15 });
    } else if (st === 'agt') {
      const k = Math.min(7, 2 + n * 2);
      for (let i = 0; i < k; i++) {
        const row = i % 2, xx = x + (Math.floor(i / 2) - (Math.ceil(k / 2) - 1) / 2) * 62 + row * 30;
        agentBot(xx, y + 72 - row * 36, 5.4, t, { n: i + 1, dance: g > .2 ? 'hop' : 'bounce', seed: i, eyes: g > .2 ? 'happy' : 'normal', mouth: 'grin', noShadow: true });
      }
    } else {
      const k = Math.min(12, 3 + n * 3);
      for (let i = 0; i < k; i++) {
        const tx = x - 70 + (i % 4) * 44 + hash(i) * 10, ty = y + 55 - Math.floor(i / 4) * 34 - i * 3, rot = (hash(i + 4) - .5) * .5;
        paint(rotPts(rectPts(tx - 32, ty - 20, 64, 42), tx, ty, rot), { wash: A2.cream, ink: INK, sw: .5 });
        paint(rotPts(rectPts(tx - 24, ty - 10, 10, 10), tx, ty, rot), { wash: i < n * 3 ? TK.green : '#FFFFFF', ink: INK, sw: .4 });
        inkLine(rotPts([[tx - 8, ty - 5], [tx + 24, ty - 5]], tx, ty, rot), .5, TK.ash, 'inkfine', 0);
        inkLine(rotPts([[tx - 24, ty + 8], [tx + 22, ty + 8]], tx, ty, rot), .5, TK.ash, 'inkfine', 0);
      }
    }
  }
  function fwBurst(st, x, y, age, t, seed) {
    const ox = x - WC[0], oy = y - WC[1], d = Math.hypot(ox, oy) || 1, ux = ox / d, uy = oy / d;
    const n = st === 'gpu' ? 4 : st === 'agt' ? 6 : 10;
    for (let i = 0; i < n; i++) {
      const sp = (hash(i + seed) - .5) * 1.8, v = 500 + hash(i + seed * 3) * 500, dx = ux * Math.cos(sp) - uy * Math.sin(sp), dy = ux * Math.sin(sp) + uy * Math.cos(sp);
      const px = x + dx * v * age, py = y + dy * v * age + 700 * age * age, rot = age * (hash(i) - .5) * 14;
      if (st === 'gpu') gpuCard(px, py, .3, t, { rot, fans: false });
      else if (st === 'tok') token(px, py, 16, { spin: age * 3 + hash(i), rot });
      else if (st === 'agt') clawd(px, py, 4.5, { ...AGT, rot, aL: 1.4, aR: 1.4, eyes: 'happy', mouth: 'O', noShadow: true, seed: i });
      else paint(rotPts(rectPts(px - 24, py - 16, 48, 32), px, py, rot), { wash: A2.cream, ink: INK, sw: .5 });
    }
  }
  function pod(st, t, focus) {
    const S = ST[st], { x, y } = S, g = fwGlow(t, st), n = fwN(t, st), lit = n > 0 ? .35 : 0;
    const pw = 300, ph = 190;
    if (g > .02) glowAt(x, y, 260 + 80 * g, A2.sodium, 110 * g);
    paint(rrPts(x - pw / 2, y - ph / 2, pw, ph, 16), { wash: mixCol(A2.gunDk, '#4A2A18', lit + g * .5), fill: TK.soot, fillOp: 70, tex: .6, ink: INK, sw: 1.2 });
    for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) paint(ellPts(x + dx * (pw / 2 - 12), y + dy * (ph / 2 - 12), 5, 5, 6), { wash: A2.steelLt, ink: null });
    hazard(x - pw / 2 + 10, y + ph / 2 - 16, pw - 20, 10);
    podContent(st, x, y, n, g, t);
    const py = y - ph / 2 - 30, lamp = Math.max(lit, g);
    paint(rrPts(x - 118, py - 26, 236, 52, 8), { wash: mixCol(A2.steel, A2.hazard, g), ink: INK, sw: 1 });
    letter(S.label, x, py + 1, 38, g > .3 ? TK.soot : A2.cream, { font: ruFont(38), ink: false });
    paint(ellPts(x + 140, py, 16, 16, 12), { wash: lamp > .1 ? mixCol(A2.sodium, TK.yellowLt, g) : TK.emberDk, ink: INK, sw: .7 });
    if (lamp > .1) glowAt(x + 140, py, 40 + 60 * g, A2.hazard, 90 * lamp);
    for (const h of FH) {                                                         // hit: shock ring + flying goods + multiplier
      if (h[1] !== st) continue;
      const age = t - h[0]; if (age < 0 || age > 1.1) continue;
      const rr = 120 + age * 520;
      if (age < .5) paint(ellPts(x, y, rr, rr * .7, 30), { ink: A2.hazard, sw: 3 * (1 - age * 2) + .3 });
      fwBurst(st, x, y, age, t, h[0]);
      if (focus) sfx(h[3], x + pw / 2 + 25, y - 10, 90, A2.hazard, age, { life: .9, rot: .12, stroke: TK.soot, align: 'left' });   // beside the pod, clear of its label and the header
    }
  }
  const CAMK = [
    [145.55, [960, 430, 1.0, 0]], [145.64, [960, 320, 1.45, -.02]], [146.42, [960, 305, 1.55, -.03]], [146.56, [1330, 470, 1.55, .03]],
    [147.66, [1315, 478, 1.62, .02]], [147.80, [960, 720, 1.5, -.02]], [148.96, [950, 712, 1.56, -.02]], [149.10, [960, 700, 1.85, .02]],
    [150.22, [960, 700, 1.9, .02]], [150.36, [600, 480, 1.5, .02]], [151.44, [595, 480, 1.56, .02]], [151.58, [540, 470, 1.85, -.02]],
    [152.72, [540, 470, 1.9, -.02]], [152.86, [1330, 470, 1.55, .03]], [153.86, [1320, 475, 1.62, .03]], [154.0, [960, 428, .86, 0]], [155.0, [960, 428, .92, .02]]
  ];
  // 9:16 (VERT only): the same whips, but each lands with its pod + multiplier centred (pod x + 150), so vfocus can hold a square window at 960
  const VCAMX = [960, 1110, 1110, 1630, 1615, 1110, 1100, 1110, 1110, 590, 585, 590, 590, 1630, 1620, 960, 960];
  const CAMKV = CAMK.map(([k, [x, y, z, r]], i) => [k, [VCAMX[i], y, z, r]]);
  function fwWhip(x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function wheelShot(t) {
    const heat = seg(t, 147.5, 154.6), last = fwLast(t), hitAge = last ? t - last[0] : 9;
    const [cx, cy, z, r] = kf(t, window.VERT ? CAMKV : CAMK, fwWhip), [sx, sy] = shakeXY(t, 14 * Math.exp(-hitAge * 7) + 3 * heat * pulse2(t));
    camBegin(cx + sx, cy + sy, z * (1 + .018 * pulse2(t, 7) + .05 * Math.exp(-hitAge * 9)), r);
    a07_hall(t, { heat: .3 + .7 * heat, dark: .1 });
    glowAt(WC[0], WC[1], 700, TK.orange, 40 + 40 * heat + 25 * pulse2(t, 8));
    if (heat > .4) for (const fx of [150, 1770]) fire(fx, 910, 300, 300, t, { k: seg(heat, .4, 1), seed: fx });
    fwRing(t, last ? last[1] : null, last ? Math.exp(-hitAge * 1.8) : 0);
    flywheel(WC[0], WC[1], 190, t, heat);
    const focus = last ? last[1] : null;
    for (const st of ORDER) pod(st, t, st === focus);
    counter(ST.tok.x, ST.tok.y + 130, 28, 1e6 * Math.pow(10, Math.max(0, t - 145.5) / 2));
    counter(ST.task.x, ST.task.y + 130, 28, Math.pow(2, 6 + Math.max(0, t - 145.5) * 2.6));
    camEnd();
    if (last) punkText(last[2], 960, 112, window.VERT ? 68 : 80, t, last[0], { seed: Math.round(last[0] * 10), step: .012 });
    const [bx, by] = window.VERT ? [446, 930] : [34, 214];                          // VERT: bottom-left of the square window
    paint(rrPts(bx, by, 470, 118, 10), { wash: A2.gunDk, washOp: 220, ink: INK, sw: .8 });
    letter('МАХОВИК ЭКОНОМИКИ', bx + 16, by + 32, 42, A2.hazard, { font: ruFont(42), align: 'left', stroke: INK, rot: -.03 });
    letter('КРУГ ' + (Math.floor(fwAng(t) / TAU) + 1), bx + 16, by + 88, 40, A2.cream, { font: ruFont(40), align: 'left', stroke: INK, rot: -.03 });
    flash(Math.exp(-hitAge * 14) * .35, TK.yellowLt);
  }

  // ---------- 155.0 «ЭКОНОМИКА РАБОТАЕТ!» (v1 t05 114–116.4) ----------
  const E1 = 155.06, E2 = 155.92;
  function economy(t, lt) {
    const moon = easeIn(seg(t, 155.3, 156.9)), k = seg(t, ECO, 155.45);
    const s1 = t > E1 ? Math.exp(-(t - E1) * 6) : 0, s2 = t > E2 ? Math.exp(-(t - E2) * 6) : 0;
    const [sx, sy] = shakeXY(t, 18 * s1 + 18 * s2);
    camBegin(960 + sx, 540 + sy - 40 * moon, 1 + .04 * lt, -.015 * moon);
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: A2.gunDk, ink: null });
    sunburst(1500, 200, TK.emberDk, A2.gunmetal, t * .5, 18, 2400, 90);
    flywheel(1720, 330, 120, t, 1);
    paint(rectPts(-400, 905, W + 800, 600), { wash: '#15171B', ink: INK, sw: 1 });
    hazard(-400, 899, W + 800, 16);
    ticker(t, { y: -10, h: 64, items: ['TOKN ▲ 900%', 'NVDA ▲', 'CAPEX ▲', 'AGI ▲ СКОРО', 'GPU ▲'], speed: 700 });
    stockChart(250, 150, 1330, 700, t, { k, moon, n: 18, title: 'ИНДЕКС ТОКЕНОВ', seed: 5 });
    if (moon > .03) {                                                             // the breakout arrow keeps flying off the top
      const ay = lerp(200, -700, moon), ax = 1500 + moon * 90;
      inkLine([[1490, 330], [ax - 10, ay + 80]], 8 + 10 * moon, A2.hazard, 'marker', .3);
      paint([[ax + 10, ay - 90], [ax - 70, ay + 50], [ax + 90, ay + 60]], { wash: A2.hazard, fill: A2.sodium, fillOp: 80, ink: INK, sw: 1.4 });
      fire(ax - 10, ay + 260, 110, 220 * (.5 + moon), t, { seed: 7 });
    }
    ceoClawd(170, 905, 17, { ...move('hop', t * 2), hat: 'shades', aL: 1.5, aR: 1.5 + .2 * pulse2(t), mouth: 'grin', click: pulse2(t, 8) });
    for (let i = 0; i < 3; i++) agentBot(1640 + i * 110, 905, 9, t * 2, { n: 40 + i, dance: 'hop', seed: i, aL: 1.4, aR: 1.4, eyes: 'happy', mouth: 'grin' });
    camEnd();
    tokenRain(t, { n: 16, seed: 5, r: 22 });
    stamp('ЭКОНОМИКА', 820, 600, 130, t, E1, { rot: -.07, col: TK.ember });
    stamp('РАБОТАЕТ!', 1060, 800, 130, t, E2, { rot: .05, col: TK.led });
    flash(Math.exp(-lt * 12) * .3 + s1 * s1 * .5 + s2 * s2 * .45, TK.yellowLt);
  }

  // every shot change is a hard glitch cut (both sides of it, since frames render independently)
  const G = fn => (t, lt, dur) => { fn(t, lt, dur); glitchCut(t, t - lt, { k: 1.1 }); glitchCut(t, t - lt + dur, { k: 1.1 }); };
  chapter('acid', HIT1, END, [
    [HIT1, G(drop1)],
    [135.2, G(rush(1, 3, []))],
    [HIT2, G(drop2)],
    [140.2, G(rush(2, 11, [142.07, 143.03]))],
    [HIT3, G(drop3)],
    [LOOP0, G(wheelShot)],
    [ECO, G(economy)]
  ]);
})();
