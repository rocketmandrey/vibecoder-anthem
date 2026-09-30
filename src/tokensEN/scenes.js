// tokensEN/scenes.js: BURN THE TOKENS on top of the reused chapters. EN song time = T.
// 1) the beat shake, driven by the track's energy (truth.json sections): hard on the chorus / drop / shouts, light on verses, none on the spoken parts;
// 2) NEW scenes built from scratch for 4:5 (Codex plates + cut-outs in assets/tokensEN/gags, kit characters, no text in the frame): H1 = S1–S3 below;
// 3) the reels camera keys. Loaded after tokensEN/warp.js (real chapters there are converted already), before tokens3/square.js.
(() => {
  const inWin = W => W.some(([a, b]) => T >= a && T < b);
  const lastLE = (arr, t) => { let r = null; for (const x of arr) { if (x > t) break; r = x; } return r; };

  // ---------- beat shake: CAM_SHAKE(t) → [dx, dy] world px, read by SQ_CAM (square.js) and the 16:9 view (core.js sqView) ----------
  const LOUD = [[/spoken|deadpan|preacher/, 0], [/gang|acid|shouted/, 9], [/build|rap|outro|robotic/, 4], [/verse|intro|choir/, 2]];
  const secPx = t => {
    const s = EN_SECTIONS.find(s => t >= s[0] && t < s[1]); if (!s) return 0;
    const [, , lab, en] = s, base = /break/.test(lab) ? (en >= .6 ? 9 : 4) : (LOUD.find(([re]) => re.test(lab)) || [0, 2])[1];
    return base * (.6 + .8 * en);                                          // gang vocals .52 → 9 px, the last chorus .8 → 11 px, verse 1 → 2 px
  };
  const PUNCH = [[43.68, 24], [49.30, 20], [53.90, 14], [55.20, 16], [60.46, 9]];   // H1 picture punches: bull, bar on the floor, trucks, spoon
  const HITPX = [...EN_HITS.map(([t, s]) => [t, s * 1.3]), ...PUNCH].filter(([t]) => secPx(t) > 0).sort((a, b) => a[0] - b[0]);
  window.CAM_SHAKE = t => {
    let a = 0; const px = secPx(t), g = lastLE(EN_GRID, t);
    if (px && g != null) a = px * Math.exp(-(t - g) / .09);               // a kick on every quarter of the tracked grid (~0.66 s)
    for (const [h, p] of HITPX) { if (h > t) break; if (t - h < .7) a = Math.max(a, p * Math.exp(-(t - h) / .2)); }
    return a < .3 ? [0, 0] : shakeXY(t, a);
  };

  // v2's glitch cuts: only on the drop entry and the limit-reset notification (STORYBOARD_EN §3)
  const GLITCH_OK = [[135.1, 135.45], [230.7, 231.0]];
  const _glitchCut = glitchCut;
  glitchCut = (t, tCut, o) => { if (inWin(GLITCH_OK)) _glitchCut(t, tCut, o); };

  // ---------- Codex art (assets/tokensEN/gags): plates (jpg, 4:5) + transparent cut-outs, loaded before window.ready (core.js setup) ----------
  const IMG = {};
  window.preloadAssets = async () => {
    for (const k of ['bg_servers', 'bg_shredder', 'bg_hall']) IMG[k] = await loadImage(`assets/tokensEN/gags/${k}.jpg`);
    for (const k of ['bull_scream', 'dump_truck', 'coin_spoon']) IMG[k] = await loadImage(`assets/tokensEN/gags/${k}.png`);
  };
  // a raster in world space over everything painted so far (the brush layer is forced to composite first)
  function sprite(img, x, y, w, o = {}) {
    LETTERS.push({ txt: '', x: 0, y: 0, size: 1, color: '#000' }); flushLetters();
    push(); translate(x, y); rotate(o.rot || 0); scale(o.flip ? -1 : 1, 1); imageMode(CENTER);
    if (o.alpha != null && o.alpha < 1) tint(255, 255 * o.alpha);
    image(img, 0, 0, w, w * img.height / img.width); pop();
  }
  // a plate, centred on the world centre; P(u, v) = the world point at plate fraction (u, v)
  const plate = (img, w) => { push(); imageMode(CENTER); image(img, 960, 540, w, w * img.height / img.width); pop(); };
  const at = (img, w) => (u, v) => [960 + (u - .5) * w, 540 + (v - .5) * w * img.height / img.width];
  const hardhat = (u, sw) => {
    const dome = []; for (let i = 0; i <= 14; i++) { const a = Math.PI + i / 14 * Math.PI; dome.push([Math.cos(a) * 4.3 * u, -8 * u + Math.sin(a) * 2.4 * u]); }
    paint(dome, { wash: A2.hazard, fill: mixCol(A2.hazard, A2.rust, .35), fillOp: 60, tex: .4, ink: PAL.ink, sw: sw * .7 });
    paint(rrPts(-5.6 * u, -8.4 * u, 11.2 * u, .75 * u, .3 * u), { wash: A2.hazard, ink: PAL.ink, sw: sw * .6 });
    paint(ellPts(-1.8 * u, -9.4 * u, .8 * u, .35 * u, 8, 0, -.4), { wash: '#FFFFFF', washOp: 150, ink: null });
  };
  const NOTXT = 1e-4;                                                      // ponytail: agentBot prints «AGENT #n» unless rotated; a hair of rot hides it
  const hitK = (t, list, len = .3) => { const h = lastLE(list, t); return h == null ? 0 : Math.exp(-(t - h) / len) * (t - h < len * 4); };
  const rubble = (x, y, w, age, seed) => {                                 // chunks of floor thrown up + a dust bank
    for (let i = 0; i < 14; i++) {
      const a = -Math.PI * (.15 + .7 * hash(seed + i)), v = 500 + 700 * hash(seed + i + 3), f = age;
      const px = x + (hash(seed + i + 5) - .5) * w + Math.cos(a) * v * f, py = y + Math.sin(a) * v * f + 1400 * f * f, r = 12 + 22 * hash(seed + i + 7);
      if (py < y + 60) paint(ellPts(px, py, r, r * .7, 6, r * .25, f * 6 + i), { wash: '#6E6258', fill: '#3A3336', fillOp: 90, ink: PAL.ink, sw: .6 });
    }
    const k = clamp(age / .8);
    for (let i = 0; i < 7; i++) { const r = (70 + 120 * k) * (.7 + .5 * hash(seed + i)); paint(ellPts(x + (i - 3) * w * .16, y - 20 - 50 * k, r, r * .5, 12), { fill: '#B8A58C', fillOp: 120 * (1 - k * .8), bleed: .3, tex: .3, ink: null }); }
  };

  // ============ S1 NEW (E06, 39.78–45.46): the server room. «Fans are howling, the racks run hot. Wall Street screams: "Is that all you got?"» ============
  const S1 = { PW: 1200, crack: 42.68, bull: 43.68 };
  function s1(t) {
    const img = IMG.bg_servers, P = at(img, S1.PW); plate(img, S1.PW);
    const beat = pulse(t, 7);
    // the two ceiling fans howl: a blur disc with blades whipping round
    for (const [u, dir] of [[.18, 1], [.83, -1]]) {
      const [x, y] = P(u, .1), r = 105;
      paint(ellPts(x, y, r, r, 20), { wash: '#FFB070', washOp: 70 + 40 * beat, ink: null });
      for (let i = 0; i < 4; i++) { const a = dir * t * 23 + i / 4 * TAU; inkLine([[x, y], [x + Math.cos(a) * r * .5, y + Math.sin(a) * r * .5], [x + Math.cos(a + .35 * dir) * r * .92, y + Math.sin(a + .35 * dir) * r * .92]], 3, TK.soot, 'ink', .5); }
      for (let i = 0; i < 3; i++) { const p = frac(t * 2.2 + i / 3); inkLine([[x - r * .3 + i * r * .3, y + r * .9 + p * 160], [x - r * .3 + i * r * .3 + dir * 10, y + r * .9 + p * 160 + 50]], 2 * (1 - p) + .4, TK.cream, 'inkfine', .5); }
    }
    // LEDs + rack glow pump on the beat; «the racks run hot» 41.36 → flames lick up off the rack tops
    for (let i = 0; i < 6; i++) { const [x, y] = P(.28 + i * .09, .45); glowAt(x, y, 120, TK.orange, 30 + 60 * beat); }
    const hot = ease(seg(t, 41.36, 41.9));
    for (let i = 0; i < 5; i++) { const [x, y] = P(.27 + i * .115, .265); fire(x, y, 110, 150 + 40 * Math.sin(t * 5 + i), t, { k: hot, seed: 40 + i }); }
    for (const u of [.06, .94]) { const [x, y] = P(u, .16); fire(x, y, 150, 220, t, { k: hot, seed: 60 + u * 10 }); }
    // «Wall Street screams» 42.68: the floor splits from the middle, orange light through the cracks
    const ck = ease(seg(t, S1.crack, S1.bull)), [fx, fy] = P(.5, .9);
    if (ck > 0 && t < S1.bull) for (let i = 0; i < 7; i++) {
      const a = Math.PI + (i + .5) / 7 * Math.PI, L = 380 * ck * (.6 + .5 * hash(i)), pts = [[fx, fy]];
      for (let j = 1; j <= 4; j++) pts.push([fx + Math.cos(a) * L * j / 4 + (hash(i * 9 + j) - .5) * 40, fy + Math.sin(a) * L * j / 4 * .35 + (hash(i * 7 + j) - .5) * 16]);
      glowAt(pts[2][0], pts[2][1], 40 * ck, TK.orange, 120 * ck); inkLine(pts, 3.5, TK.soot, 'ink', .2); inkLine(pts, 1.4, TK.yellow, 'inkfine', .2);
    }
    // the vibecoder and two agents on the floor; the bull throws them clear
    const age = t - S1.bull, blown = age > 0 ? easeOut(age / .45) : 0, air = age > 0 && age < .55 ? Math.sin(age / .55 * Math.PI) : 0;
    const scared = t > S1.crack - .1;
    const m1 = move('bounce', t, 1), m2 = move('hop', t, 2);
    agentBot(lerp(660, 420, blown), 1090 - air * 160, 18, t, { ...(scared ? { eyes: 'scared', mouth: 'O', aL: 1.5, aR: 1.5 } : m1), rot: age > 0 ? -blown * .5 : NOTXT, n: 3 });
    agentBot(lerp(1260, 1500, blown), 1090 - air * 180, 18, t, { ...(scared ? { eyes: 'scared', mouth: 'O', aL: 1.5, aR: 1.5 } : m2), flip: true, rot: age > 0 ? blown * .5 : NOTXT, n: 8 });
    const hx = lerp(960, 600, blown), hy = 1200 - air * 260;
    clawd(hx, hy, 32, {
      dy: t < S1.crack ? move('idle', t).dy : -Math.abs(Math.sin(t * 30)) * .5, rot: age > 0 ? -blown * .9 + age * .2 : 0,
      eyes: age > 0 ? 'x' : scared ? 'scared' : 'narrow', mouth: age > 0 ? 'O' : scared ? 'o' : 'flat', lookY: scared ? 1 : 0,
      aL: age > 0 ? 1.7 : scared ? 1.2 : .3 + .2 * beat, aR: age > 0 ? 1.7 : scared ? 1.2 : .3 + .2 * beat, emote: t > 40.02 && t < S1.crack ? 'sweat' : null,
    });
    // 43.68 «Is that all you got?»: a bull in a pinstripe suit bursts up through the floor and roars into the lens
    if (age > -.02) {
      const up = backOut(clamp(age / .3)), roar = 1 + .03 * Math.sin(age * 40) * Math.exp(-age * 1.2);
      sprite(IMG.bull_scream, 960 + 6 * Math.sin(age * 31) * Math.exp(-age * 2), lerp(1700, 760, up), 960 * roar, { rot: .04 * Math.sin(age * 23) * Math.exp(-age * 2) });
      paint(ellPts(960, 1215, 560, 90, 20, 10), { wash: '#4A3F38', fill: '#2A2226', fillOp: 110, tex: .5, ink: PAL.ink, sw: 1 });   // the hole's lip hides the cut
      rubble(960, 1190, 700, age, 5);
      for (const x of [700, 1220]) smoke(x, 560, t, { n: 4, h: 160, r: 40, per: .9, seed: x, col: '#EDE3D2' });   // steam from the nostrils
    }
  }

  // ============ S2 NEW (E07+E08, 45.46–55.64): the shredder. «Burn the tokens … 'til the limit hits the floor … one more million, then one more» ============
  const S2 = { PW: 1200, fall: 48.94, land: 49.30, freeze: [49.30, 49.95] };
  const BURNS = [[45.36, 'A'], [46.68, 'B'], [50.64, 'A'], [51.94, 'B']];            // «Burn» / «burn»: which gang throws
  const TRUCKS = [                                                          // [arrive, dump, leave, u, width, flip] on the catwalks
    [51.2, 53.90, 54.5, .83, 560, false],                                   //   «million»: from the right
    [54.55, 55.20, 99, .15, 640, true],                                     //   «then one more»: a bigger one from the left
  ];
  function gauge(x, y, w, v, o = {}) {                                      // the weekly limit as a bare bar: frame, fill, notches, no words
    const h = 64, col = v > .5 ? mixCol(TK.orange, TK.green, (v - .5) * 2) : mixCol(TK.ember, TK.orange, v * 2);
    push(); translate(x, y); rotate(o.rot || 0);
    paint(rrPts(-w / 2, -h / 2, w, h, 18, 1.5), { wash: TK.soot, ink: TK.cream, sw: 2.2 });
    const fw = (w - 24) * clamp(v);
    if (fw > 8) paint(rrPts(-w / 2 + 12, -h / 2 + 12, fw, h - 24, 10), { wash: col, fill: mixCol(col, TK.soot, .3), fillOp: 90, tex: .6, ink: null });
    for (let q = 1; q < 4; q++) inkLine([[-w / 2 + w * q / 4, h / 2 - 12], [-w / 2 + w * q / 4, h / 2]], 1, TK.ash, 'inkfine', 0);
    if (o.cracked) inkLine([[w * .1, -h / 2], [w * .14, -4], [w * .08, 6], [w * .13, h / 2]], 2.4, TK.cream, 'ink', 0);
    pop();
  }
  function s2(t) {
    const img = IMG.bg_shredder, P = at(img, S2.PW); plate(img, S2.PW);
    const fz = t >= S2.freeze[0] && t < S2.freeze[1], tt = fz ? S2.freeze[0] : t;   // «floor.»: everyone freezes half a second
    const chomp = t < S2.fall || t > S2.freeze[1] ? hitK(t, EN_GRID, .16) : 0;
    // the teeth chomp on the beat: sparks off the rollers, burning shreds spat into the tray
    const [tx, ty] = P(.5, .5), [bx, by] = P(.5, .7);
    glowAt(tx, ty, 330, TK.orange, 30 + 90 * chomp);
    if (chomp > .05) { const g = lastLE(EN_GRID, t); for (const x of [tx - 170, tx, tx + 170]) sparks(x, ty - 70, t - g, x + Math.round(g * 10), 10, 170); }
    fire(bx, by + 60, 520, 110 + 120 * chomp, t, { seed: 3, k: .9 });
    for (let i = 0; i < 14; i++) { const p = frac(t * 1.7 + hash(i) ), x = bx + (hash(i + 4) - .5) * 480; paint(rectPts(x, by - 30 + p * 120, 16, 6), { wash: i % 2 ? TK.gold : TK.orange, ink: null }); }
    // the limit bar on the panel above: sinks a notch per «burn», lets go on «hits», lands on «floor.» and stays down, cracked
    const v = kf(t, [[45.36, .64], [45.6, .5], [46.9, .38], [48.3, .26], [48.9, .2], [49.3, .06], [55.6, .03]]);
    const [gx, gy] = P(.5, .12), p = clamp((t - S2.fall) / (S2.land - S2.fall)), land = t - S2.land, floorY = P(.5, .8)[1];
    if (t < S2.fall) gauge(gx, gy + Math.sin(t * 30) * 3 * chomp, 560, v, {});
    else gauge(gx, land < 0 ? lerp(gy, floorY, p * p) : floorY - 30 * Math.abs(Math.sin(land * 12)) * Math.exp(-land * 7), 560, v, { rot: land < 0 ? .12 * p : .03, cracked: land >= 0 });
    if (land >= 0 && land < 1.3) { rubble(gx, floorY + 30, 560, land * .6, 9); for (const x of [gx - 280, gx + 280]) sparks(x, floorY + 20, land, x, 12, 160); }
    if (land > 0) fire(gx - 180, floorY - 10, 50, 70, t, { k: .6, seed: 12 });
    // the trucks on the catwalks tip coins into the hopper (drawn before the gangs so the coins fall behind them)
    const [hx, hy] = P(.5, .28);
    for (const [a, d, l, u, w, flip] of TRUCKS) {
      if (tt < a || tt > l + .6) continue;
      const side = flip ? -1 : 1, inK = easeOut(clamp((tt - a) / .55)), outK = easeIn(clamp((tt - l) / .45));
      const [cx0, cy0] = P(u, .345), h = w * IMG.dump_truck.height / IMG.dump_truck.width;
      const x = cx0 + side * (1 - inK) * 900 + side * outK * 1100, y = cy0 - h * .45, tip = tt >= d ? -side * .1 * backOut(clamp((tt - d) / .2)) : 0, age = tt - d;
      if (age > 0 && age < 1.2) for (let j = 0; j < 40; j++) {             // the pour: coins arc off the bed into the hopper mouth
        const f = clamp((age - j * .02) / .45); if (f <= 0 || f >= 1) continue;
        const x0 = x - side * w * .3, x1 = hx + (hash(j) - .5) * 360 + side * 60;
        token(lerp(x0, x1, f), lerp(y - h * .4, hy + 20, f * f) - Math.sin(f * Math.PI) * 90, 16 + hash(j + 5) * 9, { spin: f * 3 + j });
      }
      sprite(IMG.dump_truck, x, y, w, { flip, rot: tip });
    }
    // the gangs on the floor: hard-hat workers left, agents right; each «Burn» the gang throws an arc of tokens up into the hopper
    for (const side of ['A', 'B']) {
      const t0 = lastLE(BURNS.filter(b => b[1] === side).map(b => b[0]), tt + .35), age = t0 == null ? 9 : tt - t0, shout = age > -.35 && age < 1.2;
      for (let i = 0; i < 3; i++) {
        const x = side === 'A' ? 560 + i * 125 : 1360 - i * 125, y = 1140 - (i % 2) * 45, u = 19;
        const arm = fz ? 1.6 : shout ? kf(age - i * .05, [[-.35, .2], [-.2, 1.6], [.1, 1.1], [.6, .9], [1.2, .3]]) : .3 + .15 * Math.sin(tt * 6 + i);
        const bob = fz ? 0 : Math.abs(Math.sin((tt + i * .1) * Math.PI * 3)) * (shout ? 1.2 : .5);
        const face = fz ? { eyes: 'scared', mouth: 'o', lookX: side === 'A' ? 1 : -1, lookY: 1 } : { eyes: shout ? 'angry' : 'normal', mouth: shout ? 'O' : 'grin', lookY: -1 };
        if (side === 'A') clawd(x, y, u, { dy: -bob, aL: arm, aR: arm, ...face, seed: i, draw: hardhat });
        else agentBot(x, y, u, t, { n: 7 + i * 11, dy: -bob, aL: arm, aR: arm, ...face, seed: i + 4, flip: true, rot: NOTXT });
      }
      if (age > -.35 && age < .5) for (let j = 0; j < 7; j++) {
        const f = seg(age, -.3 + j * .04, .35 + j * .02); if (f <= 0 || f >= 1) continue;
        const x0 = side === 'A' ? 560 + j * 20 : 1360 - j * 20, x1 = hx + (j - 3) * 45;
        token(lerp(x0, x1, f), lerp(1000, hy + 10, f) - Math.sin(f * Math.PI) * 330, 22, { spin: f * 2 + j, burn: f > .7 ? (f - .7) * 3 : 0 });
      }
    }
  }

  // ============ S3 NEW (E09, 55.64–65.18): the hiring hall. «More agents, more compute. Don't ask why, it's good for you.» ============
  const S3 = { PW: 1300, ask: 58.48, why: 59.12, spoonIn: 60.1, good: 60.46, spoonOut: 61.25, gulp: 61.9 };
  const SPAWN = Array.from({ length: 14 }, (_, i) => 55.54 + i * .33);     // «More agents»: one agent per beat out of the dispenser
  const SPOTS = Array.from({ length: 14 }, (_, i) => [640 + (i % 7) * 115 + (i >= 7 ? 55 : 0), 800 + (i >= 7 ? 70 : 0)]);
  const GPUS = [57.16, 57.48, 57.8, 58.1, 58.42];                           // «more compute»: cards rain onto a pile
  function s3(t) {
    const img = IMG.bg_hall, P = at(img, S3.PW); plate(img, S3.PW);
    const [dx, dy] = P(.22, .2), [b0x, b0y] = P(.2, .28), [b1x, b1y] = P(.76, .51), [ex, ey] = P(.8, .56);
    const clk = hitK(t, SPAWN, .15);
    glowAt(dx, dy, 150, TK.yellow, 40 + 100 * clk);                          // the dispenser flashes each time it spits one out
    // agents: out of the slot, ride the belt down, hop off, trot to a spot and dance
    SPAWN.forEach((s, i) => {
      const a = t - s; if (a < 0) return;
      const [sx, sy] = SPOTS[i]; let x, y, u, o = { n: i + 2, rot: NOTXT };
      if (a < 1.4) { const f = a / 1.4; x = lerp(b0x, b1x, f); y = lerp(b0y, b1y, f) + 6; u = lerp(6, 10, f); o = { ...o, eyes: 'happy', aL: .4, aR: .4 }; }
      else if (a < 1.75) { const f = (a - 1.4) / .35; x = lerp(b1x, ex, f); y = lerp(b1y, ey, f) - Math.sin(f * Math.PI) * 60; u = 10; o = { ...o, aL: 1.4, aR: 1.4, mouth: 'O' }; }
      else if (a < 2.6) { const f = ease((a - 1.75) / .85); x = lerp(ex, sx, f); y = lerp(ey, sy, f); u = lerp(10, 11, f); o = { ...o, ...move('walk', t, i), flip: sx < ex, rot: NOTXT }; }
      else { x = sx; y = sy; u = 11; o = { ...o, ...move(i % 2 ? 'bounce' : 'roof', t, i), rot: NOTXT, eyes: t > S3.good && t < S3.gulp ? 'look' : 'happy', lookX: 1 }; }
      agentBot(x, y, u, t, o);
    });
    // GPUs drop from above onto a pile, front left
    GPUS.forEach((g, i) => {
      const a = t - g; if (a < 0) return;
      const yT = 1010 - i * 34, f = clamp(a / .28), y = lerp(-250, yT, f * f), bounce = a > .28 ? 14 * Math.abs(Math.sin((a - .28) * 14)) * Math.exp(-(a - .28) * 8) : 0;
      gpuCard(590 + (hash(i) - .5) * 60, y - bounce, .62, t, { rot: (hash(i + 3) - .5) * .25, glow: .5 * pulse(t, 6) });
      if (a > .28 && a < .6) sparks(590, yT + 30, a - .28, i * 13, 8, 120);
    });
    // the asker (front) and the CEO (right); «good» 60.46: a heaped spoon of coins goes into the asker's mouth
    const ask = seg(t, S3.ask, S3.ask + .25), fed = t >= S3.good, chew = fed && t < S3.gulp ? Math.abs(Math.sin((t - S3.good) * 11)) : 0;
    const gulp = seg(t, S3.gulp, S3.gulp + .35), after = t > S3.gulp + .35;
    const wx = 820, wy = 1200, wu = 24;
    clawd(wx, wy, wu, {
      flip: false, aL: .3, aR: fed ? lerp(1.9, .4, seg(t, S3.good, S3.good + .4)) : lerp(.3, 1.9, ask) + (ask > .9 ? .15 * Math.sin(t * 14) : 0),
      eyes: after ? 'happy' : fed ? (t < S3.good + .5 ? 'x' : 'swirl') : t > S3.ask ? 'look' : 'normal', lookX: 1, lookY: -.4,
      mouth: after ? 'grin' : fed ? 'O' : t > S3.ask ? 'o' : 'flat', sq: -.12 * chew + .15 * Math.sin(gulp * Math.PI), sx: 1 + .18 * chew, emote: t > S3.ask && t < S3.good ? 'sweat' : null,
      dy: after ? move('hop', t).dy : 0,
    });
    const cx = 1330, cy = 1195, turn = t > S3.why;
    ceoClawd(cx, cy, 26, { flip: turn, eyes: turn && !after ? 'narrow' : 'happy', mouth: 'smile', click: hitK(t, EN_GRID, .15), aL: t > S3.spoonIn && t < S3.spoonOut ? 1.3 : .4, dy: move('idle', t).dy });
    if (t > S3.spoonIn - .05 && t < S3.spoonOut + .5) {
      const inK = backOut(clamp((t - S3.spoonIn) / (S3.good - S3.spoonIn))), outK = easeIn(clamp((t - S3.spoonOut) / .45));
      const w = 600, jig = fed && t < S3.spoonOut ? 10 * Math.sin((t - S3.good) * 30) : 0;
      sprite(IMG.coin_spoon, lerp(1300, wx + 300, inK) + outK * 500 + jig, wy - 4.6 * wu - 20 - jig * .3, w, { rot: -.06 });
    }
  }

  // register the NEW scenes as EN-time real chapters (they win over the warped v2 chapters in drawWorld)
  const native = fn => (t, lt, d) => { window.EN_NATIVE = true; try { fn(t, lt, d); } finally { window.EN_NATIVE = false; } };
  chapter('en_s1_servers', 39.78, 45.46, [[39.78, native(s1)]], { real: true });
  chapter('en_s2_shredder', 45.46, 55.64, [[45.46, native(s2)]], { real: true });
  chapter('en_s3_hall', 55.64, 65.18, [[55.64, native(s3)]], { real: true });

  // ---------- the 4:5 reels camera: [EN t, cx, cy, width, glide] (width 1080 = full scale; picture height = 1.25 × width) ----------
  const H1 = [
    [39.78, 960, 600, 1080],                                              // S1: the whole server room
    [42.68, 960, 720, 900, 1],                                            //   slow push in to the vibecoder while the floor splits
    [43.68, 960, 580, 1080],                                              //   cut wide on the bull
    [45.46, 960, 590, 1080],                                              // S2: the shredder, one take
    [55.639, 960, 580, 1060, 1],
    [55.64, 960, 560, 1120],                                              // S3: the hall, agents pour down the belt
    [58.48, 1000, 650, 1040, 1],                                          //   drift to the asker and the CEO
    [60.3, 1060, 800, 880, 1],                                            //   push in on the spoon
    [65.179, 1040, 760, 960, 1],
  ];
  // everything else: the RU reels keys (v3 time) moved onto the EN track — a first pass until each scene gets its own
  window.SQSHOTS_X = RU => [
    ...RU.map(([t, ...k]) => [+V32EN(t).toFixed(3), ...k]).filter(([t]) => !(t >= 39.78 && t < 65.18)),
    ...H1,
  ].sort((a, b) => a[0] - b[0]);
})();
