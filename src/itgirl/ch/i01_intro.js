// i01_intro: Intro + Verse 1 (0 – 25.4). Night indigo + moon gold.
// Shots: rooftop silhouette under the moon + chant · push-in transformation · radar/reticle kiss · ticker strut ·
// crescent flight over the beef · nail-biting haters · throne tea + ladybug · tennis-serve heart · lips swarm · rule-tablet chop.
(() => {
  const B = n => OFF + n * BEAT;                         // time of beat n
  const SIL = '#150F2E';
  // measured chant onsets (see STORYBOARD_ITGIRL.md); first I of spelling 2 is merged into the L, guessed at 2.1
  const CH_A = [0.0, .48, .88, 1.32, 1.60, 2.02], CH_B = [2.1, 2.50, 2.90, 3.32, 3.58, 3.98];
  const CH_C = [4.42, 4.96, 5.42, 5.80, 6.04, 6.12], CH_D = [6.54, 6.96, 7.40, 7.80, 8.06, 8.24];
  const CCOLS = [[MG.hot, MG.gold, MG.sky, MG.pink, MG.mint, MG.lilac], [MG.gold, MG.pink, MG.mint, MG.goldLt, MG.sky, MG.hot]];

  // ---------------- private helpers ----------------
  // Letters I-T-G-I-R-L; each letter re-pops at its latest onset across the given spellings.
  function chant(t, spells, x, y, size, o = {}) {
    const chars = [...'ITGIRL'], gap = size * .8, x0 = x - 2.5 * gap;
    chars.forEach((c, i) => {
      let k = -1; spells.forEach((s, j) => { if (s[i] <= t) k = j; });
      if (k < 0) return;
      const age = t - spells[k][i], bob = Math.sin(t * 5 + i) * size * .05;
      letter(c, x0 + i * gap, y + bob, size, CCOLS[k % 2][i], { pop: age * 4, rot: (hash(i + 9) - .5) * .3, stroke: MG.navy });
      if (age < .45) sparkle(x0 + i * gap + size * .38, y - size * .42, size * .3, age / .45, MG.cream);
    });
  }
  const glow = (x, y, r, col, op = 90) => paint(ellPts(x, y, r, r, 18), { fill: col, fillOp: op, bleed: .3, tex: .2, ink: null });
  function speedLines(t, cx, cy, n, r0, r1, col = MG.cream, sw = 1.2, seed = 0) {
    const f = Math.floor(t * 12);
    for (let i = 0; i < n; i++) {
      const a = (i + hash(i * 3 + f + seed) * .8) / n * TAU, rr = r0 * (.85 + hash(i + f * 7 + seed) * .4);
      inkLine([[cx + Math.cos(a) * rr, cy + Math.sin(a) * rr], [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1]], sw, col, 'inkfine', 0);
    }
  }
  function burst(x, y, r, k, cols = [MG.goldLt, MG.pink, MG.cream, MG.sky]) {  // sparkle burst, k 0..1
    if (k <= 0 || k >= 1) return;
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + hash(i) * .5, d = r * easeOut(k) * (.6 + hash(i + 5) * .5); sparkle(x + Math.cos(a) * d, y + Math.sin(a) * d, r * .16, k, cols[i % cols.length]); }
  }
  // Magical-girl silhouette: body, buns, wind-blown pigtails. sx for turning (cos), o.col / o.rim.
  function silhouette(x, y, u, t, o = {}) {
    const col = o.col || SIL, rim = o.rim || MG.goldLt, sw = clamp(u / 15, .5, 2);
    push(); translate(x, y + (o.dy || 0) * u); scale(o.sx ?? 1, 1);
    for (const s of [-1, 1]) {
      const bx = s * 3.3 * u, by = -9.2 * u, L = [], R = [];
      for (let i = 0; i <= 8; i++) {
        const f = i / 8, px = bx + s * (1 + f * 1.6) * u + f * f * 7 * u + Math.sin(f * 4 - t * 7 + s) * u * f * .9;
        const py = by + f * 9 * u - f * f * 2 * u, hw = (.85 - f * .08) * u;
        L.push([px - hw, py]); R.push([px + hw, py]);
      }
      paint([...L, ...R.reverse()], { wash: col, ink: rim, sw: sw * .5, curv: .4 });
      paint(ellPts(bx, by, 1.55 * u, 1.45 * u, 14), { wash: col, ink: rim, sw: sw * .5 });
    }
    [-4, -2, 1, 3].forEach(lx => paint(rectPts(lx * u, -2.4 * u, u, 2.4 * u), { wash: col, ink: null }));
    for (const s of [-1, 1]) {
      const a = s < 0 ? (o.aL ?? .2) : (o.aR ?? .2);
      push(); translate(s * 4.9 * u, -4.5 * u); rotate(s < 0 ? a : -a);
      paint(rectPts(s < 0 ? -2.2 * u : 0, -.5 * u, 2.2 * u, u), { wash: col, ink: null });
      if (o.gloves) paint(ellPts(s * 2.5 * u, 0, .8 * u, .8 * u, 12), { wash: MG.glove, ink: PAL.ink, sw: sw * .5 });
      pop();
    }
    paint([[-6.2 * u, -1.3 * u], [-5 * u, -2.9 * u], [-5 * u, -8 * u], [5 * u, -8 * u], [5 * u, -2.9 * u], [6.2 * u, -1.3 * u]], { wash: col, ink: rim, sw: sw * .6 });
    if (o.eyes) for (const ex of [-3, 2]) paint(rectPts(ex * u, -7 * u, u, 2 * u), { wash: MG.goldLt, ink: null });
    pop();
  }
  const peace = (u, sw) => {                              // arm hook: glove with a V sign
    for (const a of [-.35, .35]) { push(); rotate(a - .2); paint(ellPts(1.1 * u, 0, .9 * u, .32 * u, 10), { wash: MG.glove, ink: PAL.ink, sw: sw * .45 }); pop(); }
    paint(ellPts(.3 * u, 0, .75 * u, .75 * u, 12), { wash: MG.glove, ink: PAL.ink, sw: sw * .5 });
  };
  const gloveH = (u, sw) => paint(ellPts(.3 * u, 0, .75 * u, .75 * u, 12), { wash: MG.glove, ink: PAL.ink, sw: sw * .5 });
  function miniFace(x, y, s) {                            // little Clawd-in-buns icon for the ticker
    for (const e of [-1, 1]) paint(ellPts(x + e * s * .42, y - s * .5, s * .22, s * .2, 10), { wash: MG.hair, ink: PAL.ink, sw: .6 });
    paint(rrPts(x - s * .5, y - s * .38, s, s * .7, s * .12), { wash: PAL.clay, ink: PAL.ink, sw: .8 });
    for (const e of [-1, 1]) inkLine([[x + e * s * .2 - s * .08, y - s * .08], [x + e * s * .2, y - s * .16], [x + e * s * .2 + s * .08, y - s * .08]], .8, PAL.ink, 'ink', .3);
    crescent(x, y - s * .36, s * .09, -Math.PI / 2, MG.gold, { ink: null });
  }
  function nightBg(t, o = {}) {                            // cheap starry night backdrop
    paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: o.a || MG.navy, fill: o.b || MG.lilacDk, fillOp: 80, bleed: .1, tex: .5, border: .3, ink: null });
    for (let i = 0; i < (o.n ?? 30); i++) {
      const k = .5 + .5 * Math.sin(t * (1.5 + hash(i) * 2) + i), y = ((hash(i + 4) * (H + 200) + t * (o.fall || 0) * (.5 + hash(i + 8))) % (H + 200)) - 100;
      paint(starPts(hash(i + 3) * W, y, 3 + k * 5, .3, 4), { wash: MG.cream, washOp: 140 + 110 * k, ink: null });
    }
  }
  function rival(x, y, u, o = {}) { clawd(x, y, u, { col: '#A898C4', dk: '#6E6290', lt: '#CFC4E6', hat: 'band', mouth: 'wobble', ...o }); }

  // ---------------- 0.0 – 4.2 · rooftop silhouette, tilt down from the moon, chant ×2 ----------------
  function rooftop(t, lt) {
    const k = ease(seg(lt, 0, 3.6)), [sx, sy] = shakeXY(t, 3 * pulse(t, 8));
    camBegin(1150 + sx, lerp(230, 540, k) + sy, lerp(1.2, 1, k), lerp(-.04, 0, k));
    nightCity(t, { moon: [1150, 400, 330], horizon: 820 });
    // shooting star on beat 4
    const ss = seg(t, B(4), B(4) + .6); if (ss > 0 && ss < 1) inkLine([[300 + ss * 700, -120 + ss * 260], [520 + ss * 700, -60 + ss * 260]], 3, MG.goldLt, 'marker', 0);
    // our rooftop
    paint(rectPts(890, 700, 520, 500, 2), { wash: '#1A1238', ink: PAL.ink, sw: .9 });
    paint(rectPts(870, 690, 560, 22), { wash: '#2B1F55', ink: PAL.ink, sw: .8 });
    paint(rectPts(1300, 620, 70, 70), { wash: '#1A1238', ink: PAL.ink, sw: .7 });                       // water tank
    for (let i = 0; i < 6; i++) paint(rectPts(930 + i * 80, 760 + (i % 2) * 90, 28, 36), { wash: i % 3 ? MG.goldLt : MG.pink, washOp: 200, ink: null });
    const b = pulse(t, 5);
    silhouette(1150, 690, 30, t, { dy: -b * .4, aL: .3 + b * .2, aR: .3 + b * .2 });
    chant(t, [CH_A, CH_B], 1150, 190, 150);
    sparkleField(t, 12, { seed: 11, area: [400, -300, 1500, 700] });
    camEnd();
  }

  // ---------------- 4.2 – 8.5 · turn, gloves flash, transformation, lit pose on 8.23 ----------------
  function transform(t, lt) {
    const T1 = 6.0, LAND = B(16);                        // transformation space from 6.0, landing on the bar at 8.233
    if (t < T1) {
      const z = lerp(1, 1.75, ease(seg(t, 4.2, 5.9))), [sx, sy] = shakeXY(t, 4 * pulse(t, 7));
      camBegin(1150 + sx, lerp(540, 520, seg(t, 4.2, 5.9)) + sy, z);
      nightCity(t, { moon: [1150, 400, 330], horizon: 820 });
      paint(rectPts(890, 700, 520, 500, 2), { wash: '#1A1238', ink: PAL.ink, sw: .9 });
      paint(rectPts(870, 690, 560, 22), { wash: '#2B1F55', ink: PAL.ink, sw: .8 });
      const turn = Math.cos(Math.PI * ease(seg(t, B(8.6), B(9.4)))) , gl = t > B(10);
      const aL = gl ? lerp(.2, 1.3, easeOut(seg(t, B(10), B(10.4)))) : .2, aR = t > B(11) ? lerp(.2, 1.3, easeOut(seg(t, B(11), B(11.4)))) : .2;
      silhouette(1150, 690, 30, t, { sx: turn < 0 ? Math.min(-.15, turn) : Math.max(.15, turn), eyes: turn < 0, gloves: gl, aL, aR, rim: gl ? MG.pink : MG.goldLt });
      // glove flashes
      for (const [tb, s] of [[B(10), -1], [B(11), 1]]) { const a = seg(t, tb, tb + .45); if (a > 0 && a < 1) { const ang = s < 0 ? aL : aR; sparkle(1150 + s * (147 + Math.cos(ang) * 75), 555 - Math.sin(ang) * 75, 80, a, MG.cream); } }
      camEnd();
      chant(t, [CH_C], 960, 150, 120);
      return;
    }
    if (t < LAND) {
      // anime transformation space: rotating rays, ribbons spiral in, glowing figure spins up
      const k = seg(t, T1, LAND);
      paint(rectPts(-50, -50, W + 100, H + 100), { wash: '#3A1E6E', fill: MG.hot, fillOp: 60, bleed: .2, tex: .5, ink: null });
      sunburst(960, 560, MG.pink, MG.lilac, t * .6, 18, 1600, 110);
      glow(960, 560, 420 + 60 * pulse(t, 4), MG.goldLt, 110);
      speedLines(t, 960, 560, 26, 620, 1300, MG.cream, 1.4);
      const spin = ease(k) * 3, u = lerp(26, 34, k);
      silhouette(960, 820 - k * 60, u, t, { col: '#FFE3F1', rim: MG.pinkDk, sx: (Math.cos(spin * TAU) < 0 ? -1 : 1) * Math.max(.55, Math.abs(Math.cos(spin * TAU))), aL: 1.2 + .3 * Math.sin(t * 8), aR: 1.2 - .3 * Math.sin(t * 8), gloves: true });
      ribbonSwirl(960, 600, t, { k: .25 + .75 * k, r: 520 - k * 120 });
      sparkleField(t, 16, { seed: 5 });
      chant(t, [CH_D], 960, 140, 120);
      flash(easeIn(seg(t, LAND - .35, LAND)) * .9, MG.cream);
      return;
    }
    // LANDED: fully lit sailorClawd, wink + peace, radial burst
    const a = t - LAND, z = lerp(1.2, 1, easeOut(a / .25)), [sx, sy] = shakeXY(t, 10 * Math.exp(-a * 8));
    camBegin(960 + sx, 560 + sy, z, -.04);
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#2E1D63', ink: null });
    sunburst(960, 560, MG.gold, MG.hot, a * .5, 20, 1700, 150);
    speedLines(t, 960, 560, 30, 560, 1400, MG.cream, 1.6);
    glow(960, 560, 380, MG.goldLt, 120);
    sailorClawd(960, 950, 50, { wand: true, noShadow: true, eyes: 'wink', mouth: 'grin', blush: true, aR: .5, aL: .75, armL: peace, rot: -.05, sq: -.1 * Math.exp(-a * 10) });
    burst(960, 560, 520, clamp(a / .5));
    chant(t, [CH_D], 960, 140, 120);
    camEnd();
    flash((1 - clamp(a / .2)) * .9, MG.cream);
  }

  // ---------------- 8.5 – 10.23 · radar sweep, heart blips, locks on her heart ----------------
  function radar(t, lt) {
    const HIT = B(19), cx = 960, cy = 500, R = 400, ah = -.7;
    const a = ah + (t - HIT) * TAU / 1.5;                 // sweep angle; passes the big heart exactly on HIT
    const z = lerp(1, 1.55, ease(seg(t, HIT, B(20)))), hx = cx + Math.cos(ah) * 240, hy = cy + Math.sin(ah) * 240;
    const [sx, sy] = shakeXY(t, 8 * Math.exp(-Math.max(0, t - HIT) * 8) * (t > HIT ? 1 : 0));
    camBegin(lerp(cx, hx, ease(seg(t, HIT, B(20)))) + sx, lerp(cy + 30, hy, ease(seg(t, HIT, B(20)))) + sy, z);
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#0B2219', fill: '#123D2A', fillOp: 70, tex: .5, ink: null });
    paint(ellPts(cx, cy, R + 30, R + 30, 40), { wash: '#1E2A30', ink: PAL.ink, sw: 1.6 });
    paint(ellPts(cx, cy, R, R, 40), { wash: '#0F3A26', fill: '#1E6B45', fillOp: 70, tex: .4, ink: '#3FE08A', sw: 1 });
    for (const r of [.33, .66]) paint(ellPts(cx, cy, R * r, R * r, 30), { ink: '#2FB06C', sw: .6 });
    inkLine([[cx - R, cy], [cx + R, cy]], .6, '#2FB06C', 'inkfine', 0); inkLine([[cx, cy - R], [cx, cy + R]], .6, '#2FB06C', 'inkfine', 0);
    for (let w = 0; w < 4; w++) {                          // sweep wedge with a fading trail
      const a0 = a - (w + 1) * .16, a1 = a - w * .16;
      paint([[cx, cy], [cx + Math.cos(a0) * R, cy + Math.sin(a0) * R], [cx + Math.cos(a1) * R, cy + Math.sin(a1) * R]], { fill: '#6CFFB0', fillOp: 110 - w * 25, bleed: .1, tex: .2, ink: null });
    }
    inkLine([[cx, cy], [cx + Math.cos(a) * R, cy + Math.sin(a) * R]], 2, '#C8FFE0', 'ink', 0);
    const since = ang => { let d = (a - ang) % TAU; if (d < 0) d += TAU; return d; };
    for (let i = 0; i < 9; i++) {                           // small heart blips light up as the sweep passes
      const ang = hash(i + 20) * TAU, rr = 80 + hash(i + 21) * 290, k = Math.exp(-since(ang) * 1.3);
      paint(heartPts(cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr, 12 + 8 * k), { wash: mixCol('#2FB06C', MG.pink, k), ink: null });
    }
    const hk = t > HIT ? Math.exp(-(t - HIT) * 3) : 0, blink = .5 + .5 * Math.sin(t * 14), hr = 46 + 30 * hk + 6 * blink;
    for (let p = 0; p < 2; p++) { const q = frac((t - HIT) * 1.4 + p * .5); if (t > HIT) paint(ellPts(hx, hy, hr + q * 160, hr + q * 160, 24), { ink: MG.pink, sw: 1.4 * (1 - q) + .1 }); }
    glow(hx, hy, hr * 1.8, MG.hot, 80 + 80 * blink);
    paint(heartPts(hx, hy + 8, hr), { wash: MG.hot, fill: MG.pink, fillOp: 70, ink: PAL.ink, sw: 1 });
    for (const e of [-1, 1]) { paint(ellPts(hx + e * hr * .5, hy - hr * .85, hr * .22, hr * .2, 10), { wash: MG.hair, ink: PAL.ink, sw: .6 }); inkLine([[hx + e * hr * .3 - 5, hy - 2], [hx + e * hr * .3, hy - 9], [hx + e * hr * .3 + 5, hy - 2]], 1, PAL.ink, 'ink', .3); }
    camEnd();
    // monitor bezel (screen space)
    irisShape(rrPts(90, 50, W - 180, 880, 90), '#221A30');
    paint(rrPts(90, 50, W - 180, 880, 90), { ink: '#3FE08A', sw: 1.2 });
    for (let i = 0; i < 3; i++) paint(ellPts(200 + i * 60, 1000, 14, 14, 12), { wash: i === 0 && blink > .5 ? MG.hot : '#3A5A44', ink: PAL.ink, sw: .6 });
  }

  // ---------------- 10.23 – 11.9 · reticle locks on her face, she blows a kiss at the lens ----------------
  function reticle(t, lt) {
    const LOCK = B(21), KISS = B(22), fx = 928, fy = 520;
    const [sx, sy] = shakeXY(t, 6 * pulse(t, 8));
    camBegin(960 + sx + Math.sin(t * 1.3) * 20, 540 + sy, lerp(1.05, 1.18, seg(t, 10.2, 11.9)), .03);
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#3B1F66', fill: MG.hot, fillOp: 50, bleed: .2, tex: .5, ink: null });
    sunburst(fx, fy, MG.lilac, '#5A2E8A', t * .3, 16, 1600, 90);
    const pk = t < KISS ? seg(t, KISS - .45, KISS - .1) : 1 - seg(t, KISS, KISS + .25);   // hand to lips then fling
    sailorClawd(960, 900, 64, {
      wand: true, eyes: t < KISS - .45 ? 'look' : t < KISS + .1 ? 'closed' : 'wink', lookX: -.2, mouth: t > KISS - .45 && t < KISS + .3 ? 'o' : 'smile', blush: true,
      aL: lerp(.3, 1.7, pk) + (t > KISS ? .5 * Math.exp(-(t - KISS) * 6) : 0), aR: .15, sq: -.05 * pulse(t, 5), rot: .02
    });
    // targeting reticle
    const rk = easeOut(seg(t, 10.23, LOCK)), rr = lerp(760, 250, rk), locked = t >= LOCK, rc = locked ? MG.hot : '#6CFFB0', rot = (1 - rk) * 2 + t * .2;
    paint(ellPts(fx, fy, rr, rr, 40), { ink: rc, sw: 1.4 });
    paint(ellPts(fx, fy, rr * .8, rr * .8, 36), { ink: rc, sw: .6 });
    for (let i = 0; i < 4; i++) {
      const ang = rot + i * Math.PI / 2, c = Math.cos(ang), s = Math.sin(ang);
      inkLine([[fx + c * rr * 1.1, fy + s * rr * 1.1], [fx + c * rr * .7, fy + s * rr * .7]], 2.2, rc, 'ink', 0);
      const bx = fx + Math.cos(ang + .8) * rr * 1.15, by = fy + Math.sin(ang + .8) * rr * 1.15;
      inkLine([[bx - 24, by - 24], [bx + 24, by - 24], [bx + 24, by + 24]], 1.6, rc, 'ink', 0);
    }
    if (locked && t < KISS) { const q = frac((t - LOCK) * 3); paint(ellPts(fx, fy, rr * (1 + q * .5), rr * (1 + q * .5), 36), { ink: MG.pink, sw: 1.5 * (1 - q) + .1 }); }
    camEnd();
    // the kiss: a heart grows from her lips and fills the lens
    const h = seg(t, KISS, 11.9);
    if (h > 0) {
      const hx = lerp(960, 960, h), hy = lerp(620, 560, h), r = lerp(30, 1500, easeIn(h));
      glow(hx, hy, r * 1.2, MG.pink, 90);
      paint(heartPts(hx, hy, r), { wash: MG.hot, fill: MG.pink, fillOp: 70, tex: .4, ink: PAL.ink, sw: clamp(r / 60, .8, 3) });
      paint(ellPts(hx - r * .45, hy - r * .35, r * .18, r * .1, 10, 0, -.6), { wash: MG.cream, washOp: 200, ink: null });
      burst(hx, hy, 300, seg(t, KISS, KISS + .6));
    }
  }

  // ---------------- 11.9 – 13.9 · LED ticker full of her face, she struts, ticker tape rains ----------------
  function ticker(t, lt) {
    const bp = bpOf(t), step = Math.floor(bp) + easeOut(clamp(frac(bp) * 3)), [sx, sy] = shakeXY(t, 3 * pulse(t, 8));
    camBegin(960 + lt * 70 + sx, 540 + sy, 1.04 + .03 * pulse(t, 6));
    nightCity(t, { moon: [1700, 120, 110], horizon: 760 });
    // street
    paint(rectPts(-400, 860, W + 800, 400), { wash: '#1A1238', fill: MG.hot, fillOp: 40, tex: .5, ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 8; i++) { const x = ((i * 300 - lt * 400) % 2400 + 2400) % 2400 - 300; paint(rectPts(x, 940, 140, 12), { wash: MG.goldLt, washOp: 170, ink: null }); }
    // LED band
    const by = 150, bh = 230 * (1 + .04 * pulse(t, 8));
    paint(rectPts(-300, by - 20, W + 600, bh + 40, 2), { wash: '#3B2A6E', ink: PAL.ink, sw: 1.2 });
    paint(rectPts(-300, by, W + 600, bh), { wash: '#120A22', ink: null });
    for (let r = 1; r < 6; r++) inkLine([[-300, by + r * bh / 6], [W + 300, by + r * bh / 6]], .5, '#2C1F48', 'inkfine', 0);
    for (let i = -2; i < 11; i++) {
      const n = i + Math.floor(step), x = (i - frac(step)) * 250 + 40, y = by + bh / 2;
      glow(x, y, 90, n % 2 ? MG.hot : MG.gold, 70);
      if (n % 2) paint(heartPts(x, y, 62), { wash: MG.hot, ink: PAL.ink, sw: .8 }); else miniFace(x, y + 20, 130);
    }
    for (let i = 0; i < 7; i++) sparkle(hash(i + 60) * W, by + hash(i + 61) * bh, 14, frac(t * 1.3 + hash(i)), MG.goldLt);
    // her strut: every beat a stomp
    const m = move('walk', t), x = lerp(620, 1180, lt / 2);
    sailorClawd(x, 900, 36, { ...m, wand: true, eyes: "narrow", mouth: 'smile', blush: true, sq: .1 * pulse(t, 8), aR: .5 + .3 * m.aR });
    // ticker-tape confetti
    for (let i = 0; i < 26; i++) {
      const px = hash(i + 80) * (W + 400) - 100 + lt * 70, py = ((hash(i + 81) * 1400 + lt * (260 + hash(i) * 200)) % 1400) - 200;
      const len = 60 + hash(i + 82) * 40, ph = t * 6 + i, pts = [];
      for (let k = 0; k < 5; k++) pts.push([px + Math.sin(ph + k) * 10, py + k * len / 4]);
      inkLine(pts, 4, [MG.cream, MG.pink, MG.goldLt, MG.sky][i % 4], 'marker', .6);
    }
    camEnd();
  }

  // ---------------- 13.9 – 15.9 · flies up on the crescent past "…" bubbles, over the angry beef ----------------
  function steak(x, y, s, t) {
    push(); translate(x, y); rotate(Math.sin(t * 20) * .05);
    paint(ellPts(0, 0, s * 1.5, s, 20, 0, .15), { wash: '#B5485A', fill: '#7A2438', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1.2 });
    paint(ellPts(-s * .3, -s * .1, s * .9, s * .5, 16, 0, .15), { wash: '#D86A74', washOp: 150, ink: null });
    paint(ellPts(s * 1.1, s * .1, s * .28, s * .24, 12), { wash: MG.cream, ink: PAL.ink, sw: .8 });            // bone
    for (const e of [-1, 1]) {
      paint(ellPts(e * s * .45, -s * .15, s * .16, s * .2, 10), { wash: MG.cream, ink: PAL.ink, sw: .7 });
      paint(ellPts(e * s * .45, -s * .1, s * .07, s * .1, 8), { wash: PAL.ink, ink: null });
      inkLine([[e * s * .7, -s * .5], [e * s * .2, -s * .3]], 2, PAL.ink, 'ink', 0);
    }
    inkLine([[-s * .3, s * .35], [0, s * .22], [s * .3, s * .35]], 1.4, PAL.ink, 'ink', .4);
    // shaking fist
    const fa = -1.1 + Math.sin(t * 28) * .35; push(); translate(s * 1.2, -s * .4); rotate(fa);
    paint(rectPts(0, -s * .12, s * .8, s * .24), { wash: '#B5485A', ink: PAL.ink, sw: .8 });
    paint(ellPts(s * .9, 0, s * .22, s * .22, 12), { wash: '#B5485A', ink: PAL.ink, sw: .8 }); pop();
    pop();
    emote('anger', x - s * 1.1, y - s * 1.1, s * .35, 1);
  }
  function flight(t, lt) {
    const k = ease(lt / 2), x = lerp(430, 1180, k), y = lerp(760, 470, k) + Math.sin(t * 4) * 10;
    nightBg(t, { fall: 520, n: 34 });
    bigMoon(1560, lerp(420, 200, k), 170 + 40 * k, t);
    for (let i = 0; i < 14; i++) {                        // vertical rise lines
      const lx = hash(i + 40) * W, ly = ((hash(i + 41) * 1500 + lt * 1400) % 1500) - 300;
      inkLine([[lx, ly], [lx, ly + 180]], 1.4, MG.lilac, 'inkfine', 0);
    }
    for (let i = 0; i < 7; i++) {                         // "…" chat bubbles streaming down past her
      const bx = 120 + hash(i + 30) * 1700, byy = -250 + hash(i + 31) * 900 + lt * 560, s = .8 + hash(i + 32) * .5, wob = Math.sin(t * 3 + i) * 8;
      if (byy > 1200) continue;
      paint(rrPts(bx - 90 * s, byy - 55 * s + wob, 180 * s, 110 * s, 40 * s), { wash: i % 3 ? MG.cream : '#DCEBFA', ink: PAL.ink, sw: 1 });
      paint([[bx - 40 * s, byy + 50 * s + wob], [bx - 70 * s, byy + 90 * s + wob], [bx - 10 * s, byy + 52 * s + wob]], { wash: i % 3 ? MG.cream : '#DCEBFA', ink: null });
      for (let d = -1; d <= 1; d++) paint(ellPts(bx + d * 38 * s, byy + wob + Math.sin(t * 10 + d) * 4, 11 * s, 11 * s, 10), { wash: '#8A80A8', ink: null });
    }
    steak(900, lerp(820, 1350, easeIn(lt / 2)), 110, t);
    // her on the crescent, with a sparkle trail
    for (let i = 1; i < 8; i++) { const q = i / 8, px = x - q * 420, py = y + q * 260 + Math.sin(t * 6 + i) * 10; sparkle(px, py + 60, 26 * (1 - q), frac(t * 2 + q), i % 2 ? MG.goldLt : MG.pink); }
    glow(x, y + 70, 260, MG.goldLt, 70);
    crescent(x, y + 20, 230, Math.PI / 2 + .12, MG.gold, { sw: 1.4 });
    sailorClawd(x, y + 90, 26, { wand: true, eyes: 'happy', mouth: 'grin', blush: true, aL: 1.3 + .3 * Math.sin(t * 9), aR: .6, rot: -.1, dy: -.8 * pulse(t, 5), noShadow: true });
  }

  // ---------------- 15.9 – 17.85 · haters biting their nails, teeth chattering ----------------
  function scaredLips(x, y, s, t, seed) {
    const [jx, jy] = shakeXY(t + seed, 5);
    for (const e of [-1, 1]) {
      paint(ellPts(x + jx + e * s * .7, y + jy - s * 1.2, s * .42, s * .5, 14), { wash: MG.cream, ink: PAL.ink, sw: 1 });
      paint(ellPts(x + jx + e * s * .7 + Math.sin(t * 30) * 3, y + jy - s * 1.15, s * .13, s * .17, 10), { wash: PAL.ink, ink: null });
    }
    lips(x + jx, y + jy, s, t, { talk: 1, seed, col: seed % 2 ? MG.hot : '#D4577A' });
    paint(ellPts(x + jx + s * .2, y + jy + s * .05, s * .28, s * .22, 12), { wash: MG.glove, ink: PAL.ink, sw: .8 });  // nibbled glove tip
    emote('sweat', x + s * 1.6, y - s * 1.3, s * .3, 1);
  }
  function nails(t, lt) {
    const z = 1 + .04 * pulse(t, 7), [sx, sy] = shakeXY(t, 4);
    camBegin(lerp(880, 1040, lt / 2) + sx, 520 + sy, z);
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#2A1E4A', fill: '#4B3A7A', fillOp: 70, tex: .5, ink: null });
    for (let i = 0; i < 30; i++) {                        // anime "gloom" lines
      const x = -200 + i * 80 + hash(i) * 30, len = 250 + hash(i + 1) * 300;
      inkLine([[x, -300], [x, -300 + len + 200]], 2 + hash(i + 2) * 3, i % 3 ? '#6A58A0' : '#8C7CC4', 'marker', 0);
    }
    paint(rectPts(-400, 860, W + 800, 400), { wash: '#1E1638', ink: PAL.ink, sw: .8 });
    const chat = pulse2(t, 10);
    const nib = (u, sw) => { for (const e of [-1, 1]) paint(ellPts(e * .7 * u + Math.sin(T * 40 + e) * .15 * u, -4.2 * u, .75 * u, .7 * u, 12), { wash: MG.glove, ink: PAL.ink, sw: sw * .5 }); };
    scaredLips(250, 520 - chat * 14, 125, t, 1);
    rival(720 + shakeXY(t, 6)[0], 880, 40, { eyes: 'scared', aL: .9, aR: .9, sq: chat * .06, emote: 'sweat', emoteK: 1, draw: nib });
    scaredLips(1200, 520 - chat * 14, 135, t, 2);
    rival(1680 + shakeXY(t + 3, 6)[0], 880, 38, { eyes: 'scared', lookX: -1, aL: .9, aR: .9, sq: chat * .06, hat: 'fedora', emote: 'sweat', emoteK: 1, draw: nib, col: '#9FB0C8', dk: '#62708A' });
    for (const cx of [720, 1680]) for (const e of [-1, 1]) if (chat > .4) inkLine([[cx + e * 90, 700], [cx + e * 150, 680 - chat * 25]], 2, MG.cream, 'inkfine', 0);
    camEnd();
  }

  // ---------------- 17.85 – 19.7 · tea on the throne, pinky up, flicks the ladybug ----------------
  function ladybug(x, y, s, t, rot = 0) {
    push(); translate(x, y); rotate(rot);
    for (const e of [-1, 1]) paint(ellPts(e * s * .6, -s * .6, s * .8, s * .35, 10, 0, e * (.5 + Math.sin(t * 60) * .4)), { wash: '#DCEBFA', washOp: 150, ink: PAL.ink, sw: .4 });
    paint(ellPts(0, 0, s, s * .85, 16), { wash: MG.red, ink: PAL.ink, sw: .8 });
    inkLine([[0, -s * .85], [0, s * .85]], .7, PAL.ink, 'inkfine', 0);
    for (const [dx, dy] of [[-.45, -.2], [.45, -.2], [-.35, .35], [.4, .4]]) paint(ellPts(dx * s, dy * s, s * .17, s * .17, 8), { wash: PAL.ink, ink: null });
    paint(ellPts(-s * 1, 0, s * .4, s * .4, 10), { wash: PAL.ink, ink: null });
    pop();
  }
  function throne(t, lt) {
    const FLICK = B(38), SIP = B(36);
    camBegin(960 + Math.sin(t) * 15, 520, lerp(1.08, 1.0, ease(lt / 1.85)), -.02 + lt * .01);
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#4A1636', fill: '#7A2A5C', fillOp: 70, tex: .5, ink: null });
    for (const s of [-1, 1]) {                            // velvet curtains
      const x0 = s < 0 ? -200 : W + 200, x1 = s < 0 ? 360 : W - 360;
      paint([[x0, -200], [x1, -200], [x1 + s * -40 + Math.sin(t * 2) * 10, 420], [x1 - s * 60, 1200], [x0, 1200]], { wash: '#8E1F4E', fill: '#5A0F33', fillOp: 90, tex: .6, ink: PAL.ink, sw: 1, curv: .3 });
      for (let k = 1; k < 4; k++) inkLine([[lerp(x0, x1, k / 4), -200], [lerp(x0, x1, k / 4) - s * 20, 1200]], .8, '#5A0F33', 'inkfine', .3);
    }
    paint(rectPts(-400, 880, W + 800, 400), { wash: '#6B2A7A', fill: '#3E1450', fillOp: 70, tex: .5, ink: PAL.ink, sw: .8 });
    // throne
    paint(rrPts(700, 230, 520, 640, 180), { wash: '#6B2A7A', fill: '#3E1450', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1.3 });
    paint(rrPts(730, 260, 460, 580, 160), { ink: MG.gold, sw: 1.6 });
    for (const bx of [700, 1220]) paint(ellPts(bx, 560, 34, 34, 14), { wash: MG.gold, ink: PAL.ink, sw: .8 });
    crescent(960, 205, 50, -Math.PI / 2, MG.gold, { sw: .9 });
    paint(rrPts(660, 800, 600, 90, 30), { wash: '#8E3A9A', ink: PAL.ink, sw: 1 });
    sparkleField(t, 10, { seed: 21, area: [300, 100, 1300, 700] });
    // her with tea
    const sip = t < SIP ? easeOut(seg(t, SIP - .3, SIP)) : 1 - ease(seg(t, SIP + .4, SIP + .8));
    const aR = lerp(.25, 1.05, sip), fl = seg(t, FLICK - .12, FLICK + .08), aL = t < FLICK ? lerp(.2, -.5, ease(seg(t, FLICK - .35, FLICK - .1))) : lerp(1.4, .3, ease(seg(t, FLICK, FLICK + .5)));
    const cup = (u, sw) => {
      push(); rotate(aR);
      paint(ellPts(.3 * u, -.4 * u, 1.5 * u, .3 * u, 14), { wash: MG.cream, ink: PAL.ink, sw: sw * .5 });
      paint([[-.6 * u, -2.2 * u], [1.2 * u, -2.2 * u], [.9 * u, -.6 * u], [-.3 * u, -.6 * u]], { wash: MG.cream, ink: PAL.ink, sw: sw * .5, curv: .2 });
      paint(ellPts(.3 * u, -1.6 * u, .3 * u, .25 * u, 10), { wash: MG.hot, ink: null });
      paint(ellPts(1.5 * u, -1.6 * u, .35 * u, .4 * u, 10), { ink: PAL.ink, sw: sw * .4 });
      paint(ellPts(-.5 * u, .1 * u, .6 * u, .6 * u, 12), { wash: MG.glove, ink: PAL.ink, sw: sw * .5 });
      paint(ellPts(-1.3 * u, -.5 * u, .45 * u, .18 * u, 8, 0, -.9), { wash: MG.glove, ink: PAL.ink, sw: sw * .4 });   // pinky up
      for (let k = 0; k < 2; k++) inkLine([[.1 * u + k * .5 * u, -2.5 * u], [.3 * u + k * .5 * u + Math.sin(T * 5 + k) * .2 * u, -3.3 * u], [.1 * u + k * .5 * u, -4 * u]], sw * .4, MG.cream, 'inkfine', .5);
      pop();
    };
    const bugX = t < FLICK ? 960 - 330 * Math.cos((t - 17.85) * 4.2) : 0, bugY = t < FLICK ? 470 + 90 * Math.sin(t * 7) : 0;
    const lookX = t < FLICK ? clamp((bugX - 960) / 300, -1, 1) : 0;
    sailorClawd(960, 870, 38, { armR: cup, aR, aL, armL: gloveH, eyes: t > FLICK + .1 ? 'closed' : sip > .6 ? 'closed' : 'look', lookX, lookY: -.3, mouth: sip > .6 ? 'o' : 'cat', blush: true, dy: -.3 * pulse(t, 4), noShadow: true });
    if (t < FLICK) ladybug(bugX, bugY, 38, t, Math.sin(t * 9) * .3);
    else { const q = t - FLICK; ladybug(560 - q * 1400, 500 - q * 900 + q * q * 400, 38, t, q * 20); burst(600, 480, 160, clamp(q / .5)); }
    if (fl > 0 && fl < 1) inkLine([[640, 560], [590, 470], [620, 390]], 5, MG.cream, 'marker', .6);
    camEnd();
  }

  // ---------------- 19.7 – 21.7 · tennis serve: glitter heart smashes into a rival ----------------
  function tennis(t, lt) {
    const TOSS = B(39), HIT = B(40), IMP = B(41), RX = 2500;
    const cx = kf(t, [[19.7, 820], [HIT, 860], [IMP - .05, 2300], [21.7, 2420]], easeIn), cy = kf(t, [[IMP - .1, 540], [IMP + .3, 640]]), imp = t > IMP ? Math.exp(-(t - IMP) * 5) : 0;
    const [sx, sy] = shakeXY(t, 16 * imp);
    camBegin(cx + sx, cy + sy, lerp(1.05, 1.4, easeOut(seg(t, IMP, 21.7))));
    paint(rectPts(-400, -400, 3600, 1600), { wash: '#2E1D63', fill: MG.hot, fillOp: 50, tex: .5, ink: null });
    nightBg(t, { n: 0 });
    for (let i = 0; i < 18; i++) paint(starPts(-200 + hash(i + 3) * 3200, hash(i + 4) * 500, 5, .3, 4), { wash: MG.cream, ink: null });
    bigMoon(1500, 260, 180, t);
    paint(rectPts(-400, 860, 3600, 500), { wash: '#2F6FB0', fill: '#1E4C8A', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1 });
    inkLine([[-400, 880], [3200, 880]], 3, MG.cream, 'marker', 0);
    inkLine([[-400, 1000], [3200, 1000]], 3, MG.cream, 'marker', 0);
    // net
    paint(rectPts(1540, 700, 16, 200), { wash: '#DDD', ink: PAL.ink, sw: .8 });
    paint(rectPts(1545, 700, 10, 190), { hatch: { d: 12, a: .8, b: 'HB', c: MG.cream, w: .7 }, ink: null });
    paint(rectPts(1535, 695, 30, 14), { wash: MG.cream, ink: PAL.ink, sw: .6 });
    // her serving
    const up = seg(t, 19.7, TOSS), sw = seg(t, HIT - .12, HIT + .1);
    const aR = t < HIT - .12 ? lerp(.3, 2.3, ease(up)) : lerp(2.3, -.4, easeOut(sw)), aL = t < TOSS ? lerp(.2, 1.4, ease(up)) : lerp(1.4, .4, ease(seg(t, TOSS, HIT)));
    sailorClawd(600, 870, 34, { wand: true, aR, aL, armL: gloveH, eyes: t < HIT ? 'look' : 'narrow', lookX: .3, lookY: t < HIT ? -1 : 0, mouth: t < HIT ? 'flat' : 'grin', rot: t > HIT ? .08 * Math.exp(-(t - HIT) * 4) : -.05, dy: -1.2 * pulse(t, 5) });
    if (sw > 0 && sw < 1) paint([[640, 460], [900, 380], [980, 560], [880, 520], [760, 450]], { fill: MG.pink, fillOp: 120, bleed: .2, ink: null, curv: .5 });
    // the heart ball
    let hx, hy, hr;
    if (t < HIT) { const q = seg(t, TOSS - .3, HIT); hx = 740; hy = 520 - Math.sin(q * Math.PI * .92) * 320; hr = 40; }
    else { const q = seg(t, HIT, IMP); hx = lerp(820, RX, easeIn(q * .7 + q * .3)); hy = lerp(360, 670, q); hr = lerp(40, 170, q); }
    if (t < IMP) {
      if (t > HIT) for (let i = 0; i < 8; i++) inkLine([[hx - hr - 60 - i * 40, hy - hr + i * hr * .28], [hx - hr - 400 - i * 60, hy - hr + i * hr * .28]], 1.6, MG.cream, 'inkfine', 0);
      glow(hx, hy, hr * 1.6, MG.goldLt, 90);
      paint(heartPts(hx, hy, hr), { wash: MG.hot, fill: MG.gold, fillOp: 70, tex: .5, ink: PAL.ink, sw: 1.1 });
      for (let i = 0; i < 4; i++) sparkle(hx + (hash(i) - .5) * hr, hy + (hash(i + 1) - .5) * hr, hr * .3, frac(t * 3 + hash(i)), MG.cream);
    }
    // rival gets a face full of it
    const kb = t > IMP ? easeOut(seg(t, IMP, IMP + .3)) : 0;
    rival(RX + kb * 60, 870, 40, { eyes: t < IMP ? 'scared' : 'x', lookX: -1, mouth: t < IMP ? 'O' : 'wobble', rot: kb * .35, aL: 1.3 + kb, aR: 1.3 + kb, flip: true, armL: gloveH, armR: gloveH });
    if (t > IMP) {
      const q = t - IMP;
      paint(heartPts(RX + kb * 60 - 10, 870 - 5 * 40 + 10, 190), { wash: MG.hot, fill: MG.gold, fillOp: 80, tex: .6, ink: PAL.ink, sw: 1.2 });
      burst(RX, 700, 420, clamp(q / .6), [MG.gold, MG.goldLt, MG.pink, MG.cream]);
      sunburst(RX, 700, MG.goldLt, MG.pink, q, 14, 700 * easeOut(q / .15), 80 * imp);
      sfx('POP!', RX - 260, 420, 130, MG.gold, q, { life: .9, rot: -.15 });
    }
    camEnd();
    if (t > HIT && t < IMP) flash(.25 * Math.exp(-(t - HIT) * 10), MG.cream);
  }

  // ---------------- 21.7 – 23.25 · swarm of flapping lips ----------------
  function swarm(t, lt) {
    const bp = pulse(t, 7), [sx, sy] = shakeXY(t, 5 * bp);
    camBegin(960 + sx, 520 + sy, lerp(1, 1.4, ease(lt / 1.55)) + .05 * bp, Math.sin(lt * 1.5) * .06);
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#5A1646', fill: '#2E0E3A', fillOp: 70, tex: .5, ink: null });
    sunburst(960, 520, '#7A2060', '#3E1244', -t * .4, 20, 1800, 120);
    const N = 20, order = [...Array(N).keys()].sort((a, b) => hash(a + 50) - hash(b + 50));
    for (const i of order) {
      const s = 45 + hash(i + 50) * 110, a0 = hash(i + 51) * TAU, r0 = 250 + hash(i + 52) * 700, r = r0 * lerp(1, .6, ease(lt / 1.55));
      const x = 960 + Math.cos(a0 + t * .3 * (hash(i) - .5)) * r * 1.2, y = 520 + Math.sin(a0) * r * .6 + Math.sin(t * 3 + i) * 15;
      lips(x, y, s, t, { talk: 1, seed: i * 1.7, col: [MG.hot, '#D4577A', MG.lilacDk, MG.red, MG.pinkDk][i % 5], flip: hash(i + 53) > .5, rot: (hash(i + 54) - .5) * .5 });
    }
    for (let i = 0; i < 6; i++) { const q = frac(t * 1.5 + i / 6); inkLine([[960 + Math.cos(i) * (100 + q * 700), 520 + Math.sin(i) * (60 + q * 400)], [960 + Math.cos(i) * (150 + q * 760), 520 + Math.sin(i) * (80 + q * 430)]], 2, MG.pink, 'inkfine', 0); }
    camEnd();
  }

  // ---------------- 23.25 – 25.4 · karate chop through the rule tablet, rules fly off as paper birds ----------------
  const TB = { x0: 920, x1: 1380, top: 380, bot: 900 };
  function tabletPts(side) {                              // one half (side -1/1) or whole (0), in world coords
    const { x0, x1, top, bot } = TB, cx = (x0 + x1) / 2, cr = (x1 - x0) / 2, crack = [[1110, top + 30], [1150, 520], [1095, 640], [1160, 760], [1120, bot]];
    const arc = (a0, a1) => { const p = []; for (let i = 0; i <= 10; i++) { const a = lerp(a0, a1, i / 10); p.push([cx + Math.cos(a) * cr, top + cr * .6 + Math.sin(a) * cr * .6]); } return p; };
    if (side === 0) return [[x0, bot], ...arc(Math.PI, TAU), [x1, bot]];
    if (side < 0) return [[x0, bot], ...arc(Math.PI, Math.PI * 1.43), ...crack];
    return [...crack.slice().reverse(), ...arc(Math.PI * 1.43, TAU), [x1, bot]].reverse();
  }
  function rules(side) {
    for (let r = 0; r < 7; r++) {
      const y = 480 + r * 55, pts = [];
      for (let k = 0; k < 8; k++) { const x = 970 + k * 50; if ((side < 0 && x > 1100) || (side > 0 && x < 1150)) continue; pts.push([x, y + Math.sin(k * 2.1 + r) * 6]); }
      if (pts.length > 1) inkLine(pts, 1.4, '#5C5670', 'inkfine', .4);
    }
  }
  function paperBird(x, y, s, t, i) {
    const f = Math.sin(t * 18 + i) * .7;
    paint([[x - s, y - s * f], [x, y + s * .2], [x + s, y - s * f], [x, y - s * .15]], { wash: MG.cream, ink: PAL.ink, sw: .7 });
  }
  function chop(t, lt) {
    const CHOP = B(48), OUT = 24.85, [sx, sy] = shakeXY(t, t > CHOP ? 18 * Math.exp(-(t - CHOP) * 6) : 2);
    const z = t < CHOP ? lerp(1, 1.12, ease(seg(t, 23.25, CHOP))) : lerp(1.2, 1.05, easeOut(seg(t, CHOP, CHOP + .4)));
    camBegin(1000 + sx, 560 + sy, z);
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#241A4A', fill: MG.lilacDk, fillOp: 70, tex: .5, ink: null });
    sunburst(1100, 600, MG.gold, '#3B2A6E', t * .3 + (t > CHOP ? 1 : 0), 18, 1800, t > CHOP ? 140 : 70);
    if (t > CHOP) speedLines(t, 1100, 640, 26, 500, 1400, MG.goldLt, 1.6);
    paint(rectPts(-400, 900, W + 800, 400), { wash: '#1A1238', ink: PAL.ink, sw: .8 });
    // tablet
    const q = t > CHOP ? t - CHOP : -1, sep = q > 0 ? easeOut(q / .4) : 0;
    if (q < 0) {
      paint(tabletPts(0), { wash: '#A39CB4', fill: '#6E6690', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.4 });
      rules(0);
    }
    const o = easeIn(seg(t, OUT, 25.4));
    const halves = () => { for (const s of [-1, 1]) {
      const hc = [1150 + s * 130, 640];                  // each half flies outward and swells toward the lens
      push(); translate(hc[0] + s * o * 700, hc[1] + o * 150); scale(1 + o * 5); rotate(s * o * .9); translate(-hc[0], -hc[1]);
      translate(1150, 900); rotate(s * sep * .35); translate(s * sep * 90 - 1150, -900 + sep * 20);
      paint(tabletPts(s), { wash: '#A39CB4', fill: '#6E6690', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.4 });
      rules(s); pop();
    } };
    if (q >= 0 && o <= 0) halves();
    // her: wind-up, leap, chop
    const wind = seg(t, 23.25, CHOP - .15), strike = seg(t, CHOP - .15, CHOP);
    const x = lerp(560, 820, ease(strike)) , dy = t < CHOP ? -3.5 * Math.sin(strike * Math.PI * .5) - .4 * pulse(t, 5) : lerp(-3.5, 0, easeOut(q / .25));
    const aR = t < CHOP - .15 ? lerp(.2, 2.4, ease(wind)) : t < CHOP ? lerp(2.4, -.6, easeIn(strike)) : -.6;
    sailorClawd(x, 900, 36, { aR, aL: t < CHOP ? .9 : 1.2, armL: gloveH, armR: gloveH, eyes: t < CHOP ? 'angry' : 'narrow', mouth: t < CHOP ? 'grin' : 'smile', dy, rot: t < CHOP ? -.15 * wind + .3 * strike : .1 * Math.exp(-q * 4), noShadow: dy < -1, blush: t > CHOP });
    {                                                    // the chopping arm, drawn in front so the pigtail can't hide it
      const u = 36, shx = x + 4.6 * u, shy = 900 + dy * u - 5 * u;
      const up = [x + 3 * u, 900 + dy * u - 13 * u], hit = [1100, 640];
      const [hx, hy] = t < CHOP - .15 ? [lerp(shx + 2 * u, up[0], ease(wind)), lerp(shy, up[1], ease(wind))] : t < CHOP ? [lerp(up[0], hit[0], easeIn(strike)), lerp(up[1], hit[1], easeIn(strike))] : hit;
      const d = Math.hypot(hx - shx, hy - shy) || 1, nx = -(hy - shy) / d * u * .5, ny = (hx - shx) / d * u * .5;
      paint([[shx + nx, shy + ny], [hx + nx, hy + ny], [hx - nx, hy - ny], [shx - nx, shy - ny]], { wash: PAL.clay, ink: PAL.ink, sw: 1.2 });
      paint(ellPts(hx, hy, u * 1.1, u * .6, 14, 0, Math.atan2(hy - shy, hx - shx)), { wash: MG.glove, ink: PAL.ink, sw: 1.1 });
    }
    if (strike > 0 && strike < 1) paint([[980, 330], [1120, 420], [1110, 700], [1040, 560]], { fill: MG.goldLt, fillOp: 120, bleed: .2, ink: null, curv: .5 });
    if (q > 0) {
      burst(1110, 650, 380, clamp(q / .6));
      sfx('CHOP!', 1360, 330, 150, MG.gold, q, { life: 1, rot: .12 });
      for (let i = 0; i < 12; i++) {                      // the rules escape as paper birds
        const bq = clamp((q - hash(i) * .25) / 1.2); if (bq <= 0) continue;
        paperBird(1110 + (hash(i + 7) - .5) * 900 * bq, 650 - bq * (500 + hash(i + 8) * 400) + Math.sin(bq * 9 + i) * 20, 22 + hash(i + 9) * 16, t, i);
      }
    }
    if (o > 0) halves();
    camEnd();
  }

  chapter('intro', 0, 25.4, [
    [0, rooftop], [4.2, transform], [8.5, radar], [B(20), reticle], [11.9, ticker], [13.9, flight],
    [15.9, nails], [17.85, throne], [19.7, tennis], [21.7, swarm], [23.25, chop]
  ]);
})();
