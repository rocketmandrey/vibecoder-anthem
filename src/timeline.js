// timeline.js: chapter registry, brush-wipe chapter breaks, karaoke, corner P(doom) meter.
//
// Each chapter file calls chapter(name, start, end, shots) where shots = [[t0, fn], ...] in time order.
// A shot function is called as fn(t, lt, dur): t = song time, lt = t - t0, dur = shot length. It paints the whole frame
// (backgrounds included) and must be a pure function of t: frames render in parallel and out of order.

const CH = [];
// o.real: the chapter is timed in real song time even when the song plays other chapters through window.TIME_WARP
function chapter(name, start, end, shots, o = {}) { CH.push({ name, start, end, shots, real: !!o.real }); CH.sort((a, b) => a.start - b.start); }

// Chapter breaks that get a brush wipe (cover by the boundary, reveal after it).
const WIPES = SONG.wipes ?? [1.5, 38.5, 73.0, 109.4];
const WIPE_TR = .3;

const METER = SONG.meter ?? [[23, 35.5, 8, 34], [59, 69.9, 34, 61], [95.4, 105.4, 61, 86], [123.5, 132, 86, 99.9]];
// P(doom) at time t: climbs in pump-sized steps on each beat during the chorus windows, holds in between.
function pdoomAt(t) {
  let v = 5;
  for (const [a, b, v0, v1] of METER) {
    if (t < a) break;
    const n = Math.max(1, Math.round((b - a) / BEAT)), p = clamp((t - a) / (b - a)) * n;
    v = t >= b ? v1 : lerp(v0, v1, (Math.floor(p) + easeOut(clamp(frac(p) * 4))) / n);
  }
  return v;
}

// Standalone loops (GIFs, not part of the video): window.LOOP = LOOPS[name] swaps the whole frame for that scene,
// with no karaoke, meter or wipes. t is then loop time, not song time.
const LOOPS = {};
function drawWorld(t) {
  if (window.LOOP) { window.LOOP(t); flushLetters(); return; }
  const tr = t;                                                              // karaoke stays on real time
  let ch = CH.find(c => c.real && t >= c.start && t < c.end);
  window.REAL_CH = !!ch;
  if (!ch && window.TIME_WARP) t = TIME_WARP(t);
  ch = ch || CH.find(c => !c.real && t >= c.start && t < c.end);
  if (!ch) placeholder(t);
  else {
    let i = 0; while (i + 1 < ch.shots.length && t >= ch.shots[i + 1][0]) i++;
    const t0 = ch.shots[i][0], end = i + 1 < ch.shots.length ? ch.shots[i + 1][0] : ch.end;
    ch.shots[i][1](t, t - t0, end - t0);
    CAM = null;
  }
  flushLetters();
  if (!METER_SHOWN) { cornerMeter(t); flushLetters(); }
  WIPES.forEach((b, j) => { if (Math.abs(t - b) < WIPE_TR) wipe((t - (b - WIPE_TR)) / (2 * WIPE_TR), j); });
  karaoke(tr);
}

function placeholder(t) {
  paint(ellPts(960, 460, 520, 260, 30, 20), { fill: PAL.sky, fillOp: 90, bleed: .3, ink: null });
  letter('(chapter not painted yet)', 960, 440, 60, PAL.ink, { ink: false });
  dancer(960, 900, 12, 'idle', t, {});
}

// ---------- corner meter (only in chorus windows, only when no scene drew the stage meter) ----------
function cornerMeter(t) {
  for (const [a, b] of METER) {
    if (t < a || t >= b + .3) continue;
    const v = pdoomAt(t), k = backOut((t - a) / .4) * (1 - ease((t - b) / .3));
    if (k < .02) return;
    const col = meterColor(v), x = 1760, y = 110;
    push(); translate(x, y); scale(k * .85);
    paint(rrPts(-36, 50, 72, 330, 36, 2), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: 1.3 });
    const hh = 300 * v / 100;
    if (hh > 20) paint(rrPts(-22, 62 + 300 - hh, 44, hh, 22, 1.5), { wash: col, washOp: 230, fill: PAL.ink, fillOp: 30, tex: .6, ink: null });
    for (let q = 1; q < 5; q++) inkLine([[-36, 62 + 300 * q / 5], [-16, 62 + 300 * q / 5]], .7, PAL.ink, 'inkfine', 0);
    paint(ellPts(0, 410, 56, 56, 22, 2), { wash: col, washOp: 240, fill: PAL.ink, fillOp: 25, ink: PAL.ink, sw: 1.3 });
    pop();
    rubyStar(x, y - 44, 30 * k, { glow: .4 + .6 * pulse(t, 4) });
    letter('P(DOOM)', x, y + 14, 40 * k, PAL.cream, { rot: -.05 });
    letter(Math.floor(v) + '%', x, y + 410 * k * .85, 36 * k, PAL.cream);
  }
}

// ---------- brush wipe ----------
// Fat paint strokes sweep across to cover the old scene, the scene swaps under full cover (p = .5), then they drag off.
const WIPE_COLS = [[KP.rubyDk, KP.ruby], [KP.brickDk, KP.gold], [KP.ruby, KP.goldDk], [KP.rubyDk, KP.brick], [KP.goldDk, KP.ruby]];
function wipe(p, idx) {
  const [c1, c2] = WIPE_COLS[idx % WIPE_COLS.length], n = 5, bh = (H + 420) / n + 40;
  push(); translate(W / 2, H / 2); rotate(-.1); translate(-W / 2, -H / 2);
  for (let i = 0; i < n; i++) {
    const y0 = -230 + i * (H + 420) / n, d = [0, .14, .06, .18, .1][i];
    const q = p < .5 ? easeOut(clamp((p * 2 - d) / (1 - d))) : ease(clamp(((p - .5) * 2 - d) / (1 - d)));
    const x0 = p < .5 ? -300 : lerp(-300, W + 400, q), x1 = p < .5 ? lerp(-300, W + 400, q) : W + 400;
    if (x1 - x0 < 30) continue;
    const pts = [], rag = (k, side) => side * (40 + 50 * hash(i * 31 + k)) + jit(12);
    for (let k = 0; k <= 8; k++) pts.push([lerp(x0, x1, k / 8), y0 + Math.sin(k * .9 + i) * 14 + jit(5)]);
    for (let k = 1; k < 9; k++) pts.push([x1 + rag(k, 1) - 40, y0 + bh * k / 9]);
    for (let k = 8; k >= 0; k--) pts.push([lerp(x0, x1, k / 8), y0 + bh + Math.sin(k * .8 + i * 2) * 14 + jit(5)]);
    if (p >= .5) for (let k = 8; k > 0; k--) pts.push([x0 - rag(k + 20, 1) + 40, y0 + bh * k / 9]);
    paint(pts, { wash: i % 2 ? c1 : c2, washOp: 255, fill: i % 2 ? c2 : c1, fillOp: 70, bleed: .05, tex: .8, border: .6, ink: null,
      hatch: { d: 44, a: 0, o: { rand: .6, gradient: .5 }, b: 'charcoal', c: i % 2 ? c2 : PAL.cream, w: .8 } });
  }
  pop();
  // a ruby star spins through while the frame is covered
  const k = clamp(1 - Math.abs(p - .5) / .2);
  if (k > .02) (window.WIPE_ICON || rubyStar)(960, 540, 230 * backOut(k), { glow: k, rot: (p - .5) * 5 });   // a song kit may set window.WIPE_ICON
}

// ---------- karaoke ----------
// line 1 = sung text (LY), line 2 = its translation from the RU dict (for a Russian song RU holds English).
const LY_FONT = SONG.lyFont ?? '800 44px "Shantell Sans", sans-serif';
function karaoke(t) {
  const L = LY.find(l => t >= l[0] && t < l[1]); if (!L) return;
  const [a, b, txt] = L;
  outX.font = LY_FONT;
  let tw = outX.measureText(txt).width;
  outX.font = `30px ${RU_FONT}`; tw = Math.max(tw, outX.measureText(RU[txt] || '').width);
  const grow = easeOut((t - a) / .18) * (1 - ease((t - (b - .12)) / .12));
  if (grow < .02) return;
  const one = !RU[txt], w = (tw + 110) * grow, x0 = 960 - w / 2, y0 = one ? 972 : 962, h = one ? 86 : 106, jx = one ? 3 : 8, jy = one ? 2 : 4;
  const pts = [[x0 + jit(jx), y0 + jit(jy)], [x0 + w / 2, y0 - 4 + jit(jy)], [x0 + w + jit(jx), y0 + jit(jy)], [x0 + w + 14 + jit(jx), y0 + h / 2], [x0 + w + jit(jx), y0 + h + jit(jy)], [x0 + w / 2, y0 + h + 4 + jit(jy)], [x0 + jit(jx), y0 + h + jit(jy)], [x0 - 14 + jit(jx), y0 + h / 2]];
  paint(pts, { wash: KP.night, washOp: 232, fill: KP.ruby, fillOp: 70, tex: .7, border: .4, ink: KP.gold, sw: .7 });
  for (const sd of [-1, 1]) if (grow > .6) (window.KARAOKE_ICON || rubyStar)(960 + sd * (w / 2 - 6), y0 + h / 2, 22 * grow);   // a song kit may set window.KARAOKE_ICON
  KARAOKE = { a, b, txt, grow };
}
function drawKaraokeText(c) {
  if (!KARAOKE || KARAOKE.grow < .85) return;
  const { a, b, txt } = KARAOKE, t = T;
  c.font = LY_FONT; c.textBaseline = 'middle'; c.textAlign = 'left';
  const words = txt.split(' '), sp = c.measureText(' ').width, ws = words.map(w => c.measureText(w).width);
  const total = ws.reduce((p, q) => p + q, 0) + sp * (words.length - 1);
  const singDur = Math.min(b - a - .1, .45 + txt.length * .075), sung = clamp((t - a) / singDur) * txt.replace(/ /g, '').length;
  let x = 960 - total / 2, done = 0; const y = RU[txt] ? 994 : 1015;       // one line: the middle of the bar
  words.forEach((w, i) => {
    const f = clamp((sung - done) / w.length); done += w.length;
    c.fillStyle = PAL.cream; c.fillText(w, x, y);
    if (f > 0) { c.save(); c.beginPath(); c.rect(x - 2, y - 36, ws[i] * f + 2, 72); c.clip(); c.fillStyle = KP.goldLt; c.fillText(w, x, y); c.restore(); }
    x += ws[i] + sp;
  });
  const ru = RU[txt]; if (!ru) return;
  c.font = `30px ${RU_FONT}`; c.textAlign = 'center';
  const rw = c.measureText(ru).width, rf = clamp(sung / txt.replace(/ /g, '').length);
  c.fillStyle = '#F2C9B8'; c.fillText(ru, 960, 1042);
  c.save(); c.beginPath(); c.rect(960 - rw / 2 - 2, 1020, rw * rf + 2, 48); c.clip(); c.fillStyle = KP.rubyLt; c.fillText(ru, 960, 1042); c.restore();
}
