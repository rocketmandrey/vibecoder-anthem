// tokensEN/warp.js: BURN THE TOKENS plays the same v2/v3 chapters on the English track (src/tokensEN/truth.js) through one more time warp.
// Loaded AFTER the chapters (a07 / a10 bake v3 → v2 cues at load with the v3 TIME_WARP; this file then swaps TIME_WARP for the EN one).
// ENW anchors, in EN song time (the scene table is STORYBOARD_EN.md «Timing (track v1)»):
//   [en, v3]          pair an EN event with a v3 event (line starts, hits); converted to v2 by the v3 warp (tokens3/warp.js)
//   [en, null, v2]    a direct v2 chapter cue (the H1 pilot and the pre-chorus replay are cued this way, word by word)
//   [en, null, v2, 1] the same, in a replayed stretch (kept out of the EN ↔ v3 map, which has to stay monotonic)
// Two anchors at (almost) the same EN time are a hard cut; a flat v2 stretch is a freeze (everything stops, EN overlays keep moving).
// NEVER put an anchor after a // on the same line: it silently disappears.
(() => {
  const W3 = window.TIME_WARP;                                     // v3 real → v2
  // E06 / E14 pre-chorus, cued on the EN words (a03 crush → talk: the press flattens the hall into Wall Street's chart, it shouts)
  const PRE = [
    [0, 39.8],          // E06 cut, one beat before the 40.12 downbeat so the pickup «Fans» 40.02 is on the new set
    [2.52, 41.82],      // ram slam 1 after «hot.» 41.98
    [2.90, 42.47],      // slam 2 = the chart springs up on «Wall» 42.68
    [3.17, 42.72],      // talk: eyes
    [3.52, 43.78],      // it looks at us on «screams» 43.30
    [3.72, 44.3],       // mouth opens
    [3.90, 44.72],      // gape on the shout «Is» 43.68
    [3.97, 44.8],       // the shout leaves the mouth, grows over the whole line
    [5.42, 45.04],
  ];
  const A = [
    // E01 intro 0–18.16: the v3 opening squeezed onto the EN 18 s (drops 2.30 / 5.11, first slam 13.40 = title slam)
    [0, 0], [2.299, 2.86], [5.108, 5.564], [13.398, 17.45], [18.16, 24.95],
    // E02–E05 verse 1: line starts ↔ v3 line starts (the v2 shots cut on them)
    // (a02 v2 shots: friday 20.1, screen 22.65, park 25.25, burn 27.8, wave 30.5 / 32.5, rocket 33.98, arcade 35.1, website 37.75) — the app/bot wave,
    // the moon rocket and the website are skipped: the sparkle under the limit bar plays slow under «Don't need an app … why the hell not?»,
    // the arcade holds «game» + «website»
    [18.2, null, 20.2], [20.799, null, 22.6], [20.8, null, 22.7], [23.539, null, 25.2], [23.54, null, 25.3], [26.379, null, 27.75], [26.38, null, 27.85],
    [29.079, null, 30.45], [29.08, null, 30.52], [29.68, null, 30.95], [30.98, null, 31.62], [31.759, null, 32.45], [31.76, null, 32.55], [34.519, null, 33.95], [34.52, null, 35.15], [39.779, null, 37.7],
    ...PRE.map(([d, v2]) => [39.78 + d, null, v2]),
    // E07 45.46–50.72: one shredder take (a03 chorusA; the limit close-up and the re-entry are dropped in scenes.js)
    [45.46, null, 45.05], [45.47, null, 45.10],                    // gang A shouts on «Burn» (the cut sits on the 45.46 downbeat)
    [46.68, null, 46.56],                                          // gang B on the second «burn»
    [48.30, null, 47.75], [48.94, null, 48.8],                     // «limit» … «hits»: the bar lets go of the wall
    [49.30, null, 49.2], [49.95, null, 49.2],                      // «floor.» CLANG: the whole line freezes for half a second
    [50.719, null, 49.62],
    // E08 50.72–55.64: the odometer creeps under «Burn the tokens», 1,000,000 on «million» 53.90, 2,000,000 on «one more» (scenes.js)
    [50.72, null, 52.85], [53.90, null, 53.65], [55.639, null, 55.24],
    // E09 55.64–65.18: hiring (MORE AGENTS! / MORE COMPUTE! on the words) → CEO slide: WHY? burns on «ask», GOOD FOR YOU on «good»
    [55.64, null, 55.25], [55.65, null, 55.30], [57.16, null, 58.0], [58.599, null, 59.6],
    [58.60, null, 60.35], [58.76, null, 60.84], [59.45, null, 61.5], [59.46, null, 63.8], [60.46, null, 64.54], [61.6, null, 64.9],
    [64.21, null, 66.3], [64.22, null, 66.4], [65.179, null, 67.09], [65.18, null, 67.1],
    // E10–E13 verse 2 (EN order differs from RU after «hired an agent»: the report shot comes before the 40M price here)
    [68.90, 74.82], [71.34, 77.44], [74.00, 79.87], [76.80, 82.14], [81.94, 84.753], [85.02, 86.973], [87.599, 89.6],
    // E14 87.60–92.86: the pre-chorus replays a03 crush → talk (+47.43 s, same cues)
    [87.60, null, 40.11, 1], ...PRE.map(([d, v2]) => [87.21 + d, null, v2, 1]).filter(a => a[0] > 87.6), [92.859, null, 45.049, 1],   // 40.11 = the crush at the same point of «Fans» as E06
    // E15–E17 chorus 2 (a05 night factory) + break: ЩЁЛК on the 109.90 downbeat, the four «click»s on the next ones
    [92.86, 97.45], [95.68, 99.736], [98.00, null, 96.86], [102.879, null, 100.0], [102.88, 107.244], [105.84, 112.03],
    [109.90, 118.075], [110.55, 118.71], [111.2, 119.344], [111.86, 119.978], [112.52, 120.613],
    // E18–E21 bridge: the choir is three calls long in EN (116.44–124.36) → the RU «меди / воды» shot is held slow, not repeated
    [113.84, 121.868], [114.12, 122.265], [116.44, 126.012], [124.36, 128.6], [124.74, 128.72], [126.88, 129.974], [129.98, 132.464], [133.30, 135.004],
    [134.0, 136.49], [135.219, 137.0],                              // shades on at the end of «need…», held through the silence
    // E22 135.22 glitch-cut into drop 1 on the shout, CLACK on «GPUs» 136.06, the tower on the 136.80 drop; the v3 GPU rush is skipped
    [135.22, 137.71], [136.06, 138.41], [136.8, 139.16], [139.379, 139.8],
    // E23 139.38: the flywheel, one whip per sung half-phrase (EN has 6 left in this shot, v3 whips 3–8)
    [139.38, 151.6], [139.62, 151.89], [140.88, 152.869], [142.18, 154.175], [143.38, 155.48], [144.78, 156.788], [146.06, 158.092], [147.53, 159.94],
    // E24 THE ECONOMY IS WORKING (148.70 / 149.60), rap on the 152.04 slam
    [148.56, 160.4], [149.60, 161.483], [152.04, 162.545], [153.24, null, 158.42], [154.08, null, 159.02], [154.46, 164.734], [156.06, null, 160.86],   // a08 calendar 2024 «say» / 2025 «year», LOADING 99.999% «it's» [157.46, 167.819], [160.10, 170.252],
    // E27–E28 mayo (v3 real chapter 172.66–186.95), the held «mayonnaise» 172.14–175.88 rides the tunnel
    [162.86, 172.66], [165.12, 175.552], [167.58, 177.876], [170.30, 180.637], [175.88, 186.12],
    // E29–E31 final chorus (a09)
    [178.58, 186.95], [178.84, null, 180.92], [179.82, null, 182.44], [180.46, null, 183.0], [181.44, null, 183.76],   // a09 presses on Burn / burn / tokens, the drain on «Till»
    // a09 on the EN words (scripts/sync_check.mjs): ДОХОДЫ / ПОТОМ / ПРИБЫЛЬ / ПОТОМ on Revenue / Later / Profit / How, AGI cut, SOON, CAPEX, NOW,
    // the benchmark cut on «One», the axis presses on «up» / «score», + on «Worth», the puppet jerks on «half» / «trillion»
    [183.74, null, 185.68], [184.38, null, 186.66], [185.00, null, 187.48], [185.66, null, 188.0], [186.38, null, 188.7],
    [187.04, null, 190.0], [187.62, null, 190.72], [188.32, null, 191.2], [189.04, null, 191.7], [189.76, null, 192.55], [190.90, null, 193.19],
    [191.88, null, 193.32], [192.26, null, 193.77], [192.90, null, 194.34], [194.32, 200.768],
    // E31b/c the held «more.» 194.22–209.88: placeholder, the v3 puppets / TV-off stretched until the new scene exists
    [209.88, 203.4], [210.0, 203.565],
    // E32–E34 outro (a10) on the spoken words
    [210.24, 204.478], [214.40, 211.827], [217.08, 213.88], [219.60, 216.18], [222.32, 218.62], [224.92, 220.72], [226.74, 223.048],
    [228.759, 224.775], [228.76, 224.78], [228.83, 224.845],        // «Midnight»: SUN 11:59 PM → MON 12:00 AM
    // E35 reset → close-up → «Fuck.» 236.28 → the 237.02 break (b10 finale, v3 real) → second «Fuck.» 241.92 → credits
    [230.82, 226.424], [232.0, 227.637], [234.06, 228.54], [236.28, 230.36], [237.019, 231.36], [237.02, 231.365], [237.68, 233.367], [238.0, 234.03],
    [241.6, 240.4], [241.92, 240.641], [EN_DUR, 242.23], [EN_DUR + 20, 260],
  ];
  const TAB = A.map(([e, r, v2]) => [e, v2 ?? W3(r)]);
  const UNW3 = v2 => lerpTab(WARP, v2, 1, 0);                          // v2 → v3 (the v3 warp is monotonic)
  const ENV3 = A.filter(a => !a[3]).map(([e, r, v2]) => [e, r ?? UNW3(v2)]);   // EN ↔ v3: the v3-real chapters (mayo, finale), the RU reels keys
  for (let i = 1; i < TAB.length; i++) if (TAB[i][0] < TAB[i - 1][0]) console.warn('tokensEN warp: EN anchors out of order at', TAB[i]);
  for (let i = 1; i < ENV3.length; i++) if (ENV3[i][1] < ENV3[i - 1][1]) console.warn('tokensEN warp: v3 anchors out of order at', ENV3[i]);

  const EN2V2 = t => lerpTab(TAB, t, 0, 1), EN2V3 = t => lerpTab(ENV3, t, 0, 1), V32EN = r => lerpTab(ENV3, r, 1, 0);
  // v2 → EN near the frame being drawn: TAB repeats v2 stretches (the pre-chorus replay), so invert locally around T
  function enOfV2(t2) {
    let k = 1; while (k < TAB.length - 1 && TAB[k][0] <= T) k++;
    const a = TAB[k - 1], b = TAB[k], slope = (b[1] - a[1]) / Math.max(1e-6, b[0] - a[0]);
    return Math.abs(slope) < 1e-3 ? T : T + (t2 - EN2V2(T)) / slope;
  }
  // the quarter-note grid: the tracker's downbeats (1.32 s bars) split in two, so poses pulse at the v3 pace (~0.66 s), not on the 8ths
  const GRID = [];
  EN_DOWNBEATS.forEach((d, i) => {
    const n = EN_DOWNBEATS[i + 1]; if (n == null) { GRID.push(d); return; }
    if (n - d < .45) return;                                            // tracker double-hits in the intro
    const m = Math.max(1, Math.round((n - d) / .66)); for (let j = 0; j < m; j++) GRID.push(d + (n - d) * j / m);
  });
  function beatEN(e) {
    const B = GRID, n = B.length;
    if (e < B[0]) return (e - B[0]) / (B[1] - B[0]);
    if (e >= B[n - 1]) return n - 1 + (e - B[n - 1]) / (B[n - 1] - B[n - 2]);
    let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (B[m] <= e) lo = m; else hi = m; }
    return lo + (e - B[lo]) / (B[hi] - B[lo]);
  }

  window.TIME_WARP = EN2V2;
  window.BEAT_OF = t => beatEN(window.EN_NATIVE ? t : window.REAL_CH ? V32EN(t) : enOfV2(t));   // EN_NATIVE: the new EN chapters (scenes.js) run on EN time
  HITS.length = 0; for (const [e, s] of EN_HITS) HITS.push([+EN2V2(e).toFixed(3), s]);
  // v3-real chapters: bounds and shot starts move to EN time, the shots still get v3 time
  for (const c of CH.filter(c => c.real)) {
    c.start = V32EN(c.start); c.end = V32EN(c.end);
    c.shots = c.shots.map(([t0, fn]) => [V32EN(t0), (t, lt, d) => { const r = EN2V3(t); fn(r, r - t0, d); }]);
  }
  CH.sort((a, b) => a.start - b.start);
  Object.assign(window, { EN2V2, EN2V3, V32EN, EN_GRID: GRID, beatEN, EN_TAB: TAB });
})();
