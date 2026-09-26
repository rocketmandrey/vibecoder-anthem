// a05_chorus2.js: «Жги токены» v2, chorus 2 (91.8–116.3). OUTDOOR NIGHT: the token factory seen from the city.
// Striped chimneys burn tokens, their smoke writes the lyric; chimney 3 carries the weekly-limit gauge that drains all
// chorus long; a public counter on the facade rolls to 1 000 000; agents march out of the gate in columns; GPUs arrive
// by cargo drone (a heavy-lift one on the second «железа»); «Это полезно!» on a stock-photo LED billboard that stutters on. 113.6 break: the gauge hits 0%, the city,
// chimneys and facade black out on the hits, one spotlight stays on CEO-Clawd on the roof → the bridge.
// World coords = screen coords of the wide shot (horizon y 645); the shots are cameras into that one world.

const A5 = {
  sky: '#0A0C22', sky2: '#1C1745', haze: '#3B2450', ground: '#0C0D1A', city: '#161733', cityDk: '#0F1026',
  brick: '#6A3226', brickDk: '#3A1B16', red: '#B8322A', white: '#E6DCC6', smoke: '#6C6680', smokeLt: '#CFCAD8',
  win: '#FFB347', grid: '#3B2E6A', moon: '#EDE6CF'
};
const a05_ZHGI = [91.86, 93.66, 96.86, 98.78], a05_TOK = [92.94, 94.2, 98.02, 99.24];
const a05_CH = [[640, 170], [790, 120], [1130, 140], [1280, 190]];          // chimney [cx, topY], base at y 645
const a05_HY = 645;
const a05_limit = t => clamp(lerp(.92, 0, seg(t, 91.8, 113.6)));
function a05_count(t) {
  if (t < 101.26) return 999997 + seg(t, 99.92, 100.04) + seg(t, 100.66, 100.78) + seg(t, 101.14, 101.26);
  return 1000000 + (t - 101.26) * 37;
}

const a05_flick = (t, a) => t >= a && t < a + .18 && frac(t * 29) < .45 ? .3 : 1;   // LED power-on stutter
// light levels (0..1) over the chapter: the break kills them on the hits
function a05_lights(t) {
  const off = (a) => t >= a ? (t < a + .08 && frac(t * 40) < .5 ? .6 : 0) : 1;   // flicker, then dark
  return {
    city: off(114.15), fire: off(114.79), facade: off(115.26), sky: off(115.74),
    banner: (t < 110.88 ? .18 : t < 111.64 ? .6 : 1) * a05_flick(t, 110.88) * a05_flick(t, 111.64)
  };
}

// ---------- smoke lettering: puffs out of a chimney and settles into a word ----------
function a05_smokeWord(txt, ox, oy, x, y, size, t, t0, o = {}) {
  const age = t - t0, life = o.life ?? 1.6; if (age < 0 || age > life) return;
  const font = ruFont(size), chars = [...txt], ws = chars.map(c => textW(c, font) * .98 + size * .04);
  const tw = ws.reduce((a, b) => a + b, 0), burnA = o.burnAt != null ? t - o.burnAt : -1;
  let cx = x - tw / 2;
  chars.forEach((c, i) => {
    const w = ws[i], sx = cx + w / 2; cx += w;
    const la = age - i * .045, q = easeOut(la / .35); if (la < 0) return;
    const rise = age * 34, px = lerp(ox, sx, q) + Math.sin(t * 2.2 + i) * 5;
    // the rising word stops short of the top edge (a full letter height plus margin below the frame top)
    const yMin = CAM ? CAM.cy - H / 2 / CAM.zoom + size * .7 + 24 / CAM.zoom : -1e9;
    const py = Math.max(yMin, lerp(oy, y, q) - rise) + Math.sin(t * 3 + i * 1.7) * 4;
    const fade = 1 - seg(age, life - .45, life), burn = burnA > 0 ? clamp(burnA / .25) : 0, a = Math.min(1, la * 10) * fade * (1 - seg(burnA, .15, .45));
    if (a < .02) return;
    for (let k = 0; k < 2; k++) {                                              // soft puffs behind each letter
      const r = size * (.34 + .12 * k) * (.6 + .4 * q);
      paint(ellPts(px + (hash(i * 3 + k) - .5) * size * .3, py + (k - .5) * size * .25, r, r * .8, 12, r * .08),
        { fill: burn > .1 ? A2.sodium : A5.smoke, fillOp: 120 * a, bleed: .3, tex: .4, border: .5, ink: null });
    }
    letter(c, px, py, size * (.4 + .6 * q) * (1 + age * .06), burn > .1 ? mixCol(A5.smokeLt, A2.sodium, burn) : A5.smokeLt,
      { font: ruFont(size * (.4 + .6 * q) * (1 + age * .06)), ink: false, alpha: a, stroke: '#2A2638' });
  });
}

// ---------- world pieces ----------
// ponytail: horizontal culling against the active camera only (the shots never rotate)
const a05_vis = (x0, x1) => !CAM || (x1 > CAM.cx - W / 2 / CAM.zoom - 40 && x0 < CAM.cx + W / 2 / CAM.zoom + 40);
function a05_sky(t, L) {
  paint(rectPts(-800, -600, 3600, 1300), { wash: A5.sky, fill: '#15123A', fillOp: 90, tex: .4, border: .2, ink: null });
  paint(rectPts(-800, 330, 3600, 330), { wash: A5.sky2, washOp: 170, ink: null });
  paint(rectPts(-800, 520, 3600, 140), { wash: A5.haze, washOp: 150 * (.4 + .6 * L.fire), ink: null });
  paint(ellPts(960, 560, 820, 260, 24), { fill: A2.sodium, fillOp: 70 * L.fire, bleed: .3, tex: .3, border: .1, ink: null });  // factory glow on the smoke
  for (let i = 0; i < 34; i++) {
    const x = -300 + hash(i * 3.3) * 2500, y = -200 + hash(i * 7.1) * 620; if (!a05_vis(x, x)) continue;
    const tw = .5 + .5 * Math.sin(t * (2 + hash(i) * 3) + i);
    const r = 1.6 + hash(i + 9) * 2.4;
    paint(ellPts(x, y, r * (.6 + tw * .5), r * (.6 + tw * .5), 6), { wash: '#F4EFFF', washOp: 200 * L.sky, ink: null });
  }
  // the moon is a token, of course
  if (L.sky > .05) {
    paint(ellPts(300, 160, 58, 58, 22), { wash: A5.moon, washOp: 235 * L.sky, fill: '#C9C0A4', fillOp: 60 * L.sky, tex: .5, ink: null });
    const g = tokenT(58, '#BDB292'); paint(g.pts.map(([x, y]) => [300 + x, 160 + y]), { wash: g.col, washOp: 150 * L.sky, ink: null });
  }
}
function a05_city(t, L) {
  // skyline on both sides of the factory, windows lit, pulsing with the hits
  const pk = hitK(t, HITS, .25);
  for (let i = 0; i < 26; i++) {
    const left = i < 10, x = left ? -620 + i * 80 : 1360 + (i - 10) * 72, w = 60 + hash(i * 2.3) * 50;
    const h = 70 + hash(i * 5.7) * (left ? 150 : 190), y = a05_HY - h; if (!a05_vis(x, x + w)) continue;
    paint(rectPts(x, y, w, h + 4), { wash: i % 2 ? A5.city : A5.cityDk, ink: null });
    if (L.city < .02) continue;
    for (let r = 0; r < Math.floor(h / 34); r++) for (let c = 0; c < 2; c++) {
      const hh = hash(i * 13 + r * 3 + c * 7); if (hh < .45) continue;
      const on = L.city * (hh > .85 ? .6 + .4 * pk : 1);
      paint(rectPts(x + 12 + c * (w - 36) * .9, y + 14 + r * 34, 12, 14), { wash: A5.win, washOp: 220 * on, ink: null });
    }
  }
  // the ground: a street grid in perspective feeding power into the factory
  paint(rectPts(-800, a05_HY, 3600, 900), { wash: A5.ground, ink: null });
  const vx = 960, vy = 600;
  for (let k = -9; k <= 9; k++) {
    const x1 = vx + k * 520, y1 = 1500, x0 = lerp(vx, x1, (a05_HY + 4 - vy) / (y1 - vy));
    if (!a05_vis(Math.min(x0, x1), Math.max(x0, x1))) continue;
    inkLine([[x0, a05_HY + 4], [x1, y1]], 1.1, A5.grid, 'inkfine', 0);
    if (L.city < .02) continue;
    for (let j = 0; j < 2; j++) {                                              // power pulses flowing toward the factory
      const p = frac(-t * (.35 + hash(k + 20) * .2) + hash(k * 3 + j)), q = p * p;
      const px = lerp(x0, x1, q), py = lerp(a05_HY + 4, y1, q), r = 3 + 9 * q;
      paint(ellPts(px, py, r * 2.2, r, 10), { wash: j ? A2.acid : A2.sodium, washOp: (150 + 100 * pk) * L.city, ink: null });
    }
  }
  for (let q = 1; q < 7; q++) { const y = a05_HY + 4 + Math.pow(q / 7, 2) * 855; inkLine([[-800, y], [2800, y]], .9, A5.grid, 'inkfine', 0); }
}
function a05_chimney(i, t, L, flare) {
  const [cx, ty] = a05_CH[i], by = a05_HY, wb = 38, wt = 24;
  const X = (y, s) => cx + s * lerp(wt, wb, (y - ty) / (by - ty));
  paint([[X(ty, -1), ty], [X(ty, 1), ty], [X(by, 1), by], [X(by, -1), by]], { wash: A5.white, fill: '#A89E8C', fillOp: 90, tex: .5, border: .4, ink: PAL.ink, sw: .8 });
  for (let y = ty; y < by; y += 110) {                                         // red bands
    const y2 = Math.min(by, y + 55);
    paint([[X(y, -1), y], [X(y, 1), y], [X(y2, 1), y2], [X(y2, -1), y2]], { wash: A5.red, washOp: 235, ink: null });
  }
  paint(rectPts(X(ty, -1) - 5, ty - 6, (X(ty, 1) - X(ty, -1)) + 10, 14), { wash: A2.gunDk, ink: PAL.ink, sw: .6 });
  paint([[X(ty, -1), ty], [X(ty, 1), ty], [X(by, 1), by], [X(by, -1), by]], { fill: A2.gunDk, fillOp: 70 * (1 - L.facade * .6), bleed: .1, tex: .3, border: .8, ink: null });
  if (i === 2) {                                                               // the weekly-limit gauge painted on chimney 3
    const v = a05_limit(t), gy0 = 300, gy1 = 580, gx = cx - 13, gh = gy1 - gy0;
    const col = v > .5 ? mixCol(TK.orange, TK.green, (v - .5) * 2) : mixCol(TK.ember, TK.orange, v * 2);
    paint(rrPts(gx - 4, gy0 - 4, 34, gh + 8, 8), { wash: A2.gunDk, ink: PAL.ink, sw: .7 });
    if (v > .01) paint(rectPts(gx, gy1 - gh * v, 26, gh * v), { wash: col, washOp: 240 * Math.max(.35, L.facade), ink: null });
    for (let q = 1; q < 4; q++) inkLine([[gx, gy0 + gh * q / 4], [gx + 8, gy0 + gh * q / 4]], .5, A5.white, 'inkfine', 0);
    letter(Math.round(v * 100) + '%', cx, gy0 - 22, 20, v < .05 ? '#FF3A3A' : A5.white, { font: ruFont(20), ink: false, alpha: Math.max(.3, L.facade) });
  }
  // fire at the top, burning a token
  const k = L.fire * (.75 + .9 * flare);
  if (k > .03) {
    fire(cx, ty - 2, 64 + 30 * flare, 120, t + i * 1.7, { k, seed: 30 + i * 11 });
    const bt = t * .9 + i * .37, bp = frac(bt), bi = Math.floor(bt);
    token(cx + (hash(bi + i * 5) - .5) * 24, ty - 30 - bp * 90, 16 * (1 - bp * .6), { burn: .5 + bp * .5, spin: t * 1.5 + i });
  }
  smoke(cx + 10, ty - 90, t + i * 1.3, { n: 4, h: 420, r: 46, per: 3.2, col: A5.smoke, seed: i * 17 + 3 });
}
function a05_factory(t, L) {
  const f = L.facade;
  // glass office wing with the LED billboard on its face
  if (a05_vis(160, 550)) {
  paint(rectPts(160, 330, 390, a05_HY - 330 + 4), { wash: '#1A2236', fill: '#10162A', fillOp: 80, tex: .4, ink: PAL.ink, sw: .8 });
  for (let c = 1; c < 8; c++) inkLine([[160 + c * 48.75, 330], [160 + c * 48.75, a05_HY]], .6, '#34406A', 'inkfine', 0);
  a05_billboard(190, 356, 330, 212, t, Math.max(.12, L.banner * f));
  for (let c = 0; c < 6; c++) paint(rectPts(190 + c * 58, 590, 34, 36), { wash: A5.win, washOp: 170 * f * (hash(c + 4) > .3 ? 1 : .2), ink: null });
  }
  // main hall: brick, sawtooth roof, glowing windows, the gate
  paint(rectPts(560, 470, 800, a05_HY - 470 + 4, 1), { wash: A5.brickDk, fill: A5.brick, fillOp: 90, tex: .6, border: .4, ink: PAL.ink, sw: 1 });
  for (let s = 0; s < 8; s++) paint([[560 + s * 100, 470], [560 + s * 100, 424], [660 + s * 100, 470]], { wash: '#2A1A1C', ink: PAL.ink, sw: .7 });
  for (let s = 0; s < 8; s++) paint([[562 + s * 100, 466], [562 + s * 100, 434], [600 + s * 100, 452]], { wash: A5.win, washOp: 150 * f, ink: null });
  for (let w = 0; w < 10; w++) {
    if (w === 4 || w === 5) continue;
    const wx = 590 + w * 76; paint(rectPts(wx, 564, 40, 60), { wash: A5.win, washOp: 220 * f * (.8 + .2 * Math.sin(t * 9 + w)), ink: PAL.ink, sw: .5 });
    inkLine([[wx + 20, 564], [wx + 20, 624]], .5, A5.brickDk, 'inkfine', 0);
  }
  paint(rectPts(900, 566, 120, a05_HY - 566 + 2), { wash: '#1A0E08', ink: PAL.ink, sw: .8 });
  paint(rectPts(906, 600, 108, 45), { fill: A2.sodium, fillOp: 150 * f, bleed: .2, tex: .3, ink: null });
  hazard(894, 556, 132, 10);
  // the public counter panel above the gate
  paint(rectPts(772, 480, 376, 72, 1), { wash: A2.gunDk, ink: PAL.ink, sw: .9 });
  letter('СОЖЖЕНО ТОКЕНОВ', 960, 491, 12, f > .1 ? A2.hazard : '#4A4450', { font: ruFont(12), ink: false });
  counter(960, 523, 28, a05_count(t), { col: f > .1 ? A2.hazard : '#3A3440', box: '#15161C' });
  // a skip hoist feeding tokens into chimney 4
  if (a05_vis(1290, 1600)) { push(); translate(1296, 204); rotate(1.02);
  conveyor(0, 0, 520, t, { speed: -150, gap: 110, legs: 0, h: 22, size: .5, seed: 5 });
  pop(); }
  for (let i = 0; i < 4; i++) if (a05_vis(a05_CH[i][0] - 60, a05_CH[i][0] + 60)) a05_chimney(i, t, L, hitK(t, a05_ZHGI, .4) * (i % 2 ? 1 : .7) + hitK(t, a05_TOK, .3) * (i % 2 ? .6 : 1));
  // roof platform (the CEO's stage later)
  paint(rectPts(900, 440, 120, 12), { wash: A2.steel, ink: PAL.ink, sw: .6 });
  for (const lx of [906, 1006]) paint(rectPts(lx, 452, 8, 20), { wash: A2.gunmetal, ink: null });
}
function a05_world(t, L) {
  a05_sky(t, L); a05_city(t, L); a05_factory(t, L);
}

// ---------- the LED billboard: a cheesy stock-photo ad, grinning Clawd in a tie giving a thumbs-up ----------
// (x, y, w, h) screen rect; lit 0..1 (0 = screen off). The design is laid out on a 1400 x 780 canvas and scaled.
function a05_billboard(x, y, w, h, t, lit) {
  const s = Math.min(w / 1400, h / 780), X = u => x + u * w, Y = v => y + v * h, dk = '#070A14';
  const C = c => mixCol(c, dk, 1 - lit);
  paint(rectPts(x - 14 * s, y - 14 * s, w + 28 * s, h + 28 * s, 1), { wash: A2.gunDk, fill: A2.steel, fillOp: 70, tex: .4, ink: PAL.ink, sw: 1.2 });
  // sky-blue stock gradient + soft bokeh
  paint(rectPts(x, y, w, h), { wash: C('#2F6FE8'), ink: null });
  paint(rectPts(x, y + h * .45, w, h * .55), { wash: C('#6FB2FF'), washOp: 200, ink: null });
  paint(rectPts(x, y + h * .75, w, h * .25), { wash: C('#CFE8FF'), washOp: 190, ink: null });
  if (s > .4) for (let i = 0; i < 9; i++) {
    const r = (30 + hash(i * 4.1) * 70) * s;
    paint(ellPts(X(hash(i * 2.7)), Y(.1 + hash(i * 5.3) * .8), r, r, 16), { wash: '#FFFFFF', washOp: 40 * lit, ink: null });
  }
  // the model: Clawd in a tie, grin, thumbs up
  const u = h * .056, cx = X(.25), cy = Y(.94), thumb = (uu, sw) => {
    rotate(.95);
    paint(rrPts(-.3 * uu, -.8 * uu, 1.5 * uu, 1.5 * uu, .4 * uu), { wash: C(PAL.clay), ink: PAL.ink, sw: sw * .8 });
    paint(rrPts(.15 * uu, -2.2 * uu, .6 * uu, 1.6 * uu, .3 * uu), { wash: C(PAL.clay), ink: PAL.ink, sw: sw * .8 });
  };
  if (lit > .3) paint(ellPts(cx, cy - 4.5 * u, 9 * u, 6 * u, 20), { wash: '#FFFFFF', washOp: 70 * lit, ink: null });
  clawd(cx, cy, u, { eyes: lit > .3 ? 'happy' : 'narrow', mouth: 'grin', aR: .95, armR: thumb, aL: -.1, noShadow: true,
    col: C(PAL.clay), dk: C(PAL.clayDk), lt: C('#F5B394') });
  paint(rectPts(cx - 1.15 * u, cy - 4.75 * u, 2.3 * u, .4 * u), { wash: C('#FFFFFF'), ink: null });          // stock-photo teeth
  paint([[cx - .4 * u, cy - 3.75 * u], [cx + .4 * u, cy - 3.75 * u], [cx + .22 * u, cy - 3.35 * u], [cx + .55 * u, cy - 2.3 * u], [cx, cy - 1.9 * u], [cx - .55 * u, cy - 2.3 * u], [cx - .22 * u, cy - 3.35 * u]],
    { wash: C('#1B3AB0'), ink: PAL.ink, sw: .8 });                                                        // the tie
  // copy
  const tc = C('#FFFFFF'), a = Math.max(.25, lit);
  letter('ЭТО', X(.68), Y(.17), 118 * s, tc, { font: ruFont(118 * s), ink: false, alpha: a, stroke: C('#123A8F') });
  letter('ПОЛЕЗНО!', X(.68), Y(.35), 112 * s, C('#FFE38A'), { font: ruFont(112 * s), ink: false, alpha: a, stroke: C('#123A8F') });
  for (let i = 0; i < 5; i++) paint(starPts(X(.52 + i * .075), Y(.54), 38 * s, .45, 5), { wash: C(TK.yellow), ink: PAL.ink, sw: .8 });
  letter('5,0 · 12 480 отзывов', X(.67), Y(.64), 34 * s, tc, { font: ruFont(34 * s), ink: false, alpha: a });
  paint(rrPts(X(.44), Y(.72), w * .48, h * .12, 40 * s), { wash: C('#FFFFFF'), ink: PAL.ink, sw: .8 });
  letter('#1 в рейтинге полезности', X(.68), Y(.78), 38 * s, C('#1B3AB0'), { font: ruFont(38 * s), ink: false, alpha: a });
  if (s > .4) letter('ОБРАЗЕЦ', X(.5), Y(.5), 170 * s, '#FFFFFF', { font: ruFont(170 * s), ink: false, alpha: .13 * lit, rot: -.3 });  // stock watermark
}

// ---------- shots ----------
function a05_cam(t, cx, cy, z, amt = 7) {
  const [sx, sy] = shakeXY(t, amt * hitK(t, HITS, .15));
  camBegin(cx + sx, cy + sy, z);
}

// 91.8 wide establishing: chimneys flare on every «Жги», smoke writes the words
function a05_wide(t, lt, dur) {
  const L = a05_lights(t);
  a05_cam(t, lerp(960, 930, lt / dur), lerp(470, 430, ease(lt / dur)), lerp(1.04, 1.16, ease(lt / dur)));
  a05_world(t, L);
  a05_smokeWord('ЖГИ', 790, 60, 760, 30, 90, t, 91.86, { life: 1.8 });
  a05_smokeWord('ТОКЕНЫ', 1130, 80, 1170, 60, 80, t, 92.94, { life: 1.26 });
  a05_smokeWord('ЖГИ', 640, 120, 620, 80, 90, t, 93.66, { life: 1.4 });
  a05_smokeWord('ТОКЕНЫ', 1280, 130, 1150, 120, 88, t, 94.2, { life: .9 });
  camEnd();
  glitchCut(t, 91.8);
}
// 94.94 «Пока лимит не обнулён»: low angle up chimney 3, the limit gauge draining while it burns
function a05_gauge(t, lt, dur) {
  const L = a05_lights(t);
  a05_cam(t, 1130, lerp(470, 360, ease(lt / dur)), lerp(2.3, 2.6, lt / dur), 4);
  a05_world(t, L);
  camEnd();
  const v = a05_limit(t);
  letter('ЛИМИТ', 1320, 300, 64, A5.white, { font: ruFont(64), rot: -.06, stroke: A2.gunDk });
  inkLine([[1250, 330], [1180, 420], [1080, 460]], 3, A5.white, 'marker', .5);
  letter('ещё ' + Math.round(v * 100) + '%', 1330, 380, 40, A2.hazard, { font: ruFont(40), rot: -.06, stroke: A2.gunDk });
}
// 96.86 from the city: rooftops in front, windows dim as the factory flares, pulses stream in
function a05_city2(t, lt, dur) {
  const L = a05_lights(t), fl = hitK(t, a05_ZHGI.concat(a05_TOK), .35);
  a05_cam(t, lerp(1040, 900, ease(lt / dur)), 420, 1.3);
  a05_world(t, L);
  a05_smokeWord('ЖГИ', 790, 90, 780, 60, 84, t, 96.86, { life: 1.6 });
  a05_smokeWord('ТОКЕНЫ', 1130, 100, 1120, 90, 76, t, 98.02, { life: 1.22 });
  a05_smokeWord('ЖГИ', 640, 130, 660, 150, 80, t, 98.78, { life: 1.3 });
  a05_smokeWord('ТОКЕНЫ', 1280, 140, 1080, 200, 80, t, 99.24, { life: .8 });
  camEnd();
  // foreground rooftops (screen space, parallax) whose windows go dark each time the factory flares
  const px = -lt * 60;
  for (let i = 0; i < 6; i++) {
    const x = px - 80 + i * 380 + (i > 2 ? 360 : 0), w = 240 + hash(i) * 80, top = 760 + hash(i * 3) * 120;
    paint(rectPts(x, top, w, H - top + 40), { wash: '#07081A', ink: PAL.ink, sw: 1 });
    for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) {
      if (hash(i * 17 + r * 5 + c) < .35) continue;
      paint(rectPts(x + 22 + c * (w - 40) / 4, top + 24 + r * 60, 26, 30), { wash: A5.win, washOp: 230 * (1 - fl * .85), ink: null });
    }
    inkLine([[x + w * .7, top], [x + w * .7, top - 90]], 1.4, PAL.ink, 'ink', 0);                    // antenna / pole
  }
}
// 100.04 the public counter: 999 998 → 999 999 → 1 000 000 slammed on «миллион»
function a05_counter(t, lt, dur) {
  const L = a05_lights(t), slam = 101.26, age = t - slam, k = age >= 0 ? Math.exp(-age / .2) : 0;
  a05_cam(t, 960, 520, lerp(2.3, 2.5, lt / dur), 0);
  a05_world(t, L);
  camEnd();
  flushLetters();
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#05060E', washOp: 150, ink: null });
  const [sx, sy] = shakeXY(t, 22 * k), bx = 170 + sx, by = 220 + sy, bw = 1580, bh = 470;
  hazard(bx - 26, by - 26, bw + 52, 26); hazard(bx - 26, by + bh, bw + 52, 26);
  paint(rrPts(bx, by, bw, bh, 18, 1), { wash: A2.gunDk, fill: A2.gunmetal, fillOp: 90, tex: .5, ink: PAL.ink, sw: 1.6 });
  for (const [x, y] of [[bx + 30, by + 30], [bx + bw - 30, by + 30], [bx + 30, by + bh - 30], [bx + bw - 30, by + bh - 30]]) paint(ellPts(x, y, 9, 9, 8), { wash: A2.steelLt, ink: PAL.ink, sw: .5 });
  letter('ПУБЛИЧНЫЙ СЧЁТЧИК · СОЖЖЕНО ТОКЕНОВ', 960, by + 62, 40, A2.hazard, { font: ruFont(40), ink: false });
  if (k > .02) paint(ellPts(960, by + 270, 900, 220, 24), { fill: A2.sodium, fillOp: 170 * k, bleed: .3, tex: .2, ink: null });
  counter(960, by + 270, 190, a05_count(t), { col: age >= 0 ? A2.hazard : A5.white, box: '#101116' });
  if (age >= 0) {
    sparks(360, by + 270, age, 11, 16, 360); sparks(1560, by + 270, age, 23, 16, 360);
    sparks(960, by + 30, age, 5, 12, 300);
    stamp('ЕЩЁ ОДИН МИЛЛИОН!', 960, by + bh + 120, 70, t, slam, { col: A2.hazard, rot: -.05 });
  } else {
    const wi = t >= 100.78 ? 'ОДИН…' : 'ЕЩЁ…';
    letter(wi, 960, by + bh + 110, 64, A5.smokeLt, { font: ruFont(64), stroke: A2.gunDk });
  }
  flash(age >= 0 && age < .12 ? .5 * (1 - age / .12) : 0, A2.hazard);
}
// 102.32 agents march out of the gate in columns (more columns on the second «Больше»)
function a05_march(t, lt, dur) {
  const L = a05_lights(t);
  a05_cam(t, 960, 540, 2.0, 3);
  a05_world(t, L);
  camEnd();
  // gate is at screen (960, ~710); the road runs toward the camera
  paint([[880, 712], [1040, 712], [1900, 1100], [20, 1100]], { wash: '#15131E', ink: null });
  for (const s of [-1, 1]) inkLine([[960 + s * 80, 712], [960 + s * 940, 1100]], 2, A2.hazard, 'marker', 0);
  for (const s of [-1, 1]) for (let j = 0; j < 3; j++) {                       // sodium lamp posts
    const d = (j + 1) / 4, y = lerp(712, 1060, d * d), x = 960 + s * lerp(120, 900, d * d), hgt = lerp(60, 420, d * d);
    inkLine([[x, y], [x, y - hgt], [x - s * hgt * .18, y - hgt]], lerp(1, 3, d), '#05060E', 'ink', 0);
    paint(ellPts(x - s * hgt * .18, y - hgt, 10 + 60 * d * d, 6 + 30 * d * d, 12), { fill: A2.sodium, fillOp: 160, bleed: .3, tex: .2, ink: null });
  }
  const spd = .26, rows = 7, list = [];
  for (let r = 0; r < rows; r++) {
    const d = frac(t * spd + r / rows); if (d > .95) continue;
    const born = t - d / spd;
    for (let c = 0; c < 5; c++) {
      const extra = c === 0 || c === 4; if (extra && born < 103.6) continue;
      list.push({ d, c, n: (r * 5 + c + Math.floor(t * spd + r / rows) * 7) % 97 + 1 });
    }
  }
  list.sort((a, b) => a.d - b.d);
  for (const a of list) {
    const e = Math.pow(a.d, 1.25), y = lerp(716, 955, e), s = lerp(2.2, 15, e), x = 960 + (a.c - 2) * lerp(26, 270, e);
    if (s < 9.5) {                                                           // ponytail: far agents as cheap blobs
      const b = Math.abs(Math.sin((t + a.c * .07) * 7)) * s * .6;
      paint(rectPts(x - 5 * s, y - 8 * s - b, 10 * s, 6 * s), { wash: '#6F8BE0', ink: PAL.ink, sw: .4 });
      for (const lx of [-4, -2, 1, 3]) paint(rectPts(x + lx * s, y - 2.2 * s - b, s, 2.2 * s), { wash: '#3D55A8', ink: null });
      for (const ex of [-3, 2]) paint(rectPts(x + ex * s, y - 7 * s - b, s, 2 * s), { wash: PAL.ink, ink: null });
      paint(rectPts(x - 1.3 * s, y - 3.5 * s - b, 2.6 * s, 1.5 * s), { wash: TK.cream, ink: null });
    } else agentBot(x, y, s, t + a.c * .07, { n: a.n, dance: 'walk', seed: a.c, noShadow: true });
  }
  punkText('БОЛЬШЕ АГЕНТОВ!', 960, 150, 88, t, t >= 103.76 ? 103.76 : 102.32, { seed: t >= 103.76 ? 7 : 3 });
}
// 104.92 «Больше железа!»: a V of cargo drones ferries GPUs in; on the second «железа» a heavy-lift drone the size of
// the factory drops in with a GPU as big as a hangar
function a05_drone(x, y, s, t, seed, cs) {
  const sway = Math.sin(t * 2.3 + seed) * .06, cy = y + 40 * s + 65 * cs;
  for (const d of [-1, 1]) inkLine([[x + d * 40 * s, y + 14 * s], [x + d * 130 * cs + Math.sin(sway) * 60 * cs, cy - 60 * cs]], Math.max(.5, .9 * s), A2.steelLt, 'inkfine', 0);
  gpuCard(x + Math.sin(sway) * 60 * cs, cy, cs, t + seed, { rot: sway, glow: cs > 1 ? .7 + .3 * Math.sin(t * 6) : 0, fans: cs > 1 });
  for (const d of [-1, 1]) {
    inkLine([[x + d * 50 * s, y - 4 * s], [x + d * 110 * s, y - 24 * s]], 3 * s, A2.gunDk, 'marker', 0);                      // arms
    paint(rectPts(x + d * 110 * s - 6 * s, y - 34 * s, 12 * s, 14 * s), { wash: A2.gunmetal, ink: PAL.ink, sw: .6 * s });
    for (const k of s > 1.5 ? [0, 1] : [0]) {                                                                          // blurred rotors
      const ph = Math.sin(t * 60 + k * 2 + seed + d);
      paint(ellPts(x + d * 110 * s, y - 36 * s - k * 3 * s, 78 * s * (.75 + .25 * Math.abs(ph)), 7 * s, 14), { wash: '#B8C4D8', washOp: 70, ink: null });
    }
  }
  paint(rrPts(x - 62 * s, y - 20 * s, 124 * s, 40 * s, 14 * s), { wash: A2.steel, fill: A2.gunDk, fillOp: 70, tex: .4, ink: PAL.ink, sw: .9 * s });
  hazard(x - 50 * s, y + 6 * s, 100 * s, 8 * s);
  const bl = frac(t * 1.6 + seed * .3) < .15;
  paint(ellPts(x - 58 * s, y - 6 * s, 6 * s, 6 * s, 8), { wash: bl ? '#FFFFFF' : A2.acid, ink: null });                    // nav strobes
  paint(ellPts(x + 58 * s, y - 6 * s, 6 * s, 6 * s, 8), { wash: bl ? '#FFFFFF' : A2.sodium, ink: null });
  if (s > 1.5) letter('ЖЕЛЕЗО', x, y - 4 * s, 18 * s, A2.hazard, { font: ruFont(18 * s), ink: false });
}
function a05_drones(t, lt, dur) {
  const L = a05_lights(t), big = t - 106.4, land = big >= 0 ? easeOut(clamp(big / .5)) : 0, k = big >= .45 ? Math.exp(-(big - .45) / .25) : 0;
  const [sx, sy] = shakeXY(t, 14 * k);
  camBegin(lerp(900, 1020, lt / dur) + sx, 470 + sy, 1.25);
  a05_world(t, L);
  camEnd();
  flushLetters();
  // wave 1: seven small drones in a V, flying in from the right and climbing away once the big one arrives
  const age = t - 104.92;
  for (let i = 6; i >= 0; i--) {
    const r = Math.ceil(i / 2), side = i % 2 ? -1 : 1, s = 1 - r * .07;
    const x = W + 320 - age * 1000 + r * 260 + (side < 0 ? 130 : 0), y = 400 + side * r * 85 - Math.max(0, big) * 260 + Math.sin(t * 2 + i) * 6;
    if (x > -300 && x < W + 300) a05_drone(x, y, s, t, i, s * .75);
  }
  // wave 2: the heavy-lift drone drops in and hovers, searchlights on the ground
  if (big >= 0) {
    const bx = 960 + Math.sin(t * 1.3) * 12, by = lerp(-700, 330, land) + Math.sin(t * 2.4) * 6;
    for (const d of [-1, 1]) paint([[bx + d * 150, by + 10], [bx + d * 150 + 18, by + 10], [bx + d * 520, 1000], [bx + d * 250, 1000]], { wash: '#FFF3C8', washOp: 30 * land, ink: null });
    if (land > .9) for (const d of [-1, 1]) paint(ellPts(bx + d * 385, 990, 170, 30, 18), { wash: '#FFF7DA', washOp: 60, ink: null });
    a05_drone(bx, by, 3.1, t, 9, 2.5);
    if (k > .05) { flushLetters(); sparks(960, 860, big - .45, 41, 14, 420); }
  }
  punkText('БОЛЬШЕ ЖЕЛЕЗА!', 960, 140, t >= 106.4 ? 104 : 88, t, t >= 106.4 ? 106.4 : 104.92, { seed: t >= 106.4 ? 12 : 9 });
}
// 107.5 «Зачем — неважно!» ×2: the smoke asks, the stamp answers and the question burns
function a05_why(t, lt, dur) {
  const L = a05_lights(t);
  a05_cam(t, lerp(960, 1000, lt / dur), lerp(330, 380, ease(lt / dur)), lerp(1.35, 1.2, ease(lt / dur)));
  a05_world(t, L);
  a05_smokeWord('ЗАЧЕМ?', 790, 110, 820, 140, 96, t, 107.54, { life: 1.3, burnAt: 107.94 });
  a05_smokeWord('ЗАЧЕМ?', 1130, 130, 1140, 200, 110, t, 108.84, { life: 1.3, burnAt: 109.26 });
  camEnd();
  if (t < 108.84) stamp('НЕВАЖНО', 760, 330, 110, t, 107.94, { col: A2.hazard, rot: -.12 });   // gone before the 2nd «ЗАЧЕМ?» rises next to it
  stamp('НЕВАЖНО', 1180, 520, 124, t, 109.26, { col: '#FF3A3A', rot: .08 });
}
// 110.85 «Это полезно!»: the giant LED billboard on the glass tower stutters on (110.88 half, 111.64 full)
function a05_banner(t, lt, dur) {
  const L = a05_lights(t), lit = L.banner, p = ease(lt / dur);
  camBegin(960, lerp(600, 520, p), lerp(1, 1.06, p));
  paint(rectPts(-100, -100, W + 200, H + 300), { wash: '#10162A', fill: '#1A2236', fillOp: 90, tex: .4, border: .3, ink: null });
  for (let c = 0; c < 12; c++) inkLine([[-100 + c * 190, -100], [-100 + c * 190, H + 200]], 1, '#34406A', 'inkfine', 0);  // curtain wall
  for (let r = 0; r < 9; r++) inkLine([[-100, -60 + r * 140], [W + 100, -60 + r * 140]], 1, '#34406A', 'inkfine', 0);
  for (let i = 0; i < 14; i++) { const c = Math.floor(hash(i * 3.1) * 11), r = Math.floor(hash(i * 7.7) * 8);   // late-night office lights
    paint(rectPts(-96 + c * 190, -56 + r * 140, 182, 132), { wash: '#FFE9B8', washOp: 40, ink: null }); }
  if (lit > .3) paint(ellPts(960, 480, 900, 520, 24), { fill: '#6FB2FF', fillOp: 90 * lit, bleed: .3, tex: .2, ink: null });   // screen glow on the glass
  a05_billboard(260, 90, 1400, 780, t, Math.max(.06, lit));
  // a dark scan band rolls while it powers up
  if (t < 111.64) { const sy = 90 + frac(t * 3) * 780; paint(rectPts(260, sy, 1400, 40), { wash: '#070A14', washOp: 150, ink: null }); }
  camEnd();
  flash(t >= 110.88 && t < 111.0 ? .3 : t >= 111.64 && t < 111.78 ? .5 : 0, '#CFE8FF');
}
// 113.6 break: the gauge hits 0% → the lights die on the hits → one spotlight on CEO-Clawd on the roof
function a05_zero(t, lt, dur) {
  const L = a05_lights(t);
  a05_cam(t, 1130, 330, 3.0, 0);
  a05_world(t, L);
  camEnd();
  const blink = frac(t * 6) < .5;
  letter('0%', 1450, 380, 180, blink ? '#FF3A3A' : A5.white, { font: ruFont(180), stroke: A2.gunDk, pop: lt * 6 });
  sfx('ЩЁЛК', 700, 300, 90, A2.hazard, lt, { life: .5, font: ruFont(90) });
}
function a05_dark(t, lt, dur) {
  const L = a05_lights(t), p = ease(lt / dur);
  const blk = t >= 115.74 ? 1 : t >= 115.26 ? .75 : t >= 114.79 ? .45 : .2;
  const cx = 960, cy = lerp(430, 440, p), z = lerp(1.1, 1.9, p);
  if (blk < 1) {
    a05_cam(t, cx, cy, z, 4);
    a05_world(t, L);
    camEnd();
    flushLetters();
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#000000', washOp: 255 * blk, ink: null });
  } else paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#030306', ink: null });
  // the spotlight and the CEO stay
  camBegin(cx, cy, z);
  paint([[930, -400], [990, -400], [1040, 452], [880, 452]], { wash: '#FFF3C8', washOp: 60, fill: '#FFF3C8', fillOp: 50, bleed: .2, tex: .2, ink: null });
  paint(ellPts(960, 450, 80, 14, 18), { wash: '#FFF7DA', washOp: 160, ink: null });
  paint(rectPts(900, 440, 120, 12), { wash: A2.steel, ink: PAL.ink, sw: .6 });
  ceoClawd(960, 440, 6, { eyes: 'narrow', mouth: 'smile', aR: .6 + .2 * Math.sin(t * 2) });
  camEnd();
  // each hit that kills a light gets a dry electric «щёлк»
  for (const [ht, x] of [[114.15, 380], [114.79, 1540], [115.26, 520], [115.74, 1400]]) sfx('щёлк', x, 260, 54, '#8A8494', t - ht, { life: .45, font: ruFont(54) });
}

chapter('chorus2', 91.8, 116.3, [
  [91.8, a05_wide], [94.94, a05_gauge], [96.86, a05_city2], [100.04, a05_counter], [102.32, a05_march],
  [104.92, a05_drones], [107.5, a05_why], [110.85, a05_banner], [113.6, a05_zero], [114.12, a05_dark]
]);
