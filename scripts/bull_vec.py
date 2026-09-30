"""bull_vec.py <png> <out.json> [size] [stacked|cutout]: one Codex bull layer (flat style, transparent) → vector paths for src/tokensEN/bull_art.js.
Flatten on a magenta key, vtracer (pip install vtracer), key paths become erase paths, near-black fills → PAL.ink."""
import sys, json, re, subprocess, vtracer
src, out = sys.argv[1], sys.argv[2]; size = int(sys.argv[3]) if len(sys.argv) > 3 else 512
subprocess.run(['magick', src, '-channel', 'A', '-threshold', '40%', '+channel', '-trim', '+repage', '-resize', f'{size}x{size}', '-bordercolor', 'none', '-border', '6', '-background', '#FF00FF', '-alpha', 'remove', '-alpha', 'off', '/tmp/_vec_in.png'], check=True)
vtracer.convert_image_to_svg_py('/tmp/_vec_in.png', '/tmp/_vec.svg', colormode='color', hierarchical=sys.argv[4] if len(sys.argv) > 4 else 'cutout', mode='spline', filter_speckle=8,
    color_precision=6, layer_difference=20, corner_threshold=60, length_threshold=6.0, splice_threshold=45, path_precision=1)
svg = open('/tmp/_vec.svg').read(); paths = []
for m in re.finditer(r'<path d="([^"]+)" fill="(#[0-9A-Fa-f]{6})"(?: transform="translate\(([-\d.]+),([-\d.]+)\)")?', svg):
    d, fill, tx, ty = m.group(1), m.group(2), float(m.group(3) or 0), float(m.group(4) or 0)
    r, g, b = (int(fill[i:i + 2], 16) for i in (1, 3, 5))
    if r > 200 and b > 200 and g < 90: fill = 'KEY'                 # the key: erased when drawn (the root path under it is the outline)
    elif .3 * r + .5 * g + .2 * b < 55: fill = '#2B2233'            # outlines → the clip's ink (PAL.ink), kills the key's purple fringe
    paths.append([fill, tx, ty, d.strip()])
wh = subprocess.run(['magick', 'identify', '-format', '%w %h', '/tmp/_vec_in.png'], capture_output=True, text=True).stdout.split()
json.dump({'w': int(wh[0]), 'h': int(wh[1]), 'paths': paths}, open(out, 'w'))
open(out.replace('.json', '.svg'), 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}">' + ''.join(f'<path d="{d}" fill="{"#3a3336" if f == "KEY" else f}" transform="translate({x},{y})"/>' for f, x, y, d in paths) + '</svg>')
print(out, len(paths), 'paths', sum(len(p[3]) for p in paths), 'chars')
