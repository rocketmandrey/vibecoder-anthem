"""Old→new master offset map: windowed cross-correlation of onset envelopes (2 s windows, 0.5 s step).
usage: python scripts/master_offset.py <old audio> <new audio> [out.json]   (needs numpy, librosa)"""
import json, sys
import numpy as np, librosa

SR, HOP = 22050, 64                                  # 2.9 ms frames
old_p, new_p = sys.argv[1], sys.argv[2]
out = sys.argv[3] if len(sys.argv) > 3 else "assets/tokens3/master_offset.json"
env = lambda p: librosa.onset.onset_strength(y=librosa.load(p, sr=SR, mono=True)[0], sr=SR, hop_length=HOP)
A, B = env(old_p), env(new_p)
fr = SR / HOP

# gross offset from the whole track
x = np.correlate(B - B.mean(), A - A.mean(), "full"); g = int(np.argmax(x)) - (len(A) - 1)
print(f"global lag {g / fr * 1000:+.1f} ms  (dur old {len(A) / fr:.3f}, new {len(B) / fr:.3f})")

W, STEP, MAXL = int(2 * fr), int(0.5 * fr), int(0.4 * fr)
rows = []
for s in range(0, len(A) - W, STEP):
    a = A[s:s + W]
    if a.std() < 1e-3: continue
    lo, hi = s + g - MAXL, s + g + MAXL + W
    if lo < 0 or hi > len(B): continue
    b = B[lo:hi]
    c = np.array([np.corrcoef(a, b[k:k + W])[0, 1] for k in range(2 * MAXL + 1)])
    k = int(np.nanargmax(c)); d = 0.0
    if 0 < k < len(c) - 1:                                             # parabolic sub-frame peak
        y0, y1, y2 = c[k - 1:k + 2]; den = y0 - 2 * y1 + y2; d = 0.5 * (y0 - y2) / den if den else 0
    rows.append({"t_old": round((s + W / 2) / fr, 3), "shift_ms": round((g - MAXL + k + d) / fr * 1000, 1), "corr": round(float(c[k]), 3)})

good = [r for r in rows if r["corr"] > 0.5]
sh = np.array([r["shift_ms"] for r in good]); t = np.array([r["t_old"] for r in good])
p = np.polyfit(t, sh, 1)
print(f"{len(good)}/{len(rows)} windows corr>0.5; shift median {np.median(sh):+.1f} ms, p5 {np.percentile(sh, 5):+.1f}, p95 {np.percentile(sh, 95):+.1f}; drift {p[0] * 1000:+.2f} ms/min·(1/60)")
# segments: runs of (roughly) constant shift → anchors old→new
segs, cur = [], [good[0]]
for r in good[1:]:
    if abs(r["shift_ms"] - np.median([q["shift_ms"] for q in cur[-6:]])) > 15: segs.append(cur); cur = [r]
    else: cur.append(r)
segs.append(cur)
segs = [{"t_old_from": s[0]["t_old"], "t_old_to": s[-1]["t_old"], "n": len(s), "shift_ms": round(float(np.median([q["shift_ms"] for q in s])), 1)} for s in segs]
for s in segs: print(s)
json.dump({"old": old_p.split("/")[-1], "new": new_p.split("/")[-1], "method": "onset-envelope xcorr, 2 s windows / 0.5 s step, hop 2.9 ms",
           "global_lag_ms": round(g / fr * 1000, 1), "median_shift_ms": round(float(np.median(sh)), 1),
           "drift_ms_per_min": round(p[0] * 60, 2), "segments": segs, "windows": rows}, open(out, "w"), ensure_ascii=False, indent=0)
print("wrote", out)
