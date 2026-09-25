// a10_sunday.js: «Жги токены» v2, the finish (197.9–239). Quiet spoken outro in Clawd's dark room, then the loop restarts.
// 197.9 the room at «ВС 23:58» → 205.65 laptop close-up, «ноль токенов», the bar goes grey → 207.6 camera tours the useless
// output (3 games / 7 sites / 42 agents) that go grey at «ни один не нужен» → 213.95 «тишина», Clawd walks to the window →
// 216.8 «я счастлив» under the moon → 218.45 «полночь», the clock flips to ПН 00:00 → 220.7 «Ваш недельный лимит
// восстановлен» + the one Matrix glitch, the bar refills → 224.2 «…Сука.» deadpan → 227.2 «Эй! Эй!» two presses →
// 229 the conveyor delivers a new week as a gift box, the factory unfolds out of it → 237.2 «…Сука.», the lid closes,
// «Продолжить» lights up → 237.85 credit card: AGENT #42 strikes out "rocketmandrey" and writes «Claude Opus 5.5».
(() => {
  const NIGHT = '#0E111A', WALL = '#1B2133', WALL2 = '#262F47', FLOOR = '#131722', GREY = '#5A5D65', SCREEN = '#9CC4FF';
  const AG = { col: '#6F8BE0', dk: '#3D55A8', lt: '#B5C6F0' };
  const RED = '#E3262E';
  const dim = (c, g = 0, d = 0) => mixCol(mixCol(c, GREY, g), NIGHT, d);
  const bgFill = (col, fill, op = 90) => paint(rectPts(-400, -400, W + 800, H + 800), { wash: col, fill: fill || col, fillOp: op, tex: .5, border: .3, ink: null });

  // ---------- the room (world = 1920 x 1080) ----------
  function windowMoon(x, y, w, h, t, o = {}) {
    const mk = o.moonK || 0;
    paint(rectPts(x - 18, y - 18, w + 36, h + 36, 1), { wash: '#2A2230', ink: PAL.ink, sw: .9 });
    paint(rectPts(x, y, w, h), { wash: '#16213F', fill: '#2E4274', fillOp: 110, bleed: .15, tex: .5, border: .4, ink: null });
    for (let i = 0; i < 14; i++) {
      const sx = x + 20 + hash(i * 3.1) * (w - 40), sy = y + 15 + hash(i * 5.7) * h * .55, r = 1.5 + hash(i) * 2.5 * (1 + .4 * Math.sin(t * 2 + i));
      paint(ellPts(sx, sy, r, r, 6), { wash: '#F4EFD8', washOp: 200, ink: null });
    }
    const mx = x + w * .62, my = y + h * .33, mr = 58;
    glowAt(mx, my, mr * (2.2 + mk * .9), '#DDE6F2', 45 + 70 * mk);
    paint(ellPts(mx, my, mr, mr, 26), { wash: '#F2EEDC', fill: '#D8D2B8', fillOp: 70, tex: .5, border: .5, ink: '#8A8468', sw: .6 });
    for (const [cx, cy, r] of [[-.3, -.2, .18], [.25, .15, .13], [-.05, .4, .1], [.35, -.35, .08]]) paint(ellPts(mx + cx * mr, my + cy * mr, r * mr, r * mr, 10), { wash: '#CFC7A6', washOp: 170, ink: null });
    // city silhouette with a few lit windows
    const base = y + h;
    for (let i = 0; i < 7; i++) {
      const bw = w / 7 + 6, bx = x + i * w / 7 - 3, bh = 70 + hash(i * 9.3) * 130;
      paint(rectPts(bx, base - bh, bw, bh), { wash: '#0B0E17', ink: null });
      for (let q = 0; q < 3; q++) if (hash(i * 7 + q) > .55) paint(rectPts(bx + 8 + q * 18, base - bh + 18 + hash(i + q) * 40, 7, 9), { wash: '#FFD27A', washOp: 190, ink: null });
    }
    paint(rectPts(x + w / 2 - 6, y, 12, h), { wash: '#2A2230', ink: null });
    paint(rectPts(x, y + h * .5 - 6, w, 12), { wash: '#2A2230', ink: null });
    paint(rectPts(x - 30, y + h + 10, w + 60, 22, 1), { wash: '#3A3040', ink: PAL.ink, sw: .7 });
  }

  function clock(x, y, w, h, txt, t, glow = 0) {
    paint(rrPts(x, y, w, h, 18, 1), { wash: '#0A0B10', fill: '#1E2029', fillOp: 70, tex: .4, ink: PAL.ink, sw: .9 });
    glowAt(x + w / 2, y + h / 2, w * .45, '#FF3B3B', 30 + 60 * glow);
    const s = h * .42;
    letter(txt, x + w / 2, y + h * .54, s, '#FF4A40', { font: ruFont(s), ink: false });
  }

  function games(t, g, d) {
    paint(rectPts(610, 400, 310, 14, 1), { wash: dim('#4A3A30', g, d), ink: PAL.ink, sw: .6 });
    ['#FF2BD6', '#B6FF1A', '#6A2BFF'].forEach((c, i) => {
      const x = 628 + i * 96, top = 262, cw = 82;
      paint([[x, 400], [x, top + 20], [x + 8, top], [x + cw - 8, top], [x + cw, top + 20], [x + cw, 400]], { wash: dim(c, g, d), fill: dim('#2A1840', g, d), fillOp: 60, tex: .5, ink: PAL.ink, sw: .6 });
      paint(rectPts(x + 10, top + 30, cw - 20, 52), { wash: dim('#0B1020', 0, d * .5), ink: PAL.ink, sw: .4 });
      paint(rectPts(x + 6, top + 92, cw - 12, 16), { wash: dim('#2B2F36', g, d), ink: null });
      paint(ellPts(x + 26, top + 100, 5, 5, 8), { wash: dim(RED, g, d), ink: null });
      letter('0', x + cw / 2, top + 50, 24, dim('#7DFFAE', g, d), { font: ruFont(24), ink: false });
      letter('ИГРОКОВ', x + cw / 2, top + 70, 9, dim('#7DFFAE', g, d), { font: ruFont(9), ink: false });
    });
  }

  function sites(t, g, d) {
    paint(rectPts(930, 150, 470, 270, 1), { wash: dim('#6B4A2E', g, d), fill: dim('#4A321E', g, d), fillOp: 80, tex: .7, ink: PAL.ink, sw: .7 });
    for (let i = 0; i < 7; i++) {
      const row = i < 4 ? 0 : 1, col = row ? i - 4 : i, bw = 98, bh = 104;
      const x = 948 + col * 112 + (row ? 56 : 0), y = 166 + row * 124, rot = (hash(i * 2.3) - .5) * .12;
      paint(rotPts(rrPts(x, y, bw, bh, 6), x + bw / 2, y + bh / 2, rot), { wash: dim('#ECE6DA', g, d), ink: PAL.ink, sw: .5 });
      paint(rotPts(rectPts(x, y, bw, 16), x + bw / 2, y + bh / 2, rot), { wash: dim(['#2E5BFF', '#FF2BD6', '#2FBF71', '#FF8A1F'][i % 4], g, d), ink: null });
      inkLine([[x + 12, y + 38], [x + bw - 14, y + 38]], .5, dim('#8A95A1', g, d), 'inkfine', 0);
      inkLine([[x + 12, y + 54], [x + bw - 30, y + 54]], .5, dim('#8A95A1', g, d), 'inkfine', 0);
      letter('0 визитов', x + bw / 2, y + 82, 12, dim('#B4502A', g, d), { font: ruFont(12), ink: false, rot });
      paint(ellPts(x + bw / 2, y + 2, 5, 5, 8), { wash: dim(RED, g, d), ink: null });   // pin
    }
  }

  function agents(t, g, d) {
    for (let r = 0; r < 6; r++) {
      const gy = 468 + r * 64;
      paint(rectPts(1440, gy - 4, 460, 14, 1), { wash: dim('#3A3040', 0, d * .5), ink: null });
      for (let c = 0; c < 7; c++) {
        const i = r * 7 + c, x = 1478 + c * 60 + (r % 2) * 14, u = 5;
        const grey = clamp(g * 3 - hash(i * 1.7) * 2);                                   // they go grey in a ripple
        // ponytail: 42 cheap block agents (4-5 washes each), not clawd(): 42 full clawds cost ~3 s/frame
        const ac = dim(AG.col, grey, d), dk = dim(AG.dk, grey, d), bob = grey > .5 ? 0 : -Math.abs(Math.sin(t * 3 + i)) * 2;
        paint(rectPts(x - 4 * u, gy - 2.2 * u, 8 * u, 2.2 * u), { wash: dk, ink: null });
        paint(rectPts(x - 5 * u, gy - 8 * u + bob, 10 * u, 6 * u), { wash: ac, ink: PAL.ink, sw: .35 });
        paint(rectPts(x - 1.4 * u, gy - 3.6 * u + bob, 2.8 * u, 1.3 * u), { wash: dim(TK.cream, grey, d), ink: null });
        if (grey > .5) inkLine([[x - 3.3 * u, gy - 5.8 * u], [x + 3.3 * u, gy - 5.8 * u]], .5, PAL.ink, 'inkfine', 0);
        else { paint(rectPts(x - 3 * u, gy - 7 * u + bob, u, 2 * u), { wash: PAL.ink, ink: null }); paint(rectPts(x + 2 * u, gy - 7 * u + bob, u, 2 * u), { wash: PAL.ink, ink: null }); }
      }
    }
  }

  // o: clock, moonK, grey {games, sites, agents}, lit {games, sites, agents}, clawd fn, sit (Clawd at the desk), glow (laptop)
  function room(t, o = {}) {
    const g = o.grey || {}, lit = o.lit || {}, D = .55;
    bgFill(WALL, WALL2);
    paint(rectPts(-400, 840, W + 800, 700), { wash: FLOOR, fill: '#0A0D15', fillOp: 90, tex: .5, ink: null });
    inkLine([[-300, 842], [W + 300, 840]], 1, '#07080C', 'ink', 0);
    windowMoon(110, 120, 450, 440, t, o);
    paint([[140, 590], [560, 590], [800, 1000], [240, 1000]], { wash: '#DDE6F2', washOp: 14 + 22 * (o.moonK || 0), ink: null });  // moonlight on the floor
    for (const [k, cx, cy, r] of [[lit.games, 770, 330, 220], [lit.sites, 1165, 285, 280], [lit.agents, 1670, 640, 300]]) if (k > .02) glowAt(cx, cy, r, '#FFD27A', 70 * k);
    games(t, g.games || 0, D * (1 - (lit.games || 0)));
    sites(t, g.sites || 0, D * (1 - (lit.sites || 0)));
    clock(1480, 120, 340, 160, o.clock || 'ВС 23:58', t, o.clockGlow || 0);
    agents(t, g.agents || 0, D * (1 - (lit.agents || 0)));
    if (o.clawd) o.clawd();
    // desk + laptop (lid back to camera, screen light spilling round it)
    const gl = o.glow ?? 1;
    glowAt(1220, 610, 190, SCREEN, 60 * gl);
    paint(rrPts(1105, 552, 230, 150, 10, 1), { wash: '#3A4252', fill: '#232A36', fillOp: 90, tex: .5, ink: SCREEN, sw: .7 });
    token(1220, 625, 17, { ink: false });
    paint(rectPts(600, 698, 790, 30, 1), { wash: '#3A2E2A', fill: '#251D1A', fillOp: 90, tex: .5, ink: PAL.ink, sw: .8 });
    for (const lx of [630, 1340]) paint(rectPts(lx, 726, 22, 116), { wash: '#251D1A', ink: PAL.ink, sw: .5 });
    paint(ellPts(760, 682, 26, 18, 12), { wash: '#C8C0B0', ink: PAL.ink, sw: .5 });                                          // mug
    paint(rectPts(734, 660, 52, 34), { wash: '#C8C0B0', ink: PAL.ink, sw: .5 });
    steam(760, 652, t, { k: .35, len: 90, n: 3, per: 2.2, col: '#8A95A1' });
    if (o.front) o.front();
  }
  const sitClawd = (t, extra = {}) => () => {
    clawd(900, 760, 26, { eyes: 'look', lookX: 1, aL: .15, aR: .5, mouth: 'flat', seed: 3, ...extra });
    paint(ellPts(990, 620, 130, 110, 16), { fill: SCREEN, fillOp: 55, bleed: .3, tex: .2, border: .1, ink: null });
  };

  // ---------- laptop screen close-up (screen space) ----------
  function screenCU(t, content) {
    bgFill('#0B0D14', '#161A24');
    glowAt(960, 480, 900, SCREEN, 40);
    paint(rrPts(220, 50, 1480, 870, 42, 1), { wash: '#1A1D24', fill: '#2B2F36', fillOp: 70, tex: .4, ink: PAL.ink, sw: 1.2 });
    paint(ellPts(960, 74, 6, 6, 8), { wash: '#2E5BFF', ink: null });
    paint(rectPts(262, 96, 1396, 786), { wash: '#0E1526', fill: '#1A2B4E', fillOp: 80, tex: .4, border: .3, ink: null });
    content();
  }
  const noLimitMsg = (grey) => letter('Лимит исчерпан · сброс в ПН 00:00', 960, 640, 34, grey ? '#6A6E78' : '#C9D3E6', { font: ruFont(34), ink: false });

  // ---------- gift box ----------
  function giftBox(x, y, w, h, t, o = {}) {
    const lid = o.lid || 0, pull = o.pull || 0, top = y - h;
    paint(rectPts(x - w / 2, top, w, h, 1.5), { wash: '#C8324A', fill: '#8A1E32', fillOp: 90, tex: .6, border: .4, ink: PAL.ink, sw: 1 });
    paint(rectPts(x - w * .07, top, w * .14, h), { wash: A2.hazard, ink: PAL.ink, sw: .5 });
    if (o.open) {
      paint(rectPts(x - w / 2 + 12, top - 6, w - 24, 20), { wash: '#FFF3C8', ink: null });
      return;
    }
    // lid (flies off after the burst)
    push(); translate(x, top - lid * 520); rotate(-lid * 2.4);
    paint(rectPts(-w * .54, -h * .22, w * 1.08, h * .24, 1.5), { wash: '#D8394E', fill: '#8A1E32', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1 });
    paint(rectPts(-w * .07, -h * .22, w * .14, h * .24), { wash: A2.hazard, ink: PAL.ink, sw: .5 });
    if (pull < .6) for (const s of [-1, 1]) paint(ellPts(s * w * .13 * (1 - pull), -h * .3, w * .14 * (1 - pull * .8), h * .1, 12, 0, s * .4), { wash: A2.hazard, ink: PAL.ink, sw: .6 });
    pop();
    // the ribbon tail Clawd pulls
    if (pull > 0 && lid < .05) inkLine([[x, top - h * .28], [lerp(x, o.hand[0], .5), lerp(top, o.hand[1], .5) + 30 * (1 - pull)], o.hand], 3, A2.hazard, 'ink', .5);
  }
  function giftTag(x, y, t) {
    inkLine([[x - 40, y - 70], [x - 10, y - 40], [x, y - 8]], .8, PAL.ink, 'inkfine', .4);
    const rot = .09 + Math.sin(t * 2.2) * .03;
    paint(rotPts(rectPts(x - 20, y - 10, 300, 120, 1), x, y, rot), { wash: A2.cream, fill: '#CFC4AA', fillOp: 60, tex: .6, ink: PAL.ink, sw: .8 });
    const P = (dx, dy) => [x + dx * Math.cos(rot) - dy * Math.sin(rot), y + dx * Math.sin(rot) + dy * Math.cos(rot)];
    paint(ellPts(...P(0, 0), 7, 7, 8), { wash: '#3A3530', ink: null });
    letter('НЕДЕЛЯ 40', ...P(130, 30), 40, A2.rust, { font: ruFont(40), ink: false, rot });
    letter('1 000 000 токенов', ...P(130, 78), 27, '#2B2233', { font: ruFont(27), ink: false, rot });
  }

  // an item that pops out of the box: grows from (bx, by) into its final place around (fx, fy)
  function unfold(t, t0, bx, by, fx, fy, draw) {
    const e = backOut(seg(t, t0, t0 + .5)); if (e < .02) return;
    const m = easeOut(seg(t, t0, t0 + .5));
    push(); translate(lerp(bx, fx, m), lerp(by, fy, m)); scale(e); translate(-fx, -fy); draw(); pop();
  }

  // ---------- shots ----------
  function sRoom(t) {                                                         // 197.9 «Воскресенье. 23:58»
    const z = kf(t, [[197.9, 1], [205.65, 1.14]]), cx = kf(t, [[197.9, 960], [205.65, 1040]]), cy = kf(t, [[197.9, 520], [205.65, 470]]);
    const fl = hitK(t, [198.26, 199.94, 202.61, 203.28, 204.93], .12);
    camBegin(cx, cy, z);
    room(t, { clockGlow: hitK(t, [200.88, 203.24], .5), glow: 1 - .35 * fl, clawd: sitClawd(t, { eyes: 'look', lookX: 1 }) });
    camEnd();
    glitchCut(t, 197.9);
  }

  function sZero(t) {                                                         // 205.65 «Ноль токенов»
    const grey = t > 205.9, flick = t > 205.72 && t < 205.9 && frac(t * 30) < .5;
    screenCU(t, () => {
      if (!flick) limitBar(460, 400, 1000, 0, { h: 92, grey });
      letter('0 токенов', 960, 270, 110, grey ? '#6A6E78' : '#FF5A4A', { font: ruFont(110), ink: false, pop: seg(t, 205.72, 205.95) * 1.2 + (t < 205.72 ? -1 : 0) });
      noLimitMsg(grey);
    });
  }

  function sTour(t) {                                                         // 207.6 3 games, 7 sites, 42 agents → «ни один не нужен»
    const cam = kf(t, [[207.6, [770, 330, 2.1]], [208.8, [770, 330, 2.2]], [209.1, [1165, 285, 2.0]], [210.16, [1165, 285, 2.05]], [210.45, [1670, 640, 1.65]],
      [212.28, [1670, 640, 1.7]], [212.8, [1060, 470, 1.05]]], easeOut);
    const lit = { games: seg(t, 207.6, 207.8), sites: seg(t, 208.8, 209.0), agents: seg(t, 210.16, 210.4) };
    const grey = { games: seg(t, 212.28, 212.6), sites: seg(t, 213.06, 213.3), agents: seg(t, 213.36, 213.95) };
    for (const k of ['games', 'sites', 'agents']) lit[k] *= 1 - grey[k];
    camBegin(cam[0], cam[1], cam[2]);
    room(t, { lit, grey, clawd: sitClawd(t, { eyes: t > 212.3 ? 'narrow' : 'look', lookX: 1 }) });
    // the count stamps, one per group
    if (t < 212.28) {
      if (t >= 207.68 && t < 208.8) stamp('3 ИГРЫ', 770, 215, 34, t, 207.68, { col: A2.hazard, rot: -.06, punch: 0 });
      if (t >= 208.8 && t < 210.16) stamp('7 САЙТОВ', 1165, 118, 30, t, 208.8, { col: A2.hazard, rot: .05, punch: 0 });
      if (t >= 210.16) stamp('42 АГЕНТА', 1670, 420, 34, t, 210.16, { col: A2.hazard, rot: -.05, punch: 0 });
    }
    camEnd();
  }

  function sSilence(t) {                                                      // 213.95 «Тишина…»: he gets up, walks to the window
    const z = kf(t, [[213.95, 1.05], [216.8, .98]]), up = seg(t, 214.4, 214.7), wk = seg(t, 214.7, 216.6);
    const x = lerp(900, 420, ease(wk)), gy = lerp(760, 840, up);
    camBegin(kf(t, [[213.95, 1060], [216.8, 900]]), 480, z);
    room(t, {
      grey: { games: 1, sites: 1, agents: 1 }, moonK: seg(t, 215.5, 216.8) * .5, glow: .7,
      clawd: () => { if (up < .01) sitClawd(t, { eyes: 'narrow' })(); },
      front: () => {
        if (up >= .01) clawd(x, gy, 26, { walk: wk > 0 && wk < 1 ? (t - 214.7) * 1.6 : null, dy: up < 1 ? -Math.sin(up * Math.PI) * .6 : 0, flip: true, eyes: 'normal', mouth: null, seed: 3, aL: .2, aR: .2 });
      }
    });
    camEnd();
    for (let i = 0; i < 10; i++) {                                            // dust in the moonbeam
      const p = frac(t * .05 + hash(i)), dx = 300 + hash(i * 3) * 500 + Math.sin(t * .6 + i) * 20, dy = 400 + p * 400;
      paint(ellPts(dx, dy, 2.5, 2.5, 6), { wash: '#DDE6F2', washOp: 90, ink: null });
    }
  }

  function sHappy(t) {                                                        // 216.8 «Я счастлив.» under the moon
    const z = kf(t, [[216.8, 1.4], [218.45, 1.5]]);
    camBegin(400, 560, z);
    room(t, { grey: { games: 1, sites: 1, agents: 1 }, moonK: 1, glow: .5,
      front: () => {
        clawd(420, 840, 26, { ...mood(t, [[216.8, 'normal'], [217.58, 'happy']]), mouth: t > 217.58 ? 'smile' : null, blush: t > 217.7, seed: 3, aL: .25, aR: .25, dy: -.15 * Math.sin(t * 2) });
        paint(ellPts(420, 660, 150, 120, 16), { fill: '#DDE6F2', fillOp: 45, bleed: .3, tex: .2, ink: null });
      } });
    camEnd();
  }

  function sMidnight(t) {                                                     // 218.45 «Полночь.»: ВС 23:59 → ПН 00:00 on the 219.18 hit
    const z = kf(t, [[218.45, 2.6], [220.7, 3.0]]), flip = t >= 219.18;
    camBegin(1650, 215, z);
    room(t, { grey: { games: 1, sites: 1, agents: 1 }, moonK: .6, glow: .5, clock: flip ? 'ПН 00:00' : 'ВС 23:59', clockGlow: hitK(t, [219.18], .6) });
    camEnd();
    if (Math.abs(t - 219.18) < .05) flash(.25, '#FF4A40');
  }

  function sReset(t) {                                                        // 220.7 the notification, the one Matrix glitch, the bar refills
    const mx = seg(t, 220.9, 221.1) * (1 - seg(t, 222.25, 222.45)), fill = ease(seg(t, 222.45, 223.18)), full = t >= 223.18;
    const ring = t - 220.76;
    screenCU(t, () => {
      limitBar(460, 470, 1000, fill, { h: 92, grey: fill < .01, glow: full ? .6 + .4 * hitK(t, [223.18, 223.68, 224.18], .4) : 0 });
      if (fill < .01) noLimitMsg(true);
      if (fill > .01) tokenRain(t, { n: 14, r: 20, seed: 4, area: [300, 1620] });
      if (full) stamp('+1 000 000', 960, 740, 64, t, 223.18, { col: '#2FBF71', rot: -.08 });
      const jx = mx > .1 ? (hash(Math.floor(t * 24)) - .5) * 40 * mx : 0;
      uiCard(400 + jx, 130, 1120, 210, { title: 'Ваш недельный лимит восстановлен', body: 'Приятной недели! · 1 000 000 токенов', icon: 'token', time: '00:00', k: seg(t, 220.72, 221.0), accent: A2.matrix });
      if (mx > .01) {
        matrixRain(t, { area: [262, 96, 1396, 786], bg: mx > .5, k: .35 + .55 * mx, size: 30, seed: 7, speed: 1.4 });
        if (mx > .5) letter('ВАШ НЕДЕЛЬНЫЙ ЛИМИТ ВОССТАНОВЛЕН', 960 + jx * 2, 235, 44, A2.matrix, { font: ruFont(44), ink: false, alpha: .9 });
      }
    });
    if (ring > 0 && ring < .5) for (let i = 0; i < 3; i++) inkLine([[1400 + i * 22, 150 - i * 14], [1430 + i * 22, 120 - i * 14]], 2, '#C9D3E6', 'inkfine', 0);
    if (mx > .05) glitchCut(t, 221.65, { span: .8, k: .55 * mx, n: 7, cols: [A2.matrix, A2.matrixBg, '#7DFFAE', '#0B3D1E'] });
    if (full) flash(.7 * hitK(t, [223.18], .1), '#E6FFE8');
  }

  function sSuka(t) {                                                         // 224.2 «…Сука.» deadpan close-up
    const z = kf(t, [[224.2, 1], [227.2, 1.1]]);
    camBegin(960, 560, z);
    bgFill(WALL, WALL2);
    windowMoon(-60, 90, 520, 520, t, { moonK: .3 });
    glowAt(1500, 800, 700, '#9CFFB8', 60);
    const blink = t > 225.9 && t < 226.05;
    clawd(960, 1010, 62, { eyes: 'narrow', squint: blink ? 1 : 0, mouth: 'flat', aL: .1, aR: .1, noShadow: true, seed: 3 });
    paint(ellPts(1220, 700, 330, 300, 18), { fill: '#9CFFB8', fillOp: 70, bleed: .3, tex: .2, border: .1, ink: null });   // green screen light from below-right
    camEnd();
  }

  function sHey(t) {                                                          // 227.2 «Эй! Эй!»: two presses
    const HEY = [227.28, 228.8], k = hitK(t, HEY, .15), [sx, sy] = shakeXY(t, 16 * k);
    camBegin(960 + sx, 540 + sy, 1);
    bgFill(A2.gunDk, A2.gunmetal);
    glowAt(960, 420, 900, A2.sodium, 55);
    for (const px of [120, 1800]) paint(rectPts(px - 26, -60, 52, 1000), { wash: A2.rust, fill: '#6E2E18', fillOp: 80, tex: .5, ink: PAL.ink, sw: .6 });
    paint(rectPts(-60, 840, W + 120, 300), { wash: '#15181D', ink: null });
    hazard(-40, 836, W + 80, 26);
    press(180, 250, 520, 580, t, [HEY[0]], { seed: 11 });
    press(1220, 250, 520, 580, t, [HEY[1]], { seed: 23 });
    siren(960, 250, t, { on: .4 + .6 * k, len: 700 });
    const second = t >= HEY[1];
    clawd(960, 838, 17, { eyes: second ? 'narrow' : t >= HEY[0] ? 'scared' : 'narrow', mouth: second ? 'flat' : t >= HEY[0] ? 'o' : 'flat', take: -.25 * k, seed: 3 });
    stamp('ЭЙ!', 440, 150, 96, t, HEY[0], { col: A2.hazard, rot: -.1 });
    stamp('ЭЙ!', 1480, 150, 96, t, HEY[1], { col: A2.hazard, rot: .08 });
    camEnd();
    glitchCut(t, 227.2);
  }

  function sGift(t) {                                                         // 229 the new week, gift-wrapped; 231.79 it opens: the factory unfolds
    const OPEN = 231.79, BX = 1060, BY = 700, bw = 280, bh = 210, arrive = 230.8;
    const boxX = t < arrive ? lerp(1880, BX, easeOut(seg(t, 229.0, arrive))) : BX;
    const open = t >= OPEN, unf = seg(t, OPEN, 236.6);
    const slams = hitsIn(232.4, 237.2);
    const cam = t < OPEN ? [kf(t, [[229, 1200], [231, 1020]]), 560, kf(t, [[229, 1.25], [231.7, 1.38]])] : [lerp(1020, 960, ease(unf)), lerp(560, 470, ease(unf)), lerp(1.38, .78, easeOut(unf))];
    const kk = hitK(t, slams, .14), [sx, sy] = shakeXY(t, 10 * kk);
    camBegin(cam[0] + sx, cam[1] + sy, cam[2]);
    bgFill(mixCol(A2.gunDk, '#3A1A10', seg(t, OPEN, 234)), A2.gunmetal);
    glowAt(BX, 500, 1300, A2.sodium, 20 + 60 * unf);
    paint(rectPts(-800, 820, W + 1600, 700), { wash: '#15181D', fill: '#0C0E12', fillOp: 90, tex: .5, ink: null });
    // the factory unfolding out of the box, back to front
    const bxc = BX, byc = BY - bh / 2;
    unfold(t, 233.12, bxc, byc, 960, 820, () => {
      for (const cx of [300, 1640]) {
        paint(rectPts(cx - 70, -500, 140, 1320, 1), { wash: A2.rust, fill: '#6E2E18', fillOp: 90, tex: .6, ink: PAL.ink, sw: 1 });
        for (let q = 0; q < 6; q++) paint(rectPts(cx - 78, -420 + q * 200, 156, 16), { wash: '#6E2E18', ink: null });
        fire(cx, -480, 180, 260, t, { seed: cx, glow: false });
      }
    });
    unfold(t, 233.78, bxc, byc, 100, 150, () => gear(100, 150, 170, t, { speed: .35 }));
    unfold(t, 233.78, bxc, byc, 1860, 180, () => gear(1860, 180, 140, t, { speed: -.4, col: A2.rust }));
    unfold(t, 234.43, bxc, byc, 960, 180, () => conveyor(200, 180, 1520, t, { items: ['token', 'task'], speed: -260, legs: 0, gap: 230 }));
    unfold(t, 233.12, bxc, byc, 960, 820, () => { for (const [fx, fw] of [[-200, 900], [440, 480], [1480, 480], [2120, 900]]) fire(fx, 822, fw, 420, t, { seed: fx + 5, k: .7 + .3 * hitK(t, slams, .3) }); });
    unfold(t, 232.45, bxc, byc, 70, 520, () => press(-190, 220, 520, 600, t, slams.filter((h, i) => i % 2 === 0), { seed: 5 }));
    unfold(t, 232.45, bxc, byc, 1850, 520, () => press(1590, 220, 520, 600, t, slams.filter((h, i) => i % 2 === 1), { seed: 9 }));
    unfold(t, 235.09, bxc, byc, 960, 470, () => siren(BX, 470, t, { len: 900 }));
    // the conveyor that delivered it
    conveyor(BX - 170, BY, 1500, Math.min(t, arrive), { items: [() => {}], speed: 220, legs: 110 });
    // light out of the open box
    if (open) paint([[BX - 120, BY - bh], [BX + 120, BY - bh], [BX + 420, -300], [BX - 420, -300]], { wash: '#FFF3C8', washOp: 70 * (1 - .6 * unf), ink: null });
    const pull = seg(t, 231.0, 231.6), hand = [880 + 30 * pull, 640];
    giftBox(boxX, BY, bw, bh, t, { open, lid: open ? easeOut(seg(t, OPEN, OPEN + .6)) : 0, pull, hand });
    if (!open) giftTag(boxX + bw / 2 + 10, BY - bh * .62, t);
    // tokens spraying out of the box into the fires
    if (open) for (let i = 0; i < 12; i++) {
      const p = frac((t - OPEN) * .7 + hash(i * 3.3)), side = hash(i) < .5 ? -1 : 1, dist = 300 + hash(i * 7) * 700;
      const x = BX + side * dist * p, y = BY - bh - Math.sin(p * Math.PI) * (380 + hash(i * 5) * 260) + p * 200;
      token(x, y, 21, { spin: t * 1.2 + i * .3 });   // ponytail: no burn here, burn spawns a fire() per coin
    }
    // Clawd, deadpan, pulling the ribbon
    clawd(760, 822, 24, { eyes: open ? 'narrow' : 'look', lookX: 1, mouth: 'flat', aR: t < OPEN ? lerp(.2, .45, pull) : .2, aL: .2, take: -.2 * hitK(t, [OPEN], .2), seed: 3 });
    if (open) paint(ellPts(800, 700, 160, 140, 14), { fill: A2.sodium, fillOp: 60 * unf, bleed: .3, tex: .2, ink: null });
    camEnd();
    // the new week's bar burns down
    if (open) limitBar(560, 64, 800, lerp(1, .12, ease(seg(t, OPEN, 237.2))), { h: 54, burn: 1 });
    flash(.8 * hitK(t, [OPEN], .12), '#FFF3C8');
  }

  function sLast(t) {                                                         // 237.2 the last «…Сука.», the lid closes, «Продолжить»
    if (t < 237.47) {
      bgFill('#3A1A10', A2.rust);
      fire(960, 1100, 2200, 520, t, { seed: 3, k: .8 });
      clawd(960, 1040, 60, { eyes: 'narrow', mouth: 'flat', aL: .1, aR: .1, noShadow: true, seed: 3 });
      paint(ellPts(960, 640, 360, 280, 18), { fill: SCREEN, fillOp: 50, bleed: .3, tex: .2, ink: null });
      glitchCut(t, 237.2, { span: .06 });
      return;
    }
    const p = easeIn(seg(t, 237.47, 237.62)), yh = 560, ytop = lerp(yh - 480, 860, p);
    bgFill('#0B0D14', '#1A1D24');
    paint([[520, yh], [1400, yh], [1480, 860], [440, 860]], { wash: '#3A4252', fill: '#232A36', fillOp: 90, tex: .5, ink: PAL.ink, sw: 1 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) {                // keyboard
      const f = (r + .5) / 4.6, y = lerp(yh + 20, 830, f), x0 = lerp(560, 490, f), x1 = lerp(1360, 1430, f), kx = lerp(x0, x1, c / 12);
      paint(rectPts(kx + 3, y, (x1 - x0) / 12 - 8, 42 * (.8 + f * .3)), { wash: '#1C2029', ink: null });
    }
    if (ytop < yh) {                                                          // the screen, still facing us
      const hw = lerp(440, 440, 0);
      glowAt(960, (ytop + yh) / 2, 520, SCREEN, 70);
      paint([[960 - hw, ytop], [960 + hw, ytop], [960 + hw, yh], [960 - hw, yh]], { wash: '#3A4252', ink: PAL.ink, sw: 1 });
      paint([[960 - hw + 22, ytop + 20], [960 + hw - 22, ytop + 20], [960 + hw - 22, yh - 12], [960 - hw + 22, yh - 12]], { wash: '#FF8A1F', fill: '#8A2A10', fillOp: 110, tex: .5, ink: null });
    } else {                                                                  // the lid back, lying shut
      const f = (ytop - yh) / (860 - yh), hwT = lerp(440, 520, f);
      const q = [[960 - 440, yh], [960 + 440, yh], [960 + hwT, ytop], [960 - hwT, ytop]];
      paint(q, { wash: '#59636E', fill: '#3A4252', fillOp: 90, tex: .5, ink: PAL.ink, sw: 1.1 });
      const on = seg(t, 237.62, 237.7), cy = (yh + ytop) / 2, bh = 110 * f, bw = 440 * (.6 + .4 * f);
      if (f > .3) {
        glowAt(960, cy, 300 * on, A2.acid, 120 * on * (1 + .3 * pulse(t, 5)));
        paint(rrPts(960 - bw / 2, cy - bh / 2, bw, bh, bh / 2), { wash: on > .5 ? A2.acid : '#2B2F36', fill: '#6FB010', fillOp: 60 * on, tex: .4, ink: PAL.ink, sw: .9 });
        letter('Продолжить ▶', 960, cy + 2, 46 * f, on > .5 ? '#10220A' : '#8A95A1', { font: ruFont(46 * f), ink: false });
      }
    }
  }

  function sCredit(t) {                                                       // 237.85 the credit card: AGENT #42 takes the credit
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#060709', ink: null });
    const T0 = 237.85, S0 = 238.02, S1 = 238.2, W0 = 238.28, W1 = 238.68;
    letter('created by', 960, 300, 52, '#9A9488', { ink: false });
    letter('rocketmandrey', 960, 590, 96, A2.cream, { ink: false });
    flushLetters();                                                            // so the red strike lands over the name
    const NEW = 'Claude Opus 5.5', nx0 = 700, nx1 = 1235, ny = 450;
    // the pen point
    let P;
    if (t < S0) P = [1270, 592];
    else if (t < S1) { const p = seg(t, S0, S1); P = [lerp(1270, 640, p), 592 + Math.sin(p * 40) * 14]; }
    else if (t < W0) { const p = ease(seg(t, S1, W0)); P = [lerp(640, nx0, p), lerp(592, ny + 10, p)]; }
    else { const p = seg(t, W0, W1); P = [lerp(nx0, nx1, p), ny + 10 + Math.sin(p * 30) * 8]; }
    // the strike
    if (t >= S0) {
      const p = seg(t, S0, S1), n = Math.max(2, Math.ceil(p * 24)), pts = [];
      for (let i = 0; i <= n; i++) { const q = i / 24; pts.push([lerp(1270, 640, q), 592 + Math.sin(q * 40) * 14]); }
      inkLine(pts, 3.2, RED, 'ink', .3);
    }
    // the new name
    if (t >= W0) {
      const n = Math.round(seg(t, W0, W1) * NEW.length);
      if (n > 0) letter(NEW.slice(0, n), nx0, ny, 84, RED, { align: 'left', rot: -.035, ink: false });
    }
    // AGENT #42 with a giant marker, walking in and following the pen point
    const u = 24, R = 272, piv = 822 - 4.5 * u, sa = clamp((piv - P[1]) / R, -1, 1), a = Math.asin(sa);
    let x = P[0] - 4.9 * u - R * Math.cos(a);
    if (t < S0) x = lerp(2150, x, easeOut(seg(t, T0, S0)));
    const moving = t < W1, nod = seg(t, 238.74, 238.94);
    const marker = (uu, sw) => {
      paint(rrPts(-.2 * uu, -.45 * uu, (R / uu - 2.2) * uu, .9 * uu, .35 * uu), { wash: '#F4F1EA', ink: PAL.ink, sw: sw * .6 });
      paint(rectPts((R / uu - 3.6) * uu, -.5 * uu, 1.2 * uu, uu), { wash: RED, ink: PAL.ink, sw: sw * .5 });
      paint([[(R / uu - 2.4) * uu, -.3 * uu], [(R / uu - 2.05) * uu, 0], [(R / uu - 2.4) * uu, .3 * uu]], { wash: RED, ink: null });
    };
    agentBot(x, 822, u, t, { n: 42, walk: moving ? t * 3.2 : null, aR: a, aL: .3, armR: marker, eyes: t > 238.74 ? 'happy' : 'narrow', mouth: t > 238.74 ? 'smile' : 'flat',
      dy: -Math.sin(nod * Math.PI) * .5, rot: 0, sq: Math.sin(nod * Math.PI) * .08 });
  }

  chapter('sunday', 197.9, DUR + 1, [
    [197.9, sRoom], [205.65, sZero], [207.6, sTour], [213.95, sSilence], [216.8, sHappy], [218.45, sMidnight],
    [220.7, sReset], [224.2, sSuka], [227.2, sHey], [229.0, sGift], [237.2, sLast], [237.85, sCredit]
  ]);
})();
