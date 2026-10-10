# trace2.py: gold neuron of ref frame 226 (clean yellow-on-navy) -> main + neighbour polylines (poly2.json). neuron space = ref pixels.
import numpy as np, json
from PIL import Image, ImageFilter
exec(open('ref/tools/skel.py').read().split('def zs')[1].join(['def zs','']).split('# drop small')[0]) if False else None
src=open('ref/tools/skel.py').read(); i=src.index('def zs'); j=src.index('# drop small'); exec(src[i:j])
im=np.asarray(Image.open('ref/f/0226.jpg').convert('RGB')).astype(int)
R,G,B=im[...,0],im[...,1],im[...,2]
m=((R>100)&(G>65)&(B<150)&(R-B>28)); m[:3,:]=False; m[955:,:]=False   # bottom: next-frame bolt start
def filt(a,f,n): return np.asarray(Image.fromarray((a*255).astype('uint8')).filter(f(n)))>0
mc=filt(filt(m,ImageFilter.MaxFilter,3),ImageFilter.MinFilter,3)
core=filt(mc,ImageFilter.MinFilter,9)               # soma blobs
# soma centres via components of core
def comps(pts):
    pts=set(pts); out=[]
    while pts:
        p=pts.pop(); st=[p]; c=[p]
        while st:
            q=st.pop()
            for dx in (-1,0,1):
                for dy in (-1,0,1):
                    n=(q[0]+dx,q[1]+dy)
                    if n in pts: pts.discard(n); st.append(n); c.append(n)
        out.append(c)
    return out
ys,xs=np.nonzero(core); cs=[c for c in comps(zip(xs.tolist(),ys.tolist())) if len(c)>=8]
cen=[(sum(x for x,_ in c)/len(c),sum(y for _,y in c)/len(c),len(c)) for c in cs]
NBP=[(250,164),(1690,302),(518,552),(1382,629),(240,797),(1709,836),(960,250)]
cen=[c for c in cen if any(np.hypot(c[0]-a,c[1]-b)<30 for a,b in NBP)]
print('somas',[(round(a),round(b),n) for a,b,n in cen])
sk=zs(mc)
H,W=sk.shape; yy,xx=np.mgrid[:H,:W]
for (cx,cy,n) in cen:
    r=44 if n>300 else 6
    sk[((xx-cx)/(r*1.0))**2+((yy-cy)/(r*.92))**2<1]=False
# axon centreline removal
AX=[[968,300],[970,350],[978,385],[963,425],[962,470],[968,495],[968,520],[972,545],[979,580],[975,610],[982,650],[985,670],[978,700],[983,730],[975,750],[982,780],[970,820],[972,850],[968,880],[966,905],[962,930],[968,955]]
ax=np.array(AX,float)
def axX(y): return np.interp(y,ax[:,1],ax[:,0])
ys,xs=np.nonzero(sk)
cut=(ys>=292)&(ys<=900)&(np.abs(xs-axX(ys))<9)
sk[ys[cut],xs[cut]]=False
pts=set(zip(*[a.tolist() for a in np.nonzero(sk)][::-1]))
N8=[(-1,-1),(0,-1),(1,-1),(-1,0),(1,0),(-1,1),(0,1),(1,1)]
def nbrs(p): return [(p[0]+dx,p[1]+dy) for dx,dy in N8 if (p[0]+dx,p[1]+dy) in pts]
keep=set()
for c in comps(pts):
    if len(c)>=14: keep|=set(c)
pts=keep; deg={p:len(nbrs(p)) for p in pts}
nodes={p for p in pts if deg[p]!=2}
cid={}; cl=[]
for p in nodes:
    if p in cid: continue
    st=[p]; cid[p]=len(cl); c=[p]
    while st:
        q=st.pop()
        for n in nbrs(q):
            if n in nodes and n not in cid: cid[n]=len(cl); st.append(n); c.append(n)
    cl.append(c)
cc=[(sum(x for x,_ in c)/len(c), sum(y for _,y in c)/len(c)) for c in cl]
used=set(); paths=[]
for a in nodes:
    for b in nbrs(a):
        if b in nodes or b in used: continue
        path=[b]; used.add(b); prev=a; cur=b; end=None
        while True:
            nx=[n for n in nbrs(cur) if n!=prev]
            if not nx: break
            n=nx[0]
            if n in nodes: end=n; break
            if n in used: break
            used.add(n); path.append(n); prev,cur=cur,n
        paths.append([cc[cid[a]]]+path+([cc[cid[end]]] if end else []))
# closed loops without nodes are ignored
def rdp(P,eps):
    if len(P)<3: return P
    a=np.array(P[0],float); b=np.array(P[-1],float); d=b-a; L=np.hypot(*d); pp=np.array(P,float)
    dist=np.abs(d[0]*(pp[:,1]-a[1])-d[1]*(pp[:,0]-a[0]))/L if L>0 else np.hypot(*(pp-a).T)
    i=int(dist.argmax())
    if dist[i]>eps: return rdp(P[:i+1],eps)[:-1]+rdp(P[i:],eps)
    return [P[0],P[-1]]
mm=m
out=[]
for p in paths:
    if len(p)<2: continue
    cnt=0
    for (x,y) in [(int(round(a)),int(round(b))) for a,b in p[::2]]: cnt+=mm[max(0,y-5):y+6,max(0,x-5):x+6].sum()
    w=cnt/(len(p)/2)/11.0
    out.append((rdp(p,1.1),round(float(w),1)))
main=[];nb=[[] for _ in cen if _[2]<=300]
ncen=[c for c in cen if c[2]<=300]; mcen=[c for c in cen if c[2]>300][0]
for P,w in out:
    mx=np.mean([q[0] for q in P]); my=np.mean([q[1] for q in P])
    d0=np.hypot(mx-mcen[0],my-mcen[1]); k=min(range(len(ncen)),key=lambda i:np.hypot(mx-ncen[i][0],my-ncen[i][1])); dn=np.hypot(mx-ncen[k][0],my-ncen[k][1])
    if dn<130 and dn<d0 and abs(mx-mcen[0])>0: nb[k].append(([[round(x-ncen[k][0]),round(y-ncen[k][1])] for x,y in P],w))
    else: main.append([w,[int(round(v)) for q in P for v in q]])
res={'main':main,'nb':[{'c':[round(c[0]),round(c[1])],'arms':[[w,[v for q in P for v in q]] for P,w in a]} for c,a in zip(ncen,nb)],'soma':[round(mcen[0]),round(mcen[1])]}
json.dump(res,open('out/qa_B/poly2.json','w'))
print(len(main),sum(len(a[1])//2 for a in main),[ (n['c'],len(n['arms'])) for n in res['nb']])
pv=Image.new('RGB',(1920,1080),'white'); from PIL import ImageDraw; d=ImageDraw.Draw(pv)
for w,P in main: d.line([(P[i],P[i+1]) for i in range(0,len(P),2)],fill=(0,0,0),width=1)
for n in res['nb']:
    for w,P in n['arms']: d.line([(n['c'][0]+P[i],n['c'][1]+P[i+1]) for i in range(0,len(P),2)],fill=(200,0,0),width=1)
pv.resize((960,540)).save('out/qa_B/poly2.png')
