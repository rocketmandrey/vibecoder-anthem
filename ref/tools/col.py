import sys,numpy as np
from PIL import Image
def load(n): return np.asarray(Image.open(f'/Users/andreiovcharenko/orca/workspaces/vibecoder-anthem/clawd-wonder/ref/f/{n:04d}.jpg').convert('RGB')).astype(int)
def runs(a,thr=40):
    out=[];s=0
    for i in range(1,len(a)+1):
        if i==len(a) or np.abs(a[i]-a[s]).sum()>thr:
            if i-s>=3: out.append((s,i-1,tuple(a[(s+i)//2])))
            s=i
    return out
if __name__=='__main__':
    n=int(sys.argv[1]); x=int(sys.argv[2]); im=load(n)
    for r in runs(im[:,x]): print(r)
