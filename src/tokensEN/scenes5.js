// tokensEN/scenes5.js: track v2 native EN scenes (the long instrumental break before «We're gonna need more electricity»).
(() => {
  const INK = PAL.ink;
  const { kick, back } = ENK;
  const scene = (name, a, b, fn, keys, punch = []) => {
    chapter('en_' + name, a, b, [[a, ENK.native(fn)]], { real: true });
    EN_KEYS.push(...keys); EN_PUNCH.push(...punch);
  };

  // ======== POWER-UP (v1 112.556–114.12 = real 113.70–126.40): the server cathedral powers up before the sermon ========
  // The a06 nave (the set bridge_needs in scenes3.js plays from v1 114.12) starts dark. On each real downbeat one step lights up: first the
  // pews of racks in the foreground, front row to back, then the rack pillars, the stained glass, last the pulpit, where the CEO rises from
  // behind the lectern as a silhouette. One slow push down the aisle that lands exactly on the bridge_needs frame [960, 530, 1040].
  const A = 112.556, B = 114.12;
  for (let i = EN_KEYS.length - 1; i >= 0; i--) if (EN_KEYS[i][0] >= A && EN_KEYS[i][0] < B) EN_KEYS.splice(i, 1);   // bridge_needs' 112.60 key
  const DB = EN_DOWNBEATS.filter(v => v > A + .01 && v < B).map(O2N);    // real s: 115.0, 116.34, … 125.62
  const step = s => DB.filter(d => s >= d).length;                       // how many downbeats have landed
  const ROWS = [[1990, 270], [1800, 225], [1630, 185], [1480, 150], [1370, 120]];   // pews front → back: [floor y, rack h]; all tops below the end frame (1223)
  const NROW = ROWS.length, NSTEP = Math.max(DB.length, NROW + 3);
  function pew(s, y, h, r, lit, k) {
    const w = h * .62, hw = 170 + (y - 1240) * .3, gap = w * .18;
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) {
      const x = 960 + sd * (hw + i * (w + gap)) - (sd < 0 ? w : 0), seed = r * 7 + i + (sd > 0 ? 3 : 0);
      paint(ellPts(x + w / 2, y + 4, w * .62, h * .06, 14), { wash: '#05060E', washOp: 140, ink: null });
      if (lit) glowAt(x + w / 2, y - h * .5, w * (1.1 + .5 * k), TK.green, 35 + 70 * k);
      serverRack(x, y - h, w, h, lit ? s : 0, { units: 5, seed });
      if (!lit) paint(rectPts(x, y - h, w, h), { wash: '#05060E', washOp: 175, ink: null });
      // a candle on every rack top: warm flame once the row is on
      const cx = x + w * .5, cy = y - h, ch = h * .16, fl = 1 + .12 * Math.sin(s * 9 + seed);
      paint(rectPts(cx - ch * .14, cy - ch, ch * .28, ch), { wash: lit ? '#FFF5E2' : '#3B3F4A', ink: INK, sw: .4 });
      if (lit) {
        glowAt(cx, cy - ch * 1.25, ch * 1.6, '#FFB43A', 120);
        paint(ellPts(cx, cy - ch * 1.25, ch * .14 * fl, ch * .3 * fl, 10), { wash: '#FFD21F', ink: null });
      }
    }
  }
  function powerup(t) {
    const s = O2N(t), n = step(s), on = i => n > i ? 1 : 0, kk = i => (DB[i] != null ? kick(s, [DB[i]], .5) : 0);
    back('#1A1726');
    // step NROW+1: windows + rose warm up, NROW+2: the pulpit spotlight; the dark lifts in steps, gone by the last downbeat
    const winK = ease(seg(s, DB[NROW + 1] ?? 122.98, (DB[NROW + 2] ?? 124.3) + .6));
    A06.nave(s, { choir: false, L: lerp(.12, .55, winK) });
    A06.reservoir(s, 540, 110, 310, 235, 1);                             // bridge_needs' poster on the wall (scenes3.js LAKE), full lake
    [600, 710, 820].forEach((x, i) => A06.angel(x, 990, 12, s, { n: i + 3, k: 0, eyes: 'closed', mouth: 'smile' }));   // bridge_needs' copper singers, waiting
    const rise = ease(seg(s, 123.6, 125.5));
    A06.pulpit(s, { eyes: 'narrow', mouth: 'smile', aL: .5, dy: 9 * (1 - rise) });
    // the floor beyond the 16:9 world: stone, perspective seams, below the end frame
    paint(rectPts(-600, 1230, W + 1200, 1100), { wash: '#232A33', fill: '#1C1F24', fillOp: 90, tex: .5, ink: null });
    for (let i = -6; i <= 6; i++) inkLine([[960 + i * 140, 1230], [960 + i * 300, 2300]], .6, '#3B3F4A', 'inkfine', 0);
    flushLetters();
    const dark = .85 * (1 - Math.min(1, n / NSTEP));
    paint(rectPts(-800, -800, W + 1600, H + 3200), { wash: '#07060C', washOp: 215 * clamp(dark) * (1 - .25 * kick(s, DB, .4)), ink: null });
    // the pews: front row lights first, toward the pulpit
    ROWS.forEach(([y, h], r) => pew(s, y, h, r, on(r), kk(r)));
    // the preacher's spotlight, gone by the hand-off (bridge_needs has none)
    const spot = seg(s, 123.4, 124.6) * (1 - seg(s, 125.7, 126.35));
    if (spot > .02) A06.beam(960, 960, 60, 260, 880, .55 * spot);
  }
  // one take, no cuts: a slow push down the aisle (2 keys ≈ one eased glide over real 113.7–126.4) onto the bridge_needs framing
  scene('powerup', A, B, powerup, [[A, 960, 820, 1700], [B - .001, 960, 530, 1040, 1], [B, 960, 530, 1040]]);
})();
