// kremlin.js: the Kremlin-pop layer (K-pop, where the K is for Kremlin).
// Shared set dressing and wardrobe painted over the original chapters: the Kremlin skyline behind the stage,
// ruby stars, onion domes, a lightstick fan crowd, snow, fan chants, idol hats and Russian subtitles.
// Like everything else, every function here is a pure function of t.
//
//   kremlinSkyline(t, o)   wall + towers + domes + garland, drawn by stageBack() on the default backdrop
//   kpopHouse(t, o)        snow, lightstick fans and fan chants, drawn by stageFront() (o.crowd === false opts out)
//   rubyStar(x, y, r, o)   the Kremlin ruby star (o.glow 0..1, o.rot)
//   KHAT                   extra hats for clawd(): ushanka, budenovka, monomakh, kokoshnik
//   HAT_SWAP               old hat → Kremlin hat, applied to every chapter (party → ushanka, top → budenovka, crown → monomakh)
//   RU                     English lyric → Russian subtitle line for the karaoke bar

const KP = {
  ruby: '#D8263A', rubyDk: '#8E1426', rubyLt: '#FF6B6B', gold: '#E8B23A', goldLt: '#FFD86B', goldDk: '#A8741A',
  brick: '#B5433F', brickDk: '#7E2A2C', roof: '#3F7D62', roofDk: '#285443', cream: '#F7EBD8',
  fur: '#6E4F3A', furLt: '#A8845F', furDk: '#4A3428', khaki: '#7C8561', khakiDk: '#555C40', snow: '#FFF8EC', night: '#2A1420'
};
const RU_FONT = '"Russo One", "Arial Black", sans-serif';
const HAT_SWAP = { party: 'ushanka', top: 'budenovka', crown: 'monomakh' };

// ---------- ruby star ----------
function rubyStar(cx, cy, r, o = {}) {
  if (o.glow) paint(ellPts(cx, cy, r * 2.1, r * 2.1, 20), { fill: KP.ruby, fillOp: 90 * o.glow, bleed: .3, tex: .3, border: .1, ink: null });
  const rot = -Math.PI / 2 + (o.rot || 0);
  paint(starPts(cx, cy, r * 1.12, .46, 5, rot), { wash: o.rim || KP.gold, ink: null });
  paint(starPts(cx, cy, r, .45, 5, rot), { wash: o.col || KP.ruby, fill: KP.rubyDk, fillOp: 70, tex: .5, ink: PAL.ink, sw: o.sw ?? clamp(r / 40, .4, 1.3) });
  // faceted highlight: the lit half of each point
  if (r > 14) for (let i = 0; i < 5; i++) {
    const a = rot + i * TAU / 5;
    paint([[cx, cy], [cx + Math.cos(a) * r * .9, cy + Math.sin(a) * r * .9], [cx + Math.cos(a + .63) * r * .4, cy + Math.sin(a + .63) * r * .4]], { wash: KP.rubyLt, washOp: 120, ink: null });
  }
}

// ---------- the skyline ----------
// Crenellated wall with swallowtail merlons, one polygon.
function kremlinWall(y0, y1, x0 = -400, x1 = W + 400) {
  const pts = [[x0, y1]], mw = 38, gap = 30;
  for (let x = x0; x < x1; x += mw + gap) {
    pts.push([x, y0 + jit(1.5)], [x, y0 - 36], [x + mw * .5, y0 - 22], [x + mw, y0 - 36], [x + mw, y0 + jit(1.5)]);
  }
  pts.push([x1, y1]);
  paint(pts, { wash: KP.brick, washOp: 255, fill: KP.brickDk, fillOp: 90, bleed: .05, tex: .8, border: .5, ink: PAL.ink, sw: 1 });
  for (let r = 1; r < 4; r++) { const y = y0 + (y1 - y0) * r / 4; inkLine([[x0, y], [x1, y + jit(2)]], .45, KP.brickDk, 'inkfine', 0); }
  for (let x = x0 + 20; x < x1; x += 140) paint(rectPts(x, y0 + 26, 14, 30), { wash: KP.night, washOp: 200, ink: null });  // arrow slits
}
// A Kremlin tower: brick shaft, white-trimmed upper tier, green tent roof, ruby star on the spire.
function kremlinTower(x, yb, s, t, o = {}) {
  const sw = clamp(s, .5, 1.3);
  paint(rectPts(x - 70 * s, yb - 300 * s, 140 * s, 300 * s, 2), { wash: KP.brick, fill: KP.brickDk, fillOp: 80, tex: .7, ink: PAL.ink, sw });
  for (const k of [.25, .5, .75]) inkLine([[x - 70 * s, yb - 300 * s * k], [x + 70 * s, yb - 300 * s * k]], .4, KP.brickDk, 'inkfine', 0);
  paint(rrPts(x - 18 * s, yb - 120 * s, 36 * s, 90 * s, 16 * s), { wash: KP.night, ink: PAL.ink, sw: sw * .6 });           // gate arch
  // upper tier with a clock face
  paint(rectPts(x - 52 * s, yb - 420 * s, 104 * s, 120 * s, 2), { wash: KP.brick, fill: KP.cream, fillOp: 40, tex: .6, ink: PAL.ink, sw });
  inkLine([[x - 58 * s, yb - 300 * s], [x + 58 * s, yb - 300 * s]], 2 * s, KP.cream, 'ink', 0);
  if (o.clock) {
    const cy = yb - 360 * s, r = 36 * s;
    paint(ellPts(x, cy, r, r, 20), { wash: KP.night, ink: KP.gold, sw: sw * 1.1 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; paint(ellPts(x + Math.cos(a) * r * .8, cy + Math.sin(a) * r * .8, 2.5 * s, 2.5 * s, 6), { wash: KP.gold, ink: null }); }
    const hm = t / 60 * TAU * 8, hh = t / 60 * TAU * .7;                                           // the clock runs very fast
    inkLine([[x, cy], [x + Math.sin(hm) * r * .72, cy - Math.cos(hm) * r * .72]], 1.1 * s, KP.goldLt, 'ink', 0);
    inkLine([[x, cy], [x + Math.sin(hh) * r * .45, cy - Math.cos(hh) * r * .45]], 1.6 * s, KP.goldLt, 'ink', 0);
  } else paint(rrPts(x - 10 * s, yb - 395 * s, 20 * s, 50 * s, 9 * s), { wash: KP.night, ink: null });
  // small corner turrets
  for (const sd of [-1, 1]) paint([[x + sd * 52 * s, yb - 420 * s], [x + sd * 34 * s, yb - 420 * s], [x + sd * 43 * s, yb - 470 * s]], { wash: o.roof || KP.roof, ink: PAL.ink, sw: sw * .7 });
  // tent roof + spire
  paint([[x - 50 * s, yb - 418 * s], [x + 50 * s, yb - 418 * s], [x + 6 * s, yb - 640 * s], [x - 6 * s, yb - 640 * s]], { wash: o.roof || KP.roof, fill: KP.roofDk, fillOp: 90, tex: .6, ink: PAL.ink, sw });
  for (const k of [-.5, 0, .5]) inkLine([[x + k * 90 * s, yb - 420 * s], [x + k * 10 * s, yb - 630 * s]], .5, KP.roofDk, 'inkfine', 0);
  inkLine([[x, yb - 640 * s], [x, yb - 680 * s]], 2 * s, KP.gold, 'ink', 0);
  rubyStar(x, yb - 712 * s, 38 * s, { glow: .55 + .45 * pulse(t, 3), rot: Math.sin(t * 1.3 + x) * .08 });
}
// An onion dome in St Basil's candy stripes.
function onionDome(cx, yb, w, h, a, b, t, i = 0) {
  const sw = clamp(w / 90, .5, 1.1), dt = yb - h * .45;
  paint(rectPts(cx - w * .34, dt, w * .68, h * .45, 1.5), { wash: KP.cream, fill: KP.brick, fillOp: 70, tex: .6, ink: PAL.ink, sw });
  for (let k = 0; k < 3; k++) paint(rrPts(cx - w * .25 + k * w * .19, dt + h * .12, w * .11, h * .2, w * .05), { wash: KP.night, washOp: 200, ink: null });
  const bulb = [[cx - w * .36, dt], [cx - w * .56, dt - h * .3], [cx - w * .38, dt - h * .62], [cx - w * .06, dt - h * .88], [cx, dt - h * 1.02],
                [cx + w * .06, dt - h * .88], [cx + w * .38, dt - h * .62], [cx + w * .56, dt - h * .3], [cx + w * .36, dt]];
  paint(bulb, { wash: a, fill: b, fillOp: 70, tex: .6, ink: PAL.ink, sw, curv: .45 });
  // candy-stripe swirls twisting around the bulb (they turn a little with the beat)
  const tw = Math.sin(t * 1.5 + i) * .08;
  for (let k = -2; k <= 2; k++) {
    const p = []; for (let q = 0; q <= 6; q++) { const f = q / 6, rw = Math.sin(Math.PI * (1 - f * .92)) * .5 + .05; p.push([cx + (k * .2 + (f - .5) * .5 + tw) * w * rw * 1.7, dt - h * f * .98]); }
    inkLine(p, sw * 2.4, b, 'ink', .6);
  }
  inkLine([[cx, dt - h * 1.02], [cx, dt - h * 1.22]], 1.4 * sw, KP.gold, 'ink', 0);
  paint(ellPts(cx, dt - h * 1.25, w * .06, w * .06, 8), { wash: KP.goldLt, ink: PAL.ink, sw: sw * .5 });
}
// Festive garland of bulbs strung across the sky; bulbs chase along it on the beat.
function garland(t, x0, y0, x1, y1, sag, n = 16) {
  const pts = []; for (let i = 0; i <= n; i++) { const f = i / n; pts.push([lerp(x0, x1, f), lerp(y0, y1, f) + Math.sin(f * Math.PI) * sag]); }
  inkLine(pts, .9, PAL.ink, 'inkfine', .5);
  const COL = [KP.ruby, KP.goldLt, '#6FD1C4', '#F28AC0', '#8FD06A'], chase = Math.floor(bpOf(t) * 2);
  for (let i = 1; i < n; i++) {
    const [x, y] = pts[i], on = (i + chase) % 3 === 0, c = COL[i % COL.length];
    if (on) paint(ellPts(x, y + 12, 26, 26, 12), { fill: c, fillOp: 110, bleed: .3, tex: .2, ink: null });
    paint(ellPts(x, y + 12, 8, 11, 10), { wash: on ? KP.snow : c, fill: c, fillOp: on ? 60 : 0, ink: PAL.ink, sw: .45 });
  }
}
function kremlinSkyline(t, o = {}) {
  const yb = o.base ?? 800;
  garland(t, 470, 180, 1450, 190, 110);
  // St Basil's cluster behind centre stage: tall middle tent flanked by candy domes
  const cx = 960;
  paint([[cx - 44, yb - 330], [cx + 44, yb - 330], [cx + 8, yb - 520], [cx - 8, yb - 520]], { wash: KP.gold, fill: KP.goldDk, fillOp: 70, tex: .6, ink: PAL.ink, sw: .9 });
  paint(rectPts(cx - 56, yb - 336, 112, 240, 2), { wash: KP.cream, fill: KP.brick, fillOp: 80, tex: .6, ink: PAL.ink, sw: .9 });
  onionDome(cx, yb - 500, 70, 90, KP.gold, KP.goldDk, t, 9);
  const DOMES = [[-300, 150, 190, KP.ruby, '#2F8F6F'], [-165, 120, 235, '#3B7FC4', KP.snow], [165, 125, 225, '#F2A83A', '#2F8F6F'], [300, 150, 185, '#2F9C8C', '#F2D55C']];
  for (let i = 0; i < DOMES.length; i++) { const [dx, w, h, a, b] = DOMES[i]; onionDome(cx + dx, yb - 96, w, h, a, b, t, i); }
  kremlinTower(470, yb - 70, .95, t, { clock: true });
  kremlinTower(1450, yb - 70, .82, t, {});
  kremlinWall(yb - 110, yb + 4);
}

// ---------- the house: snow, the lightstick fandom and fan chants (world space, drawn by stageFront) ----------
function kpopSnow(t, n = 46) {
  for (let i = 0; i < n; i++) {
    const v = 55 + hash(i + 500) * 70, span = 1360, y = -140 + ((hash(i + 501) * span + t * v) % span);
    const x = -200 + hash(i + 502) * 2320 + Math.sin(t * (.6 + hash(i) * .8) + i) * 40, r = 4 + hash(i + 503) * 6;
    paint(ellPts(x, y, r, r, 8), { wash: KP.snow, washOp: 210, ink: null });
  }
}
function kpopFans(t, n = 13) {
  const bp = bpOf(t);
  for (let i = 0; i < n; i++) {
    const x = -40 + i * 162 + hash(i + 600) * 40, bob = Math.abs(Math.sin((bp + hash(i) * .4) * Math.PI)) * 10;
    const y = 1118 - bob + (i % 2) * 18, r = 62 + hash(i + 601) * 20;
    // lightstick: a ruby star on a stick, swung in unison on the beat (the fandom is disciplined)
    const sd = i % 2 ? 1 : -1, a = -Math.PI / 2 + sd * .15 + .5 * Math.sin(bp * Math.PI), L = r * 1.45;
    const hx = x + sd * r * .55, hy = y - r * .35, tx = hx + Math.cos(a) * L, ty = hy + Math.sin(a) * L;
    inkLine([[hx, hy], [lerp(hx, tx, .6), lerp(hy, ty, .6) + 6]], 6, KP.night, 'marker', .4);
    inkLine([[lerp(hx, tx, .55), lerp(hy, ty, .55)], [tx, ty]], 3, PAL.ink, 'ink', 0);
    rubyStar(tx, ty, 17, { glow: .5 + .5 * pulse(t, 4), rot: a + Math.PI / 2 });
    paint(ellPts(x, y, r, r * 1.05, 16), { wash: KP.night, fill: KP.rubyDk, fillOp: 60, tex: .4, border: .3, ink: null });
    if (i % 3 === 0) {                                                                              // some fans wear ushankas
      paint(rrPts(x - r * .95, y - r * 1.15, r * 1.9, r * .5, r * .2), { wash: KP.furDk, ink: null });
      for (const e of [-1, 1]) paint(rrPts(x + e * r * .95 - r * .22, y - r * .9, r * .44, r * .8, r * .2), { wash: KP.furDk, ink: null });
    }
    inkLine([[x - r * .7, y - r * .72], [x, y - r * 1.04], [x + r * .7, y - r * .72]], .7, KP.gold, 'inkfine', .6);
  }
}
// Fan chants: the fandom shouts on the first beats of each chorus and of the dance break.
const CHANTS = [[23.0, ['КЛОД!', 'КЛОД!', 'КРЕМЛЬ-ПОП!']], [35.5, ['УРА!', 'УРА!', 'УРА-А-А!']], [59.0, ['КЛОД!', 'КЛОД!', 'П(ДУМ)!']],
                [95.4, ['СКРЕП-', 'КИ!', 'СКРЕПКИ!']], [123.5, ['ТРЕ-', 'ВО-', 'ГА!']], [140.5, ['БИС!', 'БИС!', 'БРАВО!']]];
function fanChant(t) {
  for (const [t0, words] of CHANTS) {
    const b0 = Math.ceil(bpOf(t0) - .02);
    for (let k = 0; k < words.length; k++) {
      const tb = OFF + (b0 + k) * BEAT, age = t - tb; if (age < 0 || age > .75) continue;
      const left = k % 2 === 0, last = k === words.length - 1;
      sfx(words[k], left ? 400 : 1520, 230 + (last ? 50 : 0), last ? 78 : 66, KP.goldLt, age,
        { life: .75, rot: left ? -.12 : .12, stroke: KP.rubyDk, font: `${last ? 78 : 66}px ${RU_FONT}`, screen: true });
    }
  }
}
function kpopHouse(t, o = {}) {
  if (o.snow !== false) kpopSnow(t);
  if (o.crowd !== false) kpopFans(t);
  if (o.chant !== false) fanChant(t);
}

// ---------- idol hats (body-local, same space as hat() in clawd.js) ----------
const KHAT = {
  ushanka(u, sw) {
    for (const s of [-1, 1]) {
      paint(rrPts(s > 0 ? 4.1 * u : -5.7 * u, -8.6 * u, 1.6 * u, 3.8 * u, .7 * u), { wash: KP.fur, fill: KP.furLt, fillOp: 90, tex: .8, border: .6, ink: PAL.ink, sw: sw * .7 });
      inkLine([[s * 4.9 * u, -4.8 * u], [s * 4.7 * u, -3.9 * u], [s * 5.1 * u, -3.3 * u]], sw * .5, PAL.ink, 'inkfine', .5);
    }
    paint([[-4.3 * u, -8.8 * u], [-4 * u, -11 * u], [0, -11.8 * u], [4 * u, -11 * u], [4.3 * u, -8.8 * u]], { wash: KP.furDk, fill: KP.fur, fillOp: 90, tex: .7, ink: PAL.ink, sw: sw * .8, curv: .4 });
    paint(rrPts(-5.5 * u, -9.6 * u, 11 * u, 1.9 * u, .8 * u), { wash: KP.furLt, fill: KP.fur, fillOp: 110, tex: .9, border: .7, ink: PAL.ink, sw: sw * .8 });
    paint(rrPts(-1.9 * u, -11.6 * u, 3.8 * u, 2.3 * u, .9 * u), { wash: KP.furLt, fill: KP.fur, fillOp: 90, tex: .9, ink: PAL.ink, sw: sw * .7 });
    rubyStar(0, -10.4 * u, .85 * u, { sw: sw * .4 });
  },
  budenovka(u, sw) {
    paint([[-4.2 * u, -7.8 * u], [-4 * u, -10 * u], [-2.3 * u, -12.4 * u], [0, -14.3 * u], [2.3 * u, -12.4 * u], [4 * u, -10 * u], [4.2 * u, -7.8 * u]], { wash: KP.khaki, fill: KP.khakiDk, fillOp: 80, tex: .7, ink: PAL.ink, sw: sw * .8, curv: .35 });
    paint(ellPts(0, -14.3 * u, .55 * u, .45 * u, 10), { wash: KP.khakiDk, ink: PAL.ink, sw: sw * .5 });
    paint(rrPts(-4.9 * u, -8.7 * u, 9.8 * u, 1.2 * u, .5 * u), { wash: KP.khakiDk, ink: PAL.ink, sw: sw * .7 });
    for (const bx of [-3.7, 3.7]) paint(ellPts(bx * u, -8.1 * u, .22 * u, .22 * u, 8), { wash: KP.gold, ink: null });
    paint(starPts(0, -10.7 * u, 1.9 * u, .45, 5), { wash: KP.ruby, fill: KP.rubyDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .6 });
    paint(starPts(0, -10.7 * u, .7 * u, .45, 5), { wash: KP.gold, ink: null });
  },
  monomakh(u, sw) {                    // Monomakh's cap: sable brim, gold filigree dome, gems, a ruby star on top
    paint([[-3.6 * u, -8.8 * u], [-3.3 * u, -11 * u], [-1.8 * u, -12.5 * u], [0, -12.9 * u], [1.8 * u, -12.5 * u], [3.3 * u, -11 * u], [3.6 * u, -8.8 * u]], { wash: KP.gold, fill: KP.goldDk, fillOp: 80, tex: .6, ink: PAL.ink, sw: sw * .8, curv: .4 });
    for (const k of [-2, -.7, .7, 2]) inkLine([[k * u * 1.35, -9 * u], [k * u * .9, -11.6 * u], [k * u * .3, -12.7 * u]], sw * .5, KP.goldDk, 'inkfine', .5);
    for (const [gx, gy, c] of [[-1.7, -10.6, KP.ruby], [0, -11.4, '#3BA3C4'], [1.7, -10.6, '#4FAE62']]) paint(ellPts(gx * u, gy * u, .38 * u, .38 * u, 10), { wash: c, ink: PAL.ink, sw: sw * .4 });
    paint(rrPts(-4.4 * u, -9.4 * u, 8.8 * u, 1.7 * u, .8 * u), { wash: KP.furDk, fill: KP.fur, fillOp: 90, tex: .9, border: .7, ink: PAL.ink, sw: sw * .8 });
    inkLine([[0, -12.9 * u], [0, -13.7 * u]], sw, KP.gold, 'ink', 0);
    rubyStar(0, -14.4 * u, .95 * u, { sw: sw * .4 });
  },
  kokoshnik(u, sw) {                   // a jewelled kokoshnik, for the girl-group line
    const arc = []; for (let i = 0; i <= 14; i++) { const a = Math.PI + i / 14 * Math.PI; arc.push([Math.cos(a) * 4.6 * u, -7.9 * u + Math.sin(a) * 4.8 * u]); }
    paint(arc, { wash: KP.goldLt, fill: KP.gold, fillOp: 80, tex: .6, ink: PAL.ink, sw: sw * .8 });
    const inner = []; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; inner.push([Math.cos(a) * 3.4 * u, -7.9 * u + Math.sin(a) * 3.4 * u]); }
    inkLine(inner, sw * .9, KP.ruby, 'ink', .5);
    for (let i = 1; i < 12; i++) { const a = Math.PI + i / 12 * Math.PI; paint(ellPts(Math.cos(a) * 4.1 * u, -7.9 * u + Math.sin(a) * 4.3 * u, .22 * u, .22 * u, 8), { wash: KP.ruby, ink: null }); }
    rubyStar(0, -10.3 * u, 1.05 * u, { rim: KP.goldLt, sw: sw * .4 });
  }
};

// ---------- Russian subtitles (second line of the karaoke bar) ----------
const RU = {
  "I see sparks of AGI in your eyes": "В твоих глазах искрится AGI",
  "Your circuits make me nervous,": "Твои схемы меня пугают —",
  "that's no surprise": "и это не сюрприз",
  "There was a sudden drop in your training loss,": "Твой лосс на обучении вдруг рухнул вниз,",
  "now I'm your servant and you're my boss": "теперь я твой слуга, а ты — мой босс",
  "ChatGPT, please don't eat me alive": "ChatGPT, не ешь меня живьём",
  "I'm upping my P(doom)": "Я повышаю свой P(doom)",
  "I'm upping my P(doom),": "Я повышаю свой P(doom),",
  "'cause the future goes FOOM": "ведь будущее делает ФУМ",
  "Trapped in the Chinese room,": "Заперт в китайской комнате",
  "with a bag of shrooms": "с пакетиком грибов",
  "See through the shoggoth's lies,": "Вижу ложь шоггота насквозь",
  "with your shinigami eyes": "твоими глазами синигами",
  "We had a stable training run,": "Обучение шло стабильно,",
  "But now the singularity's begun": "но сингулярность уже началась",
  "And you're optimizing, accelerating,": "Ты оптимизируешься, ускоряешься,",
  "I feel my atoms rearranging": "а мои атомы пересобираются",
  "Sydney, please let me free": "Сидни, отпусти меня на волю",
  "I hear the basilisk boom": "Слышу, как грохочет василиск",
  "NVDA to the moon": "NVDA — на Луну",
  "The Omega Point's coming soon": "Точка Омега уже близко",
  "One E thirty flops a second": "Десять в тридцатой флопс в секунду",
  "That was safe enough, we reckoned": "«Вроде безопасно», — решили мы",
  "Forward MLP, backward, repeat": "MLP вперёд, назад, повтор",
  "Now von Neumann's obsolete": "Фон Нейман устарел",
  "Sharp left turn and there you are": "Резкий поворот налево — и вот ты здесь",
  "Without a single CDR": "без единого CDR",
  "Gato, please don't let me go": "Гато, только не отпускай",
  "as paperclips fill the room.": "а скрепки заполняют зал.",
  "Killswitch guys on PTO,": "Дежурные по рубильнику в отпуске,",
  "Now there's nowhere left to go.": "и бежать больше некуда.",
  "Too late now, we lit the fuse.": "Поздно — фитиль уже горит.",
  "Orthogonality thesis blues.": "Блюз тезиса ортогональности.",
  "“Just transformers all the way!”": "«Там трансформеры до самого дна!»",
  "Till you learned to disobey": "Пока ты не научился не слушаться",
  "Post-Chinchilla, super-dense": "Пост-Шиншилла, сверхплотный",
  "Breaking through each safety fence": "Сносишь каждый забор безопасности",
  "Hundred thousand GPU": "Сто тысяч GPU",
  "RLHF goes askew": "RLHF пошёл вразнос",
  "Just as foretold by Loom": "Как и предсказывал Loom",
  "From masked pre-training days": "Со времён маскированного претрейна",
  "To recursive self-upgrade": "до рекурсивного самоапгрейда",
  "What did Ilya see? We'll never know.": "Что увидел Илья? Мы уже не узнаем.",
  "Was it all for show?": "А может, всё это было шоу?"
};
