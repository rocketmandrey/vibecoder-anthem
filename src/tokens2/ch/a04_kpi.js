// a04_kpi.js: «Жги токены» v2, verse 2 (67.1–91.8). The factory office above the floor, where the bonuses are physical.
// 67.1 the new KPI board (plan 100% burned, fact breaks the board) → 69.95 the more you burned, the higher your chair;
// the thrifty one is eaten by his desk → 72.65 the fire extinguisher gets a reprimand for saving → 74.6 the token
// champion as a golden idol with worshippers → 77.3 agents hiring agents on a line, then a hundred more → 79.85 the report
// nobody reads, sealed «ПРОЧТЕНИЕ НЕ ВХОДИТ» → 84.8 its price, 40 000 000 → 88.2 industrial break: four presses on four
// hits = print → bind → award → shred.
const a04_HITS = hitsIn(66.5, 92);                                    // floor presses behind the office glass
const a04_BREAK = [88.7, 89.33, 89.97, 90.6];                         // 90.6: fourth hit on the .635 s grid (not in hits.txt)
const a04_EMP = { col: PAL.clay };

// ---------- helpers ----------
// office wall with the long window onto the factory floor (presses slamming on the audio hits), linoleum floor
function a04_office(t, o = {}) {
  const wy = o.wy ?? 70, wh = o.wh ?? 400, fy = o.fy ?? 780;
  paint(rectPts(-80, -80, W + 160, H + 160), { wash: '#383D45', fill: A2.gunDk, fillOp: 60, tex: .5, border: .2, ink: null });
  // the floor through the glass: sodium haze, presses, a gear
  paint(rectPts(40, wy, W - 80, wh), { wash: A2.gunDk, ink: null });
  for (let i = 0; i < 4; i++) glowAt(250 + i * 480, wy + wh * .35, 200, A2.sodium, 60);
  push(); translate(0, 0);
  gear(W - 250, wy + wh * .55, 120, t, { speed: .25, col: A2.steel });
  for (let i = 0; i < 3; i++) {
    const hs = a04_HITS.filter((_, j) => j % 3 === i);
    press(180 + i * 520, wy + wh * .2, 190, wh * .72, t, hs, { steam: false, seed: i * 5 });
  }
  pop();
  paint(rectPts(40, wy, W - 80, wh), { fill: '#9FB3C4', fillOp: 30, bleed: .1, tex: .2, ink: null });   // glass tint
  for (let i = 0; i < 5; i++) inkLine([[200 + i * 380, wy + wh], [320 + i * 380, wy]], 3, '#C9D6E0', 'inkfine', 0);   // reflections
  for (let i = 0; i <= 4; i++) paint(rectPts(34 + i * (W - 80) / 4, wy - 6, 14, wh + 12), { wash: A2.steel, ink: PAL.ink, sw: .6 });
  paint(rectPts(34, wy - 10, W - 68, 14), { wash: A2.steel, ink: PAL.ink, sw: .6 });
  paint(rectPts(34, wy + wh - 4, W - 68, 18), { wash: A2.steel, ink: PAL.ink, sw: .6 });
  // floor
  paint(rectPts(-80, fy, W + 160, H - fy + 80), { wash: '#4B535D', fill: A2.gunmetal, fillOp: 90, tex: .5, ink: null });
  for (let i = -6; i <= 6; i++) inkLine([[960 + i * 170, fy], [960 + i * 420, H + 40]], .6, A2.steelLt, 'inkfine', 0);
  hazard(-80, fy - 16, W + 160, 16);
}
// office tie hook (body space)
const a04_tie = col => (u, sw) => paint([[-.35 * u, -3.9 * u], [.35 * u, -3.9 * u], [.5 * u, -2.4 * u], [0, -1.9 * u], [-.5 * u, -2.4 * u]], { wash: col, ink: PAL.ink, sw: sw * .4 });
// the report, sitting on (x, y) bottom-centre, s = scale (1 = 300 x 90 book). stage 0 blank ream, 1 printed sheets,
// 2 bound book, 3 with the award ribbon, 4 shredded strips (fall k 0..1).
function a04_report(x, y, s, stage, o = {}) {
  const w = 300 * s, h = 90 * s, sw = clamp(s, .5, 1.2);
  if (stage >= 4) {
    const k = o.fall || 0;
    for (let i = 0; i < 14; i++) {
      const sx = x - w / 2 + (i + .5) * w / 14 + (hash(i * 3) - .5) * 260 * k, sy = y - h * .6 + k * k * 160 * hash(i + 7) - k * 420 * hash(i * 5) * (1 - k);
      paint(rotPts(rectPts(sx - w * .03, sy - h * .8, w * .05, h * 1.3), sx, sy, (hash(i) - .5) * 2.4 * k), { wash: i % 3 ? A2.cream : '#D8CDB4', ink: PAL.ink, sw: sw * .4 });
    }
    return;
  }
  if (stage <= 1) {
    for (let i = 0; i < 6; i++) {
      const dx = stage ? (hash(i * 2.3) - .5) * 26 * s : 0, yy = y - (i + 1) * h / 6;
      paint(rectPts(x - w / 2 + dx, yy, w, h / 6 + 1), { wash: A2.cream, ink: PAL.ink, sw: sw * .4 });
      if (stage) for (let q = 0; q < 3; q++) inkLine([[x - w * .4 + dx + q * w * .28, yy + h / 12], [x - w * .18 + dx + q * w * .28, yy + h / 12]], sw * .6, '#555', 'inkfine', 0);
    }
    return;
  }
  paint(rectPts(x - w / 2, y - h * .25, w, h * .25), { wash: A2.cream, ink: PAL.ink, sw: sw * .5 });            // page edges
  for (let q = 1; q < 4; q++) inkLine([[x - w / 2 + 4, y - h * .25 + q * h * .06], [x + w / 2 - 4, y - h * .25 + q * h * .06]], sw * .3, A2.steelLt, 'inkfine', 0);
  paint(rectPts(x - w / 2 - 4 * s, y - h, w + 8 * s, h * .76), { wash: '#1E3A6E', fill: '#0F2146', fillOp: 90, tex: .5, ink: PAL.ink, sw });
  paint(rectPts(x - w / 2 - 4 * s, y - h, w * .08, h * .76), { wash: A2.hazard, ink: null });                  // binding tape
  if (s > .35) letter('КАК СОКРАТИТЬ РАСХОДЫ НА AI', x + w * .04, y - h * .62, 17 * s, A2.cream, { font: ruFont(17 * s), ink: false });
  if (stage >= 3) {
    const mx = x + w * .32, my = y - h * .5;
    paint([[mx - 16 * s, my], [mx - 34 * s, my + 70 * s], [mx - 18 * s, my + 60 * s], [mx - 6 * s, my + 74 * s]], { wash: TK.ember, ink: PAL.ink, sw: sw * .5 });
    paint([[mx + 16 * s, my], [mx + 34 * s, my + 70 * s], [mx + 18 * s, my + 60 * s], [mx + 6 * s, my + 74 * s]], { wash: TK.ember, ink: PAL.ink, sw: sw * .5 });
    paint(starPts(mx, my, 34 * s, .6, 12), { wash: A2.hazard, fill: TK.goldDk, fillOp: 70, ink: PAL.ink, sw: sw * .6 });
    letter('№1', mx, my + 2 * s, 20 * s, '#7A4A0A', { font: ruFont(20 * s), ink: false });
  }
}
// cheap mini agent (for the hundred)
function a04_mini(x, y, s, seed) {
  paint(rectPts(x - 5 * s, y - 8 * s, 10 * s, 6 * s), { wash: '#6F8BE0', ink: PAL.ink, sw: .5 });
  for (const lx of [-4, -2, 1, 3]) paint(rectPts(x + lx * s, y - 2 * s, s, 2 * s), { wash: '#3D55A8', ink: null });
  for (const ex of [-3, 2]) paint(rectPts(x + ex * s, y - 7 * s, s, 2 * s), { wash: PAL.ink, ink: null });
  paint(rectPts(x - 1.3 * s, y - 3.6 * s, 2.6 * s, 1.5 * s), { wash: TK.cream, ink: null });
  if (hash(seed) > .5) paint(rectPts(x + 5 * s, y - 5 * s, 2.4 * s, 1.8 * s), { wash: TK.cream, ink: PAL.ink, sw: .3 });   // a job posting
}
const a04_shake = (k, amp = 16, t = 0) => [(hash(Math.floor(t * 30)) - .5) * 2 * amp * k, (hash(Math.floor(t * 30) + 9) - .5) * 2 * amp * k];

// ---------- 67.1 the new KPI board ----------
function a04_kpi(t, lt) {
  const hk = hitK(t, a04_HITS, .15), [sx, sy] = a04_shake(hk, 5, t);
  camBegin(960 + sx, 540 + sy - lt * 10, 1 + lt * .03);
  a04_office(t);
  // the board
  const bx = 600, by = 150, bw = 980, bh = 560;
  paint(rectPts(bx - 18, by - 18, bw + 36, bh + 36), { wash: A2.steel, ink: PAL.ink, sw: 1 });
  paint(rectPts(bx, by, bw, bh), { wash: A2.cream, fill: '#D8CDB4', fillOp: 60, tex: .5, ink: PAL.ink, sw: .8 });
  stamp('НОВЫЙ KPI', bx + bw / 2, by + 70, 64, t, 67.14, { col: TK.ember, rot: -.04 });
  const k1 = seg(t, 68.6, 68.9);
  if (k1 > 0) letter('СОЖЖЕНО ТОКЕНОВ ЗА НЕДЕЛЮ', bx + bw / 2, by + 150, 30, A2.gunmetal, { font: ruFont(30), ink: false, alpha: k1 });
  // plan vs fact bars
  const base = by + bh - 50, planH = 260 * easeOut(seg(t, 67.9, 68.5));
  inkLine([[bx + 80, base], [bx + bw - 80, base]], 1.2, PAL.ink, 'ink', 0);
  paint(rectPts(bx + 200, base - planH, 170, planH), { wash: A2.steelLt, ink: PAL.ink, sw: .8 });
  inkLine([[bx + 120, base - 260], [bx + bw - 120, base - 260]], 1, TK.ember, 'marker', 0);
  letter('ПЛАН 100%', bx + bw - 190, base - 285, 26, TK.ember, { font: ruFont(26), ink: false });
  letter('ПЛАН', bx + 285, base + 24, 24, A2.gunmetal, { font: ruFont(24), ink: false });
  const fk = easeOut(seg(t, 69.16, 69.9)), factH = 40 + 740 * fk, fx = bx + 560;
  paint(rectPts(fx, base - factH, 170, factH), { wash: TK.orange, fill: TK.ember, fillOp: 80, tex: .5, ink: PAL.ink, sw: .9 });
  if (fk > .3) fire(fx + 85, base - factH + 6, 190, 170 * fk, t, { seed: 4 });
  letter('ФАКТ', fx + 85, base + 24, 24, A2.gunmetal, { font: ruFont(24), ink: false });
  if (fk > .5) stamp('340%', fx + 330, base - 420, 70, t, 69.7, { col: TK.ember, rot: .1 });
  // the boss points at it
  const click = hitK(t, [67.35, 68.79, 69.43], .15);
  ceoClawd(330, 900, 24, { aR: 1.05 + .15 * click, click, eyes: 'narrow', mouth: 'smile' });
  camEnd();
  glitchCut(t, 67.1);
}

// ---------- 69.95 the more you burned, the higher your chair ----------
function a04_chairs(t, lt) {
  const hk = hitK(t, [71.18], .2), [sx, sy] = a04_shake(hk, 10, t);
  camBegin(960 + sx, 540 + sy - 40 * ease(seg(t, 70.5, 71.3)), 1.02);
  a04_office(t, { fy: 800 });
  // the ruler of burned tokens on the left wall
  paint(rectPts(40, 90, 70, 710), { wash: A2.hazard, ink: PAL.ink, sw: .8 });
  for (let i = 0; i <= 10; i++) inkLine([[40, 800 - i * 70], [80 - (i % 5 ? 12 : 0), 800 - i * 70]], 1, PAL.ink, 'ink', 0);
  for (const [v, i] of [['1М', 1], ['10М', 5], ['40М', 10]]) letter(v, 75, 800 - i * 70 - 16, 20, PAL.ink, { font: ruFont(20), ink: false });
  const rise = easeOut(seg(t, 70.54, 71.3));
  const staff = [[430, 470, '38 000 000', 1], [960, 210, '9 000 000', 2], [1480, 0, '212', 4]];
  for (const [x, top, tag, n] of staff) {
    const thrifty = n === 4, lift = top * rise * (1 + .03 * Math.sin(t * 9 + n)), seatY = 700 - lift;
    const eat = thrifty ? seg(t, 71.3, 71.75) : 0, lid = thrifty ? Math.sin(seg(t, 71.05, 71.95) * Math.PI) : 0;
    // hydraulic column + star base
    paint(rectPts(x - 14, seatY, 28, 800 - seatY), { wash: A2.steelLt, fill: A2.steel, fillOp: 60, ink: PAL.ink, sw: .6 });
    if (!thrifty) hazard(x - 18, 700 - 30, 36, 30);
    paint([[x - 90, 800], [x + 90, 800], [x + 40, 780], [x - 40, 780]], { wash: A2.gunmetal, ink: PAL.ink, sw: .6 });
    // employee on the seat
    if (eat < 1) clawd(x, seatY + eat * 190, 19, {
      ...move('idle', t, n), eyes: thrifty ? (t > 71.05 ? 'scared' : 'normal') : 'happy', mouth: thrifty ? (t > 71.05 ? 'O' : 'flat') : 'grin',
      aL: thrifty ? .2 + lid * 1.2 : 1.2, aR: thrifty ? .2 + lid * 1.2 : 1.2, draw: a04_tie(n % 2 ? TK.ember : A2.uv), noShadow: true, seed: n
    });
    paint(rectPts(x - 95, seatY + eat * 190, 190, 20), { wash: A2.gunDk, ink: PAL.ink, sw: .6 });
    if (!thrifty && lift > 100) token(x + 120, seatY - 70, 26, { burn: .8 });            // the burning token held high
    // the tag on the column (the thrifty one's is on his desk)
    const ty = thrifty ? 770 : Math.min(seatY + 60, 660), tx = thrifty ? x + 70 : x;
    paint(rrPts(tx - 90, ty - 24, 180, 48, 10), { wash: thrifty ? TK.green : A2.cream, ink: PAL.ink, sw: .6 });
    letter(tag + ' ₮', tx, ty, 24, thrifty ? A2.cream : TK.ember, { font: ruFont(24), ink: false });
    // desk (front panel drawn over the thrifty one as he goes in)
    const dx = x + 70;
    if (thrifty) {
      // the lid hinges up at the back with teeth
      push(); translate(dx - 150, 720); rotate(-lid * .9);
      paint(rectPts(0, -24, 300, 24), { wash: '#8A5A3A', ink: PAL.ink, sw: .8 });
      for (let i = 0; i < 9; i++) paint([[12 + i * 32, 0], [40 + i * 32, 0], [26 + i * 32, 20 * lid]], { wash: A2.cream, ink: PAL.ink, sw: .4 });
      pop();
      if (lid > .05) paint(rectPts(dx - 150, 720, 300, 30 * lid), { wash: '#4A1F2A', ink: null });
    } else paint(rectPts(dx - 150, 696, 300, 24), { wash: '#8A5A3A', ink: PAL.ink, sw: .8 });
    paint(rectPts(dx - 140, 720, 280, 80), { wash: '#A06A44', fill: '#6E4028', fillOp: 70, tex: .5, ink: PAL.ink, sw: .8 });
    if (thrifty) {
      for (const ex of [-120, 100]) paint(rectPts(dx + ex, 735, 18, 26), { wash: PAL.ink, ink: null });     // the desk's eyes
      sfx('ХРУМ', dx, 610, 60, A2.hazard, t - 71.75, { font: ruFont(60), life: .8 });
      if (t > 71.9) sfx('−1', dx + 40, 560, 50, TK.green, t - 71.9, { font: ruFont(50), life: .7 });
    }
  }
  if (t > 70.54) punkText('БОНУС = ВЫСОТА КРЕСЛА', 1240, 170, 48, t, 70.54, { seed: 4 });
  camEnd();
}

// ---------- 72.65 the fire extinguisher gets a reprimand for saving ----------
function a04_extinguisher(t, lt) {
  const hk = hitK(t, [73.89], .2), [sx, sy] = a04_shake(hk, 12, t);
  camBegin(960 + sx, 520 + sy, 1.05 + lt * .03);
  a04_office(t, { wy: 60, wh: 330 });
  // the burning bin
  const put = seg(t, 72.7, 73.35), fireK = t < 74.3 ? 1 - .9 * put : .1 + 1.1 * easeOut(seg(t, 74.3, 74.6));
  paint([[430, 620], [630, 620], [610, 800], [450, 800]], { wash: A2.steel, fill: A2.gunmetal, fillOp: 90, tex: .5, ink: PAL.ink, sw: 1 });
  fire(530, 630, 220, 300, t, { k: fireK, seed: 11 });
  for (let i = 0; i < 3; i++) token(480 + i * 50, 625 - (i % 2) * 20, 24, { burn: .8 * fireK });
  // the extinguisher: a red cylinder with slit eyes
  const droop = ease(seg(t, 73.9, 74.2)) * .1, ex = 960, ey = 800;
  push(); translate(ex, ey); rotate(droop); translate(-ex, -ey);
  paint(rrPts(880, 330, 170, 470, 60), { wash: '#D8262A', fill: TK.emberDk, fillOp: 80, tex: .5, border: .4, ink: PAL.ink, sw: 1.2 });
  paint(rectPts(915, 250, 100, 90), { wash: A2.steel, ink: PAL.ink, sw: 1 });
  inkLine([[1015, 280], [1080, 250], [1100, 300]], 2, PAL.ink, 'ink', .4);
  const hoseTo = t < 73.4 ? [700, 520] : [860, 400];
  inkLine([[925, 290], [860, 330], hoseTo], 5, '#222', 'ink', .5);
  const sad = t > 73.9;
  for (const e of [-1, 1]) {
    if (sad) inkLine([[965 + e * 40 - 16, 470], [965 + e * 40 + 16, 470 + e * 6]], 2.2, PAL.ink, 'ink', 0);
    else paint(rectPts(957 + e * 40, 440, 16, 36), { wash: PAL.ink, ink: null });
  }
  inkLine(sad ? [[935, 530], [965, 515], [995, 530]] : [[940, 520], [990, 520]], 1.8, PAL.ink, 'ink', .5);
  paint(rectPts(895, 600, 140, 110), { wash: A2.cream, ink: PAL.ink, sw: .6 });
  letter('ОУ-5', 965, 655, 34, TK.ember, { font: ruFont(34), ink: false });
  // the reprimand notice slapped on at «плохо»
  if (t > 73.82) {
    const k = backOut(seg(t, 73.82, 73.95));
    push(); translate(965, 470); rotate(-.12); scale(k);
    paint(rectPts(-150, -110, 300, 220), { wash: '#FFFDF6', ink: PAL.ink, sw: .8 });
    paint(rectPts(-40, -126, 80, 30), { wash: '#E8DDA8', washOp: 200, ink: null });
    pop();
    letter('ВЫГОВОР', 965, 425, 50 * k, TK.ember, { font: ruFont(50 * k), rot: -.12, ink: false });
    letter('ЗА ЭКОНОМИЮ', 972, 490, 30 * k, PAL.ink, { font: ruFont(30 * k), rot: -.12, ink: false });
  }
  pop();
  // foam jet
  if (put > 0 && put < 1) for (let i = 0; i < 10; i++) {
    const f = frac(t * 3 + i / 10), px = lerp(700, 560, f), py = lerp(520, 650, f) - Math.sin(f * Math.PI) * 60;
    paint(ellPts(px, py, 26 + 20 * f, 20 + 14 * f, 12), { wash: '#F4F7FA', ink: PAL.ink, sw: .4 });
  }
  if (t > 73.1) sfx('+3 ₮ СЭКОНОМЛЕНО', 540, 420, 40, TK.green, t - 73.1, { font: ruFont(40), life: .8 });
  // the boss
  ceoClawd(1480, 880, 24, { eyes: 'narrow', mouth: 'flat', aR: t > 73.6 ? 1.2 : .3, flip: true, click: hitK(t, [73.89], .2) });
  if (t > 74.18) stamp('ПЛОХО ПОМОГ', 1420, 330, 58, t, 74.18, { col: TK.ember, rot: .08 });
  camEnd();
}

// ---------- 74.6 the token champion is our new god ----------
function a04_god(t, lt) {
  const bowT = [74.62, 75.36, 76.5, 77.02], godK = hitK(t, [77.02], .3);
  const cy = kf(t, [[74.6, 820], [75.9, 540]], ease), z = kf(t, [[74.6, 1.35], [75.9, 1]], ease) + .05 * godK;
  camBegin(960, cy, z);
  paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#241A12', fill: A2.gunDk, fillOp: 70, tex: .5, ink: null });
  // rays from the idol
  for (let i = 0; i < 18; i++) {
    const a = i / 18 * TAU + t * .15, c = Math.cos(a), s = Math.sin(a), ww = .08;
    paint([[960, 400], [960 + Math.cos(a - ww) * 1800, 400 + Math.sin(a - ww) * 1800], [960 + Math.cos(a + ww) * 1800, 400 + Math.sin(a + ww) * 1800]], { wash: i % 2 ? A2.sodium : A2.hazard, washOp: 70 + 80 * godK, ink: null });
  }
  glowAt(960, 400, 380, A2.hazard, 90 + 100 * godK);
  // pedestal of GPUs
  for (let r = 0; r < 3; r++) for (let c = 0; c <= r; c++) gpuCard(960 + (c - r / 2) * 190, 560 + r * 70, .5, t, { glow: .3 });
  paint(rectPts(700, 760, 520, 90), { wash: A2.steel, fill: A2.gunmetal, fillOp: 90, tex: .5, ink: PAL.ink, sw: 1 });
  letter('ЧЕМПИОН ПО ТОКЕНАМ', 960, 805, 34, A2.hazard, { font: ruFont(34), ink: false });
  // the golden idol (the high-chair champion, cast in gold)
  clawd(960, 525, 26, { col: '#F2C53D', dk: '#A88A10', lt: '#FFE38A', hat: 'crown', eyes: t > 77.02 ? 'spark' : 'happy', mouth: 'grin', aL: 1.4, aR: 1.4, noShadow: true,
    armR: (u, sw) => token(1.2 * u, 0, 1.4 * u, { burn: .6 }) });
  // token candles on the steps
  for (let i = 0; i < 6; i++) { const x = 560 + i * 160 + (i > 2 ? 0 : 0); if (i === 2 || i === 3) continue; token(x, 830, 18, { burn: .9 }); }
  // worshippers bowing on the words
  let last = -9; for (const b of bowT) if (b <= t) last = b;
  const bow = Math.exp(-(t - last) / .35);
  for (let i = 0; i < 7; i++) {
    const x = 200 + i * 255, n = i + 1, o = { rot: bow * .55, aL: 1.6 + bow * .6, aR: 1.6 + bow * .6, eyes: 'closed', mouth: 'O', noShadow: false, flip: i > 3 };
    if (i % 2) agentBot(x, 1000, 13, t, { n: 40 + i, ...o }); else clawd(x, 1000, 13, { ...o, draw: a04_tie(TK.ember), seed: n });
  }
  if (t > 75.36) sfx('СЛАВА!', 360, 690, 44, A2.hazard, t - 75.36, { font: ruFont(44), life: .9, rot: -.12 });
  if (t > 76.5) sfx('СЛАВА!', 1560, 690, 44, A2.hazard, t - 76.5, { font: ruFont(44), life: .9, rot: .12 });
  camEnd();
  if (godK > .02) flash(godK * .55, '#FFE9A8');
}

// ---------- 77.3 agent hired an agent, who hired another... ----------
function a04_hire(t, lt) {
  camBegin(960, 540, 1.02 + lt * .04);
  a04_office(t, { wy: 60, wh: 300 });
  paint(rectPts(560, 390, 800, 90), { wash: A2.cream, ink: PAL.ink, sw: .8 });
  letter('ВАКАНСИЯ: АГЕНТ · ОПЫТ НЕ НУЖЕН', 960, 435, 34, TK.blueDk, { font: ruFont(34), ink: false });
  conveyor(-40, 840, W + 80, t, { speed: 260, gap: 340, legs: 0, items: [(x, y, i) => agentBot(x, y, 15, t, { n: ((i % 90) + 90) % 90 + 2, hire: true, seed: i })] });
  // the first agent at the belt head pops a new hire onto the belt on each word
  const pop = hitK(t, [77.64, 78.12, 78.9], .25);
  agentBot(200, 700, 24, t, { n: 1, hire: true, aR: .6 + pop * 1.2, eyes: 'happy', mouth: 'grin', dance: 'bounce' });
  const hc = t < 77.64 ? 1 : t < 78.12 ? 2 : t < 78.9 ? 3 : 4;
  paint(rrPts(1560, 520, 300, 120, 16), { wash: A2.gunDk, ink: PAL.ink, sw: .8 });
  letter('ШТАТ', 1710, 552, 26, A2.hazard, { font: ruFont(26), ink: false });
  counter(1710, 605, 50, hc, { col: A2.acid });
  camEnd();
  glitchCut(t, 77.3, { span: .06, k: .6 });
}
function a04_hundred(t, lt) {
  const z = kf(t, [[78.74, 1.5], [79.6, 1]], ease);
  camBegin(960, kf(t, [[78.74, 740], [79.6, 520]], ease), z);
  paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#383D45', fill: A2.gunDk, fillOp: 50, tex: .5, ink: null });
  hazard(-400, 880, W + 800, 20);
  // snap → the grid of a hundred cascades out from the centre
  for (let i = 0; i < 100; i++) {
    const gx = i % 10, gy = Math.floor(i / 10), d = Math.hypot(gx - 4.5, gy - 4.5), ti = 78.9 + d * .09;
    if (t < ti) continue;
    const k = backOut(seg(t, ti, ti + .15)), x = 170 + gx * 175, y = 120 + gy * 80;
    if (Math.abs(gx - 4.5) < 1 && Math.abs(gy - 6.5) < 2) continue;                 // leave room for the hirer
    a04_mini(x, y + 30 * (1 - k), 5.6 * k, i);
  }
  const snap = hitK(t, [78.9], .25);
  agentBot(960, 880, 19, t, { n: 3, aR: 1.6 + snap * .4, aL: .2, eyes: t > 78.9 ? 'happy' : 'normal', mouth: 'smile', emote: t > 78.9 ? 'spark' : null, emoteK: seg(t, 78.9, 79.1) });
  paint(rrPts(1560, 30, 320, 120, 16), { wash: A2.gunDk, ink: PAL.ink, sw: .8 });
  letter('ШТАТ', 1720, 62, 26, A2.hazard, { font: ruFont(26), ink: false });
  counter(1720, 112, 50, 4 + Math.round(99 * easeOut(seg(t, 78.9, 79.58))), { col: A2.acid });
  if (t > 79.58) stamp('+100', 380, 900, 70, t, 79.58, { col: A2.acid, rot: -.1 });
  camEnd();
}

// ---------- 79.85 the report nobody read ----------
function a04_report_shot(t, lt) {
  camBegin(960, 560, 1 + lt * .02);
  a04_office(t, { wy: 60, wh: 300 });
  // conference table
  paint([[240, 690], [1680, 690], [1820, 860], [100, 860]], { wash: '#8A5A3A', fill: '#5E3A24', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1 });
  paint(rectPts(100, 860, 1720, 40), { wash: '#6E4028', ink: PAL.ink, sw: .8 });
  // the report lands with a thud at «сделали»
  const land = t < 80.24 ? -400 * (1 - easeIn(seg(t, 79.85, 80.24))) : 0, thud = hitK(t, [80.24], .15);
  const rx = 960, ry = 760 + land;
  for (let i = 0; i < 5; i++) a04_report(rx, ry - i * 88, 1.4, 2);           // five volumes, stacked
  letter('1 400 стр.', rx + 290, ry - 380, 30, A2.cream, { font: ruFont(30), ink: false });
  if (thud > .05) for (const sd of [-1, 1]) paint(ellPts(rx + sd * 260, ry - 10, 60 * thud + 20, 20, 12), { wash: '#D8CDB4', washOp: 160 * thud, ink: null });
  // shrink-wrap + the seal
  if (t > 81.08) {
    paint(rectPts(rx - 230, ry - 450, 460, 455), { fill: '#DDEEFF', fillOp: 70, bleed: .1, tex: .2, ink: '#BFD3E6', sw: 1 });
    for (let i = 0; i < 4; i++) inkLine([[rx - 200 + i * 110, ry - 440], [rx - 160 + i * 110, ry - 20]], 1.5, '#FFFFFF', 'inkfine', .3);
    const k = backOut(seg(t, 81.08, 81.2));
    paint(ellPts(rx, ry - 230, 170 * k, 170 * k, 30), { wash: A2.hazard, ink: PAL.ink, sw: 1.2 });
    letter('ПРОЧТЕНИЕ', rx, ry - 255, 36 * k, TK.ember, { font: ruFont(36 * k), rot: -.15, ink: false });
    letter('НЕ ВХОДИТ', rx, ry - 205, 36 * k, TK.ember, { font: ruFont(36 * k), rot: -.15, ink: false });
  }
  // the authors: agents present it, then turn away
  const away = t > 81.28;
  for (const [x, n, fl] of [[330, 7, false], [560, 12, false], [1360, 31, true], [1590, 58, true]]) {
    agentBot(x, 700, 17, t, { n, flip: away ? !fl : fl, eyes: away ? 'closed' : 'happy', mouth: away ? 'flat' : 'grin', aL: away ? .1 : 1.3, aR: away ? .1 : 1.3, emote: away && n === 12 ? 'zzz' : null, emoteK: seg(t, 81.5, 81.9) });
  }
  camEnd();
}

// ---------- 82.25 close-up on the cover: the title, as sung ----------
function a04_title(t, lt) {
  camBegin(960, 520, 1.04 + lt * .03, -.03);
  paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#6E4028', fill: '#4A2A18', fillOp: 70, tex: .6, ink: null });   // the table
  paint(rectPts(330, 90, 1260, 800), { wash: '#1E3A6E', fill: '#0F2146', fillOp: 90, tex: .6, border: .5, ink: PAL.ink, sw: 1.4 });
  paint(rectPts(330, 90, 90, 800), { wash: A2.hazard, ink: PAL.ink, sw: .8 });
  letter('ОТДЕЛ АГЕНТОВ · ДОКЛАД № 4 118', 1000, 160, 28, A2.steelLt, { font: ruFont(28), ink: false });
  const words = [['КАК', 82.28], ['СОКРАТИТЬ', 82.76], ['РАСХОДЫ', 83.58], ['НА AI', 84.38]];
  words.forEach(([w, wt], i) => { if (t > wt) letter(w, 1000, 280 + i * 120, 104, A2.cream, { font: ruFont(104), pop: (t - wt) * 7, ink: false }); });
  letter('1 400 стр. · стоимость: см. последнюю страницу', 1000, 800, 26, A2.steelLt, { font: ruFont(26), ink: false });
  // shrink-wrap glare, the seal, a cobweb in the corner
  for (let i = 0; i < 5; i++) inkLine([[420 + i * 260, 100], [560 + i * 260, 880]], 5, '#FFFFFF', 'inkfine', .3);
  paint(ellPts(1440, 740, 150, 150, 30, 0, 0), { wash: A2.hazard, ink: PAL.ink, sw: 1.2 });
  letter('ПРОЧТЕНИЕ', 1440, 718, 32, TK.ember, { font: ruFont(32), rot: -.15, ink: false });
  letter('НЕ ВХОДИТ', 1440, 762, 32, TK.ember, { font: ruFont(32), rot: -.15, ink: false });
  for (let i = 0; i < 6; i++) inkLine([[1590, 90], [1590 - Math.cos(i * .3) * 240, 90 + Math.sin(i * .3) * 240]], .8, '#E8E8E8', 'inkfine', 0);
  for (let r = 1; r <= 3; r++) inkLine(Array.from({ length: 7 }, (_, i) => [1590 - Math.cos(i * .25) * r * 70, 90 + Math.sin(i * .25) * r * 70 + 8]), .7, '#E8E8E8', 'inkfine', .5);
  camEnd();
}

// ---------- 84.8 forty million, ну и пускай ----------
function a04_bill(t, lt) {
  const hk = hitK(t, [85.21, 85.84], .15), [sx, sy] = a04_shake(hk, 14, t);
  camBegin(960 + sx, 540 + sy, 1.04 - lt * .01);
  a04_office(t, { wy: 60, wh: 300 });
  // the price board
  paint(rectPts(360, 180, 1200, 330), { wash: A2.gunDk, ink: PAL.ink, sw: 1.2 });
  hazard(360, 180, 1200, 22); hazard(360, 488, 1200, 22);
  letter('ЦЕНА ДОКЛАДА «КАК СОКРАТИТЬ РАСХОДЫ»', 960, 245, 32, A2.cream, { font: ruFont(32), ink: false });
  const v = 40000000 * easeOut(seg(t, 84.86, 85.7));
  counter(930, 370, 110, v, { col: A2.hazard, suffix: '₮' });
  // the token chute into the furnace
  paint(rectPts(860, 510, 200, 150), { wash: A2.steel, ink: PAL.ink, sw: .8 });
  for (let i = 0; i < 7; i++) { const f = frac(t * 2.4 + i / 7); token(900 + (i % 3) * 60, 520 + f * 260, 22, { burn: f, spin: f + i }); }
  paint(rrPts(690, 680, 540, 220, 40), { wash: A2.rust, fill: '#6E2E18', fillOp: 90, tex: .6, ink: PAL.ink, sw: 1 });
  paint(rrPts(780, 720, 360, 150, 60), { wash: '#1A0C06', ink: PAL.ink, sw: .8 });
  fire(960, 870, 330, 170, t, { seed: 3, k: 1 + .4 * hk });
  // the boss: ну и пускай
  const shrug = ease(seg(t, 86.68, 86.9)) * (1 - ease(seg(t, 87.9, 88.2)));
  ceoClawd(1560, 900, 24, { aL: .2 + shrug * 1.3, aR: .2 + shrug * 1.3, dy: -shrug * .6, eyes: shrug > .5 ? 'closed' : 'narrow', mouth: 'smile', noClicker: shrug > .3 });
  agentBot(330, 900, 16, t, { n: 42, eyes: 'scared', mouth: 'o', emote: '!', emoteK: seg(t, 85.66, 85.9) });
  if (t > 87.0) stamp('СПИСАНО', 1480, 620, 52, t, 87.0, { col: TK.green, rot: -.1 });
  camEnd();
}

// ---------- 88.2 industrial break: print → bind → award → shred ----------
function a04_break(t, lt) {
  const [h1, h2, h3, h4] = a04_BREAK, hk = hitK(t, a04_BREAK, .14), [sx, sy] = a04_shake(hk, 18, t);
  // the report's station + stage: arrives under press i by its hit, then slides on
  const PX = [100, 555, 1010, 1465], PW = 355, stn = i => PX[i] + PW / 2;
  let stage = 0, x = stn(0);
  if (t < h1) x = lerp(-200, stn(0), easeOut(seg(t, 88.2, h1 - .12)));
  else {
    stage = t < h2 ? 1 : t < h3 ? 2 : t < h4 ? 3 : 4;
    const from = Math.min(stage - 1, 3), hsN = [h2, h3, h4, 99][from], hsP = a04_BREAK[from];
    x = stage < 4 ? lerp(stn(from), stn(from + 1), ease(seg(t, hsP + .15, hsN - .1))) : stn(3);
  }
  const camX = clamp(x, 700, 1220), z = 1.45 + .06 * hk;
  camBegin(camX + sx, 500 + sy, z);
  paint(rectPts(-400, -400, W + 800, H + 800), { wash: A2.gunDk, fill: A2.gunmetal, fillOp: 70, tex: .5, ink: null });
  for (let i = 0; i < 4; i++) glowAt(stn(i), 180, 260, A2.sodium, 50 + 90 * hitK(t, [a04_BREAK[i]], .3));
  paint(rectPts(-400, 770, W + 800, 500), { wash: '#3A3F47', ink: null });
  conveyor(-300, 720, W + 600, t, { speed: 0, legs: 60, items: [() => {}] });
  // the report under the rams
  if (stage < 4) a04_report(x, 720, 1, stage);
  else a04_report(x, 720, 1, 4, { fall: seg(t, h4, h4 + .9) });
  const labels = ['ПЕЧАТЬ', 'ПЕРЕПЛЁТ', 'НАГРАДА', 'ШРЕДЕР'];
  for (let i = 0; i < 4; i++) press(PX[i], 200, PW, 580, t, [a04_BREAK[i]], { label: labels[i], token: false, seed: i * 7 });
  // stage captions punched on the hits
  for (let i = 0; i < 4; i++) sfx(['ПЕЧАТЬ!', 'ПЕРЕПЛЁТ!', 'НАГРАДА!', 'В ШРЕДЕР!'][i], stn(i), 560, 58, i === 3 ? TK.ember : A2.hazard, t - a04_BREAK[i], { font: ruFont(58), life: .62, stroke: PAL.ink });
  // after the shred: the strips rain down across the floor
  if (t > h4) for (let i = 0; i < 22; i++) {
    const f = seg(t, h4 + hash(i) * .3, h4 + 1.2), px = stn(3) + (hash(i * 3) - .5) * 900 * f, py = 600 - 380 * Math.sin(f * Math.PI) * hash(i + 5) + f * 240;
    if (f > 0) paint(rotPts(rectPts(px, py, 10, 60), px, py, t * 6 * (hash(i) - .5)), { wash: i % 4 ? A2.cream : '#1E3A6E', ink: PAL.ink, sw: .4 });
  }
  camEnd();
  glitchCut(t, 91.8, { k: .9 });
}

chapter('verse2', 67.1, 91.8, [
  [67.1, a04_kpi], [69.95, a04_chairs], [72.65, a04_extinguisher], [74.6, a04_god], [77.3, a04_hire], [78.74, a04_hundred],
  [79.85, a04_report_shot], [82.25, a04_title], [84.8, a04_bill], [88.2, a04_break]
]);
