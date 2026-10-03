// tokensEN/v8_d.js: round v8, native rebuild of «Every release: "guys, it's almost here."» (real 175.12–178.14).
// The keynote stage of a08 (same framing as the AGI-by-spring slide before it): the slide shows AGI: LOADING…, the bar crawls to 99%,
// the audience (fans seen from behind) goes wild — jumping on the beats, phones up (each screen shows the green bar), waving.
// On «almost» the finish flag slides away (release 5.0 → 6.0), on «here» again (→ 7.0): the fans deflate row by row, phones down, sighs.
// Drawn in REAL seconds (s = O2N(t)), cues from the new track's words.
(() => {
  const INK = PAL.ink;
  const { kick, native } = ENK;
  const rw = (w, v1near) => O2N(enWord(w, v1near));
  const A = 175.12, B = O2N(157.46);                                     // real: «Every» → e26_thesis (v1 157.46)
  const WD = { every: A, release: rw('release,', 154.72), guys: rw('"Guys,', 155.2), almost: rw('almost', 156.3), here: rw('here."', 156.7) };
  const BEATS = EN_BEATS.map(O2N).filter(b => b > A - .7 && b < B);
  const SLIP = [WD.almost, WD.here];
  const SX = 330, SY = 40, SW = 1260, SH = 600;                          // the slide
  const nSlip = s => SLIP.filter(v => s >= v).length;
  const stage = s => {
    paint(rectPts(-300, -300, W + 600, H + 1400), { wash: '#15171D', ink: null });
    for (const tx of [150, 1770]) paint(rectPts(tx - 14, -200, 28, 1100), { wash: '#23262E', ink: null });
    for (let i = 0; i < 9; i++) paint(ellPts(160 + i * 200, -60, 16, 10, 10), { wash: i % 2 ? '#FFE8B0' : '#BFD6FF', washOp: 200, ink: null });
    paint(ellPts(960, SY + SH / 2, SW * .62, SH * .75, 24), { fill: '#6C7FB0', fillOp: 55, bleed: .3, tex: .2, ink: null });
    paint(rectPts(SX - 16, SY - 16, SW + 32, SH + 32, 1), { wash: '#08090C', ink: '#3A3F4A', sw: 1.2 });
    paint(rectPts(SX, SY, SW, SH), { wash: '#F4F1EA', ink: null });
  };
  // the slide: title, the bar, the flag that keeps sliding away, release sticker, percentage
  function slide(s) {
    const x = SX, y = SY, w = SW, n = nSlip(s);
    letter('AGI: LOADING…', x + 50, y + 62, 50, '#1E1E24', { align: 'left', ink: false });
    paint(rectPts(x + 50, y + 100, 180, 8), { wash: A2.sodium, ink: null });
    const bx = x + 90, bw = w - 180, by = y + 270, bh = 130;               // v12: a fat bar that reads on a phone
    // finish line: at the bar end, then each slip slides it right out of the bar (the bar «grows»), fill falls back
    const slipK = SLIP.reduce((a, v) => a + backOut(clamp((s - v) / .35)), 0);
    const fill0 = ease(seg(s, A - .3, WD.release + .5)) * .99;               // 0.6 → 99% by «release»
    const fillN = lerp(.6, 1, fill0) / (1 + .45 * slipK) + .02 * Math.min(1, s - WD.almost > 0 ? (s - WD.almost) * .3 : 0);
    paint(rrPts(bx, by, bw, bh, 14), { wash: '#DAD4C8', ink: INK, sw: 1.2 });
    const fw = (bw - 12) * Math.min(.995, fillN);
    paint(rrPts(bx + 6, by + 6, fw, bh - 12, 10), { wash: '#3E8F4E', fill: '#2B6B38', fillOp: 70, tex: .5, ink: null });
    for (let k = 0; k < 14; k++) { const sx2 = bx + 20 + frac(k / 14 + s * .5) * (fw - 40); if (sx2 < bx + fw - 10) inkLine([[sx2, by + bh - 10], [sx2 + 22, by + 10]], 3, '#5FB36E', 'inkfine', 0); }
    // the flag stays at the bar end and hops on each slip; the fill shrinks back instead (the bar «grows»)
    const fx = bx + bw - 30;
    const hop = SLIP.reduce((a, v) => a + Math.max(0, Math.sin(clamp((s - v) / .3) * Math.PI)) * 40, 0);
    paint(rectPts(fx, by - 110 - hop, 6, 110), { wash: '#555', ink: null });
    paint([[fx + 6, by - 110 - hop], [fx + 70, by - 92 - hop], [fx + 6, by - 74 - hop]], { wash: '#D8262A', ink: INK, sw: .8 });
    letter('100%', fx + 10, by - 136 - hop, 28, '#D8262A', { ink: false });
    const pct = n === 0 ? Math.min(99, Math.round(fillN * 100)) + '%' : n === 1 ? '64%' : '41%';
    letter(pct, x + w / 2, y + 520, 120 * (1 + .25 * kick(s, SLIP, .2)), '#1E1E24', { ink: false });
    // release sticker: 5.0 → 6.0 → 7.0, slapped on over the old one
    const pk = backOut(clamp((s - (n ? SLIP[n - 1] : WD.release)) / .16));
    if (s >= WD.release) {
      push(); translate(x + w - 330, y + 150); rotate(.12 - .05 * n);
      paint(rrPts(-110 * pk, -34 * pk, 220 * pk, 68 * pk, 12), { wash: A2.hazard, ink: INK, sw: 1 });
      pop();
      letter('release ' + ['5.0', '6.0', '7.0'][n], x + w - 330, y + 150, 34 * pk, '#1E1E24', { rot: .12 - .05 * n, ink: false });
    }
    if (n > 1) letter('…please wait', x + w / 2, y + 550, 32, '#8A8A95', { pop: (s - SLIP[1]) * 5, ink: false });
  }
  // a fan from behind: blocky Clawd back, phone arm + waving arm; hy 0..1 hype, df 0..1 deflate
  const COLS = [PAL.clay, '#6F8BE0', '#7FB069', TK.yellow, '#C78BD6', '#E07A5F'];
  function fan(x, y, u, i, s, hy, df) {
    const col = mixCol(COLS[i % COLS.length], '#15171D', .4), dk = mixCol(col, '#000', .35);
    const ph = (s - A + .66 + hash(i) * .08) / .66, jump = hy * (1 - df) * Math.abs(Math.sin(ph * Math.PI)) * 3.2 * u;
    const lean = (1 - df) * .08 * Math.sin(s * 3 + i) + df * (hash(i + 2) - .5) * .25;
    push(); translate(x, y - jump + df * .9 * u); rotate(lean); scale(1 + .06 * df, 1 - .1 * df);
    for (const lx of [-3.6, 2.2]) paint(rectPts(lx * u, -2.4 * u, 1.4 * u, 2.4 * u), { wash: dk, ink: INK, sw: .8 });
    // phone arm (left): up high and glowing while hyped, sinks with the deflate
    const up = clamp(hy * 1.2 - df * 1.3), aP = lerp(-1.25, 1.35 + .1 * Math.sin(s * 5 + i), up);
    const sh = [-4.6 * u, -6 * u], hp = [sh[0] - Math.cos(aP) * 4.2 * u * .55, sh[1] - Math.sin(aP) * 4.2 * u];
    // waving arm (right)
    const aW = lerp(-1.2, 1.2 + .7 * Math.sin(s * 9 + i * 1.7), clamp(hy * 1.3 - df * 1.5)), sh2 = [4.6 * u, -6 * u];
    const hw = [sh2[0] + Math.cos(aW) * 4 * u * .5, sh2[1] - Math.sin(aW) * 4 * u];
    for (const [p0, p1] of [[sh, hp], [sh2, hw]]) { const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) || 1, nx = -(p1[1] - p0[1]) / L * .5 * u, ny = (p1[0] - p0[0]) / L * .5 * u;
      paint([[p0[0] + nx, p0[1] + ny], [p1[0] + nx, p1[1] + ny], [p1[0] - nx, p1[1] - ny], [p0[0] - nx, p0[1] - ny]], { wash: col, ink: INK, sw: .8 }); }
    paint(rrPts(-5 * u, -8.4 * u, 10 * u, 6.4 * u, .5 * u), { wash: col, fill: dk, fillOp: 60, tex: .4, ink: INK, sw: 1 });
    paint(rectPts(-4.6 * u, -3.6 * u, 9.2 * u, 1.4 * u), { wash: dk, washOp: 140, ink: null });
    // the phone: its screen faces the stage, so we see it from behind… a tiny copy of the green bar on the screen (the fans film the slide)
    push(); translate(hp[0], hp[1] - 1.6 * u); rotate(-.15 + .3 * (1 - up));
    paint(rrPts(-1.5 * u, -2.4 * u, 3 * u, 4.6 * u, .4 * u), { wash: '#1A1C22', ink: INK, sw: .7 });
    if (up > .3) {
      paint(rectPts(-1.2 * u, -2.1 * u, 2.4 * u, 4 * u), { wash: '#DDE8FF', washOp: 255 * up, ink: null });
      paint(rectPts(-1 * u, -.3 * u, 2 * u * clamp(.9 - .4 * nSlip(s)), .5 * u), { wash: '#3E8F4E', ink: null });
      glowAt(0, -.2 * u, 2.6 * u * up, '#9FBFFF', 45 * up);
    }
    pop();
    pop();
    // emotes over the head: sparks/hearts while hyped, a sigh puff when it slips
    const hz = hash(i + 11);
    if (hy * (1 - df) > .6 && hz > .55) emote(hz > .8 ? 'heart' : 'spark', x + (hz - .5) * 4 * u, y - 11 * u - jump - 18 * frac(s * 1.3 + hz), u * .8, clamp((hy - .6) * 3));
    if (df > .2 && hz < .5) { const a = frac((s - 177) * .9 + hz); paint(ellPts(x + 2 * u + a * 3 * u, y - 9 * u - a * 3 * u, (1 + a) * u, (.7 + a * .6) * u, 10), { wash: '#C8CCD6', washOp: 170 * (1 - a) * df, ink: null }); }
  }
  // rows back → front: [ground y, u, count, x0, x1, delay of the deflate]
  const ROWS = [[1480, 20, 6, 360, 1560, .2], [1770, 26, 5, 330, 1590, 0]];
  function release(t) {
    const s = O2N(t), n = nSlip(s);
    stage(s);
    slide(s);
    flushLetters();
    // stage floor + lip
    paint(rectPts(-300, 680, W + 600, 480), { wash: '#2A2630', fill: '#15131A', fillOp: 90, tex: .5, border: .3, ink: null });
    inkLine([[-300, 682], [W + 300, 682]], 1.4, '#5A5563', 'ink', 0);
    for (const sx of [560, 1360]) paint([[sx - 40, -100], [sx + 40, -100], [sx + 300, 1150], [sx - 300, 1150]], { fill: '#FFF3D0', fillOp: 22, bleed: .2, tex: .2, border: .1, ink: null });
    paint(rectPts(-300, 1150, W + 600, 30), { wash: '#3A3540', ink: INK, sw: 1 });
    paint(rectPts(-300, 1180, W + 600, 900), { wash: '#0E0F13', ink: null });
    // the CEO (right): clicker up on «Guys», calming hands; sweats on the slips
    const gk = kick(s, [WD.guys], .35), sk = kick(s, SLIP, .3);
    ceoClawd(1320, 1120, 30, { click: kick(s, [WD.release, ...SLIP], .2), aR: lerp(.9, 1.6, ease(seg(s, WD.guys - .1, WD.guys + .2))) + .2 * gk, aL: n ? .7 + .2 * Math.sin(s * 8) : lerp(.3, 1.3, ease(seg(s, WD.guys, WD.guys + .3))),
      eyes: n ? 'happy' : 'spark', mouth: n ? 'wobble' : 'grin', dy: -.3 * gk + .2 * sk, emote: n ? 'sweat' : null, emoteK: n ? clamp((s - SLIP[0]) * 3) : 0, noShadow: true });
    // Clawd (left), v15 (user: «what is he doing with the red card?» → a clear action): he has heard it every year — dozes standing, a sleep
    // bubble swelling and shrinking under his nose; each slip («almost» / «here») jolts him awake for a beat, then he nods off again
    const last = SLIP.filter(x => s >= x).slice(-1)[0], jolt = last == null ? 0 : Math.exp(-Math.max(0, s - last) * 2.2) * (s - last < 1.2 ? 1 : 0);
    const awake = jolt > .35, nod = (1 - jolt) * (.5 + .5 * Math.sin(s * 1.7));
    clawd(600, 1120, 26, { eyes: awake ? 'scared' : 'closed', mouth: awake ? 'o' : 'flat', aL: .2 + .9 * jolt, aR: .2 + .9 * jolt, dy: -.6 * jolt * Math.abs(Math.sin((s - (last || 0)) * 14)), rot: .08 * nod, noShadow: true });
    if (!awake) {
      const bub = .35 + .65 * (.5 + .5 * Math.sin(s * 3.1)), bx = 600 + 70, by = 1120 - 112;
      paint(ellPts(bx + 18 * bub, by, 22 * bub + 8, 20 * bub + 7, 18), { wash: '#DCEBFF', washOp: 170, ink: INK, sw: .7 });
      paint(ellPts(bx + 12 * bub, by - 7 * bub, 5 * bub + 2, 4 * bub + 2, 8), { wash: '#FFFFFF', ink: null });
    }
    // the audience
    const hy = ease(seg(s, A - .1, WD.release + .1));
    ROWS.forEach(([gy, u, cnt, x0, x1, dl], r) => {
      for (let i = 0; i < cnt; i++) {
        const k = r * 10 + i, d0 = SLIP[0] + dl * .5 + hash(k + 5) * .15;
        const df = .6 * ease(seg(s, d0, d0 + .35)) + .4 * ease(seg(s, SLIP[1] + dl * .5 + hash(k) * .2, SLIP[1] + .5 + dl));
        fan(lerp(x0, x1, cnt > 1 ? i / (cnt - 1) : .5) + (hash(k) - .5) * 40 + (r % 2 ? 30 : 0), gy + (hash(k + 3) - .5) * 20, u, k, s, hy, df);
      }
    });
  }
  const a = N2O(A), b = N2O(B);
  chapter('en_v8_release', a, b, [[a, native(release)]], { real: true });
  // camera: same framing as the a08 slide shot before it (cut on «Every»), one slow push toward the crowd and the stage
  if (window.RU34) RU34.push([a, b, [[a, 960, 830, 1440], [b - .001, 960, 860, 1360, 1]]]);
  EN_PUNCH.push(...SLIP.map(v => [N2O(v), 8]));
})();
