// The slot machine. All poses, impacts and debris are seekable in real track time.
window.CAPEX_V = window.CAPEX_V || {};
CAPEX_V.d = function (r) {
  const INK = '#171C25', NAVY = '#27364D', GOLD = '#E8AA52';
  const sh = (p, c, sw = 1.4) => paint(p, { wash: c, ink: INK, sw, tex: .5 });
  const box = (x, y, w, h, c, sw) => sh(rectPts(x, y, w, h), c, sw);
  const oval = (x, y, a, b, c, sw) => sh(ellPts(x, y, a, b, 18), c, sw);
  const line = (p, w = 1.5, c = INK) => inkLine(p, w, c, 'ink', 0);
  const hit = t => r < t ? 0 : Math.exp(-(r - t) * 15);
  const later = hit(202.26), how = hit(203.20), soon = hit(204.92), now = hit(205.90);
  const burst = r >= 205.90, age = Math.max(0, r - 205.90);
  const flame = (x, y, s, phase) => {
    push(); translate(x, y); scale(s);
    sh([[-23, 15], [-30, -8], [-15, -33], [-10, -15], [7 + 7 * Math.sin(phase), -65], [20, -29], [31, -5], [21, 17]], '#E65B36', .8);
    sh([[-12, 13], [-13, -6], [2, -29], [12, -4], [11, 14]], '#FFD47B', .5); pop();
  };
  function coin(x, y, s, a = 0, burn = false) {
    push(); translate(x, y); rotate(a); scale(s);
    if (burn) flame(0, -8, 1.15, r * 18 + x);
    oval(0, 0, 29, 29, GOLD); oval(0, 0, 21, 21, '#F7D184', .8);
    // A plain embossed hexagon, never a currency glyph.
    sh([[-10, -15], [9, -15], [18, 0], [9, 15], [-10, 15], [-18, 0]], '#CB8944', .7); pop();
  }
  function chip(x, y, s, a = 0) {
    push(); translate(x, y); rotate(a); scale(s);
    for (let k = -2; k <= 2; k++) {
      box(k * 13 - 3, -42, 6, 84, '#C5B989', .5);
      box(-45, k * 12 - 3, 90, 6, '#C5B989', .5);
    }
    box(-36, -33, 72, 66, '#547C77'); box(-23, -22, 46, 44, '#263B44');
    box(-14, -14, 28, 28, '#87A9AC', .7); line([[-13, -12], [9, -12]], .8, '#DCE0CF'); pop();
  }
  function brain(x, y, s) {
    push(); translate(x, y); scale(s);
    sh([[-40, 18], [-49, 0], [-44, -21], [-30, -27], [-24, -40], [-7, -42], [0, -33], [12, -43], [29, -36], [34, -24], [47, -15], [49, 9], [37, 26], [14, 31], [0, 24], [-18, 31]], '#CA9398');
    line([[0, -30], [-4, -10], [3, 5], [0, 22]], 1.6);
    line([[-29, -22], [-17, -12], [-28, 0], [-17, 14]], 1.2);
    line([[25, -26], [16, -12], [31, -3], [20, 15]], 1.2); pop();
  }
  function snail(x, y, s) {
    push(); translate(x, y); scale(s);
    sh([[-47, 24], [-24, 13], [23, 15], [32, -11], [43, -10], [43, 22], [57, 29], [-42, 32]], '#A3AAA0');
    oval(-10, 0, 30, 29, '#BF976E');
    const spiral = [];
    for (let j = 0; j < 23; j++) { const a = j * .43, rad = 23 * (1 - j / 27); spiral.push([-10 + Math.cos(a) * rad, Math.sin(a) * rad]); }
    line(spiral, 1.5); line([[33, -9], [29, -25]], 1.2); line([[41, -9], [48, -24]], 1.2);
    oval(29, -26, 3, 4, INK, .3); oval(48, -25, 3, 4, INK, .3); pop();
  }
  function cherry(x, y) {
    line([[x - 18, y + 5], [x, y - 37], [x + 23, y + 2]], 2.5, '#67886B');
    oval(x - 20, y + 16, 19, 22, '#B94A45'); oval(x + 23, y + 13, 19, 22, '#CC6154');
  }
  function impact(x, y, k, size) {
    if (k > .02) sh(starPts(x, y, size * k, .32, 9, r * .2), '#FFF0B9', .8);
  }

  const cam = kf(r, [[201.60, [1000, 505, 1.24]], [202.24, [1052, 491, 1.32]],
    [202.56, [1035, 545, 1.30]], [202.98, [982, 550, 1.40]], [203.38, [937, 553, 1.44]],
    [203.83, [970, 522, 1.39]], [204.27, [1027, 455, 1.32]], [204.89, [1070, 412, 1.37]],
    [205.22, [1030, 473, 1.30]], [205.88, [1010, 512, 1.28]], [206.25, [1000, 543, 1.18]],
    [206.73, [970, 566, 1.23]], [207.26, [925, 563, 1.30]]]);
  const kick = later * .045 + how * .06 + soon * .055 + now * .13;
  const shake = burst ? 19 * Math.exp(-age * 2.3) : 3 * (later + how + soon);
  camBegin(cam[0] + Math.cos(r * 91) * shake, cam[1] + Math.sin(r * 77) * shake,
    cam[2] + kick + .005 * Math.sin(r * 5));
  paint(rectPts(-1800, -1800, 5600, 4800), { wash: '#141D2B', ink: null });
  // The casino is suggested by velvet folds, warm pools and neighbouring silhouettes.
  for (let i = 0; i < 11; i++) {
    const x = 180 + i * 170;
    sh([[x, -650], [x + 110, -650], [x + 80, 920], [x - 15, 920]], i % 2 ? '#202B40' : '#253047', .4);
  }
  box(-900, 920, 4000, 1400, '#393039');
  for (const x of [350, 1610]) {
    sh(rrPts(x - 115, 280, 230, 670, 45), '#20252F');
    box(x - 85, 425, 170, 200, '#101923');
    glowAt(x, 305, 140, '#DFA25A', 35);
  }
  glowAt(1125, 330, 490, burst ? '#FF803C' : '#DF9750', burst ? 100 : 38);

  // Cabinet recoil is a discontinuity precisely at each answer.
  push(); translate(1125, 820); rotate(-.013 * later + .018 * how - .017 * soon + now * .07); translate(-1125, -820);
  sh(rrPts(840, 155, 575, 735, 48), '#76534A', 2.5);
  sh(rrPts(855, 170, 545, 700, 35), NAVY, 2);
  sh(rrPts(873, 188, 509, 100, 38), '#473C45', 2);
  // Pure pictorial jackpot crown.
  sh([[1037, 245], [1026, 206], [1077, 223], [1127, 184], [1173, 223], [1225, 206], [1213, 245]], GOLD, 1.3);
  for (let i = 0; i < 24; i++) {
    const top = i < 12, x = top ? 879 + i * 45 : (i < 18 ? 867 : 1386);
    const y = top ? 161 + 6 * Math.sin(i / 11 * Math.PI) : 290 + (i % 6) * 86;
    const chase = r >= 204.28 && r < 204.92;
    const lit = burst || (r < 204.92 && (!chase || (i + Math.floor(r * 30)) % 5 < 2));
    oval(x, y, 10 + (burst ? 3 * Math.sin(r * 23 + i) : 0), 11, lit ? '#FFDA8C' : '#635754', .8);
  }
  box(885, 297, 480, 212, INK, 2);
  for (let i = 0; i < 3; i++) {
    const x = 970 + i * 153;
    box(x - 68, 310, 136, 184, '#E5D8BF');
    if (r < 202.26) {
      const ph = (r * 7 + i * .28) % 1;
      const yy = 314 + ph * 178;
      if (i === 0) coin(x, yy, 1.1); else if (i === 1) cherry(x, yy); else chip(x, yy, .85);
      for (let q = 0; q < 3; q++) line([[x - 45 + q * 40, 327], [x - 45 + q * 40, 470]], 1.2, '#B7AB94');
    } else if (r < 204.28) snail(x, 404 + 3 * Math.sin(r * 4 + i), .98);
    else {
      const stop = [204.49, 204.70, 204.92][i];
      const off = r < stop ? (1 - easeOut(seg(r, 204.28, stop))) * 150 : 0;
      brain(x, 404 + off + (i === 2 && r >= 204.92 ? 90 : 0), .99);
    }
  }
  // Masks crop the spinning pictures and the third brain halfway at its stop.
  box(880, 278, 490, 32, NAVY); box(880, 494, 490, 180, NAVY);
  line([[887, 310], [1365, 310]], 2, GOLD); line([[887, 494], [1365, 494]], 2, GOLD);
  for (const x of [1038, 1191]) box(x, 308, 17, 188, '#55484A');
  sh([[872, 395], [891, 405], [872, 415]], '#DDA957');
  sh([[1378, 395], [1359, 405], [1378, 415]], '#DDA957');
  // Coin inlet beside the character; the empty payout trough is below the reels.
  sh(rrPts(887, 548, 85, 65, 10), '#9C8D79'); box(917, 557, 15, 45, INK);
  sh(rrPts(1000, 566, 335, 37, 12), '#4B4241');
  box(940, 678, 375, 99, '#111B26', 2);
  sh([[922, 762], [1332, 762], [1309, 810], [946, 810]], '#82786C', 2);
  line([[956, 782], [1299, 782]], 2, '#AAA08B');
  if (r >= 202.26 && r < 202.60) {
    const p = seg(r, 202.26, 202.60);
    paint(ellPts(1120 + 40 * p, 749 - 45 * p, 15 + 34 * p, 9 + 17 * p, 16), { wash: '#C5BBA9', washOp: 170 * (1 - p), ink: null });
  }
  // Lever is pulled toward Clawd, away from the reels.
  const pull = easeOut(seg(r, 201.60, 201.97));
  const leverY = 407 + 208 * pull;
  oval(854, 654, 27, 27, '#8C8175');
  line([[854, 654], [804, leverY]], 10, INK); line([[854, 654], [804, leverY]], 6, '#C0B7A4');
  oval(804, leverY, 27, 27, '#C75541');
  if (burst) {
    sh(starPts(1120, 616, 260 + 70 * Math.sin(age * 9), .65, 11), '#EF9A48', 2);
    sh(starPts(1120, 616, 204, .55, 9), '#FFDC8D', 1);
    for (let i = 0; i < 5; i++) {
      push(); translate(1060 + (i - 2) * age * 300, 540 - age * 220 + age * age * 100); rotate((i - 2) * (.3 + age));
      sh([[-45, -65], [50, -40], [27, 56], [-31, 36]], i % 2 ? NAVY : '#8E6454', 2); pop();
    }
  }
  pop();

  const bob = Math.sin(r * 7) * 3;
  const slamPrep = ease(seg(r, 205.24, 205.63));
  const cy = 857 + bob + how * 22 + now * 20;
  clawd(741, cy, 28, { eyes: 'narrow', mouth: r < 203.20 ? 'smile' : burst ? 'O' : 'flat',
    noShadow: true, aL: .2 + slamPrep * 1.7, aR: .15 + slamPrep * 1.7,
    sq: .13 * how + .12 * now, rot: -.06 * how + .025 * Math.sin(r * 5),
    col: '#DE8654', dk: '#A9583E', lt: '#F0AC77' });
  function arm(x, y, ex, ey) {
    line([[x, y], [(x + ex) / 2 - 12, y - 19], [ex, ey]], 13, INK);
    line([[x, y], [(x + ex) / 2 - 12, y - 19], [ex, ey]], 9, '#DE8654');
    sh(rrPts(ex - 19, ey - 16, 38, 32, 8), '#E99660');
  }
  if (r < 202.60) arm(852, 726 + bob, 804, leverY);
  if (r >= 202.60 && r < 203.20) {
    const feed = ease(seg(r, 202.60, 202.97));
    const x = lerp(815, 924, feed), y = lerp(690, 579, feed);
    arm(854, 732, x - 12, y + 18);
    if (r < 203.03) coin(x, y, .84 * (1 - .6 * ease(seg(r, 202.94, 203.03))));
    // Rejection travels out in anticipation; contact is exactly HOW.
    if (r >= 203.03) {
      const p = seg(r, 203.03, 203.20);
      coin(lerp(924, 741, p), lerp(579, 603, p) - 42 * Math.sin(p * Math.PI), .84, p * 5);
    }
  }
  if (r >= 203.20 && r < 204.12) {
    const a = r - 203.20;
    coin(741 - 200 * a, 603 - 150 * a + 470 * a * a, .84, a * 10);
    impact(741, 621, how, 94);
    for (let i = 0; i < 3; i++) {
      const a = r * 7 + i * 2.094;
      sh(starPts(740 + Math.cos(a) * 106, 592 + Math.sin(a) * 22, 11, .4, 5), GOLD, .7);
    }
  }
  if (r >= 204.92 && r < 205.24) {
    impact(1280, 467, soon, 67);
    for (let i = 0; i < 5; i++) line([[1100 + i * 23, 170], [1092 + i * 23, 143 - soon * 24], [1105 + i * 23, 119 - soon * 28]], 1.7, '#A5ACAF');
  }
  if (r >= 205.24 && !burst) {
    const down = easeIn(seg(r, 205.71, 205.90));
    arm(621, 727, 944, 641 - 132 * slamPrep + 135 * down);
    arm(866, 727, 1020, 636 - 132 * slamPrep + 135 * down);
  }
  if (burst) {
    arm(621, 727, 944 - 90 * easeOut(age / .28), 663 + Math.sin(age * 17) * 15);
    arm(866, 727, 1020 - 70 * easeOut(age / .28), 658);
    impact(977, 663, now, 135);
    // Continuous outward stream; new chips keep entering until the hard scene cut.
    for (let i = 0; i < 34; i++) {
      const start = i < 12 ? 0 : (i - 12) * .047;
      const a = age - start; if (a < 0) continue;
      const vx = (hash(i + 19) - .63) * 1250, vy = -280 - hash(i + 41) * 620;
      const x = 1130 + vx * a, y = 620 + vy * a + 670 * a * a;
      if (i % 3) chip(x, y, .8 + hash(i) * .45, i + a * (i % 2 ? 5 : -6));
      else coin(x, y, .9, i + a * 7, true);
    }
    // Rising foreground heap covers the body but leaves the slit eyes peeking out.
    const rise = easeOut(seg(r, 205.90, 206.63));
    const top = 1005 - 303 * rise;
    sh([[360, top + 95], [585, top + 22], [733, top], [942, top + 29], [1160, top - 24], [1540, top + 54], [1700, 1400], [200, 1400]], '#354C50', 2);
    for (let i = 0; i < 27; i++) {
      const row = Math.floor(i / 9), x = 425 + (i % 9) * 125;
      const y = top + 72 + row * 108 + Math.sin(i * 2) * 20 + 6 * Math.sin(r * 9 + i);
      if (i % 4) chip(x, y, 1.12, Math.sin(i * 3) * .5 + .035 * Math.sin(r * 8 + i));
      else coin(x, y, 1.1, i, true);
    }
    for (let i = 0; i < 19; i++) {
      const p = (age * (1.1 + hash(i)) + hash(i + 3)) % 1;
      const x = 520 + hash(i + 9) * 930, y = 940 - p * 870;
      line([[x, y], [x + 5, y + 15]], 2, i % 2 ? '#FFCC79' : '#E47743');
    }
  }
  impact(1124, 402, later, 65);
  // Local light wash retains the readable silhouettes on the actual impact frame.
  if (now > .04) paint(rectPts(-1800, -1800, 5600, 4800), { wash: '#FFE0A0', washOp: now * 90, ink: null });
  camEnd();
};
