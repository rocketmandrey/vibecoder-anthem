// a09_capex.js: «Жги токены» v2 chapter 9 "capex" (180.85–197.9). The final chorus, a step up and faster.
// The change of meaning: the whole giant factory at full blast produces ONE single tiny checkmark ✓.
// 180.85 «Жги токены!» ×2: Clawd + CEO on top of the biggest press, fire behind, every press slams on the shouts →
// 183.76 «Пока лимит не обнулён»: the CEO throws the burn lever to ×2, the limit bar drains at double speed into the firebox →
// 185.68 «Доходы — потом! Прибыль — потом!»: the CEO feeds ДОХОДЫ and ПРИБЫЛЬ into the shredder, stamped «ПОТОМ» →
// 188.8 «AGI — скоро! CAPEX — сейчас!»: a dusty AGI billboard spins «СКОРО…», whip-pan to the chimney: CAPEX neon →
// 191.74 «Плюс процент к бенчмарку»: two presses push the chart's axis down so the +1% bar "grows" →
// 193.77 «плюс триста миллиардов»: the counter slams to 300 000 000 000, the line slams three times and the last press
// mints... one tiny ✓ on a velvet cushion → 196.28 the acid sweep: the ✓ goes acid, melts, and the acid stain dries into
// a grey circle «0 токенов» → hard cut to the quiet outro.
(() => {
  const INK = PAL.ink;
  // word stresses + strong hits of the final chorus (camera punches, character bounces)
  const ACC = [180.92, 181.72, 182.44, 183.0, 183.76, 184.73, 185.68, 186.12, 186.66, 187.48, 188.0, 188.8, 190.0, 190.72, 191.2,
    191.52, 192.01, 192.55, 193.19, 193.77, 194.34, 194.97, 195.62, 196.28, 196.94, 197.6];
  const acc = t => hitK(t, ACC, .13);
  // the weekly limit across the chapter: double speed, empty by the acid sweep
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
    const v = limitV(t), x = 40, y = 64;
    limitBar(x, y, 440, v, { h: 38, burn: .6 });
    const b = frac(t * 3) < .5;
    paint(rrPts(x + 452, y - 4, 86, 46, 12), { wash: b ? A2.magenta : '#7A1466', ink: INK, sw: .6 });
    letter('×2', x + 495, y + 19, 34, A2.cream, { font: ruFont(34), ink: false });
  }
  // ✓ as a thick painted tick centred on (x, y), s = height
  function a09_check(x, y, s, col, o = {}) {
    const P = [[-.55, -.02], [-.22, .28], [.42, -.52], [.6, -.36], [-.2, .52], [-.7, .12]].map(([a, b]) => [x + a * s, y + b * s]);
    if (o.glow) glowAt(x, y, s * 1.3, col, 110 * o.glow);
    paint(o.rot ? rotPts(P, x, y, o.rot) : P, { wash: col, fill: o.dk || mixCol(col, INK, .3), fillOp: 60, tex: .3, ink: o.ink === undefined ? INK : o.ink, sw: clamp(s / 60, .4, 1.4) });
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
    letter(title, lx, ly, h * .17, A2.cream, { font: ruFont(h * .17), rot, ink: false });
  }

  // ---------- 180.85 «Жги токены!» ×2: on top of the biggest press ----------
  const P_BIG = [180.92, 182.44, 183.0], P_L = [180.92, 181.72, 182.44, 183.0], P_R = [181.2, 181.72, 182.7, 183.3];
  function blast(t, lt) {
    const a = acc(t), [sx, sy] = shakeXY(t, 16 * a);
    a09_hall(t);
    camBegin(960 + sx, 450 + sy - lt * 10, 1.0 + lt * .03 + a * .05);
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
    camEnd();
    punkText('ЖГИ!', 330, 200, 120, t, 180.92, { seed: 3 });
    punkText('ЖГИ!', 1590, 200, 120, t, 182.44, { seed: 9 });
    a09_hud(t);
    flash(pr.k * .25, '#FFE7B0');
    glitchCut(t, 180.85);
  }

  // ---------- 183.76 «Пока лимит не обнулён»: the burn lever to ×2, the bar drains into the firebox ----------
  function drain(t, lt) {
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

  // ---------- 185.68 «Доходы — потом! Прибыль — потом!»: into the shredder ----------
  const DOCS = [[185.68, 'ДОХОДЫ', '#2F9F5A', 186.66], [187.48, 'ПРИБЫЛЬ', '#2E6BD8', 188.0]];
  function shred(t, lt) {
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

  // ---------- 188.8 «ЭЙДЖИАЙ — скоро! CAPEX — сейчас!»: the dusty billboard vs the neon chimney ----------
  function capex(t, lt) {
    const a = acc(t), tC = 190.72, tN = 191.2;
    const cam = kf(t, [[188.8, [560, 480, 1.4]], [190.55, [620, 480, 1.45]], [190.72, [1400, 470, 1.25]], [191.12, [1400, 450, 1.2]], [191.4, [1000, 480, .9]]], ease);
    const [sx, sy] = shakeXY(t, 10 * a);
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
    letter('AGI', 510, 390, 120, mixCol('#8FA0B8', '#3A3E48', 1 - fl), { stroke: '#1A1A20' });
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
      const on = t >= tC + i * .07, y = 210 + i * 130, pk = on ? Math.exp(-(t - tC - i * .07) / .15) : 0;
      if (on) glowAt(1400, y, 110 + 60 * pk, A2.magenta, 90);
      letter(c, 1400, y, 120, on ? '#FFD0F6' : '#5A2A50', { stroke: on ? A2.magenta : '#3A1A30', ink: false, pop: on ? 1 : undefined });
    });
    if (t >= tN) {
      const k = backOut((t - tN) / .15);
      glowAt(1400, 800, 300 * k, A2.acid, 80);
      paint(rrPts(1400 - 260 * k, 752, 520 * k, 96, 20), { wash: '#10140A', ink: A2.acid, sw: 1.4 });
      if (k > .5) letter('СЕЙЧАС!', 1400, 800, 76, '#EFFFC8', { font: ruFont(76), stroke: A2.acid, ink: false });
    }
    camEnd();
    a09_hud(t);
  }

  // ---------- 191.74 «Плюс процент к бенчмарку»: presses push the axis down, so the bar "grows" ----------
  const AX_HITS = [192.55, 193.19];
  function bench(t, lt) {
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

  // ---------- 193.77 «плюс триста миллиардов»: the counter slams, the line slams, the last press mints ONE ✓ ----------
  const L_HITS = [[194.34], [194.97], [195.62]], TICK_T = 195.62;
  const cushion = (cx, bedY, r, age) => {
    paint(rrPts(cx - 70, bedY - 38, 140, 38, 16), { wash: '#8A1430', fill: '#5A0A1E', fillOp: 80, tex: .5, ink: INK, sw: .5 });
    for (const e of [-1, 1]) paint(ellPts(cx + e * 68, bedY - 18, 10, 10, 8), { wash: A2.hazard, ink: INK, sw: .3 });
    a09_check(cx, bedY - 58, 22, A2.acid, { glow: Math.exp(-age / .3) });
  };
  function lineShot(t, lt) {
    const a = acc(t), [sx, sy] = shakeXY(t, 22 * hitK(t, [193.77], .2) + 8 * a);
    const cam = kf(t, [[193.77, [960, 230, 1.15]], [194.2, [960, 250, 1.12]], [194.5, [960, 470, .92]], [195.5, [1060, 480, .95]], [195.72, [1540, 690, 2.6]], [196.0, [1540, 690, 2.9]]], ease);
    a09_hall(t);
    camBegin(cam[0] + sx, cam[1] + sy, cam[2]);
    // the counter slams in at the monster hit
    const ag = t - 193.77, sc = ag < .12 ? lerp(1.8, 1, easeOut(ag / .12)) : 1 + .04 * a;
    const val = 299999999999 + seg(t, 193.77, 193.95);
    push(); translate(960, 200); scale(sc); translate(-960, -200);
    paint(rectPts(160, 90, 1600, 240, 1), { wash: A2.gunDk, ink: A2.hazard, sw: 1.4 });
    hazard(160, 300, 1600, 30);
    pop();
    counter(960, 190, 124 * sc, val, { col: A2.hazard });
    letter('ТОКЕНОВ СОЖЖЕНО ЗА НЕДЕЛЮ', 960, 60, 44, A2.cream, { font: ruFont(44) });
    if (ag < .5) for (let i = 0; i < 10; i++) {                                    // gold burst
      const q = i / 10 * TAU, d = 300 + 700 * easeOut(ag / .5);
      token(960 + Math.cos(q) * d, 200 + Math.sin(q) * d * .5, 30, { spin: t * 3 + i });
    }
    // the production line: three presses slam in turn, the last one mints the product
    conveyor(-300, 800, 1640, t, { speed: 520, items: ['token'], legs: 0, h: 34 });
    press(80, 360, 360, 440, t, L_HITS[0], { label: 'ПЕРЕРАБОТКА', seed: 2 });
    press(620, 360, 360, 440, t, L_HITS[1], { label: 'ОБРАБОТКА', seed: 5 });
    press(1340, 360, 360, 440, t, L_HITS[2], { label: 'ФИНАЛЬНАЯ СБОРКА', seed: 9, token: cushion });
    fire(1160, 800, 180, 260, t, { k: .8 + .4 * a, seed: 44 });
    if (t >= TICK_T + .15) {
      const k = backOut((t - TICK_T - .15) / .2);
      paint(rotPts(rrPts(1560, 690, 170 * k, 64 * k, 8), 1560, 690, .06), { wash: A2.cream, ink: INK, sw: .5 });
      if (k > .6) {
        letter('ПРОДУКЦИЯ', 1645, 708, 20, INK, { font: ruFont(20), ink: false, rot: .06 });
        letter('1 шт.', 1640, 736, 24, '#E0302A', { font: ruFont(24), ink: false, rot: .06 });
      }
    }
    camEnd();
    flash(hitK(t, [193.77], .09) * .7, '#FFF2C0');
  }

  // ---------- 196.0 the ✓ close-up → 196.28 acid sweep → the stain dries into a grey circle «0 токенов» ----------
  function sweep(t, lt) {
    const tA = 196.28, tS = 196.94, tD = 197.6, a = acc(t);
    if (t < tA) {                                                                  // hold on the product: one tiny tick, admired
      paint(rectPts(-60, -60, W + 120, H + 120), { wash: A2.gunDk, ink: null });
      glowAt(960, 560, 520, A2.sodium, 60);
      camBegin(960, 540, 1 + lt * .15);
      paint(rectPts(560, 700, 800, 70, 1), { wash: A2.gunmetal, ink: INK, sw: 1 });
      hazard(560, 770, 800, 40);
      paint(rrPts(760, 590, 400, 110, 44), { wash: '#8A1430', fill: '#5A0A1E', fillOp: 80, tex: .5, ink: INK, sw: 1 });
      a09_check(960, 530, 70, A2.acid, { glow: .6 });
      clawd(360, 800, 26, { eyes: 'happy', mouth: 'o', aL: .3, aR: 1.2, rot: .12 });
      ceoClawd(1560, 800, 26, { eyes: 'happy', mouth: 'grin', aL: 1.6, aR: 1.6, flip: true, rot: -.12, noClicker: true });
      letter('ИТОГО: 1 шт.', 960, 300, 70, A2.cream, { font: ruFont(70) });
      camEnd();
      return;
    }
    if (t < tS) {                                                                  // acid: the tick melts into an acid smiley
      const p = seg(t, tA, tS), sq = squelch(t, tA - .1, tS + .3);
      acidField(t, { k: 1.1 + a * .4, sq, hy: 430 });
      const [sx, sy] = shakeXY(t, 18 * a);
      acidSmiley(960 + sx, 520 + sy, 190 + 40 * a + p * 60, t, { melt: p * .9, glow: .8, rot: Math.sin(t * 9) * .15 * sq });
      a09_check(960 + sx + Math.sin(t * 13) * 20, 250 + sy, 90 * (1 - p * .4), A2.acid, { glow: 1, rot: Math.sin(t * 11) * .3 * sq, ink: A2.magenta });
      flash(Math.exp(-(t - tA) / .07) * .6, '#FFFFFF');
      return;
    }
    // the stain: acid colours bleed out on paper, then dry, shrink and go grey
    const p = seg(t, tS, tD), q = ease(seg(t, tS, tD + .1));
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: mixCol('#E8E0CF', '#BDB8AE', q), fill: '#CFC4AA', fillOp: 60, tex: .6, ink: null });
    const R = lerp(620, 250, easeOut(p)), c1 = mixCol(A2.acid, '#8A8680', q), c2 = mixCol(A2.magenta, '#9A968F', q), c3 = mixCol(A2.uv, '#7E7A74', q);
    const blob = (r, s) => { const pts = []; for (let i = 0; i < 30; i++) { const an = i / 30 * TAU, w = 1 + .16 * Math.sin(an * 5 + s) * (1 - q) + .05 * Math.sin(an * 3 + s * 2); pts.push([960 + Math.cos(an) * r * w, 520 + Math.sin(an) * r * w * .92]); } return pts; };
    paint(blob(R, 1), { fill: c2, fillOp: 190, bleed: .25 * (1 - q) + .03, tex: .6, border: .9, ink: null });
    paint(blob(R * .78, 4), { fill: c1, fillOp: 170, bleed: .2 * (1 - q) + .03, tex: .6, border: .8, ink: null });
    if (q < .8) paint(blob(R * .45, 7), { fill: c3, fillOp: 150 * (1 - q), bleed: .2, tex: .5, ink: null });
    paint(blob(R, 1), { ink: mixCol('#5A5650', '#6E6A64', q), sw: .7 + q * .6 });                   // the dried tide line
    if (t >= tD) {
      const k = seg(t, tD, tD + .12);
      a09_check(960, 440, 60, '#8A8680', { ink: '#5A5650' });
      letter('0 токенов', 960, 560, 64, '#34302A', { font: ruFont(64), ink: false, alpha: k });
    }
    glitchCut(t, 197.9, { k: .7 });
  }

  chapter('capex', 180.85, 197.9, [
    [180.85, blast], [183.76, drain], [185.4, shred], [188.7, capex], [191.7, bench], [193.77, lineShot], [196.0, sweep]
  ]);
})();
