// tokensEN/v8_e.js: G2 of PLAN_v8. A span is cut into segments at its sync points (the warp's chapter cues, the RETIME word anchors);
// each segment plays the shot that is on screen in its own time domain (EN scene → v1, RU v2 chapter → v2, v3-real chapter → v3) at
// rate old/new length (before a cut: up to 1x while the old shot has frames left), so every cue lands and the motion never stops or jumps (v13: the 0.9x + hold and 1.1x + jump rules read as
// stutters). Clamped to 0.4–2.5x (beyond that: a short hold / skip at the segment end).
// Spans are REAL seconds of track v2; loaded last.
(() => {
  const idx = (shots, x) => { let i = 0; while (i + 1 < shots.length && x >= shots[i + 1][0]) i++; return i; };
  const NATIVE = /^en_(v8|e23_loop|e31_bench|hold)/;                       // already drawn in real time
  // the CHAPTER under v1 time x, in its own time domain: { key, st(x) → own time, at(ts) → shot index, draw(ts, lock) }. draw picks the shot at
  // ts itself, but never one past `lock`: past the locked shot's end it plays that shot on (its own tail) instead of cutting early
  function shotAt(x) {
    let ch = CH.find(c => c.real && !c.hold && x >= c.start && x < c.end), dom, pre = () => {};
    if (ch) { if (NATIVE.test(ch.name)) return null; const v3 = !/^en_/.test(ch.name); dom = v3 ? [EN2V3, V32EN] : [y => y, y => y]; }
    else { const x2 = TIME_WARP(x); ch = CH.find(c => !c.real && x2 >= c.start && x2 < c.end); if (!ch) return null; dom = [TIME_WARP, y => y]; pre = () => { window.REAL_CH = false; }; }
    const at = ts => idx(ch.shots, dom[1](ts));
    return { key: ch.name, st: dom[0], at, startOf: i => dom[0](ch.shots[i][0]),
      draw: (ts, lock) => { const t = dom[1](ts), i = Math.min(at(ts), lock), [t0, fn] = ch.shots[i], end = i + 1 < ch.shots.length ? ch.shots[i + 1][0] : ch.end; pre(); fn(t, t - t0, end - t0); } };
  }
  // v14 (user: «the slow-motion fit reads as lag»): no rate below LO, no holds. A segment starts where the previous one ended (never a
  // jump back), aims at its cue and plays at clamp(rate, LO, HI): a too-short old take lands its cue a little late and the next segments
  // catch up; a segment never cuts to an old shot past the one its cue sits in (it plays that shot's own tail on instead), and a
  // segment whose cue opens a new shot starts that shot on the cue.
  // HI 1.3 (coordinator: «2.2x reads as fast-forward»); old shots with no big moving character may still catch up at up to 2.2x
  const LO = .9, HI = 1.3, FASTOK = { 'capex:3': 1, 'capex:4': 1, 'sunday:6': 1 };   // the AGI billboard / CAPEX neon, the benchmark, the reset notification
  const LOCK = { '98.42': 2, '191.03': 4 };                                            // «One more million»: the factory plays on (the counter shot is empty in 3:4); the mayo tunnel spins in
  let prevSeg = null;
  function seg(ra, rb, last) {
    const a = N2O(ra), b = N2O(rb), name = 'en_hold_' + ra.toFixed(3), prev = prevSeg && Math.abs(prevSeg.rb - ra) < 1e-6 ? prevSeg : null; let S = null;
    const self = { rb, get: () => (S === null && init(), S) }; prevSeg = self;
    const init = () => {
      const sh = shotAt(a + 1e-4), nx = shotAt(b + 1e-4);                   // after the segment: same chapter → a cue inside it; another → a cut
      if (!sh) { S = 0; return; }
      const p = prev && prev.get(), cue = sh.st(a + 1e-4), cont = p && p.sh.key === sh.key && p.lock === sh.at(cue);
      const s0 = cont ? p.s0 + p.rate * p.D : cue, tgt = sh.st(b - 1e-4), D = rb - ra, r = (tgt - s0) / D, same = nx && nx.key === sh.key;
      let lock = sh.at(tgt); if (last) lock = sh.at(cue); else if (lock > sh.at(cue) && tgt - sh.startOf(lock) < .15) lock--;   // an old cut right at the cue belongs to the next segment; a span's last one stays in its shot
      S = { sh, rate: clamp(same ? r : Math.max(r, 1), LO, FASTOK[sh.key + ':' + sh.at(s0)] ? 2.2 : HI), s0, D, lock: LOCK[ra.toFixed(2)] ?? lock, r, same, nx: nx && nx.key, miss: s0 - cue };
    };
    (window.V8E_SEG ||= []).push({ ra, rb, get: self.get });
    chapter(name, a, b, [[a, t => {
      if (S === null) init();
      const dt = O2N(t) - ra, T0 = T;
      if (!S) { const c = CH.find(c => c.real && !c.hold && t >= c.start && t < c.end); if (c) { const i = idx(c.shots, t); c.shots[i][1](t, t - c.shots[i][0], 0); } return; }
      T = a + dt; window.RNOW = ra + dt; try { S.sh.draw(S.s0 + S.rate * dt, S.lock); } finally { T = T0; }
    }]], { real: true });
    CH.find(c => c.name === name).hold = true;
  }
  // sync points inside [ra, rb]: chapter cues (warp TAB), ≥ .3 s apart; in EN scenes also the word anchors
  const TABR = EN_TAB.map(([v]) => O2N(v)), WORDR = RETIME.map(([r]) => r);
  function span(ra, rb) {
    const en = (() => { const c = CH.find(c => c.real && !c.hold && N2O(ra + .05) >= c.start && N2O(ra + .05) < c.end); return c && /^en_/.test(c.name); })();
    const P = [ra, rb];
    const add = x => { if (P.every(y => Math.abs(y - x) >= .3)) P.push(x); };
    for (const x of TABR) if (x > ra && x < rb) add(x);
    if (en) for (const x of WORDR) if (x > ra && x < rb) add(x);
    P.sort((p, q) => p - q);
    for (let k = 0; k + 1 < P.length; k++) seg(P[k], P[k + 1], k + 2 === P.length);
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
  span(L(152.04), 175.12);           // rap: AGI by spring (from e23_loop's end: before it the native loop draws itself)
  span(178.16, L(160.10));            // «Writes your thesis»
  span(183.52, 185.84);               // «All I want from that god-tier brain»
  span(185.84, 188.32);               // «Is a calorie tracker»
  span(L(170.30), 195.80);            // the held «mayonnaise» tunnel
  span(195.81, 210.081);              // last chorus (a09) up to «Worth half a trillion more»
  // the deadpan outro (a10): each spoken line from its own start (the reset → close-up → «Fuck» run is a cut sequence, left on its cues)
  const OUT = [218.64, 223.90, 227.34, 233.48, 237.00, 239.56, 241.96, 244.10];
  for (let k = 0; k + 1 < OUT.length; k++) span(OUT[k], OUT[k + 1]);
  span(L(230.82), OUTCU);      // reset notification (starts on its own cut), up to the close-up
  // v10 outro, cut by hand on the beats: the shut-eyed close-up through «Fuck.» → the 1st beat after it the eyes snap open, red (once) →
  // the 2nd beat the madness: the room blast, the server hall, the b10 riot (the data center +2 beats) → the credit card, its gag written 1.8x
  (() => {
    const BT = EN_BEATS.map(O2N), F = 249.34, B1 = BT.find(b => b > F + .2), B2 = BT.find(b => b > B1 + .1);
    const sun = CH.find(c => c.name === 'sunday'), fin = CH.find(c => c.name === 'finale');
    const end = (c, i) => c.shots[i + 1] ? c.shots[i + 1][0] : c.end;
    const ru = (i, vt, Tc = 236) => dt => { const [t0, fn] = sun.shots[i], v = vt(dt); window.REAL_CH = false; T = Tc; fn(v, v - t0, end(sun, i) - t0); };
    const fv = i => dt => { const [t0, fn] = fin.shots[i], t = V32EN(EN2V3(t0) + dt); T = t; fn(t, t - t0, end(fin, i) - t0); };
    const G = 238.94, CR = .30;                                                // sCredit: the gag (strike + new name + nod) is over; v14: written at 0.3x (was 1.8x), it fills the card to the end
    const LIST = [[OUTCU, ru(7, dt => 224.2 + .25 * dt)], [B1, ru(7, dt => 225.0 + dt)], [B2, ru(8, dt => 227.28 + dt)]];
    let b = BT.indexOf(B2) + 5;                                                 // [beats on screen, shot]: the blast 5, the hall 5, riot 5/5, data center 5, the planet 5, 4 (v12: data center −1 beat, planet +1)
    for (const [n, fn] of [[5, ru(9, dt => 229.15 + dt)], [5, fv(0)], [5, fv(1)], [5, fv(2)], [5, fv(3)], [4, fv(4)],
      [0, ru(10, dt => Math.min(237.95 + CR * dt, G) + Math.max(0, dt - (G - 237.95) / CR), 244)]]) { LIST.push([BT[b], fn]); b += n; }
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
