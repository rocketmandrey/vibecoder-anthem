// tokensEN/v8_a.js: round v8, native rebuilds on the new track (real seconds inside, registered in v1 time):
//   1. intro real 0–22.40 (Sisyphus → the press, the title slam on the 13.24 downbeat)
//   2+3. «Every last token has to die» + «Don't need an app … why the hell not?» real 30.42–38.34, one take at the desk
(() => {
  const INK = PAL.ink;
  const { kick, NOTXT, native, back, rubble } = ENK;
  const eased = (t, a, b) => ease(seg(t, a, b));
  const RDB = EN_DOWNBEATS.map(O2N), RBT = EN_BEATS.map(O2N);
  const rw = (w, n) => O2N(enWord(w, N2O(n)));
  const dropCh = name => { const c = CH.find(c => c.name === name); if (c) CH.splice(CH.indexOf(c), 1); };
  const dropPunch = (a, b) => { for (let i = EN_PUNCH.length - 1; i >= 0; i--) if (EN_PUNCH[i][0] >= a && EN_PUNCH[i][0] < b) EN_PUNCH.splice(i, 1); };

  // ======== 1. INTRO real 0–22.40 (instrumental): Sisyphus ========
  // Clawd heaves one giant token up a 45° slope, one heave per downbeat (two big knock-backs: the 5.22 section hit and the 7.92 downbeat roll it back down), rolls it
  // along the plateau onto the bed of a huge press, steps back and waits under it while far away on the horizon a factory
  // skyline rises out of the haze, its windows switching on beat by beat; the 13.24 downbeat SLAMS it + the title, then the press hammers on every downbeat to 22.40.
  const IA = 0, IB = 22.40;
  const DROP = O2N(EN_HITS.map(h => h[0]).find(h => O2N(h) > .5) ?? N2O(1));
  const SLIPS = [5.22, 7.92], SLAM = 13.24, TOP = 9.7;
  const HV = RDB.filter((d, i, a) => d > 1.2 && d < 9.3 && SLIPS.every(s => Math.abs(d - s) > .2) && !(i && d - a[i - 1] < .3));   // heave downbeats
  const INH = [...RDB.filter(d => d >= SLAM - .05 && d < IB - .3), ...RBT.filter(b => b > 21.3 && b < IB - .1)];      // slams; last bar every beat
  const FAR = Array.from({ length: 16 }, (_, i) => ({ x: 520 + i * 105 + hash(i + 40) * 40, w: 60 + hash(i + 41) * 70, h: 80 + hash(i + 42) * 130, ch: hash(i + 43) > .5 ? 110 + hash(i + 44) * 140 : 0, at: 11.15 + hash(i + 45) * .9 }));
  const LIT = RBT.filter(b => b > 11.1 && b < SLAM + .05);                                                            // window switch-on beats
  const SL = { A: [180, 1700], B: [1150, 730], r: 110, px: 1440, top: TOP, lift: [10.6, 11.1] };
  const SLD = [.7071, -.7071], SLN = [-.7071, -.7071], SLL = Math.hypot(SL.B[0] - SL.A[0], SL.B[1] - SL.A[1]);
  const climb = t => Math.max(0, .25 * Math.min(1, t / TOP) + HV.reduce((a, h) => a + .75 / HV.length * easeOut(seg(t, h - .1, h + .45)), 0)
    - SLIPS.reduce((a, d) => { const g = t - d; return a + (g < 0 ? 0 : g < .25 ? .13 * easeOut(g / .25) : .13 * Math.max(0, 1 - ease(Math.min(1, (g - .45) / 1.2)) * (g > .45))); }, 0));
  const slopeAt = t => { const u = .15 + .85 * Math.min(1, climb(t));   // starts a bit up the slope: the camera can't see left of x 0
    if (t < SL.top) return [lerp(SL.A[0], SL.B[0], u), lerp(SL.A[1], SL.B[1], u), u * SLL];
    const x = lerp(SL.B[0], SL.px, easeOut(seg(t, SL.top, SL.lift[0]))); return [x, SL.B[1], SLL + x - SL.B[0]]; };
  function intro(tv) {
    const t = O2N(tv), hit = kick(t, INH, .25);
    back('#16181D');
    for (let x = -300; x < 2300; x += 220) inkLine([[x, -800], [x, 2600]], .6, '#23262D', 'inkfine', 0);            // the wall of the pit
    // while Clawd waits the sky goes ember and FAR AWAY a factory skyline rises out of the haze on the horizon, windows switching on beat by beat
    const sky = easeOut(seg(t, 11.3, 13.1));
    if (sky > 0) {
      glowAt(SL.px, 640, 1100, TK.ember, 30 * sky + 15 * hit);
      FAR.forEach((b, i) => {
        const k = easeOut(seg(t, b.at, b.at + .9)); if (k <= 0) return;
        const top = 735 - b.h * k;
        if (b.ch) { const cx = b.x + b.w * .7, ct = top - b.ch * k; paint(rectPts(cx - 7, ct, 14, 735 - ct), { wash: '#4A3A3A', ink: null });
          if (k > .9) smoke(cx, ct - 6, t + i, { r: 10 + 6 * hit, h: 120, n: 4, per: 2.4, seed: 70 + i, col: '#8A6A5A' }); }
        paint(rectPts(b.x, top, b.w, 735 - top), { wash: '#3E3238', fill: '#2E262C', fillOp: 80, ink: null });
        for (let r = 0; r * 22 + 18 < b.h * k - 10; r++) for (let c = 0; c * 18 + 14 < b.w - 8; c++) {
          const on = LIT[Math.floor(hash(i * 31 + r * 7 + c) * LIT.length)]; if (on == null || t < on || hash(i * 13 + r * 5 + c * 3) > .55) continue;
          paint(rectPts(b.x + 8 + c * 18, top + 12 + r * 22, 9, 12), { wash: "#FFE08A", washOp: 110 + 60 * kick(t, [on], .3), ink: null });
        }
      });
      paint(rectPts(400, 560, 1900, 200), { wash: '#C8724A', washOp: 18 * sky, ink: null });                               // horizon haze over the far skyline
    }
    for (const [lx, ly, on] of [[520, 700, DROP], [980, 250, 5.22], [1440, -520, 5.22]]) {                       // hanging lamps bang on with the drops
      inkLine([[lx, -1400], [lx, ly - 30]], .8, INK, 'inkfine', 0); paint([[lx - 30, ly - 30], [lx + 30, ly - 30], [lx + 70, ly + 20], [lx - 70, ly + 20]], { wash: A2.gunDk, ink: INK, sw: .6 });
      if (t > on && sky < .5) paint([[lx - 60, ly + 20], [lx + 60, ly + 20], [lx + 260, ly + 700], [lx - 260, ly + 700]], { wash: '#FFE2A8', washOp: 40 * (1 - 2 * sky), ink: null });
    }
    // the hill: slope + plateau, a hazard edge along the top
    const edge = []; for (let x = -600; x <= 2400; x += 50) edge.push([x, x < SL.B[0] ? SL.A[1] + (SL.A[0] - x) : SL.B[1]]);   // dense: brush clamps far vertices
    paint([...edge, [2400, 2800], [-600, 2800]], { wash: '#6A5A4A', fill: '#3A3028', fillOp: 90, tex: .6, ink: INK, sw: 2 });
    inkLine(edge.filter(([x]) => x > -300 && x < 2200), 7, '#D8B880', 'ink', 0);
    for (let k = 0; k < 9; k++) { const u = hash(k + 4), x = lerp(-300, SL.B[0], u), y = SL.A[1] + (SL.A[0] - x) + 40 + hash(k) * 120; paint(ellPts(x, y, 26 + hash(k + 1) * 30, 14 + hash(k + 2) * 12, 8, 4, k), { wash: '#3A3F48', ink: INK, sw: .6 }); }
    // the press (bed on the plateau): idle, a creak shiver while Clawd waits, then the slams
    const PW = 520, PH = 1000, wob = t > SL.lift[1] && t < SLAM - .1 ? Math.sin(t * 40) * 2 * seg(t, 12, SLAM) : 0;
    const PX = SL.px - PW / 2 + wob, PY = SL.B[1] + 10 - PH, bedY = PY + PH - PH * .12;
    press(PX, PY, PW, PH, t, t < SLAM - .2 ? [999] : INH, { seed: 3, token: false });
    // the token: rolled up the slope, along the plateau, lifted onto the bed, flattened by the slam
    const [gx0, gy0, s] = slopeAt(t), lift = eased(t, SL.lift[0], SL.lift[1]), sq = t >= SLAM ? .2 : 1;
    const ov = 1 - eased(t, SL.top - .15, SL.top + .25);
    const bx = gx0 + SLN[0] * SL.r * ov, by = lerp(lerp(gy0, bedY, lift), gy0 + SLN[1] * SL.r + SL.r, ov);
    push(); translate(bx, by); scale(1 + (1 - sq) * .5, sq); translate(0, -SL.r); rotate(t < SL.lift[0] ? s / SL.r : 0);
    token(0, 0, SL.r, { spin: .02, burn: t > SLAM + .6 ? seg(t, SLAM + .6, SLAM + 4) * .6 : 0 }); pop();
    // Clawd right behind it, leaning in; after the lift he steps back under the press and stares up
    const pushing = t < SL.lift[1], back2 = eased(t, SL.lift[1], SL.lift[1] + .6);
    const cu = lerp(12, 17, 1 - ov), [fx, fy] = [lerp(bx - SL.r - 80 - 5 * (cu - 12) - 140 * back2, gx0 - SLD[0] * (SL.r + 80), ov), lerp(SL.B[1], gy0 - SLD[1] * (SL.r + 80), ov)];
    const slip = SLIPS.some(d => t > d && t < d + .7), heave = kick(t, HV, .25);
    clawd(fx, fy, cu, { walk: pushing && !slip ? t * (1.6 + 2.4 * heave) : null, rot: lerp(pushing ? .2 + .12 * heave : 0, .3, ov), sq: -.06 * heave + (t > SLAM ? .08 * hit : 0),
      eyes: t > SLAM ? 'spark' : slip ? 'scared' : pushing ? 'narrow' : 'look', lookX: 1, lookY: t > SL.lift[1] ? -1 : 0,
      mouth: t > SLAM ? 'O' : heave > .3 || slip ? 'O' : pushing ? 'flat' : 'smile', aL: pushing ? 1.3 : .3, aR: pushing ? 1.3 : .3, emote: pushing && t > 4 ? 'sweat' : null, noShadow: true });
    for (const h of INH) { sparks(SL.px, bedY - 20, t - h, h * 3, 16, 360); rubble(SL.px, SL.B[1] + 10, 560, t - h, h); }
    if (t >= SLAM) stamp('BURN THE TOKENS', 1380, 930, 78, t, SLAM, { col: TK.yellow, rot: -.04 });
    flash(Math.min(.3, kick(t, [SLAM], .2) * .3), TK.yellowLt);
  }
  dropCh('en_intro');
  chapter('en_v8_intro', N2O(IA), N2O(IB), [[N2O(IA), native(intro)]], { real: true });
  const IK = [0, 1.5, 3, 4.5, 6, 7.5, 9, SL.top].map((k, i) => { const [x, y] = slopeAt(k); return [N2O(k), x - 150 + 130 * k / SL.top, y - 100, 760, i ? 1 : 0]; });
  if (window.RU34) RU34.push([N2O(IA), N2O(IB), [...IK, [N2O(SL.lift[1]), 1330, 400, 980, 1], [N2O(SLAM - .01), 1380, 330, 1080, 1], [N2O(IB) - .001, 1380, 350, 1050, 1]]],
    [N2O(IB), N2O(IB) + .001, [[N2O(IB), 960, 500, 860]]]);   // cut back to a02's office key (its 18.16 key fell inside the span above)
  dropPunch(N2O(IA), N2O(IB));
  EN_PUNCH.push([N2O(SLAM), 18], [N2O(DROP), 8], ...SLIPS.map(d => [N2O(d), 12]), ...HV.map(h => [N2O(h), 4]), ...INH.slice(1).map(h => [N2O(h), 9]));

  // ======== 2+3. real 30.42–38.34: one take at the desk, Sunday night ========
  // «Every last token has to die»: a stack of six tokens by the desk; on each word one hops over Clawd into the laptop screen (flare, the wall
  // limit bar ticks up), the last one on «die». «Don't need an app»: an app tile pops out of the screen, swatted off on «app»; «don't need a
  // bot»: a bot peeks up behind the laptop, flicked away on «bot». «Still got tokens»: a fat sack of tokens bursts up from under the desk on
  // the 35.8 slam; «so why the hell not?»: Clawd shrugs, the sack tips and a stream of tokens arcs into the laptop, the bar hits 100% on «not?».
  const DA = rw('every', 30.42), DB = 38.34;
  const W8 = { every: DA, last: rw('last', 30.68), token: rw('token', 31.04), has: rw('has', 31.68), to: rw('to', 32.02), die: rw('die.', 32.20),
    app: rw('app,', 33.60), bot: rw('bot.', 34.84), still: rw('still', 35.30), tokens: 35.805, so: rw('so', 36.50), why: rw('why', 36.66), not: rw('not?', 37.34) };
  const THROWS = [W8.every, W8.last, W8.token, W8.has, W8.to, W8.die].map(w => w - .12), FLY = .36;
  const STACK = [665, 840], SCR = [1200, 700], CX = 905, DY = 840, LX = 1200;
  const STREAM = []; for (let s = W8.so + .05; s < DB; s += .075) STREAM.push(s);
  const arcPt = (p, q, h, u) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u) - Math.sin(u * Math.PI) * h];
  const landed = s => THROWS.filter(w => s >= w + FLY).length;
  function laptop8(x, y, s, flare) {                                      // open laptop facing us on the desk; the screen flares orange as tokens go in
    push(); translate(x, y); scale(s);
    paint([[-120, 0], [120, 0], [104, -16], [-104, -16]], { wash: A2.steelLt, ink: INK, sw: .9 });
    paint(rectPts(-104, -176, 208, 160, 3), { wash: '#3A4450', ink: INK, sw: 1 });
    paint(rectPts(-92, -164, 184, 136), { wash: mixCol('#1A2436', TK.orange, Math.min(1, flare)), ink: null });
    for (let k = 0; k < 4; k++) paint(rectPts(-76, -150 + k * 18, 70 + 50 * hash(k), 7), { wash: '#4A6A9A', washOp: 200 * (1 - Math.min(1, flare)), ink: null });
    paint(ellPts(0, -96, 34, 34, 14), { wash: TK.ember, washOp: 255 * Math.min(1, flare), ink: null });
    if (flare > .05) { glowAt(0, -96, 130, TK.orange, 45 * Math.min(1, flare)); paint(flamePts(0, -72, 50, 70 * Math.min(1, flare), T, 3, 3), { wash: TK.yellow, ink: null, curv: .35 }); }
    pop();
  }
  function sack(x, y, s, tilt, burst) {                                    // a fat burlap sack of tokens, mouth up (tilt rotates it toward +x)
    push(); translate(x, y); rotate(tilt);
    paint([[-95, 0], [-112, -70], [-98, -150], [-60, -190], [60, -190], [98, -150], [112, -70], [95, 0]], { wash: '#B8925E', fill: '#8A6A3E', fillOp: 80, tex: .7, ink: INK, sw: 1.2, curv: .3 });
    for (let i = 0; i < 5; i++) token(-60 + i * 30, -196 - (i % 2) * 14, 22, { spin: s * 1.2 + i * .4 });
    paint(rectPts(-70, -186, 140, 16, 1), { wash: '#6A4A28', ink: INK, sw: .8 });
    paint(ellPts(0, -95, 34, 34, 14), { wash: TK.gold, ink: TK.goldDk, sw: .8 });
    paint(tokenT(30, TK.goldDk).pts, { wash: TK.goldDk, ink: null });
    for (let i = 0; i < 6; i++) { const p = burst > 0 && burst < 1 ? burst : -1; if (p < 0) break;
      const a = -Math.PI / 2 + (hash(i + 3) - .5) * 1.8, d = 260 * easeOut(p); token(Math.cos(a) * d * .7, -200 + Math.sin(a) * d - p * p * -300, 20, { spin: s * 3 + i }); }
    pop();
  }
  function desk8(tv) {
    const s = O2N(tv);
    // the a02 office wall, night now
    back('#A39C93');
    paint(rectPts(-100, -400, W + 200, H + 800), { wash: '#A39C93', fill: A2.steel, fillOp: 70, bleed: .1, tex: .6, border: .3, ink: null });
    for (let i = 0; i < 9; i++) inkLine([[i * 240 + 40, -300], [i * 240 + 40, 1100]], .35, A2.steel, 'inkfine', 0);
    paint(rectPts(588, 60, 334, 286, 1), { wash: '#1C2236', fill: '#121729', fillOp: 90, tex: .4, ink: INK, sw: 1.4 });          // night window
    for (let i = 0; i < 6; i++) { const bx = 600 + i * 54, bh = 60 + hash(i + 3) * 90; paint(rectPts(bx, 336 - bh, 46, bh), { wash: '#2E3446', ink: null });
      for (let k = 0; k < 3; k++) if (hash(i * 5 + k) > .45) paint(rectPts(bx + 8 + (k % 2) * 18, 336 - bh + 14 + k * 20, 10, 9), { wash: TK.yellowLt, ink: null }); }
    inkLine([[755, 60], [755, 346]], 3, INK, 'ink', 0); inkLine([[588, 200], [922, 200]], 3, INK, 'ink', 0);
    // the wall clock: 11:56 → 11:59 on the words
    const CK = [1205, 190], min = 56 + Math.min(3, landed(s) * .5);
    paint(ellPts(CK[0], CK[1], 88, 88, 24), { wash: PAL.cream, fill: '#E9DCC4', fillOp: 70, ink: INK, sw: 1.6 });
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; inkLine([[CK[0] + Math.cos(a) * 70, CK[1] + Math.sin(a) * 70], [CK[0] + Math.cos(a) * 80, CK[1] + Math.sin(a) * 80]], 2, INK, 'inkfine', 0); }
    const hand = (a, l, w, c) => inkLine([[CK[0], CK[1]], [CK[0] + Math.sin(a) * l, CK[1] - Math.cos(a) * l]], w, c, 'ink', 0);
    hand((11 + min / 60) / 12 * TAU, 44, 5, INK); hand(min / 60 * TAU, 66, 3.4, INK); hand(s * TAU / 2, 70, 1.2, TK.ember);
    // the limit bar on the wall: 50% → +3.5% a token → 100% on «not?»
    const v = Math.min(1, .5 + .035 * landed(s) + .29 * eased(s, W8.so + .3, W8.not));
    const full = s >= W8.not;
    limitBar(600, 440, 640, v, { label: 'WEEKLY LIMIT', glow: full ? .15 : 0 });
    // the bot peeks up behind the laptop, flicked off on «bot»
    const bk = seg(s, W8.bot, W8.bot + .7);
    if (s > W8.bot - .8 && bk < 1) {
      const up = easeOut(seg(s, W8.bot - .8, W8.bot - .45)), x = 1150 + easeIn(bk) * 520, y = lerp(880, 640, up) - Math.sin(bk * Math.PI * .8) * 360;
      agentBot(x, y, 11, s, { n: 7, rot: NOTXT + bk * 9, flip: true, eyes: bk > 0 ? 'x' : 'happy', mouth: bk > 0 ? 'O' : 'smile', aL: 1.4, aR: 1.4, noShadow: true });
    }
    // Clawd behind the desk
    const sw1 = seg(s, W8.app - .15, W8.app + .25), fl = seg(s, W8.bot - .12, W8.bot + .22), thr = kick(s, THROWS, .18);
    const shrug = eased(s, W8.why - .1, W8.why + .15) * (1 - eased(s, W8.not - .05, W8.not + .1)), win = s >= W8.not;
    const pre = s < W8.die + .1, gaze = s >= W8.still && s < W8.so ? -1 : 1;
    clawd(CX, 882, 30, {
      rot: -.22 * Math.sin(sw1 * Math.PI) + .18 * Math.sin(fl * Math.PI) + .04 * Math.sin(s * 7) * (win ? 1 : 0), noShadow: true,
      eyes: win ? 'spark' : s > W8.tokens && s < W8.so ? 'spark' : pre || s < W8.bot + .3 ? 'narrow' : 'look', lookX: gaze,
      mouth: win ? 'grin' : shrug > .3 ? 'O' : s > W8.die && s < W8.die + .6 ? 'grin' : 'flat', flip: gaze < 0,
      aL: win ? 1.9 : .3 + 1.2 * thr + 1.6 * Math.sin(sw1 * Math.PI) + 1.5 * shrug, aR: win ? 1.9 : .3 + 1.4 * Math.sin(fl * Math.PI) + 1.5 * shrug,
    });
    // the desk (Clawd's legs behind it), the laptop on it
    paint(rectPts(-200, DY, W + 400, 900), { wash: '#6E5A4A', fill: A2.gunmetal, fillOp: 90, tex: .6, ink: INK, sw: 1 });
    inkLine([[-200, DY + 22], [W + 200, DY + 22]], .6, A2.gunDk, 'inkfine', 0);
    const arrive = [...THROWS.map(w => w + FLY), ...STREAM.map(w => w + FLY)], glow = Math.min(1.2, kick(s, arrive, .2) + (full ? .6 : 0));
    laptop8(LX, DY + 4, 1.25, glow);
    // the stack (shrinks as tokens hop off) — then the sack bursts up on «tokens»
    const left = 6 - THROWS.filter(w => s >= w).length;
    for (let i = 0; i < left; i++) { push(); translate(STACK[0], STACK[1] - 10 - i * 15); scale(1, .36); token(0, 0, 34, { spin: .02 }); pop(); }
    const sk = backOut(seg(s, W8.tokens - .2, W8.tokens + .15));
    if (sk > 0) { push(); translate(STACK[0], DY); scale(.85); translate(-STACK[0], -DY); sack(STACK[0], lerp(DY + 260, DY + 6, sk), s, .55 * eased(s, W8.so - .1, W8.so + .25), seg(s, W8.tokens, W8.tokens + .7)); pop(); }
    // flying tokens: the six hops, then the stream out of the sack's mouth
    for (const w of THROWS) { const u = seg(s, w, w + FLY); if (u > 0 && u < 1) { const [x, y] = arcPt([STACK[0], STACK[1] - 100], SCR, 330, easeOut(u)); token(x, y, 36 * (1 - .5 * u), { spin: s * 3 + w }); } }
    const MOUTH = [STACK[0] + 120, DY - 190];
    for (const w of STREAM) { const u = seg(s, w, w + FLY); if (u > 0 && u < 1) { const [x, y] = arcPt(MOUTH, SCR, 260 + hash(w * 9) * 120, u); token(x, y, 28 * (1 - .4 * u), { spin: s * 4 + w * 7 }); } }
    // screen flares on arrival (a ring of sparks out of the screen), the big one on «die» and on «not?»
    for (const a of [...THROWS.map(w => w + FLY), W8.not]) sparks(SCR[0] - 10, SCR[1], s - a, a * 7, a === W8.not || a === THROWS[5] + FLY ? 16 : 8, a === W8.not ? 320 : 180);
    // the app tile: pops out of the screen, swatted off on «app»
    const off1 = seg(s, W8.app, W8.app + .55);
    if (s > W8.app - .75 && off1 < 1) {
      const pk = backOut(seg(s, W8.app - .75, W8.app - .45)), x = lerp(SCR[0], 1130, pk) - easeIn(off1) * 760, y = lerp(SCR[1], 520, pk) - easeIn(off1) * 420 + Math.sin(s * 3) * 8;
      push(); translate(x, y); rotate(-off1 * 5 - .08); scale(Math.max(.01, .8 * Math.min(1, pk)));
      paint(rrPts(-95, -95, 190, 190, 44), { wash: TK.green, fill: TK.greenDk, fillOp: 60, ink: INK, sw: 1.4 });
      paint(rrPts(-38, -62, 76, 124, 14), { wash: PAL.cream, ink: INK, sw: .9 });
      paint(ellPts(0, 44, 9, 9, 10), { wash: TK.green, ink: null });
      paint(ellPts(78, -78, 30, 30, 16), { wash: '#E0302A', ink: INK, sw: .8 });
      pop();
      if (off1 > 0) for (let k = 0; k < 3; k++) inkLine([[1010 - k * 40, 600 + k * 50], [910 - k * 60, 560 + k * 60]], 3 * (1 - off1), PAL.cream, 'ink', 0);
    }
    if (full) flash(.3 * Math.exp(-(s - W8.not) * 8), TK.yellowLt);
  }
  dropCh('en_v1_swat');
  chapter('en_v8_desk', N2O(DA), N2O(DB), [[N2O(DA), native(desk8)]], { real: true });
  if (window.RU34) RU34.push([N2O(DA), N2O(DB), [[N2O(DA), 960, 500, 900], [N2O(W8.still), 960, 505, 880, 1], [N2O(DB) - .001, 960, 515, 850, 1]]]);
  dropPunch(N2O(DA), N2O(DB));
  EN_PUNCH.push(...THROWS.slice(0, 5).map(w => [N2O(w + FLY), 3]), [N2O(THROWS[5] + FLY), 8], [N2O(W8.app), 7], [N2O(W8.bot), 8], [N2O(W8.tokens), 10], [N2O(W8.not), 10]);
})();
