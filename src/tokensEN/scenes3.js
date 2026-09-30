// tokensEN/scenes3.js: BURN THE TOKENS, third wave. Every remaining English line gets its own picture, taken from what THAT line says
// (no inherited Russian gag anywhere; only neutral world pieces are reused: Clawd / agents / CEO, the hall, the servers, the room).
// EN song time; loaded after scenes2.js (ENK / EN2 helpers), before tokens3/square.js.
(() => {
  const INK = PAL.ink;
  const { kick, NOTXT, rubble, native, back, gauge, bull, s2, s3, layer } = ENK;
  const { eased, CHOIR, ROOM, roomWall, cuckoo, laptop, jar, armchair, desk, nightRoom } = EN2;
  const scene = (name, a, b, fn, keys, punch = []) => {
    chapter('en_' + name, a, b, [[a, native(fn)]], { real: true });
    EN_KEYS.push(...keys); EN_PUNCH.push(...punch);
  };
  // a replay of an EN scene `off` seconds later (the chorus repeats word for word): same drawing, same camera keys, same punches
  const replay = (name, a, b, fn, off) => {
    const keys = EN_KEYS.filter(([k]) => k >= a - off - .01 && k < b - off).map(([k, ...r]) => [+(k + off).toFixed(3), ...r]);
    const punch = EN_PUNCH.filter(([k]) => k >= a - off && k < b - off).map(([k, px]) => [k + off, px]);
    scene(name, a, b, t => fn(t - off), keys, punch);
  };
  const arc = (x0, y0, x1, y1, h, u) => [lerp(x0, x1, u), lerp(y0, y1, u) - Math.sin(u * Math.PI) * h];
  const tumbleweed = (x, y, r, t) => { push(); translate(x, y); rotate(t * 6); for (let k = 0; k < 7; k++) paint(ellPts(0, 0, r, r * (.4 + .1 * k), 12, 0, k * .45), { ink: '#A8844A', sw: 1.2 }); pop(); };
  const spiderAt = (x, y) => {
    inkLine([[x, -400], [x, y - 14]], .7, '#E8ECEF', 'inkfine', 0);
    paint(ellPts(x, y, 14, 16, 10), { wash: TK.soot, ink: INK, sw: .6 });
    for (let i = 0; i < 4; i++) for (const d of [-1, 1]) inkLine([[x, y - 4 + i * 4], [x + d * 22, y - 8 + i * 7], [x + d * 28, y + 6 + i * 7]], 1.2, INK, 'inkfine', .3);
  };
  const browser = (x, y, w, h, o = {}) => {                              // a web page, no words: bar with three dots, hero block, grey lines
    paint(rectPts(x, y, w, h, 1), { wash: PAL.cream, ink: INK, sw: 1.2 });
    paint(rectPts(x, y, w, h * .09), { wash: '#C8C0B4', ink: INK, sw: .8 });
    for (let k = 0; k < 3; k++) paint(ellPts(x + 22 + k * 22, y + h * .045, 7, 7, 8), { wash: [TK.ember, TK.yellow, TK.green][k], ink: null });
    paint(rectPts(x + w * .06, y + h * .15, w * .88, h * .32), { wash: o.col || TK.blue, ink: null });
    paint(starPts(x + w * .5, y + h * .31, h * .1), { wash: PAL.cream, ink: null });
    for (let k = 0; k < 4; k++) paint(rectPts(x + w * .06, y + h * (.55 + k * .09), w * (.8 - k * .12), h * .035), { wash: '#B8AE9E', ink: null });
  };

  // ======== INTRO NEW (0–18.16, instrumental): Sisyphus ========
  // A long 45° slope fills the frame corner to corner. Clawd pushes one giant token up it, straining; on the drops (2.30, 5.11) the token
  // slips back a little and he digs in again; the camera climbs with him. On top a HUGE press waits. He rolls the token under it, heaves it
  // onto the bed (12.4–12.9) → 13.40 the press SLAMS it flat, the title slams with it; the press keeps hammering on every hit. No fire.
  const INH = [13.40, 14.07, 15.44, 16.46, 17.16];
  const SL = { A: [180, 1700], B: [1150, 730], r: 110, px: 1440, top: 11.0, lift: [12.4, 12.9] };
  const SLD = [.7071, -.7071], SLN = [-.7071, -.7071], SLL = Math.hypot(SL.B[0] - SL.A[0], SL.B[1] - SL.A[1]);
  const climb = t => clamp(t / SL.top) - [2.30, 5.11].reduce((a, d) => { const g = t - d; return a + (g < 0 ? 0 : g < .3 ? .07 * easeOut(g / .3) : .07 * Math.max(0, 1 - (g - .3) / 1.4)); }, 0);
  // the token's contact point on the ground at time t (slope, then the plateau to the press)
  const slopeAt = t => { const u = climb(t); if (t < SL.top) return [lerp(SL.A[0], SL.B[0], u), lerp(SL.A[1], SL.B[1], u), u * SLL];
    const x = lerp(SL.B[0], SL.px, easeOut(seg(t, SL.top, SL.lift[0]))); return [x, SL.B[1], SLL + x - SL.B[0]]; };
  function intro(t) {
    back('#16181D');
    for (let x = -300; x < 2300; x += 220) inkLine([[x, -800], [x, 2600]], .6, '#23262D', 'inkfine', 0);            // the wall of the pit
    for (const [lx, ly, on] of [[520, 700, 2.3], [980, 250, 5.11], [1440, -520, 5.11]]) {                                  // hanging lamps bang on with the drops
      inkLine([[lx, -1400], [lx, ly - 30]], .8, INK, 'inkfine', 0); paint([[lx - 30, ly - 30], [lx + 30, ly - 30], [lx + 70, ly + 20], [lx - 70, ly + 20]], { wash: A2.gunDk, ink: INK, sw: .6 });
      if (t > on) paint([[lx - 60, ly + 20], [lx + 60, ly + 20], [lx + 260, ly + 700], [lx - 260, ly + 700]], { wash: '#FFE2A8', washOp: 40, ink: null });
    }
    // the hill: slope + plateau, a hazard edge along the top
    const edge = []; for (let x = -600; x <= 2400; x += 50) edge.push([x, x < SL.B[0] ? SL.A[1] + (SL.A[0] - x) : SL.B[1]]);   // dense: brush clamps far vertices
    paint([...edge, [2400, 2800], [-600, 2800]], { wash: '#6A5A4A', fill: '#3A3028', fillOp: 90, tex: .6, ink: INK, sw: 2 });
    inkLine(edge.filter(([x]) => x > -300 && x < 2200), 7, '#D8B880', 'ink', 0);
    for (let k = 0; k < 9; k++) { const u = hash(k + 4), x = lerp(-300, SL.B[0], u), y = SL.A[1] + (SL.A[0] - x) + 40 + hash(k) * 120; paint(ellPts(x, y, 26 + hash(k + 1) * 30, 14 + hash(k + 2) * 12, 8, 4, k), { wash: '#3A3F48', ink: INK, sw: .6 }); }
    // the huge press on top (bed bottom on the plateau), idle until the first slam
    const PW = 520, PH = 1000, PX = SL.px - PW / 2, PY = SL.B[1] + 10 - PH, bedY = PY + PH - PH * .12;
    press(PX, PY, PW, PH, t, t < 13.2 ? [99] : INH, { seed: 3, token: false });
    // the token: rolled up the slope, along the plateau, lifted onto the bed, flattened by the slam
    const [gx0, gy0, s] = slopeAt(t), lift = eased(t, SL.lift[0], SL.lift[1]), sq = t >= INH[0] ? .2 : 1;
    const bx = gx0 + SLN[0] * SL.r * (t < SL.top ? 1 : 0), by = t < SL.top ? gy0 + SLN[1] * SL.r + SL.r : lerp(gy0, bedY, lift);   // bottom-centre of the token
    push(); translate(bx, by); scale(1 + (1 - sq) * .5, sq); translate(0, -SL.r); rotate(t < SL.lift[0] ? s / SL.r : 0);
    token(0, 0, SL.r, { spin: .02, burn: t > 14 ? seg(t, 14, 17) * .6 : 0 }); pop();
    // Clawd right behind it, leaning in; after the lift he stands back and stares up
    const pushing = t < SL.lift[1], back2 = eased(t, SL.lift[1], 13.3);
    const [fx, fy] = t < SL.top ? [gx0 - SLD[0] * (SL.r + 80), gy0 - SLD[1] * (SL.r + 80)] : [bx - SL.r - 80 - 140 * back2, SL.B[1]];
    const slip = [2.30, 5.11].some(d => t > d && t < d + .5);
    clawd(fx, fy, 12, { walk: pushing && !slip ? t * 2 : null, rot: t < SL.top ? .3 : pushing ? .2 : 0, eyes: t > 13.4 ? 'spark' : slip ? 'scared' : pushing ? 'narrow' : 'look', lookX: 1, lookY: t > 12.9 ? -1 : 0,
      mouth: t > 13.4 ? 'O' : slip ? 'O' : pushing ? 'flat' : 'smile', aL: pushing ? 1.3 : .3, aR: pushing ? 1.3 : .3, emote: pushing && t > 7 ? 'sweat' : null, noShadow: true });
    for (const h of INH) { sparks(SL.px, bedY - 20, t - h, h * 3, 16, 360); rubble(SL.px, SL.B[1] + 10, 560, t - h, h); }
    if (t >= INH[0]) stamp('BURN THE TOKENS', 1380, 930, 78, t, INH[0], { col: TK.yellow, rot: -.04 });
    flash(Math.min(.3, kick(t, [INH[0]], .2) * .3), TK.yellowLt);
  }
  // the camera climbs with the token (keys sampled off its path), then pulls back to the whole press for the slam
  const IK = [0, 1.2, 2.3, 2.8, 4, 5.11, 5.6, 7, 8.5, 10, 11, 12.4].map((k, i) => { const [x, y] = slopeAt(k); return [k, x - 20, y - 150, 760, i ? 1 : 0]; });
  scene('intro', 0, 18.16, intro, [...IK, [12.9, 1320, 420, 960, 1], [13.39, 1380, 330, 1080, 1], [18.159, 1380, 360, 1040, 1]], [[13.4, 18], [2.30, 8], [5.11, 8]]);

  // ======== RU scenes brought back (cued in tokensEN/warp.js), each with its own 3:4 framing ========
  const RUK = [
    // verse 1, a02 office: Friday desk → the usage panel → Clawd at the park window → Sunday page burns → sparkle under the limit bar → the arcade
    [18.16, 1200, 520, 1240], [20.8, 960, 560, 1650], [23.54, 680, 520, 1200], [26.38, 973, 440, 1000], [29.079, 973, 440, 940, 1],
    [29.08, 960, 440, 1200], [34.519, 960, 460, 1100, 1], [34.52, 1080, 560, 1100], [39.779, 1000, 600, 900, 1],
    // «Top burner gets a bonus»: the a04 golden idol on the TOP BURNER pedestal
    [74.0, 960, 560, 1000], [76.719, 960, 520, 900, 1],
    // chorus 2, a05 night factory: wide → the limit-gauge chimney → the city → the public counter → agents march in → wide → the billboard → 0% → blackout
    [92.86, 960, 470, 1000], [95.68, 960, 380, 1100], [98.0, 940, 420, 1080], [100.64, 980, 460, 1500], [102.88, 960, 520, 1100],
    [105.84, 960, 450, 1080], [108.18, 960, 440, 1500], [109.9, 900, 560, 1000], [110.55, 960, 540, 1300],
    // a06 sermon: price tag + the bill (still, slow), the push-in as the shades come down; a07 «MORE GPUs!» drop: DJ in shades, Matrix burst
    [129.02, 1150, 500, 1300], [131.0, 1050, 480, 1250, 1], [133.299, 1000, 470, 1200, 1], [133.3, 960, 640, 1000], [135.219, 960, 620, 960, 1],
    [135.22, 960, 600, 1000], [136.999, 960, 560, 960, 1],
    // a07 «The economy is WORKING!»: the token index grows, then is yanked up out of frame (the camera rises with it); a08 AGI by spring → loading
    [148.56, 940, 480, 1200], [150.3, 960, 420, 1220, 1], [152.039, 1020, 250, 1250, 1],
    [152.04, 820, 560, 1200], [154.2, 820, 560, 1180, 1], [155.2, 1150, 580, 1200, 1], [157.459, 1150, 580, 1140, 1],
  ];
  EN_KEYS.push(...RUK);

  // ======== VERSE 2 NEW (65.18–74.0) the office, a projector ========
  // «Brand-new K-P-I up on the wall» — the CEO pulls a screen down, clicks the projector on: a bar chart, one bar per agent at the desks.
  // «You get the tokens — you burn 'em all» — the agents feed coins into their laptops as fast as they can; their bars shoot up.
  // «Low spend? Bro, you didn't even try» — one bar stays a stub; the CEO's laser dot slides from the stub to the agent; he sweats.
  // (74.0 «Top burner gets a bonus» = the RU golden idol on its TOP BURNER pedestal, a04)
  const V2 = { pull: 65.18, on: 65.74, burn: 68.9, low: 71.34, laser: 72.0, end: 74.0 };
  const DESK = [720, 880, 1040, 1200], LOWI = 2, SCR = [600, 170, 720, 430];
  function verse2(t) {
    back('#2E3440');
    paint(rectPts(-400, -600, 2720, 1660), { wash: '#C9C2B4', fill: '#A9A294', fillOp: 60, tex: .5, ink: null });            // office wall
    for (let x = 0; x < 1920; x += 240) inkLine([[x, -600], [x, 1060]], .6, '#B4AC9C', 'inkfine', 0);
    paint(rectPts(-400, 1060, 2720, 600), { wash: '#5A5F6A', fill: '#3E434C', fillOp: 70, tex: .5, ink: null });            // carpet
    // the pull-down screen and what the projector throws on it
    const [sx, sy, sw, sh] = SCR, down = eased(t, V2.pull, V2.on - .1), on = t > V2.on;
    paint(rrPts(sx - 20, sy - 30, sw + 40, 30, 12), { wash: A2.steel, ink: INK, sw: 1 });
    paint(rectPts(sx, sy, sw, sh * down), { wash: '#F4F1EA', ink: INK, sw: 1 });
    if (down < 1) inkLine([[sx + sw / 2, sy + sh * down], [sx + sw / 2, sy + sh * down + 40]], 2, INK, 'inkfine', 0);
    if (on) {
      const [lx, ly] = [575, 690];
      paint([[lx, ly - 10], [sx + sw, sy], [sx + sw, sy + sh], [lx, ly + 10]], { wash: '#FFF3C8', washOp: 70, ink: null });
      paint([[lx, ly - 10], [sx, sy], [sx, sy + sh]], { wash: '#FFF3C8', washOp: 70, ink: null });
      // the bar chart: one bar per desk, a little head under each, the leader gets a crown
      const grow = i => i === LOWI ? .06 : (.25 + .1 * i % .3) * eased(t, V2.on, V2.on + .8) + (i === 0 ? .72 : .5 - i * .08) * eased(t, V2.burn, V2.low - .3);
      DESK.forEach((_, i) => {
        const bw = 90, bx = sx + 90 + i * 150, base = sy + sh - 70, h = (sh - 130) * Math.min(1, grow(i));
        paint(rectPts(bx, base - h, bw, h), { wash: i === LOWI ? TK.ember : [TK.green, '#6F8BE0', null, TK.orange][i], ink: INK, sw: .8 });
        paint(rrPts(bx + 20, base + 12, 50, 36, 8), { wash: '#6F8BE0', ink: INK, sw: .6 });
        for (const d of [-1, 1]) paint(ellPts(bx + 45 + d * 11, base + 28, 4, 5, 6), { wash: INK, ink: null });
        if (i === 0 && t > V2.low - .3) paint(starPts(bx + 45, base - h - 30, 22), { wash: TK.yellow, ink: INK, sw: .6 });
      });
      inkLine([[sx + 60, sy + sh - 70], [sx + sw - 40, sy + sh - 70]], 2, INK, 'inkfine', 0);
    }
    // the projector on its cart (left)
    paint(rectPts(460, 730, 110, 330), { wash: A2.steel, ink: INK, sw: 1 }); paint(rrPts(430, 650, 170, 80, 14), { wash: '#3A3F48', ink: INK, sw: 1 });
    paint(ellPts(575, 690, 28, 28, 14), { wash: on ? '#FFF3C8' : '#1A1D22', ink: INK, sw: .8 }); if (on) glowAt(575, 690, 90, '#FFF3C8', 120);
    // the agents at their desks, laptops back-to-camera, coins going in
    DESK.forEach((x, i) => {
      const low = i === LOWI, busy = t > V2.burn && t < V2.low && !low, ph = frac((t - V2.burn) * 1.6 + i * .3);
      const caught = low && t > V2.laser;
      agentBot(x, 995, 14, t, { n: 30 + i, rot: NOTXT, noShadow: true, eyes: caught ? 'scared' : busy ? 'narrow' : t > V2.low && !low ? 'look' : 'happy', lookX: x < 960 ? 1 : -1,
        mouth: caught ? 'o' : busy ? 'grin' : 'smile', emote: caught ? 'sweat' : null, aL: busy ? .6 + Math.sin(ph * TAU) * .8 : .3, aR: busy ? .6 + Math.cos(ph * TAU) * .8 : .3 });
      if (busy) for (let k = 0; k < 2; k++) { const u = frac(ph + k * .5); const [cx, cy] = arc(x - 60, 900, x, 960, 70, u); token(cx, cy, 11, { spin: t * 6 + k }); }
      if (low && t > V2.burn) token(x + 60, 900, 11, {});                                                                  // his one coin, still in his hand
    });
    paint(rectPts(620, 990, 680, 80, 1), { wash: '#8A6446', fill: '#5E4230', fillOp: 70, tex: .5, ink: INK, sw: 1.2 });       // the long desk
    for (const x of DESK) { paint(rectPts(x - 36, 948, 72, 44, 1), { wash: '#3A3F48', ink: INK, sw: .8 }); token(x, 970, 10, { spin: .02 }); }
    // the CEO (right): pulls the screen, clicks, then the laser pointer
    const cx = 1370, pointing = t > V2.low;
    ceoClawd(cx, 1058, 16, { noShadow: true, flip: true, eyes: pointing ? 'narrow' : 'happy', mouth: pointing ? 'flat' : 'grin', aL: t < V2.on ? 2.2 : pointing ? 1.2 : .5, aR: .4 });
    if (pointing) {
      const [bx, by] = [SCR[0] + 90 + LOWI * 150 + 45, SCR[1] + SCR[3] - 90], k = eased(t, V2.laser, V2.laser + .5);
      const [dx, dy] = [lerp(bx, DESK[LOWI], k), lerp(by, 900, k)];
      inkLine([[cx - 110, 880], [dx, dy]], 2, '#FF2F4A', 'inkfine', 0); glowAt(dx, dy, 30, '#FF2F4A', 200);
      paint(ellPts(dx, dy, 9, 9, 8), { wash: '#FF2F4A', ink: null });
    }
  }
  scene('v2_kpi', 65.18, 74.0, verse2, [
    [65.18, 980, 600, 1000], [V2.burn, 990, 620, 980, 1], [V2.low, 1030, 640, 940, 1], [73.999, 1030, 650, 900, 1],
  ], [[V2.on, 6], [V2.laser, 8]]);

  // ======== CHORUS 2 = chorus 1 again, word for word 47.42 s later (the shredder, the trucks, the hiring hall) ========
  // chorus 2 (92.86–112.60) is the RU a05 night factory again, not a repeat of chorus 1 (keys in RUK)

  // ======== BRIDGE NEW (112.60–124.48) «We're gonna need more electricity. More copper. More water. More copper. More water…» ========
  // One focal at a time. The CEO at his pulpit; a giant plug drops from the vault and rams in (lights surge). «copper»: three singers on the
  // left, copper coils crash onto their heap. «water»: pan right to the next town's reservoir by the houses (the RU a06 image, the user
  // liked it) — on every «water» its level drops a step; by 124.36 it is cracked mud with a stranded boat and a flapping fish.
  const BR = { plug: 114.12, in: 115.25, copper: [116.44, 119.42, 121.90], water: [117.78, 120.66, 123.14], dry: 124.36 };
  const LAKE = [1140, 330, 500, 380];                                     // on the right wall, in the same still frame as the pulpit
  const lakeLvl = t => Math.max(0, 1 - BR.water.reduce((l, w) => l + .3 * eased(t, w, w + .45), 0) - .1 * eased(t, 123.8, BR.dry));
  function heap(list, t, x, draw) {
    let n = 0; for (const h of list) { const a = t - h; if (a < 0) continue; for (let k = 0; k < 4; k++) {
      const i = n++, px = x + ((i % 4) - 1.5) * 90 + (Math.floor(i / 4) % 2) * 40, py = 1110 - Math.floor(i / 4) * 80, fall = clamp((a - k * .07) / .3);
      if (fall > 0) draw(px, lerp(-200, py, easeIn(fall)), i, fall < 1 ? a * 6 : 0);
    } }
  }
  const coil = (x, y, i, spin) => { push(); translate(x, y); rotate(spin + i); scale(1.5); paint(ellPts(0, 0, 40, 30, 18), { wash: '#C8743A', fill: '#8A4A22', fillOp: 70, tex: .5, ink: INK, sw: 1 }); paint(ellPts(0, 0, 18, 12, 12), { wash: '#1A1726', ink: INK, sw: .6 }); for (let k = 1; k < 4; k++) paint(ellPts(0, 0, 18 + k * 6, 12 + k * 5, 14), { ink: '#E8A060', sw: .5 }); pop(); };
  function bridge(t) {
    back('#1A1726');
    const surge = kick(t, [BR.in], .6);
    A06.nave(t, { choir: false, L: Math.min(1, (t < BR.in ? .55 : .85) + surge * .15) });
    A06.pulpit(t, { eyes: t > BR.in ? 'happy' : 'narrow', mouth: t > BR.plug ? 'grin' : 'smile', click: kick(t, EN_GRID, .15), aL: t > BR.plug && t < BR.in ? 1.4 : .5 });
    if (t > BR.plug) {
      const k = eased(t, BR.plug + .2, BR.in), px = 1210, py = lerp(-300, 690, k);
      inkLine([[px, -500], [px, py - 70]], 16, INK, 'ink', 0); inkLine([[px, -500], [px, py - 70]], 10, '#3A3F4A', 'ink', 0);
      paint(rrPts(px - 40, py - 80, 80, 90, 12), { wash: '#E8E0D0', ink: INK, sw: 1.2 });
      for (const d of [-16, 16]) paint(rectPts(px + d - 5, py + 10, 10, 30), { wash: A2.steelLt, ink: INK, sw: .6 });
      if (t > BR.in) { sparks(px, py + 30, t - BR.in, 5, 16, 260); flash(surge * .2, '#FFF3C8'); }
    }
    const cop = Math.max(...BR.copper.map(h => { const a = t - h; return a > 0 && a < 1.2 ? Math.exp(-a * 2) : 0; }));
    [520, 640, 760].forEach((x, i) => A06.angel(x, 990, 12, t, { n: i + 3, k: cop, eyes: cop > .3 ? 'happy' : 'closed', mouth: cop > .3 ? 'O' : 'smile', aL: .3 + cop * 1.4, aR: .3 + cop * 1.4 }));
    heap(BR.copper, t, 620, coil);
    A06.reservoir(t, ...LAKE, lakeLvl(t));
  }
  // one calm, still frame (the user: the camera kept jerking between copper and lake): pulpit centre, copper + angels left, the lake right
  scene('bridge_needs', 112.60, 124.48, bridge, [[112.60, 1060, 580, 1260], [124.479, 1040, 600, 1200, 1]]);

  // 129.02–137.0 «And when intelligence gets cheaper… we're gonna need… MORE GPUs!» is the RU sermon again: push-in, the shades come down,
  // then the a07 drop — the preacher turned DJ in shades, the Matrix burst, a GPU grows out of his head (keys in RUK)

  // 148.56–157.46 is RU again: the a07 green graph yanked up on «The economy is WORKING!», the a08 AGI-by-spring calendar / loading bar (keys in RUK)

  // ======== RAP NEW (162.86–167.58) «All I want from that god-tier brain / Is a calorie tracker. Let me explain:» ========
  // A giant glowing brain enthroned on server racks, halo, lightning, cables everywhere. Far below, tiny Clawd holds up his phone.
  // On «calorie tracker» a thin ray from the brain lights the phone: an apple with a little flame. «Let me explain» — he points at his lunch.
  const BRN = { cal: 165.12, expl: 166.6 };
  function brain(t) {
    back(TK.soot);
    dataCenter(t, { heat: .25, vp: [960, 420], n: 8 });
    // the Codex brain on its server throne (halo + lightning are in the drawing); cables run from the throne down to the floor
    for (let i = 0; i < 6; i++) inkLine([[800 + i * 64, 820], [760 + i * 80 + Math.sin(i) * 50, 940], [640 + i * 130, 1070]], 6, [TK.blue, TK.ember, TK.green, TK.yellow, PAL.violet, TK.orange][i], 'ink', .6);
    glowAt(960, 330, 480, '#E27A92', 70 + 40 * kick(t, EN_GRID, .3));
    const bp = 1 + .025 * Math.sin(t * 4) + .04 * kick(t, EN_GRID, .15);
    layer('brain', 960, 440, 720, { sx: bp, sy: bp });
    if (kick(t, EN_GRID, .15) > .5) inkLine([[640, 200], [580, 280], [620, 290], [540, 390]], 4, TK.yellowLt, 'ink', 0);
    // tiny Clawd with his phone; the ray on «calorie tracker»
    const cx = 960, cy = 1060, ph = [cx + 105, cy - 250];
    clawd(cx, cy, 12, { eyes: t > BRN.cal ? 'happy' : 'look', lookY: -1, mouth: t > BRN.cal ? 'grin' : 'o', aR: 1.7, aL: t > BRN.expl ? 1.6 : .3, noShadow: true });
    paint(rrPts(ph[0] - 27, ph[1] - 45, 54, 90, 8), { wash: '#1A1F26', ink: INK, sw: 1 });
    const ray = eased(t, BRN.cal, BRN.cal + .2);
    if (ray > 0) {
      paint([[950, 330], [970, 330], [ph[0] + 12, ph[1]], [ph[0] - 12, ph[1]]], { wash: '#FFF3C8', washOp: 160 * ray, ink: null });
      paint(rrPts(ph[0] - 21, ph[1] - 37, 42, 75, 6), { wash: '#FFFFFF', ink: null });
      paint(ellPts(ph[0], ph[1] + 2, 14, 14, 12), { wash: TK.ember, ink: INK, sw: .5 }); inkLine([[ph[0], ph[1] - 7], [ph[0] + 3, ph[1] - 13]], 1.5, TK.greenDk, 'inkfine', 0);
      fire(ph[0] + 9, ph[1] - 6, 10, 14, t, { k: 1, seed: 2 });
    }
    if (t > BRN.expl) {                                                      // the lunch: a sandwich on a plate on a little table
      const k = backOut(seg(t, BRN.expl, BRN.expl + .3)), x = 1110, y = 1060;
      paint(rectPts(x - 60, y - 70, 120, 12, 1), { wash: '#7A4A2E', ink: INK, sw: .7 }); paint(rectPts(x - 6, y - 58, 12, 58), { wash: '#4A2A1E', ink: INK, sw: .5 });
      if (k > .01) sandwich(x, y - 125, t, 0, 200 * k);
    }
  }
  scene('rap_brain', 162.86, 167.58, brain, [
    [162.86, 960, 460, 1000], [164.6, 960, 560, 1080, 1], [BRN.cal, 980, 700, 860, 1], [BRN.expl, 1030, 840, 720, 1], [167.579, 1060, 860, 680, 1],
  ]);

  // ======== RAP NEW (167.58–178.58) «A hundred thousand G-P-Us, the whole AI craze — just to scan my lunch and find the mayonnaise. …mayonnaise» ========
  // Close on a sandwich under a scanner. Pull back: the scanner hangs off a fat bundle of cables that runs into an endless server hall,
  // every rack blinking. «scan my lunch»: a red scan line sweeps the sandwich. «mayonnaise»: a lock-on frame snaps onto the one white blob;
  // the long «…mayonnaise»: the frame pulses, the whole hall heats up and catches fire; Clawd beams.
  function sandwich(x, y, t, mayoK, w = 420) {                            // (x, y) = centre of the Codex sandwich-on-plate; returns the mayo drip
    layer('sandwich', x, y, w);
    const mx = x + .45 * w, my = y - .03 * w * 321 / 532;
    if (mayoK > 0) glowAt(mx, my, 60, '#FFFDF2', 120 * mayoK);
    return [mx, my];
  }
  const MY = { scan: 170.30, lock: 171.70, hold: 172.14, burn: 174.0, out: 175.88 };
  function mayo(t) {
    back(TK.soot);
    const heat = eased(t, MY.hold, MY.out), fireK = eased(t, MY.burn, MY.out + 1);
    dataCenter(t, { heat, fire: fireK, vp: [960, 470], n: 8 });
    // the cable bundle from the depth of the hall to the scanner
    for (let i = 0; i < 7; i++) inkLine([[960 + (i - 3) * 10, 470], [960 + (i - 3) * 40, 250], [1000 + (i - 3) * 14, 560]], 6, [TK.blue, TK.ember, TK.green, TK.yellow, PAL.violet, TK.orange, TK.blueDk][i], 'ink', .7);
    // table + sandwich + scanner
    paint(rectPts(740, 880, 520, 26, 1), { wash: '#7A4A2E', ink: INK, sw: 1 }); for (const lx of [770, 1210]) paint(rectPts(lx, 906, 20, 160), { wash: '#4A2A1E', ink: INK, sw: .6 });
    const [mx, my] = sandwich(1000, 770, t, eased(t, MY.lock, MY.lock + .3));
    paint([[940, 560], [1060, 560], [1090, 640], [910, 640]], { wash: A2.steel, fill: A2.gunDk, fillOp: 60, tex: .4, ink: INK, sw: 1.2 });
    paint(rectPts(930, 636, 140, 14), { wash: '#FF2F4A', ink: INK, sw: .6 });
    const sc = seg(t, MY.scan, MY.lock);
    if (sc > 0 && sc < 1) { const sx = lerp(820, 1180, (Math.sin(sc * Math.PI * 3 - Math.PI / 2) + 1) / 2); paint([[990, 650], [1010, 650], [sx + 4, 800], [sx - 4, 800]], { wash: '#FF2F4A', washOp: 110, ink: null }); inkLine([[sx, 700], [sx, 800]], 3, '#FF2F4A', 'ink', 0); }
    if (t > MY.lock) {                                                       // lock-on frame: four corners snapping in, then pulsing
      const k = eased(t, MY.lock, MY.lock + .2), p = 1 + .08 * Math.sin(t * 12) * (t > MY.hold ? 1 : 0), r = lerp(300, 80, k) * p;
      const L = r * .45, T = 9;                                             // brackets as polygons (a thick inkLine blobs into discs)
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const x = mx + sx * r, y = my + sy * r * .8;
        paint(rectPts(Math.min(x, x - sx * L), y - T / 2, L, T), { wash: '#FF2F4A', ink: null }); paint(rectPts(x - T / 2, Math.min(y, y - sy * L), T, L), { wash: '#FF2F4A', ink: null }); }
    }
    const cx = 660;
    clawd(cx, 1060, 16, { eyes: t > MY.lock ? 'heart' : 'look', lookX: 1, mouth: t > MY.lock ? 'grin' : 'smile', aL: t > MY.hold ? 1.5 + .3 * Math.sin(t * 8) : .4, aR: t > MY.hold ? 1.5 + .3 * Math.sin(t * 8 + 1) : .4, noShadow: true });
    if (t > MY.out) flash(kick(t, [MY.out], .5) * .4, TK.orange);
  }
  scene('rap_mayo', 167.58, 178.58, mayo, [
    [167.58, 1040, 780, 460], [170.2, 960, 560, 1080, 1], [MY.scan + .2, 1000, 780, 700, 1], [MY.lock, 1110, 820, 360, 1], [MY.burn, 1080, 780, 560, 1],
    [MY.out, 960, 600, 1080, 1], [178.579, 960, 580, 1080, 1],
  ], [[MY.lock, 8], [MY.out, 12]]);

  // ======== CHORUS 3 (178.58–183.82) «BURN THE TOKENS! BURN THE TOKENS! 'Til the limit hits the floor!» = the shredder again, «floor» on the bar ========
  replay('c3_shredder', 178.58, 183.82, s2, 133.14);

  // ======== OUTRO NEW (210.0–216.68) «Sunday. Eleven fifty-eight p.m. / Zero tokens left.» — the same room at night ========
  // The cuckoo clock at two to twelve (second ticks on the hits). The last coin in the jar flickers, burns out in a puff; the wall bar drains.
  const SU = { zero: 214.40 };
  function sunday(t) {
    const tick = EN_HITS.filter(([h]) => h > 210 && h <= t).length;
    const last = t < SU.zero ? 1 : 1 - eased(t, SU.zero + .2, SU.zero + .8);
    nightRoom(t, { min: -.21 + tick * .012, hour: -.02, lid: 1, glow: '#3A6AE0', fill: last > .5 ? 1 / 14 : 0, eyes: t > SU.zero + .6 ? 'closed' : 'narrow', mouth: 'flat' });
    if (t > SU.zero + .2 && t < SU.zero + 1.4) smoke(ROOM.jar[0], ROOM.jar[1] - 60, t, { k: 1 - seg(t, SU.zero + .8, SU.zero + 1.4) });
    if (last > 0 && last < 1) fire(ROOM.jar[0], ROOM.jar[1] - 14, 30, 40 * last, t, { k: last, seed: 5 });
  }
  scene('out_sunday', 210.0, 216.68, sunday, [
    [210.0, 920, 600, 820], [213.4, 1100, 760, 760, 1], [SU.zero, 1380, 860, 460, 1], [216.679, 1360, 860, 500, 1],
  ]);

  // ======== OUTRO NEW (224.72–228.76) «Silence. / I'm at peace.» — Clawd in the armchair, eyes shut, smiling; only the pendulum moves ========
  scene('out_peace', 224.72, 228.76, t => nightRoom(t, { min: -.035, hour: -.004, lid: 0, fill: 0, eyes: 'closed', mouth: 'smile' }), [
    [224.72, 1120, 620, 1000], [228.759, 1180, 680, 820, 1],
  ]);

  // ======== OUTRO NEW (230.72–236.02) «"Your weekly limit has been reset."» ========
  // The laptop flips open in green light, the bar on the wall clicks all the way to full, the empty jar refills coin by coin. Clawd opens his eyes.
  const RS = { lid: 230.9, bar: 231.7, jar: 232.8, eyes: 234.0 };
  function reset(t) {
    nightRoom(t, { min: 0, hour: 0, lid: eased(t, RS.lid, RS.lid + .15), glow: TK.led, fill: seg(t, RS.jar, 234.6), gauge: eased(t, RS.bar, RS.bar + .6), gaugeGlow: kick(t, [RS.bar + .6], .8),
      eyes: t < RS.eyes ? 'closed' : 'narrow', mouth: 'flat', lit: t > RS.lid ? TK.led : null });
  }
  scene('out_reset', 230.72, 236.02, reset, [
    [230.72, 1260, 620, 900], [RS.bar - .2, 1300, 600, 700, 1], [RS.jar, 1360, 740, 700, 1], [RS.eyes, 1300, 860, 520, 1], [236.019, 1300, 900, 360, 1],
  ], [[RS.bar + .6, 6]]);

  // ======== OUTRO NEW (236.02–249.216) «Fuck.» — the break — «Fuck.» — the title ========
  // 236.28 extreme close-up, eyes half shut, the green laptop light the only thing moving. 237.02 (the loudest bar of the song): the floor
  // bursts and the bull roars up through the room, the jar spews coins, agents pour out of the laptop. 241.92 the same close-up, lit orange.
  // 243.2 black card: the title stamp + credit.
  const FN = { f1: 236.28, brk: 237.02, f2: 241.92, card: 243.2 };
  const face = (t, lit) => nightRoom(t, { min: 0, hour: 0, lid: 1, glow: TK.led, fill: 1, gauge: 1, eyes: 'narrow', mouth: 'flat', lit });
  function finale(t) {
    if (t < FN.brk) return face(t, mixCol(TK.led, '#000000', .3 * Math.abs(Math.sin(t * 9))));
    if (t < FN.f2) {
      const a = t - FN.brk;
      nightRoom(t, { min: 0, hour: 0, lid: 1, glow: TK.orange, fill: 1 - seg(a, 0, 1.5), gauge: 1, gaugeGlow: 1, eyes: 'scared', mouth: 'O' });
      const up = easeOut(seg(a, 0, .35)), st = a < .5 ? .25 * Math.sin(a / .5 * Math.PI) : 0;
      bull(960, lerp(1900, 1170, up), t - FN.brk + 43.68, a, { sy: 1 + st, sx: 1 - st * .5 });
      paint(rectPts(-400, 1060, W + 800, 600), { wash: '#5A3A28', fill: '#3A2418', fillOp: 90, tex: .6, ink: null });
      rubble(960, 1060, 900, a, 3);
      for (let i = 0; i < 20; i++) { const u = frac(a * .8 + hash(i)), [x, y] = arc(ROOM.jar[0], ROOM.jar[1] - 60, 500 + hash(i + 2) * 900, 1060, 300 + hash(i) * 300, u); token(x, y, 16, { spin: t * 4 + i, burn: u }); }
      for (let i = 0; i < 8; i++) { const u = frac(a * .5 + i / 8), [x, y] = arc(ROOM.laptop[0], ROOM.laptop[1] - 60, 1500 - i * 40, 1060, 220, u); A06.mini(x, y, 4.5, { n: i + 1, eyes: 'happy', mouth: 'O', aL: 1.4, aR: 1.4 }); }
      fire(960, 1060, 1100, 160 * seg(a, .3, 1.5), t, { k: seg(a, .3, 1.2), seed: 8 });
      flash(kick(t, [FN.brk], .3) * .6, '#FFFFFF');
      return;
    }
    if (t < FN.card) return face(t, mixCol(TK.orange, TK.ember, .5 + .5 * Math.sin(t * 11)));
    back('#0A0A0C');
    paint(rectPts(-400, -400, W + 800, 1900), { wash: '#0A0A0C', ink: null });
    stamp('BURN THE TOKENS', 960, 500, 76, t, FN.card + .2, { col: TK.yellow, rot: -.04 });
    const cr = eased(t, FN.card + 1.2, FN.card + 1.8);
    if (cr > 0) letter('created by rocketmandrey', 960, 640, 30, PAL.cream, { font: ruFont(30), ink: false, alpha: cr });
    glowAt(960, 1000, 520, TK.orange, 90);                              // the card sits over a low fire, one token burning in it
    fire(960, 1080, 900, 240 + 40 * kick(t, EN_GRID, .3), t, { k: .8, seed: 13 });
    token(960, 860, 64, { spin: t * .8, burn: .6 + .4 * Math.sin(t * 3) });
  }
  const FACE = [ROOM.chair[0], ROOM.chair[1] - 100 - 6 * 12];
  scene('out_finale', 236.02, 249.216, finale, [
    [236.02, FACE[0], FACE[1], 300], [FN.brk, 960, 620, 1080], [FN.brk + 2.5, 960, 600, 1120, 1], [FN.f2 - .01, 960, 600, 1120, 1], [FN.f2, FACE[0], FACE[1], 300], [FN.card - .01, FACE[0], FACE[1], 290, 1],
    [FN.card, 960, 700, 900], [249.215, 960, 690, 860, 1],
  ], [[FN.brk, 26]]);
})();

// The RU real chapters would win the lookup over the warped v2 ones: b07 samsara is dropped (the EN ring replaces it), b08 / b10 stay.
// ?ru (debug): the other way round, only the warped RU chapters, to pick which of them to bring back
if (/[?&]ru\b/.test(location.search)) { for (let i = CH.length - 1; i >= 0; i--) if (CH[i].name.startsWith('en_')) CH.splice(i, 1); }
else {
  // the RU real chapters kept: b08 mayo (phone close-up, GPU hall, flying into the mayo; after the EN brain, from 165.12) and b10 finale (the break)
  for (let i = CH.length - 1; i >= 0; i--) if (CH[i].real && !CH[i].name.startsWith('en_') && !['mayo', 'finale'].includes(CH[i].name)) CH.splice(i, 1);
  const m = CH.find(c => c.name === 'mayo'); m.start = Math.max(m.start, 165.12);
  // user notes on draft 2: from the mayo on, the RU scenes play under the RU camera (RU_CAM): b08 mayo, a09 chorus 3 / revenue / AGI / the
  // benchmark puppeteers (the EN coin-mountain hold takes over at 199), a10 office outro + b10 break; the EN scenes there are dropped
  const DROP = ['rap_mayo', 'c3_shredder', 'e30_board', 'out_sunday', 'e33_shelf', 'out_peace', 'e34_midnight', 'out_reset', 'out_finale'];
  for (let i = CH.length - 1; i >= 0; i--) if (DROP.includes(CH[i].name.slice(3)) && CH[i].name.startsWith('en_')) CH.splice(i, 1);
  RU_CAM.push([165.12, 194.32], [210.0, 241.5], [243.0, 1e9]);
  RU_FIX.push([210.0, 1260, 520, 1300], [216.26, 900, 540, 1500], [219.6, 930, 700, 1000]);     // the a10 wall clock: whole in frame at 210, out of frame at 219.6 (not cut by the edge)
  CH.find(c => c.name === 'en_rap_brain').end = 165.12;              // the RU phone close-up takes «Is a calorie tracker»
  for (let i = EN_PUNCH.length - 1; i >= 0; i--) if (RU_CAM.some(([a, b]) => EN_PUNCH[i][0] >= a && EN_PUNCH[i][0] < b)) EN_PUNCH.splice(i, 1);
  // the second «Fuck.» (241.92): back to the a10 close-up, the calm shut-eyed face, and on the word the eyes snap open, red (a10 sSnap, v2 225.0,
  // which the b10 break skips in the RU cut); it also covers b10's white-out. The RU credits resume at 243.0.
  CH.find(c => c.name === 'finale').end = 241.5;
  const sun = CH.find(c => c.name === 'sunday');
  const ruAt = v => { let i = 0; while (i + 1 < sun.shots.length && v >= sun.shots[i + 1][0]) i++; const t0 = sun.shots[i][0], e = sun.shots[i + 1] ? sun.shots[i + 1][0] : sun.end; sun.shots[i][1](v, v - t0, e - t0); };
  chapter('en_fuck2', 241.5, 243.0, [[241.5, t => { const r = window.REAL_CH; window.REAL_CH = false; try { ruAt(t < 241.92 ? 224.95 : 225.0 + (t - 241.92)); } finally { window.REAL_CH = r; } }]], { real: true });
  EN_KEYS.push([194.32, 960, 540, 800], [241.5, 960, 540, 1500], [241.92, 960, 540, 1800]);
}

// BURN THE TOKENS keeps the moon out of every reused RU sky (a05 factory, a10 office window)
window.NO_MOON = true;
// «Don't ask why — it's good for you!»: the a05 LED billboard tells it with a picture, no slogan: the grinning stock-photo Clawd with the
// thumbs-up is spoon-fed a glowing token like medicine, a big heart pops over him, five stars under it.
a05_billboard = function (x, y, w, h, t, lit) {
  const s = Math.min(w / 1400, h / 780), X = u => x + u * w, Y = v => y + v * h, dk = '#070A14', C = c => mixCol(c, dk, 1 - lit);
  paint(rectPts(x - 14 * s, y - 14 * s, w + 28 * s, h + 28 * s, 1), { wash: A2.gunDk, fill: A2.steel, fillOp: 70, tex: .4, ink: PAL.ink, sw: 1.2 });
  paint(rectPts(x, y, w, h), { wash: C('#2F6FE8'), ink: null });
  paint(rectPts(x, y + h * .45, w, h * .55), { wash: C('#6FB2FF'), washOp: 200, ink: null });
  paint(rectPts(x, y + h * .75, w, h * .25), { wash: C('#CFE8FF'), washOp: 190, ink: null });
  const u = h * .062, cx = X(.34), cy = Y(.96), thumb = (uu, sw) => {
    rotate(.95);
    paint(rrPts(-.3 * uu, -.8 * uu, 1.5 * uu, 1.5 * uu, .4 * uu), { wash: C(PAL.clay), ink: PAL.ink, sw: sw * .8 });
    paint(rrPts(.15 * uu, -2.2 * uu, .6 * uu, 1.6 * uu, .3 * uu), { wash: C(PAL.clay), ink: PAL.ink, sw: sw * .8 });
  };
  if (lit > .3) paint(ellPts(cx, cy - 4.5 * u, 9 * u, 6 * u, 20), { wash: '#FFFFFF', washOp: 70 * lit, ink: null });
  clawd(cx, cy, u, { eyes: lit > .3 ? 'happy' : 'narrow', mouth: 'O', aL: .95, armL: thumb, aR: -.1, noShadow: true, col: C(PAL.clay), dk: C(PAL.clayDk), lt: C('#F5B394') });
  // the spoon from the right, a burning-bright token in it, bobbing towards the open mouth
  const bob = Math.sin(t * 3) * .02, sx0 = X(.47 + bob), sy0 = Y(.6);
  paint([[sx0 + 60 * s, sy0 - 10 * s], [X(1.02), Y(.5)], [X(1.02), Y(.56)], [sx0 + 60 * s, sy0 + 12 * s]], { wash: C('#D9DEE6'), ink: PAL.ink, sw: .9 });
  paint(ellPts(sx0, sy0, 90 * s, 44 * s, 20), { wash: C('#E8ECF2'), fill: C('#AEB6C2'), fillOp: 70, ink: PAL.ink, sw: 1 });
  if (lit > .3) glowAt(sx0, sy0 - 30 * s, 120 * s, '#FFD27A', 120 * lit);
  token(sx0, sy0 - 26 * s, 42 * s, { spin: .02, glow: lit });
  // the heart and the stars
  const hp = 1 + .08 * Math.sin(t * 6), hx = X(.74), hy = Y(.26), hr = 95 * s * hp;
  paint([[hx, hy + hr * .9], [hx - hr, hy - hr * .05], [hx - hr * .95, hy - hr * .6], [hx - hr * .5, hy - hr * .85], [hx, hy - hr * .45], [hx + hr * .5, hy - hr * .85], [hx + hr * .95, hy - hr * .6], [hx + hr, hy - hr * .05]],
    { wash: C('#FF4F6A'), fill: C('#C8203A'), fillOp: 60, ink: PAL.ink, sw: 1 });
  for (let i = 0; i < 5; i++) paint(starPts(X(.6 + i * .075), Y(.84), 34 * s, .45, 5), { wash: C(TK.yellow), ink: PAL.ink, sw: .8 });
};
