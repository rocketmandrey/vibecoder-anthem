// tokensEN/scenes.js: BURN THE TOKENS on top of the reused chapters. EN song time = T.
// 1) the beat shake, driven by the track's energy (truth.json sections): hard on the chorus / drop / shouts, light on verses, none on the spoken parts;
// 2) NEW scenes, composed for 4:5 and drawn in code in the clip's own style (kit + a03 parts), no text in the frame: H1 = S1–S3 below;
// 3) the reels camera keys. Loaded after tokensEN/warp.js (real chapters there are converted already), before tokens3/square.js.
(() => {
  const INK = PAL.ink;
  const R = window.R34;                                                    // the 3:4 reels picture: H1 re-laid out natively for it
  const inWin = W => W.some(([a, b]) => T >= a && T < b);
  const lastLE = (arr, t) => { let r = null; for (const x of arr) { if (x > t) break; r = x; } return r; };
  const kick = (t, list, len = .3) => { const h = lastLE(list, t); return h == null || t - h > len * 4 ? 0 : Math.exp(-(t - h) / len); };

  // ---------- beat shake: CAM_SHAKE(t) → [dx, dy] world px, read by SQ_CAM (square.js) and the 16:9 view (core.js sqView) ----------
  const LOUD = [[/spoken|deadpan|preacher/, 0], [/gang|acid|shouted/, 9], [/build|rap|outro|robotic/, 4], [/verse|intro|choir/, 2]];
  const secPx = t => {
    const s = EN_SECTIONS.find(s => t >= s[0] && t < s[1]); if (!s) return 0;
    const [, , lab, en] = s, base = /break/.test(lab) ? (en >= .6 ? 9 : 4) : (LOUD.find(([re]) => re.test(lab)) || [0, 2])[1];
    return base * (.6 + .8 * en);                                          // gang vocals .52 → 9 px, the last chorus .8 → 11 px, verse 1 → 2 px
  };
  const PUNCH = window.EN_PUNCH = [[43.68, 24], [49.30, 20], [53.90, 14], [55.20, 16], [60.46, 9]];   // picture punches [EN t, px]; scenes2.js adds its own
  let HITPX = null;                                                        // built on first use, after scenes2.js has added its punches
  const CALM = [[112.6, 135.22], [210, 237.0], [241.6, 1e9]];              // the preacher and the deadpan outro: a still camera
  window.CAM_SHAKE = t => {
    if (CALM.some(([a, b]) => t >= a && t < b)) return [0, 0];
    HITPX = HITPX || [...EN_HITS.map(([t, s]) => [t, s * 1.3]).filter(([t]) => secPx(t) > 0), ...PUNCH].sort((a, b) => a[0] - b[0]);
    let a = 0; const px = secPx(t), g = lastLE(EN_GRID, t);
    if (px && g != null) a = px * Math.exp(-(t - g) / .09);               // a kick on every quarter of the tracked grid (~0.66 s)
    for (const [h, p] of HITPX) { if (h > t) break; if (t - h < .7) a = Math.max(a, p * Math.exp(-(t - h) / .2)); }
    return a < .3 ? [0, 0] : shakeXY(t, a);
  };

  // v2's glitch cuts: only on the drop entry and the limit-reset notification (STORYBOARD_EN §3)
  const GLITCH_OK = [[135.1, 135.45], [230.7, 231.0]];
  const _glitchCut = glitchCut;
  glitchCut = (t, tCut, o) => { if (inWin(GLITCH_OK)) _glitchCut(t, tCut, o); };

  // ---------- shared bits ----------
  const NOTXT = 1e-4;                                                      // ponytail: agentBot prints «AGENT #n» unless rotated; a hair of rot hides it
  const back = col => paint(rectPts(-200, -300, W + 400, H + 700), { wash: col, ink: null });   // the 4:5 frame reaches above / below the 16:9 world
  function rubble(x, y, w, age, seed) {                                    // floor chunks thrown up + a dust bank
    if (age < 0 || age > 1.4) return;
    for (let i = 0; i < 14; i++) {
      const a = -Math.PI * (.15 + .7 * hash(seed + i)), v = 500 + 700 * hash(seed + i + 3), f = age;
      const px = x + (hash(seed + i + 5) - .5) * w + Math.cos(a) * v * f, py = y + Math.sin(a) * v * f + 1400 * f * f, r = 12 + 22 * hash(seed + i + 7);
      if (py < y + 60) paint(ellPts(px, py, r, r * .7, 6, r * .25, f * 6 + i), { wash: '#4A4F58', fill: A2.gunDk, fillOp: 90, ink: INK, sw: .6 });
    }
    const k = clamp(age / .9);
    for (let i = 0; i < 7; i++) { const r = (70 + 120 * k) * (.7 + .5 * hash(seed + i)); paint(ellPts(x + (i - 3) * w * .16, y - 10 - 30 * k, r, r * .4, 12), { fill: '#B8A58C', fillOp: 90 * (1 - k), bleed: .3, tex: .3, ink: null }); }
  }
  // the weekly limit as a bare bar: frame, fill, notches, no words
  function gauge(x, y, w, v, o = {}) {
    const h = w * .14, col = v > .5 ? mixCol(TK.orange, TK.green, (v - .5) * 2) : mixCol(TK.ember, TK.orange, v * 2);
    push(); translate(x, y); rotate(o.rot || 0);
    if (o.glow) glowAt(0, 0, w * .6, col, 90 * o.glow);
    paint(rrPts(-w / 2, -h / 2, w, h, h * .3, 1.5), { wash: TK.soot, ink: TK.cream, sw: 1.4 });
    const fw = (w - h * .36) * clamp(v);
    if (fw > 6) {
      paint(rrPts(-w / 2 + h * .18, -h / 2 + h * .18, fw, h * .64, h * .2), { wash: col, fill: mixCol(col, TK.soot, .3), fillOp: 90, tex: .6, ink: null });
      inkLine([[-w / 2 + h * .35, -h * .15], [-w / 2 + h * .1 + fw, -h * .15]], .8, '#FFFFFF', 'inkfine', 0);
    }
    for (let q = 1; q < 4; q++) inkLine([[-w / 2 + w * q / 4, h * .28], [-w / 2 + w * q / 4, h / 2]], .6, TK.ash, 'inkfine', 0);
    if (o.cracked) { inkLine([[w * .08, -h / 2], [w * .13, -h * .1], [w * .06, h * .1], [w * .12, h / 2]], 2.2, TK.cream, 'ink', 0); }
    if (o.burn > .02 && fw > 4) fire(-w / 2 + h * .18 + fw, h * .1, h * 1.4, h * 2, T, { k: o.burn, seed: 9 });
    pop();
  }

  // ============ S1 NEW (E06, 39.78–45.46): «Fans are howling, the racks run hot. Wall Street screams: "Is that all you got?"» ============
  const S1 = { hot: 41.36, crack: 42.68, bull: 43.68 };
  // Wall Street: the bull, drawn from vector paths (src/tokensEN/bull_art.js: Codex layers in the clip's style, vectorized) as a rig —
  // body, head (roaring / shut), two fists, steam puffs. Each layer is painted from its paths once into an offscreen 2D canvas at load.
  const ART = {};
  window.preloadAssets = async () => {
    for (const [k, [w, h, paths]] of Object.entries({ ...BULL_ART, ...(typeof PROP_ART !== 'undefined' ? PROP_ART : {}) })) {
      const q = 1.5, g = createGraphics(Math.ceil(w * q), Math.ceil(h * q)); g.pixelDensity(1);
      const c = g.drawingContext; c.scale(q, q);
      for (const [fill, tx, ty, d] of paths) {
        c.save(); c.translate(tx, ty); c.globalCompositeOperation = fill === 'KEY' ? 'destination-out' : 'source-over';
        c.fillStyle = fill === 'KEY' ? '#000' : fill; c.fill(new Path2D(d)); c.restore();
      }
      ART[k] = g;
    }
  };
  // a layer in world space over everything painted so far (the brush layer is forced to composite first); (x, y) = its centre, w = width
  function layer(k, x, y, w, o = {}) {
    const g = ART[k];
    push(); translate(x, y); rotate(o.rot || 0); scale((o.flip ? -1 : 1) * (o.sx ?? 1), o.sy ?? 1); imageMode(CENTER);
    if (o.alpha != null && o.alpha < 1) tint(255, 255 * o.alpha);
    image(g, 0, 0, w, w * g.height / g.width); pop();
  }
  const WORDS = [43.68, 43.88, 44.12, 44.42, 44.7];                        // «Is that all you got?»
  // (x, y) = the belt line (bottom of the jacket); o.sx / o.sy squash-stretch the whole rig from there; age = time since the burst
  function bull(x, y, t, age, o = {}) {
    LETTERS.push({ txt: '', x: 0, y: 0, size: 1, color: '#000' }); flushLetters();
    const BW = 640, BH = BW * BULL_ART.body[1] / BULL_ART.body[0], HW = 400, HH = HW * BULL_ART.head_open[1] / BULL_ART.head_open[0];
    const word = kick(t, WORDS, .12), beat = kick(t, EN_GRID, .1), open = age > .12 && t < 45.3;
    push(); translate(x, y); scale(1.3 * (o.sx ?? 1), 1.3 * (o.sy ?? 1));
    layer('body', 0, -BH / 2, BW, { sy: 1 + .03 * word });
    // head: bobs forward on every word, the jaw open through the shout
    const hy = -BH + 40 - HH / 2 - 14 * word, hs = 1 + .07 * word;
    layer(open ? 'head_open' : 'head_shut', 0, hy, HW * hs, { rot: .05 * Math.sin(t * 23) * word + .03 * Math.sin(t * 3) });
    // fists above the cuffs, pumped on the beat and trembling
    for (const d of [-1, 1]) {
      const jx = 5 * Math.sin(t * 41 + d), jy = 5 * Math.cos(t * 37 + d);
      layer(d < 0 ? 'fist_l' : 'fist_r', d * BW * .43 + jx, -BH * .72 - 26 * beat + jy, 175, { rot: d * (.1 + .12 * beat) });
    }
    // steam: a puff out of each nostril on every word, growing and drifting off
    for (const w of WORDS) {
      const a = t - w; if (a < 0 || a > .7 || !open) continue;
      const f = a / .7, sc = lerp(.45, 1.15, easeOut(f));
      for (const d of [-1, 1]) layer('steam', d * (70 + 150 * sc + 40 * f), hy + HH * .06 - 30 * f, 250 * sc, { flip: d < 0, alpha: 1 - f * f });
    }
    pop();
  }
  function s1(t) {
    back(TK.soot);
    const heat = kf(t, [[39.78, .45], [S1.hot, 1]]), burn = ease(seg(t, S1.hot, S1.hot + .5)) * 1.2;
    dataCenter(t, { heat, fire: burn, vp: [960, 470], seed: 3 });
    smoke(960, 380, t, { n: 6, h: 420, r: 80, col: '#2A2224', seed: 2 });
    // the two big coolers up top howl: blades whip round, air blasts down in streaks
    for (const [x, dir] of R ? [[720, 1], [1200, -1]] : [[640, 1], [1280, -1]]) {
      cooler(x, R ? 175 : 120, R ? 115 : 130, t, { speed: dir * (5 + 3 * burn), howl: 1 });
      steam(x, R ? 290 : 250, t, { dir: Math.PI / 2 + dir * .25, len: 380, n: 7, per: .5, seed: x, col: '#DCE6F0', k: .8 });
    }
    siren(960, 20, t, { col: '#FF3A2A', speed: 1.6, len: 800, r: 34, on: seg(t, S1.hot, S1.hot + .2) });
    // «Wall Street screams» 42.68: the floor splits from the middle, orange light through the cracks
    const ck = ease(seg(t, S1.crack, S1.bull)), fx = 960, fy = 1110;
    if (ck > 0 && t < S1.bull + .1) for (let i = 0; i < 7; i++) {
      const a = Math.PI + (i + .5) / 7 * Math.PI, L = 420 * ck * (.6 + .5 * hash(i)), pts = [[fx, fy]];
      for (let j = 1; j <= 4; j++) pts.push([fx + Math.cos(a) * L * j / 4 + (hash(i * 9 + j) - .5) * 40, fy + Math.sin(a) * L * j / 4 * .35 + (hash(i * 7 + j) - .5) * 16]);
      glowAt(pts[2][0], pts[2][1], 50 * ck, TK.orange, 120 * ck); inkLine(pts, 3.5, TK.soot, 'ink', .2); inkLine(pts, 1.4, TK.yellow, 'inkfine', .2);
    }
    const age = t - S1.bull;
    if (age > 0) {                                                         // the hole, glowing from below
      paint(ellPts(fx, fy + 20, 420, 80, 22, 12), { wash: '#1A0C08', ink: INK, sw: 1.2 });
      glowAt(fx, fy, 380, TK.orange, 110 * Math.exp(-age * 1.5));
    }
    // the vibecoder and two agents; the bull throws them clear
    const blown = age > 0 ? easeOut(age / .45) : 0, air = age > 0 && age < .55 ? Math.sin(age / .55 * Math.PI) : 0, scared = t > S1.crack - .1;
    const face = scared ? { eyes: 'scared', mouth: 'O', aL: 1.5, aR: 1.5 } : null;
    agentBot(lerp(R ? 660 : 600, 380, blown), 1130 - air * 180, 17, t, { ...(face || move('bounce', t, 1)), rot: age > 0 ? -blown * .6 : NOTXT, n: 3 });
    agentBot(lerp(R ? 1260 : 1320, 1560, blown), 1130 - air * 200, 17, t, { ...(face || move('hop', t, 2)), flip: true, rot: age > 0 ? blown * .6 : NOTXT, n: 8 });
    if (age < 0) clawd(960, 1180, 30, {
      dy: t < S1.crack ? move('idle', t).dy : -Math.abs(Math.sin(t * 30)) * .5, eyes: scared ? 'scared' : 'narrow', mouth: scared ? 'o' : 'flat', lookY: scared ? 1 : 0,
      aL: scared ? 1.2 : .3 + .2 * pulse(t, 7), aR: scared ? 1.2 : .3 + .2 * pulse(t, 7), emote: t > 40.02 && t < S1.crack ? 'sweat' : null,
    });
    // 43.68 «Is that all you got?»: the bull bursts up through the floor — stretched on the way up, squashed on the stop, then roars
    if (age > -.02) {
      const up = easeOut(clamp(age / .22)), y = lerp(1900, 1170, up);
      const st = age < .22 ? .35 * (1 - up) + .15 : age < .5 ? -.22 * Math.sin((age - .22) / .28 * Math.PI) : .06 * Math.sin(age * 26) * Math.exp(-(age - .5) * 1.5);
      bull(fx, y, t, age, { sy: 1 + st, sx: 1 - st * .6 });
      paint(rectPts(-200, fy + 60, W + 400, 400), { wash: '#262A31', fill: TK.orangeDk, fillOp: 60, tex: .5, ink: null });   // the floor in front of the hole hides his legs
      inkLine([[fx - 420, fy + 60], [fx + 420, fy + 60]], 1.6, INK, 'ink', .3);
      rubble(fx, fy + 40, 800, age, 5);
      flash(Math.exp(-age / .08) * .6 * (age < .3), '#FFF3C8');
    }
  }

  // ============ S2 NEW (E07+E08, 45.46–55.64): the shredder. «Burn the tokens … 'til the limit hits the floor … one more million, then one more» ============
  const S2 = { fall: 48.94, land: 49.30, freeze: [49.30, 49.95] };
  const BURNS = [[45.36, 'A'], [46.68, 'B'], [50.64, 'A'], [51.94, 'B']];            // «Burn» / «burn»: which gang throws
  const CHOMPS2 = EN_GRID.filter(g => g >= 45.4 && g < 55.7 && !(g >= S2.fall && g < S2.freeze[1]));
  const TRUCKS = [                                                          // [arrive, dump, leave, rear x at the hopper, u, side (+1 = right)]
    [51.3, 53.90, 54.55, 1245, 80, 1],                                      //   «million»: from the right
    [54.4, 55.20, 99, 675, 100, -1],                                         //   «then one more»: a bigger one backs in from the left
  ];
  if (R) TRUCKS[0].splice(3, 2, 1200, 50), TRUCKS[1].splice(3, 2, 715, 53);   // 3:4: both trucks parked whole inside x 420–1500
  // a dump truck, ground point (x, y), facing away from the hopper; side +1: cab on the right. tip 0..1 lifts the bed at the cab end.
  function truck(x, y, u, side, tip, roll, full) {
    push(); translate(x, y); scale(side, 1);
    for (const wx of [-1.7, -.9, 1.35]) {                                   // wheels roll
      paint(ellPts(wx * u, -.5 * u, .5 * u, .5 * u, 14), { wash: TK.soot, ink: INK, sw: 1 });
      paint(ellPts(wx * u, -.5 * u, .22 * u, .22 * u, 10), { wash: TK.gold, ink: INK, sw: .5 });
      for (let k = 0; k < 3; k++) { const a = roll + k / 3 * TAU; inkLine([[wx * u, -.5 * u], [wx * u + Math.cos(a) * .2 * u, -.5 * u + Math.sin(a) * .2 * u]], 1, INK, 'inkfine', 0); }
    }
    paint(rectPts(-2.4 * u, -1.1 * u, 4.4 * u, .5 * u), { wash: A2.gunDk, ink: INK, sw: .8 });              // chassis
    paint(rrPts(.95 * u, -2.3 * u, 1.2 * u, 1.3 * u, .15 * u), { wash: A2.hazard, fill: '#C89A10', fillOp: 70, tex: .4, ink: INK, sw: 1 });   // cab
    paint(rrPts(1.2 * u, -2.1 * u, .75 * u, .55 * u, .08 * u), { wash: '#9CC8E0', ink: INK, sw: .6 });
    hazard(-2.4 * u, -1.1 * u, 3.3 * u, .18 * u);
    // the bed hinges at its rear-bottom corner; the ram pushes it up
    const ang = -tip * .75;
    inkLine([[-.1 * u, -1.1 * u], [-1.4 * u + Math.cos(ang) * 1.9 * u, -1.1 * u + Math.sin(ang) * 1.9 * u]], 3, A2.steelLt, 'ink', 0);
    push(); translate(-2.4 * u, -1.1 * u); rotate(ang);
    if (full > .02) for (let i = 0; i < 9; i++) token((.35 + i * .31) * u, (-1.25 - .35 * Math.sin((i + .5) / 9 * Math.PI) * full) * u + (i % 2) * .15 * u, .3 * u, { rot: i });
    paint([[0, 0], [3.2 * u, 0], [3.35 * u, -1.25 * u], [-.2 * u, -1.25 * u]], { wash: A2.rust, fill: '#6E2E18', fillOp: 80, tex: .6, border: .4, ink: INK, sw: 1.2 });
    for (let k = 1; k < 4; k++) inkLine([[k * .8 * u, -.1 * u], [k * .82 * u, -1.15 * u]], .8, '#6E2E18', 'inkfine', 0);
    pop(); pop();
  }
  function s2(t) {
    back(A2.gunDk);
    const fz = t >= S2.freeze[0] && t < S2.freeze[1], tt = fz ? S2.freeze[0] : t;   // «floor.»: everyone freezes half a second
    const k = kick(t, CHOMPS2, .28);
    A03.hall(t, { lamps: [520, 1400] });
    A03.furnace(t, k);
    // the gantries the trucks drive onto, level with the hopper lip
    for (const [x0, x1] of [[260, 700], [1220, 1660]]) {
      paint(rectPts(x0, 300, x1 - x0, 26), { wash: A2.steel, ink: INK, sw: .7 }); hazard(x0, 326, x1 - x0, 12);
      for (let x = x0 + 30; x < x1; x += 110) paint(rectPts(x, 338, 16, 560), { wash: A2.gunmetal, ink: INK, sw: .4 });
    }
    A03.shredder(t, CHOMPS2, false);
    // the trucks: back in, tip, coins pour in an arc into the hopper, drive off
    for (const [a, d, l, rx, u, side] of TRUCKS) {
      if (tt < a || tt > l + .7) continue;
      const inK = easeOut(clamp((tt - a) / .7)), outK = easeIn(clamp((tt - l) / .5)), tip = backOut(clamp((tt - d) / .25)) * (1 - ease(clamp((tt - l + .3) / .3)));
      const x = rx + side * 2.4 * u + side * ((1 - inK) * 1000 + outK * 1200), age = tt - d;
      truck(x, 300, u, side, tt >= d ? tip : 0, -side * (x / (.5 * u)), tt < d + .9 ? 1 : 0);
      if (age > 0 && age < 1.3) for (let j = 0; j < 44; j++) {              // the pour
        const f = clamp((age - j * .02) / .45); if (f <= 0 || f >= 1) continue;
        const x0 = rx, x1 = 960 + (hash(j) - .5) * 380;
        token(lerp(x0, x1, f), lerp(300 - 1.4 * u, 330, f * f) - Math.sin(f * Math.PI) * 120, 15 + hash(j + 5) * 10, { spin: f * 3 + j });
      }
      if (age > 0) sparks(rx, 300, age, rx, 14, 200);
    }
    // the limit bar on chains over the hopper: a notch down on each «burn», lets go on «hits», lands on «floor.» and stays, cracked
    const v = kf(t, [[45.36, .64], [45.7, .5], [47.0, .38], [48.3, .26], [48.9, .2], [49.3, .06], [55.6, .03]]);
    const gy = 170, land = t - S2.land, p = clamp((t - S2.fall) / (S2.land - S2.fall)), floorY = 1000;
    if (t < S2.fall) {
      const sw = Math.sin(t * 4) * .03 + Math.sin(t * 30) * .01 * k;
      for (const cx of [800, 1120]) inkLine([[cx, -300], [cx + sw * 300, gy - 30]], 1.4, A2.steelLt, 'ink', 0);
      gauge(960, gy, 460, v, { rot: sw, glow: .3 * k, burn: .5 + .5 * k });
    } else {
      for (const [cx, s] of [[800, -1], [1120, 1]]) inkLine([[cx, -300], [cx + s * 30 * p, lerp(gy - 30, 40, p)]], 1.4, A2.steelLt, 'ink', 0);
      const y = land < 0 ? lerp(gy, floorY, p * p) : floorY - 34 * Math.abs(Math.sin(land * 12)) * Math.exp(-land * 7);
      // 3:4: a smaller bar lands in the gap between the gangs, then bursts to dust once the freeze ends (it cluttered the workers)
      const gone = R ? ease(seg(t, S2.freeze[1], S2.freeze[1] + .3)) : 0;
      if (gone < 1) gauge(960, y, (R ? 240 : 400) * (1 - gone), v, { rot: land < 0 ? .25 * p : .05, cracked: land >= 0, burn: land < 0 ? 1 : .6 * Math.exp(-land) });
      if (land >= 0) { rubble(960, floorY + 30, R ? 300 : 520, land * .7, 9); for (const x of R ? [840, 1080] : [730, 1190]) sparks(x, floorY + 20, land, x, 12, 180); }
      if (gone > 0 && gone < 1) rubble(960, floorY + 20, 240, gone * .9, 13);
    }
    // the gangs on the floor: hard hats left, agents right; each «Burn» the gang throws an arc of tokens up into the hopper
    for (const side of ['A', 'B']) {
      const t0 = lastLE(BURNS.filter(b => b[1] === side).map(b => b[0]), tt + .35), age = t0 == null ? 9 : tt - t0, shout = age > -.35 && age < 1.2;
      for (let i = 0; i < 3; i++) {
        const x = side === 'A' ? (R ? 600 : 590) + i * (R ? 90 : 95) : (R ? 1320 : 1330) - i * (R ? 90 : 95), y = 1180 - (i % 2) * 45, u = 15;
        const arm = fz ? 1.6 : shout ? kf(age - i * .05, [[-.35, .2], [-.2, 1.6], [.1, 1.1], [.6, .9], [1.2, .3]]) : .3 + .15 * Math.sin(tt * 6 + i);
        const bob = fz ? 0 : Math.abs(Math.sin((tt + i * .1) * Math.PI * 3)) * (shout ? 1.2 : .5);
        const face = fz ? { eyes: 'scared', mouth: 'o', lookX: side === 'A' ? 1 : -1, lookY: 1 } : { eyes: shout ? 'angry' : 'normal', mouth: shout ? 'O' : 'grin', lookY: -1 };
        if (side === 'A') clawd(x, y, u, { dy: -bob, aL: arm, aR: arm, ...face, seed: i, draw: A03.hardhat() });
        else agentBot(x, y, u, t, { n: 7 + i * 11, dy: -bob, aL: arm, aR: arm, ...face, seed: i + 4, flip: true, rot: NOTXT });
      }
      if (age > -.35 && age < .5) for (let j = 0; j < 7; j++) {
        const f = seg(age, -.3 + j * .04, .35 + j * .02); if (f <= 0 || f >= 1) continue;
        const x0 = side === 'A' ? (R ? 610 : 560) + j * 15 : (R ? 1310 : 1360) - j * 15, x1 = 960 + (j - 3) * 50;
        token(lerp(x0, x1, f), lerp(1030, 320, f) - Math.sin(f * Math.PI) * 300, 22, { spin: f * 2 + j, burn: f > .7 ? (f - .7) * 3 : 0 });
      }
    }
    flash(kick(t, [S2.land], .07) * .5, '#FFF3C8');
  }

  // ============ S3 NEW (E09, 55.64–65.18): the hiring hall. «More agents, more compute. Don't ask why, it's good for you.» ============
  const S3 = { ask: 58.48, why: 59.12, spoonIn: 60.0, good: 60.46, spoonOut: 61.25, gulp: 61.9 };
  const SPAWN = Array.from({ length: 13 }, (_, i) => 55.54 + i * .33);     // «More agents»: the machine spits one out per beat
  const SPOTS = SPAWN.map((_, i) => R ? [530 + (i % 7) * 105 + (i >= 7 ? 52 : 0), 895 + (i >= 7 ? 62 : 0)] : [560 + (i % 7) * 110 + (i >= 7 ? 55 : 0), 930 + (i >= 7 ? 70 : 0)]);
  const GPUS = [57.16, 57.4, 57.64, 57.88, 58.12, 58.36];                  // «more compute»: cards rain onto a pile
  const BELT = { x0: 600, x1: 1300, y: 650 };
  // 3:4 layout: the machine top-left, the belt running diagonally down to the right, the GPU chute top-right, the crowd mid, the heroes low
  const L3 = R ? { m: [690, 420], b0: [790, 450], b1: [1300, 730], off: [1360, 890], gpu: [1265, 330], hw: [730, 1255, 26], ceo: [1180, 1250, 29] }
               : { m: [560, 620], b0: [700, BELT.y], b1: [BELT.x1 - 20, BELT.y], off: [BELT.x1 + 70, 900], gpu: [1250, 470], hw: [830, 1210, 24], ceo: [1220, 1205, 27] };
  // the hiring machine: a riveted box with a mouth-slot, a gear, a lamp and a plunger that pumps on each spawn
  function dispenser(x, y, t, k) {
    paint(rectPts(x - 170, y - 330, 340, 430, 1.5), { wash: A2.rust, fill: '#6E2E18', fillOp: 80, tex: .6, border: .4, ink: INK, sw: 1.2 });
    hazard(x - 170, y + 60, 340, 26);
    for (const [rx, ry] of [[-150, -310], [150, -310], [-150, 40], [150, 40]]) paint(ellPts(x + rx, y + ry, 8, 8, 8), { wash: A2.steelLt, ink: INK, sw: .4 });
    gear(x - 70, y - 190, 70, t, { speed: .6 + 2 * k, col: A2.steel });
    const pl = 40 * k; paint(rectPts(x + 40, y - 380 + pl, 60, 60), { wash: A2.steel, ink: INK, sw: .7 }); inkLine([[x + 70, y - 520], [x + 70, y - 380 + pl]], 3, A2.steelLt, 'ink', 0);
    paint(ellPts(x + 70, y - 180, 50, 50, 16), { wash: k > .3 ? TK.yellow : TK.orangeDk, ink: INK, sw: .8 }); if (k > .1) glowAt(x + 70, y - 180, 150, TK.yellow, 140 * k);
    paint(rrPts(x + 60, y - 60, 120, 100, 20), { wash: '#0A0B0D', ink: INK, sw: 1 });   // the slot onto the belt
  }
  // a big spoon heaped with coins, gold dripping; pointing left from its handle end at (x, y)
  function spoon(x, y, s, t, full) {
    push(); translate(x, y); rotate(-.08);
    paint(rrPts(0, -12 * s, 330 * s, 24 * s, 12 * s), { wash: '#C8CED6', fill: A2.steel, fillOp: 70, tex: .4, ink: INK, sw: 1 });
    paint(ellPts(-90 * s, 0, 120 * s, 62 * s, 22), { wash: '#C8CED6', fill: A2.steel, fillOp: 80, tex: .4, ink: INK, sw: 1.2 });
    if (full > .02) {
      for (let i = 0; i < 9; i++) { const a = i / 9; token(-190 * s + a * 200 * s, (-30 - 60 * Math.sin(a * Math.PI) * full) * s + (i % 2) * 20 * s, 34 * s, { rot: i * .7 }); }
      for (let i = 0; i < 4; i++) { const p = frac(t * 1.3 + i / 4), dx = (-160 + i * 50) * s; paint(ellPts(dx, 50 * s + p * 70 * s, 8 * s, 14 * s * (1 - p * .5), 8), { wash: TK.yellow, ink: null }); }
    }
    pop();
  }
  function s3(t) {
    back(A2.gunDk);
    A03.hall(t, { lamps: [700, 1350] });
    // the upper wall: a big gear and an overhead hook line delivering more agents across the hall, dangling by their backs
    gear(R ? 1040 : 760, R ? 150 : 200, R ? 120 : 150, t, { speed: .15, col: mixCol(A2.steel, A2.gunDk, .4) });
    if (!R) paint(rectPts(300, 250, 1400, 22), { wash: A2.steel, ink: INK, sw: .7 });
    for (let i = 0; i < (R ? 0 : 9); i++) {                               // ponytail: the hook line doesn't fit over the 3:4 machine + chute; dropped there
      const x = 300 + frac(t * .12 + i / 9) * 1400, sw = Math.sin(t * 3 + i) * .08;
      inkLine([[x, 272], [x + sw * 120, 340]], 1.2, A2.steelLt, 'ink', 0);
      agentBot(x + sw * 150, 440, 11, t, { n: 60 + i, aL: 1.4, aR: 1.4, rot: sw, eyes: i % 3 ? 'happy' : 'scared', mouth: 'o', noShadow: true, seed: i });
    }
    const k = kick(t, SPAWN, .15);
    if (R) {                                                               // the belt tilted down-right on two posts
      const [[x0, y0], [x1, y1]] = [L3.b0, L3.b1], ang = Math.atan2(y1 - y0, x1 - x0);
      for (const f of [.3, .8]) { const px = lerp(x0, x1, f), py = lerp(y0, y1, f); paint(rectPts(px - 8, py + 30, 16, 900 - py - 30), { wash: A2.gunmetal, ink: INK, sw: .5 }); }
      push(); translate(x0 - 40 * Math.cos(ang), y0 - 40 * Math.sin(ang)); rotate(ang);
      conveyor(0, 0, Math.hypot(x1 - x0, y1 - y0) + 80, t, { items: [() => {}], speed: 200, legs: 0, seed: 2 }); pop();
    } else conveyor(BELT.x0, BELT.y, BELT.x1 - BELT.x0, t, { items: [() => {}], speed: 200, legs: 250, seed: 2 });
    dispenser(L3.m[0], L3.m[1], t, k);
    // agents: popped out of the slot (squash), ride the belt, hop off the end, trot to a spot and dance
    SPAWN.forEach((s, i) => {
      const a = t - s; if (a < 0) return;
      const [sx, sy] = SPOTS[i], ride = 3.4, o = { n: i + 2, rot: NOTXT };
      let x, y, u = 13;
      const [b0, b1, off] = [L3.b0, L3.b1, L3.off];
      if (a < .25) { const f = a / .25; x = lerp(b0[0] - 80, b0[0], f); y = b0[1] - Math.sin(f * Math.PI) * 70; Object.assign(o, { sy: 1 + .3 * (1 - f), sx: 1 - .2 * (1 - f), eyes: 'x', mouth: 'O' }); }
      else if (a < ride) { const f = (a - .25) / (ride - .25); x = lerp(b0[0], b1[0], f); y = lerp(b0[1], b1[1], f); Object.assign(o, { eyes: 'happy', aL: .5, aR: .5, dy: -Math.abs(Math.sin(a * 9)) * .4 }); }
      else if (a < ride + .4) { const f = (a - ride) / .4; x = lerp(b1[0], off[0], f); y = lerp(b1[1], off[1], f * f) - Math.sin(f * Math.PI) * 80; Object.assign(o, { aL: 1.5, aR: 1.5, mouth: 'O' }); }
      else if (a < ride + 1.4) { const f = ease((a - ride - .4) / 1); x = lerp(off[0], sx, f); y = lerp(off[1], sy, f); Object.assign(o, move('walk', t, i), { flip: true, rot: NOTXT }); }
      else { x = sx; y = sy; Object.assign(o, move(i % 2 ? 'bounce' : 'roof', t, i), { rot: NOTXT, eyes: t > S3.good && t < S3.gulp ? 'look' : 'happy', lookX: -1 }); }
      agentBot(x, y, u, t, o);
    });
    // «more compute»: GPUs drop out of a ceiling chute onto a pile on the shelf, upper right
    const [gx, gy] = L3.gpu, cy0 = R ? gy - 330 : 170;                      // shelf top gy, chute mouth cy0 (layout from the 16:9 one: 1250 / 470)
    paint([[gx - 70, -300], [gx + 70, -300], [gx + 70, cy0 - 50], [gx + 40, cy0], [gx - 40, cy0], [gx - 70, cy0 - 50]], { wash: A2.steel, fill: A2.gunDk, fillOp: 90, tex: .6, ink: INK, sw: 1 }); hazard(gx - 70, cy0 - 60, 140, 16);
    paint(rectPts(gx - 170, gy, 340, 24), { wash: A2.steel, ink: INK, sw: .6 }); for (const lx of [gx - 150, gx + 140]) paint(rectPts(lx, gy + 24, 16, R ? 110 : 156), { wash: A2.gunmetal, ink: INK, sw: .4 });
    GPUS.forEach((g, i) => {
      const a = t - g; if (a < 0) return;
      const yT = gy - 30 - i * 40, f = clamp(a / .25), y = lerp(cy0, yT, f * f), bounce = a > .25 ? 14 * Math.abs(Math.sin((a - .25) * 14)) * Math.exp(-(a - .25) * 8) : 0;
      gpuCard(gx + (hash(i) - .5) * 60, y - bounce, .55, t, { rot: (hash(i + 3) - .5) * .3 * f, glow: .4 * pulse(t, 6) });
      if (a > .25 && a < .6) sparks(gx, yT + 30, a - .25, i * 13, 8, 140);
    });
    // the asker (front) and the CEO; «good» 60.46: a heaped spoon of coins goes into the asker's mouth
    const ask = seg(t, S3.ask, S3.ask + .25), fed = t >= S3.good, chew = fed && t < S3.gulp ? Math.abs(Math.sin((t - S3.good) * 11)) : 0;
    const gulp = seg(t, S3.gulp, S3.gulp + .35), after = t > S3.gulp + .35;
    const [wx, wy, wu] = L3.hw, [cx, cyy, cu] = L3.ceo;
    clawd(wx, wy, wu, {
      aL: .3, aR: fed ? lerp(1.9, .4, seg(t, S3.good, S3.good + .4)) : lerp(.3, 1.9, ask) + (ask > .9 ? .15 * Math.sin(t * 14) : 0),
      eyes: after ? 'happy' : fed ? (t < S3.good + .5 ? 'x' : 'swirl') : t > S3.ask ? 'look' : 'normal', lookX: 1, lookY: -.4,
      mouth: after ? 'grin' : fed ? 'O' : t > S3.ask ? 'o' : 'flat', sy: 1 - .12 * chew + .2 * Math.sin(gulp * Math.PI), sx: 1 + .18 * chew,
      emote: t > S3.ask && t < S3.good ? 'sweat' : null, dy: after ? move('hop', t).dy : 0,
    });
    const turn = t > S3.why;
    ceoClawd(cx, cyy, cu, { flip: turn, eyes: turn && !after ? 'narrow' : 'happy', mouth: 'smile', click: kick(t, EN_GRID, .15), aL: t > S3.spoonIn && t < S3.spoonOut ? 1.2 : .4, dy: move('idle', t).dy });
    if (t > S3.spoonIn - .05 && t < S3.spoonOut + .6) {
      const inK = backOut(clamp((t - S3.spoonIn) / (S3.good - S3.spoonIn))), outK = easeIn(clamp((t - S3.spoonOut) / .45));
      const jig = fed && t < S3.spoonOut ? 10 * Math.sin((t - S3.good) * 30) : 0;
      spoon(lerp(cx - 110, wx + 250 * wu / 24, inK) + outK * 500 + jig, wy - 4.6 * wu - jig * .3, 1.1 * wu / 24, t, t < S3.spoonOut ? 1 : 0);
    }
    if (after) A03.confetti(t - S3.gulp, 26, [500, -200, 1000, 1300], 7);
  }

  // register the NEW scenes as EN-time real chapters (they win over the warped v2 chapters in drawWorld)
  const native = fn => (t, lt, d) => { window.EN_NATIVE = true; try { fn(t, lt, d); } finally { window.EN_NATIVE = false; } };
  chapter('en_s1_servers', 39.78, 45.46, [[39.78, native(s1)]], { real: true });
  chapter('en_s2_shredder', 45.46, 55.64, [[45.46, native(s2)]], { real: true });
  chapter('en_s3_hall', 55.64, 65.18, [[55.64, native(s3)]], { real: true });

  // ---------- the 3:4 reels camera: [EN t, cx, cy, width, glide] (width 1080 = full scale; picture height = 4/3 × width) ----------
  // 3:4 (R34 is always on where these keys are read): one frame per scene, gentle eased pushes, no pans / whips
  const H1S1 = [
    [39.78, 960, 570, 1080],                                              // S1: the burning server hall, both coolers + the trio in
    [42.68, 960, 610, 980, 1],                                            //   slow push in to the vibecoder while the floor splits
    [43.68, 960, 600, 1120],                                              //   cut wide on the bull (fists ≈ 85% of the width)
  ];
  const H1 = [
    ...H1S1,
    [45.46, 960, 640, 1080],                                              // S2: the shredder, one locked take — bar, both gangs, both trucks inside
    [49.30, 960, 650, 1040, 1],                                           //   a hair in on «floor.»
    [55.639, 960, 640, 1080, 1],
    [55.64, 960, 620, 1080],                                              // S3: machine top-left, belt diagonal, crowd, heroes low
    [58.48, 960, 700, 1000, 1],                                           //   drift down to the asker and the CEO
    [60.3, 960, 720, 980, 1],                                             //   push in on the spoon
    [65.179, 960, 660, 1040, 1],
  ];
  // e14_bull2 (scenes2.js) replays S1 47.42 s later: frame it like S1
  if (window.RU34) RU34.push([87.60, 92.86, [[87.60, 960, 570, 1080], ...H1S1.slice(1).map(([t, ...k]) => [+(t + 47.42).toFixed(2), ...k])]]);
  // everything else: the RU reels keys (v3 time) moved onto the EN track, minus the ones inside the NEW EN chapters (scenes2.js adds its keys to EN_KEYS)
  window.EN_KEYS = [...H1];
  // RU scenes brought back are re-framed for the 3:4 picture with their own EN keys (scenes3.js RUK), except the RU_CAM spans
  // (set in scenes3.js): there the RU square keys already frame the scene well, the EN keys inside are ignored, with a cut to the RU key in force at the span start.
  // ?ru&wide (debug): one fixed full-width 16:9 view, to read world coordinates off a sheet
  window.RU_CAM = [], window.RU_FIX = [];                            // RU_FIX: [t, cx, cy, w] re-frames the RU key at t (a prop cut by the frame edge)
  window.SQSHOTS_X = RU => {
    if (/[?&]wide\b/.test(location.search)) return [[0, 960, 540, 1920]];
    const ru = RU.map(([t, ...k]) => [+V32EN(t).toFixed(3), ...k]);
    if (/[?&]ru\b/.test(location.search)) return ru;
    const out = EN_KEYS.filter(([k]) => !RU_CAM.some(([a, b]) => k >= a && k < b));
    for (const [a, b] of RU_CAM) {
      const prev = ru.filter(([k]) => k <= a).pop();
      if (prev) out.push([a, ...prev.slice(1, 4)]);
      out.push(...ru.filter(([k]) => k > a && k < b));
    }
    for (const [t, ...k] of RU_FIX) { const q = out.find(([u]) => Math.abs(u - t) < .002); if (q) q.splice(1, 3, ...k); }
    for (const [a, b, keys] of RU34) { for (let i = out.length - 1; i >= 0; i--) if (out[i][0] >= a && out[i][0] < b) out.splice(i, 1); out.push(...keys); }
    out.sort((x, y) => x[0] - y[0]); if (window.DUMPK) console.warn("KEYS " + JSON.stringify(out.filter(k => k[0] > DUMPK[0] && k[0] < DUMPK[1])) + " PUNCH " + JSON.stringify(EN_PUNCH.filter(k => k[0] > DUMPK[0] && k[0] < DUMPK[1]))); return out;
  };
  window.ENK = { kick, lastLE, NOTXT, rubble, gauge, dispenser, native, back, spoon, truck, bull, s1, s2, s3, layer };   // for tokensEN/scenes2.js
})();
