# mkfit.py: merge out/qa_C/fit_*.json -> smoothed key table, patched into src/wonder/s3_light.js between FIT-BEGIN / FIT-END
import json,math,re,numpy as np
a=json.load(open('out/qa_C/fit_289_301.json')); b=json.load(open('out/qa_C/fit_302_328.json'))
rows={}
for d,lo,hi in ((a,300,301),(b,302,328)):
    for k,v in d.items():
        if lo<=int(k)<=hi: rows[int(k)]=v
fs=sorted(rows); TAU=2*math.pi
Q=[];prev=None
for f in fs:
    v=rows[f]; q=v['rot']+TAU*v['sc']/v['p']
    if prev is not None:
        pred=prev+0.15; q+=TAU*round((pred-q)/TAU)
    Q.append(q); prev=q
cols={'F':[rows[f]['F'] for f in fs],'psi':[rows[f]['psi'] for f in fs],'dc':[rows[f]['dc'] for f in fs],'p':[rows[f]['p'] for f in fs],'cx':[rows[f]['cx'] for f in fs],'cy':[rows[f]['cy'] for f in fs],'ox':[rows[f].get('ox',0) for f in fs],'Q':Q}
w=np.array([.054,.244,.403,.244,.054])
def smooth(x):
    x=np.array(x,float); p=np.pad(x,2,mode='reflect',reflect_type='odd') if False else np.concatenate([[2*x[0]-x[2],2*x[0]-x[1]],x,[2*x[-1]-x[-2],2*x[-1]-x[-3]]])
    return np.convolve(p,w,mode='valid')
S={k:smooth(v) for k,v in cols.items()}
lines=['  const FITK = ['+',\n    '.join('[%d, %.1f, %.4f, %.1f, %.1f, %.1f, %.1f, %.1f, %.4f]'%(f,S['F'][i],S['psi'][i],S['dc'][i],S['p'][i],S['cx'][i],S['cy'][i],S['ox'][i],S['Q'][i]) for i,f in enumerate(fs))+'];']
blk='  // FIT-BEGIN (ref/tools/mkfit.py: per-frame camera fit [f, F, psi, dc, p, cx, cy, ox, Q=rot+2*pi*sc/p])\n'+'\n'.join(lines)+'\n  // FIT-END'
p='src/wonder/s3_light.js'; s=open(p).read()
if 'FIT-BEGIN' in s: s=re.sub(r'  // FIT-BEGIN.*?// FIT-END',lambda m:blk,s,flags=re.S)
else: s=s.replace("  const hs = (i, k)",blk+"\n  const hs = (i, k)",1)
open(p,'w').write(s); print(len(fs),'rows')
