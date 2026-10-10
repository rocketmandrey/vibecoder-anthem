#!/bin/bash
# sbs.sh OUT f1 f2 ... : render ours at reference frames and stack ref | ours (each 640 wide), 1 pair per row
out=$1; shift; ts=$(for f in "$@"; do python3 -c "print(round(($f-1)/24+0.004,4))"; done | paste -sd, -)
rm -rf out/qa_A/sb; node render.mjs --song=wonder --stills=$ts --out=out/qa_A/sb >/dev/null 2>&1
python3 - "$out" "$@" <<'PY'
import sys,glob,re
from PIL import Image,ImageDraw
out=sys.argv[1]; fr=[int(x) for x in sys.argv[2:]]
files=sorted(glob.glob('out/qa_A/sb/*.png'),key=lambda p:float(re.search(r't([\d_]+)\.png',p).group(1).replace('_','.')))
im=Image.new('RGB',(1280,360*len(fr)))
for i,(f,p) in enumerate(zip(fr,files)):
    a=Image.open(f'ref/f/{f:04d}.jpg').resize((640,360)); b=Image.open(p).convert('RGB').resize((640,360)); ImageDraw.Draw(a).text((5,5),str(f),fill=(255,0,0)); im.paste(a,(0,360*i)); im.paste(b,(640,360*i))
im.save(out)
PY
