// Q1: the established two-reporter conference.
window.CAPEX_V = window.CAPEX_V || {};
CAPEX_V.q1 = CAPEX_V.e;

// Q4: a press scrum surges towards the stage, microphones push in from both sides.
window.CAPEX_V = window.CAPEX_V || {};
CAPEX_V.q4 = function (r) {
  const INK = PAL.ink, CREAM = PAL.cream;
  const sh = (p, c, sw = 1.2) => paint(p, { wash: c, fill: mixCol(c, TK.soot, .30), fillOp: 55, bleed: .035, tex: .6, border: .5, ink: INK, sw });
  const box = (x, y, w, h, c, sw) => sh(rectPts(x, y, w, h, 1.2), c, sw);
  const oval = (x, y, a, b, c, sw) => sh(ellPts(x, y, a, b, 18, .6), c, sw);
  const line = (p, w = 1, c = INK) => inkLine(p, w, c, 'ink', 0);
  const hit = (at, life = .12) => r < at ? 0 : Math.exp(-(r - at) / life);
  const later = hit(202.26), how = hit(203.20), soon = hit(204.92), now = hit(205.90);
  const crashed = r >= 205.90, broken = r >= 204.92, age = Math.max(0, r - 205.90);
  const podiumEnd = false;
  const reveal = ease(seg(r, 204.28, 204.66));
  const rise = podiumEnd ? 355 * easeOut(seg(age, 0, 1.03)) : 0;
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
  const heroX = 887, u = 40, body = pose(r), heroY = body.y - rise;
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
    sh(rrPts(-16, -13, 32, 24, 3, .6), TK.steelDk, .7);
    box(-10, -18, 14, 6, TK.steelLt, .5);
    oval(16, 0, 9, 10, TK.soot, .6); oval(18, 0, 5, 6, '#7A93D8', .5);
  }
  function reporter(x, y, s, journalist, seed) {
    const flee = crashed ? easeOut(seg(age, .06, 1.35)) : 0;
    const question = spoken(seed), ask = journalist ? askPose(seed) : 0;
    const dir = seed === 5 ? 1 : -1;
    const xx = x + (journalist ? dir * 42 * ask : 0) + (seed % 2 ? -1 : 1) * flee * 110;
    const yy = y - (journalist ? 65 * ask : 0) + flee * 35;
    const aR = journalist ? lerp(-.65, .58, ask) : 1.1 + .06 * Math.sin(r * 5 + seed);
    const aL = journalist ? lerp(.15, 1.25 + .10 * Math.sin(r * 18), ask) : crashed ? .95 : .2;
    const dy = -.32 * bounce(r + seed * .017) - .28 * ask;
    const reaction = mood(r, [[201.60, 'narrow'], [205.90, 'scared']]);
    const lean = journalist ? (seed === 5 ? .025 : -.025) * ask : 0;
    push(); translate(xx, yy); scale(s);
    agentBot(0, 0, 8, N2O(r), { seed, dance: 'idle', dx: 0, dy,
      noShadow: false, ...reaction, flip: journalist && seed === 8,
      eyes: question ? 'normal' : reaction.eyes,
      squint: question ? 0 : reaction.squint,
      sq: .03 * bounce(r + seed * .017) + .035 * ask,
      rot: lean + (crashed ? .06 * Math.sin(age * 11 + seed) : .012 * Math.sin(r * 5 + seed)),
      walk: crashed ? age * 3 : null,
      mouth: mouthOf(question, crashed ? 'o' : 'flat'), aL, aR,
      armR: uu => {
        push(); rotate(aR); if (journalist) mic(0, 0, -.55, .5); else camera(); pop();
      }
    }); pop();
    if (question) {
      // A single balloon points to the speaking reporter; the other reporter stays quiet.
      const by = yy - 242, bw = question.word === 'REVENUE?' ? 286 : 248, bh = 68;
      sh([[xx - 22, by + bh - 3], [xx + 17, by + bh - 3], [xx + 5, yy - 168]], CREAM, 1.2);
      sh(rrPts(xx - bw / 2, by, bw, bh, 12, .8), CREAM, 1.4);
      letter(question.word, xx, by + bh / 2, 33, INK, { ink: false, font: ruFont(33) });
      // Two small hand-drawn accents make the raised microphone readable at phone size.
      const dir = seed === 5 ? 1 : -1;
      line([[xx + dir * 144, yy - 160], [xx + dir * 163, yy - 174]], 1.0, CREAM);
      line([[xx + dir * 154, yy - 141], [xx + dir * 177, yy - 145]], 1.0, CREAM);
    }
  }
  function robot() {
    // Boots touch the stage; every detached part lands on that same plane.
    const dt = Math.max(0, r - 204.92), base = 951;
    const parts = [[0, -608, 173, 116], [0, -416, 168, 230],
      [-123, -416, 53, 182], [123, -416, 53, 182], [-49, -133, 55, 264], [49, -133, 55, 264]];
    for (let i = 0; i < parts.length; i++) {
      const [px, py, w, h] = parts[i]; let dx = 0, dy = 0, tilt = 0;
      if (broken) {
        const sign = i % 2 ? 1 : -1;
        if (i === 0) {
          const startY = base + py, floorY = base - h / 2;
          const contact = (75 + Math.sqrt(75 * 75 + 4 * 850 * (floorY - startY))) / 1700;
          dx = 30 * easeOut(seg(dt, 0, .15)) + 67 * dt;
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
      push(); translate(1254 + px + dx, base + py + dy); rotate(tilt);
      sh(rrPts(-w / 2, -h / 2, w, h, 7, 1.3), i === 1 ? TK.steel : TK.steelLt, 1.6);
      for (const side of [-1, 1]) oval(side * (w / 2 - 12), -h / 2 + 17, 3.5, 3.5, TK.copper, .5);
      box(-w / 2 + 9, -h / 2 + 9, w - 18, 7, '#9097A0', .4);
      if (i === 3 && !broken) {
        box(-w / 2 + 5, -15, w - 10, h / 2 - 4, TK.steelDk, .5);
        for (let j = 0; j < 3; j++) line([[-16 + j * 13, -6], [-22 + j * 15, 50], [-10 + j * 9, 92]], .8, j % 2 ? TK.copper : TK.led);
      }
      if (i === 0) {
        for (const ex of [-38, 38]) box(ex - 9, -15, 18, broken ? 8 : 21, broken ? TK.ember : TK.led, .6);
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
    spark(1254, 405, soon, 73);
  }
  const cam = kf(r, [[201.60, [915, 864, 1.40]], [202.26, [913, 867, 1.42]],
    [203.20, [910, 866, 1.42]], [203.90, [930, 861, 1.39]],
    [204.60, [995, 793, 1.25]], [204.92, [998, 798, 1.25]],
    [205.45, [960, 845, 1.34]], [205.90, [922, 868, 1.42]],
    [206.40, [927, 865, 1.37]],
    [207.26, [925, 866, 1.37]]]);
  const extra = hit(206.40) + hit(206.85), shake = later * 3 + how * 3 + soon * 5 + now * 12 + extra * 5;
  camBegin(cam[0] + Math.sin(r * 71) * shake, cam[1] + Math.cos(r * 89) * shake, cam[2]);
  paint(rectPts(-1800, -1800, 5600, 4800), { wash: TK.soot, fill: '#332535', fillOp: 100, bleed: .1, tex: .65, border: .3, ink: null });
  box(1080, 231, 375, 725, TK.soot);
  if (reveal > 0) {
    paint([[1214, 230], [1296, 230], [1438, 954], [1096, 954]], { fill: TK.yellowLt, fillOp: 24, bleed: .025, tex: .25, border: .1, ink: null });
    robot();
  }
  for (let i = 0; i < 20; i++) {
    const x = 310 + i * 65, alcove = x >= 1080 && x <= 1455;
    const target = x < 1260 ? 1066 + (x - 1080) * .1 : 1454 + (x - 1260) * .1;
    const xx = alcove ? lerp(x, target, reveal) : x, w = alcove ? lerp(67, 10, reveal) : 67;
    const drift = 2 * Math.sin(r * 2 + i), yy = 958;
    sh([[xx + jit(1), -700], [xx + w + jit(1), -700],
      [xx + w - 4 + drift, yy + jit(2)], [xx - 7 + drift, yy + jit(2)]], i % 2 ? '#362B3D' : '#2B2331', .45);
    line([[xx + w * .18, 340], [xx + w * .21 + drift, 700], [xx + w * .15 + drift, 942]], .5, '#4B3947');
  }
  for (const [x, col] of [[714, TK.orange], [1110, TK.yellowLt]]) {
    glowAt(x, 700, 190, col, 22);
  }
  box(-700, 960, 3400, 1400, '#352C33'); box(-700, 952, 3400, 17, '#936B49');
  for (let i = 0; i < 8; i++) line([[430 + i * 130, 972], [310 + i * 164, 1260]], .5, '#514039');

  box(641, 506, 558, 67, '#48363F', 1.1);
  letter('ONE MORE QUESTION!', 920, 540, 43, CREAM, { ink: false, font: ruFont(43) });
  reporter(560, 955, 2.35, false, 2); reporter(1282, 955, 2.0, false, 11);
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
  if (!crashed || !podiumEnd) {
    // Foreground podium naturally hides the legs and grounded lower body.
    box(724, 888, 384, 63, '#665247', 1.6); box(742, 901, 346, 35, '#7B6551', .7);
    for (let i = 0; i < 5; i++) line([[770 + i * 66, 907], [767 + i * 66, 934]], .5, '#514138');
    box(710, 879, 472, 25, '#A1896B', 1.4);
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
    if (r >= 205.72 && r < 206.04) {
      const grip = hand(r, 1, rise), q = body.sq + body.take;
      push(); translate(...grip); rotate(body.rot - body.aR); scale(1 + q * .6, 1 - q);
      paint(rectPts(-18, -20, 18, 40, 1.2), { wash: PAL.clay, fill: '#3E5A8C', fillOp: 50, ink: INK, sw: 1.6 }); pop();
    }
  }
  if (crashed) {
    if (podiumEnd && rise > 2) {
      // The former podium becomes a lifting rack. Hero and roof share ONE support point.
      rack(887, 949, 386, rise, 0, 4);
      // Redraw the planted feet over the roof edge, without a duplicate face or body.
      for (const lx of [-4, -2, 1, 3]) box(heroX + lx * u * (1 + (body.sq + body.take) * .6), heroY - 8, u * (1 + (body.sq + body.take) * .6), 10, '#3E5A8C', .7);
    }
    spark(button[0] + 26, button[1] + 26, now, 42);
    for (let i = 0; i < (podiumEnd ? 7 : 0); i++) {
      const vx = (i - 3) * 75, vy = -140 - hash(i) * 160;
      const x = 904 + (i - 3) * 39 + vx * age, y = Math.min(951 - i % 2 * 17, 786 + vy * age + 520 * age * age);
      push(); translate(x, y); rotate((i - 3) * (.15 + age * 1.8));
      sh([[-33, -9], [34, -13], [47, 7], [-24, 19]], i % 2 ? '#A1896B' : '#665247', .8); pop();
    }
    // Button and its platform remain one object when they break away.
    if (podiumEnd) {
      const bx = button[0] + age * 95, by = button[1] - age * 190 + age * age * 380;
      box(bx - 35, by, 71, 18, '#273039'); oval(bx, by - 4, 26, 11, '#CF5744', .7);
    }
    for (const [at, x, tilt, seed] of [[206.40, 1348, -.065, 3], [206.85, 567, .055, 5]]) {
      if (r < at - .27) continue;
      const p = easeIn(seg(r, at - .27, at)), dt = Math.max(0, r - at);
      const bounce = r >= at ? 17 * Math.abs(Math.sin(dt * 21)) * Math.exp(-dt * 5) : 0;
      rack(x, lerp(-480, 948, p) - bounce, 177, 622, tilt + .008 * Math.sin(dt * 13), seed);
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
  reporter(714, 1105, 2.65, true, 5); reporter(1110, 1105, 2.65, true, 8);
  camEnd();
};
