// b08_mayo.js: «Жги токены» v3, the rap verse's payoff, 172.66–186.95 in REAL v3 time (cues on the truth line starts / words / beats) (replaces v2's board-game train).
// 172.66 «А мне от неё нужно только одно»: Clawd hugs a giant smartphone in the lamp-lit room (v2 hug staging), bloom on «одно»
// 175.55 «Трекер калорий я хочу давно»: the phone screen, an empty calorie diary, a clay finger taps «+» on «давно»
// 177.88 «Сто тысяч GPU, весь мировой прогресс»: pull back, the phone is wired into a whole data centre, «анализ фото…» crawls
// 180.64 «Чтобы в тарелке разглядеть майонез»: the phone camera on a bun with a blob of mayo, AI label on «майонез»
// 182.76 the camera dives into the dollop → 183.41 (the 2/4 bar's downbeat) a creamy tunnel, faster on every beat → 186.95 cream white-out (a09 cuts in on «Жги»)
(() => {
  const INK = PAL.ink;
  const S1 = 172.66, S2 = 175.552, S3 = 177.876, S4 = 180.637, S5 = 183.409, END = 186.95;
  const ONE = 174.846, TAP = 177.096, MAYO = 181.757, DIVE = 182.76;   // «одно», «давно», «майонез», the beat before the 2/4 bar
  const CREAM = '#FFF8E8', MAYO_C = '#FFFBEF', MAYO_SH = '#E9DDBE', APP = '#5CC27E', APP_DK = '#2F8F5B', PLUS = '#FF7A3D';
  const beatsIn = (a, b) => V3_BEATS.filter(x => x >= a && x < b);

  // ---------- the phone (portrait), centre (cx, cy), w wide ----------
  // screen(x, y, w, h) paints the screen content (top-left rect, world coords)
  function b08_phone(cx, cy, w, screen, o = {}) {
    const h = w * 1.9, x = cx - w / 2, y = cy - h / 2, sw = clamp(w / 300, .6, 1.6) * (o.swMul || 1), b = w * .06;
    if (o.shadow !== false) paint(rrPts(x + w * .05, y + w * .06, w, h, w * .14), { wash: '#000', washOp: 70, ink: null });
    paint(rrPts(x, y, w, h, w * .14), { wash: '#26232B', fill: '#0E0D12', fillOp: 70, tex: .4, ink: INK, sw });
    paint(rrPts(x + b, y + b, w - 2 * b, h - 2 * b, w * .09), { wash: '#FBF8F2', ink: null });
    screen(x + b, y + b, w - 2 * b, h - 2 * b);
    paint(rrPts(cx - w * .14, y + b + w * .02, w * .28, w * .07, w * .035), { wash: '#0E0D12', ink: null });   // notch
  }
  // the app's home screen (small: icon + name), used in the hug
  function b08_appIcon(x, y, w, h, t) {
    paint(rectPts(x, y, w, h), { wash: '#FFF3DC', fill: '#FFD9A8', fillOp: 70, tex: .4, ink: null });
    const cx = x + w / 2, cy = y + h * .42, r = w * .3;
    paint(rrPts(cx - r, cy - r, 2 * r, 2 * r, r * .4), { wash: APP, fill: APP_DK, fillOp: 60, tex: .4, ink: INK, sw: .8 });
    paint(ellPts(cx, cy, r * .62, r * .62, 18), { wash: '#FFFFFF', ink: INK, sw: .6 });                             // plate
    paint(ellPts(cx + r * .08, cy - r * .05, r * .18, r * .14, 10), { wash: MAYO_C, ink: INK, sw: .4 });            // a dollop, of course
    inkLine([[cx - r * .78, cy - r * .5], [cx - r * .78, cy + r * .55]], .8, INK, 'inkfine', 0);                   // fork
    letter('ТРЕКЕР', cx, cy + r * 1.5, w * .13, INK, { font: ruFont(w * .13), ink: false });
    letter('КАЛОРИЙ', cx, cy + r * 1.95, w * .13, INK, { font: ruFont(w * .13), ink: false });
  }

  // ---------- 172.66 the hug (v2 a08 shotHijack staging, the box is now a phone) ----------
  const HUG_B = [S1 + .02, ...beatsIn(S1 + .2, S2 - .15)];
  function shotHug(t, lt) {
    const sway = Math.sin(t * 2.4) * .045, one = seg(t, ONE - .22, ONE + .08), fade = Math.exp(-Math.max(0, t - ONE) * 1.6) * one;
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#F4C99A', fill: '#E8A878', fillOp: 70, tex: .5, ink: null });
    camBegin(960, 520 - lt * 8, 1.02 + lt * .04 + .06 * ease(one));
    for (let i = 0; i < 40; i++) paint(starPts(60 + (i % 10) * 200 + (Math.floor(i / 10) % 2) * 100, 80 + Math.floor(i / 10) * 180, 12, .4), { wash: '#F9DCB8', ink: null });
    paint(rectPts(1380, 120, 420, 420), { wash: '#6E6AA8', fill: '#E89A8A', fillOp: 90, tex: .5, ink: INK, sw: 1.3 });
    paint(ellPts(1490, 220, 6, 6, 8), { wash: '#FFF5E2', ink: null });
    inkLine([[1590, 120], [1590, 540]], 3, '#8A5A36', 'ink', 0); inkLine([[1380, 330], [1800, 330]], 3, '#8A5A36', 'ink', 0);
    paint(ellPts(340, 300, 480, 480, 18), { fill: '#FFE38A', fillOp: 90, bleed: .3, tex: .2, border: .1, ink: null });
    paint([[250, 180], [430, 180], [480, 300], [200, 300]], { wash: '#F2E4C4', fill: '#FFC53D', fillOp: 60, ink: INK, sw: 1 });
    inkLine([[340, 300], [340, 840]], 5, '#6E4A2E', 'ink', 0);
    paint(rectPts(-200, 840, W + 400, 400), { wash: '#B5835A', fill: '#8A5A36', fillOp: 80, tex: .5, ink: INK, sw: 1 });
    paint(ellPts(960, 900, 620, 60, 26), { wash: '#C8323A', fill: '#8A1418', fillOp: 60, tex: .6, ink: INK, sw: .8 });
    // the glow blooms on «одно»
    paint(ellPts(1000, 560, 420 + 260 * fade, 360 + 200 * fade, 22), { fill: '#FFF1C8', fillOp: 70 + 150 * fade, bleed: .3, tex: .2, border: .1, ink: null });
    const cx = 800, cy = 860, u = 48;
    clawd(cx, cy, u, { eyes: 'happy', mouth: 'cat', blush: true, rot: .14 + sway, aL: -.5, aR: -.7 });
    // the phone, cheek to cheek, rocking with him; its screen lights up brighter on «одно»
    const px = cx + 250 + Math.sin(t * 2.4) * 10, py = cy - 250 + Math.abs(Math.sin(t * 2.4)) * 6;
    push(); translate(px, py); rotate(-.08 + sway * .6); translate(-px, -py);
    b08_phone(px, py, 250, (x, y, w, h) => { b08_appIcon(x, y, w, h, t); if (fade > .02) paint(rectPts(x, y, w, h), { wash: '#FFFFFF', washOp: 200 * fade, ink: null }); });
    pop();
    if (fade > .05) for (let i = 0; i < 10; i++) {
      const a = i / 10 * TAU + .3, d = 300 + 140 * fade, s = 26 * Math.sin(frac(t * 1.5 + i * .1) * Math.PI) * fade;
      if (s > 2) paint(starPts(px + Math.cos(a) * d * .8, py + Math.sin(a) * d, s, .3), { wash: '#FFE38A', ink: INK, sw: .5 });
    }
    for (const [hx, hy] of [[px - 125, py - 40], [px + 118, py + 60]]) paint(rrPts(hx - 36, hy - 28, 72, 56, 22), { wash: PAL.clay, fill: PAL.clayDk, fillOp: 60, ink: INK, sw: .9 });
    for (let k = 0; k < HUG_B.length; k++) {
      const age = t - HUG_B[k]; if (age < 0 || age > 1.4) continue;
      const f = age / 1.4, hx = 980 + (hash(k * 3.3 + 1) - .5) * 1000, hy = 400 - f * 300;
      paint(heartPts(hx, hy, 44 * (1 - f * .4) * backOut(Math.min(1, age * 4))), { wash: '#E2476E', washOp: 255 * (1 - f), fill: PAL.rose, fillOp: 80, ink: f < .7 ? INK : null, sw: .6 });
    }
    camEnd();
    flash(.45 * fade * (t > ONE ? 1 : 0), '#FFF6D8');
  }

  // ---------- 175.55 the app: empty diary, the finger taps «+» on «давно» ----------
  function shotApp(t, lt) {
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#E8B488', fill: '#C98A5E', fillOp: 70, tex: .5, ink: null });
    const tapK = hitK(t, [TAP], .12), [sx, sy] = shakeXY(t, 6 * tapK);
    camBegin(960 + sx, 480 + sy - lt * 6, 1 + lt * .025 + .03 * tapK, -.03);
    paint(ellPts(960, 480, 700, 560, 20), { fill: '#FFE9C0', fillOp: 110, bleed: .3, tex: .2, ink: null });
    b08_phone(960, 520, 560, (x, y, w, h) => {
      paint(rectPts(x, y + 30, w, 110), { wash: APP, fill: APP_DK, fillOp: 50, tex: .4, ink: null });
      letter('ТРЕКЕР КАЛОРИЙ', x + w / 2, y + 88, 42, '#FFFFFF', { font: ruFont(42), ink: false });
      // the ring gauge: 0 of 2000
      const gx = x + w / 2, gy = y + 250;
      paint(ellPts(gx, gy, 88, 88, 26), { ink: '#DDD5C5', sw: 3 });
      letter('0', gx, gy - 12, 60, INK, { font: ruFont(60), ink: false });
      letter('из 2000 ккал', gx, gy + 32, 18, '#8A8480', { font: ruFont(18), ink: false });   // inside the 88-px ring
      ['Завтрак', 'Обед', 'Ужин'].forEach((m, i) => {
        const ry = y + 380 + i * 82;
        paint(rrPts(x + 30, ry, w - 60, 64, 14), { wash: '#F1EBDF', ink: '#CFC6B4', sw: .5 });
        letter(m, x + 56, ry + 32, 28, INK, { font: ruFont(28), align: 'left', ink: false });
        letter('пусто', x + w - 56, ry + 32, 24, '#A8A098', { font: ruFont(24), align: 'right', ink: false });
      });
      // the big «+», squished by the tap, then a ripple and «подключаем…»
      const bx = x + w / 2, by = y + 640, br = 62 * (1 - .18 * tapK), age = t - TAP;
      if (age > 0 && age < .5) paint(ellPts(bx, by, 62 + age * 260, 62 + age * 260, 24), { ink: PLUS, sw: 2.5 * (1 - age * 2) + .2 });
      paint(ellPts(bx, by + 8, br, br, 24), { wash: '#B8420E', ink: null });
      paint(ellPts(bx, by, br, br, 24), { wash: PLUS, fill: '#FFB07A', fillOp: 90, tex: .3, ink: INK, sw: 1 });
      letter('+', bx, by - 4, 96 * (1 - .18 * tapK), '#FFFFFF', { font: ruFont(96 * (1 - .18 * tapK)), ink: false });
      if (age > .12) {
        const dots = '.'.repeat(1 + Math.floor(age * 8) % 3);
        letter('подключаем 100 000 GPU' + dots, bx, by + 104, 22, APP_DK, { font: ruFont(22), ink: false, pop: (age - .12) * 6 });
      }
    });
    flushLetters();                                                                // the phone's lettering goes under the finger
    // the clay finger: drifts in, hovers, pokes on «давно»
    const hover = Math.sin(t * 7) * 10, press = kf(t, [[TAP - .2, 0], [TAP, 1], [TAP + .16, .85], [TAP + .4, 0]], ease);
    const come = easeOut(seg(t, S2, 176.4)), fx = lerp(1450, 1030, come) - press * 50, fy = lerp(1250, 800, come) - press * 110 + (1 - press) * hover;
    push(); translate(fx, fy); rotate(-.55);
    paint(rrPts(-46, -40, 92, 420, 44), { wash: PAL.clay, fill: PAL.clayDk, fillOp: 60, tex: .5, ink: INK, sw: 1.1 });
    paint(rrPts(-28, -26, 56, 60, 22), { wash: '#F2A283', washOp: 200, ink: null });                               // nail-ish highlight
    inkLine([[-30, 90], [30, 96]], .8, PAL.clayDk, 'inkfine', .3); inkLine([[-30, 200], [30, 206]], .8, PAL.clayDk, 'inkfine', .3);
    pop();
    camEnd();
    sfx('ТЫК!', 1370, 640, 90, PLUS, t - TAP, { life: .45, rot: .12, font: ruFont(90), stroke: '#FFFFFF' });
  }

  // ---------- 177.88 pull back: a whole data centre wired into the phone ----------
  const S3_HITS = [178.221, 179.68], PB = S3 + .76, GP = 179.0;   // the 178.22 downbeat snare, the 179.68 kick; pull-back done; «весь» 179.0
  function shotGPUs(t, lt) {
    const heat = .15 + .6 * seg(t, S3 + .12, S4 - .1), hk = hitK(t, S3_HITS, .15), pb = pulse(t, 7);
    const z = kf(t, [[S3, 2.8], [PB, 1.25], [S4, 1.08]], easeOut) * (1 + .03 * pb + .05 * hk);
    const [sx, sy] = shakeXY(t, 4 + 10 * hk);
    camBegin(960 + sx, kf(t, [[S3, 800], [PB, 580], [S4, 560]], easeOut) + sy, z);
    dataCenter(t, { heat, n: 7, seed: 3 });
    // GPU cards hanging in the air on both sides (the sea goes on), fans spinning
    for (let i = 0; i < 6; i++) {
      const s = i % 2 ? 1 : -1, row = Math.floor(i / 2), gx = 960 + s * (560 + row * 90), gy = 220 + row * 190 + Math.sin(t * 2 + i) * 8;
      gpuCard(gx, gy, .7 - row * .1, t, { rot: s * (.12 + row * .05), glow: .3 + .5 * pb });
    }
    // fat cables from the racks converge on the phone
    const px = 960, py = 790;
    for (let i = 0; i < 9; i++) {
      const s = i < 4 ? -1 : i > 4 ? 1 : 0, ex = 960 + (i - 4) * 250, ey = i === 4 ? 360 : 160 + Math.abs(i - 4) * 40;
      inkLine([[ex, ey], [lerp(ex, px, .5), lerp(ey, py, .3) + 120], [px + (i - 4) * 12, py - 40]], 3.2, ['#2E5BFF', '#D8262A', '#2FBF71', '#FFC53D'][i % 4], 'ink', .6);
    }
    for (const s of [-1, 1]) cooler(960 + s * 690, 820, 120, t, { speed: 6 + 6 * heat, howl: .5 + .5 * pb });
    // the little table + the phone on it, filming the plate
    paint(ellPts(960, 930, 260, 34, 20), { fill: '#000', fillOp: 80, bleed: .2, ink: null });
    paint(rectPts(760, 880, 400, 24, 1), { wash: '#8A6440', ink: INK, sw: .7 });
    paint(ellPts(1060, 874, 70, 14, 16), { wash: '#FFFFFF', ink: INK, sw: .6 });
    paint(ellPts(1060, 866, 36, 26, 14).filter(p => p[1] <= 866).concat([[1024, 866]]), { wash: '#D9953F', ink: INK, sw: .5 });
    paint(ellPts(1060, 842, 20, 8, 10), { wash: MAYO_C, ink: INK, sw: .4 });
    b08_phone(px, py, 80, (x, y, w, h) => {
      paint(rectPts(x, y, w, h), { wash: '#DDEAF2', ink: null });
      paint(ellPts(x + w / 2, y + h * .55, w * .34, w * .26, 12).filter(p => p[1] <= y + h * .55), { wash: '#D9953F', ink: INK, sw: .3 });
      paint(ellPts(x + w / 2, y + h * .45, w * .2, w * .09, 10), { wash: MAYO_C, ink: null });
    }, { shadow: false });
    clawd(700, 904, 7, { eyes: 'look', lookX: 1, mouth: 'o', aR: 1.1, noShadow: true });
    camEnd();
    // screen-space HUD: counter, the crawling progress bar, the slogan
    if (t >= S3 + .15) {
      const k = backOut((t - S3 - .15) / .2);
      push(); translate(960, 120); scale(k); translate(-960, -120);
      counter(860, 120, 92, 100000, { col: '#48E08A' });
      pop();
      letter('GPU', 960 + 330 * k, 120, 76 * k, '#48E08A', { font: ruFont(76 * k), ink: false });
    }
    if (t >= PB) {
      const p = .002 + .018 * seg(t, PB, S4 - .1), bx = 560, by = 850, bw = 800;
      paint(rrPts(bx - 20, by - 70, bw + 40, 120, 20), { wash: TK.soot, washOp: 220, ink: TK.cream, sw: .8 });
      letter('АНАЛИЗ ФОТО' + '.'.repeat(1 + Math.floor(t * 4) % 3), bx, by - 34, 34, TK.cream, { font: ruFont(34), align: 'left', ink: false });
      letter((p * 100).toFixed(1) + '%', bx + bw, by - 34, 34, TK.yellow, { font: ruFont(34), align: 'right', ink: false });
      paint(rrPts(bx, by, bw, 26, 8), { wash: '#2B2F36', ink: TK.cream, sw: .6 });
      paint(rrPts(bx + 4, by + 4, Math.max(14, bw * p), 18, 6), { wash: TK.green, ink: null });
    }
    if (t >= GP) punkText('ВЕСЬ МИРОВОЙ ПРОГРЕСС', 960, 290, 60, t, GP, { step: .025 });
    flash(.35 * hitK(t, [179.68], .1), '#FFF1C8');
  }

  // ---------- 180.64 the phone camera on a bun with a fat blob of mayo; AI label on «майонез»; 182.76 dive in ----------
  const DX = 960, DY = 445, DR = 118;                                               // the mayo blob (world)
  const b08_blob = () => { const p = []; for (let q = 0; q < 40; q++) { const a = q / 40 * TAU, up = Math.exp(-Math.pow(Math.atan2(Math.sin(a + Math.PI / 2), Math.cos(a + Math.PI / 2)) / .3, 2)), dn = Math.max(0, Math.sin(a)) * (.25 + .3 * Math.max(0, Math.sin(a * 5 + 1))); p.push([DX + Math.cos(a) * DR * 1.3, DY + Math.sin(a) * DR * .62 - up * DR * .75 + dn * DR]); } return p; };
  function b08_bun(inkS) {
    // side view: the dome, a darker base, sesame; the blob sits on top, drips down the sides
    const dome = []; for (let q = 0; q <= 24; q++) { const a = Math.PI + q / 24 * Math.PI; dome.push([960 + Math.cos(a) * 270, 700 + Math.sin(a) * 250]); }
    dome.push([1250, 730], [670, 730]);
    paint(dome, { wash: '#D9953F', ink: INK, sw: 1.2 * inkS });
    paint(ellPts(960, 715, 262, 26, 20), { wash: '#A8642A', washOp: 200, ink: null });
    paint(ellPts(880, 560, 150, 70, 18, 0, -.2), { wash: '#F2C27A', washOp: 170, ink: null });
    for (let i = 0; i < 14; i++) { const a = Math.PI * (1.08 + .84 * hash(i * 2.3)), r = 150 + 95 * hash(i + 7); paint(ellPts(960 + Math.cos(a) * r * 1.05, 700 + Math.sin(a) * r * .95, 9, 5, 8, 0, a), { wash: '#FFF3D6', ink: null }); }
  }
  // fills in world space; the outline + swirl go through toS in screen space (p5.brush drops strokes at deep zoom, leaving a dab)
  const SWIRL = [[DX - DR * .55, DY - DR * .1], [DX - DR * .1, DY - DR * .45], [DX + DR * .1, DY - DR * .95], [DX - DR * .05, DY - DR * 1.25]];
  function b08_mayoInk(toS) {
    paint(b08_blob().map(p => toS(...p)), { ink: INK, sw: 1.3 });
    inkLine(SWIRL.map(p => toS(...p)), 1.4, '#C9B27A', 'ink', .6);
  }
  function b08_mayoBlob(z) {
    paint(b08_blob().map(([x, y]) => [x + 6, y + 10]), { wash: MAYO_SH, ink: null });
    paint(b08_blob(), { wash: '#FBF3DC', ink: null });
    paint(ellPts(DX, DY - DR * .2, DR * .9, DR * .35, 20), { wash: '#FFFEFA', ink: null });
    paint(ellPts(DX - DR * .5, DY - DR * .28, DR * .32, DR * .12, 14, 0, -.4), { wash: '#FFFFFF', ink: null });
    paint(ellPts(DX + DR * .55, DY - DR * .05, DR * .14, DR * .06, 10, 0, -.3), { wash: '#FFFFFF', ink: null });
    paint(ellPts(DX + DR * .05, DY - DR * .85, DR * .07, DR * .1, 8), { wash: '#FFFFFF', ink: null });
  }
  function b08_camBun(t) {
    const c = kf(t, [[S4, [960, 640, 1.0]], [181.4, [960, 580, 1.3]], [DIVE, [960, 530, 1.5]]], ease);
    if (t < DIVE) return c;
    const u = t - DIVE, e = ease(seg(t, DIVE, DIVE + .5));
    return [960, lerp(530, DY - 10, e), Math.min(70, 1.5 * Math.exp(Math.pow(u, 1.5) * 6))];
  }
  function shotPlate(t, lt) {
    const [cx, cy, z] = b08_camBun(t), hk = hitK(t, [181.463, 182.422], .12), [sx, sy] = shakeXY(t, 4 * hk), inkS = Math.min(1, 1.8 / z), dv = seg(t, DIVE, S5);
    const S2X = (x, y) => [960 + (x - cx) * z, 540 + (y - cy) * z];
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#E9D3B0', ink: null });
    camBegin(cx + sx / z, cy + sy / z, z);
    if (z < 14) {
      paint(ellPts(600, 250, 520, 380, 20), { fill: '#FFF1C8', fillOp: 90, bleed: .3, tex: .2, ink: null });          // kitchen window light
      paint(rectPts(-800, 720, 3400, 1200), { wash: '#B5835A', ink: INK, sw: inkS });                                // table
      for (let i = 0; i < 6; i++) inkLine([[-800, 780 + i * 60], [2600, 790 + i * 60]], .6 * inkS, '#8A5A36', 'inkfine', .3);
      paint(ellPts(960, 735, 400, 58, 28), { wash: '#FFFFFF', ink: INK, sw: inkS });                               // plate
      paint(ellPts(960, 735, 300, 38, 24), { wash: '#EEF2F5', ink: null });
      b08_bun(inkS);
    }
    b08_mayoBlob(z);
    camEnd();
    b08_mayoInk((x, y) => { const [a, b] = S2X(x, y); return [a - sx, b - sy]; });
    // the camera app (screen space): the phone body frames the view, shutter, modes, focus square
    const sb = 1 + 3 * easeIn(seg(t, DIVE, DIVE + .7)), uiK = 1 - seg(t, DIVE, DIVE + .3);
    const X0 = 960 - 860 * sb, X1 = 960 + 860 * sb, Y0 = 470 - 430 * sb, Y1 = 470 + 430 * sb, BZ = '#17161B';
    if (sb < 3.9) {
      for (const r of [[-100, -100, W + 200, Y0 + 100], [-100, Y1, W + 200, 1400], [-100, -100, X0 + 100, 1400], [X1, -100, 900, 1400]]) paint(rectPts(r[0], r[1], r[2], r[3]), { wash: BZ, ink: null });
      paint(rrPts(X0, Y0, X1 - X0, Y1 - Y0, 60 * sb), { ink: '#3A3840', sw: 2.4 });
      for (const [qx, qy] of [[X0, Y0], [X1, Y0], [X0, Y1], [X1, Y1]]) paint([[qx, qy], [qx + (qx < 960 ? 60 : -60) * sb, qy], [qx, qy + (qy < 470 ? 60 : -60) * sb]], { wash: BZ, ink: null });
    }
    if (uiK > .02) {
      paint(rectPts(X1 - 190, Y0, 190, Y1 - Y0), { wash: '#000', washOp: 110 * uiK, ink: null });
      const shx = X1 - 95, shy = 470, press = hitK(t, [MAYO], .15);
      paint(ellPts(shx, shy, 58, 58, 24), { ink: '#FFFFFF', sw: 2 * uiK });
      paint(ellPts(shx, shy, 46 * (1 - .15 * press), 46 * (1 - .15 * press), 24), { wash: '#FFFFFF', washOp: 255 * uiK, ink: null });
      letter('ФОТО', 960, Y1 - 40, 30, '#FFD60A', { font: ruFont(30), ink: false, alpha: uiK });
      letter('ВИДЕО', 780, Y1 - 40, 26, '#FFFFFF', { font: ruFont(26), ink: false, alpha: uiK * .8 });
      letter('ПОРТРЕТ', 1150, Y1 - 40, 26, '#FFFFFF', { font: ruFont(26), ink: false, alpha: uiK * .8 });
      letter('AI · трекер калорий', X0 + 40, Y0 + 44, 26, '#FFD60A', { font: ruFont(26), align: 'left', ink: false, alpha: uiK });
      letter('1×', 960, Y1 - 100, 24, '#FFD60A', { font: ruFont(24), ink: false, alpha: uiK });
      // the yellow focus square hunts, then locks on the mayo
      const lock = ease(seg(t, S4 + .15, 181.3)), [fx, fy] = S2X(DX, DY - 20), hunt = (1 - lock);
      const qx = fx + Math.sin(t * 9) * 120 * hunt, qy = fy + 140 * hunt + Math.cos(t * 7) * 60 * hunt, qs = lerp(220, DR * z * 1.5, lock) * (1 + .1 * Math.exp(-(t - 181.3) * 10) * (t > 181.3));
      const fc = '#FFD60A';
      for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]])
        inkLine([[qx + dx * qs, qy + dy * qs * .7 - dy * 40], [qx + dx * qs, qy + dy * qs * .7], [qx + dx * qs - dx * 40, qy + dy * qs * .7]], 2.2 * uiK, fc, 'ink', 0);
      // on «майонез»: the tracker box around the whole bun and the big deadpan label
      const ck = (t >= MAYO ? backOut((t - MAYO) / .22) : 0) * uiK;
      if (ck > .02) {
        const [ax, ay0] = S2X(680, 330), [bx2, by0] = S2X(1240, 740);
        const ay = Math.max(ay0, 180 + 95 * ck + 14), by2 = Math.min(by0, Y1 - 125);   // clear of the label plate and the «1×»/modes row
        paint(rectPts(ax, ay, bx2 - ax, by2 - ay), { ink: fc, sw: 2 * ck });
        push(); translate(960, 180); scale(ck); rotate(-.02);
        paint(rrPts(-470, -95, 940, 190, 26), { wash: fc, ink: INK, sw: 1.3 });
        pop();
        letter('БУЛКА С МАЙОНЕЗОМ', 960, 180 - 38 * ck, 62 * ck, INK, { font: ruFont(62 * ck), ink: false, rot: -.02 });
        letter('9999 ккал', 960, 180 + 44 * ck, 58 * ck, '#D8262A', { font: ruFont(58 * ck), ink: false, rot: -.02 });
      }
    }
    flash(.5 * hitK(t, [MAYO], .08), '#FFFFFF');                                    // shutter blink
    if (dv > 0) for (let i = 0; i < 22; i++) {
      const a = i / 22 * TAU + hash(i) * .2, r0 = 380 + hash(i + Math.floor(t * 12)) * 300;
      inkLine([[960 + Math.cos(a) * r0, 540 + Math.sin(a) * r0 * .7], [960 + Math.cos(a) * (r0 + 300 * dv + 80), 540 + Math.sin(a) * (r0 + 300 * dv + 80) * .7]], 1.2, '#C9B27A', 'inkfine', 0);
    }
    if (t > DIVE) flushLetters(), flash(ease(seg(t, S5 - .25, S5)), CREAM);
  }

  // ---------- 183.41 inside the mayonnaise: a creamy tunnel, faster on every beat ----------
  const TUN_B = beatsIn(S5 + .1, END);                                             // 184.06 184.71 185.35 186.00 186.65
  const b08_phase = t => { const u = t - S5; return 1.2 * u + .35 * u * u + TUN_B.reduce((a, b) => a + .7 * easeOut(clamp((t - b) / .18)), 0); };
  const BANDS = ['#FFFDF6', '#E8CF98', '#FFF6DE', '#DCBF84'];
  function shotTunnel(t, lt) {
    const ph = b08_phase(t), sp = 1.2 + .7 * lt + 4 * hitK(t, TUN_B, .2), rot = ph * .35, bk = hitK(t, TUN_B, .15);
    const [sx, sy] = shakeXY(t, 3 + 8 * bk), wob = k => [Math.sin(k * .8 + t * 1.3) * 70, Math.cos(k * .6 + t * 1.1) * 50];
    // rings at depths d = (k - ph) / 2; nearest (largest) first, the background is the ring just passed
    const k0 = Math.floor(ph) + 1, rings = [];
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: BANDS[(((k0 - 1) % 4) + 4) % 4], ink: null });
    for (let k = k0; k < k0 + 16; k++) { const d = (k - ph) * .5; if (d > .06) rings.push([k, d]); }
    for (const [k, d] of rings) {
      const r = 420 / d, [ox, oy] = wob(k), cx = 960 + sx + ox * (1 - 1 / (1 + d)), cy = 520 + sy + oy * (1 - 1 / (1 + d));
      if (r > 3000) continue;
      paint(ellPts(cx, cy, r * 1.25, r, 30, 0, rot + k * .3), { wash: BANDS[((k % 4) + 4) % 4], fill: '#C9A868', fillOp: d < 1 ? 40 : 70, tex: .4, border: .6, ink: r < 1400 ? '#B89A5E' : null, sw: clamp(r / 500, .4, 1.4) });
      if (r > 60) inkLine(ellPts(cx, cy, r * 1.25 * .96, r * .96, 14, 0, rot + k * .3).slice(1, 6), clamp(r / 300, .4, 2.2), '#FFFFFF', 'ink', .5);
    }
    // the bright vanishing point, growing to the white-out
    const out = ease(seg(t, 186.11, END - .05));
    paint(ellPts(960 + sx, 520 + sy, 90 + 900 * out, 70 + 700 * out, 22), { fill: '#FFFFFF', fillOp: 160 + 90 * out, bleed: .3, tex: .2, border: .1, ink: null });
    // cream swirls spiralling in
    for (let arm = 0; arm < 4; arm++) {
      const pts = []; for (let q = 0; q <= 14; q++) { const d = .35 + q * .45, a = arm * TAU / 4 + d * .9 - rot * 2, r = 520 / d; pts.push([960 + Math.cos(a) * r * 1.25, 520 + Math.sin(a) * r]); }
      inkLine(pts, 1.6, arm % 2 ? '#D9C08A' : '#FFFFFF', 'ink', .6);
    }
    // speed lines, more with speed
    const nl = Math.round(8 + sp * 3);
    for (let i = 0; i < nl; i++) {
      const a = hash(i * 7.1 + Math.floor(t * 12)) * TAU, r0 = 250 + hash(i + Math.floor(t * 12) * 3) * 400, r1 = r0 + 180 + sp * 60;
      inkLine([[960 + Math.cos(a) * r0 * 1.2, 520 + Math.sin(a) * r0], [960 + Math.cos(a) * r1 * 1.2, 520 + Math.sin(a) * r1]], .9, '#FFFFFF', 'inkfine', 0);
    }
    // things flying past: tokens, eggs, a «9999 ккал» label
    for (let i = 0; i < 7; i++) {
      const d = 1 - frac(ph * .5 + i / 7 + hash(i) * .1), a = hash(i * 3.7) * TAU, sc = 1 / Math.max(.12, d), r = 150 * sc;
      const x = 960 + Math.cos(a) * r * 1.3, y = 520 + Math.sin(a) * r, s = 22 * sc;
      if (s > 150 || d > .95) continue;
      if (i % 3 === 0) token(x, y, Math.min(s, 21), { rot: t * 3 + i });
      else if (i % 3 === 1) { paint(ellPts(x, y, s * 1.1, s * 1.35, 14, 0, t * 2 + i), { wash: '#FFFFFF', ink: INK, sw: .6 }); paint(ellPts(x, y + s * .1, s * .5, s * .5, 10), { wash: '#FFC53D', ink: null }); }
      else letter('9999 ккал', x, y, s * .9, PLUS, { font: ruFont(s * .9), rot: a, ink: false, stroke: '#FFFFFF' });
    }
    // Clawd dives ahead of the camera, spinning, delighted
    const cu = 22 + 4 * Math.sin(t * 2), cr = t * 2.2;
    push(); translate(960 + Math.sin(t * 1.7) * 90, 540 + Math.cos(t * 1.3) * 50); rotate(cr);
    clawd(0, 40, cu, { eyes: 'spark', mouth: 'grin', aL: 2.2, aR: 2.2, noShadow: true });
    pop();
    flushLetters();
    if (t < S5 + .3) flash(1 - ease(seg(t, S5, S5 + .3)), CREAM);
    flash(ease(seg(t, 186.66, END - .06)), CREAM);                                 // full cream by the cut to a09
  }

  chapter('mayo', S1, END, [[S1, shotHug], [S2, shotApp], [S3, shotGPUs], [S4, shotPlate], [S5, shotTunnel]], { real: true });
})();
