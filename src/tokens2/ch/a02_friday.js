// a02_friday.js: «Жги токены» v2, verse 1 (20.1–39.8), ported from v1's verse (t01_friday.js 12.6–32.35), retimed to v2.
//   20.1  «Пятница, дела позади»: Friday evening room, the calendar flips ЧТ→ПЯТНИЦА, to-dos ticked on the hits, Clawd stretches
//   22.65 «Лимиты целы, полпути»: the laptop screen, limit bar at 50%, week strip on ПТ, the ½ flag, «ПОЛПУТИ»
//   25.25 «Парк зовёт»: the window turns into a sunny park; the calendar runs ПЯТНИЦА→СУББОТА→ВОСКРЕСЕНЬЕ
//   27.8  «но в воскресенье всё сгорит»: the Sunday page burns
//   30.5  «Сайт не нужен, бот не нужен»: Clawd waves off the site and the bot
//   32.5  «Но лимиты ждут»: the limit bar's tractor beam hauls him back up
//   33.98 «вперёд, к луне!»: the bar is a rocket «К ЛУНЕ»
//   35.1  «Сделай игру»: the empty arcade «0 ИГРОКОВ», cobwebs, a spider
//   37.75 «Сайт мне сделай»: «0 ПОСЕТИТЕЛЕЙ», tumbleweed, pan to the hot rack → glitchCut at 39.8 into the data center.
// Clawd wears no hat and no scarf. Palette pulled toward v2's factory: steel wall, sodium lamp light.
(() => {
  const INK = PAL.ink, C = A2;
  const WALL = '#A39C93', WALLDK = C.steel;
  const VH = hitsIn(20.1, 39.8);
  const pk = t => .5 + .5 * Math.sin(t * 9.8);             // ponytail: soft throb instead of bpOf() (beat phase drifts in v2)
  const tx = (s, x, y, size, col, o = {}) => letter(s, x, y, size, col, { font: ruFont(size), ink: false, ...o });

  // ---------- helpers (from v1) ----------
  const DAYS = { th: ['ЧЕТВЕРГ', 24], fr: ['ПЯТНИЦА', 25], sa: ['СУББОТА', 26], su: ['ВОСКРЕСЕНЬЕ', 27] };
  function calPage(x, y, w, h, d, o = {}) {
    paint(rectPts(x, y, w, h, 1), { wash: TK.cream, fill: '#E9DCC4', fillOp: 70, tex: .4, ink: INK, sw: w / 500 });
    if (o.noText) return;
    const [day, num] = d, ns = h * .5, ds = Math.max(40, Math.min(h * .12, (w * .86) / Math.max(1, textW(day, ruFont(100)) / 100)));
    tx(String(num), x + w / 2, y + h * .42, ns, d === DAYS.su ? TK.ember : '#2B2233');
    tx(day, x + w / 2, y + h * .8, ds, d === DAYS.su ? TK.ember : '#2B2233');
  }
  function calendar(x, y, w, h, cur, next, p = 0) {
    const hh = h * .2, py = y + hh, ph = h - hh;
    paint(rectPts(x + 12, y + 16, w, h), { fill: INK, fillOp: 70, bleed: .2, ink: null });
    if (p > 0 && next) { calPage(x, py, w, ph, next); flushLetters(); } else calPage(x, py, w, ph, cur);
    if (p > 0 && p < 1) {
      const s = Math.cos(p * Math.PI);
      if (s > 0) {
        paint(rectPts(x, py, w, ph * s), { wash: TK.cream, ink: INK, sw: w / 500 });
        const fs = Math.min(ph * .12, w * .8 / Math.max(1, textW(cur[0], ruFont(100)) / 100)) * s;
        if (s > .55) tx(cur[0], x + w / 2, py + ph * s * .75, fs, '#2B2233');
      } else paint(rectPts(x - w * .03, py - ph * -s * .7, w * 1.06, ph * -s * .7), { wash: '#D9CDB6', fill: '#BFAF94', fillOp: 70, tex: .4, ink: INK, sw: w / 500 });
    }
    paint(rectPts(x - 6, y, w + 12, hh, 1), { wash: TK.ember, fill: TK.emberDk, fillOp: 70, tex: .5, ink: INK, sw: w / 450 });
    tx('СЕНТЯБРЬ', x + w / 2, y + hh * .55, Math.max(40, hh * .42), TK.cream);
    for (let i = 0; i < 5; i++) paint(ellPts(x + w * (.18 + i * .16), y + 4, w * .018, w * .03, 8), { wash: C.steelLt, ink: INK, sw: .5 });
  }
  function windowView(x, y, w, h, t, park = 0) {
    paint(rectPts(x, y, w, h), { wash: '#F0A460', fill: C.sodium, fillOp: 90, bleed: .15, tex: .5, ink: null });            // sodium dusk
    paint(ellPts(x + w * .62, y + h * .72, w * .14, w * .14, 20), { wash: '#FFD27A', ink: null });
    paint([[x, y + h * .8], [x + w * .3, y + h * .74], [x + w * .7, y + h * .78], [x + w, y + h * .72], [x + w, y + h], [x, y + h]], { wash: C.gunmetal, ink: null });
    for (let i = 0; i < 6; i++) {                                                       // factory skyline with lit windows
      const bx = x + w * (.02 + i * .165), bh = h * (.22 + hash(i + 3) * .25), bw = w * .13;
      paint(rectPts(bx, y + h * .8 - bh, bw, bh + 4), { wash: '#3A3E46', ink: null });
      for (let k = 0; k < 4; k++) if (hash(i * 5 + k) > .45) paint(rectPts(bx + bw * (.2 + (k % 2) * .4), y + h * .8 - bh * (.8 - Math.floor(k / 2) * .3), bw * .2, h * .03), { wash: TK.yellowLt, ink: null });
    }
    if (park > .01) {
      const op = 255 * park;
      paint(rectPts(x, y, w, h), { wash: '#9FD6F2', washOp: op, ink: null });
      paint(ellPts(x + w * .78, y + h * .2, w * .09, w * .09, 18), { wash: TK.yellowLt, washOp: op, ink: null });
      paint([[x, y + h * .68], [x + w * .4, y + h * .6], [x + w, y + h * .66], [x + w, y + h], [x, y + h]], { wash: '#8CC66E', washOp: op, ink: null });
      for (let i = 0; i < 3; i++) {
        const tx_ = x + w * (.14 + i * .36), ty = y + h * .62;
        paint(rectPts(tx_ - 6, ty, 12, h * .14), { wash: '#7A5234', washOp: op, ink: null });
        paint(ellPts(tx_, ty - h * .04, w * .1, h * .12, 16), { wash: '#4E9A58', washOp: op, ink: null });
      }
      const bx = x + w * .5, by = y + h * .86;                                          // bench
      paint(rectPts(bx - w * .14, by - h * .08, w * .28, h * .03), { wash: '#A0643A', washOp: op, ink: null });
      paint(rectPts(bx - w * .14, by - h * .035, w * .28, h * .03), { wash: '#A0643A', washOp: op, ink: null });
      for (const e of [-1, 1]) paint(rectPts(bx + e * w * .11 - 3, by, 6, h * .05), { wash: '#5A3A22', washOp: op, ink: null });
      const kx = x + w * .3 + Math.sin(t * 1.7) * w * .05, ky = y + h * .24 + Math.sin(t * 2.3) * h * .03, ks = w * .06;   // kite
      paint([[kx, ky - ks], [kx + ks * .7, ky], [kx, ky + ks * 1.2], [kx - ks * .7, ky]], { wash: TK.ember, washOp: op, ink: park > .5 ? INK : null, sw: .5 });
      const tail = []; for (let i = 0; i <= 6; i++) tail.push([kx + i * w * .025 + Math.sin(t * 5 + i) * 6, ky + ks * 1.2 + i * h * .045]);
      if (park > .5) inkLine(tail, .6, INK, 'inkfine', .5);
      if (park > .5) inkLine([[kx, ky + ks * 1.2], [x + w * .56, y + h * .82]], .35, INK, 'inkfine', .3);
    }
    paint(rectPts(x, y, w, h), { ink: TK.cream, sw: 3.2 });
    inkLine([[x + w / 2, y], [x + w / 2, y + h]], 3, TK.cream, 'ink', 0);
    inkLine([[x, y + h * .45], [x + w, y + h * .45]], 3, TK.cream, 'ink', 0);
    paint(rectPts(x - 18, y - 18, w + 36, h + 36), { ink: INK, sw: 1.2 });
    paint(rectPts(x - 30, y + h + 10, w + 60, 26), { wash: TK.cream, ink: INK, sw: .9 });
  }
  function wall() {
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: WALL, fill: WALLDK, fillOp: 70, bleed: .1, tex: .6, border: .3, ink: null });
    for (let i = 0; i < 9; i++) inkLine([[i * 240 + 40, -20], [i * 240 + 40, H + 20]], .35, WALLDK, 'inkfine', 0);
    glowAt(380, 420, 520, C.sodium, 45);
  }
  function stickyNote(x, y, n) {
    paint(rectPts(x, y, 310, 300, 1.5), { wash: '#FFE27A', fill: C.hazard, fillOp: 60, tex: .5, ink: INK, sw: .7 });
    tx('ДЕЛА:', x + 155, y + 42, 44, '#2B2233');
    ['отчёт', 'созвон', 'почта'].forEach((s, i) => {
      const ly = y + 110 + i * 62;
      tx(s, x + 30, ly, 40, '#2B2233', { align: 'left' });
      if (n > i) {
        const k = clamp((n - i) * 3), cx = x + 255, cy = ly;
        inkLine([[cx - 18, cy], [cx - 18 + 12 * Math.min(1, k * 2), cy + 12 * Math.min(1, k * 2)], ...(k > .5 ? [[cx - 6 + 26 * (k - .5) * 2, cy + 12 - 32 * (k - .5) * 2]] : [])], 2.4, TK.green, 'marker', 0);
      }
    });
  }
  function laptopSide(x, y, k = 1.3) {
    push(); translate(x, y); scale(k); translate(-x, -y);
    paint([[x, y], [x + 260, y], [x + 262, y - 14], [x + 2, y - 14]], { wash: C.steelLt, ink: INK, sw: .8 });
    paint([[x + 250, y - 12], [x + 320, y - 230], [x + 336, y - 226], [x + 266, y - 8]], { wash: C.steel, ink: INK, sw: .8 });
    glowAt(x + 180, y - 120, 190, '#9FC4FF', 55);
    token(x + 318, y - 118, 13, { ink: false });
    pop();
  }
  function desk(y) {
    paint(rectPts(-60, y, W + 120, H - y + 80), { wash: '#6E5A4A', fill: C.gunmetal, fillOp: 90, tex: .6, ink: INK, sw: 1 });
    inkLine([[-40, y + 22], [W + 40, y + 22]], .6, C.gunDk, 'inkfine', 0);
  }
  function room(t, o = {}) {
    wall();
    windowView(140, 150, 500, 460, t, o.park || 0);
    stickyNote(1080, 130, o.checks ?? 3);
    calendar(1480, 150, 320, 400, o.cur || DAYS.fr, o.next, o.flip || 0);
  }

  // ---------- 20.1 «Пятница, дела позади» ----------
  const TICKS = [20.65, 21.29, 21.77], T_STR = 22.27;
  function friday(t, lt) {
    camBegin(960 + lt * 10, 540, 1 + lt * .01);
    const n = TICKS.reduce((a, h) => a + seg(t, h, h + .2), 0);
    room(t, { cur: DAYS.th, next: DAYS.fr, flip: seg(t, 20.12, 20.45), checks: n });
    const stretch = seg(t, T_STR, T_STR + .35);
    clawd(820, 870, 40, {
      noShadow: true, mouth: stretch > .5 ? 'smile' : 'flat', ...mood(t, [[20.1, 'narrow'], [T_STR, 'happy']]),
      aL: lerp(-.3, 1.9, stretch) + (stretch > .9 ? .1 * Math.sin(t * 6) : 0), aR: lerp(-.1, 1.9, stretch), dy: -stretch * .4,
    });
    laptopSide(1060, 802);
    desk(800);
    camEnd();
    flash(.5 * Math.exp(-lt * 6), C.sodium);
    glitchCut(t, 20.1);
  }

  // ---------- 22.65 «Лимиты целы, полпути»: the laptop screen ----------
  function screen(t, lt) {
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: C.gunDk, fill: C.steel, fillOp: 70, tex: .5, ink: null });
    camBegin(960, 520, 1 + lt * .035);
    paint(rrPts(140, 60, 1640, 900, 40), { wash: '#1E232A', ink: INK, sw: 1.4 });
    paint(rectPts(190, 110, 1540, 800), { wash: '#15181D', fill: '#232A36', fillOp: 90, tex: .4, ink: null });
    tx('Использование', 260, 190, 48, TK.ash, { align: 'left' });
    tx('сброс: вс, 23:59', 1660, 190, 40, TK.ash, { align: 'right' });
    const v = .5, bx = 300, bw = 1320, by = 360;
    limitBar(bx, by, bw, v, { glow: .4 + .5 * hitK(t, [23.23, 24.18], .3) });
    const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
    days.forEach((d, i) => {
      const x = bx + i * bw / 7, cur = i === 4, past = i < 4;
      paint(rrPts(x + 8, 600, bw / 7 - 16, 110, 16), { wash: cur ? C.sodium : past ? '#2E3440' : '#232A36', ink: cur ? TK.cream : C.steelLt, sw: .8 });
      tx(d, x + bw / 14, 655, 46, cur ? TK.soot : past ? TK.ash : TK.cream);
      if (past) inkLine([[x + 30, 690], [x + bw / 7 - 30, 620]], 1, TK.ash, 'inkfine', 0);
    });
    const fk = backOut(seg(t, 24.02, 24.32)), fx = bx + (bw - bw * .085 * .3) * v + 14;   // «по-пути»: the halfway flag
    if (fk > .02) {
      inkLine([[fx, by + 10], [fx, by - 220 * fk]], 2.4, TK.cream, 'ink', 0);
      paint([[fx, by - 220 * fk], [fx + 150 * fk, by - 190 * fk], [fx, by - 160 * fk]], { wash: C.hazard, ink: INK, sw: .8 });
      tx('½', fx + 52 * fk, by - 190 * fk, 44 * fk, TK.soot);
    }
    stamp('ПОЛПУТИ', 1300, 820, 80, t, 24.18, { col: C.hazard, rot: -.07 });
    camEnd();
  }

  // ---------- 25.25 «Парк зовёт, но в воскресенье»: the window becomes a park; the calendar runs to Sunday ----------
  function park(t, lt) {
    const pkk = ease(seg(t, 25.32, 25.9)), f1 = seg(t, 26.27, 26.57), f2 = seg(t, 26.9, 27.2);
    camBegin(lerp(700, 1000, ease(seg(t, 25.8, 26.4))), 470, 1.12);
    const cal = t < 26.9 ? { cur: DAYS.fr, next: DAYS.sa, flip: f1 } : { cur: DAYS.sa, next: DAYS.su, flip: f2 };
    room(t, { park: pkk, ...cal });
    if (pkk > .3) for (let k = 0; k < 4; k++) { const f = frac(t * .7 + k / 4); paint(starPts(200 + hash(k) * 380, 220 + hash(k + 3) * 300, 16 * Math.sin(f * Math.PI), .3), { wash: TK.cream, ink: null }); }
    const turn = t >= 26.27;
    clawd(820, 870, 40, {
      noShadow: true, eyes: 'look', lookX: turn ? 1 : -1, lookY: -.5, mouth: turn ? 'o' : 'smile',
      aL: turn ? .2 : .9 + .15 * Math.sin(t * 5), aR: -.1, ...(t > 26.95 ? { emote: '!', emoteK: seg(t, 26.95, 27.15) } : {}),
    });
    laptopSide(1060, 802);
    desk(800);
    camEnd();
  }

  // ---------- 27.8 «всё сгорит»: the Sunday page burns ----------
  function burn(t, lt) {
    const ig = 28.1, b = ease(seg(t, ig, 30.0)), p = pk(t);
    const [shx, shy] = shakeXY(t, t > ig ? 4 + 5 * p : 0);
    wall();
    camBegin(960 + shx, 470 + shy, 1 + lt * .03);
    const x = 560, y = 60, w = 800, h = 880, hh = h * .2, py = y + hh, ph = h - hh, yb = y + h - (ph + 30) * b;
    paint(rectPts(x + 16, y + 20, w, h), { fill: INK, fillOp: 70, bleed: .2, ink: null });
    if (yb > py + 4) {
      paint(rectPts(x, py, w, yb - py), { wash: TK.cream, fill: mixCol('#E9DCC4', C.sodium, b * .4), fillOp: 80, tex: .4, ink: INK, sw: 1.6 });
      if (yb > py + ph * .52) tx('27', x + w / 2, py + ph * .38, ph * .44, TK.ember);
      if (yb > py + ph * .78) tx('ВОСКРЕСЕНЬЕ', x + w / 2, py + ph * .7, 84, TK.ember);
      if (yb > py + ph * .92) tx('лимит сгорает в 23:59', x + w / 2, py + ph * .86, 44, '#2B2233');
    }
    paint(rectPts(x - 8, y, w + 16, hh, 1), { wash: TK.ember, fill: TK.emberDk, fillOp: 70, tex: .5, ink: INK, sw: 1.6 });
    tx('СЕНТЯБРЬ', x + w / 2, y + hh * .55, hh * .42, TK.cream);
    for (let i = 0; i < 5; i++) paint(ellPts(x + w * (.18 + i * .16), y + 6, 14, 22, 8), { wash: C.steelLt, ink: INK, sw: .6 });
    flushLetters();                                                          // the flames go over the lettering
    if (t > ig) {
      const edge = []; for (let i = 0; i <= 16; i++) edge.push([x - 10 + i * (w + 20) / 16, yb + Math.sin(i * 1.9 + t * 3) * 14 + (i % 2) * 10]);
      paint([...edge, [x + w + 10, yb + 40], [x - 10, yb + 40]], { wash: TK.soot, fill: TK.emberDk, fillOp: 90, tex: .7, ink: null });
      inkLine(edge, 2, C.sodium, 'marker', .4);
      const fk = clamp((t - ig) / .4) * (b < .98 ? 1 : 1 - seg(t, 30.0, 30.2));
      fire(x + w / 2, yb + 20, w * 1.1, 360, t, { k: fk * (1 + .15 * p), seed: 90, n: 8, cols: [C.rust, C.sodium, C.hazard] });
      smoke(x + w / 2, yb - 200, t, { n: 6, r: 80, h: 500, seed: 3 });
      for (let i = 0; i < 12; i++) {                                         // falling ash
        const q = frac(t * .6 + hash(i)), ax = x + hash(i + 5) * w, ay = yb + 40 + q * 500;
        paint(ellPts(ax + Math.sin(t * 3 + i) * 20, ay, 7, 4, 6, 0, t + i), { wash: q < .3 ? C.sodium : TK.ash, washOp: 255 * (1 - q), ink: null });
      }
    }
    camEnd();
    flash(.35 * Math.exp(-(t - ig) * 7) * (t > ig), C.hazard);
  }

  // ---------- 30.5 «Сайт не нужен, бот не нужен» → 32.5 «Но лимиты ждут»: waved off, then the bar's beam hauls him up ----------
  function siteIcon(x, y, s, rot = 0) {
    push(); translate(x, y); rotate(rot); scale(s);
    paint(rrPts(-120, -85, 240, 170, 16), { wash: '#FBF8F2', ink: INK, sw: 1 });
    paint(rrPts(-120, -85, 240, 36, 12), { wash: C.steel, ink: null });
    for (let i = 0; i < 3; i++) paint(ellPts(-100 + i * 18, -67, 5, 5, 8), { wash: TK.cream, ink: null });
    for (let i = 0; i < 3; i++) paint(rectPts(-90, 20 + i * 18, 180 - i * 40, 8), { wash: '#C9C4BC', ink: null });
    pop();
    tx('www', x + Math.sin(rot) * 10, y - 12 * s, 48 * s, TK.blue, { rot });
  }
  const hover = (t, s, x, y) => [x + Math.sin(t * 1.3 + s) * 16, y + Math.sin(t * 2 + s) * 18];
  const T_BEAM = 32.5;
  function wave(t, lt) {
    wall();
    const beam = t >= T_BEAM, bk = seg(t, T_BEAM, 33.0), lift = ease(seg(t, 32.96, 33.98));
    camBegin(960, 520 - (beam ? 40 * lift : 0), beam ? 1.08 + lt * .03 : 1.02 + lt * .015);
    windowView(80, 190, 380, 360, t, 0);
    paint(rectPts(-100, 880, W + 200, 400), { wash: '#6E6258', fill: C.gunmetal, fillOp: 90, tex: .6, ink: INK, sw: .8 });   // floor
    const p = pk(t);
    limitBar(440, 150, 1040, .5, { glow: beam ? .8 + .4 * p : .3 + .3 * p });
    if (beam) {
      const cy = 880 - lift * 360;
      paint([[840, 250], [1080, 250], [1200, cy], [720, cy]], { wash: C.hazard, washOp: 130 * bk, ink: null });
      paint([[900, 250], [1020, 250], [1080, cy], [840, cy]], { wash: TK.yellowLt, washOp: 150 * bk, ink: null });
      for (let i = 0; i < 6; i++) { const f = frac(t * 1.5 + i / 6); token(lerp(800, 1120, hash(i)), lerp(cy - 60, 290, f), 14, { spin: t + i, ink: false }); }
      stamp('ЛИМИТЫ ЖДУТ', 960, 690, 72, t, 33.44, { col: C.hazard, rot: -.06 });
    }
    const off1 = seg(t, 30.9, 31.45), off2 = seg(t, 31.58, 32.1);
    let [ax, ay] = hover(t, 0, 440, 600); ax -= easeIn(off1) * 900; ay -= easeIn(off1) * 300;
    if (off1 < 1) siteIcon(ax, ay, 1.5 - off1 * .5, -off1 * 3);
    let [bx, by] = hover(t, 2, 1480, 640); bx += easeIn(off2) * 900; by -= easeIn(off2) * 300;
    if (off2 < 1) { push(); translate(bx, by); rotate(off2 * 3); agentBot(0, 60, 22, t, { n: 1, noShadow: true, eyes: 'scared', mouth: 'o', aL: 1.2, aR: 1.2 }); pop(); }
    if (off1 > 0 && off1 < .5) sfx('НЕ НУЖЕН', 420, 360, 60, TK.soot, off1 * .55, { font: ruFont(60), life: .5 });
    if (off2 > 0 && off2 < .5) sfx('НЕ НУЖЕН', 1500, 440, 60, TK.soot, off2 * .52, { font: ruFont(60), life: .5 });
    const wL = t > 30.55 && t < 31.2 ? Math.sin((t - 30.55) * 18) : 0, wR = t > 31.3 && t < 31.95 ? Math.sin((t - 31.3) * 18) : 0;
    clawd(960, 900 - lift * 360, 34, {
      noShadow: lift > .05, rot: beam ? Math.sin(t * 7) * .06 * lift - .04 * bk : 0, sq: beam ? -.08 * lift : 0,
      eyes: beam ? 'spark' : 'narrow', mouth: beam ? 'O' : 'flat',
      aL: beam ? 1.9 : .3 + wL * .7 + (wL ? .8 : 0), aR: beam ? 1.9 : .3 + wR * .7 + (wR ? .8 : 0),
    });
    camEnd();
    if (beam) flash(.3 * Math.exp(-(t - T_BEAM) * 8), C.hazard);
  }

  // ---------- 33.98 «вперёд, к луне!»: the bar is a rocket ----------
  function rocket(t, lt) {
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: C.gunDk, fill: '#2A3448', fillOp: 90, bleed: .1, tex: .5, ink: null });
    for (let i = 0; i < 40; i++) { const tw = .5 + .5 * Math.sin(t * 3 + i * 2.1); paint(starPts(hash(i) * W, hash(i + 50) * 800, 4 + 6 * tw * hash(i + 9), .35), { wash: TK.cream, washOp: 150 + 100 * tw, ink: null }); }
    const mx = 1560, my = 240, mk = backOut(seg(t, 34.6, 34.9));
    glowAt(mx, my, 260, TK.cream, 30 + 30 * mk);
    paint(ellPts(mx, my, 150, 150, 30), { wash: '#F4ECD2', fill: '#CFC3A2', fillOp: 90, tex: .6, ink: INK, sw: 1.2 });
    for (const [cx, cy, r] of [[-50, -30, 30], [40, 40, 22], [60, -60, 14], [-20, 70, 18]]) paint(ellPts(mx + cx, my + cy, r, r * .85, 12), { wash: '#BDB08E', ink: INK, sw: .4 });
    inkLine([[mx - 60, my + 50], [mx - 10, my + 68], [mx + 40, my + 50]], 1.2, INK, 'ink', .5);                             // the moon smiles, deadpan
    const pr = ease(seg(t, 33.98, 35.05)), sx = lerp(420, 1180, pr), sy = lerp(900, 420, pr), rot = -.45;
    const ww = 760, hb = ww * .085, c = Math.cos(rot), s = Math.sin(rot);
    const Wx = (sx - W / 2) * c + (sy - H / 2) * s, Wy = -(sx - W / 2) * s + (sy - H / 2) * c;
    for (let i = 0; i < 7; i++) { const q = i / 7; paint(ellPts(sx - c * (ww * .55 + q * 420), sy - s * (ww * .55 + q * 420) + q * 40, 40 + q * 60, 34 + q * 50, 14), { fill: TK.sootLt, fillOp: 160 * (1 - q), bleed: .3, ink: null }); }
    camBegin(W / 2, H / 2, 1, rot);
    const x0 = Wx - ww / 2 + W / 2, y0 = Wy - hb / 2 + H / 2;
    push(); translate(x0, y0 + hb / 2); rotate(-Math.PI / 2);
    fire(0, 0, hb * 1.4, 300 * (1 + .2 * pk(t * 2)), t, { seed: 13, n: 4, cols: [C.rust, C.sodium, C.hazard] });
    pop();
    paint([[x0 - 10, y0 - 40], [x0 + 110, y0], [x0 + 110, y0 + hb], [x0 - 10, y0 + hb + 40]], { wash: C.rust, ink: INK, sw: .9 });   // fins
    paint([[x0 + ww - 20, y0 - 6], [x0 + ww + 150, y0 + hb / 2], [x0 + ww - 20, y0 + hb + 6]], { wash: TK.cream, fill: C.hazard, fillOp: 60, ink: INK, sw: .9, curv: .3 });   // nose
    limitBar(x0, y0, ww, .5, { glow: .6, label: 'К ЛУНЕ' });
    clawd(x0 + ww * .55, y0 + 4, 14, { noShadow: true, eyes: 'happy', mouth: 'grin', aL: 1.8 + .2 * Math.sin(t * 12), aR: 1.6, rot: .05 });
    camEnd();
    flash(.3 * Math.exp(-lt * 8), TK.cream);
  }

  // ---------- 35.1 «Сделай игру, чтоб никто не играл»: the empty arcade ----------
  function web(x, y, r, sx, sy) {
    const col = '#CFC8D8';
    for (let i = 0; i <= 4; i++) { const a = i / 4 * Math.PI / 2; inkLine([[x, y], [x + sx * Math.cos(a) * r, y + sy * Math.sin(a) * r]], .5, col, 'inkfine', 0); }
    for (let k = 1; k <= 3; k++) { const pts = []; for (let i = 0; i <= 4; i++) { const a = i / 4 * Math.PI / 2, rr = r * k / 3.4 * (i % 4 ? .88 : 1); pts.push([x + sx * Math.cos(a) * rr, y + sy * Math.sin(a) * rr]); } inkLine(pts, .45, col, 'inkfine', .5); }
  }
  function arcade(t, lt) {
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: C.gunDk, fill: C.gunmetal, fillOp: 90, bleed: .1, tex: .6, ink: null });
    camBegin(960, 520 - lt * 10, 1.02 + lt * .04);
    paint(rectPts(-100, 880, W + 200, 400), { wash: '#2A2D33', fill: C.steel, fillOp: 70, tex: .6, ink: INK, sw: .7 });
    paint([[820, -60], [1100, -60], [1380, 900], [540, 900]], { wash: C.sodium, washOp: 34, ink: null });       // sodium spotlight
    for (let i = 0; i < 16; i++) { const f = frac(t * .08 + hash(i)); paint(ellPts(700 + hash(i + 2) * 520 + Math.sin(t + i) * 20, 60 + f * 800, 2.5, 2.5, 5), { wash: TK.cream, washOp: 160, ink: null }); }
    const cx = 960;
    paint([[cx - 230, 170], [cx + 230, 170], [cx + 250, 900], [cx - 250, 900]], { wash: C.steel, fill: C.gunmetal, fillOp: 90, tex: .6, ink: INK, sw: 1.3 });
    paint(rectPts(cx - 240, 150, 480, 120), { wash: C.rust, fill: TK.emberDk, fillOp: 60, tex: .5, ink: INK, sw: 1.1 });   // marquee
    tx('МОЯ ИГРА', cx, 212, 66, C.hazard);
    paint(rectPts(cx - 190, 300, 380, 290), { wash: '#0E1410', ink: INK, sw: 1 });
    tx('ТОКЕН-РАННЕР', cx, 375, 44, TK.green);
    if (frac(t * 1.66) < .6) tx('ВСТАВЬТЕ ТОКЕН', cx, 460, 40, C.hazard);
    tx('РЕКОРД: —', cx, 540, 40, TK.led);
    paint([[cx - 230, 620], [cx + 230, 620], [cx + 270, 700], [cx - 270, 700]], { wash: C.steelLt, ink: INK, sw: 1 });       // control deck
    inkLine([[cx - 120, 660], [cx - 120, 600]], 3, TK.soot, 'ink', 0);
    paint(ellPts(cx - 120, 596, 18, 18, 10), { wash: TK.ember, ink: INK, sw: .6 });
    for (let i = 0; i < 3; i++) paint(ellPts(cx + 40 + i * 60, 660, 18, 10, 10), { wash: [C.hazard, TK.green, C.sodium][i], ink: INK, sw: .6 });
    paint(rectPts(cx - 60, 760, 120, 70), { wash: C.gunDk, ink: INK, sw: .8 });
    token(cx - 20, 795, 18, { ink: false });
    paint(rectPts(cx + 10, 775, 8, 40), { wash: TK.soot, ink: null });
    web(cx - 230, 170, 150, 1, 1); web(cx + 230, 170, 130, -1, 1); web(cx + 250, 900, 120, -1, -1);
    const spy = 360 + 60 * Math.sin(t * 1.4);                                          // spider on its thread
    inkLine([[cx + 330, -40], [cx + 330, spy]], .5, '#CFC8D8', 'inkfine', 0);
    paint(ellPts(cx + 330, spy + 14, 13, 16, 10), { wash: TK.soot, ink: INK, sw: .5 });
    for (const e of [-1, 1]) for (let k = 0; k < 3; k++) inkLine([[cx + 330, spy + 10 + k * 6], [cx + 330 + e * 22, spy + k * 8], [cx + 330 + e * 30, spy + 18 + k * 8]], .6, TK.soot, 'inkfine', .3);
    paint(rectPts(1330, 460, 330, 170), { wash: TK.soot, ink: INK, sw: 1 });            // the players counter
    tx('ИГРОКОВ', 1495, 505, 40, TK.ash);
    counter(1495, 575, 70, 0, { col: TK.ember });
    inkLine([[1495, 630], [1495, 880]], 3, C.steelLt, 'ink', 0);
    camEnd();
    stamp('0 ИГРОКОВ', 460, 780, 84, t, 36.7, { col: TK.ember, rot: -.1 });
  }

  // ---------- 37.75 «Сайт мне сделай, чтоб никто не читал»: tumbleweed, then pan to the hot rack ----------
  function tumbleweed(x, y, r, rot) {
    paint(ellPts(x, y, r, r * .92, 16), { wash: '#C9A46A', washOp: 160, fill: '#8A6A3A', fillOp: 110, bleed: .2, tex: .5, ink: null });
    for (let i = 0; i < 7; i++) {
      const a0 = rot + i * .9, pts = [];
      for (let q = 0; q <= 6; q++) { const a = a0 + q * .9, rr = r * (.35 + .6 * hash(i * 7 + q)); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
      inkLine(pts, .7, '#6E5230', 'inkfine', .6);
    }
  }
  function website(t, lt) {
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: '#C9C6BE', fill: C.steelLt, fillOp: 70, tex: .5, ink: null });
    const pan = ease(seg(t, 39.05, 39.8));
    camBegin(lerp(960, 1700, pan), lerp(510, 560, pan), lerp(1, .92, pan));
    glowAt(2150, 500, 600, C.sodium, 60 + 60 * pan);                                    // the hot rack: hand-off to the data center
    serverRack(1960, 60, 380, 860, t, { heat: .7 + .3 * pan, seed: 4, fire: pan * .8 });
    cooler(2150, 780, 110, t, { speed: 6, howl: .4 + .6 * pan });
    paint(rrPts(150, 60, 1640, 860, 20), { wash: '#FBF8F2', ink: INK, sw: 1.3 });
    paint(rrPts(150, 60, 1640, 70, 16), { wash: '#C9C4BC', ink: null });
    for (let i = 0; i < 3; i++) paint(ellPts(190 + i * 34, 95, 10, 10, 8), { wash: [TK.ember, C.hazard, TK.green][i], ink: null });
    paint(rrPts(320, 72, 900, 48, 18), { wash: '#FFFFFF', ink: INK, sw: .5 });
    tx('мой-сайт.рф', 350, 97, 40, '#55555F', { align: 'left' });
    tx('МОЙ САЙТ', 960, 230, 96, C.steel);
    tx('сделан за 4 000 000 токенов', 960, 320, 44, '#55555F');
    for (let i = 0; i < 5; i++) paint(rectPts(300, 400 + i * 40, 780 - (i % 3) * 120, 14), { wash: '#DDD8CF', ink: null });
    paint(rectPts(1200, 390, 460, 200), { wash: '#E9E4DA', ink: INK, sw: .6 });
    tx('ПОСЕТИТЕЛЕЙ', 1430, 440, 40, '#55555F');
    counter(1430, 525, 72, 0, { col: TK.ember });
    // cobweb in the page corner
    const wc = [158, 136];
    for (let i = 0; i < 6; i++) { const a = i / 5 * Math.PI / 2; inkLine([wc, [wc[0] + Math.cos(a) * 200, wc[1] + Math.sin(a) * 200]], .6, '#6A6A72', 'inkfine', 0); }
    for (let r = 50; r < 200; r += 45) { const pts = []; for (let i = 0; i <= 5; i++) { const a = i / 5 * Math.PI / 2; pts.push([wc[0] + Math.cos(a) * r * (i % 2 ? .9 : 1), wc[1] + Math.sin(a) * r * (i % 2 ? .9 : 1)]); } inkLine(pts, .6, '#6A6A72', 'inkfine', .5); }
    paint(rectPts(150, 790, 1640, 4), { wash: '#DDD8CF', ink: null });
    const tp = seg(t, 37.8, 39.3), txx = lerp(-60, 1950, tp), ty = 705 - Math.abs(Math.sin((t - 37.8) * 5.9)) * 110;
    for (let i = 1; i < 4; i++) paint(ellPts(txx - i * 70, 790 - i * 4, 40 - i * 8, 12, 10), { fill: '#C9B48A', fillOp: 90 / i, bleed: .3, ink: null });
    for (let i = 0; i < 3; i++) inkLine([[txx - 160 - i * 60, 700 + i * 30], [txx - 90 - i * 60, 698 + i * 30]], .6, '#9A8A70', 'inkfine', 0);
    if (tp > 0 && tp < 1) tumbleweed(txx, ty, 85, t * 6);
    camEnd();
    stamp('0 ПОСЕТИТЕЛЕЙ', 700, 840 - pan * 60, 76, t, 38.32, { col: TK.ember, rot: -.06 });
    glitchCut(t, 39.8);
  }

  chapter('friday', 20.1, 39.8, [
    [20.1, friday], [22.65, screen], [25.25, park], [27.8, burn],
    [30.5, wave], [32.5, wave], [33.98, rocket], [35.1, arcade], [37.75, website],
  ]);
})();
