// tokens3/square.js: square (1:1) and Reels (1080×1920) versions of «Жги токены» v3. On with ?square or ?reels (core.js SQ).
// The world is shot by a square camera, SQ_CAM(t) → [cx, cy, side] in 1920×1080 world units: side 1080 = full scale,
// wider = the scene scaled down, its sky / floor carried on above and below (core.js rectPts) — no bars, no letterbox.
// ?reels lays the square out for Shorts / Reels: 0–300 title band, picture 300–1380, subtitles 1410–1640 (x 90–900, clear of
// the platform icons on the right), 1640–1920 left empty for the platform UI. Timing is the v3 one (same T, same LY).
// SQSHOTS: [start, cx, cy, side] holds until the next start and cuts there; [t, cx, cy, side, 1] glides in from the key before it.
const SQSHOTS = [

  [0, 1270, 540, 1300],                                      // the dark: the match scrape, coin + Clawd
  [2.895, 1170, 540, 1500],                                   // the flame on the token, Clawd right
  [5.504, 960, 540, 1320],                                   // ПРЕСС №1 slam → «ЖГИ ТОКЕНЫ» over the burning token
  [7.384, 960, 540, 1080],                                    // the vigil row
  [12.025, 960, 540, 1080], [12.711, 960, 540, 1500, 1],             // the ride: ЗАВОД ТОКЕНОВ sign passes
  [17.45, 960, 470, 1920], [18.666, 900, 420, 1560, 1],              // 17.4 SLAM: the big sign spans the frame
  [25.249, 1150, 540, 1540],                                  // Friday room: Clawd + to-dos + calendar
  [27.658, 1000, 520, 1720],                                  // the laptop: limit bar 50%, «ПОЛПУТИ»
  [30.36, 1100, 540, 1600],                                   // the park window, calendar flips
  [32.95, 960, 540, 1080],                                   // the Sunday page burns
  [35.614, 960, 540, 1300],                                    // site + bot waved off, the tractor beam
  [39.157, 960, 540, 1500],                                   // rocket to the moon
  [40.344, 1090, 430, 1180],                                   // arcade «0 ИГРОКОВ»
  [43.011, 900, 540, 1500],                                   // «МОЙ САЙТ» «0 ПОСЕТИТЕЛЕЙ» → the hot rack
  [45.696, 960, 540, 1080],                                   // the burning hall
  [48.1, 1000, 540, 1450],                                  // БИРЖА chart, eyes, «ЖГИ!»
  [50.507, 960, 500, 1400],                                   // chorus: the shredder, «ЖГИ ТОКЕНЫ»
  [52.871, 1020, 540, 1800],                                  // the limit bar burns down
  [55.574, 960, 540, 1300],                                    // shredder again
  [57.962, 960, 540, 1080],                                   // odometer 1 000 000
  [60.312, 960, 540, 1920],                                   // «БОЛЬШЕ АГЕНТОВ», the hiring grid
  [65.09, 960, 540, 1920],                                   // CEO slide: «ЗАЧЕМ?» / «НЕВАЖНО» / «ПОЛЕЗНО»
  [71.765, 1000, 540, 1200],                                  // the stamp afterimage
  [72.074, 980, 540, 1800],                                  // new KPI board
  [75.248, 940, 440, 1500],                                   // the chairs
  [77.797, 1000, 540, 1540],                                   // the extinguisher reprimand
  [79.85, 960, 540, 1540],                                   // the golden idol
  [82.536, 960, 540, 1920],                                   // org chart
  [84.748, 960, 540, 1700],                                   // the report gathers dust
  [89.865, 1000, 540, 1600],                                  // its price 40 000 000
  [92.709, 900, 540, 1500], [93.765, 760, 540, 1500, 1], [94.765, 760, 540, 1500], [95.413, 960, 540, 1500, 1], [96.119, 1170, 540, 1500, 1],   // print → bind → award → shred, following the hits
  [97.46, 900, 540, 1400],                                   // night chimneys, smoke letters
  [99.736, 900, 540, 1200],                                   // the limit gauge on chimney 3
  [102.508, 960, 540, 1400],                                  // chimneys
  [104.946, 960, 540, 1300],                                   // public counter
  [107.254, 920, 540, 1400],                                  // agents march out, «БОЛЬШЕ АГЕНТОВ / ЖЕЛЕЗА»
  [112.06, 920, 540, 1400],                                  // GPU drone, «НЕВАЖНО» stamps
  [115.516, 930, 540, 1750],                                  // «ЭТО ПОЛЕЗНО!» billboard
  [118.075, 1080, 540, 1200],                                  // the gauge hits 0%
  [118.701, 960, 540, 1080],                                  // blackout, one spotlight
  [121.878, 960, 540, 1500],                                   // the cathedral
  [126.02, 960, 540, 1920],                                  // «больше меди / больше воды»
  [128.737, 930, 540, 1080],                                  // «Зачем?»
  [129.996, 960, 540, 1920],                                  // the madman, the price tag, the bill
  [132.478, 960, 540, 1920], [135.44, 1000, 540, 1700, 1], [136.395, 760, 540, 1200, 1],   // push-in, shades on
  [136.539, 960, 540, 1500],                                  // «БОЛЬШЕ GPU!»
  [139.83, 680, 520, 1250], [142.3, 1260, 520, 1250, 1],          // GPU rush: pan with the crowd-surfing CEO (left → right)
  [142.35, 960, 540, 1500],                                  // the PCIe slot, «ВЖЖЖЖ»
  [144.83, 680, 520, 1250], [147.839, 1220, 520, 1250, 1],         // GPU rush 2, same pan (the «ЕЩЁ GPU!» slams at 960 stay in frame)
  [147.872, 960, 540, 1500],                                  // the factory plugs in
  [148.915, 960, 540, 1080],                                  // samsara wheel: VERT camera (a07 CAMKV) whips to each pod centred, square window
  [158.022, 960, 540, 1250],                                  //   the pull-back whip to the whole wheel
  [160.098, 900, 540, 1400],                                   // «ЭКОНОМИКА РАБОТАЕТ!»
  [162.601, 960, 540, 1700],                                  // AGI spring calendar / loading 99.999% (a08 VERT pulls the cast in)
  [167.82, 960, 540, 1300],                                  // the robot arm
  [170.28, 960, 540, 1920],                                  // programmers «ВОТ-ВОТ»
  [172.667, 960, 540, 1300],                                 // hug the phone
  [175.552, 960, 540, 1080],                                  // calorie tracker
  [177.894, 960, 540, 1500],                                  // 100 000 GPU
  [180.637, 980, 540, 1080],                                   // the bun, the mayo
  [186.94, 920, 520, 1500],                                   // final chorus: the presses
  [189.219, 1000, 540, 1700],                                 // the firebox, ×2
  [191.353, 920, 540, 1500],                                  // the shredder «ПОТОМ»
  [194.332, 880, 540, 1080],                                   // AGI billboard
  [196.246, 880, 540, 1080], [196.981, 1150, 540, 1300, 1],           // whip to CAPEX neon
  [197.34, 980, 540, 1400],                                  // benchmark +1%
  [198.947, 960, 540, 1920],                                  // 300 000 000 000
  [199.406, 960, 540, 1600],                                  // puppets
  [202.456, 1000, 540, 1080],                                  // the big hand / TV off
  [203.565, 1100, 540, 1500],                                 // ВС 23:58
  [211.828, 1040, 540, 1200],                                  // 0 токенов
  [213.252, 1100, 540, 1600],                                 // 3 games / 7 sites
  [216.18, 920, 540, 1080],                                  // 42 agents
  [218.643, 1100, 540, 1500],                                  // the desk, the clock
  [222.583, 1100, 540, 1500], [223.309, 960, 540, 1080, 1],           // to the window
  [226.412, 1000, 540, 1300],                                 // «лимит восстановлен»
  [228.53, 960, 540, 1500],                                   // close-up, eyes shut through the roll + «Сука»; the snap on the 231.375 slam keeps this window
  [232.03, 1000, 540, 1080],                                  // blast
  [233.36, 960, 540, 1080],                                   // laptop corridor
  [234.02, 920, 540, 1500],                                   // mosh with the agents
  [235.356, 800, 540, 1400],                                  // stage-dive
  [236.197, 960, 540, 1080],                                  // «прыжок веры» / БУМ
  [237.999, 1060, 540, 1560],                                 // planet limit → token, 0%
  [239.35, 860, 540, 1200],                                  // smash «0%», fists up
  [240.018, 860, 540, 1200], [240.201, 1000, 540, 1600, 1],          // «ЖГИ!» flashes in on the right
  [240.641, 960, 540, 1540],                                   // credit card
];
// SONG.reels overrides the layout (BURN THE TOKENS: 4:5 picture 220–1570, subtitles centred at 1675); window.SQSHOTS_X(SQSHOTS) → the keys to use.
const SQ_CFG = Object.assign({ ar: 1, py: 300, title: 'ЖГИ ТОКЕНЫ', titleY: 168, subY: 1525, censor: false }, SONG.reels);
(() => {
  const K = [], CFG = SQ_CFG, AR = CFG.ar;
  (typeof window.SQSHOTS_X === 'function' ? SQSHOTS_X(SQSHOTS) : SQSHOTS).forEach(([t, x, y, w, glide], i) => { const P = K[K.length - 1]; if (i && !glide && t - P[0] > .02) K.push([t - .01, P[1], P[2], P[3]]); K.push([t, x, y, w]); });
  window.SQ_CAM = t => {
    let k = 0; while (k < K.length && K[k][0] <= t) k++;
    const A = K[Math.max(0, k - 1)], B = K[Math.min(K.length - 1, k)], u = B[0] > A[0] ? clamp((t - A[0]) / (B[0] - A[0])) : 0, e = u * u * (3 - 2 * u);
    let side = Math.min(1920, lerp(A[3], B[3], e));
    const [sx, sy] = window.CAM_SHAKE ? CAM_SHAKE(t) : [0, 0];                // a song's beat shake (tokensEN/scenes.js)
    let x = clamp(lerp(A[1], B[1], e), side / 2, W - side / 2), y = lerp(A[2], B[2], e);
    // YouTube re-shoot: the keys are the 3:4 reels camera (h = 4/3 · side); the new view is `fit` × that height, same centre
    if (CFG.yt) {
      const r = typeof O2N === 'function' ? O2N(t) : t, a = (CFG.adj || []).find(([p, q]) => r >= p && r < q);   // per-shot re-framing [realA, realB, dy, fit×]
      side = side * 4 / 3 * CFG.fit * (a?.[3] ?? 1) / AR; if (a) y += a[2];
      x = side >= W ? W / 2 : clamp(x, side / 2, W - side / 2); }
    return [x + sx, y + sy, side];
  };
  // a 16:9 screen-space HUD point (x, y in 0..1920 / 0..1080) → the world point at the same place in the current square
  window.sqHud = (x, y) => { const [cx, cy, side] = SQ_CAM(T), h = side * AR; return [cx - side / 2 + x * side / 1920, cy - h / 2 + y * h / 1080]; };
  if (!window.SQ) return;
  const YT = CFG.yt, REELS = /[?&]reels\b/.test(location.search) && !YT, VW = YT ? SQS : 1080, S = VW, SH = Math.round(S * AR), VH = REELS ? 1920 : SH, PY = REELS ? CFG.py : 0;
  const C = window.SQ_C = document.createElement('canvas'); C.width = VW; C.height = VH;
  const c = C.getContext('2d'), sm = document.createElement('canvas'); sm.width = 54; sm.height = 96;   // tiny copy = cheap heavy blur
  const smx = sm.getContext('2d');
  const FONT = s => `${s}px "Russo One", "Arial Black", sans-serif`;

  // subtitle: the current LY line, ≤ 2 balanced lines in x 90–900, soft fade in/out, no per-word highlight
  function subtitle(tv) {
    const R = typeof O2N === 'function' ? O2N : x => x, t = R(tv);             // fades in real seconds (tokensEN: tables are v1 time, see truth.js RETIME)
    const L = LY.find(l => t >= R(l[0]) - .12 && t < R(l[1]) + .2); if (!L) return;
    const [a, b, raw] = [R(L[0]), R(L[1]), L[2]], txt = CFG.censor ? raw.replace(/\bFuck/g, 'F*ck') : raw, k = ease((t - (a - .12)) / .16) * (1 - ease((t - b) / .2)); if (k < .01) return;
    const words = txt.split(' ').reduce((u, w) => ((/^[—–]$/.test(w) && u.length) ? u[u.length - 1] += ' ' + w : u.push(w), u), []);
    const maxW = CFG.subMax || 810; let size = CFG.subSize || 66, lines;
    for (;; size -= 3) {
      c.font = FONT(size); const wOf = ws => c.measureText(ws.join(' ')).width;
      if (wOf(words) <= maxW) { lines = [words.join(' ')]; break; }
      let best = null, bd = Infinity;
      for (let i = 1; i < words.length; i++) { const p = wOf(words.slice(0, i)), q = wOf(words.slice(i)); if (p <= maxW && q <= maxW && Math.abs(p - q) < bd) { bd = Math.abs(p - q); best = i; } }
      if (best) { lines = [words.slice(0, best).join(' '), words.slice(best).join(' ')]; break; }
      if (size < 36) { lines = [words.join(' ')]; break; }
    }
    const lh = size * 1.22, cx = YT ? VW / 2 : 495, cy = CFG.subY - (lines.length - 1) * lh / 2 + (1 - k) * 14;
    c.save(); c.globalAlpha = k; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = FONT(size); c.lineJoin = 'round';
    lines.forEach((s, i) => {
      const y = cy + i * lh;
      c.lineWidth = size * .2; c.strokeStyle = 'rgba(24,18,30,.92)'; c.strokeText(s, cx, y);
      c.fillStyle = PAL.ink; c.fillText(s, cx + size * .04, y + size * .05);
      c.fillStyle = PAL.cream; c.fillText(s, cx, y);
    });
    c.restore();
  }

  window.sqComposite = (src, grain, t) => {
    if (REELS) {
      // background: the picture itself, blurred to a colour field and pulled toward the clip's ink, so the bands read as the scene's light spilling out
      smx.drawImage(src, 0, 0, sm.width, sm.height);
      c.save(); c.imageSmoothingQuality = 'high'; c.filter = 'blur(6px) saturate(1.15)'; c.drawImage(sm, -40, -40, VW + 80, VH + 80); c.restore();
      const g = c.createLinearGradient(0, 0, 0, VH);
      g.addColorStop(0, 'rgba(43,34,51,.55)'); g.addColorStop(.16, 'rgba(43,34,51,.35)'); g.addColorStop(.72, 'rgba(43,34,51,.62)'); g.addColorStop(1, 'rgba(30,24,36,.9)');
      c.fillStyle = g; c.fillRect(0, 0, VW, VH);
      c.save(); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 36; c.fillStyle = '#000'; c.fillRect(0, PY, VW, SH); c.restore();
    }
    c.drawImage(src, 0, PY, S, SH);
    c.save(); c.globalCompositeOperation = 'multiply'; c.drawImage(grain, 0, PY, S, SH); c.restore();
    if (YT) return subtitle(t);                                                // YouTube: full-frame picture + plain subtitles, no band
    if (!REELS) return;
    if (!window.VTITLE_OFF || !VTITLE_OFF(t)) {
      c.save(); c.font = FONT(64); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
      c.lineWidth = 9; c.strokeStyle = 'rgba(24,14,10,.85)'; c.strokeText(CFG.title, VW / 2, CFG.titleY);
      c.fillStyle = '#FFB02E'; c.fillText(CFG.title, VW / 2, CFG.titleY); c.restore();
    }
    subtitle(t);
  };
})();
