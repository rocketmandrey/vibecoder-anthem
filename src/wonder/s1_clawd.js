// s1_clawd.js: PLACEHOLDER — Clawd on paper 0–7.4 and 28.75–32 (owner: agent A)
(() => {
  const paper = c => { c.fillStyle = '#ECE9E0'; c.fillRect(0, 0, W, H); };
  SC.add(0, 7.45, { twos: true, draw: (c, t) => paper(c) });
  SC.add(28.75, 32.01, { twos: true, draw: (c, t) => paper(c) });
})();
