// s4_bloom.js: segment D (13.667–21.25): peach disc → seeds → sunflower → birds → galaxy → black hole. One particle set (identity i) carries
// seed (phyllotaxis head) → bird (flock) → star (galaxy) → accretion streak. Everything is a pure function of t.
(() => {
  const { hash, sstep, mono, ease, mix } = K;
  const N = 2000, CX = 960, CY = 540, HR = 225, GA = 2.39996323;
  const hc = (i, k) => hash(i * 12.9898 + k * 78.233);
  const gauss = (i, k) => Math.sqrt(-2 * Math.log(hc(i, k) * .999 + .0005)) * Math.cos(6.2831853 * hc(i, k + 50));
  const lerp = (a, b, k) => a + (b - a) * k;
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

  // ---- particle table (static cache) ----
  const P = [];
  let sS = 0, sV = 0;
  for (let i = 0; i < N; i++) {
    const ru = Math.sqrt(hc(i, 1)), pa = hc(i, 2) * 6.2832, g1 = 2 * ru * Math.cos(pa), g2 = 2 * ru * Math.sin(pa), s = g1;
    let ix, iy, ib = 0; if (i % 4 === 0) { const j = i / 4, r = Math.sqrt(280 * 280 + 2116 * j), th = .0662 * (r - 280) + 1.2; ix = r * Math.cos(th); iy = r * Math.sin(th); ib = 1 + (j & 1); } else { const k = 1.0; ix = HR * Math.sqrt((i + .5) / N) * Math.cos(i * GA) * k; iy = HR * Math.sqrt((i + .5) / N) * Math.sin(i * GA) * k; }
    const p = { ix, iy, ib, i, sx: HR * Math.sqrt((i + .5) / N) * Math.cos(i * GA), sy: HR * Math.sqrt((i + .5) / N) * Math.sin(i * GA), sr: HR * Math.sqrt((i + .5) / N), g1: s, g2, ph: hc(i, 3) * 6.28, rel: 15.55 + .42 * hc(i, 4), jx: gauss(i, 5), jy: gauss(i, 6), r4: hc(i, 7) };
    p.isCore = hc(i, 9) < .6; p.w = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(s) / 2.05, 2)), .12); p.v = g2 * p.w;
    const rho = Math.pow(ru, 1.3);
    p.rho = rho; p.phi = pa;
    sS += s * s; sV += p.v * p.v; P.push(p);
  }
  sS = Math.sqrt(sS / N); sV = Math.sqrt(sV / N);
  P.forEach(p => { p.sn = p.g1 / sS; p.vn = p.v / sV; });

  // ---- background ----
  const BGK = [ // t, [TL, TR, BL, BR, topMid, botMid]
    [13.79, 'ea937c eb947d f7d6a3 f6d5a2 eeac92 fadeaf f0b48f'], [14.5, 'e9927c eb937b f6d5a2 f5d4a1 ecaa90 f9ddae efb38e'], [15.0, 'e9937c eb937c f6d5a2 f5d4a1 ecaa90 f8dcad efb38e'],
    [15.5, 'cb807a ce817b f2c699 f2c699 d5978c f5d3a6 e3a389'], [15.75, 'a96b77 aa6b78 efba8f eeb98e b47d83 f4c89c d28f88'], [16.0, '805173 825275 e8a882 e7a781 8a5e7a e8b088 bd7686'],
    [16.25, '5f3d70 603e71 e39a77 e29975 604072 e6a079 a85f82'], [16.5, '4d316e 4e326f e29172 e19171 49316e e59672 9e5381'], [16.75, '49306e 4c3170 e19170 e09170 452f6c e49571 a05282'],
    [17.0, '442c68 442c68 d18868 d18769 412c67 d48b68 964d7b'], [17.25, '33234f 33224f 925e51 925e50 31214e 946051 68385d'], [17.5, '1d1635 1d1635 442f34 432e34 221b3f 372a3e 321f3b'],
    [17.6, '15132b 15132b 2b212c 2b212c 1e1b3a 2b233c 221831'], [17.75, '0e0f23 0e0f23 121123 121123 1b1a39 1d1a39 131126'], [18.0, '0d0e22 0c0d21 0d0e22 0c0d21 1b1a39 1b1a39 0e0f23']]
    .map(([t, s]) => [t, s.split(' ').map(h => rgb('#' + h))]);
  const bgCv = K.canvas(64, 36), bgc = bgCv.getContext('2d'), bgId = bgc.createImageData(64, 36);
  function bgCols(t) {
    let i = 0; while (i < BGK.length - 2 && t > BGK[i + 1][0]) i++;
    const a = BGK[i], b = BGK[i + 1], u = Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0])));
    return a[1].map((c, j) => c.map((v, k) => v + (b[1][j][k] - v) * u));
  }
  function drawBG(c, t) {
    const [TL, TR, BL, BR, TM, BM, MC] = bgCols(t), d = bgId.data;
    for (let y = 0; y < 36; y++) for (let x = 0; x < 64; x++) {
      const u = x / 63, v = y / 35, wm = 1 - (2 * u - 1) * (2 * u - 1);
      for (let k = 0; k < 3; k++) {
        const top = lerp(TL[k], TR[k], u) + (TM[k] - lerp(TL[k], TR[k], u)) * wm, bot = lerp(BL[k], BR[k], u) + (BM[k] - lerp(BL[k], BR[k], u)) * wm;
        const mid = MC[k] + (0) ; d[(y * 64 + x) * 4 + k] = v < .5 ? top + (mid - top) * v * 2 : mid + (bot - mid) * (v - .5) * 2;
      }
      d[(y * 64 + x) * 4 + 3] = 255;
    }
    bgc.putImageData(bgId, 0, 0); c.imageSmoothingEnabled = true; c.drawImage(bgCv, 0, 0, W, H);
  }

  // ---- sunflower ----
  const petals = [];
  for (let L = 0; L < 2; L++) for (let k = 0; k < 21; k++) {
    const id = L * 40 + k;
    petals.push({ L, th: (k + L * .5) / 21 * 6.2832 + (hc(id, 9) - .5) * .16, len: (L ? 175 : 205) * (.88 + .24 * hc(id, 10)), w: (L ? 56 : 62) * (.9 + .2 * hc(id, 11)), d: 14.08 + .3 * hc(id, 12), bend: (hc(id, 13) - .5) * .5 });
  }
  const dropY = mono([[15.5, 0], [15.583, 50], [15.667, 140], [15.75, 250], [15.833, 330], [15.9, 800], [16.0, 1100]]);
  const headState = t => { // sway on twos 14.6–15.1
    const tw = t > 14.6 && t < 15.15 ? Math.floor(t * 12) / 12 : t;
    return { x: CX + 3 * Math.sin(tw * 4.3), y: 543 + dropY(t) + 2 * Math.sin(tw * 3.1), rot: .035 * Math.sin(tw * 3.7) + .12 * (t - 14.6) };
  };
  const seedCols = ['#cdbd50', '#8e6c2c', '#6c4721', '#5a3a1a', '#4b3015', '#3e2812'];
  function seedPos(p, t, h) {
    const cs = Math.cos(h.rot), sn = Math.sin(h.rot);
    let x = p.sx, y = p.sy;
    if (t < 13.95) { const u = sstep(13.69 + .06 * p.r4, 13.93, t); x = lerp(p.ix, p.sx, u) + p.jx * 24 * Math.sin(3.14 * u) * (1 - u); y = lerp(p.iy, p.sy, u) + p.jy * 24 * Math.sin(3.14 * u) * (1 - u); }
    return [h.x + x * cs - y * sn, h.y + x * sn + y * cs];
  }
  function drawFlower(c, t) {
    const h = headState(t), R = HR;
    c.save(); c.translate(h.x, h.y); c.rotate(h.rot);
    
    // sepals
    if (t > 14.1) for (let k = 0; k < 14; k++) {
      const th = k / 14 * 6.2832 + .2, g = ease.out(Math.min(1, Math.max(0, (t - 14.1 - .1 * hc(k, 20)) / .3)));
      c.save(); c.rotate(th); c.fillStyle = '#3f7a2e'; c.strokeStyle = '#2b3a14'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(R - 5, -16); c.quadraticCurveTo(R + 60 * g, -18, R + 120 * g, 0); c.quadraticCurveTo(R + 60 * g, 18, R - 5, 16); c.closePath(); c.fill(); c.stroke(); c.restore();
    }
    for (const L of [0, 1]) for (const p of petals) {
      if (p.L !== L) continue;
      const g = ease.out(Math.min(1, Math.max(0, (t - p.d) / .35)));
      if (g <= 0) continue;
      const len = p.len * g, w = p.w * (.35 + .65 * g), bend = p.bend * g;
      c.save(); c.rotate(p.th + (1 - g) * .5); c.translate(R - 18, 0);
      c.fillStyle = L ? '#f2a812' : '#f8b81c'; c.strokeStyle = '#3b2a10'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(0, -w * .3); c.bezierCurveTo(len * .3, -w * .6, len * .75, -w * .42 + bend * 20, len, bend * 30);
      c.bezierCurveTo(len * .75, w * .42 + bend * 20, len * .3, w * .6, 0, w * .3); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = 'rgba(190,110,10,.55)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(len * .1, 0); c.lineTo(len * .85, bend * 26); c.stroke(); c.restore();
    }
    // head
    const rel = P.reduce((s, p) => s + (t > p.rel ? 1 : 0), 0) / N;
    c.globalAlpha = sstep(13.8, 13.95, t); c.fillStyle = '#2c1a0c'; c.strokeStyle = '#1d1209'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, R, 0, 6.2832); c.fill(); c.stroke(); c.globalAlpha = 1;
    const gr = c.createRadialGradient(0, 0, 0, 0, 0, R * .3); gr.addColorStop(0, '#c8b44a'); gr.addColorStop(.6, '#9a8636'); gr.addColorStop(1, 'rgba(80,55,22,0)');
    c.fillStyle = gr; c.beginPath(); c.arc(0, 0, R * .3, 0, 6.2832); c.fill();
    c.restore();
  }
  function drawSeeds(c, t, h, upTo) {
    const m = sstep(13.72, 13.92, t);
    c.save();
    for (let b = 0; b < 12; b++) {
      if (t >= 13.9) { c.fillStyle = b < 6 ? seedCols[b] : mix(seedCols[b - 6], '#a07a3a', .35); c.beginPath(); }
      for (const p of P) {
        if (t > p.rel) continue;
        if (Math.min(5, Math.floor(p.sr / HR * 6)) + (p.i % 3 === 0 ? 6 : 0) !== b) continue;
        const [x, y] = seedPos(p, t, h);
        if (t < 13.9) { c.fillStyle = mix(p.ib === 1 ? '#e0453c' : p.ib === 2 ? '#9a55d8' : seedCols[b % 6], seedCols[b % 6], p.ib ? m : 1); c.beginPath(); }
        const sz = lerp(p.ib ? 2.2 : 1.2, 1, sstep(13.667, 13.95, t));
        c.moveTo(x + 7 * sz, y); c.ellipse(x, y, 7 * sz, 4.3 * sz, p.i * GA + h.rot, 0, 6.2832);
        if (t < 13.9) { c.fill(); c.strokeStyle = 'rgba(40,20,10,.5)'; c.lineWidth = 1; c.stroke(); }
      }
      if (t >= 13.9) c.fill();
    }
    c.restore();
  }

  // ---- flock ----
  const FK = (f) => mono([[16.0, f[0]], [16.25, f[1]], [16.5, f[2]], [16.75, f[3]], [17.0, f[4]], [17.25, f[5]], [17.5, f[6]]]);
  const fCX = FK([852, 927, 986, 978, 922, 966, 985]), fCY = FK([455, 431, 451, 494, 494, 537, 545]), fA = FK([553, 480, 400, 360, 320, 290, 300]), fB = FK([88, 78, 66, 66, 78, 100, 105]);
  const fAng = FK([.05, 0, .1, .22, .26, .03, 0]), fArch = FK([.6, .9, 1, .6, .25, 0, 0]);
  function flockPos(p, t) {
    const a = fA(t), b = fB(t), ang = fAng(t), ar = fArch(t), cf = lerp(.16, 1, sstep(16.25, 16.85, t));
    let x = a * p.sn, y = b * p.vn * (p.isCore ? cf : 1) - ar * b * 1.2 * (1 - Math.min(1, p.sn * p.sn / 6)) * .8;
    y += 75 * (1 - sstep(16.0, 16.9, t)) * Math.sin(p.sn * 1.7 + t * 1.2); // wavy band while it is still spread across the sky
    x += 22 * Math.sin(t * 2.3 + p.ph) + 8 * Math.sin(t * 5.1 + p.ph * 2); y += 14 * Math.cos(t * 2.9 + p.ph * 1.7) + 5 * Math.sin(t * 6 + p.ph);
    const cs = Math.cos(ang), sn = Math.sin(ang);
    return [fCX(t) + x * cs - y * sn, fCY(t) + x * sn + y * cs];
  }
  // ---- galaxy / disk ----
  const GAx = 700, GBy = 235, GCx = 960, GCy = 545;
  const galPos = (p, t) => { const f = p.phi + .09 / (p.rho + .25) * (t - 17.5); return [GCx + GAx * p.rho * Math.cos(f), GCy + GBy * p.rho * Math.sin(f)]; };
  const Sc = mono([[20.5, 1], [20.8, .97], [20.9, .89], [21.0, .78], [21.042, .6], [21.1, .48], [21.167, .4], [21.3, .38]]);
  const dA = mono([[18.8, 440], [19.0, 452], [19.1, 470], [19.3, 555], [19.6, 590], [20.0, 616], [20.9, 616]]), dBr = mono([[19, .36], [19.6, .35], [20, .34], [20.9, .31], [21.25, .3]]);
  const dRot = mono([[19, 0], [19.6, -.07], [20, -.2], [20.5, -.25], [20.9, -.27], [21.1, -.32], [21.25, -.4]]), hR = mono([[19, 88], [20, 104], [20.9, 104]]), hatK = mono([[19, 2], [19.3, 2.4], [19.6, 2.65], [20, 2.9], [20.5, 3.15], [20.9, 3.2]]);
  const tiltK = t => sstep(19.4, 20.1, t);
  const BHx = 955, BHy = 535;
  function diskGeom(t) {
    const s = Sc(t), a = dA(t) * s, r = hR(t) * s, tk = tiltK(t);
    return { s, a, b: a * dBr(t), rot: dRot(t), r, Rh: r * hatK(t), x: BHx + (1 - s) * 0, y: BHy, cx: BHx + 8 * tk * s, cy: BHy - 28 * tk * s };
  }
  const diskPos = (p, t, G) => {
    const q = .55 + .52 * Math.pow(p.rho, .8), f = p.phi + .35 / (q + .25) * (t - 18.9), ex = G.a * q * Math.cos(f), ey = G.b * q * Math.sin(f), cs = Math.cos(G.rot), sn = Math.sin(G.rot);
    return { x: G.cx + ex * cs - ey * sn, y: G.cy + ex * sn + ey * cs, q, f, tx: (-G.a * Math.sin(f)) * cs - (G.b * Math.cos(f)) * sn, ty: (-G.a * Math.sin(f)) * sn + (G.b * Math.cos(f)) * cs };
  };
  const qCols = ['#fff3c4', '#ffd25a', '#f9a043', '#f06a58', '#d8479a', '#a640a8'];
  const qIdx = q => q < .6 ? 0 : q < .72 ? 1 : q < .86 ? 2 : q < .97 ? 3 : q < 1.04 ? 4 : 5;

  function drawParticles(c, t, h) {
    // positions of released particles
    const dg = t > 18.8 ? diskGeom(t) : null;
    const pts = [];
    for (const p of P) {
      if (t <= p.rel) continue;
      let x, y, hx, hy;
      const f1 = flockPos(p, Math.max(16, t)), f2 = flockPos(p, Math.max(16, t) + .03);
      if (t < 16.6) {
        const hh = headState(p.rel), s0 = seedPos(p, p.rel, hh), e = sstep(0, 1, (t - p.rel) / .42), e2 = sstep(0, 1, (t + .03 - p.rel) / .42);
        const fun = (px, ee) => px + (CX - px) * .88 * Math.sin(Math.PI * ee) * (1 - ee * .3);
        x = fun(lerp(s0[0], f1[0], e), e); y = lerp(s0[1], f1[1], e);
        hx = fun(lerp(s0[0], f2[0], e2), e2) - x; hy = lerp(s0[1], f2[1], e2) - y; const m = Math.hypot(hx, hy) || 1, fa = fAng(t) + (p.r4 - .5) * 1.5; hx = lerp(hx / m, Math.cos(fa), e * e); hy = lerp(hy / m, Math.sin(fa), e * e);
      } else { const fa = fAng(Math.min(t, 17.5)) + (p.r4 - .5) * 1.5 + .5 * Math.sin(t * 2.6 + p.ph); x = f1[0]; y = f1[1]; hx = Math.cos(fa); hy = Math.sin(fa); }
      let col = 0, al = .92, len = 10.5;
      const tg = t > 17.3 ? sstep(0, 1, (t - 17.3 - .25 * p.r4) / .4) : 0;
      if (tg > 0) {
        const g = galPos(p, t), g2 = galPos(p, t + .03);
        x = lerp(x, g[0], tg); y = lerp(y, g[1], tg); hx = lerp(hx, p.jx, tg); hy = lerp(hy, p.jy * .8 - 1, tg);
        col = tg; len = lerp(9.5, 10, tg);
      }
      let q = 0, td = 0;
      if (dg) {
        td = sstep(0, 1, (t - 18.78 - .04 * p.r4) / .1);
        if (td > 0) { const d = diskPos(p, t, dg); x = lerp(x, d.x, td); y = lerp(y, d.y, td); const L = Math.hypot(d.tx, d.ty); hx = lerp(hx, d.tx / L, td); hy = lerp(hy, d.ty / L, td); q = d.q; len = lerp(len, 12 + 34 * d.q * dg.s, td); }
      }
      pts.push([x, y, Math.atan2(hy, hx || 1e-6), col, td, q, len, p]);
    }
    // birds
    const lw = 3.1;
    c.lineCap = 'round';
    const buckets = new Map();
    for (const q of pts) {
      let key;
      if (q[4] > .02) key = 'd' + qIdx(q[5]);
      else if (q[3] > .02) key = 'g' + Math.round(q[3] * 6);
      else key = 'b';
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(q);
    }
    for (const [key, arr] of buckets) {
      let style, w = lw, al = .92;
      if (key === 'b') style = '#1c0e28';
      else if (key[0] === 'g') { const k = +key.slice(1) / 6; style = mix('#24112f', '#f0aa3c', k); al = lerp(.92, .9, k); w = lerp(2.6, 2.8, k); }
      else { style = qCols[+key.slice(1)]; w = 2.4; al = 1; }
      c.strokeStyle = style; c.globalAlpha = al; c.lineWidth = w; c.beginPath();
      for (const q of arr) { const dx = Math.cos(q[2]) * q[6] / 2, dy = Math.sin(q[2]) * q[6] / 2; c.moveTo(q[0] - dx, q[1] - dy); c.lineTo(q[0] + dx, q[1] + dy); }
      c.stroke();
    }
    c.globalAlpha = 1;
  }

  const ell = (c, x, y, rx, ry, rot) => { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, 6.2832); };
  function drawGalaxyDeco(c, t) {
    const a = sstep(17.4, 17.9, t) * (1 - sstep(18.7, 18.95, t)), core = sstep(17.45, 17.9, t) * (1 - sstep(18.7, 18.88, t));
    if (a <= 0) return;
    c.save(); c.translate(GCx, GCy); c.scale(1, GBy / GAx);
    let g = c.createRadialGradient(0, 0, 0, 0, 0, 460); g.addColorStop(0, 'rgba(255,205,165,' + .75 * core + ')'); g.addColorStop(.35, 'rgba(240,160,120,' + .4 * core + ')'); g.addColorStop(1, 'rgba(180,100,100,0)');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, 460, 0, 6.2832); c.fill();
    c.strokeStyle = 'rgba(190,190,240,' + .35 * a + ')'; c.lineWidth = 1.4 * (GAx / GBy) * .35;
    c.setLineDash([]); c.beginPath(); c.arc(0, 0, 700 * 1.0, 0, 6.2832); c.stroke(); c.beginPath(); c.arc(0, 0, 330, 0, 6.2832); c.stroke();
    c.setLineDash([6, 8]); c.beginPath(); c.arc(0, 0, 790, 0, 6.2832); c.stroke();
    c.restore();
  }

  function drawBH(c, t, part) {
    const G = diskGeom(t), ap = sstep(18.84, 18.95, t), s = G.s;
    if (part === 0 && t > 18.8 && t < 19.9) { // thin construction rings
      const ra = (sstep(18.88, 19.0, t) * (1 - sstep(19.5, 19.9, t))) * .55;
      c.strokeStyle = 'rgba(200,200,255,' + ra + ')'; c.lineWidth = 1.5; c.setLineDash([]); ell(c, G.cx, G.cy, G.a * 1.2, G.b * 1.25, G.rot); c.stroke();
      c.setLineDash([5, 7]); ell(c, G.cx, G.cy, G.a * 1.45, G.b * 1.5, G.rot); c.stroke(); c.setLineDash([]); c.beginPath(); c.arc(G.cx, G.cy, G.Rh * 1.4, 0, 6.2832); c.stroke();
    }
    // halo (shrink phase)
    const halo = sstep(20.95, 21.1, t) * .6;
    if (part === 0 && halo > 0) { const gr = c.createRadialGradient(G.cx, G.cy, 0, G.cx, G.cy, G.a * 1.7); gr.addColorStop(0, 'rgba(255,170,110,' + halo + ')'); gr.addColorStop(1, 'rgba(255,150,100,0)'); c.fillStyle = gr; c.fillRect(0, 0, W, H); }
    if (ap <= 0) return;
    if (part === 0) {
    c.save(); c.translate(G.cx, G.cy); c.rotate(G.rot); c.scale(1, G.b / G.a);
    const fo = mono([[18.9, .7], [19, .8], [19.1, .9], [19.2, 1]])(t), qi = mono([[18.9, .7], [19, .62], [19.1, .52], [19.3, .3], [19.5, .28]])(t);
    const gr = c.createRadialGradient(0, 0, G.a * qi, 0, 0, G.a * fo);
    gr.addColorStop(0, '#fff1c0'); gr.addColorStop(.15, '#ffe07a'); gr.addColorStop(.45, '#fab048'); gr.addColorStop(.72, '#f48c46'); gr.addColorStop(.88, '#ea6a70'); gr.addColorStop(1, '#c044a0');
    c.globalAlpha = ap; c.fillStyle = gr; c.beginPath(); c.arc(0, 0, G.a * fo, 0, 6.2832); c.arc(0, 0, G.a * qi, 0, 6.2832, true); c.fill('evenodd');
    c.globalAlpha = 1; c.fillStyle = '#0a0a1c'; c.beginPath(); c.arc(0, 0, G.a * qi * 1.02, 0, 6.2832); c.fill();
    c.restore(); return; }
    // hat
    const hx = BHx, hy = BHy, hap = ap, r = G.r;
    c.save(); c.translate(hx, hy); c.rotate(G.rot * .6); c.globalAlpha = sstep(19.0, 19.12, t);
    const bands = [[1, '#b03a80'], [.96, '#ee7a4a'], [.75, '#f79a52'], [.52, '#fbc890'], [.32, '#fdf0dc'], [.14, '#fff5cc'], [0, '#fff5cc']];
    for (let k = 0; k < bands.length - 1; k++) { const R = r + (G.Rh - r) * bands[k][0]; c.fillStyle = bands[k][1]; c.beginPath(); c.arc(0, 0, R, Math.PI, 0); c.closePath(); c.fill(); }
    c.fillStyle = '#fff2c6'; c.beginPath(); c.arc(0, 0, r * 1.12, 0, 6.2832); c.fill();
    c.restore(); c.globalAlpha = 1;
    // hole + shadow wedge
    c.fillStyle = '#07070f'; c.globalAlpha = hap; c.beginPath(); c.moveTo(hx - 2 * r, hy + .7 * r); c.lineTo(hx - .8 * r, hy + .05 * r); c.lineTo(hx - .8 * r, hy + 1.0 * r); c.closePath(); c.moveTo(hx + 1 * r, hy + .05 * r); c.lineTo(hx + 2.1 * r, hy); c.lineTo(hx + 1 * r, hy + .6 * r); c.closePath(); c.fill();
    c.globalAlpha = 1; c.fillStyle = '#0b0b14'; c.beginPath(); c.arc(hx, hy, r, 0, 6.2832); c.fill();
    c.strokeStyle = '#fbe4b8'; c.lineWidth = 5 * s; c.beginPath(); c.arc(hx, hy, r * 1.1, .15, Math.PI - .35); c.stroke();
    c.globalAlpha = 1;
    // glint
    const gl = sstep(20.95, 21.06, t), gs = r * (1.05 + .06 * Math.sin(t * 30));
    if (gl > 0) { c.fillStyle = mix('#555560', '#ffffff', sstep(21.0, 21.08, t)); c.globalAlpha = gl; c.beginPath();
      for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; c.lineTo(hx + Math.cos(a) * gs, hy + Math.sin(a) * gs); c.lineTo(hx + Math.cos(a + .785) * gs * .24, hy + Math.sin(a + .785) * gs * .24); }
      c.closePath(); c.fill(); c.globalAlpha = 1; }
  }
  const streaks = []; for (let k = 0; k < 46; k++) streaks.push([hc(k, 30) * 6.2832, 380 + 500 * hc(k, 31), 50 + 170 * hc(k, 32)]);

  SC.add(13.667, 21.25, { draw: (c, t) => {
    const h = headState(t);
    c.fillStyle = '#0a0a22'; c.fillRect(0, 0, W, H);
    const dr = mono([[13.667, 600], [13.708, 830], [13.75, 1100], [13.79, 1400]])(t);
    if (t < 13.79) { c.save(); c.beginPath(); c.arc(CX, CY, dr, 0, 6.2832); c.clip(); drawBG(c, 13.79); c.restore(); } else drawBG(c, t);
    if (t < 15.9) {
      if (t >= 13.8) drawFlower(c, t);
      drawSeeds(c, t, h);
    }
    if (t >= 17.4) { drawGalaxyDeco(c, t); }
    if (t >= 18.8) drawBH(c, t, 0);
    if (t >= 15.52) drawParticles(c, t, h);
    if (t >= 18.8) {
      const a = sstep(20.4, 21.1, t) * .3;
      if (a > 0) { c.strokeStyle = 'rgba(200,200,230,' + a + ')'; c.lineWidth = 1.2; c.beginPath(); for (const [an, r0, l] of streaks) { c.moveTo(CX + Math.cos(an) * r0, CY + Math.sin(an) * r0 * .8); c.lineTo(CX + Math.cos(an) * (r0 + l), CY + Math.sin(an) * (r0 + l) * .8); } c.stroke(); }
      drawBH(c, t, 1);
    }
    // black core of the galaxy before the ring
    if (t > 18.78 && t < 18.95) { const r = 90 * sstep(18.78, 18.86, t); c.fillStyle = '#05050c'; c.beginPath(); c.arc(BHx, BHy, r, 0, 6.2832); c.fill(); }
  } });
})();
