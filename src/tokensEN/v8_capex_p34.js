// Two stage-pitch alternates. Source-audio time drives every pose and prop.
// p3: an auctioneer flips physical promise cards. p4: a theatrical product launch.
(() => {
  window.CAPEX_V = window.CAPEX_V || {};
  const questions = [
    [201.60, 202.18, 0, 'REVENUE?'], [202.60, 203.04, 1, 'PROFIT?'],
    [204.28, 204.84, 0, 'A-G-I?'], [205.24, 205.78, 1, 'CAPEX?']
  ];
  const answers = [
    [202.26, 202.54, 'LATER!', ['O', 'smile', 'o', 'flat']],
    [203.20, 203.74, 'HOW?!', ['O', 'O', 'o', 'flat']],
    [204.92, 205.18, 'SOON!', ['o', 'O', 'o', 'flat']],
    [205.90, 206.50, 'NOW!', ['flat', 'O', 'O', 'grin']]
  ];
  const sh = (p, c, sw = 1.1) => paint(p, { wash: c, fill: mixCol(c, PAL.ink, .25), fillOp: 46, bleed: .04, tex: .63, border: .45, ink: PAL.ink, sw });
  const box = (x, y, w, h, c, sw) => sh(rectPts(x, y, w, h, 1.1), c, sw);
  const oval = (x, y, rx, ry, c, sw) => sh(ellPts(x, y, rx, ry, 16, .7), c, sw);
  const line = (pts, w = .9, c = PAL.ink) => inkLine(pts, w, c, 'ink', 0);
  const txt = (s, x, y, z, c = PAL.cream) => letter(s, x, y, z, c, { font: ruFont(z), ink: false });
  const hit = (r, at, d = .13) => r < at ? 0 : Math.exp(-(r - at) / d);
  const rebound = (r, at, d = .28) => r < at || r > at + d ? 0 : Math.sin(Math.PI * seg(r, at, at + d));
  const pocket = r => easeOut(seg(r, 203.06, 203.20)) * (1 - ease(seg(r, 203.83, 204.15)));
  const talk = r => answers.find(a => r >= a[0] && r < a[1]);
  const mouthAt = (r, idle = 'flat') => {
    const a = talk(r); return a ? a[3][Math.min(a[3].length - 1, Math.floor(seg(r, a[0], a[1]) * a[3].length))] : idle;
  };
  function mic(x, y, a = 0, s = 1) {
    push(); translate(x, y); rotate(a); scale(s);
    sh(rrPts(-7, -28, 14, 48, 4), TK.steelDk, .8);
    oval(0, -39, 18, 22, TK.steelLt, .9);
    for (let j = -2; j <= 2; j++) line([[-12, -39 + j * 6], [12, -39 + j * 6]], .4, TK.soot);
    pop();
  }
  function audience(r, x, y, u, who, shocked, warm = false) {
    const q = questions.find(q => q[2] === who && r >= q[0] && r < q[1]);
    const ask = Math.max(0, ...questions.filter(q => q[2] === who).map(q => easeOut(seg(r, q[0] - .13, q[0])) * (1 - ease(seg(r, q[1], q[1] + .12)))));
    const aR = lerp(-.65, .85, ask), dy = -.12 * Math.sin(r * 5 + who) - ask * .22;
    box(x - u * 5.4, y - u * 2.4, u * 10.8, u * 3.5, warm ? '#59404E' : '#344748', .8);
    clawd(x, y, u, { col: who === 0 ? '#8299C7' : '#8FA684', dk: who === 0 ? '#4B608F' : '#556957', lt: who === 0 ? '#B5C6DE' : '#C5D0AC',
      dy, sq: .025 * Math.sin(r * 4 + who), rot: (who === 0 ? .025 : -.025) * ask,
      eyes: q ? 'normal' : shocked > .1 ? 'scared' : 'narrow', mouth: q ? ['o', 'O', 'flat', 'o'][Math.floor(seg(r, q[0], q[1]) * 4) % 4] : shocked > .1 ? 'o' : 'flat',
      aL: shocked > .1 ? .93 : -.63, aR, flip: who === 1,
      armR: () => { push(); rotate(aR); mic(0, 0, -.27, .65); pop(); }, noShadow: true });
    if (q) {
      const yy = y - u * 10.9, ww = q[3] === 'REVENUE?' ? 253 : 218;
      sh([[x - 17, yy + 52], [x + 18, yy + 52], [x + 7, y - u * 7.8]], PAL.cream, .9);
      sh(rrPts(x - ww / 2, yy, ww, 57, 14, .8), PAL.cream, 1.3);
      txt(q[3], x, yy + 29, 30, PAL.ink);
    }
  }
  function pockets(uu, r) {
    const k = pocket(r); if (k < .01) return;
    for (const s of [-1, 1]) {
      const x = s * 4.35 * uu, y = -3.45 * uu;
      sh([[x, y], [x + s * 55 * k, y - 10], [x + s * 85 * k, y + 6],
        [x + s * 89 * k, y + 64 * k], [x + s * 39 * k, y + 80 * k], [x, y + 33]], PAL.cream, 1.1);
      line([[x + s * 13, y + 17], [x + s * 61 * k, y + 17]], .65, '#A3958A');
      line([[x + s * 22 * k, y + 36], [x + s * 40 * k, y + 59 * k]], .65, '#A3958A');
    }
  }
  function pose(r, type) {
    const wind = ease(seg(r, 202.00, 202.26)), toss = easeOut(seg(r, 202.26, 202.43)), settle = ease(seg(r, 202.43, 202.91));
    const p = pocket(r), reveal = easeOut(seg(r, 204.16, 204.61)), cheer = easeOut(seg(r, 205.90, 206.13));
    let aL = lerp(.20, 1.22, wind), aR = type === 3 ? .70 + .12 * Math.sin(r * 9) : -.3;
    if (r >= 202.26) aL = lerp(1.22 + .28 * toss, -.30, settle);
    aL = lerp(aL, -.58, p); aR = lerp(aR, -.58, p);
    if (r >= 204.16 && r < 205.24) aR = lerp(type === 3 ? .35 : -.3, type === 3 ? .86 : 1.25, reveal) - .35 * ease(seg(r, 204.85, 205.20));
    if (r >= 205.24) aR = lerp(.62, 1.15, ease(seg(r, 205.24, 205.78)));
    if (r >= 205.90) { aL = lerp(-.3, 1.09, cheer); aR = lerp(1.15, 1.35, cheer); }
    const bounce = .020 * Math.sin((r - 201.60) * 9) + .065 * rebound(r, 205.90, .25);
    const reaction = mood(r, [[201.60, 'narrow'], [203.20, 'scared'], [204.14, 'normal'], [204.92, 'narrow'], [205.90, 'spark']]);
    return { aL, aR, sq: bounce, rot: -.015 * Math.sin(r * 5) - .045 * toss * (1 - settle),
      dy: -rebound(r, 205.90, .40) * .43, ...reaction };
  }
  function hand(r, x, y, u, type, side) {
    const o = pose(r, type), a = side < 0 ? o.aL : o.aR, q = o.sq + o.take;
    const xx = side * (4.9 + 2.2 * Math.cos(a)) * u * (1 + q * .6), yy = (-4.5 - 2.2 * Math.sin(a)) * u * (1 - q);
    return [x + xx * Math.cos(o.rot) - yy * Math.sin(o.rot), y + o.dy * u + xx * Math.sin(o.rot) + yy * Math.cos(o.rot)];
  }
  function tossMic(r, x, y, u, type) {
    const dt = r - 202.26; if (dt < 0 || dt > .71) return;
    const h = hand(202.26, x, y, u, type, -1);
    mic(h[0] - 440 * dt, h[1] - 240 * dt + 540 * dt * dt, -dt * 10, 1.05);
    if (dt < .14) for (let i = 0; i < 3; i++) line([[h[0] + 9 + 15 * i, h[1] + i * 10], [h[0] + 32 + i * 15, h[1] + 12 + i * 10]], .9, PAL.cream);
  }
  function prototype(r, x, base, s = 1) {
    const dt = Math.max(0, r - 204.92), fail = easeOut(seg(dt, 0, .40));
    push(); translate(x, base); scale(s);
    // The unpainted panel, exposed wire and taped-on arm make it clearly unfinished.
    box(-42, -80, 31, 80, TK.steelDk, 1.2); box(12, -80, 31, 80, TK.steelDk, 1.2);
    push(); translate(0, -122 + 25 * fail); rotate(.35 * fail);
    sh(rrPts(-70, -75, 140, 150, 10, 1.5), TK.steelLt, 1.5);
    box(-50, -49, 102, 110, TK.steelDk, .9); box(-29, -34, 59, 51, TK.pcb, .8);
    for (let i = 0; i < 3; i++) line([[-32 + i * 32, 25], [-44 + i * 39, 41], [-19 + i * 25, 57]], 1.2, i % 2 ? TK.copper : TK.led);
    box(-105 - 25 * fail, -65 + 65 * fail, 32, 124, TK.steel, 1.1);
    line([[87, -58], [104, -21], [93, 39 + 34 * fail]], 2, TK.copper);
    for (let i = 0; i < 2; i++) box(-101 - 25 * fail, -38 + i * 31 + 65 * fail, 22, 11, '#D9C393', .4);
    pop();
    const dx = 54 * fail, yy = dt === 0 ? -259 : Math.min(-84, -259 - 36 * dt + 590 * dt * dt);
    push(); translate(dx, yy); rotate(dt > 0 ? Math.min(.45, dt * 1.1) : 0);
    sh(rrPts(-77, -49, 154, 97, 12), TK.steelLt, 1.5);
    for (const ex of [-31, 31]) { if (dt === 0) box(ex - 9, -16, 18, 25, TK.led, .6); else { line([[ex - 10, -19], [ex + 10, 1]], 1.8, TK.ember); line([[ex + 10, -19], [ex - 10, 1]], 1.8, TK.ember); } }
    line([[-20, 27], [20, 27]], 1.1); pop();
    if (dt > 0 && dt < .34) paint(starPts(32, -191, 43 * hit(r, 204.92, .14), .3, 7), { wash: PAL.cream, ink: null });
    pop();
  }
  function rack(r, x, y, w, h, seed) {
    serverRack(x - w / 2, y - h, w, h, N2O(r), { seed, units: 4, heat: 0, fire: 0 });
    for (const a of [-.33, .33]) oval(x + a * w, y + 7, 11, 12, TK.soot, .8);
  }
  function stage(r, type) {
    const a = type === 3 ? '#453342' : '#203E47', b = type === 3 ? '#694750' : '#33575B';
    paint(rectPts(-1800, -1800, 5500, 4300), { wash: a, fill: b, fillOp: 90, tex: .65, bleed: .12, ink: null });
    for (let i = 0; i < 11; i++) {
      const x = 360 + i * 112;
      sh([[x, -500], [x + 115, -500], [x + 106 + 2 * Math.sin(r * 2 + i), 952], [x - 3, 952]], i % 2 ? a : b, .4);
      line([[x + 22, 50], [x + 28, 450], [x + 19, 939]], .55, type === 3 ? '#805F69' : '#58777A');
    }
    for (const x of [730, 1170]) paint([[x - 40, 34], [x + 40, 34], [x + 330, 950], [x - 330, 950]], { fill: PAL.cream, fillOp: 17, bleed: .03, tex: .28, ink: null });
    box(-800, 958, 3500, 1500, type === 3 ? '#785244' : '#5B6356');
    box(-800, 945, 3500, 18, '#A68A66', 1.1);
    for (let i = 0; i < 9; i++) line([[330 + i * 149, 965], [180 + i * 176, 1280]], .7, type === 3 ? '#5E4039' : '#404D46');
  }
  function answerLabel(r, x, y, size = 57) {
    const a = talk(r); if (!a) return;
    const k = backOut(seg(r, a[0], a[0] + .075));
    txt(a[2], x, y, size * (.9 + .1 * k), a[2] === 'NOW!' ? TK.yellow : PAL.cream);
  }
  CAPEX_V.p3 = function (r) {
    const h = pose(r, 3), x = 889, y = 953, u = 40;
    const now = r >= 205.90, dt = Math.max(0, r - 205.90);
    const zoom = kf(r, [[201.6, 1.20], [202.26, 1.25], [203.2, 1.25], [204.28, 1.20], [205.90, 1.18], [207.26, 1.18]]);
    camBegin(963 + hit(r, 205.90) * Math.sin(r * 67) * 5, 841, zoom);
    stage(r, 3);
    // A physical flip-card display above the presenter, with rings and a stand.
    for (const xx of [758, 1199]) { box(xx - 10, 311, 20, 519, '#79684F', .7); box(xx - 62, 818, 125, 15, '#79684F', .7); }
    const card = r < 202.60 ? 0 : r < 204.28 ? 1 : r < 205.24 ? 2 : 3;
    const turnAt = [201.60, 202.60, 204.28, 205.24][card], flip = ease(seg(r, turnAt, turnAt + .13));
    const fw = card === 0 ? 1 : .14 + .86 * Math.abs(Math.cos(Math.PI * flip));
    const cc = [PAL.cream, '#EEDBC3', '#D5E1D9', '#EFBC67'][card];
    for (let i = 3; i >= 1; i--) sh(rrPts(705 + i * 5, 276 + i * 8, 525, 234, 15, 1), '#BDB09B', .7);
    sh(rrPts(705 + 525 * (1 - fw) / 2, 276, 525 * fw, 234, 15, 1), cc, 1.5);
    for (const xx of [770, 1165]) { oval(xx, 278, 15, 28, '#655E55', .9); oval(xx, 278, 6, 18, '#DCCAB0', .5); }
    if (fw > .7) {
      txt(['REVENUE', 'PROFIT', 'AGI', 'CAPEX'][card], 967, 339, 48, PAL.ink);
      const a = card === 0 ? r >= 202.26 : card === 1 ? r >= 203.20 : card === 2 ? r >= 204.92 : r >= 205.90;
      if (a) txt(['LATER', 'HOW?!', 'SOON', 'NOW!'][card], 967, 439, 63, card === 3 ? '#85522D' : PAL.clayDk);
      else { line([[795, 427], [1140, 427]], 1.1, '#AC9680'); txt('THE BIG PROMISE', 967, 462, 23, '#796655'); }
    }
    // A small demo unit appears on the AGI card cue, not as a keynote deck.
    if (r >= 204.28) {
      box(1201, 922, 165, 30, '#887359');
      prototype(r, 1283, 922, .68);
    }
    // The giant final order is wheeled in alongside the excited presenter.
    if (now) {
      for (const [at, xx, ww, hh] of [[205.90, 1196, 167, 350], [206.45, 643, 144, 310]]) {
        if (r < at) continue;
        const k = backOut(seg(r, at, at + .36));
        rack(r, lerp(xx + (xx > x ? 280 : -280), xx, k), 949, ww, hh, xx);
      }
      for (let i = 0; i < 7; i++) {
        const age = dt - i * .055; if (age < 0 || age > 1.10) continue;
        const px = 983 + (hash(i + 12) - .5) * 440 * age, py = 799 - (135 + hash(i + 3) * 130) * age + 280 * age * age;
        push(); translate(px, py); rotate((i - 3) * age * 2.4);
        box(-20, -10, 40, 20, '#D7B861', .8); line([[-12, 0], [12, 0]], .6, '#8E7541'); pop();
      }
    }
    ceoClawd(x, y, u, { ...h, mouth: mouthAt(r, now ? 'grin' : 'flat'), noClicker: true,
      armL: () => { if (r < 202.26) { push(); rotate(h.aL); mic(0, 0, 0, 1.05); pop(); } }, draw: uu => pockets(uu, r) });
    tossMic(r, x, y, u, 3);
    // The two front-row investors keep their questions; the stage is free of desks.
    audience(r, 675, 1190, 19, 0, now ? .4 : 0, true);
    audience(r, 1218, 1190, 19, 1, now ? .4 : 0, true);
    camEnd();
  };
  CAPEX_V.p4 = function (r) {
    const h = pose(r, 4), x = 814, y = 955, u = 39;
    const rev = ease(seg(r, 204.28, 204.73)), failed = easeOut(seg(r, 204.92, 205.32)), now = r >= 205.90;
    const dt = Math.max(0, r - 205.90), z = kf(r, [[201.6, 1.17], [202.26, 1.21], [203.2, 1.21], [204.28, 1.12], [204.92, 1.15], [205.90, 1.14], [207.26, 1.14]]);
    camBegin(963 + hit(r, 204.92) * Math.sin(r * 53) * 3, 842, z);
    stage(r, 4);
    // Product-launch arch, not a projection slide. Tiny bulbs breathe with the music.
    line([[615, 942], [615, 274], [671, 221], [1370, 221], [1413, 274], [1413, 942]], 6, '#8B9175');
    for (let i = 0; i < 9; i++) oval(671 + i * 86, 222, 6, 6, i % 2 ? '#C5B278' : '#C0D3B1', .35);
    sh(rrPts(760, 255, 520, 115, 23, 1.3), '#345E5F', 1.4);
    txt('THE NEXT BIG THING', 1020, 311, 40, '#EDE3C7');
    // The plinth supports the actual prototype before and after its failure.
    box(1089, 817, 233, 127, '#C8C1A5', 1.3); box(1070, 801, 273, 27, '#DED5B5', 1.4);
    box(1099, 919, 213, 17, '#949B82', .8);
    if (rev > 0) prototype(r, 1204, 800, .90);
    if (rev < 1) {
      // Silk is pulled upward and to the side, clearing both the demo and CEO face.
      const ox = -65 * rev, oy = -403 * rev;
      sh([[1081 + ox, 801 + oy], [1078 + ox, 580 + oy], [1105 + ox, 520 + oy],
        [1136 + ox, 478 + oy], [1283 + ox, 478 + oy], [1320 + ox, 543 + oy],
        [1334 + ox, 801 + oy], [1281 + ox, 786 + oy], [1227 + ox, 811 + oy], [1164 + ox, 789 + oy]], '#996477', 1.8);
      for (let i = 0; i < 4; i++) line([[1124 + i * 48 + ox, 544 + oy], [1116 + i * 51 + ox, 760 + oy]], .9, '#B88793');
      txt('?', 1213 + ox, 653 + oy, 80 * (1 - rev), '#EFDDC5');
    }
    if (failed > 0) {
      for (let i = 0; i < 3; i++) {
        const age = r - 204.92 - i * .10; if (age < 0) continue;
        paint(ellPts(1240 + i * 15, 649 - age * 88, 25 + age * 8, 21 + age * 8, 12), { fill: '#BDBEAA', fillOp: 53 * (1 - seg(age, .5, 1.15)), bleed: .12, tex: .5, ink: null });
      }
      txt('BETA', 1207, 868, 29, '#736E56');
    }
    // CAPEX brings in two new towers; the broken prototype stays visible between them.
    if (now) {
      for (const [at, xx, hh] of [[205.90, 1370, 481], [206.34, 619, 381]]) {
        if (r < at) continue;
        const k = easeOut(seg(r, at, at + .32));
        rack(r, xx + (xx > x ? 270 : -250) * (1 - k), 950, 156, hh, xx);
      }
      for (let i = 0; i < 5; i++) {
        const age = dt - i * .08; if (age < 0 || age > 1.2) continue;
        const xx = 1069 + (i - 2) * age * 62, yy = 761 - (165 + i * 12) * age + 280 * age * age;
        paint(starPts(xx, yy, 11, .4, 4, age), { wash: TK.yellow, ink: PAL.ink, sw: .55 });
      }
    }
    ceoClawd(x, y, u, { ...h, mouth: mouthAt(r, now ? 'grin' : 'flat'), noClicker: true,
      armL: () => { if (r < 202.26) { push(); rotate(h.aL); mic(0, 0, 0, 1.05); pop(); } },
      draw: uu => pockets(uu, r) });
    tossMic(r, x, y, u, 4);
    answerLabel(r, 941, 433, 57);
    const shock = failed * (1 - ease(seg(r, 205.45, 205.90))) + (now ? .45 : 0);
    audience(r, 726, 1200, 19, 0, shock);
    audience(r, 1266, 1200, 19, 1, shock);
    camEnd();
  };
})();
