# fit.py "token" "v1,v2,.." f1,f2,..  : replaces TOKEN (a literal in s3_light.js, marked __X__) with each value, reports mean grayscale SSIM vs ref frames
import sys,subprocess,glob,shutil,numpy as np
from PIL import Image
def box(a,k=7):
    c=np.cumsum(np.cumsum(np.pad(a,((1,0),(1,0))),0),1); return (c[k:,k:]-c[:-k,k:]-c[k:,:-k]+c[:-k,:-k])/(k*k)
def ssim(x,y):
    x=x.astype(float);y=y.astype(float);mx,my=box(x),box(y);vx=box(x*x)-mx*mx;vy=box(y*y)-my*my;cv=box(x*y)-mx*my
    C1,C2=6.5025,58.5225; return float((((2*mx*my+C1)*(2*cv+C2))/((mx*mx+my*my+C1)*(vx+vy+C2))).mean())
src=open('src/wonder/s3_light.js').read(); vals=sys.argv[1].split(','); ns=[int(x) for x in sys.argv[2].split(',')]
def sat(im):
    a=np.asarray(im.convert('RGB').resize((480,270))).astype(float); r,g,b=a[:,:,0],a[:,:,1],a[:,:,2]
    m=(((r>150)&(g<110)&(b<110))|((b>150)&(r>100)&(r<200)&(g<110))|((r>90)&(g<50)&(b<70))|((b>90)&(b<170)&(r>70)&(g<70))).astype(float); m=box(m,7); return m-m.mean()
def ncc(a,b): return float((a*b).sum()/np.sqrt((a*a).sum()*(b*b).sum()+1e-9))
refs=[sat(Image.open(f'ref/f/{n:04d}.jpg')) for n in ns]
for v in vals:
    open('src/wonder/s3_light.js','w').write(src.replace('__X__',v))
    shutil.rmtree('out/qa_C/o',ignore_errors=True)
    subprocess.run(['node','render.mjs','--song=wonder','--stills='+','.join(f'{(n-1)/24+1e-4:.5f}' for n in ns),'--out=out/qa_C/o'],capture_output=True)
    fs=sorted(glob.glob('out/qa_C/o/*.png'))
    sc=[ncc(r,sat(Image.open(f))) for r,f in zip(refs,fs)]
    print(v,' '.join('%.3f'%x for x in sc),'mean %.3f'%np.mean(sc),flush=True)
open('src/wonder/s3_light.js','w').write(src)
