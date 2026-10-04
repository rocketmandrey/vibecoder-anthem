// Three refinements of #4: the physical demonstration stays behind the CEO.
// All three share hero coordinates and framing for horizontal A/B/C comparison.
(() => {
window.CAPEX_V = window.CAPEX_V || {};
function conference(r, style) {
  const INK = PAL.ink, CREAM = PAL.cream;
  const sh = (p, c, sw = 1.2) => paint(p, { wash: c, fill: mixCol(c, TK.soot, .30), fillOp: 55, bleed: .035, tex: .6, border: .5, ink: INK, sw });
  const box = (x, y, w, h, c, sw) => sh(rectPts(x, y, w, h, 1.2), c, sw);
  const oval = (x, y, a, b, c, sw) => sh(ellPts(x, y, a, b, 18, .6), c, sw);
  const line = (p, w = 1, c = INK) => inkLine(p, w, c, 'ink', 0);
  const hit = (at, life = .12) => r < at ? 0 : Math.exp(-(r - at) / life);
  const later = hit(202.26), how = hit(203.20), soon = hit(204.92), now = hit(205.90);
  const crashed = r >= 205.90, broken = r >= 204.92, age = Math.max(0, r - 205.90);
  const reveal = easeOut(seg(r, 204.28, 204.65));
  // Source-audio word boundaries (assets/tokensEN/truth.json), in real song time.
  // The two foreground journalists alternate; the CEO speaks only the answers.
  const dialogue = [
    { s: 201.60, e: 202.18, who: 5, word: 'REVENUE?', sounds: ['flat', 'o', 'smile', 'O', 'o'] },
    { s: 202.26, e: 202.54, who: 'ceo', word: 'LATER!', sounds: ['O', 'smile', 'o', 'flat'] },
    { s: 202.60, e: 203.04, who: 8, word: 'PROFIT?', sounds: ['o', 'O', 'flat', 'o'] },
    { s: 203.20, e: 203.74, who: 'ceo', word: 'HOW?!', sounds: ['O', 'O', 'o'] },
    { s: 204.28, e: 204.84, who: 5, word: 'A-G-I?', sounds: ['O', 'smile', 'flat', 'O', 'smile'] },
    { s: 204.92, e: 205.18, who: 'ceo', word: 'SOON!', sounds: ['o', 'O', 'o', 'flat'] },
    { s: 205.24, e: 205.78, who: 8, word: 'CAPEX?', sounds: ['O', 'flat', 'smile', 'O', 'flat'] },
    { s: 205.90, e: 206.50, who: 'ceo', word: 'NOW!', sounds: ['flat', 'O', 'O', 'grin'] }
  ];
  const spoken = who => dialogue.find(d => d.who === who && r >= d.s && r < d.e);
  const mouthOf = (d, idle) => d ? d.sounds[Math.min(d.sounds.length - 1, Math.floor(seg(r, d.s, d.e) * d.sounds.length))] : idle;
  const askPose = who => Math.max(0, ...dialogue.filter(d => d.who === who).map(d =>
    easeOut(seg(r, d.s - .12, d.s)) * (1 - ease(seg(r, d.e, d.e + .10)))));
  const beats = EN_BEATS.map(O2N).filter(t => t > 201.3 && t < 207.4);
  const rebound = (t, at, life = .30) => t < at || t > at + life ? 0 : Math.sin(seg(t, at, at + life) * Math.PI);
  const bounce = t => Math.max(0, ...beats.map(b => rebound(t, b, .28)));
  const pocketsAt = t => easeOut(seg(t, 203.06, 203.20)) * (1 - ease(seg(t, 203.85, 204.15)));
  // Native 2.2u arms: pose by angles, props attach at their original tips.
  function pose(t) {
    const wind = ease(seg(t, 202.04, 202.26)), follow = easeOut(seg(t, 202.26, 202.42));
    const settle = ease(seg(t, 202.42, 202.88)), pocket = pocketsAt(t);
    const press = ease(seg(t, 205.24, 205.57)), down = easeIn(seg(t, 205.72, 205.90));
    const cheer = easeOut(seg(t, 205.90, 206.08));
    const reaction = mood(t, [[201.60, 'narrow'], [203.20, 'scared'], [204.20, 'narrow'], [205.90, 'spark']]);
    let aL = lerp(.30, 1.22, wind), aR = -.28;
    if (t >= 202.26) aL = lerp(1.22 + .30 * follow, -.25, settle);
    aL = lerp(aL, -.57, pocket); aR = lerp(aR, -.57, pocket);
    if (t >= 205.24) aR = lerp(lerp(-.28, .70, press), -.91, down);
    if (t >= 205.90) { aL = lerp(-.25, .70, cheer) + .06 * Math.sin((t - 205.90) * 10) * cheer; aR = lerp(-.91, .90, cheer); }
    const sq = .025 * bounce(t) + .045 * rebound(t, 203.20, .28) + .06 * rebound(t, 205.90, .24);
    const rot = -.014 * Math.sin((t - 201.60) * 5) + (t < 202.88 ? .025 * wind - .045 * follow : 0);
    return { aL, aR, sq, rot, y: 949 - 4 * bounce(t), ...reaction };
  }
  const heroX = 887, u = 40, body = pose(r), heroY = body.y;
  function hand(t, side, lift = 0) {
    const o = pose(t), a = side < 0 ? o.aL : o.aR, q = o.sq + o.take;
    const sx = 1 + q * .6, sy = 1 - q, c = Math.cos(o.rot), sn = Math.sin(o.rot);
    const x = side * (4.9 + 2.2 * Math.cos(a)) * u, y = (-4.5 - 2.2 * Math.sin(a)) * u;
    return [heroX + c * x * sx - sn * y * sy, o.y - lift + sn * x * sx + c * y * sy];
  }
  const button = hand(205.90, 1), release = hand(202.26, -1), releaseAngle = pose(202.26).rot;

  function mic(x, y, a = 0, s = 1) {
    push(); translate(x, y); rotate(a); scale(s);
    sh(rrPts(-8, -36, 16, 54, 5), '#535B63'); oval(0, -46, 19, 22, '#A4ABB0', .8);
    for (let i = -2; i <= 2; i++) line([[-12, -46 + i * 6], [12, -46 + i * 6]], .45); pop();
  }
  function spark(x, y, k, rad = 60) {
    if (k > .025) paint(starPts(x, y, rad * k, .35, 8), { wash: CREAM, ink: null });
  }
  function rack(x, floor, w, h, tilt = 0, seed = 0) {
    push(); translate(x, floor); rotate(tilt);
    if (h < 80) box(-w / 2, -h, w, h, TK.steel);
    else serverRack(-w / 2, -h, w, h, N2O(r), { seed, units: Math.max(2, Math.round(h / 90)), heat: .10 * now, fire: 0 });
    box(-w / 2 + 5, 0, 20, 12, TK.soot); box(w / 2 - 25, 0, 20, 12, TK.soot); pop();
  }
  function camera() {
    push(); scale(1.18);
    sh(rrPts(-16, -13, 32, 24, 3, .6), TK.steelLt, .8);
    box(-10, -18, 14, 6, '#C9D1CB', .5);
    box(-10, -7, 9, 8, '#E2DEC7', .4);
    oval(16, 0, 9, 10, TK.soot, .7); oval(18, 0, 5, 6, '#86AAB9', .5);
    pop();
  }
  function reporter(x, y, s, journalist, seed) {
    const flee = crashed ? easeOut(seg(age, .06, 1.35)) : 0;
    const question = spoken(seed), ask = journalist ? askPose(seed) : 0;
    const dir = seed === 5 ? 1 : -1;
    const forward = style === 'a' ? 38 : style === 'b' ? 19 : 25;
    const advance = journalist ? dir * forward * ask : 0;
    const xx = x + advance + (journalist ? (seed % 2 ? -1 : 1) * flee * 40 : 0);
    const yy = y - (journalist ? (style === 'a' ? 20 : style === 'b' ? 12 : 8) * ask : 0) + flee * 10;
    const aR = journalist ? lerp(-.65, .58, ask) : 1.92 + .025 * Math.sin(r * 5 + seed);
    const aL = journalist ? lerp(.15, style === 'c' ? .62 : 1.25 + .10 * Math.sin(r * 18), ask) : crashed ? .95 : .2;
    const dy = -.32 * bounce(r + seed * .017) - .28 * ask;
    const reaction = mood(r, [[201.60, 'narrow'], [205.90, 'scared']]);
    const lean = journalist ? (seed === 5 ? 1 : -1) * (style === 'b' ? .11 : .035) * ask : 0;
    push(); translate(xx, yy); scale(s);
    agentBot(0, 0, 8, N2O(r), { seed, dance: 'idle', dx: 0, dy,
      noShadow: false, ...reaction, flip: seed === 8 || seed === 11,
      eyes: question ? 'normal' : reaction.eyes,
      squint: question ? 0 : reaction.squint,
      sq: .03 * bounce(r + seed * .017) + .035 * ask,
      rot: lean + (crashed ? .06 * Math.sin(age * 11 + seed) : .012 * Math.sin(r * 5 + seed)),
      walk: crashed ? age * 3 : null,
      armL: journalist && (style === 'c' || style === 'b') ? uu => {
        if (style === 'b') {
          push(); rotate(aL); sh(rrPts(-16, -24, 33, 46, 3), '#D4CDB8', .7);
          box(-10, -27, 20, 7, '#7F8C89', .4);
          for (let i = 0; i < 3; i++) line([[-10, -12 + i * 9], [10, -12 + i * 9]], .45, '#79786D');
          pop(); return;
        }
        push(); rotate(aL);
        sh(rrPts(-20, -32, 43, 60, 5), '#6A7477', .7);
        box(-15, -25, 33, 42, '#C5D7CF', .5);
        for (let i = 0; i < 3; i++) line([[-10, -16 + i * 11], [12, -16 + i * 11]], .5, '#607B7B');
        oval(1, 23, 3, 3, CREAM, .4); pop();
      } : null,
      mouth: mouthOf(question, crashed ? 'o' : 'flat'), aL, aR,
      armR: uu => {
        push(); rotate(aR); if (journalist) mic(0, 0, -.55, .5); else camera(); pop();
      }
    }); pop();
    if (question) {
      // A single balloon points to the speaking reporter; the other reporter stays quiet.
      const by = yy - 242, bw = question.word === 'REVENUE?' ? 254 : 220, bh = 62;
      sh([[xx - 22, by + bh - 3], [xx + 17, by + bh - 3], [xx + 5, yy - 168]], CREAM, 1.2);
      sh(rrPts(xx - bw / 2, by, bw, bh, 12, .8), CREAM, 1.4);
      letter(question.word, xx, by + bh / 2, 30, INK, { ink: false, font: ruFont(30) });
      // Two small hand-drawn accents make the raised microphone readable at phone size.
      const dir = seed === 5 ? 1 : -1;
      line([[xx + dir * 144, yy - 160], [xx + dir * 163, yy - 174]], 1.0, CREAM);
      line([[xx + dir * 154, yy - 141], [xx + dir * 177, yy - 145]], 1.0, CREAM);
    }
  }
  function robot() {
    // Boots touch the stage; every detached part lands on that same plane.
    const dt = Math.max(0, r - 204.92), base = 0;
    push(); translate(927, 934); scale(.82);
    const parts = [[0, -608, 173, 116], [0, -416, 168, 230],
      [-123, -416, 53, 182], [123, -416, 53, 182], [-49, -133, 55, 264], [49, -133, 55, 264]];
    for (let i = 0; i < parts.length; i++) {
      const [px, py, w, h] = parts[i]; let dx = 0, dy = 0, tilt = 0;
      if (broken) {
        const sign = i % 2 ? 1 : -1;
        if (i === 0) {
          const startY = base + py, floorY = base - h / 2;
          const contact = (75 + Math.sqrt(75 * 75 + 4 * 850 * (floorY - startY))) / 1700;
          dx = 30 * easeOut(seg(dt, 0, .15)) + 220 * dt;
          dy = dt < contact ? -75 * dt + 850 * dt * dt : floorY - startY - 43 * Math.abs(Math.sin((dt - contact) * 11)) * Math.exp(-(dt - contact) * 3);
          tilt = dt * 2.5;
        } else if (i === 2 || i === 3) {
          dx = sign * (30 * easeOut(seg(dt, 0, .14)) + 53 * dt);
          dy = Math.min(-py - h / 2, -75 * dt + 680 * dt * dt); tilt = sign * dt * 1.9;
        } else {
          dx = sign * 12 * easeOut(seg(dt, 0, .2));
          dy = Math.min(-py - h / 2, 700 * dt * dt); tilt = sign * Math.min(1.35, dt * (i === 1 ? 1.45 : .65));
        }
      }
      if (broken) dy = Math.min(dy, -py - (Math.abs(w * Math.sin(tilt)) + Math.abs(h * Math.cos(tilt))) / 2);
      push(); translate(px + dx, base + py + dy); rotate(tilt);
      sh(rrPts(-w / 2, -h / 2, w, h, 7, 1.3), i === 1 ? TK.steel : TK.steelLt, 1.6);
      for (const side of [-1, 1]) oval(side * (w / 2 - 12), -h / 2 + 17, 3.5, 3.5, TK.copper, .5);
      box(-w / 2 + 9, -h / 2 + 9, w - 18, 7, '#9097A0', .4);
      if (i === 3 && !broken) {
        box(-w / 2 + 5, -15, w - 10, h / 2 - 4, TK.steelDk, .5);
        for (let j = 0; j < 3; j++) line([[-16 + j * 13, -6], [-22 + j * 15, 50], [-10 + j * 9, 92]], .8, j % 2 ? TK.copper : TK.led);
      }
      if (i === 0) {
        for (const ex of [-38, 38]) {
          if (broken) {
            line([[ex - 10, -16], [ex + 10, 4]], 1.9, TK.ember);
            line([[ex + 10, -16], [ex - 10, 4]], 1.9, TK.ember);
          } else box(ex - 9, -15, 18, 21, TK.led, .6);
        }
        line([[-25, 27], [25, 27]], 1.0);
      }
      if (i === 1) {
        box(-62, -78, 124, 160, TK.steelDk, .8);
        box(-39, -52, 78, 54, TK.pcb, .6);
        for (let j = 0; j < 4; j++) line([[-40 + j * 23, 10], [-49 + j * 28, 43], [-28 + j * 17, 67]], 1.1, j % 2 ? TK.copper : TK.led);
        oval(0, -23, 17, 17, broken ? TK.yellow : TK.led, .6);
      }
      pop();
    }
    spark(0, -530, soon, 55);
    pop();
  }
  // The three exports share exactly this hero scale and camera curve.
  const cam = kf(r, [[201.60, [915, 821, 1.38]], [207.26, [915, 821, 1.38]]]);
  const shake = later * 1.4 + how * 1.4 + soon * 1.8 + now * 3;
  camBegin(cam[0] + Math.sin(r * 71) * shake, cam[1] + Math.cos(r * 89) * shake, cam[2]);
  paint(rectPts(-1800, -1800, 5600, 4800), { wash: '#2D3440', fill: '#44525A', fillOp: 78, bleed: .1, tex: .65, border: .3, ink: null });
  // Restrained contemporary press-room wall: framed panels and warm washes.
  for (let i = 0; i < 6; i++) {
    box(402 + i * 174, 260, 151, 687, i % 2 ? '#39464E' : '#354149', .55);
    line([[421 + i * 174, 289], [421 + i * 174, 924]], .5, '#617078');
  }
  box(-700, 960, 3400, 1400, '#414149'); box(-700, 948, 3400, 16, '#9C8567');
  for (let i = 0; i < 8; i++) line([[430 + i * 130, 971], [310 + i * 164, 1260]], .5, '#5B5859');
  // Rear stage step: camera crew stands here, behind the CEO and press table.
  box(484, 906, 864, 41, '#52565A', .8);
  box(484, 900, 864, 8, '#8C8980', .7);
  reporter(582, 900, 1.22, false, 2); reporter(1230, 900, 1.22, false, 11);
  // A central demonstration booth, immediately behind the CEO from the start.
  box(695, 373, 464, 564, '#26303A', 1.3);
  paint([[887, 390], [955, 390], [1088, 934], [756, 934]], { fill: '#D3C396', fillOp: 25, bleed: .025, tex: .25, ink: null });
  robot();
  const left = 707, right = 1147, top = 389, bottom = 936, c = '#775F75', dark = '#635467';
  // A: two curtains snap apart. B: one curtain is pulled sideways. C: roller lifts.
  if (style === 'a') {
    for (const side of [-1, 1]) {
      const x0 = side < 0 ? left : lerp(927, right - 19, reveal), ww = lerp(220, 19, reveal);
      sh([[x0, top], [x0 + ww, top], [x0 + ww + 2 * Math.sin(r * 4), bottom], [x0, bottom]], c, .9);
      for (let i = 1; i < 4; i++) line([[x0 + ww * i / 4, top + 14], [x0 + ww * i / 4 + 3, bottom - 9]], .65, dark);
    }
  } else if (style === 'b') {
    const ww = lerp(right - left, 24, reveal), x0 = right - ww;
    sh([[x0, top], [right, top], [right, bottom], [x0 + 8, bottom]], c, .9);
    for (let i = 1; i < 7; i++) line([[x0 + ww * i / 7, top + 14], [x0 + ww * i / 7 + 3, bottom - 9]], .65, dark);
  } else {
    const lower = lerp(bottom, top + 17, reveal);
    sh([[left, top], [right, top], [right, lower], [left, lower]], c, .9);
    for (let i = 1; i < 7; i++) line([[left + 440 * i / 7, top + 14], [left + 440 * i / 7, Math.max(top + 16, lower - 9)]], .65, dark);
    box(left - 4, lower - 11, 448, 17, '#958194', .9);
  }
  box(692, 372, 470, 19, '#A29B8C', 1.0);
  for (const xx of [695, 1156]) box(xx, 389, 7, 552, '#829092', .8);
  box(660, 309, 510, 59, '#40535A', 1.0);
  letter('ONE MORE QUESTION!', 915, 339, 36, CREAM, { ink: false, font: ruFont(36) });
  if (style === 'c' && r >= 204.28 && r < 204.62) {
    const k = hit(204.28, .18);
    for (let j = 0; j < 3; j++) line([[614 + j * 11, 1030 - j * 11], [639 + j * 11, 1004 - j * 11]], .8, '#D5DCB8');
    oval(1156, 412, 10 * k + 3, 10 * k + 3, '#C5D7CF', .5);
  }
  ceoClawd(heroX, heroY, u, { ...body, noClicker: true, noShadow: false,
    mouth: mouthOf(spoken('ceo'), crashed ? 'grin' : 'flat'),
    armL: uu => {
      if (r < 202.26) { push(); rotate(body.aL); mic(0, 0, 0, 1.08); pop(); }
    },
    draw: uu => {
      const pull = pocketsAt(r);
      if (pull > 0) for (const side of [-1, 1]) {
        const x = side * 4.4 * uu, y = -3.7 * uu;
        sh([[x, y], [x + side * 60 * pull, y - 10 * pull],
          [x + side * 90 * pull, y + 10 * pull], [x + side * 94 * pull, y + 70 * pull],
          [x + side * 55 * pull, y + 87 * pull], [x + side * 10 * pull, y + 65 * pull],
          [x, y + 35]], CREAM, 1.05);
        line([[x + side * 14, y + 14], [x + side * 72 * pull, y + 14 * pull]], .7, '#9A9B91');
        line([[x + side * 18, y + 35], [x + side * 29 * pull, y + 62 * pull],
          [x + side * 56 * pull, y + 73 * pull]], .55, '#B3AD99');
      }
    } });
  if (r >= 202.26 && r < 203.06) {
    const dt = r - 202.26;
    mic(release[0] - 590 * dt, release[1] - 390 * dt + 580 * dt * dt, releaseAngle - dt * 9, 1.08);
    if (dt < .12) for (let i = 0; i < 3; i++)
      line([[release[0] + 15 + i * 9, release[1] + i * 14], [release[0] + 38 + i * 9, release[1] + 8 + i * 14]], .9, CREAM);
  }
  {
    // Foreground podium naturally hides the legs and grounded lower body.
    box(718, 888, 399, 41, '#4C565A', 1.4); box(733, 898, 369, 20, '#667174', .7);
    for (const xx of [738, 1092]) box(xx, 926, 12, 29, '#858E8D', .7);
    for (let i = 0; i < 5; i++) line([[770 + i * 66, 907], [767 + i * 66, 915]], .5, '#514138');
    box(699, 879, 487, 16, '#B3A58E', 1.3);
    for (let i = 0; i < 3; i++) {
      const x = 774 + i * 73;
      line([[x + 12, 883], [x, 854]], .9); mic(x, 854, (i - 1) * .15, .50);
    }
    const lift = easeOut(seg(r, 205.24, 205.54)), by = lerp(902, button[1], lift);
    if (lift > .01) {
      box(button[0] - 34, by + 10, 68, 36, TK.steelDk);
      const pushDown = 6 * rebound(r, 205.90, .18);
      oval(button[0], by + pushDown, 25, 13 - pushDown * .45, TK.ember);
    }
  }
  if (crashed) {
    for (const [at, x, tilt, seed] of [[206.28, 1240, -.025, 3], [206.70, 582, .020, 5]]) {
      if (r < at - .27) continue;
      const p = easeIn(seg(r, at - .27, at)), dt = Math.max(0, r - at);
      const bounce = r >= at ? 17 * Math.abs(Math.sin(dt * 21)) * Math.exp(-dt * 5) : 0;
      rack(x, lerp(-260, 948, p) - bounce, 126, 426, tilt + .008 * Math.sin(dt * 13), seed);
      spark(x, 943, hit(at), 68);
    }
    for (const at of [205.90, 206.40, 206.85]) {
      const dt = r - at; if (dt < 0 || dt > 1.35) continue;
      const ox = at === 205.90 ? 1100 : at === 206.40 ? 1348 : 567;
      for (let i = 0; i < 7; i++) {
        const vx = (hash(i + at) - .5) * 440, vy = -120 - hash(i + 8) * 250;
        const x = ox + vx * dt, y = 892 + vy * dt + 310 * dt * dt;
        line([[x, y], [x - vx * .022, y - (vy + 620 * dt) * .022]], .8, i % 2 ? '#F4B053' : CREAM);
      }
    }
  }
  // Foreground press witnesses look up; distinct footprints leave the CEO's face clear.
  reporter(718, 1195, 2.50, true, 5); reporter(1107, 1195, 2.50, true, 8);
  camEnd();
}
CAPEX_V.q4a = r => conference(r, 'a');
CAPEX_V.q4b = r => conference(r, 'b');
CAPEX_V.q4c = r => conference(r, 'c');
})();
