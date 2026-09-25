// t08_sunday.js: «Жги токены» outro (162.6 – end). Sunday night, 23:58, zero tokens left: a quiet room, a desk lamp,
// Clawd alone at the laptop. The count (3 games, 7 sites, 42 agents) pops up and goes grey, silence and a moth,
// "I'm happy" under the moon, the clock flips to midnight, the limit resets… «Сука.» The band crashes back:
// the room blows apart, the data center reignites, a punk collage of every chapter while the fresh limit burns down,
// then a last «ЖГИ ТОКЕНЫ» stamp and the credit on soot black.
(() => {
  const B = n => OFF + n * BEAT;                       // B(313) = 189.13 crash, B(317) 191.54, B(322) 194.55, B(330) 199.37 band stops
  const INK = PAL.ink;
  const R = {                                           // night room palette
    wall: '#22243A', wallDk: '#16172A', wallLt: '#34385A', sky: '#15204A', skyLt: '#2A3A70',
    desk: '#5A3A28', deskDk: '#2E1D14', deskLt: '#7A5238', lampC: TK.ember, light: '#FFD98A', screen: '#9CC4FF', led: '#FF3B30'
  };
  const GREY = '#8A8488';
  const gr = (c, k) => k > 0 ? mixCol(c, GREY, k) : c;

  // Put local (0, 0) at screen (X, Y) with zoom z and rotation r; letters follow too (it is a camera). Pair with camEnd().
  // (ox, oy) is the local point that lands on (X, Y).
  function place(X, Y, z = 1, r = 0, ox = 0, oy = 0) {
    const dx = (X - W / 2) / z, dy = (Y - H / 2) / z, c = Math.cos(r), s = Math.sin(r);
    camBegin(ox - (dx * c + dy * s), oy - (-dx * s + dy * c), z, r);
  }

  // ---------- the room (world coordinates, 1920 x 1080 at zoom 1) ----------
  const CX = 840, GY = 808, U = 34;                     // Clawd at the desk
  const DESK = 742;                                     // desk top back edge

  function wall(t, o) {
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: R.wallDk, fill: R.wall, fillOp: 150, bleed: .12, tex: .6, border: .3, ink: null });
    for (let i = 0; i < 9; i++) inkLine([[-100 + i * 260, -100], [-100 + i * 260, DESK]], .5, R.wallLt, 'inkfine', 0);   // wallpaper seams
    // lamp light pooling on the wall and the desk
    const L = o.lamp ?? 1;
    if (L > .02) {
      for (const [rx, ry, op] of [[460, 330, 14], [300, 220, 16], [170, 130, 20]]) paint(ellPts(560, 580, rx, ry, 28), { wash: R.light, washOp: op * L, ink: null });
      paint([[520, 530], [600, 540], [800, DESK + 50], [360, DESK + 50]], { wash: R.light, washOp: 26 * L, ink: null });
      paint(ellPts(580, DESK + 30, 220, 34, 24), { wash: R.light, washOp: 40 * L, ink: null });
    }
  }
  function windowPane(t, o) {
    const x = 130, y = 100, w = 410, h = 420, moon = o.moon || 0;
    paint(rectPts(x - 22, y - 22, w + 44, h + 44, 1.5), { wash: '#3A2E2A', fill: '#1E1614', fillOp: 90, tex: .5, ink: INK, sw: 1.1 });
    paint(rectPts(x, y, w, h, 1), { wash: R.sky, fill: R.skyLt, fillOp: 110, bleed: .2, tex: .6, border: .4, ink: INK, sw: .8 });
    for (let i = 0; i < 16; i++) {                                                       // stars twinkle
      const sx = x + 20 + hash(i * 3.3) * (w - 40), sy = y + 20 + hash(i * 7.1) * h * .55, tw = .5 + .5 * Math.sin(t * (1.3 + hash(i)) * 3 + i);
      paint(starPts(sx, sy, 4 + 5 * tw * hash(i + 2), .3), { wash: TK.cream, washOp: 150 + 100 * tw, ink: null });
    }
    // the moon, a cloud slides off it at «я счастлив»
    const mx = x + 110, my = y + 110;
    if (moon > .02) glowAt(mx, my, 120, TK.cream, 60 * moon);
    paint(ellPts(mx, my, 48, 48, 22), { wash: mixCol(R.skyLt, '#FFF3C8', .25 + .75 * moon), fill: '#E8D9A8', fillOp: 90 * moon, tex: .5, ink: moon > .3 ? INK : null, sw: .6 });
    const cx = mx - 10 + ease(moon) * 260;
    paint(ellPts(cx, my + 12, 110, 36, 20, 2), { wash: '#2E3A62', fill: '#44507A', fillOp: 100, bleed: .2, tex: .5, ink: null });
    paint(ellPts(cx + 50, my - 10, 70, 30, 18, 2), { wash: '#2E3A62', fill: '#44507A', fillOp: 80, ink: null });
    // the park from Friday at night: a hill, a bench, the kite tangled in a tree
    paint([[x, y + h], [x, y + h - 70], [x + w * .4, y + h - 95], [x + w, y + h - 60], [x + w, y + h]], { wash: '#0E1428', ink: null, curv: .4 });
    paint(ellPts(x + 320, y + h - 190, 70, 90, 18, 3), { wash: '#0E1428', ink: null });
    paint(rectPts(x + 314, y + h - 120, 12, 60), { wash: '#0E1428', ink: null });
    paint([[x + 360, y + h - 250], [x + 380, y + h - 225], [x + 360, y + h - 195], [x + 340, y + h - 225]], { wash: '#6A2A40', ink: null });   // the kite
    inkLine([[x + 360, y + h - 195], [x + 350, y + h - 170], [x + 362, y + h - 150]], .6, '#6A2A40', 'inkfine', .5);
    inkLine([[x + 110, y + h - 108], [x + 210, y + h - 110]], 1.2, '#0E1428', 'ink', 0);                              // bench
    for (const bx of [118, 200]) inkLine([[x + bx, y + h - 108], [x + bx, y + h - 88]], 1, '#0E1428', 'ink', 0);
    inkLine([[x + 110, y + h - 125], [x + 210, y + h - 127]], 1, '#0E1428', 'ink', 0);
    inkLine([[x + w / 2, y], [x + w / 2, y + h]], 2, '#3A2E2A', 'ink', 0);                                            // mullions
    inkLine([[x, y + h / 2], [x + w, y + h / 2]], 2, '#3A2E2A', 'ink', 0);
  }
  // wall calendar: «ВС / ВОСКРЕСЕНЬЕ», the page tears off at midnight
  function calendar(t, o) {
    const x = 1590, y = 360, w = 220, h = 230, tear = o.tear ?? -1;
    const pageF = (day, name, txt = true) => {
      paint(rectPts(x, y, w, h, 1), { wash: TK.cream, fill: '#E6D9C0', fillOp: 70, tex: .5, ink: INK, sw: .9 });
      paint(rectPts(x, y, w, 46), { wash: TK.ember, ink: INK, sw: .7 });
      if (txt) letter(day, x + w / 2, y + 125, 84, day === 'ВС' ? TK.ember : '#2B2233', { font: ruFont(84), ink: false });
      if (txt) letter(name, x + w / 2, y + 198, 19, '#2B2233', { font: ruFont(19), ink: false });
    };
    pageF('ПН', 'ПОНЕДЕЛЬНИК', tear >= 0);
    if (tear < 0) pageF('ВС', 'ВОСКРЕСЕНЬЕ');
    else if (tear < 1) {                                                        // the old page drops and spins away
      const k = easeIn(tear);
      push(); translate(x + w / 2 + k * 120, y + h / 2 + k * 520); rotate(k * 1.4);
      paint(rectPts(-w / 2, -h / 2, w, h, 1), { wash: TK.cream, ink: INK, sw: .9 });
      paint(rectPts(-w / 2, -h / 2, w, 46), { wash: TK.ember, ink: null });
      pop();
    }
    for (const rx of [x + 50, x + w - 50]) paint(ellPts(rx, y + 4, 9, 14, 10), { wash: TK.steelLt, ink: INK, sw: .6 });
  }
  // desk slab, front panel
  function desk() {
    paint([[-300, DESK], [W + 300, DESK], [W + 300, 812], [-300, 812]], { wash: R.desk, fill: R.deskLt, fillOp: 90, tex: .6, border: .4, ink: INK, sw: 1.1 });
    paint(rectPts(-300, 812, W + 600, 700), { wash: R.deskDk, fill: '#1A100B', fillOp: 110, tex: .5, ink: INK, sw: 1 });
    for (let i = 0; i < 5; i++) inkLine([[-100 + i * 480, DESK + 20 + (i % 2) * 18], [200 + i * 480, DESK + 24 + (i % 2) * 18]], .5, R.deskDk, 'inkfine', .3);
  }
  // anglepoise desk lamp, shade aimed down-right at the desk
  function lamp(t, o) {
    const on = o.lamp ?? 1;
    push(); translate(-70, 0);
    paint(ellPts(470, DESK + 22, 70, 16, 18), { wash: TK.soot, fill: TK.sootLt, fillOp: 70, ink: INK, sw: .9 });
    inkLine([[470, DESK + 16], [430, 600], [560, 500]], 4, TK.sootLt, 'ink', 0);
    for (const [jx, jy] of [[430, 600], [560, 500]]) paint(ellPts(jx, jy, 9, 9, 10), { wash: TK.steelLt, ink: INK, sw: .6 });
    if (on > .02) glowAt(628, 540, 90, R.light, 140 * on);
    paint([[545, 470], [590, 450], [680, 540], [615, 580]], { wash: R.lampC, fill: TK.emberDk, fillOp: 90, tex: .5, ink: INK, sw: 1, curv: .15 });
    paint(ellPts(650, 562, 38, 16, 14, 0, -.75), { wash: on > .02 ? '#FFF6D8' : TK.ash, ink: INK, sw: .6 });
    pop();
  }
  // laptop from behind at 3/4: lid back with a token sticker, screen light spilling left onto Clawd
  function laptop(t, o) {
    const glow = o.screen ?? 1, x = 1030;
    if (glow > .02) glowAt(x - 40, 610, 190, o.screenCol || R.screen, 70 * glow);
    paint([[x - 40, DESK + 30], [x + 250, DESK + 22], [x + 280, DESK + 44], [x - 30, DESK + 52]], { wash: '#9AA3AE', fill: TK.steel, fillOp: 70, ink: INK, sw: .8 });
    paint([[x, DESK + 32], [x + 250, DESK + 24], [x + 262, 570], [x + 10, 548]], { wash: '#6B7581', fill: TK.steelDk, fillOp: 90, tex: .5, border: .4, ink: INK, sw: 1 });
    if (glow > .02) inkLine([[x - 2, DESK + 30], [x + 8, 548]], Math.min(3, 2 * glow), o.screenCol || R.screen, 'ink', 0);
    token(x + 130, 650, 30, { rot: -.05 });
  }
  // digital desk clock
  function deskClock(t, o) {
    const x = 1470, y = 628, w = 330, h = 118, txt = o.clock || 'ВС 23:58', flip = o.flip ?? -1, lit = o.lit ?? 1;
    paint(rrPts(x, y, w, h, 18, 1), { wash: '#141216', fill: TK.sootLt, fillOp: 60, tex: .4, ink: INK, sw: 1 });
    paint(rrPts(x + 16, y + 16, w - 32, h - 32, 8), { wash: '#0A0809', ink: null });
    if (lit < .02) return;
    glowAt(x + w / 2, y + h / 2, 150, R.led, 45 * lit * (1 + (o.pulse || 0)));
    const f = ruFont(64), cy = y + h / 2 + 3;
    if (flip >= 0 && flip < .3) {
      letter(o.oldClock, x + w / 2, cy - flip * 120, 64, R.led, { font: f, ink: false, alpha: 1 - flip / .3 });
      letter(txt, x + w / 2, cy, 64, R.led, { font: f, ink: false, pop: flip * 5 });
    } else {
      const blink = frac(t) < .5 || flip >= 0 ? 1 : .25;
      const [d, hm] = txt.split(' '), [hh, mm] = hm.split(':');
      letter(d + ' ' + hh, x + w / 2 - 10, cy, 64, R.led, { font: f, ink: false, align: 'right', alpha: lit });
      letter(':', x + w / 2 + 2, cy - 4, 64, R.led, { font: f, ink: false, alpha: lit * blink });
      letter(mm, x + w / 2 + 16, cy, 64, R.led, { font: f, ink: false, align: 'left', alpha: lit });
    }
  }
  function mug(t) {
    paint(rrPts(1290, 668, 64, 80, 10), { wash: TK.cream, fill: '#D8CBB0', fillOp: 70, ink: INK, sw: .8 });
    inkLine([[1354, 684], [1378, 694], [1374, 724], [1352, 728]], 2, INK, 'ink', .5);
    paint(rectPts(1300, 692, 44, 14), { wash: TK.blue, ink: null });
    for (let i = 0; i < 2; i++) { const p = frac(t * .4 + i * .5); inkLine([[1312 + i * 18, 660 - p * 60], [1320 + i * 18 + Math.sin(t * 2 + i) * 8, 640 - p * 60], [1314 + i * 18, 620 - p * 60]], .8 * (1 - p), TK.ash, 'inkfine', .6); }
  }
  // the moth circling the bulb
  function moth(t, k = 1) {
    if (k < .02) return;
    const a = t * 2.3, x = 585 + Math.cos(a) * 120 + Math.sin(t * 5.1) * 14, y = 540 + Math.sin(a) * 60 + Math.cos(t * 4.3) * 10, fl = Math.abs(Math.sin(t * 26));
    for (const s of [-1, 1]) paint(ellPts(x + s * 18 * fl, y - 3, 19 * fl + 3, 14, 10, 0, s * .5), { wash: '#A89478', fill: '#5A4A38', fillOp: 90, ink: INK, sw: .8 });
    paint(ellPts(x, y + 3, 5, 14, 8), { wash: '#6A5A48', ink: null });
    for (const s of [-1, 1]) inkLine([[x, y - 9], [x + s * 10, y - 24]], .5, INK, 'inkfine', 0);
  }
  // Clawd at the desk; o = clawd options on top of the defaults
  function hero(t, o = {}) {
    clawd(CX, GY, U, { eyes: 'look', lookX: .9, lookY: .3, mouth: 'flat', aL: -.55, aR: -.35, dy: -Math.abs(Math.sin(t * 1.1)) * .15, noShadow: true, ...o });
  }
  function room(t, o = {}) {
    wall(t, o); windowPane(t, o); calendar(t, o);
    hero(t, o.hero);
    desk(); laptop(t, o); mug(t); lamp(t, o); deskClock(t, o);
    flushLetters();
    if (o.dim) paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#07060C', washOp: 255 * o.dim, ink: null });
  }

  // ---------- the count: 3 cartridges, 7 browser windows, 42 agents ----------
  const cartCols = [TK.ember, TK.green, TK.blue];
  function cart(x, y, s, col, g, i) {
    paint([[x - 45 * s, y - 55 * s], [x + 35 * s, y - 55 * s], [x + 45 * s, y - 45 * s], [x + 45 * s, y + 55 * s], [x - 45 * s, y + 55 * s]], { wash: gr('#5E5A66', g), fill: gr('#3A3642', g), fillOp: 80, tex: .4, ink: INK, sw: .8 });
    paint(rectPts(x - 34 * s, y - 40 * s, 68 * s, 58 * s), { wash: gr(col, g), fill: gr(TK.soot, g), fillOp: 40, ink: INK, sw: .5 });
    if (i === 0) paint(starPts(x, y - 11 * s, 20 * s, .45, 5), { wash: gr(TK.yellow, g), ink: null });
    else if (i === 1) paint(heartPts(x, y - 11 * s, 18 * s), { wash: gr(TK.cream, g), ink: null });
    else paint(ellPts(x, y - 11 * s, 16 * s, 16 * s, 12), { wash: gr(TK.cream, g), ink: null });
    for (let k = 0; k < 5; k++) inkLine([[x - 30 * s + k * 15 * s, y + 34 * s], [x - 30 * s + k * 15 * s, y + 50 * s]], .6, gr(TK.gold, g), 'inkfine', 0);
  }
  const winCols = [TK.blue, TK.ember, TK.green, TK.orange, '#8A5CD0', TK.gold, '#2FA8C8'];
  function browser(x, y, w, h, col, g) {
    paint(rectPts(x + 6, y + 8, w, h), { wash: '#07060C', washOp: 120, ink: null });
    paint(rrPts(x, y, w, h, 8), { wash: gr('#FBF8F2', g * .6), ink: INK, sw: .7 });
    paint(rrPts(x, y, w, 24, 8), { wash: gr(col, g), ink: null });
    for (let k = 0; k < 3; k++) paint(ellPts(x + 14 + k * 14, y + 12, 4, 4, 8), { wash: gr(TK.cream, g), ink: null });
    paint(rectPts(x + 14, y + 38, w * .55, 14), { wash: gr(col, g * .6 + .3), ink: null });
    for (let k = 0; k < 3; k++) paint(rectPts(x + 14, y + 62 + k * 16, w * (.8 - k * .15), 6), { wash: '#C9C2B6', ink: null });
  }
  function bot(x, y, s, g, hop) {
    const c = gr('#6F8BE0', g), d = gr('#3D55A8', g), yy = y - hop;
    for (const lx of [-3.2, 1.6]) paint(rectPts(x + lx * s, yy - 1.6 * s, 1.6 * s, 1.6 * s), { wash: d, ink: null });
    paint(rectPts(x - 5 * s, yy - 7.4 * s, 10 * s, 6 * s), { wash: c, ink: INK, sw: .45 });
    for (const ex of [-3, 2]) paint(rectPts(x + ex * s, yy - 6.6 * s + (g > .5 ? s : 0), s, g > .5 ? .6 * s : 1.8 * s), { wash: INK, ink: null });
    paint(rectPts(x - 1.3 * s, yy - 3.8 * s, 2.6 * s, 1.5 * s), { wash: gr(TK.cream, g), ink: null });
  }
  const T3 = 171.36, T7 = 172.78, T42 = 173.78, TNO = 175.34;
  function count(t) {
    const g = ease(seg(t, TNO, TNO + .7)), gone = seg(t, 177.1, 177.7), sag = g * 10;
    if (gone >= 1) return;
    const pk = seg(t, 170.9, 171.3) * (1 - gone);
    if (pk > 0) paint(rrPts(620, 200, 1260, 440, 30, 2), { wash: '#07060C', washOp: 225 * pk, ink: pk > .5 ? R.wallLt : null, sw: .8 });
    const pop = (t0) => backOut(seg(t, t0, t0 + .28));
    // 3 cartridges
    for (let i = 0; i < 3; i++) {
      const k = pop(T3 + i * .13); if (k < .02) continue;
      cart(700 + i * 118, 300 + sag + (1 - k) * 60, k * (1 - gone), cartCols[i], g, i);
    }
    // 7 browser windows, cascading
    for (let i = 0; i < 7; i++) {
      const k = pop(T7 + i * .09); if (k < .02) continue;
      const s = k * (1 - gone), w = 200 * s, h = 136 * s;
      browser(1010 + i * 26 + (200 - w) / 2, 214 + i * 22 + sag + (136 - h) / 2, w, h, winCols[i], g);
    }
    // 42 agents fill a 7 x 6 grid
    for (let i = 0; i < 42; i++) {
      const k = pop(T42 + i * .024); if (k < .02) continue;
      const cxb = 1432 + (i % 7) * 62, cyb = 262 + Math.floor(i / 7) * 54, hop = g < .5 ? Math.abs(Math.sin((bpOf(t) * 2 + i * .37) * Math.PI)) * 4 : 0;
      bot(cxb, cyb + sag + 30, 4.6 * k * (1 - gone), g, hop);
    }
    // the labels
    const lab = (txt, x, y, t0) => { const a = t - t0; if (a < 0) return; letter(txt, x, y + sag, 40, gr(TK.yellow, g), { font: ruFont(40), pop: a * 3.5, alpha: 1 - gone, stroke: TK.soot }); };
    lab('3 ИГРЫ', 818, 404, T3);
    lab('7 САЙТОВ', 1190, 540, T7);
    lab('42 АГЕНТА', 1630, 590, T42 + .5);
  }

  // ---------- shots ----------
  const CLOCK0 = 163.4, MID = 180.88, NOTE = 183.48, RESET = 186.1, SUKA = 188.16, CRASH = B(313);

  // 162.6 the room, the clock lights up, push in on "23 часа 58 минут", pull back for «ноль токенов»
  function sRoom(t, lt) {
    const [cx, cy, z] = kf(t, [[162.6, [880, 520, 1.12]], [164.6, [940, 520, 1.02]], [166.2, [1560, 590, 1.75]], [169.6, [1590, 600, 1.85]], [170.35, [960, 500, 1]]], ease);
    const bar = t >= 170.35;
    camBegin(cx, cy, z);
    const lit = seg(t, CLOCK0, CLOCK0 + .15) * (t < CLOCK0 + .35 ? (frac(t * 12) < .5 ? 1 : .3) : 1);
    room(t, { lit, clock: t < 177.6 ? 'ВС 23:58' : 'ВС 23:59', dim: bar ? .38 * seg(t, 170.35, 170.8) : 0,
      hero: t < 170.35 ? {} : t < TNO ? { lookX: .3, lookY: -1 } : { eyes: 'normal', mouth: 'flat' } });
    if (bar) {
      const k = backOut(seg(t, 170.35, 170.7));
      limitBar(620, 118 - (1 - k) * 80, 760, 0, { grey: true, label: 'НЕДЕЛЬНЫЙ ЛИМИТ · 0 ТОКЕНОВ' });
      count(t);
    }
    camEnd();
  }
  // 177.6 «тишина»: only the lamp and a moth
  function sSilence(t, lt) {
    camBegin(700 + lt * 10, 560, 1.7 + lt * .08);
    room(t, { clock: 'ВС 23:59', hero: { eyes: 'normal', mouth: 'flat' } });
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#07060C', washOp: 130, ink: null });
    paint(ellPts(580, 560, 150, 150, 24), { wash: R.light, washOp: 30, ink: null });
    moth(t);
    camEnd();
  }
  // 179.3 «я счастлив»: leans back, eyes closed, the moon comes out
  function sHappy(t, lt) {
    const lean = easeOut(seg(t, 179.42, 179.9));
    camBegin(lerp(700, 660, lt / 1.5), 450, 1.22 + lt * .03);
    room(t, { moon: ease(seg(t, 179.4, 180.4)), clock: 'ВС 23:59',
      hero: { eyes: lean > .3 ? 'closed' : 'normal', mouth: lean > .3 ? 'smile' : 'flat', rot: -.1 * lean, aL: lerp(-.55, -1.25, lean), aR: lerp(-.35, -1.2, lean), dy: -.3 * lean, squint: lean > .15 && lean < .3 ? 1 : 0 } });
    moth(t, .8);
    camEnd();
  }
  // 180.8 «полночь»: the clock flips to 00:00, the calendar page tears off
  function sMidnight(t, lt) {
    const age = t - MID, [sx, sy] = shakeXY(t, age > 0 && age < .2 ? 5 : 0);
    camBegin(1620 + sx, 530 + sy, 1.95 - lt * .05);
    room(t, { moon: 1, clock: age < 0 ? 'ВС 23:59' : 'ПН 00:00', oldClock: 'ВС 23:59', flip: age < 0 ? -1 : age, tear: age < .08 ? -1 : (age - .08) / .7,
      pulse: Math.exp(-Math.abs(t - 182.44) * 6) * 1.5, hero: { eyes: 'closed', mouth: 'smile', rot: -.1, aL: -1.25, aR: -1.2, dy: -.3 } });
    camEnd();
  }
  // 183.4 the notification: «Ваш недельный лимит восстановлен», the bar snaps to 100% on «восстановлен»
  function sReset(t, lt) {
    const snap = t >= RESET, sa = t - RESET;
    camBegin(lerp(900, 880, lt / 4.7), lerp(470, 500, lt / 4.7), 1 + ease(lt / 4.7) * .12);
    const h = { eyes: 'normal', mouth: 'flat', rot: -.1 * (1 - seg(t, NOTE, NOTE + .3)), aL: lerp(-1.25, -.55, easeOut(seg(t, NOTE, NOTE + .35))), aR: lerp(-1.2, -.35, easeOut(seg(t, NOTE, NOTE + .35))) };
    Object.assign(h, mood(t, [[183.3, 'closed'], [NOTE + .05, 'look'], [RESET + .6, 'narrow']]), { lookX: .2, lookY: -1 });
    if (t < NOTE + .05) Object.assign(h, { mouth: 'smile', dy: -.3 });
    room(t, { moon: 1, clock: 'ПН 00:00', tear: 2, screen: 1 + (snap ? 1.5 * Math.exp(-sa * 3) : 0), screenCol: snap ? TK.led : R.screen, hero: h });
    const k = seg(t, NOTE, NOTE + .5);
    if (k > 0) {                                                                    // the ding: rings off the card
      for (let i = 0; i < 2; i++) { const p = seg(t, NOTE + i * .18, NOTE + .9 + i * .18); if (p > 0 && p < 1) paint(rrPts(560 - p * 60, 90 - p * 40, 800 + p * 120, 160 + p * 80, 30), { ink: TK.cream, sw: 1.6 * (1 - p) }); }
      uiCard(560, 90, 800, 160, { k, icon: 'clawd', title: 'Claude', body: ['Ваш недельный лимит восстановлен.', 'Приятной рабочей недели!'], time: '00:00', accent: TK.blue });
    }
    const bk = backOut(seg(t, 184.4, 184.8));
    if (bk > .02) {
      if (snap && sa < .5) glowAt(960, 390, 260, TK.led, 120 * (1 - sa / .5));
      limitBar(660, 360 - (1 - bk) * 50, 600, snap ? 1 : 0, { grey: !snap, glow: snap ? .5 + Math.exp(-sa * 4) : 0, col: snap ? TK.led : undefined });
      if (snap) letter('+100%', 1330, 280, 54, TK.led, { font: ruFont(54), pop: sa * 4, rot: -.1, stroke: TK.soot });
    }
    if (snap && sa < .25) flash((1 - sa / .25) * .35, TK.led);
    camEnd();
  }
  // 188.1 «…Сука.»: extreme deadpan close-up, green light from below
  function sSuka(t, lt) {
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: R.wallDk, fill: R.wall, fillOp: 120, tex: .6, ink: null });
    glowAt(960, 1200, 900, TK.led, 90);
    const u = 150 + lt * 8;
    clawd(960, 540 + 6 * u, u, { eyes: 'narrow', mouth: 'flat', noShadow: true, aL: -.6, aR: -.6 });
    paint(ellPts(960, 1180, 900, 260, 24), { fill: TK.led, fillOp: 60, bleed: .3, tex: .2, ink: null });
  }

  // ---------- the explosion ----------
  const hbOf = t => bpOf(t) * 2;
  const burnBar = (t, x = 460, y = 54, w = 1000) => limitBar(x, y, w, 1 - ease(seg(t, CRASH + .1, B(330))), { burn: 1, glow: .4 });
  function sootBg(t, k = 1) {
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: TK.soot, fill: TK.emberDk, fillOp: 90 * k, bleed: .15, tex: .6, border: .3, ink: null });
  }
  function fireWall(t, k = 1, y = 1100) {
    glowAt(960, y - 200, 900, TK.orange, 110 * k);
    for (let i = 0; i < 5; i++) fire(-80 + i * 520, y, 640, 620 * k * (.85 + .3 * hash(i + 3)), t + i * .7, { seed: i * 11, k: 1 });
  }
  function embers(t, n, k = 1, seed = 0) {
    for (let i = 0; i < n; i++) {
      const p = frac(t * (.18 + hash(i + seed) * .2) + hash(i * 3 + seed)), x = hash(i * 7 + seed) * W + Math.sin(t * 2 + i) * 40, y = H - p * (H + 100);
      const r = (2 + hash(i + 11) * 5) * (1 - p * .5);
      paint(ellPts(x, y, r, r, 6), { wash: p < .5 ? TK.yellow : TK.orange, washOp: 255 * k * (1 - p), ink: null });
    }
  }
  // 189.0 the room blows apart into the furnace
  function sBlast(t, lt) {
    const b = 1 - Math.pow(1 - seg(t, CRASH, CRASH + 1.6), 2), hb = hbOf(t), [sx, sy] = shakeXY(t, 14 * Math.exp(-lt * 1.5) + 4 * pulse2(t));
    sootBg(t);
    fireWall(t, .5 + .5 * b);
    tokenRain(t, { n: 8, seed: 4, r: 20, burn: .5 });
    // wall shards fly outward from the laptop
    push(); translate(sx, sy);
    for (let i = 0; i < 12; i++) {
      const gx = i % 4, gy = Math.floor(i / 4), x0 = -300 + gx * 630, y0 = -300 + gy * 560, cx = x0 + 315, cy = y0 + 280;
      const dx = cx - 1000, dy = cy - 600, d = Math.hypot(dx, dy) || 1, f = b * (700 + hash(i) * 500);
      push(); translate(cx + dx / d * f, cy + dy / d * f - b * b * 200); rotate((hash(i + 5) - .5) * 2.4 * b); scale(1 - b * .35);
      paint(rectPts(-315, -280, 630, 560, 30), { wash: R.wallDk, fill: R.wall, fillOp: 150, tex: .6, ink: b > .02 ? INK : null, sw: 1.2 });
      pop();
    }
    pop();
    // room objects tumble out (as cameras, so their lettering flies with them)
    const fly = (ox, oy, vx, vy, spin, fn) => { place(ox + sx + vx * b, oy + sy + vy * b + b * b * 300, 1 - b * .2, spin * b, ox, oy); fn(); camEnd(); };
    fly(335, 310, -900, -500, -1.6, () => windowPane(t, { moon: 1 }));
    fly(1700, 475, 800, -700, 2.2, () => calendar(t, { tear: 2 }));
    fly(1635, 687, 900, 200, 3, () => deskClock(t, { clock: 'ПН 00:00', flip: 1 }));
    fly(570, 610, -1000, 250, -2.5, () => lamp(t, {}));
    fly(960, 880, 0, 700, .3, () => desk());
    // Clawd springs up screaming, fists on the half-beats
    const hop = Math.abs(Math.sin(hb * Math.PI * .5)), up = seg(t, CRASH + .15, CRASH + .45);
    push(); translate(sx, sy);
    clawd(960, lerp(GY, 900, up), lerp(U, 40, up), {
      eyes: up > .3 ? 'angry' : 'narrow', mouth: up > .3 ? 'O' : 'flat', dy: -hop * 3 * up, sq: (1 - hop) * .15 * up,
      aL: lerp(-.5, 1.6, up) + .3 * Math.sin(hb * Math.PI), aR: lerp(-.3, 1.6, up) - .3 * Math.sin(hb * Math.PI), armL: fist(PAL.clay), armR: fist(PAL.clay), rot: (hash(Math.floor(hb)) - .5) * .12 * up
    });
    pop();
    // the laptop spews its fresh limit
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (hash(i + 30) - .5) * 2.6, v = 700 + hash(i + 31) * 700, p = lt * (.9 + hash(i) * .3);
      token(1000 + Math.cos(a) * v * p, 600 + Math.sin(a) * v * p + 600 * p * p, 22 + hash(i + 2) * 14, { spin: t * 2 + i, burn: clamp(p * 1.2) });
    }
    burnBar(t);
    flash(1 - seg(t, CRASH, CRASH + .35), TK.yellowLt);
  }
  // 191.4 the data center reignites, Clawd swings the laptop overhead like a guitar
  function sHall(t, lt) {
    const hb = hbOf(t), p2 = pulse2(t), heat = lerp(.4, 1, seg(t, B(317), B(320))), [sx, sy] = shakeXY(t, 5 * p2);
    camBegin(960 + sx, 540 + sy, 1.04 + .03 * p2 + lt * .02);
    dataCenter(t, { heat, fire: seg(t, B(318), B(320)), vp: [960, 480] });
    for (const s of [-1, 1]) cooler(960 + s * 820, 200, 90, t, { speed: 9, howl: 1 });
    tokenRain(t, { n: 10, seed: 7, r: 20, from: [960, 520], to: [300, 250], per: .9 });
    tokenRain(t, { n: 10, seed: 9, r: 20, from: [960, 520], to: [1620, 250], per: .9 });
    const sw = Math.sin(hb * Math.PI), hop = Math.abs(Math.sin(hb * Math.PI * .5));
    clawd(960, 930, 30, {
      eyes: 'angry', mouth: 'grin', dy: -hop * 1.5, sq: (1 - hop) * .12, aL: 1.9 + sw * .25, aR: 1.9 - sw * .25, rot: sw * .08,
      draw: (u) => {                                                                 // the laptop held overhead, swinging
        push(); translate(0, -12.5 * u); rotate(sw * .35);
        paint(rectPts(-6 * u, -3.6 * u, 12 * u, 7 * u, 1), { wash: '#6B7581', fill: TK.steelDk, fillOp: 90, ink: INK, sw: 1.2 });
        paint(rectPts(-5 * u, -2.8 * u, 10 * u, 5.4 * u), { wash: TK.led, fill: TK.greenDk, fillOp: 60, tex: .5, ink: null });
        paint([[-6 * u, 3.4 * u], [6 * u, 3.4 * u], [7.4 * u, 5.6 * u], [-7.4 * u, 5.6 * u]], { wash: '#9AA3AE', ink: INK, sw: 1 });
        paint(ellPts(0, 0, 1.6 * u, 1.6 * u, 14), { wash: TK.cream, ink: null });
        paint(rectPts(-.8 * u, -.9 * u, 1.6 * u, .5 * u), { wash: TK.greenDk, ink: null }); paint(rectPts(-.25 * u, -.9 * u, .5 * u, 1.9 * u), { wash: TK.greenDk, ink: null });
        pop();
      }
    });
    camEnd();
    burnBar(t);
    flash(p2 * .12, TK.orange);
  }
  // 194.4 the punk collage: a cutout of every chapter slams in on each beat
  const CUTS = [
    { x: 300, y: 400, w: 380, h: 410, r: -.1, paper: TK.cream, draw: (t) => { ceoClawd(0, 150, 20, { click: pulse2(t), aR: 1.2 + .3 * pulse2(t), eyes: 'happy' }); letter('БОЛЬШЕ GPU!', 0, -150, 40, TK.ember, { font: ruFont(40), ink: false }); } },
    { x: 1600, y: 300, w: 460, h: 230, r: .08, paper: TK.yellow, draw: (t) => gpuCard(0, 0, 1.05, t, { glow: .5 + pulse2(t) * .5 }) },
    { x: 960, y: 225, w: 780, h: 150, r: .03, paper: TK.soot, draw: (t) => counter(0, 0, 72, 300e9 + (t - 196) * 7e8) },
    { x: 1560, y: 650, w: 460, h: 330, r: -.06, paper: TK.steelDk, draw: (t) => stockChart(-215, -150, 430, 300, t, { moon: 1, title: 'TOKN ▲' }) },
    { x: 350, y: 760, w: 340, h: 300, r: .07, paper: '#CFE0FF', draw: (t) => agentBot(0, 110, 16, t, { hire: true, n: 42, eyes: 'happy', dance: 'bounce' }) },
    { x: 760, y: 560, w: 260, h: 290, r: -.12, paper: TK.cream, draw: (t) => {
      paint(rectPts(-130, -145, 260, 50), { wash: TK.ember, ink: null });
      letter('ВС', 0, -10, 100, TK.ember, { font: ruFont(100), ink: false }); letter('ВОСКРЕСЕНЬЕ', 0, 80, 26, INK, { font: ruFont(26), ink: false });
      fire(0, 150, 260, 200, t, { seed: 3, k: .9 });
    } }
  ];
  function cutout(c, i, t, t0) {
    const age = t - t0; if (age < 0) return;
    const hb = Math.floor(hbOf(t)), z = age < .1 ? lerp(1.9, 1, easeOut(age / .1)) : 1 + .04 * pulse2(t), r = c.r + (hash(i * 13 + hb) - .5) * .06;
    place(c.x, c.y, z, r);
    paint(rectPts(-c.w / 2 + 12, -c.h / 2 + 16, c.w, c.h, 6), { wash: '#07060C', washOp: 150, ink: null });
    paint(rectPts(-c.w / 2, -c.h / 2, c.w, c.h, 7), { wash: c.paper, fill: mixCol(c.paper, TK.soot, .25), fillOp: 60, tex: .6, border: .5, ink: INK, sw: 1 });
    c.draw(t);
    inkLine([[-c.w * .3, -c.h / 2 - 8], [-c.w * .1, -c.h / 2 + 10]], 7, '#E9E0C8', 'marker', 0);     // tape
    camEnd();
    if (age < .12) paint(rectPts(c.x - c.w * .6, c.y - c.h * .6, c.w * 1.2, c.h * 1.2), { fill: TK.yellowLt, fillOp: 140 * (1 - age / .12), bleed: .3, ink: null });
  }
  function sCollage(t, lt) {
    const hb = hbOf(t), p2 = pulse2(t), [sx, sy] = shakeXY(t, 6 * p2);
    sootBg(t);
    fireWall(t, 1, 1120);
    tokenRain(t, { n: 16, seed: 12, r: 22, burn: .6 });
    push(); translate(sx, sy);
    const hop = Math.abs(Math.sin(hb * Math.PI * .5));
    clawd(1000, 930, 31, { eyes: 'angry', mouth: 'O', dy: -hop * 3, sq: (1 - hop) * .15, aL: 1.7 + .4 * Math.sin(hb * Math.PI), aR: 1.7 - .4 * Math.sin(hb * Math.PI), armL: fist(PAL.clay), armR: fist(PAL.clay), rot: (hash(Math.floor(hb) + 3) - .5) * .2, noShadow: true });
    pop();
    CUTS.forEach((c, i) => cutout(c, i, t, B(322 + i)));
    punkText('ЭКОНОМИКА РАБОТАЕТ!', 1000, 420, 62, t, B(328), { seed: 3 });
    punkText('ДОХОДЫ — ПОТОМ!', 1000, 560, 58, t, B(329), { seed: 8, step: .012 });
    burnBar(t);
    flash(p2 * .15 * (frac(hb) < .5 ? 1 : 0), TK.yellowLt);
  }
  // 199.24 the band stops: ashes, a burnt-out bar at 0%, Clawd covered in soot
  function sAsh(t, lt) {
    sootBg(t, .3 * (1 - seg(lt, 0, .8)));
    glowAt(960, 1100, 700, TK.emberDk, 90 * (1 - seg(lt, 0, 1.2)));
    for (let i = 0; i < 5; i++) smoke(260 + i * 350, 1000, t, { seed: i * 3, n: 5, r: 60, h: 600, col: '#3A3336' });
    for (let i = 0; i < 7; i++) token(560 + i * 140 + hash(i) * 40, 925 + hash(i + 4) * 12, 18, { burn: 1, rot: hash(i) * 3 });
    clawd(960, 915, 26, { col: '#5A4E4C', dk: '#3A3232', lt: '#7A6E6A', eyes: 'narrow', mouth: 'flat', aL: -.6, aR: -.6 });
    smoke(1010, 600, t, { n: 4, r: 18, h: 160, per: 1.6, seed: 4 });
    limitBar(660, 300, 600, 0, { grey: true });
    embers(t, 16, 1 - seg(lt, 0, 1.2), 5);
  }
  // 200.44 second «Сука»: the stamp, then the credit on soot black, embers fading out
  function sEnd(t, lt) {
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: TK.soot, ink: null });
    const fade = 1 - seg(t, 202.8, 203.96);
    glowAt(960, 440, 520, TK.emberDk, 90 * Math.exp(-lt * .8) + 60 * Math.exp(-Math.max(0, t - 202) * 1.5) * (t > 202 ? 1 : 0));
    embers(t, 26, fade * (.5 + .5 * Math.exp(-Math.max(0, t - 202) * 2) * (t > 202 ? 1 : 0) + .3), 9);
    stamp('ЖГИ ТОКЕНЫ', 960, 430, 150, t, 200.44, { col: TK.ember, punch: .03 });
    if (t >= 202) {
      const a = t - 202;
      token(620, 700, 26, { burn: .3, glow: .5 * fade, rot: -.2 });
      letter('created by Claude Opus 5.5', 985, 700, 58, TK.cream, { pop: a * 4, rot: -.03 });
    }
  }

  chapter('outro', 162.6, DUR + 1, [
    [162.6, sRoom], [177.6, sSilence], [179.3, sHappy], [180.8, sMidnight], [183.4, sReset], [188.1, sSuka],
    [CRASH, sBlast], [B(317), sHall], [B(322), sCollage], [B(330), sAsh], [200.44, sEnd]
  ]);
})();
