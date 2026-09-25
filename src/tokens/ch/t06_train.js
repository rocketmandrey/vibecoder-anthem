// t06_train.js: «Жги токены» verse 3 (124.7–146.3), fast punk verse, animated on half-beats.
// AGI "by spring" crossed out year after year → a loading bar that only grows nines → a robot arm writing
// dissertations and code → programmer desks tagged «ВОТ-ВОТ» → Clawd hugs a board game → the painted route map
// fills in → pull back: an endless data center powers the board → the payoff: a toy train through a sunset
// pine forest to «КАЗАНЬ», smoke puffs on the half-beat, cables trailing back to the burning data center.
(() => {
  const HB = n => OFF + n * BEAT / 2;                     // song time of half-beat n (HB(420) = 127.0)
  const hbOf = t => bpOf(t) * 2;
  const INK = PAL.ink;
  const full = (col, o = {}) => paint(rectPts(-80, -80, W + 160, H + 160), { wash: col, ink: null, ...o });
  const bands = (y0, y1, cols, n = 10) => {                 // vertical gradient through a list of colours
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1), s = f * (cols.length - 1), j = Math.min(cols.length - 2, Math.floor(s));
      paint(rectPts(-80, lerp(y0, y1, i / n) - 2, W + 160, (y1 - y0) / n + 6), { wash: mixCol(cols[j], cols[j + 1], s - j), ink: null });
    }
  };
  const glow = (x, y, r, col, op = 80) => paint(ellPts(x, y, r, r, 18), { fill: col, fillOp: op, bleed: .3, tex: .2, border: .1, ink: null });
  const cap = (a, b, w) => {                                // capsule polygon from a to b, w thick
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d * w / 2, ny = dx / d * w / 2, ux = dx / d * w / 2, uy = dy / d * w / 2;
    return [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] + ux * .8 + nx * .4, b[1] + uy * .8 + ny * .4], [b[0] + ux * .8 - nx * .4, b[1] + uy * .8 - ny * .4],
            [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny], [a[0] - ux * .8 - nx * .4, a[1] - uy * .8 - ny * .4], [a[0] - ux * .8 + nx * .4, a[1] - uy * .8 + ny * .4]];
  };
  const ru = (txt, x, y, s, col, o = {}) => letter(txt, x, y, s, col, { font: ruFont(s), ...o });
  const puff = (x, y, r, col, op, rim) => {
    paint(ellPts(x, y, r, r * .86, 14, r * .06), { wash: col, washOp: op, fill: rim || col, fillOp: op * .35, bleed: .25, tex: .5, border: .6, ink: null });
  };

  // ======================================================================================================
  // 1) 124.7 «ЭЙДЖИАЙ к весне обещают опять»: the ВЕСНА page gets an X and is torn off, year after year
  // ======================================================================================================
  const CAL = { x: 900, y: 150, w: 600, h: 660 };
  function calPage(yr, x, y, w, h, crossK, lift, txt = true) {
    // lift 0..1: the sheet peels up off the rings (its height folds to 0 about the top edge)
    const sy = 1 - ease(lift), ph = h * sy; if (ph < 4) return;
    const tilt = Math.sin(lift * Math.PI) * .08;
    push(); translate(x + w / 2, y); rotate(tilt); translate(-(x + w / 2), -y);
    paint(rectPts(x, y, w, ph, 1.5), { wash: '#FBF6EA', fill: '#E8DCC6', fillOp: 70, tex: .5, border: .5, ink: INK, sw: 1.1 });
    if (sy > .25) {
      const s = sy;
      paint(rectPts(x, y, w, 120 * s), { wash: TK.ember, fill: TK.emberDk, fillOp: 60, tex: .5, ink: null });
      if (txt) ru(String(yr), x + w / 2, y + 62 * s, 88 * s, TK.cream, { ink: true });
      // a little blossom branch
      inkLine([[x + 30, y + 250 * s], [x + 110, y + 200 * s], [x + 170, y + 186 * s]], 2.2, '#6B4A36', 'ink', .5);
      for (let i = 0; i < 5; i++) {
        const bx = x + 44 + i * 30, by = y + (228 - Math.sin(i) * 26) * s;
        paint(ellPts(bx, by, 13, 13 * s, 10), { wash: i % 2 ? '#F4B6C6' : '#FAD2DC', ink: INK, sw: .4 });
        paint(ellPts(bx, by, 4, 4 * s, 6), { wash: TK.yellow, ink: null });
      }
      if (txt) ru('ВЕСНА', x + w / 2 + 75, y + 228 * s, 96 * s, '#3F8F4A');
      if (txt) ru('AGI', x + w - 80, y + 155 * s, 34 * s, TK.blue, { ink: false });
      for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
        const gx = x + 40 + c * (w - 80) / 7, gy = y + (320 + r * 78) * s;
        paint(rectPts(gx + 4, gy, (w - 80) / 7 - 8, 64 * s), { wash: c > 4 ? '#F6DCD6' : '#F1EBDD', ink: TK.ash, sw: .35 });
        if (txt) ru(String(r * 7 + c + 1), gx + 22, gy + 18 * s, 20 * s, c > 4 ? TK.ember : '#6A6070', { ink: false });
      }
      // the red X, two marker strokes
      const a = seg(crossK, 0, .5), b = seg(crossK, .5, 1);
      if (a > .02) paint(cap([x + 50, y + 150 * s], [lerp(x + 50, x + w - 50, a), lerp(y + 150 * s, y + (h - 40) * s, a)], 26), { wash: TK.ember, washOp: 225, ink: null });
      if (b > .02) paint(cap([x + w - 50, y + 150 * s], [lerp(x + w - 50, x + 50, b), lerp(y + 150 * s, y + (h - 40) * s, b)], 26), { wash: TK.ember, washOp: 225, ink: null });
    }
    pop();
  }
  function spring(t, lt) {
    const hb = hbOf(t), c = clamp(Math.floor((hb - 414) / 2), 0, 3);
    const xT = HB(414 + 2 * c), fT = HB(415 + 2 * c);
    const crossK = c < 3 ? seg(t, xT, xT + .2) : 0, lift = c < 3 ? seg(t, fT, fT + .26) : 0;
    const hit = c < 3 ? Math.exp(-Math.max(0, t - xT) * 9) * (t >= xT ? 1 : 0) : 0, [sx, sy] = shakeXY(t, 9 * hit);
    full('#E6D5BC', { fill: '#CDB594', fillOp: 70, tex: .6, border: .3 });
    camBegin(980 + sx + lt * 20, 520 + sy, 1.03 + lt * .035 + hit * .025);
    for (let i = 0; i < 9; i++) inkLine([[-100 + i * 260, -60], [-100 + i * 260, 900]], .5, '#CDB594', 'inkfine', 0);   // wallpaper stripes
    paint(rectPts(-200, 880, W + 400, 400), { wash: '#9C7048', fill: '#6E4A2E', fillOp: 90, tex: .6, ink: INK, sw: 1 });
    for (let i = 0; i < 12; i++) inkLine([[-200 + i * 200, 885], [-260 + i * 200, 1100]], .6, '#6E4A2E', 'inkfine', 0);
    // crumpled crossed-out springs piling up on the floor
    for (let i = 0; i < c + 2; i++) {
      const px = 1060 + i * 120 - (i % 2) * 40, py = 915 - (i > 2 ? 30 : 0);
      paint(ellPts(px, py, 56, 40, 12, 5), { wash: '#F4EDDD', fill: '#D9CBB0', fillOp: 90, tex: .7, ink: INK, sw: .7 });
      paint(cap([px - 30, py - 16], [px + 26, py + 18], 9), { wash: TK.ember, ink: null });
      paint(cap([px + 28, py - 18], [px - 24, py + 16], 9), { wash: TK.ember, ink: null });
    }
    // calendar: backing board, the next year beneath, the current sheet on top
    const { x, y, w, h } = CAL;
    inkLine([[x + w / 2, y - 70], [x + 40, y + 10]], 1.2, INK, 'ink', 0);
    inkLine([[x + w / 2, y - 70], [x + w - 40, y + 10]], 1.2, INK, 'ink', 0);
    paint(ellPts(x + w / 2, y - 72, 9, 9, 8), { wash: TK.steel, ink: INK, sw: .6 });
    paint(rectPts(x - 16, y - 20, w + 32, h + 36, 1), { wash: '#5B3A26', fill: '#3A2418', fillOp: 90, tex: .5, ink: INK, sw: 1 });
    const yr = 2025 + c;
    calPage(yr + 1, x, y, w, h, 0, 0, lift > .8);
    calPage(yr, x, y, w, h, crossK, lift, lift <= .45);
    for (let i = 0; i < 9; i++) paint(ellPts(x + 50 + i * (w - 100) / 8, y - 4, 10, 16, 10), { ink: TK.steelLt, sw: 1.3 });
    // CEO-Clawd promises, clicker up; mouth chatters on the half-beat
    const talk = Math.floor(hb) % 2 === 0;
    ceoClawd(400, 870, 34, { aR: 1.1 + .25 * pulse2(t, 5), aL: -.2, mouth: talk ? 'grin' : 'smile', click: pulse2(t, 8), eyes: 'happy', dy: -Math.abs(Math.sin(hb * Math.PI)) * .5 });
    // speech bubble
    const bx = 420, by = 300, bk = backOut(seg(t, 124.95, 125.25));
    if (bk > .02) {
      push(); translate(bx, by); scale(bk); translate(-bx, -by);
      paint([[bx - 20, by + 80], [bx + 30, by + 80], [bx - 60, by + 200]], { wash: '#FFFFFF', ink: INK, sw: 1 });
      paint(ellPts(bx, by, 260, 115, 26), { wash: '#FFFFFF', ink: INK, sw: 1.2 });
      paint([[bx - 14, by + 100], [bx + 24, by + 100], [bx - 50, by + 180]], { wash: '#FFFFFF', ink: null });
      pop();
      ru('AGI К ВЕСНЕ!', bx, by - 10, 62 * bk, TK.blue, { ink: false, rot: -.04 });
      ru('(в этот раз точно)', bx + 20, by + 55, 32 * bk, '#6A6070', { ink: false, rot: -.04 });
    }
    if (hit > .05) sfx('ВЖУХ', x + w + 70, y + 420, 60, TK.ember, t - xT, { life: .4, rot: .2, font: ruFont(60) });
    camEnd();
  }

  // ======================================================================================================
  // 2) 127.0 «Каждый релиз — осталось чуть-чуть подождать»: 99% → 99.9% → 99.99%… Clawd grows cobwebs
  // ======================================================================================================
  const RELEASES = [[421, '5.0', '99.9'], [424, '6.0', '99.99'], [427, '7.0', '99.999'], [430, '8.0', '99.9999']];
  function loading(t, lt) {
    const hb = hbOf(t);
    full(TK.soot, { fill: '#2A2530', fillOp: 90, tex: .5 });
    const zoom = 1.02 + lt * .03;
    camBegin(960, 520, zoom);
    // monitor
    const mx = 170, my = 90, mw = 1300, mh = 620;
    glow(mx + mw / 2, my + mh / 2, 700, '#6C8CFF', 45);
    paint(rrPts(mx - 26, my - 26, mw + 52, mh + 52, 26, 1), { wash: '#26232B', fill: '#111015', fillOp: 90, tex: .5, ink: INK, sw: 1.4 });
    paint(rectPts(mx, my, mw, mh), { wash: '#F4F2EE', fill: '#DDE3EF', fillOp: 50, tex: .4, ink: null });
    paint(rectPts(mx + mw / 2 - 60, my + mh + 26, 120, 110), { wash: '#26232B', ink: INK, sw: 1 });
    paint(rrPts(mx + mw / 2 - 220, my + mh + 128, 440, 30, 12), { wash: '#26232B', ink: INK, sw: 1 });
    // title bar dots
    for (let i = 0; i < 3; i++) paint(ellPts(mx + 34 + i * 34, my + 30, 10, 10, 10), { wash: [TK.ember, TK.yellow, TK.green][i], ink: null });
    ru('ЗАГРУЗКА AGI…', mx + 80, my + 120, 70, '#1E1E24', { align: 'left', ink: false });
    // the bar: races to 99% then sticks; every release adds a nine
    let r = -1; for (let i = 0; i < RELEASES.length; i++) if (t >= HB(RELEASES[i][0])) r = i;
    const pct = r < 0 ? String(Math.min(99, Math.floor(99 * easeOut(seg(lt, 0, .45))))) : RELEASES[r][2];
    const v = r < 0 ? Math.min(.99, .99 * easeOut(seg(lt, 0, .45))) : .99 + (r + 1) * .0022;
    const bx = mx + 90, by = my + 330, bw = mw - 180, bh = 90;
    paint(rrPts(bx, by, bw, bh, 20, 1), { wash: '#E3E1DC', ink: INK, sw: 1.2 });
    const shud = Math.sin(t * 60) * 2;
    paint(rrPts(bx + 10, by + 10, (bw - 20) * v + shud, bh - 20, 14), { wash: TK.blue, fill: TK.blueDk, fillOp: 70, tex: .5, ink: null });
    for (let i = 0; i < 16; i++) { const sx = bx + 30 + frac(t * .6 + i / 16) * (bw - 60) * v; inkLine([[sx, by + 16], [sx - 26, by + bh - 16]], 3, '#6C8CFF', 'inkfine', 0); }
    const rp = r >= 0 ? pulse2(t, 8) * (t - HB(RELEASES[r][0]) < .3 ? 1 : 0) : 0;
    ru(pct + '%', bx + bw, by + bh + 80, 96 * (1 + rp * .12), r >= 0 && rp > .3 ? TK.ember : '#1E1E24', { align: 'right', ink: false });
    // spinner
    for (let i = 0; i < 8; i++) { const a = t * 6 + i / 8 * TAU; paint(ellPts(bx + 60 + Math.cos(a) * 34, by + bh + 80 + Math.sin(a) * 34, 7, 7, 8), { wash: mixCol(TK.blue, '#E3E1DC', i / 8), ink: null }); }
    ru('осталось чуть-чуть…', bx + 130, by + bh + 80, 38, '#6A6070', { align: 'left', ink: false });
    // release notes stack in at the top right of the screen
    RELEASES.forEach(([n, ver], i) => {
      const k = seg(t, HB(n), HB(n) + .22); if (k <= 0) return;
      uiCard(1200, 30 + (RELEASES.filter(q => t >= HB(q[0])).length - 1 - i) * 96, 660, 86, { k, title: 'Релиз ' + ver + ' вышел!', body: '«осталось чуть-чуть подождать»', icon: 'bell', accent: TK.blue, time: 'сейчас' });
    });
    // Clawd waits on a stool; cobwebs and dust grow
    const age = lt, web = seg(age, .4, 2.6);
    paint(rectPts(1540, 790, 26, 150), { wash: '#6E4A2E', ink: INK, sw: .7 });
    paint(rectPts(1680, 790, 26, 150), { wash: '#6E4A2E', ink: INK, sw: .7 });
    paint(rrPts(1500, 770, 240, 30, 10), { wash: '#9C7048', ink: INK, sw: .9 });
    clawd(1620, 790, 22, { eyes: age > 2 ? 'closed' : 'narrow', mouth: 'flat', aL: -.5, aR: -.4, noShadow: true, sq: .04 * Math.sin(t * 2) });
    if (age > 2) emote('zzz', 1760, 560, 18, seg(age, 2, 2.3));
    if (web > .02) {
      const wx = 1620, wy = 614, pts = [[mx + mw + 26, my + mh - 120], [mx + mw + 26, my + mh + 26]];
      for (const [px, py] of pts) inkLine([[px, py], [lerp(px, wx, web), lerp(py, wy, web) + Math.sin(web * 3) * 10]], 1.6, '#EDEAE4', 'ink', .5);
      for (let q = 1; q < 4; q++) { const f = q / 4 * web; inkLine([[lerp(pts[0][0], wx, f), lerp(pts[0][1], wy, f)], [lerp(pts[1][0], wx, f) , lerp(pts[1][1], wy, f)]], 1.1, '#EDEAE4', 'ink', .6); }
      // dust motes
      for (let i = 0; i < 10; i++) paint(ellPts(1540 + hash(i) * 180, 560 + frac(hash(i + 4) + t * .2) * 220, 3, 3, 6), { wash: '#BDB6A8', washOp: 200 * web, ink: null });
    }
    camEnd();
  }

  // ======================================================================================================
  // 3) 129.95 «Пишет диссертации и код»: an industrial arm alternates between a scroll and a code screen
  // ======================================================================================================
  function ik(bx, by, tx, ty, l1, l2, up) {
    const dx = tx - bx, dy = ty - by, d = clamp(Math.hypot(dx, dy), 20, l1 + l2 - 1), a = Math.atan2(dy, dx);
    const c = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), a1 = a + up * Math.acos(clamp(c, -1, 1));
    return [bx + Math.cos(a1) * l1, by + Math.sin(a1) * l1];
  }
  function robotArm(base, tip, elbow, t, o = {}) {
    const [bx, by] = base, sh = o.sh || [bx, by - 120];
    paint(rectPts(bx - 44, sh[1], 88, by - sh[1]), { wash: TK.steel, fill: TK.steelDk, fillOp: 90, tex: .5, ink: INK, sw: 1 });
    paint(rrPts(bx - 110, by - 40, 220, 70, 14, 1), { wash: TK.steel, fill: TK.steelDk, fillOp: 90, tex: .5, ink: INK, sw: 1.1 });
    paint(rrPts(bx - 60, sh[1] - 10, 120, 100, 18, 1), { wash: TK.orange, fill: TK.orangeDk, fillOp: 80, tex: .5, ink: INK, sw: 1.1 });
    for (const [a, b, w] of [[sh, elbow, 62], [elbow, tip, 46]]) {
      paint(cap(a, b, w), { wash: TK.yellow, fill: TK.goldDk, fillOp: 70, tex: .5, border: .5, ink: INK, sw: 1.1 });
      inkLine([[lerp(a[0], b[0], .15), lerp(a[1], b[1], .15)], [lerp(a[0], b[0], .85), lerp(a[1], b[1], .85)]], 1.2, TK.soot, 'ink', .5);
    }
    inkLine([sh, [lerp(sh[0], elbow[0], .5) - 30, lerp(sh[1], elbow[1], .5)], elbow], 1.6, TK.soot, 'ink', .5);   // hose
    for (const [jx, jy, r] of [[sh[0], sh[1], 42], [elbow[0], elbow[1], 34]]) {
      paint(ellPts(jx, jy, r, r, 16), { wash: TK.steel, fill: TK.steelDk, fillOp: 90, ink: INK, sw: 1 });
      paint(ellPts(jx, jy, r * .35, r * .35, 10), { wash: TK.led, ink: null });
    }
    // wrist + pen
    const a = Math.atan2(tip[1] - elbow[1], tip[0] - elbow[0]);
    paint(ellPts(tip[0], tip[1], 24, 24, 14), { wash: TK.steel, ink: INK, sw: .9 });
    const px = tip[0] + Math.cos(a) * 20, py = tip[1] + 70;
    paint(cap([tip[0], tip[1] + 10], [px, py], 16), { wash: TK.blue, ink: INK, sw: .8 });
    paint([[px - 6, py], [px + 6, py], [px, py + 18]], { wash: TK.soot, ink: null });
    return [px, py + 18];
  }
  function arm(t, lt) {
    const hb = hbOf(t), n = Math.floor(hb), f = hb - n, left = n % 2 === 0;
    full('#2B2F38', { fill: TK.steelDk, fillOp: 90, tex: .6 });
    camBegin(960 + Math.sin(lt * 1.3) * 30, 500, 1.02 + lt * .03);
    // factory back wall panels + warm window light
    for (let i = 0; i < 8; i++) paint(rectPts(-120 + i * 290, 40, 270, 620), { wash: i % 2 ? '#353B46' : '#313641', ink: '#232730', sw: .6 });
    glow(960, 260, 520, TK.yellowLt, 40);
    paint(rectPts(-200, 860, W + 400, 400), { wash: '#3E434C', fill: '#23272E', fillOp: 90, tex: .6, ink: INK, sw: 1 });
    for (let i = 0; i < 14; i++) paint([[i * 160 - 120, 860], [i * 160 - 40, 860], [i * 160 - 200, 1100], [i * 160 - 280, 1100]], { wash: i % 2 ? TK.yellow : TK.soot, washOp: 120, ink: null });
    // the scroll on a roller, feeding down; lines scroll with the writing
    const sx = 160, sw = 560, feed = (t - 129.95) * 90;
    paint(rrPts(sx - 30, 120, sw + 60, 50, 24, 1), { wash: '#8A5A36', fill: '#5A3520', fillOp: 90, ink: INK, sw: 1 });
    paint([[sx, 160], [sx + sw, 160], [sx + sw, 860], [sx + sw + 30, 900], [sx + sw + 90, 960], [sx - 20, 960], [sx, 880]], { wash: '#F6EEDB', fill: '#E3D3B0', fillOp: 80, tex: .5, border: .5, ink: INK, sw: 1, curv: .2 });
    ru('ДИССЕРТАЦИЯ', sx + sw / 2, 230 + (feed % 40) * 0 , 58, '#3A2A50', { ink: false });
    ru('№ ' + (1204 + Math.floor(Math.max(0, hb - 430) / 2)), sx + sw / 2, 290, 34, '#6A6070', { ink: false });
    for (let i = 0; i < 12; i++) {
      const ly = 340 + i * 44 + ((feed % 44) + 44) % 44 - 44; if (ly < 330 || ly > 850) continue;
      const lw = 360 + hash(i + Math.floor(feed / 44)) * 120;
      inkLine([[sx + 40, ly], [sx + 40 + lw * .3, ly - 4], [sx + 40 + lw * .6, ly + 3], [sx + 40 + lw, ly - 2]], 1.6, '#3A2A50', 'inkfine', .7);
    }
    // code monitor
    const cx = 1200, cy = 150, cw = 640, ch = 480;
    paint(rrPts(cx - 20, cy - 20, cw + 40, ch + 40, 18, 1), { wash: '#1A1C22', ink: INK, sw: 1.2 });
    paint(rectPts(cx, cy, cw, ch), { wash: '#1B2330', fill: '#2A3A50', fillOp: 70, ink: null });
    glow(cx + cw / 2, cy + ch / 2, 420, '#6C8CFF', 40);
    paint(rectPts(cx + cw / 2 - 40, cy + ch + 20, 80, 260), { wash: '#1A1C22', ink: INK, sw: 1 });
    const lines = Math.min(11, 3 + Math.floor(Math.max(0, hb - 430)) * 1.5);
    const code = ['def agi():', '  while True:', '    burn(tokens)', '    hire(agent)', '  return soon()', '# TODO: spring', 'def phd():', '  write(pages)', '  cite(itself)', 'assert AGI', '  # вот-вот'];
    for (let i = 0; i < lines; i++) letter(code[i], cx + 26 + (code[i].length - code[i].trimStart().length) * 9, cy + 34 + i * 40, 32, [TK.led, '#8EC3E6', TK.yellow, '#F4B6C6'][i % 4], { font: 'bold 32px "Courier New", monospace', align: 'left', ink: false });
    if (f < .5 && !left) paint(rectPts(cx + 26, cy + 20 + lines * 40, 16, 30), { wash: TK.led, ink: null });
    // keyboard
    paint([[cx + 60, 820], [cx + 520, 820], [cx + 560, 870], [cx + 20, 870]], { wash: '#2A2D34', ink: INK, sw: .9 });
    for (let i = 0; i < 12; i++) for (let j = 0; j < 2; j++) paint(rectPts(cx + 60 + i * 38 + j * 10, 826 + j * 20, 30, 14), { wash: '#4A4E58', ink: null });
    // finished dissertations pile up by the scroll
    const done = Math.floor(Math.max(0, hb - 430) / 2) + 3;
    for (let i = 0; i < done; i++) {
      const px = 830 + (i % 2) * 14, py = 930 - i * 30;
      paint(rrPts(px - 90, py - 26, 180, 30, 5), { wash: ['#7A2C3A', '#2E4A7A', '#2E5A3A'][i % 3], ink: INK, sw: .7 });
      paint(rectPts(px - 80, py - 22, 160, 6), { wash: TK.gold, ink: null });
    }
    // the arm: scroll on even half-beats, keyboard on odd ones; hops across then scribbles
    const at = s => s ? [sx + sw * .55, 520] : [cx + 320, 800];
    const from = at(!left), to = at(left), mv = easeOut(f / .35);
    const scrib = f > .35 ? [Math.sin(t * 70) * 22, Math.cos(t * 53) * 6] : [0, 0];
    const tx = lerp(from[0], to[0], mv) + scrib[0], ty = lerp(from[1], to[1], mv) - Math.sin(mv * Math.PI) * 140 + scrib[1] - 88;
    const base = [1010, 900], sh = [1010, 660], el = ik(sh[0], sh[1], tx, ty, 420, 380, tx < sh[0] ? 1 : -1);
    const pen = robotArm(base, [tx, ty], el, t, { sh });
    if (f > .35) for (let i = 0; i < 3; i++) paint(ellPts(pen[0] + (hash(i + n) - .5) * 30, pen[1] - 10 - hash(i + n + 3) * 30, 4, 4, 6), { wash: TK.yellow, ink: null });
    camEnd();
  }

  // ======================================================================================================
  // 4) 132.2 «Всех программистов заменит вот-вот»: a ceiling robot slaps «ВОТ-ВОТ» stickies on every monitor
  // ======================================================================================================
  const DESK0 = 438;                                          // half-beat the first sticky lands
  function desks(t, lt) {
    const hb = hbOf(t);
    full('#E4E0D6', { fill: '#C8C2B4', fillOp: 60, tex: .5 });
    const camX = lerp(760, 2140, ease(seg(t, 132.2, 134.4)));
    camBegin(camX, 530, 1.05);
    // windows with a grey city, ceiling rail
    for (let i = 0; i < 9; i++) {
      const x = -100 + i * 380;
      paint(rectPts(x, 120, 300, 330), { wash: '#BFD3E0', fill: '#9DB6C8', fillOp: 70, tex: .4, ink: INK, sw: .8 });
      for (let k = 0; k < 3; k++) paint(rectPts(x + 20 + k * 95, 330 - hash(i * 3 + k) * 150, 70, 200), { wash: '#8C9AAA', washOp: 200, ink: null });
      inkLine([[x + 150, 120], [x + 150, 450]], .8, INK, 'inkfine', 0);
    }
    paint(rectPts(-200, 30, 3400, 34), { wash: TK.steel, ink: INK, sw: 1 });
    for (const bxx of [1000, 2250]) {
      inkLine([[bxx - 300, 64], [bxx - 300, 470]], 1, INK, 'inkfine', 0); inkLine([[bxx + 300, 64], [bxx + 300, 470]], 1, INK, 'inkfine', 0);
      paint(rectPts(bxx - 340, 460, 680, 90, 1), { wash: TK.ember, fill: TK.emberDk, fillOp: 60, tex: .5, ink: INK, sw: 1 });
      ru('ЗАМЕНА ПРОГРАММИСТОВ:', bxx, 490, 34, TK.cream, { ink: false });
      ru('ВОТ-ВОТ', bxx, 528, 34, TK.yellow, { ink: false });
    }
    paint(rectPts(-200, 800, 3400, 500), { wash: '#A8A094', fill: '#857D70', fillOp: 70, tex: .5, ink: INK, sw: 1 });
    // five desks
    for (let i = 0; i < 6; i++) {
      const dx = 380 + i * 460, landT = HB(DESK0 + i), landed = t >= landT, age = t - landT;
      const seen = landed && age > .15;
      // programmer (typing on the half-beat, glances at the sticky, then back to work)
      const typ = Math.abs(Math.sin(hb * Math.PI + i));
      clawd(dx + 70, 800, 22, { flip: true,
        aL: .3 + typ * .5, aR: .3 + (1 - typ) * .5, eyes: seen && age < .5 ? 'look' : 'narrow', lookY: -1, lookX: .3,
        mouth: seen && age < .5 ? 'flat' : 'smile', hat: i === 2 ? 'hard' : undefined, seed: i, noShadow: true,
        emote: seen && age < .6 && i % 2 ? 'sweat' : undefined, emoteK: seg(age, .15, .3), col: i % 3 === 1 ? '#C9825E' : PAL.clay
      });
      // monitor on the desk
      paint(rrPts(dx - 230, 590, 220, 150, 10, 1), { wash: '#26232B', ink: INK, sw: 1 });
      paint(rectPts(dx - 218, 602, 196, 122), { wash: '#12161D', ink: null });
      for (let k = 0; k < 5; k++) paint(rectPts(dx - 204 + (k % 2) * 20, 614 + k * 22, 60 + hash(i * 5 + k + Math.floor(hb)) * 90, 10), { wash: [TK.led, '#8EC3E6', TK.yellow][k % 3], washOp: 200, ink: null });
      paint(rectPts(dx - 130, 740, 22, 42), { wash: '#26232B', ink: INK, sw: .7 });
      // desk
      paint(rectPts(dx - 250, 780, 470, 36), { wash: '#C9A06A', fill: '#9C7048', fillOp: 80, tex: .5, ink: INK, sw: 1 });
      paint(rectPts(dx - 210, 816, 30, 170), { wash: '#6E4A2E', ink: INK, sw: .7 });
      paint(rectPts(dx + 160, 816, 30, 170), { wash: '#6E4A2E', ink: INK, sw: .7 });
      paint(rrPts(dx + 150, 736, 44, 46, 8), { wash: '#F4EDDD', ink: INK, sw: .7 });                         // mug
      for (let k = 0; k < 2; k++) inkLine([[dx + 164 + k * 14, 728], [dx + 158 + k * 14 + Math.sin(t * 5 + k) * 6, 700], [dx + 168 + k * 14, 676]], 1, '#FFFFFF', 'inkfine', .6);
      // sticky note: arrives in the robot's claw from above, slaps onto the monitor
      const drop = seg(t, landT - .22, landT), px = dx - 120 + (hash(i) - .5) * 30, py = lerp(-120, 640, easeIn(drop)), rot = (hash(i + 7) - .5) * .3;
      if (drop > 0) {
        const s = landed ? 1 + .25 * Math.exp(-age * 18) : 1;
        push(); translate(px, py); rotate(rot); scale(s);
        paint(rectPts(-78, -48, 156, 96), { wash: '#FFE36A', fill: '#F2C94C', fillOp: 70, tex: .5, ink: INK, sw: .8 });
        pop();
        ru('ВОТ-ВОТ', px, py, 30 * s, TK.ember, { rot, ink: false });
        // the ceiling robot's claw, only on its way down and just after the slap
        if (!landed || age < .12) {
          inkLine([[px, 64], [px, py - 60]], 5, TK.steel, 'ink', 0);
          paint(rrPts(px - 36, 50, 72, 30, 8), { wash: TK.orange, ink: INK, sw: .8 });
          for (const e of [-1, 1]) inkLine([[px + e * 10, py - 60], [px + e * 40, py - 50], [px + e * 30, py - 38]], 3, TK.steel, 'ink', .3);
        }
        if (landed) sfx('ШЛЁП', px + 90, py - 70, 34, TK.orangeDk, age, { life: .35, rot: .15, font: ruFont(34) });
      }
    }
    camEnd();
  }

  // ======================================================================================================
  // 5) 134.4 «А мне от неё нужно только одно»: Clawd hugs a board-game box, warm lamp, hearts on the beat
  // ======================================================================================================
  function palace(x, y, s) {                                  // a tiny blue-white-gold palace with a gold dome
    paint(rectPts(x - 150 * s, y - 60 * s, 300 * s, 60 * s), { wash: '#7FB2E0', ink: INK, sw: .6 });
    for (let i = 0; i < 9; i++) paint(rectPts(x - 140 * s + i * 32 * s, y - 50 * s, 12 * s, 36 * s), { wash: '#FBF6EA', ink: null });
    paint(rectPts(x - 150 * s, y - 64 * s, 300 * s, 8 * s), { wash: TK.gold, ink: null });
    paint(rectPts(x - 36 * s, y - 100 * s, 72 * s, 40 * s), { wash: '#7FB2E0', ink: INK, sw: .5 });
    paint(ellPts(x, y - 104 * s, 30 * s, 30 * s, 14).slice(7, 22).concat([[x + 30 * s, y - 100 * s], [x - 30 * s, y - 100 * s]]), { wash: TK.gold, ink: INK, sw: .5 });
    inkLine([[x, y - 134 * s], [x, y - 158 * s]], 1.2, TK.goldDk, 'inkfine', 0);
  }
  function toyEngine(x, y, s, t, col = '#C8323A') {          // side view, (x, y) = front bottom, facing right
    const P = (a, b) => [x + a * s, y + b * s];
    for (const wx of [-150, -95, -40]) { paint(ellPts(...P(wx, -18), 18 * s, 18 * s, 12), { wash: TK.yellow, ink: INK, sw: .6 }); paint(ellPts(...P(wx, -18), 6 * s, 6 * s, 8), { wash: TK.soot, ink: null }); }
    paint(rrPts(...P(-190, -140), 70 * s, 110 * s, 8 * s), { wash: col, ink: INK, sw: .8 });
    paint(rrPts(...P(-200, -150), 90 * s, 18 * s, 6 * s), { wash: '#2E6B4A', ink: INK, sw: .7 });
    paint(rrPts(...P(-120, -95), 110 * s, 64 * s, 30 * s), { wash: col, ink: INK, sw: .8 });
    paint(rectPts(...P(-60, -145), 24 * s, 52 * s), { wash: TK.soot, ink: INK, sw: .6 });
    paint([P(0, -30), P(22, -12), P(0, -12)], { wash: TK.gold, ink: INK, sw: .5 });
  }
  function gameBox(x, y, w, h, t, rot = 0) {
    push(); translate(x, y); rotate(rot); translate(-x, -y);
    paint(rrPts(x - w / 2 + 10, y - h / 2 + 12, w, h, 12), { fill: INK, fillOp: 80, bleed: .2, ink: null });
    paint(rrPts(x - w / 2, y - h / 2, w, h, 12, 1), { wash: '#F2E4C4', ink: INK, sw: 1.3 });
    // lid art: sky, hills, palace, a toy train, rails
    const ix = x - w / 2 + 18, iy = y - h / 2 + 18, iw = w - 36, ih = h - 36;
    paint(rectPts(ix, iy, iw, ih * .6), { wash: '#F6C08A', fill: '#EE9A7A', fillOp: 70, tex: .4, ink: null });
    paint(ellPts(ix + iw * .75, iy + ih * .35, 40, 40, 16), { wash: '#FFE8A8', ink: null });
    paint([[ix, iy + ih * .55], [ix + iw * .3, iy + ih * .45], [ix + iw * .6, iy + ih * .52], [ix + iw, iy + ih * .42], [ix + iw, iy + ih], [ix, iy + ih]], { wash: '#6FA05A', fill: '#3F7040', fillOp: 70, tex: .5, ink: null, curv: .4 });
    palace(ix + iw * .7, iy + ih * .56, .55);
    for (let i = 0; i < 5; i++) paint([[ix + 20 + i * 28, iy + ih * .62], [ix + 34 + i * 28, iy + ih * .38], [ix + 48 + i * 28, iy + ih * .62]], { wash: '#2E5A3A', ink: null });
    inkLine([[ix, iy + ih * .88], [ix + iw, iy + ih * .82]], 2, '#6E4A2E', 'ink', 0);
    toyEngine(ix + iw * .56, iy + ih * .86, .9, t);
    for (let c = 0; c < 2; c++) paint(rrPts(ix + iw * .56 - 300 - c * 110, iy + ih * .86 - 70, 96, 56, 8), { wash: [TK.blue, TK.yellow][c], ink: INK, sw: .7 });
    // title banner
    paint([[x - w * .46, iy + 8], [x + w * .46, iy + 8], [x + w * .42, iy + 96], [x - w * .42, iy + 96]], { wash: TK.ember, fill: TK.emberDk, fillOp: 60, tex: .5, ink: INK, sw: .9 });
    ru('ЦАРСКОЕ СЕЛО', x, iy + 54, 52, '#FFF5E2', { ink: true });
    ru('настольная игра · паровозики', x, iy + 118, 26, '#3A2A50', { ink: false });
    paint(rrPts(x - w / 2, y - h / 2, w, h, 12), { ink: INK, sw: 1.3 });
    pop();
  }
  const claySpot = (x, y, r) => paint(rrPts(x - r, y - r * .8, r * 2, r * 1.6, r * .6), { wash: PAL.clay, fill: PAL.clayDk, fillOp: 60, ink: INK, sw: .9 });
  function hug(t, lt) {
    const hb = hbOf(t), sway = Math.sin(t * 2.4) * .04;
    full('#F4C99A', { fill: '#E8A878', fillOp: 70, tex: .5 });
    camBegin(960, 540 - lt * 10, 1.02 + lt * .05);
    for (let i = 0; i < 40; i++) paint(starPts(60 + (i % 10) * 200 + (Math.floor(i / 10) % 2) * 100, 80 + Math.floor(i / 10) * 180, 12, .4), { wash: '#F9DCB8', ink: null });   // wallpaper
    // window: evening, a single star
    paint(rectPts(1340, 120, 420, 440), { wash: '#6E6AA8', fill: '#E89A8A', fillOp: 90, tex: .5, ink: INK, sw: 1.3 });
    paint(ellPts(1450, 220, 6, 6, 8), { wash: '#FFF5E2', ink: null });
    inkLine([[1550, 120], [1550, 560]], 3, '#8A5A36', 'ink', 0); inkLine([[1340, 340], [1760, 340]], 3, '#8A5A36', 'ink', 0);
    paint(rectPts(1320, 100, 460, 480), { ink: '#8A5A36', sw: 3 });
    // lamp glow
    glow(420, 300, 520, TK.yellowLt, 90);
    paint([[330, 180], [510, 180], [560, 300], [280, 300]], { wash: '#F2E4C4', fill: TK.yellow, fillOp: 60, ink: INK, sw: 1 });
    inkLine([[420, 300], [420, 860]], 5, '#6E4A2E', 'ink', 0);
    paint(rectPts(-200, 860, W + 400, 400), { wash: '#B5835A', fill: '#8A5A36', fillOp: 80, tex: .5, ink: INK, sw: 1 });
    paint(ellPts(960, 930, 620, 70, 26), { wash: '#C8323A', fill: '#8A1418', fillOp: 60, tex: .6, ink: INK, sw: .8 });   // rug
    // Clawd, eyes shut in bliss, rocking; the box in front; clay hands wrap its sides
    const cx = 960, cy = 890, u = 60;
    clawd(cx, cy, u, { eyes: 'happy', mouth: 'cat', blush: true, rot: sway, aL: -.7, aR: -.7, noShadow: false });
    const bw = 500, bh = 320, bx = cx + Math.sin(t * 2.4) * 10, by = cy - 1.1 * u;
    gameBox(bx, by, bw, bh, t, sway * 1.2);
    claySpot(bx - bw / 2 + 6, by - 40, 38); claySpot(bx + bw / 2 - 6, by - 20, 38);
    // hearts pop on every beat
    for (let k = 0; k < 6; k++) {
      const n = Math.floor(hb) - k, age = t - HB(n); if (age < 0 || age > 1.6 || n % 2) continue;
      const f = age / 1.6, hx = cx + (hash(n) - .5) * 700, hy = cy - 7 * u - f * 360;
      paint(heartPts(hx, hy, 42 * (1 - f * .4) * backOut(age * 4)), { wash: '#E2476E', washOp: 255 * (1 - f), fill: PAL.rose, fillOp: 80, ink: f < .7 ? INK : null, sw: .6 });
    }
    camEnd();
  }

  // ======================================================================================================
  // 6) 136.8 «Игру Ticket to Ride про царское село»: the painted route map fills in, half-beat by half-beat
  // ======================================================================================================
  const CITY = { spb: [300, 190, 'ПЕТЕРБУРГ'], ts: [420, 330, 'ЦАРСКОЕ СЕЛО'], tver: [700, 420, 'ТВЕРЬ'], msk: [900, 640, 'МОСКВА'],
                 vlad: [1180, 560, 'ВЛАДИМИР'], nn: [1400, 470, 'Н. НОВГОРОД'], kzn: [1680, 380, 'КАЗАНЬ'], yar: [1080, 300, 'ЯРОСЛАВЛЬ'] };
  // [from, to, colour, bend, hb when filled (null = stays empty)]
  const ROUTES = [['ts', 'tver', '#D8262A', .12, 453], ['tver', 'msk', '#D8262A', -.1, 454], ['msk', 'vlad', '#2E5BFF', .1, 455], ['vlad', 'nn', '#2E5BFF', -.12, 456],
                  ['nn', 'kzn', '#F2B632', .14, 457], ['spb', 'ts', '#2FBF71', 0, 452], ['tver', 'yar', null, .1, null], ['yar', 'nn', null, -.1, null], ['spb', 'yar', null, -.15, null], ['yar', 'kzn', null, -.08, null]];
  function routeSlots(a, b, bend) {
    const [x0, y0] = CITY[a], [x1, y1] = CITY[b], d = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round((d - 90) / 74));
    const mx = (x0 + x1) / 2 - (y1 - y0) * bend, my = (y0 + y1) / 2 + (x1 - x0) * bend, out = [];
    for (let i = 0; i < n; i++) {
      const f = (i + .5) / n * .8 + .1, q = (s => [(1 - s) * (1 - s) * x0 + 2 * (1 - s) * s * mx + s * s * x1, (1 - s) * (1 - s) * y0 + 2 * (1 - s) * s * my + s * s * y1]);
      const [px, py] = q(f), [qx, qy] = q(f + .01); out.push([px, py, Math.atan2(qy - py, qx - px)]);
    }
    return out;
  }
  function boardMap(t, o = {}) {
    const all = o.all;
    paint(rectPts(-40, -30, W + 80, H + 60, 2), { wash: '#6E4A2E', ink: INK, sw: 1.5 });
    paint(rectPts(0, 0, W, H), { wash: '#DCE6B8', fill: '#B8CC8A', fillOp: 90, bleed: .15, tex: .6, border: .5, ink: INK, sw: 1 });
    // the Volga, lakes, forests
    paint([[-20, 760], [300, 720], [700, 820], [1000, 700], [1300, 620], [1560, 520], [1760, 470], [1960, 520], [1960, 560], [1760, 510], [1560, 570], [1300, 670], [1000, 750], [700, 870], [300, 770], [-20, 810]], { wash: '#8EC3E6', fill: '#5E9CC8', fillOp: 70, tex: .5, ink: '#3E6E96', sw: .7, curv: .5 });
    paint(ellPts(560, 140, 120, 60, 18, 6), { wash: '#8EC3E6', ink: '#3E6E96', sw: .6 });
    for (let i = 0; i < 46; i++) {
      const fx = hash(i * 3.3) * W, fy = 120 + hash(i * 7.1) * 860, near = Object.values(CITY).some(([cx, cy]) => Math.hypot(cx - fx, cy - fy) < 120);
      if (near) continue;
      for (let k = 0; k < 3; k++) paint([[fx + k * 22 - 14, fy + 20], [fx + k * 22, fy - 18 - hash(i + k) * 10], [fx + k * 22 + 14, fy + 20]], { wash: k % 2 ? '#3F7040' : '#2E5A3A', ink: null });
    }
    // compass rose, card fan
    paint(starPts(1780, 880, 70, .3, 4), { wash: '#F2E4C4', ink: INK, sw: .7 });
    if (!all) ru('С', 1780, 790, 30, INK, { ink: false });
    // route slots, then pieces
    for (const [a, b, col, bend, fillHb] of ROUTES) {
      const sl = routeSlots(a, b, bend), filled = col && (all || (fillHb != null && t >= HB(fillHb)));
      sl.forEach(([px, py, ang], i) => {
        const age = filled ? (all ? 9 : t - HB(fillHb) - i * .03) : -1;
        push(); translate(px, py); rotate(ang);
        paint(rrPts(-30, -13, 60, 26, 6), { wash: col ? mixCol(col, '#F2E4C4', .75) : '#E9E0C8', ink: '#6A6070', sw: .6 });
        pop();
        if (age < 0) return;
        const dropK = easeOut(clamp(age / .16)), lift = (1 - dropK) * 90, sc = 1 + (1 - dropK) * .5;
        paint(ellPts(px + 6, py + 8, 32, 14, 12, 0, ang), { fill: INK, fillOp: 60 * dropK, bleed: .2, ink: null });
        push(); translate(px, py - lift); rotate(ang); scale(sc);
        paint(rrPts(-27, -11, 54, 22, 7), { wash: col, fill: mixCol(col, TK.soot, .4), fillOp: 60, tex: .4, ink: INK, sw: .7 });
        paint(rectPts(-18, -7, 12, 7), { wash: '#FFFFFF', washOp: 160, ink: null });
        pop();
      });
    }
    // cities
    for (const [key, [cx, cy, name]] of Object.entries(CITY)) {
      const big = key === 'ts' || key === 'msk' || key === 'kzn', r = big ? 30 : 20;
      const hot = key === 'kzn' && t >= HB(458) && !all, pk = hot ? pulse2(t, 5) : 0;
      if (hot) glow(cx, cy, 90 + pk * 30, TK.yellow, 110);
      paint(ellPts(cx, cy, r * (1 + pk * .2), r * (1 + pk * .2), 16), { wash: big ? TK.ember : '#F2E4C4', fill: big ? TK.emberDk : '#C9B790', fillOp: 60, ink: INK, sw: 1 });
      paint(ellPts(cx, cy, r * .4, r * .4, 10), { wash: big ? TK.yellow : TK.ember, ink: null });
      if (key === 'ts') palace(cx - 10, cy - 36, .42);
      const ls = big ? 40 : 28;
      if (!all) ru(name, cx, cy + (key === 'spb' || key === 'yar' || key === 'kzn' ? -r - 30 : r + 30), ls, big ? '#3A2A50' : '#5A5060', { stroke: '#F2E4C4', ink: false });
    }
  }
  function map(t, lt) {
    const k = ease(seg(t, 136.8, 139.2));
    full('#5A3A26');
    camBegin(lerp(700, 1200, k), lerp(430, 470, k), lerp(1.35, 1.08, k), lerp(-.05, .02, k));
    boardMap(t);
    const age = t - HB(458);
    if (age > 0) stamp('КАЗАНЬ!', 1560, 230, 76, t, HB(458), { col: TK.ember, rot: -.1 });
    camEnd();
  }

  // ======================================================================================================
  // 7) 139.2 «Сто тысяч GPU, весь мировой прогресс»: pull back, the board sits in front of an endless data center
  // ======================================================================================================
  function hall(t, lt) {
    const k = ease(seg(t, 139.2, 140.6)), heat = lerp(.35, 1, seg(t, 139.4, 141.2)), fireK = seg(t, 140.3, 141.3);
    const pk = pulse2(t, 6), [sx, sy] = shakeXY(t, 5 * pk * fireK);
    camBegin(960 + sx, lerp(820, 560, k) + sy, lerp(1.9, 1, k));
    dataCenter(t, { heat, fire: fireK, vp: [960, 380], n: 9, seed: 6 });
    // cables sweep down from the ceiling trays into the board edges; light pulses run along them
    const tbY = 760, Pp = (X, Y, Z) => [960 + X * 900 / Z, 380 + Y * 900 / Z], ccol = [TK.blue, TK.ember, TK.green, TK.yellow, TK.orange, TK.led];
    const cables = [];
    [[-1, 2.2], [-1, 3.6], [-1, 6], [1, 2.2], [1, 3.6], [1, 6]].forEach(([sd, z], i) => {
      const a = Pp(sd * 1.15, -.9, z), e = [960 + sd * (160 + i % 3 * 120), tbY + 10], m1 = [lerp(a[0], e[0], .3), a[1] + (e[1] - a[1]) * .75 + 60], m2 = [lerp(a[0], e[0], .75), e[1] + 40];
      cables.push([a, m1, m2, e]);
    });
    cables.forEach((c, i) => {
      inkLine(c, 10, TK.soot, 'ink', .6); inkLine(c, 5, ccol[i], 'ink', .6);
      for (let q = 0; q < 3; q++) {
        const f = frac(t * 1.4 + q / 3 + i * .17) * 3, j = Math.min(2, Math.floor(f)), s = f - j;
        glow(lerp(c[j][0], c[j + 1][0], s), lerp(c[j][1], c[j + 1][1], s), 16, TK.yellowLt, 200);
      }
    });
    // table + the board (tilted: flattened), lit orange from behind
    paint([[180, tbY - 40], [W - 180, tbY - 40], [W + 200, H + 60], [-200, H + 60]], { wash: '#6E4A2E', fill: '#3A2418', fillOp: 90, tex: .6, ink: INK, sw: 1.2 });
    push(); translate(960, tbY + 90); scale(.62, .26); translate(-960, -540); boardMap(t, { all: true }); pop();
    glow(960, tbY + 60, 600, TK.orange, 60 * heat);
    camEnd();
    // the GPU counter rolls up, top centre
    const v = 100000 * easeOut(seg(t, 139.3, 140.4));
    counter(880, 110, 86, v, { col: TK.yellow, suffix: 'GPU' });
    if (t >= 140.4) stamp('ВЕСЬ МИРОВОЙ ПРОГРЕСС', 960, 240, 54, t, 140.4, { col: TK.yellowLt, rot: -.05, border: true });
  }

  // ======================================================================================================
  // 8) 141.6 «Чтоб паровозик до Казани ехал через лес»: the payoff. Sunset pine forest, the toy train,
  //    smoke on every half-beat, cables trailing back to the data center burning on the horizon.
  // ======================================================================================================
  const GR = lt => lt < 3.4 ? 300 * lt : 1020 + 160 * easeOut((lt - 3.4) / .75);   // ground scroll, the train brakes at «КАЗАНЬ»
  const TRX = lt => 560 + 55 * Math.min(lt, 3.6);                                     // engine front, screen x
  const RAIL = 812;
  function treeline(off, base, hMin, hMax, spacing, seed, col, o = {}) {
    const i0 = Math.floor((off - 300) / spacing), i1 = Math.ceil((off + W + 300) / spacing), pts = [[-300, base + 600]];
    for (let i = i0; i <= i1; i++) {
      if (o.skip && hash(i * 1.9 + seed) < o.skip) { const x = i * spacing - off; pts.push([x, base + 10], [x + spacing, base + 10]); continue; }
      const x = i * spacing - off + (hash(i * 7.3 + seed) - .5) * spacing * .5, h = lerp(hMin, hMax, hash(i * 3.1 + seed)), w = h * .42;
      pts.push([x - w * .5, base], [x - w * .42, base - h * .22], [x - w * .2, base - h * .24], [x - w * .34, base - h * .48], [x - w * .12, base - h * .5],
               [x - w * .22, base - h * .72], [x - w * .05, base - h * .72], [x, base - h], [x + w * .05, base - h * .72], [x + w * .22, base - h * .72],
               [x + w * .12, base - h * .5], [x + w * .34, base - h * .48], [x + w * .2, base - h * .24], [x + w * .42, base - h * .22], [x + w * .5, base]);
    }
    pts.push([W + 300, base + 600]);
    paint(pts, { wash: col, fill: o.fill || col, fillOp: o.fillOp ?? 0, bleed: .06, tex: .5, border: .5, ink: o.ink || null, sw: o.sw || .6 });
  }
  function pine(x, base, h, col, dk, lit) {                  // a single near pine, three painted tiers, sun-rim on the right
    paint(rectPts(x - h * .025, base - h * .2, h * .05, h * .22), { wash: '#4A3024', ink: INK, sw: .6 });
    for (let k = 0; k < 4; k++) {
      const ty = base - h * (.16 + k * .2), tw = h * (.3 - k * .06), top = ty - h * .34;
      paint([[x - tw, ty], [x - tw * .5, ty - h * .06], [x, top], [x + tw * .5, ty - h * .06], [x + tw, ty], [x, ty - h * .04]], { wash: col, fill: dk, fillOp: 90, bleed: .05, tex: .6, border: .5, ink: INK, sw: .7, curv: .15 });
      if (lit) inkLine([[x + 4, top + 8], [x + tw * .55, ty - h * .07], [x + tw * .95, ty - 2]], 1.6, lit, 'inkfine', .4);
    }
  }
  function kazan(x, y, s, col) {                               // distant skyline: kremlin wall, tiered tower, domed mosque with minarets
    const pts = [[x - 320 * s, y], [x - 320 * s, y - 40 * s], [x - 220 * s, y - 40 * s], [x - 220 * s, y - 70 * s], [x - 200 * s, y - 70 * s],
      [x - 200 * s, y - 120 * s], [x - 188 * s, y - 120 * s], [x - 188 * s, y - 160 * s], [x - 178 * s, y - 160 * s], [x - 178 * s, y - 190 * s], [x - 172 * s, y - 230 * s],
      [x - 166 * s, y - 190 * s], [x - 166 * s, y - 160 * s], [x - 156 * s, y - 160 * s], [x - 156 * s, y - 120 * s], [x - 144 * s, y - 120 * s], [x - 144 * s, y - 70 * s],
      [x - 124 * s, y - 70 * s], [x - 124 * s, y - 40 * s], [x - 70 * s, y - 40 * s], [x - 70 * s, y - 190 * s], [x - 64 * s, y - 240 * s], [x - 58 * s, y - 190 * s], [x - 58 * s, y - 80 * s],
      [x - 40 * s, y - 80 * s], [x - 40 * s, y - 110 * s], [x - 30 * s, y - 140 * s], [x, y - 160 * s], [x + 30 * s, y - 140 * s], [x + 40 * s, y - 110 * s], [x + 40 * s, y - 80 * s],
      [x + 58 * s, y - 80 * s], [x + 58 * s, y - 190 * s], [x + 64 * s, y - 240 * s], [x + 70 * s, y - 190 * s], [x + 70 * s, y - 40 * s], [x + 320 * s, y - 40 * s], [x + 320 * s, y]];
    paint(pts, { wash: col, fill: mixCol(col, '#FFE3A0', .4), fillOp: 60, tex: .4, ink: null });
    inkLine([[x - 30 * s, y - 140 * s], [x, y - 160 * s], [x + 30 * s, y - 140 * s]], 1.2, '#FFE3A0', 'inkfine', .5);
  }
  function trainCar(x, y, col, t, g, o = {}) {              // (x, y) = front bottom of the car
    const w = 170;
    for (const wx of [-w + 34, -34]) {
      paint(ellPts(x + wx, y - 14, 16, 16, 12), { wash: '#F2E4C4', ink: INK, sw: .7 });
      const a = -g / 16; inkLine([[x + wx - Math.cos(a) * 12, y - 14 - Math.sin(a) * 12], [x + wx + Math.cos(a) * 12, y - 14 + Math.sin(a) * 12]], 1, '#8A5A36', 'inkfine', 0);
    }
    paint(rrPts(x - w + 6, y - 104, w - 12, 76, 12, 1), { wash: col, fill: mixCol(col, TK.soot, .35), fillOp: 70, tex: .5, border: .5, ink: INK, sw: 1 });
    paint(rrPts(x - w - 2, y - 116, w + 4, 18, 8), { wash: mixCol(col, TK.soot, .45), ink: INK, sw: .8 });
    for (let k = 0; k < 3; k++) {
      paint(rrPts(x - w + 24 + k * 44, y - 90, 32, 30, 6), { wash: '#FFE8A8', ink: INK, sw: .5 });
      glow(x - w + 40 + k * 44, y - 75, 26, TK.yellowLt, 60);
    }
    paint(rectPts(x - w + 6, y - 50, w - 12, 8), { wash: TK.gold, ink: null });                        // sunset rim on the side
    inkLine([[x - w + 2, y - 36], [x - w - 22, y - 36]], 3, INK, 'ink', 0);                            // coupler
    if (o.tail) return [x - w - 22, y - 36];
  }
  function locomotive(x, y, t, g, sq) {                     // (x, y) = front bottom, facing right; returns chimney top
    push(); translate(x, y); scale(1 + sq * .6, 1 - sq); translate(-x, -y);
    const red = '#C8323A', redDk = '#7E1C24';
    // cowcatcher, buffer beam
    paint([[x - 20, y - 46], [x + 26, y - 6], [x - 20, y - 6]], { wash: TK.yellow, fill: TK.goldDk, fillOp: 60, ink: INK, sw: .8 });
    paint(rectPts(x - 26, y - 56, 16, 20), { wash: TK.soot, ink: INK, sw: .6 });
    // cab
    paint(rrPts(x - 290, y - 176, 108, 150, 8, 1), { wash: red, fill: redDk, fillOp: 60, tex: .5, ink: INK, sw: 1 });
    paint(rrPts(x - 300, y - 192, 128, 24, 8), { wash: '#2E6B4A', fill: '#1E4A34', fillOp: 60, ink: INK, sw: .9 });
    paint(rrPts(x - 268, y - 156, 66, 56, 8), { wash: '#FFE8A8', ink: INK, sw: .7 });
    // the driver: a tiny Clawd in the cab window, waving at the end
    const wave = seg(t, 145.35, 145.6);
    clawd(x - 236, y - 98, 6.4, { eyes: t > 145.4 ? 'happy' : 'normal', mouth: 'smile', noShadow: true, noLegs: true, aL: .2, aR: .2 + wave * 1.6 + (wave > .99 ? Math.sin(t * 16) * .3 : 0) });
    paint(rectPts(x - 272, y - 100, 74, 60), { wash: red, fill: redDk, fillOp: 60, tex: .5, ink: INK, sw: .8 });
    // boiler
    paint(rrPts(x - 186, y - 132, 168, 88, 40, 1), { wash: red, fill: redDk, fillOp: 70, tex: .5, border: .5, ink: INK, sw: 1.1 });
    paint(rrPts(x - 186, y - 132, 168, 20, 10), { wash: '#FF8A6A', washOp: 150, ink: null });                    // sun rim along the top
    for (const bx of [-150, -100, -52]) paint(rectPts(x + bx, y - 132, 8, 88), { wash: TK.gold, ink: null });
    paint(ellPts(x - 18, y - 88, 18, 44, 16), { wash: '#2A2330', ink: INK, sw: .8 });                               // smokebox front
    // dome + chimney
    paint(ellPts(x - 134, y - 138, 22, 18, 14), { wash: TK.gold, fill: TK.goldDk, fillOp: 60, ink: INK, sw: .8 });
    paint([[x - 76, y - 128], [x - 60, y - 128], [x - 52, y - 196], [x - 84, y - 196]], { wash: TK.soot, fill: '#3A3336', fillOp: 60, ink: INK, sw: .9 });
    paint(rrPts(x - 92, y - 212, 48, 18, 6), { wash: TK.gold, ink: INK, sw: .8 });
    // headlamp: warm glow + beam down the track
    glow(x - 12, y - 128, 60, TK.yellowLt, 140);
    paint([[x - 6, y - 134], [x + 420, y - 180], [x + 420, y - 30], [x - 6, y - 122]], { wash: '#FFF1C0', washOp: 26, ink: null });
    paint(ellPts(x - 12, y - 128, 14, 14, 12), { wash: '#FFF5E2', ink: INK, sw: .7 });
    // wheels + coupling rod
    const rot = -g / 26;
    for (const wx of [-240, -150, -76]) {
      const r = wx === -240 ? 30 : 34;
      paint(ellPts(x + wx, y - r, r, r, 18), { wash: TK.yellow, fill: TK.goldDk, fillOp: 50, ink: INK, sw: 1 });
      for (let s = 0; s < 3; s++) { const a = rot + s * Math.PI / 3; inkLine([[x + wx - Math.cos(a) * r * .8, y - r - Math.sin(a) * r * .8], [x + wx + Math.cos(a) * r * .8, y - r + Math.sin(a) * r * .8]], 1.2, '#8A5A36', 'inkfine', 0); }
      paint(ellPts(x + wx, y - r, 8, 8, 8), { wash: red, ink: INK, sw: .5 });
    }
    const rx = Math.cos(rot) * 16, ry = Math.sin(rot) * 16;
    inkLine([[x - 150 + rx, y - 34 + ry], [x - 76 + rx, y - 34 + ry]], 2.2, TK.steelLt, 'ink', 0);
    pop();
    return [x - 68, y - 212];
  }
  function train(t, lt) {
    const g = GR(lt), hbf = hbOf(t), sq = .05 * pulse2(t, 7) * (lt < 3.8 ? 1 : 0);
    // --- sky: violet → rose → peach → gold, the low sun over Kazan
    const pushK = ease(seg(t, 141.6, 146.3)), fx0 = TRX(lt);
    const FC = [lerp(880, 940, pushK), lerp(560, 575, pushK), lerp(1.16, 1.24, pushK)], NC = [lerp(880, fx0 - 40, pushK), lerp(560, 640, pushK), lerp(1.16, 1.5, pushK)];
    camBegin(...FC);                                                         // far camera: sky + horizon barely move
    bands(-80, 700, ['#3E3A78', '#7A5C9E', '#D9839A', '#F6B88A', '#FFE0A0'], 14);
    const sunX = 1380, sunY = 400;
    for (const [r, op] of [[760, 45], [560, 55], [380, 80], [220, 120]]) glow(sunX, sunY, r, '#FFE2A0', op);
    for (let i = 0; i < 7; i++) {                                                                         // god rays fanning down over the forest
      const a = 1.75 + i * .22 + Math.sin(t * .4 + i) * .02, w = .05 + hash(i) * .04;
      paint([[sunX, sunY], [sunX + Math.cos(a - w) * 1400, sunY + Math.sin(a - w) * 1400], [sunX + Math.cos(a + w) * 1400, sunY + Math.sin(a + w) * 1400]], { wash: '#FFF1C0', washOp: 34, ink: null });
    }
    paint(ellPts(sunX, sunY, 80, 80, 26), { wash: '#FFF8E4', fill: '#FFE0A0', fillOp: 90, bleed: .1, ink: null });
    for (let i = 0; i < 6; i++) {                                                                         // long lit clouds
      const cx = ((i * 420 - g * .04 + hash(i) * 200) % 2400 + 2400) % 2400 - 300, cy = 140 + i * 58 + hash(i + 3) * 40, w = 260 + hash(i + 5) * 260;
      paint(ellPts(cx, cy, w, 22 + hash(i + 7) * 14, 20, 3), { wash: i < 3 ? '#9A74A8' : '#E48C9A', fill: '#FFD3A0', fillOp: 70, bleed: .2, tex: .5, ink: null });
      paint(ellPts(cx + 20, cy + 10, w * .8, 8, 16), { wash: '#FFD8A0', washOp: 180, ink: null });
    }
    // --- the data center on the far left horizon: burning racks, a smoke column leaning over the sky
    const dcx = 300, dcy = 610;
    push(); translate(dcx, dcy); scale(.72); translate(-dcx, -dcy);
    glow(dcx, dcy - 40, 560, TK.orange, 100); glow(dcx, dcy - 20, 280, TK.ember, 120);
    smoke(dcx - 20, dcy - 150, t, { n: 9, h: 560, r: 80, per: 3.2, col: '#4A3A40', seed: 3 });
    for (const [tx, th] of [[dcx - 150, 150], [dcx + 150, 130]]) {                                          // cooling towers, steaming
      paint([[tx - 50, dcy], [tx - 34, dcy - th * .6], [tx - 40, dcy - th], [tx + 40, dcy - th], [tx + 34, dcy - th * .6], [tx + 50, dcy]], { wash: '#5A4048', fill: TK.emberDk, fillOp: 60, tex: .4, ink: '#1A1718', sw: .5, curv: .4 });
      puff(tx, dcy - th - 30 - frac(t * .5) * 40, 44 + frac(t * .5) * 20, '#E8C8C0', 120);
    }
    paint(rectPts(dcx - 110, dcy - 110, 220, 110), { wash: '#3A2A30', fill: TK.emberDk, fillOp: 80, tex: .5, ink: '#1A1718', sw: .6 });
    for (let r = 0; r < 4; r++) for (let k = 0; k < 10; k++) paint(rectPts(dcx - 96 + k * 20, dcy - 96 + r * 24, 10, 8), { wash: hash(r * 10 + k + Math.floor(t * 6)) > .35 ? TK.yellow : TK.ember, ink: null });
    fire(dcx, dcy - 106, 230, 120, t, { k: .9 + .2 * pulse2(t, 4), seed: 17 });
    pop();
    // --- far layers: hills, Kazan skyline, hazy treelines, mist
    paint([[-100, 640], [300, 600], [700, 625], [1100, 590], [1500, 610], [1900, 585], [2100, 620], [2100, 800], [-100, 800]], { wash: '#A68AB6', fill: '#C79AB0', fillOp: 60, tex: .4, ink: null, curv: .5 });
    kazan(1540, 604, .8, '#8E7BAE');
    treeline(g * .12, 648, 50, 95, 46, 1, '#8A7FAE');
    camEnd(); camBegin(...NC);                                               // near camera pushes in on the train
    const far2near = ([x, y]) => [NC[0] + (x - FC[0]) * FC[2] / NC[2], NC[1] + (y - FC[1]) * FC[2] / NC[2]];
    const dcN = far2near([dcx + 14, dcy - 8]);
    paint(rectPts(-100, 628, W + 200, 40), { wash: '#F8D2B0', washOp: 90, ink: null });
    treeline(g * .25, 690, 80, 150, 58, 2, '#65719E', { fill: '#4E5A88', fillOp: 40 });
    paint(rectPts(-100, 672, W + 200, 36), { wash: '#F4C4A8', washOp: 80, ink: null });
    treeline(g * .45, 745, 130, 230, 74, 3, '#3F5E72', { fill: '#2E4658', fillOp: 70 });
    // --- the cables: from the last car, along the embankment, back to the burning horizon
    const fx = TRX(lt), carCols = [TK.blue, '#F2B632', '#2FBF71'];
    const tail = [fx - 300 - 3 * 190 - 22, RAIL - 36];
    const cab = [[TK.blue, 0], [TK.ember, 16], [TK.led, -16]];
    for (const [c, d] of cab) {
      const pts = [tail, [tail[0] - 140, RAIL + 12 + d], [lerp(tail[0], dcN[0], .5), lerp(RAIL, dcN[1], .4) + d], [dcN[0] + 20, dcN[1] + 20 + d * .4], dcN];
      inkLine(pts, 6, TK.soot, 'ink', .7); inkLine(pts, 3, c, 'ink', .7);
    }
    for (let q = 0; q < 4; q++) {                                                                          // energy blips run to the train
      const f = frac(t * .9 + q / 4), bx = lerp(dcN[0], tail[0], f), by = lerp(dcN[1], RAIL - 30, f * f);
      glow(bx, by, 16, TK.yellowLt, 190);
    }
    // --- near treeline behind the track, gappy so the sunset shows through
    treeline(g * .7, RAIL + 4, 220, 380, 150, 4, '#28504A', { fill: '#1A3A36', fillOp: 90, skip: .45, ink: '#1A2A28' });
    // «КАЗАНЬ» station sign, standing behind the track
    const sgx = 2110 - g, sgy = RAIL - 6;
    if (sgx > -300 && sgx < W + 300) {
      for (const px of [-110, 110]) paint(rectPts(sgx + px - 7, sgy - 230, 14, 230), { wash: '#6E4A2E', ink: INK, sw: .8 });
      const lit = seg(t, 145.35, 145.6), sk = 1 + .06 * lit * pulse2(t, 5);
      if (lit > 0) glow(sgx, sgy - 250, 260, TK.yellowLt, 110 * lit);
      push(); translate(sgx, sgy - 250); scale(sk); translate(-sgx, -(sgy - 250));
      paint(rrPts(sgx - 170, sgy - 300, 340, 100, 10, 1), { wash: '#FBF6EA', fill: '#E3D8C0', fillOp: 60, tex: .4, ink: '#2E4A7A', sw: 2 });
      pop();
      ru('КАЗАНЬ', sgx, sgy - 250, 64 * sk, '#2E4A7A', { ink: false });
    }
    // --- the track: a wooden toy track on a grassy embankment
    bands(RAIL + 20, H + 120, ['#6A8A40', '#3F6A34', '#243E24'], 6);
    for (let i = 0; i < 60; i++) {                                                                          // wildflowers on the embankment
      const x = ((hash(i * 2.3) * 2600 - g * 1.05) % 2600 + 2600) % 2600 - 300, y = RAIL + 50 + hash(i * 4.1) * 220, r = 5 + hash(i) * 5;
      inkLine([[x, y], [x + 2, y + 16]], .6, '#2E4A28', 'inkfine', 0);
      paint(ellPts(x, y, r, r, 8), { wash: ['#FFF5E2', '#FFD84A', '#F4A6C0', '#C9B2F0'][i % 4], ink: null });
    }
    paint(rectPts(-100, RAIL - 4, W + 200, 30), { wash: '#D9B07A', fill: '#A8743E', fillOp: 70, tex: .5, ink: INK, sw: .9 });
    for (const gy of [RAIL + 4, RAIL + 16]) inkLine([[-100, gy], [W + 100, gy]], 1.4, '#8A5A36', 'inkfine', 0);
    for (let i = Math.floor((g - 100) / 240); i < Math.ceil((g + W + 100) / 240); i++) {
      const jx = i * 240 - g; inkLine([[jx, RAIL - 4], [jx, RAIL + 26]], 1, '#6E4A2E', 'inkfine', 0);
    }
    paint(rectPts(-100, RAIL + 26, W + 200, 12), { wash: '#E8A868', washOp: 110, ink: null });            // warm light on the embankment edge
    // --- the train
    const chim = locomotive(fx, RAIL, t, g, sq);
    let cx = fx - 300;
    for (let c = 0; c < 3; c++) { trainCar(cx, RAIL, carCols[c], t, g); cx -= 190; }
    // --- smoke: one puff per half-beat from the chimney, drifting back and lit pink by the sun
    const hb = Math.floor(hbf);
    for (let k = 9; k >= 0; k--) {
      const n = hb - k, te = HB(n), age = t - te; if (age < 0 || te < 141.55) continue;
      const lte = te - 141.6, ex = TRX(Math.max(0, lte)) - 68, a = age;
      const drift = (lt < 3.4 ? 300 : 120) * a * .75;
      const px = ex - drift - a * 40, py = RAIL - 212 - 40 * a - 120 * Math.sqrt(a), r = 30 + 80 * Math.sqrt(a), op = 250 * Math.exp(-a * .8);
      if (op < 8) continue;
      puff(px, py, r * backOut(clamp(a * 6)), '#FFF3E6', op, '#F2A0A8');
    }
    if (t >= 145.4) {
      const a = t - 145.4;                                                                                   // arrival: a big whistle puff and a "ТУ-ТУ!"
      puff(chim[0], chim[1] - 60 - a * 80, 60 + a * 120, '#FFF8EE', 230 * Math.exp(-a * 1.5), '#FFD3A0');
      sfx('ТУ-ТУ!', chim[0] + 60, chim[1] - 180, 70, '#FFF5E2', a, { life: .9, rot: -.1, font: ruFont(70), stroke: '#C8323A' });
    }
    // --- fireflies / embers drifting in the warm air
    for (let i = 0; i < 26; i++) {
      const x = ((hash(i) * 2400 - g * (.6 + hash(i + 2) * .6)) % 2200 + 2200) % 2200 - 140, y = 520 + hash(i + 5) * 380 + Math.sin(t * 1.3 + i) * 20;
      const b = .5 + .5 * Math.sin(t * 3 + i * 1.7) * (i % 3 ? 1 : pulse2(t, 3));
      glow(x, y, 9 + b * 8, TK.yellowLt, 120 * b); paint(ellPts(x, y, 3, 3, 6), { wash: '#FFF5D8', ink: null });
    }
    // --- foreground: big pines slide past at the frame edges, grass tufts along the bottom
    for (let i = Math.floor((g * 1.4 - 400) / 1100); i < Math.ceil((g * 1.4 + W + 400) / 1100); i++) {
      if (hash(i + 40) < .3) continue;
      const x = i * 1100 - g * 1.4 + hash(i + 41) * 300; if (x < 1450) continue;                  // keep the train clear: only frame the right edge
      pine(x, H + 60, 700 + hash(i + 42) * 200, '#1E3A30', '#10261E', '#E8A868');
    }
    for (let i = 0; i < 40; i++) {
      const x = ((i * 70 - g * 1.2) % 2800 + 2800) % 2800 - 200, y = 1000 + hash(i) * 70;
      paint([[x - 30, y + 60], [x - 8, y - 40 - hash(i + 1) * 40], [x + 4, y + 10], [x + 20, y - 30], [x + 34, y + 60]], { wash: '#1E3A28', ink: null, curv: .3 });
    }
    camEnd();
  }

  chapter('verse3', 124.7, 146.3, [
    [124.7, spring], [127.0, loading], [129.95, arm], [132.2, desks], [134.4, hug], [136.8, map], [139.2, hall], [141.6, train]
  ]);
})();
