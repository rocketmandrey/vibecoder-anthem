// Investor dinner. All choreography uses real track time; no persistent frame state.
window.CAPEX_V = window.CAPEX_V || {};
CAPEX_V.a = function (r) {
  const C = { ink: '#171C25', wall: '#202B3B', iron: '#434C55', silver: '#AEB9BF',
    light: '#E9E4D5', blue: '#7894B2', wood: '#80604B', orange: '#E79559', fire: '#ED6837' };
  const poly = (p, c, sw = 1.4) => paint(p, { wash: c, ink: C.ink, sw });
  const box = (x, y, w, h, c, sw) => poly(rectPts(x, y, w, h), c, sw);
  const oval = (x, y, rx, ry, c, sw) => poly(ellPts(x, y, rx, ry, 24), c, sw);
  const line = (p, w = 1.5, c = C.light) => inkLine(p, w, c, 'ink', 0);
  // One-sided impulses: full strength on the answer frame, never a pre-echo.
  const hit = (t, life) => r < t ? 0 : Math.exp(-(r - t) / life);
  const later = hit(202.26, .13), how = hit(203.20, .18);
  const soon = hit(204.92, .12), now = hit(205.90, .20);
  const dt = Math.max(0, r - 205.90), chomp = r >= 205.90;
  const under = r >= 204.92 && r < 205.24;
  const [cx, cy, z] = under
    ? kf(r, [[204.92, [1000, 900, 1.75]], [205.10, [1028, 885, 1.81]], [205.24, [990, 537, 1.38]]])
    : kf(r, [[201.60, [800, 545, 1.35]], [202.20, [858, 558, 1.43]],
      [202.45, [900, 555, 1.38]], [202.80, [1010, 488, 1.48]],
      [203.18, [1030, 472, 1.53]], [203.55, [1000, 500, 1.45]],
      [203.95, [1022, 480, 1.50]], [204.40, [1030, 525, 1.58]],
      [204.91, [1038, 543, 1.65]], [205.24, [990, 537, 1.38]],
      [205.65, [964, 562, 1.30]], [205.89, [960, 580, 1.13]],
      [206.25, [963, 576, 1.10]], [206.72, [938, 600, 1.14]],
      [207.26, [977, 565, 1.20]]]);
  const j = later * 7 + how * 9 + soon * 8 + now * 22;
  camBegin(cx + Math.cos((r - 205.90) * 79) * j,
    cy + Math.sin((r - 205.90) * 93) * j, z + later * .10 + how * .13 + soon * .10 + now * .17);
  // Overscan background first, including the low-angle insert.
  paint([[-2400, -2200], [4200, -2200], [4200, 3400], [-2400, 3400]],
    { wash: C.wall, fill: '#121C2B', fillOp: 65, tex: .5, ink: null });
  box(-1500, 1010, 5000, 1800, '#302C30');
  for (let i = 0; i < 7; i++) {
    const x = 80 + i * 300;
    box(x, -800, 24, 1810, '#151F2C');
    line([[x + 30, 120], [x + 260, 120], [x + 260, 1010]], 1, '#374354');
  }
  function lamp(x, y, phase) {
    const a = Math.sin(r * 2.3 + phase) * .035 + now * Math.sin(dt * 23 + phase) * .20;
    push(); translate(x, y - 330); rotate(a);
    line([[0, -600], [0, 285]], 3, C.ink);
    poly([[-42, 280], [42, 280], [77, 350], [-77, 350]], C.iron);
    oval(0, 350, 71, 17, C.fire);
    paint([[-67, 365], [67, 365], [210, 1050], [-210, 1050]],
      { wash: '#D49855', washOp: 15, ink: null });
    for (let i = -1; i <= 1; i++) box(i * 28 - 4, 291, 8, 43, '#EE9D53', .5);
    pop();
  }
  lamp(625, 110, 0); lamp(1110, 75, 2); lamp(1560, 140, 4);
  function fork(x, y, a, s = 1) {
    push(); translate(x, y); rotate(a); scale(s);
    line([[0, 25], [0, -30]], 3.5, C.silver);
    line([[-12, -52], [-12, -29], [12, -29], [12, -52]], 2.5, C.silver);
    line([[0, -52], [0, -29]], 2.5, C.silver); pop();
  }
  function plate(x, y, s = 1) {
    oval(x, y, 72 * s, 19 * s, C.light);
    oval(x, y, 54 * s, 11 * s, '#B8C2C4', .7);
  }
  function lid(x, y, s = 1, tilt = 0) {
    push(); translate(x, y); rotate(tilt); scale(s);
    const p = [];
    for (let i = 0; i <= 20; i++) {
      const a = Math.PI + i / 20 * Math.PI;
      p.push([Math.cos(a) * 104, Math.sin(a) * 99]);
    }
    poly(p, C.silver, 2);
    poly([[-75, -20], [-65, -58], [-35, -80], [-17, -84], [-35, -50], [-41, -20]], '#DEE4DF', .4);
    oval(0, -104, 17, 9, C.iron); box(-112, -7, 224, 15, '#77858E'); pop();
  }
  function burst(x, y, k, col = C.light) {
    if (k < .03) return;
    for (let i = 0; i < 9; i++) {
      const a = i * Math.PI * 2 / 9;
      line([[x + Math.cos(a) * 72, y + Math.sin(a) * 55],
        [x + Math.cos(a) * (72 + k * 85), y + Math.sin(a) * (55 + k * 65)]], 2.2 * k, col);
    }
  }
  // Same pedestal and orange foot above/below the cloth make the trick legible.
  const rock = Math.sin((r - 204.28) * 24) * .085;
  if (under) {
    box(540, 595, 860, 35, C.wood, 2.5);
    poly([[500, 465], [1460, 465], [1460, 710], [1330, 735], [1200, 697],
      [1080, 721], [945, 676], [810, 714], [640, 687], [500, 730]], '#C2B5A0', 2);
    box(620, 630, 38, 490, C.wood); box(1390, 630, 38, 490, C.wood);
    push(); translate(1110, 1050); rotate(rock);
    box(-17, -470, 34, 470, C.silver); oval(0, 0, 120, 22, C.iron);
    oval(0, -438, 91, 22, C.silver); pop();
    // Black trouser cuff into a blunt orange Clawd foot, visibly contacting the base.
    const toe = 16 * Math.sin((r - 204.28) * 24);
    poly([[815, 670], [880, 665], [940, 931 + toe], [881, 958 + toe]], '#171C25', 2);
    poly([[878, 925 + toe], [938, 915 + toe], [1046, 989 + toe], [1060, 1028 + toe],
      [908, 1030 + toe], [875, 995 + toe]], C.orange, 2.5);
    line([[914, 1009 + toe], [1045, 1009 + toe]], 2, '#A8583D');
    burst(1070, 1020, soon, '#F6C47E');
    line([[1160, 840], [1180, 884], [1162, 928]], 2, C.silver);
    camEnd(); return;
  }
  function investor(x, y, side) {
    const turn = r >= 202.26 && r < 202.70 ? .14 + later * .12 : 0;
    const gasp = r >= 203.20;
    const bob = Math.sin(r * 4 + side) * 3 + (chomp ? Math.sin(dt * 17 + side) * 9 * Math.exp(-dt * .9) : 0);
    box(x - 75, y - 130, 150, 205, '#493F3D');
    box(x - 70, y + 65, 16, 150, C.wood); box(x + 54, y + 65, 16, 150, C.wood);
    push(); translate(x, y + bob); scale(2.8);
    // agentBot's native size stays below nine: no lettering is emitted.
    agentBot(0, 0, 8, r, { dance: 'idle', dx: 0, dy: 0, sq: -.1 * how + now * .12,
      rot: turn, col: C.blue, dk: '#4A617B', lt: '#A6BCCB', noShadow: true,
      eyes: gasp ? 'scared' : 'look', lookX: turn ? 1 : side, mouth: gasp ? 'O' : 'o',
      aL: .3, aR: .8, armR: () => fork(0, 0, -.65, .35) });
    pop();
  }
  investor(626, 690, 1); investor(1320, 690, -1);
  const lift = ease(seg(r, 202.60, 203.18));
  ceoClawd(1020, 532 + Math.sin(r * 3) * 3, 27, {
    noClicker: true, noShadow: true, eyes: 'narrow', mouth: r >= 203.20 && r < 204.10 ? 'O' : 'smile',
    aL: .25 + .75 * lift, aR: .15, sq: how * -.08 + now * .12 });
  // Long banquet table; the hit removes the entire slab and cloth on the same frame.
  if (!chomp) {
    box(530, 726, 34, 325, C.wood); box(1370, 726, 34, 325, C.wood);
    poly([[520, 618], [1380, 618], [1450, 760], [450, 760]], C.wood, 2.5);
    poly([[520, 625], [1380, 625], [1440, 755], [1430, 905], [1290, 884],
      [1150, 924], [990, 890], [820, 919], [660, 885], [465, 910], [460, 755]], '#C5B9A5', 1.8);
    line([[480, 759], [1410, 759]], 1.4, '#938578');
    for (let i = 0; i < 6; i++) line([[560 + i * 155, 785], [553 + i * 155, 865]], .8, '#A49786');
    plate(634, 670); plate(1290, 670);
  }
  // First service: rolls in gently, then snaps sideways and races past the diners.
  if (r < 202.80) {
    const a = Math.max(0, r - 202.26);
    const x = r < 202.26 ? lerp(410, 790, easeOut(seg(r, 201.60, 202.26))) : 870 + a * 2800;
    push(); translate(x, 785 + (r >= 202.26 ? -30 - 60 * easeOut(a / .2) : 0));
    rotate(r >= 202.26 ? -.16 * Math.exp(-a * 4) : .01 * Math.sin(r * 9));
    box(-128, 0, 256, 19, C.silver); box(-112, 20, 13, 146, C.iron); box(99, 20, 13, 146, C.iron);
    box(-120, 111, 240, 13, C.silver);
    for (const wx of [-100, 100]) {
      oval(wx, 168, 24, 24, C.ink);
      const spin = r * (r >= 202.26 ? 35 : 9);
      line([[wx - Math.cos(spin) * 16, 168 - Math.sin(spin) * 16],
        [wx + Math.cos(spin) * 16, 168 + Math.sin(spin) * 16]], 2, C.silver);
    }
    lid(0, -10, 1.05);
    for (let i = 0; i < 3; i++) {
      const ph = (r * 1.6 + i / 3) % 1;
      line([[-35 + i * 34, -130 - ph * 50], [-48 + i * 34 + Math.sin(r * 8 + i) * 12, -165 - ph * 50],
        [-30 + i * 34, -192 - ph * 50]], 1.2, '#ABB7BE');
    }
    pop();
    if (r >= 202.26) {
      for (let i = 0; i < 5; i++) line([[600 + a * 400, 730 + i * 34], [950 + a * 1500, 710 + i * 34]], 2 * later + .5, C.silver);
      burst(790, 758, later);
    }
  }
  // Second service: the lifted cover reveals an abyss, with the dropped fork swallowed.
  if (r >= 202.60 && r < 204.20) {
    plate(1035, 667, 1.55);
    if (r >= 203.20) {
      oval(1035, 665, 104 + 16 * how, 36 + 8 * how, '#080C15', 2.5);
      const a = r - 203.20;
      for (let i = 0; i < 3; i++) {
        const q = (a * 1.8 + i / 3) % 1;
        paint(ellPts(1035, 665, 105 * (1 - q), 34 * (1 - q), 30), { ink: '#455366', sw: .7 });
      }
      if (a < .40) fork(1020 + a * 35, 601 + a * 150, .25 + a * 5, 1 - ease(seg(a, .13, .40)));
      burst(1035, 655, how);
    } else fork(1047, 568, -.3, 1);
    // The lid stays attached to the raised hand via a clear orange forearm.
    const ly = 650 - lift * 245, lx = 1025 - lift * 170;
    line([[890, 421], [lx - 22, ly - 112], [lx, ly - 108]], 11, C.ink);
    line([[890, 421], [lx - 22, ly - 112], [lx, ly - 108]], 7, C.orange);
    lid(lx, ly, 1.12, -.22 * lift);
  }
  // Third service: a silver egg, visibly one unhatched piece, on its rocking pedestal.
  if (r >= 204.20 && r < 205.24) {
    push(); translate(1045, 687); rotate(rock);
    oval(0, 0, 83, 18, C.iron); box(-13, -65, 26, 65, C.silver);
    oval(0, -65, 72, 16, C.silver);
    const egg = [];
    for (let i = 0; i < 32; i++) {
      const a = i / 32 * Math.PI * 2;
      egg.push([Math.cos(a) * 65 * (1 + .18 * Math.sin(a)), -153 + Math.sin(a) * 91]);
    }
    poly(egg, C.silver, 2);
    line([[-30, -201], [-42, -172], [-40, -137]], 5, '#E6E8E1'); pop();
    line([[941, 493], [932, 532], [943, 568]], 2, C.silver);
    line([[1141, 494], [1154, 531], [1144, 566]], 2, C.silver);
  }
  if (r >= 205.24) {
    // Dessert unfolds before the answer; its teeth make contact EXACTLY at 205.90.
    const unfold = ease(seg(r, 205.60, 205.89));
    const width = chomp ? 855 - 35 * easeOut(dt / .7) : lerp(120, 855, unfold);
    const chew = chomp ? Math.pow(Math.sin(dt * 10), 2) * (22 + 22 * Math.exp(-dt * 2)) : 0;
    const gap = chomp ? chew : 16 + unfold * 200;
    const yy = 730 + (chomp ? Math.sin(dt * 12) * 6 : 0), hh = lerp(65, 108, unfold);
    push(); translate(960, yy); rotate(chomp ? Math.sin(dt * 9) * .018 : 0);
    box(-width / 2, -gap / 2 - hh, width, hh, C.iron, 3);
    box(-width / 2, gap / 2, width, hh, '#353E49', 3);
    box(-width / 2 + 14, -gap / 2 - hh + 13, width - 28, 17, '#75818A', .5);
    for (let i = 0; i < 8; i++) {
      const x = -width / 2 + i * width / 8, tooth = width / 8;
      poly([[x + 5, -gap / 2], [x + tooth - 5, -gap / 2], [x + tooth / 2, -gap / 2 + 28]], C.silver);
      poly([[x + 5, gap / 2 + 25], [x + tooth - 5, gap / 2 + 25], [x + tooth / 2, gap / 2 - 3]], '#7D8B96');
      oval(x + tooth / 2, -gap / 2 - hh + 38, 5, 5, C.ink, .5);
    }
    for (const side of [-1, 1]) {
      oval(side * width / 2, 16, 22, 30 + gap / 2, '#5D6974');
      oval(side * width / 2, 16, 10, 10, C.ink);
    }
    // Hot furnace belly and chimney stay identifiable through the transformation.
    box(-width * .24, gap / 2 + 43, width * .48, 38, '#251A1D');
    for (let i = 0; i < 5; i++) {
      const x = (i - 2) * width * .078;
      poly([[x - 9, gap / 2 + 76], [x - 12, gap / 2 + 61],
        [x + Math.sin(r * 15 + i) * 9, gap / 2 + 46], [x + 13, gap / 2 + 76]], C.fire, .3);
    }
    box(-23, -gap / 2 - hh - 40, 46, 40, C.iron); pop();
    if (chomp) {
      // Broad cloth ribbons, wood splinters and porcelain follow continuous ballistic arcs.
      for (let i = 0; i < 19; i++) {
        const side = i % 2 ? 1 : -1;
        const vx = side * (110 + hash(i + 2) * 340), vy = -200 - hash(i + 23) * 390;
        const x = 960 + side * (90 + hash(i) * 200) + vx * dt;
        const y = 730 + vy * dt + 340 * dt * dt;
        push(); translate(x, y); rotate(i + dt * side * (2 + hash(i) * 5));
        if (i % 5 === 0) plate(0, 0, .65);
        else if (i % 4 === 0) poly([[-65, -12], [15, -22], [68, 4], [6, 13], [-35, 28]], '#C5B9A5');
        else poly([[-35, -7], [24, -14], [42, 2], [-17, 13]], C.wood, 1);
        pop();
      }
      // New embers keep rising after the large debris has fallen out of view.
      for (let i = 0; i < 13; i++) {
        const p = (dt * .75 + hash(i + 80)) % 1;
        oval(960 + (hash(i + 50) - .5) * 630 + Math.sin(r * 4 + i) * 17,
          760 - p * 470, 3 + hash(i) * 4, 5, i % 2 ? C.fire : '#F4BD73', .2);
      }
      burst(960, 722, now, '#FFD298');
    }
  }
  camEnd();
};
