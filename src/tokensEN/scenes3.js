// tokensEN/scenes3.js: BURN THE TOKENS, third wave. Every remaining English line gets its own picture, taken from what THAT line says
// (no inherited Russian gag anywhere; only neutral world pieces are reused: Clawd / agents / CEO, the hall, the servers, the room).
// EN song time; loaded after scenes2.js (ENK / EN2 helpers), before tokens3/square.js.
(() => {
  const INK = PAL.ink;
  const { kick, NOTXT, rubble, native, back, gauge, bull, s2, s3, layer } = ENK;
  const { eased, CHOIR, ROOM, roomWall, cuckoo, laptop, jar, armchair, desk, nightRoom } = EN2;
  const scene = (name, a, b, fn, keys, punch = []) => {
    chapter('en_' + name, a, b, [[a, native(fn)]], { real: true });
    EN_KEYS.push(...keys); EN_PUNCH.push(...punch);
  };
  // a replay of an EN scene `off` seconds later (the chorus repeats word for word): same drawing, same camera keys, same punches
  const replay = (name, a, b, fn, off) => {
    const keys = EN_KEYS.filter(([k]) => k >= a - off - .01 && k < b - off).map(([k, ...r]) => [+(k + off).toFixed(3), ...r]);
    const punch = EN_PUNCH.filter(([k]) => k >= a - off && k < b - off).map(([k, px]) => [k + off, px]);
    scene(name, a, b, t => fn(t - off), keys, punch);
  };
  const arc = (x0, y0, x1, y1, h, u) => [lerp(x0, x1, u), lerp(y0, y1, u) - Math.sin(u * Math.PI) * h];
  const tumbleweed = (x, y, r, t) => { push(); translate(x, y); rotate(t * 6); for (let k = 0; k < 7; k++) paint(ellPts(0, 0, r, r * (.4 + .1 * k), 12, 0, k * .45), { ink: '#A8844A', sw: 1.2 }); pop(); };
  const spiderAt = (x, y) => {
    inkLine([[x, -400], [x, y - 14]], .7, '#E8ECEF', 'inkfine', 0);
    paint(ellPts(x, y, 14, 16, 10), { wash: TK.soot, ink: INK, sw: .6 });
    for (let i = 0; i < 4; i++) for (const d of [-1, 1]) inkLine([[x, y - 4 + i * 4], [x + d * 22, y - 8 + i * 7], [x + d * 28, y + 6 + i * 7]], 1.2, INK, 'inkfine', .3);
  };
  const browser = (x, y, w, h, o = {}) => {                              // a web page, no words: bar with three dots, hero block, grey lines
    paint(rectPts(x, y, w, h, 1), { wash: PAL.cream, ink: INK, sw: 1.2 });
    paint(rectPts(x, y, w, h * .09), { wash: '#C8C0B4', ink: INK, sw: .8 });
    for (let k = 0; k < 3; k++) paint(ellPts(x + 22 + k * 22, y + h * .045, 7, 7, 8), { wash: [TK.ember, TK.yellow, TK.green][k], ink: null });
    paint(rectPts(x + w * .06, y + h * .15, w * .88, h * .32), { wash: o.col || TK.blue, ink: null });
    paint(starPts(x + w * .5, y + h * .31, h * .1), { wash: PAL.cream, ink: null });
    for (let k = 0; k < 4; k++) paint(rectPts(x + w * .06, y + h * (.55 + k * .09), w * (.8 - k * .12), h * .035), { wash: '#B8AE9E', ink: null });
  };

  // ======== INTRO NEW (0–18.16, instrumental) ========
  // Dark hall; one coin rolls into frame (0) → lights bang on (2.30, 5.11) → Clawd rolls a giant coin like a wheel towards the press, heaves it
  // onto the bed (12.6) → 13.40 the press SLAMS it flat, the title slams with it; the press keeps hammering on every hit, sparks, fire behind.
  const INH = [13.40, 14.07, 15.44, 16.46, 17.16];
  function intro(t) {
    back(A2.gunDk);
    const dark = t < 2.3 ? .9 : .1;                                      // ponytail: a half-dark hall reads as grey fog, so the lamps come on one by one instead
    A03.hall(t, { lamps: t < 5.11 ? [700] : [700, 1220], floor: 1060, dark });
    fire(960, 1060, 1300, 260 * eased(t, 12.8, 13.4) + 60 * kick(t, INH, .3), t, { k: .3 + .7 * eased(t, 12.8, 13.4), seed: 11 });
    // the press (idle until the first slam)
    press(800, 420, 340, 640, t, t < 13.2 ? [99] : INH, { seed: 3 });
    // the giant coin: rolled in by Clawd from the left, then flattened
    const roll = eased(t, 5.4, 12.2), gx = lerp(420, 970, roll), lift = eased(t, 12.2, 12.9), sq = t >= INH[0] ? .2 : 1;
    const gy = lerp(1060 - 110, 890 - 110 * sq, lift);
    if (t > 2.3) { push(); translate(gx, gy); scale(1 + (1 - sq) * .5, sq); token(0, 0, 110, { spin: t < 12.2 ? roll * 6 : .02, burn: t > 14 ? seg(t, 14, 17) * .6 : 0 }); pop(); }
    if (t < 2.3) token(lerp(440, 700, t / 2.3), 1030, 24, { spin: t * 2 });
    const cx = t < 12.2 ? gx - 170 : lerp(gx - 170, 700, eased(t, 12.9, 13.3)), pushing = t > 5.4 && t < 12.2;
    if (t > 2.3) clawd(cx, 1058, 11, { walk: pushing ? t * 2.2 : null, rot: pushing ? .12 : 0, eyes: t > 13.4 ? 'spark' : pushing ? 'narrow' : 'look', lookX: 1,
      mouth: t > 13.4 ? 'O' : pushing ? 'flat' : 'smile', aL: pushing || (t > 12.2 && t < 12.9) ? 1.2 : .3, aR: pushing || (t > 12.2 && t < 12.9) ? 1.2 : .3, emote: pushing && t > 10 ? 'sweat' : null, noShadow: true });
    for (const h of INH) { sparks(970, 900, t - h, h * 3, 16, 360); rubble(970, 1060, 500, t - h, h); }
    if (t >= INH[0]) stamp('BURN THE TOKENS', 960, 250, 78, t, INH[0], { col: TK.yellow, rot: -.04 });
    flash(Math.min(.35, kick(t, [INH[0]], .2) * .35), TK.yellowLt);
  }
  scene('intro', 0, 18.16, intro, [
    [0, 580, 850, 560], [2.3, 640, 820, 620, 1], [5.4, 620, 810, 700, 1], [9.0, 760, 790, 760, 1], [12.2, 900, 760, 820, 1], [13.39, 960, 700, 900, 1],
    [13.4, 960, 620, 960], [18.159, 960, 640, 900, 1],
  ], [[13.4, 18]]);

  // ======== VERSE 1 NEW (18.16–39.78) in the room at dusk ========
  // «Friday night, I'm off the clock» — the cuckoo pops at six, laptop slams shut, Clawd hops off, stretches.
  // «Half my weekly tokens still in stock» — the token jar, filled exactly to the half mark.
  // «Could touch grass — but Sunday night» — Clawd reaches for the pot of grass; the window snaps to night, the clock hands race.
  // «Every last token has to die» — the coins in the jar get x-eyes and catch fire.
  // «Don't need an app, don't need a bot» — Clawd swats away an app tile; kicks away a little agent bot.
  // «Still got tokens — so why the hell not?» — eyes on the jar, sparkle, grin, shrug.
  // «Build me a game that nobody will play» — coins arc into the laptop, an arcade cabinet pops up; nobody comes; tumbleweed, cobweb.
  // «Build me a website no one needs anyway!» — more coins, a big web page pops up on the wall; a tumbleweed rolls across it, a spider.
  const V1 = { pop: 18.9, shut: 19.3, hop: 19.7, walk: 20.8, grass: 23.54, sunday: 24.8, die: 26.38, app: 29.08, swat: 29.8, bot: 30.3, kickT: 30.7,
    why: 31.76, shrug: 33.3, game: 34.52, cab: 35.0, site: 36.78, page: 37.4 };
  const JAR = [1330, 880];
  function verse1(t) {
    back('#2A2230');
    const night = t < V1.sunday ? 0 : eased(t, V1.sunday, V1.sunday + .4);
    roomWall(t, night);
    // the clock: six o'clock on Friday, then racing to Sunday night
    const race = eased(t, V1.sunday, V1.sunday + 1.2), min = -.05 * (1 - seg(t, 18.16, V1.pop)) + race * TAU * 6, hour = Math.PI + race * TAU * .5 * 1.97;
    cuckoo(t, 640, 430, .55, min, hour, t >= V1.pop ? t - V1.pop : null);
    // desk + laptop (left of the jar), stool
    desk(820, 1160, 880);
    const lid = t < V1.shut ? 1 : t < V1.game ? 1 - eased(t, V1.shut, V1.shut + .12) : eased(t, V1.game, V1.game + .3);
    const built = t >= V1.game;
    laptop(1000, 880, lid, t < V1.shut ? '#6FA8FF' : built ? TK.yellow : null, .9);
    paint(rectPts(700, 940, 90, 16, 1), { wash: '#7A4A2E', ink: INK, sw: .8 }); paint(rectPts(736, 956, 18, 104), { wash: '#4A2A1E', ink: INK, sw: .6 });
    // the jar on its stool
    paint(rectPts(JAR[0] - 90, JAR[1], 180, 18, 1), { wash: '#7A4A2E', ink: INK, sw: .8 });
    for (const d of [-60, 44]) paint(rectPts(JAR[0] + d, JAR[1] + 18, 16, ROOM.floor - JAR[1] - 18), { wash: '#4A2A1E', ink: INK, sw: .6 });
    const spent = seg(t, V1.game, V1.game + .7) * .5 + seg(t, V1.site, V1.site + .7) * .45;
    const dead = t < V1.why ? eased(t, V1.die, V1.die + .6) : 1 - eased(t, V1.why + .4, V1.why + .9);
    jar(t, JAR[0], JAR[1], .5 - spent, { w: 190, h: 250, dead, spin: t > V1.why + .4 && t < V1.game });
    if (t > V1.sunday && t < V1.die) glowAt(JAR[0], JAR[1] - 120, 200, TK.ember, 80 * eased(t, V1.sunday, V1.sunday + .5));
    // the pot of grass by the wall
    const gx = 1080;
    paint([[gx - 50, 1060], [gx + 50, 1060], [gx + 62, 990], [gx - 62, 990]], { wash: A2.rust, ink: INK, sw: 1 });
    for (let k = 0; k < 9; k++) { const x = gx - 48 + k * 12, sw = Math.sin(t * 2 + k) * 6; paint([[x - 5, 992], [x + 5, 992], [x + 2 + sw, 930 - hash(k) * 30]], { wash: k % 2 ? TK.green : TK.greenDk, ink: INK, sw: .4 }); }
    // the arcade cabinet (the game) and the web page (the website)
    if (t > V1.cab) {
      const up = easeOut(seg(t, V1.cab, V1.cab + .35)), x = 560, y = 1060 + (1 - up) * 420;
      paint([[x - 90, y], [x - 90, y - 380], [x - 60, y - 420], [x + 90, y - 420], [x + 90, y]], { wash: TK.blue, fill: TK.blueDk, fillOp: 70, tex: .5, ink: INK, sw: 1.2 });
      paint(rectPts(x - 70, y - 360, 140, 110), { wash: '#0A0B0D', ink: INK, sw: .8 });
      const blink = Math.floor(t * 3) % 2;
      for (const [px, py] of [[-2, 0], [2, 0], [-3, 1], [-1, 1], [1, 1], [3, 1], [-3, 2], [3, 2], [-1, -1], [1, -1]]) paint(rectPts(x + px * 12 - 6, y - 305 + py * 12 - 6 + blink * 4, 12, 12), { wash: TK.led, ink: null });
      paint(rectPts(x - 90, y - 230, 180, 60), { wash: TK.blueDk, ink: INK, sw: .8 });
      inkLine([[x - 30, y - 200], [x - 30, y - 235]], 4, INK, 'ink', 0); paint(ellPts(x - 30, y - 238, 10, 10, 8), { wash: TK.ember, ink: INK, sw: .5 });
      for (let k = 0; k < 2; k++) paint(ellPts(x + 20 + k * 30, y - 205, 9, 9, 8), { wash: TK.yellow, ink: INK, sw: .5 });
      paint(rectPts(x - 30, y - 60, 60, 40), { wash: '#0A0B0D', ink: null });                                      // coin slot, dark: nobody
      paint(rectPts(x + 110, 1000, 60, 14, 1), { wash: '#7A4A2E', ink: INK, sw: .7 }); paint(rectPts(x + 132, 1014, 14, 46), { wash: '#4A2A1E', ink: INK, sw: .5 });   // the empty stool
      const web = eased(t, V1.cab + 1, V1.cab + 2.2);
      if (web > 0) for (let i = 0; i < 5; i++) { const a = Math.PI * (.5 + i / 8); inkLine([[x + 90, y - 420], [x + 90 + Math.cos(a) * 110 * web, y - 420 + Math.sin(a) * 110 * web]], .8, '#E8ECEF', 'inkfine', 0); }
      const tw = seg(t, V1.cab + .9, V1.cab + 2.3); if (tw > 0 && tw < 1) tumbleweed(lerp(900, 380, tw), 1030 - Math.abs(Math.sin(tw * 12)) * 30, 28, t);
    }
    if (t > V1.page) {
      const k = backOut(seg(t, V1.page, V1.page + .3)), x = 880, y = 160, w = 520, h = 400;
      push(); translate(x + w / 2, y + h / 2); scale(k); translate(-(x + w / 2), -(y + h / 2));
      browser(x, y, w, h, { col: PAL.violet });
      const tw = seg(t, V1.page + .5, V1.page + 1.8); if (tw > 0 && tw < 1) tumbleweed(lerp(x + w - 40, x + 40, tw), y + h * .9 - Math.abs(Math.sin(tw * 10)) * 26, 22, t);
      if (t > V1.page + 1) spiderAt(x + w * .75, lerp(y + 40, y + h * .62, eased(t, V1.page + 1, V1.page + 1.8)));
      pop();
    }
    // coins arcing from the jar into the laptop on «Build me…»
    for (const b of [V1.game, V1.site]) for (let i = 0; i < 7; i++) { const u = (t - b - i * .08) / .5; if (u > 0 && u < 1) { const [x, y] = arc(JAR[0], JAR[1] - 200, 1000, 800, 180, u); token(x, y, 16, { spin: t * 4 + i }); } }
    // flying away: the app tile and the bot
    if (t > V1.app && t < V1.swat + 1) {
      const fly = seg(t, V1.swat, V1.swat + .8), x = lerp(1060, 300, easeIn(fly)), y = 700 - Math.sin(fly * Math.PI) * 300 + (1 - backOut(seg(t, V1.app, V1.app + .3))) * 200;
      push(); translate(x, y); rotate(fly * 8);
      paint(rrPts(-60, -60, 120, 120, 28), { wash: TK.green, fill: TK.greenDk, fillOp: 60, ink: INK, sw: 1.2 });
      paint(ellPts(0, 0, 26, 26, 16), { wash: PAL.cream, ink: INK, sw: .8 }); paint(rectPts(-6, -34, 12, 20), { wash: PAL.cream, ink: INK, sw: .6 });
      pop();
    }
    if (t > V1.app + .8 && t < V1.why + .4) {
      const tumble = seg(t, V1.kickT, V1.kickT + .7), x = t < V1.kickT ? lerp(420, 900, eased(t, V1.app + .8, V1.kickT)) : lerp(900, 300, tumble);
      agentBot(x, 1058 - Math.sin(tumble * Math.PI) * 220, 7.5, t, { n: 7, rot: NOTXT + tumble * 9, walk: t < V1.kickT ? t * 3 : null, eyes: tumble > 0 ? 'x' : 'happy', mouth: tumble > 0 ? 'O' : 'smile', aL: 1.2, aR: 1.2, noShadow: true });
    }
    // Clawd
    let cx, cy = 1058, o = { eyes: 'normal', mouth: 'flat', aL: .3, aR: .3, noShadow: true };
    if (t < V1.hop) { cx = 745; cy = 940; o.eyes = t > V1.pop ? 'happy' : 'narrow'; o.aR = t < V1.shut ? .9 + .3 * Math.sin(t * 20) : .3; }
    else if (t < V1.walk) { cx = 745 + (t - V1.hop) * 40; const k = eased(t, V1.hop + .2, V1.walk); o.aL = o.aR = 1.8 * Math.sin(k * Math.PI); o.eyes = 'happy'; o.mouth = 'o'; }
    else if (t < V1.grass) { cx = lerp(785, 1180, eased(t, V1.walk, V1.walk + 1)); o.walk = t < V1.walk + 1 ? t * 2 : null; o.eyes = 'look'; o.lookX = 1; o.mouth = 'smile'; }
    else if (t < V1.die) { cx = lerp(1180, 1160, eased(t, V1.grass, V1.grass + .4)); o.flip = t < V1.sunday + .2; o.aR = t < V1.sunday ? 1.2 : .2; o.rot = t < V1.sunday ? -.12 : 0; o.eyes = t < V1.sunday ? 'happy' : 'scared'; o.lookX = 1; o.mouth = t < V1.sunday ? 'smile' : 'O'; }
    else if (t < V1.app) { cx = 1160; o.eyes = 'scared'; o.lookX = 1; o.mouth = 'O'; o.emote = 'sweat'; o.aL = o.aR = 1.5; }
    else if (t < V1.why) { cx = lerp(1160, 1000, eased(t, V1.app, V1.app + .4)); o.flip = true; o.eyes = 'narrow'; o.mouth = 'flat';
      o.aR = t > V1.swat - .15 && t < V1.swat + .25 ? 2 : .3; o.rot = kick(t, [V1.kickT], .3) * .25; }
    else if (t < V1.game) { cx = lerp(1000, 1150, eased(t, V1.why, V1.why + .4)); o.eyes = t > V1.why + .4 ? 'spark' : 'look'; o.lookX = 1; o.mouth = 'grin';
      const sh = seg(t, V1.shrug, V1.shrug + .6); o.aL = o.aR = .3 + 1.4 * Math.sin(sh * Math.PI); }
    else { cx = 1150; o.eyes = 'happy'; o.mouth = 'grin'; o.aL = o.aR = 1.2 + .4 * Math.sin(t * 8); }
    clawd(cx, cy, 13, o);
  }
  scene('v1_room', 18.16, 39.78, verse1, [
    [18.16, 760, 820, 520], [19.9, 820, 820, 600, 1], [20.8, 1000, 800, 640, 1], [22.3, 1240, 800, 560, 1], [V1.grass, 1130, 830, 600, 1], [V1.sunday, 1180, 720, 760, 1],
    [V1.die, 1320, 760, 480], [28.9, 1300, 780, 520, 1], [V1.app, 1060, 820, 640], [V1.why, 1200, 820, 600, 1], [33.9, 1160, 800, 640, 1],
    [V1.game, 760, 800, 700], [V1.site, 1000, 640, 820, 1], [39.779, 1040, 660, 800, 1],
  ], [[V1.shut, 6], [V1.kickT, 8], [V1.cab, 8]]);

  // ======== VERSE 2 NEW (65.18–76.72) in the hall ========
  // «Brand-new K-P-I up on the wall» — the CEO on a ladder hammers up a big dial: green → red, a flame at the top of the scale.
  // «You get the tokens — you burn 'em all» — agents in a row, a bucket of coins each, all thrown into the furnace; the needle climbs.
  // «Low spend? Bro, you didn't even try» — one agent throws one coin; the needle doesn't move; the CEO turns and points; spotlight, sweat.
  // «Top burner gets a bonus. Don't ask why» — the sootiest agent rises on a podium, a huge gold medal-coin drops on him; everyone shrugs.
  const V2 = { kpi: 65.74, hop: 68.6, burn: 68.9, low: 71.34, point: 72.2, bonus: 74.0, medal: 74.6, why: 75.6 };
  const DIAL = [960, 640, 220];
  function dial(t, v) {
    const [x, y, r] = DIAL, ham = kick(t, EN_GRID.filter(g => g > V2.kpi && g < V2.hop), .15), rot = t < 68.3 ? .12 * (1 - seg(t, V2.kpi, 68.3)) + ham * .03 : 0;
    push(); translate(x, y - r); rotate(rot); translate(-x, -(y - r));
    paint(rectPts(x - r - 40, y - r - 40, 2 * r + 80, r + 150, 2), { wash: '#232A33', fill: '#1A1718', fillOp: 90, tex: .6, border: .4, ink: INK, sw: 1.6 });
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) paint(ellPts(x + sx * (r + 22), y - r * .5 + sy * (r * .5 + 60) - 20, 8, 8, 8), { wash: A2.steelLt, ink: INK, sw: .5 });
    const N = 10;                                                         // the scale: ten wedges from green to red
    for (let i = 0; i < N; i++) {
      const a0 = Math.PI + i / N * Math.PI, a1 = Math.PI + (i + 1) / N * Math.PI, c = mixCol(TK.green, TK.ember, i / (N - 1));
      paint([[x + Math.cos(a0) * r, y + Math.sin(a0) * r], [x + Math.cos(a1) * r, y + Math.sin(a1) * r], [x + Math.cos(a1) * r * .7, y + Math.sin(a1) * r * .7], [x + Math.cos(a0) * r * .7, y + Math.sin(a0) * r * .7]], { wash: c, ink: INK, sw: .8 });
    }
    const fx = x + r * .78, fy = y - r * .82;                              // the flame icon at the red end
    fire(fx, fy + 40, 70, 90, t, { k: .6 + .4 * v, seed: 12 });
    const a = Math.PI + clamp(v) * Math.PI;
    inkLine([[x, y], [x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9]], 7, INK, 'ink', 0);
    inkLine([[x, y], [x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9]], 3, TK.ember, 'ink', 0);
    paint(ellPts(x, y, 22, 22, 14), { wash: A2.steel, ink: INK, sw: .9 });
    if (v > .9) glowAt(x, y - r / 2, r * 1.2, TK.ember, 90 * (v - .9) * 10);
    pop();
  }
  const ROW = [600, 750, 900, 1050];
  function verse2(t) {
    back(A2.gunDk);
    A03.hall(t, { lamps: [560, 1360], floor: 1060 });
    // the furnace mouth on the right
    const FX = 1320;
    paint(rectPts(FX - 140, 700, 280, 360, 2), { wash: '#6A2E1C', fill: '#3A160C', fillOp: 90, tex: .7, border: .4, ink: INK, sw: 1.4 });
    for (let y = 730; y < 1060; y += 40) inkLine([[FX - 136, y], [FX + 136, y]], .5, '#3A160C', 'inkfine', 0);
    paint(rrPts(FX - 90, 820, 180, 160, 30), { wash: '#FF7A1A', fill: TK.ember, fillOp: 100, bleed: .3, tex: .4, ink: INK, sw: 1 });
    const feed = t > V2.burn && t < V2.low ? 1 : .5;
    fire(FX, 990, 170, 150 * feed + 30 * kick(t, EN_GRID, .2), t, { k: 1, seed: 4 });
    // the needle: idle, climbs with every bucket, twitches at the single coin
    const v = t < V2.burn ? .08 + .02 * Math.sin(t * 3) : t < V2.low ? lerp(.1, .95, eased(t, V2.burn, V2.low - .2)) : .95 - .02 * kick(t, [72.0], .5) + .015 * Math.sin(t * 20);
    dial(t, v);
    // the CEO: on the ladder hammering, then down, pointing at the low spender, then handing out the bonus
    const LX = 640;
    if (t < V2.hop + .3) {
      for (const d of [-40, 40]) inkLine([[LX + d, 1060], [LX + d * .6, 700]], 5, A2.steelLt, 'ink', 0);
      for (let y = 1000; y > 720; y -= 70) inkLine([[LX - 38 + (1000 - y) * .026, y], [LX + 38 - (1000 - y) * .026, y]], 3, A2.steelLt, 'ink', 0);
    }
    const onL = t < V2.hop, cxp = onL ? LX : lerp(LX, 500, eased(t, V2.hop, V2.hop + .3)), cyp = onL ? 740 : lerp(740, 1058, easeIn(seg(t, V2.hop, V2.hop + .3)));
    const hammer = onL ? kick(t, EN_GRID, .18) : 0, pointing = t > V2.point && t < V2.bonus;
    ceoClawd(cxp, cyp, 13, { noShadow: true, eyes: pointing ? 'narrow' : t > V2.medal ? 'happy' : 'normal', mouth: pointing ? 'flat' : 'grin',
      aR: onL ? .8 + 1.1 * (1 - hammer) : pointing ? 1.2 : t > V2.why ? 1.6 : .4, aL: t > V2.why ? 1.6 : .3 });
    if (onL) { const a = -.6 - 1.1 * (1 - hammer); push(); translate(cxp + 60, cyp - 50); rotate(-a); paint(rectPts(-4, -60, 8, 60), { wash: '#7A4A2E', ink: INK, sw: .5 }); paint(rectPts(-18, -72, 36, 16), { wash: A2.steel, ink: INK, sw: .6 }); pop(); }
    // the line of agents with buckets
    ROW.forEach((x, i) => {
      const low = i === 2, top = i === 0, beat = (t - V2.burn) * 1.5 - i * .25, ph = frac(beat), throwK = t > V2.burn && t < V2.low && !low ? Math.sin(clamp(ph / .4) * Math.PI) : 0;
      const sooty = top ? eased(t, V2.burn, V2.bonus) : 0, col = sooty > 0 ? mixCol('#6F8BE0', '#2A2A30', sooty) : undefined;
      let y = 1058, o = { n: 20 + i, rot: NOTXT, noShadow: true, eyes: 'happy', mouth: 'grin', aL: .4 + throwK * 1.4, aR: .4 + throwK * 1.4, col, dk: col && mixCol(col, INK, .3) };
      if (low && t > V2.low) { o.eyes = t > V2.point ? 'scared' : 'normal'; o.mouth = t > V2.point ? 'o' : 'smile'; o.emote = t > V2.point ? 'sweat' : null; o.sy = t > V2.point ? .85 : 1; o.aR = t < 72.0 ? 1.3 : .3; }
      if (!low && t > V2.low && t < V2.bonus) { o.eyes = 'look'; o.lookX = x < 900 ? 1 : -1; o.mouth = 'flat'; }
      if (top && t > V2.bonus) { y = 1058 - 160 * easeOut(seg(t, V2.bonus, V2.bonus + .4)); o.eyes = t > V2.medal ? 'spark' : 'happy'; o.sy = t > V2.medal ? 1 - .12 * Math.exp(-(t - V2.medal) * 4) : 1; }
      if (t > V2.why) { o.aL = o.aR = 1.6; o.eyes = top ? 'happy' : 'flat'; o.mouth = 'flat'; }
      if (top && t > V2.bonus) { const py = y; paint(rectPts(x - 80, py, 160, 1060 - py, 1), { wash: TK.gold, fill: TK.goldDk, fillOp: 60, tex: .5, ink: INK, sw: 1 }); }
      agentBot(x, y, 13, t, o);
      if (sooty > .1) smoke(x, y - 110, t, { k: sooty });
      if (!(top && t > V2.bonus) && !(low && t > 72.0)) {                  // the bucket at his feet (the low spender holds one coin)
        if (low && t > V2.burn) token(x + 50, y - 60, 12, {});
        else { paint([[x + 30, y - 10], [x + 80, y - 10], [x + 74, y - 60], [x + 36, y - 60]], { wash: A2.steel, ink: INK, sw: .8 }); for (let k = 0; k < 3; k++) token(x + 44 + k * 13, y - 62, 10, {}); }
      }
      if (throwK > .5) { const u = (ph - .2) / .8; if (u > 0) for (let k = 0; k < 4; k++) { const [cx, cy] = arc(x + 50, y - 80, FX, 880, 200, clamp(u + k * .05)); token(cx, cy, 13, { spin: t * 5 + k, burn: u }); } }
      if (low && t > 71.6 && t < 72.1) { const [cx, cy] = arc(x + 50, y - 80, FX, 880, 160, seg(t, 71.6, 72.05)); token(cx, cy, 13, { spin: t * 5 }); }
    });
    if (t > V2.point && t < V2.bonus) A06.beam(900, 900, 50, 150, 1066, eased(t, V2.point, V2.point + .2));
    if (t > V2.medal - .4) {                                                // the bonus: a medal-coin bigger than the agent
      const x = ROW[0], y0 = 1058 - 160, k = clamp((t - V2.medal + .4) / .4), y = lerp(-200, y0 - 50, easeIn(k));
      inkLine([[x - 40, y - 60], [x, y - 110], [x + 40, y - 60]], 6, TK.ember, 'ink', 0);
      token(x, y, 70, { glow: 1 });
      if (t > V2.medal) A03.confetti(t - V2.medal, 30, [460, -100, 1000, 800], 9);
    }
  }
  scene('v2_kpi', 65.18, 76.72, verse2, [
    [65.18, 880, 720, 680], [V2.kpi, 900, 720, 680, 1], [V2.burn, 1000, 800, 800, 1], [V2.low, 900, 900, 540, 1], [73.0, 920, 880, 620, 1],
    [V2.bonus, 780, 840, 680, 1], [V2.why, 940, 800, 800, 1], [76.719, 940, 800, 800, 1],
  ], [[V2.hop + .3, 8], [V2.medal, 12]]);

  // ======== CHORUS 2 = chorus 1 again, word for word 47.42 s later (the shredder, the trucks, the hiring hall) ========
  replay('c2_shredder', 92.86, 103.06, s2, 47.42);
  replay('c2_hall', 103.06, 112.60, s3, 47.42);

  // ======== BRIDGE NEW (112.60–124.48) «We're gonna need more electricity. More copper. More water. More copper. More water…» ========
  // One focal at a time. The CEO at his pulpit; a giant plug drops from the vault and rams in (lights surge). «copper»: three singers on the
  // left, copper coils crash onto their heap. «water»: pan right to the next town's reservoir by the houses (the RU a06 image, the user
  // liked it) — on every «water» its level drops a step; by 124.36 it is cracked mud with a stranded boat and a flapping fish.
  const BR = { plug: 114.12, in: 115.25, copper: [116.44, 119.42, 121.90], water: [117.78, 120.66, 123.14], dry: 124.36 };
  const LAKE = [1200, 300, 700, 520];
  const lakeLvl = t => Math.max(0, 1 - BR.water.reduce((l, w) => l + .3 * eased(t, w, w + .45), 0) - .1 * eased(t, 123.8, BR.dry));
  function heap(list, t, x, draw) {
    let n = 0; for (const h of list) { const a = t - h; if (a < 0) continue; for (let k = 0; k < 4; k++) {
      const i = n++, px = x + ((i % 4) - 1.5) * 90 + (Math.floor(i / 4) % 2) * 40, py = 1110 - Math.floor(i / 4) * 80, fall = clamp((a - k * .07) / .3);
      if (fall > 0) draw(px, lerp(-200, py, easeIn(fall)), i, fall < 1 ? a * 6 : 0);
    } }
  }
  const coil = (x, y, i, spin) => { push(); translate(x, y); rotate(spin + i); scale(1.5); paint(ellPts(0, 0, 40, 30, 18), { wash: '#C8743A', fill: '#8A4A22', fillOp: 70, tex: .5, ink: INK, sw: 1 }); paint(ellPts(0, 0, 18, 12, 12), { wash: '#1A1726', ink: INK, sw: .6 }); for (let k = 1; k < 4; k++) paint(ellPts(0, 0, 18 + k * 6, 12 + k * 5, 14), { ink: '#E8A060', sw: .5 }); pop(); };
  function bridge(t) {
    back('#1A1726');
    const surge = kick(t, [BR.in], .6);
    A06.nave(t, { choir: false, L: Math.min(1, (t < BR.in ? .55 : .85) + surge * .15) });
    A06.pulpit(t, { eyes: t > BR.in ? 'happy' : 'narrow', mouth: t > BR.plug ? 'grin' : 'smile', click: kick(t, EN_GRID, .15), aL: t > BR.plug && t < BR.in ? 1.4 : .5 });
    if (t > BR.plug) {
      const k = eased(t, BR.plug + .2, BR.in), px = 1210, py = lerp(-300, 690, k);
      inkLine([[px, -500], [px, py - 70]], 16, INK, 'ink', 0); inkLine([[px, -500], [px, py - 70]], 10, '#3A3F4A', 'ink', 0);
      paint(rrPts(px - 40, py - 80, 80, 90, 12), { wash: '#E8E0D0', ink: INK, sw: 1.2 });
      for (const d of [-16, 16]) paint(rectPts(px + d - 5, py + 10, 10, 30), { wash: A2.steelLt, ink: INK, sw: .6 });
      if (t > BR.in) { sparks(px, py + 30, t - BR.in, 5, 16, 260); flash(surge * .2, '#FFF3C8'); }
    }
    const cop = Math.max(...BR.copper.map(h => { const a = t - h; return a > 0 && a < 1.2 ? Math.exp(-a * 2) : 0; }));
    [520, 640, 760].forEach((x, i) => A06.angel(x, 990, 12, t, { n: i + 3, k: cop, eyes: cop > .3 ? 'happy' : 'closed', mouth: cop > .3 ? 'O' : 'smile', aL: .3 + cop * 1.4, aR: .3 + cop * 1.4 }));
    heap(BR.copper, t, 620, coil);
    A06.reservoir(t, ...LAKE, lakeLvl(t));
  }
  const toLake = w => [[w - .25, 700, 860, 700, 1], [w + .1, 1550, 600, 760, 1], [w + .8, 1550, 600, 760, 1]];
  const toCopper = c => [[c - .25, 1550, 600, 760, 1], [c + .1, 700, 860, 700, 1], [c + .8, 700, 860, 700, 1]];
  scene('bridge_needs', 112.60, 124.48, bridge, [
    [112.60, 960, 700, 900], [BR.plug, 1060, 640, 760, 1], [BR.in, 960, 720, 900, 1], [BR.copper[0] - .2, 960, 720, 900, 1], [BR.copper[0] + .1, 700, 860, 700, 1],
    ...toLake(BR.water[0]), ...toCopper(BR.copper[1]), ...toLake(BR.water[1]), ...toCopper(BR.copper[2]), ...toLake(BR.water[2]), [124.479, 1550, 620, 740, 1],
  ], [[BR.in, 12], ...BR.water.map(w => [w + .1, 8])]);

  // ======== BRIDGE NEW (129.02–137.00) «And when intelligence gets cheaper… we're gonna need… MORE GPUs!» ========
  // The lights go down to one spot on the CEO; he leans in and whispers, slowly lifts both arms — and the vault cracks open: GPUs rain on the choir.
  const CH = { dim: 129.98, arms: 133.30, gpus: 135.22 };
  function cheaper(t) {
    back('#141218');
    const dim = eased(t, CH.dim, CH.dim + .6) * (1 - eased(t, CH.gpus, CH.gpus + .1));
    A06.nave(t, { choir: false, L: .8 - .65 * dim });
    if (dim > 0) paint(rectPts(-500, -300, W + 1000, H + 600), { wash: '#000000', washOp: 140 * dim, ink: null });
    A06.beam(960, 960, 60, 260, 900, dim);
    const up = eased(t, CH.arms, CH.gpus);
    A06.pulpit(t, { eyes: t > CH.gpus ? 'spark' : 'narrow', mouth: t > CH.gpus ? 'O' : t > CH.dim ? 'o' : 'smile', aL: .3 + 1.5 * up, aR: .3 + 1.5 * up, click: 0 });
    const g = t - CH.gpus;
    CHOIR.forEach(([x, y], i) => A06.angel(x, y, 11, t, { n: i + 3, k: g > 0 ? .9 : 0, eyes: g > 0 ? 'scared' : t > CH.arms ? 'normal' : 'closed', lookY: -.6, mouth: g > 0 ? 'O' : 'smile', aL: g > 0 ? 1.8 : .3, aR: g > 0 ? 1.8 : .3 }));
    if (g > 0) {
      flash(Math.max(0, .3 - g * 1.5), '#FFFFFF');
      for (let i = 0; i < 10; i++) { const st = hash(i) * 1.2, a = g - st; if (a < 0) continue; const x = 460 + hash(i + 3) * 1000, y = Math.min(1080 - (i % 3) * 30, -200 + a * a * 2600); gpuCard(x, y, .3, t, { rot: y < 1000 ? a * 6 + i : (hash(i) - .5) * .6 }); }
      rubble(960, 120, 900, g, 5);
    }
  }
  scene('bridge_cheaper', 129.02, 137.0, cheaper, [
    [129.02, 960, 620, 1000], [CH.dim, 960, 540, 800, 1], [CH.arms, 960, 480, 660, 1], [CH.gpus, 960, 600, 1080], [136.99, 960, 620, 1080, 1],
  ], [[CH.gpus, 20]]);

  // ======== RAP NEW (152.04–157.46) «A-G-I by spring — they say it every year. Every release: "guys, it's almost here."» ========
  // A stage. The CEO beside a pot with a tiny glowing sprout. Out of the window the seasons spin round and round; every spring he points
  // at the sprout, which never grows. Then «release»: a gift box lands, he opens it — a smaller box — a smaller — a tiny one he holds up.
  const SP = { rel: 154.46, box: [154.9, 155.45, 156.0, 156.55] };
  function spring(t) {
    back(A2.gunDk);
    A03.hall(t, { lamps: [560, 1360], floor: 1060 });
    // window with the tree, seasons cycling (period 0.8 s)
    const wx = 1000, wy = 300, ww = 480, wh = 400, ph = frac((t - 152.04) / .8), season = Math.floor(ph * 4);
    const sky = ['#C8D8E8', '#BFE3F2', '#8EC3E6', '#E8B878'][season];
    paint(rectPts(wx - ww / 2, wy, ww, wh, 1), { wash: sky, ink: INK, sw: 2 });
    paint(rectPts(wx - ww / 2, wy + wh - 70, ww, 70), { wash: season === 0 ? '#F4F2EE' : '#6E9F58', ink: null });
    inkLine([[wx, wy + wh - 70], [wx, wy + 170]], 12, '#5A3A28', 'ink', 0);
    for (const [dx, dy] of [[-80, -60], [70, -80], [-40, -130], [40, -150]]) inkLine([[wx, wy + 220], [wx + dx, wy + 170 + dy]], 5, '#5A3A28', 'ink', .3);
    const leaf = [null, '#F2A2B0', '#2FBF71', '#E8742A'][season];
    if (leaf) for (let i = 0; i < 16; i++) paint(ellPts(wx - 110 + hash(i) * 220, wy + 50 + hash(i + 4) * 150, 22, 18, 10), { wash: leaf, ink: INK, sw: .4 });
    if (season === 3) for (let i = 0; i < 5; i++) paint(ellPts(wx - 150 + hash(i + 9) * 300, wy + 120 + frac(t * 2 + hash(i)) * 200, 8, 6, 8), { wash: leaf, ink: null });
    if (season === 0) for (let i = 0; i < 20; i++) paint(ellPts(wx - 250 + hash(i) * 500, wy + frac(t * .7 + hash(i + 2)) * wh, 3, 3, 6), { wash: '#FFFFFF', ink: null });
    inkLine([[wx, wy], [wx, wy + wh]], 4, INK, 'ink', 0); inkLine([[wx - ww / 2, wy + wh / 2], [wx + ww / 2, wy + wh / 2]], 4, INK, 'ink', 0);
    // the stage
    paint(rectPts(480, 980, 960, 80, 1), { wash: '#7A4A2E', fill: '#4A2A1E', fillOp: 60, tex: .5, ink: INK, sw: 1 });
    // the pot with the sprout on a pedestal
    const px = 1220, py = 860;
    paint(rectPts(px - 60, py, 120, 120, 1), { wash: A2.steel, ink: INK, sw: .9 });
    paint([[px - 55, py], [px + 55, py], [px + 42, py - 80], [px - 42, py - 80]].map(([x, y]) => [x, y]), { wash: A2.rust, ink: INK, sw: 1 });
    paint([[px - 44, py - 80], [px + 44, py - 80], [px + 48, py - 92], [px - 48, py - 92]], { wash: '#8A4A22', ink: INK, sw: .8 });
    inkLine([[px, py - 92], [px, py - 118]], 3, TK.green, 'ink', 0);
    for (const d of [-1, 1]) paint(ellPts(px + d * 12, py - 118, 12, 6, 8, 0, d * .5), { wash: TK.led, ink: INK, sw: .5 });
    glowAt(px, py - 115, 50, TK.led, 70 + 40 * Math.sin(t * 6));
    // the CEO: points at the sprout every spring; then opens the nesting boxes
    const spr = t < SP.rel && season === 1;
    const opened = SP.box.filter(b => t >= b).length, cxp = t < SP.rel ? 880 : lerp(880, 760, eased(t, SP.rel, SP.rel + .3));
    ceoClawd(cxp, 976, 19, { noShadow: true, eyes: spr ? 'spark' : t > SP.rel ? 'happy' : 'normal', mouth: spr ? 'O' : 'grin', aR: spr ? 1.7 : t > SP.rel ? .9 + opened * .2 : .4, aL: spr ? 1.2 : .4 });
    if (t > SP.rel) {
      const land = eased(t, SP.rel, SP.rel + .3), bx = 1000, by = lerp(-200, 976, land);
      const sizes = [220, 150, 100, 60, 34];
      for (let i = 0; i < 5; i++) {
        const s = sizes[i], open = i < opened, show = i <= opened; if (!show) continue;
        const pk = i === 0 ? 0 : backOut(seg(t, SP.box[i - 1], SP.box[i - 1] + .25)), x = i === 0 ? bx : bx - 40 + i * 70, y = i === 0 ? by : 976 - (i === 4 && t > 156.8 ? 150 * eased(t, 156.8, 157.1) : 0);
        push(); translate(x, y); scale(i === 0 ? 1 : pk);
        paint(rectPts(-s / 2, -s * .8, s, s * .8, 1), { wash: [TK.ember, TK.blue, TK.green, PAL.violet, TK.yellow][i], ink: INK, sw: 1 });
        paint(rectPts(-s * .08, -s * .8, s * .16, s * .8), { wash: TK.yellowLt, ink: null });
        if (!open) paint(rectPts(-s / 2 - 6, -s * .8 - s * .16, s + 12, s * .16, 1), { wash: [TK.ember, TK.blue, TK.green, PAL.violet, TK.yellow][i], ink: INK, sw: 1 });
        else { push(); translate(s / 2, -s * .8); rotate(.9); paint(rectPts(0, -s * .16, s + 12, s * .16, 1), { wash: [TK.ember, TK.blue, TK.green, PAL.violet, TK.yellow][i], ink: INK, sw: 1 }); pop(); }
        pop();
      }
    }
  }
  scene('rap_spring', 152.04, 157.46, spring, [
    [152.04, 1020, 660, 860], [153.9, 1040, 680, 840, 1], [SP.rel, 940, 740, 820, 1], [156.4, 920, 820, 640, 1], [157.459, 920, 820, 620, 1],
  ], [[SP.rel + .3, 8]]);

  // ======== RAP NEW (162.86–167.58) «All I want from that god-tier brain / Is a calorie tracker. Let me explain:» ========
  // A giant glowing brain enthroned on server racks, halo, lightning, cables everywhere. Far below, tiny Clawd holds up his phone.
  // On «calorie tracker» a thin ray from the brain lights the phone: an apple with a little flame. «Let me explain» — he points at his lunch.
  const BRN = { cal: 165.12, expl: 166.6 };
  function brain(t) {
    back(TK.soot);
    dataCenter(t, { heat: .25, vp: [960, 420], n: 8 });
    // the Codex brain on its server throne (halo + lightning are in the drawing); cables run from the throne down to the floor
    for (let i = 0; i < 6; i++) inkLine([[800 + i * 64, 820], [760 + i * 80 + Math.sin(i) * 50, 940], [640 + i * 130, 1070]], 6, [TK.blue, TK.ember, TK.green, TK.yellow, PAL.violet, TK.orange][i], 'ink', .6);
    glowAt(960, 330, 480, '#E27A92', 70 + 40 * kick(t, EN_GRID, .3));
    const bp = 1 + .025 * Math.sin(t * 4) + .04 * kick(t, EN_GRID, .15);
    layer('brain', 960, 440, 720, { sx: bp, sy: bp });
    if (kick(t, EN_GRID, .15) > .5) inkLine([[640, 200], [580, 280], [620, 290], [540, 390]], 4, TK.yellowLt, 'ink', 0);
    // tiny Clawd with his phone; the ray on «calorie tracker»
    const cx = 960, cy = 1060, ph = [cx + 105, cy - 250];
    clawd(cx, cy, 12, { eyes: t > BRN.cal ? 'happy' : 'look', lookY: -1, mouth: t > BRN.cal ? 'grin' : 'o', aR: 1.7, aL: t > BRN.expl ? 1.6 : .3, noShadow: true });
    paint(rrPts(ph[0] - 27, ph[1] - 45, 54, 90, 8), { wash: '#1A1F26', ink: INK, sw: 1 });
    const ray = eased(t, BRN.cal, BRN.cal + .2);
    if (ray > 0) {
      paint([[950, 330], [970, 330], [ph[0] + 12, ph[1]], [ph[0] - 12, ph[1]]], { wash: '#FFF3C8', washOp: 160 * ray, ink: null });
      paint(rrPts(ph[0] - 21, ph[1] - 37, 42, 75, 6), { wash: '#FFFFFF', ink: null });
      paint(ellPts(ph[0], ph[1] + 2, 14, 14, 12), { wash: TK.ember, ink: INK, sw: .5 }); inkLine([[ph[0], ph[1] - 7], [ph[0] + 3, ph[1] - 13]], 1.5, TK.greenDk, 'inkfine', 0);
      fire(ph[0] + 9, ph[1] - 6, 10, 14, t, { k: 1, seed: 2 });
    }
    if (t > BRN.expl) {                                                      // the lunch: a sandwich on a plate on a little table
      const k = backOut(seg(t, BRN.expl, BRN.expl + .3)), x = 1110, y = 1060;
      paint(rectPts(x - 60, y - 70, 120, 12, 1), { wash: '#7A4A2E', ink: INK, sw: .7 }); paint(rectPts(x - 6, y - 58, 12, 58), { wash: '#4A2A1E', ink: INK, sw: .5 });
      if (k > .01) sandwich(x, y - 125, t, 0, 200 * k);
    }
  }
  scene('rap_brain', 162.86, 167.58, brain, [
    [162.86, 960, 460, 1000], [164.6, 960, 560, 1080, 1], [BRN.cal, 980, 700, 860, 1], [BRN.expl, 1030, 840, 720, 1], [167.579, 1060, 860, 680, 1],
  ]);

  // ======== RAP NEW (167.58–178.58) «A hundred thousand G-P-Us, the whole AI craze — just to scan my lunch and find the mayonnaise. …mayonnaise» ========
  // Close on a sandwich under a scanner. Pull back: the scanner hangs off a fat bundle of cables that runs into an endless server hall,
  // every rack blinking. «scan my lunch»: a red scan line sweeps the sandwich. «mayonnaise»: a lock-on frame snaps onto the one white blob;
  // the long «…mayonnaise»: the frame pulses, the whole hall heats up and catches fire; Clawd beams.
  function sandwich(x, y, t, mayoK, w = 420) {                            // (x, y) = centre of the Codex sandwich-on-plate; returns the mayo drip
    layer('sandwich', x, y, w);
    const mx = x + .45 * w, my = y - .03 * w * 321 / 532;
    if (mayoK > 0) glowAt(mx, my, 60, '#FFFDF2', 120 * mayoK);
    return [mx, my];
  }
  const MY = { scan: 170.30, lock: 171.70, hold: 172.14, burn: 174.0, out: 175.88 };
  function mayo(t) {
    back(TK.soot);
    const heat = eased(t, MY.hold, MY.out), fireK = eased(t, MY.burn, MY.out + 1);
    dataCenter(t, { heat, fire: fireK, vp: [960, 470], n: 8 });
    // the cable bundle from the depth of the hall to the scanner
    for (let i = 0; i < 7; i++) inkLine([[960 + (i - 3) * 10, 470], [960 + (i - 3) * 40, 250], [1000 + (i - 3) * 14, 560]], 6, [TK.blue, TK.ember, TK.green, TK.yellow, PAL.violet, TK.orange, TK.blueDk][i], 'ink', .7);
    // table + sandwich + scanner
    paint(rectPts(740, 880, 520, 26, 1), { wash: '#7A4A2E', ink: INK, sw: 1 }); for (const lx of [770, 1210]) paint(rectPts(lx, 906, 20, 160), { wash: '#4A2A1E', ink: INK, sw: .6 });
    const [mx, my] = sandwich(1000, 770, t, eased(t, MY.lock, MY.lock + .3));
    paint([[940, 560], [1060, 560], [1090, 640], [910, 640]], { wash: A2.steel, fill: A2.gunDk, fillOp: 60, tex: .4, ink: INK, sw: 1.2 });
    paint(rectPts(930, 636, 140, 14), { wash: '#FF2F4A', ink: INK, sw: .6 });
    const sc = seg(t, MY.scan, MY.lock);
    if (sc > 0 && sc < 1) { const sx = lerp(820, 1180, (Math.sin(sc * Math.PI * 3 - Math.PI / 2) + 1) / 2); paint([[990, 650], [1010, 650], [sx + 4, 800], [sx - 4, 800]], { wash: '#FF2F4A', washOp: 110, ink: null }); inkLine([[sx, 700], [sx, 800]], 3, '#FF2F4A', 'ink', 0); }
    if (t > MY.lock) {                                                       // lock-on frame: four corners snapping in, then pulsing
      const k = eased(t, MY.lock, MY.lock + .2), p = 1 + .08 * Math.sin(t * 12) * (t > MY.hold ? 1 : 0), r = lerp(300, 80, k) * p;
      const L = r * .45, T = 9;                                             // brackets as polygons (a thick inkLine blobs into discs)
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const x = mx + sx * r, y = my + sy * r * .8;
        paint(rectPts(Math.min(x, x - sx * L), y - T / 2, L, T), { wash: '#FF2F4A', ink: null }); paint(rectPts(x - T / 2, Math.min(y, y - sy * L), T, L), { wash: '#FF2F4A', ink: null }); }
    }
    const cx = 660;
    clawd(cx, 1060, 16, { eyes: t > MY.lock ? 'heart' : 'look', lookX: 1, mouth: t > MY.lock ? 'grin' : 'smile', aL: t > MY.hold ? 1.5 + .3 * Math.sin(t * 8) : .4, aR: t > MY.hold ? 1.5 + .3 * Math.sin(t * 8 + 1) : .4, noShadow: true });
    if (t > MY.out) flash(kick(t, [MY.out], .5) * .4, TK.orange);
  }
  scene('rap_mayo', 167.58, 178.58, mayo, [
    [167.58, 1040, 780, 460], [170.2, 960, 560, 1080, 1], [MY.scan + .2, 1000, 780, 700, 1], [MY.lock, 1110, 820, 360, 1], [MY.burn, 1080, 780, 560, 1],
    [MY.out, 960, 600, 1080, 1], [178.579, 960, 580, 1080, 1],
  ], [[MY.lock, 8], [MY.out, 12]]);

  // ======== CHORUS 3 (178.58–183.82) «BURN THE TOKENS! BURN THE TOKENS! 'Til the limit hits the floor!» = the shredder again, «floor» on the bar ========
  replay('c3_shredder', 178.58, 183.82, s2, 133.14);

  // ======== OUTRO NEW (210.0–216.68) «Sunday. Eleven fifty-eight p.m. / Zero tokens left.» — the same room at night ========
  // The cuckoo clock at two to twelve (second ticks on the hits). The last coin in the jar flickers, burns out in a puff; the wall bar drains.
  const SU = { zero: 214.40 };
  function sunday(t) {
    const tick = EN_HITS.filter(([h]) => h > 210 && h <= t).length;
    const last = t < SU.zero ? 1 : 1 - eased(t, SU.zero + .2, SU.zero + .8);
    nightRoom(t, { min: -.21 + tick * .012, hour: -.02, lid: 1, glow: '#3A6AE0', fill: last > .5 ? 1 / 14 : 0, eyes: t > SU.zero + .6 ? 'closed' : 'narrow', mouth: 'flat' });
    if (t > SU.zero + .2 && t < SU.zero + 1.4) smoke(ROOM.jar[0], ROOM.jar[1] - 60, t, { k: 1 - seg(t, SU.zero + .8, SU.zero + 1.4) });
    if (last > 0 && last < 1) fire(ROOM.jar[0], ROOM.jar[1] - 14, 30, 40 * last, t, { k: last, seed: 5 });
  }
  scene('out_sunday', 210.0, 216.68, sunday, [
    [210.0, 920, 600, 820], [213.4, 1100, 760, 760, 1], [SU.zero, 1380, 860, 460, 1], [216.679, 1360, 860, 500, 1],
  ]);

  // ======== OUTRO NEW (224.72–228.76) «Silence. / I'm at peace.» — Clawd in the armchair, eyes shut, smiling; only the pendulum moves ========
  scene('out_peace', 224.72, 228.76, t => nightRoom(t, { min: -.035, hour: -.004, lid: 0, fill: 0, eyes: 'closed', mouth: 'smile' }), [
    [224.72, 1120, 620, 1000], [228.759, 1180, 680, 820, 1],
  ]);

  // ======== OUTRO NEW (230.72–236.02) «"Your weekly limit has been reset."» ========
  // The laptop flips open in green light, the bar on the wall clicks all the way to full, the empty jar refills coin by coin. Clawd opens his eyes.
  const RS = { lid: 230.9, bar: 231.7, jar: 232.8, eyes: 234.0 };
  function reset(t) {
    nightRoom(t, { min: 0, hour: 0, lid: eased(t, RS.lid, RS.lid + .15), glow: TK.led, fill: seg(t, RS.jar, 234.6), gauge: eased(t, RS.bar, RS.bar + .6), gaugeGlow: kick(t, [RS.bar + .6], .8),
      eyes: t < RS.eyes ? 'closed' : 'narrow', mouth: 'flat', lit: t > RS.lid ? TK.led : null });
  }
  scene('out_reset', 230.72, 236.02, reset, [
    [230.72, 1260, 620, 900], [RS.bar - .2, 1300, 600, 700, 1], [RS.jar, 1360, 740, 700, 1], [RS.eyes, 1300, 860, 520, 1], [236.019, 1300, 900, 360, 1],
  ], [[RS.bar + .6, 6]]);

  // ======== OUTRO NEW (236.02–249.216) «Fuck.» — the break — «Fuck.» — the title ========
  // 236.28 extreme close-up, eyes half shut, the green laptop light the only thing moving. 237.02 (the loudest bar of the song): the floor
  // bursts and the bull roars up through the room, the jar spews coins, agents pour out of the laptop. 241.92 the same close-up, lit orange.
  // 243.2 black card: the title stamp + credit.
  const FN = { f1: 236.28, brk: 237.02, f2: 241.92, card: 243.2 };
  const face = (t, lit) => nightRoom(t, { min: 0, hour: 0, lid: 1, glow: TK.led, fill: 1, gauge: 1, eyes: 'narrow', mouth: 'flat', lit });
  function finale(t) {
    if (t < FN.brk) return face(t, mixCol(TK.led, '#000000', .3 * Math.abs(Math.sin(t * 9))));
    if (t < FN.f2) {
      const a = t - FN.brk;
      nightRoom(t, { min: 0, hour: 0, lid: 1, glow: TK.orange, fill: 1 - seg(a, 0, 1.5), gauge: 1, gaugeGlow: 1, eyes: 'scared', mouth: 'O' });
      const up = easeOut(seg(a, 0, .35)), st = a < .5 ? .25 * Math.sin(a / .5 * Math.PI) : 0;
      bull(960, lerp(1900, 1170, up), t - FN.brk + 43.68, a, { sy: 1 + st, sx: 1 - st * .5 });
      paint(rectPts(-400, 1060, W + 800, 600), { wash: '#5A3A28', fill: '#3A2418', fillOp: 90, tex: .6, ink: null });
      rubble(960, 1060, 900, a, 3);
      for (let i = 0; i < 20; i++) { const u = frac(a * .8 + hash(i)), [x, y] = arc(ROOM.jar[0], ROOM.jar[1] - 60, 500 + hash(i + 2) * 900, 1060, 300 + hash(i) * 300, u); token(x, y, 16, { spin: t * 4 + i, burn: u }); }
      for (let i = 0; i < 8; i++) { const u = frac(a * .5 + i / 8), [x, y] = arc(ROOM.laptop[0], ROOM.laptop[1] - 60, 1500 - i * 40, 1060, 220, u); A06.mini(x, y, 4.5, { n: i + 1, eyes: 'happy', mouth: 'O', aL: 1.4, aR: 1.4 }); }
      fire(960, 1060, 1100, 160 * seg(a, .3, 1.5), t, { k: seg(a, .3, 1.2), seed: 8 });
      flash(kick(t, [FN.brk], .3) * .6, '#FFFFFF');
      return;
    }
    if (t < FN.card) return face(t, mixCol(TK.orange, TK.ember, .5 + .5 * Math.sin(t * 11)));
    back('#0A0A0C');
    paint(rectPts(-400, -400, W + 800, 1900), { wash: '#0A0A0C', ink: null });
    stamp('BURN THE TOKENS', 960, 500, 76, t, FN.card + .2, { col: TK.yellow, rot: -.04 });
    const cr = eased(t, FN.card + 1.2, FN.card + 1.8);
    if (cr > 0) letter('created by rocketmandrey', 960, 640, 30, PAL.cream, { font: ruFont(30), ink: false, alpha: cr });
    glowAt(960, 1000, 520, TK.orange, 90);                              // the card sits over a low fire, one token burning in it
    fire(960, 1080, 900, 240 + 40 * kick(t, EN_GRID, .3), t, { k: .8, seed: 13 });
    token(960, 860, 64, { spin: t * .8, burn: .6 + .4 * Math.sin(t * 3) });
  }
  const FACE = [ROOM.chair[0], ROOM.chair[1] - 100 - 6 * 12];
  scene('out_finale', 236.02, 249.216, finale, [
    [236.02, FACE[0], FACE[1], 300], [FN.brk, 960, 620, 1080], [FN.brk + 2.5, 960, 600, 1120, 1], [FN.f2 - .01, 960, 600, 1120, 1], [FN.f2, FACE[0], FACE[1], 300], [FN.card - .01, FACE[0], FACE[1], 290, 1],
    [FN.card, 960, 700, 900], [249.215, 960, 690, 860, 1],
  ], [[FN.brk, 26]]);
})();

// Every second of the song now has an EN chapter, so the old RU chapters (b07 samsara, b08 mayo, b10 finale were registered as
// real and would win the lookup) are dropped outright: nothing Russian can leak back in.
for (let i = CH.length - 1; i >= 0; i--) if (CH[i].real && !CH[i].name.startsWith('en_')) CH.splice(i, 1);
