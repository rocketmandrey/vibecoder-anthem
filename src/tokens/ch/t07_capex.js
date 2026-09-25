// t07_capex.js: «Жги токены» chapter 7 "finale" (146.3–162.6). The last chorus, a key change up.
// Clawd and CEO-Clawd on a stage built from GPU cards above the roaring furnace:
// 146.3 «Жги токены!» ×2 → 148.6 CEO clicks the weekly limit down at double speed while Clawd shovels →
// 151.2 «ДОХОДЫ» and «ПРИБЫЛЬ» get kicked off stage («ПОТОМ») → 153.6 «AGI» loads «СКОРО…» while a giant «CAPEX»
// neon blazes «СЕЙЧАС!» → 156.2 benchmark 87.1 → 88.1 % on a y-axis that starts at 87 → 158.3 the counter slams
// to 300 000 000 000, a gold explosion, every token rains down. The engine's wipe covers 162.3–162.9.

const t07_SY = 700;                                              // stage deck top (world y)
const t07_PINK = '#FF3FA4';                                      // CAPEX neon
const t07_dbl = t => OFF + (t - OFF) * 2;                        // feed move() a double-time clock (hardcore half-beats)
const t07_shake = (t, a) => [Math.sin(t * 91.7) * a + Math.sin(t * 57.3) * a * .5, Math.cos(t * 83.1) * a * .7];

// ---------- set ----------
function t07_bg(t, o = {}) {
  paint(rectPts(-80, -80, W + 160, H + 160), { wash: TK.soot, fill: '#2A1A18', fillOp: 120, bleed: .1, tex: .5, border: .2, ink: null });
  glowAt(960, 1060, 900, TK.orange, 70 + 30 * pulse2(t, 5));
  glowAt(960, 1120, 520, TK.yellow, 50);
  // stage beams from the truss, swinging on the half-beat
  const hb = bpOf(t) * 2, cols = o.beamCols || [TK.orange, TK.yellow, TK.ember];
  for (let i = 0; i < 6; i++) {
    const bx = 170 + i * 316, sw = Math.sin(hb * Math.PI * .5 + i * 1.3) * .45 + (i < 3 ? .25 : -.25), len = 1150, spr = .11;
    const a = Math.PI / 2 + sw, p1 = [bx + Math.cos(a - spr) * len, 40 + Math.sin(a - spr) * len], p2 = [bx + Math.cos(a + spr) * len, 40 + Math.sin(a + spr) * len];
    paint([[bx - 10, 40], [bx + 10, 40], p1, p2], { fill: cols[i % cols.length], fillOp: (o.beam ?? 55) * (.6 + .4 * pulse2(t + i * .07, 4)), bleed: .25, tex: .2, border: .1, ink: null });
  }
  // truss + cans
  paint(rectPts(-40, 14, W + 80, 30), { wash: TK.steelDk, ink: PAL.ink, sw: .7 });
  for (let i = 0; i < 24; i++) inkLine([[i * 84, 14], [i * 84 + 42, 44], [i * 84 + 84, 14]], .5, TK.steelLt, 'inkfine', 0);
  for (let i = 0; i < 6; i++) paint(rrPts(150 + i * 316, 38, 40, 34, 8), { wash: TK.sootLt, ink: PAL.ink, sw: .6 });
}
// the GPU stage over the furnace: two courses of cards under a steel deck, brick furnace cheeks, fire in front
function t07_stage(t, o = {}) {
  const glowHB = Math.floor(bpOf(t) * 2);
  glowAt(960, t07_SY + 200, 700, TK.orange, 60);
  for (let r = 1; r >= 0; r--) for (let i = 0; i < 5; i++) {
    const x = 380 + i * 290 + (r ? 145 : 0), y = t07_SY + 64 + r * 112;
    if (r && i === 4) continue;
    gpuCard(x, y, .8, t, { glow: (i + r + glowHB) % 3 === 0 ? .8 : 0, fans: r === 0 });
  }
  paint(rectPts(210, t07_SY - 6, 1500, 24, 1), { wash: TK.steel, fill: TK.steelDk, fillOp: 90, tex: .5, ink: PAL.ink, sw: 1.1 });
  inkLine([[220, t07_SY + 2], [1700, t07_SY + 2]], .7, TK.steelLt, 'inkfine', 0);
  for (const sx of [-1, 1]) {                                                    // furnace brick cheeks
    const x0 = sx < 0 ? -40 : 1720;
    paint(rectPts(x0, t07_SY + 40, 240, 420, 2), { wash: '#5A2A20', fill: TK.emberDk, fillOp: 90, tex: .6, border: .4, ink: PAL.ink, sw: .9 });
    for (let r = 0; r < 8; r++) {
      inkLine([[x0 + 4, t07_SY + 80 + r * 44], [x0 + 236, t07_SY + 80 + r * 44]], .45, '#2A1210', 'inkfine', 0);
      for (let c = 0; c < 3; c++) { const bx = x0 + 40 + c * 80 + (r % 2) * 40; inkLine([[bx, t07_SY + 80 + r * 44], [bx, t07_SY + 124 + r * 44]], .4, '#2A1210', 'inkfine', 0); }
    }
  }
  const fh = (o.fire ?? 260) * (1 + .15 * pulse2(t, 5));
  for (let i = 0; i < 5; i++) fire(160 + i * 400, 1100, 520, fh * (.85 + .3 * hash(i + 3)), t + i * 1.7, { seed: 71 + i * 13, n: 5, k: o.fireK ?? 1, glow: i % 2 === 0 });
}

// Clawd's shovel: a handle out along the arm with a scoop and a token riding it
const t07_shovel = full => (u, sw) => {
  inkLine([[-u, 0], [3.4 * u, 0]], sw * 1.6, TK.copper, 'ink', 0);
  paint([[3.2 * u, -.9 * u], [5 * u, -1.1 * u], [5.2 * u, 1.1 * u], [3.2 * u, .9 * u]], { wash: TK.steelLt, ink: PAL.ink, sw: sw * .6 });
  if (full) token(4.2 * u, -1.1 * u, u * .85, {});
};
// a picket sign centred at (x, y), board w x h, rotated / scaled (for the kicks)
function t07_sign(txt, x, y, s, rot, col = TK.ember) {
  const w = 300 * s, h = 110 * s;
  inkLine(rotPts([[x, y], [x, y + 230 * s]], x, y, rot), 7 * s, TK.copper, 'ink', 0);            // post reaches the deck
  paint(rotPts(rectPts(x - w / 2, y - h / 2, w, h, 1.5 * s), x, y, rot), { wash: TK.cream, fill: '#E9DCC4', fillOp: 70, tex: .5, ink: PAL.ink, sw: clamp(s, .3, 1.2) });
  paint(rotPts(rectPts(x - w / 2 + 8 * s, y - h / 2 + 8 * s, w - 16 * s, h - 16 * s), x, y, rot), { ink: col, sw: clamp(s * .8, .3, 1) });
  letter(txt, x, y + 2 * s, 58 * s, col, { font: ruFont(58 * s), rot, ink: false });
}
function t07_neon(txt, x, y, size, col, k, font) {
  const tw = textW(txt, font);
  if (k > .02) {
    paint(ellPts(x, y, tw * .62, size * .95, 24), { fill: col, fillOp: 110 * k, bleed: .35, tex: .2, border: .1, ink: null });
    glowAt(x, y + size * 2.2, tw * .5, col, 40 * k);                            // spill on the deck
  }
  letter(txt, x, y, size, k > .3 ? mixCol(col, '#FFF4FA', k * .8) : '#3E3439', { font, stroke: k > .3 ? col : '#241C20', ink: false });
}
function t07_spinner(x, y, r, t) {
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * TAU - Math.PI / 2, lit = frac(i / 10 - t * 1.4), op = 60 + 195 * Math.pow(1 - lit, 3);
    paint(ellPts(x + Math.cos(a) * r, y + Math.sin(a) * r, r * .14, r * .14, 8), { wash: '#8FB4FF', washOp: op, ink: null });
  }
}
// gold starburst + ring from a slam at age
function t07_burst(x, y, age, R) {
  if (age < 0 || age > 1.2) return;
  const k = easeOut(age / .5), fade = 1 - seg(age, .3, 1.2);
  for (let i = 0; i < 26; i++) {
    const a = i / 26 * TAU + hash(i) * .2, r1 = R * (.25 + k * (.9 + hash(i + 4) * .9)), wd = .05 + hash(i + 8) * .04;
    paint([[x + Math.cos(a - wd) * R * .15, y + Math.sin(a - wd) * R * .15], [x + Math.cos(a) * r1, y + Math.sin(a) * r1], [x + Math.cos(a + wd) * R * .15, y + Math.sin(a + wd) * R * .15]],
      { wash: i % 2 ? TK.yellow : TK.gold, washOp: 230 * fade, ink: null });
  }
  if (fade > .05) paint(ellPts(x, y, R * 1.6 * k, R * 1.1 * k, 36), { ink: TK.yellowLt, sw: 3 * fade + .3 });
}

// the two performers, standing on the deck
function t07_band(t, o = {}) {
  const tt = t07_dbl(t), m = move(o.ceoMove || 'stomp', tt, 1), c = move(o.clawdMove || 'stomp', tt, 2);
  ceoClawd(o.ceoX ?? 760, t07_SY, o.u ?? 30, { ...m, eyes: 'happy', mouth: 'grin', click: pulse2(t, 7), aR: 1.2 + .5 * pulse2(t, 5), ...(o.ceo || {}) });
  clawd(o.clawdX ?? 1160, t07_SY, o.u ?? 30, { ...c, eyes: 'angry', mouth: 'O', armL: fist(PAL.clay), armR: fist(PAL.clay), aL: 1.4 + .4 * pulse2(t, 5), aR: 1.6, ...(o.clawd || {}) });
}

// ---------- 146.3 «Жги токены! Жги токены!» ----------
function t07_shout(t, lt) {
  const [sx, sy] = t07_shake(t, 10 * pulse2(t, 6));
  t07_bg(t, { beam: 70 });
  camBegin(960 + sx, 500 + sy - lt * 20, lerp(1.18, 1.0, easeOut(lt / 1.4)) + .035 * pulse2(t, 6));
  tokenRain(t, { n: 14, seed: 3, r: 20, to: [960, 1020], per: 1.1, burn: .6 });
  t07_stage(t, { fire: 300 });
  t07_band(t, { ceoMove: 'hop', clawdMove: 'stomp' });
  camEnd();
  punkText('ЖГИ ТОКЕНЫ!', 960, 130, 100, t, 146.48, { seed: 2 });
  if (t > 147.46) punkText('ЖГИ ТОКЕНЫ!', 960, 275, 120, t, 147.46, { seed: 9 });
  flash(.75 * (1 - seg(lt, 0, .3)), TK.yellowLt);                                        // key-change hit on the cut
}

// ---------- 148.6 «Пока лимит не обнулён!» — each click of the CEO's clicker drains a chunk, twice a beat ----------
function t07_drain(t, lt) {
  const t0 = 148.68, hb = Math.max(0, bpOf(t) * 2 - bpOf(t0) * 2), n = Math.floor(hb), f = frac(hb);
  const v = Math.max(0, .64 - (n + easeOut(clamp(f * 4))) * .08), zero = v <= 0;
  const [sx, sy] = t07_shake(t, zero ? 12 * pulse2(t, 5) : 4 * pulse2(t, 8));
  t07_bg(t, { beamCols: [TK.ember, TK.orange] });
  camBegin(1000 + sx, 600 + sy, 1.06);
  t07_stage(t, { fire: 330 });
  // CEO clicks at the bar; Clawd shovels the pile off the deck edge into the fire, on every half-beat
  ceoClawd(700, t07_SY, 30, { ...move('stomp', t07_dbl(t), 1), eyes: 'narrow', mouth: 'smile', aR: 2.1, click: pulse2(t, 9), aL: .3 });
  for (let i = 0; i < 9; i++) token(1400 + (i % 4) * 34 - (i > 3 ? -17 : 0), t07_SY - 14 - Math.floor(i / 4) * 24, 17, { rot: i });
  const sp = frac(bpOf(t) * 2), swing = sp < .35 ? lerp(-.5, 1.3, easeOut(sp / .35)) : lerp(1.3, -.5, ease((sp - .35) / .65));
  clawd(1170, t07_SY, 30, { ...move('idle', t07_dbl(t), 2), eyes: 'angry', mouth: 'grin', aR: swing, armR: t07_shovel(sp > .5), aL: .1 });
  for (let k = 0; k < 3; k++) {                                                 // tokens thrown off the blade into the furnace
    const age = frac(bpOf(t) * 2) * BEAT / 2 + k * BEAT / 2 - .06; if (age < 0) continue;
    const p = age / (BEAT * 1.5); if (p > 1) continue;
    token(lerp(1390, 1600 + k * 40, p), t07_SY - 170 + (-260 * p + 700 * p * p), 20, { spin: t * 2 + k, burn: p });
  }
  camEnd();
  limitBar(260, 150, 1400, v, { h: 90, burn: zero ? 0 : 1, glow: .5 * pulse2(t, 6) });
  stamp('×2 СКОРОСТЬ', 1500, 330, 54, t, 148.96, { col: TK.yellow, rot: .1 });
  if (zero) stamp('ОБНУЛЁН', 960, 350, 90, t, t0 + (Math.ceil(.64 / .08)) * BEAT / 2, { rot: -.12 });
}

// ---------- 151.2 «Доходы — потом! Прибыль — потом!» ----------
function t07_kicks(t, lt) {
  const k1 = 151.94, k2 = 153.18;
  const [sx, sy] = t07_shake(t, 14 * (Math.exp(-Math.max(0, t - k1) * 10) * (t > k1) + Math.exp(-Math.max(0, t - k2) * 10) * (t > k2)));
  t07_bg(t);
  camBegin(lerp(900, 1020, ease(lt / 2.4)) + sx, 560 + sy, 1.12);
  t07_stage(t);
  const fly = (txt, kt, x0, tx, ty, dir, col) => {
    const p = seg(t, kt, kt + 1.05);
    if (p <= 0) return t07_sign(txt, x0, t07_SY - 230, 1, -.04 * dir + Math.sin(t * 9) * .01, col);
    if (p < 1) return t07_sign(txt, lerp(x0, tx, easeOut(p)), lerp(t07_SY - 230, ty, easeOut(p)) - Math.sin(p * Math.PI) * 120, lerp(1, .08, easeOut(p)), dir * p * 7, col);
    const tw = 1 - seg(t, kt + 1.05, kt + 1.6);
    if (tw > 0) paint(starPts(tx, ty, 34 * tw * (1 + .3 * Math.sin(t * 30)), .3), { wash: TK.yellowLt, ink: null });
  };
  fly('ДОХОДЫ', k1, 420, 230, 170, -1, TK.green);
  fly('ПРИБЫЛЬ', k2, 1510, 1720, 190, 1, TK.blue);
  // CEO kicks left on «потом», Clawd kicks right on the second «потом»
  const kk = (kt, side) => { const a = t - kt + .14; return a > 0 && a < .5 ? side * Math.sin(clamp(a / .5) * Math.PI) : 0; };
  const c1 = kk(k1, -1), c2 = kk(k2, 1);
  ceoClawd(780, t07_SY, 30, { ...move('idle', t07_dbl(t), 1), kick: c1, rot: -c1 * .08, eyes: t > k1 ? 'happy' : 'narrow', mouth: 'smile', aR: 1.2, aL: -.3 - c1 * .6 });
  clawd(1150, t07_SY, 30, { ...move('idle', t07_dbl(t), 2), kick: c2, rot: -c2 * .08, eyes: t > k2 ? 'happy' : 'angry', mouth: t > k2 ? 'grin' : 'flat', aL: 1.2, aR: -.3 + c2 * .6 });
  camEnd();
  if (t > k1) stamp('ПОТОМ', 420, 470, 70, t, k1 + .12, { col: TK.green, rot: -.15 });
  if (t > k2) stamp('ПОТОМ', 1510, 470, 70, t, k2 + .12, { col: TK.blue, rot: .12 });
}

// ---------- 153.6 «ЭЙДЖИАЙ — скоро! CAPEX — сейчас!» ----------
function t07_capexShot(t, lt) {
  const on = 155.02, flick = t < on ? 0 : t < on + .28 ? (hash(Math.floor(t * 30)) > .45 ? 1 : .15) : 1, blaze = flick * (.85 + .15 * pulse2(t, 5));
  const [sx, sy] = t07_shake(t, t > on ? 8 * pulse2(t, 6) : 0);
  t07_bg(t, { beam: 35 + 40 * blaze, beamCols: blaze > .5 ? [t07_PINK, TK.orange, TK.yellow] : [TK.steelLt] });
  camBegin(lerp(760, 960, ease(seg(t, on - .1, on + .5))) + sx, lerp(470, 540, ease(seg(t, on - .1, on + .5))) + sy, lerp(1.22, 1.0, ease(seg(t, on - .1, on + .5))));
  // AGI: a small cold sign, forever loading
  paint(rrPts(200, 170, 380, 250, 20, 1.5), { wash: '#1E2230', fill: TK.steelDk, fillOp: 90, tex: .5, ink: TK.steelLt, sw: .8 });
  t07_neon('AGI', 390, 250, 90, '#8FB4FF', .75, '900 90px "Arial Black", Impact, sans-serif');
  t07_spinner(250, 355, 22, t);
  if (t > 154.54) letter('СКОРО…', 300, 356, 44, '#B8CCFF', { font: ruFont(44), align: 'left', ink: false });
  // CAPEX: huge frame of neon tubes on the truss
  paint(rrPts(700, 110, 1100, 330, 30, 1.5), { wash: '#201418', fill: TK.soot, fillOp: 90, tex: .5, ink: blaze > .5 ? t07_PINK : TK.sootLt, sw: 1.4 });
  t07_neon('CAPEX', 1250, 285, 230, t07_PINK, blaze, '900 230px "Arial Black", Impact, sans-serif');
  if (blaze > .5) glowAt(1250, 700, 700, t07_PINK, 45);
  t07_stage(t, { fire: 280 + 80 * blaze });
  // both look up at it; the CEO presents it with the clicker
  ceoClawd(820, t07_SY, 30, { ...move('idle', t07_dbl(t), 1), eyes: blaze > .5 ? 'spark' : 'look', lookX: -1, lookY: -1, mouth: 'smile', aR: blaze > .5 ? 2.3 : .6, click: pulse2(t, 7) * blaze });
  clawd(1220, t07_SY, 30, { ...move(blaze > .5 ? 'hop' : 'idle', t07_dbl(t), 2), eyes: blaze > .5 ? 'spark' : 'look', lookX: -1, lookY: -1, mouth: blaze > .5 ? 'O' : 'flat', aL: 1.5 * blaze, aR: 1.5 * blaze });
  camEnd();
  if (t > 155.54) stamp('СЕЙЧАС!', 1650, 420, 64, t, 155.54, { col: TK.yellow, rot: -.1 });
}

// ---------- 156.2 «Плюс процент к бенчмарку» — the y-axis starts at 87 ----------
function t07_bench(t, lt) {
  const grow = backOut(seg(t, 156.6, 157.15)), v = lerp(87.1, 88.1, ease(seg(t, 156.6, 157.15)));
  t07_bg(t, { beam: 40 });
  camBegin(lerp(930, 1000, lt / 2.1), lerp(520, 480, lt / 2.1), lerp(1.0, 1.08, lt / 2.1));
  const bx = 610, by = 100, bw = 760, bh = 560, gx = bx + 140, g0 = by + bh - 70, gh = bh - 170;   // board, axis origin at 87 %
  paint(rectPts(bx - 12, by - 12, bw + 24, bh + 24, 1), { wash: TK.soot, ink: null });
  paint(rectPts(bx, by, bw, bh, 1), { wash: '#FBF8F2', fill: '#E9E2D6', fillOp: 60, tex: .4, ink: null });
  letter('БЕНЧМАРК', bx + 40, by + 50, 46, '#1E1E24', { font: ruFont(46), align: 'left', ink: false });
  inkLine([[gx, g0 - gh - 10], [gx, g0], [bx + bw - 40, g0]], 1.4, '#33333A', 'ink', 0);
  inkLine([[gx - 14, g0 + 6], [gx - 4, g0 - 8], [gx + 6, g0 + 6], [gx + 16, g0 - 8]], 1, '#33333A', 'ink', 0);   // axis break
  const Y = p => g0 - (p - 87) / 1.2 * gh;
  for (const p of [87, 87.5, 88]) { letter(p.toFixed(1) + '%', gx - 16, Y(p), 26, '#55555F', { font: ruFont(26), align: 'right', ink: false }); inkLine([[gx, Y(p)], [bx + bw - 40, Y(p)]], .4, '#B8B0A4', 'inkfine', 0); }
  const bar = (x, p, col, lab) => {
    const top = Y(p);
    paint(rectPts(x, top, 170, g0 - top, 1), { wash: col, fill: mixCol(col, TK.soot, .3), fillOp: 70, tex: .5, ink: PAL.ink, sw: .9 });
    letter(lab, x + 85, g0 + 32, 28, '#33333A', { font: ruFont(28), ink: false });
    letter(p.toFixed(1) + '%', x + 85, top - 30, 40, '#1E1E24', { font: ruFont(40), ink: false });
  };
  bar(gx + 120, 87.1, TK.steelLt, 'БЫЛО');
  if (grow > .01) bar(gx + 390, lerp(87.02, v, grow), TK.orange, 'СТАЛО');
  if (t > 157.2) {
    inkLine([[gx + 300, Y(87.35)], [gx + 370, Y(87.85)]], 3, TK.ember, 'ink', .3);
    paint([[gx + 385, Y(87.97)], [gx + 345, Y(87.9)], [gx + 380, Y(87.78)]], { wash: TK.ember, ink: null });
  }
  letter('* шкала с 87%', bx + 30, by + bh - 22, 20, '#8A8A95', { font: ruFont(20), align: 'left', ink: false });
  t07_stage(t, { fire: 220 });
  ceoClawd(1560, t07_SY, 30, { ...move('idle', t07_dbl(t), 1), flip: true, eyes: 'happy', mouth: 'smile', aR: 1.9, click: pulse2(t, 7) });
  clawd(410, t07_SY, 30, { ...move('idle', t07_dbl(t), 2), eyes: t > 157.2 ? 'narrow' : 'normal', mouth: 'flat', aL: .1, aR: .1 });
  camEnd();
  if (t > 157.2) stamp('+1%', 1540, 300, 110, t, 157.2, { col: TK.ember, rot: .12 });
}

// ---------- 158.3 «Плюс триста миллиардов!» — counter slam, gold explosion, token rain ----------
function t07_billions(t, lt) {
  const slam = 159.04, age = t - slam, done = age >= 0;
  const val = done ? 300e9 : Math.exp(lerp(Math.log(1e9), Math.log(300e9), easeIn(seg(t, 158.4, slam))));
  const [sx, sy] = t07_shake(t, done ? 26 * Math.exp(-age * 5) + 6 * pulse2(t, 6) : 3);
  t07_bg(t, { beam: done ? 80 : 45, beamCols: [TK.yellow, TK.gold, TK.orange] });
  camBegin(960 + sx, 480 + sy, done ? lerp(1.08, .96, easeOut(age / 2.5)) : 1.0 + seg(t, 158.3, slam) * .08);
  if (done) tokenRain(t, { n: 48, seed: 11, r: 15 });
  t07_stage(t, { fire: done ? 380 : 260 });
  t07_band(t, { ceoMove: done ? 'hop' : 'idle', clawdMove: done ? 'hop' : 'idle',
    ceo: { eyes: done ? 'spark' : 'narrow', aR: done ? 2.4 : 1.0 }, clawd: done ? { eyes: 'spark', mouth: 'O' } : { eyes: 'scared', mouth: 'o', aL: .4, aR: .4 } });
  if (done && age < 1.6) for (let i = 0; i < 12; i++) {                         // tokens blown out of the slam
    const a = hash(i + 50) * TAU, v = 900 + hash(i + 51) * 900, p = age;
    token(930 + Math.cos(a) * v * p, 330 + Math.sin(a) * v * p * .7 + 900 * p * p, 22 + hash(i + 52) * 16, { spin: t * 2 + i, glow: .4 * (1 - p / 1.6) });
  }
  camEnd();
  t07_burst(930, 330, age, 700);
  if (done) for (let i = 0; i < 11; i++) {                                      // big coins tumbling past the lens
    const y = -160 + frac(hash(i + 90) + (t - slam) * (.55 + hash(i + 91) * .35)) * (H + 320), x = 80 + i * 175 + Math.sin(t * 2 + i) * 50;
    token(x, y, 40 + hash(i + 92) * 18, { spin: t * (.7 + hash(i + 93)) + i, rot: Math.sin(t + i) * .5 });
  }
  punkText('ПЛЮС', 930, 150, 90, t, 158.4, { seed: 7 });
  const sz = done ? 140 * (1 + .35 * Math.exp(-age * 14)) : 140;
  counter(900, 330, sz, val, { col: done ? TK.yellowLt : TK.yellow, suffix: '$' });
  flash(done ? .9 * (1 - seg(age, 0, .22)) : 0, TK.yellowLt);
}

chapter('finale', 146.3, 162.6, [
  [146.3, t07_shout],
  [148.6, t07_drain],
  [151.2, t07_kicks],
  [153.6, t07_capexShot],
  [156.2, t07_bench],
  [158.3, t07_billions],
]);
