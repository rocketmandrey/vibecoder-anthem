// tokensEN/v8_c.js: round v8 items 8–12, the whole bridge as ONE native set on the new track (real 113.70–157.34 = v1 112.556–137.0).
// The server cathedral, built symmetric around x 960: rack pillars, the token rose over the pulpit, two lancets (left 540 / right 1380),
// rack pews with candles in front. One slow camera, pushes only.
//   113.70 power-up: the pews light row by row on the downbeats, then the windows, the preacher rises (ex scenes5.js powerup)
//   126.40 «We're gonna need more electricity.»: through both windows the city goes dark block by block, the pylons bend toward
//          the church, power arcs into the rack pillars, the cathedral glows brighter
//   129.20 «More copper.»: copper organ pipes grow behind the pulpit, the right lancet turns into a glowing copper-coil panel
//   131.86 «More water.» the next town's reservoir drops in front of the left lancet, the CEO sips it through a straw in the break,
//   137.24 «More water. Why?» it's dry, the choir asks
//   141.56 «So intelligence gets cheaper.» / 146.06 «And when intelligence gets cheaper,» the preacher speaks: left tag (intelligence)
//          falls $20 → $0.002, right tag (a GPU) climbs
//   151.72 «we're gonna need...» lights go out on the downbeats, slow push-in; 155.74 «MORE GPUs!» he turns DJ in place:
//          shades, headphones, decks rise out of the pulpit, acid green
(() => {
  const INK = PAL.ink;
  const { kick, native, back } = ENK;
  const RA = 113.70, RB = 157.34, A = N2O(RA), B = N2O(RB);
  // replaced: the old powerup (scenes5.js), bridge_needs (scenes3.js), e19_why (scenes2.js); RU a06/a07 lose to this real chapter
  for (const n of ['en_powerup', 'en_bridge_needs', 'en_e19_why']) { const c = CH.find(q => q.name === n); if (c) CH.splice(CH.indexOf(c), 1); }
  for (let i = EN_PUNCH.length - 1; i >= 0; i--) if (EN_PUNCH[i][0] >= A && EN_PUNCH[i][0] < B) EN_PUNCH.splice(i, 1);

  // ---- real-time cues (seconds of the new track) ----
  const WD = EN_WORDS.map(([v, w], i) => ({ s: O2N(v), w, n: EN_WORDS[i + 1] ? O2N(EN_WORDS[i + 1][0]) : 1e9 }));
  const TALKW = WD.filter(x => x.s > 126 && x.s < 155).map(x => x.s), talk = s => kick(s, TALKW, .25);   // an arm beat on every spoken word
  const rw = (w, near) => { const k = x => x.toLowerCase().replace(/[^a-z]/g, ''), m = WD.filter(q => k(q.w) === k(w)); return m.reduce((b, q) => Math.abs(q.s - near) < Math.abs(b.s - near) ? q : b).s; };
  const C = { elec: rw('electricity', 127.34), more1: rw('More', 129.2), copper: rw('copper', 129.54), water1: rw('water', 132.24), water2: rw('water', 137.6),
    why: rw('Why', 138.68), cheap1: rw('cheaper', 142.9), and: rw('And', 146.06), cheap2: rw('cheaper', 147.84), need: rw('need', 152.12), gpus: rw('More', 155.74) };
  const DB = EN_DOWNBEATS.map(O2N), BT = EN_BEATS.map(O2N);
  const PDB = DB.filter(d => d > RA + .01 && d < 126.4);                       // power-up downbeats 115.0 … 125.62
  const SPEECH = WD.filter(q => (q.s > 126.3 && q.s < 128.5) || (q.s > 141.4 && q.s < 152.6) || (q.s > 155.6 && q.s < 157.3))
    .map(q => [q.s, Math.min(q.n - .05, q.s + .1 * q.w.replace(/[^a-z]/gi, '').length + .1)]);
  const SING = [[C.more1, 130.16], [131.86, 133.02], [137.24, 138.2], [C.why, 139.38]];
  const GULPS = BT.filter(b => b > 134 && b < 136.6);                          // the sips in the break, on the beats
  const inSpan = (s, list) => list.some(([a, b]) => s >= a && s < b);
  const mouthAt = s => { const w = SPEECH.find(([a, b]) => s >= a && s < b); return w ? (frac((s - w[0]) * 7) < .62 ? 'O' : 'o') : null; };

  // ---- the set ----
  const WIN = [[565, -1], [1355, 1]], WT = 150, WW = 160, WH = 420;            // lancet cx, side; top, width, height
  function arch(cx, top, w, h) {
    const hw = w / 2, sy = top + .866 * w, p = [[cx - hw, top + h], [cx - hw, sy]];
    for (let i = 1; i <= 7; i++) { const a = Math.PI + i / 7 * Math.PI / 3; p.push([cx + hw + Math.cos(a) * w, sy + Math.sin(a) * w]); }
    for (let i = 1; i <= 7; i++) { const a = -Math.PI / 3 + i / 7 * Math.PI / 3; p.push([cx - hw + Math.cos(a) * w, sy + Math.sin(a) * w]); }
    p.push([cx + hw, top + h]);
    return p;
  }
  const NB = 5, blockH = (cx, i) => 70 + hash(cx * .01 + i * 3.7) * 110;
  // when block i of a window goes dark: the far blocks first, toward the church, over «more electricity»
  const offAt = (side, i) => { const r = side < 0 ? i : NB - 1 - i; return lerp(127.0, 128.5, r / (NB - 1)) + (side > 0 ? .08 : 0); };
  function lancet(cx, side, s, o) {
    const hw = WW / 2, sy = WT + .866 * WW, bot = WT + WH, L = o.L;
    paint(arch(cx, WT - 16, WW + 32, WH + 24), { wash: '#3B3F4A', fill: '#1C1F24', fillOp: 90, tex: .5, ink: INK, sw: .8 });
    paint(arch(cx, WT, WW, WH), { wash: mixCol('#0E1230', '#24306A', L * (1 - o.elec * .6)), ink: null });
    // the night city outside, its lit windows, block by block
    for (let i = 0; i < NB; i++) {
      const bw = WW / NB, x = cx - hw + i * bw, h = blockH(cx, i), off = ease(seg(s, offAt(side, i), offAt(side, i) + .12));
      paint(rectPts(x + 1, bot - h, bw - 2, h), { wash: mixCol('#3A3F5E', '#15172A', off), ink: null });
      if (off < .99) for (let r = 0; r < Math.floor(h / 22); r++) for (const c of [.3, .7])
        if (hash(cx + i * 9 + r * 3 + c) > .3) paint(rectPts(x + bw * c - 3, bot - h + 10 + r * 22, 6, 8), { wash: '#FFD866', washOp: 230 * (1 - off) * (.6 + .4 * L), ink: null });
    }
    // a pylon in the street: leans toward the church while the power is sucked in, its wires stream sparks to the cathedral
    const px = cx - side * 22, pb = bot - 6, ph = 150, bend = o.bend * side * .42;
    push(); translate(px, pb); rotate(bend);
    const gold = mixCol('#8A8070', '#FFD21F', o.elec), leg = (f, d) => [d * lerp(26, 5, f), -ph * f];
    for (const d of [-1, 1]) inkLine([leg(0, d), leg(1, d)], 1.4, gold, 'ink', 0);
    for (let k = 0; k < 4; k++) { inkLine([leg(k / 4, -1), leg((k + 1) / 4, 1)], .7, gold, 'inkfine', 0); inkLine([leg(k / 4, 1), leg((k + 1) / 4, -1)], .7, gold, 'inkfine', 0); }
    for (const f of [.75, .92]) inkLine([[-34, -ph * f], [34, -ph * f]], 1.4, gold, 'ink', 0);
    pop();
    const tip = [px + Math.sin(bend) * ph * .92 + side * -34 * Math.cos(bend), pb - Math.cos(bend) * ph * .92];
    const edge = [cx - side * (hw - 2), WT + WH * .42];
    inkLine([tip, [lerp(tip[0], edge[0], .5), Math.max(tip[1], edge[1]) + 18], edge], .8, '#2A2C38', 'inkfine', .5);
    if (o.elec > .05) for (let k = 0; k < 4; k++) {                          // sparks run along the wire into the church
      const f = frac(s * 1.6 + k / 4), q = f < .5 ? [lerp(tip[0], lerp(tip[0], edge[0], .5), f * 2), lerp(tip[1], Math.max(tip[1], edge[1]) + 18, f * 2)] : [lerp(lerp(tip[0], edge[0], .5), edge[0], f * 2 - 1), lerp(Math.max(tip[1], edge[1]) + 18, edge[1], f * 2 - 1)];
      paint(ellPts(q[0], q[1], 4, 4, 6), { wash: '#FFF3A0', washOp: 255 * o.elec, ink: null });
    }
    // lead came, the arch outline, a sheen
    inkLine([[cx, sy - 30], [cx, bot]], 1.1, '#15131C', 'ink', 0);
    for (const y of [sy, sy + (bot - sy) / 2]) inkLine([[cx - hw, y], [cx + hw, y]], 1.1, '#15131C', 'ink', 0);
    paint(arch(cx, WT, WW, WH), { ink: '#15131C', sw: 1.4 });
    if (L > .5) paint(ellPts(cx - hw * .45, WT + WH * .45, WW * .07, WH * .28, 10, 0, .2), { wash: '#FFFFFF', washOp: 40 * L, ink: null });
  }
  // copper organ pipes behind the pulpit, tallest at the sides, they grow on «More» / «copper»
  // …and keep GROWING after «copper»: on every downbeat to the lights-out all pipes stretch and a new pair sprouts outside (to 11 a side)
  const OGROW = DB.filter(d => d > C.copper + .3 && d < 151.7);
  function organ(s, glow) {
    const up = OGROW.reduce((a, d) => a + backOut(seg(s, d, d + .3)), 0);
    for (const sd of [-1, 1]) for (let i = 10; i >= 0; i--) {
      const t0 = i < 3 ? C.more1 : i < 6 ? C.copper : OGROW[(i - 6) * 2], g = t0 == null ? 0 : backOut(seg(s, t0 + i % 3 * .06, t0 + i % 3 * .06 + .32)); if (g <= 0) continue;
      const own = i < 6 ? up : OGROW.slice((i - 6) * 2 + 1).reduce((a, d) => a + backOut(seg(s, d, d + .3)), 0);
      const x = 960 + sd * (46 + i * 24) - 12,   // ponytail: 24 px pitch so all 11 a side stay between the lancets (inner frame 661 / 1259)
       top = Math.max(i < 4 ? 330 : 120, 640 - g * (170 + Math.min(i, 5) * 46) - 14 * own);
      if (glow > .05) glowAt(x + 12, top + 20, 40, '#FF9A3A', 60 * glow);
      paint(rectPts(x, top, 24, 640 - top), { wash: mixCol('#8A4A22', '#D8873A', .5 + .5 * glow), fill: '#6A3418', fillOp: 60, tex: .4, ink: INK, sw: .6 });
      paint(rectPts(x + 5, top + 6, 5, 640 - top - 10), { wash: '#FFC890', washOp: 120 + 100 * glow, ink: null });
      paint(ellPts(x + 12, top + 52, 8, 6, 10), { wash: '#2A1408', ink: INK, sw: .4 });
      paint(ellPts(x + 12, top, 12, 4, 12), { wash: '#F2B27A', ink: INK, sw: .5 });
    }
  }
  // ---- v12 variants: ?var_church=a|b|c (render.mjs --var=church:b), default c (v13 verdict) ----
  //   a: rack COLONNADE in strict perspective + a raised data-centre floor whose tile rows light toward the altar on the downbeats;
  //      sermon: two lancets (left the city going dark = electricity, right the town reservoir draining = water)
  //   b: an ORGAN WALL of racks whose LED cells are stained glass, lit from the centre outward one tower pair per downbeat;
  //      sermon: one window (the token rose) + a brass RESERVOIR gauge plaque that drains
  //   c: PEWS of racks with candle LEDs lit row by row toward the altar, the preacher lit from behind by a halo;
  //      sermon (v13): the next town's lake in a tall window left, his long straw drinks it dry; right, a far night city loses its lights line by line
  // all three: copper organ pipes grow behind the preacher, one intelligence price tag that really gets cheaper on each line
  const VAR = new URLSearchParams(location.search).get('var_church') || (window.BTT_VAR || {}).church || 'c';
  window.BTT_VAR = { ...(window.BTT_VAR || {}), church: VAR };
  const VP = [960, 560], FY = 830;                                              // vanishing point, the wall / floor line
  const on = (s, t0) => t0 == null ? 0 : clamp((s - t0) / .12);                // a light switching on at t0
  const blip = (s, t0) => t0 == null ? 0 : kick(s, [t0], .45);                 // its flash
  const softGlow = (x, y, rx, ry, col, op) => paint(ellPts(x, y, rx, ry, 20), { fill: col, fillOp: op, bleed: .3, tex: .2, border: .1, ink: null });
  // floor rows in perspective: row j is the band between y FR[j] (far) and FR[j + 1] (near); tile seams run to the vanishing point
  const FR = [0, 1, 2, 3, 4, 5].map(j => VP[1] + 270 * 1.63 * Math.pow(1.25, j));   // 1000 … 1902
  const seamX = (m, y) => 960 + m * 120 * (y - VP[1]) / 270;
  function floorRow(j, col, sw = .5) {
    const y0 = FR[j], y1 = FR[j + 1];
    for (let m = -7; m < 7; m++) {
      const q = [[seamX(m, y0), y0], [seamX(m + 1, y0), y0], [seamX(m + 1, y1), y1], [seamX(m, y1), y1]];
      paint(q, { wash: col(m), ink: '#15131C', sw });
    }
  }
  // the town reservoir level: «More water» drains a quarter, each sip on the break beats another 15 %, the second «water» empties it
  const lvlAt = s => clamp(1 - .25 * ease(seg(s, C.water1, C.water1 + .45)) - GULPS.reduce((a, g) => a + .15 * ease(seg(s, g, g + .3)), 0) - .3 * ease(seg(s, C.water2, C.water2 + .5)));
  const pct = l => Math.round(l * 100) + '%';
  function plate(cx, y, title, val, col) {                                     // a small brass name plate under a window
    paint(rectPts(cx - 92, y, 184, 80, 1), { wash: '#E8AA38', fill: '#A8741A', fillOp: 60, tex: .4, ink: INK, sw: .7 });
    paint(rectPts(cx - 84, y + 7, 168, 66), { wash: '#2B2233', ink: null });
    letter(title, cx, y + 24, 22, '#E8D8B0', { font: ruFont(22), ink: false });
    if (val) letter(val, cx, y + 54, 34, col, { font: ruFont(34), ink: false });
  }

  // ---- a: the colonnade ----
  const COLS = [1.4, 1.18, 1].map(sc => ({ sc, dx: 560 * sc, w: 80 * sc, bot: VP[1] + 270 * sc, h: 780 * sc }));   // near pair first
  function colonnade(s, ph, k) {                                               // k: [near, mid, far pair] light 0..1 (+ flash)
    COLS.forEach((c, i) => {
      const kk = k[i], top = c.bot - c.h;
      for (const sd of [-1, 1]) {
        const x = 960 + sd * c.dx - c.w / 2;
        if (ph === 1) {
          if (kk.v > .01) serverRack(x, top, c.w, c.h, s, { units: 12, seed: i * 4 + (sd > 0 ? 2 : 0) });
          else paint(rectPts(x, top, c.w, c.h), { wash: '#14121C', ink: INK, sw: .8 });
          paint(rectPts(x - 10 * c.sc, top - 26 * c.sc, c.w + 20 * c.sc, 28 * c.sc, 1), { wash: '#59636E', fill: '#2B2F36', fillOp: 90, tex: .5, ink: INK, sw: .7 });   // capital
          paint(rectPts(x - 8 * c.sc, c.bot - 4, c.w + 16 * c.sc, 22 * c.sc, 1), { wash: '#3B3F4A', ink: INK, sw: .6 });                                       // base
        } else if (kk.v > .01) softGlow(x + c.w / 2, top + c.h / 2, c.w * 1.4, c.h * .55, TK.green, (30 + 60 * kk.f) * kk.v);
      }
      if (ph === 1) {                                                         // the pointed rib vault springing from each pair
        const top2 = top - 26 * c.sc, d = c.dx, rib = [[960 - d, top2], [960 - d * .62, top2 - d * .5], [960, top2 - d * .7], [960 + d * .62, top2 - d * .5], [960 + d, top2]];
        inkLine(rib, 10 * c.sc, '#4A505E', 'ink', .5); inkLine(rib.map(([x, y]) => [x, y + 18 * c.sc]), 2.4 * c.sc, '#8A95A1', 'ink', .5);
      }
    });
  }
  function dcFloor(s, ph, rk) {                                                 // rk[j]: row j light (far 0 … near 4)
    for (let j = 0; j < 5; j++) {
      const r = rk[j], col = m => mixCol('#1E232C', Math.abs(m + .5) < 1 ? '#1F6B4A' : (m + j) % 2 ? '#2A3F55' : '#24364A', r.v * (.8 + .2 * r.f));
      if (ph === 1) floorRow(j, col, .5 + .2 * j);
      else if (r.v > .01) {                                                    // the LED strip along the row's near edge + a pool on the aisle
        const y = FR[j + 1];
        inkLine([[seamX(-7, y), y], [seamX(7, y), y]], (1.2 + .5 * j) * r.v, '#7DF9FF', 'ink', 0);
        softGlow(960, (FR[j] + y) / 2, 140 + 60 * j, (y - FR[j]) * .5, '#7DFFAE', (15 + 45 * r.f) * r.v);
      }
    }
  }

  // ---- b: the organ wall of racks ----
  const GLASS = ['#1E3F9A', '#2E6FD8', '#B4302A', '#E8AA38', '#2FA86B', '#8A1F3A', '#D8622A'];
  const TOWER_TOP = [470, 470, 470, 470, 300, 190, 110, 190, 300, 420];   // by |k|: low behind the preacher, peaks at |k| 6
  const TOWERS = []; for (let k = -9; k <= 9; k++) TOWERS.push({ k, a: Math.abs(k), x: 960 + k * 82, w: 76, top: TOWER_TOP[Math.abs(k)] });
  function organWall(s, ph, tk, boost) {                                        // tk[|k|]: tower pair light
    for (const T of TOWERS) {
      const r = tk[T.a], x0 = T.x - T.w / 2, v = clamp(r.v * (.8 + .2 * r.f) + boost);
      if (ph === 1) {
        paint([[x0, T.top], [T.x, T.top - T.w * .75], [x0 + T.w, T.top]], { wash: '#3B3F4A', ink: INK, sw: .6 });   // pointed crown
        paint(rectPts(x0, T.top, T.w, FY - T.top), { wash: '#1C1F24', ink: INK, sw: .8 });
        const rows = Math.floor((FY - T.top - 20) / 56);
        for (let i = 0; i < rows; i++) for (let c = 0; c < 2; c++) {          // the LED cells = the stained glass (mirror symmetric)
          const col = GLASS[Math.floor(hash(T.a * 5.3 + i * 2.7 + (T.k < 0 ? 1 - c : c) * 9.1) * GLASS.length)];
          paint(rectPts(x0 + 6 + c * 33, T.top + 10 + i * 56, 31, 50), { wash: mixCol('#15131C', col, v * (.85 + .15 * Math.sin(s * 3 + i + T.a))), ink: null });
        }
      } else if (r.v > .01 && T.a >= 4) {
        softGlow(T.x, (T.top + FY) / 2, T.w * .9, (FY - T.top) * .45, GLASS[T.a % GLASS.length], 35 * v);
        softGlow(T.x, FY + 60, T.w, 40, GLASS[(T.a + 2) % GLASS.length], 40 * v);              // its colour on the floor
      }
    }
  }
  function gaugePlaque(s, x, y, lvl) {                                         // b: the brass RESERVOIR gauge, hung on two chains
    for (const d of [-90, 90]) inkLine([[x + d, -400], [x + d, y + 6]], 1, '#8A8480', 'inkfine', 0);
    paint(rectPts(x - 115, y, 230, 400, 1), { wash: '#E8AA38', fill: '#A8741A', fillOp: 70, tex: .4, ink: INK, sw: 1 });
    paint(rectPts(x - 103, y + 12, 206, 376), { wash: '#FFF5E2', ink: INK, sw: .5 });
    letter('RESERVOIR', x, y + 40, 30, '#2B2233', { font: ruFont(30), ink: false });
    letter('next town', x, y + 70, 20, '#59636E', { font: ruFont(20), ink: false });
    const gx = x + 20, gt = y + 96, gh = 220;
    paint(rrPts(gx - 26, gt - 6, 52, gh + 12, 20), { wash: '#DDE7EE', ink: INK, sw: .8 });
    if (lvl > .01) paint(rectPts(gx - 18, gt + gh * (1 - lvl), 36, gh * lvl), { wash: lvl > .3 ? '#2E9FE8' : '#D8262A', ink: null });
    for (const [f, lb] of [[1, '100'], [.5, '50'], [0, '0']]) {
      inkLine([[gx - 40, gt + gh * (1 - f)], [gx - 28, gt + gh * (1 - f)]], 1, INK, 'ink', 0);
      letter(lb, gx - 48, gt + gh * (1 - f), 20, '#2B2233', { font: ruFont(20), align: 'right', ink: false });
    }
    paint(ellPts(gx, gt + gh + 22, 16, 9, 12), { wash: '#2E9FE8', washOp: 255 * lvl, ink: INK, sw: .5 });   // the tap
    letter(pct(lvl), x, y + 362, 44, lvl > .3 ? '#1B5FB0' : '#D8262A', { font: ruFont(44), ink: false });
  }

  // ---- c: the pews of racks with candle LEDs ----
  const PEWS = [2.3, 3.0, 3.8, 4.8].map(sc => ({ sc, y: VP[1] + 270 * sc, h: 45 * sc, a: 70 * sc, e: Math.min(340 * sc, 790) }));
  function pews(s, ph, pk) {                                                    // pk[r]: row r light (far 0 … near 3); spaced so no candle reaches the row behind, row 0 clears the choir
    PEWS.forEach((P, r) => {
      const k = pk[r], top = P.y - P.h;
      for (const sd of [-1, 1]) {
        const xa = 960 + sd * P.a, xb = 960 + sd * P.e, xl = Math.min(xa, xb), len = Math.abs(xb - xa);
        if (ph === 1) {
          const toVP = ([x, y]) => [x + (VP[0] - x) * .05, y - P.h * .35];
          paint([[xa, top], [xb, top], toVP([xb, top]), toVP([xa, top])], { wash: '#3B3F4A', ink: INK, sw: .5 });   // the seat top
          paint(rectPts(xl, top, len, P.h), { wash: '#232A33', fill: '#1C1F24', fillOp: 80, tex: .4, ink: INK, sw: .7 });
          const n = Math.max(3, Math.floor(len / (62 * P.sc))), uw = len / n, q = P.sc;
          for (let i = 0; i < n; i++) {                                         // one 2U server per slot: drive bays, LEDs, a vent; a candle on top
            const ux = xl + i * uw, sd2 = i + r * 7 + (sd > 0 ? 40 : 0), tick = Math.floor(s * 7);
            paint(rectPts(ux + 2, top + 3, uw - 4, P.h - 6), { wash: '#2B2F36', ink: '#15131C', sw: .5 });
            paint(rectPts(ux + 5 * q, top + P.h * .16, uw * .56, P.h * .4), { wash: '#15131C', ink: null });          // the drive bays
            for (let d = 0; d < 4; d++) paint(rectPts(ux + 6 * q + d * uw * .14, top + P.h * .2, uw * .1, P.h * .32), { wash: '#59636E', ink: null });
            for (let d = 0; d < 2; d++) {                                       // blinking status LEDs
              const lit = k.v > .5 && hash(sd2 * 3.1 + d * 7 + tick * 1.7) > .35;
              paint(rectPts(ux + uw * .7 + d * uw * .12, top + P.h * .24, 4 * q, 4 * q), { wash: lit ? (d ? TK.led : '#FFD21F') : '#15131C', ink: null });
            }
            inkLine([[ux + 6 * q, top + P.h * .72], [ux + uw - 6 * q, top + P.h * .72]], .5, '#59636E', 'inkfine', 0);   // the vent
            const cx = ux + uw / 2, ch = 10 * q, fl = 1 + .18 * Math.sin(s * 9 + i * 1.7 + r) * k.v;            // the candle on top
            paint(rectPts(cx - 3 * q, top - ch, 6 * q, ch), { wash: k.v > .3 ? '#FFF5E2' : '#59636E', ink: INK, sw: .3 });
            paint(ellPts(cx, top - ch - 5 * q * fl, 2.8 * q * fl, 5 * q * fl, 10), { wash: mixCol('#2B2F36', '#FFD21F', k.v), ink: null });
          }
          for (let c = 0; c < 2; c++) {                                         // a cable bundle sagging under the rack
            const yy = P.y - 3 + c * 3 * q, pts = []; for (let m = 0; m <= 6; m++) pts.push([xl + len * m / 6, yy + Math.sin(m / 6 * Math.PI * 3) * 4 * q]);
            inkLine(pts, 1.4 * q, c ? '#2E6FD8' : '#E8AA38', 'ink', .5);
          }
        } else if (k.v > .01) softGlow(xl + len / 2, top + P.h * .2, len * .55, P.h * .9, '#FFB43A', (30 + 50 * k.f) * k.v);
      }
    });
  }
  function backlight(s, k) {                                                     // c: the preacher lit from behind
    if (k < .02) return;
    softGlow(960, 520, 330, 330, '#FFB43A', 90 * k);
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * TAU + s * .05, a0 = a - .05, a1 = a + .05, r0 = 120, r1 = 620;
      paint([[960 + Math.cos(a0) * r0, 520 + Math.sin(a0) * r0], [960 + Math.cos(a0) * r1, 520 + Math.sin(a0) * r1], [960 + Math.cos(a1) * r1, 520 + Math.sin(a1) * r1], [960 + Math.cos(a1) * r0, 520 + Math.sin(a1) * r0]],
        { wash: '#FFD866', washOp: 45 * k, ink: null });
    }
    softGlow(960, 520, 200, 200, '#FFF3C8', 70 * k);
  }
  // c: an abstract mosaic lancet; lvl != null makes it the WATER window (its blue panes drain from the top), else POWER (flares with z)
  function mosaic(cx, s, L, pal, lvl, z) {
    const hw = WW / 2, sy = WT + .866 * WW, bot = WT + WH, rows = 7, cols = 4, ch = (bot - sy) / rows, cw = WW / cols, wl = lvl == null ? -1 : bot - lvl * (bot - sy);
    if (L > .3) glowAt(cx, WT + WH * .55, WW * 1.2, pal[1], 60 * L * (1 + z));
    paint(arch(cx, WT - 16, WW + 32, WH + 24), { wash: '#3B3F4A', fill: '#1C1F24', fillOp: 90, tex: .5, ink: INK, sw: .8 });
    paint(arch(cx, WT, WW, WH), { wash: mixCol('#100E18', pal[0], L * .7), ink: null });
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = cx - hw + c * cw, y = sy + r * ch, h = hash(r * 7.3 + c * 3.1 + cx), dry = lvl != null && y + ch / 2 < wl;
      const tri = h > .5 ? [[[x, y], [x + cw, y], [x, y + ch]], [[x + cw, y], [x + cw, y + ch], [x, y + ch]]] : [[[x, y], [x + cw, y], [x + cw, y + ch]], [[x, y], [x + cw, y + ch], [x, y + ch]]];
      tri.forEach((q, i) => {
        const col = dry ? (i ? '#59636E' : '#3B3F4A') : pal[Math.floor(hash(h * 13 + i * 5) * pal.length)];
        paint(q, { wash: mixCol('#100E18', col, Math.min(1, L * (1 + .4 * z))), ink: '#15131C', sw: .5 });
      });
    }
    const ry = WT + (sy - WT) * .62, rr = WW * .22;                             // the rosette in the arch head
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + s * .15; paint(ellPts(cx + Math.cos(a) * rr * .6, ry + Math.sin(a) * rr * .6, rr * .42, rr * .42, 10), { wash: mixCol('#100E18', pal[(i % 2) + 2], L), ink: '#15131C', sw: .4 }); }
    paint(ellPts(cx, ry, rr * .35, rr * .35, 10), { wash: mixCol('#100E18', '#FFF3C8', L), ink: '#15131C', sw: .4 });
    if (lvl != null && lvl < .999 && lvl > .01) inkLine([[cx - hw + 2, wl], [cx + hw - 2, wl]], 2, '#BFE8FF', 'ink', 0);   // the water line
    paint(arch(cx, WT, WW, WH), { ink: '#15131C', sw: 1.4 });
  }
  // a: the right lancet is the next town's reservoir in glass: sky, hills, the basin; the water sinks, the mud cracks
  function waterLancet(cx, s, L, lvl) {
    const hw = WW / 2, sy = WT + .866 * WW, bot = WT + WH, b0 = bot - 210, wy = lerp(bot - 4, b0, lvl);
    if (L > .3) glowAt(cx, WT + WH * .55, WW * 1.2, '#2E9FE8', 50 * L);
    paint(arch(cx, WT - 16, WW + 32, WH + 24), { wash: '#3B3F4A', fill: '#1C1F24', fillOp: 90, tex: .5, ink: INK, sw: .8 });
    paint(arch(cx, WT, WW, WH), { wash: mixCol('#141A30', '#8EC3E6', L), ink: null });
    paint(ellPts(cx + 30, sy + 10, 22, 22, 14), { wash: mixCol('#141A30', '#FFD866', L), ink: null });   // the sun
    paint([[cx - hw, b0 - 20], [cx - hw * .4, b0 - 70], [cx + hw * .2, b0 - 40], [cx + hw, b0 - 80], [cx + hw, b0 + 2], [cx - hw, b0 + 2]], { wash: mixCol('#141E16', '#5E8A4A', L), ink: null });
    for (let i = 0; i < 3; i++) { const hx = cx + hw * .25 + i * 18, hy = b0 - 50 - i * 4; paint(rectPts(hx, hy, 14, 14), { wash: mixCol('#1A1418', ['#E8AA38', '#F1E8D2', '#E27A92'][i], L), ink: '#15131C', sw: .3 }); }
    paint(rectPts(cx - hw, b0, WW, bot - b0), { wash: mixCol('#22180F', '#B98A5A', L), ink: null });   // the basin: mud
    if (lvl < .5) for (let i = 0; i < 6; i++) { const x = cx - hw + 18 + hash(i) * (WW - 36), y = b0 + 30 + hash(i + 3) * 150; inkLine([[x - 14, y], [x, y + 8], [x + 16, y - 3]], .7, '#5A3A22', 'inkfine', 0); }
    if (lvl > .01) {
      paint(rectPts(cx - hw, wy, WW, bot - wy), { wash: mixCol('#0E1A3A', '#2E9FE8', L), ink: null });
      inkLine([[cx - hw + 2, wy], [cx + hw - 2, wy]], 2, mixCol('#2A3A5A', '#BFE8FF', L), 'ink', 0);
    }
    for (const x of [cx - hw / 2, cx, cx + hw / 2]) inkLine([[x, sy - 20], [x, bot]], 1.1, '#15131C', 'ink', 0);   // lead came
    for (const y of [sy, b0, (b0 + bot) / 2]) inkLine([[cx - hw, y], [cx + hw, y]], 1.1, '#15131C', 'ink', 0);
    paint(arch(cx, WT, WW, WH), { ink: '#15131C', sw: 1.4 });
  }

  // c (v13): the NEXT TOWN by its lake, a tall picture window left of the pulpit; the chalice's long straw runs out into the lake and
  // every sip on the break beats pulls a quarter of it (lvlC), the boats settle on the mud, a fish flops
  const lvlC = s => clamp(1 - GULPS.reduce((a, g) => a + .25 * ease(seg(s, g - .1, g + .25)), 0));
  const LK = { cx: 540, top: 150, w: 210, h: 650 }, LK_W0 = 585, LK_W1 = 785;   // the lake's full / empty surface y
  const lakeY = l => lerp(LK_W1, LK_W0, l);
  function townLake(s, L, lvl) {
    const { cx, top, w, h } = LK, hw = w / 2, bot = top + h, sy = top + .866 * w, D = c => mixCol('#15131C', c, .35 + .65 * L);
    glowAt(cx, top + h * .6, w * 1.1, '#8EC3E6', 45 * L);
    paint(arch(cx, top - 16, w + 32, h + 24), { wash: '#3B3F4A', fill: '#1C1F24', fillOp: 90, tex: .5, ink: INK, sw: .9 });
    paint(arch(cx, top, w, h), { wash: D('#9CCBEA'), ink: null });                                   // sky
    paint(ellPts(cx + 55, sy - 40, 26, 26, 16), { wash: D('#FFD866'), ink: null });                     // sun
    paint([[cx - hw, 500], [cx - 40, 455], [cx + 30, 480], [cx + hw, 445], [cx + hw, 600], [cx - hw, 600]], { wash: D('#6E9A52'), ink: INK, sw: .5 });   // the hill
    [[-88, 470, '#E8AA38'], [-52, 458, '#F1E8D2'], [-16, 466, '#E27A92'], [22, 472, '#E8AA38'], [60, 462, '#F1E8D2']].forEach(([dx, y, c], i) => {   // the little town
      const x = cx + dx; paint(rectPts(x, y, 30, 30), { wash: D(c), ink: INK, sw: .5 });
      paint([[x - 4, y], [x + 15, y - 18], [x + 34, y]], { wash: D('#B4302A'), ink: INK, sw: .5 });
      paint(rectPts(x + 11, y + 14, 8, 16), { wash: D('#5A3A22'), ink: null });
    });
    paint([[cx + 92, 470], [cx + 100, 410], [cx + 108, 470]], { wash: D('#D8DEE6'), ink: INK, sw: .5 });   // a spire
    letter('NEXT TOWN', cx, 538, 24, '#F1E8D2', { font: ruFont(24), ink: false });
    paint(rectPts(cx - hw, 572, w, bot - 572), { wash: D('#A47A4E'), fill: D('#7A5232'), fillOp: 60, tex: .5, ink: null });   // the basin: mud
    if (lvl < .6) for (let i = 0; i < 8; i++) { const x = cx - hw + 20 + hash(i) * (w - 40), y = 610 + hash(i + 3) * 170; inkLine([[x - 16, y], [x, y + 9], [x + 18, y - 4]], .8, '#4A2E18', 'inkfine', 0); }
    const wy = lakeY(lvl);
    if (lvl > .005) {
      paint(rectPts(cx - hw, wy, w, bot - wy), { wash: D('#2E9FE8'), fill: D('#1B5FB0'), fillOp: 60, tex: .3, ink: null });
      for (let i = 0; i < 3; i++) inkLine([[cx - hw + 20 + i * 70, wy + 18 + i * 6], [cx - hw + 50 + i * 70, wy + 18 + i * 6]], .9, D('#BFE8FF'), 'inkfine', 0);
      inkLine([[cx - hw + 2, wy], [cx + hw - 2, wy]], 2.2, D('#DFF4FF'), 'ink', 0);
    }
    [[-60, 0], [45, 1]].forEach(([dx, i]) => {                                                         // two boats float, then sit on the mud
      const fl = lvl > .1, by = fl ? wy - 4 + Math.sin(s * 3 + i) * 3 : bot - 14 - i * 8, tilt = fl ? Math.sin(s * 2 + i) * .05 : (i ? .3 : -.25);
      push(); translate(cx + dx, by); rotate(tilt);
      paint([[-28, -8], [28, -8], [18, 8], [-18, 8]], { wash: D(i ? '#F1E8D2' : '#E8AA38'), ink: INK, sw: .5 });
      inkLine([[0, -8], [0, -34]], 1, INK, 'ink', 0); paint([[2, -32], [2, -12], [18, -12]], { wash: D('#FFF5E2'), ink: INK, sw: .4 });
      pop();
    });
    if (lvl < .1) { const fx = cx + 5, fy = bot - 30, f = Math.sin(s * 20) * 6;                          // a stranded fish
      paint([[fx - 20, fy], [fx, fy - 9 + f * .3], [fx + 14, fy], [fx + 24, fy - 10 + f], [fx + 24, fy + 10 - f], [fx + 14, fy], [fx, fy + 9]], { wash: '#8EC3E6', ink: INK, sw: .5 }); }
    inkLine([[cx - hw, sy], [cx + hw, sy]], 1.2, '#15131C', 'ink', 0);
    paint(arch(cx, top, w, h), { ink: '#15131C', sw: 1.6 });
  }
  // c (v13): no chalice, STRAW ONLY: a long pink straw from his mouth out through the window into the town lake, the gulps run up it
  const MOUTH = [948, 566];                                                     // the CEO's mouth, world
  function lakeStraw(s, lvl) {
    const k = ease(seg(s, 133.0, 133.4)) * (1 - ease(seg(s, 136.8, 137.1))); if (k < .01) return;
    const end = [LK.cx + 20, Math.max(lakeY(lvl) + 24, LK_W0 + 24)];
    const full = [MOUTH, [850, 590], [720, 548], [620, 560], end], n = full.length - 1;
    const pts = full.map((p, i) => i === 0 ? p : [lerp(MOUTH[0], p[0], k), lerp(MOUTH[1], p[1], k)]);
    inkLine(pts, 6, '#E27A92', 'ink', .5); inkLine(pts, 1.6, '#FFC6D4', 'inkfine', .5);
    for (const g of GULPS) {
      const p = seg(s, g - .55, g - .05); if (p <= 0 || p >= 1 || k < .99) continue;
      const q = (1 - p) * n, i = Math.min(n - 1, Math.floor(q)), f = q - i, a = pts[i], b = pts[i + 1];   // lake → mouth
      paint(ellPts(lerp(a[0], b[0], f), lerp(a[1], b[1], f), 10, 10, 10), { wash: '#2E9FE8', ink: INK, sw: .4 });
    }
  }
  // c (v13): right, the same tall window: a city far away at night, all lit. «more electricity» raises a pylon whose wires run current
  // to the church and the city loses a chunk of its lights at once; every next line («copper», «water», «cheaper»…, «need») takes more blocks
  const CT = { cx: 1380, top: 150, w: 210, h: 650 }, CNB = 10;
  const CSTEP = [[C.elec, 3], [C.copper, 2], [C.water1, 1], [C.cheap1, 1], [C.cheap2, 1], [C.need, 1]];   // blocks going dark per line (1 stays lit)
  const COFF = (() => { const ord = [...Array(CNB).keys()].sort((a, b) => hash(a * 3.7 + 1) - hash(b * 3.7 + 1)), t = []; let i = 0;
    for (const [tt, n] of CSTEP) for (let q = 0; q < n; q++) t[ord[i++]] = tt; return t; })();
  function nightCity(s, L) {
    const { cx, top, w, h } = CT, hw = w / 2, bot = top + h, sy = top + .866 * w, hz = 560;
    const offK = j => COFF[j] == null || s < COFF[j] ? 0 : s < COFF[j] + .1 && frac(s * 40) < .5 ? .5 : 1;
    const litN = [...Array(CNB).keys()].filter(j => offK(j) < 1).length / CNB;
    paint(arch(cx, top - 16, w + 32, h + 24), { wash: '#3B3F4A', fill: '#1C1F24', fillOp: 90, tex: .5, ink: INK, sw: .9 });
    paint(arch(cx, top, w, h), { wash: '#0E1230', ink: null });                                            // night sky
    paint(ellPts(cx - 55, sy - 40, 20, 20, 16), { wash: '#F1E8D2', ink: null });                             // the moon
    for (let i = 0; i < 9; i++) paint(ellPts(cx - hw + 15 + hash(i * 5.1) * (w - 30), top + 60 + hash(i * 2.3) * 300, 2, 2, 6), { wash: '#FFF5E2', ink: null });
    glowAt(cx + 10, hz - 20, 120, '#FFD866', 70 * litN);                                                    // the city's glow on the sky
    for (let j = 0; j < CNB; j++) {                                                                         // the far skyline, tiny
      const bw = (w - 20) / CNB, x = cx - hw + 10 + j * bw, bh = 30 + hash(j * 4.3) * 70, off = offK(j);
      paint(rectPts(x + 1, hz - bh, bw - 2, bh), { wash: mixCol('#3A3F5E', '#15172A', off), ink: null });
      if (off < 1) for (let r = 0; r < Math.floor(bh / 12); r++) for (const c of [.3, .7])
        if (hash(j * 9 + r * 3 + c) > .25) paint(rectPts(x + bw * c - 2, hz - bh + 6 + r * 12, 4, 5), { wash: '#FFD866', washOp: 255 * (1 - off), ink: null });
    }
    paint(rectPts(cx - hw, hz, w, bot - hz), { wash: '#141A1E', ink: null });                               // dark fields
    inkLine([[cx - hw, hz], [cx + hw, hz]], 1, '#2A3040', 'inkfine', 0);
    const up = backOut(seg(s, C.elec - .25, C.elec + .15));                                                 // the pylon rises on «electricity»
    if (up > .01) {
      const px = cx + 45, pb = 770, ph = 200 * up, gold = '#B8B0A0', leg = (f, d) => [px + d * lerp(30, 6, f), pb - ph * f];
      for (const d of [-1, 1]) inkLine([leg(0, d), leg(1, d)], 1.6, gold, 'ink', 0);
      for (let q = 0; q < 5; q++) { inkLine([leg(q / 5, -1), leg((q + 1) / 5, 1)], .8, gold, 'inkfine', 0); inkLine([leg(q / 5, 1), leg((q + 1) / 5, -1)], .8, gold, 'inkfine', 0); }
      for (const f of [.8, .95]) inkLine([[px - 40, pb - ph * f], [px + 40, pb - ph * f]], 1.6, gold, 'ink', 0);
      if (up > .9) for (const f of [.8, .95]) {                                                             // wires: from the city to the church (out the left edge)
        const a = [cx + hw - 10, hz - 10], b = [px + 38, pb - ph * f], c = [px - 38, pb - ph * f], d = [cx - hw - 20, pb - ph * f + 30];
        inkLine([a, [lerp(a[0], b[0], .5), Math.max(a[1], b[1]) + 10], b], .8, '#2A2C38', 'inkfine', .5);
        inkLine([c, [lerp(c[0], d[0], .5), Math.max(c[1], d[1]) + 16], d], .8, '#2A2C38', 'inkfine', .5);
        const run = s > C.elec && s < C.need + 1.5;
        if (run) for (let q = 0; q < 3; q++) {                                                              // current running toward the church
          const ff = frac(s * 1.4 + q / 3 + f), pts = [a, b, c, d], seg3 = Math.min(2, Math.floor(ff * 3)), g = ff * 3 - seg3;
          const P0 = pts[seg3], P1 = pts[seg3 + 1];
          paint(ellPts(lerp(P0[0], P1[0], g), lerp(P0[1], P1[1], g), 4, 4, 6), { wash: '#FFF3A0', ink: null });
        }
      }
    }
    inkLine([[cx - hw, sy], [cx + hw, sy]], 1.2, '#15131C', 'ink', 0);
    paint(arch(cx, top, w, h), { ink: '#15131C', sw: 1.6 });
  }
  // ---- the intelligence price tag: it REALLY gets cheaper, one step down on every line ----
  const PRICE = [[141.4, '$20'], [C.cheap1, '$2'], [145.74, '$0.20'], [C.cheap2, '$0.02'], [149.12, '$0.002']];
  const TK2 = 2.1;
  function tag(s, x, y, d) {
    if (d <= .01) return;
    const yy = y - 760 * (1 - easeOut(d)), i = PRICE.filter(p => s >= p[0]).length - 1, tc = PRICE[Math.max(0, i)][0], hit = i > 0 ? kick(s, [tc], .2) : 0;
    inkLine([[x, -400], [x, yy - 80]], 1, '#8A8480', 'inkfine', 0);
    push(); translate(x, yy); rotate(Math.sin(s * 2.3 + x) * .05 + .12 * hit * Math.sin((s - tc) * 30)); scale(TK2);
    paint([[-90, -60], [0, -92], [90, -60], [90, 80], [-90, 80]], { wash: '#FFF5E2', fill: '#E8AA38', fillOp: 40, tex: .4, ink: INK, sw: 1 });
    paint(ellPts(0, -66, 8, 8, 10), { wash: '#2B2233', ink: null });
    const bx = 0, by = -30;                                                     // the brain
    paint(ellPts(bx, by, 30, 22, 16), { wash: '#F2A0B8', ink: INK, sw: .6 }); inkLine([[bx, by - 20], [bx, by + 20]], .7, INK, 'inkfine', 0);
    for (const dd of [-1, 1]) inkLine([[bx + dd * 8, by - 14], [bx + dd * 20, by - 4], [bx + dd * 10, by + 8]], .6, INK, 'inkfine', .5);
    pop();
    if (yy < 100 || i < 0) return;
    letter('INTELLIGENCE', x, yy + 8 * TK2, 26, '#59636E', { font: ruFont(26), ink: false });
    if (i > 0) {
      letter(PRICE[i - 1][1], x, yy + 30 * TK2, 36, '#8A8480', { font: ruFont(36), ink: false });
      inkLine([[x - 70, yy + 31 * TK2 + 6], [x + 70, yy + 30 * TK2 - 8]], 5, '#D8262A', 'ink', 0);
    }
    letter(PRICE[i][1], x, yy + 58 * TK2, 62, i > 0 ? '#D8262A' : '#2B2233', { font: ruFont(62), ink: false, pop: i > 0 ? (s - tc) * 5 : undefined });
  }
  // the chalice with a long straw (as RU a06 sip): blue gulps travel up the straw on the beats
  function cup(s, lift) {
    return (uu, sw) => {
      push(); scale(-1, 1); rotate(-lift);
      paint([[-1.1 * uu, -2.8 * uu], [1.1 * uu, -2.8 * uu], [.7 * uu, -1.1 * uu], [.15 * uu, -.8 * uu], [.15 * uu, .2 * uu], [.7 * uu, .5 * uu], [-.7 * uu, .5 * uu], [-.15 * uu, .2 * uu], [-.15 * uu, -.8 * uu], [-.7 * uu, -1.1 * uu]],
        { wash: '#E8AA38', fill: '#A8741A', fillOp: 80, tex: .4, ink: INK, sw: sw * .5 });
      paint(ellPts(0, -2.7 * uu, 1.05 * uu, .25 * uu, 12), { wash: '#2E9FE8', ink: null });
      const tipX = -4.9 - 2.2 * Math.cos(lift), tipY = -4.5 - 2.2 * Math.sin(lift), mx = -tipX * uu, my = (-4.35 - tipY) * uu;
      const straw = [[.3 * uu, -2.6 * uu], [.6 * uu, -4.2 * uu], [mx * .55, my - 1.4 * uu], [mx - .2 * uu, my]];
      inkLine(straw, sw * 1.6, '#E27A92', 'ink', .5);
      for (const g of GULPS) {
        const p = seg(s, g - .25, g + .1); if (p <= 0 || p >= 1) continue;
        const i = Math.min(2, Math.floor(p * 3)), f = p * 3 - i, a = straw[i], b = straw[i + 1];
        paint(ellPts(lerp(a[0], b[0], f), lerp(a[1], b[1], f), .35 * uu, .35 * uu, 8), { wash: '#2E9FE8', ink: null });
      }
      pop();
    };
  }
  // DJ kit: headphones over the head (CEO local space), decks rising out of the lectern
  const phones = (u, sw) => {
    inkLine([[-5.6 * u, -6.4 * u], [-4.4 * u, -9 * u], [0, -9.5 * u], [4.4 * u, -9 * u], [5.6 * u, -6.4 * u]], sw * 1.6, '#16181C', 'ink', .6);
    for (const d of [-1, 1]) {
      paint(ellPts(d * 5.7 * u, -6.2 * u, 1.05 * u, 1.55 * u, 14), { wash: '#16181C', ink: INK, sw: sw * .6 });
      paint(ellPts(d * 5.7 * u, -6.2 * u, .6 * u, 1 * u, 12), { wash: '#00FF6A', washOp: 200, ink: null });
    }
  };
  function decks(s, k, scr) {
    if (k <= .01) return;
    const top = 626, h = 34 * k;
    for (const d of [-1, 1]) {
      const x = 960 + d * 135;
      paint(rectPts(x - 95, top - h, 190, h + 2, 1), { wash: '#2B2F36', fill: '#16181C', fillOp: 80, tex: .5, ink: INK, sw: .8 });
      if (k < .5) continue;
      const py = top - h - 6, a = s * 9 * d + (d < 0 ? scr : 0);
      paint(ellPts(x - 12, py, 64, 15, 22), { wash: '#0A0A0E', ink: INK, sw: .7 });
      paint(ellPts(x - 12, py, 20, 5, 12), { wash: '#00FF6A', ink: null });
      inkLine([[x - 12, py], [x - 12 + Math.cos(a) * 58, py + Math.sin(a) * 13]], .8, '#7DFFAE', 'inkfine', 0);
      inkLine([[x + 70, py - 14], [x + 66, py + 4], [x + 30, py + 6]], 1.4, '#C8D2E6', 'ink', .3);
    }
    paint(rectPts(908, top - h - 4, 104, h + 6, 1), { wash: '#3B3F4A', ink: INK, sw: .7 });   // the mixer
    if (k > .5) for (let i = 0; i < 4; i++) paint(rectPts(922 + i * 22, top - h + 4 + 10 * Math.abs(Math.sin(s * 5 + i)), 10, 6), { wash: '#B6FF1A', ink: null });
  }
  // acid lasers from the rose
  function lasers(s, k) {
    if (k < .02) return;
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 2 + (i - 1.5) * .5 + Math.sin(s * 2.4 + i) * .1, len = 1300, nx = -Math.sin(a) * 4, ny = Math.cos(a) * 4, ex = 960 + Math.cos(a) * len, ey = 215 + Math.sin(a) * len;
      paint([[960 + nx, 215 + ny], [ex + nx * 4, ey + ny * 4], [ex - nx * 4, ey - ny * 4], [960 - nx, 215 - ny]], { wash: i % 2 ? '#00FF6A' : '#B6FF1A', washOp: 110 * k, ink: null });
    }
    glowAt(960, 215, 140, '#00FF6A', 90 * k);
  }
  const ANG = [[575, 3], [680, 4], [785, 5], [1135, 6], [1240, 7], [1345, 8]];
  const dark = k => { if (k > .01) { flushLetters(); paint(rectPts(-800, -800, W + 1600, H + 3200), { wash: '#07060C', washOp: 255 * clamp(k), ink: null }); } };

  function cathedral(t) {
    const s = O2N(t);
    back('#1A1726');
    // ---- light state ----
    const pre = s < 126.4, P = i => PDB[Math.min(i, PDB.length - 1)];
    const elec = ease(seg(s, 127.0, 128.4)) * (1 - .6 * seg(s, 130.5, 133));      // the power pouring in
    const bend = ease(seg(s, 127.2, 128.6)), taken = ease(seg(s, 127.0, 128.6));
    const cuGlow = .65 + .35 * Math.exp(-Math.max(0, s - C.copper) * 1.2), cu = ease(seg(s, C.copper - .1, C.copper + .5));
    const outK = [151.82, 153.18, 154.5].reduce((a, d) => a + ease(seg(s, d, d + .12)), 0) / 3;   // lights out on the downbeats after «need»
    const dj = s >= C.gpus, djAge = s - C.gpus, djK = ease(seg(s, C.gpus, C.gpus + .25)), djBeat = kick(s, BT.filter(b => b > C.gpus - .05), .3);
    const st = t0 => pre ? { v: on(s, t0), f: blip(s, t0) } : { v: 1, f: dj ? djBeat : .3 * elec };
    const winK = pre ? ease(seg(s, P(VAR === 'b' ? 6 : 5), P(VAR === 'b' ? 7 : 6) + .6)) : 1;
    const L = pre ? lerp(.12, .55, winK) : Math.min(1, .78 + .22 * elec), lvl = lvlAt(s);
    const plates = s > 126.6 && s < 141;
    // ---- nave: the vault shadow, the floor ----
    paint(rectPts(-500, -700, W + 1000, 760), { wash: '#100E18', washOp: 180, ink: null });
    paint(rectPts(-500, FY, W + 1000, 1500), { wash: '#232A33', fill: '#1C1F24', fillOp: 90, tex: .5, ink: null });
    inkLine([[-500, FY], [W + 500, FY]], 1.2, '#3B3F4A', 'ink', 0);
    for (let m = -9; m <= 9; m++) inkLine([[seamX(m, FY), FY], [seamX(m, 1000), 1000]], .6, '#3B3F4A', 'inkfine', 0);
    let lights = () => {}, front = () => {};          // front: drawn after the choir (c's pews stand before it)
    if (VAR === 'a') {
      const ck = [st(P(1)), st(P(2)), st(P(3))], rk = [4, 3, 2, 1, 0].map(i => st(P(i)));                 // row 0 (far) lights last
      colonnade(s, 1, ck); dcFloor(s, 1, rk);
      lights = () => { colonnade(s, 2, ck); dcFloor(s, 2, rk); };
      lancet(565, -1, s, { L: pre ? winK : L, elec, bend });
      waterLancet(1355, s, L, lvl);
      A06.rose(s, L);
      organ(s, Math.max(cu * cuGlow * .8, dj ? .3 : 0));
    } else if (VAR === 'b') {
      const tk = TOWERS.slice(9).map(T => st(P(Math.max(0, T.a - 1))));            // the centre pair first, outward one pair per downbeat
      const boost = .35 * elec + (dj ? .15 * djBeat : 0);
      for (let j = 0; j < 5; j++) floorRow(j, m => (m + j) % 2 ? '#2B3440' : '#1E232C', .4 + .2 * j);
      organ(s, Math.max(cu * cuGlow * .8, dj ? .3 : 0));
      organWall(s, 1, tk, boost);
      lights = () => organWall(s, 2, tk, boost);
      A06.rose(s, L);
      const posD = easeOut(seg(s, 131.3, 131.8)) * (1 - easeIn(seg(s, 139.7, 140.4)));
      if (posD > .01) gaugePlaque(s, 585, 170 - 760 * (1 - posD), lvl);
    } else {
      const pk = [3, 2, 1, 0].map(i => st(P(i)));                                // 4 rows, the near one first
      paint([[seamX(-.55, 1000), 1000], [seamX(.55, 1000), 1000], [seamX(.55, 2000), 2000], [seamX(-.55, 2000), 2000]], { wash: '#5A1A26', ink: INK, sw: .6 });   // the aisle carpet
      backlight(s, (pre ? ease(seg(s, P(6), P(7) + .4)) : .7) * (1 - outK) * (1 - djK));
      townLake(s, L, lvlC(s));
      nightCity(s, L);
      A06.rose(s, L);
      organ(s, Math.max(cu * cuGlow * .8, dj ? .3 : 0));
      lights = () => pews(s, 2, pk);
      front = () => pews(s, 1, pk);
    }
    if (plates && VAR === 'a') {
      plate(565, 592, 'CITY POWER', pct(1 - taken), taken > .5 ? '#D8262A' : '#FFD21F');
      if (VAR === 'a' && s > C.water1 - .5) plate(1355, 592, 'TOWN WATER', pct(lvl), lvl > .3 ? '#2E9FE8' : '#D8262A');
    }
    lasers(s, djK);
    // ---- the sermon tag ----
    tag(s, 650, 240, seg(s, 140.5, 141.4) * (1 - easeIn(seg(s, 151.0, 151.7))));
    if (s > 149.42 && s < 151) stamp('-99.99%', 650, 600, 56, s, 149.42, { col: '#2FBF71', rot: .1 });
    // ---- the preacher ----
    const rise = ease(seg(s, 123.6, 125.5)), m = mouthAt(s);
    const lift = s < 137.6 ? kf(s, [[133.1, .3], [133.4, 1.05], [136.7, 1.05], [137.05, .3]], backOut) : .3;
    const sipping = s > 133.35 && s < 136.8;
    let aL = .5, aR = .5, eyes = 'normal', mouth = m || 'smile', lookX = 0;
    if (s < 126.4) { eyes = 'narrow'; }
    else if (s < 129) { const up = ease(seg(s, C.elec - .3, C.elec + .2)); aL = aR = .5 + 1.1 * up + .1 * Math.sin(s * 6) * up; eyes = up > .5 ? 'happy' : 'normal'; }
    else if (s < 133.1) { eyes = 'happy'; mouth = m || 'grin'; }
    else if (s < 139.4) { eyes = sipping ? 'closed' : 'look'; mouth = sipping ? 'o' : (s > C.why ? 'flat' : 'smile'); lookX = sipping ? 0 : (VAR === 'a' ? 1 : -1); aR = s > C.why ? 1.2 : .5; }
    else if (s < 146) { const p = ease(seg(s, C.cheap1 - .4, C.cheap1)); aL = .5 + .7 * p + ease(seg(s, 141.7, 142.1)) * (1 - p) * .9; aR = .5 + .9 * ease(seg(s, 141.7, 142.1)) * (1 - p); lookX = -p; }
    else if (s < 151.6) { const p = ease(seg(s, C.cheap2 - .4, C.cheap2)); aR = .5 + .7 * p + ease(seg(s, 146.4, 146.8)) * (1 - p) * .9; aL = .5 + .9 * ease(seg(s, 146.4, 146.8)) * (1 - p); lookX = -p; }
    else if (!dj) { const p = ease(seg(s, 151.7, 152.4)), down = ease(seg(s, 152.6, 155.3)); aL = aR = .5 + .5 * p - .4 * down; eyes = down > .3 ? 'narrow' : 'normal'; mouth = m || (down > .3 ? 'flat' : 'smile'); }
    else { const up = backOut(seg(s, C.gpus, C.gpus + .2)); aL = aR = .3 + 1.7 * up; if (djAge > .7) { aL = -.2 + .25 * Math.sin(s * 14); aR = 1.9 + .15 * Math.sin(s * 5); } mouth = m || 'grin'; }
    const take = dj && djAge < .25 ? -.08 * Math.sin(djAge / .25 * Math.PI) : 0;
    if (!dj) { aL = .5 + (aL - .5) * 1.7 + .25 * talk(s); aR = .5 + (aR - .5) * 1.7 + .25 * talk(s + .17); }   // bigger sermon gestures (v8 note)
    A06.pulpit(s, { eyes, lookX, mouth, aL, aR, dy: 9 * (1 - rise), take, sq: sipping ? .03 * Math.sin(s * 11) : 0,
      armL: VAR !== 'c' && s > 133 && s < 137.6 ? cup(s, lift) : undefined, hat: dj ? 'shades' : null, click: kick(s, BT, .15) * (dj ? 1 : .4), draw: dj ? phones : undefined });
    decks(s, backOut(seg(s, C.gpus + .05, C.gpus + .45)), djAge > .7 ? Math.sin(s * 14) * .8 : 0);
    if (dj && djAge < .35) paint(starPts(960 - 3.2 * 32, 700 - 6.8 * 32, 26 * (1 - djAge / .35) + 6, .2), { wash: '#E6FFE8', ink: null });
    if (VAR === 'c') lakeStraw(s, lvlC(s));
    // ---- the choir: three angels each side ----
    const sing = inSpan(s, SING), singK = sing ? .7 + .3 * kick(s, BT, .3) : 0, whyK = seg(s, C.why, C.why + .25) * (1 - seg(s, 140.6, 141.2));
    ANG.forEach(([x, nn]) => {
      const side = x < 960 ? 1 : -1;
      A06.angel(x, 985, 12, s, { n: nn, k: dj ? .6 + .4 * djBeat : singK, eyes: dj ? 'happy' : whyK > .1 ? 'look' : sing ? 'happy' : 'closed', lookX: whyK > .1 ? (x < 960 ? -.6 : -1) : 0, lookY: -.5,
        mouth: dj ? 'O' : sing ? 'O' : whyK > .1 ? 'o' : 'smile', aL: dj ? 1.6 + .3 * djBeat : undefined, aR: dj ? 1.6 + .3 * djBeat : undefined, emote: '?', emoteK: whyK });
    });
    front();
    flushLetters();
    // ---- dark until the set has lit, then the lights on top ----
    dark(pre ? .55 * (1 - ease(seg(s, 114.5, 125.2))) : outK * .5 * (1 - djK) + (dj ? .12 : 0));
    lights();
    // ---- light ----
    const spot = pre ? seg(s, 123.4, 124.6) : Math.max(outK, dj ? 0 : .25 * seg(s, 141, 141.6) * (1 - seg(s, 151.0, 151.5)));
    if (spot > .02) A06.beam(960, 960, 60, 260, 880, (pre ? .55 : .4) * spot * (1 - djK));
    if (VAR !== 'b' && winK > .3 && !dj) for (const [cx, sd] of WIN) A06.beam(cx, cx + sd * -220, 50, 150, 1150, .22 * winK * (1 - outK), sd > 0 ? '#BFE8FF' : '#FFE6A0');
  }
  // ---- real 111.04–113.70: the fly-in. The night factory, its lights switching OFF block by block on the beats (the downbeat 112.36 kills
  // the chimney fires), the camera pushing in toward the dark until the cut into the dark cathedral on the 113.68 downbeat ----
  const FA = 111.04, OFF = BT.filter(b => b > FA + .1 && b < RA - .1);         // 111.38 … 113.36: one block per beat
  const offK = (i, s) => OFF[i] == null || s < OFF[i] ? 1 : s < OFF[i] + .08 && frac(s * 40) < .5 ? .6 : 0;   // flicker, then dark
  function flyIn(t) {
    const s = O2N(t), p = ease(seg(s, FA, RA)), tv = 114.0 + (s - FA) * .3;     // a05 time for the flames/smoke, kept before its own blackout
    const L = { sky: offK(6, s), fire: offK(3, s), facade: offK(5, s), banner: offK(4, s), city: Math.max(offK(0, s), offK(1, s), offK(2, s)),
      cityAt: i => offK(i < 10 ? 2 : i < 18 ? 1 : 0, s) };          // far-right block, near-right, left
    back('#05060E');
    a05_cam(tv, 960, lerp(430, 400, p), lerp(.62, 1.5, p), 0);
    a05_world(tv, L);
    camEnd();
    flushLetters();
    const n = OFF.filter(b => s >= b).length;                                   // each block that dies takes a step of the night with it
    if (n) paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#000000', washOp: 255 * .11 * n, ink: null });
  }
  const cb = CH.find(c => c.name === 'en_c2_billboard'); if (cb && cb.end > N2O(FA)) cb.end = N2O(FA);   // the billboard cuts on the 111.04 downbeat
  chapter('en_v8c_flyin', N2O(FA), A, [[N2O(FA), native(flyIn)]], { real: true });
  if (window.RU34) RU34.push([N2O(FA), A, [[N2O(FA), 960, 540, 790], [A - .001, 960, 540, 790, 1]]]);
  const shake0 = window.CAM_SHAKE;                                              // a still camera for the whole set (CALM ends at v1 135.22)
  if (shake0) window.CAM_SHAKE = t => t >= A && t < B ? [0, 0] : shake0(t);
  chapter('en_v8c_cathedral', A, B, [[A, native(cathedral)]], { real: true });
  // one camera, pushes only: down the aisle onto the set, a slow creep through the sermon, the push-in on «need…», the DJ close
  if (window.RU34) RU34.push([A, B, [[A, ...{ a: [960, 660, 1700], b: [960, 700, 1640], c: [960, 760, 1680] }[VAR]], [N2O(126.40), 960, 575, 1120, 1], [N2O(141.0), 960, 570, 1090, 1], [N2O(151.72), 960, 565, 1060, 1],
    [N2O(155.74), 960, 548, 760, 1], [B - .001, 960, 545, 720, 1]]]);
})();
// v14 outro framing (user: «Midnight» / the reset / «Fuck.» were cropped): native 3:4 keys over the RU_CAM's fixed 1080 view
// (keys are v1 time, N2O): «Midnight» the whole clock, the reset the whole tablet, «Fuck.» the whole face + the clock, centred; to the madness (250.1)
if (window.RU34) RU34.push([N2O(241.96), N2O(250.1), [[N2O(241.96), 960, 560, 1080], [N2O(244.10), 970, 540, 1180], [N2O(247.2), 960, 600, 1120]]]);
