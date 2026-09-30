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
  const rowT = r => r === 0 ? 76.80 : r === 1 ? 77.66 : 78.22 + (r - 2) * .26;
  const rowN = r => 1 + Math.floor(r / 2);
  function tower(t) {
    back(A2.gunDk);
    A03.hall(t, { lamps: [560, 1360], floor: TW.floor });
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
    clawd(1290, TW.floor + 2, 9, { eyes: 'look', lookY: -1, mouth: t > TW.top ? 'o' : 'flat', emote: t > TW.top ? 'sweat' : null, aL: .2, aR: .2 });
  }
  scene('e12_tower', 76.72, 81.98, tower, [
    [76.72, 960, 560, 960], [78.6, 960, 560, 1000, 1], [80.4, 960, 520, 1080, 1], [81.3, 970, 430, 860, 1], [81.979, 975, 410, 820, 1],
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
  scene('e13_report', 81.98, 87.60, report, [
    [81.98, 970, 600, 1000], [83.5, 990, 600, 960, 1], [85.0, 1000, 580, 940, 1], [87.599, 1000, 560, 880, 1],
  ], [[RP.thud, 18]]);

  // ======== E14 NEW (87.60–92.86) pre-chorus 2 = S1 again, word for word 47.42 s later: the server hall, the floor splits, the bull ========
  const RE = 47.42;
  scene('e14_bull2', 87.60, 92.86, t => s1(t - RE), [
    [87.60, 960, 600, 1000], [90.10, 960, 660, 900, 1], [91.10, 960, 600, 1080], [92.859, 960, 590, 1040, 1],
  ], [[43.68 + RE, 24]]);

  // ======== E19+E20 NEW (124.48–129.02) «Why?» — the choir turns its heads; «So intelligence gets cheaper»: the tag shrinks, the bill unrolls ========
  const WY = { why: 124.74, turn: 125.37, turned: 125.76, cheap: 126.88 };
  const CHOIR = [];                                                        // [x, y, row] in 3 risers, the asker in the front row
  for (const [row, y, n] of [[0, 950, 5], [1, 1025, 4], [2, 1100, 5]]) for (let i = 0; i < n; i++) CHOIR.push([960 + (i - (n - 1) / 2) * 180, y, row]);
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
    const bill = eased(t, 127.3, 129.0);
    if (bill > 0) {
      const x = 1250, w = 170, len = bill * 1350, top = -250;
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
    [124.48, 960, 700, 960], [WY.why, 960, 700, 960], [WY.turned, 960, 760, 860, 1], [WY.cheap, 1000, 680, 960], [128.2, 1060, 560, 1080, 1], [129.019, 1060, 540, 1100, 1],
  ], [[WY.why, 8]]);


  // ======== E23+E24 NEW (139.38–152.04) «MORE TOKENS — MORE AGENTS — MORE TASKS — MORE TOKENS! The economy is WORKING!» ========
  // One machine that feeds itself: GPUs drop into the press → tokens ride the belt into the dispenser → agents pop out and walk to the ticket
  // printer → the tickets ride a glass pipe back up. Its loose end dangles by the press until the last «MORE TOKENS» (146.40): it plugs in,
  // flash, everything runs ×3. Clawd runs a hamster wheel in the middle, faster every line. «The economy is WORKING!»: the CEO applauds
  // on the roof, the camera drops to the output tray, and exactly one empty wrapper falls in.
  const LP = { pairs: [139.62, 142.18, 144.78, 146.40], plug: 146.40, econ: 148.56, wrap: 150.24 };
  const lpSpeed = t => 1 + LP.pairs.filter(p => t >= p).length * .5 + (t >= LP.plug ? 1.5 : 0);
  const PIPE = [[1120, 1000], [1470, 1000], [1500, 900], [1500, 180], [1460, 120], [760, 120], [700, 170]];   // printer → up the right → over → press
  function pipePt(u) {                                                     // point u∈[0,1] along PIPE
    const L = []; let tot = 0; for (let i = 1; i < PIPE.length; i++) { const d = Math.hypot(PIPE[i][0] - PIPE[i - 1][0], PIPE[i][1] - PIPE[i - 1][1]); L.push(d); tot += d; }
    let d = u * tot; for (let i = 0; i < L.length; i++) { if (d <= L[i]) { const k = d / L[i]; return [lerp(PIPE[i][0], PIPE[i + 1][0], k), lerp(PIPE[i][1], PIPE[i + 1][1], k)]; } d -= L[i]; } return PIPE[PIPE.length - 1];
  }
  function loop(t) {
    back(A2.gunDk);
    A03.hall(t, { lamps: [700, 1300], floor: 1060 });
    const sp = lpSpeed(t), plugK = kick(t, [LP.plug], .5), ph = t * sp;
    // the press, fed by a chute of GPUs from the ceiling
    const hits = []; for (let x = Math.ceil(t * sp * 1.5) - 3; x <= Math.ceil(t * sp * 1.5) + 1; x++) hits.push(x / (sp * 1.5));
    paint([[590, -300], [690, -300], [690, 200], [590, 200]], { wash: A2.steel, fill: A2.gunDk, fillOp: 80, tex: .5, ink: INK, sw: 1 });
    for (let i = 0; i < 3; i++) { const y = lerp(-200, 230, frac(ph * .4 + i / 3)); gpuCard(640, y, .22, t, { rot: Math.PI / 2 }); }
    press(500, 200, 280, 520, t, hits, { seed: 2 });
    // the belt: press → dispenser
    conveyor(560, 700, 560, t, { items: ['token'], speed: 140 * sp, gap: 110, legs: 330, h: 34 });
    dispenser(1240, 760, t, .5 + .5 * kick(t, hits.map(h => h + .1), .3));
    // agents: out of the dispenser, walk left to the printer, get turned into a ticket
    for (let i = 0; i < 4; i++) {
      const u = frac(ph * .22 + i / 4), x = lerp(1180, 820, u), m = move('walk', t * sp, i);
      agentBot(x, 1052, 7.5, t, { n: 50 + i, rot: NOTXT, walk: m.walk, flip: true, eyes: 'happy', mouth: 'smile', noShadow: true, aL: .3, aR: 1.2 });
    }
    // the ticket printer
    paint(rectPts(700, 900, 180, 160, 1), { wash: PAL.teal, fill: mixCol(PAL.teal, INK, .3), fillOp: 70, tex: .5, ink: INK, sw: 1 });
    paint(rectPts(730, 920, 120, 22), { wash: '#0A0B0D', ink: INK, sw: .6 });
    for (let i = 0; i < 3; i++) paint(ellPts(740 + i * 22, 990, 7, 7, 8), { wash: [TK.led, TK.yellow, TK.ember][i], ink: null });
    const tk = frac(ph * .9); paint(rectPts(760, 920 - tk * 50, 60, 50 * tk + 4), { wash: PAL.cream, ink: INK, sw: .5 });
    inkLine([[880, 1000], [1120, 1000]], 26, '#BFE3E6', 'ink', 0);                                // glass pipe from the printer
    // the glass pipe back to the press: loose end dangles, plugs in on the last «MORE TOKENS»
    const plugged = t >= LP.plug, dang = plugged ? 0 : 1, swing = Math.sin(t * 3.1) * 40 * dang;
    const P = PIPE.map((q, i) => i === PIPE.length - 1 ? [q[0] + swing + 60 * dang, q[1] + 80 * dang] : q);
    inkLine(P, 30, INK, 'ink', 0); inkLine(P, 24, '#BFE3E6', 'ink', 0); inkLine(P.map(([x, y]) => [x - 5, y - 5]), 4, '#FFFFFF', 'inkfine', 0);
    for (let i = 0; i < 9; i++) { const [x, y] = pipePt(frac(ph * .18 + i / 9)); paint(rectPts(x - 10, y - 7, 20, 14), { wash: PAL.cream, ink: INK, sw: .4 }); }
    if (plugK > 0) { flash(plugK * .6, '#FFFFFF'); sparks(700, 170, t - LP.plug, 5, 14, 200); }
    // hamster wheel in the middle, Clawd running, faster each line
    const wx = 1000, wy = 430, R = 170, spin = t * sp * 1.6;
    paint(ellPts(wx, wy, R, R, 40), { ink: INK, sw: 2 });
    paint(ellPts(wx, wy, R - 14, R - 14, 40), { ink: A2.steelLt, sw: 1.2 });
    for (let i = 0; i < 12; i++) { const a = spin + i * TAU / 12; inkLine([[wx + Math.cos(a) * (R - 14), wy + Math.sin(a) * (R - 14)], [wx + Math.cos(a) * R, wy + Math.sin(a) * R]], 1.2, A2.steelLt, 'inkfine', 0); }
    inkLine([[wx, wy], [wx - 60, 690]], 5, A2.gunmetal, 'ink', 0); inkLine([[wx, wy], [wx + 60, 690]], 5, A2.gunmetal, 'ink', 0);
    clawd(wx, wy + R - 16, 10, { walk: spin * 1.3, dy: -Math.abs(Math.sin(spin * 4)) * .8, eyes: sp > 3 ? 'swirl' : 'normal', mouth: sp > 2 ? 'O' : 'flat', emote: sp > 2 ? 'sweat' : null, aL: .6 + .4 * Math.sin(spin * 8), aR: .6 - .4 * Math.sin(spin * 8), noShadow: true });
    // E24: the CEO on the roof of the machine, applauding; the output tray and the one wrapper
    const econ = t - LP.econ;
    if (econ > -.4) {
      const up = easeOut(clamp((econ + .4) / .4)), clap = Math.abs(Math.sin(t * 14));
      ceoClawd(1000, 250 - 260 * up + 260, 15, { noShadow: true, eyes: 'happy', mouth: 'grin', aL: 1 + clap * .6, aR: 1 + clap * .6 });
      if (econ > 0) A03.confetti(econ, 30, [560, -100, 880, 700], 5);
    }
    const tx = 1500, ty = 1050;                                                 // the output tray, under the dispenser's far side
    paint([[tx - 120, ty - 70], [tx + 120, ty - 70], [tx + 100, ty], [tx - 100, ty]], { wash: A2.steel, fill: A2.gunDk, fillOp: 60, tex: .4, ink: INK, sw: 1.2 });
    paint([[tx - 100, ty - 60], [tx + 100, ty - 60], [tx + 85, ty - 10], [tx - 85, ty - 10]], { wash: '#15171B', ink: null });
    paint(rectPts(tx - 30, ty - 250, 60, 180), { wash: A2.gunmetal, ink: INK, sw: .8 });              // the spout
    const wk = t - LP.wrap;
    if (wk > -.5) {                                                             // one empty, crumpled wrapper flutters down into the tray
      const k = clamp((wk + .5) / .5), y = lerp(ty - 250, ty - 40, easeIn(k)), r = Math.sin(t * 9) * .6 * (1 - k);
      push(); translate(tx + Math.sin(t * 6) * 20 * (1 - k), y); rotate(r);
      paint([[-22, -8], [-8, -16], [6, -10], [24, -14], [18, 6], [4, 14], [-16, 10]], { wash: TK.gold, fill: TK.goldDk, fillOp: 60, ink: INK, sw: .7 });
      inkLine([[-12, -4], [10, 4]], .6, TK.goldDk, 'inkfine', .4); pop();
      if (wk > 0 && wk < .4) sparks(tx, ty - 40, wk, 9, 5, 60);
    }
  }
  scene('e23_loop', 139.38, 152.04, loop, [
    [139.38, 1000, 600, 1080], [144.7, 960, 600, 1080, 1], [LP.plug, 900, 500, 900], [147.6, 1000, 560, 1080, 1],
    [LP.econ, 1000, 460, 1000, 1], [149.5, 1360, 820, 760, 1], [150.1, 1440, 900, 620, 1], [152.039, 1440, 890, 600, 1],
  ], [[LP.plug, 16], [LP.wrap, 8]]);

  // ======== E26 NEW (157.46–162.86) «Writes your thesis. Grades it too. No one's working. Including you.» ========
  // A robot arm scribbles a paper stack, slams a red tick on it, crowns it with a mortarboard. Around it: agents asleep at their desks.
  // On «Including you» the camera finds our Clawd in a striped deck chair, who slowly turns to look into the lens.
  const TH = { tick: 158.66, cap: 159.46, nobody: 160.10, you: 162.12 };
  function ik(bx, by, tx, ty, L1, L2, bend = 1) {                         // 2-bone IK → elbow point
    const dx = tx - bx, dy = ty - by, d = clamp(Math.hypot(dx, dy), 1, L1 + L2 - 1), a = Math.atan2(dy, dx), c = clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1);
    return [bx + Math.cos(a - bend * Math.acos(c)) * L1, by + Math.sin(a - bend * Math.acos(c)) * L1];
  }
  function desk(x, y, w) {
    paint(rectPts(x - w / 2, y, w, 22, 1), { wash: '#7A4A2E', ink: INK, sw: .9 });
    for (const lx of [x - w / 2 + 14, x + w / 2 - 30]) paint(rectPts(lx, y + 22, 16, 150), { wash: '#4A2A1E', ink: INK, sw: .6 });
  }
  function thesis(t) {
    back('#1C1F24');
    A03.hall(t, { lamps: [960], floor: 1060, dark: .2 });
    // the paper stack on the centre desk
    desk(960, 560, 360);
    const px = 960, py = 560;
    for (let i = 0; i < 9; i++) paint(rectPts(px - 110 + hash(i) * 6, py - 14 - i * 13, 220, 13), { wash: i % 2 ? PAL.cream : '#F3EBDC', ink: INK, sw: .4 });
    const topY = py - 14 - 9 * 13;
    // the arm: base on the ceiling, pen scribbling → stamp → cap
    const bx = 960, by = 60, L1 = 260, L2 = 250;
    let tgt;
    if (t < TH.tick - .3) tgt = [px - 70 + 140 * frac(t * 1.3) + 10 * Math.sin(t * 40), topY - 4 + 6 * Math.sin(t * 33)];
    else if (t < TH.tick) tgt = [px, topY - 110 * (1 - seg(t, TH.tick - .3, TH.tick - .05))];
    else if (t < TH.cap - .35) tgt = [px, topY - 90 * seg(t, TH.tick + .1, TH.tick + .4)];
    else tgt = [px + 30 * (1 - seg(t, TH.cap - .35, TH.cap)), topY - 70 + 60 * seg(t, TH.cap - .35, TH.cap) - 70 * seg(t, TH.cap + .2, TH.cap + .6)];
    const el = ik(bx, by, tgt[0], tgt[1], L1, L2, -1);
    paint(rectPts(bx - 60, by - 400, 120, 400), { wash: A2.gunmetal, ink: INK, sw: 1 });
    for (const [a, b] of [[[bx, by], el], [el, tgt]]) { inkLine([a, b], 26, INK, 'ink', 0); inkLine([a, b], 20, TK.orange, 'ink', 0); }
    for (const [x, y] of [[bx, by], el]) { paint(ellPts(x, y, 22, 22, 14), { wash: A2.steel, ink: INK, sw: .8 }); }
    // the tool on the end: pen, then the stamp
    const stamping = t >= TH.tick - .3 && t < TH.cap - .35;
    if (stamping) { paint(rectPts(tgt[0] - 26, tgt[1] - 40, 52, 30), { wash: TK.ember, ink: INK, sw: .8 }); paint(rectPts(tgt[0] - 36, tgt[1] - 12, 72, 12), { wash: TK.emberDk, ink: INK, sw: .7 }); }
    else if (t < TH.tick) inkLine([[tgt[0], tgt[1] - 60], [tgt[0], tgt[1]]], 7, TK.soot, 'ink', 0);
    // the scribble on the top page (lines grow) and the red tick
    const lines = Math.min(6, Math.floor((t - 157.46) * 4));
    for (let i = 0; i < lines; i++) inkLine([[px - 80, topY + 3], [px - 80 + 150 * (i === lines - 1 ? frac(t * 4) : 1), topY + 3]], .5, '#8A8480', 'inkfine', 0);
    if (t >= TH.tick) {
      const k = backOut(seg(t, TH.tick, TH.tick + .2));
      push(); translate(px + 60, topY - 30); scale(k); inkLine([[-40, 0], [-12, 28], [44, -40]], 9, TK.ember, 'ink', .2); pop();
      if (t - TH.tick < .3) sparks(px, topY, t - TH.tick, 4, 10, 140);
    }
    // the mortarboard, carried in and set on the stack
    if (t > TH.cap - .35) {
      const on = t >= TH.cap, cx = on ? px : tgt[0], cy = on ? topY - 12 : tgt[1] + 18;
      paint([[cx - 120, cy - 30], [cx, cy - 60], [cx + 120, cy - 30], [cx, cy]], { wash: TK.soot, ink: INK, sw: 1 });
      paint(rectPts(cx - 55, cy - 20, 110, 30), { wash: TK.soot, ink: INK, sw: .8 });
      const sw = Math.sin(t * 5) * 14; inkLine([[cx, cy - 30], [cx + 90, cy - 20], [cx + 96 + sw * .3, cy + 40]], 2, TK.yellow, 'inkfine', .5);
      paint(ellPts(cx + 96 + sw * .3, cy + 46, 8, 12, 8), { wash: TK.yellow, ink: INK, sw: .5 });
    }
    // everybody asleep at their desks
    for (const [x, y, n] of [[600, 860, 1], [1010, 860, 2], [720, 1030, 3]]) {
      desk(x, y, 250);
      agentBot(x, y + 2, 8, t, { n: 60 + n, rot: NOTXT, eyes: 'closed', mouth: 'flat', noShadow: true, dy: .3 * Math.sin(t * 1.3 + n), aL: -.4, aR: -.4 });
      emote('zzz', x + 55, y - 90, 14, clamp(seg(t, TH.nobody - .6 + n * .15, TH.nobody + n * .15)));
    }
    // Clawd in the striped deck chair (front right). On «you.» it turns to the lens.
    const cx = 1290, cy = 1050, turn = eased(t, TH.you - .5, TH.you);
    for (let i = 0; i < 6; i++) paint([[cx - 110 + i * 38, cy - 170 + i * 12], [cx - 72 + i * 38, cy - 158 + i * 12], [cx - 72 + i * 38 + 30, cy - 30], [cx - 110 + i * 38 + 30, cy - 30]], { wash: i % 2 ? PAL.cream : TK.ember, ink: INK, sw: .5 });
    inkLine([[cx - 110, cy - 170], [cx - 50, cy]], 4, '#7A4A2E', 'ink', 0); inkLine([[cx + 118, cy - 100], [cx + 80, cy]], 4, '#7A4A2E', 'ink', 0);
    clawd(cx, cy - 30, 9, { rot: -.25 * (1 - turn), eyes: t < TH.you - .5 ? 'shades' : 'look', lookX: 0, lookY: .2, mouth: turn > .9 ? 'flat' : 'smile', aL: 1.6 * (1 - turn) + .2, aR: 1.6 * (1 - turn) + .2, noShadow: true });
  }
  scene('e26_thesis', 157.46, 162.86, thesis, [
    [157.46, 960, 400, 820], [TH.cap, 960, 360, 760, 1], [TH.nobody, 960, 600, 1080, 1], [161.4, 1100, 740, 960, 1], [TH.you, 1290, 930, 520], [162.859, 1290, 935, 480, 1],
  ], [[TH.you, 10]]);

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

  // ======== E31+E31b NEW (189.06–204.78) «One point up on the benchmark score — worth half a trillion more! …more» ========
  // A crane lifts the top of a benchmark bar by a hair (a magnifier shows it). On «half a trillion» a gold coin mountain erupts out of the floor,
  // shareholders in top hats up to their necks in it. The hold «…more»: agents on the summit sing one note, going red, then blue; the CEO
  // conducts with his clicker, an agent runs up with an oxygen mask; behind, a blank odometer keeps growing new cells to the right while
  // the camera backs away from it.
  const BN = { lift: 190.90, boom: 192.90, hold: 194.22, mask: 199.0 };
  const tophat = (u, sw) => { paint(rectPts(-3.4 * u, -11.6 * u, 6.8 * u, 3.8 * u), { wash: TK.soot, ink: PAL.ink, sw: sw * .6 }); paint(rectPts(-4.6 * u, -8.1 * u, 9.2 * u, .7 * u), { wash: TK.soot, ink: PAL.ink, sw: sw * .6 }); paint(rectPts(-3.4 * u, -9 * u, 6.8 * u, .7 * u), { wash: TK.ember, ink: null }); };
  function mound(t) {                                                      // height profile of the coin mountain at x
    const k = easeOut(seg(t, BN.boom, BN.boom + .6)) * (1 + .03 * Math.sin(t * 20) * (1 - seg(t, BN.boom, BN.boom + 1)));
    return x => 1060 - k * 560 * Math.exp(-Math.pow((x - 960) / 330, 2));
  }
  function bench(t) {
    back('#1C1F24');
    A03.hall(t, { lamps: [560, 1360], floor: 1060 });
    // the odometer: a row of blank drums, one more cell every half-second of the hold
    const cells = 4 + (t > BN.hold ? Math.floor((t - BN.hold) * 2.2) : 0);
    for (let i = 0; i < cells; i++) {
      const x = 700 + i * 76, y = 170, pop = clamp((t - BN.hold - (i - 4) / 2.2) / .15);
      if (i >= 4 && pop <= 0) continue;
      paint(rectPts(x, y - 50, 70, 100 * (i < 4 ? 1 : pop), 1), { wash: '#15171B', ink: INK, sw: 1 });
      for (let k = 0; k < 3; k++) { const yy = y - 50 + frac(t * (1 + i * .3) + k / 3) * 100; inkLine([[x + 6, yy], [x + 64, yy]], 1.5, A2.steelLt, 'inkfine', 0); }
    }
    paint(rectPts(680, 110, 20 + Math.min(4, cells) * 76, 120), { ink: A2.hazard, sw: 3 });
    // the benchmark: one tall bar; a crane hook lifts its top a hair; a magnifier shows the gap
    const up = easeOut(seg(t, BN.lift - .2, BN.lift + .2)) * 8, bh = 520, bx = 960, by = 1060, boom = t >= BN.boom;
    if (!boom || t < BN.boom + .3) {
      paint(rectPts(bx - 70, by - bh, 140, bh, 1), { wash: PAL.teal, fill: mixCol(PAL.teal, INK, .3), fillOp: 60, tex: .5, ink: INK, sw: 1.2 });
      paint(rectPts(bx - 70, by - bh - up - 12, 140, 12 + up), { wash: TK.led, ink: INK, sw: .8 });
      inkLine([[bx, -400], [bx, by - bh - up - 50]], 2, INK, 'inkfine', 0);
      inkLine([[bx - 14, by - bh - up - 50], [bx, by - bh - up - 12], [bx + 14, by - bh - up - 50]], 5, A2.steel, 'ink', .5);
      if (t > BN.lift - .4) {
        const mx = bx + 190, my = by - bh - 30, R = 90;
        inkLine([[mx - R * .7, my + R * .7], [mx - R * 1.6, my + R * 1.6]], 12, '#7A4A2E', 'ink', 0);
        paint(ellPts(mx, my, R, R, 28), { wash: '#DCEFF2', washOp: 140, ink: INK, sw: 2 });
        paint(rectPts(mx - R * .7, my - 10 - up * 5, R * 1.4, 12 + up * 5), { wash: TK.led, ink: null });
        inkLine([[mx - R * .7, my + 2], [mx + R * .7, my + 2]], 1.5, INK, 'inkfine', 0);
      }
    }
    // the coin mountain: bursts up through the floor on «half a trillion»
    if (boom) {
      const h = mound(t), a = t - BN.boom;
      if (a < .5) { flash((1 - a / .5) * .6, TK.yellowLt); rubble(960, 1060, 700, a, 8); }
      const pts = [[300, 1100]]; for (let x = 300; x <= 1620; x += 40) pts.push([x, h(x)]); pts.push([1620, 1100]);
      paint(pts, { wash: TK.gold, fill: TK.goldDk, fillOp: 70, tex: .6, ink: INK, sw: 1.2 });
      for (let i = 0; i < 60; i++) { const x = 340 + hash(i) * 1240, y = lerp(h(x), 1080, hash(i + 9) * .9) + 6; token(x, y, 14 + hash(i + 3) * 10, { spin: hash(i) + t * (a < 1 ? 3 : 0) }); }
      for (let i = 0; i < 16 && a < 1.5; i++) { const x = 960 + (hash(i) - .5) * 600, v = 500 + hash(i + 4) * 500; token(x + (hash(i + 7) - .5) * 400 * a, 700 - v * a + 900 * a * a, 16, { spin: t * 4 + i }); }
      // shareholders, top hats, up to their necks in coins
      for (const [x, n] of [[560, 1], [720, 2], [1200, 3], [1370, 4]]) {
        const y = h(x) + 40, cheer = Math.abs(Math.sin(t * 7 + n));
        clawd(x, y, 9, { col: '#8A8A96', dk: '#5A5A66', lt: '#C8C8D2', draw: tophat, eyes: 'happy', mouth: 'grin', aL: 1.4 + cheer * .5, aR: 1.4 + cheer * .5, noShadow: true });
        paint([[x - 70, y - 20], [x - 30, y - 34], [x, y - 22], [x + 40, y - 36], [x + 70, y - 18], [x + 70, y + 60], [x - 70, y + 60]], { wash: TK.gold, ink: null });
        for (let k = 0; k < 4; k++) token(x - 50 + k * 33, y - 22 - (k % 2) * 8, 16, {});
      }
    }
    // the hold: singers on the summit hold one note, go red, then blue; an agent brings an oxygen mask; the CEO conducts
    if (t > BN.hold - .3) {
      const h = mound(t), hk = seg(t, BN.hold, 203), col = hk < .5 ? mixCol('#6F8BE0', '#E0283F', hk * 2) : mixCol('#E0283F', '#4A6AD8', (hk - .5) * 2);
      for (const [x, n] of [[880, 1], [960, 2], [1040, 3]]) {
        const y = h(x) + 4, pulse = 1 + .05 * Math.sin(t * 13 + n);
        agentBot(x, y, 8 * pulse, t, { n: 70 + n, rot: NOTXT, col, dk: mixCol(col, INK, .35), eyes: hk > .6 ? 'swirl' : 'closed', mouth: 'O', aL: 1.6, aR: 1.6, noShadow: true, emote: hk > .45 ? 'sweat' : null });
      }
      const ma = t - BN.mask;                                                    // the medic agent
      if (ma > -1.5) {
        const k = clamp((ma + 1.5) / 1.5), x = lerp(1560, 1110, easeOut(k)), y = h(x) + 4;
        agentBot(x, y, 7, t, { n: 77, rot: NOTXT, walk: t * 3 * (k < 1 ? 1 : 0), flip: true, eyes: 'scared', mouth: 'o', aL: 1.2, aR: 1.2, noShadow: true });
        paint(ellPts(x - 60, y - 70, 18, 14, 12), { wash: '#BFE3E6', ink: INK, sw: .7 });
        inkLine([[x - 60, y - 60], [x - 20, y + 10], [x + 30, y - 20]], 2, '#7ACBD0', 'inkfine', .6);
        paint(rrPts(x + 20, y - 40, 40, 70, 12), { wash: TK.green, ink: INK, sw: .7 });
      }
      ceoClawd(440, 1050, 14, { noShadow: true, eyes: 'closed', mouth: 'smile', click: kick(t, EN_GRID, .15), aR: 1.2 + .6 * Math.sin(t * 5), aL: .6 + .5 * Math.sin(t * 5 + 1) });
    }
  }
  scene('e31_bench', 189.06, 204.78, bench, [
    [189.06, 960, 560, 1000], [BN.lift - .4, 1080, 520, 700, 1], [BN.lift + .5, 1080, 520, 700, 1], [BN.boom, 960, 600, 1080],
    [BN.hold, 960, 560, 1000, 1], [BN.mask + .5, 1000, 540, 1100, 1], [204.779, 1060, 480, 1400, 1],
  ], [[BN.lift, 6], [BN.boom, 20]]);

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

  // ======== E34 NEW (228.76–230.82) «Midnight.» — a cuckoo clock with no numbers: the hand clicks to 12, the door flips open, a coin-cuckoo bobs out ========
  const MN = { tick: 228.76, pop: 229.40 };
  function midnight(t) {
    back('#141218');
    paint(rectPts(-400, -400, W + 800, 1500), { wash: '#221C2A', fill: '#141218', fillOp: 90, tex: .5, ink: null });
    paint(rectPts(1180, 160, 300, 380, 1), { wash: '#1F2550', ink: INK, sw: 2 }); paint(ellPts(1360, 260, 46, 46, 18), { wash: PAL.cream, ink: null });   // window, moon
    inkLine([[1330, 160], [1330, 540]], 3, INK, 'ink', 0); inkLine([[1180, 350], [1480, 350]], 3, INK, 'ink', 0);
    const x = 900, y = 470;
    paint([[x - 200, y - 150], [x, y - 330], [x + 200, y - 150], [x + 200, y + 250], [x - 200, y + 250]], { wash: '#7A4A2E', fill: '#4A2A1E', fillOp: 70, tex: .6, ink: INK, sw: 1.4 });
    paint([[x - 230, y - 140], [x, y - 360], [x + 230, y - 140]], { ink: '#4A2A1E', sw: 8 });
    const door = t >= MN.pop ? easeOut(seg(t, MN.pop, MN.pop + .12)) : 0;
    paint(rectPts(x - 50, y - 250, 100, 90), { wash: '#1A0E08', ink: INK, sw: .8 });
    if (door > 0) {
      const b = t - MN.pop, out = Math.min(1, b / .15) * (1 - seg(b, 1.1, 1.3)), bob = Math.sin(b * 18) * 12 * Math.exp(-b * 2);
      for (let k = 0; k < 4; k++) inkLine([[x - 12 + (k % 2) * 24, y - 205 + 20 * k * out], [x + 12 - (k % 2) * 24, y - 195 + 20 * k * out]], 2, A2.steelLt, 'inkfine', 0);
      const cy = y - 205 + 110 * out + bob; token(x, cy, 42, { spin: .15 });
      paint([[x + 38, cy - 6], [x + 70, cy + 2], [x + 38, cy + 10]], { wash: TK.orange, ink: INK, sw: .6 });
      paint(ellPts(x + 16, cy - 14, 5, 7, 8), { wash: INK, ink: null });
    }
    push(); translate(x - 50, y - 250); scale(1 - 2 * door, 1); paint(rectPts(0, 0, 100, 90), { wash: '#8A5A36', ink: INK, sw: .8 }); pop();
    paint(ellPts(x, y + 30, 150, 150, 36), { wash: PAL.cream, ink: INK, sw: 1.4 });
    for (let k = 0; k < 12; k++) { const a = k * TAU / 12, r0 = k % 3 ? 128 : 112; inkLine([[x + Math.sin(a) * r0, y + 30 - Math.cos(a) * r0], [x + Math.sin(a) * 138, y + 30 - Math.cos(a) * 138]], k % 3 ? 1.5 : 4, INK, 'ink', 0); }
    const mA = t < MN.tick ? -TAU * (1 - seg(t, 228.2, MN.tick)) * .02 : 0, snap = kick(t, [MN.tick], .2) * .06;
    inkLine([[x, y + 30], [x + Math.sin(mA - snap) * 120, y + 30 - Math.cos(mA - snap) * 120]], 5, INK, 'ink', 0);
    inkLine([[x, y + 30], [x + Math.sin(-.02) * 80, y + 30 - Math.cos(-.02) * 80]], 8, INK, 'ink', 0);
    paint(ellPts(x, y + 30, 10, 10, 10), { wash: TK.ember, ink: INK, sw: .6 });
    const sw = Math.sin(t * TAU / 1.4) * .3;                                  // pendulum + weights
    inkLine([[x, y + 250], [x + Math.sin(sw) * 220, y + 250 + Math.cos(sw) * 220]], 2, TK.goldDk, 'inkfine', 0);
    token(x + Math.sin(sw) * 220, y + 250 + Math.cos(sw) * 220, 30, {});
    for (const wx of [x - 90, x + 90]) { inkLine([[wx, y + 250], [wx, y + 420]], 1.2, INK, 'inkfine', 0); paint(ellPts(wx, y + 450, 16, 34, 12), { wash: TK.goldDk, ink: INK, sw: .6 }); }
    // Clawd leaning back on the floor below, eyes shut, smiling
    clawd(1250, 1060, 11, { rot: -.2, eyes: 'closed', mouth: 'smile', aL: -.5, aR: -.5 });
  }
  scene('e34_midnight', 228.76, 230.82, midnight, [[228.76, 980, 560, 1000], [230.819, 960, 520, 900, 1]], [[MN.pop, 8]]);

  window.EN2 = { eased, grey, CHOIR };
})();
