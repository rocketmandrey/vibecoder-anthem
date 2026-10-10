import numpy as np, sys
from PIL import Image
def fit(xs,ys):
    D=np.c_[xs*xs,xs*ys,ys*ys,xs,ys,np.ones_like(xs)]
    U,S,Vt=np.linalg.svd(D,full_matrices=False); return Vt[-1]
def params(c):
    A,B,C,D,E,F=c
    M=np.array([[A,B/2],[B/2,C]]); ctr=np.linalg.solve(2*M,[-D,-E])
    F2=A*ctr[0]**2+B*ctr[0]*ctr[1]+C*ctr[1]**2+D*ctr[0]+E*ctr[1]+F
    w,v=np.linalg.eigh(M); 
    ax=np.sqrt(np.abs(-F2/w)); ang=np.degrees(np.arctan2(v[1,0],v[0,0]))
    return ctr,ax,ang
def resid(c,xs,ys):
    A,B,C,D,E,F=c
    ctr,ax,ang=params(c)
    return None
def robust(xs,ys,it=6):
    m=np.ones(len(xs),bool)
    for _ in range(it):
        c=fit(xs[m],ys[m]); 
        A,B,C,D,E,F=c; ctr,ax,ang=params(c)
        # approx distance via normalised algebraic
        v=A*xs**2+B*xs*ys+C*ys**2+D*xs+E*ys+F
        gx=2*A*xs+B*ys+D; gy=B*xs+2*C*ys+E
        d=np.abs(v)/np.hypot(gx,gy)
        th=max(np.percentile(d[m],85)*1.5,2)
        m=d<th
    return c,m
n=int(sys.argv[1])
a=np.asarray(Image.open('ref/f/%04d.jpg'%n).convert('RGB')).astype(int)
cols={'yellow':(233,198,65),'peri':(125,130,200),'cyan':(90,199,202),'orange':(240,170,65),'pink':(225,50,110),'green':(70,190,140)}
ys0,xs0=np.mgrid[0:1080,0:1920]
for k,col in cols.items():
    d=np.abs(a-np.array(col)).sum(-1); m=d<45
    xs=xs0[m].astype(float); ys=ys0[m].astype(float)
    print(k,len(xs))
    if len(xs)<200: continue
    sel=np.random.RandomState(0).choice(len(xs),min(len(xs),6000),replace=False)
    c,mm=robust(xs[sel],ys[sel]); ctr,ax,ang=params(c)
    print('  ctr',ctr.round(0),'axes',ax.round(0),'ang',round(ang,1),'inl',mm.sum())
