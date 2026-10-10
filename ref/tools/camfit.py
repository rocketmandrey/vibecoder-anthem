# camfit.py n0 n1: per ref file fit camera (s, ox, oy) of the neuron skeleton (out/qa_B/poly2.json main) to the bright line pixels
import sys, json, numpy as np
from PIL import Image, ImageFilter
P=json.load(open('out/qa_B/poly2.json'))['main']
pts=[]
for w,f in P:
    q=np.array(f,float).reshape(-1,2)
    for a,b in zip(q[:-1],q[1:]):
        L=np.hypot(*(b-a)); n=max(1,int(L/5))
        for k in range(n): pts.append(a+(b-a)*k/n)
pts=np.array(pts); pts=pts[np.hypot(pts[:,0]-960,pts[:,1]-250)>70]
for n in range(int(sys.argv[1]),int(sys.argv[2])+1):
    im=Image.open('ref/f/%04d.jpg'%n).convert('RGB').resize((960,540)); a=np.asarray(im).astype(int)
    R,G,B=a[...,0],a[...,1],a[...,2]
    m=(((B>170)&(R>100)&(G<170))|((R>200)&(G>150)&(B<150)))   # purple or gold lines
    mi=Image.fromarray((m*255).astype('uint8')).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(2)); M=np.asarray(mi).astype(float)/255
    def score(s,ox,oy):
        x=(960+s*(pts[:,0]-960)+ox)/2; y=(oy+s*(pts[:,1]-250))/2
        ok=(x>=0)&(x<960)&(y>=0)&(y<540)
        if ok.sum()<40: return -1
        return M[y[ok].astype(int),x[ok].astype(int)].mean()*min(1,ok.sum()/400)
    best=(-1,)
    for s in np.arange(float(sys.argv[3]) if len(sys.argv)>3 else .9,float(sys.argv[4]) if len(sys.argv)>4 else 3.01,.05):
        for oy in np.arange(-100,700,20):
            for ox in (-10,0,10):
                v=score(s,ox,oy)
                if v>best[0]: best=(v,s,ox,oy)
    v,s0,ox0,oy0=best
    for s in np.arange(s0-.06,s0+.061,.01):
        for oy in np.arange(oy0-20,oy0+21,3):
            for ox in np.arange(ox0-10,ox0+11,3):
                v2=score(s,ox,oy)
                if v2>best[0]: best=(v2,s,ox,oy)
    print(n,'score %.2f s %.2f ox %d oy %d'%best)
