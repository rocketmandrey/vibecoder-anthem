// tokens3/warp.js: «Жги токены» v3 plays the v2 chapters unchanged through a time warp.
// WARP = [v3 time, v2 time] anchors on the same sung words (whisper, both tracks), the v2 chapters' own cue times and the big hits; piecewise linear.
// Two anchors with (almost) the same v3 time are a hard cut in v2 time.
// Beats and hits are the real v3 ones (audio.js): bpOf() and HITS are rebuilt so the camera pulses sit on this track's beat,
// not on v2's fixed 94.2 grid (Suno's tempo drifts 0.639 → 0.662 s/beat after 2:00; that grid is what slid under the sermon and the wheel).
const WARP = [
  [0, 0], [.22, .2], [.85, .86], [1.61, 1.66], [2.88, 2.93], [5.6, 4.86], [11.05, 10.99], [17.4, 16.92], [24.88, 20.1],   // intro: the same hits, v3 holds 5 s longer after the slam
  [26.27, 21.29], [26.74, 21.77],
  [30.0, 25.25], [32.9, 27.8], [35.5, 30.5], [37.7, 32.52], [38.9, 33.98], [40.42, 35.14], [42.8, 37.78], [45.54, 39.84], [47.33, 41.82], [48.3, 42.95],
  [50.26, 45.1], [52.86, 47.78], [55.66, 49.74], [58.0, 52.88], [58.44, 53.66], [58.98, 54.2], [60.32, 55.3], [62.86, 58.0], [65.28, 60.4], [68.52, 63.78], [69.28, 64.54],
  [72.18, 67.14], [74.8, 69.98], [77.24, 72.68], [79.58, 74.62], [82.06, 77.32], [83.42, 78.74], [84.74, 79.88], [87.28, 82.28], [89.62, 84.86], [91.7, 87.0],
  [96.92, 91.86], [99.7, 94.94], [100.04, 95.38], [100.56, 95.88], [101.86, 96.86], [104.96, 100.04], [105.4, 100.78], [105.94, 101.26], [107.28, 102.32], [109.82, 104.92], [112.18, 107.54], [115.44, 110.88],
  [121.56, 116.36], [122.87, 118.26], [123.54, 119.08], [124.3, 119.87], [125.42, 120.86], [126.3, 121.6], [127.06, 122.38], [127.46, 122.82], [128.32, 123.8], [129.9, 125.2], [130.2, 125.54], [131.12, 126.44], [132.48, 127.18], [133.74, 129.0], [135.12, 129.8], [136.56, 132.64], [139.17, 134.36], [142.43, 137.78],
  // the samsara wheel: each whip (a07 FH, v2 time) lands on its own sung «Больше …» in v3
  // (the «Больше» phrases sit on the kick every 2 beats: 149.31 + 1.305·k, fitted to the kick onsets; whisper's word times drift here)
  [149.31, 145.6], [150.62, 146.56], [151.92, 147.8], [153.22, 149.1], [154.53, 150.36], [155.84, 151.58], [157.14, 152.86], [158.44, 154.0],
  [160.35, 155.06], [161.64, 155.92],
  [162.62, 157.4], [164.76, 159.32], [167.82, 162.28], [170.38, 164.64], [172.68, 167.28],
  // 172.68–186.74 is the v3-only mayonnaise chapter (tokens3/ch/b08_mayo.js, real time); the warp just stays continuous here
  [186.74, 180.92], [189.22, 183.76], [190.38, 184.88], [191.62, 185.68], [192.18, 186.66], [193.12, 187.48], [194.4, 188.8], [195.64, 190.0], [196.28, 190.72], [197.32, 191.74],
  [199.4, 193.77], [200.95, 195.29], [204.52, 198.64],
  // outro: every word (prompted whisper pass on the v3 outro, assets/tokens3/outro.json)
  [205.74, 199.9], [206.78, 200.88], [208.2, 203.24], [211.08, 205.72], [212.12, 206.42], [213.74, 207.68], [214.06, 208.38], [214.6, 208.8], [214.84, 209.06],
  [216.16, 210.16], [216.8, 210.86], [218.48, 212.28], [218.74, 213.06], [219.04, 213.36], [219.3, 213.62], [220.5, 213.98],
  [223.04, 216.88], [223.28, 217.58], [224.6, 218.45], [224.86, 219.18], [226.42, 220.76],   // «Полночь»: the clock flips on the 224.86 hit
  // the ending: the refill, then the close-up with his eyes still shut, he opens them on the whispered «…Сука.», and the band crashes in on the 228.52 hit
  [227.5, 223.3], [227.501, 224.2], [228.0, 224.57], [228.45, 224.9],   // close-up from 227.5 (eyes shut), eyes open on «Сука» 228.0 (= v2 224.57) [228.451, 227.2], [228.52, 227.28], [231.39, 229.15],
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
