# sbs.py out.jpg N N N...: ref frame (top) over ours (bottom) via cached ours renders in out/qa_C/o/NNNN.png
import sys,subprocess
from PIL import Image
out=sys.argv[1]; ns=[int(x) for x in sys.argv[2:]]
import shutil; shutil.rmtree('out/qa_C/o',ignore_errors=True); subprocess.run(['node','render.mjs','--song=wonder','--stills='+','.join(f'{(n-1)/24+1e-4:.5f}' for n in ns),'--out=out/qa_C/o'],capture_output=True)
w,h=480,270; M=Image.new('RGB',(w*len(ns)//1,h*2)) if len(ns)<=4 else None
cols=min(len(ns),4); rows=(len(ns)+cols-1)//cols; M=Image.new('RGB',(cols*w,rows*2*h))
import glob,os
fs=sorted(glob.glob('out/qa_C/o/*.png'))
for i,(n,fp) in enumerate(zip(ns,fs)):
    r=Image.open(f'ref/f/{n:04d}.jpg').resize((w,h)); o=Image.open(fp).convert('RGB').resize((w,h))
    M.paste(r,((i%cols)*w,(i//cols)*2*h)); M.paste(o,((i%cols)*w,(i//cols)*2*h+h))
M.save(out)
