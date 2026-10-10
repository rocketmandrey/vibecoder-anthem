import numpy as np, json
from PIL import Image
sk=np.load('out/qa_B/sk.npy'); 
im=np.asarray(Image.open('ref/f/0227.jpg').convert('L')).astype(int); dark=im<136
H,W=sk.shape; cx,cy,rx,ry=960,250,56,50
ys,xs=np.nonzero(sk)
inside=((xs-cx)/(rx*1.1))**2+((ys-cy)/(ry*1.1))**2<1
sk[ys[inside],xs[inside]]=False
pts=set(zip(*[a.tolist() for a in np.nonzero(sk)][::-1]))  # (x,y)
N8=[(-1,-1),(0,-1),(1,-1),(-1,0),(1,0),(-1,1),(0,1),(1,1)]
def nbrs(p): return [(p[0]+dx,p[1]+dy) for dx,dy in N8 if (p[0]+dx,p[1]+dy) in pts]
deg={p:len(nbrs(p)) for p in pts}
# components
seen=set(); comps=[]
for p in pts:
    if p in seen: continue
    st=[p]; seen.add(p); c=[]
    while st:
        q=st.pop(); c.append(q)
        for n in nbrs(q):
            if n not in seen: seen.add(n); st.append(n)
    comps.append(c)
keep=set()
for c in comps:
    if len(c)>=28: keep|=set(c)
pts=keep; deg={p:len(nbrs(p)) for p in pts}
nodes={p for p in pts if deg[p]!=2}
# cluster adjacent nodes
cid={}; cl=[]
for p in nodes:
    if p in cid: continue
    st=[p]; cid[p]=len(cl); c=[p]
    while st:
        q=st.pop()
        for n in nbrs(q):
            if n in nodes and n not in cid: cid[n]=len(cl); st.append(n); c.append(n)
    cl.append(c)
cen=[(sum(x for x,_ in c)/len(c), sum(y for _,y in c)/len(c)) for c in cl]
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
        P=[cen[cid[a]]]+path+([cen[cid[end]]] if end else [])
        paths.append(P)
def rdp(P,eps):
    if len(P)<3: return P
    a=np.array(P[0],float); b=np.array(P[-1],float); d=b-a; L=np.hypot(*d)
    pp=np.array(P,float)
    dist=np.abs(d[0]*(pp[:,1]-a[1])-d[1]*(pp[:,0]-a[0]))/L if L>0 else np.hypot(*(pp-a).T)
    i=int(dist.argmax())
    if dist[i]>eps: return rdp(P[:i+1],eps)[:-1]+rdp(P[i:],eps)
    return [P[0],P[-1]]
out=[]
for p in paths:
    if len(p)<5: continue
    s=rdp(p,1.6)
    # width: dark pixels within 7 px corridor / length
    arr=np.array(p); cnt=0
    for (x,y) in [(int(round(a)),int(round(b))) for a,b in p[::2]]:
        cnt+=dark[max(0,y-6):y+7,max(0,x-6):x+7].sum()
    w=cnt/ (len(p)/2) / 13.0
    pa=np.array(p,float); ch=pa[-1]-pa[0]; Lc=np.hypot(*ch)
    if Lc>90:
        dev=np.abs(ch[0]*(pa[:,1]-pa[0,1])-ch[1]*(pa[:,0]-pa[0,0])).max()/Lc
        if dev<3.5: continue
    out.append({'p':[[int(round(x)),int(round(y))] for x,y in s],'w':round(float(w),1)})
print(len(out), sum(len(o['p']) for o in out))
json.dump(out,open('out/qa_B/poly.json','w'))
# preview
from PIL import ImageDraw
pv=Image.new('RGB',(1920,1080),'white'); d=ImageDraw.Draw(pv)
for o in out: d.line([tuple(q) for q in o['p']],fill=(0,0,0),width=1)
pv.save('out/qa_B/poly.png')
