// a06_sermon.js: «Жги токены» v2 chapter 6, the CEO bridge + angelic choir (116.3–132.55).
// A cathedral of servers: rack pillars, three stained-glass lancets (pylon / copper coil / water drop), CEO-Clawd
// preaching from a GPU pulpit, a choir of agents with token halos answering in light beams on the choir stabs.
// 116.3 dark nave, one spotlight → 118.26 the windows blaze → 120.8 the CEO sips, the next town's reservoir dries up
// (choir: «больше меди / больше воды») → 123.7 the choir asks «Зачем?» → 125.15 the lone madman shouts, the price tag
// of intelligence shrinks while the bill unrolls to the floor → 127.15 slow push-in, the windows go out one by one,
// the CEO puts on the black shades as the drop lands (132.55).
(() => {
  const INK = PAL.ink;
  // choir / organ stabs (assets/tokens2/hits.txt): the light beams fire on these
  const a06_HC = [118.26, 119.08, 119.87, 121.02, 122.47, 123.14, 123.81, 125.48, 126.34];
  const a06_GLASS = {
    pylon: ['#1E3F9A', '#2E6FD8', '#4B2E9A', '#1B5FB0'],
    coil: ['#1E7A5A', '#2FA86B', '#15606A', '#3A9C98'],
    drop: ['#B4302A', '#D8622A', '#8A1F3A', '#E8AA38']
  };
  const a06_WIN = { pylon: [400, 130, 240, 430], coil: [960, 90, 250, 420], drop: [1520, 130, 240, 430] };   // cx, top, w, h
  const a06_PILLARS = [20, 660, 1160, 1800];
  const a06_CEO = [960, 700, 32];                                    // ground x, y, u (legs hidden by the pulpit)
  const a06_BILL = [1190, 390];                                      // scroll hangs at world x .. x + w

  // ---------- small helpers ----------
  function a06_arch(cx, top, w, h) {                                 // pointed gothic arch
    const hw = w / 2, sy = top + .866 * w, p = [[cx - hw, top + h], [cx - hw, sy]];
    for (let i = 1; i <= 7; i++) { const a = Math.PI + i / 7 * Math.PI / 3; p.push([cx + hw + Math.cos(a) * w, sy + Math.sin(a) * w]); }
    for (let i = 1; i <= 7; i++) { const a = -Math.PI / 3 + i / 7 * Math.PI / 3; p.push([cx - hw + Math.cos(a) * w, sy + Math.sin(a) * w]); }
    p.push([cx + hw, top + h]);
    return p;
  }
  function a06_bar(x1, y1, x2, y2, w, col, sw = .5) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L * w / 2, ny = dx / L * w / 2;
    paint([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]], { wash: col, ink: sw ? INK : null, sw });
  }
  const a06_dim = (col, L) => mixCol(col, '#0B0A14', .72 * (1 - L));

  // ---------- stained-glass icons (box cx, top, w, h) ----------
  function a06_pylon(cx, y0, w, h, L, t, zap) {
    const yb = y0 + h, yt = y0, gold = a06_dim('#FFD21F', L), c = (f, s) => [cx + s * w * lerp(.36, .06, f), lerp(yb, yt, f)];
    for (const s of [-1, 1]) a06_bar(...c(0, s), ...c(1, s), 9, gold);
    for (let i = 0; i < 5; i++) {                                                    // lattice braces
      const f0 = i / 5, f1 = (i + 1) / 5;
      a06_bar(...c(f0, -1), ...c(f1, 1), 5, gold, .3); a06_bar(...c(f0, 1), ...c(f1, -1), 5, gold, .3);
    }
    for (const [f, aw] of [[.72, .46], [.9, .34]]) {                                  // cross-arms with insulators
      const y = lerp(yb, yt, f);
      a06_bar(cx - w * aw, y, cx + w * aw, y, 10, gold);
      for (const s of [-1, 1]) paint(ellPts(cx + s * w * aw * .9, y + 12, 6, 10, 8), { wash: a06_dim('#8EC3E6', L), ink: INK, sw: .4 });
    }
    // the bolt glass: a lightning piece over the tower, flickers when the pylon sings
    const bx = cx + w * .05, by = y0 + h * .18, f = 1 + zap * .25;
    paint([[bx - 18 * f, by], [bx + 26 * f, by], [bx + 4 * f, by + 60 * f], [bx + 30 * f, by + 60 * f], [bx - 22 * f, by + 150 * f], [bx - 6 * f, by + 84 * f], [bx - 32 * f, by + 84 * f]],
      { wash: mixCol(a06_dim('#FFF3C8', L), '#FFFFFF', zap), ink: INK, sw: .6 });
  }
  function a06_coil(cx, y0, w, h, L, t, zap) {
    const cu = a06_dim('#C8773A', L), hi = a06_dim('#F2B27A', L), rx = w * .34, ry = w * .1;
    paint(rectPts(cx - rx * .55, y0, rx * 1.1, h), { wash: a06_dim('#3A3336', L), ink: INK, sw: .5 });   // the core
    const n = 8, step = (h - ry * 2) / n;
    for (let i = 0; i < n; i++) {                                                     // copper turns: front half-rings
      const y = y0 + ry + i * step, p = [];
      for (let q = 0; q <= 10; q++) { const a = q / 10 * Math.PI; p.push([cx + Math.cos(a) * rx, y + Math.sin(a) * ry]); }
      for (let q = 10; q >= 0; q--) { const a = q / 10 * Math.PI; p.push([cx + Math.cos(a) * rx * .92, y + Math.sin(a) * ry + step * .55]); }
      paint(p, { wash: i % 2 ? cu : hi, ink: INK, sw: .45 });
    }
    if (zap > .05) for (let i = 0; i < 2; i++) {                                     // an arc jumping between the terminals
      const ps = []; for (let q = 0; q <= 6; q++) ps.push([cx + (q % 2 ? 1 : -1) * (6 + hash(q + Math.floor(t * 18) + i * 9) * 20), y0 - 10 - q * 5]);
      inkLine(ps, 1.6 * zap, '#E6F4FF', 'ink', 0);
    }
  }
  function a06_drop(cx, y0, w, h, L, t, zap, level = 1) {
    const r = w * .34, cy = y0 + h * .62, apex = [cx, y0 + h * .08], pts = [apex];
    for (let i = 0; i <= 20; i++) { const a = -Math.PI / 2 + .62 + i / 20 * (TAU - 1.24); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    paint(pts, { wash: a06_dim(mixCol('#2E9FE8', '#8EC3E6', zap * .5), L), fill: a06_dim('#1B5FB0', L), fillOp: 90, tex: .4, ink: INK, sw: .7 });
    paint(ellPts(cx - r * .35, cy - r * .2, r * .16, r * .32, 10, 0, .4), { wash: a06_dim('#FFFFFF', L), washOp: 200, ink: null });
  }

  // ---------- a lancet window ----------
  function a06_window(kind, t, L, zap = 0) {
    const [cx, top, w, h] = a06_WIN[kind], hw = w / 2, sy = top + .866 * w, pal = a06_GLASS[kind];
    if (L > .25) glowAt(cx, top + h * .5, w * 1.25, pal[1], 70 * L);
    paint(a06_arch(cx, top - 16, w + 32, h + 24), { wash: '#3B3F4A', fill: '#1C1F24', fillOp: 90, tex: .5, ink: INK, sw: .8 });   // stone frame
    paint(a06_arch(cx, top, w, h), { wash: a06_dim(pal[0], L), ink: null });
    // mosaic cells below the spring line
    const rows = 5, cols = 3, ch = (top + h - sy) / rows, cw = w / cols;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const col = pal[Math.floor(hash(r * 7.3 + c * 3.1 + cx) * pal.length)];
      paint(rectPts(cx - hw + c * cw + 3, sy + r * ch + 3, cw - 6, ch - 6), { wash: a06_dim(col, L), washOp: 230, ink: null });
    }
    // rosette in the arch head
    const ry = top + (sy - top) * .62, rr = w * .2;
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t * .15; paint(ellPts(cx + Math.cos(a) * rr * .6, ry + Math.sin(a) * rr * .6, rr * .42, rr * .42, 10), { wash: a06_dim(pal[(i % 2) + 2], L), ink: INK, sw: .4 }); }
    paint(ellPts(cx, ry, rr * .35, rr * .35, 10), { wash: a06_dim('#FFD21F', L), ink: INK, sw: .4 });
    // lead came: the grid
    for (let c = 1; c < cols; c++) inkLine([[cx - hw + c * cw, sy], [cx - hw + c * cw, top + h]], 1.1, '#15131C', 'ink', 0);
    for (let r = 0; r <= rows; r++) inkLine([[cx - hw, sy + r * ch], [cx + hw, sy + r * ch]], 1.1, '#15131C', 'ink', 0);
    // the icon over the mosaic
    const ib = [cx, sy - 20, w * .9, top + h - sy - 10];
    if (kind === 'pylon') a06_pylon(...ib, L, t, zap);
    else if (kind === 'coil') a06_coil(ib[0], ib[1] + 30, ib[2], ib[3] - 50, L, t, zap);
    else a06_drop(...ib, L, t, zap);
    paint(a06_arch(cx, top, w, h), { ink: '#15131C', sw: 1.4 });
    if (L > .5) paint(ellPts(cx - hw * .4, top + h * .45, w * .08, h * .3, 10, 0, .2), { wash: '#FFFFFF', washOp: 50 * L, ink: null });   // sheen
  }

  // ---------- the choir ----------
  function a06_angel(x, y, s, t, o) {
    const k = o.k || 0, bob = Math.sin(t * 2.2 + o.n) * .25 - k * .6;
    for (const sd of [-1, 1]) {                                                       // little paper wings behind
      const wx = x + sd * 5.6 * s, wy = y + bob * s - 5.2 * s, fl = Math.sin(t * 6 + o.n) * .15 + k * .4;
      paint(ellPts(wx + sd * 1.2 * s, wy - 1.4 * s, 2.6 * s, 1.3 * s, 10, 0, sd * (-.7 - fl)), { wash: '#FFF5E2', washOp: 230, ink: INK, sw: .4 });
    }
    a06_mini(x, y + bob * s, s, { n: o.n, eyes: o.eyes || 'closed', lookX: o.lookX || 0, lookY: o.lookY || 0, mouth: o.mouth || 'smile',
      aL: o.aL ?? (.3 + k * 1.3), aR: o.aR ?? (.3 + k * 1.3) });
    if (o.emote && o.emoteK > 0) emote(o.emote, x + 5.4 * s, y + bob * s - 8.6 * s, s * .9, o.emoteK);
    const hy = y + bob * s - 9.9 * s;                                                 // token halo
    if (k > .05) glowAt(x, hy, 4 * s, '#FFD21F', 110 * k);
    paint(ellPts(x, hy, 3 * s, .95 * s, 16), { wash: '#F2B632', ink: INK, sw: .5 });
    paint(ellPts(x, hy - .1 * s, 2 * s, .45 * s, 12), { wash: mixCol('#6A4A2A', '#FFF3C8', k), ink: null });
    letter('₮', x + 2.4 * s, hy + .1 * s, .9 * s, '#7A4A0A', { ink: false });
  }
  // ponytail: a wash-only agentBot look-alike (clawd()'s textured fills cost ~70 ms each, the choir has 12)
  function a06_mini(x, y, s, o) {
    const col = '#6F8BE0', dk = '#3D55A8', lt = '#B5C6F0', top = y - 8 * s;
    for (const sd of [-1, 1]) {
      const a = sd < 0 ? o.aL : o.aR, px = x + sd * 4.9 * s, py = y - 4.5 * s, dx = sd * Math.cos(a), dy = -Math.sin(a), nx = -dy * .5 * s, ny = dx * .5 * s, L = 2.3 * s;
      paint([[px + nx, py + ny], [px + dx * L + nx, py + dy * L + ny], [px + dx * L - nx, py + dy * L - ny], [px - nx, py - ny]], { wash: col, ink: INK, sw: .45 });
    }
    paint(rectPts(x - 5 * s, top, 10 * s, 6 * s), { wash: col, ink: null });
    paint(ellPts(x - 1.6 * s, top + 1.6 * s, 3.4 * s, 1.4 * s, 14), { wash: lt, washOp: 120, ink: null });
    paint(rectPts(x - 4.8 * s, y - 3.8 * s, 9.6 * s, 1.6 * s), { wash: dk, washOp: 110, ink: null });
    paint(rectPts(x - 5 * s, top, 10 * s, 6 * s), { ink: INK, sw: .6 });
    const lx = (o.lookX || 0) * .5 * s, ly = (o.lookY || 0) * .4 * s;
    for (const ex of [-3, 2]) {
      const X = x + ex * s, Y = top + s;
      if (o.eyes === 'closed') inkLine([[X - .3 * s, Y + 1.2 * s], [X + .5 * s, Y + 1.6 * s], [X + 1.3 * s, Y + 1.2 * s]], .8, INK, 'ink', .4);
      else paint(rectPts(X + lx, Y + ly, s, 2 * s), { wash: INK, ink: null });
    }
    const my = y - 4.3 * s;
    if (o.mouth === 'O') paint(ellPts(x, my + .2 * s, .8 * s, .95 * s, 12), { wash: '#4A1F2A', ink: INK, sw: .4 });
    else if (o.mouth === 'o') paint(ellPts(x, my, .45 * s, .5 * s, 10), { wash: INK, ink: null });
    else if (o.mouth === 'flat') inkLine([[x - .7 * s, my], [x + .7 * s, my]], .7, INK, 'ink', 0);
    else inkLine([[x - .8 * s, my - .3 * s], [x, my + .2 * s], [x + .8 * s, my - .3 * s]], .7, INK, 'ink', .6);
    inkLine([[x - 2.6 * s, y - 2.2 * s], [x - .4 * s, y - 3.4 * s]], .5, '#D8262A', 'inkfine', 0);
    paint(rectPts(x - 1.35 * s, y - 3.55 * s, 2.7 * s, 1.6 * s), { wash: '#FFF5E2', ink: INK, sw: .35 });
    paint(rectPts(x - 1.35 * s, y - 3.55 * s, 2.7 * s, .45 * s), { wash: '#2E5BFF', ink: null });
    letter('#' + o.n, x, y - 2.6 * s, .75 * s, '#1A1718', { font: ruFont(.75 * s), ink: false });
  }
  // rows: back row ground 770, front row 850; left stall x ~110..530, right mirrored
  function a06_choir(t, o = {}) {
    const k = hitK(t, a06_HC, .35), s = o.s || 12;
    for (const side of [-1, 1]) {
      const X = x => side < 0 ? x : W - x;
      for (const [gy, xs, row] of [[770, [150, 310, 470], 0], [855, [230, 390, 550], 1]]) {
        xs.forEach((x, i) => {
          const n = 7 + row * 4 + i + (side > 0 ? 20 : 0), my = o.mouth ? o.mouth(n) : (k > .3 ? 'O' : 'smile');
          a06_angel(X(x), gy, s, t, { n, k: k * (.6 + .4 * hash(n)), mouth: my, eyes: o.eyes, lookX: o.lookX ? o.lookX * (side < 0 ? 1 : -1) : 0, lookY: o.lookY,
            emote: o.emote && hash(n * 3) > .45 ? o.emote : null, emoteK: o.emoteK });
        });
        const rx = side < 0 ? 40 : W - 620;                                           // carved stall rail
        paint(rectPts(rx, gy - 34, 580, 56), { wash: '#4A2A1E', ink: INK, sw: .7 });
        for (let q = 0; q < 8; q++) inkLine([[rx + 36 + q * 72, gy - 20], [rx + 36 + q * 72, gy + 16]], .8, '#2A1812', 'ink', 0);
        inkLine([[rx, gy - 34], [rx + 580, gy - 34]], 1.2, '#B4502A', 'ink', 0);
      }
    }
  }

  // ---------- the pulpit (a GPU) + CEO ----------
  function a06_pulpit(t, ceo = {}) {
    const [x, y, u] = a06_CEO;
    ceoClawd(x, y, u, { noShadow: true, ...ceo });
    paint(rectPts(x - 150, 830, 300, 70, 1), { wash: '#3B3F4A', fill: '#1C1F24', fillOp: 90, tex: .5, ink: INK, sw: .8 });   // pedestal
    for (let i = 0; i < 3; i++) paint(rectPts(x - 230 + i * 30, 890 + i * 18, 460 - i * 60, 20), { wash: i % 2 ? '#2B2F36' : '#3B3F4A', ink: INK, sw: .5 });
    paint(rectPts(x - 225, 640, 450, 195, 1.5), { wash: '#232A33', fill: '#1A1718', fillOp: 90, tex: .6, border: .4, ink: INK, sw: 1 });
    gpuCard(x, 738, 1.1, t, {});                                                        // the pulpit front IS a GPU
    paint(rectPts(x - 245, 626, 490, 22, 1), { wash: '#59636E', ink: INK, sw: .8 });   // ledge
    hazard(x - 225, 808, 450, 24);
    letter('GPU', x, 800 - 3, 22, '#B6FF1A', { font: ruFont(22), ink: false });
    // open book on the lectern: the Q4 deck
    const bx = x + 150, by = 612;
    paint([[bx - 70, by], [bx, by + 10], [bx + 70, by], [bx + 66, by - 30], [bx, by - 22], [bx - 66, by - 30]], { wash: '#FFF5E2', ink: INK, sw: .6 });
    inkLine([[bx, by + 10], [bx, by - 22]], .6, INK, 'inkfine', 0);
    inkLine([[bx - 50, by - 18], [bx - 14, by - 6], [bx - 30, by - 22]], .8, '#FF8A1F', 'inkfine', .3);
  }

  // ---------- the nave ----------
  function a06_nave(t, o = {}) {
    const L = o.L ?? 1, WL = o.win || {};
    paint(rectPts(-500, -300, W + 1000, H + 600), { wash: '#1A1726', ink: null });
    paint(rectPts(-500, -300, W + 1000, 560), { wash: '#100E18', washOp: 180, ink: null });
    // vault ribs
    for (let i = 0; i < a06_PILLARS.length - 1; i++) {
      const a = a06_PILLARS[i] + 50, b = a06_PILLARS[i + 1] + 50, m = (a + b) / 2;
      inkLine([[a, 110], [lerp(a, m, .35), -10], [m, -60]], 1.6, '#59636E', 'ink', .6);
      inkLine([[b, 110], [lerp(b, m, .35), -10], [m, -60]], 1.6, '#59636E', 'ink', .6);
    }
    for (const k of ['pylon', 'coil', 'drop']) a06_window(k, t, L * (WL[k] ?? 1), (o.zap || {})[k] || 0);
    // server-rack pillars with capitals
    a06_PILLARS.forEach((px, i) => {
      serverRack(px, 120, 100, 700, t, { units: 8, seed: i * 5 + 2, heat: o.heat || 0 });
      paint(rectPts(px - 14, 96, 128, 30, 1), { wash: '#59636E', fill: '#2B2F36', fillOp: 90, tex: .5, ink: INK, sw: .7 });
      paint(rectPts(px - 10, 816, 120, 22, 1), { wash: '#3B3F4A', ink: INK, sw: .6 });
    });
    // floor: stone + a ribbon-cable carpet to the pulpit
    paint(rectPts(-500, 830, W + 1000, 500), { wash: '#232A33', fill: '#1C1F24', fillOp: 90, tex: .5, ink: null });
    for (let i = -8; i <= 8; i++) inkLine([[960 + i * 70, 830], [960 + i * 260, H + 40]], .6, '#3B3F4A', 'inkfine', 0);
    for (const y of [870, 925, 1000]) inkLine([[-40, y], [W + 40, y]], .6, '#3B3F4A', 'inkfine', 0);
    paint([[880, 900], [1040, 900], [1200, H + 60], [720, H + 60]], { wash: '#8A95A1', ink: INK, sw: .6 });
    for (let i = 1; i < 10; i++) inkLine([[880 + i * 16, 900], [720 + i * 48, H + 60]], .5, i === 1 ? '#D8262A' : '#59636E', 'inkfine', 0);
    if (o.choir !== false) a06_choir(t, o.choirO || {});
    flushLetters();                                                                     // badges stay under the bill / pulpit
  }

  // ---------- light ----------
  function a06_beam(xt, xb, wt, wb, yb, k, col = '#FFF3C8') {
    if (k < .02) return;
    paint([[xt - wt, -60], [xt + wt, -60], [xb + wb, yb], [xb - wb, yb]], { wash: col, washOp: 70 * k, ink: null });
    paint([[xt - wt * .4, -60], [xt + wt * .4, -60], [xb + wb * .45, yb], [xb - wb * .45, yb]], { wash: '#FFFFFF', washOp: 55 * k, ink: null });
    paint(ellPts(xb, yb, wb * 1.1, wb * .22, 18), { wash: col, washOp: 60 * k, ink: null });
    for (let i = 0; i < 8; i++) {                                                          // dust motes
      const f = frac(hash(i * 3.3 + xb) + T * .07), my = lerp(40, yb - 30, f), mx = lerp(xt, xb, f) + (hash(i + xb) - .5) * lerp(wt, wb, f) * 1.4;
      paint(ellPts(mx, my, 3, 3, 6), { wash: '#FFFFFF', washOp: 170 * k, ink: null });
    }
  }
  function a06_choirBeams(t, base = 0) {
    const k = Math.max(base, hitK(t, a06_HC, .45));
    a06_beam(260, 330, 50, 300, 880, k); a06_beam(W - 260, W - 330, 50, 300, 880, k);
  }
  function a06_dark(k) { if (k > .01) { flushLetters(); paint(rectPts(-80, -80, W + 160, H + 160), { wash: '#07060C', washOp: 235 * clamp(k), ink: null }); } }

  // ---------- 116.3 «Нам нужно больше электричества.»: dark nave, spotlight → the windows blaze ----------
  function preach(t, lt) {
    const rev = seg(t, 118.2, 118.4), zapK = seg(t, 118.5, 118.8) * (1 - seg(t, 120.1, 120.6)), stab = hitK(t, a06_HC, .3);
    const [sx, sy] = shakeXY(t, 10 * stab * rev);
    camBegin(960 + sx, 520 + sy, 1 + lt * .014 + stab * .012);
    a06_nave(t, { L: lerp(.42 + .13 * seg(t, 116.3, 118.2), 1, rev) * (.85 + .15 * stab), win: { pylon: 1 + zapK * .5 }, zap: { pylon: zapK * (.5 + .5 * Math.abs(Math.sin(t * 23))) }, heat: zapK * .3 });
    a06_dark((1 - rev) * .3);
    a06_beam(960, 960, 60, 260, 880, lerp(.9, .35, rev));                                // the preacher's spotlight
    // electricity: cables from the pylon window crackle down the racks
    if (zapK > .05) for (let i = 0; i < 3; i++) {
      const fr = Math.floor(t * 16) + i * 7, ps = [[400 + (i - 1) * 60, 470]];
      for (let q = 1; q <= 6; q++) ps.push([lerp(400 + (i - 1) * 60, i === 1 ? 710 : 70 + i * 300, q / 6) + (hash(fr + q) - .5) * 60, 470 + q * 55]);
      inkLine(ps, 2.2 * zapK, i % 2 ? '#FFD21F' : '#E6F4FF', 'ink', 0);
    }
    const arm = kf(t, [[116.3, .3], [117.7, .5], [118.1, 1.5], [120.3, 1.2], [120.8, .6]], backOut);
    a06_pulpit(t, { mouth: t > 116.36 && t < 120.05 && frac(t * 5) < .6 ? 'O' : 'smile', eyes: t < 118.1 ? 'closed' : 'normal', aR: arm, aL: .1 + stab * .3,
      click: hitK(t, [118.26, 119.08, 119.87], .2) });
    a06_choirBeams(t);
    camEnd();
    if (rev > 0 && rev < 1) flash((1 - rev) * .5, '#FFF3C8');
    if (t > 118.5) sfx('ВЖЖЖ', 400, 90, 70, '#FFD21F', t - 118.54, { life: 1.4, font: ruFont(70), rot: -.1 });
    glitchCut(t, 116.3);
  }

  // ---------- 120.8 the CEO sips water; the next town's reservoir dries up. Choir: «Больше меди. Больше воды.» ----------
  const a06_GULPS = [121.0, 121.55, 122.1, 122.65, 123.2];
  function a06_reservoir(t, x, y, w, h) {
    const [ix, iy, iw, ih] = zineCut(x, y, w, h, { seed: 61, rot: -.03 });
    let lvl = 1; for (const g of a06_GULPS) lvl -= .2 * ease(seg(t, g, g + .35));
    lvl = Math.max(0, lvl);
    const sky = [ix, iy, iw, ih * .62];
    paint(rectPts(...sky), { wash: '#BFD9E8', fill: '#8EC3E6', fillOp: 60, tex: .4, ink: null });
    // the little town on the hill
    for (let i = 0; i < 6; i++) {
      const hx = ix + iw * .56 + i * 34, hy = iy + ih * .44 - (i % 2) * 8;
      paint(rectPts(hx, hy - 26, 28, 26), { wash: ['#E8AA38', '#F1E8D2', '#E27A92'][i % 3], ink: INK, sw: .4 });
      paint([[hx - 3, hy - 26], [hx + 14, hy - 42], [hx + 31, hy - 26]], { wash: '#B4502A', ink: INK, sw: .4 });
    }
    paint([[ix, iy + ih * .5], [ix + iw * .3, iy + ih * .38], [ix + iw * .6, iy + ih * .46], [ix + iw, iy + ih * .4], [ix + iw, iy + ih], [ix, iy + ih]], { wash: '#8A9A5B', ink: null });
    // basin: cracked mud where the water was
    const bx = ix + iw * .06, bw = iw * .88, bt = iy + ih * .56, bh = ih * .4;
    paint(ellPts(bx + bw / 2, bt + bh / 2, bw / 2, bh / 2, 24), { wash: '#B98A5A', fill: '#8A5A3A', fillOp: 70, tex: .5, ink: INK, sw: .5 });
    if (lvl < .6) for (let i = 0; i < 9; i++) {
      const cx = bx + bw * (.15 + hash(i) * .7), cy = bt + bh * (.3 + hash(i + 4) * .5);
      inkLine([[cx, cy], [cx + (hash(i + 8) - .5) * 60, cy + (hash(i + 9) - .5) * 26], [cx + (hash(i + 2) - .5) * 90, cy + (hash(i + 3) - .5) * 30]], .6, '#5A3A22', 'inkfine', 0);
    }
    if (lvl > .02) {                                                                     // water shrinks to the centre
      const r = Math.sqrt(lvl);
      paint(ellPts(bx + bw / 2, bt + bh / 2 + (1 - r) * bh * .15, bw / 2 * r, bh / 2 * r, 24), { wash: '#2E9FE8', fill: '#1B5FB0', fillOp: 70, tex: .3, ink: null });
    }
    // a stranded boat and a fish once it's dry
    const dry = seg(lvl, .45, 0);
    push(); translate(bx + bw * .3, bt + bh * .55); rotate(-.3 * dry);
    paint([[-30, -8], [30, -8], [20, 8], [-20, 8]], { wash: '#F1E8D2', ink: INK, sw: .5 }); pop();
    if (dry > .5) {
      const fx = bx + bw * .66, fy = bt + bh * .62, fl = Math.sin(t * 20) * 6;
      paint([[fx - 22, fy], [fx, fy - 9 + fl * .3], [fx + 16, fy], [fx + 26, fy - 10 + fl], [fx + 26, fy + 10 - fl], [fx + 16, fy], [fx, fy + 9]], { wash: '#8EC3E6', ink: INK, sw: .5 });
    }
    // level gauge
    const gx = ix + iw * .92, gt = iy + ih * .12, gh = ih * .72;
    paint(rectPts(gx - 12, gt, 24, gh), { wash: '#FFF5E2', ink: INK, sw: .5 });
    paint(rectPts(gx - 9, gt + gh * (1 - lvl), 18, gh * lvl), { wash: lvl > .3 ? '#2E9FE8' : '#D8262A', ink: null });
    letter(Math.round(lvl * 100) + '%', gx - 20, gt + gh - 14, 22, lvl > .3 ? '#1B3AB0' : '#D8262A', { font: ruFont(22), align: 'right', ink: false });
    letter('г. СОСЕДНИЙ · ВОДОХРАНИЛИЩЕ', ix + 14, iy + 26, 25, '#2B2233', { font: ruFont(25), align: 'left', ink: false });
    return lvl;
  }
  function sip(t, lt) {
    const stab = hitK(t, a06_HC, .3), coilK = hitK(t, [121.02], .6), dropK = hitK(t, [122.47, 123.14], .6);
    camBegin(960, 540, 1.15 + lt * .02);
    a06_nave(t, { win: { coil: 1 + coilK * .6, drop: 1 + dropK * .6 }, zap: { coil: coilK, drop: dropK } });
    // the chalice in the left hand with a long bendy straw to the mouth
    const lift = kf(t, [[120.8, .3], [121.0, 1.05], [123.25, 1.05], [123.55, .4]], backOut);
    const tipX = -4.9 - 2.2 * Math.cos(lift), tipY = -4.5 - 2.2 * Math.sin(lift), u = a06_CEO[2];
    const cup = (uu, sw) => {
      push(); scale(-1, 1); rotate(-lift);
      paint([[-1.1 * uu, -2.8 * uu], [1.1 * uu, -2.8 * uu], [.7 * uu, -1.1 * uu], [.15 * uu, -.8 * uu], [.15 * uu, .2 * uu], [.7 * uu, .5 * uu], [-.7 * uu, .5 * uu], [-.15 * uu, .2 * uu], [-.15 * uu, -.8 * uu], [-.7 * uu, -1.1 * uu]],
        { wash: '#E8AA38', fill: '#A8741A', fillOp: 80, tex: .4, ink: INK, sw: sw * .5 });
      paint(ellPts(0, -2.7 * uu, 1.05 * uu, .25 * uu, 12), { wash: '#2E9FE8', ink: null });
      const mx = -tipX * uu, my = (-4.35 - tipY) * uu, straw = [[.3 * uu, -2.6 * uu], [.6 * uu, -4.2 * uu], [mx * .55, my - 1.4 * uu], [mx - .2 * uu, my]];
      inkLine(straw, sw * 1.6, '#E27A92', 'ink', .5);
      for (const g of a06_GULPS) {                                                       // blue gulps travelling up the straw
        const p = seg(t, g - .25, g + .1); if (p <= 0 || p >= 1) continue;
        const i = Math.min(2, Math.floor(p * 3)), f = p * 3 - i, a = straw[i], b = straw[i + 1];
        paint(ellPts(lerp(a[0], b[0], f), lerp(a[1], b[1], f), .35 * uu, .35 * uu, 8), { wash: '#2E9FE8', ink: null });
      }
      pop();
    };
    const sipping = t > 120.95 && t < 123.3;
    a06_pulpit(t, { armL: cup, aL: lift, aR: .25, eyes: sipping ? 'closed' : 'normal', mouth: sipping ? 'o' : 'smile', sq: sipping ? .03 * Math.sin(t * 11) : 0 });
    a06_choirBeams(t);
    camEnd();
    // the choir answers in the beams
    const cK = seg(t, 120.86, 121.05), dK = seg(t, 122.38, 122.55);
    if (cK > 0) letter('БОЛЬШЕ МЕДИ.', 330, 560, 64, '#F2B27A', { font: ruFont(64), pop: cK, stroke: '#2B2233', alpha: 1 - seg(t, 123.4, 123.7) });
    if (dK > 0) letter('БОЛЬШЕ ВОДЫ.', W - 330, 560, 64, '#8EC3E6', { font: ruFont(64), pop: dK, stroke: '#2B2233', alpha: 1 - seg(t, 123.4, 123.7) });
    flushLetters();
    // screen space: the neighbouring town's reservoir, taped up top-left
    const lvl = a06_reservoir(t, 40, 40, 560, 360);
    if (lvl < .05) stamp('ВЫПИТО', 330, 330, 54, t, 123.25, { col: '#D8262A', rot: -.12 });
    if (t > 123.3) sfx('А-АХ', 1180, 380, 58, '#FFF5E2', t - 123.3, { life: .45, font: ruFont(58) });
  }

  // ---------- 123.7 the choir: «Зачем?» ----------
  function why(t, lt) {
    const k = hitK(t, a06_HC, .4), sing = t > 123.78 && t < 124.55;
    camBegin(1460 - lt * 20, 690, 2.1 + lt * .05);
    a06_nave(t, { choirO: { eyes: 'look', lookX: -1, lookY: -.4, mouth: n => sing ? (hash(n) > .3 ? 'O' : 'o') : 'o', emote: '?', emoteK: seg(t, 123.9, 124.2) } });
    a06_beam(1590, 1600, 60, 320, 880, Math.max(k, .25));
    camEnd();
    const a = seg(t, 123.8, 123.95);
    if (a > 0) {
      letter('ЗАЧЕМ?', 960, 250, 190, '#FFD21F', { font: ruFont(190), pop: a, stroke: '#2B2233', rot: -.04, alpha: 1 - seg(t, 124.9, 125.15) });
      sfx('♪', 520, 230, 90, '#FFF5E2', t - 123.85, { life: 1.2 });
      sfx('♪', 1420, 160, 70, '#FFF5E2', t - 124.05, { life: 1.1 });
    }
  }

  // ---------- 125.15 the madman; the intelligence price tag shrinks, the bill unrolls to the floor ----------
  function a06_bill(t, p, tot = 1) {                                          // p 0..1 unrolled; scroll hangs from the vault to the floor then pools right
    const [x, w] = a06_BILL, top = 60, fl = 880, len = p * 1500, vert = Math.min(len, fl - top), pool = Math.max(0, len - vert);
    paint(rectPts(x - 16, top - 30, w + 32, 34, 1), { wash: '#B4502A', fill: '#6E2E18', fillOp: 80, tex: .5, ink: INK, sw: .7 });   // the roller
    if (vert < 4) return;
    paint(rectPts(x, top, w, vert, .5), { wash: '#FBF8F2', fill: '#E9E2D6', fillOp: 60, tex: .4, ink: INK, sw: .5 });
    letter('СЧЁТ', x + w / 2, top + 40, 48, '#2B2233', { font: ruFont(48), ink: false });
    for (let y = top + 90; y < top + vert - 10; y += 34) inkLine([[x + 20, y], [x + w - 20, y]], .4, '#C8C0B4', 'inkfine', 0);   // ruled paper, no text
    if (pool > 4) {                                                   // the tail piles up on the floor in loops
      paint([[x, fl - 10], [x + w, fl - 10], [x + w + pool * .55, fl + 34], [x + pool * .55 - 40, fl + 50]], { wash: '#FBF8F2', fill: '#E9E2D6', fillOp: 60, tex: .4, ink: INK, sw: .5 });
      for (let i = 0; i < Math.min(5, pool / 110); i++) paint(ellPts(x + w * .5 + i * 70, fl + 10 - i * 4, 60, 26, 14), { ink: INK, sw: .5 });
    }
    // the total rides down on the unrolling edge and stops mid-scroll
    const k = seg(p, .15, .35) * tot; if (k <= 0) return;
    const ty = Math.min(top + vert - 120, 500);
    paint(rectPts(x + 14, ty - 46, w - 28, 150, 1), { wash: '#FFF5E2', washOp: 255 * k, ink: k > .99 ? '#D8262A' : null, sw: 1.2 });
    letter('ИТОГО:', x + w / 2, ty, 52, '#2B2233', { font: ruFont(52), ink: false, alpha: k });
    letter('$300 МЛРД', x + w / 2, ty + 64, 56, '#D8262A', { font: ruFont(56), ink: false, alpha: k });   // ponytail: 300 000 000 000 won't fit ≥40 px on the scroll
  }
  function a06_tag(t, x, y, price, s) {
    inkLine([[x, -40], [x, y - 150 * s]], 1, '#8A8480', 'inkfine', 0);
    push(); translate(x, y); rotate(Math.sin(t * 2.5) * .06); scale(s);
    paint([[-130, -100], [0, -150], [130, -100], [130, 100], [-130, 100]], { wash: '#FFF5E2', fill: '#E8AA38', fillOp: 40, tex: .4, ink: INK, sw: 1 });
    paint(ellPts(0, -112, 11, 11, 10), { wash: '#2B2233', ink: null });
    pop();
    const fmt = '$' + String(+price.toPrecision(price >= 1 ? 2 : 1)).replace('.', ',');
    letter('$20', x, y - 45 * s, 52 * s, '#59636E', { font: ruFont(52 * s), ink: false });
    if (price < 19.5) {
      inkLine([[x - 55 * s, y - 40 * s], [x + 55 * s, y - 52 * s]], 3 * s, '#D8262A', 'ink', 0);   // struck out
      letter(fmt, x, y + 40 * s, 64 * s, '#D8262A', { font: ruFont(64 * s), ink: false });
    }
  }
  function a06_madman(t, x, y, u) {
    const sh = Math.floor(t * 14);
    paint(rectPts(x - 180, y, 420, 40, 1), { wash: '#4A2A1E', fill: '#2A1812', fillOp: 90, tex: .6, ink: INK, sw: .8 });   // the pew he stands on
    paint(rectPts(x - 190, y - 70, 20, 110), { wash: '#4A2A1E', ink: INK, sw: .6 });
    clawd(x + (hash(sh) - .5) * 8, y, u, { eyes: 'scared', lookX: .8, mouth: 'O', aL: 1.7 + Math.sin(t * 17) * .4, aR: 2 + Math.sin(t * 13 + 1) * .4,
      rot: (hash(sh + 3) - .5) * .06, noShadow: true });
    for (let i = 0; i < 3; i++) inkLine([[x + 70 + i * 16, y - 7 * u - i * 22], [x + 120 + i * 26, y - 7.6 * u - i * 34]], 1.2, '#FFF5E2', 'ink', 0);   // shout lines
  }
  function prophecy(t, lt) {
    const pe = ease(seg(t, 125.25, 127.05)), price = 20 * Math.pow(10, -4 * pe), stab = hitK(t, [125.48, 126.34], .45);
    camBegin(700, 540, 1 + lt * .02);
    a06_nave(t, { choirO: { eyes: 'look', lookX: -1, lookY: -.3, mouth: () => 'o' } });
    a06_pulpit(t, { eyes: 'look', lookX: -1, mouth: 'flat', aR: .3, aL: .2 });
    a06_bill(t, easeOut(seg(t, 125.3, 127.1)));
    a06_madman(t, 60, 900, 32);
    a06_beam(700, 700, 40, 180, 520, Math.max(.3, stab));                               // the choir stabs light the price tag
    a06_tag(t, 700, 440, price, lerp(1.05, .85, pe));
    camEnd();
    punkText('ЧТОБЫ ИНТЕЛЛЕКТ', 620, 110, 76, t, 125.2, { seed: 3 });
    punkText('СТАЛ ДЕШЕВЛЕ!', 620, 215, 88, t, 126.1, { seed: 8 });
    if (t > 126.44) stamp('−99,99%', 1180, 250, 50, t, 126.44, { col: '#2FBF71', rot: .1 });
  }

  // ---------- 127.15 «А когда он станет дешевле — нам понадобится…»: push-in, lights out, shades on ----------
  function shades(t, lt) {
    const z = kf(t, [[127.15, 1.02], [131.4, 2.35], [132.3, 2.6]], ease), cy = kf(t, [[127.15, 520], [131.4, 548], [132.3, 545]]);
    const offs = [129.8, 130.56, 131.25], out = offs.map(o => seg(t, o, o + .08)), clicks = hitK(t, offs, .2);
    camBegin(960, cy, z);
    a06_nave(t, { L: 1 - .25 * seg(t, 131.25, 131.4), win: { pylon: 1 - out[0] * .92, drop: 1 - out[1] * .92, coil: 1 - out[2] * .92 }, choirO: { eyes: 'normal', mouth: () => 'flat' } });
    a06_bill(t, 1, 1 - seg(t, 129.8, 130.3));                                          // the total fades with the lights
    a06_tag(t, 700, 440 - 900 * easeIn(seg(t, 129.8, 130.5)), .002, .85);   // reeled up out of the push-in
    a06_dark(seg(t, 129.8, 131.4) * .55);
    a06_beam(960, 960, 50, 250, 880, .35 + .55 * seg(t, 129.8, 131.4));
    // the shades descend from above ("deal with it") and land on the face at 132.05
    const on = t >= 132.05, age = t - 132.05, [X, Y, U] = a06_CEO;
    a06_pulpit(t, { hat: on ? 'shades' : null, aL: .2 + .5 * seg(t, 131.4, 131.9), aR: .35, click: clicks,
      mouth: on ? 'grin' : (t > 127.18 && t < 129.8 && frac(t * 4.5) < .55) || (t > 129.8 && t < 131.8 && frac(t * 3) < .5) ? 'o' : 'smile',
      eyes: t > 131.8 ? 'narrow' : 'normal', take: on && age < .25 ? -.08 * Math.sin(age / .25 * Math.PI) : 0 });
    if (!on && t > 131.35) {
      const p = seg(t, 131.4, 132.05), off = (1 - p) * 520;
      push(); translate(X, Y - off); KHAT.shades(U, 2); pop();
    }
    if (on && age < .35) {                                                                // the glint on the lens
      const [gx, gy] = [960 - 3.2 * a06_CEO[2], a06_CEO[1] - 6.8 * a06_CEO[2]];
      paint(starPts(gx, gy, 26 * (1 - age / .35) + 6, .2), { wash: '#E6FFE8', ink: null });
    }
    camEnd();
    flash(seg(t, 132.35, 132.5) * .35, '#00FF6A');
    glitchCut(t, 132.55);
  }

  chapter('bridge', 116.3, 132.55, [[116.3, preach], [120.8, sip], [123.7, why], [125.15, prophecy], [127.15, shades]]);
})();
