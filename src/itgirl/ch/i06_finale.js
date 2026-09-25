// i06_finale: final chorus + outro (125.88–160), rainbow galaxy + gold. She grows to planet size in space with galaxy
// hair; four spellings (constellations / dancers on planets / whole cast / "yuh" freezes), back to the stage for
// bounce + group polaroid + IT GIRL, the cat winks, then the night-city rooftop bookend, wink, iris-in, credit line.
(() => {
  const RAIN = [MG.hot, MG.gold, MG.sky, MG.pink, MG.mint, MG.lilac];
  const SPACE = '#1B1240';
  // sung letter onsets (word timestamps); later spellings are smeared in the transcript, so they use a regular pattern
  const S1a = [125.88, 126.48, 126.86, 127.30, 127.56, 128.02], S1b = [128.34, 128.54, 128.68, 129.26, 129.54, 129.84];
  const O1a = [151.80, 152.44, 152.86, 153.32, 153.60, 154.02], O1b = [154.50, 155.02, 155.40, 155.72, 155.90, 156.08];
  const O2a = [156.54, 157.00, 157.36, 157.70, 158.02, 158.30];
  const gen = t0 => [0, .45, .9, 1.3, 1.6, 1.95].map(d => t0 + d);
  const WINK = 158.733, IRIS0 = 158.95, IRIS1 = 159.45;

  // ---------- backgrounds / fx ----------
  function space(t, o = {}) {
    paint(rectPts(-700, -700, W + 1400, H + 1400), { wash: o.sky || SPACE, fill: '#3A2272', fillOp: 90, bleed: .1, tex: .6, border: .3, ink: null });
    const neb = [[300, 250, 700, 380, MG.hot], [1600, 300, 650, 420, MG.sky], [1000, 820, 900, 360, MG.lilac], [1550, 900, 500, 300, MG.gold], [200, 860, 520, 300, MG.mint]];
    neb.forEach(([x, y, rx, ry, c], i) => paint(ellPts(x + Math.sin(t * .3 + i) * 40, y + Math.cos(t * .25 + i) * 30, rx, ry, 22, 0, t * .05 + i), { fill: c, fillOp: 32, bleed: .35, tex: .4, border: .2, ink: null }));
    for (let i = 0; i < 55; i++) {
      const k = .5 + .5 * Math.sin(t * (1.5 + hash(i) * 3) + i * 2);
      paint(starPts(-300 + hash(i + 11) * (W + 600), -300 + hash(i + 12) * (H + 600), 3 + k * 6 + (i % 9 === 0 ? 8 : 0), .3, 4), { wash: i % 4 ? MG.cream : MG.goldLt, washOp: 140 + 110 * k, ink: null });
    }
  }
  function rainbowBurst(cx, cy, rot, op = 110, n = 18, r = 2600, cols = RAIN) {
    for (let i = 0; i < n; i++) {
      const a0 = rot + i * TAU / n, a1 = a0 + TAU / n * .6;
      paint([[cx, cy], [cx + Math.cos(a0) * r, cy + Math.sin(a0) * r], [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r]], { fill: cols[i % cols.length], fillOp: op, bleed: .15, tex: .4, border: .3, ink: null });
    }
  }
  // anime speed lines: thin wedges pointing at (cx, cy), re-drawn at 12 fps
  function speedLines(cx, cy, t, k = 1, col = MG.cream, n = 38, r0 = 420) {
    if (k < .03) return;
    const f = Math.floor(t * 12);
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU + (hash(i + f * .37) - .5) * .12, r1 = r0 + hash(i * 3 + f) * 260, r2 = 2200, w = .008 + hash(i + f * 1.3) * .012;
      paint([[cx + Math.cos(a) * r1, cy + Math.sin(a) * r1], [cx + Math.cos(a - w) * r2, cy + Math.sin(a - w) * r2], [cx + Math.cos(a + w) * r2, cy + Math.sin(a + w) * r2]], { wash: col, washOp: 190 * k, ink: null });
    }
  }
  function galaxy(cx, cy, R, t, op = 1) {
    if (op < .03 || R < 10) return;
    paint(ellPts(cx, cy, R * 1.05, R * .75, 30, 0, t * .1), { fill: '#6B4FC0', fillOp: 70 * op, bleed: .35, tex: .3, ink: null });
    paint(ellPts(cx, cy, R * .6, R * .42, 24, 0, -t * .1), { fill: MG.hot, fillOp: 50 * op, bleed: .35, tex: .3, ink: null });
    for (let arm = 0; arm < 6; arm++) {
      const pts = [];
      for (let i = 0; i <= 14; i++) { const f = i / 14, a = arm * TAU / 6 + f * 3.6 + t * 1.2, r = R * (.08 + f * .95); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * .72]); }
      inkLine(pts, clamp(R / 50, 3, 10), RAIN[arm], 'marker', .7);
    }
    paint(ellPts(cx, cy, R * .18, R * .14, 18), { fill: MG.goldLt, fillOp: 200 * op, bleed: .3, tex: .2, ink: null });
    for (let i = 0; i < 12; i++) { const a = hash(i + 50) * TAU + t * .7, r = R * (.2 + hash(i + 51) * .8); sparkle(cx + Math.cos(a) * r, cy + Math.sin(a) * r * .72, 10 + hash(i) * 14, frac(t * .8 + hash(i + 52)), MG.cream); }
  }
  function planet(x, y, r, col, o = {}) {
    const sw = clamp(r / 90, .5, 1.4), ring = (a0, a1) => { const p = []; for (let i = 0; i <= 16; i++) { const a = lerp(a0, a1, i / 16); p.push([x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * .38]); } inkLine(p, clamp(r / 12, 2, 9), o.ringCol || MG.goldLt, 'marker', .5); };
    paint(ellPts(x, y, r * 1.35, r * 1.35, 22), { fill: col, fillOp: 45, bleed: .35, tex: .2, ink: null });
    if (o.ring) ring(Math.PI, TAU);
    paint(ellPts(x, y, r, r, 28), { wash: col, fill: mixCol(col, MG.navy, .45), fillOp: 90, tex: .6, border: .6, ink: PAL.ink, sw });
    paint(ellPts(x + r * .2, y + r * .25, r * .55, r * .18, 14, 0, -.3), { fill: mixCol(col, MG.navy, .3), fillOp: 90, bleed: .1, tex: .5, ink: null });
    paint(ellPts(x - r * .35, y - r * .4, r * .3, r * .17, 12, 0, -.6), { wash: MG.cream, washOp: 130, ink: null });
    if (o.ring) ring(0, Math.PI);
  }
  function word(txt, ons, x, y, size, t, o = {}) {
    const chars = [...txt], gap = o.gap ?? size * .8, x0 = x - (chars.length - 1) * gap / 2;
    chars.forEach((c, i) => {
      if (c === ' ') return;
      const age = t - ons[i]; if (age < 0) return;
      let hit = 0; for (const p of (o.pulses || [])) { const a = t - p[i]; if (a >= 0 && a < .45) hit = Math.max(hit, 1 - a / .45); }
      const lx = x0 + i * gap, ly = y + Math.sin(t * 6 + i) * size * .04 - hit * size * .16;
      letter(c, lx, ly, size * (1 + .2 * hit), RAIN[i % 6], { pop: age * 4, rot: (hash(i + 9) - .5) * .25 + (o.rot || 0), stroke: o.stroke ?? MG.navy, alpha: o.alpha });
      if (age < .5) sparkle(lx + size * .35, ly - size * .45, size * .28, age / .5, MG.cream);
      if (hit > .05) sparkle(lx - size * .3, ly - size * .3, size * .22, 1 - hit, MG.goldLt);
    });
  }
  // letters as constellations: star at every vertex, gold thread drawn on between them
  const GLYPH = {
    I: [[[.2, 0], [.8, 0]], [[.5, 0], [.5, 1.4]], [[.2, 1.4], [.8, 1.4]]],
    T: [[[0, 0], [1, 0]], [[.5, 0], [.5, 1.4]]],
    G: [[[.95, .25], [.6, 0], [.22, .1], [0, .6], [.15, 1.2], [.55, 1.4], [.95, 1.15], [.95, .75], [.55, .75]]],
    R: [[[0, 1.4], [0, 0], [.7, .05], [.92, .35], [.7, .65], [0, .7]], [[.35, .7], [.95, 1.4]]],
    L: [[[0, 0], [0, 1.4], [.85, 1.4]]]
  };
  function partial(P, k) {
    const d = []; let L = 0; for (let i = 1; i < P.length; i++) { d.push(Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); L += d[i - 1]; }
    let want = L * k; const out = [P[0]];
    for (let i = 1; i < P.length; i++) { if (want >= d[i - 1]) { out.push(P[i]); want -= d[i - 1]; } else { const f = want / d[i - 1]; out.push([lerp(P[i - 1][0], P[i][0], f), lerp(P[i - 1][1], P[i][1], f)]); break; } }
    return out;
  }
  function constLetter(ch, x, y, s, k, glow, col) {
    if (k <= 0) return;
    paint(ellPts(x + s * .5, y + s * .7, s * (.5 + .35 * k + .2 * glow), s * (.75 + .3 * k + .2 * glow), 20), { fill: col, fillOp: 90 + 120 * glow, bleed: .35, tex: .3, ink: null });
    for (const st of GLYPH[ch]) {
      const P = st.map(([a, b]) => [x + a * s, y + b * s]), part = partial(P, clamp(k * 1.6));
      for (let i = 0; i < part.length - 1; i++) inkLine([part[i], part[i + 1]], 2.4 + glow * 2, MG.goldLt, 'ink', 0);
      P.forEach((p, i) => { const kk = clamp(k * 3 - i * .25); if (kk > 0) paint(starPts(p[0], p[1], (15 + 14 * glow) * backOut(kk), .3, 4), { wash: i % 2 ? MG.goldLt : MG.cream, ink: null }); });
    }
  }
  const constWord = (x0, y0, s, gap, ons, pulses, t, dy = () => 0) => [...'ITGIRL'].forEach((c, i) => {
    let glow = 0; for (const p of pulses) { const a = t - p[i]; if (a >= 0) glow = Math.max(glow, Math.exp(-a * 3.5)); }
    const a = t - ons[i]; if (a >= 0) glow = Math.max(glow, Math.exp(-a * 3));
    constLetter(c, x0 + i * gap, y0 + dy(i), s, seg(t, ons[i], ons[i] + .4), glow, RAIN[i]);
  });
  function sparkBurst(x, y, age, r = 200, n = 10, col) {
    if (age < 0 || age > .6) return;
    const k = easeOut(age / .6);
    for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i) * .4; sparkle(x + Math.cos(a) * r * k, y + Math.sin(a) * r * k, 14 + hash(i + 3) * 16, age / .6, col || RAIN[i % 6]); }
  }
  // screen-space falling petals (sakura) and stars
  function petals(t, n = 36, wind = 0, seed = 0) {
    for (let i = 0; i < n; i++) {
      const v = 120 + hash(i + seed) * 160, y = -60 + frac(t * v / 1250 + hash(i + seed + 1)) * 1250 - 60;
      const x = (hash(i + seed + 2) * 2200 - 140 + wind * (y + 60) + Math.sin(t * 1.7 + i) * 60) % 2200 - 60;
      if (i % 3 === 0) { sparkle(x, y, 10 + hash(i) * 10, frac(t * .9 + hash(i + 7)), i % 2 ? MG.goldLt : MG.cream); continue; }
      push(); translate(x, y); rotate(t * (1 + hash(i) * 2) + i); scale(1, .5 + .5 * Math.abs(Math.sin(t * 3 + i)));
      paint([[0, -22], [16, -7], [11, 18], [0, 12], [-11, 18], [-16, -7]], { wash: i % 2 ? MG.pink : '#FFD3E4', ink: null });
      pop();
    }
  }
  function confetti(t, t0, n = 40) {
    for (let i = 0; i < n; i++) {
      const ti = t0 + hash(i + 300) * .8; if (t < ti) continue;
      const age = t - ti, y = -40 + (age * (240 + hash(i + 301) * 200)) % 1200, x = hash(i + 302) * 2040 - 60 + Math.sin(age * 2.2 + i) * 50;
      push(); translate(x, y); rotate(age * (2 + hash(i) * 4) + i); scale(Math.cos(age * 7 + i), 1);
      paint(i % 4 ? rectPts(-11, -6, 22, 12) : starPts(0, 0, 13, .45, 5), { wash: RAIN[i % 6], ink: null });
      pop();
    }
  }
  function rose(x, y, rot, s = 1) {
    push(); translate(x, y); rotate(rot); scale(s);
    inkLine([[0, 0], [4, 26], [2, 50]], 1.1, '#3E7A3A', 'ink', .5);
    paint([[3, 30], [18, 20], [8, 38]], { wash: '#6E9F58', ink: null });
    paint(ellPts(0, -6, 17, 15, 14), { wash: MG.red, fill: '#8E1F33', fillOp: 70, tex: .5, ink: PAL.ink, sw: .7 });
    inkLine([[-6, -8], [2, -13], [7, -5], [0, 0]], .7, '#8E1F33', 'inkfine', .6);
    pop();
  }

  // ---------- cast ----------
  // galaxy hair: lilac pigtails with stars along them (same tail curve as KHAT.odango, drawn in body space)
  function tailStars(u) {
    const sway = Math.sin(T * 3.1) * .35;
    for (const s of [-1, 1]) {
      const bx = s * 3.3 * u, by = -9.2 * u;
      for (let i = 1; i <= 8; i++) {
        const f = i / 8, x = bx + s * (1.2 + f * 4.2 + Math.sin(f * 3 + T * 3 + s) * .5 + sway * f * s) * u, y = by + f * 9.8 * u;
        const k = frac(T * 1.3 + i * .17 + (s > 0 ? .5 : 0));
        paint(starPts(x + (hash(i + s * 7) - .5) * u * .6, y, u * (.2 + .35 * Math.sin(k * Math.PI)), .3, 4), { wash: i % 3 ? MG.cream : MG.goldLt, ink: null });
      }
    }
  }
  function hero(x, y, u, o = {}) {
    const h = MG.hair, hd = MG.hairDk;
    if (o.galaxy) { MG.hair = '#F07DC4'; MG.hairDk = '#8E2F8E'; }   // restored below, so the frame stays pure
    sailorClawd(x, y, u, { blush: true, wand: true, eyes: 'happy', ...o, draw: o.galaxy ? tailStars : o.draw });
    MG.hair = h; MG.hairDk = hd;
  }
  const DANCE = [[MG.pink, MG.gold], [MG.mint, MG.hot], [MG.lilac, MG.gold], [MG.gold, MG.hot], [MG.sky, MG.red], [MG.hot, MG.gold]];
  const backup = (x, y, u, i, t, style = 'hop', extra = {}) => { const m = move(style, t + i * .07, i); sailorClawd(x + m.dx * u, y, u, { ...m, skirt: DANCE[i % 6][0], bow: DANCE[i % 6][1], eyes: 'happy', blush: true, noShadow: true, ...extra }); };
  // reformed lips: halo + little wings, singing along
  function angelLips(x, y, s, t, o = {}) {
    const fl = Math.sin(t * 14 + (o.seed || 0)) * .35, yy = y - 12 * pulse(t, 5) + Math.sin(t * 2 + (o.seed || 0)) * 8;
    for (const e of [-1, 1]) { push(); translate(x + e * 1.4 * s, yy - .2 * s); rotate(e * (-.4 + fl)); paint(ellPts(e * .9 * s, -.3 * s, 1 * s, .45 * s, 14), { wash: MG.cream, fill: MG.sky, fillOp: 50, ink: PAL.ink, sw: .7 }); pop(); }
    lips(x, yy, s, t, { talk: .5, col: o.col || MG.pink, seed: o.seed });
    paint(ellPts(x, yy - 1.05 * s, .95 * s, .22 * s, 18), { ink: MG.gold, sw: 1.6 });
    paint(ellPts(x - 1.1 * s, yy + .1 * s, .25 * s, .13 * s, 10), { fill: PAL.rose, fillOp: 150, bleed: .2, ink: null });
  }
  function tux(x, y, s, t, o = {}) {
    const m = move(o.style || 'bounce', t + .11);
    tuxResearcher(x, y, s, { dy: m.dy * .8, sq: m.sq, rot: m.rot * .6, aL: m.aL - 1.25, aR: m.aR - 1.25, mouth: 'grin', blush: true, ...o });
  }
  const cat = (x, y, s, t, o = {}) => blackCat(x, y, s, t, { eyes: 'happy', ...o });

  // =================================================================================================
  // 125.88 · out of the flash she GROWS to planet size; galaxy hair; the letters form as constellations
  // =================================================================================================
  function growBig(t, lt) {
    const g = backOut(seg(t, 126.15, 126.95)), u = lerp(10, 46, g), GY = 905;
    const [sx, sy] = shakeXY(t, 8 * pulse(t, 5) + 16 * (1 - seg(lt, .1, .9)));
    camBegin(960 + sx, 540 + sy, lerp(1.1, 1.0, easeOut(lt / 2)), lerp(.05, -.02, ease(lt / 2)));
    space(t);
    rainbowBurst(960, 520, t * .5, 30 + 50 * g);
    speedLines(960, 560, t, 1 - seg(t, 126.6, 127.2), MG.cream);
    constWord(960 - 2.5 * 265 - 70, 95, 140, 265, S1a, [], t);
    galaxy(960, GY - 8 * u, 10.5 * u, t, clamp(g * 1.2));
    planet(560, 820, 62, MG.sky, {}); planet(1370, 800, 48, MG.gold, { ring: true, ringCol: MG.pink });
    hero(960, GY, u, { galaxy: true, ...move('bounce', t), aL: lerp(.2, 1.3, g), aR: lerp(.2, .9, g), eyes: g < .9 ? 'spark' : 'happy', mouth: 'grin', noShadow: true });
    sparkBurst(960, GY - 5 * u, t - 126.3, 520, 12);
    camEnd();
    flushLetters();
    flash(1 - seg(t, 125.88, 126.2));
  }

  // 127.88 · second spelling: she poses on the right, the constellations flash letter by letter, wand fires a comet
  function constPose(t, lt, dur) {
    const [sx, sy] = shakeXY(t, 6 * pulse(t, 6));
    camBegin(lerp(900, 1010, ease(lt / dur)) + sx, 540 + sy, lerp(1.0, 1.1, ease(lt / dur)), lerp(-.04, .03, ease(lt / dur)));
    space(t, {});
    rainbowBurst(1330, 560, -t * .4, 60);
    constWord(90, 110, 130, 165, S1a.map(v => v - 9), S1b, t, i => Math.sin(i / 5 * Math.PI) * -40 + 20);
    const u = 50, GY = 910, hit = 129.233, pose = seg(t, hit - .1, hit + .05);
    galaxy(1330, GY - 8 * u, 10 * u, t);
    hero(1330, GY, u, { galaxy: true, ...move('sway', t), aR: lerp(.4, 1.35, backOut(pose)), aL: lerp(.6, -.3, pose), eyes: pose > .5 ? 'wink' : 'happy', mouth: 'grin', noShadow: true });
    // comet from the wand across the sky
    const c = seg(t, hit, hit + .55);
    if (c > 0 && c < 1) {
      const px = lerp(1480, 150, easeOut(c)), py = lerp(330, 80, easeOut(c)) + Math.sin(c * Math.PI) * -60;
      inkLine([[px, py], [px + 180, py + 40], [px + 380, py + 60]], 7 * (1 - c * .5), MG.goldLt, 'marker', .5);
      paint(starPts(px, py, 38, .35, 4, t * 6), { wash: MG.cream, ink: PAL.ink, sw: .6 });
    }
    sparkBurst(1480, 330, t - hit, 240, 10);
    camEnd();
  }

  // 129.95 · third spelling: backup dancers pop onto six bouncing planets, one letter over each
  function planetsRow(t, lt, dur) {
    const ons = gen(129.95), [sx, sy] = shakeXY(t, 5 * pulse(t, 6));
    camBegin(lerp(880, 1040, ease(lt / dur)) + sx, 520 + sy, 1.04 + .03 * pulse(t, 4), .04 * Math.sin(lt * 1.8));
    space(t, {});
    galaxy(960, 330, 520, t, .8);
    for (let i = 0; i < 6; i++) {
      const x = 170 + i * 316, r = 86 + (i % 3) * 10, y = 770 + (i % 2) * 36 - 22 * Math.abs(Math.sin((bpOf(t) + i * .17) * Math.PI));
      planet(x, y, r, RAIN[(i + 2) % 6], { ring: i === 1 || i === 4, ringCol: i === 1 ? MG.pink : MG.goldLt });
      const p = seg(t, ons[i] - .05, ons[i] + .3); if (p <= 0) continue;
      const jump = 1 - easeOut(p);
      backup(x, y - r + 6 - jump * 160, 12.5 * backOut(p), i, t, i % 2 ? 'roof' : 'hop');
      sparkBurst(x, y - r - 60, t - ons[i], 150, 8);
    }
    camEnd();
    word('ITGIRL', ons, 960, 150, 150, t, { gap: 300 });
  }

  // 131.95 · fourth: the solar system spins around her, dancers riding the orbiting planets
  function orbit(t, lt, dur) {
    const ons = gen(131.95), [sx, sy] = shakeXY(t, 6 * pulse(t, 6));
    camBegin(960 + sx, 540 + sy, lerp(1.0, 1.1, ease(lt / dur)), .1 * Math.sin(lt * 1.6));
    space(t);
    rainbowBurst(960, 520, t * .6, 55);
    const P = [...Array(6)].map((_, i) => { const a = i * TAU / 6 + t * .9; return { i, x: 960 + Math.cos(a) * 780, y: 610 + Math.sin(a) * 230, d: Math.sin(a) }; });
    const ride = p => { const r = 45 + 30 * (p.d + 1) / 2; planet(p.x, p.y, r, RAIN[(p.i + 1) % 6], { ring: p.i % 3 === 0 }); backup(p.x, p.y - r + 4, 6 + 4.5 * (p.d + 1) / 2, p.i, t, 'roof'); };
    P.filter(p => p.d < 0).sort((a, b) => a.d - b.d).forEach(ride);
    const u = 34, GY = 790 - 20 * Math.sin(t * 2);
    galaxy(960, GY - 8 * u, 11 * u, t);
    hero(960, GY, u, { galaxy: true, ...move('roof', t), eyes: 'happy', mouth: 'grin', noShadow: true });
    P.filter(p => p.d >= 0).sort((a, b) => a.d - b.d).forEach(ride);
    camEnd();
    word('ITGIRL', ons, 960, 130, 130, t, { gap: 150 });
  }

  // 133.95 · the whole cast dancing on a candy planet: cat, masked gentleman, reformed (angel) lips, backups
  const gyOf = x => 3450 - Math.sqrt(2600 * 2600 - (x - 960) ** 2);
  function castScene(t, o = {}) {
    space(t);
    rainbowBurst(960, 480, t * .45, 70);
    galaxy(960, 470, 430, t, .7);
    paint(ellPts(960, 3450, 2600, 2600, 90), { wash: '#F7B6D2', fill: MG.lilac, fillOp: 90, tex: .6, border: .5, ink: PAL.ink, sw: 1.3 });
    for (const [cx, rr] of [[380, 70], [1250, 50], [1650, 90]]) paint(ellPts(cx, gyOf(cx) + 60, rr, rr * .3, 16), { fill: MG.pinkDk, fillOp: 90, bleed: .1, tex: .5, ink: null });
    angelLips(300, 430, 46, t, { col: MG.hot, seed: 0 });
    angelLips(1640, 420, 46, t, { col: MG.lilac, seed: 2 });
    backup(250, gyOf(250), 12, 0, t, o.style || 'hop');
    backup(1670, gyOf(1670), 12, 1, t, o.style || 'hop');
    cat(510, gyOf(510), 24, t, { eyes: o.catEyes || 'happy' });
    if (o.catRose) rose(510 - 1.9 * 24 + 6, gyOf(510) - 3.6 * 24 - 40, -.4, 1.1);
    tux(1400, gyOf(1400), 20, t, { style: o.style === 'roof' ? 'roof' : 'bounce', rose: !o.thrown, aR: o.tuxAR });
    const u = 36; galaxy(960, gyOf(960) - 8 * u, 9 * u, t, .9);
    hero(960, gyOf(960), u, { galaxy: true, ...move(o.style === 'roof' ? 'roof' : 'bounce', t), mouth: 'grin', eyes: o.heroEyes || 'happy', noShadow: true });
  }
  function castWide(t, lt, dur) {
    const [sx, sy] = shakeXY(t, 5 * pulse(t, 6));
    camBegin(lerp(860, 1060, ease(lt / dur)) + sx, 600 + sy, 1.06 + .03 * pulse(t, 4), lerp(-.03, .03, ease(lt / dur)));
    castScene(t);
    camEnd();
    word('ITGIRL', gen(133.95), 960, 140, 135, t, { gap: 170 });
  }
  // 135.95 · close follow: the gentleman throws his rose… it lands on the cat's head (again)
  function castRose(t, lt) {
    const t0 = 136.233, land = 136.85, f = seg(t, t0, land);
    const [sx, sy] = shakeXY(t, 10 * clamp(1 - (t - land) / .3) * (t > land ? 1 : 0) + 3 * pulse(t, 6));
    camBegin(lerp(1330, 620, ease(seg(t, t0 - .05, land + .1))) + sx, lerp(680, 700, f) + sy, 1.45, .04);
    castScene(t, { thrown: t > t0, tuxAR: t < t0 ? lerp(-1, 1.4, seg(t, 135.95, t0)) : lerp(1.4, .2, seg(t, t0, t0 + .3)), catEyes: t > land ? 'wide' : 'happy', catRose: t > land });
    if (f > 0 && f < 1) rose(lerp(1440, 510 - 40, f), lerp(620, gyOf(510) - 3.6 * 24 - 40, f) - Math.sin(f * Math.PI) * 260, f * 14, 1.1);
    if (t > land) sfx('?!', 400, 640, 70, MG.gold, t - land, { life: .8 });
    camEnd();
    word('ITGIRL', gen(135.95), 960, 130, 120, t, { gap: 150 });
  }

  // 137.65 · "yuh, yuh, yuh": three freeze-frame poses on radial bursts, then everyone for IT GIRL
  function freezeFrame(t, lt, cols, body) {
    const z = lerp(1.25, 1.0, backOut(seg(lt, 0, .18))), [sx, sy] = shakeXY(t, 14 * (1 - seg(lt, 0, .25)));
    camBegin(960 + sx, 540 + sy, z + lt * .06, lerp(-.06, -.03, seg(lt, 0, .5)));
    space(t, { sky: cols[2] });
    rainbowBurst(960, 520, lt * .3, 150, 20, 2600, cols);
    speedLines(960, 520, t, .8, MG.cream, 44, 520);
    body();
    camEnd();
  }
  const yuh1 = (t, lt) => freezeFrame(t, lt, [MG.hot, MG.pink, '#3A1450'], () => {
    galaxy(960, 530, 470, t);
    hero(960, 935, 50, { galaxy: true, aL: 1.35, aR: .5, eyes: 'wink', mouth: 'grin', rot: -.08, sq: -.05, noShadow: true });
    sparkBurst(1180, 420, lt, 260, 10);
  });
  const yuh2 = (t, lt) => freezeFrame(t, lt, [MG.sky, MG.mint, '#14304E'], () => {
    cat(700, 900, 44, t, { eyes: 'wide', sit: true, noShadow: true });
    tuxResearcher(1240, 930, 30, { rose: true, aR: 1.1, aL: -.3, mouth: 'grin', blush: true, rot: .08, noShadow: true });
    sparkBurst(960, 450, lt, 300, 10);
  });
  const yuh3 = (t, lt) => freezeFrame(t, lt, [MG.gold, MG.goldLt, '#4A2A10'], () => {
    angelLips(560, 430, 80, t, { col: MG.hot });
    angelLips(1360, 430, 80, t, { col: MG.lilac, seed: 3 });
    for (let i = 0; i < 3; i++) backup(620 + i * 340, 920 - (i === 1 ? 30 : 0), 20, i + 2, t, 'idle', { aL: 1.3, aR: 1.3, eyes: 'spark', mouth: 'grin' });
  });
  function itgirlSpace(t, lt, dur) {
    const z = lerp(1.2, 1.0, easeOut(lt / .7)) + 1.2 * easeIn(seg(t, 140.85, 141.3)), [sx, sy] = shakeXY(t, 9 * pulse(t, 5));
    camBegin(960 + sx, 560 + sy, z, .03 * Math.sin(lt * 2));
    castScene(t, { style: 'roof', thrown: true, heroEyes: 'spark' });
    speedLines(960, 560, t, .5, MG.cream, 30, 700);
    camEnd();
    word('IT GIRL', [139.233, 139.4, 0, 139.733, 139.9, 140.07, 140.233], 960, 170, 170, t, { gap: 150, pulses: [[140.733, 140.8, 0, 140.9, 141, 141.1, 141.2]] });
    confetti(t, 139.233, 36);
    flushLetters();
    flash(seg(t, 141.0, 141.28));
  }

  // =================================================================================================
  // 141.3 · back on the stage: rainbow sunburst, the whole cast bouncing to the bass
  // =================================================================================================
  function stageBackdrop(tt) {
    paint(rectPts(-500, -500, W + 1000, 1400), { wash: '#FBD6E8', washOp: 255, ink: null });
    rainbowBurst(960, 380, tt * .25, 150, 20);
    paint(ellPts(960, 300, 260, 260, 30), { fill: MG.goldLt, fillOp: 160, bleed: .3, tex: .2, ink: null });
    crescent(960, 300, 170 + 14 * pulse(tt, 4), Math.PI * .85, MG.gold, {});
    for (let i = 0; i < 16; i++) paint(starPts(80 + i * 118, 70 + (i % 3) * 45, 8 + 6 * pulse(tt + i * .06, 4), .3, 4), { wash: MG.goldLt, ink: null });
  }
  const SX = { pink: 230, cat: 440, lil: 650, hero: 960, gold: 1270, tux: 1480, mint: 1690 }, SGY = 905;
  function stageScene(t, o = {}) {
    const h = o.huddle || 0, X = x => lerp(x, 960 + (x - 960) * .5, ease(h)), st = o.style || 'bounce';
    stageBack(t, { floor: '#9B7ED6', backdrop: stageBackdrop });
    // bass rings out of the floor
    for (let k = 0; k < 2; k++) { const a = frac(bpOf(t)) + k; if (a < 1.6) paint(ellPts(960, SGY + 20, 200 + a * 700, 30 + a * 110, 30), { ink: mixCol(MG.cream, MG.pink, a / 1.6), sw: 2.2 * (1 - a / 1.6) + .2 }); }
    angelLips(X(260), 470, 42, t, { col: MG.hot });
    angelLips(X(1660), 470, 42, t, { col: MG.lilac, seed: 2 });
    backup(X(SX.pink), SGY, 12, 0, t, st); backup(X(SX.lil), SGY, 13, 2, t, st); backup(X(SX.gold), SGY, 13, 3, t, st); backup(X(SX.mint), SGY, 12, 1, t, st);
    cat(X(SX.cat), SGY, 22, t, { eyes: o.catEyes || 'happy' });
    tux(X(SX.tux), SGY, 19, t, { style: st === 'hop' ? 'hop' : 'bounce', aR: o.tuxAR });
    hero(X(SX.hero), SGY + 5, 32, { ...move(st, t), mouth: 'grin', eyes: o.heroEyes || 'happy', aR: o.heroAR, aL: o.heroAL });
  }
  function footlights(t) { for (let i = 0; i < 11; i++) { const fx = 110 + i * 170; paint(ellPts(fx, 1000, 50, 16, 14), { fill: RAIN[i % 6], fillOp: 90 + 90 * pulse(t + i * .04, 3), bleed: .25, tex: .2, ink: null }); } }
  function bounce1(t, lt, dur) {
    const [sx, sy] = shakeXY(t, 7 * pulse(t, 7));
    camBegin(960 + sx, lerp(560, 600, ease(lt / dur)) + sy, lerp(1.0, 1.08, ease(lt / dur)) + .035 * pulse(t, 6), 0);
    stageScene(t);
    footlights(t);
    camEnd();
    flash(1 - seg(t, 141.3, 141.6));
  }
  // 143.98 · "look at it, want it, get it": everyone huddles into the viewfinder… SNAP
  const SNAP = 145.46;
  function viewfinder(t, lt) {
    const h = seg(t, 144.3, 145.1);
    camBegin(960, lerp(600, 660, ease(h)), lerp(1.05, 1.3, ease(h)), 0);
    stageScene(t, { huddle: h, style: h > .9 ? 'idle' : 'bounce', heroAR: h > .9 ? 1.3 : undefined, tuxAR: h > .9 ? 1.2 : undefined, heroEyes: h > .9 ? 'wink' : 'happy' });
    camEnd();
    // screen-space viewfinder: corner brackets, focus box, blinking dot
    const m = 90, L = 110, c = MG.cream;
    for (const [x, y, dx, dy] of [[m, m, 1, 1], [W - m, m, -1, 1], [m, 940, 1, -1], [W - m, 940, -1, -1]]) inkLine([[x + dx * L, y], [x, y], [x, y + dy * L]], 3, c, 'ink', 0);
    const fk = lerp(1.25, 1, easeOut(seg(t, 145.0, 145.3)));
    paint(rectPts(960 - 170 * fk, 420 - 150 * fk, 340 * fk, 300 * fk), { ink: t > 145.25 ? MG.mint : c, sw: 1.6 });
    if (Math.sin(t * 12) > 0) paint(ellPts(m + 40, m + 40, 16, 16, 12), { wash: MG.red, ink: null });
  }
  function polaroid(t, lt) {
    // background: pink with sparkles; the frozen photo inside a tilted polaroid, developing from cream
    const rot = lerp(.25, -.07, backOut(seg(lt, 0, .25))), cx = 960, cy = 470, w = 1180, hh = 660;
    const R = (x, y) => [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)];
    const inner = [R(-w / 2, -hh / 2), R(0, -hh / 2), R(w / 2, -hh / 2), R(w / 2, 0), R(w / 2, hh / 2), R(0, hh / 2), R(-w / 2, hh / 2), R(-w / 2, 0)];
    camBegin(960, 650, 1.18, rot);
    stageScene(145.25, { huddle: 1, style: 'idle', heroAR: 1.3, tuxAR: 1.2, heroEyes: 'wink' });
    camEnd();
    paint(inner, { wash: MG.cream, washOp: 255 * (1 - seg(lt, .03, .22)), ink: null });   // developing
    irisShape(inner, '#F6D2E4');
    sparkleField(t, 24, { seed: 9 });
    const fr = [R(-w / 2 - 40, -hh / 2 - 40), R(w / 2 + 40, -hh / 2 - 40), R(w / 2 + 40, hh / 2 + 150), R(-w / 2 - 40, hh / 2 + 150)];
    paint([fr[0], fr[1], R(w / 2, -hh / 2), R(-w / 2, -hh / 2)], { wash: MG.cream, ink: null });
    paint([fr[1], fr[2], R(w / 2, hh / 2), R(w / 2, -hh / 2)], { wash: MG.cream, ink: null });
    paint([fr[2], fr[3], R(-w / 2, hh / 2), R(w / 2, hh / 2)], { wash: MG.cream, ink: null });
    paint([fr[3], fr[0], R(-w / 2, -hh / 2), R(-w / 2, hh / 2)], { wash: MG.cream, ink: null });
    paint(fr, { ink: PAL.ink, sw: 1.3 }); paint(inner, { ink: PAL.ink, sw: .8 });
    const [hx, hy] = R(430, hh / 2 + 75); paint(heartPts(hx, hy, 28), { wash: MG.hot, ink: PAL.ink, sw: .7 });
    sfx('SNAP!', 1580, 170, 130, MG.gold, lt, { life: .5, rot: .12 });
    flushLetters();
    flash(1 - seg(lt, 0, .18));
  }
  // 145.85 · "bounce to the bass" again: low Dutch angle, everyone hopping, confetti
  function bounce2(t, lt, dur) {
    const [sx, sy] = shakeXY(t, 9 * pulse(t, 6));
    camBegin(lerp(760, 1160, ease(lt / dur)) + sx, 660 + sy, 1.3 + .05 * pulse(t, 5), lerp(-.13, -.07, ease(lt / dur)));
    stageScene(t, { style: 'hop' });
    footlights(t);
    camEnd();
    confetti(t, 145.85, 40);
  }
  // 147.95 · IT GIRL! hero pose, zoom punch, rainbow burst
  function heroPose(t, lt, dur) {
    const z = lerp(1.6, 1.25, backOut(seg(lt, 0, .3))) + lt * .05, [sx, sy] = shakeXY(t, 16 * (1 - seg(lt, 0, .35)) + 4 * pulse(t, 6));
    camBegin(960 + sx, 600 + sy, z, -.04);
    stageScene(t, { style: 'idle', heroAR: 1.35, heroAL: .9, heroEyes: 'spark', tuxAR: 1.2 });
    camEnd();
    speedLines(960, 470, t, .7, MG.cream, 36, 600);
    sparkBurst(960, 420, lt, 520, 14);
    word('IT GIRL', [147.7, 147.8, 0, 147.96, 148.06, 148.16, 148.26], 960, 150, 190, t, { gap: 150, rot: -.05 });
    confetti(t, 147.95, 44);
  }
  // 149.6 · break: petals and sparkles fall; the cat looks at us… and winks
  function catWink(t, lt, dur) {
    const s = 62, x = 900, y = 900, wk = 150.733, w = seg(t, wk - .05, wk + .05) * (1 - seg(t, wk + .7, wk + .8));
    camBegin(lerp(960, 900, ease(lt / dur)), lerp(560, 600, ease(lt / dur)), lerp(1.0, 1.12, ease(lt / dur)), .02 * Math.sin(lt * 1.3));
    stageBack(t, { floor: '#9B7ED6', backdrop: stageBackdrop });
    rose(1150, 905, 1.3, 2);
    blackCat(x, y, s, t, { sit: true, eyes: 'normal' });
    // wink: paint over the right-hand eye with fur, then a happy arc + a sparkle
    const hx = x - 1.9 * s, hy = y - 3.6 * s, ex = hx + .65 * s, ey = hy + .05 * s;
    if (w > .5) {
      paint(ellPts(ex, ey, .45 * s, .5 * s, 12), { wash: '#2A2238', ink: null });
      inkLine([[ex - .38 * s, ey + .1 * s], [ex, ey - .22 * s], [ex + .38 * s, ey + .1 * s]], 2.2, MG.goldLt, 'ink', .3);
      sparkle(ex + .9 * s, ey - .7 * s, 46, seg(t, wk, wk + .6), MG.goldLt);
      paint(ellPts(hx - .9 * s, hy + .55 * s, .35 * s, .18 * s, 10), { fill: PAL.rose, fillOp: 140, bleed: .2, ink: null });
    }
    camEnd();
    petals(t, 40, .1, 5);
  }

  // =================================================================================================
  // 151.8 · outro bookend: night city, big moon, her on the rooftop, pigtails in the wind
  // =================================================================================================
  function roof(x0, x1, y) {
    paint([[x0, y], [x1, y], [x1, 1500], [x0, 1500]], { wash: '#1A1238', fill: MG.navy, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1 });
    paint(rectPts(x0 - 20, y - 18, x1 - x0 + 40, 22), { wash: '#3B2A6E', ink: PAL.ink, sw: .9 });
    inkLine([[x0, y + 3], [x1, y + 3]], 1, MG.pink, 'inkfine', 0);
  }
  function wind(t, n = 12) {
    for (let i = 0; i < n; i++) {
      const y = 150 + hash(i + 400) * 700, x = frac(t * (.35 + hash(i + 401) * .3) + hash(i + 402)) * 2600 - 400, l = 160 + hash(i) * 200;
      inkLine([[x, y], [x - l * .5, y + 10 + Math.sin(t * 3 + i) * 10], [x - l, y]], 1.1, MG.lilac, 'inkfine', .6);
    }
  }
  function outroRoof(t, lt, dur) {
    const tilt = ease(seg(lt, 0, 1.1));
    camBegin(lerp(1150, 980, tilt), lerp(330, 540, tilt), lerp(1.2, 1.0, tilt), 0);
    nightCity(t, { moon: [1250, 360, 270] });
    word('ITGIRL', O1a, 1250, 360, 120, t, { gap: 104, pulses: [O1b] });
    roof(300, 1250, 850);
    paint(rrPts(380, 700, 90, 150, 10), { wash: '#2B1E55', ink: PAL.ink, sw: .8 });   // chimney vent
    inkLine([[1150, 850], [1150, 640]], 1.5, PAL.ink, 'ink', 0); paint(ellPts(1150, 636, 9, 9, 10), { wash: Math.sin(t * 5) > 0 ? MG.red : '#5A2030', ink: null });
    hero(760, 850, 26, { ...move('sway', t), wand: true, eyes: mood(t, [[151.8, 'closed'], [152.9, 'happy']]).eyes, mouth: 'smile', rot: move('sway', t).rot * .5 });
    camEnd();
    wind(t);
    petals(t, 22, .35, 11);
    flash(1 - seg(lt, 0, .35), MG.navy);
  }
  // 155.85 · push in; letters over the moon one last time; final-beat wink, iris-in on the sparkle, fade to night
  function outroWink(t, lt) {
    const u = 30, x = 960, y = 905, drift = ease(seg(t, 155.85, 158.4)), push_ = .15 * drift + .85 * easeIn(seg(t, 158.35, IRIS0)), my = lerp(430, 390, drift);
    const fx = x - 4.3 * u, fy = y - 7.7 * u;                                    // wink sparkle (world)
    const cz = lerp(1.0, 2.0, push_), ccx = lerp(960, fx - 120, push_), ccy = lerp(540, fy + 60, push_);
    camBegin(ccx, ccy, cz, lerp(0, -.04, push_));
    nightCity(t, { moon: [960, my, 300], horizon: 960 });
    word('ITGIRL', O2a, 960, my - 40, 110, t, { gap: 96, pulses: [[158.64, 158.82, 158.9, 159.0, 159.1, 159.2]] });
    roof(200, 1720, 905);
    const md = mood(t, [[155.85, 'happy'], [WINK, 'wink']]);
    hero(x, y, u, { ...move(t < WINK ? 'sway' : 'idle', t), ...md, emote: null, mouth: t > WINK ? 'grin' : 'smile', aR: t > WINK ? lerp(.3, 1.2, backOut(seg(t, WINK, WINK + .2))) : undefined });
    sparkle(fx, fy, 60, seg(t, WINK - .05, IRIS1 + .2), MG.goldLt);
    const [sx, sy] = toScreen(fx, fy);
    camEnd();
    wind(t, 8);
    petals(t, 16, .35, 13);
    flushLetters();
    const r = lerp(1100, 0, ease(seg(t, IRIS0, IRIS1)));
    if (t > IRIS0) iris(sx, sy, r, MG.navy);
    if (t >= IRIS1) {
      for (let i = 0; i < 18; i++) paint(starPts(hash(i + 90) * W, hash(i + 91) * 900, 3 + 3 * Math.sin(t * 3 + i) ** 2, .3, 4), { wash: MG.cream, washOp: 180, ink: null });
      crescent(960, 470, 40 * backOut(seg(t, IRIS1 + .05, IRIS1 + .35)), 0, MG.gold, {});
      letter('created by Claude Opus 5.5', 960, 580, 50, MG.gold, { pop: seg(t, IRIS1 + .1, IRIS1 + .45) * 1.5, font: '800 50px "Shantell Sans", sans-serif' });
    }
  }

  chapter('finale', 125.88, DUR + 1, [
    [125.88, growBig], [127.88, constPose], [129.95, planetsRow], [131.95, orbit], [133.95, castWide], [135.95, castRose],
    [137.65, yuh1], [138.233, yuh2], [138.733, yuh3], [139.233, itgirlSpace],
    [141.3, bounce1], [143.98, viewfinder], [SNAP, polaroid], [145.85, bounce2], [147.95, heroPose], [149.6, catWink],
    [151.8, outroRoof], [155.85, outroWink]
  ]);
})();
