#!/bin/bash
# motcmp.sh A B : per-frame motion of our render vs ref/motion.json for [A,B) (A on the 24 fps grid) -> prints file#, ref, ours
A=$1; B=$2; mkdir -p out/qa_C
node render.mjs --song=wonder --clip=$A:$B --out=out/qa_C/m.mp4 >/dev/null 2>&1
ffmpeg -v error -y -i out/qa_C/m.mp4 -vf "fps=24,scale=480:270" -f rawvideo -pix_fmt rgb24 out/qa_C/m.raw
python3 - $A <<'PY'
import numpy as np,json,sys
A=float(sys.argv[1]); n0=round(A*24); m=json.load(open('ref/motion.json'))
a=np.fromfile('out/qa_C/m.raw',np.uint8).reshape(-1,270,480,3).astype(float)
for i in range(1,len(a)):
    idx=n0+i
    print('%.3f idx%d ref %5.1f ours %5.1f'%(idx/24,idx,m[idx],np.abs(a[i]-a[i-1]).mean()))
PY
rm -f out/qa_C/m.raw out/qa_C/m.mp4
