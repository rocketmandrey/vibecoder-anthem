// b10_finale.js: «Жги токены» v3, the instrumental climax after the blast, 234.05–240.9 in REAL v3 time.
// Every cut on a beat, the big accents on the bar downbeats (231.39, 234.05, 236.69, 239.34); no picture-in-picture:
// 234.05 (downbeat) the blue agents slam into the mosh with Clawd in the burning data centre → 235.37 Clawd stage-dives
// and crowd-surfs on the agents' hands → 236.69 (downbeat) outside: БУМ, the roof blows off, a pillar of burning tokens
// → 238.02 orbit: the planet's «НЕДЕЛЬНЫЙ ЛИМИТ» burns to 0%, the Earth flips into a token → 238.68 Clawd winds up the
// laptop and SMASHES it on the 239.34 downbeat («0%») → 240.0 fists up → 240.4 white flash → black by 240.72.
(() => {
  const INK = PAL.ink, SOOT = '#141012', BLACK = '#060709';
  const B = Array.from({ length: 12 }, (_, k) => +(233.384 + k * .6617).toFixed(3));   // 233.38 … 240.66; B[1], B[5], B[9] are downbeats
  const S1 = 234.05, S2 = B[3], S3 = 236.69, S4 = B[7], S5 = B[8], SMASH = 239.34, FLASH = 240.4, END = 240.9;   // downbeats pinned to the frame grid
  const AG = { col: '#6F8BE0', dk: '#3D55A8', lt: '#B5C6F0' };
  const bk = (t, d = .15) => hitK(t, B, d);                                         // punch on every beat
  const bgFill = (col, fill, op = 90) => paint(rectPts(-400, -400, W + 800, H + 800), { wash: col, fill: fill || col, fillOp: op, tex: .5, border: .3, ink: null });
  // a raised arm: clawd's stub arm sits inside the body outline when pointed up, so the hook adds a forearm + fist (angle ~1.1 = V)
  const b10_fist = col => (u, sw) => { paint(rectPts(-.2 * u, -.42 * u, 1.9 * u, .84 * u), { wash: col, ink: INK, sw: sw * .6 }); paint(rrPts(1.5 * u, -.7 * u, 1.35 * u, 1.4 * u, .45 * u), { wash: col, ink: INK, sw: sw * .6 }); };
  const hop = (t, ph = 0) => Math.abs(Math.sin((bpOf(t) + ph) * Math.PI));

  // the laptop (Clawd-local, u units, centre at 0,0), from a10 sHall
  function b10_laptop(u, glow = 1) {
    paint(rectPts(-6 * u, -3.6 * u, 12 * u, 7 * u, 1), { wash: '#6B7581', fill: '#2B2F36', fillOp: 90, ink: INK, sw: 1.2 });
    paint(rectPts(-5 * u, -2.8 * u, 10 * u, 5.4 * u), { wash: A2.sodium, fill: '#6E2E18', fillOp: 60 * glow, tex: .5, ink: null });
    paint([[-6 * u, 3.4 * u], [6 * u, 3.4 * u], [7.4 * u, 5.6 * u], [-7.4 * u, 5.6 * u]], { wash: '#9AA3AE', ink: INK, sw: 1 });
    token(0, 0, 1.6 * u, {});
  }
  // an agent with fists up, bouncing on the beat
  function b10_agent(x, y, u, t, n, o = {}) {
    const h = hop(t, hash(n) * .6), up = o.up ?? 1.1;
    agentBot(x, y, u, t, { n, dy: -h * (o.jump ?? 2.4), sq: (1 - h) * .1, aL: up + .15 * h, aR: up - .15 * h, armL: b10_fist(AG.col), armR: b10_fist(AG.col),
      eyes: o.eyes || ['angry', 'happy', 'normal'][n % 3], mouth: n % 2 ? 'O' : 'grin', noShadow: true, ...o.extra });
  }

  // ---------- 233.4 the mosh in the burning data centre ----------
  function shotMosh(t, lt) {
    const k = bk(t), slam = hitK(t, [S1], .25), [sx, sy] = shakeXY(t, 5 + 18 * slam);
    camBegin(960 + sx + Math.sin(lt * 2) * 40, 560 + sy, 1.08 + .05 * k + .12 * slam + lt * .05, Math.sin(lt * 3) * .015);
    dataCenter(t, { heat: 1, fire: 1, n: 6, vp: [960, 470] });
    for (const [fx, fw] of [[200, 560], [1720, 560]]) fire(fx, 1100, fw, 360, t, { seed: fx, k: .8 + .4 * k });
    // back row: small agents; front row: big ones, #42 right up front next to Clawd
    [[430, 830, 18, 7], [700, 800, 16, 13], [1220, 800, 16, 21], [1500, 830, 18, 33]].forEach(([x, y, u, n]) => b10_agent(x, y, u, t, n));
    const h = hop(t);
    clawd(960, 960, 30, { eyes: 'angry', mouth: 'O', dy: -h * 2.6, sq: (1 - h) * .12, aL: 1.1 + .2 * h, aR: 1.1 - .2 * h, armL: b10_fist(PAL.clay), armR: b10_fist(PAL.clay), seed: 3, noShadow: true, rot: (hash(Math.floor(bpOf(t))) - .5) * .15 });
    [[400, 1090, 36, 42], [1540, 1100, 38, 17]].forEach(([x, y, u, n]) => b10_agent(x, y, u, t, n, { jump: 1.6 }));
    camEnd();
    sfx('ЭЙ!', 560, 260, 110, A2.hazard, t - S1 + .08, { life: .5, rot: -.12, font: ruFont(110), stroke: SOOT });
    flash(.18 * k + .6 * hitK(t, [S1], .1), '#FFF3C8');
  }

  // ---------- 234.71 stage dive + crowd-surf on the agents' hands ----------
  function shotSurf(t, lt) {
    const k = bk(t), [sx, sy] = shakeXY(t, 4 * k), camX = lerp(760, 1500, ease(seg(t, S2, S3)));
    bgFill(SOOT, '#3A1A10', 90);
    glowAt(960, 700, 1100, A2.sodium, 90);
    camBegin(camX + sx, 560 + sy, 1 + .03 * k);
    for (let i = 0; i < 4; i++) fire(-100 + i * 800, 1060, 900, 520 * (.85 + .3 * hash(i + 3)), t + i * .7, { seed: i * 11 });
    // the leap: from the left, over the crowd, lands on the hands, then rides them to the right
    const leap = seg(t, S2, S2 + .5), surf = seg(t, S2 + .5, S3);
    const cx = leap < 1 ? lerp(420, 900, leap) : lerp(900, 1900, surf), cy = leap < 1 ? lerp(760, 790, leap) - Math.sin(leap * Math.PI) * 300 : 790 + Math.sin(t * 9) * 14;
    // the crowd: a row of agents, arms straight up, hands under Clawd push higher
    for (let i = 0; i < 9; i++) {
      const x = 200 + i * 240, near = Math.exp(-Math.pow((x - cx) / 220, 2));
      b10_agent(x, 1000 + (i % 2) * 30, 24, t, [42, 5, 17, 9, 28, 3, 11, 36, 21][i], { up: 1.15, jump: 1.2 + 1.2 * near, eyes: near > .5 ? 'happy' : undefined });
    }
    const rot = leap < 1 ? lerp(-.3, -1.5, leap) : -1.5 + Math.sin(t * 6) * .12;
    clawd(cx, cy, 26, { rot, eyes: 'happy', mouth: 'grin', aL: 2.8, aR: 2.8, seed: 3, noShadow: true, blush: true });
    camEnd();
    tokenRain(t, { n: 12, seed: 5, r: 22, burn: .2 });
    const land = t - (S2 + .5); sfx('ПРЫЖОК ВЕРЫ', 960, 200, 76, A2.hazard, land, { life: .9, rot: -.06, font: ruFont(76), stroke: SOOT });
    flash(.18 * k, A2.sodium);
  }

  // ---------- 236.03 outside: the roof blows off, a pillar of burning tokens into the night ----------
  const BOOM = S3;
  function shotRoof(t, lt) {
    const bl = Math.max(0, t - BOOM), k = bk(t), [sx, sy] = shakeXY(t, 16 * Math.exp(-bl * 3) * (t > BOOM) + 4 * k);
    const tilt = ease(seg(t, BOOM + .3, S4));
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#0E111A', fill: '#1F2550', fillOp: 90, tex: .4, ink: null });
    camBegin(960 + sx, lerp(560, 330, tilt) + sy, lerp(1, .9, tilt));
    for (let i = 0; i < 30; i++) paint(ellPts(hash(i) * 2200 - 140, -500 + hash(i + 50) * 900, 3, 3, 5), { wash: '#FFF5E2', washOp: 200, ink: null });
    // the pillar (behind the building): a tall fire column + tokens riding up it
    const pil = easeOut(seg(t, BOOM, BOOM + .6));
    if (pil > 0) {
      glowAt(960, 200, 700, A2.sodium, 110 * pil);
      fire(960, 700, 420, 1600 * pil, t, { seed: 21, n: 6 });
      for (let i = 0; i < 12; i++) {
        const p = frac(t * .9 + i / 12), y = 600 - p * 1500 * pil, x = 960 + Math.sin(p * 9 + i) * 120 * (1 - p * .5);
        token(x, y, 30 * (1 - p * .4), { spin: t * 2 + i, burn: .4 + .5 * p });
      }
    }
    // the building: a long block, glowing windows, ЦОД sign; ground; the roof slab flying off
    paint(rectPts(-400, 880, 2800, 600), { wash: '#1A1718', fill: '#0A0A0E', fillOp: 90, tex: .5, ink: null });
    paint(rectPts(420, 560, 1080, 330, 1), { wash: '#3A4450', fill: '#232A33', fillOp: 90, tex: .5, ink: INK, sw: 1.2 });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) paint(rectPts(460 + c * 116, 600 + r * 92, 80, 54), { wash: hash(r * 9 + c + Math.floor(t * 8)) > .3 ? A2.sodium : TK.yellow, ink: INK, sw: .5 });
    paint(rectPts(860, 480, 200, 80, 1), { wash: TK.soot, ink: INK, sw: .8 });
    letter('ЦОД', 960, 520, 54, TK.ember, { font: ruFont(54), ink: false });
    for (const fx of [520, 1400]) fire(fx, 564, 240, 200 + 220 * pil, t, { seed: fx, k: t > BOOM ? 1 : .3 });
    const rx = 960 - 180 * bl, ry = 552 - 1500 * bl + 900 * bl * bl, rr = -2.2 * bl;
    push(); translate(rx, ry); rotate(rr);
    paint(rectPts(-560, -24, 1120, 40, 2), { wash: '#59636E', fill: '#2B2F36', fillOp: 80, tex: .5, ink: INK, sw: 1.2 });
    pop();
    camEnd();
    sfx('БУМ', 960, 300, 160, A2.hazard, bl, { life: .7, rot: .05, font: ruFont(160), stroke: SOOT });
    flash(.6 * hitK(t, [BOOM], .1), '#FFF3C8');
  }

  // ---------- 237.35 orbit: the planet's weekly limit burns to 0%, the Earth flips into a token ----------
  function b10_earth(r, t) {
    paint(ellPts(0, 0, r, r, 32), { wash: '#2E6FCF', fill: '#1B3AB0', fillOp: 90, tex: .4, border: .5, ink: INK, sw: 1.3 });
    for (const [x, y, a, b] of [[-.35, -.25, .32, .22], [.3, .15, .28, .36], [-.1, .45, .2, .12], [.4, -.45, .18, .12]])
      paint(ellPts(x * r, y * r, a * r, b * r, 14, r * .03), { wash: '#6E9F58', fill: '#3E6B4E', fillOp: 70, tex: .5, ink: null });
    paint(ellPts(-r * .3, -r * .35, r * .5, r * .3, 16), { wash: '#FFFFFF', washOp: 50, ink: null });
    // everything's on fire down there
    for (let i = 0; i < 5; i++) { const a = hash(i + 4) * TAU, d = hash(i + 9) * .7 * r; glowAt(Math.cos(a) * d, Math.sin(a) * d, r * .12, A2.sodium, 120); }
  }
  function shotOrbit(t, lt) {
    const k = bk(t), flip = seg(t, 238.3, 238.6), R = 330 * lerp(1.15, 1, easeOut(seg(t, S4, S4 + .6))) * (1 + .03 * k);
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#05060B', ink: null });
    for (let i = 0; i < 60; i++) paint(ellPts(hash(i) * W, hash(i + 70) * H, 2 + hash(i + 3) * 2, 2 + hash(i + 3) * 2, 5), { wash: '#FFF5E2', washOp: 120 + 100 * hash(i + 5), ink: null });
    glowAt(960, 580, R * 1.5, flip > .5 ? TK.yellow : A2.sodium, 90);
    // the pillar is still visible from space
    fire(960 + R * .55, 580 - R * .82, 60, 380, t, { seed: 5, n: 3 });
    push(); translate(960, 580);
    const sxk = Math.max(.05, Math.abs(Math.cos(flip * Math.PI)));
    if (flip < .5) { scale(sxk, 1); b10_earth(R, t); } else { pop(); push(); token(960, 580, R, { spin: .5 + flip * .5, glow: 1 }); }
    pop();
    // the limit bar over the planet, burning from 7% to 0
    const v = lerp(.07, 0, ease(seg(t, S4, 238.28)));
    limitBar(460, 110, 1000, v, { h: 62, burn: 1, glow: .5, label: 'НЕДЕЛЬНЫЙ ЛИМИТ · ПЛАНЕТА ЗЕМЛЯ' });
    if (t > 238.3) stamp('0%', 1560, 820, 120, t, 238.3, { rot: -.12 });
    flash(.4 * hitK(t, [S4], .12), '#FFF3C8');
  }

  // ---------- 238.68 the smash: wind up, SMASH on the beat, tokens + sparks, fists up, white flash → black ----------
  function shotSmash(t, lt) {
    const sm = t - SMASH, hit = hitK(t, [SMASH], .25), k = bk(t), [sx, sy] = shakeXY(t, 30 * hit + 6 * k);
    bgFill(SOOT, '#3A1A10', 90);
    glowAt(960, 820, 1200, A2.sodium, 90 + 60 * hit);
    camBegin(960 + sx, 600 + sy, kf(t, [[S5, 1.3], [SMASH - .05, 1.18], [SMASH, 1.4], [SMASH + .5, 1.12], [FLASH, 1.2]], easeOut));
    for (let i = 0; i < 4; i++) fire(-40 + i * 670, 1110, 820, 520 * (.85 + .3 * hash(i + 3)) * (1 + .4 * hit), t + i * .7, { seed: i * 11 });
    paint(rectPts(-400, 900, 2800, 400), { wash: '#1A1718', ink: INK, sw: 1 });
    // wind-up: arms go up and back; smash: arms slam down; after: fists up
    const wind = ease(seg(t, S5, SMASH - .08)), down = seg(t, SMASH - .08, SMASH);
    const armA = sm < 0 ? lerp(.9, 1.15, wind) - 1.1 * easeIn(down) : lerp(.2, 1.1, ease(seg(t, B[10] - .1, B[10])));
    const post = sm >= 0;
    clawd(960, 900, 34, {
      eyes: post ? (t > B[10] ? 'spark' : 'angry') : 'narrow', mouth: post ? 'O' : 'grin', seed: 3, noShadow: true,
      sq: post ? .15 * hit : -.05 * wind, dy: post ? -2.5 * hitK(t, [B[10]], .3) : 0,
      aL: armA + (post ? .15 * hitK(t, [B[10]], .3) : 0), aR: armA, armL: b10_fist(PAL.clay), armR: b10_fist(PAL.clay),
      draw: !post ? (u) => { push(); translate(0, lerp(-13.5 * u, -15 * u, wind) + 13 * u * easeIn(down)); rotate(Math.sin(t * 7) * .12 * (1 - down) + .3 * easeIn(down)); b10_laptop(u); pop(); } : undefined
    });
    if (post) {
      // the laptop in pieces on the floor, shards flying
      for (let i = 0; i < 7; i++) {
        const a = -Math.PI * (.1 + .8 * hash(i + 2)), v = 500 + hash(i) * 600, p = Math.min(sm, .9);
        push(); translate(960 + Math.cos(a) * v * p * 1.4, 900 + Math.sin(a) * v * p + 900 * p * p); rotate(sm * (hash(i + 6) - .5) * 12);
        paint(rectPts(-40, -24, 80 + hash(i) * 60, 48), { wash: i % 2 ? '#6B7581' : A2.sodium, ink: INK, sw: .8 });
        pop();
      }
      sparks(960, 890, sm, 3, 16, 700);
      for (let i = 0; i < 14; i++) {
        const a = -Math.PI / 2 + (hash(i + 30) - .5) * 2.8, v = 900 + hash(i + 31) * 900, p = sm;
        token(960 + Math.cos(a) * v * p, 880 + Math.sin(a) * v * p + 700 * p * p, 26 + hash(i + 2) * 18, { spin: t * 2 + i, burn: clamp(p) });
      }
    }
    camEnd();
    if (post) stamp('0%', 520, 300, 170, t, SMASH, { rot: -.1, punch: .1 });
    if (t > B[10]) punkText('ЖГИ!', 1420, 300, 130, t, B[10], { step: .04 });
    flash(.7 * hitK(t, [SMASH], .1) + .3 * k * (t > B[10]), '#FFF3C8');
    // the end: white flash → black by the cut to the credit
    flushLetters();
    const wf = seg(t, FLASH, FLASH + .12), bl = seg(t, 240.58, 240.72);
    if (wf > 0) flash(wf * (1 - bl), '#FFFDF6');
    if (bl > 0) paint(rectPts(-60, -60, W + 120, H + 120), { wash: BLACK, washOp: 255 * bl, ink: null });
  }

  chapter('finale', S1, END, [[S1, shotMosh], [S2, shotSurf], [S3, shotRoof], [S4, shotOrbit], [S5, shotSmash]], { real: true });
})();
