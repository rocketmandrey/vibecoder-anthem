// tokensEN/scenes.js: BURN THE TOKENS scene edits over the reused chapters (no chapter file is touched). EN song time = T.
// So far: the H1 pilot (E06–E09, 39.78–65.18) — one shredder take, the limit bar falling to the floor, the odometer's «+1 MORE»,
// the chapter cameras held still (the 4:5 reels camera frames the shots), no glitch cuts and no beat shake outside the planned punches.
// Loaded after tokensEN/warp.js, before tokens3/square.js (SQSHOTS_X).
(() => {
  const inWin = W => W.some(([a, b]) => T >= a && T < b);

  // ---------- cameras: inside CAM_WIN the chapter camera stands still on the 16:9 frame; SHAKES are the only camera shakes there ----------
  const CAM_WIN = [[39.78, 65.18]];
  const SHAKES = [[43.68, 14, 1.0]];                                     // [EN t, px, length]: E06 «IS THAT ALL YOU GOT?!» (planned punch #1 of 4)
  const _camBegin = camBegin;
  camBegin = (cx, cy, zoom, rot) => {
    if (!inWin(CAM_WIN)) return _camBegin(cx, cy, zoom, rot);
    let a = 0; for (const [t0, px, len] of SHAKES) if (T >= t0 && T < t0 + len) a = Math.max(a, px * Math.exp(-(T - t0) / .35));
    const [sx, sy] = shakeXY(T, a);
    _camBegin(W / 2 + sx, H / 2 + sy, 1, 0);
  };
  // v2's glitch cuts: only on the drop entry and the limit-reset notification (STORYBOARD_EN §3)
  const GLITCH_OK = [[135.1, 135.45], [230.7, 231.0]];
  const _glitchCut = glitchCut;
  glitchCut = (t, tCut, o) => { if (inWin(GLITCH_OK)) _glitchCut(t, tCut, o); };

  // ---------- E07 punch: «'Til the limit hits the floor!» — the WEEKLY LIMIT bar lets go on «hits», lands on «floor.» ----------
  const FALL = { t0: 48.94, t1: 49.30, end: 50.72, x: 600, y: 212, y1: 930 };
  const _limitBar = limitBar;
  limitBar = (x, y, w, v, o = {}) => {
    if (x !== FALL.x || y !== FALL.y || T < FALL.t0 || T >= FALL.end) return _limitBar(x, y, w, v, o);
    const p = clamp((T - FALL.t0) / (FALL.t1 - FALL.t0)), land = T - FALL.t1;
    const dy = land < 0 ? (FALL.y1 - y) * p * p : FALL.y1 - y - 24 * Math.abs(Math.sin(land * 10)) * Math.exp(-land * 8);
    _limitBar(x, y + dy, w, v, { ...o, glow: 0, burn: land < 0 ? o.burn : .35 * Math.exp(-land) });
  };
  function clang() {
    const age = T - FALL.t1; if (age < 0 || age > 1.3) return;
    for (let i = 0; i < 9; i++) {                                           // floor dust kicked up along the bar
      const f = clamp(age / 1.1), x = FALL.x + (i + .5) / 9 * 720 + (hash(i) - .5) * 40, r = (26 + 70 * f) * (.7 + hash(i + 3) * .6);
      paint(ellPts(x, 1000 - 36 * f - hash(i + 7) * 20, r, r * .55, 10), { fill: '#B8A58C', fillOp: 85 * (1 - f), bleed: .3, tex: .3, ink: null });
    }
    sfx('CLANG!', 1240, 830, 110, TK.yellow, age, { life: 1.2, stroke: TK.soot, font: ruFont(120), rot: .08 });
  }

  // ---------- E08: «One more million — then one more!»: 1,000,000 on «million», 2,000,000 + «+1 MORE» on «one more» ----------
  const MORE = { roll: 54.94, hit: 55.20 };
  function oneMore() {
    if (T < MORE.roll) return;
    const k = clamp((T - MORE.roll) / (MORE.hit - MORE.roll));
    counter(960, 500, 140, k < 1 ? 1e6 + 999999.99 * k * k : 2e6, { col: '#FFE38A' });
    stamp('+1 MORE', 1300, 185, 64, T, MORE.hit, { col: TK.ember, rot: .12 });
  }

  // ---------- a03 re-cut: E07 is one take (drop the limit close-up at 47.75 and the re-entry at 49.7), overlays on top ----------
  const c3 = CH.find(c => c.name === 'chorus1'), shotAt = t0 => c3.shots.find(s => s[0] === t0)[1];
  const chorusA = shotAt(45.05), million = shotAt(52.85);
  c3.shots = c3.shots.filter(([t0]) => t0 !== 47.75 && t0 !== 49.7).map(([t0, fn]) =>
    fn === chorusA ? [t0, (t, lt, d) => { fn(t, lt, d); if (T < FALL.end) clang(); }] :
    fn === million ? [t0, (t, lt, d) => { fn(t, lt, d); if (T < 55.64) oneMore(); }] : [t0, fn]);

  // ---------- the 4:5 reels camera: [EN t, cx, cy, width, glide] (width 1080 = full scale; picture height = 1.25 × width) ----------
  const PRE = [                                                           // E06 (and its E14 replay +47.43)
    [0, 960, 560, 1320],                                                  //   the burning hall, coolers howl
    [2.42, 960, 520, 1240, 1],                                            //   push in to the ram slam
    [3.17, 960, 520, 1240],                                               //   Wall Street's chart: eyes → the shout
  ];
  const PILOT = [
    ...PRE.map(([d, ...k]) => [39.78 + d, ...k]),
    [45.46, 960, 590, 1440],                                              // E07 the shredder line, bar on the wall and the floor both in frame
    [50.719, 960, 600, 1360, 1],                                          //   one slow push-in over the whole take
    [50.72, 960, 470, 1200],                                              // E08 the odometer, cheering hard-hats at the edges
    [55.639, 960, 470, 1120, 1],
    [55.64, 900, 500, 1500],                                              // E09 hiring: MORE AGENTS! / MORE COMPUTE!
    [58.60, 1060, 520, 1560],                                             //   CEO slide: WHY? → DON'T ASK. → GOOD FOR YOU
    [65.179, 1060, 540, 1440, 1],
  ];
  const E14 = [[87.60, ...PRE[0].slice(1)], ...PRE.slice(1).map(([d, ...k]) => [87.21 + d, ...k])];
  // everything else: the RU reels keys (v3 time) moved onto the EN track — a first pass until each scene gets its own
  window.SQSHOTS_X = RU => [
    ...RU.map(([t, ...k]) => [+V32EN(t).toFixed(3), ...k]).filter(([t]) => !(t >= 39.78 && t < 65.18) && !(t >= 87.6 && t < 92.86)),
    ...PILOT, ...E14,
  ].sort((a, b) => a[0] - b[0]);
})();
