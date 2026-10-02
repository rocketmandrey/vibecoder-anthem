// tokensEN/v8_e.js: G2 of PLAN_v8 — no stretch of the clip may play at a rate ≠ 1. Where the new track holds a moment longer than the old
// scene had (or the old warp crawled), the shot that is on screen at the start of the span keeps LIVING at 1x in its own time domain
// (EN scene → v1, RU v2 chapter → v2, v3-real chapter → v3) until the span ends on the next line / cut, where the normal mapping resumes.
// Spans are REAL seconds of track v2; loaded last.
(() => {
  const idx = (shots, x) => { let i = 0; while (i + 1 < shots.length && x >= shots[i + 1][0]) i++; return i; };
  // the shot under v1 time x0 → a drawer of that shot dt seconds later at 1x
  function under(x0) {
    let ch = CH.find(c => c.real && !c.hold && x0 >= c.start && x0 < c.end);
    if (ch) {
      const i = idx(ch.shots, x0), [t0, fn] = ch.shots[i], end = i + 1 < ch.shots.length ? ch.shots[i + 1][0] : ch.end;
      const v3 = !/^en_/.test(ch.name), r0 = v3 ? EN2V3(x0) : x0;           // v3-real chapters get EN2V3(t) inside their wrapper
      return dt => { const t = v3 ? V32EN(r0 + dt) : x0 + dt; fn(t, t - t0, end - t0); };
    }
    const x2 = TIME_WARP(x0); ch = CH.find(c => !c.real && x2 >= c.start && x2 < c.end); if (!ch) return null;
    const i = idx(ch.shots, x2), [t0, fn] = ch.shots[i], end = i + 1 < ch.shots.length ? ch.shots[i + 1][0] : ch.end;
    return dt => { const t2 = x2 + dt; window.REAL_CH = false; fn(t2, t2 - t0, end - t0); };
  }
  function hold(ra, rb) {
    const a = N2O(ra), b = N2O(rb); let draw;
    chapter('en_hold_' + ra, a, b, [[a, t => {
      const dt = O2N(t) - ra, T0 = T; draw = draw || under(a + 1e-4);
      T = a + dt; try { if (draw) draw(dt); } finally { T = T0; }
    }]], { real: true });
    CH.find(c => c.name === 'en_hold_' + ra).hold = true;
  }
  const L = v1 => O2N(v1);
  // chorus 1: the odometer's tail before «MORE AGENTS» (until the hiring cut, v1 55.64)
  hold(60.64, L(55.64));
  // verse 2: KPI slide before «You get the tokens»
  hold(73.02, 74.86);
  // chorus 2: the factory before the «MORE AGENTS» drone one-shot (v1 102.88)
  hold(102.88, L(102.88));
  // last chorus (a09): first «Burn», «'til the limit hits the floor» → «Revenue», «CapEx? Now!» → the benchmark cut
  hold(196.0, 196.34);
  hold(198.56, 201.60);
  hold(205.90, 207.26);
  // the deadpan outro (a10): every spoken line lives at 1x from its own start to the next line
  const OUT = [218.64, 223.90, 227.34, 233.48, 237.00, 239.56, 241.96, 244.10];   // (the reset → close-up → «Fuck» run is a cut sequence, left on its cues)
  for (let k = 0; k + 1 < OUT.length; k++) hold(OUT[k], OUT[k + 1]);
  // drawWorld takes the FIRST real chapter covering T (CH is sorted by start): the holds go in front of the scenes they sit inside
  const H = CH.filter(c => c.hold); for (const c of H) CH.splice(CH.indexOf(c), 1); CH.unshift(...H);
})();
