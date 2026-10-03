// MISSION CONTROL. Stateless choreography in real track seconds.
window.CAPEX_V = window.CAPEX_V || {};
CAPEX_V.c = function (r) {
  const C = { ink: '#171C25', wall: '#27364D', steel: '#667687', blue: '#7894B2',
    paper: '#E5DCC8', gold: '#E8AA38', red: '#DE4937', orange: '#EF8950' };
  const shape = (p, c, sw = 1.2) => paint(p, { wash: c, ink: C.ink, sw });
  const box = (x, y, w, h, c, sw) => shape(rectPts(x, y, w, h), c, sw);
  const oval = (x, y, a, b, c, sw) => shape(ellPts(x, y, a, b, 24), c, sw);
  const line = (p, w = 2, c = C.ink) => inkLine(p, w, c, 'ink', 0);
  const hit = t => r >= t ? Math.exp(-(r - t) * 19) : 0;
  const later = hit(202.26), how = hit(203.20), soon = hit(204.92), now = hit(205.90);
  const impact = later + how + soon + 1.8 * now;
  const launch = Math.max(0, r - 205.90), lift = 365 * launch * launch;
  const view = kf(r, [
    [201.60, [973, 393, 1.44]], [202.25, [1014, 410, 1.58]],
    [202.48, [1050, 438, 1.48]], [202.80, [995, 416, 1.53]],
    [203.19, [1030, 425, 1.59]], [203.65, [1000, 472, 1.48]],
    [204.12, [982, 440, 1.49]], [204.50, [1075, 396, 1.48]],
    [205.10, [1090, 430, 1.56]], [205.48, [990, 443, 1.65]],
    [205.90, [1007, 457, 1.70]], [206.24, [1010, 489, 1.10]],
    [206.75, [1000, 426, .98]], [207.26, [995, 318, .96]]
  ]);
  camBegin(view[0] + impact * 9 * Math.cos(launch * 67),
    view[1] + impact * 6 * Math.sin((r - 201.6) * 73), view[2] * (1 + .035 * impact));
  // Unbounded night wash; the pad and its rocket never inherit the building's lift.
  paint([[-5000, -5000], [6000, -5000], [6000, 5000], [-5000, 5000]], { wash: '#121D2B', ink: null });
  for (let i = 0; i < 18; i++) oval(350 + hash(i) * 1450, -550 + hash(i + 30) * 1100, 2, 2, '#9EA9B6', .1);
  box(200, 718, 1800, 1300, '#343A43');
  line([[220, 719], [1900, 719]], 3, '#6E7880');
  function rocket(x, y, s) {
    push(); translate(x, y); scale(s);
    shape([[-35, 0], [-35, -126], [0, -184], [35, -126], [35, 0]], C.paper, 2);
    shape([[-35, -46], [-64, 6], [-31, 0]], C.red);
    shape([[35, -46], [64, 6], [31, 0]], C.red);
    shape([[-35, -126], [0, -184], [35, -126]], C.red);
    oval(0, -94, 19, 24, '#273C52'); oval(-5, -100, 6, 9, '#92B6C5', .4);
    box(-23, 0, 46, 14, C.ink); pop();
  }
  box(1260, 705, 230, 22, C.steel); rocket(1370, 701, .92);
  // Exhaust is behind the room, and already has substantial length on the NOW frame.
  if (r >= 205.90) {
    for (let i = 0; i < 9; i++) {
      const p = (launch * .85 + i / 9) % 1;
      oval(655 + i * 90 + Math.sin(i * 3 + r * 4) * 26, 845 + p * 400,
        55 + p * 115, 35 + p * 68, i % 2 ? '#8E9292' : '#58616D', .6);
    }
    for (const x of [690, 1000, 1310]) {
      const base = 850 - lift, f = 245 + launch * 180 + 44 * Math.sin(r * 37 + x);
      shape([[x - 66, base], [x + 64, base], [x + 83, base + f * .4],
        [x + 30, base + f * .64], [x + 9, base + f], [x - 31, base + f * .69],
        [x - 77, base + f * .45]], C.red, 1.4);
      shape([[x - 38, base], [x + 40, base], [x + 22, base + f * .55],
        [x - 4, base + f * .8], [x - 29, base + f * .42]], '#FFC269', .6);
      oval(x, base + 12, 42, 24, '#FFF0BD', .4);
    }
  }
  push(); translate(r >= 205.90 ? Math.sin(launch * 39) * 5 : 0, -lift);
  // Cutaway control-room shell: the right-hand window is genuinely open onto the pad.
  box(480, -30, 720, 825, C.wall, 3);
  box(1200, -30, 310, 135, C.wall, 3);
  box(1470, 105, 40, 690, C.wall, 3);
  box(1200, 730, 270, 65, C.wall, 3);
  box(505, -5, 980, 38, '#465468');
  box(1200, 105, 270, 14, C.steel, 2);
  box(1200, 105, 14, 625, C.steel, 2);
  box(1456, 105, 14, 625, C.steel, 2);
  box(1200, 716, 270, 14, C.steel, 2);
  // No painted glass: the same world-space rocket is visible through this opening.
  line([[1330, 121], [1330, 710]], 4, C.steel);
  // Dark, entirely pictorial radar: rings, a sweeping spoke, and blips only.
  box(545, 62, 600, 260, C.ink, 2);
  for (const rad of [40, 77, 114]) paint(ellPts(840, 192, rad, rad, 40), { ink: '#425B65', sw: .7 });
  line([[726, 192], [954, 192]], .5, '#425B65');
  const scan = r * 1.7;
  line([[840, 192], [840 + 113 * Math.cos(scan), 192 + 113 * Math.sin(scan)]], 2, '#90B5AC');
  for (let i = 0; i < 4; i++) oval(766 + i * 51, 142 + (i % 3) * 43, 5, 5, '#AEC8AA', .2);
  function bot(x, y, s, pump = false) {
    push(); translate(x, y); scale(s);
    agentBot(0, 0, 8, r, { dx: 0, dy: pump ? Math.sin(r * 36) * .5 : Math.sin(r * 5) * .12,
      sq: pump ? .08 * Math.sin(r * 36) : 0, rot: 0, noShadow: true,
      eyes: pump || launch > 0 ? 'scared' : 'narrow', mouth: pump ? 'O' : 'flat',
      aL: pump ? -.4 : .2, aR: pump ? -.4 : .6 + .2 * Math.sin(r * 7),
      col: C.blue, dk: '#4B6482', lt: '#A4B9CB' }); pop();
  }
  bot(580, 661, 1.7); bot(1407, 663, 1.65);
  for (const x of [493, 1310]) {
    shape([[x, 639], [x + 160, 639], [x + 190, 706], [x - 12, 706]], '#526274');
    box(x - 12, 706, 202, 72, '#303C4C');
    for (let i = 0; i < 4; i++) oval(x + 20 + i * 35, 677, 7, 5, i % 2 ? C.gold : '#A9C4BB', .5);
  }
  ceoClawd(794, 621, 27, { noClicker: true, noShadow: true, eyes: 'narrow',
    mouth: how > .1 ? 'O' : 'flat', aL: .2 + .09 * Math.sin(r * 6),
    aR: r >= 205.24 ? .25 : .7 + .12 * Math.sin(r * 7), sq: .09 * impact });
  box(665, 626, 580, 150, '#394653', 2);
  shape([[665, 626], [706, 580], [1215, 580], [1245, 626]], '#73808A', 2);
  function coin(x, y, rad, spin = 0) {
    const w = rad * (.55 + .45 * Math.abs(Math.cos(spin)));
    oval(x, y, w, rad, C.gold, 1.5);
    paint(ellPts(x, y, w * .72, rad * .73, 24), { ink: '#A86B2E', sw: .8 });
    line([[x - w * .38, y - rad * .4], [x - w * .15, y - rad * .56]], 1.3, '#FFE0A0');
  }
  function burst(x, y, k, size = 95) {
    if (k > .025) shape(starPts(x, y, size * k, .42, 9, r * .2), '#FFE2A0', .6);
  }
  // REVENUE: a telescoping dock recoils immediately; the coin continues through empty air.
  if (r < 202.60) {
    const dt = Math.max(0, r - 202.26), retract = r >= 202.26 ? .62 + .38 * easeOut(dt / .16) : 0;
    const px = 1090 + 270 * retract;
    for (let i = 3; i >= 0; i--) box(px + i * 37, 362 + i * 5, 65, 124 - i * 10, '#697887');
    oval(px, 423, 34, 77, C.steel, 2); oval(px - 3, 423, 21, 57, C.ink);
    const cx = r < 202.26 ? lerp(864, 1038, seg(r, 201.60, 202.26)) : 1038 + dt * 270;
    coin(cx, 423 + (r < 202.26 ? Math.sin(seg(r, 201.60, 202.26) * Math.PI) * -23 : 480 * dt * dt), 35, r * 4);
    burst(1083, 423, later, 95);
    if (dt > 0) for (let i = 0; i < 3; i++) line([[1095, 369 + i * 52], [px - 44, 369 + i * 52]], 1, C.paper);
  }
  // PROFIT: Clawd places one coin; the rocket's pan shears the beam at HOW.
  if (r >= 202.60 && r < 204.28) {
    const dt = Math.max(0, r - 203.20), broken = r >= 203.20;
    box(1025, 447, 19, 130, C.steel); shape([[985, 578], [1086, 578], [1040, 546]], C.steel);
    for (const side of [-1, 1]) {
      push(); translate(1035 + (broken ? side * (15 + dt * 100) : 0), 443 + (broken ? 18 + dt * dt * 160 : 0));
      rotate(broken ? side * (.22 + dt * 1.8) : .06 * Math.sin(r * 8));
      box(side < 0 ? -126 : 8, -9, 118, 18, C.gold);
      const x = side * 119;
      line([[x, 0], [x - 43, 82], [x + 43, 82], [x, 0]], 1.2, C.paper);
      shape([[x - 55, 82], [x + 55, 82], [x + 33, 103], [x - 33, 103]], C.steel);
      if (side > 0) rocket(x, 78, .65);
      else coin(x, 62 - 54 * (1 - easeOut(seg(r, 202.60, 202.97))), 27, dt * 9);
      pop();
    }
    if (!broken) {
      const p = easeOut(seg(r, 202.60, 202.97));
      line([[914, 499], [919, 445 - 32 * p], [921, 420 + 42 * p]], 7, C.orange);
    }
    burst(1035, 443, how, 120);
    if (broken) for (let i = 0; i < 5; i++) {
      push(); translate(1035 + (i - 2) * (17 + dt * 95), 442 - dt * (140 + i * 17) + dt * dt * 270);
      rotate(i + dt * 8); box(-10, -5, 20, 10, C.gold); pop();
    }
  }
  // A-G-I: open hatch, heroic pilot silhouette, then a violent balloon collapse.
  if (r >= 204.28 && r < 205.40) {
    const open = easeOut(seg(r, 204.28, 204.48)), deflate = r >= 204.92;
    const dt = Math.max(0, r - 204.92), squish = deflate ? .28 + .08 * Math.sin(dt * 36) : 1;
    box(969, 319, 220, 267, '#131E2B', 2);
    paint(ellPts(1079, 438, 99, 125), { wash: '#739793', fill: '#AECBBC', fillOp: 70, ink: null });
    push(); translate(1080 + (deflate ? Math.sin(dt * 31) * 18 : 0), 563); scale(deflate ? 1.22 : 1, squish);
    oval(0, -178, 43, 47, '#DBE4C5'); oval(0, -180, 30, 19, '#688D90');
    shape([[-34, -136], [-62, -114], [-68, -49], [-47, -43], [-30, -89], [-29, -14],
      [-8, -14], [0, -58], [12, -14], [34, -14], [29, -90], [48, -43], [67, -48], [59, -118], [34, -136]], '#DBE4C5', 1.5);
    line([[0, -134], [0, -64]], 1, '#7D9A90'); pop();
    shape([[961, 310], [961 + 198 * (1 - open), 310 - open * 25],
      [961 + 198 * (1 - open), 592 - open * 25], [961, 592]], C.steel, 2);
    if (deflate) {
      burst(1090, 398, soon, 125);
      const stroke = (1 + Math.sin(dt * 36)) / 2;
      bot(1244, 580, 1.9, true);
      line([[1100, 560], [1140, 593], [1192, 581], [1192, 547]], 3, C.ink);
      box(1177, 503, 29, 76, C.red); box(1166, 578, 54, 10, C.ink);
      line([[1192, 512], [1192, 446 + stroke * 50]], 3, C.paper);
      line([[1166, 446 + stroke * 50], [1218, 446 + stroke * 50]], 5, C.ink);
      line([[1217, 475 + stroke * 22], [1192, 446 + stroke * 50]], 6, C.blue);
      for (let i = 0; i < 3; i++) line([[1117, 504 + i * 15], [1144 + dt * 20, 488 + i * 16]], 1, C.paper);
    }
  }
  // CAPEX: immediate palm contact and depressed button, no easing delay on the answer.
  if (r >= 205.24) {
    const slam = r >= 205.90;
    box(973, 559, 177, 40, C.ink, 2);
    oval(1060, slam ? 568 : 546, 69, slam ? 13 : 32, C.red, 2);
    if (!slam) oval(1043, 532, 28, 7, '#F88161', .3);
    const hy = slam ? 551 - 17 * easeOut(launch / .35) : 426 - 24 * Math.sin(seg(r, 205.24, 205.90) * Math.PI);
    line([[918, 499], [976, hy - 20], [1058, hy]], 15, C.ink);
    line([[918, 499], [976, hy - 20], [1058, hy]], 11, '#28272C');
    oval(1060, hy, slam ? 51 : 37, slam ? 16 : 24, C.orange, 2);
    burst(1060, 585, now, 130);
    if (slam) for (let i = 0; i < 7; i++) {
      const p = (launch * 1.1 + i * .13) % 1;
      push(); translate(625 + i * 116 + Math.sin(r * 6 + i) * 13, 672 - p * 180);
      rotate(launch * (i % 2 ? 3 : -3)); box(-12, -16, 24, 32, C.paper, .6); pop();
    }
  }
  // Foundation and giant booster bells belong to the room, never to the parked rocket.
  box(463, 778, 1064, 43, '#687582', 2.5);
  for (const x of [690, 1000, 1310]) {
    shape([[x - 42, 820], [x + 42, 820], [x + 71, 861], [x - 71, 861]], '#303946', 2);
    oval(x, 861, 71, 14, launch > 0 || r === 205.90 ? '#FFC269' : C.ink);
  }
  pop();
  // Local impact flashes preserve silhouettes and cover the tall reels frame.
  if (impact > .05) paint([[-5000, -5000], [6000, -5000], [6000, 5000], [-5000, 5000]],
    { wash: '#FFD29A', washOp: 24 * Math.min(1.5, impact), ink: null });
  camEnd();
};
