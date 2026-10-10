import sys,numpy as np
from col import load
from bands import cls
out=[]
for n in list(range(254,290)):
    k=cls(load(n)); xs=[];T=[];B=[]
    for x in range(10,1920,10):
        col=k[:,x-2:x+3]
        r=np.where((col==0).sum(1)>=3)[0]; v=np.where((col==6).sum(1)>=3)[0]
        if len(r)>15 and len(v)>15 and v.max()<1068 and r.min()>2: xs.append(x);T.append(r.min());B.append(v.max())
    if len(xs)<4: print(n,'few',len(xs)); continue
    xs=np.array(xs);pt=np.polyfit(xs,T,1);pb=np.polyfit(xs,B,1)
    res=max(abs(np.polyval(pt,xs)-T).max(),abs(np.polyval(pb,xs)-B).max())
    print(n,'xa',xs.min(),'T0 %.0f Tk %.4f B0 %.0f Bk %.4f res %.0f'%(pt[1],pt[0],pb[1],pb[0],res))
