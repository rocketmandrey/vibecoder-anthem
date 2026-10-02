// tokensEN/v8_b.js: round v8 native rebuilds on the new track (real seconds inside, v1 registration): items 4 (the bull), 5 (top burner), 6 (beggar).
(() => {
  const INK = PAL.ink;
  const { kick, NOTXT, native, back, layer, rubble } = ENK;
  const RB = EN_BEATS.map(O2N);                                            // real beats
  const rbp = s => { let i = 0; while (i + 1 < RB.length && RB[i + 1] <= s) i++; return i + clamp((s - RB[i]) / ((RB[i + 1] ?? RB[i] + .33) - RB[i])); };
  const hop = (s, seed = 0) => Math.abs(Math.sin((rbp(s) + seed) * Math.PI));   // 0..1 per beat, real time
  const drop = name => { const c = CH.find(c => c.name === name); if (c) CH.splice(CH.indexOf(c), 1); };
  const reg = (name, a, b, fn, keys, punch = []) => {                      // a, b, keys, punches in v1
    chapter('en_' + name, a, b, [[a, native(fn)]], { real: true });
    if (window.RU34) RU34.push([a, b, keys]);
    EN_PUNCH.push(...punch);
  };

  // ======== 4. «Fans are howlin', the racks run hot. Wall Street screams, "Is that all you got?"» (real 43.34–50.99, v1 39.78–45.46) ========
  // Replaces en_s1_servers (it slow-mo'd the bull over the gap). Bar 1 (Wall 46.24): rumble, the floor cracks open in two jolts.
  // Bar 2 («Is» 47.26): a smoke blast out of the cracks and the bull bursts up roaring through «got?!». The gap to the chorus (50.92):
  // he pounds the floor with alternate fists on every beat, steam out of his nostrils, then both fists up and one more roar on the 50.36 downbeat.
  drop('en_s1_servers');
  const B4 = { a: 39.78, b: 45.46, hot: 44.98, crack: 46.24, crack2: 46.88, burst: 47.26, shut: 48.74, last: 50.36 };
  const W4 = [47.26, 47.46, 47.72, 48.0, 48.3];
  const SLAM = RB.filter(b => b > 48.9 && b < B4.last - .1);                // 49.04 49.36 49.70 50.04
  const fx = 960, fy = 1110;
  function bullR(x, y, s, o) {                                             // the scenes.js bull rig, driven in real seconds
    LETTERS.push({ txt: '', x: 0, y: 0, size: 1, color: '#000' }); flushLetters();
    const BW = 640, BH = BW * BULL_ART.body[1] / BULL_ART.body[0], HW = 400, HH = HW * BULL_ART.head_open[1] / BULL_ART.head_open[0];
    push(); translate(x, y); scale(1.3 * o.sx, 1.3 * o.sy);
    layer('body', 0, -BH / 2, BW, { sy: 1 + .03 * o.word });
    const hy = -BH + 40 - HH / 2 - 14 * o.word + 10 * o.nod, hs = 1 + .07 * o.word;
    layer(o.open ? 'head_open' : 'head_shut', 0, hy, HW * hs, { rot: .05 * Math.sin(s * 23) * o.word + .03 * Math.sin(s * 3) });
    for (const d of [-1, 1]) {
      const f = o.fist[d < 0 ? 0 : 1], jx = 5 * Math.sin(s * 41 + d), jy = 5 * Math.cos(s * 37 + d);
      layer(d < 0 ? 'fist_l' : 'fist_r', d * BW * (.43 + .04 * f) + jx, lerp(-BH * .72 - o.up * 60, -BH * .5, f) + jy, 175 * (1 + .15 * f), { rot: d * (.1 + .3 * f) });
    }
    for (const [w, big] of o.puffs) {                                      // steam out of both nostrils
      const a = s - w; if (a < 0 || a > .8) continue;
      const f = a / .8, sc = lerp(.45, big ? 1.4 : 1.1, easeOut(f));
      for (const d of [-1, 1]) layer('steam', d * (70 + 150 * sc + 40 * f), hy + HH * .06 - 30 * f, 250 * sc, { flip: d < 0, alpha: 1 - f * f });
    }
    pop();
  }
  const fistK = (s, list) => {                                             // 0 raised .. 1 on the floor: a fast drop into the beat, eased lift after
    let k = 0;
    for (const b of list) { const d = s - b; if (d < -.1 || d > .4) continue; k = Math.max(k, d < 0 ? 1 + d / .1 : Math.exp(-d / .14)); }
    return k;
  };
  function bullScene(t) {
    const s = O2N(t);
    back(TK.soot);
    const rum = s < B4.burst ? 7 * ease(seg(s, B4.crack, B4.burst)) * (.6 + .4 * kick(s, RB, .12)) : 0;   // bar 1 rumble
    push(); translate(rum * Math.sin(s * 71), rum * .6 * Math.cos(s * 53));
    const heat = lerp(.45, 1, seg(s, 43.34, B4.hot)), burn = ease(seg(s, B4.hot, B4.hot + .5)) * 1.2;
    dataCenter(t, { heat, fire: burn, vp: [960, 470], seed: 3 });
    smoke(960, 380, s, { n: 6, h: 420, r: 80, col: '#2A2224', seed: 2 });
    for (const [x, dir] of [[720, 1], [1200, -1]]) {
      cooler(x, 175, 115, s, { speed: dir * (5 + 3 * burn), howl: 1 });
      steam(x, 290, s, { dir: Math.PI / 2 + dir * .25, len: 380, n: 7, per: .5, seed: x, col: '#DCE6F0', k: .8 });
    }
    siren(960, 20, s, { col: '#FF3A2A', speed: 1.6, len: 800, r: 34, on: seg(s, B4.hot, B4.hot + .2) });
    // the floor splits in two jolts («Wall», «screams»), orange light pulsing through the cracks on the beats
    const ck = .55 * ease(seg(s, B4.crack, B4.crack + .3)) + .45 * ease(seg(s, B4.crack2, B4.crack2 + .3)), gl = .7 + .3 * kick(s, RB, .15);
    if (ck > 0 && s < B4.burst + .1) for (let i = 0; i < 7; i++) {
      const a = Math.PI + (i + .5) / 7 * Math.PI, L = 440 * ck * (.6 + .5 * hash(i)), pts = [[fx, fy]];
      for (let j = 1; j <= 4; j++) pts.push([fx + Math.cos(a) * L * j / 4 + (hash(i * 9 + j) - .5) * 40, fy + Math.sin(a) * L * j / 4 * .35 + (hash(i * 7 + j) - .5) * 16]);
      glowAt(pts[2][0], pts[2][1], 80 * ck, TK.orange, 170 * ck * gl); glowAt(pts[4][0], pts[4][1], 50 * ck, TK.yellow, 120 * ck * gl); inkLine(pts, 6, TK.soot, 'ink', .2); inkLine(pts, 2.6, TK.yellow, 'inkfine', .2);
      if (s > B4.crack2) smoke(pts[3][0], pts[3][1], s, { n: 3, h: 160, r: 26, col: '#7A6A60', seed: i * 5, per: 1.1 });
    }
    // dust trickling from the ceiling while it rumbles
    if (s > B4.crack && s < B4.burst + .6) for (let i = 0; i < 14; i++) {
      const p = frac(s * 1.3 + hash(i)), x = 520 + hash(i + 2) * 880, y = 260 + p * 800;
      paint(ellPts(x, y, 5, 5, 6), { wash: '#8A7A6A', washOp: 200 * (1 - p), ink: null });
    }
    const age = s - B4.burst;
    if (age > 0) {
      paint(ellPts(fx, fy + 20, 420, 80, 22, 12), { wash: '#1A0C08', ink: INK, sw: 1.2 });
      glowAt(fx, fy, 380, TK.orange, 70 + 60 * Math.exp(-age * 1.5) + 30 * kick(s, SLAM, .2));
    }
    // the bull: stretched on the way up, squashed on the stop, roars on every word, then pounds
    if (age > -.02) {
      const upK = easeOut(clamp(age / .22)), y = lerp(1900, 1170, upK);
      const st = age < .22 ? .35 * (1 - upK) + .15 : age < .5 ? -.22 * Math.sin((age - .22) / .28 * Math.PI) : .06 * Math.sin(age * 26) * Math.exp(-(age - .5) * 1.5);
      const sl = kick(s, SLAM, .12), lastK = ease(seg(s, B4.last - .15, B4.last + .1));
      const open = (age > .12 && s < B4.shut) || s > B4.last - .05;
      const fs = fistK(s, SLAM.filter((_, i) => i % 2 === 0)), fr = fistK(s, SLAM.filter((_, i) => i % 2 === 1));
      bullR(fx, y + 30 * sl, s, {
        sx: 1 - st * .6 + .03 * sl, sy: 1 + st - .05 * sl, open, word: kick(s, [...W4, B4.last], .12), nod: 6 * sl,
        fist: [fs, fr], up: lastK, puffs: [...W4.map(w => [w, 0]), ...SLAM.map(w => [w, 1]), [B4.last, 1], [B4.last + .33, 1]],
      });
      paint(rectPts(-200, fy + 60, W + 400, 400), { wash: '#262A31', fill: TK.orangeDk, fillOp: 60, tex: .5, ink: null });   // the floor hides his legs
      inkLine([[fx - 420, fy + 60], [fx + 420, fy + 60]], 1.6, INK, 'ink', .3);
      rubble(fx, fy + 40, 800, age, 5);
      for (const [i, b] of SLAM.entries()) rubble(fx + (i % 2 ? 300 : -300), fy + 50, 260, s - b, 20 + i);
      // the smoke blast: billows roll out of the hole and up, thinning out by the end of «got?!»
      if (age < 1.6) for (let i = 0; i < 12; i++) {
        const k = easeOut(clamp(age / 1.2)), a = Math.PI * (1.05 + .9 * i / 11), r = (60 + 90 * k) * (.7 + .6 * hash(i + 40));
        const px = fx + Math.cos(a) * (120 + 520 * k) * (.8 + .4 * hash(i)), py = fy + 30 + Math.sin(a) * (40 + 260 * k) - 60 * k;
        paint(ellPts(px, py, r, r * .7, 14, r * .1), { fill: '#9A8E86', fillOp: 170 * (1 - clamp(age / 1.6)), bleed: .3, tex: .4, ink: null });
      }
      flash(Math.exp(-age / .08) * .25 * (age < .3), '#FFF3C8');
    }
    // the vibecoder and two agents: scared in bar 1, thrown clear by the burst, then cowering in front, hopping on every slam
    const scared = s > B4.crack - .1, thrown = age > 0, fl = thrown ? easeOut(clamp(age / .5)) : 0, air = thrown && age < .5 ? Math.sin(age / .5 * Math.PI) : 0;
    const jolt = thrown ? kick(s, [...SLAM, B4.last], .1) : 0, tr = thrown ? 3 * Math.sin(s * 47) : 0;
    const face = scared ? { eyes: 'scared', mouth: 'O', aL: 1.5, aR: 1.5 } : null;
    const bp = s < B4.crack ? hop(s) : 0;
    agentBot(lerp(660, 520, fl) + tr, lerp(1130, 1265, fl) - air * 200 - jolt * 26, lerp(17, 19, fl), t, { ...(face || { dy: -bp * 1.6, aL: .4 + bp, aR: .4 }), rot: thrown && age < .5 ? -age * 6 : NOTXT, n: 3 });
    agentBot(lerp(1260, 1370, fl) - tr, lerp(1130, 1265, fl) - air * 220 - jolt * 26, lerp(17, 19, fl), t, { ...(face || { dy: -bp * 1.6, aL: .4, aR: .4 + bp }), flip: true, rot: thrown && age < .5 ? age * 6 : NOTXT, n: 8 });
    if (!thrown) clawd(960, 1180, 30, {
      dy: s < B4.crack ? -hop(s) * .5 : -Math.abs(Math.sin(s * 30)) * .5, eyes: scared ? 'scared' : 'narrow', mouth: scared ? 'o' : 'flat', lookY: scared ? 1 : 0,
      aL: scared ? 1.2 : .3 + .2 * hop(s), aR: scared ? 1.2 : .3 + .2 * hop(s), emote: s > 43.9 && s < B4.crack ? 'sweat' : null,
    });
    else clawd(lerp(960, 800, fl) + tr, lerp(1180, 1300, fl) - air * 320 - jolt * 30, lerp(30, 22, fl), {
      rot: age < .5 ? -age * 12.6 : .05 * Math.sin(s * 40), eyes: 'scared', mouth: 'O', aL: 1.6, aR: 1.6, emote: age > .6 ? 'sweat' : null,
    });
    pop();
  }
  const v = N2O;
  reg('v8b_bull', B4.a, B4.b, bullScene, [
    [B4.a, 960, 570, 1080], [v(B4.crack), 960, 585, 1050, 1], [v(B4.burst) - .002, 960, 630, 960, 1],   // a slow push to the trio through the rumble
    [v(B4.burst), 960, 600, 1120], [B4.b - .001, 960, 590, 1060, 1],                                  // cut wide on the bull, eased push through the pounding
  ], [[v(46.38), 5], [v(46.72), 6], [v(B4.crack2), 9], [v(47.04), 8], ...SLAM.map(b => [v(b), 13]), [v(B4.last), 17]]);

  // ======== 5. «Top burner gets a bonus, don't ask why.» (real 80.30–82.81, v1 74.0–76.8) ========
  // The a04 golden idol on its TOP BURNER pedestal (RU a04_god, re-drawn natively), now with a LIVING crowd: clappers, jumpers, arm-wavers;
  // on «bonus» a gold token fountain bursts off the idol and the whole crowd jumps; two envious ones at the front corners sulk, arms down,
  // and on «don't ask why» turn to each other and shrug.
  const T5 = { a: 74.0, b: 76.8, top: 80.30, bonus: 81.28, dont: 81.94, why: 82.44 };
  const W5 = [80.30, 80.62, 80.96, 81.28, 81.94, 82.2, 82.44];
  // crowd: [x, y, u, kind, seed]; kinds: c clap, j jump, w wave, e envious (side: x < 960 looks right)
  const CROWD = [
    [620, 1000, 13, 'w', 1], [760, 990, 13, 'c', 2], [900, 1000, 13, 'j', 3], [1030, 990, 13, 'c', 4], [1170, 1000, 13, 'j', 5], [1310, 995, 13, 'w', 6],
    [680, 1105, 15, 'j', 7], [840, 1110, 15, 'c', 8], [1000, 1100, 15, 'w', 9], [1160, 1110, 15, 'c', 10], [1300, 1105, 15, 'j', 11],
    [610, 1225, 17, 'e', 12], [960, 1235, 17, 'c', 13], [1320, 1225, 17, 'e', 14],
  ];
  function topBurner(t) {
    const s = O2N(t), wk = kick(s, W5, .2), bon = s - T5.bonus;
    back('#241A12');
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#241A12', fill: A2.gunDk, fillOp: 70, tex: .5, ink: null });
    for (let i = 0; i < 18; i++) {
      const a = i / 18 * TAU + s * .15, ww = .08;
      paint([[960, 400], [960 + Math.cos(a - ww) * 1800, 400 + Math.sin(a - ww) * 1800], [960 + Math.cos(a + ww) * 1800, 400 + Math.sin(a + ww) * 1800]], { wash: i % 2 ? A2.sodium : A2.hazard, washOp: 70 + 50 * wk + 60 * kick(s, [T5.bonus], .4), ink: null });
    }
    glowAt(960, 400, 380, A2.hazard, 100 + 80 * wk);
    for (let r = 0; r < 3; r++) for (let c = 0; c <= r; c++) gpuCard(960 + (c - r / 2) * 190, 560 + r * 70, .5, t, { glow: .3 + .3 * wk });
    paint(rectPts(700, 760, 520, 90), { wash: A2.steel, fill: A2.gunmetal, fillOp: 90, tex: .5, ink: INK, sw: 1 });
    letter('TOP BURNER', 960, 805, 40, A2.hazard, { font: '40px "Russo One", "Arial Black", sans-serif', ink: false });
    // the idol: struts on the beat, a spark-eyed grin on «bonus»
    const ib = hop(s);
    clawd(960, 525, 26, { col: '#F2C53D', dk: '#A88A10', lt: '#FFE38A', hat: 'crown', eyes: bon > 0 ? 'spark' : 'happy', mouth: 'grin', aL: 1.2 + .3 * ib, aR: 1.4 + .2 * ib, noShadow: true, dy: -ib * .8,
      armR: u => token(1.2 * u, 0, 1.4 * u, { burn: .6 }) });
    for (let i = 0; i < 6; i++) { if (i === 2 || i === 3) continue; token(960 + (i - 2.5) * 110, 830, 18, { burn: .9 }); }
    // «bonus»: a fountain of gold tokens off the idol, raining onto the crowd
    if (bon > 0) for (let i = 0; i < 22; i++) {
      const a = -Math.PI * (.12 + .76 * hash(i + 70)), v0 = 700 + 500 * hash(i + 71), f = bon - .03 * (i % 5);
      if (f < 0) continue;
      const x = 960 + Math.cos(a) * v0 * f, y = 420 + Math.sin(a) * v0 * f + 1100 * f * f;
      if (y < 1150) token(x, y, 20, { spin: f * 6 + i, glow: .4 });
    }
    // the crowd
    const sh = s > T5.dont + .05 ? Math.sin(clamp((s - T5.dont - .05) / .5) * Math.PI) : 0;
    const bonJ = bon > 0 && bon < .5 ? Math.sin(bon / .5 * Math.PI) : 0;
    for (const [x, y, u, kind, sd] of CROWD) {
      const b = hop(s, sd * .17), tie = typeof a04_tie === 'function' ? a04_tie([TK.ember, TK.blue, '#2E8A4A'][sd % 3]) : null;
      let o;
      if (kind === 'e') {                                                // envious: arms down, narrow eyes, glances at the idol, then at each other
        const look = s > T5.dont ? (x < 960) : (x > 960);
        o = { eyes: 'narrow', mouth: 'flat', aL: -.8 + 1.3 * sh, aR: -.8 + 1.3 * sh, flip: look, dy: 0, emote: 'anger', emoteK: .8 + .2 * Math.sin(s * 9) };
        if (sd === 12) clawd(x, y, u, { ...o, draw: tie, seed: sd }); else agentBot(x, y, u, t, { ...o, n: 50 + sd, rot: NOTXT });
        continue;
      }
      if (kind === 'c') { const c = Math.sin(rbp(s) * TAU * 2 + sd); o = { eyes: 'happy', mouth: 'grin', aL: 1.0 + .45 * c, aR: 1.0 + .45 * c, dy: -b * 1.2 - bonJ * 4 }; }
      else if (kind === 'j') o = { eyes: 'spark', mouth: 'O', aL: 1.6, aR: 1.6, dy: -b * 4 - bonJ * 3, sq: (1 - b) * .12 };
      else o = { eyes: 'happy', mouth: 'grin', aL: 1.3 + .4 * Math.sin(rbp(s) * Math.PI + sd), aR: 1.3 - .4 * Math.sin(rbp(s) * Math.PI + sd), dy: -b * 1.5 - bonJ * 4, rot: .08 * Math.sin(rbp(s) * Math.PI) };
      o.flip = x > 960;
      if (sd % 2) agentBot(x, y, u, t, { ...o, n: 40 + sd, rot: o.rot || NOTXT }); else clawd(x, y, u, { ...o, draw: tie, seed: sd });
    }
    if (bon > 0 && bon < .2) flash(.18 * (1 - bon / .2), '#FFE9A8');
  }
  reg('v8b_topburner', T5.a, T5.b, topBurner, [[T5.a, 960, 650, 1000], [T5.b - .001, 960, 670, 940, 1]],
    [[v(T5.bonus), 9], [v(T5.why), 5]]);

  // ======== 6. «No one's working, including you.» (real 180.82–183.65, v1 160.10–162.86) ========
  // A city sidewalk. Clawd dozes on an upturned crate, laptop on his knees. «working»: he nods off too far and topples off the crate onto a flat
  // cardboard box by the wall. «including»: a cardboard sign WORK FOR TOKENS slaps down against the wall beside him, a tin cup at his feet;
  // he sleeps on under a newspaper. «you.»: a passing agent drops a token into the cup without stopping.
  const ce = CH.find(c => c.name === 'en_e26_thesis'); if (ce) ce.end = 160.10;
  const T6 = { a: 160.10, b: 162.86, work: 181.34, land: 181.78, inc: 182.0, you: 182.7 };
  function street(t) {
    const s = O2N(t);
    back('#5A5560');
    // brick wall + a shop's rolled-down shutter, sidewalk, curb, road
    paint(rectPts(-400, -800, W + 800, 1840), { wash: '#A0533E', fill: '#7A3A2C', fillOp: 70, tex: .6, ink: null });
    for (let r = 0; r < 26; r++) {
      const y = -760 + r * 70; inkLine([[-400, y], [W + 400, y]], .8, '#5A2A20', 'inkfine', 0);
      for (let x = -400 + (r % 2) * 70; x < W + 400; x += 140) inkLine([[x, y], [x, y + 70]], .7, '#5A2A20', 'inkfine', 0);
    }
    paint(rectPts(1180, 420, 420, 620), { wash: '#8A9096', fill: '#5E646A', fillOp: 60, tex: .4, ink: INK, sw: 1.2 });
    for (let y = 450; y < 1040; y += 34) inkLine([[1185, y], [1595, y]], 1, '#4A5056', 'inkfine', 0);
    paint(rectPts(1160, 390, 460, 40), { wash: '#3A3F46', ink: INK, sw: 1 });
    paint(rectPts(-400, 1040, W + 800, 230), { wash: '#B8B4AC', fill: '#9A968E', fillOp: 60, tex: .5, ink: INK, sw: 1 });   // sidewalk
    for (let x = -400; x < W + 400; x += 260) inkLine([[x, 1040], [x - 40, 1270]], .8, '#7A766E', 'inkfine', 0);
    paint(rectPts(-400, 1270, W + 800, 30), { wash: '#8A867E', ink: INK, sw: 1 });                                             // curb
    paint(rectPts(-400, 1300, W + 800, 600), { wash: '#3A3A40', fill: '#2A2A30', fillOp: 70, tex: .5, ink: null });           // road
    // the lamp post
    paint(rectPts(560, 300, 22, 960), { wash: '#2E3238', ink: INK, sw: .8 });
    paint(rectPts(530, 280, 82, 34, 1), { wash: '#2E3238', ink: INK, sw: .8 });
    // cardboard box flattened against the wall (his bed), and the crate he dozes on
    paint(rectPts(830, 1080, 260, 24, 1), { wash: '#C09A62', fill: '#A07A42', fillOp: 60, ink: INK, sw: .9 });
    paint(rectPts(640, 1010, 120, 100), { wash: '#8A6A3A', fill: '#6A4A22', fillOp: 60, tex: .5, ink: INK, sw: 1 });
    for (let i = 1; i < 4; i++) inkLine([[640, 1010 + i * 25], [760, 1010 + i * 25]], 1, '#4A3218', 'inkfine', 0);
    // Clawd: dozing on the crate, nodding on the beat; on «working» he nods off the edge, somersaults and lands slumped on the cardboard
    const f = seg(s, T6.work, T6.land), down = f >= 1, SX = 950, SY = 1090;
    if (!down) {
      const nod = s < T6.work ? .12 * hop(s) : 0, tip = ease(f);
      const x = lerp(700, SX, tip), y = lerp(1010, SY, tip) - Math.sin(f * Math.PI) * 110;
      clawd(x, y - 8 * 18 * Math.sin(tip * Math.PI) * .5, 18, { rot: .15 + nod + tip * (TAU - .15), eyes: f > 0 ? 'scared' : 'closed', mouth: f > 0 ? 'O' : 'flat', aL: f > 0 ? 1.6 : -.3, aR: f > 0 ? 1.6 : -.3, noShadow: f > 0 });
      if (f === 0) {                                                       // the laptop on his knees, screen glowing; zzz
        paint([[x - 10, y - 40], [x + 100, y - 40], [x + 110, y - 28], [x, y - 28]], { wash: '#C8CCD4', ink: INK, sw: .6 });
        paint([[x + 100, y - 40], [x + 130, y - 115], [x + 142, y - 112], [x + 112, y - 40]], { wash: '#9AD0FF', ink: INK, sw: .6 });
        emote('zzz', x + 60, y - 200, 22, 1);
      } else {                                                             // the laptop flies off and clatters down left
        const lx = lerp(760, 600, f), ly = lerp(980, 1090, f * f) - Math.sin(f * Math.PI) * 140;
        push(); translate(lx, ly); rotate(-f * 4); paint(rectPts(-55, -9, 110, 18), { wash: '#C8CCD4', ink: INK, sw: .6 }); pop();
      }
    } else {
      const a = s - T6.land, sq = Math.exp(-a / .1) * .3 * Math.cos(a * 30), br = .03 * Math.sin(s * 2.4);
      paint(rectPts(545, 1078, 110, 18, 1), { wash: '#C8CCD4', ink: INK, sw: .6 });                                         // the laptop, dead on the ground
      clawd(SX, SY, 18, { rot: -.1, eyes: 'closed', mouth: 'flat', aL: -.6, aR: -.6, noShadow: true, sq: sq + br });
      // the newspaper blanket pulled up to his chest
      const nk = easeOut(seg(a, .15, .45));
      if (nk > 0) {
        paint([[SX - 110, SY + 6], [SX - 104, SY - 70 * nk], [SX, SY - 82 * nk], [SX + 104, SY - 68 * nk], [SX + 112, SY + 6]], { wash: '#E8E2D2', ink: INK, sw: .8 });
        for (let q = 0; q < 3; q++) inkLine([[SX - 86, SY - 60 * nk + q * 18], [SX + 86, SY - 58 * nk + q * 18]], 1.4, '#8A8480', 'inkfine', 0);
      }
      emote('zzz', SX + 80, SY - 210, 24, clamp((a - .3) * 2));
    }
    // «including»: the sign slaps down against the wall (falls from above, bounces), small marker lettering
    const GX = 1160;
    if (s > T6.inc - .25) {
      const k = seg(s, T6.inc - .25, T6.inc), bo = s > T6.inc ? Math.exp(-(s - T6.inc) / .1) * Math.sin((s - T6.inc) * 40) * 6 : 0;
      const sy = lerp(-200, 990, easeIn(k)) - bo;
      push(); translate(GX, sy); rotate(-.06);
      paint(rectPts(-100, -80, 200, 160, 1), { wash: '#C9A267', fill: '#A88246', fillOp: 60, tex: .5, ink: INK, sw: 1.1 });
      inkLine([[-90, -66], [-20, -72]], 1, '#8A6A3A', 'inkfine', 0);
      pop();
      const font = sz => `${sz}px "Permanent Marker", "Arial Black", sans-serif`;
      letter('WORK FOR', GX, sy - 20, 34, '#2A2018', { font: font(34), rot: -.06 });
      letter('TOKENS', GX, sy + 26, 40, '#2A2018', { font: font(40), rot: -.06 });
    }
    // the tin cup in front of his cardboard
    const CX = 1068;
    paint(rectPts(CX - 22, 1090, 44, 52, 3), { wash: '#B8BEC6', fill: '#8A9098', fillOp: 70, ink: INK, sw: .8 });
    paint(ellPts(CX, 1090, 22, 6, 12), { wash: '#4A5058', ink: INK, sw: .5 });
    // «you.»: an agent strolls by right to left in front, flicks a token into the cup without stopping
    const wa = seg(s, 181.95, 183.65), ax = lerp(1520, 640, wa), walk = rbp(s) / 2, flick = s > T6.you - .2 && s < T6.you + .2;
    if (wa > 0) agentBot(ax, 1215, 17, t, { walk, dy: -Math.abs(Math.sin(walk * TAU)) * .5, aL: flick ? 1.3 : .3, aR: .2, rot: NOTXT, n: 77, eyes: 'happy', mouth: 'smile' });
    if (s > T6.you - .15 && s < T6.you + .2) {
      const k = seg(s, T6.you - .15, T6.you + .05);
      token(lerp(CX + 60, CX, k), lerp(1060, 1088, k * k) - Math.sin(k * Math.PI) * 70, 13, { spin: k * 8 });
    }
    if (s > T6.you + .05) { const g = clamp(1 - (s - T6.you - .05) / .35); if (g > 0) paint(starPts(CX, 1076, 24 * g + 6, .25), { wash: '#FFF3C8', ink: null }); }
  }
  reg('v8b_beggar', T6.a, T6.b, street, [[T6.a, 900, 965, 740], [T6.b - .001, 985, 975, 700, 1]], [[v(T6.land), 10], [v(T6.inc), 6]]);
})();
