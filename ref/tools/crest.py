import sys,glob,subprocess,shutil
import numpy as np
from PIL import Image
from col import load
ns=[int(x) for x in sys.argv[1:]]
shutil.rmtree('out/qa_C/o',ignore_errors=True)
subprocess.run(['node','render.mjs','--song=wonder','--stills='+','.join(f'{(n-1)/24+1e-4:.5f}' for n in ns),'--out=out/qa_C/o'],capture_output=True)
fs=sorted(glob.glob('out/qa_C/o/*.png'))
def crests(im):
    im=im.astype(float); m=(im[:,:,2]>190)&(im[:,:,0]>120)&(im[:,:,1]<120)   # violet bright
    sub=m[300:460,:]; prof=sub.sum(0)>2
    xs=np.where(prof)[0]; 
    if len(xs)==0: return []
    # cluster
    out=[];s=xs[0];p=xs[0]
    for x in xs[1:]:
        if x-p>30: out.append((s+p)//2); s=x
        p=x
    out.append((s+p)//2); return out
for n,fp in zip(ns,fs):
    print(n,'ref',crests(load(n)),'ours',crests(np.asarray(Image.open(fp).convert('RGB')).astype(int)))
