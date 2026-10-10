# step 2 of blobs.py: boundary-trace the label map (out/qa_B/L.npy,C.npy) -> compact polygon JS array on stdout
import numpy as np, json, sys
L=np.load('out/qa_B/L.npy'); C=np.load('out/qa_B/C.npy'); H,W=L.shape
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
        if len(pts)>=45: comps.append((k,pts))
D=[(1,0),(1,1),(0,1),(-1,1),(-1,0),(-1,-1),(0,-1),(1,-1)]
def trace(mask):
    ys,xs=np.nonzero(mask); y0=ys.min(); x0=xs[ys==y0].min()
    P=[(y0,x0)]; cur=(y0,x0); back=(y0,x0-1)
    for _ in range(20000):
        i=D.index((back[0]-cur[0],back[1]-cur[1])); found=False
        for j in range(1,9):
            d=D[(i+j)%8]; n=(cur[0]+d[0],cur[1]+d[1])
            if 0<=n[0]<H and 0<=n[1]<W and mask[n]:
                pd=D[(i+j-1)%8]; back=(cur[0]+pd[0],cur[1]+pd[1]); cur=n; found=True; break
        if not found or cur==(y0,x0): break
        P.append(cur)
    return P
def rdp(P,eps):
    if len(P)<3: return P
    a=np.array(P[0],float); b=np.array(P[-1],float); d=b-a; Ln=np.hypot(*d); pp=np.array(P,float)
    dist=np.abs(d[0]*(pp[:,1]-a[1])-d[1]*(pp[:,0]-a[0]))/Ln if Ln>0 else np.hypot(*(pp-a).T)
    i=int(dist.argmax())
    if dist[i]>eps: return rdp(P[:i+1],eps)[:-1]+rdp(P[i:],eps)
    return [P[0],P[-1]]
out=[]
for k,pts in comps:
    col=C[k]
    if col.sum()<135: continue
    m=np.zeros((H,W),bool)
    for y,x in pts: m[y,x]=True
    P=trace(m)
    if len(P)<8 or len(pts)/len(P)<2.6: continue          # thin streaks = ring lines
    S=rdp(P+[P[0]],1.0)[:-1]
    out.append((len(pts),[int(v) for v in col],[[int(x*4+2-960),int(y*4+2-540)] for y,x in S]))
out.sort(key=lambda o:-o[0])
print('[' + ','.join('[%d,%d,%d,[%s]]'%(c[0],c[1],c[2],','.join('%d,%d'%(x,y) for x,y in P)) for _,c,P in out)+']')
sys.stderr.write('%d blobs, %d pts\n'%(len(out),sum(len(o[2]) for o in out)))
