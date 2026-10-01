// Hamster-Clawd in a hamster wheel: 5 variants for BURN THE TOKENS (sandbox, not wired into the clip).
// Side view, on all four paws. Sprites: Codex sprite sheets (flat clip style, magenta key) cut into 4 gallop poses per variant (v<n>/run0..3.png).
// Everything else (factory, wheel, motion lines, sweat, coins) is drawn here. ?v=1..5, window.renderAt(t) for the renderer.
const C = document.getElementById('c'), X = C.getContext('2d'), W = 720, H = 720, TAU = Math.PI * 2, LOOP = 4;
const Q = new URLSearchParams(location.search), V = +(Q.get('v') || 1);
const INK = '#2B2233', STEEL = '#59636E', STEEL_LT = '#8A95A1', GUN = '#2B2F36', GUN_DK = '#1C1F24', HAZ = '#FFD21F', GOLD = '#F2B632', GOLD_DK = '#A8741A';
// per variant: w = drawn width of the gallop frames (px), blur = legs smear into a spin blur when fast (v3)
const CFG = { 1: { w: 330 }, 2: { w: 330, coins: 1 }, 3: { w: 310, blur: true, coins: 1 }, 4: { w: 350 }, 5: { w: 360 } }[V];
const WX = 360, WY = 340, R = 236, RIN = 212;                        // wheel centre, outer / running radius

const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const speed = t => .35 + 1.25 * Math.pow(Math.min(t, LOOP) / LOOP, 1.5);   // rev/s, speeding up over the loop
const angle = t => { let a = 0; const n = 200, dt = t / n; for (let i = 0; i < n; i++) a += speed((i + .5) * dt) * dt * TAU; return a; };
const runPhase = t => { let p = 0; const n = 200, dt = t / n; for (let i = 0; i < n; i++) p += (1.6 + 2.1 * speed((i + .5) * dt)) * dt; return p; };   // gallop cycles (≤ 5/s: 4 poses each stay under 24 fps)

const imgs = [];
const load = src => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });

function circle(x, y, r, fill, stroke, lw) { X.beginPath(); X.arc(x, y, r, 0, TAU); if (fill) { X.fillStyle = fill; X.fill(); } if (stroke) { X.strokeStyle = stroke; X.lineWidth = lw; X.stroke(); } }
function line(pts, lw, col, cap = 'round') { X.beginPath(); pts.forEach(([x, y], i) => i ? X.lineTo(x, y) : X.moveTo(x, y)); X.lineWidth = lw; X.strokeStyle = col; X.lineCap = cap; X.lineJoin = 'round'; X.stroke(); }
function poly(pts, fill, stroke, lw) { X.beginPath(); pts.forEach(([x, y], i) => i ? X.lineTo(x, y) : X.moveTo(x, y)); X.closePath(); if (fill) { X.fillStyle = fill; X.fill(); } if (stroke) { X.strokeStyle = stroke; X.lineWidth = lw; X.lineJoin = 'round'; X.stroke(); } }

function factory(t) {
  X.fillStyle = '#23262C'; X.fillRect(0, 0, W, H);
  for (let x = 40; x < W; x += 170) { X.fillStyle = '#292D34'; X.fillRect(x, 0, 6, 610); }
  X.fillStyle = STEEL; X.fillRect(0, 70, W, 18); line([[0, 70], [W, 70]], 3, INK); line([[0, 88], [W, 88]], 3, INK);
  for (const lx of [110, 610]) {                                       // hanging lamps with flat warm cones
    X.globalAlpha = .10 + .02 * Math.sin(t * 9 + lx); poly([[lx - 22, 120], [lx + 22, 120], [lx + 120, 610], [lx - 120, 610]], '#FFC53D'); X.globalAlpha = 1;
    poly([[lx - 40, 122], [lx + 40, 122], [lx + 20, 96], [lx - 20, 96]], '#1A1718', INK, 3);
    X.fillStyle = '#B4502A'; X.fillRect(lx - 5, 88, 10, 10);
    X.beginPath(); X.ellipse(lx, 123, 26, 7, 0, 0, TAU); X.fillStyle = '#FFE38A'; X.fill();
  }
  X.fillStyle = '#1C1E22'; X.fillRect(0, 610, W, H - 610);
  for (let x = -40; x < W + 40; x += 36) poly([[x, 610], [x + 18, 610], [x + 8, 624], [x - 10, 624]], HAZ);
  X.fillStyle = '#16181C'; X.fillRect(0, 624, W, 4); line([[0, 610], [W, 610]], 3, INK);
}

function wheelBack(a, sp) {
  // A-frame stand
  for (const d of [-1, 1]) { line([[WX, WY], [WX + d * 230, 640]], 26, INK); line([[WX, WY], [WX + d * 230, 640]], 18, STEEL); }
  poly([[WX - 260, 632], [WX + 260, 632], [WX + 250, 652], [WX - 250, 652]], GUN, INK, 3);
  circle(WX, WY, R + 6, GUN, INK, 4);                                 // back hoop + drum
  circle(WX, WY, RIN - 4, GUN_DK, INK, 3);
  // back spokes (blur into a disc when fast)
  const k = Math.min(1, Math.max(0, (sp - 1.1) / .4));
  for (let i = 0; i < 8; i++) { const th = a + i * TAU / 8; X.globalAlpha = 1 - .6 * k;
    line([[WX, WY], [WX + Math.cos(th) * (RIN - 4), WY + Math.sin(th) * (RIN - 4)]], 9, INK); line([[WX, WY], [WX + Math.cos(th) * (RIN - 4), WY + Math.sin(th) * (RIN - 4)]], 5, STEEL); }
  X.globalAlpha = 1;
  if (k > 0) for (let i = 0; i < 3; i++) { X.globalAlpha = .18 * k; circle(WX, WY, RIN * (.45 + i * .2), null, STEEL_LT, 10); } X.globalAlpha = 1;
  circle(WX, WY, 26, HAZ, INK, 4); circle(WX, WY, 8, INK);
}

function rungs(a) {
  // the rim band he runs on: rungs (short bars) rolling past
  const n = 40;
  for (let i = 0; i < n; i++) { const th = a + i * TAU / n, c = Math.cos(th), s = Math.sin(th);
    line([[WX + c * (RIN - 2), WY + s * (RIN - 2)], [WX + c * (R + 2), WY + s * (R + 2)]], 7, INK, 'butt');
    line([[WX + c * (RIN), WY + s * (RIN)], [WX + c * (R), WY + s * (R)]], 3.5, i % 10 ? STEEL_LT : HAZ, 'butt'); }
}

function wheelFront(a, sp) {
  circle(WX, WY, R + 4, null, INK, 9); circle(WX, WY, R + 4, null, STEEL_LT, 4);
  circle(WX, WY, RIN - 2, null, INK, 6); circle(WX, WY, RIN - 2, null, STEEL, 2.5);
  // motion lines: arcs chasing the rim, longer and more of them as it speeds up
  const m = Math.min(1, (sp - .45) / 1.1);
  if (m > 0) for (let i = 0; i < 6; i++) { const r0 = R + 20 + (i % 3) * 13, a0 = -a * .3 + i * TAU / 6 + hash(i) * 1.5, len = .25 + .7 * m;
    X.globalAlpha = .9 * m; X.beginPath(); X.arc(WX, WY, r0, a0, a0 + len); X.lineWidth = 5; X.strokeStyle = '#F1E8D2'; X.lineCap = 'round'; X.stroke(); }
  X.globalAlpha = 1;
}

function sprite(img, x, y, w, alpha = 1, sx = 1, sy = 1) {
  const h = w * img.height / img.width; X.globalAlpha = alpha;
  X.save(); X.translate(x, y); X.scale(sx, sy); X.drawImage(img, -w / 2, -h, w, h); X.restore(); X.globalAlpha = 1;
}

function hamster(t, sp) {
  const ph = runPhase(t), f = Math.floor(ph * 4) % 4, u = ph * 4 % 1;
  const th = Math.PI / 2 - .06 - .22 * Math.min(1, (sp - .35) / 1.25);   // rides up the rim the faster it goes
  const fx = WX + Math.cos(th) * (RIN + 8), fy = WY + Math.sin(th) * (RIN + 8);
  const bob = [0, 6, 2, -12][f] * (.6 + .4 * Math.min(sp, 1.4)), squash = [1, 1.04, 1, .97][f];
  const SH = CFG.w * imgs[0].height / imgs[0].width;
  X.save(); X.translate(fx, fy); X.rotate(th - Math.PI / 2 + .06 * Math.min(sp, 1.5));   // lean into the run
  // dust puffs + speed lines behind (to the left = away from the running direction)
  const m = Math.min(1, (sp - .5) / 1.1);
  for (let i = 0; i < 5; i++) { const v = (t * (1.5 + sp) + hash(i + 3)) % 1, x = -CFG.w * .3 - v * 140, y = -8 - hash(i) * 10 - v * 18;
    X.globalAlpha = (1 - v) * .8; circle(x, y, 6 + v * 12, '#4A4F58'); } X.globalAlpha = 1;
  if (m > 0) for (let i = 0; i < 5; i++) { const y = -SH * (.25 + i * .14), x0 = -CFG.w * .5 - hash(i + 7) * 30;
    X.globalAlpha = .85 * m; line([[x0 - 60 - 60 * m, y], [x0, y]], 5, '#F1E8D2'); } X.globalAlpha = 1;
  // motion ghosts of the previous poses when fast
  if (sp > .9) for (let g = 2; g >= 1; g--) { const pf = (f - g + 8) % 4; sprite(imgs[pf], -g * 12 * (sp - .6), bob * .5, CFG.w, .14 * (sp - .6) / g); }
  if (CFG.blur && sp > 1.15 && imgs.body) {
    // chibi legs become a spinning cartoon blur under a body that hovers on it
    const k = Math.min(1, (sp - 1.15) / .25), bw = CFG.w * .9, bh = bw * imgs.body.height / imgs.body.width;
    for (const lx of [-.24, .2]) {                                    // two Road-Runner leg wheels: swirled arcs + a smeared paw ring
      const cx = lx * bw, cy = -bh * .2, r = bh * .26;
      X.globalAlpha = .55 * k; circle(cx, cy, r, '#E9A27F'); X.globalAlpha = k;
      for (let i = 0; i < 4; i++) { const a0 = -t * 50 + i * TAU / 4 + lx * 7; X.beginPath(); X.arc(cx, cy, r * (.55 + .12 * (i % 2)), a0, a0 + 1.1); X.lineWidth = 6; X.strokeStyle = INK; X.lineCap = 'round'; X.stroke(); }
      X.beginPath(); X.arc(cx, cy, r, 0, TAU); X.lineWidth = 5; X.strokeStyle = '#F4B6A8'; X.stroke();
    }
    X.globalAlpha = 1;
    sprite(imgs.body, 0, -bh * .16 + bob * .4 - 4 * Math.sin(t * 60), bw);
  } else sprite(imgs[f], 0, bob, CFG.w, 1, 1 / squash, squash);
  // sweat drops flicking off the head
  const ns = Math.round(2 + 4 * Math.min(1, sp / 1.4));
  for (let i = 0; i < ns; i++) { const v = (t * (1.2 + sp * .8) + hash(i + 20)) % 1, d = i % 2 ? 1 : -1, x = d * (25 + v * 90) - 30 * v, y = -SH * .85 - 70 * v + 160 * v * v;
    X.globalAlpha = 1 - v * v; poly([[x, y - 11], [x + 7, y + 3], [x, y + 9], [x - 7, y + 3]], '#BFE3F7', INK, 2.5); } X.globalAlpha = 1;
  const head = X.getTransform().transformPoint(new DOMPoint(CFG.w * .3, -SH * .45 + bob));
  X.restore();
  return [head.x, head.y];
}

function coins(t, sp, [hx, hy]) {
  // gold T-tokens squeezed out of the stuffed cheeks, flung back and up, more of them when fast
  const n = Math.round(1 + 7 * Math.min(1, Math.max(0, (sp - .5) / 1.1)));
  for (let i = 0; i < n; i++) { const per = .9 + hash(i) * .5, v = ((t + hash(i + 50) * per) % per) / per;
    const x = hx - v * (200 + hash(i + 2) * 200), y = hy - (380 * v - 560 * v * v) * (.7 + hash(i + 9) * .5), rot = t * 8 + i;
    X.save(); X.translate(x, y); X.scale(Math.cos(rot), 1); circle(0, 0, 15, GOLD, INK, 3.5); circle(0, 0, 9, null, GOLD_DK, 2);
    X.fillStyle = INK; X.font = 'bold 15px sans-serif'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('T', 0, 1); X.restore(); }
}

function label() {
  X.font = '900 92px "Arial Black", Impact, sans-serif'; X.textAlign = 'left'; X.textBaseline = 'top';
  X.lineWidth = 14; X.strokeStyle = INK; X.lineJoin = 'round'; X.strokeText(String(V), 24, 16); X.fillStyle = HAZ; X.fillText(String(V), 24, 16);
}

function draw(t) {
  t = Math.max(0, Math.min(t, LOOP - 1e-6));
  const sp = speed(t), a = -angle(t);                                // runs right -> floor moves left -> counter-clockwise
  factory(t); wheelBack(a, sp); rungs(a); const head = hamster(t, sp); wheelFront(a, sp); if (CFG.coins) coins(t, sp, head); label();
}

window.renderAt = t => { draw(t); return C.toDataURL('image/png'); };
Promise.all([0, 1, 2, 3].map(i => load(`v${V}/run${i}.png`))).then(async r => {
  r.forEach((im, i) => imgs[i] = im); imgs.body = await load(`v${V}/body.png`);
  window.ready = true;
  if (!Q.has('render')) { const t0 = performance.now(); const tick = () => { draw((performance.now() - t0) / 1000 % LOOP); requestAnimationFrame(tick); }; tick(); }
});
