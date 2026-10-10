# measures the left-eye window (dark rounded rect) bbox per frame in the zoom phases -> ref/clawd_win.json {frame:[x0,y0,x1,y1]}
import numpy as np, json
from PIL import Image
from collections import deque
def mask(n):
    im=np.asarray(Image.open(f'ref/f/{n:04d}.jpg').convert('RGB').resize((480,270))).astype(int)
    R,G,B=im[...,0],im[...,1],im[...,2]
    orange=(R>140)&(R-B>45)&(R-G>20)
    paper=(R+G+B>560)&(abs(R-B)<30)
    lines=(R+G+B>420)&(R-B>15)&~orange   # pencil lines etc
    return ~orange&~paper&~((R-B>15)&(R+G+B>330)), im
def bfs(m,seed):
    h,w=m.shape; sy,sx=seed
    if not m[sy,sx]:
        # find nearest true
        ys,xs=np.nonzero(m)
        if not len(xs): return None
        k=np.argmin((ys-sy)**2+(xs-sx)**2); sy,sx=ys[k],xs[k]
    seen=np.zeros_like(m); q=deque([(sy,sx)]); seen[sy,sx]=1; x0=x1=sx; y0=y1=sy; n=0
    while q:
        y,x=q.popleft(); n+=1
        x0=min(x0,x);x1=max(x1,x);y0=min(y0,y);y1=max(y1,y)
        for dy,dx in((1,0),(-1,0),(0,1),(0,-1)):
            yy,xx=y+dy,x+dx
            if 0<=yy<h and 0<=xx<w and m[yy,xx] and not seen[yy,xx]: seen[yy,xx]=1; q.append((yy,xx))
    return [x0*4,y0*4,x1*4+3,y1*4+3,n]
out={}
seed=(612//4,866//4)
for n in list(range(150,182)):
    m,_=mask(n); r=bfs(m,seed)
    if r: out[n]=r; seed=((r[1]+r[3])//8,(r[0]+r[2])//8)
    print(n,r)
seed=(135,240)
for n in range(693,722):
    pass
json.dump(out,open('ref/clawd_win.json','w'))
