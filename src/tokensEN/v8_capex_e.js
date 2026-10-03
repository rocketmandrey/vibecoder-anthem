// PRESS CONFERENCE 2.0. All choreography uses real seconds; safe to seek.
window.CAPEX_V = window.CAPEX_V || {};
CAPEX_V.e = function (r) {
  const INK = '#171C25', BLUE = '#7894B2', CREAM = '#FFE5AF';
  const shape = (p, c, sw = 1.2) => paint(p, { wash: c, ink: INK, sw });
  const box = (x, y, w, h, c, sw) => shape(rectPts(x, y, w, h), c, sw);
  const line = (p, w = 1.2, c = INK) => inkLine(p, w, c, 'ink', 0);
  // Full amplitude ON the answer frame, never a delayed impact crest.
  const hit = (at, life = .19) => r < at ? 0 : Math.exp(-(r - at) / life);
  const later = hit(202.26), how = hit(203.20), soon = hit(204.92);
  const now = hit(205.90, .24), extra = hit(206.40, .15) + hit(206.85, .16);
  const crashed = r >= 205.90, broken = r >= 204.92;
  const reveal = ease(seg(r, 204.28, 204.64)), cap = ease(seg(r, 205.24, 205.65));
  const age = Math.max(0, r - 205.90);
  function mic(x, y, a = 0, s = 1) {
    push(); translate(x, y); rotate(a); scale(s);
    shape(rrPts(-8, -42, 16, 61, 5), '#535B63');
    shape(ellPts(0, -51, 21, 25, 18), '#A4ABB0');
    for (let i = -2; i <= 2; i++) line([[-14, -51 + i * 7], [14, -51 + i * 7]], .5);
    pop();
  }
  function burst(x, y, k, rad = 95) {
    if (k < .025) return;
    paint(starPts(x, y, rad * k, .3, 9, r * .3), { wash: CREAM, ink: null });
    for (let i = 0; i < 7; i++) {
      const a = i * Math.PI * 2 / 7;
      line([[x + Math.cos(a) * rad * .8, y + Math.sin(a) * rad * .8],
        [x + Math.cos(a) * rad * (1 + .5 * k), y + Math.sin(a) * rad * (1 + .5 * k)]], 1.4 * k, CREAM);
    }
  }
  function camera(x, y, a) {
    push(); translate(x, y); rotate(a);
    shape(rrPts(-37, -25, 70, 50, 7), '#303943'); box(-22, -37, 28, 13, '#687580');
    shape(ellPts(31, 0, 24, 27, 16), INK); shape(ellPts(36, 0, 13, 18, 16), BLUE); pop();
  }
  // Native blue bot arms, arm-tip hand and held prop use the SAME transform.
  // Logical unit stays at 8 even in close-up, suppressing the native badge text.
  function reporter(x, y, size, questioner, phase) {
    const alarm = crashed || (questioner && r >= 202.26);
    const reach = .20 + .35 * ease(seg(r, 201.60, 202.10));
    push(); translate(x, y); scale(size);
    agentBot(0, 0, 8, r, {
      dance: 'idle', seed: phase, col: BLUE, dk: '#4B6482', lt: '#A4B9CB',
      dy: 0, sq: crashed ? .07 * Math.sin(age * 24 + phase) : 0,
      rot: crashed ? .14 * Math.sin(age * 17 + phase) : 0,
      walk: crashed ? r * 4 : null, noShadow: true,
      eyes: alarm ? 'scared' : 'narrow', mouth: alarm ? 'O' : 'o',
      aL: crashed ? 1.5 + .3 * Math.sin(age * 20) : .3,
      aR: questioner && !crashed ? reach : 1 + .4 * Math.sin(r * 7 + phase),
      armR: u => {
        if (questioner && r < 202.26) mic(0, 0, reach, .42);
        shape(rrPts(-.55 * u, -.6 * u, 1.25 * u, 1.2 * u, .25 * u), BLUE, .5);
        if (questioner && r >= 202.26) {
          for (let i = 0; i < 3; i++) box(.4 * u, (-.7 + i * .55) * u, .9 * u, .25 * u, BLUE, .25);
        } else line([[-2, -2], [4, -2]], .35, '#4B6482');
      }
    }); pop();
  }
  function rack(x, y, w, h, tilt, seed) {
    push(); translate(x, y); rotate(tilt);
    box(-w / 2, -h, w, h, '#121A24', 2);
    box(-w / 2 + 12, -h + 12, w - 24, h - 24, '#4B535D');
    for (let i = 0; i < 7; i++) {
      const yy = -h + 22 + i * (h - 34) / 7, hh = (h - 64) / 7;
      box(-w / 2 + 21, yy, w - 42, hh, '#232D38', .8);
      for (let j = 0; j < 3; j++) line([[-w / 2 + 30, yy + 9 + j * 8], [w / 2 - 52, yy + 9 + j * 8]], .5, '#101820');
      box(w / 2 - 40, yy + 10, 11, 9, Math.sin(r * 27 + i * 2 + seed) > 0 ? '#F99735' : '#748C87', .2);
    } pop();
  }
  function robot() {
    const dt = Math.max(0, r - 204.92);
    // Head to feet: 625 units, matching the podium + CEO silhouette.
    const parts = [[0, -550, 192, 128], [0, -350, 166, 220],
      [-126, -350, 54, 185], [126, -350, 54, 185], [-52, -120, 58, 200], [52, -120, 58, 200]];
    parts.forEach(([x, y, w, h], i) => {
      let dx = 0, dy = 0, a = 0;
      if (broken) {
        if (i === 0) {
          dx = 22 + 85 * dt;
          // Exact ballistic floor contact, then two diminishing bounces.
          const floor = 493, contact = (100 + Math.sqrt(10000 + 4800 * (floor + 48))) / 2400;
          dy = dt < contact ? -48 - 100 * dt + 1200 * dt * dt : floor - 108 * Math.abs(Math.sin((dt - contact) * 8)) * Math.exp(-(dt - contact) * 2);
          a = -.18 + dt * 2.4;
        } else if (i === 2 || i === 3) {
          dx = (i === 2 ? -1 : 1) * (28 + dt * 105);
          dy = Math.min(325, 36 + 580 * dt * dt); a = (i === 2 ? 1 : -1) * (.5 + dt * 3.4);
        } else {
          dx = (i % 2 ? -1 : 1) * dt * 24;
          dy = Math.min(-y - h / 2, 28 + dt * dt * 850); a = Math.sin(dt * 9 + i) * .12;
        }
      }
      push(); translate(1190 + x + dx, 722 + y + dy); rotate(a);
      shape(rrPts(-w / 2, -h / 2, w, h, 9), i === 1 ? '#A0A9AE' : '#C1C8C7', 1.5);
      box(-w / 2 + 10, -h / 2 + 10, w - 20, 12, '#E0DFCF', .4);
      if (i === 0) {
        for (const ex of [-43, 43]) box(ex - 10, -15, 20, broken ? 8 : 25, broken ? '#E85C3D' : '#7DABB0', .7);
        line([[-28, 32], [28, 32]], 1.5);
      }
      if (i === 1) {
        shape(ellPts(0, -16, 48, 48, 20), '#344A58');
        shape(ellPts(0, -16, 22 + 3 * Math.sin(r * 6), 22, 16), broken ? '#F99735' : '#A4D4CE');
      } pop();
    });
    if (broken) {
      line([[1170, 264], [1198, 287 + Math.sin(dt * 22) * 20], [1220, 259]], 2, '#E79356');
      burst(1190, 270, soon, 140);
    }
  }
  // Eased glides/whips between close shots; every key moves, including the end.
  const [cx, cy, z] = kf(r, [
    [201.60, [775, 413, 1.62]], [202.20, [806, 399, 1.72]],
    [202.46, [812, 382, 1.68]], [202.78, [831, 319, 1.77]],
    [203.19, [846, 310, 1.84]], [203.55, [858, 325, 1.78]],
    [204.05, [884, 346, 1.71]], [204.55, [1065, 397, 1.48]],
    [205.10, [1072, 419, 1.50]], [205.52, [1000, 450, 1.57]],
    [205.89, [982, 468, 1.61]], [206.17, [969, 554, 1.45]],
    [206.55, [943, 583, 1.53]], [206.94, [919, 612, 1.64]],
    [207.26, [900, 631, 1.76]]
  ]);
  const power = later + how + soon + 2.2 * now + extra;
  const shake = power * 8 + (crashed ? 2.8 : 0);
  camBegin(cx + Math.cos((r - 201.6) * 73) * shake,
    cy + Math.sin((r - 201.6) * 91) * shake, z * (1 + .065 * power));
  paint(rectPts(-1200, -1500, 4400, 4300), { wash: '#18212E', fill: '#27364D', fillOp: 45, tex: .6, ink: null });
  box(1030, -55, 425, 800, '#101820');
  if (reveal > 0) {
    paint([[1170, -40], [1250, -40], [1440, 743], [1025, 743]], { wash: '#B7C6BD', washOp: 65, ink: null });
    robot();
  }
  // Curtains compress into the alcove wings; no teleprompter crosses the robot.
  for (let i = 0; i < 22; i++) {
    const x = 160 + i * 65, alcove = x >= 1005 && x <= 1460;
    const target = x < 1230 ? 990 + (x - 1005) * .15 : 1455 + (x - 1230) * .15;
    const xx = alcove ? lerp(x, target, reveal) : x, w = alcove ? lerp(67, 12, reveal) : 67;
    shape([[xx, -700], [xx + w, -700], [xx + w - 4, 745], [xx - 7, 739]], i % 2 ? '#304159' : '#27364D', .55);
    if (!alcove) line([[x + 15, -650], [x + 7, 724]], .8, '#182637');
  }
  box(-300, 746, 2300, 950, '#343338'); box(-300, 739, 2300, 24, '#76604F');
  // Blank monitor on the LEFT; HOW kicks it down and starts a wordless spinner.
  push(); translate(730, 208 + 24 * how); rotate(-.045 * how);
  box(-7, 104, 14, 355, '#535B63'); box(-73, 453, 146, 17, '#444C56');
  box(-156, -136, 312, 250, '#525A64', 1.8); box(-141, -121, 282, 220, '#141C26');
  if (r >= 203.20) {
    for (let i = 0; i < 10; i++) {
      const a = i * Math.PI / 5 + (r - 203.20) * 6;
      shape(ellPts(Math.cos(a) * 65, -10 + Math.sin(a) * 65, 9, 9, 10), mixCol('#39434E', '#E0E5E8', i / 9), .2);
    }
  } else line([[-115, -95], [-68, -107]], .8, '#617080');
  pop(); burst(730, 200, how * .55, 125);
  const flee = easeOut(seg(r, 205.90, 207.26));
  reporter(596 - 90 * flee, 659 + (crashed ? 100 + 20 * Math.sin(age * 20) : 0), 2.65, true, 2);
  if (r >= 202.26 && r < 202.90) {
    const d = r - 202.26;
    // Hand's release position is (740,539); prop snaps 42 units upwards.
    mic(740 + d * 210, 497 - d * 960 + d * d * 450, -.3 - d * 8, 1.11);
    line([[735, 535], [767 + d * 160, 454 - d * 650], [838, 381]], 1.7);
    burst(740, 535, later, 75);
  }
  ceoClawd(905 + (crashed ? 8 * Math.sin(age * 9) : 0),
    crashed ? 819 + 8 * Math.sin(age * 12) : 518 + 3 * Math.sin(r * 6), crashed ? 25 : 28, {
      noClicker: true, noShadow: true, eyes: 'narrow',
      mouth: crashed ? 'O' : r >= 203.20 && r < 204.28 ? 'flat' : 'smile',
      aL: crashed ? 1.5 : .25 + later * 1.2, aR: crashed ? 1.5 : .3 + reveal * .3 + cap * .9,
      sq: .12 * later + .13 * how + .17 * soon + .23 * now,
      rot: crashed ? .045 * Math.sin(age * 19) : -.03 * soon
    });
  if (!crashed) {
    box(740, 518, 330, 251, '#665247', 1.8); box(760, 552, 289, 200, '#735E50', .7);
    for (let i = 0; i < 5; i++) line([[784 + i * 51, 562], [780 + i * 51, 744]], .5, '#514138');
    for (let i = 0; i < 4; i++) {
      const x = 776 + i * 61, y = 478 + i % 2 * 12;
      line([[x + 15, 523], [x, y]], 1.8); mic(x, y, (i - 1.5) * .17, .57);
    }
    box(725, 513, 364, 29, '#8C7461', 1.7); box(1050, 488, 80, 23, '#222A34');
    shape(ellPts(1090, 483, 29, 18, 20), '#E54B3C');
    if (cap > 0) {
      const y = 409 - 20 * Math.sin(cap * Math.PI);
      line([[1026, 403], [1060, y - 18], [1090, y]], 6);
      shape(ellPts(1090, y, 25, 14, 18), '#EC985E');
    }
  }
  // A horizontal rack lands EXACTLY on NOW. Clawd ducks beneath its lower edge.
  if (r >= 205.68) {
    const fall = easeIn(seg(r, 205.68, 205.90));
    const bounce = crashed ? -20 * Math.exp(-age * 5) * Math.abs(Math.sin(age * 20)) : 0;
    rack(665, lerp(-780, 510, fall) + bounce, 210, 660, Math.PI / 2 + (crashed ? .015 * Math.sin(age * 16) : 0), 1);
  }
  if (crashed) {
    burst(1065, 520, now, 235);
    // Button contact remains visible for the impact, before flying away.
    const buttonX = 1090 + age * 95, buttonY = 496 - age * 150 + age * age * 340;
    box(buttonX - 40, buttonY, 80, 20, '#222A34');
    shape(ellPts(buttonX, buttonY - 3, 31, 7, 18), '#E54B3C');
    if (age < .12) shape(ellPts(buttonX, buttonY - 12, 25, 12, 18), '#EC985E');
    for (let i = 0; i < 8; i++) {
      const x = 900 + (i - 3.5) * (38 + age * 88);
      const y = Math.min(865 + i % 2 * 32, 570 - (130 + hash(i) * 240) * age + 670 * age * age);
      push(); translate(x, y); rotate((i - 3) * (.15 + age * 1.9));
      shape([[-43, -13], [34, -22], [52, 8], [-25, 24]], i % 2 ? '#8C7461' : '#665247'); pop();
    }
    mic(760 - age * 120, 590 - age * 230 + age * age * 330, age * 6, .8);
    // Each additional rack finishes its fall on the requested beat and recoils.
    for (const [at, x, tilt, seed] of [[206.40, 1240, -.08, 3], [206.85, 594, .09, 5]]) {
      if (r < at - .21) continue;
      const q = easeIn(seg(r, at - .21, at)), dt = Math.max(0, r - at);
      const recoil = r >= at ? Math.abs(Math.sin(dt * 24)) * 22 * Math.exp(-dt * 5) : 0;
      rack(x, lerp(-650, 916, q) - recoil, 216, 815, tilt + .018 * Math.sin(dt * 18) * hit(at, .35), seed);
      burst(x, 885, hit(at), 145);
    }
    // Three independent spark waves: the final wave keeps moving past the cut.
    for (const at of [205.90, 206.40, 206.85]) {
      const dt = r - at; if (dt < 0 || dt > 1.4) continue;
      const ox = at === 205.90 ? 1040 : at === 206.40 ? 1200 : 640;
      for (let i = 0; i < 13; i++) {
        const vx = (hash(i + at) - .5) * 900, vy = -180 - hash(i + 9) * 490;
        const x = ox + vx * dt, y = 735 + vy * dt + 450 * dt * dt;
        line([[x, y], [x - vx * .035, y - (vy + 900 * dt) * .035]], 1.8, i % 3 ? '#FFB34D' : CREAM);
      }
    }
    for (let i = 0; i < 3; i++) {
      const x = 816 + i * 97;
      line([[x, 596], [x + Math.sin(age * 13 + i) * 22, 621], [x + 20, 649 + Math.sin(age * 17 + i) * 14]], 1.6, '#101820');
      if (Math.sin(r * 39 + i * 2) > .3) burst(x + 20, 639, .22, 62);
    }
  }
  // Native foreground bots scramble and jostle their cameras throughout the tail.
  reporter(705 - flee * 65, 1000 + 22 * Math.sin(r * (crashed ? 17 : 3)), 2.7, false, 5);
  reporter(1244 - flee * 85, 991 + 24 * Math.sin(r * (crashed ? 19 : 3)), 2.8, false, 8);
  camera(765 - flee * 205, 825 + (crashed ? Math.sin(age * 11) * 48 : 0), -.15 - age * .9);
  camera(1155 + flee * 210, 811 + (crashed ? Math.sin(age * 14) * 44 : 0), .1 + age);
  const exposure = .16 * hit(202.26, .035) + .18 * hit(203.20, .035) + .2 * hit(204.92, .04)
    + .34 * hit(205.90, .045) + .13 * hit(206.40, .035) + .13 * hit(206.85, .035);
  if (exposure > .005) paint(rectPts(-1200, -1500, 4400, 4300), { wash: CREAM, washOp: 255 * exposure, ink: null });
  camEnd();
};
