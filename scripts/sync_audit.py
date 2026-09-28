"""Sync audit: every karaoke line (LY) and every WARP anchor vs the new master (Scribe words snapped to vocal-stem onsets, beats, hits).
usage: python scripts/sync_audit.py [--md]     reads src/tokens3/*.js + assets/tokens3/{scribe_words,master_grid}.json
Times are printed in clip time (the old-master time the tables are written in); SHIFT = old − new master (master_offset.json)."""
import difflib, json, re, sys
import numpy as np

def jsarr(src, name):                                   # a `const NAME = [...]` JS literal → python
    s = re.search(r"const " + name + r" = (\[.*?\]);\n", src, re.S).group(1)
    s = re.sub(r"//[^\n]*", "", s); s = re.sub(r"(?<![\d.])\.(\d)", r"0.\1", s); s = re.sub(r",\s*\]", "]", s)
    return json.loads(s)

A = open("src/tokens3/audio.js").read()
BEATS, HITS = np.array(jsarr(A, "V3_BEATS")), np.array([h for h, s in jsarr(A, "V3_HITS") if s >= 5])
LY = jsarr(open("src/tokens3/lyrics.js").read(), "LY"); WARP = jsarr(open("src/tokens3/warp.js").read(), "WARP")
G = json.load(open("assets/tokens3/master_grid.json")); SC = json.load(open("assets/tokens3/scribe_words.json"))["words"]
CODE_SHIFT = float(re.search(r"shift: ([\d.]+)", open("tokens3.html").read() + "shift: 0").group(1))  # already applied by the page?
SHIFT = -json.load(open("assets/tokens3/master_offset.json"))["median_shift_ms"] / 1000
SC = [w for w in SC if not w.get("ev")]
VOX = np.array([t + SHIFT for t, s in G["vox"] if s >= 3])
norm = lambda w: re.sub(r"[^a-zа-я0-9]", "", w.lower().replace("ё", "е"))

def snap(t):                                             # Scribe start → the nearest real vocal-stem onset within −120…+80 ms
    c = VOX[(VOX > t - .12) & (VOX < t + .08)]
    return float(c[np.argmin(abs(c - t))]) if len(c) else t

# align the LY words to the Scribe words (Scribe hears «Скинь» for «Жги»: equal-length replaces map one to one)
lw = [(i, w) for i, l in enumerate(LY) for w in l[2].replace("—", " ").split() if norm(w)]
sw = [norm(w["w"]) for w in SC]
m = {}
for op, a0, a1, b0, b1 in difflib.SequenceMatcher(None, [norm(w) for _, w in lw], sw, autojunk=False).get_opcodes():
    if op == "equal" or (op == "replace" and a1 - a0 == b1 - b0): m.update({a0 + k: b0 + k for k in range(a1 - a0)})
    elif op == "replace": m[a0] = b0
first = {}
for k, (i, w) in enumerate(lw):
    if i not in first: first[i] = k

rows = []
for i, (a, b, txt) in enumerate(LY):
    k = first.get(i)
    if k is None or k not in m: rows.append((i, a, txt, None, None)); continue
    raw = SC[m[k]]["s"] + SHIFT
    rows.append((i, a, txt, raw, snap(raw)))

def near(arr, t): j = np.argmin(abs(arr - t)); return float(arr[j])
words = np.array([snap(w["s"] + SHIFT) for w in SC])
md = "--md" in sys.argv
print("| # | строка | клип | Scribe | Scribe→вокал | Δ к старому треку, мс | Δ к новому мастеру, мс | флаг |" if md else "LY")
if md: print("|---|---|---|---|---|---|---|---|")
for i, a, txt, raw, sn in rows:
    if raw is None: print(f"| {i} | {txt} | {a:.3f} | — | — | — | — | нет в Scribe |" if md else f"{i:3d} {a:8.3f}  -- {txt}"); continue
    d = (a - sn) * 1000; flag = "**>60**" if abs(d) > 60 else ""
    print(f"| {i} | {txt} | {a:.3f} | {raw:.3f} | {sn:.3f} | {d:+.0f} | {d + (SHIFT - CODE_SHIFT) * 1000:+.0f} | {flag} |" if md else f"{i:3d} {a:8.3f} raw {raw:8.3f} snap {sn:8.3f}  d {d:+6.0f} {flag} {txt}")
print("\n| якорь v3 | ближ. бит, мс | ближ. хит, мс | ближ. слово, мс | min | флаг |" if md else "\nWARP")
if md: print("|---|---|---|---|---|---|")
for t, _ in WARP:
    if t <= .21 or t > 242: continue
    db, dh, dw = [(t - near(x, t)) * 1000 for x in (BEATS, HITS, words)]
    mn = min((db, dh, dw), key=abs); flag = "**>60**" if abs(mn) > 60 else ""
    print(f"| {t:.3f} | {db:+.0f} | {dh:+.0f} | {dw:+.0f} | {mn:+.0f} | {flag} |" if md else f"{t:8.3f} beat {db:+5.0f} hit {dh:+5.0f} word {dw:+5.0f} {flag}")
