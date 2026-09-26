// a10_sunday.js: «Жги токены» v2, the finish (197.9–239). Quiet spoken outro in Clawd's dark room, then the loop restarts.
// 197.9 the room at «ВС 23:58» → 205.65 laptop close-up, «ноль токенов», the bar goes grey → 207.6 camera tours the useless
// output (3 games / 7 sites / 42 agents) that go grey at «ни один не нужен» → 213.95 «тишина», Clawd walks to the window →
// 216.8 «я счастлив» under the moon → 218.45 «полночь», the clock flips to ПН 00:00 → 220.7 «Ваш недельный лимит
// восстановлен» + the one Matrix glitch, the bar refills → 224.2 «…Сука.» deadpan → 227.28 the first «Эй!» crashes the
// band back (v1's blast): the room blows apart into the furnace, a flash on the 2nd «Эй!» → 229.15 the data center reignites,
// Clawd swings the laptop as a guitar → 231.79 punk collage, one taped cutout per hit (shredder, idol, shrink-wrapped report, samsara wheel,
// CAPEX neon, ✓ «1 шт.», the train off the cliff), the limit burns 100 → 0 → 237.2 «…Сука.»: dead stop, soot Clawd alone on black →
// 237.85 «ЖГИ ТОКЕНЫ» stamp on soot black + credit: AGENT #42 strikes out "rocketmandrey" and writes «Claude Opus 5.5».
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
    // the office chair at the desk (he sits on it; it stays when he gets up)
    paint(rrPts(784, 596, 34, 170, 12), { wash: '#2E3440', fill: '#1C2028', fillOp: 90, tex: .4, ink: PAL.ink, sw: .7 });
    paint(rrPts(790, 752, 230, 26, 10), { wash: '#2E3440', fill: '#1C2028', fillOp: 90, tex: .4, ink: PAL.ink, sw: .7 });
    paint(rectPts(898, 778, 16, 58), { wash: '#4A505C', ink: PAL.ink, sw: .5 });
    for (const [x0, x1] of [[906, 820], [906, 992]]) inkLine([[x0, 834], [x1, 846]], 4, '#4A505C', 'ink', 0);
    for (const wx of [820, 992]) paint(ellPts(wx, 848, 9, 9, 8), { wash: '#15181E', ink: PAL.ink, sw: .4 });
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

  // ---------- shots ----------
  function sRoom(t) {                                                         // 197.9 «Воскресенье. 23:58»
    const z = kf(t, [[197.9, 1], [205.65, 1.14]]), cx = kf(t, [[197.9, 960], [205.65, 1040]]), cy = kf(t, [[197.9, 520], [205.65, 470]]);
    const fl = hitK(t, window.TIME_WARP ? hitsIn(197.9, 205.65, 10) : [198.26, 199.94, 202.61, 203.28, 204.93], .12);   // v3: the track's own hits
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
    const cam = kf(t, [[207.6, [770, 330, 2.1]], [208.8, [770, 330, 2.2]], [209.1, [1060, 300, 1.72]], [210.16, [1060, 300, 1.76]], [210.45, [1670, 640, 1.65]],
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
        const lean = easeOut(seg(t, 217.0, 217.6));                            // leans back, eyes shut, a small smile
        clawd(420, 840, 26, { eyes: lean > .3 ? 'closed' : 'normal', mouth: lean > .3 ? 'smile' : null, blush: t > 217.7, seed: 3,
          rot: -.12 * lean, aL: lerp(.25, -1.2, lean), aR: lerp(.25, -1.15, lean), dy: -.3 * lean, squint: lean > .15 && lean < .3 ? 1 : 0 });
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

  // v3 only (tokens3 warp): he says «Сука» with his eyes shut; the band crash cuts to this snap: the eyes fly open, red, on a zoom punch (v2 225.0+)
  const SNAP = 225.0;
  function sSnap(t) {
    const a = t - SNAP, k = Math.exp(-a * 7), u = 172 + 34 * Math.exp(-a * 12), [sx, sy] = shakeXY(t, 22 * k);
    bgFill('#2A0C08', '#5A1A0C', 90);
    glowAt(960, 1150, 1100, TK.ember, 140);
    for (let i = 0; i < 18; i++) {                                            // speed lines bursting out from the eyes
      const q = i / 18 * TAU + hash(i) * .2, r0 = 520 + a * 900, r1 = r0 + 260 + hash(i + 3) * 200;
      inkLine([[960 + Math.cos(q) * r0, 540 + Math.sin(q) * r0 * .6], [960 + Math.cos(q) * r1, 540 + Math.sin(q) * r1 * .6]], 3.5 * k + .5, i % 2 ? '#FFD9A0' : TK.ember, 'ink', 0);
    }
    clawd(960 + sx, 540 + 6 * u + sy, u, { eyes: 'red', squint: 1 - seg(a, 0, .06), mouth: 'flat', aL: -.6, aR: -.6, noShadow: true, seed: 3 });
    flash(.55 * Math.exp(-a / .1), '#FF7A3A');
  }
  function sSuka(t) {                                                         // 224.2 «…Сука.» deadpan close-up
    if (window.TIME_WARP && t >= SNAP) return sSnap(t);
    const u = 150 + (t - 224.2) * 8, shut = window.TIME_WARP || t < 224.57;   // EXTREME close-up: the face fills the frame, eyes shut, they open on «Сука» (224.57; v3 keeps them shut, see sSnap)
    bgFill(WALL, WALL2);
    glowAt(960, 1200, 900, '#9CFFB8', 90);
    clawd(960, 540 + 6 * u, u, { eyes: shut ? 'closed' : 'narrow', squint: shut ? 0 : lerp(.9, .35, seg(t, 224.57, 224.7)), mouth: 'flat', aL: -.6, aR: -.6, noShadow: true, seed: 3 });
    paint(ellPts(960, 1180, 900, 260, 24), { fill: '#9CFFB8', fillOp: 60, bleed: .3, tex: .2, ink: null });   // green screen light from below
  }

  // ---------- the finish: the room blows apart, the factory reignites, the card ----------
  const CRASH = 227.28, HEY2 = 228.8, HALL = 229.15, CARD = 237.85;
  const BAND = window.TIME_WARP ? V3_HITS.filter(h => h[0] > 228.4).map(h => TIME_WARP(h[0])) : [227.28, 227.83, 228.5, 228.8, 229.15, 229.81, 230.31, 230.81, 231.79, 232.45, 233.12, 233.78, 234.43, 235.09, 235.75, 236.41, 237.06];
  const SOOT = '#141012', EMBER = '#6E2E18';

  // Put local (0, 0) at screen (X, Y), zoom z, rotation r; letters follow (it is a camera). Pair with camEnd().
  function place(X, Y, z = 1, r = 0, ox = 0, oy = 0) {
    const dx = (X - W / 2) / z, dy = (Y - H / 2) / z, c = Math.cos(r), s = Math.sin(r);
    camBegin(ox - (dx * c + dy * s), oy - (-dx * s + dy * c), z, r);
  }
  // the fresh 100% limit burns to 0 across the whole blast
  const burnBar = (t) => limitBar(560, 62, 800, 1 - seg(t, CRASH, CARD - .15), { h: 54, burn: 1, glow: .4 });
  function furnace(t, k = 1) {
    bgFill(SOOT, '#3A1A10', 90 * k);
    glowAt(960, 900, 1100, A2.sodium, 90 * k);
    for (let i = 0; i < 4; i++) fire(-40 + i * 670, 1110, 820, 560 * k * (.85 + .3 * hash(i + 3)), t + i * .7, { seed: i * 11, k: 1 });   // ponytail: 4 fires, 5 blew the frame budget
  }
  const hop = (t) => hitK(t, BAND, .22);                                      // mosh on the band hits, not on bpOf()

  // 227.2 (v1 staging) the first «Эй!» at 227.28 crashes the band back in: the room blows apart into the furnace;
  // the second «Эй!» at 228.8 is a big flash + shake inside the blast
  function sBlast(t) {
    const b = 1 - Math.pow(1 - seg(t, CRASH, CRASH + 1.4), 2), lt = Math.max(0, t - CRASH), h2 = hitK(t, [HEY2], .25);
    const [sx, sy] = shakeXY(t, 16 * Math.exp(-lt * 1.6) + 5 * hitK(t, BAND, .12) + 22 * h2);
    furnace(t, .4 + .6 * b);
    tokenRain(t, { n: 8, seed: 4, r: 20, burn: .5 });
    // wall + floor shards fly outward from the laptop
    push(); translate(sx, sy);
    for (let i = 0; i < 12; i++) {
      const gx = i % 4, gy = Math.floor(i / 4), x0 = -300 + gx * 630, y0 = -300 + gy * 570, cx = x0 + 315, cy = y0 + 285;
      const dx = cx - 1220, dy = cy - 620, d = Math.hypot(dx, dy) || 1, f = b * (800 + hash(i) * 500);
      push(); translate(cx + dx / d * f, cy + dy / d * f - b * b * 200); rotate((hash(i + 5) - .5) * 2.4 * b); scale(1 - b * .35);
      const floor = gy === 2;
      paint(rectPts(-315, -285, 630, 570, 30), { wash: floor ? FLOOR : WALL, fill: floor ? '#0A0D15' : WALL2, fillOp: 90, tex: .5, ink: b > .02 ? PAL.ink : null, sw: 1.2 });
      if (b > .02) inkLine([[-315, -285 + 90 * hash(i)], [315, -200 + 120 * hash(i + 1)]], 1, '#07080C', 'ink', .4);  // cracks
      pop();
    }
    pop();
    // the room's things tumble out (as cameras, so their lettering flies with them)
    const fly = (ox, oy, vx, vy, spin, fn) => { place(ox + sx + vx * b, oy + sy + vy * b + b * b * 300, 1 - b * .2, spin * b, ox, oy); fn(); flushLetters(); camEnd(); };
    fly(335, 340, -1000, -500, -1.6, () => windowMoon(110, 120, 450, 440, t, { moonK: .5 }));
    fly(765, 330, -700, -800, 1.4, () => games(t, 1, .3));
    fly(1165, 285, 300, -900, -1.1, () => sites(t, 1, .3));
    fly(1650, 200, 900, -600, 2.2, () => clock(1480, 120, 340, 160, 'ПН 00:00', t, 1));
    fly(1670, 640, 1000, 200, 1.8, () => agents(t, 1, .3));
    fly(990, 720, 0, 800, .3, () => {                                         // the desk and the mug
      paint(rectPts(600, 698, 790, 30, 1), { wash: '#3A2E2A', fill: '#251D1A', fillOp: 90, tex: .5, ink: PAL.ink, sw: .8 });
      for (const lx of [630, 1340]) paint(rectPts(lx, 726, 22, 116), { wash: '#251D1A', ink: PAL.ink, sw: .5 });
      paint(rectPts(734, 660, 52, 34), { wash: '#C8C0B0', ink: PAL.ink, sw: .5 });
    });
    // Clawd: at the desk until the crash, then up, screaming, fists on the hits, the laptop spewing its fresh limit
    push(); translate(sx, sy);
    if (t < CRASH) sitClawd(t, { eyes: 'narrow' })();
    else {
      const up = seg(t, CRASH, CRASH + .3), h = hop(t);
      clawd(960, lerp(760, 880, up), lerp(26, 36, up), {
        eyes: up > .3 ? 'angry' : 'narrow', mouth: up > .3 ? 'O' : 'flat', dy: -h * 3 * up, sq: (1 - h) * .12 * up, seed: 3,
        aL: lerp(.15, 1.7, up) + .3 * h, aR: lerp(.5, 1.7, up) - .3 * h, armL: fist(PAL.clay), armR: fist(PAL.clay), rot: (hash(Math.floor(t * 3)) - .5) * .12 * up });
    }
    pop();
    for (let i = 0; i < 10 && t >= CRASH; i++) {
      const a = -Math.PI / 2 + (hash(i + 30) - .5) * 2.6, v = 700 + hash(i + 31) * 700, p = lt * (.9 + hash(i) * .3);
      token(1220 + Math.cos(a) * v * p, 620 + Math.sin(a) * v * p + 600 * p * p, 22 + hash(i + 2) * 14, { spin: t * 2 + i, burn: clamp(p * 1.2) });
    }
    if (t >= CRASH) burnBar(t);
    if (t >= CRASH) flash(Math.max(1 - seg(t, CRASH, CRASH + .35), .75 * h2), '#FFF3C8');
    glitchCut(t, 227.2, { span: .06, k: .6 });
  }

  // 229.15 the data center reignites (v1 staging): racks catch fire, coolers howl, tokens stream out; Clawd swings the laptop overhead like a guitar
  function sHall(t) {
    const k = hitK(t, BAND, .15), [sx, sy] = shakeXY(t, 6 * k), lt = t - HALL, heat = lerp(.4, 1, seg(t, HALL, 230.31));
    camBegin(960 + sx, 540 + sy, 1.04 + .03 * k + lt * .02);
    dataCenter(t, { heat, fire: seg(t, 229.81, 230.81), vp: [960, 480] });
    for (const s of [-1, 1]) cooler(960 + s * 820, 200, 90, t, { speed: 9, howl: 1 });
    tokenRain(t, { n: 10, seed: 7, r: 20, from: [960, 520], to: [300, 250], per: .9 });
    tokenRain(t, { n: 10, seed: 9, r: 20, from: [960, 520], to: [1620, 250], per: .9 });
    for (const [fx, fw] of [[160, 520], [1760, 520]]) fire(fx, 1090, fw, 300, t, { seed: fx, k: .6 + .5 * k });
    const sw = Math.sin(lt * 7.5), h = hop(t);
    clawd(960, 930, 30, {
      eyes: 'angry', mouth: 'grin', dy: -h * 2, sq: (1 - h) * .12, aL: 1.9 + sw * .25, aR: 1.9 - sw * .25, rot: sw * .08, seed: 3, noShadow: true,
      draw: (u) => {                                                          // the laptop held overhead, swinging
        push(); translate(0, -15 * u); rotate(sw * .35);
        paint(rectPts(-6 * u, -3.6 * u, 12 * u, 7 * u, 1), { wash: '#6B7581', fill: '#2B2F36', fillOp: 90, ink: PAL.ink, sw: 1.2 });
        paint(rectPts(-5 * u, -2.8 * u, 10 * u, 5.4 * u), { wash: A2.sodium, fill: '#6E2E18', fillOp: 60, tex: .5, ink: null });
        paint([[-6 * u, 3.4 * u], [6 * u, 3.4 * u], [7.4 * u, 5.6 * u], [-7.4 * u, 5.6 * u]], { wash: '#9AA3AE', ink: PAL.ink, sw: 1 });
        token(0, 0, 1.6 * u, {});
        pop();
      }
    });
    camEnd();
    burnBar(t);
    flash(k * .12 + hitK(t, [HALL], .1) * .4, A2.sodium);
  }

  function sCredit(t) {                                                       // 237.73 «ЖГИ ТОКЕНЫ» on soot black + the credit: AGENT #42 takes it
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#060709', ink: null });
    glowAt(960, 150, 460, EMBER, 80 * Math.exp(-(t - CARD) * 1.5));
    for (let i = 0; i < 18; i++) {                                             // the last embers
      const p = frac(t * (.18 + hash(i) * .2) + hash(i * 3)), x = hash(i * 7) * W, y = H - p * (H + 100), r = (2 + hash(i + 11) * 4) * (1 - p * .5);
      paint(ellPts(x, y, r, r, 6), { wash: p < .5 ? A2.hazard : A2.sodium, washOp: 200 * (1 - p), ink: null });
    }
    stamp('ЖГИ ТОКЕНЫ', 960, 150, 104, t, CARD, { col: A2.sodium, punch: .02, rot: -.05 });
    flushLetters();
    const T0 = CARD, S0 = 238.08, S1 = 238.24, W0 = 238.3, W1 = 238.66;
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
    [220.7, sReset], [224.2, sSuka], [227.2, sBlast], [HALL, sHall], [CARD, sCredit]   // no collage, no second «Сука»: the band plays through to the card
  ]);
})();
