// THE GREAT CLAWDINI. Real track seconds; no persistent animation state.
window.CAPEX_V = window.CAPEX_V || {};
CAPEX_V.b = function (r) {
  const INK = '#191E29', NAVY = '#29374A', CREAM = '#FFE8B8';
  const orange = '#DC8058', blue = '#7C99B8';
  const shape = (pts, col, sw = 1.3) => paint(pts, { wash: col, ink: INK, sw });
  const box = (x, y, w, h, col, sw) => shape(rectPts(x, y, w, h), col, sw);
  const line = (pts, sw = 1.2, col = INK) => inkLine(pts, sw, col, 'ink', 0);
  // These envelopes start at ONE on the answer frame, never one frame later.
  const hit = (at, life) => r >= at ? Math.max(0, 1 - (r - at) / life) : 0;
  const later = hit(202.26, .23), how = hit(203.20, .26);
  const soon = hit(204.92, .27), now = hit(205.90, .32);
  const fired = r >= 205.90, dt = Math.max(0, r - 205.90);
  const t = r - 201.60;
  const [cx, cy, z] = kf(r, [
    [201.60, [947, 450, 1.48]], [202.20, [975, 424, 1.59]],
    [202.47, [954, 449, 1.49]], [202.82, [1003, 449, 1.56]],
    [203.20, [1020, 460, 1.59]], [203.65, [995, 495, 1.47]],
    [204.08, [1012, 457, 1.44]], [204.48, [1081, 412, 1.32]],
    [204.92, [1103, 427, 1.35]], [205.24, [982, 508, 1.23]],
    [205.80, [966, 552, 1.18]], [206.10, [966, 534, 1.12]],
    [206.55, [945, 456, 1.18]], [207.26, [987, 505, 1.21]]
  ]);
  const shake = later * 5 + how * 7 + soon * 10 + now * 24;
  camBegin(cx + Math.cos(t * 83) * shake, cy + Math.sin(t * 69) * shake,
    z * (1 + .045 * later + .055 * how + .045 * soon + .095 * now));
  paint(rectPts(-1800, -1800, 5500, 4600), { wash: '#141D2A', ink: null });

  function hat(x, y, angle, s = 1) {
    push(); translate(x, y); rotate(angle); scale(s);
    shape([[-48, -90], [48, -90], [42, -4], [-42, -4]], '#22232B');
    box(-44, -28, 88, 19, '#9A4646');
    shape(ellPts(0, 0, 73, 18, 24), '#343844');
    shape(ellPts(0, 0, 42, 10, 22), '#0B1019', .8);
    line([[-32, -80], [-31, -36]], 1.4, '#59606A');
    pop();
  }
  function burst(x, y, radius, k, col = CREAM) {
    if (k <= 0) return;
    paint(starPts(x, y, radius * (.6 + .4 * k), .36, 9, t * .4),
      { wash: col, washOp: 230 * k, ink: null });
  }
  function moth(x, y, ph) {
    push(); translate(x, y); rotate(.28 * Math.sin(ph * .7));
    const wing = 10 + 17 * Math.abs(Math.sin(ph));
    shape(ellPts(-wing * .65, 0, wing, 15, 12, 0, -.45), '#CEC4AC', .9);
    shape(ellPts(wing * .65, 0, wing, 15, 12, 0, .45), '#E1D4B6', .9);
    shape(ellPts(0, 3, 5, 18, 10), '#625953', .7);
    line([[-2, -12], [-11, -22]], .8); line([[2, -12], [11, -22]], .8);
    pop();
  }

  // Theatre curtains and the warm, brushed floor remain behind every close shot.
  for (let i = 0; i < 18; i++) {
    const x = 130 + i * 100;
    shape([[x, -550], [x + 102, -550], [x + 90, 666], [x - 8, 666]],
      i % 2 ? '#334056' : '#263247', .6);
    line([[x + 18, -500], [x + 12, 639]], 1, '#1A2537');
  }
  paint([[380, -270], [780, -270], [1160, 676], [440, 676]],
    { fill: '#C5AC83', fillOp: 24, ink: null, tex: .35 });
  box(-1000, 664, 4000, 1400, '#443E40');
  box(270, 651, 1400, 23, '#8B6D59');
  for (let i = 0; i < 12; i++) line([[200 + i * 145, 680], [-300 + i * 235, 1530]], .8, '#66534C');
  shape(ellPts(874, 651, 292, 47, 28), '#816B57', .5);

  // Gauze curtain: the brain is already a diffuse promise, then revealed below
  // its rising hem. On SOON the hem is at the floor immediately.
  const rise = ease(seg(r, 204.28, 204.88));
  const shut = r >= 204.92;
  const hem = shut ? 641 - 12 * Math.exp(-(r - 204.92) * 8) * Math.abs(Math.sin((r - 204.92) * 25)) : 641 - rise * 354;
  box(1120, 91, 310, 556, '#111924', 2);
  if (r >= 204.28 && !shut) {
    glowAt(1274, 358, 146, '#B8D3BA', 68 + 14 * Math.sin(t * 8));
    // Two lobes and a stem; no circuit glyphs or lettering.
    box(1259, 389, 31, 67, '#BAD0B6', .7);
    const lobes = [[-65, 0, 42, 54], [-40, -41, 43, 46], [-8, -51, 34, 49],
      [33, -47, 41, 44], [65, -13, 39, 47], [47, 30, 49, 40], [-32, 33, 49, 40]];
    for (const [x, y, rx, ry] of lobes) shape(ellPts(1274 + x, 352 + y, rx, ry, 18), '#BFD1B5', .8);
    line([[1275, 293], [1265, 320], [1278, 345], [1266, 375], [1275, 399]], 1.7, '#6C9286');
    line([[1221, 315], [1242, 332], [1223, 352], [1236, 378]], 1.5, '#6C9286');
    line([[1322, 318], [1300, 339], [1325, 363], [1301, 378]], 1.5, '#6C9286');
  }
  // A translucent wash before the answer lets the silhouette read through cloth.
  paint(rectPts(1128, 99, 294, hem - 99), {
    wash: '#68404E', washOp: r >= 204.28 && !shut ? 145 : 255, ink: INK, sw: 1.3
  });
  for (let i = 0; i < 6; i++) line([[1145 + i * 50, 107], [1140 + i * 50, hem - 9]], 1.7, '#3E2B3B');
  box(1115, hem - 9, 320, 15, '#B1826B', 1.7);
  burst(1273, 638, 115, soon, '#E0B781');
  // Visible rope, pulley, and hand-operated winch beside the curtain.
  line([[1418, hem - 7], [1450, 67], [1062, 67], [1062, 549]], 2, '#C7AF89');
  shape(ellPts(1062, 548, 40, 40, 20), '#5A6670');
  shape(ellPts(1062, 548, 24, 24, 18), '#292F3C');
  const crankAngle = shut ? -1.2 - (r - 204.92) * 24 : -.3;
  const crankX = 1062 + Math.cos(crankAngle) * 51;
  const crankY = 548 + Math.sin(crankAngle) * 51;
  line([[1062, 548], [crankX, crankY]], 4, '#B9A690');
  shape(ellPts(crankX, crankY, 13, 13, 14), '#D58459');

  const agi = ease(seg(r, 204.08, 204.35));
  const cap = ease(seg(r, 205.24, 205.55));
  const bob = Math.sin(t * 5) * 4;
  const magicianX = 840 - 44 * agi + 38 * cap;
  const magicianY = 655 + bob;
  // Cape is behind the standard earless, flat-topped Clawd body.
  shape([[magicianX - 125, 414], [magicianX + 132, 414],
    [magicianX + 188 + Math.sin(t * 9) * 17, 658],
    [magicianX + 24, 629], [magicianX - 186, 672]], '#7C3D42', 1.8);
  shape([[magicianX - 120, 415], [magicianX + 108, 418],
    [magicianX + 154, 645], [magicianX - 158, 656]], '#272734', 1.2);

  const holdingHat = r >= 202.60 && r < 204.18;
  clawd(magicianX, magicianY, 36, {
    eyes: 'narrow', mouth: fired ? 'O' : shut && !cap ? 'wobble' : how ? 'flat' : 'smile',
    aL: .25 + .09 * Math.sin(t * 6), aR: r < 202.6 ? .10 + .42 * later : holdingHat ? .11 : .3,
    sq: .12 * later + .16 * how + .12 * soon + .20 * now,
    rot: -.025 * Math.sin(t * 4) - .065 * now, noShadow: true,
    armR: () => {
      // Sleeve opening and an actual visible thread; the blank coin has no token letter.
      box(-79, -24, 68, 48, '#272734', 1.2);
      if (r < 202.60) {
        const retract = r >= 202.26 ? .56 + .44 * easeOut(seg(r, 202.26, 202.36)) : 0;
        const coinX = lerp(27, -62, retract), coinY = lerp(-60, 0, retract);
        line([[-65, 0], [-27, -22 * (1 - retract)], [coinX, coinY]], 1.5, CREAM);
        if (r < 202.36) {
          const appear = .65 + .35 * easeOut(seg(r, 201.60, 201.78));
          shape(ellPts(coinX, coinY, 31 * appear, 35 * appear, 24), '#D5A23F', 1.8);
          shape(ellPts(coinX, coinY, 22 * appear, 26 * appear, 22), '#EAC66E', .8);
          line([[coinX - 10, coinY - 14], [coinX + 2, coinY - 22]], 2, CREAM);
        }
        if (r < 202.26) {
          line([[-5, 7], [3, -38], [13, -39]], 5, orange);
          line([[13, 9], [47, -33], [40, -41]], 5, orange);
        }
        burst(-36, -15, 74, later);
      }
    }
  });

  // One hat is carried from his head to the outstretched hand, then inverted
  // ON the answer (the discontinuity is the deliberate visual punch).
  const takeHat = ease(seg(r, 202.39, 202.60));
  const putHat = ease(seg(r, 204.02, 204.23));
  const held = takeHat * (1 - putHat);
  const hatX = lerp(magicianX, 1092, held);
  const hatY = lerp(magicianY - 290, 459, held);
  const hatAngle = r < 203.20 ? Math.PI * held : -.24 * how;
  hat(hatX, hatY, hatAngle, lerp(.70, 1, held));
  burst(1090, 475, 87, how, '#D7C6A2');
  if (r >= 203.20 && r < 204.28) {
    const age = r - 203.20;
    for (let i = 0; i < 2; i++) {
      const x = 1086 + (i ? 1 : -1) * (34 + age * 105) + Math.sin(age * 9 + i) * 25;
      const y = 481 + 68 * Math.sin(Math.min(1, age * 3) * Math.PI) - age * 156 + i * 39;
      moth(x, y, age * 29 + i * 2);
    }
  }
  if (shut && r < 205.38) {
    // Frantic orange arm stays visibly connected to the spinning crank.
    line([[magicianX + 164, magicianY - 144], [982, 502], [crankX, crankY]], 11, INK);
    line([[magicianX + 164, magicianY - 144], [982, 502], [crankX, crankY]], 7, orange);
    shape(ellPts(crankX, crankY, 17, 14, 14), orange);
    for (let i = 0; i < 3; i++) line([[1009 - i * 11, 535], [997 - i * 11, 566]], 1.5, '#BBAE9C');
  }

  // Tiny wand rises during the question; its tip makes contact on NOW.
  if (r >= 205.24) {
    const wx = magicianX + 232, wy = magicianY - 165;
    line([[magicianX + 170, magicianY - 157], [wx, wy]], 8, orange);
    push(); translate(wx, wy); rotate(fired ? 1.13 + .13 * Math.sin(dt * 12) * Math.exp(-dt * 3) : -.5 - cap * .8);
    box(0, -7, 92, 14, '#171D28', 1.1); box(72, -7, 20, 14, CREAM, .8);
    pop();
    burst(wx + 40, wy + 82, 140, now);
  }

  // The entire audience: three large, readable foreground heads, three seats.
  // Each exact seat footprint becomes a rack on the same answer frame.
  const seats = [[663, 1009], [963, 1041], [1263, 1009]];
  for (let i = 0; i < seats.length; i++) {
    const [x, y] = seats[i];
    if (!fired) {
      box(x - 84, y - 65, 17, 91, '#252B37'); box(x + 65, y - 65, 17, 91, '#252B37');
      shape(rrPts(x - 101, y - 184, 202, 168, 27), '#623B48', 1.8);
      shape(rrPts(x - 89, y - 172, 178, 139, 22), '#84505A', 1.0);
    } else {
      push(); translate(x, y + Math.sin(dt * 26 + i) * 9 * Math.exp(-dt * 2));
      rotate(Math.sin(dt * 20 + i) * .045 * Math.exp(-dt * 2));
      const h = 354 + 34 * now;
      box(-113, -h, 226, h + 28, '#18212B', 2.2);
      box(-99, -h + 12, 198, h - 4, '#56616C', 1);
      for (let j = 0; j < 6; j++) {
        const sy = -h + 22 + j * 52;
        box(-86, sy, 172, 41, '#273344', .9);
        for (let v = 0; v < 3; v++) line([[-71, sy + 11 + v * 8], [34, sy + 11 + v * 8]], .8, '#111B29');
        shape(ellPts(66, sy + 21, 7, 7, 10), Math.sin(dt * 18 + j + i) > 0 ? '#FFD480' : '#CD734D', .4);
      }
      pop();
      burst(x, y - 235, 207, now, '#FFC878');
      // Steam, cables and sparks keep moving all the way to the hard cut.
      for (let j = 0; j < 4; j++) {
        const p = (dt * .8 + j / 4) % 1;
        paint(ellPts(x + Math.sin(dt * 5 + j + i) * 48, y - 363 - p * 190,
          23 + p * 33, 20 + p * 39, 14), { fill: '#C4B4A3', fillOp: 65 * (1 - p), ink: null });
      }
      line([[x + 91, y - 80], [x + 137 + 19 * Math.sin(dt * 13 + i), y - 116],
        [x + 140, y - 25], [x + 105 + 20 * Math.cos(dt * 10), y + 28]], 2.5, '#101822');
    }
  }
  // Draw launched bots above the racks so their silhouettes remain readable.
  for (let i = 0; i < seats.length; i++) {
    const [x, y] = seats[i];
    const flight = fired ? 67 + (655 + i * 38) * dt - 315 * dt * dt : 0;
    const bx = x + (fired ? (i - 1) * (16 + dt * 38) : Math.sin(t * 3 + i) * 5);
    const by = y - 71 - flight;
    push(); translate(bx, by); rotate(fired ? (i - 1) * (.18 + dt * .75) + .12 * Math.sin(dt * 9) : .025 * Math.sin(t * 4 + i)); scale(2.55);
    // Keep the helper's unit below 9: no badge text is ever queued.
    agentBot(0, 0, 8, r, { col: blue, dk: '#4C6482', lt: '#A8BAC9',
      eyes: fired ? 'scared' : r >= 203.20 ? 'narrow' : 'look', mouth: fired ? 'O' : 'flat',
      aL: fired ? 1.9 + Math.sin(dt * 15 + i) * .3 : .22,
      aR: fired ? 1.8 + Math.cos(dt * 14 + i) * .3 : .22,
      dy: 0, sq: fired ? -.1 * now : .04 * Math.sin(t * 4 + i), rot: 0, noShadow: true });
    pop();
    if (!fired) {
      shape(rrPts(x - 106, y - 83, 212, 89, 24), '#593B49', 1.6);
      box(x - 125, y - 94, 38, 24, '#A77969'); box(x + 87, y - 94, 38, 24, '#A77969');
    } else {
      for (let j = 0; j < 3; j++) line([[bx - 54 + j * 54, by + 27], [bx - 54 + j * 54, by + 70 + 30 * now]], 1.5, '#DBC29C');
    }
  }
  if (fired) {
    for (let i = 0; i < 27; i++) {
      const a = -Math.PI + hash(i + 12) * Math.PI;
      const speed = 210 + hash(i + 41) * 520;
      const x = 960 + Math.cos(a) * speed * dt;
      const y = 812 + Math.sin(a) * speed * dt + 155 * dt * dt;
      push(); translate(x, y); rotate(dt * (i % 2 ? 7 : -8) + i);
      shape([[-4, -15], [7, -3], [3, 14], [-7, 3]], i % 3 ? '#ED9A4C' : CREAM, .4);
      pop();
    }
    // Brief transparent impact wash preserves the transformation silhouettes.
    if (now > .65) paint(rectPts(-1600, -1500, 5200, 4100),
      { wash: '#FFE0A2', washOp: 90 * (now - .65) / .35, ink: null });
  }
  camEnd();
};
