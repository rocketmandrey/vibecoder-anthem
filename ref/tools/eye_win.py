# measures the left-eye window (dark rounded rect, later full of soup) per frame during the push-in / pull-out -> ref/eye_win.json
import numpy as np, json
from PIL import Image
from collections import deque
def load(n): return np.asarray(Image.open(f'ref/f/{n:04d}.jpg').convert('RGB')).astype(int)
def win(n,seed):
    im=load(n); R,G,B=im[...,0],im[...,1],im[...,2]
    orange=(R>150)&(R-B>55)&(R-G>25)
    paper=(R+G+B>600)&(R-B<28)
    mask=~orange&~paper
    # also drop thin ink lines: erode 2px by requiring 5x5 neighbourhood
    m=mask[::2,::2]; 
    k=np.zeros_like(m); 
    for dy in (-1,0,1):
        for dx in (-1,0,1): k|= False
    from numpy.lib.stride_tricks import sliding_window_view as sw
    p=np.pad(m,2); e=sw(p,(5,5)).all((2,3))
    H,W=e.shape; sx,sy=int(seed[0]/2),int(seed[1]/2)
    # find nearest eroded pixel to seed
    ys,xs=np.nonzero(e)
    if not len(xs): return None
    i=np.argmin((xs-sx)**2+(ys-sy)**2); st=(ys[i],xs[i])
    seen=np.zeros_like(e); dq=deque([st]); seen[st]=1
    while dq:
        y,x=dq.popleft()
        for dy,dx in((1,0),(-1,0),(0,1),(0,-1)):
            yy,xx=y+dy,x+dx
            if 0<=yy<H and 0<=xx<W and e[yy,xx] and not seen[yy,xx]: seen[yy,xx]=1; dq.append((yy,xx))
    ys,xs=np.nonzero(seen)
    return [int(xs.min()*2-2),int(ys.min()*2-2),int(xs.max()*2+2),int(ys.max()*2+2),int(len(xs))]
if __name__=='__main__':
    out={}
    T={o['f']:o for o in json.load(open('ref/clawd_track.json'))}
    o=T[150]; import math
    a=math.radians(o['a']); u,v=-94,-16
    seed=(o['cx']+u*math.cos(a)-v*math.sin(a), o['cy']+u*math.sin(a)+v*math.cos(a))
    for rng in (range(150,182),range(721,690,-1)):
        s=seed if rng[0]==150 else None
        if s is None:
            s=(out[721][0]/2+out[721][2]/2, out[721][1]/2+out[721][3]/2)
        for n in rng:
            r=win(n,s)
            if r is None: continue
            out[n]=r; s=((r[0]+r[2])/2,(r[1]+r[3])/2)
            print(n,r)
    json.dump(out,open('ref/eye_win.json','w'))
