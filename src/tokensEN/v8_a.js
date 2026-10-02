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
  // Clawd heaves one giant token up a 45° slope, a shove per beat (three hard knock-backs on the 5.28 / 7.92 / 10.6 downbeats roll it back down), rolls it
  // along the plateau onto the bed of a huge press, steps back and waits under it while far away on the horizon a factory
  // skyline rises out of the haze, its windows switching on beat by beat; the 13.24 downbeat SLAMS it + the title, then the press hammers on every downbeat to 22.40.
  // v12 «Golgotha» (user: «climb a bar longer, stand less; the beats keep knocking him back, he speeds up while the gang sings,
  // and he still carries it up»): the top is reached on 12.58, rolled onto the bed by 12.80, lifted by 13.02, the 13.24 SLAM.
  // Each knock-back is a shockwave ring blasting out of a hanging speaker stack, hitting him ON the drum hit; the knock-backs grow,
  // then a heroic last push into the press (ember aura, speed streaks, the camera pushes in).
  const IA = 0, IB = 22.40;
  const DROP = O2N(EN_HITS.map(h => h[0]).find(h => O2N(h) > .5) ?? N2O(1));
  const SLAM = 13.24, TOP = 12.58, VOX = [5.22, 13.24], KD = .14, CREEP = .25;
  // v12b (user: «we have a BEAT, why knock him back on the guitar?»): the knock-backs sit on the real DRUM hits, measured off the track
  // (sharp 5–10 kHz snare/crash transients + the 10.60 kick re-entry; the analysed beat grid follows the guitar here and is half a beat off
  // in 5–6.6), each one bigger than the last: the 6.08–6.58 snare roll is four quick small jolts, 8.73/8.90 a double, 10.60 and 11.89 the big ones
  const KN = [1.392, 2.632, 4.275, 5.106, 6.084, 6.248, 6.415, 6.578, 7.605, 8.73, 8.897, 9.229, 10.601, 11.893];
  const KL = [.03, .035, .04, .055, .025, .025, .025, .025, .07, .05, .06, .08, .11, .15];
  const HB = RBT.filter((b, i, a) => b > 1.2 && b < TOP + .05 && KN.every(d => b < d - .1 || b > d + .2) && !(i && b - a[i - 1] < .25))
    .map(b => [b, (b > VOX[0] && b < VOX[1] ? 1.8 : 1) * (b > 12 ? 4 : 1)]);                          // a shove every beat, bigger while the gang sings
  const HV = HB.filter(([, w]) => w > 1.5).map(([b]) => b);
  const HW = HB.reduce((a, [, w]) => a + w, 0), KSUM = KL.reduce((a, l) => a + l, 0);
  const INH = [...RDB.filter(d => d >= SLAM - .05 && d < IB - .3), ...RBT.filter(b => b > 21.3 && b < IB - .1)];      // slams; last bar every beat
  const FAR = Array.from({ length: 16 }, (_, i) => ({ x: 520 + i * 105 + hash(i + 40) * 40, w: 60 + hash(i + 41) * 70, h: 80 + hash(i + 42) * 130, ch: hash(i + 43) > .5 ? 110 + hash(i + 44) * 140 : 0, at: 11.15 + hash(i + 45) * .9 }));
  const LIT = RBT.filter(b => b > 11.1 && b < SLAM + .05);                                                            // window switch-on beats
  const SL = { A: [180, 1700], B: [1150, 730] };
  Object.assign(SL, { r: 110, px: 1440, top: TOP, lift: [12.80, 13.02] });
  const SLL = Math.hypot(SL.B[0] - SL.A[0], SL.B[1] - SL.A[1]), SLD = [(SL.B[0] - SL.A[0]) / SLL, (SL.B[1] - SL.A[1]) / SLL], SLN = [SLD[1], -SLD[0]];
  const SK = (SL.A[1] - SL.B[1]) / (SL.B[0] - SL.A[0]), hillY = x => x < SL.B[0] ? SL.A[1] - (x - SL.A[0]) * SK : SL.B[1];
  const SPK = [930, 330];                                                                                              // C: the hanging speaker stack
  // progress: a slow creep + a shove on every beat (they pay back the knock-backs), minus a sharp KL backslide in KD from each knock beat
  const climb = t => Math.max(0, CREEP * Math.min(1, t / TOP) + HB.reduce((a, [b, w]) => a + (1 - CREEP + KSUM) * w / HW * easeOut(seg(t, b - .03, b + .26)), 0)
    - KN.reduce((a, d, i) => a + KL[i] * easeOut(seg(t, d, d + KD)), 0));
  const slopeAt = t => { const u = .15 + .85 * Math.min(1, climb(t));   // starts a bit up the slope: the camera can't see left of x 0
    if (t < SL.top) return [lerp(SL.A[0], SL.B[0], u), lerp(SL.A[1], SL.B[1], u), u * SLL];
    const x = lerp(SL.B[0], SL.px, easeOut(seg(t, SL.top, SL.lift[0]))); return [x, SL.B[1], SLL + x - SL.B[0]]; };
  const lastLE = (arr, t) => { let r = null; for (const x of arr) { if (x > t) break; r = x; } return r; };
  const kAmp = d => KL[KN.indexOf(d)] / .08;                                                                           // .3 (the roll) → 1.9 (the last one)
  function intro(tv) {
    const t = O2N(tv), hit = kick(t, INH, .25);
    back('#16181D');
    for (let x = -300; x < 2300; x += 220) inkLine([[x, -800], [x, 2600]], .6, '#23262D', 'inkfine', 0);            // the wall of the pit
    // while Clawd crests the sky goes ember and FAR AWAY a factory skyline rises out of the haze on the horizon, windows switching on beat by beat
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
      if (lx === 980) continue;                                                                                   // the speaker hangs there
      inkLine([[lx, -1400], [lx, ly - 30]], .8, INK, 'inkfine', 0); paint([[lx - 30, ly - 30], [lx + 30, ly - 30], [lx + 70, ly + 20], [lx - 70, ly + 20]], { wash: A2.gunDk, ink: INK, sw: .6 });
      if (t > on && sky < .5) paint([[lx - 60, ly + 20], [lx + 60, ly + 20], [lx + 260, ly + 700], [lx - 260, ly + 700]], { wash: '#FFE2A8', washOp: 40 * (1 - 2 * sky), ink: null });
    }
    // the hill: slope + plateau, a hazard edge along the top
    const edge = []; for (let x = -600; x <= 2400; x += 50) edge.push([x, hillY(x)]);   // dense: brush clamps far vertices
    paint([...edge, [2400, 2800], [-600, 2800]], { wash: '#6A5A4A', fill: '#3A3028', fillOp: 90, tex: .6, ink: INK, sw: 2 });
    inkLine(edge.filter(([x]) => x > -300 && x < 2200), 7, '#D8B880', 'ink', 0);
    for (let k = 0; k < 9; k++) { const u = hash(k + 4), x = lerp(-300, SL.B[0], u), y = hillY(x) + 40 + hash(k) * 120; paint(ellPts(x, y, 26 + hash(k + 1) * 30, 14 + hash(k + 2) * 12, 8, 4, k), { wash: '#3A3F48', ink: INK, sw: .6 }); }
    // the press (bed on the plateau): idle, a creak shiver while the token is loaded, then the slams
    const PW = 520, PH = 1000, wob = t > SL.lift[0] && t < SLAM - .05 ? Math.sin(t * 40) * 3 * seg(t, SL.lift[0], SLAM) : 0;
    const PX = SL.px - PW / 2 + wob, PY = SL.B[1] + 10 - PH, bedY = PY + PH - PH * .12;
    press(PX, PY, PW, PH, t, t < SLAM - .2 ? [999] : INH, { seed: 3, token: false });
    // the speaker stack the drums come out of; a ring leaves it .3 s before each knock beat and hits Clawd ON the beat
    {
      const pump = kick(t, KN, .12);
      inkLine([[SPK[0] - 60, -1400], [SPK[0] - 60, SPK[1] - 120]], .8, INK, 'inkfine', 0); inkLine([[SPK[0] + 60, -1400], [SPK[0] + 60, SPK[1] - 120]], .8, INK, 'inkfine', 0);
      push(); translate(SPK[0], SPK[1]); rotate(-.5); scale(1 + .08 * pump);
      paint(rectPts(-95, -125, 190, 250, 2), { wash: '#2B2F36', fill: '#1A1C21', fillOp: 90, ink: INK, sw: 1.4 });
      for (const [cy, cr] of [[-62, 34], [40, 62]]) { paint(ellPts(0, cy, cr, cr, 20), { wash: '#4A4F58', ink: INK, sw: 1 }); paint(ellPts(0, cy, cr * .38 * (1 + .3 * pump), cr * .38 * (1 + .3 * pump), 14), { wash: TK.yellow, ink: INK, sw: .8 }); }
      pop();
      for (const d of KN) { const e = t - (d - .3); if (e < 0 || e > .55) continue;
        const [cx, cy] = slopeAt(d - .01), dist = Math.hypot(cx - 60 - SPK[0], cy - 80 - SPK[1]), R0 = dist * e / .3, fade = 1 - seg(e, .3, .55);
        for (const [dr, sw, col] of [[0, 9, TK.yellow], [-38, 4, TK.yellowLt], [-70, 2, '#FFE2A8']]) if (R0 + dr > 10) inkLine(ellPts(SPK[0], SPK[1], R0 + dr, R0 + dr, 48), sw * (.4 + .6 * fade), col, 'ink', 0);
      }
    }
    // the token: rolled up the slope, along the plateau, lifted onto the bed, flattened by the slam
    const [gx0, gy0, s] = slopeAt(t), lift = eased(t, SL.lift[0], SL.lift[1]), sq = t >= SLAM ? .2 : 1;
    const ov = 1 - eased(t, SL.top - .15, SL.top + .25);
    const bx = gx0 + SLN[0] * SL.r * ov, by = lerp(lerp(gy0, bedY, lift), gy0 + SLN[1] * SL.r + SL.r, ov);
    push(); translate(bx, by); scale(1 + (1 - sq) * .5, sq); translate(0, -SL.r); rotate(t < SL.lift[0] ? s / SL.r : 0);
    token(0, 0, SL.r, { spin: .02, burn: t > SLAM + .6 ? seg(t, SLAM + .6, SLAM + 4) * .6 : 0 }); pop();
    // B: the heroic last push — an ember aura + speed streaks behind him from the last knock to the bed
    const hero = seg(t, 11.95, 12.05) * (1 - seg(t, SL.lift[0], SL.lift[1]));
    // Clawd right behind it, leaning in; after the lift he hops back under the press and stares up
    const pushing = t < SL.lift[1], back2 = eased(t, SL.lift[1], SL.lift[1] + .18);
    const cu = lerp(12, 17, 1 - ov), [fx, fy] = [lerp(bx - SL.r - 80 - 5 * (cu - 12) - 140 * back2, gx0 - SLD[0] * (SL.r + 80), ov), lerp(SL.B[1], gy0 - SLD[1] * (SL.r + 80), ov)];
    if (hero > 0) { glowAt(fx, fy - 60, 260, TK.ember, 70 * hero);
      for (let i = 0; i < 6; i++) { const q = frac(t * 3 + hash(i + 80)), o = (hash(i + 81) - .5) * 160; inkLine([[fx - SLD[0] * (60 + 260 * q) + SLN[0] * o, fy - 50 - SLD[1] * (60 + 260 * q) + SLN[1] * o], [fx - SLD[0] * (200 + 260 * q) + SLN[0] * o, fy - 50 - SLD[1] * (200 + 260 * q) + SLN[1] * o]], 3 * hero, TK.yellowLt, 'ink', 0); } }
    const ld = lastLE(KN, t), slip = ld != null && t - ld < .45, heave = kick(t, HV, .25), bump = kick(t, KN, .12) * (ld != null ? Math.min(1.6, kAmp(ld)) : 1);
    const walk = 1.6 * t + 1.4 * Math.max(0, Math.min(t, VOX[1]) - VOX[0]) + 3 * Math.max(0, t - 11.98) ;   // faster steps while the gang sings
    clawd(fx, fy, cu, { walk: pushing && !slip ? walk + .7 * heave : null, rot: lerp(pushing ? .2 + .12 * heave - .25 * bump : 0, .3, ov), sq: -.06 * heave + .22 * bump + (t > SLAM ? .08 * hit : 0),
      eyes: t > SLAM ? 'spark' : slip ? 'scared' : hero > .5 ? 'angry' : pushing ? 'narrow' : 'look', lookX: 1, lookY: t > SL.lift[1] ? -1 : 0,
      mouth: t > SLAM ? 'O' : heave > .3 || slip || hero > .5 ? 'O' : pushing ? 'flat' : 'smile', aL: pushing ? 1.3 : .3, aR: pushing ? 1.3 : .3, emote: pushing && t > 4 ? 'sweat' : null, noShadow: true });
    for (const d of KN) if (t >= d && t < d + .5) { const [cx, cy] = slopeAt(d); sparks(cx - 60, cy - 40, t - d, d * 5, Math.round(10 * Math.max(1, kAmp(d))), 200 * Math.max(.7, kAmp(d)));   // the impact burst where it hit him
      inkLine(ellPts(cx - 60, cy - 80, 90 + 500 * (t - d), 90 + 500 * (t - d), 32), 6 * (1 - (t - d) / .5), '#FFFDF6', 'ink', 0); }
    for (const h of INH) { sparks(SL.px, bedY - 20, t - h, h * 3, 16, 360); rubble(SL.px, SL.B[1] + 10, 560, t - h, h); }
    if (t >= SLAM) stamp('BURN THE TOKENS', 1380, 930, 78, t, SLAM, { col: TK.yellow, rot: -.04 });
    flash(Math.min(.3, kick(t, [SLAM], .2) * .3) + .12 * kick(t, KN, .06), TK.yellowLt);
  }
  dropCh('en_intro');
  chapter('en_v8_intro', N2O(IA), N2O(IB), [[N2O(IA), native(intro)]], { real: true });
  // the 3:4 camera follows the climb, a key per bar; C: tighter and lower (the slope towers over him); B: pushes in on the heroic last push
  const KT = [0, 1.48, 2.66, 3.94, 5.28, 6.6, 7.92, 9.24, 10.6, 11.92, 12.24, SL.top];
  const IK = KT.map((k, i) => { const [x, y] = slopeAt(k > 11 ? k : k + .5);
    return k > 11 ? [N2O(k), x - 20, y - 90, 700, 1] : [N2O(k), x - 150 + 130 * k / SL.top, y - 100, 760, i ? 1 : 0]; });
  if (window.RU34) RU34.push([N2O(IA), N2O(IB), [...IK, [N2O(SL.lift[1]), 1330, 400, 980, 1], [N2O(SLAM - .01), 1380, 330, 1080, 1], [N2O(IB) - .001, 1380, 350, 1050, 1]]],
    [N2O(IB), N2O(IB) + .001, [[N2O(IB), 960, 500, 860]]]);   // cut back to a02's office key (its 18.16 key fell inside the span above)
  dropPunch(N2O(IA), N2O(IB));
  EN_PUNCH.push([N2O(SLAM), 18], [N2O(DROP), 8], ...KN.map(d => [N2O(d), Math.round(14 * Math.max(.5, kAmp(d)))]), ...HV.map(h => [N2O(h), 4]), ...INH.slice(1).map(h => [N2O(h), 9]));

  // ======== 2+3. real 30.42–38.34: one take at the desk, Sunday night ========
  // v11 (user: «let the CALENDAR burn, just fix the effect»). «Every last token has to»: on each word a token hops off the stack into the
  // laptop, the wall clock ticks to midnight; «die»: 12:00, the SUNDAY wall calendar catches fire — flat layered cartoon flames on the
  // page's burning edge (pulsing on the beats), embers up, charred flakes crumbling down into an ash heap on the desk. «Don't need an
  // app»: an app tile pops out of the screen, Clawd swats it into the fire on «app»; «don't need a bot»: a bot pops up from behind the
  // desk, flicked into the fire on «bot» (each feeds a flare). «Still got tokens»: a fat sack bursts up on «tokens»; «so»: a coin hopper
  // springs out of the laptop lid; «why the hell»: a big shrug, brows up; the 37.1 downbeat he heaves the sack over the laptop, on «not?»
  // it's upended — a cascade of tokens pours into the hopper, the laptop rattles and lights up like a slot machine, the reels stop on the
  // beats (three tokens), the camera pushes into the screen → the arcade cabinet at 38.34.
  const DA = rw('every', 30.42), DB = 38.34;
  const W8 = { every: DA, last: rw('last', 30.68), token: rw('token', 31.04), has: rw('has', 31.68), to: rw('to', 32.02), die: rw('die.', 32.20),
    app: rw('app,', 33.60), bot: rw('bot.', 34.84), still: rw('still', 35.30), tokens: 35.805, so: rw('so', 36.50), why: rw('why', 36.66), not: rw('not?', 37.34) };
  const THROWS = [W8.every, W8.last, W8.token, W8.has, W8.to].map(w => w - .12), FLY = .36;
  const STACK = [665, 840], SCR = [1200, 700], CX = 905, DY = 840, LX = 1200;
  const CAL = { x: 1040, y: 350, w: 290, h: 252 }, CHH = CAL.h * .2, CPY = CAL.y + CHH, CPH = CAL.h - CHH;
  const IG = W8.die, BURN = [IG, IG + 2.9];                                  // the page is eaten bottom-up by 35.1
  const APP_IN = W8.app + .4, BOT_IN = W8.bot + .36, FEED = [APP_IN, BOT_IN];
  const SWING = [RDB.find(d => d > W8.not - .4), W8.not];                    // the 37.1 downbeat → «not?»
  const HOP = [LX, 540], MOUTH8 = [LX, 528];                                 // the hopper's mouth on the laptop lid; the upended sack's mouth
  const POUR = []; for (let q = W8.not; q < DB - .05; q += .035) POUR.push(q);
  const REEL = RBT.filter(b => b > W8.not + .05 && b < DB - .1).slice(0, 3);  // the reels stop one per beat
  const arcPt = (p, q, h, u) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u) - Math.sin(u * Math.PI) * h];
  const landed = s => THROWS.filter(w => s >= w + FLY).length;
  const burnB = s => ease(seg(s, BURN[0], BURN[1]));
  const edgeY = s => CPY + CPH * (1 - burnB(s));
  const fireK = s => s < IG ? 0 : Math.min(1, backOut(seg(s, IG, IG + .22))) * (1 - ease(seg(s, BURN[1], BURN[1] + .5))) + 1.1 * kick(s, FEED, .25) * (s < BURN[1] + .3);
  const wav = (x, s, i) => Math.sin(x * .061 + s * 3.1 + i) * 6 + Math.sin(x * .17 - s * 4.3) * 3;
  // one flat flame tongue: a teardrop with a swaying tip
  const tongue = (cx, y, w, h, sway) => [[cx - w / 2, y + 10], [cx - w * .5, y - h * .22], [cx - w * .28 + sway * .35, y - h * .6], [cx + sway, y - h],
    [cx + w * .3 + sway * .35, y - h * .55], [cx + w * .5, y - h * .18], [cx + w / 2, y + 10]];
  function flames(x0, x1, y, hgt, s, pulse) {                              // a row of tongues, three flat layers drawn back to front
    const n = 6, tw = (x1 - x0) / (n - 1);
    const T8 = Array.from({ length: n }, (_, i) => {
      const ph = hash(i + 61) * TAU, f = .62 + .22 * Math.sin(s * (8 + 3 * hash(i + 3)) + ph) + .16 * Math.sin(s * 13.7 + ph * 2);
      return { cx: x0 + i * tw + Math.sin(s * 2.3 + ph) * 6, h: hgt * f * (.6 + .4 * Math.sin((i + .5) / n * Math.PI)) * (1 + .4 * pulse), sw: Math.sin(s * 5.1 + ph) * tw * .35 };
    });
    for (const [k, col, ink] of [[1, '#E0442A', INK], [.68, '#FF8A1E', null], [.38, '#FFE07A', null]])
      for (const f of T8) paint(tongue(f.cx, y, tw * 1.35 * (.55 + .45 * k), f.h * k, f.sw * k), { wash: col, ink, sw: .8, curv: .4 });
  }
  function calendar8(s) {
    const { x, y, w, h } = CAL, yb = edgeY(s), b = burnB(s), k = fireK(s), pulse = kick(s, RBT, .12);
    paint(rectPts(x + 10, y + 12, w, Math.max(CHH, yb - y)), { wash: INK, washOp: 70, ink: null });                              // shadow (burns away with the page)
    if (yb > CPY + 3) {                                                                                                           // what's left of the page
      const edge = []; for (let i = 0; i <= 12; i++) { const ex = x + i * w / 12; edge.push([ex, yb + (s > IG ? wav(ex, s, 0) : 0)]); }
      paint([[x, CPY], [x + w, CPY], ...edge.slice().reverse()], { wash: mixCol(PAL.cream, '#E9B07A', .5 * k), ink: INK, sw: 1.1 });
      if (yb > CPY + CPH * .72) letter('27', x + w / 2, CPY + CPH * .4, CPH * .5, TK.ember, { font: ruFont(CPH * .5), ink: false });
      if (yb > CPY + CPH * .95) letter('SUNDAY', x + w / 2, CPY + CPH * .82, 34, TK.ember, { font: ruFont(34), ink: false });
      flushLetters();                                                                                                             // flames go over the lettering
      if (s > IG) {                                                                                                               // the charred, glowing edge
        const up = edge.map(([ex, ey]) => [ex, ey - 16 - 6 * Math.sin(ex * .3)]);
        paint([...up, ...edge.slice().reverse()], { wash: '#3A2A22', ink: null });
        inkLine(edge, 4, '#FF9A2A', 'ink', 0);
      }
    }
    paint(rectPts(x - 6, y, w + 12, CHH, 1), { wash: mixCol(TK.ember, '#3A2A22', .6 * b), ink: INK, sw: 1.2 });                // the header stays, scorched
    letter('SEPTEMBER', x + w / 2, y + CHH * .58, 34, PAL.cream, { font: ruFont(34), ink: false });
    for (let i = 0; i < 4; i++) paint(ellPts(x + w * (.2 + i * .2), y + 3, 7, 11, 8), { wash: A2.steelLt, ink: INK, sw: .5 });
    flushLetters();
    if (k > .02) {
      const fy = Math.max(yb, CPY + 4);
      paint(ellPts(x + w / 2, fy - 60, 260, 200, 20), { wash: '#FFB060', washOp: 38 * Math.min(1, k), ink: null });                // flat warm light on the wall
      flames(x - 4, x + w + 4, fy, 175 * Math.min(1.4, k), s, pulse);
      for (let i = 0; i < 16; i++) {                                                                                              // embers rising
        const q = frac(s * (.7 + .4 * hash(i + 7)) + hash(i)), ex = x + hash(i + 11) * w + Math.sin(s * 3 + i * 1.7) * 26 * q, ey = fy - 60 - q * 420, r = 6 * (1 - q) + 2;
        paint([[ex, ey - r], [ex + r, ey], [ex, ey + r], [ex - r, ey]], { wash: q < .5 ? TK.yellowLt : TK.orange, washOp: 255 * (1 - q) * Math.min(1, k), ink: null });
      }
    }
    if (s > IG) for (let i = 0; i < 14; i++) {                                                                                    // charred flakes crumble off and fall to the desk
      const born = IG + .1 + i * (BURN[1] - IG) / 14, q = seg(s, born, born + 1.1); if (q <= 0 || q >= 1) continue;
      const fx = lerp(x + 20 + hash(i + 31) * (w - 40), 1010, q * q) + Math.sin(q * 6 + i) * 22, fyy = lerp(edgeY(born) + 6, DY - 8, q * q), r = 10 + 6 * hash(i + 5);
      push(); translate(fx, fyy); rotate(q * 5 * (hash(i) - .5) * 2);
      paint([[-r, -r * .4], [r * .7, -r * .6], [r, r * .3], [-r * .5, r * .6]], { wash: i % 3 ? '#2A2422' : '#4A403C', ink: null }); pop();
    }
  }
  function laptop8(x, y, s0, sc, o = {}) {                                 // open laptop facing us; screen pulses as tokens go in; o.slot → a slot machine
    const rat = o.slot ? Math.sin(sc * 70) * 4 * o.slot : 0;
    push(); translate(x + rat, y); scale(s0); rotate(rat * .004);
    paint([[-120, 0], [120, 0], [104, -16], [-104, -16]], { wash: A2.steelLt, ink: INK, sw: .9 });
    paint(rectPts(-104, -176, 208, 160, 3), { wash: '#3A4450', ink: INK, sw: 1 });
    const g = Math.min(1, o.glow || 0);
    if (!o.slot) {
      paint(rectPts(-92, -164, 184, 136), { wash: mixCol('#1A2436', '#9AD8FF', .6 * g), ink: null });
      for (let k = 0; k < 4; k++) paint(rectPts(-76, -150 + k * 18, 70 + 50 * hash(k), 7), { wash: '#4A6A9A', washOp: 200 * (1 - g), ink: null });
    } else {                                                                     // three reels: spinning strips → stop one per beat on a token
      paint(rectPts(-92, -164, 184, 136), { wash: '#2A0E3A', ink: null });
      for (let r = 0; r < 3; r++) {
        const rx = -62 + r * 62, stop = REEL[r] ?? 1e9, spin = sc < stop, off = spin ? frac(sc * 9 + r * .37) : 0;
        paint(rectPts(rx - 26, -150, 52, 108, 3), { wash: PAL.cream, ink: INK, sw: .6 });
        for (let j = -1; j <= 1; j++) {
          const sy = -96 + (j + off) * 46; if (sy < -140 || sy > -52) continue;
          const sym = spin ? (j + Math.floor(sc * 9 + r)) & 3 : 0;
          if (sym === 0 || sym === 2) token(rx, sy, 17, { spin: .02 });
          else if (sym === 1) { paint(ellPts(rx - 8, sy + 5, 9, 9, 10), { wash: TK.ember, ink: INK, sw: .4 }); paint(ellPts(rx + 8, sy + 5, 9, 9, 10), { wash: TK.ember, ink: INK, sw: .4 }); inkLine([[rx - 6, sy - 3], [rx + 2, sy - 16], [rx + 8, sy - 3]], 2, '#2E7A3A', 'inkfine', 0); }
          else paint(rectPts(rx - 18, sy - 7, 36, 14, 2), { wash: '#3A2A6A', ink: INK, sw: .4 });
        }
        if (!spin) paint(rectPts(rx - 26, -150, 52, 108, 3), { wash: TK.yellowLt, washOp: 90 * kick(sc, [stop], .2), ink: null });
      }
      for (let k = 0; k < 14; k++) {                                             // marquee bulbs around the screen, chasing
        const u = k / 14, [bx, by] = u < .5 ? [-100 + u * 2 * 200, -172] : [100 - (u - .5) * 2 * 200, -8];
        paint(ellPts(bx, by, 6, 6, 8), { wash: (k + Math.floor(sc * 12)) % 2 ? TK.yellowLt : '#7A5A2A', ink: INK, sw: .4 });
      }
    }
    if (o.hop > .01) {                                                           // the coin hopper sprung out of the lid
      push(); translate(0, -176); scale(1, o.hop);
      paint([[-22, 0], [22, 0], [62, -64], [-62, -64]], { wash: A2.steelLt, fill: A2.steel, fillOp: 60, ink: INK, sw: 1 });
      paint(ellPts(0, -64, 62, 12, 16), { wash: '#1A1718', ink: INK, sw: .8 });
      paint(rectPts(-30, -34, 60, 8, 3), { wash: o.slot ? TK.yellow : '#1A1718', ink: null });
      pop();
    }
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
    // the wall clock: 11:56 → midnight on «die»
    const CK = [1205, 190], min = s >= W8.die ? 60 : 56 + .7 * landed(s);
    paint(ellPts(CK[0], CK[1], 88, 88, 24), { wash: PAL.cream, fill: '#E9DCC4', fillOp: 70, ink: INK, sw: 1.6 });
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; inkLine([[CK[0] + Math.cos(a) * 70, CK[1] + Math.sin(a) * 70], [CK[0] + Math.cos(a) * 80, CK[1] + Math.sin(a) * 80]], 2, INK, 'inkfine', 0); }
    const hand = (a, l, w, c) => inkLine([[CK[0], CK[1]], [CK[0] + Math.sin(a) * l, CK[1] - Math.cos(a) * l]], w, c, 'ink', 0);
    hand((11 + min / 60) / 12 * TAU, 44, 5, INK); hand(min / 60 * TAU, 66, 3.4, INK); hand(s * TAU / 2, 70, 1.2, TK.ember);
    calendar8(s);
    // the bot pops up from behind the desk left of Clawd, flicked up into the fire on «bot»
    const bk = seg(s, W8.bot, BOT_IN);
    if (s > W8.bot - .8 && bk < 1) {
      const up = easeOut(seg(s, W8.bot - .8, W8.bot - .5)), [x, y] = bk > 0 ? arcPt([650, 760], [CAL.x + CAL.w / 2, edgeY(s) + 10], 120, easeOut(bk)) : [650, lerp(1000, 760, up)];
      agentBot(x, y, 11 * (1 - .75 * bk * bk), s, { n: 7, rot: NOTXT + bk * 7, eyes: bk > 0 ? 'x' : 'happy', mouth: bk > 0 ? 'O' : 'smile', aL: 1.4, aR: 1.4, noShadow: true });
    }
    // Clawd behind the desk
    const swA = seg(s, W8.app - .15, W8.app + .25), fl = seg(s, W8.bot - .12, W8.bot + .22), thr = kick(s, THROWS, .18);
    const shrug = eased(s, W8.why - .1, W8.why + .12) * (1 - eased(s, SWING[0] - .05, SWING[0] + .05)), heaveS = seg(s, SWING[0] - .05, SWING[1] + .1), win = s >= W8.not;
    const pre = s < W8.die + .1, gaze = s >= W8.still && s < W8.so ? -1 : 1;
    clawd(CX, 882, 30, {
      rot: .2 * Math.sin(swA * Math.PI) - .18 * Math.sin(fl * Math.PI) + .06 * shrug * Math.sin(s * 9) + .04 * Math.sin(s * 7) * (win ? 1 : 0), noShadow: true,
      sq: -.1 * shrug, dy: -1.4 * shrug, eyes: win ? 'spark' : s > W8.tokens && s < W8.so ? 'spark' : shrug > .3 ? 'look' : pre || s < W8.bot + .3 ? 'narrow' : 'look', lookX: gaze, lookY: shrug > .3 ? -.4 : 0,
      mouth: win ? 'grin' : shrug > .3 ? 'wobble' : s > W8.die && s < W8.die + .6 ? 'O' : 'flat', flip: gaze < 0,
      aL: win || heaveS > 0 ? 1.9 : .3 + 1.2 * thr + 1.6 * Math.sin(fl * Math.PI) + 1.5 * shrug, aR: win || heaveS > 0 ? 1.9 : .3 + 1.6 * Math.sin(swA * Math.PI) + 1.5 * shrug,
      draw: shrug > .05 ? (u, sw) => { const r = .7 * u * shrug; for (const ex of [-3, 2]) inkLine([[ex * u - .4 * u, -7.4 * u - r], [ex * u + .5 * u, -7.9 * u - r], [ex * u + 1.4 * u, -7.4 * u - r]], sw * 1.1, PAL.ink, 'ink', .5); } : null,
    });
    // the desk (Clawd's legs behind it), the ash heap, the laptop on it
    paint(rectPts(-200, DY, W + 400, 900), { wash: '#6E5A4A', fill: A2.gunmetal, fillOp: 90, tex: .6, ink: INK, sw: 1 });
    inkLine([[-200, DY + 22], [W + 200, DY + 22]], .6, A2.gunDk, 'inkfine', 0);
    const ash = seg(s, IG + .6, BURN[1] + .8);
    if (ash > 0) paint([[1010 - 90 * ash, DY + 2], [1010 - 30 * ash, DY - 26 * ash], [1010 + 25 * ash, DY - 30 * ash], [1010 + 90 * ash, DY + 2]], { wash: '#4A4442', ink: INK, sw: .6, curv: .4 });
    const slot = s >= W8.not ? 1 : 0, hop = backOut(seg(s, W8.so - .05, W8.so + .25));
    laptop8(LX, DY + 4, 1.25, s, { glow: kick(s, THROWS.map(w => w + FLY), .2), hop, slot });
    // the stack (shrinks as tokens hop off) — then the sack bursts up on «tokens», swings over the laptop on the downbeat, upended on «not?»
    const left = THROWS.length - THROWS.filter(w => s >= w).length;
    for (let i = 0; i < left; i++) { push(); translate(STACK[0], STACK[1] - 10 - i * 15); scale(1, .36); token(0, 0, 34, { spin: .02 }); pop(); }
    const sk = backOut(seg(s, W8.tokens - .2, W8.tokens + .15));
    if (sk > 0) {
      const sw8 = ease(seg(s, SWING[0], SWING[1])), [sx, sy] = arcPt([STACK[0], DY], [MOUTH8[0], MOUTH8[1] - 190 * .85], 260, sw8);
      push(); translate(sx, lerp(lerp(DY + 260, DY + 6, sk), sy, sw8)); scale(.85);
      sack(0, 0, s, lerp(.55 * eased(s, W8.so - .1, W8.so + .25), Math.PI + .1 * Math.sin(s * 30) * slot, sw8), sw8 > 0 ? 0 : seg(s, W8.tokens, W8.tokens + .7)); pop();
    }
    // flying tokens: the hops into the laptop, then the cascade out of the upended sack into the hopper
    for (const w of THROWS) { const u = seg(s, w, w + FLY); if (u > 0 && u < 1) { const [x, y] = arcPt([STACK[0], STACK[1] - 100], SCR, 330, easeOut(u)); token(x, y, 36 * (1 - .5 * u), { spin: s * 3 + w }); } }
    for (const w of POUR) { const u = seg(s, w, w + .2); if (u > 0 && u < 1) token(MOUTH8[0] + (hash(w * 31) - .5) * 70 * (1 - u), lerp(MOUTH8[1], HOP[1] + 6, u * u), 20, { spin: s * 4 + w * 7 }); }
    if (slot) for (let i = 0; i < 6; i++) { const q = frac(s * 2.2 + i / 6), dx = (i - 2.5) * 40; inkLine([[HOP[0] + dx * .8, HOP[1] - 30 - q * 60], [HOP[0] + dx * 1.1, HOP[1] - 46 - q * 80]], 3 * (1 - q), TK.yellowLt, 'ink', 0); }   // jackpot rays
    // the app tile: pops out of the screen, swatted into the fire on «app»
    const off1 = seg(s, W8.app, APP_IN);
    if (s > W8.app - .75 && off1 < 1) {
      const pk = backOut(seg(s, W8.app - .75, W8.app - .45)), p0 = [lerp(SCR[0], 1130, pk), lerp(SCR[1], 520, pk) + Math.sin(s * 3) * 8];
      const [x, y] = off1 > 0 ? arcPt([1130, 520], [CAL.x + CAL.w / 2, edgeY(s) - 10], 160, off1) : p0;
      push(); translate(x, y); rotate(off1 * 6 - .08); scale(Math.max(.01, .8 * Math.min(1, pk) * (1 - .7 * off1 * off1)));
      paint(rrPts(-95, -95, 190, 190, 44), { wash: TK.green, fill: TK.greenDk, fillOp: 60, ink: INK, sw: 1.4 });
      paint(rrPts(-38, -62, 76, 124, 14), { wash: PAL.cream, ink: INK, sw: .9 });
      paint(ellPts(0, 44, 9, 9, 10), { wash: TK.green, ink: null });
      paint(ellPts(78, -78, 30, 30, 16), { wash: '#E0302A', ink: INK, sw: .8 });
      pop();
      if (off1 > 0 && off1 < .5) for (let k = 0; k < 3; k++) inkLine([[1150 + k * 30, 470 + k * 40], [1230 + k * 40, 450 + k * 50]], 3 * (1 - 2 * off1), PAL.cream, 'ink', 0);
    }
    for (const f of FEED) if (s > f && s < f + .5) sparks(CAL.x + CAL.w / 2, edgeY(f) - 40, s - f, f * 7, 12, 220);   // the fire gulps it: an ember burst
    flash(.25 * Math.exp(-(s - IG) * 9) * (s > IG), '#FFB060');
    if (slot) flash(.25 * Math.exp(-(s - W8.not) * 8), TK.yellowLt);
  }
  dropCh('en_v1_swat');
  chapter('en_v8_desk', N2O(DA), N2O(DB), [[N2O(DA), native(desk8)]], { real: true });
  if (window.RU34) RU34.push([N2O(DA), N2O(DB), [[N2O(DA), 960, 500, 900], [N2O(W8.still), 960, 505, 880, 1], [N2O(REEL[1] ?? W8.not + .4), 1010, 530, 840, 1], [N2O(DB) - .001, 1200, 720, 400, 1]]]);
  dropPunch(N2O(DA), N2O(DB));
  EN_PUNCH.push(...THROWS.map(w => [N2O(w + FLY), 3]), [N2O(IG), 12], [N2O(W8.app), 7], [N2O(APP_IN), 5], [N2O(W8.bot), 8], [N2O(BOT_IN), 5], [N2O(W8.tokens), 10], [N2O(SWING[0]), 8], [N2O(W8.not), 12], ...REEL.map(r => [N2O(r), 6]));
})();
