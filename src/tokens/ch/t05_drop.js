// t05_drop.js: «Жги токены» chapter 5 "drop" (94.5–124.7). Tempo switch: double-time hardcore, everything on half-beats.
// 94.5 CEO-Clawd pulls the lever, the AI-economy flywheel spins up → 97.5–114 the wheel with four stations
// (GPU → ТОКЕНЫ → АГЕНТЫ → ЗАДАЧИ → ТОКЕНЫ), each station punches on its sung line, the camera whips station to station,
// the wheel speeds up every lap and throws sparks → 114 «ЭКОНОМИКА РАБОТАЕТ!» stamps, the stock chart rockets off the top
// → 116.4–124.7 instrumental mosh pit: CEO-Clawd crowd-surfs on a GPU, half-beat strobes, token confetti.
(() => {
  const INK = PAL.ink;
  const WC = [960, 465], WR = 190, ERX = 520, ERY = 315;           // wheel centre/radius, station ellipse
  const ST = {
    gpu:  { x: 960, y: 150, label: 'GPU', a: -Math.PI / 2 },
    tok:  { x: 1480, y: 465, label: 'ТОКЕНЫ', a: 0 },
    agt:  { x: 960, y: 780, label: 'АГЕНТЫ', a: Math.PI / 2 },
    task: { x: 440, y: 465, label: 'ЗАДАЧИ', a: Math.PI }
  };
  const ORDER = ['gpu', 'tok', 'agt', 'task'];
  // sung hits (whisper word times; 108.3 follows lyrics.js «больше задач»)
  const HITS = [
    [97.5, 'gpu', 'БОЛЬШЕ GPU!', 'x2'], [101.1, 'gpu', 'БОЛЬШЕ GPU!', 'x10'], [103.4, 'gpu', 'БОЛЬШЕ GPU!', 'x100'],
    [104.7, 'tok', 'БОЛЬШЕ ТОКЕНОВ!', 'x1000'], [105.9, 'tok', 'БОЛЬШЕ ТОКЕНОВ!', 'x10⁶'],
    [107.06, 'agt', 'БОЛЬШЕ АГЕНТОВ!', '+100'], [108.3, 'task', 'БОЛЬШЕ ЗАДАЧ!', '+1000'],
    [109.5, 'task', 'БОЛЬШЕ ЗАДАЧ!', '+10⁴'], [110.6, 'task', 'БОЛЬШЕ ЗАДАЧ!', '+10⁵'], [111.9, 'tok', 'БОЛЬШЕ ТОКЕНОВ!', '∞']
  ];
  const t05_omega = t => 1 + Math.max(0, t - 94.8) * .34;                       // rad/s, ramps every lap
  const t05_ang = t => { const d = Math.max(0, t - 94.8); return d + .17 * d * d + .06 * easeOut(frac(bpOf(t) * 2)); };
  const t05_nHits = (t, st) => HITS.filter(h => h[1] === st && t >= h[0]).length;
  const t05_glow = (t, st) => { let g = 0; for (const h of HITS) if (h[1] === st && t >= h[0]) g = Math.max(g, Math.exp(-(t - h[0]) * 2.6)); return g; };
  const t05_last = t => { let r = null; for (const h of HITS) if (t >= h[0]) r = h; return r; };
  const ellAt = a => [WC[0] + Math.cos(a) * ERX, WC[1] + Math.sin(a) * ERY];

  // ---------- factory hall ----------
  function t05_hall(t, heat) {
    paint(rectPts(-500, -500, W + 1000, H + 1000), { wash: TK.soot, ink: null });
    glowAt(WC[0], WC[1], 760, TK.orange, 50 + 40 * heat + 30 * pulse2(t, 8));
    glowAt(WC[0], WC[1], 380, TK.yellow, 30 + 50 * heat);
    for (const bx of [-120, 70, W - 70, W + 120]) {                              // girders with rivets
      paint(rectPts(bx - 34, -400, 68, 1400, 1), { wash: TK.steelDk, fill: TK.steel, fillOp: 70, tex: .6, ink: INK, sw: .9 });
      for (let y = -300; y < 1000; y += 90) paint(ellPts(bx, y, 6, 6, 6), { wash: TK.steelLt, ink: null });
    }
    for (const s of [-1, 1]) inkLine([[960 + s * 1100, -80], [960 + s * 700, 120], [960 + s * 1100, 320]], 2.2, TK.steel, 'ink', 0);
    paint([[-500, 905], [W + 500, 905], [W + 500, 1500], [-500, 1500]], { wash: '#241E20', fill: TK.orangeDk, fillOp: 30 + 50 * heat, tex: .7, border: .5, ink: INK, sw: 1.2 });
    for (let i = -8; i <= 8; i++) inkLine([[960 + i * 140, 908], [960 + i * 260, 1300]], .5, TK.sootLt, 'inkfine', 0);
  }

  // ---------- the flywheel ----------
  function t05_gearPts(cx, cy, R, n, a) {
    const p = [];
    for (let i = 0; i < n; i++) for (const [f, r] of [[0, R], [.18, R * 1.08], [.5, R * 1.08], [.68, R]]) {
      const q = a + (i + f) / n * TAU; p.push([cx + Math.cos(q) * r, cy + Math.sin(q) * r]);
    }
    return p;
  }
  function t05_flywheel(cx, cy, R, t, heat) {
    const a = t05_ang(t), w = t05_omega(t), sw = clamp(R / 200, .6, 1.6);
    // A-frame stand
    for (const s of [-1, 1]) paint([[cx + s * R * .12, cy], [cx + s * R * .22, cy], [cx + s * R * .95, 905], [cx + s * R * .72, 905]], { wash: TK.steelDk, fill: TK.steel, fillOp: 80, tex: .6, ink: INK, sw });
    paint(rectPts(cx - R * 1.05, 880, R * 2.1, 28, 1), { wash: TK.steel, ink: INK, sw });
    paint(t05_gearPts(cx, cy, R, 22, a), { wash: mixCol(TK.steel, TK.orangeDk, heat * .7), fill: TK.steelDk, fillOp: 100, tex: .6, border: .5, ink: INK, sw: sw * 1.2 });
    paint(ellPts(cx, cy, R * .8, R * .8, 30), { wash: TK.soot, fill: TK.emberDk, fillOp: 50 + 90 * heat, bleed: .2, tex: .5, ink: INK, sw: sw * .8 });
    if (w > 2.2) for (let k = 0; k < 5; k++) {                                   // motion-blur fans trailing the spokes
      const a0 = a + k * TAU / 5, span = clamp((w - 2) * .09, 0, .9), pts = [[cx, cy]];
      for (let j = 0; j <= 6; j++) { const q = a0 - span * j / 6; pts.push([cx + Math.cos(q) * R * .78, cy + Math.sin(q) * R * .78]); }
      paint(pts, { wash: heat > .5 ? TK.orange : TK.steelLt, washOp: 70, ink: null });
    }
    for (let k = 0; k < 5; k++) {
      const q = a + k * TAU / 5;
      paint(rotPts(rectPts(cx, cy - R * .075, R * .8, R * .15), cx, cy, q), { wash: TK.steelLt, fill: TK.steel, fillOp: 80, tex: .5, ink: INK, sw: sw * .7 });
    }
    token(cx, cy, R * .3, { rot: a, glow: .4 + .5 * pulse2(t, 7) });
    // sparks thrown tangentially off the rim (more, longer, hotter as it speeds up)
    const n = Math.min(22, Math.floor(6 + w * 3));
    for (let i = 0; i < n; i++) {
      const per = .45, c = Math.floor(t / per + hash(i)), f = frac(t / per + hash(i)), q = hash(i * 3 + c * 7) * TAU;
      const px = cx + Math.cos(q) * R * 1.06, py = cy + Math.sin(q) * R * 1.06, v = 260 + w * 90 + hash(i + c) * 200;
      const vx = -Math.sin(q) * v, vy = Math.cos(q) * v, x = px + vx * f * per, y = py + vy * f * per + 900 * (f * per) ** 2;
      const tail = .04 + w * .004;
      inkLine([[x, y], [x - vx * tail, y - (vy + 1800 * f * per) * tail]], 2.6 * (1 - f) + .6, f < .4 ? TK.yellowLt : TK.orange, 'ink', 0);
    }
  }
  // the dotted ring with arrows between the stations; the arrow leaving the active station lights up
  function t05_ring(t, active, g) {
    const idx = Math.floor(t05_ang(t) * 40 / TAU * 1.5);
    for (let i = 0; i < 40; i++) {
      const [x, y] = ellAt(i / 40 * TAU), on = ((i - idx) % 10 + 10) % 10 === 0;
      paint(ellPts(x, y, on ? 9 : 5, on ? 9 : 5, 8), { wash: on ? TK.yellow : TK.sootLt, ink: null });
    }
    ORDER.forEach((st, i) => {
      const a0 = ST[st].a + .34, a1 = ST[st].a + TAU / 4 - .34, hot = st === active ? g : 0, pts = [];
      for (let j = 0; j <= 10; j++) pts.push(ellAt(lerp(a0, a1, j / 10)));
      inkLine(pts, 3 + hot * 5, mixCol(TK.steelLt, TK.yellow, hot), 'marker', .5);
      const [ex, ey] = pts[10], [px, py] = pts[8], d = Math.hypot(ex - px, ey - py), ux = (ex - px) / d, uy = (ey - py) / d, s = 22 + hot * 10;
      paint([[ex + ux * s, ey + uy * s], [ex - uy * s * .7, ey + ux * s * .7], [ex + uy * s * .7, ey - ux * s * .7]], { wash: hot > .3 ? TK.yellow : TK.steelLt, ink: INK, sw: .6 });
    });
  }

  // ---------- station pods ----------
  function t05_podContent(st, x, y, n, g, t) {
    if (st === 'gpu') {
      const k = Math.min(4, 1 + n);
      for (let i = 0; i < k; i++) gpuCard(x - 12 + i * 8, y + 38 - i * 26, .56, t * (1 + n), { glow: i === k - 1 ? g : 0 });
    } else if (st === 'tok') {
      const k = Math.min(15, 6 + n * 3), rows = [5, 4, 3, 2, 1];
      let c = 0;
      rows.forEach((m, r) => { for (let j = 0; j < m && c < k; j++, c++) token(x + (j - (m - 1) / 2) * 38, y + 60 - r * 28, 18, { burn: .25 + .15 * hash(c) }); });
      token(x + 80, y - 30, 30, { rot: t * 2, glow: g, burn: .15 });
    } else if (st === 'agt') {
      const k = Math.min(7, 2 + n * 2);
      for (let i = 0; i < k; i++) {
        const row = i % 2, xx = x + (Math.floor(i / 2) - (Math.ceil(k / 2) - 1) / 2) * 62 + row * 30;
        agentBot(xx, y + 72 - row * 36, 5.4, t, { n: i + 1, dance: g > .2 ? 'hop' : 'bounce', seed: i, eyes: g > .2 ? 'happy' : 'normal', mouth: 'grin', noShadow: true });
      }
    } else {
      const k = Math.min(12, 3 + n * 3);
      for (let i = 0; i < k; i++) {
        const tx = x - 70 + (i % 4) * 44 + hash(i) * 10, ty = y + 55 - Math.floor(i / 4) * 34 - i * 3, rot = (hash(i + 4) - .5) * .5;
        paint(rotPts(rectPts(tx - 32, ty - 20, 64, 42), tx, ty, rot), { wash: TK.cream, ink: INK, sw: .5 });
        paint(rotPts(rectPts(tx - 24, ty - 10, 10, 10), tx, ty, rot), { wash: i < n * 2 ? TK.green : '#FFFFFF', ink: INK, sw: .4 });
        inkLine(rotPts([[tx - 8, ty - 5], [tx + 24, ty - 5]], tx, ty, rot), .5, TK.ash, 'inkfine', 0);
        inkLine(rotPts([[tx - 24, ty + 8], [tx + 22, ty + 8]], tx, ty, rot), .5, TK.ash, 'inkfine', 0);
      }
    }
  }
  function t05_pod(st, t, focus) {
    const S = ST[st], { x, y } = S, g = t05_glow(t, st), n = t05_nHits(t, st), lit = n > 0 ? .35 : 0;
    const pw = 300, ph = 190;
    if (g > .02) glowAt(x, y, 260 + 80 * g, TK.yellow, 110 * g);
    paint(rrPts(x - pw / 2, y - ph / 2, pw, ph, 16), { wash: mixCol(TK.steelDk, '#4A2A18', lit + g * .5), fill: TK.soot, fillOp: 70, tex: .6, ink: INK, sw: 1.2 });
    for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) paint(ellPts(x + dx * (pw / 2 - 12), y + dy * (ph / 2 - 12), 5, 5, 6), { wash: TK.steelLt, ink: null });
    t05_podContent(st, x, y, n, g, t);
    // plaque + lamp
    const py = y - ph / 2 - 30, lamp = Math.max(lit, g);
    paint(rrPts(x - 118, py - 26, 236, 52, 8), { wash: mixCol(TK.steel, TK.orange, g), ink: INK, sw: 1 });
    letter(S.label, x, py + 1, 38, g > .3 ? TK.soot : TK.cream, { font: ruFont(38), ink: false });
    paint(ellPts(x + 140, py, 16, 16, 12), { wash: lamp > .1 ? mixCol(TK.orange, TK.yellowLt, g) : TK.emberDk, ink: INK, sw: .7 });
    if (lamp > .1) glowAt(x + 140, py, 40 + 60 * g, TK.yellow, 90 * lamp);
    // hit: shock ring + flying goods + multiplier
    for (const h of HITS) {
      if (h[1] !== st) continue;
      const age = t - h[0]; if (age < 0 || age > 1.1) continue;
      const rr = 120 + age * 520;
      if (age < .5) paint(ellPts(x, y, rr, rr * .7, 30), { ink: TK.yellow, sw: 3 * (1 - age * 2) + .3 });
      t05_burst(st, x, y, age, t, h[0]);
      if (focus) sfx(h[3], x + 190, y - 150, 90, TK.yellow, age, { life: .9, rot: .12, stroke: TK.soot });
    }
  }
  function t05_burst(st, x, y, age, t, seed) {
    const [ox, oy] = [x - WC[0], y - WC[1]], d = Math.hypot(ox, oy) || 1, ux = ox / d, uy = oy / d;
    const n = st === 'gpu' ? 4 : st === 'agt' ? 6 : 10;
    for (let i = 0; i < n; i++) {
      const sp = (hash(i + seed) - .5) * 1.8, v = 500 + hash(i + seed * 3) * 500, dx = ux * Math.cos(sp) - uy * Math.sin(sp), dy = ux * Math.sin(sp) + uy * Math.cos(sp);
      const px = x + dx * v * age, py = y + dy * v * age + 700 * age * age, rot = age * (hash(i) - .5) * 14;
      if (st === 'gpu') gpuCard(px, py, .3, t, { rot, fans: false });
      else if (st === 'tok') token(px, py, 16, { spin: age * 3 + hash(i), rot });
      else if (st === 'agt') clawd(px, py, 4.5, { col: '#6F8BE0', dk: '#3D55A8', lt: '#B5C6F0', rot, aL: 1.4, aR: 1.4, eyes: 'happy', mouth: 'O', noShadow: true, seed: i });
      else paint(rotPts(rectPts(px - 24, py - 16, 48, 32), px, py, rot), { wash: TK.cream, ink: INK, sw: .5 });
    }
  }

  // ---------- CEO starts the machine with his keynote clicker ----------
  function t05_ceo(t) {
    const tc = 94.85, age = t - tc, x = 280, y = 905, u = 20, after = t > tc;
    paint([[x - 60, 300], [x + 60, 300], [x + 230, 915], [x - 230, 915]], { fill: TK.yellowLt, fillOp: 45, bleed: .05, tex: .2, border: .1, ink: null });
    glowAt(x, y - 90, 190, TK.orange, 90);
    const tip = [x + 4.9 * u + Math.cos(-1.2) * 2.6 * u, y - 4.5 * u + Math.sin(-1.2) * 2.6 * u];
    if (after && age < .7) {                                                     // the zap from the clicker to the wheel
      const f = Math.floor(t * 24), pts = [tip];
      for (let i = 1; i <= 7; i++) { const k = i / 7; pts.push([lerp(tip[0], WC[0] - WR, k) + (hash(f + i) - .5) * 40 * (1 - k * k), lerp(tip[1], WC[1], k) + (hash(f + i + 9) - .5) * 60]); }
      inkLine(pts, 4 * (1 - age), TK.yellowLt, 'marker', 0);
      glowAt(tip[0], tip[1], 90 * (1 - age), TK.yellow, 160);
    }
    ceoClawd(x, y, u, {
      ...(after ? move('stomp', t * 2) : move('idle', t)), eyes: after ? 'happy' : 'narrow', mouth: after ? 'grin' : 'smile',
      aR: 1.2 + (after ? .2 * pulse2(t) : 0), aL: after ? 1.3 : .1, click: after ? Math.max(Math.exp(-age * 5), pulse2(t, 9) * .6) : 0
    });
    if (after) sfx('КЛИК', x + 60, y - 230, 60, TK.yellow, age, { font: ruFont(60), life: .6, rot: -.1 });
  }

  // ---------- shot 1+2: the flywheel (94.5–114) ----------
  const CAMK = [
    [94.5, [420, 720, 1.75, -.04]], [95.3, [440, 710, 1.65, -.03]], [96.5, [960, 455, .85, 0]], [97.3, [960, 455, .86, 0]],
    [100.8, [960, 440, .95, .01]], [101.1, [960, 330, 1.45, -.02]], [103.2, [960, 320, 1.5, -.03]], [103.4, [960, 250, 1.85, .02]],
    [104.5, [960, 250, 1.9, .02]], [104.7, [1330, 470, 1.55, .03]], [106.9, [1310, 480, 1.62, .02]], [107.06, [960, 720, 1.5, -.02]],
    [108.1, [940, 710, 1.56, -.02]], [108.3, [600, 480, 1.5, .02]], [109.4, [600, 480, 1.55, .02]], [109.5, [540, 470, 1.8, -.02]],
    [110.45, [540, 470, 1.85, -.02]], [110.6, [640, 480, 1.25, .01]], [111.7, [660, 480, 1.2, .01]], [111.9, [960, 455, .85, 0]], [114, [960, 455, .92, .02]]
  ];
  function t05_whip(x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function t05_wheelShot(t) {
    const heat = seg(t, 100, 113.5), last = t05_last(t), hitAge = last ? t - last[0] : 9;
    const [cx, cy, z, r] = kf(t, CAMK, t05_whip), [sx, sy] = shakeXY(t, 14 * Math.exp(-hitAge * 7) + 3 * heat * pulse2(t));
    camBegin(cx + sx, cy + sy, z * (1 + .018 * pulse2(t, 7) + .05 * Math.exp(-hitAge * 9)), r);
    t05_hall(t, heat);
    if (heat > .6) for (const fx of [520, 1400]) fire(fx, 910, 260, 260, t, { k: seg(heat, .6, 1), seed: fx });
    t05_ring(t, last ? last[1] : null, last ? Math.exp(-hitAge * 1.8) : 0);
    t05_flywheel(WC[0], WC[1], WR, t, heat);
    const focus = last ? last[1] : null;
    for (const st of ORDER) t05_pod(st, t, st === focus);
    if (t < 99) t05_ceo(t);
    // counters under the tokens / tasks pods
    counter(ST.tok.x, ST.tok.y + 130, 28, 1e6 * Math.pow(10, Math.max(0, t - 96) / 4));
    counter(ST.task.x, ST.task.y + 130, 28, Math.pow(2, 3 + Math.max(0, t - 96) * 1.3));
    camEnd();
    // boot-up: station lamps blink in sequence on half-beats before the first line
    if (last) punkText(last[2], 960, 96, 80, t, last[0], { seed: Math.round(last[0] * 10) });
    else if (t > 95.2) punkText('МАХОВИК ЭКОНОМИКИ', 960, 96, 64, t, 95.2, { seed: 3 });
    flash(Math.exp(-hitAge * 14) * .35, TK.yellowLt);
  }

  // ---------- shot 3: ЭКОНОМИКА РАБОТАЕТ! (114–116.4) ----------
  function t05_economy(t, lt) {
    const moon = easeIn(seg(t, 114.3, 115.9)), k = seg(t, 114, 114.45);
    const [sx, sy] = shakeXY(t, 16 * Math.exp(-lt * 6) + (t > 115.1 ? 14 * Math.exp(-(t - 115.1) * 6) : 0));
    camBegin(960 + sx, 540 + sy - 40 * moon, 1 + .04 * lt, -.015 * moon);
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: TK.soot, ink: null });
    sunburst(1500, 200, TK.emberDk, TK.sootLt, t * .5, 18, 2400, 90);
    t05_flywheel(1720, 330, 120, t, 1);
    paint(rectPts(-400, 905, W + 800, 600), { wash: '#241E20', ink: INK, sw: 1 });
    ticker(t, { y: -10, h: 64, items: ['TOKN ▲ 900%', 'NVDA ▲', 'CAPEX ▲', 'AGI ▲ СКОРО', 'GPU ▲'], speed: 700 });
    stockChart(250, 150, 1330, 700, t, { k, moon, n: 18, title: 'ИНДЕКС ТОКЕНОВ', seed: 5 });
    // the breakout arrow keeps flying off the top of the frame
    if (moon > .03) {
      const ay = lerp(200, -700, moon), ax = 1500 + moon * 90;
      inkLine([[1490, 330], [ax - 10, ay + 80]], 8 + 10 * moon, TK.yellow, 'marker', .3);
      paint([[ax + 10, ay - 90], [ax - 70, ay + 50], [ax + 90, ay + 60]], { wash: TK.yellow, fill: TK.orange, fillOp: 80, ink: INK, sw: 1.4 });
      fire(ax - 10, ay + 260, 110, 220 * (.5 + moon), t, { seed: 7 });
    }
    ceoClawd(170, 905, 17, { ...move('hop', t * 2), aL: 1.5, aR: 1.5 + .2 * pulse2(t), eyes: 'happy', mouth: 'grin', click: pulse2(t, 8) });
    for (let i = 0; i < 3; i++) agentBot(1640 + i * 110, 905, 9, t * 2, { n: 40 + i, dance: 'hop', seed: i, aL: 1.4, aR: 1.4, eyes: 'happy', mouth: 'grin' });
    camEnd();
    tokenRain(t, { n: 16, seed: 5, r: 22 });
    stamp('ЭКОНОМИКА', 820, 600, 130, t, 114.0, { rot: -.07, col: TK.ember });
    stamp('РАБОТАЕТ!', 1060, 800, 130, t, 115.1, { rot: .05, col: TK.led });
    flash(Math.exp(-lt * 10) * .6 + (t > 115.1 ? Math.exp(-(t - 115.1) * 10) * .4 : 0), TK.yellowLt);
  }

  // ---------- shot 4: mosh pit (116.4–124.7) ----------
  function t05_surfer(x, y, t, ceo, s, seed) {
    const bob = Math.abs(Math.sin(bpOf(t) * Math.PI)) * 18, rot = Math.sin(t * 3 + seed) * .08;
    const hands = [-1, 0, 1].map(i => [x + i * 110 * s, y + 70 * s]);
    gpuCard(x, y - bob, .75 * s, t, { rot, glow: .3 });
    for (const [hx, hy] of hands) paint(rrPts(hx - 14 * s, hy - bob - 38 * s, 28 * s, 34 * s, 10 * s), { wash: PAL.clay, ink: INK, sw: .6 });
    if (ceo) ceoClawd(x - 10 * s, y - bob - 46 * s, 13 * s, { rot: rot - .15, aL: 1.9, aR: 1.6 + .3 * pulse2(t), eyes: 'happy', mouth: 'grin', click: pulse2(t, 9), noShadow: true });
    else agentBot(x, y - bob - 46 * s, 9 * s, t, { n: 7 + seed, rot: rot + .1, aL: 1.8, aR: 1.8, eyes: 'happy', mouth: 'O', noShadow: true });
  }
  const t05_ceoX = t => lerp(-200, 2100, seg(t, 116.4, 124.5));
  function t05_mosh(t, lt) {
    const hb = Math.floor(bpOf(t) * 2), p2 = pulse2(t, 7), bar = Math.floor(bpOf(t) / 4);
    const pan = clamp(lerp(960, t05_ceoX(t), .3), 880, 1040), [sx, sy] = shakeXY(t, 6 * p2);
    camBegin(pan + sx, 520 + sy, 1.09 + .03 * p2 + .06 * (1 - seg(t, 116.4, 117)), Math.sin(t * 1.3) * .02);
    paint(rectPts(-800, -600, W + 1600, H + 1200), { wash: hb % 2 ? TK.soot : '#2A1414', ink: null });
    // back: the machine keeps spinning, burning racks, sweeping lights
    t05_flywheel(960, 380, 200, t, 1);
    for (const [rx, s] of [[180, 1], [1560, 2]]) serverRack(rx, 200, 180, 520, t, { heat: 1, seed: s, units: 7 });
    for (let i = 0; i < 4; i++) {
      const bx = 240 + i * 480, sw = Math.sin(t * 2.2 + i * 1.7) * 380, on = (hb + i) % 2 === 0;
      paint([[bx - 40, -60], [bx + 40, -60], [bx + sw + 220, 950], [bx + sw - 220, 950]], { fill: [TK.yellow, TK.orange, TK.ember, TK.yellowLt][i], fillOp: on ? 80 : 25, bleed: .08, tex: .2, border: .1, ink: null });
    }
    // pyro on the bar
    const side = bar % 2 ? 1 : -1, pk = Math.exp(-frac(bpOf(t) / 4) * 3);
    for (const s of [-1, 1]) fire(960 + s * 640, 760, 200, 520 * (s === side ? pk : .25 + .2 * p2), t, { seed: 11 + s });
    // the pit
    t05_surfer(lerp(2150, 300, seg(t, 116.9, 124.6)), 640, t + .3, false, .65, 1);
    t05_surfer(lerp(-300, 1500, seg(t, 119.2, 124.6)), 600, t + .6, false, .55, 2);
    crowdMosh(t, { y: 985, k: 1.3, n: 12 });
    t05_surfer(t05_ceoX(t), 800, t, true, 1.5, 0);
    // token confetti launched from the crowd
    for (let i = 0; i < 16; i++) {
      const per = 1.2 + hash(i) * .6, c = Math.floor(t / per + hash(i + 3)), f = frac(t / per + hash(i + 3));
      const x0 = hash(i * 7 + c) * W, vx = (hash(i + c * 3) - .5) * 500, vy = -(900 + hash(i + c) * 500);
      const x = x0 + vx * f * per, y = 960 + vy * f * per + 1100 * (f * per) ** 2;
      if (y < 1000) token(x, y, 16 + hash(i + 9) * 12, { spin: t * 3 + hash(i), rot: t * 4 * (hash(i) - .5), glow: i % 5 ? 0 : .5 });
    }
    camEnd();
    flash(p2 * (hb % 4 === 0 ? .45 : .22), hb % 2 ? TK.orange : TK.yellowLt);
  }

  chapter('drop', 94.5, 124.7, [[94.5, t05_wheelShot], [114.0, t05_economy], [116.4, t05_mosh]]);
})();
