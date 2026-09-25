// a02_friday.js: «Жги токены» v2, verse 1 (20.1–39.8). Friday in Clawd's flat as a punk-zine collage that wobbles with the
// acid squelch. Clawd tries to go out; every action orders another useless product from the factory.
//   20.1  hallway: every step on the floor is an ORDER button, parcels drop from the factory chute and block the door; «ПЯТНИЦА», дела ✓
//   22.65 limit bar 100% «ЛИМИТЫ ЦЕЛЫ» → whip down to the week calendar, a tiny Clawd walks to ПТ «ПОЛПУТИ»
//   25.25 the park calls through the window; the latch orders «ПАРК-БОТ», an agent goes for the walk instead; the ВС sheet slides in
//   27.8  the weekend is a consumable: СБ / ВС sheets torn off, stamped «СГОРИТ» by a tiny press, fed into the furnace
//   30.5  site and bot waved off «НЕ НУЖЕН»
//   32.5  the 100% bar is a rocket «ПОТРАТЬ МЕНЯ», ignition on 33.49, launch «вперёд», «К ЛУНЕ» (fuel = the limit)
//   35.1  «Сделай игру»: an arcade cabinet nobody plays; an agent plays it so the report shows «1 ПОЛЬЗОВАТЕЛЬ»
//   37.75 the unread site: 0 visitors, cobwebs, tumbleweed. Hard cut at 39.8.
(() => {
  const INK = PAL.ink, C = A2;
  const VH = hitsIn(20.1, 39.8);
  const a02_SQ = t => squelch(t, 19.9, 39.9);
  const a02_tx = (s, x, y, size, col, o = {}) => letter(s, x, y, size, col, { font: ruFont(size), ink: false, ...o });

  // ---------- camera: a per-shot view + per-panel wobble cameras (letters follow the camera, so text wobbles too) ----------
  let V = { cx: W / 2, cy: H / 2, z: 1, r: 0 };
  function a02_view(t, cx = W / 2, cy = H / 2, z = 1, r = 0, shake = 12) {
    const [sx, sy] = shakeXY(t, shake * hitK(t, VH, .12));
    V = { cx: cx + sx / z, cy: cy + sy / z, z, r };
  }
  function a02_pBegin(px, py, s = 1, r = 0, ox = 0, oy = 0) {
    const c = Math.cos(V.r), sn = Math.sin(V.r), dx = (px + ox - V.cx) * V.z, dy = (py + oy - V.cy) * V.z;
    const Sx = W / 2 + dx * c - dy * sn, Sy = H / 2 + dx * sn + dy * c, Z = V.z * s, R = V.r + r;
    const ex = (Sx - W / 2) / Z, ey = (Sy - H / 2) / Z, cr = Math.cos(-R), sr = Math.sin(-R);
    camBegin(px - (ex * cr - ey * sr), py - (ex * sr + ey * cr), Z, R);
  }
  // a torn zine panel whose content wobbles with the 303 squelch around its centre
  function a02_panel(t, x, y, w, h, seed, body, o = {}) {
    if ((o.s ?? 1) < .02) return;
    const q = a02_SQ(t), cx = x + w / 2, cy = y + h / 2;
    const s = (o.s ?? 1) * (1 + q * .03 * Math.sin(t * 9 + seed)), r = (o.rot ?? 0) + (q * .05 + .006) * Math.sin(t * 6.3 + seed * 2.1);
    a02_pBegin(cx, cy, s, r, o.dx || 0, o.dy || 0);
    const inner = zineCut(x, y, w, h, { seed, rot: 0, col: o.col, dots: o.dots, tape: o.tape });
    body(inner);
    camEnd();
  }
  function a02_free(t, body) { a02_pBegin(W / 2, H / 2, 1, 0); body(); camEnd(); }

  // ---------- backgrounds ----------
  function a02_wall(t, base, acc, seed = 0) {
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: base, fill: mixCol(base, '#000000', .35), fillOp: 90, bleed: .1, tex: .5, border: .3, ink: null });
    const q = a02_SQ(t);
    for (let i = 0; i < 4; i++) {                                                       // torn xerox strips across the wall
      const y = 120 + i * 260 + (hash(i + seed) - .5) * 80, a = (hash(i * 3 + seed) - .5) * .25;
      paint(rotPts(rectPts(-80, y, W + 160, 70 + hash(i + 5 + seed) * 50, 4), W / 2, y, a), { wash: i % 2 ? acc : mixCol(base, C.cream, .25), washOp: 70, ink: null });
    }
    for (let gy = 0; gy < 8; gy++) for (let gx = 0; gx < 15; gx++) {                     // halftone dots, bent by the squelch
      const px = 40 + gx * 135 + (gy % 2) * 67, py = 50 + gy * 130 + Math.sin(px * .008 + t * 6) * q * 36, r = 5 + 13 * hash(gx * 3.1 + gy * 7.7 + seed);
      paint(ellPts(px, py, r, r, 8), { wash: acc, washOp: 70, ink: null });
    }
  }

  // ---------- props ----------
  // going-out outfit: acid knit beanie with a pompom + a striped scarf whose tail flaps
  const a02_outfit = (flap = 0, user) => (u, sw) => {
    paint(rrPts(-5.4 * u, -3.55 * u, 10.8 * u, 1.3 * u, .5 * u), { wash: C.magenta, ink: INK, sw: sw * .6 });
    for (let i = 0; i < 5; i++) paint(rectPts(-4.7 * u + i * 2.1 * u, -3.5 * u, .8 * u, 1.2 * u), { wash: C.acid, washOp: 230, ink: null });
    const tx = 2.4 * u, ty = -2.8 * u, a = .12 + flap;
    paint(rotPts(rectPts(tx - .7 * u, ty, 1.4 * u, 3.1 * u), tx, ty, a), { wash: C.magenta, ink: INK, sw: sw * .5 });
    paint(rotPts(rectPts(tx - .7 * u, ty + 1.2 * u, 1.4 * u, .7 * u), tx, ty, a), { wash: C.acid, ink: null });
    const dome = []; for (let i = 0; i <= 12; i++) { const an = Math.PI + i / 12 * Math.PI; dome.push([Math.cos(an) * 4.7 * u, -8.2 * u + Math.sin(an) * 2.8 * u]); }
    paint(dome, { wash: C.acid, fill: '#7FBF10', fillOp: 80, tex: .5, border: .4, ink: INK, sw: sw * .8 });
    for (let i = -3; i <= 3; i++) inkLine([[i * 1.2 * u, -8.3 * u], [i * 1.05 * u, -10.4 * u + Math.abs(i) * .35 * u]], sw * .35, '#5E8F0C', 'inkfine', .3);
    paint(rrPts(-5.1 * u, -8.8 * u, 10.2 * u, 1.35 * u, .5 * u), { wash: C.magenta, fill: '#B0188F', fillOp: 70, tex: .5, ink: INK, sw: sw * .7 });
    paint(ellPts(0, -11.2 * u, 1.15 * u, 1.05 * u, 12, u * .08), { wash: C.hazard, ink: INK, sw: sw * .6 });
    if (user) user(u, sw);
  };
  const a02_clawd = (x, y, u, t, o = {}) => clawd(x, y, u, { seed: 2, ...o, draw: a02_outfit(o.flap || .1 * Math.sin(t * 7), o.draw) });

  // cardboard parcel standing on (x, y) bottom-centre, s tall; big one-word label + small type
  function a02_parcel(x, y, s, label, sub, rot = 0) {
    const w = s * 1.3, h = s, cx = x, cy = y - h / 2, R = p => rotPts(p, cx, cy, rot);
    paint(R(rectPts(x - w / 2, y - h, w, h, 1)), { wash: '#C8955A', fill: '#9A6A38', fillOp: 70, tex: .5, border: .4, ink: INK, sw: .7 });
    paint(R(rectPts(x - w * .08, y - h, w * .16, h)), { wash: '#E3C07A', washOp: 190, ink: null });
    paint(R(rectPts(x - w * .43, y - h * .72, w * .86, h * .46, 1)), { wash: C.cream, ink: INK, sw: .5 });
    const [lx, ly] = R([[x, y - h * .55]])[0], [sx2, sy2] = R([[x, y - h * .36]])[0];
    const fs = Math.min(h * .2, w * .78 / Math.max(1, label.length * .62));
    a02_tx(label, lx, ly, fs, C.rust, { rot });
    if (sub) a02_tx(sub, sx2, sy2, fs * .45, INK, { rot });
    const [ax, ay] = R([[x + w * .3, y - h * .13]])[0];
    a02_tx('↑↑', ax, ay, h * .1, INK, { rot });
  }
  // pneumatic chute from the factory: a pipe from the frame top down to (x, y)
  function a02_chute(x, y, top, t, kick = 0) {
    paint(rectPts(x - 55, top, 110, y - top), { wash: C.steel, fill: C.gunmetal, fillOp: 80, tex: .5, border: .4, ink: INK, sw: .8 });
    hazard(x - 62, y - 80, 124, 34);
    paint(rrPts(x - 80 - kick * 10, y - 20, 160 + kick * 20, 40, 14), { wash: C.gunDk, ink: INK, sw: .8 });
    a02_tx('ЗАВОД', x, top + 60, 24, C.hazard, { rot: -Math.PI / 2 });
    if (kick > .05) steam(x, y + 10, t, { dir: Math.PI / 2, k: kick, len: 180, n: 4, per: .5, seed: 5 });
  }
  // the zine "order" strip that pops in for each product
  function a02_order(txt, x, y, age, rot = -.05) {
    if (age < 0 || age > 1.6) return;
    const k = backOut(age / .14), fs = 36, w = textW(txt, ruFont(fs)) + 70;
    push(); translate(x, y); rotate(rot); scale(k);
    paint(rectPts(-w / 2, -34, w, 68, 2), { wash: C.hazard, ink: INK, sw: .8 });
    pop();
    a02_tx(txt, x, y + 2, fs * k, INK, { rot });
  }
  // week calendar strip (7 cells) with ПН–ЧТ crossed out
  const DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  // ---------- 20.1 hallway: every step orders a parcel ----------
  const A_HITS = [20.65, 21.29, 21.77, 22.27];
  const A_LOOT = [['БОТ', 'ДЛЯ ШНУРКОВ'], ['САЙТ', 'ПРО ШАПКУ'], ['ТУДУ', 'ДЛЯ ТУДУ-ЛИСТОВ'], ['АГЕНТ', 'ПО КЛЮЧАМ']];
  const A_PILE = [[890, 790, -.05], [1070, 790, .06], [975, 648, .1], [1090, 648, -.12]];
  function a02_hall(t, lt) {
    a02_wall(t, C.gunmetal, C.magenta, 1);
    a02_view(t, W / 2, H / 2, lerp(1, 1.05, lt / 2.55));
    const nh = A_HITS.filter(h => h <= t).length, last = nh ? A_HITS[nh - 1] : -9;
    a02_panel(t, 80, 70, 1200, 850, 3, () => {
      const fy = 700;
      paint(rectPts(130, 120, 1100, fy - 120), { wash: '#E8D6B0', fill: '#D2B37E', fillOp: 90, bleed: .12, tex: .6, border: .5, ink: null });
      for (let x = 170; x < 1220; x += 76) paint(rectPts(x, 120, 22, fy - 120), { wash: '#D4B98A', washOp: 110, ink: null });
      paint(rectPts(130, fy, 1100, 170), { wash: '#7A4E32', fill: '#5A3522', fillOp: 90, tex: .5, ink: null });
      // floor ORDER buttons: the one under Clawd lights on each hit
      for (let i = 0; i < 5; i++) {
        const bx = 230 + i * 120, lit = i < nh ? hitK(t, [A_HITS[i]], .35) : 0;
        paint(rrPts(bx - 50, fy + 70, 100, 34, 10), { wash: mixCol(C.steel, C.acid, lit), ink: INK, sw: .6 });
        a02_tx('ЗАКАЗ', bx, fy + 87, 17, lit > .3 ? INK : C.cream);
        if (lit > .05) glowAt(bx, fy + 87, 90 * lit, C.acid, 120 * lit);
      }
      // the door, blocked by the pile
      paint(rectPts(1040, 290, 170, 410, 1), { wash: '#8C4A2A', fill: '#5E2E18', fillOp: 90, tex: .6, border: .5, ink: INK, sw: .9 });
      paint(rectPts(1070, 320, 110, 150), { wash: '#6E3A20', ink: INK, sw: .5 });
      paint(ellPts(1062, 520, 11, 11, 10), { wash: C.hazard, ink: INK, sw: .5 });
      paint(rectPts(1060, 225, 130, 46, 1), { wash: '#2FBF71', ink: INK, sw: .6 });
      a02_tx('ВЫХОД', 1125, 249, 24, C.cream);
      // coat hook (empty: he's already dressed)
      inkLine([[260, 300], [420, 300]], 3, '#5E2E18', 'ink', 0);
      a02_chute(975, 250, 120, t, hitK(t, A_HITS, .25));
      // parcels: fall from the chute onto the pile
      for (let i = 0; i < nh; i++) {
        const age = t - A_HITS[i], [px, py, pr] = A_PILE[i], p = clamp(age / .22), sy = 250 + 60;
        const x = lerp(975, px, p), y = lerp(sy, py, easeIn(p)), sq = age > .22 ? Math.exp(-(age - .22) * 14) * .2 : 0;
        push(); translate(x, y); scale(1 + sq, 1 - sq); translate(-x, -y); a02_parcel(x, y, 140, A_LOOT[i][0], A_LOOT[i][1], pr * p); pop();
      }
      // Clawd steps from button to button on the hits
      const gx = kf(t, [[20.1, 150], [20.65, 230], [21.29, 350], [21.77, 470], [22.27, 590], [22.65, 620]], easeOut), walk = t * 2.4;
      const surprised = nh >= 3;
      a02_clawd(gx, fy + 60, 19, t, { walk, dy: -Math.abs(Math.sin(walk * Math.PI)) * .6, aL: .3, aR: nh ? .9 : .3,
        eyes: nh ? 'look' : 'normal', lookX: 1, mouth: surprised ? 'O' : nh ? 'o' : 'smile', emote: nh >= 2 ? '!?' : null, emoteK: clamp((t - A_HITS[1]) / .3) });
    });
    // «+1 ЗАКАЗ» strips on each drop
    a02_free(t, () => { if (nh) a02_order('+1 ЗАКАЗ: ' + A_LOOT[nh - 1][0] + ' ' + A_LOOT[nh - 1][1], 560, 200 + (nh % 2) * 30, t - A_HITS[nh - 1], -.05 + (nh % 2) * .07); });
    a02_panel(t, 1310, 70, 540, 360, 7, () => {
      paint(rectPts(1350, 110, 460, 70), { wash: '#D8263A', ink: null });
      a02_tx('КАЛЕНДАРЬ', 1580, 146, 30, C.cream);
      punkText('ПЯТНИЦА', 1580, 285, 60, t, 20.1, { seed: 3 });
    }, { rot: .04 });
    a02_panel(t, 1320, 470, 520, 440, 11, () => {
      a02_tx('ДЕЛА:', 1440, 540, 46, INK);
      ['отчёт', 'созвон', 'код'].forEach((s, i) => {
        const y = 630 + i * 82, tk = t - (20.55 + i * .5);
        paint(rectPts(1380, y - 26, 52, 52, 1), { wash: '#FFFFFF', ink: INK, sw: .7 });
        if (tk > 0) inkLine([[1386, y - 2], [1402, y + 18], [1440, y - 40]].map((p, j) => j < 2 || tk > .08 ? p : [lerp(1402, 1440, tk / .08), lerp(y + 18, y - 40, tk / .08)]), 3.2, '#1E8A3C', 'ink', 0);
        a02_tx(s, 1460, y, 42, tk > .1 ? '#8A8480' : INK, { align: 'left' });
        if (tk > .1) inkLine([[1455, y + 2], [1455 + textW(s, ruFont(42)) * ease((tk - .1) / .15), y - 2]], 1.6, INK, 'inkfine', 0);
      });
      stamp('ПОЗАДИ', 1640, 840, 44, t, 22.1, { col: '#1E8A3C', rot: -.14 });
    }, { rot: -.05 });
    glitchCut(t, 20.1);
  }

  // ---------- 22.65 limits intact → half-way ----------
  function a02_limits(t, lt) {
    a02_wall(t, C.gunDk, C.acid, 4);
    const cy = kf(t, [[22.65, 380], [23.85, 400], [24.02, 700]], easeOut), z = kf(t, [[22.65, 1.14], [23.85, 1.1], [24.02, 1.02], [25.25, 1.06]]);
    a02_view(t, W / 2, cy, z, 0, 16);
    a02_panel(t, 200, 110, 1520, 440, 5, () => {
      const g = .5 + .5 * hitK(t, [23.23, 23.36], .3);
      limitBar(300, 290, 1320, 1, { h: 110, glow: g });
      stamp('ЛИМИТЫ ЦЕЛЫ', 960, 480, 58, t, 23.36, { col: C.acid, rot: -.05 });
      token(1620, 230, 44, { spin: t * .8, glow: .4 });
    }, { col: '#26292F', rot: -.02 });
    a02_panel(t, 150, 600, 1620, 330, 9, () => {
      const cw = 212, x0 = 230;
      DAYS.forEach((d, i) => {
        const x = x0 + i * cw, we = i >= 5;
        paint(rectPts(x, 650, cw - 16, 240, 1), { wash: we ? '#E6F7B8' : '#FFFFFF', fill: we ? C.acid : '#E9E2D6', fillOp: we ? 60 : 40, tex: .4, ink: INK, sw: .6 });
        paint(rectPts(x, 650, cw - 16, 50), { wash: we ? C.magenta : C.gunmetal, ink: null });
        a02_tx(d, x + (cw - 16) / 2, 676, 34, C.cream);
        if (i < 4) {
          const k = clamp((t - 23.7 - i * .06) / .08);
          if (k > 0) { inkLine([[x + 30, 730], [lerp(x + 30, x + cw - 46, k), lerp(730, 860, k)]], 3, '#D8263A', 'ink', 0); inkLine([[x + cw - 46, 730], [lerp(x + cw - 46, x + 30, k), lerp(730, 860, k)]], 3, '#D8263A', 'ink', 0); }
        }
        if (we) a02_tx('выходной', x + (cw - 16) / 2, 840, 24, C.rust);
      });
      // a tiny dressed Clawd walks the week and stops on ПТ
      const wx = kf(t, [[23.7, x0 + 98], [24.02, x0 + 4 * cw + 98]], x => x);
      a02_clawd(wx, 800, 7, t, { walk: t * 3, mouth: 'smile', noShadow: true });
      const ck = clamp((t - 24.02) / .2);
      if (ck > 0) { const pts = ellPts(x0 + 4 * cw + 98, 770, 118, 128, 24).slice(0, Math.max(3, Math.round(24 * ck))); inkLine(pts, 4, '#D8263A', 'ink', .5); }
      stamp('ПОЛПУТИ', x0 + 4 * cw + 98, 575, 50, t, 24.1, { col: '#D8263A', rot: .06 });
    }, { s: 1 + .05 * hitK(t, [24.18], .2), rot: .015 });
  }

  // ---------- 25.25 the park calls; the latch orders a walking agent ----------
  function a02_park(t, lt) {
    a02_wall(t, '#3B2A66', C.magenta, 8);
    a02_view(t, W / 2, H / 2, lerp(1.02, 1.08, lt / 2.55));
    const q = a02_SQ(t), open = ease((t - 25.8) / .3);
    a02_panel(t, 120, 70, 1100, 850, 13, () => {
      // the park outside, wobbling with the squelch
      paint(rectPts(200, 150, 940, 690), { wash: '#9ED3F0', fill: '#6FB2DE', fillOp: 90, bleed: .15, tex: .5, ink: null });
      paint(ellPts(980, 260, 60, 60, 20), { wash: '#FFE38A', fill: C.hazard, fillOp: 80, ink: null });
      const hill = []; for (let i = 0; i <= 20; i++) { const x = 200 + i * 47; hill.push([x, 600 + Math.sin(i * .6 + 1) * 30 + Math.sin(i * .6 + t * 6) * q * 14]); }
      paint([...hill, [1140, 840], [200, 840]], { wash: '#7FBF5A', fill: '#4E8F3A', fillOp: 90, bleed: .15, tex: .6, ink: null });
      paint([[560, 840], [640, 600], [700, 600], [860, 840]], { wash: '#E6D3A0', washOp: 200, ink: null });
      [[330, 580, 1], [470, 560, .8], [1000, 575, 1.1]].forEach(([x, y, s], i) => {
        const sway = Math.sin(t * 5 + i) * (8 + 30 * q) * s;
        paint(rectPts(x - 10 * s, y - 20, 20 * s, 90 * s), { wash: '#6E4A2A', ink: INK, sw: .4 });
        paint(ellPts(x + sway, y - 70 * s, 80 * s, 95 * s, 18, 3), { wash: '#6FAE4A', fill: '#3E7A2E', fillOp: 110, bleed: .2, tex: .7, ink: INK, sw: .5 });
      });
      // the beckoning tree waves a branch-hand: «ИДИ СЮДА!»
      const bk = Math.sin(t * 9) * .35;
      inkLine([[1000, 520], [1060, 470], [1060 + Math.cos(-1 + bk) * 60, 470 + Math.sin(-1 + bk) * 60]], 5, '#6E4A2A', 'ink', .4);
      a02_bubble('ИДИ СЮДА!', 880, 380, 34, t - 25.35);
      a02_tx('ПАРК', 700, 560, 30, C.cream, { rot: -.05 });
      // the park-bot takes the walk instead
      if (t > 26.27) { const ax = lerp(560, 760, clamp((t - 26.27) / 1.5)); agentBot(ax, 770, 10, t, { n: 1, walk: t * 2.4, aR: 1.2 + Math.sin(t * 10) * .4, mouth: 'smile', eyes: 'happy', noShadow: true }); }
      // window frame + opening sash
      paint(rectPts(190, 140, 960, 710, 1), { ink: '#F5EFE2', sw: 3 });
      paint(rectPts(660, 140, 20, 710), { wash: '#F5EFE2', ink: INK, sw: .5 });
      paint(rectPts(190, 480, 960, 20), { wash: '#F5EFE2', ink: INK, sw: .5 });
      if (open > .02) paint(rectPts(680, 150, 460 * (1 - open * .7), 690), { wash: '#DDEFF8', washOp: 70, ink: INK, sw: .5 });
      paint(rectPts(150, 840, 1040, 50, 1), { wash: '#F5EFE2', fill: '#D9CBB0', fillOp: 60, ink: INK, sw: .7 });
      paint(rrPts(640, 620, 60, 22, 8), { wash: C.hazard, ink: INK, sw: .5 });                        // the latch = a lever
      if (t > 27.0) {                                                                                   // «но в воскресенье»
        const k = backOut((t - 27.0) / .25);
        paint(rotPts(rectPts(840, 170 - (1 - k) * 200, 250, 280, 1), 965, 310, .1), { wash: '#FFFFFF', ink: INK, sw: .7 });
        paint(rotPts(rectPts(840, 170 - (1 - k) * 200, 250, 70), 965, 310, .1), { wash: C.magenta, ink: null });
        a02_tx('ВС', 958, 330 - (1 - k) * 200, 110, '#D8263A', { rot: .1 });
        a02_tx('ВОСКРЕСЕНЬЕ', 978, 212 - (1 - k) * 200, 24, C.cream, { rot: .1 });
        fire(1070, 450 - (1 - k) * 200, 60, 90, t, { k: .8, seed: 4 });
      }
    }, { rot: -.01 });
    // Clawd at the sill pulls the latch (it's a lever) at 25.8
    a02_free(t, () => a02_clawd(1090, 905, 22, t, { flip: true, aR: t > 25.7 ? 1.6 : .3, aL: .2, eyes: t > 27 ? 'scared' : 'look', lookX: -1, mouth: t > 27 ? 'o' : t > 26.27 ? 'flat' : 'smile' }));
    a02_panel(t, 1300, 100, 520, 780, 17, () => {
      paint(rectPts(1350, 140, 420, 700), { wash: '#4A3A6A', fill: '#2E2248', fillOp: 70, tex: .5, ink: null });
      a02_chute(1560, 420, 140, t, hitK(t, [25.8], .25));
      if (t > 25.8) {
        const age = t - 25.8, p = clamp(age / .2), y = lerp(480, 720, easeIn(p));
        a02_parcel(1560, y, 190, 'ПАРК-БОТ', 'ГУЛЯЕТ ЗА ВАС', p * .08);
        if (t > 26.27) stamp('ДОСТАВЛЕНО', 1560, 800, 36, t, 26.27, { col: C.magenta, rot: -.1 });
      }
    }, { rot: .03 });
    a02_free(t, () => a02_order('+1 ЗАКАЗ: ПАРК-БОТ', 1300, 190, t - 25.8, .04));
  }
  function a02_bubble(txt, x, y, fs, age) {
    if (age < 0) return;
    const k = backOut(age / .2), w = textW(txt, ruFont(fs)) + 60, h = fs * 2;
    push(); translate(x, y); scale(k);
    paint([...rrPts(-w / 2, -h / 2, w, h, h * .4)], { wash: '#FFFFFF', ink: INK, sw: .8 });
    paint([[w * .15, h / 2 - 4], [w * .32, h / 2 + 40], [w * .3, h / 2 - 4]], { wash: '#FFFFFF', ink: null });
    pop();
    a02_tx(txt, x, y, fs * k, INK, { rot: Math.sin(age * 12) * .04 });
  }

  // ---------- 27.8 the weekend is a consumable ----------
  const D_SHEETS = [['СБ', 27.85], ['ВС', 28.45]], D_SPD = 620, D_PRESS = 960, D_FURN = 1480;
  function a02_furnace(t, lt) {
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: C.gunDk, fill: C.gunmetal, fillOp: 90, bleed: .1, tex: .5, ink: null });
    a02_view(t, 1000, 540, lerp(1.1, 1.18, lt / 2.7), 0, 14);
    const fed = D_SHEETS.map(([, ts]) => ts + (D_FURN - 640) / D_SPD), flare = hitK(t, fed, .45);
    a02_free(t, () => {
      glowAt(D_FURN + 130, 560, 520, C.sodium, 60 + 90 * flare);
      // the furnace
      paint(rectPts(D_FURN - 40, 250, 420, 560, 2), { wash: '#3A3336', fill: C.rust, fillOp: 60, tex: .6, border: .5, ink: INK, sw: 1 });
      paint(rrPts(D_FURN - 10, 480, 300, 250, 30), { wash: '#1A1011', ink: INK, sw: .8 });
      fire(D_FURN + 140, 730, 280, 200 + 140 * flare, t, { k: .9 + flare, seed: 12 });
      paint(rectPts(D_FURN - 20, 280, 380, 150, 1), { wash: C.rust, ink: INK, sw: .7 });
      a02_tx('ТОПКА', D_FURN + 170, 325, 48, C.hazard);
      a02_tx('расходник: ВЫХОДНЫЕ', D_FURN + 170, 390, 24, C.cream);
      smoke(D_FURN + 300, 250, t, { n: 5, h: 240, r: 40, col: '#4A4448', seed: 3 });
      hazard(-40, 880, W + 80, 40);
      // belt + the tiny press
      conveyor(560, 700, D_FURN - 560, t, { items: [() => {}], speed: D_SPD, legs: 150, h: 40 });
      // the sheets ride from the calendar through the press into the fire
      D_SHEETS.forEach(([d, ts], i) => {
        if (t < ts) return;
        const age = t - ts, x = 640 + age * D_SPD - (age < .15 ? (1 - age / .15) * 200 : 0), y = age < .15 ? lerp(420, 700, ease(age / .15)) : 700;
        if (x > D_FURN + 120) return;
        const squash = hitK(t, [ts + (D_PRESS - 640) / D_SPD], .12) * .4, burn = clamp((x - D_FURN + 60) / 160);
        push(); translate(x, y); scale(1, 1 - squash); translate(-x, -y);
        paint(rectPts(x - 80, y - 190, 160, 190, 1), { wash: mixCol('#FFFFFF', '#3A2A20', burn), ink: INK, sw: .6 });
        paint(rectPts(x - 80, y - 190, 160, 40), { wash: C.magenta, ink: null });
        pop();
        a02_tx(d, x, y - 95 * (1 - squash), 80 * (1 - burn * .5), '#D8263A');
        if (t > ts + (D_PRESS - 640) / D_SPD) a02_tx('СГОРИТ', x, y - 38, 26, C.rust, { rot: -.15, stroke: C.cream });
        if (burn > .05) fire(x, y, 170, 200 * burn, t, { k: burn, seed: 20 + i });
      });
      press(D_PRESS - 110, 300, 220, 400, t, D_SHEETS.map(([, ts]) => ts + (D_PRESS - 640) / D_SPD), { token: false, label: 'ШТАМП', seed: 4 });
    });
    // the tear-off calendar block
    a02_panel(t, 110, 150, 470, 620, 21, () => {
      const top = t < 27.85 ? 'СБ' : t < 28.45 ? 'ВС' : 'ПН', nx = top === 'ПН';
      paint(rectPts(170, 210, 350, 420, 1), { wash: '#FFFFFF', fill: '#E9E2D6', fillOp: 40, ink: INK, sw: .8 });
      paint(rectPts(170, 210, 350, 80), { wash: nx ? C.gunmetal : C.magenta, ink: null });
      for (let i = 0; i < 8; i++) paint(ellPts(195 + i * 43, 215, 9, 9, 8), { wash: C.gunDk, ink: null });
      a02_tx(nx ? 'НЕДЕЛЯ 40' : 'ВЫХОДНЫЕ', 345, 252, 30, C.cream);
      a02_tx(top, 345, 440, 170, nx ? INK : '#D8263A');
      for (const [, ts] of D_SHEETS) { const a = t - ts; if (a > 0 && a < .15) paint([[170, 300], [520, 300], [520 - a * 900, 640], [170, 630]], { wash: '#FFFFFF', washOp: 200 * (1 - a / .15), ink: INK, sw: .5 }); }
    }, { rot: -.03 });
    a02_free(t, () => {
      a02_clawd(560, 860, 14, t, { flip: false, aL: 1.4, aR: 1.4, eyes: 'scared', mouth: 'O', lookX: 1 });
      stamp('ВОЗВРАТУ НЕ ПОДЛЕЖИТ', 1020, 230, 56, t, 29.3, { col: '#D8263A', rot: -.04 });
    });
  }

  // ---------- 30.5 site and bot waved off ----------
  function a02_waveoff(t, lt) {
    a02_wall(t, '#5A1E4E', C.acid, 13);
    a02_view(t, W / 2, H / 2, lerp(1.0, 1.06, lt / 2));
    const slapS = 30.95, slapB = 31.58;
    a02_free(t, () => {
      // САЙТ flies in from the left, is slapped away up-left
      a02_icon(t, 'site', slapS, 30.5, [-300, 380], [700, 500], [-500, -300]);
      a02_icon(t, 'bot', slapB, 31.1, [W + 300, 380], [1220, 500], [W + 500, -300]);
      const swL = hitK(t, [slapS], .2), swR = hitK(t, [slapB], .2), smug = t > 32.0;
      a02_clawd(960, 900, 30, t, { aL: smug ? 1.2 : .3 + swL * 2.4, aR: smug ? 1.2 : .3 + swR * 2.4, eyes: smug ? 'closed' : 'narrow', mouth: smug ? 'smile' : 'flat', rot: (swL - swR) * .08 });
      if (t > slapS) stamp('НЕ НУЖЕН', 560, 400, 76, t, slapS + .04, { col: '#D8263A', rot: -.12 });
      if (t > slapB) stamp('НЕ НУЖЕН', 1360, 400, 76, t, slapB + .04, { col: '#D8263A', rot: .1 });
      if (smug) punkText('МНЕ', 960, 180, 110, t, 32.0, { seed: 6 });
    });
  }
  function a02_icon(t, kind, tSlap, tIn, from, at, away) {
    if (t < tIn) return;
    let x, y, rot = 0, s = 1;
    if (t < tSlap) { const p = easeOut((t - tIn) / (tSlap - tIn - .08)); x = lerp(from[0], at[0], p); y = lerp(from[1], at[1], p) + Math.sin(t * 8) * 10; rot = (1 - p) * .4 * Math.sign(from[0] - at[0]); }
    else { const p = (t - tSlap) / .45; if (p > 1) return; x = lerp(at[0], away[0], easeIn(p) * .9 + p * .1); y = lerp(at[1], away[1], p); rot = p * 5 * Math.sign(away[0] - at[0]); s = 1 - p * .4; }
    const w = 300 * s, h = 230 * s, R = p => rotPts(p, x, y, rot);
    paint(R(rectPts(x - w / 2, y - h / 2, w, h, 2)), { wash: C.cream, ink: INK, sw: .9 });
    if (kind === 'site') {
      paint(R(rectPts(x - w / 2, y - h / 2, w, h * .16)), { wash: C.steel, ink: null });
      for (let i = 0; i < 3; i++) { const [cx, cy] = R([[x - w * .42 + i * w * .07, y - h * .42]])[0]; paint(ellPts(cx, cy, 6 * s, 6 * s, 8), { wash: ['#FF5F57', '#FEBC2E', '#28C840'][i], ink: null }); }
      for (let i = 0; i < 4; i++) paint(R(rectPts(x - w * .38, y - h * .15 + i * h * .15, w * (.76 - (i % 2) * .2), h * .06)), { wash: '#B8B0A0', ink: null });
      const [lx, ly] = R([[x, y + h * .62]])[0]; a02_tx('САЙТ', lx, ly, 56 * s, C.cream, { rot, stroke: INK });
    } else {
      agentBot(x, y + h * .35, 13 * s, t, { n: 404, rot, noShadow: true, eyes: 'happy', mouth: 'grin', aR: 1.4 });
      const [lx, ly] = R([[x, y + h * .62]])[0]; a02_tx('БОТ', lx, ly, 56 * s, C.cream, { rot, stroke: INK });
    }
  }

  // ---------- 32.5 the 100% bar is a rocket → to the moon ----------
  function a02_rocket(t, lt) {
    const lift = t < 33.98 ? 0 : Math.pow(t - 33.98, 2) * 900 + (t - 33.98) * 200, camY = H / 2 - Math.min(lift, 1400) * .85;
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#1A0E3E', fill: C.uv, fillOp: 90 + 60 * clamp(lift / 900), bleed: .2, tex: .5, ink: null });
    a02_view(t, W / 2, camY, lerp(1.0, .92, clamp((t - 34) / 1)), 0, 20);
    const q = a02_SQ(t);
    a02_free(t, () => {
      for (let i = 0; i < 60; i++) { const x = hash(i) * W * 1.2 - W * .1, y = 1000 - hash(i + 7) * 2800, r = 2 + hash(i + 3) * 5; paint(starPts(x, y, r * (1 + .5 * Math.sin(t * 6 + i)), .35), { wash: i % 3 ? C.cream : C.acid, ink: null }); }
      // moon rises into view «к луне»
      const mk = backOut((t - 34.55) / .3), my = camY - 260;
      if (mk > .02) {
        paint(ellPts(1450, my, 190 * mk, 190 * mk, 30), { wash: '#F4EBC8', fill: '#D9CFA0', fillOp: 90, tex: .6, ink: INK, sw: 1 });
        [[-60, -40, 40], [50, 50, 30], [20, -90, 22]].forEach(([dx, dy, r]) => paint(ellPts(1450 + dx * mk, my + dy * mk, r * mk, r * mk, 14), { fill: '#BFB48A', fillOp: 120, ink: null }));
      }
      // launch pad
      hazard(640, 920, 640, 40);
      paint(rectPts(700, 960, 520, 140), { wash: C.gunmetal, ink: INK, sw: .8 });
      // the bar-rocket
      const rx = 960, ry = 880 - lift + Math.sin(t * 40) * (t > 33.49 ? 3 : 0), v = t < 33.98 ? 1 : Math.max(.6, 1 - (t - 33.98) * .3);
      const bw = 170, bh = 600, wob = q * .06 * Math.sin(t * 7);
      if (t > 33.49) {
        const ig = clamp((t - 33.49) / .3);
        fire(rx, ry + 90, 200, 260 * ig + 120 * hitK(t, [33.49, 33.98], .3), t, { k: 1.1, seed: 31 });
        smoke(rx, ry + 60, t, { n: 7, h: -300, r: 70, col: '#8A8480', seed: 2 });
        for (let i = 0; i < 6; i++) { const p = frac(t * 2.2 + i / 6), tx2 = rx + (hash(i) - .5) * 160 * p; token(tx2, ry + 80 + p * 420, 20 * (1 - p * .5), { burn: p }); }
      }
      push(); translate(rx, ry); rotate(wob); translate(-rx, -ry);
      paint([[rx - bw / 2, ry - bh + 40], [rx - bw * .8, ry], [rx - bw / 2, ry]], { wash: '#D8263A', ink: INK, sw: .8 });
      paint([[rx + bw / 2, ry - bh + 40], [rx + bw * .8, ry], [rx + bw / 2, ry]], { wash: '#D8263A', ink: INK, sw: .8 });
      paint(rrPts(rx - bw / 2, ry - bh, bw, bh, 40, 1), { wash: TK.soot, ink: C.cream, sw: 1.4 });
      const fh = (bh - 40) * v;
      paint(rrPts(rx - bw / 2 + 20, ry - 20 - fh, bw - 40, fh, 26), { wash: mixCol(TK.orange, TK.green, clamp((v - .5) * 2)), fill: TK.greenDk, fillOp: 70, tex: .5, ink: null });
      paint([[rx - bw / 2, ry - bh + 30], [rx, ry - bh - 150], [rx + bw / 2, ry - bh + 30]], { wash: C.hazard, ink: INK, sw: .9 });
      pop();
      a02_tx(Math.round(v * 100) + '%', rx, ry - bh * .8, 64, C.cream, { stroke: INK, rot: wob });
      a02_tx('НЕДЕЛЬНЫЙ ЛИМИТ', rx - 30, ry - bh * .3, 30, C.cream, { rot: -Math.PI / 2 + wob, stroke: INK });
      // Clawd clings to the side, scarf flapping
      const up = t > 33.98;
      a02_clawd(rx + 150, ry - 90, 13, t, { flap: up ? .9 + Math.sin(t * 30) * .3 : .1, aL: 1.6, aR: up ? 2.2 : .5, eyes: up ? 'spark' : 'look', lookX: -1, mouth: up ? 'grin' : 'smile', noShadow: up, rot: up ? -.2 : 0 });
      if (t < 33.98) a02_bubble('ПОТРАТЬ МЕНЯ', rx - 330, ry - bh + 60, 38, t - 32.6);
      if (t > 33.9) punkText('ВПЕРЁД', 560, camY - 250, 70, t, 33.98, { seed: 8 });
      if (t > 34.6) punkText('К ЛУНЕ!', 1450, my + 260, 84, t, 34.62, { seed: 5 });
    });
  }

  // ---------- 35.1 a game nobody plays → an agent plays it for the report ----------
  function a02_game(t, lt) {
    a02_wall(t, '#20243A', C.uv, 17);
    a02_view(t, W / 2, H / 2, lerp(1.0, 1.06, lt / 2.65));
    a02_free(t, () => uiCard(70, 60, 720, 190, { title: 'Clawd', body: 'Сделай игру', icon: 'clawd', time: 'ПТ 20:14', k: .35 + .65 * clamp((t - 35.1) / .15), accent: C.magenta }));
    const dk = backOut((t - 35.22) / .22);
    if (dk > .01) a02_panel(t, 520, 230, 720, 700, 23, () => {
      const cx = 880;
      paint([[cx - 190, 330], [cx + 190, 330], [cx + 220, 900], [cx - 220, 900]], { wash: C.magenta, fill: '#9A1A80', fillOp: 90, tex: .6, ink: INK, sw: 1 });
      paint(rectPts(cx - 200, 280, 400, 90, 1), { wash: C.hazard, ink: INK, sw: .8 });
      a02_tx('ТОКЕН-МЭН', cx, 325, 44, INK);
      paint(rectPts(cx - 150, 400, 300, 240, 1), { wash: '#0A1420', ink: INK, sw: .8 });
      // the game: a token chomping tokens on the screen
      for (let i = 0; i < 5; i++) paint(ellPts(cx - 110 + i * 50, 540, 7, 7, 8), { wash: C.hazard, ink: null });
      const px = cx - 120 + frac(t * .6) * 240; acidSmiley(px, 540, 26, t, {});
      const playing = t > 36.48, sc = playing ? Math.floor((t - 36.48) * 40) * 10 : 0;
      a02_tx('СЧЁТ ' + sc, cx, 430, 24, C.acid);
      a02_tx('ИГРОКОВ: ' + (playing ? 1 : 0), cx, 610, 26, playing ? C.acid : '#FF5A5A');
      paint(rectPts(cx - 200, 680, 400, 60, 1), { wash: C.gunmetal, ink: INK, sw: .7 });
      const js = playing ? Math.sin(t * 22) * .5 : 0;
      inkLine([[cx - 60, 700], [cx - 60 + Math.sin(js) * 40, 660]], 6, INK, 'ink', 0);
      paint(ellPts(cx - 60 + Math.sin(js) * 40, 655, 16, 16, 10), { wash: '#D8263A', ink: INK, sw: .5 });
      paint(ellPts(cx + 60, 712, 18, 12, 10), { wash: C.acid, ink: INK, sw: .5 });
      // nobody... then AGENT #7 walks in and plays
      if (t > 36.2) {
        const ax = lerp(1220, cx + 90, easeOut((t - 36.2) / .3));
        agentBot(ax, 895, 16, t, { n: 7, aL: playing ? 1.3 + Math.sin(t * 22) * .3 : .3, aR: .3, walk: t < 36.5 ? t * 3 : null, eyes: 'look', lookX: -1, mouth: 'flat', flip: false });
      }
      if (t < 36.3 && t > 35.8) a02_tx('…', cx + 260, 800, 80, C.cream);
    }, { dy: -(1 - dk) * 900 });
    // the report: «1 ПОЛЬЗОВАТЕЛЬ», +∞%
    if (t > 36.7) a02_panel(t, 1300, 170, 540, 520, 29, () => {
      a02_tx('ОТЧЁТ', 1570, 240, 48, INK);
      a02_tx('Аудитория игры:', 1570, 310, 28, '#55555F');
      const k = ease((t - 36.7) / .25);
      counter(1540, 400, 80, 1, { col: C.acid });
      a02_tx('ПОЛЬЗОВАТЕЛЬ', 1570, 480, 38, INK);
      inkLine([[1380, 640], [1380, 540], [1380, 640], [1760, 640]], 1.4, INK, 'inkfine', 0);
      inkLine([[1390, 630], [1390 + 360 * k, 630 - 70 * Math.pow(k, 4)]], 4, '#1E8A3C', 'ink', .3);
      stamp('РОСТ +∞%', 1600, 575, 40, t, 37.28, { col: '#1E8A3C', rot: -.12 });
    }, { s: backOut((t - 36.7) / .2), rot: .05 });
  }

  // ---------- 37.75 the unread site ----------
  function a02_site(t, lt) {
    a02_wall(t, C.gunDk, C.acid, 21);
    a02_view(t, W / 2, H / 2, lerp(1.0, 1.1, lt / 2.05), 0, 14);
    a02_panel(t, 150, 70, 1320, 860, 31, () => {
      paint(rectPts(200, 120, 1220, 760), { wash: '#FBF8F2', ink: INK, sw: .8 });
      paint(rectPts(200, 120, 1220, 60), { wash: '#D9D4CA', ink: INK, sw: .6 });
      for (let i = 0; i < 3; i++) paint(ellPts(235 + i * 32, 150, 10, 10, 8), { wash: ['#FF5F57', '#FEBC2E', '#28C840'][i], ink: null });
      paint(rrPts(360, 132, 700, 36, 16), { wash: '#FFFFFF', ink: INK, sw: .4 });
      a02_tx('мой-сайт-который-ты-просил.рф', 380, 151, 22, '#55555F', { align: 'left' });
      a02_tx('СЕРВИС ДЛЯ СЕРВИСОВ', 560, 250, 52, INK);
      a02_tx('Лендинг · 14 страниц · 3 языка · сгенерировано за 2 000 000 токенов', 560, 305, 21, '#8A8A95');
      for (let i = 0; i < 9; i++) paint(rectPts(260, 360 + i * 44, 560 - (i % 3) * 90, 14), { wash: '#C9C3B8', ink: null });
      paint(rectPts(880, 350, 480, 330, 1), { wash: '#E6E0D4', ink: INK, sw: .5 });
      inkLine([[880, 350], [1360, 680]], .8, '#B8B0A0', 'inkfine', 0); inkLine([[1360, 350], [880, 680]], .8, '#B8B0A0', 'inkfine', 0);
      paint(rrPts(260, 780, 260, 64, 20), { wash: C.magenta, ink: INK, sw: .6 });
      a02_tx('КУПИТЬ', 390, 812, 30, C.cream);
      // cobweb in the top-left corner of the page, dust bunnies
      const wc = [205, 185];
      for (let i = 0; i < 6; i++) { const a = i / 5 * Math.PI / 2; inkLine([wc, [wc[0] + Math.cos(a) * 220, wc[1] + Math.sin(a) * 220]], .6, '#6A6A72', 'inkfine', 0); }
      for (let r = 50; r < 220; r += 45) { const pts = []; for (let i = 0; i <= 5; i++) { const a = i / 5 * Math.PI / 2; pts.push([wc[0] + Math.cos(a) * r * (i % 2 ? .9 : 1), wc[1] + Math.sin(a) * r * (i % 2 ? .9 : 1)]); } inkLine(pts, .6, '#6A6A72', 'inkfine', .5); }
      // tumbleweed rolls across the page
      const tw = lerp(1500, 150, (t - 37.75) / 2.05), ta = -(t - 37.75) * 8, ty = 740 - Math.abs(Math.sin((t - 37.75) * 5)) * 60;
      for (let i = 0; i < 7; i++) inkLine(ellPts(tw, ty, 50 - i * 4, 46 - i * 3, 10, 0, ta + i * .9).slice(0, 8), 2.2, '#8C6A3A', 'ink', .6);
      // visitor counter: 0
      paint(rrPts(1110, 720, 290, 130, 14), { wash: C.gunDk, ink: INK, sw: .7 });
      a02_tx('ПОСЕТИТЕЛЕЙ', 1255, 750, 24, C.cream);
      counter(1255, 805, 64, 0, { col: '#FF5A5A' });
      if (t > 38.32) glowAt(1255, 800, 150, '#FF3A3A', 110 * hitK(t, [38.32], .3));
    });
    a02_panel(t, 1500, 160, 360, 420, 37, () => {
      a02_tx('ПРОЧИТАНО:', 1680, 240, 34, INK);
      a02_tx('0 раз', 1680, 330, 80, '#D8263A');
      a02_tx('среднее время', 1680, 430, 24, '#55555F');
      a02_tx('на странице: 0 с', 1680, 465, 24, '#55555F');
    }, { rot: .06, s: t < 38.32 ? 0 : backOut((t - 38.32) / .2) });
    a02_free(t, () => stamp('НИКТО НЕ ЧИТАЛ', 820, 520, 76, t, 38.96, { col: '#D8263A', rot: -.1 }));
    glitchCut(t, 39.8);
  }

  chapter('friday', 20.1, 39.8, [
    [20.1, a02_hall], [22.65, a02_limits], [25.25, a02_park], [27.8, a02_furnace],
    [30.5, a02_waveoff], [32.5, a02_rocket], [35.1, a02_game], [37.75, a02_site]
  ]);
})();
