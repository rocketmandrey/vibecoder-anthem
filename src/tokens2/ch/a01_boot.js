// a01_boot.js: «Жги токены» v2, chapter 1 "boot" (0–20.1), the intro (no vocals).
// 0–2.93 the dark: Clawd scrapes a long match along a press bed's hazard strip; three scrapes on the three
// hits (0.2 huge, 0.86, 1.66), each spark shower flashes the silhouette of ЗАВОД ТОКЕНОВ out of the black; the third catches.
// 2.93 the flame lights a single token on the bed; the camera pulls back: ПРЕСС №1 looms above it. 4.86 the ram slams →
// «ЖГИ ТОКЕНЫ» over the big burning token with rays and embers; side presses slam on 5.51 / 6.15.
// 7.0 the vigil: a row of tokens on a stopped conveyor lights outward in pairs (on beats); 10.99 the belt lurches, sodium
// lamps flicker on, sirens turn; the camera rides with the centre token down the line through the build (silhouette presses
// slam on the beats), the belt halts under the giant press; 16.92 SLAM, the big «ЖГИ ТОКЕНЫ»; the camera pushes into the
// roaring flame to a white-hot whiteout → glitchCut at 20.1 into Clawd's hallway.
(() => {
  const INK = PAL.ink, C = A2;
  // beat grid from assets/tokens2/beats.npy (intro part)
  const a01_BEATS = [0.21, 0.7, 1.18, 1.67, 2.16, 2.67, 3.25, 3.76, 4.27, 4.88, 5.36, 5.85, 6.34, 6.83, 7.31, 7.78, 8.27, 8.75, 9.24, 9.71,
    10.19, 10.68, 11.17, 11.66, 12.14, 12.63, 13.1, 13.58, 14.07, 14.56, 15.05, 15.53, 16.0, 16.49, 16.93, 17.44, 17.93, 18.41, 18.9, 19.39, 19.88];
  const SCRAPES = [0.2, 0.86, 1.66], T_IGN = 2.93, T_T1 = 4.86, T_GO = 10.99, T_T2 = 16.92, END = 20.1;
  const SIL = [12.14, 13.1, 14.07, 14.56, 15.05, 15.53, 16.0, 16.49];                       // build: silhouette presses slam on beats
  const PAIRS = [7.31, 8.27, 9.24, 10.19];                                                   // vigil: pairs light outward

  // ---------- helpers ----------
  // darkness outside a soft ellipse (screen space)
  function a01_vig(cx, cy, r, op = 120, layers = 3) {
    for (let l = 0; l < layers; l++) {
      const rr = r * (1 + l * .4), pts = [[-100, cy], [-100, -100], [W + 100, -100], [W + 100, H + 100], [-100, H + 100], [-100, cy]];
      for (let i = 0; i <= 28; i++) { const a = Math.PI - i / 28 * TAU; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .8]); }
      paint(pts, { wash: '#0B0C0F', washOp: op, ink: null });
    }
  }
  function a01_embers(t, x0, x1, y0, n, seed = 0, rise = 700) {
    for (let i = 0; i < n; i++) {
      const p = frac(t * (.25 + hash(i + seed) * .3) + hash(i * 3 + seed)), x = lerp(x0, x1, hash(i * 7 + seed)) + Math.sin(t * 2 + i) * 30 * p;
      const y = y0 - p * rise, r = 3 + hash(i + 11 + seed) * 5 * (1 - p);
      paint(ellPts(x, y, r, r, 6), { wash: p < .5 ? C.hazard : C.sodium, washOp: 255 * (1 - p), ink: null });
    }
  }
  function a01_rays(cx, cy, t, n, op, len = 1600) {
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU + t * .07, w = .045 + .02 * (i % 2);
      paint([[cx, cy], [cx + Math.cos(a - w) * len, cy + Math.sin(a - w) * len], [cx + Math.cos(a + w) * len, cy + Math.sin(a + w) * len]], { wash: i % 2 ? C.sodium : C.hazard, washOp: op, ink: null });
    }
  }
  // a cheap belt-token flame: the kit's flame outline as three plain polygons (the curved kit fire vanished under some cameras)
  function a01_flame(x, y, w, h, t, seed, n = 3) {
    if (h < 4) return;
    paint(flamePts(x, y, w, h, t, seed, n), { wash: C.rust, fill: TK.emberDk, fillOp: 60, tex: .5, ink: TK.emberDk, sw: .6 });
    paint(flamePts(x, y, w * .74, h * .72, t + 3.1, seed + 11, Math.max(2, n - 1)), { wash: C.sodium, ink: null });
    paint(flamePts(x, y, w * .44, h * .42, t + 7.3, seed + 23, Math.max(2, n - 2)), { wash: C.hazard, ink: null });
  }
  // ram travel 0 (up) .. 1 (down) for a slam list, same envelope as the kit press
  function a01_ram(t, hits) {
    let last = -1e9, next = 1e9; for (const h of hits) { if (h <= t && h > last) last = h; if (h > t && h < next) next = h; }
    const age = t - last, down = next - t < .1 ? easeIn(1 - (next - t) / .1) : 0, up = age < .06 ? 1 : 1 - ease((age - .06) / .4);
    return Math.max(down, up);
  }
  // the far factory: a parallax band of silhouettes (screen space) lit from behind by sodium haze. off = scroll px, light 0..1
  function a01_sky(t, off, light, o = {}) {
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#101216', fill: C.gunDk, fillOp: 90, bleed: .1, tex: .6, border: .3, ink: null });
    if (light < .02) return;
    const hz = o.hy ?? 620;
    paint(ellPts(W / 2, hz, 1300, 360, 24), { wash: C.rust, washOp: 150 * light, fill: C.sodium, fillOp: 110 * light, bleed: .3, tex: .3, ink: null });
    paint(ellPts(W / 2, hz + 40, 900, 200, 20), { wash: C.sodium, washOp: 140 * light, fill: "#FFB35A", fillOp: 90 * light, bleed: .3, tex: .2, ink: null });
    const SIL_C = '#15171C', P = 1500, gs = o.gear ?? .08;
    for (let k = -1; k < 3; k++) {
      const bx = k * P - (((off % P) + P) % P), ph = Math.floor((off - bx) / P);
      // chimney pair with a smoke smear
      for (const [cx, cw, ch] of [[bx + 120, 90, 620], [bx + 250, 70, 520]]) {
        paint(rectPts(cx, hz - ch, cw, ch + 400), { wash: SIL_C, ink: null });
        paint(rectPts(cx - 10, hz - ch, cw + 20, 26), { wash: SIL_C, ink: null });
        paint(ellPts(cx + cw / 2 + 60 + Math.sin(t * .6 + k) * 20, hz - ch - 90, 140, 60, 12), { fill: '#3A3036', fillOp: 90 * light, bleed: .3, ink: null });
      }
      gear(bx + 560, hz - 150, 170, t, { col: SIL_C, hole: '#2A1E16', speed: gs * (k % 2 ? 1 : -1) });
      gear(bx + 760, hz - 40, 90, t, { col: SIL_C, hole: '#2A1E16', speed: -gs * 1.9 * (k % 2 ? 1 : -1), rot: .2 });
      // silhouette presses slam on the build beats
      for (let q = 0; q < 2; q++) {
        const px = bx + 980 + q * 260, pw = 190, ptop = hz - 470, j = ((k * 2 + q) % 2 + 2) % 2, hits = SIL.filter((_, m) => m % 2 === j);
        const s = a01_ram(t, hits), ry = ptop + 90 + s * 220;
        paint(rectPts(px, ptop, 34, 520), { wash: SIL_C, ink: null }); paint(rectPts(px + pw - 34, ptop, 34, 520), { wash: SIL_C, ink: null });
        paint(rectPts(px - 16, ptop, pw + 32, 70), { wash: SIL_C, ink: null });
        paint(rectPts(px + pw / 2 - 10, ptop + 60, 20, ry - ptop - 50), { wash: SIL_C, ink: null });
        paint(rectPts(px + 40, ry, pw - 80, 70), { wash: SIL_C, ink: null });
        paint(rectPts(px - 10, ptop + 380, pw + 20, 160), { wash: SIL_C, ink: null });
        const hk = hitK(t, hits, .16);
        if (hk > .05) glowAt(px + pw / 2, ptop + 380, 150 * (.5 + hk), C.hazard, 150 * hk);
      }
      // pipes + catwalk
      paint(rectPts(bx - 20, hz - 300, P + 40, 18), { wash: SIL_C, ink: null });
      paint(rectPts(bx - 20, hz - 250, P + 40, 10), { wash: SIL_C, ink: null });
      for (let i = 0; i < 9; i++) paint(rectPts(bx + i * 170, hz - 300, 6, 60), { wash: SIL_C, ink: null });
    }
    paint(rectPts(-60, hz + 60, W + 120, H), { wash: SIL_C, ink: null });
  }
  // a factory lamp hanging at (x, y); on 0..1
  function a01_lamp(x, y, on, reach = 700) {
    inkLine([[x, y - 400], [x, y - 30]], 1, INK, 'inkfine', 0);
    if (on > .02) {
      paint([[x - 60, y + 8], [x + 60, y + 8], [x + 330, y + reach], [x - 330, y + reach]], { wash: '#FFC37A', washOp: 45 * on, fill: C.sodium, fillOp: 40 * on, bleed: .3, tex: .2, border: .1, ink: null });
      glowAt(x, y + 20, 110, C.sodium, 120 * on);
    }
    paint([[x - 24, y - 34], [x + 24, y - 34], [x + 70, y + 10], [x - 70, y + 10]], { wash: C.steel, fill: C.gunDk, fillOp: 90, tex: .4, ink: INK, sw: .7 });
    paint(ellPts(x, y + 10, 34, 12, 12), { wash: on > .1 ? '#FFF1C8' : '#3A3A3A', ink: null });
  }

  // ---------- 0–4.86: the match in the dark → the first token burns ----------
  const P1 = { x: 680, y: 170, w: 560, h: 760 };                            // ПРЕСС №1: bed top ≈ 839, strike strip 889–930
  const TOK = [960, 777, 62];
  const U = 26, G = 990, L = 190, R = 2.2 * U + L, PY = G - 4.5 * U;
  function a01_head(t) {
    const X0 = 1010, X1 = 730, Y = 905;
    let hx = X0, hy = Y;
    for (let i = 0; i < SCRAPES.length; i++) {
      const s = SCRAPES[i]; if (t < s - .05) break;
      hx = lerp(X0, X1, easeOut(seg(t, s - .05, s + .09))); hy = Y;
      if (i + 1 < SCRAPES.length) { const r = seg(t, s + .25, SCRAPES[i + 1] - .1); hx = lerp(hx, X0, ease(r)); hy = Y - 30 * Math.sin(r * Math.PI); }
    }
    const lift = ease(seg(t, 1.85, 2.78)), back = ease(seg(t, 3.2, 3.9)), down = ease(seg(t, 4.3, 4.62));
    hx = lerp(hx, 946, lift); hy = lerp(hy, 716, lift) - Math.sin(lift * Math.PI) * 60;
    hx = lerp(hx, 1090, back); hy = lerp(hy, 770, back);
    hx = lerp(hx, 1150, down); hy = lerp(hy, 925, down);
    return [hx, hy];
  }
  function a01_sparks(x, y, age, seed, n, R0, dir = 1) {
    if (age < 0 || age > .5) return;
    const p = age / .5;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI * (.05 + hash(i + seed) * .55), sp = .35 + hash(i + seed + 7) * .9, d = R0 * sp * easeOut(p);
      const vx = Math.cos(a) * dir, vy = Math.sin(a), x1 = x + vx * d, y1 = y + vy * d + p * p * R0 * .9, len = 26 * (1 - p) + 6;
      inkLine([[x1, y1], [x1 - vx * len * 2, y1 - (vy + p * 1.6) * len * 1.5]], 2.6 * (1 - p) + .6, i % 3 ? C.hazard : '#FFF3C8', 'inkfine', 0);
    }
  }
  function a01_strike(t, lt) {
    const [hx, hy] = a01_head(t), lit = t >= SCRAPES[2] ? clamp((t - SCRAPES[2]) / .1) * (1 - seg(t, 3.9, 4.35)) : 0;
    const ia = t - T_IGN, on = ia >= 0, fk = on ? easeOut(clamp(ia / .35)) : 0;
    let E = 0; SCRAPES.forEach((s, i) => { if (t >= s) E += (i === 0 ? 1.6 : 1) * Math.exp(-(t - s) / (i === 0 ? .3 : .2)); });
    const light = clamp(E * .8 + lit * .15 + fk * .55);
    a01_sky(t, 0, light, { hy: 560 });
    // camera: close on the strike strip → follow the match up to the wick → pull back to the press
    const pb = ease(seg(t, 3.05, 4.62)), fol = ease(seg(t, 1.75, 2.85));
    let cx = lerp(870, 950, fol), cy = lerp(880, 742, fol), z = lerp(2.6 + lt * .05, 2.2, fol);
    cx = lerp(cx, 960, pb); cy = lerp(cy, 560, pb); z = lerp(z, 1, pb);
    const fall = seg(t, T_T1 - .1, T_T1), [sx0, sy0] = shakeXY(t, 18 * hitK(t, SCRAPES, .12) + 10 * fall);
    camBegin(cx + sx0 / z, cy + sy0 / z, z);
    // room: back wall + floor
    paint(rectPts(-300, 930, 2600, 500), { wash: C.gunmetal, fill: C.gunDk, fillOp: 100, tex: .6, border: .3, ink: null });
    inkLine([[-300, 931], [2300, 931]], 1, INK, 'inkfine', 0);
    if (fk > .02) paint(ellPts(TOK[0], 960, 520 * fk, 40, 18), { fill: C.sodium, fillOp: 90 * fk, bleed: .3, ink: null });   // reflection on the floor
    const tokFire = () => {
      if (fk > .02) fire(TOK[0], TOK[1] + 30, 230, 360, t, { k: fk * (1 + .1 * Math.sin(t * 9)), seed: 7, cols: [C.rust, C.sodium, C.hazard] });
      token(TOK[0], TOK[1], TOK[2], { burn: on ? .22 * clamp(ia * 2) : 0, glow: on ? .45 : .1 });
    };
    if (t < T_T1 - .08) { press(P1.x, P1.y, P1.w, P1.h, t, [T_T1], { label: 'ПРЕСС №1', token: false, steam: false }); tokFire(); }
    else { tokFire(); press(P1.x, P1.y, P1.w, P1.h, t, [T_T1], { label: 'ПРЕСС №1', token: false, steam: false }); }
    // Clawd: the match is his left arm's hook; he steps so that the head sits at (hx, hy)
    const a = Math.asin(clamp((PY - hy) / R, -1, 1)), bx = hx + R * Math.cos(a) + 4.9 * U;
    const scared = t > 4.45, happy = on && !scared;
    clawd(bx, G, U, {
      seed: 2, walk: bx / 90, aL: a, aR: scared ? 1.3 : -.2, noShadow: true,
      eyes: scared ? 'scared' : happy ? 'happy' : 'look', lookX: -1, lookY: t < 1.8 ? .6 : -.4,
      mouth: scared ? 'O' : happy ? 'smile' : lit > .5 ? 'o' : 'flat',
      armL: (u, sw) => {
        paint(rectPts(0, -.16 * u, L, .32 * u), { wash: '#E8C07A', fill: '#B98A44', fillOp: 70, tex: .5, ink: INK, sw: sw * .5 });
        paint(ellPts(L, 0, .55 * u, .45 * u, 10), { wash: t >= SCRAPES[2] ? '#3A2222' : '#C8323A', ink: INK, sw: sw * .4 });
      },
    });
    // sparks off the strip on every scrape; the flame on the head once it catches
    SCRAPES.forEach((s, i) => { a01_sparks(lerp(1010, 730, .6), 905, t - s, 11 + i * 7, i === 0 ? 34 : 22, i === 0 ? 420 : 300, 1); });
    if (lit > .02) { glowAt(hx, hy - 30, 170, C.hazard, 110 * lit); fire(hx, hy + 6, 42, 110, t, { k: lit, seed: 3, n: 3, glow: false }); }
    if (t > 4.3 && t < 4.9) steam(hx, hy - 10, t, { k: .5 * (1 - seg(t, 4.3, 4.9)), len: 140, n: 3, col: '#8A8480' });   // the dead match smokes
    if (on && ia < .7) for (let i = 0; i < 16; i++) {                                                                   // ignition burst
      const q = clamp(ia / .7), ang = hash(i * 3.3) * TAU, d = 50 + q * (220 + hash(i) * 180);
      paint(ellPts(TOK[0] + Math.cos(ang) * d, TOK[1] - 60 + Math.sin(ang) * d * .7 - q * 60, 6 * (1 - q) + 2, 6 * (1 - q) + 2, 6), { wash: i % 2 ? C.hazard : C.sodium, ink: null });
    }
    const [lx, ly] = toScreen(on ? TOK[0] : hx, on ? TOK[1] - 60 : hy);
    camEnd();
    // the dark: opens with every spark shower, then with the fire
    flushLetters();
    const vr = on ? 420 + 900 * easeOut(clamp(ia / 1.6)) : 230 + 1100 * clamp(E) + 150 * lit;
    a01_vig(lx, ly, vr, on ? 90 : 150);
    SCRAPES.forEach((s, i) => sfx(i < 2 ? 'ЧИРК' : 'ФШШ!', lx + 230, ly - 170 - i * 20, i < 2 ? 74 : 110, i < 2 ? C.cream : C.hazard, t - s, { font: ruFont(i < 2 ? 74 : 110), life: .45, rot: -.12, ink: false }));
    flash(.2 * Math.exp(-(t - .2) * 9) * (t >= .2) + .2 * Math.exp(-ia * 8) * on + fall * .5, '#FFC27A');
  }

  // ---------- 4.86: «ЖГИ ТОКЕНЫ» over the burning token; side presses slam on 5.51 / 6.15 ----------
  const TT = [T_T1, 5.51, 6.15];
  function a01_title1(t, lt) {
    a01_sky(t, lt * 40, 1, { hy: 640 });
    const [sx, sy] = shakeXY(t, 16 * hitK(t, TT, .14));
    camBegin(960 + sx, 560 + sy, 1.02 + lt * .025);
    a01_rays(960, 640, t, 16, 26 + 20 * hitK(t, TT, .3));
    glowAt(960, 640, 720, C.sodium, 80);
    paint(rectPts(-200, 842, 2320, 400), { wash: C.gunmetal, fill: C.gunDk, fillOp: 100, tex: .6, ink: null });
    press(-80, 200, 380, 660, t, [5.51], { label: 'ПРЕСС 2', seed: 4 });
    press(1620, 200, 380, 660, t, [6.15], { label: 'ПРЕСС 3', seed: 8 });
    fire(960, 830, 640, 760, t, { k: 1 + .12 * hitK(t, TT, .25), seed: 21, n: 7, cols: [C.rust, C.sodium, C.hazard] });
    token(960, 700, 118, { burn: .3, glow: .6 });
    a01_embers(t, 260, 1660, 980, 34, 1, 900);
    camEnd();
    const k = 1 + .07 * hitK(t, [5.51, 6.15], .15);
    push(); translate(960, 225); scale(k); translate(-960, -225);
    stamp('ЖГИ ТОКЕНЫ', 960, 225, 138, t, T_T1, { col: C.hazard, rot: -.05, punch: 0 });
    pop();
    flash(.4 * Math.exp(-lt * 9), "#FFF1C8");
  }

  // ---------- 7.0–20.1: the vigil on the conveyor → the ride → the giant press → into the flame ----------
  const BY = 780, GAP = 170, X0 = -655, IC = 9, D = 3200, XP = 960 + D;    // token i sits at X0 + i*GAP + GAP/2 + scroll
  const a01_scroll = t => D * ease(seg(t, T_GO, 16.55));
  const a01_litAt = i => { const d = Math.abs(i - IC); return d === 0 ? 0 : d <= 4 ? PAIRS[d - 1] : T_GO; };
  function a01_line(t, lt) {
    const sc = a01_scroll(t), tokX = 960 + sc, go = t >= T_GO, build = seg(t, 12, T_T2);
    const lampOn = j => { const t0 = T_GO + (j % 5) * .09; if (t < t0) return 0; return t - t0 < .35 ? (hash(Math.floor(t * 24) + j * 7) > .45 ? 1 : .15) : 1; };
    // camera
    const stop = ease(seg(t, 15.9, 16.75)), push_ = easeIn(seg(t, 17.5, END)), rise = ease(seg(t, 17.2, 18.4));
    let cx = lerp(960, tokX + 240, ease(seg(t, T_GO, 11.9))), cy = 640, z = 1.3 + .08 * seg(t, 7, T_GO) + .17 * ease(seg(t, T_GO, 13.5));
    cx = lerp(cx, XP, stop); cy = lerp(cy, 470, stop); z = lerp(z, .86, stop);
    cy = lerp(cy, 480, rise); z = lerp(z, 1.6, push_);   // p5.brush drops polygons far off-canvas: keep the flame tips above ~-250 px
    const shake = 2 + 9 * build * build + 26 * hitK(t, [T_T2], .2) + 10 * hitK(t, [T_GO], .15) + 5 * hitK(t, SIL, .1) * go;
    const [shx, shy] = shakeXY(t, shake);
    const sky = go ? clamp((t - T_GO) / .5) : .12;
    a01_sky(t, (cx - 960) * .35, sky * (.7 + .3 * build), { hy: 600, gear: .08 + .5 * build });
    camBegin(cx + shx / z, cy + shy / z, z, Math.sin(t * 1.3) * .012 * build);
    // floor + hanging lamps + sign
    paint(rectPts(-800, 900, XP + 2600, 600), { wash: C.gunmetal, fill: C.gunDk, fillOp: 100, tex: .6, border: .3, ink: null });
    hazard(-800, 900, XP + 2600, 18);
    for (let j = 0; j < 12; j++) { const lx = 100 + j * 480; if (Math.abs(lx - cx) < 1500 / z + 400) a01_lamp(lx, 110, lampOn(j), 690); }
    if (Math.abs(2600 - cx) < 1900) {   // hung low and clear of the siren at 1850, so the z≈1.45 ride frames the whole sign (it used to be cut by the top edge)
      const on = lampOn(3), fl = on > .5 ? 1 : on;
      paint(rectPts(2190, 305, 820, 115, 3), { wash: '#15171C', ink: INK, sw: 1 });
      for (const sxp of [2250, 2950]) inkLine([[sxp, -300], [sxp, 305]], 1, INK, 'inkfine', 0);
      if (fl > .2) glowAt(2600, 362, 440, C.sodium, 70 * fl);
      letter('ЗАВОД ТОКЕНОВ', 2600, 364, 76, fl > .2 ? C.hazard : '#3A3A3A', { font: ruFont(76), ink: false });
    }
    for (const px of [1850, 3350]) if (Math.abs(px - cx) < 1800) {
      paint(rectPts(px - 18, 360, 36, 540), { wash: C.steel, fill: C.gunDk, fillOp: 80, tex: .4, ink: INK, sw: .7 });
      hazard(px - 18, 700, 36, 120);
      siren(px, 360, t, { on: go ? clamp((t - T_GO) / .3) : 0, speed: .9 + 1.2 * build, len: 700 });
    }
    // the belt + its tokens (lit outward in pairs, then all), crushed under the giant press after the slam
    const crushed = t >= T_T2;
    conveyor(X0, BY, XP + 1400 - X0, sc / 160, { speed: 160, gap: GAP, legs: 110, h: 40, items: [(ix, y, i) => {
      if ((crushed && Math.abs(ix - XP) < 330) || Math.abs(ix - cx) > W / 2 / z + 160) return;   // off-screen items cost (and p5.brush drops fills past a budget)
      const tl = a01_litAt(i), on = t >= tl, k = on ? easeOut(clamp((t - tl) / .3)) : 0, r = 56;
      if (on) a01_flame(ix, y - 18, r * 2.5, r * 4.2 * (1 + .25 * build) * k * (1 + .1 * Math.sin(t * 8 + i)), t, 60 + i * 5);
      token(ix, y - r, r, { glow: on ? .35 : 0 });
      if (on && t - tl < .45) a01_sparks(ix, y - r * 2, t - tl, i * 13, 10, 150, i < IC ? -1 : 1);
    }] });
    // the giant press at the end of the line: gauge climbs through the build; steam hisses; SLAM at 16.92
    if (Math.abs(XP - cx) < 2300) {
      const gx = XP - 450, gw = 900, gh = 980, gy = 830 - gh * .88;
      if (crushed) {                                                                            // the fused, minted slab + the roar
        const ag = t - T_T2, fk = easeOut(clamp(ag / .5));   // ponytail: p5.brush loses big/curved shapes far off-canvas, so the fire keeps its size and the camera does the growing
        a01_flame(XP, BY + 20, 620 * fk, 780 * fk * (1 + .1 * Math.sin(t * 9)), t, 31, 7);
        paint(ellPts(XP, BY + 6, 330, 30, 22), { wash: C.hazard, fill: C.sodium, fillOp: 120, tex: .3, ink: INK, sw: 1 });
        glowAt(XP, BY - 200, 700, C.sodium, 70);
      }
      press(gx, gy, gw, gh, t, [T_T2], { token: false, seed: 5 });
      if (!crushed) for (const sd of [-1, 1]) steam(XP + sd * 470, gy + 200, t, { dir: sd < 0 ? Math.PI + .3 : -.3, k: build, len: 320, n: 5, seed: sd * 5 });
      // pressure gauge on the left column
      const dx = gx + 58, dy = gy + 330, dr = 62, v = crushed ? 1 - seg(t, T_T2, 17.6) : build + .04 * Math.sin(t * 40) * build;
      paint(ellPts(dx, dy, dr, dr, 20), { wash: C.cream, ink: INK, sw: 1 });
      paint([[dx, dy], ...Array.from({ length: 7 }, (_, i) => { const q = lerp(-.4, .6, i / 6) * Math.PI; return [dx + Math.cos(q) * dr * .9, dy + Math.sin(q) * dr * .9]; })], { wash: '#D8262A', washOp: 200, ink: null });
      const na = lerp(-Math.PI * 1.2, Math.PI * .5, clamp(v));
      inkLine([[dx, dy], [dx + Math.cos(na) * dr * .8, dy + Math.sin(na) * dr * .8]], 2.4, INK, 'ink', 0);
      paint(ellPts(dx, dy, 8, 8, 8), { wash: INK, ink: null });
    }
    a01_embers(t, cx - 900, cx + 900, 950, go ? 26 : 12, 3, 800);
    camEnd();
    // speed streaks while the belt runs
    const v = (a01_scroll(t + .02) - a01_scroll(t)) / .02;
    if (v > 150 && !crushed) for (let i = 0; i < 14; i++) {
      const y = 140 + hash(i * 3.1) * 760, len = v * (.25 + hash(i) * .3), x = W + 200 - frac(t * (1.2 + hash(i + 4)) + hash(i + 9)) * (W + 400 + len);
      paint([[x, y], [x + len, y - 2], [x + len, y + 3], [x, y + 5]], { wash: i % 3 ? C.cream : C.hazard, washOp: clamp((v - 150) / 600) * 90, ink: null });
    }
    // the vigil darkness: only the flames until the lamps come on
    if (!go) {
      flushLetters();
      const lit = PAIRS.filter(p => t >= p).length;
      a01_vig(W / 2, 640, 260 + lit * 200, 110 - lit * 12, 2);
    }
    // stamp() slams in from 2.3×; cap the peak at 1.2× (the settled sign is ~1450 px wide) so the whole sign stays inside the frame
    const sa = t - T_T2, sk = sa < .12 ? lerp(2.3, 1, easeOut(sa / .12)) : 1;
    stamp('ЖГИ ТОКЕНЫ', 960, 205, 196 * Math.min(1, 1.2 / sk), t, T_T2, { col: C.hazard, rot: -.04, punch: .03 });
    flushLetters();
    flash(.75 * Math.exp(-(t - T_T2) * 6) * crushed, '#FFF1C8'); flash(.3 * Math.exp(-(t - T_GO) * 8) * go, '#FFB060');
    const inF = easeIn(seg(t, 18.6, 19.9));                                                            // into the flame: the tongues fill the frame
    if (inF > .02 && t < 19.88) { a01_flame(960, H + 120, 2100, 1350 * inF, t, 44, 5); a01_flame(960, H + 60, 1100, 1150 * inF, t + 1.7, 45, 4); }
    flash(.8 * easeIn(seg(t, 19.2, 19.85)), C.sodium);                                                // into the flame: orange …
    flash(.9 * easeIn(seg(t, 19.55, 20.02)), '#FFF6DE');                                               // … to white-hot
    glitchCut(t, END);
  }

  chapter('boot', 0, 20.1, [[0, a01_strike], [T_T1, a01_title1], [7.0, a01_line]]);
})();
