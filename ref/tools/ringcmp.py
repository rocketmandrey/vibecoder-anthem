# ringcmp.py file...: ring-colour pixel extents ours (out/qa_B/st/tX_YY.png) vs ref
import sys, numpy as np
from PIL import Image
cols={'yel':(233,198,65),'peri':(125,130,200),'cyan':(90,199,202),'orng':(240,170,65),'pink':(232,56,110),'grn':(88,190,140)}
def ext(a,c):
    m=np.abs(a-np.array(c)).sum(-1)<45; ys,xs=np.nonzero(m)
    if len(xs)<100: return None
    return [int(v) for v in (np.percentile(xs,2),np.percentile(xs,98),np.percentile(ys,2),np.percentile(ys,98),len(xs)//10)]
for n in map(int,sys.argv[1:]):
    t=(n-1)/24; f='out/qa_B/st/t%s.png'%('%.2f'%t).replace('.','_')
    a=np.asarray(Image.open(f).convert('RGB')).astype(int); b=np.asarray(Image.open('ref/f/%04d.jpg'%n).convert('RGB').resize((1920,1080))).astype(int)
    print('file',n)
    for k,c in cols.items(): print(' ',k,'ours',ext(a,c),'ref',ext(b,c))
