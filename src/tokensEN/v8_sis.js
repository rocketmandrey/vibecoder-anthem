// tokensEN/v8_sis.js: v12 #268 — the money-pile Sisyphus, «Worth half a trillion more!» + the break, real 210.08–218.64 (replaces scenes2.js e31_bench).
// Clawd really PUSHES his token up a small pile of money (the intro's push pose, one shove per beat); just as he nears the top the capitalists
// on the right throw money on in rhythm, the summit climbs away from him; he keeps pushing. 217.18 the token gets away and rolls back over him,
// he tumbles down, flat on the floor on the 217.84 downbeat; 218.60 a last spill of coins. Three variants (?var_sis=a|b|c); the user picked b (default):
//   a: side view, two fat cats shovel on every beat, the summit creeps up and away, the camera pulls back gradually
//   b: the fat cats stand on a cliff edge high up and drop money SACKS on the downbeats — the pile jumps in steps, the summit leaves the frame,
//      the camera tilts up after it each time
//   c: treadmill — the pile grows under him as fast as he climbs, the camera rides with him (he stays mid-frame, the floor drops away);
//      the end is a token avalanche that sweeps him down, the camera pulls back to the whole tower
(() => {
  const INK = PAL.ink, { kick, back } = ENK;
  const V = ((window.BTT_VAR || {}).sis || 'b').toLowerCase();
  const A = 210.08, B = 218.64, G = 1060, SLIP = 217.18, FLOOR = 217.84, LAST = 218.60;
  const near = (x, L) => L.some(y => Math.abs(x - y) < .02);
  const RDB = EN_DOWNBEATS.map(O2N), BT = EN_BEATS.map(O2N).filter(b => b > A + .3 && b < B);
  const DOWN = BT.filter(b => near(b, RDB));
  const PS = .8, PR = 110, TR = 76, CU = 15;
  const surfOf = P => x => G - Math.max(0, P.H - PS * (Math.hypot(x - P.X, PR) - PR));
  const stepE = a => a < 0 ? 0 : a > .25 ? 1 : 1 + .6 * Math.sin(a / .25 * Math.PI) * (1 - a / .25) + (easeOut(clamp(a / .12)) - 1);   // a step with an overshoot bump

  // ---- per-variant plan: THROWS [beat, weight] (the load LANDS on the beat), pile X/H ranges, Clawd's foot x(t) ----
  const CFG = {
    a: { throws: BT.filter(b => b > 211 && b <= SLIP + .01).map(b => [b, 1]), X: [760, 1460], H: [300, 1000], x0: 420, xa: 540, ta: 211.26, v: 55, sv: 12 },
    b: { throws: [...DOWN.filter(b => b > 212 && b < SLIP), SLIP].map(b => [b, b === SLIP ? .4 : 1]), X: [820, 1320], H: [300, 1300], x0: 440, xa: 610, ta: 212.5, v: 14, sv: 26 },
    c: { throws: BT.filter(b => b > 210.5 && b <= SLIP + .01).map(b => [b, 1]), X: [800, 1180], H: [300, 1500], x0: 440, xa: 480, ta: 210.6, v: 40, sv: 10 },
  }[V] || null;
  if (!CFG) return;
  const TW = CFG.throws.reduce((a, [, w]) => a + w, 0);
  const growK = t => CFG.throws.reduce((a, [b, w]) => a + w / TW * stepE(t - b), 0);
  const growS = t => CFG.throws.reduce((a, [b, w]) => a + w / TW * easeOut(seg(t, b, b + .2)), 0);   // no overshoot (for the summit X)
  // c: the avalanche slumps the summit from SLIP
  const slump = t => V === 'c' ? 380 * easeOut(seg(t, SLIP, SLIP + .7)) : 0;
  const pileAt = t => { const k = growK(Math.min(t, SLIP + .3)), ks = growS(Math.min(t, SLIP + .3)); return { X: lerp(CFG.X[0], CFG.X[1], ks), H: lerp(CFG.H[0], CFG.H[1], k) - slump(t) }; };
  const PUSHB = BT.filter(b => b < SLIP - .05);
  // Clawd's foot x while pushing: a hard push up to the (small) summit by ta, then a creep + a shove on every beat
  const footX = t => {
    const tt = Math.min(t, SLIP);
    const app = lerp(CFG.x0, CFG.xa, easeOut(seg(tt, A, CFG.ta)));
    return app + CFG.v * Math.max(0, tt - CFG.ta) + PUSHB.filter(b => b > CFG.ta).reduce((a, b) => a + CFG.sv * easeOut(seg(tt, b - .03, b + .3)), 0);
  };
  const footXc = t => V === 'c' ? CFG.x0 + 6 * PUSHB.filter(b => b <= t).length + 30 * seg(t, A, SLIP) : footX(t);   // c: on the treadmill he barely gains ground
  // c: the summit stays ~a fixed run ahead of him (the pile grows under him as fast as he climbs)
  const pileC = t => { const P = pileAt(t); if (V !== 'c') return P; return { X: footXc(Math.min(t, SLIP)) + 360 + 40 * growS(Math.min(t, SLIP)), H: P.H }; };

  // ---- the fat cat (from scenes2.js e31_bench): tailcoat, top hat, monocle, cigar; optional shovel along the right arm ----
  const tophat = (u, sw) => { paint(rectPts(-3.4 * u, -11.6 * u, 6.8 * u, 3.8 * u), { wash: TK.soot, ink: INK, sw: sw * .6 }); paint(rectPts(-4.6 * u, -8.1 * u, 9.2 * u, .7 * u), { wash: TK.soot, ink: INK, sw: sw * .6 }); paint(rectPts(-3.4 * u, -9 * u, 6.8 * u, .7 * u), { wash: TK.ember, ink: null }); };
  function fatcat(x, fy, u, o) {
    clawd(x, fy, u, { flip: true, col: '#F2C9AE', dk: '#C9937A', lt: '#FFE4D2', eyes: o.eyes || 'narrow', mouth: o.mouth || 'grin', aL: o.aL ?? .3, aR: o.aR, rot: o.rot || 0, dy: o.dy || 0, noShadow: true,
      armR: o.shovel ? (uu, sw) => {
        inkLine([[-2.4 * uu, 0], [6.4 * uu, 0]], sw * 2.2, '#7A5A3A', 'ink', 0);
        paint([[6 * uu, -1.6 * uu], [9 * uu, -1.3 * uu], [9.4 * uu, 0], [9 * uu, 1.3 * uu], [6 * uu, 1.6 * uu]], { wash: '#8A93A0', fill: '#5A626E', fillOp: 70, tex: .4, ink: INK, sw: sw * .8 });
        if (o.loaded) for (let q = 0; q < 3; q++) paint(ellPts((7 + q) * uu, -.4 * uu, .8 * uu, .5 * uu, 8), { wash: TK.gold, ink: INK, sw: sw * .4 });
      } : undefined,
      draw: (uu, sw) => {
        paint(rectPts(-5 * uu, -3.6 * uu, 10 * uu, 1.6 * uu), { wash: TK.soot, fill: TK.sootLt, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
        paint([[5 * uu, -3.6 * uu], [6.6 * uu, -.6 * uu], [5.4 * uu, -.9 * uu], [5 * uu, -2 * uu]], { wash: TK.soot, ink: INK, sw: sw * .6 });
        paint([[-1.2 * uu, -3.6 * uu], [1.2 * uu, -3.6 * uu], [0, -2.2 * uu]], { wash: '#FBF8F1', ink: null });
        paint([[-1.1 * uu, -3.9 * uu], [0, -3.5 * uu], [-1.1 * uu, -3.1 * uu]], { wash: '#B0202A', ink: INK, sw: sw * .4 });
        paint([[1.1 * uu, -3.9 * uu], [0, -3.5 * uu], [1.1 * uu, -3.1 * uu]], { wash: '#B0202A', ink: INK, sw: sw * .4 });
        paint(ellPts(2.5 * uu, -6 * uu, 1.1 * uu, 1.1 * uu, 14), { ink: '#E8C870', sw: sw * .7 });
        paint(rectPts(1.1 * uu, -4.75 * uu, 2.8 * uu, .7 * uu), { wash: '#6A4022', ink: INK, sw: sw * .4 });
        paint(ellPts(4 * uu, -4.4 * uu, .4 * uu, .4 * uu, 8), { wash: TK.ember, ink: null });
        tophat(uu, sw);
      } });
  }
  const smokeOf = (x, fy, u, t, n) => { for (let q = 0; q < 3; q++) { const v = frac(t * .7 + n * .5 + q / 3); paint(ellPts(x - 4 * u - v * 30, fy - 4.6 * u - v * 90, 6 + v * 14, 5 + v * 10, 10), { wash: '#C8CCD6', washOp: 150 * (1 - v), ink: null }); } };
  const coinBit = (px, py, q, t) => { if (q % 3 === 2) paint(rotPts(rectPts(px - 16, py - 8, 32, 16), px, py, t * 6 + q), { wash: '#7FB069', ink: INK, sw: .7 }); else if (q % 2) token(px, py, 15, { spin: t * 7 + q }); else paint(ellPts(px, py, 13, 6, 10, 0, t * 5 + q), { wash: TK.gold, ink: INK, sw: .7 }); };
  const LEDGE = { x: 1400, y: -170 };                                       // b: the cliff edge the fat cats stand on
  const sack = (x, y, s, rot) => { push(); translate(x, y); rotate(rot); scale(s);
    paint([[-70, 10], [-80, -40], [-50, -95], [-18, -110], [18, -110], [50, -95], [80, -40], [70, 10], [0, 22]], { wash: '#B8925A', fill: '#8A6A3A', fillOp: 60, tex: .5, ink: INK, sw: 1.4 });
    paint([[-22, -108], [22, -108], [30, -140], [-30, -140]], { wash: '#B8925A', ink: INK, sw: 1.2 }); inkLine([[-26, -116], [26, -116]], 5, '#6A4022', 'ink', 0);
    token(0, -45, 34, { spin: .02 }); pop(); };

  function draw(tv) {
    const t = O2N(tv), P = pileC(t), surf = surfOf(P), lb = BT.filter(b => t >= b).pop(), la = lb == null ? 9 : t - lb;
    // backdrop: the hall wall (tall: the camera climbs in b/c) + the floor
    back('#1C1F24');
    paint(rectPts(-400, -2600, W + 800, 3700), { wash: '#1F2229', ink: null });
    for (let x = -300; x < 2300; x += 220) inkLine([[x, -2600], [x, G]], .6, '#2A2E37', 'inkfine', 0);
    for (let y = G - 300; y > -2600; y -= 340) { paint(rectPts(-400, y - 14, W + 800, 28), { wash: '#2A2E37', ink: null }); for (let x = -300; x < 2300; x += 220) paint(ellPts(x, y, 6, 6, 8), { wash: '#3A3F4A', ink: null }); }
    for (const lx of [520, 1400]) { inkLine([[lx, -2600], [lx, 300]], .8, INK, 'inkfine', 0); paint([[lx - 30, 300], [lx + 30, 300], [lx + 70, 350], [lx - 70, 350]], { wash: '#3A3F48', ink: INK, sw: .6 }); paint([[lx - 60, 350], [lx + 60, 350], [lx + 300, G], [lx - 300, G]], { wash: '#FFE2A8', washOp: 22, ink: null }); }
    paint(rectPts(-400, G, W + 800, 900), { wash: '#2A2D33', fill: '#1C1E22', fillOp: 80, tex: .5, ink: INK, sw: .8 });
    // b: the cliff on the right (drawn after the pile so the pile banks against it)
    const cliff = () => { paint([[LEDGE.x, LEDGE.y], [2500, LEDGE.y], [2500, G + 600], [LEDGE.x - 40, G + 600], [LEDGE.x + 30, 600], [LEDGE.x - 20, 200]], { wash: '#4A4038', fill: '#2E2824', fillOp: 90, tex: .6, ink: INK, sw: 2 });
      inkLine([[LEDGE.x, LEDGE.y], [2400, LEDGE.y]], 6, '#D8B880', 'ink', 0); };
    // the pile
    const HW = P.H / PS + PR, pts = [[-600, G + 40]]; for (let x = -600; x <= 2600; x += 25) pts.push([x, surf(x)]); pts.push([2600, G + 40]);
    paint(pts, { wash: TK.gold, fill: TK.goldDk, fillOp: 70, tex: .6, ink: INK, sw: 1.2 });
    const drift = V === 'c' ? frac(t * .35) : 0;                              // c: the coins on the surface slide down under his feet
    for (let i = 0; i < 110; i++) { const u = frac(hash(i) + drift * .08), x = P.X + (u - .55) * 1.9 * HW, y = lerp(surf(x), G + 20, hash(i + 9) * .92) + 8; if (y < G + 15 && surf(x) < G - 5) token(x, y, 13 + hash(i + 3) * 10, { spin: hash(i) }); }
    if (V === 'b') cliff();
    // the money landing on the summit on every throw: a splash of coins
    const lt = CFG.throws.map(([b]) => b).filter(b => t >= b).pop();
    if (lt != null && t - lt < .5) for (let i = 0; i < 9; i++) { const a = t - lt, x = P.X + (hash(i + lt * 7) - .5) * 300, v = 260 + hash(i + 2) * 300; token(x, surf(x) - v * a + 1400 * a * a, 15, { spin: t * 5 + i }); }

    // ---- the capitalists ----
    if (V === 'b') {
      // on the cliff edge: before each drop they heave a sack to the edge (from 0.9 s before), shove it off 0.45 s before, it lands ON the beat
      const cats = [[LEDGE.x + 110, 0], [LEDGE.x + 240, 1]];
      const nb = CFG.throws.map(([b]) => b).find(b => b > t - .02), heave = nb == null ? 0 : seg(t, nb - .9, nb - .5), shoveK = nb == null ? 0 : kick(t, [nb - .45], .15);
      cats.forEach(([x, n]) => { fatcat(x, LEDGE.y, 15, { aL: .3 + 1.1 * heave + .3 * shoveK, aR: .3 + 1.1 * heave, rot: -.12 * shoveK - .05 * heave, mouth: t > SLIP + .3 ? 'grin' : 'grin', eyes: 'narrow' }); smokeOf(x, LEDGE.y, 15, t, n); });
      for (const [b] of CFG.throws) {
        const a = t - (b - .45), Pb = pileC(b + .3), s = b === SLIP ? .7 : 1.15;
        if (t > b - .9 && a < 0) sack(LEDGE.x + 30 - 40 * seg(t, b - .9, b - .5), LEDGE.y, s, 0);         // dragged to the edge
        else if (a >= 0 && a < .45) { const k = a / .45; sack(lerp(LEDGE.x + 30, Pb.X + 40, k), lerp(LEDGE.y, G - Pb.H + 20, k * k), s, -1.2 * k); }
      }
    } else {
      // shovel on every throw beat: blade up and the load flung 0.32 s before, it lands ON the beat; scoop between
      const cats = V === 'a' ? [[P.X + 240, 0], [P.X + 380, 1]] : [[P.X + 230, 0], [P.X + 360, 1]];
      const TB = CFG.throws.map(([b]) => b);
      cats.forEach(([x, n]) => {
        const fy = surf(x) + 6, u = 15, nb = TB.find(b => b > t - .45 + n * .03), d = nb == null ? -9 : t - (nb - .36 + n * .03);   // d: time since the fling started
        const up = d < 0 ? (d > -.25 ? -.2 * (1 - (-d) / .25) : 0) : d < .1 ? easeOut(d / .1) : 1 - ease(clamp((d - .1) / .4));
        const a = -.55 + 1.9 * clamp(up);
        fatcat(x, fy, u, { shovel: true, loaded: a < .2 && d < 0, aR: a, rot: -.08 * (1 - (a + .55) / 1.9) + .04 * (a + .55) / 1.9, mouth: 'grin' });
        smokeOf(x, fy, u, t, n);
        if (d >= 0 && d < .4) for (let q = 0; q < 6; q++) {
          const k = clamp((d - q * .015) / .34); if (k <= 0 || k >= 1) continue;
          const Pn = pileC(nb), sN = surfOf(Pn), sx = x - 8 * u, sy = fy - 14 * u, ex = Pn.X - 30 - n * 40 - q * 16, ey = sN(ex) - 8;
          coinBit(lerp(sx, ex, k), lerp(sy, ey, k) - Math.sin(k * Math.PI) * 150, q, t);
        }
      });
    }

    // ---- Clawd + the token ----
    const ra = t - SLIP;
    const fx0 = footXc(t), sl0 = Math.atan2(surf(fx0 + 10) - surf(fx0 - 10), 20), D = TR + 92;
    // pushing: the token rides D ahead along the slope, rolling (angle from distance)
    const gx = fx0 + D * Math.cos(sl0), gy = surf(gx);
    const heave = kick(t, PUSHB, .25);
    const botX = Math.max(180, P.X - P.H / PS - 60);                         // where he ends up: the foot of the slope, kept in frame
    if (ra <= 0) {
      push(); translate(gx + Math.sin(sl0) * TR, gy - Math.cos(sl0) * TR); rotate(gx / (TR * .8)); token(0, 0, TR, { spin: .02 }); pop();   // a wheel on its edge: the spin follows the distance rolled
      clawd(fx0, surf(fx0) + 4, CU, { walk: fx0 / 55 + (V === 'c' ? t * 1.6 : 0), rot: sl0 + .3 + .14 * heave,   // square to the slope + leaning in: hands at the coin's centre height sq: -.06 * heave,
        eyes: 'narrow', mouth: heave > .3 ? 'O' : 'flat', aL: 1.3, aR: 1.3, emote: 'sweat', noShadow: true });
      const hx = fx0 + 20, hy = surf(fx0) - 170;                               // strain marks + sweat flung back on every shove
      for (let q = 0; q < 3; q++) { const a = -2.3 + q * .45, e = 52 + 14 * heave; inkLine([[hx + Math.cos(a) * 34, hy + Math.sin(a) * 34], [hx + Math.cos(a) * e, hy + Math.sin(a) * e]], 2.2, '#FBF8F1', 'inkfine', 0); }
      if (la < .5) for (let q = 0; q < 4; q++) { const v = la / .5, dx = -40 - (60 + 40 * hash(q + (lb | 0))) * v, dy = -30 - 120 * v + 260 * v * v;
        paint([[hx + dx, hy + dy - 9], [hx + dx + 6, hy + dy + 3], [hx + dx, hy + dy + 7], [hx + dx - 6, hy + dy + 3]], { wash: '#BFE3F7', washOp: 255 * (1 - v), ink: INK, sw: .5 }); }
    } else {
      // the token gets away: it rolls back down OVER him and off to the left; he is knocked over and tumbles to the bottom by FLOOR
      const fxS = footXc(SLIP), PS0 = pileC(SLIP), sS = surfOf(PS0), slS = Math.atan2(sS(fxS + 10) - sS(fxS - 10), 20), gx0 = fxS + D * Math.cos(slS);
      const rk = easeIn(seg(t, SLIP + .05, FLOOR - .1)), tkx = lerp(gx0, botX - 260, rk) - 260 * Math.max(0, t - FLOOR + .1);
      const hop = Math.max(0, 1 - Math.abs(tkx - fxS) / 120) * 120;
      const slT = Math.atan2(surf(tkx + 10) - surf(tkx - 10), 20), tky = Math.min(surf(tkx), G) - Math.cos(slT) * TR - hop;
      push(); translate(tkx + Math.sin(slT) * TR, tky); rotate(tkx / (TR * .8)); token(0, 0, TR, { spin: .02 }); pop();
      if (ra < 1.4) for (let q = 0; q < 6; q++) { const u = frac(q / 6 + t * 2); paint(ellPts(tkx + 40 + u * 90, Math.min(surf(tkx + 60), G) - 10 - u * 30, 10 + u * 16, 6 + u * 9, 8), { wash: '#B8A58C', washOp: 160 * (1 - u), ink: null }); }
      // c: the avalanche — a sheet of tokens pouring down the left slope, overtaking him
      if (V === 'c') for (let i = 0; i < 90; i++) { const u = frac(hash(i) + (t - SLIP) * (.9 + .5 * hash(i + 1))); if (t - SLIP < .3 * i / 90) continue;
        const x = lerp(P.X - 40, botX - 200, u) + (hash(i + 5) - .5) * 60, y = Math.min(surf(x), G) - 20 - hash(i + 7) * 70 * (1 - u); token(x, y, 18 + hash(i + 2) * 14, { spin: t * 4 + i }); }
      const hit = SLIP + .18, fk = easeIn(seg(t, hit, FLOOR)), bx = lerp(fxS, botX + 60, fk), by = t < FLOOR ? Math.min(surf(bx), G) + 4 - Math.sin(fk * Math.PI) * 60 : G + 4;
      const lying = t >= FLOOR, landK = kick(t, [FLOOR], .2);
      clawd(bx, by, CU, { rot: t < hit ? .22 - 1.2 * seg(t, SLIP, hit) : lying ? -1.45 : .22 - 1.2 - 9 * fk, sq: lying ? .18 * landK : 0,
        eyes: lying ? 'closed' : 'scared', mouth: lying ? 'flat' : 'O', aL: lying ? .1 : 1.4, aR: lying ? .1 : 1.4, dy: lying ? -.3 : 0, noShadow: true });
      if (lying) { sparks(bx, G - 30, t - FLOOR, 7, 12, 220); for (let q = 0; q < 3; q++) { const a = t * 4 + q * TAU / 3; paint(ellPts(bx - 40 + Math.cos(a) * 60, G - 150 + Math.sin(a) * 18, 10, 10, 6), { wash: TK.yellow, ink: INK, sw: .6 }); } }   // circling stars
      // LAST: one more scoop of coins lands on him
      if (t > LAST - .4) for (let i = 0; i < 10; i++) { const a = clamp((t - (LAST - .4)) / .4), x = bx - 80 + hash(i + 3) * 160, y = lerp(-600 + (G - 1060), G - 30 - hash(i) * 40, easeIn(a)); if (a < 1 || hash(i + 9) > .3) token(x, y, 16, { spin: t * 6 + i }); }
    }
  }

  // ---- register: replace e31_bench over real 210.08–218.64 ----
  const c = CH.find(c => c.name === 'en_e31_bench'); if (c) CH.splice(CH.indexOf(c), 1);
  const a1 = N2O(A), b1 = N2O(B);
  chapter('en_v8_sis', a1, b1, [[a1, ENK.native(draw)]], { real: true });
  for (let i = EN_PUNCH.length - 1; i >= 0; i--) if (EN_PUNCH[i][0] >= a1 && EN_PUNCH[i][0] < b1) EN_PUNCH.splice(i, 1);
  EN_PUNCH.push(...BT.filter(b => b < SLIP).map(b => [N2O(b), near(b, CFG.throws.map(x => x[0])) ? (V === 'b' ? 14 : near(b, RDB) ? 7 : 4) : 3]), [N2O(SLIP), 9], [N2O(FLOOR), 18], [N2O(LAST), 8]);

  // ---- the camera (real-time samples → v1 keys) ----
  const fit = (t, padL = 220, padR = 420) => {                                // frame Clawd, the summit and the fat cats
    const P = pileC(t), x0 = footXc(Math.min(t, SLIP)) - padL, x1 = P.X + padR, y0 = G - P.H - 260, y1 = G + 90;
    const w = Math.max(860, x1 - x0, (y1 - y0) * .75); return [(x0 + x1) / 2, Math.max(y1 - w * 2 / 3, (y0 + y1) / 2), w];
  };
  let K = [];
  if (V === 'a') { for (let r = A; r < SLIP + .2; r += .25) K.push([r, ...fit(r)]); K.push([FLOOR, 720, 860, 1440], [B - .01, 720, 870, 1420]); }
  if (V === 'b') {
    const low = r => { const P = pileC(r), x0 = footXc(Math.min(r, SLIP)) - 220, x1 = LEDGE.x + 340, y0 = Math.min(LEDGE.y - 300, G - P.H - 200), y1 = surfOf(P)(x0 + 220) + 240;   // wide: pile, Clawd and the fat cats on the cliff together
      const w = Math.max(1150, x1 - x0, (y1 - y0) * .75); return [(x0 + x1) / 2, (y0 + y1) / 2, w]; };   // holds on each sack, then tilts/pulls up
    K.push([A, LEDGE.x + 40, LEDGE.y + 380, 1100], [A + .45, LEDGE.x + 40, LEDGE.y + 380, 1100], [211.3, ...low(211.3)]);
    for (const [b] of CFG.throws) K.push([b + .02, ...low(b - .1)], [b + .6, ...low(b + .6)]);
    K.push([SLIP + .2, ...low(SLIP + .2)], [FLOOR, 870, 400, 1600], [B - .01, 870, 410, 1580]);
  }
  if (V === 'c') {
    for (let r = A; r < SLIP; r += .2) { const x = footXc(r), y = surfOf(pileC(r))(x); K.push([r, x + 120, y - 60, 880]); }
    K.push([FLOOR, 760, 780, 1500], [B - .01, 760, 790, 1480]);
  }
  K = K.map(([r, x, y, w], i) => [N2O(r), x, y, w, i ? 1 : 0]);
  if (window.RU34) RU34.push([a1, b1, K], [b1, b1 + .001, [[b1, 920, 600, 820]]]);   // + the out_sunday key it starts on
})();
