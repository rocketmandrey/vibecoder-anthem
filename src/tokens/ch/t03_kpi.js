// t03_kpi.js: «Жги токены» chapter 3, verse 2 (58.8–80.35). Open-plan office, deadpan corporate satire.
// 58.8 whiteboard «НОВЫЙ KPI» → leaderboard «СКОЛЬКО ТЫ СПАЛИЛ ЗА НЕДЕЛЮ» (the champion's bar breaks out of the board)
// 64.0 Clawd's 12-token stub under a magnifier, «ПЛОХО ПОМОГ» stamp → 66.3 AGENT #7 on a pedestal, token halo, the
// office kneels «НАШ НОВЫЙ БОГ» → 69.0 org chart 1 → 1 → 100 agents → 71.9 the report thuds down, dust, cobweb,
// «ПРОЧТЕНИЙ: 0» → 76.3 counter to 40 000 000, money burns in a bin, an agent shrugs «НУ И ПУСКАЙ» and bins the report.
(() => {
  const B = n => OFF + n * BEAT;
  const INK = PAL.ink, MARK_BLUE = '#2445B8', MARK_RED = '#C4262B', MARK_BLK = '#2B2B33';
  const AG = { col: '#6F8BE0', dk: '#3D55A8', lt: '#B5C6F0' };

  // ---------- office set ----------
  function t03_window(x, y, w, h, t, dark) {
    paint(rectPts(x, y, w, h), { wash: '#231C22', fill: TK.emberDk, fillOp: 90, bleed: .2, tex: .5, ink: null });
    glowAt(x + w * .5, y + h * .75, w * .55, TK.orange, 110);
    // the data center across the street: racks with glowing vents and fire on the roof
    const gy = y + h * .92;
    for (let i = 0; i < 5; i++) {
      const bx = x + 20 + i * (w - 40) / 5, bh = h * (.28 + hash(i + 3) * .2), bw = (w - 40) / 5 - 10;
      paint(rectPts(bx, gy - bh, bw, bh), { wash: TK.soot, ink: null });
      for (let r = 0; r < 4; r++) paint(rectPts(bx + 8, gy - bh + 12 + r * bh * .22, bw - 16, 5), { wash: hash(i * 7 + r + Math.floor(t * 5)) > .3 ? TK.orange : TK.orangeDk, ink: null });
    }
    if (!dark) {
      fire(x + w * .35, gy - h * .36, w * .3, h * .3, t, { k: .8, seed: 31, n: 4, glow: false });
      fire(x + w * .78, gy - h * .44, w * .22, h * .24, t, { k: .7, seed: 17, n: 3, glow: false });
    }
    paint(rectPts(x, gy, w, h - (gy - y)), { wash: '#15101A', ink: null });
    // frame + mullions
    paint(rectPts(x, y, w, h), { ink: '#F2EEE6', sw: 2.4 });
    inkLine([[x + w / 2, y], [x + w / 2, y + h]], 6, '#F2EEE6', 'ink', 0);
    inkLine([[x, y + h * .45], [x + w, y + h * .45]], 5, '#F2EEE6', 'ink', 0);
    paint(rectPts(x - 12, y + h, w + 24, 18), { wash: '#F2EEE6', ink: INK, sw: .8 });
  }
  function t03_poster(x, y) {
    paint(rectPts(x, y, 200, 270), { wash: TK.cream, fill: '#E9DCC4', fillOp: 70, tex: .5, ink: INK, sw: 1 });
    paint(rectPts(x + 12, y + 12, 176, 130), { wash: TK.soot, ink: null });
    fire(x + 100, y + 138, 110, 110, T, { k: .8, seed: 4, n: 3, glow: false });
    token(x + 100, y + 96, 28, { burn: .3 });
    letter('СЖЁГ —', x + 100, y + 170, 30, TK.ember, { font: ruFont(30), ink: false });
    letter('ЗНАЧИТ', x + 100, y + 205, 30, TK.soot, { font: ruFont(30), ink: false });
    letter('ПОМОГ', x + 100, y + 240, 30, TK.soot, { font: ruFont(30), ink: false });
  }
  function t03_office(t, o = {}) {
    paint(rectPts(-500, -400, W + 1000, 1150), { wash: '#E4DACB', fill: '#C9BCA6', fillOp: 70, bleed: .15, tex: .6, border: .3, ink: null });
    for (let i = 0; i < 5; i++) {                                                  // fluorescent tubes
      const x = -120 + i * 520;
      glowAt(x + 150, 70, 150, '#FFF6D0', 45);
      paint(rrPts(x, 14, 300, 26, 10), { wash: '#FFFBEA', ink: INK, sw: .6 });
    }
    t03_window(30, 120, 440, 470, t, o.dark > .5);
    t03_poster(1690, 170);
    paint(rectPts(-500, 738, W + 1000, 800), { wash: '#8F8A86', fill: '#6F6A68', fillOp: 70, tex: .6, ink: null });
    for (let i = -8; i <= 8; i++) inkLine([[960 + i * 130, 742], [960 + i * 330, 1500]], .5, '#77716D', 'inkfine', 0);
    paint(rectPts(-500, 726, W + 1000, 16), { wash: '#6A6360', ink: INK, sw: .6 });
    if (o.dark) paint(rectPts(-500, -400, W + 1000, 2000), { wash: TK.soot, washOp: 255 * o.dark, ink: null });
  }

  // ---------- characters ----------
  const t03_tie = (u, sw) => {
    paint([[-1.7 * u, -3.9 * u], [1.7 * u, -3.9 * u], [1.1 * u, -2.05 * u], [-1.1 * u, -2.05 * u]], { wash: '#FBF8F2', ink: INK, sw: sw * .5 });
    paint([[-1.7 * u, -3.9 * u], [0, -3.2 * u], [-.9 * u, -3.1 * u]], { wash: '#FFFFFF', ink: INK, sw: sw * .4 });
    paint([[1.7 * u, -3.9 * u], [0, -3.2 * u], [.9 * u, -3.1 * u]], { wash: '#FFFFFF', ink: INK, sw: sw * .4 });
    paint([[-.4 * u, -3.25 * u], [.4 * u, -3.25 * u], [.55 * u, -2.3 * u], [0, -2.0 * u], [-.55 * u, -2.3 * u]], { wash: TK.blue, ink: INK, sw: sw * .5 });
    for (const ex of [-3, 2]) paint(rrPts((ex - .45) * u, -7.2 * u, 1.9 * u, 2.3 * u, .4 * u), { ink: INK, sw: sw * .9 });
    inkLine([[-1.55 * u, -6.2 * u], [1.55 * u, -6.2 * u]], sw * .8, INK, 'ink', 0);
  };
  // arm-space stick along +x, len px (hook for the pointing arm)
  const t03_stick = len => (u, sw) => {
    inkLine([[-.2 * u, 0], [len, 0]], sw * 1.4, '#6B4A2A', 'ink', 0);
    paint(ellPts(len, 0, 4, 4, 8), { wash: TK.ember, ink: null });
  };
  // manager at (x, y) pointing a stick at world point (tx, ty); the arm pivot is the right shoulder
  function t03_manager(x, y, u, tx, ty, o = {}) {
    const sx = x + 4.9 * u, sy = y - 4.5 * u, a = Math.atan2(sy - ty, tx - sx), len = Math.hypot(tx - sx, ty - sy) - 2.2 * u;
    clawd(x, y, u, { eyes: 'narrow', mouth: 'flat', aL: -.1, ...o, aR: a, armR: t03_stick(len), draw: t03_tie });
  }
  const t03_palm = (u, sw) => { paint(ellPts(.2 * u, 0, .8 * u, .7 * u, 10), { wash: PAL.clay, ink: INK, sw: sw * .5 }); for (const d of [-.45, 0, .45]) inkLine([[.8 * u, d * u], [1.4 * u, d * 1.5 * u]], sw * .6, INK, 'inkfine', 0); };
  // the cheap mini agent for the hundred
  function t03_mini(x, y, s, sq = 0) {
    const h = 6 * s * (1 - sq);
    paint(rectPts(x - 3.6 * s, y - 2.2 * s, 1.6 * s, 2.2 * s), { wash: AG.dk, ink: null });
    paint(rectPts(x + 2 * s, y - 2.2 * s, 1.6 * s, 2.2 * s), { wash: AG.dk, ink: null });
    paint(rectPts(x - 5 * s, y - 2 * s - h, 10 * s, h), { wash: AG.col, ink: INK, sw: .45 });
    paint(rectPts(x - 3 * s, y - 2 * s - h * .82, s, h * .3), { wash: INK, ink: null });
    paint(rectPts(x + 2 * s, y - 2 * s - h * .82, s, h * .3), { wash: INK, ink: null });
    paint(rectPts(x - 1.3 * s, y - 3.6 * s, 2.6 * s, 1.4 * s), { wash: TK.cream, ink: null });
  }

  // ---------- the whiteboard ----------
  const BX = 560, BY = 110, BW = 1080, BH = 600, ROW0 = BY + 245, ROWH = 72, BAR0 = BX + 300, BARW = 690;
  const ROWS = [['АГЕНТ #7', 1, '9,1 МЛРД'], ['ГЕНА', .7, '6,4 МЛРД'], ['ОЛЯ', .49, '4,5 МЛРД'], ['ИГОРЬ', .26, '2,4 МЛРД'], ['CLAWD', .004, '12 ТОКЕНОВ']];
  const write = (txt, k) => txt.slice(0, Math.round(clamp(k) * txt.length));
  function t03_board(t, o = {}) {
    paint(rectPts(BX - 18, BY - 18, BW + 36, BH + 36), { wash: '#AEB4BB', fill: TK.steelLt, fillOp: 80, tex: .5, ink: INK, sw: 1.2 });
    paint(rectPts(BX, BY, BW, BH), { wash: '#F8F7F2', fill: '#DCDDE0', fillOp: 45, bleed: .2, tex: .5, border: .6, ink: INK, sw: .6 });
    paint(rectPts(BX + 80, BY + BH + 18, 360, 16), { wash: '#AEB4BB', ink: INK, sw: .6 });           // marker tray
    for (const [i, c] of [[0, MARK_BLUE], [1, MARK_RED], [2, MARK_BLK]]) paint(rrPts(BX + 110 + i * 70, BY + BH + 6, 54, 14, 6), { wash: c, ink: INK, sw: .4 });
    const ti = write('НОВЫЙ KPI', o.title ?? 1);
    if (ti) letter(ti, BX + 60, BY + 78, 78, MARK_BLUE, { font: ruFont(78), align: 'left', ink: false, rot: -.02 });
    if ((o.under ?? 1) > .02) inkLine([[BX + 60, BY + 128], [BX + 60 + 440 * clamp(o.under ?? 1), BY + 124 + 6 * Math.sin((o.under ?? 1) * 3)]], 3.2, MARK_BLUE, 'marker', .4);
    const su = write('СКОЛЬКО ТЫ СПАЛИЛ ЗА НЕДЕЛЮ', o.sub ?? 1);
    if (su) letter(su, BX + 60, BY + 175, 44, MARK_RED, { font: ruFont(44), align: 'left', ink: false, rot: -.01 });
    const grow = o.grow || [1, 1, 1, 1, 1];
    ROWS.forEach(([name, v, val], i) => {
      const y = ROW0 + i * ROWH, g = clamp(grow[i]);
      letter((i + 1) + '. ' + name, BX + 40, y, 32, MARK_BLK, { font: ruFont(32), align: 'left', ink: false });
      if (g < .01) return;
      let len = Math.max(6, v * BARW * g);
      if (i === 0) len += (o.over || 0) * 200;                                    // the champion's bar breaks out of the board
      paint(rectPts(BAR0, y - 22, len, 44, 1.5), { wash: i === 4 ? '#E9A06B' : TK.orange, washOp: 230, fill: TK.orangeDk, fillOp: 70, tex: .6, border: .5, ink: INK, sw: .6 });
      if (i === 0) {
        const fk = o.fire || 0;
        if (fk > .02) fire(BAR0 + len, y + 22, 90, 170 * fk, t, { k: fk, seed: 7, n: 4 });
        token(BAR0 + len + (fk > .02 ? 70 : 34), y, 22 * g, { burn: .3 * fk, glow: fk * .6 });
      }
      if (g > .8 && i > 0) letter(val, BAR0 + len + (i === 4 ? 90 : 18), y + 2, 28, MARK_BLK, { font: ruFont(28), align: 'left', ink: false, alpha: seg(g, .8, 1) });
      else if (g > .8) letter(val, BAR0 + 30, y + 2, 28, TK.cream, { font: ruFont(28), align: 'left', ink: false });
    });
  }

  // ---------- 58.8 «Новый KPI у нас в отделе: сколько ты спалил за неделю» ----------
  function kpi(t, lt) {
    const pk = pulse(t, 6);
    const z = kf(t, [[58.8, 1.0], [61.5, 1.04], [62.6, 1.2]], ease), cx = kf(t, [[58.8, 960], [61.5, 950], [62.6, 1040]]), cy = kf(t, [[58.8, 540], [61.5, 520], [62.6, 450]]);
    camBegin(cx + Math.sin(t * .7) * 6, cy, z);
    t03_office(t);
    const over = seg(t, 63.1, 63.5);
    t03_board(t, {
      title: seg(t, 59.0, 59.75), under: seg(t, 59.7, 60.0), sub: seg(t, 61.72, 63.2),
      grow: [0, 1, 2, 3, 4].map(i => easeOut(seg(t, B(102) + (4 - i) * .18, B(102) + (4 - i) * .18 + .5)) * (i === 0 ? .85 : 1) + (i === 0 ? .15 * seg(t, 62.9, 63.2) : 0)),
      over: backOut(over), fire: seg(t, 63.2, 63.6)
    });
    // stamp-underline hit on «KPI»
    if (t > 59.6) sfx('!', BX + 520, BY + 60, 90, MARK_RED, t - 59.6, { life: 1.4, rot: .15 });
    // the manager taps the board on the beat
    const tapRow = t < 61.6 ? -1 : Math.min(4, Math.floor(seg(t, 61.9, 63.4) * 5));
    const [tx, ty] = tapRow < 0 ? [BX + 520, BY + 100 + pk * 12] : [BAR0 - 20, ROW0 + tapRow * ROWH + pk * 10];
    t03_manager(300, 900, 20, tx, ty, { dy: -pk * .4 });
    // colleagues watching, coffee in hand
    clawd(1470, 900, 18, { eyes: 'look', lookX: -1, lookY: -1, mouth: t > 63.3 ? 'O' : 'flat', aL: .5, aR: .1, sq: pk * .04, seed: 2,
      armL: (u, sw) => paint(rrPts(-.2 * u, -1.2 * u, 1.3 * u, 1.6 * u, .2 * u), { wash: TK.cream, ink: INK, sw: sw * .5 }) });
    clawd(1730, 905, 19, { eyes: 'look', lookX: -1, lookY: -.8, mouth: t > 63.3 ? 'O' : 'flat', aL: .2, aR: .2, seed: 5, emote: t > 63.3 ? '!' : null, emoteK: seg(t, 63.3, 63.6) });
    camEnd();
  }

  // ---------- 64.0 «Мало потратил — значит, плохо помог» ----------
  function lowSpender(t, lt) {
    const tS = 65.28, age = t - tS, pk = pulse(t, 6), hit = age > 0 ? Math.exp(-age * 7) : 0;
    const [sx, sy] = shakeXY(t, 14 * hit);
    const z = kf(t, [[64.0, 1.45], [65.2, 1.55], [66.3, 1.62]]);
    camBegin(840 + sx, 690 + sy, z);
    t03_office(t);
    t03_board(t, { over: 1, fire: 1 });
    const hy = ROW0 + 4 * ROWH;
    // manager inspects the stub with a magnifier on a stick
    const lx = BAR0 + 3, ly = hy + kf(t, [[64.0, -40], [64.44, 0]], backOut);
    t03_manager(300, 900, 20, lx - 60, ly + 40, { eyes: t > tS ? 'angry' : 'narrow', mouth: t > tS ? 'wobble' : 'flat' });
    const lk = backOut(seg(t, 64.1, 64.4));
    if (lk > .02) {
      paint(ellPts(lx + 6, ly, 62 * lk, 62 * lk, 26), { wash: '#DDF1FA', washOp: 120, fill: '#9FD3F5', fillOp: 50, ink: null });
      paint(rectPts(lx - 30 * lk, ly - 22 * lk, 36 * lk, 44 * lk), { wash: '#E9A06B', ink: INK, sw: .8 });
      paint(ellPts(lx + 6, ly, 62 * lk, 62 * lk, 26), { ink: '#4A4A55', sw: 2.4 });
      inkLine([[lx - 38, ly + 44], [lx - 60, ly + 40]], 3, '#4A4A55', 'ink', 0);
    }
    // Clawd, the user, under his own tiny bar
    const moodK = t > tS ? { eyes: 'scared', mouth: 'wobble', emote: 'sweat', emoteK: seg(age, .1, .3) } : { eyes: 'look', lookX: -1, lookY: -.3, mouth: 'flat' };
    clawd(1030, 900, 20, { ...moodK, sq: -hit * .25 + (t > tS ? .06 : 0), dy: -pk * .3, aL: t > tS ? .9 + hit : .15, aR: t > tS ? .9 + hit : .15, seed: 1 });
    stamp('ПЛОХО ПОМОГ', 1040, 845, 64, t, tS, { rot: -.14, col: TK.ember, punch: .04 });
    if (t > 64.44 && t < tS) sfx('12?!', 640, 690, 54, MARK_RED, t - 64.44, { life: .8, font: ruFont(54) });
    camEnd();
  }

  // ---------- 66.3 «Чемпион по токенам — наш новый бог!» ----------
  function champion(t, lt) {
    const pk = pulse(t, 5);
    const z = kf(t, [[66.3, 1.35], [67.6, 1.0]], ease), cy = kf(t, [[66.3, 760], [67.6, 520]], ease);
    camBegin(960, cy + pk * 4, z + pk * .012);
    t03_office(t, { dark: .55 });
    // god rays
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * TAU + t * .15, b = a + TAU / 32;
      paint([[960, 330], [960 + Math.cos(a) * 2400, 330 + Math.sin(a) * 2400], [960 + Math.cos(b) * 2400, 330 + Math.sin(b) * 2400]], { wash: i % 2 ? TK.yellow : TK.orange, washOp: 90 + 40 * pk, ink: null });
    }
    glowAt(960, 330, 420, TK.yellowLt, 120);
    paint([[905, -300], [1015, -300], [1190, 560], [730, 560]], { wash: '#FFF3C0', washOp: 90, ink: null });
    // pedestal
    paint(rectPts(740, 700, 440, 220, 1), { wash: '#EDE6DA', fill: '#C9BFB0', fillOp: 80, tex: .6, ink: INK, sw: 1.2 });
    paint(rectPts(800, 600, 320, 100, 1), { wash: '#F3EDE3', fill: '#C9BFB0', fillOp: 70, tex: .6, ink: INK, sw: 1.1 });
    paint(rectPts(840, 546, 240, 54, 1), { wash: '#F3EDE3', fill: TK.gold, fillOp: 60, tex: .5, ink: INK, sw: 1 });
    for (const y of [700, 600, 546]) inkLine([[y === 700 ? 740 : y === 600 ? 800 : 840, y + 6], [y === 700 ? 1180 : y === 600 ? 1120 : 1080, y + 6]], 3, TK.gold, 'ink', 0);
    letter('№1', 960, 652, 64, TK.gold, { font: ruFont(64) });
    letter('ТОКЕНОВ ЗА НЕДЕЛЮ', 960, 738, 24, TK.soot, { font: ruFont(24), ink: false });
    counter(960, 800, 40, 9.1e9 + Math.max(0, t - 66.3) * 3.7e7, { col: TK.yellow });
    // the champion: AGENT #7 with a burning-token torch and a halo of tokens
    const hx = 960, hy = 318, orbit = i => { const a = t * 1.6 + i / 10 * TAU; return [hx + Math.cos(a) * 175, hy + Math.sin(a) * 40, Math.sin(a)]; };
    const halo = front => { for (let i = 0; i < 10; i++) { const [x, y, s] = orbit(i); if ((s > 0) === front) token(x, y, 23 + s * 6, { spin: t * .8 + i * .3, burn: i % 3 === 0 ? .5 : 0, glow: .4 }); } };
    halo(false);
    const flex = Math.sin(bpOf(t) * Math.PI);
    agentBot(960, 546, 21, t, {
      n: 7, eyes: 'shades', mouth: 'grin', aL: 1.2 + .2 * flex, aR: 1.5, dy: -pk * .3, noShadow: true,
      armR: (u, sw) => { fire(.6 * u, -.7 * u, 3 * u, 5.5 * u * (1 + pk * .3), t, { seed: 3, n: 3, glow: false }); token(.6 * u, 0, u * .9, { burn: .4 }); }
    });
    halo(true);
    // the office kneels and worships on the beat
    [[170, .9], [420, .7], [650, .5], [1270, -.5], [1500, -.7], [1750, -.9]].forEach(([x, side], i) => {
      const bow = Math.abs(Math.sin((bpOf(t) + i * .08) * Math.PI));
      clawd(x, 900, 19, {
        noLegs: true, rot: side * (.04 + .1 * bow), sq: .06 + .16 * bow, dy: .4 * bow, eyes: 'closed', mouth: 'o', seed: i,
        aL: 1.5 - 1.1 * bow, aR: 1.5 - 1.1 * bow, ...(i === 2 ? AG : {}), armL: t03_palm, armR: t03_palm
      });
    });
    camEnd();
    if (t < 66.55) flash(1 - seg(t, 66.3, 66.55), TK.yellowLt);
    punkText('НАШ НОВЫЙ БОГ', 960, 108, 84, t, 67.78, { seed: 3 });
  }

  // ---------- 69.0 «Агент нанял агента, тот нанял ещё сто» ----------
  const N0 = [960, 300], N1 = [960, 540], BUS = 600, COLS = 20;
  const SLOTS = []; for (let r = 0; r < 5; r++) for (let c = 0; c < COLS; c++) SLOTS.push([130 + c * (1660 / (COLS - 1)), 680 + r * 62]);
  const ORDER = SLOTS.map((p, i) => [Math.hypot(p[0] - N1[0], (p[1] - N1[1]) * 2), i]).sort((a, b) => a[0] - b[0]).map(p => p[1]);
  const RANK = []; ORDER.forEach((i, k) => RANK[i] = k);
  function orgChart(t, lt) {
    const tBurst = 70.46, pull = easeOut(seg(t, 70.35, 71.05)), bang = t > 71.0 ? Math.exp(-(t - 71.0) * 6) : 0, [sx, sy] = shakeXY(t, 12 * bang);
    camBegin(960 + sx, lerp(390, 560, pull) + sy, lerp(1.5, 1.0, pull));
    paint(rectPts(-500, -400, W + 1000, 1900), { wash: '#EFE7D8', fill: '#D9CDB8', fillOp: 60, tex: .6, border: .3, ink: null });
    for (let i = -6; i < 30; i++) inkLine([[-500, i * 60], [W + 500, i * 60]], .35, '#B7C9E0', 'inkfine', 0);
    letter('ОРГСТРУКТУРА', 960, 70, 50, MARK_BLUE, { font: ruFont(50), ink: false, rot: -.02 });
    letter('отдел AI-трансформации', 960, 122, 28, MARK_BLK, { font: ruFont(28), ink: false, rot: -.02 });
    const card = ([x, y], k, lab) => {
      if (k < .02) return;
      paint(rrPts(x - 150 * k, y - 125 * k, 300 * k, 170 * k, 14), { wash: '#FBF8F2', ink: INK, sw: 1.2 });
      if (lab) letter(lab, x, y + 26 * k, 20 * k, '#6A6A75', { font: ruFont(20 * k), ink: false });
    };
    const k0 = backOut(seg(t, 69.0, 69.25)), k1 = backOut(seg(t, 69.85, 70.1));
    card(N0, k0, 'нанят: пн 09:00'); card(N1, k1, 'нанят: пн 09:01');
    const l1 = seg(t, 69.6, 69.9);
    if (l1 > 0) inkLine([[N0[0], N0[1] + 45], [N0[0], lerp(N0[1] + 45, N1[1] - 125, l1)]], 3, INK, 'ink', 0);
    if (k0 > .3) agentBot(N0[0], N0[1] - 5, 10 * Math.min(1, k0), t, { n: 1, dance: 'idle', eyes: 'happy', mouth: 'smile', hire: t > 69.46 && t < 69.9, aR: 1.1 });
    if (k1 > .3) agentBot(N1[0], N1[1] - 5, 10 * Math.min(1, k1), t, { n: 2, dance: 'idle', eyes: t > tBurst ? 'happy' : 'normal', mouth: 'smile', seed: 2, aR: t > 70.2 && t < tBurst ? 1.8 : .3, aL: t > 70.2 && t < tBurst ? 1.8 : .3 });
    // the bus and the hundred
    const bk = seg(t, tBurst, tBurst + .25);
    if (bk > 0) {
      inkLine([[N1[0], N1[1] + 45], [N1[0], BUS]], 3, INK, 'ink', 0);
      inkLine([[N1[0] - 830 * bk, BUS], [N1[0] + 830 * bk, BUS]], 3, INK, 'ink', 0);
      for (let c = 0; c < COLS; c++) { const x = SLOTS[c][0]; if (Math.abs(x - 960) < 830 * bk) inkLine([[x, BUS], [x, BUS + 26]], 1.6, INK, 'ink', 0); }
    }
    let hired = 0;
    SLOTS.forEach(([x, y], i) => {
      const t0 = tBurst + .05 + RANK[i] * .005, p = seg(t, t0, t0 + .25);
      if (p <= 0) return;
      hired++;
      const e = easeOut(p), mx = lerp(N1[0], x, e), my = lerp(N1[1], y, e) - Math.sin(p * Math.PI) * 120;
      const hop = p >= 1 ? Math.abs(Math.sin((bpOf(t) * 2 + hash(i)) * Math.PI)) : 0;
      t03_mini(mx, my - hop * 10, 5.4, p < 1 ? 0 : hop * .1);
    });
    camEnd();
    // headcount
    const hc = (t >= 69.05 ? 1 : 0) + (t >= 69.85 ? 1 : 0) + hired;
    letter('ШТАТ:', 1540, 90, 40, MARK_BLK, { font: ruFont(40), ink: false });
    counter(1730, 90, 56, hc, { col: TK.yellow });
    if (t > 71.0) sfx('+100', 1720, 180, 70, TK.ember, t - 71.0, { life: .8, font: ruFont(70) });
  }

  // ---------- 71.9 «Они сделали доклад — не прочитал никто: “Как сократить расходы на AI”» ----------
  // binder (top-left of the cover at x, y), cover 800 x 330 in slight perspective, 90 px of pages below
  function t03_binder(x, y, s, o = {}) {
    const w = 800 * s, h = 330 * s, d = 90 * s, sk = 40 * s, sw = clamp(s * 1.3, .4, 1.4);
    const cov = [[x + sk, y], [x + w - sk, y], [x + w, y + h], [x, y + h]];
    paint([[x, y + h], [x + w, y + h], [x + w, y + h + d], [x, y + h + d]], { wash: '#F4EFE4', fill: '#D6CDBC', fillOp: 70, tex: .5, ink: INK, sw });
    if (s > .4) for (let i = 1; i < 9; i++) inkLine([[x + 8 * s, y + h + i * d / 9], [x + w - 8 * s, y + h + i * d / 9]], .4, '#B8AE9C', 'inkfine', 0);
    paint(cov, { wash: '#27408F', fill: TK.blueDk, fillOp: 80, tex: .6, border: .5, ink: INK, sw: sw * 1.2 });
    paint(rectPts(x + w * .16, y + h * .12, w * .68, h * .72), { wash: TK.cream, ink: INK, sw: sw * .6 });
    if (s > .4) {
      const f = z => ruFont(z * s);
      letter('КАК СОКРАТИТЬ', x + w / 2, y + h * .27, 50 * s, TK.soot, { font: f(50), ink: false });
      letter('РАСХОДЫ НА AI', x + w / 2, y + h * .47, 50 * s, TK.ember, { font: f(50), ink: false });
      letter('доклад · 100 агентов · 3 400 стр.', x + w / 2, y + h * .7, 20 * s, '#55555F', { font: f(20), ink: false });
    }
    if (o.dust > .01) {
      paint(cov, { wash: '#8C857C', washOp: 150 * o.dust, fill: '#77706A', fillOp: 150 * o.dust, bleed: .1, tex: .9, border: .9, ink: null });
      for (let i = 0; i < 40 * o.dust; i++) paint(ellPts(lerp(x + sk, x + w - sk, hash(i * 3.3)), lerp(y + 6, y + h - 6, hash(i * 7.1)), 3, 2, 6), { wash: '#B5ADA1', ink: null });
    }
  }
  function t03_cobweb(cx, cy, k, t) {
    if (k < .02) return;
    const R = 260 * k, angs = [Math.PI * .5, Math.PI * .62, Math.PI * .75, Math.PI * .88, Math.PI];
    for (const a of angs) inkLine([[cx, cy], [cx + Math.cos(a) * R, cy + Math.sin(a) * R]], .6, '#F4F2EE', 'ink', 0);
    for (let r = 1; r <= 5; r++) {
      const rr = R * r / 5.4, pts = angs.map((a, j) => [cx + Math.cos(a) * rr * (1 + .06 * Math.sin(j * 2 + r)), cy + Math.sin(a) * rr]);
      if (rr > 10) inkLine(pts, .9, '#F4F2EE', 'ink', .3);
    }
  }
  function report(t, lt) {
    const tL = 72.02, land = t >= tL, age = t - tL, hit = land ? Math.exp(-age * 7) : 0, [sx, sy] = shakeXY(t, 18 * hit);
    const z = kf(t, [[72.4, 1.1], [76.3, 1.34]], ease), cyy = kf(t, [[72.4, 560], [76.3, 560]], ease);
    camBegin(960 + sx, cyy + sy, z);
    t03_office(t);
    // wall clock racing: time passes, nobody reads it
    const tl = Math.max(0, t - 72.3);
    paint(ellPts(1500, 250, 70, 70, 24), { wash: '#FBF8F2', ink: INK, sw: 1.4 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; inkLine([[1500 + Math.cos(a) * 56, 250 + Math.sin(a) * 56], [1500 + Math.cos(a) * 64, 250 + Math.sin(a) * 64]], .8, INK, 'inkfine', 0); }
    const ma = -Math.PI / 2 + tl * 14, ha = -Math.PI / 2 + tl * 14 / 12;
    inkLine([[1500, 250], [1500 + Math.cos(ha) * 36, 250 + Math.sin(ha) * 36]], 2.6, INK, 'ink', 0);
    inkLine([[1500, 250], [1500 + Math.cos(ma) * 56, 250 + Math.sin(ma) * 56]], 1.6, INK, 'ink', 0);
    // colleagues stroll past without a glance
    for (let k = 0; k < 3; k++) {
      const p = (t - 72.2 - k * 1.3) / 3.4;
      if (p < 0 || p > 1) continue;
      const dir = k % 2 ? -1 : 1, x = dir > 0 ? lerp(-150, 2070, p) : lerp(2070, -150, p);
      clawd(x, 690, 17, { ...move('walk', t, k), eyes: 'look', lookX: dir, mouth: 'flat', seed: k, flip: dir < 0, ...(k === 1 ? AG : {}),
        armR: (u, sw) => paint(rrPts(-.2 * u, -1.2 * u, 1.3 * u, 1.6 * u, .2 * u), { wash: k === 1 ? TK.orange : TK.cream, ink: INK, sw: sw * .5 }) });
    }
    // desk
    paint([[-200, 690], [W + 200, 690], [W + 400, 1300], [-400, 1300]], { wash: '#8A6446', fill: '#5E4230', fillOp: 80, tex: .6, border: .4, ink: INK, sw: 1.2 });
    for (let i = 0; i < 6; i++) inkLine([[-200, 740 + i * 60 + i * i * 6], [W + 200, 735 + i * 62 + i * i * 6]], .6, '#6E4E36', 'inkfine', .5);
    paint(rectPts(-200, 680, W + 400, 16), { wash: '#A07654', ink: INK, sw: .8 });
    if (!land) { const k = seg(t, 71.88, tL); paint(ellPts(960, 890, 420 * (.4 + .6 * k), 30 * (.4 + .6 * k), 20), { fill: INK, fillOp: 120 * k, bleed: .2, ink: null }); }
    // the report drops like a brick
    const fall = land ? 0 : -950 * (1 - easeIn(seg(t, 71.88, tL))), bounce = land ? -Math.abs(Math.sin(age * 16)) * 26 * Math.exp(-age * 9) : 0;
    const dust = seg(t, 72.9, 76.1);
    t03_binder(560, 460 + fall + bounce, 1, { dust });
    if (land && age < 1.1) {
      for (let i = 0; i < 14; i++) {
        const side = i % 2 ? 1 : -1, a = hash(i + 3) * .9, d = easeOut(age / 1.1) * (140 + hash(i) * 240), r = (30 + hash(i + 9) * 40) * (.5 + age);
        paint(ellPts(960 + side * (400 + Math.cos(a) * d), 870 - Math.sin(a) * d * .5, r, r * .7, 14), { wash: '#D8CFC0', washOp: 200 * (1 - age / 1.1), ink: null });
      }
      sfx('БУМ!', 1480, 520, 120, TK.ember, age, { life: .7, rot: .12, font: ruFont(120) });
    }
    // cobweb, spider, view counter
    t03_cobweb(1340, 462, seg(t, 73.6, 75.4), t);
    const sp = seg(t, 74.4, 75.6);
    if (sp > 0) {
      const spx = 1240 + Math.sin(t * 2.2) * 8, spy = lerp(0, 420, easeOut(sp));
      inkLine([[spx, -60], [spx, spy - 20]], .8, '#8A8480', 'inkfine', 0);
      for (const e of [-1, 1]) for (let j = 0; j < 4; j++) inkLine([[spx, spy], [spx + e * 26, spy - 10 + j * 8], [spx + e * 36, spy + 6 + j * 9]], 1.1, TK.soot, 'inkfine', .3);
      paint(ellPts(spx, spy, 15, 18, 10), { wash: TK.soot, ink: null }); paint(ellPts(spx, spy - 20, 9, 9, 8), { wash: TK.soot, ink: null });
    }
    const vk = backOut(seg(t, 72.4, 72.7));
    if (vk > .02) {
      push(); translate(1560, 390); rotate(.05); scale(vk);
      paint(rectPts(-150, -60, 300, 120), { wash: TK.yellowLt, fill: TK.yellow, fillOp: 70, tex: .5, ink: INK, sw: .8 });
      pop();
      paint(ellPts(1422, 390, 26 * vk, 15 * vk, 16), { wash: '#FFFFFF', ink: INK, sw: .8 });
      paint(ellPts(1422, 390, 9 * vk, 9 * vk, 10), { wash: INK, ink: null });
      letter('ПРОЧТЕНИЙ: 0', 1588, 392, 30 * vk, TK.soot, { font: ruFont(30 * vk), ink: false, rot: .05 });
    }
    camEnd();
  }

  // ---------- 76.3 «Ушло сорок миллионов — ну и пускай!» ----------
  function t03_bill(x, y, r, burn) {
    push(); translate(x, y); rotate(r);
    paint(rectPts(-46, -24, 92, 48), { wash: mixCol('#8DBF7A', TK.soot, burn), fill: '#5E8F58', fillOp: 70, tex: .5, ink: INK, sw: .5 });
    paint(ellPts(0, 0, 14, 14, 10), { wash: mixCol('#CFE6BE', TK.soot, burn), ink: null });
    pop();
  }
  function shrug(t, lt) {
    const tC = 76.9, tS = 77.64, tT = B(130), tF = tT + .42, pk = pulse(t, 5);
    const flare = t > tF ? Math.exp(-(t - tF) * 2.5) : 0, [sx, sy] = shakeXY(t, 10 * (t > tC ? Math.exp(-(t - tC) * 7) : 0) + 8 * flare);
    const z = kf(t, [[76.3, 1.0], [80.35, 1.12]], ease);
    camBegin(990 + sx, kf(t, [[76.3, 560], [80.35, 600]]) + sy, z);
    t03_office(t, { dark: .72 });
    glowAt(960, 720, 520, TK.orange, 110 + 40 * pk + 80 * flare);
    // the bin
    const fk = .75 + .25 * pk + 1.1 * flare;
    fire(960, 700, 330, 360 * fk, t, { k: fk, seed: 12, n: 6 });
    for (let i = 0; i < 5; i++) {                                                  // money curling in the flames
      const p = frac(t * .55 + hash(i));
      t03_bill(900 + hash(i + 1) * 120 + Math.sin(t * 3 + i) * 20, 690 - p * 300, (hash(i + 2) - .5) * 2 + t * (hash(i) - .5), .3 + p * .7);
    }
    paint([[830, 690], [1090, 690], [1060, 920], [860, 920]], { wash: TK.steel, fill: TK.steelDk, fillOp: 100, tex: .6, border: .5, ink: INK, sw: 1.3 });
    for (let i = 1; i < 6; i++) { const f = i / 6; inkLine([[lerp(830, 1090, f), 700], [lerp(860, 1060, f), 912]], .8, TK.steelLt, 'inkfine', 0); }
    paint(rrPts(816, 678, 288, 24, 10), { wash: TK.steelLt, ink: INK, sw: 1 });
    glowAt(960, 700, 180, TK.yellow, 70);
    // bills and tokens pouring in from above
    for (let i = 0; i < 6; i++) {
      const p = frac(t / 1.3 + hash(i + 20)), x = lerp(200 + hash(i + 21) * 1500, 960, p), y = lerp(-80, 690, p) - Math.sin(p * Math.PI) * 120;
      t03_bill(x, y, t * 3 * (hash(i) - .5) + i, p * .5);
    }
    tokenRain(t, { to: [960, 700], n: 6, seed: 5, r: 20, per: 1.2 });
    // agent #7 toasting a marshmallow
    const toast = seg(t, 76.3, 80);
    agentBot(560, 900, 20, t, { n: 7, eyes: 'happy', mouth: 'smile', aR: .25, aL: .1, seed: 4,
      armR: (u, sw) => { inkLine([[0, 0], [9 * u, -1.2 * u]], sw * 1.2, '#6B4A2A', 'ink', 0); paint(ellPts(9.4 * u, -1.25 * u, .9 * u, .7 * u, 12), { wash: mixCol('#FFF8EC', '#8A5A2A', toast), ink: INK, sw: sw * .5 }); } });
    // agent #42 holds the report, shrugs «ну и пускай», then bins it
    const sh = seg(t, tS, tS + .2) * (1 - seg(t, tT - .3, tT - .1)), thr = seg(t, tT - .25, tT + .05);
    const holding = t < tT;
    agentBot(1370, 900, 20, t, {
      n: 42, seed: 9,
      eyes: t > tS ? 'closed' : 'look', lookX: -1, lookY: -.3, mouth: t > tS && t < tT ? 'flat' : 'smile',
      aL: holding ? lerp(.2 + .45 * sh, 2.2, thr) : lerp(2.2, .3, seg(t, tT, tT + .5)), aR: .2 + .45 * sh, rot: -.06 * sh,
      sq: sh > 0 && t < tS + .25 ? -.1 * Math.sin(seg(t, tS, tS + .25) * Math.PI) : 0, dy: -sh * .6,
      armL: holding ? (u, sw) => { push(); rotate(-.3); t03_binder(-10, -34, .075); pop(); } : null,
      armR: (u, sw) => { push(); rotate(-1.1 * sh); paint(ellPts(.4 * u, -.3 * u, 1 * u, .6 * u, 12), { wash: AG.col, ink: INK, sw: sw * .5 }); for (const d of [-.5, 0, .5]) inkLine([[.4 * u + d * u, -.8 * u], [.4 * u + d * 1.3 * u, -1.5 * u]], sw * .7, INK, 'inkfine', 0); pop(); }
    });
    if (!holding && t < tF) {
      const p = seg(t, tT, tF), bx = lerp(1180, 900, p), by = lerp(760, 690, p) - Math.sin(p * Math.PI) * 260;
      push(); translate(bx, by); rotate(p * 5); t03_binder(-110, -55, .28); pop();
    }
    if (flare > .02) for (let i = 0; i < 16; i++) {
      const a = -Math.PI * (.1 + .8 * hash(i)), d = (1 - flare) * (300 + hash(i + 4) * 300);
      paint(ellPts(960 + Math.cos(a) * d, 640 + Math.sin(a) * d, 6, 6, 6), { wash: i % 2 ? TK.yellow : TK.orange, ink: null });
    }
    camEnd();
    if (flare > .5) flash((flare - .5) * .7, TK.yellowLt);
    // the price tag of the report
    const ck = t > tC ? 1 + .12 * Math.exp(-(t - tC) * 8) : 1;
    letter('ДОКЛАД СТОИЛ:', 960, 70, 38, TK.cream, { font: ruFont(38) });
    push(); translate(960, 175); scale(ck); translate(-960, -175);
    counter(960, 175, 104, t < tC ? 4e7 * easeIn(seg(t, 76.3, tC)) + frac(t * 9) : 4e7, { col: t > tC ? TK.yellow : TK.cream });
    pop();
    letter('ТОКЕНОВ', 960, 272, 40, TK.yellowLt, { font: ruFont(40) });
    punkText('НУ И ПУСКАЙ', 1440, 560, 64, t, tS, { seed: 8 });
  }

  chapter('verse2', 58.8, 80.35, [
    [58.8, kpi], [64.0, lowSpender], [66.3, champion], [69.0, orgChart], [71.9, report], [76.3, shrug]
  ]);
})();
