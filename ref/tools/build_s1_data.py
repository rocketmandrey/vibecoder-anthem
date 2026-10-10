# regenerates the data block (/*TAB*/ ... /*END*/) inside src/wonder/s1_clawd.js from ref/clawd_track.json
import json, re
T={o['f']:o for o in json.load(open('ref/clawd_track.json'))}
LU=[-130,-68,68,129.5]
def legs(o):
    L=o['legs']; ok=[l for l in L if l]; ml=round(sum(l[2] for l in ok)/len(ok),1) if ok else 60
    res=[]
    for k,l in enumerate(L):
        if l is None: res+=[round(LU[k]*o['w']/351,1),22,ml,0]
        else: res+=[round(l[0],1),round(l[1]),round(l[2],1),round(l[3],1)]
    return res
def arm(a,side):
    if a is None: return [side*206,15,0,50,47]
    u,v,th,ln,tk=a[0],a[1],a[2],a[3],a[4]
    r=th%90; r=r if r<=45 else r-90   # distance to nearest axis
    if abs(r)<8:
        q=round(th/90)
        if q%2: ln,tk=tk,ln
        th=0
    return [round(u),round(v),th,round(ln),round(tk)]
def eye(e):
    return [round(v) for v in e] if e else None
def row(o):
    return [o['cx'],o['cy'],o['a'],o['w'],o['h'],legs(o),arm(o['arms']['L'],-1),arm(o['arms']['R'],1),eye(o['eyes'][0]),eye(o['eyes'][1])]
TAB={}
for f in list(range(33,154,2))+list(range(717,766,2)):
    TAB[f]=row(T[f])
for f in range(31,14,-2):
    k=0; s=f
    while s not in TAB: s+=6; k+=1
    r=list(TAB[s]); r[0]=round(r[0]-150*k,1); TAB[f]=r
js=json.dumps({str(k):v for k,v in sorted(TAB.items())},separators=(',',':'))
p='src/wonder/s1_clawd.js'; s=open(p).read()
s=re.sub(r'/\*TAB\*/.*?/\*END\*/',lambda m:'/*TAB*/'+js+'/*END*/',s,flags=re.S)
open(p,'w').write(s); print(len(js),'bytes')
