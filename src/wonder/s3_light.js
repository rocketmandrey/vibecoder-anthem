// s3_light.js: segment C (10.25-13.667): paper folds into a beam -> prism -> rainbow fan -> flat band -> DNA helix -> end-on spiral -> phyllotaxis dots.
// Pure function of t. Measured keys come from ref/tools/{fan,prism,bands}.py. Frame number f = t*24+1.
(() => {
  const BG = '#0A0B20', TAU = Math.PI * 2, mono = K.mono, sst = K.sstep;
  const keys = (ks, i) => mono(ks.map(k => [k[0], k[i]]));
  const COL = [[238, 63, 60], [246, 136, 39], [247, 212, 56], [69, 198, 106], [45, 157, 229], [87, 97, 218], [166, 84, 230]];
  const rgb = (a, al = 1) => `rgba(${a[0] | 0},${a[1] | 0},${a[2] | 0},${al})`;
  let RAIN = null, STREAK = null;
  const rain = () => RAIN || (RAIN = (() => { const cv = K.canvas(), g = cv.getContext('2d'), r = K.rng(5); g.lineCap = 'round'; g.lineWidth = 1.3;
    for (let i = 0; i < 3400; i++) { const x = r() * W, y = r() * H, l = 8 + r() * 24; g.strokeStyle = `rgba(120,130,200,${.05 + r() * .09})`; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l * .5, y - l); g.stroke(); } return cv; })());
  const bg = c => { c.fillStyle = BG; c.fillRect(0, 0, W, H); c.drawImage(rain(), 0, 0); };

  // ---------- paper -> beam (f 247..253): polygon through x = 0, 640, 960, 1920
  const PK = [[247, -150, -150, -150, -150, 1230, 1230, 1230, 1230], [248, 195, 113, 109, 81, 1060, 977, 952, 1238], [249, 399, 317, 324, 319, 849, 766, 757, 1170],
    [250, 523, 443, 452, 467, 721, 641, 646, 1125], [251, 584, 507, 521, 551, 654, 577, 587, 1114], [252, 602, 529, 549, 584, 625, 553, 569, 1119], [253, 596, 529, 556, 630, 618, 551, 554, 1167]];
  const PKf = [1, 2, 3, 4, 5, 6, 7, 8].map(i => keys(PK, i));
  let RAYS = null, PTEX = null;
  const ptex = () => PTEX || (PTEX = (() => { const cv = K.canvas(), g = cv.getContext('2d'), r = K.rng(14);
    for (let i = 0; i < 380; i++) { const x = r() * W, y = r() * H, rad = 30 + r() * 150, d = r() < .5, gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, d ? 'rgba(150,152,140,.035)' : 'rgba(255,255,250,.07)'); gr.addColorStop(1, 'rgba(128,128,120,0)'); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
    for (let i = 0; i < 2600; i++) { g.fillStyle = r() < .6 ? 'rgba(120,122,112,.16)' : 'rgba(255,255,255,.2)'; g.fillRect(r() * W, r() * H, 1 + r() * 1.5, 1 + r() * 1.5); } return cv; })());
  function paper(c, f) {
    const v = PKf.map(g => g(f)), X = [0, 640, 960, 1920];
    c.save(); c.beginPath(); X.forEach((x, i) => i ? c.lineTo(x, v[i]) : c.moveTo(x, v[0])); for (let i = 3; i >= 0; i--) c.lineTo(X[i], v[4 + i]); c.closePath();
    c.fillStyle = f < 253 ? K.mix('#E7E8E0', '#F2EEE0', sst(251, 253, f)) : '#F2EEE0'; c.fill(); if (f < 254) { c.save(); c.clip(); c.globalAlpha = 1 - sst(251, 254, f); c.drawImage(ptex(), 0, 0); c.restore(); }
    const a = 1 - sst(249, 252, f); if (a > .01) { c.clip(); c.globalAlpha = a * .38; c.strokeStyle = '#555'; c.lineWidth = 1.1;
      if (!RAYS) { const r = K.rng(9); RAYS = []; for (let i = 0; i < 52; i++) RAYS.push([r() * TAU, 40 + r() * 100, 600 + r() * 1200]); }
      const cy = v[1] * .0 + (v[2] + v[6]) / 2; c.beginPath(); for (const [an, r0, r1] of RAYS) { c.moveTo(810 + Math.cos(an) * r0, cy + Math.sin(an) * r0); c.lineTo(810 + Math.cos(an) * r1, cy + Math.sin(an) * r1); } c.stroke(); }
    c.restore();
  }

  // ---------- prism
  const PRk = [[253, 810, 365, 648, 705, 1020, 710], [259, 773, 352, 578, 705, 990, 695], [270, 735, 330, 460, 712, 928, 755], [274, 714, 336, 444, 714, 909, 756]];
  const PR = [1, 2, 3, 4, 5, 6].map(i => keys(PRk, i)), DX = mono([[274, 0], [275, -150], [276, -309], [277, -780], [278, -1300]]);
  const DEPTH = mono([[250, -30], [255, -20], [259, -15], [262, -5], [264, 15], [266, 55], [270, 92], [273, 100], [280, 100]]), DEPTHY = mono([[250, -45], [259, -46], [264, -40], [270, -30], [280, -30]]);
  const BEAMY = mono([[253, 607], [254, 600], [256, 575], [259, 540], [262, 525], [265, 515], [270, 490], [274, 470], [280, 440]]);
  const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  function prismGeom(f) {
    const ff = Math.max(253, Math.min(274, f)), dx = DX(f);
    const P = [[PR[0](ff) + dx, PR[1](ff)], [PR[2](ff) + dx, PR[3](ff)], [PR[4](ff) + dx, PR[5](ff)]];
    return { A: P[0], L: P[1], R: P[2], d: [DEPTH(f), DEPTHY(f)], ex: lerp(P[0], P[2], .635), en: lerp(P[0], P[1], .5) };
  }
  function prism(c, f) {
    const g = prismGeom(f), { A, L, R, d, ex, en } = g, pr = f < 250 ? (f - 247.6) / 2.2 : 1, ap = sst(250, 253, f), tri = (o = [0, 0]) => { c.beginPath(); c.moveTo(A[0] + o[0], A[1] + o[1]); c.lineTo(L[0] + o[0], L[1] + o[1]); c.lineTo(R[0] + o[0], R[1] + o[1]); c.closePath(); };
    if (f < 247.9) return;
    // beam in (left)
    const yl = BEAMY(f) - 4 * sst(255, 262, f) + 1.6 * Math.sin(Math.floor(f) * 2.7) * (f < 276), thick = 29;
    if (f >= 253) { c.fillStyle = '#EFEBDC'; c.beginPath(); c.moveTo(-5, yl - thick / 2 + (f > 270 ? 0 : 0)); c.lineTo(en[0], en[1] - thick / 2); c.lineTo(en[0], en[1] + thick / 2); c.lineTo(-5, yl + thick / 2); c.fill(); c.strokeStyle = 'rgba(120,115,100,.7)'; c.lineWidth = 1.2; c.beginPath(); for (let x = 2; x < en[0] - 20; x += 11) { const yy = yl + (en[1] - yl) * x / en[0] + thick / 2; c.moveTo(x, yy); c.lineTo(x + 3, yy - 7); } c.stroke(); }
    if (ap > 0) { c.globalAlpha = ap; c.strokeStyle = 'rgba(190,205,235,.45)'; c.lineWidth = 2; c.fillStyle = 'rgba(190,205,235,.07)'; tri(d); c.fill(); c.stroke();
      c.beginPath(); for (const p of [A, L, R]) { c.moveTo(p[0], p[1]); c.lineTo(p[0] + d[0], p[1] + d[1]); } c.stroke(); c.globalAlpha = 1; }
    if (pr >= 1) { { const kk = sst(251, 254, f); c.fillStyle = `rgba(${215 - 163 * kk | 0},${228 - 168 * kk | 0},${222 - 138 * kk | 0},${.5 + .36 * kk})`; }; tri(); c.fill();
      c.save(); tri(); c.clip(); c.strokeStyle = `rgba(190,203,230,${.3 * ap})`; c.lineWidth = 1; c.beginPath(); const bs = Math.floor(f) * 17.3; for (let i = 0; i < 1500; i++) { const x = L[0] + K.hash(i * 1.7 + bs) * (R[0] - L[0] + 60) - 20, y = A[1] + K.hash(i * 2.9 + 5 + bs) * (L[1] - A[1]), l = 8 + K.hash(i * 4.1 + bs) * 18, a2 = (K.hash(i * 5.3 + bs) < .5 ? -1.05 : 1.1) + (K.hash(i * 6.7 + bs) - .5) * .5; c.moveTo(x, y); c.lineTo(x + Math.cos(a2) * l, y + Math.sin(a2) * l); } c.stroke(); c.restore();
      c.fillStyle = '#fff'; c.beginPath(); c.moveTo(A[0], A[1] + 4); c.lineTo(A[0] + 4, A[1] + 12); c.lineTo(A[0] + 14, A[1] + 15); c.lineTo(A[0] + 4, A[1] + 19); c.lineTo(A[0], A[1] + 30); c.lineTo(A[0] - 4, A[1] + 19); c.lineTo(A[0] - 14, A[1] + 15); c.lineTo(A[0] - 4, A[1] + 12); c.fill();
      // inner beam
      if (f >= 253) { c.fillStyle = 'rgba(232,232,220,.85)'; c.beginPath(); c.moveTo(en[0], en[1] - 11); c.lineTo(ex[0], ex[1] - 4); c.lineTo(ex[0], ex[1] + 4); c.lineTo(en[0], en[1] + 11); c.fill(); }
      c.strokeStyle = `rgba(215,225,245,${.5 * ap})`; c.lineWidth = 3; c.beginPath(); c.moveTo(L[0] + (R[0] - L[0]) * .22, L[1] - 28); c.quadraticCurveTo((L[0] + R[0]) / 2, L[1] - 62, L[0] + (R[0] - L[0]) * .78, L[1] - 28); c.stroke();
    }
    // front outline, revealed A -> R -> L -> A
    c.strokeStyle = K.mix('#1d1d24', '#F2EEDC', sst(250, 252.5, f)); c.lineWidth = 5 + 4 * sst(250, 252.5, f); c.lineJoin = c.lineCap = 'round';
    const pts = [A, R, L, A], len = [0]; for (let i = 1; i < 4; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const fb = Math.floor(f), outl = () => { let want = Math.min(1, pr) * len[3]; c.beginPath(); c.moveTo(A[0], A[1]);
      for (let i = 1; i < 4 && want > 0; i++) { const sl = len[i] - len[i - 1], k = Math.min(1, want / sl), n = Math.max(1, Math.ceil(sl * k / 48)), nx = -(pts[i][1] - pts[i - 1][1]) / sl, ny = (pts[i][0] - pts[i - 1][0]) / sl;
        for (let q = 1; q <= n; q++) { const u = k * q / n, wob = q < n || k < 1 ? 1.1 * Math.sin(q * 1.7 + i * 1.7 + fb * 2.9) : 0; c.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u + nx * wob, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u + ny * wob); } want -= sl; } };
    outl(); c.stroke();
    if (pr >= 1) { const gx = (A[0] + L[0] + R[0]) / 3, gy = (A[1] + L[1] + R[1]) / 3; c.save(); c.translate(gx, gy); c.scale(.966, .966); c.translate(-gx, -gy); c.strokeStyle = 'rgba(10,11,28,.9)'; c.lineWidth = 3; outl(); c.stroke(); c.restore(); }
    // guide circle + dashes
    const ca = sst(252, 258, f) * (1 - sst(274, 277, f)) * .3; if (ca > .01) { const cx = (A[0] + L[0] + R[0]) / 3 + 10, cy = (A[1] + L[1] + R[1]) / 3 - 2; c.strokeStyle = `rgba(190,200,235,${ca})`; c.lineWidth = 1.5; c.setLineDash([2, 6]); c.beginPath(); c.arc(cx, cy, 337, 0, TAU); c.stroke(); c.setLineDash([]); c.strokeStyle = `rgba(190,200,235,${ca * 1.5})`; c.beginPath();
      for (let k = 0; k < 12; k++) { const an = -Math.PI / 2 + k * TAU / 12, ux = Math.cos(an), uy = Math.sin(an); for (const o of [-2.5, 2.5]) { c.moveTo(cx + ux * 330 - uy * o, cy + uy * 330 + ux * o); c.lineTo(cx + ux * 358 - uy * o, cy + uy * 358 + ux * o); } } c.stroke(); c.strokeStyle = `rgba(190,200,235,${ca * 1.2})`;
      c.setLineDash([12, 9]); c.beginPath(); c.moveTo(ex[0] + 145, ex[1] - 92); c.lineTo(ex[0], ex[1]); c.moveTo(en[0] - 122, en[1] - 71); c.lineTo(en[0], en[1]); c.stroke(); c.setLineDash([]); }
  }

  // ---------- fan / band: edges are lines T(x), B(x), 7 equal bands
  const FK = [[254, 467, .0917, -34, .631], [255, 458, .1026, -39, .642], [256, 454, .1101, -41, .6512], [257, 463, .107, -67, .6751], [258, 465, .1104, -62, .6793], [259, 465, .1141, -55, .6811], [260, 469, .1153, -43, .6794],
    [261, 447, .1333, -34, .6836], [262, 459, .1259, -17, .6741], [263, 472, .1164, 3, .6599], [265, 511, .0896, 64, .6167], [267, 526, .0789, 86, .6027], [269, 545, .065, 83, .6042], [271, 547, .0669, 87, .6066], [272, 545, .0696, 86, .6087],
    [273, 514, .0917, 72, .6253], [274, 515, .09, 86, .6187], [275, 518, .0813, 181, .5758], [276, 514, .0623, 388, .4706], [277, 482, .0353, 642, .2837], [278, 432, .0139, 725, .1174], [279, 402, .0046, 709, .035], [280, 391, .0008, 693, .0046],
    [281, 386, 0, 692, 0], [284, 388, 0, 692, 0]];
  const FT0 = keys(FK, 1), FTk = keys(FK, 2), FB0 = keys(FK, 3), FBk = keys(FK, 4);
  function streaks(c, f) {
    const a = sst(275, 277, f) * (1 - sst(284.5, 286.2, f)); if (a < .01) return;
    if (!STREAK) { const r = K.rng(21); STREAK = []; for (let i = 0; i < 80; i++) STREAK.push([r() * W, r() * H * .85, 40 + r() * 300, .22 + r() * .4]); }
    c.lineWidth = 1.5; for (const [x, y, l, al] of STREAK) { const xx = ((x - (Math.min(f, 279) - 275) * 160) % (W + 400) + W + 400) % (W + 400) - 200; c.strokeStyle = `rgba(165,175,215,${al * a})`; c.beginPath(); c.moveTo(xx, y); c.lineTo(xx + l, y); c.stroke(); }
  }
  function fan(c, f, x0, x1, wig = 0) {
    const fc = Math.min(284, f), t0 = FT0(fc), tk = FTk(fc), b0 = FB0(fc), bk = FBk(fc);
    const g = prismGeom(f), xa = f < 275.5 ? g.ex[0] : Math.max(-60, g.ex[0]);
    const bo = f < 276 ? 3.4 * (1 - sst(272, 276, f)) : 0, fb = Math.floor(f), T = x => t0 + tk * x, B = x => b0 + bk * x, wv = (x, i) => bo * Math.sin(x / 90 + i * 1.3 + fb * 2.7) + (wig ? wig * Math.sin(x / 120 + i * .5 - f * 1.3) * (1 - sst(0, 1400, x)) : 0);
    const xs = []; for (let x = Math.max(x0, xa); x <= x1 + 40; x += 40) xs.push(x);
    if (f < 276) { /* fan starts at the exit point */ }
    for (let i = 0; i < 7; i++) {
      c.beginPath(); xs.forEach((x, j) => { const y = T(x) + (B(x) - T(x)) * i / 7 + wv(x, i); j ? c.lineTo(x, y) : c.moveTo(x, y); });
      for (let j = xs.length - 1; j >= 0; j--) { const x = xs[j]; c.lineTo(x, T(x) + (B(x) - T(x)) * (i + 1) / 7 + wv(x, i + 1) + .6); }
      c.closePath(); c.fillStyle = rgb(COL[i]); c.fill(); c.strokeStyle = 'rgba(25,15,45,.5)'; c.lineWidth = 1.4; c.stroke();
    }
    if (bo > 0) { // pencil boil: short strokes redrawn every frame over the bands
      c.save(); c.beginPath(); xs.forEach((x, j) => j ? c.lineTo(x, T(x)) : c.moveTo(x, T(x))); for (let j = xs.length - 1; j >= 0; j--) c.lineTo(xs[j], B(xs[j])); c.closePath(); c.clip(); c.lineWidth = 1.2;
      const al = .75 + .25 * (1 - bo / 3.4); for (let i = 0; i < 900; i++) { const x = xs[0] + K.hash(i * 1.3 + fb * 7.7) * (xs[xs.length - 1] - xs[0]), y = T(x) + K.hash(i * 2.1 + fb * 3.1) * (B(x) - T(x)), l = 8 + K.hash(i * 3.7 + fb * 5.3) * 18;
        c.strokeStyle = i & 1 ? 'rgba(255,255,255,.13)' : 'rgba(20,10,50,.13)'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + l * .45, y - l); c.stroke(); }
      c.restore(); }
  }

  // ---------- 3D helix
  const Rh = 150, SEQ = [[71, 195, 107], [246, 212, 61], [48, 157, 229], [246, 138, 48]];
  const PSI = mono([[285, 17], [300, 17], [302, 19], [304, 28], [305, 40], [306, 62], [307, 75], [308, 82], [310, 87], [312, 90], [330, 90]].map(k => [k[0], k[1] * Math.PI / 180]));
  const FV = mono([[285, 6000], [299, 6000], [301, 3000], [303, 1500], [305, 1000], [330, 1000]]);
  const DC = mono([[285, 6000], [299, 6000], [301, 3000], [303, 1500], [304, 800], [305, 520], [306, 400], [308, 330], [310, 290], [312, 270], [330, 270]]);
  const PIT = mono([[285, 481], [303, 481], [306, 420], [308, 360], [312, 315], [330, 315]]);
  const DMIN = mono([[306, 25], [308, 60], [309, 170], [310, 260], [312, 235], [318, 274], [322, 274], [324, 235], [330, 235]]);
  const DDOT = mono([[321.5, 9000], [322, 700], [322.5, 300], [323, -1], [330, -1]]), DMAX = mono([[320, 20000], [322, 3500], [323, 1250], [330, 1250]]);
  const SCAM = mono([[285, 0], [303, 0], [306, 250], [308, 450], [310, 560], [312, 600], [330, 600]]);
  const XA = [[285, 585], [286, 583], [287, 580], [288, 576], [289, 571], [290, 565], [291, 558], [292, 550], [293, 541], [294, 531], [295, 520], [296, 508], [297, 496], [298, 484], [299, 473], [300, 467], [301, 464]];
  const R301 = .6 + Math.PI / 2 - TAU * (464 - 960) / 460;
  const ROT = mono(XA.map(k => [k[0], .6 + Math.PI / 2 - TAU * (k[1] - 960) / 460]).concat([[302, R301 + .1], [303, R301 + .25], [304, R301 + .45], [305, R301 + .65], [330, R301 + .65 + .2 * 25]]));
  const OFF = -2.5;
  const CX = mono([[285, 960], [304, 960], [306, 700], [309, 800], [312, 940], [316, 950], [321, 960], [330, 960]]), CY = mono([[285, 540], [304, 540], [306, 560], [309, 520], [312, 540], [330, 540]]);
  const OX = mono([[285, 0], [330, 0]]);
  // FIT-BEGIN (ref/tools/mkfit.py: per-frame camera fit [f, F, psi, dc, p, cx, cy, ox, Q=rot+2*pi*sc/p])
  const FITK = [[300, 4505.2, 0.2520, 4397.2, 464.7, 960.2, 536.4, -11.8, 8.9149],
    [301, 3078.1, 0.2762, 3013.0, 453.2, 945.6, 535.8, -23.8, 9.1776],
    [302, 2077.1, 0.3248, 2057.5, 444.7, 936.2, 536.5, -17.0, 9.2236],
    [303, 1658.9, 0.4336, 1673.2, 441.4, 929.1, 537.7, -5.4, 9.1591],
    [304, 1549.8, 0.5950, 1577.2, 438.1, 924.1, 538.5, -0.3, 9.1811],
    [305, 1480.3, 0.7728, 1492.3, 431.8, 939.9, 539.1, 1.5, 9.6518],
    [306, 1423.2, 0.9456, 1410.1, 424.6, 967.8, 539.5, 3.8, 10.3212],
    [307, 1395.5, 1.1034, 1393.5, 412.4, 974.2, 539.6, 8.1, 10.2615],
    [308, 1367.7, 1.2367, 1404.1, 398.6, 965.6, 539.2, 13.8, 9.3849],
    [309, 1354.9, 1.3381, 1366.1, 394.0, 964.5, 538.6, 13.3, 8.4306],
    [310, 1350.8, 1.4103, 1216.6, 398.5, 975.3, 538.6, 4.1, 8.1322],
    [311, 1300.1, 1.4705, 923.5, 387.9, 970.6, 538.8, -14.0, 8.5799],
    [312, 1190.6, 1.5208, 511.6, 351.4, 946.3, 538.7, -36.4, 9.4563],
    [313, 1117.3, 1.5509, 263.0, 324.8, 929.4, 538.4, -43.7, 10.1168],
    [314, 1111.0, 1.5616, 209.5, 320.7, 926.0, 538.1, -39.9, 10.4133],
    [315, 1138.5, 1.5737, 222.8, 328.0, 917.6, 538.0, -37.2, 10.4682],
    [316, 1165.6, 1.5948, 244.7, 336.2, 899.4, 538.3, -37.2, 10.3580],
    [317, 1178.8, 1.6100, 266.4, 341.7, 885.9, 538.6, -37.4, 10.2016],
    [318, 1176.4, 1.6151, 279.1, 345.2, 883.2, 538.9, -35.9, 10.1377],
    [319, 1172.1, 1.6167, 287.9, 345.4, 885.1, 539.0, -33.4, 10.1455],
    [320, 1186.8, 1.6206, 298.8, 346.3, 883.0, 539.0, -31.7, 10.2238],
    [321, 1214.7, 1.6248, 310.8, 351.1, 877.9, 539.3, -30.8, 10.3424],
    [322, 1218.5, 1.6252, 319.6, 352.8, 876.3, 539.5, -30.0, 10.3855],
    [323, 1190.4, 1.6269, 329.3, 347.5, 879.3, 539.1, -28.2, 10.2344],
    [324, 1139.8, 1.6275, 338.8, 333.6, 889.4, 538.9, -23.7, 9.9665],
    [325, 1089.3, 1.6187, 339.2, 318.5, 904.8, 539.4, -18.6, 9.8625],
    [326, 1064.4, 1.6114, 334.3, 310.9, 915.0, 539.8, -14.7, 10.0086],
    [327, 1056.8, 1.6106, 329.8, 311.4, 921.5, 539.3, -10.7, 10.2430],
    [328, 1058.8, 1.6117, 330.3, 321.5, 928.5, 537.4, -6.1, 10.4077]];
  // FIT-END
  const smooth = A => A.map((r, i) => r[0] < 313 || !A[i + 1] ? r : r.map((v, j) => j ? (A[i - 1][j] + 2 * v + A[i + 1][j]) / 4 : v));
  const FITS = FITK.map(r => r.slice());
  const QRATE = -0.12;
  { // sparse monotone-ish keys replace the jittery per-frame fit for 308..321 (smooth camera)
    const SK = { 1: [[308, 1368], [310, 1351], [312, 1200], [314, 1111], [317, 1170], [321, 1210]], 3: [[308, 1404], [310, 1216], [311, 923], [312, 520], [313, 330], [314, 270], [315, 250], [316, 245], [319, 288], [321, 311]],
      4: [[308, 399], [310, 397], [312, 352], [313, 326], [315, 322], [317, 340], [319, 345], [321, 351]], 5: [[308, 966], [310, 972], [312, 947], [314, 926], [316, 900], [318, 883], [321, 878]],
      7: [[308, 14], [310, 4], [312, -36], [313, -44], [315, -37], [318, -35], [321, -31]], 8: [[308, 9.4], [310, 8.2], [312, 9.4], [314, 10.4], [317, 10.3], [320, 10.2], [321, 10.3]] };
    { const Q0 = FITK.map(r => r[8]), g = [1, 2, 3, 2, 1]; for (let i = 0; i < FITK.length; i++) if (FITK[i][0] >= 313 && FITK[i][0] <= 322) { let sm = 0, ws = 0; g.forEach((w, k) => { const q = Q0[Math.max(0, Math.min(Q0.length - 1, i + k - 2))]; sm += w * q; ws += w; }); FITS[i][8] = sm / ws; } }
    for (const r of FITS) if (r[0] >= 323) r[8] = 10.23 + QRATE * (r[0] - 323);
    for (const r of FITS) if (r[0] >= 308 && r[0] <= 321) for (const c in SK) r[c] = mono(SK[c])(r[0]); }
  const FIT = [FV, PSI, DC, PIT, CX, CY, OX, f => ROT(f) + SCAM(f) * TAU / PIT(f)].map((m, i) => { const ks = []; for (let f = 285; f <= 299; f++) ks.push([f, m(f)]); for (const r of FITS) ks.push([r[0], r[i + 1]]); return mono(ks); });
  const QA = mono([[313, 0], [323, 0]]);   // extra end-on rotation (rad)
  const XTIP = mono([[303, -50], [304, 160], [305, 300], [307, 600], [308, 690], [309, 760], [310, 820], [311, 900]]);   // ref helix is finite: its far end sweeps right
  const FM = mono([[322.5, 1], [330, 1]]);   // dots stage is ~1.5x the fitted radius in the ref
  const PM = mono([[322, 1], [324, .84], [326, .78], [330, .76]]);   // tighter turns in the dots stage
  const hs = (i, k) => K.hash(i * 3.17 + k * 7.1);
  function helix(c, f, xa, xb, o = {}) {
    let F = FIT[0](f) * FM(f), psi = FIT[1](f), dc = FIT[2](f), p = FIT[3](f), cx = FIT[4](f), cy = FIT[5](f), ox = FIT[6](f), rot = FIT[7](f) + QA(f), sc = 0;
    const cs = Math.cos(psi), sn = Math.sin(psi);
    const dotm = 0, rungMix = sst(304.5, 309, f), cr = -0.85 + (0.62 + .85) * rungMix, rungA = 1 - sst(321, 322.5, f);
    const xf = o.xf, flat0 = o.flat0 || 0;   // unravel: waves decay to flat strands (red top, violet bottom) to the right of xf
    const proj = (phi, rr, rotk, k) => { const s = p * phi / TAU - sc, y0 = -rr * Math.sin(phi + rotk), z0 = rr * Math.cos(phi + rotk), xp = s * cs + z0 * sn - ox, x0 = cx + F * xp / (dc + (-s * sn + z0 * cs));
      const w = xf === undefined ? 1 : Math.max(sst(0, 1, (f - 285.4) / 3 + .3 * (1 - x0 / W)), 1 - sst(xf, xf + 300, x0)), y = k === undefined ? y0 : y0 * w + (k === 1 ? -rr : rr) * (1 - w), z = z0 * w, xq = s * cs + z * sn - ox, zc = -s * sn + z * cs, d = dc + zc;
      return d < DMIN(f) || d > DMAX(f) || (f > 303 && f < 311.5 && x0 < XTIP(f)) ? null : { phi, x: cx + F * xq / d, y: cy + F * y / d, d, sc: F / d, z }; };
    const items = [], step = dotm ? .09 : .07, CH = 10;
    const sLo = -(1700 + 7300 * sn * sn), sHi = Math.min(1800 / Math.max(cs, .12), (dc - DMIN(f)) / Math.max(sn, .05) + 500), phiMin = (sLo + sc) / p * TAU, phiMax = (sHi + sc) / p * TAU;
    const pa = (Math.floor(phiMin / step)) * step;
    for (let k = 0; k < 2; k++) {
      let ch = [], prev = null;
      for (let phi = pa; phi < phiMax; phi += step) { const a = proj(phi, Rh, rot + k * OFF, k);
        if (a) { ch.push(a); if (ch.length > CH) { items.push({ t: 0, k, pts: ch, d: ch.reduce((u, q) => u + q.d, 0) / ch.length }); ch = [a]; } } else { if (ch.length > 1) items.push({ t: 0, k, pts: ch, d: ch.reduce((u, q) => u + q.d, 0) / ch.length }); ch = []; } }
      if (ch.length > 1) items.push({ t: 0, k, pts: ch, d: ch.reduce((u, q) => u + q.d, 0) / ch.length });
    }
    if (rungA > 0) for (let j = Math.floor(phiMin / .5); j * .5 < phiMax; j++) { const phi = j * .5, a = proj(phi, Rh * (.86 + .16 * rungMix), rot), bb = proj(phi, Rh * (.86 * (1 - rungMix) + .52 * rungMix), rot + OFF * (1 - rungMix));
      if (a && bb && (xf === undefined || a.x < xf) && Math.min(a.d, bb.d) > DMIN(f) * 1.15 && Math.hypot(a.x - bb.x, a.y - bb.y) < 260 + 300 * rungMix) items.push({ t: 1, j, a, b: bb, d: (a.d + bb.d) / 2 }); }
    items.sort((u, v) => v.d - u.d);
    c.save(); c.beginPath(); c.rect(xa, 0, xb - xa, H); c.clip(); c.lineCap = 'round';
    const COLS = [[[158, 86, 228], [100, 62, 166]], [[238, 62, 62], [128, 36, 52]]];
    for (const it of items) {
      if (it.t === 0) {
        const pts = it.pts, mid = pts[pts.length >> 1], z = pts.reduce((u, q) => u + q.z, 0) / pts.length, sh = Math.max(0, Math.min(1, .5 - z / (2 * Rh) * (.5 + .5 * Math.max(0, Math.cos(psi))))), col = COLS[it.k];
        const w = (23 - 8 * rungMix) * (.78 + .37 * rungMix) * mid.sc, cc = [0, 1, 2].map(q => col[1][q] + (col[0][q] - col[1][q]) * (sh * sh * (3 - 2 * sh)));
        if (mid.d > DDOT(f)) { for (const q of pts) { if (Math.round(q.phi / step) % 2) continue; const dx = q.x - cx, dy = q.y - cy, rad = Math.hypot(dx, dy), an = Math.atan2(dy, dx), lit = .5 + .5 * Math.cos(an - 3.3), cc2 = [0, 1, 2].map(i => col[1][i] + (col[0][i] - col[1][i]) * (.2 + .8 * lit));
          const rr = Math.max(2.5, Math.min(13, .044 * rad)), rt = Math.max(2, Math.min(9.5, .032 * rad)); c.fillStyle = rgb(cc2); c.beginPath(); c.ellipse(q.x, q.y, rr, rt, an, 0, TAU); c.fill(); c.fillStyle = 'rgb(240,150,60)'; c.beginPath(); c.arc(q.x, q.y, Math.max(1, rt * .32), 0, TAU); c.fill(); } continue; }
        c.lineJoin = 'round'; c.lineCap = 'butt'; c.strokeStyle = 'rgba(14,10,36,.85)'; c.lineWidth = w + 7; c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y)); c.stroke();
        if (f < 312) { c.lineCap = 'round'; c.strokeStyle = rgb(col[1]); c.lineWidth = w; c.save(); c.translate(2.5, 3.2); c.stroke(); c.restore(); }
        c.lineCap = 'round'; c.strokeStyle = rgb(cc); c.lineWidth = w; c.stroke();
      } else {
        const { a, b } = it, j = it.j, sp = .25 + .5 * hs(j, 1), c1 = SEQ[(hs(j, 2) * 4) | 0], c2 = SEQ[(hs(j, 3) * 4) | 0], w = Math.min(34, (7 + 6 * sst(305, 312, f)) * (a.sc + b.sc) / 2), al = rungA * (.55 + .45 * Math.max(0, 1 - (a.d - dc) / 900));
        const m = [a.x + (b.x - a.x) * sp, a.y + (b.y - a.y) * sp]; c.lineCap = 'round'; c.lineWidth = w; c.strokeStyle = rgb(c1, al); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(m[0], m[1]); c.stroke(); c.strokeStyle = rgb(c2, al); c.beginPath(); c.moveTo(m[0], m[1]); c.lineTo(b.x, b.y); c.stroke();
      }
    }
    c.restore();
  }

  // ---------- unravel: band -> helix sweep (f 285..292)
  const XF = mono([[284.5, -40], [285, 0], [286, 200], [287, 390], [288, 720], [289, 980], [290, 1240], [291, 1560], [292, 2050]]);
  const XT = mono([[284.5, -40], [285, 0], [286, 285], [287, 1350], [288, 2100], [292, 2200]]);
  function ticks(c, f, x0, x1) {
    const t0 = FT0(284), b0 = FB0(284); for (let x = Math.ceil(x0 / 27) * 27; x < x1; x += 27) for (let i = 0; i < 7; i++) { c.fillStyle = rgb(COL[i]); c.fillRect(x, 480 + i * 17, 7, 15); } }

  // ---------- dots (f 322..)
  function disc(c, f) { const r = 330 * sst(327.3, 328, f) + (f > 328 ? (f - 328) * 190 : 0); if (r < 2) return; const g = c.createLinearGradient(0, 540 - r, 0, 540 + r); g.addColorStop(0, '#F0B49A'); g.addColorStop(1, '#F9D9B0'); c.fillStyle = g; c.beginPath(); c.arc(960, 540, r, 0, TAU); c.fill(); }
  function seeds(c, f) { const n = Math.min(420, (f - 323) * 70), r = K.rng(33), R = 55 + (f - 323) * 22; c.fillStyle = K.mix('#D9C441', '#5E4C1E', sst(325, 328, f)); for (let i = 0; i < n; i++) { const a = r() * TAU, q = Math.sqrt(r()) * R; c.beginPath(); c.ellipse(960 + 8 + Math.cos(a) * q, 540 + Math.sin(a) * q, 7 + q * .03, 3.2, a, 0, TAU); c.fill(); } }

  SC.add(10.25, 13.667, { draw(c, t) {
    let f = t * 24 + 1;
    if (f > 263.5 && f < 270.52) { const k = Math.floor(f + .02); f = k % 2 ? k : k - 1; }   // ref is on twos here (264 holds 263, ...)
    bg(c);
    if (f < 254) { paper(c, f); prism(c, f); }
    else if (f < 277.5) { if (f < 274.5) fan(c, f, 0, W); else fan(c, f, 0, W); streaks(c, f); prism(c, f); }
    else if (f < 285) { streaks(c, f); fan(c, f, 0, W, 0); if (f > 284.5) helix(c, f, 0, W, { xf: XF(f) }); }
    else if (f < 292) { const xf = XF(f), xt = XT(f); if (xt < W + 100) { fan(c, 284, xt, W, 0); } ticks(c, f, xf, Math.min(W, xt)); helix(c, f, 0, W, { xf }); }
    else if (f < 322) helix(c, f, 0, W);
    else { disc(c, f); helix(c, f, 0, W); seeds(c, f); }
  } });
})();
