// i03_verse2.js: IT GIRL chapter 3 "Verse 2 + Pre-chorus 2" (59.45–84.25). Pastel dream sky, bubblegum.
// Drama masks frozen by a glove → hair-flip wipe to a cloud tower → the hater's heart monitor → rent-free in a
// thought bubble → crescent flight through money-hearts → rollerblade wink → whatever (dumbbell) → birds in her palm →
// pre-chorus remix: giant juice strut, copycat lips in shades, the plotters' map bursts into sparkle-fire,
// the blueprint is the cat → the cat pumps the wand.
(() => {
  const B = n => OFF + n * BEAT;                                   // song time of beat n (B(122) = 61.233)
  const INK = PAL.ink;
  const RIV = { col: '#9CCB8A', dk: '#5E8F58', lt: '#C6E6B4' };   // jealous-green rival Clawds

  // ---------- helpers ----------
  function puffPts(cx, cy, rx, ry, seed = 0, n = 36) {
    const p = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU, s = Math.sin(a), c = Math.cos(a), top = s < 0;
      const b = top ? Math.pow(Math.abs(Math.sin(a * 3.5 + seed)), .6) * .2 : Math.pow(Math.abs(Math.sin(a * 5 + seed)), .6) * .06;
      p.push([cx + c * rx * (1 + b), cy + s * ry * (top ? 1 + b * 1.6 : .62 + b)]);
    }
    return p;
  }
  // radial anime speed lines (screen space), boiling at 12 fps
  function speedLines(cx, cy, t, n = 30, col = MG.cream, op = 180, r0 = 420) {
    const f = Math.floor(t * 12);
    for (let i = 0; i < n; i++) {
      const a = (i + hash(i * 3.1 + f) * .6) / n * TAU, r1 = r0 * (.8 + hash(i + f * 7) * .7), w = 6 + hash(i * 5 + f) * 16;
      const c = Math.cos(a), s = Math.sin(a), nx = -s * w, ny = c * w;
      paint([[cx + c * r1, cy + s * r1], [cx + c * 1700 + nx, cy + s * 1700 + ny], [cx + c * 1700 - nx, cy + s * 1700 - ny]], { wash: col, washOp: op, ink: null });
    }
  }
  // horizontal streaks flowing left (screen space)
  function hLines(t, n = 16, col = MG.cream, op = 170, speed = 2600) {
    for (let i = 0; i < n; i++) {
      const y = (i + .5) / n * H + (hash(i) - .5) * 40, len = 260 + hash(i + 3) * 520, th = 4 + hash(i + 5) * 9;
      const x = W + 300 - frac(t * speed / (W + 900) + hash(i + 9)) * (W + 900);
      paint(rectPts(x, y, len, th), { wash: col, washOp: op, ink: null });
    }
  }
  function sparkleBurst(x, y, age, n, R, cols = [MG.cream, MG.goldLt, MG.pink], life = .6) {
    if (age < 0 || age > life) return;
    const k = age / life;
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU + .3, d = R * easeOut(k), r = R * .24 * (1 - k);
      if (r > 1.5) paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d, r, .3), { wash: cols[i % cols.length], ink: INK, sw: .5 });
    }
  }
  // body-space sunglasses, slid down by `off` body units
  const shadesAt = (off = 0) => (u, sw) => {
    const y = -7.5 * u + off * u;
    paint(rrPts(-4.7 * u, y, 4.1 * u, 2.1 * u, .8 * u), { wash: '#2B2244', ink: INK, sw: sw * .6 });
    paint(rrPts(.6 * u, y, 4.1 * u, 2.1 * u, .8 * u), { wash: '#2B2244', ink: INK, sw: sw * .6 });
    inkLine([[-.6 * u, y + .6 * u], [.6 * u, y + .6 * u]], sw * .8, INK, 'ink', 0);
    inkLine([[-4 * u, y + .5 * u], [-2.8 * u, y + .4 * u]], sw * .6, MG.pink, 'inkfine', 0);
    inkLine([[1.3 * u, y + .5 * u], [2.5 * u, y + .4 * u]], sw * .6, MG.pink, 'inkfine', 0);
  };
  // arm hook: open glove palm, fingers along local +x after rotating by rot
  const palmHook = rot => (u, sw) => {
    push(); rotate(rot); scale(1.8);
    for (let i = 0; i < 4; i++) paint(rrPts(.9 * u, (-1.1 + i * .62) * u, 1.9 * u - Math.abs(i - 1.5) * .3 * u, .56 * u, .28 * u), { wash: MG.glove, ink: INK, sw: sw * .45 });
    paint(ellPts(.2 * u, .9 * u, .9 * u, .42 * u, 10, 0, .9), { wash: MG.glove, ink: INK, sw: sw * .45 });
    paint(ellPts(.3 * u, 0, 1.1 * u, 1.2 * u, 14), { wash: MG.glove, ink: INK, sw: sw * .5 });
    pop();
  };
  // skates under the four legs
  const skates = (u, sw) => {
    for (const lx of [-4, -2, 1, 3]) {
      paint(rrPts((lx - .15) * u, -.9 * u, 1.35 * u, 1 * u, .3 * u), { wash: MG.cream, ink: INK, sw: sw * .5 });
      for (const wx of [0, .9]) paint(ellPts((lx + .05 + wx) * u, .35 * u, .32 * u, .32 * u, 8), { wash: MG.hot, ink: INK, sw: sw * .4 });
    }
  };
  // lips with little wings and stick legs (birds pecking sprinkles)
  function birdLips(x, y, s, t, o = {}) {
    const fl = Math.sin(t * 22 + (o.seed || 0)) * (o.fly ? 1 : .3);
    for (const e of [-1, 1]) {
      push(); translate(x + e * 1.2 * s, y - .3 * s); rotate(e * (-.5 + fl * .6));
      paint(ellPts(e * .9 * s, -.3 * s, 1 * s, .45 * s, 12), { wash: MG.cream, ink: INK, sw: .6 });
      pop();
    }
    if (!o.fly) for (const e of [-1, 1]) inkLine([[x + e * .4 * s, y + .6 * s], [x + e * .5 * s, y + 1.3 * s]], 1, MG.goldDk || '#B98A1E', 'ink', 0);
    lips(x, y, s, t, { talk: .9, seed: o.seed || 0, rot: o.rot || 0, col: o.col });
  }
  // lips in sunglasses and tiny odango buns (copycats)
  function copyLips(x, y, s, t, o = {}) {
    push(); translate(x, y + (o.dy || 0)); rotate(o.rot || 0);
    for (const e of [-1, 1]) paint(ellPts(e * 1.25 * s, -1.25 * s, .42 * s, .4 * s, 10), { wash: MG.hair, ink: INK, sw: .7 });
    for (const [e, a] of [[-1, o.aL ?? 0], [1, o.aR ?? 0]]) paint(ellPts(e * (2.1 + Math.cos(a) * .4) * s, -Math.sin(a) * 1.1 * s, .34 * s, .34 * s, 10), { wash: MG.glove, ink: INK, sw: .6 });
    pop();
    lips(x, y + (o.dy || 0), s, t, { talk: o.talk ?? .8, seed: o.seed, rot: o.rot || 0 });
    if (o.shadesOff !== undefined && o.shadesOff > 1) return;
    const fall = o.shadesFall || 0;
    push(); translate(x + fall * 20, y + (o.dy || 0) - .95 * s + fall * fall * 260); rotate((o.rot || 0) + fall * 2.5);
    paint(rrPts(-1.35 * s, -.3 * s, 1.15 * s, .5 * s, .2 * s), { wash: '#2B2244', ink: INK, sw: .6 });
    paint(rrPts(.2 * s, -.3 * s, 1.15 * s, .5 * s, .2 * s), { wash: '#2B2244', ink: INK, sw: .6 });
    pop();
  }
  const pastelBg = (t, o = {}) => dreamSky(t, { n: 18, ...o });

  // ---------- 59.45 drama masks: they wail, she holds up a glove, they freeze ----------
  function maskPts(cx, cy, R) {
    const p = []; for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, s = Math.sin(a); p.push([cx + Math.cos(a) * R * (s > 0 ? 1 - .38 * s : 1), cy + s * R * 1.15]); } return p;
  }
  function dramaMask(cx, cy, R, t, happy, frozen, fk) {
    const col = frozen ? mixCol(happy ? MG.gold : MG.lilac, '#CFE3F5', .55 * fk) : (happy ? MG.gold : MG.lilac);
    const open = frozen ? .6 : .35 + .65 * Math.abs(Math.sin(t * 9 + (happy ? 0 : 1)));
    for (const e of [-1, 1]) inkLine([[cx + e * R * .95, cy - R * .2], [cx + e * R * 1.3, cy + R * .2 + Math.sin(t * 5 + e) * 20], [cx + e * R * 1.2, cy + R * .8]], 7, MG.hot, 'marker', .6);
    paint(maskPts(cx, cy, R), { wash: col, fill: happy ? MG.hairDk : MG.lilacDk, fillOp: 60, tex: .5, ink: INK, sw: 1.3 });
    for (const e of [-1, 1]) {
      const ex = cx + e * R * .38, ey = cy - R * .2;
      paint(ellPts(ex, ey, R * .2, R * .13, 12, 0, e * (happy ? -.3 : .3)), { wash: '#2B2244', ink: INK, sw: .8 });
      inkLine([[ex - R * .22, ey - R * .3 + (happy ? 0 : -e * R * .1)], [ex + R * .22, ey - R * .3 + (happy ? 0 : e * R * .1)]], 1.4, INK, 'ink', 0);
      // tears: a stream of drops arcing out (frozen mid-air after the stop)
      for (let k = 0; k < 6; k++) {
        const f = frac(t * 1.6 + k / 6 + (e > 0 ? .08 : 0)), dx = e * f * R * 1.3, dy = R * .12 + f * f * R * 2.2;
        paint(ellPts(ex + dx, ey + dy, 9 + 5 * (1 - f), 12 + 6 * (1 - f), 10), { wash: frozen ? '#DDEFFF' : MG.sky, ink: INK, sw: .5 });
      }
    }
    const my = cy + R * .5, mw = R * .45;
    if (happy) paint([[cx - mw, my - R * .1], [cx + mw, my - R * .1], [cx + mw * .5, my + R * .25 * open], [cx - mw * .5, my + R * .25 * open]], { wash: '#4A1F2A', ink: INK, sw: 1, curv: .5 });
    else paint([[cx - mw, my + R * .15], [cx - mw * .4, my - R * .22 * open], [cx + mw * .4, my - R * .22 * open], [cx + mw, my + R * .15]], { wash: '#4A1F2A', ink: INK, sw: 1, curv: .5 });
    if (frozen) {
      paint(maskPts(cx, cy, R * 1.12), { fill: '#BFE0FA', fillOp: 70 * fk, bleed: .2, tex: .3, ink: null });
      for (let k = 0; k < 4; k++) sparkle(cx + (hash(k + (happy ? 5 : 9)) - .5) * R * 2, cy + (hash(k + 20) - .5) * R * 2, 16, frac(t * 1.5 + k * .25), MG.cream);
    }
  }
  function drama(t, lt) {
    const tStop = B(121), fz = t >= tStop, tf = Math.min(t, tStop), age = t - tStop, fk = seg(age, 0, .25);
    pastelBg(t, { a: '#FBD9EA' });
    sunburst(1380, 460, MG.lilac, MG.pink, t * .2, 14, 2200, fz ? 60 : 110);
    const [sx, sy] = shakeXY(t, fz && age < .3 ? 14 * (1 - age / .3) : 0);
    camBegin(960 + lt * 25 + sx, 540 + sy, 1.02 + lt * .04 + (fz ? .05 * Math.exp(-age * 6) : 0));
    const bob = fz ? 0 : Math.sin(tf * 8) * 16;
    dramaMask(1170, 420 + bob, 150, tf, true, fz, fk);
    dramaMask(1560, 470 - bob, 140, tf + .3, false, fz, fk);
    if (fz) paint(ellPts(1370, 450, 480 * easeOut(age * 3), 300 * easeOut(age * 3), 30), { ink: '#9FD3F5', sw: 2.2 * (1 - fk * .6) });
    const rise = kf(t, [[59.45, -.3], [tStop - .2, -.1], [tStop, .45]], backOut);
    sailorClawd(520, 900, 36, {
      ...(fz ? { dy: 0, sq: .08 * Math.exp(-age * 8) } : move('idle', t)),
      ...mood(t, [[59.45, 'narrow'], [tStop, 'closed']]), mouth: fz ? 'flat' : 'cat',
      aR: rise, armR: palmHook(-Math.PI / 2 + rise), aL: -.4
    });
    if (fz) sparkleBurst(520 + 7.6 * 36, 900 - 9 * 36, age, 8, 140);
    camEnd();
  }

  // ---------- 61.233 hair flip wipes to her lounging on a pink cloud tower ----------
  function hairBand(p) {
    const c = lerp(-1400, W + 1400, ease(p)), y0 = -200, y1 = H + 200;
    push(); translate(W / 2, H / 2); rotate(-.18); translate(-W / 2, -H / 2);
    const L = [], R = [];
    for (let i = 0; i <= 12; i++) {
      const y = lerp(y0, y1, i / 12);
      L.push([c - 1250 - (i % 2 ? 180 : 0) + Math.sin(i * 1.3) * 60, y]);
      R.push([c + 1250 + (i % 2 ? 260 : 0) + Math.sin(i * .9) * 80, y]);
    }
    paint([...L, ...R.reverse()], { wash: MG.hair, fill: MG.hairDk, fillOp: 90, tex: .6, border: .5, ink: INK, sw: 1.6 });
    for (let i = 0; i < 14; i++) {
      const y = y0 + 60 + i * (y1 - y0) / 14, pts = [];
      for (let k = 0; k <= 6; k++) pts.push([c - 1150 + k * 390, y + Math.sin(k * 1.1 + i) * 40]);
      inkLine(pts, 3 + (i % 3), i % 4 === 1 ? MG.goldLt : MG.hairDk, 'ink', .6);
    }
    pop();
  }
  function hairflip(t, lt) {
    const p = clamp(lt / .62);
    if (p < .5) {
      pastelBg(t);
      speedLines(960, 500, t, 26, MG.pink, 150, 520);
      sailorClawd(960, 1240, 62, { rot: -p * 1.1, eyes: 'closed', mouth: 'smile', blush: true, aL: 1.2, aR: -.2, noShadow: true });
    } else {
      pastelBg(t, { a: '#FCE3EE', seed: 11 });
      const cy = kf(lt, [[.3, 1080], [1.5, 560]], easeOut), z = kf(lt, [[.3, 1.18], [1.8, 1.0]]);
      camBegin(960 + Math.sin(t * 1.3) * 15, cy, z);
      // tiny pastel skyscrapers far below
      for (let i = 0; i < 14; i++) {
        const x = 40 + i * 140, h = 180 + hash(i + 4) * 220;
        paint(rectPts(x, 1560 - h, 110, h + 300), { wash: [MG.sky, MG.lilac, MG.pink, MG.mint][i % 4], washOp: 200, ink: INK, sw: .6 });
      }
      // cloud tower
      for (let i = 0; i < 7; i++) {
        const y = 1560 - i * 140, rx = 420 - i * 30 + Math.sin(t * 2 + i) * 8;
        paint(puffPts(960 + Math.sin(i * 1.7 + t) * 30, y, rx, 110, i), { wash: i % 2 ? '#F9C6DC' : '#FAD3E4', fill: MG.lilac, fillOp: 50, tex: .4, ink: INK, sw: .9, curv: .4 });
      }
      paint(puffPts(960, 690, 330, 90, 7), { wash: MG.cream, fill: MG.pink, fillOp: 60, tex: .4, ink: INK, sw: 1, curv: .4 });
      for (let k = 0; k < 6; k++) { const f = frac(t * .5 + k / 6); paint(heartPts(760 + k * 80 + Math.sin(t * 2 + k) * 20, 640 - f * 420, 14 * (1 - f * .5)), { wash: k % 2 ? MG.hot : MG.pink, washOp: 255 * (1 - f), ink: null }); }
      sailorClawd(960, 700, 40, {
        rot: .16, dy: -Math.abs(Math.sin(bpOf(t) * Math.PI)) * .3, eyes: 'normal', mouth: 'cat', blush: true, noShadow: true,
        aL: 1.9, aR: .7 + .4 * Math.sin(t * 5), draw: shadesAt(0)
      });
      sparkle(960 - 2.6 * 40 + 10, 700 - 7.2 * 40, 44, seg(t, B(125), B(125) + .45), MG.cream);
      camEnd();
    }
    if (p > 0 && p < 1) hairBand(p);
  }

  // ---------- 63.233 hater's heart monitor; she sleeps on a cloud outside ----------
  function ecg(f) { return -Math.exp(-Math.pow((f - .06) / .018, 2)) + .4 * Math.exp(-Math.pow((f - .11) / .02, 2)) - .18 * Math.exp(-Math.pow((f - .35) / .06, 2)); }
  function monitor(t, lt) {
    const pk = pulse(t, 5), [sx, sy] = shakeXY(t, 8 * pk);
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#D5F1E6', fill: MG.mint, fillOp: 60, bleed: .1, tex: .5, ink: null });
    camBegin(960 + sx + lt * 20, 540 + sy, 1.02 + lt * .03 + pk * .015);
    for (let i = 0; i < 18; i++) paint(heartPts(80 + (i % 6) * 330 + (Math.floor(i / 6) % 2) * 160, 100 + Math.floor(i / 6) * 230, 16), { wash: '#B4E2D2', ink: null });
    paint(rectPts(-100, 800, W + 200, 400), { wash: '#F6D5E4', fill: MG.pink, fillOp: 40, tex: .4, ink: INK, sw: .8 });
    // window with her asleep on a cloud
    paint(rrPts(1180, 150, 600, 480, 20), { wash: '#FAD3E4', fill: MG.lilac, fillOp: 70, bleed: .2, tex: .4, ink: null });
    const cx = 1480 + Math.sin(t * 1.2) * 15, cyy = 470 + Math.sin(t * 1.7) * 8;
    paint(puffPts(cx, cyy, 190, 60, 2), { wash: MG.cream, ink: INK, sw: .8, curv: .4 });
    sailorClawd(cx, cyy - 10, 17, { rot: -.12, eyes: 'closed', mouth: 'o', blush: true, noShadow: true, noLegs: true, aL: -.2, aR: -.2, emote: 'zzz', emoteK: .5 + .5 * frac(t * .8) });
    paint(rrPts(1180, 150, 600, 480, 20), { ink: INK, sw: 2 });
    inkLine([[1480, 150], [1480, 630]], 5, MG.cream, 'ink', 0); inkLine([[1180, 390], [1780, 390]], 5, MG.cream, 'ink', 0);
    paint(rectPts(1150, 620, 660, 26), { wash: MG.cream, ink: INK, sw: 1 });
    // the heart monitor on its stand
    const mx = 420, my = 400;
    inkLine([[mx, my + 150], [mx, 820]], 6, '#8A8FA8', 'ink', 0);
    for (const e of [-1, 1]) inkLine([[mx, 815], [mx + e * 90, 840]], 5, '#8A8FA8', 'ink', 0);
    paint(rrPts(mx - 220, my - 160, 440, 310, 30), { wash: '#E8E4F2', fill: MG.lilac, fillOp: 50, ink: INK, sw: 1.4 });
    paint(rrPts(mx - 190, my - 130, 380, 230, 16), { wash: '#1E3A3A', ink: INK, sw: 1 });
    const trace = [];
    for (let i = 0; i <= 40; i++) { const x = -175 + i * 8.75, ph = bpOf(t) - (175 - x) / 350 * 2; trace.push([mx + x, my - 10 + ecg(frac(ph)) * 85]); }
    inkLine(trace, 2.6, '#7CFFB0', 'ink', 0);
    paint(heartPts(mx + 150, my - 95, 14 * (1 + pk * .6)), { wash: MG.hot, ink: null });
    // hater, bugging out
    const u = 38, rx = 860;
    const pops = pk > .15 ? pk : 0;
    clawd(rx, 850, u, {
      ...RIV, eyes: 'scared', lookX: -1, mouth: 'O', sq: -pk * .1, dy: -pk * .6, aL: .6 + pk * .6, aR: .6 + pk * .6,
      emote: 'sweat', emoteK: 1,
      draw: pops ? (uu, sw) => {
        for (const ex of [-3, 2]) {
          const bx = (ex + .5) * uu, by = -6 * uu, px = bx + (ex < 0 ? -1 : 1) * pops * 1.2 * uu - pops * uu, py = by - pops * 3.4 * uu;
          const zz = []; for (let k = 0; k <= 8; k++) zz.push([lerp(bx, px, k / 8) + (k % 2 ? 1 : -1) * .35 * uu * (k > 0 && k < 8), lerp(by, py, k / 8)]);
          inkLine(zz, sw * .7, INK, 'inkfine', 0);
          paint(ellPts(px, py, uu * (1 + pops * 1.1), uu * (1 + pops * 1.1), 16), { wash: MG.cream, ink: INK, sw: sw * .6 });
          paint(ellPts(px - uu * .5, py + uu * .1, uu * .5, uu * .6, 10), { wash: INK, ink: null });
        }
      } : null
    });
    camEnd();
  }

  // ---------- 65.233 rent-free: she furnished the hater's thought bubble ----------
  function rentfree(t, lt) {
    pastelBg(t, { a: '#EBDDF8', b: MG.lilac, seed: 5 });
    const z = kf(lt, [[0, 1], [1.9, 1.45]], ease), cx = kf(lt, [[0, 960], [1.9, 1180]]), cy = kf(lt, [[0, 540], [1.9, 440]]);
    const [sx, sy] = shakeXY(t, 4 * pulse(t, 5));
    camBegin(cx + sx, cy + sy, z);
    const bx = 1200, by = 420;
    clawd(400, 930, 26, { ...RIV, eyes: 'angry', mouth: 'wobble', aL: .9, aR: -.3, emote: 'anger', emoteK: .6 + .4 * pulse(t, 4), rot: -.05, sq: pulse(t, 6) * .06 });
    paint(ellPts(560, 660, 26, 22, 14), { wash: MG.cream, ink: INK, sw: 1 });
    paint(ellPts(640, 575, 42, 36, 16), { wash: MG.cream, ink: INK, sw: 1 });
    paint(puffPts(bx, by + 40, 600, 330, 3, 44), { wash: MG.cream, fill: MG.pink, fillOp: 30, tex: .3, ink: INK, sw: 1.6, curv: .4 });
    // the apartment inside
    paint(rrPts(800, 250, 800, 390, 30), { wash: '#FAD3E4', fill: MG.pink, fillOp: 50, tex: .4, ink: null });
    for (let i = 0; i < 7; i++) inkLine([[830 + i * 120, 262], [830 + i * 120, 540]], 6, '#F7C2D8', 'ink', 0);
    paint(rrPts(800, 540, 800, 100, 30), { wash: '#E7C9A8', ink: null });
    paint(ellPts(1200, 590, 260, 32, 20), { wash: MG.lilac, ink: INK, sw: .7 });
    // fairy lights
    const lights = []; for (let i = 0; i <= 14; i++) lights.push([830 + i * 52, 290 + Math.sin(i / 14 * Math.PI) * 50 + (i % 2) * 6]);
    inkLine(lights, 1.2, INK, 'inkfine', .5);
    lights.forEach(([x, y], i) => { const on = (i + beatN(t)) % 2 === 0; paint(ellPts(x, y + 10, 9, 11, 10), { wash: [MG.gold, MG.hot, MG.sky, MG.mint][i % 4], washOp: on ? 255 : 120, ink: INK, sw: .4 }); if (on) paint(ellPts(x, y + 10, 22, 22, 12), { fill: MG.goldLt, fillOp: 70, bleed: .3, ink: null }); });
    // lamp, framed heart, plant
    inkLine([[1500, 560], [1500, 420]], 3, INK, 'ink', 0);
    paint([[1460, 420], [1540, 420], [1520, 370], [1480, 370]], { wash: MG.goldLt, ink: INK, sw: .8 });
    paint(ellPts(1500, 430, 80, 60, 16), { fill: MG.goldLt, fillOp: 60, bleed: .3, ink: null });
    paint(rrPts(1120, 330, 110, 90, 8), { wash: MG.cream, ink: INK, sw: 1 }); paint(heartPts(1175, 375, 26), { wash: MG.hot, ink: null });
    paint(rrPts(880, 500, 50, 60, 8), { wash: MG.hot, ink: INK, sw: .8 });
    for (const a of [-.6, 0, .6]) paint(ellPts(905 + a * 30, 470 - Math.abs(a) * -10, 16, 34, 10, 0, a), { wash: '#7CC49A', ink: INK, sw: .6 });
    // sofa
    paint(rrPts(1010, 440, 380, 110, 40), { wash: MG.hot, fill: MG.pinkDk, fillOp: 60, tex: .5, ink: INK, sw: 1.1 });
    paint(rrPts(1000, 510, 400, 80, 30), { wash: MG.pink, fill: MG.pinkDk, fillOp: 40, ink: INK, sw: 1.1 });
    for (const x of [980, 1370]) paint(rrPts(x, 480, 50, 110, 22), { wash: MG.hot, ink: INK, sw: 1 });
    sailorClawd(1180, 565, 19, { noShadow: true, dy: -Math.abs(Math.sin(bpOf(t) * Math.PI)) * .6, eyes: 'happy', blush: true, mouth: 'smile', aL: -.1, aR: 1.1 + .5 * Math.sin(t * 12), emote: 'heart', emoteK: seg(t, B(132), B(132) + .3) });
    sparkleBurst(1180, 440, t - B(132), 8, 90);
    camEnd();
  }

  // ---------- 67.233 crescent flight through money-heart confetti; angry lips steam below ----------
  function flight(t, lt, dur) {
    pastelBg(t, { a: '#FFE3D6', seed: 8 });
    hLines(t, 14, MG.cream, 150, 2200);
    const p = lt / dur;
    camBegin(lerp(860, 1060, p), 540, 1.04);
    for (let i = 0; i < 30; i++) {
      const x = hash(i + 50) * (W + 200) - 100 + Math.sin(t * 1.5 + i) * 30, y = frac(hash(i + 60) + t * (.3 + hash(i) * .2)) * 1250 - 150;
      push(); translate(x, y); rotate(t * (1 + hash(i + 2) * 2) + i); scale(1.6 * Math.cos(t * 5 + i * 1.7), 1.6);
      if (i % 3) { paint(rectPts(-34, -18, 68, 36), { wash: '#A6DDA8', ink: INK, sw: .6 }); paint(heartPts(0, 0, 10), { wash: '#4E9E5F', ink: null }); }
      else { paint(ellPts(0, 0, 20, 20, 14), { wash: MG.gold, ink: INK, sw: .6 }); paint(heartPts(0, 0, 8), { wash: MG.goldDk || '#B98A1E', ink: null }); }
      pop();
    }
    // angry lips row
    for (let i = 0; i < 5; i++) {
      const x = 380 + i * 300, y = 830 + Math.sin(t * 7 + i) * 6;
      for (let k = 0; k < 3; k++) { const f = frac(bpOf(t) + k / 3 + i * .2); paint(ellPts(x + Math.sin(f * 6 + i) * 20, y - 80 - f * 180, 26 + f * 30, 20 + f * 22, 12), { fill: '#FFFFFF', fillOp: 130 * (1 - f), bleed: .3, ink: null }); }
      lips(x, y, 44, t, { talk: 1, seed: i, col: '#D94A6A' });
      for (const e of [-1, 1]) inkLine([[x + e * 70, y - 70], [x + e * 20, y - 50]], 2.4, INK, 'ink', 0);
    }
    // her on the crescent, sparkle trail
    const path = q => [lerp(-150, 2050, q), 470 - Math.sin(q * Math.PI) * 170 + Math.sin(q * 12) * 20];
    for (let k = 1; k <= 8; k++) { const [x, y] = path(clamp(p - k * .025)); sparkle(x - 60, y + 90, 22 - k * 1.5, frac(t * 3 + k * .3), [MG.goldLt, MG.pink, MG.cream][k % 3]); }
    const [x, y] = path(p), u = 32;
    sailorClawd(x, y + 30 + 2 * u, u, { noLegs: true, noShadow: true, rot: -.1, eyes: 'happy', blush: true, mouth: 'grin', wand: true, aR: 1.3, aL: .4 + .3 * Math.sin(t * 8) });
    paint(ellPts(x, y + 60, 190, 140, 24), { fill: MG.goldLt, fillOp: 60, bleed: .3, ink: null });
    crescent(x, y + 20, 200, Math.PI / 2 - .1, MG.gold, { sw: 1.4 });
    camEnd();
  }

  // ---------- 69.233 rollerblades past pastel shops; shades down, wink ----------
  function shop(x, i) {
    const col = [MG.pink, MG.mint, MG.lilac, MG.sky, '#FFD2B8'][i % 5], h = 380 + hash(i + 2) * 120, top = 790 - h;
    paint(rectPts(x, top, 330, h), { wash: col, fill: mixCol(col, INK, .25), fillOp: 40, tex: .5, ink: INK, sw: 1 });
    for (let k = 0; k < 6; k++) paint([[x + k * 55, top + 40], [x + k * 55 + 55, top + 40], [x + k * 55 + 55, top + 100], [x + k * 55 + 27, top + 125], [x + k * 55, top + 100]], { wash: k % 2 ? MG.cream : MG.hot, ink: INK, sw: .5 });
    paint(rrPts(x + 30, top + 160, 170, 150, 10), { wash: '#E9F6FF', ink: INK, sw: .8 });
    paint([heartPts, (a, b, r) => starPts(a, b, r, .45, 5), (a, b, r) => ellPts(a, b, r, r, 12)][i % 3](x + 115, top + 240, 34), { wash: [MG.hot, MG.gold, MG.lilacDk][i % 3], ink: INK, sw: .6 });
    paint(rrPts(x + 230, top + 180, 70, h - 180, 30), { wash: mixCol(col, INK, .35), ink: INK, sw: .8 });
  }
  function roller(t, lt) {
    pastelBg(t, { a: '#FDE1EC', seed: 9 });
    const tw = B(141), wk = seg(t, tw - .3, tw), age = t - tw;
    const z = kf(t, [[tw - .35, 1], [tw, 1.35]], backOut) , fx = 930, fy = 880;
    camBegin(lerp(960, fx, seg(t, tw - .35, tw)), lerp(540, 640, seg(t, tw - .35, tw)) + Math.sin(t * 3) * 6, z + lt * .02);
    const off = t * 900;
    for (let i = -2; i < 9; i++) { const k = i + Math.floor(off / 360); shop(k * 360 - off - 200, ((k % 50) + 50)); }
    paint(rectPts(-400, 790, W + 800, 500), { wash: '#F3D9E6', ink: INK, sw: 1 });
    for (let i = 0; i < 12; i++) { const x = ((i * 260 - t * 1400) % (W + 520) + W + 520) % (W + 520) - 300; inkLine([[x, 820], [x - 90, 1040]], 1.2, '#D9B3C6', 'ink', 0); }
    camEnd();
    hLines(t, 12, MG.cream, 140, 3000);
    camBegin(lerp(960, fx, seg(t, tw - .35, tw)), lerp(540, 640, seg(t, tw - .35, tw)) + Math.sin(t * 3) * 6, z + lt * .02);
    const push_ = Math.sin(bpOf(t) * Math.PI);
    sailorClawd(fx, fy, 30, {
      rot: -.1 + push_ * .04, dy: -Math.abs(push_) * .4, aL: .2 + .6 * push_, aR: .2 - .6 * push_, mouth: wk >= 1 ? 'cat' : 'smile',
      eyes: wk > .3 ? 'wink' : 'normal', blush: wk > .3,
      draw: (u, sw) => { skates(u, sw); shadesAt(easeOut(wk) * 2.2)(u, sw); }
    });
    if (age > 0) { sparkleBurst(fx - 6 * 30, fy - 9 * 30, age, 8, 90); sparkle(fx - 6.5 * 30, fy - 9.5 * 30, 50, seg(age, 0, .6), MG.cream); }
    camEnd();
    if (age > 0 && age < .25) flash(.35 * (1 - age / .25), MG.cream);
  }

  // ---------- 71.233 whatever: shrug; rivals can't lift the dumbbell; she floats it away ----------
  function whatever(t, lt) {
    pastelBg(t, { a: '#F9DDEB', seed: 13 });
    const tf = B(145), fl = t >= tf, age = t - tf;
    const [sx, sy] = shakeXY(t, fl && age < .25 ? 10 : 2 * pulse(t, 6));
    camBegin(960 + sx + lt * 15, 540 + sy, 1.03 + lt * .02);
    paint(rectPts(-200, 860, W + 400, 400), { wash: '#F2C9DC', fill: MG.pink, fillOp: 40, tex: .4, ink: INK, sw: .8 });
    const lift = fl ? easeIn(seg(age, 0, .5)) * 700 + easeOut(seg(age, 0, .15)) * 60 : 18 * pulse(t, 5) + Math.sin(t * 40) * 3;
    const by = 650 - lift, dbX = 525;
    if (fl) for (let k = 0; k < 6; k++) sparkle(dbX + (hash(k) - .5) * 400, by + 60 + hash(k + 3) * 120, 22, frac(t * 2 + k / 6), MG.goldLt);
    if (fl) { inkLine([[dbX, by - 70], [dbX + 20, by - 160], [dbX - 10, by - 260]], 2, MG.hot, 'ink', .6); paint(heartPts(dbX - 10, by - 290, 40), { wash: MG.hot, ink: INK, sw: .8 }); }
    const strain = fl ? 0 : Math.sin(t * 38) * .03;
    for (const [x, fp] of [[380, false], [670, true]]) {
      const fall = fl ? easeOut(seg(age, 0, .3)) : 0;
      clawd(x, 900, 26, {
        col: mixCol(RIV.col, '#F08A8A', fl ? 0 : .15 + .25 * pulse(t, 3)), dk: RIV.dk, lt: RIV.lt, flip: fp,
        eyes: fl ? 'swirl' : 'angry', mouth: fl ? 'O' : 'wobble', sq: fl ? .15 * fall : .12 + strain, rot: (fp ? 1 : -1) * (fl ? -.5 * fall : 0) + strain,
        dy: fl ? .4 * fall : 0, aL: fl ? 1.5 : 1.25 + strain * 3, aR: fl ? 1.5 : 1.25 - strain * 3, emote: fl ? 'swirl' : 'sweat', emoteK: 1
      });
    }
    inkLine([[dbX - 330, by], [dbX + 330, by]], 8, '#8A8FA8', 'ink', 0);
    for (const e of [-1, 1]) paint(ellPts(dbX + e * 320, by, 50, 100, 18), { wash: e < 0 ? MG.hot : MG.lilacDk, fill: INK, fillOp: 30, tex: .5, ink: INK, sw: 1.2 });
    const sh = fl ? 0 : pulse(t, 4);
    sailorClawd(1380, 900, 34, {
      flip: true, dy: -sh * .8, sq: sh * .08, mouth: 'cat', eyes: 'look', lookY: -.5, lookX: .8, blush: false,
      aL: .9 + sh * .5, aR: fl ? kf(age, [[0, 1.4], [.3, .7]]) : .9 + sh * .5, wand: true, emote: fl ? 'spark' : null, emoteK: seg(age, 0, .2)
    });
    if (fl) sparkleBurst(1380 - 7.6 * 34, 900 - 8 * 34, age, 8, 120);
    camEnd();
  }

  // ---------- 73.233 lips birds eating sprinkles out of her giant palm ----------
  function palm(t, lt) {
    pastelBg(t, { a: '#FCE0EC', seed: 17 });
    const z = kf(lt, [[0, 1], [2.5, 1.15]]);
    camBegin(900 + lt * 20, 560, z);
    sailorClawd(1560, 1070, 50, { flip: true, eyes: 'narrow', mouth: 'cat', blush: true, aL: .15, aR: -.4, dy: -Math.abs(Math.sin(bpOf(t) * Math.PI)) * .15, noShadow: true });
    // forearm + giant glove, palm up
    paint([[1360, 870], [1120, 760], [1070, 860], [1320, 950]], { wash: PAL.clay, fill: PAL.clayDk, fillOp: 50, ink: INK, sw: 1.2 });
    paint(rrPts(1040, 720, 150, 170, 40), { wash: MG.glove, ink: INK, sw: 1.2 });
    inkLine([[1060, 740], [1060, 870]], 6, MG.pink, 'ink', 0);
    for (let i = 0; i < 4; i++) {
      const fy = 770 + i * 34, len = 250 - Math.abs(i - 1.2) * 30;
      push(); translate(520, fy); rotate(.25 - i * .08);
      paint(rrPts(-len, -22, len + 40, 44, 22), { wash: MG.glove, fill: '#E9DFF0', fillOp: 60, ink: INK, sw: 1.1 });
      paint(ellPts(-len + 18, -30, 24, 30, 12), { wash: MG.glove, ink: INK, sw: 1 });   // curled fingertip
      pop();
    }
    paint(ellPts(790, 820, 330, 125, 30), { wash: MG.glove, fill: '#E9DFF0', fillOp: 70, tex: .4, ink: INK, sw: 1.3 });
    paint(ellPts(800, 830, 250, 80, 24), { fill: '#EADCF2', fillOp: 90, bleed: .2, ink: null });
    push(); translate(720, 720); rotate(-.9); paint(rrPts(-20, -26, 170, 52, 26), { wash: MG.glove, ink: INK, sw: 1.1 }); pop();
    for (let i = 0; i < 34; i++) {
      const a = hash(i + 30) * TAU, r = Math.sqrt(hash(i + 40)), x = 780 + Math.cos(a) * r * 300, y = 830 + Math.sin(a) * r * 100;
      if ((i * 7 + Math.floor(lt * 4)) % 34 < 2) continue;
      push(); translate(x, y); rotate(hash(i) * TAU); paint(rrPts(-9, -3.5, 18, 7, 3), { wash: [MG.hot, MG.sky, MG.gold, MG.mint, MG.lilac][i % 5], ink: null }); pop();
    }
    for (let i = 0; i < 5; i++) {
      const ph = frac(bpOf(t) * 1 + i * .5), peck = Math.exp(-ph * 7), x = 580 + i * 110 + (i % 2) * 15, y = 790 + (i % 2) * 40 + peck * 14;
      birdLips(x, y, 28, t, { seed: i, rot: -.5 * peck * (i % 2 ? 1 : -1) });
    }
    const fq = seg(t, 74.2, 75.4);
    if (fq > 0 && fq < 1) birdLips(lerp(-80, 700, easeOut(fq)), lerp(300, 600, easeOut(fq)) + Math.sin(t * 9) * 16, 24, t, { fly: true, seed: 9 });
    else if (fq >= 1) birdLips(700, 600 + Math.sin(t * 9) * 16, 24, t, { fly: true, seed: 9 });
    camEnd();
  }

  // ---------- pre-chorus 2, line 1 (75.733): giant juice-box strut, shades slide down to star eyes ----------
  function swagger(t, lt) {
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#FBC4DC', ink: null });
    sunburst(900, 480, MG.hot, '#FDE3EE', t * .4, 20, 2400, 150);
    hLines(t, 18, MG.cream, 190, 2600);
    const ts = B(154), sd = seg(t, ts - .15, ts + .05), age = t - ts;
    const z = 1.02 + (age > 0 ? .12 * backOut(age * 4) : 0);
    camBegin(900, 620 + Math.sin(t * 2) * 8, z);
    // the cat struts behind, tiny shades too
    const cs = 20, cx = 430, cbob = Math.abs(Math.sin(bpOf(t) * Math.PI)) * .4 * cs;
    blackCat(cx, 900, cs, t, { flip: true, eyes: 'happy' });
    paint(rrPts(cx + 1.9 * cs - 1.3 * cs, 900 - cbob - 3.85 * cs, 2.6 * cs, .7 * cs, .3 * cs), { wash: '#2B2244', ink: INK, sw: .6 });
    const mv = move('walk', t * .5 + 30);
    const sip = pulse(t, 4);
    sailorClawd(960, 900, 40, {
      walk: mv.walk, dy: mv.dy, aL: .3 + .3 * Math.sin(bpOf(t) * Math.PI * .5), aR: .15,
      eyes: sd > .5 ? 'spark' : 'normal', mouth: sip > .5 ? 'o' : 'cat', blush: true, sq: sip * .05,
      draw: sd < 1 ? shadesAt(easeIn(sd) * 7) : null
    });
    { const jx = 960 + 7 * 40, jy = 900 - 4.2 * 40 - mv.dy * -40 + sip * 10;
      inkLine([[jx - 10, jy - 150], [jx - 30, jy - 230], [jx - 150, jy - 250], [960 + 1.4 * 40, 900 - 4.4 * 40 + mv.dy * 40]], 9, MG.pink, 'marker', .3);
      paint(rrPts(jx - 90, jy - 160, 180, 220, 14), { wash: MG.mint, fill: '#4FAF8F', fillOp: 60, tex: .5, ink: INK, sw: 1.4 });
      paint(rectPts(jx - 90, jy - 160, 180, 40), { wash: MG.cream, ink: INK, sw: 1 });
      paint(heartPts(jx, jy - 30, 50 * (1 + sip * .15)), { wash: MG.hot, ink: INK, sw: 1 }); }
    for (let k = 0; k < 4; k++) { const f = frac(bpOf(t) + k * .25); paint(heartPts(960 + 7.2 * 40 + Math.sin(f * 7 + k) * 30, 900 - 13 * 40 - f * 200, 12 + 8 * (1 - f)), { wash: k % 2 ? MG.hot : MG.cream, washOp: 255 * (1 - f), ink: INK, sw: .4 }); }
    if (age > 0) sparkleBurst(960, 900 - 6 * 40, age, 10, 260);
    camEnd();
  }

  // ---------- line 2 (77.733): lips in shades copy her poses one beat late; she turns, shades drop ----------
  const POSES = [
    { aL: 1.4, aR: -.2, rot: .1, dy: 0 }, { aL: -.2, aR: 1.5, rot: -.1, dy: 0 },
    { aL: 1.3, aR: 1.3, rot: 0, dy: -1 }, { aL: .5, aR: .5, rot: 0, dy: 0 }
  ];
  function copycats(t, lt) {
    pastelBg(t, { a: '#FAD0E3', b: MG.pink, seed: 21 });
    sunburst(1350, 560, MG.lilac, '#FDE3EE', -t * .3, 16, 2400, 90);
    const n0 = 155, bi = clamp(beatN(t) - n0, 0, 3), bf = frac(bpOf(t)), turn = t >= B(n0 + 3), age = t - B(n0 + 3);
    const [sx, sy] = shakeXY(t, 5 * pulse(t, 6));
    camBegin(900 + sx + lt * 20, 540 + sy, 1.02 + lt * .03);
    paint(rectPts(-200, 880, W + 400, 400), { wash: '#F7C8DC', ink: INK, sw: .8 });
    const P = POSES[bi], pk = backOut(bf * 5);
    sailorClawd(1420, 900, 36, {
      aL: lerp(.2, P.aL, pk), aR: lerp(.2, P.aR, pk), rot: P.rot * pk, dy: P.dy * pk, wand: bi === 1 || bi === 2,
      flip: turn, eyes: turn ? 'narrow' : bi === 0 ? 'wink' : 'happy', mouth: turn ? 'flat' : 'smile', blush: !turn,
      sq: pulse(t, 6) * .08
    });
    for (let i = 0; i < 4; i++) {
      const x = 170 + i * 290, y = 600 + (i % 2) * 70, lag = bi - 1, Q = lag >= 0 ? POSES[lag] : { aL: 0, aR: 0, rot: 0, dy: 0 };
      const qk = lag >= 0 ? backOut(bf * 4 - i * .15) : 0;
      if (turn) {
        copyLips(x, y, 64, t, { seed: i, talk: .1, aL: .3, aR: .3, rot: Math.sin(t * 40 + i) * .03, shadesFall: seg(age, i * .05, .6), dy: 0 });
        emote('sweat', x + 120, y - 100, 30, seg(age, .05, .25));
      } else copyLips(x, y, 64, t, { seed: i, aL: Q.aL * qk, aR: Q.aR * qk, rot: -Q.rot * 2 * qk, dy: Q.dy * 60 * qk });
    }
    camEnd();
  }

  // ---------- line 3 (79.733): the plotters' map bursts into sparkly flames ----------
  function flame(x, y, h, t, i, col) {
    const w = h * .35, fl = Math.sin(t * 18 + i * 2) * w * .3;
    paint([[x - w, y], [x - w * .7, y - h * .45], [x + fl, y - h], [x + w * .7, y - h * .4], [x + w, y]], { wash: col, fill: MG.goldLt, fillOp: 90, tex: .3, ink: INK, sw: .6, curv: .6 });
  }
  function mapfire(t, lt) {
    const tw = B(160), tf = B(161), fire = t >= tf, age = t - tf;
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#3B2A6E', fill: MG.navy, fillOp: 80, bleed: .1, tex: .5, ink: null });
    const [sx, sy] = shakeXY(t, fire ? 9 : 0);
    camBegin(960 + sx, 560 + sy - lt * 30, 1.02 + lt * .06);
    paint([[860, -40], [1060, -40], [1500, 900], [420, 900]], { fill: MG.goldLt, fillOp: 50, bleed: .25, tex: .3, ink: null });
    inkLine([[960, -40], [960, 140]], 3, INK, 'ink', 0);
    paint([[880, 200], [1040, 200], [1000, 140], [920, 140]], { wash: MG.lilacDk, ink: INK, sw: 1 });
    if (fire) paint(ellPts(960, 760, 900 * easeOut(age * 2), 420 * easeOut(age * 2), 30), { fill: MG.hot, fillOp: 90, bleed: .3, tex: .3, ink: null });
    const riv = [[560, 790], [960, 750], [1360, 790]];
    riv.forEach(([x, y], i) => {
      const jump = fire ? -2.2 * Math.sin(clamp(age / .35) * Math.PI) : 0;
      clawd(x, y, 26, {
        ...RIV, eyes: fire ? 'scared' : 'narrow', mouth: fire ? 'O' : 'grin', dy: jump - (fire ? 0 : pulse(t, 6) * .3), noShadow: true,
        aL: fire ? 1.4 : .1 + (i === 1 ? .5 * Math.sin(t * 10) : 0), aR: fire ? 1.4 : .1, emote: fire ? '!!' : null, emoteK: seg(age, 0, .2), seed: i
      });
    });
    // table + map
    paint([[300, 760], [1620, 760], [1820, 1100], [100, 1100]], { wash: '#7A4E8E', fill: MG.navy, fillOp: 50, tex: .5, ink: INK, sw: 1.2 });
    const map = [[620, 780], [1300, 780], [1370, 930], [550, 930]];
    paint(map, { wash: fire ? mixCol('#F4E2BE', '#FFB0D0', seg(age, 0, .4)) : '#F4E2BE', fill: '#C9A46A', fillOp: 60, tex: .6, ink: INK, sw: 1 });
    inkLine([[640, 850], [760, 820], [880, 880], [1000, 830], [1100, 900], [1330, 860]], 2.4, MG.sky, 'ink', .6);
    const ak = seg(t, B(159), B(159) + .45);
    if (ak > 0) {
      for (const [a, b] of [[[680, 900], [920, 845]], [[1290, 905], [1010, 850]]]) {
        const e = [lerp(a[0], b[0], ak), lerp(a[1], b[1], ak)];
        inkLine([a, e], 3, MG.red, 'ink', 0);
        if (ak >= 1) { const d = Math.atan2(b[1] - a[1], b[0] - a[0]); for (const s of [-1, 1]) inkLine([b, [b[0] - Math.cos(d + s * .5) * 26, b[1] - Math.sin(d + s * .5) * 26]], 3, MG.red, 'ink', 0); }
      }
    }
    // her polaroid in the middle
    paint([[900, 800], [1030, 800], [1040, 900], [890, 900]], { wash: MG.cream, ink: INK, sw: 1 });
    paint([[910, 810], [1020, 810], [1026, 872], [904, 872]], { wash: MG.pink, ink: null });
    sailorClawd(965, 868, 5.5, { noShadow: true, eyes: t >= tw && t < tw + .35 ? 'wink' : 'happy', mouth: 'smile' });
    sparkle(1010, 815, 30, seg(t, tw, tw + .4), MG.cream);
    if (fire) {
      const sp = easeOut(seg(age, 0, .4));
      for (let i = 0; i < 11; i++) {
        const fx = 965 + (i - 5) * 70 * sp, h = (130 + 80 * hash(i + 1)) * sp * (1 - Math.abs(i - 5) * .06) * (1 + .15 * Math.sin(t * 14 + i));
        if (h > 8) flame(fx, 880 + Math.abs(i - 5) * 6, h, t, i, i % 2 ? MG.hot : MG.gold);
      }
      for (let k = 0; k < 10; k++) { const f = frac(t * 1.4 + k / 10); sparkle(965 + (hash(k + 3) - .5) * 700 * sp, 850 - f * 450, 18, f, [MG.goldLt, MG.cream, MG.pink][k % 3]); }
      sfx('FWOOSH!', 960, 330, 120, MG.goldLt, age, { life: .6, rot: -.08 });
    }
    camEnd();
    if (fire && age < .2) flash(.5 * (1 - age / .2), MG.goldLt);
  }

  // ---------- line 4 (81.233): the thrown shade lands as a blueprint... of the cat ----------
  function catBlueprint(cx, cy, s, k) {
    const c = MG.cream, lw = 2.2 * k;
    if (k < .05) return;
    paint(ellPts(cx + 30 * s, cy + 40 * s, 150 * s, 95 * s, 26), { ink: c, sw: lw });
    paint(ellPts(cx - 120 * s, cy - 60 * s, 85 * s, 72 * s, 22), { ink: c, sw: lw });
    for (const e of [-1, 1]) paint([[cx - 120 * s + e * 70 * s, cy - 100 * s], [cx - 120 * s + e * 62 * s, cy - 175 * s], [cx - 120 * s + e * 10 * s, cy - 130 * s]], { ink: c, sw: lw });
    inkLine([[cx + 175 * s, cy + 60 * s], [cx + 250 * s, cy - 10 * s], [cx + 230 * s, cy - 110 * s], [cx + 180 * s, cy - 120 * s]], lw, c, 'ink', .6);
    crescent(cx - 120 * s, cy - 100 * s, 18 * s, -Math.PI / 2, c, { ink: null });
    // dimension lines
    inkLine([[cx - 200 * s, cy + 170 * s], [cx + 260 * s, cy + 170 * s]], 1.2 * k, c, 'inkfine', 0);
    inkLine([[cx + 300 * s, cy - 180 * s], [cx + 300 * s, cy + 140 * s]], 1.2 * k, c, 'inkfine', 0);
    for (const [x, y] of [[cx - 200 * s, cy + 170 * s], [cx + 260 * s, cy + 170 * s]]) inkLine([[x, y - 14], [x, y + 14]], 1.2 * k, c, 'inkfine', 0);
    for (const [x, y] of [[cx + 300 * s, cy - 180 * s], [cx + 300 * s, cy + 140 * s]]) inkLine([[x - 14, y], [x + 14, y]], 1.2 * k, c, 'inkfine', 0);
    paint(ellPts(cx - 145 * s, cy - 60 * s, 34 * s, 34 * s, 14), { ink: c, sw: 1 * k });
    inkLine([[cx - 179 * s, cy - 60 * s], [cx - 260 * s, cy - 150 * s]], 1 * k, c, 'inkfine', 0);
  }
  function blueprint(t, lt) {
    const tl = B(163), tk = B(164), th = B(165), landed = t >= tl, age = t - tl;
    pastelBg(t, { a: '#FBD8E8', seed: 25 });
    camBegin(960 + lt * 20, 540 - lt * 10, 1 + lt * .05 + (landed ? .05 * Math.exp(-age * 6) : 0));
    paint(rectPts(-200, 880, W + 400, 400), { wash: '#F7C8DC', ink: INK, sw: .8 });
    if (!landed) {
      const q = seg(t, 81.233, tl), x = lerp(2100, 1020, easeIn(q)), y = lerp(80, 420, easeIn(q)), r = lerp(90, 300, q);
      paint(ellPts(x, y, r, r * .75, 18, r * .06, t * 8), { wash: '#2B2244', washOp: 230, fill: MG.navy, fillOp: 100, bleed: .2, tex: .4, ink: null });
      for (let k = 0; k < 5; k++) inkLine([[x + 60 + k * 40, y - 60 + k * 30], [x + 320 + k * 60, y - 140 + k * 30]], 3, MG.lilac, 'ink', 0);
    } else {
      const k = easeOut(seg(age, 0, .25));
      paint(rrPts(1020 - 460 * k, 420 - 290 * k, 920 * k, 580 * k, 16), { wash: '#2F5FB8', fill: MG.blueDk, fillOp: 70, tex: .5, ink: INK, sw: 1.4 });
      if (k > .9) {
        for (let i = 1; i < 9; i++) inkLine([[560 + i * 102, 136], [560 + i * 102, 704]], .6, '#6F95D8', 'inkfine', 0);
        for (let i = 1; i < 6; i++) inkLine([[566, 130 + i * 97], [1474, 130 + i * 97]], .6, '#6F95D8', 'inkfine', 0);
      }
      catBlueprint(1060, 430, 1, seg(age, .1, .4));
    }
    // her posing, then the double take, then a laugh
    const pose = !landed ? {} : { aR: 1.4, aL: .2, wand: true };
    sailorClawd(560, 910, 30, {
      ...pose, ...mood(t, [[81.233, 'happy'], [tk, 'look', '!?'], [th, 'happy', 'heart']]), lookX: 1, lookY: -.6,
      mouth: t >= tk && t < th ? 'O' : 'smile', blush: true, dy: -pulse(t, 5) * .5, rot: t >= th ? Math.sin(t * 20) * .05 : 0
    });
    // the cat pops in and strikes the blueprint's pose
    const cp = backOut(seg(t, tk, tk + .3));
    if (cp > .02) {
      push(); translate(1450, 910); scale(cp); translate(-1450, -910);
      blackCat(1450, 910, 46, t, { sit: true, eyes: t >= th ? 'happy' : 'normal' });
      pop();
      sparkleBurst(1360, 740, t - tk, 8, 200);
    }
    camEnd();
    if (landed && age < .2) flash(.45 * (1 - age / .2), MG.cream);
  }

  // ---------- 83.233 pump it up: the cat pumps the wand, zoom punches ----------
  function pump(t, lt) {
    const bi = clamp(beatN(t) - 166, 0, 2), pk = pulse(t, 5);
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#FBC4DC', ink: null });
    sunburst(960, 560, MG.hot, MG.goldLt, t * .8, 22, 2400, 170);
    speedLines(960, 560, t, 30, MG.cream, 200, 380 - bi * 60);
    const z = 1 + bi * .16 + pk * .1, [sx, sy] = shakeXY(t, 10 * pk);
    camBegin(930 + sx, 620 + sy, z);
    const s = 75, cx = 1040, cy = 900;
    sailorClawd(1560, 900, 24, { ...move('roof', t), eyes: 'happy', mouth: 'grin', blush: true });
    sailorClawd(380, 900, 24, { ...move('roof', t), eyes: 'happy', mouth: 'grin', blush: true, flip: true, skirt: MG.pinkDk });
    blackCat(cx, cy, s, t, { sit: true, eyes: pk > .4 ? 'wide' : 'happy' });
    const up = pk * 130;
    push(); translate(cx - 3.9 * s, cy - 1.9 * s - up); rotate(-.75 - pk * .3);
    moonWand(46, 2);
    pop();
    paint(ellPts(cx - 3.9 * s, cy - 1.9 * s - up, 44, 40, 12), { wash: '#2A2238', ink: INK, sw: 1 });
    sparkleBurst(cx - 3.9 * s - 70, cy - 1.9 * s - up - 250, frac(bpOf(t)) * BEAT, 10, 200);
    sfx('POP!', 1400, 330, 140 + bi * 20, MG.goldLt, frac(bpOf(t)) * BEAT, { life: .45, rot: .1 });
    camEnd();
    flash(seg(t, 84.05, 84.25) * .6, MG.cream);
  }

  chapter('verse2', 59.45, 84.25, [
    [59.45, drama], [B(122), hairflip], [B(126), monitor], [B(130), rentfree], [B(134), flight], [B(138), roller],
    [B(142), whatever], [B(146), palm], [B(151), swagger], [B(155), copycats], [B(159), mapfire], [B(162), blueprint], [B(166), pump]
  ]);
})();
