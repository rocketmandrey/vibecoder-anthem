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
    // the right lancet turns into a copper-coil stained-glass panel, lighting up from the bottom
    if (o.cu > .01) {
      const cu = o.cu, n = 8, step = (bot - sy - 20) / n, rx = WW * .36, ry = WW * .1;
      glowAt(cx, WT + WH * .55, WW * 1.3, '#FF9A3A', 90 * cu * o.cuGlow);
      paint(arch(cx, WT, WW, WH), { wash: '#5A2410', washOp: 255 * Math.min(1, cu * 1.5), ink: null });
      paint(rectPts(cx - rx * .5, sy - 10, rx, bot - sy + 4), { wash: '#3A2A26', washOp: 255 * Math.min(1, cu * 1.5), ink: INK, sw: .4 });
      for (let i = 0; i < n; i++) {
        const k = clamp((cu - i / n * .8) * 4); if (k <= 0) continue;
        const y = bot - 14 - (i + 1) * step, p = [];
        for (let q = 0; q <= 10; q++) { const a = q / 10 * Math.PI; p.push([cx + Math.cos(a) * rx, y + Math.sin(a) * ry]); }
        for (let q = 10; q >= 0; q--) { const a = q / 10 * Math.PI; p.push([cx + Math.cos(a) * rx * .9, y + Math.sin(a) * ry + step * .6]); }
        paint(p, { wash: mixCol('#7A3A1A', i % 2 ? '#E8873A' : '#FFC27A', k * o.cuGlow), ink: INK, sw: .4 });
      }
      const ry2 = WT + (sy - WT) * .6;                                         // a copper sun in the arch head
      paint(ellPts(cx, ry2, 30, 30, 18), { wash: mixCol('#7A3A1A', '#FFB46A', cu * o.cuGlow), ink: INK, sw: .5 });
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + s * .3; inkLine([[cx + Math.cos(a) * 34, ry2 + Math.sin(a) * 34], [cx + Math.cos(a) * 46, ry2 + Math.sin(a) * 46]], 1.2, '#FFB46A', 'ink', 0); }
    }
    // lead came, the arch outline, a sheen
    inkLine([[cx, sy - 30], [cx, bot]], 1.1, '#15131C', 'ink', 0);
    for (const y of [sy, sy + (bot - sy) / 2]) inkLine([[cx - hw, y], [cx + hw, y]], 1.1, '#15131C', 'ink', 0);
    paint(arch(cx, WT, WW, WH), { ink: '#15131C', sw: 1.4 });
    if (L > .5) paint(ellPts(cx - hw * .45, WT + WH * .45, WW * .07, WH * .28, 10, 0, .2), { wash: '#FFFFFF', washOp: 40 * L, ink: null });
  }
  // the wall over the a06 windows (they sit off-centre at 400 / 1410 / 1630): plain dark stone, a carved string course
  function walls() {
    for (const [x0, x1] of [[240, 655], [1265, 1770]]) {
      paint(rectPts(x0, 40, x1 - x0, 560), { wash: '#1A1726', fill: '#15131F', fillOp: 70, tex: .4, ink: null });
      inkLine([[x0, 600], [x1, 600]], 1, '#3B3F4A', 'ink', 0);
    }
  }
  // copper organ pipes behind the pulpit, tallest at the sides, they grow on «More» / «copper»
  // …and keep GROWING after «copper»: on every downbeat to the lights-out all pipes stretch and a new pair sprouts outside (to 11 a side)
  const OGROW = DB.filter(d => d > C.copper + .3 && d < 151.7);
  function organ(s, glow) {
    const up = OGROW.reduce((a, d) => a + backOut(seg(s, d, d + .3)), 0);
    for (const sd of [-1, 1]) for (let i = 10; i >= 0; i--) {
      const t0 = i < 3 ? C.more1 : i < 6 ? C.copper : OGROW[(i - 6) * 2], g = t0 == null ? 0 : backOut(seg(s, t0 + i % 3 * .06, t0 + i % 3 * .06 + .32)); if (g <= 0) continue;
      const own = i < 6 ? up : OGROW.slice((i - 6) * 2 + 1).reduce((a, d) => a + backOut(seg(s, d, d + .3)), 0);
      const x = 960 + sd * (46 + i * 33) - 13, top = Math.max(i < 4 ? 330 : 120, 640 - g * (170 + Math.min(i, 5) * 46) - 14 * own);
      if (glow > .05) glowAt(x + 13, top + 20, 40, '#FF9A3A', 60 * glow);
      paint(rectPts(x, top, 26, 640 - top), { wash: mixCol('#8A4A22', '#D8873A', .5 + .5 * glow), fill: '#6A3418', fillOp: 60, tex: .4, ink: INK, sw: .6 });
      paint(rectPts(x + 5, top + 6, 5, 640 - top - 10), { wash: '#FFC890', washOp: 120 + 100 * glow, ink: null });
      paint(ellPts(x + 13, top + 52, 9, 6, 10), { wash: '#2A1408', ink: INK, sw: .4 });
      paint(ellPts(x + 13, top, 13, 4, 12), { wash: '#F2B27A', ink: INK, sw: .5 });
    }
  }
  // the pews of racks with a candle on each (ex scenes5.js powerup, the user loves it)
  const ROWS = [[1990, 470], [1800, 390], [1630, 320], [1480, 260], [1370, 205]];   // tall racks (user: the servers were too small)
  function pew(s, y, h, r, lit, k) {
    const w = h * .5, hw = 150 + (y - 1240) * .25, gap = w * .12;
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) {
      const x = 960 + sd * (hw + i * (w + gap)) - (sd < 0 ? w : 0), seed = r * 7 + i + (sd > 0 ? 3 : 0);
      if (x < 960 - 590 || x + w > 960 + 590) continue;                          // whole racks only, none cut by the frame edge
      paint(ellPts(x + w / 2, y + 4, w * .62, h * .06, 14), { wash: '#05060E', washOp: 140, ink: null });
      if (lit) glowAt(x + w / 2, y - h * .5, w * (1.1 + .5 * k), TK.green, 35 + 70 * k);
      serverRack(x, y - h, w, h, lit ? s : 0, { units: 5, seed });
      if (!lit) paint(rectPts(x, y - h, w, h), { wash: '#05060E', washOp: 175, ink: null });
      const cx = x + w * .5, cy = y - h, ch = h * .16, fl = 1 + .12 * Math.sin(s * 9 + seed);
      paint(rectPts(cx - ch * .14, cy - ch, ch * .28, ch), { wash: lit ? '#FFF5E2' : '#3B3F4A', ink: INK, sw: .4 });
      if (lit) {
        glowAt(cx, cy - ch * 1.25, ch * 1.6, '#FFB43A', 120);
        paint(ellPts(cx, cy - ch * 1.25, ch * .14 * fl, ch * .3 * fl, 10), { wash: '#FFD21F', ink: null });
      }
    }
  }
  // a price tag on a string from the vault; d = how far it is lowered (0 up out of the frame, 1 in place)
  function tag(s, x, y, d, label, sub, col, icon) {
    if (d <= .01) return;
    const yy = y - 760 * (1 - easeOut(d));
    inkLine([[x, -400], [x, yy - 80]], 1, '#8A8480', 'inkfine', 0);
    push(); translate(x, yy); rotate(Math.sin(s * 2.3 + x) * .05);
    paint([[-90, -60], [0, -92], [90, -60], [90, 80], [-90, 80]], { wash: '#FFF5E2', fill: '#E8AA38', fillOp: 40, tex: .4, ink: INK, sw: 1 });
    paint(ellPts(0, -66, 8, 8, 10), { wash: '#2B2233', ink: null });
    icon(0, -26);
    pop();
    if (yy < 150) return;                                                       // letters are not clipped by the picture: none above it
    if (sub) { letter(sub, x, yy + 18, 34, '#59636E', { font: ruFont(34), ink: false }); inkLine([[x - 44, yy + 22], [x + 44, yy + 12]], 2.5, '#D8262A', 'ink', 0); }
    letter(label, x, yy + (sub ? 56 : 36), 44, col, { font: ruFont(44), ink: false });
  }
  const brainIcon = (x, y) => { paint(ellPts(x, y, 30, 22, 16), { wash: '#F2A0B8', ink: INK, sw: .6 }); inkLine([[x, y - 20], [x, y + 20]], .7, INK, 'inkfine', 0); for (const d of [-1, 1]) inkLine([[x + d * 8, y - 14], [x + d * 20, y - 4], [x + d * 10, y + 8]], .6, INK, 'inkfine', .5); };
  const gpuIcon = (x, y) => { paint(rectPts(x - 36, y - 16, 72, 32), { wash: '#1F6B3A', ink: INK, sw: .6 }); for (const d of [-16, 16]) paint(ellPts(x + d, y, 11, 11, 12), { wash: '#16181C', ink: INK, sw: .4 }); };
  const money = v => v >= 1000 ? '$' + Math.round(v / 1000) + 'K' : v >= 1 ? '$' + Math.round(v) : '$' + (+v.toPrecision(1)).toString().replace(/^0/, '0');
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
    const n = PDB.filter(d => s >= d).length, NROW = ROWS.length;                 // power-up steps
    const winK = s < 126.4 ? ease(seg(s, PDB[NROW + 1] ?? 122.98, (PDB[NROW + 2] ?? 124.3) + .6)) : 1;
    const elec = ease(seg(s, 127.0, 128.4)) * (1 - .6 * seg(s, 130.5, 133));      // the power pouring in
    const bend = ease(seg(s, 127.2, 128.6));
    const cu = ease(seg(s, C.copper - .1, C.copper + .5)), cuGlow = .65 + .35 * Math.exp(-Math.max(0, s - C.copper) * 1.2);
    const outK = [151.82, 153.18, 154.5].reduce((a, d) => a + ease(seg(s, d, d + .12)), 0) / 3;   // lights out on the downbeats after «need»
    const dj = s >= C.gpus, djAge = s - C.gpus, djK = ease(seg(s, C.gpus, C.gpus + .25)), djBeat = kick(s, BT.filter(b => b > C.gpus - .05), .3);
    const L = s < 126.4 ? lerp(.12, .55, winK) : Math.min(1, .78 + .22 * elec);
    // ---- nave + set ----
    A06.nave(s, { choir: false, L, win: { coil: dj ? .4 : 1 }, heat: 0 });
    walls();
    for (const [cx, sd] of WIN) lancet(cx, sd, s, { L: s < 126.4 ? winK : L, elec, bend, cu: sd > 0 ? cu : 0, cuGlow });
    for (const px of [660, 1160]) if (elec > .05 || dj) glowAt(px + 50, 470, 150, dj ? '#00FF6A' : TK.green, (dj ? 40 + 60 * djBeat : 70 * elec));
    if (elec > .05) for (const [cx, sd] of WIN) for (let i = 0; i < 2; i++) {     // arcs from the window into the rack pillar
      const x0 = cx - sd * 80, x1 = sd < 0 ? 660 : 1260, ps = [];
      for (let q = 0; q <= 6; q++) ps.push([lerp(x0, x1, q / 6), 300 + i * 160 + (q % 6 ? (hash(q + Math.floor(s * 16) + i * 7 + sd) - .5) * 40 : 0)]);
      inkLine(ps, 1.6 * elec, '#E6F4FF', 'ink', 0);
    }
    organ(s, Math.max(cu * cuGlow * .8, dj ? .3 : 0));
    lasers(s, djK);
    // ---- the reservoir poster in front of the left lancet ----
    const posD = easeOut(seg(s, 131.5, 131.95)) * (1 - easeIn(seg(s, 139.7, 140.4)));
    if (posD > .01) {
      const lvl = Math.max(0, 1 - .4 * ease(seg(s, C.water1, C.water1 + .45)) - GULPS.reduce((a, g) => a + .1 * ease(seg(s, g, g + .3)), 0) - .25 * ease(seg(s, C.water2, C.water2 + .5)));
      const py = 200 - 760 * (1 - posD);
      for (const x of [490, 690]) inkLine([[x, -400], [x, py + 6]], 1, '#8A8480', 'inkfine', 0);
      A06.reservoir(s, 465, py, 250, 188, lvl);
    }
    // ---- the sermon tags ----
    const pe = ease(seg(s, C.cheap1, C.cheap1 + .8)), ge = ease(seg(s, C.cheap2, C.cheap2 + .8));
    const tagUp = easeIn(seg(s, 151.0, 151.7));
    tag(s, 565, 330, seg(s, 140.5, 141.4) * (1 - tagUp), money(20 * Math.pow(10, -4 * pe)), pe > .05 ? '$20' : null, pe > .05 ? '#D8262A' : '#2B2233', brainIcon);
    tag(s, 1355, 330, seg(s, C.and - .2, C.and + .6) * (1 - tagUp), money(40000 * Math.pow(10, ge)), ge > .05 ? '$40K' : null, ge > .05 ? '#1F8A4A' : '#2B2233', gpuIcon);
    if (pe > .99 && s < 151) stamp('-99.99%', 565, 470, 40, s, C.cheap1 + .8, { col: '#2FBF71', rot: .1 });
    // ---- the preacher ----
    const rise = ease(seg(s, 123.6, 125.5)), m = mouthAt(s);
    const lift = s < 137.6 ? kf(s, [[133.1, .3], [133.4, 1.05], [136.7, 1.05], [137.05, .3]], backOut) : .3;
    const sipping = s > 133.35 && s < 136.8;
    let aL = .5, aR = .5, eyes = 'normal', mouth = m || 'smile', lookX = 0;
    if (s < 126.4) { eyes = 'narrow'; }
    else if (s < 129) { const up = ease(seg(s, C.elec - .3, C.elec + .2)); aL = aR = .5 + 1.1 * up + .1 * Math.sin(s * 6) * up; eyes = up > .5 ? 'happy' : 'normal'; }
    else if (s < 133.1) { eyes = 'happy'; mouth = m || 'grin'; }
    else if (s < 139.4) { eyes = sipping ? 'closed' : 'look'; mouth = sipping ? 'o' : (s > C.why ? 'flat' : 'smile'); lookX = sipping ? 0 : -1; aR = s > C.why ? 1.2 : .5; }
    else if (s < 146) { const p = ease(seg(s, C.cheap1 - .4, C.cheap1)); aL = .5 + .7 * p + ease(seg(s, 141.7, 142.1)) * (1 - p) * .9; aR = .5 + .9 * ease(seg(s, 141.7, 142.1)) * (1 - p); lookX = -p; }
    else if (s < 151.6) { const p = ease(seg(s, C.cheap2 - .4, C.cheap2)); aR = .5 + .7 * p + ease(seg(s, 146.4, 146.8)) * (1 - p) * .9; aL = .5 + .9 * ease(seg(s, 146.4, 146.8)) * (1 - p); lookX = p; }
    else if (!dj) { const p = ease(seg(s, 151.7, 152.4)), down = ease(seg(s, 152.6, 155.3)); aL = aR = .5 + .5 * p - .4 * down; eyes = down > .3 ? 'narrow' : 'normal'; mouth = m || (down > .3 ? 'flat' : 'smile'); }
    else { const up = backOut(seg(s, C.gpus, C.gpus + .2)); aL = aR = .3 + 1.7 * up; if (djAge > .7) { aL = -.2 + .25 * Math.sin(s * 14); aR = 1.9 + .15 * Math.sin(s * 5); } mouth = m || 'grin'; }
    const take = dj && djAge < .25 ? -.08 * Math.sin(djAge / .25 * Math.PI) : 0;
    if (!dj) { aL = .5 + (aL - .5) * 1.7 + .25 * talk(s); aR = .5 + (aR - .5) * 1.7 + .25 * talk(s + .17); }   // bigger sermon gestures (v8 note)
    A06.pulpit(s, { eyes, lookX, mouth, aL, aR, dy: 9 * (1 - rise), take, sq: sipping ? .03 * Math.sin(s * 11) : 0,
      armL: s > 133 && s < 137.6 ? cup(s, lift) : undefined, hat: dj ? 'shades' : null, click: kick(s, BT, .15) * (dj ? 1 : .4), draw: dj ? phones : undefined });
    decks(s, backOut(seg(s, C.gpus + .05, C.gpus + .45)), djAge > .7 ? Math.sin(s * 14) * .8 : 0);
    if (dj && djAge < .35) paint(starPts(960 - 3.2 * 32, 700 - 6.8 * 32, 26 * (1 - djAge / .35) + 6, .2), { wash: '#E6FFE8', ink: null });
    // ---- the choir: three angels each side ----
    const sing = inSpan(s, SING), singK = sing ? .7 + .3 * kick(s, BT, .3) : 0, whyK = seg(s, C.why, C.why + .25) * (1 - seg(s, 140.6, 141.2));
    ANG.forEach(([x, nn]) => {
      const side = x < 960 ? 1 : -1;
      A06.angel(x, 985, 12, s, { n: nn, k: dj ? .6 + .4 * djBeat : singK, eyes: dj ? 'happy' : whyK > .1 ? 'look' : sing ? 'happy' : 'closed', lookX: whyK > .1 ? (x < 960 ? -.6 : -1) : 0, lookY: -.5,
        mouth: dj ? 'O' : sing ? 'O' : whyK > .1 ? 'o' : 'smile', aL: dj ? 1.6 + .3 * djBeat : undefined, aR: dj ? 1.6 + .3 * djBeat : undefined, emote: '?', emoteK: whyK });
    });
    // ---- floor beyond the world + the pews ----
    paint(rectPts(-600, 1230, W + 1200, 1100), { wash: '#232A33', fill: '#1C1F24', fillOp: 90, tex: .5, ink: null });
    for (let i = -6; i <= 6; i++) inkLine([[960 + i * 140, 1230], [960 + i * 300, 2300]], .6, '#3B3F4A', 'inkfine', 0);
    flushLetters();
    const pdk = (i => PDB[i] != null ? kick(s, [PDB[i]], .5) : 0);
    if (s < 126.4) {
      const d = .85 * (1 - Math.min(1, n / Math.max(PDB.length, NROW + 3)));
      dark(d * .84 * (1 - .25 * kick(s, PDB, .4)));
      ROWS.forEach(([y, h], r) => pew(s, y, h, r, n > r ? 1 : 0, pdk(r)));
    } else {
      ROWS.forEach(([y, h], r) => pew(s, y, h, r, 1, dj ? djBeat : 0));
      dark(outK * .5 * (1 - djK) + (dj ? .12 : 0));
    }
    // ---- light ----
    const spot = s < 126.4 ? seg(s, 123.4, 124.6) : Math.max(outK, dj ? 0 : .25 * seg(s, 141, 141.6) * (1 - seg(s, 151.0, 151.5)));
    if (spot > .02) A06.beam(960, 960, 60, 260, 880, (s < 126.4 ? .55 : .4) * spot * (1 - djK));
    if (winK > .3 && !dj) for (const [cx, sd] of WIN) A06.beam(cx, cx + sd * -220, 50, 150, 1150, .22 * winK * (1 - outK) * (sd > 0 && cu > .1 ? 1.4 : 1), sd > 0 && cu > .1 ? '#FFC890' : '#C8D8FF');
    if (dj && djAge < .066) paint(rectPts(-800, -800, W + 1600, H + 3200), { wash: '#00FF6A', washOp: 110 * (1 - djAge / .066), ink: null });   // ≤ 2 frames
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
  if (window.RU34) RU34.push([A, B, [[A, 960, 800, 1700], [N2O(126.40), 960, 575, 1120, 1], [N2O(141.0), 960, 570, 1090, 1], [N2O(151.72), 960, 565, 1060, 1],
    [N2O(155.74), 960, 548, 760, 1], [B - .001, 960, 545, 720, 1]]]);
})();
