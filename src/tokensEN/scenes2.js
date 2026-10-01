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
    [76.72, 1000, 860, 560], [77.7, 990, 830, 620, 1], [78.6, 980, 790, 680, 1], [79.6, 960, 660, 920, 1], [80.4, 960, 580, 1000, 1], [81.979, 960, 560, 1000, 1],   // whole tower top to floor from 80.4, tiny Clawd in frame from the start
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


  // ======== E23+E24 NEW (137.00–152.04) «MORE GPUs — MORE TOKENS! MORE TOKENS — MORE AGENTS! MORE AGENTS — MORE TASKS! MORE TASKS — MORE TOKENS!» ========
  // One big ring, four stations round it: GPU (top) → tokens (right) → agents (bottom) → tasks (left) → back to tokens. Each sung noun slams
  // its station, a stream of stuff runs along the rim to the next one. Every line the ring spins faster; on the last «tokens» it blurs, sparks
  // and coins fly off the rim. User notes on draft 3: Clawd is a HAMSTER (round ears) running inside it like a hamster wheel, dizzier every lap.
  // Draft-4 note: the hamster was weak. Now: a big metal hamster wheel in the centre with HAMSTER-CLAWD (Codex layers hamBody / hamCheeks /
  // hamPaws in prop_art.js) running in it; a toothed rim drives four idler gears that turn the economy ring (a conveyor track round the wheel)
  // carrying GPUs → tokens → agents → tasks past the four stations. Every sung word he runs faster, his cheeks puff with more tokens,
  // sweat flies; on the last «tokens» (146.40) his eyes spiral and the whole machine blurs.
  const RG = { x: 950, y: 600, R: 290, ex: 370, ey: 470, words: [137.38, 138.64, 139.94, 141.34, 142.62, 143.84, 145.14, 146.40], ix: [0, 1, 1, 2, 2, 3, 3, 1], eco: 148.56 };
  const STA = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];                  // station angles on the track: GPU (top), tokens, agents, tasks
  const RATE = [.15, .25, .35, .45, .58, .72, .9, 1.15, 2.6];           // wheel rev/s before the first word and after each word
  const spinOf = t => {                                                   // integrated wheel angle
    const e = [137.0, ...RG.words, 1e9]; let a = 0;
    for (let i = 0; i < RATE.length; i++) { if (t <= e[i]) break; a += (Math.min(t, e[i + 1]) - e[i]) * RATE[i] * TAU; }
    return a;
  };
  const nWords = t => RG.words.filter(w => t >= w).length;
  const onTrack = (th, dr = 0) => [RG.x + Math.cos(th) * (RG.ex + dr), RG.y + Math.sin(th) * (RG.ey + dr)];
  const gearPts = (x, y, r, n, a, h = 8) => { const p = []; for (let k = 0; k < n * 4; k++) { const th = a + k * TAU / (n * 4), rr = k % 4 < 2 ? r + h : r; p.push([x + Math.cos(th) * rr, y + Math.sin(th) * rr]); } return p; };
  function station(i, x, y, k, t) {                                       // k = slam 0..1
    push(); translate(x, y); scale(1 + .25 * k); translate(-x, -y);
    if (k > .05) glowAt(x, y, 120, [TK.green, TK.yellow, '#6F8BE0', TK.yellowLt][i], 120 * k);
    if (i === 0) gpuCard(x, y, .6, t, { fans: t * 8, glow: k });
    else if (i === 1) for (let j = 0; j < 6; j++) token(x - 34 + (j % 3) * 34 + (Math.floor(j / 3) % 2) * 17, y + 22 - Math.floor(j / 3) * 34, 30, { spin: .1 * j });
    else if (i === 2) for (let j = 0; j < 3; j++) agentBot(x - 64 + j * 64, y + 40 - (j % 2) * 26, 6.5, t, { n: j + 1, rot: NOTXT, noShadow: true, eyes: 'happy', mouth: 'grin', aL: .6 + k * 1.2, aR: .6 + k * 1.2 });
    else for (let j = 0; j < 3; j++) { push(); translate(x - 18 + j * 16, y + 22 - j * 20); rotate((hash(j) - .5) * .4); paint(rectPts(-46, -46, 92, 92), { wash: [TK.yellow, '#9FE3A0', '#8EC3E6'][j], ink: INK, sw: 1 }); for (let q = 0; q < 3; q++) inkLine([[-30, -20 + q * 18], [24 - q * 10, -20 + q * 18]], 2, INK, 'inkfine', 0); pop(); }
    pop();
  }
  const itemOf = (i, x, y, t, r) => i === 0 ? gpuCard(x, y, .14, t, { rot: r }) : i === 1 ? token(x, y, 14, { spin: r }) : i === 2 ? A06.mini(x, y + 16, 2.6, { n: 3, eyes: 'happy', mouth: 'O', aL: 1.2, aR: 1.2 }) : paint(rectPts(x - 13, y - 13, 26, 26), { wash: TK.yellow, ink: INK, sw: .7 });
  // hamster-Clawd standing on the inside of the rim at angle th (π/2 = bottom); rate = wheel rev/s, n = words so far, spin = dizzy 0..1
  function hamster(th, t, rate, n, wk, spin) {
    const BW = 300, BH = BW * PROP_ART.hamBody[1] / PROP_ART.hamBody[0], feetR = RG.R - 26;
    const stride = t * (4 + rate * 9) * TAU, bob = Math.abs(Math.sin(stride / 2)) * (6 + 6 * Math.min(rate, 1.2));
    push(); translate(RG.x + Math.cos(th) * feetR, RG.y + Math.sin(th) * feetR); rotate(th - Math.PI / 2 + .1 + .05 * Math.min(rate, 1.5));
    const L = 44, by = 4 - L - BH / 2 - bob;                              // body centre (the feet are at 0)
    if (spin > 0) for (const d of [-1, 1]) ENK.layer('hamBody', d * 14 * spin, by, BW, { alpha: .3 * spin });   // motion ghosts
    ENK.layer('hamBody', 0, by, BW);
    // legs: four stubby orange legs cycling; when fast they smear into blur arcs
    for (const [lx, ph] of [[-.3, 0], [.3, .5], [-.12, .25], [.12, .75]]) {
      const hx = lx * BW, hy = by + BH * .5 - 6, sw = Math.sin(stride + ph * TAU);
      if (rate > .4) for (let q = 0; q < 3; q++) { const pts = []; for (let s = 0; s <= 8; s++) { const a = Math.PI / 2 + (s / 8 - .5) * (1.2 + .3 * q); pts.push([hx + Math.cos(a) * (L - q * 6), hy + Math.sin(a) * (L - q * 6)]); }
        inkLine(pts, 5 - q, ['#E9A27F', '#F2C2A8', '#F7DCCB'][q], 'ink', .5); }
      const a = Math.PI / 2 + sw * (rate > .4 ? .6 : .45);
      inkLine([[hx, hy], [hx + Math.cos(a) * L, hy + Math.sin(a) * L]], 10, INK, 'ink', 0);
      inkLine([[hx, hy], [hx + Math.cos(a) * (L - 3), hy + Math.sin(a) * (L - 3)]], 6, '#D97757', 'ink', 0);
    }
    // eyes: Clawd's two tall black blocks → straining slits → wide → spirals
    for (const d of [-1, 1]) {
      const ex = d * BW * .17, ey = by - BH * .14;
      if (spin > 0) { paint(ellPts(ex, ey, 24, 24, 16), { wash: '#FFFDF2', ink: INK, sw: 1.2 }); const pts = []; for (let s = 0; s <= 30; s++) { const a = s * .45 + t * 14 * d, r = s * .7; pts.push([ex + Math.cos(a) * r, ey + Math.sin(a) * r]); } inkLine(pts, 1.4, INK, 'inkfine', .5); }
      else if (n >= 6) { paint(ellPts(ex, ey, 17, 19, 14), { wash: '#FFFDF2', ink: INK, sw: 1 }); paint(ellPts(ex, ey + 2, 5, 5, 8), { wash: INK, ink: null }); }
      else { paint(rrPts(ex - 10, ey - 15, 20, 30, 7), { wash: INK, ink: null }); if (n >= 3) inkLine([[ex - d * 16, ey - 28], [ex + d * 12, ey - 20]], 3, INK, 'ink', 0); }
    }
    // cheeks: the stuffed token pouches, fuller every word (wk = the word kick)
    const cw = BW * Math.min(1.25, .62 + .08 * n + .1 * wk), ch = cw * PROP_ART.hamCheeks[1] / PROP_ART.hamCheeks[0];
    ENK.layer('hamCheeks', 0, by + BH * .24, cw, { sy: Math.min(1, 118 / ch) });
    ENK.layer('hamPaws', 0, by + BH * .3 + 4 * Math.sin(stride), BW * .36);
    // sweat flying off the head
    for (let q = 0; q < Math.max(0, n - 2) * 2; q++) { const d = q % 2 ? 1 : -1, u = frac(t * 1.7 + hash(q + 11)), x = d * (BW * .4 + u * 120), y = by - BH * .35 - 60 * u + 140 * u * u;
      paint([[x, y - 13], [x + 7, y + 2], [x, y + 8], [x - 7, y + 2]], { wash: '#BFE3F7', ink: INK, sw: .6 }); }
    pop();
  }
  function ringScene(t) {
    back(A2.gunDk);
    A03.hall(t, { lamps: [560, 1360], floor: 1200 });
    paint(rectPts(-400, 1200, W + 800, 700), { wash: '#2A2D33', fill: '#1C1E22', fillOp: 80, tex: .5, ink: INK, sw: .8 });
    const cx = RG.x, cy = RG.y, R = RG.R, ang = spinOf(t), n = nWords(t), blur = seg(t, 146.4, 146.9), spin = seg(t, 146.4, 146.7);
    const rate = RATE[n], wk = kick(t, RG.words, .12), ringA = ang * (R + 42) / ((RG.ex + RG.ey) / 2);
    const jit = blur * 3;
    // the stand: an A-frame from the axle to the floor
    for (const d of [-1, 1]) inkLine([[cx, cy], [cx + d * 300, 1204]], 16, A2.steel, 'ink', 0);
    // the wheel: dark drum behind, spokes, the hamster, then the rim (two hoops + rungs) and its outer gear teeth
    paint(gearPts(cx, cy, R + 26, 44, ang, 14), { wash: A2.gunmetal, ink: INK, sw: 1.4 });
    paint(ellPts(cx, cy, R + 26, R + 26, 64), { wash: A2.steel, ink: INK, sw: 1.6 });
    paint(ellPts(cx, cy, R - 26, R - 26, 48), { wash: '#1C1F24', ink: INK, sw: 2 });
    if (blur < 1) for (let k = 0; k < 8; k++) { const a = ang + k * TAU / 8; inkLine([[cx, cy], [cx + Math.cos(a) * (R - 26), cy + Math.sin(a) * (R - 26)]], 5, A2.steel, 'ink', 0); }
    if (blur > 0) paint(ellPts(cx, cy, R - 26, R - 26, 48), { fill: A2.steel, fillOp: 70 * blur, tex: .3, ink: null });
    paint(ellPts(cx, cy, 34, 34, 16), { wash: TK.yellow, ink: INK, sw: 1.2 });
    hamster(Math.PI / 2 - Math.min(.3, rate * .12), t, rate, n, wk, spin);
    paint(ellPts(cx, cy, R + 12, R + 12, 64), { ink: A2.steelLt, sw: 3 });
    for (let k = 0; k < 36; k++) { const a = ang + k * TAU / 36;
      if (blur > .6 && k % 3) continue;
      inkLine([[cx + Math.cos(a) * (R - 24), cy + Math.sin(a) * (R - 24)], [cx + Math.cos(a) * (R + 10), cy + Math.sin(a) * (R + 10)]], 4, k % 9 ? A2.steelLt : TK.yellow, 'ink', 0); }
    if (blur > 0) for (let k = 0; k < 5; k++) paint(ellPts(cx, cy, R - 20 + k * 10, R - 20 + k * 10, 48), { ink: [TK.yellow, TK.orange, TK.ember, TK.yellowLt, TK.orange][k], sw: 3 * blur });
    // the drive: four idler gears on the diagonals mesh the wheel's teeth and the economy track
    for (const g of [-3, -1, 1, 3]) { const th = g * Math.PI / 4, gr = 38, d = R + 40 + gr - 6, x = cx + Math.cos(th) * d, y = cy + Math.sin(th) * d;
      paint(gearPts(x, y, gr, 10, -ang * (R + 40) / gr, 10), { wash: TK.yellow, ink: INK, sw: 1.2 });
      paint(ellPts(x, y, 10, 10, 10), { wash: A2.gunDk, ink: INK, sw: .8 }); }
    // the economy ring: two rails with ties sliding round at the wheel's speed, stuff riding on it, each lap's quadrant turning into the next thing
    for (const dr of [-18, 18]) paint(ellPts(cx, cy, RG.ex + dr, RG.ey + dr, 72), { ink: A2.steelLt, sw: 2.2 });
    for (let k = 0; k < 64; k++) { const th = ringA + k * TAU / 64; inkLine([onTrack(th, -18), onTrack(th, 18)], 2.5, k % 8 ? A2.steel : TK.ember, 'ink', 0); }
    for (let k = 0; k < 20; k++) {
      const th = ringA * 1 + k * TAU / 20, rel = ((th - STA[0]) % TAU + TAU) % TAU, i = Math.floor(rel / (Math.PI / 2)), off = rel - i * Math.PI / 2;
      if (off < .32 || off > Math.PI / 2 - .32) continue;                   // hidden inside the stations
      for (let g = blur > 0 ? 2 : 0; g >= 0; g--) { const [x, y] = onTrack(th - g * .05 * blur); itemOf(i, x, y, t, th); }
    }
    // the four stations on the track, slamming on their words
    for (let i = 0; i < 4; i++) {
      const k = Math.max(0, ...RG.words.map((w, j) => { const a = t - w; return RG.ix[j] === i && a >= 0 && a < .35 ? Math.exp(-a * 9) : 0; }));
      const [x, y] = onTrack(STA[i]); station(i, x + jit * Math.sin(t * 53 + i), y + jit * Math.cos(t * 47 + i), k, t);
    }
    // on the blur: sparks off the rim and tokens flung out of his cheeks
    if (blur > 0) {
      for (let q = 0; q < 10; q++) { const a0 = hash(q) * TAU, age = frac(t * 1.6 + hash(q + 3)), th = a0 + ang, r = R + age * 300;
        token(cx + Math.cos(th) * r, cy + Math.sin(th) * r, 13, { spin: t * 5 + q, burn: age }); }
      sparks(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R, frac(t * 3) * .35, Math.floor(t * 3), 12, 200);
    }
  }
  // ends on «The economy is WORKING!» (148.56): from there the EN pitch deck (scenes3 eco_deck)
  scene('e23_loop', 137.0, RG.eco, ringScene, [[137.0, 950, 620, 1060], [148.559, 950, 625, 1000, 1]], RG.words.map(w => [w, w === 146.40 ? 18 : 9]));

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
    if (t >= TH.nobody) return park(t);
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
    // the teacher's desk (left), the teacher asleep on it, glasses pushed up
    tdesk(500, 900, 180);
    clawd(500, 905, 12, { eyes: 'closed', mouth: 'flat', rot: .25, aL: -.4, aR: -.4, noShadow: true, dy: .3 * Math.sin(t * 1.3) });
    paint(rectPts(445, 770, 50, 14, 1), { wash: '#2A2A30', ink: INK, sw: .5 }); paint(rectPts(510, 770, 50, 14, 1), { wash: '#2A2A30', ink: INK, sw: .5 });
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
    [157.46, 900, 640, 1040], [TH.nobody - .01, 900, 650, 1020, 1], [TH.nobody, 960, 640, 1000], [TH.you, 960, 660, 960, 1], [162.859, 960, 720, 880, 1],
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
  // ======== the held «…more» (194.32–210.0): the money pile grows on every beat ========
  // User notes on draft 3: the pile GROWS ON EVERY BEAT with a bump + a small shake (bigger on the downbeats). A narrow tall peak so it stays inside
  // the 3:4 frame; shareholders in top hats up to their necks at its foot; agents on the summit hold one note (going red, then blue), the CEO
  // conducts, a medic agent brings an oxygen mask; a short blank odometer above grows a cell every downbeat.
  const BN = { a: 194.32, hold: 194.32, mask: 199.0, end: 209.88 };
  const PBEATS = EN_BEATS.filter(b => b >= BN.a - .01 && b < BN.end), PDOWN = new Set(EN_DOWNBEATS.filter(b => b >= BN.a - .01 && b < BN.end));
  const pileK = t => {                                                     // 0..1 growth: a step per beat (a double step on downbeats), each with an overshoot bump
    let k = 0; const unit = 1 / PBEATS.reduce((a, b) => a + (PDOWN.has(b) ? 2 : 1), 0);
    for (const b of PBEATS) { if (t < b) break; const s = (PDOWN.has(b) ? 2 : 1) * unit, a = t - b; k += s * (a > .25 ? 1 : 1 + .6 * Math.sin(a / .25 * Math.PI) * (1 - a / .25) + (easeOut(clamp(a / .12)) - 1)); }
    return k;
  };
  function mound(t) { const k = pileK(t), H = 300 + 520 * k, sg = 170 + 40 * k; return x => 1060 - H * Math.exp(-Math.pow((x - 960) / sg, 2)); }
  function bench(t) {
    back('#1C1F24');
    A03.hall(t, { lamps: [560, 1360], floor: 1060 });
    paint(rectPts(-400, 1060, W + 800, 700), { wash: '#2A2D33', fill: '#1C1E22', fillOp: 80, tex: .5, ink: INK, sw: .8 });
    // the pile
    const h = mound(t), pts = [[420, 1100]]; for (let x = 420; x <= 1500; x += 30) pts.push([x, h(x)]); pts.push([1500, 1100]);
    paint(pts, { wash: TK.gold, fill: TK.goldDk, fillOp: 70, tex: .6, ink: INK, sw: 1.2 });
    for (let i = 0; i < 70; i++) { const x = 500 + hash(i) * 920, y = lerp(h(x), 1080, hash(i + 9) * .9) + 6; if (y < 1075) token(x, y, 14 + hash(i + 3) * 10, { spin: hash(i) }); }
    const lb = PBEATS.filter(b => t >= b).pop(), la = lb == null ? 9 : t - lb;          // coins bouncing on the last beat
    if (la < .5) for (let i = 0; i < 8; i++) { const x = 960 + (hash(i + lb * 7) - .5) * 360, v = 300 + hash(i + 2) * 300; token(x, h(x) - v * la + 1400 * la * la, 15, { spin: t * 5 + i }); }
    // draft 4: no counter, no medic, no singers — the pile, two agents shovelling coins onto it on every beat,
    // and Clawd pushing his token up the left slope (the intro's Sisyphus), on the summit on the last beat
    const lbi = PBEATS.filter(b => t >= b).length, la2 = lb == null ? 9 : t - lb;
    [[1190, 0], [1275, 1]].forEach(([x, n]) => {                            // shovellers: scoop down between beats, fling on the beat
      const up = la2 < .5 ? Math.exp(-la2 * 6) : 0;
      agentBot(x, 1056, 11, t, { n: 80 + n, rot: NOTXT, flip: true, noShadow: true, eyes: 'narrow', mouth: 'grin', emote: lbi > 12 ? 'sweat' : null, aL: .2 + 1.8 * up, aR: .2 + 1.8 * up });
      const bx = x - 40, by = 1000 - 120 * up;                               // the shovel blade
      inkLine([[x - 10, 1010], [bx, by]], 5, '#7A4A2E', 'ink', 0); paint(rotPts(rectPts(bx - 26, by - 10, 40, 22), bx, by, -.5 + up), { wash: A2.steel, ink: INK, sw: .8 });
      if (lb != null && la2 < .45) for (let k = 0; k < 3; k++) { const q = clamp(la2 / .45), tx = lerp(bx, 1010 - n * 40 - k * 25, q), ty = lerp(by, h(tx) - 10, q) - Math.sin(q * Math.PI) * 160; token(tx, ty, 14, { spin: t * 6 + k }); }
    });
    // Clawd + his token: one shove per beat up the left slope (x 690 → 870), the token reaches the peak on the last beat
    const NB = PBEATS.length, pp = Math.min(1, (lbi - 1 + (lb == null ? 0 : easeOut(clamp(la2 / .3)))) / Math.max(1, NB - 1)), cxp = lerp(680, 850, Math.max(0, pp));
    const sl = Math.atan2(h(cxp + 10) - h(cxp - 10), 20), tkx = cxp + 105 * Math.cos(sl), tky = h(tkx) - 64;   // the token rests against his hands along the slope
    push(); translate(tkx, tky); rotate(t * 1.5); token(0, 0, 64, { spin: .02 }); pop();
    clawd(cxp, h(cxp) + 6, 13, { walk: t * 4, rot: sl + .25, eyes: pp >= 1 ? 'spark' : 'narrow', mouth: pp >= 1 ? 'grin' : 'flat', aL: 1.3, aR: 1.3, emote: pp > .5 && pp < 1 ? 'sweat' : null, noShadow: true });
  }
  scene('e31_bench', BN.a, 210.0, bench, [[BN.a, 940, 800, 820], [209.99, 960, 620, 1000, 1]], PBEATS.map(b => [b, PDOWN.has(b) ? 7 : 3]));   // odometer, peak, CEO and shareholders whole

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
