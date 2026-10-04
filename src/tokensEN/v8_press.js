// Approved press-conference storyboard. All choreography is in real track seconds.
// --var=capex:a|b|c|d|e → window.CAPEX_V[k](r). Default: selected B performance with B lectern (q1bb); capex:legacy uses the original.
window.CAPEX_V = window.CAPEX_V || {};
if (window.R34) {
  (() => {
    const INK = '#171C25', NAVY = '#27364D', BLUE = '#7894B2';
    const shape = (p, c, sw = 1.2) => paint(p, { wash: c, ink: INK, sw });
    const box = (x, y, w, h, c, sw) => shape(rectPts(x, y, w, h), c, sw);
    function mic(x, y, a, s = 1) {
      push(); translate(x, y); rotate(a); scale(s);
      shape(rrPts(-9, -5, 18, 66, 6), '#535B63');
      shape(ellPts(0, -15, 21, 27, 18), '#858B90');
      for (let i = -2; i <= 2; i++) inkLine([[-13, -15 + i * 7], [13, -15 + i * 7]], .45, INK, 'inkfine', 0);
      pop();
    }
    function note(x, y, a = 0) {
      push(); translate(x, y); rotate(a);
      box(-28, -40, 56, 80, '#F2E5CC');
      for (let i = -2; i <= 2; i++) inkLine([[i * 10, -46], [i * 10, -33]], 1, INK, 'ink', 0);
      pop();
    }
    function camera(x, y, a = 0) {
      push(); translate(x, y); rotate(a);
      shape(rrPts(-42, -28, 74, 53, 8), '#303943');
      box(-22, -40, 26, 14, '#535D66');
      shape(ellPts(33, 0, 24, 29, 16), '#151E28');
      shape(ellPts(38, 0, 14, 20, 16), '#61788A'); pop();
    }
    function reporter(x, y, s, r, front, alarm = false) {
      push(); translate(x, y); scale(s);
      // s of agentBot remains below 9 even for the large foreground silhouettes.
      agentBot(0, 0, 8, r, { dx: 0, dy: 0, sq: 0, aL: -.3, aR: .7,
        col: BLUE, dk: '#4B6482', lt: '#A4B9CB', noShadow: true,
        eyes: alarm ? 'scared' : 'dot', mouth: alarm ? 'O' : 'o',
        draw: front ? undefined : u => {
          shape(rectPts(-5 * u, -8 * u, 10 * u, 6 * u), BLUE, .65);
          inkLine([[-30, -56], [28, -56]], .5, '#A4B9CB', 'inkfine', 0);
        } });
      shape(rrPts(-49, -9, 98, 62, 24), '#354150', .7); pop();
    }
    function rack(x, y, w, h, tilt = 0) {
      push(); translate(x, y); rotate(tilt);
      box(-w / 2, -h, w, h, '#161D26', 2);
      box(-w / 2 + 14, -h + 14, w - 28, h - 28, '#3C4650');
      for (let i = 0; i < 9; i++) {
        const yy = -h + 25 + i * (h - 45) / 9, hh = (h - 70) / 9;
        box(-w / 2 + 24, yy, w - 48, hh, '#232D38', .8);
        for (let j = 0; j < 3; j++) inkLine([[-w / 2 + 36, yy + 10 + j * 8], [w / 2 - 64, yy + 10 + j * 8]], .5, '#101820', 'inkfine', 0);
        box(w / 2 - 51, yy + 10, 15, 8, '#F99735', .2);
      } pop();
    }
    function robot(r) {
      const age = Math.max(0, r - 204.92);
      const parts = [[0, -185, 112, 73], [0, -80, 90, 95], [-80, -93, 28, 86], [80, -93, 28, 86], [-28, 9, 32, 70], [28, 9, 32, 70], [0, -48, 62, 30]];
      parts.forEach(([x, y, w, h], i) => {
        const dt = Math.max(0, age - i * .017), drop = Math.min(205 - y - h / 2, 850 * dt * dt);
        push(); translate(1230 + x + (i % 2 ? -1 : 1) * dt * (25 + i * 16), 420 + y + drop); rotate(dt * (i % 2 ? -1 : 1) * (1 + i * .25));
        shape(rrPts(-w / 2, -h / 2, w, h, 5), i === 6 ? '#737B81' : '#92989B');
        if (!i) { for (const xx of [-27, 27]) shape(ellPts(xx, -5, 7, 9, 10), INK, .3); inkLine([[-15, 18], [15, 18]], .8, INK, 'ink', 0); }
        pop();
      });
    }
    function pressConf(r) {
      const yank = easeOut(seg(r, 202.26, 202.51)), reveal = ease(seg(r, 204.28, 204.52));
      const soon = easeOut(seg(r, 204.92, 205.10)), cap = ease(seg(r, 205.24, 205.48));
      const slam = easeOut(seg(r, 205.90, 205.96)), crash = seg(r, 205.90, 206.08), impact = r >= 206.08;
      // close shots per beat (eased glides that settle before each question word, no cuts); the wide room only for the CAPEX crash
      const [ccx, ccy, cz] = kf(r, [[201.60, [760, 430, 1.5]], [202.40, [760, 430, 1.5]], [202.72, [1065, 360, 1.5]], [204.10, [1065, 360, 1.5]],
        [204.42, [885, 430, 1.3]], [205.10, [885, 430, 1.3]], [205.40, [960, 470, 1.15]], [205.86, [960, 470, 1.15]], [206.15, [960, 540, 1]]]);
      camBegin(ccx, ccy, cz);
      paint(rectPts(-400, -500, 2720, 2200), { wash: '#18212E', ink: null });
      // A fixed proscenium: folds part only around the grey robot's alcove.
      box(1050, 60, 390, 600, '#101820');
      if (reveal > 0) robot(r);
      for (let i = 0; i < 18; i++) {
        const x = 420 + i * 64, dx = x > 1020 ? (x < 1240 ? -190 : 170) * reveal : 0;
        if (x > 1020) { push(); translate(dx, 0); }
        shape([[x, -180], [x + 66, -180], [x + 57, 656], [x - 9, 660]], i % 2 ? '#304159' : NAVY, .45);
        inkLine([[x + 13, -170], [x + 4, 640]], .8, '#182637', 'ink', 0);
        if (x > 1020) pop();
      }
      box(420, 655, 1080, 610, '#343338');
      box(420, 650, 1080, 28, '#76604F');
      // Unlabelled exit, opened by the bright deflection on SOON.
      box(468, 225, 161, 428, '#564737');
      box(480, 238, 136, 406, soon > 0 ? '#FFE3A7' : '#322E2C');
      if (soon > 0) shape([[480, 646], [616, 646], [730, 836], [438, 836]], '#9B7951', .1);
      shape([[480, 238], [616 - 108 * soon, 238 + 26 * soon], [616 - 108 * soon, 644 + 20 * soon], [480, 644]], '#675346');
      // Screen stays in the room; its only content is animated loading dots.
      box(1248, 323, 14, 310, '#535B63'); box(1190, 624, 130, 18, '#444C56');
      box(1090, 45, 345, 294, '#525A64', 1.8); box(1106, 61, 313, 262, '#141C26');
      if (r >= 203.20) for (let i = 0; i < 12; i++) {
        const a = i * TAU / 12 + (r - 203.20) * 4.8;
        shape(ellPts(1262 + Math.cos(a) * 66, 191 + Math.sin(a) * 66, 10, 10, 10), mixCol('#39434E', '#E0E5E8', i / 11), .1);
      }
      // The first reporter reaches well into the stage, then grabs empty air.
      reporter(548, 640, 1.7, r, true, yank > .2);
      const thrust = easeOut(seg(r, 201.60, 201.91)), hx = 625 + thrust * 72, hy = 476 - thrust * 61;
      inkLine([[582, 538], [617, 485], [hx, hy]], 7, INK, 'ink', .25);
      inkLine([[582, 538], [617, 485], [hx, hy]], 4, BLUE, 'ink', .25);
      for (let i = 0; i < 3; i++) inkLine([[hx - 4, hy + 4], [hx + 12 + i * 7, hy - 13 + i * 10]], 1.4, BLUE, 'ink', 0);
      const mx = lerp(hx + 10, 550, yank), my = lerp(hy - 52, 100, yank);
      inkLine([[mx + 20, my + 45], [650, 420 - yank * 110], [730 + 60 * yank, 396]], 1.7, INK, 'ink', .6);
      mic(mx, my, -.65 - yank * .55, 1.15);
      if (yank > 0 && r < 202.85) for (let i = 0; i < 3; i++) inkLine([[605 + i * 22, 100 + i * 22], [708, 145 + i * 32], [748, 209 + i * 32]], 1, '#DCE2E7', 'ink', .6);
      const aL = r < 202.6 ? .1 + yank * .8 : soon > 0 ? .15 : -.35;
      const aR = r < 202.6 ? -.3 : r < 204.28 ? .5 : cap > 0 ? lerp(.9, -.38, slam) : .1;
      ceoClawd(884, 462, 26, { noClicker: true, noShadow: true, eyes: 'dot', mouth: r >= 203.20 && r < 204.28 ? 'flat' : 'smile', aL, aR });
      if (soon > 0 && cap < .9) {
        inkLine([[757, 382], [699, 366], [649, 366]], 6, INK, 'ink', 0);
        inkLine([[757, 382], [699, 366], [649, 366]], 3.5, '#E79356', 'ink', 0);
        shape([[651, 354], [625, 365], [650, 378]], '#E79356', .7);
      }
      box(731, 490, 326, 278, '#665247', 1.8);
      box(750, 522, 288, 229, '#735E50', .7);
      for (let i = 0; i < 5; i++) inkLine([[775 + i * 52, 536], [770 + i * 52, 744]], .4, '#514138', 'inkfine', 0);
      for (let i = 0; i < 7; i++) {
        const x = 754 + i * 41, y = 438 + (i % 3) * 12;
        inkLine([[x + 15, 493], [x, y]], 1.8, INK, 'ink', 0); mic(x, y, (i - 3) * .13, .65);
      }
      box(716, 486, 356, 31, '#8C7461', 1.7);
      // Button sits beyond the microphones, with a clear hovering / contact silhouette.
      box(1024, 462, 75, 23, '#222A34');
      shape(ellPts(1061, 458 + 9 * slam, 27, 17 - 8 * slam, 18), '#E54B3C');
      if (cap > 0) {
        const yy = lerp(389, 445, slam);
        inkLine([[1010, 386], [1038, yy - 13], [1061, yy]], 5, INK, 'ink', .2);
        shape(ellPts(1061, yy, 22, 12, 14), '#EC985E');
      }
      // The press table is intact until the rack actually reaches it.
      if (!impact) { box(655, 799, 754, 31, '#87705E'); box(686, 830, 19, 145, '#534439'); box(1374, 830, 19, 145, '#534439'); }
      else for (let i = 0; i < 7; i++) shape([[720 + i * 95, 807], [787 + i * 83, 857 + (i % 2) * 28], [759 + i * 87, 918], [699 + i * 92, 850]], '#826751');
      if (crash > 0) {
        const open = easeOut(crash * 4);
        shape([[935, -180], [1000, -110 + open * 72], [1080, -145], [1180, -48], [1315, -110], [1445, -180]], '#080F18', 2);
        for (let i = 0; i < 7; i++) inkLine([[1000 + i * 65, -150], [972 + i * 67, -85], [992 + i * 64, -40], [972 + i * 65, 8]], 1.6, '#0B121A', 'ink', 0);
        const side = easeOut(seg(r, 205.94, 206.22));
        rack(lerp(280, 465, side), 850, 220, 980, -.025);
        rack(lerp(1660, 1470, side), 850, 230, 1040, .025);
        rack(1170, lerp(-250, 864, crash * crash), 300, 815, -.07 * crash);
        if (impact) {
          const dt = r - 206.08;
          for (let i = 0; i < 18; i++) {
            const vx = (hash(i + 70) - .5) * 1050, vy = -180 - hash(i + 11) * 490;
            const x = 1150 + vx * dt, y = 827 + vy * dt + 850 * dt * dt;
            push(); translate(x, y); rotate(i + dt * (i % 2 ? 5 : -5));
            shape([[-16, -12], [11, -19], [22, 8], [-8, 18]], i % 2 ? '#93918B' : '#6E594B', .6); pop();
          }
          for (let i = 0; i < 5; i++) note(810 + i * 132 + (i - 2) * dt * 60, 816 - (220 + i * 45) * dt + 300 * dt * dt, (i - 2) * dt * 3);
          for (let i = 0; i < 4; i++) inkLine([[966 - i * 20, 763 + i * 29], [940 - i * 28, 803 + i * 28]], 1.4, '#D7CCC0', 'ink', 0);
        }
      }
      // Two rows, a clear centre aisle, and cameras/notebooks instead of readable badges.
      reporter(600, 930, 2.4, r, false, impact); reporter(1390, 923, 2.5, r, true, impact);
      camera(694, 790, -.2); camera(1320, 784, -.25);
      reporter(475, 1145, 3.0, r, false, impact); reporter(820, 1150, 2.9, r, false, impact); reporter(1265, 1152, 3.1, r, impact, impact);
      note(966, 1016, -.23); note(1442, 1000, .25); camera(593, 1000, -.3);
      const flashAge = [201.60, 202.60, 203.20, 204.28, 204.92, 205.24].reduce((a, t) => r >= t ? Math.min(a, r - t) : a, 99);
      if (flashAge < .10) paint(starPts(705, 778, 76 * (1 - flashAge / .10), .25, 8), { wash: '#FFF8E3', ink: null });
      camEnd();
    }
    // to the benchmark cut (206.5–207.26 showed the old CAPEX neon with its NOW! sign)
    const A = N2O(201.6), B = N2O(207.26), name = 'en_hold_press';
    chapter(name, A, B, [[A, t => {
      const r = O2N(t); window.RNOW = r;
      const variant = (window.BTT_VAR || {}).capex || 'q1bb';
      try { (CAPEX_V[variant] || pressConf)(r); } finally { window.RNOW = null; }
    }]], { real: true });
    const c = CH.find(c => c.name === name); c.hold = true;
    CH.splice(CH.indexOf(c), 1); CH.unshift(c);
    RU34.push([A, B, [[A, 960, 540, 1080]]], [B, B + .001, [[B, 960, 540, 790]]]);
  })();
}
