// t01_friday.js: «Жги токены» chapter 1, intro + verse 1 (0–32.35).
// Intro: a match scrapes in the dark, strikes on the hit (2.375), Clawd carries it to a single token, the token
// ignites (4.1), «ЖГИ ТОКЕНЫ» slams (4.725), a vigil row of tokens lights up pair by pair, the camera dives into
// the flame. Verse 1: Friday evening room (calendar flips to ПЯТНИЦА, to-dos ticked) → laptop screen: limit 50%,
// halfway flag → the window becomes a sunny park, the calendar flips to ВОСКРЕСЕНЬЕ → the page burns →
// Clawd waves off a website and a bot, the limit bar hauls it back → the bar becomes a rocket to the moon →
// an empty arcade «0 ИГРОКОВ» → a website «0 ПОСЕТИТЕЛЕЙ» with a tumbleweed, pan to a hot server rack (cut to the data center).
(() => {
  const B = n => OFF + n * BEAT;
  const INK = PAL.ink;
  const WALL = '#E8C49A', WALLDK = '#C98E62';

  // ---------- helpers ----------
  // darkness everywhere outside a soft ellipse around (cx, cy), screen space; one keyhole polygon per layer
  function vignette(cx, cy, r, op = 90, col = TK.soot, layers = 3) {
    for (let l = 0; l < layers; l++) {
      const rr = r * (1 + l * .35), pts = [[-100, cy], [-100, -100], [W + 100, -100], [W + 100, H + 100], [-100, H + 100], [-100, cy]];
      for (let i = 0; i <= 28; i++) { const a = Math.PI - i / 28 * TAU; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .8]); }
      paint(pts, { wash: col, washOp: op, ink: null });
    }
  }
  const sootBg = (warm = 0) => paint(rectPts(-100, -100, W + 200, H + 200), { wash: TK.soot, fill: mixCol(TK.sootLt, TK.emberDk, warm), fillOp: 90, bleed: .1, tex: .6, border: .3, ink: null });
  function embers(t, x0, x1, y0, n, seed = 0, rise = 700) {
    for (let i = 0; i < n; i++) {
      const p = frac(t * (.25 + hash(i + seed) * .3) + hash(i * 3 + seed)), x = lerp(x0, x1, hash(i * 7 + seed)) + Math.sin(t * 2 + i) * 30 * p;
      const y = y0 - p * rise, r = 3 + hash(i + 11 + seed) * 5 * (1 - p);
      paint(ellPts(x, y, r, r, 6), { wash: p < .5 ? TK.yellow : TK.orange, washOp: 255 * (1 - p), ink: null });
    }
  }
  // a match: stick from hand (hx, hy) to head (x, y); lit adds a flame standing on the head
  function match(hx, hy, x, y, t, lit, sc = 1) {
    const a = Math.atan2(y - hy, x - hx), nx = -Math.sin(a) * 7 * sc, ny = Math.cos(a) * 7 * sc;
    paint([[hx + nx, hy + ny], [x + nx, y + ny], [x - nx, y - ny], [hx - nx, hy - ny]], { wash: '#E8C07A', fill: '#B98A44', fillOp: 80, tex: .5, ink: INK, sw: .6 * sc });
    paint(ellPts(x, y, 15 * sc, 12 * sc, 12, 0, a), { wash: lit ? '#3A2222' : TK.ember, ink: INK, sw: .6 * sc });
    if (lit) {
      glowAt(x, y - 30 * sc, 150 * sc * lit, TK.yellow, 110 * lit);
      fire(x, y + 8 * sc, 46 * sc, 120 * sc, t, { k: lit, seed: 3, n: 3, glow: false });
    }
  }
  // tear-off wall calendar; pages = [prev, next] as [day, num]; p = flip progress of the top page (0 = prev showing)
  const DAYS = { th: ['ЧЕТВЕРГ', 24], fr: ['ПЯТНИЦА', 25], sa: ['СУББОТА', 26], su: ['ВОСКРЕСЕНЬЕ', 27] };
  function calPage(x, y, w, h, d, o = {}) {
    paint(rectPts(x, y, w, h, 1), { wash: TK.cream, fill: '#E9DCC4', fillOp: 70, tex: .4, ink: INK, sw: w / 500 });
    if (o.noText) return;
    const [day, num] = d, ns = h * .5, ds = Math.min(h * .12, (w * .86) / Math.max(1, textW(day, ruFont(100)) / 100));
    letter(String(num), x + w / 2, y + h * .42, ns, d === DAYS.su ? TK.ember : '#2B2233', { font: ruFont(ns), ink: false });
    letter(day, x + w / 2, y + h * .8, ds, d === DAYS.su ? TK.ember : '#2B2233', { font: ruFont(ds), ink: false });
  }
  function calendar(x, y, w, h, cur, next, p = 0, o = {}) {
    const hh = h * .2, py = y + hh, ph = h - hh;
    paint(rectPts(x + 12, y + 16, w, h), { fill: INK, fillOp: 70, bleed: .2, ink: null });
    if (p > 0 && next) { calPage(x, py, w, ph, next); flushLetters(); } else calPage(x, py, w, ph, cur, o);
    if (p > 0 && p < 1) {
      const s = Math.cos(p * Math.PI);
      if (s > 0) { paint(rectPts(x, py, w, ph * s), { wash: TK.cream, ink: INK, sw: w / 500 }); if (s > .55) letter(cur[0], x + w / 2, py + ph * s * .75, Math.min(ph * .12, w * .8 / Math.max(1, textW(cur[0], ruFont(100)) / 100)) * s, '#2B2233', { font: ruFont(Math.min(ph * .12, w * .8 / Math.max(1, textW(cur[0], ruFont(100)) / 100)) * s), ink: false }); }
      else paint(rectPts(x - w * .03, py - ph * -s * .7, w * 1.06, ph * -s * .7), { wash: '#D9CDB6', fill: '#BFAF94', fillOp: 70, tex: .4, ink: INK, sw: w / 500 });
    }
    paint(rectPts(x - 6, y, w + 12, hh, 1), { wash: TK.ember, fill: TK.emberDk, fillOp: 70, tex: .5, ink: INK, sw: w / 450 });
    letter('СЕНТЯБРЬ', x + w / 2, y + hh * .55, hh * .42, TK.cream, { font: ruFont(hh * .42), ink: false });
    for (let i = 0; i < 5; i++) paint(ellPts(x + w * (.18 + i * .16), y + 4, w * .018, w * .03, 8), { wash: TK.steel, ink: INK, sw: .5 });
  }
  function windowView(x, y, w, h, t, park = 0) {
    paint(rectPts(x, y, w, h), { wash: '#F0A460', fill: '#D8663E', fillOp: 90, bleed: .15, tex: .5, ink: null });           // dusk
    paint(ellPts(x + w * .62, y + h * .72, w * .14, w * .14, 20), { wash: '#FFD27A', ink: null });
    paint([[x, y + h * .8], [x + w * .3, y + h * .74], [x + w * .7, y + h * .78], [x + w, y + h * .72], [x + w, y + h], [x, y + h]], { wash: '#6E4A52', ink: null });
    for (let i = 0; i < 6; i++) {                                                       // dusk skyline with lit windows
      const bx = x + w * (.02 + i * .165), bh = h * (.22 + hash(i + 3) * .25), bw = w * .13;
      paint(rectPts(bx, y + h * .8 - bh, bw, bh + 4), { wash: '#5A3E4A', ink: null });
      for (let k = 0; k < 4; k++) if (hash(i * 5 + k) > .45) paint(rectPts(bx + bw * (.2 + (k % 2) * .4), y + h * .8 - bh * (.8 - Math.floor(k / 2) * .3), bw * .2, h * .03), { wash: TK.yellowLt, ink: null });
    }
    if (park > .01) {
      const op = 255 * park;
      paint(rectPts(x, y, w, h), { wash: '#9FD6F2', washOp: op, ink: null });
      paint(ellPts(x + w * .78, y + h * .2, w * .09, w * .09, 18), { wash: TK.yellowLt, washOp: op, ink: null });
      paint([[x, y + h * .68], [x + w * .4, y + h * .6], [x + w, y + h * .66], [x + w, y + h], [x, y + h]], { wash: '#8CC66E', washOp: op, ink: null });
      for (let i = 0; i < 3; i++) {
        const tx = x + w * (.14 + i * .36), ty = y + h * .62;
        paint(rectPts(tx - 6, ty, 12, h * .14), { wash: '#7A5234', washOp: op, ink: null });
        paint(ellPts(tx, ty - h * .04, w * .1, h * .12, 16), { wash: '#4E9A58', washOp: op, ink: null });
      }
      const bx = x + w * .5, by = y + h * .86;                                        // bench
      paint(rectPts(bx - w * .14, by - h * .08, w * .28, h * .03), { wash: '#A0643A', washOp: op, ink: null });
      paint(rectPts(bx - w * .14, by - h * .035, w * .28, h * .03), { wash: '#A0643A', washOp: op, ink: null });
      for (const e of [-1, 1]) paint(rectPts(bx + e * w * .11 - 3, by, 6, h * .05), { wash: '#5A3A22', washOp: op, ink: null });
      const kx = x + w * .3 + Math.sin(t * 1.7) * w * .05, ky = y + h * .24 + Math.sin(t * 2.3) * h * .03, ks = w * .06;   // kite
      paint([[kx, ky - ks], [kx + ks * .7, ky], [kx, ky + ks * 1.2], [kx - ks * .7, ky]], { wash: TK.ember, washOp: op, ink: park > .5 ? INK : null, sw: .5 });
      const tail = []; for (let i = 0; i <= 6; i++) tail.push([kx + i * w * .025 + Math.sin(t * 5 + i) * 6, ky + ks * 1.2 + i * h * .045]);
      if (park > .5) inkLine(tail, .6, INK, 'inkfine', .5);
      if (park > .5) inkLine([[kx, ky + ks * 1.2], [x + w * .56, y + h * .82]], .35, INK, 'inkfine', .3);
    }
    paint(rectPts(x, y, w, h), { ink: TK.cream, sw: 3.2 });
    inkLine([[x + w / 2, y], [x + w / 2, y + h]], 3, TK.cream, 'ink', 0);
    inkLine([[x, y + h * .45], [x + w, y + h * .45]], 3, TK.cream, 'ink', 0);
    paint(rectPts(x - 18, y - 18, w + 36, h + 36), { ink: INK, sw: 1.2 });
    paint(rectPts(x - 30, y + h + 10, w + 60, 26), { wash: TK.cream, ink: INK, sw: .9 });
  }
  function wall(t, o = {}) {
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: WALL, fill: WALLDK, fillOp: 70, bleed: .1, tex: .6, border: .3, ink: null });
    for (let i = 0; i < 9; i++) inkLine([[i * 240 + 40, -20], [i * 240 + 40, H + 20]], .35, WALLDK, 'inkfine', 0);   // wallpaper stripes
    glowAt(380, 420, 520, TK.orange, 45);
  }
  function stickyNote(x, y, n, t) {
    paint(rectPts(x, y, 250, 250, 1.5), { wash: '#FFE27A', fill: '#F2C53D', fillOp: 60, tex: .5, ink: INK, sw: .7 });
    letter('ДЕЛА:', x + 125, y + 38, 34, '#2B2233', { font: ruFont(34), ink: false });
    ['отчёт', 'созвон', 'почта'].forEach((s, i) => {
      letter(s, x + 30, y + 95 + i * 52, 30, '#2B2233', { font: ruFont(30), align: 'left', ink: false });
      if (n > i) {
        const k = clamp((n - i) * 3), cx = x + 200, cy = y + 95 + i * 52;
        inkLine([[cx - 18, cy], [cx - 18 + 12 * Math.min(1, k * 2), cy + 12 * Math.min(1, k * 2)], ...(k > .5 ? [[cx - 6 + 26 * (k - .5) * 2, cy + 12 - 32 * (k - .5) * 2]] : [])], 2.2, TK.green, 'marker', 0);
      }
    });
  }
  // laptop in side profile on the desk, screen facing left
  function laptopSide(x, y, t, k = 1.3) {
    push(); translate(x, y); scale(k); translate(-x, -y);
    paint([[x, y], [x + 260, y], [x + 262, y - 14], [x + 2, y - 14]], { wash: TK.steelLt, ink: INK, sw: .8 });
    paint([[x + 250, y - 12], [x + 320, y - 230], [x + 336, y - 226], [x + 266, y - 8]], { wash: TK.steel, ink: INK, sw: .8 });
    glowAt(x + 180, y - 120, 190, '#9FC4FF', 55);
    token(x + 318, y - 118, 13, { ink: false });
    pop();
  }
  function desk(y) {
    paint(rectPts(-60, y, W + 120, H - y + 80), { wash: '#8A5A3C', fill: '#5E3A24', fillOp: 90, tex: .6, ink: INK, sw: 1 });
    inkLine([[-40, y + 22], [W + 40, y + 22]], .6, '#5E3A24', 'inkfine', 0);
  }

  // ---------- 0: the match scrapes in the dark ----------
  const TS = 2.375, TIGN = 4.1, TTITLE = 4.725;
  function strike(t, lt) {
    sootBg();
    const age = t - TS, lit = age >= 0;
    camBegin(980 + lt * 12, 560, 1.3 + lt * .04, -.03);
    // matchbox, 3/4 view: red top with a label, brown striker side
    paint([[470, 400], [1260, 400], [1380, 500], [590, 500]], { wash: '#C8392E', fill: TK.emberDk, fillOp: 80, tex: .5, ink: INK, sw: 1.2 });
    paint(ellPts(925, 450, 250, 38, 22), { wash: TK.cream, ink: INK, sw: .7 });
    letter('СПИЧКИ', 925, 452, 44, TK.ember, { font: ruFont(44), ink: false, rot: 0 });
    paint([[470, 400], [590, 500], [590, 650], [470, 550]], { wash: '#8A1E1A', ink: INK, sw: 1 });
    paint([[590, 500], [1380, 500], [1380, 650], [590, 650]], { wash: '#5A3222', fill: '#3A1E14', fillOp: 120, bleed: .05, tex: .9, border: .8, ink: INK, sw: 1.2 });
    for (let i = 0; i < 40; i++) paint(ellPts(610 + hash(i) * 750, 515 + hash(i + 9) * 120, 3, 3, 5), { wash: '#2A140C', ink: null });
    // scrape on beats 0, 1, 2; the strike at TS
    let hx, hy, sp = 0;
    if (!lit) {
      const bp = bpOf(t), f = bp < 0 ? 1 : frac(bp);
      hx = f < .25 ? lerp(1300, 700, easeOut(f / .25)) : lerp(700, 1300, ease((f - .25) / .75)); hy = 590;
      if (bp < 0) hx = lerp(1700, 1300, ease(t / OFF));
      sp = f < .25 ? 1 - f / .25 : 0;
      if (bp >= 0 && f < .35) sfx('чирк', hx + 60, 720 + 40 * f, 54, TK.ash, f * BEAT, { font: ruFont(54), life: .3, ink: false });
    } else {
      const k = easeOut(age / .25);
      hx = lerp(700, 980, k); hy = lerp(590, 300, k);
    }
    for (let i = 0; i < 7 && (sp > .05 || (lit && age < .3)); i++) {                  // sparks
      const q = lit ? age / .3 : 1 - sp, a = -Math.PI * (.2 + hash(i + beatN(t)) * .6), d = 40 + q * 160 * (.5 + hash(i + 4));
      paint(ellPts(hx + Math.cos(a) * d, hy + Math.sin(a) * d, 5, 5, 6), { wash: i % 2 ? TK.yellow : TK.orange, ink: null });
    }
    const handX = hx + 560, handY = hy + 260;
    match(handX, handY, hx, hy, t, lit ? clamp(age / .12) : 0, 1.6);
    // Clawd's claw holding the stick: a clay arm block from the lower right
    const a = Math.atan2(hy - handY, hx - handX);
    paint(rotPts(rectPts(handX - 40, handY - 60, 700, 120, 3), handX, handY, a + Math.PI), { wash: PAL.clay, fill: PAL.clayDk, fillOp: 70, tex: .5, ink: INK, sw: 1.4 });
    if (lit && age < .6) sfx('ФШШ!', hx + 170, hy - 120, 110, TK.yellow, age, { font: ruFont(110), life: .6, rot: -.12 });
    const [sx, sy] = toScreen(hx, hy);
    camEnd();
    vignette(sx, sy, lit ? 380 + 500 * easeOut(age / .4) : 300 + 60 * sp, lit ? 120 : 150);
    if (lit) flash(.5 * Math.exp(-age * 9), '#FFE7A8');
  }

  // ---------- 2.99: Clawd carries the flame to a single token; it ignites on the hit ----------
  function ignite(t, lt) {
    sootBg(.3);
    const ia = t - TIGN, on = ia >= 0;
    camBegin(900 + lt * 20, 600, 1.12 + lt * .05);
    paint(ellPts(780, 772, 190, 34, 22), { wash: TK.steel, fill: TK.steelDk, fillOp: 100, tex: .5, ink: INK, sw: .9 });   // dish
    paint(rectPts(700, 772, 160, 300), { wash: TK.steelDk, ink: INK, sw: .9 });                                            // plinth
    const a = kf(t, [[B(4), .95], [3.75, .32]], ease) - (on ? .15 * easeOut(ia / .3) : 0);
    const X = 1250, Y = 910, U = 30, L = 5 * U;
    const px = X - 4.9 * U, py = Y - 4.5 * U, tipx = px - 2.2 * U * Math.cos(a), tipy = py - 2.2 * U * Math.sin(a);
    const hx = tipx - L * Math.cos(a), hy = tipy - L * Math.sin(a);
    if (on) {
      const k = easeOut(ia / .35);
            fire(780, 740, 280, 460, t, { k: k * (1 + .12 * pulse(t, 5)), seed: 7 });
    }
    token(780, 660, 92, { burn: on ? .25 * clamp(ia * 2) : 0, glow: on ? .35 : .1 });
    clawd(X, Y, U, {
      eyes: 'look', lookX: -1, lookY: .4, mouth: on ? 'smile' : 'flat', aR: -.3, aL: a, noShadow: true,
      armL: (u, sw) => { paint(rectPts(0, -.18 * u, L, .36 * u), { wash: '#E8C07A', ink: INK, sw: sw * .5 }); paint(ellPts(L, 0, .45 * u, .38 * u, 10), { wash: '#3A2222', ink: INK, sw: sw * .4 }); }
    });
    if (!on || ia < .25) fire(hx, hy + 6, 46, 110, t, { seed: 3, n: 3, glow: false, k: on ? 1 - ia / .25 : 1 });
    glowAt(hx, hy - 30, 170, TK.yellow, on ? 40 : 110);
    if (on) for (let i = 0; i < 14; i++) {                                           // ignition burst
      const q = clamp(ia / .7), ang = hash(i * 3.3) * TAU, d = 60 + q * (260 + hash(i) * 200);
      if (q < 1) paint(ellPts(780 + Math.cos(ang) * d, 640 + Math.sin(ang) * d * .7 - q * 80, 6 * (1 - q) + 2, 6 * (1 - q) + 2, 6), { wash: i % 2 ? TK.yellow : TK.orange, ink: null });
    }
    const [sx, sy] = toScreen(on ? 780 : (hx + 780) / 2, on ? 620 : hy);
    camEnd();
    vignette(sx, sy, on ? 480 + 300 * easeOut(ia / .5) : 430, 110);
  }

  // ---------- 4.725: «ЖГИ ТОКЕНЫ» slams over the burning token ----------
  function rays(cx, cy, t, n, op, len = 1500) {
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU + t * .08, w = .05;
      paint([[cx, cy], [cx + Math.cos(a - w) * len, cy + Math.sin(a - w) * len], [cx + Math.cos(a + w) * len, cy + Math.sin(a + w) * len]], { wash: TK.yellow, washOp: op, ink: null });
    }
  }
  const title = t => stamp('ЖГИ ТОКЕНЫ', 960, 245, 170, t, TTITLE, { col: TK.orange, rot: -.05, punch: .05 });
  function titleShot(t, lt) {
    sootBg(.6);
    camBegin(960, 560, 1.04 + lt * .03);
    rays(960, 660, t, 14, 26 + 24 * pulse(t, 4));
    glowAt(960, 640, 700, TK.orange, 80);
    fire(960, 800, 640, 760, t, { k: 1 + .1 * pulse(t, 5), seed: 21, n: 7 });
    token(960, 720, 115, { burn: .3, glow: .6 });
    embers(t, 300, 1620, 1000, 34, 1, 900);
    camEnd();
    title(t);
    flash(.5 * Math.exp(-lt * 7), '#FFF1C8');
  }

  // ---------- 8.4: the vigil row lights pair by pair, then the camera dives into the flame ----------
  function vigil(t, lt) {
    sootBg(.4);
    const dive = seg(t, B(18), 12.6), z = 1 + easeIn(dive) * 1.8;
    camBegin(960, lerp(540, 652, ease(dive)), z);
    rays(960, 620, t, 14, 22 + 20 * pulse(t, 4));
    // back row: all at once on beat 18
    const back = t >= B(18);
    paint([[-200, 586], [W + 200, 586], [W + 200, 610], [-200, 610]], { wash: '#2E2426', ink: INK, sw: .5 });
    for (let i = 0; i < 11; i++) {
      const x = 90 + i * 174, y = 560;
      token(x, y, 26, { burn: back ? .45 * easeOut((t - B(18)) / .3) : 0, glow: back ? .4 : 0 });   // burn > .05 lights the kit's own flame
    }
    paint([[-200, 740], [W + 200, 740], [W + 200, 800], [-200, 800]], { wash: '#2E2426', fill: TK.emberDk, fillOp: 80, tex: .5, ink: INK, sw: .8 });
    for (let j = 0; j <= 4; j++) for (const s of (j ? [-1, 1] : [0])) {
      const x = 960 + s * j * 205, tl = j ? B(12 + j) : TIGN, on = t >= tl, k = easeOut((t - tl) / .3), r = j ? 64 : 88;
      if (on) fire(x, 750, r * 2.6 * (j ? 1 : 1 + dive * 2), r * (j ? 4.6 : 5.4), t, { seed: 60 + j * 5 + s, k: k * (1 + .1 * pulse(t, 5)) * (j ? 1 : 1 + easeIn(dive) * 2.2) });
      token(x, 740 - r, r, { glow: on ? .6 : .1 });   // no burn: the flame above is already drawn
    }
    embers(t, 100, 1820, 900, 30, 5, 800);
    title(t);
    camEnd();
    flash(.9 * ease(seg(t, 12.15, 12.6)), TK.orange);
  }

  // ---------- 12.6 «Пятница, дела позади»: the room, the calendar flips, the to-dos get ticked ----------
  function room(t, o = {}) {
    wall(t);
    windowView(140, 150, 500, 460, t, o.park || 0);
    stickyNote(1060, 140, o.checks ?? 3, t);
    calendar(1480, 150, 320, 400, o.cur || DAYS.fr, o.next, o.flip || 0);
  }
  function friday(t, lt) {
    camBegin(960 + lt * 10, 540, 1 + lt * .01);
    const n = seg(t, B(21), B(21) + .2) + seg(t, B(22), B(22) + .2) + seg(t, B(23), B(23) + .2);
    room(t, { cur: DAYS.th, next: DAYS.fr, flip: seg(t, 12.6, 12.95), checks: n });
    const stretch = seg(t, B(23) + .1, B(23) + .5);
    clawd(820, 870, 40, {
      noShadow: true, mouth: stretch > .5 ? 'smile' : 'flat', ...mood(t, [[12.6, 'narrow'], [B(23) + .1, 'happy']]),
      aL: lerp(-.3, 1.9, stretch) + (stretch > .9 ? .1 * Math.sin(t * 6) : 0), aR: lerp(-.1, 1.9, stretch), dy: -stretch * .4,
    });
    laptopSide(1060, 802, t);
    desk(800);
    camEnd();
    flash(.5 * Math.exp(-lt * 6), TK.orange);
  }

  // ---------- 15.0 «Лимиты целы, полпути»: the laptop screen ----------
  function screen(t, lt) {
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: TK.steelDk, fill: TK.steel, fillOp: 70, tex: .5, ink: null });
    camBegin(960, 520, 1 + lt * .035);
    paint(rrPts(140, 60, 1640, 900, 40), { wash: '#1E232A', ink: INK, sw: 1.4 });
    paint(rectPts(190, 110, 1540, 800), { wash: '#15181D', fill: '#232A36', fillOp: 90, tex: .4, ink: null });
    letter('Использование', 260, 190, 44, TK.ash, { font: ruFont(44), align: 'left', ink: false });
    letter('сброс: вс, 23:59', 1660, 190, 34, TK.ash, { font: ruFont(34), align: 'right', ink: false });
    const v = .5, bx = 300, bw = 1320, by = 360;
    limitBar(bx, by, bw, v, { glow: .4 + .5 * pulse(t, 4) });
    // week strip, Friday lit
    const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
    days.forEach((d, i) => {
      const x = bx + i * bw / 7, cur = i === 4, past = i < 4;
      paint(rrPts(x + 8, 600, bw / 7 - 16, 110, 16), { wash: cur ? TK.orange : past ? '#2E3440' : '#232A36', ink: cur ? TK.cream : TK.steelLt, sw: .8 });
      letter(d, x + bw / 14, 655, 46, cur ? TK.soot : past ? TK.ash : TK.cream, { font: ruFont(46), ink: false });
      if (past) inkLine([[x + 30, 690], [x + bw / 7 - 30, 620]], 1, TK.ash, 'inkfine', 0);
    });
    // the halfway flag planted at the fill edge
    const fk = backOut(seg(t, 16.25, 16.55)), fx = bx + (bw - bw * .085 * .3) * v + 14;
    if (fk > .02) {
      inkLine([[fx, by + 10], [fx, by - 220 * fk]], 2.4, TK.cream, 'ink', 0);
      paint([[fx, by - 220 * fk], [fx + 150 * fk, by - 190 * fk], [fx, by - 160 * fk]], { wash: TK.yellow, ink: INK, sw: .8 });
      letter('½', fx + 52 * fk, by - 190 * fk, 44 * fk, TK.soot, { font: ruFont(44 * fk), ink: false });
    }
    stamp('ПОЛПУТИ', 1300, 820, 80, t, 16.3, { col: TK.yellow, rot: -.07 });
    camEnd();
  }

  // ---------- 17.5 «Парк зовёт, но в воскресенье»: the window turns into a sunny park; calendar runs to Sunday ----------
  function park(t, lt) {
    const pk = ease(seg(t, 17.5, 18.1)), f1 = seg(t, 18.6, 18.9), f2 = seg(t, 19.2, 19.5);
    camBegin(lerp(700, 1000, ease(seg(t, 17.9, 18.55))), 470, 1.12);
    const cal = t < 19.2 ? { cur: DAYS.fr, next: DAYS.sa, flip: f1 } : { cur: DAYS.sa, next: DAYS.su, flip: f2 };
    room(t, { park: pk, ...cal });
    if (pk > .3) for (let k = 0; k < 4; k++) { const f = frac(t * .7 + k / 4); paint(starPts(200 + hash(k) * 380, 220 + hash(k + 3) * 300, 16 * Math.sin(f * Math.PI), .3), { wash: TK.cream, ink: null }); }
    const turn = t >= 18.55;
    clawd(820, 870, 40, {
      noShadow: true, eyes: 'look', lookX: turn ? 1 : -1, lookY: -.5, mouth: turn ? 'o' : 'smile',
      aL: turn ? .2 : .9 + .15 * Math.sin(t * 5), aR: -.1, ...(t > 19.25 ? { emote: '!', emoteK: seg(t, 19.25, 19.45) } : {}),
    });
    laptopSide(1060, 802, t);
    desk(800);
    camEnd();
  }

  // ---------- 19.8 «Всё сгорит — и нет прощенья!»: the Sunday page burns ----------
  function burn(t, lt) {
    const ig = 20.35, b = ease(seg(t, ig, 22.3)), pk = pulse(t, 5);
    const [shx, shy] = shakeXY(t, t > ig ? 4 + 5 * pk : 0);
    wall(t);
    camBegin(960 + shx, 470 + shy, 1 + lt * .03);
    const x = 560, y = 60, w = 800, h = 880, hh = h * .2, py = y + hh, ph = h - hh, yb = y + h - (ph + 30) * b;
    paint(rectPts(x + 16, y + 20, w, h), { fill: INK, fillOp: 70, bleed: .2, ink: null });
    if (yb > py + 4) {
      paint(rectPts(x, py, w, yb - py), { wash: TK.cream, fill: mixCol('#E9DCC4', TK.orange, b * .4), fillOp: 80, tex: .4, ink: INK, sw: 1.6 });
      if (yb > py + ph * .52) letter('27', x + w / 2, py + ph * .38, ph * .44, TK.ember, { font: ruFont(ph * .44), ink: false });
      if (yb > py + ph * .78) letter('ВОСКРЕСЕНЬЕ', x + w / 2, py + ph * .7, 84, TK.ember, { font: ruFont(84), ink: false });
      if (yb > py + ph * .92) letter('лимит сгорает в 23:59', x + w / 2, py + ph * .86, 44, '#2B2233', { font: ruFont(44), ink: false });
    }
    paint(rectPts(x - 8, y, w + 16, hh, 1), { wash: TK.ember, fill: TK.emberDk, fillOp: 70, tex: .5, ink: INK, sw: 1.6 });
    letter('СЕНТЯБРЬ', x + w / 2, y + hh * .55, hh * .42, TK.cream, { font: ruFont(hh * .42), ink: false });
    for (let i = 0; i < 5; i++) paint(ellPts(x + w * (.18 + i * .16), y + 6, 14, 22, 8), { wash: TK.steel, ink: INK, sw: .6 });
    flushLetters();                                                          // the flames go over the lettering
    if (t > ig) {
      const edge = []; for (let i = 0; i <= 16; i++) edge.push([x - 10 + i * (w + 20) / 16, yb + Math.sin(i * 1.9 + t * 3) * 14 + (i % 2) * 10]);
      paint([...edge, [x + w + 10, yb + 40], [x - 10, yb + 40]], { wash: TK.soot, fill: TK.emberDk, fillOp: 90, tex: .7, ink: null });
      inkLine(edge, 2, TK.orange, 'marker', .4);
      const fk = clamp((t - ig) / .4) * (b < .98 ? 1 : 1 - seg(t, 22.3, 22.5));
      fire(x + w / 2, yb + 20, w * 1.1, 360, t, { k: fk * (1 + .15 * pk), seed: 90, n: 8 });
      smoke(x + w / 2, yb - 200, t, { n: 6, r: 80, h: 500, seed: 3 });
      for (let i = 0; i < 12; i++) {                                         // falling ash
        const p = frac(t * .6 + hash(i)), ax = x + hash(i + 5) * w, ay = yb + 40 + p * 500;
        paint(ellPts(ax + Math.sin(t * 3 + i) * 20, ay, 7, 4, 6, 0, t + i), { wash: p < .3 ? TK.orange : TK.ash, washOp: 255 * (1 - p), ink: null });
      }
    }
    camEnd();
    flash(.35 * Math.exp(-(t - ig) * 7) * (t > ig), TK.yellow);
  }

  // ---------- 22.5 «Сайт не нужен, бот не нужен мне»: Clawd waves them off ----------
  function siteIcon(x, y, s, rot = 0) {
    push(); translate(x, y); rotate(rot); scale(s);
    paint(rrPts(-120, -85, 240, 170, 16), { wash: '#FBF8F2', ink: INK, sw: 1 });
    paint(rrPts(-120, -85, 240, 36, 12), { wash: TK.blue, ink: null });
    for (let i = 0; i < 3; i++) paint(ellPts(-100 + i * 18, -67, 5, 5, 8), { wash: TK.cream, ink: null });
    for (let i = 0; i < 3; i++) paint(rectPts(-90, 20 + i * 18, 180 - i * 40, 8), { wash: '#C9C4BC', ink: null });
    pop();
    letter('www', x + Math.sin(rot) * 10, y - 12 * s, 48 * s, TK.blue, { font: ruFont(48 * s), ink: false, rot });
  }
  function hover(t, s, x, y) { return [x + Math.sin(t * 1.3 + s) * 16, y + Math.sin(t * 2 + s) * 18]; }
  function wave(t, lt) {
    wall(t);
    const beam = t >= 24.6, bk = seg(t, 24.6, 25.1), lift = ease(seg(t, 24.9, 25.9));
    camBegin(960, 520, 1.02 + lt * .015);
    windowView(80, 190, 380, 360, t, 0);
    paint(rectPts(-100, 880, W + 200, 400), { wash: '#9A6A4A', fill: '#6E4630', fillOp: 90, tex: .6, ink: INK, sw: .8 });   // floor
    const pk = pulse(t, 4);
    limitBar(440, 150, 1040, .5, { glow: beam ? .8 + .4 * pk : .3 + .3 * pk });
    if (beam) {                                                                 // the bar's tractor beam
      const cy = 880 - lift * 360;
      paint([[840, 250], [1080, 250], [1200, cy], [720, cy]], { wash: TK.yellow, washOp: 130 * bk, ink: null });
      paint([[900, 250], [1020, 250], [1080, cy], [840, cy]], { wash: TK.yellowLt, washOp: 150 * bk, ink: null });
      for (let i = 0; i < 6; i++) { const p = frac(t * 1.5 + i / 6); token(lerp(800, 1120, hash(i)), lerp(cy - 60, 290, p), 14, { spin: t + i, ink: false }); }
    }
    // the two ideas float in; each is waved off with a flick and flies away
    const off1 = seg(t, 23.15, 23.8), off2 = seg(t, 24.1, 24.75);
    let [ax, ay] = hover(t, 0, 440, 600); ax -= easeIn(off1) * 900; ay -= easeIn(off1) * 300;
    if (off1 < 1) siteIcon(ax, ay, 1.5 - off1 * .5, -off1 * 3);
    let [bx, by] = hover(t, 2, 1480, 640); bx += easeIn(off2) * 900; by -= easeIn(off2) * 300;
    if (off2 < 1) { push(); translate(bx, by); rotate(off2 * 3); agentBot(0, 60, 22, t, { n: 1, noShadow: true, eyes: 'scared', mouth: 'o', aL: 1.2, aR: 1.2 }); pop(); }
    if (off1 > 0 && off1 < .5) sfx('НЕ НАДО', 420, 360, 60, TK.soot, off1 * .65, { font: ruFont(60), life: .5 });
    if (off2 > 0 && off2 < .5) sfx('НЕ НАДО', 1500, 440, 60, TK.soot, off2 * .65, { font: ruFont(60), life: .5 });
    const wL = t > 22.7 && t < 23.4 ? Math.sin((t - 22.7) * 18) : 0, wR = t > 23.7 && t < 24.4 ? Math.sin((t - 23.7) * 18) : 0;
    clawd(960, 900 - lift * 360, 34, {
      noShadow: lift > .05, rot: beam ? Math.sin(t * 7) * .06 * lift - .04 * bk : 0, sq: beam ? -.08 * lift : 0,
      eyes: beam ? 'spark' : 'narrow', mouth: beam ? 'O' : 'flat',
      aL: beam ? 1.9 : .3 + wL * .7 + (wL ? .8 : 0), aR: beam ? 1.9 : .3 + wR * .7 + (wR ? .8 : 0),
    });
    camEnd();
  }

  // ---------- 25.9 «вперёд, к луне!»: the bar is a rocket ----------
  function rocket(t, lt) {
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: '#1B1E3A', fill: '#2F3C7A', fillOp: 90, bleed: .1, tex: .5, ink: null });
    for (let i = 0; i < 40; i++) { const tw = .5 + .5 * Math.sin(t * 3 + i * 2.1); paint(starPts(hash(i) * W, hash(i + 50) * 800, 4 + 6 * tw * hash(i + 9), .35), { wash: TK.cream, washOp: 150 + 100 * tw, ink: null }); }
    const mx = 1560, my = 240;
    glowAt(mx, my, 260, TK.cream, 50);
    paint(ellPts(mx, my, 150, 150, 30), { wash: '#F4ECD2', fill: '#CFC3A2', fillOp: 90, tex: .6, ink: INK, sw: 1.2 });
    for (const [cx, cy, r] of [[-50, -30, 30], [40, 40, 22], [60, -60, 14], [-20, 70, 18]]) paint(ellPts(mx + cx, my + cy, r, r * .85, 12), { wash: '#BDB08E', ink: INK, sw: .4 });
    inkLine([[mx - 60, my + 50], [mx - 10, my + 68], [mx + 40, my + 50]], 1.2, INK, 'ink', .5);                             // the moon smiles, deadpan
    // flight: lower left → toward the moon; the bar tilts up and its fill becomes the exhaust
    const p = ease(seg(t, 25.9, 27.3)), sx = lerp(420, 1180, p), sy = lerp(900, 420, p), rot = -.45;
    const ww = 760, hb = ww * .085, c = Math.cos(rot), s = Math.sin(rot);
    const Wx = (sx - W / 2) * c + (sy - H / 2) * s, Wy = -(sx - W / 2) * s + (sy - H / 2) * c;       // world coords under the rotated camera
    // exhaust trail in screen space behind the rocket
    for (let i = 0; i < 7; i++) { const q = i / 7; paint(ellPts(sx - c * (ww * .55 + q * 420), sy - s * (ww * .55 + q * 420) + q * 40, 40 + q * 60, 34 + q * 50, 14), { fill: TK.sootLt, fillOp: 160 * (1 - q), bleed: .3, ink: null }); }
    camBegin(W / 2, H / 2, 1, rot);
    const x0 = Wx - ww / 2 + W / 2, y0 = Wy - hb / 2 + H / 2;
    push(); translate(x0, y0 + hb / 2); rotate(-Math.PI / 2);
    fire(0, 0, hb * 1.4, 300 * (1 + .2 * pulse2(t, 5)), t, { seed: 13, n: 4 });
    pop();
    paint([[x0 - 10, y0 - 40], [x0 + 110, y0], [x0 + 110, y0 + hb], [x0 - 10, y0 + hb + 40]], { wash: TK.ember, ink: INK, sw: .9 });   // fins
    paint([[x0 + ww - 20, y0 - 6], [x0 + ww + 150, y0 + hb / 2], [x0 + ww - 20, y0 + hb + 6]], { wash: TK.cream, fill: TK.ember, fillOp: 60, ink: INK, sw: .9, curv: .3 });   // nose
    limitBar(x0, y0, ww, .5, { glow: .6, label: 'К ЛУНЕ' });
    clawd(x0 + ww * .55, y0 + 4, 14, { noShadow: true, eyes: 'happy', mouth: 'grin', aL: 1.8 + .2 * Math.sin(t * 12), aR: 1.6, rot: .05 });
    camEnd();
    flash(.25 * Math.exp(-lt * 8), TK.cream);
  }

  // ---------- 27.3 «Сделай игру, чтоб никто не играл»: the empty arcade ----------
  function web(x, y, r, sx, sy) {
    const col = '#CFC8D8';
    for (let i = 0; i <= 4; i++) { const a = i / 4 * Math.PI / 2; inkLine([[x, y], [x + sx * Math.cos(a) * r, y + sy * Math.sin(a) * r]], .5, col, 'inkfine', 0); }
    for (let k = 1; k <= 3; k++) { const pts = []; for (let i = 0; i <= 4; i++) { const a = i / 4 * Math.PI / 2, rr = r * k / 3.4 * (i % 4 ? .88 : 1); pts.push([x + sx * Math.cos(a) * rr, y + sy * Math.sin(a) * rr]); } inkLine(pts, .45, col, 'inkfine', .5); }
  }
  function arcade(t, lt) {
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: '#211A28', fill: '#3A2A48', fillOp: 90, bleed: .1, tex: .6, ink: null });
    camBegin(960, 520 - lt * 10, 1.02 + lt * .04);
    paint(rectPts(-100, 880, W + 200, 400), { wash: '#2A2230', fill: '#44364E', fillOp: 90, tex: .6, ink: INK, sw: .7 });
    paint([[820, -60], [1100, -60], [1380, 900], [540, 900]], { wash: TK.yellowLt, washOp: 30, ink: null });       // spotlight
    for (let i = 0; i < 16; i++) { const p = frac(t * .08 + hash(i)); paint(ellPts(700 + hash(i + 2) * 520 + Math.sin(t + i) * 20, 60 + p * 800, 2.5, 2.5, 5), { wash: TK.cream, washOp: 160, ink: null }); }
    // cabinet
    const cx = 960;
    paint([[cx - 230, 170], [cx + 230, 170], [cx + 250, 900], [cx - 250, 900]], { wash: '#3B2E8C', fill: '#231A5A', fillOp: 90, tex: .6, ink: INK, sw: 1.3 });
    paint(rectPts(cx - 240, 150, 480, 120), { wash: TK.ember, fill: TK.emberDk, fillOp: 60, tex: .5, ink: INK, sw: 1.1 });   // marquee
    letter('МОЯ ИГРА', cx, 212, 66, TK.yellow, { font: ruFont(66), ink: false });
    paint(rectPts(cx - 190, 300, 380, 290), { wash: '#0E1410', ink: INK, sw: 1 });
    const blink = frac(t * 1.66) < .6;
    letter('ТОКЕН-РАННЕР', cx, 380, 42, TK.green, { font: ruFont(42), ink: false });
    if (blink) letter('ВСТАВЬТЕ ТОКЕН', cx, 470, 30, TK.yellow, { font: ruFont(30), ink: false });
    letter('РЕКОРД: —', cx, 540, 26, TK.led, { font: ruFont(26), ink: false });
    paint([[cx - 230, 620], [cx + 230, 620], [cx + 270, 700], [cx - 270, 700]], { wash: '#4B3CA8', ink: INK, sw: 1 });       // control deck
    inkLine([[cx - 120, 660], [cx - 120, 600]], 3, TK.soot, 'ink', 0);
    paint(ellPts(cx - 120, 596, 18, 18, 10), { wash: TK.ember, ink: INK, sw: .6 });
    for (let i = 0; i < 3; i++) paint(ellPts(cx + 40 + i * 60, 660, 18, 10, 10), { wash: [TK.yellow, TK.green, TK.blue][i], ink: INK, sw: .6 });
    paint(rectPts(cx - 60, 760, 120, 70), { wash: '#2A2070', ink: INK, sw: .8 });
    token(cx - 20, 795, 18, { ink: false });
    paint(rectPts(cx + 10, 775, 8, 40), { wash: TK.soot, ink: null });
    web(cx - 230, 170, 150, 1, 1); web(cx + 230, 170, 130, -1, 1); web(cx + 250, 900, 120, -1, -1);
    // spider on its thread, bobbing down
    const spy = 300 + 60 * Math.sin(t * 1.4) + 60;
    inkLine([[cx + 330, -40], [cx + 330, spy]], .5, '#CFC8D8', 'inkfine', 0);
    paint(ellPts(cx + 330, spy + 14, 13, 16, 10), { wash: TK.soot, ink: INK, sw: .5 });
    for (const e of [-1, 1]) for (let k = 0; k < 3; k++) inkLine([[cx + 330, spy + 10 + k * 6], [cx + 330 + e * 22, spy + k * 8], [cx + 330 + e * 30, spy + 18 + k * 8]], .6, TK.soot, 'inkfine', .3);
    // the players counter on a stand
    paint(rectPts(1330, 460, 330, 170), { wash: TK.soot, ink: INK, sw: 1 });
    letter('ИГРОКОВ', 1495, 505, 40, TK.ash, { font: ruFont(40), ink: false });
    counter(1495, 575, 70, 0, { col: TK.ember });
    inkLine([[1495, 630], [1495, 880]], 3, TK.steel, 'ink', 0);
    camEnd();
    stamp('0 ИГРОКОВ', 460, 780, 84, t, 28.3, { col: TK.ember, rot: -.1 });
  }

  // ---------- 29.6 «Сайт мне сделай, чтоб никто не читал!»: tumbleweed, then pan to the hot rack ----------
  function tumbleweed(x, y, r, rot) {
    paint(ellPts(x, y, r, r * .92, 16), { wash: '#C9A46A', washOp: 160, fill: '#8A6A3A', fillOp: 110, bleed: .2, tex: .5, ink: null });
    for (let i = 0; i < 7; i++) {
      const a0 = rot + i * .9, pts = [];
      for (let q = 0; q <= 6; q++) { const a = a0 + q * .9, rr = r * (.35 + .6 * hash(i * 7 + q)); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
      inkLine(pts, .7, '#6E5230', 'inkfine', .6);
    }
  }
  function website(t, lt) {
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: '#D9CFC0', fill: '#B9AE9C', fillOp: 70, tex: .5, ink: null });
    const pan = ease(seg(t, 31.4, 32.35));
    camBegin(lerp(960, 1700, pan), lerp(510, 560, pan), lerp(1, .92, pan));
    // the hot server rack next to the monitor (the hand-off to the data center)
    glowAt(2150, 500, 600, TK.orange, 60 + 60 * pan);
    serverRack(1960, 60, 380, 860, t, { heat: .7 + .3 * pan, seed: 4, fire: pan * .8 });
    cooler(2150, 780, 110, t, { speed: 6, howl: .4 + .6 * pan });
    // browser
    paint(rrPts(150, 60, 1640, 860, 20), { wash: '#FBF8F2', ink: INK, sw: 1.3 });
    paint(rrPts(150, 60, 1640, 70, 16), { wash: '#C9C4BC', ink: null });
    for (let i = 0; i < 3; i++) paint(ellPts(190 + i * 34, 95, 10, 10, 8), { wash: [TK.ember, TK.yellow, TK.green][i], ink: null });
    paint(rrPts(320, 76, 900, 40, 18), { wash: '#FFFFFF', ink: INK, sw: .5 });
    letter('мой-сайт.рф', 350, 97, 28, '#55555F', { font: ruFont(28), align: 'left', ink: false });
    letter('МОЙ САЙТ', 960, 230, 96, TK.blue, { font: ruFont(96), ink: false });
    letter('сделан за 4 000 000 токенов', 960, 320, 40, '#55555F', { font: ruFont(40), ink: false });
    for (let i = 0; i < 5; i++) paint(rectPts(300, 400 + i * 40, 780 - (i % 3) * 120, 14), { wash: '#DDD8CF', ink: null });
    paint(rectPts(1200, 390, 460, 200), { wash: '#E9E4DA', ink: INK, sw: .6 });
    letter('ПОСЕТИТЕЛЕЙ', 1430, 440, 40, '#55555F', { font: ruFont(40), ink: false });
    counter(1430, 525, 72, 0, { col: TK.ember });
    paint(rectPts(150, 790, 1640, 4), { wash: '#DDD8CF', ink: null });
    // the tumbleweed crosses the page, bouncing on the beat
    const tp = seg(t, 29.7, 31.5), tx = lerp(-60, 1950, tp), ty = 705 - Math.abs(Math.sin(bpOf(t) * Math.PI)) * 110;
    for (let i = 1; i < 4; i++) paint(ellPts(tx - i * 70, 790 - i * 4, 40 - i * 8, 12, 10), { fill: '#C9B48A', fillOp: 90 / i, bleed: .3, ink: null });
    for (let i = 0; i < 3; i++) inkLine([[tx - 160 - i * 60, 700 + i * 30], [tx - 90 - i * 60, 698 + i * 30]], .6, '#9A8A70', 'inkfine', 0);
    if (tp > 0 && tp < 1) tumbleweed(tx, ty, 85, t * 6);
    camEnd();
    stamp('0 ПОСЕТИТЕЛЕЙ', 700, 840 - pan * 60, 76, t, 30.95, { col: TK.ember, rot: -.06 });
  }

  chapter('friday', 0, 32.35, [
    [0, strike], [B(4), ignite], [TTITLE, titleShot], [B(13), vigil],
    [12.6, friday], [15.0, screen], [17.5, park], [19.8, burn],
    [22.5, wave], [25.9, rocket], [27.3, arcade], [29.6, website],
  ]);
})();
