// t04_sermon.js: «Жги токены» bridge (80.35–94.5). The keynote sermon: a dark stage, one spotlight, CEO-Clawd with a
// clicker in front of a giant slide. Every click is a new demand: power lines → copper coil → water / cooling towers.
// «Зачем?»: blackout, a question mark hangs on a wire. A lone madman on a chair in the dark audience shouts the answer.
// Slow push-in on the smiling CEO over a "price of intelligence" chart that only falls… «БОЛЬШЕ GPU!»: the slide
// explodes into GPUs, white flash, the stage front catches fire. Calm and ominous until the explosion.

const t04_SX = 700, t04_SY = 60, t04_SW = 1120, t04_SH = 610;          // the giant slide
const t04_CX = 470, t04_CY = 830, t04_CU = 31;                         // CEO ground point + body unit
const t04_CLICKS = [80.5, 83.36, 85.0, 85.86, 89.85, 92.32];           // clicker presses (synced to the words)
const t04_BOOM = 92.32, t04_GPU = 92.94;

// clicker LED / arm pulse: 1 on a press, decays
function t04_click(t) { let k = 0; for (const c of t04_CLICKS) if (t >= c) k = Math.max(k, Math.exp(-(t - c) * 7)); return k; }

// ---------- slide pictures (drawn inside the slide frame, below the title) ----------
function t04_pylon(x, y, h, sw) {
  const b = h * .2;
  inkLine([[x - b, y], [x - b * .18, y - h]], sw, '#2A2F38', 'ink', 0);
  inkLine([[x + b, y], [x + b * .18, y - h]], sw, '#2A2F38', 'ink', 0);
  for (let i = 0; i < 5; i++) {                                         // lattice zigzag
    const f0 = i / 5, f1 = (i + 1) / 5, w0 = lerp(b, b * .18, f0), w1 = lerp(b, b * .18, f1);
    inkLine([[x - w0, y - h * f0], [x + w1, y - h * f1]], sw * .45, '#3A4450', 'inkfine', 0);
    inkLine([[x + w0, y - h * f0], [x - w1, y - h * f1]], sw * .45, '#3A4450', 'inkfine', 0);
  }
  for (const [f, a] of [[.78, .55], [.93, .38]]) inkLine([[x - h * a, y - h * f], [x + h * a, y - h * f]], sw * .8, '#2A2F38', 'ink', 0);
  return [[x - h * .55, y - h * .78], [x + h * .55, y - h * .78], [x - h * .38, y - h * .93], [x + h * .38, y - h * .93]];
}
function t04_bolt(x, y, s) {
  return [[x + .1 * s, y - 1 * s], [x - .45 * s, y + .08 * s], [x - .05 * s, y + .08 * s], [x - .3 * s, y + 1 * s], [x + .48 * s, y - .2 * s], [x + .06 * s, y - .2 * s], [x + .32 * s, y - 1 * s]];
}
function t04_power(x, y, w, h, t, k) {
  const gy = y + h * .9, sw = 3;
  paint(rectPts(x + w * .03, gy, w * .94, h * .05), { wash: '#DCD3C4', ink: null });
  const tops = [.1, .36, .62].map((f, i) => t04_pylon(x + w * f, gy, h * (.5 - i * .06), sw));
  for (let a = 0; a < 2; a++) for (let i = 0; i < 2; i++) for (let s = 0; s < 2; s++) {
    const p = tops[i][a * 2 + s], q = tops[i + 1][a * 2 + s], pts = [];
    for (let j = 0; j <= 8; j++) { const f = j / 8; pts.push([lerp(p[0], q[0], f), lerp(p[1], q[1], f) + Math.sin(f * Math.PI) * 26]); }
    inkLine(pts, 1.4, '#33333A', 'inkfine', .5);
    const f = frac(t * .9 + i * .3 + a * .5 + s * .2);             // a spark running along each wire
    paint(ellPts(lerp(p[0], q[0], f), lerp(p[1], q[1], f) + Math.sin(f * Math.PI) * 26, 6, 6, 8), { wash: TK.yellow, ink: null });
  }
  const bx = x + w * .84, by = y + h * .55, bs = h * .36 * backOut(k), fl = .7 + .3 * Math.abs(Math.sin(t * 17)) * Math.abs(Math.sin(t * 5.3));
  if (bs > 4) {
    glowAt(bx, by, bs * 1.3, TK.yellow, 110 * fl);
    paint(t04_bolt(bx, by, bs), { wash: TK.yellow, fill: TK.orange, fillOp: 90, tex: .4, ink: PAL.ink, sw: 2 });
  }
}
function t04_copper(x, y, w, h, t, k) {
  // a fat copper coil wound on a spool, plus a periodic-table tile
  const cx = x + w * .38, cy = y + h * .58, L = w * .56 * easeOut(k), r = h * .22;
  for (const e of [-1, 1]) paint(ellPts(cx + e * w * .3, cy, r * .28, r * 1.25, 18), { wash: '#4A3A30', ink: PAL.ink, sw: 1.4 });
  // helix side view: back half-turns (dark) first, then the spool core, then front half-turns on top
  const turns = 8, x0 = cx - w * .27, len = w * .54, shown = easeOut(k) * turns * 2;
  const half = (i, col, sw, dx = 0, dy = 0) => {
    const pts = []; for (let j = 0; j <= 8; j++) { const a = (i - .5 + j / 8) * Math.PI; pts.push([x0 + (a + Math.PI / 2) / (turns * TAU) * len + dx, cy + Math.sin(a) * r + dy]); }
    inkLine(pts, sw, col, 'ink', .5);
  };
  for (let i = 1; i < shown; i += 2) half(i, '#7A3E1A', 7);
  paint(rrPts(cx - w * .3, cy - r * .35, w * .6, r * .7, r * .2), { wash: '#6E5A4A', ink: PAL.ink, sw: 1.2 });
  for (let i = 0; i < shown; i += 2) { half(i, TK.copper, 9); half(i, '#F2B98A', 2.2, -3, -2); }
  const tx = x + w * .8, ty = y + h * .32, ts = h * .42;
  paint(rectPts(tx - ts * .45, ty, ts * .9, ts, 2), { wash: '#F3E4D2', fill: TK.copper, fillOp: 50, tex: .4, ink: PAL.ink, sw: 1.6 });
  letter('29', tx - ts * .32, ty + ts * .14, ts * .14, '#33333A', { align: 'left', ink: false, font: ruFont(ts * .14) });
  letter('Cu', tx, ty + ts * .5, ts * .42, TK.copper, { ink: false, font: ruFont(ts * .42) });
  letter('МЕДЬ', tx, ty + ts * .84, ts * .13, '#33333A', { ink: false, font: ruFont(ts * .13) });
}
function t04_tower(x, y, w, h) {
  const L = [], R = [];
  for (let i = 0; i <= 8; i++) { const f = i / 8, n = w / 2 * (1 - .3 * Math.sin(f * Math.PI * .9)) * lerp(1, .82, f); L.push([x - n, y - f * h]); R.push([x + n, y - f * h]); }
  paint([...L, ...R.reverse()], { wash: '#B9B4AE', fill: '#8A8480', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1.4 });
}
function t04_water(x, y, w, h, t, k) {
  const gy = y + h * .9;
  paint(rectPts(x + w * .03, gy, w * .94, h * .05), { wash: '#DCD3C4', ink: null });
  for (const [f, s] of [[.16, 1], [.4, .85]]) {
    smoke(x + w * f, gy - h * .5 * s, t, { n: 5, h: h * .45, r: 34 * s, col: '#B8C2CC', seed: f * 10, per: 3 });
    t04_tower(x + w * f, gy, w * .17 * s, h * .5 * s);
  }
  // the drop: rises out of the slide on the click, wobbles
  const dx = x + w * .78, dy = y + h * .55, s = h * .3 * backOut(k), wb = 1 + .03 * Math.sin(t * 6);
  if (s > 4) {
    const pts = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, c = Math.cos(a), sn = Math.sin(a); const top = sn < 0 ? Math.pow(-sn, 2.2) : 0; pts.push([dx + c * s * .7 * (1 - top * .92) * wb, dy + sn * s * (sn < 0 ? 1.5 : .8) / wb]); }
    paint(pts, { wash: '#5BB6F0', fill: TK.blue, fillOp: 90, tex: .4, bleed: .15, ink: PAL.ink, sw: 1.8 });
    paint(ellPts(dx - s * .25, dy - s * .1, s * .1, s * .22, 10, 0, .3), { wash: '#FFFFFF', washOp: 200, ink: null });
    letter('× 1 000 000 Л', dx, dy + s * 1.15, h * .075, TK.blueDk, { ink: false, font: ruFont(h * .075) });
  }
}
function t04_price(x, y, w, h, t, k) {
  // «ЦЕНА ИНТЕЛЛЕКТА»: $/token, a line that only falls
  const gx = x + w * .08, gy = y + h * .26, gw = w * .8, gh = h * .6;
  inkLine([[gx, gy], [gx, gy + gh], [gx + gw, gy + gh]], 2.6, '#33333A', 'ink', 0);
  letter('$ / токен', gx + 12, gy - 6, h * .05, '#55555E', { align: 'left', ink: false, font: ruFont(h * .05) });
  const pts = []; for (let i = 0; i <= 12; i++) { const f = i / 12 * k; pts.push([gx + 20 + f * gw * .9, gy + 16 + (1 - Math.pow(1 - f, 2.6)) * gh * .8 + (i % 2 ? 7 : -7)]); }
  if (k > .05) {
    inkLine(pts, 5, TK.green, 'ink', .4);
    const L = pts[pts.length - 1], P = pts[pts.length - 2], a = Math.atan2(L[1] - P[1], L[0] - P[0]), s = 26;
    paint([[L[0] + Math.cos(a) * s * 1.4, L[1] + Math.sin(a) * s * 1.4], [L[0] + Math.cos(a + 2.2) * s, L[1] + Math.sin(a + 2.2) * s], [L[0] + Math.cos(a - 2.2) * s, L[1] + Math.sin(a - 2.2) * s]], { wash: TK.green, ink: null });
  }
  if (k > .9) letter('↓ 99%', gx + gw * .75, gy + gh * .25, h * .1, TK.greenDk, { ink: false, font: ruFont(h * .1), pop: (k - .9) * 10 });
}

// ---------- the room ----------
function t04_backdrop(light = 1) {
  paint(rectPts(-400, -400, W + 800, H + 800), { wash: TK.soot, fill: '#2A2224', fillOp: 70 * light, tex: .6, bleed: .1, ink: null });
  for (let i = 0; i < 12; i++) inkLine([[-200 + i * 200, -200], [-190 + i * 200 + (i % 2 ? 20 : -20), 800]], 5, '#141112', 'charcoal', .3);  // curtain folds
}
function t04_slideFrame(t, content, k, o = {}) {
  const light = o.light ?? 1;
  glowAt(t04_SX + t04_SW / 2, t04_SY + t04_SH / 2, t04_SW * .62, '#5C6478', 55 * light);
  if (!content) {                                                    // idle: the company logo on black
    slide(t04_SX, t04_SY, t04_SW, t04_SH, { bg: '#221C1E' });
    token(t04_SX + t04_SW / 2, t04_SY + t04_SH / 2, 120, { glow: .4 });
    return;
  }
  slide(t04_SX, t04_SY, t04_SW, t04_SH, { title: content.title });
  content.fn(t04_SX, t04_SY, t04_SW, t04_SH, t, k);
  if (o.pop > 0) paint(rectPts(t04_SX, t04_SY, t04_SW, t04_SH), { wash: '#FFFFFF', washOp: 200 * o.pop, ink: null });   // projector blink
}
function t04_floor(t, o = {}) {
  paint(rectPts(-400, 770, W + 800, 130), { wash: '#2A2326', fill: '#3E3336', fillOp: 90, tex: .5, ink: null });
  for (let i = 0; i < 9; i++) inkLine([[-300 + i * 320, 770], [-420 + i * 340, 900]], 1.2, '#1A1516', 'inkfine', 0);   // boards
  inkLine([[-400, 900], [W + 400, 900]], 4, o.edge || '#5A4A48', 'ink', 0);
  paint(rectPts(-400, 900, W + 800, 400), { wash: '#120E0F', ink: null });
}
function t04_spot(x, k = 1, rx = 250) {
  if (k < .02) return;
  paint([[x - 40, -60], [x + 40, -60], [x + rx, t04_CY], [x - rx, t04_CY]], { wash: '#FFF3D6', washOp: 26 * k, ink: null });
  paint([[x - 18, -60], [x + 18, -60], [x + rx * .6, t04_CY], [x - rx * .6, t04_CY]], { wash: '#FFF3D6', washOp: 18 * k, ink: null });
  paint(ellPts(x, t04_CY + 4, rx * 1.05, 46, 24), { wash: '#FFE9B8', washOp: 110 * k, fill: '#FFF3D6', fillOp: 80 * k, bleed: .3, tex: .3, ink: null });
  for (let i = 0; i < 7; i++) {                                     // dust motes drifting in the beam
    const f = frac(T * .05 + hash(i + 3)), px = x + (hash(i) - .5) * rx * 1.2 * f, py = f * t04_CY;
    paint(ellPts(px + Math.sin(T + i) * 10, py, 2.5, 2.5, 6), { wash: '#FFF3D6', washOp: 140 * k, ink: null });
  }
}
// dark audience backs along the bottom (rim-lit by the stage)
function t04_heads(y, n, u, o = {}) {
  const rim = o.rim || '#6A5A58';
  for (let i = 0; i < n; i++) {
    const x = (i + .5) / n * W + (hash(i + y) - .5) * u * 4, yy = y + hash(i * 3 + y) * u * 1.5;
    paint(rrPts(x - 5 * u, yy - 6 * u, 10 * u, 9 * u, u * .6), { wash: '#0D0A0B', ink: null });
    inkLine([[x - 4.6 * u, yy - 5.8 * u], [x, yy - 6.1 * u], [x + 4.6 * u, yy - 5.8 * u]], u * .12, rim, 'ink', .5);
  }
}
function t04_ceo(t, o = {}) {
  const ck = t04_click(t), m = move('idle', t);
  ceoClawd(t04_CX, t04_CY, t04_CU, {
    ...m, aR: .35 + ck * .55, aL: .25 + .3 * Math.sin(t * 1.3), click: ck, eyes: 'normal', mouth: 'smile', seed: 3, ...o
  });
}

const t04_SLIDES = [
  { t: 80.5, title: 'БОЛЬШЕ ЭЛЕКТРИЧЕСТВА', fn: t04_power },
  { t: 83.36, title: 'БОЛЬШЕ МЕДИ', fn: t04_copper },
  { t: 85.0, title: 'БОЛЬШЕ ВОДЫ', fn: t04_water }
];

// ---------- 80.35 → 85.86: the sermon, one click per demand ----------
function t04_sermon(t, lt) {
  const s = [...t04_SLIDES].reverse().find(q => t >= q.t), age = s ? t - s.t : 0;
  t04_backdrop();
  camBegin(1000 - lt * 12, 520 - lt * 6, 1.0 + lt * .012);          // barely-there creep in
  t04_slideFrame(t, s, seg(age, .05, .8), { pop: s ? Math.exp(-age * 12) : 0 });
  t04_floor(t);
  t04_spot(t04_CX);
  t04_ceo(t, { aL: s && age < 1.2 ? .25 + .9 * Math.sin(clamp(age / 1.2) * Math.PI) : .25 + .3 * Math.sin(t * 1.3) });  // open-palm gesture at the slide
  t04_heads(1010, 11, 17);
  camEnd();
}

// ---------- 85.86 «Зачем?»: blackout, a question mark hangs in the only light ----------
function t04_why(t, lt) {
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#0B0909', fill: '#171213', fillOp: 60, tex: .5, ink: null });
  const qx = 1080, qy = 430, qs = 520, rot = Math.sin(lt * 2.4) * .06 * Math.exp(-lt * .6) + .02;
  t04_spot(qx, .9, 330);
  paint(ellPts(t04_CX + 60, t04_CY, 160, 30, 20), { wash: '#1E1819', ink: null });
  ceoClawd(t04_CX + 60, t04_CY, 20, { eyes: 'look', lookX: 1, lookY: -1, mouth: 'flat', aR: .3, aL: .2, noShadow: true, col: '#3A2A26', dk: '#231A18', lt: '#4A3530', seed: 3 });
  const ax = qx + Math.sin(rot) * qs * .42, ay = qy - Math.cos(rot) * qs * .42;
  inkLine([[qx, -40], [ax, ay]], 1.4, '#8A8480', 'inkfine', 0);
  letter('?', qx, qy, qs, '#F4ECDC', { rot, ink: false, stroke: '#1A1718' });
}

// ---------- 86.65: a lone madman on a chair shouts the answer from the dark hall ----------
function t04_madman(t, lt) {
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#100C0D', fill: '#221A1C', fillOp: 70, tex: .6, ink: null });
  glowAt(960, -120, 900, '#5C6478', 70);                             // the stage is off-frame, above: cold projector light
  const MX = 1260, MY = 690, MU = 14, turn = t >= 88.55;
  camBegin(lerp(960, 1040, ease(lt / 3.2)), lerp(540, 510, ease(lt / 3.2)), 1 + .1 * ease(lt / 3.2));
  // rows of backs receding upward; a few heads turn to stare once he's done
  const rows = [[330, 18, 5], [430, 15, 6.5], [560, 13, 8.5], [720, 10, 11.5], [900, 8, 15], [1080, 6, 19]];
  rows.forEach(([y, n, u], r) => {
    for (let i = 0; i < n; i++) {
      const x = (i + .5 + (r % 2) * .5) / n * (W + 200) - 100 + (hash(i + r * 13) - .5) * u * 3, yy = y + hash(i * 3 + r) * u;
      if (r === 3 && Math.abs(x - MX) < 70) continue;                 // his empty seat
      paint(rrPts(x - 5 * u, yy - 6 * u, 10 * u, 9 * u, u * .6), { wash: r < 2 ? '#1A1415' : '#0C0909', ink: null });
      inkLine([[x - 4.6 * u, yy - 5.8 * u], [x, yy - 6.1 * u], [x + 4.6 * u, yy - 5.8 * u]], Math.max(.5, u * .1), '#8A7E88', 'ink', .5);
      const d = t - 88.55 - hash(i + r * 7) * .7;                     // eyes appear as they turn round to look
      if (turn && d > 0 && r >= 2) { const lx = x + Math.sign(MX - x) * u * 1.6; for (const e of [-1.4, 1.4]) paint(rectPts(lx + e * u - u * .35, yy - 4.6 * u, u * .7, u * 1.3 * clamp(d * 5)), { wash: '#E8E0CC', ink: null }); }
    }
  });
  // the chair + the madman on it
  paint([[MX - 14, -60], [MX + 14, -60], [MX + 150, MY + 70], [MX - 150, MY + 70]], { wash: '#FFF3D6', washOp: 22, ink: null });   // a thin cold beam finds him
  for (const e of [-1, 1]) inkLine([[MX + e * 55, MY + 70], [MX + e * 50, MY]], 3, '#4A3E3C', 'ink', 0);
  paint(rectPts(MX - 62, MY - 6, 124, 14, 1), { wash: '#4A3E3C', ink: PAL.ink, sw: .8 });
  inkLine([[MX - 55, MY - 6], [MX - 58, MY - 80]], 3, '#4A3E3C', 'ink', 0);
  const sh = turn ? 0 : 1, fl = Math.sin(t * 19);
  clawd(MX + (turn ? 0 : Math.sin(t * 31) * 2), MY - 6, MU, {
    aL: turn ? .1 : 1.5 + fl * .35, aR: turn ? .1 : 1.5 - fl * .35, dy: sh * -Math.abs(Math.sin(t * 9)) * .5,
    eyes: turn ? 'normal' : 'angry', mouth: turn ? 'flat' : 'O', noShadow: true, emote: turn ? 'sweat' : null, emoteK: seg(t, 88.8, 89.1)
  });
  // the shout: a jagged bubble, words punched in on the vocal
  const bx = 880, by = 250, rx = 560, ry = 180, f = Math.floor(t * 12), pts = [];
  for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, rr = i % 2 ? .82 : 1.08 + hash(i + f) * .08; pts.push([bx + Math.cos(a) * rx * rr, by + Math.sin(a) * ry * rr]); }
  const bk = backOut(seg(t, 86.65, 86.76));
  if (bk > .02) {
    const sc = pts.map(([x, y]) => [bx + (x - bx) * bk, by + (y - by) * bk]);
    paint([[MX - 150, MY - 150], [MX - 330, by + ry * .7], [MX - 210, by + ry * .8]].map(([x, y]) => [bx + (x - bx) * bk, by + (y - by) * bk]), { wash: '#F4ECDC', ink: PAL.ink, sw: 2 });
    paint(sc, { wash: '#F4ECDC', fill: '#FFE9B8', fillOp: 60, tex: .4, ink: PAL.ink, sw: 2.2 });
    const words = [['ЧТОБЫ', 86.66, 0], ['ИНТЕЛЛЕКТ', 86.96, 0], ['СТАЛ', 87.58, 1], ['ДЕШЕВЛЕ!', 87.86, 1]], sz = 84;
    const lines = [['ЧТОБЫ ИНТЕЛЛЕКТ'], ['СТАЛ ДЕШЕВЛЕ!']];
    for (const [w, t0, ln] of words) {
      if (t < Math.max(t0, 86.74)) continue;
      const line = lines[ln][0], full = textW(line, ruFont(sz)), pre = line.slice(0, line.indexOf(w)), x0 = bx - full / 2 + textW(pre, ruFont(sz));
      const jx = turn ? 0 : (hash(f + x0) - .5) * 6;
      letter(w, x0 + jx, by - 50 + ln * 100, sz, ln ? TK.ember : '#1E1E24', { align: 'left', font: ruFont(sz), ink: false, pop: (t - Math.max(t0, 86.74)) * 6 });
    }
  }
  camEnd();
}

// ---------- 89.85: slow push-in on the smiling CEO («а когда он станет дешевле… нам понадобится…») ----------
function t04_pushin(t, lt, dur) {
  const p = ease(lt / dur);
  t04_backdrop(.8);
  camBegin(lerp(960, 560, p), lerp(540, 660, p), lerp(1.0, 2.5, p));
  t04_slideFrame(t, { title: 'ЦЕНА ИНТЕЛЛЕКТА', fn: t04_price }, seg(t, 89.9, 90.96), { pop: Math.exp(-lt * 12), light: .8 });
  t04_floor(t);
  t04_spot(t04_CX, 1, lerp(250, 170, p));
  const late = t > 91.24;
  t04_ceo(t, { mouth: t > 91.0 ? 'grin' : 'smile', eyes: late ? 'narrow' : 'normal', aL: .15, aR: .35 + t04_click(t) * .55 + (late ? .25 * seg(t, 91.24, 92.2) : 0) });
  t04_heads(1010, 11, 17);
  camEnd();
  // the rest of the room sinks into the dark as we close in
  t04_vignette(960, 500, 1150 - p * 300, 720 - p * 200, .4 + .6 * p);
}
// soft dark vignette: three translucent rings outside an ellipse
function t04_vignette(cx, cy, rx, ry, k) {
  for (let r = 0; r < 3; r++) {
    const e = ellPts(cx, cy, rx * (1 + r * .14), ry * (1 + r * .14), 20);
    for (let i = 0; i < 20; i++) { const a = e[i], b = e[(i + 1) % 20], o = q => [cx + (q[0] - cx) * 4, cy + (q[1] - cy) * 4]; paint([a, b, o(b), o(a)], { wash: '#0B0909', washOp: 90 * k, ink: null }); }
  }
}

// ---------- 92.32 «БОЛЬШЕ GPU!»: the slide explodes into GPUs, flash, the stage burns ----------
function t04_boom(t, lt) {
  const age = t - t04_BOOM, [sx, sy] = shakeXY(t, 18 * Math.exp(-age * 2.5) + 6 * pulse(t, 5));
  t04_backdrop();
  const heat = seg(age, 0, 1);
  glowAt(t04_SX + t04_SW / 2, t04_SY + t04_SH / 2, 900, TK.orange, 120 * heat);
  camBegin(960 + sx, 540 + sy, 1.04 - .04 * easeOut(age * 2));
  // back wall fire where the slide was
  fire(t04_SX + t04_SW / 2, 780, 1300, 520, t, { k: seg(age, .1, 1.1), seed: 4 });
  // slide shards blast outward
  const nx = 4, ny = 3, cx = t04_SX + t04_SW / 2, cy = t04_SY + t04_SH / 2;
  for (let i = 0; i < nx * ny; i++) {
    const gx = i % nx, gy = Math.floor(i / nx), w = t04_SW / nx, h = t04_SH / ny, x0 = t04_SX + gx * w, y0 = t04_SY + gy * h;
    const mx = x0 + w / 2, my = y0 + h / 2, a = Math.atan2(my - cy, mx - cx) + (hash(i) - .5) * .5, d = easeOut(age * 1.4) * (700 + hash(i + 4) * 500);
    const px = mx + Math.cos(a) * d, py = my + Math.sin(a) * d + age * age * 500, r = (hash(i + 9) - .5) * 6 * age;
    push(); translate(px, py); rotate(r);
    paint(rectPts(-w / 2, -h / 2, w * .96, h * .96, 3), { wash: i % 3 ? '#FBF8F2' : '#E9E2D6', ink: PAL.ink, sw: 1.2 });
    pop();
  }
  // GPUs pour out of the slide toward the camera
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * TAU + .3, d0 = hash(i + 2) * .3, f = clamp(age * (1.1 + hash(i) * .5) - d0 * .5), s = lerp(.25, 1.25 + hash(i + 6) * .4, easeIn(f) * .6 + f * .4);
    if (f <= 0) continue;
    const gx = cx + Math.cos(a) * f * (650 + hash(i + 1) * 400), gy = cy + Math.sin(a) * f * 380 - Math.sin(f * Math.PI) * 120;
    gpuCard(gx, gy, s, t, { rot: (hash(i + 3) - .5) * 1.4 * (1 + f * 1.5), glow: .5 * (1 - f) });
  }
  t04_floor(t, { edge: TK.orange });
  const up = seg(age, 0, .2);
  ceoClawd(t04_CX, t04_CY, t04_CU, { aL: lerp(.3, 1.6, up) + .15 * Math.sin(t * 10), aR: lerp(.9, 1.7, up), click: t04_click(t), eyes: 'happy', mouth: 'grin', dy: -Math.abs(Math.sin(bpOf(t) * Math.PI)) * .6, seed: 3 });
  // the stage front catches fire, left to right
  for (let i = 0; i < 6; i++) {
    const k = seg(age, .15 + i * .07, .7 + i * .07) * (1 + .15 * pulse(t, 5));
    fire(-60 + i * 400, 930, 470, 330, t + i, { k, seed: 20 + i, glow: i % 2 === 0 });
  }
  t04_heads(1030, 11, 17, { rim: TK.orange });
  camEnd();
  stamp('БОЛЬШЕ', 1250, 190, 110, t, t04_BOOM + .02, { rot: -.07 });
  stamp('GPU!', 1290, 480, 190, t, t04_GPU, { rot: .05, col: TK.yellow });
  flash(Math.exp(-age * 11) * (age < 0 ? 0 : 1), '#FFF6E0');
}

chapter('bridge', 80.35, 94.5, [
  [80.35, t04_sermon],
  [85.86, t04_why],
  [86.65, t04_madman],
  [89.85, t04_pushin],
  [t04_BOOM, t04_boom]
]);
