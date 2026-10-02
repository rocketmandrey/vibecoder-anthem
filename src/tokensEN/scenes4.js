// tokensEN/scenes4.js: draft-4 native EN scenes (chorus 2 «More agents! More compute!» one-shot).
(() => {
  const INK = PAL.ink;
  const { kick, NOTXT, native, back } = ENK;
  const scene = (name, a, b, fn, keys, punch = []) => {
    chapter('en_' + name, a, b, [[a, native(fn)]], { real: true });
    EN_KEYS.push(...keys); EN_PUNCH.push(...punch);
  };

  // ======== chorus 2 «MORE AGENTS! MORE COMPUTE!» (102.88–105.84): one take in the a05 night-factory world ========
  // user note on draft 4: a hiring machine at the factory spits a blue agent out on «More»; on every beat each agent clones itself, the crowd
  // multiplies outward from the machine. On «more compute» a swarm of little quadcopter drones flies in, each with a GPU card slung under it,
  // lowers it to an agent and zips away; the back-row agents slot theirs into the dark server racks: sparks, the racks light up green.
  // One slow push-in, no cuts.
  // (a05 RU34 camera span ends at 102.88, see a05_chorus2.js)
  for (let i = EN_KEYS.length - 1; i >= 0; i--) if (EN_KEYS[i][0] >= 102.88 && EN_KEYS[i][0] < 105.84) EN_KEYS.splice(i, 1);   // scenes3 RUK's a05 march key
  const MA = { a: 102.88, agents: enWord('agents', 103.32), more: enWord('more', 104.48), compute: enWord('compute', 104.84), end: 105.84 };
  const MB = EN_BEATS.filter(b => b >= MA.a && b < MA.end);                                   // EN beats in the span (v1 time)
  const MOUTH = [825, 880];
  // ground slots, rows from the back (y 835, small) to the front (y 1300, big)
  const SLOTS = [];
  for (const [y, n] of [[845, 5], [935, 5], [1030, 5], [1130, 5], [1235, 5], [1340, 4]]) {
    const s = lerp(9, 20, (y - 845) / 495), x0 = y > 1100 ? 650 : 880;                // the front rows reach in front of the machine
    for (let i = 0; i < n; i++) SLOTS.push({ x: lerp(x0, 1350 - 5.5 * s, i / (n - 1)) + (hash(y + i) - .5) * 24 + (y % 2 ? 0 : 20), y, s, back: y === 845 });
  }
  const FOC = [930, 1520];                                                                  // the first agent lands big in front, the clones spread back
  SLOTS.sort((p, q) => Math.hypot(p.x - FOC[0], (p.y - FOC[1]) * 1.4) - Math.hypot(q.x - FOC[0], (q.y - FOC[1]) * 1.4));
  // births: 1 spat out on «More», doubling on the first four beats (1 → 16), then +4 a beat; parent -1 = spat out of the machine
  const AG = [{ born: MA.a, parent: -1 }], CAP = SLOTS.length;
  for (const b of MB) {
    const n = AG.length, add = Math.min(CAP - n, b < 104.2 ? n : 4);
    for (let i = 0; i < add; i++) AG.push({ born: b, parent: b > 104.2 && i === 0 ? -1 : i % n });
  }
  // the drones: each lowers a GPU card into an agent's hands on «compute» and the beats after; the 5 back-row agents plug theirs into a
  // rack .25 s later, 3 second-row agents just hold theirs up. A drone appears FL s before its drop, from the top or a side.
  const FL = .5, BACK = SLOTS.map((p, i) => [p, i]).filter(([p]) => p.back).sort((p, q) => p[0].x - q[0].x);
  const ROW2 = SLOTS.map((p, i) => [p, i]).filter(([p]) => p.y === 935).sort((p, q) => p[0].x - q[0].x);
  const AFT = MB.filter(b => b > MA.compute + .05), mid = k => (AFT[k] + AFT[k + 1]) / 2;
  const CR = [...[MA.compute, AFT[0], mid(0), AFT[1], mid(1)].map((land, k) => ({ land, slot: BACK[[1, 3, 0, 4, 2][k] % BACK.length] })),
    ...[(MA.compute + AFT[0]) / 2, mid(0) + .03, (AFT[1] + mid(1)) / 2].map((land, k) => ({ land, hold: 1, slot: ROW2[[0, 4, 2][k] % ROW2.length] }))]
    .map((c, k) => {
      const ready = AG[c.slot[1]].born + .32, land = Math.max(c.land, ready);                            // the catcher must be standing there
      return { ...c, k, t0: land - FL, land, plug: c.hold ? Infinity : land + .25, from: [[-1, -.2], [1, -.3], [.2, -1], [-1, -.5], [1, -.1], [-.3, -1], [1, -.6], [-1, -.1]][k] };
    });
  const RACKY = 800, RACKH = 150;
  const slotPos = i => { const sl = SLOTS[i]; return [sl.x, sl.y, sl.s]; };
  function agentAt(i, t) {                                     // current [x, y, s, k] of agent i (k = 0..1 arrival)
    const a = AG[i], [x, y, s] = slotPos(i), age = t - a.born;
    if (a.parent < 0) {                                         // flown out of the machine on an arc
      const u = clamp(age / .4), e = easeOut(u);
      return [lerp(MOUTH[0], x, e), lerp(MOUTH[1], y, u) - Math.sin(u * Math.PI) * 120, lerp(6, s, e), u];
    }
    const [px, py, ps] = agentAt(a.parent, a.born), e = easeOut(clamp(age / .3));
    return [lerp(px, x, e), lerp(py, y, e), lerp(ps, s, e), e];
  }
  function drone(x, y, sc, t, o = {}) {                        // a little quadcopter, body centre (x, y); o.card: GPU card slung o.cable below
    push(); translate(x, y); rotate(o.tilt || 0);
    if (o.card) {
      const cy = o.cable;
      for (const d of [-1, 1]) inkLine([[d * 10 * sc, 8 * sc], [d * 26 * sc, cy - 10 * sc]], .7, '#C8D2E6', 'inkfine', 0);
      gpuCard(0, cy, .2 * sc, t, { fans: false });
    }
    paint(rectPts(-6 * sc, 6 * sc, 12 * sc, 6 * sc), { wash: '#1A2236', ink: INK, sw: .6 });                         // camera pod
    for (const [ax, ay, far] of [[-27, -8, 1], [27, -8, 1], [-46, -2, 0], [46, -2, 0]]) {
      inkLine([[0, -2 * sc], [ax * sc, ay * sc]], far ? 2 : 3, far ? '#2A3044' : '#3A4258', 'ink', 0);               // arm
      paint(rectPts((ax - 4) * sc, (ay - 6) * sc, 8 * sc, 7 * sc), { wash: '#2A3044', ink: INK, sw: .5 });          // motor
      const rx = ax * sc, ry = (ay - 8) * sc, rw = (far ? 17 : 21) * sc;                                             // rotor disc + blur
      paint(ellPts(rx, ry, rw, 3.6 * sc, 16), { wash: '#DCE4F4', washOp: far ? 70 : 105, ink: '#9AA6C0', sw: .4 });
      const a = t * 37 + ax;
      inkLine([[rx + Math.cos(a) * rw, ry + Math.sin(a) * 2 * sc], [rx - Math.cos(a) * rw, ry - Math.sin(a) * 2 * sc]], .8, '#F2F5FF', 'inkfine', 0);
    }
    paint(rrPts(-20 * sc, -9 * sc, 40 * sc, 16 * sc, 6 * sc, 1), { wash: '#E8ECF4', fill: '#9AA6C0', fillOp: 90, tex: .4, ink: INK, sw: .9 });  // body
    paint(rectPts(-14 * sc, -2 * sc, 28 * sc, 3 * sc), { wash: TK.green, ink: null });                                                  // stripe
    const led = Math.sin(t * 14 + x) > 0;                                                                                               // blinking LED
    paint(ellPts(14 * sc, -5 * sc, 2.6 * sc, 2.6 * sc, 8), { wash: led ? '#FF4040' : '#5A1A1A', ink: null });
    if (led) glowAt(14 * sc, -5 * sc, 10 * sc, '#FF4040', 140);
    pop();
  }
  function more(t) {
    back(A5.sky);
    const L = { city: 1, fire: 1, facade: 1, sky: 1, banner: .18 };
    const flare = Math.max(kick(t, [MA.a, MA.agents, MA.more, MA.compute], .35), .4 * kick(t, MB, .25));
    a05_sky(t, L); a05_city(t, L);
    a05_noSign = true; a05_factory(t, { ...L, fire: 1 + .3 * flare }); a05_noSign = false;
    // sodium lamp posts on the yard, light pools on the ground
    for (const [lx, ly, h] of [[640, 1010, 330], [1330, 1000, 320]]) {
      paint(ellPts(lx, ly + 10, 170, 36, 18), { wash: A2.sodium, washOp: 55, ink: null });
      inkLine([[lx, ly], [lx, ly - h], [lx + (lx < 960 ? 50 : -50), ly - h]], 3, '#05060E', 'ink', 0);
      glowAt(lx + (lx < 960 ? 50 : -50), ly - h + 8, 60, A2.sodium, 120);
    }
    // the server racks along the back, dark until a GPU is slotted in
    for (const c of CR) {
      if (c.hold) continue;
      const on = t >= c.plug ? 1 : 0, x = c.slot[0].x, k = kick(t, [c.plug], .3);
      if (on) glowAt(x, RACKY - RACKH / 2, 130 + 40 * k, TK.green, 110 + 80 * k);
      serverRack(x - 38, RACKY - RACKH, 76, RACKH, on ? t : 0, { units: 6, seed: c.slot[1] });
      if (!on) paint(rectPts(x - 38, RACKY - RACKH, 76, RACKH), { wash: '#05060E', washOp: 150, ink: null });
      else inkLine([[x + 38, RACKY - 20], [x + 70, RACKY + 4], [x + 120, RACKY + 8]], 2, k > .1 ? A2.hazard : A2.acid, 'ink', 0);   // power lead
    }
    // the hiring machine: pumps on every beat, mouth flashes when it spits
    const pump = kick(t, [MA.a, ...MB], .18), spit = Math.max(kick(t, [MA.a, ...AG.filter(a => a.parent < 0).map(a => a.born)], .15));
    push(); translate(700, 1060); scale(1.25 + pump * .05, 1.25 - pump * .075);
    paint(ellPts(0, 6, 150, 22, 16), { wash: '#05060E', washOp: 160, ink: null });
    paint(rrPts(-120, -300, 240, 300, 18, 1), { wash: A2.gunmetal, fill: A2.gunDk, fillOp: 90, tex: .5, ink: INK, sw: 1.4 });
    hazard(-120, -60, 240, 22);
    paint(ellPts(-30, -190, 58, 58, 20), { wash: '#1A2236', ink: INK, sw: 1.2 });                                   // porthole, an agent inside
    clawd(-30, -150, 5.5, { col: '#6F8BE0', dk: '#3D55A8', lt: '#B5C6F0', eyes: 'happy', mouth: 'smile', noShadow: true, dy: -Math.abs(Math.sin(t * 9)) * 2 });
    paint(ellPts(-30, -190, 58, 58, 20), { wash: '#B5C6F0', washOp: 40, ink: INK, sw: 1.4 });
    paint(rectPts(70, -180, 50, 70), { wash: '#05060E', ink: INK, sw: 1 });                                          // the mouth
    if (spit > .05) glowAt(100, -145, 70, '#B5C6F0', 160 * spit);
    paint(rectPts(-90, -340, 180, 40, 1), { wash: A2.steel, ink: INK, sw: 1 });
    letter('HIRING', 0, -320, 26, A2.hazard, { font: ruFont(26), ink: false });
    paint(ellPts(0, -362, 22, 22, 12), { wash: pump > .3 ? A2.hazard : A2.sodium, ink: INK, sw: .8 });                  // beacon
    glowAt(0, -362, 60, A2.sodium, 90 + 100 * pump);
    for (const d of [-1, 1]) paint(rectPts(d * 80 - 12, -12, 24, 22), { wash: A2.steelLt, ink: INK, sw: .6 });
    pop();
    steam(640, 760, t, { k: .6 + .4 * pump, len: 160, n: 4, seed: 4 });
    // the agents, back to front
    const list = [];
    AG.forEach((a, i) => { if (t >= a.born) list.push([i, ...agentAt(i, t)]); });
    list.sort((p, q) => p[2] - q[2]);
    for (const [i, x, y, s, k] of list) {
      const a = AG[i], c = CR.find(c => c.slot[1] === i), catching = c && t > c.land - .25 && t < c.plug + .1;
      const cheer = t > MA.compute + .3, born = kick(t, [a.born], .12);
      if (a.parent >= 0 && born > .1) glowAt(x, y - 4 * s, 6 * s, "#DDE6FF", 110 * born);                        // the clone «pop»
      const st = move(cheer && !catching ? (i % 3 ? 'bounce' : 'hop') : 'idle', t + i * .05, i);
      agentBot(x + st.dx * s, y, s, t, { ...st, n: i + 1, rot: NOTXT, noShadow: true, seed: i, sq: (k < 1 ? .08 * (1 - k) : 0) + born * .12,
        eyes: catching ? 'look' : cheer ? 'happy' : 'spark', lookY: catching ? -1 : 0, mouth: cheer || catching ? 'O' : 'smile',
        aL: catching ? 2.6 : st.aL, aR: catching ? 2.6 : st.aR });
    }
    // the drones: arc in from off-frame, lower the card into the raised hands, let go and zip up and away; the card goes into the rack
    for (const c of CR) {
      if (t < c.t0 || t > c.land + .6) continue;
      const [sl] = c.slot, catchY = sl.y - 9 * sl.s, sc = 1.7, cable = 78, hy = catchY - cable;
      let x, y, tilt;
      if (t < c.land) {                                                                       // fly in on a bezier arc, slow to a hover
        const u = easeOut(clamp((t - c.t0) / FL)), [fx, fy] = c.from, x0 = sl.x + fx * 900, y0 = hy + fy * 700 - 200;
        const mx = sl.x + fx * 260, my = hy - 220;
        x = (1 - u) ** 2 * x0 + 2 * (1 - u) * u * mx + u * u * sl.x; y = (1 - u) ** 2 * y0 + 2 * (1 - u) * u * my + u * u * hy;
        tilt = -fx * .35 * (1 - u) + Math.sin(t * 6 + c.k) * .03;
      } else {                                                                                // released: accelerate up and out
        const v = t - c.land, dir = c.from[0] >= 0 ? -1 : 1;
        x = sl.x + dir * 900 * v * v * 2; y = hy - 1300 * v * v * 2 - 40 * v; tilt = dir * .3 * clamp(v * 4);
      }
      if (t < c.land) drone(x, y, sc, t, { tilt, card: 1, cable });
      else drone(x, y, sc, t, { tilt });
    }
    // released cards: in the catcher's hands, then shoved into the rack (back row) or held up (second row)
    for (const c of CR) {
      if (t < c.land || t > c.plug) continue;
      const [sl] = c.slot, catchY = sl.y - 9 * sl.s;
      const y = c.hold ? catchY + Math.sin(t * 9 + c.k) * 3 : lerp(catchY, RACKY - RACKH * .45, easeIn(clamp((t - c.land) / (c.plug - c.land))));
      gpuCard(sl.x, y, .2 * 1.7, t, { fans: false, glow: c.hold ? .5 : 0 });
    }
    for (const c of CR) if (!c.hold) { const x = c.slot[0].x; sparks(x, RACKY - RACKH * .5, t - c.plug, c.slot[1] * 7, 14, 150); }
    flash(.18 * kick(t, [MA.compute + .8], .12), A2.hazard);
  }
  scene('more_agents', MA.a, MA.end, more, [[MA.a, 960, 680, 1200], [105.839, 960, 760, 1000, 1]],
    [[MA.a, 6], [MA.agents, 6], [MA.more, 8], [MA.compute, 10]]);
})();
