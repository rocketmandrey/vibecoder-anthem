// a09_capex.js: «Жги токены» v2 chapter 9 "capex" (180.85–197.9). The final chorus, a step up and faster.
// The change of meaning: the whole giant factory at full blast produces ONE single tiny checkmark ✓.
// 180.85 «Жги токены!» ×2: Clawd + CEO on top of the biggest press, fire behind, every press slams on the shouts →
// 183.76 «Пока лимит не обнулён»: the CEO throws the burn lever to ×2, the limit bar drains at double speed into the firebox →
// 185.68 «Доходы — потом! Прибыль — потом!»: the CEO feeds ДОХОДЫ and ПРИБЫЛЬ into the shredder, stamped «ПОТОМ» →
// 188.8 «AGI — скоро! CAPEX — сейчас!»: a dusty AGI billboard spins «СКОРО…», whip-pan to the chimney: CAPEX neon →
// 191.74 «Плюс процент к бенчмарку»: two presses push the chart's axis down so the +1% bar "grows" →
// 193.32 «плюс триста миллиардов»: the counter slams, strings twang, the camera pulls up: CEO, Clawd, the presses, the
// chimneys and the counter all hang on strings from the hands of faceless АКЦИОНЕРЫ in the clouds (token
// cufflinks, cigar). The puppets jerk on 194.34 / 194.66 / 194.97 / 195.62 → pull back further: the shareholders are
// puppets of an even bigger hand, which hangs from a tiny grey tag «+1% к бенчмарку» («ради этого»).
// 196.0 the picture turns out to be an old tube TV (scanlines, flicker) → 196.28 switch-off: collapse to a bright line,
// a shrinking dot, black (no «0 токенов» here: that belongs to the outro line) → hard cut at 197.9 to the outro.
(() => {
  const INK = PAL.ink;
  // R34 (EN reels): a 3:4 layout per shot inside the reels band, screen x 565–1355 (RU34 key [960, 540, 790]); no chapter shakes / punches
  const R = window.R34;
  // word stresses + strong hits of the final chorus (camera punches, character bounces)
  const ACC = [180.92, 181.72, 182.44, 183.0, 183.76, 184.73, 185.68, 186.12, 186.66, 187.48, 188.0, 188.8, 190.0, 190.72, 191.2,
    191.52, 192.01, 192.55, 193.19, 193.77, 194.34, 194.97, 195.62, 196.28, 196.94, 197.6];
  const acc = t => hitK(t, ACC, .13);
  // the weekly limit across the chapter: double speed, empty by the end
  const limitV = t => kf(t, [[180.85, .66], [183.76, .56], [185.68, .17], [196.0, .01]], x => x);

  // ---------- helpers ----------
  function a09_hall(t, o = {}) {
    paint(rectPts(-400, -300, W + 800, H + 600), { wash: A2.gunDk, ink: null });
    paint(rectPts(-400, -300, W + 800, 1140), { wash: A2.gunmetal, ink: null });
    paint(rectPts(-400, 520, W + 800, 320), { wash: '#15171B', washOp: 90, ink: null });
    for (let i = -1; i < 8; i++) {                                                    // girders + cross-bracing
      const x = -40 + i * 330;
      paint(rectPts(x, -300, 34, 1140), { wash: '#383D45', ink: INK, sw: .5 });
      inkLine([[x + 34, 120], [x + 330, 520]], .7, '#454B54', 'inkfine', 0);
      inkLine([[x + 330, 120], [x + 34, 520]], .7, '#454B54', 'inkfine', 0);
    }
    paint(rectPts(-400, 96, W + 800, 22), { wash: '#383D45', ink: INK, sw: .5 });
    for (let i = 0; i < 6; i++) {                                                     // sodium lamps
      const x = 160 + i * 320, fl = .75 + .25 * Math.sin(t * 31 + i * 2.3) * (hash(i + Math.floor(t * 12)) > .8 ? 1 : .2);
      paint(ellPts(x, 170, 190, 130, 18), { wash: A2.sodium, washOp: 45 * fl * (o.lamp ?? 1), ink: null });
      paint(rrPts(x - 34, 118, 68, 26, 10), { wash: '#FFD9A0', ink: INK, sw: .5 });
    }
    paint(rectPts(-400, 840, W + 800, 600), { wash: '#23262B', fill: A2.rust, fillOp: 40, tex: .6, ink: null });
    inkLine([[-400, 842], [W + 400, 842]], 1, INK, 'ink', 0);
  }
  // the chapter-long weekly-limit HUD (screen space), always draining, with a ×2 badge
  function a09_hud(t) {
    const v = limitV(t), x = R ? 620 : 40, y = R ? 80 : 64, bw = R ? 540 : 440;
    limitBar(x, y, bw, v, { h: 38, burn: .6 });
    const b = frac(t * 3) < .5;
    paint(rrPts(x + bw + 12, y - 4, 86, 46, 12), { wash: b ? A2.magenta : '#7A1466', ink: INK, sw: .6 });
    letter('×2', x + bw + 55, y + 19, 34, A2.cream, { font: ruFont(34), ink: false });
  }
  // a document page: title + a little rising line chart
  function a09_doc(cx, cy, w, h, rot, title, col) {
    const R = p => rotPts(p, cx, cy, rot), x = cx - w / 2, y = cy - h / 2;
    paint(R(rectPts(x, y, w, h, 1)), { wash: A2.cream, fill: '#D9CFB5', fillOp: 60, tex: .5, ink: INK, sw: .8 });
    paint(R(rectPts(x, y, w, h * .26)), { wash: col, ink: null });
    const pts = []; for (let i = 0; i <= 6; i++) pts.push([x + w * (.12 + i * .13), y + h * (.88 - i * .08 - (i % 2) * .05)]);
    inkLine(R(pts), 2.2, col, 'ink', .3);
    for (let i = 0; i < 3; i++) inkLine(R([[x + w * .1, y + h * (.42 + i * .1)], [x + w * .5, y + h * (.42 + i * .1)]]), .6, A2.steel, 'inkfine', 0);
    const [lx, ly] = R([[cx, y + h * .13]])[0];
    const fs = h * .17 * Math.min(1, w * .86 / textW(title, ruFont(h * .17)));   // «ПРИБЫЛЬ» fits the card's header band
    letter(title, lx, ly, fs, A2.cream, { font: ruFont(fs), rot, ink: false });
  }

  // ---------- 180.85 «Жги токены!» ×2: on top of the biggest press ----------
  const P_BIG = [180.92, 182.44, 183.0], P_L = [180.92, 181.72, 182.44, 183.0], P_R = [181.2, 181.72, 182.7, 183.3];
  function blast(t, lt) {
    if (R) return blastR(t, lt);
    const a = acc(t), [sx, sy] = shakeXY(t, 16 * a);
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: A2.gunDk, ink: null });        // the wide cam sees past the hall's top edge
    a09_hall(t);
    // wide: the whole big press with the two of them on top, the floor on fire below
    camBegin(960 + sx, 322 + sy - lt * 8, .78 + lt * .02 + a * .04);
    fire(960, 430, 1300, 380, t, { k: .95 + .35 * a, seed: 4, n: 7 });
    press(20, 380, 300, 460, t, P_L, { label: 'ПРЕСС 2', seed: 3 });
    press(1600, 380, 300, 460, t, P_R, { label: 'ПРЕСС 3', seed: 7 });
    siren(170, 334, t, { speed: 1.6, r: 30, len: 460 });
    siren(1750, 334, t + .3, { speed: -1.6, r: 30, len: 460, col: A2.magenta });
    const pr = press(560, 330, 800, 520, t, P_BIG, { label: 'ПРЕСС №1 · ПОЛНАЯ МОЩНОСТЬ', seed: 11 });
    // the two of them on the crossbeam, fists up, hopping on every slam
    const hop = -a * 1.6;
    clawd(720, 330, 21, { dy: hop, sq: a * .12, aL: 2.1, aR: 2.1, armL: fist(PAL.clay), armR: fist(PAL.clay), eyes: 'angry', mouth: 'o' });
    ceoClawd(1200, 330, 21, { dy: hop * .8, sq: a * .1, aL: 2.1, aR: .4, armL: fist(PAL.clay), eyes: 'happy', mouth: 'grin', click: a });
    fire(960, 940, 2300, 170, t, { k: .9 + .4 * a, seed: 17, n: 9 });                   // the floor burning under the press
    camEnd();
    punkText('ЖГИ ТОКЕНЫ!', 960, 168, 100, t, 180.92, { seed: 3 });
    if (t > 182.44) punkText('ЖГИ ТОКЕНЫ!', 960, 305, 120, t, 182.44, { seed: 9 });
    a09_hud(t);
    flash(pr.k * .25, '#FFE7B0');
    glitchCut(t, 180.85);
  }

  // 3:4: one big press filling the band, the two of them on its crossbeam, fire behind and below, the HUD on top
  function blastR(t, lt) {
    const a = acc(t);
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: A2.gunDk, ink: null });
    push(); translate(0, 140); a09_hall(t); pop();                                  // floor line at 980 under the press
    camBegin(960, 540 - lt * 4, 1);
    fire(960, 470, 760, 380, t, { k: .95 + .35 * a, seed: 4, n: 6 });
    siren(645, 430, t, { speed: 1.6, r: 26, len: 300 });
    siren(1275, 430, t + .3, { speed: -1.6, r: 26, len: 300, col: A2.magenta });
    const pr = press(640, 440, 640, 540, t, P_BIG, { label: 'ПРЕСС №1 · ПОЛНАЯ МОЩНОСТЬ', seed: 11 });
    const hop = -a * 1.6;
    clawd(770, 440, 20, { dy: hop, sq: a * .12, aL: 2.1, aR: 2.1, armL: fist(PAL.clay), armR: fist(PAL.clay), eyes: 'angry', mouth: 'o' });
    ceoClawd(1150, 440, 20, { dy: hop * .8, sq: a * .1, aL: 2.1, aR: .4, armL: fist(PAL.clay), eyes: 'happy', mouth: 'grin', click: a });
    fire(960, 1010, 1000, 150, t, { k: .9 + .4 * a, seed: 17, n: 7 });
    camEnd();
    punkText('ЖГИ ТОКЕНЫ!', 960, 168, 100, t, 180.92, { seed: 3 });
    a09_hud(t);
    flash(pr.k * .25, '#FFE7B0');
    glitchCut(t, 180.85);
  }

  // ---------- 183.76 «Пока лимит не обнулён»: the burn lever to ×2, the bar drains into the firebox ----------
  function drain(t, lt) {
    if (R) return drainR(t, lt);
    const a = acc(t), [sx, sy] = shakeXY(t, 10 * a), tL = 183.76, v = limitV(t);
    a09_hall(t, { lamp: .6 });
    camBegin(960 + sx, 540 + sy, 1.0 + lt * .02);
    // the firebox: flames boil out of an open pit, brick front wall
    fire(960, 760, 1150, 440, t, { k: 1 + .3 * a, seed: 21, n: 7 });
    // tokens pour out of the bar's fill edge and fall into the fire
    const bx = 260, bw = 1400, bh = bw * .085, by = 250, ex = bx + bh * .15 + (bw - bh * .3) * v;
    for (let i = 0; i < 10; i++) {
      const p = frac(t * 2.2 + i / 10), y = by + bh + p * (720 - by - bh), x = ex - 20 + (hash(i) - .5) * 70 + Math.sin(p * 6 + i) * 14;
      token(x, y, 22 + hash(i + 3) * 8, { spin: t * 2 + hash(i), burn: p > .7 ? (p - .7) * 2.5 : 0 });
    }
    paint(rectPts(380, 700, 1160, 200, 1), { wash: A2.rust, fill: '#6E2E18', fillOp: 110, tex: .7, border: .5, ink: INK, sw: 1 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) {
      const x0 = 380 + c * 97 + (r % 2) * 48; if (x0 > 1500) continue;
      inkLine([[x0, 700 + r * 50], [x0, 750 + r * 50]], .5, '#4A1C10', 'inkfine', 0);
    }
    for (let r = 1; r < 4; r++) inkLine([[380, 700 + r * 50], [1540, 700 + r * 50]], .5, '#4A1C10', 'inkfine', 0);
    hazard(380, 690, 1160, 22);
    letter('ТОПКА', 960, 790, 70, A2.hazard, { font: ruFont(70) });
    // the bar itself: flames on the fill edge, speed streaks racing left
    limitBar(bx, by, bw, v, { burn: 1, glow: .6 });
    for (let i = 0; i < 6; i++) {
      const f = frac(t * 3 + i / 6), x1 = ex - f * (ex - bx) - 40, len = 120;
      if (x1 - len > bx + 20) inkLine([[x1, by + bh * (.3 + (i % 3) * .2)], [x1 - len, by + bh * (.3 + (i % 3) * .2)]], 1.6, '#FFFFFF', 'inkfine', 0);
    }
    // the CEO throws the lever ×1 → ×2
    const la = kf(t, [[tL - .05, -2.3], [tL + .12, -.75], [tL + .22, -.9]], easeOut);
    paint(rectPts(400, 850, 130, 60, 1), { wash: A2.steel, ink: INK, sw: .8 });
    const hx = 465 + Math.cos(la) * 190, hy = 860 + Math.sin(la) * 190;
    inkLine([[465, 860], [hx, hy]], 5, INK, 'ink', 0);
    paint(ellPts(hx, hy, 24, 24, 14), { wash: '#E0302A', ink: INK, sw: .8 });
    letter('×1', 340, 830, 34, A2.cream, { font: ruFont(34) });
    letter('×2', 600, 830, 40, A2.magenta, { font: ruFont(40) });
    ceoClawd(220, 910, 20, { aR: la < -1.5 ? 1.8 : .9, aL: .3, eyes: 'happy', mouth: 'grin', noClicker: true, dy: -a * .8 });
    // burn-rate gauge
    const gx = 1690, gy = 620, gr = 125, na = kf(t, [[tL, -2.6], [tL + .18, -.35], [tL + .3, -.6]], backOut) + Math.sin(t * 40) * .04;
    paint(ellPts(gx, gy, gr + 12, gr + 12, 30), { wash: A2.steel, ink: INK, sw: 1 });
    paint(ellPts(gx, gy, gr, gr, 30), { wash: A2.cream, ink: null });
    const arc = []; for (let i = 0; i <= 10; i++) { const q = lerp(-1.1, -.25, i / 10); arc.push([gx + Math.cos(q) * gr * .8, gy + Math.sin(q) * gr * .8]); }
    inkLine(arc, 9, '#E0302A', 'ink', .5);
    letter('×1', gx - gr * .62, gy - gr * .1, 34, INK, { font: ruFont(34), ink: false });
    letter('×2', gx + gr * .55, gy - gr * .1, 38, '#E0302A', { font: ruFont(38), ink: false });
    inkLine([[gx, gy], [gx + Math.cos(na) * gr * .85, gy + Math.sin(na) * gr * .85]], 3.5, INK, 'ink', 0);
    paint(ellPts(gx, gy, 12, 12, 10), { wash: INK, ink: null });
    letter('СКОРОСТЬ СЖИГАНИЯ', gx, gy + gr + 40, 26, A2.hazard, { font: ruFont(26) });
    camEnd();
    flash(Math.exp(-(t - tL) / .08) * .4, '#FFE7B0');
  }

  // 3:4: stacked — the bar on top pouring tokens, the firebox in the middle, the lever + CEO and the burn-rate gauge below; one steady frame
  function drainR(t, lt) {
    const a = acc(t), tL = 183.76, v = limitV(t);
    a09_hall(t, { lamp: .6 });
    camBegin(960, 540, 1 + lt * .01);
    fire(960, 710, 680, 340, t, { k: 1 + .3 * a, seed: 21, n: 6 });
    const bx = 620, bw = 680, bh = bw * .085, by = 110, ex = bx + bh * .15 + (bw - bh * .3) * v;
    for (let i = 0; i < 10; i++) {
      const p = frac(t * 2.2 + i / 10), y = by + bh + p * (690 - by - bh), x = ex - 20 + (hash(i) - .5) * 70 + Math.sin(p * 6 + i) * 14;
      token(x, y, 20 + hash(i + 3) * 8, { spin: t * 2 + hash(i), burn: p > .7 ? (p - .7) * 2.5 : 0 });
    }
    paint(rectPts(600, 690, 720, 170, 1), { wash: A2.rust, fill: '#6E2E18', fillOp: 110, tex: .7, border: .5, ink: INK, sw: 1 });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) {
      const x0 = 600 + c * 97 + (r % 2) * 48; if (x0 > 1300) continue;
      inkLine([[x0, 690 + r * 57], [x0, 747 + r * 57]], .5, '#4A1C10', 'inkfine', 0);
    }
    for (let r = 1; r < 3; r++) inkLine([[600, 690 + r * 57], [1320, 690 + r * 57]], .5, '#4A1C10', 'inkfine', 0);
    hazard(600, 680, 720, 22);
    letter('ТОПКА', 960, 780, 52, A2.hazard, { font: ruFont(52) });
    limitBar(bx, by, bw, v, { burn: 1, glow: .6 });
    for (let i = 0; i < 6; i++) {
      const f = frac(t * 3 + i / 6), x1 = ex - f * (ex - bx) - 40, len = 90;
      if (x1 - len > bx + 20) inkLine([[x1, by + bh * (.3 + (i % 3) * .2)], [x1 - len, by + bh * (.3 + (i % 3) * .2)]], 1.6, '#FFFFFF', 'inkfine', 0);
    }
    // the lever ×1 → ×2, the CEO beside it
    const la = kf(t, [[tL - .05, -2.3], [tL + .12, -.75], [tL + .22, -.9]], easeOut), px = 830, py = 950;
    paint(rectPts(px - 55, py - 10, 110, 55, 1), { wash: A2.steel, ink: INK, sw: .8 });
    const hx = px + Math.cos(la) * 140, hy = py + Math.sin(la) * 140;
    inkLine([[px, py], [hx, hy]], 5, INK, 'ink', 0);
    paint(ellPts(hx, hy, 22, 22, 14), { wash: '#E0302A', ink: INK, sw: .8 });
    letter('×1', 725, 900, 30, A2.cream, { font: ruFont(30) });
    letter('×2', 955, 900, 34, A2.magenta, { font: ruFont(34) });
    ceoClawd(690, 1030, 15, { aR: la < -1.5 ? 1.8 : .9, aL: .3, eyes: 'happy', mouth: 'grin', noClicker: true, dy: -a * .8 });
    // burn-rate gauge
    const gx = 1175, gy = 880, gr = 82, na = kf(t, [[tL, -2.6], [tL + .18, -.35], [tL + .3, -.6]], backOut) + Math.sin(t * 40) * .04;
    paint(ellPts(gx, gy, gr + 10, gr + 10, 30), { wash: A2.steel, ink: INK, sw: 1 });
    paint(ellPts(gx, gy, gr, gr, 30), { wash: A2.cream, ink: null });
    const arc = []; for (let i = 0; i <= 10; i++) { const q = lerp(-1.1, -.25, i / 10); arc.push([gx + Math.cos(q) * gr * .8, gy + Math.sin(q) * gr * .8]); }
    inkLine(arc, 7, '#E0302A', 'ink', .5);
    letter('×1', gx - gr * .6, gy - gr * .1, 26, INK, { font: ruFont(26), ink: false });
    letter('×2', gx + gr * .55, gy - gr * .1, 28, '#E0302A', { font: ruFont(28), ink: false });
    inkLine([[gx, gy], [gx + Math.cos(na) * gr * .85, gy + Math.sin(na) * gr * .85]], 3, INK, 'ink', 0);
    paint(ellPts(gx, gy, 10, 10, 10), { wash: INK, ink: null });
    letter('СКОРОСТЬ СЖИГАНИЯ', gx, gy + gr + 34, 24, A2.hazard, { font: ruFont(24) });
    camEnd();
    flash(Math.exp(-(t - tL) / .08) * .4, '#FFE7B0');
  }

  // ---------- 185.68 «Доходы — потом! Прибыль — потом!»: into the shredder ----------
  const DOCS = [[185.68, 'ДОХОДЫ', '#2F9F5A', 186.66], [187.48, 'ПРИБЫЛЬ', '#2E6BD8', 188.0]];
  function shred(t, lt) {
    if (R) return shredR(t, lt);
    const a = acc(t), [sx, sy] = shakeXY(t, 9 * a);
    a09_hall(t);
    camBegin(1000 + sx, 580 + sy, 1.15 - lt * .02);
    const mx0 = 690, mx1 = 1230, my = 470;
    // shredded strips pile on the floor (under everything else)
    DOCS.forEach(([t0, , col], d) => {
      for (let i = 0; i < 16; i++) {
        const ts = t0 + .5 + i * .04; if (t < ts) continue;
        const p = clamp((t - ts) / .45), x = 790 + hash(i * 3 + d * 50) * 340, y0 = 830, y1 = 905 + hash(i + d * 9) * 30;
        const y = lerp(y0, y1, p * p), r = lerp(0, (hash(i * 7 + d) - .5) * 2.6, p) + Math.sin(t * 9 + i) * .2 * (1 - p);
        paint(rotPts(rectPts(x - 8, y - 38, 16, 76), x, y, r), { wash: A2.cream, ink: INK, sw: .4 });
        paint(rotPts(rectPts(x - 8, y - 38, 16, 18), x, y, r), { wash: col, ink: null });
      }
    });
    // the slot interior + the document going through
    paint(rectPts(mx0, my - 16, mx1 - mx0, 30), { wash: '#0C0D10', ink: INK, sw: .8 });
    for (const [t0, title, col, tP] of DOCS) {
      const ag = t - t0; if (ag < 0 || ag > 1.6) continue;
      const dw = 250, dh = 320;
      let cx, cy, rot;
      if (ag < .38) {                                                                // thrown in an arc from the CEO's hand
        const p = ag / .38; cx = lerp(1480, 960, p); cy = lerp(520, my - dh / 2 - 20, p) - Math.sin(p * Math.PI) * 220; rot = (1 - p) * 2.6;
      } else {                                                                        // fed down into the slot, shaking
        const p = easeIn(clamp((ag - .38) / 1.1)); cx = 960 + Math.sin(t * 70) * 5; cy = lerp(my - dh / 2 - 20, my + dh / 2 + 30, p); rot = Math.sin(t * 50) * .02;
      }
      a09_doc(cx, cy, dw, dh, rot, title, col);
      if (t >= tP) stamp('ПОТОМ', cx, cy - 20, 70, t, tP, { rot: -.14, col: '#E0302A' });
    }
    flushLetters();                                                                // doc titles + stamps go under the shredder
    // shredder body in front
    paint(rectPts(mx0 - 60, my, mx1 - mx0 + 120, 380, 1), { wash: A2.steel, fill: A2.gunDk, fillOp: 90, tex: .6, border: .4, ink: INK, sw: 1.2 });
    hazard(mx0 - 60, my, mx1 - mx0 + 120, 34);
    for (let i = 0; i < 10; i++) gear(mx0 + 20 + i * 56, my + 6, 26, t, { speed: (i % 2 ? -1 : 1) * 3, col: A2.steelLt, n: 8 });
    paint(rectPts(760, 800, 400, 36), { wash: '#0C0D10', ink: INK, sw: .8 });
    letter('ШРЕДДЕР', 960, 600, 84, A2.hazard, { font: ruFont(84) });
    letter('утилизация лишнего', 960, 680, 34, A2.cream, { font: ruFont(34) });
    // the CEO on a crate, winding up and throwing
    paint(rectPts(1420, 720, 330, 180, 1), { wash: '#6B4A2A', fill: '#3E2A16', fillOp: 70, tex: .6, ink: INK, sw: 1 });
    hazard(1420, 860, 330, 40);
    const throwA = d => kf(t, [[DOCS[d][0] - .35, .3], [DOCS[d][0] - .08, 2.5], [DOCS[d][0] + .08, -.3], [DOCS[d][0] + .5, .3]], ease);
    const aR = t < 186.9 ? throwA(0) : throwA(1);
    ceoClawd(1590, 720, 22, { aR, aL: .5, eyes: 'happy', mouth: 'grin', noClicker: true, dy: -a * .6 });
    dancer(300, 905, 20, 'roof', t, { eyes: 'happy', mouth: 'grin', armL: fist(PAL.clay), armR: fist(PAL.clay) });
    camEnd();
    a09_hud(t);
  }

  // 3:4: the shredder centred and big, the documents fly up over it, the CEO on his crate right, Clawd dancing bottom-left; slow push, no cuts
  function shredR(t, lt) {
    const a = acc(t);
    a09_hall(t);
    camBegin(960, 560, 1 + lt * .012);
    const mx0 = 720, mx1 = 1080, my = 520, mc = (mx0 + mx1) / 2;
    DOCS.forEach(([t0, , col], d) => {
      for (let i = 0; i < 14; i++) {
        const ts = t0 + .5 + i * .04; if (t < ts) continue;
        const p = clamp((t - ts) / .45), x = 740 + hash(i * 3 + d * 50) * 320, y0 = 850, y1 = 905 + hash(i + d * 9) * 30;
        const y = lerp(y0, y1, p * p), r = lerp(0, (hash(i * 7 + d) - .5) * 2.6, p) + Math.sin(t * 9 + i) * .2 * (1 - p);
        paint(rotPts(rectPts(x - 8, y - 38, 16, 76), x, y, r), { wash: A2.cream, ink: INK, sw: .4 });
        paint(rotPts(rectPts(x - 8, y - 38, 16, 18), x, y, r), { wash: col, ink: null });
      }
    });
    paint(rectPts(mx0, my - 16, mx1 - mx0, 30), { wash: '#0C0D10', ink: INK, sw: .8 });
    for (const [t0, title, col, tP] of DOCS) {
      const ag = t - t0; if (ag < 0 || ag > 1.6) continue;
      const dw = 220, dh = 280;
      let cx, cy, rot;
      if (ag < .38) { const p = ag / .38; cx = lerp(1170, mc, p); cy = lerp(580, my - dh / 2 - 20, p) - Math.sin(p * Math.PI) * 160; rot = (1 - p) * 2.6; }
      else { const p = easeIn(clamp((ag - .38) / 1.1)); cx = mc + Math.sin(t * 70) * 5; cy = lerp(my - dh / 2 - 20, my + dh / 2 + 30, p); rot = Math.sin(t * 50) * .02; }
      a09_doc(cx, cy, dw, dh, rot, title, col);
      if (t >= tP) stamp('ПОТОМ', cx, cy - 20, 60, t, tP, { rot: -.14, col: '#E0302A' });
    }
    flushLetters();
    paint(rectPts(mx0 - 40, my, mx1 - mx0 + 80, 320, 1), { wash: A2.steel, fill: A2.gunDk, fillOp: 90, tex: .6, border: .4, ink: INK, sw: 1.2 });
    hazard(mx0 - 40, my, mx1 - mx0 + 80, 30);
    for (let i = 0; i < 7; i++) gear(mx0 + 16 + i * 55, my + 6, 24, t, { speed: (i % 2 ? -1 : 1) * 3, col: A2.steelLt, n: 8 });
    paint(rectPts(mc - 170, 800, 340, 32), { wash: '#0C0D10', ink: INK, sw: .8 });
    letter('ШРЕДДЕР', mc, 640, 50, A2.hazard, { font: ruFont(50) });
    letter('утилизация лишнего', mc, 700, 28, A2.cream, { font: ruFont(28) });
    paint(rectPts(1105, 740, 180, 140, 1), { wash: '#6B4A2A', fill: '#3E2A16', fillOp: 70, tex: .6, ink: INK, sw: 1 });
    hazard(1105, 840, 180, 40);
    const throwA = d => kf(t, [[DOCS[d][0] - .35, .3], [DOCS[d][0] - .08, 2.5], [DOCS[d][0] + .08, -.3], [DOCS[d][0] + .5, .3]], ease);
    ceoClawd(1195, 740, 18, { aR: t < 186.9 ? throwA(0) : throwA(1), aL: .5, eyes: 'happy', mouth: 'grin', noClicker: true, dy: -a * .6 });
    dancer(680, 1000, 16, 'roof', t, { eyes: 'happy', mouth: 'grin', armL: fist(PAL.clay), armR: fist(PAL.clay) });
    camEnd();
    a09_hud(t);
  }

  // ---------- 188.8 «ЭЙДЖИАЙ — скоро! CAPEX — сейчас!»: the dusty billboard vs the neon chimney ----------
  function capex(t, lt) {
    const a = acc(t), tC = 190.72, tN = 191.2;
    // 3:4: two steady framings with a clean cut on «CAPEX» — the billboard (slow push), then the whole chimney, flame to base
    const cam = R ? (t < tC ? [510, 540, lerp(1.35, 1.4, ease(seg(t, 188.7, tC)))] : [1400, 250, lerp(.88, .9, ease(seg(t, tC, 191.7)))])
      : kf(t, [[188.8, [560, 480, 1.4]], [190.55, [620, 480, 1.45]], [190.72, [1400, 470, 1.25]], [191.12, [1400, 450, 1.2]], [191.4, [1000, 480, .9]]], ease);
    const [sx, sy] = R ? [0, 0] : shakeXY(t, 10 * a);
    paint(rectPts(-400, -300, W + 800, H + 600), { wash: '#2A1E33', fill: A2.rust, fillOp: 50, bleed: .1, tex: .5, ink: null });
    glowAt(960, 900, 900, A2.sodium, 70);
    camBegin(cam[0] + sx, cam[1] + sy, cam[2]);
    // factory roofline
    paint([[-400, 1400], [-400, 860], [150, 860], [150, 800], [520, 800], [520, 860], [900, 860], [900, 780], [1180, 780], [1180, 860], [2400, 860], [2400, 1400]], { wash: '#141418', ink: INK, sw: .8 });
    for (let i = 0; i < 12; i++) paint(rectPts(-200 + i * 190, 880, 60, 34), { wash: A2.sodium, washOp: 150 + 100 * hash(i), ink: null });
    // AGI billboard: dim, dusty, a spinner that never finishes
    paint(rectPts(495, 620, 28, 240), { wash: A2.steel, ink: INK, sw: .7 });
    paint(rectPts(260, 300, 500, 330, 1), { wash: '#4A4650', fill: '#2A282E', fillOp: 90, tex: .7, border: .5, ink: INK, sw: 1.2 });
    const fl = hash(Math.floor(t * 9)) > .78 ? .35 : 1;
    letter('AGI', 510, 390, R ? 62 : 120, mixCol('#8FA0B8', '#3A3E48', 1 - fl), { stroke: '#1A1A20' });
    const sa = t * 7;
    for (let i = 0; i < 8; i++) {
      const q = sa + i / 8 * TAU;
      paint(ellPts(510 + Math.cos(q) * 36, 505 + Math.sin(q) * 36, 7, 7, 8), { wash: '#C8D0DC', washOp: 60 + 180 * (i / 8) * fl, ink: null });
    }
    if (t >= 190.0) letter('СКОРО…', 510, 585, 54, '#C8D0DC', { font: ruFont(54), pop: (t - 190.0) * 5, alpha: fl });
    inkLine([[262, 302], [330, 302], [262, 360]], .6, '#9A9AA4', 'inkfine', .2);         // a cobweb in the corner
    inkLine([[262, 330], [300, 302]], .5, '#9A9AA4', 'inkfine', 0);
    // the chimney: fire, burning tokens, CAPEX neon lighting letter by letter
    fire(1400, 120, 330, 330, t, { k: 1 + .5 * a, seed: 31 });
    smoke(1400, -60, t, { n: 5, r: 90, h: 360, seed: 7, col: '#3A3336' });
    paint([[1270, 110], [1530, 110], [1590, 870], [1210, 870]], { wash: A2.rust, fill: '#5A2412', fillOp: 110, tex: .7, border: .5, ink: INK, sw: 1.2 });
    for (let r = 0; r < 14; r++) { const y = 150 + r * 52, e = (y - 110) / 760 * 60; inkLine([[1270 - e, y], [1530 + e, y]], .5, '#4A1C10', 'inkfine', 0); }
    paint(rectPts(1250, 96, 300, 30), { wash: A2.gunmetal, ink: INK, sw: .8 });
    for (let i = 0; i < 6; i++) {
      const p = frac(t * 1.3 + i / 6), x = 1400 + (hash(i) - .5) * 200 + Math.sin(p * 5 + i) * 60 * p, y = 90 - p * 420;
      token(x, y, 20 + hash(i + 2) * 10, { spin: t * 3 + i, burn: .4 + p * .6 });
    }
    'CAPEX'.split('').forEach((c, i) => {
      const on = t >= tC + i * .07, y = R ? 190 + i * 110 : 210 + i * 130, pk = on ? Math.exp(-(t - tC - i * .07) / .15) : 0;
      if (on) glowAt(1400, y, (R ? 80 : 110) + 60 * pk, A2.magenta, 90);
      letter(c, 1400, y, R ? 62 : 120, on ? '#FFD0F6' : '#5A2A50', { stroke: on ? A2.magenta : '#3A1A30', ink: false, pop: on ? 1 : undefined });
    });
    if (t >= tN) {
      const k = backOut((t - tN) / .15);
      glowAt(1400, R ? 748 : 800, (R ? 200 : 300) * k, A2.acid, 80);
      const ny = R ? 700 : 752, nw = R ? 300 : 520, ns = R ? 60 : 76;               // 3:4: a smaller NOW! plate above the frame bottom, its word under the gate
      paint(rrPts(1400 - nw / 2 * k, ny, nw * k, 96, 20), { wash: '#10140A', ink: A2.acid, sw: 1.4 });
      if (k > .5) letter('СЕЙЧАС!', 1400, ny + 48, ns, '#EFFFC8', { font: ruFont(ns), stroke: A2.acid, ink: false });
    }
    camEnd();
    a09_hud(t);
  }

  // ---------- 191.74 «Плюс процент к бенчмарку»: presses push the axis down, so the bar "grows" ----------
  const AX_HITS = [192.55, 193.19];
  function bench(t, lt) {
    if (R) return benchR(t, lt);
    const a = acc(t), [sx, sy] = shakeXY(t, 14 * hitK(t, AX_HITS, .15));
    a09_hall(t, { lamp: .7 });
    camBegin(960 + sx, 530 + sy, 1.02 + lt * .025);
    // the board
    paint(rectPts(360, 150, 1200, 760, 1), { wash: A2.steel, ink: INK, sw: 1.2 });
    paint(rectPts(380, 170, 1160, 720, 1), { wash: A2.cream, fill: '#D9CFB5', fillOp: 60, tex: .5, ink: null });
    letter('БЕНЧМАРК', 960, 222, 64, INK, { font: ruFont(64), ink: false });
    // value → y: tops are fixed, only the floor moves
    const vy = v => 300 + (88.5 - v) / 1.5 * 420, base = kf(t, [[192.45, 720], [192.55, 790], [193.09, 790], [193.19, 855]], easeOut);
    for (const v of [88.5, 88.0, 87.5]) {
      inkLine([[560, vy(v)], [1420, vy(v)]], .5, '#B8AE98', 'inkfine', 0);
      letter(v.toFixed(1), 540, vy(v), 36, INK, { font: ruFont(36), ink: false, align: 'right' });
    }
    inkLine([[560, 280], [560, base]], 2, INK, 'ink', 0);
    paint([[548, base - 70], [572, base - 82], [548, base - 94], [572, base - 106]], { ink: INK, sw: 1.2 });   // axis break zigzag
    letter('87.0', 540, base - 20, 36, '#E0302A', { font: ruFont(36), ink: false, align: 'right' });
    for (const [x, v, lab, col] of [[680, 87.1, 'было', '#8A95A1'], [1020, 88.1, 'стало', '#2F9F5A']]) {
      const top = vy(v);
      paint(rectPts(x, top, 240, base - top, 1), { wash: col, fill: mixCol(col, INK, .3), fillOp: 70, tex: .5, ink: INK, sw: 1 });
      letter(v.toFixed(1) + '%', x + 120, top - 34, 44, INK, { font: ruFont(44), ink: false });
      letter(lab, x + 120, base - 36, 36, A2.cream, { font: ruFont(36), ink: false });
    }
    // the x-axis is a steel beam; two rams push it down on the hits
    hazard(420, base, 1080, 26);
    for (const px of [455, 1465]) {
      const hk = hitK(t, AX_HITS, .15);
      paint(rectPts(px - 16, -300, 32, base - 70 + 300), { wash: A2.steelLt, fill: A2.steel, fillOp: 70, tex: .3, ink: INK, sw: .6 });
      paint(rectPts(px - 55, base - 72, 110, 72, 1), { wash: A2.steel, fill: A2.gunDk, fillOp: 90, tex: .5, ink: INK, sw: 1 });
      hazard(px - 55, base - 22, 110, 22);
      for (const at of AX_HITS) sparks(px, base + 26, t - at, 40 + px, 10, 180);
      if (hk > .2) steam(px, base - 40, t, { dir: px < 960 ? Math.PI + .4 : -.4, k: hk, len: 200, seed: px, n: 4, per: .6 });
    }
    stamp('+1%', 800, 390, 110, t, 191.88, { col: '#2F9F5A', rot: -.1 });
    if (t > 192.6) letter('(ось от 87)', 1350, 870, 26, '#8A7F68', { font: ruFont(26), ink: false });
    camEnd();
  }

  // 3:4: a tall board filling the band; axis labels inside the chart right of the axis, the rams at the beam ends clear of them
  function benchR(t, lt) {
    a09_hall(t, { lamp: .7 });
    camBegin(960, 540, 1 + lt * .012);
    paint(rectPts(590, 90, 740, 870, 1), { wash: A2.steel, ink: INK, sw: 1.2 });
    paint(rectPts(608, 108, 704, 834, 1), { wash: A2.cream, fill: '#D9CFB5', fillOp: 60, tex: .5, ink: null });
    letter('БЕНЧМАРК', 960, 170, 54, INK, { font: ruFont(54), ink: false });
    const ax = 700, vy = v => 260 + (88.5 - v) / 1.5 * 460, base = kf(t, [[192.45, 720], [192.55, 800], [193.09, 800], [193.19, 870]], easeOut);
    for (const v of [88.5, 88.0, 87.5]) {
      inkLine([[ax, vy(v)], [1290, vy(v)]], .5, '#B8AE98', 'inkfine', 0);
      letter(v.toFixed(1), ax + 14, vy(v) - 20, 30, INK, { font: ruFont(30), ink: false, align: 'left' });
    }
    inkLine([[ax, 240], [ax, base]], 2, INK, 'ink', 0);
    paint([[ax - 12, base - 70], [ax + 12, base - 82], [ax - 12, base - 94], [ax + 12, base - 106]], { ink: INK, sw: 1.2 });
    letter('87.0', ax + 14, base - 22, 30, '#E0302A', { font: ruFont(30), ink: false, align: 'left' });
    for (const [x, v, lab, col] of [[800, 87.1, 'было', '#8A95A1'], [1060, 88.1, 'стало', '#2F9F5A']]) {
      const top = vy(v);
      paint(rectPts(x, top, 210, base - top, 1), { wash: col, fill: mixCol(col, INK, .3), fillOp: 70, tex: .5, ink: INK, sw: 1 });
      letter(v.toFixed(1) + '%', x + 105, top - 30, 40, INK, { font: ruFont(40), ink: false });
      letter(lab, x + 105, base - 30, 32, A2.cream, { font: ruFont(32), ink: false });
    }
    hazard(620, base, 680, 26);
    for (const px of [640, 1280]) {
      const hk = hitK(t, AX_HITS, .15);
      paint(rectPts(px - 14, -300, 28, base - 70 + 300), { wash: A2.steelLt, fill: A2.steel, fillOp: 70, tex: .3, ink: INK, sw: .6 });
      paint(rectPts(px - 45, base - 72, 90, 72, 1), { wash: A2.steel, fill: A2.gunDk, fillOp: 90, tex: .5, ink: INK, sw: 1 });
      hazard(px - 45, base - 22, 90, 22);
      for (const at of AX_HITS) sparks(px, base + 26, t - at, 40 + px, 10, 140);
      if (hk > .2) steam(px, base - 40, t, { dir: px < 960 ? Math.PI + .4 : -.4, k: hk, len: 120, seed: px, n: 4, per: .6 });
    }
    stamp('+1%', 900, 420, 100, t, 191.88, { col: '#2F9F5A', rot: -.1 });
    if (t > 192.6) letter('(ось от 87)', 1150, base + 55, 24, '#8A7F68', { font: ruFont(24), ink: false });
    camEnd();
  }

  // ---------- 193.32 «плюс триста миллиардов»: the whole factory is a puppet show ----------
  const T_PLUS = 193.32, JERK = [193.77, 194.34, 194.66, 194.97, 195.62], T_OFF = 196.28;
  const SKIN = '#D9A58A', SKIN_DK = '#A06A55', SUIT = '#1C2130', SHIRT = '#EFEAE0', STR = '#E8E1C9';
  const jerkN = t => { let n = -1; JERK.forEach((h, i) => { if (h <= t) n = i; }); return n; };
  // camera: counter close-up → the factory on strings → up to the shareholders → the bigger hand → whip to the tag
  // 3:4 (R34): the whole factory box → up to the hands with the puppets still in → up to the shareholders, eased, never cut
  // (the EN cut leaves this chapter at 195.13, before the bigger hand); the layout is pulled in to x 250–1670 (PU)
  const PU = R ? { wall: [250, 1590], ch: [520, 1400], panel: [560, 800], press: [440, 1240], pw: 240, pup: [780, 1140], fireW: 220,
    hand: [640, 1280], hs: 1.3, hl: 560, boss: [560, 960, 1360], bs: .65, plaque: [700, 520, 58] }
    : { wall: [-480, W + 400], ch: [260, 1660], panel: [180, 1560], press: [60, 1540], pw: 320, pup: [720, 1200], fireW: 330,
    hand: [560, 1360], hs: 1.5, hl: 760, boss: [330, 960, 1590], bs: 1, plaque: [580, 760, 112] };
  const pupCam = R ? t => kf(t, [[T_PLUS, [960, 290, .7]], [193.9, [960, 280, .71]], [194.3, [960, 50, .52]], [194.62, [960, 30, .52]],
    [195.02, [960, -900, .62]], [T_OFF, [960, -920, .62]]], ease) : t => kf(t, [[T_PLUS, [960, 185, 1.15]], [193.9, [960, 200, 1.1]], [194.3, [960, 430, .6]], [194.62, [960, 330, .56]],
    [195.02, [960, -420, .4]], [195.42, [960, -810, .21]], [195.68, [960, -810, .21]], [195.84, [960, -2390, .5]], [T_OFF, [960, -2380, .52]]], ease);

  // a puppet string that twangs after every jerk
  function a09_str(p1, p2, t, z, seed = 0) {
    const jk = hitK(t, JERK, .3), mx = (p1[0] + p2[0]) / 2 + Math.sin(t * 55 + seed * 2.1) * 12 * jk;
    inkLine([p1, [mx, (p1[1] + p2[1]) / 2], p2], .9 / z, STR, 'inkfine', .5);
  }
  // a giant hand from above gripping a wooden control bar centred at (bx, by), bar length L, tilted by ang.
  // o.sleeve: world y where the suit sleeve ends above. Returns bar(dx) → the string point under the bar at offset dx.
  function a09_hand(bx, by, s, L, ang, o = {}) {
    const sw = clamp(s, .6, 2);
    push(); translate(bx, by); rotate(ang);
    if (o.sleeve != null) {
      const top = o.sleeve - by;
      paint([[-140 * s, -250 * s], [140 * s, -250 * s], [175 * s, top], [-175 * s, top]], { wash: SUIT, fill: '#0E1119', fillOp: 70, tex: .5, ink: INK, sw });
      for (let i = -2; i <= 2; i++) inkLine([[i * 55 * s, -255 * s], [i * 66 * s, top]], .4 * sw, '#4A5470', 'inkfine', 0);   // pinstripes
    }
    paint(rectPts(-150 * s, -275 * s, 300 * s, 85 * s, 1), { wash: SHIRT, fill: '#C9C2B2', fillOp: 50, tex: .4, ink: INK, sw });  // shirt cuff
    token(100 * s, -232 * s, 27 * s, { glow: .4 });                                                                           // token cufflink
    paint(rrPts(-128 * s, -200 * s, 256 * s, 190 * s, 55 * s), { wash: SKIN, fill: SKIN_DK, fillOp: 50, tex: .5, ink: INK, sw });
    paint(rectPts(-L / 2, -17 * s, L, 34 * s, 1), { wash: '#8A5A34', fill: '#5E3A1E', fillOp: 90, tex: .6, ink: INK, sw });  // the bar
    for (const e of [-1, 1]) paint(ellPts(e * L / 2, 0, 24 * s, 24 * s, 12), { wash: '#6E4526', ink: INK, sw: sw * .7 });
    for (let i = 0; i < 4; i++) paint(rrPts(-120 * s + i * 60 * s, -48 * s, 58 * s, 84 * s, 26 * s), { wash: SKIN, fill: SKIN_DK, fillOp: 40, tex: .4, ink: INK, sw: sw * .8 });
    paint(ellPts(-138 * s, -80 * s, 36 * s, 66 * s, 16, 0, .35), { wash: SKIN, ink: INK, sw: sw * .8 });                     // thumb
    pop();
    const c = Math.cos(ang), sn = Math.sin(ang);
    return dx => { dx = clamp(dx, -L / 2 + 20, L / 2 - 20); return [bx + dx * c - 18 * s * sn, by + dx * sn + 18 * s * c]; };
  }
  function a09_chimney(x, t, jk, sd, seed) {
    push(); translate(x, 20); rotate(sd * .035 * jk); translate(-x, -20);
    fire(x, -440, 170, 230 * (1 + .6 * jk), t, { k: .8 + .8 * jk, seed });
    smoke(x, -560, t, { n: 4, r: 70, h: 340, seed, col: '#3A3336' });
    paint([[x - 75, 20], [x + 75, 20], [x + 58, -440], [x - 58, -440]], { wash: A2.rust, fill: '#5A2412', fillOp: 110, tex: .7, border: .5, ink: INK, sw: 1 });
    for (let r = 0; r < 9; r++) inkLine([[x - 72 + r * 2, -10 - r * 50], [x + 72 - r * 2, -10 - r * 50]], .5, '#4A1C10', 'inkfine', 0);
    paint(rectPts(x - 80, -460, 160, 26, 1), { wash: A2.gunmetal, ink: INK, sw: .8 });
    pop();
    return [x + Math.sin(sd * .035 * jk) * 460, -452];
  }
  function a09_pupScene(t) {
    const cam = pupCam(t), z = cam[2], n = jerkN(t), jk = n >= 0 ? hitK(t, JERK, .16) : 0, sd = n % 2 ? 1 : -1;
    const big = t >= 195.62 ? hitK(t, [195.62], .2) : 0;                                   // the bigger hand yanks everything once
    const [sx, sy] = R ? [0, 0] : shakeXY(t, 22 * hitK(t, [T_PLUS, 193.77], .2) + 6 * jk);
    camBegin(cam[0] + sx / z, cam[1] + sy / z, z);
    // dusk sky, darkening upward
    paint(rectPts(-4200, -5200, 10400, 6400), { wash: '#120F1C', ink: null });
    paint(rectPts(-4200, -2000, 10400, 3200), { wash: '#221A2E', washOp: 200, ink: null });
    paint(rectPts(-4200, -600, 10400, 1800), { wash: '#3A2436', washOp: 170, ink: null });
    // 3:4: the camera climbs above world y −1100, where SQ rectPts clamps full-width backdrops; two half-width (unclamped) panels carry the sky up
    if (R) for (const x of [-1000, 950]) paint(rectPts(x, -2600, 1990, 1560), { wash: '#1F1829', ink: null });
    glowAt(960, 500, 1500, A2.sodium, 45);
    paint(rectPts(-4200, 1000, 10400, 2000), { wash: '#0E0F12', ink: null });
    for (let i = 0; i < 16; i++) {                                                          // distant factories on the horizon
      const x = -3800 + i * 520 + (i > 6 ? 2500 : 0), h = 200 + hash(i * 3.3) * 380;
      if (x > -600 && x < 2400) continue;
      paint(rectPts(x, 1000 - h, 360, h), { wash: '#16161C', ink: null });
      paint(rectPts(x + 240, 1000 - h - 260, 50, 260), { wash: '#16161C', ink: null });
    }
    // the factory as a cut-away box
    a09_hall(t);
    paint(rectPts(-420, -320, W + 840, 340), { wash: '#221A2E', ink: null });
    paint(rectPts(-420, -320, W + 840, 340), { wash: '#3A2436', washOp: 170, ink: null });
    const chL = a09_chimney(PU.ch[0], t, jk, sd, 51), chR = a09_chimney(PU.ch[1], t, jk, -sd, 57);
    inkLine([[-440, -60], [W + 440, -60]], 3, A2.gunmetal, 'ink', 0);                     // open roof truss
    inkLine([[-440, 30], [W + 440, 30]], 3, A2.gunmetal, 'ink', 0);
    for (let i = 0; i <= 14; i++) { const x = -440 + i * 200; inkLine([[x, -60], [x + 200, 30]], 1.4, A2.steel, 'inkfine', 0); inkLine([[x, -60], [x, 30]], 1.4, A2.steel, 'inkfine', 0); }
    for (const x of PU.wall) paint(rectPts(x, -70, 80, 1080, 1), { wash: '#2A2C33', fill: A2.rust, fillOp: 50, tex: .6, ink: INK, sw: 1 });
    // the counter panel, hanging on two strings
    const cdy = -(8 + 34 * jk * (sd > 0 ? 1 : .6)), a0 = t - T_PLUS, ag = t - 193.77;
    const sc = a0 < .12 ? lerp(1.8, 1, easeOut(a0 / .12)) : ag >= 0 && ag < .12 ? lerp(1.25, 1, easeOut(ag / .12)) : 1;
    push(); translate(960, 185 + cdy); scale(sc); translate(-960, -185);
    paint(rectPts(PU.panel[0], 60, PU.panel[1], 250, 1), { wash: A2.gunDk, ink: A2.hazard, sw: 1.4 });
    pop();
    counter(960, 165 + cdy, (R ? 66 : 124) * sc, 300000000000, { col: A2.hazard });   // 3:4: fits the narrower panel
    letter('ТОКЕНОВ СОЖЖЕНО ЗА НЕДЕЛЮ', 960, 275 + cdy, 42 * sc, A2.cream, { font: ruFont(42 * sc) });
    if (ag >= 0 && ag < .5) for (let i = 0; i < 10; i++) {                                 // gold burst on the monster hit
      const q = i / 10 * TAU, d = 300 + 700 * easeOut(ag / .5);
      token(960 + Math.cos(q) * d, 190 + Math.sin(q) * d * .5, 30, { spin: t * 3 + i });
    }
    // the floor: presses slam when their strings are yanked, the fire in between
    const JF = JERK.slice(1);
    press(PU.press[0], 400, PU.pw, 440, t, JF, { label: 'ПРЕСС 2', seed: 3, steam: false });
    press(PU.press[1], 400, PU.pw, 440, t, JF, { label: 'ПРЕСС 3', seed: 7, steam: false });
    fire(960, 842, PU.fireW, 230, t, { k: .9 + .5 * jk, seed: 61, n: 5 });
    // CEO + Clawd, limp on their strings, jerked arm-up on each hit
    const U = 24, lift = .5 + 2 * jk + 1.5 * big, up = lerp(-.7, 2.4, jk), dn = lerp(-.7, -.3, jk), sway = Math.sin(t * 3.1) * .03;
    const pup = (x, flip, draw) => {
      const aL = (sd * flip > 0) ? up : dn, aR = (sd * flip > 0) ? dn : up, y = 840 - lift * U;
      draw(x, 840, { dy: -lift, aL, aR, rot: sway + sd * flip * .07 * jk, noShadow: false });
      return [[x, y - 8 * U], [x - (4.9 + 2.2 * Math.cos(aL)) * U, y - 4.5 * U - 2.2 * Math.sin(aL) * U], [x + (4.9 + 2.2 * Math.cos(aR)) * U, y - 4.5 * U - 2.2 * Math.sin(aR) * U]];
    };
    const ceoP = pup(PU.pup[0], 1, (x, y, o) => ceoClawd(x, y, U, { ...o, eyes: 'happy', mouth: 'grin', noClicker: true }));
    const clP = pup(PU.pup[1], -1, (x, y, o) => clawd(x, y, U, { ...o, eyes: jk > .3 ? 'scared' : 'normal', mouth: 'o' }));
    // the investors' layer: faceless shareholders in the clouds, cigar, their hands work the control bars
    const bigBar = [960, -1900], bigAng = -.07 * big;
    PU.boss.forEach((x, i) => {                                                           // shareholders scaled by bs around their collar (x, -1250)
      push(); translate(x, -1250); scale(PU.bs); translate(-x, 1250);
      paint(ellPts(x, -1215, 340, 200, 24), { wash: SUIT, fill: '#0E1119', fillOp: 60, tex: .4, ink: INK, sw: 1.4 });
      paint([[x - 85, -1410], [x + 85, -1410], [x, -1250]], { wash: SHIRT, ink: null });
      paint([[x - 20, -1398], [x + 20, -1398], [x + 30, -1270], [x, -1235], [x - 30, -1270]], { wash: '#7A1420', ink: null });
      token(x - 150, -1300, 22, { glow: .3 });                                                // a lapel pin
      paint(ellPts(x, -1500, 128, 158, 22), { wash: '#262A36', fill: '#141720', fillOp: 90, tex: .4, ink: INK, sw: 1.4 });   // no face
      if (i === 1) {
        smoke(x + 275, -1520, t, { n: 5, r: 60, h: 480, seed: 9, col: '#8A8480' });
        paint(rotPts(rectPts(x + 85, -1466, 190, 30, 1), x + 85, -1451, -.12), { wash: '#6B4020', ink: INK, sw: .8 });
        glowAt(x + 273, -1475, 55, '#FF5A1A', 150);
        paint(ellPts(x + 273, -1475, 16, 16, 10), { wash: '#FF8A3A', ink: null });
      }
      pop();
    });
    const HL = PU.hand[0], HR = PU.hand[1];
    const barL = a09_hand(HL, -520 - 30 * jk * (sd > 0 ? 1 : 0) - 60 * big, PU.hs, PU.hl, sd * .12 * jk + bigAng, { sleeve: -1220 });
    const barR = a09_hand(HR, -520 - 30 * jk * (sd < 0 ? 1 : 0) - 60 * big, PU.hs, PU.hl, sd * .12 * jk - bigAng, { sleeve: -1220 });
    for (let i = 0; i < 26; i++) {                                                           // the cloud bank
      const x = -3600 + i * 350 + hash(i) * 120, y = -1080 + hash(i * 7) * 90, r = 230 + hash(i * 3) * 150;
      paint(ellPts(x, y, r, r * .55, 20), { wash: '#4E3F58', fill: '#2E2438', fillOp: 70, tex: .5, ink: null });
      paint(ellPts(x - r * .15, y - r * .2, r * .7, r * .3, 16), { fill: '#9A7C8A', fillOp: 70, bleed: .2, tex: .4, ink: null });
    }
    const [plx, plw, pls] = PU.plaque;                                                     // 3:4: the plaque's word under the 64 px text gate, so it reads
    paint(rrPts(plx, -1135, plw, R ? 120 : 150, 14, 1), { wash: '#C9A24A', fill: '#8A6A24', fillOp: 70, tex: .5, ink: INK, sw: 1.2 });
    letter('АКЦИОНЕРЫ', 960, R ? -1075 : -1060, pls, '#2A1E10', { font: ruFont(pls), ink: false });
    // the puppet strings: investor bars → counter, presses, chimneys, CEO, Clawd
    const L = barL, Rb = barR;
    const pl = PU.panel[0], pr = PU.panel[0] + PU.panel[1], xl = PU.press[0] + PU.pw / 2, xr = PU.press[1] + PU.pw / 2;
    [[L, [pl + 160, 60 + cdy]], [L, [xl, 400]], [L, chL], [Rb, [pr - 160, 60 + cdy]], [Rb, [xr, 400]], [Rb, chR]].forEach(([b, p], i) => a09_str(b(p[0] - (b === L ? HL : HR)), p, t, z, i));
    ceoP.forEach((p, i) => a09_str(L(p[0] - HL), p, t, z, 10 + i));
    clP.forEach((p, i) => a09_str(Rb(p[0] - HR), p, t, z, 20 + i));
    // the bigger hand: its strings run to the shareholders' heads and wrists; it hangs from a tiny grey tag
    if (z < .45 || cam[1] < -1500) {
      const B = a09_hand(bigBar[0], bigBar[1] - 90 * big, 4.2, 1600, bigAng);
      [[330, -1655], [960, -1655], [1590, -1655], [560, -935], [1360, -935]].forEach((p, i) => a09_str(B(p[0] - 960), p, t, z, 30 + i));
      const TY = -3200, TT = TY - 90, tsw = Math.sin(t * 2.3) * .03 + .05 * big;               // TT = the pin
      inkLine([[960, -3055 - 90 * big], [960, TY + 80]], .9 / z, STR, 'inkfine', 0);
      const Rt = p => rotPts(p, 960, TT, tsw);
      paint(Rt([[660, TT], [1260, TT], [1260, TY + 80], [660, TY + 80]]), { wash: '#A8A49C', fill: '#8A8680', fillOp: 60, tex: .6, ink: '#4A4844', sw: .8 });
      paint(ellPts(960, TT + 16, 11, 11, 10), { wash: '#6E6A64', ink: null });
      const [tx, ty] = Rt([[960, TY - 22]])[0], [ux, uy] = Rt([[960, TY + 44]])[0];
      letter('+1%', tx, ty, 96, '#34322E', { font: ruFont(96), rot: tsw, ink: false });
      letter('к бенчмарку', ux, uy, 76, '#34322E', { font: ruFont(76), rot: tsw, ink: false });
      if (t > 195.84) {
        const k = seg(t, 195.84, 196.0);
        letter('ради этого', 1760, TY + 10, 96, '#CFC8BA', { font: ruFont(96), rot: -.04, ink: false, alpha: k });
        if (k > .5) inkLine([[1540, TY + 60], [1420, TY + 100], [1290, TY + 50]], 2, '#CFC8BA', 'ink', .5);
      }
    }
    camEnd();
  }
  // old tube TV: bowed scanlines, flicker, dark curved-glass corners. k = strength.
  function a09_crt(t, k) {
    const fr = Math.floor(t * 24);
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#FFFFFF', washOp: (3 + 16 * hash(fr * 1.7)) * k, ink: null });
    for (let y = hash(fr) * 3; y < H; y += 6) {
      const b = (540 - y) / 540 * 12;
      paint([[-40, y + b], [960, y], [W + 40, y + b], [W + 40, y + b + 2.5], [960, y + 2.5], [-40, y + b + 2.5]], { wash: '#000000', washOp: 75 * k, ink: null });
    }
    for (const [x, y, w, h] of [[-60, -60, W + 120, 70], [-60, H - 10, W + 120, 70], [-60, -60, 70, H + 120], [W - 10, -60, 70, H + 120]])
      paint(rectPts(x, y, w, h), { wash: '#000000', washOp: 140, ink: null });
    const R = 150;
    for (const [ox, oy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      const cx = ox ? W - R : R, cy = oy ? H - R : R, th = Math.atan2(oy ? 1 : -1, ox ? 1 : -1), pts = [[ox ? W + 60 : -60, oy ? H + 60 : -60]];
      for (let i = 0; i <= 8; i++) { const a = th + Math.PI / 4 - i / 8 * Math.PI / 2; pts.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); }
      paint(pts, { wash: '#030304', ink: null });
    }
    glowAt(560, 300, 420, '#FFFFFF', 6 * k);                                                // the glass reflection
  }
  function puppets(t) {
    a09_pupScene(t);
    flash((hitK(t, [T_PLUS], .09) * .4 + hitK(t, [193.77], .09) * .7) * (R ? .35 : 1), '#FFF2C0');   // 3:4: no washed frame
    if (t >= 196.0) a09_crt(t, seg(t, 196.0, 196.12));
  }

  // ---------- 196.28 the TV switches off: line → dot → black ----------
  function tvOff(t) {
    const p = t - T_OFF, fr = Math.floor(t * 24);
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#060708', ink: null });
    glowAt(960, 540, 760, '#1C2420', 50);                                                  // the dead glass
    if (p < .2) {                                                                          // the picture collapses vertically
      const q = easeIn(p / .2), sy = lerp(1, .012, q), n0 = LETTERS.length;
      push(); translate(960, 540); scale(1 + .05 * q, sy); translate(-960, -540);
      a09_pupScene(t);
      pop();
      for (let i = n0; i < LETTERS.length; i++) { const L = LETTERS[i]; L.y = 540 + (L.y - 540) * sy; L.alpha = (L.alpha ?? 1) * clamp(1 - q * 1.8); }
      const bh = Math.max(8, H * sy);
      paint(rectPts(-60, 540 - bh / 2, W + 120, bh), { wash: '#F4F8FF', washOp: 235 * Math.pow(q, .7), ink: null });
      glowAt(960, 540, 600 * q, '#CFE2FF', 70 * q);
    } else if (p < .42) {                                                                  // the bright line shrinks to the centre
      const q = ease((p - .2) / .22), w = lerp(W * 1.05, 26, q);
      paint(ellPts(960, 540, w * .55 + 30, 46 - 18 * q, 24), { wash: '#AFC8F0', washOp: 70, ink: null });
      paint(ellPts(960, 540, w * .52 + 10, 18, 24), { wash: '#DCE8FF', washOp: 150, ink: null });
      paint(rectPts(960 - w / 2, 536, w, 8), { wash: '#FFFFFF', ink: null });
    } else {                                                                               // the white dot shrinks and fades
      const q = seg(p, .42, 1.1), r = lerp(15, 1.5, easeOut(q)), a = 1 - ease(seg(p, .5, .95));
      if (a > .02) {
        glowAt(960, 540, 20 + r * 7, '#CFE2FF', 130 * a);
        paint(ellPts(960, 540, r, r, 16), { wash: '#FFFFFF', washOp: 255 * a, ink: null });
      }
    }
    a09_crt(t, p < .2 ? 1 : .55);
  }

  chapter('capex', 180.85, 197.9, [
    [180.85, blast], [183.76, drain], [185.4, shred], [188.7, capex], [191.7, bench], [T_PLUS, puppets], [T_OFF, tvOff]
  ]);
})();
// 3:4 reels: one fixed band over the chapter's own R34 cameras (EN 178.58–194.32; 194.32+ is the EN coin mountain)
if (window.RU34) RU34.push([178.58, 194.32, [[178.58, 960, 540, 790]]]);
