// vertical.js: 9:16 output (1080×1920) for Reels / Shorts / TikTok. On when the page URL has ?…vert.
// The world still renders at 1920×1080. Each frame is reframed: a 1080×1080 window of it (centre x from VFOCUS)
// sits between bands made of a blurred, darkened copy of the same frame; the karaoke is re-set big in the bottom band
// (drawWorld skips the landscape karaoke when VERT is on). Timing is untouched: same beats, same cuts as the 16:9 cut.
// A song may set window.VFOCUS = [[realTime, centreX, windowWidth?], ...] (eased between keys; two keys close together = a quick pan;
// width 1080 = square crop … 1920 = whole frame shown smaller, for wide compositions).
if (/[?&]vert\b/.test(location.search)) {
  window.VERT = true;
  const VW = 1080, VH = 1920, PS = 1080, PY = 360;                          // picture square at y 360..1440
  const vc = document.createElement('canvas'); vc.width = VW; vc.height = VH; window.VERT_C = vc;
  const vx = vc.getContext('2d');
  // → [centre x, window width]; width 1080 = square crop, up to 1920 = the whole frame (letterboxed in the square)
  const focusAt = t => {
    const K = window.VFOCUS || [];
    if (!K.length) return [960, 1080];
    let k = 0; while (k < K.length && K[k][0] <= t) k++;
    const at = i => [K[i][1], K[i][2] ?? 1080];
    if (k === 0) return at(0); if (k === K.length) return at(K.length - 1);
    const A = at(k - 1), B = at(k), u = (t - K[k - 1][0]) / (K[k][0] - K[k - 1][0]), e = u * u * (3 - 2 * u);
    return [A[0] + (B[0] - A[0]) * e, A[1] + (B[1] - A[1]) * e];
  };
  window.vertFocus = focusAt;

  // the karaoke line, wrapped to ≤ 2 lines, big, in the bottom band; words fill gold as they are sung
  function vKaraoke(c, t) {
    const L = LY.find(l => t >= l[0] && t < l[1]); if (!L) return;
    const [a, b, txt] = L, grow = easeOut(clamp((t - a) / .18)) * (1 - ease(clamp((t - (b - .12)) / .12)));
    if (grow < .02) return;
    // units: words, with a lone «—»/«–» glued to the word before it (a line never starts with a dash)
    const words = txt.split(' ').reduce((u, w) => ((/^[—–]$/.test(w) && u.length) ? u[u.length - 1] += ' ' + w : u.push(w), u), []);
    const maxW = 940;
    let size = 62, sp, ws, lines;
    // ≤ 2 lines: one line if it fits, else the break that balances the two line widths; shrink the font if no break fits
    for (;; size -= 4) {
      c.font = `${size}px "Russo One", "Arial Black", sans-serif`;
      sp = c.measureText(' ').width; ws = words.map(w => c.measureText(w).width);
      const wOf = (i, j) => ws.slice(i, j).reduce((s, x) => s + x, 0) + sp * (j - i - 1);
      const n = words.length, idx = (i, j) => [...Array(j - i).keys()].map(k => k + i);
      if (wOf(0, n) <= maxW) { lines = [idx(0, n)]; break; }
      let best = -1, bd = Infinity;
      for (let k = 1; k < n; k++) { const a = wOf(0, k), b = wOf(k, n); if (a <= maxW && b <= maxW && Math.abs(a - b) < bd) { bd = Math.abs(a - b); best = k; } }
      if (best > 0) { lines = [idx(0, best), idx(best, n)]; break; }
      if (size <= 30) { lines = [idx(0, n)]; break; }                           // ponytail: can't happen with this lyric set
    }
    c.textBaseline = 'middle'; c.textAlign = 'left';
    const lineW = lines.map(ix => ix.reduce((s, i) => s + ws[i], 0) + sp * (ix.length - 1));
    const bw = Math.max(...lineW) + 90, lh = size * 1.3, bh = lines.length * lh + 44, cy = PY + PS + (VH - PY - PS) / 2 - 20;
    // box and text scale/fade in and out together (no empty box)
    c.save(); c.globalAlpha = Math.min(1, grow * 1.2);
    c.translate(VW / 2, cy); c.scale(.6 + .4 * grow, .6 + .4 * grow); c.translate(-VW / 2, -cy);
    c.beginPath(); c.roundRect(VW / 2 - bw / 2, cy - bh / 2, bw, bh, 26);
    c.fillStyle = 'rgba(20,16,28,.9)'; c.fill(); c.lineWidth = 4; c.strokeStyle = KP.gold; c.stroke();
    const singDur = Math.min(b - a - .1, .45 + txt.length * .075), sung = clamp((t - a) / singDur) * txt.replace(/ /g, '').length;
    let done = 0;
    lines.forEach((ix, li) => {
      let x = VW / 2 - lineW[li] / 2; const y = cy - bh / 2 + 22 + lh * (li + .5);
      ix.forEach(i => {
        const w = words[i], len = w.replace(/ /g, '').length, f = clamp((sung - done) / len); done += len;
        c.fillStyle = PAL.cream; c.fillText(w, x, y);
        if (f > 0) { c.save(); c.beginPath(); c.rect(x - 2, y - size, ws[i] * f + 2, size * 2); c.clip(); c.fillStyle = KP.goldLt; c.fillText(w, x, y); c.restore(); }
        x += ws[i] + sp;
      });
    });
    c.restore();
  }

  window.vertComposite = (src, t) => {
    const c = vx, [f0, w0] = focusAt(t), cw = Math.max(1080, Math.min(1920, w0)), fx = Math.max(cw / 2, Math.min(1920 - cw / 2, f0));
    const ph = VW * 1080 / cw, py = PY + (PS - ph) / 2;                       // the picture, fitted to the width, centred in the square
    // bands: the whole frame, cover-scaled, blurred and darkened
    c.save(); c.filter = 'blur(28px) brightness(.42) saturate(1.2)';
    const s = VH / 1080; c.drawImage(src, VW / 2 - fx * s, 0, 1920 * s, VH);
    c.restore();
    // the picture window, with a soft shadow and thin ink edges
    c.save(); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 40; c.fillStyle = '#000'; c.fillRect(0, py, VW, ph); c.restore();
    c.drawImage(src, fx - cw / 2, 0, cw, 1080, 0, py, VW, ph);
    c.fillStyle = 'rgba(10,8,14,.9)'; c.fillRect(0, py - 3, VW, 3); c.fillRect(0, py + ph, VW, 3);
    // title in the top band
    if (!window.VTITLE_OFF || !VTITLE_OFF(t)) {
    c.font = '84px "Russo One", "Arial Black", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.lineWidth = 10; c.strokeStyle = 'rgba(20,12,8,.85)'; c.strokeText('ЖГИ ТОКЕНЫ', VW / 2, PY / 2 + 10);
    c.fillStyle = '#FFB02E'; c.fillText('ЖГИ ТОКЕНЫ', VW / 2, PY / 2 + 10);
    }
    vKaraoke(c, t);
  };
}
