// SLOT MACHINE: physical hands, recognisable GPUs, a readable face through the payout.
// --var=capex:d,capexend:rain|belt. Every pose is a pure function of real song time.
window.CAPEX_V = window.CAPEX_V || {};
CAPEX_V.d = function (r) {
  const INK = '#171C25', NAVY = '#27364D', GOLD = '#E8AA52', ORANGE = '#DE8654';
  const sh = (p, c, sw = 1.2) => paint(p, { wash: c, ink: INK, sw, tex: .45 });
  const box = (x, y, w, h, c, sw) => sh(rectPts(x, y, w, h), c, sw);
  const oval = (x, y, a, b, c, sw) => sh(ellPts(x, y, a, b, 18), c, sw);
  const line = (p, w = 1.2, c = INK) => inkLine(p, w, c, 'ink', 0);
  const hit = (at, life = .12) => r < at ? 0 : Math.exp(-(r - at) / life);
  const later = hit(202.26), how = hit(203.20), soon = hit(204.92), now = hit(205.90);
  const fired = r >= 205.90, age = Math.max(0, r - 205.90);
  const belt = (window.BTT_VAR || {}).capexend === 'belt';
  function coin(x, y, s = 1, a = 0) {
    push(); translate(x, y); rotate(a); scale(s);
    oval(0, 0, 26, 26, GOLD); oval(0, 0, 19, 19, '#F7D184', .65);
    sh([[-8, -13], [8, -13], [15, 0], [8, 13], [-8, 13], [-15, 0]], '#CB8944', .6); pop();
  }
  function gpu(x, y, s = 1, a = 0, spin = 0) {
    push(); translate(x, y); rotate(a); scale(s);
    // Long board, two fan circles, PCIe fingers, and the silver mounting bracket.
    box(-82, -37, 164, 74, '#365D5D'); box(-76, -31, 149, 62, '#263843', 1);
    box(-78, 33, 113, 10, '#CEAA59', .6);
    for (let i = 0; i < 9; i++) line([[-71 + i * 12, 35], [-71 + i * 12, 41]], .45, '#F5CF7F');
    box(78, -47, 12, 95, '#A7AFB0', .9); box(81, -54, 22, 8, '#C7C7BA', .6);
    for (const fx of [-40, 34]) {
      oval(fx, 0, 29, 29, '#17212A', .8); oval(fx, 0, 23, 23, '#788F91', .6);
      for (let j = 0; j < 5; j++) {
        const q = spin + j * TAU / 5;
        sh([[fx + 5 * Math.cos(q), 5 * Math.sin(q)],
          [fx + 20 * Math.cos(q + .35), 20 * Math.sin(q + .35)],
          [fx + 18 * Math.cos(q + .95), 18 * Math.sin(q + .95)]], '#344B55', .35);
      }
      oval(fx, 0, 6, 6, '#B9C5C0', .4);
    }
    line([[-69, -25], [-52, -25]], .8, '#A6C0B5'); pop();
  }
  function brain(x, y, s = 1) {
    push(); translate(x, y); scale(s);
    sh([[-40, 18], [-49, 0], [-44, -21], [-30, -27], [-24, -40], [-7, -42],
      [0, -33], [12, -43], [29, -36], [34, -24], [47, -15], [49, 9],
      [37, 26], [14, 31], [0, 24], [-18, 31]], '#CA9398');
    line([[0, -30], [-4, -10], [3, 5], [0, 22]], 1.2);
    line([[-29, -22], [-17, -12], [-28, 0], [-17, 14]], .9);
    line([[25, -26], [16, -12], [31, -3], [20, 15]], .9); pop();
  }
  function snail(x, y) {
    sh([[x - 48, y + 24], [x - 24, y + 13], [x + 23, y + 15], [x + 32, y - 11],
      [x + 43, y - 10], [x + 43, y + 22], [x + 57, y + 29], [x - 42, y + 32]], '#A3AAA0');
    oval(x - 10, y, 30, 29, '#BF976E');
    const p = []; for (let j = 0; j < 23; j++) {
      const a = j * .43, rad = 23 * (1 - j / 27); p.push([x - 10 + Math.cos(a) * rad, y + Math.sin(a) * rad]);
    }
    line(p, 1.2); line([[x + 33, y - 9], [x + 29, y - 25]], 1);
    line([[x + 41, y - 9], [x + 48, y - 24]], 1);
    oval(x + 29, y - 26, 3, 4, INK, .3); oval(x + 48, y - 25, 3, 4, INK, .3);
  }
  function burst(x, y, k, rad = 65) {
    if (k > .025) paint(starPts(x, y, rad * k, .42, 8), { wash: '#FFE6A9', ink: null });
  }
  // Composition fits the complete hero and the machine throughout the native 3:4 camera.
  const cam = kf(r, [[201.60, [1000, 568, 1.02]], [202.26, [1008, 559, 1.06]],
    [202.65, [987, 600, 1.04]], [203.20, [970, 585, 1.07]],
    [203.65, [987, 575, 1.04]], [204.28, [1010, 527, 1.04]],
    [204.92, [1014, 519, 1.07]], [205.30, [1000, 568, 1.02]],
    [205.90, [1000, 575, 1.00]], [206.48, [982, 577, 1.02]], [207.26, [969, 570, 1.03]]]);
  const shake = later * 3 + how * 6 + soon * 3 + now * 13;
  camBegin(cam[0] + Math.sin(r * 83) * shake, cam[1] + Math.cos(r * 69) * shake, cam[2]);
  paint(rectPts(-1800, -1800, 5600, 4800), { wash: '#17212F', ink: null });
  for (let i = 0; i < 11; i++) {
    const x = 180 + i * 170;
    sh([[x, -650], [x + 110, -650], [x + 80, 940], [x - 15, 940]], i % 2 ? '#202B40' : '#253047', .4);
  }
  box(-900, 930, 4000, 1400, '#3B3338');
  line([[380, 934], [1760, 934]], .8, '#63515A');
  glowAt(1130, 390, 360, fired ? '#FF9B4E' : '#DF9750', fired ? 42 : 27);
  // Feet stay planted; recoil comes from rotation about the cabinet's base.
  const recoil = -.012 * later + .017 * how - .012 * soon + .035 * now;
  const pull = easeOut(seg(r, 201.60, 201.96));
  const lever = [866, 705 + 114 * pull];
  const button = [892, 858];
  push(); translate(1130, 924); rotate(recoil); translate(-1130, -924);
  sh(rrPts(887, 191, 517, 732, 42), '#76534A', 2);
  sh(rrPts(902, 205, 487, 699, 29), NAVY, 1.6);
  sh(rrPts(920, 224, 450, 89, 23), '#473C45');
  sh([[1069, 283], [1060, 247], [1098, 262], [1144, 232], [1183, 262], [1227, 247], [1216, 283]], GOLD);
  for (let i = 0; i < 19; i++) {
    const x = i < 11 ? 932 + i * 43 : i < 15 ? 915 : 1381;
    const y = i < 11 ? 213 : 346 + (i % 4) * 127;
    const lit = fired || (i + Math.floor(r * 15)) % 5 < 3;
    oval(x, y, 7, 8, lit ? '#FFCF79' : '#665349', .5);
  }
  box(936, 335, 415, 211, INK, 1.8);
  for (let i = 0; i < 3; i++) {
    const x = 1006 + i * 137;
    box(x - 62, 348, 124, 183, '#E5D8BF');
    if (r < 202.26) {
      const yy = 350 + ((r * 5 + i * .27) % 1) * 178;
      if (i === 0) coin(x, yy, 1); else if (i === 1) brain(x, yy, .85); else gpu(x, yy, .48, .12);
      for (let q = 0; q < 3; q++) line([[x - 42 + q * 40, 358], [x - 42 + q * 40, 520]], .6, '#B7AB94');
    } else if (r < 204.28) snail(x, 439 + Math.sin(r * 3 + i) * 1.5);
    else {
      const stop = [204.49, 204.70, 204.92][i];
      const off = 148 * (1 - easeOut(seg(r, 204.28, stop)));
      const miss = i === 2 ? 87 * easeIn(seg(r, 204.85, 204.92)) : 0;
      brain(x, 439 + off + miss, .92);
    }
  }
  box(931, 318, 426, 30, NAVY); box(931, 531, 426, 113, NAVY);
  for (const x of [1068, 1205]) box(x, 348, 13, 184, '#55484A');
  line([[937, 348], [1351, 348]], 1.3, GOLD); line([[937, 531], [1351, 531]], 1.3, GOLD);
  sh([[920, 432], [937, 440], [920, 448]], GOLD);
  // The coin slot and lever are close enough for a real short arm to reach.
  sh(rrPts(918, 744, 67, 73, 9), '#9C8D79'); box(942, 757, 11, 47, INK);
  sh(rrPts(1011, 610, 322, 58, 12), '#4B4241');
  box(1045, 711, 279, 90, '#111B26');
  sh([[1018, 795], [1344, 795], [1327, 846], [1035, 846]], '#82786C', 1.7);
  line([[1049, 821], [1321, 821]], 1, '#AAA08B');
  oval(901, 857, 31, 25, '#111B26'); oval(button[0], button[1] - now * 6, 19, 13, '#C75541');
  oval(891, 841, 8, 3, '#F4A57C', .3);
  oval(908, 850, 8, 8, '#909087');
  sh([[908, 850], [856, 824], [856, 708]], '#909087', .8);
  // Handle follows a visible pivot and stops before the LATER payout.
  line([[908, 850], lever], 1.8, '#BDB5A4'); oval(...lever, 18, 18, '#C75541');
  if (fired && age < .18) {
    burst(1167, 799, Math.exp(-age * 24), 170);
    for (let i = 0; i < 5; i++) line([[1080 + i * 39, 722], [1077 + i * 39, 703 - now * 30]], .8, '#FFE2A0');
  }
  pop();
  // Airborne hardware passes behind the face; the settled pile is in front.
  if (fired) {
    if (belt) {
      const extend = easeOut(seg(age, 0, .20)), left = lerp(1050, 557, extend);
      sh([[left, 842], [1325, 842], [1325, 891], [left, 891]], '#4B5C61', 1.5);
      for (let i = 0; i < 15; i++) {
        const x = left + ((i * 56 - age * 300) % (1325 - left) + 1325 - left) % (1325 - left);
        line([[x, 847], [x - 18, 885]], .8, '#A0A19A');
      }
      for (let i = 0; i < 7; i++) {
        const a = age - i * .16; if (a < 0) continue;
        const p = Math.min(1, a / .80), x = lerp(1180, 590, p);
        const fall = Math.max(0, a - .8);
        gpu(x, 804 + 520 * fall * fall, .63, -.10 - fall * 3, r * 9 + i);
      }
    } else {
      // Cards arc out of the actual trough. Staggered births sustain the avalanche.
      for (let i = 0; i < 15; i++) {
        const start = i * .057, a = age - start; if (a < 0) continue;
        const vx = -240 - hash(i + 19) * 430, vy = -300 - hash(i + 41) * 240;
        const x = 1167 + vx * a, y = 815 + vy * a + 620 * a * a;
        // Once a card settles it belongs to the heap, not a flickering airborne clone.
        if (y < 945) gpu(x, y, .57 + hash(i) * .16, .1 + a * (i % 2 ? 3 : -3), r * 8 + i);
      }
    }
  }
  // The original Clawd drawer remains untouched. Native arms are tucked behind the torso;
  // the posed arms below inherit the body's exact squash/rotation and have fixed lengths.
  const prep = ease(seg(r, 205.24, 205.61));
  const lean = .06 * prep - .055 * how - .022 * now;
  const squash = .06 * how + .055 * now;
  const heroX = 713 - 11 * how + (belt ? -12 * easeOut(seg(r, 206.10, 206.65)) : 0);
  const heroY = 928;
  const u = 31, sx = 1 + squash * .6, sy = 1 - squash;
  clawd(heroX, heroY, u, { noShadow: false, aL: -Math.PI / 2, aR: -Math.PI / 2,
    sq: squash, rot: lean, col: ORANGE, dk: '#A9583E', lt: '#F0AC77',
    eyes: fired ? 'scared' : r >= 203.20 && r < 204.28 ? 'swirl' : 'narrow',
    mouth: fired ? 'O' : r < 203.20 ? 'smile' : 'flat' });
  function arm(side, worldTarget) {
    const c = Math.cos(lean), s = Math.sin(lean), dx = worldTarget[0] - heroX, dy = worldTarget[1] - heroY;
    const target = [(c * dx + s * dy) / sx, (-s * dx + c * dy) / sy];
    const shoulder = [side * 4.9 * u, -4.5 * u], ax = target[0] - shoulder[0], ay = target[1] - shoulder[1];
    const d = Math.min(123.9, Math.max(8, Math.hypot(ax, ay))), a = Math.atan2(ay, ax);
    const bend = side * Math.acos(d / 124), elbow = [shoulder[0] + 62 * Math.cos(a + bend), shoulder[1] + 62 * Math.sin(a + bend)];
    const tip = [shoulder[0] + d * Math.cos(a), shoulder[1] + d * Math.sin(a)];
    push(); translate(heroX, heroY); rotate(lean); scale(sx, sy);
    for (const [p, q] of [[shoulder, elbow], [elbow, tip]]) {
      const len = Math.hypot(q[0] - p[0], q[1] - p[1]), px = -(q[1] - p[1]) * 10 / len, py = (q[0] - p[0]) * 10 / len;
      sh([[p[0] + px, p[1] + py], [q[0] + px, q[1] + py], [q[0] - px, q[1] - py], [p[0] - px, p[1] - py]], ORANGE, 1.1);
    }
    oval(...elbow, 11, 11, ORANGE, .7); oval(...tip, 17, 14, '#EA9A65', 1);
    line([[tip[0] - 5, tip[1] - 5], [tip[0] + 5, tip[1] - 5]], .6, '#A9583E'); pop();
    return [heroX + c * tip[0] * sx - s * tip[1] * sy, heroY + s * tip[0] * sx + c * tip[1] * sy];
  }
  arm(-1, [595, 849 - 20 * prep]);
  let right = [855, 844];
  if (r < 202.48) right = lever;
  else if (r < 203.03) {
    const p = ease(seg(r, 202.48, 202.97)); right = [lerp(866, 945, p), lerp(819, 782, p)];
  } else if (r < 203.20) {
    const p = ease(seg(r, 203.03, 203.18)); right = [lerp(945, 855, p), lerp(782, 844, p)];
  } else if (r >= 205.24 && !fired) {
    const down = easeIn(seg(r, 205.70, 205.90)); right = [lerp(855, 892, prep), lerp(844, 786, prep) + 72 * down - 24 * Math.sin(prep * Math.PI)];
  } else if (fired) right = [lerp(892, 858, easeOut(seg(age, 0, .20))), 858 - 16 * Math.sin(age * 9) * Math.exp(-age * 2)];
  const hand = arm(1, right);
  if (r >= 202.48 && r < 203.03) {
    const enter = ease(seg(r, 202.94, 203.03)); coin(hand[0], hand[1] - 11, .75 * (1 - .8 * enter));
  }
  if (r >= 203.03 && r < 204.00) {
    if (r < 203.20) {
      const p = seg(r, 203.03, 203.20); coin(lerp(945, 705, p), lerp(771, 696, p) - 52 * Math.sin(p * Math.PI), .75, p * 5);
    } else {
      const a = r - 203.20; coin(705 - 150 * a, 696 - 170 * a + 660 * a * a, .75, a * 12);
      burst(705, 694, how, 66);
      for (let i = 0; i < 3; i++) {
        const p = r * 7 + i * TAU / 3;
        sh(starPts(710 + Math.cos(p) * 85, 668 + Math.sin(p) * 12, 7, .4, 5), GOLD, .5);
      }
    }
  }
  // The slow symbols stay exposed; their impact mark is beside, never over, the image.
  burst(1373, 442, later, 37); burst(1373, 526, soon, 38);
  if (r >= 204.92 && r < 205.30) {
    line([[1248, 570], [1254, 592], [1248, 607]], .8, '#AEB9B7');
    line([[1280, 565], [1288, 589], [1281, 607]], .8, '#AEB9B7');
  }
  if (fired) {
    // Face stays above the heap. Each card arrives and settles, instead of a solid wall popping in.
    const rise = easeOut(seg(age, .16, 1.05)), top = 956 - rise * 155;
    for (let i = 0; i < 13; i++) {
      const born = .13 + i * .052; if (age < born) continue;
      const a = age - born, x = 587 + (i % 5) * 124 + 14 * Math.sin(i * 8), y = top + 62 + Math.floor(i / 5) * 75 + 12 * Math.sin(i * 5);
      gpu(x, y - 15 * Math.exp(-a * 8) * Math.abs(Math.sin(a * 19)), .70,
        .31 * Math.sin(i * 3) + .015 * Math.exp(-a * 4) * Math.sin(a * 15), r * (i < 3 ? 5 : 0) + i);
    }
    // The gag ends with the character looking out of the hardware, still moving.
    for (let i = 0; i < 7; i++) {
      const p = (age * .9 + hash(i + 9)) % 1;
      line([[970 + hash(i) * 340, 850 - p * 300], [973 + hash(i) * 340, 859 - p * 300]], .8, i % 2 ? GOLD : '#E47743');
    }
  }
  camEnd();
};
