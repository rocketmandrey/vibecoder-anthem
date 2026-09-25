// i05_bridge: Bridge (109.4–125.88) · storm violet, rain, thunder.
// Smirk over the shoulder → the rumor mill → copycat buns + the two lanes → she calls the rain, thunder jams the
// photocopier → dark whisper in a single spotlight → the rain freezes → 1, 2, 3, DROP → white/pink flash.
(() => {
  const B = n => OFF + n * BEAT;
  const SKYC = '#51466E', SKYD = '#2A2140', CLOUD = '#6A5F88', CLOUDD = '#3A3056', RAINC = '#C9D3F2';
  const STREET = '#3B3152', PUD = '#8A80B4', DARK = '#1E1733';
  const RIV = { col: '#A79CBF', dk: '#6F6590', lt: '#C9C0DB' };
  const FULL = () => rectPts(-3000, -3000, 8000, 8000);
  const glow = (x, y, rx, ry, col, op = 80, bleed = .3) => paint(ellPts(x, y, rx, ry, 22), { fill: col, fillOp: op, bleed, tex: .3, border: .2, ink: null });
  const spk = (x, y, r, k, c) => { if (k > 0 && k < 1) sparkle(x, y, r, k, c); };   // kit sparkle() stays full-size at k >= 1
  const disc = (x, y, r, col, op = 255, n = 12) => paint(ellPts(x, y, r, r, n), { wash: col, washOp: op, ink: null });

  // ---------- storm kit ----------
  function sky(o = {}) {
    paint(FULL(), { wash: o.col || SKYC, fill: o.fillC || SKYD, fillOp: 120, bleed: .12, tex: .6, border: .3, ink: null });
    glow(960, o.hz ?? 760, 1300, 300, '#8C6FA8', 70, .35);
  }
  function cloud(x, y, s, col = CLOUD, op = 150) {
    for (const [dx, dy, rx, ry] of [[-1, 0, 1.1, .7], [0, -.4, 1.3, .9], [1.1, .05, 1, .65], [0, .3, 1.9, .55]])
      paint(ellPts(x + dx * s, y + dy * s, rx * s, ry * s, 16, s * .04), { fill: col, fillOp: op, bleed: .2, tex: .5, border: .4, ink: null });
  }
  function cloudBank(t, y, n, seed = 0, col = CLOUD, drift = 20) {
    for (let i = 0; i < n; i++) cloud(((hash(i + seed) * 2600 + t * drift * (1 + hash(i + seed + 5))) % 2600) - 340, y + hash(i + seed + 2) * 120, 150 + hash(i + seed + 3) * 110, i % 2 ? col : CLOUDD, 140);
  }
  function city(hz, seed = 0) {
    for (let i = 0; i < 16; i++) {
      const x = -300 + i * 170 + hash(i + seed) * 40, h = 160 + hash(i + seed + 1) * 300;
      paint(rectPts(x, hz - h, 150, h + 40), { wash: i % 2 ? '#2E2548' : '#382D57', ink: null });
      for (let k = 0; k < 3; k++) if (hash(i * 5 + k + seed) > .45) paint(rectPts(x + 20 + k * 42, hz - h + 40 + hash(i + k) * (h - 90), 14, 18), { wash: k % 2 ? MG.goldLt : MG.pink, washOp: 190, ink: null });
    }
  }
  function street(t, hz) {
    paint(rectPts(-2000, hz, 6000, 1500), { wash: STREET, fill: '#2A2240', fillOp: 90, bleed: .1, tex: .5, ink: null });
    for (let i = 0; i < 6; i++) {
      const x = -200 + hash(i + 50) * 2300, y = hz + 60 + hash(i + 51) * 220, rx = 90 + hash(i + 52) * 120;
      paint(ellPts(x, y, rx, rx * .16, 16), { fill: PUD, fillOp: 90, bleed: .15, tex: .4, ink: null });
      const r = frac(t * 1.3 + hash(i + 53)) * rx * .6;                                    // ripple
      inkLine(ellPts(x, y, r, r * .16, 12), .35, RAINC, 'inkfine', .5);
    }
  }
  // Rain: short slanted inkLine streaks. Pure function of tt; pass a fixed tt to freeze it.
  function rain(tt, o = {}) {
    const [ax, ay, aw, ah] = o.area || [-300, -300, W + 600, H + 500], n = o.n ?? 70, seed = o.seed || 0, len = o.len ?? 46, sl = o.slant ?? .22;
    for (let i = 0; i < n; i++) {
      const ph = frac(hash(i * 1.7 + seed) + tt * (o.speed ?? 1500) / ah * (.85 + .3 * hash(i + seed + 9)));
      const y = ay + ph * ah, x = ax + hash(i * 3.1 + seed) * aw - sl * ph * ah;
      inkLine([[x, y], [x - sl * len, y + len]], o.sw ?? .45, o.col || RAINC, 'inkfine', 0);
    }
  }
  function splashes(t, x0, x1, y, n = 10, seed = 0) {
    for (let i = 0; i < n; i++) {
      const ph = frac(t * 2.2 + hash(i + seed)); if (ph > .5) continue;
      const x = lerp(x0, x1, hash(i + seed + 30)), r = 4 + ph * 34;
      inkLine([[x - r, y], [x - r * .5, y - r * .7], [x, y - r * .2]], .4, RAINC, 'inkfine', .5);
      inkLine([[x, y - r * .2], [x + r * .5, y - r * .7], [x + r, y]], .4, RAINC, 'inkfine', .5);
    }
  }
  function dotBubble(x, y, s, k = 1) {
    if (k < .05) return; const p = backOut(k);
    paint(ellPts(x, y, s * 1.5 * p, s * p, 16), { wash: '#EDE4F7', washOp: 210, ink: PAL.ink, sw: .6 });
    paint([[x - s * .5 * p, y + s * .8 * p], [x - s * .9 * p, y + s * 1.5 * p], [x - s * .1 * p, y + s * .9 * p]], { wash: '#EDE4F7', washOp: 210, ink: null });
    for (const d of [-1, 0, 1]) disc(x + d * s * .5 * p, y + Math.sin(T * 9 + d) * s * .08, s * .14 * p, PAL.ink, 255, 8);
  }
  function bolt(x0, y0, x1, y1, seed, w) {
    const n = 9, pts = [];
    for (let i = 0; i <= n; i++) { const f = i / n, off = i && i < n ? (hash(seed + i) - .5) * 160 : 0; pts.push([lerp(x0, x1, f) + off, lerp(y0, y1, f)]); }
    const L = pts.map(([x, y], i) => [x - w * (1 - i / n * .7), y]), R = pts.map(([x, y], i) => [x + w * (1 - i / n * .7), y]).reverse();
    paint([...L, ...R], { wash: '#FFF8D6', fill: MG.goldLt, fillOp: 120, ink: PAL.ink, sw: 1.2 });
    for (let i = 2; i < n; i += 3) glow(pts[i][0], pts[i][1], 260, 200, '#F4ECFF', 90, .35);
    return pts;
  }

  // ---------- characters ----------
  const rival = (x, y, u, o = {}) => clawd(x, y, u, { ...RIV, ...o });
  // the cheap copycat buns: one huge, one tiny that slides off, a single limp pigtail, a tinfoil tiara
  const lopBuns = slip => (u, sw) => {
    const tl = []; for (let i = 0; i <= 5; i++) { const f = i / 5; tl.push([-4.6 * u - f * 1.2 * u + Math.sin(T * 2 + f * 2) * .3 * u, -9 * u + f * 5.5 * u]); }
    inkLine(tl, sw * 4, '#C8AE58', 'marker', .5);
    paint(ellPts(-3.3 * u, -9.4 * u, 2.2 * u, 1.9 * u, 14, u * .1), { wash: '#D8B85A', fill: '#9E8440', fillOp: 70, tex: .6, ink: PAL.ink, sw: sw * .7 });
    inkLine([[-4.4 * u, -9.8 * u], [-3.3 * u, -10.5 * u], [-2.3 * u, -9.4 * u]], sw * .4, '#9E8440', 'inkfine', .5);
    paint(ellPts(3.3 * u + slip * 2 * u, -8.7 * u + slip * 4.2 * u, .95 * u, .85 * u, 12), { wash: '#D8B85A', fill: '#9E8440', fillOp: 70, ink: PAL.ink, sw: sw * .6 });
    push(); rotate(.12); crescent(0, -8.6 * u, .6 * u, -Math.PI / 2, '#C9CBD6', { sw: sw * .4 }); pop();
    inkLine([[-2.6 * u, -8.2 * u], [-1.2 * u, -8.6 * u]], sw * .5, '#8C8C9C', 'inkfine', 0);            // bobby pin
  };
  const upWand = (u, sw) => { push(); rotate(.9); moonWand(u, sw); pop(); };   // keeps the wand clear of the pigtails when the arm is raised
  function hero(x, y, u, o = {}) { sailorClawd(x, y, u, { wand: true, armR: (o.aR ?? 0) > .55 ? upWand : undefined, ...o }); }

  // photocopier: o.scan 0..1 (light bar under the lid), o.out 0..1 (copy sliding out), o.jam 0..1
  function copier(x, y, s, t, o = {}) {
    const jam = o.jam || 0;
    if (jam > 0) push(), translate(x, y), rotate(Math.sin(t * 40) * .02 * jam), translate(-x, -y);
    paint(ellPts(x, y + 4, 2.2 * s, .25 * s, 16), { fill: PAL.ink, fillOp: 80, bleed: .2, ink: null });
    paint(rrPts(x - 1.6 * s, y - 2.2 * s, 3.2 * s, 2.2 * s, .12 * s), { wash: '#D4CCE0', fill: '#9C92B6', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.1 });
    for (const dy of [-1.5, -.8]) inkLine([[x - 1.3 * s, y + dy * s], [x + 1.3 * s, y + dy * s]], .6, '#8A80A6', 'inkfine', 0);
    paint(rrPts(x - 1.8 * s, y - 3.1 * s, 3.6 * s, .9 * s, .1 * s), { wash: '#E6E0EE', ink: PAL.ink, sw: 1.1 });
    paint(rectPts(x - 1.85 * s, y - 3.25 * s, 3.1 * s, .2 * s), { wash: '#6F6590', ink: PAL.ink, sw: .8 });      // lid
    if (o.scan != null && !jam) glow(x - 1.5 * s + o.scan * 3 * s, y - 2.9 * s, .35 * s, .5 * s, '#9FF0B0', 150, .2);
    paint(rrPts(x + .6 * s, y - 2.85 * s, 1 * s, .45 * s, .06 * s), { wash: '#3A3050', ink: null });
    const blink = jam ? (Math.sin(t * 20) > 0 ? '#FF4A5A' : '#6A2030') : '#7CF08A';
    disc(x + .8 * s, y - 2.62 * s, .09 * s, blink); disc(x + 1.1 * s, y - 2.62 * s, .07 * s, MG.gold);
    // output tray + the (bad) copy
    paint([[x + 1.6 * s, y - 1.7 * s], [x + 2.4 * s, y - 1.9 * s], [x + 2.4 * s, y - 1.75 * s], [x + 1.6 * s, y - 1.5 * s]], { wash: '#B3A9C8', ink: PAL.ink, sw: .8 });
    if (!jam && o.out > 0) {
      const ox = x + 1.6 * s + o.out * .9 * s, oy = y - 2.05 * s;
      paint(rectPts(ox - .7 * s, oy - .5 * s, 1 * s, .7 * s), { wash: '#F4F0F8', ink: PAL.ink, sw: .6 });
      paint(ellPts(ox - .2 * s, oy - .1 * s, .28 * s, .2 * s, 10, s * .03), { fill: '#6F6590', fillOp: 150, bleed: .3, ink: null });        // smudged copy of her
      disc(ox - .45 * s, oy - .35 * s, .12 * s, '#8A8298', 200, 8); disc(ox + .08 * s, oy - .3 * s, .06 * s, '#8A8298', 200, 8);
    }
    if (jam > 0) {
      const pts = []; for (let i = 0; i <= 8; i++) pts.push([x + 1.6 * s + i * .22 * s * jam, y - 2.3 * s - (i % 2 ? .35 : 0) * s - i * .08 * s * jam]);
      const top = pts.map(([a, b]) => [a, b - .45 * s]);
      paint([...pts, ...top.reverse()], { wash: '#F4F0F8', fill: '#B3A9C8', fillOp: 70, ink: PAL.ink, sw: .8 });
      for (let i = 0; i < 5; i++) {                                               // smoke puffs
        const f = frac(t * .9 + i / 5), px = x - .6 * s + hash(i) * 1.4 * s + Math.sin(t * 2 + i) * 20, py = y - 3.2 * s - f * 2.2 * s;
        paint(ellPts(px, py, (.25 + f * .5) * s, (.2 + f * .4) * s, 12, 3), { fill: f < .3 ? '#3A3050' : '#7A7090', fillOp: 150 * (1 - f) * jam, bleed: .25, ink: null });
      }
      for (let i = 0; i < 4; i++) spk(x - 1.4 * s + hash(i + 7) * 2.8 * s, y - 3.2 * s - hash(i + 8) * .6 * s, .22 * s, frac(t * 3 + hash(i)), MG.goldLt);
    }
    if (jam > 0) pop();
  }

  // =====================================================================================================
  // 1 · SMIRK (109.4–111.35): she struts away in the rain; lips whisper behind; she glances back and smirks.
  // =====================================================================================================
  function smirk(t, lt) {
    const g = B(221), gk = seg(t, g, g + .3);
    const [sx, sy] = shakeXY(t, 1.5);
    camBegin(lerp(960, 1080, ease(seg(t, 109.4, 111.3))) + sx, 560 - 30 * ease(gk) + sy, kf(t, [[109.4, 1.02], [g, 1.05], [g + .35, 1.16], [111.35, 1.2]], easeOut), .02 * wob(t, .3));
    sky({ hz: 780 });
    cloudBank(t, 20, 7, 3);
    city(790, 4);
    street(t, 790);
    // lamppost
    inkLine([[1560, 900], [1560, 330], [1510, 290]], 3.2, '#241C38', 'ink', .4);
    paint(ellPts(1495, 300, 34, 18, 12), { wash: MG.goldLt, ink: PAL.ink, sw: 1 });
    paint([[1470, 310], [1520, 310], [1700, 900], [1290, 900]], { fill: MG.goldLt, fillOp: 45, bleed: .25, tex: .3, ink: null });
    glow(1495, 900, 260, 40, MG.goldLt, 90);
    // whispering lips behind her
    const L = [[330, 560, 50, 0], [560, 430, 62, 2], [720, 640, 44, 4]];
    L.forEach(([x, y, s, sd], i) => {
      const scare = seg(t, g + .15, g + .3), bob = Math.sin(t * 5 + i) * 8 - scare * 40 * Math.sin(Math.PI * seg(t, g + .15, g + .6));
      lips(x, y + bob, s * (1 - .2 * scare), t, { talk: lerp(1, .05, scare), seed: sd, rot: .15 - i * .1 });
      if (scare < .5) dotBubble(x + s * 1.6, y - s * 1.3 + bob, s * .5, seg(t, 109.5 + i * .25, 109.8 + i * .25) * (1 - scare * 2));
      emote('sweat', x + s * 1.3, y - s * .8 + bob, s * .35, scare);
    });
    // her: strutting, then the over-the-shoulder look
    const walking = t < g, m = move(walking ? 'walk' : 'idle', t);
    const x = 1020 + Math.min(t, g) * 0 + (Math.min(t, g) - 109.4) * 90;
    const md = mood(t, [[109.4, 'look'], [g, 'narrow', 'spark']]);
    hero(x, 905, 44, { ...m, ...md, lookX: 1, lookY: -.2, mouth: t < g ? 'smile' : 'cat', blush: t >= g, aL: walking ? m.aL : -.7, aR: walking ? m.aR : .5,
      rot: walking ? m.rot : -.06 * ease(gk) });
    if (t > g) spk(x - 150, 905 - 44 * 6.2, 40, seg(t, g + .05, g + .55), MG.goldLt);
    rain(t, { n: 80 });
    splashes(t, 600, 1900, 900, 12);
    camEnd();
  }

  // =====================================================================================================
  // 2 · RUMOR MILL (111.35–113.35): windmill of gossip magazines, cranked by lips in a tiny tailored suit.
  // =====================================================================================================
  function magazine(i, s) {
    const cols = [MG.pink, MG.goldLt, MG.sky, MG.mint];
    paint(rrPts(-.5 * s, 0, s, 1.35 * s, .04 * s), { wash: cols[i % 4], fill: '#FFFFFF', fillOp: 30, ink: PAL.ink, sw: .9 });
    paint(rectPts(-.44 * s, .06 * s, .88 * s, .2 * s), { wash: MG.hot, ink: null });                   // masthead
    for (const d of [-.25, 0, .25]) disc(d * s, .16 * s, .04 * s, MG.cream, 255, 6);
    paint(rectPts(-.2 * s, .55 * s, .4 * s, .3 * s), { wash: PAL.clay, ink: PAL.ink, sw: .5 });       // her tiny face on the cover
    for (const e of [-1, 1]) disc(e * .2 * s, .52 * s, .08 * s, MG.hair, 255, 8);
    paint(heartPts(.28 * s, 1.08 * s, .09 * s, 12), { wash: MG.red, ink: null });
    for (const yy of [1.02, 1.12]) inkLine([[-.38 * s, yy * s], [.1 * s, yy * s]], .4, PAL.ink, 'inkfine', 0);
  }
  function rumorMill(t, lt) {
    const bp = bpOf(t), spin = t * 1.3 + .45 * (Math.floor(bp) + easeOut(frac(bp) * 2.5));
    const [sx, sy] = shakeXY(t, 2 * pulse(t, 8));
    camBegin(lerp(960, 1130, ease(lt / 2)) + sx, lerp(470, 560, ease(lt / 2)) + sy, lerp(.86, 1.12, ease(lt / 2)), -.03 + .015 * wob(t, .4));
    sky({ hz: 820 });
    cloudBank(t, -40, 7, 11, CLOUD, 40);
    paint([[-800, 900], [300, 800], [900, 830], [1700, 790], [2800, 880], [2800, 1600], [-800, 1600]], { wash: '#3E3460', fill: '#2A2240', fillOp: 80, tex: .5, ink: PAL.ink, sw: .8, curv: .3 });
    // tower
    const HX = 900, HY = 360;
    paint([[HX - 80, HY + 40], [HX + 80, HY + 40], [HX + 170, 880], [HX - 170, 880]], { wash: '#8D7FAE', fill: '#5C4F80', fillOp: 90, tex: .6, ink: PAL.ink, sw: 1.3 });
    paint([[HX - 100, HY + 50], [HX, HY - 40], [HX + 100, HY + 50]], { wash: MG.hot, fill: MG.pinkDk, fillOp: 70, ink: PAL.ink, sw: 1.2 });
    paint(rrPts(HX - 45, 760, 90, 120, 40), { wash: '#3A3050', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 4; i++) inkLine([[HX - 120 + i * 10, 520 + i * 90], [HX + 120 - i * 10 + 30, 520 + i * 90]], .4, '#5C4F80', 'inkfine', 0);
    // sails = magazines
    for (let i = 0; i < 4; i++) {
      push(); translate(HX, HY); rotate(spin + i * Math.PI / 2);
      inkLine([[0, 0], [0, 330]], 2.2, '#5A3E2A', 'ink', 0);
      push(); translate(0, 60); magazine(i, 190); pop();
      pop();
    }
    disc(HX, HY, 26, MG.gold); paint(ellPts(HX, HY, 26, 26, 12), { ink: PAL.ink, sw: 1 });
    // pages torn off, fluttering away in the wind
    for (let i = 0; i < 8; i++) {
      const f = frac(t * .45 + hash(i + 3)), px = HX + 100 + f * 1300, py = HY - 50 + Math.sin(f * 7 + i) * 90 + hash(i) * 300 - f * 200;
      push(); translate(px, py); rotate(f * 9 + i); scale(.9 + .3 * Math.sin(t * 8 + i), 1);
      paint(rectPts(-26, -34, 52, 68), { wash: i % 2 ? MG.pink : MG.cream, ink: PAL.ink, sw: .6 });
      inkLine([[-16, -12], [16, -12]], .4, PAL.ink, 'inkfine', 0); inkLine([[-16, 4], [10, 4]], .4, PAL.ink, 'inkfine', 0);
      pop();
    }
    // crank + the suited lips
    const CX = 1140, CY = 740, cr = 44, ca = spin * 2, hx = CX + Math.cos(ca) * cr, hy = CY + Math.sin(ca) * cr;
    inkLine([[HX + 60, CY], [CX, CY]], 2, '#5A3E2A', 'ink', 0);
    paint(ellPts(CX, CY, cr + 10, cr + 10, 18), { wash: '#B98A60', ink: PAL.ink, sw: 1 });
    inkLine([[CX, CY], [hx, hy]], 2.4, '#5A3E2A', 'ink', 0);
    disc(hx, hy, 9, '#3A3050');
    const lx = 1300, ly = 690, bob = pulse(t, 7) * 8;
    paint(ellPts(lx, 935, 90, 14, 14), { fill: PAL.ink, fillOp: 80, bleed: .2, ink: null });
    for (const e of [-1, 1]) { paint(rectPts(lx + e * 26 - 12, 850, 24, 80), { wash: '#1E2238', ink: PAL.ink, sw: .8 }); paint(ellPts(lx + e * 26 + e * 6, 932, 22, 10, 10), { wash: '#15121E', ink: null }); }
    paint([[lx - 62, 740 - bob], [lx + 62, 740 - bob], [lx + 56, 860], [lx - 56, 860]], { wash: '#2E3350', fill: '#1E2238', fillOp: 60, tex: .4, ink: PAL.ink, sw: 1, curv: .1 });   // tailored jacket
    paint([[lx - 22, 740 - bob], [lx + 22, 740 - bob], [lx, 800 - bob]], { wash: MG.cream, ink: PAL.ink, sw: .6 });
    paint([[lx - 7, 748 - bob], [lx + 7, 748 - bob], [lx + 9, 820 - bob], [lx, 832 - bob], [lx - 9, 820 - bob]], { wash: MG.red, ink: PAL.ink, sw: .6 });
    for (const e of [-1, 1]) inkLine([[lx + e * 20, 745 - bob], [lx + e * 40, 800 - bob]], .7, '#15121E', 'inkfine', 0);   // lapels
    disc(lx - 40, 770 - bob, 7, MG.hot);                                                                                   // pocket square
    inkLine([[lx - 58, 760 - bob], [lerp(lx - 58, hx, .5), lerp(760, hy, .5) + 20], [hx, hy]], 4, '#2E3350', 'marker', .5);
    paint(ellPts(hx, hy, 11, 11, 10), { wash: MG.glove, ink: PAL.ink, sw: .6 });
    inkLine([[lx + 58, 760 - bob], [lx + 90, 730 - bob], [lx + 104, 690 - bob + Math.sin(t * 9) * 16]], 4, '#2E3350', 'marker', .5);   // gesturing
    paint(ellPts(lx + 104, 690 - bob + Math.sin(t * 9) * 16, 11, 11, 10), { wash: MG.glove, ink: PAL.ink, sw: .6 });
    lips(lx, 690 - bob, 60, t, { talk: 1, seed: 1 });
    dotBubble(lx + 150, 560, 36, seg(lt, .1, .4));
    rain(t, { n: 60, seed: 7 });
    camEnd();
  }

  // =====================================================================================================
  // 3 · COPYCAT (113.35–114.45): a rival tries her lopsided buns at a mirror; the mirror shows the dream, then reality.
  // =====================================================================================================
  function copycat(t, lt) {
    const b1 = B(227), b2 = B(228), slip = kf(t, [[b2, 0], [b2 + .16, 1]], easeIn);
    const [sx, sy] = shakeXY(t, 4 * Math.exp(-Math.max(0, t - b2) * 8) * (t > b2 ? 1 : 0));
    camBegin(lerp(900, 980, ease(lt / 1.1)) + sx, 540 + sy, lerp(1.04, 1.12, ease(lt / 1.1)), .03 * wob(t, .5));
    paint(FULL(), { wash: '#4E3F6A', fill: '#382C52', fillOp: 90, bleed: .1, tex: .6, ink: null });
    for (let i = 0; i < 12; i++) inkLine([[-200 + i * 190, -200], [-200 + i * 190, 1300]], 1.6, '#5E4E7E', 'dry', 0);          // wallpaper stripes
    // stormy window
    paint(rectPts(160, 120, 360, 380), { wash: '#2A2140', fill: '#5A4E80', fillOp: 90, ink: PAL.ink, sw: 1.4 });
    rain(t, { area: [170, 60, 400, 460], n: 18, len: 30, seed: 4 });
    inkLine([[340, 120], [340, 500]], 1.4, PAL.ink, 'ink', 0); inkLine([[160, 310], [520, 310]], 1.4, PAL.ink, 'ink', 0);
    // floor + vanity
    paint(rectPts(-400, 880, 3000, 500), { wash: '#3A2E4E', fill: '#2A2138', fillOp: 70, tex: .5, ink: null });
    paint(rrPts(1020, 840, 500, 60, 10), { wash: '#B97A5A', fill: '#7E4A34', fillOp: 70, ink: PAL.ink, sw: 1.1 });
    for (const lx of [1050, 1470]) paint(rectPts(lx, 900, 26, 90), { wash: '#7E4A34', ink: PAL.ink, sw: .8 });
    paint(rrPts(1080, 780, 44, 60, 10), { wash: MG.pink, ink: PAL.ink, sw: .8 }); disc(1102, 772, 10, MG.gold);
    paint(rrPts(1420, 800, 50, 40, 8), { wash: MG.lilac, ink: PAL.ink, sw: .8 });
    // mirror
    const MX = 1270, MY = 490;
    paint(ellPts(MX, MY, 250, 330, 30), { wash: MG.gold, fill: KP.goldDk, fillOp: 80, tex: .5, ink: PAL.ink, sw: 1.4 });
    paint(ellPts(MX, MY, 215, 295, 30), { wash: '#D9D2EE', fill: '#A99CCB', fillOp: 90, bleed: .1, tex: .4, ink: PAL.ink, sw: 1 });
    if (t < b1) {                                                                // the dream: the real it girl
      glow(MX, MY + 40, 180, 220, MG.pink, 110);
      hero(MX, MY + 250, 24, { ...move('bounce', t), eyes: 'wink', mouth: 'smile', blush: true, aR: 1.3, noShadow: true });
      for (let i = 0; i < 4; i++) spk(MX - 140 + i * 90, MY - 200 + (i % 2) * 60, 22, frac(t * 2 + i * .3), MG.goldLt);
    } else {                                                                     // reality
      rival(MX, MY + 250, 24, { flip: true, eyes: t > b2 ? 'scared' : 'happy', mouth: t > b2 ? 'wobble' : 'smile', aR: 1.2, noShadow: true, draw: lopBuns(slip) });
      spk(MX, MY, 190, seg(t, b1, b1 + .25), MG.cream);
    }
    inkLine([[MX - 150, MY - 190], [MX - 60, MY - 260]], 2.4, '#FFFFFF', 'marker', 0);                   // glass sheen
    inkLine([[MX - 160, MY - 110], [MX - 110, MY - 150]], 1.6, '#FFFFFF', 'marker', 0);
    // the rival herself, admiring
    const m = move('idle', t), md = mood(t, [[113.35, 'look'], [b1, 'happy', 'heart'], [b2, 'scared', 'sweat']]);
    rival(700, 925, 40, { ...m, ...md, lookX: 1, lookY: -.3, mouth: t > b2 ? 'O' : 'smile', aR: t > b2 ? 1.5 : 1.2 + .15 * Math.sin(t * 12), aL: t > b2 ? 1.5 : .3, draw: lopBuns(slip), blush: t < b2 });
    if (t > b2 + .1) { const a = t - b2 - .1; disc(700 + 40 * 5.5 + a * 120, 925 - 40 * 4 + a * a * 1600 - a * 300, 40 * .95, '#D8B85A'); }   // the bun bounces away
    camEnd();
  }

  // =====================================================================================================
  // 4 · THE LANE (114.45–115.45): two lanes; hers glitters in sunshine, the rival's is rain and potholes.
  // =====================================================================================================
  function lanes(t, lt) {
    const VX = 960, VY = 420, yz = z => VY + 700 * z, hw = z => 50 + 1000 * z;
    const [sx, sy] = shakeXY(t, 2.5);
    camBegin(960 + sx, 560 + sy, lerp(1.0, 1.08, ease(lt / 1)), -.04 + .02 * Math.sin(t * 2));
    sky({ hz: VY, col: '#5B4E78' });
    glow(1500, 200, 500, 300, MG.goldLt, 110);                                    // sun break over her lane
    cloudBank(t, 20, 5, 21, CLOUD, 30);
    const road = (x0f, x1f, o) => paint([[VX + hw(0) * x0f, yz(0)], [VX + hw(0) * x1f, yz(0)], [VX + hw(1.5) * x1f, yz(1.5)], [VX + hw(1.5) * x0f, yz(1.5)]], o);
    paint(rectPts(-400, VY, 2800, 1000), { wash: '#342A4C', ink: null });
    road(-1, 0, { wash: '#6B6480', fill: '#4A4460', fillOp: 90, tex: .6, ink: PAL.ink, sw: 1 });
    road(0, 1, { wash: MG.pink, fill: MG.gold, fillOp: 90, bleed: .15, tex: .5, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 7; i++) {                                                // dashes rushing at camera
      const z = frac(i / 7 + t * 1.3), z2 = z + .05 + z * .08;
      paint([[VX + hw(z) * .47, yz(z)], [VX + hw(z) * .53, yz(z)], [VX + hw(z2) * .53, yz(z2)], [VX + hw(z2) * .47, yz(z2)]], { wash: MG.goldLt, ink: null });
      const zl = frac(i / 7 + t * .35), zl2 = zl + .04 + zl * .06;
      paint([[VX - hw(zl) * .53, yz(zl)], [VX - hw(zl) * .47, yz(zl)], [VX - hw(zl2) * .47, yz(zl2)], [VX - hw(zl2) * .53, yz(zl2)]], { wash: '#9C96AE', ink: null });
    }
    for (let i = 0; i < 10; i++) { const z = frac(i / 10 + t * 1.1 + hash(i) * .1); spk(VX + hw(z) * (.1 + hash(i + 3) * .8), yz(z) - 10, 10 + 30 * z, frac(t * 2.5 + hash(i)), i % 2 ? MG.cream : MG.goldLt); }
    for (let i = 0; i < 4; i++) { const z = frac(i / 4 + t * .35); paint(ellPts(VX - hw(z) * (.3 + hash(i) * .4), yz(z), 40 * z + 6, 10 * z + 2, 12), { fill: '#2A2440', fillOp: 150, ink: null }); }   // potholes
    inkLine([[VX, yz(0)], [VX, yz(1.5)]], 2, MG.cream, 'ink', 0);
    rain(t, { area: [-300, -200, VX + 250, 1400], n: 55, seed: 12 });            // it only rains on the copycat
    cloud(420, 130, 220, CLOUDD, 190);
    // the rival lagging behind, drenched, pedalling a tiny scooter
    const zr = lerp(.36, .26, lt), rx = VX - hw(zr) * .5, ry = yz(zr);
    rival(rx, ry, 30 * zr + 4, { ...move('run', t), eyes: 'scared', mouth: 'wobble', emote: 'sweat', emoteK: 1, draw: lopBuns(1) });
    // her, gliding on the glitter lane, trailing speed lines
    const m = move('hop', t), zx = VX + hw(.72) * .5, zy = yz(.72);
    for (let i = 0; i < 6; i++) inkLine([[zx - 220 + i * 80, zy - 520 - hash(i) * 60], [zx - 260 + i * 95, zy - 420 - hash(i + 1) * 80]], .8, MG.cream, 'inkfine', 0);
    hero(zx, zy, 40, { ...m, eyes: 'wink', mouth: 'cat', blush: true, aR: 1.2, aL: .9 });
    camEnd();
  }

  // =====================================================================================================
  // 5 · RAIN CALL (115.45–117.0): wand up, clouds gather, rain falls only around her. A rival photocopies her.
  // =====================================================================================================
  const HX5 = 780, CPX = 1500;
  function stormStage(t, rk, o = {}) {
    sky({ hz: 800, col: '#62587E', fillC: '#3E355C' });
    cloudBank(t, -20, 5, 31, '#7A6F96', 15);
    street(t, 820);
    // gathering storm cloud right above her + rain column
    const ck = rk;
    for (let i = 0; i < 5; i++) {
      const tx = HX5 - 300 + i * 150, fx = tx + (i < 2 ? -1 : 1) * 900 * (1 - ck);
      cloud(fx, 110 + (i % 2) * 50 + Math.sin(t * 2 + i) * 8, 170, i % 2 ? CLOUDD : '#2E2548', 90 + 110 * ck);
    }
    if (o.big) cloud(CPX, 90, 280, '#241C38', 220);
    if (rk > .55) {
      const k = seg(rk, .55, 1);
      paint([[HX5 - 230, 170], [HX5 + 230, 170], [HX5 + 300, 910], [HX5 - 300, 910]], { fill: '#AFC0F0', fillOp: 90 * k, bleed: .2, tex: .3, ink: null });
      rain(t, { area: [HX5 - 230, 170, 520, 760], n: Math.round(75 * k), seed: 5, speed: 1700, len: 60, sw: .9, col: "#E8EEFF" });
      splashes(t, HX5 - 280, HX5 + 280, 905, 10, 3);
    }
  }
  function rainCall(t, lt) {
    const up = B(231), rk = easeOut(seg(t, up, up + .6));
    camBegin(lerp(930, 1100, ease(lt / 1.55)), lerp(560, 520, ease(lt / 1.55)), lerp(1.0, .9, ease(lt / 1.55)), .02 * wob(t, .35));
    stormStage(t, rk);
    // the copycat at the photocopier, trying to copy her
    const press = frac(bpOf(t)) < .3;
    copier(CPX, 900, 110, t, { scan: frac(t * 1.5), out: frac(t * .8) });
    rival(CPX + 330, 905, 26, { ...move('idle', t), flip: true, eyes: 'look', lookX: -1, mouth: 'flat', aR: press ? .1 : .6, draw: lopBuns(.3) });
    // her
    const aR = kf(t, [[up - .15, .2], [up - .05, -.3], [up + .2, 1.05]], backOut), md = mood(t, [[115.45, 'narrow'], [up, 'closed'], [B(233), 'wink', 'spark']]);
    hero(HX5, 905, 40, { ...move('idle', t), ...md, mouth: 'cat', aR, aL: -.5, sq: kf(t, [[up - .15, 0], [up - .05, .12], [up + .1, -.1], [up + .3, 0]]) });
    if (t > up) { const tipX = HX5 + 40 * 7.6, tipY = 905 - 40 * 11.3; spk(tipX, tipY, 50, seg(t, up, up + .5), MG.goldLt); glow(tipX, tipY, 70, 70, MG.goldLt, 120 * pulse(t, 4)); }
    camEnd();
  }

  // =====================================================================================================
  // 6 · THUNDER (117.0–117.95): lightning strikes the photocopier, flash, it jams and smokes; the rival gets sooty.
  // =====================================================================================================
  function thunder(t, lt) {
    const [sx, sy] = shakeXY(t, 18 * Math.exp(-lt * 5));
    camBegin(1100 + sx, 520 + sy, lerp(.96, .9, easeOut(lt / .9)), .03 * Math.exp(-lt * 4) * Math.sin(lt * 30));
    stormStage(t, 1, { big: true });
    if (lt < .32 && frac(lt * 14) < .75) bolt(CPX + 40, -200, CPX, 700, 3 + Math.floor(lt * 14), 42);
    copier(CPX, 900, 110, t, { jam: easeOut(seg(lt, .05, .4)) });
    const soot = { col: '#5A5070', dk: '#3A3050', lt: '#7A7090' };
    rival(CPX + 330, 905, 26, { ...soot, flip: true, eyes: 'x', mouth: 'O', aL: 1.4, aR: 1.4, dy: -2 * Math.sin(Math.PI * seg(lt, 0, .35)), draw: (u, sw) => {
      lopBuns(1)(u, sw);
      for (let i = 0; i < 7; i++) { const a = -Math.PI * (.15 + i * .12); inkLine([[Math.cos(a) * 4 * u, -6 * u + Math.sin(a) * 4 * u], [Math.cos(a) * 6.5 * u, -6 * u + Math.sin(a) * 6.5 * u]], sw * .8, PAL.ink, 'ink', 0); }
    } });
    hero(HX5, 905, 40, { ...move('bounce', t), eyes: 'wink', mouth: 'cat', blush: true, aR: 1.05, aL: -.5 });
    camEnd();
    flash(.9 * (1 - easeOut(lt / .28)), '#F4ECFF');
  }

  // =====================================================================================================
  // 7–9 · SPOTLIGHT (117.95–125.88): dark whisper → frozen rain → 1, 2, 3, DROP.
  // =====================================================================================================
  const SX = 960, SY = 905, CONE = y => 70 + (y + 60) / 970 * 300;
  const LIPS = [[200, 830, 30, 0], [430, 865, 26, 3], [650, 825, 22, 5], [1290, 855, 22, 7], [1510, 825, 28, 9], [1740, 865, 26, 11]];
  const DROPS = Array.from({ length: 46 }, (_, i) => i);
  // drop i at time tt (unfrozen) → [x, y] inside the light cone
  function dropAt(i, tt) {
    const ph = frac(hash(i * 2.3) + tt * (1.25 + .4 * hash(i + 5))), y = -60 + ph * 980, x = SX + (hash(i * 4.1 + 1) - .5) * 2 * CONE(y) * .92;
    return [x, y];
  }
  function spotScene(t, o) {
    paint(FULL(), { wash: DARK, fill: '#2D2448', fillOp: 90, bleed: .1, tex: .6, ink: null });
    rain(o.freeze ?? t, { n: 40, col: '#4A4070', seed: 40, sw: .35 });          // faint rain out in the dark
    paint(rectPts(-2000, 930, 6000, 1000), { wash: '#16111F', ink: null });
    paint([[SX - 70, -60], [SX + 70, -60], [SX + 370, 930], [SX - 370, 930]], { fill: '#E8E0FF', fillOp: 50 + (o.lit || 0) * 60, bleed: .18, tex: .3, border: .2, ink: null });
    glow(SX, 930, 400, 60, MG.cream, 110);
    // the cat in the dark, only its eyes
    const bl = frac(t * .4 + .3) < .05;
    for (const e of [-1, 1]) if (!bl) { paint(ellPts(1640 + e * 22, 760, 11, 13, 10), { wash: MG.goldLt, ink: null }); disc(1640 + e * 22, 760, 3, PAL.ink, 255, 6); }
    // tiny whispering lips along the bottom
    LIPS.forEach(([x, y, s, sd], i) => {
      const lt2 = o.freeze ?? t, lean = o.lean || 0;
      glow(x + (x < SX ? 1 : -1) * lean * 80, y - lean * 10, s * 2.6, s * 1.4, "#8E5A9E", 110);
      lips(x + (x < SX ? 1 : -1) * lean * 80, y - lean * 10, s, lt2, { talk: .9, seed: sd, col: "#D0628F", flip: x > SX });
      if (!o.freeze && !o.hideBubbles) dotBubble(x + (x < SX ? 1 : -1) * s * 1.6, y - s * 2, s * .55, frac(t * .5 + hash(i)) < .6 ? 1 : 0);
    });
  }
  function raindrops(t, o) {
    for (const i of DROPS) {
      let [x, y] = dropAt(i, o.freeze ?? t);
      if (o.blast > 0) { const dx = x - SX, dy = y - SY + 200, d = Math.hypot(dx, dy) || 1; x += dx / d * o.blast * 1800; y += dy / d * o.blast * 1800; }
      if (o.freeze != null) {
        paint(ellPts(x, y, 8, 11, 8), { wash: '#DDE6FF', washOp: 230, ink: PAL.ink, sw: .35 });
        inkLine([[x + 6, y - 22], [x + 1, y - 8]], .3, '#8C9CD0', 'inkfine', 0);
        const gl = frac(t * .8 + hash(i + 70)); if (gl < .15) spk(x, y, 16, gl / .15, MG.cream);
      } else inkLine([[x, y], [x - 6, y + 44]], .55, RAINC, 'inkfine', 0);
    }
    if (o.freeze == null) splashes(t, SX - 300, SX + 300, SY, 9, 20);
  }
  function whisper(t, lt, dur) {
    const k = ease(lt / dur);
    camBegin(SX + 30 * Math.sin(t * .6), lerp(540, 560, k), lerp(1.0, 1.16, k), .02 * wob(t, .15));
    spotScene(t, { lean: .6 * k });
    raindrops(t, {});
    hero(SX, SY, 46, { ...move('idle', t), dy: -.15 - .15 * Math.sin(t * 1.6), eyes: 'closed', mouth: 'smile', aR: .1, aL: .1 });
    camEnd();
  }
  const FZ = 122.0;
  function frozen(t, lt, dur) {
    const k = ease(lt / dur);
    camBegin(SX + 30 * Math.sin(FZ * .6) + 20 * k, 560 - 20 * k, lerp(1.16, 1.24, k), .02 * wob(FZ, .15) - .015 * k);
    spotScene(t, { freeze: FZ, lean: .6 });
    raindrops(t, { freeze: FZ });
    const md = mood(t, [[FZ, 'closed'], [123.3, 'narrow', 'spark']]);
    hero(SX, SY, 46, { dy: -.3, ...md, mouth: 'smile', aR: .1, aL: .1 });
    camEnd();
  }
  const NUM = [[123.84, "1", 520, 250, MG.pink], [124.50, "2", 960, 190, MG.sky], [124.96, "3", 1400, 250, MG.gold]], DROPT = 125.5;
  function countdown(t, lt) {
    const a = t - DROPT, blast = a > 0 ? easeOut(a / .35) : 0;
    const [sx, sy] = shakeXY(t, a > 0 ? 26 * Math.exp(-a * 5) : 3 * pulse(t, 8));
    const zoom = a > 0 ? 1.0 + .08 * Math.exp(-a * 6) : kf(t, [[123.84, 1.08], [124.5, 1.0], [124.96, .94], [125.3, .92], [DROPT, 1.02]], easeOut);
    camBegin(SX + sx, 540 + sy, zoom, a > 0 ? 0 : .04 * Math.sin(t * 3));
    spotScene(t, { freeze: a > 0 ? null : FZ, lean: .6 * (1 - blast), lit: a > 0 ? 1 : .3, hideBubbles: true });
    raindrops(t, { freeze: FZ, blast });
    // numbers, each with a ring of frozen drops orbiting it
    NUM.forEach(([tn, s, x, y, col], i) => {
      const age = t - tn; if (age < 0) return;
      const fx = x + (x - SX) * blast * 3, fy = y - blast * 700;
      if (blast < .9) {
        for (let j = 0; j < 10; j++) { const an = j / 10 * TAU + t * 1.5 * (i % 2 ? -1 : 1), r = 230 * easeOut(age / .3) * (1 + blast * 2); paint(ellPts(fx + Math.cos(an) * r, fy + Math.sin(an) * r * .8, 7, 9, 8), { wash: '#DDE6FF', ink: PAL.ink, sw: .35 }); }
        spk(fx, fy, 180, seg(age, 0, .35), col);
        letter(s, fx, fy, 400, col, { pop: age * 4, rot: (i - 1) * .12, stroke: MG.navy, alpha: 1 - blast });
      }
    });
    // her: bob on each count, wind up, jump, SLAM
    const cnt = NUM.reduce((c, [tn]) => c + (t >= tn), 0), cp = NUM.reduce((m, [tn]) => t >= tn ? Math.exp(-(t - tn) * 9) : m, 0);
    let dy = -.3, sq = cp * .15, aR = [.1, .4, .7, 1][cnt], aL = [.1, .3, .6, 1][cnt], eyes = 'narrow', mouth = 'smile';
    if (t > 125.15 && a <= 0) { const w = ease(seg(t, 125.15, 125.42)); dy = -2.4 * w; sq = -.15 * w; aR = 1.1; aL = 1.4; eyes = 'spark'; mouth = 'grin'; }
    if (t > 125.42 && a <= 0) { dy = lerp(-2.4, 0, easeIn(seg(t, 125.42, DROPT))); }
    if (a > 0) { dy = 0; sq = .3 * Math.exp(-a * 7); aR = -.7; aL = 1.3; eyes = 'spark'; mouth = 'grin'; }
    // shockwave
    if (a > 0) {
      const r = 60 + a * 3400;
      paint(ellPts(SX, SY, r, r * .22, 30), { fill: MG.hot, fillOp: 120 * (1 - seg(a, 0, .38)), bleed: .2, ink: null });
      inkLine(ellPts(SX, SY, r * .9, r * .2, 30).concat([ellPts(SX, SY, r * .9, r * .2, 30)[0]]), 2.2, MG.cream, 'ink', .5);
      for (let i = 0; i < 14; i++) { const an = i / 14 * TAU, r0 = 200 + a * 1600; inkLine([[SX + Math.cos(an) * r0, SY - 250 + Math.sin(an) * r0], [SX + Math.cos(an) * (r0 + 420), SY - 250 + Math.sin(an) * (r0 + 420)]], 1.6, i % 2 ? MG.goldLt : MG.cream, 'ink', 0); }
    }
    hero(SX, SY, 46, { dy, sq, aR, aL, eyes, mouth, blush: true });
    if (a > 0) sfx('DROP!', SX, 230, 280, MG.hot, a, { life: .5, stroke: MG.navy, rot: -.1 });
    camEnd();
    flushLetters();                                                              // the flash must cover the lettering
    if (a > 0) flash(Math.max(.55 * Math.exp(-a * 25), easeIn(seg(t, 125.6, 125.85))), mixCol(MG.pink, '#FFF6FA', seg(t, 125.66, 125.86)));
  }

  chapter('bridge', 109.4, 125.88, [
    [109.4, smirk], [111.35, rumorMill], [113.35, copycat], [114.45, lanes],
    [115.45, rainCall], [117.0, thunder], [117.95, whisper], [122.0, frozen], [123.84, countdown]
  ]);
})();
