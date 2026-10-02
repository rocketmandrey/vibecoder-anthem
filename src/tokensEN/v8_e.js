// tokensEN/v8_e.js: G2 of PLAN_v8 — playback rate 0.9–1.1 everywhere. A span is cut into segments at its sync points (the warp's chapter
// cues, the RETIME word anchors, the real downbeats); each segment re-syncs exactly on its first frame, then plays the shot that is on screen
// at its own pace in its own time domain (EN scene → v1, RU v2 chapter → v2, v3-real chapter → v3):
//   old/new length within 0.9–1.1 → that rate (ends in sync);
//   old shorter (the new track holds the moment longer): 1x live continuation if the next sync point is a cut to another shot,
//     else 0.9x up to the next cue and a short hold before it (the cue never plays twice);
//   old longer: 1.1x and a jump forward on the next sync point (a cue / downbeat).
// Spans are REAL seconds of track v2; loaded last.
(() => {
  const idx = (shots, x) => { let i = 0; while (i + 1 < shots.length && x >= shots[i + 1][0]) i++; return i; };
  const NATIVE = /^en_(v8|e23_loop|e31_bench|hold)/;                       // already drawn in real time
  // the shot under v1 time x: { key, st(x) → its own time, draw(tShot) }
  function shotAt(x) {
    let ch = CH.find(c => c.real && !c.hold && x >= c.start && x < c.end);
    if (ch) {
      if (NATIVE.test(ch.name)) return null;
      const i = idx(ch.shots, x), [t0, fn] = ch.shots[i], end = i + 1 < ch.shots.length ? ch.shots[i + 1][0] : ch.end, v3 = !/^en_/.test(ch.name);
      return { key: ch.name + i, st: v3 ? EN2V3 : y => y, draw: ts => { const t = v3 ? V32EN(ts) : ts; fn(t, t - t0, end - t0); } };
    }
    const x2 = TIME_WARP(x); ch = CH.find(c => !c.real && x2 >= c.start && x2 < c.end); if (!ch) return null;
    const i = idx(ch.shots, x2), [t0, fn] = ch.shots[i], end = i + 1 < ch.shots.length ? ch.shots[i + 1][0] : ch.end;
    return { key: ch.name + i, st: TIME_WARP, draw: t2 => { window.REAL_CH = false; fn(t2, t2 - t0, end - t0); } };
  }
  function seg(ra, rb, cueEnd) {
    const a = N2O(ra), b = N2O(rb), name = 'en_hold_' + ra.toFixed(3); let S = null;
    chapter(name, a, b, [[a, t => {
      if (S === null) {
        const sh = shotAt(a + 1e-4), nx = shotAt(b + 1e-4);                   // after the segment: same shot → a cue inside it; another → a cut
        if (!sh) S = 0; else {
          const s0 = sh.st(a + 1e-4), dOld = sh.st(b - 1e-4) - s0, D = rb - ra, r = dOld / D, same = nx && nx.key === sh.key;
          const hold = r < .9 && same && cueEnd;                                // a chapter cue ahead in this very shot: 0.9x + a short anticipation hold
          S = { sh, rate: r >= .9 && r <= 1.1 ? r : r > 1.1 ? 1.1 : hold ? .9 : 1, s0, cap: hold ? dOld - 1e-3 : 1e9 };
        }
      }
      const dt = O2N(t) - ra, T0 = T;
      if (!S) { const c = CH.find(c => c.real && !c.hold && t >= c.start && t < c.end); if (c) { const i = idx(c.shots, t); c.shots[i][1](t, t - c.shots[i][0], 0); } return; }
      T = a + dt; try { S.sh.draw(S.s0 + Math.min(S.rate * dt, S.cap)); } finally { T = T0; }
    }]], { real: true });
    CH.find(c => c.name === name).hold = true;
  }
  // sync points inside [ra, rb]: chapter cues (warp TAB) + downbeats (the jumps land there), ≥ .3 s apart; in EN scenes also the word anchors
  const TABR = EN_TAB.map(([v]) => O2N(v)), WORDR = RETIME.map(([r]) => r), DB = EN_DOWNBEATS.map(O2N);
  function span(ra, rb, calm = false) {
    const en = (() => { const c = CH.find(c => c.real && !c.hold && N2O(ra + .05) >= c.start && N2O(ra + .05) < c.end); return c && /^en_/.test(c.name); })();
    const cue = new Set(TABR.filter(x => x > ra + .3 && x < rb - .3).map(x => +x.toFixed(4)));
    const P = [ra, rb];
    const add = (x, isCue) => { if (P.every(y => Math.abs(y - x) >= .3)) { P.push(x); if (isCue) cue.add(+x.toFixed(4)); } };
    for (const x of TABR) if (x > ra && x < rb) add(x, true);
    if (en) for (const x of WORDR) if (x > ra && x < rb) add(x, true);
    for (const d of DB) if (d > ra && d < rb) add(d, false);
    P.sort((p, q) => p - q);
    const rbCue = TABR.some(x => Math.abs(x - rb) < .05);
    for (let k = 0; k + 1 < P.length; k++) seg(P[k], P[k + 1], !calm && (k + 2 === P.length ? rbCue : cue.has(+P[k + 1].toFixed(4))));
  }
  const L = v1 => O2N(v1), OUTCU = 247.2;                                  // OUTCU: the a10 cut to the close-up
  span(22.40, 29.00);                 // verse 1 (a02 friday)
  span(38.34, 43.60);                 // arcade → website
  span(L(45.46), L(55.64));           // chorus 1 shredder take (incl. the odometer tail before «MORE AGENTS»)
  span(L(55.64), L(65.18));           // chorus 1 hiring hall + «Don't ask why»
  span(73.02, 80.30);                 // KPI slide (Brand-new KPI → Low spend)
  span(82.82, L(85.02));              // the agent tower
  span(L(85.02), 93.12);              // the report
  span(93.13, L(102.88));             // chorus 2 factory, up to the drone one-shot
  span(L(102.88), L(105.84));         // the drone one-shot
  span(L(105.84), 111.04);            // chorus 2 billboard, up to the fly-in (v8_c en_v8c_flyin: the factory lights die on the beats)
  span(172.62, 175.12);               // rap: AGI by spring
  span(178.16, L(160.10));            // «Writes your thesis»
  span(183.52, 185.84);               // «All I want from that god-tier brain»
  span(185.84, 188.32);               // «Is a calorie tracker»
  span(L(170.30), 195.80);            // the held «mayonnaise» tunnel
  span(195.81, 210.081);              // last chorus (a09) up to «Worth half a trillion more»
  // the deadpan outro (a10): each spoken line from its own start (the reset → close-up → «Fuck» run is a cut sequence, left on its cues)
  const OUT = [218.64, 223.90, 227.34, 233.48, 237.00, 239.56, 241.96, 244.10];
  for (let k = 0; k + 1 < OUT.length; k++) span(OUT[k], OUT[k + 1], true);   // calm: a still room lives on at 1x, no anticipation holds
  span(L(230.82), OUTCU, true);       // reset notification (starts on its own cut), up to the close-up
  // v10 outro, cut by hand on the beats: the shut-eyed close-up through «Fuck.» → the 1st beat after it the eyes snap open, red (once) →
  // the 2nd beat the madness: the room blast, the server hall, the b10 riot (the data center +2 beats) → the credit card, its gag written 1.8x
  (() => {
    const BT = EN_BEATS.map(O2N), F = 249.34, B1 = BT.find(b => b > F + .2), B2 = BT.find(b => b > B1 + .1);
    const sun = CH.find(c => c.name === 'sunday'), fin = CH.find(c => c.name === 'finale');
    const end = (c, i) => c.shots[i + 1] ? c.shots[i + 1][0] : c.end;
    const ru = (i, vt, Tc = 236) => dt => { const [t0, fn] = sun.shots[i], v = vt(dt); window.REAL_CH = false; T = Tc; fn(v, v - t0, end(sun, i) - t0); };
    const fv = i => dt => { const [t0, fn] = fin.shots[i], t = V32EN(EN2V3(t0) + dt); T = t; fn(t, t - t0, end(fin, i) - t0); };
    const G = 238.94;                                                           // sCredit: the gag (strike + new name + nod) is over
    const LIST = [[OUTCU, ru(7, dt => 224.2 + .25 * dt)], [B1, ru(7, dt => 225.0 + dt)], [B2, ru(8, dt => 227.2 + dt)]];
    let b = BT.indexOf(B2) + 5;                                                 // [beats on screen, shot]: the blast 5, the hall 5, riot 5/5, data center 6, 4, 4
    for (const [n, fn] of [[5, ru(9, dt => 229.15 + dt)], [5, fv(0)], [5, fv(1)], [6, fv(2)], [4, fv(3)], [4, fv(4)],
      [0, ru(10, dt => Math.min(237.95 + 1.8 * dt, G) + Math.max(0, dt - (G - 237.95) / 1.8), 244)]]) { LIST.push([BT[b], fn]); b += n; }
    const A = N2O(OUTCU), name = 'en_hold_v10out';
    chapter(name, A, N2O(EN_REAL_DUR) + 1, [[A, t => {
      const r = O2N(t); let k = 0; while (k + 1 < LIST.length && r >= LIST[k + 1][0]) k++;
      const T0 = T; try { LIST[k][1](r - LIST[k][0]); } finally { T = T0; }
    }]], { real: true });
    CH.find(c => c.name === name).hold = true;
  })();
  // drawWorld takes the FIRST real chapter covering T (CH is sorted by start): the holds go in front of the scenes they sit inside
  const H = CH.filter(c => c.hold); for (const c of H) CH.splice(CH.indexOf(c), 1); CH.unshift(...H);
})();
