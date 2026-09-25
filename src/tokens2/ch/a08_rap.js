// a08_rap.js: «Жги токены» v2, verse 3 (the fast rap), 157.35–180.85.
// The CEO's AGI keynote gets hijacked by Clawd's toy railway: one slide per rap line, the toy train keeps running
// across them. 157.35 AGI «ВЕСНА» calendar crossed out year by year → 159.3 loading 99.999% (the train stalls on the
// progress bar) → 162.25 a robot arm writes dissertations and code → 164.6 programmers replaced by «СКОРО ЗАМЕНИМ»
// signs (they leave in the toy wagons) → 167.25 Clawd walks on stage with the board-game box → 169.7 the painted game
// map Царское Село → Москва → Казань → 172.1 pull back: 100 000 GPUs wired to the little table → 174.85 the calm one:
// a wall of GPU fans blows the toy steam train through a watercolour pine forest to «КАЗАНЬ», held to 180.85.
(() => {
  const INK = PAL.ink;
  const L1 = 157.35, L2 = 159.3, L3 = 162.25, L4 = 164.6, L5 = 167.25, L6 = 169.7, L7 = 172.1, L8 = 174.85, END = 180.85;
  const SX = 330, SY = 30, SW = 1260, SH = 640;                   // keynote screen rect (stage world)
  const RED = '#D8262A', TOY = { red: '#D8323E', redDk: '#8E1A24', green: '#2F8F5B', blue: '#2E6FCF', gold: '#F2B632', goldDk: '#A8741A' };

  // ---------- helpers ----------
  const a08_rr = (x, y, w, h, r) => rrPts(x, y, w, h, r);
  function a08_limb(p, q, w, col) {
    const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L * w / 2, ny = dx / L * w / 2;
    paint([[p[0] + nx, p[1] + ny], [q[0] + nx, q[1] + ny], [q[0] - nx, q[1] - ny], [p[0] - nx, p[1] - ny]], { wash: col, fill: '#A88A10', fillOp: 60, tex: .4, ink: INK, sw: 1 });
    paint(ellPts(p[0], p[1], w * .62, w * .62, 14), { wash: A2.steel, ink: INK, sw: .8 });
  }
  // 2-link IK, elbow up
  function a08_ik(bx, by, L1_, L2_, tx, ty) {
    const dx = tx - bx, dy = ty - by, d = clamp(Math.hypot(dx, dy), 10, L1_ + L2_ - 2), a = Math.atan2(dy, dx);
    const c = clamp((L1_ * L1_ + d * d - L2_ * L2_) / (2 * L1_ * d), -1, 1), a1 = a + (dx > 0 ? -1 : 1) * Math.acos(c);
    return [bx + Math.cos(a1) * L1_, by + Math.sin(a1) * L1_];
  }
  function a08_sparkle(x, y, r, k, col) { const s = r * Math.sin(k * Math.PI); if (s > 1.5) paint(starPts(x, y, s, .3), { wash: col, ink: INK, sw: .5 }); }
  // side-view toy track: ballast strip, sleepers, one rail, from x0 to x1 with the rail top at y
  function a08_rails(x0, x1, y, s = 1, o = {}) {
    if (o.ballast !== false) paint(rectPts(x0, y + 4 * s, x1 - x0, 12 * s), { wash: o.bal || '#6B5A4A', ink: null });
    for (let x = Math.ceil(x0 / (30 * s)) * 30 * s; x < x1; x += 30 * s) paint(rectPts(x, y + 3 * s, 12 * s, 9 * s), { wash: '#5A3A22', ink: null });
    inkLine([[x0, y + 2 * s], [x1, y + 2 * s]], 2.2 * s, o.rail || '#9AA3AD', 'ink', 0);
  }
  // the toy steam train, facing right, standing on the rail top at (x, y). s = 1: loco ~175 px long.
  // o.dist (wheel roll, px), o.cars n wagons, o.cargo(i, cx, topY, s) cargo fn, o.puffs [times], o.xAt(t) train x at a
  // past time (so smoke stays where it was puffed), o.t, o.driver (Clawd's face in the cab window), o.glow.
  function a08_train(x, y, s, t, o = {}) {
    const dist = o.dist ?? x, cars = o.cars ?? 2, sw = clamp(s * 1.1, .5, 1.5), carCols = o.carCols || [TOY.blue, TOY.gold, TOY.green, TOY.red];
    // smoke puffs (world-fixed at the moment they were puffed)
    for (const pt of o.puffs || []) {
      const age = t - pt; if (age < 0 || age > 2) continue;
      const bx = o.xAt ? o.xAt(pt) : x, p = age / 2, r = (14 + 46 * easeOut(p)) * s;
      paint(ellPts(bx + (48 - 70 * p) * s, y - (118 + 150 * easeOut(p)) * s, r, r * .82, 14, r * .06), { fill: o.smoke || '#F4F1EA', fillOp: 210 * (1 - p), bleed: .2, tex: .3, border: .5, ink: null });
    }
    // wagons trailing left
    for (let i = 0; i < cars; i++) {
      const cx = x - (150 + i * 132) * s, col = carCols[i % carCols.length];
      inkLine([[cx + 56 * s, y - 30 * s], [cx + 80 * s, y - 30 * s]], 2 * sw, INK, 'ink', 0);
      if (o.cargo) o.cargo(i, cx, y - 66 * s, s);
      paint(rectPts(cx - 56 * s, y - 68 * s, 112 * s, 44 * s, 1), { wash: col, fill: mixCol(col, INK, .4), fillOp: 60, tex: .5, ink: INK, sw });
      for (let k = 1; k < 4; k++) inkLine([[cx - 56 * s + k * 28 * s, y - 64 * s], [cx - 56 * s + k * 28 * s, y - 28 * s]], sw * .4, mixCol(col, INK, .5), 'inkfine', 0);
      paint(rectPts(cx - 60 * s, y - 72 * s, 120 * s, 7 * s), { wash: mixCol(col, INK, .35), ink: INK, sw: sw * .6 });
      for (const wx of [-32, 32]) a08_wheel(cx + wx * s, y - 12 * s, 12 * s, dist / (12 * s), TOY.redDk, sw);
    }
    // locomotive
    push(); translate(x, y); scale(s);
    inkLine([[-100, -30], [-78, -30]], 2, INK, 'ink', 0);
    paint(rectPts(-80, -36, 150, 10), { wash: '#2B2233', ink: null });                                                      // frame
    paint(a08_rr(-26, -80, 90, 46, 18), { wash: TOY.red, fill: TOY.redDk, fillOp: 70, tex: .5, ink: INK, sw });              // boiler
    for (const bx of [-6, 20, 44]) paint(rectPts(bx, -80, 5, 46), { wash: TOY.gold, ink: null });                           // bands
    paint(rectPts(58, -82, 12, 50, 1), { wash: '#2B2233', ink: INK, sw: sw * .8 });                                          // smokebox
    paint([[40, -80], [56, -80], [60, -116], [36, -116]], { wash: '#2B2233', ink: INK, sw: sw * .8 });                        // chimney
    paint(rectPts(32, -122, 32, 8), { wash: TOY.gold, ink: INK, sw: sw * .6 });
    paint(ellPts(10, -82, 11, 11, 12), { wash: TOY.gold, ink: INK, sw: sw * .6 });                                           // dome
    paint([[70, -34], [92, -6], [70, -6]], { wash: TOY.gold, ink: INK, sw: sw * .7 });                                        // cowcatcher
    paint(ellPts(67, -66, 7, 7, 10), { wash: '#FFF2A8', ink: INK, sw: sw * .5 });                                            // lamp
    if (o.glow) paint([[70, -66], [260, -110], [260, -22]], { fill: '#FFF2A8', fillOp: 70 * o.glow, bleed: .3, tex: .2, ink: null });
    paint(rectPts(-84, -112, 60, 78, 1), { wash: TOY.green, fill: '#1E5E3A', fillOp: 60, tex: .5, ink: INK, sw });           // cab
    paint(rectPts(-92, -122, 76, 11, 1), { wash: '#2B2233', ink: INK, sw: sw * .7 });                                        // roof
    paint(rectPts(-74, -102, 36, 26), { wash: o.driver ? PAL.clay : '#FFF5E2', ink: INK, sw: sw * .6 });                    // window
    if (o.driver) for (const ex of [-66, -52]) paint(rectPts(ex, -96, 4, 8), { wash: INK, ink: null });
    pop();
    for (const [wx, r] of [[-50, 21], [-4, 21], [48, 13]]) a08_wheel(x + wx * s, y - r * s, r * s, dist / (r * s), TOY.red, sw);
    const a = dist / (21 * s), rx = Math.cos(a) * 10 * s, ry = Math.sin(a) * 10 * s;
    inkLine([[x - 50 * s + rx, y - 21 * s + ry], [x - 4 * s + rx, y - 21 * s + ry]], 1.4 * sw, "#C9CED6", "inkfine", 0);           // coupling rod
  }
  function a08_wheel(x, y, r, a, col, sw) {
    paint(ellPts(x, y, r, r, 16), { wash: col, ink: INK, sw: sw * .7 });
    if (r > 6) for (let k = 0; k < 3; k++) { const b = a + k * Math.PI / 3; inkLine([[x - Math.cos(b) * r * .8, y - Math.sin(b) * r * .8], [x + Math.cos(b) * r * .8, y + Math.sin(b) * r * .8]], sw * .45, '#FFE0A0', 'inkfine', 0); }
    paint(ellPts(x, y, r * .25, r * .25, 8), { wash: TOY.gold, ink: null });
  }

  // ---------- the keynote stage ----------
  // content(x, y, w, h) paints the slide; o.train {x, dist, cargo, cars, puffs, xAt}: the toy train on the stage floor
  function a08_stage(t, content, o = {}) {
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#15171D', ink: null });
    for (const tx of [120, 1800]) paint(rectPts(tx - 14, -40, 28, 800), { wash: '#23262E', ink: null });                    // truss
    for (let i = 0; i < 9; i++) paint(ellPts(160 + i * 200, 30, 16, 10, 10), { wash: i % 2 ? '#FFE8B0' : '#BFD6FF', washOp: 200, ink: null });
    paint(ellPts(SX + SW / 2, SY + SH / 2, SW * .62, SH * .7, 24), { fill: '#6C7FB0', fillOp: 55, bleed: .3, tex: .2, ink: null });
    paint(rectPts(SX - 16, SY - 16, SW + 32, SH + 32, 1), { wash: '#08090C', ink: '#3A3F4A', sw: 1.2 });
    paint(rectPts(SX, SY, SW, SH), { wash: o.slideBg || '#F4F1EA', ink: null });
    content(SX, SY, SW, SH);
    flushLetters();                                                                                                       // slide text stays under the stage + props
    // stage floor
    paint(rectPts(-60, 720, W + 120, 400), { wash: '#2A2630', fill: '#15131A', fillOp: 90, tex: .5, border: .3, ink: null });
    inkLine([[-60, 722], [W + 60, 722]], 1.4, '#5A5563', 'ink', 0);
    for (const sx of [360, 1560]) paint([[sx - 40, -40], [sx + 40, -40], [sx + 330, 820], [sx - 330, 820]], { fill: '#FFF3D0', fillOp: 22, bleed: .2, tex: .2, border: .1, ink: null });
    a08_rails(-60, W + 60, 800, 1, { bal: "#3A3440" });
    // CEO at his podium (right), Clawd with the train remote (left)
    if (o.ceo !== false) {
      ceoClawd(1760, 790, 19, { click: o.click || 0, aR: o.ceoArm ?? .9, eyes: o.ceoEyes, mouth: o.ceoMouth || 'smile', emote: o.ceoEmote, emoteK: o.ceoEmoteK, noShadow: true });
      paint([[1650, 700], [1870, 700], [1848, 830], [1672, 830]], { wash: '#2E3138', fill: '#1C1F24', fillOp: 80, tex: .4, ink: INK, sw: 1 });
      letter("AGI 2.0", 1760, 760, 36, A2.hazard, { font: ruFont(36), ink: false });
    }
    if (o.clawd !== false) {
      const ph = Math.sin(t * 9);
      clawd(150, 790, 15, { mouth: 'cat', eyes: 'happy', aR: .9 + ph * .1, aL: .3, armR: (u, sw) => {
        paint(a08_rr(-.2 * u, -1.2 * u, 2 * u, 2.4 * u, .4 * u), { wash: TOY.gold, ink: INK, sw: sw * .6 });
        inkLine([[1.4 * u, -1.2 * u], [2.4 * u, -3.6 * u]], sw * .6, INK, 'ink', 0);
        paint(ellPts(.8 * u, 0, .45 * u, .45 * u, 8), { wash: RED, ink: null });
      } });
    }
    if (o.train) { const tr = o.train; a08_train(tr.x, 800, tr.s || .9, t, { cars: 3, driver: true, ...tr }); }
    // the audience: dark heads, a few phones filming the keynote
    for (let i = 0; i < 16; i++) {
      const hx = -40 + i * 132 + hash(i) * 50, hy = 900 + hash(i + 4) * 40 + Math.abs(Math.sin(t * 6 + i)) * 4;
      paint(ellPts(hx, hy, 52, 58, 14), { wash: '#0B0C10', ink: null });
      paint(ellPts(hx, hy + 100, 90, 60, 14), { wash: '#0B0C10', ink: null });
      if (hash(i * 7) > .6) { paint(rectPts(hx + 30, hy - 90, 30, 50, 1), { wash: '#DDE8FF', ink: '#0B0C10', sw: .8 }); glowAt(hx + 45, hy - 65, 50, '#9FBFFF', 50); }
    }
  }
  // slide chrome: title top-left + a small page number / logo
  function a08_slideTitle(x, y, w, txt, col = '#1E1E24') {
    letter(txt, x + 50, y + 62, 54, col, { font: ruFont(54), align: 'left', ink: false });
    paint(rectPts(x + 50, y + 100, 180, 8), { wash: A2.sodium, ink: null });
    letter('KEYNOTE · AGI', x + w - 40, y + 44, 22, '#8A8A95', { font: ruFont(22), align: 'right', ink: false });
  }
  // the train that crosses the stage floor across shots 1, 3, 5 (continuous speed)
  const a08_floorX = t => -380 + frac((t - L1) / 7.2) * 2700;

  // ---------- 157.35 AGI «ВЕСНА»: calendar crossed out year by year ----------
  const CAL = [[2023, 157.47, 157.9], [2024, 158.42, 158.75], [2025, 159.02, 159.2], [2026, 99, 99]];
  function a08_calPage(cx, cy, w, h, year, crossK, q) {
    paint(rectPts(cx - w / 2, cy - h / 2, w, h, 1), { wash: '#FFFDF6', fill: '#E4DCCB', fillOp: 50, tex: .4, ink: INK, sw: 1 });
    paint(rectPts(cx - w / 2, cy - h / 2, w, h * .26), { wash: '#3E8F4E', ink: null });
    letter('ВЕСНА', cx, cy - h * .37, h * .15, '#FFFDF6', { font: ruFont(h * .15), ink: false });
    letter(String(year) + (year === 2026 ? '?' : ''), cx, cy + h * .06, h * .3, '#1E1E24', { font: ruFont(h * .3), ink: false });
    letter('AGI ГОТОВ!', cx, cy + h * .34, h * .09, '#3E8F4E', { font: ruFont(h * .09), ink: false });
    for (let i = 0; i < 3; i++) paint(ellPts(cx - w / 2 + 14 + i * 18, cy + h * .34 + (i % 2) * 8, 5, 5, 6), { wash: '#F2B632', ink: null });
    if (crossK > 0) {
      const a = clamp(crossK * 2), b = clamp(crossK * 2 - 1);
      inkLine([[cx - w * .42, cy - h * .3], [lerp(cx - w * .42, cx + w * .44, a), lerp(cy - h * .3, cy + h * .42, a)]], 9, RED, 'marker', 0);
      if (b > 0) inkLine([[cx + w * .42, cy - h * .3], [lerp(cx + w * .42, cx - w * .44, b), lerp(cy - h * .3, cy + h * .42, b)]], 9, RED, 'marker', 0);
    }
  }
  function shotCalendar(t, lt) {
    camBegin(960, 440, 1 + lt * .03);
    a08_stage(t, (x, y, w, h) => {
      a08_slideTitle(x, y, w, 'AGI — К ВЕСНЕ!');
      const cx = x + w * .5, cy = y + h * .56, pw = 320, ph = 380;
      paint(rectPts(cx - pw / 2 + 12, cy - ph / 2 + 14, pw, ph), { wash: '#C9C0AE', ink: null });                          // stack edge
      for (let i = 0; i < 5; i++) paint(ellPts(cx - pw * .36 + i * pw * .18, cy - ph / 2 - 4, 9, 12, 10), { ink: '#555', sw: 1.2 });
      // the current page is the first one not yet torn
      let i = 0; while (i < CAL.length - 1 && t >= CAL[i][2]) i++;
      a08_calPage(cx, cy, pw, ph, CAL[i][0], seg(t, CAL[i][1], CAL[i][1] + .16));
      if (i > 0) {                                                                                                          // the torn page flying off
        const age = t - CAL[i - 1][2]; if (age < .45) {
          const p = easeOut(age / .45);
          push(); translate(cx + p * 520, cy - p * 260); rotate(p * .9); scale(1 - p * .4);
          a08_calPage(0, 0, pw, ph, CAL[i - 1][0], 1);
          pop();
        }
      }
      // left: the list of promises so far
      letter('обещано:', x + 90, y + 200, 34, '#55555F', { font: ruFont(34), align: 'left', ink: false });
      CAL.slice(0, 3).forEach(([yr, tc], j) => {
        if (t < tc) return;
        letter('весна ' + yr, x + 90, y + 260 + j * 58, 40, '#1E1E24', { font: ruFont(40), align: 'left', ink: false });
        inkLine([[x + 82, y + 262 + j * 58], [x + 320, y + 258 + j * 58]], 5, RED, 'marker', 0);
      });
      stamp('ОПЯТЬ', x + w * .82, y + h * .62, 64, t, 159.02, { col: RED, rot: .12 });
    }, { train: { x: a08_floorX(t), dist: a08_floorX(t), cargo: (i, cx, ty, s) => token(cx, ty + 4, 22 * s, {}) }, click: hitK(t, [157.47, 158.42, 159.02], .15), ceoMouth: 'grin' });
    camEnd();
    glitchCut(t, L1, { k: 1.2 });
  }

  // ---------- 159.3 each release: «осталось чуть-чуть», the train stalls at 99.999% ----------
  const LOAD = [[159.3, '99%', '5.0'], [159.8, '99.9%', '5.5'], [160.34, '99.99%', '6.0'], [160.86, '99.999%', '6.5'], [161.36, '99.9999%', '7.0']];
  function shotLoading(t, lt) {
    const [sx, sy] = shakeXY(t, 6 * hitK(t, LOAD.map(l => l[0]), .1));
    camBegin(960 + sx, 360 + sy, 1.3 + lt * .03);
    a08_stage(t, (x, y, w, h) => {
      a08_slideTitle(x, y, w, 'AGI: ЗАГРУЗКА…');
      let i = 0; while (i + 1 < LOAD.length && t >= LOAD[i + 1][0]) i++;
      const bx = x + 110, bw = w - 220, by = y + 330, bh = 70, age = t - LOAD[i][0];
      // the bar (the train rides on it) + the tiny unreachable remainder
      paint(a08_rr(bx, by, bw, bh, 14), { wash: '#DAD4C8', ink: INK, sw: 1.2 });
      const gap = [24, 12, 7, 4, 2.5][i];
      paint(a08_rr(bx + 6, by + 6, bw - 12 - gap, bh - 12, 10), { wash: '#3E8F4E', fill: '#2B6B38', fillOp: 70, tex: .5, ink: null });
      for (let k = 0; k < 16; k++) { const sx2 = bx + 20 + frac(k / 16 + t * .4) * (bw - 60); inkLine([[sx2, by + bh - 10], [sx2 + 24, by + 10]], 3, '#5FB36E', 'inkfine', 0); }
      paint(rectPts(bx + bw - 30, by - 110, 6, 110), { wash: '#555', ink: null });                                            // finish flag
      paint([[bx + bw - 24, by - 110], [bx + bw + 40, by - 92], [bx + bw - 24, by - 74]], { wash: RED, ink: INK, sw: .8 });
      letter('100%', bx + bw + 8, by - 132, 30, RED, { font: ruFont(30), ink: false });
      // train on the bar top: runs, then stalls just short of the flag, wheels spinning
      const tx = bx + 250 + (bw - 470) * easeOut(seg(t, L2, 160.7)), dist = (t - L2) * 900;
      const puffs = []; for (let pt = L2; pt < t; pt += t > 160.7 ? .22 : .45) puffs.push(pt);
      a08_train(tx, by, .75, t, { cars: 2, driver: true, dist, puffs, xAt: p => bx + 250 + (bw - 470) * easeOut(seg(p, L2, 160.7)), cargo: (j, cx, ty, s) => token(cx, ty + 4, 20 * s, {}) });
      if (t > 160.8) emote('sweat', tx - 55, by - 110, 12, seg(t, 160.8, 161));
      // big percentage + release sticker
      const pk = backOut(age / .14);
      letter(LOAD[i][1], x + w / 2, y + 520, 120 * pk, '#1E1E24', { font: ruFont(120 * pk), ink: false });
      push(); translate(x + w - 200, y + 125); rotate(.12);
      paint(a08_rr(-110 * pk, -34 * pk, 220 * pk, 68 * pk, 12), { wash: A2.hazard, ink: INK, sw: 1 });
      pop();
      letter("релиз " + LOAD[i][2], x + w - 200, y + 125, 38 * pk, '#1E1E24', { font: ruFont(38 * pk), rot: .12, ink: false });
      if (t >= 160.86) stamp('ОСТАЛОСЬ ЧУТЬ-ЧУТЬ', x + w * .36, y + 200, 40, t, 160.86, { col: RED, rot: -.06 });
      if (t >= 161.36) letter('…подождите', x + w / 2, y + 610, 36, '#8A8A95', { font: ruFont(36), pop: (t - 161.36) * 5, ink: false });
    }, { click: hitK(t, LOAD.map(l => l[0]), .15) });
    camEnd();
  }

  // ---------- 162.25 «пишет диссертации и код»: the robot arm ----------
  function a08_book(x, y, w, h, col) {
    paint(rectPts(x, y, w, h), { wash: col, ink: INK, sw: .7 });
    paint(rectPts(x + w * .06, y + h * .25, w * .88, h * .12), { wash: TOY.gold, ink: null });
  }
  function shotArm(t, lt) {
    camBegin(960, 420, 1.08 + lt * .025);
    a08_stage(t, (x, y, w, h) => {
      a08_slideTitle(x, y, w, 'AGI УЖЕ ПИШЕТ:');
      const base = [x + w * .5, y + h - 40], coding = t >= 163.95;
      // left: paper + the growing stack of dissertations
      const nB = Math.min(14, Math.floor((t - L3) * 7) + 2), cols = ['#2E4A7A', '#7A2E3A', '#2E6A4A', '#5A3A7A'];
      for (let b = 0; b < nB; b++) a08_book(x + 120 + (hash(b) - .5) * 14, y + h - 70 - b * 24, 230, 22, cols[b % 4]);
      paint(rectPts(x + 380, y + h - 170, 170, 120, 1), { wash: '#FFFDF6', ink: INK, sw: .8 });
      const lines = coding ? 5 : Math.floor(frac((t - L3) * 1.4) * 6);
      for (let k = 0; k < lines; k++) inkLine([[x + 395, y + h - 150 + k * 18], [x + 395 + 70 + hash(k + nB) * 70, y + h - 150 + k * 18]], 1.6, '#3A3530', 'inkfine', .5);
      // right: the code monitor
      const mx = x + w - 380, my = y + 170;
      paint(a08_rr(mx, my, 300, 210, 10), { wash: '#1A1C22', ink: INK, sw: 1 });
      const scroll = (t - L3) * (coding ? 14 : 3);
      for (let k = 0; k < 9; k++) {
        const li = Math.floor(scroll) + k, ly = my + 20 + k * 20 - frac(scroll) * 20; if (ly > my + 190 || ly < my + 12) continue;
        const ind = (hash(li * 3) * 3 | 0) * 18, ln = 50 + hash(li) * 150;
        paint(rectPts(mx + 18 + ind, ly, ln, 8), { wash: ['#6FCF97', '#F2B632', '#7DB3FF', '#FF7A8A'][li % 4], ink: null });
      }
      paint(rectPts(mx + 130, my + 210, 40, 40), { wash: '#2B2233', ink: null });
      paint(a08_rr(mx - 10, my + 250, 320, 30, 6), { wash: '#3A3F4A', ink: INK, sw: .8 });                                   // keyboard
      // the arm: pen on the paper (wiggle) → hammering the keyboard
      const tgt = coding ? [mx + 60 + (Math.floor(t * 16) % 5) * 45, my + 258 - Math.abs(Math.sin(t * 50)) * 18]
                         : [x + 410 + frac((t - L3) * 1.4) * 110, y + h - 150 + Math.floor(frac((t - L3) * 1.4) * 6) * 18 - 8 + Math.sin(t * 40) * 5];
      const move_ = seg(t, 163.85, 164.05), tg = coding && move_ < 1 ? [lerp(x + 480, tgt[0], move_), lerp(y + h - 150, tgt[1], move_)] : tgt;
      paint(a08_rr(base[0] - 70, base[1] - 20, 140, 40, 8), { wash: A2.gunmetal, ink: INK, sw: 1 });
      hazard(base[0] - 60, base[1] - 14, 120, 16);
      const sh = [base[0], base[1] - 40], el = a08_ik(sh[0], sh[1], 260, 250, tg[0], tg[1] - 40);
      a08_limb(sh, el, 44, A2.hazard);
      a08_limb(el, [tg[0], tg[1] - 40], 34, A2.hazard);
      paint(ellPts(tg[0], tg[1] - 40, 20, 20, 12), { wash: A2.steel, ink: INK, sw: .8 });
      inkLine([[tg[0], tg[1] - 26], [tg[0], tg[1]]], 5, '#1E1E24', 'ink', 0);
      // labels on the word hits
      stamp('ДИССЕРТАЦИИ: ' + (nB * 1024), x + 240, y + 190, 32, t, 162.88, { col: '#2E4A7A', rot: -.05 });
      stamp('КОД', mx + 150, my - 40, 44, t, 164.2, { col: RED, rot: .08 });
    }, { train: { x: a08_floorX(t), dist: a08_floorX(t), cargo: (i, cx, ty, s) => { for (let b = 0; b < 3; b++) a08_book(cx - 40 * s, ty - b * 14 * s, 80 * s, 13 * s, ['#2E4A7A', '#7A2E3A', '#2E6A4A'][(b + i) % 3]); } },
         click: hitK(t, [162.28, 162.88, 164.2], .15) });
    camEnd();
  }

  // ---------- 164.6 programmers replaced by «СКОРО ЗАМЕНИМ» signs; they leave in the toy wagons ----------
  const REP = [165.34, 166.18, 166.68];
  const a08_prog = (x, y, u, t, seed, o = {}) => clawd(x, y, u, { col: '#9AA7B5', dk: '#5E6B78', lt: '#C9D2DC', mouth: 'flat', eyes: 'narrow', seed, noShadow: true, ...o });
  function shotReplace(t, lt) {
    camBegin(960, 385, 1.22 + lt * .02);
    a08_stage(t, (x, y, w, h) => {
      a08_slideTitle(x, y, w, 'ПЛАН: ЗАМЕНИТЬ ПРОГРАММИСТОВ');
      const floorY = y + 470;
      a08_rails(x + 10, x + w - 10, y + 590, .7, { bal: '#B8AE9A' });
      [x + 250, x + 630, x + 1010].forEach((dx, i) => {
        // desk + monitor
        paint(rectPts(dx - 20, floorY - 110, 110, 74, 1), { wash: '#1A1C22', ink: INK, sw: .8 });
        paint(rectPts(dx + 30, floorY - 36, 10, 30), { wash: '#555', ink: null });
        paint(rectPts(dx - 140, floorY, 280, 16, 1), { wash: '#A07850', ink: INK, sw: .9 });
        paint(rectPts(dx - 120, floorY + 16, 12, 70), { wash: '#7A5A3A', ink: null });
        paint(rectPts(dx + 108, floorY + 16, 12, 70), { wash: '#7A5A3A', ink: null });
        const tr = REP[i], age = t - tr;
        if (age < 0) {
          const ty = Math.abs(Math.sin(t * 22 + i)) * .15;
          a08_prog(dx - 70, floorY + 8, 13, t, i, { aR: .9 + ty, aL: .7 - ty, flip: false });
        } else {
          // the sign stands on the chair
          const k = backOut(age / .2), s = k;
          paint(rectPts(dx - 72, floorY - 60 * s, 6, 70 * s), { wash: '#7A5A3A', ink: null });
          push(); translate(dx - 70, floorY - 90 * s); rotate(-.05 + .04 * i); scale(s);
          paint(a08_rr(-86, -46, 172, 92, 8), { wash: '#FFFDF6', ink: RED, sw: 1.6 });
          pop();
          const lab = i === 2 ? ['ВОТ-', 'ВОТ'] : ['СКОРО', 'ЗАМЕНИМ'];
          letter(lab[0], dx - 70, floorY - 90 * s - 20 * s, 30 * s, RED, { font: ruFont(30 * s), rot: -.05 + .04 * i, ink: false });
          letter(lab[1], dx - 70, floorY - 90 * s + 18 * s, 30 * s, RED, { font: ruFont(30 * s), rot: -.05 + .04 * i, ink: false });
          if (age < .4) for (let q = 0; q < 7; q++) { const a = q / 7 * TAU, d = 30 + age * 260; paint(ellPts(dx - 70 + Math.cos(a) * d, floorY - 40 + Math.sin(a) * d * .5, 16 * (1 - age / .4) + 2, 14 * (1 - age / .4) + 2, 8), { wash: '#D8D2C4', ink: null }); }
        }
      });
      // the toy train takes the replaced programmers away (left → right along the slide)
      const trX = t0 => x - 250 + (t0 - L4) * 520;
      a08_train(trX(t), y + 590, .7, t, { cars: 3, driver: true, dist: trX(t), puffs: [164.9, 165.5, 166.1, 166.7], xAt: trX,
        cargo: (j, cx, ty, s) => { if (t >= REP[2 - j] + .15) a08_prog(cx, ty + 34 * s, 6.5, t, j + 5, { eyes: 'closed', mouth: 'wobble', aL: .2, aR: .2 }); } });
    }, { click: hitK(t, REP, .15), ceoMouth: 'grin' });
    camEnd();
  }

  // ---------- 167.25 «а мне от неё нужно только одно»: Clawd walks on with the board-game box ----------
  function a08_box(cx, cy, w, h, t, lidK = 0) {
    paint(rectPts(cx - w / 2 + 10, cy - h / 2 + 12, w, h), { wash: '#000', washOp: 90, ink: null });
    paint(rectPts(cx - w / 2, cy - h / 2, w, h, 1), { wash: '#8EC3E6', ink: INK, sw: 1.3 });
    const x = cx - w / 2, y = cy - h / 2;
    paint([[x, y + h * .62], [x + w * .3, y + h * .48], [x + w * .6, y + h * .58], [x + w, y + h * .45], [x + w, y + h], [x, y + h]], { wash: '#6E9F58', fill: '#3E6B4E', fillOp: 60, tex: .5, ink: null, curv: .4 });
    for (let i = 0; i < 6; i++) { const px = x + w * (.08 + i * .17), py = y + h * .56; paint([[px, py - h * .2], [px + w * .05, py], [px - w * .05, py]], { wash: '#2E5B3E', ink: null }); }
    paint(ellPts(x + w * .82, y + h * .22, h * .1, h * .1, 12), { wash: '#FFE38A', ink: null });
    a08_rails(x + 6, x + w - 6, y + h * .82, w / 600, { bal: '#8A7A6A' });
    a08_train(x + w * .62, y + h * .82, w / 900, t, { cars: 2, dist: t * 60 });
    paint(rectPts(x, y, w, h * .24), { wash: '#C8324A', ink: INK, sw: 1 });
    letter('ПАРОВОЗИКИ', cx, y + h * .12, h * .14, '#FFF5E2', { font: ruFont(h * .14), ink: false });
    letter('Царское Село · 1837', cx, y + h * .33, h * .065, '#1E1E24', { font: ruFont(h * .065), ink: false });
    letter('2–5 игроков · 8+', x + w * .82, y + h * .93, h * .05, '#FFF5E2', { font: ruFont(h * .05), ink: false });
    if (lidK > 0) for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + .2, d = (w * .55 + 60 * lidK); a08_sparkle(cx + Math.cos(a) * d, cy + Math.sin(a) * d * .7, 22, frac(t * 1.5 + i * .1), '#FFE38A'); }
  }
  function shotHijack(t, lt) {
    const walk = seg(t, L5, 168.1), cxw = lerp(-120, 960, easeOut(walk)), lift = seg(t, 168.2, 168.6), one = seg(t, 169.14, 169.3);
    const z = kf(t, [[L5, 1], [168.2, 1.05], [169.14, 1.28], [169.7, 1.34]]);
    camBegin(960, lerp(450, 500, seg(t, 168.2, 169.4)), z);
    a08_stage(t, (x, y, w, h) => {
      a08_slideTitle(x, y, w, 'AGI ЗАМЕНИТ ВСЕХ');
      letter('ЭТО РЕВОЛЮЦИЯ', x + w / 2, y + h * .5, 90, '#1E1E24', { font: ruFont(90), ink: false });
      flushLetters(); if (one > 0) paint(rectPts(x, y, w, h), { wash: '#15171D', washOp: 190 * one, ink: null });                           // the CEO's slide dims
    }, { clawd: false, click: 0, ceoArm: .3, ceoEyes: 'scared', ceoMouth: 'o', ceoEmote: '?', ceoEmoteK: seg(t, 167.6, 167.9),
         train: { x: a08_floorX(t), dist: a08_floorX(t) } });
    if (one > 0) paint([[cxw - 60, -40], [cxw + 60, -40], [cxw + 320, 820], [cxw - 320, 820]], { fill: '#FFF3D0', fillOp: 70 * one, bleed: .2, tex: .2, border: .1, ink: null });
    const up = .75 + .25 * easeOut(lift), bob = walk < 1 ? Math.abs(Math.sin(t * 14)) * 6 : 0;
    clawd(cxw, 808, 23, { walk: walk < 1 ? t * 3 : null, dy: -bob / 23, aL: lerp(.3, 1.45, up), aR: lerp(.3, 1.45, up), eyes: one > 0 ? 'spark' : 'happy', mouth: one > 0 ? 'grin' : 'cat' });
    const boxY = lerp(500, 440, easeOut(lift)) - one * 30, bs = 1 + one * .12;
    a08_box(cxw, boxY, 360 * bs, 240 * bs, t, one);
    camEnd();
  }

  // ---------- 169.7 the game map Царское Село → Москва → Казань ----------
  const CITY = { ts: [360, 300, 'Царское Село'], msk: [900, 640, 'Москва'], kzn: [1560, 440, 'Казань'] };
  const PLACE = [169.74, 169.9, 170.26, 170.63, 171.08, 171.58];
  function a08_route(a, b, n, filled, t, col) {
    const [ax, ay] = a, [bx, by] = b, ang = Math.atan2(by - ay, bx - ax), L = Math.hypot(bx - ax, by - ay), sl = (L - 90) / n;
    for (let i = 0; i < n; i++) {
      const f = (45 + sl * (i + .5)) / L, px = lerp(ax, bx, f), py = lerp(ay, by, f);
      push(); translate(px, py); rotate(ang);
      paint(a08_rr(-sl * .44, -16, sl * .88, 32, 6), { wash: '#EFE6CF', ink: '#6B5A4A', sw: .8 });
      const fi = filled[i];
      if (fi != null && t >= fi) {
        const age = t - fi, dy = -60 * (1 - easeOut(age / .15)) * (age < .15 ? 1 : 0);
        paint(a08_rr(-sl * .4, -13 + dy, sl * .8, 26, 6), { wash: col, fill: mixCol(col, INK, .4), fillOp: 50, tex: .4, ink: INK, sw: .8 });
        paint(rectPts(-sl * .3, -9 + dy, sl * .6, 5), { wash: '#FFFFFF', washOp: 120, ink: null });
      }
      pop();
    }
  }
  function a08_mapBoard(t, o = {}) {
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#6B4A2E', fill: '#4A301C', fillOp: 90, tex: .6, ink: null });      // table
    paint(rectPts(70, 50, 1780, 880, 1), { wash: '#EDE3C8', fill: '#CDBF9A', fillOp: 70, bleed: .15, tex: .7, border: .6, ink: INK, sw: 1.4 });
    paint([[70, 50], [520, 50], [470, 150], [300, 190], [140, 240], [70, 250]], { wash: '#9CC6DC', fill: '#6FA3C4', fillOp: 60, tex: .5, ink: null, curv: .4 });  // the gulf
    letter('Финский залив', 200, 110, 26, '#3E6F8E', { font: ruFont(26), ink: false, rot: -.1 });
    inkLine([[1250, 50], [1420, 250], [1500, 430], [1640, 560], [1700, 760], [1830, 920]], 9, '#6FA3C4', 'ink', .6);         // the Volga
    letter('Волга', 1690, 660, 26, '#3E6F8E', { font: ruFont(26), ink: false, rot: 1.1 });
    for (let i = 0; i < 46; i++) {                                                                                           // forests
      const fx = 120 + hash(i * 3.7) * 1680, fy = 110 + hash(i * 5.3) * 780;
      if (Math.hypot(fx - 900, fy - 640) < 110 || Math.hypot(fx - 360, fy - 300) < 110 || Math.hypot(fx - 1560, fy - 440) < 100) continue;
      paint([[fx, fy - 26], [fx + 14, fy + 6], [fx - 14, fy + 6]], { wash: '#5E8F58', ink: '#3E6B4E', sw: .5 });
    }
    a08_route(CITY.ts, CITY.msk, 6, [PLACE[0], PLACE[0], PLACE[1], PLACE[1], PLACE[2], PLACE[2]], t, TOY.red);
    a08_route(CITY.msk, CITY.kzn, 6, [PLACE[3], PLACE[3], PLACE[4], PLACE[4], PLACE[5], PLACE[5]], t, TOY.red);
    for (const [cx, cy, name] of Object.values(CITY)) {
      paint(ellPts(cx, cy, 30, 30, 18), { wash: '#FFFDF6', ink: INK, sw: 1.2 });
      paint(ellPts(cx, cy, 16, 16, 12), { wash: TOY.red, ink: null });
      letter(name, cx, cy + 58, 40, '#2B2233', { font: ruFont(40), ink: false, stroke: '#EDE3C8' });
    }
    // the Catherine Palace at Царское Село (blue + white + gold)
    const px = 360, py = 210;
    paint(rectPts(px - 120, py - 40, 240, 50, 1), { wash: '#7DB3E0', ink: INK, sw: .8 });
    for (let c = 0; c < 9; c++) paint(rectPts(px - 110 + c * 27, py - 34, 6, 42), { wash: '#FFFDF6', ink: null });
    for (const dx of [-70, 70]) { paint(ellPts(px + dx, py - 52, 12, 14, 10), { wash: TOY.gold, ink: INK, sw: .6 }); inkLine([[px + dx, py - 66], [px + dx, py - 80]], 1.5, TOY.goldDk, 'ink', 0); }
    // title cartouche + the ticket
    paint(a08_rr(640, 74, 640, 76, 14), { wash: '#C8324A', ink: INK, sw: 1.2 });
    letter('ПАРОВОЗИКИ', 960, 112, 50, '#FFF5E2', { font: ruFont(50), ink: false });
    push(); translate(290, 780); rotate(-.08);
    paint(a08_rr(-150, -80, 300, 160, 12), { wash: '#FFF5E2', ink: INK, sw: 1 });
    paint(rectPts(-150, -80, 300, 40), { wash: TOY.blue, ink: null });
    pop();
    letter('БИЛЕТ', 290, 720, 30, '#FFF5E2', { font: ruFont(30), ink: false, rot: -.08 });
    letter('Ц. Село → Казань', 290, 780, 30, '#2B2233', { font: ruFont(30), ink: false, rot: -.08 });
    letter('22 очка', 300, 830, 34, TOY.red, { font: ruFont(34), ink: false, rot: -.08 });
  }
  function shotMap(t, lt) {
    const cam = kf(t, [[L6, [960, 520, 1.06]], [171.0, [930, 520, 1]], [171.5, [380, 290, 1.9]], [L7, [370, 285, 2.05]]]);
    camBegin(cam[0], cam[1], cam[2]);
    a08_mapBoard(t);
    // a tiny painted train piece setting off from Царское Село
    const tp = seg(t, 171.3, L7);
    a08_rails(300, 480, 262, .3, { ballast: false });
    a08_train(330 + tp * 60, 262, .3, t, { cars: 2, dist: t * 30, puffs: [171.4, 171.7, 171.95], xAt: p => 330 + seg(p, 171.3, L7) * 60 });
    camEnd();
  }

  // ---------- 172.1 «сто тысяч GPU, весь мировой прогресс»: pull back from the table ----------
  const WALL = { cols: 13, rows: 6, x0: 960 - 6 * 170, y0: -40, dx: 170, dy: 92 };
  function shotGPU(t, lt) {
    const z = kf(t, [[L7, 3.3], [172.55, 3.0], [173.3, 1.12], [L8, 1.0]]), cy = kf(t, [[L7, 760], [172.55, 765], [173.3, 560], [L8, 540]]);
    const lit = t - 172.86, [sx, sy] = shakeXY(t, 10 * hitK(t, [172.86, 174.15], .12));
    camBegin(960 + sx, cy + sy, z);
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#101318', ink: null });
    // the wall of GPUs (lights slam on at 172.86 in a wave from the centre)
    for (let r = 0; r < WALL.rows; r++) for (let c = 0; c < WALL.cols; c++) {
      const x = WALL.x0 + c * WALL.dx, y = WALL.y0 + r * WALL.dy, on = lit - Math.hypot(c - 6, r - 5) * .045;
      paint(rectPts(x, y, 150, 60), { wash: on > 0 ? '#2E7D4F' : '#1E3A2C', ink: INK, sw: .6 });
      for (const fx of [40, 108]) {
        paint(ellPts(x + fx, y + 30, 22, 22, 12), { wash: '#15171C', ink: on > 0 ? '#48E08A' : INK, sw: .6 });
      }
    }
    // floor + cables converging on the little table
    paint(rectPts(-400, 520, W + 800, 800), { wash: '#1C1F24', fill: '#101318', fillOp: 80, tex: .5, ink: null });
    for (let i = -8; i <= 8; i++) inkLine([[960 + i * 60, 520], [960 + i * 260, 1200]], .8, '#2B2F36', 'inkfine', 0);
    for (let c = 0; c < WALL.cols; c++) {
      const x = WALL.x0 + c * WALL.dx + 75;
      inkLine([[x, 510], [lerp(x, 960, .4), 640], [960 + (c - 6) * 10, 790]], 2.2, lit > 0 ? '#2FBF71' : '#3A4450', 'ink', .6);
    }
    hazard(-400, 506, W + 800, 16);
    // the table, the game, Clawd on his stool
    paint(rectPts(840, 790, 240, 14, 1), { wash: '#8A6440', ink: INK, sw: .7 });
    paint(rectPts(852, 804, 10, 60), { wash: '#6B4A2E', ink: null }); paint(rectPts(1058, 804, 10, 60), { wash: '#6B4A2E', ink: null });
    paint(rectPts(860, 776, 200, 16, 1), { wash: '#EDE3C8', ink: INK, sw: .5 });
    for (let k = 0; k < 5; k++) paint(rectPts(880 + k * 30, 780, 22, 6), { wash: TOY.red, ink: null });
    a08_train(1000, 776, .12, t, { cars: 1, dist: t * 20 });
    clawd(1125, 864, 7, { eyes: 'happy', mouth: 'cat', aL: 1.1, noShadow: true });
    camEnd();
    // counter + the banner (screen space)
    if (t >= 172.66) {
      const k = backOut((t - 172.66) / .18);
      push(); translate(960, 150); scale(k); translate(-960, -150);
      counter(900, 150, 96, 100000, { col: '#48E08A' });
      pop();
      letter('GPU', 960 + 330 * k, 150, 80 * k, '#48E08A', { font: ruFont(80 * k), ink: false });
    }
    if (t >= 173.5) punkText('ВЕСЬ МИРОВОЙ ПРОГРЕСС', 960, 330, 58, t, 173.5, { step: .03 });
    if (t >= 174.28) {
      const k = easeOut((t - 174.28) / .2);
      const ex = lerp(1180, 1050, k), ey = lerp(400, 760, k);
      inkLine([[1180, 400], [1170, lerp(400, 640, k)], [ex, ey]], 2.4, A2.hazard, "ink", .4);
      paint([[ex - 8, ey + 14], [ex - 22, ey - 18], [ex + 14, ey - 8]], { wash: A2.hazard, ink: null });
      letter('→ ради этого', 1340, 440, 40, A2.hazard, { font: ruFont(40), pop: (t - 174.28) * 5 });
    }
    flash(.5 * Math.exp(-Math.max(0, lit) * 8) * (lit > 0 ? 1 : 0), '#DFFFE9');
  }

  // ---------- 174.85 the calm one: fans blow the toy steam train through the pine forest to КАЗАНЬ ----------
  const a08_trainFx = t => lerp(520, 2780, ease(seg(t, L8, 179.35)));
  const PUFF = [174.9, 175.1, 175.75, 176.42, 177.04, 177.7, 178.35, 178.9, 179.4, 179.9, 180.5];
  // a watercolour treeline: one jagged silhouette, n spiky crowns between x0..x1 standing on y
  function a08_treeline(x0, x1, y, step, hMin, hMax, seed, col, fill, sway) {
    const pts = [[x0, y + 200]];
    for (let x = x0, i = 0; x <= x1; x += step, i++) {
      const h = hMin + hash(i * 3.1 + seed) * (hMax - hMin), w = step * .5;
      pts.push([x - w * .5, y - h * .28], [x - w * .22, y - h * .52], [x + sway, y - h], [x + w * .22, y - h * .5], [x + w * .5, y - h * .26]);
    }
    pts.push([x1, y + 200]);
    paint(pts, { wash: col, ink: null });
    paint(pts.map(([px, py]) => [px, py + 26]), { fill, fillOp: 70, bleed: .04, tex: .7, border: .6, ink: null });
  }
  function a08_pine(x, y, h, col, dk, sway, ink) {
    const w = h * .44;
    paint(rectPts(x - h * .022, y - h * .14, h * .044, h * .16), { wash: '#4A3326', ink: null });
    const tiers = [];
    for (let k = 0; k < 4; k++) {
      const ty = y - h * .1 - k * h * .21, tw = w * (1 - k * .21), top = ty - h * .34, sx = sway * (k + 1) / 4;
      tiers.push([[x - tw / 2, ty], [x - tw * .3, ty - h * .04], [x + sx, top], [x + tw * .3, ty - h * .04], [x + tw / 2, ty]]);
    }
    for (const p of tiers) paint(p, { wash: col, ink, sw: .7, curv: .12 });
    for (const p of tiers) paint([p[2], p[3], p[4], [lerp(p[2][0], p[4][0], .45), p[4][1] - h * .02]], { wash: "#7FB06A", washOp: 110, ink: null });
    paint(tiers[0].map(([px, py], i) => [px + (i === 2 ? 0 : 0), py]).concat([[x + sway, y - h * .98]]), { fill: dk, fillOp: 70, bleed: .12, tex: .6, border: .5, ink: null });
  }
  function shotForest(t, lt) {
    const trX = a08_trainFx(t), camX = clamp(trX + 180, 960, 2500) + lt * 6, wind = Math.sin(t * 1.3) * .5 + .5;
    const L = f => { push(); translate(960 - camX * f, 0); };
    // sky: dusk washes, the low sun, soft clouds
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#A4BEDC', ink: null });
    const bands = ['#B6C8E0', '#CCD0E0', '#E4D3D0', '#F2CFB2', '#F7C99E', '#F6D6B0'];
    for (let i = 0; i < 6; i++) paint(rectPts(-60, 220 + i * 70, W + 120, 700), { wash: bands[i], washOp: 150, ink: null });
    const sunX = 1260 - (camX - 960) * .08;
    paint(ellPts(sunX, 540, 190, 190, 24), { wash: "#FFE9C4", washOp: 90, ink: null });
    paint(ellPts(sunX, 540, 64, 64, 22), { wash: '#FFF3D6', ink: null });
    for (let i = 0; i < 5; i++) { const a = -2.3 + i * .38 + Math.sin(t * .3 + i) * .02; paint([[sunX, 540], [sunX + Math.cos(a) * 1600, 540 + Math.sin(a) * 1600], [sunX + Math.cos(a + .07) * 1600, 540 + Math.sin(a + .07) * 1600]], { fill: '#FFF1D0', fillOp: 40, bleed: .2, tex: .2, border: .1, ink: null }); }
    for (let i = 0; i < 5; i++) paint(ellPts(frac(i * .27 + t * .004) * 2600 - 300 - (camX - 960) * .1, 130 + (i % 3) * 70, 220, 36, 16), { fill: '#FFF6EC', fillOp: 110, bleed: .2, tex: .4, ink: null });
    // Kazan on the far horizon: soft spires + a tower, then two watercolour treelines with mist between
    L(.3);
    for (const [kx, kh, kw] of [[2050, 250, 14], [2110, 180, 44], [2180, 280, 12], [2250, 150, 80], [2320, 250, 14]]) paint([[kx - kw / 2, 650], [kx - kw / 2, 650 - kh * .8], [kx, 650 - kh], [kx + kw / 2, 650 - kh * .8], [kx + kw / 2, 650]], { wash: '#BDB2C8', washOp: 210, ink: null });
    pop();
    L(.45); a08_treeline(-800, 3400, 690, 64, 90, 170, 1, '#93A6BD', '#7488A2', wind * 3); pop();
    paint(rectPts(-60, 655, W + 120, 40), { wash: "#FBE8D6", washOp: 90, ink: null });
    L(.7); a08_treeline(-800, 3900, 760, 88, 170, 280, 7, '#5F8570', '#46695A', wind * 6); pop();
    paint(rectPts(-60, 735, W + 120, 36), { wash: "#FBEBDD", washOp: 70, ink: null });
    // main layer: meadow, fans, track, pines, station, train
    L(1);
    paint(rectPts(-800, 770, 4600, 400), { wash: '#7FAE62', fill: '#557F45', fillOp: 80, bleed: .1, tex: .7, border: .5, ink: null });
    for (let i = 0; i < 60; i++) { const fx = -600 + hash(i * 1.7) * 4000, fy = 850 + hash(i * 2.9) * 60; paint(ellPts(fx, fy, 5, 4, 6), { wash: ['#FFF3D6', '#F2B632', '#E27A92'][i % 3], ink: null }); }
    // the wall of GPU fans at the far left: they blow the train along
    paint(rectPts(-260, 60, 560, 720, 1), { wash: '#3A4450', fill: '#232A33', fillOp: 80, tex: .5, ink: INK, sw: 1 });
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) cooler(-160 + c * 170, 150 + r * 138, 60, t, { speed: 5, howl: c === 2 ? .7 : 0 });
    paint(rectPts(-260, 60, 560, 720), { fill: '#DCE6F2', fillOp: 70, bleed: .2, tex: .3, border: .2, ink: null });
    for (let i = 0; i < 12; i++) {
      const p = frac(t * .42 + i / 12), wx = 320 + p * 2900, wy = 200 + hash(i) * 560 + Math.sin(p * 8 + i) * 34, len = 260 + hash(i + 2) * 260, a = Math.sin(p * Math.PI);
      inkLine([[wx, wy], [wx + len * .35, wy - 18], [wx + len * .7, wy - 4], [wx + len, wy - 16]], 3 * a, '#FFFFFF', 'inkfine', .5);
    }
    a08_rails(-800, 3600, 800, 1.3, { bal: '#8A7A6A' });
    for (let i = 0; i < 11; i++) {                                                    // pines behind the track
      const x = 500 + i * 330 + hash(i * 7) * 120, h = 330 + hash(i + 9) * 170;
      if (Math.abs(x - 3050) < 260) continue;
      a08_pine(x, 780, h, '#3F6B4F', '#2A4A38', wind * 12 + Math.sin(t * 1.7 + i) * 4, '#22382C');
    }
    // station КАЗАНЬ
    paint(rectPts(2760, 770, 560, 30, 1), { wash: '#B9AFA0', ink: INK, sw: .9 });
    paint(rectPts(3110, 620, 14, 150), { wash: '#4A3326', ink: null });
    paint(a08_rr(2960, 560, 310, 76, 10), { wash: '#FFFDF6', ink: INK, sw: 1.4 });
    paint(rectPts(3170, 650, 130, 120, 1), { wash: '#E9D8B8', fill: '#CDB892', fillOp: 60, tex: .5, ink: INK, sw: .9 });
    paint([[3156, 654], [3235, 604], [3314, 654]], { wash: TOY.red, ink: INK, sw: .9 });
    paint(rectPts(3218, 700, 36, 70), { wash: '#6B4A2E', ink: null });
    paint(rectPts(3180, 670, 26, 22), { wash: '#FFE38A', ink: INK, sw: .5 });
    // the train (arrives 179.35, then rests with a lazy puff)
    const dist = trX - 520;
    a08_train(trX, 800, 1.35, t, { cars: 3, driver: true, dist, puffs: PUFF.filter(p => p <= t), xAt: a08_trainFx, glow: .5,
      cargo: (i, cx, ty, s) => token(cx, ty + 2, 22 * s, {}) });
    pop();
    // low foreground ferns (parallax 1.25), kept under the track line
    L(1.25);
    for (let i = 0; i < 16; i++) { const x = -400 + i * 300 + hash(i * 5) * 120; paint([[x - 90, 1090], [x - 30, 900 + hash(i) * 30], [x + 10, 980], [x + 50, 910 + hash(i + 1) * 30], [x + 100, 1090]], { wash: '#2F5A3A', fill: '#1E3A28', fillOp: 70, tex: .5, ink: null, curv: .3 }); }
    pop();
    // screen-space lettering
    const scr = x => x - camX + 960;
    letter('КАЗАНЬ', scr(3115), 598, 56, '#1E1E24', { font: ruFont(56), ink: false });
    letter('GPU × 100 000', scr(20), 40, 34, '#FFF5E2', { font: ruFont(34) });
    if (t >= 179.35) sfx('ту-ту!', scr(trX + 60), 520, 64, '#FFF5E2', t - 179.35, { life: 1.4, font: ruFont(64), stroke: TOY.red });
    glitchCut(t, L8, { k: .6, span: .06 });
  }

  chapter('rap', L1, END, [
    [L1, shotCalendar],
    [L2, shotLoading],
    [L3, shotArm],
    [L4, shotReplace],
    [L5, shotHijack],
    [L6, shotMap],
    [L7, shotGPU],
    [L8, shotForest],
  ]);
})();
