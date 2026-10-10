import numpy as np, sys
from PIL import Image
def info(n):
    a=np.asarray(Image.open('ref/f/%04d.jpg'%n).convert('RGB')).astype(int)
    r,g,b=a[...,0],a[...,1],a[...,2]
    w=(r>238)&(g>235)&(b>200)
    ys,xs=np.nonzero(w)
    if len(xs)<3: return None
    # star = densest cluster: median
    sx,sy=np.median(xs),np.median(ys)
    k=(abs(xs-sx)<60)&(abs(ys-sy)<60); sx,sy=xs[k].mean(),ys[k].mean()
    cy=(abs(r-90)<40)&(abs(g-199)<35)&(abs(b-202)<35)
    yy,xx=np.nonzero(cy)
    m=(abs(xx-sx)<1100)&(abs(yy-sy)<1100)
    xx,yy=xx[m],yy[m]
    wd=(np.percentile(xx,99)-np.percentile(xx,1)) if len(xx)>50 else 0
    return round(sx),round(sy),round(wd),len(xx)
for n in map(int,sys.argv[1:]): print(n,info(n))
print('--- row scan')
def scan(n):
    a=np.asarray(Image.open('ref/f/%04d.jpg'%n).convert('RGB')).astype(int)
    i=info(n); sx,sy=i[0],i[1]
    cols={'Y':(233,198,65),'P':(125,130,200),'C':(90,199,202),'O':(240,170,65)}
    out={}
    for k,c in cols.items():
        pts=[]
        for y in range(max(0,sy-120),min(1080,sy+121),8):
            d=np.abs(a[y]-np.array(c)).sum(-1)<42; xs=np.nonzero(d)[0]
            pts+= [x-sx for x in xs]
        if pts:
            pts=np.array(pts); out[k]=(int(np.percentile(pts,5)),int(np.percentile(pts,95)), len(pts))
    return out
for n in [183,684,685,686,688,690,693,694,696,170,172,174,176,178]:
    try: print(n,scan(n))
    except Exception as e: print(n,'err',e)
print('--- u per frame')
REF={'P':(-657,518),'C':(-443,434)}
def uest(n):
    i=info(n)
    if not i: return None
    sc=scan(n); est=[]
    for k,(l,r) in REF.items():
        if k in sc and sc[k][2]>=60:
            a,b,_=sc[k]
            if a<-30 and b>30: est+= [abs(a)/abs(l), b/r]
    return (i[0],i[1], round(float(np.median(est)),3) if est else None, len(est))
for n in list(range(168,184))+list(range(680,702)):
    try: print(n, round((n-1)/24,3), uest(n))
    except Exception as e: print(n,'err')
