# segment the reference soup (frame 183) into flat-colour regions -> star-shaped polygons (24 rays) for K.soup
import numpy as np, json, sys
from PIL import Image, ImageFilter, ImageDraw
n=int(sys.argv[1]) if len(sys.argv)>1 else 183
K_=int(sys.argv[2]) if len(sys.argv)>2 else 18
im=Image.open('ref/f/%04d.jpg'%n).convert('RGB').resize((480,270),Image.NEAREST).filter(ImageFilter.MedianFilter(7))
a=np.asarray(im).astype(float); H,W,_=a.shape
X=a.reshape(-1,3); rs=np.random.RandomState(1); C=X[rs.choice(len(X),K_,replace=False)]
for _ in range(25):
    d=((X[:,None,:]-C[None])**2).sum(-1); L=d.argmin(1)
    for k in range(K_):
        if (L==k).any(): C[k]=X[L==k].mean(0)
L=L.reshape(H,W)
# majority filter 7x7
oh=np.stack([(L==k) for k in range(K_)]).astype(np.float32)
from numpy.lib.stride_tricks import sliding_window_view
def box(m,r=3):
    p=np.pad(m,r,mode='edge'); out=np.zeros_like(m)
    for dy in range(2*r+1):
        for dx in range(2*r+1): out+=p[dy:dy+H,dx:dx+W]
    return out
cnt=np.stack([box(oh[k]) for k in range(K_)]); L=cnt.argmax(0)
np.save('out/qa_B/L%d.npy'%n,L); np.save('out/qa_B/C%d.npy'%n,C); sys.exit(0)   # blobs2.py does the rest
# components
seen=np.zeros((H,W),bool); comps=[]
for y in range(H):
    for x in range(W):
        if seen[y,x]: continue
        k=L[y,x]; st=[(y,x)]; seen[y,x]=True; pts=[]
        while st:
            cy,cx=st.pop(); pts.append((cy,cx))
            for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
                ny,nx=cy+dy,cx+dx
                if 0<=ny<H and 0<=nx<W and not seen[ny,nx] and L[ny,nx]==k: seen[ny,nx]=True; st.append((ny,nx))
        if len(pts)>=60: comps.append((k,pts))
out=[]
for k,pts in comps:
    P=np.array(pts); cy,cx=P.mean(0)
    ang=np.arctan2(P[:,0]-cy,P[:,1]-cx); r=np.hypot(P[:,0]-cy,P[:,1]-cx)
    poly=[]
    for i in range(24):
        a0=-np.pi+i*2*np.pi/24; m=(ang>=a0-.13)&(ang<a0+2*np.pi/24+.13)
        rr=np.percentile(r[m],98) if m.any() else 0
        a1=a0+np.pi/24; poly.append((cx+np.cos(a1)*rr, cy+np.sin(a1)*rr))
    out.append({'k':int(k),'col':[int(v) for v in C[k]],'area':len(pts),'cx':cx*4,'cy':cy*4,'poly':[[round(x*4),round(y*4)] for x,y in poly]})
out.sort(key=lambda o:-o['area'])
json.dump(out,open('out/qa_B/blobs.json','w'))
for o in out[:40]: print(o['col'],o['area'],round(o['cx']),round(o['cy']))
pv=Image.new('RGB',(1920,1080),(10,10,10)); d=ImageDraw.Draw(pv)
for o in out: d.polygon([tuple(p) for p in o['poly']],fill=tuple(o['col']))
pv.resize((960,540)).save('out/qa_B/blobs.png')
