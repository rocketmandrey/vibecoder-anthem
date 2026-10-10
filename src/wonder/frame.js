// frame.js: the host. Picks the scene registered for t (kit.js SC) and composites its 2D canvas; core.js adds grain on top.
let METER_SHOWN = false;          // core.js draw() resets it
function drawKaraokeText() {}
let WG = null;
function drawWorld(t) {
  if (!WG) { WG = createGraphics(W, H); WG.pixelDensity(1); }
  const s = SC.list.find(s => t >= s.t0 && t < s.t1) || SC.list[SC.list.length - 1];
  const c = WG.drawingContext; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, W, H);
  if (s) { c.save(); s.draw(c, s.twos ? Math.floor(t * 12 + 1e-6) / 12 : t); c.restore(); }
  image(WG, 0, 0, W, H);                       // core.js sqView() already maps the world to the canvas
}
