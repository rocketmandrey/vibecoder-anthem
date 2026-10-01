"""slice.py <sheet.png> <outdir>: magenta-key sprite sheet -> transparent cut-outs.
Top row (4 run poses) -> run0..3.png aligned on the torso centroid into equal canvases; bottom row parts -> part0..N.png."""
import sys, os, json
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
pil = Image.open(src); hasA = pil.mode == 'RGBA' and np.asarray(pil)[..., 3].min() < 10
im4 = np.asarray(pil.convert('RGBA')).astype(float); im = im4[..., :3]
r, g, b = im[..., 0], im[..., 1], im[..., 2]
# key distance: magenta = high R, high B, low G
keyness = np.clip(((r + b) / 2 - g - 60) / 120, 0, 1) * np.clip((np.minimum(r, b) - 120) / 60, 0, 1)
alpha = 1 - keyness
if hasA: alpha = np.clip((im4[..., 3] / 255 - .45) / .3, 0, 1); keyness = 1 - alpha
# despill: pull magenta out of semi-key edge pixels
rgb = im.copy()
edge = (keyness > 0) & (keyness < 1) & (not hasA)
m = np.minimum(r, b)
rgb[..., 0] = np.where(edge, np.minimum(r, g + (r - m)), r)
rgb[..., 2] = np.where(edge, np.minimum(b, g + (b - m)), b)
rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
solid = alpha > .5

def runs(prof, minlen, gap):
    segs, on, s = [], False, 0
    for i, v in enumerate(list(prof) + [0] * (gap + 1)):
        if v and not on: on, s, last = True, i, i
        elif v: last = i
        elif on and i - last > gap: on = False; segs.append((s, last + 1)) if last + 1 - s >= minlen else None
    return segs

H, W = solid.shape
rows = runs(solid.sum(1) > 2, 40, 12)
print('row bands', rows)
meta = {}
def comps(y0, y1):
    band = solid[y0:y1]
    return [(x0, x1) for x0, x1 in runs(band.sum(0) > 0, 25, 2)]
def crop(y0, y1, x0, x1):
    sub = solid[y0:y1, x0:x1]; ys = np.where(sub.any(1))[0]
    return y0 + ys[0], y0 + ys[-1] + 1
top = rows[0]
cs = comps(*top)
print('top comps', cs)
cs = sorted(cs, key=lambda c: -(c[1] - c[0]))[:4]; cs.sort()
boxes = []
for x0, x1 in cs:
    y0, y1 = crop(top[0], top[1], x0, x1)
    sub = solid[y0:y1, x0:x1]; hh = sub.shape[0]
    ys, xs = np.nonzero(sub[: int(hh * .55)])
    boxes.append((x0, y0, x1, y1, x0 + xs.mean(), y0 + ys.mean()))
# common canvas around the torso centroid
L = max(b[4] - b[0] for b in boxes); R = max(b[2] - b[4] for b in boxes)
T = max(b[5] - b[1] for b in boxes); B = max(b[3] - b[5] for b in boxes)
cw, ch = int(L + R) + 4, int(T + B) + 4
for i, (x0, y0, x1, y1, cx, cy) in enumerate(boxes):
    canvas = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    piece = Image.fromarray(rgba[y0:y1, x0:x1])
    canvas.paste(piece, (int(round(L + 2 - (cx - x0))), int(round(T + 2 - (cy - y0)))))
    canvas.save(f'{out}/run{i}.png')
meta['run'] = {'w': cw, 'h': ch, 'cx': L + 2, 'cy': T + 2}
for j, band in enumerate(rows[1:2]):
    for k, (x0, x1) in enumerate(comps(*band)):
        y0, y1 = crop(band[0], band[1], x0, x1)
        Image.fromarray(rgba[y0:y1, x0:x1]).save(f'{out}/part{k}.png')
json.dump(meta, open(f'{out}/meta.json', 'w'))
print(out, meta)
