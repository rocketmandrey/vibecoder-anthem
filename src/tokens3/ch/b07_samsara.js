// b07_samsara.js: «Жги токены» v3, the chant «Больше GPU — больше токенов…», 149.58–160.048 in REAL v3 time. VERSION B of an A/B test:
// only registered when the page URL has `hamster` (render song tokens3h); without it the v2 a07 flywheel plays through the warp (version A).
// «КОЛЕСО САНСАРЫ»: Clawd runs in a giant hamster wheel; around it GPU feeds the loop ТОКЕНОВ → АГЕНТОВ → ЗАДАЧ → ТОКЕНОВ.
// Every sung noun lights exactly its plate (and only it) on its truth word onset; each «— больше Y» sends a coin stream from X,
// landing on Y's word. The wheel speeds up every line; on the last «токенов» the loop closes, the wheel drags Clawd round and
// spins into a blur, the camera whips into it → «ЭКОНОМИКА РАБОТАЕТ» (the v2 a07 economy shot, WARP anchor 160.048).
(() => {
  if (!/[?&]hamster\b/.test(location.search)) return;
  const INK = PAL.ink;
  // truth.json word onsets (checked against the vocal-stem onsets): the four line starts «Больше», the mid-line «больше», the nouns
  const S0 = 149.58, END = 160.048;
  const BOL = [149.58, 150.56, 151.88, 152.866, 154.12, 155.452, 156.74, 158.055];
  const NOUN = [[149.957, 'gpu'], [150.898, 'tok'], [152.192, 'tok'], [153.484, 'agt'], [154.793, 'agt'], [155.96, 'task'], [157.248, 'task'], [158.723, 'tok']];
  const FLOW = [[150.56, 150.898, 'gpu', 'tok'], [152.866, 153.484, 'tok', 'agt'], [155.452, 155.96, 'agt', 'task'], [158.055, 158.723, 'task', 'tok']];
  const LINES = [149.58, 151.88, 154.12, 156.74], CLOSE = 158.723, WHIP = 159.395;   // WHIP: the beat before the cut

  const WC = [960, 600], R = 255, RI = R - 24;                                        // the wheel
  const ST = {
    gpu:  { x: 300,  y: 235, ix: 300,  iy: 110, noun: 'GPU' },
    tok:  { x: 960,  y: 235, ix: 960,  iy: 112, noun: 'ТОКЕНОВ' },
    agt:  { x: 1580, y: 565, ix: 1580, iy: 418, noun: 'АГЕНТОВ' },
    task: { x: 340,  y: 565, ix: 340,  iy: 418, noun: 'ЗАДАЧ' }
  };
  // arrow paths (world): GPU feeds in along the top; the loop runs clockwise, АГЕНТЫ → ЗАДАЧИ under the wheel, clear of the karaoke bar
  const PATHS = {
    'gpu>tok': [[455, 108], [640, 92], [830, 108]],
    'tok>agt': [[1222, 250], [1440, 280], [1548, 372]],
    'agt>task': [[1560, 640], [1330, 890], [960, 928], [590, 890], [360, 640]],
    'task>tok': [[372, 372], [500, 318], [690, 318]]
  };
  const LOOP = ['tok>agt', 'agt>task', 'task>tok'];

  // ---------- helpers ----------
  function crSample(P, n = 14) {                                                     // Catmull-Rom through P → polyline
    const out = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || P[i + 1];
      for (let k = 0; k < n; k++) {
        const u = k / n, u2 = u * u, u3 = u2 * u;
        out.push([0, 1].map(j => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3)));
      }
    }
    out.push(P[P.length - 1]); return out;
  }
  const POLY = Object.fromEntries(Object.entries(PATHS).map(([k, P]) => {
    const pts = crSample(P), len = [0];
    for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return [k, { pts, len, L: len[len.length - 1] }];
  }));
  function along(key, u) {
    const { pts, len, L } = POLY[key], d = clamp(u) * L;
    let i = 1; while (i < len.length - 1 && len[i] < d) i++;
    const f = (d - len[i - 1]) / (len[i] - len[i - 1] || 1);
    return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)];
  }
  // the lit station = the last noun sung (none before «GPU»); its age drives the punch
  const lastNoun = t => { let r = null; for (const n of NOUN) if (t >= n[0]) r = n; return r; };
  const visits = (t, st) => NOUN.filter(n => n[1] === st && t >= n[0]).length;
  const lineIdx = t => { let i = -1; for (const l of LINES) if (t >= l) i++; return i; };

  // wheel speed (rad/s): a step up on every line start, then the runaway after the loop closes; angle = ∫ω (fixed 1/240 steps, pure in t)
  const OMEGA = [1.5, 2.6, 3.9, 5.4];
  function omega(t) {
    let w = OMEGA[0];
    LINES.forEach((l, i) => { if (i) w += (OMEGA[i] - OMEGA[i - 1]) * easeOut(seg(t, l, l + .35)); });
    return w + 26 * easeIn(seg(t, CLOSE, END));
  }
  const ANG = (() => { const dt = 1 / 240, a = [0]; for (let t = S0; t < END + .1; t += dt) a.push(a[a.length - 1] + omega(t) * dt); return a; })();
  const angle = t => { const x = Math.max(0, (t - S0) * 240), i = Math.min(ANG.length - 2, Math.floor(x)); return lerp(ANG[i], ANG[i + 1], x - i); };

  // ---------- the room ----------
  function room(t, heat) {
    paint(rectPts(-700, -500, W + 1400, 905 + 500), { wash: A2.gunmetal, fill: A2.gunDk, fillOp: 120, bleed: .1, tex: .6, border: .3, ink: null });
    sunburst(WC[0], WC[1], TK.emberDk, A2.gunDk, angle(t) * .04, 18, 2400, 30 + 35 * heat);
    glowAt(WC[0], WC[1], 620 + 120 * heat, TK.orange, 35 + 55 * heat);
    for (const bx of [-120, 2040]) {                                                // riveted girders at the edges
      paint(rectPts(bx - 30, -500, 60, 1405, 1), { wash: A2.gunDk, fill: A2.steel, fillOp: 60, tex: .6, ink: INK, sw: .8 });
      for (let y = -400; y < 905; y += 90) paint(ellPts(bx, y, 5, 5, 6), { wash: A2.steelLt, ink: null });
    }
    paint(rectPts(-700, 905, W + 1400, 700), { wash: '#15171B', fill: A2.gunmetal, fillOp: 60, tex: .6, ink: null });
    for (let i = -8; i <= 8; i++) inkLine([[960 + i * 150, 909], [960 + i * 280, 1300]], .5, A2.gunmetal, 'inkfine', 0);
    hazard(-700, 899, W + 1400, 16);
  }

  // ---------- the hamster wheel ----------
  function wheelBack(t, a, w) {
    const [cx, cy] = WC;
    for (const s of [-1, 1]) paint([[cx + s * 14, cy], [cx + s * 34, cy], [cx + s * 230, 902], [cx + s * 186, 902]], { wash: A2.gunDk, fill: A2.steel, fillOp: 80, tex: .6, ink: INK, sw: 1 });
    paint(rectPts(cx - 280, 884, 560, 22, 1), { wash: A2.steel, ink: INK, sw: 1 });
    paint(ellPts(cx, cy, R, R, 40), { wash: '#1A1D22', washOp: 170, ink: null });   // the dark inside of the drum
    const blur = clamp((w - 6) / 10);
    // spokes (fade into a translucent disc as it blurs)
    for (let k = 0; k < 6; k++) {
      const q = a + k * TAU / 6;
      inkLine([[cx + Math.cos(q) * 60, cy + Math.sin(q) * 60], [cx + Math.cos(q) * RI, cy + Math.sin(q) * RI]], 3.2 * (1 - blur) + .4, A2.steelLt, 'ink', 0);
    }
    if (blur > .02) paint(ellPts(cx, cy, RI, RI, 36), { wash: A2.steelLt, washOp: 70 * blur, ink: null });
    return blur;
  }
  function wheelRim(t, a, blur) {
    const [cx, cy] = WC;
    // the rungs between the two rims (drawn as the running surface), smeared into arcs when it blurs
    const n = 30;
    for (let k = 0; k < n; k++) {
      const q = a + k * TAU / n;
      if (blur < .6) inkLine([[cx + Math.cos(q) * RI, cy + Math.sin(q) * RI], [cx + Math.cos(q) * R, cy + Math.sin(q) * R]], 3.4, mixCol(A2.cream, A2.steelLt, .3), 'ink', 0);
    }
    if (blur > .2) for (let k = 0; k < 6; k++) {
      const q0 = a + k * TAU / 6, pts = [];
      for (let j = 0; j <= 8; j++) { const q = q0 - j * .09 * blur * 2; pts.push([cx + Math.cos(q) * (RI + 12), cy + Math.sin(q) * (RI + 12)]); }
      inkLine(pts, 6 * blur, A2.cream, 'marker', .5);
    }
    inkLine(ellPts(cx, cy, R, R, 48).concat([[cx + R, cy]]), 4.5, A2.steelLt, 'ink', .5);
    inkLine(ellPts(cx, cy, RI, RI, 48).concat([[cx + RI, cy]]), 3, A2.steel, 'ink', .5);
    // the hub plaque: «БОЛЬШЕ», nudged on every sung «Больше»
    const bk = hitK(t, BOL, .25), hr = 62 * (1 + .1 * bk);
    paint(ellPts(cx, cy, hr, hr, 24), { wash: A2.hazard, fill: TK.yellow, fillOp: 60, tex: .4, ink: INK, sw: 1.4 });
    for (let k = 0; k < 8; k++) { const q = a + k * TAU / 8; paint(ellPts(cx + Math.cos(q) * hr * .82, cy + Math.sin(q) * hr * .82, 4, 4, 6), { wash: A2.gunDk, ink: null }); }
    letter('БОЛЬШЕ', cx, cy + 2, 20 * (1 + .1 * bk), TK.soot, { font: ruFont(20 * (1 + .1 * bk)), ink: false });
  }

  // ---------- Clawd, running (then dragged round once the loop closes) ----------
  function runner(t, a, w) {
    const li = Math.max(0, lineIdx(t)), walk = a * RI / 95, s = Math.sin(walk * TAU);
    const drag = ease(seg(t, CLOSE + .2, CLOSE + .75));                            // 0 = running at the bottom, 1 = carried round
    const a0 = angle(CLOSE + .2), ca = Math.PI / 2 + drag * (a - a0) * .92;
    const [cx, cy] = WC, px = cx + Math.cos(ca) * RI, py = cy + Math.sin(ca) * RI, u = 12;
    const face = [
      { eyes: 'normal', mouth: 'o' }, { eyes: 'look', lookX: 1, mouth: 'O' }, { eyes: 'scared', lookX: 1, mouth: 'O' }, { eyes: 'swirl', mouth: 'wobble' }
    ][li];
    const lean = .06 + .05 * li;
    push(); translate(px, py); rotate(ca - Math.PI / 2);
    clawd(0, 0, u, {
      ...face, noShadow: true, walk, rot: drag > .5 ? .3 : lean, dy: -Math.abs(s) * (.4 + .25 * li) * (1 - drag),
      aL: drag > .5 ? 2.4 : .7 * s + .2, aR: drag > .5 ? 2.4 : -.7 * s + .2, hat: li >= 1 ? 'sweatband' : null,
      emote: li >= 1 && drag < .5 ? 'sweat' : null, emoteK: 1
    });
    // sweat drops flung back off his head, more every line (none before line 2)
    const nd = [0, 2, 4, 6][li] * (1 - drag);
    for (let i = 0; i < nd; i++) {
      const per = .5, ph = frac(t / per + hash(i * 3.3)), vx = -(160 + 80 * hash(i)) , vy = -(120 + 90 * hash(i + 5)), tt = ph * per;
      const dx = -2 * u + vx * tt, dy = -8 * u + vy * tt + 700 * tt * tt;
      paint(ellPts(dx, dy, 5, 7, 8, 0, .5), { wash: PAL.sky, fill: '#FFFFFF', fillOp: 60, ink: INK, sw: .4 });
    }
    pop();
  }

  // ---------- stations ----------
  const PLATE_N = 62, PLATE_B = 28;
  function icon(st, x, y, t, n, act) {
    if (st === 'gpu') {
      for (let i = 0; i < 1 + Math.min(2, n); i++) gpuCard(x - 10 + i * 12, y + 18 - i * 30, .5, t * (1 + omega(t)), { glow: i === Math.min(2, n) ? act : 0 });
    } else if (st === 'tok') {
      const rows = [4, 3, 2, 1], k = 4 + n * 3; let c = 0;
      rows.forEach((m, r) => { for (let j = 0; j < m && c < k; j++, c++) token(x + (j - (m - 1) / 2) * 40, y + 38 - r * 26, 19, {}); });
      if (act > .02) glowAt(x, y + 10, 110, TK.yellow, 70 * act);
    } else if (st === 'agt') {
      const k = 2 + Math.min(3, n);
      for (let i = 0; i < k; i++) agentBot(x + (i - (k - 1) / 2) * 58, y + 52, 4.6, t, { n: i + 1, dance: act > .05 ? 'hop' : 'bounce', seed: i, eyes: act > .05 ? 'happy' : 'normal', mouth: 'grin', noShadow: true });
    } else {
      const k = 3 + n * 2;
      for (let i = 0; i < k; i++) {
        const tx = x - 66 + (i % 4) * 44, ty = y + 40 - Math.floor(i / 4) * 30 - (i % 2) * 4, rot = (hash(i + 4) - .5) * .4;
        paint(rotPts(rectPts(tx - 30, ty - 18, 60, 38), tx, ty, rot), { wash: A2.cream, ink: INK, sw: .5 });
        paint(rotPts(rectPts(tx - 22, ty - 9, 9, 9), tx, ty, rot), { wash: i < n * 2 ? TK.green : '#FFFFFF', ink: INK, sw: .4 });
        inkLine(rotPts([[tx - 8, ty - 5], [tx + 22, ty - 5]], tx, ty, rot), .5, TK.ash, 'inkfine', 0);
        inkLine(rotPts([[tx - 22, ty + 8], [tx + 20, ty + 8]], tx, ty, rot), .5, TK.ash, 'inkfine', 0);
      }
    }
  }
  function station(st, t, lit, age) {
    const S = ST[st], n = visits(t, st), act = lit ? 1 : 0;
    const punch = lit ? 1 + .22 * Math.exp(-age * 9) * (age >= 0) : 1, sc = (lit ? 1.12 : 1) * punch;
    if (lit) glowAt(S.x, S.y - 60, 250 + 60 * Math.exp(-age * 5), A2.sodium, 60);
    icon(st, S.ix, S.iy, t, n, act);
    // the plate is sized from its own text, so the lettering always sits inside it
    const fN = PLATE_N * sc, fB = PLATE_B * sc;
    const tw = Math.max(textW(S.noun, ruFont(fN)), textW('БОЛЬШЕ', ruFont(fB))), pw = tw + 64 * sc, ph = 124 * sc;
    const wash = lit ? A2.hazard : n ? A2.steel : A2.gunDk, txt = lit ? TK.soot : n ? A2.cream : A2.steelLt, tag = lit ? TK.emberDk : n ? A2.hazard : A2.steel;
    paint(rrPts(S.x - pw / 2 + 6, S.y - ph / 2 + 8, pw, ph, 18 * sc), { wash: '#000', washOp: 90, ink: null });
    paint(rrPts(S.x - pw / 2, S.y - ph / 2, pw, ph, 18 * sc), { wash, fill: lit ? TK.yellow : A2.gunDk, fillOp: 60, tex: .5, ink: INK, sw: 1.3 });
    letter('БОЛЬШЕ', S.x, S.y - 33 * sc, fB, tag, { font: ruFont(fB), ink: false });
    letter(S.noun, S.x, S.y + 17 * sc, fN, txt, { font: ruFont(fN), ink: false });
    // one shock ring on the word (no flash)
    if (lit && age < .45) paint(ellPts(S.x, S.y, pw * .55 + age * 420, ph * .6 + age * 260, 30), { ink: A2.hazard, sw: 3 * (1 - age / .45) + .3 });
  }

  // ---------- arrows + coin streams ----------
  function arrow(key, t, state) {                                                   // state: 0 dim (not yet), .5 travelled, 1 hot
    const { pts } = POLY[key], col = state >= 1 ? A2.hazard : state > 0 ? A2.sodium : A2.steel;
    inkLine(pts, state >= 1 ? 5 : 3.2, col, 'ink', 0);
    const [ex, ey] = pts[pts.length - 1], [px, py] = pts[pts.length - 4], d = Math.hypot(ex - px, ey - py), ux = (ex - px) / d, uy = (ey - py) / d, s = state >= 1 ? 30 : 24;
    paint([[ex + ux * s, ey + uy * s], [ex - uy * s * .7, ey + ux * s * .7], [ex + uy * s * .7, ey - ux * s * .7]], { wash: col, ink: INK, sw: .7 });
  }
  function stream(key, t, t0, t1) {
    const dur = t1 - t0, n = 7;
    for (let i = 0; i < n; i++) {
      const u = (t - t0) / dur - i * .09; if (u < 0 || u >= 1) continue;
      const [x, y] = along(key, easeIn(u) * .35 + u * .65);
      token(x, y, 19 - i * 1.2, { rot: u * 6 + i });
    }
  }

  // ---------- the frame ----------
  function frame(t) {
    const a = angle(t), w = omega(t), li = Math.max(0, lineIdx(t)), heat = clamp(.2 + .25 * li + .4 * seg(t, CLOSE, END));
    const last = lastNoun(t), litSt = last ? last[1] : null, litAge = last ? t - last[0] : 9;
    // camera: a slow push-in, a gentle beat pulse, a small lean toward the lit plate; the whip = spin + zoom into the hub
    const wp = easeIn(seg(t, WHIP, END)), lean = litSt ? [(ST[litSt].x - 960) * .03, (ST[litSt].y - 540) * .02] : [0, 0];
    const z = (1 + .025 * seg(t, S0, CLOSE) + .012 * pulse(t, 6)) * (1 + 1.6 * wp);
    camBegin(lerp(960 + lean[0], WC[0], wp), lerp(540 + lean[1], WC[1], wp), z, .9 * wp);
    room(t, heat);
    // arrows: dim until their first stream sets off, hot while it flies; after the loop closes the whole loop stays hot
    const closed = t >= CLOSE;
    for (const key of Object.keys(PATHS)) {
      const f = FLOW.find(q => `${q[2]}>${q[3]}` === key), started = f && t >= f[0], flying = f && t >= f[0] && t < f[1] + .15;
      arrow(key, t, flying || (closed && LOOP.includes(key)) ? 1 : started ? .5 : 0);
    }
    if (closed) {                                                                   // a light chases round the closed loop, faster and faster
      const ph = (t - CLOSE) * (1.2 + 2.5 * (t - CLOSE));
      for (let i = 0; i < 3; i++) { const u = frac(ph - i * .06), k = Math.floor(u * 3), [x, y] = along(LOOP[k], frac(u * 3)); glowAt(x, y, 34 - i * 8, TK.yellowLt, 200 - i * 50); }
    }
    for (const f of FLOW) stream(`${f[2]}>${f[3]}`, t, f[0], f[1]);
    for (const st of Object.keys(ST)) station(st, t, st === litSt, litAge);
    const blur = wheelBack(t, a, w);
    runner(t, a, w);
    wheelRim(t, a, blur);
    // title
    const tf = ruFont(40), tw = textW('КОЛЕСО САНСАРЫ', tf);
    paint(rrPts(1600 - tw / 2 - 30, 145, tw + 60, 76, 12), { wash: A2.gunDk, washOp: 230, ink: A2.hazard, sw: 1 });
    letter('КОЛЕСО САНСАРЫ', 1600, 184, 40, A2.hazard, { font: tf, ink: false, rot: -.02 });
    camEnd();
    // the whip: radial speed streaks (screen space), steady, no flicker
    if (wp > .01) for (let i = 0; i < 26; i++) {
      const q = i / 26 * TAU + hash(i) * .2 + wp * 2, r0 = 260 + hash(i + 3) * 300, r1 = r0 + 900 * wp;
      inkLine([[960 + Math.cos(q) * r0, 540 + Math.sin(q) * r0], [960 + Math.cos(q) * r1, 540 + Math.sin(q) * r1]], 1.5 + 3 * wp, i % 2 ? A2.cream : A2.hazard, 'marker', 0);
    }
    flash(.28 * (1 - ease(seg(t, S0, S0 + .35))), TK.yellowLt);                     // the one soft flash: the chant's first line
  }

  // every sung word is a shot start (same frame fn): sync_check.mjs then checks each cue against the truth word onsets
  const CUES = [...new Set([...BOL, ...NOUN.map(n => n[0])])].sort((x, y) => x - y);
  chapter('samsara', S0, END, CUES.map(c => [c, frame]), { real: true });
})();
