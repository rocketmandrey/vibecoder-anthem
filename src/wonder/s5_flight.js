// s5_flight.js: segment E (21.25 – 28.75): ink burst → ring tunnel → warp → beam → rocket → arc/Moon → Earth-rise → push-in → Julia zoom → soup bubble.
(() => {
  const T0 = 21.25, T1 = 28.75, CX = W / 2, CY = H / 2;
  const { mono, sstep, rng, hash } = K;
  const fr = n => (n - 1) / 24;
  const NAVY = '#05061A';
  const clamp01 = x => Math.min(1, Math.max(0, x));
  const L = (a, b, k) => a + (b - a) * k;
  const rgb = (r, g, b, a = 1) => `rgba(${r | 0},${g | 0},${b | 0},${a})`;

  // ---------- static caches ----------
  let STARS = null, SPARK = null, STREAK = null, MOON = null, FALL = null, WARP = null;
  const init = () => {
    if (STARS) return;
    let r = rng(5);
    STARS = Array.from({ length: 460 }, () => ({ x: r() * W, y: r() * H, s: r() < .12 ? 2.4 : 1.3, k: .35 + .65 * r(), cross: r() < .08 }));
    r = rng(11);
    const pal = [[255, 190, 90], [255, 120, 190], [210, 190, 255], [255, 240, 210], [255, 150, 120]];
    WARP = Array.from({ length: 170 }, () => ({ a: r() * 6.283, r0: 30 + r() * 520, l: 8 + r() * 46, jit: (r() - .5) * .9, c: pal[Math.floor(r() * 5)], w: 1 + r() * 1.4, ph: r() }));
    SPARK = Array.from({ length: 70 }, () => ({ x: r() * W, y: r() * H, a: r() * 6.283, l: 14 + r() * 40, c: pal[Math.floor(r() * 5)] }));
    FALL = Array.from({ length: 110 }, () => ({ x: r() * W, y0: r() * 2000, l: 40 + r() * 260, v: 1500 + r() * 2600, a: .12 + r() * .3, c: r() < .15 ? '230,210,255' : '170,170,220' }));
    // moon sheet 1920 x 420 (top = limb peak line)
    MOON = K.canvas(W, 420); const g = MOON.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 420); gr.addColorStop(0, '#B4B4BE'); gr.addColorStop(.35, '#7C7C86'); gr.addColorStop(1, '#5F5F6B'); g.fillStyle = gr; g.fillRect(0, 0, W, 420);
    r = rng(23); g.lineCap = 'round';
    for (let i = 0; i < 1400; i++) { const x = r() * W, y = r() * 420, l = 8 + r() * 26; g.strokeStyle = `rgba(${r() < .5 ? '60,60,72' : '200,200,212'},${.08 + r() * .12})`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y + l * .05); g.stroke(); }
    const cr = [[220, 120, 80, 18], [540, 70, 30, 9], [900, 200, 70, 20], [1130, 40, 30, 9], [1470, 130, 70, 20], [1700, 200, 60, 16], [300, 250, 120, 30], [740, 330, 100, 24], [1250, 330, 130, 30], [1600, 300, 90, 20], [60, 190, 50, 12], [1860, 110, 40, 12], [980, 90, 50, 12]];
    for (const [x, y, rx, ry] of cr) { g.fillStyle = 'rgba(70,70,82,.8)'; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(205,205,218,.7)'; g.lineWidth = 2.5; g.beginPath(); g.ellipse(x, y + 2, rx, ry, 0, .15, Math.PI - .15); g.stroke(); g.strokeStyle = 'rgba(40,40,52,.8)'; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, rx, ry, 0, Math.PI + .2, 6.1); g.stroke(); }
  };

  const starField = (c, a = 1, cross = true) => {
    if (a <= 0) return; const g0 = c.globalAlpha; c.fillStyle = '#FFF2DA';
    for (const s of STARS) { c.globalAlpha = g0 * a * s.k; c.fillRect(s.x, s.y, s.s, s.s); if (cross && s.cross) { c.fillRect(s.x - 5, s.y + .5, 12, 1); c.fillRect(s.x + .5, s.y - 5, 1, 12); } }
    c.globalAlpha = g0;
  };
  const glow = (c, x, y, r, col, a = 1) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgb(...col, a)); g.addColorStop(.35, rgb(...col, a * .35)); g.addColorStop(1, rgb(...col, 0)); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); };
  const ell = (c, x, y, rx, ry, fill, ink, lw = 3) => { c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, 7); if (fill) { c.fillStyle = fill; c.fill(); } if (ink) { c.strokeStyle = ink; c.lineWidth = lw; c.stroke(); } };

  // ---------- A. ink burst ----------
  const burst = c => {
    c.fillStyle = '#F6F2E6'; c.fillRect(0, 0, W, H); const r = rng(3); c.fillStyle = '#1A1230';
    for (let i = 0; i < 46; i++) { const a = i / 46 * 6.283 + (r() - .5) * .1, l = (r() < .5 ? 700 + r() * 500 : 240 + r() * 420), hw = 3 + r() * 9, r0 = 46, ca = Math.cos(a), sa = Math.sin(a);
      c.beginPath(); c.moveTo(CX + ca * r0 - sa * hw * .5, CY + sa * r0 + ca * hw * .5); c.quadraticCurveTo(CX + ca * l * .35 - sa * hw, CY + sa * l * .35 + ca * hw, CX + ca * l, CY + sa * l); c.quadraticCurveTo(CX + ca * l * .35 + sa * hw, CY + sa * l * .35 - ca * hw, CX + ca * r0 + sa * hw * .5, CY + sa * r0 - ca * hw * .5); c.fill(); }
    ell(c, CX, CY, 20, 19, '#F6F2E6', '#1A1230', 5);
  };

  // ---------- B. ring tunnel (edge radii in px along x, measured per frame from 513) ----------
  const tab = (n0, arr, extra) => { const k = arr.map((v, i) => [fr(n0 + i), v]); const lv = arr[arr.length - 1]; k.push([fr(n0 + arr.length + 2), lv * extra]); return mono(k); };
  const RD = tab(513, [25, 45, 72, 100, 138, 172, 214, 257, 328, 382, 440, 502, 570, 640, 712, 788, 865, 940, 1020], 1.4);
  const RO0 = tab(513, [50, 75, 111, 155, 187, 238, 293, 355, 449, 529, 609, 695, 785, 881, 980, 1090], 1.5);
  const RI1 = tab(513, [60, 95, 140, 178, 243, 298, 356, 419, 521, 599, 681, 768, 855, 950, 1045], 1.5);
  const RO1 = tab(513, [85, 130, 183, 236, 323, 399, 476, 563, 691, 794, 903, 1010, 1120], 1.5);
  const RI2 = tab(513, [150, 180, 239, 298, 360, 429, 503, 582, 699, 804, 915, 1030], 1.5);
  const RO2 = tab(513, [171, 234, 306, 384, 465, 553, 650, 752, 893, 1000], 1.5);
  const RI3 = tab(513, [230, 300, 380, 461, 540, 632, 731, 836, 960, 1080], 1.5);
  const RO3 = tab(513, [285, 372, 468, 571, 670, 785, 908, 1035], 1.5);
  const RI4 = tab(513, [331, 430, 536, 640, 745, 821, 946, 1070], 1.5);
  const RO4 = tab(513, [383, 497, 625, 754, 838, 960, 1090], 1.5);
  const INK = 'rgba(25,12,40,.85)';
  const rings = (c, t) => {
    const k = 1.0, dk = sstep(fr(513), fr(523), t);
    const bg = c.createRadialGradient(CX, CY, 100, CX, CY, 1000); bg.addColorStop(0, '#4A1D66'); bg.addColorStop(1, '#2A1048'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
    starField(c, .8); c.globalAlpha = 1;
    const asp = .95, wd = sstep(21.4, 21.75, t);
    const E = (rx, f, i, a = asp) => { if (rx < 1 || rx > 1700) return; ell(c, CX, CY, rx, rx * a, f, i); };
    E(RO4(t), '#EFE6C8', INK); E(RI4(t), '#5A2A72', null);
    E(RO3(t), '#E8B248', INK); E(RI3(t), '#52225F', null);
    E(RO2(t), '#E24FA4', INK); E(RI2(t), K.mix('#6B3867', '#43204F', wd), null);
    E(RO1(t), '#9C6CF5', INK); E(RI1(t), K.mix('#81457A', '#4A2252', wd), null);
    E(RO0(t), '#6B48D0', INK, .89);
    const d = RD(t);
    const dg = c.createRadialGradient(CX, CY, 0, CX, CY, Math.max(1, d)); dg.addColorStop(0, rgb(L(120, 40, dk), L(70, 22, dk), L(120, 52, dk))); dg.addColorStop(1, rgb(L(95, 36, dk), L(50, 20, dk), L(100, 48, dk)));
    c.beginPath(); c.ellipse(CX, CY, Math.max(1, d), Math.max(1, d * .85), 0, 0, 7); c.fillStyle = dg; c.fill(); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
    // centre glow + 4-point star
    const gl = 1 - sstep(fr(513), fr(517), t);
    if (gl > 0) glow(c, CX, CY, 260 * (1 + gl), [255, 235, 250], gl);
    const sa = (1 - sstep(fr(517), fr(526), t)) * .8;
    if (sa > 0) { c.fillStyle = rgb(230, 190, 230, sa); const s = 40; c.beginPath(); c.moveTo(CX, CY - s); c.lineTo(CX + 8, CY - 8); c.lineTo(CX + s, CY); c.lineTo(CX + 8, CY + 8); c.lineTo(CX, CY + s); c.lineTo(CX - 8, CY + 8); c.lineTo(CX - s, CY); c.lineTo(CX - 8, CY - 8); c.fill(); }
  };

  // radial streaks (rings → warp), fade in/out
  const streaks = (c, t) => {
    const a = sstep(21.45, 21.6, t) * (1 - sstep(22.38, 22.5, t)); if (a <= 0) return;
    const g = Math.min(3, Math.exp(4.2 * (t - 21.45))), ls = 1 + 2 * sstep(22.0, 22.3, t); c.lineCap = 'round';
    for (const s of WARP) {
      const r = s.r0 * g, l = s.l * (1 + g * .6) * ls, an = s.a + s.jit * sstep(22.0, 22.4, t);
      if (r > 1400) continue; c.strokeStyle = rgb(...s.c, a * .85); c.lineWidth = s.w;
      c.beginPath(); c.moveTo(CX + Math.cos(an) * r, CY + Math.sin(an) * r * .9); c.lineTo(CX + Math.cos(an) * (r + l), CY + Math.sin(an) * (r + l) * .9); c.stroke();
    }
  };

  // ---------- C. beam + rocket ----------
  const HEAD = mono([[22.30, 1130], [22.333, 1020], [22.417, 740], [22.5, 180], [22.56, -80]]);
  const BW = mono([[22.4, 20], [22.5, 25], [23.0, 35], [23.25, 45], [23.42, 68], [24.0, 68]]);
  const NOZ = mono([[23.40, -140], [23.46, -50], [23.5, 80], [23.58, 500], [23.67, 660], [23.75, 700], [23.92, 760], [24.0, 770], [24.083, 830]]);
  const beamX = y => CX + Math.sin(y * .006 + 1) * 3;
  const beam = (c, t, y0, w) => {  // vertical golden beam from y0 to the bottom
    if (y0 > H) return;
    const x = CX, top = Math.max(-5, y0);
    glow(c, x, (top + H) / 2, 1, [255, 180, 70], 0);
    let g = c.createLinearGradient(x - w * 1.1, 0, x + w * 1.1, 0);
    g.addColorStop(0, 'rgba(255,150,40,0)'); g.addColorStop(.28, 'rgba(255,160,50,.45)'); g.addColorStop(.5, 'rgba(255,200,90,.9)'); g.addColorStop(.72, 'rgba(255,160,50,.45)'); g.addColorStop(1, 'rgba(255,150,40,0)');
    c.fillStyle = g; c.fillRect(x - w * 1.1, top, w * 2.2, H - top);
    g = c.createLinearGradient(x - w * .5, 0, x + w * .5, 0); g.addColorStop(0, 'rgba(255,200,90,0)'); g.addColorStop(.25, 'rgba(255,225,150,.95)'); g.addColorStop(.5, 'rgba(255,255,245,1)'); g.addColorStop(.75, 'rgba(255,225,150,.95)'); g.addColorStop(1, 'rgba(255,200,90,0)');
    c.fillStyle = g; c.fillRect(x - w * .5, top, w, H - top);
  };
  const flame = (c, x, y0) => {
    const draw = (hw, col) => { c.beginPath(); c.moveTo(x - 26, y0); c.bezierCurveTo(x - hw, y0 + 25, x - hw, y0 + 70, x - hw, y0 + 150); c.lineTo(x - hw, H + 10); c.lineTo(x + hw, H + 10); c.lineTo(x + hw, y0 + 150); c.bezierCurveTo(x + hw, y0 + 70, x + hw, y0 + 25, x + 26, y0); c.closePath(); c.fillStyle = col; c.fill(); };
    glow(c, x, y0 + 60, 150, [255, 190, 90], .6);
    let g = c.createLinearGradient(x - 90, 0, x + 90, 0); g.addColorStop(0, 'rgba(255,150,40,.25)'); g.addColorStop(.2, 'rgba(255,165,50,.95)'); g.addColorStop(.5, 'rgba(255,225,140,1)'); g.addColorStop(.8, 'rgba(255,165,50,.95)'); g.addColorStop(1, 'rgba(255,150,40,.25)'); draw(88, g);
    g = c.createLinearGradient(x - 40, 0, x + 40, 0); g.addColorStop(0, 'rgba(255,230,160,0)'); g.addColorStop(.5, 'rgba(255,255,245,1)'); g.addColorStop(1, 'rgba(255,230,160,0)'); draw(42, g);
  };
  const rocket = (c, x, y, ang, s) => {
    c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
    // nozzle
    c.fillStyle = '#F08A38'; c.beginPath(); c.moveTo(-26, 0); c.lineTo(26, 0); c.lineTo(32, -50); c.lineTo(-32, -50); c.closePath(); c.fill();
    c.fillStyle = '#FFE0B0'; for (const yy of [-12, -34]) { c.beginPath(); c.moveTo(0, yy - 8); c.lineTo(7, yy); c.lineTo(0, yy + 8); c.lineTo(-7, yy); c.closePath(); c.fill(); }
    // body
    let g = c.createLinearGradient(-32, 0, 32, 0); g.addColorStop(0, '#F2F3F8'); g.addColorStop(.7, '#D8DAE4'); g.addColorStop(1, '#9EA2B4'); c.fillStyle = g; c.fillRect(-31, -440, 62, 390);
    c.strokeStyle = 'rgba(120,125,145,.5)'; c.lineWidth = 1; for (let yy = -60; yy > -430; yy -= 16) { c.beginPath(); c.moveTo(-31, yy); c.lineTo(31, yy); c.stroke(); }
    c.fillStyle = '#7C7F90'; c.fillRect(-36, -462, 72, 22); c.fillStyle = '#2A2A36'; c.beginPath(); c.arc(-30, -472, 9, 0, 7); c.arc(30, -472, 9, 0, 7); c.fill();
    // nose
    c.fillStyle = '#17171F'; c.beginPath(); c.moveTo(-30, -462); c.bezierCurveTo(-30, -520, -10, -550, 4, -566); c.bezierCurveTo(14, -540, 30, -510, 30, -462); c.closePath(); c.fill();
    c.strokeStyle = '#EEF0F6'; c.lineWidth = 3; c.beginPath(); c.moveTo(-18, -466); for (let i = 0; i < 7; i++) { const yy = -466 - i * 13; c.lineTo(-18 + i * 3 + 7, yy - 6); c.lineTo(-18 + i * 3, yy - 11); } c.stroke();
    c.restore();
  };
  // rocket path keys
  const NX = mono([[23.75, 960], [23.92, 925], [24.0, 845], [24.083, 711], [24.167, 590], [24.25, 471], [24.417, 510], [24.583, 840], [24.75, 1290], [24.917, 1560], [25.0, 1665]]);
  const NY = mono([[24.083, 830], [24.167, 750], [24.25, 675], [24.417, 516], [24.583, 390], [24.75, 500], [24.917, 680], [25.0, 720]]);
  const NA = mono([[23.92, 0], [24.0, -.03], [24.083, -.03], [24.167, .14], [24.25, .35], [24.417, .96], [24.583, 1.4], [24.75, 1.83], [24.917, 2.0], [25.0, 2.06]]);
  const NS = mono([[23.75, 1], [23.92, 1], [24.0, .95], [24.083, .85], [24.25, .55], [24.417, .35], [24.583, .22], [24.75, .17], [24.917, .14], [25.0, .12]]);
  const AX = mono([[24.0, 794], [24.083, 674], [24.167, 529], [24.25, 394], [24.333, 304], [24.417, 277], [24.5, 287], [24.583, 314], [24.667, 342], [24.75, 358]]);
  // 3-point arcs A(tail), B(peak), C(tip) for 24.75 → 25.33 (then the Moon limb)
  const ARC = [[24.75, [358, 1100, 960, 410, 1290, 500]], [24.917, [283, 1100, 1030, 498, 1560, 680]], [25.0, [150, 1065, 1080, 606, 1665, 720]], [25.083, [0, 990, 1050, 690, 1919, 820]], [25.167, [0, 925, 1020, 744, 1919, 894]], [25.333, [0, 905, 1000, 765, 1919, 905]]];
  const ARCF = [0, 1, 2, 3, 4, 5].map(i => mono(ARC.map(k => [k[0], k[1][i]])));
  const TW = mono([[24.0, 160], [24.25, 46], [24.583, 36], [24.75, 26], [24.917, 19], [25.0, 8], [25.083, 4], [25.167, 3], [25.4, 3]]);
  const WH = mono([[24.9, 0], [25.1, 1]]);
  const circ = (ax, ay, bx, by, cx, cy) => { const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by)); if (Math.abs(d) < 1e-6) return null;
    const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d, uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
    return { x: ux, y: uy, r: Math.hypot(ax - ux, ay - uy) }; };
  const trailPath = (c, p) => { const [ax, ay, bx, by, cx, cy] = p; const o = circ(ax, ay, bx, by, cx, cy); c.beginPath();
    if (!o) { c.moveTo(ax, ay); c.lineTo(cx, cy); return; }
    const a0 = Math.atan2(ay - o.y, ax - o.x), a1 = Math.atan2(cy - o.y, cx - o.x), am = Math.atan2(by - o.y, bx - o.x);
    const ccw = (((am - a0) % 6.2832) + 6.2832) % 6.2832 > 3.1416; c.arc(o.x, o.y, o.r, a0, a1, ccw); };
  const strokeTrail = (c, w, wh) => {
    const lay = [[w * 1.5, [255, 150, 40], .18], [w * 1.0, [255, 175, 60], .4], [w * .6, [255, 215, 120], .8], [Math.max(1.5, w * .28), [255, 252, 235], 1]];
    for (const [lw, col, a] of lay) { c.lineWidth = lw; c.strokeStyle = rgb(L(col[0], 215, wh), L(col[1], 215, wh), L(col[2], 225, wh), a); c.lineCap = 'round'; c.stroke(); }
  };
  const bezTrail = (c, t) => {
    const x = NX(t), y = NY(t), a = NA(t), ax = AX(t); const sx = Math.sin(a), cy = Math.cos(a);
    let qx = ax, qy;
    if (Math.abs(sx) < .06) { qx = (ax + x) / 2; qy = (H + 20 + y) / 2; } else { const u = (x - ax) / sx; qy = y - (-cy) * 0 + u * (-cy) * -1 * 0; qy = y + u * cy; qy = Math.min(Math.max(qy, y), H + 600); }
    c.beginPath(); c.moveTo(ax, H + 30); c.quadraticCurveTo(qx, qy, x, y);
  };

  // ---------- D. Moon + Earth ----------
  const LIMB = [0, 905, 960, 765, 1920, 905];
  const moon = (c, dy, a = 1) => {
    const o = circ(0, LIMB[1], 960, LIMB[3], 1920, LIMB[5]); c.save(); c.translate(0, dy);
    c.beginPath(); c.arc(o.x, o.y, o.r, 0, 6.2832); c.clip(); c.globalAlpha = a;
    c.drawImage(MOON, 0, LIMB[3]); c.fillStyle = '#5F5F6B'; c.fillRect(0, LIMB[3] + 420, W, 600);
    c.restore(); c.save(); c.translate(0, dy); c.strokeStyle = 'rgba(225,225,235,.9)'; c.lineWidth = 3; c.beginPath(); c.arc(o.x, o.y, o.r, 0, 6.2832); c.stroke(); c.restore();
  };
  const EY = mono([[25.33, 960], [25.417, 900], [25.92, 759], [26.42, 660], [26.92, 615], [27.21, 549], [27.3, 549]]);
  const ER = mono([[27.3, Math.log(225)], [27.54, Math.log(345)], [27.7, Math.log(622)], [27.8, Math.log(925)], [27.9, Math.log(1500)]]);
  const EC0 = [990, 549], PIV = [990 + (960 - 1118) / 622 * 225, 549 + (570 - 677) / 622 * 225];
  const U = pts => pts.map(([x, y]) => [(x - 1118) / 622, (y - 677) / 622]);
  const OCH = U([[905, 305], [950, 230], [1060, 205], [1200, 195], [1400, 265], [1560, 330], [1640, 500], [1600, 700], [1500, 830], [1300, 830], [1190, 865], [1165, 780], [1160, 560], [1135, 460], [1100, 440], [985, 420], [930, 385], [895, 330]]);
  const GTOP = U([[1020, 165], [1040, 135], [1130, 100], [1230, 95], [1340, 105], [1370, 140], [1330, 165], [1250, 170], [1180, 145], [1100, 150]]);
  const GLEFT = U([[580, 462], [620, 520], [700, 580], [690, 620], [665, 780], [650, 900], [680, 1010], [700, 1060], [560, 1000], [520, 820], [515, 600]]);
  const CLOUD = [[[725, 320], [870, 285], [1080, 282]], [[870, 385], [1000, 350], [1200, 365], [1390, 420]], [[1060, 575], [1200, 535], [1370, 625]], [[860, 900], [1000, 925], [1200, 940]], [[780, 1030], [850, 1010], [965, 1002]], [[925, 115], [1030, 130], [1130, 115]]].map(U);
  const ISL = [(960 - 1118) / 622, (570 - 677) / 622];
  const land = (c, p, R, f, hatch) => {
    c.beginPath(); p.forEach(([x, y], i) => i ? c.lineTo(x * R, y * R) : c.moveTo(x * R, y * R)); c.closePath(); c.fillStyle = f; c.fill();
    c.save(); c.clip(); c.strokeStyle = hatch; c.lineWidth = Math.max(1, R / 300); c.beginPath(); const st = R / 34; for (let x = -R * 1.2; x < R * 1.2; x += st) for (let y = -R * 1.2; y < R * 1.2; y += st * 1.1) { c.moveTo(x + (hash(x * .1 + y) - .5) * st * .5, y); c.lineTo(x + st * .35, y + st * .9); } c.stroke(); c.restore();
    c.beginPath(); p.forEach(([x, y], i) => i ? c.lineTo(x * R, y * R) : c.moveTo(x * R, y * R)); c.closePath(); c.strokeStyle = 'rgba(10,25,70,.9)'; c.lineWidth = Math.max(1.5, R / 150); c.lineJoin = 'round'; c.stroke();
  };
  let OCEAN = null;
  const earth = (c, cx, cy, R, swirlA, det = 1) => {
    c.save(); c.translate(cx, cy);
    c.beginPath(); c.arc(0, 0, R, 0, 7); c.save(); c.clip();
    const g = c.createLinearGradient(-R, -R, R * .5, R); g.addColorStop(0, '#2F7BE0'); g.addColorStop(1, '#1F58B4'); c.fillStyle = g; c.fillRect(-R, -R, 2 * R, 2 * R);
    const lg = c.createRadialGradient(ISL[0] * R, ISL[1] * R, 0, ISL[0] * R, ISL[1] * R, R * .5); lg.addColorStop(0, 'rgba(150,205,255,.55)'); lg.addColorStop(1, 'rgba(150,205,255,0)'); c.fillStyle = lg; c.fillRect(-R, -R, 2 * R, 2 * R);
    c.strokeStyle = 'rgba(15,50,140,.28)'; c.lineWidth = Math.max(1, R / 330); c.lineCap = 'round'; c.beginPath(); const r = rng(9); for (let i = 0; i < 70; i++) { const x = (r() * 2 - 1) * R, y = (r() * 2 - 1) * R, l = R * .05; c.moveTo(x, y); c.lineTo(x + l, y + l * .05); } c.stroke();
    c.globalAlpha = det;
    land(c, GLEFT, R, '#58B552', 'rgba(35,110,50,.65)'); land(c, OCH, R, '#E6B95C', 'rgba(80,160,70,.5)'); land(c, GTOP, R, '#58B552', 'rgba(35,110,50,.65)');
    c.fillStyle = 'rgba(88,181,82,.95)'; c.beginPath(); c.ellipse((1285 - 1118) / 622 * R, (590 - 677) / 622 * R, .21 * R, .27 * R, 0, 0, 7); c.fill();
    c.strokeStyle = 'rgba(235,240,255,.92)'; c.lineWidth = Math.max(2, R / 45); c.lineCap = 'round'; c.lineJoin = 'round';
    for (const pl of CLOUD) { c.beginPath(); pl.forEach(([x, y], i) => i ? c.quadraticCurveTo(pl[i - 1][0] * R + (x - pl[i - 1][0]) * R * .5, pl[i - 1][1] * R + (y - pl[i - 1][1]) * R * .5 - R * .02, x * R, y * R) : c.moveTo(x * R, y * R)); c.stroke(); }
    if (swirlA > 0) { c.globalAlpha = swirlA; c.lineWidth = Math.max(2, R / 30); c.beginPath(); for (let a = 0; a < 11; a += .12) { const rr = (.02 + a * .012) * R, x = ISL[0] * R + Math.cos(a) * rr, y = ISL[1] * R + Math.sin(a) * rr; a ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.globalAlpha = 1; }
    // night side: the lit circle shifted left/down; crosshatched
    c.save(); c.globalAlpha = det; c.beginPath(); c.rect(-R, -R, 2 * R, 2 * R); c.arc(-.42 * R, .08 * R, R * 1.02, 0, 7); c.clip('evenodd'); c.fillStyle = 'rgba(8,22,80,.82)'; c.fillRect(-R, -R, 2 * R, 2 * R);
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = Math.max(1, R / 260); c.beginPath(); const r2 = rng(4); for (let i = 0; i < 220; i++) { const x = (-.2 + r2() * 1.3) * R, y = (r2() * 2 - 1) * R, l = R * .07; c.moveTo(x, y); c.lineTo(x + l, y - l); c.moveTo(x, y); c.lineTo(x + l, y + l); } c.stroke(); c.restore();
    c.globalAlpha = 1; c.restore();
    c.lineWidth = Math.max(2, R / 60); c.strokeStyle = '#6CC0F2'; c.beginPath(); c.arc(0, 0, R * 1.015, Math.PI * .55, Math.PI * 1.75); c.stroke();
    c.lineWidth = Math.max(1.5, R / 150); c.strokeStyle = 'rgba(12,16,50,.9)'; c.beginPath(); c.arc(0, 0, R * 1.03, 0, 7); c.stroke();
    c.restore();
  };

  // ---------- E. Julia zoom (WebGL) ----------
  let GL = null;
  const A_ = (() => { const cr = -.1226, ci = .7449, re = 1 - 4 * cr, im = -4 * ci, m = Math.hypot(re, im), a = Math.atan2(im, re) / 2, sr = Math.sqrt(m) * Math.cos(a), si = Math.sqrt(m) * Math.sin(a); return { cr, ci, x: (1 - sr) / 2, y: -si / 2 }; })();
  const glInit = () => {
    if (GL !== null) return GL;
    try {
      const cv = document.createElement('canvas'); cv.width = 960; cv.height = 540; const gl = cv.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false }); if (!gl) throw 0;
      const sh = (ty, src) => { const s = gl.createShader(ty); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(s); return s; };
      const p = gl.createProgram();
      gl.attachShader(p, sh(gl.VERTEX_SHADER, '#version 300 es\nin vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
      gl.attachShader(p, sh(gl.FRAGMENT_SHADER, `#version 300 es
precision highp float; out vec4 o; uniform vec2 res,cen,c,off; uniform float upp,rot,sat,solid; uniform vec3 pal[7];
void main(){
  vec2 q=(gl_FragCoord.xy-res*.5-off)*upp*2.0; q.y=-q.y; float cs=cos(rot),sn=sin(rot); q=vec2(q.x*cs-q.y*sn,q.x*sn+q.y*cs);
  vec2 z=cen+q; float s=0.; bool esc=false; float R2=40.;
  for(int i=0;i<400;i++){ z=vec2(z.x*z.x-z.y*z.y,2.*z.x*z.y)+c; float d=dot(z,z); if(d>R2){ s=float(i)+1.-log2(log(d)/log(R2)); esc=true; break; } }
  vec3 col=vec3(.275,.2,.58);
  if(esc){
    float f=s; float i0=floor(f); float fr=f-i0;
    vec3 bg=vec3(.09,.11,.255);
    if(f<1.5) col=bg*1.0; else if(f<3.0) col=vec3(.115,.13,.3);
    else { int k=int(mod(i0-3.,7.)); col=pal[0]; for(int j=0;j<7;j++) if(j==k) col=pal[j]; }
    float w=fwidth(f); float dd=min(fr,1.-fr)/max(w,1e-5); float ink=1.-smoothstep(0.5,1.6,dd); if(f>3.0) col=mix(col,vec3(.08,.05,.15),ink*.9);
  }
  float al=1.; if(esc && s<3.0) al=solid; col=mix(col,vec3(.9,.92,1.),(1.-sat)*.55); o=vec4(col*al,al);
}`));
      gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw gl.getProgramInfoLog(p);
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.useProgram(p); const la = gl.getAttribLocation(p, 'a'); gl.enableVertexAttribArray(la); gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);
      GL = { cv, gl, p, u: n => gl.getUniformLocation(p, n) };
    } catch (e) { GL = false; }
    return GL;
  };
  const PAL = [[.24, .75, .42], [.2, .58, .92], [.32, .32, .86], [.62, .36, .9], [.93, .25, .25], [.98, .6, .16], [.98, .84, .24]];
  const UPP = mono([[27.5, .0318], [27.7, .01168], [27.8, .00706], [27.917, .00395], [28.0, .00261], [28.083, .00172], [28.125, .0014], [28.21, .0005], [28.42, .00014], [28.75, .000023]].map(k => [k[0], Math.log(k[1])]));
  const RCX = mono([[27.5, PIV[0]], [27.8, 980], [27.917, 1000]]), RCY = mono([[27.5, PIV[1]], [27.8, 573], [27.917, 665]]);
  const OFFX = t => t < 27.917 ? RCX(t) + .196 * 643 * Math.exp(5 * (t - 27.917)) - 960 : mono([[27.917, 166], [28.2, 0]])(t);
  const OFFY = t => t < 27.917 ? -(RCY(t) + .079 * 643 * Math.exp(5 * (t - 27.917)) - 540) : mono([[27.917, -176], [28.2, 0]])(t);
  const ROT = mono([[27.5, 1.75], [27.917, 1.75], [28.0, 1.5], [28.083, 1.42], [28.75, 1.42]]);
  const julia = (c, t, a = 1) => {
    const g = glInit(); if (!g) { c.fillStyle = '#171D41'; c.fillRect(0, 0, W, H); return; }
    const gl = g.gl; gl.viewport(0, 0, 960, 540);
    gl.uniform2f(g.u('res'), 960, 540); gl.uniform2f(g.u('cen'), A_.x, A_.y); gl.uniform2f(g.u('c'), A_.cr, A_.ci);
    gl.uniform2f(g.u('off'), OFFX(t) / 2, OFFY(t) / 2); gl.uniform1f(g.u('upp'), Math.exp(UPP(t)) * 2 / 2); gl.uniform1f(g.u('rot'), ROT(t)); gl.uniform1f(g.u('sat'), sstep(27.8, 27.9, t)); gl.uniform1f(g.u('solid'), sstep(27.84, 27.9, t));
    gl.uniform3fv(g.u('pal'), new Float32Array(PAL.flat()));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    c.globalAlpha = a; c.imageSmoothingEnabled = true; c.drawImage(g.cv, 0, 0, W, H); c.globalAlpha = 1;
  };

  // soup bubble
  const BRY = mono([[28.25, Math.log(5)], [28.33, Math.log(18)], [28.42, Math.log(192)], [28.5, Math.log(525)], [28.58, Math.log(1100)], [28.71, Math.log(1900)], [28.75, Math.log(2300)]]);
  const bubble = (c, t) => {
    const ry = Math.exp(BRY(t)), rx = ry * .78, a = sstep(28.25, 28.3, t);
    if (ry < 40) { glow(c, CX, CY, ry * 3, [255, 255, 255], a); ell(c, CX, CY, ry * .7, ry, '#FFFFFF', 'rgba(30,20,60,.9)', 2); return; }
    c.save(); c.beginPath(); c.ellipse(CX, CY, rx, ry, 0, 0, 7); c.clip();
    if (K.soup) K.soup(c, t, CX, CY, ry, 1); else { c.fillStyle = '#1A1740'; c.fillRect(0, 0, W, H); }
    c.restore(); c.strokeStyle = 'rgba(60,30,70,.9)'; c.lineWidth = 5; c.beginPath(); c.ellipse(CX, CY, rx, ry, 0, 0, 7); c.stroke();
  };

  // ---------- timeline ----------
  SC.add(T0, T1, { draw: (c, t) => {
    init();
    if (t >= 24.8 && t < 27.2) t = Math.floor(t * 12 + 1e-6) / 12;       // Earth-rise is on twos
    if (t < fr(513)) return burst(c);
    if (t < 22.3) {                                                      // rings → dark disc → warp
      if (t < 22.0) rings(c, t);
      else { const k = sstep(22.0, 22.45, t); c.fillStyle = K.mix('#231634', '#05061A', k); c.fillRect(0, 0, W, H); if (t < fr(531)) rings(c, t); starField(c, .5 + .5 * k); }
      streaks(c, t); return;
    }
    // night sky from here on
    c.fillStyle = t < 22.45 ? K.mix('#231634', NAVY, sstep(22.0, 22.45, t)) : NAVY; c.fillRect(0, 0, W, H);
    const sf = t > 25.4 ? 1 : 1; starField(c, sf);
    streaks(c, t);
    if (t < 25.32) {
      // falling speed lines
      const fa = sstep(22.4, 22.6, t) * (1 - sstep(23.3, 23.55, t)); if (fa > 0) { c.lineWidth = 1.3; for (const f of FALL) { const y = ((f.y0 + t * f.v) % (H + 400)) - 200; c.strokeStyle = `rgba(${f.c},${f.a * fa})`; c.beginPath(); c.moveTo(f.x, y); c.lineTo(f.x, y + f.l); c.stroke(); } }
      if (t < 24.083) {
        const ny = t < 23.4 ? -1e3 : NOZ(t);
        if (t < 23.4) { const hy = HEAD(t); beam(c, t, Math.max(hy, 0), BW(t)); if (hy > -60) { glow(c, CX, hy, 70, [255, 235, 190], 1); } }
        else if (t < 23.46) beam(c, t, -5, BW(t)); else { flame(c, t < 23.75 ? CX : NX(t), ny + 4); }
        if (t >= 23.46) rocket(c, t < 23.75 ? CX : NX(t), ny, t < 23.92 ? 0 : NA(t), t < 23.75 ? 1 : NS(t));
        return;
      }
      if (t < 24.75) { bezTrail(c, t); strokeTrail(c, TW(t), 0); glow(c, NX(t), NY(t), 40 * NS(t) * 3, [255, 190, 90], .6); rocket(c, NX(t), NY(t), NA(t), NS(t)); return; }
      const p = ARCF.map(f => f(Math.min(t, 25.333))); trailPath(c, p); strokeTrail(c, TW(t), WH(t));
      if (t < 25.04) { glow(c, NX(t), NY(t), 30, [255, 190, 90], .6); rocket(c, NX(t), NY(t), NA(t), NS(t)); }
      return;
    }
    // Moon + Earth
    const dy = mono([[27.25, 0], [27.5, 30], [27.62, 95], [27.7, 150], [27.85, 400]])(t);
    if (t < 27.3) { const ey = EY(t), R = 225; earth(c, 990, ey, R, 1); moon(c, 0); return; }
    // push into Earth about the island
    const R = Math.exp(ER(t)), k = R / 225, cx = PIV[0] + (EC0[0] - PIV[0]) * k, cy = PIV[1] + (EC0[1] - PIV[1]) * k;
    if (t < 27.84) {
      earth(c, cx, cy, R, 1 - sstep(27.42, 27.58, t), 1 - sstep(27.72, 27.8, t)); if (t < 27.85) moon(c, dy);
      // pale island + rings
      const sz = Math.exp(UPP(t)); const rr = .00395 / sz * 322;
      c.strokeStyle = 'rgba(235,245,255,.35)'; c.lineWidth = 1.5; for (const m of [1.8, 2.6]) { c.beginPath(); c.ellipse(PIV[0], PIV[1], rr * m, rr * m * .9, 0, 0, 7); c.stroke(); }
      glow(c, PIV[0] + (RCX(t) - PIV[0]) , RCY(t), rr * 1.5, [225, 240, 255], .5 * sstep(27.45, 27.6, t) * (1 - sstep(27.8, 27.88, t))); julia(c, t, sstep(27.45, 27.6, t));
      return;
    }
    const f = sstep(27.84, 27.9, t); c.fillStyle = K.mix('#2B63AE', '#171D41', f); c.fillRect(0, 0, W, H);
    julia(c, t, f);
    if (t >= 28.25) bubble(c, t);
  } });
})();
