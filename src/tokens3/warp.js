// tokens3/warp.js: «Жги токены» v3 plays the v2 chapters unchanged through a time warp.
// WARP = [v3 time, v2 time] anchors on the same sung words (whisper, both tracks), the v2 chapters' own cue times and the big hits; piecewise linear.
// Two anchors with (almost) the same v3 time are a hard cut in v2 time.
// Beats and hits are the real v3 ones (audio.js): bpOf() and HITS are rebuilt so the camera pulses sit on this track's beat,
// not on v2's fixed 94.2 grid (Suno's tempo drifts 0.639 → 0.662 s/beat after 2:00; that grid is what slid under the sermon and the wheel).
const WARP = [
  [0, 0], [1.0, .6], [5.6, 5.2], [24.88, 20.1],
  [30.0, 25.25], [32.9, 27.8], [35.5, 30.5], [37.7, 32.52], [38.9, 33.98], [40.42, 35.14], [42.8, 37.78], [45.54, 39.84], [48.12, 42.92],
  [50.26, 45.1], [52.86, 47.78], [55.66, 49.74], [58.0, 52.88], [60.32, 55.3], [62.86, 58.0], [65.28, 60.4], [68.52, 63.78], [69.28, 64.54],
  [72.18, 67.14], [74.8, 69.98], [77.24, 72.68], [79.58, 74.62], [82.06, 77.32], [83.42, 78.74], [84.74, 79.88], [87.28, 82.28], [89.62, 84.86], [91.7, 87.0],
  [96.92, 91.86], [99.7, 94.94], [101.86, 96.86], [104.96, 100.04], [107.28, 102.32], [109.82, 104.92], [112.18, 107.54], [115.44, 110.88],
  [121.56, 116.36], [122.87, 118.26], [123.54, 119.08], [124.3, 119.87], [125.42, 120.86], [128.32, 123.8], [129.9, 125.2], [132.48, 127.18], [133.74, 129.0], [135.12, 129.8], [136.56, 132.64], [139.17, 134.36], [142.43, 137.78],
  // the samsara wheel: each whip (a07 FH, v2 time) lands on its own sung «Больше …» in v3
  [149.28, 145.6], [150.58, 146.56], [152.86, 147.8], [153.86, 149.1], [155.44, 150.36], [156.7, 151.58], [158.02, 152.86], [159.2, 154.0],
  [160.28, 155.06], [161.64, 155.92],
  [162.62, 157.4], [164.76, 159.32], [167.82, 162.28], [170.38, 164.64], [172.68, 167.28],
  // 172.68–186.74 is the v3-only mayonnaise chapter (tokens3/ch/b08_mayo.js, real time); the warp just stays continuous here
  [186.74, 180.92], [189.22, 183.76], [191.62, 185.68], [193.12, 187.48], [194.4, 188.8], [195.64, 190.0], [196.28, 190.72], [197.32, 191.74],
  [199.4, 193.77], [200.95, 195.29], [204.52, 198.64],
  // outro: every word (prompted whisper pass on the v3 outro, assets/tokens3/outro.json)
  [205.74, 199.9], [206.78, 200.88], [208.2, 203.24], [211.08, 205.72], [212.12, 206.42], [213.74, 207.68], [214.06, 208.38], [214.6, 208.8], [214.84, 209.06],
  [216.16, 210.16], [216.8, 210.86], [218.48, 212.28], [218.74, 213.06], [219.04, 213.36], [219.3, 213.62], [220.5, 213.98],
  [223.04, 216.88], [223.28, 217.58], [224.9, 218.5], [226.42, 220.76],
  // the ending: the refill, then the whispered «…Сука.» alone in the silence, and the band crashes in on the 228.52 hit
  [228.1, 223.3], [228.101, 224.2], [228.45, 224.9], [228.451, 227.2], [228.52, 227.28], [231.39, 229.15],
  // 233.4–240.9 is the v3-only finale (tokens3/ch/b10_finale.js, real time); the credit card closes on the last bars
  [240.9, 237.85], [242.6, 239.0], [260, 256]
];
const lerpTab = (tab, x, i, j) => {                          // piecewise-linear lookup of column j by column i
  let k = 1; while (k < tab.length - 1 && tab[k][i] <= x) k++;
  const a = tab[k - 1], b = tab[k], d = b[i] - a[i];
  return d > 1e-6 ? a[j] + (x - a[i]) / d * (b[j] - a[j]) : b[j];
};
window.TIME_WARP = t => lerpTab(WARP, t, 0, 1);
const UNWARP = t2 => lerpTab(WARP, t2, 1, 0);

// the beat index at a real v3 time, from the tracked beats (extrapolated past the ends)
function beatAtReal(r) {
  const B = V3_BEATS, n = B.length;
  if (r < B[0]) return (r - B[0]) / (B[1] - B[0]);
  if (r >= B[n - 1]) return n - 1 + (r - B[n - 1]) / (B[n - 1] - B[n - 2]);
  let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (B[m] <= r) lo = m; else hi = m; }
  return lo + (r - B[lo]) / (B[hi] - B[lo]);
}
// chapters call bpOf() with v2 time (or real time inside a v3-only chapter: drawWorld sets REAL_CH)
window.BEAT_OF = t => beatAtReal(window.REAL_CH ? t : UNWARP(t));
// v2 chapters sync to HITS in v2 time: swap in this track's hits, mapped into v2 time
HITS.length = 0; for (const [a, s] of V3_HITS) HITS.push([+TIME_WARP(a).toFixed(3), s]);
