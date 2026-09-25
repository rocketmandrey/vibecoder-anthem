// i02_chorus1: Pre-chorus 1 + Chorus 1 (25.4–59.45). Hot pink + sky blue.
// Cuts follow the sung words (assets/itgirl/itgirl.json), which sit on or next to beats (beat n = 0.233 + n·0.5).
(() => {
  const BLUE = '#2F5DA8', BLUE_LT = '#CFE2FF', RIVAL = '#8A7DAE', RIVAL_DK = '#5E4F87', SHADOW = '#1A1030';
  const BK = [{ skirt: MG.pink, bow: MG.hot }, { skirt: MG.mint, bow: '#2F8F74' }, { skirt: MG.lilac, bow: MG.lilacDk }, { skirt: MG.gold, bow: MG.hot }];
  // sung letter onsets of the three chorus spellings
  const SPELLS = [[34.18, 34.48, 34.82, 35.30, 35.56, 36.02], [36.54, 36.66, 36.82, 37.28, 37.60, 37.84], [40.46, 40.56, 40.86, 41.32, 41.64, 41.90]];
  const SPELL_COLS = [[MG.hot, MG.sky, MG.gold, MG.pink, MG.mint, MG.lilac], [MG.sky, MG.gold, MG.hot, MG.mint, MG.pink, MG.gold], [MG.gold, MG.hot, MG.sky, MG.lilac, MG.gold, MG.pink]];
  const HITS_A = [43.98, 44.58, 45.12, 45.36], HITS_B = [47.98, 48.58, 49.10, 49.58];

  // ---------------- helpers ----------------
  const lead = (x, y, u, o = {}) => sailorClawd(x, y, u, { wand: true, blush: true, ...o });
  function backup(x, y, u, i, t, style, extra = {}) {
    const m = move(style, t, i);
    sailorClawd(x + m.dx * u, y, u, { ...m, ...BK[i % 4], eyes: 'happy', seed: i, ...extra });
  }
  // raised left arm + glove repainted over the hair (arms normally sit under the pigtails); use as the draw hook
  const armOver = a => (u, sw) => {
    push(); translate(-4.9 * u, -4.5 * u); rotate(a);
    paint(rectPts(-2.3 * u, -.5 * u, 2.3 * u, u), { wash: PAL.clay, ink: PAL.ink, sw: sw * .8 });
    paint(ellPts(-2.5 * u, 0, .85 * u, .85 * u, 12), { wash: MG.glove, ink: PAL.ink, sw: sw * .6 });
    pop();
  };
  const bg = col => paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: col, ink: null });
  // anime radial speed lines converging on (cx, cy); re-drawn at 12 fps so they flicker
  function radial(cx, cy, t, n = 36, col = MG.cream, r0 = 420) {
    const f = Math.floor(t * 12);
    for (let i = 0; i < n; i++) {
      const a = (i + hash(i + f * 3.1) * .6) / n * TAU, r = r0 + hash(i * 7 + f) * 260;
      inkLine([[cx + Math.cos(a) * r, cy + Math.sin(a) * r], [cx + Math.cos(a) * 1900, cy + Math.sin(a) * 1900]], 1 + hash(i + f) * 2.2, col, 'ink', 0);
    }
  }
  // horizontal streaks scrolling left
  function streaks(t, n, col, speed = 900, y0 = 0, y1 = H) {
    for (let i = 0; i < n; i++) {
      const len = 180 + hash(i + 3) * 420, x = ((hash(i) * 2800 - t * speed * (.7 + hash(i + 9) * .6)) % 2800 + 2800) % 2800 - 500, y = lerp(y0, y1, hash(i + 5));
      inkLine([[x, y], [x + len, y]], 1 + hash(i + 2) * 2, col, 'ink', 0);
    }
  }
  // crisp alternating light rays (flat washes read better than watercolour fills here)
  function rays(cx, cy, rot, n, a, b, op = 200) {
    for (let i = 0; i < n; i++) {
      const a0 = rot + i * TAU / n, a1 = a0 + TAU / n * .55;
      paint([[cx, cy], [cx + Math.cos(a0) * 2600, cy + Math.sin(a0) * 2600], [cx + Math.cos(a1) * 2600, cy + Math.sin(a1) * 2600]], { wash: i % 2 ? a : b, washOp: op, ink: null });
    }
  }
  function burstStar(cx, cy, r, rot, a, b) {
    paint(starPts(cx, cy, r, .5, 18, rot), { wash: a, ink: null });
    paint(starPts(cx, cy, r * .58, .55, 14, -rot * 1.3), { wash: b, ink: null });
  }
  function impact(x, y, r, k, col = MG.goldLt) {
    if (k <= 0 || k >= 1) return;
    const s = backOut(k * 2.2) * (1 - easeIn(k));
    paint(starPts(x, y, r * s, .42, 8, k * .6), { wash: col, ink: PAL.ink, sw: 1.2 });
    paint(starPts(x, y, r * .5 * s, .45, 8, -k), { wash: MG.cream, ink: null });
  }
  // concert stage: pink/sky rays, sparkles, glossy lilac floor with light pools
  function concert(t, o = {}) {
    bg('#FBD3E4');
    rays(960, o.cy ?? 380, t * .25, 14, MG.hot, MG.sky);
    paint(ellPts(960, o.cy ?? 380, 420, 340, 20), { fill: MG.cream, fillOp: 150, bleed: .3, tex: .2, ink: null });
    sparkleField(t, o.n ?? 14, { seed: 21, area: [-200, -150, W + 400, 800] });
    paint([[-500, 820], [W + 500, 820], [W + 500, 1600], [-500, 1600]], { wash: '#6B4BA8', fill: MG.lilacDk, fillOp: 60, tex: .5, border: .4, ink: PAL.ink, sw: 1.2 });
    inkLine([[-500, 824], [W + 500, 824]], 3, MG.hot, 'ink', 0);
    for (const [x, c] of [[480, MG.sky], [960, MG.pink], [1440, MG.sky]]) paint(ellPts(x, 900, 300, 50, 16), { fill: c, fillOp: 90 + 60 * pulse(t, 4), bleed: .2, tex: .3, ink: null });
  }
  // world position of the left glove of a clawd at (x, y) with unit u and left arm angle a
  const gloveL = (x, y, u, a, dy = 0) => [x - 4.9 * u - 2.4 * u * Math.cos(a), y + dy * u - 4.5 * u - 2.4 * u * Math.sin(a)];
  // letters: each letter shows from the latest spelling that has reached it and re-pops when sung again
  function chant(t, x, y, size, gap) {
    for (let i = 0; i < 6; i++) {
      let k = -1; for (let s = 0; s < SPELLS.length; s++) if (t >= SPELLS[s][i]) k = s;
      if (k < 0) continue;
      const age = t - SPELLS[k][i], lx = x + (i - 2.5) * gap, ly = y + Math.sin(t * 5 + i) * size * .05;
      letter('ITGIRL'[i], lx, ly, size, SPELL_COLS[k][i], { pop: age * 4, rot: (hash(i + 9) - .5) * .25, stroke: MG.navy });
      if (age < .45) sparkle(lx + size * .4, ly - size * .45, size * .3, age / .45, MG.cream);
    }
  }
  const lastOnset = t => { let b = -9; for (const s of SPELLS) for (const o of s) if (o <= t) b = Math.max(b, o); return t - b; };
  function heart(x, y, r, col = MG.hot) { paint(heartPts(x, y, r), { wash: col, ink: PAL.ink, sw: clamp(r / 30, .5, 1.2) }); }

  // ---------------- shots ----------------
  // 25.4 "Got that swagger, got that juice": slow-mo strut, speed lines, juice box, shades slide down.
  function swagger(t, lt) {
    const shade = easeOut(seg(t, 26.4, 26.85)), sip = seg(t, 27.08, 27.4);
    camBegin(960 + lt * 25, 560 - lt * 10, 1.04 + lt * .05, -.02);
    bg(MG.sky);
    paint(ellPts(960, 520, 900, 520, 20), { fill: MG.pink, fillOp: 120, bleed: .3, tex: .4, ink: null });
    streaks(t, 34, MG.cream, 700);
    streaks(t + 3, 14, MG.hot, 500);
    sparkleField(t, 10, { seed: 5 });
    const walk = t * .55, bob = -Math.abs(Math.sin(walk * Math.PI)) * .7;
    lead(960, 920, 38, {
      walk, dy: bob, aL: .95, aR: .15 + .1 * Math.sin(t * 2), eyes: shade > .95 ? 'shades' : 'normal', mouth: sip > 0 ? 'o' : 'smile',
      draw: (u, sw) => {
        // juice box held up by the face, bendy straw to the mouth
        const sq = sip > 0 ? .12 * Math.sin(sip * Math.PI) : 0;
        paint(rrPts(-7.2 * u, -5.4 * u, 2.4 * u, 3 * u * (1 - sq), .3 * u), { wash: MG.mint, ink: PAL.ink, sw: sw * .6 });
        paint(ellPts(-6 * u, -4 * u, .7 * u, .7 * u, 10), { wash: MG.gold, ink: null });
        inkLine([[-5.8 * u, -5.4 * u], [-5.8 * u, -6.4 * u], [-4.6 * u, -6.3 * u], [-.6 * u, -4.4 * u]], sw * 1.1, MG.hot, 'ink', .4);
        if (shade < .95) {
          const oy = lerp(-2.2, 0, shade) * u;
          paint(rrPts(-4.6 * u, -7.5 * u + oy, 9.2 * u, 2.2 * u, .6 * u), { wash: PAL.ink, ink: null });
          inkLine([[-3.9 * u, -7 * u + oy], [-2.4 * u, -7.1 * u + oy]], sw * .5, PAL.cream, 'inkfine', 0);
        }
      }
    });
    if (sip > 0) sparkle(900, 700, 40, seg(t, 27.1, 27.4), MG.goldLt);
    if (shade > .95) sparkle(870, 650, 36, seg(t, 26.85, 27.2), MG.cream);
    camEnd();
  }

  // 27.45 "Loose lips, baby, what's the use?": lips buzz around her, the cat swats one, they zip away.
  function looseLips(t, lt) {
    const swat = 28.73, flee = seg(t, 29.2, 29.8);
    camBegin(960 + Math.sin(lt * 1.3) * 30, 540, 1.02 + lt * .03);
    bg('#FBD3E4');
    sunburst(960, 460, MG.pink, MG.sky, t * .15, 12, 2200, 90);
    paint([[-500, 840], [W + 500, 840], [W + 500, 1600], [-500, 1600]], { wash: '#B98AD9', fill: MG.lilacDk, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1 });
    lead(820, 900, 34, { ...move('idle', t), eyes: t < swat ? 'narrow' : 'happy', mouth: t < swat ? 'flat' : 'smile', aL: -.2, aR: .2 });
    // the cat on the right, paw swipe on the beat
    const sw = seg(t, swat - .12, swat + .1), paw = Math.sin(sw * Math.PI);
    blackCat(1420, 900, 30, t, { sit: true, eyes: t > swat ? 'happy' : 'normal', flip: true });
    if (sw > 0 && sw < 1) inkLine([[1440, 760], [1440 + 40 - paw * 110, 700 - paw * 60]], 26, '#2A2238', 'marker', .3);
    for (let i = 0; i < 5; i++) {
      const a = t * (2.3 + i * .35) + i * 1.3, rr = 240 + 60 * Math.sin(t * 3 + i) + flee * 1500 * (1 + i * .2);
      let x = 820 + Math.cos(a) * rr * 1.25, y = 620 + Math.sin(a * 1.3) * rr * .5;
      if (i === 0) { // the swatted one: orbits toward the cat, then spins off
        const k = seg(t, swat, swat + .5);
        if (t < swat) { x = lerp(x, 1330, seg(t, 28.2, swat)); y = lerp(y, 690, seg(t, 28.2, swat)); }
        else { x = 1330 - k * 900; y = 690 - k * 700 + k * k * 200; }
        lips(x, y, 48, t, { talk: 1, rot: t > swat ? k * 12 : 0, seed: i });
        impact(1330, 690, 110, seg(t, swat, swat + .35));
        continue;
      }
      lips(x, y, 44, t, { talk: .9, seed: i * 2, flip: Math.cos(a) > 0, rot: Math.sin(t * 7 + i) * .15 });
    }
    if (flee > 0) streaks(t, 20, MG.cream, 1800, 300, 800);
    camEnd();
  }

  // 29.85 "You can plot, you can scheme, throw a little shade": plotters round a map; a shadow gets thrown at the lens.
  function plotters(t, lt) {
    const throwT = 30.96, th = seg(t, throwT, 31.33);
    const [sx, sy] = shakeXY(t, th * 18);
    camBegin(960 + sx, 520 + sy, 1.05 + lt * .04);
    bg('#2A1F45');
    paint([[760, -100], [1160, -100], [1500, 900], [420, 900]], { fill: MG.goldLt, fillOp: 60, bleed: .2, tex: .3, ink: null });
    paint(ellPts(960, 30, 90, 40, 14), { wash: MG.goldLt, ink: PAL.ink, sw: .8 });
    const scheme = i => ({ ...move('idle', t, i), eyes: 'angry', mouth: 'grin', col: RIVAL, dk: RIVAL_DK, lt: '#B3A8D2', seed: i });
    clawd(560, 800, 22, { ...scheme(0), aR: .6 + .3 * Math.sin(t * 8), hat: 'fedora' });
    clawd(960, 790, 22, { ...scheme(1), aL: .4, aR: .4 });
    const wind = t < throwT ? seg(t, 30.6, throwT) : 1 - seg(t, throwT, throwT + .15);
    clawd(1360, 800, 22, { ...scheme(2), aR: lerp(.3, 1.6, wind), hat: 'fedora', rot: -.1 * wind });
    lips(1180, 560, 22, t, { talk: 1 });
    // table + map + her photo + arrows
    paint(ellPts(960, 910, 760, 170, 26), { wash: '#5A3B6E', fill: '#3B2550', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.2 });
    paint([[640, 820], [1300, 800], [1340, 930], [600, 950]], { wash: '#F2E4C4', ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 4; i++) inkLine([[680 + i * 160, 830 - i * 4], [700 + i * 150, 940]], .6, '#B9A57E', 'inkfine', .3);
    paint(rectPts(930, 830, 90, 80, 2), { wash: MG.pink, ink: PAL.ink, sw: .8 });
    paint(rectPts(955, 865, 40, 28), { wash: PAL.clay, ink: null });
    for (const bx of [955, 995]) paint(ellPts(bx, 862, 8, 8, 8), { wash: MG.hair, ink: null });
    const arrow = (a, b, k) => { if (k <= 0) return; const e = [lerp(a[0], b[0], k), lerp(a[1], b[1], k)]; inkLine([a, [lerp(a[0], e[0], .5), lerp(a[1], e[1], .5) - 30], e], 2.4, '#E8364F', 'ink', .6); };
    arrow([700, 900], [930, 870], seg(t, 30.0, 30.4));
    arrow([1280, 910], [1020, 880], seg(t, 30.4, 30.8));
    arrow([980, 940], [975, 912], seg(t, 30.7, 30.9));
    // the shade: a wobbly shadow blob with angry eyes flying at the lens
    if (th > 0) {
      const r = lerp(40, 1500, easeIn(th)), cx = lerp(1470, 1000, th), cy = lerp(620, 540, th), pts = [];
      for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, q = 1 + .18 * Math.sin(a * 5 + t * 20); pts.push([cx + Math.cos(a) * r * q, cy + Math.sin(a) * r * q * .8]); }
      paint(pts, { wash: SHADOW, ink: null });
      for (const e of [-1, 1]) paint(ellPts(cx + e * r * .25, cy - r * .1, r * .09, r * .13, 10), { wash: MG.hot, ink: null });
    }
    camEnd();
  }

  // 31.35 "I'm the blueprint, honey, in the shade you made": the shadow lands and becomes a blueprint of her.
  function blueprint(t, lt) {
    const open = backOut(seg(t, 31.45, 31.85)), pose = t > 31.92;
    camBegin(960 - lt * 20, 540, 1.06 - lt * .03);
    bg('#FBD3E4');
    sunburst(1150, 480, MG.pink, MG.sky, t * .2, 12, 2200, 80);
    // the panel
    const pcx = 1150, pcy = 470, pw = 1180 * open, ph = 760 * open;
    if (open > .02) {
      push(); translate(pcx, pcy); rotate(.03); translate(-pcx, -pcy);
      paint(rectPts(pcx - pw / 2, pcy - ph / 2, pw, ph, 2), { wash: BLUE, fill: '#1F3F7A', fillOp: 70, tex: .6, border: .5, ink: PAL.ink, sw: 1.4 });
      if (open > .9) {
        const gl = mixCol(BLUE, MG.cream, .35);
        for (let gx = pcx - 560; gx < pcx + 580; gx += 80) inkLine([[gx, pcy - 370], [gx, pcy + 370]], .5, gl, 'inkfine', 0);
        for (let gy = pcy - 360; gy < pcy + 380; gy += 80) inkLine([[pcx - 580, gy], [pcx + 580, gy]], .5, gl, 'inkfine', 0);
        // her silhouette in white construction lines (u 44, feet at y 770)
        const u = 44, X = pcx + 60, Y = 770, draw = seg(t, 31.8, 32.6), L = (pts, w = 1.8) => inkLine(pts, w, BLUE_LT, 'inkfine', 0);
        if (draw > 0) { L([[X - 5 * u, Y - 2 * u], [X - 5 * u, Y - 8 * u], [X + 5 * u, Y - 8 * u], [X + 5 * u, Y - 2 * u], [X - 5 * u, Y - 2 * u]].slice(0, 2 + Math.ceil(draw * 3))); }
        if (draw > .3) for (const s of [-1, 1]) { paint(ellPts(X + s * 3.3 * u, Y - 9.2 * u, 1.5 * u, 1.4 * u, 16), { ink: BLUE_LT, sw: 1.5, br: 'inkfine' }); L([[X + s * 4.5 * u, Y - 9 * u], [X + s * 7 * u, Y - 5 * u], [X + s * 8.5 * u, Y]], 1.4); }
        if (draw > .5) { for (const lx of [-4, -2, 1, 3]) L([[X + (lx + .5) * u, Y - 2 * u], [X + (lx + .5) * u, Y]], 1.2); L([[X - 6.2 * u, Y - 1.3 * u], [X - 5 * u, Y - 2.9 * u], [X + 5 * u, Y - 2.9 * u], [X + 6.2 * u, Y - 1.3 * u], [X - 6.2 * u, Y - 1.3 * u]], 1.4); }
        if (draw > .7) {
          // dimension lines + ticks
          L([[X - 5 * u, Y + 30], [X + 5 * u, Y + 30]], 1); for (const e of [-5, 5]) L([[X + e * u, Y + 18], [X + e * u, Y + 42]], 1);
          L([[X + 10 * u, Y], [X + 10 * u, Y - 10.6 * u]], 1); for (const e of [0, -10.6]) L([[X + 9.7 * u, Y + e * u], [X + 10.3 * u, Y + e * u]], 1);
          for (const e of [-1, 1]) paint(ellPts(X + e * 2 * u, Y - 6 * u, .6 * u, 1.1 * u, 10), { ink: BLUE_LT, sw: 1, br: 'inkfine' });
          paint(starPts(X - 9 * u, Y - 9 * u, 30, .4, 4), { ink: BLUE_LT, sw: 1, br: 'inkfine' });
        }
      }
      pop();
    }
    paint([[-500, 860], [W + 500, 860], [W + 500, 1600], [-500, 1600]], { wash: '#B98AD9', fill: MG.lilacDk, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1 });
    const pk = seg(t, 31.92, 32.15);
    lead(520, 920, 36, pose
      ? { eyes: 'wink', mouth: 'cat', aL: lerp(.2, 1.35, backOut(pk)), draw: armOver(lerp(.2, 1.35, backOut(pk))), aR: .7, sq: -.1 * Math.sin(pk * Math.PI), dy: -Math.abs(Math.sin(bpOf(t) * Math.PI)) * .5 }
      : { eyes: 'look', lookX: 1, mouth: 'o', aL: .1, aR: .1 });
    if (pose) { sparkle(760, 420, 60, seg(t, 31.95, 32.5)); sparkle(300, 480, 40, seg(t, 32.1, 32.7), MG.goldLt); sparkle(1600, 200, 50, seg(t, 32.6, 33.2), MG.cream); }
    camEnd();
    // the shadow shrinks away from full frame onto the panel
    const sh = 1 - ease(seg(t, 31.35, 31.6));
    if (sh > .01) { const r = 1600 * sh; paint(ellPts(1150, 470, r, r * .8, 20), { wash: SHADOW, ink: null }); }
  }

  // 33.35 "Pump it up, pump it up": wand pumps twice, zoom punches in.
  function pumpIt(t) {
    const p1 = t >= 33.38 ? Math.exp(-(t - 33.38) * 7) : 0, p2 = t >= 33.9 ? Math.exp(-(t - 33.9) * 7) : 0, p = Math.max(p1, p2);
    const z = 1 + .12 * backOut(seg(t, 33.38, 33.5)) + .14 * backOut(seg(t, 33.9, 34.02)), [sx, sy] = shakeXY(t, p * 14);
    camBegin(960 + sx, 600 + sy, z);
    bg(MG.sky);
    burstStar(960, 600, 1300, t * .5, MG.pink, MG.cream);
    radial(960, 600, t, 40, MG.hot, 480);
    lead(960, 1180, 60, { aR: .5 + 1.1 * p, aL: .6 - .3 * p, eyes: 'angry', mouth: 'grin', sq: -.08 * p, noShadow: true });
    const [gx, gy] = [960 + 4.9 * 60 + 2.4 * 60 * Math.cos(.5 + 1.1 * p), 1180 - 4.5 * 60 - 2.4 * 60 * Math.sin(.5 + 1.1 * p)];
    impact(gx + 60, gy - 120, 120, seg(t, 33.38, 33.7));
    impact(gx + 60, gy - 120, 150, seg(t, 33.9, 34.18), MG.pink);
    camEnd();
  }

  // 34.18 Chorus: concert stage, giant I-T-G-I-R-L spelled behind her.
  function chorusA(t, lt) {
    const [sx, sy] = shakeXY(t, 8 * Math.exp(-lastOnset(t) * 10));
    camBegin(960 + Math.sin(lt * .8) * 50 + sx, 520 + sy, 1.02 + .02 * pulse(t, 5) + lt * .01);
    concert(t);
    chant(t, 960, 220, 170, 210);
    flushLetters();
    const style = t < 36.54 ? 'bounce' : 'roof';
    const m = move(style, t);
    lead(960 + m.dx * 40, 900, 40, { ...m, eyes: t < 36.54 ? 'happy' : 'spark', mouth: 'grin' });
    camEnd();
  }

  // 38.28 second spelling: backup dancers pop in on each beat, the letters re-spell at 40.46.
  function chorusB(t, lt) {
    const [sx, sy] = shakeXY(t, 8 * Math.exp(-lastOnset(t) * 10));
    camBegin(960 + sx, 540 + sy, lerp(.98, 1.04, lt / 4));
    concert(t, { n: 18 });
    chant(t, 960, 200, 150, 190);
    flushLetters();
    const pos = [[250, 870], [560, 850], [1360, 850], [1670, 870]];
    pos.forEach(([x, y], i) => {
      const t0 = 38.733 + i * .5, k = seg(t, t0, t0 + .3);
      if (k <= 0) return;
      backup(x, y, 19, i, t, t < 40.46 ? 'bounce' : 'hop', { sy: backOut(k), sx: lerp(.6, 1, backOut(k)) });
      if (k < 1) sparkle(x, y - 110, 90, k, BK[i].skirt);
    });
    const m = move(t < 40.46 ? 'sway' : 'roof', t);
    lead(960 + m.dx * 38, 920, 38, { ...m, eyes: 'happy', mouth: 'grin' });
    camEnd();
  }

  // 42.35 "Yeah, yeah, yeah, I'm that girl... hit 'em!": freeze pose, triple zoom, frame shake on "hit 'em".
  function freeze(t) {
    const z = 1 + .1 * backOut(seg(t, 42.42, 42.6)) + .1 * backOut(seg(t, 42.9, 43.08)) + .12 * backOut(seg(t, 43.08, 43.3));
    const hit = t >= 43.42 ? Math.exp(-(t - 43.42) * 5) : 0, [sx, sy] = shakeXY(t, hit * 40);
    camBegin(960 + sx, 560 + sy, z, hit * .04 * Math.sin(t * 60));
    bg(MG.sky);
    burstStar(960, 520, 1400, t * .3 + (t >= 43.42 ? 1 : 0), MG.hot, MG.pink);
    radial(960, 520, t, 44, MG.cream, 450);
    lead(960, 900, 42, { aR: .75, aL: 1.35, draw: armOver(1.35), eyes: 'wink', mouth: 'cat', rot: -.06, sq: hit * .1 });
    sparkle(1220, 380, 70, frac(t * 1.5), MG.cream);
    sparkle(700, 330, 50, frac(t * 1.5 + .5), MG.goldLt);
    camEnd();
    flash(hit * .55, MG.cream);
  }

  // Four micro-cuts: hit (fist pump + impact star), drop (squat), shake (shimmy), pop (hearts pop).
  function hitsShot(times, B) {
    const BG = B ? [MG.sky, MG.hot, MG.gold, MG.lilac] : [MG.hot, MG.sky, MG.lilac, MG.pink];
    const BS = B ? [MG.pink, MG.sky, MG.hot, MG.pink] : [MG.gold, MG.pink, MG.sky, MG.gold];
    return t => {
      let i = 0; while (i < 3 && t >= times[i + 1]) i++;
      const lt = t - times[i], punch = 1 - easeOut(lt / .25), [sx, sy] = shakeXY(t, punch * 22);
      const rot = B ? [.2, -.22, .16, -.14][i] : 0, z = (B ? 1.12 : 1.02) + .14 * punch;
      camBegin(960 + sx, 560 + sy, z, rot);
      bg(BG[i]);
      burstStar(960, 560, 1300, t * .4 + i, BS[i], mixCol(BG[i], MG.cream, .5));
      radial(960, 560, t, 36, MG.cream, 460);
      const X = 960, Y = 930, u = 44;
      if (i === 0) {
        const a = 1.25;
        lead(X, Y, u, { aL: a, draw: armOver(a), aR: .3, eyes: 'angry', mouth: 'grin', sq: -.12 * punch, dy: -.8 * punch });
        const [gx, gy] = gloveL(X, Y, u, a, -.8 * punch);
        impact(gx, gy - 30, 180, seg(t, times[0], times[0] + .5));
      } else if (i === 1) {
        paint([[-500, 930], [W + 500, 930], [W + 500, 1600], [-500, 1600]], { wash: '#6B4BA8', ink: PAL.ink, sw: 1.2 });
        for (const e of [-1, 1]) inkLine([[X + e * 260, 935], [X + e * 380, 955], [X + e * 470, 945], [X + e * 600, 975]], 1.4, PAL.ink, 'ink', 0);
        lead(X, Y, u, { sq: .32 - .12 * punch, aL: -.5, aR: -.2, eyes: 'narrow', mouth: 'cat' });
        for (const e of [-1, 1]) for (let k = 0; k < 3; k++) paint(ellPts(X + e * (300 + k * 90 + lt * 500), 915 - k * 18 - lt * 60, 50 - k * 10, 30 - k * 5, 10), { wash: MG.cream, washOp: 220 * (1 - seg(lt, .1, .5)), ink: null });
      } else if (i === 2) {
        const w = Math.sin(lt * 42);
        for (const e of [-1, 1]) for (let k = 0; k < 3; k++) {
          const ax = X + e * (330 + k * 55), arc = []; for (let q = 0; q <= 6; q++) { const a = -.8 + q / 6 * 1.6; arc.push([ax + e * Math.cos(a) * 40, 700 + Math.sin(a) * (120 + k * 30)]); }
          inkLine(arc, 2.4, MG.cream, 'ink', .5);
        }
        lead(X + w * 22, Y, u, { rot: w * .07, aL: .9 + .5 * w, aR: .9 - .5 * w, eyes: 'happy', mouth: 'grin', dy: -Math.abs(w) * .4 });
      } else {
        lead(X, Y, u, { aL: 1.1, aR: 1.1, eyes: 'heart', mouth: 'O', sq: -.1 * punch });
        for (let k = 0; k < 12; k++) {
          const a = k / 12 * TAU + .3, r = 140 + easeOut(lt / .45) * 620;
          heart(X + Math.cos(a) * r, 650 + Math.sin(a) * r * .7, 30 + hash(k) * 30, k % 2 ? MG.hot : MG.cream);
        }
        sfx('POP!', X + 380, 330, 150, MG.gold, lt, { life: .5, rot: -.15 });
      }
      camEnd();
    };
  }

  // 45.56 "Can't stop, won't stop, never gonna drop it!": group spins, a disco moon ball descends.
  function spin(t, lt) {
    camBegin(960, 540 - lt * 15, 1.0 + lt * .03, Math.sin(lt * 1.5) * .03);
    concert(t, { cy: 250 });
    const by = lerp(-250, 190, easeOut(seg(t, 45.6, 46.9))) + Math.sin(t * 3) * 8;
    // light beams from the ball
    for (let k = 0; k < 6; k++) { const a = t * .9 + k * TAU / 6; paint([[960, by], [960 + Math.cos(a - .06) * 1800, by + Math.abs(Math.sin(a - .06)) * 1400], [960 + Math.cos(a + .06) * 1800, by + Math.abs(Math.sin(a + .06)) * 1400]], { wash: k % 2 ? MG.goldLt : MG.cream, washOp: 70, ink: null }); }
    inkLine([[960, -300], [960, by - 110]], 1.2, PAL.ink, 'ink', 0);
    paint(ellPts(960, by, 115, 115, 24), { wash: '#DCD6F0', fill: MG.lilac, fillOp: 70, tex: .5, ink: PAL.ink, sw: 1.3 });
    for (let k = -2; k <= 2; k++) inkLine([[960 - 112 * Math.cos(k * .5), by + k * 44], [960 + 112 * Math.cos(k * .5), by + k * 44]], .7, '#8C83B0', 'inkfine', 0);
    for (let k = 0; k < 6; k++) { const ph = frac(t * .5 + k / 6) * Math.PI; inkLine([[960 + Math.cos(ph) * 110, by - 100], [960 + Math.cos(ph) * 115, by], [960 + Math.cos(ph) * 110, by + 100]], .7, '#8C83B0', 'inkfine', .6); }
    crescent(990, by - 10, 70, 0, MG.gold, { sw: 1 });
    for (let k = 0; k < 4; k++) sparkle(960 + Math.cos(t * 2 + k * 1.6) * 150, by + Math.sin(t * 2 + k * 1.6) * 150, 26, frac(t * 2 + k * .25), MG.cream);
    const spinX = d => Math.cos(TAU * ease(frac((bpOf(t) - d) / 2) * 1.6)), sp = (i, x, y, u) => { const sx = spinX(.15 * (i + 1)); sailorClawd(x, y, u, { ...BK[i], sx: Math.abs(sx) < .15 ? .15 * Math.sign(sx || 1) : sx, aL: .8, aR: .8, eyes: 'happy', dy: -Math.abs(Math.sin(bpOf(t) * Math.PI)) * 1.2, seed: i }); };
    [[330, 850], [640, 830], [1280, 830], [1590, 850]].forEach(([x, y], i) => sp(i, x, y, 16));
    const s0 = spinX(0);
    lead(960, 920, 38, { sx: Math.abs(s0) < .15 ? .15 * Math.sign(s0 || 1) : s0, aL: 1, aR: 1, eyes: 'happy', mouth: 'grin', dy: -Math.abs(Math.sin(bpOf(t) * Math.PI)) });
    camEnd();
  }

  // 49.9 "Bounce to the bass, hit it right back": giant subwoofer, everyone bounces, bass rings push the camera.
  function subwoofer(t, lt) {
    const p = pulse(t, 5);
    camBegin(960, 560, 1.0 + .05 * p + lt * .02);
    concert(t, { cy: 300, n: 8 });
    // bass rings behind
    for (let k = 0; k < 3; k++) { const f = frac(bpOf(t)) + k, r = 200 + f * 380; paint(ellPts(960, 790, r, r * .8, 30), { ink: mixCol(MG.hot, MG.cream, f / 3), sw: 3 - f * .8 }); }
    paint(rrPts(600, 560 + p * 8, 720, 520, 40), { wash: '#3A2A5C', fill: '#241A4A', fillOp: 80, tex: .5, ink: PAL.ink, sw: 1.6 });
    const cr = 190 * (1 + .08 * p);
    paint(ellPts(960, 790, cr, cr, 28), { wash: '#1E1830', ink: PAL.ink, sw: 1.4 });
    paint(ellPts(960, 790, cr * .7, cr * .7, 24), { wash: MG.hot, fill: MG.pinkDk, fillOp: 70, tex: .5, ink: PAL.ink, sw: 1 });
    paint(ellPts(960, 790, cr * .28, cr * .28, 16), { wash: MG.gold, ink: PAL.ink, sw: 1 });
    for (const e of [-1, 1]) paint(ellPts(960 + e * 300, 620, 22, 22, 10), { wash: MG.gold, ink: PAL.ink, sw: .8 });
    lead(960, 560 + p * 8, 29, { dy: -Math.abs(Math.sin(bpOf(t) * Math.PI)) * 2.5, sq: p * .2, aL: .6 + p, aR: .6 + p, eyes: 'happy', mouth: 'grin', noShadow: false });
    [[250, 880], [440, 900], [1480, 900], [1670, 880]].forEach(([x, y], i) => backup(x, y, 18, i, t, 'hop'));
    if (t > 51.04 && t < 51.6) sparkle(960, 200, 90, seg(t, 51.04, 51.6), MG.goldLt);
    camEnd();
  }

  // 51.92 "Look at it, want it, get it, snap!": shop-window crown, grab, camera flash → polaroid.
  function shop(t, lt) {
    const snap = 53.42, tf = Math.min(t, snap), frozen = t >= snap;
    const drawScene = () => {
      bg('#BFE3F7');
      paint(rectPts(-500, -500, W + 1000, 560), { wash: '#F9D6E8', ink: null });
      // storefront: awning, window, glass
      for (let k = 0; k < 9; k++) paint([[860 + k * 100, 110], [960 + k * 100, 110], [980 + k * 100, 220], [880 + k * 100, 220]], { wash: k % 2 ? MG.cream : MG.hot, ink: PAL.ink, sw: .8 });
      paint(rectPts(880, 210, 860, 600, 2), { wash: MG.hot, ink: PAL.ink, sw: 1.6 });
      paint(rectPts(910, 240, 800, 540, 2), { wash: '#CFEAF8', fill: MG.lilac, fillOp: 50, tex: .4, ink: PAL.ink, sw: 1.2 });
      paint(ellPts(1330, 470, 260, 200, 18), { fill: MG.goldLt, fillOp: 110, bleed: .3, tex: .2, ink: null });
      paint(rrPts(1180, 560, 300, 90, 30), { wash: MG.hot, fill: MG.pinkDk, fillOp: 60, ink: PAL.ink, sw: 1 });
      const g = seg(tf, 52.96, 53.3), cx = lerp(1330, 560, ease(g)), cy = lerp(562, 520, g) - Math.sin(g * Math.PI) * 180;
      const crown = (x, y, s) => { paint([[x - 60 * s, y], [x - 60 * s, y - 60 * s], [x - 30 * s, y - 25 * s], [x, y - 75 * s], [x + 30 * s, y - 25 * s], [x + 60 * s, y - 60 * s], [x + 60 * s, y]], { wash: MG.gold, fill: MG.goldLt, fillOp: 70, ink: PAL.ink, sw: 1.2 }); for (const gx of [-30, 0, 30]) paint(ellPts(x + gx * s, y - 14 * s, 8 * s, 8 * s, 8), { wash: gx ? MG.sky : MG.hot, ink: null }); };
      if (g < 1) { crown(cx, cy, 1.6); sparkle(cx + 60, cy - 90, 45, frac(tf * 1.6)); sparkle(cx - 70, cy - 40, 30, frac(tf * 1.6 + .5), MG.goldLt); }
      for (const k of [0, 1]) inkLine([[960 + k * 70, 280], [1120 + k * 70, 740]], 9 - k * 4, '#FFFFFF', 'marker', 0);
      paint([[-500, 840], [W + 500, 840], [W + 500, 1600], [-500, 1600]], { wash: '#E8C9A8', ink: PAL.ink, sw: 1.2 });
      const want = tf >= 52.7, got = tf >= 53.3;
      const reach = seg(tf, 52.85, 53.0) * (1 - seg(tf, 53.1, 53.3));
      lead(560, 910, 38, {
        eyes: got ? 'spark' : want ? 'heart' : 'look', lookX: 1, lookY: -.3, mouth: want ? 'O' : 'o',
        aR: .2 + reach * .6, aL: got ? 1.2 : .2, emote: want && !got ? 'heart' : undefined, emoteK: seg(tf, 52.7, 52.9),
        draw: got ? (u) => crown(0, -9.6 * u, u / 34) : undefined
      });
    };
    if (!frozen) {
      camBegin(900 + lt * 60, 520, 1.02 + lt * .04);
      drawScene();
      camEnd();
    } else {
      const k = backOut(seg(t, snap + .05, snap + .35)), rot = lerp(0, -.07, k), z = lerp(1.1, .78, k);
      bg(MG.hot);
      radial(960, 520, t, 30, MG.pink, 380);
      camBegin(900 + 1.5 * 60, 520, z, rot);
      drawScene();
      camEnd();
      // polaroid border (screen space), bottom tab wider
      const hw = W / 2 * z, hh = H / 2 * z, c = Math.cos(rot), s = Math.sin(rot), P = (x, y) => [960 + x * c - y * s, 540 + x * s + y * c];
      const inner = [P(-hw, -hh), P(hw, -hh), P(hw, hh), P(-hw, hh)];
      const m = 40, outer = [P(-hw - m, -hh - m), P(hw + m, -hh - m), P(hw + m, hh + m * 3), P(-hw - m, hh + m * 3)];
      irisShape(outer, '#E8508A');
      for (const [a, b] of [[0, 1], [1, 2], [2, 3], [3, 0]]) paint([inner[a], inner[b], outer[b], outer[a]], { wash: MG.cream, ink: null });
      paint(outer, { ink: PAL.ink, sw: 1.4 });
      sfx('SNAP!', 1450, 180, 150, MG.gold, t - snap, { life: .9, rot: .12 });
      sparkle(1560, 330, 70, seg(t, snap + .1, snap + .5));
    }
    flash(1 - seg(t, snap, snap + .18) - (t < snap ? 1 : 0), MG.cream);
  }

  // 53.78 "Bounce to the bass, hit it right back": whole troupe line dance.
  function lineDance(t, lt) {
    const step = Math.sin(bpOf(t) * Math.PI / 2) * 40, hit = t >= 55.14;
    camBegin(960 - step * .5, 540, 1.02 + lt * .02, Math.sin(lt * 2) * .02);
    concert(t);
    [[260, 870], [560, 880], [1360, 880], [1660, 870]].forEach(([x, y], i) => backup(x + step, y, 19, i, t, 'bounce', hit ? { aL: 1.3, aR: 1.3 } : {}));
    const m = move('bounce', t);
    lead(960 + step, 920, 38, { ...m, eyes: hit ? 'wink' : 'happy', mouth: 'grin', ...(hit ? { aL: 1.35, aR: .8, draw: armOver(1.35) } : {}) });
    if (hit) impact(960 + step, 330, 130, seg(t, 55.14, 55.6), MG.goldLt);
    camEnd();
  }

  // 55.95 "IT GIRL!": final pose, sparkle burst.
  function itGirl(t, lt) {
    const k = backOut(seg(t, 56.0, 56.25));
    camBegin(960, 560, 1.12 - .08 * easeOut(lt / 1.2));
    bg(MG.sky);
    burstStar(960, 560, 1500, t * .35, MG.hot, MG.pink);
    radial(960, 560, t, 44, MG.cream, 520);
    for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, r = 200 + easeOut(seg(t, 56.0, 56.8)) * 650; sparkle(960 + Math.cos(a) * r, 560 + Math.sin(a) * r * .7, 40 + hash(i) * 30, seg(t, 56.0 + hash(i) * .1, 56.9), [MG.cream, MG.goldLt, MG.pink][i % 3]); }
    letter('IT GIRL!', 960, 190, 190 * k + 1, MG.gold, { pop: (t - 56.0) * 4, rot: -.06, stroke: MG.navy });
    lead(960, 930, 44, { aL: lerp(.3, 1.45, k), draw: armOver(lerp(.3, 1.45, k)), aR: lerp(.3, .8, k), eyes: 'wink', mouth: 'grin', sq: -.12 * Math.sin(seg(t, 56.0, 56.3) * Math.PI) });
    camEnd();
  }

  // 57.2 break: the cat alone on stage shrugs and sighs; the masked gentleman's rose lands on its head.
  function catBreak(t, lt) {
    const thr = 58.23, land = 58.73, fl = seg(t, thr, land), landed = t >= land;
    const [sx, sy] = shakeXY(t, landed ? 10 * Math.exp(-(t - land) * 8) : 0);
    camBegin(960 + sx, 560 + sy, 1.08 + lt * .02);
    stageBack(t, { backdrop: () => { bg('#E7B7D2'); rays(960, 430, t * .05, 12, MG.pink, MG.lilac, 110); }, kremlin: false });
    spotlight(900, MG.goldLt);
    const shrug = Math.sin(seg(t, 57.35, 57.9) * Math.PI), CS = 58, CX = 960, CY = 890;
    push(); translate(CX, CY); scale(1 + shrug * .06, 1 - shrug * .1 + (landed ? .08 * Math.exp(-(t - land) * 6) * Math.sin((t - land) * 30) : 0)); translate(-CX, -CY);
    blackCat(CX, CY, CS, t, { sit: true, eyes: landed ? 'wide' : shrug > .2 || t > 57.9 ? 'happy' : 'normal' });
    pop();
    const hx = CX - 1.9 * CS, hy = CY - 3.6 * CS;
    // sigh puff
    const sg = seg(t, 57.7, 58.4);
    if (sg > 0 && sg < 1) paint(ellPts(hx - 150 - sg * 120, hy + 30 - sg * 60, 60 + sg * 40, 40 + sg * 25, 12), { wash: MG.cream, washOp: 220 * (1 - sg), ink: PAL.ink, sw: .6 * (1 - sg) });
    // the gentleman leans in from the right
    const enter = easeOut(seg(t, 57.5, 58.0)), wind = seg(t, 58.0, thr) * (1 - seg(t, thr, thr + .2));
    tuxResearcher(lerp(1900, 1330, enter), 900, 30, { aR: lerp(.2, 1.4, wind), aL: -.9, mouth: 'smile', rose: t < thr, flip: true, blush: true });
    const rose = (x, y, r) => { push(); translate(x, y); rotate(r); inkLine([[0, 0], [110, 0]], 4, '#3E7A3A', 'ink', 0); paint(ellPts(125, 0, 32, 27, 12), { wash: MG.red, fill: '#8E1F33', fillOp: 60, ink: PAL.ink, sw: .8 }); pop(); };
    if (t >= thr && !landed) rose(lerp(1250, hx, fl), lerp(560, hy - 90, fl) - Math.sin(fl * Math.PI) * 260, fl * 9);
    if (landed) { rose(hx - 20, hy - 70, -2.4); impact(hx, hy - 100, 130, seg(t, land, land + .4)); }
    camEnd();
    stageFront(t, { crowd: false, snow: false, chant: false });
  }

  chapter('chorus1', 25.4, 59.45, [
    [25.4, swagger], [27.45, looseLips], [29.85, plotters], [31.35, blueprint], [33.35, pumpIt],
    [34.18, chorusA], [38.28, chorusB], [42.35, freeze], [43.98, hitsShot(HITS_A, false)], [45.56, spin],
    [47.98, hitsShot(HITS_B, true)], [49.9, subwoofer], [51.92, shop], [53.78, lineDance], [55.95, itGirl], [57.2, catBreak]
  ]);
})();
