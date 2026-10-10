# per-frame motion of the reference: diff to previous frame (480x270), holds (on twos), cuts
import numpy as np, glob, json, sys
from PIL import Image
fs = sorted(glob.glob(sys.argv[1] + '/*.jpg')); prev = None; out = []
for i, f in enumerate(fs):
    a = np.asarray(Image.open(f).convert('RGB').resize((480, 270)), dtype=np.float32)
    d = 0 if prev is None else float(np.abs(a - prev).mean()); prev = a
    out.append(round(d, 2))
json.dump(out, open(sys.argv[2], 'w'))
for i in range(0, len(out), 24):
    print(f"{i/24:5.1f}s " + ' '.join(f"{x:4.1f}" for x in out[i:i+24]))
