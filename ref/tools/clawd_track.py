# tracks Clawd per reference frame in BODY coordinates -> ref/clawd_track.json
# body = rotated orange rect (cx,cy,a,w,h; orange only, ink outline excluded); legs/arms/eyes expressed in the body frame (u right, v down, origin = body centre)
import numpy as np, json, sys
from PIL import Image
def load(n): return np.asarray(Image.open(f'ref/f/{n:04d}.jpg').convert('RGB')).astype(int)
def runs(a):
    idx=np.flatnonzero(a)
    if not len(idx): return []
    sp=np.flatnonzero(np.diff(idx)>1); st=np.r_[idx[0],idx[sp+1]]; en=np.r_[idx[sp],idx[-1]]
    return list(zip(st.tolist(),en.tolist()))
def body_fit(xs,ys,a,ox,oy):
    c,s=np.cos(a),np.sin(a); u=(xs-ox)*c+(ys-oy)*s; v=-(xs-ox)*s+(ys-oy)*c
    vi=np.round(v).astype(int); vmin=vi.min(); cnt=np.bincount(vi-vmin)
    rows=np.flatnonzero(cnt>0.6*cnt.max()); vt,vb=rows.min()+vmin,rows.max()+vmin
    sel=(vi>=vt)&(vi<=vb); ui=np.round(u[sel]).astype(int); umin=ui.min(); cu=np.bincount(ui-umin)
    cols=np.flatnonzero(cu>=0.7*(vb-vt+1)); ul,ur=cols.min()+umin,cols.max()+umin
    return u,v,ul,ur,vt,vb
def track(n):
    im=load(n); R,G,B=im[...,0],im[...,1],im[...,2]
    m=(R>170)&(R-B>70)&(G>70)&(G<160)&(R-G>40)
    ys,xs=np.nonzero(m)
    if len(xs)<30: return None
    o={'f':n,'t':round((n-1)/24,4),'n':int(len(xs))}
    if xs.min()<=0 or xs.max()>=1919 or ys.min()<=0 or ys.max()>=1079: o['clipped']=True; o['bbox']=[int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())]; return o
    xs=xs.astype(float); ys=ys.astype(float)
    ox,oy=xs.mean(),ys.mean(); a=0.
    for it in range(4):
        u,v,ul,ur,vt,vb=body_fit(xs,ys,a,ox,oy)
        # refine angle from top edge slope in the current frame
        sel=(u>ul+8)&(u<ur-8)&(v<vt+12)&(v>vt-6)
        # top-edge: min v per u column
        uu=np.round(u[sel]).astype(int); vv=v[sel]; ks=np.unique(uu)
        top=np.array([vv[uu==k].min() for k in ks]); p=np.polyfit(ks,top,1); a+=np.arctan(p[0])
        # recentre
        c,s=np.cos(a),np.sin(a)
    u,v,ul,ur,vt,vb=body_fit(xs,ys,a,ox,oy)
    cu,cv=(ul+ur)/2,(vt+vb)/2; c,s=np.cos(a),np.sin(a)
    # centre in image coords: rotate (cu,cv) back
    cx=ox+cu*c-cv*s; cy=oy+cu*s+cv*c
    o.update(cx=round(cx,1),cy=round(cy,1),a=round(float(np.degrees(a)),2),w=int(ur-ul+1),h=int(vb-vt+1))
    # body-frame coords relative to the centre
    uu=u-cu; vv=v-cv; hw,hh=(ur-ul+1)/2,(vb-vt+1)/2
    leg=vv>hh+1
    legs=[]
    lu,lv=uu[leg],vv[leg]
    DEF=[-130,-68,68,129.5]
    for k in range(4):
        # leg top centre: pixels in the first rows below the body, nearest the default slot
        sel0=(lv>hh+3)&(lv<hh+14)&(abs(lu-DEF[k]*(2*hw)/351)<30)
        if sel0.sum()<8: legs.append(None); continue
        ut=float(np.median(lu[sel0])); ang=0.
        for it in range(3):
            m_=(lv>hh+3)&(abs(lu-(ut+np.tan(ang)*(lv-hh)))<20)
            if m_.sum()<30: break
            B_=np.polyfit(lv[m_],lu[m_],1); ang=np.arctan(B_[0]); ut=float(B_[1]+B_[0]*hh)
        m_=(lv>hh+3)&(abs(lu-(ut+np.tan(ang)*(lv-hh)))<20)
        if m_.sum()<30: legs.append(None); continue
        wd=float(np.percentile(abs(lu[m_]-(ut+np.tan(ang)*(lv[m_]-hh))),90))*2
        ln=float((lv[m_].max()-hh)/np.cos(ang))
        legs.append([round(ut,1),round(wd,1),round(ln,1),round(float(np.degrees(ang)),1)])
    o['legs']=legs
    arms={}
    for k,side in (('L',uu<-hw-4),('R',uu>hw+4)):
        sel=side&(vv<hh+30)&(vv>-hh-250)
        if sel.sum()<60: arms[k]=None; continue
        px,py=uu[sel],vv[sel]; best=None
        for th in np.arange(-90,90,2):
            r=np.radians(th); p=px*np.cos(r)+py*np.sin(r); q=-px*np.sin(r)+py*np.cos(r)
            P0,P1,Q0,Q1=np.percentile(p,1),np.percentile(p,99),np.percentile(q,1),np.percentile(q,99); A=(P1-P0)*(Q1-Q0)
            if best is None or A<best[0]: best=(A,th,(P1+P0)/2,(Q1+Q0)/2,P1-P0,Q1-Q0)
        _,th,pc,qc,pl,ql=best; r=np.radians(th)
        arms[k]=[round(float(pc*np.cos(r)-qc*np.sin(r)),1),round(float(pc*np.sin(r)+qc*np.cos(r)),1),int(th),round(float(pl),1),round(float(ql),1),int(sel.sum())]  # centre u,v; angle; extent along angle; across
    o['arms']=arms
    # eyes: dark pixels inside the body (body frame)
    d=(R<80)&(G<70)&(B<70)
    dy,dx=np.nonzero(d); dx=dx.astype(float); dy=dy.astype(float)
    du=(dx-ox)*c+(dy-oy)*s-cu; dv=-(dx-ox)*s+(dy-oy)*c-cv
    sel=(abs(du)<hw-14)&(abs(dv)<hh-14); eyes=[]
    for side in (du<0,du>=0):
        q=sel&side
        eyes.append(None if q.sum()<6 else [round(float(du[q].min()),1),round(float(dv[q].min()),1),round(float(du[q].max()),1),round(float(dv[q].max()),1),int(q.sum())])
    o['eyes']=eyes
    return o
if __name__=='__main__':
    out=[]
    for n in list(range(1,181))+list(range(691,767)):
        r=track(n); out.append(r if r else {'f':n,'t':round((n-1)/24,4),'none':True})
    json.dump(out,open('ref/clawd_track.json','w'))
