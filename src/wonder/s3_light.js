// s3_light.js: segment C (10.25-13.667): paper folds into a beam -> prism -> rainbow fan -> flat band -> DNA helix -> end-on spiral -> phyllotaxis dots.
// Pure function of t. Measured keys come from ref/tools/{fan,prism,bands}.py. Frame number f = t*24+1.
(() => {
  const BG = '#0A0B20', TAU = Math.PI * 2, mono = K.mono, sst = K.sstep;
  const keys = (ks, i) => mono(ks.map(k => [k[0], k[i]]));
  const COL = [[241, 64, 64], [246, 138, 48], [246, 212, 61], [71, 195, 107], [48, 157, 229], [78, 84, 210], [165, 80, 225]];
  const rgb = (a, al = 1) => `rgba(${a[0] | 0},${a[1] | 0},${a[2] | 0},${al})`;
  let RAIN = null, STREAK = null;
  const rain = () => RAIN || (RAIN = (() => { const cv = K.canvas(), g = cv.getContext('2d'), r = K.rng(5); g.lineCap = 'round'; g.lineWidth = 1.3;
    for (let i = 0; i < 2600; i++) { const x = r() * W, y = r() * H, l = 6 + r() * 14; g.strokeStyle = `rgba(110,120,190,${.04 + r() * .06})`; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l * .5, y - l); g.stroke(); } return cv; })());
  const bg = c => { c.fillStyle = BG; c.fillRect(0, 0, W, H); c.drawImage(rain(), 0, 0); };

  // ---------- paper -> beam (f 247..253): polygon through x = 0, 640, 960, 1920
  const PK = [[247, -150, -150, -150, -150, 1230, 1230, 1230, 1230], [248, 195, 113, 109, 81, 1060, 977, 952, 1238], [249, 399, 317, 324, 319, 849, 766, 757, 1170],
    [250, 523, 443, 452, 467, 721, 641, 646, 1125], [251, 584, 507, 521, 551, 654, 577, 587, 1114], [252, 602, 529, 549, 584, 625, 553, 569, 1119], [253, 596, 529, 556, 630, 618, 551, 554, 1167]];
  const PKf = [1, 2, 3, 4, 5, 6, 7, 8].map(i => keys(PK, i));
  let RAYS = null;
  function paper(c, f) {
    const v = PKf.map(g => g(f)), X = [0, 640, 960, 1920];
    c.save(); c.beginPath(); X.forEach((x, i) => i ? c.lineTo(x, v[i]) : c.moveTo(x, v[0])); for (let i = 3; i >= 0; i--) c.lineTo(X[i], v[4 + i]); c.closePath();
    c.fillStyle = f < 253 ? K.mix('#ECE9DE', '#F2EEE0', sst(251, 253, f)) : '#F2EEE0'; c.fill();
    const a = 1 - sst(249, 252, f); if (a > .01) { c.clip(); c.globalAlpha = a * .5; c.strokeStyle = '#555'; c.lineWidth = 1.2;
      if (!RAYS) { const r = K.rng(9); RAYS = []; for (let i = 0; i < 70; i++) RAYS.push([r() * TAU, 40 + r() * 100, 600 + r() * 1200]); }
      const cy = v[1] * .0 + (v[2] + v[6]) / 2; c.beginPath(); for (const [an, r0, r1] of RAYS) { c.moveTo(810 + Math.cos(an) * r0, cy + Math.sin(an) * r0); c.lineTo(810 + Math.cos(an) * r1, cy + Math.sin(an) * r1); } c.stroke(); }
    c.restore();
  }

  // ---------- prism
  const PRk = [[253, 810, 365, 648, 705, 1020, 710], [259, 773, 352, 578, 705, 990, 695], [270, 735, 330, 460, 712, 928, 755], [274, 714, 336, 444, 714, 909, 756]];
  const PR = [1, 2, 3, 4, 5, 6].map(i => keys(PRk, i)), DX = mono([[274, 0], [275, -150], [276, -309], [277, -780], [278, -1300]]);
  const DEPTH = mono([[250, -45], [259, -39], [262, -30], [264, 0], [266, 60], [270, 92], [273, 100], [280, 100]]);
  const BEAMY = mono([[253, 607], [254, 600], [256, 575], [259, 540], [262, 525], [265, 515], [270, 490], [274, 470], [280, 440]]);
  const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  function prismGeom(f) {
    const ff = Math.max(253, Math.min(274, f)), dx = DX(f);
    const P = [[PR[0](ff) + dx, PR[1](ff)], [PR[2](ff) + dx, PR[3](ff)], [PR[4](ff) + dx, PR[5](ff)]];
    return { A: P[0], L: P[1], R: P[2], d: [DEPTH(f) * 1, -36], ex: lerp(P[0], P[2], .635), en: lerp(P[0], P[1], .5) };
  }
  function prism(c, f) {
    const g = prismGeom(f), { A, L, R, d, ex, en } = g, pr = f < 250 ? (f - 247.6) / 2.2 : 1, ap = sst(250, 253, f), tri = (o = [0, 0]) => { c.beginPath(); c.moveTo(A[0] + o[0], A[1] + o[1]); c.lineTo(L[0] + o[0], L[1] + o[1]); c.lineTo(R[0] + o[0], R[1] + o[1]); c.closePath(); };
    if (f < 247.9) return;
    // beam in (left)
    const yl = BEAMY(f), thick = 22;
    if (f >= 253) { c.fillStyle = '#EFEBDC'; c.beginPath(); c.moveTo(-5, yl - thick / 2 + (f > 270 ? 0 : 0)); c.lineTo(en[0], en[1] - thick / 2); c.lineTo(en[0], en[1] + thick / 2); c.lineTo(-5, yl + thick / 2); c.fill(); }
    if (ap > 0) { c.globalAlpha = ap; c.strokeStyle = 'rgba(190,205,235,.45)'; c.lineWidth = 2; c.fillStyle = 'rgba(190,205,235,.07)'; tri(d); c.fill(); c.stroke();
      c.beginPath(); for (const p of [A, L, R]) { c.moveTo(p[0], p[1]); c.lineTo(p[0] + d[0], p[1] + d[1]); } c.stroke(); c.globalAlpha = 1; }
    if (pr >= 1) { c.fillStyle = `rgba(62,76,106,${.82 * ap + .1})`; tri(); c.fill();
      c.save(); tri(); c.clip(); c.strokeStyle = `rgba(175,190,220,${.14 * ap})`; c.lineWidth = 1.2; c.beginPath(); for (let k = -400; k < 700; k += 8) { c.moveTo(L[0] + k, 780); c.lineTo(L[0] + k + 320, 300); } c.stroke(); c.restore();
      // inner beam
      if (f >= 253) { c.fillStyle = 'rgba(232,232,220,.85)'; c.beginPath(); c.moveTo(en[0], en[1] - 11); c.lineTo(ex[0], ex[1] - 4); c.lineTo(ex[0], ex[1] + 4); c.lineTo(en[0], en[1] + 11); c.fill(); }
      c.strokeStyle = `rgba(215,225,245,${.5 * ap})`; c.lineWidth = 3; c.beginPath(); c.moveTo(L[0] + (R[0] - L[0]) * .22, L[1] - 28); c.quadraticCurveTo((L[0] + R[0]) / 2, L[1] - 62, L[0] + (R[0] - L[0]) * .78, L[1] - 28); c.stroke();
    }
    // front outline, revealed A -> R -> L -> A
    c.strokeStyle = '#F2EEDC'; c.lineWidth = 9; c.lineJoin = c.lineCap = 'round';
    const pts = [A, R, L, A], len = [0]; for (let i = 1; i < 4; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    let want = Math.min(1, pr) * len[3]; c.beginPath(); c.moveTo(A[0], A[1]);
    for (let i = 1; i < 4 && want > 0; i++) { const sl = len[i] - len[i - 1], k = Math.min(1, want / sl); c.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k); want -= sl; }
    c.stroke();
    // guide circle + dashes
    const ca = sst(252, 258, f) * (1 - sst(274, 277, f)) * .3; if (ca > .01) { const cx = (A[0] + L[0] + R[0]) / 3, cy = (A[1] + L[1] + R[1]) / 3 - 20; c.strokeStyle = `rgba(190,200,235,${ca})`; c.lineWidth = 1.3; c.setLineDash([3, 6]); c.beginPath(); c.arc(cx, cy, 335, 0, TAU); c.stroke();
      c.setLineDash([12, 9]); c.beginPath(); c.moveTo(ex[0] + 330, ex[1] - 120); c.lineTo(ex[0], ex[1]); c.moveTo(en[0] - 330, en[1] - 130); c.lineTo(en[0], en[1]); c.stroke(); c.setLineDash([]); }
  }

  // ---------- fan / band: edges are lines T(x), B(x), 7 equal bands
  const FK = [[254, 467, .0917, -34, .631], [255, 458, .1026, -39, .642], [256, 454, .1101, -41, .6512], [257, 463, .107, -67, .6751], [258, 465, .1104, -62, .6793], [259, 465, .1141, -55, .6811], [260, 469, .1153, -43, .6794],
    [261, 447, .1333, -34, .6836], [262, 459, .1259, -17, .6741], [263, 472, .1164, 3, .6599], [265, 511, .0896, 64, .6167], [267, 526, .0789, 86, .6027], [269, 545, .065, 83, .6042], [271, 547, .0669, 87, .6066], [272, 545, .0696, 86, .6087],
    [273, 514, .0917, 72, .6253], [274, 515, .09, 86, .6187], [275, 518, .0813, 181, .5758], [276, 514, .0623, 388, .4706], [277, 482, .0353, 642, .2837], [278, 432, .0139, 725, .1174], [279, 402, .0046, 709, .035], [280, 391, .0008, 693, .0046],
    [281, 386, 0, 692, 0], [284, 388, 0, 692, 0]];
  const FT0 = keys(FK, 1), FTk = keys(FK, 2), FB0 = keys(FK, 3), FBk = keys(FK, 4);
  function streaks(c, f) {
    const a = sst(275, 277, f) * (1 - sst(282, 285, f)); if (a < .01) return;
    if (!STREAK) { const r = K.rng(21); STREAK = []; for (let i = 0; i < 55; i++) STREAK.push([r() * W, r() * H, 90 + r() * 330, .12 + r() * .25]); }
    c.lineWidth = 1.5; for (const [x, y, l, al] of STREAK) { const xx = ((x - (f - 275) * 160) % (W + 400) + W + 400) % (W + 400) - 200; c.strokeStyle = `rgba(150,160,205,${al * a})`; c.beginPath(); c.moveTo(xx, y); c.lineTo(xx + l, y); c.stroke(); }
  }
  function fan(c, f, x0, x1, wig = 0) {
    const fc = Math.min(284, f), t0 = FT0(fc), tk = FTk(fc), b0 = FB0(fc), bk = FBk(fc);
    const g = prismGeom(f), xa = f < 275.5 ? g.ex[0] : Math.max(-60, g.ex[0]);
    const T = x => t0 + tk * x, B = x => b0 + bk * x, wv = (x, i) => wig ? wig * Math.sin(x / 120 + i * .5 - f * 1.3) * (1 - sst(0, 1400, x)) : 0;
    const xs = []; for (let x = Math.max(x0, xa); x <= x1 + 40; x += 40) xs.push(x);
    if (f < 276) { /* fan starts at the exit point */ }
    for (let i = 0; i < 7; i++) {
      c.beginPath(); xs.forEach((x, j) => { const y = T(x) + (B(x) - T(x)) * i / 7 + wv(x, i); j ? c.lineTo(x, y) : c.moveTo(x, y); });
      for (let j = xs.length - 1; j >= 0; j--) { const x = xs[j]; c.lineTo(x, T(x) + (B(x) - T(x)) * (i + 1) / 7 + wv(x, i + 1) + .6); }
      c.closePath(); c.fillStyle = rgb(COL[i]); c.fill(); c.strokeStyle = 'rgba(25,15,45,.5)'; c.lineWidth = 1.4; c.stroke();
    }
  }

  // ---------- 3D helix
  const Rh = 150, SEQ = [[71, 195, 107], [246, 212, 61], [48, 157, 229], [246, 138, 48]];
  const PSI = mono([[285, 17], [300, 17], [302, 19], [304, 28], [305, 40], [306, 62], [307, 75], [308, 82], [310, 87], [312, 90], [330, 90]].map(k => [k[0], k[1] * Math.PI / 180]));
  const FV = mono([[285, 6000], [299, 6000], [301, 3000], [303, 1500], [305, 1000], [330, 1000]]);
  const DC = mono([[285, 6000], [299, 6000], [301, 3000], [303, 1500], [304, 800], [305, 520], [306, 400], [308, 330], [310, 290], [312, 270], [330, 270]]);
  const PIT = mono([[285, 481], [303, 481], [306, 420], [308, 360], [312, 315], [330, 315]]);
  const DMIN = mono([[306, 25], [308, 60], [309, 170], [310, 260], [312, 235], [318, 274], [321, 395], [330, 395]]);
  const SCAM = mono([[285, 0], [303, 0], [306, 250], [308, 450], [310, 560], [312, 600], [330, 600]]);
  const XA = [[285, 585], [286, 584], [287, 583], [288, 581], [289, 579], [290, 573], [291, 568], [292, 558], [293, 550], [294, 539], [295, 527], [296, 514], [297, 499], [298, 487], [299, 474], [300, 467], [301, 464]];
  const R301 = .6 + Math.PI / 2 - TAU * (464 - 960) / 460;
  const ROT = mono(XA.map(k => [k[0], .6 + Math.PI / 2 - TAU * (k[1] - 960) / 460]).concat([[303, R301 + .05], [306, R301 + .4], [312, R301 + 1.6], [321, R301 + 3], [330, R301 + 4.2]]));
  const OFF = -2.5;
  const CX = mono([[285, 960], [304, 960], [306, 700], [309, 800], [312, 940], [330, 990]]), CY = mono([[285, 540], [304, 540], [306, 560], [309, 520], [312, 540], [330, 540]]);
  const OX = mono([[285, 0], [306, 0], [321, 70], [330, 90]]);
  const hs = (i, k) => K.hash(i * 3.17 + k * 7.1);
  function helix(c, f, xa, xb, o = {}) {
    const F = FV(f), psi = PSI(f), dc = DC(f), p = PIT(f), sc = SCAM(f), rot = ROT(f) + sst(307, 309, f) * (__X__), cx = CX(f), cy = CY(f), ox = OX(f), cs = Math.cos(psi), sn = Math.sin(psi);
    const dotm = o.dots || 0, rungMix = sst(305, 312, f), cr = -0.85 + (0.62 + .85) * rungMix, rungA = 1 - sst(321, 322.5, f);
    const proj = (phi, rr, rotk) => { const s = p * phi / TAU - sc, y = -rr * Math.sin(phi + rotk), z = rr * Math.cos(phi + rotk), xp = s * cs + z * sn - ox, zc = -s * sn + z * cs, d = dc + zc; return d < DMIN(f) ? null : { x: cx + F * xp / d, y: cy + F * y / d, d, sc: F / d, z }; };
    const items = [], step = dotm ? .09 : .07, CH = 10;
    const phiMin = (sc - 9000) / p * TAU, phiMax = (sc + dc + 600) / p * TAU;
    const pa = (Math.floor(phiMin / step)) * step;
    for (let k = 0; k < 2; k++) {
      let ch = [], prev = null;
      for (let phi = pa; phi < Math.min(phiMax, pa + 260); phi += step) { const a = proj(phi, Rh, rot + k * OFF);
        if (a) { ch.push(a); if (ch.length > CH) { items.push({ t: 0, k, pts: ch, d: ch.reduce((u, q) => u + q.d, 0) / ch.length }); ch = [a]; } } else { if (ch.length > 1) items.push({ t: 0, k, pts: ch, d: ch.reduce((u, q) => u + q.d, 0) / ch.length }); ch = []; } }
      if (ch.length > 1) items.push({ t: 0, k, pts: ch, d: ch.reduce((u, q) => u + q.d, 0) / ch.length });
    }
    if (rungA > 0) for (let j = Math.floor(phiMin / .5); j * .5 < Math.min(phiMax, pa + 260); j++) { const phi = j * .5, a = proj(phi, Rh * .86, rot), bb = proj(phi, Rh * (.86 * (1 - rungMix) + .55 * rungMix), rot + OFF * (1 - rungMix));
      if (a && bb && Math.min(a.d, bb.d) > DMIN(f) * 1.15 && Math.hypot(a.x - bb.x, a.y - bb.y) < 260) items.push({ t: 1, j, a, b: bb, d: (a.d + bb.d) / 2 }); }
    items.sort((u, v) => v.d - u.d);
    c.save(); c.beginPath(); c.rect(xa, 0, xb - xa, H); c.clip(); c.lineCap = 'round';
    const COLS = [[[158, 86, 228], [100, 62, 166]], [[238, 62, 62], [128, 36, 52]]];
    for (const it of items) {
      if (it.t === 0) {
        const pts = it.pts, mid = pts[pts.length >> 1], z = pts.reduce((u, q) => u + q.z, 0) / pts.length, sh = Math.max(0, Math.min(1, .5 - z / (2 * Rh) * (.5 + .5 * Math.max(0, Math.cos(psi))))), col = COLS[it.k];
        const w = Math.min(34, 23 * Math.pow(mid.sc, .7)) * (dotm ? .8 : 1), cc = [0, 1, 2].map(q => col[1][q] + (col[0][q] - col[1][q]) * (sh * sh * (3 - 2 * sh)));
        if (dotm) { c.fillStyle = rgb(cc); for (const q of pts) { if (q === pts[0]) continue; const r = Math.min(10, 9 * Math.pow(q.sc, .6)); c.beginPath(); c.ellipse(q.x, q.y, r * 1.2, r * .85, -.3, 0, TAU); c.fill(); } continue; }
        c.lineJoin = 'round'; c.lineCap = 'butt'; c.strokeStyle = 'rgba(14,10,36,.85)'; c.lineWidth = w + 7; c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y)); c.stroke();
        c.lineCap = 'round'; c.strokeStyle = rgb(cc); c.lineWidth = w; c.stroke();
      } else {
        const { a, b } = it, j = it.j, sp = .25 + .5 * hs(j, 1), c1 = SEQ[(hs(j, 2) * 4) | 0], c2 = SEQ[(hs(j, 3) * 4) | 0], w = Math.min(13, 9 * Math.pow((a.sc + b.sc) / 2, .6)), al = rungA * (.55 + .45 * Math.max(0, 1 - (a.d - dc) / 900));
        const m = [a.x + (b.x - a.x) * sp, a.y + (b.y - a.y) * sp]; c.lineCap = 'round'; c.lineWidth = w; c.strokeStyle = rgb(c1, al); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(m[0], m[1]); c.stroke(); c.strokeStyle = rgb(c2, al); c.beginPath(); c.moveTo(m[0], m[1]); c.lineTo(b.x, b.y); c.stroke();
      }
    }
    c.restore();
  }

  // ---------- unravel: band -> helix sweep (f 285..292)
  const XF = mono([[284.5, -40], [285, 0], [286, 200], [287, 390], [288, 780], [289, 1050], [290, 1260], [291, 1680], [292, 2050]]);
  const XT = mono([[284.5, -40], [285, 0], [286, 285], [287, 1350], [288, 2100], [292, 2200]]);
  function ticks(c, f, x0, x1) {
    const t0 = FT0(284), b0 = FB0(284); for (let x = Math.ceil(x0 / 27) * 27; x < x1; x += 27) for (let i = 0; i < 7; i++) { c.fillStyle = rgb(COL[i]); c.fillRect(x, 480 + i * 17, 7, 15); } }

  // ---------- dots (f 322..)
  function seeds(c, f) { const n = (f - 323) * 14; const r = K.rng(33); c.fillStyle = '#9C9230'; for (let i = 0; i < n && i < 140; i++) { const a = r() * TAU, q = Math.sqrt(r()) * (50 + (f - 323) * 8); c.beginPath(); c.ellipse(960 + 8 + Math.cos(a) * q, 540 + Math.sin(a) * q, 4, 2.5, a, 0, TAU); c.fill(); } }

  SC.add(10.25, 13.667, { draw(c, t) {
    const f = t * 24 + 1;
    bg(c);
    if (f < 254) { paper(c, f); prism(c, f); }
    else if (f < 277.5) { if (f < 274.5) fan(c, f, 0, W); else fan(c, f, 0, W); streaks(c, f); prism(c, f); }
    else if (f < 285) { streaks(c, f); fan(c, f, 0, W, f > 284 ? 18 : 0); }
    else if (f < 292) { const xf = XF(f), xt = XT(f); if (xt < W + 100) { fan(c, 284, xt, W, f < 286 ? 10 : 0); } ticks(c, f, xf, Math.min(W, xt)); helix(c, f, 0, xf, {}); }
    else if (f < 322) helix(c, f, 0, W);
    else { helix(c, f, 0, W, { dots: 1 }); seeds(c, f); }
  } });
})();
