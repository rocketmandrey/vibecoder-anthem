// sync_check.mjs: planned hits of the reused RU chapters (a v2 chapter cue that must land on an EN word / downbeat) vs the EN time warp.
// usage: node scripts/sync_check.mjs [--fps=30]      exits 1 if any hit is more than 2 frames off its target.
// Loads the real truth.js + tokens3 warp + tokensEN/warp.js in a vm (browser globals stubbed), so it checks exactly what the page plays.
import fs from 'fs'; import vm from 'vm';
const fps = +(process.argv.find(a => a.startsWith('--fps='))?.split('=')[1] || 30), TOL = 2 / fps;
const src = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const ctx = { console: { warn: (...a) => console.log('page:', ...a), log() {} }, Math };
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(['src/tokensEN/truth.js', 'src/tokens3/audio.js'].map(src).join('\n') + '\nconst HITS = [], CH = [];\n' + src('src/tokens3/warp.js')
  + '\n' + src('src/tokensEN/warp.js') + '\nwindow.W = { EN_WORDS: typeof LY_WORDS !== "undefined" ? LY_WORDS : null, EN_DOWNBEATS };', ctx);
const { EN2V2, W } = ctx;
const words = JSON.parse(src('assets/tokensEN/truth.json')).lines.flatMap(l => l.words || []).map(w => [w.s ?? w.start, (w.w ?? w.word ?? '').trim()]);
const down = W.EN_DOWNBEATS;

// [label, chapter (v2) cue, EN target word (first word with this text within ±1.5 s of `near`), near]
const PLAN = [
  ['a07 drop 1 hit (HIT1)', 132.55, 'More', 135.22],
  ['a08 calendar 2024', 158.42, 'say', 153.24],
  ['a08 calendar 2025', 159.02, 'year.', 154.08],
  ['a08 LOADING 99%', 159.3, 'Every', 154.46],
  ['a08 LOADING 99.999%', 160.86, "it's", 156.06],
  ['a09 press (Burn)', 180.92, 'Burn', 178.84],
  ['a09 press (burn)', 182.44, 'burn', 179.82],
  ['a09 press (tokens)', 183.0, 'tokens.', 180.46],
  ['a09 drain (Till)', 183.76, 'Till', 181.44],
  ['a09 ДОХОДЫ thrown', 185.68, 'Revenue?', 183.74],
  ['a09 ПОТОМ stamp 1', 186.66, 'Later.', 184.38],
  ['a09 ПРИБЫЛЬ thrown', 187.48, 'Profit?', 185.00],
  ['a09 ПОТОМ stamp 2', 188.0, 'How?', 185.66],
  ['a09 AGI billboard cut', 188.7, 'AGI?', 186.38],
  ['a09 SOON…', 190.0, 'Soon.', 187.04],
  ['a09 CAPEX neon', 190.72, 'CapEx?', 187.62],
  ['a09 NOW! plate', 191.2, 'Now.', 188.32],
  ['a09 benchmark cut', 191.7, 'One', 189.04],
  ['a09 axis press 1', 192.55, 'up', 189.76],
  ['a09 axis press 2', 193.19, 'score.', 190.90],
  ['a09 + (puppets)', 193.32, 'Worth', 191.88],
];

// EN time at which the cue first shows: the first frame-exact crossing of EN2V2 through the cue near the target (the warp can replay, so search locally)
function enOf(v2, near) {
  let best = null;
  for (let t = near - 3; t < near + 3; t += 1 / 2000) if (EN2V2(t) < v2 && EN2V2(t + 1 / 2000) >= v2) { const c = t + 1 / 2000; if (best == null || Math.abs(c - near) < Math.abs(best - near)) best = c; }
  return best;
}
const nearest = (arr, t) => arr.reduce((b, x) => Math.abs(x - t) < Math.abs(b - t) ? x : b, arr[0]);
let bad = 0;
console.log(`fps ${fps}, tolerance ${(TOL * 1000).toFixed(0)} ms\n` + 'hit'.padEnd(26) + 'target      plays at   Δms   nearest downbeat');
for (const [lab, v2, wd, near] of PLAN) {
  const w = words.filter(([s, x]) => x.replace(/[^\w]/g, '').toLowerCase() === wd.replace(/[^\w]/g, '').toLowerCase() && Math.abs(s - near) < 1.5);
  const tgt = w.length ? nearest(w.map(x => x[0]), near) : near, at = enOf(v2, tgt);
  const d = at == null ? Infinity : at - tgt, db = at == null ? NaN : at - nearest(down, at), ok = Math.abs(d) <= TOL;
  if (!ok) bad++;
  console.log(`${ok ? '  ' : '✗ '}${lab.padEnd(24)}${(wd + ' ' + tgt.toFixed(2)).padEnd(12)}${at == null ? '   —   ' : at.toFixed(3).padStart(8)}${(d * 1000).toFixed(0).padStart(6)}   ${(db * 1000).toFixed(0).padStart(5)}${w.length ? '' : '  (word not found, using near)'}`);
}
console.log(bad ? `\n${bad} hit(s) off by more than 2 frames` : '\nall hits within 2 frames');
process.exit(bad ? 1 : 0);
