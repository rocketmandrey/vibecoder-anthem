import numpy as np, json, sys
from PIL import Image, ImageFilter, ImageDraw
P=json.load(open('out/qa_B/poly.json'))
# neuron points (dense) from polylines, excluding bottom noise & soma neighbourhood
pts=[]
for o in P:
    p=o['p']
    for (x1,y1),(x2,y2) in zip(p,p[1:]):
        n=max(1,int(np.hypot(x2-x1,y2-y1)/3))
        for k in range(n): pts.append((x1+(x2-x1)*k/n,y1+(y2-y1)*k/n))
pts=np.array(pts); pts=pts[np.hypot(pts[:,0]-960,pts[:,1]-250)>110]
pts=pts[pts[:,1]<900]
print(len(pts))
def mask(n):
    a=np.asarray(Image.open('ref/f/%04d.jpg'%n).convert('RGB').resize((960,540))).astype(int)
    mx=a.max(-1); mn=a.min(-1)
    m=((mx>110)&((mx-mn)>70)).astype(np.uint8)*255
    m=Image.fromarray(m).filter(ImageFilter.MaxFilter(3))
    return np.asarray(m)>0
res={}
for n in range(int(sys.argv[1]),int(sys.argv[2])+1):
    M=mask(n); best=(-1,)
    cnt=M.sum()
    for s in np.arange(0.8,3.0,0.04):
        for tx in (-10,0,10):
            for ty in range(-150,800,6):
                X=((pts[:,0]-960)*s+960+tx)/2; Y=((pts[:,1]-250)*s+ty)/2
                ok=(X>=0)&(X<960)&(Y>=0)&(Y<540)
                if ok.sum()<len(pts)*0.15: continue
                v=M[Y[ok].astype(int),X[ok].astype(int)]
                prec=v.mean(); cov=ok.mean()
                sc=prec*(0.3+0.7*cov)
                if sc>best[0]: best=(sc,s,tx,ty,prec,cov)
    # refine
    sc,s0,tx0,ty0,_,_=best
    for s in np.arange(s0-0.05,s0+0.051,0.01):
        for tx in range(tx0-6,tx0+7,3):
            for ty in range(ty0-8,ty0+9,2):
                X=((pts[:,0]-960)*s+960+tx)/2; Y=((pts[:,1]-250)*s+ty)/2
                ok=(X>=0)&(X<960)&(Y>=0)&(Y<540)
                if ok.sum()<len(pts)*0.1: continue
                v=M[Y[ok].astype(int),X[ok].astype(int)]
                sc=v.mean()*(0.3+0.7*ok.mean())
                if sc>best[0]: best=(sc,s,tx,ty,v.mean(),ok.mean())
    print(n,[round(float(x),3) for x in best],flush=True); res[n]=best
