// a01_boot.js: «Жги токены» v2, chapter 1 "boot" (0–20.1), the intro (no vocals).
// Clawd, dressed for a walk (beanie + scarf), pulls the handle of his padded front door. It is a press lever: every pull on
// a strong hit slams a press somewhere (zine insets), mints a token, and the door stays shut. The wallpaper tears away
// cell by cell (0.86, 1.66, 2.93, then 4.86 / 5.51 / 6.15) to the machinery behind; the camera pulls back: his flat is an
// island in ЗАВОД ТОКЕНОВ, the door a lever chained to ПРЕСС №1. 10.99 the last pull mints THE token → hard cut →
// 11.3–18.3 we ride with it down the line (presses on the grid, the firing furnace, a wall of GPUs), 16.92 the title press
// stamps «ЖГИ ТОКЕНЫ», the token drops into the chute «В ЧАТ» → 18.3 home: it plops into his laptop as «Чем могу помочь?».
(() => {
  const INK = PAL.ink;
  const PULLS = [0.2, 0.86, 1.66, 2.93, 4.86, 5.51, 6.15, 10.99];
  const WALLPAPER = '#B7C496', WALL_DK = '#8C9D70', PLASTER = '#E4D9BE';

  // ---------- Clawd's walking outfit (body-local, drawn via clawd o.draw) ----------
  const outfit = flap => (u, sw) => {
    paint([[2.4 * u, -3.1 * u], [3.6 * u, -3.1 * u], [3.9 * u + flap * 1.6 * u, -.4 * u], [2.6 * u + flap * 1.8 * u, -.2 * u]], { wash: '#C8323A', fill: '#8E1E26', fillOp: 60, ink: INK, sw: sw * .6 });   // tail
    for (let i = 0; i < 4; i++) inkLine([[(2.7 + i * .35 + flap * 1.7) * u, -.3 * u], [(2.6 + i * .35 + flap * 2.1) * u, .5 * u]], sw * .45, '#C8323A', 'inkfine', 0);
    paint(rectPts(-5.35 * u, -3.7 * u, 10.7 * u, 1.35 * u, u * .05), { wash: '#C8323A', fill: '#8E1E26', fillOp: 60, tex: .5, ink: INK, sw: sw * .6 });
    for (const bx of [-3.4, -.4, 2.6]) paint(rectPts(bx * u, -3.7 * u, .7 * u, 1.35 * u), { wash: PAL.cream, washOp: 220, ink: null });
    const d = []; for (let i = 0; i <= 14; i++) { const a = Math.PI + i / 14 * Math.PI; d.push([Math.cos(a) * 5.1 * u, -8.2 * u + Math.sin(a) * 3.2 * u]); }
    paint(d, { wash: A2.hazard, fill: '#C79A10', fillOp: 70, tex: .5, ink: INK, sw: sw * .7 });
    paint(rectPts(-5.45 * u, -8.6 * u, 10.9 * u, 1.3 * u, u * .04), { wash: '#E0B614', ink: INK, sw: sw * .6 });
    for (let i = 0; i < 9; i++) inkLine([[(-4.9 + i * 1.22) * u, -8.5 * u], [(-4.9 + i * 1.22) * u, -7.4 * u]], sw * .35, '#9C7A0C', 'inkfine', 0);
    paint(ellPts(0, -11.7 * u, 1 * u, .95 * u, 12, u * .05), { wash: '#C8323A', fill: PAL.cream, fillOp: 60, tex: .8, ink: INK, sw: sw * .5 });
  };

  // ---------- the wallpaper wall: a 7 x 4 grid of ragged cells that tear away on the pulls ----------
  const WX0 = -250, WY0 = -150, WC = 7, WR = 4, CW = 2500 / WC, RH = 1030 / WR;
  const vtx = (i, j) => [WX0 + i * CW + (i > 0 && i < WC ? (hash(i * 13 + j * 7) - .5) * CW * .3 : 0),
                         WY0 + j * RH + (j > 0 && j < WR ? (hash(i * 5 + j * 17 + 3) - .5) * RH * .3 : 0)];
  function edge(a, b, ka) {                          // ragged points strictly between vertex a and b (same whichever way round)
    const out = [], [p, q] = ka ? [a, b] : [b, a], nx = -(q[1] - p[1]), ny = q[0] - p[0], L = Math.hypot(nx, ny) || 1;
    for (let k = 1; k < 5; k++) {
      const f = k / 5, j = (hash(p[0] * .37 + p[1] * .91 + q[0] * .13 + q[1] * .51 + k * 3.3) - .5) * 44;
      out.push([lerp(p[0], q[0], f) + nx / L * j, lerp(p[1], q[1], f) + ny / L * j]);
    }
    return ka ? out : out.reverse();
  }
  const cellPts = (i, j) => {
    const a = vtx(i, j), b = vtx(i + 1, j), c = vtx(i + 1, j + 1), d = vtx(i, j + 1);
    return [a, ...edge(a, b, true), b, ...edge(b, c, true), c, ...edge(d, c, false), d, ...edge(a, d, true)];
  };
  const CELLS = []; for (let j = 0; j < WR; j++) for (let i = 0; i < WC; i++) CELLS.push({ i, j, pts: cellPts(i, j) });
  const TEAR = { '1,1': .86, '5,1': 1.66, '5,2': 2.93, '0,1': 4.86, '1,2': 4.86, '2,1': 4.86, '6,2': 4.86, '0,2': 5.51, '2,0': 5.51, '3,0': 5.51, '4,1': 5.51, '6,1': 5.51, '1,0': 5.51, '0,3': 5.51 };
  const tearT = (i, j) => TEAR[i + ',' + j] ?? 6.15;
  function wall(t) {
    for (const c of CELLS) {
      const tt = tearT(c.i, c.j), age = t - tt;
      if (age >= .55) {                                                      // hole: plaster rim where a neighbour still hangs
        const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([di, dj]) => { const ni = c.i + di, nj = c.j + dj; return ni >= 0 && ni < WC && nj >= 0 && nj < WR && t < tearT(ni, nj); });
        if (nb) paint(c.pts, { ink: PLASTER, sw: 1.4 });
        continue;
      }
      let pts = c.pts, col = WALLPAPER;
      if (age >= 0) {                                                        // the sheet rips off and flies away from the door
        const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
        const dx = cx - 1095, dy = cy - 570, L = Math.hypot(dx, dy) || 1, p = easeOut(age / .55), sc = 1 - .45 * p;
        const ox = dx / L * 700 * p, oy = dy / L * 500 * p + 500 * age * age, rot = (hash(c.i * 3 + c.j) - .5) * 5 * p;
        pts = rotPts(pts.map(([x, y]) => [cx + (x - cx) * sc + ox, cy + (y - cy) * sc + oy]), cx + ox, cy + oy, rot);
        col = mixCol(WALLPAPER, PLASTER, p);
      }
      paint(pts, { wash: col, fill: WALL_DK, fillOp: 60, tex: .5, border: .5, ink: age >= 0 ? INK : null, sw: .8 });
      if (age < 0) {                                                         // stripes + little diamonds of the pattern
        const x0 = WX0 + c.i * CW, y0 = WY0 + c.j * RH;
        for (const f of [.28, .72]) inkLine([[x0 + CW * f, y0 + 22], [x0 + CW * f, y0 + RH - 22]], .7, WALL_DK, 'inkfine', 0);
        paint([[x0 + CW / 2, y0 + RH * .38], [x0 + CW / 2 + 14, y0 + RH / 2], [x0 + CW / 2, y0 + RH * .62], [x0 + CW / 2 - 14, y0 + RH / 2]], { wash: '#E8E0B8', washOp: 200, ink: null });
      }
    }
    if (t >= .2 && t < 4.86) {                                               // plaster cracks from the first slam
      const k = easeOut((t - .2) / .12);
      for (let n = 0; n < 5; n++) {
        const [sx, sy] = [[906, 250], [1284, 250], [906, 520], [1284, 420], [1095, 236]][n], pts = [[sx, sy]];
        for (let s = 1; s < 5; s++) pts.push([sx + (n % 2 ? 1 : -1) * s * 38 * k + (hash(n * 9 + s) - .5) * 40, sy - s * 30 * k * (n === 4 ? 1.3 : .6) + (hash(n + s * 3) - .5) * 30]);
        inkLine(pts, .9, INK, 'inkfine', .2);
      }
    }
  }

  // ponytail: conveyor() cost grows with its width, so only the visible stretch is drawn. The start snaps to whole item
  // gaps (gap is a multiple of the 83.6 px roller pitch) so rollers and items never jump; item(ix, y, absIndex).
  function belt(X0, X1, y, tc, o, vx0, vx1, item) {
    const g = o.gap, a = Math.max(X0, X0 + Math.floor((vx0 - X0) / g) * g), b = Math.min(X1, vx1);
    if (b - a < 60) return;
    const w = b >= X1 ? X1 - a : 38 + Math.ceil((b - a) / 83.6) * 83.6, di = Math.round((a - X0) / g);
    conveyor(a, y, w, tc, { ...o, items: [(ix, yy, i) => item(ix, yy, i + di)] });
  }

  // ---------- the factory hall behind the flat ----------
  const PRESS_G = [1950, -320, 800, 1000];                                       // ПРЕСС №1: the door lever drives it, bed on the belt (560)
  function hall(t, vx0, vx1) {
    const open = t >= 4.86;
    if (open) paint(rectPts(-1400, -1300, 4800, 3200), { wash: A2.gunDk, fill: '#101216', fillOp: 120, tex: .5, ink: null });
    else for (const c of CELLS) if (t >= tearT(c.i, c.j)) paint(c.pts, { wash: A2.gunDk, ink: null });
    if (open) {
      for (let k = 0; k < 10; k++) {                                          // far wall: girders + braces
        const gx = -1000 + k * 480;
        paint(rectPts(gx, -1200, 46, 2600), { wash: '#262A31', ink: '#15171B', sw: .6 });
        if (k < 9) { inkLine([[gx + 46, -700], [gx + 480, -300]], .6, '#3A4048', 'inkfine', 0); inkLine([[gx + 46, -300], [gx + 480, -700]], .6, '#3A4048', 'inkfine', 0); }
      }
      for (let k = 0; k < 7; k++) {                                           // sodium lamps flicker on one by one
        const lx = -700 + k * 620, ly = -560, t0 = 6.4 + k * .5, a = t - t0;
        const on = a < 0 ? 0 : a < .45 ? (hash(Math.floor(t * 24) + k * 7) > .45 ? 1 : .15) : 1;
        inkLine([[lx, -1300], [lx, ly - 30]], .6, '#3A4048', 'inkfine', 0);
        if (on > .2) paint([[lx - 40, ly], [lx + 40, ly], [lx + 360, 1300], [lx - 360, 1300]], { wash: A2.sodium, washOp: 44 * on, ink: null });
        paint([[lx - 34, ly - 34], [lx + 34, ly - 34], [lx + 70, ly + 6], [lx - 70, ly + 6]], { wash: A2.steel, ink: INK, sw: .6 });
        paint(ellPts(lx, ly + 10, 26, 13, 12), { wash: on > .2 ? '#FFE3A8' : '#4A4238', ink: null });
        if (on > .2) paint(ellPts(lx, ly + 20, 90, 60, 14), { wash: A2.sodium, washOp: 90 * on, ink: null });
      }
    }
    if (t >= .86) { gear(270, 235, 118, t, { speed: .25 }); gear(430, 345, 70, t, { speed: -.42, col: A2.rust }); }
    if (open) { gear(-420, 700, 150, t, { speed: -.15 }); gear(1700, 760, 90, t, { speed: .3, col: A2.rust }); }
    if (open || t >= 2.93) belt(-1000, 2900, 560, t, { speed: 160, gap: 250.8, legs: 0 }, open ? vx0 : 1450, open ? vx1 : 2050,
      (ix, y, i) => token(ix, y - 34, 34, { spin: t * .3 + hash(i * 3.7), rot: (hash(i) - .5) * .3 }));
    if (open) {
      press(-700, 90, 340, 460, t, [0.2, 2.93, 4.86], { label: 'ПРЕСС 4', seed: 3 });
      press(-250, 150, 290, 400, t, [0.86, 5.51], { label: 'ПРЕСС 2', seed: 5 });
    }
    if (t >= 1.66) press(1570, 20, 290, 360, t, [1.66, 6.15], { label: 'ПРЕСС 3', seed: 7 });
    if (open) {
      const [gx, gy, gw, gh] = PRESS_G, yk = hitK(t, PULLS, .2);
      // the chain from the door lever over a pulley to ПРЕСС №1
      const off = PULLS.reduce((s, h) => s + (t >= h ? 30 : 0), 0) + yk * 18;
      const cpts = [[1095, 236], [1095, -200], [gx + 60, -200], [gx + 60, gy + 20]];
      for (let s = 0; s < 3; s++) {
        const [a, b] = [cpts[s], cpts[s + 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        inkLine([a, b], 1.6, A2.steelLt, 'ink', 0);
        for (let d = (off % 34); d < L; d += 34) { const f = d / L; paint(ellPts(lerp(a[0], b[0], f), lerp(a[1], b[1], f), 9, 9, 8), { ink: A2.steelLt, sw: .5 }); }
      }
      paint(ellPts(1095, -200, 36, 36, 16), { wash: A2.steel, ink: INK, sw: .7 });
      press(gx, gy, gw, gh, t, [0.2, 10.99], { label: 'ПРЕСС 1', seed: 11 });
    }
  }

  // ---------- the flat: floor island, coat stand, bulb, the padded door ----------
  function island(t) {
    paint(rectPts(-160, 988, 2320, 70, 2), { wash: '#6B6760', fill: '#4A4744', fillOp: 90, tex: .6, ink: INK, sw: .8 });
    for (const px of [120, 900, 1700]) paint(rectPts(px, 1056, 60, 700), { wash: A2.gunmetal, ink: INK, sw: .6 });
    paint(rectPts(-160, 880, 2320, 110, 1), { wash: '#9A6A3E', fill: '#6E4526', fillOp: 90, tex: .6, border: .4, ink: INK, sw: .9 });
    for (let k = 0; k < 38; k++) { const bx = -140 + k * 62; inkLine([[bx, 884 + (k % 2) * 50], [bx, 934 + (k % 2) * 50]], .5, '#5A3820', 'inkfine', 0); }
    inkLine([[-160, 934], [2160, 934]], .5, '#5A3820', 'inkfine', 0);
    // coat stand with an umbrella
    inkLine([[330, 880], [330, 470]], 2.4, '#4A2E22', 'ink', 0);
    for (const s of [-1, 1]) inkLine([[330, 880], [330 + s * 60, 900]], 1.6, '#4A2E22', 'ink', 0);
    for (const s of [-1, 1]) inkLine([[330, 500], [330 + s * 40, 480], [330 + s * 46, 500]], 1.2, '#4A2E22', 'ink', .4);
    paint([[290, 505], [372, 505], [392, 700], [270, 700]], { wash: '#3B4A6B', fill: '#27324A', fillOp: 70, tex: .5, ink: INK, sw: .7 });   // coat
    inkLine([[380, 880], [398, 640], [410, 626]], 1.4, '#2B2233', 'ink', .4);                                                      // umbrella
    paint([[392, 640], [412, 860], [372, 860]], { wash: '#2E2E38', ink: INK, sw: .5 });
    // doormat
    paint(rectPts(900, 872, 420, 16, 1), { wash: '#6E5A3A', ink: INK, sw: .5 });
  }
  function bulb(t) {
    let a = 0; for (const h of PULLS) if (t >= h) a += .22 * Math.exp(-(t - h) / 1.1) * Math.sin((t - h) * 6);
    const bx = 780 + Math.sin(a) * 300, by = -150 + Math.cos(a) * 300;
    inkLine([[780, -150], [bx, by]], .9, INK, 'inkfine', 0);
    paint(ellPts(bx, by + 30, 150, 150, 16), { fill: '#FFE9A8', fillOp: 70, bleed: .3, tex: .2, ink: null });
    paint(ellPts(bx, by + 24, 16, 22, 12), { wash: '#FFF3C8', ink: INK, sw: .5 });
  }
  const DOOR = [930, 260, 330, 620];
  function door(t, yank) {
    const [x, y, w, h] = DOOR, rat = shakeXY(t, 4 * yank)[0];
    paint(rectPts(x - 26, y - 26, w + 52, h + 26, 1), { wash: '#4A2E22', fill: '#2E1A12', fillOp: 90, tex: .6, ink: INK, sw: 1 });
    push(); translate(rat, 0);
    paint(rectPts(x, y, w, h, 1), { wash: '#7A2E26', fill: '#4E1A16', fillOp: 110, tex: .7, border: .5, ink: INK, sw: .9 });
    // quilted dermantine: diagonal seams through brass nails
    const nx = 5, ny = 8, dx = w / nx, dy = h / ny, nail = (i, j) => [x + dx * (i + (j % 2 ? 0 : .5)), y + dy * (j + .5)];
    for (let d = -ny; d < nx + ny; d++) {
      const p1 = [], p2 = [];
      for (let j = 0; j < ny; j++) { const i1 = d + Math.floor(j / 2), i2 = d - Math.ceil(j / 2); if (i1 >= 0 && i1 < nx) p1.push(nail(i1, j)); if (i2 >= 0 && i2 < nx) p2.push(nail(i2, j)); }
      for (const p of [p1, p2]) if (p.length > 1) inkLine(p, .55, '#3A120E', 'inkfine', 0);
    }
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const [px, py] = nail(i, j); if (px > x + 6 && px < x + w - 6) paint(ellPts(px, py, 4, 4, 6), { wash: '#D9B45A', ink: null }); }
    paint(ellPts(x + w / 2, y + h * .17, 34, 22, 14), { wash: '#D9B45A', ink: INK, sw: .5 });
    letter('42', x + w / 2, y + h * .17, 26, '#4A2E22', { ink: false });
    paint(ellPts(x + w / 2, y + h * .3, 9, 9, 10), { wash: '#1A1A1A', ink: '#D9B45A', sw: .5 });
    // «НА СЕБЯ» sticker and the lever handle
    paint(rotPts(rectPts(x + 30, y + h * .5, 120, 38, 1), x + 90, y + h * .5 + 19, -.04), { wash: '#F4F1E8', ink: INK, sw: .4 });
    letter('НА СЕБЯ', x + 90, y + h * .5 + 19, 22, '#C8323A', { font: ruFont(22), ink: false, rot: -.04 });
    const px = x + 90, py = 691, a = .5 * yank;
    paint(rrPts(px - 14, py - 34, 28, 80, 10), { wash: '#C9A24A', ink: INK, sw: .5 });
    paint(rotPts(rrPts(px - 76, py - 9, 84, 18, 8), px, py, -a), { wash: '#E2BD5A', fill: '#A8741A', fillOp: 60, ink: INK, sw: .6 });
    paint(ellPts(px, py, 11, 11, 10), { wash: '#A8741A', ink: INK, sw: .4 });
    pop();
  }
  // Clawd yanking the lever: winds up just before each pull, snaps back on the hit
  function clawdPull(t, o = {}) {
    let yank = hitK(t, PULLS, .22), wind = 0;
    for (const h of PULLS) if (h - t > 0 && h - t < .14) wind = 1 - (h - t) / .14;
    const flap = Math.sin(t * 9) * .15 + yank * .5;
    clawd(652 - yank * 4 + wind * 6, 880, 42, { aR: .02 - yank * .3, aL: .35 + yank * .5, rot: -.08 * yank + .03 * wind, sq: -.05 * yank, draw: outfit(flap), ...o });
    return yank;
  }

  // ---------- zine insets: "somewhere a press slams" ----------
  const INSETS = [[0.2, 1250, 70, 580, 400, .05, 'ПРЕСС 1'], [0.86, 90, 80, 470, 330, -.06, 'ПРЕСС 2'], [1.66, 1340, 110, 450, 320, .04, 'ПРЕСС 3'], [2.93, 120, 90, 470, 330, -.05, 'ПРЕСС 4']];
  function insets(t) {
    for (const [h, x, y, w, hh, rot, lab] of INSETS) {
      const age = t - h; if (age < 0 || age > .62) continue;
      const k = age < .07 ? lerp(1.35, 1, easeOut(age / .07)) : 1, out = easeIn(seg(age, .5, .62));
      push(); translate(x + w / 2, y + hh / 2 - out * 700); scale(k); translate(-(x + w / 2), -(y + hh / 2));
      const [ix, iy, iw, ih] = zineCut(x, y, w, hh, { rot, seed: h * 10, dots: false });
      push(); translate(ix + iw / 2, iy + ih / 2); rotate(rot); translate(-(ix + iw / 2), -(iy + ih / 2));
      paint(rectPts(ix + 10, iy + 10, iw - 20, ih - 20), { wash: A2.gunDk, fill: A2.gunmetal, fillOp: 90, tex: .5, ink: null });
      press(ix + iw * .22, iy + ih * .12, iw * .56, ih * .8, t, [h], { label: lab, seed: h * 7, steam: true });
      pop(); pop();
      sfx(h === .2 ? 'БАМ!' : '+1 ₮', x + w * (h === .2 ? .2 : .82), y + hh * .2 - out * 700, h === .2 ? 110 : 64, A2.hazard, age, { font: ruFont(h === .2 ? 110 : 64), life: .6, stroke: INK, rot: -.12 });
    }
  }

  // ---------- shot 1 (0–11.3): the door, the torn flat, the reveal ----------
  function shotDoor(t) {
    const zoom = kf(t, [[0, 1.2], [4.84, 1.12], [4.94, 1.0], [5.49, .98], [5.59, .88], [6.13, .86], [6.25, .76], [7, .72], [10.4, .52], [10.99, .52], [11.3, .74]]);
    const [cx, cy] = kf(t, [[0, [850, 590]], [4.8, [870, 575]], [6.15, [960, 520]], [10.4, [1230, 250]], [10.99, [1230, 250]], [11.3, [2150, 360]]]);
    const hk = hitK(t, PULLS, .12), big = Math.exp(-Math.max(0, t - .2) / .2) * (t >= .2 ? 1 : 0);
    const [sx, sy] = shakeXY(t, 14 * hk + 34 * big + (t >= 10.99 ? 30 * Math.exp(-(t - 10.99) / .25) : 0));
    camBegin(cx + sx / zoom, cy + sy / zoom, zoom * (1 + .04 * hk));
    hall(t, cx - 1000 / zoom, cx + 1000 / zoom);
    wall(t);
    bulb(t);
    island(t);
    const yank = hitK(t, PULLS, .22);
    door(t, yank);
    siren(1095, 236, t, { on: seg(t, 7.3, 7.7), r: 30, len: 1100, speed: 1.1 });
    const eyes = t < .2 ? 'narrow' : t < 4.86 ? (t < 2.93 ? 'scared' : 'angry') : t < 10.4 ? 'look' : 'angry';
    const mouth = t < .2 ? 'flat' : t < 2.93 ? 'o' : t < 4.86 ? 'wobble' : t < 10.4 ? 'O' : 'flat';
    clawdPull(t, { eyes, mouth, lookX: Math.sin(t * 2.2) * 1.2, lookY: -.6, emote: t >= .2 && t < 1 ? '!' : t >= 6.3 && t < 8 ? '!?' : undefined, emoteK: t < 1 ? (t - .2) * 3 : (t - 6.3) * 3 });
    if (t >= 10.99) sfx('+1 ₮', 2350, 330, 140, A2.hazard, t - 10.99, { font: ruFont(140), life: 1, stroke: INK });
    camEnd();
    insets(t);
    flash(.6 * Math.exp(-Math.max(0, t - .2) / .1) * (t >= .2 ? 1 : 0), '#FFF3C8');
    if (t >= 10.99) flash(.45 * Math.exp(-(t - 10.99) / .1), '#FFD9A0');
  }

  // ---------- shot 2 (11.3–18.3): riding the token down the line ----------
  const GAP = 501.6, BX0 = -200 - 2.5 * GAP, HERO = 2, S1 = 4134, BEND = 4800;
  const SK = [[11.3, 0], [16.75, S1], [17.25, S1], [18.0, 5000], [18.3, 5360]];
  const sOf = t => kf(t, SK, x => x);
  const tOfS = s => { for (let i = 1; i < SK.length; i++) { const [a, va] = SK[i - 1], [b, vb] = SK[i]; if (s <= vb && vb > va) return a + (b - a) * (s - va) / (vb - va); } return 1e9; };
  const slamsAt = px => { const out = []; for (let i = -12; i < 20; i++) { const s = px - BX0 - GAP / 2 - i * GAP; if (s > 0 && s < 5000) out.push(tOfS(s)); } return out; };
  const P1X = 680, P2X = 1404;                                            // press centres; P2 sits half a gap off → off-beat slams
  const P1H = slamsAt(P1X), P2H = slamsAt(P2X), TITLE_X = -200 + S1, TITLE = 16.92;
  const FURN = [1720, 2600], GPUS = [2700, 3640];
  function lineShot(t) {
    const s = sOf(t), heroX = -200 + s;
    const fallK = clamp((heroX - BEND) / 360), fx = heroX > BEND ? BEND + (heroX - BEND) * .55 : heroX, fy = 700 - 44 + fallK * fallK * 420;
    const zoom = kf(t, [[11.3, 1.45], [16.1, 1.3], [16.6, .8], [17.3, .8], [17.9, 1.15], [18.3, 1.9]]);
    const rot = kf(t, [[11.3, 0], [16.1, -.07], [16.6, 0], [17.3, 0], [18.3, .12]]);
    const cx = kf(t, [[11.3, heroX + 160], [16.1, heroX + 160], [16.7, TITLE_X], [17.3, TITLE_X], [17.9, fx], [18.3, fx]]);
    const cy = kf(t, [[11.3, 590], [16.1, 560], [16.6, 300], [17.3, 300], [17.9, fy - 60], [18.3, fy]]);
    const tk = hitK(t, [TITLE], .2), pk = hitK(t, P1H.concat(P2H), .1) * (t < 16.3 ? 1 : 0), [sx, sy] = shakeXY(t, 30 * tk + 6 * pk);
    const cxx = t < 16.1 ? heroX + 160 : cx;                               // lock on the hero while riding
    // far layer (parallax .35): dark machinery silhouettes and lamp pools
    camBegin(cxx * .35 + sx, 540 + (cy - 540) * .35 + sy, .85, rot);
    paint(rectPts(-1400, -1400, 5000, 4000), { wash: '#15171B', fill: A2.gunDk, fillOp: 120, tex: .5, ink: null });
    for (let k = -2; k < 7; k++) {
      const gx = k * 460;
      paint(rectPts(gx, -900, 120, 2000), { wash: '#1E2127', ink: null });
      gear(gx + 230, 220 + (k % 2) * 260, 150 + (k % 3) * 40, t, { speed: (k % 2 ? -.12 : .1), col: '#2A2E35', hole: '#15171B' });
      paint([[gx + 200, -300], [gx + 260, -300], [gx + 520, 1400], [gx - 60, 1400]], { wash: A2.sodium, washOp: 26, ink: null });
      paint(ellPts(gx + 230, -290, 30, 14, 10), { wash: '#FFE3A8', ink: null });
    }
    camEnd();
    camBegin(cxx + sx, cy + sy, zoom, rot);
    // furnace housing (behind the belt)
    paint(rectPts(FURN[0], 180, FURN[1] - FURN[0], 520, 2), { wash: A2.rust, fill: '#6E2E18', fillOp: 110, tex: .7, border: .5, ink: INK, sw: 1 });
    for (let r = 0; r < 9; r++) for (let q = 0; q < 12; q++) if ((r + q) % 3 === 0) inkLine([[FURN[0] + q * 74 + (r % 2) * 37, 200 + r * 56], [FURN[0] + q * 74 + (r % 2) * 37 + 60, 200 + r * 56]], .5, '#4A1C10', 'inkfine', 0);
    paint(rrPts(FURN[0] + 90, 360, FURN[1] - FURN[0] - 180, 380, 170), { wash: '#1A0E08', ink: INK, sw: .9 });
    fire((FURN[0] + FURN[1]) / 2, 700, 700, 330, t, { k: 1, seed: 4 });
    letter('ОБЖИГ', (FURN[0] + FURN[1]) / 2, 260, 80, A2.hazard, { font: ruFont(80), stroke: INK });
    // GPU wall
    paint(rectPts(GPUS[0], 60, GPUS[1] - GPUS[0], 620, 1), { wash: '#101418', ink: INK, sw: .8 });
    for (let r = 0; r < 6; r++) for (let q = 0; q < 6; q++) {
      const gx = GPUS[0] + 30 + q * 152, gy = 90 + r * 96, on = hash(q * 7 + r * 3 + Math.floor(t * 6)) > .3;
      paint(rectPts(gx, gy, 140, 76), { wash: TK.pcb, fill: TK.greenDk, fillOp: 70, tex: .5, ink: INK, sw: .4 });
      for (const fx of [gx + 38, gx + 102]) { paint(ellPts(fx, gy + 38, 24, 24, 10), { wash: TK.soot, ink: null }); inkLine([[fx + Math.cos(t * 20 + q) * 20, gy + 38 + Math.sin(t * 20 + q) * 20], [fx - Math.cos(t * 20 + q) * 20, gy + 38 - Math.sin(t * 20 + q) * 20]], .6, TK.steelLt, 'inkfine', 0); }
      paint(ellPts(gx + 128, gy + 10, 5, 5, 6), { wash: on ? TK.led : '#1E3A28', ink: null });
    }
    letter('1000 GPU · ЗАГРУЗКА 100%', (GPUS[0] + GPUS[1]) / 2, 20, 50, TK.led, { font: ruFont(50), stroke: INK });
    // the belt: its travel is the hero's travel, so everything on it stops while the title press works
    belt(BX0, BEND, 700, s / 700, { speed: 700, gap: GAP, legs: 200 }, cxx - 1200 / zoom, cxx + 1200 / zoom, (ix, y, i) => {
      const hero = i === HERO, r = hero ? 54 : 32, heat = ix > FURN[0] && ix < FURN[1] + 300 ? Math.sin(clamp((ix - FURN[0]) / (FURN[1] + 300 - FURN[0])) * Math.PI) : 0;
      token(ix, y - r, r, { spin: hero ? 0 : t * .6 + hash(i), glow: hero ? .9 : heat * .8 });
      if (hero && heat > .1) paint(ellPts(ix, y - r, r, r, 16), { wash: A2.sodium, washOp: 150 * heat, ink: null });
    });
    press(P1X - 170, 700 - 460 * .88, 340, 460, t, P1H, { label: 'ЧЕКАНКА', token: false, seed: 21 });
    press(P2X - 170, 700 - 460 * .88, 340, 460, t, P2H, { label: 'ЧЕКАНКА', token: false, seed: 23 });
    press(TITLE_X - 380, 700 - 1000 * .88, 760, 1000, t, [TITLE], { token: false, seed: 29 });
    // end of the line: a chute «В ЧАТ»
    paint([[BEND + 80, 760], [BEND + 520, 760], [BEND + 380, 1000], [BEND + 220, 1000]], { wash: A2.steel, fill: A2.gunmetal, fillOp: 90, tex: .5, ink: INK, sw: .9 });
    paint(ellPts(BEND + 300, 762, 220, 36, 20), { wash: '#08090B', ink: INK, sw: .7 });
    hazard(BEND + 90, 720, 420, 26);
    letter('В ЧАТ ↓', BEND + 300, 640, 70, A2.hazard, { font: ruFont(70), stroke: INK });
    if (heroX > BEND) token(fx, fy, 54, { glow: .9, spin: fallK * 1.5 });
    // foreground: hazard posts whipping past
    for (let k = -1; k < 12; k++) {
      const px = k * 620 + 130;
      if (Math.abs(px - cxx) > 1700) continue;
      paint(rectPts(px, 780, 46, 400), { wash: A2.gunDk, ink: INK, sw: .8 });
      hazard(px, 780, 46, 90);
    }
    camEnd();
    stamp('ЖГИ ТОКЕНЫ', 960, 190, 160, t, TITLE, { col: A2.hazard, rot: -.05, punch: .03 });
    flash(.3 * tk * (t >= TITLE ? 1 : 0), '#FFF3C8');
  }

  // ---------- shot 3 (18.3–20.1): home, the laptop answers ----------
  const REPLY = 'Чем могу помочь?';
  function homeShot(t) {
    camBegin(960, 540, 1 + .03 * seg(t, 18.3, 20.1));
    paint(rectPts(-60, -60, W + 120, 900), { wash: WALLPAPER, fill: WALL_DK, fillOp: 60, tex: .5, ink: null });
    for (let k = 0; k < 12; k++) inkLine([[k * 180 + 40, -40], [k * 180 + 40, 780]], .7, WALL_DK, 'inkfine', 0);
    paint(rectPts(-60, 780, W + 120, 400), { wash: '#6E4526', fill: '#4A2E1A', fillOp: 90, tex: .6, ink: null });           // desk
    inkLine([[-60, 782], [W + 60, 782]], 1.2, INK, 'ink', 0);
    // laptop
    const sx = 520, sy = 150, sw = 840, sh = 560;
    paint(rrPts(sx - 24, sy - 24, sw + 48, sh + 48, 26, 1), { wash: '#2A2D33', ink: INK, sw: 1 });
    paint(rectPts(sx, sy, sw, sh), { wash: '#FBF8F2', ink: null });
    paint(rectPts(sx, sy, sw, 64), { wash: '#EFE8DC', ink: null });
    paint(rrPts(sx + 20, sy + 14, 36, 36, 8), { wash: PAL.clay, ink: INK, sw: .4 });
    letter('Claude', sx + 72, sy + 33, 30, '#33333A', { font: '30px "Helvetica Neue", Arial, sans-serif', align: 'left', ink: false });
    paint([[sx - 90, 782], [sx + sw + 90, 782], [sx + sw + 30, 736], [sx - 30, 736]], { wash: '#8A95A1', fill: A2.steel, fillOp: 70, ink: INK, sw: .9 });
    // the token drops in from above and splashes into the screen
    paint(rrPts(sx + 40, sy + sh - 86, sw - 80, 60, 24), { wash: '#FFFFFF', ink: '#B8B2A8', sw: .5 });
    letter('Напишите сообщение…', sx + 70, sy + sh - 56, 26, '#A8A29A', { font: ruFont(26), align: 'left', ink: false });
    const drop = seg(t, 18.3, 18.56), land = t - 18.56, px = sx + 420, py = sy + 250;
    if (land < 0) token(px, lerp(40, py, drop * drop), 54, { glow: .9, spin: drop * 2 });
    else if (land < .5) for (let q = 0; q < 3; q++) { const r = (land - q * .08) * 700; if (r > 0) paint(ellPts(px, py, r, r * .5, 24), { ink: A2.sodium, sw: 1.4 * (1 - land * 2) }); }
    if (land >= .06) {
      const k = backOut(clamp((land - .06) / .2)), bw = 700, bh = 140, bx = sx + 100, by = sy + 180;
      push(); translate(bx, by + bh / 2); scale(k); translate(-bx, -(by + bh / 2));
      paint(rrPts(bx, by, bw, bh, 36, 1), { wash: '#EDE3FF', ink: INK, sw: .7 });
      paint(rrPts(bx - 70, by + 36, 54, 54, 12), { wash: PAL.clay, ink: INK, sw: .5 });
      pop();
      const n = Math.floor(clamp((land - .22) / .4) * REPLY.length);
      if (k > .9) letter(REPLY.slice(0, n) + (n < REPLY.length && frac(t * 6) < .5 ? '▌' : ''), bx + 40, by + bh / 2, 58, '#1E1E24', { font: ruFont(58), align: 'left', ink: false });
      if (land > .75) letter('ответ стоил: 1 токен', bx + 44, by + bh + 40, 30, '#8A8A95', { font: ruFont(30), align: 'left', ink: false });
    }
    // Clawd, still in beanie and scarf, looking in from the right
    clawd(1620, 900, 40, { eyes: land > 1 ? 'narrow' : 'look', lookX: -1.2, lookY: .2, mouth: 'flat', aL: .1, aR: .1, draw: outfit(Math.sin(t * 3) * .05) });
    camEnd();
    glitchCut(t, 20.1);
  }

  chapter('boot', 0, 20.1, [[0, shotDoor], [11.3, lineShot], [18.3, homeShot]]);
})();
