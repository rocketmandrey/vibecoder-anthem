import sys,numpy as np
from col import load
P=np.array([(241,61,62),(246,138,48),(246,212,61),(71,195,107),(48,155,225),(78,84,210),(165,80,225)])
def cls(im):
    d=((im[:,:,None,:]-P[None,None])**2).sum(-1); k=d.argmin(-1); k[d.min(-1)>2500]=-1; return k
def bands(n,xs):
    k=cls(load(n)); res={}
    for x in xs:
        col=k[:,x-2:x+3]; r=[]
        for c in range(7):
            m=(col==c).sum(1)>=3; ys=np.where(m)[0]
            r.append((int(ys.min()),int(ys.max())) if len(ys)>20 else None)
        res[x]=r
    return res
if __name__=='__main__':
    n=int(sys.argv[1]); 
    for x,r in bands(n,[int(a) for a in sys.argv[2:]]).items(): print(x,r)
