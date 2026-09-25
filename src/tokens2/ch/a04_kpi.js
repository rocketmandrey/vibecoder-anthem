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
// office wall + floor. o.bg picks what the wall shows so consecutive shots don't repeat:
//   'presses' long window onto the floor (presses slam on the audio hits) · 'racks' window onto the server hall (o.heat)
//   'wall' plain corporate wall with fluorescent tubes · 'blinds' window behind half-shut blinds · 'pipes' pipes + steam + siren
function a04_office(t, o = {}) {
  const wy = o.wy ?? 70, wh = o.wh ?? 400, fy = o.fy ?? 780, bg = o.bg || 'presses';
  const wallCol = { presses: '#383D45', racks: '#2E3440', wall: '#6A7078', blinds: '#4A4038', pipes: '#3F4A3E' }[bg];
  paint(rectPts(-80, -80, W + 160, H + 160), { wash: wallCol, fill: mixCol(wallCol, '#000000', .35), fillOp: 60, tex: .5, border: .2, ink: null });
  if (bg === 'wall') {
    for (let i = 0; i < 4; i++) { glowAt(240 + i * 480, 40, 180, '#FFF6D0', 45); paint(rrPts(100 + i * 480, 18, 280, 24, 10), { wash: '#FFFBEA', ink: PAL.ink, sw: .6 }); }
    paint(rectPts(-80, fy - 170, W + 160, 170), { wash: '#4E545C', ink: null });                       // wainscot
    inkLine([[-80, fy - 170], [W + 80, fy - 170]], 2, PAL.ink, 'ink', 0);
  } else if (bg === 'pipes') {
    for (let i = 0; i < 3; i++) {
      const py = 120 + i * 150;
      paint(rectPts(-80, py, W + 160, 46), { wash: [A2.rust, A2.steel, '#3E7A5A'][i], fill: '#000000', fillOp: 40, tex: .5, ink: PAL.ink, sw: .8 });
      for (let j = 0; j < 5; j++) paint(rectPts(80 + j * 440 + i * 90, py - 8, 26, 62), { wash: A2.steelLt, ink: PAL.ink, sw: .5 });
      steam(360 + i * 560, py, t, { dir: -Math.PI / 2 + (i - 1) * .4, len: 160, k: .5 + .5 * hitK(t, a04_HITS, .3), n: 4, seed: i * 3 });
    }
    siren(W - 160, 110, t, { on: .6, len: 420 });
    gear(170, 620, 90, t, { speed: -.3, col: A2.steel });
  } else if (bg !== 'none') {
    paint(rectPts(40, wy, W - 80, wh), { wash: A2.gunDk, ink: null });
    if (bg === 'presses') {
      for (let i = 0; i < 4; i++) glowAt(250 + i * 480, wy + wh * .35, 200, A2.sodium, 60);
      gear(W - 250, wy + wh * .55, 120, t, { speed: .25, col: A2.steel });
      for (let i = 0; i < 3; i++) {
        const hs = a04_HITS.filter((_, j) => j % 3 === i);
        press(180 + i * 520, wy + wh * .2, 190, wh * .72, t, hs, { steam: false, seed: i * 5 });
      }
    } else if (bg === 'racks') {
      const heat = o.heat ?? .4;
      for (let i = 0; i < 7; i++) serverRack(90 + i * 260, wy + 30, 200, wh - 30, t, { heat: heat * (.7 + .3 * hash(i)), units: 7, seed: i, fire: heat > .9 && i % 3 === 1 ? 1 : 0 });
    } else if (bg === 'blinds') {
      glowAt(W / 2, wy + wh / 2, 700, A2.sodium, 90);
      for (let i = 0; i < 14; i++) paint(rectPts(40, wy + i * wh / 14, W - 80, wh / 14 * .7), { wash: '#C9BFA8', fill: '#8F8570', fillOp: 60, ink: null });
    }
    if (bg !== 'blinds') {
      paint(rectPts(40, wy, W - 80, wh), { fill: '#9FB3C4', fillOp: 30, bleed: .1, tex: .2, ink: null });   // glass tint
      for (let i = 0; i < 5; i++) inkLine([[200 + i * 380, wy + wh], [320 + i * 380, wy]], 3, '#C9D6E0', 'inkfine', 0);   // reflections
    }
    for (let i = 0; i <= 4; i++) paint(rectPts(34 + i * (W - 80) / 4, wy - 6, 14, wh + 12), { wash: A2.steel, ink: PAL.ink, sw: .6 });
    paint(rectPts(34, wy - 10, W - 68, 14), { wash: A2.steel, ink: PAL.ink, sw: .6 });
    paint(rectPts(34, wy + wh - 4, W - 68, 18), { wash: A2.steel, ink: PAL.ink, sw: .6 });
  }
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
    a04_cup(x + w * .3, y - h, 1.3 * s, sw);                                        // a trophy cup on top of the report
  }
}
// gold trophy cup standing on (x, y) bottom-centre, ~100 px tall at s = 1, a ₮ on the bowl
function a04_cup(x, y, s, sw = 1) {
  const G = { wash: A2.hazard, fill: TK.goldDk, fillOp: 70, tex: .4, ink: PAL.ink, sw: sw * .6 };
  for (const e of [-1, 1]) inkLine([[x + e * 30 * s, y - 88 * s], [x + e * 48 * s, y - 82 * s], [x + e * 44 * s, y - 60 * s], [x + e * 24 * s, y - 52 * s]], 5 * s, TK.goldDk, 'ink', .3);
  paint([[x - 34 * s, y - 94 * s], [x + 34 * s, y - 94 * s], [x + 28 * s, y - 60 * s], [x + 10 * s, y - 44 * s], [x - 10 * s, y - 44 * s], [x - 28 * s, y - 60 * s]], G);
  paint(rectPts(x - 6 * s, y - 44 * s, 12 * s, 24 * s), G);
  paint(rectPts(x - 26 * s, y - 20 * s, 52 * s, 20 * s), { ...G, wash: A2.gunDk, fill: null });
  paint(ellPts(x - 14 * s, y - 80 * s, 6 * s, 10 * s, 8), { wash: '#FFF3B0', washOp: 200, ink: null });
  letter('₮', x + 2 * s, y - 70 * s, 30 * s, '#7A4A0A', { font: ruFont(30 * s), ink: false });
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

// ---------- 67.1 the new KPI board: a leaderboard of burned tokens ----------
const a04_ROWS = [['АГЕНТ #42', 1, '9 МЛРД'], ['МАРИНА', .64, '5,8 МЛРД'], ['ПЕТЯ', .42, '3,8 МЛРД'], ['СТАЖЁР', .22, '2 МЛРД']];
function a04_kpi(t, lt) {
  const hk = hitK(t, a04_HITS, .15), [sx, sy] = a04_shake(hk, 5, t);
  camBegin(960 + sx, 540 + sy - lt * 10, 1 + lt * .03);
  a04_office(t, { bg: 'wall' });
  const bx = 560, by = 90, bw = 1120, bh = 660;
  paint(rectPts(bx - 18, by - 18, bw + 36, bh + 36), { wash: A2.steel, ink: PAL.ink, sw: 1 });
  paint(rectPts(bx, by, bw, bh), { wash: A2.cream, fill: '#D8CDB4', fillOp: 60, tex: .5, ink: PAL.ink, sw: .8 });
  stamp('НОВЫЙ KPI', bx + bw / 2, by + 70, 68, t, 67.14, { col: TK.ember, rot: -.04 });
  const k1 = seg(t, 68.58, 68.9);
  if (k1 > 0) letter('СКОЛЬКО ТЫ СПАЛИЛ ЗА НЕДЕЛЮ', bx + bw / 2, by + 158, 46, A2.gunmetal, { font: ruFont(46), ink: false, alpha: k1 });
  // bars grow bottom-up on «у нас в отделе»; the leader's breaks out of the board on «отделе» and catches fire
  const BAR0 = bx + 330, BARW = 560, ROW0 = by + 250, ROWH = 84;
  a04_ROWS.forEach(([name, v, val], i) => {
    const y = ROW0 + i * ROWH, g = easeOut(seg(t, 68.7 + (3 - i) * .12, 69.1 + (3 - i) * .12));
    letter((i + 1) + '. ' + name, bx + 36, y, 42, PAL.ink, { font: ruFont(42), align: 'left', ink: false });
    if (g < .01) return;
    let len = Math.max(8, v * BARW * g);
    const brk = i === 0 ? backOut(seg(t, 69.16, 69.5)) : 0;
    len += brk * 480;
    paint(rectPts(BAR0, y - 28, len, 56, 1.5), { wash: TK.orange, fill: TK.ember, fillOp: 70, tex: .5, border: .5, ink: PAL.ink, sw: .7 });
    if (i === 0) {
      if (brk > .02) { fire(BAR0 + len - 40, y - 24, 150, 190 * brk, t, { k: brk, seed: 7 }); sfx('!', BAR0 + len + 40, y - 120, 90, TK.ember, t - 69.2, { life: 1.2, rot: .15 }); }
      letter(val, BAR0 + 24, y + 2, 42, A2.cream, { font: ruFont(42), align: 'left', ink: false, alpha: seg(g, .6, 1) });
    } else letter(val, BAR0 + len + 20, y + 2, 42, PAL.ink, { font: ruFont(42), align: 'left', ink: false, alpha: seg(g, .6, 1) });
  });
  // the bottom row: Clawd, sad, with a 12-token stub
  const cy = ROW0 + 4 * ROWH + 16, ck = seg(t, 69.3, 69.5);
  inkLine([[bx + 30, cy - 50], [bx + bw - 30, cy - 50]], 1, A2.steelLt, 'inkfine', 0);
  letter('5. CLAWD: 12 токенов', bx + 36, cy, 44, '#7A7A84', { font: ruFont(44), align: 'left', ink: false });
  if (ck > 0) {
    paint(rectPts(bx + 520, cy - 16, 8, 32), { wash: '#E9A06B', ink: PAL.ink, sw: .5 });
    clawd(bx + 640, cy + 40, 10, { eyes: 'closed', mouth: 'flat', aL: .1, aR: .1, noShadow: true, rot: -.08, emote: 'sweat', emoteK: ck });
  }
  // the boss points at it
  const click = hitK(t, [67.35, 68.79, 69.43], .15);
  ceoClawd(300, 900, 24, { aR: 1.05 + .15 * click, click, eyes: 'narrow', mouth: 'smile' });
  camEnd();
  glitchCut(t, 67.1);
}

// ---------- 69.95 the more you burned, the higher your chair ----------
function a04_chairs(t, lt) {
  const hk = hitK(t, [71.18], .2), [sx, sy] = a04_shake(hk, 10, t);
  camBegin(960 + sx, 540 + sy - 40 * ease(seg(t, 70.5, 71.3)), 1.02);
  a04_office(t, { fy: 800, bg: 'racks', heat: .35 });
  // the ruler of burned tokens on the left wall
  paint(rectPts(40, 90, 70, 710), { wash: A2.hazard, ink: PAL.ink, sw: .8 });
  for (let i = 0; i <= 10; i++) inkLine([[40, 800 - i * 70], [80 - (i % 5 ? 12 : 0), 800 - i * 70]], 1, PAL.ink, 'ink', 0);
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
    const ty = thrifty ? 760 : Math.min(seatY + 70, 650), tx = thrifty ? x + 70 : x, tw = thrifty ? 170 : 330;
    paint(rrPts(tx - tw / 2, ty - 34, tw, 68, 12), { wash: thrifty ? TK.green : A2.cream, ink: PAL.ink, sw: .6 });
    letter(tag + ' ₮', tx, ty, 44, thrifty ? A2.cream : TK.ember, { font: ruFont(44), ink: false });
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
  if (t > 70.54) punkText('БОНУС = ВЫСОТА КРЕСЛА', 1240, 150, 56, t, 70.54, { seed: 4 });
  camEnd();
}

// ---------- 72.65 the fire extinguisher gets a reprimand for saving ----------
function a04_extinguisher(t, lt) {
  const hk = hitK(t, [73.89], .2), [sx, sy] = a04_shake(hk, 12, t);
  camBegin(960 + sx, 520 + sy, 1.05 + lt * .03);
  a04_office(t, { wy: 60, wh: 330, bg: 'presses' });
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
  // the reprimand notice slapped on at «плохо»
  if (t > 73.82) {
    const k = backOut(seg(t, 73.82, 73.95));
    push(); translate(965, 470); rotate(-.12); scale(k);
    paint(rectPts(-170, -110, 340, 220), { wash: '#FFFDF6', ink: PAL.ink, sw: .8 });
    paint(rectPts(-40, -126, 80, 30), { wash: '#E8DDA8', washOp: 200, ink: null });
    pop();
    letter('ВЫГОВОР', 965, 425, 56 * k, TK.ember, { font: ruFont(56 * k), rot: -.12, ink: false });
    letter('ЗА ЭКОНОМИЮ', 972, 495, 42 * k, PAL.ink, { font: ruFont(42 * k), rot: -.12, ink: false });
  }
  pop();
  // foam jet
  if (put > 0 && put < 1) for (let i = 0; i < 10; i++) {
    const f = frac(t * 3 + i / 10), px = lerp(700, 560, f), py = lerp(520, 650, f) - Math.sin(f * Math.PI) * 60;
    paint(ellPts(px, py, 26 + 20 * f, 20 + 14 * f, 12), { wash: '#F4F7FA', ink: PAL.ink, sw: .4 });
  }
  if (t > 73.1) sfx('+3 ₮ СЭКОНОМЛЕНО', 560, 400, 52, TK.green, t - 73.1, { font: ruFont(52), life: .8 });
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
  letter('ЧЕМПИОН ПО ТОКЕНАМ', 960, 805, 42, A2.hazard, { font: ruFont(42), ink: false });
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
  if (t > 75.36) sfx('АМИНЬ', 360, 690, 52, A2.hazard, t - 75.36, { font: ruFont(52), life: .9, rot: -.12 });
  if (t > 76.5) sfx('АМИНЬ', 1560, 690, 52, A2.hazard, t - 76.5, { font: ruFont(52), life: .9, rot: .12 });
  camEnd();
  if (godK > .02) flash(godK * .55, '#FFE9A8');
}

// ---------- 77.3 agent hired an agent, who hired another... ----------
function a04_hire(t, lt) {
  camBegin(960, 540, 1.02 + lt * .04);
  a04_office(t, { bg: 'pipes' });
  paint(rectPts(460, 540, 1000, 100), { wash: A2.cream, ink: PAL.ink, sw: .8 });
  letter('ВАКАНСИЯ: АГЕНТ · ОПЫТ НЕ НУЖЕН', 960, 590, 44, TK.blueDk, { font: ruFont(44), ink: false });
  conveyor(-40, 840, W + 80, t, { speed: 260, gap: 340, legs: 0, items: [(x, y, i) => agentBot(x, y, 15, t, { n: ((i % 90) + 90) % 90 + 2, hire: true, seed: i })] });
  // the first agent at the belt head pops a new hire onto the belt on each word
  const pop = hitK(t, [77.64, 78.12, 78.9], .25);
  agentBot(200, 700, 24, t, { n: 1, hire: true, aR: .6 + pop * 1.2, eyes: 'happy', mouth: 'grin', dance: 'bounce' });
  const hc = t < 77.64 ? 1 : t < 78.12 ? 2 : t < 78.9 ? 3 : 4;
  paint(rrPts(1560, 520, 300, 120, 16), { wash: A2.gunDk, ink: PAL.ink, sw: .8 });
  letter('ШТАТ', 1710, 556, 40, A2.hazard, { font: ruFont(40), ink: false });
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
  letter('ШТАТ', 1720, 66, 40, A2.hazard, { font: ruFont(40), ink: false });
  counter(1720, 112, 50, 4 + Math.round(99 * easeOut(seg(t, 78.9, 79.58))), { col: A2.acid });
  if (t > 79.58) stamp('+100', 380, 900, 70, t, 79.58, { col: A2.acid, rot: -.1 });
  camEnd();
}

// ---------- 79.85 the report nobody read ----------
function a04_report_shot(t, lt) {
  camBegin(960, 560, 1 + lt * .02);
  a04_office(t, { wy: 60, wh: 300, bg: 'blinds' });
  // conference table
  paint([[240, 690], [1680, 690], [1820, 860], [100, 860]], { wash: '#8A5A3A', fill: '#5E3A24', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1 });
  paint(rectPts(100, 860, 1720, 40), { wash: '#6E4028', ink: PAL.ink, sw: .8 });
  // the report lands with a thud at «сделали»
  const land = t < 80.24 ? -400 * (1 - easeIn(seg(t, 79.85, 80.24))) : 0, thud = hitK(t, [80.24], .15);
  const rx = 960, ry = 760 + land;
  for (let i = 0; i < 5; i++) a04_report(rx, ry - i * 88, 1.4, 2);           // five volumes, stacked
  letter('1 400 стр.', rx + 340, ry - 380, 46, A2.cream, { font: ruFont(46), ink: false });
  if (thud > .05) for (const sd of [-1, 1]) paint(ellPts(rx + sd * 260, ry - 10, 60 * thud + 20, 20, 12), { wash: '#D8CDB4', washOp: 160 * thud, ink: null });
  // shrink-wrap + the seal
  if (t > 81.08) {
    paint(rectPts(rx - 230, ry - 450, 460, 455), { fill: '#DDEEFF', fillOp: 70, bleed: .1, tex: .2, ink: '#BFD3E6', sw: 1 });
    for (let i = 0; i < 4; i++) inkLine([[rx - 200 + i * 110, ry - 440], [rx - 160 + i * 110, ry - 20]], 1.5, '#FFFFFF', 'inkfine', .3);
    const k = backOut(seg(t, 81.08, 81.2));
    paint(ellPts(rx, ry - 230, 170 * k, 170 * k, 30), { wash: A2.hazard, ink: PAL.ink, sw: 1.2 });
    letter('ПРОЧТЕНИЕ', rx, ry - 258, 42 * k, TK.ember, { font: ruFont(42 * k), rot: -.15, ink: false });
    letter('НЕ ВХОДИТ', rx, ry - 200, 42 * k, TK.ember, { font: ruFont(42 * k), rot: -.15, ink: false });
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
  const words = [['КАК', 82.28], ['СОКРАТИТЬ', 82.76], ['РАСХОДЫ', 83.58], ['НА AI', 84.38]];
  words.forEach(([w, wt], i) => { if (t > wt) letter(w, 1000, 280 + i * 120, 104, A2.cream, { font: ruFont(104), pop: (t - wt) * 7, ink: false }); });
  letter('1 400 страниц. Цена — в конце.', 820, 800, 40, A2.steelLt, { font: ruFont(40), ink: false });
  // shrink-wrap glare, the seal, a cobweb in the corner
  for (let i = 0; i < 5; i++) inkLine([[420 + i * 260, 100], [560 + i * 260, 880]], 5, '#FFFFFF', 'inkfine', .3);
  paint(ellPts(1440, 740, 150, 150, 30, 0, 0), { wash: A2.hazard, ink: PAL.ink, sw: 1.2 });
  letter('ПРОЧТЕНИЕ', 1440, 714, 40, TK.ember, { font: ruFont(40), rot: -.15, ink: false });
  letter('НЕ ВХОДИТ', 1440, 766, 40, TK.ember, { font: ruFont(40), rot: -.15, ink: false });
  for (let i = 0; i < 6; i++) inkLine([[1590, 90], [1590 - Math.cos(i * .3) * 240, 90 + Math.sin(i * .3) * 240]], .8, '#E8E8E8', 'inkfine', 0);
  for (let r = 1; r <= 3; r++) inkLine(Array.from({ length: 7 }, (_, i) => [1590 - Math.cos(i * .25) * r * 70, 90 + Math.sin(i * .25) * r * 70 + 8]), .7, '#E8E8E8', 'inkfine', .5);
  camEnd();
}

// ---------- 84.8 forty million, ну и пускай ----------
function a04_bill(t, lt) {
  const hk = hitK(t, [85.21, 85.84], .15), [sx, sy] = a04_shake(hk, 14, t);
  camBegin(960 + sx, 540 + sy, 1.04 - lt * .01);
  a04_office(t, { wy: 60, wh: 300, bg: 'racks', heat: .85 });
  // the price board
  paint(rectPts(360, 180, 1200, 330), { wash: A2.gunDk, ink: PAL.ink, sw: 1.2 });
  hazard(360, 180, 1200, 22); hazard(360, 488, 1200, 22);
  letter('ЦЕНА ДОКЛАДА «КАК СОКРАТИТЬ РАСХОДЫ»', 960, 250, 42, A2.cream, { font: ruFont(42), ink: false });
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
