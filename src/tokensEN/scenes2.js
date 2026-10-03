// tokensEN/scenes2.js: BURN THE TOKENS, the NEW scenes after H1 (the punches, the new scenes, the pre-chorus 2 replay).
// Same rules as scenes.js: composed for the 4:5 reels frame, drawn in code in the clip's own world, every gag a picture, no text in the frame.
// EN song time throughout (each scene is an EN-time real chapter). Loaded after scenes.js (ENK helpers), before tokens3/square.js.
(() => {
  const INK = PAL.ink;
  const { kick, lastLE, NOTXT, rubble, native, back, s1, dispenser } = ENK;
  const scene = (name, a, b, fn, keys, punch = []) => {
    chapter('en_' + name, a, b, [[a, native(fn)]], { real: true });
    EN_KEYS.push(...keys); EN_PUNCH.push(...punch);
  };
  const eased = (t, a, b) => ease(seg(t, a, b));
  const grey = (c, g) => g > 0 ? mixCol(c, '#6A6E78', g) : c;

  // ======== E12 NEW (76.72–81.98) «An agent hired an agent, it spawned a hundred more. Forty million tokens, and what was it for?» ========
  // An upside-down pyramid of agents grows up out of one: every row wider than the one under it, the whole thing swaying; tokens rain down it
  // and burn at the base. On «for?» the one at the very top holds up what it all made: one thin, empty folder. Tiny Clawd looks up from the floor.
  const TW = { floor: 1060, rowH: 84, rows: 9, top: 81.42 };   // floor < 1104: hazard() strips below that get stretched by square mode
  const rowT = r => r === 0 ? 76.80 : r === 1 ? 77.30 : 77.66 + (r - 2) * .3;
  const rowN = r => 1 + Math.floor(r / 2);
  function tower(t) {
    back('#EDE8DF');                                                          // a clean paper-white void, just a floor line (not the factory)
    paint(rectPts(-400, TW.floor, 2720, 700), { wash: '#D6CFC2', fill: '#C4BCAE', fillOp: 50, tex: .4, ink: null });
    inkLine([[-400, TW.floor], [2320, TW.floor]], 3, INK, 'ink', 0);
    const sway = r => Math.sin(t * 2.1) * r * r * .35 + Math.sin(t * 5.3 + r) * r * .6;
    // tokens rain down past the tower, catch fire on the way, heap and burn at its foot
    const rain = seg(t, 79.58, 79.9);
    if (rain > 0) for (let i = 0; i < 26; i++) {
      const p = frac(t * (.45 + hash(i) * .3) + hash(i + 7)), x = 960 + (hash(i + 3) - .5) * 1100, y = lerp(-400, TW.floor - 10, p);
      token(x, y, 16 + hash(i + 1) * 12, { spin: t * 2 + i, burn: clamp(p * 1.4 - .3) });
    }
    if (t > 79.9) fire(960, TW.floor + 10, 900, 140 + 40 * Math.sin(t * 4), t, { k: eased(t, 79.9, 80.4), seed: 21 });
    const lookUp = t > TW.top - .2;
    for (let r = 0; r < TW.rows; r++) {
      const a = t - rowT(r); if (a < 0) continue;
      const n = rowN(r), y0 = TW.floor - r * TW.rowH, drop = a < .18 ? (1 - easeOut(a / .18)) * 160 : 0, sq = a > .18 && a < .4 ? .16 * Math.sin((a - .18) / .22 * Math.PI) : 0;
      for (let i = 0; i < n; i++) {
        const x = 960 + (i - (n - 1) / 2) * 108 + sway(r), top = false;
        const o = { n: r * 7 + i, rot: NOTXT, sq, seed: r + i, noShadow: r > 0, eyes: lookUp ? 'look' : r > 7 ? 'scared' : 'happy', lookY: lookUp ? -1 : 0, mouth: r > 7 ? 'o' : 'smile',
          aL: .9 + .3 * Math.sin(t * 7 + r + i), aR: .9 + .3 * Math.sin(t * 7 + r + i + 1) };
        if (top && t > TW.top - .3) Object.assign(o, { aR: 1.9, eyes: 'happy', mouth: 'grin', lookY: 0 });
        agentBot(x, y0 - drop, 11, t, o);
      }
    }
    // the one on top (climbs up at 80.9): holds up what it all made, one thin, empty folder
    if (t > 80.9) {
      const r = TW.rows, x = 960 + sway(r), y = TW.floor - r * TW.rowH - (t < 81.1 ? (1 - easeOut((t - 80.9) / .2)) * 120 : 0), up = eased(t, TW.top - .3, TW.top);
      agentBot(x, y, 12, t, { n: 99, rot: NOTXT, noShadow: true, eyes: 'happy', mouth: 'grin', aR: .4 + 1.5 * up, aL: .4 + .8 * up });
      if (up > 0) {
        const fx = x + 70, fy = y - 150 - 40 * up, op = .25 + .15 * Math.sin(t * 9);
        glowAt(fx, fy, 130, TK.yellow, 90 * up);
        paint(rectPts(fx - 42, fy - 55, 84, 110), { wash: '#E8C87A', ink: INK, sw: 1 });
        paint(rectPts(fx - 36, fy - 48, 72, 96), { wash: PAL.cream, ink: INK, sw: .5 });               // one blank page
        push(); translate(fx - 42, fy - 55); scale(1 - op * 2, 1); paint(rectPts(0, 0, 84, 110), { wash: '#F2D896', ink: INK, sw: 1 }); pop();
      }
    }
    // tiny Clawd on the floor, head tipped back
    clawd(1130, TW.floor + 2, 9, { eyes: 'look', lookY: -1, mouth: t > TW.top ? 'o' : 'flat', emote: t > TW.top ? 'sweat' : null, aL: .2, aR: .2 });
  }
  scene('e12_tower', 76.72, 81.98, tower, [
    [76.80, 1000, 860, 560], [77.7, 990, 830, 620, 1], [78.6, 980, 790, 680, 1], [79.6, 960, 660, 920, 1], [80.4, 960, 580, 1000, 1], [81.979, 960, 560, 1000, 1],   // whole tower top to floor from 80.4, tiny Clawd in frame from the start
  ], [[81.42, 10]]);

  // ======== E13 NEW (81.98–87.60) «A report: how to cut our AI spend. Nobody read it in the end.» ========
  // A doorstop of a report drops onto the desk (the desk buckles); an agent «reads» it and at once lays an equally fat summary next to it;
  // on «Nobody read it» cobwebs spin over both, a spider lets itself down, dust settles. No words on the covers: a pie chart with a slice cut.
  const RP = { thud: 82.30, summary: 83.60, nobody: 85.02 };
  function tome(x, y, w, h, col, age) {                                  // (x, y) = bottom centre; we look at the spine: a pie chart with a slice cut out
    const sq = age >= 0 && age < .3 ? .2 * Math.sin(age / .3 * Math.PI) : 0, d = 26;
    push(); translate(x, y); scale(1 + sq * .5, 1 - sq);
    paint([[-w / 2, -h], [w / 2, -h], [w / 2 + d, -h - d], [-w / 2 + d, -h - d]], { wash: PAL.cream, ink: INK, sw: .8 });            // page tops
    paint([[w / 2, 0], [w / 2, -h], [w / 2 + d, -h - d], [w / 2 + d, -d]], { wash: '#E6DCCB', ink: INK, sw: .8 });                   // page edges
    for (let i = 1; i < 8; i++) inkLine([[w / 2 + 3, -h * i / 8], [w / 2 + d - 3, -h * i / 8 - d + 3]], .4, '#B8AE9E', 'inkfine', 0);
    paint(rectPts(-w / 2, -h, w, h, 1), { wash: col, fill: mixCol(col, INK, .25), fillOp: 60, tex: .5, ink: INK, sw: 1.1 });       // the spine
    for (const yy of [-h + 14, -14]) inkLine([[-w / 2 + 10, yy], [w / 2 - 10, yy]], .8, mixCol(col, '#FFFFFF', .4), 'inkfine', 0);
    const r = h * .3;
    paint(ellPts(0, -h / 2, r, r, 22), { wash: PAL.cream, ink: INK, sw: .8 });
    paint([[0, -h / 2], [r, -h / 2], [r * .7, -h / 2 - r * .7]], { wash: col, ink: INK, sw: .6 });                                // the cut slice
    push(); translate(r * .45, -h / 2 - r * .25);
    paint([[r * .15, 0], [r * 1.15, 0], [r * .85, -r * .7]], { wash: TK.yellow, ink: INK, sw: .6 }); pop();                         // ...floating off
    pop();
  }
  function report(t) {
    back('#1C1F24');
    A03.hall(t, { lamps: [700, 1260], dark: .35 });
    const dy = 900, age = t - RP.thud, bow = age > 0 && age < .5 ? 26 * Math.sin(age / .5 * Math.PI) * Math.exp(-age * 3) : 0;
    // the desk
    paint([[520, dy], [1400, dy], [1400 - 14, dy + 40 + bow], [534, dy + 40 + bow]], { wash: '#7A4A2E', fill: '#4A2A1E', fillOp: 80, tex: .6, ink: INK, sw: 1.2 });
    for (const lx of [560, 1330]) paint(rectPts(lx, dy + 40, 30, 250), { wash: '#4A2A1E', ink: INK, sw: .8 });
    // tome 1 falls onto the desk on «report», tome 2 is slid in on «AI spend»
    const y1 = age < 0 ? lerp(-500, dy, easeIn(seg(t, RP.thud - .3, RP.thud))) : dy + bow * .5;
    if (t > RP.thud - .3) tome(780, y1, 380, 230, TK.ember, age);
    if (age >= 0 && age < 1) { rubble(780, dy + 10, 440, age * .8, 3); for (const x of [590, 970]) sparks(x, dy, age, x, 8, 120); }
    const s2 = t - RP.summary, x2 = lerp(1500, 1120, easeOut(clamp(s2 / .45)));
    if (s2 > 0) tome(x2, dy + bow * .5, 300, 220, PAL.teal, s2 - .45);
    // the agent who «read» it: flips the pages in a blur, then pats the summary proudly
    const read = t > RP.thud + .4 && t < RP.summary;
    agentBot(1340, dy - 6, 12, t, { n: 42, rot: NOTXT, eyes: read ? 'spark' : t > RP.nobody ? 'closed' : 'happy', mouth: read ? 'o' : 'grin', aL: read ? .9 + .6 * Math.abs(Math.sin(t * 30)) : .3, aR: s2 > 0 && s2 < 1 ? 1.3 : .3, noShadow: true });
    // «Nobody read it»: cobwebs spin over both tomes, a spider comes down on a thread, dust
    const web = eased(t, RP.nobody, RP.nobody + 1.6);
    if (web > 0) {
      for (const [cx, cy, R] of [[600, dy - 250, 150], [1290, dy - 240, 140], [960, dy - 440, 200]]) {
        for (let i = 0; i < 7; i++) { const a = Math.PI * (.1 + .8 * i / 6); inkLine([[cx, cy], [cx + Math.cos(a + Math.PI) * R * web, cy + Math.sin(a + Math.PI) * R * web * .9]], .8, '#E8ECEF', 'inkfine', 0); }
        for (let k = 1; k <= 4; k++) { const pts = []; for (let i = 0; i <= 6; i++) { const a = Math.PI * (1.1 + .8 * i / 6), rr = R * web * k / 4.4; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .9 + 6]); } inkLine(pts, .6, '#E8ECEF', 'inkfine', .6); }
      }
      const sy = lerp(-200, dy - 330, eased(t, RP.nobody + .3, RP.nobody + 1.8)) + 12 * Math.sin(t * 3);
      inkLine([[960, -300], [960, sy]], .7, '#E8ECEF', 'inkfine', 0);
      paint(ellPts(960, sy + 20, 26, 30, 12), { wash: TK.soot, ink: INK, sw: .8 });
      for (let i = 0; i < 4; i++) for (const d of [-1, 1]) inkLine([[960, sy + 8 + i * 5], [960 + d * 44, sy + i * 12], [960 + d * 54, sy + 18 + i * 12]], 1.6, INK, 'inkfine', .3);
      for (let i = 0; i < 20; i++) { const p = frac(t * .25 + hash(i)); paint(ellPts(560 + hash(i + 2) * 800, lerp(0, dy - 20, p), 3, 3, 6), { wash: '#D8CFC0', washOp: 170, ink: null }); }
    }
  }
  // the user preferred the old one: the a04 report shot (binder thuds, colleagues walk past, cobweb, spider, «READS: 0») on EN time.
  // RU «доклад» 80.58 ↔ EN «report» 82.30; after 84.3 its last 2.2 s are stretched over «Nobody read it in the end!» (to 87.60).
  const ruRep = t => t <= 84.3 ? t - 1.72 : 82.58 + (t - 84.3) * (84.75 - 82.58) / (87.60 - 84.3);
  scene('e13_report', 81.98, 87.60, t => a04_rep(ruRep(t), 0), [
    [81.98, 790, 560, 1180], [87.599, 1130, 520, 1180, 1],                // a slow pan: «READS: 0» + the binder → cobweb, spider, clock
  ]);

  // ======== E14 NEW (87.60–92.86) pre-chorus 2 = S1 again, word for word 47.42 s later: the server hall, the floor splits, the bull ========
  const RE = 47.42;
  scene('e14_bull2', 87.60, 92.86, t => s1(t - RE), [
    [87.60, 960, 600, 1000], [90.10, 960, 660, 900, 1], [91.10, 960, 600, 1080], [92.859, 960, 590, 1040, 1],
  ], [[43.68 + RE, 24]]);

  // ======== E19+E20 NEW (124.48–129.02) «Why?» — the choir turns its heads; «So intelligence gets cheaper»: the tag shrinks, the bill unrolls ========
  const WY = { why: 124.74, turn: 125.37, turned: 125.76, cheap: 126.88 };
  const CHOIR = [];                                                        // [x, y, row] in 3 risers, the asker in the front row
  for (const [row, y, n] of [[0, 990, 4], [1, 1080, 4]]) for (let i = 0; i < n; i++) CHOIR.push([960 + (i - (n - 1) / 2) * 200 + row * 40, y, row]);
  const ASK = CHOIR.length - 2;
  function why(t) {
    back('#1A1726');
    A06.nave(t, { choir: false, L: lerp(.8, .45, eased(t, WY.why, WY.why + .3)) });
    A06.pulpit(t, { eyes: t > WY.cheap ? 'happy' : 'narrow', mouth: 'smile', click: kick(t, EN_GRID, .15), aL: t > WY.cheap ? 1.2 : .4 });
    // the price tag in the CEO's raised hand: shrinks to a speck on «cheaper»
    const tag = 1 - eased(t, 127.9, 128.5) * .92;
    if (t > WY.cheap) {
      const tx = 1180, ty = 420;
      inkLine([[tx - 60, ty + 40], [tx, ty]], 1, INK, 'inkfine', 0);
      push(); translate(tx, ty); scale(tag); rotate(.15 + .05 * Math.sin(t * 5));
      paint([[-60, -40], [60, -40], [80, 0], [60, 40], [-60, 40]], { wash: '#FFF5E2', ink: INK, sw: 1.2 });
      paint(ellPts(55, 0, 8, 8, 8), { wash: '#1A1726', ink: INK, sw: .6 }); token(-10, 0, 26, {}); pop();
    }
    // the bill: rolls down from the vault, over the pulpit, piles up on the choir
    const bill = 0;                                                        // draft 4: no bill (text-heavy, the half-trillion punch comes later)
    if (bill > 0) {
      const x = 1240, w = 170, len = bill * 1350, top = 0;            // 3:4: the holder in frame, the strip inside the right edge
      paint(rectPts(x - 16, top - 30, w + 32, 34, 1), { wash: A2.rust, ink: INK, sw: .8 });
      paint(rectPts(x, top, w, Math.min(len, 1250), .5), { wash: '#FBF8F2', fill: '#E9E2D6', fillOp: 60, tex: .4, ink: INK, sw: .6 });
      for (let y = top + 40; y < top + Math.min(len, 1250) - 10; y += 30) inkLine([[x + 18, y], [x + w - 18 - hash(y) * 50, y]], .6, '#8A8480', 'inkfine', 0);
      if (len > 1100) for (let i = 0; i < 4; i++) paint(ellPts(x + 60 - i * 120, 1010 - i * 10, 90, 34, 14), { wash: '#FBF8F2', ink: INK, sw: .6 });
    }
    // the choir: eyes shut and singing → the asker's hand goes up on «Why?» → in the silence every head turns to him
    const [ax, ay] = CHOIR[ASK], turn = eased(t, WY.turn, WY.turned);
    CHOIR.forEach(([x, y, row], i) => {
      const me = i === ASK, dir = Math.sign(ax - x) || 0, k = t < WY.why ? kick(t, EN_GRID, .3) : 0;
      push(); translate(x, y); rotate(me ? 0 : dir * .14 * turn); translate(-x, -y);
      A06.angel(x, y, 11, t, {
        n: i + 3, k: me && t > WY.why ? .8 : k * .6, eyes: t < WY.why ? 'closed' : (me ? 'normal' : turn > .3 ? 'normal' : 'closed'),
        lookX: me ? 0 : dir * turn, lookY: me ? -.6 : 0, mouth: me ? (t > WY.why && t < WY.turn + .1 ? 'O' : 'o') : (t < WY.why ? 'smile' : turn > .5 ? 'flat' : 'smile'),
        aR: me && t > WY.why - .05 ? 1.8 : undefined, emote: me && t > WY.turned ? 'sweat' : null, emoteK: 1,
      });
      pop();
    });
    A06.beam(ax, ax, 40, 160, ay + 10, eased(t, WY.why, WY.why + .1) * (1 - eased(t, WY.cheap, WY.cheap + .5)));
  }
  scene('e19_why', 124.48, 129.02, why, [
    [124.48, 980, 600, 760], [126.6, 980, 590, 820, 1], [129.019, 975, 550, 1240, 1],   // a closer angle on the pulpit + asker (no same-set jump), eased pull-out to the a06 sermon framing
  ]);


  // ======== E23+E24 NEW (v1 137.00–152.04) «MORE GPUs — MORE TOKENS! … MORE TASKS — MORE TOKENS! The economy is WORKING!» ========
  // One continuous gag (draft-6 note): hamster-Clawd v4 (Codex poses ham4Run0..3) gallops in a big hamster wheel on the left; a drive belt
  // carries GPUs/tokens/agents/tasks (the noun just sung) from the axle to a flipchart MORE TOKENS on the right, where a revenue bar grows
  // with EVERY TURN of the wheel; the CEO beams under it. Each sung word he runs faster; on the last «tokens» his eyes spiral and the wheel
  // blurs. On «WORKING» the wheel over-spins, carries him up the rim and FLINGS him off-frame tumbling, and the top bar goes *pyn'k* off the board.
  // Drawn in REAL song time (s = O2N(t)): the words come from truth.js (enWord, v1 nears), so a re-timed track only needs a new truth.json.
  const wv1 = [['gpus', 137.38], ['tokens', 138.64], ['tokens', 139.94], ['agents', 141.34], ['agents', 142.62], ['tasks', 143.84], ['tasks', 145.14], ['tokens', 146.40]].map(([w, n]) => enWord(w, n));
  // v8 (PLAN_v8 #13): the wheel sits inside a huge WHEEL OF SAMSARA (radius RS): tokens → GPUs → tasks → agents → tokens ride round it; the whole
  // set is recomposed for the 3:4 view (x 200..1700, floor FLY), the flipchart + CEO stand at its lower right.
  // v16 (user: «the hamster is ugly — 3 versions where the tokens and agents appear in their own CELLS»): every sung «more» + noun drops its
  // item into a CELL of its own (no more loose sticker bomb). Variants (render.mjs --var=wheel:a|b|c → window.BTT_VAR.wheel, default a):
  //   a — the samsara band round the wheel is cut into 16 compartments; each item pops into the next one clockwise, the wheel fills up
  //   b — a vending / sorting rack beside the wheel, a column per kind (GPU, token, agent, task): items drop down a chute into their column
  //   c — a periodic-table board over the wheel, 16 tiles: each item rides up a feed tube from the wheel and lights its tile, in sung order
  const WV = ((window.BTT_VAR || {}).wheel || 'a').toLowerCase();          // the user picked a (final)
  const RG = { x: { a: 920, b: 610, c: 720 }[WV] ?? 920, y: { a: 760, b: 980, c: 1160 }[WV] ?? 760, R: 290, words: wv1.map(O2N), ix: [0, 1, 1, 2, 2, 3, 3, 1], eco: O2N(enWord('the', 148.56)), work: O2N(enWord('working', 149.60)), a: O2N(137.0) };
  const FC = [1250, 1180, 320, 470], NB = 12, FLY = 1800, RS = 540;          // flipchart x, y, w, h; bars on it; floor y; samsara radius
  // v20 (user: «not from zero — from the first frame he's already RUNNING at a moderate pace, then up to max before WORKING»): an ease-in
  // (cubic) ramp 0.55 → 1.8 rev/s; the gait changes per stage (trot → gallop → legs-wheel blur → cartoon feet-circle), see hamster()
  const RI = .55, R1 = .55, R2 = 1.8, RF = 7, W0 = RG.words[0], WD = RG.work - W0;
  const rateOf = s => s < W0 ? RI : s < RG.work ? R1 + (R2 - R1) * ((s - W0) / WD) ** 3 : RF;
  const spinOf = s => {                                                   // integrated wheel angle (real time), closed form of rateOf
    const p = Math.min(s, W0) - RG.a, u = clamp((s - W0) / WD);
    return TAU * (Math.max(0, p) * RI + (s > W0 ? WD * (R1 * u + (R2 - R1) * u ** 4 / 4) : 0) + Math.max(0, s - RG.work) * RF);
  };
  // v19 effect packs for the speed-up (--var=fx:a|b|c): a cartoon (speed lines, sweat, dust), b heat (the rim glows orange → white-hot, sparks,
  // smoke), c comic (smear ghosts, impact stars on footfalls, the stand rattles, whoosh arcs) — the user picked c. v20: c1|c2|c3 (default c1) =
  // the comic pack (v21: the user picked c2 → default) with a different YELLOW around the hamster: c1 rim trails + the rung under his feet flashes, c2 spark showers off his feet +
  // a starburst round the feet-circle, c3 crackling yellow lightning round him + orbit rings round the feet-circle
  const FXS = ((window.BTT_VAR || {}).fx || 'c2').toLowerCase(), FX = FXS[0], FV = FXS[1] || '1', effOf = rate => clamp((rate - .55) / 1.25);
  const TB = spinOf(RG.work) / TAU / NB;                                  // wheel turns per bar: the last bar tops out right on «WORKING»
  const nWords = s => RG.words.filter(w => s >= w).length;
  const gearPts = (x, y, r, n, a, h = 8) => { const p = []; for (let k = 0; k < n * 4; k++) { const th = a + k * TAU / (n * 4), rr = k % 4 < 2 ? r + h : r; p.push([x + Math.cos(th) * rr, y + Math.sin(th) * rr]); } return p; };
  const itemOf = (i, x, y, t, r) => i === 0 ? gpuCard(x, y, .14, t, { rot: r }) : i === 1 ? token(x, y, 14, { spin: r }) : i === 2 ? clawd(x, y + 14, 3.4, { col: '#6F8BE0', dk: '#3D55A8', lt: '#B5C6F0', noShadow: true, eyes: 'happy', mouth: 'grin', aL: 1.2, aR: 1.2, seed: 3 }) : (paint(rectPts(x - 13, y - 13, 26, 26), { wash: TK.yellow, ink: INK, sw: .7 }), [-6, 0, 6].forEach(d => inkLine([[x - 8, y + d], [x + 8, y + d]], .8, INK, 'inkfine', 0)));
  // hamster-Clawd v4 (draft 5, the user's pick from sandbox/hamster): side view, galloping right on all fours on the rim; th = rim angle
  // (π/2 = bottom), rate = wheel rev/s, n = words so far, wk = word kick, spin = dizzy 0..1, fly = {x, y, r} once flung (body centre, tumble)
  function hamster(th, t, rate, n, wk, spin, fly, rev = t * rate) {
    const BW = 440, g = PROP_ART.ham4Run0, BH = BW * g[1] / g[0], feetR = RG.R - 24;
    const e = fly ? 0 : effOf(rate), ph = 2 * t + 7 * rev, f = Math.floor(ph) % 4;
    // gait stages: k2 gallop (bigger bounds, stretch), k3 the legs blur into wheels, k4 the cartoon feet-circle (body up, leaning in)
    const k2 = seg(e, .15, .3), k3 = seg(e, .4, .52), k4 = seg(e, .66, .76), lift = -BH * .1 * k4;
    const bob = fly ? 0 : [0, 6, 2, -12][f] * (.6 + .4 * Math.min(rate, 1.4)) * (1 + 1.2 * k2) * (1 - .75 * k3) + lift, sq = [1, 1.04, 1, .97][f] * (1 + .05 * wk);
    push();
    if (fly) { translate(fly.x, fly.y); rotate(fly.r); translate(0, BH / 2); }
    else { translate(RG.x + Math.cos(th) * feetR, RG.y + Math.sin(th) * feetR); rotate(th - Math.PI / 2 + .06 * Math.min(rate, 1.5) + .08 * k2 + .1 * k4); }
    if (!fly && FX !== 'b') for (let q = 0; q < 2 + Math.round((FX === 'a' ? 7 : 3) * e); q++) { const v = frac(1.5 * t + rev + hash(q + 3)), z = 1 + (FX === 'a' ? 1.6 : .5) * e; paint(ellPts(-BW * .35 - v * 160 * z, -10 - hash(q) * 12 - v * 20 * z, (7 + v * 14) * z, (7 + v * 14) * z, 10), { wash: '#4A4F58', washOp: 200 * (1 - v), ink: null }); }   // dust behind
    if (!fly && FX === 'b') { for (let q = 0; q < Math.round(14 * e); q++) { const v = frac(2.4 * t + 1.5 * rev + hash(q + 60)), dx = -(80 + 260 * hash(q + 61)) * v, dy = -(60 + 220 * hash(q + 62)) * v + 380 * v * v;   // sparks off his feet
        inkLine([[BW * .1 * hash(q) + dx, dy], [BW * .1 * hash(q) + dx + 22 * (1 - v), dy - 8]], 3, v < .4 ? '#FFF6D0' : TK.orange, 'inkfine', 0); }
      if (e > .5) for (let q = 0; q < 6; q++) { const v = frac(.9 * t + hash(q + 70)), k = (e - .5) * 2; paint(ellPts(-BW * .3 - v * 220, -20 - v * 160, 18 + 40 * v, 16 + 34 * v, 12), { fill: '#5A5A5E', fillOp: 150 * k * (1 - v), ink: null }); } }   // smoke
    if (FX === 'a' && rate > .5) for (let q = 0; q < 3 + Math.round(4 * Math.min(1, rate - .5)); q++) { const y = -BH * (.2 + q * .15), x0 = -BW * .5 - hash(q + 7) * 30, m = Math.min(1, (rate - .5) / 1.1);
      inkLine([[x0 - 70 - 80 * m, y], [x0, y]], 4, '#F1E8D2', 'inkfine', 0); }                                        // speed lines
    const rimP = (phi, rr) => [Math.sin(phi) * rr, -feetR + Math.cos(phi) * rr];                         // a point on the rim in his frame
    if (FX === 'c' && !fly && FV === '1') {                                                              // c1: yellow trails along the rim behind him
      for (let q = 0; q < 3; q++) { const L = .2 + 1.1 * e, pts = []; for (let k = 0; k <= 12; k++) pts.push(rimP(-.06 - L * k / 12 - q * .03, feetR + 6 + q * 12)); inkLine(pts, 6 - q * 1.5, mixCol(TK.yellow, '#FFF6D0', q / 3), 'ink', 0); }
      const fl = 1 - frac(ph); if (fl > .4) { const a = rimP(.04, feetR), b = rimP(.04, feetR + 34); glowAt(a[0], a[1], 50 + 60 * e, TK.yellow, 160 * fl); inkLine([a, b], 9, TK.yellow, 'ink', 0); } }
    if (FX === 'c' && !fly && FV === '2') for (let q = 0; q < 3 + Math.round(18 * e); q++) {                  // c2: yellow spark showers off his feet
      const v = frac(2.6 * t + 1.2 * rev + hash(q + 60)), x0 = (hash(q + 63) - .4) * BW * .4, dx = -(60 + 300 * hash(q + 61)) * v, dy = -(80 + 260 * hash(q + 62)) * v + 420 * v * v;
      inkLine([[x0 + dx, dy], [x0 + dx + 26 * (1 - v), dy - 10 * (1 - v)]], 4, v < .3 ? '#FFF6D0' : TK.yellow, 'inkfine', 0); }
    if (FX === 'c' && rate > .4 && !fly) for (let gh = 4; gh >= 1; gh--) ENK.layer('ham4Run' + ((f - gh + 8) % 4), -gh * 30 * e, -BH / 2 + bob * .5, BW * (1 + .08 * e), { alpha: .3 * e / gh });   // the smear
    else if (rate > .8 || spin > 0) for (let gh = 2; gh >= 1; gh--) ENK.layer('ham4Run' + ((f - gh + 8) % 4), -gh * 16 * Math.min(rate, 2), -BH / 2 + bob * .5, BW, { alpha: .15 / gh + .15 * spin });
    if (FX === 'c' && !fly && f === 1 && e > .1) { const z = 30 + 70 * e; paint(starPts(BW * .32, -4, z, .45, 8), { wash: TK.yellow, ink: INK, sw: 1 }); paint(starPts(-BW * .2, -4, z * .7, .45, 8), { wash: '#FFFDF2', ink: INK, sw: 1 }); }   // impact stars on the footfall
    // composite p5.brush's deferred washes/strokes NOW (the flushLetters trick: a tiny off-screen watercolor fill), so the native p5 shapes
    // below land on top of the drum instead of under its late-composited wash
    const flushB = () => { brush.noStroke(); brush.noHatch(); brush.noWash(); brush.fill('#000000', 1); brush.fillBleed(0); brush.fillTexture(0, 0); brush.polygon([[-9000, -9000], [-8990, -9000], [-8990, -8990]]); brush.noFill(); };
    const gs = (1 + .08 * k2 * (f === 3)) * (1 + (((window.BTT_VAR || {}).legs || 'a') === 'c' ? .1 : 0) * Math.max(k3, k4));   // c: stretched forward                                                                 // gallop: the stretch at full extension
    if (!fly && k4 > 0 && FX === 'c' && FV === '2') { const rk = BH * .3 * (.55 + .45 * k4); flushB(); push(); noStroke(); fill(255, 214, 64);   // c2 starburst behind him
      beginShape(); for (const [px, py] of starPts(0, -rk * .4, rk * (1.05 + .15 * Math.sin(t * 40)) * k4, .55, 12)) vertex(px, py); endShape(CLOSE); pop(); }
    ENK.layer('ham4Run' + f, 0, -BH * sq / 2 + bob, BW, { sx: gs / sq, sy: sq / gs });
    // v22 legs at speed (user: «the balls replacing his legs are wrong» → classic cartoon fast-run), --var=legs:a|b|c (default a); LG = 0..1
    //   a — Road Runner: each leg pair whirls as a figure-8 blur (a translucent band + chasing ink strokes + smeared pink paws), dust puffs
    //   b — smear frames: the leg strip of his own last 3 run frames ghosted behind the current one, with motion lines
    //   c — scramble in place: each leg pair a spinning oval of many thin legs (Looney Tunes before takeoff), body stretched forward
    const LG = fly ? 0 : Math.max(k3, k4), LV = ((window.BTT_VAR || {}).legs || 'a').toLowerCase(), HIPS = [[-.2 * BW, -BH * .3], [.24 * BW, -BH * .3]];
    if (LG > 0) { flushB(); push(); strokeCap(ROUND);
      if (LV === 'b') { const img = ENK.art('ham4Run' + f), sy0 = img.height * .72, sh = img.height - sy0, dh = BH * sh / img.height;
        for (let gh = 3; gh >= 1; gh--) { const im = ENK.art('ham4Run' + ((f - gh + 8) % 4)); tint(255, 255 * LG * (.55 - .14 * gh)); imageMode(CORNER);
          image(im, -BW / 2 - gh * (22 + 26 * LG), -dh + bob * .3, BW, dh, 0, sy0, im.width, sh); }
        noTint(); stroke(241, 232, 210, 200 * LG); strokeWeight(4);
        for (let q = 0; q < 5; q++) { const y = -8 - q * 14 + bob * .3, x0 = -BW * (.32 + .08 * hash(q + 3)); line(x0 - 60 - 90 * LG, y, x0, y); } }
      else for (const [k, [hx, hy]] of HIPS.entries()) {
        const ph = t * TAU * (2.6 + 1.2 * LG) + k * 1.7, cx2 = hx + 6, cy2 = hy * .45 + bob * .3;                         // whirl centre between hip and floor
        if (LV === 'c') { const n = 9, rx = 58 + 14 * LG, ry = 40 + 8 * LG;                                            // the oval of many legs
          noStroke(); fill(226, 135, 92, 70 * LG); ellipse(cx2, cy2, 2 * rx + 30, 2 * ry + 26);
          for (let q = 0; q < n; q++) { const a = ph * 1.6 + q * TAU / n, px = cx2 + Math.cos(a) * rx, py = cy2 + Math.sin(a) * ry, al = 120 + 100 * hash(q + k * 9);
            stroke(226, 135, 92, al * LG); strokeWeight(13); line(cx2, cy2, px, py); noStroke(); fill(242, 167, 167, al * LG); ellipse(px, py, 14, 10); }
          stroke(34, 30, 38, 160 * LG); strokeWeight(2.5); noFill(); for (let q = 0; q < 3; q++) arc(cx2, cy2, 2 * rx + 18, 2 * ry + 16, ph * 1.6 + q * TAU / 3, ph * 1.6 + q * TAU / 3 + .9); }
        else { const lem = u => { const d = 1 + Math.sin(u) ** 2; return [cx2 + 62 * Math.cos(u) / d, cy2 + 44 * Math.sin(u) * Math.cos(u) / d]; };   // a: the figure-8
          noFill(); stroke(226, 135, 92, 175 * LG); strokeWeight(26); beginShape(); for (let u = 0; u <= TAU + .01; u += .2) vertex(...lem(u)); endShape();
          stroke(34, 30, 38, 230 * LG); strokeWeight(4);
          for (let q = 0; q < 2; q++) { beginShape(); for (let u = 0; u <= .9; u += .15) vertex(...lem(ph + q * Math.PI - u)); endShape(); }         // chasing strokes
          noStroke(); for (let q = 0; q < 2; q++) { for (let m = 0; m < 3; m++) { const [px, py] = lem(ph + q * Math.PI - m * .22); fill(242, 167, 167, (200 - 60 * m) * LG); ellipse(px, py, 16 - 3 * m, 11 - 2 * m); } } } }
      pop();
      if (LV === 'a') for (let q = 0; q < 4; q++) { const v = frac(2.2 * t + q / 4), z = (12 + 40 * v) * LG; paint(ellPts(-BW * .35 - 200 * v, -10 - 30 * v, z, z * .8, 12), { wash: '#8A8478', washOp: 200 * (1 - v), ink: null }); }   // dust puffs
    }
    if (FX === 'c' && !fly && FV === '3' && e > .05) for (let q = 0; q < 1 + Math.round(5 * e); q++) {     // c3: crackling yellow lightning round him
      const fr = Math.floor(t * 12), a = hash(q * 7 + fr) * Math.PI - Math.PI, r0 = BW * .38, pts = [];
      for (let k = 0; k < 6; k++) { const rr = r0 + k * (16 + 26 * e), j = (hash(q + k * 13 + fr) - .5) * .35; pts.push([Math.cos(a + j) * rr * 1.1, -BH * .5 + Math.sin(a + j) * rr * .8]); }
      inkLine(pts, 4, TK.yellow, 'ink', 0); }
    // v21 face through the ramp (user): determined → straining → wide-eyed panic → dizzy at max / in the air; native p5 so it sits over the art
    { const emo = fly || e > .86 ? 'dizzy' : e > .6 ? 'panic' : e > .3 ? 'strain' : 'det'; flushB(); push(); strokeCap(ROUND);
      for (const [k, dx] of [[0, .29], [1, .37]]) { const ex = dx * BW, ey = -BH * .66 + bob;
        if (emo === 'det') { stroke(34, 30, 38); strokeWeight(7); const d = k ? -1 : 1; line(ex - 15, ey - 24 + 6 * d, ex + 15, ey - 24 - 6 * d); }   // angry brows
        else if (emo === 'strain') { noStroke(); fill(226, 135, 92); ellipse(ex, ey, 34, 34); stroke(34, 30, 38); strokeWeight(5); noFill();
          const d = k ? -1 : 1; beginShape(); vertex(ex - 10 * d, ey - 10); vertex(ex + 8 * d, ey); vertex(ex - 10 * d, ey + 10); endShape(); }   // > <  squeezed shut
        else if (emo === 'panic') { stroke(34, 30, 38); strokeWeight(3); fill(255, 253, 242); ellipse(ex, ey, 36 + 4 * Math.sin(t * 30), 40); noStroke(); fill(34, 30, 38); ellipse(ex + 3 + 2 * Math.sin(t * 40 + k), ey + 2 * Math.cos(t * 37), 9, 9); }   // tiny jittering pupils
        else { stroke(34, 30, 38); strokeWeight(3); fill(255, 253, 242); ellipse(ex, ey, 36, 36); noFill(); strokeWeight(2.5); beginShape(); for (let s2 = 0; s2 <= 22; s2++) { const a = s2 * .55 + t * 16 * (k ? -1 : 1), r = s2 * .7; vertex(ex + Math.cos(a) * r, ey + Math.sin(a) * r); } endShape(); }
      } pop(); }
    for (let q = 0; q < (FX === 'a' ? 1 + Math.round(8 * e) : FX === 'c' ? 1 : 0); q++) { const d = q % 2 ? 1 : -1, u = frac(1.2 * t + .8 * rev + hash(q + 20)), x = BW * .2 + d * (20 + u * 90) - 40 * u, y = -BH * .95 - 70 * u + 170 * u * u;   // sweat
      paint([[x, y - 12], [x + 7, y + 2], [x, y + 8], [x - 7, y + 2]], { wash: '#BFE3F7', washOp: 255 * (1 - u * u), ink: INK, sw: .6 }); }
    for (let q = 0; q < Math.min(8, n + (spin > 0 ? 4 : 0)); q++) { const per = .9 + hash(q) * .5, v = frac((t + hash(q + 50) * per) / per);   // tokens squeezed out of his cheeks, flung back
      token(BW * .36 - v * (260 + hash(q + 2) * 200), -BH * .62 - (520 * v - 260 * v * v) * (.7 + hash(q + 9) * .5), 15, { spin: t * 8 + q }); }
    pop();
  }
  // the flipchart MORE TOKENS on an easel (v15, user: «the bars must GROW with every MORE TOKENS / MORE TASKS, fun»): one bar per sung noun
  // shoots up out of the axis (overshoot), sparks off its top, the board jolts; the bars keep pumping with the wheel; on «WORKING» the top
  // one pops off the board
  const BARS = 8, BAR_H = k => 46 * Math.pow(1.33, k);
  function flipchart(s, turns, wk) {
    const [X, Y, Wd, Hd] = FC, a = s - RG.work - .06, popped = a >= 0, base = Y + Hd - 40;
    const jolt = Math.max(0, ...RG.words.map(w => { const d = s - w; return d > 0 && d < .6 ? Math.exp(-d * 7) * Math.sin(d * 40) : 0; }));
    inkLine([[X + 70, Y + Hd], [X + 10, FLY + 4]], 9, '#6A4A30', 'ink', 0); inkLine([[X + Wd - 70, Y + Hd], [X + Wd - 10, FLY + 4]], 9, '#6A4A30', 'ink', 0);
    inkLine([[X + Wd / 2, Y + Hd], [X + Wd / 2 + 40, FLY + 4]], 7, '#5A3C26', 'ink', 0);
    push(); translate(X + Wd / 2, Y + Hd); rotate(.035 * jolt); translate(-(X + Wd / 2), -(Y + Hd) - 10 * Math.abs(jolt));
    paint(rrPts(X - 14, Y - 14, Wd + 28, Hd + 28, 10), { wash: '#5A5F6A', ink: INK, sw: 1.2 });
    paint(rectPts(X, Y, Wd, Hd, 1), { wash: '#FBF8F1', ink: null });
    paint(rectPts(X, Y, Wd, 64), { wash: '#2FBF71', ink: null });
    letter('MORE TOKENS', X + Wd / 2, Y + 34, 40, '#FBF8F1', { ink: false });
    inkLine([[X + 30, Y + 90], [X + 30, base], [X + Wd - 16, base]], 2.4, INK, 'ink', 0);
    const tops = [], pump = 1 + .04 * Math.sin(turns * TAU) + .08 * wk;
    for (let k = 0; k < BARS; k++) {
      const age = s - RG.words[k]; if (age < 0) break;
      const x = X + 46 + k * 33, hh = BAR_H(k) * backOut(clamp(age / .35)) * pump;
      tops.push([x + 13, base - hh - 12]);
      if (age < .5) sparks(x + 13, base - hh, age, k + 40, 10, 150);
      if (k === BARS - 1 && popped) continue;
      paint(rectPts(x, base - hh, 26, hh, 1), { wash: k % 2 ? '#2FBF71' : '#3FD584', fill: '#1E8A50', fillOp: 60, tex: .4, ink: INK, sw: .9 });
    }
    if (tops.length > 1) inkLine(popped ? tops.slice(0, -1) : tops, 4, '#E0302A', 'ink', 0);
    if (tops.length) { const [tx, ty] = tops[popped ? Math.max(0, tops.length - 2) : tops.length - 1];   // the arrow head riding the trend line
      paint([[tx - 14, ty + 4], [tx + 16, ty - 16], [tx + 6, ty + 14]], { wash: '#E0302A', ink: INK, sw: .8 }); }
    pop();
    if (popped) {                                                         // *pyn'k*: the top bar shoots straight up off the board and out of frame
      const x = X + 46 + (BARS - 1) * 33 + 13, hh = BAR_H(BARS - 1), fy = base - hh / 2 - 700 * a - 1600 * a * a;
      paint(ellPts(x, base, 20, 6, 10), { wash: '#3A3A3A', ink: null });
      push(); translate(x + 40 * a, fy); rotate(a * 1.6);
      paint(rectPts(-13, -hh / 2, 26, hh, 1), { wash: '#2FBF71', fill: '#1E8A50', fillOp: 60, tex: .4, ink: INK, sw: .9 });
      pop();
      for (let k = 0; k < 3; k++) inkLine([[x - 8 + k * 8 + 40 * a, fy + hh / 2 + 24], [x - 8 + k * 8 + 40 * a, fy + hh / 2 + 110 + 40 * k]], 2, '#8A8480', 'inkfine', 0);
      if (a < .4) paint(starPts(x, base - hh, 110 * a / .4 + 40, .4, 10), { wash: '#FFE04A', washOp: 255 * (1 - a / .4), ink: INK, sw: 1.2 });
    }
  }
  // v15 (user: «more stickers, like the first version»): a sticker bomb — every sung «more» and noun slaps a die-cut sticker
  // onto the hall around the wheel (pop + wobble); they pile up and stay. No words on them (pictures, not text).
  const MORES = EN_WORDS.filter(([t, w]) => t > 136.9 && t < 147.2 && /^more$/i.test(w.replace(/[^a-z]/gi, ''))).map(([t]) => O2N(t));
  // every «more» slaps the noun it heralds, every sung noun slaps itself: 16 stickers by the last «tokens»
  const SLAPS = [...MORES.map(m => { const nx = RG.words.find(w => w > m - .05); return [m, nx == null ? 1 : RG.ix[RG.words.indexOf(nx)]]; }),
    ...RG.words.map((w, i) => [w, RG.ix[i]])].sort((p, q) => p[0] - q[0]);
  const SLOTS = [[420, 250], [1480, 260], [400, 660], [1530, 560], [450, 1470], [1080, 1540], [680, 1690], [410, 1060], [1170, 140], [700, 130], [800, 1460], [440, 1760], [1560, 930], [930, 1740], [560, 1240], [640, 1560]];
  function stickers(s) {
    SLAPS.forEach(([m, ty], i) => {
      const age = s - m; if (age < 0 || i >= SLOTS.length) return;
      const [x, y] = SLOTS[i], k = backOut(clamp(age / .22)) * (1 + .06 * Math.exp(-age * 5) * Math.sin(age * 30)), r = (hash(i + 7) - .5) * .5;
      push(); translate(x, y); rotate(r); scale(1.45 * k);
      paint(rrPts(-74, -66, 160, 144, 34), { wash: '#000000', washOp: 70, ink: null });                       // drop shadow
      paint(rrPts(-82, -76, 160, 144, 34), { wash: '#FFFFFF', ink: INK, sw: 1.4 });                            // the die-cut white border
      paint(rrPts(-70, -64, 136, 120, 26), { wash: ['#BDF2D2', '#FFE9A8', '#C9D6FF', '#FFD2B0'][ty], ink: null });
      if (ty === 2) clawd(-2, 34, 9, { col: '#6F8BE0', dk: '#3D55A8', lt: '#B5C6F0', noShadow: true, eyes: 'happy', mouth: 'grin', aL: 1.3, aR: 1.3, seed: i });
      else bigItem(ty, -2, ty === 3 ? -4 : 0, ty === 0 ? 2.6 : 3.4, s, .1);
      pop();
    });
  }
  // the WHEEL OF SAMSARA round the hamster wheel: a huge band turning clockwise with the wheel; 4 fixed stations in the sung order, clockwise
  // from the top (v14): GPU → token → agent → task — whatever rides past a station turns into the next thing; a station flares on its sung noun
  const ST = [[-Math.PI / 2, 0, '#2FBF71'], [0, 1, TK.yellow], [Math.PI / 2, 2, '#6F8BE0'], [Math.PI, 3, TK.orange]];   // [angle, itemOf type, glow]
  const SECT = ['#1F5A3A', '#6A4E1A', '#2A3A72', '#6A3A1A'], STR = 124;                                         // band tint after each station; station radius
  const ST_W = ST.map(([, ty]) => RG.words.filter((w, i) => RG.ix[i] === ty));
  const bigItem = (ty, x, y, k, s, r) => { push(); translate(x, y); scale(k); itemOf(ty, 0, ty === 2 ? -16 : 0, s, r); pop(); };
  function samsara(s, ang, wk) {
    const cx = RG.x, cy = RG.y, ra = ang * .08, NQ = 72, R0 = RS - 62, R1 = RS + 62;
    for (let j = 0; j < 8; j++) { const a = ra + j * TAU / 8;                                                     // spokes to the hamster wheel
      inkLine([[cx + Math.cos(a) * (RG.R + 30), cy + Math.sin(a) * (RG.R + 30)], [cx + Math.cos(a) * R0, cy + Math.sin(a) * R0]], 7, '#7A5A34', 'ink', 0); }
    for (let q = 0; q < NQ; q++) {                                                                                // the band, tinted per sector
      const a0 = q * TAU / NQ - Math.PI / 2, a1 = a0 + TAU / NQ + .004, k = Math.floor(q / (NQ / 4)), c = mixCol(SECT[k], '#241E2A', .25 + .1 * (q % 2));
      paint([[cx + Math.cos(a0) * R0, cy + Math.sin(a0) * R0], [cx + Math.cos(a0) * R1, cy + Math.sin(a0) * R1], [cx + Math.cos(a1) * R1, cy + Math.sin(a1) * R1], [cx + Math.cos(a1) * R0, cy + Math.sin(a1) * R0]], { wash: c, ink: null });
    }
    for (const r of [R0, R1, R1 + 10]) paint(ellPts(cx, cy, r, r, 120), { ink: '#C9A24A', sw: r > R1 ? 1.6 : 2.6 });
    for (let j = 0; j < 16; j++) { const a = ra * 1.5 + j * TAU / 16, rr = RS + 40, d = .035;                      // clockwise chevrons on the outer lane
      const p = (ad, r2) => [cx + Math.cos(a + ad) * r2, cy + Math.sin(a + ad) * r2];
      inkLine([p(-d, rr - 12), p(d, rr), p(-d, rr + 12)], 3, '#E8C870', 'inkfine', 0); }
    for (let j = 0; j < 16; j++) {                                                                                 // the riders: morph at each station
      const a = ra + j * TAU / 16, u = ((a + Math.PI / 2) % TAU + TAU) % TAU, k = Math.floor(u / (Math.PI / 2)), near = Math.min(u % (Math.PI / 2), Math.PI / 2 - u % (Math.PI / 2));
      const x = cx + Math.cos(a) * (RS - 14), y = cy + Math.sin(a) * (RS - 14);
      bigItem(ST[k][1], x, y, 2.7 * (1 + .12 * wk), s, ST[k][1] === 1 ? .1 * Math.sin(s * 4 + j) : a * .5 + j);
      if (near < .09) paint(starPts(x, y, 46 * (1 - near / .09) + 10, .35, 8), { wash: '#FFF3B0', washOp: 200 * (1 - near / .09), ink: null });
    }
  }
  function stations(s) {                                                                                         // drawn over the wheel stand
    const cx = RG.x, cy = RG.y;
    ST.forEach(([a, ty, gc], i) => {                                                                                // the stations
      const x = cx + Math.cos(a) * RS, y = cy + Math.sin(a) * RS, lit = kick(s, ST_W[i], .7), been = ST_W[i].length && s >= ST_W[i][0], k = 1 + .3 * lit;
      if (lit > .02) glowAt(x, y, 300 * lit, gc, 170 * lit);
      paint(ellPts(x, y, STR * k, STR * k, 40), { wash: '#1C1A22', fill: gc, fillOp: been ? 60 + 120 * lit : 0, tex: .3, ink: been ? '#FFE08A' : '#8A7A50', sw: been ? 4 : 2 });
      if (ty === 2) clawd(x, y + 62 * k, 15 * k, { col: '#6F8BE0', dk: '#3D55A8', lt: '#B5C6F0', noShadow: true, eyes: 'happy', mouth: 'grin', aL: 1.2 + .3 * lit, aR: 1.2 + .3 * lit, seed: 3 });   // v15: a clean symmetric agent (the scaled mini read crooked)
      else bigItem(ty, x, y + (ty === 3 ? 0 : 5), 4.7 * k, s, .1 * Math.sin(s * 3));
      if (!been) paint(ellPts(x, y, STR, STR, 40), { wash: '#1C1A22', washOp: 150, ink: null });
    });
  }
  // ---- v16 cells ----
  const TYC = ['#2FBF71', TK.yellow, '#6F8BE0', TK.orange], TYL = ['#BDF2D2', '#FFE9A8', '#C9D6FF', '#FFD2B0'];   // per kind: glow, cell tint
  const cellItem = (ty, x, y, k, s) => ty === 2 ? clawd(x, y + 14 * k, 3.3 * k, { col: '#6F8BE0', dk: '#3D55A8', lt: '#B5C6F0', noShadow: true, eyes: 'happy', mouth: 'grin', aL: 1.2, aR: 1.2, seed: 3 })
    : bigItem(ty, x, y, ty === 0 ? k * 1.1 : k, s, .1 * Math.sin(s * 3));
  const CELLS = SLAPS.slice(0, 16);                                                                     // [word time, kind], in sung order
  const popK = age => age < 0 ? 0 : backOut(clamp(age / .2)) * (1 + .08 * Math.exp(-age * 6) * Math.sin(age * 32));
  const flare = (x, y, age, col) => { if (age >= 0 && age < .35) { glowAt(x, y, 160, col, 200 * (1 - age / .35)); paint(starPts(x, y, 30 + 160 * age, .4, 10), { wash: '#FFF3B0', washOp: 230 * (1 - age / .35), ink: null }); } };
  function cellsWheel(s, ang) {                                                                         // a: the samsara band as 16 compartments
    const cx = RG.x, cy = RG.y, ra = ang * .06, R0 = RS - 70, R1 = RS + 70, N = 16;
    for (let j = 0; j < 8; j++) { const a = ra + j * TAU / 8;
      inkLine([[cx + Math.cos(a) * (RG.R + 30), cy + Math.sin(a) * (RG.R + 30)], [cx + Math.cos(a) * R0, cy + Math.sin(a) * R0]], 7, '#7A5A34', 'ink', 0); }
    const P = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    for (let j = 0; j < N; j++) {
      const a0 = ra - Math.PI / 2 + j * TAU / N, a1 = a0 + TAU / N, am = (a0 + a1) / 2, [w, ty] = CELLS[j] || [1e9, 0], age = s - w;
      const arc = (r, b0, b1) => Array.from({ length: 7 }, (_, q) => P(lerp(b0, b1, q / 6), r));
      const pts = [...arc(R1, a0, a1), ...arc(R0, a1, a0)];
      const ch = age >= 0 ? Math.max(0, 1 - frac(ang / TAU * .8 - j / N) / .14) : 0;               // v18 chase light, speeds up with the wheel
      paint(pts, { wash: age >= 0 ? mixCol(mixCol(TYL[ty], '#241E2A', .35 - .25 * kick(s, [w], .5)), '#FFF6D0', .55 * ch) : '#1C1A22', ink: ch > .3 ? '#FFE04A' : '#C9A24A', sw: 3 });
      const inner = [...arc(R1 - 12, a0 + .02, a1 - .02), ...arc(R0 + 12, a1 - .02, a0 + .02)];
      paint(inner, { wash: '#000000', washOp: age >= 0 ? 0 : 60, ink: '#8A7A50', sw: 1 });
      if (age >= 0) { const [x, y] = P(am, RS); cellItem(ty, x, y, 3.0 * popK(age), s); flare(x, y, age, TYC[ty]); }
    }
    for (const r of [R0 - 6, R1 + 6]) paint(ellPts(cx, cy, r, r, 120), { ink: '#C9A24A', sw: 2.2 });
  }
  // b: the sorting rack — a column per kind, items drop down the chute into the next free slot of their column (bottom up)
  const RK = { x: 1020, y: 230, cw: 140, ch: 118, rows: 6 };
  const RKSLOT = CELLS.map(([w, ty], i) => [w, ty, CELLS.slice(0, i).filter(c => c[1] === ty).length]);
  function rack(s) {
    const { x, y, cw, ch, rows } = RK, Wr = cw * 4, Hr = ch * rows, cx = RG.x;
    inkLine([[cx, RG.y - RG.R - 40], [cx, 130], [x + Wr / 2, 130], [x + Wr / 2, y - 80]], 26, INK, 'ink', 0);    // the chute from the wheel
    inkLine([[cx, RG.y - RG.R - 40], [cx, 130], [x + Wr / 2, 130], [x + Wr / 2, y - 80]], 18, A2.steel, 'ink', 0);
    paint(rrPts(x - 24, y - 96, Wr + 48, Hr + 130, 16), { wash: '#C0392B', fill: '#8E2A20', fillOp: 70, tex: .4, ink: INK, sw: 1.6 });   // the cabinet
    for (let c = 0; c < 4; c++) {                                                                                  // the column headers: pictures
      paint(rrPts(x + c * cw + 8, y - 84, cw - 16, 66, 10), { wash: TYC[c], ink: INK, sw: 1 });
      cellItem(c, x + c * cw + cw / 2, y - 50, 1.6, s);
      for (let r = 0; r < rows; r++) {
        const sx = x + c * cw, sy = y + (rows - 1 - r) * ch;
        paint(rectPts(sx + 6, sy + 6, cw - 12, ch - 12, 1), { wash: '#1C1F26', fill: '#2A303A', fillOp: 60, ink: INK, sw: 1 });
        for (let q = 0; q < 4; q++) inkLine([[sx + 20 + q * 30, sy + ch - 16], [sx + 32 + q * 30, sy + ch - 26]], 2, '#8A8F96', 'inkfine', 0);   // the coil
      }
    }
    RKSLOT.forEach(([w, ty, r]) => {
      const age = s - w, x0 = x + ty * cw + cw / 2, y1 = y + (RK.rows - 1 - Math.min(r, RK.rows - 1)) * ch + ch / 2 - 4; if (age < -.22) return;
      const yy = age < 0 ? lerp(y - 70, y1, easeIn(1 + age / .22)) : y1, sq = age >= 0 ? Math.exp(-age * 9) * Math.sin(age * 40) * .25 : 0;
      push(); translate(x0, yy); scale(1 + sq, 1 - sq); cellItem(ty, 0, 0, 2.3, s); pop();
      flare(x0, y1, age, TYC[ty]);
    });
    for (let c = 0; c <= 4; c++) inkLine([[x + c * cw, y], [x + c * cw, y + Hr]], 3, '#5A1A12', 'ink', 0);
    paint(rectPts(x - 6, y, Wr + 12, Hr, 1), { wash: '#BFE8FF', washOp: 22, ink: INK, sw: 1.4 });                 // the glass front
  }
  // c: the periodic table — 8 x 2 tiles over the wheel, each item rides up the feed tube and lights its tile in sung order
  const PT = { x: 262, y: 190, cw: 168, ch: 196 };
  function ptable(s) {
    const { x, y, cw, ch } = PT, cx = RG.x, ty0 = RG.y - RG.R - 30, tubeTop = y + 2 * ch + 20;
    inkLine([[cx, ty0], [cx, tubeTop]], 34, INK, 'ink', 0); inkLine([[cx, ty0], [cx, tubeTop]], 24, '#3A3F48', 'ink', 0);
    paint(rrPts(x - 26, y - 26, cw * 8 + 52, ch * 2 + 52, 14), { wash: '#2A2D36', fill: '#1E2027', fillOp: 80, tex: .4, ink: INK, sw: 1.6 });
    CELLS.forEach(([w, ty], i) => {
      const c = i % 8, r = Math.floor(i / 8), tx = x + c * cw, ty2 = y + r * ch, age = s - w, mx = tx + cw / 2, my = ty2 + ch / 2;
      const on = age >= 0, k = on ? 1 + .12 * kick(s, [w], .25) : 1;
      push(); translate(mx, my); scale(k);
      paint(rrPts(-cw / 2 + 8, -ch / 2 + 8, cw - 16, ch - 16, 8), { wash: on ? TYL[ty] : '#2E323C', ink: on ? INK : '#4A4F5A', sw: on ? 1.6 : 1 });
      if (on) { paint(rectPts(-cw / 2 + 8, -ch / 2 + 8, cw - 16, 26), { wash: TYC[ty], ink: null });
        for (let q = 0; q <= i % 4; q++) paint(ellPts(-cw / 2 + 24 + q * 14, -ch / 2 + 21, 4, 4, 8), { wash: INK, ink: null });   // the «number» (dots)
        cellItem(ty, 0, 14, 2.6 * popK(age), s); }
      pop();
      if (on) flare(mx, my, age, TYC[ty]);
      if (age > -.32 && age < 0) {                                                                                  // riding up the tube, then across to its tile
        const u = 1 + age / .32, px = u < .6 ? cx : lerp(cx, mx, (u - .6) / .4), py = u < .6 ? lerp(ty0, tubeTop, u / .6) : lerp(tubeTop, my, (u - .6) / .4);
        cellItem(ty, px, py, 1.6, s);
      }
    });
  }
  // ---- v17 the chart + staging (user: «wheel A is great; now the flipchart and the timeline, 3 versions»): --var=chart:a|b|c, default a
  //   a — the flipchart grows a bar per FILLED CELL (a spark flies from the cell to its bar, the bar takes the cell's colour); on «WORKING»
  //       the trend line rockets off the top of the board
  //   b — the board becomes a TIMELINE strip under the wheel: quarters tick by on every beat, each filled cell stacks a bar at «now» that
  //       then scrolls away into the past; the CEO points along it; on «WORKING» the timeline whips forward and the newest bar shoots up
  //   c — a big LED stock ticker: the wheel's belt winds a rope that literally hauls the graph up, the CEO pumps a lever on every word,
  //       item icons scroll in the ticker row; on «WORKING» the needle bursts through the top and the whole board flashes
  const CV = ((window.BTT_VAR || {}).chart || 'a').toLowerCase();
  const CELLW = CELLS.map(c => c[0]), cellPos = (j, ang) => { const a = ang * .06 - Math.PI / 2 + (j + .5) * TAU / 16; return [RG.x + Math.cos(a) * RS, RG.y + Math.sin(a) * RS]; };
  const BT = EN_BEATS.map(O2N).filter(b => b > RG.a - 1 && b < RG.work + 3);
  const belt = (cx, cy, P2, ang, pr = 30) => { const dx = P2[0] - cx, dy = P2[1] - cy, L = Math.hypot(dx, dy), nx = -dy / L * pr, ny = dx / L * pr;
    for (const k of [-1, 1]) inkLine([[cx + k * nx, cy + k * ny], [P2[0] + k * nx, P2[1] + k * ny]], 3, '#2A2A2A', 'ink', 0);
    paint(gearPts(P2[0], P2[1], pr + 4, 8, -ang * 2.5, 9), { wash: TK.yellow, ink: INK, sw: 1.2 }); };
  const ceo = (x, s, wa, o = {}) => ceoClawd(x, FLY - 4, 22, { noShadow: true, flip: true, eyes: wa >= 0 ? 'spark' : 'happy', mouth: wa >= 0 ? 'O' : 'grin', aL: 1.5, aR: wa >= 0 ? 1.8 : .9, click: kick(s, [RG.eco, RG.work], .2), ...o });
  const spark = (from, to, u, col) => { if (u <= 0 || u >= 1) return; const x = lerp(from[0], to[0], u), y = lerp(from[1], to[1], u) - Math.sin(u * Math.PI) * 120;
    glowAt(x, y, 50, col, 200); paint(ellPts(x, y, 9, 9, 10), { wash: '#FFF6D0', ink: null }); };
  // a: 16 bars, one per filled cell, in the cell's colour
  // v21 «IS WORKING» on the flipchart, --var=working:a|b|c (default a): a the trend line rockets off the board; b the pages flip wildly and the
  // last page has a giant green arrow that rips up through the paper; c the whole board launches like a rocket, the CEO cheers, token confetti
  function chartA(s, ang, wk, wa) {
    const WKV = ((window.BTT_VAR || {}).working || 'c').toLowerCase();   // v22: the user picked c
    const [X, Y, Wd, Hd] = FC, a = wa - .06, popped = a >= 0, lift = WKV === 'c' && popped ? 260 * a + 2600 * a * a : 0, base = Y + Hd - 40, BW = 15, BS = 17.2, H = k => 22 * Math.pow(1.2, k), FLT = .25;
    belt(RG.x, RG.y, [X - 34, Y + 300], ang);
    paint(rrPts(X - 84, Y + 328, 100, 60, 8), { wash: A2.gunmetal, ink: INK, sw: 1.2 });
    const jolt = Math.max(0, ...CELLW.map(w => { const d = s - w - FLT; return d > 0 && d < .6 ? Math.exp(-d * 7) * Math.sin(d * 40) : 0; }));
    inkLine([[X + 70, Y + Hd], [X + 10, FLY + 4]], 9, '#6A4A30', 'ink', 0); inkLine([[X + Wd - 70, Y + Hd], [X + Wd - 10, FLY + 4]], 9, '#6A4A30', 'ink', 0);
    if (lift > 0) for (let q = 0; q < 9; q++) { const v = frac(s * 3 + hash(q + 30)), bx = X + Wd / 2 + (hash(q + 31) - .5) * 120;   // c: the launch exhaust
      paint(ellPts(bx + (hash(q) - .5) * 60 * v, Y + Hd + 30 - lift + 260 * v, 30 + 70 * v, 26 + 60 * v, 12), { wash: v < .25 ? TK.yellow : v < .5 ? TK.orange : '#8A8580', washOp: 230 * (1 - v), ink: null }); }
    push(); translate(X + Wd / 2, Y + Hd); rotate(.035 * jolt + (lift > 0 ? .05 * Math.sin(s * 30) * Math.min(1, a * 4) : 0)); translate(-(X + Wd / 2), -(Y + Hd) - 10 * Math.abs(jolt) - lift);
    paint(rrPts(X - 14, Y - 14, Wd + 28, Hd + 28, 10), { wash: '#5A5F6A', ink: INK, sw: 1.2 });
    paint(rectPts(X, Y, Wd, Hd, 1), { wash: '#FBF8F1', ink: null });
    paint(rectPts(X, Y, Wd, 64), { wash: '#2FBF71', ink: null });
    letter('MORE TOKENS', X + Wd / 2, Y + 34 - lift, 40, '#FBF8F1', { ink: false });
    inkLine([[X + 22, Y + 90], [X + 22, base], [X + Wd - 10, base]], 2.4, INK, 'ink', 0);
    const tops = [], pump = 1 + .04 * Math.sin(ang) + .06 * wk;
    CELLS.forEach(([w, ty], k) => { const age = s - w - FLT; if (age < 0) return;
      const x = X + 30 + k * BS, hh = H(k) * backOut(clamp(age / .3)) * pump; tops.push([x + BW / 2, base - hh - 10]);
      if (age < .4) sparks(x + BW / 2, base - hh, age, k + 40, 8, 120);
      paint(rectPts(x, base - hh, BW, hh, 1), { wash: TYC[ty], fill: mixCol(TYC[ty], INK, .3), fillOp: 60, tex: .4, ink: INK, sw: .8 }); });
    if (tops.length > 1) inkLine(tops, 4, '#E0302A', 'ink', 0);
    if (tops.length && (!popped || WKV === 'c')) { const [tx, ty] = tops[tops.length - 1]; paint([[tx - 14, ty + 4], [tx + 16, ty - 16], [tx + 6, ty + 14]], { wash: '#E0302A', ink: INK, sw: .8 }); }
    if (WKV === 'b' && popped) {                                                          // b: the pages flip wildly, then the arrow rips through
      const PY = Y + 64, PH = Hd - 64, FLP = .07, nF = Math.min(6, Math.floor(a / FLP));
      paint(rectPts(X, PY, Wd, PH, 1), { wash: nF % 2 ? '#F3EDE0' : '#FBF8F1', ink: null });                            // the page underneath
      if (a < 6 * FLP) { const p = frac(a / FLP), c = Math.cos(p * Math.PI), h = PH * Math.abs(c);                     // the page in flight over the top
        paint(rectPts(X, c > 0 ? PY : PY - h, Wd, Math.max(2, h), 1), { wash: nF % 2 ? '#FBF8F1' : '#EDE6D6', ink: INK, sw: .8 });
        for (let q = 0; q < 4; q++) { const yy = c > 0 ? PY + h * (.2 + q * .18) : PY - h * (.2 + q * .18); inkLine([[X + 30, yy], [X + Wd - 40 - 30 * hash(q + nF), yy]], 1.2, '#B8B0A0', 'inkfine', 0); } }
      else { const g = a - 6 * FLP, tipY = base - 60 - 900 * g - 3000 * g * g, AW = 90;                                  // the giant green arrow
        paint([[X + Wd / 2 - AW * .45, base], [X + Wd / 2 - AW * .45, tipY + AW], [X + Wd / 2 - AW, tipY + AW], [X + Wd / 2, tipY], [X + Wd / 2 + AW, tipY + AW], [X + Wd / 2 + AW * .45, tipY + AW], [X + Wd / 2 + AW * .45, base]], { wash: '#2FBF71', ink: INK, sw: 1.6 });
        if (tipY < PY) for (let q = 0; q < 7; q++) { const v = Math.min(1, (PY - tipY) / 500), sx = X + Wd / 2 + (q - 3) * 30, sy = PY - v * (40 + 160 * hash(q + 7)), r0 = (hash(q + 8) - .5) * 4 * v;   // torn paper shards
          push(); translate(sx + (q - 3) * 40 * v, sy); rotate(r0); paint([[-16, 0], [14, -6], [4, 18]], { wash: '#FBF8F1', ink: INK, sw: .8 }); pop(); } } }
    pop();
    CELLS.forEach(([w], k) => spark(cellPos(k, ang), [X + 30 + k * BS + BW / 2, base - 40], (s - w) / FLT, TYC[CELLS[k][1]]));   // cell → bar
    if (WKV === 'c' && popped) for (let q = 0; q < 18; q++) { const v = Math.min(1.4, a * (1.2 + hash(q + 50))), an = -Math.PI / 2 + (hash(q + 51) - .5) * 2.6, sp = 500 + 500 * hash(q + 52);   // c: token confetti
      token(X + Wd / 2 + Math.cos(an) * sp * v, Y + 200 + Math.sin(an) * sp * v + 900 * v * v, 13, { spin: s * 9 + q }); }
    if (WKV === 'a' && popped && tops.length) {                                           // a: the trend line rockets off the top
      const [tx, ty] = tops[tops.length - 1], ry = ty - 900 * a - 2600 * a * a, rx = tx + 120 * a;
      inkLine([[tx, ty], [lerp(tx, rx, .5), lerp(ty, ry, .5) + 30], [rx, ry]], 6, '#E0302A', 'ink', .4);
      push(); translate(rx, ry); rotate(-.6 - .2 * a); paint([[-22, 18], [0, -34], [22, 18], [0, 8]], { wash: '#E0302A', ink: INK, sw: 1.2 }); pop();
      for (let q = 0; q < 6; q++) { const u = q / 6, px = lerp(tx, rx, u) + Math.sin(q * 3 + s * 9) * 12, py = lerp(ty, ry, u) + 20;
        paint(ellPts(px, py, 14 + 20 * u, 12 + 16 * u, 10), { fill: '#B8B2A8', fillOp: 140 * (1 - u * .6), ink: null }); }
      if (a < .35) paint(starPts(tx, ty, 120 * a / .35 + 40, .4, 10), { wash: '#FFE04A', washOp: 255 * (1 - a / .35), ink: INK, sw: 1.2 });
    }
    ceo(1160, s, wa, WKV === 'c' && popped ? { aL: 2.6, aR: 2.6, eyes: 'spark', mouth: 'O', dy: -2 * Math.abs(Math.sin(s * 14)) } : {});   // c: he cheers, hopping
  }
  // b: the timeline strip under the wheel
  const TLY = 1380, TLH = 360, TLX0 = 230, TLX1 = 1490, NOW = 1310, STEP = 36;
  const scrollOf = s => { let n = 0; for (const b of BT) { if (b > s) break; n += easeOut(clamp((s - b) / .16)); } return n * STEP; };
  function chartB(s, ang, wk, wa) {
    const a = wa - .06, whip = a > 0 ? 2600 * a * a : 0, sc = scrollOf(s) + whip, base = TLY + TLH - 34;
    belt(RG.x, RG.y, [NOW, TLY - 30], ang);
    paint(rrPts(TLX0 - 16, TLY - 16, TLX1 - TLX0 + 32, TLH + 32, 14), { wash: '#4A4F5A', ink: INK, sw: 1.4 });
    paint(rectPts(TLX0, TLY, TLX1 - TLX0, TLH, 1), { wash: '#FBF8F1', ink: null });
    paint(rectPts(TLX0, TLY, TLX1 - TLX0, 44), { wash: '#2FBF71', ink: null });
    letter('MORE TOKENS', (TLX0 + TLX1) / 2, TLY + 24, 30, '#FBF8F1', { ink: false });
    const off = ((sc % STEP) + STEP) % STEP;
    for (let x = NOW + STEP * 6 - off; x > TLX0; x -= STEP) { if (x > TLX1 - 6) continue;
      const qi = Math.round((x + sc - NOW) / STEP), quarter = ((qi % 4) + 4) % 4 === 0;
      inkLine([[x, base], [x, base + (quarter ? 22 : 10)]], quarter ? 3 : 1.6, INK, 'inkfine', 0);
      if (quarter) { paint(rectPts(x - 13, base + 4 - 70, 26, 24, 1), { wash: '#FFFFFF', ink: INK, sw: .7 }); paint(rectPts(x - 13, base + 4 - 70, 26, 7), { wash: '#E0302A', ink: null }); } }   // a calendar page per quarter
    inkLine([[TLX0 + 10, base], [TLX1 - 10, base]], 2.6, INK, 'ink', 0);
    const tops = [];
    CELLS.forEach(([w, ty], k) => { const age = s - w; if (age < 0) return;
      const x = NOW - (sc - scrollOf(w)), hh = Math.min(TLH - 70, 26 * Math.pow(1.17, k)) * backOut(clamp(age / .3)) * (1 + .06 * wk);
      if (x < TLX0 + 14) return;
      const up = k === CELLS.length - 1 && a > 0 ? 900 * a + 1500 * a * a : 0;
      tops.push([x, base - hh - 8 - up]);
      paint(rectPts(x - 15, base - hh - up, 30, hh, 1), { wash: TYC[ty], fill: mixCol(TYC[ty], INK, .3), fillOp: 60, tex: .4, ink: INK, sw: .8 });
      if (age < .4) sparks(x, base - hh, age, k + 40, 8, 120); });
    const line = a > 0 ? tops.slice(0, -1) : tops; if (line.length > 1) inkLine(line, 3.4, '#E0302A', 'ink', 0);
    inkLine([[NOW, TLY + 48], [NOW, base + 26]], 4, TK.yellow, 'ink', 0);                         // «now»
    paint([[NOW - 14, TLY + 48], [NOW + 14, TLY + 48], [NOW, TLY + 66]], { wash: TK.yellow, ink: INK, sw: .8 });
    CELLS.forEach(([w], k) => spark(cellPos(k, ang), [NOW, base - 40], (s - w + .25) / .25, TYC[CELLS[k][1]]));   // the cell's spark lands on «now» on the word
    ceo(1590, s, wa, { aR: wa >= 0 ? 1.8 : 1.3 });
  }
  // c: the LED ticker, hauled up by the belt
  const TK2 = { x: 250, y: 1360, w: 1160, h: 380 };
  function chartC(s, ang, wk, wa, rate) {
    const { x, y, w, h } = TK2, a = wa - .06, n = CELLW.filter(q => s >= q).length, lvl = n / CELLS.length, P2 = [x + w - 120, y - 40];
    belt(RG.x, RG.y, P2, ang);
    paint(rrPts(x - 20, y - 20, w + 40, h + 40, 16), { wash: '#3A3F48', ink: INK, sw: 1.6 });
    paint(rectPts(x, y, w, h, 1), { wash: '#0B0D10', ink: null });
    for (let gx = x + 14; gx < x + w; gx += 28) for (let gy = y + 14; gy < y + h - 70; gy += 28) paint(ellPts(gx, gy, 3, 3, 6), { wash: '#1E2A22', ink: null });   // the dot matrix
    const flashAll = a > 0 ? Math.max(0, 1 - a * 1.5) : 0;
    if (flashAll > 0) paint(rectPts(x, y, w, h - 70, 1), { wash: TK.yellow, washOp: 140 * flashAll, ink: null });
    // the graph: one LED point per filled cell, the level hauled up by the rope; the head bursts up on «WORKING»
    const pts = [], gh = h - 110;
    CELLS.forEach(([q], k) => { if (s < q) return; const px = x + 40 + k * (w - 160) / 15, v = Math.pow((k + 1) / 16, 1.7) * backOut(clamp((s - q) / .3)); pts.push([px, y + gh - v * (gh - 30)]); });
    if (pts.length > 1) for (let k = 1; k < pts.length; k++) { const [x0, y0] = pts[k - 1], [x1, y1] = pts[k];
      for (let u = 0; u <= 1; u += .12) paint(ellPts(lerp(x0, x1, u), lerp(y0, y1, u), 7, 7, 8), { wash: '#3BFF7A', ink: null }); }
    let head = pts[pts.length - 1];
    if (head && a > 0) head = [head[0] + 60 * a, head[1] - 1200 * a - 2000 * a * a];
    if (head) { glowAt(head[0], head[1], 70, '#3BFF7A', 200); paint([[head[0] - 18, head[1] + 10], [head[0], head[1] - 22], [head[0] + 18, head[1] + 10]], { wash: '#3BFF7A', ink: INK, sw: .8 });
      inkLine([[P2[0], P2[1]], [head[0], head[1] - 24]], 2.4, '#C9A24A', 'ink', 0); }               // the rope from the belt pulley
    // the ticker row: item icons scrolling left, speed = the wheel
    paint(rectPts(x, y + h - 70, w, 70, 1), { wash: '#15181D', ink: INK, sw: 1 });
    const off = (ang * 40) % 150;
    for (let k = 0; k < 9; k++) { const ix = x + w - 40 - ((k * 150 + off) % (w + 60)); if (ix < x + 30 || ix > x + w - 30) continue;
      const ty = [0, 1, 2, 3, 1, 1, 2, 3, 1][k]; cellItem(ty, ix, y + h - 38, 1.3, s);
      paint([[ix + 34, y + h - 30], [ix + 44, y + h - 48], [ix + 54, y + h - 30]], { wash: '#3BFF7A', ink: null }); }
    // the lever + the CEO pumping it on every word
    const lk = kick(s, CELLW, .18), LX = x + w + 110, LY = FLY - 10, la = -.9 + 1.1 * lk + (a > 0 ? .4 : 0);
    paint(rrPts(LX - 40, LY - 60, 80, 60, 8), { wash: A2.gunmetal, ink: INK, sw: 1.2 });
    inkLine([[LX, LY - 50], [LX + Math.cos(la - Math.PI / 2) * 230, LY - 50 + Math.sin(la - Math.PI / 2) * 230]], 10, A2.steel, 'ink', 0);
    paint(ellPts(LX + Math.cos(la - Math.PI / 2) * 230, LY - 50 + Math.sin(la - Math.PI / 2) * 230, 22, 22, 12), { wash: '#E0302A', ink: INK, sw: 1 });
    ceo(LX + 120, s, wa, { aR: 1.4 + .8 * lk, aL: 1.4 + .8 * lk, dy: -1.5 * lk });
    paint([[x + 30, y + 30], [x + 60, y - 4 - 10 * wk], [x + 90, y + 30]], { wash: '#3BFF7A', ink: INK, sw: .8 });   // the ▲
  }
  function ringScene(t) {
    const s = O2N(t);
    back(A2.gunDk);
    A03.hall(t, { lamps: [420, 1480], floor: FLY });
    paint(rectPts(-400, FLY, W + 800, 700), { wash: '#2A2D33', fill: '#1C1E22', fillOp: 80, tex: .5, ink: INK, sw: .8 });
    const cx = RG.x, cy = RG.y, R = RG.R, ang = spinOf(s), n = nWords(s), wa = s - RG.work;
    const rate = rateOf(s), e = effOf(rate), blur = wa >= 0 ? 1 : clamp((rate - 1.35) / .35), spin = wa >= 0 ? 1 : clamp((rate - 1.65) / .15);
    const rb = clamp((rate - .28) / .2), dA = rate * TAU / 24;   // v19 anti-aliasing: past ~0.3 rev/s the 36 rungs / 44 teeth strobe at 24 fps → smear them
    const wk = kick(s, RG.words, .12);
    if (WV === 'a') cellsWheel(s, ang); else if (WV === 'b') rack(s); else ptable(s);
    // fx c: the stand rattles and hops on the footfalls
    const rat = FX === 'c' && wa < .3 ? e * e : 0; push(); translate(Math.sin(s * 53) * 7 * rat, -Math.abs(Math.sin(s * TAU * (1.2 + 3.5 * rate))) * 14 * rat);
    // the stand: an A-frame from the axle to the floor
    for (const d of [-1, 1]) inkLine([[cx, cy], [cx + d * 330, FLY + 4]], 18, A2.steel, 'ink', 0);
    // the wheel: dark drum behind, spokes, the hamster, then the rim (two hoops + rungs) and its outer gear teeth
    paint(rb < 1 ? gearPts(cx, cy, R + 26, 44, ang, 14) : ellPts(cx, cy, R + 33, R + 33, 64), { wash: A2.gunmetal, ink: INK, sw: 1.4 });
    paint(ellPts(cx, cy, R + 26, R + 26, 64), { wash: A2.steel, ink: INK, sw: 1.6 });
    paint(ellPts(cx, cy, R - 26, R - 26, 48), { wash: '#1C1F24', ink: INK, sw: 2 });
    if (blur < 1) for (let k = 0; k < 8; k++) { const a = ang + k * TAU / 8; inkLine([[cx, cy], [cx + Math.cos(a) * (R - 26), cy + Math.sin(a) * (R - 26)]], 5, A2.steel, 'ink', 0); }
    if (blur > 0) paint(ellPts(cx, cy, R - 26, R - 26, 48), { fill: A2.steel, fillOp: 70 * blur, tex: .3, ink: null });
    // «WORKING»: the over-spun rim carries him up the left side (CARRY s), then lets go: he flies up-right off the frame, tumbling
    const CARRY = .3, TH0 = Math.PI / 2 - Math.min(.3, rate * .12), THR = Math.PI * 1.08, FR = R - 24 + 60;   // v22: released on the left side, flung to the upper-LEFT corner
    const th = wa < 0 ? TH0 : TH0 + (THR - TH0) * easeIn(Math.min(1, wa / CARRY)), fa = wa - CARRY;   // (the carry's lean stays .27, the fling picks it up)
    if (fa < 0) hamster(th, s, Math.min(rate, 2.6), n, wk, spin, null, ang / TAU);
    paint(ellPts(cx, cy, 34, 34, 16), { wash: TK.yellow, ink: INK, sw: 1.2 });
    paint(ellPts(cx, cy, R + 12, R + 12, 64), { ink: A2.steelLt, sw: 3 });
    if (rb > 0) paint([...ellPts(cx, cy, R + 10, R + 10, 64), ...ellPts(cx, cy, R - 24, R - 24, 64).reverse()], { fill: A2.steelLt, fillOp: 90 * rb, ink: null });   // the rungs smeared into a band
    for (let k = 0; k < 36; k++) { const a = ang + k * TAU / 36;
      if (k % 9 && rb >= 1) continue;
      if (k % 9 === 0 && rb > 0) for (let q = 1; q <= 3; q++) { const a2 = a - dA * q / 3; inkLine([[cx + Math.cos(a2) * (R - 24), cy + Math.sin(a2) * (R - 24)], [cx + Math.cos(a2) * (R + 10), cy + Math.sin(a2) * (R + 10)]], 4, mixCol(TK.yellow, A2.steel, q / 4), 'ink', 0); }   // the yellow rungs: a motion trail
      inkLine([[cx + Math.cos(a) * (R - 24), cy + Math.sin(a) * (R - 24)], [cx + Math.cos(a) * (R + 10), cy + Math.sin(a) * (R + 10)]], 4, k % 9 ? A2.steelLt : TK.yellow, 'ink', 0); }
    if (blur > 0) for (let k = 0; k < 5; k++) paint(ellPts(cx, cy, R - 20 + k * 10, R - 20 + k * 10, 48), { ink: [TK.yellow, TK.orange, TK.ember, TK.yellowLt, TK.orange][k], sw: 3 * blur });
    if (FX === 'b' && e > .05) {                                                                         // heat: the rim glows orange → white-hot
      const hc = e < .6 ? mixCol(TK.ember, TK.orange, e / .6) : mixCol(TK.orange, '#FFF6D0', (e - .6) / .4);
      glowAt(cx, cy + R * .6, R * (.6 + .8 * e), hc, 120 * e); paint(ellPts(cx, cy, R, R, 64), { ink: hc, sw: 4 + 14 * e });
      for (let q = 0; q < Math.round(12 * e * e); q++) { const a0 = ang * .5 + hash(q) * TAU, v = frac(s * 2.2 + hash(q + 5)), r = R + 20 + 160 * v;
        inkLine([[cx + Math.cos(a0) * r, cy + Math.sin(a0) * r], [cx + Math.cos(a0 - .05) * (r - 26), cy + Math.sin(a0 - .05) * (r - 26)]], 3, v < .5 ? '#FFF6D0' : TK.orange, 'inkfine', 0); }
      if (e > .7) for (let q = 0; q < 7; q++) { const v = frac(s * .7 + hash(q + 80)), k = (e - .7) / .3;
        paint(ellPts(cx - 200 + 400 * hash(q + 81) + 60 * v, cy - R - 40 - 360 * v, 40 + 70 * v, 34 + 60 * v, 12), { fill: '#55565C', fillOp: 160 * k * (1 - v), ink: null }); }
    }
    if (FX === 'c' && e > .15 && wa < .3) for (let q = 0; q < 2 + Math.round(3 * e); q++) {                // whoosh arcs chasing the rim
      const a0 = ang * .9 + q * TAU / (2 + Math.round(3 * e)), L = (.4 + 1.1 * e) * (wa < 0 ? 1 : 1 - wa / .3), r = R + 50 + 30 * (q % 2), pts = [];
      for (let k = 0; k <= 10; k++) { const a = a0 - L * k / 10; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
      inkLine(pts, 5 + 4 * e, '#F1E8D2', 'ink', 0); }
    pop();
    if (CV === 'b') chartB(s, ang, wk, wa); else if (CV === 'c') chartC(s, ang, wk, wa, rate); else chartA(s, ang, wk, wa);
    // the fling: ballistic from the release point, tangent to the rim, tumbling
    if (fa >= 0) { const V = 2400, ux = -.55, uy = -.83;
      // v21 (user: «the animation at ~171 is broken»): he used to pop from inside the drum to OUTSIDE the rim (FR) with a flipped anchor at the
      // hand-off; now the flight starts exactly where the carry left his body centre, at the same angle, and only then tumbles away
      const HBH = 440 * PROP_ART.ham4Run0[1] / PROP_ART.ham4Run0[0], a0 = THR - Math.PI / 2 + .27, fx0 = cx + Math.cos(THR) * (R - 24) + Math.sin(a0) * HBH * .6, fy0 = cy + Math.sin(THR) * (R - 24) - Math.cos(a0) * HBH * .6;   // .6 = half his height + the feet-circle lift
      hamster(THR, s, 2.6, n, 0, 1, { x: fx0 + ux * V * fa, y: fy0 + uy * V * fa + 900 * fa * fa, r: a0 - fa * 14 }); }
    // on the blur: sparks off the rim and tokens flung out
    if (blur > 0) {
      for (let q = 0; q < 10; q++) { const a0 = hash(q) * TAU, age = frac(s * 1.6 + hash(q + 3)), th2 = a0 + ang, r = R + age * 300;
        token(cx + Math.cos(th2) * r, cy + Math.sin(th2) * r, 13, { spin: s * 5 + q, burn: age }); }
      sparks(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R, frac(s * 3) * .35, Math.floor(s * 3), 12, 200);
    }
  }
  // one take v1 137.00 → 152.04 (a08 starts on the 152.04 slam); camera keys and punches in v1 time (the scene table's), on the sung words
  scene('e23_loop', 137.0, 152.04, ringScene, [[137.0, 940, 900, 1500], [wv1[7], 940, 895, 1480, 1], [enWord("working", 149.60), 940, 900, 1500, 1], [152.039, 945, 890, 1520, 1]],   // v14: 60 up, the top station clear of the title band
    [...wv1.map((w, i) => [w, i === 7 ? 18 : 9]), [enWord('working', 149.60), 16]]);

  // ======== E26 NEW (157.46–162.86) «Writes your thesis. Grades it too. No one's working. Including you.» ========
  // A classroom where everybody is asleep: the students (agents) face-down on their desks, the teacher asleep at his desk with his glasses
  // on his forehead. Only the chalk is awake: it writes the thesis on the blackboard all by itself, ticks it, slaps a gold star on it.
  // «No one's working» — the camera drifts right to a hammock slung in the corner: Clawd snoring in it. «Including you.» — the rope snaps,
  // he drops to the floor and sleeps on right there, a newspaper for a blanket, like a bum.
  const TH = { tick: 158.66, cap: 159.46, nobody: 160.10, you: 162.12 };
  function tdesk(x, y, w) {
    paint(rectPts(x - w / 2, y, w, 22, 1), { wash: '#7A4A2E', ink: INK, sw: .9 });
    for (const lx of [x - w / 2 + 14, x + w / 2 - 30]) paint(rectPts(lx, y + 22, 16, 1060 - y - 22), { wash: '#4A2A1E', ink: INK, sw: .6 });
  }
  const BB = [560, 190, 740, 420];                                           // the blackboard
  const HM = { a: [680, 720], b: [1240, 720] };                              // the hammock hooks (the park trees)
  function thesis(t) {
    if (t >= TH.nobody && !window.R34) return park(t);   // R34: «No one's working» is the beggar (v8b); the retimed classroom tail must not flash the park
    back('#2A2F2A');
    paint(rectPts(-400, -600, 2720, 1660), { wash: '#B9CDB0', fill: '#9DB594', fillOp: 60, tex: .5, ink: null });             // classroom wall
    paint(rectPts(-400, 1060, 2720, 600), { wash: '#8A5E3C', fill: '#6A4430', fillOp: 70, tex: .6, ink: INK, sw: 1 });         // wooden floor
    for (let x = -400; x < 2320; x += 120) inkLine([[x, 1060], [x - 60, 1660]], .6, '#5A3A26', 'inkfine', 0);
    // the blackboard; the chalk writes by itself: wavy lines of "handwriting", then a big tick, then a gold star
    const [bx, by, bw, bh] = BB;
    paint(rectPts(bx - 18, by - 18, bw + 36, bh + 36, 1), { wash: '#8A5E3C', ink: INK, sw: 1.2 });
    paint(rectPts(bx, by, bw, bh), { wash: '#24463A', fill: '#1A3A2E', fillOp: 80, tex: .6, ink: null });
    paint(rectPts(bx - 10, by + bh + 14, bw + 20, 16), { wash: '#8A5E3C', ink: INK, sw: .8 });
    const lines = clamp((t - 157.46) / (TH.tick - 157.46)) * 7, L = Math.floor(lines);
    let chalk = [bx + 60, by + 60];
    for (let i = 0; i <= Math.min(6, L); i++) {
      const y = by + 60 + i * 48, len = (i < L ? 1 : lines - L) * (bw - 140 - (i % 3) * 60), pts = [];
      for (let x = 0; x <= len; x += 14) pts.push([bx + 60 + x, y + Math.sin(x * .09 + i) * 7 + Math.sin(x * .31) * 3]);
      if (pts.length > 1) inkLine(pts, 3, '#EDEDE4', 'inkfine', .3);
      if (i === Math.min(6, L) && pts.length) chalk = pts[pts.length - 1];
    }
    if (t >= TH.tick) { const k = backOut(seg(t, TH.tick, TH.tick + .2)); push(); translate(bx + bw - 150, by + 150); scale(k); paint([[-56, -6], [-40, -20], [-14, 12], [50, -66], [66, -52], [-14, 44]], { wash: '#FF6A5A', ink: INK, sw: .8 }); pop(); chalk = [bx + bw - 90, by + 90]; }
    if (t >= TH.cap) { const k = backOut(seg(t, TH.cap, TH.cap + .25)); push(); translate(bx + bw - 110, by + bh - 110); scale(k); rotate(.2); paint(starPts(0, 0, 70, .45, 5), { wash: TK.yellow, fill: TK.gold, fillOp: 60, ink: INK, sw: 1 }); pop(); }
    if (t < TH.cap + .4) { push(); translate(chalk[0], chalk[1]); rotate(-.7 + .15 * Math.sin(t * 30)); paint(rectPts(-6, -34, 12, 34), { wash: '#F4F4EE', ink: INK, sw: .6 }); pop(); }
    // the teacher's desk (left), the teacher asleep on it (the floating 'glasses' bars read as a black blob: dropped)
    tdesk(500, 900, 180);
    clawd(500, 905, 12, { eyes: 'closed', mouth: 'flat', rot: .25, aL: -.4, aR: -.4, noShadow: true, dy: .3 * Math.sin(t * 1.3) });
    emote('zzz', 570, 750, 22, 1);
    // the students: two rows, asleep face-down
    for (const [x, y, n] of [[780, 930, 1], [1010, 930, 2], [1240, 930, 3], [680, 1040, 4], [910, 1040, 5], [1140, 1040, 6]]) {
      agentBot(x, y + 4, 12, t, { n: 60 + n, rot: NOTXT, eyes: 'closed', mouth: 'flat', noShadow: true, dy: .3 * Math.sin(t * 1.3 + n), aL: -.5, aR: -.5 });
      tdesk(x, y, 200);
      if (n % 2) emote('zzz', x + 60, y - 110, 16, 1);
    }
  }
  // «No one's working. Including you.» (160.10–162.86): outside, in a park (user notes on draft 3): Clawd asleep in a hammock between two trees;
  // on «Including you» the rope snaps, he drops and sleeps on right there on the ground, on flattened cardboard under a newspaper, like a bum
  function park(t) {
    back('#BFE3F0');
    paint(rectPts(-400, -900, W + 800, 1960), { wash: '#CFEAF3', fill: '#A8D4E6', fillOp: 50, tex: .4, ink: null });
    for (const [x, y, r] of [[560, 120, 90], [700, 90, 70], [1320, 200, 80], [1440, 170, 60]]) paint(ellPts(x, y, r * 1.6, r, 16), { wash: '#FFFFFF', washOp: 200, ink: null });
    paint(rectPts(-400, 1040, W + 800, 800), { wash: '#8CC06E', fill: '#6FA058', fillOp: 70, tex: .6, ink: INK, sw: 1 });            // grass
    for (let i = 0; i < 40; i++) { const x = 400 + hash(i) * 1100, y = 1060 + hash(i + 3) * 240; inkLine([[x, y], [x - 6, y - 18]], 1.2, '#4E7A3C', 'inkfine', 0); }
    paint(rectPts(1320, 1000, 110, 60, 1), { wash: '#6A7A70', ink: INK, sw: .8 }); paint(rectPts(1330, 960, 90, 44), { wash: '#7E8E84', ink: INK, sw: .8 });   // a bin
    for (const [x, y] of [HM.a, HM.b]) {                                                                                  // the trees
      paint(rectPts(x - 38, y - 300, 76, 1340 - y, 1), { wash: '#7A4A2E', fill: '#5A3420', fillOp: 60, tex: .6, ink: INK, sw: 1 });
      for (const [dx, dy, r] of [[-90, -330, 130], [70, -360, 140], [0, -450, 150], [-10, -250, 120]]) paint(ellPts(x + dx, y + dy, r, r * .85, 18), { wash: '#6FB058', fill: '#4E8A3E', fillOp: 60, tex: .5, ink: INK, sw: 1 });
    }
    const [ax, ay] = HM.a, [hx, hy] = HM.b, snap = t >= TH.you, fall = seg(t, TH.you, TH.you + .35), sag = 150, mid = [(ax + hx) / 2, ay + sag];
    if (!snap) {
      const sw = Math.sin(t * 1.4) * 12, net = []; for (let i = 0; i <= 12; i++) { const u = i / 12; net.push([lerp(ax, hx, u) + sw * Math.sin(u * Math.PI), ay + sag * Math.sin(u * Math.PI) + 10]); }
      inkLine(net, 10, '#C8A060', 'ink', .4);
      clawd(mid[0] + sw, mid[1] - 4, 16, { rot: -.12, eyes: 'closed', mouth: 'smile', aL: 1.5, aR: 1.5, noShadow: true });
      paint(net.concat(net.slice().reverse().map(([x, y]) => [x, y + 34])), { wash: '#E0B870', fill: '#B88A40', fillOp: 60, ink: INK, sw: .8 });
      emote('zzz', mid[0] + 120, mid[1] - 190, 24, 1);
    } else {
      inkLine([[ax, ay], [ax + 40, ay + 200 * fall + 40], [ax + 60, ay + 300 * fall + 60]], 5, '#C8A060', 'ink', .4);   // the torn hammock hangs from one tree
      inkLine([[hx, ay], [hx - 12, ay + 70]], 5, '#C8A060', 'ink', .3);
      const fx = lerp(mid[0], 1000, fall), fy = lerp(mid[1] - 4, 1062, easeIn(fall));
      if (fall >= 1) paint(rectPts(820, 1046, 360, 24, 1), { wash: '#B08A5A', ink: INK, sw: .8 });                   // flattened cardboard under him
      clawd(fx, fy, 16, { rot: fall >= 1 ? 0 : -.12 + .9 * Math.sin(fall * Math.PI), eyes: 'closed', mouth: fall >= 1 ? 'flat' : 'O', aL: .2, aR: .2, noShadow: true });
      if (fall >= 1) {                                                                                                  // a newspaper for a blanket
        paint([[850, 1068], [862, 1000], [1000, 984], [1140, 998], [1152, 1068]], { wash: '#E8E2D2', ink: INK, sw: .8 });   // pulled up to his chin, only the sleeping face shows
        for (let q = 0; q < 3; q++) inkLine([[880, 1012 + q * 18], [1120, 1014 + q * 18]], 1.5, '#8A8480', 'inkfine', 0);
        emote('zzz', 1110, 860, 26, clamp((t - TH.you - .5) * 2));
      }
    }
  }
  scene('e26_thesis', 157.46, 162.86, thesis, [
    [157.46, 900, 640, 1040], [TH.nobody - .01, 900, 650, 1020, 1], ...(window.R34 ? [[162.859, 900, 652, 1016, 1]] : [[TH.nobody, 960, 640, 1000], [TH.you, 960, 660, 960, 1], [162.859, 960, 720, 880, 1]]),
  ], [[TH.you + .35, 12]]);

  // ======== E30 NEW (183.82–189.06) «REVENUE? LATER! PROFIT? HOW?! A-G-I? SOON! CAPEX? NOW!» ========
  // A departures board with no letters: four split-flap tiles flip to pictures on the words. Money bag + clock (the hands spin on «LATER»),
  // an empty wallet (a moth flies out on «HOW»), a brain + hourglass (the sand runs on «SOON»), a heap of burning GPUs that lights the
  // whole board red on «NOW!». The CEO under the board shrugs at every flip.
  const BD = { flips: [183.74, 185.00, 186.38, 187.62], sub: [184.40, 185.60, 187.00, 188.32], x: 960, y: 420 };
  const TILE = [[-205, -150], [205, -150], [-205, 150], [205, 150]];
  function pict(i, t) {                                                   // drawn around (0, 0), ~300×220
    const sub = t - BD.sub[i];
    if (i === 0) {
      paint(ellPts(-40, 20, 80, 75, 18), { wash: '#C9A267', fill: '#8A6A3A', fillOp: 60, tex: .5, ink: INK, sw: 1 });
      paint([[-70, -50], [-10, -50], [-25, -70], [-55, -70]], { wash: '#C9A267', ink: INK, sw: .8 }); inkLine([[-70, -48], [-10, -48]], 3, TK.ember, 'ink', 0);
      token(-40, 25, 34, {});
      paint(ellPts(90, 0, 65, 65, 24), { wash: PAL.cream, ink: INK, sw: 1.2 });
      const a = sub > 0 ? sub * 12 : 0;
      inkLine([[90, 0], [90 + Math.sin(a) * 50, -Math.cos(a) * 50]], 3, INK, 'ink', 0); inkLine([[90, 0], [90 + Math.sin(a / 12 + 2) * 32, -Math.cos(a / 12 + 2) * 32]], 4, INK, 'ink', 0);
    } else if (i === 1) {
      paint(rrPts(-110, -40, 220, 120, 18), { wash: '#6A3A22', fill: '#3A1E12', fillOp: 70, tex: .5, ink: INK, sw: 1 });
      paint(rrPts(-100, -70, 200, 50, 12), { wash: '#2A140C', ink: INK, sw: .8 });
      paint(rrPts(40, 0, 80, 40, 10), { wash: '#8A5A36', ink: INK, sw: .7 });
      const fly = clamp(sub / 1.2), mx = lerp(0, 60, fly) + 20 * Math.sin(t * 6), my = lerp(-50, -150, fly) + 10 * Math.sin(t * 9), fl = Math.abs(Math.sin(t * 22));
      for (const sd of [-1, 1]) paint([[mx, my], [mx + sd * 34, my - 20 * fl], [mx + sd * 28, my + 12]], { wash: '#D8CFC0', ink: INK, sw: .6 });
      paint(ellPts(mx, my, 5, 14, 8), { wash: '#6A5A4A', ink: INK, sw: .5 });
    } else if (i === 2) {
      paint(ellPts(-50, 0, 85, 65, 22), { wash: '#F2A2B0', fill: '#D97787', fillOp: 60, tex: .4, ink: INK, sw: 1 });
      for (let k = 0; k < 5; k++) inkLine([[-110 + k * 25, -30 + (k % 2) * 20], [-95 + k * 25, 5], [-110 + k * 25, 35 - (k % 2) * 20]], 1.2, '#A84D5A', 'inkfine', .6);
      inkLine([[-50, -60], [-50, 60]], 1.5, '#A84D5A', 'inkfine', 0);
      const hx = 100, sand = clamp(sub / 1.5);
      paint([[hx - 45, -75], [hx + 45, -75], [hx, 0]], { wash: '#E6F1F2', ink: INK, sw: 1 }); paint([[hx - 45, 75], [hx + 45, 75], [hx, 0]], { wash: '#E6F1F2', ink: INK, sw: 1 });
      paint([[hx - 45 * (1 - sand) * .8, -75 + 75 * sand], [hx + 45 * (1 - sand) * .8, -75 + 75 * sand], [hx, -2]], { wash: TK.yellow, ink: null });
      paint([[hx - 40 * sand, 72], [hx + 40 * sand, 72], [hx, 72 - 60 * sand]], { wash: TK.yellow, ink: null });
      if (sand > 0 && sand < 1) inkLine([[hx, 0], [hx, 70]], 1.5, TK.yellow, 'inkfine', 0);
      paint(rectPts(hx - 55, -85, 110, 12), { wash: '#7A4A2E', ink: INK, sw: .6 }); paint(rectPts(hx - 55, 73, 110, 12), { wash: '#7A4A2E', ink: INK, sw: .6 });
    } else {
      fire(0, 70, 260, 140 + 40 * clamp(sub + 1), t, { k: 1, seed: 7 });
      for (const [x, y, r] of [[-60, 40, -.2], [60, 45, .25], [0, 5, .05], [-20, -30, -.3]]) gpuCard(x, y, .45, t, { rot: r });
    }
  }
  function board(t) {
    back('#141218');
    A03.hall(t, { lamps: [540, 1380], floor: 1060, dark: .5 });
    const now = t - BD.sub[3], red = clamp(now / .15);
    paint(rectPts(BD.x - 440, BD.y - 330, 880, 660, 2), { wash: '#101114', fill: '#050608', fillOp: 90, tex: .4, ink: INK, sw: 2 });
    for (const lx of [BD.x - 380, BD.x + 380]) inkLine([[lx, -400], [lx, BD.y - 330]], 3, A2.steel, 'ink', 0);
    TILE.forEach(([dx, dy], i) => {
      const x = BD.x + dx, y = BD.y + dy, a = t - BD.flips[i];
      const flip = a < 0 ? 1 : a < .3 ? Math.abs(Math.cos(a / .3 * Math.PI * 1.5)) : 1;
      paint(rectPts(x - 190, y - 135, 380, 270, 1), { wash: '#1E2026', ink: INK, sw: 1.2 });
      if (a >= .1) {
        push(); translate(x, y); scale(1.2, flip * 1.2);
        if (i === 3 || red > 0) paint(rectPts(-190, -135, 380, 270), { wash: i === 3 ? '#3A0C10' : '#2A0A0C', ink: null });
        pict(i, t); pop();
      }
      inkLine([[x - 190, y], [x + 190, y]], 2, '#050608', 'ink', 0);                        // the split in the flap
      if (a >= 0 && a < .3) paint(rectPts(x - 190, y - 135 * (1 - a / .3), 380, 135 * (1 - a / .3)), { wash: '#2A2D35', ink: INK, sw: .6 });
      if (i < 3 && red > 0) paint(rectPts(x - 190, y - 135, 380, 270), { wash: '#000000', washOp: 150 * red, ink: null });
    });
    if (red > 0) {                                                                // CAPEX: red neon round the burning tile, the board glows
      const [dx, dy] = TILE[3], fl = .8 + .2 * Math.sin(t * 30);
      paint(rectPts(BD.x + dx - 196, BD.y + dy - 141, 392, 282), { ink: '#FF2F4A', sw: 4 * fl });
      glowAt(BD.x + dx, BD.y + dy, 330, '#FF2F4A', 110 * red * fl);
      flash(kick(t, [BD.sub[3]], .25) * .4, '#FF2F4A');
    }
    // the CEO under the board: a shrug on every flip
    const sh = Math.max(...BD.flips.concat(BD.sub).map(f => { const a = t - f; return a > 0 && a < .7 ? Math.sin(a / .7 * Math.PI) : 0; }));
    ceoClawd(960, 1050, 20, { noShadow: true, eyes: red > 0 ? 'scared' : 'happy', mouth: red > 0 ? 'O' : 'flat', aL: 1.3 * sh + .2, aR: 1.3 * sh + .2, dy: -sh * .6 });
  }
  scene('e30_board', 183.82, 189.06, board, [
    [183.82, 960, 600, 1000], [186.3, 960, 580, 980, 1], [BD.sub[3], 1060, 520, 940], [189.059, 1040, 540, 1000, 1],
  ], [[BD.flips[3], 12], [BD.sub[3], 22]]);

  // (189.06–194.32 is the RU a09 benchmark board + puppeteers.)
  const tophat = (u, sw) => { paint(rectPts(-3.4 * u, -11.6 * u, 6.8 * u, 3.8 * u), { wash: TK.soot, ink: PAL.ink, sw: sw * .6 }); paint(rectPts(-4.6 * u, -8.1 * u, 9.2 * u, .7 * u), { wash: TK.soot, ink: PAL.ink, sw: sw * .6 }); paint(rectPts(-3.4 * u, -9 * u, 6.8 * u, .7 * u), { wash: TK.ember, ink: null }); };
  // ======== «Worth half a trillion more!» + the break (track v2: real 210.08–217.84 = v1 194.32–202.08, 1:1): the money pile grows on every beat ========
  // User notes on draft 3: the pile GROWS ON EVERY BEAT with a bump + a small shake (bigger on the downbeats). A narrow tall peak so it stays inside
  // the 3:4 frame; shareholders in top hats up to their necks at its foot; agents on the summit hold one note (going red, then blue), the CEO
  // conducts, a medic agent brings an oxygen mask; a short blank odometer above grows a cell every downbeat.
  const BN = { a: 194.32, end: N2O(217.84) };                            // ponytail: the pile's real span is a RETIME cut pair (truth.js / en_truth.py CUTS)
  const PBEATS = EN_BEATS.filter(b => b >= BN.a - .01 && b < BN.end), PDOWN = new Set(EN_DOWNBEATS.filter(b => b >= BN.a - .01 && b < BN.end));
  const pileK = t => {                                                     // 0..1 growth: a step per beat (a double step on downbeats), each with an overshoot bump
    let k = 0; const unit = 1 / PBEATS.reduce((a, b) => a + (PDOWN.has(b) ? 2 : 1), 0);
    for (const b of PBEATS) { if (t < b) break; const s = (PDOWN.has(b) ? 2 : 1) * unit, a = t - b; k += s * (a > .25 ? 1 : 1 + .6 * Math.sin(a / .25 * Math.PI) * (1 - a / .25) + (easeOut(clamp(a / .12)) - 1)); }
    return k;
  };
  // v10 (user): an ENDLESS climb — the pile is a cone at its angle of repose (slope PS, rounded top PR) that keeps rising 300 → 980 and widening;
  // Clawd keeps pace a fixed slope-distance below the summit, so he climbs and climbs and the top stays out of reach
  const PS = .85, PR = 140, pileH = t => 300 + 680 * pileK(t);
  const mound = t => { const H = pileH(t); return x => 1060 - Math.max(0, H - PS * (Math.hypot(x - 960, PR) - PR)); };
  const below = gap => 960 - Math.sqrt((gap / PS + PR) ** 2 - PR ** 2);   // x on the left slope `gap` px under the summit
  function bench(t) {
    back('#1C1F24');
    A03.hall(t, { lamps: [560, 1360], floor: 1060 });
    paint(rectPts(-400, 1060, W + 800, 700), { wash: '#2A2D33', fill: '#1C1E22', fillOp: 80, tex: .5, ink: INK, sw: .8 });
    // the pile
    const h = mound(t), HW = pileH(t) / PS + PR, pts = [[-400, 1100]]; for (let x = -400; x <= 2320; x += 30) pts.push([x, h(x)]); pts.push([2320, 1100]);
    paint(pts, { wash: TK.gold, fill: TK.goldDk, fillOp: 70, tex: .6, ink: INK, sw: 1.2 });
    for (let i = 0; i < 90; i++) { const x = 960 + (hash(i) - .5) * 1.8 * HW, y = lerp(h(x), 1080, hash(i + 9) * .9) + 6; if (y < 1075) token(x, y, 14 + hash(i + 3) * 10, { spin: hash(i) }); }
    const lb = PBEATS.filter(b => t >= b).pop(), la = lb == null ? 9 : t - lb;          // coins bouncing on the last beat
    if (la < .5) for (let i = 0; i < 8; i++) { const x = 960 + (hash(i + lb * 7) - .5) * 360, v = 300 + hash(i + 2) * 300; token(x, h(x) - v * la + 1400 * la * la, 15, { spin: t * 5 + i }); }
    // draft 4: no counter, no medic, no singers — the pile, two agents shovelling coins onto it on every beat,
    // and Clawd pushing his token up the left slope (the intro's Sisyphus), on the summit on the last beat
    const lbi = PBEATS.filter(b => t >= b).length, la2 = lb == null ? 9 : t - lb;
    // v8 (PLAN_v8 #7): two «capitalists» at the right foot — fat-cat Clawds in tailcoats, top hats, monocles, cigars — shovel money onto the
    // pile in rhythm: blade down scooping between beats, swung up and flung ON the beat; coins, tokens and banknotes arc onto the slope
    [[1190, 0], [1320, 1]].forEach(([x, n]) => {                             // v10: they stand on the right slope and ride it up as it grows
      const fy = h(x) + 6, u = 15, la3 = n ? la2 - .04 : la2, a = -.55 + 1.9 * (la3 < 0 ? 0 : la3 < .12 ? easeOut(la3 / .12) : 1 - ease(clamp((la3 - .12) / .34))), cg = frac(t * .7 + n * .5);
      clawd(x, fy, u, { flip: true, col: '#F2C9AE', dk: '#C9937A', lt: '#FFE4D2', eyes: 'narrow', mouth: 'grin', aL: .3, aR: a, rot: -.08 * (1 - (a + .55) / 1.9) + .04 * (a + .55) / 1.9, noShadow: true,
        armR: (uu, sw) => {                                                     // the shovel along the arm
          inkLine([[-2.4 * uu, 0], [6.4 * uu, 0]], sw * 2.2, '#7A5A3A', 'ink', 0);
          paint([[6 * uu, -1.6 * uu], [9 * uu, -1.3 * uu], [9.4 * uu, 0], [9 * uu, 1.3 * uu], [6 * uu, 1.6 * uu]], { wash: '#8A93A0', fill: '#5A626E', fillOp: 70, tex: .4, ink: INK, sw: sw * .8 });
          if (a < .2) for (let q = 0; q < 3; q++) paint(ellPts((7 + q) * uu, -.4 * uu, .8 * uu, .5 * uu, 8), { wash: TK.gold, ink: INK, sw: sw * .4 });   // a scoop of coins
        },
        draw: (uu, sw) => {
          paint(rectPts(-5 * uu, -3.6 * uu, 10 * uu, 1.6 * uu), { wash: TK.soot, fill: TK.sootLt, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });   // tailcoat
          paint([[5 * uu, -3.6 * uu], [6.6 * uu, -.6 * uu], [5.4 * uu, -.9 * uu], [5 * uu, -2 * uu]], { wash: TK.soot, ink: INK, sw: sw * .6 });       // the tail
          paint([[-1.2 * uu, -3.6 * uu], [1.2 * uu, -3.6 * uu], [0, -2.2 * uu]], { wash: '#FBF8F1', ink: null });                                      // shirt front
          paint([[-1.1 * uu, -3.9 * uu], [0, -3.5 * uu], [-1.1 * uu, -3.1 * uu]], { wash: '#B0202A', ink: INK, sw: sw * .4 });
          paint([[1.1 * uu, -3.9 * uu], [0, -3.5 * uu], [1.1 * uu, -3.1 * uu]], { wash: '#B0202A', ink: INK, sw: sw * .4 });                          // bow tie
          paint(ellPts(2.5 * uu, -6 * uu, 1.1 * uu, 1.1 * uu, 14), { ink: '#E8C870', sw: sw * .7 });                                                    // monocle
          inkLine([[3.4 * uu, -5.4 * uu], [4 * uu, -3.2 * uu]], sw * .3, '#E8C870', 'inkfine', .3);
          paint(rectPts(1.1 * uu, -4.75 * uu, 2.8 * uu, .7 * uu), { wash: '#6A4022', ink: INK, sw: sw * .4 });                                          // cigar
          paint(ellPts(4 * uu, -4.4 * uu, .4 * uu, .4 * uu, 8), { wash: TK.ember, ink: null });
          tophat(uu, sw);
        } });
      for (let q = 0; q < 3; q++) { const v = frac(cg + q / 3);                  // cigar smoke (flip: the cigar points left)
        paint(ellPts(x - 4 * u - v * 30, fy - 4.6 * u - v * 90, 6 + v * 14, 5 + v * 10, 10), { wash: '#C8CCD6', washOp: 150 * (1 - v), ink: null }); }
      if (lb != null && la3 >= 0 && la3 < .6) for (let q = 0; q < 6; q++) {    // the load: from the blade at the top of the swing onto the slope
        const k = clamp((la3 - .08 - q * .03) / .45); if (k <= 0 || k >= 1) continue;
        const sx = x - 15 * u * .55, sy = fy - 4.5 * u - 12 * u * .8, ex = 1020 - n * 50 - q * 18, ey = h(ex) - 8;
        const px = lerp(sx, ex, k), py = lerp(sy, ey, k) - Math.sin(k * Math.PI) * 140;
        if (q % 3 === 2) paint(rotPts(rectPts(px - 16, py - 8, 32, 16), px, py, t * 6 + q), { wash: '#7FB069', ink: INK, sw: .7 });   // a banknote
        else if (q % 2) token(px, py, 15, { spin: t * 7 + q }); else paint(ellPts(px, py, 13, 6, 10, 0, t * 5 + q), { wash: TK.gold, ink: INK, sw: .7 });
      }
    });
    // Clawd + his token (draft-6 note: true Sisyphus): one shove per beat up the left slope, ALMOST at the top on the last downbeat of the break
    // (RB) — and there the token gets away from him, hops over his head and rolls all the way down; he spins round to watch it go and slumps.
    const RB = [...PDOWN].filter(b => b < BN.end - .6).pop(), NBr = PBEATS.filter(b => b <= RB).length, lbr = Math.min(lbi, NBr);
    const tR = Math.min(t, RB), lag = lb == null ? 0 : 1 - easeOut(clamp((t >= RB ? 9 : la2) / .3));   // the pile jumps on the beat, his shove catches up
    const cxp = below(lerp(170, 240, pileK(tR)) + 45 * lag);   // kept inside the frame's left edge as the cone widens
    const sl = Math.atan2(h(cxp + 10) - h(cxp - 10), 20), r0 = 64, x0 = cxp + 105 * Math.cos(sl), ra = t - RB, roll = ra > 0 ? easeIn(clamp(ra / .9)) : 0;
    const tkx = lerp(x0, 420, roll), hop = Math.max(0, 1 - Math.abs(tkx - cxp) / 140) * 190, tky = Math.min(h(tkx), 1060) - r0 - hop;
    push(); translate(tkx, tky); rotate(ra > 0 ? t * 1.5 - (x0 - tkx) / r0 : t * 1.5); token(0, 0, r0, { spin: .02 }); pop();
    if (ra > 0 && ra < 1.4) for (let q = 0; q < 6; q++) { const u = frac(q / 6 + t * 2); paint(ellPts(tkx + 40 + u * 90, Math.min(h(tkx + 60), 1060) - 10 - u * 30, 10 + u * 16, 6 + u * 9, 8), { wash: '#B8A58C', washOp: 160 * (1 - u), ink: null }); }
    const turned = ra > .45, slump = eased(t, RB + .9, RB + 1.3);
    // v8: visible EFFORT — one heavy step per beat, leaning hard into it, eyes squeezed, a squash on every shove, sweat flying off, strain marks
    const shove = ra > 0 || lb == null ? 0 : 1 - clamp(la2 / .3);
    clawd(cxp, h(cxp) + 6, 14, { walk: ra > 0 ? null : lbi * .5 + .5 * easeOut(clamp(la2 / .4)), flip: turned, rot: ra > 0 ? sl * .8 + (turned ? -.1 * slump : -.25 * Math.sin(clamp(ra / .45) * Math.PI)) : sl + .5 + .06 * shove,
      eyes: ra > 0 ? (slump > .5 ? 'closed' : 'scared') : 'closed', mouth: ra > 0 ? (slump > .5 ? 'flat' : 'O') : 'wobble',
      aL: ra > 0 ? 1.3 - 1.2 * slump : 1.1, aR: ra > 0 ? 1.3 - 1.2 * slump : 1.1, emote: ra <= 0 ? 'sweat' : null, dy: .5 * slump, sq: ra > 0 ? .08 * slump : .1 * shove, noShadow: true });
    if (ra <= 0) {
      const hx = cxp - 30, hy = h(cxp) - 150;
      for (let q = 0; q < 3; q++) { const a = -2.3 + q * .45; inkLine([[hx + Math.cos(a) * 34, hy + Math.sin(a) * 34], [hx + Math.cos(a) * (52 + 14 * shove), hy + Math.sin(a) * (52 + 14 * shove)]], 2.2, '#FBF8F1', 'inkfine', 0); }
      if (lb != null && la2 < .5) for (let q = 0; q < 4; q++) { const v = la2 / .5, dx = -40 - (60 + 40 * hash(q + lbi)) * v, dy = -30 - 120 * v + 260 * v * v;   // sweat flung back off his head
        paint([[hx + dx, hy + dy - 9], [hx + dx + 6, hy + dy + 3], [hx + dx, hy + dy + 7], [hx + dx - 6, hy + dy + 3]], { wash: '#BFE3F7', washOp: 255 * (1 - v), ink: INK, sw: .5 }); }
    }
  }
  const pcam = t => [930, Math.min(770, 1060 - pileH(t + .3) - 220 + .4 * 1.485 * 1000), 1000];   // tilts up with the summit once it nears the title
  scene('e31_bench', BN.a, 210.0, bench, [[BN.a, ...pcam(BN.a)], ...[...PDOWN].filter(b => b > BN.a + .3).map(b => [b, ...pcam(b), 1]), [BN.end - .01, ...pcam(BN.end), 1]], PBEATS.map(b => [b, PDOWN.has(b) ? 7 : 3]));   // odometer, peak, CEO and shareholders whole

  // ======== E33 NEW (216.68–224.72) «Three games. Seven websites. Forty-two agents. Didn't need a single one.» ========
  const SH = { games: 217.08, sites: 218.18, agents: 219.60, grey: 222.32 };
  function shelf(t) {
    back('#141218');
    paint(rectPts(-400, -400, W + 800, 1500), { wash: '#1E1A24', fill: '#141218', fillOp: 90, tex: .5, ink: null });
    inkLine([[960, -400], [960, 90]], 1, INK, 'inkfine', 0); paint(ellPts(960, 110, 30, 34, 14), { wash: '#FFE2A8', ink: INK, sw: .7 });
    paint(ellPts(960, 300, 520, 420, 24), { fill: A2.sodium, fillOp: 30, bleed: .3, ink: null });
    const g = eased(t, SH.grey, SH.grey + 1.2), droop = g;
    paint(rectPts(580, 180, 800, 900, 1), { wash: '#4A2A1E', fill: '#2A160E', fillOp: 70, tex: .5, ink: INK, sw: 1.2 });
    for (const y of [420, 700, 1060]) paint(rectPts(560, y, 840, 26, 1), { wash: '#7A4A2E', ink: INK, sw: .9 });
    // shelf 1: three dusty cartridges drop in
    for (let i = 0; i < 3; i++) {
      const a = t - SH.games - i * .12; if (a < 0) continue;
      const x = 720 + i * 260, y = 420 - (a < .2 ? (1 - easeOut(a / .2)) * 200 : 0), c = grey([TK.ember, PAL.teal, TK.yellow][i], g);
      push(); translate(x, y); rotate(droop * (i - 1) * .15);
      paint([[-80, 0], [-80, -170], [60, -170], [80, -150], [80, 0]], { wash: grey('#5A5F6A', g), ink: INK, sw: 1 });
      paint(rectPts(-60, -140, 120, 90, 1), { wash: c, ink: INK, sw: .8 });
      paint(starPts(0, -95, 26), { wash: grey(PAL.cream, g), ink: INK, sw: .5 });
      for (let k = 0; k < 6; k++) paint(rectPts(-60 + k * 22, -20, 12, 20), { wash: grey(TK.gold, g), ink: null });
      pop();
    }
    // shelf 2: seven little browser windows
    for (let i = 0; i < 7; i++) {
      const a = t - SH.sites - i * .08; if (a < 0) continue;
      const x = 640 + i * 113, y = 700 - (a < .2 ? (1 - easeOut(a / .2)) * 160 : 0), c = grey([TK.blue, TK.green, TK.ember, PAL.violet, TK.orange, PAL.teal, PAL.rose][i], g);
      push(); translate(x, y); rotate(droop * (hash(i) - .5) * .5);
      paint(rectPts(-48, -120, 96, 120, 1), { wash: grey(PAL.cream, g), ink: INK, sw: .8 });
      paint(rectPts(-48, -120, 96, 18), { wash: grey('#C8C0B4', g), ink: INK, sw: .5 });
      for (let k = 0; k < 3; k++) paint(ellPts(-38 + k * 11, -111, 3.5, 3.5, 6), { wash: grey([TK.ember, TK.yellow, TK.green][k], g), ink: null });
      paint(rectPts(-38, -92, 76, 34), { wash: c, ink: null });
      for (let k = 0; k < 3; k++) paint(rectPts(-38, -48 + k * 13, 60 - k * 12, 6), { wash: grey('#B8AE9E', g), ink: null });
      pop();
    }
    // bottom: 42 tiny agents, 6 rows × 7, waving in sync, then grey, arms down, eyes shut
    const wave = Math.sin(t * 7) * (1 - droop);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) {
      const i = r * 7 + c, a = t - SH.agents - i * .012; if (a < 0) continue;
      const x = 650 + c * 103, y = 750 + r * 52 + 40 - (a < .15 ? (1 - a / .15) * 60 : 0);
      A06.mini(x, y, 4.2, { n: i + 1, eyes: droop > .5 ? 'closed' : 'happy', mouth: droop > .5 ? 'flat' : 'smile', aL: .3 - droop * .8, aR: 1.4 + .5 * wave - droop * 2.2 });
    }
    if (g > 0) paint(rectPts(560, 750, 840, 320), { wash: '#6A6E78', washOp: 110 * g, ink: null });
    // dust in the light
    for (let i = 0; i < 18; i++) { const p = frac(t * .07 + hash(i)); paint(ellPts(620 + hash(i + 2) * 700, lerp(150, 1000, p), 2.5, 2.5, 6), { wash: '#E8DCC0', washOp: 140, ink: null }); }
  }
  scene('e33_shelf', 216.68, 224.72, shelf, [
    [216.68, 960, 330, 860], [SH.sites - .1, 960, 390, 880, 1], [SH.agents - .1, 960, 700, 900, 1], [SH.grey - .2, 960, 620, 1000, 1], [224.719, 960, 620, 1040, 1],
  ]);

  // ======== the room (verse 1 at dusk, the outro at night): one set, same furniture, drawn once here ========
  // wall + window (dusk sky or stars, never a moon), the cuckoo clock (no numbers), the desk with the laptop, the token jar, the armchair.
  const ROOM = { floor: 1060, clock: [900, 470], desk: [1140, 1460, 880], laptop: [1290, 880], jar: [1420, 880], chair: [1300, 1060] };
  function roomWall(t, night) {                                            // night 0 = Friday dusk … 1 = Sunday night
    paint(rectPts(-400, -400, W + 800, 1500), { wash: mixCol('#4A3848', '#221C2A', night), fill: mixCol('#3A2A38', '#141218', night), fillOp: 90, tex: .5, ink: null });
    for (let x = 520; x < 1480; x += 120) inkLine([[x, -200], [x, ROOM.floor]], .5, mixCol('#3A2A38', '#141218', night), 'inkfine', 0);
    paint(rectPts(1180, 160, 300, 380, 1), { wash: mixCol('#F2A283', '#1F2550', night), ink: INK, sw: 2 });
    paint(rectPts(1180, 350, 300, 190), { wash: mixCol('#B85A7A', '#161B40', night), washOp: 200, ink: null });
    if (night > .3) for (let i = 0; i < 14; i++) { const tw = .6 + .4 * Math.sin(t * 3 + i * 2.1); paint(starPts(1195 + hash(i) * 270, 175 + hash(i + 5) * 340, 5 + 4 * hash(i + 2) * tw), { wash: '#FFF5E2', washOp: 255 * (night - .3) / .7, ink: null }); }
    inkLine([[1330, 160], [1330, 540]], 3, INK, 'ink', 0); inkLine([[1180, 350], [1480, 350]], 3, INK, 'ink', 0);
    paint(rectPts(1160, 540, 340, 20, 1), { wash: '#7A4A2E', ink: INK, sw: .8 });
    paint(rectPts(-400, ROOM.floor, W + 800, 600), { wash: '#5A3A28', fill: '#3A2418', fillOp: 90, tex: .6, ink: null });
    for (let x = -400; x < W + 400; x += 150) inkLine([[x, ROOM.floor], [x - 60, ROOM.floor + 300]], .6, '#3A2418', 'inkfine', 0);
    paint(ellPts(960, ROOM.floor + 70, 420, 50, 30), { wash: '#7A3A4A', fill: '#5A2A38', fillOp: 70, tex: .5, ink: INK, sw: .8 });   // the rug
  }
  // the cuckoo clock without numbers; min/hour = hand angles (0 = up), pop = seconds since the door flipped (null = shut)
  function cuckoo(t, x, y, sc, min, hour, popT = null) {
    push(); translate(x, y); scale(sc); translate(-x, -y);
    paint([[x - 200, y - 150], [x, y - 330], [x + 200, y - 150], [x + 200, y + 250], [x - 200, y + 250]], { wash: '#7A4A2E', fill: '#4A2A1E', fillOp: 70, tex: .6, ink: INK, sw: 1.4 });
    paint([[x - 230, y - 140], [x, y - 360], [x + 230, y - 140]], { ink: '#4A2A1E', sw: 8 });
    const door = popT != null && popT >= 0 ? easeOut(clamp(popT / .12)) : 0;
    paint(rectPts(x - 50, y - 250, 100, 90), { wash: '#1A0E08', ink: INK, sw: .8 });
    if (door > 0) {
      const out = Math.min(1, popT / .15) * (1 - seg(popT, 1.1, 1.3)), bob = Math.sin(popT * 18) * 12 * Math.exp(-popT * 2);
      for (let k = 0; k < 4; k++) inkLine([[x - 12 + (k % 2) * 24, y - 205 + 20 * k * out], [x + 12 - (k % 2) * 24, y - 195 + 20 * k * out]], 2, A2.steelLt, 'inkfine', 0);
      const cy = y - 205 + 110 * out + bob; token(x, cy, 42, { spin: .15 });
      paint([[x + 38, cy - 6], [x + 70, cy + 2], [x + 38, cy + 10]], { wash: TK.orange, ink: INK, sw: .6 });
      paint(ellPts(x + 16, cy - 14, 5, 7, 8), { wash: INK, ink: null });
    }
    push(); translate(x - 50, y - 250); scale(1 - 2 * door, 1); paint(rectPts(0, 0, 100, 90), { wash: '#8A5A36', ink: INK, sw: .8 }); pop();
    paint(ellPts(x, y + 30, 150, 150, 36), { wash: PAL.cream, ink: INK, sw: 1.4 });
    for (let k = 0; k < 12; k++) { const a = k * TAU / 12, r0 = k % 3 ? 128 : 112; inkLine([[x + Math.sin(a) * r0, y + 30 - Math.cos(a) * r0], [x + Math.sin(a) * 138, y + 30 - Math.cos(a) * 138]], k % 3 ? 1.5 : 4, INK, 'ink', 0); }
    inkLine([[x, y + 30], [x + Math.sin(min) * 120, y + 30 - Math.cos(min) * 120]], 5, INK, 'ink', 0);
    inkLine([[x, y + 30], [x + Math.sin(hour) * 80, y + 30 - Math.cos(hour) * 80]], 8, INK, 'ink', 0);
    paint(ellPts(x, y + 30, 10, 10, 10), { wash: TK.ember, ink: INK, sw: .6 });
    const sw = Math.sin(t * TAU / 1.4) * .3;
    inkLine([[x, y + 250], [x + Math.sin(sw) * 220, y + 250 + Math.cos(sw) * 220]], 2, TK.goldDk, 'inkfine', 0);
    token(x + Math.sin(sw) * 220, y + 250 + Math.cos(sw) * 220, 30, {});
    for (const wx of [x - 90, x + 90]) { inkLine([[wx, y + 250], [wx, y + 420]], 1.2, INK, 'inkfine', 0); paint(ellPts(wx, y + 450, 16, 34, 12), { wash: TK.goldDk, ink: INK, sw: .6 }); }
    pop();
  }
  // the laptop: lid 0 = shut … 1 = open; glow colour on the screen
  function laptop(x, y, lid, glow = null, s = 1) {
    push(); translate(x, y); scale(s);
    paint(rectPts(-110, -14, 220, 14, 1), { wash: '#8A95A1', ink: INK, sw: .9 });
    const h = 150 * lid;
    if (h > 4) { paint(rectPts(-100, -14 - h, 200, h, 1), { wash: '#3A4450', ink: INK, sw: .9 }); paint(rectPts(-88, -4 - h, 176, h - 20), { wash: glow || '#1A1F26', ink: null }); if (glow) glowAt(0, -14 - h / 2, 160, glow, 70); }
    pop();
  }
  // the token jar: fill 0..1, dead 0..1 (x-eyes + fire), tokens as coins inside
  function jar(t, x, y, fill, o = {}) {
    const w = o.w || 150, h = o.h || 190, n = Math.round(fill * 14);
    for (let i = 0; i < n; i++) {
      const cx = x - w / 2 + 28 + (i % 4) * ((w - 56) / 3) + (Math.floor(i / 4) % 2) * 12, cy = y - 22 - Math.floor(i / 4) * 34 + Math.sin(t * 3 + i) * 1.5;
      token(cx, cy, 16, { spin: o.spin ? t * 1.5 + i * .3 : .02 * i, burn: o.burn || 0 });
      if (o.dead > .3) { for (const d of [-1, 1]) inkLine([[cx - 6, cy - 6 * d], [cx + 6, cy + 6 * d]], 1.6, INK, 'inkfine', 0); }
    }
    if (o.dead > 0) fire(x, y - 22 - Math.ceil(n / 4) * 34 + 20, w * .8, 90 * o.dead, t, { k: o.dead, seed: 3 });
    paint([[x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2, y], [x - w / 2, y]], { wash: '#DCEFF2', washOp: 70, ink: INK, sw: 1.4 });
    paint(rectPts(x - w / 2 - 8, y - h - 28, w + 16, 30, 1), { wash: TK.ember, ink: INK, sw: 1 });
    inkLine([[x - w / 2 + 12, y - h + 20], [x - w / 2 + 12, y - 20]], 3, '#FFFFFF', 'inkfine', 0);
    for (let k = 1; k < 4; k++) inkLine([[x + w / 2 - 22, y - h * k / 4], [x + w / 2, y - h * k / 4]], k === 2 ? 3 : 1.5, INK, 'inkfine', 0);   // fill ticks, half marked
  }
  function armchair(x, y) {
    paint(rrPts(x - 130, y - 230, 260, 170, 30), { wash: '#6A3A4A', fill: '#4A2A38', fillOp: 70, tex: .5, ink: INK, sw: 1.2 });
    paint(rrPts(x - 150, y - 108, 300, 78, 20), { wash: '#7A4A5A', ink: INK, sw: 1.1 });
    for (const sd of [-1, 1]) paint(rrPts(x + sd * 150 - 30, y - 150, 60, 130, 18), { wash: '#6A3A4A', ink: INK, sw: 1 });
    for (const sd of [-1, 1]) paint(rectPts(x + sd * 120 - 8, y - 30, 16, 30), { wash: '#3A2418', ink: INK, sw: .6 });
  }
  function desk(x0, x1, y) {
    paint(rectPts(x0, y, x1 - x0, 24, 1), { wash: '#7A4A2E', ink: INK, sw: 1 });
    for (const lx of [x0 + 16, x1 - 34]) paint(rectPts(lx, y + 24, 18, ROOM.floor - y - 24), { wash: '#4A2A1E', ink: INK, sw: .7 });
  }
  // the whole night room with Clawd in the armchair. o: {min, hour, pop, lid, glow, fill, dead, eyes, mouth, lit}
  function nightRoom(t, o = {}) {
    back('#141218');
    roomWall(t, o.night ?? 1);
    cuckoo(t, ROOM.clock[0], ROOM.clock[1], 1, o.min ?? 0, o.hour ?? 0, o.pop ?? null);
    desk(ROOM.desk[0], ROOM.desk[1], ROOM.desk[2]);
    laptop(ROOM.laptop[0], ROOM.laptop[1], o.lid ?? 0, o.glow);
    jar(t, ROOM.jar[0], ROOM.jar[1], o.fill ?? 0, { w: 90, h: 130, dead: o.dead || 0 });
    if (o.gauge != null) ENK.gauge(1300, 640, 300, o.gauge, { glow: o.gaugeGlow || 0 });
    const [cx, cy] = ROOM.chair; armchair(cx, cy);
    clawd(cx, cy - 100, 12, { eyes: o.eyes || 'closed', mouth: o.mouth || 'smile', aL: -.3, aR: -.3, noShadow: true, dy: .2 * Math.sin(t * 1.2) });
    if (o.lit) paint(ellPts(cx, cy - 120, 170, 150, 22), { fill: o.lit, fillOp: 50, bleed: .3, ink: null });
    paint(rrPts(cx - 150, cy - 108, 300, 78, 20), { wash: '#7A4A5A', ink: INK, sw: 1.1 });          // seat front over the legs
  }

  // ======== E34 NEW (228.76–230.72) «Midnight.» — the minute hand clicks to 12, the door flips open, a coin-cuckoo bobs out ========
  const MN = { tick: 228.76, pop: 229.40 };
  function midnight(t) {
    const m = t < MN.tick ? -.035 * (1 - seg(t, 228.2, MN.tick)) : 0;
    nightRoom(t, { min: m - kick(t, [MN.tick], .2) * .06, hour: -.004, pop: t >= MN.pop ? t - MN.pop : null, fill: 0, lid: 0 });
  }
  scene('e34_midnight', 228.76, 230.72, midnight, [[228.76, 960, 520, 900], [230.719, 940, 500, 820, 1]], [[MN.pop, 8]]);
  window.EN2 = { eased, grey, CHOIR, ROOM, roomWall, cuckoo, laptop, jar, armchair, desk, nightRoom, TILE };
})();
