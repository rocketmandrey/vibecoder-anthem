// tokens3/warp.js: «Жги токены» v3 plays the v2 chapters unchanged through a time warp.
// WARP = [v3 time, v2 time] anchors: true v3 audio events (truth.json line starts, word onsets, beats, hits) paired with the v2 chapters' own cue times and the big hits; piecewise linear.
// Two anchors with (almost) the same v3 time are a hard cut in v2 time.
// Beats and hits are the real v3 ones (audio.js): bpOf() and HITS are rebuilt so the camera pulses sit on this track's beat,
// not on v2's fixed 94.2 grid (Suno's tempo drifts 0.639 → 0.662 s/beat after 2:00; that grid is what slid under the sermon and the wheel).
const WARP = [
  // Real times are the audio ground truth (truth.json): line starts, word onsets, beats/downbeats, hits. v2 times are the v2 chapters' own cues
  // (shot starts, v2 line starts, v2 hits), so each shot starts on the first frame at/after its true event.
  // NEVER put an anchor after a // on the same line: it silently disappears.
  // intro (a01): song start 0.203, the intro onsets, the conveyor on the 7.34 downbeat, the slam on the kick-push entry 17.45 (strong kick, one 16th before the 17.615 downbeat)
  [0, 0], [.203, .2], [.865, .86], [1.551, 1.66], [2.86, 2.93], [5.564, 4.86], [7.343, 7.0], [11.193, 10.99], [17.45, 16.92],
  // a02 friday: every shot on its true line start / word («дела» 26.32, «позади» 26.70, «вперёд» 39.15)
  [25.249, 20.1], [26.32, 21.29], [26.7, 21.77], [27.658, 22.65], [30.36, 25.25], [32.94, 27.8], [35.614, 30.5], [37.73, 32.5], [39.149, 33.98], [40.342, 35.1], [42.82, 37.75],
  // a03 chorus 1: «Кулеры» 45.69, the 47.32 stab (press), «Биржа» 47.82, the band re-entry hit 48.27, then the chorus lines (8th pickups)
  [45.694, 39.8], [47.322, 41.82], [47.824, 42.47], [48.268, 42.72], [50.477, 45.05], [52.872, 47.75], [55.577, 49.7], [57.96, 52.85],
  // «один» on the 2/4-bar accent 58.456, «миллион» 59.10; «Это полезно!» 68.54, «полезно» 69.52 (chorus-2 twin 116.47 − 46.95); TV-off on the 71.77 beat after the vocal
  [58.456, 53.66], [59.101, 54.2], [60.311, 55.25], [62.897, 57.95], [65.09, 60.35], [68.54, 63.75], [69.52, 64.54], [71.77, 66.4],
  // a04 verse 2: line starts («нанял» 83.72), the bill shakes on the 90.17 / 90.81 beats, «пускай» 91.81, the break on the 92.71 downbeat, the presses on the beats
  [72.3, 67.1], [74.82, 69.95], [77.44, 72.65], [79.66, 74.6], [82.538, 77.3], [83.72, 78.9], [84.753, 79.85], [86.973, 82.25], [89.72, 84.8], [90.17, 85.21], [90.805, 85.84], [91.809, 87.0],
  [92.709, 88.2], [93.344, 88.7], [95.248, 90.6],
  // a05 chorus 2 (= chorus 1 + 46.95 s): lines, «лимит»/«не», «один» on the 105.40 downbeat hit, «миллион» 106.12; ЩЁЛК on the 118.08 downbeat after «полезно», the four «щёлк» on the next four beats
  [97.45, 91.8], [99.736, 94.94], [100.066, 95.38], [100.618, 95.88], [102.5, 96.86], [104.9, 100.04], [105.401, 100.78], [106.12, 101.26], [107.244, 102.32], [109.81, 104.92],
  [112.03, 107.5], [115.479, 110.85], [118.075, 113.6], [118.71, 114.13], [119.344, 114.79], [119.978, 115.26], [120.613, 115.74],
  // a06 sermon: the preacher on the drum stop 121.87 (section start; «Нам» follows at 122.27), «больше» 122.83, the stab 123.84 and drum hit 124.49, then the words
  [121.868, 116.3], [122.834, 118.26], [123.844, 119.08], [124.494, 119.87], [126.012, 120.8], [126.44, 121.6], [127.155, 122.38], [127.565, 122.82],
  [128.72, 123.7], [129.974, 125.15], [130.34, 125.54], [131.193, 126.44], [132.464, 127.15], [133.851, 129.0], [135.004, 129.75],
  // «нам понадобится…» is held through the snare roll: the shades land on the 136.48 beat, the cut into drop1 on the sung «БОЛЬШЕ» 137.71,
  // «GPU!» 138.41, the tower grows on the 138.77 onset and on the drop 139.15, the rush cuts in on the 139.80 beat
  [136.49, 132.05], [137.705, 132.55], [137.71, 132.675], [138.41, 133.375], [138.785, 133.74], [139.16, 134.38], [139.81, 135.2],
  // GPU rush (instrumental in v3), on the beats: drop2 + «БОЛЬШЕ» 142.42, «GPU!»/КЛАЦ 143.08, rush2 145.03, slams 146.34 / 146.995,
  // drop3 + «БОЛЬШЕ» on the 147.65 beat (the chant pickup), its «GPU!» on the next beat 148.30
  [142.45, 137.7], [142.455, 137.815], [143.08, 138.515], [145.035, 140.2], [146.37, 142.1], [146.995, 143.06], [147.649, 143.9], [147.653, 143.975], [148.302, 144.815],
  // the samsara wheel: each whip (a07 FH) on its sung «Больше …» half-phrase (Scribe): 149.61 beat, the 150.59 / 151.89 8ths, then every even beat 152.87…158.09
  [149.608, 145.6], [150.586, 146.56], [151.89, 147.8], [152.869, 149.1], [154.175, 150.36], [155.48, 151.58], [156.788, 152.86], [158.092, 154.0],
  // «ЭКОНОМИКА» on the 160.05 downbeat, «РАБОТАЕТ» 161.48; a08 cuts in on the band re-entry hit 162.545 («ЭЙДЖИАЙ» itself starts 162.66, karaoke has it)
  [160.048, 155.0], [161.483, 155.92], [162.545, 157.35], [164.734, 159.3], [167.819, 162.25], [170.252, 164.6], [172.66, 167.25],
  // 172.66–186.95 is the v3-only mayonnaise chapter (tokens3/ch/b08_mayo.js, real time)
  // a09 chorus 3: «Жги» 186.95 (8th pickup), the 189.22 drum hit, «обнулён» 190.78, ШРЕДЕР on the 191.34 stop, «Доходы» 191.62, «потом» 192.36, «Прибыль» 193.10
  [186.95, 180.85], [187.935, 182.44], [189.219, 183.76], [190.775, 184.88], [191.344, 185.4], [191.62, 185.68], [192.36, 186.66], [193.1, 187.48],
  // «ЭЙДЖИАЙ» 194.31, «скоро» on the 195.73 downbeat, «CAPEX» 196.32, «Плюс процент» 197.34, the 198.93 stop → «плюс триста» on the 199.40 stab, the 200.93 hit, TV-off on the 202.24 beat
  [194.313, 188.7], [195.726, 190.0], [196.32, 190.72], [197.34, 191.7], [198.931, 193.32], [199.396, 193.77], [200.934, 195.29], [202.243, 196.28],
  // a10 sunday on the 203.565 downbeat; the spoken outro on the vocal-stem word onsets («Время» 206.50, «23» 206.88, «58» 209.19)
  [203.565, 197.9], [204.478, 198.64], [206.501, 199.9], [206.88, 200.88], [209.19, 203.24], [211.827, 205.65], [212.227, 206.42],
  [213.88, 207.6], [214.57, 208.8], [214.869, 209.06], [216.18, 210.16], [216.881, 210.86], [218.62, 212.28], [218.921, 213.06], [219.16, 213.36], [219.48, 213.62],
  [220.72, 213.95], [223.048, 216.8], [223.42, 217.58],
  // «Полночь» 224.78: hard cut to ВС 23:59, it flips to ПН 00:00 on the 224.845 hit; the refill screen on «Ваш недельный лимит» 226.42, the bar full on «восстановлен» 227.64
  [224.775, 218.44], [224.78, 219.14], [224.845, 219.18], [226.424, 220.72], [227.637, 223.18],
  // the ending: the close-up cuts in on the snare-roll pickup 228.554; eyes shut through the roll and the whispered «…Сука» (230.36);
  // the band slam 231.375 (downbeat) hard-cuts to the snap (a10 sSnap, v2 225.0+): eyes fly open, red; one beat later (232.036) the blast (CRASH flash),
  // the second flash (HEY2) on the 232.70 accent, the burning hall (HALL) on the 233.37 beat, the finale on the 234.03 downbeat
  [228.54, 224.2], [231.36, 224.99], [231.365, 225.0], [232.03, 225.66], [232.035, 227.28], [232.701, 228.8], [233.367, 229.15],
  // 234.03–240.64 is the v3-only finale (tokens3/ch/b10_finale.js, real time); the credit card cuts in on the 240.64 beat after the white-out → black
  [240.641, 237.85], [242.6, 239.0], [260, 256]
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
